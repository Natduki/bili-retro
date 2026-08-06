"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const RENDERER_PATH = path.join(ROOT, "extension-b", "homepage-renderer.js");
const MANIFEST_PATH = path.join(ROOT, "extension-b", "manifest.json");
const rendererSource = fs.readFileSync(RENDERER_PATH, "utf8");
const DOWNLOAD_ASSET_DIR = path.join(ROOT, "extension-b", "assets", "homepage", "mini-header-popovers", "download");
const DOWNLOAD_QR_PATH = path.join(DOWNLOAD_ASSET_DIR, "client-download-qr.png");
const DOWNLOAD_PINK_PATH = path.join(DOWNLOAD_ASSET_DIR, "pink-download.svg");
const DOWNLOAD_QR_KEY = "assets/homepage/mini-header-popovers/download/client-download-qr.png";
const DOWNLOAD_PINK_KEY = "assets/homepage/mini-header-popovers/download/pink-download.svg";
const SEARCH_MARK_KEYS = [
  "assets/homepage/search/mark-live.gif",
  "assets/homepage/search/mark-anniversary.png"
];
const FIXTURE_COVER_PHOTO_KEY = "assets/homepage/fixture-covers/photo.png";
const FIXTURE_COVER_PHOTO_PATH = path.join(ROOT, "extension-b", "assets", "homepage", "fixture-covers", "photo.png");
const MANIFEST_BASELINE_RESOURCES_SHA256 = "36A061A62C968C22AF3DE54E779BD9210F3453CDA97DAAC94BE26228CE7B0349";
const MANIFEST_BASELINE_SHA256 = "CF6C1165CC651F12B3722D58260F95F536E8BFEFE89B15A6933AC3E9271B1B9B";
const MOBILE_TITLE_ICON_D = "M11.2 1.00012H8H4.80003C3.56489 1.00012 2.56006 2.00495 2.56006 3.24009V12.7599C2.56006 13.9951 3.56489 14.9999 4.80003 14.9999H11.2C12.4351 14.9999 13.4399 13.9951 13.4399 12.7599V3.24009C13.4399 2.71073 12.4351 2.28011 11.2 2.28011H4.80003C4.27067 2.28011 3.84006 2.71073 3.84006 3.24009V12.76C3.84006 13.2893 4.27067 13.7199 4.80003 13.7199H11.2C11.7293 13.7199 12.1599 13.2893 12.1599 12.76V3.24009C12.1599 2.71073 11.7293 2.28011 11.2 2.28011ZM5.91992 3.7201C5.91992 3.36664 6.20646 3.08011 6.55991 3.08011H9.43987C9.79333 3.08011 10.0799 3.36664 10.0799 3.7201C10.0799 4.07356 9.79333 4.36009 9.43987 4.36009H6.55991C6.20646 4.36009 5.91992 4.07356 5.91992 3.7201ZM7.26109 12.4261C7.22089 12.329 7.2002 12.225 7.2002 12.12C7.2002 11.9078 7.28448 11.7043 7.4345 11.5543C7.58453 11.4043 7.78801 11.32 8.00018 11.32C8.21235 11.32 8.41582 11.4043 8.56585 11.5543C8.71588 11.7043 8.80016 11.9078 8.80016 12.12C8.80016 12.225 8.77947 12.329 8.73926 12.4261C8.69906 12.5232 8.64014 12.6114 8.56585 12.6856C8.49157 12.7599 8.40338 12.8189 8.30632 12.8591C8.20926 12.8993 8.10523 12.92 8.00018 12.92C7.89512 12.92 7.7911 12.8993 7.69404 12.8591C7.59698 12.8189 7.50879 12.7599 7.4345 12.6856C7.36022 12.6114 7.30129 12.5232 7.26109 12.4261Z";
const DESKTOP_TRANSPARENT_TITLE_ICON_D = "M16 0H0V16H16V0Z";
const DESKTOP_TITLE_ICON_D = "M0.683594 2.33335C0.683594 1.97436 0.974609 1.68335 1.33359 1.68335H14.6669C15.0259 1.68335 15.3169 1.97436 15.3169 2.33335V11C15.3169 11.359 15.0259 11.65 14.6669 11.65H8.6501V13C8.6501 13.0056 8.65003 13.0111 8.64989 13.0167H12.0001C12.3591 13.0167 12.6501 13.3077 12.6501 13.6667C12.6501 14.0257 12.3591 14.3167 12.0001 14.3167H4.0001C3.64111 14.3167 3.3501 14.0257 3.3501 13.6667C3.3501 13.3077 3.64111 13.0167 4.0001 13.0167H7.35031C7.35017 13.0111 7.3501 13.0056 7.3501 13V11.65H1.33359C0.974609 11.65 0.683594 11.359 0.683594 11V2.33335ZM1.98359 2.98335V10.35H14.0169V2.98335H1.98359Z";

const readPngDimensions = (buffer) => {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(buffer.toString("ascii", 12, 16), "IHDR");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const sha256Json = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").toUpperCase();

const assertSafePinkSvg = (source) => {
  const tags = [...source.matchAll(/<\/?[A-Za-z][^>]*>/g)].map((match) => match[0]);
  assert.deepEqual(tags.map((tag) => tag.match(/^<\/?([A-Za-z]+)/)[1]), [
    "svg", "rect", "defs", "pattern", "use", "image", "pattern", "defs", "svg"
  ]);
  assert.match(tags[0], /^<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http:\/\/www\.w3\.org\/2000\/svg" xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink">$/);
  assert.equal(tags[1], "<rect width=\"52\" height=\"52\" fill=\"url(#pattern0)\"/>");
  assert.equal(tags[2], "<defs>");
  assert.equal(tags[3], "<pattern id=\"pattern0\" patternContentUnits=\"objectBoundingBox\" width=\"1\" height=\"1\">");
  assert.equal(tags[4], "<use xlink:href=\"#image0_5993_203998\" transform=\"scale(0.000976562)\"/>");
  const embeddedMatch = /^<image id="image0_5993_203998" width="1024" height="1024" xlink:href="data:image\/png;base64,([A-Za-z0-9+/=]+)"\/>$/.exec(tags[5]);
  assert.ok(embeddedMatch, "embedded PNG is a fixed base64 image child");
  assert.deepEqual(readPngDimensions(Buffer.from(embeddedMatch[1], "base64")), { width: 1024, height: 1024 });
  assert.equal(tags[6], "</pattern>");
  assert.equal(tags[7], "</defs>");
  assert.equal(tags[8], "</svg>");
  for (const pattern of [
    /<\/?(?:script|iframe|foreignObject)\b/i,
    /\bon[a-z]+\s*=/i,
    /(?:href|xlink:href)\s*=\s*"https?:/i,
    /(?:href|xlink:href)\s*=\s*"\/\//i,
    /url\(\s*https?:/i,
    /(?:href|xlink:href)\s*=\s*"(?!#|data:image\/png;base64,)/i
  ]) {
    assert.equal(pattern.test(source), false, `pink SVG safety fence ${pattern}`);
  }
};

const failures = [];
const check = (label, fn) => {
  try {
    fn();
    console.log(`PASS ${label}`);
  } catch (error) {
    failures.push({ label, message: error.message });
    console.log(`FAIL ${label}: ${error.message}`);
  }
};

class FakeNode {
  constructor(document, tagName, namespace) {
    this.ownerDocument = document;
    this.tagName = String(tagName).toUpperCase();
    this.namespaceURI = namespace || null;
    this.parentNode = null;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.listenerOptions = new Map();
    this._connected = false;
    this._textContent = "";
    this.focusCount = 0;
    this.scrollTop = 0;
    this.scrollHeight = 0;
    this.clientHeight = 0;
    this.style = {};
    this._rect = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
    this.classList = {
      add: (...names) => names.forEach((name) => this.toggleClass(name, true)),
      remove: (...names) => names.forEach((name) => this.toggleClass(name, false)),
      toggle: (name, force) => {
        const next = force === undefined ? !this.classList.contains(name) : Boolean(force);
        this.toggleClass(name, next);
        return next;
      },
      contains: (name) => (this.getAttribute("class") || "").split(/\s+/).includes(name)
    };
  }

  get isConnected() {
    return this._connected || Boolean(this.parentNode && this.parentNode.isConnected);
  }

  get id() { return this.getAttribute("id") || ""; }
  set id(value) { this.setAttribute("id", value); }
  get textContent() { return this._textContent || this.children.map((child) => child.textContent).join(""); }
  set textContent(value) { this._textContent = String(value); this.ownerDocument.writes += 1; }

  toggleClass(name, enabled) {
    const names = (this.getAttribute("class") || "").split(/\s+/).filter(Boolean);
    const index = names.indexOf(name);
    if (enabled && index < 0) names.push(name);
    if (!enabled && index >= 0) names.splice(index, 1);
    this.setAttribute("class", names.join(" "));
  }

  setAttribute(name, value) { this.attributes.set(String(name), String(value)); this.ownerDocument.writes += 1; }
  setAttributeNS(_namespace, name, value) { this.setAttribute(name, value); }
  getAttribute(name) { return this.attributes.get(String(name)) || null; }
  getBoundingClientRect() { return this._rect; }
  removeAttribute(name) { this.attributes.delete(String(name)); this.ownerDocument.writes += 1; }
  appendChild(child) {
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
    if (index >= 0) this.children.splice(index, 1);
    child.parentNode = null;
    return child;
  }
  replaceChildren(...children) {
    for (const child of this.children) child.parentNode = null;
    this.children = [];
    for (const child of children) this.appendChild(child);
    this.ownerDocument.writes += 1;
  }
  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child.contains(node));
  }
  querySelector(selector) {
    const className = /^\.([\w-]+)$/.exec(String(selector));
    if (className && this.classList.contains(className[1])) return this;
    for (const child of this.children) {
      const match = child.querySelector(selector);
      if (match) return match;
    }
    return null;
  }
  addEventListener(type, listener, options) {
    const values = this.listeners.get(type) || new Set();
    values.add(listener);
    this.listeners.set(type, values);
    const optionsByListener = this.listenerOptions.get(type) || new Map();
    optionsByListener.set(listener, options);
    this.listenerOptions.set(type, optionsByListener);
  }
  removeEventListener(type, listener) {
    const values = this.listeners.get(type) || new Set();
    values.delete(listener);
    this.listeners.set(type, values);
    const optionsByListener = this.listenerOptions.get(type) || new Map();
    optionsByListener.delete(listener);
    this.listenerOptions.set(type, optionsByListener);
  }
  dispatch(type, extra = {}) {
    const event = {
      type,
      target: this,
      relatedTarget: null,
      key: "",
      preventDefault() {},
      stopPropagation() {},
      ...extra
    };
    event.defaultPrevented = false;
    event.preventDefault = () => { event.defaultPrevented = true; };
    for (const listener of [...(this.listeners.get(type) || [])]) listener(event);
    return event;
  }
  focus() { this.focusCount += 1; this.ownerDocument.activeElement = this; }
  blur() { if (this.ownerDocument.activeElement === this) this.ownerDocument.activeElement = null; }
}

class FakeDocument {
  constructor() {
    this.writes = 0;
    this.activeElement = null;
    this.nextTimer = 1;
    this.timers = new Map();
    this.fontLoads = [];
    this.fonts = {
      load: () => new Promise((resolve) => {
        this.fontLoads.push(resolve);
      })
    };
    this.defaultView = {
      setTimeout: (callback, delay) => {
        const id = this.nextTimer++;
        this.timers.set(id, { callback, delay });
        return id;
      },
      clearTimeout: (id) => this.timers.delete(id),
      location: { assigned: "", assign: (href) => { this.defaultView.location.assigned = href; } },
      innerHeight: 800,
      innerWidth: 1280,
      addEventListener() {},
      removeEventListener() {}
    };
  }
  createElement(tagName) { return new FakeNode(this, tagName); }
  createTextNode(text) { const node = new FakeNode(this, "#text"); node.textContent = text; return node; }
  createElementNS(namespace, tagName) { return new FakeNode(this, tagName, namespace); }
  createDocumentFragment() { return new FakeNode(this, "#fragment"); }
  runNextTimer() {
    const next = this.timers.entries().next();
    if (next.done) return false;
    const [id, timer] = next.value;
    this.timers.delete(id);
    timer.callback();
    return true;
  }
}

function loadInternals() {
  const transformed = rendererSource.replace(/\n\}\)\(\);\s*$/, `
  globalThis.__miniHeaderSecurityApi = Object.freeze({
    NAV_ALLOWLIST,
    UPLOAD_ALLOWLIST,
    resolveNav,
    resolveUpload,
    resolveSearchUrl,
    resolveAssetKey,
    captureCategorySpriteUrl,
    createIconFont,
    createPrimaryMenu,
    createHeader,
    bindHeaderPopovers,
    cleanupListeners,
    setAuthStatus,
    ASSET_KEYS,
    GAME_PREVIEW_ITEMS,
    LIVE_ITEMS,
    createGamePopover,
    createLivePopover,
    createMangaPopover,
    createDownloadPopover,
    createProfilePopover,
    createMessagePopover,
     setProfileData,
     setProfileStats,
       setMessageData,
       setDynamicData,
       setFavoriteData,
       setHistoryData,
     positionHeaderPopover,
    MANGA_ITEMS,
    MANGA_RECOMMEND_ITEMS
  });
})();`);
  assert.notEqual(transformed, rendererSource, "renderer export injection marker");
  const sandbox = {
    console,
    URL,
    Set,
    Map,
    Object,
    Array,
    Boolean,
    Number,
    String,
    Math,
    RegExp,
    Error,
    Promise,
    encodeURIComponent,
    decodeURIComponent,
    chrome: { runtime: { id: "mini-header-test", getURL: (key) => `chrome-extension://mini-header-test/${key}` } },
    setTimeout: () => 1,
    clearTimeout() {}
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(transformed, sandbox, { filename: RENDERER_PATH });
  return sandbox.__miniHeaderSecurityApi;
}

const api = loadInternals();

check("runtime SHELL_CSS ends with visible b-wrap popover stacking contract", () => {
  const shellCssStart = rendererSource.indexOf("const SHELL_CSS = `") + "const SHELL_CSS = `".length;
  const shellCssEnd = rendererSource.indexOf("`;", shellCssStart);
  assert.ok(shellCssStart >= "const SHELL_CSS = `".length, "SHELL_CSS source is present");
  assert.ok(shellCssEnd > shellCssStart, "SHELL_CSS source has a closing delimiter");
  const shellCss = rendererSource.slice(shellCssStart, shellCssEnd);
  assert.match(shellCss, /(?:^|\n)  \.homepage \{ overflow: visible; background: rgb\(255, 255, 255\); \}\n  main\.container \{ width: 100%; max-width: none; min-width: 0; margin: 0; background: rgb\(255, 255, 255\); \}\n  \.primary-menu-wrap \{ position: relative; z-index: 100; overflow: visible; border-bottom: 0; \}\n  \.primary-menu-itnl \{ overflow: visible; \}\n  \.primary-menu-itnl \.van-popper-channel \{ z-index: 2028; \}\n  \.first-screen \{ position: relative; z-index: 0; \}/,
    "final runtime homepage/menu/first-screen rules keep channel popovers visible");
});

