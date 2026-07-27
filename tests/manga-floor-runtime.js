const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
const sandbox = {
  URL, AbortController, TextEncoder, TextDecoder, Uint8Array,
  setTimeout, clearTimeout, fetch: async () => { throw new Error("unexpected fetch"); },
  chrome: { runtime: { id: "test", onMessage: { addListener() {} } } },
  __EXTENSION_B_MANGA_TEST__: true
};
sandbox.globalThis = sandbox;
vm.runInNewContext(source, sandbox, { filename: "sw.js" });
const api = sandbox.__EXTENSION_B_MANGA_TEST_API__;
const inRealm = (value) => vm.runInNewContext(`(${JSON.stringify(value)})`, sandbox);

const request = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "manga-1", generation: 1, operation: "MANGA_FLOOR", params: { batch: 2 } };
assert.equal(api.isMangaRequest(inRealm(request)), true);
assert.equal(api.isMangaRequest(inRealm({ ...request, extra: true })), false);
assert.equal(api.isMangaRequest(inRealm({ ...request, params: { batch: -1 } })), false);

const raw = { comic_id: 7, title: "测试漫画", vertical_cover: "http://i0.hdslb.com/bfs/manga-static/a.jpg", styles: ["冒险"], last_short_title: "12" };
const item = api.normalizeMangaItem(inRealm(raw));
assert.equal(item.cover, "https://i0.hdslb.com/bfs/manga-static/a.jpg");
assert.equal(item.href, "https://manga.bilibili.com/detail/mc7");
assert.equal(item.updateText, "更新至 12");
assert.equal(api.normalizeMangaItem(inRealm({ ...raw, vertical_cover: "https://evil.example/a.jpg" })), null);

const html = `<script id="vike_pageContext" type="application/json">${JSON.stringify({ data: { rankListInfo: [raw] } })}</script>`;
assert.equal(api.extractMangaRank(html)[0].rank, 1);
assert.throws(() => api.extractMangaRank("<html></html>"));
console.log("MANGA_FLOOR_RUNTIME=PASS");
