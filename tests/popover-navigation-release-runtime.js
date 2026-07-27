"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");

class Target {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.parentNode = null;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.classes = new Set();
    this.ownerDocument = null;
    this.blurCount = 0;
    this.focusCount = 0;
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name),
      toggle: (name, force) => {
        const enabled = force === undefined ? !this.classes.has(name) : Boolean(force);
        if (enabled) this.classes.add(name); else this.classes.delete(name);
        return enabled;
      }
    };
  }
  appendChild(child) { child.parentNode = this; child.ownerDocument = this.ownerDocument; this.children.push(child); return child; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }
  removeEventListener(type, listener) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter((candidate) => candidate !== listener));
  }
  dispatch(type, extra = {}) {
    const event = { type, target: this, currentTarget: this, relatedTarget: null, key: "", preventDefault() {}, stopPropagation() {}, ...extra };
    for (const listener of this.listeners.get(type) || []) listener(event);
    return event;
  }
  blur() { this.blurCount += 1; if (this.ownerDocument.activeElement === this) this.ownerDocument.activeElement = null; }
  focus() { this.focusCount += 1; this.ownerDocument.activeElement = this; }
}

const windowObject = new Target("window");
windowObject.setTimeout = (callback) => { callback(); return 1; };
windowObject.clearTimeout = () => {};
const documentObject = new Target("document");
documentObject.defaultView = windowObject;
documentObject.visibilityState = "visible";
documentObject.activeElement = null;

const addListenerWithCleanup = (target, type, listener, cleanups) => {
  target.addEventListener(type, listener);
  cleanups.push(() => target.removeEventListener(type, listener));
};

const headerStart = source.indexOf("  const findNavigationAnchor =");
const headerEnd = source.indexOf("  const isFocusViewActive =", headerStart);
assert.ok(headerStart >= 0 && headerEnd > headerStart);
const headerApi = vm.runInNewContext(
  `(() => { ${source.slice(headerStart, headerEnd)} return { bindHeaderPopovers, getNavigationPointerGuard }; })()`,
  {
    globalThis: windowObject,
    addListenerWithCleanup,
    positionHeaderPopover() {},
    ANCHOR_AWARE_POPOVER_KINDS: new Set(),
    WeakMap,
    Map,
    Object
  }
);

const group = new Target();
const trigger = new Target("button");
const panel = new Target();
const anchor = new Target("a");
for (const target of [group, trigger, panel, anchor]) target.ownerDocument = documentObject;
anchor.setAttribute("href", "https://www.bilibili.com/v/game");
group.appendChild(trigger);
panel.appendChild(anchor);
const headerCleanups = [];
headerApi.bindHeaderPopovers([{ group, trigger, panel }], headerCleanups, () => true);
group.dispatch("mouseenter");
assert.equal(panel.getAttribute("aria-hidden"), "false");
anchor.focus();
panel.dispatch("click", { target: anchor });
assert.equal(panel.getAttribute("aria-hidden"), "true", "header navigation closes its popover");
assert.equal(anchor.blurCount, 1, "header navigation releases focus");
group.dispatch("mouseenter");
anchor.focus();
windowObject.dispatch("focus");
assert.equal(panel.getAttribute("aria-hidden"), "true", "window return closes header popovers");
assert.equal(anchor.blurCount, 2, "window return releases restored header focus");
trigger.focus();
group.dispatch("focusin", { target: trigger });
assert.equal(panel.getAttribute("aria-hidden"), "true", "restored focusin cannot reopen header popover");
group.dispatch("pointerenter");
assert.equal(panel.getAttribute("aria-hidden"), "true", "restored pointerenter cannot reopen header popover before exit");
windowObject.dispatch("keydown", { key: "Tab" });
group.dispatch("focusin", { target: trigger });
assert.equal(panel.getAttribute("aria-hidden"), "false", "real Tab navigation can reopen header popover");
windowObject.dispatch("focus");
group.dispatch("pointerleave", { relatedTarget: null });
group.dispatch("pointerenter");
assert.equal(panel.getAttribute("aria-hidden"), "false", "header popover reopens after a real pointer exit");

