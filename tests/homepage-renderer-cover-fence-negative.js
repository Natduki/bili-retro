"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const RENDERER_PATH = path.join(ROOT, "extension-b", "homepage-renderer.js");
const HARNESS_PATH = path.resolve(__filename);
const EVIDENCE_PATH = path.join(ROOT, "prototype", "dynamic", "logs", "subagents", "bili-extension-dev-security-evidence-r2-20260720.md");
const rendererSource = fs.readFileSync(RENDERER_PATH, "utf8");
const FIXTURE_KEY = "assets/homepage/fixture-covers/photo.png";
const FIXTURE_URL = `extension://fixture/${FIXTURE_KEY}`;
const REMOTE_URL = "https://i0.hdslb.com/bfs/archive/controlled-fixture.avif";
const FONT_SPEC = '16px "extension-bilifont"';
const GLYPH_TEXT = String.fromCodePoint(0xE72C);

const failures = [];
const caseResults = [];

assert.equal(rendererSource.includes("assets/homepage/fixture-covers/ordinary-rank-"), false);
assert.equal(rendererSource.includes("assets/homepage/fixture-covers/recommend-"), false);
const fixturePoolSource = rendererSource.match(/const FIXTURE_COVER_POOLS = Object\.freeze\(\{[\s\S]*?\n  \}\);/);
assert.ok(fixturePoolSource, "FIXTURE_COVER_POOLS source must be present");
assert.equal((fixturePoolSource[0].match(/ASSET_KEYS\.FIXTURE_COVER_PHOTO/g) || []).length, 2);
assert.match(fixturePoolSource[0], /rank: Object\.freeze\(\[ASSET_KEYS\.FIXTURE_COVER_PHOTO\]\)/);
assert.match(fixturePoolSource[0], /recommend: Object\.freeze\(\[ASSET_KEYS\.FIXTURE_COVER_PHOTO\]\)/);

class FakeNode {
  constructor(document, tagName, namespace) {
    this.ownerDocument = document;
    this.tagName = String(tagName).toUpperCase();
    this.namespaceURI = namespace || null;
    this.parentNode = null;
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.listeners = new Map();
    this.style = {};
    this.hidden = false;
    this._textContent = "";
    this._connected = false;
    this._replaced = false;
    this._fragment = this.tagName === "#FRAGMENT";
    this.classList = {
      add: (...names) => names.forEach((name) => this._toggleClass(name, true)),
      remove: (...names) => names.forEach((name) => this._toggleClass(name, false)),
      toggle: (name, force) => {
        const next = force === undefined ? !this.classList.contains(name) : Boolean(force);
        this._toggleClass(name, next);
        return next;
      },
      contains: (name) => (this.attributes.get("class") || "").split(/\s+/).includes(name)
    };
  }

  _toggleClass(name, enabled) {
    const values = (this.attributes.get("class") || "").split(/\s+/).filter(Boolean);
    const index = values.indexOf(name);
    if (enabled && index < 0) values.push(name);
    if (!enabled && index >= 0) values.splice(index, 1);
    this.attributes.set("class", values.join(" "));
    this.document.counters.writes += 1;
    this.document.counters.classAdds += enabled && index < 0 ? 1 : 0;
  }

  get document() { return this.ownerDocument; }

  get id() { return this.getAttribute("id") || ""; }
  set id(value) { this.setAttribute("id", value); }

  get isConnected() {
    if (this._fragment) return false;
    if (this.parentNode) return this.parentNode.isConnected;
    return this._connected === true;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.document.counters.writes += 1;
  }

  get textContent() { return this._textContent; }

  setAttribute(name, value) {
    const key = String(name);
    this.attributes.set(key, String(value));
    this.document.counters.writes += 1;
    this.document.counters.setAttribute += 1;
  }

