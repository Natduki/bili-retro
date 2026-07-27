const ROOT_URL = "https://www.bilibili.com/";
const ROOT_INDEX_URL = "https://www.bilibili.com/index.html";
const ROOT_ORIGIN = "https://www.bilibili.com";
const FOCUS_CAROUSEL_URL = "https://api.bilibili.com/x/web-show/res/locs?ids=3197&pf=0";
const SEARCH_DEFAULT_URL = "https://api.bilibili.com/x/web-interface/wbi/search/default";
const SEARCH_TRENDING_URL = "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=10&platform=web";
const SEARCH_OPERATION = "SEARCH_SUGGEST";
const SEARCH_AUTOCOMPLETE_OPERATION = "SEARCH_AUTOCOMPLETE";
const SEARCH_AUTOCOMPLETE_URL = "https://s.search.bilibili.com/main/suggest";
const MANGA_OPERATION = "MANGA_FLOOR";
const MANGA_RECOMMEND_URL = "https://manga.bilibili.com/twirp/comic.v1.Comic/GetRecommendComics";
const MANGA_FREE_URL = "https://manga.bilibili.com/twirp/comic.v1.Comic/HomeHot";
const MANGA_JAPAN_RANK_URL = "https://manga.bilibili.com/ranking/0?from=manga_homepage_ranking";
const MANGA_CHINA_RANK_URL = "https://manga.bilibili.com/ranking/1?from=manga_homepage_ranking";
const PGC_ANIME_TIMELINE_URL = "https://api.bilibili.com/pgc/web/timeline/v2?season_type=1&day_before=4&day_after=2";
const PGC_ANIME_RANK_URL = "https://api.bilibili.com/pgc/web/rank/list?season_type=1&day=3";
const PGC_GUOCHUANG_TIMELINE_URL = "https://api.bilibili.com/pgc/web/timeline/v2?season_type=4&day_before=4&day_after=2";
const PGC_GUOCHUANG_RANK_URL = "https://api.bilibili.com/pgc/season/rank/web/list?season_type=4&day=3";
const KNOWLEDGE_FEED_URL = "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1010&device=web&plat=30&web_location=333.40138";
const MUSIC_FEED_URL = "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1003&device=web&plat=30&web_location=333.40138";
const ANIMAL_FEED_URL = "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1024&device=web&plat=30&web_location=333.40138";
const FASHION_FEED_URL = "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1014&device=web&plat=30&web_location=333.40138";
const MAX_RESPONSE_BYTES = 65536;
const MAX_PGC_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_KNOWLEDGE_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_MUSIC_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_ANIMAL_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_FASHION_RESPONSE_BYTES = 2 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_MANGA_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_REQUEST_ID_LENGTH = 128;
const MAX_FOCUS_TEXT_LENGTH = 160;
const MAX_FOCUS_URL_LENGTH = 2048;
const MAX_FOCUS_QUERY_HASH_LENGTH = 512;
const MAX_COVER_URL_LENGTH = 2048;
const MAX_FOCUS_ITEMS = 20;
const MAX_PGC_TEXT_LENGTH = 512;
const MAX_PGC_SHORT_TEXT_LENGTH = 160;
const MAX_PGC_URL_LENGTH = 2048;
const MAX_PGC_ID = 999999999999999;
const MAX_PGC_TIMELINE_ITEMS_PER_TAB = 64;
const MAX_PGC_TIMELINE_ITEMS_TOTAL = 256;
const MAX_PGC_RANK_CANDIDATES = 100;
const MAX_PUBLIC_UPSTREAM_SLOTS = 4;
const PGC_CACHE_TTL_MS = 15000;
const PGC_CACHE_KEY = "PGC_ANIME_COMPOSITE|v1|season_type=1|day_before=4|day_after=2|day=3";
const PGC_GUOCHUANG_CACHE_KEY = "PGC_GUOCHUANG_COMPOSITE|v1|season_type=4|day_before=4|day_after=2|day=3";
const MAX_PGC_GUOCHUANG_TEXT_LENGTH = 160;
const MAX_PGC_GUOCHUANG_URL_LENGTH = 2048;
const MAX_PGC_GUOCHUANG_ID = Number.MAX_SAFE_INTEGER;
const MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_PER_TAB = 20;
const MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_TOTAL = 160;
const MAX_PGC_GUOCHUANG_RANK_CANDIDATES = 100;
const MAX_PGC_GUOCHUANG_RANK_ITEMS = 10;
const KNOWLEDGE_CACHE_TTL_MS = 15000;
const KNOWLEDGE_CACHE_KEY = "ORDINARY_ZONE_KNOWLEDGE_FEED|v1|display_id=1|request_cnt=15|from_region=1010";
const KNOWLEDGE_OPERATION = "ORDINARY_ZONE_KNOWLEDGE_FEED";
const KNOWLEDGE_ERROR_KINDS = Object.freeze({
  UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
  SCHEMA: "UPSTREAM_SCHEMA_INVALID",
  REDIRECTED: "UPSTREAM_REDIRECTED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED",
  PROTOCOL: "PROTOCOL_INVALID"
});
const KNOWLEDGE_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
const KNOWLEDGE_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
const MUSIC_CACHE_TTL_MS = 15000;
const MUSIC_CACHE_KEY = "ORDINARY_ZONE_MUSIC_FEED|v1|display_id=1|request_cnt=15|from_region=1003";
const MUSIC_OPERATION = "ORDINARY_ZONE_MUSIC_FEED";
const MUSIC_ERROR_KINDS = Object.freeze({
  UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
  SCHEMA: "UPSTREAM_SCHEMA_INVALID",
  REDIRECTED: "UPSTREAM_REDIRECTED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED",
  PROTOCOL: "PROTOCOL_INVALID"
});
const MUSIC_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
const MUSIC_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
const ANIMAL_OPERATION = "ORDINARY_ZONE_ANIMAL_FEED";
const FASHION_OPERATION = "ORDINARY_ZONE_FASHION_FEED";
const ANIMAL_CACHE_KEY = "ORDINARY_ZONE_ANIMAL_FEED|v1|display_id=1|request_cnt=15|from_region=1024";
const FASHION_CACHE_KEY = "ORDINARY_ZONE_FASHION_FEED|v1|display_id=1|request_cnt=15|from_region=1014";
const ANIMAL_CACHE_TTL_MS = 15000;
const FASHION_CACHE_TTL_MS = 15000;
const ANIMAL_ERROR_KINDS = Object.freeze({
  UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
  SCHEMA: "UPSTREAM_SCHEMA_INVALID",
  REDIRECTED: "UPSTREAM_REDIRECTED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED",
  PROTOCOL: "PROTOCOL_INVALID"
});
const FASHION_ERROR_KINDS = Object.freeze({
  UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
  SCHEMA: "UPSTREAM_SCHEMA_INVALID",
  REDIRECTED: "UPSTREAM_REDIRECTED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED",
  PROTOCOL: "PROTOCOL_INVALID"
});
const ANIMAL_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
const FASHION_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
const ANIMAL_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
const FASHION_BVID_RE = /^BV[A-Za-z0-9]{10}$/;

const FOCUS_ERROR_KINDS = Object.freeze({
  UNAVAILABLE: "UPSTREAM_UNAVAILABLE",
  SCHEMA: "UPSTREAM_SCHEMA_INVALID",
  REDIRECTED: "UPSTREAM_REDIRECTED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED"
});

const FOCUS_IMAGE_HOSTS = new Set([
  "i0.hdslb.com",
  "i1.hdslb.com",
  "i2.hdslb.com"
]);

const FOCUS_LINK_HOSTS = new Set([
  "bilibili.com",
  "www.bilibili.com",
  "m.bilibili.com",
  "space.bilibili.com",
  "live.bilibili.com",
  "t.bilibili.com",
  "search.bilibili.com",
  "passport.bilibili.com",
  "biligame.com",
  "www.biligame.com"
]);

const activeFocusRequests = new Map();
const activePgcAnimeRequests = new Map();
const activePgcGuochuangRequests = new Map();
const knowledgeCache = { key: KNOWLEDGE_CACHE_KEY, data: null, expiresAt: 0 };
const knowledgeInFlight = new Map();
const knowledgeGeneration = new Map();
const knowledgeAbortController = new Map();
let knowledgeLastGood = null;
const knowledgeErrorShell = new Map();
const knowledgeUiState = new Map();
const knowledgeCurrentRoots = new Map();
const musicCache = { key: MUSIC_CACHE_KEY, data: null, expiresAt: 0 };
const musicInFlight = new Map();
const musicGeneration = new Map();
const musicAbortController = new Map();
let musicLastGood = null;
const musicErrorShell = new Map();
const musicUiState = new Map();
const musicCurrentRoots = new Map();
const animalCache = { key: ANIMAL_CACHE_KEY, data: null, expiresAt: 0 };
const fashionCache = { key: FASHION_CACHE_KEY, data: null, expiresAt: 0 };
const animalInFlight = new Map();
const fashionInFlight = new Map();
const animalGeneration = new Map();
const fashionGeneration = new Map();
const animalAbortController = new Map();
const fashionAbortController = new Map();
let animalLastGood = null;
let fashionLastGood = null;
const animalErrorShell = new Map();
const fashionErrorShell = new Map();
const animalUiState = new Map();
const fashionUiState = new Map();
const animalCurrentRoots = new Map();
const fashionCurrentRoots = new Map();
const MAX_ANIMAL_UPSTREAM_SLOTS = 1;
const MAX_FASHION_UPSTREAM_SLOTS = 1;
let animalUpstreamSlots = 0;
let fashionUpstreamSlots = 0;
const MAX_MUSIC_UPSTREAM_SLOTS = 1;
let musicUpstreamSlots = 0;
const MAX_KNOWLEDGE_UPSTREAM_SLOTS = 1;
let knowledgeUpstreamSlots = 0;
let publicUpstreamSlots = 0;
let pgcAnimeCache = { key: PGC_CACHE_KEY, data: null, expiresAt: 0 };
let pgcAnimeLastGood = null;
let pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
let pgcGuochuangLastGood = null;

const unknownResult = () => ({ status: "unknown" });

const isExactRootSender = (sender) => {
  if (!sender || sender.id !== chrome.runtime.id || !sender.tab || sender.frameId !== 0) {
    return false;
  }

  try {
    const url = new URL(sender.url);
    if (
      url.origin !== ROOT_ORIGIN
      || (url.pathname !== "/" && url.pathname !== "/index.html")
      || url.search !== ""
      || url.hash !== ""
    ) {
      return false;
    }
    return sender.origin === undefined || sender.origin === url.origin;
  } catch {
    return false;
  }
};

const isAuthoritativePgcSender = (sender) => {
  if (
    !isExactRootSender(sender)
    || !sender.tab
    || !Number.isSafeInteger(sender.tab.id)
    || sender.tab.id < 0
    || sender.origin !== ROOT_ORIGIN
    || typeof sender.tab.url !== "string"
  ) {
    return false;
  }

  try {
    const url = new URL(sender.url);
    const tabUrl = new URL(sender.tab.url);
    return (
      tabUrl.href === url.href
      && tabUrl.origin === ROOT_ORIGIN
      && (tabUrl.pathname === "/" || tabUrl.pathname === "/index.html")
      && tabUrl.search === ""
      && tabUrl.hash === ""
    );
  } catch {
    return false;
  }
};

const isKnowledgeDocumentId = (value) => (
  typeof value === "string"
  && value.length > 0
  && value.length <= MAX_REQUEST_ID_LENGTH
  && /[\u0000-\u001F\u007F]/.test(value) === false
);

const isKnowledgeSender = (sender) => (
  sender
  && sender.id === chrome.runtime.id
  && sender.tab
  && Number.isSafeInteger(sender.tab.id)
  && sender.tab.id >= 0
  && sender.tab.url === ROOT_URL
  && sender.url === ROOT_URL
  && sender.origin === ROOT_ORIGIN
  && sender.frameId === 0
  && isKnowledgeDocumentId(sender.documentId)
);

const isLegacyAuthMessage = (message) => (
  message !== null
  && typeof message === "object"
  && Object.keys(message).length === 1
  && message.type === "GET_AUTH_STATUS"
);

const isPlainObject = (value) => (
  value !== null
  && typeof value === "object"
  && Array.isArray(value) === false
  && Object.getPrototypeOf(value) === Object.prototype
);

const isJsonContentType = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  const mediaType = value.split(";", 1)[0].trim().toLowerCase();
  return mediaType === "application/json"
    || mediaType === "text/json"
    || mediaType.endsWith("+json");
};

const isBoundedRequestId = (requestId) => (
  typeof requestId === "string"
  && requestId.length > 0
  && requestId.length <= MAX_REQUEST_ID_LENGTH
  && /[\u0000-\u001F\u007F]/.test(requestId) === false
);

const isExactFocusMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "FOCUS_CAROUSEL"
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isExactSearchMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === SEARCH_OPERATION
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isSearchAutocompleteTerm = (value) => typeof value === "string"
  && value.length > 0
  && value.length <= 128
  && value.trim() === value
  && /[\u0000-\u001F\u007F]/.test(value) === false;

const isExactSearchAutocompleteMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === SEARCH_AUTOCOMPLETE_OPERATION
  && isPlainObject(message.params)
  && Object.keys(message.params).sort().join("\u001F") === "term"
  && isSearchAutocompleteTerm(message.params.term)
);

const isExactFocusCancelMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "FOCUS_CAROUSEL"
);

const isExactKnowledgeMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === KNOWLEDGE_OPERATION
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isExactKnowledgeCancelMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === KNOWLEDGE_OPERATION
);

const isExactMusicMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === MUSIC_OPERATION
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isExactMusicCancelMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === MUSIC_OPERATION
);

const isMusicSender = (sender) => (
  sender
  && sender.id === chrome.runtime.id
  && sender.tab
  && Number.isSafeInteger(sender.tab.id)
  && sender.tab.id >= 0
  && sender.tab.url === ROOT_URL
  && sender.url === ROOT_URL
  && sender.origin === ROOT_ORIGIN
  && sender.frameId === 0
  && isKnowledgeDocumentId(sender.documentId)
);

const isExactPgcAnimeMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "PGC_ANIME_COMPOSITE"
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isExactPgcAnimeCancelMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "PGC_ANIME_COMPOSITE"
);

const isExactPgcGuochuangMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "PGC_GUOCHUANG_COMPOSITE"
  && isPlainObject(message.params)
  && Object.keys(message.params).length === 0
);

const isExactPgcGuochuangCancelMessage = (message) => (
  isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1"
  && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation)
  && message.generation >= 0
  && message.operation === "PGC_GUOCHUANG_COMPOSITE"
);

const reservePublicUpstreamSlots = (count) => {
  if (!Number.isSafeInteger(count) || count < 1 || publicUpstreamSlots + count > MAX_PUBLIC_UPSTREAM_SLOTS) {
    return null;
  }
  publicUpstreamSlots += count;
  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    publicUpstreamSlots -= count;
  };
};

const isPgcCacheFresh = (cache, now = Date.now()) => Boolean(
  cache
  && cache.key === PGC_CACHE_KEY
  && cache.data
  && Number.isFinite(cache.expiresAt)
  && cache.expiresAt > now
);

const isPgcGuochuangCacheFresh = (cache, now = Date.now()) => Boolean(
  cache
  && cache.key === PGC_GUOCHUANG_CACHE_KEY
  && cache.data
  && Number.isFinite(cache.expiresAt)
  && cache.expiresAt > now
);

const abortPgcChildren = (state) => {
  if (!state || !state.children) {
    return;
  }
  for (const child of state.children) {
    child.abort();
  }
};

class FocusDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

const readFocusJson = async (response, { allowMissingContentType = false } = {}) => {
  const contentType = response.headers.get("content-type");
  if (!(allowMissingContentType && contentType === null) && !isJsonContentType(contentType)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isFinite(declaredLength) || declaredLength < 0 || declaredLength > MAX_RESPONSE_BYTES) {
      throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
  }

  if (!response.body) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!(value instanceof Uint8Array)) {
        throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
      }
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RESPONSE_BYTES) {
        throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
      }
      chunks.push(value);
    }
  } catch (error) {
    try {
      await reader.cancel();
    } catch {
      // The body is already fail-closed.
    }
    if (error && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof FocusDataError) {
      throw error;
    }
    throw new FocusDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text);
  } catch {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
};

const hasDotSegment = (rawPath) => {
  for (const segment of rawPath.split("/")) {
    try {
      const decoded = decodeURIComponent(segment);
      if (decoded === "." || decoded === "..") {
        return true;
      }
    } catch {
      return true;
    }
  }
  return false;
};

