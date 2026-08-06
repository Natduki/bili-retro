"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const RENDERER_PATH = path.join(ROOT, "homepage-renderer.js");
const rendererSource = fs.readFileSync(RENDERER_PATH, "utf8");

const assert = (condition, label) => {
  if (!condition) {
    throw new Error(`Elevator runtime test failed: ${label}`);
  }
};

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

  dispatch(type, init) {
    const event = Object.assign({ type, target: this, relatedTarget: null }, init || {});
    for (const entry of [...(this.listeners.get(type) || [])]) {
      entry.listener(event);
    }
  }

  listenerCount() {
    let count = 0;
    for (const entries of this.listeners.values()) count += entries.length;
    return count;
  }
}

class FakeElement extends FakeEventTarget {
  constructor(document, counters, rectProvider) {
    super();
    this.ownerDocument = document;
    this.counters = counters;
    this.attributes = new Map();
    this.classNames = new Set();
    this.rectProvider = rectProvider || (() => rect(0, 0, 0, 0));
    let top = "10px";
    this.style = {};
    Object.defineProperty(this.style, "top", {
      get: () => top,
      set: (value) => {
        top = String(value);
        this.counters.writes += 1;
        this.counters.topWrites += 1;
      }
    });
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

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  getBoundingClientRect() {
    return this.rectProvider();
  }

  contains(node) {
    return node === this;
  }
}

class FakeView extends FakeEventTarget {
  constructor(innerHeight, visualHeight) {
    super();
    this.innerHeight = innerHeight;
    this.visualViewport = visualHeight === undefined ? null : { height: visualHeight };
    this.scrollY = 0;
    this.nextFrameId = 1;
    this.frames = new Map();
    this.maxPendingFrames = 0;
    this.nextTimerId = 1;
    this.timers = new Map();
  }

  requestAnimationFrame(callback) {
    const id = this.nextFrameId++;
    this.frames.set(id, callback);
    this.maxPendingFrames = Math.max(this.maxPendingFrames, this.frames.size);
    return id;
  }

  cancelAnimationFrame(id) {
    this.frames.delete(id);
  }

  setTimeout(callback) {
    const id = this.nextTimerId++;
    this.timers.set(id, callback);
    return id;
  }

  clearTimeout(id) {
    this.timers.delete(id);
  }

  flushFrames(limit = 20) {
    let batches = 0;
    while (this.frames.size > 0) {
      batches += 1;
      assert(batches <= limit, "bounded requestAnimationFrame batches");
      const callbacks = [...this.frames.values()];
      this.frames.clear();
      for (const callback of callbacks) callback(0);
    }
    return batches;
  }

  scrollTo(options) {
    this.scrollY = Number(options && options.top) || 0;
  }
}

class FakeDocument extends FakeEventTarget {
  constructor(view) {
    super();
    this.defaultView = view;
    this.documentElement = { scrollTop: 0 };
  }
}

const rect = (left, top, width, height) => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
  width,
  height
});

const parseTop = (element) => {
  const value = Number.parseFloat(element.style.top);
  return Number.isFinite(value) ? value : 10;
};

const cleanupAll = (cleanups) => {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
};

const loadBindElevator = () => {
  const context = vm.createContext({ console, URL });
  context.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST__ = true;
  vm.runInContext(rendererSource, context, { filename: RENDERER_PATH });
  const api = context.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST_API__;
  assert(api && typeof api.bindElevator === "function", "renderer test hook exposes bindElevator");
  return api.bindElevator;
};

const bindElevator = loadBindElevator();

