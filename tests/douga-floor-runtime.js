const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");
const { TextEncoder } = require("node:util");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const contentSource = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const rendererSource = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
const manifestSource = fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8");
const requests = [];

const makeFeedItem = (index, extra = {}) => ({
  aid: 200000 + index,
  bvid: `BV${String(index).padStart(10, "0")}`,
  title: `动画视频 ${index}`,
  cover: `http://i0.hdslb.com/bfs/archive/douga-${index}.webp`,
  duration: 60 + index,
  stat: { view: 100000 + index, danmaku: 1000 + index, upstreamStatField: true },
  author: { mid: 300000 + index, name: `动画UP ${index}`, upstreamAuthorField: true },
  upstreamMayAddFields: { ignored: true },
  ...extra
});

const makeRankItem = (index, extra = {}) => ({
  aid: 500000 + index,
  bvid: `BV${String(100 + index).padStart(10, "0")}`,
  title: `动画排行 ${index}`,
  pic: `http://i1.hdslb.com/bfs/archive/douga-rank-${index}.webp`,
  pubdate: 1784800000 + index,
  owner: { mid: 400000 + index, name: `排行UP ${index}`, upstreamOwnerField: true },
  stat: { view: 200000 + index, danmaku: 2000 + index, favorite: 3000 + index, coin: 4000 + index, upstreamStatField: true },
  upstreamRankField: true,
  ...extra
});

const feedRaw = {
  code: 0,
  message: "OK",
  extraEnvelopeField: true,
  data: {
    archives: [
      makeFeedItem(1), makeFeedItem(2), makeFeedItem(3), makeFeedItem(4), makeFeedItem(5),
      makeFeedItem(6), makeFeedItem(7), makeFeedItem(8), makeFeedItem(9), makeFeedItem(10),
      makeFeedItem(11, { cover: "https://evil.example/cover.webp" })
    ],
    extraDataField: true
  }
};

const rankRaw = {
  code: 0,
  data: { list: Array.from({ length: 100 }, (_, index) => makeRankItem(index + 1)), extraDataField: true },
  extraEnvelopeField: true,
  upstreamPadding: "x".repeat(70000)
};
const legacyRankRaw = {
  code: 0,
  data: Array.from({ length: 11 }, (_, index) => ({
    aid: 600000 + index,
    bvid: `BV${String(300 + index).padStart(10, "0")}`,
    title: `匿名动画排行 ${index + 1}`,
    pic: `http://i1.hdslb.com/bfs/archive/legacy-douga-rank-${index + 1}.webp`,
    mid: 700000 + index,
    author: `匿名排行UP ${index + 1}`,
    create: "2025-03-31 20:16",
    play: 300000 + index,
    video_review: 3000 + index,
    favorites: 4000 + index,
    coins: 5000 + index,
    duration: "1:23",
    upstreamExtra: true
  }))
};

const deviceRaw = { code: 0, data: { b_3: "fixture-buvid3", b_4: "fixture-buvid4", upstreamExtra: true } };
const navRaw = { code: -101, data: { wbi_img: { img_url: "https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png", sub_url: "https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png" } } };
const ticketRaw = { code: 0, data: {
  ticket: "fixture.ticket-value", ttl: 259200, created_at: 1785140950,
  nav: {
    img: "https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png",
    sub: "https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png"
  }
} };
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
  crypto: webcrypto,
  fetch: async (url, options) => {
    requests.push({ url, options });
    const payload = url.includes("/region/feed/rcmd") ? feedRaw
      : url.includes("/x/web-interface/nav") ? navRaw
      : url.includes("/x/frontend/finger/spi") ? deviceRaw
      : url.includes("/GenWebTicket") ? ticketRaw
      : url.includes("/ranking/v2?") ? rankRaw
      : null;
    return { ok: true, redirected: false, text: async () => JSON.stringify(payload) };
  }
};
windowObject.window = windowObject;

