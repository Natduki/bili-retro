"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const requests = [];
const defaultPayload = {
  code: 0,
  message: "OK",
  data: {
    show_name: "默认搜索词",
    name: "备用搜索词",
    url: "https://search.bilibili.com/all?keyword=%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E8%AF%8D",
    extraDefaultField: "ignored"
  },
  extraEnvelopeField: "ignored"
};
const trendingPayload = {
  code: 0,
  data: {
    trending: {
      title: "热门搜索",
      list: [
        { keyword: "热搜一", show_name: "热搜展示一", icon: "https://i0.hdslb.com/bfs/search/one.png", extra: true },
        { keyword: "直播徽标", show_name: "直播徽标", icon: "https://i0.hdslb.com/bfs/activity-plat/static/20251027/aafcb8031fd171c428daaa9b45867226/VaxAnHMq6w.gif", heat_score: 100 },
        { keyword: "坏图标仍保留", show_name: "坏图标仍保留", icon: "https://evil.example/icon.png", heat_score: 99 },
        { keyword: "热搜三", show_name: "热搜展示三", icon: null, heat_score: 98 }
      ],
      extraTrendingField: true
    }
  },
  addedEnvelopeField: true
};

const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: { cookie: "", querySelector() { return null; }, createElement() { return {}; }, head: { appendChild() {} }, documentElement: { appendChild() {} } },
  addEventListener() {},
  postMessage() {},
  fetch: async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      redirected: false,
      text: async () => JSON.stringify(url.includes("search/default") ? defaultPayload : trendingPayload)
    };
  }
};
windowObject.window = windowObject;
const context = vm.createContext({ window: windowObject, URL, URLSearchParams, AbortController, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);

assert.equal(api.isKnownOperation("SEARCH_SUGGEST"), true);
assert.deepEqual(JSON.parse(JSON.stringify(api.OPERATION_ROUTES.SEARCH_SUGGEST)), [
  { host: "api.bilibili.com", path: "/x/web-interface/wbi/search/default", method: "GET" },
  { host: "api.bilibili.com", path: "/x/web-interface/wbi/search/square?limit=10&platform=web", method: "GET" }
]);
const requestId = "a".repeat(32);
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "SEARCH_SUGGEST",
  requestId
})), true);
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "SEARCH_SUGGEST",
  requestId,
  extra: true
})), false);

const projected = JSON.parse(JSON.stringify(api.projectSearch(inRealm(defaultPayload), inRealm(trendingPayload))));
assert.deepEqual(Object.keys(projected).sort(), ["defaultKeyword", "defaultUrl", "trendingItems", "trendingTitle"]);
assert.equal(projected.defaultKeyword, "默认搜索词");
assert.equal(projected.defaultUrl, "https://search.bilibili.com/all?keyword=%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E8%AF%8D");
assert.deepEqual(projected.trendingItems.map((item) => item.remoteIcon), [
  "https://i0.hdslb.com/bfs/search/one.png",
  null,
  null,
  null
]);
assert.deepEqual(projected.trendingItems.map((item) => item.markKey), ["none", "live", "none", "none"]);
assert.deepEqual(Object.keys(projected.trendingItems[0]).sort(), ["keyword", "markKey", "remoteIcon", "text"]);
const invalidDefaultProjected = JSON.parse(JSON.stringify(api.projectSearch(
  inRealm({ ...defaultPayload, data: { ...defaultPayload.data, url: "https://evil.example/all?keyword=x" } }),
  inRealm(trendingPayload)
)));
assert.equal(invalidDefaultProjected.defaultUrl, "https://search.bilibili.com/all?keyword=%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E8%AF%8D");
const oversizedTrending = inRealm({
  ...trendingPayload,
  data: {
    trending: {
      ...trendingPayload.data.trending,
      list: Array.from({ length: 12 }, (_, index) => ({
        keyword: `词${index}`,
        show_name: `展示${index}`,
        icon: null,
        added: true
      }))
    }
  }
});
assert.equal(api.projectSearch(inRealm(defaultPayload), oversizedTrending).trendingItems.length, 10);
const fallbackDefault = JSON.parse(JSON.stringify(api.projectSearch(null, inRealm(trendingPayload))));
assert.equal(fallbackDefault.defaultKeyword, "哔哩哔哩");
assert.equal(fallbackDefault.defaultUrl, "https://search.bilibili.com/all?keyword=%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9");

(async () => {
  const result = await api.execute({ operation: "SEARCH_SUGGEST" }, new AbortController());
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(requests.length, 2);
  for (const request of requests) {
    assert.equal(request.options.method, "GET");
    assert.equal(request.options.credentials, "omit");
    assert.equal(request.options.redirect, "error");
  }
  assert.deepEqual(Object.keys(result.data).sort(), ["defaultKeyword", "defaultUrl", "trendingItems", "trendingTitle"]);
  console.log("SEARCH_BRIDGE_CONTRACT=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