check("b-wrap primary menu DOM/assets/keyboard contract", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, lease: { active: true }, active: true, cleanups: [], isActive: () => lifecycle.active, isDestroyed: () => false };
  lifecycle.destroy = () => { lifecycle.active = false; lifecycle.lease.active = false; api.cleanupListeners(lifecycle.cleanups); };
  api.captureCategorySpriteUrl(root);
  const menu = api.createPrimaryMenu(root, lifecycle);
  root.appendChild(menu);
  const inner = menu.children[0].children[0];
  assert.deepEqual(inner.children.map((node) => node.getAttribute("id") || node.getAttribute("class")), [
    "primaryPageTab", "tab-line-itnl", "primaryChannelMenu", "tab-line-itnl none", "primaryFriendshipLink"
  ]);
  assert.equal(inner.children[0].getAttribute("class"), "page-tab report-wrap-module");
  assert.equal(inner.children[1].getAttribute("class"), "tab-line-itnl");
  assert.equal(inner.children[3].getAttribute("class"), "tab-line-itnl none");
  const pageIcons = inner.children[0].children[0].children.map((li) => li.children[0].children[0].children[0].getAttribute("class"));
  assert.deepEqual(pageIcons, [
    "bilifont bili-icon_fenqudaohang_shouye",
    "bilifont bili-icon_dingdao_dongtai",
    "bilifont bili-remen",
    "bilifont bili-pindao"
  ]);
  const channels = inner.children[2].children;
  assert.equal(channels.length, 16);
  assert.deepEqual(Array.from(channels, (node) => node.children[1].children[0].getAttribute("href")), [
    "//www.bilibili.com/v/douga/", "//www.bilibili.com/anime/", "//www.bilibili.com/v/music/", "//www.bilibili.com/guochuang/",
    "//www.bilibili.com/v/dance/", "//www.bilibili.com/v/game/", "//www.bilibili.com/v/knowledge/", "//www.bilibili.com/v/tech/",
    "https://www.bilibili.com/c/life_joy/", "//www.bilibili.com/v/kichiku/", "//www.bilibili.com/v/fashion/", "//www.bilibili.com/v/information/",
    "//www.bilibili.com/v/ent/", "//www.bilibili.com/v/cinephile/", "//www.bilibili.com/cinema/", "javascript:;"
  ]);
  assert.match(rendererSource, /\.page-tab \{[^}]*width: 264px;[^}]*flex: 0 0 264px;/s);
  assert.match(rendererSource, /\.page-tab \.con \{[^}]*width: 264px;/s);
  assert.match(rendererSource, /\.page-tab \.con li \{[^}]*width: 66px;[^}]*flex: 0 0 66px;/s);
  assert.match(rendererSource, /@media \(max-width: 1654px\) \{[^}]*\.primary-menu-wrap > \.b-wrap \{ width: 1198px; \}[^}]*\.page-tab, \.page-tab \.con \{ width: 200px; flex-basis: 200px; \}/s);
  assert.match(rendererSource, /\.primary-menu-itnl > \.tab-line-itnl\.none \{[^}]*margin: 0 24px 0 0;/s);
  assert.match(rendererSource, /#primaryChannelMenu \{[^}]*display: flex;[^}]*flex: 1 1 auto;[^}]*min-width: 0;/s);
  assert.match(rendererSource, /#primaryFriendshipLink \{[^}]*width: 289px;[^}]*flex: 0 0 289px;/s);
  assert.match(rendererSource, /\.primary-menu-itnl #primaryChannelMenu > span::after, \.primary-menu-itnl #primaryFriendshipLink > span\.channel-entry::after \{[^}]*top: 30px;[^}]*right: -10px;[^}]*left: -10px;[^}]*display: none;[^}]*height: 14px;/s);
  assert.doesNotMatch(rendererSource, /\.channel-entry:hover \.van-popper-channel|\.channel-entry:focus-within \.van-popper-channel/);
  assert.match(rendererSource, /\.primary-menu-itnl \.van-popper-channel \{[^}]*position: absolute;[^}]*top: 38px;[^}]*left: 50%;[^}]*z-index: var\(--z-popover-channel\);[^}]*display: none;[^}]*min-width: 0;[^}]*padding: 5px 10px;[^}]*border: 0;[^}]*border-radius: 3px;[^}]*background: #fff;[^}]*box-shadow: 0 2px 12px rgba\(0, 0, 0, \.1\);/s);
  assert.match(rendererSource, /\.primary-menu-itnl \.van-popper-channel \{ z-index: 2028; \}/,
    "final channel popover z-index is explicit");
  assert.match(rendererSource, /\.homepage \{ overflow: visible; background: rgb\(255, 255, 255\); \}/,
    "final homepage overflow is visible");
  assert.match(rendererSource, /\.primary-menu-wrap \{ position: relative; z-index: 100; overflow: visible;[^}]*\}/,
    "primary menu wrapper owns the popover stacking context");
  assert.match(rendererSource, /\.primary-menu-wrap \{ position: relative; z-index: 100; overflow: visible; border-bottom: 0; \}/,
    "primary menu wrapper removes the divider below the navigation");
  assert.match(rendererSource, /\.primary-menu-itnl \{ overflow: visible; \}/,
    "primary menu inner wrapper does not clip popovers");
  assert.match(rendererSource, /\.primary-menu-itnl \.channel-entry\.is-popover-visible \.van-popper-channel \{[^}]*display: block;[^}]*visibility: visible;[^}]*opacity: 1;[^}]*pointer-events: auto;[^}]*transform: translateX\(-50%\) translateY\(0\);/s);
  assert.match(rendererSource, /\.primary-menu-itnl \.van-popper-channel \.sub-container \{[^}]*display: flex;/s);
  assert.match(rendererSource, /\.primary-menu-itnl \.van-popper-channel \.sub-item \{[^}]*display: flex;[^}]*flex-direction: column;[^}]*min-width: 78px;/s);
  assert.match(rendererSource, /\.primary-menu-itnl \.van-popper-channel \.sub-item \.name \{[^}]*display: block;[^}]*height: 37px;[^}]*padding: 0 13px;[^}]*font-size: 12px;[^}]*line-height: 37px;[^}]*text-align: left;[^}]*white-space: nowrap;/s);
  assert.doesNotMatch(rendererSource, /(?:popover|entry\.popover)\.style\.(?:display|visibility)/,
    "channel popover visibility is CSS-driven");
  for (const channel of channels) {
    const popover = channel.children[0];
    const reference = channel.children[1];
    assert.equal(reference.getAttribute("tabindex"), "0");
    assert.equal(reference.getAttribute("aria-describedby"), popover.id);
    assert.equal(popover.getAttribute("role"), "tooltip");
    assert.equal(popover.getAttribute("aria-hidden"), "true");
    assert.equal(popover.getAttribute("style"), null);
    assert.equal(channel.classList.contains("is-popover-visible"), false);
    assert.equal(channel.classList.contains("is-popover-closed"), false);
  }
  const moreLink = channels[15].children[1].children[0];
  assert.equal(moreLink.children[1].getAttribute("class"), "bilifont bili-icon_caozuo_xiangyou-copy");
  assert.match(rendererSource, /#primaryChannelMenu \.channel-count \{[^}]*position: static;[^}]*top: auto;[^}]*right: auto;[^}]*display: inline-flex;[^}]*background: rgb\(115, 201, 229\);[^}]*font-size: 12px;[^}]*transform: scale\(\.85\);/s);
  const firstBadge = channels[0].children[1].children[0].children[0].children[0];
  assert.equal(firstBadge.getAttribute("class"), "channel-count");
  assert.equal(firstBadge.style.position, undefined);
  assert.equal(firstBadge.style.top, undefined);
  assert.equal(firstBadge.style.right, undefined);
  const firstReference = channels[0].children[1];
  const firstPopover = channels[0].children[0];
  firstReference.dispatch("keydown", { key: "Enter" });
  assert.equal(firstPopover.getAttribute("aria-hidden"), "false");
  assert.equal(channels[0].classList.contains("is-popover-visible"), true);
  assert.equal(channels[0].classList.contains("is-popover-closed"), false);
  assert.equal(firstPopover.getAttribute("style"), null);
  firstReference.dispatch("keydown", { key: "Escape" });
  assert.equal(firstPopover.getAttribute("aria-hidden"), "true");
  assert.equal(channels[0].classList.contains("is-popover-visible"), false);
  assert.equal(channels[0].classList.contains("is-popover-closed"), true);
  assert.equal(firstPopover.getAttribute("style"), null);
  const friendship = inner.children[4].children;
  assert.equal(friendship.length, 6);
  const friendshipItems = Array.from(friendship, (node) => node.children[node.getAttribute("data-side-key") === "live" ? 1 : 0]);
  assert.deepEqual(friendshipItems.map((node) => node.children[0].getAttribute("href")), [
    "//www.bilibili.com/read/home", "//live.bilibili.com", "//www.bilibili.com/blackboard/activity-list.html",
    "//www.bilibili.com/cheese/?csource=common_hp_channelclass_icon", "https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html",
    "//www.bilibili.com/v/musicplus/"
  ]);
  assert.deepEqual(friendshipItems.map((node) => node.children[0].children[1].textContent), [
    "专栏", "直播", "活动", "课堂", "社区中心", "新歌热榜"
  ]);
  assert.equal(friendship[1].children.length, 2, "live owns one popover and one reference");
  assert.equal(friendship[1].children[0].getAttribute("role"), "tooltip");
  assert.deepEqual(friendship[1].children[0].children[0].children.flatMap((column) => column.children.map((link) => link.textContent)),
    ["全部", "网游", "手游", "单机", "娱乐", "电台", "虚拟", "生活", "学习"]);
  for (const index of [0, 2, 3, 4, 5]) {
    assert.equal(friendship[index].children.length, 1, "non-live friendship entry has no empty popover shell");
  }
  assert.match(rendererSource, /#primaryFriendshipLink \{[^}]*width: 289px;[^}]*height: 68px;[^}]*padding: 0;/s);
  assert.match(rendererSource, /#primaryFriendshipLink \.svg-icon \{[^}]*width: 25\.2px;[^}]*height: 25\.2px;[^}]*flex: 0 0 25\.2px;/s);
  const expectedPathCounts = [5, 3, 1, 7, 4, 11];
  for (const [index, side] of friendship.entries()) {
    const svg = friendshipItems[index].children[0].children[0];
    assert.equal(svg.getAttribute("class").split(/\s+/).includes("svg-icon"), true);
    assert.equal(svg.getAttribute("width"), "25");
    assert.equal(svg.getAttribute("height"), "25");
    assert.equal(svg.getAttribute("aria-hidden"), "true");
    assert.equal(svg.children.some((child) => child.tagName.toLowerCase() === "use"), false);
    assert.equal(svg.children.length, expectedPathCounts[index]);
    assert.equal(svg.children.every((child) => child.tagName.toLowerCase() === "path"), true);
    assert.equal(svg.children.every((child) => child.getAttribute("d")), true);
    assert.equal(svg.children.every((child) => child.getAttribute("fill")), true);
    assert.equal(svg.children.some((child) => child.getAttribute("fill-opacity") !== "0"), true);
  }
  lifecycle.destroy();
});

const flushPromiseContinuations = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

const createIconLifecycle = (root) => {
  const lifecycle = {
    root,
    lease: { active: true },
    destroyed: false,
    active: true,
    cleanups: [],
    isActive: () => lifecycle.active,
    isDestroyed: () => lifecycle.destroyed
  };
  lifecycle.destroy = () => {
    lifecycle.active = false;
    lifecycle.destroyed = true;
    lifecycle.lease.active = false;
    api.cleanupListeners(lifecycle.cleanups);
  };
  return lifecycle;
};

const findNodesByClass = (node, className, result = []) => {
  if (!node || !node.classList) return result;
  if (node.classList.contains(className)) result.push(node);
  for (const child of node.children || []) findNodesByClass(child, className, result);
  return result;
};

const resolveFontLoads = (document, faces = [{}]) => {
  const pending = document.fontLoads.splice(0);
  for (const resolve of pending) resolve(faces);
};

check("fixed NAV_ALLOWLIST href/target/rel", () => {
  const expected = {
    HOME_ROOT: ["https://www.bilibili.com/", "_self", ""],
    DOUGA: ["https://www.bilibili.com/v/douga/", "_blank", "noopener noreferrer"],
    ANIME: ["https://www.bilibili.com/anime/", "_blank", "noopener noreferrer"],
    GAME: ["https://game.bilibili.com/platform/", "_blank", "noopener noreferrer"],
    LIVE: ["https://live.bilibili.com/", "_blank", "noopener noreferrer"],
    SHOW: ["https://show.bilibili.com/platform/home.html?msource=pc_web", "_blank", "noopener noreferrer"],
    MANGA: ["https://manga.bilibili.com/?from=bill_top_mnav", "_blank", "noopener noreferrer"],
    MATCH: ["https://www.bilibili.com/match/home/", "_blank", "noopener noreferrer"],
    ACTIVITY: ["https://www.bilibili.com/blackboard/era/bkW0rNd9znQuejB0.html", "_blank", "noopener noreferrer"],
    TOPIC_LIST: ["https://www.bilibili.com/blackboard/topic_list.html", "_blank", "noopener noreferrer"],
    APP: ["https://app.bilibili.com/", "_blank", "noopener noreferrer"],
    CUSTOMER_SERVICE: ["https://www.bilibili.com/v/customer-service", "_blank", "noopener noreferrer"],
    VIP: ["https://account.bilibili.com/big", "_blank", "noopener noreferrer"],
    HISTORY: ["https://www.bilibili.com/history", "_blank", "noopener noreferrer"],
    CREATOR: ["https://member.bilibili.com/platform/home", "_blank", "noopener noreferrer"]
  };
  assert.deepEqual(Object.keys(api.NAV_ALLOWLIST), Object.keys(expected));
  for (const [key, [href, target, rel]] of Object.entries(expected)) {
    assert.deepEqual([api.resolveNav(key).href, api.resolveNav(key).target, api.resolveNav(key).rel], [href, target, rel]);
  }
  assert.equal(api.resolveNav("UNKNOWN"), null);
  assert.equal(api.resolveNav("javascript:alert(1)"), null);
});

check("fixed upload anchors", () => {
  for (const key of ["COLUMN", "AUDIO", "STICKER", "VIDEO", "MANAGE"]) {
    const target = api.resolveUpload(key);
    assert.equal(target.target, "_blank");
    assert.equal(target.rel, "noopener noreferrer");
    assert.match(target.href, /^https:\/\/member\.bilibili\.com\//);
  }
  assert.equal(api.resolveUpload("../MANAGE"), null);
});

check("search URL positive and negative matrix", () => {
  const cases = [
    ["", "%E6%90%9C%E7%B4%A2"],
    ["  ", "%E6%90%9C%E7%B4%A2"],
    ["a&b=c#d", "a%26b%3Dc%23d"],
    ["javascript:alert(1)", "javascript%3Aalert(1)"],
    ["line\nfeed\t", "linefeed"],
    ["é", "%C3%A9"]
  ];
  for (const [input, encoded] of cases) {
    const href = api.resolveSearchUrl(input);
    assert.equal(href, `https://search.bilibili.com/all?keyword=${encoded}`);
    assert.equal((href.match(/\?/g) || []).length, 1);
    assert.equal((href.match(/keyword=/g) || []).length, 1);
  }
  const long = api.resolveSearchUrl("x".repeat(500));
  assert.ok(long.length < 200);
  assert.equal(api.resolveSearchUrl("\uD800"), "https://search.bilibili.com/all?keyword=%E6%90%9C%E7%B4%A2");
});

check("DOM and transport sink denylist", () => {
  for (const pattern of [
    /innerHTML|outerHTML|insertAdjacentHTML|DOMParser|createContextualFragment|document\.write/,
    /\bsrcdoc\b|postMessage|\bfetch\b|XMLHttpRequest|WebSocket/,
    /\b(?:localStorage|sessionStorage|indexedDB|cookie)\b|chrome\.cookies/,
    /\beval\s*\(|\bFunction\s*\(|import\s*\(/,
    /document\.body|document\.querySelector|document\.getElementById/
  ]) {
    assert.equal(pattern.test(rendererSource), false, `forbidden source match ${pattern}`);
  }
  const contentSource = fs.readFileSync(path.join(ROOT, "extension-b", "content.js"), "utf8");
  assert.equal((rendererSource.match(/createElement\("iframe"\)/g) || []).length, 1);
  assert.match(rendererSource, /setAttribute\("src", "https:\/\/t\.bilibili\.com\/pages\/nav\/index_new"\)/);
  assert.match(contentSource, /attachShadow\(\{ mode: "closed" \}\)/);
  assert.match(rendererSource, /createElementNS/);
  assert.match(rendererSource, /textContent/);
});

check("download assets exact bytes, dimensions and SVG fence", () => {
  assert.equal(api.ASSET_KEYS.MINI_DOWNLOAD_QR, DOWNLOAD_QR_KEY);
  assert.equal(api.ASSET_KEYS.MINI_DOWNLOAD_PINK_TV, DOWNLOAD_PINK_KEY);
  assert.equal(fs.statSync(DOWNLOAD_QR_PATH).size, 867);
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(DOWNLOAD_QR_PATH)).digest("hex").toUpperCase(), "DA9BFADD263C9058A6BAEDCAB45B5FAF518F0618D27EE4478367DA3E520D7B24");
  assert.deepEqual(readPngDimensions(fs.readFileSync(DOWNLOAD_QR_PATH)), { width: 97, height: 97 });
  assert.equal(fs.statSync(DOWNLOAD_PINK_PATH).size, 82236);
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(DOWNLOAD_PINK_PATH)).digest("hex").toUpperCase(), "CA2D40E8D707672272B05EBFD578B404916BC2E2B49A2306FB06EB4AE46365CF");
  assertSafePinkSvg(fs.readFileSync(DOWNLOAD_PINK_PATH, "utf8"));
});

check("fixture cover photo is a bounded PNG asset", () => {
  assert.equal(fs.existsSync(FIXTURE_COVER_PHOTO_PATH), true);
  const bytes = fs.readFileSync(FIXTURE_COVER_PHOTO_PATH);
  assert.deepEqual(Array.from(bytes.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(bytes.readUInt32BE(16), 640);
  assert.equal(bytes.readUInt32BE(20), 449);
  assert.equal(bytes[24], 8);
  assert.equal(bytes[25], 2);
  assert.ok(bytes.length <= 500000, `fixture cover photo is too large: ${bytes.length}`);
});

check("manifest permission and exact WAR boundary", () => {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  assert.deepEqual(manifest.permissions, ["storage", "activeTab"]);
  assert.deepEqual(manifest.host_permissions, ["https://api.bilibili.com/*", "https://s.search.bilibili.com/*", "https://manga.bilibili.com/*"]);
  assert.deepEqual(manifest.content_scripts[0].matches, [
    "https://www.bilibili.com/",
    "https://www.bilibili.com/index.html"
  ]);
  assert.equal(manifest.content_scripts[0].all_frames, false);
  const resources = manifest.web_accessible_resources[0].resources;
  assert.equal(new Set(resources).size, resources.length);
  assert.equal(resources.some((value) => value.includes("**") || value.includes("manifest") || value.includes("sw.js")), false);
  for (const required of [
    "assets/homepage/homepage-runtime/international-home/iconfont.woff2",
    "assets/homepage/homepage-runtime/international-home/download-client.svg",
    "assets/homepage/mini-header-popovers/download/client-download-qr.png",
    "assets/homepage/mini-header-popovers/download/pink-download.svg",
    FIXTURE_COVER_PHOTO_KEY,
    "assets/homepage/homepage-runtime/header/a1a87acb-highschool.png",
    "assets/homepage/mini-header-auth/video.png",
    "assets/homepage/homepage-runtime/mini-header-vip/jTAZ4HXjQa.png@230w_68h_1c.webp"
  ]) assert.ok(resources.includes(required), required);
  assert.equal(resources.filter((value) => value.startsWith("assets/homepage/fixture-covers/")).length, 1);
  assert.equal(resources.some((value) => /assets\/homepage\/fixture-covers\/(ordinary-rank|recommend)-/.test(value)), false);
  for (const required of [
    "assets/homepage/mini-header-popovers/manga/rank-hover-3654e0590267af6a8ef514b5db557aa784bbc1b4.png",
    "assets/homepage/mini-header-popovers/manga/rank-hover-1572f58dd448a1361350eb4079472d361a292181.jpg@320w",
    "assets/homepage/mini-header-popovers/manga/rank-hover-d864e1f1041f55e703e24d7bb825e13994f22bab.jpg@320w",
    "assets/homepage/mini-header-popovers/manga/rank-hover-c62668e300b5212fe5504f6fa9b4b5c630f8ebeb.jpg@320w",
    "assets/homepage/mini-header-popovers/manga/rank-hover-789aa94f8752ddf0346445ae31303deb3209b732.png@320w",
    "assets/homepage/mini-header-popovers/manga/rank-hover-b8eca33b94c324bcaa0dda202a39f2d9d162c587.png@320w"
  ]) assert.ok(resources.includes(required), required);
  for (const required of [
    "rank-hover-3654e0590267af6a8ef514b5db557aa784bbc1b4.png",
    "rank-hover-1572f58dd448a1361350eb4079472d361a292181.jpg@320w",
    "rank-hover-d864e1f1041f55e703e24d7bb825e13994f22bab.jpg@320w",
    "rank-hover-c62668e300b5212fe5504f6fa9b4b5c630f8ebeb.jpg@320w",
    "rank-hover-789aa94f8752ddf0346445ae31303deb3209b732.png@320w",
    "rank-hover-b8eca33b94c324bcaa0dda202a39f2d9d162c587.png@320w"
  ]) assert.equal(fs.existsSync(path.join(ROOT, "extension-b", "assets", "homepage", "mini-header-popovers", "manga", required)), true, required);
  const downloadResources = resources.filter((value) => value.startsWith("assets/homepage/mini-header-popovers/download/"));
  assert.deepEqual(downloadResources, [DOWNLOAD_QR_KEY, DOWNLOAD_PINK_KEY]);
  assert.equal(resources.filter((value) => value === DOWNLOAD_QR_KEY).length, 1);
  assert.equal(resources.filter((value) => value === DOWNLOAD_PINK_KEY).length, 1);
  assert.deepEqual(resources.filter((value) => value.startsWith("assets/homepage/search/")), SEARCH_MARK_KEYS);
  for (const key of SEARCH_MARK_KEYS) {
    assert.equal(fs.existsSync(path.join(ROOT, "extension-b", key)), true, key);
  }
  const baselineManifest = JSON.parse(JSON.stringify(manifest));
  delete baselineManifest.permissions;
  baselineManifest.web_accessible_resources[0].resources = resources.filter((value) => !downloadResources.includes(value)
    && !SEARCH_MARK_KEYS.includes(value));
  assert.ok(baselineManifest.web_accessible_resources[0].resources.length >= 79);
  assert.match(sha256Json(baselineManifest), /^[A-F0-9]{64}$/);
  const downloadStart = resources.indexOf(DOWNLOAD_QR_KEY);
  assert.equal(downloadStart, resources.indexOf("assets/homepage/homepage-runtime/international-home/download-client.svg") + 1);
  assert.equal(resources[downloadStart + downloadResources.length], "assets/homepage/homepage-runtime/international-home/category-symbols.svg");
  const r5War = [
    "assets/homepage/mini-header-popovers/manga/recommend-5d41943c5e2e71c1fb6564676c1ee312ea2684f5.png@272w",
    "assets/homepage/mini-header-popovers/manga/recommend-d9ee84f8bab10116c9521d6344c520699a6968e1.jpg@272w",
    "assets/homepage/mini-header-popovers/manga/recommend-78876fdef412fa995ae5cce7cc30af1ff61f4ac7.png@272w",
    "assets/homepage/mini-header-popovers/manga/recommend-098f9f01e59beecd77d14b0e2eee5ef4cb549d0b.jpg@272w"
  ];
  assert.equal(resources.filter((value) => value.includes("assets/homepage/mini-header-popovers/manga/recommend-")).length, 4);
  assert.deepEqual(resources.filter((value) => value.includes("assets/homepage/mini-header-popovers/manga/recommend-")), r5War);
  const r5Hashes = [
    "D5BD34C7E436C954736C6B7E8D7E736329F54F61AC276920826D54808A430238",
    "548A3AD39B25B515D2084573E12C0A8A3C2FB4F5725B329FC38576B3D4155CA7",
    "75C5DFC4E33E4A4137B423186AD403AE9FC4C7939D12A8DB5276801188C396E1",
    "DB70D0D6AF1B984198D9CE969D5D92AEA852A4C6B0D028E3BAFC2B02225D5FC1"
  ];
  for (const [index, warPath] of r5War.entries()) {
    const fileName = warPath.split("/").pop();
    const filePath = path.join(ROOT, "extension-b", "assets", "homepage", "mini-header-popovers", "manga", fileName);
    assert.equal(fs.existsSync(filePath), true, fileName);
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").toUpperCase(), r5Hashes[index], fileName);
  }
  assert.equal(rendererSource.includes("https://i0.hdslb.com/bfs/manga-static/"), false);
});

check("download popover is DOM-only and uses fixed local assets", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const panel = api.createDownloadPopover(root);
  root.appendChild(panel);
  const wrapper = panel.children[0];
  const top = wrapper.children[0];
  const left = top.children[0];
  const divider = top.children[1];
  const right = top.children[2];
  const qr = left.children[1].children[0];
  const qrImage = qr.children[0];
  const pinkImage = right.children[1].children[0];
  const button = right.children[1].children[1];
  const footer = wrapper.children[1];
  const mobileMain = left.children[0].children[0];
  const mobileSub = left.children[0].children[1];
  const desktopMain = right.children[0].children[0];
  const desktopSub = right.children[0].children[1];
  const mobileIcon = mobileMain.children[0];
  const desktopIcon = desktopMain.children[0];
  assert.deepEqual([panel.children.length, wrapper.getAttribute("class"), top.getAttribute("class"), left.getAttribute("class"), divider.getAttribute("class"), right.getAttribute("class")], [1, "download-wrapper", "download-top", "download-top-left", "download-top-center", "download-top-right"]);
  assert.equal(wrapper.children.length, 2);
  assert.equal(top.children.length, 3);
  assert.equal(qr.getAttribute("class"), "qr");
  assert.equal(qrImage.getAttribute("class"), null);
  assert.equal(qrImage.getAttribute("alt"), "客户端下载二维码");
  assert.equal(qrImage.getAttribute("src"), `chrome-extension://mini-header-test/${api.ASSET_KEYS.MINI_DOWNLOAD_QR}`);
  assert.equal(pinkImage.getAttribute("class"), "pink-pc-download");
  assert.equal(pinkImage.getAttribute("aria-hidden"), "true");
  assert.equal(pinkImage.getAttribute("src"), `chrome-extension://mini-header-test/${api.ASSET_KEYS.MINI_DOWNLOAD_PINK_TV}`);
  assert.equal(button.textContent, "立即下载");
  assert.equal(footer.textContent, "点击查看更多下载内容");
  assert.equal(mobileMain.textContent, "手机版");
  assert.equal(mobileSub.textContent, "扫码即可下载手机APP");
  assert.equal(desktopMain.textContent, "Windows端");
  assert.equal(desktopSub.textContent, "适合WIN系统设备");
  assert.deepEqual([right.children[1].children.length, right.children[1].children[0], right.children[1].children[1]], [2, pinkImage, button]);
  for (const icon of [mobileIcon, desktopIcon]) {
    assert.equal(icon.tagName, "SVG");
    assert.equal(icon.namespaceURI, "http://www.w3.org/2000/svg");
    assert.deepEqual([
      icon.getAttribute("width"), icon.getAttribute("height"), icon.getAttribute("viewBox"),
      icon.getAttribute("fill"), icon.getAttribute("xmlns")
    ], ["16", "16", "0 0 16 16", "none", "http://www.w3.org/2000/svg"]);
    assert.equal(icon.getAttribute("class"), null);
  }
  assert.equal(mobileIcon.children.length, 1);
  assert.deepEqual([
    mobileIcon.children[0].getAttribute("d"),
    mobileIcon.children[0].getAttribute("fill-rule"),
    mobileIcon.children[0].getAttribute("clip-rule"),
    mobileIcon.children[0].getAttribute("fill")
  ], [MOBILE_TITLE_ICON_D, "evenodd", "evenodd", "currentColor"]);
  assert.equal(desktopIcon.children.length, 2);
  assert.deepEqual([
    desktopIcon.children[0].getAttribute("d"),
    desktopIcon.children[0].getAttribute("fill"),
    desktopIcon.children[0].getAttribute("fill-opacity")
  ], [DESKTOP_TRANSPARENT_TITLE_ICON_D, "white", "0.01"]);
  assert.deepEqual([
    desktopIcon.children[1].getAttribute("d"),
    desktopIcon.children[1].getAttribute("fill-rule"),
    desktopIcon.children[1].getAttribute("clip-rule"),
    desktopIcon.children[1].getAttribute("fill")
  ], [DESKTOP_TITLE_ICON_D, "evenodd", "evenodd", "currentColor"]);
  assert.equal(footer.children.length, 1);
  assert.equal(footer.children[0].getAttribute("class"), "download-bottom-chevron");
  assert.equal(footer.children[0].textContent, "›");
  assert.deepEqual([button.getAttribute("href"), button.getAttribute("target"), button.getAttribute("rel")], [api.NAV_ALLOWLIST.APP.href, api.NAV_ALLOWLIST.APP.target, api.NAV_ALLOWLIST.APP.rel]);
  assert.deepEqual([footer.getAttribute("href"), footer.getAttribute("target"), footer.getAttribute("rel")], [api.NAV_ALLOWLIST.APP.href, api.NAV_ALLOWLIST.APP.target, api.NAV_ALLOWLIST.APP.rel]);
  const allNodes = [];
  const collect = (node) => { allNodes.push(node); for (const child of node.children) collect(child); };
  collect(panel);
  assert.equal(allNodes.every((node) => node.ownerDocument === root.ownerDocument), true);
  assert.equal(allNodes.some((node) => /^(IFRAME|SCRIPT)$/.test(node.tagName)), false);
  assert.equal(api.resolveAssetKey(api.ASSET_KEYS.MINI_DOWNLOAD_QR), api.ASSET_KEYS.MINI_DOWNLOAD_QR);
  assert.equal(api.resolveAssetKey(api.ASSET_KEYS.MINI_DOWNLOAD_PINK_TV), api.ASSET_KEYS.MINI_DOWNLOAD_PINK_TV);
  for (const invalidKey of [
    `${DOWNLOAD_QR_KEY}?x=1`,
    `${DOWNLOAD_QR_KEY}#fragment`,
    `assets/homepage/mini-header-popovers/download/../download/client-download-qr.png`,
    `assets\\homepage\\mini-header-popovers\\download\\client-download-qr.png`,
    "assets/homepage/mini-header-popovers/download/not-imported.png",
    "assets/homepage/mini-header-popovers/download/client-download-qr.png@97w",
    "assets/homepage/mini-header-popovers/download/pink-download.svg?x=1"
  ]) assert.equal(api.resolveAssetKey(invalidKey), null, invalidKey);
  assert.match(rendererSource, /\.download-client-entry \{[^}]*top: 47px;[^}]*width: 387px; height: 216px;[^}]*border: 1px solid #e3e5e7;[^}]*border-radius: 8px;[^}]*box-shadow: 0 0 30px rgba\(0, 0, 0, \.1\)/s);
  assert.match(rendererSource, /\.download-wrapper \{[^}]*grid-template-rows: 162px 17px;[^}]*padding: 19px 0 16px/s);
  assert.match(rendererSource, /\.download-top \{[^}]*grid-template-columns: calc\(50% - \.5px\) 1px calc\(50% - \.5px\);[^}]*height: 162px/s);
  assert.match(rendererSource, /\.download-top-center \{ width: 1px; height: 143px; background: #e3e5e7; \}/);
  assert.match(rendererSource, /\.qr \{[^}]*width: 95px; height: 95px;[^}]*border: 1px solid #e3e5e7;[^}]*border-radius: 4px/s);
  assert.match(rendererSource, /\.qr img \{ display: block; width: 87px; height: 87px; object-fit: contain; \}/);
  assert.match(rendererSource, /\.pink-pc-download \{ display: block; width: 52px; height: 52px;/);
  assert.match(rendererSource, /\.button \{[^}]*width: 90px; height: 30px;[^}]*border-radius: 6px;[^}]*color: #fff; background: #00aeec/s);
  assert.match(rendererSource, /\.download-top-right \.download-top-content \{ flex-direction: column; \}/);
  assert.match(rendererSource, /\.download-top-title \.sub \{[^}]*width: 130px; margin: 0 auto;[^}]*text-align: center;/s);
  assert.match(rendererSource, /\.download-top-left \.sub \{ width: auto; white-space: nowrap; \}/);
  assert.match(rendererSource, /\.download-top-title \.main > svg \{[^}]*display: block; width: 16px; height: 16px;[^}]*margin: 0 3px 0 0;[^}]*color: #18191c;/s);
  assert.match(rendererSource, /\.download-top-title \{[^}]*transform: translateY\(2px\);/s);
  assert.equal(rendererSource.includes("download-phone-icon"), false);
  assert.equal(rendererSource.includes("download-pc-icon"), false);
  assert.equal(rendererSource.includes("border: 2px solid #18191c"), false);
  assert.match(rendererSource, /createElementNS\("http:\/\/www\.w3\.org\/2000\/svg", "svg"\)/);
  assert.match(rendererSource, /createElementNS\("http:\/\/www\.w3\.org\/2000\/svg", "path"\)/);
  assert.match(rendererSource, /\.download-bottom \{ display: flex; width: 130px; height: 17px;[^}]*justify-content: center;[^}]*color: #9499a0;[^}]*transform: translateY\(2px\);/s);
  assert.match(rendererSource, /\.download-bottom-chevron \{ color: #9499a0;/);
  assert.equal(rendererSource.includes("download-fixture"), false);

  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  root.appendChild(header.header);
  const entry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === "download");
  const gameEntry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === "game");
  const liveEntry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === "live");
  const mangaEntry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === "manga");
  const downloadClassNames = ["download-wrapper", "download-top", "download-top-left", "download-top-center", "download-top-right", "qr", "pink-pc-download", "button", "download-bottom"];
  for (const otherEntry of [gameEntry, liveEntry, mangaEntry]) {
    for (const className of downloadClassNames) {
      assert.equal(findNodesByClass(otherEntry.panel, className).length, 0, `${className} leaked into ${otherEntry.panel.getAttribute("data-popover-kind")}`);
    }
  }
  assert.equal(findNodesByClass(entry.panel, "button").length, 1);
  assert.equal(findNodesByClass(entry.panel, "qr").length, 1);
  api.bindHeaderPopovers(header.popoverGroups, lifecycle.cleanups, lifecycle.isActive);
  entry.group.dispatch("focusin");
  assert.equal(entry.panel.getAttribute("aria-hidden"), "false");
  entry.panel.dispatch("keydown", { key: "Escape" });
  assert.equal(entry.panel.getAttribute("aria-hidden"), "true");
  assert.equal(entry.trigger.focusCount, 0);
  entry.group.dispatch("pointerleave", { relatedTarget: null });
  entry.group.dispatch("focusin");
  assert.equal(entry.panel.getAttribute("aria-hidden"), "false");
  entry.group.dispatch("pointerleave", { relatedTarget: null });
  assert.equal(document.timers.size, 1);
  lifecycle.active = false;
  api.cleanupListeners(lifecycle.cleanups);
  assert.equal(document.timers.size, 0);
  const writesAfterDestroy = document.writes;
  entry.group.dispatch("mouseenter");
  entry.group.dispatch("focusin");
  entry.group.dispatch("mouseleave");
  entry.panel.dispatch("keydown", { key: "Escape" });
  entry.panel.children[0].children[0].children[0].children[1].children[0].dispatch("load");
  entry.panel.children[0].children[0].children[2].children[1].children[0].dispatch("error");
  assert.equal(document.writes, writesAfterDestroy);
  assert.equal(lifecycle.cleanups.length, 0);
});

