const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const bridgePath = path.join(ROOT, "extension-b", "page-bridge.js");
const contentPath = path.join(ROOT, "extension-b", "content.js");
const rendererPath = path.join(ROOT, "extension-b", "homepage-renderer.js");
const manifestPath = path.join(ROOT, "extension-b", "manifest.json");
const bridgeSource = fs.readFileSync(bridgePath, "utf8");
const contentSource = fs.readFileSync(contentPath, "utf8");
const rendererSource = fs.readFileSync(rendererPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

assert.match(contentSource, /const BUILD_MARKER = "stage-11-banner-import-r21";/);
assert.doesNotMatch(contentSource, /stage-6-visual-parity-r4/);
assert.match(contentSource, /host\.setAttribute\("data-extension-b-build", BUILD_MARKER\)/);
const historyValidatorStart = contentSource.indexOf("  const isHistoryData =");
const historyValidatorEnd = contentSource.indexOf("  const isLiveHoverData =", historyValidatorStart);
assert.ok(historyValidatorStart >= 0 && historyValidatorEnd > historyValidatorStart, "history validator source boundary");
  const historyValidatorSource = contentSource.slice(historyValidatorStart, historyValidatorEnd);
  assert.match(historyValidatorSource, /items\.length <= 20/);
  assert.doesNotMatch(historyValidatorSource, /items\.length <= 8/);

  const summaryValidatorStart = contentSource.indexOf("  const bridgeOwnKeys =");
  const summaryValidatorEnd = contentSource.indexOf("  const isExactBridgeResponse =", summaryValidatorStart);
  assert.ok(summaryValidatorStart >= 0 && summaryValidatorEnd > summaryValidatorStart,
    "summary validator source boundary");
  const summaryValidatorHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(summaryValidatorStart, summaryValidatorEnd)}; return {
      isBridgeSummaryData,
      makeLiveSummary: (item) => ({ items: [{
        face: item.face,
        link: item.link,
        online: item.online,
        title: item.title,
        uid: item.uid,
        uname: item.uname
      }] }),
      makeFavoriteSummary: (withExtraItemKey = false) => {
        const item = {
          title: "收藏项目",
          cover: "https://i1.hdslb.com/bfs/archive/favorite.webp",
          owner: "",
          duration: 65,
          href: "https://www.bilibili.com/video/BVABCDEFGHIJ"
        };
        if (withExtraItemKey) item.secret = "must-be-rejected";
        return {
          allHref: "https://space.bilibili.com/",
          tabs: [{
            key: "folder-1",
            title: "我创建的收藏夹",
            count: 39,
             viewAllHref: "https://space.bilibili.com/",
             playAllHref: "https://www.bilibili.com/medialist/play/ml1",
            items: [item]
          }]
        };
      },
      makeMaxFavoriteSummary: () => {
        const item = {
          title: "收藏项目",
          cover: "https://i1.hdslb.com/bfs/archive/favorite.webp",
          owner: "",
          duration: 65,
          href: "https://www.bilibili.com/video/BVABCDEFGHIJ"
        };
        return {
          allHref: "https://space.bilibili.com/",
          tabs: Array.from({ length: 20 }, (_, tabIndex) => ({
            key: "folder-" + tabIndex,
            title: "收藏夹" + tabIndex,
            count: 20,
            viewAllHref: "https://space.bilibili.com/",
          playAllHref: "https://www.bilibili.com/medialist/play/ml1",
            items: Array.from({ length: 20 }, () => ({ ...item }))
          }))
        };
      },
      makeDynamicSummary: (count, withExtraKey = false) => {
        const value = { count };
        if (withExtraKey) value.extra = true;
        return value;
      },
      makeEmptyDynamicSummary: () => ({})
    }; })()`,
    {
      URL,
      SHOW_LOGIN_OPERATION: "SHOW_LOGIN",
      LOGOUT_OPERATION: "LOGOUT",
      PROFILE_STATS_OPERATION: "PROFILE_STATS",
      LIVE_HOVER_OPERATION: "LIVE_HOVER"
    }
  );
  const validFavoriteSummary = summaryValidatorHarness.makeFavoriteSummary();
  const invalidFavoriteSummary = summaryValidatorHarness.makeFavoriteSummary(true);
  assert.equal(Object.keys(validFavoriteSummary.tabs[0].items[0]).sort().join(","),
    "cover,duration,href,owner,title", "favorite fixture uses the real exact item keys");
  assert.equal(summaryValidatorHarness.isBridgeSummaryData("FAVORITE_SUMMARY", validFavoriteSummary), true,
    "production favorite validator accepts the exact projected item");
  assert.equal(summaryValidatorHarness.isBridgeSummaryData("FAVORITE_SUMMARY", invalidFavoriteSummary), false,
    "production favorite validator rejects an additional item key");
  const maxFavoriteSummary = summaryValidatorHarness.makeMaxFavoriteSummary();
  assert.equal(summaryValidatorHarness.isBridgeSummaryData("FAVORITE_SUMMARY", maxFavoriteSummary), true,
    "favorite validator accepts 20 tabs with 20 items each");
  assert.equal(summaryValidatorHarness.isBridgeSummaryData("FAVORITE_SUMMARY", {
    ...maxFavoriteSummary,
    tabs: [...maxFavoriteSummary.tabs, { ...maxFavoriteSummary.tabs[0] }]
  }), false, "favorite validator rejects the 21st tab");
  assert.equal(summaryValidatorHarness.isBridgeSummaryData("FAVORITE_SUMMARY", {
    ...maxFavoriteSummary,
    tabs: [{ ...maxFavoriteSummary.tabs[0], items: [...maxFavoriteSummary.tabs[0].items, { ...maxFavoriteSummary.tabs[0].items[0] }] }, ...maxFavoriteSummary.tabs.slice(1)]
  }), false, "favorite validator rejects the 21st item");
  for (const count of [0, 7, 99, Number.MAX_SAFE_INTEGER]) {
    assert.equal(summaryValidatorHarness.isBridgeSummaryData("DYNAMIC_SUMMARY", summaryValidatorHarness.makeDynamicSummary(count)), true,
      `dynamic exact-key validator accepts count ${count}`);
  }
  for (const invalidDynamic of [
    summaryValidatorHarness.makeEmptyDynamicSummary(),
    summaryValidatorHarness.makeDynamicSummary("7"),
    summaryValidatorHarness.makeDynamicSummary(1.5),
    summaryValidatorHarness.makeDynamicSummary(-1),
    summaryValidatorHarness.makeDynamicSummary(Number.MAX_SAFE_INTEGER + 1),
    summaryValidatorHarness.makeDynamicSummary(7, true)
  ]) {
    assert.equal(summaryValidatorHarness.isBridgeSummaryData("DYNAMIC_SUMMARY", invalidDynamic), false,
      "dynamic content validator rejects malformed or extra-key data");
  }

  assert.deepEqual(manifest.content_scripts[0].matches, [
  "https://www.bilibili.com/",
  "https://www.bilibili.com/index.html"
]);
assert.equal(manifest.content_scripts[0].run_at, "document_start");
assert.deepEqual(
  manifest.web_accessible_resources.find((entry) => entry.resources.includes("page-bridge.js")),
  { resources: ["page-bridge.js"], matches: ["https://www.bilibili.com/*"] }
);

const listeners = new Set();
const posted = [];
const fetchRequests = [];
const deferredFetches = [];
let fetchCalls = 0;
let abortCalls = 0;
let nextTimerId = 1;
const timers = new Map();

class TestAbortController extends AbortController {
  abort() {
    abortCalls += 1;
    super.abort();
  }
}

const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document: { cookie: "" },
  addEventListener(type, listener) {
    if (type === "message") listeners.add(listener);
  },
  postMessage(message, targetOrigin) {
    posted.push({ message, targetOrigin });
  },
  setTimeout(callback, delay) {
    const id = nextTimerId++;
    timers.set(id, { callback, delay });
    return id;
  },
  clearTimeout(id) {
    timers.delete(id);
  },
  fetch(url, options) {
    fetchCalls += 1;
    fetchRequests.push({ url, options });
    let resolveFetch;
    let rejectFetch;
    const promise = new Promise((resolve, reject) => {
      resolveFetch = resolve;
      rejectFetch = reject;
    });
    promise.catch(() => {});
    deferredFetches.push({ resolve: resolveFetch, reject: rejectFetch });
    return promise;
  }
};

const context = vm.createContext({ window: windowObject, AbortController: TestAbortController, URL });
vm.runInContext(bridgeSource, context, { filename: bridgePath });
const api = windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__;
const inBridgeRealm = (source) => vm.runInContext(source, context);
const toLocal = (value) => JSON.parse(JSON.stringify(value));
assert.deepEqual(toLocal(api.OPERATION_ROUTES.DYNAMIC_SUMMARY), [{
  host: "api.bilibili.com",
  path: "/x/web-interface/dynamic/entrance?alltype_offset=0&video_offset=0&article_offset=0",
  method: "GET"
}]);
const dynamicExtra = inBridgeRealm("({ code: 0, message: 'ok', data: { update_info: { item: { count: 7, ignored_item_field: true }, ignored_update_field: 'ignored' }, ignored_data_field: null }, upstream_extra: { secret: 'must-not-leak' } })");
const projectedDynamic = api.projectDynamicSummary(dynamicExtra);
assert.deepEqual(toLocal(projectedDynamic), { count: 7 });
assert.deepEqual(Object.keys(projectedDynamic), ["count"]);
assert.equal(Object.isFrozen(projectedDynamic), true);
assert.equal(api.isDynamicSummaryEnvelope(dynamicExtra), true);
for (const invalid of [
  inBridgeRealm("({ code: 0, data: { update_info: { item: {} } } })"),
  inBridgeRealm("({ code: 0, data: { update_info: { item: { count: '7' } } } })"),
  inBridgeRealm("({ code: 0, data: { update_info: { item: { count: 1.5 } } } })"),
  inBridgeRealm("({ code: 0, data: { update_info: { item: { count: -1 } } } })"),
  inBridgeRealm("({ code: 0, data: { update_info: { item: { count: Number.MAX_SAFE_INTEGER + 1 } } } })"),
  inBridgeRealm("({ code: 1, data: { update_info: { item: { count: 7 } } } })")
]) {
  assert.equal(api.isDynamicSummaryEnvelope(invalid), false);
  assert.throws(() => api.projectDynamicSummary(invalid), /schema/);
}
assert.doesNotMatch(
  bridgeSource.slice(bridgeSource.indexOf("DYNAMIC_SUMMARY:"), bridgeSource.indexOf("FAVORITE_SUMMARY:")),
  /exactKeys/
);
const flushMicrotasks = async () => {
  for (let index = 0; index < 12; index += 1) await Promise.resolve();
};
const dispatch = (event) => {
  for (const listener of listeners) listener(event);
};
const response = (data, extra = {}) => ({
  ok: true,
  redirected: false,
  text: async () => JSON.stringify({ code: 0, data, message: "ok", ttl: 1, ...extra })
});
const requestFor = (operation, requestId = "0123456789abcdef0123456789abcdef") => inBridgeRealm(`({
  channel: "${api.CHANNEL}",
  version: "${api.VERSION}",
  type: "REQUEST",
  operation: "${operation}",
  requestId: "${requestId}"
})`);
const validAuthData = inBridgeRealm(`({
  isLogin: true,
  uname: "Yuki765",
  face: "//i0.hdslb.com/bfs/face/profile.webp",
  level_info: { current_level: 6, current_min: 0, current_exp: 43076, next_exp: "--" },
  money: 906.4,
  vipStatus: 1,
  wallet: { bcoin_balance: 12.5 },
  email_verified: 1,
  mobile_verified: false,
  token: "must-not-leak",
  mid: 123456,
  unconsumed_nav_field: { ignored: true }
})`);
const runNextTimer = () => {
  const next = timers.entries().next().value;
  assert.ok(next, "expected a pending bridge deadline");
  const [id, timer] = next;
  timers.delete(id);
  assert.equal(timer.delay, api.REQUEST_TIMEOUT_MS);
  timer.callback();
};
const assertFixedOptions = (entry, signal) => {
  assert.equal(entry.options.method, "GET");
  assert.equal(entry.options.credentials, "include");
  assert.equal(entry.options.cache, "no-store");
  assert.equal(entry.options.redirect, "error");
  assert.equal(entry.options.signal, signal);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.options, "body"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.options, "headers"), false);
};
const assertPublicOptions = (entry, signal) => {
  assert.equal(entry.options.method, "GET");
  assert.equal(entry.options.credentials, "omit");
  assert.equal(entry.options.cache, "no-store");
  assert.equal(entry.options.redirect, "error");
  assert.equal(entry.options.signal, signal);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.options, "body"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry.options, "headers"), false);
};

assert.deepEqual([...api.OPERATIONS], [
  "AUTH_STATUS",
  "SHOW_LOGIN",
  "LOGOUT",
  "PROFILE_STATS",
  "MESSAGE_SUMMARY",
  "DYNAMIC_SUMMARY",
  "FAVORITE_SUMMARY",
  "HISTORY_SUMMARY",
  "LIVE_HOVER",
  "PRIMARY_MENU_COUNTS",
  "BANNER_CURRENT",
  "RECOMMENDATION_FEED",
  "DOUGA_FLOOR",
  "ORDINARY_ZONE_FLOOR",
  "READ_FLOOR",
  "LIVE_FLOOR_INITIAL",
  "LIVE_FLOOR_MORE",
  "LIVE_FLOOR_FOLLOWING",
  "WATCH_LATER_MUTATE"
]);
assert.equal(
  api.MINI_LOGIN_SCRIPT_URL,
  "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/miniLogin.umd.min.js"
);
assert.match(bridgeSource, /new global\.MiniLogin\(\{/);
assert.match(bridgeSource, /miniLoginInstance\.showComponent\(\{/);
assert.match(contentSource, /onLoginRequest: \(event\) => openOfficialLogin\(currentLifecycle, event\)/);
assert.match(rendererSource, /typeof onLoginRequest === "function"/);
assert.match(contentSource, /:not\(\.bili-mini-mask\)/);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.LOGOUT, api.fixedUrl), [
  "https://passport.bilibili.com/login/exit/v2"
]);
assert.equal(api.OPERATION_ROUTES.LOGOUT[0].method, "POST");
assert.deepEqual(Array.from(api.OPERATION_ROUTES.MESSAGE_SUMMARY, api.fixedUrl), [
  "https://api.vc.bilibili.com/x/im/web/msgfeed/unread?build=0&mobi_app=web&web_location=333.40138",
  "https://api.vc.bilibili.com/session_svr/v1/session_svr/single_unread?unread_type=0&build=0&mobi_app=web&web_location=333.40138"
]);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.PROFILE_STATS, api.fixedUrl), [
  "https://api.bilibili.com/x/web-interface/nav/stat"
]);
assert.deepEqual(Array.from(api.MESSAGE_SUMMARY_EXCLUDED_ROUTES), [
  "https://api.vc.bilibili.com/link_setting/v1/link_setting/get"
]);
assert.equal(api.OPERATION_ROUTES.MESSAGE_SUMMARY.some((route) => api.fixedUrl(route).includes("/link_setting/")), false);
assert.doesNotMatch(bridgeSource, /isBoundedRecord/);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.FAVORITE_SUMMARY, api.fixedUrl), [
  "https://api.bilibili.com/x/v3/fav/folder/list4navigate",
  "https://api.bilibili.com/x/v2/history/toview/web"
]);
assert.equal(api.fixedUrl(api.FAVORITE_DETAIL_ROUTE), "https://api.bilibili.com/x/v3/fav/resource/list4navigate");
assert.deepEqual(Array.from(api.OPERATION_ROUTES.HISTORY_SUMMARY, api.fixedUrl), [
  "https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=archive&web_location=333.40138",
  "https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=live&web_location=333.40138",
  "https://api.bilibili.com/x/web-interface/history/cursor?ps=20&type=article&web_location=333.40138"
]);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.LIVE_HOVER, api.fixedUrl), [
  "https://api.live.bilibili.com/xlive/web-interface/v1/index/RoomForWebMainHover"
]);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.PRIMARY_MENU_COUNTS, api.fixedUrl), [
  "https://api.bilibili.com/x/web-interface/online"
]);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.RECOMMENDATION_FEED, api.fixedUrl), [
  "https://api.bilibili.com/x/web-interface/wbi/index/top/rcmd"
]);
assert.deepEqual(Array.from(api.OPERATION_ROUTES.WATCH_LATER_MUTATE, api.fixedUrl), [
  "https://api.bilibili.com/x/v2/history/toview/add",
  "https://api.bilibili.com/x/v2/history/toview/del"
]);
for (const routes of Object.values(api.OPERATION_ROUTES)) {
  if (!Array.isArray(routes)) continue;
  for (const route of routes) assert.deepEqual(Object.keys(route).sort(), ["host", "method", "path"]);
}

const projectedAuth = api.projectAuth(inBridgeRealm(`({ code: 0, message: "ok", ttl: 1, data: ${JSON.stringify(validAuthData)} })`));
assert.equal(projectedAuth.status, "logged_in");
assert.deepEqual(toLocal(projectedAuth.profile), {
  face: "https://i0.hdslb.com/bfs/face/profile.webp",
  uname: "Yuki765",
  level: 6,
  currentExp: 43076,
  nextExp: null,
  coins: 906.4,
  vipStatus: 1,
  bcoin: 12.5,
  emailVerified: true,
  mobileVerified: false,
  followingUrl: "https://space.bilibili.com/123456/fans/follow",
  followerUrl: "https://space.bilibili.com/123456/fans/fans",
  dynamicUrl: "https://space.bilibili.com/123456/dynamic",
  favoriteUrl: "https://space.bilibili.com/123456/favlist"
});
assert.deepEqual(Object.keys(projectedAuth.profile).sort(), [
  "bcoin", "coins", "currentExp", "dynamicUrl", "emailVerified", "face", "favoriteUrl", "followerUrl", "followingUrl", "level", "mobileVerified", "nextExp", "uname", "vipStatus"
]);
assert.equal(Object.prototype.hasOwnProperty.call(projectedAuth.profile, "token"), false);
assert.equal(Object.prototype.hasOwnProperty.call(projectedAuth.profile, "mid"), false);
assert.equal(Object.prototype.hasOwnProperty.call(projectedAuth.profile, "cookie"), false);
for (const [key, suffix] of [["followingUrl", "fans/follow"], ["followerUrl", "fans/fans"], ["dynamicUrl", "dynamic"], ["favoriteUrl", "favlist"]]) {
  assert.match(projectedAuth.profile[key], new RegExp(`^https://space\\.bilibili\\.com/[1-9]\\d*/${suffix}$`));
}
for (const invalidMid of [0, -1, NaN, Infinity, "0", "00123", "not-digits", "9007199254740992"]) {
  const invalidData = { ...toLocal(validAuthData), mid: invalidMid };
  assert.equal(api.projectAuth(inBridgeRealm(`({ code: 0, message: "ok", ttl: 1, data: ${JSON.stringify(invalidData)} })`)).status, "unknown");
}
assert.equal(api.projectAuth(inBridgeRealm(`({ code: 0, message: "ok", ttl: 1, data: ${JSON.stringify({ ...toLocal(validAuthData), mid: "123456" })} })`)).status, "logged_in");
assert.equal(api.isAuthEnvelope(inBridgeRealm("({ code: 0, data: { isLogin: false }, upstream_extra: true })")), true);
for (const loggedOutEnvelope of [
  "({ code: 0, data: { isLogin: false } })",
  "({ code: 0, msg: 'not-required', data: { isLogin: false, extra: null }, upstream_extra: true })",
  "({ code: -101, data: { isLogin: false, extra: { ignored: true } }, upstream_extra: true })"
]) {
  assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm(loggedOutEnvelope))), { status: "logged_out", profile: null });
}
for (const invalidAuthEnvelope of [
  "({ code: 0 })",
  "({ code: 0, data: {} })",
  "({ code: 0, data: { isLogin: 'false' } })",
  "({ code: '0', data: { isLogin: false } })",
  "({ code: -102, data: { isLogin: false } })",
  "({ code: -101, data: { isLogin: true } })",
  "({ code: 1, data: { isLogin: true } })"
]) {
  assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm(invalidAuthEnvelope))), { status: "unknown", profile: null });
}
assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm(`({ code: 0, upstream_extra: true, data: ${JSON.stringify({ ...toLocal(validAuthData), unconsumed: { ignored: true } })} })`)).profile), toLocal(projectedAuth.profile));
const projectedLogout = api.projectLogout(inBridgeRealm("({ code: 0, data: { ignored: true }, upstream_extra: 'ignored' })"));
assert.deepEqual(toLocal(projectedLogout), { status: "logged_out" });
assert.deepEqual(Object.keys(projectedLogout), ["status"]);
for (const invalidLogout of [
  "({ data: { ignored: true } })",
  "({ code: 1, data: { ignored: true } })",
  "({ code: '0', data: { ignored: true } })"
]) assert.throws(() => api.projectLogout(inBridgeRealm(invalidLogout)), /schema/);
assert.match(contentSource, /dynamicUrl/);
assert.match(contentSource, /followingUrl/);
assert.match(contentSource, /followerUrl/);
assert.doesNotMatch(contentSource, /profile\.mid|profile\["mid"\]/);
const contentWithoutApprovedLiveSessionMarker = contentSource
  .replace(/window\.sessionStorage\.getItem\(LIVE_FLOOR_SESSION_KEY\)/g, "")
  .replace(/window\.sessionStorage\.setItem\(LIVE_FLOOR_SESSION_KEY, "1"\)/g, "");
