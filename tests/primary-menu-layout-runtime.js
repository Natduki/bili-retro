"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");

assert.match(source, /const inner = createNode\(root, "div", "primary-menu-itnl"\);[\s\S]*inner\.appendChild\(pageTab\);[\s\S]*inner\.appendChild\(createNode\(root, "span", "tab-line-itnl"\)\);[\s\S]*inner\.appendChild\(channelMenu\);[\s\S]*inner\.appendChild\(createNode\(root, "span", "tab-line-itnl none"\)\);[\s\S]*inner\.appendChild\(friendship\);/);
assert.match(source, /\.primary-menu-itnl \{ display: flex; height: 108px;[^}]*padding: 20px 0;/s);
assert.match(source, /\.page-tab \.con li \{ width: 66px; height: 68px; flex: 0 0 66px; \}/);
assert.match(source, /#primaryPageTab \.round \{[^}]*width: 36px;[^}]*height: 36px;[^}]*margin-bottom: 4px;/s);
assert.match(source, /#primaryPageTab \.dynamic-update__avatar \{[^}]*width: 100%;[^}]*height: 100%;[^}]*object-fit: cover;/s);
assert.match(source, /const applyDynamicMenuAvatar = \(node, data\) =>/);
assert.match(source, /applyDynamicBadge\(view\.triggerBadge, data\.count\);\s*applyDynamicMenuAvatar\(view\.primaryMenuEntrance, data\);/);
assert.match(source, /addListenerWithCleanup\(link, "click", \(\) => clearDynamicMenuAvatar\(update\)/);
assert.match(source, /\.page-tab \.con li > a \{[^}]*display: flex;[^}]*height: 68px;[^}]*flex-direction: column;[^}]*align-items: center;[^}]*justify-content: center;[^}]*color: #505050;[^}]*font-size: 14px;/s);
assert.doesNotMatch(source, /\.page-tab \.con li > a \{[^}]*display: inline-block;/s);
assert.match(source, /#primaryPageTab \.page-link > span \{[^}]*display: block;[^}]*width: 100%;[^}]*height: 20px;[^}]*flex: 0 0 20px;[^}]*line-height: 20px;[^}]*white-space: nowrap;/s);
assert.equal(36 + 4 + 20 <= 68, true, "36px icon, 4px gap and complete two-character label fit vertically");
assert.doesNotMatch(source, /active \? "on"/);
assert.match(source, /#primaryChannelMenu \{[^}]*display: flex;[^}]*height: 68px;[^}]*flex-direction: column;[^}]*flex-wrap: wrap;/s);
assert.match(source, /#primaryChannelMenu \.name \{[^}]*color: #505050;[^}]*font-size: 14px;/s);
assert.match(source, /#primaryChannelMenu \.channel-count \{[^}]*margin-left: 1px;[^}]*background: rgb\(115, 201, 229\);[^}]*font-size: 12px;[^}]*transform: scale\(\.85\);/s);
assert.match(source, /\.primary-menu-itnl > \.tab-line-itnl \{[^}]*height: 46px;[^}]*margin: 0 20px;[^}]*border-left: 1px solid #e7e7e7;/s);
assert.match(source, /#primaryFriendshipLink \{[^}]*width: 289px;[^}]*height: 68px;/s);
assert.match(source, /@media \(max-width: 1870px\)[\s\S]*width: 1414px[\s\S]*width: 58px[\s\S]*width: 242px/);
assert.match(source, /@media \(max-width: 1654px\)[\s\S]*width: 1198px[\s\S]*width: 50px[\s\S]*margin: 0 8px[\s\S]*margin: 0 12px 0 0[\s\S]*width: 220px/);
assert.match(source, /@media \(max-width: 1438px\)[\s\S]*width: 999px[\s\S]*\.item\.hide \{ display: none; \}/);
assert.match(source, /box-shadow: 0 2px 12px rgba\(0, 0, 0, \.1\)/);
assert.match(source, /\.sub-item \.name \{[^}]*height: 37px;[^}]*font-size: 12px;/s);
assert.doesNotMatch(source, /\.channel-entry:hover \.van-popper-channel|\.channel-entry:focus-within \.van-popper-channel/);
assert.match(source, /\.channel-entry\.is-popover-pending::after,[^\n]*is-popover-visible::after,[^\n]*is-popover-leaving::after \{ display: block; pointer-events: auto; \}/);
assert.match(source, /windowObject\.setTimeout\(\(\) => \{[\s\S]*\}, 150\)/);
assert.match(source, /const scheduleOpen = \(\) => \{\s*if \(!navigationGuard\.canEnter\(entry\)\) return;[\s\S]*entry\.openTimer = windowObject\.setTimeout/);
assert.match(source, /addListenerWithCleanup\(view\.menu, "click", \(event\) => \{[\s\S]*navigationGuard\.lock\(\);\s*closeAll\(true\);/);
assert.match(source, /addListenerWithCleanup\(windowObject, "blur", lockAndClose,[\s\S]*addListenerWithCleanup\(windowObject, "pagehide", lockAndClose/);
assert.match(source, /entry\.leaveTimer = windowObject\.setTimeout\(\(\) => \{[\s\S]*\}, 120\)/);
assert.match(source, /entry\.closeTimer = entry\.windowObject\.setTimeout\(\(\) => \{[\s\S]*\}, 600\)/);
assert.match(source, /const PRIMARY_LIVE_SUB = Object\.freeze\(\[/);
assert.match(source, /if \(side\.key === "live"\) \{/);
assert.match(source, /if \(popover\) popovers\.push/);

class Target {
  constructor() {
    this.parentNode = null; this.children = []; this.listeners = new Map(); this.attributes = new Map(); this.classes = new Set(); this.ownerDocument = null;
    this.classList = { add: (...v) => v.forEach((x) => this.classes.add(x)), remove: (...v) => v.forEach((x) => this.classes.delete(x)), contains: (v) => this.classes.has(v), toggle: (v, force) => { const on = force === undefined ? !this.classes.has(v) : Boolean(force); if (on) this.classes.add(v); else this.classes.delete(v); return on; } };
  }
  appendChild(child) { child.parentNode = this; child.ownerDocument = this.ownerDocument; this.children.push(child); return child; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) || null; }
  addEventListener(type, listener) { const list = this.listeners.get(type) || []; list.push(listener); this.listeners.set(type, list); }
  removeEventListener(type, listener) { this.listeners.set(type, (this.listeners.get(type) || []).filter((item) => item !== listener)); }
  dispatch(type, extra = {}) { const event = { target: this, relatedTarget: null, key: "", preventDefault() {}, ...extra }; for (const listener of this.listeners.get(type) || []) listener(event); }
  blur() { if (this.ownerDocument.activeElement === this) this.ownerDocument.activeElement = null; }
  focus() { this.ownerDocument.activeElement = this; }
}
let clock = 0; let timerId = 0; const timers = new Map();
const windowObject = new Target();
windowObject.setTimeout = (fn, delay) => { const id = ++timerId; timers.set(id, { at: clock + delay, fn }); return id; };
windowObject.clearTimeout = (id) => timers.delete(id);
const tick = (ms) => { clock += ms; for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.fn(); } };
const documentObject = new Target(); documentObject.defaultView = windowObject; documentObject.visibilityState = "visible"; documentObject.activeElement = null;
const addListenerWithCleanup = (target, type, listener, cleanups) => { target.addEventListener(type, listener); cleanups.push(() => target.removeEventListener(type, listener)); };
const start = source.indexOf("  const setPrimaryPopover =");
const end = source.indexOf("  const createPrimaryMenu =", start);
const navigationGuard = (() => {
  let locked = false;
  return { register() {}, lock() { locked = true; }, unlock() { locked = false; }, noteLeave() {}, canEnter: () => !locked, isLocked: () => locked };
})();
const api = vm.runInNewContext(`(() => { ${source.slice(start, end)} return { bindPrimaryMenu }; })()`, {
  globalThis: windowObject, addListenerWithCleanup, isRestoredNavigation: (_document, event) => Boolean(event && event.persisted),
  findNavigationAnchor: () => null,
  getNavigationPointerGuard: () => navigationGuard,
  releaseSurfaceFocus: (doc, surfaces) => { if (doc.activeElement && surfaces.some((surface) => surface.contains(doc.activeElement))) doc.activeElement.blur(); },
  Map, Object, Array, Number, String
});
const menu = new Target(); const container = new Target(); const reference = new Target(); const popover = new Target();
for (const node of [menu, container, reference, popover]) node.ownerDocument = documentObject;
popover.setAttribute("aria-hidden", "true");
container.appendChild(popover); container.appendChild(reference); menu.appendChild(container);
api.bindPrimaryMenu({ menu, popovers: [{ container, reference, popover }] }, { cleanups: [], isActive: () => true });
reference.dispatch("pointerenter"); assert.equal(container.classList.contains("is-popover-pending"), true, "pending corridor starts with open delay");
tick(100); container.dispatch("pointerenter", { relatedTarget: reference }); assert.equal(container.classList.contains("is-popover-pending"), true, "downward movement remains in the pending hit corridor");
tick(49); assert.equal(popover.getAttribute("aria-hidden"), "true", "hidden before 150ms");
tick(1); assert.equal(popover.getAttribute("aria-hidden"), "false", "visible at 150ms");
popover.dispatch("pointerenter", { relatedTarget: reference }); tick(200); assert.equal(popover.getAttribute("aria-hidden"), "false", "trigger-to-popover continuous hit stays open");
windowObject.dispatch("pageshow", { persisted: true }); reference.focus(); container.dispatch("focusin"); assert.equal(popover.getAttribute("aria-hidden"), "true", "bfcache-restored focus cannot reopen");
windowObject.dispatch("keydown", { key: "Tab" }); container.dispatch("focusin"); assert.equal(popover.getAttribute("aria-hidden"), "false", "real keyboard navigation reopens immediately");
container.dispatch("pointerleave", { relatedTarget: null }); assert.equal(popover.getAttribute("aria-hidden"), "false", "close grace keeps the panel open");
tick(119); assert.equal(popover.getAttribute("aria-hidden"), "false", "panel remains enterable during close grace");
tick(1); assert.equal(container.classList.contains("is-popover-leaving"), true, "visual close starts after grace");
tick(599); assert.equal(container.classList.contains("is-popover-leaving"), true); tick(1); assert.equal(container.classList.contains("is-popover-leaving"), false);
reference.focus(); container.dispatch("focusin"); assert.equal(reference.classList.contains("focusing"), true); reference.dispatch("keydown", { key: "Escape" }); assert.equal(reference.classList.contains("focusing"), false); assert.equal(documentObject.activeElement, null);

for (const width of [1630, 1414, 1198, 999]) assert.equal(width <= 1630, true, `canonical wrapper ${width} remains bounded`);
console.log("PRIMARY_MENU_LAYOUT_RUNTIME=PASS");