check("search form fills box and keeps button on right", () => {
  assert.match(rendererSource, /\.nav-search \{ position: relative; display: block; width: 100%; height: 36px; \}/);
  assert.match(rendererSource, /\.nav-search-form, #nav_searchform \{ position: relative; display: block; width: 100%; height: 100%; margin: 0; \}/);
  assert.match(rendererSource, /\.nav-search-keyword \{ display: block; width: calc\(100% - 48px\); height: 36px;/);
  assert.match(rendererSource, /\.nav-search-btn \{ position: absolute; top: 0; right: 0; display: flex; width: 48px; height: 36px;/);
  assert.match(rendererSource, /\.header-search-suggest \{ right: 0; left: 0; z-index: 3205; width: 100%; max-width: none; height: auto;/);

  const document = new FakeDocument();
  const root = document.createElement("main");
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  root.appendChild(header.header);
  const form = root.querySelector(".nav-search-form");
  const input = root.querySelector(".nav-search-keyword");
  const button = root.querySelector(".nav-search-btn");
  assert.ok(form && input && button);
  assert.equal(input.parentNode, form);
  assert.equal(button.parentNode, form);
  assert.equal(form.getAttribute("class"), "nav-search-form");
});

check("header columns flow without search overlap at intermediate widths", () => {
  assert.match(rendererSource, /\.mini-header__content \{ display: grid; grid-template-columns: max-content minmax\(0, 1fr\) max-content;[^}]*column-gap: clamp\(8px, 1vw, 16px\);/s);
  assert.match(rendererSource, /\.nav-link \{ flex: 0 0 auto; min-width: max-content; \}/);
  assert.match(rendererSource, /\.nav-link-ul \{[^}]*width: max-content; max-width: 100%;/s);
  assert.match(rendererSource, /\.nav-search-box \{ flex: none; width: auto; min-width: 0; max-width: none; \}/);
  assert.match(rendererSource, /\.nav-user-center \{ min-width: max-content; \}/);
  assert.match(rendererSource, /@media \(max-width: 980px\) \{\s*\.mini-header__content \{ grid-template-columns: minmax\(0, 1fr\) max-content;/s);
  assert.match(rendererSource, /\.nav-search-box \{ grid-column: 1; \}/);
  assert.match(rendererSource, /\.nav-user-center \{ grid-column: 2; \}/);
  assert.doesNotMatch(rendererSource, /\.nav-search-box \{[^}]*width: (?:300|400|400\.2|496|500)px/);

  const document = new FakeDocument();
  const root = document.createElement("main");
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  const content = header.header.querySelector(".mini-header__content");
  assert.deepEqual(content.children.map((node) => node.getAttribute("class")), [
    "nav-link",
    "nav-search-box header-popover-wrap",
    "nav-user-center"
  ], "header has exactly three direct layout children");
});

check("auth branches reserve stable intrinsic width in one grid area", () => {
  assert.match(rendererSource, /\.auth-state-panel \{ display: flex; align-items: center;/);
  assert.match(rendererSource, /\.auth-branch \{ display: none;[^}]*visibility: hidden; pointer-events: none;/s);
  assert.match(rendererSource, /\.auth-state-panel\[data-state="logged_in"\] \{ display: none; \}/);
  assert.match(rendererSource, /\.auth-state-panel\[data-state="logged_out"\] \.auth-branch--logout,[\s\S]*display: flex; visibility: visible; pointer-events: auto; opacity: 1;/);
  assert.match(rendererSource, /\.auth-state-panel\[data-state="unknown"\] \.auth-branch--unknown \{ display: flex; visibility: visible; pointer-events: auto; opacity: 1; \}/);
  assert.match(rendererSource, /\.nav-user-center > \.auth-state-panel \{ position: absolute; top: 0; right: 114px;[^}]*display: flex; width: 344px; height: 40px;/);
  assert.match(rendererSource, /\.nav-user-center > \.auth-state-panel\[hidden\], \.nav-user-center > \.user-con\.signin\[hidden\] \{ display: none !important; \}/);
  assert.match(rendererSource, /\.nav-user-center\[data-auth-state="logged_out"\] > div\[data-popover-group="upload"\],[\s\S]*margin-left: auto;/);
  assert.match(rendererSource, /\.auth-branch--logout \.van-popper-nav \{[^}]*opacity: 0;[^}]*pointer-events: none;[^}]*visibility: hidden;/);
  assert.match(rendererSource, /\.auth-branch--logout \.van-popper-nav\.is-popover-visible \{[^}]*opacity: 1;[^}]*pointer-events: auto;[^}]*visibility: visible;/);
  assert.match(rendererSource, /typeof view\.resetPopovers === "function"/);
  assert.match(rendererSource, /const loggedOutVipPanel = createVipPopover\(root\);[\s\S]*portal: true,[\s\S]*overlayLayer\.appendChild\(loggedOutVipPanel\);/);
  assert.match(rendererSource, /\.user-popover-reference > \.mini-vip,[\s\S]*color: #fff;/);
  assert.match(rendererSource, /> \.item\.mini-vip \.user-popover-reference > \.name \{[\s\S]*color: #fff !important;[\s\S]*text-shadow:[^}]*!important;/);
});

check("profile popover uses controlled auth projection and measured structure", () => {
  assert.doesNotMatch(rendererSource, /PROFILE_ICON_PATHS|createProfileIcon/);
  assert.doesNotMatch(rendererSource, /createAsset\("币"|createAsset\("B"|avatar-service-arrow/);
  const profileGlyphs = {
    "bili-icon_dingdao_gerenzhongxin": "E722",
    "bili-icon_dingdao_tougaoguanli": "E723",
    "bili-icon_dingdao_tuijianfuwu": "E60F",
    "bili-icon_dingdao_yuyanshezhi": "E757",
    "bili-icon_dingdao_dengchu": "E721",
    "bili-icon_dingdao_qianbao": "E71F",
    "bili-icon_dingdao_dingdanzhongxin": "E71E",
    "bili-icon_dingdao_zhibozhongxin": "E720",
    "bili-icon_dingdao_cheese": "E60E",
    "bili-icon_dingdao_bangdingshouji": "E733",
    "bili-icon_dingdao_youxiang": "E735",
    "bili-icon_dingdao_yingbi": "E734",
    "bili-icon_dingdao_Bbi": "E736",
    "bili-icon_caozuo_qianwang": "E73B",
    "bili-icon_caozuo_xuanzhong": "E756"
  };
  assert.equal(Object.keys(profileGlyphs).length, 15);
  for (const [glyphClass, codePoint] of Object.entries(profileGlyphs)) {
    assert.match(rendererSource, new RegExp(`"${glyphClass}": Object\\.freeze\\(\\{ codePoint: 0x${codePoint}`));
    assert.equal(rendererSource.includes(`.${glyphClass}::before { content: "\\\\${codePoint}"; }`), true, glyphClass);
  }
  assert.match(rendererSource, /\.icon-font-fallback--empty \{ display: none; \}/);
  assert.match(rendererSource, /\.profile-menu-submenu-wrap:hover > \.profile-submenu, \.profile-menu-submenu-wrap:focus-within > \.profile-submenu/);
  assert.match(rendererSource, /\.profile-service-submenu \{ width: 131px; height: 184px; padding: 12px 0; \}/);
  assert.match(rendererSource, /\.profile-service-submenu[\s\S]*\.profile-submenu-item \{[^}]*height: 40px;/);
  assert.match(rendererSource, /\.profile-language-submenu \{ width: 240px; height: 92px; padding: 8px 0; font-size: 12px; \}/);
  assert.match(rendererSource, /\.profile-language-item \{[^}]*height: 38px;[^}]*padding: 8px 15px;/);
  assert.match(rendererSource, /\.profile-language-item\.is-selected \{ color: #00a1d6; \}/);
  assert.doesNotMatch(rendererSource, /document\.cookie|localStorage|sessionStorage|location\.reload\(/);

  assert.match(rendererSource, /\.profile-popover \{ width: 280px; height: 468px;/);
  assert.match(rendererSource, /\.profile-avatar-frame \{[^}]*width: 51px; height: 51px;[^}]*margin: -25px auto 0;/s);
  assert.match(rendererSource, /\.profile-level-progress \{[^}]*background: #f3cb85;/s);
  assert.match(rendererSource, /\.profile-stats \{ display: grid; grid-template-columns: repeat\(3, 1fr\);/);
  assert.match(rendererSource, /\.profile-menu-row \{ display: flex;[^}]*height: 40px;/s);
  assert.match(rendererSource, /\.profile-avatar-frame, \.profile-level-link, \.profile-asset, \.profile-asset-action, \.profile-stat \{ text-decoration: none; \}/);
  assert.match(rendererSource, /\.profile-avatar-frame:hover, \.profile-avatar-frame:focus-visible,[\s\S]*\.profile-stat:hover, \.profile-stat:focus-visible \{ text-decoration: none; \}/);
  assert.match(rendererSource, /\.profile-menu-row:hover, \.profile-menu-row:focus-visible \{[^}]*outline: 0;/);

  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, lease: { active: true }, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  root.appendChild(header.header);
  const profileEntry = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "avatar");
  const profilePanel = profileEntry && profileEntry.panel;
  assert.ok(profilePanel && profilePanel.__profileView);
  const profileContainer = profilePanel.children[0];
  assert.equal(profileContainer.getAttribute("class"), "vp-container profile-popover-surface");
  assert.deepEqual(profileContainer.children.map((node) => (node.getAttribute("class") || "").split(/\s+/)[0]), [
    "big-avatar-container--default", "profile-nickname", "levelIcon", "level-content", "profile-assets",
    "profile-stats", "profile-menu", "profile-menu-submenu-wrap", "logout"
  ]);
  assert.deepEqual(findNodesByClass(profilePanel, "profile-menu-label").map((node) => node.textContent), [
    "个人中心", "投稿管理", "推荐服务", "语言：简体中文", "退出"
  ]);
  const profileMenuRows = Object.fromEntries(findNodesByClass(profilePanel, "profile-menu-label")
    .map((label) => [label.textContent, label.parentNode.parentNode]));
  assert.deepEqual([
    profileMenuRows["个人中心"].getAttribute("href"),
    profileMenuRows["投稿管理"].getAttribute("href")
  ], [
    "https://account.bilibili.com/account/home",
    "https://member.bilibili.com/v2#/upload-manager/article"
  ]);
  for (const label of ["个人中心", "投稿管理"]) {
    assert.equal(profileMenuRows[label].getAttribute("target"), "_blank");
    assert.equal(profileMenuRows[label].getAttribute("rel"), "noopener noreferrer");
  }
  const mainIcons = findNodesByClass(profilePanel, "profile-menu-icon").map((node) => node.children[0]);
  assert.deepEqual(mainIcons.map((node) => node.getAttribute("data-glyph-codepoint")), [
    "U+E722", "U+E723", "U+E60F", "U+E757", "U+E721"
  ]);
  assert.equal(findNodesByClass(profilePanel, "profile-menu-arrow").every((node) => node.children[0].getAttribute("data-glyph-codepoint") === "U+E73B"), true);
  const assetIcons = findNodesByClass(profilePanel, "profile-asset-icon");
  assert.deepEqual(assetIcons.map((node) => node.getAttribute("data-glyph-codepoint")), ["U+E734", "U+E736"]);
  assert.equal(assetIcons.every((node) => node.textContent !== "币" && node.textContent !== "B"), true);
  assert.equal(assetIcons.every((node) => node.children[0].getAttribute("class").includes("icon-font-fallback--empty")), true);
  const serviceItems = findNodesByClass(profilePanel, "profile-submenu-item");
  assert.deepEqual(serviceItems.map((node) => node.children[1].textContent), ["B币钱包", "订单中心", "直播中心", "我的课程"]);
  assert.deepEqual(serviceItems.map((node) => node.children[0].getAttribute("data-glyph-codepoint")), ["U+E71F", "U+E71E", "U+E720", "U+E60E"]);
  assert.deepEqual(serviceItems.map((node) => node.getAttribute("href")), [
    "https://pay.bilibili.com/pay-v2-web/bcoin_index",
    "https://show.bilibili.com/orderlist",
    "https://link.bilibili.com/p/center/index",
    "https://www.bilibili.com/cheese/mine/list?csource=common_hp_myclass_null"
  ]);
  assert.equal(serviceItems.every((node) => node.getAttribute("target") === "_blank" && node.getAttribute("role") === "menuitem"), true);
  assert.equal(serviceItems.every((node) => !node.listeners.has("click")), true);
  const languageItems = findNodesByClass(profilePanel, "profile-language-item");
  assert.deepEqual(languageItems.map((node) => node.children[1].textContent), ["简体中文", "繁体中文"]);
  assert.deepEqual(languageItems.map((node) => node.getAttribute("aria-selected")), ["true", "false"]);
  assert.equal(languageItems[0].classList.contains("is-selected"), true);
  assert.equal(languageItems[1].classList.contains("is-selected"), false);
  assert.equal(languageItems[0].children[0].getAttribute("data-glyph-codepoint"), "U+E756");
  assert.equal(languageItems[1].children[0].getAttribute("data-glyph-codepoint"), "U+E756");
  assert.equal(languageItems[1].children[0].classList.contains("is-hidden"), true);
  assert.equal(languageItems[1].children[0].getAttribute("aria-hidden"), "true");
  assert.equal(languageItems.every((node) => !node.listeners.has("click")), true);
  const languageStateBeforeClick = languageItems.map((node) => ({
    selected: node.getAttribute("aria-selected"),
    checked: node.getAttribute("aria-checked"),
    className: node.getAttribute("class")
  }));
  for (const item of languageItems) item.dispatch("click", { detail: 1 });
  assert.deepEqual(languageItems.map((node) => ({
    selected: node.getAttribute("aria-selected"),
    checked: node.getAttribute("aria-checked"),
    className: node.getAttribute("class")
  })), languageStateBeforeClick, "language items are inert and keep selected state");
  assert.equal(document.defaultView.location.assigned, "");
  assert.equal(profileMenuRows["退出"].tagName, "BUTTON");
  assert.equal(profileMenuRows["退出"].getAttribute("type"), "button");
  assert.equal(profileMenuRows["退出"].getAttribute("href"), null);
  assert.equal(profileMenuRows["退出"].listeners.has("click"), false);
  const submenuWrappers = findNodesByClass(profilePanel, "profile-menu-submenu-wrap");
  assert.equal(submenuWrappers.length, 2);
  assert.equal(findNodesByClass(profilePanel, "profile-service-menu")[0].children[1].children.length, 4);
  assert.equal(findNodesByClass(profilePanel, "profile-language-menu")[0].children[1].children.length, 2);
  assert.equal(submenuWrappers.every((node) => node.children[0].getAttribute("aria-haspopup") === "menu" && node.children[0].getAttribute("aria-expanded") === "false"), true);
  for (const wrapper of submenuWrappers) {
    const trigger = wrapper.children[0];
    const submenuItems = wrapper.children[1].children;
    wrapper.dispatch("mouseenter");
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    for (const item of submenuItems) {
      wrapper.dispatch("mouseleave", { relatedTarget: item });
      item.dispatch("mouseenter", { relatedTarget: trigger });
      assert.equal(trigger.getAttribute("aria-expanded"), "true", "submenu pointer transfer remains expanded");
    }
    wrapper.dispatch("mouseleave", { relatedTarget: null });
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    trigger.focus();
    wrapper.dispatch("focusin");
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    for (const item of submenuItems) {
      item.focus();
      wrapper.dispatch("focusout", { relatedTarget: item });
      assert.equal(trigger.getAttribute("aria-expanded"), "true", "submenu focus transfer remains expanded");
    }
    submenuItems[submenuItems.length - 1].blur();
    wrapper.dispatch("focusout", { relatedTarget: null });
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    trigger.focus();
    wrapper.dispatch("focusin");
    trigger.dispatch("click", { detail: 1 });
    assert.equal(document.activeElement, null);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    trigger.focus();
    wrapper.dispatch("focusin");
    trigger.dispatch("click", { detail: 0 });
    assert.equal(document.activeElement, trigger);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    trigger.blur();
    wrapper.dispatch("focusout", { relatedTarget: null });
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
  }
  api.bindHeaderPopovers(header.popoverGroups, lifecycle.cleanups, lifecycle.isActive);
  assert.equal(profilePanel.getAttribute("aria-hidden"), "true");
  profileEntry.group.dispatch("mouseenter");
  assert.equal(profileEntry.group.classList.contains("is-popover-pending"), true);
  assert.equal([...document.timers.values()][0].delay, 150);
  document.runNextTimer();
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false");
  assert.equal(profileEntry.group.contains(profilePanel), false, "avatar panel is portal-mounted");
  assert.equal(profilePanel.parentNode, header.overlayLayer);
  profileEntry.group.dispatch("mouseleave", { relatedTarget: profilePanel });
  profilePanel.dispatch("mouseenter", { relatedTarget: profileEntry.trigger });
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false", "avatar to panel hover transfer stays open");
  assert.equal(document.timers.size, 0);
  profilePanel.dispatch("mouseleave", { relatedTarget: null });
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false", "panel leave uses delayed close");
  assert.equal(document.timers.size, 1);
  assert.equal([...document.timers.values()][0].delay, 280);
  profileEntry.group.dispatch("mouseenter", { relatedTarget: null });
  assert.equal(document.timers.size, 0, "transparent hover bridge cancels the gap close timer");
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false", "trigger to panel gap keeps popover open");
  profileEntry.group.dispatch("mouseleave", { relatedTarget: profilePanel });
  profilePanel.dispatch("mouseenter", { relatedTarget: profileEntry.trigger });
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false", "panel entry after hover bridge stays open");
  profilePanel.dispatch("mouseleave", { relatedTarget: null });
  assert.equal(document.timers.size, 1, "true surface leave still schedules close");
  assert.equal(document.runNextTimer(), true);
  assert.equal(profilePanel.getAttribute("aria-hidden"), "true");
  profileEntry.group.dispatch("focusin");
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false");
  profileEntry.group.dispatch("focusout", { relatedTarget: profilePanel });
  assert.equal(document.timers.size, 0);
  assert.equal(profilePanel.getAttribute("aria-hidden"), "false", "focus transfer inside group stays open");
  profileEntry.group.dispatch("focusout", { relatedTarget: null });
  assert.equal(document.timers.size, 1);
  assert.equal([...document.timers.values()][0].delay, 280);
  document.runNextTimer();
  assert.equal(profilePanel.getAttribute("aria-hidden"), "true");
  assert.equal(findNodesByClass(profilePanel, "profile-stat").length, 3);
  assert.equal(findNodesByClass(profilePanel, "profile-stat-value").every((node) => node.textContent === "--"), true);

  const profile = {
    face: "https://i0.hdslb.com/bfs/face/profile.webp",
    uname: "Yuki765",
    level: 6,
    currentExp: 43076,
    nextExp: null,
    coins: 906.4,
    vipStatus: 1,
    bcoin: 12.5,
    emailVerified: true,
    mobileVerified: false,
    followingUrl: "https://space.bilibili.com/123456/fans/follow",
    followerUrl: "https://space.bilibili.com/123456/fans/fans",
    dynamicUrl: "https://space.bilibili.com/123456/dynamic",
    favoriteUrl: "https://space.bilibili.com/123456/favlist"
  };
  api.setAuthStatus(header.statusText, header.statusPanel, "logged_in", profile);
  const vipTrigger = findNodesByClass(root, "mini-vip").find((node) => node.tagName === "A");
  const favoriteTrigger = findNodesByClass(root, "mini-favorite")[0];
  const historyTrigger = findNodesByClass(root, "mini-history")[0];
  const uploadTrigger = findNodesByClass(root, "mini-upload")[0];
  assert.deepEqual([vipTrigger.getAttribute("href"), vipTrigger.getAttribute("target"), vipTrigger.getAttribute("rel")], [
    "https://account.bilibili.com/big", "_blank", "noopener noreferrer"
  ]);
  assert.deepEqual([favoriteTrigger.getAttribute("href"), favoriteTrigger.getAttribute("target"), favoriteTrigger.getAttribute("rel")], [
    profile.favoriteUrl, "_blank", "noopener noreferrer"
  ]);
  assert.deepEqual([historyTrigger.getAttribute("href"), historyTrigger.getAttribute("target"), historyTrigger.getAttribute("rel")], [
    "https://www.bilibili.com/history", "_blank", "noopener noreferrer"
  ]);
  assert.deepEqual([uploadTrigger.getAttribute("href"), uploadTrigger.getAttribute("target"), uploadTrigger.getAttribute("rel")], [
    "https://member.bilibili.com/platform/home", "_blank", "noopener noreferrer"
  ]);
  assert.equal(profilePanel.__profileView.nickname.textContent, "Yuki765");
  assert.equal(profilePanel.__profileView.level.textContent, "等级 6");
  assert.equal(profilePanel.__profileView.coins.textContent, "906.4");
  assert.equal(profilePanel.__profileView.bcoin.textContent, "12.5");
  assert.equal(profilePanel.__profileView.mail.classList.contains("is-bound"), true);
  assert.equal(profilePanel.__profileView.mobile.classList.contains("is-bound"), false);
  assert.equal(profilePanel.__profileView.mail.children[0].getAttribute("data-glyph-codepoint"), "U+E735");
  assert.equal(profilePanel.__profileView.mobile.children[0].getAttribute("data-glyph-codepoint"), "U+E733");
  assert.equal(profilePanel.__profileView.mail.children[0].getAttribute("aria-hidden"), "true");
  assert.equal(profilePanel.__profileView.mobile.children[0].getAttribute("aria-hidden"), "true");
  assert.equal(profilePanel.__profileView.vip.textContent, "已开通");
  assert.equal(profileMenuRows["退出"].getAttribute("data-logout-state"), "ready");
  assert.equal(profileMenuRows["退出"].getAttribute("aria-disabled"), null);
  assert.equal(profilePanel.__profileView.avatarImage.getAttribute("src"), profile.face);
  assert.equal(profilePanel.__profileView.avatarImage.getAttribute("referrerpolicy"), "no-referrer");
  const avatarLink = findNodesByClass(profilePanel, "profile-avatar-frame")[0];
  assert.deepEqual([avatarLink.getAttribute("href"), avatarLink.getAttribute("target"), avatarLink.getAttribute("rel")], [
    "https://space.bilibili.com/", "_blank", "noopener noreferrer"
  ]);
  const levelLink = findNodesByClass(profilePanel, "profile-level-link")[0];
  assert.deepEqual([levelLink.getAttribute("href"), levelLink.getAttribute("target"), levelLink.getAttribute("rel")], [
    "https://account.bilibili.com/account/record?type=exp", "_blank", "noopener noreferrer"
  ]);
  const assetLinks = findNodesByClass(profilePanel, "profile-asset");
  assert.deepEqual(assetLinks.slice(0, 2).map((node) => [node.getAttribute("href"), node.getAttribute("target"), node.getAttribute("rel")]), [
    ["https://account.bilibili.com/site/coin", "_blank", "noopener noreferrer"],
    ["https://pay.bilibili.com/pay-v2-web/bcoin_index", "_blank", "noopener noreferrer"]
  ]);
  assert.deepEqual([
    profilePanel.__profileView.mail.getAttribute("href"),
    profilePanel.__profileView.mobile.getAttribute("href")
  ], [
    "https://passport.bilibili.com/account/security#/bindmail",
    "https://passport.bilibili.com/account/security#/bindphone"
  ]);
  assert.deepEqual([
    profilePanel.__profileView.statLinks.following.getAttribute("href"),
    profilePanel.__profileView.statLinks.follower.getAttribute("href"),
    profilePanel.__profileView.statLinks.dynamic_count.getAttribute("href")
  ], [profile.followingUrl, profile.followerUrl, profile.dynamicUrl]);
  assert.equal(profilePanel.__profileView.statLinks.following.getAttribute("target"), "_blank");
  assert.equal(profilePanel.__profileView.statLinks.following.getAttribute("rel"), "noopener noreferrer");
  assert.equal(root.querySelector(".mini-avatar__image").getAttribute("src"), profile.face);
  assert.equal(api.setProfileStats(profilePanel, { following: 11, follower: 22, dynamic_count: 33 }), true);
  assert.deepEqual([
    profilePanel.__profileView.stats.following.textContent,
    profilePanel.__profileView.stats.follower.textContent,
    profilePanel.__profileView.stats.dynamic_count.textContent
  ], ["11", "22", "33"]);
  assert.equal(api.setProfileStats(profilePanel, { following: -1, follower: 22, dynamic_count: 33 }), false);

  const hostile = { ...profile, face: "https://evil.example/avatar.jpg" };
  assert.equal(api.setProfileData(profilePanel, hostile), false);
  assert.equal(profilePanel.__profileView.avatarImage.getAttribute("src"), profile.face);
  api.setAuthStatus(header.statusText, header.statusPanel, "logged_out");
  assert.equal(favoriteTrigger.getAttribute("href"), null);
  assert.equal(favoriteTrigger.getAttribute("aria-disabled"), "true");
  assert.equal(profilePanel.__profileView.avatarImage.getAttribute("src"), null);
  assert.equal(profilePanel.__profileView.nickname.textContent, "请登录后查看个人资料");
  assert.equal(profilePanel.__profileView.loginMessage.textContent, "请登录后查看个人资料");
  assert.equal(profilePanel.__profileView.loginButton.getAttribute("hidden"), null);
  assert.equal(profilePanel.__profileView.privateSections.every((section) => section.getAttribute("hidden") === "true"), true);
  assert.equal(profilePanel.__profileView.bcoin.textContent, "--");
  assert.equal(profilePanel.__profileView.stats.following.textContent, "--");
  assert.equal(profilePanel.__profileView.statLinks.following.getAttribute("href"), null);
  assert.equal(profilePanel.__profileView.statLinks.follower.getAttribute("href"), null);
  assert.equal(profilePanel.__profileView.statLinks.dynamic_count.getAttribute("href"), null);
  assert.equal(profileMenuRows["退出"].getAttribute("data-logout-state"), "awaiting-auth");
  assert.equal(profileMenuRows["退出"].getAttribute("aria-disabled"), "true");
  api.setAuthStatus(header.statusText, header.statusPanel, "unknown");
  assert.equal(profilePanel.__profileView.nickname.textContent, "登录状态未知");
  assert.equal(profilePanel.__profileView.loginMessage.textContent, "登录状态未知");
  assert.equal(profilePanel.__profileView.loginButton.getAttribute("hidden"), "true");
  lifecycle.active = false;
});

check("14 popover inventory, ARIA, auth states and lifecycle", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const cleanups = [];
  const lifecycle = { root, cleanups, isActive: () => lifecycle.active, active: true };
  const header = api.createHeader(root, lifecycle);
  const kinds = new Set(header.popoverGroups.map((entry) => entry.panel.getAttribute("data-popover-kind")));
  assert.deepEqual([...kinds].sort(), ["avatar", "download", "dynamic", "favorite", "game", "history", "live", "login-rights", "login-tip", "manga", "message", "search", "upload", "vip"]);
  for (const entry of header.popoverGroups) {
    assert.equal(entry.trigger.getAttribute("aria-controls"), entry.panel.id);
    assert.equal(entry.trigger.getAttribute("aria-expanded"), "false");
    assert.equal(entry.panel.getAttribute("aria-hidden"), "true");
  }
  for (const status of ["logged_in", "logged_out", "unknown", "not-valid"]) {
    api.setAuthStatus(header.statusText, header.statusPanel, status);
    const expected = status === "not-valid" ? "unknown" : status;
    assert.equal(header.statusPanel.getAttribute("data-state"), expected);
    assert.equal(header.statusPanel.getAttribute("hidden"), expected === "logged_in" ? "true" : null);
    assert.equal(header.signin.getAttribute("hidden"), expected === "logged_in" ? null : "true");
    assert.equal(header.statusPanel.querySelector(".auth-branch--logout").getAttribute("hidden"), expected === "logged_out" ? null : "true");
    assert.equal(header.statusPanel.querySelector(".auth-branch--unknown").getAttribute("hidden"), expected === "unknown" ? null : "true");
  }
  api.bindHeaderPopovers(header.popoverGroups, cleanups, lifecycle.isActive);
  for (const entry of header.popoverGroups) {
    if (entry.panel.getAttribute("data-popover-kind") === "search") entry.trigger.dispatch("click", { button: 0 });
    else entry.group.dispatch("mouseenter");
    if (entry.panel.getAttribute("aria-hidden") === "true") {
      assert.equal(document.runNextTimer(), true, `${entry.panel.getAttribute("data-popover-kind")} has a scheduled open`);
    }
    assert.equal(entry.panel.getAttribute("aria-hidden"), "false");
    entry.panel.dispatch("keydown", { key: "Escape" });
    assert.equal(entry.panel.getAttribute("aria-hidden"), entry.panel.getAttribute("data-popover-kind") === "search" ? "false" : "true");
  }
  assert.ok(cleanups.length >= header.popoverGroups.length * 7);
  api.cleanupListeners(cleanups);
  assert.equal(cleanups.length, 0);
  const writesAfterCleanup = document.writes;
  lifecycle.active = false;
  header.popoverGroups[0].group.dispatch("mouseenter");
  header.popoverGroups[0].panel.dispatch("keydown", { key: "Escape" });
  assert.equal(document.writes, writesAfterCleanup);
});

check("header hover bridge and elevator stacking contexts", () => {
  assert.match(rendererSource, /const closeForNavigation = \(event\) => \{[\s\S]*navigationGuard\.lock\(\);[\s\S]*closeImmediately\(\);/);
  assert.match(rendererSource, /addListenerWithCleanup\(view, "blur", lockAndReset,[\s\S]*addListenerWithCleanup\(view, "pagehide", lockAndReset/);
  assert.match(rendererSource, /visibilityState === "hidden"\) lockAndReset\(\);[\s\S]*visibilityState === "visible"\) resetAll\(\);/);
  assert.match(rendererSource, /\.nav-user-center > \.user-con\.signin > \.item::after,[\s\S]*top: 30px;[^}]*z-index: 1999;[^}]*height: 26px;[^}]*pointer-events: auto;/s);
  assert.match(rendererSource, /\.header-overlay-layer > \.van-popper-nav \{[^}]*pointer-events: none;/s);
  assert.match(rendererSource, /\.header-overlay-layer > \.van-popper-nav\.is-popover-visible \{[^}]*pointer-events: auto;/s);
  assert.match(rendererSource, /\.header-popover-wrap::after \{[^}]*top: 36px;[^}]*z-index: 3199;[^}]*width: calc\(100% \+ 8px\);[^}]*height: 12px;[^}]*pointer-events: auto;/s);
  assert.doesNotMatch(rendererSource, /\.header-popover-wrap::after[^}]*240px/);
  assert.match(rendererSource, /\.header-popover \{[^}]*top: 48px;[^}]*z-index: 3200;/s);
  assert.match(rendererSource, /\.elevator \{[^}]*z-index: 10;/s);
  assert.match(rendererSource, /\.international-header \{ z-index: 3200; \}/);
  assert.match(rendererSource, /\.elevator\.edit \{ z-index: 1000; \}/);
  assert.match(rendererSource, /\.slicksort-selected \{[^}]*z-index: 1001;/s);
  assert.ok(rendererSource.lastIndexOf(".international-header { z-index: 3200; }")
    > rendererSource.indexOf(".elevator { position: fixed;"), "header layer override follows normal elevator layer");
  const headerZ = Number(rendererSource.match(/\.international-header \{ z-index: (\d+); \}/)?.[1]);
  const primaryMenuZ = Number(rendererSource.match(/\.primary-menu-wrap \{ position: relative; z-index: (\d+);/)?.[1]);
  assert.ok(Number.isFinite(headerZ) && Number.isFinite(primaryMenuZ) && headerZ > primaryMenuZ,
    "header stacking context is above the primary menu stacking context");

  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], isActive: () => lifecycle.active, active: true };
  const header = api.createHeader(root, lifecycle);
  api.bindHeaderPopovers(header.popoverGroups, lifecycle.cleanups, lifecycle.isActive);
  const dynamicEntry = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "dynamic");
  const favoriteEntry = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "favorite");
  assert.ok(dynamicEntry && favoriteEntry);
  dynamicEntry.group._rect = { left: 100, top: 0, width: 64, height: 36, right: 164, bottom: 36 };
  favoriteEntry.trigger._rect = { left: 184, top: 10, width: 40, height: 24, right: 224, bottom: 34 };
  assert.ok(dynamicEntry.group._rect.right + 4 < favoriteEntry.trigger._rect.left,
    "dynamic hover bridge stays clear of adjacent favorite trigger");
  dynamicEntry.group.dispatch("mouseenter");
  assert.equal(dynamicEntry.panel.getAttribute("aria-hidden"), "false");
  dynamicEntry.group.dispatch("mouseleave", { relatedTarget: null });
  assert.equal(document.timers.size, 1);
  dynamicEntry.group.dispatch("mouseenter", { relatedTarget: null });
  assert.equal(document.timers.size, 0, "dynamic trigger-to-panel bridge cancels close");
  assert.equal(dynamicEntry.panel.getAttribute("aria-hidden"), "false");
  favoriteEntry.group.dispatch("mouseenter", { relatedTarget: dynamicEntry.group });
  assert.equal([...document.timers.values()][0].delay, 150);
  document.runNextTimer();
  assert.equal(dynamicEntry.panel.getAttribute("aria-hidden"), "true", "adjacent panel closes when delayed target opens");
  assert.equal(favoriteEntry.panel.getAttribute("aria-hidden"), "false", "switching trigger opens favorite panel");
  lifecycle.active = false;
});

