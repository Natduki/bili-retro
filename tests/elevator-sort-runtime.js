"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const RENDERER_PATH = path.join(ROOT, "extension-b", "homepage-renderer.js");
const TEST_PATH = path.join(ROOT, "extension-b", "tests", "elevator-sort-runtime.js");
const rendererSource = fs.readFileSync(RENDERER_PATH, "utf8");
const testSource = fs.readFileSync(TEST_PATH, "utf8");

const assert = (condition, label) => {
  if (!condition) throw new Error(`Elevator sort runtime test failed: ${label}`);
};

const rect = (left, top, width, height) => ({
  left, top, right: left + width, bottom: top + height, width, height
});

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
    this.addedListeners = [];
    this.removedListeners = [];
    this.removeMismatches = 0;
  }

  addEventListener(type, listener, options) {
    const entries = this.listeners.get(type) || [];
    entries.push({ listener, options });
    this.listeners.set(type, entries);
    this.addedListeners.push({ type, listener, options });
  }

  removeEventListener(type, listener, options) {
    const entries = this.listeners.get(type) || [];
    const index = entries.findIndex((entry) => entry.listener === listener && entry.options === options);
    if (index < 0) {
      this.removeMismatches += 1;
      return;
    }
    entries.splice(index, 1);
    this.listeners.set(type, entries);
    this.removedListeners.push({ type, listener, options });
  }

  dispatch(type, init = {}) {
    const event = Object.assign({ type, target: this, relatedTarget: null }, init);
    event.preventDefault = event.preventDefault || (() => { event.defaultPrevented = true; });
    event.stopPropagation = event.stopPropagation || (() => { event.propagationStopped = true; });
    for (const entry of [...(this.listeners.get(type) || [])]) {
      event.currentTarget = this;
      entry.listener(event);
    }
    return event;
  }

  listenerCount() {
    let count = 0;
    for (const entries of this.listeners.values()) count += entries.length;
    return count;
  }
}

const makeStyle = (counters) => {
  const values = new Map();
  const target = {
    setProperty(name, value) {
      const next = String(value);
      if (values.get(name) !== next) {
        values.set(name, next);
        counters.writes += 1;
        counters.styleWrites += 1;
      }
    },
    getPropertyValue(name) { return values.get(name) || ""; }
  };
  return new Proxy(target, {
    get(object, property) {
      if (property in object) return object[property];
      return values.get(property) || "";
    },
    set(object, property, value) {
      if (property === "setProperty") {
        object.setProperty = value;
        return true;
      }
      const next = String(value);
      if (values.get(property) !== next) {
        values.set(property, next);
        counters.writes += 1;
        counters.styleWrites += 1;
      }
      return true;
    }
  });
};

class FakeElement extends FakeEventTarget {
  constructor(document, counters, rectProvider = () => rect(0, 0, 0, 0), text = "") {
    super();
    this.ownerDocument = document;
    this.counters = counters;
    this.parentNode = null;
    this.children = [];
    this.attributes = new Map();
    this.classNames = new Set();
    this.rectProvider = rectProvider;
    this.textContent = text;
    this.offsetWidth = 54;
    this.offsetHeight = 24;
    this.style = makeStyle(counters);
    this.classList = {
      add: (...names) => names.forEach((name) => this.setClass(name, true)),
      remove: (...names) => names.forEach((name) => this.setClass(name, false)),
      contains: (name) => this.classNames.has(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !this.classNames.has(name) : Boolean(force);
        this.setClass(name, enabled);
        return enabled;
      }
    };
  }

  setClass(name, enabled) {
    const had = this.classNames.has(name);
    if (enabled) this.classNames.add(name);
    else this.classNames.delete(name);
    if (had !== enabled) {
      this.counters.writes += 1;
      this.counters.classWrites += 1;
    }
  }

  setAttribute(name, value) {
    const next = String(value);
    if (this.attributes.get(name) !== next) {
      this.attributes.set(name, next);
      if (name === "class") {
        this.classNames = new Set(next.split(/\s+/).filter(Boolean));
      }
      this.counters.writes += 1;
      this.counters.attributeWrites += 1;
    }
  }