class ManualTimerWindow extends Target {
  constructor() {
    super("window");
    this.nextTimer = 1;
    this.timers = new Map();
  }
  setTimeout(callback, delay) {
    const id = this.nextTimer++;
    this.timers.set(id, { callback, delay });
    return id;
  }
  clearTimeout(id) { this.timers.delete(id); }
  runDelay(delay) {
    const match = [...this.timers.entries()].find(([, timer]) => timer.delay === delay);
    assert.ok(match, `expected ${delay}ms timer`);
    this.timers.delete(match[0]);
    match[1].callback();
  }
}

const timedWindow = new ManualTimerWindow();
const timedDocument = new Target("document");
timedDocument.defaultView = timedWindow;
timedDocument.visibilityState = "visible";
timedDocument.activeElement = null;
const timedApi = vm.runInNewContext(
  `(() => { ${source.slice(headerStart, headerEnd)} return { bindHeaderPopovers }; })()`,
  {
    globalThis: timedWindow,
    addListenerWithCleanup,
    positionHeaderPopover() {},
    ANCHOR_AWARE_POPOVER_KINDS: new Set()
  }
);
const makeTimedEntry = (kind) => {
  const timedGroup = new Target();
  const timedTrigger = new Target("button");
  const timedPanel = new Target();
  for (const target of [timedGroup, timedTrigger, timedPanel]) target.ownerDocument = timedDocument;
  timedPanel.setAttribute("data-popover-kind", kind);
  timedGroup.appendChild(timedTrigger);
  return { group: timedGroup, trigger: timedTrigger, panel: timedPanel };
};
const timedAvatar = makeTimedEntry("avatar");
const timedVip = makeTimedEntry("vip");
const timedSearch = makeTimedEntry("search");
timedSearch.search = true;
timedApi.bindHeaderPopovers([timedAvatar, timedVip, timedSearch], [], () => true);
timedAvatar.group.dispatch("pointerenter");
timedAvatar.group.dispatch("mouseenter");
assert.equal(timedWindow.timers.size, 1, "duplicate pointer/mouse enter keeps one open timer");
timedWindow.runDelay(150);
assert.equal(timedAvatar.panel.getAttribute("aria-hidden"), "false");
timedAvatar.group.dispatch("pointerleave", { relatedTarget: null });
timedAvatar.group.dispatch("mouseleave", { relatedTarget: null });
timedAvatar.group.dispatch("pointerleave", { relatedTarget: null });
assert.equal(timedWindow.timers.size, 1, "duplicate outside leaves cannot postpone close indefinitely");
assert.equal([...timedWindow.timers.values()][0].delay, 280);
assert.equal(timedAvatar.panel.getAttribute("aria-hidden"), "false", "avatar remains visible through the 120ms observation window");
timedAvatar.panel.dispatch("pointerenter", { relatedTarget: timedAvatar.trigger });
timedAvatar.panel.dispatch("mouseenter", { relatedTarget: timedAvatar.trigger });
assert.equal(timedWindow.timers.size, 0, "panel entry cancels the close envelope");
timedAvatar.panel.dispatch("pointerleave", { relatedTarget: null });
timedAvatar.panel.dispatch("mouseleave", { relatedTarget: null });
timedAvatar.panel.dispatch("pointerleave", { relatedTarget: null });
assert.equal(timedWindow.timers.size, 1, "complete outside exit owns one bounded close timer");
timedWindow.runDelay(280);
assert.equal(timedAvatar.panel.getAttribute("aria-hidden"), "true", "avatar closes well before 720ms");