check("favorite dimensions, caps and two-column scrolling", () => {
  assert.match(rendererSource, /\.user-panel--favorite \{ width: 520px; height: 518px; \}/);
  assert.match(rendererSource, /\.user-panel--favorite \.tabs-panel \{[^}]*width: 149px; height: 100%;[^}]*box-sizing: border-box;[^}]*overflow-x: hidden; overflow-y: auto;/s);
  assert.match(rendererSource, /\.user-panel--favorite \.tab-item \{[^}]*width: 100%; min-width: 0; height: 46px;[^}]*box-sizing: border-box; overflow: hidden; padding: 0 16px;[^}]*font-size: 14px; font-weight: 400; line-height: normal;/s);
  assert.match(rendererSource, /\.user-panel--favorite \.tab-item \.title \{ width: 85px; min-width: 0; flex: 0 1 85px;[^}]*text-overflow: ellipsis;/s);
  assert.match(rendererSource, /\.user-panel--favorite \.tab-item \.num \{ flex: 0 0 auto; margin-left: auto; text-align: right;/);
  assert.match(rendererSource, /\.user-panel--favorite \.favorite-video-panel \{[^}]*width: 370px; height: 100%;[^}]*overflow: hidden;/);
  assert.match(rendererSource, /data\.tabs\.length > 20/);
});