assert.doesNotMatch(contentWithoutApprovedLiveSessionMarker, /document\.cookie|localStorage|sessionStorage|csrf/i);
const authProfileValidatorStart = contentSource.indexOf("  const bridgeOwnKeys =");
const authProfileValidatorEnd = contentSource.indexOf("  const isLiveCanonicalLink =", authProfileValidatorStart);
assert.ok(authProfileValidatorStart >= 0 && authProfileValidatorEnd > authProfileValidatorStart, "auth profile validator source boundary");
const authProfileHarness = vm.runInNewContext(
  `(() => { ${contentSource.slice(authProfileValidatorStart, authProfileValidatorEnd)}; return {
    validate: isBridgeAuthProfile,
    toRealm: (value) => JSON.parse(JSON.stringify(value))
  }; })()`,
  { URL }
);
const authProfileValidator = authProfileHarness.validate;
const validBridgeProfile = {
  face: "https://i0.hdslb.com/bfs/face/profile.webp",
  uname: "fixture-user",
  level: 1,
  currentExp: 2,
  nextExp: null,
  coins: 3,
  vipStatus: 0,
  bcoin: null,
  emailVerified: false,
  mobileVerified: false,
  followingUrl: "https://space.bilibili.com/7/fans/follow",
  followerUrl: "https://space.bilibili.com/7/fans/fans",
  dynamicUrl: "https://space.bilibili.com/7/dynamic",
  favoriteUrl: "https://space.bilibili.com/7/favlist"
};
const toValidatorRealm = authProfileHarness.toRealm;
assert.equal(authProfileValidator(toValidatorRealm(validBridgeProfile)), true);
for (const key of ["followingUrl", "followerUrl", "dynamicUrl", "favoriteUrl"]) {
  const invalidProfile = { ...validBridgeProfile, [key]: "https://evil.example/7/dynamic" };
  assert.equal(authProfileValidator(toValidatorRealm(invalidProfile)), false, `${key} rejects non-canonical URL`);
}
assert.equal(authProfileValidator(toValidatorRealm({ ...validBridgeProfile, dynamicUrl: "https://space.bilibili.com/7/dynamic?token=secret" })), false);
const profileStatsDataSource = "{ following: 1, follower: 2, dynamic_count: 3 }";
for (const envelope of [
  `({ code: 0, data: ${profileStatsDataSource}, msg: 'ok' })`,
  `({ code: 0, data: ${profileStatsDataSource} })`,
  `({ code: 0, data: ${profileStatsDataSource}, message: 'ok', ttl: 0 })`,
  `({ code: 0, data: ${profileStatsDataSource}, message: 'ok', msg: 'ok', ttl: 86400 })`,
  "({ code: 0, data: { following: 1, follower: 2, dynamic_count: 3, fans_effect: null } })",
  "({ code: 0, data: { following: 1, follower: 2, dynamic_count: 3, upstream_unused: { ignored: true } } })"
]) {
  const projection = api.projectProfileStats(inBridgeRealm(envelope));
  assert.deepEqual(toLocal(projection), { following: 1, follower: 2, dynamic_count: 3 });
  assert.deepEqual(Object.keys(projection).sort(), ["dynamic_count", "follower", "following"]);
  assert.equal(Object.prototype.hasOwnProperty.call(projection, "message"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(projection, "msg"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(projection, "ttl"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(projection, "fans_effect"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(projection, "upstream_unused"), false);
}
for (const envelope of [
  `({ data: ${profileStatsDataSource} })`,
  `({ code: 1, data: ${profileStatsDataSource} })`,
  `({ code: 0, data: ${profileStatsDataSource}, secret: 'blocked' })`,
  `({ code: 0, data: ${profileStatsDataSource}, message: 'bad\\u0000value' })`,
  `({ code: 0, data: ${profileStatsDataSource}, msg: 'bad\\nvalue' })`,
  `({ code: 0, data: ${profileStatsDataSource}, ttl: -1 })`,
  `({ code: 0, data: ${profileStatsDataSource}, ttl: 86401 })`,
  `({ code: 0, data: ${profileStatsDataSource}, ttl: '1' })`,
  "({ code: 0, data: { following: 1, follower: 2 } })"
]) assert.throws(() => api.projectProfileStats(inBridgeRealm(envelope)), /schema/);
assert.throws(() => api.projectProfileStats(inBridgeRealm("({ code: 0, data: { following: -1, follower: 2, dynamic_count: 3 }, message: 'ok', ttl: 1 })")), /schema/);
assert.throws(() => api.projectProfileStats(inBridgeRealm("({ code: 0, data: { following: 1, follower: 2, dynamic_count: '3' }, message: 'ok', ttl: 1 })")), /schema/);
assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm(`({ code: 0, message: "ok", ttl: 1, data: ${JSON.stringify({ ...toLocal(validAuthData), wallet: null, email_verified: false, mobile_verified: 0 })} })`)).profile), {
  face: "https://i0.hdslb.com/bfs/face/profile.webp",
  uname: "Yuki765",
  level: 6,
  currentExp: 43076,
  nextExp: null,
  coins: 906.4,
  vipStatus: 1,
  bcoin: null,
  emailVerified: false,
  mobileVerified: false,
  followingUrl: "https://space.bilibili.com/123456/fans/follow",
  followerUrl: "https://space.bilibili.com/123456/fans/fans",
  dynamicUrl: "https://space.bilibili.com/123456/dynamic",
  favoriteUrl: "https://space.bilibili.com/123456/favlist"
});
for (const field of ["email_verified", "mobile_verified"]) {
  const invalidData = { ...toLocal(validAuthData), [field]: "1" };
  assert.equal(api.projectAuth(inBridgeRealm(`({ code: 0, message: "ok", ttl: 1, data: ${JSON.stringify(invalidData)} })`)).status, "unknown");
}
assert.equal(api.isAuthAvatarUrl(inBridgeRealm("\"//i3.hdslb.com/bfs/face/profile.webp\"")), true);
for (const hostileProfileFace of [
  "https://evil.example/bfs/face/profile.webp",
  "http://i0.hdslb.com/bfs/face/profile.webp",
  "https://i0.hdslb.com/bfs/face/profile.webp?token=secret",
  "https://i0.hdslb.com/bfs/other/profile.webp"
]) assert.equal(api.isAuthAvatarUrl(inBridgeRealm(JSON.stringify(hostileProfileFace))), false, hostileProfileFace);
assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm("({ code: 0, message: 'ok', ttl: 1, data: { isLogin: false, cookie: 'secret' } })"))), { status: "logged_out", profile: null });
assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm("({ code: 0, message: 'ok', ttl: 1, data: { token: 'secret' } })"))), { status: "unknown", profile: null });
assert.deepEqual(toLocal(api.projectAuth(inBridgeRealm("({ code: 0, data: { isLogin: true } })"))), { status: "unknown", profile: null });

