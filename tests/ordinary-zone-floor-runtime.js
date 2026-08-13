const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");
const { TextEncoder } = require("node:util");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const requests = [];
const makeItem = (index, extra = {}) => ({
  aid: 10000 + index,
  bvid: `BV${String(index).padStart(10, "0")}`,
  title: `音乐子分区视频 ${index}`,
  pic: `https://i0.hdslb.com/bfs/archive/music-${index}.webp`,
  duration: 60 + index,
  tid: 3 + index,
  tname: "音乐现场",
  stat: { view: 1000 + index, danmaku: 20 + index, like: 30 + index },
  owner: { mid: 20000 + index, name: `UP ${index}` },
  extra: true,
  ...extra
});
const makeRank = (index, extra = {}) => ({
  aid: 20000 + index,
  bvid: `BV${String(100 + index).padStart(10, "0")}`,
  title: `音乐排行 ${index}`,
  pic: `https://i1.hdslb.com/bfs/archive/music-rank-${index}.webp`,
  owner: { mid: 30000 + index, name: `排行UP ${index}` },
  pubdate: 1785038400,
  stat: {
    view: 3000 + index,
    danmaku: 40 + index,
    favorite: 50 + index,
    coin: 60 + index
  },
  ...extra
});
const makePgcRank = (index, extra = {}) => ({
  rank: index,
  season_id: 40000 + index,
  title: `电影排行 ${index}`,
  cover: `https://i0.hdslb.com/bfs/bangumi/movie-rank-${index}.png`,
  badge_info: { text: index === 1 ? "大会员" : "" },
  new_ep: { index_show: `2026-0${Math.min(index, 9)}-01上映` },
  rating: `${9 - index / 10}分`,
  desc: `${index}万弹幕`,
  extra: true,
  ...extra
});
const makePgcItem = (index, extra = {}) => ({
  episode_id: 50000 + index,
  season_id: 60000 + index,
  season_type: 2,
  title: `电影推荐 ${index}`,
  cover: `https://i0.hdslb.com/bfs/bangumi/movie-${index}.png`,
  hover: { img: `http://i0.hdslb.com/bfs/archive/movie-hover-${index}.jpg`, text: ["电影"] },
  sub_title: `电影副标题 ${index}`,
  rating: `${9 - index / 10}`,
  link: `https://www.bilibili.com/bangumi/play/ep${50000 + index}?theme=movie`,
  extra: true,
  ...extra
});

const listRaw = {
  code: 0,
  message: "OK",
  data: {
    archives: [
      makeItem(1),
      makeItem(2, { tid: 17, tname: "音乐翻唱" }),
      makeItem(3, { pic: "https://evil.example/bad.webp" }),
      ...Array.from({ length: 9 }, (_, index) => makeItem(index + 4))
    ],
    page: { count: 12, num: 1, size: 12 }
  },
  upstreamExtra: "ignored"
};
const rankRaw = {
  code: 0,
  data: { list: Array.from({ length: 11 }, (_, index) => makeRank(index + 1)) },
  extra: "ignored"
};
const pgcRankRaw = {
  code: 0,
  data: { list: Array.from({ length: 10 }, (_, index) => makePgcRank(index + 1)), note: "ignored", season_type: 2 }
};
const pgcFeedRaw = {
  code: 0,
  data: {
    modules: [
      { style: "web_banner_v2", title: "banner", items: [] },
      { style: "web_feed_v2", title: "更多推荐", items: Array.from({ length: 14 }, (_, index) => makePgcItem(index + 1)) }
    ]
  }
};
const cheeseListRaw = {
  code: 0,
  data: {
    season: Array.from({ length: 12 }, (_, index) => ({
      id: 70000 + index,
      title: `课堂课程 ${index + 1}`,
      cover: `https://archive.biliimg.com/bfs/archive/course-${index + 1}.jpg`,
      play: 5000 + index,
      up_id: 80000 + index,
      up_name: `课堂讲师 ${index + 1}`,
      update_info: `共${index + 1}课时`
    }))
  }
};
const cheeseRankRaw = {
  code: 0,
  data: {
    season_hot_list: Array.from({ length: 15 }, (_, index) => ({
      season_id: 90000 + index,
      season_title: `课堂排行 ${index + 1}`,
      season_cover: `https://archive.biliimg.com/bfs/archive/course-rank-${index + 1}.jpg`,
      up_name: `排行讲师 ${index + 1}`,
      stat_view: 10000 + index,
      ep_count: 20 + index
    }))
  }
};
const emptyListRaw = { code: 0, data: { archives: [], page: { count: 0, num: 1, size: 12 } } };
const deviceRaw = { code: 0, data: { b_3: "fixture-buvid3", b_4: "fixture-buvid4" } };
const navRaw = { code: -101, data: { wbi_img: { img_url: "https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png", sub_url: "https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png" } } };
const ticketRaw = { code: 0, data: {
  ticket: "fixture.ticket-value", ttl: 259200,
  nav: {
    img: "https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png",
    sub: "https://i0.hdslb.com/bfs/wbi/4932caff0ff746eab6f01bf08b70ac45.png"
  }
} };