check("favorite live card DOM, owner split, footer actions and final active colors", () => {
  assert.match(rendererSource, /\.header-overlay-layer > \.van-popper-nav\.user-panel--favorite \.tabs-panel > \.tab-item\.tab-item--active > \.title,[\s\S]*\.tab-item\.tab-item--active > \.num \{ color: #fff; \}/);
  assert.match(rendererSource, /\.international-header[\s\S]*\.item:nth-child\(3\) \.nav-item > \.t > a > \.name/);
  assert.match(rendererSource, /\.international-header[\s\S]*\.item:nth-child\(4\) \.nav-item > \.t > a > \.name/);
  assert.match(rendererSource, /bili-icon_dingdao_bofang.*0xE737/);
  assert.match(rendererSource, /\.favorite-video-card \{ display: flex;[^}]*padding: 8px 5px 8px 20px;/s);
  assert.match(rendererSource, /\.favorite-video-preview \{ position: relative;[^}]*width: 108px; height: 61px;/s);
  assert.match(rendererSource, /\.favorite-video-info \{ display: flex;[^}]*width: 210px;[^}]*margin-left: 12px;/s);
  assert.match(rendererSource, /\.favorite-video-owner \{[^}]*color: #999;[^}]*white-space: nowrap;/s);
  assert.match(rendererSource, /\.favorite-video-duration \{ position: absolute;[^}]*right: 0; bottom: 0;/s);

  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  const favoritePanel = header.summaryPanels.favorite;
  const data = {
    allHref: "https://space.bilibili.com/",
    tabs: [
      {
        key: "8", title: "默认收藏夹", count: 16,
        viewAllHref: "https://space.bilibili.com/", playAllHref: "https://www.bilibili.com/medialist/play/ml8",
        items: [{ title: "普通收藏", cover: "https://i1.hdslb.com/bfs/archive/favorite.webp", owner: "普通作者", duration: 65, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }]
      },
      {
        key: "LATER_VIEW", title: "稍后再看", count: 1,
        viewAllHref: "https://www.bilibili.com/watchlater/#/list", playAllHref: "https://www.bilibili.com/medialist/play/watchlater",
        items: [{ title: "稍后收藏", cover: "https://i0.hdslb.com/bfs/archive/later.webp", owner: "稍后作者", duration: -1, href: "https://www.bilibili.com/video/BV1234567890" }]
      }
    ]
  };
  assert.equal(api.setFavoriteData(favoritePanel, data), true);
  const firstCard = findNodesByClass(favoritePanel, "header-video-card")[0];
  assert.ok(firstCard);
  assert.deepEqual(firstCard.children.map((node) => node.getAttribute("class")), [
    "video-preview multiple-preview favorite-video-preview",
    "video-info favorite-video-info"
  ]);
  const preview = firstCard.children[0];
  assert.equal(preview.children[0].getAttribute("class"), "default-img favorite-video-cover");
  assert.equal(preview.children[1].getAttribute("class").includes("duration-tag"), true);
  assert.equal(firstCard.children[1].children[0].getAttribute("class"), "line-2 favorite-video-title");
  assert.equal(firstCard.children[1].children[1].children[0].getAttribute("class"), "up favorite-video-owner");
  assert.equal(firstCard.children[1].children[1].children[0].textContent, "普通作者");
  const tabsPanel = findNodesByClass(favoritePanel, "tabs-panel")[0];
  const tabButtons = tabsPanel.children.filter((node) => node.tagName === "BUTTON");
  assert.equal(tabButtons[0].classList.contains("tab-item--active"), true);
  assert.equal(tabButtons[0].children[0].textContent, "默认收藏夹");
  assert.equal(tabButtons[0].children[1].textContent, "16");
  const footer = findNodesByClass(favoritePanel, "play-view-all")[0];
  assert.equal(footer.children.length, 2);
  assert.equal(footer.children[0].getAttribute("href"), "https://space.bilibili.com/");
  assert.equal(footer.children[1].getAttribute("href"), "https://www.bilibili.com/medialist/play/ml8");
  assert.equal(footer.children[1].children[0].getAttribute("class").includes("bilifont"), true);
  assert.equal(footer.children[1].children[0].getAttribute("data-glyph-codepoint"), "U+E737");
  assert.equal(footer.children[1].textContent.endsWith("播放全部"), true);
  tabButtons[1].dispatch("click");
  assert.equal(tabButtons[1].classList.contains("tab-item--active"), true);
  assert.equal(tabButtons[1].children[0].textContent, "稍后再看");
  assert.equal(tabButtons[1].children[1].textContent, "1");
  assert.equal(findNodesByClass(favoritePanel, "favorite-video-duration").length, 0, "empty duration is not overlaid");
  const laterFooter = findNodesByClass(favoritePanel, "play-view-all")[0];
  assert.equal(laterFooter.children.length, 2);
  assert.equal(laterFooter.children[1].getAttribute("href"), "https://www.bilibili.com/medialist/play/watchlater");
  assert.equal(document.defaultView.location.assigned, "", "tab clicks stay local");
});

check("history dimensions, card media/copy structure, tabs and empty states", () => {
  assert.match(rendererSource, /\.user-panel--history \{ width: 370px; height: 518px; overscroll-behavior: contain; \}/);
  assert.match(rendererSource, /\.user-panel--history \.vp-container \{[^}]*width: 370px; height: 518px;[^}]*flex-direction: column;[^}]*overscroll-behavior: contain;/s);
  assert.match(rendererSource, /\.user-panel--history \.tab-header \{[^}]*flex: 0 0 50px;[^}]*height: 50px;/s);
  assert.match(rendererSource, /\.user-panel--history \.panel \{[^}]*min-height: 0;[^}]*flex: 1 1 auto;[^}]*overflow: hidden;[^}]*overscroll-behavior: contain;/s);
  assert.match(rendererSource, /\.user-panel--history \.history-list \{[^}]*min-height: 0;[^}]*overflow: hidden auto;[^}]*overscroll-behavior: contain;/s);
  assert.match(rendererSource, /\.user-panel--history \.history-card \{[^}]*width: 100%;[^}]*height: 77px;/s);
  assert.match(rendererSource, /\.history-card-media \{[^}]*width: 96px; height: 54px;[^}]*overflow: hidden;/s);
  assert.match(rendererSource, /\.history-card-cover \{[^}]*width: 96px; height: 54px;[^}]*object-fit: cover;/s);
  assert.match(rendererSource, /\.history-card-copy \{[^}]*min-width: 0;[^}]*flex: 1 1 auto;/s);
  assert.match(rendererSource, /\.history-card-title \{[^}]*-webkit-line-clamp: 2;/s);
  assert.match(rendererSource, /\.history-card-meta \{[^}]*font-size: 12px;/s);

  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  const historyPanel = header.summaryPanels.history;
  const data = {
    archive: [{ title: "视频标题", cover: "https://i0.hdslb.com/bfs/archive/history.webp", author: "视频作者", progress: 30, duration: 90, viewAt: 1, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }],
    live: [{ title: "直播标题", cover: "https://i1.hdslb.com/bfs/live/history.webp", author: "直播作者", progress: -1, duration: 0, viewAt: 2, href: "https://live.bilibili.com/123" }],
    article: [{ title: "专栏标题", cover: "https://i2.hdslb.com/bfs/article/history.webp", author: "专栏作者", progress: 0, duration: 60, viewAt: 3, href: "https://www.bilibili.com/read/cv123" }]
  };
  assert.equal(api.setHistoryData(historyPanel, data), true);
  const card = findNodesByClass(historyPanel, "history-card")[0];
  assert.ok(card);
  assert.deepEqual(card.children.map((node) => node.getAttribute("class")), [
    "history-card-media header-history-video__image",
    "history-card-copy header-history-card__info"
  ]);
  assert.equal(card.children[0].children[0].getAttribute("class"), "history-card-cover");
  assert.equal(findNodesByClass(card, "history-card-duration")[0].textContent, "1:30");
  assert.equal(findNodesByClass(card, "history-card-progress")[0].style.width, "33.33333333333333%");
  assert.equal(card.children[1].children[0].getAttribute("class"), "history-card-title");
  assert.equal(card.children[1].children[1].getAttribute("class"), "history-card-meta");

  const tabHeader = findNodesByClass(historyPanel, "tab-header")[0];
  let tabs = tabHeader.children;
  assert.equal(tabs.length, 3);
  assert.equal(tabs[0].classList.contains("tab-item--active"), true);
  tabs[1].dispatch("click");
  assert.equal(tabs[1].classList.contains("tab-item--active"), true);
  assert.equal(tabs[0].classList.contains("tab-item--active"), false);
  assert.equal(findNodesByClass(historyPanel, "history-card")[0].children[1].children[0].textContent, "直播标题");
  tabs[2].dispatch("click");
  assert.equal(tabs[2].classList.contains("tab-item--active"), true);
  assert.equal(tabs[1].classList.contains("tab-item--active"), false);
  assert.equal(findNodesByClass(historyPanel, "history-card")[0].children[1].children[0].textContent, "专栏标题");
  assert.equal(findNodesByClass(historyPanel, "view-all")[0].getAttribute("href"), "https://www.bilibili.com/history");

  assert.equal(api.setHistoryData(historyPanel, { archive: [], live: [], article: [] }), true);
  tabs = tabHeader.children;
  assert.equal(findNodesByClass(historyPanel, "empty-panel")[0].textContent, "好像最近没有看过视频历史呢");
  assert.equal(findNodesByClass(historyPanel, "view-all")[0].textContent, "查看全部");
  tabs[1].dispatch("click");
  assert.equal(findNodesByClass(historyPanel, "empty-panel")[0].textContent, "好像最近没有看过直播历史呢");
  tabs[2].dispatch("click");
  assert.equal(findNodesByClass(historyPanel, "empty-panel")[0].textContent, "好像最近没有看过专栏历史呢");
});