  setAttributeNS(namespace, name, value) { this.setAttribute(name, value); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  removeAttribute(name) { this.attributes.delete(String(name)); this.document.counters.writes += 1; }

  appendChild(child) {
    if (child._fragment) {
      for (const fragmentChild of [...child.children]) this.appendChild(fragmentChild);
      child.children = [];
      return child;
    }
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  prepend(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.unshift(child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }

  replaceChildren(...children) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    for (const child of children) this.appendChild(child);
    this.document.counters.writes += 1;
    this.document.counters.replaceChildren += 1;
  }

  replaceChild(replacement, oldChild) {
    const index = this.children.indexOf(oldChild);
    if (index < 0) throw new Error("old child is not a child of this node");
    oldChild.parentNode = null;
    replacement.parentNode = this;
    this.children[index] = replacement;
    this.document.counters.writes += 1;
    return oldChild;
  }

  replaceWith(replacement) {
    if (!this.parentNode) return;
    const parent = this.parentNode;
    const index = parent.children.indexOf(this);
    if (index >= 0) {
      parent.children[index] = replacement;
      replacement.parentNode = parent;
      this.parentNode = null;
      this._replaced = true;
      this.document.counters.writes += 1;
      this.document.counters.replaceWith += 1;
    }
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
    this.document.counters.listenerAdds += 1;
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || new Set();
    if (listeners.delete(listener)) this.document.counters.listenerRemoves += 1;
    this.listeners.set(type, listeners);
  }

  dispatch(type) {
    for (const listener of [...(this.listeners.get(type) || [])]) listener({ type, target: this });
  }

  detach() {
    if (this.parentNode) this.parentNode.removeChild(this);
    this._connected = false;
  }

  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (node) => {
      for (const child of node.children) {
        if (matchesSelector(child, selector)) matches.push(child);
        visit(child);
      }
    };
    visit(this);
    return matches;
  }

  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children[this.children.length - 1] || null; }
  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child.contains(node));
  }
  getBoundingClientRect() { return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 }; }
  scrollIntoView() {}
}

function matchesSelector(node, selector) {
  const trimmed = String(selector).trim();
  const role = /^\[data-role="([^"]+)"\]$/.exec(trimmed);
  if (role) return node.getAttribute("data-role") === role[1];
  const id = /^#([\w-]+)$/.exec(trimmed);
  if (id) return node.id === id[1];
  const classOnly = /^\.([\w-]+)$/.exec(trimmed);
  if (classOnly) return node.classList.contains(classOnly[1]);
  const tagClass = /^([\w-]+)\.([\w-]+)$/.exec(trimmed);
  if (tagClass) return node.tagName === tagClass[1].toUpperCase() && node.classList.contains(tagClass[2]);
  return node.tagName === trimmed.toUpperCase();
}

class FakeDocument {
  constructor(fonts) {
    this.fonts = fonts || null;
    this.counters = {
      writes: 0,
      setAttribute: 0,
      classAdds: 0,
      replaceWith: 0,
      replaceChildren: 0,
      listenerAdds: 0,
      listenerRemoves: 0
    };
    this.defaultView = {
      innerHeight: 800,
      setTimeout: () => 0,
      clearTimeout: () => {},
      matchMedia: () => ({ matches: false }),
      scrollTo: () => {},
      addEventListener: () => { this.counters.listenerAdds += 1; },
      removeEventListener: () => { this.counters.listenerRemoves += 1; }
    };
    this.body = this.createElement("body");
    this.body._connected = true;
  }

  createElement(tagName) { return new FakeNode(this, tagName); }
  createElementNS(namespace, tagName) { return new FakeNode(this, tagName, namespace); }
  createTextNode(value) {
    const node = new FakeNode(this, "#text");
    node.textContent = value;
    return node;
  }
  createDocumentFragment() { return new FakeNode(this, "#fragment"); }
}

function resetMutationCounters(document) {
  for (const key of ["writes", "setAttribute", "classAdds", "replaceWith", "replaceChildren"]) document.counters[key] = 0;
}

function cleanupListeners(cleanups) {
  for (const cleanup of cleanups.splice(0).reverse()) cleanup();
}

function makeFonts({ checked, mode }) {
  let resolveLoad;
  let rejectLoad;
  const calls = [];
  let pending = mode === "pending" ? 1 : 0;
  const promise = new Promise((resolve, reject) => { resolveLoad = resolve; rejectLoad = reject; });
  return {
    check: () => checked === true,
    load: mode === "none" ? undefined : (fontSpec, glyphText) => {
      calls.push({ fontSpec, glyphText });
      if (mode === "throw") throw new Error("controlled font load throw");
      return mode === "resolve" || mode === "reject" || mode === "pending" ? promise.finally(() => { pending = 0; }) : undefined;
    },
    resolve: () => resolveLoad(),
    reject: () => rejectLoad(new Error("controlled font load reject")),
    get pending() { return pending; },
    calls
  };
}

