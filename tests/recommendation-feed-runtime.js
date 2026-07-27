const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const contentSource = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const requests = [];

const makeEntry = (index, extra = {}) => ({
  id: 100000 + index,
  bvid: `BV${String(index).padStart(10, "0")}`,
  title: `推荐视频 ${index}`,
  pic: `http://i0.hdslb.com/bfs/archive/recommend-${index}.webp`,
  duration: 60 + index,
  owner: { name: `UP主 ${index}`, extraOwnerField: true },
  stat: { view: 10000 + index, danmaku: index, extraStatField: true },
  upstreamMayAddFields: { ignored: true },
  ...extra
});

const rawPayload = {
  code: 0,
  message: "OK",
  ttl: 1,
  addedEnvelopeField: "ignored",
  data: {
    item: [
      makeEntry(1),
      makeEntry(2),
      makeEntry(3),
      makeEntry(4),
      makeEntry(5),
      makeEntry(6),
      makeEntry(7),
      makeEntry(8),
      makeEntry(9),
      makeEntry(10),
      makeEntry(11, { pic: "https://evil.example/cover.webp" })
    ],
    extraDataField: true
  }
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
    return {
      ok: true,
      redirected: false,
      text: async () => JSON.stringify(rawPayload)
    };
  }
};
windowObject.window = windowObject;

const context = vm.createContext({
  window: windowObject,
  URL,
  AbortController,
  console,
  setTimeout,
  clearTimeout
});
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const toLocal = (value) => JSON.parse(JSON.stringify(value));
const requestId = "a".repeat(32);
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);

assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "RECOMMENDATION_FEED",
  requestId,
  batch: 3
})), true, "bounded recommendation request accepted");
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "RECOMMENDATION_FEED",
  requestId,
  batch: 3,
  arbitraryQuery: "must-not-pass"
})), false, "arbitrary request keys rejected");
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "WATCH_LATER_MUTATE",
  requestId,
  aid: 100001,
  action: "add"
})), true, "bounded watch-later mutation accepted");

const projected = toLocal(api.projectRecommendation(inRealm(rawPayload), 3));
assert.equal(projected.batch, 3);
assert.equal(projected.items.length, 10);
assert.deepEqual(Object.keys(projected.items[0]).sort(), [
  "aid", "bvid", "cover", "duration", "href", "ownerName", "title", "view"
]);
assert.equal(projected.items[0].cover.startsWith("https://i0.hdslb.com/bfs/archive/"), true);
assert.equal(projected.items[0].cover.endsWith("@412w_232h_1c.avif"), true);
assert.equal(Object.prototype.hasOwnProperty.call(projected.items[0], "upstreamMayAddFields"), false);
assert.match(contentSource, /const createRecommendationInitialBatch = \(\) =>/);
assert.match(contentSource, /window\.crypto\.getRandomValues\(value\)/);
assert.match(contentSource, /return 1 \+ \(value\[0\] % 9999\)/);
assert.match(contentSource, /batch: initialRecommendationBatch/);
assert.match(contentSource, /requestPageBridge\(RECOMMENDATION_OPERATION, currentLifecycle, initialRecommendationBatch/);

(async () => {
  const controller = new AbortController();
  const result = await api.execute({ operation: "RECOMMENDATION_FEED", batch: 3 }, controller);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.items.length, 10);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url,
    "https://api.bilibili.com/x/web-interface/wbi/index/top/rcmd?web_location=1430651&fresh_type=3&fresh_idx=3&fresh_idx_1h=3&homepage_ver=0");
  assert.equal(requests[0].options.credentials, "include");
  assert.equal(requests[0].options.method, "GET");
  windowObject.document.cookie = `bili_jct=${"b".repeat(32)}`;
  const mutateResult = await api.execute({ operation: "WATCH_LATER_MUTATE", aid: 100001, action: "add" }, controller);
  assert.equal(mutateResult.ok, true, JSON.stringify(mutateResult));
  assert.deepEqual(toLocal(mutateResult.data), { aid: 100001, action: "add", success: true });
  assert.equal(requests[1].url, "https://api.bilibili.com/x/v2/history/toview/add");
  assert.equal(requests[1].options.method, "POST");
  assert.equal(requests[1].options.credentials, "include");
  assert.deepEqual([...new URLSearchParams(requests[1].options.body).keys()], ["aid", "csrf"]);
  console.log("RECOMMENDATION_FEED_RUNTIME=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