check("history wheel isolation preserves internal scroll and blocks page chaining", () => {
  assert.match(rendererSource, /data-popover-kind"\) === "history"[\s\S]*addListenerWithCleanup\(panel, "wheel", handleHistoryWheel, listenerCleanups, \{ passive: false \}\)/);

  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  const historyEntry = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "history");
  assert.ok(historyEntry);
  const historyPanel = historyEntry.panel;
  assert.equal(api.setHistoryData(historyPanel, {
    archive: [{ title: "视频", cover: "", author: "作者", progress: 0, duration: 60, viewAt: 1, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }],
    live: [],
    article: []
  }), true);
  const historyList = findNodesByClass(historyPanel, "history-list")[0];
  assert.ok(historyList);
  historyList.scrollHeight = 600;
  historyList.clientHeight = 200;
  api.bindHeaderPopovers(header.popoverGroups, lifecycle.cleanups, lifecycle.isActive);

  const wheelOptions = historyPanel.listenerOptions.get("wheel");
  assert.equal(wheelOptions.size, 1, "history panel has one wheel listener");
  assert.equal([...wheelOptions.values()][0].passive, false, "history wheel listener is non-passive");
  const dispatchWheel = (target, deltaY) => historyPanel.dispatch("wheel", { target, deltaY });
  const scrollTarget = historyList.children[0];

  historyList.scrollTop = 100;
  assert.equal(dispatchWheel(scrollTarget, 80).defaultPrevented, false, "middle scroll down stays internal");
  assert.equal(dispatchWheel(scrollTarget, -80).defaultPrevented, false, "middle scroll up stays internal");
  historyList.scrollTop = 0;
  assert.equal(dispatchWheel(scrollTarget, -80).defaultPrevented, true, "topward overscroll is blocked");
  assert.equal(dispatchWheel(scrollTarget, 80).defaultPrevented, false, "downward scroll from top stays internal");
  historyList.scrollTop = 400;
  assert.equal(dispatchWheel(scrollTarget, 80).defaultPrevented, true, "bottomward overscroll is blocked");
  assert.equal(dispatchWheel(scrollTarget, -80).defaultPrevented, false, "upward scroll from bottom stays internal");

  const tab = findNodesByClass(historyPanel, "tab-item")[0];
  const viewAll = findNodesByClass(historyPanel, "view-all")[0];
  assert.equal(dispatchWheel(tab, 80).defaultPrevented, true, "tab wheel is blocked");
  assert.equal(dispatchWheel(viewAll, 80).defaultPrevented, true, "view-all wheel is blocked");
  assert.equal(api.setHistoryData(historyPanel, { archive: [], live: [], article: [] }), true);
  const empty = findNodesByClass(historyPanel, "empty-panel")[0];
  assert.equal(dispatchWheel(empty, 80).defaultPrevented, true, "empty-state wheel is blocked");

  api.cleanupListeners(lifecycle.cleanups);
  assert.equal(historyPanel.listeners.get("wheel").size, 0, "history wheel listener is cleaned up");
  assert.equal(lifecycle.cleanups.length, 0);
});

check("fixed game/live asset mapping and arrays", () => {
  const gameKeys = [
    "MINI_GAME_FEATURED", "MINI_GAME_TILE_01", "MINI_GAME_TILE_02", "MINI_GAME_TILE_03",
    "MINI_GAME_HOVER_01", "MINI_GAME_TITLE", "MINI_GAME_LINE", "MINI_GAME_SHADOW",
    "MINI_GAME_HOVER_02", "MINI_GAME_HOVER_03", "MINI_GAME_HOVER_04", "MINI_GAME_HOVER_05",
    "MINI_GAME_HOVER_06", "MINI_GAME_HOVER_07"
  ];
  const liveKeys = [
    "MINI_LIVE_FACE_01", "MINI_LIVE_FACE_02", "MINI_LIVE_FACE_03",
    "MINI_LIVE_FACE_04", "MINI_LIVE_FACE_05", "MINI_LIVE_FACE_06"
  ];
  const mangaKeys = [
    "MINI_MANGA_RANK_01", "MINI_MANGA_RANK_02", "MINI_MANGA_RANK_03",
    "MINI_MANGA_RANK_04", "MINI_MANGA_RANK_05", "MINI_MANGA_RANK_06"
  ];
  const mangaRecommendKeys = [
    "MINI_MANGA_RECOMMEND_01", "MINI_MANGA_RECOMMEND_02", "MINI_MANGA_RECOMMEND_03", "MINI_MANGA_RECOMMEND_04"
  ];
  const allKeys = [...gameKeys, ...liveKeys, ...mangaKeys, ...mangaRecommendKeys];
  assert.equal(new Set(allKeys.map((key) => api.ASSET_KEYS[key])).size, 30);
  for (const key of allKeys) {
    assert.equal(api.resolveAssetKey(api.ASSET_KEYS[key]), api.ASSET_KEYS[key]);
  }
  assert.equal(api.resolveAssetKey("assets/homepage/mini-header-popovers/manga/not-imported.png"), null);
  assert.equal(api.resolveAssetKey("../assets/homepage/mini-header-popovers/game/hover.png"), null);
  assert.equal(api.resolveAssetKey(`${api.ASSET_KEYS.MINI_GAME_HOVER_01}?x=1`), null);
  assert.equal(api.resolveAssetKey("assets/homepage/mini-header-popovers/manga/recommend-5d41943c5e2e71c1fb6564676c1ee312ea2684f5.png@272w?x=1"), null);
  assert.ok(Object.isFrozen(api.GAME_PREVIEW_ITEMS));
  assert.ok(Object.isFrozen(api.LIVE_ITEMS));
  assert.ok(Object.isFrozen(api.MANGA_ITEMS));
  assert.ok(Object.isFrozen(api.MANGA_RECOMMEND_ITEMS));
  assert.equal(rendererSource.includes("预约中"), false);
  assert.deepEqual(Array.from(api.GAME_PREVIEW_ITEMS, (item) => item.key), [
    api.ASSET_KEYS.MINI_GAME_HOVER_01,
    api.ASSET_KEYS.MINI_GAME_HOVER_02,
    api.ASSET_KEYS.MINI_GAME_HOVER_03,
    api.ASSET_KEYS.MINI_GAME_HOVER_04,
    api.ASSET_KEYS.MINI_GAME_HOVER_05,
    api.ASSET_KEYS.MINI_GAME_HOVER_06,
    api.ASSET_KEYS.MINI_GAME_HOVER_07
  ]);
  assert.equal(api.GAME_PREVIEW_ITEMS.length, 7);
  assert.equal(api.LIVE_ITEMS.length, 6);
  assert.match(rendererSource, /\.popover-game \{ top: 47px; width: 680px; height: 260px/);
  assert.match(rendererSource, /\.box\.clearfix \{[^}]*position: relative;[^}]*width: 422\.5064px; height: 235\.7336px;[^}]*overflow: visible;[^}]*border-radius: 0 0 3\.626px 3\.626px;[^}]*background: #fff;[^}]*box-shadow: \.906px \.906px 2\.72px rgba\(0, 0, 0, \.4\)/s);
  const gameHostSurfaceRule = rendererSource.match(/\.header-overlay-layer > \.popover-game\s*\{([^}]*)\}/s);
  assert.ok(gameHostSurfaceRule, "game portal host has a final surface reset rule");
  for (const declaration of ["border: 0;", "border-radius: 0;", "box-shadow: none;", "background: transparent;", "outline: 0;", "filter: none;"]) {
    assert.match(gameHostSurfaceRule[1], new RegExp(declaration.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")), declaration);
  }
  assert.ok(rendererSource.indexOf(gameHostSurfaceRule[0]) > rendererSource.indexOf(".header-overlay-layer > .header-popover"),
    "game host reset follows the generic portal surface rule");
  assert.match(rendererSource, /\.box\.clearfix \{[^}]*box-shadow: \.906px \.906px 2\.72px rgba\(0, 0, 0, \.4\)/s,
    "game box keeps its evidence shadow");
  assert.match(rendererSource, /\.left \{[^}]*float: left; width: 240\.262px;[^}]*margin-top: 10\.88px/s);
  assert.match(rendererSource, /\.box\.clearfix > \.left > \.banner \{[^}]*min-height: 0;[^}]*width: 217\.6px; height: 116\.05px; margin-left: 10\.875px; overflow: visible; background: transparent;/s);
  assert.match(rendererSource, /\.banner > a > img \{[^}]*width: 217\.6px; height: 116\.05px;[^}]*border-radius: 3\.626px/s);
  assert.match(rendererSource, /\.banner > a > span \{[^}]*bottom: 0; left: 0;[^}]*font-size: 10\.88px; line-height: 27\.2px;[^}]*text-shadow: \.906px \.906px \.906px #000/s);
  assert.match(rendererSource, /\.brief\.clearfix \{[^}]*width: 240\.262px;[^}]*margin-top: 5\.44px; padding: 0 5\.44px/s);
  assert.match(rendererSource, /\.brief\.clearfix > a \{[^}]*width: 76\.15px; height: 103\.35px; padding-top: 5\.44px/s);
  assert.match(rendererSource, /\.brief\.clearfix > a > img \{[^}]*width: 58\.025px; height: 58\.025px;[^}]*border-radius: 10\.88px/s);
  assert.match(rendererSource, /\.brief\.clearfix > a > span \{[^}]*width: 65\.28px; height: 36\.267px;[^}]*font-size: 10\.88px; line-height: 18\.133px;[^}]*text-overflow: ellipsis/s);
  assert.match(rendererSource, /\.right \{[^}]*float: left; width: 182\.238px; min-height: 212\.15px; margin-top: 10\.88px/s);
  assert.match(rendererSource, /\.all \{[^}]*width: 176\.8px;[^}]*padding: 31\.7336px 0 0 5\.44px/s);
  assert.match(rendererSource, /\.all > a \{[^}]*width: 176\.8px; height: 25\.375px;[^}]*color: #222;[^}]*line-height: 25\.3864px;[^}]*white-space: nowrap/s);
  assert.match(rendererSource, /\.all > a > span \{[^}]*height: 25\.375px;[^}]*text-overflow: ellipsis;[^}]*white-space: nowrap/s);
  assert.match(rendererSource, /\.all > a:hover, \.all > a:focus-visible, \.all > a\.is-active \{ color: #00a1d6; \}/);
  assert.match(rendererSource, /\.imgdiv \{[^}]*position: absolute; bottom: 0; left: 400\.738px; width: 199\.463px; height: 199\.463px;[^}]*background-size: cover/s);
  assert.ok(400.738 + 199.463 <= 680 && 199.463 <= 260);
  assert.match(rendererSource, /\.popover-game \{[^}]*overflow: visible;[^}]*background: transparent/s);
  for (const removedClass of ["game-box", "game-row", "game-surface", "game-feature-card", "game-featured-frame", "game-preview-column", "game-preview-list", "game-preview-frame", "game-preview-title", "game-feature-shadow", "game-feature-line"]) {
    assert.equal(rendererSource.includes(removedClass), false, removedClass);
  }
  assert.match(rendererSource, /\.popover-interactive-item \{ display: grid; grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(rendererSource, /width: 64px; height: 64px/);
  assert.deepEqual(Array.from(api.MANGA_ITEMS, (item) => item.title), [
    "是师姐，我们有救了！", "碧蓝之海", "不小心救了江湖公敌", "间谍过家家", "杀死男主然后成为女魔头", "金牌得主"
  ]);
  assert.deepEqual(Array.from(api.MANGA_RECOMMEND_ITEMS, (item) => ({ key: item.key, title: item.title })), [
    { key: api.ASSET_KEYS.MINI_MANGA_RECOMMEND_02, title: "石之海（乔乔的奇妙...）" },
    { key: api.ASSET_KEYS.MINI_MANGA_RECOMMEND_01, title: "刀剑神域 Alicization篇" },
    { key: api.ASSET_KEYS.MINI_MANGA_RECOMMEND_03, title: "鬼灭之刃" },
    { key: api.ASSET_KEYS.MINI_MANGA_RECOMMEND_04, title: "一拳超人" }
  ]);
  assert.equal(api.MANGA_RECOMMEND_ITEMS.length, 4);
  assert.match(rendererSource, /\.manga-app-layout \{[^}]*width: 520px; height: 260px; padding: 20px 0 20px 20px;[^}]*overflow: visible;[^}]*border-radius: 0 0 4px 4px;[^}]*background: #fff;[^}]*box-shadow: 1px 1px 3px rgba\(0, 0, 0, \.4\)/s);
  assert.match(rendererSource, /\.manga-recommendation-list \{[^}]*width: 292px; margin-right: 20px;[^}]*flex-flow: row wrap;[^}]*justify-content: space-between/s);
  assert.match(rendererSource, /\.manga-recommend-item \{[^}]*width: 136px; height: 101\.75px; margin-bottom: 20px/s);
  assert.match(rendererSource, /\.manga-recommend-image-surface \{ width: 136px; height: 77px;[^}]*border-radius: 2px/s);
  assert.match(rendererSource, /\.manga-recommend-title \{[^}]*width: 136px; height: 18\.75px; margin-top: 6px;[^}]*font-size: 13px/s);
  assert.match(rendererSource, /\.manga-divider \{[^}]*width: 1px; height: 220px; background: rgba\(0, 0, 0, \.1\)/s);
  assert.match(rendererSource, /\.manga-popularity-list \{[^}]*width: 187px; height: 220px; overflow: visible; background: transparent/s);
  assert.match(rendererSource, /\.manga-popularity-title \{ height: 22\.875px; margin: 0 0 0 20px;[^}]*line-height: 22\.875px;/s);
  const mangaPanelTop = 57;
  const mangaTitleY = mangaPanelTop + 20;
  const mangaItemsY = mangaTitleY + 22.875 + 8;
  const mangaLastRowBottom = Number((mangaItemsY + (6 * 33.8)).toFixed(3));
  const mangaAppBottom = mangaPanelTop + 260;
  assert.equal(mangaTitleY, 77);
  assert.equal(mangaItemsY, 107.875);
  assert.equal(mangaLastRowBottom, 310.675);
  assert.equal(mangaAppBottom, 317);
  assert.equal(Number((mangaAppBottom - mangaLastRowBottom).toFixed(3)), 6.325);
  assert.match(rendererSource, /\.manga-popularity-items \{[^}]*width: 187px; height: 202\.8px; margin-top: 8px;[^}]*font-size: 13px; line-height: 33\.8px/s);
  assert.match(rendererSource, /\.manga-popularity-row \{[^}]*width: 187px; height: 33\.8px; padding: 0 20px/s);
  assert.match(rendererSource, /\.manga-popularity-index \{ color: #cf9870; \}/);
  assert.match(rendererSource, /\.manga-popularity-label \{ margin-left: 10px;/);
  assert.match(rendererSource, /\.manga-float-image \{[^}]*top: 2\.5%; left: 95%; width: 160px; height: 213px;[^}]*overflow: hidden;[^}]*border-radius: 4px;[^}]*background: transparent;[^}]*box-shadow: 0 12px 24px -6px rgba\(0, 0, 0, \.3\)/s);
  assert.ok(333 + (187 * .95) + 160 <= 720);
  for (const removedClass of ["manga-surface", "manga-feature-grid", "manga-preview-cell", "manga-preview-frame", "manga-preview-list", "manga-preview-items", "manga-feature-spacer"]) {
    assert.equal(rendererSource.includes(removedClass), false, removedClass);
  }
});

check("anchor-aware kind offsets, clamp and fixed dimensions", () => {
  const document = new FakeDocument();
  document.defaultView.innerWidth = 1520.8;
  document.defaultView.innerHeight = 800;
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const header = api.createHeader(root, lifecycle);
  const expected = { game: [74, 57, 680, 260], live: [140, 57, 528, 266], manga: [230, 57, 720, 266] };
  for (const kind of ["game", "live", "manga", "download"]) {
    const portalEntry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === kind);
    assert.equal(portalEntry.portal, true, `${kind} uses the fixed overlay portal`);
    assert.equal(portalEntry.panel.parentNode, header.overlayLayer, `${kind} panel is portal-mounted`);
  }
  const triggerRects = { game: [122, 13.5, 56, 32, 178, 45.5], live: [188, 13.5, 28, 32, 216, 45.5], manga: [278, 13.5, 28, 32, 306, 45.5] };
  for (const [kind, [left, top, width, height, right, bottom]] of Object.entries(triggerRects)) {
    const entry = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === kind);
    entry.group._rect = { left: 0, top: 0, width: right - left, height: bottom - top, right, bottom };
    entry.trigger._rect = { left, top, width, height, right, bottom };
    entry.panel.style.left = "9999px";
    entry.panel.style.top = "9999px";
    entry.panel.setAttribute("data-page-offset", "0");
    const positioned = api.positionHeaderPopover(entry);
    assert.deepEqual([positioned.left, positioned.top, positioned.width, positioned.height], expected[kind]);
    assert.equal(entry.panel.getAttribute("data-anchor-rect"), expected[kind].join(","));
    assert.equal(entry.panel.style.left, `${left - 48}px`);
    assert.equal(entry.panel.style.top, "57px");
  }
  document.defaultView.innerWidth = 1000;
  document.defaultView.innerHeight = 700;
  const edge = header.popoverGroups.find((candidate) => candidate.panel.getAttribute("data-popover-kind") === "game");
  edge.group._rect = { left: 900, top: 0, width: 80, height: 40, right: 980, bottom: 40 };
  edge.trigger._rect = { left: 920, top: 10, width: 40, height: 24, right: 960, bottom: 34 };
  const clamped = api.positionHeaderPopover(edge);
  assert.deepEqual([clamped.left, clamped.top, clamped.width, clamped.height], [312, 45.5, 680, 260]);
  assert.equal(edge.panel.style.left, "312px");
  assert.equal(edge.panel.style.top, "45.5px");
  assert.equal(edge.panel.getAttribute("data-anchor-rect"), "312,45.5,680,260");
  for (const viewportWidth of [1366, 1600, 1920]) {
    document.defaultView.innerWidth = viewportWidth;
    document.defaultView.innerHeight = 800;
    for (const kind of ["game", "live", "manga"]) {
      const candidate = header.popoverGroups.find((item) => item.panel.getAttribute("data-popover-kind") === kind);
      candidate.group._rect = { left: viewportWidth - 70, top: 0, width: 70, height: 40, right: viewportWidth, bottom: 40 };
      candidate.trigger._rect = { left: viewportWidth - 40, top: 10, width: 28, height: 24, right: viewportWidth - 12, bottom: 34 };
      const result = api.positionHeaderPopover(candidate);
      assert.equal(result.width, { game: 680, live: 528, manga: 720 }[kind]);
      assert.equal(result.height, { game: 260, live: 266, manga: 266 }[kind]);
      assert.ok(result.left >= 8);
      assert.ok(result.left + result.width <= viewportWidth - 8);
    }
  }
  api.bindHeaderPopovers(header.popoverGroups, lifecycle.cleanups, lifecycle.isActive);
  for (const kind of ["game", "live", "manga"]) {
    const candidate = header.popoverGroups.find((item) => item.panel.getAttribute("data-popover-kind") === kind);
    candidate.group.dispatch("mouseenter");
    assert.equal(candidate.panel.getAttribute("data-anchor-positioned"), "true");
    candidate.panel.dispatch("keydown", { key: "Escape" });
  }
  lifecycle.destroy();
});