const normalizeFocusUrl = (value, allowedHosts, pathPrefixes, allowHttpUpgrade) => {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > MAX_FOCUS_URL_LENGTH
    || value.trim() !== value
    || /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }

  const schemeRe = allowHttpUpgrade ? /^https?:\/\/([^/?#]*)/i : /^https:\/\/([^/?#]*)/i;
  const authorityMatch = schemeRe.exec(value);
  if (!authorityMatch) {
    return null;
  }
  const authority = authorityMatch[1];
  if (authority.includes("@") || authority.includes(":")) {
    return null;
  }

  const rawPathStart = value.indexOf("/", authorityMatch[0].length);
  const rawPathEnd = value.search(/[?#]/);
  const rawPath = rawPathStart >= 0
    ? value.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : value.length)
    : "/";
  if (hasDotSegment(rawPath)) {
    return null;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const protocolOk = allowHttpUpgrade
    ? (url.protocol === "https:" || url.protocol === "http:")
    : url.protocol === "https:";
  if (
    !protocolOk
    || url.username
    || url.password
    || url.port
    || !allowedHosts.has(url.hostname.toLowerCase())
    || url.href.length > MAX_FOCUS_URL_LENGTH
    || url.search.length > MAX_FOCUS_QUERY_HASH_LENGTH
    || url.hash.length > MAX_FOCUS_QUERY_HASH_LENGTH
  ) {
    return null;
  }

  if (pathPrefixes && pathPrefixes.some((prefix) => url.pathname.startsWith(prefix)) === false) {
    return null;
  }

  if (allowHttpUpgrade && url.protocol === "http:") { url.protocol = "https:"; }
  return url.href;
};

const normalizeFocusText = (value) => {
  if (value === undefined) {
    return "";
  }
  return typeof value === "string" && value.length <= MAX_FOCUS_TEXT_LENGTH
    ? value
    : null;
};

class PgcDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

const isBoundedPgcText = (value, maxLength, required) => (
  typeof value === "string"
  && value.length <= maxLength
  && /[\u0000-\u001F\u007F]/.test(value) === false
  && (!required || value.trim() !== "")
);

const projectPgcText = (value, maxLength, required = false) => {
  if (value === undefined && required === false) {
    return "";
  }
  if (!isBoundedPgcText(value, maxLength, required)) {
    return null;
  }
  return required ? value.trim() : value;
};

const isSafePgcId = (value) => (
  Number.isSafeInteger(value) && value >= 0 && value <= MAX_PGC_ID
);

const normalizePgcUrl = (value, kind) => {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > MAX_PGC_URL_LENGTH
    || value.trim() !== value
    || /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }

  const authorityMatch = /^https?:\/\/([^/?#]*)/i.exec(value);
  if (!authorityMatch) {
    return null;
  }
  const authority = authorityMatch[1];
  if (authority.includes("@") || authority.includes(":")) {
    return null;
  }

  const rawPathStart = value.indexOf("/", authorityMatch[0].length);
  const rawPathEnd = value.search(/[?#]/);
  const rawPath = rawPathStart >= 0
    ? value.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : value.length)
    : "/";
  if (hasDotSegment(rawPath)) {
    return null;
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.username || url.password || url.port || url.search || url.hash || url.href.length > MAX_PGC_URL_LENGTH) {
    return null;
  }
  if (kind === "cover") {
    if (
      (url.protocol !== "http:" && url.protocol !== "https:")
      || !FOCUS_IMAGE_HOSTS.has(url.hostname.toLowerCase())
      || !url.pathname.startsWith("/bfs/bangumi/")
    ) {
      return null;
    }
    url.protocol = "https:";
    return url.href;
  }
  if (
    url.protocol !== "https:"
    || url.hostname.toLowerCase() !== "www.bilibili.com"
    || !url.pathname.startsWith("/bangumi/play/")
  ) {
    return null;
  }
  return url.href;
};

const projectPgcTimelineItem = (source) => {
  if (!isPlainObject(source) || !isSafePgcId(source.season_id) || !isSafePgcId(source.episode_id)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const title = projectPgcText(source.title, MAX_PGC_TEXT_LENGTH, true);
  const coverUrl = normalizePgcUrl(source.square_cover, "cover") || normalizePgcUrl(source.cover, "cover");
  const updateText = projectPgcText(source.pub_index, MAX_PGC_SHORT_TEXT_LENGTH);
  const pubTime = projectPgcText(source.pub_time, MAX_PGC_SHORT_TEXT_LENGTH);
  if (!title || !coverUrl || updateText === null || pubTime === null) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return {
    seasonId: source.season_id,
    episodeId: source.episode_id,
    title,
    coverUrl,
    updateText,
    pubTime
  };
};

const projectPgcRankItem = (source, seenRanks) => {
  if (
    !isPlainObject(source)
    || !Number.isSafeInteger(source.rank)
    || source.rank < 1
    || !isSafePgcId(source.season_id)
  ) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const title = projectPgcText(source.title, MAX_PGC_TEXT_LENGTH, true);
  if (!title || seenRanks.has(source.rank)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  seenRanks.add(source.rank);

  let linkUrl;
  if (source.url === undefined || source.url === "") {
    linkUrl = `https://www.bilibili.com/bangumi/play/ss${source.season_id}`;
  } else {
    if (typeof source.url !== "string") {
      throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
    linkUrl = normalizePgcUrl(source.url, "rank");
  }
  const newEpisode = isPlainObject(source.new_ep) ? source.new_ep.index_show : undefined;
  const badgeInfo = isPlainObject(source.badge_info) ? source.badge_info.text : undefined;
  const updateText = typeof newEpisode === "string"
    ? projectPgcText(newEpisode, MAX_PGC_SHORT_TEXT_LENGTH)
    : "";
  const badgeText = typeof badgeInfo === "string"
    ? projectPgcText(badgeInfo, MAX_PGC_SHORT_TEXT_LENGTH)
    : "";
  if (!linkUrl || updateText === null || badgeText === null) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return {
    rank: source.rank,
    seasonId: source.season_id,
    title,
    linkUrl,
    updateText,
    badgeText
  };
};

const PGC_TAB_DEFINITIONS = Object.freeze([
  ["latest", "最新"],
  ["monday", "周一"],
  ["tuesday", "周二"],
  ["wednesday", "周三"],
  ["thursday", "周四"],
  ["friday", "周五"],
  ["saturday", "周六"],
  ["sunday", "周日"]
]);

const projectPgcAnimeComposite = (timelinePayload, rankPayload) => {
  if (!isPlainObject(timelinePayload) || !Number.isSafeInteger(timelinePayload.code)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  if (timelinePayload.code !== 0) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }
  if (
    !isPlainObject(timelinePayload.result)
    || !Array.isArray(timelinePayload.result.latest)
    || !Array.isArray(timelinePayload.result.timeline)
    || timelinePayload.result.latest.length > MAX_PGC_TIMELINE_ITEMS_PER_TAB
    || timelinePayload.result.timeline.length !== 7
  ) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const weekdaySegments = new Map();
  let todayCount = 0;
  let timelineItemCount = 0;
  for (const segment of timelinePayload.result.timeline) {
    if (
      !isPlainObject(segment)
      || !Number.isSafeInteger(segment.day_of_week)
      || segment.day_of_week < 1
      || segment.day_of_week > 7
      || weekdaySegments.has(segment.day_of_week)
      || (segment.is_today !== 0 && segment.is_today !== 1)
      || !Array.isArray(segment.episodes)
      || segment.episodes.length > MAX_PGC_TIMELINE_ITEMS_PER_TAB
    ) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
    if (segment.is_today === 1) {
      todayCount += 1;
    }
    weekdaySegments.set(segment.day_of_week, segment);
  }
  if (weekdaySegments.size !== 7 || todayCount > 1) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const tabs = [{
    key: PGC_TAB_DEFINITIONS[0][0],
    label: PGC_TAB_DEFINITIONS[0][1],
    isToday: false,
    items: timelinePayload.result.latest.map(projectPgcTimelineItem)
  }];
  timelineItemCount += tabs[0].items.length;
  for (let day = 1; day <= 7; day += 1) {
    const segment = weekdaySegments.get(day);
    const items = segment.episodes.map(projectPgcTimelineItem);
    timelineItemCount += items.length;
    tabs.push({
      key: PGC_TAB_DEFINITIONS[day][0],
      label: PGC_TAB_DEFINITIONS[day][1],
      isToday: segment.is_today === 1,
      items
    });
  }
  if (timelineItemCount > MAX_PGC_TIMELINE_ITEMS_TOTAL) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  if (!isPlainObject(rankPayload) || !Number.isSafeInteger(rankPayload.code)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  if (rankPayload.code !== 0) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }
  if (
    !isPlainObject(rankPayload.result)
    || !Array.isArray(rankPayload.result.list)
    || rankPayload.result.list.length > MAX_PGC_RANK_CANDIDATES
  ) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const seenRanks = new Set();
  const rankCandidates = rankPayload.result.list.map((item) => projectPgcRankItem(item, seenRanks));
  const rankItems = rankCandidates
    .filter((item) => item.rank <= 10)
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 10);
  if (rankItems.length === 0) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return { tabs, rankItems };
};

const hasOwnProtoKey = (value) => (
  isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, "__proto__")
);

const isGuochuangPlainObject = (value) => isPlainObject(value) && !hasOwnProtoKey(value);

const isBoundedGuochuangText = (value, required = false) => (
  typeof value === "string"
  && value.length <= MAX_PGC_GUOCHUANG_TEXT_LENGTH
  && /[\u0000-\u001F\u007F]/.test(value) === false
  && (!required || value.trim() !== "")
);

const isSafeGuochuangId = (value) => (
  Number.isSafeInteger(value) && value >= 0 && value <= MAX_PGC_GUOCHUANG_ID
);

const normalizeGuochuangUrl = (value, kind) => {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > MAX_PGC_GUOCHUANG_URL_LENGTH
    || value.trim() !== value
    || /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }

  const normalizedValue = kind === "cover" && value.startsWith("http://")
    ? `https://${value.slice("http://".length)}`
    : value;
  const authorityMatch = /^https:\/\/([^/?#]*)/i.exec(normalizedValue);
  if (!authorityMatch || authorityMatch[1].includes("@") || authorityMatch[1].includes(":")) {
    return null;
  }
  const rawPathStart = normalizedValue.indexOf("/", authorityMatch[0].length);
  const rawPathEnd = normalizedValue.search(/[?#]/);
  const rawPath = rawPathStart >= 0
    ? normalizedValue.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : normalizedValue.length)
    : "/";
  if (hasDotSegment(rawPath)) {
    return null;
  }

  let url;
  try {
    url = new URL(normalizedValue);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:"
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || url.href.length > MAX_PGC_GUOCHUANG_URL_LENGTH
  ) {
    return null;
  }
  if (kind === "cover") {
    if (
      !new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com"]).has(url.hostname.toLowerCase())
      || !url.pathname.startsWith("/bfs/bangumi/")
    ) {
      return null;
    }
  } else if (
    url.hostname.toLowerCase() !== "www.bilibili.com"
    || !url.pathname.startsWith("/bangumi/play/")
  ) {
    return null;
  }
  return url.href;
};

const projectGuochuangTimelineItem = (source) => {
  if (!isGuochuangPlainObject(source) || !isSafeGuochuangId(source.season_id) || !isSafeGuochuangId(source.episode_id)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const title = isBoundedGuochuangText(source.title, true) ? source.title.trim() : null;
  let coverUrl = null;
  if (Object.prototype.hasOwnProperty.call(source, "square_cover")) {
    coverUrl = normalizeGuochuangUrl(source.square_cover, "cover");
  } else {
    coverUrl = normalizeGuochuangUrl(source.cover, "cover");
  }
  const updateText = source.pub_index === undefined
    ? ""
    : isBoundedGuochuangText(source.pub_index) ? source.pub_index : null;
  const pubTime = source.pub_time === undefined
    ? ""
    : isBoundedGuochuangText(source.pub_time) ? source.pub_time : null;
  if (!title || !coverUrl || updateText === null || pubTime === null) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return { seasonId: source.season_id, episodeId: source.episode_id, title, coverUrl, updateText, pubTime };
};

const projectGuochuangRankItem = (source, seenRanks) => {
  if (!isGuochuangPlainObject(source) || !isSafeGuochuangId(source.rank) || !isSafeGuochuangId(source.season_id)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  if (seenRanks.has(source.rank)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  seenRanks.add(source.rank);
  const title = isBoundedGuochuangText(source.title, true) ? source.title.trim() : null;
  let linkUrl;
  if (source.url === undefined || source.url === "") {
    linkUrl = `https://www.bilibili.com/bangumi/play/ss${source.season_id}`;
  } else {
    linkUrl = normalizeGuochuangUrl(source.url, "rank");
  }
  if (!title || !linkUrl || (source.url !== undefined && source.url !== "" && typeof source.url !== "string")) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  let updateText = "";
  if (Object.prototype.hasOwnProperty.call(source, "desc")) {
    if (typeof source.desc !== "string") {
      throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
    if (source.desc !== "") {
      updateText = isBoundedGuochuangText(source.desc) ? source.desc : null;
    }
  }
  if (updateText === "" && (source.desc === undefined || source.desc === "")) {
    const newEpisode = isGuochuangPlainObject(source.new_ep) && source.new_ep.index_show;
    if (newEpisode !== undefined) {
      if (!isBoundedGuochuangText(newEpisode)) {
        throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
      }
      updateText = newEpisode;
    }
  }
  if (updateText === null) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return { rank: source.rank, seasonId: source.season_id, title, linkUrl, updateText, badgeText: "" };
};

const projectPgcGuochuangComposite = (timelinePayload, rankPayload) => {
  if (
    !isGuochuangPlainObject(timelinePayload)
    || !Number.isSafeInteger(timelinePayload.code)
    || !isGuochuangPlainObject(timelinePayload.result)
    || !Array.isArray(timelinePayload.result.latest)
    || !Array.isArray(timelinePayload.result.timeline)
    || timelinePayload.code !== 0
    || timelinePayload.result.latest.length > MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_PER_TAB
    || timelinePayload.result.timeline.length !== 7
    || !isGuochuangPlainObject(rankPayload)
    || !Number.isSafeInteger(rankPayload.code)
    || !isGuochuangPlainObject(rankPayload.data)
    || !Array.isArray(rankPayload.data.list)
    || rankPayload.data.list.length > MAX_PGC_GUOCHUANG_RANK_CANDIDATES
  ) {
    throw new PgcDataError(timelinePayload && timelinePayload.code !== 0 || rankPayload && rankPayload.code !== 0
      ? FOCUS_ERROR_KINDS.UNAVAILABLE
      : FOCUS_ERROR_KINDS.SCHEMA);
  }

  const weekdaySegments = new Map();
  let timelineItemCount = timelinePayload.result.latest.length;
  let todayCount = 0;
  for (const segment of timelinePayload.result.timeline) {
    if (
      !isGuochuangPlainObject(segment)
      || !Number.isSafeInteger(segment.day_of_week)
      || segment.day_of_week < 1
      || segment.day_of_week > 7
      || weekdaySegments.has(segment.day_of_week)
      || (segment.is_today !== 0 && segment.is_today !== 1)
      || !Array.isArray(segment.episodes)
      || segment.episodes.length > MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_PER_TAB
    ) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
    weekdaySegments.set(segment.day_of_week, segment);
    timelineItemCount += segment.episodes.length;
    if (segment.is_today === 1) {
      todayCount += 1;
    }
  }
  if (weekdaySegments.size !== 7 || todayCount > 1 || timelineItemCount > MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_TOTAL) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const tabs = [{ key: "latest", label: "最新", isToday: false, items: timelinePayload.result.latest.map(projectGuochuangTimelineItem) }];
  for (let day = 1; day <= 7; day += 1) {
    const segment = weekdaySegments.get(day);
    tabs.push({
      key: PGC_TAB_DEFINITIONS[day][0],
      label: PGC_TAB_DEFINITIONS[day][1],
      isToday: segment.is_today === 1,
      items: segment.episodes.map(projectGuochuangTimelineItem)
    });
  }

  const seenRanks = new Set();
  const rankCandidates = rankPayload.data.list.map((item) => projectGuochuangRankItem(item, seenRanks));
  const rankItems = rankCandidates
    .filter((item) => item.rank > 10 ? false : true)
    .sort((left, right) => left.rank - right.rank)
    .slice(0, MAX_PGC_GUOCHUANG_RANK_ITEMS)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  if (rankItems.length === 0) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const rankedSeasonIds = new Set(rankItems.map((item) => item.seasonId));
  const timelineCandidates = [
    ...timelinePayload.result.latest,
    ...Array.from(weekdaySegments.values()).flatMap((segment) => segment.episodes)
  ];
  for (const source of timelineCandidates) {
    if (rankItems.length >= MAX_PGC_GUOCHUANG_RANK_ITEMS) break;
    const timelineItem = projectGuochuangTimelineItem(source);
    if (rankedSeasonIds.has(timelineItem.seasonId)) continue;
    rankedSeasonIds.add(timelineItem.seasonId);
    rankItems.push({
      rank: rankItems.length + 1,
      seasonId: timelineItem.seasonId,
      title: timelineItem.title,
      linkUrl: `https://www.bilibili.com/bangumi/play/ss${timelineItem.seasonId}`,
      updateText: timelineItem.updateText,
      badgeText: ""
    });
  }
  if (rankItems.some((item) => item.rank < 1)) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return { tabs, rankItems };
};

const readPgcJson = async (response) => {
  if (!isJsonContentType(response.headers.get("content-type"))) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0 || declaredLength > MAX_PGC_RESPONSE_BYTES) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
    }
  }
  if (!response.body) {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!(value instanceof Uint8Array)) {
        throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
      }
      totalBytes += value.byteLength;
      if (totalBytes > MAX_PGC_RESPONSE_BYTES) {
        throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
      }
      chunks.push(value);
    }
  } catch (error) {
    try {
      await reader.cancel();
    } catch {
      // The response is already fail-closed.
    }
    if (error instanceof PgcDataError || (error && error.name === "AbortError")) {
      throw error;
    }
    throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new PgcDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
};

const hashFocusKey = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};

const projectFocusCarousel = (payload) => {
  if (!isPlainObject(payload)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  if (typeof payload.code !== "number" || !Number.isSafeInteger(payload.code)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  if (payload.code !== 0) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }
  if (!isPlainObject(payload.data)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const sourceItems = payload.data["3197"];
  if (!Array.isArray(sourceItems)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }

  const projected = [];
  for (let sourceIndex = 0; sourceIndex < sourceItems.length; sourceIndex += 1) {
    const source = sourceItems[sourceIndex];
    if (!isPlainObject(source)) {
      continue;
    }

    const imageUrl = normalizeFocusUrl(
      source.pic,
      FOCUS_IMAGE_HOSTS,
      ["/bfs/banner/", "/bfs/archive/"],
      true
    );
    const linkUrl = normalizeFocusUrl(source.url, FOCUS_LINK_HOSTS, null, true);
    const title = normalizeFocusText(source.name);
    const subtitleSource = normalizeFocusText(source.title);
    if (
      !imageUrl
      || !linkUrl
      || title === null
      || subtitleSource === null
      || !Number.isSafeInteger(source.pos_num)
      || source.pos_num <= 0
    ) {
      continue;
    }

    const subtitle = subtitleSource === title ? "" : subtitleSource;
    const key = `focus-3197-${hashFocusKey(`${imageUrl}\u001F${linkUrl}\u001F${title}\u001F${subtitle}`)}`;
    projected.push({
      sourceIndex,
      key,
      imageUrl,
      linkUrl,
      title,
      subtitle,
      type: "focus-carousel",
      order: source.pos_num
    });
  }

  projected.sort((left, right) => (
    left.order - right.order || left.sourceIndex - right.sourceIndex
  ));

  const seenKeys = new Set();
  const items = [];
  for (const item of projected) {
    if (seenKeys.has(item.key)) {
      continue;
    }
    seenKeys.add(item.key);
    items.push({
      key: item.key,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      title: item.title,
      subtitle: item.subtitle,
      type: item.type,
      order: item.order
    });
    if (items.length >= MAX_FOCUS_ITEMS) {
      break;
    }
  }

  if (items.length === 0) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  return items;
};

const focusRequestKey = (sender) => `${sender.id}:${String(sender.tab && sender.tab.id)}:${sender.frameId}`;

const cancelFocusCarousel = (message, sender) => {
  const requestState = activeFocusRequests.get(focusRequestKey(sender));
  if (
    requestState
    && requestState.requestId === message.requestId
    && requestState.generation === message.generation
    && requestState.operation === message.operation
  ) {
    requestState.controller.abort();
  }
};

const fetchFocusCarousel = async (message, sender) => {
  const requestKey = focusRequestKey(sender);
  const previous = activeFocusRequests.get(requestKey);
  if (previous) {
    previous.controller.abort();
  }

  const releaseSlots = reservePublicUpstreamSlots(1);
  if (!releaseSlots) {
    return { ok: false, kind: FOCUS_ERROR_KINDS.UNAVAILABLE };
  }

  const controller = new AbortController();
  const requestState = {
    controller,
    requestId: message.requestId,
    generation: message.generation,
    operation: message.operation
  };
  activeFocusRequests.set(requestKey, requestState);
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(FOCUS_CAROUSEL_URL, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });

    if (
      response.type === "opaqueredirect"
      || response.redirected === true
    ) {
      throw new FocusDataError(FOCUS_ERROR_KINDS.REDIRECTED);
    }
    if (!response.ok || response.status < 200 || response.status >= 300) {
      throw new FocusDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }

    const payload = await readFocusJson(response);
    return { ok: true, items: projectFocusCarousel(payload) };
  } catch (error) {
    if (error instanceof FocusDataError) {
      return { ok: false, kind: error.kind };
    }
    if (timedOut) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.TIMEOUT };
    }
    if (controller.signal.aborted || (error && error.name === "AbortError")) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED };
    }
    return { ok: false, kind: FOCUS_ERROR_KINDS.UNAVAILABLE };
  } finally {
    clearTimeout(timeout);
    releaseSlots();
    if (activeFocusRequests.get(requestKey) === requestState) {
      activeFocusRequests.delete(requestKey);
    }
  }
};

const createFocusResult = (message, result) => {
  if (result.ok) {
    return {
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: message.requestId,
      generation: message.generation,
      operation: "FOCUS_CAROUSEL",
      ok: true,
      data: { items: result.items }
    };
  }
  return {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: "FOCUS_CAROUSEL",
    ok: false,
    error: { kind: result.kind }
  };
};

class KnowledgeDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

const normalizeKnowledgeCoverUrl = (value) => {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > MAX_COVER_URL_LENGTH
    || value.trim() !== value
    || /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }
  const authorityMatch = /^https?:\/\/([^/?#]*)/i.exec(value);
  if (!authorityMatch || authorityMatch[1].includes("@") || authorityMatch[1].includes(":")) {
    return null;
  }
  const rawPathStart = value.indexOf("/", authorityMatch[0].length);
  const rawPathEnd = value.search(/[?#]/);
  const rawPath = rawPathStart >= 0
    ? value.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : value.length)
    : "/";
  if (hasDotSegment(rawPath)) {
    return null;
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (
    (url.protocol !== "https:" && url.protocol !== "http:")
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || !KNOWLEDGE_IMAGE_HOSTS.has(url.hostname.toLowerCase())
    || !url.pathname.startsWith("/bfs/")
  ) {
    return null;
  }
  if (url.protocol === "http:") { url.protocol = "https:"; }
  if (url.href.length > MAX_COVER_URL_LENGTH) { return null; }
  return url.href;
};

const isKnowledgeCount = (value) => Number.isSafeInteger(value) && value >= 0;

const projectKnowledgeFeed = (payload) => {
  if (
    !isPlainObject(payload)
    || !Number.isSafeInteger(payload.code)
    || payload.code !== 0
    || !isPlainObject(payload.data)
    || !Array.isArray(payload.data.archives)
    || payload.data.archives.length > 15
  ) {
    throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
  }

  const seen = new Set();
  const items = [];
  for (const source of payload.data.archives) {
    if (!isPlainObject(source) || typeof source.bvid !== "string" || !KNOWLEDGE_BVID_RE.test(source.bvid)) {
      continue;
    }
    if (seen.has(source.bvid)) {
      continue;
    }
    const title = typeof source.title === "string" ? source.title.trim() : "";
    const ownerName = isPlainObject(source.author) && typeof source.author.name === "string"
      ? source.author.name.trim()
      : "";
    if (!title || !ownerName) {
      continue;
    }
    seen.add(source.bvid);
    const stat = isPlainObject(source.stat) ? source.stat : null;
    items.push({
      bvid: source.bvid,
      title,
      ownerName,
      coverUrl: normalizeKnowledgeCoverUrl(source.cover),
      href: `https://www.bilibili.com/video/${source.bvid}`,
      view: stat && isKnowledgeCount(stat.view) ? stat.view : null,
      danmaku: stat && isKnowledgeCount(stat.danmaku) ? stat.danmaku : null,
      durationSeconds: isKnowledgeCount(source.duration) ? source.duration : null
    });
  }
  return {
    status: items.length === 15 ? "success" : items.length > 0 ? "partial" : "empty",
    items
  };
};

const readKnowledgeJson = async (response) => {
  if (!isJsonContentType(response.headers.get("content-type"))) {
    throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
  }
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0 || declaredLength > MAX_KNOWLEDGE_RESPONSE_BYTES) {
      throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
    }
  }
  if (!response.body) {
    throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!(value instanceof Uint8Array)) {
        throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
      }
      totalBytes += value.byteLength;
      if (totalBytes > MAX_KNOWLEDGE_RESPONSE_BYTES) {
        throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
      }
      chunks.push(value);
    }
  } catch (error) {
    try {
      await reader.cancel();
    } catch {
      // The body is fail-closed after a read error.
    }
    if (error instanceof KnowledgeDataError) {
      throw error;
    }
    throw error;
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.SCHEMA);
  }
};

const knowledgeRequestKey = (sender) => (
  `${sender.id}:${sender.tab.id}:${sender.frameId}:${sender.documentId}:${KNOWLEDGE_OPERATION}`
);

const knowledgeRootKey = (sender) => (
  `${sender.id}:${sender.tab.id}:${sender.frameId}`
);

const reserveKnowledgeUpstreamSlot = () => {
  if (knowledgeUpstreamSlots >= MAX_KNOWLEDGE_UPSTREAM_SLOTS) {
    return null;
  }
  knowledgeUpstreamSlots += 1;
  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    knowledgeUpstreamSlots -= 1;
  };
};

const isKnowledgeCacheFresh = (now = Date.now()) => Boolean(
  knowledgeCache.key === KNOWLEDGE_CACHE_KEY
  && knowledgeCache.data
  && knowledgeCache.data.status === "success"
  && knowledgeCache.data.items.length === 15
  && knowledgeCache.expiresAt > now
);

const createKnowledgeResult = (message, result) => {
  if (result.ok) {
    return {
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: message.requestId,
      generation: message.generation,
      operation: KNOWLEDGE_OPERATION,
      ok: true,
      data: {
        status: result.data.status,
        items: result.data.items.map((item) => ({ ...item }))
      }
    };
  }
  return {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: KNOWLEDGE_OPERATION,
    ok: false,
    error: { kind: result.kind }
  };
};

const invalidateKnowledgeRoot = (rootKey, reason) => {
  const root = knowledgeCurrentRoots.get(rootKey);
  if (!root) {
    return;
  }
  root.active = false;
  root.invalidationReason = reason;
  root.epoch += 1;
  for (const [requestKey, state] of knowledgeInFlight.entries()) {
    if (state.rootKey !== rootKey || state.documentId !== root.documentId) {
      continue;
    }
    state.invalidated = true;
    state.cancelled = true;
    state.controller.abort();
    if (state.releaseSlot) {
      state.releaseSlot();
    }
    knowledgeInFlight.delete(requestKey);
    knowledgeAbortController.delete(requestKey);
    knowledgeErrorShell.delete(requestKey);
    knowledgeUiState.delete(requestKey);
  }
};

const registerKnowledgeRoot = (sender) => {
  const rootKey = knowledgeRootKey(sender);
  const existing = knowledgeCurrentRoots.get(rootKey);
  if (!existing || existing.documentId !== sender.documentId) {
    if (existing && existing.retiredDocumentIds.has(sender.documentId)) {
      return null;
    }
    const retiredDocumentIds = existing
      ? new Set(existing.retiredDocumentIds)
      : new Set();
    if (existing) {
      retiredDocumentIds.add(existing.documentId);
      invalidateKnowledgeRoot(rootKey, "root-replacement");
    }
    const root = {
      rootKey,
      documentId: sender.documentId,
      senderId: sender.id,
      tabId: sender.tab.id,
      frameId: sender.frameId,
      url: sender.url,
      origin: sender.origin,
      epoch: 0,
      lastGeneration: -1,
      active: true,
      retiredDocumentIds,
      invalidationReason: null
    };
    knowledgeCurrentRoots.set(rootKey, root);
    return root;
  }
  if (existing.active) {
    return existing;
  }
  return null;
};

const getCurrentKnowledgeRoot = (sender) => {
  const root = knowledgeCurrentRoots.get(knowledgeRootKey(sender));
  return root && root.documentId === sender.documentId && root.active ? root : null;
};

const isCurrentKnowledgeState = (requestKey, state) => {
  const root = knowledgeCurrentRoots.get(state.rootKey);
  return Boolean(
    root
    && root.active
    && root.documentId === state.documentId
    && root.epoch === state.rootEpoch
    && root.lastGeneration === state.generation
    && knowledgeInFlight.get(requestKey) === state
    && knowledgeGeneration.get(requestKey) === state.generation
    && state.invalidated !== true
  );
};

const cancelKnowledge = (message, sender) => {
  const requestKey = knowledgeRequestKey(sender);
  const state = knowledgeInFlight.get(requestKey);
  if (
    getCurrentKnowledgeRoot(sender)
    && state
    && state.documentId === sender.documentId
    && state.requestId === message.requestId
    && state.generation === message.generation
    && state.operation === message.operation
  ) {
    invalidateKnowledgeRoot(knowledgeRootKey(sender), "cancel");
  }
};

const fetchKnowledgeFeed = async (message, sender) => {
  const requestKey = knowledgeRequestKey(sender);
  const root = registerKnowledgeRoot(sender);
  if (!root) {
    return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.CANCELLED };
  }
  if (message.generation <= root.lastGeneration) {
    return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.CANCELLED };
  }
  root.lastGeneration = message.generation;
  knowledgeGeneration.set(requestKey, message.generation);
  const previous = knowledgeInFlight.get(requestKey);
  if (previous) {
    previous.invalidated = true;
    previous.cancelled = true;
    previous.controller.abort();
    if (previous.releaseSlot) {
      previous.releaseSlot();
    }
    knowledgeInFlight.delete(requestKey);
    knowledgeAbortController.delete(requestKey);
    knowledgeErrorShell.delete(requestKey);
    knowledgeUiState.delete(requestKey);
  }
  knowledgeUiState.set(requestKey, "loading");

  if (isKnowledgeCacheFresh()) {
    knowledgeUiState.set(requestKey, "success");
    return { ok: true, data: knowledgeCache.data };
  }

  const controller = new AbortController();
  const state = {
    controller,
    requestId: message.requestId,
    generation: message.generation,
    operation: message.operation,
    sender,
    documentId: sender.documentId,
    rootKey: root.rootKey,
    rootEpoch: root.epoch,
    cancelled: false,
    invalidated: false,
    releaseSlot: null
  };
  const releaseSlot = reserveKnowledgeUpstreamSlot();
  if (!releaseSlot) {
    knowledgeErrorShell.set(requestKey, KNOWLEDGE_ERROR_KINDS.UNAVAILABLE);
    knowledgeUiState.set(requestKey, "failure");
    return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.UNAVAILABLE };
  }
  state.releaseSlot = releaseSlot;
  knowledgeInFlight.set(requestKey, state);
  knowledgeAbortController.set(requestKey, controller);
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(KNOWLEDGE_FEED_URL, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });
    if (response.type === "opaqueredirect" || response.redirected === true) {
      throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.REDIRECTED);
    }
    if (!response.ok || response.status < 200 || response.status >= 300) {
      throw new KnowledgeDataError(KNOWLEDGE_ERROR_KINDS.UNAVAILABLE);
    }
    const data = projectKnowledgeFeed(await readKnowledgeJson(response));
    if (state.cancelled || controller.signal.aborted || !isCurrentKnowledgeState(requestKey, state)) {
      return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.CANCELLED };
    }
    knowledgeUiState.set(requestKey, data.status);
    if (data.status === "success") {
      knowledgeCache.key = KNOWLEDGE_CACHE_KEY;
      knowledgeCache.data = data;
      knowledgeCache.expiresAt = Date.now() + KNOWLEDGE_CACHE_TTL_MS;
    }
    if (data.status === "success" || data.status === "partial") {
      knowledgeLastGood = data;
    }
    knowledgeErrorShell.delete(requestKey);
    return { ok: true, data };
  } catch (error) {
    if (state.invalidated || !isCurrentKnowledgeState(requestKey, state)) {
      return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.CANCELLED };
    }
    if (error instanceof KnowledgeDataError) {
      knowledgeErrorShell.set(requestKey, error.kind);
      return { ok: false, kind: error.kind };
    }
    if (timedOut) {
      knowledgeErrorShell.set(requestKey, KNOWLEDGE_ERROR_KINDS.TIMEOUT);
      return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.TIMEOUT };
    }
    if (state.cancelled || controller.signal.aborted || (error && error.name === "AbortError")) {
      knowledgeErrorShell.set(requestKey, KNOWLEDGE_ERROR_KINDS.CANCELLED);
      return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.CANCELLED };
    }
    knowledgeErrorShell.set(requestKey, KNOWLEDGE_ERROR_KINDS.UNAVAILABLE);
    return { ok: false, kind: KNOWLEDGE_ERROR_KINDS.UNAVAILABLE };
  } finally {
    clearTimeout(timeout);
    if (state.releaseSlot) {
      state.releaseSlot();
      state.releaseSlot = null;
    }
    if (knowledgeInFlight.get(requestKey) === state) {
      knowledgeInFlight.delete(requestKey);
      knowledgeAbortController.delete(requestKey);
    }
  }
};

class MusicDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

const normalizeMusicCoverUrl = (value) => {
  if (
    typeof value !== "string"
    || value.length === 0
    || value.length > MAX_COVER_URL_LENGTH
    || value.trim() !== value
    || /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return null;
  }
  const authorityMatch = /^https?:\/\/([^/?#]*)/i.exec(value);
  if (!authorityMatch || authorityMatch[1].includes("@") || authorityMatch[1].includes(":")) {
    return null;
  }
  const rawPathStart = value.indexOf("/", authorityMatch[0].length);
  const rawPathEnd = value.search(/[?#]/);
  const rawPath = rawPathStart >= 0
    ? value.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : value.length)
    : "/";
  if (hasDotSegment(rawPath)) {
    return null;
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (
    (url.protocol !== "https:" && url.protocol !== "http:")
    || url.username
    || url.password
    || url.port
    || url.search
    || url.hash
    || !MUSIC_IMAGE_HOSTS.has(url.hostname.toLowerCase())
    || !url.pathname.startsWith("/bfs/")
  ) {
    return null;
  }
  if (url.protocol === "http:") { url.protocol = "https:"; }
  if (url.href.length > MAX_COVER_URL_LENGTH) { return null; }
  return url.href;
};

const isMusicCount = (value) => Number.isSafeInteger(value) && value >= 0;

const projectMusicFeed = (payload) => {
  if (
    !isPlainObject(payload)
    || !Number.isSafeInteger(payload.code)
    || payload.code !== 0
    || !isPlainObject(payload.data)
    || !Array.isArray(payload.data.archives)
    || payload.data.archives.length > 15
  ) {
    throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
  }
  const seen = new Set();
  const items = [];
  for (const source of payload.data.archives) {
    if (!isPlainObject(source) || typeof source.bvid !== "string" || !MUSIC_BVID_RE.test(source.bvid) || seen.has(source.bvid)) {
      continue;
    }
    const title = typeof source.title === "string" ? source.title.trim() : "";
    const ownerName = isPlainObject(source.author) && typeof source.author.name === "string"
      ? source.author.name.trim()
      : "";
    if (!title || !ownerName) {
      continue;
    }
    seen.add(source.bvid);
    const stat = isPlainObject(source.stat) ? source.stat : null;
    items.push({
      bvid: source.bvid,
      title,
      ownerName,
      coverUrl: normalizeMusicCoverUrl(source.cover),
      href: `https://www.bilibili.com/video/${source.bvid}`,
      view: stat && isMusicCount(stat.view) ? stat.view : null,
      danmaku: stat && isMusicCount(stat.danmaku) ? stat.danmaku : null,
      durationSeconds: isMusicCount(source.duration) ? source.duration : null
    });
  }
  return {
    status: items.length === 15 ? "success" : items.length > 0 ? "partial" : "empty",
    items
  };
};

const readMusicJson = async (response) => {
  if (!response || !response.headers || !isJsonContentType(response.headers.get("content-type"))) {
    throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
  }
  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    const declaredLength = Number(contentLength);
    if (!Number.isSafeInteger(declaredLength) || declaredLength < 0 || declaredLength > MAX_MUSIC_RESPONSE_BYTES) {
      throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
    }
  }
  if (!response.body) {
    throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!(value instanceof Uint8Array)) throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
      totalBytes += value.byteLength;
      if (totalBytes > MAX_MUSIC_RESPONSE_BYTES) throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
      chunks.push(value);
    }
  } catch (error) {
    try { await reader.cancel(); } catch { /* body is fail-closed */ }
    throw error instanceof MusicDataError ? error : new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new MusicDataError(MUSIC_ERROR_KINDS.SCHEMA);
  }
};

const musicRequestKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}:${sender.documentId}:${MUSIC_OPERATION}`;
const musicRootKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}`;

const reserveMusicUpstreamSlot = (replaceState = null) => {
  const canTransfer = Boolean(replaceState && replaceState.releaseSlot);
  if (
    musicUpstreamSlots >= MAX_MUSIC_UPSTREAM_SLOTS
    && !canTransfer
  ) {
    return null;
  }
  if (canTransfer) {
    replaceState.releaseSlot = null;
  }
  if (musicUpstreamSlots < MAX_MUSIC_UPSTREAM_SLOTS) {
    musicUpstreamSlots += 1;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    musicUpstreamSlots -= 1;
  };
};

const isMusicCacheFresh = (now = Date.now()) => Boolean(
  musicCache.key === MUSIC_CACHE_KEY
  && musicCache.data
  && musicCache.data.status === "success"
  && musicCache.data.items.length === 15
  && musicCache.expiresAt > now
);

const createMusicResult = (message, result) => result.ok
  ? {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: MUSIC_OPERATION,
    ok: true,
    data: { status: result.data.status, items: result.data.items.map((item) => ({ ...item })) }
  }
  : {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: MUSIC_OPERATION,
    ok: false,
    error: { kind: result.kind }
  };

const invalidateMusicRoot = (rootKey, reason) => {
  const root = musicCurrentRoots.get(rootKey);
  if (!root || !root.active) return;
  root.active = false;
  root.invalidationReason = reason;
  root.epoch += 1;
  for (const [requestKey, state] of musicInFlight.entries()) {
    if (state.rootKey !== rootKey || state.documentId !== root.documentId) continue;
    state.invalidated = true;
    state.cancelled = true;
    state.controller.abort();
    if (state.releaseSlot) state.releaseSlot();
    musicInFlight.delete(requestKey);
    musicAbortController.delete(requestKey);
    musicErrorShell.delete(requestKey);
    musicUiState.delete(requestKey);
  }
};

const registerMusicRoot = (sender) => {
  const rootKey = musicRootKey(sender);
  const existing = musicCurrentRoots.get(rootKey);
  if (!existing || existing.documentId !== sender.documentId) {
    if (existing && existing.retiredDocumentIds.has(sender.documentId)) return null;
    const retiredDocumentIds = existing ? new Set(existing.retiredDocumentIds) : new Set();
    if (existing) {
      retiredDocumentIds.add(existing.documentId);
      invalidateMusicRoot(rootKey, "root-replacement");
    }
    const root = {
      rootKey,
      documentId: sender.documentId,
      senderId: sender.id,
      tabId: sender.tab.id,
      frameId: sender.frameId,
      url: sender.url,
      origin: sender.origin,
      epoch: 0,
      lastGeneration: -1,
      active: true,
      retiredDocumentIds,
      invalidationReason: null
    };
    musicCurrentRoots.set(rootKey, root);
    return root;
  }
  return existing.active ? existing : null;
};

const getCurrentMusicRoot = (sender) => {
  const root = musicCurrentRoots.get(musicRootKey(sender));
  return root && root.documentId === sender.documentId && root.active ? root : null;
};

const isCurrentMusicState = (requestKey, state) => {
  const root = musicCurrentRoots.get(state.rootKey);
  return Boolean(
    root && root.active && root.documentId === state.documentId && root.epoch === state.rootEpoch
      && root.lastGeneration === state.generation && musicInFlight.get(requestKey) === state
      && musicGeneration.get(requestKey) === state.generation && state.invalidated !== true
  );
};

const cancelMusic = (message, sender) => {
  const requestKey = musicRequestKey(sender);
  const state = musicInFlight.get(requestKey);
  if (
    getCurrentMusicRoot(sender) && state && state.documentId === sender.documentId
      && state.requestId === message.requestId && state.generation === message.generation
      && state.operation === message.operation
  ) {
    state.cancelled = true;
    state.controller.abort();
  }
};

