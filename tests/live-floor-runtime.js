const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bridgeSource = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const contentSource = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const rendererSource = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
const cssSource = fs.readFileSync(path.join(__dirname, "..", "homepage.css"), "utf8");
const requests = [];
const room = (id, extra = {}) => ({
  roomid: id, title: `直播 ${id}`, uname: `主播 ${id}`,
  area_v2_name: "游戏", online: 1000 + id,
  cover: `http://i0.hdslb.com/bfs/live/cover-${id}.jpg`,
  keyframe: `http://i1.hdslb.com/bfs/live/keyframe-${id}.jpg`,
  face: `http://i2.hdslb.com/bfs/face/${id}.jpg`,
  uid: 9000 + id, token: "must-not-leak", ...extra
});
const payloads = [
  { code: 0, extra: true, data: { online_total: 987654, recommend_room_list: [...Array.from({ length: 12 }, (_, i) => room(i + 1)), room(99, { cover: "https://evil.example/x" })], ranking_list: Array.from({ length: 6 }, (_, i) => { const value = room(30 + i); return { roomid: value.roomid, title: value.title, uname: value.uname, online: value.online, face: value.face, link: "/6", raw: true }; }), preview_banner_list: [{ raw: true }] } },
  { code: 0, data: { recommend_room_list: Array.from({ length: 12 }, (_, i) => room(50 + i)), raw: "ignored" } },
  { code: 0, data: { list: [room(80, {
    area_v2_name: undefined,
    cover: "http://i2.hdslb.com/bfs/face/following-avatar-80.jpg",
    face: "http://i2.hdslb.com/bfs/face/following-avatar-80.jpg",
    pic: "http://i0.hdslb.com/bfs/live/following-room-cover-80.jpg"
  }), room(81, { face: null })], account: { mid: 1 } } }
];
const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: { cookie: "SESSDATA=secret", querySelector() { return null; }, createElement() { return {}; }, head: { appendChild() {} }, documentElement: { appendChild() {} } },
  addEventListener() {}, postMessage() {}, setTimeout, clearTimeout,
  fetch: async (url, options) => {
    requests.push({ url, options });
    const body = payloads[requests.length - 1];
    return { ok: true, redirected: false, text: async () => JSON.stringify(body) };
  }
};
windowObject.window = windowObject;
const context = vm.createContext({ window: windowObject, URL, AbortController, console, setTimeout, clearTimeout });
vm.runInContext(bridgeSource, context, { filename: "page-bridge.js" });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const local = (value) => JSON.parse(JSON.stringify(value));
const realm = (value) => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(value))})`, context);

const projected = local(api.projectLiveFloorInitial(realm(payloads[0])));
assert.deepEqual(Object.keys(projected).sort(), ["onlineTotal", "ranks", "rooms"]);
assert.equal(projected.rooms.length, 12);
assert.equal(projected.ranks.length, 6);
assert.deepEqual(Object.keys(projected.rooms[0]).sort(), ["areaName", "cover", "face", "href", "keyframe", "online", "roomId", "title", "uname"]);
assert.deepEqual(Object.keys(projected.ranks[0]).sort(), ["face", "href", "online", "roomId", "title", "uname"]);
assert.equal(JSON.stringify(projected).includes("token"), false);
const followingProjection = local(api.projectLiveFloorFollowing(realm(payloads[2])));
assert.equal(followingProjection.rooms.length, 1, "bad following item skipped");
assert.equal(followingProjection.rooms[0].cover, "https://i0.hdslb.com/bfs/live/following-room-cover-80.jpg", "following feed uses pic instead of avatar-valued cover");
assert.equal(followingProjection.rooms[0].keyframe, "https://i1.hdslb.com/bfs/live/keyframe-80.jpg", "following hover keeps the live keyframe");
assert.deepEqual(local(api.projectLiveFloorFollowing(realm({ code: 0, data: { list: [], extra: true } }))), { rooms: [] });

assert.match(rendererSource, /floor\.id = "bili_live"/);
assert.match(rendererSource, /space\.id = "bili_report_live"/);
assert.match(rendererSource, /space\.appendChild\(liveList\); space\.appendChild\(tabs\); floor\.appendChild\(space\)/);
assert.doesNotMatch(rendererSource.slice(rendererSource.indexOf("const createLiveFloor ="), rendererSource.indexOf("const createPgcTimelineLink =")), /floor-layout|appendProxyFloorContent/);
assert.match(rendererSource, /bili-icon_xinxi_renqi/);
assert.match(rendererSource, /live-card__keyframe/);
assert.match(rendererSource, /keyframe\.setAttribute\("data-keyframe-src", item\.keyframe\)/);
assert.match(rendererSource, /const requestKeyframeForTarget = \(target\) =>/);
assert.match(rendererSource, /addListenerWithCleanup\(list, "pointerover"/);
assert.match(rendererSource, /keyframe\.setAttribute\("src", source\)/);
assert.match(rendererSource, /resolveLiveFloorImageUrl = \(value\) => resolveFocusUrl\(value, FOCUS_IMAGE_HOSTS, \["\/bfs\/"\], true\)/);
assert.match(rendererSource, /setLiveFloorRooms = \(view, data, source = "recommendation"\)/);
assert.match(contentSource, /LIVE_FLOOR_SESSION_KEY/);
assert.match(contentSource, /preferLiveFloorFollowingOnce\(currentLifecycle\)/);
assert.match(contentSource, /requestLiveFloorMore\(currentLifecycle\)/);
assert.match(contentSource, /requestLiveFloorFollowing\(currentLifecycle, true\)/);
assert.match(contentSource, /onLiveFloorFollowingRequest: \(\) => requestLiveFloorFollowing\(currentLifecycle, false\)/);
assert.match(contentSource, /liveFloorInitialGeneration !== generation/);
for (const css of [rendererSource, cssSource]) {
  assert.match(css, /#bili_report_live > \.live-list \{ flex: 0 0 1286px/);
  assert.match(css, /max-width: 1870px[\s\S]*1070px/);
  assert.match(css, /max-width: 1654px[\s\S]*854px/);
  assert.match(css, /max-width:\s*1654px[\s\S]*live-list-box\s*\{\s*grid-template-columns:\s*repeat\(4, 206px\)/);
  assert.match(css, /max-width: 1438px[\s\S]*710px/);
  assert.match(css, /nth-child\(n \+ 11\)/);
  assert.match(css, /nth-child\(n \+ 9\)/);
}

(async () => {
  const initial = await api.execute({ operation: "LIVE_FLOOR_INITIAL" }, new AbortController());
  const more = await api.execute({ operation: "LIVE_FLOOR_MORE" }, new AbortController());
  const following = await api.execute({ operation: "LIVE_FLOOR_FOLLOWING" }, new AbortController());
  assert.equal(initial.ok && more.ok && following.ok, true);
  assert.deepEqual(requests.map((entry) => entry.url), [
    "https://api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web",
    "https://api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web",
    "https://api.live.bilibili.com/relation/v1/feed/feed_list?pagesize=12&page=1"
  ]);
  assert.deepEqual(requests.map((entry) => entry.options.credentials), ["omit", "omit", "include"]);
  assert.equal(requests.every((entry) => entry.options.method === "GET" && !entry.options.headers), true);
  console.log("LIVE_FLOOR_RUNTIME=PASS");
})().catch((error) => { console.error(error); process.exitCode = 1; });