timedAvatar.group.dispatch("pointerenter");
timedWindow.runDelay(150);
timedAvatar.trigger.classList.add("focusing");
let windowEscapePrevented = false;
let windowEscapeStopped = false;
timedWindow.dispatch("keydown", {
  key: "Escape",
  preventDefault() { windowEscapePrevented = true; },
  stopPropagation() { windowEscapeStopped = true; }
});
assert.equal(timedAvatar.panel.getAttribute("aria-hidden"), "true", "Escape hides avatar synchronously");
assert.equal(windowEscapePrevented, true);
assert.equal(windowEscapeStopped, true);
assert.equal(timedAvatar.trigger.getAttribute("aria-expanded"), "false");
assert.equal(timedAvatar.trigger.classList.contains("focusing"), false);
assert.equal(timedWindow.timers.size, 0, "Escape clears avatar timers");
timedAvatar.group.dispatch("pointerenter");
assert.equal(timedWindow.timers.size, 0, "avatar remains locked while the pointer is stationary");
timedVip.group.dispatch("pointerenter");
timedWindow.runDelay(300);
assert.equal(timedAvatar.panel.getAttribute("aria-hidden"), "true", "avatar remains hidden after the 80ms Escape observation window");
assert.equal(timedVip.panel.getAttribute("aria-hidden"), "false", "VIP opens despite the avatar entry lock");
timedSearch.trigger.dispatch("click", { button: 0 });
assert.equal(timedVip.panel.getAttribute("aria-hidden"), "true");
assert.equal(timedSearch.panel.getAttribute("aria-hidden"), "false");
timedWindow.dispatch("keydown", { key: "Escape" });
assert.equal(timedSearch.panel.getAttribute("aria-hidden"), "false", "ordinary search Escape is not consumed by the global header handler");

const primaryStart = source.indexOf("  const setPrimaryPopover =");
const primaryEnd = source.indexOf("  const createPrimaryMenu =", primaryStart);
assert.ok(primaryStart >= 0 && primaryEnd > primaryStart);
const primaryApi = vm.runInNewContext(
  `(() => { ${source.slice(primaryStart, primaryEnd)} return { bindPrimaryMenu, setPrimaryPopover }; })()`,
  {
    globalThis: windowObject,
    addListenerWithCleanup,
    isRestoredNavigation: () => false,
    findNavigationAnchor: vm.runInNewContext(`(() => { ${source.slice(headerStart, source.indexOf("  const releaseSurfaceFocus =", headerStart))} return findNavigationAnchor; })()`),
    releaseSurfaceFocus: vm.runInNewContext(`(() => { ${source.slice(source.indexOf("  const releaseSurfaceFocus ="), source.indexOf("  const bindHeaderPopovers ="))} return releaseSurfaceFocus; })()`),
    getNavigationPointerGuard: headerApi.getNavigationPointerGuard
  }
);

const crossWindow = new ManualTimerWindow();
const crossDocument = new Target("document");
crossDocument.defaultView = crossWindow;
crossDocument.visibilityState = "visible";
crossDocument.activeElement = null;
const crossMessage = makeTimedEntry("message");
for (const target of [crossMessage.group, crossMessage.trigger, crossMessage.panel]) target.ownerDocument = crossDocument;
const crossMessageAnchor = new Target("a");
crossMessageAnchor.ownerDocument = crossDocument;
crossMessageAnchor.setAttribute("href", "https://message.bilibili.com/");
crossMessage.panel.appendChild(crossMessageAnchor);
headerApi.bindHeaderPopovers([crossMessage], [], () => true);

const crossMenu = new Target("nav");
const crossContainer = new Target();
const crossReference = new Target();
const crossPopover = new Target();
const crossPrimaryAnchor = new Target("a");
for (const target of [crossMenu, crossContainer, crossReference, crossPopover, crossPrimaryAnchor]) target.ownerDocument = crossDocument;
crossPrimaryAnchor.setAttribute("href", "https://live.bilibili.com/");
crossReference.appendChild(crossPrimaryAnchor);
crossContainer.appendChild(crossReference);
crossContainer.appendChild(crossPopover);
crossMenu.appendChild(crossContainer);
crossPopover.setAttribute("aria-hidden", "true");
primaryApi.bindPrimaryMenu({ menu: crossMenu, popovers: [{ container: crossContainer, reference: crossReference, popover: crossPopover }] }, { cleanups: [], isActive: () => true });