  removeAttribute(name) {
    if (this.attributes.delete(name)) {
      this.counters.writes += 1;
      this.counters.attributeWrites += 1;
    }
  }

  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }

  appendChild(node) {
    if (node.parentNode) node.parentNode.removeChild(node);
    node.parentNode = this;
    this.children.push(node);
    this.counters.writes += 1;
    this.counters.domWrites += 1;
    return node;
  }

  insertBefore(node, reference) {
    if (node === reference) return node;
    if (node.parentNode) node.parentNode.removeChild(node);
    const index = reference ? this.children.indexOf(reference) : -1;
    node.parentNode = this;
    if (index < 0) this.children.push(node);
    else this.children.splice(index, 0, node);
    this.counters.writes += 1;
    this.counters.domWrites += 1;
    return node;
  }

  removeChild(node) {
    const index = this.children.indexOf(node);
    if (index >= 0) {
      this.children.splice(index, 1);
      node.parentNode = null;
      this.counters.writes += 1;
      this.counters.domWrites += 1;
    }
    return node;
  }

  get firstElementChild() { return this.children[0] || null; }
  get lastElementChild() { return this.children[this.children.length - 1] || null; }
  get nextElementSibling() {
    if (!this.parentNode) return null;
    const index = this.parentNode.children.indexOf(this);
    return index >= 0 ? this.parentNode.children[index + 1] || null : null;
  }

  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child.contains(node));
  }

  cloneNode(deep) {
    const copy = new FakeElement(this.ownerDocument, this.counters, this.rectProvider, this.textContent);
    for (const [name, value] of this.attributes) copy.attributes.set(name, value);
    copy.classNames = new Set(this.classNames);
    copy.offsetWidth = this.offsetWidth;
    copy.offsetHeight = this.offsetHeight;
    if (deep) for (const child of this.children) copy.appendChild(child.cloneNode(true));
    return copy;
  }

  getBoundingClientRect() { return this.rectProvider(); }
  scrollIntoView(options) { this.scrollRequest = options; this.counters.scrollWrites += 1; }
}

class FakeView extends FakeEventTarget {
  constructor() {
    super();
    this.innerHeight = 900;
    this.visualViewport = { height: 900 };
    this.scrollY = 0;
    this.frames = new Map();
    this.timers = new Map();
    this.nextFrame = 1;
    this.nextTimer = 1;
    this.scrollCalls = [];
  }

  requestAnimationFrame(callback) {
    const id = this.nextFrame++;
    this.frames.set(id, callback);
    return id;
  }

  cancelAnimationFrame(id) { this.frames.delete(id); }
  setTimeout(callback) { const id = this.nextTimer++; this.timers.set(id, callback); return id; }
  clearTimeout(id) { this.timers.delete(id); }
  scrollTo(options) { this.scrollY = Number(options.top) || 0; this.scrollCalls.push(options); }

  flush() {
    while (this.frames.size || this.timers.size) {
      const frames = [...this.frames.values()];
      this.frames.clear();
      for (const callback of frames) callback(0);
      const timers = [...this.timers.values()];
      this.timers.clear();
      for (const callback of timers) callback();
    }
  }
}

class FakeDocument extends FakeEventTarget {
  constructor(view, counters) {
    super();
    this.defaultView = view;
    this.documentElement = { scrollTop: 0 };
    this.body = new FakeElement(this, counters);
    this.fonts = null;
  }

  createElement() { return new FakeElement(this, this.body.counters); }
}

const resetCounters = (counters) => {
  for (const key of Object.keys(counters)) counters[key] = 0;
};

const orderOf = (environment) => environment.floorList.children.map((node) => node.getAttribute("data-type"));
const cleanupAll = (environment) => {
  for (const cleanup of environment.cleanups.splice(0).reverse()) cleanup();
};
const pointer = (target, type, init) => target.dispatch(type, Object.assign({
  target,
  pointerId: 1,
  isPrimary: true,
  button: 0,
  clientX: 10,
  clientY: 110
}, init));