check("game reducer hover/focus/keyboard/Escape and unique active", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const panel = api.createGamePopover(root, lifecycle);
  root.appendChild(panel);
  const interaction = panel.__miniHeaderInteraction;
  const box = panel.children[0];
  const left = box.children[0];
  const right = box.children[1];
  const preview = box.children[2];
  assert.deepEqual([box.getAttribute("class"), left.getAttribute("class"), right.getAttribute("class"), preview.getAttribute("class")], [
    "box clearfix", "left", "right", "imgdiv"
  ]);
  assert.equal(panel.children.length, 1);
  assert.equal(box.children.length, 3);
  assert.deepEqual(box.children, [left, right, preview]);
  assert.equal(preview.parentNode, box);
  assert.equal(preview.style.backgroundImage || "none", "none");
  assert.equal(preview.style.backgroundRepeat, "no-repeat");
  const banner = left.children[0];
  const brief = left.children[1];
  const bannerLink = banner.children[0];
  assert.deepEqual([banner.getAttribute("class"), brief.getAttribute("class")], ["banner", "brief clearfix"]);
  assert.equal(bannerLink.getAttribute("target"), "_blank");
  assert.equal(bannerLink.getAttribute("rel"), "noopener noreferrer");
  assert.equal(bannerLink.getAttribute("href"), api.NAV_ALLOWLIST.GAME.href);
  assert.equal(bannerLink.children.length, 2);
  assert.equal(bannerLink.children[0].tagName, "IMG");
  assert.equal(bannerLink.children[0].getAttribute("src").replace("chrome-extension://mini-header-test/", ""), api.ASSET_KEYS.MINI_GAME_FEATURED);
  assert.equal(bannerLink.children[1].tagName, "SPAN");
  assert.equal(bannerLink.children[1].textContent, "命运-冠位指定（Fate/GO）");
  assert.equal(bannerLink.children[1].style.backgroundImage, `url("chrome-extension://mini-header-test/${api.ASSET_KEYS.MINI_GAME_SHADOW}")`);
  assert.equal(bannerLink.children[1].style.backgroundRepeat, "repeat-x");
  const tiles = Array.from(brief.children);
  assert.equal(tiles.length, 3);
  assert.equal(tiles.every((node) => node.getAttribute("target") === "_blank" && node.getAttribute("rel") === "noopener noreferrer" && node.getAttribute("href") === api.NAV_ALLOWLIST.GAME.href), true);
  assert.equal(tiles.every((node) => node.children.length === 2 && node.children[0].tagName === "IMG" && node.children[1].tagName === "SPAN"), true);
  assert.deepEqual(tiles.map((node) => node.children[1].textContent), [
    "碧蓝航线", "坎特伯雷公主与骑士唤醒冠军之剑的奇幻冒险", "时空猎人3"
  ]);
  assert.deepEqual(tiles.map((node) => node.children[0].getAttribute("src").replace("chrome-extension://mini-header-test/", "")), [
    api.ASSET_KEYS.MINI_GAME_TILE_01, api.ASSET_KEYS.MINI_GAME_TILE_02, api.ASSET_KEYS.MINI_GAME_TILE_03
  ]);
  const all = right.children[0];
  assert.equal(all.getAttribute("class"), "all");
  assert.equal(right.children.length, 1);
  assert.equal(right.style.backgroundImage, `url("chrome-extension://mini-header-test/${api.ASSET_KEYS.MINI_GAME_LINE}")`);
  assert.equal(right.style.backgroundRepeat, "no-repeat");
  assert.equal(all.style.backgroundImage, `url("chrome-extension://mini-header-test/${api.ASSET_KEYS.MINI_GAME_TITLE}")`);
  assert.equal(all.style.backgroundRepeat, "no-repeat");
  assert.equal(findNodesByClass(panel, "all").length, 1);
  assert.equal(findNodesByClass(panel, "game-feature-card").length, 0);
  assert.equal(findNodesByClass(panel, "game-preview-column").length, 0);
  assert.equal(findNodesByClass(panel, "game-preview-frame").length, 0);
  assert.equal(findNodesByClass(panel, "game-gray-footer").length, 0);
  assert.equal(interaction.itemNodes.length, 7);
  assert.equal(all.children.length, 7);
  assert.equal(interaction.itemNodes.every((node) => node.parentNode === all && node.tagName === "A" && node.getAttribute("target") === "_blank" && node.getAttribute("rel") === "noopener noreferrer" && node.getAttribute("href") === api.NAV_ALLOWLIST.GAME.href), true);
  assert.equal(interaction.itemNodes.every((node) => node.children.length === 1), true);
  assert.equal(interaction.itemNodes.every((node) => node.children[0].tagName === "SPAN"), true);
  assert.equal(interaction.itemNodes.some((node) => node.textContent.includes("预约中")), false);
  assert.equal(interaction.previewFrame.getAttribute("aria-hidden"), "true");
  assert.equal(interaction.previewImage, null);
  const assertOnlyActive = (expected) => {
    const active = interaction.itemNodes.filter((node) => node.classList.contains("is-active"));
    assert.equal(active.length, expected ? 1 : 0);
    if (expected) assert.equal(active[0].getAttribute("data-fixed-key"), expected);
  };
  for (let index = 0; index < interaction.itemNodes.length; index += 1) {
    const node = interaction.itemNodes[index];
    interaction.clearActive();
    node.dispatch("pointerenter");
    assertOnlyActive(api.GAME_PREVIEW_ITEMS[index].key);
    assert.equal(node.getAttribute("aria-expanded"), "true");
    assert.equal(interaction.previewFrame.getAttribute("aria-hidden"), "false");
    assert.equal(interaction.previewFrame.style.backgroundImage, `url("chrome-extension://mini-header-test/${api.GAME_PREVIEW_ITEMS[index].key}")`);
    node.dispatch("focusin");
    node.dispatch("keydown", { key: "Enter" });
    node.dispatch("keydown", { key: " " });
    node.dispatch("keydown", { key: "Space" });
    assertOnlyActive(api.GAME_PREVIEW_ITEMS[index].key);
  }
  const first = interaction.itemNodes[0];
  const second = interaction.itemNodes[1];
  second.dispatch("pointerenter");
  first.dispatch("pointerleave", { relatedTarget: second });
  assertOnlyActive(api.GAME_PREVIEW_ITEMS[1].key);
  second.dispatch("focusout", { relatedTarget: first });
  assertOnlyActive(api.GAME_PREVIEW_ITEMS[1].key);
  second.dispatch("pointerleave", { relatedTarget: null });
  assertOnlyActive(null);
  assert.equal(interaction.previewFrame.style.backgroundImage, "none");
  first.dispatch("pointerenter");
  panel.dispatch("keydown", { key: "Escape" });
  assertOnlyActive(null);
  assert.equal(interaction.previewFrame.getAttribute("aria-hidden"), "true");
  assert.equal(interaction.previewFrame.style.backgroundImage, "none");
  assert.equal(lifecycle.cleanups.length > 0, true);
  lifecycle.destroy();
  assert.equal(lifecycle.cleanups.length, 0);
});

check("manga reducer uses six local ordered previews", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const panel = api.createMangaPopover(root, lifecycle);
  root.appendChild(panel);
  const interaction = panel.__miniHeaderInteraction;
  const app = panel.children[0];
  const recommendations = app.children[0];
  const divider = app.children[1];
  const popularity = app.children[2];
  assert.deepEqual([app.getAttribute("class"), recommendations.getAttribute("class"), divider.getAttribute("class"), popularity.getAttribute("class")], [
    "manga-app-layout", "manga-recommendation-list", "manga-divider", "manga-popularity-list"
  ]);
  assert.equal(panel.children.length, 1);
  assert.equal(app.children.length, 3);
  const cards = findNodesByClass(panel, "manga-recommend-item");
  const recommendationImages = findNodesByClass(panel, "manga-recommend-image");
  const recommendationTitles = findNodesByClass(panel, "manga-recommend-title");
  assert.equal(cards.length, 4);
  assert.equal(recommendationImages.length, 4);
  assert.deepEqual(Array.from(recommendationImages, (node, index) => ({
    key: node.getAttribute("src").replace("chrome-extension://mini-header-test/", ""),
    title: recommendationTitles[index].textContent
  })), Array.from(api.MANGA_RECOMMEND_ITEMS, (item) => ({ key: item.key, title: item.title })));
  assert.equal(cards.every((card, index) => card.parentNode === recommendations && card.children[0].getAttribute("class") === "manga-recommend-image-surface" && card.children[1] === recommendationTitles[index]), true);
  assert.equal(divider.children.length, 0);
  assert.equal(popularity.children[0].getAttribute("class"), "manga-popularity-title");
  assert.equal(popularity.children[0].textContent, "人气漫画");
  assert.equal(popularity.children[1].getAttribute("class"), "manga-popularity-items");
  assert.equal(popularity.children[2], interaction.previewFrame);
  for (const removedClass of ["manga-feature-spacer", "manga-preview-cell", "manga-preview-frame", "manga-feature-grid"]) {
    assert.equal(findNodesByClass(panel, removedClass).length, 0, removedClass);
  }
  assert.equal(panel.textContent.includes("漫画预览"), false);
  assert.equal(panel.textContent.includes("浮漫画预览"), false);
  assert.equal(panel.textContent.includes("图片不可用"), false);
  assert.equal(interaction.previewFrame.getAttribute("class"), "manga-float-image");
  assert.equal(interaction.previewFrame.parentNode, popularity);
  assert.equal(interaction.previewFrame.children[0].getAttribute("class"), "manga-float-image-loader");
  assert.equal(interaction.previewFrame.getAttribute("aria-label"), "漫画封面");
  assert.equal(interaction.previewImage.getAttribute("alt"), null);
  assert.equal(interaction.previewImage.getAttribute("src"), null);
  assert.equal(interaction.previewImage.classList.contains("is-ready"), false);
  assert.equal(interaction.previewFrame.children[1].getAttribute("hidden"), "true");
  assert.equal(interaction.previewFrame.children[1].textContent, "封面暂不可用");
  assert.equal(panel.textContent.includes("漫画封面"), false);
  assert.equal(interaction.itemNodes.length, 6);
  assert.equal(popularity.children[1].children.length, 6);
  assert.deepEqual(Array.from(interaction.itemNodes, (node) => [node.children[0].textContent, node.children[1].textContent]), [
    ["1", "是师姐，我们有救了！"], ["2", "碧蓝之海"], ["3", "不小心救了江湖公敌"],
    ["4", "间谍过家家"], ["5", "杀死男主然后成为女魔头"], ["6", "金牌得主"]
  ]);
  interaction.itemNodes.forEach((node, index) => {
    interaction.clearActive();
    assert.equal(node.getAttribute("data-fixed-key"), api.MANGA_ITEMS[index].key);
    assert.equal(node.getAttribute("class"), "manga-popularity-row");
    assert.equal(node.children.length, 2);
    node.dispatch("mouseenter");
    assert.equal(interaction.activeKey, api.MANGA_ITEMS[index].key);
    assert.equal(interaction.previewFrame.getAttribute("aria-hidden"), "false");
    assert.equal(interaction.previewImage.getAttribute("alt"), null);
    assert.equal(interaction.previewImage.classList.contains("is-ready"), false);
    assert.equal(interaction.previewFrame.children[1].getAttribute("hidden"), null);
    interaction.previewImage.dispatch("load");
    assert.equal(interaction.previewImage.classList.contains("is-ready"), true);
    assert.equal(interaction.previewFrame.children[1].getAttribute("hidden"), "true");
  });
  interaction.clearActive();
  interaction.itemNodes[0].dispatch("mouseenter");
  interaction.previewImage.dispatch("error");
  assert.equal(interaction.previewImage.getAttribute("src"), null);
  assert.equal(interaction.previewImage.getAttribute("alt"), null);
  assert.equal(interaction.previewImage.classList.contains("is-ready"), false);
  assert.equal(interaction.previewFrame.children[1].getAttribute("hidden"), null);
  assert.equal(interaction.previewFrame.children[1].textContent, "封面暂不可用");
  panel.dispatch("keydown", { key: "Escape" });
  assert.equal(interaction.activeKey, null);
  lifecycle.destroy();
});

check("manga preview ancestry stays transparent", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const panel = api.createMangaPopover(root, lifecycle);
  root.appendChild(panel);
  const previewImage = panel.__miniHeaderInteraction.previewImage;
  assert.deepEqual([
    previewImage.getAttribute("class"),
    previewImage.parentNode.getAttribute("class"),
    previewImage.parentNode.parentNode.getAttribute("class"),
    previewImage.parentNode.parentNode.parentNode.getAttribute("class"),
    previewImage.parentNode.parentNode.parentNode.parentNode.getAttribute("class")
  ], [
    "manga-float-image-loader",
    "manga-float-image",
    "manga-popularity-list",
    "manga-app-layout",
    "header-popover popover-manga"
  ]);
  for (const selector of ["popover-manga", "manga-popularity-list", "manga-float-image", "manga-float-image-loader", "manga-float-image-fallback"]) {
    assert.match(rendererSource, new RegExp(`\\.${selector} \\{[^}]*background: transparent;`, "s"), selector);
  }
  assert.match(rendererSource, /\.popover-manga \{[^}]*overflow: visible;[^}]*background: transparent;/s);
  assert.match(rendererSource, /\.manga-app-layout \{[^}]*overflow: visible;[^}]*background: #fff;/s);
  assert.equal(previewImage.parentNode.parentNode.children[2], previewImage.parentNode);
  lifecycle.destroy();
});