crossMessage.group.dispatch("pointerenter");
assert.equal(crossMessage.panel.getAttribute("aria-hidden"), "false");
crossMessage.panel.dispatch("click", { target: crossMessageAnchor });
assert.equal(crossMessage.panel.getAttribute("aria-hidden"), "true", "header navigation closes before hit-test transfer");
crossReference.dispatch("pointerenter");
assert.equal(crossContainer.classList.contains("is-popover-pending"), false, "penetrating primary enter cannot create an open timer");
assert.equal(crossReference.classList.contains("focusing"), false);
assert.equal(crossWindow.timers.size, 0);
crossWindow.dispatch("blur");
crossWindow.dispatch("focus");
crossReference.dispatch("pointerenter");
assert.equal(crossWindow.timers.size, 0, "focus return preserves the shared pointer lock");
crossContainer.dispatch("pointerleave", { relatedTarget: null });
crossReference.dispatch("pointerenter");
crossWindow.runDelay(150);
assert.equal(crossPopover.getAttribute("aria-hidden"), "false", "real outside leave and re-enter unlocks primary hover");

crossMenu.dispatch("click", { target: crossPrimaryAnchor });
assert.equal(crossPopover.getAttribute("aria-hidden"), "true");
crossMessage.group.dispatch("pointerenter");
assert.equal(crossMessage.panel.getAttribute("aria-hidden"), "true", "primary navigation also locks header penetration");
crossMessage.group.dispatch("pointerleave", { relatedTarget: null });
crossMessage.group.dispatch("pointerenter");
assert.equal(crossMessage.panel.getAttribute("aria-hidden"), "false", "header hover resumes after its own real outside leave");

const menu = new Target("nav");
const container = new Target("span");
const reference = new Target();
const popover = new Target();
const primaryAnchor = new Target("a");
for (const target of [menu, container, reference, popover, primaryAnchor]) target.ownerDocument = documentObject;
primaryAnchor.setAttribute("href", "https://www.bilibili.com/v/knowledge");
reference.appendChild(primaryAnchor);
container.appendChild(reference);
container.appendChild(popover);
menu.appendChild(container);
const lifecycle = { cleanups: [], isActive: () => true };
primaryApi.bindPrimaryMenu({ menu, popovers: [{ container, reference, popover }] }, lifecycle);
reference.dispatch("keydown", { key: "Enter" });
assert.equal(popover.getAttribute("aria-hidden"), "false");
primaryAnchor.focus();
menu.dispatch("click", { target: primaryAnchor });
assert.equal(popover.getAttribute("aria-hidden"), "true", "primary navigation closes its popover");
assert.equal(primaryAnchor.blurCount, 1, "primary navigation releases focus");
primaryApi.setPrimaryPopover({ container, reference, popover }, true);
primaryAnchor.focus();
windowObject.dispatch("focus");
assert.equal(popover.getAttribute("aria-hidden"), "true", "window return closes primary popovers");
assert.equal(primaryAnchor.blurCount, 2, "window return releases restored primary focus");
reference.dispatch("pointerenter");
assert.equal(container.classList.contains("is-popover-closed"), true,
  "restored pointerenter cannot reopen primary popover before exit");
container.dispatch("pointerleave", { relatedTarget: null });
reference.dispatch("pointerenter");
assert.equal(container.classList.contains("is-popover-closed"), false,
  "primary popover can reopen after a real pointer exit");

console.log("POPOVER_NAVIGATION_RELEASE_RUNTIME=PASS");
