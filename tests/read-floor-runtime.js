const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const requests = [];
const makeArticle = (index, extra = {}) => ({
  id: 1000 + index,
  title: `专栏文章 ${index}`,
  image_urls: [`http://i0.hdslb.com/bfs/new_dyn/read-${index}.jpg`],
  author: { mid: 2000 + index, name: `专栏作者 ${index}`, ignored: true },
  stats: { view: 10000 + index, reply: 100 + index, ignored: true },
  ignored: true,
  ...extra
});
const makeRank = (index, extra = {}) => ({
  id: 5000 + index,
  title: `专栏排行 ${index}`,
  image_urls: [`https://i1.hdslb.com/bfs/article/rank-${index}.jpg`],
  ignored: true,
  ...extra
});

const rankRaw = {
  code: 0,
  data: [
    ...Array.from({ length: 10 }, (_, index) => makeRank(index + 1)),
    makeRank(1),
    makeRank(20, { image_urls: ["https://evil.example/rank.jpg"] })
  ],
  ignored: true
};
const recommendRaw = {
  code: 0,
  data: [
    makeArticle(1),
    makeArticle(2),
    makeArticle(3),
    makeArticle(4),
    makeArticle(5),
    makeArticle(6),
    makeArticle(7),
    makeArticle(8),
    makeArticle(9),
    makeArticle(10),
    makeArticle(11),
    makeArticle(12),
    makeArticle(13),
    makeArticle(14),
    makeArticle(15),
    makeArticle(16),
    makeArticle(17),
    makeArticle(18),
    makeArticle(1),
    makeArticle(99, { id: 5001 }),
    makeArticle(100, { image_urls: ["https://evil.example/read.jpg"] })
  ],
  ignored: true
};

const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: {
    cookie: "",
    querySelector() { return null; },
    createElement() { return {}; },
    head: { appendChild() {} },
    documentElement: { appendChild() {} }
  },
  addEventListener() {},
  postMessage() {},
  setTimeout,
  clearTimeout,
  fetch: async (url, options) => {
    requests.push({ url, options });
    const payload = url.includes("/x/article/recommends") ? recommendRaw : rankRaw;
    return { ok: true, redirected: false, text: async () => JSON.stringify(payload) };
  }
};
windowObject.window = windowObject;

const context = vm.createContext({ window: windowObject, URL, AbortController, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);
const toLocal = (value) => JSON.parse(JSON.stringify(value));
const requestId = "e".repeat(32);

assert.equal(api.isRequest(inRealm({ channel: api.CHANNEL, version: api.VERSION, type: "REQUEST", operation: "READ_FLOOR", requestId, batch: 1 })), true);
assert.equal(api.isRequest(inRealm({ channel: api.CHANNEL, version: api.VERSION, type: "REQUEST", operation: "READ_FLOOR", requestId, batch: 1, query: "no" })), false);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.READ_FLOOR, api.fixedUrl), [
  "https://api.bilibili.com/x/article/recommends?ps=50",
  "https://api.bilibili.com/x/article/rank/list?cid=3"
]);

const first = toLocal(api.projectReadFloor(inRealm(recommendRaw), inRealm(rankRaw), 0));
const second = toLocal(api.projectReadFloor(inRealm(recommendRaw), inRealm(rankRaw), 1));
assert.equal(first.articles.length, 8);
assert.equal(second.articles.length, 8);
assert.equal(first.ranks.length, 10);
assert.notDeepEqual(first.articles.map((item) => item.id), second.articles.map((item) => item.id));
assert.equal(new Set(first.articles.map((item) => item.id)).size, first.articles.length);
assert.equal(first.articles.some((item) => first.ranks.some((rank) => rank.id === item.id)), false);
assert.equal(first.articles.some((item) => item.id === 5001), false);
assert.deepEqual(Object.keys(first.articles[0]).sort(), ["authorHref", "authorMid", "authorName", "cover", "href", "id", "reply", "title", "view"]);
assert.deepEqual(Object.keys(first.ranks[0]).sort(), ["cover", "href", "id", "rank", "title"]);
assert.equal(first.articles[0].cover.startsWith("https://"), true);
assert.equal(first.status, "success");

(async () => {
  const result = await api.execute({ operation: "READ_FLOOR", batch: 1 }, new AbortController());
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.articles.length, 8);
  assert.equal(result.data.ranks.length, 10);
  assert.equal(requests[0].url, "https://api.bilibili.com/x/article/recommends?ps=50");
  assert.equal(requests[1].url, "https://api.bilibili.com/x/article/rank/list?cid=3");
  assert.equal(requests.every((request) => request.options.method === "GET" && request.options.credentials === "include"), true);
  console.log("READ_FLOOR_RUNTIME=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