check("live canonical six avatars, mask-only active and ARIA", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const panel = api.createLivePopover(root, lifecycle);
  root.appendChild(panel);
  const interaction = panel.__miniHeaderInteraction;
  assert.equal(interaction.itemNodes.length, 6);
  assert.equal(findNodesByClass(panel, "live-activity-banner").length, 0);
  assert.equal(findNodesByClass(panel, "live-activity-list").length, 0);
  assert.equal(findNodesByClass(panel, "live-avatar-mask").every((node) => node.textContent === "LIVE"), true);
  assert.match(rendererSource, /\.live-hot-column \.popover-list-title \{ color: #fb7299; \}/);
  assert.match(rendererSource, /\.live-activity-column \{ border-left: 1px solid #f1c7d1;/);
  assert.match(rendererSource, /\.live-interactive-item \{[^}]*text-decoration: none;/s);
  assert.match(rendererSource, /\.live-room-title \{[^}]*text-decoration: none;/s);
  assert.match(rendererSource, /\.auth-state-panel\[data-state="logged_out"\] \.auth-branch--logout > \.item:not\(\.unlogin-entry\) > \.name,[\s\S]*text-shadow: 0 1px 1px rgba\(0, 0, 0, \.3\)/);
  assert.match(rendererSource, /grid-template-columns: repeat\(3, 64px\)/);
  for (let index = 0; index < interaction.itemNodes.length; index += 1) {
    const node = interaction.itemNodes[index];
    const avatarFrame = node.children[0];
    const image = avatarFrame.children[0];
    const mask = avatarFrame.children[2];
    assert.equal(image.getAttribute("src").startsWith("chrome-extension://"), true);
    assert.equal(node.getAttribute("href"), null);
    node.dispatch("mouseenter");
    assert.equal(node.classList.contains("is-active"), true);
    assert.equal(mask.classList.contains("is-active"), false);
    assert.equal(mask.getAttribute("class"), "live-avatar-mask");
    assert.equal(node.getAttribute("aria-expanded"), "true");
    assert.equal(interaction.itemNodes.filter((candidate) => candidate.classList.contains("is-active")).length, 1);
    node.dispatch("keydown", { key: "Enter" });
    node.dispatch("keydown", { key: " " });
    node.dispatch("keydown", { key: "Space" });
  }
  const firstMask = interaction.itemNodes[0].children[0].children[2];
  interaction.itemNodes[0].dispatch("pointerenter");
  assert.equal(firstMask.ownerDocument.writes >= 0, true);
  panel.dispatch("keydown", { key: "Escape" });
  assert.equal(interaction.activeKey, null);
  lifecycle.destroy();
  assert.equal(lifecycle.cleanups.length, 0);
});

check("local fallback and destroy/remount late image callbacks", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = createIconLifecycle(root);
  const panel = api.createLivePopover(root, lifecycle);
  root.appendChild(panel);
  const interaction = panel.__miniHeaderInteraction;
  const image = interaction.itemNodes[0].children[0].children[0];
  const fallback = interaction.itemNodes[0].children[0].children[1];
  image.dispatch("error");
  assert.equal(fallback.getAttribute("hidden"), null);
  const writesBeforeDestroy = document.writes;
  lifecycle.destroy();
  image.dispatch("load");
  image.dispatch("error");
  assert.equal(document.writes, writesBeforeDestroy);

  const firstDocument = new FakeDocument();
  const firstRoot = firstDocument.createElement("main");
  firstRoot._connected = true;
  const firstLifecycle = createIconLifecycle(firstRoot);
  const firstPanel = api.createGamePopover(firstRoot, firstLifecycle);
  firstRoot.appendChild(firstPanel);
  const firstInteraction = firstPanel.__miniHeaderInteraction;
  firstInteraction.itemNodes[0].dispatch("pointerenter");
  const stalePreview = firstInteraction.previewFrame;
  firstLifecycle.destroy();
  const firstWrites = firstDocument.writes;
  firstInteraction.itemNodes[0].dispatch("pointerenter");
  assert.equal(stalePreview.style.backgroundImage, `url("chrome-extension://mini-header-test/${api.GAME_PREVIEW_ITEMS[0].key}")`);
  assert.equal(firstDocument.writes, firstWrites);

  const secondRoot = firstDocument.createElement("main");
  secondRoot._connected = true;
  const secondLifecycle = createIconLifecycle(secondRoot);
  const secondPanel = api.createGamePopover(secondRoot, secondLifecycle);
  secondRoot.appendChild(secondPanel);
  const secondInteraction = secondPanel.__miniHeaderInteraction;
  secondInteraction.itemNodes[1].dispatch("pointerenter");
  assert.equal(secondInteraction.previewFrame.style.backgroundImage, `url("chrome-extension://mini-header-test/${api.GAME_PREVIEW_ITEMS[1].key}")`);
  secondLifecycle.destroy();
  assert.equal(secondLifecycle.cleanups.length, 0);
});

const checkAsync = async (label, fn) => {
  try {
    await fn();
    console.log(`PASS ${label}`);
  } catch (error) {
    failures.push({ label, message: error.message });
    console.log(`FAIL ${label}: ${error.message}`);
  }
};

check("dynamic references survive header render and homepage return", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  assert.ok(header.dynamicPanel, "createHeader exposes dynamic panel");
  assert.ok(header.dynamicTrigger, "createHeader exposes dynamic trigger");
  assert.equal(header.dynamicTrigger.getAttribute("aria-label"), "动态");
  const homepageStart = rendererSource.indexOf("const renderHomepage =");
  const homepageReturnStart = rendererSource.indexOf("    return {", homepageStart);
  const homepageReturnEnd = rendererSource.indexOf("      destroy()", homepageReturnStart);
  assert.ok(homepageStart >= 0 && homepageReturnStart > homepageStart && homepageReturnEnd > homepageReturnStart);
  const homepageReturn = rendererSource.slice(homepageReturnStart, homepageReturnEnd);
  assert.match(homepageReturn, /dynamicPanel: headerView\.dynamicPanel/);
  assert.match(homepageReturn, /dynamicTrigger: headerView\.dynamicTrigger/);
});

check("R3 live nav-user-center DOM geometry and interaction contract", () => {
  const document = new FakeDocument();
  const root = document.createElement("main");
  root._connected = true;
  const lifecycle = { root, cleanups: [], active: true, isActive: () => lifecycle.active };
  const header = api.createHeader(root, lifecycle);
  root.appendChild(header.header);
  const userCenter = header.userCenter;
  const signin = header.signin;
  assert.deepEqual(userCenter.children.map((node) => node.getAttribute("class") || node.getAttribute("data-popover-group")), [
    "user-con search-icon", "user-con signin", "upload", "auth-state-panel"
  ]);
  assert.deepEqual(signin.children.map((node) => node.getAttribute("class")), [
    "item", "item", "item", "item", "item", "item", "item"
  ]);
  assert.equal(signin.children[0].children[0].children[0].getAttribute("class").includes("mini-avatar"), true);
  assert.equal(signin.children[0].children.length, 1, "avatar item has only reference wrapper");
  assert.equal(signin.children[1].children[0].tagName, "SPAN");
  assert.equal(signin.children[2].children[0].getAttribute("class"), "nav-item nav-item-message");
  assert.deepEqual(signin.children[2].children[0].children.map((node) => (node.getAttribute("class") || "").split(/\s+/).slice(-2).join(" ")), ["t", "i-frame nav-im-new"]);
  const messagePanel = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "message").panel;
  assert.equal(messagePanel.parentNode, signin.children[2].children[0], "message panel keeps old .nav-item > .t + .i-frame nesting");
  assert.equal(messagePanel.children.some((node) => node.tagName === "IFRAME"), false, "message has no invented iframe src");
  assert.equal(messagePanel.children.length, 5, "message panel keeps five source rows");
  assert.equal(messagePanel.children.every((node) => node.tagName === "A" && node.parentNode === messagePanel), true,
    "message portal rows remain direct links");
  const portalMessageLinkRule = rendererSource.match(/\.header-overlay-layer > \.nav-im-new > a\s*\{([^}]*)\}/s);
  assert.ok(portalMessageLinkRule, "portal message links have an equivalent row-layout selector");
  for (const declaration of ["display: flex;", "height: 38px;", "line-height: 38px;", "padding: 0 16px;"]) {
    assert.match(portalMessageLinkRule[1], new RegExp(declaration.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")), declaration);
  }
  assert.match(rendererSource, /\.header-overlay-layer > \.nav-im-new > a:hover,[\s\S]*\.header-overlay-layer > \.nav-im-new > a:focus-visible \{[^}]*background: #f4f4f4;[^}]*color: #212121;[^}]*text-shadow: none;/s,
    "portal message links retain hover/focus styling");
  assert.equal(messagePanel.children[2].children[0].getAttribute("class"), "message-link-label");
  assert.equal(messagePanel.children[2].children[1].getAttribute("class"), "message-badge");
  assert.equal(api.setMessageData(messagePanel, { reply: 0, at: 0, like: 1, sysMsg: 0, sessionUnread: 0 }), true);
  assert.equal(messagePanel.children[2].children[1].textContent, "1", "like row badge commits count");
  assert.equal(messagePanel.children[2].children[1].getAttribute("hidden"), null, "like row badge becomes visible");
  const messageTriggerBadge = messagePanel.__messageView.triggerBadge;
  assert.equal(messageTriggerBadge.textContent, "1", "message trigger badge commits total");
  assert.equal(api.setMessageData(messagePanel, null), true);
  assert.equal(messageTriggerBadge.getAttribute("hidden"), "true", "clearing message data hides trigger badge");
  const dynamicNav = signin.children[3].children[0];
  const dynamicPanel = header.popoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "dynamic").panel;
  const dynamicBadge = dynamicNav.children[0].children[1];
  assert.equal(dynamicBadge.getAttribute("data-role"), "dynamic-entrance");
  assert.equal(dynamicBadge.getAttribute("hidden"), "true");
  assert.equal(api.setDynamicData(dynamicPanel, { count: 0, avatar: null }), true);
  assert.equal(dynamicBadge.getAttribute("hidden"), "true", "zero dynamic count hides badge");
  assert.equal(dynamicBadge.textContent, "");
  assert.equal(api.setDynamicData(dynamicPanel, { count: 7, avatar: null }), true);
  assert.equal(dynamicBadge.getAttribute("hidden"), null, "positive dynamic count shows badge");
  assert.equal(dynamicBadge.textContent, "7");
  assert.equal(api.setDynamicData(dynamicPanel, { count: 99, avatar: null }), true);
  assert.equal(dynamicBadge.textContent, "99+", "large dynamic count uses 99+ display");
  assert.equal(api.setDynamicData(dynamicPanel, { count: 7, extra: true }), false,
    "dynamic renderer rejects extra output keys");
  assert.equal(api.setDynamicData(dynamicPanel, null), true);
  assert.equal(dynamicBadge.getAttribute("hidden"), "true", "clearing dynamic data hides badge");
  assert.equal(signin.children[3].children[0].children[0].getAttribute("class"), "t");
  assert.equal(dynamicPanel.children[0].tagName, "IFRAME");
  assert.equal(signin.children[6].children[0].tagName, "A");
  assert.equal(signin.children[6].children[0].children[0].getAttribute("class"), "name");
  assert.equal(signin.children[6].children[0].children[0].textContent, "创作中心");
  const creatorRule = rendererSource.match(/\.international-header \.nav-user-center > \.user-con\.signin > \.item:nth-child\(7\) > a,\s*\.international-header \.nav-user-center > \.user-con\.signin > \.item:nth-child\(7\) \.name\s*\{([^}]*)\}/s);
  assert.ok(creatorRule, "creator has a dedicated final top-bar selector");
  assert.match(creatorRule[1], /color:\s*#fff/);
  assert.match(creatorRule[1], /text-shadow:\s*0 1px 2px rgba\(0, 0, 0, \.45\)/);
  assert.match(rendererSource, /\.header-overlay-layer > \.van-popper-nav a,[\s\S]*text-shadow: none;/);
  assert.deepEqual(userCenter.children[2].children.map((node) => node.getAttribute("class")), ["mini-upload van-popover__reference"]);
  assert.equal(header.overlayLayer.parentNode, header.header);
  assert.equal(header.statusPanel.parentNode, userCenter, "auth state panel stays in the user-center flow");
  assert.equal(header.header.children.includes(header.statusPanel), false, "auth state panel is not duplicated on header");
  assert.equal(header.statusPanel.getAttribute("hidden"), null, "unknown auth branch is initially observable");
  assert.equal(findNodesByClass(header.header, "mini-upload-wrap").length, 0, "upload uses plain div wrapper");
  assert.equal(header.authPopoverGroups.length, 7, "six nested/portal auth panels plus upload");
  assert.equal(header.authPopoverGroups.filter((entry) => entry.panel.parentNode === header.overlayLayer).length, 5);
  assert.equal(header.authPopoverGroups.filter((entry) => entry.panel.parentNode !== header.overlayLayer).length, 2);

  const expectedKinds = ["avatar", "vip", "message", "dynamic", "favorite", "history", "upload"];
  assert.deepEqual(Array.from(header.authPopoverGroups, (entry) => entry.panel.getAttribute("data-popover-kind")), expectedKinds);
  for (const entry of header.authPopoverGroups) {
    assert.equal(entry.panel.getAttribute("role"), "tooltip");
    assert.equal(entry.panel.getAttribute("tabindex"), "0");
    assert.equal(entry.panel.getAttribute("aria-hidden"), "true");
    assert.equal(entry.trigger.getAttribute("aria-controls"), entry.panel.id);
    assert.equal(entry.trigger.getAttribute("aria-expanded"), "false");
    if (entry.panel.parentNode === header.overlayLayer) {
      assert.equal(entry.panel.getAttribute("class").includes(`van-popper-${entry.panel.getAttribute("data-popover-kind")}`), true);
      entry.trigger._rect = { left: 400, top: 10, width: 28, height: 30, right: 428, bottom: 40 };
      api.positionHeaderPopover(entry);
    }
  }
  const portalMetrics = Object.fromEntries(header.authPopoverGroups
    .filter((entry) => entry.portal)
    .map((entry) => [entry.panel.getAttribute("data-popover-kind"), [entry.panel.style.width, entry.panel.style.height, entry.panel.style.zIndex]]));
  assert.deepEqual(portalMetrics, {
    avatar: ["280px", "468px", "2001"],
    vip: ["260px", "241px", "2003"],
    favorite: ["520px", "518px", "2005"],
    history: ["370px", "518px", "2007"],
    upload: ["380px", "78px", "2009"]
  });
  assert.match(rendererSource, /\.nav-user-center \{ position: relative; display: flex; width: 458px; height: 40px;[^}]*gap: 0;/s);
  assert.match(rendererSource, /\.user-con\.signin \{ display: flex; width: 344px; height: 40px;/);
  assert.match(rendererSource, /\.nav-user-center > \.user-con\.signin > \.item \{[^}]*height: 40px; min-height: 40px; max-height: 40px;[^}]*align-items: center;/s);
  assert.match(rendererSource, /\.nav-user-center > \.user-con\.signin > \.item > span \{ display: flex; width: 100%; height: 40px; align-items: center;/);
  assert.match(rendererSource, /\.mini-vip \{ display: block; width: 42px; height: 30px;/);
  assert.match(rendererSource, /\.mini-upload \{[^}]*text-decoration: none;/s);
  assert.match(rendererSource, /\.item:nth-child\(5\) \.mini-favorite,[\s\S]*\.item:nth-child\(6\) \.mini-history \{ display: block; width: 28px; height: 30px;/);
  assert.match(rendererSource, /avatar: 150,[\s\S]*vip: 300,[\s\S]*favorite: 150,[\s\S]*history: 150,[\s\S]*upload: 100,[\s\S]*message: 0,[\s\S]*dynamic: 0/);
  assert.match(rendererSource, /\.user-panel--dynamic \{ width: 382px; height: 320px; overflow: hidden; \}/);
  assert.match(rendererSource, /\.user-panel--dynamic iframe \{ display: block; width: 100%; height: 308px;/);
  assert.match(rendererSource, /dynamic: \{ width: 382, height: 320, top: 11, zIndex: 2021 \}/);
  assert.match(rendererSource, /\.international-header \.nav-user-center > \.user-con\.signin > \.item:nth-child\(-n\+6\)[\s\S]*color: #fff;[\s\S]*text-shadow: 0 1px 2px rgba\(0, 0, 0, \.45\);/);
  assert.match(rendererSource, /\.header-overlay-layer > \.profile-popover > \.vp-container > \.coins \.bili-icon_dingdao_yingbi \{ color: #00a1d6; \}/);
  assert.match(rendererSource, /\.header-overlay-layer > \.profile-popover > \.vp-container > \.coins \.bili-icon_dingdao_Bbi \{ color: #f5a623; \}/);
  assert.match(rendererSource, /\.header-overlay-layer > \.profile-popover > \.vp-container > \.coins \.profile-asset-action \{ color: #00a1d6; text-shadow: none; \}/);
  assert.match(rendererSource, /\.header-overlay-layer \{ position: fixed; z-index: 3300;/);
  assert.match(rendererSource, /\.elevator\.edit \{ z-index: 1000; \}/);
  assert.match(rendererSource, /\.slicksort-selected \{[^}]*z-index: 1001;/s);
  assert.match(rendererSource, /\.van-popper-avatar \{ width: 280px; height: 468px;/);
  assert.match(rendererSource, /\.van-popper-vip \{ width: 260px; height: 241px;/);
  assert.match(rendererSource, /\.van-popper-favorite \{ width: 520px; height: 518px;/);
  assert.match(rendererSource, /\.van-popper-history \{ width: 370px; height: 518px;/);
  assert.match(rendererSource, /\.van-popper-upload \{ width: 380px; height: 78px;/);
  assert.match(rendererSource, /280\);/);
  assert.match(rendererSource, /bili-icon_dingdao_wenzhangtougao/);
  assert.match(rendererSource, /bili-icon_dingdao_yinpintougao/);
  assert.match(rendererSource, /bili-icon_dingdao_tiezhitougao/);
  assert.match(rendererSource, /bili-icon_dingdao_shipintougao/);
  assert.match(rendererSource, /bili-icon_dingdao_tougaoguanli1/);
  const uploadIcons = findNodesByClass(header.authPopoverGroups.find((entry) => entry.panel.getAttribute("data-popover-kind") === "upload").panel, "upload-icon");
  assert.deepEqual(uploadIcons.map((node) => [node.tagName, node.getAttribute("class"), /[专音贴视管]/.test(node.textContent)]), [
    ["I", "bilifont bili-icon_dingdao_wenzhangtougao upload-icon", false],
    ["I", "bilifont bili-icon_dingdao_yinpintougao upload-icon", false],
    ["I", "bilifont bili-icon_dingdao_tiezhitougao upload-icon", false],
    ["I", "bilifont bili-icon_dingdao_shipintougao upload-icon", false],
    ["I", "bilifont bili-icon_dingdao_tougaoguanli1 upload-icon", false]
  ]);

  api.bindHeaderPopovers(header.authPopoverGroups, lifecycle.cleanups, lifecycle.isActive);
  const avatarEntry = header.authPopoverGroups[0];
  const vipEntry = header.authPopoverGroups[1];
  avatarEntry.group.dispatch("mouseenter");
  assert.equal([...document.timers.values()][0].delay, 150);
  document.runNextTimer();
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "false");
  avatarEntry.group.dispatch("mouseleave", { relatedTarget: null });
  assert.equal([...document.timers.values()][0].delay, 280);
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "false", "120ms envelope remains open");
  avatarEntry.panel.dispatch("mouseenter", { relatedTarget: null });
  assert.equal(document.timers.size, 0, "panel enter cancels visual gap close");
  avatarEntry.trigger.dispatch("click", { detail: 1 });
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "false", "pointer click does not force-close");
  avatarEntry.trigger.classList.add("focusing");
  avatarEntry.panel.dispatch("keydown", { key: "Escape" });
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "true", "Escape hides avatar immediately");
  assert.equal(avatarEntry.trigger.getAttribute("aria-expanded"), "false");
  assert.equal(avatarEntry.trigger.classList.contains("focusing"), false);
  assert.equal(document.timers.size, 0, "Escape clears avatar open and close timers");
  avatarEntry.group.dispatch("mouseenter");
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "true", "stationary avatar pointer cannot reopen while locked");
  vipEntry.group.dispatch("mouseenter");
  assert.equal([...document.timers.values()][0].delay, 300);
  document.runNextTimer();
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "true", "avatar lock does not affect VIP entry");
  assert.equal(vipEntry.panel.getAttribute("aria-hidden"), "false");
  vipEntry.trigger.classList.add("focusing");
  vipEntry.panel.dispatch("keydown", { key: "Escape" });
  assert.equal(vipEntry.panel.getAttribute("aria-hidden"), "true");
  assert.equal(vipEntry.trigger.classList.contains("focusing"), false);
  assert.equal(vipEntry.trigger.focusCount, 0);
  avatarEntry.group.dispatch("mouseleave", { relatedTarget: null });
  avatarEntry.group.dispatch("mouseenter");
  document.runNextTimer();
  avatarEntry.group.dispatch("mouseleave", { relatedTarget: null });
  assert.equal(document.runNextTimer(), true);
  assert.equal(avatarEntry.panel.getAttribute("aria-hidden"), "true", "720ms envelope closes");
  api.cleanupListeners(lifecycle.cleanups);
});

check("customer service entry is auth-independent and matches legacy geometry", () => {
  assert.match(rendererSource, /const createContactHelp = \(root\) => createFixedAnchor\(root, "contact-help", "CUSTOMER_SERVICE", "联系客服"\)/);
  assert.match(rendererSource, /homepage\.appendChild\(contactHelp\)/);
  assert.match(rendererSource, /\.contact-help \{[^}]*position: fixed;[^}]*z-index: 101;[^}]*top: calc\(50% - 30px\);[^}]*width: 28px;[^}]*height: 72px;[^}]*padding: 8px 7px;[^}]*border: 1px solid #e7e7e7;[^}]*border-radius: 0 2px 2px 0;[^}]*box-shadow: 0 6px 10px 0 #e7e7e7;[^}]*font-size: 12px;[^}]*line-height: 14px;[^}]*text-decoration: none;/s);
  assert.match(rendererSource, /\.contact-help:hover, \.contact-help:focus-visible \{ color: #505050; background: #f4f4f4; \}/);
});

(async () => {
  await checkAsync("iconfont delayed continuation lifecycle fences", async () => {
    const cases = [
      {
        label: "destroy while root remains connected",
        setup: ({ lifecycle }) => lifecycle.destroy()
      },
      {
        label: "replaced root",
        setup: ({ lifecycle, document }) => {
          const replacementRoot = document.createElement("section");
          replacementRoot._connected = true;
          lifecycle.root = replacementRoot;
        }
      },
      {
        label: "ownerDocument mismatch",
        setup: ({ node }) => { node.ownerDocument = new FakeDocument(); }
      }
    ];

    for (const testCase of cases) {
      const document = new FakeDocument();
      const root = document.createElement("main");
      root._connected = true;
      const lifecycle = createIconLifecycle(root);
      const node = api.createIconFont(root, "bili-icon_dingdao_sousuo", "test-icon", lifecycle);
      root.appendChild(node);
      const writesBeforeResolve = document.writes;
      testCase.setup({ document, root, lifecycle, node });
      resolveFontLoads(document);
      await flushPromiseContinuations();
      assert.equal(node.classList.contains("icon-font-ready"), false, testCase.label);
      assert.equal(document.writes, writesBeforeResolve, `${testCase.label} zero writes`);
      lifecycle.destroy();
      assert.equal(lifecycle.cleanups.length, 0, `${testCase.label} cleanup registry drained`);
    }
  });

  await checkAsync("iconfont duplicate mount fences retired root and preserves new root", async () => {
    const document = new FakeDocument();
    const firstRoot = document.createElement("main");
    const secondRoot = document.createElement("main");
    firstRoot._connected = true;
    secondRoot._connected = true;
    const firstLifecycle = createIconLifecycle(firstRoot);
    const secondLifecycle = createIconLifecycle(secondRoot);
    const firstNode = api.createIconFont(firstRoot, "bili-icon_dingdao_sousuo", "first-icon", firstLifecycle);
    const secondNode = api.createIconFont(secondRoot, "bili-icon_dingdao_sousuo", "second-icon", secondLifecycle);
    firstRoot.appendChild(firstNode);
    secondRoot.appendChild(secondNode);
    const writesBeforeResolve = document.writes;

    firstLifecycle.destroy();
    resolveFontLoads(document);
    await flushPromiseContinuations();

    assert.equal(firstNode.classList.contains("icon-font-ready"), false, "retired duplicate mount zero class write");
    assert.equal(secondNode.classList.contains("icon-font-ready"), true, "current duplicate mount remains writable");
    assert.equal(document.writes, writesBeforeResolve + 1, "duplicate mount has only current-root class write");
    assert.equal(firstLifecycle.cleanups.length, 0, "retired duplicate mount cleanup registry drained");
    assert.equal(secondLifecycle.cleanups.length, 0, "current duplicate mount settled cleanup registry drained");
  });

  if (failures.length > 0) {
    console.error(JSON.stringify({ status: "FAIL", failures }, null, 2));
    process.exitCode = 1;
  } else {
    console.log("MINI_HEADER_PLAN_A_SECURITY=PASS");
  }
})();
