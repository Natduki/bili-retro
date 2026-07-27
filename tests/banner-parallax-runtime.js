"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const RENDERER_PATH = path.join(ROOT, "extension-b", "homepage-renderer.js");
const TEST_PATH = path.join(ROOT, "extension-b", "tests", "banner-parallax-runtime.js");
const rendererSource = fs.readFileSync(RENDERER_PATH, "utf8");
const testSource = fs.readFileSync(TEST_PATH, "utf8");

const assert = (condition, label) => {
  if (!condition) throw new Error(`Banner parallax runtime test failed: ${label}`);
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

  dispatch(type, init = {}) {
    const event = Object.assign({ type, target: this }, init);
    for (const entry of [...(this.listeners.get(type) || [])]) {
      event.currentTarget = this;
      entry.listener(event);
    }
    return event;
  }

  dispatchFromStoppedChild(type, target, init = {}) {
    const event = Object.assign({ type, target, cancelBubble: true }, init);
    for (const entry of [...(this.listeners.get(type) || [])]) {
      if (!entry.options || entry.options.capture !== true) { continue; }
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

class FakeStyle {
  constructor(counters, node) {
    this.values = new Map();
    this.counters = counters;
    this.node = node;
    for (const property of ["transform", "width", "height", "opacity", "filter"]) {
      Object.defineProperty(this, property, {
        configurable: true,
        enumerable: true,
        get: () => this.values.get(property) || "",
        set: (value) => {
          const next = String(value);
          this.values.set(property, next);
          this.counters.writes += 1;
          this.counters[property] += 1;
          this.counters.entries.push({ node: this.node, property, value: next });
        }
      });
    }
  }
}

class FakeMedia extends FakeEventTarget {
  constructor(document, counters, tagName) {
    super();
    this.ownerDocument = document;
    this.counters = counters;
    this.tagName = tagName;
    this.attributes = new Map();
    this.style = new FakeStyle(counters, this);
  }

  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  play() { return { catch() {} }; }
}

class FakeLayer {
  constructor(document, counters, media, index) {
    this.ownerDocument = document;
    this.counters = counters;
    this.media = media;
    this.index = index;
    this.attributes = new Map([
      ["data-scale", "1"], ["data-init-x", "0"], ["data-init-y", "0"],
      ["data-offset-x", index === 0 ? "100" : "0"], ["data-offset-y", "0"],
      ["data-rotate", "0"], ["data-blur", index === 1 ? "1" : "0"],
      ["data-opacity", index === 2 ? "0.5" : "1"]
    ]);
  }

  querySelector(selector) { return selector === "img, video" ? this.media : null; }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
}

class FakeBanner extends FakeEventTarget {
  constructor(document, counters, width = 1000, height = 180) {
    super();
    this.ownerDocument = document;
    this.counters = counters;
    this.clientWidth = width;
    this.clientHeight = height;
    this.left = 0;
    this.top = 0;
    this.layers = [];
  }

  querySelectorAll(selector) {
    return selector === ".animated-banner > .banner-layer-item" ? this.layers : [];
  }

  getBoundingClientRect() {
    return {
      left: this.left,
      top: this.top,
      right: this.left + this.clientWidth,
      bottom: this.top + this.clientHeight,
      width: this.clientWidth,
      height: this.clientHeight
    };
  }
}

class FakeView extends FakeEventTarget {
  constructor() {
    super();
    this.nextFrameId = 1;
    this.frames = new Map();
    this.now = 0;
    this.performance = { now: () => this.now };
  }

  requestAnimationFrame(callback) {
    const id = this.nextFrameId++;
    this.frames.set(id, callback);
    return id;
  }

  cancelAnimationFrame(id) { this.frames.delete(id); }

  flushOne(now) {
    if (this.frames.size === 0) return false;
    const [id, callback] = this.frames.entries().next().value;
    this.frames.delete(id);
    this.now = now === undefined ? this.now : now;
    callback(this.now);
    return true;
  }
}

class FakeDocument extends FakeEventTarget {
  constructor(view) {
    super();
    this.defaultView = view;
  }
}

const resetCounters = (counters) => {
  counters.writes = 0;
  counters.transform = 0;
  counters.width = 0;
  counters.height = 0;
  counters.opacity = 0;
  counters.filter = 0;
  counters.entries = [];
};

const cleanupAll = (cleanups) => {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
};

const transformX = (media) => {
  const match = /^translate3d\(([-+0-9.]+)px,/.exec(media.style.transform);
  return match ? Number(match[1]) : Number.NaN;
};

const createEnvironment = (width = 1000) => {
  const counters = { writes: 0, transform: 0, width: 0, height: 0, opacity: 0, filter: 0, entries: [] };
  const view = new FakeView();
  const document = new FakeDocument(view);
  const banner = new FakeBanner(document, counters, width);
  const media = [];
  for (let index = 0; index < 18; index += 1) {
    const node = new FakeMedia(document, counters, index === 17 ? "VIDEO" : "IMG");
    node.setAttribute("data-width", "1920");
    node.setAttribute("data-height", "180");
    media.push(node);
    banner.layers.push(new FakeLayer(document, counters, node, index));
  }
  const root = { ownerDocument: document };
  const cleanups = [];
  let active = true;
  return {
    counters, view, document, root, banner, media, cleanups,
    get active() { return active; },
    set active(value) { active = value; },
    bind(bindBannerParallax) {
      bindBannerParallax(root, banner, cleanups, () => active);
      resetCounters(counters);
    }
  };
};

const loadBindBannerParallax = () => {
  const context = vm.createContext({ console });
  context.__EXTENSION_B_BANNER_PARALLAX_RUNTIME_TEST__ = true;
  vm.runInContext(rendererSource, context, { filename: RENDERER_PATH });
  const api = context.__EXTENSION_B_BANNER_PARALLAX_RUNTIME_TEST_API__;
  assert(api && typeof api.bindBannerParallax === "function", "private VM hook exposes production bindBannerParallax");
  return api.bindBannerParallax;
};

const bindBannerParallax = loadBindBannerParallax();
const environment = createEnvironment();
environment.bind(bindBannerParallax);
assert(environment.media.length === 18, "production hook binds all 18 media layers");
assert(/\.animated-banner > \.banner-layer-item img, \.animated-banner > \.banner-layer-item video \{[^}]*will-change: transform;[^}]*\}/s.test(rendererSource), "all banner media have stable transform promotion");
assert(!/\.animated-banner > \.banner-layer-item img, \.animated-banner > \.banner-layer-item video \{[^}]*will-change: auto/s.test(rendererSource), "banner media no longer use will-change auto");
const documentMoveListeners = environment.document.addedListeners.filter((entry) => entry.type === "pointermove");
const documentMouseListeners = environment.document.addedListeners.filter((entry) => entry.type === "mousemove");
assert(documentMoveListeners.length === 1, "one document-level pointermove listener");
assert(documentMoveListeners[0].options && documentMoveListeners[0].options.passive === true && documentMoveListeners[0].options.capture === true, "document pointermove is passive capture");
assert(documentMouseListeners.length === 1, "one document-level mousemove listener");
assert(documentMouseListeners[0].options && documentMouseListeners[0].options.passive === true && documentMouseListeners[0].options.capture === true, "document mousemove is passive capture");
assert(documentMoveListeners[0].options === documentMouseListeners[0].options, "both document move listeners share one options object");
assert(environment.banner.addedListeners.filter((entry) => entry.type === "pointermove").length === 0 && environment.banner.addedListeners.filter((entry) => entry.type === "mousemove").length === 0 && environment.view.listeners.get("pointermove") === undefined, "no duplicate banner/window move listener");

const mouseOnly = createEnvironment();
mouseOnly.bind(bindBannerParallax);
mouseOnly.document.dispatch("mousemove", { target: mouseOnly.banner, clientX: 500, clientY: 60 });
mouseOnly.document.dispatch("mousemove", { target: mouseOnly.banner, clientX: 520, clientY: 60 });
assert(mouseOnly.view.frames.size === 1, "mouse-only input schedules one move rAF");
mouseOnly.view.flushOne(16);
assert(Math.abs(transformX(mouseOnly.media[0]) - (20 / 1000) * (180 / 155) * 100) < 0.000001, "mouse-only input animates Banner");

const pointerOnly = createEnvironment();
pointerOnly.bind(bindBannerParallax);
pointerOnly.document.dispatch("pointermove", { target: pointerOnly.banner, clientX: 500, clientY: 60 });
pointerOnly.document.dispatch("pointermove", { target: pointerOnly.banner, clientX: 520, clientY: 60 });
assert(pointerOnly.view.frames.size === 1, "pointer-only input schedules one move rAF");
pointerOnly.view.flushOne(16);
assert(Math.abs(transformX(pointerOnly.media[0]) - (20 / 1000) * (180 / 155) * 100) < 0.000001, "pointer-only input animates Banner");

const mountedAfterBind = createEnvironment(0);
mountedAfterBind.bind(bindBannerParallax);
mountedAfterBind.banner.clientWidth = 1000;
mountedAfterBind.document.dispatch("pointermove", { target: mountedAfterBind.banner, clientX: 500, clientY: 60 });
mountedAfterBind.document.dispatch("pointermove", { target: mountedAfterBind.banner, clientX: 520, clientY: 60 });
mountedAfterBind.view.flushOne(16);
assert(Math.abs(transformX(mountedAfterBind.media[0]) - (20 / 1000) * (180 / 155) * 100) < 0.000001, "late-mounted banner measures on first real pointer input");

environment.document.dispatch("mousemove", { target: environment.banner, clientX: 500, clientY: 60 });
environment.document.dispatch("pointermove", { target: environment.banner, clientX: 545, clientY: 60 });
environment.document.dispatch("mousemove", { target: environment.banner, clientX: 520, clientY: 60 });
assert(environment.view.frames.size === 1, "same-frame mixed burst schedules at most one move rAF");
environment.view.flushOne(16);
assert(environment.counters.entries.length > 0 && environment.counters.entries.every((entry) => entry.property === "transform"), "move frame writes transform only");
assert(Math.abs(transformX(environment.media[0]) - (20 / 1000) * (180 / 155) * 100) < 0.000001, "latest mixed-input coordinate wins before move frame");
assert(environment.counters.opacity === 0 && environment.counters.filter === 0, "move frame does not write opacity or filter");

const headerOverlay = { role: "header-overlay" };
environment.document.dispatchFromStoppedChild("pointermove", headerOverlay, { clientX: 560, clientY: 40 });
assert(environment.view.frames.size === 1, "stopped-bubbling header overlay movement reaches document capture handler");
environment.view.flushOne(32);
assert(Math.abs(transformX(environment.media[0]) - (60 / 1000) * (180 / 155) * 100) < 0.000001, "header overlay pointer updates parallax inside banner rect");

environment.document.dispatch("pointermove", { target: environment.document, clientX: 560, clientY: 240 });
assert(environment.view.frames.size === 1, "outside-rect pointer schedules reset and cancels move rAF");
const resetStartTransform = environment.media[0].style.transform;
environment.view.flushOne(100);
assert(environment.media[0].style.transform !== resetStartTransform && environment.counters.entries.every((entry) => entry.property === "transform"), "reset easing writes transform only");
assert(environment.view.frames.size === 1, "reset easing remains scheduled until completion");
environment.view.flushOne(240);
assert(environment.view.frames.size === 0 && environment.media[0].style.transform.includes("0px"), "reset reaches zero and clears its frame");

environment.document.dispatch("pointermove", { target: environment.banner, clientX: 500, clientY: 60 });
environment.document.dispatch("pointermove", { target: environment.banner, clientX: 530, clientY: 60 });
environment.view.flushOne(300);
environment.document.dispatch("pointermove", { target: environment.document, clientX: 530, clientY: 240 });
assert(environment.view.frames.size === 1, "second reset is pending");
environment.document.dispatch("pointermove", { target: headerOverlay, clientX: 540, clientY: 60 });
environment.document.dispatch("pointermove", { target: headerOverlay, clientX: 580, clientY: 60 });
assert(environment.view.frames.size === 1, "new move cancels reset and schedules one move frame");
environment.view.flushOne(316);
assert(Math.abs(transformX(environment.media[0]) - (40 / 1000) * (180 / 155) * 100) < 0.000001, "new move resumes parallax after reset cancellation");

environment.document.dispatch("pointerleave", { target: environment.document });
assert(environment.view.frames.size === 1, "document pointerleave resets parallax");
environment.view.flushOne(420);
environment.view.flushOne(520);
assert(environment.view.frames.size === 0 && environment.media[0].style.transform.includes("0px"), "document pointerleave reset completes");

environment.document.dispatch("pointermove", { target: headerOverlay, clientX: 500, clientY: 60 });
environment.document.dispatch("pointermove", { target: headerOverlay, clientX: 530, clientY: 60 });
environment.view.flushOne(540);
environment.view.dispatch("blur", {});
assert(environment.view.frames.size === 1, "window blur resets parallax");
environment.view.flushOne(650);
environment.view.flushOne(760);
assert(environment.view.frames.size === 0 && environment.media[0].style.transform.includes("0px"), "window blur reset completes");

resetCounters(environment.counters);
environment.view.dispatch("resize", {});
environment.view.dispatch("resize", {});
assert(environment.view.frames.size === 1, "resize burst is coalesced");
environment.view.flushOne(400);
assert(environment.counters.width === 18 && environment.counters.height === 18, "resize updates all media dimensions");
assert(environment.counters.opacity === 18 && environment.counters.filter === 18, "opacity/filter are written on init/resize only");

const zeroWidth = createEnvironment(0);
zeroWidth.bind(bindBannerParallax);
zeroWidth.document.dispatch("pointermove", { target: zeroWidth.banner, clientX: 0, clientY: 60 });
zeroWidth.document.dispatch("pointermove", { target: zeroWidth.banner, clientX: 0, clientY: 60 });
assert(zeroWidth.view.frames.size === 1, "zero-width banner still coalesces move frame");
zeroWidth.view.flushOne(16);
assert(!zeroWidth.media.some((node) => /NaN|Infinity/.test(node.style.transform)), "zero-width banner never writes invalid transform");

const inactive = createEnvironment();
inactive.bind(bindBannerParallax);
inactive.document.dispatch("pointermove", { target: inactive.banner, clientX: 500, clientY: 60 });
inactive.document.dispatch("pointermove", { target: headerOverlay, clientX: 540, clientY: 60 });
inactive.document.dispatch("pointermove", { target: inactive.document, clientX: 540, clientY: 240 });
inactive.view.dispatch("resize", {});
const lateCallbacks = [...inactive.view.frames.values()];
inactive.active = false;
cleanupAll(inactive.cleanups);
const afterCleanupWrites = inactive.counters.writes;
assert(inactive.view.frames.size === 0, "cleanup cancels all pending banner frames");
for (const callback of lateCallbacks) callback(500);
inactive.document.dispatch("pointermove", { target: inactive.banner, clientX: 600, clientY: 60 });
inactive.document.dispatch("mousemove", { target: inactive.banner, clientX: 600, clientY: 60 });
inactive.document.dispatch("pointerleave", { target: inactive.document });
inactive.document.dispatch("mouseleave", { target: inactive.document });
inactive.view.dispatch("resize", {});
inactive.view.dispatch("blur", {});
assert(inactive.counters.writes === afterCleanupWrites, "inactive and late callbacks are zero-write");
assert(inactive.banner.listenerCount() === 0 && inactive.view.listenerCount() === 0 && inactive.document.listenerCount() === 0, "cleanup removes banner/view/document listeners");
assert(inactive.view.frames.size === 0, "late inactive events do not schedule frames");
assert(inactive.banner.removeMismatches === 0 && inactive.view.removeMismatches === 0 && inactive.document.removeMismatches === 0, "banner cleanup preserves options identity");
assert(inactive.document.removedListeners.filter((entry) => entry.type === "pointermove").length === 1 && inactive.document.removedListeners.filter((entry) => entry.type === "mousemove").length === 1, "cleanup removes both document move listeners");
const removedPointerMove = inactive.document.removedListeners.find((entry) => entry.type === "pointermove");
const removedMouseMove = inactive.document.removedListeners.find((entry) => entry.type === "mousemove");
assert(removedPointerMove.options === removedMouseMove.options && removedPointerMove.options === inactive.document.addedListeners.find((entry) => entry.type === "pointermove").options, "cleanup reuses the shared move options identity");

const bindStart = rendererSource.indexOf("const bindBannerParallax =");
const bindEnd = rendererSource.indexOf("const createPrimaryMenu =", bindStart);
const bindSource = rendererSource.slice(bindStart, bindEnd);
assert((rendererSource.match(/const bindBannerParallax =/g) || []).length === 1, "no duplicate production banner hook");
assert((bindSource.match(/addListenerWithCleanup\(doc, "pointermove"/g) || []).length === 1, "one production document pointer listener");
assert((bindSource.match(/addListenerWithCleanup\(doc, "mousemove"/g) || []).length === 1, "one production document mouse listener");
assert((bindSource.match(/addListenerWithCleanup\(banner, "pointermove"/g) || []).length === 0, "no duplicate banner-local pointer listener");
assert((bindSource.match(/addListenerWithCleanup\(banner, "mousemove"/g) || []).length === 0, "no duplicate banner-local mouse listener");
assert(/const moveListenerOptions = \{ passive: true, capture: true \};/.test(bindSource), "production document move listeners use passive capture options");
assert(testSource.includes('mouse-only input animates') && testSource.includes('pointer-only input animates') && testSource.includes('same-frame mixed burst'), "test covers mouse, pointer, and mixed input");

console.log("banner-parallax-runtime: PASS");