const fetchMusicFeed = async (message, sender) => {
  const requestKey = musicRequestKey(sender);
  const rootKey = musicRootKey(sender);
  const existingRoot = musicCurrentRoots.get(rootKey);
  if (
    existingRoot
    && existingRoot.documentId !== sender.documentId
    && existingRoot.retiredDocumentIds.has(sender.documentId)
  ) {
    return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
  }
  if (
    existingRoot
    && existingRoot.documentId === sender.documentId
    && (!existingRoot.active || message.generation <= existingRoot.lastGeneration)
  ) {
    return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
  }

  if (isMusicCacheFresh()) {
    const root = registerMusicRoot(sender);
    if (!root || message.generation <= root.lastGeneration) {
      return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
    }
    root.lastGeneration = message.generation;
    musicGeneration.set(requestKey, message.generation);
    musicUiState.set(requestKey, "success");
    return { ok: true, data: musicCache.data };
  }

  const previous = musicInFlight.get(requestKey);
  const rootReplacementState = previous || [...musicInFlight.values()].find((state) => (
    state.rootKey === rootKey
    && state.documentId !== sender.documentId
    && state.releaseSlot
  ));
  const releaseSlot = reserveMusicUpstreamSlot(rootReplacementState);
  if (!releaseSlot) return { ok: false, kind: MUSIC_ERROR_KINDS.UNAVAILABLE };

  const root = registerMusicRoot(sender);
  if (!root || message.generation <= root.lastGeneration) {
    releaseSlot();
    return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
  }
  root.lastGeneration = message.generation;
  musicGeneration.set(requestKey, message.generation);
  if (previous) {
    previous.invalidated = true;
    previous.cancelled = true;
    previous.controller.abort();
  }
  musicUiState.set(requestKey, "loading");
  const controller = new AbortController();
  const state = {
    controller,
    requestId: message.requestId,
    generation: message.generation,
    operation: MUSIC_OPERATION,
    sender,
    documentId: sender.documentId,
    rootKey: root.rootKey,
    rootEpoch: root.epoch,
    cancelled: false,
    invalidated: false,
    releaseSlot: null
  };
  state.releaseSlot = releaseSlot;
  musicInFlight.set(requestKey, state);
  musicAbortController.set(requestKey, controller);
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(MUSIC_FEED_URL, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });
    if (response.type === "opaqueredirect" || response.redirected === true) {
      throw new MusicDataError(MUSIC_ERROR_KINDS.REDIRECTED);
    }
    if (!response.ok || response.status < 200 || response.status >= 300) {
      throw new MusicDataError(MUSIC_ERROR_KINDS.UNAVAILABLE);
    }
    const data = projectMusicFeed(await readMusicJson(response));
    if (state.cancelled || controller.signal.aborted || !isCurrentMusicState(requestKey, state)) {
      return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
    }
    musicUiState.set(requestKey, data.status);
    if (data.status === "success") {
      musicCache.key = MUSIC_CACHE_KEY;
      musicCache.data = data;
      musicCache.expiresAt = Date.now() + MUSIC_CACHE_TTL_MS;
    }
    if (data.status === "success" || data.status === "partial") musicLastGood = data;
    musicErrorShell.delete(requestKey);
    return { ok: true, data };
  } catch (error) {
    if (state.invalidated || !isCurrentMusicState(requestKey, state)) return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
    if (error instanceof MusicDataError) {
      musicErrorShell.set(requestKey, error.kind);
      return { ok: false, kind: error.kind };
    }
    if (timedOut) {
      musicErrorShell.set(requestKey, MUSIC_ERROR_KINDS.TIMEOUT);
      return { ok: false, kind: MUSIC_ERROR_KINDS.TIMEOUT };
    }
    if (state.cancelled || controller.signal.aborted || (error && error.name === "AbortError")) {
      musicErrorShell.set(requestKey, MUSIC_ERROR_KINDS.CANCELLED);
      return { ok: false, kind: MUSIC_ERROR_KINDS.CANCELLED };
    }
    musicErrorShell.set(requestKey, MUSIC_ERROR_KINDS.UNAVAILABLE);
    return { ok: false, kind: MUSIC_ERROR_KINDS.UNAVAILABLE };
  } finally {
    clearTimeout(timeout);
    if (state.releaseSlot) {
      state.releaseSlot();
      state.releaseSlot = null;
    }
    if (musicInFlight.get(requestKey) === state) {
      musicInFlight.delete(requestKey);
      musicAbortController.delete(requestKey);
    }
  }
};

class AnimalDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

class FashionDataError extends Error {
  constructor(kind) {
    super();
    this.kind = kind;
  }
}

