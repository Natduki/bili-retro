(function installExtensionBPageBridge(global) {
  "use strict";

  const CHANNEL = "EXTENSION_B_PAGE_BRIDGE";
  const VERSION = "V1";
  const ORIGIN = "https://www.bilibili.com";
  // MODEL_CONFIG_UNVERIFIED: bridge routes and projections are intentionally fixed to the observed auth contract.
  const REQUEST_ID_LENGTH = 32;
  const BANNER_CURRENT_OPERATION = "BANNER_CURRENT";
  const REQUEST_TIMEOUT_MS = 4000;
  const RANKING_REQUEST_TIMEOUT_MS = 12000;
  const RANKING_SESSION_TIMEOUT_MS = 4500;
  const RANKING_SESSION_RETRY_DELAY_MS = 600;
  const RANKING_REQUEST_GAP_MS = 180;
  const RANKING_REFERRER = "https://www.bilibili.com/v/popular/rank/douga";
  const MAX_RESPONSE_TEXT_LENGTH = 65536;
  const MAX_DOUGA_RANK_RESPONSE_TEXT_LENGTH = 196608;
  const MAX_ORDINARY_RANK_RESPONSE_TEXT_LENGTH = 196608;
  const MAX_READ_RECOMMEND_RESPONSE_TEXT_LENGTH = 262144;
  const MAX_READ_RANK_RESPONSE_TEXT_LENGTH = 524288;
  const WBI_MIXIN_KEY_ENC_TAB = Object.freeze([
    46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,
    37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52
  ]);
  const RANKING_TICKET_HMAC_KEY = "XgwSnGZ1p";
  const MINI_LOGIN_SCRIPT_URL = "https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login-v2/miniLogin.umd.min.js";
  const OPERATIONS = Object.freeze([
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
    BANNER_CURRENT_OPERATION,
    "RECOMMENDATION_FEED",
    "DOUGA_FLOOR",
    "ORDINARY_ZONE_FLOOR",
    "READ_FLOOR",
    "LIVE_FLOOR_INITIAL",
    "LIVE_FLOOR_MORE",
    "LIVE_FLOOR_FOLLOWING",
    "WATCH_LATER_MUTATE"
  ]);
  const SEARCH_OPERATION = "SEARCH_SUGGEST";
  const SEARCH_FALLBACK_KEYWORD = "哔哩哔哩";
  const CANCEL_OPERATION = "CANCEL";
  const ERROR_KINDS = Object.freeze({
    UNSUPPORTED: "OPERATION_UNAVAILABLE",
    UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
    SCHEMA: "SCHEMA_INVALID",
    TIMEOUT: "TIMEOUT"
  });
  const OPERATION_ROUTES = Object.freeze({
    AUTH_STATUS: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/nav",
        method: "GET"
      })
    ]),
    LOGOUT: Object.freeze([
      Object.freeze({
        host: "passport.bilibili.com",
        path: "/login/exit/v2",
        method: "POST"
      })
    ]),
    PROFILE_STATS: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/nav/stat",
        method: "GET"
      })
    ]),
    MESSAGE_SUMMARY: Object.freeze([
      Object.freeze({
        host: "api.vc.bilibili.com",
        path: "/x/im/web/msgfeed/unread?build=0&mobi_app=web&web_location=333.40138",
        method: "GET"
      }),
      Object.freeze({
        host: "api.vc.bilibili.com",
        path: "/session_svr/v1/session_svr/single_unread?unread_type=0&build=0&mobi_app=web&web_location=333.40138",
        method: "GET"
      })
    ]),
    DYNAMIC_SUMMARY: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/dynamic/entrance?alltype_offset=0&video_offset=0&article_offset=0",
        method: "GET"
      })
    ]),
    FAVORITE_SUMMARY: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/v3/fav/folder/list4navigate",
        method: "GET"
      }),
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/v2/history/toview/web",
        method: "GET"
      })
    ]),
    HISTORY_SUMMARY: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/history/cursor?ps=20&type=archive&web_location=333.40138",
        method: "GET"
      }),
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/history/cursor?ps=20&type=live&web_location=333.40138",
        method: "GET"
      }),
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/history/cursor?ps=20&type=article&web_location=333.40138",
        method: "GET"
      })
    ]),
    LIVE_HOVER: Object.freeze([
      Object.freeze({
        host: "api.live.bilibili.com",
        path: "/xlive/web-interface/v1/index/RoomForWebMainHover",
        method: "GET"
      })
    ]),
    PRIMARY_MENU_COUNTS: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/online",
        method: "GET"
      })
    ]),
    BANNER_CURRENT: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-show/page/header/v2?category=0",
        method: "GET"
      })
    ]),
    RECOMMENDATION_FEED: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/wbi/index/top/rcmd",
        method: "GET"
      })
    ]),
    DOUGA_FLOOR: Object.freeze([
      Object.freeze({ host: "api.bilibili.com", path: "/x/web-interface/region/feed/rcmd", method: "GET" }),
      Object.freeze({ host: "api.bilibili.com", path: "/x/web-interface/ranking/v2", method: "GET" })
    ]),
    ORDINARY_ZONE_FLOOR: Object.freeze({
      music: Object.freeze({ rid: 3, list: "regionFeed", feedRegion: 1003, rank: Object.freeze({ kind: "video", rid: 1003 }), title: "音乐", label: "music", nav: "https://www.bilibili.com/c/music/", rankNav: "https://www.bilibili.com/v/popular/rank/music" }),
      dance: Object.freeze({ rid: 129, list: "regionFeed", feedRegion: 1004, rank: Object.freeze({ kind: "video", rid: 1004 }), title: "舞蹈", label: "dance", nav: "https://www.bilibili.com/c/dance/", rankNav: "https://www.bilibili.com/v/popular/rank/dance" }),
      game: Object.freeze({ rid: 4, list: "regionFeed", feedRegion: 1008, rank: Object.freeze({ kind: "video", rid: 1008 }), title: "游戏", label: "game", nav: "https://www.bilibili.com/c/game/", rankNav: "https://www.bilibili.com/v/popular/rank/game" }),
      knowledge: Object.freeze({ rid: 36, list: "regionFeed", feedRegion: 1010, rank: Object.freeze({ kind: "video", rid: 1010 }), title: "知识", label: "knowledge", nav: "https://www.bilibili.com/c/knowledge/", rankNav: "https://www.bilibili.com/v/popular/rank/knowledge" }),
      course: Object.freeze({ rid: 0, list: "cheese", rank: Object.freeze({ kind: "cheese" }), title: "课堂", label: "course", nav: "https://www.bilibili.com/cheese/", rankNav: "https://www.bilibili.com/cheese/pages/ranklist" }),
      tech: Object.freeze({ rid: 188, list: "regionFeed", feedRegion: 1012, rank: Object.freeze({ kind: "video", rid: 1012 }), title: "科技", label: "tech", nav: "https://www.bilibili.com/c/tech/", rankNav: "https://www.bilibili.com/v/popular/rank/tech" }),
      sports: Object.freeze({ rid: 234, list: "regionFeed", feedRegion: 1018, rank: Object.freeze({ kind: "video", rid: 1018 }), title: "运动", label: "sports", nav: "https://www.bilibili.com/c/sports/", rankNav: "https://www.bilibili.com/v/popular/rank/sports" }),
      car: Object.freeze({ rid: 223, list: "regionFeed", feedRegion: 1013, rank: Object.freeze({ kind: "video", rid: 1013 }), title: "汽车", label: "car", nav: "https://www.bilibili.com/c/car/", rankNav: "https://www.bilibili.com/v/popular/rank/car" }),
      life: Object.freeze({ rid: 160, list: "regionFeed", feedRegion: 1009, rank: null, title: "生活", label: "life", nav: "https://www.bilibili.com/c/life/", rankNav: "https://www.bilibili.com/v/popular/rank/life" }),
      food: Object.freeze({ rid: 211, list: "regionFeed", feedRegion: 1020, rank: Object.freeze({ kind: "video", rid: 1020 }), title: "美食", label: "food", nav: "https://www.bilibili.com/c/food/", rankNav: "https://www.bilibili.com/v/popular/rank/food" }),
      animal: Object.freeze({ rid: 217, list: "regionFeed", feedRegion: 1024, rank: Object.freeze({ kind: "video", rid: 1024 }), title: "动物圈", label: "animal", nav: "https://www.bilibili.com/c/animal/", rankNav: "https://www.bilibili.com/v/popular/rank/animal" }),
      kichiku: Object.freeze({ rid: 119, list: "regionFeed", feedRegion: 1007, rank: Object.freeze({ kind: "video", rid: 1007 }), title: "鬼畜", label: "kichiku", nav: "https://www.bilibili.com/c/kichiku/", rankNav: "https://www.bilibili.com/v/popular/rank/kichiku" }),
      fashion: Object.freeze({ rid: 155, list: "regionFeed", feedRegion: 1014, rank: Object.freeze({ kind: "video", rid: 1014 }), title: "时尚", label: "fashion", nav: "https://www.bilibili.com/c/fashion/", rankNav: "https://www.bilibili.com/v/popular/rank/fashion" }),
      information: Object.freeze({ rid: 202, list: "regionFeed", feedRegion: 1011, rank: null, title: "资讯", label: "information", nav: "https://www.bilibili.com/c/information/", rankNav: "https://www.bilibili.com/v/popular/rank/information" }),
      ent: Object.freeze({ rid: 5, list: "regionFeed", feedRegion: 1002, rank: Object.freeze({ kind: "video", rid: 1002 }), title: "娱乐", label: "ent", nav: "https://www.bilibili.com/c/ent/", rankNav: "https://www.bilibili.com/v/popular/rank/ent" }),
      movie: Object.freeze({ rid: 23, list: "pgcFeed", feedName: "movie", seasonType: 2, rank: Object.freeze({ kind: "pgc", seasonType: 2 }), title: "电影", label: "movie", nav: "https://www.bilibili.com/movie/", rankNav: "https://www.bilibili.com/v/popular/rank/movie" }),
      teleplay: Object.freeze({ rid: 11, list: "pgcFeed", feedName: "tv", seasonType: 5, rank: Object.freeze({ kind: "pgc", seasonType: 5 }), title: "电视剧", label: "teleplay", nav: "https://www.bilibili.com/tv/?spm_id_from=333.1007.0.0", rankNav: "https://www.bilibili.com/v/popular/rank/tv" }),
      cinephile: Object.freeze({ rid: 181, list: "regionFeed", feedRegion: 1001, rank: Object.freeze({ kind: "video", rid: 1001 }), title: "影视", label: "cinephile", nav: "https://www.bilibili.com/c/cinephile/", rankNav: "https://www.bilibili.com/v/popular/rank/cinephile" }),
      documentary: Object.freeze({ rid: 177, list: "pgcFeed", feedName: "documentary", seasonType: 3, rank: Object.freeze({ kind: "pgc", seasonType: 3 }), title: "纪录片", label: "documentary", nav: "https://www.bilibili.com/documentary/", rankNav: "https://www.bilibili.com/v/popular/rank/documentary" })
    }),
    READ_FLOOR: Object.freeze([
      Object.freeze({ host: "api.bilibili.com", path: "/x/article/recommends?ps=50", method: "GET" }),
      Object.freeze({ host: "api.bilibili.com", path: "/x/article/rank/list?cid=3", method: "GET" })
    ]),
    LIVE_FLOOR_INITIAL: Object.freeze([
      Object.freeze({ host: "api.live.bilibili.com", path: "/xlive/web-interface/v1/webMain/getList?platform=web", method: "GET" })
    ]),
    LIVE_FLOOR_MORE: Object.freeze([
      Object.freeze({ host: "api.live.bilibili.com", path: "/xlive/web-interface/v1/webMain/getMoreRecList?platform=web", method: "GET" })
    ]),
    LIVE_FLOOR_FOLLOWING: Object.freeze([
      Object.freeze({ host: "api.live.bilibili.com", path: "/relation/v1/feed/feed_list?pagesize=12&page=1", method: "GET" })
    ]),
    WATCH_LATER_MUTATE: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/v2/history/toview/add",
        method: "POST"
      }),
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/v2/history/toview/del",
        method: "POST"
      })
    ]),
    SEARCH_SUGGEST: Object.freeze([
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/wbi/search/default",
        method: "GET"
      }),
      Object.freeze({
        host: "api.bilibili.com",
        path: "/x/web-interface/wbi/search/square?limit=10&platform=web",
        method: "GET"
      })
    ])
  });
  // link_setting is intentionally excluded: V1 MESSAGE_SUMMARY is defined by the two unread routes above.
  const MESSAGE_SUMMARY_EXCLUDED_ROUTES = Object.freeze([
    "https://api.vc.bilibili.com/link_setting/v1/link_setting/get"
  ]);
  const FAVORITE_DETAIL_ROUTE = Object.freeze({
    host: "api.bilibili.com",
    path: "/x/v3/fav/resource/list4navigate",
    method: "GET"
  });
  const RANKING_TICKET_ROUTE = Object.freeze({ host: "api.bilibili.com", path: "/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket", method: "POST" });
  const RANKING_NAV_ROUTE = Object.freeze({ host: "api.bilibili.com", path: "/x/web-interface/nav", method: "GET" });
  const pending = new Map();
  let miniLoginScriptPromise = null;
  let miniLoginInstance = null;
  let rankingSession = null;
  let rankingSessionPromise = null;
  let rankingRequestTail = Promise.resolve();

  if (global.__EXTENSION_B_PAGE_BRIDGE_INSTALLED__ === true) return;
  global.__EXTENSION_B_PAGE_BRIDGE_INSTALLED__ = true;

  const ownKeys = (value) => Object.keys(value).sort().join("\u001F");
  const isPlainObject = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
  const isRequestId = (value) => typeof value === "string"
    && value.length === REQUEST_ID_LENGTH
    && /^[0-9a-f]+$/.test(value);
  const isKnownOperation = (value) => OPERATIONS.includes(value) || value === SEARCH_OPERATION;
  const ORDINARY_ZONE_TYPES = Object.freeze(Object.keys(OPERATION_ROUTES.ORDINARY_ZONE_FLOOR));
  const isOrdinaryZoneType = (value) => ORDINARY_ZONE_TYPES.includes(value);
  const isRequest = (value) => {
    if (isPlainObject(value)
      && value.operation === "ORDINARY_ZONE_FLOOR") {
      return ownKeys(value) === "batch\u001Fchannel\u001FincludeRank\u001Foperation\u001FrequestId\u001Ftype\u001Fversion\u001FzoneType"
        && value.channel === CHANNEL
        && value.version === VERSION
        && value.type === "REQUEST"
        && isRequestId(value.requestId)
        && isOrdinaryZoneType(value.zoneType)
        && typeof value.includeRank === "boolean"
        && Number.isSafeInteger(value.batch)
        && value.batch >= 0
        && value.batch <= 49;
    }
    if (!isPlainObject(value)
      || value.channel !== CHANNEL
      || value.version !== VERSION
      || value.type !== "REQUEST"
      || !isRequestId(value.requestId)
      || !isKnownOperation(value.operation)) return false;
    if (value.operation === "DOUGA_FLOOR") {
      return ownKeys(value) === "batch\u001Fchannel\u001FincludeRank\u001Foperation\u001FrequestId\u001Ftype\u001Fversion"
        && typeof value.includeRank === "boolean"
        && Number.isSafeInteger(value.batch)
        && value.batch >= 0
        && value.batch <= 10000;
    }
    if (value.operation === "RECOMMENDATION_FEED" || value.operation === "READ_FLOOR") {
      return ownKeys(value) === "batch\u001Fchannel\u001Foperation\u001FrequestId\u001Ftype\u001Fversion"
        && Number.isSafeInteger(value.batch)
        && value.batch >= 0
        && value.batch <= 10000;
    }
    if (value.operation === "WATCH_LATER_MUTATE") {
      return ownKeys(value) === "action\u001Faid\u001Fchannel\u001Foperation\u001FrequestId\u001Ftype\u001Fversion"
        && (value.action === "add" || value.action === "remove")
        && Number.isSafeInteger(value.aid)
        && value.aid > 0
        && value.aid <= Number.MAX_SAFE_INTEGER;
    }
    return ownKeys(value) === "channel\u001Foperation\u001FrequestId\u001Ftype\u001Fversion";
  };

  const loadMiniLoginScript = () => {
    if (typeof global.MiniLogin === "function") return Promise.resolve();
    if (miniLoginScriptPromise) return miniLoginScriptPromise;
    miniLoginScriptPromise = new Promise((resolve, reject) => {
      const existing = global.document.querySelector(`script[src="${MINI_LOGIN_SCRIPT_URL}"]`);
      const script = existing || global.document.createElement("script");
      const cleanup = () => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      };
      const onLoad = () => {
        cleanup();
        if (typeof global.MiniLogin === "function") {
          resolve();
        } else {
          miniLoginScriptPromise = null;
          reject(new Error("schema"));
        }
      };
      const onError = () => {
        cleanup();
        miniLoginScriptPromise = null;
        reject(new Error("unavailable"));
      };
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      if (!existing) {
        script.src = MINI_LOGIN_SCRIPT_URL;
        script.async = true;
        (global.document.head || global.document.documentElement).appendChild(script);
      }
    });
    return miniLoginScriptPromise;
  };

  const showMiniLogin = async () => {
    await loadMiniLoginScript();
    if (!miniLoginInstance) {
      miniLoginInstance = new global.MiniLogin({
        origin: "navUserCenterLogin",
        isDefaultPasswordLogin: true
      });
      if (!miniLoginInstance || typeof miniLoginInstance.showComponent !== "function") {
        miniLoginInstance = null;
        throw new Error("schema");
      }
      if (typeof miniLoginInstance.addEventListener === "function") {
        miniLoginInstance.addEventListener("success", () => {
          global.location.reload();
        });
      }
    }
    const spmPrefix = global.document.querySelector('meta[name="spm_prefix"]')?.content || "";
    miniLoginInstance.showComponent({
      spm_id_from: spmPrefix ? `${spmPrefix}.top_right_bar.login.click` : ""
    });
    return Object.freeze({ shown: true });
  };
  const isCancel = (value) => isPlainObject(value)
    && ownKeys(value) === "channel\u001Foperation\u001FrequestId\u001Ftype\u001Fversion"
    && value.channel === CHANNEL
    && value.version === VERSION
    && value.type === "CANCEL"
    && value.operation === CANCEL_OPERATION
    && isRequestId(value.requestId);
  const postResponse = (request, ok, payload) => {
    const base = {
      channel: CHANNEL,
      version: VERSION,
      type: "RESPONSE",
      requestId: request.requestId,
      operation: request.operation,
      ok
    };
    global.postMessage(
      ok
        ? { ...base, data: payload }
        : { ...base, error: { kind: payload } },
      ORIGIN
    );
  };
  const fixedUrl = (route) => `https://${route.host}${route.path}`;
  const readJson = async (responseObject, maximumLength = MAX_RESPONSE_TEXT_LENGTH) => {
    if (!responseObject || responseObject.ok !== true || responseObject.redirected === true) {
      throw new Error("upstream");
    }
    const text = await responseObject.text();
    if (text.length > maximumLength) throw new Error("cap");
    return JSON.parse(text);
  };
  const fetchFixed = async (route, signal, maximumLength = MAX_RESPONSE_TEXT_LENGTH) => readJson(await global.fetch(fixedUrl(route), {
    method: route.method,
    credentials: "include",
    cache: "no-store",
    redirect: "error",
    signal
  }), maximumLength);
  const fetchRankingFixed = async (route, signal) => readJson(await global.fetch(fixedUrl(route), {
    method: route.method,
    credentials: "include",
    cache: "no-store",
    redirect: "error",
    referrer: RANKING_REFERRER,
    referrerPolicy: "unsafe-url",
    signal
  }), MAX_ORDINARY_RANK_RESPONSE_TEXT_LENGTH);
  const fetchPublicFixed = async (route, signal) => readJson(await global.fetch(fixedUrl(route), {
    method: "GET",
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    signal
  }));
  const fetchRankingTicketFixed = async (route, signal) => readJson(await global.fetch(fixedUrl(route), {
    method: "POST",
    credentials: "omit",
    cache: "no-store",
    redirect: "error",
    referrer: RANKING_REFERRER,
    referrerPolicy: "unsafe-url",
    signal
  }));
  const md5Add = (left, right) => {
    const low = (left & 0xffff) + (right & 0xffff);
    return ((((left >>> 16) + (right >>> 16) + (low >>> 16)) & 0xffff) << 16) | (low & 0xffff);
  };
  const md5Cmn = (q, a, b, x, s, t) => {
    const value = md5Add(md5Add(a, q), md5Add(x, t));
    return md5Add((value << s) | (value >>> (32 - s)), b);
  };
  const md5Ff = (a,b,c,d,x,s,t) => md5Cmn((b & c) | ((~b) & d),a,b,x,s,t);
  const md5Gg = (a,b,c,d,x,s,t) => md5Cmn((b & d) | (c & (~d)),a,b,x,s,t);
  const md5Hh = (a,b,c,d,x,s,t) => md5Cmn(b ^ c ^ d,a,b,x,s,t);
  const md5Ii = (a,b,c,d,x,s,t) => md5Cmn(c ^ (b | (~d)),a,b,x,s,t);
  const md5Hex = (input) => {
    const bytes = new TextEncoder().encode(input);
    const words = new Int32Array((((bytes.length + 8) >>> 6) + 1) * 16);
    for (let index = 0; index < bytes.length; index += 1) words[index >> 2] |= bytes[index] << ((index % 4) * 8);
    words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
    words[words.length - 2] = bytes.length * 8;
    let a=1732584193,b=-271733879,c=-1732584194,d=271733878;
    for (let i=0;i<words.length;i+=16) {
      const oa=a,ob=b,oc=c,od=d;
      a=md5Ff(a,b,c,d,words[i],7,-680876936);d=md5Ff(d,a,b,c,words[i+1],12,-389564586);c=md5Ff(c,d,a,b,words[i+2],17,606105819);b=md5Ff(b,c,d,a,words[i+3],22,-1044525330);
      a=md5Ff(a,b,c,d,words[i+4],7,-176418897);d=md5Ff(d,a,b,c,words[i+5],12,1200080426);c=md5Ff(c,d,a,b,words[i+6],17,-1473231341);b=md5Ff(b,c,d,a,words[i+7],22,-45705983);
      a=md5Ff(a,b,c,d,words[i+8],7,1770035416);d=md5Ff(d,a,b,c,words[i+9],12,-1958414417);c=md5Ff(c,d,a,b,words[i+10],17,-42063);b=md5Ff(b,c,d,a,words[i+11],22,-1990404162);
      a=md5Ff(a,b,c,d,words[i+12],7,1804603682);d=md5Ff(d,a,b,c,words[i+13],12,-40341101);c=md5Ff(c,d,a,b,words[i+14],17,-1502002290);b=md5Ff(b,c,d,a,words[i+15],22,1236535329);
      a=md5Gg(a,b,c,d,words[i+1],5,-165796510);d=md5Gg(d,a,b,c,words[i+6],9,-1069501632);c=md5Gg(c,d,a,b,words[i+11],14,643717713);b=md5Gg(b,c,d,a,words[i],20,-373897302);
      a=md5Gg(a,b,c,d,words[i+5],5,-701558691);d=md5Gg(d,a,b,c,words[i+10],9,38016083);c=md5Gg(c,d,a,b,words[i+15],14,-660478335);b=md5Gg(b,c,d,a,words[i+4],20,-405537848);
      a=md5Gg(a,b,c,d,words[i+9],5,568446438);d=md5Gg(d,a,b,c,words[i+14],9,-1019803690);c=md5Gg(c,d,a,b,words[i+3],14,-187363961);b=md5Gg(b,c,d,a,words[i+8],20,1163531501);
      a=md5Gg(a,b,c,d,words[i+13],5,-1444681467);d=md5Gg(d,a,b,c,words[i+2],9,-51403784);c=md5Gg(c,d,a,b,words[i+7],14,1735328473);b=md5Gg(b,c,d,a,words[i+12],20,-1926607734);
      a=md5Hh(a,b,c,d,words[i+5],4,-378558);d=md5Hh(d,a,b,c,words[i+8],11,-2022574463);c=md5Hh(c,d,a,b,words[i+11],16,1839030562);b=md5Hh(b,c,d,a,words[i+14],23,-35309556);
      a=md5Hh(a,b,c,d,words[i+1],4,-1530992060);d=md5Hh(d,a,b,c,words[i+4],11,1272893353);c=md5Hh(c,d,a,b,words[i+7],16,-155497632);b=md5Hh(b,c,d,a,words[i+10],23,-1094730640);
      a=md5Hh(a,b,c,d,words[i+13],4,681279174);d=md5Hh(d,a,b,c,words[i],11,-358537222);c=md5Hh(c,d,a,b,words[i+3],16,-722521979);b=md5Hh(b,c,d,a,words[i+6],23,76029189);
      a=md5Hh(a,b,c,d,words[i+9],4,-640364487);d=md5Hh(d,a,b,c,words[i+12],11,-421815835);c=md5Hh(c,d,a,b,words[i+15],16,530742520);b=md5Hh(b,c,d,a,words[i+2],23,-995338651);
      a=md5Ii(a,b,c,d,words[i],6,-198630844);d=md5Ii(d,a,b,c,words[i+7],10,1126891415);c=md5Ii(c,d,a,b,words[i+14],15,-1416354905);b=md5Ii(b,c,d,a,words[i+5],21,-57434055);
      a=md5Ii(a,b,c,d,words[i+12],6,1700485571);d=md5Ii(d,a,b,c,words[i+3],10,-1894986606);c=md5Ii(c,d,a,b,words[i+10],15,-1051523);b=md5Ii(b,c,d,a,words[i+1],21,-2054922799);
      a=md5Ii(a,b,c,d,words[i+8],6,1873313359);d=md5Ii(d,a,b,c,words[i+15],10,-30611744);c=md5Ii(c,d,a,b,words[i+6],15,-1560198380);b=md5Ii(b,c,d,a,words[i+13],21,1309151649);
      a=md5Ii(a,b,c,d,words[i+4],6,-145523070);d=md5Ii(d,a,b,c,words[i+11],10,-1120210379);c=md5Ii(c,d,a,b,words[i+2],15,718787259);b=md5Ii(b,c,d,a,words[i+9],21,-343485551);
      a=md5Add(a,oa);b=md5Add(b,ob);c=md5Add(c,oc);d=md5Add(d,od);
    }
    return [a,b,c,d].map((word)=>[0,1,2,3].map((offset)=>((word >>> (offset*8)) & 255).toString(16).padStart(2,"0")).join("")).join("");
  };
  const cookieSafe = (value, maximum) => typeof value === "string" && value.length > 0 && value.length <= maximum && /^[A-Za-z0-9._~%+\-/=]+$/.test(value);
  const setRankingTicketCookie = (value, maxAge) => {
    if (!cookieSafe(value, 256) || !Number.isSafeInteger(maxAge) || maxAge < 60) throw new Error("schema");
    global.document.cookie = `bili_ticket=${value}; Max-Age=${maxAge}; Path=/; Domain=.bilibili.com; SameSite=Lax; Secure`;
  };
  const extractWbiKey = (value) => {
    if (typeof value !== "string" || value.length > 256) return null;
    let parsed;
    try { parsed = new URL(value); } catch { return null; }
    const match = /^\/bfs\/wbi\/([0-9a-f]{32})\.png$/.exec(parsed.pathname);
    return parsed.protocol === "https:" && parsed.hostname === "i0.hdslb.com" && match ? match[1] : null;
  };
  const hmacSha256Hex = async (message) => {
    if (!global.crypto || !global.crypto.subtle) throw new Error("unavailable");
    const key = await global.crypto.subtle.importKey("raw", new TextEncoder().encode(RANKING_TICKET_HMAC_KEY), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
    const signature = await global.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
    return Array.from(new Uint8Array(signature), (value)=>value.toString(16).padStart(2,"0")).join("");
  };
  const waitRankingDelay = (delay) => new Promise((resolve) => global.setTimeout(resolve, delay));
  const setRankingRuntimePhase = (phase) => {
    if (!new Set(["session-loading", "session-retrying", "session-ready", "rank-loading", "rank-retrying", "rank-ready", "rank-failed"]).has(phase)) return;
    const host = global.document.getElementById && global.document.getElementById("extension-b-stage-2-host");
    if (host) host.setAttribute("data-extension-b-ranking-phase", phase);
  };
  const initializeRankingSession = async () => {
    const sessionController = new AbortController();
    const sessionTimeout = global.setTimeout(() => sessionController.abort(), RANKING_SESSION_TIMEOUT_MS);
    try {
      const timestamp = Math.floor(Date.now()/1000);
      const hexsign = await hmacSha256Hex(`ts${timestamp}`);
      const ticketRoute = Object.freeze({host:RANKING_TICKET_ROUTE.host,path:`${RANKING_TICKET_ROUTE.path}?key_id=ec02&hexsign=${hexsign}&context%5Bts%5D=${timestamp}&csrf=`,method:"POST"});
      const [navRaw,ticketRaw] = await Promise.all([
        fetchFixed(RANKING_NAV_ROUTE,sessionController.signal).catch(() => null),
        fetchRankingTicketFixed(ticketRoute,sessionController.signal)
      ]);
      const navWbi = isPlainObject(navRaw) && isPlainObject(navRaw.data) && isPlainObject(navRaw.data.wbi_img)
        ? navRaw.data.wbi_img
        : null;
      const navImgKey = extractWbiKey(navWbi && navWbi.img_url);
      const navSubKey = extractWbiKey(navWbi && navWbi.sub_url);
      if (!isPlainObject(ticketRaw)||ticketRaw.code!==0||!isPlainObject(ticketRaw.data)||!cookieSafe(ticketRaw.data.ticket,256)
        ||!Number.isSafeInteger(ticketRaw.data.ttl)||ticketRaw.data.ttl<60||!isPlainObject(ticketRaw.data.nav)) throw new Error("schema");
      const imgKey=extractWbiKey(ticketRaw.data.nav.img); const subKey=extractWbiKey(ticketRaw.data.nav.sub);
      const useAuthenticatedNavKeys = navRaw && navRaw.code === 0 && navRaw.data.isLogin === true;
      const sessionImgKey = useAuthenticatedNavKeys ? navImgKey : imgKey;
      const sessionSubKey = useAuthenticatedNavKeys ? navSubKey : subKey;
      if (!sessionImgKey||!sessionSubKey) throw new Error("schema");
      setRankingTicketCookie(ticketRaw.data.ticket,ticketRaw.data.ttl);
      return Object.freeze({imgKey:sessionImgKey,subKey:sessionSubKey,expiresAt:timestamp+Math.min(ticketRaw.data.ttl,3600)});
    } finally {
      global.clearTimeout(sessionTimeout);
    }
  };
  const ensureRankingSession = async () => {
    const now = Math.floor(Date.now()/1000);
    if (rankingSession && rankingSession.expiresAt > now + 60) return rankingSession;
    if (rankingSessionPromise) return rankingSessionPromise;
    rankingSessionPromise = (async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        setRankingRuntimePhase(attempt === 0 ? "session-loading" : "session-retrying");
        try {
          rankingSession = await initializeRankingSession();
          setRankingRuntimePhase("session-ready");
          return rankingSession;
        } catch (error) {
          rankingSession = null;
          if (attempt === 1) throw error;
          await waitRankingDelay(RANKING_SESSION_RETRY_DELAY_MS);
        }
      }
      throw new Error("unavailable");
    })();
    try { return await rankingSessionPromise; } finally { rankingSessionPromise=null; }
  };
  const signedRankingRoute = async (rid) => {
    if (!Number.isSafeInteger(rid)||rid<1||rid>10000) throw new Error("schema");
    const session=await ensureRankingSession(); const rawKey=session.imgKey+session.subKey;
    const mixinKey=WBI_MIXIN_KEY_ENC_TAB.map((index)=>rawKey[index]).join("").slice(0,32);
    const params={rid:String(rid),type:"all",web_location:"333.934",wts:String(Math.floor(Date.now()/1000))};
    const query=Object.keys(params).sort().map((key)=>`${encodeURIComponent(key)}=${encodeURIComponent(params[key].replace(/[!'()*]/g,""))}`).join("&");
    return Object.freeze({host:"api.bilibili.com",path:`/x/web-interface/ranking/v2?${query}&w_rid=${md5Hex(query+mixinKey)}`,method:"GET"});
  };
  const fetchCurrentVideoRanking = (rid, signal) => {
    const run = async () => {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        if (signal.aborted) throw new Error("unavailable");
        setRankingRuntimePhase(attempt === 0 ? "rank-loading" : "rank-retrying");
        try {
          const raw = await fetchRankingFixed(await signedRankingRoute(rid),signal);
          if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.data) || !Array.isArray(raw.data.list)) throw new Error("schema");
          setRankingRuntimePhase("rank-ready");
          return raw;
        } catch (error) {
          rankingSession = null;
          if (attempt === 1 || signal.aborted) {
            setRankingRuntimePhase("rank-failed");
            throw error;
          }
        }
      }
      throw new Error("unavailable");
    };
    const queued = rankingRequestTail.catch(() => null).then(run);
    rankingRequestTail = queued.then(
      () => waitRankingDelay(RANKING_REQUEST_GAP_MS),
      () => waitRankingDelay(RANKING_REQUEST_GAP_MS)
    );
    return queued;
  };
  const isAllowedEnvelope = (value) => {
    if (!isPlainObject(value) || !Object.prototype.hasOwnProperty.call(value, "data")) {
      return false;
    }
    const allowedKeys = new Set(["code", "data", "message", "msg", "ttl"]);
    if (Object.keys(value).some((key) => !allowedKeys.has(key))) return false;
    if (Object.prototype.hasOwnProperty.call(value, "code")
      && (!Number.isSafeInteger(value.code) || value.code !== 0)) return false;
    if (Object.prototype.hasOwnProperty.call(value, "message")
      && typeof value.message !== "string") return false;
    if (Object.prototype.hasOwnProperty.call(value, "msg")
      && typeof value.msg !== "string") return false;
    if (Object.prototype.hasOwnProperty.call(value, "ttl")
      && !Number.isSafeInteger(value.ttl)) return false;
    return true;
  };
  const isSearchEnvelope = (value) => isPlainObject(value)
    && Object.prototype.hasOwnProperty.call(value, "data")
    && isPlainObject(value.data)
    && (!Object.prototype.hasOwnProperty.call(value, "code")
      || (Number.isSafeInteger(value.code) && value.code === 0));
  const dataObject = (value) => isAllowedEnvelope(value) && isPlainObject(value.data)
    ? value.data
    : null;
  const exactKeys = (value, keys) => isPlainObject(value)
    && Object.keys(value).sort().join("\u001F") === [...keys].sort().join("\u001F");
  const isSessionEnvelope = (value) => isAllowedEnvelope(value)
    && exactKeys(value, ["code", "data", "message", "msg", "ttl"]);
  const AUTH_LOGGED_OUT_CODES = new Set([0, -101]);
  const isAuthEnvelope = (value) => isPlainObject(value)
    && Object.prototype.hasOwnProperty.call(value, "code")
    && Object.prototype.hasOwnProperty.call(value, "data")
    && Number.isSafeInteger(value.code)
    && AUTH_LOGGED_OUT_CODES.has(value.code)
    && isPlainObject(value.data)
    && typeof value.data.isLogin === "boolean";
  const isAuthAvatarUrl = (value) => {
    if (!hasNoControlChars(value, 2048)) return false;
    const normalized = value.startsWith("//") ? `https:${value}` : value;
    let parsed;
    try { parsed = new URL(normalized); } catch { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/face/");
  };
  const isAuthMoney = (value) => typeof value === "number"
    && Number.isFinite(value)
    && value >= 0
    && value <= 1000000000;
  const isAuthLevelInfo = (value) => isPlainObject(value)
    && exactKeys(value, ["current_level", "current_min", "current_exp", "next_exp"])
    && isBoundedNonNegativeInteger(value.current_level, 6)
    && isBoundedNonNegativeInteger(value.current_min, 1000000000)
    && isBoundedNonNegativeInteger(value.current_exp, 1000000000)
    && (value.next_exp === "--" || isBoundedNonNegativeInteger(value.next_exp, 1000000000));
  const isAuthVerification = (value) => typeof value === "boolean" || value === 0 || value === 1;
  const isAuthMid = (value) => {
    if (Number.isSafeInteger(value)) {
      return value > 0 && value <= Number.MAX_SAFE_INTEGER;
    }
    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value) || value.length > 16) {
      return false;
    }
    return value.length < 16 || value <= "9007199254740991";
  };
  const projectAuthNavigation = (mid) => {
    if (!isAuthMid(mid)) throw new Error("schema");
    const digits = String(mid);
    return Object.freeze({
      followingUrl: `https://space.bilibili.com/${digits}/fans/follow`,
      followerUrl: `https://space.bilibili.com/${digits}/fans/fans`,
      dynamicUrl: `https://space.bilibili.com/${digits}/dynamic`,
      favoriteUrl: `https://space.bilibili.com/${digits}/favlist`
    });
  };
  const projectAuthBcoin = (data) => {
    if (data.wallet === undefined || data.wallet === null) return null;
    if (!isPlainObject(data.wallet)) throw new Error("schema");
    if (data.wallet.bcoin_balance === undefined || data.wallet.bcoin_balance === null) return null;
    if (!isAuthMoney(data.wallet.bcoin_balance)) throw new Error("schema");
    return data.wallet.bcoin_balance;
  };
  const projectAuthProfile = (data) => {
    if (!hasNoControlChars(data.uname, 64)
      || !isAuthAvatarUrl(data.face)
      || !isAuthLevelInfo(data.level_info)
      || !isAuthMoney(data.money)
      || !isBoundedNonNegativeInteger(data.vipStatus, 2)
      || !isAuthVerification(data.email_verified)
      || !isAuthVerification(data.mobile_verified)) {
      throw new Error("schema");
    }
    const face = data.face.startsWith("//") ? `https:${data.face}` : data.face;
    const navigation = projectAuthNavigation(data.mid);
    return Object.freeze({
      face,
      uname: data.uname,
      level: data.level_info.current_level,
      currentExp: data.level_info.current_exp,
      nextExp: data.level_info.next_exp === "--" ? null : data.level_info.next_exp,
      coins: data.money,
      vipStatus: data.vipStatus,
      bcoin: projectAuthBcoin(data),
      emailVerified: data.email_verified === true || data.email_verified === 1,
      mobileVerified: data.mobile_verified === true || data.mobile_verified === 1,
      ...navigation
    });
  };
  const projectAuth = (raw) => {
    if (!isAuthEnvelope(raw)) {
      return Object.freeze({ status: "unknown", profile: null });
    }
    if (!raw.data.isLogin && AUTH_LOGGED_OUT_CODES.has(raw.code)) {
      return Object.freeze({ status: "logged_out", profile: null });
    }
    if (raw.code !== 0 || raw.data.isLogin !== true) {
      return Object.freeze({ status: "unknown", profile: null });
    }
    try {
      return Object.freeze({ status: "logged_in", profile: projectAuthProfile(raw.data) });
    } catch {
      return Object.freeze({ status: "unknown", profile: null });
    }
  };
  const isLogoutEnvelope = (value) => isPlainObject(value)
    && Object.prototype.hasOwnProperty.call(value, "code")
    && Number.isSafeInteger(value.code)
    && value.code === 0;
  const projectLogout = (raw) => {
    if (!isLogoutEnvelope(raw)) throw new Error("schema");
    return Object.freeze({ status: "logged_out" });
  };
  const readBiliJct = () => {
    const cookieText = global.document ? global.document.cookie : "";
    if (typeof cookieText !== "string") throw new Error("schema");
    const cookieParts = cookieText.split(";");
    let biliJct = null;
    let biliJctCount = 0;
    for (const cookiePart of cookieParts) {
      const separator = cookiePart.indexOf("=");
      if (separator < 0 || cookiePart.slice(0, separator).trim() !== "bili_jct") continue;
      biliJctCount += 1;
      if (biliJctCount !== 1) throw new Error("schema");
      let decoded;
      try {
        decoded = decodeURIComponent(cookiePart.slice(separator + 1).trim());
      } catch {
        throw new Error("schema");
      }
      if (!/^[a-f0-9]{32}$/i.test(decoded)) throw new Error("schema");
      biliJct = decoded;
    }
    if (biliJctCount !== 1 || biliJct === null) throw new Error("schema");
    return biliJct;
  };
  const projectWatchLaterMutation = (raw, aid, action) => {
    if (!isPlainObject(raw)
      || !Number.isSafeInteger(raw.code)
      || raw.code !== 0
      || !Number.isSafeInteger(aid)
      || aid <= 0
      || (action !== "add" && action !== "remove")) throw new Error("schema");
    return Object.freeze({ aid, action, success: true });
  };
  const PROFILE_STATS_ENVELOPE_KEYS = new Set(["code", "data", "message", "msg", "ttl"]);
  const PROFILE_STATS_REQUIRED_DATA_KEYS = Object.freeze(["following", "follower", "dynamic_count"]);
  const isProfileStatsEnvelope = (value) => isPlainObject(value)
    && Object.prototype.hasOwnProperty.call(value, "code")
    && Object.prototype.hasOwnProperty.call(value, "data")
    && Object.keys(value).every((key) => PROFILE_STATS_ENVELOPE_KEYS.has(key))
    && Number.isSafeInteger(value.code)
    && value.code === 0
    && (!Object.prototype.hasOwnProperty.call(value, "message")
      || hasNoControlChars(value.message, MAX_RESPONSE_TEXT_LENGTH))
    && (!Object.prototype.hasOwnProperty.call(value, "msg")
      || hasNoControlChars(value.msg, MAX_RESPONSE_TEXT_LENGTH))
    && (!Object.prototype.hasOwnProperty.call(value, "ttl")
      || (Number.isSafeInteger(value.ttl) && value.ttl >= 0 && value.ttl <= 86400))
    && isPlainObject(value.data)
    && PROFILE_STATS_REQUIRED_DATA_KEYS.every((key) => Object.prototype.hasOwnProperty.call(value.data, key)
      && Number.isSafeInteger(value.data[key])
      && value.data[key] >= 0);
  const projectProfileStats = (raw) => {
    if (!isProfileStatsEnvelope(raw)) throw new Error("schema");
    return Object.freeze({
      following: raw.data.following,
      follower: raw.data.follower,
      dynamic_count: raw.data.dynamic_count
    });
  };
  const isDynamicSummaryEnvelope = (value) => isPlainObject(value)
    && value.code === 0
    && isPlainObject(value.data)
    && isPlainObject(value.data.update_info)
    && isPlainObject(value.data.update_info.item)
    && Number.isSafeInteger(value.data.update_info.item.count)
    && value.data.update_info.item.count >= 0;
  const projectDynamicSummary = (raw) => {
    if (!isDynamicSummaryEnvelope(raw)) throw new Error("schema");
    return Object.freeze({ count: raw.data.update_info.item.count });
  };
  const isCounter = (value) => typeof value === "number"
    && Number.isSafeInteger(value)
    && value >= 0;
  const projectMessage = (msgRaw, sessionRaw) => {
    const msgData = dataObject(msgRaw);
    const sessionData = dataObject(sessionRaw);
    const messageKeys = ["at", "like", "reply", "sys_msg"];
    const sessionKeys = [
      "biz_msg_follow_unread",
      "biz_msg_unfollow_unread",
      "custom_unread",
      "dustbin_push_msg",
      "dustbin_unread",
      "follow_unread",
      "unfollow_push_msg",
      "unfollow_unread"
    ];
    if (!isPlainObject(msgData) || !messageKeys.every((key) => isCounter(msgData[key]))) {
      throw new Error("schema");
    }
    if (!isSessionEnvelope(sessionRaw)
      || !isPlainObject(sessionData)
      || !sessionKeys.every((key) => isCounter(sessionData[key]))) {
      throw new Error("schema");
    }
    return Object.freeze({
      reply: msgData.reply,
      at: msgData.at,
      like: msgData.like,
      sysMsg: msgData.sys_msg,
      sessionUnread: sessionKeys.reduce((total, key) => total + sessionData[key], 0)
    });
  };
  const isSummaryEnvelope = (value) => {
    if (!isPlainObject(value) || value.code !== 0 || !Object.prototype.hasOwnProperty.call(value, "data")) {
      return false;
    }
    const keys = ownKeys(value);
    if (!["code\u001Fdata\u001Fmessage\u001Fttl", "code\u001Fdata\u001Fmsg\u001Fttl", "code\u001Fdata\u001Fmessage\u001Fmsg\u001Fttl"].includes(keys)) {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(value, "message")
      && (typeof value.message !== "string" || value.message.length > 128)) return false;
    if (Object.prototype.hasOwnProperty.call(value, "msg")
      && (typeof value.msg !== "string" || value.msg.length > 128)) return false;
    return Number.isSafeInteger(value.ttl) && value.ttl >= 0;
  };
  const isFavoriteEnvelope = (value) => isPlainObject(value)
    && value.code === 0
    && Object.prototype.hasOwnProperty.call(value, "data");
  const favoriteResponse = (raw) => {
    if (!isFavoriteEnvelope(raw)) throw new Error("schema");
    if (Array.isArray(raw.data)) {
      const response = raw.data[0] && raw.data[0].mediaListResponse;
      const later = raw.data[1] && raw.data[1].mediaListResponse;
      if (!isPlainObject(response) || !Array.isArray(response.list)) throw new Error("schema");
      if (later !== undefined && later !== null
        && (!isPlainObject(later) || (later.list !== null && !Array.isArray(later.list)))) throw new Error("schema");
      return { response, later: isPlainObject(later) ? later : null };
    }
    if (isPlainObject(raw.data) && Array.isArray(raw.data.list)) {
      return { response: raw.data, later: null };
    }
    throw new Error("schema");
  };
  const normalizeFavoriteFolders = (raw) => {
    const payload = favoriteResponse(raw);
    const folders = [];
    const seenIds = new Set();
    for (const entry of payload.response.list) {
      if (!isPlainObject(entry)
        || !Number.isSafeInteger(entry.id)
        || entry.id <= 0
        || !hasNoControlChars(entry.title, 80)
        || !Number.isSafeInteger(entry.media_count)
        || entry.media_count < 0
        || !Number.isSafeInteger(entry.attr)) continue;
      if (seenIds.has(entry.id)) continue;
      seenIds.add(entry.id);
      folders.push(Object.freeze({
        id: entry.id,
        title: entry.title,
        count: entry.media_count,
        attr: entry.attr
      }));
    }
    const defaultIndex = folders.findIndex((folder) => folder.attr === 0);
    const orderedFolders = defaultIndex > 0
      ? [folders[defaultIndex], ...folders.slice(0, defaultIndex), ...folders.slice(defaultIndex + 1)]
      : folders;
    return Object.freeze({
      folders: Object.freeze(orderedFolders.slice(0, 19)),
      laterCount: payload.later && Number.isSafeInteger(payload.later.count) && payload.later.count >= 0
        ? payload.later.count
        : 0
    });
  };
  const isBvid = (value) => typeof value === "string" && /^BV[A-Za-z0-9]{10}$/.test(value);
  const normalizeVideoCover = (value) => {
    if (!hasNoControlChars(value, 2048)) return null;
    const normalized = value.startsWith("//") ? `https:${value}` : value;
    let parsed;
    try { parsed = new URL(normalized); } catch { return null; }
    const schemeEnd = normalized.indexOf("://");
    const authority = schemeEnd >= 0
      ? normalized.slice(schemeEnd + 3).split(/[\/?#]/, 1)[0].toLowerCase()
      : "";
    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:")
      || !["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      || authority !== parsed.hostname
      || parsed.username !== ""
      || parsed.password !== ""
      || parsed.port !== ""
      || parsed.hash !== ""
      || !parsed.pathname.startsWith("/bfs/")) return null;
    parsed.protocol = "https:";
    return parsed.href;
  };
  const normalizeFavoriteItem = (entry, later) => {
    if (!isPlainObject(entry) || !hasNoControlChars(entry.title, 160)) return null;
    const bvid = isBvid(entry.bvid) ? entry.bvid : (isBvid(entry.bv_id) ? entry.bv_id : null);
    const numericId = Number.isSafeInteger(entry.aid) && entry.aid > 0
      ? entry.aid
      : (Number.isSafeInteger(entry.id) && entry.id > 0 ? entry.id : null);
    if (!bvid && numericId === null) return null;
    const ownerSource = later ? entry.owner : entry.upper;
    const owner = isPlainObject(ownerSource) && hasNoControlChars(ownerSource.name, 80)
      ? ownerSource.name
      : "";
    return Object.freeze({
      title: entry.title,
      cover: normalizeVideoCover(later ? entry.pic : entry.cover),
      owner,
      duration: Number.isSafeInteger(entry.duration) && entry.duration >= 0 ? entry.duration : 0,
      href: bvid
        ? `https://www.bilibili.com/video/${bvid}`
        : `https://www.bilibili.com/video/av${numericId}`
    });
  };
  const normalizeFavoriteItems = (raw, later) => {
    if (!isFavoriteEnvelope(raw)) throw new Error("schema");
    const list = later
      ? (isPlainObject(raw.data) && Array.isArray(raw.data.list) ? raw.data.list : [])
      : (Array.isArray(raw.data) ? raw.data : []);
    const items = [];
    for (const entry of list) {
      if (items.length >= 20) break;
      const item = normalizeFavoriteItem(entry, later);
      if (item) items.push(item);
    }
    return Object.freeze(items);
  };
  const projectFavorite = (folderRaw, laterRaw, detailValues) => {
    const navigation = normalizeFavoriteFolders(folderRaw);
    const tabs = [];
    const hasLaterData = isFavoriteEnvelope(laterRaw) && isPlainObject(laterRaw.data);
    const laterItems = hasLaterData ? normalizeFavoriteItems(laterRaw, true) : Object.freeze([]);
    const laterCount = hasLaterData && Number.isSafeInteger(laterRaw.data.count) && laterRaw.data.count >= 0
      ? laterRaw.data.count
      : navigation.laterCount;
    for (let index = 0; index < navigation.folders.length; index += 1) {
      const folder = navigation.folders[index];
      const detail = detailValues[index];
      tabs.push(Object.freeze({
        key: String(folder.id),
        title: folder.title,
        count: folder.count,
        viewAllHref: "https://space.bilibili.com/",
        playAllHref: `https://www.bilibili.com/medialist/play/ml${folder.id}`,
        items: normalizeFavoriteItems(detail, false)
      }));
    }
    const defaultTab = tabs.shift();
    if (defaultTab) tabs.unshift(defaultTab);
    tabs.splice(1, 0, Object.freeze({
      key: "LATER_VIEW",
      title: "稍后再看",
      count: laterCount,
      viewAllHref: "https://www.bilibili.com/watchlater/#/list",
      playAllHref: "https://www.bilibili.com/medialist/play/watchlater",
      items: laterItems
    }));
    return Object.freeze({
      tabs: Object.freeze(tabs.slice(0, 20)),
      allHref: "https://space.bilibili.com/"
    });
  };
  const isHistoryEnvelope = (value) => isPlainObject(value)
    && value.code === 0
    && isPlainObject(value.data)
    && Array.isArray(value.data.list);
  const normalizeHistoryHref = (entry, type) => {
    const history = isPlainObject(entry.history) ? entry.history : null;
    if (!history) return null;
    if (isBvid(history.bvid)) return `https://www.bilibili.com/video/${history.bvid}`;
    if (!Number.isSafeInteger(history.oid) || history.oid <= 0) return null;
    if (type === "live") return `https://live.bilibili.com/${history.oid}`;
    if (type === "article") return `https://www.bilibili.com/read/cv${history.oid}`;
    return `https://www.bilibili.com/video/av${history.oid}`;
  };
  const normalizeHistoryList = (raw, type) => {
    if (!isHistoryEnvelope(raw)) throw new Error("schema");
    const items = [];
    for (const entry of raw.data.list) {
      if (items.length >= 20) break;
      if (!isPlainObject(entry) || !hasNoControlChars(entry.title, 160)) continue;
      const href = normalizeHistoryHref(entry, type);
      if (!href) continue;
      items.push(Object.freeze({
        title: entry.title,
        cover: normalizeVideoCover(entry.cover || (Array.isArray(entry.covers) ? entry.covers[0] : "")),
        author: hasNoControlChars(entry.author_name, 80)
          ? entry.author_name
          : (hasNoControlChars(entry.name, 80) ? entry.name : ""),
        progress: Number.isSafeInteger(entry.progress) ? entry.progress : -1,
        duration: Number.isSafeInteger(entry.duration) && entry.duration >= 0 ? entry.duration : 0,
        viewAt: Number.isSafeInteger(entry.view_at) && entry.view_at >= 0 ? entry.view_at : 0,
        href
      }));
    }
    return Object.freeze(items);
  };
  const projectHistory = (rawValues) => {
    if (!Array.isArray(rawValues) || rawValues.length !== 3) throw new Error("schema");
    return Object.freeze({
      archive: normalizeHistoryList(rawValues[0], "archive"),
      live: normalizeHistoryList(rawValues[1], "live"),
      article: normalizeHistoryList(rawValues[2], "article")
    });
  };
  const normalizeSearchText = (value, maximum) => hasNoControlChars(value, maximum)
    ? value.trim().slice(0, maximum)
    : "";
  const normalizeSearchDefaultUrl = (value) => {
    if (!hasNoControlChars(value, 2048)) return null;
    let parsed;
    try { parsed = new URL(value); } catch { return null; }
    if (parsed.protocol !== "https:"
      || parsed.hostname !== "search.bilibili.com"
      || parsed.username !== ""
      || parsed.password !== ""
      || parsed.port !== ""
      || parsed.pathname !== "/all"
      || parsed.hash !== "") return null;
    const keyword = normalizeSearchText(parsed.searchParams.get("keyword"), 128);
    if (!keyword) return null;
    return `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
  };
  const SEARCH_MARK_KEYS = Object.freeze(["live", "anniversary", "none"]);
  const SEARCH_MARK_BY_ICON_URL = Object.freeze({
    "https://i0.hdslb.com/bfs/activity-plat/static/20251027/aafcb8031fd171c428daaa9b45867226/VaxAnHMq6w.gif": "live",
    "https://i0.hdslb.com/bfs/legacy/647bba88c37449d0f5a2c69f1dff1373caf20797.png": "anniversary"
  });
  const normalizeSearchMarkKey = (value) => {
    if (!hasNoControlChars(value, 2048)) return "none";
    let parsed;
    try { parsed = new URL(value); } catch { return "none"; }
    if (parsed.protocol !== "https:"
      || !["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      || parsed.username !== ""
      || parsed.password !== ""
      || parsed.port !== ""
      || parsed.search !== ""
      || parsed.hash !== ""
      || !parsed.pathname.startsWith("/bfs/")) return "none";
    return SEARCH_MARK_BY_ICON_URL[parsed.href] || "none";
  };
  const normalizeSearchRemoteIcon = (value) => {
    if (!hasNoControlChars(value, 2048)) return null;
    let parsed;
    try { parsed = new URL(value); } catch { return null; }
    if (parsed.protocol !== "https:"
      || !["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      || parsed.username !== ""
      || parsed.password !== ""
      || parsed.port !== ""
      || parsed.search !== ""
      || parsed.hash !== ""
      || !parsed.pathname.startsWith("/bfs/")) return null;
    return parsed.href;
  };
  const projectSearch = (defaultRaw, trendingRaw) => {
    if (!isSearchEnvelope(trendingRaw)
      || !isPlainObject(trendingRaw.data.trending)
      || !Array.isArray(trendingRaw.data.trending.list)) throw new Error("schema");
    const defaultData = isSearchEnvelope(defaultRaw) ? defaultRaw.data : null;
    const defaultKeyword = (defaultData && (normalizeSearchText(defaultData.show_name, 128)
      || normalizeSearchText(defaultData.name, 128))) || SEARCH_FALLBACK_KEYWORD;
    const defaultUrl = (defaultData && normalizeSearchDefaultUrl(defaultData.url))
      || `https://search.bilibili.com/all?keyword=${encodeURIComponent(defaultKeyword)}`;
    const trendingTitle = normalizeSearchText(trendingRaw.data.trending.title, 64) || "bilibili热搜";
    const trendingItems = [];
    for (const entry of trendingRaw.data.trending.list) {
      if (trendingItems.length >= 10 || !isPlainObject(entry)) continue;
      const keyword = normalizeSearchText(entry.keyword, 128)
        || normalizeSearchText(entry.show_name, 128);
      const text = normalizeSearchText(entry.show_name, 128) || keyword;
      if (!keyword || !text) continue;
      const markKey = normalizeSearchMarkKey(entry.icon);
      trendingItems.push(Object.freeze({
        keyword,
        text,
        markKey,
        remoteIcon: markKey === "none" ? normalizeSearchRemoteIcon(entry.icon) : null
      }));
    }
    return Object.freeze({
      defaultKeyword,
      defaultUrl,
      trendingTitle,
      trendingItems: Object.freeze(trendingItems)
    });
  };
  const hasNoControlChars = (value, maxLength) => typeof value === "string"
    && value.length <= maxLength
    && !/[\u0000-\u001F\u007F]/.test(value);
  const isBoundedNonNegativeInteger = (value, maximum) => Number.isSafeInteger(value)
    && value >= 0
    && value <= maximum;
  const LIVE_ROOM_KEYS = Object.freeze([
    "ad_transparent_content",
    "area_v2_id",
    "area_v2_name",
    "area_v2_parent_id",
    "area_v2_parent_name",
    "broadcast_type",
    "click_callback",
    "cover",
    "cover_source",
    "face",
    "flag",
    "followers",
    "group_id",
    "head_box",
    "head_box_type",
    "is_ad",
    "is_ai",
    "is_auto_play",
    "is_nft",
    "keyframe",
    "link",
    "live_key",
    "nft_dmark",
    "online",
    "pendant_Info",
    "roomid",
    "session_id",
    "show_ad_icon",
    "show_callback",
    "special_id",
    "status",
    "sub_session_key",
    "title",
    "trackid",
    "uid",
    "uname",
    "verify",
    "watched_show"
  ]);
  const isLiveRoomString = (value, maximum) => hasNoControlChars(value, maximum);
  const isLiveText = (value, maximum) => hasNoControlChars(value, maximum) && value.length > 0;
  const isLiveNestedString = (value, maximum) => hasNoControlChars(value, maximum);
  const isHeadBox = (value) => value === null || (isPlainObject(value)
    && exactKeys(value, ["name", "value", "desc"])
    && isLiveNestedString(value.name, 128)
    && isLiveNestedString(value.value, 512)
    && isLiveNestedString(value.desc, 512));
  const isVerify = (value) => isPlainObject(value)
    && exactKeys(value, ["role", "desc", "type"])
    && isBoundedNonNegativeInteger(value.role, 1000000)
    && isLiveNestedString(value.desc, 512)
    // The live endpoint uses -1 for an unverified room's verification type.
    && Number.isSafeInteger(value.type)
    && value.type >= -1
    && value.type <= 1000000;
  const isWatchedShow = (value) => isPlainObject(value)
    && exactKeys(value, ["switch", "num", "text_small", "text_large", "icon", "icon_location", "icon_web"])
    && typeof value.switch === "boolean"
    && isBoundedNonNegativeInteger(value.num, 1000000000000)
    && isLiveNestedString(value.text_small, 128)
    && isLiveNestedString(value.text_large, 256)
    && isLiveNestedString(value.icon, 2048)
    && isBoundedNonNegativeInteger(value.icon_location, 1000000)
    && isLiveNestedString(value.icon_web, 2048);
  const isPendantEntry = (value) => value === null || (isPlainObject(value)
    && exactKeys(value, ["type", "name", "position", "text", "bg_color", "bg_pic", "pendant_id", "priority", "created_at"])
    && isLiveNestedString(value.type, 128)
    && isLiveNestedString(value.name, 256)
    && isBoundedNonNegativeInteger(value.position, 1000000)
    && isLiveNestedString(value.text, 512)
    && isLiveNestedString(value.bg_color, 128)
    && isLiveNestedString(value.bg_pic, 2048)
    && isBoundedNonNegativeInteger(value.pendant_id, 1000000000000)
    && isBoundedNonNegativeInteger(value.priority, 1000000)
    && isBoundedNonNegativeInteger(value.created_at, 10000000000000));
  const isPendantInfo = (value) => value === null || (isPlainObject(value)
    && (Object.keys(value).length === 0
      || (exactKeys(value, ["1", "2"])
        && isPendantEntry(value["1"])
        && isPendantEntry(value["2"]))));
  const normalizeLiveAssetUrl = (value) => {
    if (!hasNoControlChars(value, 2048)) return null;
    const authorityMatch = /^[a-z][a-z\d+.-]*:\/\/([^/?#]*)/i.exec(value);
    if (!authorityMatch || authorityMatch[1].includes("@") || authorityMatch[1].includes(":")) return null;
    let parsed;
    try { parsed = new URL(value); } catch { return null; }
    if ((parsed.protocol === "http:" || parsed.protocol === "https:")
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/")) {
      parsed.protocol = "https:";
      return parsed.toString();
    }
    return null;
  };
  const isLiveAssetUrl = (value) => normalizeLiveAssetUrl(value) !== null;
  const isLiveSourceLink = (value, roomid) => {
    if (!hasNoControlChars(value, 2048)
      || !isBoundedNonNegativeInteger(roomid, 100000000000)
      || !value.startsWith("/")
      || value.startsWith("//")
      || value.includes("\\")) return false;
    let parsed;
    try { parsed = new URL(value, "https://live.bilibili.com"); } catch { return false; }
    return parsed.origin === "https://live.bilibili.com"
      && parsed.protocol === "https:"
      && parsed.hostname === "live.bilibili.com"
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.hash === ""
      && /^\/\d+$/.test(parsed.pathname)
      && Number(parsed.pathname.slice(1)) === roomid;
  };
  const isLiveHoverEnvelope = (value) => isPlainObject(value)
    && Number.isSafeInteger(value.code)
    && value.code === 0
    && isPlainObject(value.data)
    && Array.isArray(value.data.room_list)
    && value.data.room_list.length <= 20;
  const isLiveRoom = (value) => isPlainObject(value)
    && isLiveText(value.title, 256)
    && isLiveText(value.uname, 256)
    && isLiveAssetUrl(value.face)
    && isLiveSourceLink(value.link, value.roomid)
    && isBoundedNonNegativeInteger(value.online, 1000000000)
    && isBoundedNonNegativeInteger(value.roomid, 100000000000)
    && isBoundedNonNegativeInteger(value.uid, Number.MAX_SAFE_INTEGER);
  const projectLiveHover = (raw) => {
    if (!isLiveHoverEnvelope(raw)) throw new Error("schema");
    const seenRoomIds = new Set();
    const items = [];
    for (const room of raw.data.room_list) {
      if (items.length >= 6) break;
      if (!isLiveRoom(room) || seenRoomIds.has(room.roomid)) continue;
      seenRoomIds.add(room.roomid);
      items.push(Object.freeze({
        face: normalizeLiveAssetUrl(room.face),
        link: `https://live.bilibili.com/${room.roomid}`,
        title: room.title,
        uname: room.uname,
        uid: room.uid,
        online: room.online
      }));
    }
    return Object.freeze({ items: Object.freeze(items) });
  };
  const PRIMARY_MENU_COUNT_SOURCES = Object.freeze([
    Object.freeze(["douga", Object.freeze([1])]),
    Object.freeze(["anime", Object.freeze([13])]),
    Object.freeze(["music", Object.freeze([3])]),
    Object.freeze(["guochuang", Object.freeze([167])]),
    Object.freeze(["dance", Object.freeze([129])]),
    Object.freeze(["game", Object.freeze([4])]),
    Object.freeze(["knowledge", Object.freeze([36])]),
    Object.freeze(["tech", Object.freeze([188])]),
    Object.freeze(["life", Object.freeze([160])]),
    Object.freeze(["kichiku", Object.freeze([119])]),
    Object.freeze(["fashion", Object.freeze([155])]),
    Object.freeze(["information", Object.freeze([202])]),
    Object.freeze(["ent", Object.freeze([5])]),
    Object.freeze(["cinephile", Object.freeze([181])]),
    Object.freeze(["cinema", Object.freeze([23, 11, 177])])
  ]);
  const readPrimaryMenuCount = (regionCount, tid) => {
    const value = regionCount[String(tid)];
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  };
  const projectPrimaryMenuCounts = (raw) => {
    if (!isPlainObject(raw)
      || !Number.isSafeInteger(raw.code)
      || raw.code !== 0
      || !isPlainObject(raw.data)
      || !isPlainObject(raw.data.region_count)) throw new Error("schema");
    const channels = PRIMARY_MENU_COUNT_SOURCES.map(([key, tids]) => {
      const value = tids.length === 1
        ? readPrimaryMenuCount(raw.data.region_count, tids[0])
        : tids.reduce((sum, tid) => sum + (readPrimaryMenuCount(raw.data.region_count, tid) || 0), 0);
      return Object.freeze({ key, value });
    });
    return Object.freeze({ channels: Object.freeze(channels) });
  };
  const recommendationRoute = (batch) => {
    if (!Number.isSafeInteger(batch) || batch < 0 || batch > 10000) throw new Error("schema");
    const freshType = batch === 0 ? 0 : 3;
    return Object.freeze({
      host: OPERATION_ROUTES.RECOMMENDATION_FEED[0].host,
      path: `${OPERATION_ROUTES.RECOMMENDATION_FEED[0].path}?web_location=1430651&fresh_type=${freshType}&fresh_idx=${batch}&fresh_idx_1h=${batch}&homepage_ver=0`,
      method: "GET"
    });
  };
  const dougaFeedRoute = (batch) => {
    if (!Number.isSafeInteger(batch) || batch < 0 || batch > 10000) throw new Error("schema");
    return Object.freeze({
      host: OPERATION_ROUTES.DOUGA_FLOOR[0].host,
      path: `${OPERATION_ROUTES.DOUGA_FLOOR[0].path}?display_id=${batch + 1}&request_cnt=15&from_region=1005&device=web&plat=30&web_location=333.40138`,
      method: "GET"
    });
  };
  const ordinaryZoneRoute = (type, batch, kind) => {
    const config = OPERATION_ROUTES.ORDINARY_ZONE_FLOOR[type];
    if (!config || !Number.isSafeInteger(batch) || batch < 0 || batch > 49) throw new Error("schema");
    if (kind === "list") {
      const path = config.list === "cheese"
        ? `/pugv/app/web/floor/switch?load_type=1&display_id=${batch + 1}`
        : config.list === "information"
        ? "/x/web-interface/information?ps=12&rid=202"
        : config.list === "pgcFeed"
          ? `/pgc/page/web/v2?name=${config.feedName}`
        : config.list === "regionFeed"
          ? `/x/web-interface/region/feed/rcmd?display_id=${batch + 1}&request_cnt=15&from_region=${config.feedRegion}&device=web&plat=30&web_location=333.40138`
          : `/x/web-interface/newlist?rid=${config.rid}&type=0&pn=${batch + 1}&ps=12`;
      return Object.freeze({ host: "api.bilibili.com", path, method: "GET" });
    }
    if (kind === "rank" && config.rank) {
      if (config.rank.kind === "cheese") {
        return Object.freeze({ host: "api.bilibili.com", path: "/pugv/app/web/season/hot/list?category_id=0", method: "GET" });
      }
      if (config.rank.kind === "video") {
        return Object.freeze({ host: "api.bilibili.com", path: `/x/web-interface/ranking/v2?rid=${config.rank.rid}&type=all&web_location=333.934`, method: "GET" });
      }
      if (config.rank.kind === "pgc") {
        return Object.freeze({ host: "api.bilibili.com", path: `/pgc/season/rank/web/list?day=3&season_type=${config.rank.seasonType}&web_location=333.934`, method: "GET" });
      }
    }
    return null;
  };
  const isRecommendationEnvelope = (value) => isPlainObject(value)
    && Number.isSafeInteger(value.code)
    && value.code === 0
    && isPlainObject(value.data)
    && Array.isArray(value.data.item)
    && value.data.item.length <= 64;
  const normalizeRecommendationCover = (value) => {
    const normalized = normalizeVideoCover(value);
    if (!normalized) return null;
    const parsed = new URL(normalized);
    parsed.search = "";
    if (!/@\d+w_\d+h_/.test(parsed.pathname)) {
      parsed.pathname = `${parsed.pathname}@412w_232h_1c.avif`;
    }
    return parsed.href;
  };
  const normalizeRecommendationItem = (entry) => {
    if (!isPlainObject(entry)
      || !Number.isSafeInteger(entry.id)
      || entry.id <= 0
      || !isBvid(entry.bvid)
      || !hasNoControlChars(entry.title, 160)
      || entry.title.length === 0
      || !isPlainObject(entry.owner)
      || !hasNoControlChars(entry.owner.name, 80)
      || entry.owner.name.length === 0
      || !isPlainObject(entry.stat)
      || !isBoundedNonNegativeInteger(entry.stat.view, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.duration, 604800)) return null;
    const cover = normalizeRecommendationCover(entry.pic);
    if (!cover) return null;
    return Object.freeze({
      aid: entry.id,
      bvid: entry.bvid,
      title: entry.title,
      cover,
      href: `https://www.bilibili.com/video/${entry.bvid}`,
      duration: entry.duration,
      ownerName: entry.owner.name,
      view: entry.stat.view
    });
  };
  const projectRecommendation = (raw, batch) => {
    if (!isRecommendationEnvelope(raw)) throw new Error("schema");
    const items = [];
    const seen = new Set();
    for (const entry of raw.data.item) {
      if (items.length >= 10) break;
      const item = normalizeRecommendationItem(entry);
      if (!item || seen.has(item.bvid)) continue;
      seen.add(item.bvid);
      items.push(item);
    }
    if (items.length < 8) throw new Error("schema");
    return Object.freeze({ batch, items: Object.freeze(items) });
  };
  const normalizeDougaItem = (entry) => {
    if (!isPlainObject(entry) || !isBoundedNonNegativeInteger(entry.aid, Number.MAX_SAFE_INTEGER)
      || !isBvid(entry.bvid) || !hasNoControlChars(entry.title, 200)
      || !hasNoControlChars(entry.cover, 2048) || !isPlainObject(entry.stat)
      || !isPlainObject(entry.author) || !isBoundedNonNegativeInteger(entry.author.mid, Number.MAX_SAFE_INTEGER)
      || !hasNoControlChars(entry.author.name, 80) || !isBoundedNonNegativeInteger(entry.duration, 604800)
      || !isBoundedNonNegativeInteger(entry.stat.view, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.stat.danmaku, 1000000000)) return null;
    const cover = normalizeRecommendationCover(entry.cover);
    if (!cover) return null;
    return Object.freeze({ aid: entry.aid, bvid: entry.bvid, title: entry.title, cover,
      duration: entry.duration, view: entry.stat.view, danmaku: entry.stat.danmaku,
      ownerMid: entry.author.mid, ownerName: entry.author.name,
      href: `https://www.bilibili.com/video/${entry.bvid}`,
      ownerHref: `https://space.bilibili.com/${entry.author.mid}` });
  };
  const normalizeDougaRank = (entry, rank) => {
    if (!isPlainObject(entry) || !isBoundedNonNegativeInteger(entry.aid, Number.MAX_SAFE_INTEGER)
      || !isBvid(entry.bvid) || !hasNoControlChars(entry.title, 200)
      || !hasNoControlChars(entry.pic, 2048) || !isPlainObject(entry.owner)
      || !isBoundedNonNegativeInteger(entry.owner.mid, Number.MAX_SAFE_INTEGER)
      || !hasNoControlChars(entry.owner.name, 80)
      || !isBoundedNonNegativeInteger(entry.pubdate, 4102444800)
      || !isPlainObject(entry.stat)
      || !isBoundedNonNegativeInteger(entry.stat.view, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.stat.danmaku, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.stat.favorite, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.stat.coin, 1000000000000)) return null;
    const cover = normalizeRecommendationCover(entry.pic);
    if (!cover) return null;
    return Object.freeze({ rank, aid: entry.aid, bvid: entry.bvid, title: entry.title, cover,
      href: `https://www.bilibili.com/video/${entry.bvid}`,
      ownerMid: entry.owner.mid, ownerName: entry.owner.name,
      ownerHref: `https://space.bilibili.com/${entry.owner.mid}`,
      pubdate: entry.pubdate, view: entry.stat.view, danmaku: entry.stat.danmaku,
      favorite: entry.stat.favorite, coin: entry.stat.coin });
  };
  const videoRankEntries = (raw) => {
    if (!isPlainObject(raw) || raw.code !== 0) return null;
    if (Array.isArray(raw.data) && raw.data.length <= 100) return raw.data;
    if (isPlainObject(raw.data) && Array.isArray(raw.data.list) && raw.data.list.length <= 100) return raw.data.list;
    return null;
  };
  const isDougaRankEnvelope = (raw) => videoRankEntries(raw) !== null;
  const projectDougaFloor = (feedRaw, rankRaw, batch) => {
    if (!isPlainObject(feedRaw) || feedRaw.code !== 0 || !isPlainObject(feedRaw.data)
      || !Array.isArray(feedRaw.data.archives)) throw new Error("schema");
    const items = [];
    const seen = new Set();
    for (const entry of feedRaw.data.archives) {
      if (items.length >= 10) break;
      const item = normalizeDougaItem(entry);
      if (!item || seen.has(item.bvid)) continue;
      seen.add(item.bvid); items.push(item);
    }
    const ranks = [];
    const rankEntries = videoRankEntries(rankRaw) || [];
    for (const entry of rankEntries) {
      if (ranks.length >= 100) break;
      const item = normalizeOrdinaryRank(entry, ranks.length + 1);
      if (item) ranks.push(item);
    }
    if (items.length < 8) throw new Error("schema");
    return Object.freeze({ batch, items: Object.freeze(items), ranks: Object.freeze(ranks) });
  };
  const ordinaryClassificationMatches = (entry, config) => {
    if (!isPlainObject(entry)) return false;
    const parentFields = [entry.pid_v2, entry.pid, entry.parent_tid, entry.parent_id]
      .filter((value) => value !== undefined && value !== null);
    if (parentFields.length === 0) return true;
    const numericParents = parentFields.filter((value) => Number.isSafeInteger(value));
    return numericParents.length > 0 && numericParents.every((value) => value === config.rid);
  };
  const ordinaryEntryOwner = (entry) => {
    if (!isPlainObject(entry)) return null;
    if (isPlainObject(entry.owner)) return entry.owner;
    if (isPlainObject(entry.author)) return entry.author;
    return null;
  };
  const ordinaryEntryCover = (entry) => isPlainObject(entry) ? (entry.pic || entry.cover) : null;
  const parseOrdinaryLegacyTimestamp = (value) => {
    if (Number.isSafeInteger(value) && value >= 0 && value <= 4102444800) return value;
    if (typeof value !== "string" || !hasNoControlChars(value, 64) || value.length === 0) return 0;
    if (/^\d{1,10}$/.test(value)) {
      const numeric = Number(value);
      return Number.isSafeInteger(numeric) && numeric >= 0 && numeric <= 4102444800 ? numeric : 0;
    }
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    const seconds = Math.floor(parsed / 1000);
    return seconds <= 4102444800 ? seconds : 0;
  };
  const parseOrdinaryLegacyDuration = (value) => {
    if (Number.isSafeInteger(value) && value >= 0 && value <= 604800) return value;
    if (typeof value !== "string" || !hasNoControlChars(value, 32)) return 0;
    const parts = value.split(":");
    if (parts.length < 2 || parts.length > 3 || !parts.every((part) => /^\d{1,3}$/.test(part))) return 0;
    const numbers = parts.map(Number);
    const seconds = numbers.length === 2 ? numbers[0] * 60 + numbers[1] : numbers[0] * 3600 + numbers[1] * 60 + numbers[2];
    return Number.isSafeInteger(seconds) && seconds >= 0 && seconds <= 604800 ? seconds : 0;
  };
  const normalizeOrdinaryItem = (entry, config) => {
    const owner = ordinaryEntryOwner(entry);
    const stat = entry && entry.stat;
    const aid = Number(entry && (entry.aid ?? entry.id));
    const duration = entry && (entry.duration_seconds ?? entry.duration);
    const danmaku = stat && (stat.danmaku ?? stat.reply ?? stat.like);
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(aid, Number.MAX_SAFE_INTEGER)
      || aid <= 0
      || !isBvid(entry.bvid) || !hasNoControlChars(entry.title, 200)
      || !hasNoControlChars(ordinaryEntryCover(entry), 2048) || !isPlainObject(owner)
      || !isBoundedNonNegativeInteger(owner.mid, Number.MAX_SAFE_INTEGER)
      || !hasNoControlChars(owner.name, 80) || !isBoundedNonNegativeInteger(duration, 604800)
      || !isPlainObject(stat) || !isBoundedNonNegativeInteger(stat.view, 1000000000000)
      || !isBoundedNonNegativeInteger(danmaku, 1000000000000)) return null;
    const cover = normalizeRecommendationCover(ordinaryEntryCover(entry));
    if (!cover) return null;
    return Object.freeze({
      aid, bvid: entry.bvid, title: entry.title, cover,
      duration, view: stat.view, danmaku, ownerMid: owner.mid, ownerName: owner.name,
      href: `https://www.bilibili.com/video/${entry.bvid}`,
      ownerHref: `https://space.bilibili.com/${owner.mid}`
    });
  };
  const normalizeOrdinaryRank = (entry, rank, config) => {
    const owner = ordinaryEntryOwner(entry);
    const stat = isPlainObject(entry && entry.stat) ? entry.stat : null;
    const ownerMid = Number.isSafeInteger(entry && entry.mid) ? entry.mid : owner && owner.mid;
    const ownerName = typeof (entry && entry.author) === "string" ? entry.author : owner && owner.name;
    const view = stat ? stat.view : entry && entry.play;
    const danmaku = stat ? (stat.danmaku ?? stat.video_review ?? stat.reply ?? 0) : entry && (entry.video_review ?? entry.danmaku ?? 0);
    const favorite = stat ? (stat.favorite ?? stat.favorites ?? 0) : entry && (entry.favorites ?? 0);
    const coin = stat ? (stat.coin ?? stat.coins ?? 0) : entry && (entry.coins ?? 0);
    const pubdate = parseOrdinaryLegacyTimestamp(entry && (entry.pubdate ?? entry.ctime ?? entry.create_time ?? entry.create));
    const duration = parseOrdinaryLegacyDuration(entry && (entry.duration_seconds ?? entry.duration ?? 0));
    const aid = Number(entry && entry.aid);
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(aid, Number.MAX_SAFE_INTEGER)
      || aid <= 0
      || !isBvid(entry.bvid) || !hasNoControlChars(entry.title, 200)
      || !hasNoControlChars(ordinaryEntryCover(entry), 2048)
      || !isBoundedNonNegativeInteger(ownerMid, Number.MAX_SAFE_INTEGER)
      || !hasNoControlChars(ownerName, 80)
      || !isBoundedNonNegativeInteger(view, 1000000000000)
      || !isBoundedNonNegativeInteger(danmaku, 1000000000000)
      || !isBoundedNonNegativeInteger(favorite, 1000000000000)
      || !isBoundedNonNegativeInteger(coin, 1000000000000)
      || !Number.isSafeInteger(pubdate) || pubdate < 0 || pubdate > 4102444800
      || !Number.isSafeInteger(duration) || duration < 0 || duration > 604800) return null;
    const cover = normalizeRecommendationCover(ordinaryEntryCover(entry));
    if (!cover) return null;
    return Object.freeze({
      rank, aid, bvid: entry.bvid, title: entry.title, cover,
      href: `https://www.bilibili.com/video/${entry.bvid}`,
      ownerMid, ownerName, ownerHref: `https://space.bilibili.com/${ownerMid}`,
      pubdate, view, danmaku, favorite, coin
    });
  };
  const isOrdinaryListEnvelope = (raw, config) => isPlainObject(raw)
    && raw.code === 0 && isPlainObject(raw.data)
    && ((config.list === "pgcFeed" && Array.isArray(raw.data.modules) && raw.data.modules.length <= 32)
      || (config.list === "information" && Array.isArray(raw.data.items))
      || ((config.list === "newlist" || config.list === "regionFeed") && Array.isArray(raw.data.archives)))
    && (config.list === "pgcFeed" ? raw.data.modules.some((module) => isPlainObject(module)
        && module.style === "web_feed_v2" && module.title === "更多推荐"
        && Array.isArray(module.items) && module.items.length <= 32)
      : config.list === "information" ? raw.data.items.length <= 12
      : config.list === "regionFeed" ? raw.data.archives.length <= 15
        : raw.data.archives.length <= 12);
  const isOrdinaryRankEnvelope = (raw, config) => raw === null || (config && config.rank
    && (config.rank.kind === "video"
      ? videoRankEntries(raw) !== null
      : isPlainObject(raw) && raw.code === 0 && isPlainObject(raw.data)
        && Array.isArray(raw.data.list) && raw.data.list.length <= 100));
  const normalizePgcOrdinaryRank = (entry, rank) => {
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.rank, Number.MAX_SAFE_INTEGER)
      || entry.rank < 1
      || !isBoundedNonNegativeInteger(entry.season_id, Number.MAX_SAFE_INTEGER)
      || entry.season_id <= 0
      || !hasNoControlChars(entry.title, 200)
      || entry.title.length === 0) return null;
    const cover = normalizeVideoCover(entry.cover);
    if (!cover) return null;
    const newEpisode = isPlainObject(entry.new_ep) && typeof entry.new_ep.index_show === "string"
      ? entry.new_ep.index_show : "";
    const updateText = newEpisode || (typeof entry.desc === "string" ? entry.desc : "");
    const badgeText = isPlainObject(entry.badge_info) && typeof entry.badge_info.text === "string"
      ? entry.badge_info.text : "";
    const scoreText = typeof entry.rating === "string" ? entry.rating : "";
    if (![updateText, badgeText, scoreText].every((value) => hasNoControlChars(value, 80))) return null;
    return Object.freeze({
      seasonId: entry.season_id,
      title: entry.title,
      cover,
      href: `https://www.bilibili.com/bangumi/play/ss${entry.season_id}`,
      badgeText,
      updateText,
      scoreText,
      rank
    });
  };
  const normalizePgcFloorItem = (entry, config) => {
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.episode_id, Number.MAX_SAFE_INTEGER) || entry.episode_id <= 0
      || !isBoundedNonNegativeInteger(entry.season_id, Number.MAX_SAFE_INTEGER) || entry.season_id <= 0
      || entry.season_type !== config.seasonType
      || !hasNoControlChars(entry.title, 200) || entry.title.length === 0
      || !hasNoControlChars(entry.sub_title || "", 200)
      || !hasNoControlChars(entry.rating || "", 32)) return null;
    const hoverCover = isPlainObject(entry.hover) ? normalizeVideoCover(entry.hover.img) : null;
    const cover = normalizeVideoCover(entry.cover) || hoverCover;
    if (!cover) return null;
    return Object.freeze({
      episodeId: entry.episode_id,
      seasonId: entry.season_id,
      title: entry.title,
      cover,
      subtitle: entry.sub_title || "",
      rating: entry.rating || "",
      href: `https://www.bilibili.com/bangumi/play/ep${entry.episode_id}`
    });
  };
  const normalizeCheeseCover = (value) => {
    if (!hasNoControlChars(value, 2048)) return null;
    const normalized = value.startsWith("//") ? `https:${value}` : value;
    let parsed;
    try { parsed = new URL(normalized); } catch { return null; }
    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:")
      || !["archive.biliimg.com", "i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname.toLowerCase())
      || parsed.username !== "" || parsed.password !== "" || parsed.port !== ""
      || parsed.search !== "" || parsed.hash !== "" || !parsed.pathname.startsWith("/bfs/archive/")) return null;
    parsed.protocol = "https:";
    return parsed.href;
  };
  const normalizeCheeseItem = (entry) => {
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.id, Number.MAX_SAFE_INTEGER) || entry.id <= 0
      || !hasNoControlChars(entry.title, 200) || entry.title.length === 0
      || !hasNoControlChars(entry.up_name, 80) || entry.up_name.length === 0
      || !isBoundedNonNegativeInteger(entry.up_id, Number.MAX_SAFE_INTEGER) || entry.up_id <= 0
      || !isBoundedNonNegativeInteger(entry.play, 1000000000000)
      || !hasNoControlChars(entry.update_info || "", 80)) return null;
    const cover = normalizeCheeseCover(entry.cover);
    if (!cover) return null;
    return Object.freeze({ seasonId: entry.id, title: entry.title, cover, ownerMid: entry.up_id,
      ownerName: entry.up_name, ownerHref: `https://space.bilibili.com/${entry.up_id}`,
      play: entry.play, updateText: entry.update_info || "",
      href: `https://www.bilibili.com/cheese/play/ss${entry.id}` });
  };
  const normalizeCheeseRank = (entry, rank) => {
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.season_id, Number.MAX_SAFE_INTEGER) || entry.season_id <= 0
      || !hasNoControlChars(entry.season_title, 200) || entry.season_title.length === 0
      || !hasNoControlChars(entry.up_name, 80) || entry.up_name.length === 0
      || !isBoundedNonNegativeInteger(entry.stat_view, 1000000000000)
      || !isBoundedNonNegativeInteger(entry.ep_count, 1000000)) return null;
    const cover = normalizeCheeseCover(entry.season_cover);
    if (!cover) return null;
    return Object.freeze({ rank, seasonId: entry.season_id, title: entry.season_title, cover,
      ownerName: entry.up_name, play: entry.stat_view, episodeCount: entry.ep_count,
      href: `https://www.bilibili.com/cheese/play/ss${entry.season_id}` });
  };
  const projectOrdinaryZoneFloor = (type, listRaw, rankRaw, batch) => {
    const config = OPERATION_ROUTES.ORDINARY_ZONE_FLOOR[type];
    if (config && config.list === "cheese") {
      if (!isPlainObject(listRaw) || listRaw.code !== 0 || !isPlainObject(listRaw.data)
        || !Array.isArray(listRaw.data.season)) throw new Error("schema");
      const source = listRaw.data.season;
      const offset = source.length > 0 ? (batch * 4) % source.length : 0;
      const ordered = source.map((_, index) => source[(index + offset) % source.length]);
      const items = [];
      const seen = new Set();
      for (const entry of ordered) {
        if (items.length >= 12) break;
        const item = normalizeCheeseItem(entry);
        if (!item || seen.has(item.seasonId)) continue;
        seen.add(item.seasonId); items.push(item);
      }
      const ranks = [];
      const rankEntries = isPlainObject(rankRaw) && rankRaw.code === 0 && isPlainObject(rankRaw.data)
        && Array.isArray(rankRaw.data.season_hot_list) ? rankRaw.data.season_hot_list : [];
      for (const entry of rankEntries) {
        if (ranks.length >= 100) break;
        const item = normalizeCheeseRank(entry, ranks.length + 1);
        if (item) ranks.push(item);
      }
      const status = items.length >= 8 ? "success" : (items.length > 0 ? "partial" : "empty");
      return Object.freeze({ type, batch, itemType: "cheese", rankType: "cheese", status,
        items: Object.freeze(items), ranks: Object.freeze(ranks) });
    }
    if (!config || !isOrdinaryListEnvelope(listRaw, config)
      || (config.rank === null && rankRaw !== null)) throw new Error("schema");
    const usableRankRaw = config.rank && isOrdinaryRankEnvelope(rankRaw, config) ? rankRaw : null;
    const pgcFeedModule = config.list === "pgcFeed"
      ? listRaw.data.modules.find((module) => isPlainObject(module) && module.style === "web_feed_v2" && module.title === "更多推荐")
      : null;
    const sourceItems = pgcFeedModule ? pgcFeedModule.items
      : config.list === "information" ? listRaw.data.items : listRaw.data.archives;
    const orderedSourceItems = config.list === "pgcFeed" && sourceItems.length > 0
      ? sourceItems.map((_, index) => sourceItems[(index + ((batch * 4) % sourceItems.length)) % sourceItems.length])
      : sourceItems;
    const items = [];
    const seen = new Set();
    for (const entry of orderedSourceItems) {
      if (items.length >= (config.list === "pgcFeed" ? 12 : config.list === "regionFeed" ? 10 : 12)) break;
      const item = config.list === "pgcFeed" ? normalizePgcFloorItem(entry, config) : normalizeOrdinaryItem(entry, config);
      const identity = item && (item.bvid || `ep${item.episodeId}`);
      if (!item || seen.has(identity)) continue;
      seen.add(identity);
      items.push(item);
    }
    const ranks = [];
    const rankEntries = usableRankRaw
      ? (config.rank.kind === "video" ? videoRankEntries(usableRankRaw) : usableRankRaw.data.list)
      : [];
    for (const entry of rankEntries) {
      if (ranks.length >= 100) break;
      const item = config.rank && config.rank.kind === "pgc"
        ? normalizePgcOrdinaryRank(entry, ranks.length + 1)
        : normalizeOrdinaryRank(entry, ranks.length + 1, config);
      if (item) ranks.push(item);
    }
    const status = items.length >= 8 ? "success" : (items.length > 0 ? "partial" : "empty");
    const itemType = config.list === "pgcFeed" ? "pgc" : "video";
    const rankType = config.rank ? config.rank.kind : "none";
    return Object.freeze({ type, batch, itemType, rankType, status, items: Object.freeze(items), ranks: Object.freeze(ranks) });
  };
  const normalizeReadArticle = (entry) => {
    const author = isPlainObject(entry && entry.author) ? entry.author : null;
    const stats = isPlainObject(entry && entry.stats) ? entry.stats : null;
    const id = Number(entry && entry.id);
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(id, Number.MAX_SAFE_INTEGER) || id <= 0
      || !hasNoControlChars(entry.title, 200) || entry.title.length === 0
      || !author || !isBoundedNonNegativeInteger(author.mid, Number.MAX_SAFE_INTEGER) || author.mid <= 0
      || !hasNoControlChars(author.name, 80) || author.name.length === 0
      || !stats || !isBoundedNonNegativeInteger(stats.view, 1000000000000)
      || !isBoundedNonNegativeInteger(stats.reply, 1000000000000)
      || !Array.isArray(entry.image_urls) || entry.image_urls.length === 0) return null;
    const cover = normalizeVideoCover(entry.image_urls[0]);
    if (!cover) return null;
    return Object.freeze({
      id,
      title: entry.title,
      cover,
      authorMid: author.mid,
      authorName: author.name,
      authorHref: `https://space.bilibili.com/${author.mid}`,
      view: stats.view,
      reply: stats.reply,
      href: `https://www.bilibili.com/read/cv${id}/?from=homepage_0`
    });
  };
  const normalizeReadRank = (entry, rank) => {
    const id = Number(entry && entry.id);
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(id, Number.MAX_SAFE_INTEGER) || id <= 0
      || !hasNoControlChars(entry.title, 200) || entry.title.length === 0
      || !Array.isArray(entry.image_urls) || entry.image_urls.length === 0) return null;
    const cover = normalizeVideoCover(entry.image_urls[0]);
    if (!cover) return null;
    return Object.freeze({ id, rank, title: entry.title, cover, href: `https://www.bilibili.com/read/cv${id}/?from=homepage_1` });
  };
  const isReadRecommendEnvelope = (raw) => isPlainObject(raw)
    && raw.code === 0 && Array.isArray(raw.data) && raw.data.length <= 50;
  const isReadRankEnvelope = (raw) => isPlainObject(raw)
    && raw.code === 0 && Array.isArray(raw.data) && raw.data.length <= 256;
  const projectReadFloor = (recommendRaw, rankRaw, batch) => {
    if (!isReadRecommendEnvelope(recommendRaw) || !isReadRankEnvelope(rankRaw)) throw new Error("schema");
    const ranks = [];
    const rankIds = new Set();
    for (const entry of rankRaw.data) {
      if (ranks.length >= 10) break;
      const item = normalizeReadRank(entry, ranks.length + 1);
      if (!item || rankIds.has(item.id)) continue;
      rankIds.add(item.id);
      ranks.push(item);
    }
    const pool = [];
    const poolIds = new Set();
    for (const entry of recommendRaw.data) {
      const item = normalizeReadArticle(entry);
      if (!item || rankIds.has(item.id) || poolIds.has(item.id)) continue;
      poolIds.add(item.id);
      pool.push(item);
    }
    const articles = [];
    if (pool.length > 0) {
      const offset = (batch * 8) % pool.length;
      for (let index = 0; index < pool.length && articles.length < 8; index += 1) {
        articles.push(pool[(offset + index) % pool.length]);
      }
    }
    const status = articles.length >= 4 ? "success" : articles.length > 0 ? "partial" : "empty";
    return Object.freeze({ articles: Object.freeze(articles), batch, ranks: Object.freeze(ranks), status });
  };
  const normalizeLiveFloorRoom = (entry) => {
    const areaName = entry && (entry.area_v2_name || entry.area_name || entry.parent_name || "");
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.roomid, 100000000000)
      || entry.roomid <= 0
      || !isLiveText(entry.title, 256)
      || !isLiveText(entry.uname, 256)
      || (areaName !== "" && !isLiveText(areaName, 128))
      || !isBoundedNonNegativeInteger(entry.online, 1000000000000)) return null;
    const cover = normalizeLiveAssetUrl(entry.cover || entry.user_cover || entry.system_cover);
    const keyframe = normalizeLiveAssetUrl(entry.keyframe || entry.cover || entry.user_cover || entry.system_cover);
    const face = normalizeLiveAssetUrl(entry.face);
    if (!cover || !keyframe || !face) return null;
    return Object.freeze({
      roomId: entry.roomid,
      title: entry.title,
      href: `https://live.bilibili.com/${entry.roomid}`,
      cover,
      keyframe,
      face,
      uname: entry.uname,
      areaName,
      online: entry.online
    });
  };
  const projectLiveFloorRooms = (source, limit) => {
    const rooms = [];
    const seen = new Set();
    for (const entry of source) {
      if (rooms.length >= limit) break;
      const room = normalizeLiveFloorRoom(entry);
      if (!room || seen.has(room.roomId)) continue;
      seen.add(room.roomId);
      rooms.push(room);
    }
    return Object.freeze(rooms);
  };
  const normalizeLiveFloorRank = (entry) => {
    if (!isPlainObject(entry)
      || !isBoundedNonNegativeInteger(entry.roomid, 100000000000) || entry.roomid <= 0
      || !isLiveText(entry.title, 256) || !isLiveText(entry.uname, 256)
      || !isBoundedNonNegativeInteger(entry.online, 1000000000000)) return null;
    const face = normalizeLiveAssetUrl(entry.face);
    if (!face) return null;
    return Object.freeze({ roomId: entry.roomid, title: entry.title,
      href: `https://live.bilibili.com/${entry.roomid}`, face,
      uname: entry.uname, online: entry.online });
  };
  const projectLiveFloorRanks = (source) => {
    const ranks = [];
    const seen = new Set();
    for (const entry of source) {
      if (ranks.length >= 6) break;
      const rank = normalizeLiveFloorRank(entry);
      if (!rank || seen.has(rank.roomId)) continue;
      seen.add(rank.roomId); ranks.push(rank);
    }
    return Object.freeze(ranks);
  };
  const projectLiveFloorInitial = (raw) => {
    if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.data)
      || !Array.isArray(raw.data.recommend_room_list)
      || !Array.isArray(raw.data.ranking_list)
      || !isBoundedNonNegativeInteger(raw.data.online_total, 1000000000000)) throw new Error("schema");
    return Object.freeze({
      onlineTotal: raw.data.online_total,
      rooms: projectLiveFloorRooms(raw.data.recommend_room_list, 12),
      ranks: projectLiveFloorRanks(raw.data.ranking_list)
    });
  };
  const projectLiveFloorMore = (raw) => {
    if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.data)
      || !Array.isArray(raw.data.recommend_room_list)) throw new Error("schema");
    return Object.freeze({ rooms: projectLiveFloorRooms(raw.data.recommend_room_list, 12) });
  };
  const projectLiveFloorFollowing = (raw) => {
    if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.data)
      || !Array.isArray(raw.data.list)) throw new Error("schema");
    return Object.freeze({ rooms: projectLiveFloorRooms(raw.data.list, 12) });
  };
  const normalizeBannerText = (value, fallback = "") => typeof value === "string"
    && value.length <= 160 && !/[\u0000-\u001F\u007F]/.test(value) ? value.trim() : fallback;
  const normalizeBannerAsset = (value, mediaType = "image/webp") => {
    if (typeof value !== "string" || value.length === 0 || value.length > 2048 || /[\u0000-\u001F\u007F]/.test(value)) return null;
    let parsed;
    try { parsed = new URL(value.startsWith("//") ? `https:${value}` : value); } catch { return null; }
    if (parsed.protocol === "http:") parsed.protocol = "https:";
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || parsed.hash
      || !["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      || !/^\/bfs\/(?:archive|vc)\//.test(parsed.pathname)) return null;
    const lowerPath = parsed.pathname.toLowerCase();
    if (mediaType === "video/webm" && !lowerPath.endsWith(".webm")) return null;
    if (mediaType !== "video/webm" && !/\.(?:png|jpe?g|webp)$/.test(lowerPath)) return null;
    return parsed.href;
  };
  const bannerNumber = (value, fallback, min, max) => Number.isFinite(value) && value >= min && value <= max ? value : fallback;
  const bannerVector = (value) => Array.isArray(value) && value.length >= 2
    ? [bannerNumber(Number(value[0]), 0, -10000, 10000), bannerNumber(Number(value[1]), 0, -10000, 10000)] : [0, 0];
  const bannerCurve = (value) => Array.isArray(value) && value.length === 4
    && bannerNumber(Number(value[0]), NaN, 0, 1) === Number(value[0])
    && bannerNumber(Number(value[1]), NaN, -100, 100) === Number(value[1])
    && bannerNumber(Number(value[2]), NaN, 0, 1) === Number(value[2])
    && bannerNumber(Number(value[3]), NaN, -100, 100) === Number(value[3])
    ? Object.freeze(value.map((item) => Number(item))) : null;
  const bannerWrap = (value) => value === "alternate" ? "alternate" : value === "clamp" ? "clamp" : "";
  const projectBannerMotion = (entry) => {
    const scale = isPlainObject(entry.scale) ? entry.scale : {};
    const rotate = isPlainObject(entry.rotate) ? entry.rotate : {};
    const translate = isPlainObject(entry.translate) ? entry.translate : {};
    const blur = isPlainObject(entry.blur) ? entry.blur : {};
    const opacity = isPlainObject(entry.opacity) ? entry.opacity : {};
    const motion = Object.freeze({
      scaleOffset: bannerNumber(Number(scale.offset), 0, -10, 10),
      scaleCurve: bannerCurve(scale.offsetCurve),
      rotateOffset: bannerNumber(Number(rotate.offset), 0, -360, 360),
      rotateCurve: bannerCurve(rotate.offsetCurve),
      translateCurve: bannerCurve(translate.offsetCurve),
      blurOffset: bannerNumber(Number(blur.offset), 0, -100, 100),
      blurCurve: bannerCurve(blur.offsetCurve),
      blurWrap: bannerWrap(blur.wrap),
      opacityOffset: bannerNumber(Number(opacity.offset), 0, -1, 1),
      opacityCurve: bannerCurve(opacity.offsetCurve),
      opacityWrap: bannerWrap(opacity.wrap)
    });
    // A split-layer entry is always rendered by the official motion path,
    // even when this particular layer has only an initial scale and no curve.
    return motion;
  };
  const bannerMediaType = (value) => {
    if (typeof value !== "string") return null;
    const lowerPath = value.split(/[?#]/, 1)[0].toLowerCase();
    if (lowerPath.endsWith(".webm")) return "video/webm";
    if (lowerPath.endsWith(".png")) return "image/png";
    if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) return "image/jpeg";
    if (lowerPath.endsWith(".webp")) return "image/webp";
    return null;
  };
  const projectBannerLayer = (entry, index) => {
    if (!isPlainObject(entry) || !Array.isArray(entry.resources) || !isPlainObject(entry.resources[0])) return null;
    const src = entry.resources[0].src;
    const mediaType = bannerMediaType(src);
    if (!mediaType) return null;
    const assetRef = normalizeBannerAsset(src, mediaType);
    if (!assetRef) return null;
    const initialTranslate = bannerVector(entry.translate && entry.translate.initial);
    const offsetTranslate = bannerVector(entry.translate && entry.translate.offset);
    const initialScale = bannerNumber(Number(entry.scale && entry.scale.initial), 1, 0.01, 10);
    const rotation = bannerNumber(Number(entry.rotate && entry.rotate.offset), 0, -360, 360);
    const blur = bannerNumber(Number(entry.blur && entry.blur.initial), 0, 0, 100);
    const opacity = bannerNumber(Number(entry.opacity && entry.opacity.initial), 1, 0, 1);
    const motion = projectBannerMotion(entry);
    return Object.freeze({
      id: `official-layer-${index + 1}`,
      type: mediaType,
      width: 1920,
      height: 180,
      transform: Object.freeze([1, 0, 0, 1, initialTranslate[0], initialTranslate[1]]),
      offset: Object.freeze({ x: offsetTranslate[0], y: offsetTranslate[1] }),
      scale: initialScale,
      rotation,
      opacity,
      blur,
      motion,
      assetRef
    });
  };
  const projectBannerCurrent = (raw) => {
    if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.data)) throw new Error("schema");
    const backgroundRef = normalizeBannerAsset(raw.data.pic, bannerMediaType(raw.data.pic) || "image/webp");
    if (!backgroundRef) throw new Error("schema");
    const logoRef = raw.data.litpic
      ? normalizeBannerAsset(raw.data.litpic, bannerMediaType(raw.data.litpic) || "image/webp")
      : null;
    let configuredLayers = [];
    if (raw.data.is_split_layer === 1 && typeof raw.data.split_layer === "string") {
      try {
        const parsed = JSON.parse(raw.data.split_layer);
        if (isPlainObject(parsed) && Array.isArray(parsed.layers)) {
          configuredLayers = parsed.layers.map(projectBannerLayer).filter(Boolean);
        }
      } catch (_) {
        configuredLayers = [];
      }
    }
    const layers = configuredLayers.length > 0 ? configuredLayers : [Object.freeze({
      id: "official-background",
      type: bannerMediaType(backgroundRef) || "image/webp",
      width: 1920,
      height: 180,
      transform: Object.freeze([1, 0, 0, 1, 0, 0]),
      offset: Object.freeze({ x: 0, y: 0 }),
      scale: 1,
      rotation: 0,
      opacity: 1,
      blur: 0,
      assetRef: backgroundRef
    })];
    return Object.freeze({
      schemaVersion: 1,
      source: "official",
      id: `official-header-${Number.isSafeInteger(raw.data.id) && raw.data.id > 0 ? raw.data.id : "current"}`,
      name: normalizeBannerText(raw.data.name, "官方 Banner") || "官方 Banner",
      canvas: Object.freeze({ width: 1920, height: 180 }),
      backgroundRef,
      logoRef,
      layers: Object.freeze(layers)
    });
  };
  const execute = async (request, controller) => {
    try {
      if (request.operation === "SHOW_LOGIN") {
        return { ok: true, data: await showMiniLogin() };
      }
      if (request.operation === "AUTH_STATUS") {
        const raw = await fetchFixed(OPERATION_ROUTES.AUTH_STATUS[0], controller.signal);
        return { ok: true, data: projectAuth(raw) };
      }
      if (request.operation === "LOGOUT") {
        const biliJct = readBiliJct();
        const body = `biliCSRF=${encodeURIComponent(biliJct)}`;
        const raw = await readJson(await global.fetch(fixedUrl(OPERATION_ROUTES.LOGOUT[0]), {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          redirect: "error",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: controller.signal
        }));
        return { ok: true, data: projectLogout(raw) };
      }
      if (request.operation === "PROFILE_STATS") {
        const raw = await fetchFixed(OPERATION_ROUTES.PROFILE_STATS[0], controller.signal);
        return { ok: true, data: projectProfileStats(raw) };
      }
      if (request.operation === "MESSAGE_SUMMARY") {
        const [msgRaw, sessionRaw] = await Promise.all(
          OPERATION_ROUTES.MESSAGE_SUMMARY.map((route) => fetchFixed(route, controller.signal))
        );
        return { ok: true, data: projectMessage(msgRaw, sessionRaw) };
      }
      if (request.operation === "DYNAMIC_SUMMARY") {
        const raw = await fetchFixed(OPERATION_ROUTES.DYNAMIC_SUMMARY[0], controller.signal);
        return { ok: true, data: projectDynamicSummary(raw) };
      }
      if (request.operation === "FAVORITE_SUMMARY") {
        const [folderRaw, laterRaw] = await Promise.all(
          OPERATION_ROUTES.FAVORITE_SUMMARY.map((route) => fetchFixed(route, controller.signal))
        );
        const navigation = normalizeFavoriteFolders(folderRaw);
        const detailValues = await Promise.all(navigation.folders.map((folder) => fetchFixed(Object.freeze({
          host: FAVORITE_DETAIL_ROUTE.host,
          path: `${FAVORITE_DETAIL_ROUTE.path}?platform=web&media_id=${folder.id}`,
          method: FAVORITE_DETAIL_ROUTE.method
        }), controller.signal)));
        return { ok: true, data: projectFavorite(folderRaw, laterRaw, detailValues) };
      }
      if (request.operation === "HISTORY_SUMMARY") {
        const rawValues = await Promise.all(
          OPERATION_ROUTES.HISTORY_SUMMARY.map((route) => fetchFixed(route, controller.signal))
        );
        return { ok: true, data: projectHistory(rawValues) };
      }
      if (request.operation === "LIVE_HOVER") {
        const raw = await fetchPublicFixed(OPERATION_ROUTES.LIVE_HOVER[0], controller.signal);
        return { ok: true, data: projectLiveHover(raw) };
      }
      if (request.operation === "PRIMARY_MENU_COUNTS") {
        const raw = await fetchPublicFixed(OPERATION_ROUTES.PRIMARY_MENU_COUNTS[0], controller.signal);
        return { ok: true, data: projectPrimaryMenuCounts(raw) };
      }
      if (request.operation === BANNER_CURRENT_OPERATION) {
        const raw = await fetchPublicFixed(OPERATION_ROUTES.BANNER_CURRENT[0], controller.signal);
        return { ok: true, data: projectBannerCurrent(raw) };
      }
      if (request.operation === "RECOMMENDATION_FEED") {
        const raw = await fetchFixed(recommendationRoute(request.batch), controller.signal);
        return { ok: true, data: projectRecommendation(raw, request.batch) };
      }
      if (request.operation === "DOUGA_FLOOR") {
        const [feedRaw, rankRaw] = await Promise.all([
          fetchFixed(dougaFeedRoute(request.batch), controller.signal),
          request.includeRank
            ? fetchCurrentVideoRanking(1005, controller.signal).catch(() => null)
            : Promise.resolve(null)
        ]);
        return { ok: true, data: projectDougaFloor(feedRaw, rankRaw, request.batch) };
      }
      if (request.operation === "ORDINARY_ZONE_FLOOR") {
        const listRoute = ordinaryZoneRoute(request.zoneType, request.batch, "list");
        const rankRoute = ordinaryZoneRoute(request.zoneType, request.batch, "rank");
        const config = OPERATION_ROUTES.ORDINARY_ZONE_FLOOR[request.zoneType];
        const listPromise = fetchFixed(listRoute, controller.signal);
        const rankPromise = request.includeRank && rankRoute
          ? (config.rank.kind === "video"
            ? fetchCurrentVideoRanking(config.rank.rid, controller.signal)
            : fetchFixed(rankRoute, controller.signal, MAX_ORDINARY_RANK_RESPONSE_TEXT_LENGTH)).catch(() => null)
          : Promise.resolve(null);
        const [listRaw, rankRaw] = await Promise.all([listPromise, rankPromise]);
        return { ok: true, data: projectOrdinaryZoneFloor(request.zoneType, listRaw, rankRaw, request.batch) };
      }
      if (request.operation === "READ_FLOOR") {
        const [recommendRaw, rankRaw] = await Promise.all([
          fetchFixed(OPERATION_ROUTES.READ_FLOOR[0], controller.signal, MAX_READ_RECOMMEND_RESPONSE_TEXT_LENGTH),
          fetchFixed(OPERATION_ROUTES.READ_FLOOR[1], controller.signal, MAX_READ_RANK_RESPONSE_TEXT_LENGTH)
        ]);
        return { ok: true, data: projectReadFloor(recommendRaw, rankRaw, request.batch) };
      }
      if (request.operation === "LIVE_FLOOR_INITIAL") {
        const raw = await fetchPublicFixed(OPERATION_ROUTES.LIVE_FLOOR_INITIAL[0], controller.signal);
        return { ok: true, data: projectLiveFloorInitial(raw) };
      }
      if (request.operation === "LIVE_FLOOR_MORE") {
        const raw = await fetchPublicFixed(OPERATION_ROUTES.LIVE_FLOOR_MORE[0], controller.signal);
        return { ok: true, data: projectLiveFloorMore(raw) };
      }
      if (request.operation === "LIVE_FLOOR_FOLLOWING") {
        const raw = await fetchFixed(OPERATION_ROUTES.LIVE_FLOOR_FOLLOWING[0], controller.signal);
        return { ok: true, data: projectLiveFloorFollowing(raw) };
      }
      if (request.operation === "WATCH_LATER_MUTATE") {
        const biliJct = readBiliJct();
        const route = OPERATION_ROUTES.WATCH_LATER_MUTATE[request.action === "add" ? 0 : 1];
        const body = `aid=${encodeURIComponent(String(request.aid))}&csrf=${encodeURIComponent(biliJct)}`;
        const raw = await readJson(await global.fetch(fixedUrl(route), {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          redirect: "error",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: controller.signal
        }));
        return { ok: true, data: projectWatchLaterMutation(raw, request.aid, request.action) };
      }
      if (request.operation === "SEARCH_SUGGEST") {
        const [defaultRaw, trendingRaw] = await Promise.all([
          fetchPublicFixed(OPERATION_ROUTES.SEARCH_SUGGEST[0], controller.signal).catch(() => null),
          fetchPublicFixed(OPERATION_ROUTES.SEARCH_SUGGEST[1], controller.signal)
        ]);
        return { ok: true, data: projectSearch(defaultRaw, trendingRaw) };
      }
      return { ok: false, kind: ERROR_KINDS.UNSUPPORTED };
    } catch (error) {
      return {
        ok: false,
        kind: error && (error.message === "cap" || error.message === "schema")
          ? ERROR_KINDS.SCHEMA
          : ERROR_KINDS.UNAVAILABLE
      };
    }
  };
  const settleLease = (lease, result) => {
    if (lease.settled) return;
    lease.settled = true;
    if (pending.get(lease.request.requestId) === lease) {
      pending.delete(lease.request.requestId);
    }
    global.clearTimeout(lease.deadlineTimer);
    if (result.kind === ERROR_KINDS.TIMEOUT) {
      lease.controller.abort();
    }
    postResponse(
      lease.request,
      result.ok,
      result.ok ? result.data : result.kind
    );
  };
  const retireLease = (lease) => {
    if (!lease || lease.settled) return;
    lease.settled = true;
    if (pending.get(lease.request.requestId) === lease) {
      pending.delete(lease.request.requestId);
    }
    global.clearTimeout(lease.deadlineTimer);
    lease.controller.abort();
  };
  const onMessage = (event) => {
    if (event.source !== global || event.origin !== ORIGIN) return;
    if (isCancel(event.data)) {
      retireLease(pending.get(event.data.requestId));
      return;
    }
    if (!isRequest(event.data)) return;
    const request = event.data;
    if (pending.has(request.requestId)) return;
    const controller = new AbortController();
    const lease = {
      request,
      controller,
      settled: false,
      deadlineTimer: null
    };
    pending.set(request.requestId, lease);
    const requestTimeout = (request.operation === "DOUGA_FLOOR" || request.operation === "ORDINARY_ZONE_FLOOR")
      && request.includeRank === true
      ? RANKING_REQUEST_TIMEOUT_MS
      : REQUEST_TIMEOUT_MS;
    lease.deadlineTimer = global.setTimeout(() => {
      settleLease(lease, { ok: false, kind: ERROR_KINDS.TIMEOUT });
    }, requestTimeout);
    execute(request, controller).then(
      (result) => settleLease(lease, result),
      () => settleLease(lease, { ok: false, kind: ERROR_KINDS.UNAVAILABLE })
    );
  };

  global.addEventListener("message", onMessage);

  if (global.__EXTENSION_B_RUN_SELF_TESTS__ === true) {
    global.__EXTENSION_B_AUTH_BRIDGE_TEST__ = Object.freeze({
      CHANNEL,
      VERSION,
      ORIGIN,
      REQUEST_ID_LENGTH,
      REQUEST_TIMEOUT_MS,
      RANKING_REQUEST_TIMEOUT_MS,
      RANKING_SESSION_TIMEOUT_MS,
      RANKING_SESSION_RETRY_DELAY_MS,
      RANKING_REQUEST_GAP_MS,
      RANKING_REFERRER,
      MINI_LOGIN_SCRIPT_URL,
      OPERATIONS,
      ERROR_KINDS,
      OPERATION_ROUTES,
      ownKeys,
      isPlainObject,
      isRequestId,
      isKnownOperation,
      isRequest,
      isCancel,
      fixedUrl,
      isAllowedEnvelope,
      exactKeys,
      isSessionEnvelope,
      isAuthEnvelope,
      isAuthAvatarUrl,
      isAuthLevelInfo,
      isAuthVerification,
      isAuthMid,
      projectAuthNavigation,
      projectAuthBcoin,
      projectAuthProfile,
      projectAuth,
      isLogoutEnvelope,
      projectLogout,
      readBiliJct,
      projectWatchLaterMutation,
      isProfileStatsEnvelope,
      projectProfileStats,
      isDynamicSummaryEnvelope,
      projectDynamicSummary,
      projectMessage,
      isSummaryEnvelope,
      projectFavorite,
      projectHistory,
      normalizeVideoCover,
      normalizeFavoriteFolders,
      normalizeFavoriteItems,
      normalizeHistoryList,
      FAVORITE_DETAIL_ROUTE,
      fetchPublicFixed,
      md5Hex,
      extractWbiKey,
      signedRankingRoute,
      fetchCurrentVideoRanking,
      normalizeLiveAssetUrl,
      isLiveAssetUrl,
      isLiveSourceLink,
      isLiveHoverEnvelope,
      isLiveRoom,
      projectLiveHover,
      projectPrimaryMenuCounts,
      PRIMARY_MENU_COUNT_SOURCES,
      recommendationRoute,
      isRecommendationEnvelope,
      normalizeRecommendationCover,
      normalizeRecommendationItem,
      projectRecommendation,
      dougaFeedRoute,
      normalizeDougaItem,
      normalizeDougaRank,
      projectDougaFloor,
      ORDINARY_ZONE_TYPES,
      ordinaryZoneRoute,
      normalizeOrdinaryItem,
      normalizeOrdinaryRank,
      normalizePgcOrdinaryRank,
      normalizePgcFloorItem,
      normalizeCheeseItem,
      normalizeCheeseRank,
      parseOrdinaryLegacyTimestamp,
      parseOrdinaryLegacyDuration,
      projectOrdinaryZoneFloor,
      normalizeReadArticle,
      normalizeReadRank,
      projectReadFloor,
      normalizeLiveFloorRoom,
      normalizeLiveFloorRank,
      projectLiveFloorInitial,
      projectLiveFloorMore,
      projectLiveFloorFollowing,
      normalizeBannerAsset,
      projectBannerLayer,
      projectBannerCurrent,
      normalizeSearchDefaultUrl,
      SEARCH_MARK_KEYS,
      SEARCH_MARK_BY_ICON_URL,
      normalizeSearchMarkKey,
      normalizeSearchRemoteIcon,
      projectSearch,
      loadMiniLoginScript,
      showMiniLogin,
      CANCEL_OPERATION,
      MESSAGE_SUMMARY_EXCLUDED_ROUTES,
      execute
    });
  }
})(window);