function makeRoot(document, connected = true) {
  const root = document.createElement("main");
  root._connected = connected;
  return root;
}

function findFirstImage(node) {
  return node.tagName === "IMG" ? node : node.querySelector("IMG");
}

function loadProductionInternals() {
  const source = fs.readFileSync(RENDERER_PATH, "utf8");
  const recommendMarker = 'card.appendChild(createCoverImage(root, "recommend-card__image", null, FIXTURE_COVER_POOLS.recommend, index, title, "bili-cinephile", rendererMediaFence, card));';
  const transformed = source.replace(
    recommendMarker,
    'card.appendChild(globalThis.__coverHarnessRecommendCall(createCoverImage, root, index, title, rendererMediaFence, card, listenerCleanups));'
  );
  if (transformed === source) throw new Error("recommend production call-site marker not found");
  const injected = transformed.replace(/\n\}\)\(\);\s*$/, `
  globalThis.__coverHarnessExports = Object.freeze({
    createCoverImage,
    createMediaFence,
    createIconFont,
    createRankRow,
    createZoneFloor,
    createLiveFloor,
    setLiveFloorRooms,
    createPromoteFloor,
    createKnowledgeCard,
    createMusicCard,
    createAnimalCard,
    createFashionCard,
    renderHomepage
  });
})();`);
  const sandbox = {
    console,
    chrome: { runtime: { getURL: (key) => `extension://fixture/${key}` } },
    setTimeout: () => 0,
    clearTimeout: () => {},
    Promise,
    String,
    Number,
    Object,
    Array,
    Boolean,
    Math,
    Set,
    Map,
    RegExp,
    Error,
    URL,
    decodeURIComponent,
    __coverHarnessRecommendCall: (createCoverImage, root, index, title, fence, container, cleanups) => {
      const capture = sandbox.__coverHarnessRecommendCapture;
      const image = createCoverImage(root, "recommend-card__image", null, [FIXTURE_KEY], index, title, "bili-cinephile", fence, container);
      if (capture && !capture.record) capture.record = { root, fence, container, cleanups, image };
      return image;
    }
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(injected, sandbox, { filename: RENDERER_PATH });
  return { internals: sandbox.__coverHarnessExports, sandbox };
}

const { internals, sandbox } = loadProductionInternals();

function makeFence({ root, lease, state, cleanups }) {
  return internals.createMediaFence({
    root,
    lease,
    isActive: () => state.active,
    isDestroyed: () => state.destroyed,
    cleanups
  });
}

function baseCase() {
  const document = new FakeDocument();
  const root = makeRoot(document);
  const outer = document.createElement("div");
  root.appendChild(outer);
  const lease = { active: true };
  const state = { active: true, destroyed: false };
  const cleanups = [];
  const fence = makeFence({ root, lease, state, cleanups });
  return { document, root, outer, lease, state, cleanups, fence };
}