const normalizeAnimalCoverUrl = (value) => {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_COVER_URL_LENGTH || value.trim() !== value || /[\u0000-\u001F\u007F]/.test(value)) return null;
  const authority = /^https?:\/\/([^/?#]*)/i.exec(value);
  if (!authority || authority[1].includes("@") || authority[1].includes(":")) return null;
  const pathStart = value.indexOf("/", authority[0].length);
  const pathEnd = value.search(/[?#]/);
  const rawPath = pathStart >= 0 ? value.slice(pathStart, pathEnd >= 0 ? pathEnd : value.length) : "/";
  if (hasDotSegment(rawPath)) return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password || url.port || url.search || url.hash
    || !ANIMAL_IMAGE_HOSTS.has(url.hostname.toLowerCase()) || !url.pathname.startsWith("/bfs/")) return null;
  if (url.protocol === "http:") { url.protocol = "https:"; }
  if (url.href.length > MAX_COVER_URL_LENGTH) return null;
  return url.href;
};

const normalizeFashionCoverUrl = (value) => {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_COVER_URL_LENGTH || value.trim() !== value || /[\u0000-\u001F\u007F]/.test(value)) return null;
  const authority = /^https?:\/\/([^/?#]*)/i.exec(value);
  if (!authority || authority[1].includes("@") || authority[1].includes(":")) return null;
  const pathStart = value.indexOf("/", authority[0].length);
  const pathEnd = value.search(/[?#]/);
  const rawPath = pathStart >= 0 ? value.slice(pathStart, pathEnd >= 0 ? pathEnd : value.length) : "/";
  if (hasDotSegment(rawPath)) return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password || url.port || url.search || url.hash
    || !FASHION_IMAGE_HOSTS.has(url.hostname.toLowerCase()) || !url.pathname.startsWith("/bfs/")) return null;
  if (url.protocol === "http:") { url.protocol = "https:"; }
  if (url.href.length > MAX_COVER_URL_LENGTH) return null;
  return url.href;
};

const isAnimalCount = (value) => Number.isSafeInteger(value) && value >= 0;
const isFashionCount = (value) => Number.isSafeInteger(value) && value >= 0;

const projectAnimalFeed = (payload) => {
  if (!isPlainObject(payload) || !Number.isSafeInteger(payload.code) || payload.code !== 0 || !isPlainObject(payload.data)
    || !Array.isArray(payload.data.archives) || payload.data.archives.length > 15) {
    throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
  }
  const seen = new Set();
  const items = [];
  for (const source of payload.data.archives) {
    if (!isPlainObject(source) || typeof source.bvid !== "string" || !ANIMAL_BVID_RE.test(source.bvid) || seen.has(source.bvid)) continue;
    const title = typeof source.title === "string" ? source.title.trim() : "";
    const ownerName = isPlainObject(source.author) && typeof source.author.name === "string" ? source.author.name.trim() : "";
    if (!title || !ownerName) continue;
    seen.add(source.bvid);
    const stat = isPlainObject(source.stat) ? source.stat : null;
    items.push({
      bvid: source.bvid,
      title,
      ownerName,
      coverUrl: normalizeAnimalCoverUrl(source.cover),
      href: `https://www.bilibili.com/video/${source.bvid}`,
      view: stat && isAnimalCount(stat.view) ? stat.view : null,
      danmaku: stat && isAnimalCount(stat.danmaku) ? stat.danmaku : null,
      durationSeconds: isAnimalCount(source.duration) ? source.duration : null
    });
  }
  return { status: items.length === 15 ? "success" : items.length ? "partial" : "empty", items };
};

const projectFashionFeed = (payload) => {
  if (!isPlainObject(payload) || !Number.isSafeInteger(payload.code) || payload.code !== 0 || !isPlainObject(payload.data)
    || !Array.isArray(payload.data.archives) || payload.data.archives.length > 15) {
    throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
  }
  const seen = new Set();
  const items = [];
  for (const source of payload.data.archives) {
    if (!isPlainObject(source) || typeof source.bvid !== "string" || !FASHION_BVID_RE.test(source.bvid) || seen.has(source.bvid)) continue;
    const title = typeof source.title === "string" ? source.title.trim() : "";
    const ownerName = isPlainObject(source.author) && typeof source.author.name === "string" ? source.author.name.trim() : "";
    if (!title || !ownerName) continue;
    seen.add(source.bvid);
    const stat = isPlainObject(source.stat) ? source.stat : null;
    items.push({
      bvid: source.bvid,
      title,
      ownerName,
      coverUrl: normalizeFashionCoverUrl(source.cover),
      href: `https://www.bilibili.com/video/${source.bvid}`,
      view: stat && isFashionCount(stat.view) ? stat.view : null,
      danmaku: stat && isFashionCount(stat.danmaku) ? stat.danmaku : null,
      durationSeconds: isFashionCount(source.duration) ? source.duration : null
    });
  }
  return { status: items.length === 15 ? "success" : items.length ? "partial" : "empty", items };
};

const readAnimalJson = async (response) => {
  if (!response || !response.headers || !isJsonContentType(response.headers.get("content-type")) || response.status !== 200 || !response.body) {
    throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
  }
  const declared = response.headers.get("content-length");
  if (declared !== null && (!Number.isSafeInteger(Number(declared)) || Number(declared) < 0 || Number(declared) > MAX_ANIMAL_RESPONSE_BYTES)) {
    throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      if (!(part.value instanceof Uint8Array)) throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
      total += part.value.byteLength;
      if (total > MAX_ANIMAL_RESPONSE_BYTES) throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
      chunks.push(part.value);
    }
  } catch (error) {
    try { await reader.cancel(); } catch { /* bounded body is fail-closed */ }
    throw error instanceof AnimalDataError ? error : new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new AnimalDataError(ANIMAL_ERROR_KINDS.SCHEMA); }
};

const readFashionJson = async (response) => {
  if (!response || !response.headers || !isJsonContentType(response.headers.get("content-type")) || response.status !== 200 || !response.body) {
    throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
  }
  const declared = response.headers.get("content-length");
  if (declared !== null && (!Number.isSafeInteger(Number(declared)) || Number(declared) < 0 || Number(declared) > MAX_FASHION_RESPONSE_BYTES)) {
    throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      if (!(part.value instanceof Uint8Array)) throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
      total += part.value.byteLength;
      if (total > MAX_FASHION_RESPONSE_BYTES) throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
      chunks.push(part.value);
    }
  } catch (error) {
    try { await reader.cancel(); } catch { /* bounded body is fail-closed */ }
    throw error instanceof FashionDataError ? error : new FashionDataError(FASHION_ERROR_KINDS.SCHEMA);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new FashionDataError(FASHION_ERROR_KINDS.SCHEMA); }
};

const isAnimalRequest = (message) => isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1" && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation) && message.generation >= 0
  && message.operation === ANIMAL_OPERATION && isPlainObject(message.params) && Object.keys(message.params).length === 0;
const isAnimalCancel = (message) => isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1" && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation) && message.generation >= 0 && message.operation === ANIMAL_OPERATION;
const isFashionRequest = (message) => isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1" && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation) && message.generation >= 0
  && message.operation === FASHION_OPERATION && isPlainObject(message.params) && Object.keys(message.params).length === 0;
const isFashionCancel = (message) => isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_CANCEL_V1" && isBoundedRequestId(message.requestId)
  && Number.isSafeInteger(message.generation) && message.generation >= 0 && message.operation === FASHION_OPERATION;

const isAnimalSender = (sender) => Boolean(sender && sender.id === chrome.runtime.id && sender.tab
  && Number.isSafeInteger(sender.tab.id) && sender.tab.id >= 0 && sender.tab.url === ROOT_URL
  && sender.url === ROOT_URL && sender.origin === ROOT_ORIGIN && sender.frameId === 0 && isKnowledgeDocumentId(sender.documentId));
const isFashionSender = (sender) => Boolean(sender && sender.id === chrome.runtime.id && sender.tab
  && Number.isSafeInteger(sender.tab.id) && sender.tab.id >= 0 && sender.tab.url === ROOT_URL
  && sender.url === ROOT_URL && sender.origin === ROOT_ORIGIN && sender.frameId === 0 && isKnowledgeDocumentId(sender.documentId));

const animalRequestKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}:${sender.documentId}:${ANIMAL_OPERATION}`;
const fashionRequestKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}:${sender.documentId}:${FASHION_OPERATION}`;
const animalRootKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}`;
const fashionRootKey = (sender) => `${sender.id}:${sender.tab.id}:${sender.frameId}`;

const reserveAnimalSlot = (transferState = null) => {
  const transfer = Boolean(transferState && transferState.releaseSlot);
  if (animalUpstreamSlots >= MAX_ANIMAL_UPSTREAM_SLOTS && !transfer) return null;
  if (transfer) { transferState.releaseSlot(); transferState.releaseSlot = null; }
  if (animalUpstreamSlots < MAX_ANIMAL_UPSTREAM_SLOTS) animalUpstreamSlots += 1;
  let released = false;
  let calls = 0;
  const release = () => { calls += 1; if (!released) { released = true; animalUpstreamSlots -= 1; } };
  release.callCount = () => calls;
  return release;
};
const reserveFashionSlot = (transferState = null) => {
  const transfer = Boolean(transferState && transferState.releaseSlot);
  if (fashionUpstreamSlots >= MAX_FASHION_UPSTREAM_SLOTS && !transfer) return null;
  if (transfer) { transferState.releaseSlot(); transferState.releaseSlot = null; }
  if (fashionUpstreamSlots < MAX_FASHION_UPSTREAM_SLOTS) fashionUpstreamSlots += 1;
  let released = false;
  let calls = 0;
  const release = () => { calls += 1; if (!released) { released = true; fashionUpstreamSlots -= 1; } };
  release.callCount = () => calls;
  return release;
};

const isFreshAnimalCache = (now = Date.now()) => Boolean(animalCache.key === ANIMAL_CACHE_KEY && animalCache.data
  && animalCache.data.status === "success" && animalCache.data.items.length === 15 && animalCache.expiresAt > now);
const isFreshFashionCache = (now = Date.now()) => Boolean(fashionCache.key === FASHION_CACHE_KEY && fashionCache.data
  && fashionCache.data.status === "success" && fashionCache.data.items.length === 15 && fashionCache.expiresAt > now);

const createAnimalResult = (message, result) => result.ok
  ? { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: ANIMAL_OPERATION,
    ok: true, data: { status: result.data.status, items: result.data.items.map((item) => ({ ...item })) } }
  : { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: ANIMAL_OPERATION,
    ok: false, error: { kind: result.kind } };
const createFashionResult = (message, result) => result.ok
  ? { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: FASHION_OPERATION,
    ok: true, data: { status: result.data.status, items: result.data.items.map((item) => ({ ...item })) } }
  : { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: FASHION_OPERATION,
    ok: false, error: { kind: result.kind } };

const matchesAnimalSenderSnapshot = (snapshot, sender) => Boolean(
  snapshot
  && sender
  && snapshot.senderId === sender.id
  && snapshot.tabId === sender.tab.id
  && snapshot.tabUrl === sender.tab.url
  && snapshot.senderUrl === sender.url
  && snapshot.origin === sender.origin
  && snapshot.frameId === sender.frameId
  && snapshot.documentId === sender.documentId
);
const matchesFashionSenderSnapshot = (snapshot, sender) => Boolean(
  snapshot
  && sender
  && snapshot.senderId === sender.id
  && snapshot.tabId === sender.tab.id
  && snapshot.tabUrl === sender.tab.url
  && snapshot.senderUrl === sender.url
  && snapshot.origin === sender.origin
  && snapshot.frameId === sender.frameId
  && snapshot.documentId === sender.documentId
);

const invalidateAnimalRoot = (rootKey, reason) => {
  const root = animalCurrentRoots.get(rootKey);
  if (!root || !root.active) return;
  root.active = false; root.retired = true; root.invalidationReason = reason; root.epoch += 1;
  for (const [key, state] of animalInFlight.entries()) {
    if (state.rootKey !== rootKey || state.documentId !== root.documentId) continue;
    state.invalidated = true; state.cancelled = true;
    if (!state.controller.signal.aborted) state.controller.abort();
    if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    animalInFlight.delete(key); animalAbortController.delete(key); animalErrorShell.delete(key); animalUiState.delete(key);
  }
  const generationKey = `${root.rootKey}:${root.documentId}:${ANIMAL_OPERATION}`;
  animalGeneration.delete(generationKey);
  if (animalGeneration.has(generationKey)) throw new Error("animal retired root generation bookkeeping failed");
};
const invalidateFashionRoot = (rootKey, reason) => {
  const root = fashionCurrentRoots.get(rootKey);
  if (!root || !root.active) return;
  root.active = false; root.retired = true; root.invalidationReason = reason; root.epoch += 1;
  for (const [key, state] of fashionInFlight.entries()) {
    if (state.rootKey !== rootKey || state.documentId !== root.documentId) continue;
    state.invalidated = true; state.cancelled = true;
    if (!state.controller.signal.aborted) state.controller.abort();
    if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    fashionInFlight.delete(key); fashionAbortController.delete(key); fashionErrorShell.delete(key); fashionUiState.delete(key);
  }
  const generationKey = `${root.rootKey}:${root.documentId}:${FASHION_OPERATION}`;
  fashionGeneration.delete(generationKey);
  if (fashionGeneration.has(generationKey)) throw new Error("fashion retired root generation bookkeeping failed");
};

const registerAnimalRoot = (sender) => {
  const key = animalRootKey(sender); const existing = animalCurrentRoots.get(key);
  if (!existing || existing.documentId !== sender.documentId) {
    if (existing && existing.retiredDocumentIds.has(sender.documentId)) return null;
    const retiredDocumentIds = existing ? new Set(existing.retiredDocumentIds) : new Set();
    if (existing) { retiredDocumentIds.add(existing.documentId); invalidateAnimalRoot(key, "root-replacement"); }
    const root = { rootKey: key, operation: ANIMAL_OPERATION, documentId: sender.documentId, senderId: sender.id, tabId: sender.tab.id,
      tabUrl: sender.tab.url, senderUrl: sender.url, frameId: sender.frameId, origin: sender.origin, epoch: 0, lastGeneration: -1,
      requestId: null, active: true, retired: false, retiredDocumentIds, invalidationReason: null };
    animalCurrentRoots.set(key, root); return root;
  }
  return existing.active ? existing : null;
};
const registerFashionRoot = (sender) => {
  const key = fashionRootKey(sender); const existing = fashionCurrentRoots.get(key);
  if (!existing || existing.documentId !== sender.documentId) {
    if (existing && existing.retiredDocumentIds.has(sender.documentId)) return null;
    const retiredDocumentIds = existing ? new Set(existing.retiredDocumentIds) : new Set();
    if (existing) { retiredDocumentIds.add(existing.documentId); invalidateFashionRoot(key, "root-replacement"); }
    const root = { rootKey: key, operation: FASHION_OPERATION, documentId: sender.documentId, senderId: sender.id, tabId: sender.tab.id,
      tabUrl: sender.tab.url, senderUrl: sender.url, frameId: sender.frameId, origin: sender.origin, epoch: 0, lastGeneration: -1,
      requestId: null, active: true, retired: false, retiredDocumentIds, invalidationReason: null };
    fashionCurrentRoots.set(key, root); return root;
  }
  return existing.active ? existing : null;
};
const currentAnimalRoot = (sender) => { const root = animalCurrentRoots.get(animalRootKey(sender)); return root && matchesAnimalSenderSnapshot(root, sender) && root.active && !root.retired ? root : null; };
const currentFashionRoot = (sender) => { const root = fashionCurrentRoots.get(fashionRootKey(sender)); return root && matchesFashionSenderSnapshot(root, sender) && root.active && !root.retired ? root : null; };
const isAnimalRootMessageFence = (root, sender, message) => Boolean(
  root
  && animalCurrentRoots.get(root.rootKey) === root
  && root.active
  && !root.retired
  && root.operation === message.operation
  && matchesAnimalSenderSnapshot(root, sender)
  && Number.isSafeInteger(message.generation)
  && message.generation > root.lastGeneration
);
const isFashionRootMessageFence = (root, sender, message) => Boolean(
  root
  && fashionCurrentRoots.get(root.rootKey) === root
  && root.active
  && !root.retired
  && root.operation === message.operation
  && matchesFashionSenderSnapshot(root, sender)
  && Number.isSafeInteger(message.generation)
  && message.generation > root.lastGeneration
);
const isCurrentAnimalState = (key, state) => {
  const root = animalCurrentRoots.get(state.rootKey);
  return Boolean(root && root.active && !root.retired && matchesAnimalSenderSnapshot(state, state.sender)
    && matchesAnimalSenderSnapshot(root, state.sender) && root.operation === state.operation && root.requestId === state.requestId
    && root.documentId === state.documentId && root.epoch === state.rootEpoch && root.lastGeneration === state.generation
    && animalInFlight.get(key) === state && animalGeneration.get(key) === state.generation
    && animalAbortController.get(key) === state.controller && !state.cancelled && !state.invalidated && !state.controller.signal.aborted);
};
const isCurrentFashionState = (key, state) => {
  const root = fashionCurrentRoots.get(state.rootKey);
  return Boolean(root && root.active && !root.retired && matchesFashionSenderSnapshot(state, state.sender)
    && matchesFashionSenderSnapshot(root, state.sender) && root.operation === state.operation && root.requestId === state.requestId
    && root.documentId === state.documentId && root.epoch === state.rootEpoch && root.lastGeneration === state.generation
    && fashionInFlight.get(key) === state && fashionGeneration.get(key) === state.generation
    && fashionAbortController.get(key) === state.controller && !state.cancelled && !state.invalidated && !state.controller.signal.aborted);
};

const isAnimalFailureFence = (key, state, message, sender, kind) => {
  const root = state && animalCurrentRoots.get(state.rootKey);
  const identityMatches = Boolean(state && message && isAnimalRequest(message)
    && state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
    && matchesAnimalSenderSnapshot(state, sender));
  const current = Boolean(root && identityMatches && animalCurrentRoots.get(root.rootKey) === root && root.active && !root.retired
    && matchesAnimalSenderSnapshot(root, sender) && root.operation === message.operation && root.requestId === message.requestId
    && root.documentId === state.documentId && root.epoch === state.rootEpoch && root.lastGeneration === state.generation
    && animalInFlight.get(key) === state && animalGeneration.get(key) === state.generation
    && animalAbortController.get(key) === state.controller && !state.cancelled && !state.invalidated);
  if (!current) return false;
  return kind === ANIMAL_ERROR_KINDS.TIMEOUT
    ? state.timedOut === true && state.controller.signal.aborted
    : !state.controller.signal.aborted;
};
const isFashionFailureFence = (key, state, message, sender, kind) => {
  const root = state && fashionCurrentRoots.get(state.rootKey);
  const identityMatches = Boolean(state && message && isFashionRequest(message)
    && state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
    && matchesFashionSenderSnapshot(state, sender));
  const current = Boolean(root && identityMatches && fashionCurrentRoots.get(root.rootKey) === root && root.active && !root.retired
    && matchesFashionSenderSnapshot(root, sender) && root.operation === message.operation && root.requestId === message.requestId
    && root.documentId === state.documentId && root.epoch === state.rootEpoch && root.lastGeneration === state.generation
    && fashionInFlight.get(key) === state && fashionGeneration.get(key) === state.generation
    && fashionAbortController.get(key) === state.controller && !state.cancelled && !state.invalidated);
  if (!current) return false;
  return kind === FASHION_ERROR_KINDS.TIMEOUT
    ? state.timedOut === true && state.controller.signal.aborted
    : !state.controller.signal.aborted;
};
const isAnimalCancellationFence = (key, state, message, sender) => {
  if (!message || !isAnimalRequest(message) || !isAnimalSender(sender)) return false;
  const root = animalCurrentRoots.get(animalRootKey(sender));
  if (state) {
    const identityMatches = state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
      && matchesAnimalSenderSnapshot(state, sender);
    const retired = Boolean(root && identityMatches && root.documentId === state.documentId && root.retired && !root.active
      && root.epoch > state.rootEpoch && animalInFlight.get(key) !== state && animalAbortController.get(key) !== state.controller);
    const abortedCurrent = Boolean(root && identityMatches && root.active && !root.retired && matchesAnimalSenderSnapshot(root, sender)
      && animalInFlight.get(key) === state && animalAbortController.get(key) === state.controller
      && (state.cancelled || state.invalidated || state.controller.signal.aborted));
    return retired || abortedCurrent;
  }
  return Boolean(root && root.operation === message.operation && (
    (matchesAnimalSenderSnapshot(root, sender) && (
      ((!root.active || root.retired) && root.documentId === sender.documentId)
      || (root.active && root.documentId === sender.documentId && message.generation <= root.lastGeneration)
      || (root.active && root.documentId === sender.documentId && message.generation > root.lastGeneration
        && !animalInFlight.has(key) && !animalAbortController.has(key))
    ))
    || root.retiredDocumentIds.has(sender.documentId)
  ));
};
const isFashionCancellationFence = (key, state, message, sender) => {
  if (!message || !isFashionRequest(message) || !isFashionSender(sender)) return false;
  const root = fashionCurrentRoots.get(fashionRootKey(sender));
  if (state) {
    const identityMatches = state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
      && matchesFashionSenderSnapshot(state, sender);
    const retired = Boolean(root && identityMatches && root.documentId === state.documentId && root.retired && !root.active
      && root.epoch > state.rootEpoch && fashionInFlight.get(key) !== state && fashionAbortController.get(key) !== state.controller);
    const abortedCurrent = Boolean(root && identityMatches && root.active && !root.retired && matchesFashionSenderSnapshot(root, sender)
      && fashionInFlight.get(key) === state && fashionAbortController.get(key) === state.controller
      && (state.cancelled || state.invalidated || state.controller.signal.aborted));
    return retired || abortedCurrent;
  }
  return Boolean(root && root.operation === message.operation && (
    (matchesFashionSenderSnapshot(root, sender) && (
      ((!root.active || root.retired) && root.documentId === sender.documentId)
      || (root.active && root.documentId === sender.documentId && message.generation <= root.lastGeneration)
      || (root.active && root.documentId === sender.documentId && message.generation > root.lastGeneration
        && !fashionInFlight.has(key) && !fashionAbortController.has(key))
    ))
    || root.retiredDocumentIds.has(sender.documentId)
  ));
};
const finalizeAnimalFailure = (key, state, message, sender, kind) => {
  if (isAnimalFailureFence(key, state, message, sender, kind)) {
    if (kind !== ANIMAL_ERROR_KINDS.CANCELLED) animalErrorShell.set(key, kind);
    return { ok: false, kind, fenced: true };
  }
  return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED, fenced: isAnimalCancellationFence(key, state, message, sender) };
};
const finalizeFashionFailure = (key, state, message, sender, kind) => {
  if (isFashionFailureFence(key, state, message, sender, kind)) {
    if (kind !== FASHION_ERROR_KINDS.CANCELLED) fashionErrorShell.set(key, kind);
    return { ok: false, kind, fenced: true };
  }
  return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED, fenced: isFashionCancellationFence(key, state, message, sender) };
};

const cancelAnimal = (message, sender) => {
  const root = currentAnimalRoot(sender);
  if (root && root.operation === message.operation && root.requestId === message.requestId && root.lastGeneration === message.generation) {
    const state = animalInFlight.get(animalRequestKey(sender));
    if (!state || (state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
      && matchesAnimalSenderSnapshot(state, sender))) {
      invalidateAnimalRoot(root.rootKey, "matched-cancel");
    }
  }
};
const cancelFashion = (message, sender) => {
  const root = currentFashionRoot(sender);
  if (root && root.operation === message.operation && root.requestId === message.requestId && root.lastGeneration === message.generation) {
    const state = fashionInFlight.get(fashionRequestKey(sender));
    if (!state || (state.requestId === message.requestId && state.generation === message.generation && state.operation === message.operation
      && matchesFashionSenderSnapshot(state, sender))) {
      invalidateFashionRoot(root.rootKey, "matched-cancel");
    }
  }
};

const fetchAnimalFeed = async (message, sender) => {
  if (!isAnimalRequest(message) || !isAnimalSender(sender)) return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
  const key = animalRequestKey(sender); const rootKey = animalRootKey(sender); const existing = animalCurrentRoots.get(rootKey);
  if (existing && existing.documentId !== sender.documentId && existing.retiredDocumentIds.has(sender.documentId)) return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
  if (existing && existing.documentId === sender.documentId && (!existing.active || message.generation <= existing.lastGeneration)) return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
  if (isFreshAnimalCache()) {
    const root = registerAnimalRoot(sender); if (!isAnimalRootMessageFence(root, sender, message)) return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
    root.lastGeneration = message.generation; root.requestId = message.requestId; animalGeneration.set(key, message.generation); animalUiState.set(key, "success"); return { ok: true, data: animalCache.data };
  }
  const previous = animalInFlight.get(key); const transferState = previous || [...animalInFlight.values()].find((state) => state.rootKey === rootKey && state.documentId !== sender.documentId && state.releaseSlot);
  const releaseSlot = reserveAnimalSlot(transferState); if (!releaseSlot) return { ok: false, kind: ANIMAL_ERROR_KINDS.UNAVAILABLE };
  const root = registerAnimalRoot(sender);
  if (!root || message.generation <= root.lastGeneration) { releaseSlot(); return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED }; }
  root.lastGeneration = message.generation; root.requestId = message.requestId; animalGeneration.set(key, message.generation);
  if (previous) { previous.invalidated = true; previous.cancelled = true; previous.controller.abort(); }
  animalUiState.set(key, "loading");
  const controller = new AbortController();
  const state = { controller, requestId: message.requestId, generation: message.generation, operation: ANIMAL_OPERATION, sender,
    senderId: sender.id, tabId: sender.tab.id, tabUrl: sender.tab.url, senderUrl: sender.url, origin: sender.origin, frameId: sender.frameId,
    documentId: sender.documentId, rootKey: root.rootKey, rootEpoch: root.epoch, cancelled: false, invalidated: false, timedOut: false, releaseSlot };
  animalInFlight.set(key, state); animalAbortController.set(key, controller);
  if (!isCurrentAnimalState(key, state)) {
    if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    animalInFlight.delete(key); animalAbortController.delete(key);
    return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
  }
  let timedOut = false; const timeout = setTimeout(() => { timedOut = true; state.timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(ANIMAL_FEED_URL, { method: "GET", credentials: "omit", redirect: "manual", signal: controller.signal });
    if (response.type === "opaqueredirect" || response.redirected === true || (response.status >= 300 && response.status < 400)) throw new AnimalDataError(ANIMAL_ERROR_KINDS.REDIRECTED);
    if (!response.ok || response.status !== 200) throw new AnimalDataError(ANIMAL_ERROR_KINDS.UNAVAILABLE);
    const data = projectAnimalFeed(await readAnimalJson(response));
    if (!isCurrentAnimalState(key, state)) return { ok: false, kind: ANIMAL_ERROR_KINDS.CANCELLED };
    animalUiState.set(key, data.status);
    if (data.status === "success") { animalCache.key = ANIMAL_CACHE_KEY; animalCache.data = data; animalCache.expiresAt = Date.now() + ANIMAL_CACHE_TTL_MS; }
    if (data.status === "success" || data.status === "partial") animalLastGood = data;
    animalErrorShell.delete(key); return { ok: true, data };
  } catch (error) {
    if (timedOut) return finalizeAnimalFailure(key, state, message, sender, ANIMAL_ERROR_KINDS.TIMEOUT);
    if (state.cancelled || state.invalidated || controller.signal.aborted || (error && error.name === "AbortError")) {
      return finalizeAnimalFailure(key, state, message, sender, ANIMAL_ERROR_KINDS.CANCELLED);
    }
    if (error instanceof AnimalDataError) return finalizeAnimalFailure(key, state, message, sender, error.kind);
    return finalizeAnimalFailure(key, state, message, sender, ANIMAL_ERROR_KINDS.UNAVAILABLE);
  } finally {
    clearTimeout(timeout); if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    if (animalInFlight.get(key) === state) { animalInFlight.delete(key); animalAbortController.delete(key); }
  }
};

const fetchFashionFeed = async (message, sender) => {
  if (!isFashionRequest(message) || !isFashionSender(sender)) return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
  const key = fashionRequestKey(sender); const rootKey = fashionRootKey(sender); const existing = fashionCurrentRoots.get(rootKey);
  if (existing && existing.documentId !== sender.documentId && existing.retiredDocumentIds.has(sender.documentId)) return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
  if (existing && existing.documentId === sender.documentId && (!existing.active || message.generation <= existing.lastGeneration)) return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
  if (isFreshFashionCache()) {
    const root = registerFashionRoot(sender); if (!isFashionRootMessageFence(root, sender, message)) return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
    root.lastGeneration = message.generation; root.requestId = message.requestId; fashionGeneration.set(key, message.generation); fashionUiState.set(key, "success"); return { ok: true, data: fashionCache.data };
  }
  const previous = fashionInFlight.get(key); const transferState = previous || [...fashionInFlight.values()].find((state) => state.rootKey === rootKey && state.documentId !== sender.documentId && state.releaseSlot);
  const releaseSlot = reserveFashionSlot(transferState); if (!releaseSlot) return { ok: false, kind: FASHION_ERROR_KINDS.UNAVAILABLE };
  const root = registerFashionRoot(sender);
  if (!root || message.generation <= root.lastGeneration) { releaseSlot(); return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED }; }
  root.lastGeneration = message.generation; root.requestId = message.requestId; fashionGeneration.set(key, message.generation);
  if (previous) { previous.invalidated = true; previous.cancelled = true; previous.controller.abort(); }
  fashionUiState.set(key, "loading");
  const controller = new AbortController();
  const state = { controller, requestId: message.requestId, generation: message.generation, operation: FASHION_OPERATION, sender,
    senderId: sender.id, tabId: sender.tab.id, tabUrl: sender.tab.url, senderUrl: sender.url, origin: sender.origin, frameId: sender.frameId,
    documentId: sender.documentId, rootKey: root.rootKey, rootEpoch: root.epoch, cancelled: false, invalidated: false, timedOut: false, releaseSlot };
  fashionInFlight.set(key, state); fashionAbortController.set(key, controller);
  if (!isCurrentFashionState(key, state)) {
    if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    fashionInFlight.delete(key); fashionAbortController.delete(key);
    return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
  }
  let timedOut = false; const timeout = setTimeout(() => { timedOut = true; state.timedOut = true; controller.abort(); }, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(FASHION_FEED_URL, { method: "GET", credentials: "omit", redirect: "manual", signal: controller.signal });
    if (response.type === "opaqueredirect" || response.redirected === true || (response.status >= 300 && response.status < 400)) throw new FashionDataError(FASHION_ERROR_KINDS.REDIRECTED);
    if (!response.ok || response.status !== 200) throw new FashionDataError(FASHION_ERROR_KINDS.UNAVAILABLE);
    const data = projectFashionFeed(await readFashionJson(response));
    if (!isCurrentFashionState(key, state)) return { ok: false, kind: FASHION_ERROR_KINDS.CANCELLED };
    fashionUiState.set(key, data.status);
    if (data.status === "success") { fashionCache.key = FASHION_CACHE_KEY; fashionCache.data = data; fashionCache.expiresAt = Date.now() + FASHION_CACHE_TTL_MS; }
    if (data.status === "success" || data.status === "partial") fashionLastGood = data;
    fashionErrorShell.delete(key); return { ok: true, data };
  } catch (error) {
    if (timedOut) return finalizeFashionFailure(key, state, message, sender, FASHION_ERROR_KINDS.TIMEOUT);
    if (state.cancelled || state.invalidated || controller.signal.aborted || (error && error.name === "AbortError")) {
      return finalizeFashionFailure(key, state, message, sender, FASHION_ERROR_KINDS.CANCELLED);
    }
    if (error instanceof FashionDataError) return finalizeFashionFailure(key, state, message, sender, error.kind);
    return finalizeFashionFailure(key, state, message, sender, FASHION_ERROR_KINDS.UNAVAILABLE);
  } finally {
    clearTimeout(timeout); if (state.releaseSlot) { state.releaseSlot(); state.releaseSlot = null; }
    if (fashionInFlight.get(key) === state) { fashionInFlight.delete(key); fashionAbortController.delete(key); }
  }
};

const isExactAnimalResult = (result, requestId, generation) => {
  if (!isPlainObject(result) || result.type !== "HOMEPAGE_DATA_RESULT_V1" || result.requestId !== requestId || result.generation !== generation
    || result.operation !== ANIMAL_OPERATION || typeof result.ok !== "boolean") return false;
  if (result.ok) return Object.keys(result).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
    && isPlainObject(result.data) && Object.keys(result.data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(result.data.items)
    && ((result.data.status === "success" && result.data.items.length === 15) || (result.data.status === "partial" && result.data.items.length >= 1 && result.data.items.length <= 14) || (result.data.status === "empty" && result.data.items.length === 0))
    && result.data.items.every((item) => isPlainObject(item) && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview" && typeof item.bvid === "string" && ANIMAL_BVID_RE.test(item.bvid) && typeof item.title === "string" && item.title.trim() && typeof item.ownerName === "string" && item.ownerName.trim() && (item.coverUrl === null || normalizeAnimalCoverUrl(item.coverUrl) === item.coverUrl) && item.href === `https://www.bilibili.com/video/${item.bvid}` && (item.view === null || isAnimalCount(item.view)) && (item.danmaku === null || isAnimalCount(item.danmaku)) && (item.durationSeconds === null || isAnimalCount(item.durationSeconds)));
  return Object.keys(result).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
    && isPlainObject(result.error) && Object.keys(result.error).length === 1 && Object.values(ANIMAL_ERROR_KINDS).includes(result.error.kind);
};
const isExactFashionResult = (result, requestId, generation) => {
  if (!isPlainObject(result) || result.type !== "HOMEPAGE_DATA_RESULT_V1" || result.requestId !== requestId || result.generation !== generation
    || result.operation !== FASHION_OPERATION || typeof result.ok !== "boolean") return false;
  if (result.ok) return Object.keys(result).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
    && isPlainObject(result.data) && Object.keys(result.data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(result.data.items)
    && ((result.data.status === "success" && result.data.items.length === 15) || (result.data.status === "partial" && result.data.items.length >= 1 && result.data.items.length <= 14) || (result.data.status === "empty" && result.data.items.length === 0))
    && result.data.items.every((item) => isPlainObject(item) && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview" && typeof item.bvid === "string" && FASHION_BVID_RE.test(item.bvid) && typeof item.title === "string" && item.title.trim() && typeof item.ownerName === "string" && item.ownerName.trim() && (item.coverUrl === null || normalizeFashionCoverUrl(item.coverUrl) === item.coverUrl) && item.href === `https://www.bilibili.com/video/${item.bvid}` && (item.view === null || isFashionCount(item.view)) && (item.danmaku === null || isFashionCount(item.danmaku)) && (item.durationSeconds === null || isFashionCount(item.durationSeconds)));
  return Object.keys(result).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
    && isPlainObject(result.error) && Object.keys(result.error).length === 1 && Object.values(FASHION_ERROR_KINDS).includes(result.error.kind);
};

const recordAnimalFashionSelfTestCategory = (category) => {
  const categories = Array.isArray(globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__)
    ? globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ : [];
  if (!categories.includes(category)) categories.push(category);
  globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ = categories;
};

const stage6SelfTestPayload = (count) => ({
  code: 0,
  data: { archives: Array.from({ length: count }, (_, index) => ({
    bvid: `BV${String(index).padStart(10, "0")}`,
    title: `Stage 6 ${index}`,
    author: { name: `Owner ${index}` },
    cover: "https://i0.hdslb.com/bfs/archive/stage6.webp",
    stat: { view: index, danmaku: index + 1 },
    duration: index + 2,
    aid: 1,
    goto: "javascript:ignored"
  })) }
});

const runAnimalFashionDeterministicSelfTests = () => {
  const assert = (condition, label) => { if (!condition) throw new Error(`Animal/fashion self-test failed: ${label}`); };
  const sender = { id: chrome.runtime.id, tab: { id: 601, url: ROOT_URL }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN, documentId: "stage6-static" };
  const animalRequest = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "stage6-animal", generation: 1, operation: ANIMAL_OPERATION, params: {} };
  const fashionRequest = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "stage6-fashion", generation: 1, operation: FASHION_OPERATION, params: {} };
  const animalCancel = { type: "HOMEPAGE_DATA_CANCEL_V1", requestId: animalRequest.requestId, generation: 1, operation: ANIMAL_OPERATION };
  const fashionCancel = { type: "HOMEPAGE_DATA_CANCEL_V1", requestId: fashionRequest.requestId, generation: 1, operation: FASHION_OPERATION };
  assert(isAnimalRequest(animalRequest) && isFashionRequest(fashionRequest) && isAnimalCancel(animalCancel) && isFashionCancel(fashionCancel), "exact request/cancel schemas");
  assert(!isAnimalRequest({ ...animalRequest, url: "https://evil.example" }) && !isFashionRequest({ ...fashionRequest, params: { query: "x" } }), "caller URL/query injection rejection");
  assert(!isAnimalCancel({ ...animalCancel, extra: true }) && !isFashionCancel({ ...fashionCancel, generation: -1 }), "cancel own-key/type rejection");
  assert(isAnimalSender(sender) && isFashionSender(sender), "exact sender root accepted");
  for (const invalid of [
    { ...sender, id: "other" }, { ...sender, tab: undefined }, { ...sender, tab: { url: ROOT_URL } }, { ...sender, tab: { id: -1, url: ROOT_URL } },
    { ...sender, url: `${ROOT_URL}?x=1` }, { ...sender, tab: { id: 601, url: `${ROOT_URL}c/animal/` } },
    { ...sender, tab: { id: 601, url: `${ROOT_URL}#hash` } }, { ...sender, tab: { id: 601, url: `${ROOT_URL}c/fashion/` } },
    { ...sender, origin: "https://evil.example" }, { ...sender, frameId: 1 }, { ...sender, documentId: "" }
  ]) assert(!isAnimalSender(invalid) && !isFashionSender(invalid), "sender/root rejection");
  for (const count of [0, 1, 14, 15]) {
    assert(projectAnimalFeed(stage6SelfTestPayload(count)).items.length === count, `animal projection ${count}`);
    assert(projectFashionFeed(stage6SelfTestPayload(count)).items.length === count, `fashion projection ${count}`);
  }
  const duplicate = stage6SelfTestPayload(2); duplicate.data.archives[1].bvid = duplicate.data.archives[0].bvid;
  assert(projectAnimalFeed(duplicate).items.length === 1 && projectFashionFeed(duplicate).items.length === 1, "duplicate BVID filtering");
  const invalidRequired = stage6SelfTestPayload(2); invalidRequired.data.archives[0].title = " "; invalidRequired.data.archives[1].author.name = "";
  assert(projectAnimalFeed(invalidRequired).items.length === 0 && projectFashionFeed(invalidRequired).items.length === 0, "required field filtering");
  const guarded = stage6SelfTestPayload(1).data.archives[0];
  guarded.cover = "http://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp";
  const upgradedAnimal = projectAnimalFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  const upgradedFashion = projectFashionFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  assert(upgradedAnimal.coverUrl === "https://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp" && upgradedFashion.coverUrl === upgradedAnimal.coverUrl, "http cover upgrade and path suffix");
  for (const cover of [
    "javascript:alert(1)", "ftp://i0.hdslb.com/bfs/a.webp", "https://evil.example/bfs/a.webp",
    "https://i0.hdslb.com/bfs/a.webp?q=1", "https://i0.hdslb.com/bfs/a.webp#x",
    "https://user@i0.hdslb.com/bfs/a.webp", "https://i0.hdslb.com:443/bfs/a.webp",
    `https://i0.hdslb.com/bfs/${"a".repeat(MAX_COVER_URL_LENGTH)}.webp`,
    `https://i0.hdslb.com/bfs/a.webp?${"q".repeat(MAX_COVER_URL_LENGTH)}`,
    "https://i0.hdslb.com/bfs/../a.webp", "https://i0.hdslb.com/bfs/a\u0000.webp", "/bfs/a.webp"
  ]) {
    guarded.cover = cover;
    assert(projectAnimalFeed({ code: 0, data: { archives: [guarded] } }).items[0].coverUrl === null && projectFashionFeed({ code: 0, data: { archives: [guarded] } }).items[0].coverUrl === null, "cover guard");
  }
  for (const invalidPayload of [
    { code: 1, data: { archives: [] } },
    { code: 0, data: null },
    { code: 0, data: { archives: {} } },
    { code: 0, data: { archives: new Array(16).fill({}) } }
  ]) {
    let animalRejected = false; let fashionRejected = false;
    try { projectAnimalFeed(invalidPayload); } catch (error) { animalRejected = error instanceof AnimalDataError; }
    try { projectFashionFeed(invalidPayload); } catch (error) { fashionRejected = error instanceof FashionDataError; }
    assert(animalRejected && fashionRejected, "malformed root/data/archives and nonzero code rejection");
  }
  guarded.cover = "https://i3.hdslb.com/bfs/archive/stage6.webp";
  const projected = projectAnimalFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  assert(projected.href === `https://www.bilibili.com/video/${projected.bvid}` && Object.keys(projected).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview", "strict projection and derived href");
  const success = createAnimalResult(animalRequest, { ok: true, data: projectAnimalFeed(stage6SelfTestPayload(1)) });
  const failure = createFashionResult(fashionRequest, { ok: false, kind: FASHION_ERROR_KINDS.SCHEMA });
  assert(isExactAnimalResult(success, animalRequest.requestId, animalRequest.generation) && isExactFashionResult(failure, fashionRequest.requestId, fashionRequest.generation), "typed result validators");
  const animalRoot = registerAnimalRoot(sender); const fashionRoot = registerFashionRoot(sender);
  const replacement = { ...sender, documentId: "stage6-static-new" };
  registerAnimalRoot(replacement); registerFashionRoot(replacement);
  assert(registerAnimalRoot(sender) === null && registerFashionRoot(sender) === null && animalRoot !== fashionRoot, "independent monotonic root registries");
  assert(ANIMAL_FEED_URL === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1024&device=web&plat=30&web_location=333.40138" && FASHION_FEED_URL === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1014&device=web&plat=30&web_location=333.40138", "fixed compile-time URLs");
  assert(ANIMAL_CACHE_KEY !== FASHION_CACHE_KEY && animalInFlight !== fashionInFlight && animalLastGood === null && fashionLastGood === null, "shared state isolation");
  recordAnimalFashionSelfTestCategory("01 exact own-key request/cancel/result/error schemas and caller-input rejection: PASS");
  recordAnimalFashionSelfTestCategory("02 exact extension/tab/url/origin/frame/document/root lifecycle rejection: PASS");
  recordAnimalFashionSelfTestCategory("03 projection 0/1/14/15, duplicate/required fields, cover guard, derived href: PASS");
  recordAnimalFashionSelfTestCategory("04 fixed animal/fashion URLs and independent root/cache/state namespaces: PASS");
  return true;
};

const runAnimalFashionTransportSelfTests = async () => {
  const assert = (condition, label) => { if (!condition) throw new Error(`Animal/fashion transport self-test failed: ${label}`); };
  const sender = { id: chrome.runtime.id, tab: { id: 602, url: ROOT_URL }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN, documentId: "stage6-transport" };
  const encode = (value) => new TextEncoder().encode(JSON.stringify(value));
  const responseFor = (value, bytesOverride, overrides = {}) => {
    const bytes = bytesOverride || encode(value); let consumed = false;
    const reader = overrides.reader || { read: async () => consumed ? { done: true } : (consumed = true, { done: false, value: bytes }), cancel: async () => {} };
    return { ok: true, status: 200, type: "basic", redirected: false, ...overrides,
      headers: overrides.headers || { get: (name) => name === "content-type" ? "application/json" : null },
      body: overrides.body || { getReader: () => reader } };
  };
  const originalFetch = globalThis.fetch; const originalSetTimeout = globalThis.setTimeout; const originalClearTimeout = globalThis.clearTimeout;
  const original = {
    animalCache: { ...animalCache }, fashionCache: { ...fashionCache }, animalLastGood, fashionLastGood, animalUpstreamSlots, fashionUpstreamSlots,
    maps: [animalInFlight, fashionInFlight, animalGeneration, fashionGeneration, animalAbortController, fashionAbortController, animalErrorShell, fashionErrorShell, animalUiState, fashionUiState, animalCurrentRoots, fashionCurrentRoots].map((map) => [...map.entries()])
  };
  const clearStage6 = () => { for (const map of [animalInFlight, fashionInFlight, animalGeneration, fashionGeneration, animalAbortController, fashionAbortController, animalErrorShell, fashionErrorShell, animalUiState, fashionUiState, animalCurrentRoots, fashionCurrentRoots]) map.clear(); animalCache.data = null; animalCache.expiresAt = 0; fashionCache.data = null; fashionCache.expiresAt = 0; animalLastGood = null; fashionLastGood = null; animalUpstreamSlots = 0; fashionUpstreamSlots = 0; };
  clearStage6();
  try {
    let rejectedFetches = 0;
    globalThis.fetch = () => { rejectedFetches += 1; return Promise.reject(new Error("invalid input must not fetch")); };
    const validAnimalEnvelope = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "invalid-base", generation: 1, operation: ANIMAL_OPERATION, params: {} };
    for (const invalid of [
      null,
      { ...validAnimalEnvelope, requestId: "" },
      { ...validAnimalEnvelope, generation: -1 },
      { ...validAnimalEnvelope, operation: FASHION_OPERATION },
      { ...validAnimalEnvelope, params: { query: "caller" } },
      { ...validAnimalEnvelope, extra: true }
    ]) {
      const rejected = await fetchAnimalFeed(invalid, sender);
      assert(!rejected.ok && rejected.kind === ANIMAL_ERROR_KINDS.CANCELLED, "invalid envelope rejected before fetch");
    }
    const wrongSender = { ...sender, tab: { id: 602, url: `${ROOT_URL}?bad=1` } };
    const wrongSenderResult = await fetchAnimalFeed(validAnimalEnvelope, wrongSender);
    assert(!wrongSenderResult.ok && rejectedFetches === 0, "wrong sender rejected before fetch");
    for (const missingKey of ["type", "requestId", "generation", "operation", "params"]) {
      const missing = { ...validAnimalEnvelope }; delete missing[missingKey];
      const rejected = await fetchAnimalFeed(missing, sender);
      assert(!rejected.ok && rejected.kind === ANIMAL_ERROR_KINDS.CANCELLED && rejectedFetches === 0, `missing ${missingKey} rejected before fetch`);
    }
    recordAnimalFashionSelfTestCategory("00 missing/wrong envelope and sender dimensions zero fetch: PASS");

    const calls = [];
    globalThis.fetch = (url, options) => { calls.push({ url, options }); return Promise.resolve(responseFor(stage6SelfTestPayload(15))); };
    const [animal, fashion] = await Promise.all([
      fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-1", generation: 1, operation: ANIMAL_OPERATION, params: {} }, sender),
      fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-1", generation: 1, operation: FASHION_OPERATION, params: {} }, sender)
    ]);
    assert(animal.ok && fashion.ok && calls.length === 2, "independent fixed fetches");
    assert(calls.some((call) => call.url === ANIMAL_FEED_URL) && calls.some((call) => call.url === FASHION_FEED_URL), "fixed URL per operation");
    assert(calls.every((call) => Object.keys(call.options).sort().join("\u001F") === "credentials\u001Fmethod\u001Fredirect\u001Fsignal" && call.options.method === "GET" && call.options.credentials === "omit" && call.options.redirect === "manual" && !Object.prototype.hasOwnProperty.call(call.options, "body")), "fixed options/no caller transport input");
    assert(isFreshAnimalCache() && isFreshFashionCache() && animalUpstreamSlots === 0 && fashionUpstreamSlots === 0, "complete cache and lease cleanup");
    await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-cache", generation: 2, operation: ANIMAL_OPERATION, params: {} }, sender);
    await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-cache", generation: 2, operation: FASHION_OPERATION, params: {} }, sender);
    assert(calls.length === 2, "same-floor cache hit");
    animalCache.expiresAt = Date.now() - 1;
    fashionCache.expiresAt = Date.now() - 1;
    await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-ttl", generation: 3, operation: ANIMAL_OPERATION, params: {} }, sender);
    await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-ttl", generation: 3, operation: FASHION_OPERATION, params: {} }, sender);
    assert(calls.length === 4, "expired TTL fetches again");
    recordAnimalFashionSelfTestCategory("05 GET/omit/manual/no-body/no-retry and independent concurrent upstream admission: PASS");

    animalCache.data = null; animalCache.expiresAt = 0; fashionCache.data = null; fashionCache.expiresAt = 0;
    globalThis.fetch = () => Promise.resolve(responseFor(stage6SelfTestPayload(1)));
    const partial = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-partial", generation: 4, operation: ANIMAL_OPERATION, params: {} }, sender);
    assert(partial.ok && partial.data.status === "partial" && animalCache.data === null && animalLastGood.items.length === 1, "partial cache/last-good policy");
    globalThis.fetch = () => Promise.resolve(responseFor(stage6SelfTestPayload(0)));
    const empty = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-empty", generation: 5, operation: ANIMAL_OPERATION, params: {} }, sender);
    assert(empty.ok && empty.data.status === "empty" && animalLastGood.items.length === 1 && animalCache.data === null, "empty preserves last-good and skips cache");
    globalThis.fetch = () => Promise.reject(new Error("network"));
    const failed = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-failure", generation: 6, operation: ANIMAL_OPERATION, params: {} }, sender);
    assert(!failed.ok && failed.kind === ANIMAL_ERROR_KINDS.UNAVAILABLE && animalLastGood.items.length === 1, "typed failure preserves own last-good");
    recordAnimalFashionSelfTestCategory("06 partial/empty/failure cache policy and same-operation last-good behavior: PASS");

    globalThis.fetch = () => Promise.resolve(responseFor(null, new Uint8Array(MAX_ANIMAL_RESPONSE_BYTES + 1)));
    const oversized = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "animal-large", generation: 7, operation: ANIMAL_OPERATION, params: {} }, sender);
    assert(!oversized.ok && oversized.kind === ANIMAL_ERROR_KINDS.SCHEMA && animalUpstreamSlots === 0, "streamed 2 MiB cap");
    globalThis.fetch = () => Promise.resolve(responseFor(null, null, { type: "opaqueredirect", redirected: true }));
    const redirected = await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-redirect", generation: 4, operation: FASHION_OPERATION, params: {} }, sender);
    assert(!redirected.ok && redirected.kind === FASHION_ERROR_KINDS.REDIRECTED, "manual redirect rejection without Location");
    const badRoot = await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-bad", generation: 5, operation: FASHION_OPERATION, params: {} }, { ...sender, tab: { id: 602, url: `${ROOT_URL}?x=1` } });
    assert(badRoot.ok === false || badRoot.kind === FASHION_ERROR_KINDS.CANCELLED, "invalid sender does not authorize transport");
    recordAnimalFashionSelfTestCategory("07 redirect/network/schema/oversize typed failures with no raw transport detail: PASS");

    const malformedTransportCases = [
      ["non-json MIME", responseFor(stage6SelfTestPayload(15), null, { headers: { get: () => "text/html" } })],
      ["invalid UTF-8", responseFor(null, new Uint8Array([0xff, 0xfe]))],
      ["invalid JSON", responseFor(null, new TextEncoder().encode("{"))],
      ["reader failure", responseFor(null, null, { reader: { read: async () => { throw new Error("reader"); }, cancel: async () => {} } })],
      ["nonzero code", responseFor({ code: 1, data: { archives: [] } })],
      ["malformed root", responseFor({ code: 0, data: null })],
      ["malformed data", responseFor({ code: 0, data: { archives: {} } })]
    ];
    let malformedGeneration = 30;
    for (const [label, response] of malformedTransportCases) {
      animalCache.data = null; animalCache.expiresAt = 0;
      let caseCalls = 0;
      globalThis.fetch = () => { caseCalls += 1; return Promise.resolve(response); };
      const malformed = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: `animal-${label}`, generation: malformedGeneration++, operation: ANIMAL_OPERATION, params: {} }, sender);
      assert(!malformed.ok && malformed.kind === ANIMAL_ERROR_KINDS.SCHEMA && caseCalls === 1, `${label} typed failure and no retry`);
    }
    recordAnimalFashionSelfTestCategory("07A MIME/UTF-8/JSON/reader/nonzero/malformed/no-retry assertions: PASS");

    const originalTimer = globalThis.setTimeout; const originalClear = globalThis.clearTimeout;
    globalThis.setTimeout = (callback) => { callback(); return 1; }; globalThis.clearTimeout = () => {};
    globalThis.fetch = (_url, options) => new Promise((resolve, reject) => { const abort = () => { const error = new Error(); error.name = "AbortError"; reject(error); }; if (options.signal.aborted) abort(); else options.signal.addEventListener("abort", abort, { once: true }); });
    const timeoutResult = await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-timeout", generation: 5, operation: FASHION_OPERATION, params: {} }, sender);
    globalThis.setTimeout = originalTimer; globalThis.clearTimeout = originalClear;
    assert(!timeoutResult.ok && timeoutResult.kind === FASHION_ERROR_KINDS.TIMEOUT, "5 second timeout typing");
    const cancelRecords = [];
    globalThis.fetch = (_url, options) => new Promise((resolve, reject) => {
      const record = { aborted: false };
      const abort = () => { record.aborted = true; const error = new Error(); error.name = "AbortError"; reject(error); };
      options.signal.addEventListener("abort", abort, { once: true });
      cancelRecords.push(record);
    });
    const cancelMessage = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "fashion-cancel", generation: 6, operation: FASHION_OPERATION, params: {} };
    const cancelPromise = fetchFashionFeed(cancelMessage, sender);
    const cancelRoot = fashionCurrentRoots.get(fashionRootKey(sender));
    const cancelState = fashionInFlight.get(fashionRequestKey(sender));
    const cancelRelease = cancelState.releaseSlot;
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: "wrong", generation: cancelMessage.generation, operation: FASHION_OPERATION }, sender);
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation + 1, operation: FASHION_OPERATION }, sender);
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation, operation: ANIMAL_OPERATION }, sender);
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation, operation: FASHION_OPERATION }, { ...sender, tab: { id: 999, url: ROOT_URL } });
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation, operation: FASHION_OPERATION }, { ...sender, frameId: 1 });
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation, operation: FASHION_OPERATION }, { ...sender, url: `${ROOT_URL}?query=1` });
    assert(cancelRoot.active && !cancelRoot.retired && fashionInFlight.has(fashionRequestKey(sender)), "cancel mismatch dimensions do not retire root");
    cancelFashion({ type: "HOMEPAGE_DATA_CANCEL_V1", requestId: cancelMessage.requestId, generation: cancelMessage.generation, operation: FASHION_OPERATION }, sender);
    const cancelResult = await cancelPromise;
    assert(!cancelResult.ok && cancelResult.kind === FASHION_ERROR_KINDS.CANCELLED && cancelRecords.length === 1 && cancelRecords[0].aborted
      && fashionInFlight.size === 0 && fashionUpstreamSlots === 0 && !cancelRoot.active && cancelRoot.retired && cancelRoot.epoch === 1
      && cancelRelease.callCount() === 1 && registerFashionRoot(sender) === null && currentAnimalRoot(sender), "exact matching cancel retires only its root and cleans up");
    const retiredFetchCount = cancelRecords.length;
    for (const generation of [0, 6, 99]) {
      const retired = await fetchFashionFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: `retired-${generation}`, generation, operation: FASHION_OPERATION, params: {} }, sender);
      assert(!retired.ok && retired.kind === FASHION_ERROR_KINDS.CANCELLED && cancelRecords.length === retiredFetchCount, `retired same-document generation ${generation} zero fetch`);
    }
    recordAnimalFashionSelfTestCategory("08 timeout/abort typed result and timer cleanup: PASS");

    animalCache.data = null; animalCache.expiresAt = 0; animalLastGood = null;
    const pending = []; globalThis.fetch = (_url, options) => new Promise((resolve, reject) => { const record = { resolve, reject, aborted: false }; const abort = () => { record.aborted = true; const error = new Error(); error.name = "AbortError"; reject(error); }; options.signal.addEventListener("abort", abort, { once: true }); pending.push(record); });
    const oldSender = { ...sender, tab: { id: 603, url: ROOT_URL }, documentId: "stage6-old" }; const newSender = { ...oldSender, documentId: "stage6-new" };
    const oldPromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "old", generation: 1, operation: ANIMAL_OPERATION, params: {} }, oldSender);
    const oldState = animalInFlight.get(animalRequestKey(oldSender));
    const newPromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "new", generation: 1, operation: ANIMAL_OPERATION, params: {} }, newSender);
    assert(oldState && oldState.invalidated && pending[0].aborted && pending.length === 2, "replacement root abort and lease transfer");
    pending[1].resolve(responseFor(stage6SelfTestPayload(15)));
    const [oldResult, newResult] = await Promise.all([oldPromise, newPromise]);
    assert(!oldResult.ok && oldResult.kind === ANIMAL_ERROR_KINDS.CANCELLED && newResult.ok && animalLastGood.items.length === 15, "stale old-root no commit/new-root commit");
    const oldGenerationKey = `${animalRootKey(oldSender)}:${oldSender.documentId}:${ANIMAL_OPERATION}`;
    assert(!animalGeneration.has(oldGenerationKey), "retired old-root generation entry removed");
    const mismatchSentinel = { status: "partial", items: [{ bvid: "BV0000000000" }] };
    const mismatchFields = {
      senderId: "wrong-extension", tabId: -1, tabUrl: `${ROOT_URL}?query=1`, senderUrl: `${ROOT_URL}#hash`, origin: "https://evil.example",
      frameId: 1, documentId: "wrong-document", requestId: "wrong-request", generation: 2, operation: FASHION_OPERATION, rootEpoch: 99
    };
    for (const [field, invalidValue] of Object.entries(mismatchFields)) {
      const mismatchSender = { ...sender, tab: { id: 604 + Object.keys(mismatchFields).indexOf(field), url: ROOT_URL }, documentId: `mismatch-${field}` };
      animalCache.data = null; animalCache.expiresAt = 0; animalLastGood = mismatchSentinel;
      const mismatchPending = [];
      globalThis.fetch = (_url, options) => new Promise((resolve, reject) => {
        const abort = () => { const error = new Error(); error.name = "AbortError"; reject(error); };
        options.signal.addEventListener("abort", abort, { once: true }); mismatchPending.push({ resolve });
      });
      const mismatchPromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: `mismatch-${field}`, generation: 1, operation: ANIMAL_OPERATION, params: {} }, mismatchSender);
      const mismatchKey = animalRequestKey(mismatchSender); const mismatchState = animalInFlight.get(mismatchKey);
      mismatchState[field] = invalidValue;
      mismatchPending[0].resolve(responseFor(stage6SelfTestPayload(15)));
      const mismatchResult = await mismatchPromise;
      assert(!mismatchResult.ok && mismatchResult.kind === ANIMAL_ERROR_KINDS.CANCELLED && animalCache.data === null && animalLastGood === mismatchSentinel,
        `final commit fence ${field} zero-write`);
    }
    const failureMismatchFields = {
      senderId: "wrong-extension", tabId: -1, tabUrl: `${ROOT_URL}?query=1`, senderUrl: `${ROOT_URL}#hash`, origin: "https://evil.example",
      frameId: 1, documentId: "wrong-document", requestId: "wrong-request", generation: 2, operation: FASHION_OPERATION, rootEpoch: 99,
      cancelled: true, invalidated: true, controller: new AbortController()
    };
    for (const [field, invalidValue] of Object.entries(failureMismatchFields)) {
      const failureSender = { ...sender, tab: { id: 700 + Object.keys(failureMismatchFields).indexOf(field), url: ROOT_URL }, documentId: `failure-${field}` };
      const failureKey = animalRequestKey(failureSender); const failureSentinel = "preserve-error";
      animalCache.data = null; animalCache.expiresAt = 0; animalLastGood = mismatchSentinel; animalErrorShell.set(failureKey, failureSentinel);
      globalThis.fetch = () => Promise.reject(new Error("failure-fence"));
      const failurePromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: `failure-${field}`, generation: 1, operation: ANIMAL_OPERATION, params: {} }, failureSender);
      const failureState = animalInFlight.get(failureKey); failureState[field] = invalidValue;
      const failureResult = await failurePromise;
      assert(!failureResult.ok && failureResult.kind === ANIMAL_ERROR_KINDS.CANCELLED && animalCache.data === null
        && animalLastGood === mismatchSentinel && animalErrorShell.get(failureKey) === failureSentinel,
      `failure final fence ${field} preserves state`);
      animalErrorShell.delete(failureKey);
    }
    recordAnimalFashionSelfTestCategory("09B timeout/network/schema/abort failure final-fence mismatch dimensions preserve state: PASS");
    for (const generation of [0, 1, 99]) {
      const stale = await fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: `old-${generation}`, generation, operation: ANIMAL_OPERATION, params: {} }, oldSender);
      assert(!stale.ok && stale.kind === ANIMAL_ERROR_KINDS.CANCELLED, `retired old root generation ${generation}`);
    }
    recordAnimalFashionSelfTestCategory("09 cancel/root replacement/retired low-equal-high generation commit fence: PASS");

    animalCache.data = null; animalCache.expiresAt = 0;
    const replaceSender = { ...sender, tab: { id: 605, url: ROOT_URL }, documentId: "stage6-same-root" };
    const replacePending = [];
    globalThis.fetch = (_url, options) => new Promise((resolve, reject) => {
      const record = { resolve, reject, aborted: false };
      options.signal.addEventListener("abort", () => { record.aborted = true; const error = new Error(); error.name = "AbortError"; reject(error); }, { once: true });
      replacePending.push(record);
    });
    const replaceFirstPromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "replace-first", generation: 1, operation: ANIMAL_OPERATION, params: {} }, replaceSender);
    const replaceFirstState = animalInFlight.get(animalRequestKey(replaceSender));
    const replaceFirstRelease = replaceFirstState.releaseSlot;
    const replaceSecondPromise = fetchAnimalFeed({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "replace-second", generation: 2, operation: ANIMAL_OPERATION, params: {} }, replaceSender);
    assert(replaceFirstState.invalidated && replaceFirstState.cancelled && replacePending.length === 2 && replacePending[0].aborted, "same-operation policy is replacement with abort");
    replacePending[1].resolve(responseFor(stage6SelfTestPayload(15)));
    const [replaceFirst, replaceSecond] = await Promise.all([replaceFirstPromise, replaceSecondPromise]);
    assert(!replaceFirst.ok && replaceFirst.kind === ANIMAL_ERROR_KINDS.CANCELLED && replaceSecond.ok && replaceFirstRelease.callCount() === 1
      && animalUpstreamSlots === 0, "replacement transfers exactly one active lease");
    recordAnimalFashionSelfTestCategory("09A same-operation concurrent policy=REPLACEMENT, old fetch abort/new fetch commit: PASS");
    assert(animalInFlight.size === 0 && fashionInFlight.size === 0 && animalAbortController.size === 0 && fashionAbortController.size === 0 && animalUpstreamSlots === 0 && fashionUpstreamSlots === 0, "inflight/controller/lease cleanup once");
    recordAnimalFashionSelfTestCategory("10 abort/exception/settle cleanup releases operation-owned maps/controllers/leases once: PASS");
    assert(animalCache.key !== fashionCache.key && animalGeneration !== fashionGeneration && animalCurrentRoots !== fashionCurrentRoots && !animalCache.key.includes("1003") && !fashionCache.key.includes("1024"), "cross-floor and knowledge/music isolation");
    recordAnimalFashionSelfTestCategory("11 no shared knowledge/music/PGC/auth cache, generation, root, last-good, or coalescing state: PASS");
    recordAnimalFashionSelfTestCategory("12 SW boundary exposes only typed projection/error shells; renderer/content stale zero-write is gated separately: PASS");
    return true;
  } finally {
    globalThis.fetch = originalFetch; globalThis.setTimeout = originalSetTimeout; globalThis.clearTimeout = originalClearTimeout;
    animalCache.key = original.animalCache.key; animalCache.data = original.animalCache.data; animalCache.expiresAt = original.animalCache.expiresAt;
    fashionCache.key = original.fashionCache.key; fashionCache.data = original.fashionCache.data; fashionCache.expiresAt = original.fashionCache.expiresAt;
    animalLastGood = original.animalLastGood; fashionLastGood = original.fashionLastGood; animalUpstreamSlots = original.animalUpstreamSlots; fashionUpstreamSlots = original.fashionUpstreamSlots;
    for (const [map, entries] of [animalInFlight, fashionInFlight, animalGeneration, fashionGeneration, animalAbortController, fashionAbortController, animalErrorShell, fashionErrorShell, animalUiState, fashionUiState, animalCurrentRoots, fashionCurrentRoots].map((map, index) => [map, original.maps[index]])) { map.clear(); for (const entry of entries) map.set(entry[0], entry[1]); }
  }
};