const loadBindElevator = () => {
  const context = vm.createContext({ console, URL });
  context.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST__ = true;
  vm.runInContext(rendererSource, context, { filename: RENDERER_PATH });
  const api = context.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST_API__;
  assert(api && typeof api.bindElevator === "function", "private VM hook exposes production bindElevator");
  return api.bindElevator;
};
const bindElevator = loadBindElevator();

const createEnvironment = () => {
  const counters = { writes: 0, domWrites: 0, styleWrites: 0, classWrites: 0, attributeWrites: 0, scrollWrites: 0 };
  const view = new FakeView();
  const document = new FakeDocument(view, counters);
  const bodyPage = new FakeElement(document, counters);
  document.body.appendChild(bodyPage);
  const floorTargets = [];
  const targetTops = new Map();
  const targetFor = (type) => {
    let target = floorTargets.find((entry) => entry.getAttribute("data-floor-id") === type);
    if (!target) {
      target = new FakeElement(document, counters, () => rect(0, targetTops.get(type) || 1000, 800, 100));
      target.setAttribute("data-floor-id", type);
      bodyPage.appendChild(target);
      floorTargets.push(target);
    }
    return target;
  };
  const elevator = new FakeElement(document, counters, () => rect(1400, 280, 56, 700));
  elevator.setAttribute("data-visible", "true");
  const floorList = new FakeElement(document, counters, () => rect(1400, 100, 54, 600));
  const mask = new FakeElement(document, counters);
  const sort = new FakeElement(document, counters);
  const backTop = new FakeElement(document, counters);
  const types = Array.from({ length: 25 }, (_, index) => `floor-${index}`);
  for (const [index, type] of types.entries()) {
    const button = new FakeElement(document, counters, () => {
      const currentIndex = floorList.children.indexOf(button);
      return rect(1400, 100 + currentIndex * 24, 54, 24);
    }, type);
    button.offsetWidth = 54;
    button.offsetHeight = 24;
    button.setAttribute("type", "button");
    button.setAttribute("data-role", "elevator-floor");
    button.setAttribute("data-type", type);
    floorList.appendChild(button);
    targetFor(type);
  }
  sort.setAttribute("data-role", "elevator-sort");
  backTop.setAttribute("data-role", "elevator-back-top");
  elevator.appendChild(mask);
  elevator.appendChild(floorList);
  elevator.appendChild(sort);
  elevator.appendChild(backTop);
  const firstScreen = new FakeElement(document, counters, () => rect(0, 279, 1300, 300));
  const banner = new FakeElement(document, counters, () => rect(0, 0, 1300, 155));
  const primary = new FakeElement(document, counters, () => rect(0, 155, 1300, 108));
  const change = new FakeElement(document, counters, () => rect(1200, 300, 60, 20));
  const root = new FakeElement(document, counters);
  const selectorMap = new Map([
    [".first-screen", firstScreen], [".bili-banner", banner], [".primary-menu-wrap", primary], [".change-btn", change]
  ]);
  root.querySelector = (selector) => {
    if (selector === '[data-role="elevator-floor-list"]') return floorList;
    const targetMatch = /^\[data-floor-id="([^"]+)"\]$/.exec(selector);
    if (targetMatch) return targetFor(targetMatch[1]);
    return selectorMap.get(selector) || null;
  };
  root.querySelectorAll = (selector) => selector === "[data-floor-id]" ? floorTargets : [];
  const buttons = floorList.children.map((button) => ({ type: button.getAttribute("data-type"), button }));
  const cleanups = [];
  let active = true;
  const environment = {
    counters, view, document, root, elevator, floorList, mask, sort, backTop, buttons, cleanups, bodyPage, floorTargets,
    targetTops, get active() { return active; }, set active(value) { active = value; },
    order: () => orderOf(environment),
    helper: () => root.children.find((node) => node.classNames.has("slicksort-selected")) || null,
    bind() {
      bindElevator(root, { elevator, floorList, buttons, backTop, sort, mask }, null, [], cleanups, () => active);
      view.flush();
      resetCounters(counters);
    }
  };
  return environment;
};