const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: { cookie: "", querySelector() { return null; }, createElement() { return {}; }, head: { appendChild() {} }, documentElement: { appendChild() {} } },
  addEventListener() {},
  postMessage() {},
  setTimeout,
  clearTimeout,
  crypto: webcrypto,
  fetch: async (url, options) => {
    requests.push({ url, options });
    const payload = url.includes("/region/feed/rcmd") ? listRaw
      : url.includes("/x/web-interface/nav") ? navRaw
      : url.includes("/x/frontend/finger/spi") ? deviceRaw
      : url.includes("/GenWebTicket") ? ticketRaw
      : url.includes("/ranking/v2?") ? rankRaw
      : emptyListRaw;
    return { ok: true, redirected: false, text: async () => JSON.stringify(payload) };
  }
};
windowObject.window = windowObject;
const context = vm.createContext({ window: windowObject, URL, AbortController, TextEncoder, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const inRealm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);
const requestId = "a".repeat(32);

assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "ORDINARY_ZONE_FLOOR",
  requestId,
  batch: 0,
  zoneType: "music",
  includeRank: true
})), true);
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "ORDINARY_ZONE_FLOOR",
  requestId,
  batch: 0,
  zoneType: "music",
  includeRank: true,
  query: "no"
})), false);
assert.equal(api.isRequest(inRealm({
  channel: api.CHANNEL,
  version: api.VERSION,
  type: "REQUEST",
  operation: "ORDINARY_ZONE_FLOOR",
  requestId,
  batch: 0,
  zoneType: "sports",
  includeRank: false
})), true);

const projected = api.projectOrdinaryZoneFloor("music", inRealm(listRaw), inRealm(rankRaw), 0);
assert.equal(projected.items.length, 11, "music channel feed keeps all valid entries up to twelve cards");
assert.equal(projected.ranks.length, 11, "all legal ranking entries cross the world");
assert.equal(projected.rankType, "video");
assert.equal(projected.itemType, "video");
assert.equal(projected.status, "success");
const projectedWithoutRank = api.projectOrdinaryZoneFloor("music", inRealm(listRaw), inRealm({ code: 0, data: { list: null } }), 0);
assert.equal(projectedWithoutRank.items.length, 11, "valid floor videos survive a broken ranking response");
assert.equal(projectedWithoutRank.ranks.length, 0, "broken ranking response preserves the ranking skeleton");
assert.equal(projectedWithoutRank.rankType, "video");
const legacyRankRaw = {
  code: 0,
  data: Array.from({ length: 11 }, (_, index) => ({
    aid: 800000 + index,
    bvid: `BV${String(500 + index).padStart(10, "0")}`,
    title: `匿名音乐排行 ${index + 1}`,
    pic: `http://i1.hdslb.com/bfs/archive/legacy-music-rank-${index + 1}.webp`,
    mid: 900000 + index,
    author: `匿名音乐UP ${index + 1}`,
    create: "2025-03-31 20:16",
    play: 400000 + index,
    video_review: 4000 + index,
    favorites: 5000 + index,
    coins: 6000 + index,
    duration: "2:34"
  }))
};
const projectedLegacyRank = api.projectOrdinaryZoneFloor("music", inRealm(listRaw), inRealm(legacyRankRaw), 0);
assert.equal(projectedLegacyRank.ranks.length, 11, "anonymous legacy ranking response is projected");
assert.equal(projectedLegacyRank.ranks[0].title, "匿名音乐排行 1");
assert.equal(projected.items[1].title, "音乐子分区视频 2");
assert.deepEqual(Object.keys(projected.items[0]).sort(), ["aid", "bvid", "cover", "danmaku", "duration", "href", "ownerHref", "ownerMid", "ownerName", "title", "view"]);
assert.equal(api.ordinaryZoneRoute("music", 0, "list").path, "/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1003&device=web&plat=30&web_location=333.40138");
assert.equal(api.ordinaryZoneRoute("music", 1, "list").path, "/x/web-interface/region/feed/rcmd?display_id=2&request_cnt=15&from_region=1003&device=web&plat=30&web_location=333.40138");
assert.equal(api.ordinaryZoneRoute("dance", 0, "list").path, "/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1004&device=web&plat=30&web_location=333.40138");
assert.equal(api.ordinaryZoneRoute("information", 0, "list").path, "/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1011&device=web&plat=30&web_location=333.40138");
assert.equal(api.ordinaryZoneRoute("cinephile", 0, "list").path, "/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1001&device=web&plat=30&web_location=333.40138");
assert.equal(api.ordinaryZoneRoute("movie", 0, "list").path, "/pgc/page/web/v2?name=movie");
assert.equal(api.ordinaryZoneRoute("teleplay", 0, "list").path, "/pgc/page/web/v2?name=tv");
assert.equal(api.ordinaryZoneRoute("documentary", 0, "list").path, "/pgc/page/web/v2?name=documentary");
assert.equal(api.ordinaryZoneRoute("course", 0, "list").path, "/pugv/app/web/floor/switch?load_type=1&display_id=1");
assert.equal(api.ordinaryZoneRoute("course", 0, "rank").path, "/pugv/app/web/season/hot/list?category_id=0");
assert.equal(api.ordinaryZoneRoute("music", 0, "rank").path, "/x/web-interface/ranking/v2?rid=1003&type=all&web_location=333.934");
assert.equal(api.ordinaryZoneRoute("knowledge", 0, "rank").path, "/x/web-interface/ranking/v2?rid=1010&type=all&web_location=333.934");
assert.equal(api.ordinaryZoneRoute("movie", 0, "rank").path, "/pgc/season/rank/web/list?day=3&season_type=2&web_location=333.934");
assert.equal(api.ordinaryZoneRoute("life", 0, "rank"), null);
assert.equal(api.ordinaryZoneRoute("information", 0, "rank"), null);