const createEnvironment = (options = {}) => {
  const counters = { writes: 0, topWrites: 0, classWrites: 0, attributeWrites: 0 };
  const view = new FakeView(options.innerHeight || 639, options.visualHeight === undefined ? 639 : options.visualHeight);
  const document = new FakeDocument(view);
  const firstScreenDocumentTop = options.firstScreenDocumentTop === undefined ? 279 : options.firstScreenDocumentTop;
  const elevatorLeft = options.elevatorLeft === undefined ? 1400 : options.elevatorLeft;
  const changeRectValue = options.changeRect || rect(1320, 330, 68, 24);
  const historyRectValue = options.historyRect || rect(0, 0, 0, 0);
  const footerRectValue = { current: options.footerRect || rect(0, 2000, 1900, 400) };
  const elevator = new FakeElement(document, counters);
  elevator.attributes.set("data-visible", "true");
  const geometry = () => {
    const effectiveHeight = Number.isFinite(Number(view.visualViewport && view.visualViewport.height))
      && Number(view.visualViewport.height) > 0
      ? Number(view.visualViewport.height)
      : view.innerHeight;
    const compact = effectiveHeight <= 700;
    const parentHeight = compact ? 538 : 644;
    const backHeight = compact ? 28 : 32;
    return { top: parseTop(elevator), parentHeight, backHeight };
  };
  elevator.rectProvider = () => {
    const current = geometry();
    return rect(elevatorLeft, current.top, 56, current.parentHeight);
  };
  const backTop = new FakeElement(document, counters, () => {
    const current = geometry();
    return rect(elevatorLeft - 1, current.top + current.parentHeight, 56, current.backHeight);
  });
  const sort = new FakeElement(document, counters);
  const mask = new FakeElement(document, counters);
  const buttons = Array.from({ length: 25 }, (_, index) => ({
    type: `floor-${index}`,
    button: new FakeElement(document, counters)
  }));
  const firstScreen = new FakeElement(document, counters, () => rect(202, firstScreenDocumentTop - view.scrollY, 1498, 300));
  const banner = new FakeElement(document, counters, () => rect(0, -view.scrollY, 1900, 155));
  const primary = new FakeElement(document, counters, () => rect(0, 155 - view.scrollY, 1900, 108));
  const change = new FakeElement(document, counters, () => changeRectValue);
  const footer = new FakeElement(document, counters, () => footerRectValue.current);
  const historyTrigger = new FakeElement(document, counters);
  historyTrigger.attributes.set("aria-label", "历史");
  const historyGroup = new FakeElement(document, counters);
  const historyPanel = new FakeElement(document, counters, () => historyRectValue);
  historyPanel.attributes.set("aria-hidden", options.historyVisible ? "false" : "true");
  const selectorMap = new Map([
    [".first-screen", firstScreen],
    [".bili-banner", banner],
    [".primary-menu-wrap", primary],
    [".change-btn", change]
  ]);
  const root = {
    ownerDocument: document,
    querySelector(selector) { return selectorMap.get(selector) || null; },
    querySelectorAll() { return []; }
  };
  const listenerCleanups = [];
  const elevatorView = { elevator, backTop, sort, mask, buttons };
  const popoverGroups = options.includeHistory === false ? [] : [{
    trigger: historyTrigger,
    group: historyGroup,
    panel: historyPanel
  }];
  counters.writes = 0;
  counters.topWrites = 0;
  counters.classWrites = 0;
  counters.attributeWrites = 0;
  return {
    counters,
    view,
    document,
    root,
    elevatorView,
    footer,
    footerRectValue,
    changeRectValue,
    historyPanel,
    popoverGroups,
    listenerCleanups,
    visualBottom() { return backTop.getBoundingClientRect().bottom; }
  };
};

const bind = (environment, isActive = () => true) => {
  bindElevator(
    environment.root,
    environment.elevatorView,
    environment.footer,
    environment.popoverGroups,
    environment.listenerCleanups,
    isActive
  );
};

const firstFrame = createEnvironment({ innerHeight: 639, visualHeight: 639 });
bind(firstFrame);
assert(firstFrame.view.frames.size === 1, "first frame schedules one layout rAF");
firstFrame.view.flushFrames();
assert(firstFrame.elevatorView.elevator.style.top === "279px", "page-top list-box aligns to first-screen top");
assert(firstFrame.elevatorView.elevator.getBoundingClientRect().left > firstFrame.changeRectValue.right, "elevator remains right of change button");
assert(firstFrame.elevatorView.elevator.getAttribute("data-density") === null, "639 first frame has no density override");
assert(firstFrame.visualBottom() === 845 && firstFrame.visualBottom() > firstFrame.view.innerHeight, "639 first frame keeps 20px floor geometry beyond viewport");

for (let index = 0; index < 6; index += 1) {
  firstFrame.view.scrollY = 900;
  firstFrame.document.documentElement.scrollTop = 900;
  firstFrame.view.dispatch(index % 2 === 0 ? "scroll" : "resize");
}
assert(firstFrame.view.frames.size <= 2, "scroll/resize rAF work is coalesced");
firstFrame.view.flushFrames();
assert(firstFrame.elevatorView.elevator.getAttribute("data-density") === null, "content scroll removes first-screen density");
assert(firstFrame.elevatorView.elevator.style.top === "36.5px", "content uses current compact centered geometry");
assert(firstFrame.visualBottom() === 602.5 && firstFrame.visualBottom() <= 629, "content keeps centered 20px-floor full-visibility geometry");
assert(firstFrame.view.frames.size === 0, "rAF queue drains without repetition");