const env = createEnvironment();
env.bind();
const initialOrder = env.order();
const bodyFloorInitial = env.bodyPage.children.slice();
assert(initialOrder.length === 25 && initialOrder[0] === "floor-0" && initialOrder[24] === "floor-24", "default 25-item order and type mapping");
assert(!env.floorList.children.includes(env.sort) && !env.floorList.children.includes(env.backTop), "sort and back-top remain outside floor list");

env.buttons[3].button.dispatch("click", { target: env.buttons[3].button });
assert(env.floorTargets[3].scrollRequest && env.floorTargets[3].scrollRequest.behavior === "smooth", "idle floor click scrolls by type");
env.sort.dispatch("click", { target: env.sort });
assert(env.elevator.classList.contains("edit") && env.elevator.getAttribute("data-overlay-open") === "true", "sort enters edit");
assert(!env.buttons.some((entry) => entry.button.classList.contains("is-selected")), "edit clears active selection");
const editClickWrites = env.counters.writes;
env.buttons[2].button.dispatch("click", { target: env.buttons[2].button });
assert(env.counters.writes === editClickWrites, "edit floor click is a no-op");

const source = env.buttons[5].button;
const sourceTop = source.getBoundingClientRect().top;
const invalidCases = [
  { button: 2 }, { isPrimary: false }, { pointerId: Number.NaN }, { clientX: Number.NaN }, { clientY: Infinity }
];
for (const init of invalidCases) {
  const before = env.counters.writes;
  pointer(env.floorList, "pointerdown", Object.assign({ target: source, clientX: 10, clientY: sourceTop }, init));
  assert(env.counters.writes === before && !env.helper(), "invalid pointerdown has no side effects");
}
const wrapper = new FakeElement(env.document, env.counters);
const nested = new FakeElement(env.document, env.counters);
wrapper.appendChild(nested);
env.floorList.appendChild(wrapper);
const fencedBefore = env.counters.writes;
pointer(env.floorList, "pointerdown", { target: nested, clientX: 10, clientY: sourceTop });
assert(env.counters.writes === fencedBefore && !env.helper(), "non-floor direct child is fenced");
env.floorList.removeChild(wrapper);

pointer(env.floorList, "pointerdown", { target: source, pointerId: 11, clientX: 10, clientY: sourceTop });
pointer(env.elevator, "pointermove", { pointerId: 11, clientX: 13.99, clientY: sourceTop });
assert(!env.helper() && !source.classList.contains("is-dragging") && env.order().every((type, index) => type === initialOrder[index]), "3.99px Manhattan move stays armed");
assert(env.bodyPage.children.every((node, index) => node === bodyFloorInitial[index]), "sub-threshold move leaves body-floor order unchanged");
pointer(env.elevator, "pointercancel", { pointerId: 11, clientX: 13.99, clientY: sourceTop });