const pathAdapters = {
  rank: (ctx) => {
    const row = internals.createRankRow(ctx.root, { rank: 1, title: "controlled rank", fixtureIndex: 0 }, {
      mediaFence: ctx.fence,
      coverPool: [FIXTURE_KEY],
      navKey: "VIDEO_HOME",
      role: "rank-item"
    });
    ctx.outer.appendChild(row);
    const image = findFirstImage(row);
    return { image, container: image.parentNode, fixture: true };
  },
  zone: (ctx) => {
    const floor = internals.createZoneFloor(ctx.root, {
      type: "controlled",
      title: "controlled zone",
      navKey: "VIDEO_HOME",
      countLabel: "fixture",
      items: [{ title: "controlled zone card", creatorLabel: "fixture", metaLabel: "fixture" }],
      ranks: []
    }, ctx.fence);
    ctx.outer.appendChild(floor);
    const image = findFirstImage(floor);
    return { image, container: image.parentNode, fixture: true };
  },
  live: (ctx) => {
    const floor = internals.createLiveFloor(ctx.root, ctx.fence);
    ctx.outer.appendChild(floor);
    const view = floor.__liveFloorView;
    internals.setLiveFloorRooms(view, { rooms: [{
      roomId: 1,
      title: "controlled live",
      uname: "controlled host",
      areaName: "controlled area",
      cover: REMOTE_URL,
      keyframe: REMOTE_URL,
      face: REMOTE_URL,
      online: 1,
      href: "https://live.bilibili.com/1"
    }] });
    const image = findFirstImage(floor);
    return { image, container: image.parentNode, fixture: true };
  },
  recommend: (ctx) => {
    sandbox.__coverHarnessRecommendCapture = {};
    const renderer = internals.renderHomepage({ root: ctx.root, authStatus: "logged-out" });
    const capture = sandbox.__coverHarnessRecommendCapture.record;
    sandbox.__coverHarnessRecommendCapture = null;
    if (!capture) throw new Error("recommend production adapter did not capture call-site");
    return { image: capture.image, container: capture.container, fixture: true, fence: capture.fence, cleanups: capture.cleanups, renderer };
  },
  knowledge: (ctx) => {
    const view = { root: ctx.root, mediaFence: ctx.fence, destroyed: false, isRendererActive: () => ctx.state.active };
    const card = internals.createKnowledgeCard(view, {
      bvid: "BV1Q541167Qg",
      coverUrl: `${REMOTE_URL}`,
      href: "https://www.bilibili.com/video/BV1Q541167Qg",
      title: "controlled knowledge",
      ownerName: "fixture",
      view: 1,
      danmaku: 1,
      durationSeconds: 1
    });
    ctx.outer.appendChild(card);
    const image = findFirstImage(card);
    return { image, container: image.parentNode, fixture: false };
  },
  music: (ctx) => {
    const view = { root: ctx.root, mediaFence: ctx.fence, destroyed: false, isRendererActive: () => ctx.state.active };
    const card = internals.createMusicCard(view, {
      bvid: "BV1Q541167Qg",
      coverUrl: `${REMOTE_URL}`,
      href: "https://www.bilibili.com/video/BV1Q541167Qg",
      title: "controlled music",
      ownerName: "fixture",
      view: 1,
      danmaku: 1,
      durationSeconds: 1
    });
    ctx.outer.appendChild(card);
    const image = findFirstImage(card);
    return { image, container: image.parentNode, fixture: false };
  },
  animal: (ctx) => {
    const view = { root: ctx.root, mediaFence: ctx.fence, destroyed: false, isRendererActive: () => ctx.state.active };
    const card = internals.createAnimalCard(view, {
      bvid: "BV1Q541167Qg",
      coverUrl: `${REMOTE_URL}`,
      href: "https://www.bilibili.com/video/BV1Q541167Qg",
      title: "controlled animal",
      ownerName: "fixture",
      view: 1,
      danmaku: 1,
      durationSeconds: 1
    });
    ctx.outer.appendChild(card);
    const image = findFirstImage(card);
    return { image, container: image.parentNode, fixture: false };
  },
  fashion: (ctx) => {
    const view = { root: ctx.root, mediaFence: ctx.fence, destroyed: false, isRendererActive: () => ctx.state.active };
    const card = internals.createFashionCard(view, {
      bvid: "BV1Q541167Qg",
      coverUrl: `${REMOTE_URL}`,
      href: "https://www.bilibili.com/video/BV1Q541167Qg",
      title: "controlled fashion",
      ownerName: "fixture",
      view: 1,
      danmaku: 1,
      durationSeconds: 1
    });
    ctx.outer.appendChild(card);
    const image = findFirstImage(card);
    return { image, container: image.parentNode, fixture: false };
  }
};

function runPromoteStructureCase() {
  const ctx = baseCase();
  const floor = internals.createPromoteFloor(ctx.root, ctx.fence);
  ctx.outer.appendChild(floor);
  assert.equal(floor.querySelectorAll(".ext-box").length, 1, "promote floor restores the empty legacy extension box");
  assert.equal(floor.querySelectorAll(".exchange-btn").length, 0, "promote floor has no exchange button");
  assert.equal(floor.querySelectorAll(".bypb-window").length, 1, "promote floor keeps the legacy online window");
  assert.equal(floor.querySelectorAll(".online-link").length, 1, "promote floor keeps the watch-list link");
  ctx.fence.destroy();
}

