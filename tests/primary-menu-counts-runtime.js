"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const contentSource = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const rendererSource = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
const requests = [];
const raw = {
  code: 0,
  message: "OK",
  extraEnvelope: true,
  data: {
    region_count: {
      1: 1000, 13: 0, 3: 31, 167: 44, 129: 55, 4: 66, 36: 77, 188: 88,
      160: 99, 119: "bad-item", 155: 101, 202: 102, 5: 103, 181: 104, 23: 5, 11: 0
    },
    extraData: true
  }
};
const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: { cookie: "", querySelector() { return null; }, createElement() { return {}; }, head: { appendChild() {} }, documentElement: { appendChild() {} } },
  addEventListener() {}, postMessage() {}, setTimeout, clearTimeout,
  fetch: async (url, options) => {
    requests.push({ url, options });
    return { ok: true, redirected: false, text: async () => JSON.stringify(raw) };
  }
};
windowObject.window = windowObject;
const context = vm.createContext({ window: windowObject, URL, AbortController, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);
const local = (value) => JSON.parse(JSON.stringify(value));

const projected = local(api.projectPrimaryMenuCounts(inRealm(raw)));
assert.deepEqual(projected.channels.map((item) => item.key), [
  "douga", "anime", "music", "guochuang", "dance", "game", "knowledge", "tech",
  "life", "kichiku", "fashion", "information", "ent", "cinephile", "cinema"
]);
assert.deepEqual(projected.channels.map((item) => item.value), [1000, 0, 31, 44, 55, 66, 77, 88, 99, null, 101, 102, 103, 104, 5]);
assert.deepEqual(Object.keys(projected), ["channels"]);
assert.equal(projected.channels.every((item) => Object.keys(item).sort().join(",") === "key,value"), true);
assert.equal(JSON.stringify(projected).includes("region_count"), false);
assert.equal(JSON.stringify(projected).includes("extraEnvelope"), false);

const rendererStart = rendererSource.indexOf("  const PRIMARY_MENU_COUNT_KEYS =");
const rendererEnd = rendererSource.indexOf("  const createPrimaryMenu =", rendererStart);
assert.ok(rendererStart >= 0 && rendererEnd > rendererStart);
const rendererApi = vm.runInNewContext(`(() => { ${rendererSource.slice(rendererStart, rendererEnd)} return { isPrimaryMenuCountsData, setPrimaryMenuCounts }; })()`, { Map, Object, Array, Number, String });
const badges = new Map(projected.channels.map((item) => [item.key, { textContent: `fixture-${item.key}` }]));
const view = { destroyed: false, isActive: () => true, countBadges: badges };
assert.equal(rendererApi.setPrimaryMenuCounts(view, projected), true);
assert.deepEqual(projected.channels.map((item) => badges.get(item.key).textContent), ["999+", "--", "31", "44", "55", "66", "77", "88", "99", "--", "101", "102", "103", "104", "5"]);

const beforeInvalid = projected.channels.map((item) => badges.get(item.key).textContent);
const invalid = { channels: projected.channels.map((item) => ({ ...item })) };
invalid.channels[7].value = -1;
assert.equal(rendererApi.setPrimaryMenuCounts(view, invalid), false);
assert.deepEqual(projected.channels.map((item) => badges.get(item.key).textContent), beforeInvalid, "invalid payload performs zero writes");
view.destroyed = true;
assert.equal(rendererApi.setPrimaryMenuCounts(view, projected), false);
assert.deepEqual(projected.channels.map((item) => badges.get(item.key).textContent), beforeInvalid, "stale view performs zero writes");

assert.match(contentSource, /requestPrimaryMenuCounts\(currentLifecycle\);/);
assert.match(contentSource, /currentLifecycle\.primaryMenuCountsRequested/);
assert.match(contentSource, /data-extension-b-primary-menu-counts-state/);
assert.match(contentSource, /new Set\(\["loading", "committed", "failure"\]\)/);
assert.match(contentSource, /currentLifecycle\.primaryMenu = rendered\.primaryMenu \|\| null/);
assert.match(rendererSource, /primaryMenu: menu\.__primaryMenuView,[\s\S]*setPrimaryMenuCounts,/);

(async () => {
  const result = await api.execute({ operation: "PRIMARY_MENU_COUNTS" }, new AbortController());
  assert.equal(result.ok, true);
  assert.deepEqual(local(result.data), projected);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://api.bilibili.com/x/web-interface/online");
  assert.equal(requests[0].options.method, "GET");
  assert.equal(requests[0].options.credentials, "omit");
  console.log("PRIMARY_MENU_COUNTS_RUNTIME=PASS");
})().catch((error) => { console.error(error); process.exitCode = 1; });