const validLivePayload = inBridgeRealm(`({
  code: 0,
  message: "ok",
  ttl: 1,
  data: {
    top_banner: [],
    bottom_banner: [],
    room_list: [{
      ad_transparent_content: null,
      area_v2_id: 1,
      area_v2_name: "测试分区",
      area_v2_parent_id: 2,
      area_v2_parent_name: "测试父分区",
      broadcast_type: 0,
      click_callback: "",
      cover: "https://i0.hdslb.com/bfs/live/cover.webp",
      cover_source: 0,
      face: "https://i1.hdslb.com/bfs/live/face.webp",
      flag: 0,
      followers: 12,
      group_id: 3,
      head_box: null,
      head_box_type: 0,
      is_ad: false,
      is_ai: false,
      is_auto_play: 0,
      is_nft: 0,
      keyframe: "",
      link: "/12345?ho=0&trackid=fixture",
      live_key: "",
      nft_dmark: "",
      online: 42,
      pendant_Info: {},
      roomid: 12345,
      session_id: "",
      show_ad_icon: false,
      show_callback: "",
      special_id: 0,
      status: true,
      sub_session_key: "",
      title: "直播标题",
      trackid: "",
      uid: 67890,
      uname: "主播",
      verify: { role: 0, desc: "", type: -1 },
      watched_show: {
        switch: false,
        num: 0,
        text_small: "",
        text_large: "",
        icon: "",
        icon_location: 0,
        icon_web: ""
      }
    }]
  }
})`);
context.validLivePayload = validLivePayload;
const validLiveProjection = api.projectLiveHover(validLivePayload);
assert.deepEqual(toLocal(validLiveProjection), {
  items: [{
    face: "https://i1.hdslb.com/bfs/live/face.webp",
    link: "https://live.bilibili.com/12345",
    title: "直播标题",
    uname: "主播",
    uid: 67890,
    online: 42
  }]
});
assert.deepEqual(Object.keys(validLiveProjection.items[0]).sort(), ["face", "link", "online", "title", "uid", "uname"]);
const queryTokenLivePayload = inBridgeRealm("({ ...validLivePayload, data: { ...validLivePayload.data, room_list: [{ ...validLivePayload.data.room_list[0], link: '/12345?token=secret&next=https%3A%2F%2Fevil.example' }] } })");
const queryTokenLiveProjection = api.projectLiveHover(queryTokenLivePayload);
assert.equal(queryTokenLiveProjection.items[0].link, "https://live.bilibili.com/12345");
assert.doesNotMatch(queryTokenLiveProjection.items[0].link, /token|evil\.example|[?&#]/);
const largeUid = 3550000000000000;
const largeUidPayload = inBridgeRealm("({ ...validLivePayload, data: { ...validLivePayload.data, room_list: [{ ...validLivePayload.data.room_list[0], uid: 3550000000000000 }] } })");
const largeUidProjection = api.projectLiveHover(largeUidPayload);
assert.equal(Number.isSafeInteger(largeUidProjection.items[0].uid), true);
assert.equal(largeUidProjection.items[0].uid, largeUid);
assert.equal(api.normalizeLiveAssetUrl("http://i0.hdslb.com/bfs/live/http-face.webp"), "https://i0.hdslb.com/bfs/live/http-face.webp");
assert.equal(api.isLiveAssetUrl("http://i1.hdslb.com/bfs/live/http-face.webp"), true);
const httpLivePayload = inBridgeRealm("({ ...validLivePayload, data: { ...validLivePayload.data, room_list: [{ ...validLivePayload.data.room_list[0], face: 'http://i2.hdslb.com/bfs/live/http-face.webp', cover: 'http://i3.hdslb.com/bfs/live/http-cover.webp', pendant_Info: { '1': { bg_pic: 'http://evil.example/not-consumed.webp' } } }] } })");
const httpLiveProjection = api.projectLiveHover(httpLivePayload);
assert.equal(httpLiveProjection.items[0].face, "https://i2.hdslb.com/bfs/live/http-face.webp");
assert.equal(summaryValidatorHarness.isBridgeSummaryData("LIVE_HOVER", summaryValidatorHarness.makeLiveSummary(httpLiveProjection.items[0])), true,
  "normalized live output passes content validator");
for (const hostile of [
  "https://evil.example/bfs/face.webp",
  "ftp://i0.hdslb.com/bfs/face.webp",
  "https://i0.hdslb.com/not-bfs/face.webp?token=secret",
  "https://i0.hdslb.com/bfs/face.webp?token=secret",
  "https://user:pass@i0.hdslb.com/bfs/face.webp",
  "https://i0.hdslb.com:443/bfs/face.webp",
  "https://i0.hdslb.com/bfs/face.webp#fragment"
]) {
  assert.equal(api.isLiveAssetUrl(hostile), false);
}
assert.equal(api.isLiveSourceLink("/12345?token=secret&next=https%3A%2F%2Fevil.example", 12345), true);
for (const hostile of [
  "",
  "12345",
  "https://live.bilibili.com/12345",
  "http://live.bilibili.com/12345",
  "//live.bilibili.com/12345",
  "//evil.example/12345",
  "///12345",
  "/\\evil.example/12345",
  "/%2F%2Fevil.example/12345",
  "/12345/extra",
  "/12345#fragment",
  "/12345?x=1#fragment",
  "/+12345",
  "/12.3",
  "/１２３４５",
  "/12345%2F",
  "/999",
  "/12345\u0000"
]) {
  assert.equal(api.isLiveSourceLink(hostile, 12345), false, `hostile link accepted: ${JSON.stringify(hostile)}`);
}
assert.equal(api.isLiveSourceLink("/999", 123), false);
const badLiveRoom = inBridgeRealm("({ ...validLivePayload.data.room_list[0], face: 'https://evil.example/bfs/bad.webp' })");
const goodHttpLiveRoom = inBridgeRealm("({ ...validLivePayload.data.room_list[0], face: 'http://i3.hdslb.com/bfs/live/good-http.webp' })");
const mixedLiveProjection = api.projectLiveHover(inBridgeRealm(`({
  ...validLivePayload,
  extra: true,
  data: { ...validLivePayload.data, top_banner: [{ ignored: true }], room_list: [${JSON.stringify(badLiveRoom)}, ${JSON.stringify(goodHttpLiveRoom)}] }
})`));
assert.deepEqual(toLocal(mixedLiveProjection.items), [{
  face: "https://i3.hdslb.com/bfs/live/good-http.webp",
  link: "https://live.bilibili.com/12345",
  title: "直播标题",
  uname: "主播",
  uid: 67890,
  online: 42
}], "bad room is skipped and good room is retained");
const allBadLiveProjection = api.projectLiveHover(inBridgeRealm(`({
  ...validLivePayload,
  data: { ...validLivePayload.data, room_list: [${JSON.stringify(badLiveRoom)}, { ...${JSON.stringify(validLivePayload.data.room_list[0])}, face: 'https://i0.hdslb.com/not-bfs/bad.webp' }] }
})`));
assert.deepEqual(toLocal(allBadLiveProjection), { items: [] }, "all invalid rooms produce an empty list");
const duplicateLiveProjection = api.projectLiveHover(inBridgeRealm(`({
  ...validLivePayload,
  data: { ...validLivePayload.data, room_list: [${JSON.stringify(goodHttpLiveRoom)}, ${JSON.stringify(goodHttpLiveRoom)}] }
})`));
assert.equal(duplicateLiveProjection.items.length, 1, "duplicate room is skipped");
for (const invalidLink of [
  "",
  "12345",
  "https://live.bilibili.com/12345",
  "http://live.bilibili.com/12345",
  "//live.bilibili.com/12345",
  "//evil.example/12345",
  "///12345",
  "/\\evil.example/12345",
  "/%2F%2Fevil.example/12345",
  "/12345/extra",
  "/12345#fragment",
  "/12345?x=1#fragment",
  "/+12345",
  "/12.3",
  "/１２３４５",
  "/12345%2F",
  "/999",
  "/12345\\u0000"
]) {
  const projection = api.projectLiveHover(inBridgeRealm(`({ ...validLivePayload, data: { ...validLivePayload.data, room_list: [{ ...validLivePayload.data.room_list[0], link: ${JSON.stringify(invalidLink)} }] } })`));
  assert.deepEqual(toLocal(projection), { items: [] }, `invalid room link is skipped: ${JSON.stringify(invalidLink)}`);
}
assert.throws(() => api.projectLiveHover(inBridgeRealm("({ ...validLivePayload, data: { ...validLivePayload.data, room_list: 'invalid' } })")), /schema/);

const validMessage = api.projectMessage(
  inBridgeRealm("({ code: 0, data: { at: 0, like: 2, reply: 1, sys_msg: 0, chat: 0, upstream_extra: true } })"),
  inBridgeRealm("({ code: 0, message: 'ok', msg: 'ok', data: { biz_msg_follow_unread: 0, biz_msg_unfollow_unread: 0, custom_unread: 1, dustbin_push_msg: 0, dustbin_unread: 0, follow_unread: 0, unfollow_push_msg: 0, unfollow_unread: 0 }, ttl: 1 })")
);
assert.deepEqual(toLocal(validMessage), { reply: 1, at: 0, like: 2, sysMsg: 0, sessionUnread: 1 });
assert.deepEqual(Object.keys(validMessage).sort(), ["at", "like", "reply", "sessionUnread", "sysMsg"]);
const favoriteFolderRaw = inBridgeRealm(`({ code: 0, upstream_extra: true, data: [
  { id: 7001, name: "收藏夹分类", uri: "ignored://category", mediaListResponse: { count: 39, has_more: true, list: [
    { id: 7, title: "我创建的收藏夹", media_count: 39, attr: 1, upstream_extra: true },
    { id: 8, title: "默认收藏夹", media_count: 16, attr: 0, upstream_extra: true },
    { id: 9, title: "收藏夹三", media_count: 20, attr: 1, upstream_extra: true },
    { id: 10, title: "收藏夹四", media_count: 20, attr: 1, upstream_extra: true }
  ], upstream_extra: true } },
  { id: 7002, name: "稍后再看分类", uri: "ignored://later", mediaListResponse: { count: 1, has_more: false, list: null, upstream_extra: true } }
] })`);
const favoriteLaterRaw = inBridgeRealm(`({ code: 0, data: { count: 1, list: [{
  title: "稍后项目", pic: "https://i0.hdslb.com/bfs/archive/later.webp", owner: { name: "作者" },
  duration: 62, aid: 1, bvid: "BV1234567890", upstream_extra: true
}], upstream_extra: true } })`);
const favoriteDetailRaw = inBridgeRealm(`({ code: 0, data: [{
  title: "收藏项目", cover: "http://i1.hdslb.com/bfs/archive/favorite.webp?source=live", upper: { name: "作者" },
  duration: 65, id: 2, bvid: "BVABCDEFGHIJ", type: 2, upstream_extra: true
}], upstream_extra: true })`);
const projectedFavorite = api.projectFavorite(favoriteFolderRaw, favoriteLaterRaw, [favoriteDetailRaw, favoriteDetailRaw, favoriteDetailRaw, favoriteDetailRaw]);
assert.deepEqual(toLocal(projectedFavorite), {
  tabs: [
    {
      key: "8", title: "默认收藏夹", count: 16,
      viewAllHref: "https://space.bilibili.com/", playAllHref: "https://www.bilibili.com/medialist/play/ml8",
       items: [{ title: "收藏项目", cover: "https://i1.hdslb.com/bfs/archive/favorite.webp?source=live", owner: "作者", duration: 65, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }]
    },
    {
      key: "LATER_VIEW", title: "稍后再看", count: 1,
      viewAllHref: "https://www.bilibili.com/watchlater/#/list",
      playAllHref: "https://www.bilibili.com/medialist/play/watchlater",
       items: [{ title: "稍后项目", cover: "https://i0.hdslb.com/bfs/archive/later.webp", owner: "作者", duration: 62, href: "https://www.bilibili.com/video/BV1234567890" }]
    },
    {
      key: "7", title: "我创建的收藏夹", count: 39,
       viewAllHref: "https://space.bilibili.com/", playAllHref: "https://www.bilibili.com/medialist/play/ml7",
       items: [{ title: "收藏项目", cover: "https://i1.hdslb.com/bfs/archive/favorite.webp?source=live", owner: "作者", duration: 65, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }]
    },
    {
      key: "9", title: "收藏夹三", count: 20,
       viewAllHref: "https://space.bilibili.com/", playAllHref: "https://www.bilibili.com/medialist/play/ml9",
       items: [{ title: "收藏项目", cover: "https://i1.hdslb.com/bfs/archive/favorite.webp?source=live", owner: "作者", duration: 65, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }]
    },
    {
      key: "10", title: "收藏夹四", count: 20,
       viewAllHref: "https://space.bilibili.com/", playAllHref: "https://www.bilibili.com/medialist/play/ml10",
       items: [{ title: "收藏项目", cover: "https://i1.hdslb.com/bfs/archive/favorite.webp?source=live", owner: "作者", duration: 65, href: "https://www.bilibili.com/video/BVABCDEFGHIJ" }]
    }
  ],
  allHref: "https://space.bilibili.com/"
});
const emptyFavoriteDetail = inBridgeRealm("({ code: 0, data: [], message: 'ok', ttl: 1, upstream_extra: true })");
const countWithoutItems = api.projectFavorite(
  favoriteFolderRaw,
  null,
  [emptyFavoriteDetail, emptyFavoriteDetail, emptyFavoriteDetail, emptyFavoriteDetail]
);
assert.equal(countWithoutItems.tabs[2].count, 39, "navigation count remains committed when detail list is empty");
assert.deepEqual(toLocal(countWithoutItems.tabs[2].items), [], "empty detail response projects to empty items only");
assert.deepEqual(Object.keys(projectedFavorite), ["tabs", "allHref"]);
assert.equal(JSON.stringify(projectedFavorite).includes("attr"), false, "folder attr never enters output");
assert.equal(JSON.stringify(projectedFavorite).includes("media_count"), false, "raw folder fields never enter output");
assert.equal(projectedFavorite.tabs[0].playAllHref, "https://www.bilibili.com/medialist/play/ml8");
const ordinaryOwnerFallback = api.projectFavorite(
  favoriteFolderRaw,
  favoriteLaterRaw,
  [
    inBridgeRealm("({ code: 0, data: [{ title: '缺失作者', cover: 'http://i1.hdslb.com/bfs/archive/fallback.webp', bvid: 'BVABCDEFGHIJ', upper: null, extra: true }] })"),
    inBridgeRealm("({ code: 0, data: [{ title: '空作者', cover: 'http://i1.hdslb.com/bfs/archive/fallback.webp', bvid: 'BVABCDEFGHIJ', upper: { name: null }, extra: true }] })"),
    inBridgeRealm("({ code: 0, data: [{ title: '错类型作者', cover: 'http://i1.hdslb.com/bfs/archive/fallback.webp', bvid: 'BVABCDEFGHIJ', upper: '作者', extra: true }] })"),
    inBridgeRealm("({ code: 0, data: [{ title: '正常作者', cover: 'http://i1.hdslb.com/bfs/archive/fallback.webp', bvid: 'BVABCDEFGHIJ', upper: { name: '作者', extra: true }, extra: true }] })")
  ]
);
assert.deepEqual([ordinaryOwnerFallback.tabs[0], ordinaryOwnerFallback.tabs[2], ordinaryOwnerFallback.tabs[3], ordinaryOwnerFallback.tabs[4]]
  .map((tab) => tab.items[0].owner), ["", "", "", "作者"]);
const laterOwnerFallback = api.projectFavorite(
  favoriteFolderRaw,
  inBridgeRealm(`({ code: 0, data: { count: 1, list: [
    { title: '稍后缺失作者', pic: 'http://i0.hdslb.com/bfs/archive/later.webp', bvid: 'BV1234567890', extra: true },
    { title: '稍后空作者', pic: 'http://i0.hdslb.com/bfs/archive/later.webp', bvid: 'BV1234567890', owner: null, extra: true },
    { title: '稍后正常作者', pic: 'http://i0.hdslb.com/bfs/archive/later.webp', bvid: 'BV1234567890', owner: { name: '作者', extra: true }, extra: true }
  ]} })`),
  [favoriteDetailRaw, favoriteDetailRaw, favoriteDetailRaw, favoriteDetailRaw]
);
assert.deepEqual(toLocal(laterOwnerFallback.tabs[1].items.map((item) => item.owner)), ["", "", "作者"]);
const capFolderEntries = [
  { id: 100, title: "服务端首位", media_count: 20, attr: 1 },
  { id: 0, title: "非法ID", media_count: 20, attr: 1 },
  { id: 100, title: "重复ID", media_count: 20, attr: 1 },
  { id: 200, title: "默认夹", media_count: 20, attr: 0 },
  ...Array.from({ length: 20 }, (_, index) => ({
    id: 201 + index,
    title: `剩余夹${index}`,
    media_count: 20,
    attr: 1
  }))
];
const capFolderRaw = inBridgeRealm(`(${JSON.stringify({
  code: 0,
  data: [
    { mediaListResponse: { count: capFolderEntries.length, list: capFolderEntries } },
    { mediaListResponse: { count: 10, list: null } }
  ],
  upstream_extra: true
})})`);
const capDetailRaw = inBridgeRealm(`(${JSON.stringify({
  code: 0,
  data: Array.from({ length: 21 }, (_, index) => ({
    title: `视频${index}`,
    cover: "http://i1.hdslb.com/bfs/archive/cap.webp",
    duration: 60,
    bvid: "BVABCDEFGHIJ",
    upstream_extra: true
  })),
  upstream_extra: true
})})`);
const capLaterRaw = inBridgeRealm(`(${JSON.stringify({
  code: 0,
  data: {
    count: 21,
    list: Array.from({ length: 21 }, () => ({
      title: "稍后视频",
      pic: "http://i0.hdslb.com/bfs/archive/later-cap.webp",
      duration: 60,
      bvid: "BVABCDEFGHIJ",
      upstream_extra: true
    }))
  },
  upstream_extra: true
})})`);
const cappedFavorite = api.projectFavorite(
  capFolderRaw,
  capLaterRaw,
  Array.from({ length: 19 }, () => capDetailRaw)
);
assert.equal(cappedFavorite.tabs.length, 20, "favorite output caps at 20 tabs");
assert.deepEqual(toLocal(cappedFavorite.tabs.slice(0, 4).map((tab) => tab.key)), ["200", "LATER_VIEW", "100", "201"],
  "default is promoted, later is second, remaining folders keep service order");
assert.equal(cappedFavorite.tabs.every((tab) => tab.items.length === 20), true, "every favorite tab caps at 20 items");
assert.equal(cappedFavorite.tabs[2].items[19].title, "视频19");
assert.equal(cappedFavorite.tabs[2].items.some((item) => item.title === "视频20"), false);
assert.equal(JSON.stringify(cappedFavorite).includes('"id":'), false, "folder IDs are not emitted as fields");
assert.equal(JSON.stringify(cappedFavorite).includes('"attr":'), false, "folder attrs are not emitted as fields");
assert.equal(JSON.stringify(cappedFavorite).includes("upstream_extra"), false, "upstream fields are not emitted");
assert.equal(api.normalizeVideoCover("http://i0.hdslb.com/bfs/archive/cover.webp"), "https://i0.hdslb.com/bfs/archive/cover.webp");
for (const hostileCover of [
  "http://evil.example/bfs/archive/cover.webp",
  "https://evil.example/bfs/archive/cover.webp",
  "http://i0.hdslb.com/not-bfs/cover.webp",
  "https://user:pass@i0.hdslb.com/bfs/archive/cover.webp",
  "https://i0.hdslb.com:443/bfs/archive/cover.webp",
  "https://i0.hdslb.com/bfs/archive/cover.webp#fragment"
]) assert.equal(api.normalizeVideoCover(hostileCover), null, hostileCover);
const historyArchiveRaw = inBridgeRealm(`({ code: 0, data: { list: [{
  title: "历史项目", cover: "http://i2.hdslb.com/bfs/archive/history.webp", author_name: "作者",
  progress: 10, duration: 90, view_at: 123, history: { bvid: "BVKLMNOPQRST", oid: 3 }, upstream_extra: true
}], cursor: { ignored: true }, upstream_extra: true } })`);
const historyEmptyRaw = inBridgeRealm("({ code: 0, data: { list: [], cursor: { ignored: true }, upstream_extra: true } })");
const projectedHistory = api.projectHistory([historyArchiveRaw, historyEmptyRaw, historyEmptyRaw]);
assert.deepEqual(toLocal(projectedHistory), {
  archive: [{ title: "历史项目", cover: "https://i2.hdslb.com/bfs/archive/history.webp", author: "作者", progress: 10, duration: 90, viewAt: 123, href: "https://www.bilibili.com/video/BVKLMNOPQRST" }],
  live: [],
  article: []
});
const makeHistoryCapRaw = (type) => inBridgeRealm(`(${JSON.stringify({
  code: 0,
  upstream_extra: true,
  data: {
    upstream_extra: true,
    list: Array.from({ length: 21 }, (_, index) => ({
      title: `${type}-${index}`,
      cover: "http://i3.hdslb.com/bfs/archive/history-cap.webp",
      author_name: "作者",
      progress: index,
      duration: 120,
      view_at: index,
      history: { oid: index + 1 },
      upstream_extra: true
    }))
  }
})})`);
const cappedHistory = api.projectHistory([
  makeHistoryCapRaw("archive"),
  makeHistoryCapRaw("live"),
  makeHistoryCapRaw("article")
]);
for (const key of ["archive", "live", "article"]) {
  assert.equal(cappedHistory[key].length, 20, `${key} history cap`);
  assert.equal(cappedHistory[key][19].title, `${key}-19`);
  assert.equal(cappedHistory[key].some((item) => item.title === `${key}-20`), false);
  assert.equal(cappedHistory[key].every((item) => item.cover === "https://i3.hdslb.com/bfs/archive/history-cap.webp"), true);
}
for (const invalid of [
  () => api.projectMessage(
    inBridgeRealm("({ code: 0, data: { at: 0, like: 2, reply: 1, secret: 1 } })"),
    inBridgeRealm("({ code: 0, message: 'ok', msg: 'ok', data: { biz_msg_follow_unread: 0, biz_msg_unfollow_unread: 0, custom_unread: 0, dustbin_push_msg: 0, dustbin_unread: 0, follow_unread: 0, unfollow_push_msg: 0, unfollow_unread: 0 }, ttl: 1 })")
  ),
  () => api.projectMessage(
    inBridgeRealm("({ code: 0, data: { at: 0, coin: 0, danmu: 0, favorite: 0, like: 0, recv_like: 0, recv_reply: 0, reply: '1', sys_msg: 0, sys_msg_style: 0, up: 0 } })"),
    inBridgeRealm("({ code: 0, data: { biz_msg_follow_unread: 0, biz_msg_unfollow_unread: 0, custom_unread: 0, dustbin_push_msg: 0, dustbin_unread: 0, follow_unread: 0, unfollow_push_msg: 0, unfollow_unread: 0 } })")
  ),
  () => api.projectFavorite(inBridgeRealm("({ code: 0, data: [{ id: 1 }, 'bad'] })"), favoriteLaterRaw, []),
  () => api.projectHistory([])
]) assert.throws(invalid, /schema/);

(async () => {
  const authController = new TestAbortController();
  const authPromise = api.execute(requestFor("AUTH_STATUS", "fedcba9876543210fedcba9876543210"), authController);
  assert.equal(fetchCalls, 1);
  assert.equal(fetchRequests[0].url, "https://api.bilibili.com/x/web-interface/nav");
  assertFixedOptions(fetchRequests[0], authController.signal);
  deferredFetches[0].resolve(response(validAuthData));
  assert.deepEqual(toLocal((await authPromise).data), toLocal(projectedAuth));

  const messageController = new TestAbortController();
  const messagePromise = api.execute(requestFor("MESSAGE_SUMMARY", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), messageController);
  assert.equal(fetchCalls, 3);
  assert.deepEqual(fetchRequests.slice(1).map((entry) => entry.url), Array.from(api.OPERATION_ROUTES.MESSAGE_SUMMARY, api.fixedUrl));
  fetchRequests.slice(1).forEach((entry) => assertFixedOptions(entry, messageController.signal));
  deferredFetches[1].resolve(response({ at: 0, like: 2, reply: 1, sys_msg: 0, chat: 0 }));
  deferredFetches[2].resolve(response({ biz_msg_follow_unread: 0, biz_msg_unfollow_unread: 0, custom_unread: 0, dustbin_push_msg: 0, dustbin_unread: 0, follow_unread: 0, unfollow_push_msg: 0, unfollow_unread: 0 }, { msg: "ok" }));
  assert.deepEqual(toLocal((await messagePromise).data), { reply: 1, at: 0, like: 2, sysMsg: 0, sessionUnread: 0 });

  const favoriteController = new TestAbortController();
  const favoritePromise = api.execute(requestFor("FAVORITE_SUMMARY", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"), favoriteController);
  assert.equal(fetchCalls, 5);
  assert.deepEqual(fetchRequests.slice(3, 5).map((entry) => entry.url), Array.from(api.OPERATION_ROUTES.FAVORITE_SUMMARY, api.fixedUrl));
  fetchRequests.slice(3, 5).forEach((entry) => assertFixedOptions(entry, favoriteController.signal));
  deferredFetches[3].resolve(response([
    { id: 7001, name: "收藏夹分类", uri: "ignored://category", mediaListResponse: { count: 39, has_more: true, list: [
      { id: 7, title: "我创建的收藏夹", media_count: 39, attr: 1, upstream_extra: true },
      { id: 8, title: "默认收藏夹", media_count: 16, attr: 0, upstream_extra: true },
      { id: 9, title: "收藏夹三", media_count: 20, attr: 1, upstream_extra: true },
      { id: 10, title: "收藏夹四", media_count: 20, attr: 1, upstream_extra: true },
      { id: 0, title: "非法收藏夹", media_count: 20, attr: 1, upstream_extra: true },
      { id: 7, title: "重复收藏夹", media_count: 20, attr: 1, upstream_extra: true },
      { id: 11, title: "缺少attr", media_count: 20, upstream_extra: true }
    ], upstream_extra: true } },
    { id: 7002, name: "稍后再看分类", uri: "ignored://later", mediaListResponse: { count: 1, has_more: false, list: null, upstream_extra: true } }
  ], { upstream_extra: true }));
  deferredFetches[4].resolve(response({ count: 1, list: [{
    title: "稍后项目", pic: "http://i0.hdslb.com/bfs/archive/later.webp", owner: { name: "作者" },
    duration: 62, aid: 1, bvid: "BV1234567890", upstream_extra: true
  }], upstream_extra: true }));
  await flushMicrotasks();
  assert.equal(fetchCalls, 9);
  assert.deepEqual(fetchRequests.slice(5, 9).map((entry) => entry.url), [
    "https://api.bilibili.com/x/v3/fav/resource/list4navigate?platform=web&media_id=8",
    "https://api.bilibili.com/x/v3/fav/resource/list4navigate?platform=web&media_id=7",
    "https://api.bilibili.com/x/v3/fav/resource/list4navigate?platform=web&media_id=9",
    "https://api.bilibili.com/x/v3/fav/resource/list4navigate?platform=web&media_id=10"
  ]);
  fetchRequests.slice(5, 9).forEach((entry) => assertFixedOptions(entry, favoriteController.signal));
  for (const index of [5, 6, 7, 8]) {
    deferredFetches[index].resolve(response([{
      title: "收藏项目", cover: "http://i1.hdslb.com/bfs/archive/favorite.webp?source=live", upper: { name: "作者" },
      duration: 65, id: 2, bvid: "BVABCDEFGHIJ", type: 2, upstream_extra: true
    }], { upstream_extra: true }));
  }
  assert.deepEqual(toLocal((await favoritePromise).data), toLocal(projectedFavorite));

  const historyController = new TestAbortController();
  const historyPromise = api.execute(requestFor("HISTORY_SUMMARY", "cccccccccccccccccccccccccccccccc"), historyController);
  assert.equal(fetchCalls, 12);
  assert.deepEqual(fetchRequests.slice(9, 12).map((entry) => entry.url), Array.from(api.OPERATION_ROUTES.HISTORY_SUMMARY, api.fixedUrl));
  fetchRequests.slice(9, 12).forEach((entry) => assertFixedOptions(entry, historyController.signal));
  deferredFetches[9].resolve(response({ list: [{
    title: "历史项目", cover: "http://i2.hdslb.com/bfs/archive/history.webp", author_name: "作者",
    progress: 10, duration: 90, view_at: 123, history: { bvid: "BVKLMNOPQRST", oid: 3 }, upstream_extra: true
  }], cursor: { ignored: true }, upstream_extra: true }, { upstream_extra: true }));
  deferredFetches[10].resolve(response({ list: [], cursor: { ignored: true }, upstream_extra: true }, { upstream_extra: true }));
  deferredFetches[11].resolve(response({ list: [], cursor: { ignored: true }, upstream_extra: true }, { upstream_extra: true }));
  assert.deepEqual(toLocal((await historyPromise).data), toLocal(projectedHistory));

  const liveController = new TestAbortController();
  const livePromise = api.execute(requestFor("LIVE_HOVER", "12121212121212121212121212121212"), liveController);
  assert.equal(fetchCalls, 13);
  assert.equal(fetchRequests[12].url, "https://api.live.bilibili.com/xlive/web-interface/v1/index/RoomForWebMainHover");
  assertPublicOptions(fetchRequests[12], liveController.signal);
  deferredFetches[12].resolve(response({
    top_banner: [],
    bottom_banner: [],
    room_list: [validLivePayload.data.room_list[0]]
  }));
  assert.deepEqual(toLocal((await livePromise).data), toLocal(validLiveProjection));

  const profileStatsController = new TestAbortController();
  const profileStatsPromise = api.execute(requestFor("PROFILE_STATS", "13131313131313131313131313131313"), profileStatsController);
  assert.equal(fetchCalls, 14);
  assert.equal(fetchRequests[13].url, "https://api.bilibili.com/x/web-interface/nav/stat");
  assertFixedOptions(fetchRequests[13], profileStatsController.signal);
  deferredFetches[13].resolve(response({ following: 11, follower: 22, dynamic_count: 33, fans_effect: null }));
  assert.deepEqual(toLocal((await profileStatsPromise).data), { following: 11, follower: 22, dynamic_count: 33 });

  const logoutCookieValue = "a".repeat(32);
  windowObject.document.cookie = `theme=fixture; bili_jct=${logoutCookieValue}; other=fixture`;
  const logoutController = new TestAbortController();
  const logoutPromise = api.execute(requestFor("LOGOUT", "14141414141414141414141414141414"), logoutController);
  assert.equal(fetchCalls, 15);
  assert.equal(fetchRequests[14].url, "https://passport.bilibili.com/login/exit/v2");
  assert.equal(fetchRequests[14].options.method, "POST");
  assert.equal(fetchRequests[14].options.credentials, "include");
  assert.equal(fetchRequests[14].options.cache, "no-store");
  assert.equal(fetchRequests[14].options.redirect, "error");
  assert.equal(fetchRequests[14].options.headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(fetchRequests[14].options.body, `biliCSRF=${logoutCookieValue}`);
  assert.notEqual(fetchRequests[14].options.body, "");
  assert.equal(Object.prototype.hasOwnProperty.call(fetchRequests[14].options, "body"), true);
  deferredFetches[14].resolve(response({ ignored: true }, { upstream_extra: "ignored" }));
  assert.deepEqual(toLocal((await logoutPromise).data), { status: "logged_out" });
  windowObject.document.cookie = "";

  const noCookieFetchCount = fetchCalls;
  assert.deepEqual(toLocal(await api.execute(requestFor("LOGOUT", "15151515151515151515151515151515"), new TestAbortController())), {
    ok: false,
    kind: api.ERROR_KINDS.SCHEMA
  });
  assert.equal(fetchCalls, noCookieFetchCount, "missing bili_jct does not issue logout request");
  windowObject.document.cookie = "bili_jct=short";
  assert.deepEqual(toLocal(await api.execute(requestFor("LOGOUT", "16161616161616161616161616161616"), new TestAbortController())), {
    ok: false,
    kind: api.ERROR_KINDS.SCHEMA
  });
  assert.equal(fetchCalls, noCookieFetchCount, "invalid bili_jct does not issue logout request");

  windowObject.document.cookie = `bili_jct=${logoutCookieValue}`;
  const failedLogout = api.execute(requestFor("LOGOUT", "17171717171717171717171717171717"), new TestAbortController());
  assert.equal(fetchCalls, 16);
  deferredFetches[15].resolve({
    ok: true,
    redirected: false,
    text: async () => JSON.stringify({ code: -101, data: { ignored: true }, extra: "ignored" })
  });
  assert.deepEqual(toLocal(await failedLogout), { ok: false, kind: api.ERROR_KINDS.SCHEMA });
  windowObject.document.cookie = "";

  const malformed = api.execute(requestFor("FAVORITE_SUMMARY", "dddddddddddddddddddddddddddddddd"), new TestAbortController());
  assert.equal(fetchCalls, 18);
  deferredFetches[16].resolve(response([{ id: 1, token: "must not pass", url: "https://example.test" }]));
  deferredFetches[17].resolve(response({ count: 0, list: [] }));
  assert.deepEqual(toLocal(await malformed), { ok: false, kind: api.ERROR_KINDS.SCHEMA });

  const timeoutRequest = requestFor("AUTH_STATUS", "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  dispatch({ source: windowObject, origin: api.ORIGIN, data: timeoutRequest });
  assert.equal(fetchCalls, 19);
  runNextTimer();
  assert.equal(posted.at(-1).message.error.kind, api.ERROR_KINDS.TIMEOUT);
  assert.equal(abortCalls, 1);
  deferredFetches[18].resolve(response({ isLogin: true }));
  await flushMicrotasks();
  assert.equal(posted.filter((entry) => entry.message.requestId === timeoutRequest.requestId).length, 1);

  const cancelledRequest = requestFor("AUTH_STATUS", "ffffffffffffffffffffffffffffffff");
  dispatch({ source: windowObject, origin: api.ORIGIN, data: cancelledRequest });
  assert.equal(fetchCalls, 20);
  const postedBeforeCancel = posted.length;
  dispatch({
    source: windowObject,
    origin: api.ORIGIN,
    data: inBridgeRealm(`({ channel: "${api.CHANNEL}", version: "${api.VERSION}", type: "CANCEL", operation: "${api.CANCEL_OPERATION}", requestId: "${cancelledRequest.requestId}" })`)
  });
  assert.equal(abortCalls, 2, "CANCEL aborts the upstream controller immediately");
  deferredFetches[19].resolve(response({ isLogin: true }));
  await flushMicrotasks();
  assert.equal(posted.filter((entry) => entry.message.requestId === cancelledRequest.requestId).length, 0,
    "cancelled lease sends no response, including after a late upstream result");
  assert.equal(posted.length, postedBeforeCancel, "CANCEL itself carries no response");

  const validRequest = requestFor("MESSAGE_SUMMARY");
  context.request = validRequest;
  assert.equal(api.isRequest(validRequest), true);
  assert.equal(api.isRequest(inBridgeRealm("({ ...request, extra: true })")), false);
  assert.equal(api.isRequest(inBridgeRealm("({ ...request, operation: 'UNKNOWN' })")), false);
  dispatch({ source: {}, origin: api.ORIGIN, data: validRequest });
  dispatch({ source: windowObject, origin: "https://evil.example", data: validRequest });
  assert.equal(fetchCalls, 20, "source and origin mismatch must not fetch");

  const cancelledLiveRequest = requestFor("LIVE_HOVER", "abababababababababababababababab");
  dispatch({ source: windowObject, origin: api.ORIGIN, data: cancelledLiveRequest });
  assert.equal(fetchCalls, 21);
  const postedBeforeLiveCancel = posted.length;
  dispatch({
    source: windowObject,
    origin: api.ORIGIN,
    data: inBridgeRealm(`({ channel: "${api.CHANNEL}", version: "${api.VERSION}", type: "CANCEL", operation: "${api.CANCEL_OPERATION}", requestId: "${cancelledLiveRequest.requestId}" })`)
  });
  assert.equal(fetchRequests[20].options.method, "GET");
  assert.equal(fetchRequests[20].options.credentials, "omit");
  assert.equal(fetchRequests[20].options.redirect, "error");
  assert.equal(Object.prototype.hasOwnProperty.call(fetchRequests[20].options, "body"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(fetchRequests[20].options, "headers"), false);
  deferredFetches[20].resolve(response({ top_banner: [], bottom_banner: [], room_list: [] }));
  await flushMicrotasks();
  assert.equal(posted.filter((entry) => entry.message.requestId === cancelledLiveRequest.requestId).length, 0,
    "cancelled live lease suppresses late response");
  assert.equal(posted.length, postedBeforeLiveCancel, "live CANCEL carries no response");

  windowObject.document.cookie = `bili_jct=${logoutCookieValue}`;
  const postedLogoutRequest = requestFor("LOGOUT", "18181818181818181818181818181818");
  dispatch({ source: windowObject, origin: api.ORIGIN, data: postedLogoutRequest });
  assert.equal(fetchCalls, 22);
  deferredFetches[21].resolve(response({ ignored: true }, { upstream_extra: "ignored" }));
  await flushMicrotasks();
  const postedLogoutResponses = posted.filter((entry) => entry.message.requestId === postedLogoutRequest.requestId);
  assert.equal(postedLogoutResponses.length, 1);
  assert.deepEqual(Object.keys(postedLogoutResponses[0].message.data), ["status"]);
  assert.deepEqual(toLocal(postedLogoutResponses[0].message.data), { status: "logged_out" });
  assert.equal(JSON.stringify(postedLogoutResponses).includes(logoutCookieValue), false,
    "bili_jct never enters the bridge response");
  windowObject.document.cookie = "";

  const dynamicController = new TestAbortController();
  const dynamicPromise = api.execute(requestFor("DYNAMIC_SUMMARY", "19191919191919191919191919191919"), dynamicController);
  assert.equal(fetchCalls, 23);
  assert.equal(fetchRequests[22].url, "https://api.bilibili.com/x/web-interface/dynamic/entrance?alltype_offset=0&video_offset=0&article_offset=0");
  assertFixedOptions(fetchRequests[22], dynamicController.signal);
  deferredFetches[22].resolve(response({
    update_info: { item: { count: 99, ignored: true }, ignored: true },
    ignored: true
  }, { upstream_extra: "ignored" }));
  assert.deepEqual(toLocal((await dynamicPromise).data), { count: 99 });

  const logoutStart = contentSource.indexOf("  const bindLogoutSurface =");
  const logoutEnd = contentSource.indexOf("  const AUTH_SUMMARY_SURFACES =", logoutStart);
  assert.ok(logoutStart >= 0 && logoutEnd > logoutStart, "logout binding source boundary");
  const logoutBindingSource = contentSource.slice(logoutStart, logoutEnd);
  assert.match(logoutBindingSource, /event\.isTrusted !== true/);
  assert.doesNotMatch(logoutBindingSource, /mouseenter|pointerenter|focusin|focusout/);
  const logoutButtonListeners = new Map();
  const logoutButton = {
    addEventListener(type, listener) { logoutButtonListeners.set(type, listener); }
  };
  let logoutStatus = "logged_in";
  let logoutSetStatusCalls = 0;
  let logoutRequests = 0;
  let logoutReloadCalls = 0;
  const logoutResolves = [];
  const logoutLifecycle = {
    active: true,
    logoutButton,
    statusPanel: { getAttribute: (name) => name === "data-state" ? logoutStatus : null },
    registerListener(target, type, listener) { target.addEventListener(type, listener); }
  };
  const logoutBindingContext = {
    Promise,
    document: { documentElement: {} },
    window: { location: { reload: () => { logoutReloadCalls += 1; } } },
    LOGOUT_OPERATION: "LOGOUT",
    isCurrentLifecycle: (candidate) => candidate === logoutLifecycle && candidate.active,
    isExactRoot: () => true,
    requestPageBridge: (operation) => {
      assert.equal(operation, "LOGOUT");
      logoutRequests += 1;
      return new Promise((resolve) => logoutResolves.push(resolve));
    },
    isBridgeSummaryData: (operation, data) => operation === "LOGOUT"
      && Boolean(data && data.status === "logged_out"),
    setStatus: (candidate, status) => {
      assert.equal(candidate, logoutLifecycle);
      logoutStatus = status;
      logoutSetStatusCalls += 1;
    }
  };
  logoutBindingContext.globalThis = logoutBindingContext;
  const bindLogoutSurface = vm.runInNewContext(
    `(() => { ${logoutBindingSource}; return bindLogoutSurface; })()`,
    logoutBindingContext
  );
  bindLogoutSurface(logoutLifecycle);
  const dispatchLogoutButton = (type, event = {}) => logoutButtonListeners.get(type)?.(event);
  for (const type of ["mouseenter", "pointerenter", "focusin"]) dispatchLogoutButton(type, { isTrusted: true });
  dispatchLogoutButton("click", { isTrusted: false });
  assert.equal(logoutRequests, 0, "hover, focus and synthetic click do not trigger LOGOUT");
  dispatchLogoutButton("click", { isTrusted: true });
  dispatchLogoutButton("click", { isTrusted: true });
  assert.equal(logoutRequests, 1, "trusted click starts one logout request");
  logoutResolves[0](null);
  await flushMicrotasks();
  assert.equal(logoutStatus, "logged_in", "failed logout keeps login state");
  assert.equal(logoutReloadCalls, 0, "failed logout does not refresh the page");
  dispatchLogoutButton("click", { isTrusted: true });
  assert.equal(logoutRequests, 2, "failed logout can be retried");
  logoutResolves[1]({ status: "logged_out" });
  await flushMicrotasks();
  assert.equal(logoutStatus, "logged_out");
  assert.equal(logoutSetStatusCalls, 1);
  assert.equal(logoutReloadCalls, 1, "successful logout refreshes the page exactly once");
  dispatchLogoutButton("click", { isTrusted: true });
  assert.equal(logoutRequests, 2, "logged-out state does not issue another logout request");

  const profileStateStart = contentSource.indexOf("  const PROFILE_STATS_RUNTIME_STATES =");
  const profileStateEnd = contentSource.indexOf("  const setLazyRuntimeState =", profileStateStart);
  assert.ok(profileStateStart >= 0 && profileStateEnd > profileStateStart, "profile stats state source boundary");
  const profileStateHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(profileStateStart, profileStateEnd)}; return setProfileStatsRuntimeState; })()`,
    { Set }
  );
  const profileStateWrites = [];
  const profileStateLifecycle = { host: { setAttribute: (name, value) => profileStateWrites.push([name, value]) } };
  profileStateHarness(profileStateLifecycle, "committed");
  profileStateHarness(profileStateLifecycle, "not-an-enum-state");
  assert.deepEqual(profileStateWrites, [["data-extension-b-profile-stats-state", "committed"]],
    "profile stats observability accepts only the finite non-sensitive enum");

  const profileStart = contentSource.indexOf("const bindProfileStatsSurface =");
  const profileEnd = contentSource.indexOf("const isExactFocusResult =", profileStart);
  assert.ok(profileStart >= 0 && profileEnd > profileStart, "profile stats activation source boundary");
  const profileDocument = { documentElement: {} };
  const profileStates = [];
  const profileRequests = [];
  const profileResolves = [];
  const profileCommits = [];
  let profileCancelCalls = 0;
  let profileStatus = "logged_in";
  let profileApplyResult = true;
  const profileListeners = new Map();
  const addProfileListener = (target, type, listener) => {
    if (!profileListeners.has(target)) profileListeners.set(target, new Map());
    const byType = profileListeners.get(target);
    if (!byType.has(type)) byType.set(type, []);
    byType.get(type).push(listener);
  };
  const dispatchProfile = (target, type, event = {}) => {
    for (const listener of profileListeners.get(target)?.get(type) || []) {
      listener.call(target, event);
    }
  };
  const profileGroup = {
    contains(node) { return node === profileGroup || node === profileTrigger || node === profilePanel; },
    addEventListener(type, listener) { addProfileListener(profileGroup, type, listener); }
  };
  const profileTrigger = {
    parentElement: profileGroup,
    addEventListener(type, listener) { addProfileListener(profileTrigger, type, listener); }
  };
  const profilePanel = {
    addEventListener(type, listener) { addProfileListener(profilePanel, type, listener); }
  };
  const profileStatusPanel = { getAttribute: (name) => name === "data-state" ? profileStatus : null };
  const profileLifecycle = {
    active: true,
    generation: 1,
    host: { isConnected: true, setAttribute: (name, value) => profileStates.push([name, value]) },
    profilePopover: profilePanel,
    profileTrigger,
    statusPanel: profileStatusPanel,
    cancelProfileStatsRequest() { profileCancelCalls += 1; },
    registerListener(target, type, listener) { target.addEventListener(type, listener); }
  };
  const profileContext = {
    Promise,
    document: profileDocument,
    PROFILE_STATS_OPERATION: "PROFILE_STATS",
    isCurrentLifecycle: (candidate) => candidate === profileLifecycle && candidate.active,
    isExactRoot: () => true,
    isBridgeSummaryData: (operation, data) => operation === "PROFILE_STATS" && Boolean(data && data.valid === true),
    setProfileStatsRuntimeState: (candidate, state) => {
      candidate.host.setAttribute("data-extension-b-profile-stats-state", state);
    },
    requestPageBridge: (operation, candidate) => {
      profileRequests.push([operation, candidate]);
      candidate.host.setAttribute("data-extension-b-profile-stats-state", "request-posted");
      return new Promise((resolve) => profileResolves.push(resolve));
    },
    ExtensionBHomepageRenderer: {
      setProfileStats(panel, data) {
        profileCommits.push([panel, data]);
        return profileApplyResult;
      }
    }
  };
  profileContext.globalThis = profileContext;
  const bindProfileStatsSurface = vm.runInNewContext(
    `(() => { ${contentSource.slice(profileStart, profileEnd)}; return bindProfileStatsSurface; })()`,
    profileContext
  );
  bindProfileStatsSurface(profileLifecycle);
  assert.deepEqual(profileStates.at(-1), ["data-extension-b-profile-stats-state", "bound"]);
  for (const target of [profileTrigger, profileGroup, profilePanel]) {
    assert.equal((profileListeners.get(target)?.get("mouseenter") || []).length, 1, "profile target binds mouseenter");
    assert.equal((profileListeners.get(target)?.get("pointerenter") || []).length, 1, "profile target binds pointerenter");
  }
  assert.equal((profileListeners.get(profileTrigger)?.get("focusin") || []).length, 1);
  assert.equal((profileListeners.get(profileGroup)?.get("focusin") || []).length, 1);
  assert.equal((profileListeners.get(profileGroup)?.get("focusout") || []).length, 1);

  dispatchProfile(profileTrigger, "pointerenter");
  assert.deepEqual(profileStates.slice(-2).map((entry) => entry[1]), ["activation-started", "request-posted"]);
  assert.equal(profileRequests.length, 1);
  profileResolves[0](null);
  await flushMicrotasks();
  assert.equal(profileStates.at(-1)[1], "response-invalid");

  profileContext.ExtensionBHomepageRenderer = {};
  dispatchProfile(profileGroup, "mouseenter");
  assert.equal(profileRequests.length, 2, "missing setter does not block the request");
  profileResolves[1]({ valid: true });
  await flushMicrotasks();
  assert.equal(profileStates.at(-1)[1], "commit-blocked");

  profileApplyResult = false;
  profileContext.ExtensionBHomepageRenderer = {
    setProfileStats(panel, data) {
      profileCommits.push([panel, data]);
      return profileApplyResult;
    }
  };
  dispatchProfile(profilePanel, "pointerenter");
  assert.equal(profileRequests.length, 3, "commit-blocked activation can retry");
  profileResolves[2]({ valid: true });
  await flushMicrotasks();
  assert.equal(profileStates.at(-1)[1], "commit-blocked");

  profileApplyResult = true;
  dispatchProfile(profileTrigger, "mouseenter");
  profileResolves[3]({ valid: true });
  await flushMicrotasks();
  assert.equal(profileStates.at(-1)[1], "committed");
  const commitsAfterSuccess = profileCommits.length;

  dispatchProfile(profileGroup, "mouseleave", { relatedTarget: null });
  assert.equal(profileStates.at(-1)[1], "cancelled");
  assert.equal(profileCancelCalls, 1);
  dispatchProfile(profileTrigger, "pointerenter");
  const staleResolve = profileResolves[4];
  dispatchProfile(profileGroup, "focusout", { relatedTarget: null });
  dispatchProfile(profilePanel, "mouseenter");
  assert.equal(profileRequests.length, 6, "cancelled activation starts a fresh request");
  staleResolve({ valid: true });
  await flushMicrotasks();
  assert.equal(profileCommits.length, commitsAfterSuccess, "stale profile completion cannot commit");
  assert.equal(profileStates.at(-1)[1], "request-posted", "stale completion cannot overwrite the new activation state");
  profileResolves[5]({ valid: true });
  await flushMicrotasks();
  assert.equal(profileStates.at(-1)[1], "committed");

  dispatchProfile(profileGroup, "mouseleave", { relatedTarget: null });
  profileStatus = "logged_out";
  dispatchProfile(profileGroup, "focusin");
  assert.equal(profileStates.at(-1)[1], "guard-blocked");
  assert.equal(profileRequests.length, 6, "guard-blocked activation emits no request");
  console.log("PASS profile stats runtime observability contract");

  const rootPredicateStart = contentSource.indexOf("  const ROOT_URL =");
  const rootPredicateEnd = contentSource.indexOf("  const createOwnerMarker =", rootPredicateStart);
  assert.ok(rootPredicateStart >= 0 && rootPredicateEnd > rootPredicateStart, "homepage root predicate source boundary");
  const rootPredicateContext = { URL, window: { location: { href: "" } } };
  const rootPredicateHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(rootPredicateStart, rootPredicateEnd)}; return {
      ROOT_URL,
      isLegacyHomepageRootUrl,
      isExactRoot
    }; })()`,
    rootPredicateContext
  );
  assert.equal(rootPredicateHarness.ROOT_URL, "https://www.bilibili.com/");
  for (const validRoot of [
    "https://www.bilibili.com/",
    "https://www.bilibili.com/index.html",
    "https://www.bilibili.com"
  ]) assert.equal(rootPredicateHarness.isLegacyHomepageRootUrl(validRoot), true, validRoot);
  for (const invalidRoot of [
    "http://www.bilibili.com/",
    "https://evil.example/",
    "https://www.bilibili.com/index.html?from=reload",
    "https://www.bilibili.com/index.html#top",
    "https://www.bilibili.com/?from=reload",
    "https://www.bilibili.com/search",
    "https://www.bilibili.com/index.htm"
  ]) assert.equal(rootPredicateHarness.isLegacyHomepageRootUrl(invalidRoot), false, invalidRoot);
  rootPredicateContext.window.location.href = "https://www.bilibili.com/index.html";
  assert.equal(rootPredicateHarness.isExactRoot(), true);
  rootPredicateContext.window.location.href = "https://www.bilibili.com/index.html?from=reload";
  assert.equal(rootPredicateHarness.isExactRoot(), false);

  const bridgeTimingStart = contentSource.indexOf("  const bridgeOwnKeys =");
  const bridgeTimingEnd = contentSource.indexOf("\n  let lifecycle = null;", bridgeTimingStart);
  assert.ok(bridgeTimingStart >= 0 && bridgeTimingEnd > bridgeTimingStart, "bridge timing source boundary");
  const bridgeTimingRoot = {};
  const bridgeTimingWindowListeners = new Map();
  const bridgeTimingWindow = {
    location: { href: "https://www.bilibili.com/" },
    crypto: { getRandomValues(values) { values.fill(7); return values; } },
    addEventListener(type, listener) {
      if (!bridgeTimingWindowListeners.has(type)) bridgeTimingWindowListeners.set(type, new Set());
      bridgeTimingWindowListeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      bridgeTimingWindowListeners.get(type)?.delete(listener);
    },
    setInterval() { return 1; },
    clearInterval() {},
    setTimeout() { return 2; },
    clearTimeout() {},
    postMessage(message, targetOrigin) {
      bridgeTimingPosted.push({ message, targetOrigin });
    }
  };
  const bridgeTimingPosted = [];
  let bridgeTimingScripts = [];
  const makeBridgeTimingScript = () => {
    const scriptListeners = new Map();
    const script = {
      tagName: "SCRIPT",
      id: "",
      src: "",
      async: false,
      readyState: "loading",
      dataset: {},
      parentNode: null,
      addEventListener(type, listener) {
        if (!scriptListeners.has(type)) scriptListeners.set(type, new Set());
        scriptListeners.get(type).add(listener);
      },
      removeEventListener(type, listener) {
        scriptListeners.get(type)?.delete(listener);
      },
      dispatch(type) {
        for (const listener of Array.from(scriptListeners.get(type) || [])) listener();
      }
    };
    bridgeTimingScripts.push(script);
    return script;
  };
  const bridgeTimingDocument = {
    documentElement: bridgeTimingRoot,
    createElement: () => makeBridgeTimingScript(),
    getElementById: (id) => bridgeTimingScripts.find((script) => script.parentNode === bridgeTimingDocument.documentElement && script.id === id) || null,
    querySelector: () => bridgeTimingScripts.find((script) => script.parentNode === bridgeTimingDocument.documentElement
      && script.dataset.extensionBPageBridge === "V1") || null
  };
  const attachBridgeTimingRoot = (root) => {
    root.appendChild = (script) => {
      script.parentNode = root;
      if (!bridgeTimingScripts.includes(script)) bridgeTimingScripts.push(script);
    };
    root.removeChild = (script) => {
      if (script.parentNode === root) script.parentNode = null;
    };
    bridgeTimingDocument.documentElement = root;
  };
  attachBridgeTimingRoot(bridgeTimingRoot);
  const bridgeTimingContext = {
    window: bridgeTimingWindow,
    document: bridgeTimingDocument,
    chrome: { runtime: { getURL: (value) => `chrome-extension://test/${value}` } },
    BRIDGE_CHANNEL: "EXTENSION_B_PAGE_BRIDGE",
    BRIDGE_VERSION: "V1",
    BRIDGE_TYPE_REQUEST: "REQUEST",
    BRIDGE_TYPE_RESPONSE: "RESPONSE",
    BRIDGE_ORIGIN: "https://www.bilibili.com",
    BRIDGE_SCRIPT_ID: "extension-b-page-bridge-script",
    BRIDGE_REQUEST_ID_LENGTH: 32,
    BRIDGE_TIMEOUT_MS: 4500,
    LIVE_HOVER_OPERATION: "LIVE_HOVER",
    PRIMARY_MENU_COUNTS_OPERATION: "PRIMARY_MENU_COUNTS",
    RECOMMENDATION_OPERATION: "RECOMMENDATION_FEED",
    DOUGA_OPERATION: "DOUGA_FLOOR",
    READ_FLOOR_OPERATION: "READ_FLOOR",
    WATCH_LATER_OPERATION: "WATCH_LATER_MUTATE",
    PROFILE_STATS_OPERATION: "PROFILE_STATS",
    BRIDGE_OPERATIONS: new Set(["AUTH_STATUS", "LOGOUT", "PROFILE_STATS", "MESSAGE_SUMMARY", "DYNAMIC_SUMMARY", "FAVORITE_SUMMARY", "HISTORY_SUMMARY", "LIVE_HOVER", "PRIMARY_MENU_COUNTS", "RECOMMENDATION_FEED", "DOUGA_FLOOR", "READ_FLOOR", "LIVE_FLOOR_INITIAL", "LIVE_FLOOR_MORE", "LIVE_FLOOR_FOLLOWING"]),
    BRIDGE_ERROR_KINDS: new Set(["OPERATION_UNAVAILABLE", "UPSTREAM_UNAVAILABLE", "SCHEMA_INVALID", "TIMEOUT"]),
    URL_POLL_MS: 250,
    URL,
    Uint8Array,
    Number,
    Object,
    Array,
    Promise,
    Set,
    Error,
    globalThis: {}
  };
  bridgeTimingContext.diagnosticKeyFor = (operation) => operation;
  bridgeTimingContext.diagnosticClock = () => 0;
  bridgeTimingContext.recordDiagnostic = () => {};
  bridgeTimingContext.isExactRoot = () => rootPredicateHarness.isLegacyHomepageRootUrl(bridgeTimingWindow.location.href);
  const bridgeTimingHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(bridgeTimingStart, bridgeTimingEnd)}; let lifecycle = null; return {
      getBridgeReady,
      requestPageBridge,
      setLifecycle: (value) => { lifecycle = value; }
    }; })()`,
    bridgeTimingContext
  );
  bridgeTimingWindow.location.href = "https://www.bilibili.com/search";
  await assert.rejects(bridgeTimingHarness.getBridgeReady(), /root lifecycle unavailable/);
  bridgeTimingWindow.location.href = "https://www.bilibili.com/index.html";
  const firstReady = bridgeTimingHarness.getBridgeReady();
  const duplicateReady = bridgeTimingHarness.getBridgeReady();
  assert.strictEqual(firstReady, duplicateReady, "concurrent bridge requests share one ready promise");
  assert.equal(bridgeTimingScripts.length, 1, "concurrent bridge requests create one script");
  const failedScript = bridgeTimingScripts[0];
  failedScript.dispatch("error");
  await assert.rejects(firstReady, /failed to load/);
  await assert.rejects(duplicateReady, /failed to load/);
  bridgeTimingWindow.location.href = "https://www.bilibili.com/";
  const retryReady = bridgeTimingHarness.getBridgeReady();
  assert.equal(bridgeTimingScripts.length, 2, "failed script is replaced before retry");
  let retrySettled = false;
  retryReady.then(() => { retrySettled = true; });
  await flushMicrotasks();
  assert.equal(retrySettled, false, "newly created bridge waits for a real load event");
  bridgeTimingScripts[1].dispatch("load");
  await retryReady;
  assert.equal(retrySettled, true);

  const ownedRoot = {};
  attachBridgeTimingRoot(ownedRoot);
  const ownedExisting = makeBridgeTimingScript();
  ownedExisting.id = "extension-b-page-bridge-script";
  ownedExisting.dataset.extensionBPageBridge = "V1";
  ownedExisting.src = "chrome-extension://test/page-bridge.js";
  ownedRoot.appendChild(ownedExisting);
  const scriptsBeforeOwnedReuse = bridgeTimingScripts.length;
  await bridgeTimingHarness.getBridgeReady();
  assert.equal(bridgeTimingScripts.length, scriptsBeforeOwnedReuse,
    "strictly owned existing bridge is reused without waiting for a missed load event");

  const profileBridgeStates = [];
  const ownedLifecycle = {
    active: true,
    generation: 5,
    host: { setAttribute: (name, value) => profileBridgeStates.push([name, value]) },
    registerCleanup(callback) { this.cleanup = callback; },
    registerBridgeRequestCanceler() { return () => {}; }
  };
  bridgeTimingHarness.setLifecycle(ownedLifecycle);
  const profileBridgeRequest = bridgeTimingHarness.requestPageBridge("PROFILE_STATS", ownedLifecycle);
  await flushMicrotasks();
  assert.equal(bridgeTimingPosted.some((entry) => entry.message.type === "REQUEST"
    && entry.message.operation === "PROFILE_STATS"), true,
  `owned existing bridge reaches PROFILE_STATS request-posted: ${JSON.stringify({
    posted: bridgeTimingPosted.map((entry) => ({ type: entry.message.type, operation: entry.message.operation })),
    states: profileBridgeStates.map((entry) => entry[1])
  })}`);
  assert.deepEqual(profileBridgeStates.at(-1), ["data-extension-b-profile-stats-state", "request-posted"]);
  assert.equal(typeof ownedLifecycle.profileStatsRequestCancel, "function");
  ownedLifecycle.profileStatsRequestCancel();
  assert.equal(await profileBridgeRequest, null);

  const nonOwnedRoot = {};
  attachBridgeTimingRoot(nonOwnedRoot);
  const nonOwnedExisting = makeBridgeTimingScript();
  nonOwnedExisting.id = "extension-b-page-bridge-script";
  nonOwnedExisting.dataset.extensionBPageBridge = "V1";
  nonOwnedExisting.src = "https://www.bilibili.com/page-bridge.js";
  nonOwnedRoot.appendChild(nonOwnedExisting);
  const scriptsBeforeNonOwned = bridgeTimingScripts.length;
  const nonOwnedReady = bridgeTimingHarness.getBridgeReady();
  assert.equal(nonOwnedExisting.parentNode, null, "non-owned reserved bridge candidate is removed");
  assert.equal(bridgeTimingScripts.length, scriptsBeforeNonOwned + 1, "non-owned candidate is replaced");
  const nonOwnedReplacement = bridgeTimingScripts.at(-1);
  assert.equal(nonOwnedReplacement.src, "chrome-extension://test/page-bridge.js");
  nonOwnedReplacement.dispatch("load");
  await nonOwnedReady;

  const failedOwnedRoot = {};
  attachBridgeTimingRoot(failedOwnedRoot);
  const failedOwnedExisting = makeBridgeTimingScript();
  failedOwnedExisting.id = "extension-b-page-bridge-script";
  failedOwnedExisting.dataset.extensionBPageBridge = "V1";
  failedOwnedExisting.dataset.extensionBPageBridgeFailed = "true";
  failedOwnedExisting.src = "chrome-extension://test/page-bridge.js";
  failedOwnedRoot.appendChild(failedOwnedExisting);
  const scriptsBeforeFailedOwned = bridgeTimingScripts.length;
  const failedOwnedReady = bridgeTimingHarness.getBridgeReady();
  assert.equal(failedOwnedExisting.parentNode, null, "failed owned bridge is removed");
  assert.equal(bridgeTimingScripts.length, scriptsBeforeFailedOwned + 1, "failed owned bridge is reinjected");
  bridgeTimingScripts.at(-1).dispatch("load");
  await failedOwnedReady;

  const waitingLifecycle = {
    active: true,
    generation: 4,
    registerCleanup() { throw new Error("cleanup must not register before REQUEST"); },
    registerBridgeRequestCanceler() { throw new Error("canceler must not register before REQUEST"); }
  };
  bridgeTimingHarness.setLifecycle(waitingLifecycle);
  attachBridgeTimingRoot({});
  const postedBeforeStaleWait = bridgeTimingPosted.length;
  bridgeTimingWindow.location.href = "https://www.bilibili.com/search";
  bridgeTimingWindow.location.href = "https://www.bilibili.com/";
  const waitForRequest = bridgeTimingHarness.requestPageBridge("LIVE_HOVER", waitingLifecycle);
  waitingLifecycle.active = false;
  waitingLifecycle.generation += 1;
  bridgeTimingWindow.location.href = "https://www.bilibili.com/search";
  for (const listener of Array.from(bridgeTimingWindowListeners.get("pagehide") || [])) listener();
  const staleResult = await waitForRequest;
  assert.equal(staleResult, null, "teardown during bridge wait resolves without data");
  assert.equal(bridgeTimingPosted.length, postedBeforeStaleWait, "teardown during bridge wait sends no REQUEST");

  assert.match(contentSource, /const getBridgeReady = \(\) =>/);
  assert.doesNotMatch(contentSource, /const bridgeReady = injectPageBridge\(\)/);
  assert.match(contentSource, /bridgeReadyPromise && bridgeReadyRoot === rootIdentity/);
  assert.match(contentSource, /const isOwnedPageBridgeScript = \(script, expectedUrl\) => Boolean\(/);
  assert.match(contentSource, /script\.tagName === "SCRIPT"/);
  assert.match(contentSource, /script\.id === BRIDGE_SCRIPT_ID/);
  assert.match(contentSource, /script\.dataset\.extensionBPageBridge === BRIDGE_VERSION/);
  assert.match(contentSource, /script\.src === expectedUrl/);
  assert.match(contentSource, /const expectedUrl = chrome\.runtime\.getURL\("page-bridge\.js"\)/);
  assert.match(contentSource, /if \(script && !isOwnedPageBridgeScript\(script, expectedUrl\)\) \{\s*removePageBridgeScript\(script\);\s*script = null;/);
  assert.doesNotMatch(contentSource, /script\.readyState === "(?:loaded|complete)"/);
  assert.match(contentSource, /dataset\.extensionBPageBridgeFailed = "true"/);
  assert.match(contentSource, /removePageBridgeScript\(script\)/);
  assert.match(contentSource, /const requestGeneration = currentLifecycle \? currentLifecycle\.generation : null/);
  assert.match(contentSource, /const requestRootIdentity = document\.documentElement/);
  assert.match(contentSource, /isBridgeLifecycleCurrent\(currentLifecycle, requestGeneration, requestRootIdentity\)/);
  assert.match(contentSource, /!document\.documentElement/);

  const gateStart = contentSource.indexOf("const createSummaryActivationGate =");
  const gateEnd = contentSource.indexOf("const bindAuthSummarySurfaces", gateStart);
  assert.ok(gateStart >= 0 && gateEnd > gateStart, "summary activation gate source boundary");
  const rootDocument = { documentElement: {} };
  const createSummaryActivationGate = vm.runInNewContext(
    `(() => { ${contentSource.slice(gateStart, gateEnd)}; return createSummaryActivationGate; })()`,
    {
      document: rootDocument,
      setSummaryRuntimeState: (candidate, kind, state) => {
        if (candidate.host && typeof candidate.host.setAttribute === "function") {
          candidate.host.setAttribute(`data-extension-b-${kind}-state`, state);
        }
      }
    }
  );
  const rootIdentity = rootDocument.documentElement;
  let rootIsExact = true;
  const createGate = (row, request) => createSummaryActivationGate({
    currentLifecycle: gateLifecycle,
    boundStatusPanel: panel,
    surface: gateSurface,
    request,
    isCurrent: () => gateCurrent && gateLifecycle.active,
    isValid: () => true,
    commit: () => { row.textContent = "safe summary"; },
    rootIdentity,
    isRoot: () => rootIsExact
  });
  const panel = { getAttribute: () => "logged_in" };
  const gateLifecycle = { active: true, generation: 1, statusPanel: panel };
  const gateSurface = { operation: "MESSAGE_SUMMARY" };
  const gateRow = { textContent: "fixture" };
  let gateCurrent = true;
  let gateRequests = 0;
  let resolveGateRequest;
  const gateActivate = createGate(gateRow, () => {
      gateRequests += 1;
      return new Promise((resolve) => { resolveGateRequest = resolve; });
    });
  gateActivate();
  gateActivate();
  assert.equal(gateRequests, 1, "mouseenter/focusin activation is deduplicated");
  gateCurrent = false;
  resolveGateRequest({});
  await flushMicrotasks();
  assert.equal(gateRow.textContent, "fixture", "teardown late response preserves fixture");
  gateCurrent = true;
  let resolveUrlChanged;
  const urlChangedRow = { textContent: "fixture" };
  const urlChangedActivate = createGate(urlChangedRow, () => new Promise((resolve) => { resolveUrlChanged = resolve; }));
  rootIsExact = false;
  urlChangedActivate();
  resolveUrlChanged({});
  await flushMicrotasks();
  assert.equal(urlChangedRow.textContent, "fixture", "URL change before response preserves fixture");
  rootIsExact = true;
  let resolveRootReplaced;
  const rootReplacedRow = { textContent: "fixture" };
  const rootReplacedActivate = createGate(rootReplacedRow, () => new Promise((resolve) => { resolveRootReplaced = resolve; }));
  rootReplacedActivate();
  rootDocument.documentElement = {};
  resolveRootReplaced({});
  await flushMicrotasks();
  assert.equal(rootReplacedRow.textContent, "fixture", "document root replacement preserves fixture");
  const oldSummaryLifecycle = { active: true, generation: 1, statusPanel: panel };
  const newSummaryLifecycle = { active: true, generation: 1, statusPanel: panel };
  let activeSummaryLifecycle = oldSummaryLifecycle;
  let resolveOldSummary;
  const oldSummaryRow = { textContent: "fixture" };
  const oldSummaryActivate = createSummaryActivationGate({
    currentLifecycle: oldSummaryLifecycle,
    boundStatusPanel: panel,
    surface: gateSurface,
    request: () => new Promise((resolve) => { resolveOldSummary = resolve; }),
    isCurrent: (candidate) => candidate === activeSummaryLifecycle && candidate.active,
    isValid: () => true,
    commit: () => { oldSummaryRow.textContent = "stale result"; },
    rootIdentity: rootDocument.documentElement,
    isRoot: () => true
  });
  oldSummaryActivate();
  oldSummaryLifecycle.active = false;
  activeSummaryLifecycle = newSummaryLifecycle;
  resolveOldSummary({});
  await flushMicrotasks();
  assert.equal(oldSummaryRow.textContent, "fixture", "old lifecycle completion does not write new lifecycle DOM");
  const loggedOutLifecycle = { active: true, generation: 1, statusPanel: { getAttribute: () => "logged_out" } };
  const loggedOutRow = { textContent: "fixture" };
  let loggedOutRequests = 0;
  const loggedOutActivate = createSummaryActivationGate({
    currentLifecycle: loggedOutLifecycle,
    boundStatusPanel: loggedOutLifecycle.statusPanel,
    surface: gateSurface,
    request: () => { loggedOutRequests += 1; return Promise.resolve({}); },
    isCurrent: () => true,
    isValid: () => true,
    commit: () => { loggedOutRow.textContent = "must not write"; }
  });
  loggedOutActivate();
  assert.equal(loggedOutRequests, 0, "logged-out surface does not request before activation");
  assert.equal(loggedOutRow.textContent, "fixture");

  const summaryStateChanges = [];
  const summaryStateDocument = { documentElement: {} };
  rootDocument.documentElement = summaryStateDocument.documentElement;
  const summaryStatePanel = { getAttribute: () => "logged_in" };
  const summaryStateLifecycle = {
    active: true,
    generation: 1,
    statusPanel: summaryStatePanel,
    host: { setAttribute: (name, value) => summaryStateChanges.push([name, value]) }
  };
  const summaryStateSurface = { operation: "FAVORITE_SUMMARY", kind: "favorite" };
  let resolveInvalidSummary;
  const invalidSummaryGate = createSummaryActivationGate({
    currentLifecycle: summaryStateLifecycle,
    boundStatusPanel: summaryStatePanel,
    surface: summaryStateSurface,
    request: () => new Promise((resolve) => { resolveInvalidSummary = resolve; }),
    isCurrent: () => true,
    isValid: () => false,
    commit: () => true,
    rootIdentity: summaryStateDocument.documentElement,
    isRoot: () => true
  });
  invalidSummaryGate();
  assert.deepEqual(summaryStateChanges.slice(-2), [
    ["data-extension-b-favorite-state", "activation-started"],
    ["data-extension-b-favorite-state", "request-posted"]
  ]);
  resolveInvalidSummary(null);
  await flushMicrotasks();
  assert.deepEqual(summaryStateChanges.at(-1), ["data-extension-b-favorite-state", "response-invalid"]);

  const commitFailedGate = createSummaryActivationGate({
    currentLifecycle: summaryStateLifecycle,
    boundStatusPanel: summaryStatePanel,
    surface: summaryStateSurface,
    request: () => Promise.resolve({}),
    isCurrent: () => true,
    isValid: () => true,
    commit: () => false,
    rootIdentity: summaryStateDocument.documentElement,
    isRoot: () => true
  });
  commitFailedGate();
  await flushMicrotasks();
  assert.deepEqual(summaryStateChanges.at(-1), ["data-extension-b-favorite-state", "commit-failed"]);

  const committedGate = createSummaryActivationGate({
    currentLifecycle: summaryStateLifecycle,
    boundStatusPanel: summaryStatePanel,
    surface: { operation: "HISTORY_SUMMARY", kind: "history" },
    request: () => Promise.resolve({}),
    isCurrent: () => true,
    isValid: () => true,
    commit: () => true,
    rootIdentity: summaryStateDocument.documentElement,
    isRoot: () => true
  });
  committedGate();
  await flushMicrotasks();
  assert.deepEqual(summaryStateChanges.at(-1), ["data-extension-b-history-state", "committed"]);

  const favoriteGateStates = [];
  const favoriteGateRoot = {};
  rootDocument.documentElement = favoriteGateRoot;
  const favoriteGatePanel = { getAttribute: () => "logged_in" };
  const favoriteGateLifecycle = {
    active: true,
    generation: 1,
    statusPanel: favoriteGatePanel,
    host: { setAttribute: (name, value) => favoriteGateStates.push([name, value]) }
  };
  let favoriteCommitCalls = 0;
  const validFavoriteGate = createSummaryActivationGate({
    currentLifecycle: favoriteGateLifecycle,
    boundStatusPanel: favoriteGatePanel,
    surface: { operation: "FAVORITE_SUMMARY", kind: "favorite" },
    request: () => Promise.resolve(validFavoriteSummary),
    isCurrent: () => true,
    isValid: summaryValidatorHarness.isBridgeSummaryData,
    commit: (operation, data) => {
      favoriteCommitCalls += 1;
      assert.equal(operation, "FAVORITE_SUMMARY");
      assert.strictEqual(data, validFavoriteSummary);
      return true;
    },
    rootIdentity: favoriteGateRoot,
    isRoot: () => true
  });
  validFavoriteGate();
  await flushMicrotasks();
  assert.equal(favoriteCommitCalls, 1, "valid favorite payload invokes renderer commit once");
  assert.deepEqual(favoriteGateStates.at(-1), ["data-extension-b-favorite-state", "committed"]);

  let invalidFavoriteCommitCalls = 0;
  const invalidFavoriteGate = createSummaryActivationGate({
    currentLifecycle: favoriteGateLifecycle,
    boundStatusPanel: favoriteGatePanel,
    surface: { operation: "FAVORITE_SUMMARY", kind: "favorite" },
    request: () => Promise.resolve(invalidFavoriteSummary),
    isCurrent: () => true,
    isValid: summaryValidatorHarness.isBridgeSummaryData,
    commit: () => { invalidFavoriteCommitCalls += 1; return true; },
    rootIdentity: favoriteGateRoot,
    isRoot: () => true
  });
  invalidFavoriteGate();
  await flushMicrotasks();
  assert.equal(invalidFavoriteCommitCalls, 0, "invalid favorite payload never reaches renderer commit");
  assert.deepEqual(favoriteGateStates.at(-1), ["data-extension-b-favorite-state", "response-invalid"]);

  const summaryBindStart = contentSource.indexOf("  const AUTH_SUMMARY_SURFACES =");
  const summaryBindEnd = contentSource.indexOf("  const bindLiveHoverSurface =", summaryBindStart);
  const mountedBindStart = contentSource.indexOf("  const bindMountedHostSurfaces =", summaryBindEnd);
  const mountedBindEnd = contentSource.indexOf("  const isExactFocusResult =", mountedBindStart);
  assert.ok(summaryBindStart >= 0 && summaryBindEnd > summaryBindStart, "summary binding source boundary");
  assert.ok(mountedBindStart >= 0 && mountedBindEnd > mountedBindStart, "mounted binding source boundary");
  const bindingHarnessDocument = { documentElement: {} };
  const bindingSandbox = {
    Array,
    Promise,
    Set,
    document: bindingHarnessDocument,
    AUTH_RUNTIME_STATES: new Set(["logged_in", "logged_out", "unknown"]),
    isCurrentLifecycle: (candidate) => candidate.active === true,
    isExactRoot: () => true,
    requestPageBridge: () => Promise.resolve(validFavoriteSummary),
    isBridgeSummaryData: (operation, value) => operation === "FAVORITE_SUMMARY"
      && summaryValidatorHarness.isBridgeSummaryData(operation, value),
    setAuthRuntimeState: (candidate, state) => candidate.host.setAttribute("data-extension-b-auth-state", state),
    setSearchRuntimeState: (candidate, state) => candidate.host.setAttribute("data-extension-b-search-state", state),
    loadSearchHistory: () => {},
    setRecommendationRuntimeState: (candidate, state) => candidate.host.setAttribute("data-extension-b-recommendation-state", state),
    setSummaryRuntimeState: (candidate, kind, state) => {
      if (["bound", "bind-missing", "commit-blocked", "committed"].includes(state)) {
        candidate.host.setAttribute(`data-extension-b-${kind}-state`, state);
      }
    }
  };
  bindingSandbox.globalThis = bindingSandbox;
  const bindingHarness = vm.runInNewContext(
    `(() => {
      ${contentSource.slice(summaryBindStart, summaryBindEnd)}
      const bindLiveHoverSurface = () => {};
      const bindLogoutSurface = () => {};
      const bindProfileStatsSurface = () => {};
      ${contentSource.slice(mountedBindStart, mountedBindEnd)}
      return { bindAuthSummarySurfaces, bindMountedHostSurfaces };
    })()`,
    bindingSandbox
  );
  const bindingContext = bindingSandbox;
  const makeBindingNode = (className = "") => {
    const listeners = new Map();
    return {
      parentNode: null,
      parentElement: null,
      classList: { contains: (name) => className.split(/\s+/).includes(name) },
      addEventListener(type, listener) {
        const values = listeners.get(type) || [];
        values.push(listener);
        listeners.set(type, values);
      },
      listenerCount(type) { return (listeners.get(type) || []).length; },
      dispatch(type) { for (const listener of listeners.get(type) || []) listener({ type }); }
    };
  };
  const bindingStates = [];
  const bindingCommitCalls = [];
  const bindingHost = {
    isConnected: false,
    setAttribute: (name, value) => bindingStates.push([name, value])
  };
  const bindingStatusPanel = { getAttribute: (name) => name === "data-state" ? "logged_in" : null };
  const bindingTriggerByLabel = new Map();
  const bindingSignin = {
    querySelector(selector) {
      for (const [label, node] of bindingTriggerByLabel) {
        if (selector === `[aria-label="${label}"]`) return node;
      }
      return null;
    }
  };
  const bindingLifecycle = {
    active: true,
    generation: 1,
    host: bindingHost,
    rendered: null,
    hostBindingsBound: false,
    statusPanel: null,
    signin: null,
    summaryPanels: null,
    messagePanel: null,
    registerListener(target, type, listener) { target.addEventListener(type, listener); }
  };
  const bindingDynamicGroup = makeBindingNode("item");
  const bindingDynamicTrigger = makeBindingNode();
  const bindingDynamicPanel = makeBindingNode();
  bindingDynamicTrigger.parentNode = bindingDynamicGroup;
  bindingDynamicTrigger.parentElement = bindingDynamicGroup;
  bindingDynamicGroup.parentNode = bindingSignin;
  bindingTriggerByLabel.set("动态", bindingDynamicTrigger);
  bindingLifecycle.dynamicGroup = bindingDynamicGroup;
  bindingLifecycle.dynamicTrigger = bindingDynamicTrigger;
  bindingLifecycle.dynamicPanel = bindingDynamicPanel;
  for (const label of ["收藏", "历史"]) {
    const group = makeBindingNode("item");
    const trigger = makeBindingNode();
    const panel = makeBindingNode();
    trigger.parentNode = group;
    trigger.parentElement = group;
    group.parentNode = bindingSignin;
    bindingTriggerByLabel.set(label, trigger);
    bindingLifecycle[`${label === "收藏" ? "favorite" : "history"}Group`] = group;
    bindingLifecycle[`${label === "收藏" ? "favorite" : "history"}Trigger`] = trigger;
    bindingLifecycle[`${label === "收藏" ? "favorite" : "history"}Panel`] = panel;
  }
  bindingLifecycle.rendered = {
    statusText: {},
    statusPanel: bindingStatusPanel,
    signin: bindingSignin,
    messagePanel: {},
    dynamicPanel: bindingDynamicPanel,
    dynamicTrigger: bindingDynamicTrigger,
    summaryPanels: { message: {}, dynamic: bindingDynamicPanel, favorite: bindingLifecycle.favoritePanel, history: bindingLifecycle.historyPanel },
    livePopover: null,
    liveTrigger: null,
    profilePopover: null,
    profileTrigger: null,
    profileGroup: null,
    logoutButton: null
  };
  bindingContext.globalThis.ExtensionBHomepageRenderer = {
    setMessageData: () => true,
    setDynamicData: () => true,
    setFavoriteData(panel, data) {
      bindingCommitCalls.push([panel, data]);
      return true;
    },
    setHistoryData: () => true
  };
  assert.equal(bindingHarness.bindMountedHostSurfaces(bindingLifecycle), false,
    "detached host does not enter binding phase");
  assert.equal(bindingLifecycle.favoriteTrigger.listenerCount("pointerenter"), 0,
    "detached host receives no summary listeners");
  bindingHost.isConnected = true;
  assert.equal(bindingHarness.bindMountedHostSurfaces(bindingLifecycle), true,
    "connected host enters binding phase once");
  assert.deepEqual(bindingStates.slice(0, 5), [
    ["data-extension-b-auth-state", "logged_in"],
    ["data-extension-b-message-state", "bound"],
    ["data-extension-b-dynamic-state", "bound"],
    ["data-extension-b-favorite-state", "bound"],
    ["data-extension-b-history-state", "bound"]
  ]);
  assert.equal(bindingStates.some(([name, state]) => (
    name === "data-extension-b-dynamic-state" && state === "bind-missing"
  )), false, "mounted dynamic surface does not publish bind-missing");
  const dynamicPointerListeners = bindingLifecycle.dynamicTrigger.listenerCount("pointerenter");
  assert.equal(dynamicPointerListeners, 1, "dynamic trigger binds pointerenter");
  const favoritePointerListeners = bindingLifecycle.favoriteTrigger.listenerCount("pointerenter");
  assert.equal(favoritePointerListeners, 1, "favorite trigger binds pointerenter");
  assert.equal(bindingHarness.bindMountedHostSurfaces(bindingLifecycle), false,
    "repeat ensure does not re-enter completed binding phase");
  assert.equal(bindingLifecycle.favoriteTrigger.listenerCount("pointerenter"), favoritePointerListeners,
    "repeat ensure does not duplicate listeners");
  bindingLifecycle.favoriteTrigger.dispatch("pointerenter");
  await flushMicrotasks();
  assert.equal(bindingCommitCalls.length, 1, "legal favorite payload reaches renderer commit");
  assert.deepEqual(bindingStates.at(-1), ["data-extension-b-favorite-state", "committed"]);

  const missingStates = [];
  const missingLifecycle = {
    ...bindingLifecycle,
    host: { isConnected: true, setAttribute: (name, value) => missingStates.push([name, value]) },
    hostBindingsBound: false,
    rendered: {
      ...bindingLifecycle.rendered,
      signin: { querySelector: () => null },
      summaryPanels: { message: {}, favorite: bindingLifecycle.favoritePanel, history: bindingLifecycle.historyPanel }
    }
  };
  assert.equal(bindingHarness.bindMountedHostSurfaces(missingLifecycle), true,
    "missing-node lifecycle still completes explicit binding pass");
  assert.deepEqual(missingStates.slice(-6), [
    ["data-extension-b-message-state", "bound"],
    ["data-extension-b-dynamic-state", "bound"],
    ["data-extension-b-favorite-state", "bind-missing"],
    ["data-extension-b-history-state", "bind-missing"],
    ["data-extension-b-search-state", "commit-blocked"],
    ["data-extension-b-recommendation-state", "bind-missing"]
  ], "missing trigger publishes finite bind-missing state");

  assert.match(contentSource, /requestPageBridge = \(operation, currentLifecycle = null, batch = null, onPosted = null, mutation = null\)/);
  assert.match(contentSource, /recommendationPrefetch = \{/);
  assert.match(contentSource, /registerAnimationFrame\(openInitialRenderGate\)/);
  assert.match(contentSource, /registerTimeout\(openInitialRenderGate, 150\)/);
  assert.match(contentSource, /requestPageBridge\("AUTH_STATUS", currentLifecycle\)/);
  assert.match(contentSource, /const PROFILE_STATS_OPERATION = "PROFILE_STATS"/);
  assert.match(contentSource, /setStatus\(currentLifecycle, "logged_out", null\);\s+window\.location\.reload\(\);/);
  assert.match(contentSource, /const PROFILE_STATS_RUNTIME_STATES = new Set\(\[/);
  for (const state of ["bound", "guard-blocked", "activation-started", "bridge-wait", "request-posted", "cancelled", "bridge-error", "response-invalid", "commit-blocked", "committed"]) {
    assert.equal(contentSource.includes(`"${state}"`), true, state);
  }
  assert.match(contentSource, /data-extension-b-profile-stats-state/);
  assert.match(contentSource, /setLazyRuntimeState\(operation, currentLifecycle, "bridge-wait"\)/);
  assert.match(contentSource, /setLazyRuntimeState\(operation, currentLifecycle, "request-posted"\)/);
  assert.match(contentSource, /setLazyRuntimeState\(operation, currentLifecycle, "cancelled"\)/);
  assert.match(contentSource, /setLazyRuntimeState\(operation, currentLifecycle, "bridge-error"\)/);
  assert.match(contentSource, /const bindProfileStatsSurface = \(currentLifecycle\) =>/);
  assert.match(contentSource, /requestPageBridge\(PROFILE_STATS_OPERATION, currentLifecycle\)/);
  assert.match(contentSource, /setProfileStats\(panel, data\)/);
  assert.match(contentSource, /isBridgeAuthProfile/);
  assert.match(contentSource, /bridgeOwnKeys\(value\) === "profile\\u001Fstatus"/);
  assert.match(contentSource, /request: \(operation\) => requestPageBridge\(operation, currentLifecycle\)/);
  assert.match(contentSource, /summaryRoot\.querySelector\(\`\[aria-label=\"\$\{surface\.label\}\"\]\`\)/);
  assert.match(contentSource, /currentLifecycle\.summaryPanels && currentLifecycle\.summaryPanels\[surface\.kind\]/);
  assert.match(contentSource, /currentLifecycle\.signin = rendered\.signin/);
  assert.match(contentSource, /currentLifecycle\.summaryPanels = rendered\.summaryPanels/);
  assert.match(contentSource, /currentLifecycle\.profileGroup = rendered\.profileGroup/);
  assert.match(contentSource, /currentLifecycle\.logoutButton = rendered\.logoutButton/);
assert.match(contentSource, /const BUILD_MARKER = "stage-11-banner-import-r21"/);
  assert.match(contentSource, /data-extension-b-auth-state/);
  assert.match(contentSource, /hostBindingsBound/);
  assert.match(contentSource, /host\.isConnected !== true/);
  assert.match(contentSource, /registerListener\(trigger, "pointerenter", activate\)/);
  assert.match(contentSource, /bind-missing/);
  assert.match(contentSource, /currentLifecycle\.statusPanel\.getAttribute\("data-state"\) !== "logged_in"/);
  assert.match(contentSource, /registerListener\(trigger, "mouseenter", activate\)/);
  assert.match(contentSource, /registerListener\(trigger, "focusin", activate\)/);
  assert.match(contentSource, /let activated = false/);
  assert.match(contentSource, /boundStatusPanel\.getAttribute\("data-state"\) !== "logged_in"/);
  assert.match(contentSource, /commit\(surface\.operation, data\)/);
  assert.match(contentSource, /setFavoriteData\(panel, data\)/);
  assert.match(contentSource, /setHistoryData\(panel, data\)/);
  for (const state of ["activation-started", "request-posted", "response-invalid", "commit-failed", "committed"]) {
    assert.match(contentSource, /data-extension-b-\$\{kind\}-state/);
    assert.equal(contentSource.includes(`\"${state}\"`), true, state);
  }
  assert.match(contentSource, /setFavoriteData\(panel, data\) === true/);
  assert.match(contentSource, /setHistoryData\(panel, data\) === true/);
  assert.match(contentSource, /!isRoot\(\)/);
  assert.match(contentSource, /document\.documentElement !== rootIdentity/);
  assert.match(contentSource, /type: "CANCEL"/);
  assert.match(contentSource, /operation: "CANCEL"/);
  assert.match(contentSource, /cancelBridgeRequests\(\)/);
  assert.match(contentSource, /registerCleanup\(\(\) => \{\s*if \(isLazyHoverOperation && !settled\) \{\s*setLazyRuntimeState\(operation, currentLifecycle, "cancelled"\);\s*\}\s*sendCancel\(\);\s*finish\(null, "cancelled", "CANCELLED"\);\s*\}\)/);
  assert.match(contentSource, /currentLifecycle\.statusPanel !== boundStatusPanel/);
  assert.match(contentSource, /LIVE_HOVER_OPERATION/);
  assert.match(contentSource, /bindLiveHoverSurface/);
  assert.match(contentSource, /currentLifecycle\.cancelLiveRequest\(\)/);
  assert.match(contentSource, /currentLifecycle\.registerListener\(group, "mouseenter", activate\)/);
  assert.match(contentSource, /group\.matches\(":hover"\)/);
  assert.match(contentSource, /let activationToken = 0/);
  assert.match(contentSource, /const resetActivation = \(\) => \{\s*activationToken \+= 1;\s*activated = false;/);
  assert.match(contentSource, /const token = activationToken \+= 1/);
  assert.match(contentSource, /if \(token !== activationToken\) return/);
  assert.match(contentSource, /Promise\.resolve\(request\)\.then/);
  assert.match(contentSource, /request = Promise\.resolve\(null\)/);
  assert.match(contentSource, /activated = false/);
  assert.match(contentSource, /registerTimeout\(\(\) =>/);
  assert.match(contentSource, /panel\.__liveRendererLease\.active === true/);
  assert.match(contentSource, /const isLiveCommitReady =/);
  assert.match(contentSource, /if \(!isLiveCommitReady\(\)/);
  assert.match(contentSource, /data-extension-b-live-state/);
  assert.match(contentSource, /preRequestCancelled/);
  assert.match(contentSource, /currentLifecycle\[cancelProperty\] = cancelBeforeReady/);
  assert.match(contentSource, /registerListener\(panel, "pointerenter", activate\)/);
  assert.match(contentSource, /registerListener\(trigger, "pointerenter", activate\)/);
  assert.match(contentSource, /registerListener\(group, "pointerenter", activate\)/);
  assert.match(contentSource, /setLiveHoverData\(panel, data\)/);
  assert.match(contentSource, /currentLifecycle\.generation !== generation/);
  assert.match(contentSource, /registerListener\(document, "DOMContentLoaded"/);
  assert.match(contentSource, /const shadowRoot = host\.attachShadow\(\{ mode: "closed" \}\)/);
  assert.match(contentSource, /rendered = globalThis\.ExtensionBHomepageRenderer\.renderHomepage/);
  assert.match(
    contentSource,
    /catch \(error\) \{\s*document\.documentElement\.setAttribute\(\s*"data-extension-b-render-error",\s*error && typeof error\.name === "string" \? error\.name : "Error"\s*\);\s*host\.remove\(\);\s*return;\s*\}/
  );
  assert.match(contentSource, /currentLifecycle\.host = host/);
  assert.match(rendererSource, /setLiveHoverData/);
  assert.match(rendererSource, /const setLiveHoverData = \(panel, data\) =>/);
  assert.match(rendererSource, /panel\.__liveHoverInteraction = interaction/);
  assert.match(rendererSource, /setLiveHoverData,\s*destroy/);
  assert.match(rendererSource, /globalThis\.ExtensionBHomepageRenderer = Object\.freeze\(\{[\s\S]*setLiveHoverData,/);
  assert.doesNotMatch(rendererSource, /setLiveHoverData: \(panel, data\) =>/);
  assert.match(rendererSource, /setAttribute\("referrerpolicy", "no-referrer"\)/);
  assert.match(rendererSource, /noopener noreferrer/);
  assert.match(rendererSource, /registerTip\.setAttribute\("role", "button"\)/);
  assert.match(rendererSource, /return \{ panel, loginAction, registerAction: registerTip \}/);
  assert.match(rendererSource, /loginActions\.push\(loginButton, loginRights\.loginAction, loginRights\.registerAction\)/);
  assert.match(rendererSource, /if \(loginAction\.tagName !== "BUTTON"\)/);
  assert.match(rendererSource, /event\.key !== "Enter" && event\.key !== " " && event\.key !== "Spacebar"/);
  assert.match(rendererSource, /const findNavigationAnchor = \(start, boundary\) =>/);
  assert.match(rendererSource, /const releaseSurfaceFocus = \(documentObject, surfaces\) =>/);
  assert.match(rendererSource, /addListenerWithCleanup\(view, "pageshow", resetAll, listenerCleanups\)/);
  assert.match(rendererSource, /addListenerWithCleanup\(view, "focus", resetAll, listenerCleanups\)/);
  assert.match(rendererSource, /if \(!pointerExitRequired\.has\(entry\)\) open\(\)/);
  assert.match(rendererSource, /if \(event\.key === "Tab"\) pointerExitRequired\.clear\(\)/);
  assert.match(rendererSource, /addListenerWithCleanup\(view\.menu, "click", \(event\) =>/);
  assert.match(rendererSource, /addListenerWithCleanup\(windowObject, "pageshow", \(event\) =>/);
  assert.match(rendererSource, /addListenerWithCleanup\(windowObject, "focus", \(\) =>/);
  assert.match(rendererSource, /live-avatar-mask/);
  assert.doesNotMatch(rendererSource, /liveStatus/);
  assert.match(contentSource, /requestPageBridge\("DYNAMIC_SUMMARY", currentLifecycle\)/);

  const liveStart = contentSource.indexOf("const bindLiveHoverSurface =");
  const liveEnd = contentSource.indexOf("const isExactFocusResult =", liveStart);
  assert.ok(liveStart >= 0 && liveEnd > liveStart, "live activation source boundary");
  const liveDocument = { documentElement: {} };
  const liveContext = {
    Promise,
    document: liveDocument,
    LIVE_HOVER_OPERATION: "LIVE_HOVER",
    isCurrentLifecycle: (candidate) => candidate === liveLifecycle && candidate.active,
    isExactRoot: () => true,
    isBridgeSummaryData: () => false,
    setLiveRuntimeState: (candidate, state) => {
      candidate.host.setAttribute("data-extension-b-live-state", state);
    },
    requestPageBridge: () => {
      liveRequests += 1;
      return new Promise((resolve) => liveResolves.push(resolve));
    },
    ExtensionBHomepageRenderer: { setLiveHoverData: () => true }
  };
  liveContext.globalThis = liveContext;
  const liveBind = vm.runInNewContext(
    `(() => { ${contentSource.slice(liveStart, liveEnd)}; return bindLiveHoverSurface; })()`,
    liveContext
  );
  const liveListeners = new Map();
  const liveGroup = {
    parentElement: null,
    addEventListener(type, listener) {
      liveListeners.set(`${type}:${liveListeners.size}`, listener);
    },
    contains: () => false,
    matches: () => true
  };
  const liveTrigger = {
    parentElement: liveGroup,
    addEventListener(type, listener) {
      liveListeners.set(`${type}:${liveListeners.size}`, listener);
    },
    matches: () => true
  };
  const livePanel = {
    __liveRendererLease: { active: true },
    addEventListener(type, listener) {
      liveListeners.set(`${type}:${liveListeners.size}`, listener);
    }
  };
  let liveRequests = 0;
  const liveResolves = [];
  let liveCancelCalls = 0;
  const liveStates = [];
  const liveLifecycle = {
    active: true,
    generation: 1,
    host: { isConnected: true, setAttribute: (name, value) => liveStates.push([name, value]) },
    livePopover: livePanel,
    liveTrigger,
    cancelLiveRequest: () => { liveCancelCalls += 1; },
    registerListener(target, type, listener) {
      target.addEventListener(type, listener);
    },
    registerTimeout() {}
  };
  liveBind(liveLifecycle);
  assert.deepEqual(liveStates.at(-1), ["data-extension-b-live-state", "bound"], "live binding publishes non-sensitive state");
  const dispatchLive = (target, type, event = {}) => {
    for (const [key, listener] of liveListeners) {
      if (key.startsWith(`${type}:`)) listener.call(target, event);
    }
  };
  dispatchLive(liveGroup, "mouseenter");
  assert.equal(liveRequests, 1, "live group mouseenter enters the bridge activation path");
  dispatchLive(liveGroup, "mouseleave", { relatedTarget: null });
  assert.equal(liveCancelCalls, 1, "live leave cancels and releases activation");
  assert.deepEqual(liveStates.at(-1), ["data-extension-b-live-state", "cancelled"], "live leave publishes cancellation state");
  dispatchLive(liveGroup, "mouseenter");
  assert.equal(liveRequests, 2, "live activation retries after cancellation");
  liveResolves[0](null);
  await flushMicrotasks();
  assert.equal(liveRequests, 2, "stale null completion cannot block the new live activation");
  liveResolves[1](null);
  await flushMicrotasks();
  dispatchLive(liveGroup, "mouseenter");
  assert.equal(liveRequests, 3, "null result releases live activation for the next hover");

  const messageRequestStart = contentSource.indexOf("  const resetMessageSummary =");
  const messageRequestEnd = contentSource.indexOf("  const setStatus =", messageRequestStart);
  const messageRefreshStart = contentSource.indexOf("  const bindMessageRefreshLifecycle =");
  const messageRefreshEnd = contentSource.indexOf("  const createSummaryActivationGate =", messageRefreshStart);
  assert.ok(messageRequestStart >= 0 && messageRequestEnd > messageRequestStart, "message request source boundary");
  assert.ok(messageRefreshStart >= 0 && messageRefreshEnd > messageRefreshStart, "message refresh source boundary");
  assert.doesNotMatch(contentSource.slice(messageRequestStart, messageRequestEnd), /messageDataLoaded\)\s*\{/,
    "committed message data does not block a later refresh");
  for (const source of [
    'registerListener(window, "pageshow", refresh)',
    'registerListener(document, "visibilitychange", () =>',
    'registerListener(window, "focus", refresh)',
    'querySelector(`[aria-label="消息"]`)',
    'registerListener(target, "pointerenter", activate)',
    'registerListener(target, "focusin", activate)'
  ]) {
    assert.equal(contentSource.includes(source), true, `message refresh source includes ${source}`);
  }
  const makeMessageEventTarget = () => {
    const listeners = new Map();
    return {
      addEventListener(type, listener) {
        const values = listeners.get(type) || [];
        values.push(listener);
        listeners.set(type, values);
      },
      dispatch(type) {
        for (const listener of listeners.get(type) || []) listener({ type });
      }
    };
  };
  const messageWindow = makeMessageEventTarget();
  const messageDocument = makeMessageEventTarget();
  messageDocument.documentElement = {};
  messageDocument.visibilityState = "hidden";
  const messagePending = [];
  const messageBadgeAttributes = new Map();
  const messageBadge = {
    setAttribute(name, value) { messageBadgeAttributes.set(name, String(value)); },
    removeAttribute(name) { messageBadgeAttributes.delete(name); },
    getAttribute(name) { return messageBadgeAttributes.get(name) || null; }
  };
  const messagePanel = { badge: messageBadge };
  const messageTrigger = makeMessageEventTarget();
  messageTrigger.parentNode = null;
  messageTrigger.parentElement = null;
  const messageGroup = makeMessageEventTarget();
  messageGroup.parentNode = null;
  messageGroup.parentElement = null;
  messageTrigger.parentNode = messageGroup;
  messageTrigger.parentElement = messageGroup;
  messageGroup.contains = () => true;
  messageGroup.classList = { contains: (name) => name === "item" };
  messageTrigger.classList = { contains: () => false };
  const messageSignin = {
    querySelector(selector) {
      return selector === '[aria-label="消息"]' ? messageTrigger : null;
    }
  };
  const messageStates = [];
  const messageLifecycle = {
    active: true,
    generation: 1,
    messageGeneration: 0,
    messageRequested: false,
    messageDataLoaded: false,
    messagePanel,
    statusPanel: { getAttribute: (name) => name === "data-state" ? "logged_in" : null },
    signin: messageSignin,
    host: { isConnected: true, setAttribute: (name, value) => messageStates.push([name, value]) },
    registerListener(target, type, listener) { target.addEventListener(type, listener); }
  };
  let messageRequests = 0;
  const messageContext = {
    Array,
    Promise,
    document: messageDocument,
    window: messageWindow,
    globalThis: null,
    isCurrentLifecycle: (candidate) => candidate === messageLifecycle && candidate.active,
    isExactRoot: () => true,
    setSummaryRuntimeState: (candidate, kind, state) => {
      candidate.host.setAttribute(`data-extension-b-${kind}-state`, state);
    },
    isBridgeSummaryData: (operation, data) => operation === "MESSAGE_SUMMARY"
      && data && typeof data === "object"
      && Number.isInteger(data.reply) && Number.isInteger(data.at)
      && Number.isInteger(data.like) && Number.isInteger(data.sysMsg)
      && Number.isInteger(data.sessionUnread),
    requestPageBridge: (operation) => {
      assert.equal(operation, "MESSAGE_SUMMARY");
      messageRequests += 1;
      return new Promise((resolve) => messagePending.push(resolve));
    },
    ExtensionBHomepageRenderer: {
      setMessageData(panel, data) {
        const total = data.reply + data.at + data.like + data.sysMsg + data.sessionUnread;
        if (total > 0) panel.badge.removeAttribute("hidden");
        else panel.badge.setAttribute("hidden", "true");
        return true;
      }
    }
  };
  messageContext.globalThis = messageContext;
  const messageHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(messageRequestStart, messageRequestEnd)}
      ${contentSource.slice(messageRefreshStart, messageRefreshEnd)}
      return { requestMessageSummary, bindMessageRefreshLifecycle, bindMessageSummarySurface };
    })()`,
    messageContext
  );
  messageHarness.bindMessageRefreshLifecycle(messageLifecycle);
  messageHarness.bindMessageSummarySurface(messageLifecycle);
  messageHarness.requestMessageSummary(messageLifecycle);
  assert.equal(messageRequests, 1, "initial message summary request is posted");
  messagePending.shift()({ reply: 1, at: 0, like: 2, sysMsg: 0, sessionUnread: 0 });
  await flushMicrotasks();
  assert.equal(messageBadge.getAttribute("hidden"), null, "initial non-zero summary shows DOM badge");
  messageWindow.dispatch("pageshow");
  messageDocument.visibilityState = "visible";
  messageDocument.dispatch("visibilitychange");
  messageWindow.dispatch("focus");
  messageTrigger.dispatch("mouseenter");
  messageTrigger.dispatch("pointerenter");
  messageTrigger.dispatch("focusin");
  messageGroup.dispatch("mouseenter");
  messageGroup.dispatch("pointerenter");
  messageGroup.dispatch("focusin");
  assert.equal(messageRequests, 2, "return and message activation events share one in-flight refresh");
  messagePending.shift()({ reply: 0, at: 0, like: 0, sysMsg: 0, sessionUnread: 0 });
  await flushMicrotasks();
  assert.equal(messageBadge.getAttribute("hidden"), "true", "zero refresh commits hidden DOM badge");
  assert.deepEqual(messageStates.at(-1), ["data-extension-b-message-state", "committed"]);

  const dynamicRequestStart = contentSource.indexOf("  const resetDynamicSummary =");
  const dynamicRequestEnd = contentSource.indexOf("  const setStatus =", dynamicRequestStart);
  const dynamicRefreshStart = contentSource.indexOf("  const bindDynamicRefreshLifecycle =");
  const dynamicRefreshEnd = contentSource.indexOf("  const createSummaryActivationGate =", dynamicRefreshStart);
  assert.ok(dynamicRequestStart >= 0 && dynamicRequestEnd > dynamicRequestStart, "dynamic request source boundary");
  assert.ok(dynamicRefreshStart >= 0 && dynamicRefreshEnd > dynamicRefreshStart, "dynamic refresh source boundary");
  const dynamicWindow = makeMessageEventTarget();
  const dynamicDocument = makeMessageEventTarget();
  dynamicDocument.documentElement = {};
  dynamicDocument.visibilityState = "hidden";
  const dynamicPending = [];
  const dynamicBadgeAttributes = new Map([["hidden", "true"]]);
  const dynamicBadge = {
    textContent: "",
    setAttribute(name, value) { dynamicBadgeAttributes.set(name, String(value)); },
    removeAttribute(name) { dynamicBadgeAttributes.delete(name); },
    getAttribute(name) { return dynamicBadgeAttributes.get(name) || null; }
  };
  const dynamicPanel = { __dynamicView: { triggerBadge: dynamicBadge } };
  const dynamicTrigger = makeMessageEventTarget();
  const dynamicGroup = makeMessageEventTarget();
  dynamicTrigger.parentNode = dynamicGroup;
  dynamicTrigger.parentElement = dynamicGroup;
  dynamicGroup.parentNode = null;
  dynamicGroup.parentElement = null;
  dynamicGroup.contains = () => true;
  dynamicGroup.classList = { contains: (name) => name === "item" };
  dynamicTrigger.classList = { contains: () => false };
  const dynamicStates = [];
  const dynamicLifecycle = {
    active: true,
    generation: 1,
    dynamicGeneration: 0,
    dynamicRequested: false,
    dynamicDataLoaded: false,
    dynamicLastGood: null,
    dynamicPanel,
    dynamicTrigger,
    statusPanel: { getAttribute: (name) => name === "data-state" ? "logged_in" : null },
    signin: { querySelector: (selector) => selector === '[aria-label="动态"]' ? dynamicTrigger : null },
    host: { isConnected: true, setAttribute: (name, value) => dynamicStates.push([name, value]) },
    registerListener(target, type, listener) { target.addEventListener(type, listener); }
  };
  let dynamicRequests = 0;
  const dynamicContext = {
    Array,
    Promise,
    document: dynamicDocument,
    window: dynamicWindow,
    globalThis: null,
    isCurrentLifecycle: (candidate) => candidate === dynamicLifecycle && candidate.active,
    isExactRoot: () => true,
    setSummaryRuntimeState: (candidate, kind, state) => {
      candidate.host.setAttribute(`data-extension-b-${kind}-state`, state);
    },
    isBridgeSummaryData: (operation, data) => operation === "DYNAMIC_SUMMARY"
      && data && typeof data === "object"
      && Object.keys(data).sort().join("\u001F") === "count"
      && Number.isSafeInteger(data.count)
      && data.count >= 0,
    requestPageBridge: (operation) => {
      assert.equal(operation, "DYNAMIC_SUMMARY");
      dynamicRequests += 1;
      return new Promise((resolve) => dynamicPending.push(resolve));
    },
    ExtensionBHomepageRenderer: {
      setDynamicData(panel, data) {
        if (data === null) {
          panel.__dynamicView.triggerBadge.textContent = "";
          panel.__dynamicView.triggerBadge.setAttribute("hidden", "true");
          return true;
        }
        panel.__dynamicView.triggerBadge.textContent = data.count >= 99 ? "99+" : String(data.count);
        if (data.count > 0) panel.__dynamicView.triggerBadge.removeAttribute("hidden");
        else panel.__dynamicView.triggerBadge.setAttribute("hidden", "true");
        return true;
      }
    }
  };
  dynamicContext.globalThis = dynamicContext;
  const dynamicHarness = vm.runInNewContext(
    `(() => { ${contentSource.slice(dynamicRequestStart, dynamicRequestEnd)}
      ${contentSource.slice(dynamicRefreshStart, dynamicRefreshEnd)}
      return { resetDynamicSummary, requestDynamicSummary, bindDynamicRefreshLifecycle, bindDynamicSummarySurface };
    })()`,
    dynamicContext
  );
  dynamicHarness.bindDynamicRefreshLifecycle(dynamicLifecycle);
  dynamicHarness.bindDynamicSummarySurface(dynamicLifecycle);
  dynamicHarness.requestDynamicSummary(dynamicLifecycle);
  dynamicWindow.dispatch("pageshow");
  dynamicDocument.visibilityState = "visible";
  dynamicDocument.dispatch("visibilitychange");
  dynamicWindow.dispatch("focus");
  dynamicTrigger.dispatch("mouseenter");
  dynamicTrigger.dispatch("pointerenter");
  dynamicTrigger.dispatch("focusin");
  dynamicGroup.dispatch("mouseenter");
  dynamicGroup.dispatch("pointerenter");
  dynamicGroup.dispatch("focusin");
  assert.equal(dynamicRequests, 1, "dynamic refresh events share one in-flight request");
  dynamicPending.shift()({ count: 7 });
  await flushMicrotasks();
  assert.equal(dynamicLifecycle.dynamicLastGood.count, 7);
  assert.equal(dynamicBadge.textContent, "7");
  assert.deepEqual(dynamicStates.at(-1), ["data-extension-b-dynamic-state", "committed"]);
  dynamicHarness.requestDynamicSummary(dynamicLifecycle);
  assert.equal(dynamicRequests, 2);
  dynamicPending.shift()({ count: "bad" });
  await flushMicrotasks();
  assert.equal(dynamicBadge.textContent, "7", "invalid refresh preserves last-good badge");
  dynamicHarness.resetDynamicSummary(dynamicLifecycle);
  assert.equal(dynamicLifecycle.dynamicLastGood, null, "logged-out reset clears last-good");
  assert.equal(dynamicBadge.getAttribute("hidden"), "true", "logged-out reset clears badge DOM");
  console.log("PASS authenticated bridge contract");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