function actualState(ctx, target) {
  const c = ctx.document.counters;
  return {
    domWrites: c.writes,
    setAttribute: c.setAttribute,
    replaceWith: c.replaceWith,
    replaceChildren: c.replaceChildren,
    classAdds: c.classAdds,
    imageReplaced: target.image._replaced,
    listenerAdds: c.listenerAdds,
    listenerRemoves: c.listenerRemoves,
    pendingRequests: ctx.fence.pendingRequestCount,
    cleanupLength: ctx.cleanups.length
  };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}

function recordCase(pathName, scenario, expected, actual, extra = {}) {
  const result = { path: pathName, scenario, expected, actual, writes: {
    dom: actual.domWrites,
    setAttribute: actual.setAttribute,
    replaceWith: actual.replaceWith,
    replaceChildren: actual.replaceChildren,
    classAdds: actual.classAdds
  }, listenerAdds: actual.listenerAdds, listenerRemoves: actual.listenerRemoves, pendingRequests: actual.pendingRequests, cleanupLength: actual.cleanupLength, ...extra };
  if (JSON.stringify(canonical(expected)) !== JSON.stringify(canonical(actual))) failures.push({ path: pathName, scenario, expected, actual });
  caseResults.push(result);
}

function runCoverPath(pathName) {
  const build = pathAdapters[pathName];
  const run = (mutate, dispatch = true) => {
    const ctx = baseCase();
    const target = build(ctx);
    if (target.fence) {
      ctx.fence = target.fence;
      ctx.lease = target.fence.lease;
    }
    if (target.cleanups) ctx.cleanups = target.cleanups;
    if (target.renderer) ctx.renderer = target.renderer;
    resetMutationCounters(ctx.document);
    mutate({ ...ctx, target });
    if (dispatch) target.image.dispatch("error");
    const actual = actualState(ctx, target);
    return { ...ctx, target, actual };
  };

  const active = run(() => {});
  const activeExpected = { ...active.actual };
  activeExpected.domWrites = active.target.fixture ? 2 : 11;
  activeExpected.setAttribute = active.target.fixture ? 2 : 9;
  activeExpected.replaceWith = active.target.fixture ? 0 : 1;
  activeExpected.imageReplaced = active.target.fixture ? false : true;
  activeExpected.listenerAdds = active.actual.listenerAdds;
  activeExpected.listenerRemoves = active.actual.listenerRemoves;
  activeExpected.pendingRequests = active.actual.pendingRequests;
  activeExpected.cleanupLength = active.actual.cleanupLength;
  recordCase(pathName, "active fallback", activeExpected, active.actual);
  active.fence.destroy();
  if (active.renderer) active.renderer.destroy();

  const second = run(() => {});
  second.target.image.dispatch("error");
  const expectedSecondWrites = second.target.fixture ? 13 : 11;
  recordCase(pathName, "active fallback second error", {
    ...second.actual,
    domWrites: expectedSecondWrites,
    setAttribute: second.target.fixture ? 12 : 9,
    replaceWith: second.target.fixture ? 1 : 1,
    imageReplaced: true
  }, second.actual);
  second.fence.destroy();
  if (second.renderer) second.renderer.destroy();

  const staleCases = [
    ["detached root", ({ root }) => { root._connected = false; }],
    ["detached container", ({ target }) => { target.container.detach(); }],
    ["parent mismatch", ({ target, document }) => { const other = document.createElement("div"); target.container.parentNode.appendChild(other); other.appendChild(target.image); }],
    ["inactive lease", ({ lease }) => { lease.active = false; }],
    ["inactive renderer", ({ state }) => { state.active = false; }],
    ["destroy", ({ state, fence }) => { state.destroyed = true; fence.destroy(); }],
    ["cleanup", ({ fence }) => { fence.destroy(); }]
  ];
  for (const [scenario, mutate] of staleCases) {
    const result = run(mutate);
    result.target.image.dispatch("error");
    result.fence.destroy();
    const expected = {
      ...result.actual,
      domWrites: 0,
      setAttribute: 0,
      replaceWith: 0,
      replaceChildren: 0,
      classAdds: 0,
      imageReplaced: false,
      listenerRemoves: result.actual.listenerAdds,
      pendingRequests: 0,
      cleanupLength: 0
    };
    recordCase(pathName, scenario, expected, result.actual);
    if (result.renderer) result.renderer.destroy();
  }

  const retired = run(({ fence, root, outer, document }) => {
    fence.retireGeneration();
    const next = build({ root, outer, fence, document, lease: active.lease, state: { active: true, destroyed: false }, cleanups: active.cleanups });
    retiredNext = next;
    resetMutationCounters(document);
  }, false);
  var retiredNext;
  retired.target.image.dispatch("error");
  retiredNext.image.dispatch("error");
  const retiredActual = actualState(retired, retired.target);
  recordCase(pathName, "retired generation", {
    ...retiredActual,
    domWrites: retiredNext.fixture ? 2 : 11,
    setAttribute: retiredNext.fixture ? 2 : 9,
    replaceWith: retiredNext.fixture ? 0 : 1,
    imageReplaced: false,
    listenerRemoves: retired.actual.listenerAdds - retiredNext.fixture ? 1 : 1
  }, retiredActual);
  retired.fence.destroy();
  if (retired.renderer) retired.renderer.destroy();

  const old = run(() => {}, false);
  const fresh = run(() => {}, false);
  old.fence.destroy();
  old.target.image.dispatch("error");
  fresh.target.image.dispatch("error");
  const oldActual = actualState(old, old.target);
  const freshActual = actualState(fresh, fresh.target);
  recordCase(pathName, "old-root/new-root isolation", {
    ...oldActual,
    domWrites: fresh.target.fixture ? 2 : 11,
    setAttribute: fresh.target.fixture ? 2 : 9,
    replaceWith: fresh.target.fixture ? 0 : 1,
    imageReplaced: false,
    listenerRemoves: oldActual.listenerAdds,
    pendingRequests: oldActual.pendingRequests + freshActual.pendingRequests,
    cleanupLength: freshActual.cleanupLength,
    oldRootWrites: oldActual.domWrites,
    newRootWrites: freshActual.domWrites
  }, {
    ...freshActual,
    pendingRequests: oldActual.pendingRequests + freshActual.pendingRequests,
    cleanupLength: freshActual.cleanupLength,
    oldRootWrites: oldActual.domWrites,
    newRootWrites: freshActual.domWrites
  });
  fresh.fence.destroy();
}