const movieProjected = api.projectOrdinaryZoneFloor("movie", inRealm(pgcFeedRaw), inRealm(pgcRankRaw), 0);
assert.equal(movieProjected.itemType, "pgc");
assert.equal(movieProjected.items.length, 12);
assert.equal(movieProjected.items[0].cover, "https://i0.hdslb.com/bfs/bangumi/movie-1.png", "PGC cards preserve the portrait poster instead of the horizontal hover frame");
assert.deepEqual(Object.keys(movieProjected.items[0]).sort(), ["cover", "episodeId", "href", "rating", "seasonId", "subtitle", "title"]);
assert.equal(movieProjected.items[0].href, "https://www.bilibili.com/bangumi/play/ep50001");
assert.equal(movieProjected.rankType, "pgc");
assert.equal(movieProjected.ranks.length, 10);
assert.deepEqual(Object.keys(movieProjected.ranks[0]).sort(), ["badgeText", "cover", "href", "rank", "scoreText", "seasonId", "title", "updateText"]);
assert.equal(movieProjected.ranks[0].title, "电影排行 1");
const movieBatchOne = api.projectOrdinaryZoneFloor("movie", inRealm(pgcFeedRaw), inRealm(pgcRankRaw), 1);
assert.equal(movieBatchOne.items[0].episodeId, 50005, "PGC batch changes rotate the recommendation window");
assert.notEqual(movieBatchOne.items[0].episodeId, movieProjected.items[0].episodeId);

const lifeProjected = api.projectOrdinaryZoneFloor("life", inRealm(listRaw), null, 0);
assert.equal(lifeProjected.rankType, "none");
assert.equal(lifeProjected.ranks.length, 0);

const cheeseProjected = api.projectOrdinaryZoneFloor("course", inRealm(cheeseListRaw), inRealm(cheeseRankRaw), 0);
assert.equal(cheeseProjected.itemType, "cheese");
assert.equal(cheeseProjected.rankType, "cheese");
assert.equal(cheeseProjected.items.length, 12);
assert.equal(cheeseProjected.ranks.length, 15);
assert.equal(cheeseProjected.items[0].href, "https://www.bilibili.com/cheese/play/ss70000");
assert.equal(cheeseProjected.ranks[0].href, "https://www.bilibili.com/cheese/play/ss90000");
assert.deepEqual(Object.keys(cheeseProjected.items[0]).sort(), ["cover", "href", "ownerHref", "ownerMid", "ownerName", "play", "seasonId", "title", "updateText"]);
assert.deepEqual(Object.keys(cheeseProjected.ranks[0]).sort(), ["cover", "episodeCount", "href", "ownerName", "play", "rank", "seasonId", "title"]);
const cheeseBatchOne = api.projectOrdinaryZoneFloor("course", inRealm(cheeseListRaw), inRealm(cheeseRankRaw), 1);
assert.equal(cheeseBatchOne.items[0].seasonId, 70004, "课堂换一换旋转课程批次");

(async () => {
  const result = await api.execute({ operation: "ORDINARY_ZONE_FLOOR", zoneType: "music", batch: 0, includeRank: true }, new AbortController());
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.items.length, 11);
  assert.equal(result.data.ranks.length, 11);
  const empty = api.projectOrdinaryZoneFloor("sports", inRealm(emptyListRaw), inRealm(rankRaw), 0);
  assert.equal(empty.items.length, 0);
  assert.equal(empty.status, "empty", "empty parent feed is not a committed success");
  assert.equal(empty.ranks.length, 11);
  assert.equal(requests.some((request) => request.url === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1003&device=web&plat=30&web_location=333.40138"), true);
  const rankRequest = requests.find((request) => request.url.includes("/x/web-interface/ranking/v2?"));
  assert.ok(rankRequest);
  assert.match(rankRequest.url, /rid=1003/);
  assert.match(rankRequest.url, /w_rid=[0-9a-f]{32}/);
  console.log("ORDINARY_ZONE_FLOOR_RUNTIME=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