pointer(env.floorList, "pointerdown", { target: source, pointerId: 12, clientX: 10, clientY: sourceTop });
pointer(env.elevator, "pointermove", { pointerId: 12, clientX: 14, clientY: sourceTop });
assert(env.helper() && env.helper().parentNode === env.root, "4px creates root-owned helper");
assert(env.helper().getAttribute("class") === "item sortable slicksort-selected", "helper class is constrained");
assert(env.helper().style.position === "fixed" && env.helper().style.pointerEvents === "none", "helper fixed and non-interactive");
assert(env.helper().style.width === "54px" && env.helper().style.height === "24px" && env.helper().style.lineHeight === "24px", "helper uses source geometry");
assert(env.document.body.children.length === 1 && env.bodyPage.children.length === 25, "body and body-floor DOM are untouched");
assert(env.bodyPage.children.every((node, index) => node === bodyFloorInitial[index]), "body-floor order remains unchanged during drag");
pointer(env.elevator, "pointermove", { pointerId: 99, clientX: 14, clientY: 99 });
pointer(env.elevator, "pointerup", { pointerId: 99, clientX: 14, clientY: 99 });
assert(env.helper() && source.classList.contains("is-dragging"), "wrong pointerId is ignored");
pointer(env.elevator, "pointermove", { pointerId: 12, clientX: 14, clientY: 99 });
assert(env.order()[0] === "floor-5", "upward midpoint preview crosses multiple items");
pointer(env.elevator, "pointermove", { pointerId: 12, clientX: 14, clientY: 112 });
assert(env.order()[0] === "floor-5", "strict midpoint rule does not insert before equal midpoint");
pointer(env.elevator, "pointerup", { pointerId: 12, clientX: 14, clientY: 111 });
const committedOrder = env.order();
assert(!env.helper() && !source.classList.contains("is-dragging") && committedOrder[0] === "floor-5", "pointerup commits once and cleans helper");
const duplicateUpWrites = env.counters.writes;
pointer(env.elevator, "pointerup", { pointerId: 12, clientX: 14, clientY: 111 });
assert(env.counters.writes === duplicateUpWrites && env.order().join() === committedOrder.join(), "duplicate pointerup does not resubmit");

const committedSource = env.buttons[0].button;
pointer(env.floorList, "pointerdown", { target: committedSource, pointerId: 13, clientX: 10, clientY: committedSource.getBoundingClientRect().top });
pointer(env.elevator, "pointermove", { pointerId: 13, clientX: 14, clientY: 900 });
assert(env.order()[24] === "floor-0", "downward preview appends to the end");
pointer(env.elevator, "pointermove", { pointerId: 13, clientX: 14, clientY: 160 });
assert(env.order().indexOf("floor-0") > 0 && env.order().indexOf("floor-0") < 24, "same scan handles append then upward return");
pointer(env.elevator, "pointercancel", { pointerId: 13, clientX: 14, clientY: 160 });
assert(env.order().join() === committedOrder.join() && !env.helper(), "pointercancel restores committed order");

const closeWith = (closeAction, label) => {
  if (!env.elevator.classList.contains("edit")) env.sort.dispatch("click", { target: env.sort });
  const closeSource = env.buttons[1].button;
  const top = closeSource.getBoundingClientRect().top;
  pointer(env.floorList, "pointerdown", { target: closeSource, pointerId: 20, clientX: 10, clientY: top });
  pointer(env.elevator, "pointermove", { pointerId: 20, clientX: 14, clientY: 900 });
  assert(env.helper(), `${label} setup has unfinished drag`);
  closeAction();
  assert(!env.elevator.classList.contains("edit") && !env.helper() && env.order().join() === committedOrder.join(), `${label} cancels and restores before exit`);
};
closeWith(() => env.sort.dispatch("click", { target: env.sort }), "sort confirm");
closeWith(() => env.mask.dispatch("click", { target: env.mask }), "mask close");
closeWith(() => env.document.dispatch("keydown", { target: env.document, key: "Escape" }), "Escape close");
closeWith(() => env.document.dispatch("click", { target: new FakeElement(env.document, env.counters) }), "outside close");

env.sort.dispatch("click", { target: env.sort });
pointer(env.floorList, "pointerdown", { target: env.buttons[2].button, pointerId: 30, clientX: 10, clientY: env.buttons[2].button.getBoundingClientRect().top });
pointer(env.elevator, "pointermove", { pointerId: 30, clientX: 14, clientY: 900 });
pointer(env.elevator, "pointerup", { pointerId: 30, clientX: 14, clientY: 900 });
const sessionOrder = env.order();
env.sort.dispatch("click", { target: env.sort });
env.sort.dispatch("click", { target: env.sort });
assert(env.order().join() === sessionOrder.join(), "confirmed order persists within renderer session");
env.sort.dispatch("click", { target: env.sort });
env.buttons[2].button.dispatch("click", { target: env.buttons[2].button });
assert(env.floorTargets.find((target) => target.getAttribute("data-floor-id") === "floor-2").scrollRequest.behavior === "smooth", "reordered floor click remains type keyed");
env.backTop.dispatch("click", { target: env.backTop });
assert(env.view.scrollY === 0 && env.order().join() === sessionOrder.join(), "back-top does not change sort order");