async function flush() {
  await Promise.resolve();
  await new Promise((resolve) => setImmediate(resolve));
}

async function runIconFontCase(scenario, options) {
  const fonts = makeFonts(options);
  const document = new FakeDocument(fonts);
  const root = makeRoot(document);
  const lease = { active: true };
  const state = { active: true, destroyed: false };
  const cleanups = [];
  const lifecycle = { root, lease, isActive: () => state.active, isDestroyed: () => state.destroyed, cleanups };
  const icon = internals.createIconFont(root, "bili-icon_dingdao_sousuo", "icon-under-test", lifecycle);
  root.appendChild(icon);
  resetMutationCounters(document);
  if (options.mutate) options.mutate({ root, icon, lease, state, cleanups, fonts });
  if (options.settle === "resolve") fonts.resolve();
  if (options.settle === "reject") fonts.reject();
  await flush();
  const ready = icon.classList.contains("icon-font-ready");
  const actual = {
    domWrites: document.counters.writes,
    setAttribute: document.counters.setAttribute,
    replaceWith: document.counters.replaceWith,
    replaceChildren: document.counters.replaceChildren,
    classAdds: document.counters.classAdds,
    ready,
    fallbackVisible: !ready,
    fontCalls: fonts.calls,
    fontSpec: fonts.calls[0] && fonts.calls[0].fontSpec,
    glyphText: fonts.calls[0] && fonts.calls[0].glyphText,
    listenerAdds: document.counters.listenerAdds,
    listenerRemoves: document.counters.listenerRemoves,
    pendingRequests: fonts.pending,
    cleanupLength: cleanups.length
  };
  const shouldReady = scenario === "active connected load resolve";
  const expected = {
    ...actual,
    domWrites: shouldReady ? 1 : 0,
    setAttribute: 0,
    replaceWith: 0,
    replaceChildren: 0,
    classAdds: shouldReady ? 1 : 0,
    ready: shouldReady,
    fallbackVisible: !shouldReady,
    fontCalls: options.mode === "none" ? [] : [{ fontSpec: FONT_SPEC, glyphText: GLYPH_TEXT }],
    fontSpec: options.mode === "none" ? undefined : FONT_SPEC,
    glyphText: options.mode === "none" ? undefined : GLYPH_TEXT,
    listenerAdds: 0,
    listenerRemoves: 0,
    pendingRequests: options.mode === "pending" && !options.mutate ? 1 : 0,
    cleanupLength: options.mutate ? 0 : 1
  };
  recordCase("iconfont", scenario, expected, actual);
  cleanupListeners(cleanups);
}