const context = vm.createContext({ window: windowObject, URL, AbortController, TextEncoder, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const toLocal = (value) => JSON.parse(JSON.stringify(value));
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);
const requestId = "d".repeat(32);

assert.equal(api.isRequest(inRealm({ channel: api.CHANNEL, version: api.VERSION, type: "REQUEST", operation: "DOUGA_FLOOR", requestId, batch: 4, includeRank: true })), true);
assert.equal(api.isRequest(inRealm({ channel: api.CHANNEL, version: api.VERSION, type: "REQUEST", operation: "DOUGA_FLOOR", requestId, batch: 4 })), false);
const projected = toLocal(api.projectDougaFloor(inRealm(feedRaw), inRealm(rankRaw), 4));
assert.equal(projected.items.length, 10);
assert.equal(projected.ranks.length, 100);
assert.deepEqual(Object.keys(projected.items[0]).sort(), ["aid", "bvid", "cover", "danmaku", "duration", "href", "ownerHref", "ownerMid", "ownerName", "title", "view"]);
assert.deepEqual(Object.keys(projected.ranks[0]).sort(), ["aid", "bvid", "coin", "cover", "danmaku", "favorite", "href", "ownerHref", "ownerMid", "ownerName", "pubdate", "rank", "title", "view"]);
assert.equal(Object.prototype.hasOwnProperty.call(projected.items[0], "upstreamMayAddFields"), false);
const projectedWithoutRank = toLocal(api.projectDougaFloor(inRealm(feedRaw), inRealm({ code: 0, data: { list: null } }), 4));
assert.equal(projectedWithoutRank.items.length, 10, "animation videos survive a broken ranking response");
assert.equal(projectedWithoutRank.ranks.length, 0, "animation ranking does not impersonate the official ranking with feed items");
const projectedLegacyRank = toLocal(api.projectDougaFloor(inRealm(feedRaw), inRealm(legacyRankRaw), 4));
assert.equal(projectedLegacyRank.ranks.length, 11, "anonymous legacy ranking response is projected");
assert.equal(projectedLegacyRank.ranks[0].title, "匿名动画排行 1");
assert.equal(projectedLegacyRank.ranks[0].ownerName, "匿名排行UP 1");
assert.equal(api.md5Hex("abc"), "900150983cd24fb0d6963f7d28e17f72");
assert.match(contentSource, /if \(operation === DOUGA_OPERATION\) \{\s*return isDougaData\(value\);/);
assert.match(contentSource, /isLiveText\(item\.title, 200\)/);
assert.match(contentSource, /requestDougaFloor\(currentLifecycle, false\)/);
assert.match(rendererSource, /const setDougaData = \(view, data\) =>/);
assert.match(rendererSource, /dougaView\.mediaFence = createViewMediaFence\(dougaView, rendererMediaFence\)/);
assert.match(rendererSource, /DOUGA_ICON: "assets\/homepage\/floors\/bili-douga\.svg"/);
assert.match(manifestSource, /assets\/homepage\/floors\/bili-douga\.svg/);
assert.doesNotMatch(rendererSource, /dougaView\.mediaFence = rendererMediaFence/);
assert.match(rendererSource, /data\.items\.forEach\(\(item, index\) => listFragment\.appendChild\(createDougaCard/);
assert.match(rendererSource, /data\.ranks\.slice\(0, 10\)\.forEach\(\(item\) => rankFragment\.appendChild\(createDougaRankRow/);
assert.match(rendererSource, /rank-video-popover__stats/);
assert.match(rendererSource, /bili-icon_shipin_shoucangshu/);
assert.match(rendererSource, /top: -138px/);
assert.match(rendererSource, /setTimeout\(\(\) => \{[\s\S]*is-rank-popover-visible[\s\S]*\}, 300\)/);
assert.match(rendererSource, /bili-icon_shipin_bofangshu/);
assert.match(rendererSource, /bili-icon_shipin_danmushu/);
assert.match(rendererSource, /bili-icon_xinxi_UPzhu/);
assert.match(rendererSource, /createDougaMetricIcon\(root, "play"\)/);
assert.match(rendererSource, /createDougaMetricIcon\(root, "danmaku"\)/);
assert.match(rendererSource, /createDougaMetricIcon\(root, "up"\)/);
assert.match(rendererSource, /ICONFONT: "assets\/homepage\/homepage-runtime\/international-home\/iconfont\.woff2"/);
assert.doesNotMatch(rendererSource, /root\.isConnected === true[\s\S]*node\.isConnected === true/);
assert.match(rendererSource, /\.card-pic \.count \.right \{ float: none; width: auto; min-height: 0; margin: 0; background: none; \}/);
assert.match(rendererSource, /watchLater\.setAttribute\("data-aid", String\(item\.aid\)\)/);
assert.match(rendererSource, /data-role", "douga-floor-more/);
assert.match(rendererSource, /data-role", "douga-rank-more/);
assert.match(rendererSource, /#bili_report_douga \.exchange-btn \.more \{ position: static;[\s\S]*opacity: 1; visibility: visible; \}/);
assert.match(rendererSource, /#bili_report_douga \.rank-header \.more \{ position: static;[\s\S]*opacity: 1; visibility: visible; \}/);
assert.match(rendererSource, /#bili_report_douga \.custom-rank-wrap \{[^}]*align-items: flex-start/);
assert.match(rendererSource, /#bili_report_douga \.custom-rank-wrap \.title \{[^}]*margin: 0/);
assert.match(contentSource, /requestDougaFloor\(currentLifecycle, true, false\)\.then/);
assert.match(contentSource, /requestDougaFloor\(currentLifecycle, false, true\)/);
assert.match(contentSource, /stage-11-banner-import-r21/);
assert.match(contentSource, /dougaRankRetryAttempted/);

(async () => {
  const result = await api.execute({ operation: "DOUGA_FLOOR", batch: 4, includeRank: true }, new AbortController());
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.items.length, 10);
  assert.equal(result.data.ranks.length, 100);
  assert.equal(JSON.stringify(rankRaw).length > 65536, true, "ranking response exceeds the default bridge cap");
  assert.equal(requests.some((request) => request.url === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=5&request_cnt=15&from_region=1005&device=web&plat=30&web_location=333.40138"), true);
  const rankRequest = requests.find((request) => request.url.includes("/x/web-interface/ranking/v2?"));
  assert.ok(rankRequest, "signed current ranking request emitted");
  assert.match(rankRequest.url, /rid=1005/);
  assert.match(rankRequest.url, /w_rid=[0-9a-f]{32}/);
  assert.match(rankRequest.url, /wts=\d+/);
  assert.equal(rankRequest.options.referrer, "https://www.bilibili.com/v/popular/rank/douga");
  assert.equal(rankRequest.options.referrerPolicy, "unsafe-url");
  assert.equal(rankRequest.options.credentials, "include");
  assert.equal(requests.find((request) => request.url.includes("/GenWebTicket")).options.credentials, "omit");
  assert.equal(requests.find((request) => request.url.includes("/GenWebTicket")).options.method, "POST");
  console.log("DOUGA_FLOOR_RUNTIME=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