const recordMusicSelfTestCategory = (category) => {
  const categories = Array.isArray(globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__)
    ? globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__ : [];
  if (!categories.includes(category)) categories.push(category);
  globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__ = categories;
};

const runMusicDeterministicSelfTests = () => {
  const assert = (condition, label) => { if (!condition) throw new Error(`Music self-test failed: ${label}`); };
  const sender = { id: chrome.runtime.id, tab: { id: 77, url: ROOT_URL }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN, documentId: "music-self-test" };
  const request = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId: "music-self-test", generation: 0, operation: MUSIC_OPERATION, params: {} };
  const makeArchive = (index) => ({ bvid: `BV${String(index).padStart(10, "0")}`, title: `音乐${index}`, author: { name: `作者${index}` }, cover: "https://i0.hdslb.com/bfs/archive/music.webp", stat: { view: index, danmaku: index + 1 }, duration: index + 2, goto: "javascript:ignored", aid: 1 });
  const payload = (count) => ({ code: 0, data: { archives: Array.from({ length: count }, (_, index) => makeArchive(index)) } });
  assert(isMusicSender(sender), "exact sender");
  assert(isExactMusicMessage(request), "exact request envelope");
  assert(!isExactMusicMessage({ ...request, extra: true }) && !isExactMusicMessage({ ...request, params: { url: "evil" } }), "request rejection");
  const cancel = { type: "HOMEPAGE_DATA_CANCEL_V1", requestId: request.requestId, generation: 0, operation: MUSIC_OPERATION };
  assert(isExactMusicCancelMessage(cancel), "exact cancel envelope");
  for (const invalidSender of [
    { ...sender, id: "other-extension" },
    { ...sender, origin: "https://evil.example" },
    { ...sender, tab: { id: 77, url: "https://www.bilibili.com/?query=1" } },
    { ...sender, tab: { id: -1, url: ROOT_URL } },
    { ...sender, frameId: 1 },
    { ...sender, url: "https://www.bilibili.com/video/BV0000000000" }
  ]) {
    assert(!isMusicSender(invalidSender), "wrong sender/id/origin/tab URL/negative tab/frame rejection");
  }
  for (const count of [0, 1, 14, 15]) assert(projectMusicFeed(payload(count)).items.length === count, `projection ${count}`);
  const duplicate = payload(2); duplicate.data.archives[1].bvid = duplicate.data.archives[0].bvid;
  assert(projectMusicFeed(duplicate).items.length === 1, "duplicate discard");
  const required = payload(2); required.data.archives[0].title = " "; required.data.archives[1].author.name = "";
  assert(projectMusicFeed(required).items.length === 0, "required discard");
  const guarded = makeArchive(1);
  guarded.cover = "http://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp";
  const upgraded = projectMusicFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  assert(upgraded.coverUrl === "https://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp", "http cover upgrade and path suffix");
  for (const cover of [
    "javascript:alert(1)", "ftp://i0.hdslb.com/bfs/a.webp", "https://evil.example/bfs/a.webp",
    "https://i0.hdslb.com/bfs/a.webp?q=1", "https://i0.hdslb.com/bfs/a.webp#x",
    "https://user@i0.hdslb.com/bfs/a.webp", "https://i0.hdslb.com:443/bfs/a.webp",
    `https://i0.hdslb.com/bfs/${"a".repeat(MAX_COVER_URL_LENGTH)}.webp`,
    `https://i0.hdslb.com/bfs/a.webp?${"q".repeat(MAX_COVER_URL_LENGTH)}`,
    "https://i0.hdslb.com/bfs/../a.webp", "https://i0.hdslb.com/bfs/a\u0000.webp", "/bfs/a.webp"
  ]) {
    guarded.cover = cover;
    assert(projectMusicFeed({ code: 0, data: { archives: [guarded] } }).items[0].coverUrl === null, "cover guard");
  }
  const result = createMusicResult(request, { ok: true, data: projectMusicFeed(payload(1)) });
  assert(Object.keys(result).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", "success result keys");
  assert(Object.keys(result.data.items[0]).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview", "eight fields");
  for (const kind of Object.values(MUSIC_ERROR_KINDS)) assert(Object.keys(createMusicResult(request, { ok: false, kind })).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", `typed failure ${kind}`);
  const oldRoot = registerMusicRoot(sender);
  const newSender = { ...sender, documentId: "music-new-root" };
  const newRoot = registerMusicRoot(newSender);
  assert(oldRoot && newRoot && registerMusicRoot(sender) === null && registerMusicRoot(newSender) === newRoot, "monotonic retired root");
  const currentRootBeforeOldCancel = musicCurrentRoots.get(musicRootKey(newSender));
  cancelMusic(cancel, sender);
  assert(
    musicCurrentRoots.get(musicRootKey(newSender)) === currentRootBeforeOldCancel
      && currentRootBeforeOldCancel.documentId === newSender.documentId,
    "retired old-root cancel rejection"
  );
  assert(MUSIC_FEED_URL === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1003&device=web&plat=30&web_location=333.40138", "fixed URL/query");
  assert(MUSIC_CACHE_KEY.includes("from_region=1003") && musicCache.key !== KNOWLEDGE_CACHE_KEY, "music state/cache isolation");
  recordMusicSelfTestCategory("01 exact envelope/sender negatives/root registry/old-root cancel rejection: PASS");
  recordMusicSelfTestCategory("02 fixed URL/query/options/no caller transport input: PASS");
  recordMusicSelfTestCategory("03 projection 0/1/14/15/duplicate/required/cover/derived href: PASS");
  recordMusicSelfTestCategory("04 typed failure shell/music state and knowledge/floor isolation: PASS");
  return true;
};

const runMusicTransportSelfTests = async () => {
  const assert = (condition, label) => { if (!condition) throw new Error(`Music transport self-test failed: ${label}`); };
  const sender = { id: chrome.runtime.id, tab: { id: 78, url: ROOT_URL }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN, documentId: "music-transport" };
  const base = { requestId: "music-transport", generation: 1, operation: MUSIC_OPERATION, params: {} };
  const encode = (value) => new TextEncoder().encode(JSON.stringify(value));
  const responseFor = (value, bytesOverride, overrides = {}) => {
    const bytes = bytesOverride || encode(value); let consumed = false;
    return { ok: true, status: 200, type: "basic", redirected: false, ...overrides, headers: { get: (name) => name === "content-type" ? "application/json" : null }, body: { getReader: () => ({ read: async () => consumed ? { done: true } : (consumed = true, { done: false, value: bytes }), cancel: async () => {} }) } };
  };
  const originalFetch = globalThis.fetch;
  const originalCache = { ...musicCache }; const originalLastGood = musicLastGood; const originalSlots = musicUpstreamSlots;
  const originalMaps = [musicInFlight, musicGeneration, musicAbortController, musicErrorShell, musicUiState, musicCurrentRoots].map((map) => [...map.entries()]);
  let calls = [];
  try {
    musicCache.data = null; musicCache.expiresAt = 0; musicLastGood = null; musicUpstreamSlots = 0;
    for (const map of [musicInFlight, musicGeneration, musicAbortController, musicErrorShell, musicUiState, musicCurrentRoots]) map.clear();
    globalThis.fetch = (url, options) => { calls.push({ url, options }); return Promise.resolve(responseFor(payloadForMusicSelfTest())); };
    const success = await fetchMusicFeed(base, sender);
    assert(success.ok && success.data.status === "success" && calls.length === 1, "transport success");
    assert(calls[0].url === MUSIC_FEED_URL && Object.keys(calls[0].options).sort().join("\u001F") === "credentials\u001Fmethod\u001Fredirect\u001Fsignal" && calls[0].options.method === "GET" && calls[0].options.credentials === "omit" && calls[0].options.redirect === "manual", "fixed RequestInit");
    assert(isMusicCacheFresh() && musicLastGood.items.length === 15 && musicUpstreamSlots === 0, "success cache/last-good/slot cleanup");
    const cached = await fetchMusicFeed({ ...base, requestId: "cached", generation: 2 }, sender); assert(cached.ok && calls.length === 1, "complete cache hit");
    musicCache.data = null; musicCache.expiresAt = 0;
    const blockedSender = { ...sender, tab: { id: 88, url: ROOT_URL }, documentId: "music-blocked" };
    const stateSizesBeforeAdmission = [
      musicInFlight.size,
      musicGeneration.size,
      musicAbortController.size,
      musicErrorShell.size,
      musicUiState.size,
      musicCurrentRoots.size
    ];
    let blockedFetches = 0;
    globalThis.fetch = () => { blockedFetches += 1; throw new Error("slot rejection must not fetch"); };
    musicUpstreamSlots = 1;
    const unavailable = await fetchMusicFeed({ ...base, requestId: "blocked", generation: 1 }, blockedSender);
    assert(
      !unavailable.ok
        && unavailable.kind === MUSIC_ERROR_KINDS.UNAVAILABLE
        && blockedFetches === 0
        && musicUpstreamSlots === 1
        && stateSizesBeforeAdmission.every((size, index) => size === [
          musicInFlight.size,
          musicGeneration.size,
          musicAbortController.size,
          musicErrorShell.size,
          musicUiState.size,
          musicCurrentRoots.size
        ][index]),
      "slot unavailable has no fetch or music state mutation"
    );
    musicUpstreamSlots = 0;
    globalThis.fetch = () => Promise.resolve(responseFor(null, new Uint8Array(MAX_MUSIC_RESPONSE_BYTES + 1)));
    const oversized = await fetchMusicFeed({ ...base, requestId: "oversized", generation: 3 }, sender); assert(!oversized.ok && oversized.kind === MUSIC_ERROR_KINDS.SCHEMA && musicUpstreamSlots === 0, "2 MiB overflow");
    globalThis.fetch = () => Promise.resolve(responseFor(null, null, { type: "opaqueredirect" }));
    const redirected = await fetchMusicFeed({ ...base, requestId: "redirected", generation: 4 }, sender); assert(!redirected.ok && redirected.kind === MUSIC_ERROR_KINDS.REDIRECTED, "redirect rejection");
    calls.length = 0;
    globalThis.fetch = () => { calls.push("no-retry"); return Promise.reject(new Error("synthetic unavailable")); };
    const noRetry = await fetchMusicFeed({ ...base, requestId: "no-retry", generation: 5 }, sender);
    assert(!noRetry.ok && noRetry.kind === MUSIC_ERROR_KINDS.UNAVAILABLE && calls.length === 1, "explicit no retry");
    const originalSetTimeout = globalThis.setTimeout; const originalClearTimeout = globalThis.clearTimeout;
    globalThis.setTimeout = (callback) => { callback(); return 1; }; globalThis.clearTimeout = () => {};
    globalThis.fetch = (_url, options) => new Promise((resolve, reject) => {
      const rejectAbort = () => { const error = new Error(); error.name = "AbortError"; reject(error); };
      if (options.signal.aborted) { rejectAbort(); return; }
      options.signal.addEventListener("abort", rejectAbort, { once: true });
    });
    const timeoutResult = await fetchMusicFeed({ ...base, requestId: "timeout", generation: 6 }, sender);
    globalThis.setTimeout = originalSetTimeout; globalThis.clearTimeout = originalClearTimeout;
    assert(!timeoutResult.ok && timeoutResult.kind === MUSIC_ERROR_KINDS.TIMEOUT, "timeout");
    const oldSender = { ...sender, tab: { id: 79, url: ROOT_URL }, documentId: "music-old" }; const currentSender = { ...oldSender, documentId: "music-current" };
    musicCache.data = null; musicCache.expiresAt = 0; musicLastGood = { status: "partial", items: [] };
    const pending = []; globalThis.fetch = (_url, options) => new Promise((resolve, reject) => { const record = { resolve, reject, aborted: false }; options.signal.addEventListener("abort", () => { record.aborted = true; const error = new Error(); error.name = "AbortError"; reject(error); }, { once: true }); pending.push(record); });
    const oldPromise = fetchMusicFeed({ ...base, requestId: "old", generation: 1 }, oldSender); const oldState = musicInFlight.get(musicRequestKey(oldSender));
    const currentPromise = fetchMusicFeed({ ...base, requestId: "current", generation: 1 }, currentSender);
    assert(oldState && oldState.invalidated && pending[0].aborted && pending.length === 2, "root replacement abort");
    const oldResult = await oldPromise; assert(!oldResult.ok && oldResult.kind === MUSIC_ERROR_KINDS.CANCELLED && musicLastGood.items.length === 0, "old late result no commit");
    pending[1].resolve(responseFor(payloadForMusicSelfTest())); const currentResult = await currentPromise;
    assert(currentResult.ok && musicUpstreamSlots === 0 && musicInFlight.size === 0, "current commit/cleanup");
    for (const generation of [0, 1, 99]) { const stale = await fetchMusicFeed({ ...base, requestId: `old-${generation}`, generation }, oldSender); assert(!stale.ok && stale.kind === MUSIC_ERROR_KINDS.CANCELLED, `retired old generation ${generation}`); }
    recordMusicSelfTestCategory("05 fixed options/timeout/redirect/2 MiB/cache/slot cleanup/slot admission/no retry: PASS");
    recordMusicSelfTestCategory("06 root replacement/retired old low-equal-high/commit fence: PASS");
    recordMusicSelfTestCategory("07 abort/last-good/in-flight/error/UI isolation: PASS");
    recordMusicSelfTestCategory("08 deterministic gate only; no Chrome runtime claim: PASS");
    return true;
  } finally {
    globalThis.fetch = originalFetch; musicCache.key = originalCache.key; musicCache.data = originalCache.data; musicCache.expiresAt = originalCache.expiresAt; musicLastGood = originalLastGood; musicUpstreamSlots = originalSlots;
    for (const [map, entries] of [musicInFlight, musicGeneration, musicAbortController, musicErrorShell, musicUiState, musicCurrentRoots].map((map, index) => [map, originalMaps[index]])) { map.clear(); for (const entry of entries) map.set(entry[0], entry[1]); }
  }
};

const payloadForMusicSelfTest = () => ({ code: 0, data: { archives: Array.from({ length: 15 }, (_, index) => ({ bvid: `BV${String(index).padStart(10, "0")}`, title: `音乐${index}`, author: { name: `作者${index}` }, cover: "https://i0.hdslb.com/bfs/archive/music.webp", stat: { view: index, danmaku: index }, duration: index })) } });

const pgcAnimeRequestKey = (sender) => (
  `${sender.id}:${String(sender.tab && sender.tab.id)}:${sender.frameId}:PGC_ANIME_COMPOSITE`
);

const createPgcAnimeResult = (message, result) => {
  if (result.ok) {
    return {
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: message.requestId,
      generation: message.generation,
      operation: "PGC_ANIME_COMPOSITE",
      ok: true,
      data: result.data
    };
  }
  return {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: "PGC_ANIME_COMPOSITE",
    ok: false,
    error: { kind: result.kind }
  };
};

const fetchPgcUpstream = async (url, controller, state) => {
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  try {
    if (url !== PGC_ANIME_TIMELINE_URL && url !== PGC_ANIME_RANK_URL) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }
    const response = await fetch(url, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });
    if (response.type === "opaqueredirect" || response.redirected === true) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.REDIRECTED);
    }
    if (!response.ok || response.status < 200 || response.status >= 300) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }
    return await readPgcJson(response);
  } catch (error) {
    if (error instanceof PgcDataError) {
      throw error;
    }
    if (timedOut) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.TIMEOUT);
    }
    if (state.cancelled || controller.signal.aborted || (error && error.name === "AbortError")) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.CANCELLED);
    }
    throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  } finally {
    clearTimeout(timeout);
  }
};

const cancelPgcAnime = (message, sender) => {
  const requestState = activePgcAnimeRequests.get(pgcAnimeRequestKey(sender));
  if (
    requestState
    && requestState.requestId === message.requestId
    && requestState.generation === message.generation
    && requestState.operation === message.operation
  ) {
    requestState.cancelled = true;
    requestState.controller.abort();
  }
};

const fetchPgcAnime = async (message, sender) => {
  const requestKey = pgcAnimeRequestKey(sender);
  const previous = activePgcAnimeRequests.get(requestKey);
  if (previous) {
    previous.cancelled = true;
    previous.controller.abort();
  }

  if (isPgcCacheFresh(pgcAnimeCache)) {
    pgcAnimeLastGood = pgcAnimeCache.data;
    return { ok: true, data: pgcAnimeLastGood };
  }

  const releaseSlots = reservePublicUpstreamSlots(2);
  if (!releaseSlots) {
    return { ok: false, kind: FOCUS_ERROR_KINDS.UNAVAILABLE };
  }

  const controller = new AbortController();
  const state = {
    controller,
    requestId: message.requestId,
    generation: message.generation,
    operation: message.operation,
    cancelled: false,
    failure: null
  };
  activePgcAnimeRequests.set(requestKey, state);
  const startChild = (url) => {
    const child = new AbortController();
    state.children = state.children || new Set();
    state.children.add(child);
    const abortChild = () => child.abort();
    controller.signal.addEventListener("abort", abortChild, { once: true });
    return fetchPgcUpstream(url, child, state).finally(() => {
      controller.signal.removeEventListener("abort", abortChild);
      state.children.delete(child);
    });
  };
  const failOnce = (error) => {
    const normalized = error instanceof PgcDataError
      ? error
      : new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    if (!state.failure) {
      state.failure = normalized;
      controller.abort();
      abortPgcChildren(state);
    }
    return state.failure;
  };

  try {
    const timelinePromise = startChild(PGC_ANIME_TIMELINE_URL).catch((error) => {
      throw failOnce(error);
    });
    const rankPromise = startChild(PGC_ANIME_RANK_URL).catch((error) => {
      throw failOnce(error);
    });
    const [timelinePayload, rankPayload] = await Promise.all([timelinePromise, rankPromise]);
    let data;
    try {
      data = projectPgcAnimeComposite(timelinePayload, rankPayload);
    } catch (error) {
      throw failOnce(error);
    }
    if (
      state.cancelled
      || controller.signal.aborted
      || activePgcAnimeRequests.get(requestKey) !== state
    ) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED };
    }
    pgcAnimeLastGood = data;
    pgcAnimeCache = { key: PGC_CACHE_KEY, data, expiresAt: Date.now() + PGC_CACHE_TTL_MS };
    return { ok: true, data };
  } catch (error) {
    const failure = state.failure || failOnce(error);
    if (state.cancelled && failure.kind !== FOCUS_ERROR_KINDS.TIMEOUT) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED };
    }
    return { ok: false, kind: failure.kind };
  } finally {
    abortPgcChildren(state);
    releaseSlots();
    if (activePgcAnimeRequests.get(requestKey) === state) {
      activePgcAnimeRequests.delete(requestKey);
    }
  }
};

const pgcGuochuangRequestKey = (sender) => (
  `${sender.id}:${String(sender.tab && sender.tab.id)}:${sender.frameId}:PGC_GUOCHUANG_COMPOSITE`
);

const createPgcGuochuangResult = (message, result) => {
  if (result.ok) {
    return {
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: message.requestId,
      generation: message.generation,
      operation: "PGC_GUOCHUANG_COMPOSITE",
      ok: true,
      data: result.data
    };
  }
  return {
    type: "HOMEPAGE_DATA_RESULT_V1",
    requestId: message.requestId,
    generation: message.generation,
    operation: "PGC_GUOCHUANG_COMPOSITE",
    ok: false,
    error: { kind: result.kind }
  };
};

const fetchPgcGuochuangUpstream = async (url, controller, state) => {
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  try {
    if (url !== PGC_GUOCHUANG_TIMELINE_URL && url !== PGC_GUOCHUANG_RANK_URL) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }
    const response = await fetch(url, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });
    if (response.type === "opaqueredirect" || response.redirected === true) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.REDIRECTED);
    }
    if (!response.ok || response.status < 200 || response.status >= 300) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }
    return await readPgcJson(response);
  } catch (error) {
    if (error instanceof PgcDataError) {
      throw error;
    }
    if (timedOut) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.TIMEOUT);
    }
    if (state.cancelled || controller.signal.aborted || (error && error.name === "AbortError")) {
      throw new PgcDataError(FOCUS_ERROR_KINDS.CANCELLED);
    }
    throw new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  } finally {
    clearTimeout(timeout);
  }
};