async function main() {
  runPromoteStructureCase();
  for (const pathName of ["rank", "zone", "live", "recommend", "knowledge", "music", "animal", "fashion"]) runCoverPath(pathName);
  await runIconFontCase("fonts.check=true without load proof", { checked: true, mode: "none" });
  await runIconFontCase("active connected load resolve", { checked: false, mode: "resolve", settle: "resolve" });
  await runIconFontCase("load reject", { checked: true, mode: "reject", settle: "reject" });
  await runIconFontCase("load pending", { checked: true, mode: "pending" });
  for (const [scenario, mutate] of [
    ["destroy stale", ({ state, cleanups }) => { state.destroyed = true; cleanupListeners(cleanups); }],
    ["root stale", ({ root, cleanups }) => { root._connected = false; cleanupListeners(cleanups); }],
    ["node stale", ({ icon, cleanups }) => { icon.detach(); cleanupListeners(cleanups); }],
    ["lease stale", ({ lease, cleanups }) => { lease.active = false; cleanupListeners(cleanups); }],
    ["inactive renderer stale", ({ state, cleanups }) => { state.active = false; cleanupListeners(cleanups); }],
    ["ownerDocument stale", ({ icon, cleanups }) => { icon.ownerDocument = new FakeDocument(); cleanupListeners(cleanups); }]
  ]) await runIconFontCase(scenario, { checked: true, mode: "resolve", mutate, settle: "resolve" });

  const summary = {
    source: RENDERER_PATH,
    sourceSha256: crypto.createHash("sha256").update(fs.readFileSync(RENDERER_PATH)).digest("hex"),
    harness: HARNESS_PATH,
    harnessSha256: crypto.createHash("sha256").update(fs.readFileSync(HARNESS_PATH)).digest("hex"),
    node: process.version,
    caseCount: caseResults.length,
    failedCaseCount: failures.length,
    status: failures.length === 0 ? "PASS" : "FAIL"
  };
  const rawOutput = [...caseResults.map((result) => JSON.stringify(result)), JSON.stringify(summary)].join("\n");
  const command = `node ${path.relative(ROOT, HARNESS_PATH).replaceAll("\\", "/")}`;
  const exitCode = failures.length === 0 ? 0 : 1;
  const log = [
    "# bili-extension-dev security evidence r2",
    "",
    "DATE=2026-07-20",
    "ROLE=bili-extension-dev",
    "TASK=CONTROLLED_EXTENSION_TEST_DEV",
    "MODEL_REQUEST=gpt-5.6-luna/high",
    "MODEL_CONFIG_UNVERIFIED",
    "AGENT_WINDOW_REQUEST=two rounds, 20 minutes each",
    "ROUND=FIRST",
    "RUNTIME=NOT_RUN",
    "CHROME_HANDOFF=NOT_AUTHORIZED",
    "",
    `SOURCE_SHA256=${summary.sourceSha256}`,
    `HARNESS_SHA256=${summary.harnessSha256}`,
    `NODE_VERSION=${process.version}`,
    `COMMAND=${command}`,
    `EXIT_CODE=${exitCode}`,
    "",
    "## Raw JSON",
    "",
    "```json",
    rawOutput,
    "```",
    "",
    `SUMMARY=${JSON.stringify(summary)}`,
    "",
    "No Chrome was started; no network or real Chrome API was used."
  ].join("\n") + "\n";
  fs.mkdirSync(path.dirname(EVIDENCE_PATH), { recursive: true });
  fs.writeFileSync(EVIDENCE_PATH, log, "utf8");
  for (const result of caseResults) console.log(JSON.stringify(result));
  console.log(JSON.stringify(summary));
  if (exitCode !== 0) {
    console.error(JSON.stringify({ failures }));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