firstFrame.footerRectValue.current = rect(1380, 580, 300, 300);
firstFrame.view.dispatch("resize");
firstFrame.view.flushFrames();
assert(firstFrame.elevatorView.elevator.classList.contains("is-footer-hidden"), "footer overlap still hides elevator");
firstFrame.footerRectValue.current = rect(0, 2000, 1900, 400);
firstFrame.view.dispatch("resize");
firstFrame.view.flushFrames();
assert(!firstFrame.elevatorView.elevator.classList.contains("is-footer-hidden"), "footer separation restores elevator");

const collision = createEnvironment({
  innerHeight: 1200,
  visualHeight: 1200,
  changeRect: rect(1390, 260, 40, 40),
  historyRect: rect(1390, 200, 60, 150),
  historyVisible: true
});
bind(collision);
collision.view.flushFrames();
assert(collision.elevatorView.elevator.style.top === "362px", "change and history collision branches adjust initial nextTop");
assert(collision.elevatorView.elevator.getAttribute("data-density") === null, "higher viewport remains non-tight");
assert(Number.isFinite(collision.visualBottom()), "higher viewport geometry stays finite");

const lowViewport = createEnvironment({ innerHeight: 300, visualHeight: 300 });
bind(lowViewport);
lowViewport.view.flushFrames();
assert(lowViewport.elevatorView.elevator.getAttribute("data-density") === null, "low viewport has no density override");
assert(lowViewport.elevatorView.elevator.style.top === "279px", "low first-screen anchor stays collision-safe");
assert(Number.isFinite(lowViewport.visualBottom()), "low viewport visual bottom stays finite");

const fallbackViewport = createEnvironment({ innerHeight: 639, visualHeight: Number.NaN });
bind(fallbackViewport);
fallbackViewport.view.flushFrames();
assert(fallbackViewport.elevatorView.elevator.style.top === "279px", "invalid visualViewport height falls back to innerHeight");
assert(fallbackViewport.visualBottom() === 845, "fallback viewport preserves 20px geometry");

const inactive = createEnvironment({ innerHeight: 639, visualHeight: 639 });
bind(inactive, () => false);
assert(inactive.view.frames.size === 0, "inactive renderer schedules no layout frame");
assert(inactive.counters.writes === 0, "inactive renderer performs no DOM/style writes");

firstFrame.view.dispatch("scroll");
assert(firstFrame.view.frames.size <= 2, "cleanup setup has bounded pending frames");
const scrollAdds = firstFrame.view.addedListeners.filter((entry) => entry.type === "scroll");
assert(scrollAdds.length === 2 && scrollAdds.every((entry) => entry.options && entry.options.passive === true), "scroll listeners remain passive");
cleanupAll(firstFrame.listenerCleanups);
assert(firstFrame.view.frames.size === 0, "cleanup cancels pending layout and active-state frames");
assert(firstFrame.view.removeMismatches === 0 && firstFrame.document.removeMismatches === 0, "listener cleanup reuses original options identity");
assert(firstFrame.view.listenerCount() === 0 && firstFrame.document.listenerCount() === 0, "view and document listeners are removed");

assert(!/\belevatorVisualHeight\b/.test(rendererSource), "undefined legacy visual-height identifier is absent");
assert(!rendererSource.includes("first-screen-tight") && !rendererSource.includes("data-density"), "obsolete first-screen density rule and runtime selection are absent");
assert(/@media \(max-height: 700px\) \{\s*\.elevator \{[^}]*--elevator-floor-h: 20px;[^}]*--elevator-floor-font: 12px;[^}]*--elevator-sort-h: 28px;[^}]*--elevator-back-h: 28px;/s.test(rendererSource), "639 viewport keeps 20px floor and 12px font media tier");
assert(rendererSource.includes("bottom: nextTop + initialGeometry.visualHeight"), "candidate uses current initial geometry");
assert(rendererSource.includes(".elevator > .ear.bilifont[data-icon-glyph]"), "final scoped ear selector remains present");
assert(rendererSource.includes('"bili-icon_youdaohang_xiaodianshitianxian": Object.freeze({ codePoint: 0xE74F, fallbackClass: "icon-font-fallback--empty", fallbackText: "" })'), "elevator ear has no text fallback");
assert(rendererSource.includes("transform: translate(-50%, -100%)"), "ear remains attached above list-box frame");
assert(rendererSource.includes(".icon-font-fallback--text { color: #333; font-size: 12px; line-height: 8px; }"), "ear fallback geometry remains present");

console.log("elevator-layout-runtime: PASS");