const abortPgcGuochuangChildren = (state) => {
  if (!state || !state.children) {
    return;
  }
  for (const child of state.children) {
    child.abort();
  }
};

const cancelPgcGuochuang = (message, sender) => {
  const requestState = activePgcGuochuangRequests.get(pgcGuochuangRequestKey(sender));
  if (
    requestState
    && requestState.requestId === message.requestId
    && requestState.generation === message.generation
    && requestState.operation === message.operation
  ) {
    requestState.cancelled = true;
    requestState.controller.abort();
  }
};

const fetchPgcGuochuang = async (message, sender) => {
  const requestKey = pgcGuochuangRequestKey(sender);
  const previous = activePgcGuochuangRequests.get(requestKey);
  if (previous) {
    previous.cancelled = true;
    previous.controller.abort();
  }

  if (isPgcGuochuangCacheFresh(pgcGuochuangCache)) {
    pgcGuochuangLastGood = pgcGuochuangCache.data;
    return { ok: true, data: pgcGuochuangLastGood };
  }

  const releaseSlots = reservePublicUpstreamSlots(2);
  if (!releaseSlots) {
    return { ok: false, kind: FOCUS_ERROR_KINDS.UNAVAILABLE };
  }

  const controller = new AbortController();
  const state = {
    controller,
    requestId: message.requestId,
    generation: message.generation,
    operation: message.operation,
    cancelled: false,
    failure: null,
    children: new Set()
  };
  activePgcGuochuangRequests.set(requestKey, state);
  const startChild = (url) => {
    const childController = new AbortController();
    let aborted = false;
    const child = {
      abort() {
        if (!aborted) {
          aborted = true;
          childController.abort();
        }
      }
    };
    state.children.add(child);
    const abortFromParent = () => child.abort();
    controller.signal.addEventListener("abort", abortFromParent, { once: true });
    return fetchPgcGuochuangUpstream(url, childController, state).finally(() => {
      controller.signal.removeEventListener("abort", abortFromParent);
      state.children.delete(child);
    });
  };
  const failOnce = (error) => {
    const normalized = error instanceof PgcDataError
      ? error
      : new PgcDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    if (!state.failure) {
      state.failure = normalized;
      controller.abort();
      abortPgcGuochuangChildren(state);
    }
    return state.failure;
  };

  try {
    const timelinePromise = startChild(PGC_GUOCHUANG_TIMELINE_URL).catch((error) => {
      throw failOnce(error);
    });
    const rankPromise = startChild(PGC_GUOCHUANG_RANK_URL).catch((error) => {
      throw failOnce(error);
    });
    const [timelinePayload, rankPayload] = await Promise.all([timelinePromise, rankPromise]);
    let data;
    try {
      data = projectPgcGuochuangComposite(timelinePayload, rankPayload);
    } catch (error) {
      throw failOnce(error);
    }
    if (
      state.cancelled
      || controller.signal.aborted
      || activePgcGuochuangRequests.get(requestKey) !== state
    ) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED };
    }
    pgcGuochuangLastGood = data;
    pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data, expiresAt: Date.now() + PGC_CACHE_TTL_MS };
    return { ok: true, data };
  } catch (error) {
    const failure = state.failure || failOnce(error);
    if (state.cancelled && failure.kind !== FOCUS_ERROR_KINDS.TIMEOUT) {
      return { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED };
    }
    return { ok: false, kind: failure.kind };
  } finally {
    abortPgcGuochuangChildren(state);
    releaseSlots();
    if (activePgcGuochuangRequests.get(requestKey) === state) {
      activePgcGuochuangRequests.delete(requestKey);
    }
  }
};

const runPgcAnimeDeterministicSelfTests = () => {
  const assert = (condition, label) => {
    if (!condition) {
      throw new Error(`PGC self-test failed: ${label}`);
    }
  };
  const timelineItem = {
    season_id: 101,
    episode_id: 202,
    title: "测试番剧",
    square_cover: "https://i0.hdslb.com/bfs/bangumi/test.webp",
    pub_index: "第1话",
    pub_time: "周一"
  };
  const timelinePayload = {
    code: 0,
    result: {
      latest: [timelineItem],
      timeline: Array.from({ length: 7 }, (_, index) => ({
        day_of_week: index + 1,
        is_today: index === 0 ? 1 : 0,
        episodes: []
      }))
    }
  };
  const rankPayload = {
    code: 0,
    result: {
      list: [{
        rank: 1,
        season_id: 101,
        title: "测试排行",
        url: "",
        new_ep: { index_show: "更新" },
        badge_info: { text: "热" }
      }]
    }
  };
  const valid = projectPgcAnimeComposite(timelinePayload, rankPayload);
  assert(valid.tabs.length === 8 && valid.rankItems.length === 1, "valid projection");
  const optionalFallback = projectPgcAnimeComposite(timelinePayload, {
    code: 0,
    result: { list: [{ ...rankPayload.result.list[0], new_ep: { index_show: 1 }, badge_info: { text: null } }] }
  });
  assert(optionalFallback.rankItems[0].updateText === "" && optionalFallback.rankItems[0].badgeText === "", "optional rank text fallback");
  assert(normalizePgcUrl("https://i0.hdslb.com/bfs/bangumi/a.webp?q=1", "cover") === null, "cover query rejection");
  assert(normalizePgcUrl("https://www.bilibili.com/bangumi/play/ss1#x", "rank") === null, "rank hash rejection");

  const expectSchema = (timeline, rank, label) => {
    let failed = false;
    try {
      projectPgcAnimeComposite(timeline, rank);
    } catch (error) {
      failed = error instanceof PgcDataError && error.kind === FOCUS_ERROR_KINDS.SCHEMA;
    }
    assert(failed, label);
  };
  const expectKind = (timeline, rank, kind, label) => {
    let actual = null;
    try {
      projectPgcAnimeComposite(timeline, rank);
    } catch (error) {
      actual = error && error.kind;
    }
    assert(actual === kind, label);
  };
  expectKind({ ...timelinePayload, code: 1 }, rankPayload, FOCUS_ERROR_KINDS.UNAVAILABLE, "nonzero timeline code mapping");
  expectKind(timelinePayload, { ...rankPayload, code: 1 }, FOCUS_ERROR_KINDS.UNAVAILABLE, "nonzero rank code mapping");
  expectSchema(timelinePayload, {
    code: 0,
    result: { list: [{ ...rankPayload.result.list[0] }, { ...rankPayload.result.list[0] }] }
  }, "duplicate rank");
  expectSchema({
    ...timelinePayload,
    result: {
      ...timelinePayload.result,
      timeline: timelinePayload.result.timeline.map((segment) => ({ ...segment, is_today: 1 }))
    }
  }, rankPayload, "multiple is_today");
  expectSchema({
    ...timelinePayload,
    result: { ...timelinePayload.result, timeline: [{ ...timelinePayload.result.timeline[0], episodes: {} }, ...timelinePayload.result.timeline.slice(1)] }
  }, rankPayload, "malformed timeline segment");
  expectSchema(timelinePayload, { code: 0, result: { list: [] } }, "zero rank output");

  const fullRelease = reservePublicUpstreamSlots(4);
  assert(fullRelease !== null && reservePublicUpstreamSlots(1) === null, "global four-slot rejection");
  fullRelease();
  const twoRelease = reservePublicUpstreamSlots(2);
  const secondRelease = reservePublicUpstreamSlots(2);
  assert(twoRelease !== null && secondRelease !== null, "two-slot admission");
  secondRelease();
  twoRelease();
  const remainingRelease = reservePublicUpstreamSlots(2);
  assert(remainingRelease !== null, "slot release");
  remainingRelease();
  const cancelRelease = reservePublicUpstreamSlots(2);
  const cancelController = new AbortController();
  cancelController.abort();
  cancelRelease();
  cancelRelease();
  const afterCancelRelease = reservePublicUpstreamSlots(4);
  assert(afterCancelRelease !== null, "cancel release");
  afterCancelRelease();
  const childA = new AbortController();
  const childB = new AbortController();
  abortPgcChildren({ children: new Set([childA, childB]) });
  assert(childA.signal.aborted && childB.signal.aborted, "sibling abort");

  const staleKey = "self-test";
  const firstState = {};
  const secondState = {};
  activePgcAnimeRequests.set(staleKey, secondState);
  assert(activePgcAnimeRequests.get(staleKey) !== firstState, "stale generation");
  activePgcAnimeRequests.delete(staleKey);
  assert(isPgcCacheFresh({ key: PGC_CACHE_KEY, data: valid, expiresAt: 15000 }, 14999), "cache hit");
  assert(!isPgcCacheFresh({ key: PGC_CACHE_KEY, data: valid, expiresAt: 15000 }, 15000), "cache expiry");

  const request = {
    type: "HOMEPAGE_DATA_REQUEST_V1",
    requestId: "self-test",
    generation: 0,
    operation: "PGC_ANIME_COMPOSITE",
    params: {}
  };
  assert(isExactPgcAnimeMessage(request), "exact request envelope");
  assert(!isExactPgcAnimeMessage({ ...request, extra: true }), "unknown request key rejection");
  assert(!isExactPgcAnimeMessage({ ...request, params: [] }), "non-plain params rejection");
  assert(!isExactPgcAnimeMessage({ ...request, operation: "FOCUS_CAROUSEL" }), "wrong operation rejection");
  assert(isExactPgcAnimeCancelMessage({
    type: "HOMEPAGE_DATA_CANCEL_V1",
    requestId: "self-test",
    generation: 0,
    operation: "PGC_ANIME_COMPOSITE"
  }), "exact cancel envelope");
  const successEnvelope = createPgcAnimeResult(request, { ok: true, data: valid });
  assert(
    Object.keys(successEnvelope).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype",
    "success envelope keys"
  );
  const failureEnvelope = createPgcAnimeResult(request, { ok: false, kind: FOCUS_ERROR_KINDS.SCHEMA });
  assert(
    Object.keys(failureEnvelope).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype",
    "failure envelope keys"
  );
  const validSender = { id: chrome.runtime.id, tab: { id: 7, url: ROOT_URL }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN };
  assert(isExactRootSender(validSender), "root sender");
  assert(isExactRootSender({ ...validSender, url: ROOT_INDEX_URL }), "index sender");
  assert(isExactRootSender({ ...validSender, origin: undefined }), "legacy root sender origin compatibility");
  assert(!isExactRootSender({ ...validSender, frameId: 1 }), "frame sender rejection");
  assert(!isExactRootSender({ ...validSender, url: `${ROOT_URL}?x=1` }), "query sender rejection");
  assert(!isExactRootSender({ ...validSender, url: `${ROOT_URL}#x` }), "hash sender rejection");
  assert(!isExactRootSender({ ...validSender, url: "https://www.bilibili.com/video" }), "path sender rejection");
  assert(isAuthoritativePgcSender(validSender), "authoritative PGC sender");
  assert(isAuthoritativePgcSender({ ...validSender, url: ROOT_INDEX_URL, tab: { id: 7, url: ROOT_INDEX_URL } }), "authoritative PGC index sender");
  assert(!isAuthoritativePgcSender({ ...validSender, url: ROOT_INDEX_URL }), "PGC sender and tab URL mismatch rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, origin: undefined }), "PGC undefined origin rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, origin: null }), "PGC null origin rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, origin: "https://example.com" }), "PGC other origin rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, tab: undefined }), "PGC missing tab rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, tab: {} }), "PGC missing tab id rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, tab: { id: -1 } }), "PGC negative tab id rejection");
  assert(!isAuthoritativePgcSender({ ...validSender, tab: { id: 1.5 } }), "PGC non-integer tab id rejection");
  return true;
};

const recordPgcGuochuangSelfTestCategory = (category) => {
  const current = Array.isArray(globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__)
    ? globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__
    : [];
  if (!current.includes(category)) {
    current.push(category);
  }
  globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__ = current;
};

const runPgcGuochuangDeterministicSelfTests = () => {
  const assert = (condition, label) => {
    if (!condition) {
      throw new Error(`PGC Guochuang self-test failed: ${label}`);
    }
  };
  const expectSchema = (nextTimeline, nextRank, label) => {
    let actual = null;
    try {
      projectPgcGuochuangComposite(nextTimeline, nextRank);
    } catch (error) {
      actual = error && error.kind;
    }
    assert(actual === FOCUS_ERROR_KINDS.SCHEMA, label);
  };
  const item = {
    season_id: 401,
    episode_id: 402,
    title: "测试国创",
    square_cover: "https://i0.hdslb.com/bfs/bangumi/test.webp",
    cover: "https://i1.hdslb.com/bfs/bangumi/fallback.webp",
    pub_index: "第1话",
    pub_time: "周一"
  };
  const timeline = {
    code: 0,
    result: {
      latest: [item],
      timeline: Array.from({ length: 7 }, (_, index) => ({
        day_of_week: index + 1,
        is_today: index === 2 ? 1 : 0,
        episodes: index === 0 ? [{ ...item, season_id: 403, episode_id: 404 }] : []
      }))
    }
  };
  const rankCandidate = {
    rank: 1,
    season_id: 401,
    title: "国创排行",
    url: "",
    desc: "",
    new_ep: { index_show: "更新" },
    badge_info: { text: "不得投影" }
  };
  const rank = {
    code: 0,
    data: {
      list: [
        { ...rankCandidate, rank: 3, season_id: 403 },
        rankCandidate,
        { ...rankCandidate, rank: 11, season_id: 402 }
      ]
    }
  };
  const valid = projectPgcGuochuangComposite(timeline, rank);
  const validSender = {
    id: chrome.runtime.id,
    tab: { id: 3 },
    frameId: 0,
    url: ROOT_URL,
    origin: ROOT_ORIGIN
  };
  const request = {
    type: "HOMEPAGE_DATA_REQUEST_V1",
    requestId: "g",
    generation: 0,
    operation: "PGC_GUOCHUANG_COMPOSITE",
    params: {}
  };
  const cancel = {
    type: "HOMEPAGE_DATA_CANCEL_V1",
    requestId: "g",
    generation: 0,
    operation: "PGC_GUOCHUANG_COMPOSITE"
  };
  const withTimeline = (resultChanges) => ({
    ...timeline,
    result: { ...timeline.result, ...resultChanges }
  });
  const withRank = (list) => ({ code: 0, data: { list } });

  assert(valid.tabs.length === 8 && valid.tabs[0].isToday === false && valid.tabs[3].isToday === true, "fixed tabs and is_today");
  assert(valid.tabs[1].items[0].coverUrl === item.square_cover, "square cover precedence");
  assert(valid.rankItems.length === 2 && valid.rankItems[0].rank === 1 && valid.rankItems[0].updateText === "更新", "data.list and desc fallback");
  assert(valid.rankItems[0].badgeText === "", "badge projection");

  const invalidMessages = [
    { ...request, extra: true },
    { ...request, type: 1 },
    { ...request, requestId: 1 },
    { ...request, requestId: "" },
    { ...request, requestId: "x".repeat(MAX_REQUEST_ID_LENGTH + 1) },
    { ...request, requestId: "x\u0000" },
    { ...request, generation: -1 },
    { ...request, generation: 1.5 },
    { ...request, generation: Number.MAX_SAFE_INTEGER + 1 },
    { ...request, operation: "UNKNOWN_OPERATION" },
    { ...request, params: { callerUrl: "ignored" } },
    { ...request, params: [] }
  ];
  const invalidCancels = [
    { ...cancel, extra: true },
    { ...cancel, type: 1 },
    { ...cancel, requestId: 1 },
    { ...cancel, requestId: "" },
    { ...cancel, requestId: "x".repeat(MAX_REQUEST_ID_LENGTH + 1) },
    { ...cancel, requestId: "x\u0001" },
    { ...cancel, generation: -1 },
    { ...cancel, generation: 1.5 },
    { ...cancel, operation: "UNKNOWN_OPERATION" }
  ];
  let fetchCount = 0;
  let abortCount = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    fetchCount += 1;
    throw new Error("unexpected preflight fetch");
  };
  const cancelKey = pgcGuochuangRequestKey(validSender);
  activePgcGuochuangRequests.set(cancelKey, {
    controller: { abort: () => { abortCount += 1; } },
    requestId: cancel.requestId,
    generation: cancel.generation,
    operation: cancel.operation
  });
  for (const message of invalidMessages) {
    handleRuntimeMessage(message, validSender, () => {});
  }
  for (const message of invalidCancels) {
    handleRuntimeMessage(message, validSender, () => {});
  }
  const invalidSenders = [
    { ...validSender, id: "other-extension" },
    { ...validSender, tab: null },
    { ...validSender, tab: {} },
    { ...validSender, tab: { id: -1 } },
    { ...validSender, tab: { id: 1.5 } },
    { ...validSender, tab: { id: "3" } },
    { ...validSender, frameId: 1 },
    { ...validSender, url: `${ROOT_URL}?q=1` },
    { ...validSender, url: `${ROOT_URL}#hash` },
    { ...validSender, url: "https://www.bilibili.com/other" },
    { ...validSender, origin: undefined },
    { ...validSender, origin: "https://evil.example" },
    { ...validSender, url: 1 }
  ];
  for (const sender of invalidSenders) {
    handleRuntimeMessage(request, sender, () => {});
    handleRuntimeMessage(cancel, sender, () => {});
  }
  const ownProtoMessage = Object.assign(Object.create(null), request);
  const ownProtoRequest = { ...request };
  Object.defineProperty(ownProtoRequest, "__proto__", { value: {}, enumerable: true });
  handleRuntimeMessage(ownProtoMessage, validSender, () => {});
  handleRuntimeMessage(ownProtoRequest, validSender, () => {});
  assert(fetchCount === 0 && abortCount === 0, "01 exact message and sender preflight fetch=0 abort=0");
  activePgcGuochuangRequests.delete(cancelKey);
  globalThis.fetch = originalFetch;
  recordPgcGuochuangSelfTestCategory("01 exact-message/sender preflight: PASS");

  assert(PGC_GUOCHUANG_TIMELINE_URL === "https://api.bilibili.com/pgc/web/timeline/v2?season_type=4&day_before=4&day_after=2", "season four timeline URL");
  assert(PGC_GUOCHUANG_RANK_URL === "https://api.bilibili.com/pgc/season/rank/web/list?season_type=4&day=3", "season four rank URL");
  assert(!PGC_GUOCHUANG_TIMELINE_URL.includes("season_type=1") && !PGC_GUOCHUANG_RANK_URL.includes("season_type=1"), "anime URL isolation");
  assert(!PGC_GUOCHUANG_TIMELINE_URL.includes("8767") && !PGC_GUOCHUANG_RANK_URL.includes("localhost"), "public proxy isolation");
  recordPgcGuochuangSelfTestCategory("03 season/path isolation: PASS");

  const allTwenty = Array.from({ length: 20 }, (_, index) => ({ ...item, season_id: 500 + index, episode_id: 600 + index }));
  const maxTimeline = withTimeline({
    latest: allTwenty,
    timeline: timeline.result.timeline.map((segment) => ({ ...segment, episodes: allTwenty }))
  });
  const maxValid = projectPgcGuochuangComposite(maxTimeline, rank);
  assert(maxValid.tabs.every((tab) => tab.items.length === 20), "timeline per-tab and total caps boundary");
  const timelineFailures = [
    withTimeline({ latest: undefined }),
    withTimeline({ timeline: undefined }),
    withTimeline({ timeline: timeline.result.timeline.slice(0, 6) }),
    withTimeline({ timeline: [{ ...timeline.result.timeline[0] }, { ...timeline.result.timeline[0] }, ...timeline.result.timeline.slice(2)] }),
    withTimeline({ timeline: timeline.result.timeline.map((entry, index) => index === 0 ? { ...entry, day_of_week: 8 } : entry) }),
    withTimeline({ timeline: timeline.result.timeline.map((entry, index) => index === 0 ? { ...entry, day_of_week: 1.5 } : entry) }),
    withTimeline({ timeline: timeline.result.timeline.map((entry, index) => index === 0 ? { ...entry, episodes: {} } : entry) }),
    withTimeline({ latest: allTwenty.concat({ ...item, season_id: 999 }) }),
    withTimeline({ latest: [{ ...item, title: "" }] }),
    withTimeline({ timeline: timeline.result.timeline.map((entry, index) => index === 0 ? { ...entry, episodes: [{ ...item, square_cover: "https://evil.example/bad", cover: "https://evil.example/bad" }] } : entry) })
  ];
  for (const [index, badTimeline] of timelineFailures.entries()) {
    expectSchema(badTimeline, rank, `timeline failure ${index}`);
  }
  recordPgcGuochuangSelfTestCategory("04 timeline roots/segments/items/caps: PASS");

  const todayValues = [true, "1", 2, -1, 2.5, null, NaN];
  for (const value of todayValues) {
    expectSchema(withTimeline({ timeline: timeline.result.timeline.map((entry, index) => index === 0 ? { ...entry, is_today: value } : entry) }), rank, "invalid is_today");
  }
  const missingToday = withTimeline({ timeline: timeline.result.timeline.map((entry, index) => {
    if (index !== 0) return entry;
    const { is_today: omitted, ...rest } = entry;
    return rest;
  }) });
  expectSchema(missingToday, rank, "missing is_today");
  expectSchema(withTimeline({ timeline: timeline.result.timeline.map((entry) => ({ ...entry, is_today: 1 })) }), rank, "multiple is_today");
  const zeroToday = projectPgcGuochuangComposite(withTimeline({ timeline: timeline.result.timeline.map((entry) => ({ ...entry, is_today: 0 })) }), rank);
  assert(zeroToday.tabs.every((tab) => tab.isToday === false), "zero true weekdays and latest false");
  recordPgcGuochuangSelfTestCategory("05 is_today strict boolean boundary: PASS");

  const fallbackCoverItem = { ...item };
  delete fallbackCoverItem.square_cover;
  assert(projectPgcGuochuangComposite(withTimeline({ latest: [fallbackCoverItem] }), rank).tabs[0].items[0].coverUrl === item.cover, "safe cover fallback");
  expectSchema(withTimeline({ latest: [{ ...item, square_cover: "https://evil.example/bad" }] }), rank, "invalid preferred square cover does not fallback");
  const coverGuards = [
    "https://evil.example/bfs/bangumi/a.webp",
    "https://i0.hdslb.com/other/a.webp",
    "https://user@i0.hdslb.com/bfs/bangumi/a.webp",
    "https://i0.hdslb.com:443/bfs/bangumi/a.webp",
    "https://i0.hdslb.com/bfs/bangumi/../a.webp",
    "https://i0.hdslb.com/bfs/bangumi/a.webp?q=1",
    "https://i0.hdslb.com/bfs/bangumi/a.webp#x",
    "/bfs/bangumi/a.webp"
  ];
  for (const cover of coverGuards) {
    expectSchema(withTimeline({ latest: [{ ...item, square_cover: cover }] }), rank, "cover URL guard");
  }
  assert(projectPgcGuochuangComposite(withTimeline({ latest: [{ ...item, square_cover: "http://i0.hdslb.com/bfs/bangumi/a.webp" }] }), rank).tabs[0].items[0].coverUrl === "https://i0.hdslb.com/bfs/bangumi/a.webp", "trusted HTTP cover upgraded to HTTPS");
  recordPgcGuochuangSelfTestCategory("06 cover precedence/fallback/URL guard: PASS");

  assert(projectPgcGuochuangComposite(timeline, withRank([{ ...rankCandidate, desc: "明确描述", new_ep: { index_show: "备用" } }])).rankItems[0].updateText === "明确描述", "non-empty desc wins");
  assert(projectPgcGuochuangComposite(timeline, withRank([{ ...rankCandidate, desc: "", new_ep: { index_show: "备用" } }])).rankItems[0].updateText === "备用", "empty desc fallback");
  const missingDescCandidate = { ...rankCandidate, new_ep: { index_show: "缺省描述" } };
  delete missingDescCandidate.desc;
  assert(projectPgcGuochuangComposite(timeline, withRank([missingDescCandidate])).rankItems[0].updateText === "缺省描述", "missing desc fallback");
  expectSchema(timeline, { code: 0, result: { list: [rankCandidate] } }, "result.list rejected");
  expectSchema(timeline, { code: 0, data: {} }, "missing rank list");
  expectSchema(timeline, { code: 0 }, "missing rank data");
  expectSchema(timeline, withRank([{ ...rankCandidate, desc: 1 }]), "non-string desc rejected");
  expectSchema(timeline, withRank([{ ...rankCandidate, desc: "", new_ep: { index_show: 1 } }]), "non-string fallback rejected");
  assert(projectPgcGuochuangComposite(timeline, withRank([rankCandidate])).rankItems[0].badgeText === "", "empty badge");
  recordPgcGuochuangSelfTestCategory("07 rank root/desc fallback/badge: PASS");

  const orderedRanks = projectPgcGuochuangComposite(timeline, withRank([
    { ...rankCandidate, rank: 3 },
    { ...rankCandidate, rank: 1 },
    { ...rankCandidate, rank: 11 }
  ])).rankItems;
  assert(orderedRanks.length >= 2 && orderedRanks.length <= 10 && orderedRanks[0].rank === 1 && orderedRanks[1].rank === 2, "rank >10 filtering, continuous order, and timeline fill");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 1 }, { ...rankCandidate, rank: 1 }]), "duplicate retained rank");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 11 }, { ...rankCandidate, rank: 11 }]), "duplicate filtered rank checked before filter");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 11, url: "https://evil.example/bad" }]), "unsafe filtered rank URL");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 1, url: "https://www.bilibili.com/bangumi/play/ss1?q=1" }]), "unsafe rank URL");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 1, url: "https://www.bilibili.com/bangumi/play/ss1#x" }]), "rank hash guard");
  expectSchema(timeline, withRank(Array.from({ length: MAX_PGC_GUOCHUANG_RANK_CANDIDATES + 1 }, (_, index) => ({ ...rankCandidate, rank: index + 1 }))), "raw rank candidate cap");
  expectSchema(timeline, withRank([{ ...rankCandidate, rank: 11 }]), "zero output after rank filtering");
  recordPgcGuochuangSelfTestCategory("08 rank duplicates/unsafe URLs/filtering/order: PASS");

  const success = createPgcGuochuangResult({ requestId: "g", generation: 0 }, { ok: true, data: valid });
  const failure = createPgcGuochuangResult({ requestId: "g", generation: 0 }, { ok: false, kind: FOCUS_ERROR_KINDS.CANCELLED });
  assert(Object.keys(success).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", "success exact result keys");
  assert(Object.keys(failure).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", "failure exact result keys");
  assert(Object.keys(failure.error).length === 1 && !JSON.stringify(failure).match(/status|headers|body|message|stack|raw|diagnostic/i), "result boundary no transport detail");
  recordPgcGuochuangSelfTestCategory("13 exact result boundary/no raw transport detail: PASS");

  assert(isExactPgcGuochuangMessage(request) && isExactPgcGuochuangCancelMessage(cancel), "exact request and cancel");
  assert(!isExactPgcGuochuangMessage({ ...request, params: { nested: {} } }), "non-empty params rejected");
  assert(!isExactPgcGuochuangCancelMessage({ ...cancel, operation: "PGC_ANIME_COMPOSITE" }), "wrong cancel operation rejected");
  recordPgcGuochuangSelfTestCategory("02 fixed transport envelope preconditions: PASS");

  publicUpstreamSlots = 0;
  const fullRelease = reservePublicUpstreamSlots(4);
  assert(fullRelease && reservePublicUpstreamSlots(2) === null, "four slot capacity");
  fullRelease();
  const twoRelease = reservePublicUpstreamSlots(2);
  assert(twoRelease && reservePublicUpstreamSlots(3) === null, "atomic two-slot reservation");
  twoRelease();
  const idempotent = reservePublicUpstreamSlots(2);
  idempotent();
  idempotent();
  assert(reservePublicUpstreamSlots(4) !== null, "idempotent release");
  publicUpstreamSlots = 0;
  const childA = new AbortController();
  const childB = new AbortController();
  abortPgcGuochuangChildren({ children: new Set([{ abort: () => childA.abort() }, { abort: () => childB.abort() }]) });
  assert(childA.signal.aborted && childB.signal.aborted, "sibling abort");
  recordPgcGuochuangSelfTestCategory("10 atomic governor/two-slot/sibling abort/release: PASS");

  const animeKey = `${validSender.id}:${validSender.tab.id}:0:PGC_ANIME_COMPOSITE`;
  activePgcAnimeRequests.set(animeKey, {});
  activePgcGuochuangRequests.set(cancelKey, {});
  assert(activePgcAnimeRequests.has(animeKey) && activePgcGuochuangRequests.has(cancelKey) && animeKey !== cancelKey, "in-flight operation isolation");
  activePgcAnimeRequests.delete(animeKey);
  activePgcGuochuangRequests.delete(cancelKey);
  assert(isPgcGuochuangCacheFresh({ key: PGC_GUOCHUANG_CACHE_KEY, data: valid, expiresAt: 2 }, 1), "guochuang cache key");
  assert(!isPgcGuochuangCacheFresh({ key: PGC_CACHE_KEY, data: valid, expiresAt: 2 }, 1), "anime cache isolation");
  assert(PGC_GUOCHUANG_CACHE_KEY.includes("season_type=4") && !PGC_GUOCHUANG_CACHE_KEY.includes("season_type=1"), "guochuang season cache isolation");
  recordPgcGuochuangSelfTestCategory("12 cache/inflight/generation/last-good season isolation: PASS");
  recordPgcGuochuangSelfTestCategory("09 atomic projection precondition: PASS");
  recordPgcGuochuangSelfTestCategory("14 renderer validator delegated to content/renderer: PASS");
  return true;
};

const runPgcGuochuangTransportSelfTests = async () => {
  const assert = (condition, label) => {
    if (!condition) {
      throw new Error(`PGC Guochuang transport self-test failed: ${label}`);
    }
  };
  const sender = { id: chrome.runtime.id, tab: { id: 9 }, frameId: 0, url: ROOT_URL, origin: ROOT_ORIGIN };
  const message = {
    requestId: "transport-self-test",
    generation: 1,
    operation: "PGC_GUOCHUANG_COMPOSITE"
  };
  const encode = (value) => new TextEncoder().encode(JSON.stringify(value));
  const responseFor = (value, chunkOverride, responseOverrides = {}) => {
    const bytes = chunkOverride || encode(value);
    let consumed = false;
    return {
      ok: true,
      status: 200,
      type: "basic",
      redirected: false,
      ...responseOverrides,
      headers: { get: (name) => name === "content-type" ? "application/json" : null },
      body: {
        getReader: () => ({
          read: async () => {
            if (consumed) return { done: true };
            consumed = true;
            return { done: false, value: bytes };
          },
          cancel: async () => {}
        })
      }
    };
  };
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalSlots = publicUpstreamSlots;
  const originalActiveEntries = [...activePgcGuochuangRequests.entries()];
  const originalActiveStates = new Set(originalActiveEntries.map(([, requestState]) => requestState));
  const originalCache = pgcGuochuangCache;
  const originalLastGood = pgcGuochuangLastGood;
  let matchingCancelPromise;
  let oldGenerationPromise;
  let newGenerationPromise;
  const awaitSettledWithin = async (promise, label) => {
    let timeoutId;
    const timeout = new Promise((resolve) => {
      timeoutId = setTimeout(() => resolve({ timedOut: true }), 100);
    });
    const settled = await Promise.race([
      promise.then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      ),
      timeout
    ]);
    clearTimeout(timeoutId);
    assert(!settled.timedOut, `${label} settled within bounded timeout`);
    return settled;
  };
  const pendingFetchMock = (records) => (url, options) => {
    const record = { url, options, aborted: false, settled: false, abortCount: 0 };
    records.push(record);
    return new Promise((resolve, reject) => {
      const settle = (callback, value) => {
        if (record.settled) return;
        record.settled = true;
        options.signal.removeEventListener("abort", abort);
        callback(value);
      };
      const abort = () => {
        record.aborted = true;
        record.abortCount += 1;
        const error = new Error("synthetic pending abort");
        error.name = "AbortError";
        settle(reject, error);
      };
      record.resolve = (value) => settle(resolve, value);
      record.reject = (error) => settle(reject, error);
      if (options.signal.aborted) {
        abort();
      } else {
        options.signal.addEventListener("abort", abort, { once: true });
      }
    });
  };
  const calls = [];
  const timelinePayload = {
    code: 0,
    result: { latest: [], timeline: Array.from({ length: 7 }, (_, index) => ({ day_of_week: index + 1, is_today: 0, episodes: [] })) }
  };
  const rankPayload = {
    code: 0,
    data: { list: [{ rank: 1, season_id: 9, title: "排行", url: "", desc: "", new_ep: { index_show: "更新" } }] }
  };
  try {
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    assert(
      Object.keys(options).sort().join("\u001F") === "credentials\u001Fmethod\u001Fredirect\u001Fsignal"
        && options.method === "GET"
        && options.credentials === "omit"
        && options.redirect === "manual"
        && options.signal instanceof AbortSignal,
      "fixed request init"
    );
    if (url === PGC_GUOCHUANG_TIMELINE_URL) return responseFor(timelinePayload);
    if (url === PGC_GUOCHUANG_RANK_URL) return responseFor(rankPayload);
    throw new Error("unexpected guochuang URL");
  };
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  pgcGuochuangLastGood = null;
  publicUpstreamSlots = 0;
  const success = await fetchPgcGuochuang({
    ...message,
    params: { callerUrl: "ignored", headers: { ignored: true }, body: "ignored", method: "POST" }
  }, sender);
  assert(success.ok === true && success.data.tabs.length === 8, "fixed transport success");
  assert(calls.length === 2 && calls.some((call) => call.url === PGC_GUOCHUANG_TIMELINE_URL) && calls.some((call) => call.url === PGC_GUOCHUANG_RANK_URL), "two fixed URLs");
  recordPgcGuochuangSelfTestCategory("02 fixed URLs/RequestInit/caller transport isolation: PASS");

  const timelineJson = JSON.stringify(timelinePayload);
  const exactText = timelineJson + " ".repeat(MAX_PGC_RESPONSE_BYTES - new TextEncoder().encode(timelineJson).byteLength);
  const exactBoundary = new TextEncoder().encode(exactText);
  assert(exactBoundary.byteLength === MAX_PGC_RESPONSE_BYTES, "2 MiB boundary fixture");
  calls.length = 0;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url === PGC_GUOCHUANG_TIMELINE_URL
      ? responseFor(null, exactBoundary)
      : responseFor(rankPayload);
  };
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  publicUpstreamSlots = 0;
  const boundarySuccess = await fetchPgcGuochuang({ ...message, generation: 2 }, sender);
  assert(boundarySuccess.ok === true && calls.length === 2, `2 MiB exact boundary accepted (${boundarySuccess.kind || "unknown"})`);
  const oversized = new Uint8Array(MAX_PGC_RESPONSE_BYTES + 1);
  calls.length = 0;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url === PGC_GUOCHUANG_TIMELINE_URL
      ? responseFor(null, oversized)
      : responseFor(rankPayload);
  };
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  const boundedFailure = await fetchPgcGuochuang({ ...message, generation: 3 }, sender);
  assert(boundedFailure.ok === false && boundedFailure.kind === FOCUS_ERROR_KINDS.SCHEMA, "2 MiB streamed cap");
  assert(calls.length === 2 && pgcGuochuangCache.data === null, "bounded failure atomicity");
  recordPgcGuochuangSelfTestCategory("02 streamed 2 MiB boundary/overflow: PASS");

  const sentinel = { tabs: [], rankItems: [{ rank: 1 }] };
  pgcGuochuangLastGood = sentinel;
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: sentinel, expiresAt: 0 };
  globalThis.fetch = async (url) => url === PGC_GUOCHUANG_TIMELINE_URL
    ? responseFor(timelinePayload)
    : responseFor({ code: 0, data: { list: [] } });
  const atomicFailure = await fetchPgcGuochuang({ ...message, generation: 4 }, sender);
  assert(atomicFailure.ok === false && atomicFailure.kind === FOCUS_ERROR_KINDS.SCHEMA, "timeline success rank failure typed kind");
  assert(pgcGuochuangLastGood === sentinel && pgcGuochuangCache.data === sentinel, "no partial cache or last-good commit");
  recordPgcGuochuangSelfTestCategory("09 timeline success/rank failure atomic no partial commit: PASS");

  publicUpstreamSlots = 3;
  let rejectedFetches = 0;
  globalThis.fetch = async () => {
    rejectedFetches += 1;
    throw new Error("capacity test must not fetch");
  };
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  const capacityFailure = await fetchPgcGuochuang({ ...message, generation: 5 }, sender);
  assert(capacityFailure.ok === false && capacityFailure.kind === FOCUS_ERROR_KINDS.UNAVAILABLE && rejectedFetches === 0, "atomic two-slot capacity rejection");
  publicUpstreamSlots = 0;

  let siblingAborts = 0;
  globalThis.fetch = (url, options) => {
    if (url === PGC_GUOCHUANG_TIMELINE_URL) {
      return Promise.reject(new Error("synthetic sibling failure"));
    }
    return new Promise((resolve, reject) => {
      if (options.signal.aborted) {
        const error = new Error("synthetic abort");
        error.name = "AbortError";
        reject(error);
        return;
      }
      options.signal.addEventListener("abort", () => {
        siblingAborts += 1;
        const error = new Error("synthetic abort");
        error.name = "AbortError";
        reject(error);
      }, { once: true });
    });
  };
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  const siblingFailure = await fetchPgcGuochuang({ ...message, generation: 6 }, sender);
  assert(siblingFailure.ok === false && siblingFailure.kind === FOCUS_ERROR_KINDS.UNAVAILABLE && siblingAborts === 1, "sibling abort on first failure");
  const released = reservePublicUpstreamSlots(4);
  assert(released !== null, "failure releases both slots");
  released();
  recordPgcGuochuangSelfTestCategory("10 capacity rejection/sibling abort/release exactly once: PASS");

  const timeoutController = new AbortController();
  globalThis.setTimeout = (callback) => {
    callback();
    return 1;
  };
  globalThis.clearTimeout = () => {};
  globalThis.fetch = (_url, options) => new Promise((resolve, reject) => {
    if (options.signal.aborted) {
      const error = new Error("synthetic timeout");
      error.name = "AbortError";
      reject(error);
      return;
    }
    options.signal.addEventListener("abort", () => {
      const error = new Error("synthetic timeout");
      error.name = "AbortError";
      reject(error);
    }, { once: true });
  });
  let timeoutFailure = null;
  try {
    await fetchPgcGuochuangUpstream(PGC_GUOCHUANG_TIMELINE_URL, timeoutController, { cancelled: false });
  } catch (error) {
    timeoutFailure = error && error.kind;
  }
  globalThis.setTimeout = originalSetTimeout;
  globalThis.clearTimeout = originalClearTimeout;
  assert(timeoutFailure === FOCUS_ERROR_KINDS.TIMEOUT, "timeout typed kind");

  globalThis.fetch = async () => responseFor(null, null, { type: "opaqueredirect" });
  let redirectFailure = null;
  try {
    await fetchPgcGuochuangUpstream(PGC_GUOCHUANG_TIMELINE_URL, new AbortController(), { cancelled: false });
  } catch (error) {
    redirectFailure = error && error.kind;
  }
  assert(redirectFailure === FOCUS_ERROR_KINDS.REDIRECTED, "redirect typed kind");

  globalThis.fetch = async (url) => url === PGC_GUOCHUANG_TIMELINE_URL
    ? responseFor(timelinePayload)
    : responseFor(rankPayload);
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: null, expiresAt: 0 };
  const stalePromise = fetchPgcGuochuang({ ...message, generation: 10 }, sender);
  activePgcGuochuangRequests.delete(pgcGuochuangRequestKey(sender));
  const staleResult = await stalePromise;
  assert(staleResult.ok === false && staleResult.kind === FOCUS_ERROR_KINDS.CANCELLED && pgcGuochuangCache.data === null, "stale result typed kind and no stale commit");
  const directCancelController = new AbortController();
  activePgcGuochuangRequests.set(pgcGuochuangRequestKey(sender), {
    controller: directCancelController,
    requestId: message.requestId,
    generation: 11,
    operation: message.operation
  });
  cancelPgcGuochuang({ requestId: message.requestId, generation: 11, operation: message.operation }, sender);
  assert(directCancelController.signal.aborted, "matching cancel controller abort");
  activePgcGuochuangRequests.delete(pgcGuochuangRequestKey(sender));
  recordPgcGuochuangSelfTestCategory("11 lifecycle timeout/redirect/stale/matching-cancel typed PASS");

  const cancelRecords = [];
  const cancelSentinel = { tabs: [], rankItems: [{ rank: 91 }] };
  globalThis.fetch = pendingFetchMock(cancelRecords);
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: cancelSentinel, expiresAt: 0 };
  pgcGuochuangLastGood = cancelSentinel;
  publicUpstreamSlots = 0;
  matchingCancelPromise = fetchPgcGuochuang({ ...message, generation: 20 }, sender);
  const matchingCancelState = activePgcGuochuangRequests.get(pgcGuochuangRequestKey(sender));
  assert(
    matchingCancelState && matchingCancelState.children.size === 2 && cancelRecords.length === 2,
    "matching cancel starts two pending children"
  );
  cancelPgcGuochuang({ ...message, generation: 20 }, sender);
  assert(
    matchingCancelState.controller.signal.aborted
      && cancelRecords.every((record) => record.aborted && record.abortCount === 1),
    "matching cancel aborts parent and both children"
  );
  const matchingCancelSettled = await awaitSettledWithin(matchingCancelPromise, "matching cancel");
  assert(
    matchingCancelSettled.status === "fulfilled"
      && matchingCancelSettled.value.ok === false
      && matchingCancelSettled.value.kind === FOCUS_ERROR_KINDS.CANCELLED,
    "matching cancel resolves typed CANCELLED"
  );
  assert(
    publicUpstreamSlots === 0
      && !activePgcGuochuangRequests.has(pgcGuochuangRequestKey(sender))
      && cancelRecords.every((record) => record.settled)
      && pgcGuochuangCache.data === cancelSentinel
      && pgcGuochuangLastGood === cancelSentinel,
    "matching cancel releases slots and does not commit cache or last-good"
  );

  const generationRecords = [];
  globalThis.fetch = pendingFetchMock(generationRecords);
  pgcGuochuangCache = { key: PGC_GUOCHUANG_CACHE_KEY, data: cancelSentinel, expiresAt: 0 };
  pgcGuochuangLastGood = cancelSentinel;
  publicUpstreamSlots = 0;
  oldGenerationPromise = fetchPgcGuochuang({ ...message, generation: 21 }, sender);
  const oldGenerationState = activePgcGuochuangRequests.get(pgcGuochuangRequestKey(sender));
  const oldGenerationController = oldGenerationState.controller;
  assert(generationRecords.length === 2 && publicUpstreamSlots === 2, "old generation starts pending with two slots");
  newGenerationPromise = fetchPgcGuochuang({ ...message, generation: 22 }, sender);
  const newGenerationState = activePgcGuochuangRequests.get(pgcGuochuangRequestKey(sender));
  assert(
    newGenerationState
      && newGenerationState !== oldGenerationState
      && newGenerationState.generation === 22
      && generationRecords.length === 4,
    "new generation replaces pending request in the same scope"
  );
  assert(
    oldGenerationController.signal.aborted
      && generationRecords.slice(0, 2).every((record) => record.aborted && record.abortCount === 1),
    "new generation aborts old controller and both old children"
  );
  const oldGenerationSettled = await awaitSettledWithin(oldGenerationPromise, "old generation");
  assert(
    oldGenerationSettled.status === "fulfilled"
      && oldGenerationSettled.value.ok === false
      && oldGenerationSettled.value.kind === FOCUS_ERROR_KINDS.CANCELLED,
    "old generation resolves typed CANCELLED"
  );
  assert(
    publicUpstreamSlots === 2
      && activePgcGuochuangRequests.get(pgcGuochuangRequestKey(sender)) === newGenerationState,
    "only new generation retains upstream slots after old cleanup"
  );
  generationRecords[2].resolve(responseFor(timelinePayload));
  generationRecords[3].resolve(responseFor(rankPayload));
  const newGenerationSettled = await awaitSettledWithin(newGenerationPromise, "new generation");
  assert(
    newGenerationSettled.status === "fulfilled"
      && newGenerationSettled.value.ok === true
      && generationRecords.slice(2).every((record) => record.settled && !record.aborted),
    "new generation settles successfully"
  );
  assert(
    publicUpstreamSlots === 0
      && !activePgcGuochuangRequests.has(pgcGuochuangRequestKey(sender))
      && pgcGuochuangCache.data === newGenerationSettled.value.data
      && pgcGuochuangLastGood === newGenerationSettled.value.data
      && pgcGuochuangCache.data !== cancelSentinel,
    "new generation commits only its own result with no stale commit"
  );
  recordPgcGuochuangSelfTestCategory("15 async cancel/new-generation pending mock: PASS");

  return true;
  } finally {
    for (const requestState of activePgcGuochuangRequests.values()) {
      if (requestState && !originalActiveStates.has(requestState)) {
        requestState.cancelled = true;
        if (requestState.controller) {
          requestState.controller.abort();
        }
        abortPgcGuochuangChildren(requestState);
      }
    }
    await Promise.allSettled([matchingCancelPromise, oldGenerationPromise, newGenerationPromise].filter(Boolean));
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    publicUpstreamSlots = originalSlots;
    activePgcGuochuangRequests.clear();
    for (const [requestKey, requestState] of originalActiveEntries) {
      activePgcGuochuangRequests.set(requestKey, requestState);
    }
    pgcGuochuangCache = originalCache;
    pgcGuochuangLastGood = originalLastGood;
  }
};