const inactive = createEnvironment();
inactive.bind();
inactive.sort.dispatch("click", { target: inactive.sort });
const inactiveSource = inactive.buttons[4].button;
pointer(inactive.floorList, "pointerdown", { target: inactiveSource, pointerId: 40, clientX: 10, clientY: inactiveSource.getBoundingClientRect().top });
pointer(inactive.elevator, "pointermove", { pointerId: 40, clientX: 14, clientY: 900 });
assert(inactive.helper(), "inactive cleanup setup has helper");
inactive.active = false;
const beforeLateEvents = inactive.counters.writes;
pointer(inactive.elevator, "pointermove", { pointerId: 40, clientX: 20, clientY: 200 });
pointer(inactive.elevator, "pointerup", { pointerId: 40, clientX: 20, clientY: 200 });
pointer(inactive.elevator, "pointercancel", { pointerId: 40, clientX: 20, clientY: 200 });
assert(inactive.counters.writes === beforeLateEvents, "inactive late pointer events are zero-write");
cleanupAll(inactive);
const afterCleanup = inactive.counters.writes;
inactive.sort.dispatch("click", { target: inactive.sort });
pointer(inactive.elevator, "pointermove", { pointerId: 40, clientX: 20, clientY: 200 });
pointer(inactive.elevator, "pointerup", { pointerId: 40, clientX: 20, clientY: 200 });
pointer(inactive.elevator, "pointercancel", { pointerId: 40, clientX: 20, clientY: 200 });
inactive.view.flush();
assert(inactive.counters.writes === afterCleanup, "post-cleanup late events are zero-write");
assert(!inactive.helper() && inactive.elevator.listenerCount() === 0 && inactive.floorList.listenerCount() === 0, "cleanup removes helper and root-local pointer listeners");
assert(inactive.document.listenerCount() === 0 && inactive.view.listenerCount() === 0, "cleanup removes document/view listeners symmetrically");
assert(inactive.document.removeMismatches === 0 && inactive.view.removeMismatches === 0, "listener options identity is symmetric");

const forbidden = [
  ["local", "Storage"].join(""), ["session", "Storage"].join(""), ["chrome", ".", "storage"].join(""),
  ["post", "Message"].join(""), ["fetch", "("].join(""), ["XML", "Http", "Request"].join(""),
  ["Web", "Socket"].join(""), ["DOM", "Parser"].join(""), ["inner", "HTML"].join(""),
  ["outer", "HTML"].join(""), ["insertAdjacent", "HTML"].join(""), ["src", "doc"].join(""),
  ["eval", "("].join(""), ["Func", "tion", "("].join(""), ["setPointer", "Capture"].join("")
];
for (const token of forbidden) {
  assert(!rendererSource.includes(token) && !testSource.includes(token), `forbidden capability scan: ${token}`);
}
const bindStart = rendererSource.indexOf("const bindElevator =");
const bindEnd = rendererSource.indexOf("const renderHomepage =", bindStart);
const bindSource = rendererSource.slice(bindStart, bindEnd);
assert(!/\b(?:document|window|view)\.addEventListener\(\s*["']pointer/.test(bindSource), "bind has no global pointer listener");
assert(!/document\.body|\.body\.appendChild/.test(bindSource), "bind never owns helper through body");
assert(!rendererSource.includes(forbidden[0]) && !rendererSource.includes(forbidden[1]) && !rendererSource.includes(forbidden[2]), "no persistent storage capability");
const productionFiles = ["manifest.json", "content.js", "sw.js"].map((name) => fs.readFileSync(path.join(ROOT, "extension-b", name), "utf8"));
assert(productionFiles.every((source) => !source.includes("elevator-sort-runtime") && !source.includes("__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST__")), "manifest/content/sw remain unrelated to test hook");

console.log("elevator-sort-runtime: PASS");