const recordKnowledgeSelfTestCategory = (category) => {
  const categories = Array.isArray(globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__)
    ? globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__
    : [];
  categories.push(category);
  globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__ = categories;
};

const runKnowledgeDeterministicSelfTests = () => {
  const assert = (condition, label) => {
    if (!condition) {
      throw new Error(`Knowledge self-test failed: ${label}`);
    }
  };
  const sender = {
    id: chrome.runtime.id,
    tab: { id: 7, url: ROOT_URL },
    frameId: 0,
    url: ROOT_URL,
    origin: ROOT_ORIGIN,
    documentId: "knowledge-self-test-document"
  };
  const request = {
    type: "HOMEPAGE_DATA_REQUEST_V1",
    requestId: "knowledge-self-test",
    generation: 0,
    operation: KNOWLEDGE_OPERATION,
    params: {}
  };
  const cancel = {
    type: "HOMEPAGE_DATA_CANCEL_V1",
    requestId: request.requestId,
    generation: request.generation,
    operation: KNOWLEDGE_OPERATION
  };
  const makeArchive = (index) => ({
    bvid: `BV${String(index).padStart(10, "0")}`,
    title: `知识标题${index}`,
    author: { name: `作者${index}` },
    cover: "https://i0.hdslb.com/bfs/archive/knowledge.webp",
    stat: { view: index, danmaku: index + 1 },
    duration: index + 2,
    goto: "javascript:ignored",
    aid: 123,
    mid: 456
  });
  const payloadWithCount = (count) => ({
    code: 0,
    data: { archives: Array.from({ length: count }, (_, index) => makeArchive(index)) }
  });

  assert(isExactKnowledgeMessage(request) && isExactKnowledgeCancelMessage(cancel), "exact request/cancel envelope");
  assert(!isExactKnowledgeMessage({ ...request, extra: true }), "unknown request key rejection");
  assert(!isExactKnowledgeMessage({ ...request, params: { url: "https://evil.example" } }), "non-empty params rejection");
  assert(!isExactKnowledgeCancelMessage({ ...cancel, extra: true }), "unknown cancel key rejection");
  assert(isKnowledgeSender(sender), "exact sender accepted");
  for (const invalidSender of [
    { ...sender, id: "other" },
    { ...sender, tab: { id: 7 } },
    { ...sender, tab: { id: -1, url: ROOT_URL } },
    { ...sender, url: `${ROOT_URL}?x=1` },
    { ...sender, origin: `${ROOT_ORIGIN}/` },
    { ...sender, frameId: 1 },
    { ...sender, documentId: undefined }
  ]) {
    assert(!isKnowledgeSender(invalidSender), "sender/root lifecycle rejection");
  }
  const originalFetch = globalThis.fetch;
  let preflightFetches = 0;
  globalThis.fetch = () => {
    preflightFetches += 1;
    throw new Error("knowledge preflight fetch must not run");
  };
  for (const invalidSender of [
    { ...sender, tab: { id: 7 } },
    { ...sender, frameId: 1 },
    { ...sender, documentId: undefined }
  ]) {
    handleRuntimeMessage(request, invalidSender, () => {});
    handleRuntimeMessage(cancel, invalidSender, () => {});
  }
  assert(preflightFetches === 0, "invalid sender/request preflight fetch=0");
  globalThis.fetch = originalFetch;
  const registryOldSender = { ...sender, tab: { id: 101, url: ROOT_URL }, documentId: "doc-old-v1" };
  const registryNewSender = { ...registryOldSender, documentId: "doc-new-v2" };
  const registryOldRoot = registerKnowledgeRoot(registryOldSender);
  assert(registryOldRoot && registryOldRoot.active && registryOldRoot.documentId === "doc-old-v1", "old document register");
  const registryNewRoot = registerKnowledgeRoot(registryNewSender);
  assert(registryNewRoot && registryNewRoot.active && registryNewRoot.documentId === "doc-new-v2", "new document register/invalidate");
  assert(registerKnowledgeRoot(registryOldSender) === null, "old document cannot re-register after invalidation");
  assert(registerKnowledgeRoot(registryNewSender) === registryNewRoot && registryNewRoot.active, "new root remains current and active");
  const activeRegistrySender = { ...sender, tab: { id: 102, url: ROOT_URL }, documentId: "doc-active-v1" };
  const activeRoot = registerKnowledgeRoot(activeRegistrySender);
  assert(activeRoot && registerKnowledgeRoot(activeRegistrySender) === activeRoot && activeRoot.active, "same active document returns same root");
  const invalidatedRegistrySender = { ...sender, tab: { id: 103, url: ROOT_URL }, documentId: "doc-invalidated-v1" };
  const invalidatedRoot = registerKnowledgeRoot(invalidatedRegistrySender);
  invalidateKnowledgeRoot(knowledgeRootKey(invalidatedRegistrySender), "self-test");
  assert(invalidatedRoot && !invalidatedRoot.active && registerKnowledgeRoot(invalidatedRegistrySender) === null, "same invalidated document cannot reactivate");
  const result = createKnowledgeResult(request, { ok: true, data: projectKnowledgeFeed(payloadWithCount(1)) });
  assert(Object.keys(result).sort().join("\u001F") === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", "exact success result keys");
  assert(Object.keys(result.data).sort().join("\u001F") === "items\u001Fstatus", "exact success data keys");
  assert(Object.keys(result.data.items[0]).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview", "eight-field projection");
  for (const kind of Object.values(KNOWLEDGE_ERROR_KINDS)) {
    const failure = createKnowledgeResult(request, { ok: false, kind });
    assert(Object.keys(failure).sort().join("\u001F") === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype", `typed failure ${kind}`);
    assert(Object.keys(failure.error).length === 1, `failure shell ${kind}`);
  }
  assert(projectKnowledgeFeed(payloadWithCount(0)).status === "empty", "zero output count");
  assert(projectKnowledgeFeed(payloadWithCount(1)).status === "partial", "one output count");
  assert(projectKnowledgeFeed(payloadWithCount(14)).status === "partial", "fourteen output count");
  assert(projectKnowledgeFeed(payloadWithCount(15)).status === "success", "fifteen output count");
  const duplicate = payloadWithCount(2);
  duplicate.data.archives[1].bvid = duplicate.data.archives[0].bvid;
  assert(projectKnowledgeFeed(duplicate).items.length === 1, "duplicate BVID drops after first");
  const invalidRequired = payloadWithCount(2);
  invalidRequired.data.archives[0].title = " ";
  invalidRequired.data.archives[1].author.name = "";
  assert(projectKnowledgeFeed(invalidRequired).items.length === 0, "required field discard");
  const guarded = makeArchive(1);
  guarded.cover = "http://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp";
  const upgraded = projectKnowledgeFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  assert(upgraded.coverUrl === "https://i0.hdslb.com/bfs/archive/a.webp@320w_200h_1c.webp", "http cover upgrade and path suffix");
  for (const cover of [
    "javascript:alert(1)",
    "ftp://i0.hdslb.com/bfs/a.webp",
    "https://evil.example/bfs/a.webp",
    "https://i0.hdslb.com/bfs/a.webp?q=1",
    "https://i0.hdslb.com/bfs/a.webp#x",
    "https://user@i0.hdslb.com/bfs/a.webp",
    "https://i0.hdslb.com:443/bfs/a.webp",
    `https://i0.hdslb.com/bfs/${"a".repeat(MAX_COVER_URL_LENGTH)}.webp`,
    `https://i0.hdslb.com/bfs/a.webp?${"q".repeat(MAX_COVER_URL_LENGTH)}`,
    "https://i0.hdslb.com/bfs/../a.webp",
    "https://i0.hdslb.com/bfs/a\u0000.webp",
    "/bfs/a.webp"
  ]) {
    guarded.cover = cover;
    assert(projectKnowledgeFeed({ code: 0, data: { archives: [guarded] } }).items[0].coverUrl === null, "cover guard");
  }
  guarded.cover = "https://i3.hdslb.com/bfs/archive/a.webp";
  const guardedOutput = projectKnowledgeFeed({ code: 0, data: { archives: [guarded] } }).items[0];
  assert(guardedOutput.coverUrl === guarded.cover && guardedOutput.href === `https://www.bilibili.com/video/${guarded.bvid}`, "cover and derived href");
  for (const invalidPayload of [null, [], { code: 1, data: { archives: [] } }, { code: 0, data: { archives: Array(16).fill(makeArchive(1)) } }]) {
    let failed = false;
    try {
      projectKnowledgeFeed(invalidPayload);
    } catch (error) {
      failed = error instanceof KnowledgeDataError && error.kind === KNOWLEDGE_ERROR_KINDS.SCHEMA;
    }
    assert(failed, "invalid upstream root rejection");
  }
  assert(KNOWLEDGE_FEED_URL === "https://api.bilibili.com/x/web-interface/region/feed/rcmd?display_id=1&request_cnt=15&from_region=1010&device=web&plat=30&web_location=333.40138", "fixed URL and query order");
  assert(KNOWLEDGE_CACHE_KEY.includes("from_region=1010") && !KNOWLEDGE_CACHE_KEY.includes("8767"), "knowledge cache isolation");
  assert(!Object.keys(globalThis).some((key) => key.toLowerCase().includes("cookie") && key.toLowerCase().includes("knowledge")), "knowledge has no credential state");
  recordKnowledgeSelfTestCategory("01 exact envelope/sender/root lifecycle/monotonic registry negative gate: PASS");
  recordKnowledgeSelfTestCategory("02 fixed URL/query/options and no caller transport input: PASS");
  recordKnowledgeSelfTestCategory("03 projection 0/1/14/15, duplicate, required fields, cover/href: PASS");
  recordKnowledgeSelfTestCategory("04 typed failure shells and knowledge/auth/floor isolation: PASS");
  return true;
};

const runKnowledgeTransportSelfTests = async () => {
  const assert = (condition, label) => {
    if (!condition) {
      throw new Error(`Knowledge transport self-test failed: ${label}`);
    }
  };
  const sender = {
    id: chrome.runtime.id,
    tab: { id: 8, url: ROOT_URL },
    frameId: 0,
    url: ROOT_URL,
    origin: ROOT_ORIGIN,
    documentId: "knowledge-transport-document"
  };
  const baseMessage = { requestId: "knowledge-transport", generation: 1, operation: KNOWLEDGE_OPERATION };
  const payload = { code: 0, data: { archives: Array.from({ length: 15 }, (_, index) => ({
    bvid: `BV${String(index).padStart(10, "0")}`,
    title: `标题${index}`,
    author: { name: `作者${index}` },
    cover: "https://i0.hdslb.com/bfs/archive/a.webp",
    stat: { view: index, danmaku: index },
    duration: index
  })) } };
  const encode = (value) => new TextEncoder().encode(JSON.stringify(value));
  const responseFor = (value, overrides = {}) => {
    const bytes = value instanceof Uint8Array ? value : encode(value);
    let consumed = false;
    return {
      ok: true,
      status: 200,
      type: "basic",
      redirected: false,
      ...overrides,
      headers: { get: (name) => name === "content-type" ? "application/json" : null },
      body: {
        getReader: () => ({
          read: async () => {
            if (consumed) return { done: true };
            consumed = true;
            return { done: false, value: bytes };
          },
          cancel: async () => {}
        })
      }
    };
  };
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalCacheKey = knowledgeCache.key;
  const originalCacheData = knowledgeCache.data;
  const originalCacheExpiry = knowledgeCache.expiresAt;
  const originalLastGood = knowledgeLastGood;
  const originalInFlightEntries = [...knowledgeInFlight.entries()];
  const originalGenerationEntries = [...knowledgeGeneration.entries()];
  const originalAbortEntries = [...knowledgeAbortController.entries()];
  const originalErrorEntries = [...knowledgeErrorShell.entries()];
  const originalUiEntries = [...knowledgeUiState.entries()];
  const originalRootEntries = [...knowledgeCurrentRoots.entries()];
  const originalKnowledgeSlots = knowledgeUpstreamSlots;
  const originalPublicUpstreamSlots = publicUpstreamSlots;
  let oldPromise = null;
  let newPromise = null;
  knowledgeCache.data = null;
  knowledgeCache.expiresAt = 0;
  knowledgeLastGood = null;
  knowledgeInFlight.clear();
  knowledgeGeneration.clear();
  knowledgeAbortController.clear();
  knowledgeErrorShell.clear();
  knowledgeUiState.clear();
  knowledgeCurrentRoots.clear();
  knowledgeUpstreamSlots = 0;
  try {
    const calls = [];
    globalThis.fetch = (url, options) => {
      calls.push({ url, options });
      return Promise.resolve(responseFor(payload));
    };
    const success = await fetchKnowledgeFeed(baseMessage, sender);
    assert(success.ok && success.data.status === "success" && calls.length === 1, "fixed transport success");
    assert(calls[0].url === KNOWLEDGE_FEED_URL && calls[0].options.method === "GET" && calls[0].options.credentials === "omit" && calls[0].options.redirect === "manual" && !Object.prototype.hasOwnProperty.call(calls[0].options, "body"), "fixed RequestInit and one fetch");
    assert(isKnowledgeCacheFresh(Date.now()) && knowledgeLastGood.items.length === 15, "success-only cache and last-good");
    const cached = await fetchKnowledgeFeed({ ...baseMessage, requestId: "cached", generation: 2 }, sender);
    assert(cached.ok && calls.length === 1, "cache hit no second fetch");

    knowledgeCache.data = null;
    knowledgeCache.expiresAt = 0;
    globalThis.fetch = () => Promise.resolve(responseFor(new Uint8Array(MAX_KNOWLEDGE_RESPONSE_BYTES + 1)));
    const oversize = await fetchKnowledgeFeed({ ...baseMessage, requestId: "oversize", generation: 3 }, sender);
    assert(!oversize.ok && oversize.kind === KNOWLEDGE_ERROR_KINDS.SCHEMA, "streamed 2 MiB cap");

    globalThis.fetch = () => Promise.resolve(responseFor(payload, { type: "opaqueredirect", redirected: true }));
    const redirect = await fetchKnowledgeFeed({ ...baseMessage, requestId: "redirect", generation: 4 }, sender);
    assert(!redirect.ok && redirect.kind === KNOWLEDGE_ERROR_KINDS.REDIRECTED, "redirect typed error");

    let timeoutTriggered = false;
    let timeoutDelay = null;
    globalThis.setTimeout = (callback, delay) => {
      timeoutTriggered = true;
      timeoutDelay = delay;
      callback();
      return 0;
    };
    globalThis.clearTimeout = () => {};
    globalThis.fetch = (url, options) => new Promise((resolve, reject) => {
      const rejectAbort = () => {
        const error = new Error("timeout");
        error.name = "AbortError";
        reject(error);
      };
      if (options.signal.aborted) {
        rejectAbort();
        return;
      }
      options.signal.addEventListener("abort", rejectAbort, { once: true });
    });
    const timeoutResult = await fetchKnowledgeFeed({ ...baseMessage, requestId: "timeout", generation: 5 }, sender);
    assert(timeoutTriggered && timeoutDelay === REQUEST_TIMEOUT_MS && timeoutDelay === 5000 && !timeoutResult.ok && timeoutResult.kind === KNOWLEDGE_ERROR_KINDS.TIMEOUT, "exact 5 second timeout typing and cleanup");

    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    const pending = [];
    globalThis.fetch = (url, options) => new Promise((resolve, reject) => {
      const entry = { resolve, reject, options, aborted: false };
      options.signal.addEventListener("abort", () => {
        entry.aborted = true;
        const error = new Error("cancelled");
        error.name = "AbortError";
        reject(error);
      }, { once: true });
      pending.push(entry);
    });
    oldPromise = fetchKnowledgeFeed({ ...baseMessage, requestId: "old", generation: 6 }, sender);
    newPromise = fetchKnowledgeFeed({ ...baseMessage, requestId: "new", generation: 7 }, sender);
    const oldResult = await oldPromise;
    assert(!oldResult.ok && oldResult.kind === KNOWLEDGE_ERROR_KINDS.CANCELLED && pending[0].aborted, "abort on newer generation");
    pending[1].resolve(responseFor(payload));
    const newResult = await newPromise;
    assert(newResult.ok && knowledgeGeneration.get(knowledgeRequestKey(sender)) === 7 && knowledgeLastGood.items.length === 15, "new generation atomic commit");
    const staleGeneration = await fetchKnowledgeFeed({ ...baseMessage, requestId: "stale-lower", generation: 6 }, sender);
    assert(!staleGeneration.ok && staleGeneration.kind === KNOWLEDGE_ERROR_KINDS.CANCELLED && knowledgeGeneration.get(knowledgeRequestKey(sender)) === 7, "older generation rejected before abort/replace/fetch");

    knowledgeCache.data = null;
    knowledgeCache.expiresAt = 0;
    globalThis.fetch = () => Promise.reject(new Error("network"));
    const failed = await fetchKnowledgeFeed({ ...baseMessage, requestId: "failed", generation: 8 }, sender);
    assert(!failed.ok && failed.kind === KNOWLEDGE_ERROR_KINDS.UNAVAILABLE && knowledgeLastGood.items.length === 15, "failure preserves last-good");
    assert(knowledgeInFlight.size === 0 && knowledgeAbortController.size === 0, "in-flight and abort cleanup");
    const oldRootSender = { ...sender, tab: { id: 10, url: ROOT_URL }, documentId: "knowledge-old-root" };
    const newRootSender = { ...sender, tab: { id: 10, url: ROOT_URL }, documentId: "knowledge-new-root" };
    const oldRootKey = knowledgeRequestKey(oldRootSender);
    const rootPending = [];
    const rootSentinel = { status: "partial", items: [] };
    knowledgeCache.data = null;
    knowledgeCache.expiresAt = 0;
    knowledgeLastGood = rootSentinel;
    publicUpstreamSlots = MAX_PUBLIC_UPSTREAM_SLOTS;
    knowledgeErrorShell.set(oldRootKey, "sentinel");
    knowledgeUiState.set(oldRootKey, "sentinel");
    globalThis.fetch = (url, options) => new Promise((resolve) => {
      const entry = { resolve, options, aborted: false };
      options.signal.addEventListener("abort", () => { entry.aborted = true; }, { once: true });
      rootPending.push(entry);
    });
    oldPromise = fetchKnowledgeFeed({ ...baseMessage, requestId: "old-root", generation: 1 }, oldRootSender);
    const oldRootState = knowledgeInFlight.get(oldRootKey);
    newPromise = fetchKnowledgeFeed({ ...baseMessage, requestId: "new-root", generation: 1 }, newRootSender);
    assert(rootPending.length === 2 && oldRootState.invalidated && rootPending[0].aborted, "new document invalidates old root and aborts old fetch");
    assert(!knowledgeErrorShell.has(oldRootKey) && !knowledgeUiState.has(oldRootKey), "old root error/UI state invalidated");
    rootPending[0].resolve(responseFor(payload));
    const oldRootResult = await oldPromise;
    assert(!oldRootResult.ok && oldRootResult.kind === KNOWLEDGE_ERROR_KINDS.CANCELLED && knowledgeCache.data === null && knowledgeLastGood === rootSentinel, "old root late result cannot commit cache/last-good");
    rootPending[1].resolve(responseFor(payload));
    const newRootResult = await newPromise;
    assert(newRootResult.ok && knowledgeLastGood !== rootSentinel && publicUpstreamSlots === MAX_PUBLIC_UPSTREAM_SLOTS, "new root independently commits despite public slot saturation");
    assert(knowledgeUpstreamSlots === 0, "knowledge-only upstream slot releases exactly once");
    const currentRoot = getCurrentKnowledgeRoot(newRootSender);
    const currentRootCache = knowledgeCache.data;
    const currentRootLastGood = knowledgeLastGood;
    const currentRootGeneration = knowledgeGeneration.get(knowledgeRequestKey(newRootSender));
    for (const delayedGeneration of [0, 1, 99]) {
      const delayed = await fetchKnowledgeFeed({ ...baseMessage, requestId: `delayed-old-${delayedGeneration}`, generation: delayedGeneration }, oldRootSender);
      assert(!delayed.ok && delayed.kind === KNOWLEDGE_ERROR_KINDS.CANCELLED, `retired old root generation ${delayedGeneration} rejected`);
    }
    cancelKnowledge({ requestId: "old-root", generation: 1, operation: KNOWLEDGE_OPERATION }, oldRootSender);
    assert(
      getCurrentKnowledgeRoot(newRootSender) === currentRoot
        && currentRoot.documentId === newRootSender.documentId
        && knowledgeGeneration.get(knowledgeRequestKey(newRootSender)) === currentRootGeneration
        && knowledgeCache.data === currentRootCache
        && knowledgeLastGood === currentRootLastGood
        && knowledgeUpstreamSlots === 0,
      "retired old root request/cancel cannot reclaim authority or mutate state"
    );
    recordKnowledgeSelfTestCategory("05 deterministic fetch harness fixed options/cache/2 MiB/timeout: PASS");
    recordKnowledgeSelfTestCategory("06 redirect/root invalidation/old commit suppression/retired old-root low/equal/high rejection: PASS");
    recordKnowledgeSelfTestCategory("07 abort/generation/last-good/cleanup isolation: PASS");
    recordKnowledgeSelfTestCategory("08 no Chrome runtime evidence claimed; deterministic gate only: PASS");
    return true;
  } finally {
    for (const state of knowledgeInFlight.values()) {
      if (state && state.invalidated !== true) {
        state.invalidated = true;
        state.cancelled = true;
        state.controller.abort();
        if (state.releaseSlot) {
          state.releaseSlot();
          state.releaseSlot = null;
        }
      }
    }
    await Promise.allSettled([oldPromise, newPromise].filter(Boolean));
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    knowledgeCache.key = originalCacheKey;
    knowledgeCache.data = originalCacheData;
    knowledgeCache.expiresAt = originalCacheExpiry;
    knowledgeLastGood = originalLastGood;
    knowledgeInFlight.clear();
    for (const [key, state] of originalInFlightEntries) {
      knowledgeInFlight.set(key, state);
    }
    knowledgeGeneration.clear();
    for (const [key, generation] of originalGenerationEntries) {
      knowledgeGeneration.set(key, generation);
    }
    knowledgeAbortController.clear();
    for (const [key, controller] of originalAbortEntries) {
      knowledgeAbortController.set(key, controller);
    }
    knowledgeErrorShell.clear();
    for (const [key, value] of originalErrorEntries) {
      knowledgeErrorShell.set(key, value);
    }
    knowledgeUiState.clear();
    for (const [key, value] of originalUiEntries) {
      knowledgeUiState.set(key, value);
    }
    knowledgeCurrentRoots.clear();
    for (const [key, root] of originalRootEntries) {
      knowledgeCurrentRoots.set(key, root);
    }
    knowledgeUpstreamSlots = originalKnowledgeSlots;
    publicUpstreamSlots = originalPublicUpstreamSlots;
  }
};

const normalizeSearchText = (value, maximum) => typeof value === "string"
  && value.length <= maximum
  && /[\u0000-\u001F\u007F]/.test(value) === false
  ? value.trim()
  : "";

const normalizeSearchDefaultUrl = (value, keyword) => {
  if (typeof value === "string" && value.length <= 2048) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === "https:"
        && parsed.hostname === "search.bilibili.com"
        && parsed.username === ""
        && parsed.password === ""
        && parsed.port === ""
        && parsed.pathname === "/all"
        && parsed.hash === "") {
        const urlKeyword = normalizeSearchText(parsed.searchParams.get("keyword"), 128);
        if (urlKeyword) return `https://search.bilibili.com/all?keyword=${encodeURIComponent(urlKeyword)}`;
      }
    } catch {
      // Fall through to the canonical URL built from the projected keyword.
    }
  }
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword)}`;
};

const normalizeSearchRemoteIcon = (value) => {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048
    || /[\u0000-\u001F\u007F]/.test(value)) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/")
      ? parsed.href
      : null;
  } catch {
    return null;
  }
};

const SEARCH_MARK_BY_ICON_URL = Object.freeze({
  "https://i0.hdslb.com/bfs/activity-plat/static/20251027/aafcb8031fd171c428daaa9b45867226/VaxAnHMq6w.gif": "live",
  "https://i0.hdslb.com/bfs/legacy/647bba88c37449d0f5a2c69f1dff1373caf20797.png": "anniversary"
});

const projectSearchData = (defaultRaw, trendingRaw) => {
  if (!isPlainObject(trendingRaw)
    || !isPlainObject(trendingRaw.data)
    || !isPlainObject(trendingRaw.data.trending)
    || !Array.isArray(trendingRaw.data.trending.list)) throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  const defaultData = isPlainObject(defaultRaw) && isPlainObject(defaultRaw.data) ? defaultRaw.data : null;
  const defaultKeyword = (defaultData && (normalizeSearchText(defaultData.show_name, 128)
    || normalizeSearchText(defaultData.name, 128))) || "哔哩哔哩";
  const trendingItems = [];
  for (const entry of trendingRaw.data.trending.list) {
    if (trendingItems.length >= 10) break;
    if (!isPlainObject(entry)) continue;
    const keyword = normalizeSearchText(entry.keyword, 128) || normalizeSearchText(entry.show_name, 128);
    const text = normalizeSearchText(entry.show_name, 128) || keyword;
    if (!keyword || !text) continue;
    const approvedIcon = normalizeSearchRemoteIcon(entry.icon);
    const markKey = approvedIcon ? (SEARCH_MARK_BY_ICON_URL[approvedIcon] || "none") : "none";
    trendingItems.push(Object.freeze({
      keyword,
      text,
      markKey,
      remoteIcon: markKey === "none" ? approvedIcon : null
    }));
  }
  return Object.freeze({
    defaultKeyword,
    defaultUrl: normalizeSearchDefaultUrl(defaultData && defaultData.url, defaultKeyword),
    trendingTitle: normalizeSearchText(trendingRaw.data.trending.title, 64) || "bilibili热搜",
    trendingItems: Object.freeze(trendingItems)
  });
};

const fetchSearchJson = async (url) => {
  const response = await fetch(url, { method: "GET", credentials: "omit", redirect: "manual" });
  if (!response || response.ok !== true || response.redirected === true || response.type === "opaqueredirect") {
    throw new FocusDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
  }
  return readFocusJson(response);
};

const fetchSearchData = async () => {
  const [defaultResult, trendingRaw] = await Promise.all([
    fetchSearchJson(SEARCH_DEFAULT_URL).catch(() => null),
    fetchSearchJson(SEARCH_TRENDING_URL)
  ]);
  return projectSearchData(defaultResult, trendingRaw);
};

const createSearchResult = (message, data, errorKind = null) => errorKind === null
  ? { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: SEARCH_OPERATION, ok: true, data }
  : { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: SEARCH_OPERATION, ok: false, error: { kind: errorKind } };

const projectSearchAutocomplete = (raw, term) => {
  if (!isPlainObject(raw) || raw.code !== 0 || !isPlainObject(raw.result) || !Array.isArray(raw.result.tag)) {
    throw new FocusDataError(FOCUS_ERROR_KINDS.SCHEMA);
  }
  const items = [];
  const seen = new Set();
  for (const entry of raw.result.tag) {
    if (items.length >= 10) break;
    if (!isPlainObject(entry)) continue;
    const value = normalizeSearchText(entry.value, 128) || normalizeSearchText(entry.term, 128);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    items.push(value);
  }
  return Object.freeze({ term, items: Object.freeze(items) });
};

const fetchSearchAutocomplete = async (term) => {
  const query = new URLSearchParams({
    func: "suggest",
    suggest_type: "accurate",
    sub_type: "tag",
    main_ver: "v1",
    highlight: "",
    userid: "0",
    bangumi_acc_num: "1",
    special_acc_num: "1",
    topic_acc_num: "1",
    upuser_acc_num: "3",
    tag_num: "10",
    special_num: "10",
    bangumi_num: "10",
    upuser_num: "3",
    term
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${SEARCH_AUTOCOMPLETE_URL}?${query}`, {
      method: "GET",
      credentials: "omit",
      redirect: "manual",
      signal: controller.signal
    });
    if (!response || response.ok !== true || response.redirected === true || response.type === "opaqueredirect") {
      throw new FocusDataError(FOCUS_ERROR_KINDS.UNAVAILABLE);
    }
    return projectSearchAutocomplete(await readFocusJson(response, { allowMissingContentType: true }), term);
  } finally {
    clearTimeout(timer);
  }
};

const createSearchAutocompleteResult = (message, data, errorKind = null) => errorKind === null
  ? { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: SEARCH_AUTOCOMPLETE_OPERATION, ok: true, data }
  : { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: SEARCH_AUTOCOMPLETE_OPERATION, ok: false, error: { kind: errorKind } };

const isMangaRequest = (message) => isPlainObject(message)
  && Object.keys(message).sort().join("\u001F") === "generation\u001Foperation\u001Fparams\u001FrequestId\u001Ftype"
  && message.type === "HOMEPAGE_DATA_REQUEST_V1"
  && message.operation === MANGA_OPERATION
  && typeof message.requestId === "string" && message.requestId.length > 0 && message.requestId.length <= MAX_REQUEST_ID_LENGTH
  && Number.isSafeInteger(message.generation) && message.generation >= 0
  && isPlainObject(message.params)
  && Object.keys(message.params).sort().join("\u001F") === "batch"
  && Number.isSafeInteger(message.params.batch) && message.params.batch >= 0 && message.params.batch <= 10000;

const readMangaText = async (response) => {
  const declared = response.headers.get("content-length");
  if (declared !== null && (!Number.isSafeInteger(Number(declared)) || Number(declared) < 0 || Number(declared) > MAX_MANGA_RESPONSE_BYTES)) {
    throw new Error("schema");
  }
  const reader = response.body && response.body.getReader ? response.body.getReader() : null;
  if (!reader) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > MAX_MANGA_RESPONSE_BYTES) throw new Error("schema");
    return text;
  }
  const chunks = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > MAX_MANGA_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error("schema");
    }
    chunks.push(part.value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
};

const normalizeMangaCover = (value) => {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048 || /[\u0000-\u001f\u007f]/.test(value)) return null;
  let parsed;
  try { parsed = new URL(value.startsWith("//") ? `https:${value}` : value); } catch { return null; }
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:")
    || !["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname.toLowerCase())
    || parsed.username || parsed.password || parsed.port || parsed.hash
    || !/^\/bfs\/(?:manga-static|archive|bangumi)\//.test(parsed.pathname)) return null;
  parsed.protocol = "https:";
  return parsed.href;
};

const mangaText = (value, limit = 200) => typeof value === "string" && value.length > 0 && value.length <= limit && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
const normalizeMangaItem = (entry, rank = null) => {
  if (!isPlainObject(entry)) return null;
  const comicId = Number(entry.comic_id);
  const title = mangaText(entry.title);
  const cover = normalizeMangaCover(entry.vertical_cover);
  if (!Number.isSafeInteger(comicId) || comicId <= 0 || !title || !cover) return null;
  const styles = Array.isArray(entry.styles) ? entry.styles.map((style) => typeof style === "string" ? style : isPlainObject(style) ? style.name : "").filter((style) => mangaText(style, 32)).slice(0, 2) : [];
  const shortTitle = typeof entry.last_short_title === "string" ? entry.last_short_title : "";
  const updateText = mangaText(shortTitle, 80) ? `更新至 ${shortTitle}` : entry.is_finish === 1 ? "已完结" : "连载中";
  const item = { comicId, title, cover, href: `https://manga.bilibili.com/detail/mc${comicId}`, tags: styles, updateText };
  if (rank !== null) item.rank = rank;
  return Object.freeze(item);
};

const uniqueMangaItems = (source, limit, ranked = false) => {
  const result = [];
  const seen = new Set();
  for (const entry of Array.isArray(source) ? source : []) {
    const item = normalizeMangaItem(entry, ranked ? result.length + 1 : null);
    if (!item || seen.has(item.comicId)) continue;
    seen.add(item.comicId); result.push(item);
    if (result.length >= limit) break;
  }
  return result;
};

const extractMangaRank = (html, limit = 10) => {
  const marker = '<script id="vike_pageContext" type="application/json">';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error("schema");
  const contentStart = start + marker.length;
  const end = html.indexOf("</script>", contentStart);
  if (end < 0) throw new Error("schema");
  const parsed = JSON.parse(html.slice(contentStart, end));
  const source = parsed && parsed.data && parsed.data.rankListInfo;
  const items = uniqueMangaItems(source, Math.min(50, Math.max(1, limit)), true);
  if (items.length === 0) throw new Error("schema");
  return items;
};

const fetchMangaFloor = async (message) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const readPage = async (url) => {
      const response = await fetch(url, { credentials: "omit", cache: "no-store", redirect: "follow", signal: controller.signal });
      if (!response.ok || response.type === "opaqueredirect" || !response.url.startsWith("https://manga.bilibili.com/")) throw new Error("unavailable");
      return readMangaText(response);
    };
    const [japanText, chinaText] = await Promise.all([readPage(MANGA_JAPAN_RANK_URL), readPage(MANGA_CHINA_RANK_URL)]);
    const japanesePool = extractMangaRank(japanText, 50);
    const chinesePool = extractMangaRank(chinaText, 50);
    const combined = [];
    const seen = new Set();
    for (const ranked of [...japanesePool, ...chinesePool]) {
      if (seen.has(ranked.comicId)) continue;
      seen.add(ranked.comicId);
      const { rank: _rank, ...item } = ranked;
      combined.push(Object.freeze(item));
    }
    if (combined.length < 12) throw new Error("schema");
    const pick = (offset) => Object.freeze(Array.from({ length: Math.min(12, combined.length) }, (_, index) => combined[(offset + index) % combined.length]));
    const batch = message.params.batch;
    const offset = (batch * 12) % combined.length;
    const data = Object.freeze({
      batch,
      status: "success",
      recommendationItems: pick(offset),
      freeItems: pick((offset + 12) % combined.length),
      japaneseRanks: Object.freeze(japanesePool.slice(0, 10)),
      chineseRanks: Object.freeze(chinesePool.slice(0, 10))
    });
    return { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: MANGA_OPERATION, ok: true, data };
  } catch (error) {
    return { type: "HOMEPAGE_DATA_RESULT_V1", requestId: message.requestId, generation: message.generation, operation: MANGA_OPERATION, ok: false,
      error: { kind: error && error.name === "AbortError" ? "TIMEOUT" : "MANGA_PAGE_UNAVAILABLE" } };
  } finally { clearTimeout(timer); }
};

const handleRuntimeMessage = (message, sender, sendResponse) => {
  if (isMangaRequest(message)) {
    if (!isExactRootSender(sender)) return undefined;
    const responseDeadline = new Promise((resolve) => setTimeout(() => resolve({
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: message.requestId,
      generation: message.generation,
      operation: MANGA_OPERATION,
      ok: false,
      error: { kind: "TIMEOUT" }
    }), REQUEST_TIMEOUT_MS + 1000));
    return Promise.race([fetchMangaFloor(message), responseDeadline]);
  }
  if (isAnimalCancel(message)) {
    if (isAnimalSender(sender)) cancelAnimal(message, sender);
    return undefined;
  }

  if (isAnimalRequest(message)) {
    if (!isAnimalSender(sender)) return undefined;
    fetchAnimalFeed(message, sender)
      .then((result) => {
        const finalResult = result.ok || result.fenced
          ? result
          : finalizeAnimalFailure(animalRequestKey(sender), animalInFlight.get(animalRequestKey(sender)) || null, message, sender, result.kind);
        if (!finalResult.ok && finalResult.fenced !== true) return;
        sendResponse(createAnimalResult(message, finalResult));
      })
      .catch(() => {
        const key = animalRequestKey(sender);
        const result = finalizeAnimalFailure(key, animalInFlight.get(key) || null, message, sender, ANIMAL_ERROR_KINDS.UNAVAILABLE);
        if (!result.ok && result.fenced !== true) return;
        sendResponse(createAnimalResult(message, result));
      });
    return true;
  }

  if (isFashionCancel(message)) {
    if (isFashionSender(sender)) cancelFashion(message, sender);
    return undefined;
  }

  if (isFashionRequest(message)) {
    if (!isFashionSender(sender)) return undefined;
    fetchFashionFeed(message, sender)
      .then((result) => {
        const finalResult = result.ok || result.fenced
          ? result
          : finalizeFashionFailure(fashionRequestKey(sender), fashionInFlight.get(fashionRequestKey(sender)) || null, message, sender, result.kind);
        if (!finalResult.ok && finalResult.fenced !== true) return;
        sendResponse(createFashionResult(message, finalResult));
      })
      .catch(() => {
        const key = fashionRequestKey(sender);
        const result = finalizeFashionFailure(key, fashionInFlight.get(key) || null, message, sender, FASHION_ERROR_KINDS.UNAVAILABLE);
        if (!result.ok && result.fenced !== true) return;
        sendResponse(createFashionResult(message, result));
      });
    return true;
  }

  if (isExactMusicCancelMessage(message)) {
    if (isMusicSender(sender)) cancelMusic(message, sender);
    return undefined;
  }

  if (isExactMusicMessage(message)) {
    if (!isMusicSender(sender)) return undefined;
    fetchMusicFeed(message, sender)
      .then((result) => sendResponse(createMusicResult(message, result)))
      .catch(() => sendResponse(createMusicResult(message, { ok: false, kind: MUSIC_ERROR_KINDS.UNAVAILABLE })));
    return true;
  }

  if (isExactKnowledgeCancelMessage(message)) {
    if (isKnowledgeSender(sender)) {
      cancelKnowledge(message, sender);
    }
    return undefined;
  }

  if (isExactKnowledgeMessage(message)) {
    if (!isKnowledgeSender(sender)) {
      return undefined;
    }
    fetchKnowledgeFeed(message, sender)
      .then((result) => sendResponse(createKnowledgeResult(message, result)))
      .catch(() => sendResponse(createKnowledgeResult(message, {
        ok: false,
        kind: KNOWLEDGE_ERROR_KINDS.UNAVAILABLE
      })));
    return true;
  }

  if (isExactPgcGuochuangCancelMessage(message)) {
    if (isAuthoritativePgcSender(sender)) {
      cancelPgcGuochuang(message, sender);
    }
    return undefined;
  }

  if (isExactPgcAnimeCancelMessage(message)) {
    if (isAuthoritativePgcSender(sender)) {
      cancelPgcAnime(message, sender);
    }
    return undefined;
  }

  if (isExactFocusCancelMessage(message)) {
    if (isExactRootSender(sender)) {
      cancelFocusCarousel(message, sender);
    }
    return undefined;
  }

  if (isLegacyAuthMessage(message)) {
    sendResponse(unknownResult());
    return true;
  }

  if (isExactSearchMessage(message)) {
    if (!isExactRootSender(sender)) return undefined;
    fetchSearchData()
      .then((data) => sendResponse(createSearchResult(message, data)))
      .catch((error) => sendResponse(createSearchResult(
        message,
        null,
        error instanceof FocusDataError ? error.kind : FOCUS_ERROR_KINDS.UNAVAILABLE
      )));
    return true;
  }

  if (isExactSearchAutocompleteMessage(message)) {
    if (!isExactRootSender(sender)) return undefined;
    fetchSearchAutocomplete(message.params.term)
      .then((data) => sendResponse(createSearchAutocompleteResult(message, data)))
      .catch((error) => sendResponse(createSearchAutocompleteResult(
        message,
        null,
        error instanceof FocusDataError ? error.kind : FOCUS_ERROR_KINDS.UNAVAILABLE
      )));
    return true;
  }

  if (isExactPgcAnimeMessage(message)) {
    if (!isAuthoritativePgcSender(sender)) {
      return undefined;
    }

    fetchPgcAnime(message, sender)
      .then((result) => sendResponse(createPgcAnimeResult(message, result)))
      .catch(() => sendResponse(createPgcAnimeResult(message, {
        ok: false,
        kind: FOCUS_ERROR_KINDS.UNAVAILABLE
      })));
    return true;
  }

  if (isExactPgcGuochuangMessage(message)) {
    if (!isAuthoritativePgcSender(sender)) {
      return undefined;
    }
    fetchPgcGuochuang(message, sender)
      .then((result) => sendResponse(createPgcGuochuangResult(message, result)))
      .catch(() => sendResponse(createPgcGuochuangResult(message, {
        ok: false,
        kind: FOCUS_ERROR_KINDS.UNAVAILABLE
      })));
    return true;
  }

  if (!isExactFocusMessage(message) || !isExactRootSender(sender)) {
    return undefined;
  }

  fetchFocusCarousel(message, sender)
    .then((result) => sendResponse(createFocusResult(message, result)))
    .catch(() => sendResponse(createFocusResult(message, {
      ok: false,
      kind: FOCUS_ERROR_KINDS.UNAVAILABLE
    })));
  return true;
};

if (globalThis.__EXTENSION_B_MANGA_TEST__ === true) {
  globalThis.__EXTENSION_B_MANGA_TEST_API__ = Object.freeze({
    isMangaRequest,
    normalizeMangaCover,
    normalizeMangaItem,
    uniqueMangaItems,
    extractMangaRank,
    fetchMangaFloor
  });
}

chrome.runtime.onMessage.addListener(handleRuntimeMessage);

if (globalThis.__EXTENSION_B_RUN_SELF_TESTS__ === true) {
  runPgcAnimeDeterministicSelfTests();
  runPgcGuochuangDeterministicSelfTests();
  globalThis.__EXTENSION_B_PGC_SELF_TEST_PROMISE__ = runPgcGuochuangTransportSelfTests().then(() => {
    globalThis.__EXTENSION_B_PGC_SELF_TEST_PASSED__ = true;
    return true;
  });
}

if (globalThis.__EXTENSION_B_RUN_KNOWLEDGE_SELF_TESTS__ === true) {
  runKnowledgeDeterministicSelfTests();
  globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_PROMISE__ = runKnowledgeTransportSelfTests().then(() => {
    globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_PASSED__ = true;
    return true;
  });
}

if (globalThis.__EXTENSION_B_RUN_MUSIC_SELF_TESTS__ === true) {
  runMusicDeterministicSelfTests();
  globalThis.__EXTENSION_B_MUSIC_SELF_TEST_PROMISE__ = runMusicTransportSelfTests().then(() => {
    globalThis.__EXTENSION_B_MUSIC_SELF_TEST_PASSED__ = true;
    return true;
  });
}

if (globalThis.__EXTENSION_B_RUN_ANIMAL_FASHION_SELF_TESTS__ === true) {
  runAnimalFashionDeterministicSelfTests();
  globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_PROMISE__ = runAnimalFashionTransportSelfTests().then(() => {
    globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_PASSED__ = true;
    return true;
  });
}
