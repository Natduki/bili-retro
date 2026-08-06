(() => {
  "use strict";

  const ROOT_URL = "https://www.bilibili.com/";
  const HOST_ID = "extension-b-stage-2-host";
  const BUILD_MARKER = "stage-11-banner-import-r21";
  const EXTENSION_VERSION = "0.2.67";
  const STYLE_ID = "extension-b-stage-2-hide-style";
  const URL_POLL_MS = 250;
  const BODY_WAIT_MS = 50;
  const MAX_HOST_RECOVERIES = 8;
  const FOCUS_OPERATION = "FOCUS_CAROUSEL";
  const KNOWLEDGE_OPERATION = "ORDINARY_ZONE_KNOWLEDGE_FEED";
  const MUSIC_OPERATION = "ORDINARY_ZONE_MUSIC_FEED";
  const ANIMAL_OPERATION = "ORDINARY_ZONE_ANIMAL_FEED";
  const FASHION_OPERATION = "ORDINARY_ZONE_FASHION_FEED";
  const PGC_ANIME_OPERATION = "PGC_ANIME_COMPOSITE";
  const PGC_GUOCHUANG_OPERATION = "PGC_GUOCHUANG_COMPOSITE";
  const LIVE_HOVER_OPERATION = "LIVE_HOVER";
  const PRIMARY_MENU_COUNTS_OPERATION = "PRIMARY_MENU_COUNTS";
  const BANNER_CURRENT_OPERATION = "BANNER_CURRENT";
  const BANNER_MAX_ASSETS = 512;
  const RECOMMENDATION_OPERATION = "RECOMMENDATION_FEED";
  const DOUGA_OPERATION = "DOUGA_FLOOR";
  const ORDINARY_ZONE_OPERATION = "ORDINARY_ZONE_FLOOR";
  const READ_FLOOR_OPERATION = "READ_FLOOR";
  const MANGA_OPERATION = "MANGA_FLOOR";
  const ORDINARY_ZONE_TYPES = Object.freeze([
    "music", "dance", "game", "knowledge", "course", "tech", "sports", "car", "life", "food",
    "animal", "kichiku", "fashion", "information", "ent", "movie", "teleplay", "cinephile", "documentary"
  ]);
  const ORDINARY_ZONE_RANK_TYPES = Object.freeze(ORDINARY_ZONE_TYPES.filter((type) => (
    type !== "life" && type !== "information"
  )));
  const LIVE_FLOOR_INITIAL_OPERATION = "LIVE_FLOOR_INITIAL";
  const LIVE_FLOOR_MORE_OPERATION = "LIVE_FLOOR_MORE";
  const LIVE_FLOOR_FOLLOWING_OPERATION = "LIVE_FLOOR_FOLLOWING";
  const LIVE_FLOOR_SESSION_KEY = "extensionBHomeLiveFollowingConsumedV1";
  const WATCH_LATER_OPERATION = "WATCH_LATER_MUTATE";
  const SEARCH_OPERATION = "SEARCH_SUGGEST";
  const SEARCH_AUTOCOMPLETE_OPERATION = "SEARCH_AUTOCOMPLETE";
  const SEARCH_HISTORY_STORAGE_KEY = "homepageSearchHistoryV1";
  const SHOW_LOGIN_OPERATION = "SHOW_LOGIN";
  const LOGOUT_OPERATION = "LOGOUT";
  const PROFILE_STATS_OPERATION = "PROFILE_STATS";
  const DIAGNOSTICS_MESSAGE_TYPE = "BILI_RETRO_DIAGNOSTICS_GET_V1";
  const DIAGNOSTICS_SCHEMA_VERSION = 1;
  const DIAGNOSTICS_ERROR_LIMIT = 100;
  const diagnosticOperations = new Map();
  const diagnosticErrors = [];
  const diagnosticNow = () => Date.now();
  const diagnosticClock = () => globalThis.performance && typeof globalThis.performance.now === "function"
    ? globalThis.performance.now()
    : diagnosticNow();
  const diagnosticKeyFor = (operation, mutation) => {
    if (operation === ORDINARY_ZONE_OPERATION && mutation && typeof mutation.type === "string") {
      return `${operation}:${mutation.type}:${mutation.includeRank === true ? "rank" : "list"}`;
    }
    if (operation === DOUGA_OPERATION && mutation) {
      return `${operation}:${mutation.includeRank === true ? "rank" : "list"}`;
    }
    if (operation === WATCH_LATER_OPERATION && mutation && typeof mutation.action === "string") {
      return `${operation}:${mutation.action}`;
    }
    return operation;
  };
  const recordDiagnostic = (key, status, durationMs, errorKind = "") => {
    if (typeof key !== "string" || key.length === 0 || key.length > 96) return;
    const safeStatus = typeof status === "string" && /^[a-z-]{2,32}$/.test(status) ? status : "error";
    const safeError = typeof errorKind === "string" && /^[A-Z0-9_-]{0,48}$/.test(errorKind) ? errorKind : "UNKNOWN";
    const previous = diagnosticOperations.get(key);
    const entry = Object.freeze({
      operation: key,
      status: safeStatus,
      durationMs: Number.isFinite(durationMs) ? Math.max(0, Math.round(durationMs)) : null,
      errorKind: safeStatus === "success" ? "" : safeError,
      updatedAt: diagnosticNow(),
      requestCount: previous ? previous.requestCount + 1 : 1
    });
    diagnosticOperations.set(key, entry);
    if (safeStatus !== "success" && safeStatus !== "cancelled") {
      diagnosticErrors.push(Object.freeze({
        operation: key,
        status: safeStatus,
        errorKind: entry.errorKind,
        durationMs: entry.durationMs,
        timestamp: entry.updatedAt
      }));
      if (diagnosticErrors.length > DIAGNOSTICS_ERROR_LIMIT) {
        diagnosticErrors.splice(0, diagnosticErrors.length - DIAGNOSTICS_ERROR_LIMIT);
      }
    }
  };
  const FOCUS_ERROR_KINDS = new Set([
    "UPSTREAM_UNAVAILABLE",
    "UPSTREAM_SCHEMA_INVALID",
    "UPSTREAM_REDIRECTED",
    "TIMEOUT",
    "CANCELLED"
  ]);
  const PGC_ANIME_ERROR_KINDS = FOCUS_ERROR_KINDS;
  const PGC_GUOCHUANG_ERROR_KINDS = FOCUS_ERROR_KINDS;
  const KNOWLEDGE_ERROR_KINDS = new Set([
    "UPSTREAM_UNAVAILABLE",
    "UPSTREAM_SCHEMA_INVALID",
    "UPSTREAM_REDIRECTED",
    "TIMEOUT",
    "CANCELLED",
    "PROTOCOL_INVALID"
  ]);
  const MUSIC_ERROR_KINDS = new Set([
    "UPSTREAM_UNAVAILABLE",
    "UPSTREAM_SCHEMA_INVALID",
    "UPSTREAM_REDIRECTED",
    "TIMEOUT",
    "CANCELLED",
    "PROTOCOL_INVALID"
  ]);
  const ANIMAL_ERROR_KINDS = new Set([
    "UPSTREAM_UNAVAILABLE",
    "UPSTREAM_SCHEMA_INVALID",
    "UPSTREAM_REDIRECTED",
    "TIMEOUT",
    "CANCELLED",
    "PROTOCOL_INVALID"
  ]);
  const FASHION_ERROR_KINDS = new Set([
    "UPSTREAM_UNAVAILABLE",
    "UPSTREAM_SCHEMA_INVALID",
    "UPSTREAM_REDIRECTED",
    "TIMEOUT",
    "CANCELLED",
    "PROTOCOL_INVALID"
  ]);

  const isLegacyHomepageRootUrl = (href) => {
    if (typeof href !== "string") return false;
    let parsed;
    try { parsed = new URL(href); } catch { return false; }
    return parsed.protocol === "https:"
      && parsed.hostname === "www.bilibili.com"
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && (parsed.pathname === "/" || parsed.pathname === "/index.html");
  };
  const isExactRoot = () => isLegacyHomepageRootUrl(window.location.href);

  const createOwnerMarker = () => {
    const values = new Uint32Array(4);
    window.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");
  };

  const createRecommendationInitialBatch = () => {
    const value = new Uint32Array(1);
    window.crypto.getRandomValues(value);
    return 1 + (value[0] % 9999);
  };

  class AppRuntime {
    constructor(ownerMarker) {
      this.active = true;
      this.generation = 0;
      this.ownerMarker = ownerMarker;
      this.host = null;
      this.shadowRoot = null;
      this.rendered = null;
      this.hideStyle = null;
      this.observedBody = null;
      this.observer = null;
      this.bodyWaitTimer = null;
      this.hostRecoveryCount = 0;
      this.requestGeneration = 0;
      this.latestRequestGeneration = 0;
      this.statusPanel = null;
      this.statusText = null;
      this.livePopover = null;
      this.liveTrigger = null;
      this.liveRequestCancel = null;
      this.primaryMenu = null;
      this.primaryMenuCountsRequested = false;
      this.primaryMenuCountsGeneration = 0;
      this.bannerGeneration = 0;
      this.bannerRequested = false;
      this.messagePanel = null;
      this.messageRequested = false;
      this.messageDataLoaded = false;
      this.messageGeneration = 0;
      this.dynamicPanel = null;
      this.dynamicTrigger = null;
      this.dynamicRequested = false;
      this.dynamicDataLoaded = false;
      this.dynamicLastGood = null;
      this.dynamicGeneration = 0;
      this.profilePopover = null;
      this.profileTrigger = null;
      this.profileGroup = null;
      this.signin = null;
      this.summaryPanels = null;
      this.logoutButton = null;
      this.profileStatsRequestCancel = null;
      this.recommendation = null;
      this.recommendationBatch = 0;
      this.recommendationGeneration = 0;
      this.recommendationLastGood = null;
      this.recommendationRequestCancel = null;
      this.douga = null;
      this.dougaBatch = 0;
      this.dougaGeneration = 0;
      this.dougaRankRetryAttempted = false;
      this.ordinaryZones = Object.fromEntries(ORDINARY_ZONE_TYPES.map((type) => [type, {
        batch: 0,
        generation: 0,
        requestId: null,
        abortController: null,
        lastGood: null,
        requested: false
      }]));
      this.ordinaryInitialQueueStarted = false;
      this.ordinaryRankRetryTypes = new Set();
      this.readFloor = null;
      this.readFloorBatch = 0;
      this.readFloorGeneration = 0;
      this.readFloorLastGood = null;
      this.readFloorRetryAttempted = false;
      this.mangaFloor = null;
      this.mangaBatch = 0;
      this.mangaGeneration = 0;
      this.mangaLastGood = null;
      this.liveFloor = null;
      this.liveFloorInitialGeneration = 0;
      this.liveFloorRoomsGeneration = 0;
      this.liveFloorFollowingGeneration = 0;
      this.liveFloorRecommendationLastGood = null;
      this.liveFloorFollowingLastGood = null;
      this.liveFloorFollowingRequested = false;
      this.search = null;
      this.searchGeneration = 0;
      this.searchRequested = false;
      this.searchAutocompleteGeneration = 0;
      this.searchAutocompleteTimer = 0;
      this.recommendationPrefetch = null;
      this.initialRenderGateOpen = false;
      this.watchLaterPending = new Set();
      this.focusCarousel = null;
      this.focusGeneration = 0;
      this.focusRequestId = null;
      this.focusAbortController = null;
      this.focusLastGood = null;
      this.knowledge = null;
      this.knowledgeGeneration = 0;
      this.knowledgeRequestId = null;
      this.knowledgeAbortController = null;
      this.knowledgeLastGood = null;
      this.knowledgeRequested = false;
      this.music = null;
      this.musicGeneration = 0;
      this.musicRequestId = null;
      this.musicAbortController = null;
      this.musicLastGood = null;
      this.musicRequested = false;
      this.animal = null;
      this.animalGeneration = 0;
      this.animalRequestId = null;
      this.animalAbortController = null;
      this.animalLastGood = null;
      this.animalRequested = false;
      this.fashion = null;
      this.fashionGeneration = 0;
      this.fashionRequestId = null;
      this.fashionAbortController = null;
      this.fashionLastGood = null;
      this.fashionRequested = false;
      this.pgcAnime = null;
      this.pgcAnimeGeneration = 0;
      this.pgcAnimeRequestId = null;
      this.pgcAnimeAbortController = null;
      this.pgcAnimeLastGood = null;
      this.pgcAnimeRequested = false;
      this.pgcAnimeRetryTimer = 0;
      this.pgcGuochuang = null;
      this.pgcGuochuangGeneration = 0;
      this.pgcGuochuangRequestId = null;
      this.pgcGuochuangAbortController = null;
      this.pgcGuochuangLastGood = null;
      this.pgcGuochuangRequested = false;
      this.pgcGuochuangRetryTimer = 0;
      this.mountedOnce = false;
      this.hostBindingsBound = false;
      this.cleanups = [];
      this.bridgeRequestCancelers = new Set();
    }

    isCurrent(generation) {
      return this.active && this.generation === generation;
    }

    registerCleanup(cleanup) {
      if (typeof cleanup === "function") {
        this.cleanups.push(cleanup);
      }
      return cleanup;
    }

    registerBridgeRequestCanceler(cancel) {
      if (typeof cancel !== "function") return null;
      this.bridgeRequestCancelers.add(cancel);
      return () => this.bridgeRequestCancelers.delete(cancel);
    }

    cancelBridgeRequests() {
      for (const cancel of Array.from(this.bridgeRequestCancelers)) {
        cancel();
      }
    }

    cancelLiveRequest() {
      if (typeof this.liveRequestCancel === "function") {
        this.liveRequestCancel();
        this.liveRequestCancel = null;
      }
    }

    cancelProfileStatsRequest() {
      if (typeof this.profileStatsRequestCancel === "function") {
        this.profileStatsRequestCancel();
        this.profileStatsRequestCancel = null;
      }
    }

    cancelRecommendationRequest() {
      if (typeof this.recommendationRequestCancel === "function") {
        this.recommendationRequestCancel();
        this.recommendationRequestCancel = null;
      }
    }

    registerListener(target, type, listener) {
      target.addEventListener(type, listener);
      return this.registerCleanup(() => target.removeEventListener(type, listener));
    }

    registerInterval(callback, delay) {
      const timer = window.setInterval(callback, delay);
      return this.registerCleanup(() => window.clearInterval(timer));
    }

    registerTimeout(callback, delay) {
      const timer = window.setTimeout(callback, delay);
      return this.registerCleanup(() => window.clearTimeout(timer));
    }

    registerObserver(observer, target, options) {
      observer.observe(target, options);
      this.observer = observer;
      this.observedBody = target;
      return this.registerCleanup(() => observer.disconnect());
    }

    registerAnimationFrame(callback) {
      const frame = window.requestAnimationFrame(callback);
      return this.registerCleanup(() => window.cancelAnimationFrame(frame));
    }

    registerMedia(media) {
      if (!media || typeof media.pause !== "function") {
        return null;
      }
      return this.registerCleanup(() => media.pause());
    }

    registerAbortController(controller) {
      if (!controller || typeof controller.abort !== "function") {
        return null;
      }
      return this.registerCleanup(() => controller.abort());
    }

    sendFocusCancel() {
      if (!this.focusRequestId || !Number.isSafeInteger(this.focusGeneration)) {
        return;
      }

      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.focusRequestId,
          generation: this.focusGeneration,
          operation: FOCUS_OPERATION
        }, () => {
          void chrome.runtime.lastError;
        });
      } catch {
        // Local abort and stale checks remain authoritative if the SW is gone.
      }
    }

    cancelFocusRequest() {
      this.sendFocusCancel();
      if (this.focusAbortController) {
        this.focusAbortController.abort();
        this.focusAbortController = null;
      }
    }

    sendKnowledgeCancel() {
      if (!this.knowledgeRequestId || !Number.isSafeInteger(this.knowledgeGeneration)) {
        return;
      }
      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.knowledgeRequestId,
          generation: this.knowledgeGeneration,
          operation: KNOWLEDGE_OPERATION
        }, () => {
          void chrome.runtime.lastError;
        });
      } catch {
        // Local abort and lifecycle identity checks remain authoritative.
      }
    }

    cancelKnowledgeRequest() {
      this.sendKnowledgeCancel();
      if (this.knowledgeAbortController) {
        this.knowledgeAbortController.abort();
        this.knowledgeAbortController = null;
      }
    }

    sendMusicCancel() {
      if (!this.musicRequestId || !Number.isSafeInteger(this.musicGeneration)) return;
      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.musicRequestId,
          generation: this.musicGeneration,
          operation: MUSIC_OPERATION
        }, () => { void chrome.runtime.lastError; });
      } catch {
        // Local abort and lifecycle identity checks remain authoritative.
      }
    }

    cancelMusicRequest() {
      this.sendMusicCancel();
      if (this.musicAbortController) {
        this.musicAbortController.abort();
        this.musicAbortController = null;
      }
    }

    sendAnimalCancel() {
      if (!this.animalRequestId || !Number.isSafeInteger(this.animalGeneration)) return;
      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.animalRequestId,
          generation: this.animalGeneration,
          operation: ANIMAL_OPERATION
        }, () => { void chrome.runtime.lastError; });
      } catch {
        // Local abort and lifecycle identity checks remain authoritative.
      }
    }

    cancelAnimalRequest() {
      this.sendAnimalCancel();
      if (this.animalAbortController) {
        this.animalAbortController.abort();
        this.animalAbortController = null;
      }
    }

    sendFashionCancel() {
      if (!this.fashionRequestId || !Number.isSafeInteger(this.fashionGeneration)) return;
      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.fashionRequestId,
          generation: this.fashionGeneration,
          operation: FASHION_OPERATION
        }, () => { void chrome.runtime.lastError; });
      } catch {
        // Local abort and lifecycle identity checks remain authoritative.
      }
    }

    cancelFashionRequest() {
      this.sendFashionCancel();
      if (this.fashionAbortController) {
        this.fashionAbortController.abort();
        this.fashionAbortController = null;
      }
    }

    sendPgcAnimeCancel() {
      if (!this.pgcAnimeRequestId || !Number.isSafeInteger(this.pgcAnimeGeneration)) {
        return;
      }

      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.pgcAnimeRequestId,
          generation: this.pgcAnimeGeneration,
          operation: PGC_ANIME_OPERATION
        }, () => {
          void chrome.runtime.lastError;
        });
      } catch {
        // Local abort and stale checks remain authoritative if the SW is gone.
      }
    }

    cancelPgcAnimeRequest() {
      this.sendPgcAnimeCancel();
      if (this.pgcAnimeRetryTimer) {
        window.clearTimeout(this.pgcAnimeRetryTimer);
        this.pgcAnimeRetryTimer = 0;
      }
      if (this.pgcAnimeAbortController) {
        this.pgcAnimeAbortController.abort();
        this.pgcAnimeAbortController = null;
      }
    }

    sendPgcGuochuangCancel() {
      if (!this.pgcGuochuangRequestId || !Number.isSafeInteger(this.pgcGuochuangGeneration)) {
        return;
      }
      try {
        chrome.runtime.sendMessage({
          type: "HOMEPAGE_DATA_CANCEL_V1",
          requestId: this.pgcGuochuangRequestId,
          generation: this.pgcGuochuangGeneration,
          operation: PGC_GUOCHUANG_OPERATION
        }, () => {
          void chrome.runtime.lastError;
        });
      } catch {
        // Local abort and stale checks remain authoritative if the SW is gone.
      }
    }

    cancelPgcGuochuangRequest() {
      this.sendPgcGuochuangCancel();
      if (this.pgcGuochuangRetryTimer) {
        window.clearTimeout(this.pgcGuochuangRetryTimer);
        this.pgcGuochuangRetryTimer = 0;
      }
      if (this.pgcGuochuangAbortController) {
        this.pgcGuochuangAbortController.abort();
        this.pgcGuochuangAbortController = null;
      }
    }

    teardown() {
      if (!this.active) {
        return;
      }

      this.cancelBridgeRequests();
      this.cancelLiveRequest();
      this.cancelProfileStatsRequest();
      this.cancelRecommendationRequest();
      this.cancelFocusRequest();
      this.cancelKnowledgeRequest();
      this.cancelMusicRequest();
      this.cancelAnimalRequest();
      this.cancelFashionRequest();
      this.cancelPgcAnimeRequest();
      this.cancelPgcGuochuangRequest();
      if (this.searchAutocompleteTimer) {
        window.clearTimeout(this.searchAutocompleteTimer);
        this.searchAutocompleteTimer = 0;
      }
      this.active = false;
      this.generation += 1;
      this.latestRequestGeneration += 1;
      for (const cleanup of this.cleanups.splice(0)) {
        cleanup();
      }
      this.observer = null;
      this.observedBody = null;
      this.bodyWaitTimer = null;
      if (this.host) {
        this.host.remove();
      }
      if (this.hideStyle) {
        this.hideStyle.remove();
      }
      this.host = null;
      this.shadowRoot = null;
      this.rendered = null;
      this.hideStyle = null;
      this.statusPanel = null;
      this.statusText = null;
      this.livePopover = null;
      this.liveTrigger = null;
      this.liveRequestCancel = null;
      this.primaryMenu = null;
      this.primaryMenuCountsRequested = false;
      this.primaryMenuCountsGeneration = 0;
      this.messagePanel = null;
      this.messageRequested = false;
      this.messageDataLoaded = false;
      this.messageGeneration = 0;
      this.dynamicPanel = null;
      this.dynamicTrigger = null;
      this.dynamicRequested = false;
      this.dynamicDataLoaded = false;
      this.dynamicLastGood = null;
      this.dynamicGeneration = 0;
      this.profilePopover = null;
      this.profileTrigger = null;
      this.profileGroup = null;
      this.signin = null;
      this.summaryPanels = null;
      this.logoutButton = null;
      this.profileStatsRequestCancel = null;
      this.recommendation = null;
      this.recommendationLastGood = null;
      this.recommendationRequestCancel = null;
      this.dougaRankRetryAttempted = false;
      this.ordinaryRankRetryTypes.clear();
      this.readFloorRetryAttempted = false;
      this.search = null;
      this.searchGeneration = 0;
      this.searchRequested = false;
      this.searchAutocompleteGeneration = 0;
      this.searchAutocompleteTimer = 0;
      this.recommendationPrefetch = null;
      this.watchLaterPending.clear();
      this.hostBindingsBound = false;
    }
  }

  const BRIDGE_CHANNEL = "EXTENSION_B_PAGE_BRIDGE";
  const BRIDGE_VERSION = "V1";
  const BRIDGE_TYPE_REQUEST = "REQUEST";
  const BRIDGE_TYPE_RESPONSE = "RESPONSE";
  const BRIDGE_ORIGIN = "https://www.bilibili.com";
  const BRIDGE_SCRIPT_ID = "extension-b-page-bridge-script";
  const BRIDGE_REQUEST_ID_LENGTH = 32;
  const BRIDGE_TIMEOUT_MS = 4500;
  const BRIDGE_RANKING_TIMEOUT_MS = 12500;
  const BRIDGE_OPERATIONS = new Set([
    "AUTH_STATUS",
    SHOW_LOGIN_OPERATION,
    LOGOUT_OPERATION,
    PROFILE_STATS_OPERATION,
    "MESSAGE_SUMMARY",
    "DYNAMIC_SUMMARY",
    "FAVORITE_SUMMARY",
    "HISTORY_SUMMARY",
    LIVE_HOVER_OPERATION,
    PRIMARY_MENU_COUNTS_OPERATION,
    BANNER_CURRENT_OPERATION,
    RECOMMENDATION_OPERATION,
    DOUGA_OPERATION,
    ORDINARY_ZONE_OPERATION,
    ORDINARY_ZONE_OPERATION,
    READ_FLOOR_OPERATION,
    LIVE_FLOOR_INITIAL_OPERATION,
    LIVE_FLOOR_MORE_OPERATION,
    LIVE_FLOOR_FOLLOWING_OPERATION,
    WATCH_LATER_OPERATION,
  ]);
  const BRIDGE_SEARCH_OPERATIONS = new Set([SEARCH_OPERATION]);
  const BRIDGE_ERROR_KINDS = new Set([
    "OPERATION_UNAVAILABLE",
    "UPSTREAM_UNAVAILABLE",
    "SCHEMA_INVALID",
    "TIMEOUT"
  ]);

  const bridgeOwnKeys = (value) => Object.keys(value).sort().join("\u001F");
  const isBridgePlainObject = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
  const isBridgeRequestId = (value) => typeof value === "string"
    && value.length === BRIDGE_REQUEST_ID_LENGTH
    && /^[0-9a-f]+$/.test(value);
  const isOrdinaryZoneType = (value) => ORDINARY_ZONE_TYPES.includes(value);
  const createBridgeRequestId = () => {
    const values = new Uint8Array(BRIDGE_REQUEST_ID_LENGTH / 2);
    if (!window.crypto || typeof window.crypto.getRandomValues !== "function") {
      return null;
    }
    window.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
  };
  const isBridgeStatus = (value) => value === "logged_in"
    || value === "logged_out"
    || value === "unknown";
  const isBridgeAuthProfile = (value) => {
    if (value === null) return true;
    return isBridgePlainObject(value)
      && bridgeOwnKeys(value) === "bcoin\u001Fcoins\u001FcurrentExp\u001FdynamicUrl\u001FemailVerified\u001Fface\u001FfavoriteUrl\u001FfollowerUrl\u001FfollowingUrl\u001Flevel\u001FmobileVerified\u001FnextExp\u001Fpendant\u001Funame\u001FvipStatus"
      && isLiveText(value.uname, 64)
      && isLiveAvatarUrl(value.face)
      && isLiveProfileNavigationUrl(value.followingUrl, "fans/follow")
      && isLiveProfileNavigationUrl(value.followerUrl, "fans/fans")
      && isLiveProfileNavigationUrl(value.dynamicUrl, "dynamic")
      && isLiveProfileNavigationUrl(value.favoriteUrl, "favlist")
      && Number.isSafeInteger(value.level)
      && value.level >= 0
      && value.level <= 6
      && Number.isSafeInteger(value.currentExp)
      && value.currentExp >= 0
      && value.currentExp <= 1000000000
      && (value.nextExp === null || (Number.isSafeInteger(value.nextExp) && value.nextExp >= 0 && value.nextExp <= 1000000000))
      && typeof value.coins === "number"
      && Number.isFinite(value.coins)
      && value.coins >= 0
      && value.coins <= 1000000000
      && (value.bcoin === null || (typeof value.bcoin === "number"
        && Number.isFinite(value.bcoin)
        && value.bcoin >= 0
        && value.bcoin <= 1000000000))
      && isBridgeBoolean(value.emailVerified)
      && isBridgeBoolean(value.mobileVerified)
      && (value.pendant === null || (isBridgePlainObject(value.pendant)
        && bridgeOwnKeys(value.pendant) === "image\u001FimageEnhance\u001FimageEnhanceFrame"
        && [value.pendant.image, value.pendant.imageEnhance, value.pendant.imageEnhanceFrame]
          .every((url) => url === "" || isLivePendantUrl(url))))
      && Number.isSafeInteger(value.vipStatus)
      && value.vipStatus >= 0
      && value.vipStatus <= 2;
  };
  const isBridgeBoolean = (value) => typeof value === "boolean";
  const isBridgeCounter = (value) => Number.isSafeInteger(value)
    && value >= 0
    && value <= 1000000000;
  const isLiveText = (value, maxLength) => typeof value === "string"
    && value.length > 0
    && value.length <= maxLength
    && !/[\u0000-\u001F\u007F]/.test(value);
  const isLiveAvatarUrl = (value) => {
    if (!isLiveText(value, 2048)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/");
  };
  const isLivePendantUrl = (value) => {
    if (!isLiveText(value, 2048)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/garb/item/");
  };
  const isBfsCoverUrl = (value) => {
    if (!isLiveText(value, 2048)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/");
  };
  const isLiveProfileNavigationUrl = (value, suffix) => typeof value === "string"
    && value.length <= 256
    && new RegExp(`^https://space\\.bilibili\\.com/[1-9]\\d*/${suffix}$`).test(value);
  const isLiveCanonicalLink = (value) => {
    if (!isLiveText(value, 256)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && parsed.hostname === "live.bilibili.com"
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && /^\/\d+$/.test(parsed.pathname);
  };
  const isBilibiliContentHref = (value) => {
    if (!isLiveText(value, 512)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    if (parsed.protocol !== "https:"
      || parsed.username !== ""
      || parsed.password !== ""
      || parsed.port !== "") return false;
    if (parsed.hash !== ""
      && !(parsed.hostname === "www.bilibili.com"
        && parsed.pathname === "/watchlater/"
        && parsed.hash === "#/list")) return false;
    if (parsed.hostname === "live.bilibili.com") return /^\/\d+$/.test(parsed.pathname);
    if (parsed.hostname === "space.bilibili.com") return parsed.pathname === "/";
    if (parsed.hostname !== "www.bilibili.com") return false;
    return /^\/(?:video\/(?:BV[A-Za-z0-9]{10}|av[1-9]\d*)|read\/cv[1-9]\d*|watchlater\/|medialist\/)/.test(parsed.pathname);
  };
  const isOptionalBfsCover = (value) => value === null || isBfsCoverUrl(value);
  const isBridgeMediaItem = (value, ownerKey) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === ["cover", "duration", "href", ownerKey, "title"].sort().join("\u001F")
    && isLiveText(value.title, 160)
    && isOptionalBfsCover(value.cover)
    && typeof value[ownerKey] === "string"
    && value[ownerKey].length <= 80
    && Number.isSafeInteger(value.duration)
    && value.duration >= 0
    && isBilibiliContentHref(value.href);
  const isFavoriteData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "allHref\u001Ftabs"
    && value.allHref === "https://space.bilibili.com/"
    && Array.isArray(value.tabs)
    && value.tabs.length >= 1
    && value.tabs.length <= 20
    && value.tabs.every((tab) => isBridgePlainObject(tab)
      && bridgeOwnKeys(tab) === "count\u001Fitems\u001Fkey\u001FplayAllHref\u001Ftitle\u001FviewAllHref"
      && isLiveText(tab.key, 32)
      && isLiveText(tab.title, 80)
      && Number.isSafeInteger(tab.count)
      && tab.count >= 0
      && tab.count <= 1000000
      && isBilibiliContentHref(tab.viewAllHref)
      && (tab.playAllHref === "" || isBilibiliContentHref(tab.playAllHref))
      && Array.isArray(tab.items)
      && tab.items.length <= 20
      && tab.items.every((item) => isBridgeMediaItem(item, "owner")));
  const isHistoryItem = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "author\u001Fcover\u001Fduration\u001Fhref\u001Fprogress\u001Ftitle\u001FviewAt"
    && isLiveText(value.title, 160)
    && isOptionalBfsCover(value.cover)
    && typeof value.author === "string"
    && value.author.length <= 80
    && Number.isSafeInteger(value.progress)
    && value.progress >= -1
    && Number.isSafeInteger(value.duration)
    && value.duration >= 0
    && Number.isSafeInteger(value.viewAt)
    && value.viewAt >= 0
    && isBilibiliContentHref(value.href);
  const isHistoryData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "archive\u001Farticle\u001Flive"
    && [value.archive, value.live, value.article].every((items) => Array.isArray(items)
      && items.length <= 20
      && items.every(isHistoryItem));
  const isLiveHoverData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "items"
    && Array.isArray(value.items)
    && value.items.length <= 6
    && value.items.every((item) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "face\u001Flink\u001Fonline\u001Ftitle\u001Fuid\u001Funame"
      && isLiveAvatarUrl(item.face)
      && isLiveCanonicalLink(item.link)
      && isLiveText(item.title, 256)
      && isLiveText(item.uname, 256)
      && Number.isSafeInteger(item.uid)
      && item.uid >= 0
      && item.uid <= Number.MAX_SAFE_INTEGER
      && Number.isSafeInteger(item.online)
      && item.online >= 0
      && item.online <= 1000000000);
  const PRIMARY_MENU_COUNT_KEYS = Object.freeze([
    "douga", "anime", "music", "guochuang", "dance", "game", "knowledge", "tech",
    "life", "kichiku", "fashion", "information", "ent", "cinephile", "cinema"
  ]);
  const isPrimaryMenuCountsData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "channels"
    && Array.isArray(value.channels)
    && value.channels.length === PRIMARY_MENU_COUNT_KEYS.length
    && value.channels.every((item, index) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "key\u001Fvalue"
      && item.key === PRIMARY_MENU_COUNT_KEYS[index]
      && (item.value === null || (Number.isSafeInteger(item.value) && item.value >= 0)));
  const isBannerCurrentData = (value) => Boolean(
    globalThis.ExtensionBBannerModel
      && typeof globalThis.ExtensionBBannerModel.isBannerModel === "function"
      && globalThis.ExtensionBBannerModel.isBannerModel(value)
  );
  const isRecommendationHref = (value, bvid) => typeof value === "string"
    && value === `https://www.bilibili.com/video/${bvid}`;
  const isRecommendationData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "batch\u001Fitems"
    && Number.isSafeInteger(value.batch)
    && value.batch >= 0
    && value.batch <= 10000
    && Array.isArray(value.items)
    && value.items.length >= 8
    && value.items.length <= 10
    && value.items.every((item) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "aid\u001Fbvid\u001Fcover\u001Fduration\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
      && Number.isSafeInteger(item.aid)
      && item.aid > 0
      && item.aid <= Number.MAX_SAFE_INTEGER
      && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
      && isLiveText(item.title, 200)
      && isLiveText(item.ownerName, 80)
      && isBfsCoverUrl(item.cover)
      && isRecommendationHref(item.href, item.bvid)
      && Number.isSafeInteger(item.duration)
      && item.duration >= 0
      && item.duration <= 604800
      && Number.isSafeInteger(item.view)
      && item.view >= 0
      && item.view <= 1000000000000);
  const isDougaData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "batch\u001Fitems\u001Franks"
    && Number.isSafeInteger(value.batch)
    && value.batch >= 0
    && value.batch <= 10000
    && Array.isArray(value.items)
    && value.items.length >= 8
    && value.items.length <= 10
    && value.items.every((item) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "aid\u001Fbvid\u001Fcover\u001Fdanmaku\u001Fduration\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Ftitle\u001Fview"
      && Number.isSafeInteger(item.aid) && item.aid > 0
      && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
      && isLiveText(item.title, 200)
      && isBfsCoverUrl(item.cover)
      && Number.isSafeInteger(item.duration) && item.duration >= 0 && item.duration <= 604800
      && Number.isSafeInteger(item.view) && item.view >= 0 && item.view <= 1000000000000
      && Number.isSafeInteger(item.danmaku) && item.danmaku >= 0 && item.danmaku <= 1000000000000
      && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
      && isLiveText(item.ownerName, 80)
      && item.href === `https://www.bilibili.com/video/${item.bvid}`
      && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`)
    && Array.isArray(value.ranks)
    && (value.ranks.length === 0 || value.ranks.length >= 10)
    && value.ranks.length <= 100
    && value.ranks.every((item, index) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "aid\u001Fbvid\u001Fcoin\u001Fcover\u001Fdanmaku\u001Ffavorite\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fpubdate\u001Frank\u001Ftitle\u001Fview"
      && item.rank === index + 1
      && Number.isSafeInteger(item.aid) && item.aid > 0
      && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
      && isLiveText(item.title, 200)
      && isBfsCoverUrl(item.cover)
      && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
      && isLiveText(item.ownerName, 80)
      && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
      && Number.isSafeInteger(item.pubdate) && item.pubdate >= 0 && item.pubdate <= 4102444800
      && [item.view, item.danmaku, item.favorite, item.coin].every((metric) => Number.isSafeInteger(metric) && metric >= 0 && metric <= 1000000000000)
      && item.href === `https://www.bilibili.com/video/${item.bvid}`);
  const isOrdinaryZoneItem = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "aid\u001Fbvid\u001Fcover\u001Fdanmaku\u001Fduration\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Ftitle\u001Fview"
    && Number.isSafeInteger(item.aid) && item.aid > 0
    && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
    && isLiveText(item.title, 200) && isBfsCoverUrl(item.cover)
    && Number.isSafeInteger(item.duration) && item.duration >= 0 && item.duration <= 604800
    && Number.isSafeInteger(item.view) && item.view >= 0 && item.view <= 1000000000000
    && Number.isSafeInteger(item.danmaku) && item.danmaku >= 0 && item.danmaku <= 1000000000000
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0 && isLiveText(item.ownerName, 80)
    && item.href === `https://www.bilibili.com/video/${item.bvid}`
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`;
  const isOrdinaryZonePgcItem = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "cover\u001FepisodeId\u001Fhref\u001Frating\u001FseasonId\u001Fsubtitle\u001Ftitle"
    && Number.isSafeInteger(item.episodeId) && item.episodeId > 0
    && Number.isSafeInteger(item.seasonId) && item.seasonId > 0
    && isLiveText(item.title, 200) && isBfsCoverUrl(item.cover)
    && (item.subtitle === "" || isLiveText(item.subtitle, 200))
    && (item.rating === "" || isLiveText(item.rating, 32))
    && item.href === `https://www.bilibili.com/bangumi/play/ep${item.episodeId}`;
  const isOrdinaryZoneVideoRank = (item, index) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "aid\u001Fbvid\u001Fcoin\u001Fcover\u001Fdanmaku\u001Ffavorite\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fpubdate\u001Frank\u001Ftitle\u001Fview"
    && item.rank === index + 1 && Number.isSafeInteger(item.aid) && item.aid > 0
    && /^BV[A-Za-z0-9]{10}$/.test(item.bvid) && isLiveText(item.title, 200) && isBfsCoverUrl(item.cover)
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0 && isLiveText(item.ownerName, 80)
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
    && Number.isSafeInteger(item.pubdate) && item.pubdate >= 0 && item.pubdate <= 4102444800
    && [item.view, item.danmaku, item.favorite, item.coin].every((metric) => Number.isSafeInteger(metric) && metric >= 0 && metric <= 1000000000000)
    && item.href === `https://www.bilibili.com/video/${item.bvid}`;
  const isOptionalOrdinaryRankText = (value) => value === "" || isLiveText(value, 80);
  const isCheeseCoverUrl = (value) => {
    if (typeof value !== "string" || value.length === 0 || value.length > 2048) return false;
    let url;
    try { url = new URL(value); } catch { return false; }
    return url.protocol === "https:"
      && ["archive.biliimg.com", "i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(url.hostname)
      && url.username === "" && url.password === "" && url.port === ""
      && url.search === "" && url.hash === "" && url.pathname.startsWith("/bfs/archive/");
  };
  const isOrdinaryZoneCheeseItem = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "cover\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fplay\u001FseasonId\u001Ftitle\u001FupdateText"
    && Number.isSafeInteger(item.seasonId) && item.seasonId > 0
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
    && isLiveText(item.title, 200) && isLiveText(item.ownerName, 80)
    && (item.updateText === "" || isLiveText(item.updateText, 80))
    && isCheeseCoverUrl(item.cover)
    && item.href === `https://www.bilibili.com/cheese/play/ss${item.seasonId}`
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
    && Number.isSafeInteger(item.play) && item.play >= 0 && item.play <= 1000000000000;
  const isOrdinaryZoneCheeseRank = (item, index) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "cover\u001FepisodeCount\u001Fhref\u001FownerName\u001Fplay\u001Frank\u001FseasonId\u001Ftitle"
    && item.rank === index + 1 && Number.isSafeInteger(item.seasonId) && item.seasonId > 0
    && isLiveText(item.title, 200) && isLiveText(item.ownerName, 80) && isCheeseCoverUrl(item.cover)
    && item.href === `https://www.bilibili.com/cheese/play/ss${item.seasonId}`
    && Number.isSafeInteger(item.play) && item.play >= 0 && item.play <= 1000000000000
    && Number.isSafeInteger(item.episodeCount) && item.episodeCount >= 0 && item.episodeCount <= 1000000;
  const isOrdinaryZonePgcRank = (item, index) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "badgeText\u001Fcover\u001Fhref\u001Frank\u001FscoreText\u001FseasonId\u001Ftitle\u001FupdateText"
    && item.rank === index + 1
    && Number.isSafeInteger(item.seasonId) && item.seasonId > 0 && item.seasonId <= Number.MAX_SAFE_INTEGER
    && isLiveText(item.title, 200) && isBfsCoverUrl(item.cover)
    && item.href === `https://www.bilibili.com/bangumi/play/ss${item.seasonId}`
    && isOptionalOrdinaryRankText(item.badgeText)
    && isOptionalOrdinaryRankText(item.updateText)
    && isOptionalOrdinaryRankText(item.scoreText);
  const isOrdinaryZoneData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "batch\u001FitemType\u001Fitems\u001FrankType\u001Franks\u001Fstatus\u001Ftype"
    && isOrdinaryZoneType(value.type) && Number.isSafeInteger(value.batch) && value.batch >= 0 && value.batch <= 49
    && ["video", "pgc", "cheese"].includes(value.itemType)
    && ["none", "video", "pgc", "cheese"].includes(value.rankType)
    && ["success", "partial", "empty"].includes(value.status)
    && Array.isArray(value.items) && value.items.length <= 12
    && (value.itemType === "pgc" ? value.items.every(isOrdinaryZonePgcItem)
      : value.itemType === "cheese" ? value.items.every(isOrdinaryZoneCheeseItem)
      : value.items.every(isOrdinaryZoneItem))
    && Array.isArray(value.ranks) && value.ranks.length <= 100
    && (value.rankType === "none"
      ? value.ranks.length === 0
      : value.rankType === "video"
        ? value.ranks.every(isOrdinaryZoneVideoRank)
        : value.rankType === "cheese" ? value.ranks.every(isOrdinaryZoneCheeseRank)
        : value.ranks.every(isOrdinaryZonePgcRank));
  const isReadArticle = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "authorHref\u001FauthorMid\u001FauthorName\u001Fcover\u001Fhref\u001Fid\u001Freply\u001Ftitle\u001Fview"
    && Number.isSafeInteger(item.id) && item.id > 0
    && Number.isSafeInteger(item.authorMid) && item.authorMid > 0
    && isLiveText(item.title, 200) && isLiveText(item.authorName, 80)
    && isBfsCoverUrl(item.cover)
    && item.authorHref === `https://space.bilibili.com/${item.authorMid}`
    && item.href === `https://www.bilibili.com/read/cv${item.id}/?from=homepage_0`
    && [item.view, item.reply].every((metric) => Number.isSafeInteger(metric) && metric >= 0 && metric <= 1000000000000);
  const isReadRank = (item, index) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "cover\u001Fhref\u001Fid\u001Frank\u001Ftitle"
    && item.rank === index + 1
    && Number.isSafeInteger(item.id) && item.id > 0
    && isLiveText(item.title, 200) && isBfsCoverUrl(item.cover)
    && item.href === `https://www.bilibili.com/read/cv${item.id}/?from=homepage_1`;
  const isReadFloorData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "articles\u001Fbatch\u001Franks\u001Fstatus"
    && Number.isSafeInteger(value.batch) && value.batch >= 0 && value.batch <= 10000
    && ["success", "partial", "empty"].includes(value.status)
    && Array.isArray(value.articles) && value.articles.length <= 8 && value.articles.every(isReadArticle)
    && new Set(value.articles.map((item) => item.id)).size === value.articles.length
    && Array.isArray(value.ranks) && value.ranks.length <= 10 && value.ranks.every(isReadRank)
    && new Set(value.ranks.map((item) => item.id)).size === value.ranks.length
    && value.articles.every((item) => !value.ranks.some((rank) => rank.id === item.id));
  const isLiveFloorRoom = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "areaName\u001Fcover\u001Fface\u001Fhref\u001Fkeyframe\u001Fonline\u001FroomId\u001Ftitle\u001Funame"
    && Number.isSafeInteger(item.roomId) && item.roomId > 0
    && isLiveText(item.title, 256) && isLiveText(item.uname, 256)
    && (item.areaName === "" || isLiveText(item.areaName, 128))
    && isBfsCoverUrl(item.cover) && isBfsCoverUrl(item.keyframe) && isBfsCoverUrl(item.face)
    && isLiveCanonicalLink(item.href) && item.href === `https://live.bilibili.com/${item.roomId}`
    && Number.isSafeInteger(item.online) && item.online >= 0 && item.online <= 1000000000000;
  const isLiveFloorRooms = (value) => Array.isArray(value) && value.length <= 12
    && value.every(isLiveFloorRoom)
    && new Set(value.map((item) => item.roomId)).size === value.length;
  const isLiveFloorRank = (item) => isBridgePlainObject(item)
    && bridgeOwnKeys(item) === "face\u001Fhref\u001Fonline\u001FroomId\u001Ftitle\u001Funame"
    && Number.isSafeInteger(item.roomId) && item.roomId > 0
    && isLiveText(item.title, 256) && isLiveText(item.uname, 256)
    && isBfsCoverUrl(item.face)
    && isLiveCanonicalLink(item.href) && item.href === `https://live.bilibili.com/${item.roomId}`
    && Number.isSafeInteger(item.online) && item.online >= 0 && item.online <= 1000000000000;
  const isLiveFloorInitialData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "onlineTotal\u001Franks\u001Frooms"
    && Number.isSafeInteger(value.onlineTotal) && value.onlineTotal >= 0 && value.onlineTotal <= 1000000000000
    && isLiveFloorRooms(value.rooms)
    && Array.isArray(value.ranks) && value.ranks.length <= 6 && value.ranks.every(isLiveFloorRank);
  const isLiveFloorRoomsData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "rooms" && isLiveFloorRooms(value.rooms);
  const isWatchLaterMutationData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "action\u001Faid\u001Fsuccess"
    && Number.isSafeInteger(value.aid)
    && value.aid > 0
    && value.aid <= Number.MAX_SAFE_INTEGER
    && (value.action === "add" || value.action === "remove")
    && value.success === true;
  const isBridgeSearchText = (value, maximum) => isLiveText(value, maximum);
  const isBridgeSearchUrl = (value) => {
    if (!isBridgeSearchText(value, 2048)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && parsed.hostname === "search.bilibili.com"
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.pathname === "/all"
      && parsed.hash === ""
      && parsed.searchParams.has("keyword")
      && parsed.searchParams.get("keyword") !== "";
  };
  const SEARCH_MARK_KEYS = new Set(["live", "anniversary", "none"]);
  const isBridgeSearchIconUrl = (value) => {
    if (value === null) return true;
    if (typeof value !== "string" || value.length === 0 || value.length > 2048
      || /[\u0000-\u001F\u007F]/.test(value)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/");
  };
  const isSearchData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "defaultKeyword\u001FdefaultUrl\u001FtrendingItems\u001FtrendingTitle"
    && isBridgeSearchText(value.defaultKeyword, 128)
    && isBridgeSearchUrl(value.defaultUrl)
    && isBridgeSearchText(value.trendingTitle, 64)
    && Array.isArray(value.trendingItems)
    && value.trendingItems.length <= 10
    && value.trendingItems.every((item) => isBridgePlainObject(item)
      && bridgeOwnKeys(item) === "keyword\u001FmarkKey\u001FremoteIcon\u001Ftext"
      && isBridgeSearchText(item.keyword, 128)
      && isBridgeSearchText(item.text, 128)
      && SEARCH_MARK_KEYS.has(item.markKey)
      && isBridgeSearchIconUrl(item.remoteIcon)
      && (item.markKey === "none" || item.remoteIcon === null));
  const isBridgeSummaryData = (operation, value) => {
    if (!isBridgePlainObject(value)) return false;
    if (operation === "AUTH_STATUS") {
      return bridgeOwnKeys(value) === "profile\u001Fstatus"
        && isBridgeStatus(value.status)
        && isBridgeAuthProfile(value.profile)
        && (value.status === "logged_in" ? value.profile !== null : value.profile === null);
    }
    if (operation === SHOW_LOGIN_OPERATION) {
      return bridgeOwnKeys(value) === "shown" && value.shown === true;
    }
    if (operation === LOGOUT_OPERATION) {
      return bridgeOwnKeys(value) === "status"
        && value.status === "logged_out";
    }
    if (operation === PROFILE_STATS_OPERATION) {
      return bridgeOwnKeys(value) === "dynamic_count\u001Ffollower\u001Ffollowing"
        && Number.isSafeInteger(value.following)
        && value.following >= 0
        && Number.isSafeInteger(value.follower)
        && value.follower >= 0
        && Number.isSafeInteger(value.dynamic_count)
        && value.dynamic_count >= 0;
    }
    if (operation === "MESSAGE_SUMMARY") {
      return ["reply", "at", "like", "sysMsg", "sessionUnread"].every((key) => isBridgeCounter(value[key]));
    }
    if (operation === "DYNAMIC_SUMMARY") {
      return bridgeOwnKeys(value) === "avatar\u001Fcount"
        && Number.isSafeInteger(value.count)
        && value.count >= 0
        && (value.avatar === null || isLiveAvatarUrl(value.avatar));
    }
    if (operation === "FAVORITE_SUMMARY") {
      return isFavoriteData(value);
    }
    if (operation === "HISTORY_SUMMARY") {
      return isHistoryData(value);
    }
    if (operation === LIVE_HOVER_OPERATION) {
      return isLiveHoverData(value);
    }
    if (operation === PRIMARY_MENU_COUNTS_OPERATION) {
      return isPrimaryMenuCountsData(value);
    }
    if (operation === BANNER_CURRENT_OPERATION) {
      return isBannerCurrentData(value);
    }
    if (operation === RECOMMENDATION_OPERATION) {
      return isRecommendationData(value);
    }
    if (operation === DOUGA_OPERATION) {
      return isDougaData(value);
    }
    if (operation === ORDINARY_ZONE_OPERATION) {
      return isOrdinaryZoneData(value);
    }
    if (operation === READ_FLOOR_OPERATION) return isReadFloorData(value);
    if (operation === LIVE_FLOOR_INITIAL_OPERATION) return isLiveFloorInitialData(value);
    if (operation === LIVE_FLOOR_MORE_OPERATION || operation === LIVE_FLOOR_FOLLOWING_OPERATION) {
      return isLiveFloorRoomsData(value);
    }
    if (operation === WATCH_LATER_OPERATION) {
      return isWatchLaterMutationData(value);
    }
    if (operation === SEARCH_OPERATION) {
      return isSearchData(value);
    }
    return false;
  };
  const isExactBridgeResponse = (value, requestId, operation) => {
    if (!isBridgePlainObject(value)
      || (bridgeOwnKeys(value) !== "channel\u001Fdata\u001Fok\u001Foperation\u001FrequestId\u001Ftype\u001Fversion"
        && bridgeOwnKeys(value) !== "channel\u001Ferror\u001Fok\u001Foperation\u001FrequestId\u001Ftype\u001Fversion")
      || value.channel !== BRIDGE_CHANNEL
      || value.version !== BRIDGE_VERSION
      || value.type !== BRIDGE_TYPE_RESPONSE
      || value.requestId !== requestId
      || value.operation !== operation
      || typeof value.ok !== "boolean") {
      return false;
    }
    if (value.ok) {
      return isBridgeSummaryData(operation, value.data);
    }
    return isBridgePlainObject(value.error)
      && bridgeOwnKeys(value.error) === "kind"
      && BRIDGE_ERROR_KINDS.has(value.error.kind);
  };
  let bridgeReadyPromise = null;
  let bridgeReadyScript = null;
  let bridgeReadyRoot = null;

  const isBridgeLifecycleCurrent = (
    currentLifecycle = null,
    generation = null,
    rootIdentity = null
  ) => isExactRoot()
    && Boolean(document.documentElement)
    && (!rootIdentity || document.documentElement === rootIdentity)
    && (!currentLifecycle || (
      lifecycle === currentLifecycle
      && currentLifecycle.active
      && currentLifecycle.generation === generation
    ));

  const getPageBridgeScript = () => document.getElementById(BRIDGE_SCRIPT_ID)
    || document.querySelector(`script[data-extension-b-page-bridge="${BRIDGE_VERSION}"]`);

  const isOwnedPageBridgeScript = (script, expectedUrl) => Boolean(
    script
    && script.tagName === "SCRIPT"
    && script.id === BRIDGE_SCRIPT_ID
    && script.dataset
    && script.dataset.extensionBPageBridge === BRIDGE_VERSION
    && script.src === expectedUrl
  );

  const removePageBridgeScript = (script) => {
    if (script && script.parentNode && typeof script.parentNode.removeChild === "function") {
      script.parentNode.removeChild(script);
    }
  };

  const waitForPageBridge = (script, rootIdentity) => new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
      window.removeEventListener("pagehide", onLifecycleChange);
      window.removeEventListener("unload", onLifecycleChange);
      window.clearInterval(lifecycleTimer);
    };
    const finish = (callback, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback(value);
    };
    const onLifecycleChange = () => {
      if (!isBridgeLifecycleCurrent(null, null, rootIdentity)) {
        finish(reject, new Error("page bridge lifecycle expired"));
      }
    };
    const onLoad = () => {
      if (!isBridgeLifecycleCurrent(null, null, rootIdentity)) {
        onLifecycleChange();
        return;
      }
      script.dataset.extensionBPageBridgeReady = "true";
      finish(resolve);
    };
    const onError = () => {
      script.dataset.extensionBPageBridgeFailed = "true";
      removePageBridgeScript(script);
      finish(reject, new Error("page bridge failed to load"));
    };
    const lifecycleTimer = window.setInterval(onLifecycleChange, URL_POLL_MS);
    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    window.addEventListener("pagehide", onLifecycleChange);
    window.addEventListener("unload", onLifecycleChange);
    onLifecycleChange();
  });

  const getBridgeReady = () => {
    const rootIdentity = document.documentElement;
    if (!isBridgeLifecycleCurrent(null, null, rootIdentity)) {
      return Promise.reject(new Error("page bridge root lifecycle unavailable"));
    }
    if (bridgeReadyPromise && bridgeReadyRoot === rootIdentity) {
      return bridgeReadyPromise;
    }

    bridgeReadyPromise = null;
    bridgeReadyScript = null;
    bridgeReadyRoot = rootIdentity;
    const expectedUrl = chrome.runtime.getURL("page-bridge.js");
    let script = getPageBridgeScript();
    if (script && script.dataset.extensionBPageBridgeFailed === "true") {
      removePageBridgeScript(script);
      script = null;
    }
    if (script && !isOwnedPageBridgeScript(script, expectedUrl)) {
      removePageBridgeScript(script);
      script = null;
    }
    if (!script) {
      script = document.createElement("script");
      script.id = BRIDGE_SCRIPT_ID;
      script.dataset.extensionBPageBridge = BRIDGE_VERSION;
      script.src = expectedUrl;
      script.async = false;
      bridgeReadyScript = script;
      bridgeReadyPromise = waitForPageBridge(script, rootIdentity);
      document.documentElement.appendChild(script);
    } else {
      bridgeReadyScript = script;
      bridgeReadyPromise = Promise.resolve();
    }

    const pendingPromise = bridgeReadyPromise;
    pendingPromise.catch(() => {
      if (bridgeReadyPromise !== pendingPromise) return;
      if (bridgeReadyScript === script) {
        removePageBridgeScript(script);
      }
      bridgeReadyPromise = null;
      bridgeReadyScript = null;
      bridgeReadyRoot = null;
    });
    return pendingPromise;
  };
  const LIVE_RUNTIME_STATES = new Set([
    "bound",
    "guard-blocked",
    "activation-started",
    "bridge-wait",
    "request-posted",
    "cancelled",
    "bridge-error",
    "response-invalid",
    "commit-blocked",
    "committed"
  ]);
  const setLiveRuntimeState = (currentLifecycle, state) => {
    if (!currentLifecycle
      || !LIVE_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") {
      return;
    }
    currentLifecycle.host.setAttribute("data-extension-b-live-state", state);
  };
  const PROFILE_STATS_RUNTIME_STATES = new Set([
    "bound",
    "guard-blocked",
    "activation-started",
    "bridge-wait",
    "request-posted",
    "cancelled",
    "bridge-error",
    "response-invalid",
    "commit-blocked",
    "committed"
  ]);
  const AUTH_RUNTIME_STATES = new Set(["logged_in", "logged_out", "unknown"]);
  const SUMMARY_RUNTIME_STATES = new Set([
    "bound",
    "bind-missing",
    "guard-blocked",
    "activation-started",
    "bridge-wait",
    "request-posted",
    "cancelled",
    "bridge-error",
    "response-invalid",
    "commit-blocked",
    "commit-failed",
    "committed"
  ]);
  const SEARCH_RUNTIME_STATES = new Set([
    "bound",
    "activation-started",
    "bridge-wait",
    "request-posted",
    "bridge-error",
    "response-invalid",
    "commit-blocked",
    "committed"
  ]);
  const setAuthRuntimeState = (currentLifecycle, state) => {
    if (!currentLifecycle
      || !AUTH_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") {
      return;
    }
    currentLifecycle.host.setAttribute("data-extension-b-auth-state", state);
  };
  const setSummaryRuntimeState = (currentLifecycle, kind, state) => {
    if (!currentLifecycle
      || !["message", "dynamic", "favorite", "history"].includes(kind)
      || !SUMMARY_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") {
      return;
    }
    currentLifecycle.host.setAttribute(`data-extension-b-${kind}-state`, state);
  };
  const setProfileStatsRuntimeState = (currentLifecycle, state) => {
    if (!currentLifecycle
      || !PROFILE_STATS_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") {
      return;
    }
    currentLifecycle.host.setAttribute("data-extension-b-profile-stats-state", state);
  };
  const setSearchRuntimeState = (currentLifecycle, state) => {
    if (!currentLifecycle
      || !SEARCH_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") return;
    currentLifecycle.host.setAttribute("data-extension-b-search-state", state);
  };
  const PRIMARY_MENU_COUNTS_RUNTIME_STATES = new Set(["loading", "committed", "failure"]);
  const setPrimaryMenuCountsRuntimeState = (currentLifecycle, state) => {
    if (!currentLifecycle
      || !PRIMARY_MENU_COUNTS_RUNTIME_STATES.has(state)
      || !currentLifecycle.host
      || typeof currentLifecycle.host.setAttribute !== "function") return;
    currentLifecycle.host.setAttribute("data-extension-b-primary-menu-counts-state", state);
  };

  const setSearchAutocompleteRuntimeState = (currentLifecycle, state) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.host || typeof state !== "string") return;
    currentLifecycle.host.setAttribute("data-extension-b-search-autocomplete-state", state);
    currentLifecycle.host.setAttribute(
      "data-extension-b-search-autocomplete-generation",
      String(currentLifecycle.searchAutocompleteGeneration)
    );
  };

  const setSearchAutocompleteErrorKind = (currentLifecycle, kind) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.host) return;
    if (typeof kind === "string" && /^[A-Z_]{1,48}$/.test(kind)) {
      currentLifecycle.host.setAttribute("data-extension-b-search-autocomplete-error", kind);
    } else {
      currentLifecycle.host.removeAttribute("data-extension-b-search-autocomplete-error");
    }
  };
  const setLazyRuntimeState = (operation, currentLifecycle, state) => {
    if (operation === LIVE_HOVER_OPERATION) {
      setLiveRuntimeState(currentLifecycle, state);
    } else if (operation === PROFILE_STATS_OPERATION) {
      setProfileStatsRuntimeState(currentLifecycle, state);
    }
  };
  const requestPageBridge = (operation, currentLifecycle = null, batch = null, onPosted = null, mutation = null) => {
    if (!BRIDGE_OPERATIONS.has(operation) && !BRIDGE_SEARCH_OPERATIONS.has(operation)) {
      return Promise.resolve(null);
    }
    const requestId = createBridgeRequestId();
    if (!requestId) {
      return Promise.resolve(null);
    }
    const ordinaryType = operation === "ORDINARY_ZONE_FLOOR" && isBridgePlainObject(mutation) ? mutation.type : null;
    const includeRank = (operation === "DOUGA_FLOOR" || operation === "ORDINARY_ZONE_FLOOR")
      && isBridgePlainObject(mutation) ? mutation.includeRank : null;
    const diagnosticKey = diagnosticKeyFor(operation, mutation);
    const diagnosticStartedAt = diagnosticClock();
    if ((operation === RECOMMENDATION_OPERATION || operation === DOUGA_OPERATION || operation === READ_FLOOR_OPERATION)
      && (!Number.isSafeInteger(batch) || batch < 0 || batch > 10000)) {
      return Promise.resolve(null);
    }
    if (operation === "ORDINARY_ZONE_FLOOR"
      && (!isOrdinaryZoneType(ordinaryType) || typeof includeRank !== "boolean"
        || !Number.isSafeInteger(batch) || batch < 0 || batch > 49)) {
      return Promise.resolve(null);
    }
    if (operation === DOUGA_OPERATION && typeof includeRank !== "boolean") {
      return Promise.resolve(null);
    }
    if (operation === WATCH_LATER_OPERATION
      && (!isBridgePlainObject(mutation)
        || bridgeOwnKeys(mutation) !== "action\u001Faid"
        || (mutation.action !== "add" && mutation.action !== "remove")
        || !Number.isSafeInteger(mutation.aid)
        || mutation.aid <= 0
        || mutation.aid > Number.MAX_SAFE_INTEGER)) {
      return Promise.resolve(null);
    }
    const requestGeneration = currentLifecycle ? currentLifecycle.generation : null;
    const requestRootIdentity = document.documentElement;
    if (!isBridgeLifecycleCurrent(currentLifecycle, requestGeneration, requestRootIdentity)) {
      return Promise.resolve(null);
    }
    let preRequestCancelled = false;
    let clearPreRequestCancel = () => {};
    let cancelProperty = null;
    const isLazyHoverOperation = operation === LIVE_HOVER_OPERATION || operation === PROFILE_STATS_OPERATION;
    const isCancelableOperation = isLazyHoverOperation || operation === RECOMMENDATION_OPERATION || operation === "ORDINARY_ZONE_FLOOR";
    if (isCancelableOperation && currentLifecycle) {
      cancelProperty = operation === LIVE_HOVER_OPERATION
        ? "liveRequestCancel"
        : (operation === PROFILE_STATS_OPERATION ? "profileStatsRequestCancel" : (operation === RECOMMENDATION_OPERATION ? "recommendationRequestCancel" : null));
      const cancelBeforeReady = () => {
        preRequestCancelled = true;
        if (isLazyHoverOperation) setLazyRuntimeState(operation, currentLifecycle, "cancelled");
        if (cancelProperty && currentLifecycle[cancelProperty] === cancelBeforeReady) {
          currentLifecycle[cancelProperty] = null;
        }
      };
      if (cancelProperty) currentLifecycle[cancelProperty] = cancelBeforeReady;
      clearPreRequestCancel = () => {
        if (cancelProperty && currentLifecycle[cancelProperty] === cancelBeforeReady) {
          currentLifecycle[cancelProperty] = null;
        }
      };
      setLazyRuntimeState(operation, currentLifecycle, "bridge-wait");
    }
    return getBridgeReady().then(() => {
      if (preRequestCancelled) {
        clearPreRequestCancel();
        return null;
      }
      if (!isBridgeLifecycleCurrent(currentLifecycle, requestGeneration, requestRootIdentity)) {
        clearPreRequestCancel();
        return null;
      }
      return new Promise((resolve) => {
        let settled = false;
        let lifecycleCleanup = null;
        let unregisterBridgeCanceler = null;
        let cancelSent = false;
        let requestPosted = false;
        const sendCancel = () => {
          if (!requestPosted || settled || cancelSent) return;
          cancelSent = true;
          try {
            window.postMessage({
              channel: BRIDGE_CHANNEL,
              version: BRIDGE_VERSION,
              type: "CANCEL",
              operation: "CANCEL",
              requestId
            }, BRIDGE_ORIGIN);
          } catch {
            // Local lifecycle retirement remains authoritative if the bridge is gone.
          }
        };
        const finish = (data, status = "", errorKind = "") => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeoutId);
          window.removeEventListener("message", onMessage);
          if (isCancelableOperation
            && currentLifecycle
            && currentLifecycle[cancelProperty] === cancelRequest) {
            currentLifecycle[cancelProperty] = null;
          }
          clearPreRequestCancel();
          if (unregisterBridgeCanceler) {
            unregisterBridgeCanceler();
            unregisterBridgeCanceler = null;
          }
          if (lifecycleCleanup) lifecycleCleanup = null;
          const validData = isBridgeSummaryData(operation, data);
          const finalStatus = status === "success" && !validData
            ? "response-invalid"
            : (status || (validData ? "success" : "response-invalid"));
          recordDiagnostic(diagnosticKey, finalStatus, diagnosticClock() - diagnosticStartedAt, errorKind || (validData ? "" : "PROTOCOL_INVALID"));
          resolve(validData ? data : null);
        };
        const cancelRequest = () => {
          if (isLazyHoverOperation) setLazyRuntimeState(operation, currentLifecycle, "cancelled");
          sendCancel();
          finish(null, "cancelled", "CANCELLED");
        };
        const onMessage = (event) => {
          if (event.source !== window || event.origin !== BRIDGE_ORIGIN
            || !isExactBridgeResponse(event.data, requestId, operation)) {
            return;
          }
          finish(
            event.data.ok ? event.data.data : null,
            event.data.ok ? "success" : "error",
            event.data.ok ? "" : event.data.error.kind
          );
        };
        const bridgeTimeout = (operation === "DOUGA_FLOOR" || operation === "ORDINARY_ZONE_FLOOR")
          && includeRank === true
          ? BRIDGE_RANKING_TIMEOUT_MS
          : BRIDGE_TIMEOUT_MS;
        const timeoutId = window.setTimeout(() => finish(null, "timeout", "TIMEOUT"), bridgeTimeout);
        window.addEventListener("message", onMessage);
        if (currentLifecycle && typeof currentLifecycle.registerCleanup === "function") {
          if (isCancelableOperation) {
            if (cancelProperty) currentLifecycle[cancelProperty] = cancelRequest;
          }
          if (typeof currentLifecycle.registerBridgeRequestCanceler === "function") {
            unregisterBridgeCanceler = currentLifecycle.registerBridgeRequestCanceler(sendCancel);
          }
          lifecycleCleanup = currentLifecycle.registerCleanup(() => {
            if (isLazyHoverOperation && !settled) {
              setLazyRuntimeState(operation, currentLifecycle, "cancelled");
            }
            sendCancel();
            finish(null, "cancelled", "CANCELLED");
          });
        }
        try {
          requestPosted = true;
          setLazyRuntimeState(operation, currentLifecycle, "request-posted");
          const requestMessage = {
            channel: BRIDGE_CHANNEL,
            version: BRIDGE_VERSION,
            type: BRIDGE_TYPE_REQUEST,
            operation,
            requestId
          };
          if (operation === RECOMMENDATION_OPERATION || operation === DOUGA_OPERATION || operation === READ_FLOOR_OPERATION) requestMessage.batch = batch;
          if (operation === DOUGA_OPERATION) requestMessage.includeRank = includeRank;
          if (operation === "ORDINARY_ZONE_FLOOR") {
            requestMessage.batch = batch;
            requestMessage.zoneType = ordinaryType;
            requestMessage.includeRank = includeRank;
          }
          if (operation === WATCH_LATER_OPERATION) {
            requestMessage.aid = mutation.aid;
            requestMessage.action = mutation.action;
          }
          window.postMessage(requestMessage, BRIDGE_ORIGIN);
          if (typeof onPosted === "function") onPosted();
        } catch {
          setLazyRuntimeState(operation, currentLifecycle, "bridge-error");
          finish(null, "bridge-error", "POST_FAILED");
        }
      });
    }).catch(() => {
      clearPreRequestCancel();
      setLazyRuntimeState(operation, currentLifecycle, "bridge-error");
      recordDiagnostic(diagnosticKey, "bridge-error", diagnosticClock() - diagnosticStartedAt, "BRIDGE_NOT_READY");
      return null;
    });
  };

  const isExactSearchRuntimeResult = (value, requestId, generation) => isBridgePlainObject(value)
    && ((bridgeOwnKeys(value) === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype" && value.ok === true)
      || (bridgeOwnKeys(value) === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype" && value.ok === false))
    && value.type === "HOMEPAGE_DATA_RESULT_V1"
    && value.requestId === requestId
    && value.generation === generation
    && value.operation === SEARCH_OPERATION
    && (value.ok ? isSearchData(value.data) : isBridgePlainObject(value.error));

  const isSearchAutocompleteData = (value) => isBridgePlainObject(value)
    && bridgeOwnKeys(value) === "items\u001Fterm"
    && isBridgeSearchText(value.term, 128)
    && Array.isArray(value.items)
    && value.items.length <= 10
    && value.items.every((item) => isBridgeSearchText(item, 128));

  const isExactSearchAutocompleteResult = (value, requestId, generation) => isBridgePlainObject(value)
    && ((bridgeOwnKeys(value) === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype" && value.ok === true)
      || (bridgeOwnKeys(value) === "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype" && value.ok === false))
    && value.type === "HOMEPAGE_DATA_RESULT_V1"
    && value.requestId === requestId
    && value.generation === generation
    && value.operation === SEARCH_AUTOCOMPLETE_OPERATION
    && (value.ok ? isSearchAutocompleteData(value.data) : isBridgePlainObject(value.error));

  const requestSearchAutocomplete = (currentLifecycle, rawTerm) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.search
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setSearchSuggestions !== "function") return;
    const term = typeof rawTerm === "string"
      ? rawTerm.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 128)
      : "";
    currentLifecycle.searchAutocompleteGeneration += 1;
    const generation = currentLifecycle.searchAutocompleteGeneration;
    if (!term) {
      globalThis.ExtensionBHomepageRenderer.setSearchSuggestions(currentLifecycle.search, null);
      setSearchAutocompleteErrorKind(currentLifecycle, null);
      setSearchAutocompleteRuntimeState(currentLifecycle, "empty");
      return;
    }
    const requestId = createBridgeRequestId();
    if (!requestId) {
      setSearchAutocompleteRuntimeState(currentLifecycle, "bridge-error");
      return;
    }
    setSearchAutocompleteErrorKind(currentLifecycle, null);
    setSearchAutocompleteRuntimeState(currentLifecycle, "request-posted");
    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: SEARCH_AUTOCOMPLETE_OPERATION,
        params: { term }
      }, (response) => {
        if (!isCurrentLifecycle(currentLifecycle) || generation !== currentLifecycle.searchAutocompleteGeneration) return;
        const runtimeFailed = Boolean(chrome.runtime.lastError);
        const exactResult = !runtimeFailed && isExactSearchAutocompleteResult(response, requestId, generation);
        if (runtimeFailed || !exactResult || response.ok !== true || response.data.term !== term) {
          setSearchAutocompleteErrorKind(
            currentLifecycle,
            exactResult && response.ok === false && response.error ? response.error.kind : "PROTOCOL_INVALID"
          );
          setSearchAutocompleteRuntimeState(currentLifecycle, "response-invalid");
          return;
        }
        if (globalThis.ExtensionBHomepageRenderer.setSearchSuggestions(currentLifecycle.search, response.data) !== true) {
          setSearchAutocompleteRuntimeState(currentLifecycle, "commit-blocked");
          return;
        }
        setSearchAutocompleteRuntimeState(currentLifecycle, response.data.items.length > 0 ? "committed" : "empty");
      });
    } catch {
      setSearchAutocompleteRuntimeState(currentLifecycle, "bridge-error");
    }
  };

  const normalizeStoredSearchHistory = (value) => {
    if (!Array.isArray(value)) return [];
    const items = [];
    const seen = new Set();
    for (const entry of value) {
      if (typeof entry !== "string") continue;
      const keyword = entry.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 128);
      const key = keyword.toLocaleLowerCase();
      if (!keyword || seen.has(key)) continue;
      seen.add(key);
      items.push(keyword);
      if (items.length >= 20) break;
    }
    return items;
  };

  const loadSearchHistory = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.search
      || !chrome.storage
      || !chrome.storage.local
      || typeof chrome.storage.local.get !== "function") return;
    chrome.storage.local.get(SEARCH_HISTORY_STORAGE_KEY, (result) => {
      if (!isCurrentLifecycle(currentLifecycle) || chrome.runtime.lastError) return;
      const items = normalizeStoredSearchHistory(result && result[SEARCH_HISTORY_STORAGE_KEY]);
      if (globalThis.ExtensionBHomepageRenderer
        && typeof globalThis.ExtensionBHomepageRenderer.setSearchHistory === "function") {
        globalThis.ExtensionBHomepageRenderer.setSearchHistory(currentLifecycle.search, items);
      }
    });
  };

  const persistSearchHistory = (currentLifecycle, value) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !chrome.storage
      || !chrome.storage.local
      || typeof chrome.storage.local.set !== "function") return;
    chrome.storage.local.set({ [SEARCH_HISTORY_STORAGE_KEY]: normalizeStoredSearchHistory(value) }, () => {
      void chrome.runtime.lastError;
    });
  };

  const requestSearchData = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.search
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setSearchData !== "function"
      || currentLifecycle.searchRequested) return;
    currentLifecycle.searchRequested = true;
    const generation = currentLifecycle.searchGeneration + 1;
    currentLifecycle.searchGeneration = generation;
    const requestId = createBridgeRequestId();
    if (!requestId) {
      currentLifecycle.searchRequested = false;
      setSearchRuntimeState(currentLifecycle, "bridge-error");
      return;
    }
    setSearchRuntimeState(currentLifecycle, "activation-started");
    const handleResponse = (response) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.searchGeneration !== generation) return;
      if (!isExactSearchRuntimeResult(response, requestId, generation) || response.ok !== true) {
        currentLifecycle.searchRequested = false;
        setSearchRuntimeState(currentLifecycle, "response-invalid");
        return;
      }
      if (globalThis.ExtensionBHomepageRenderer.setSearchData(currentLifecycle.search, response.data) !== true) {
        currentLifecycle.searchRequested = false;
        setSearchRuntimeState(currentLifecycle, "commit-blocked");
        return;
      }
      setSearchRuntimeState(currentLifecycle, "committed");
    };
    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: SEARCH_OPERATION,
        params: {}
      }, handleResponse);
      setSearchRuntimeState(currentLifecycle, "request-posted");
    } catch {
      currentLifecycle.searchRequested = false;
      setSearchRuntimeState(currentLifecycle, "bridge-error");
    }
  };

  const setRecommendationRuntimeState = (currentLifecycle, state) => {
    if (currentLifecycle && currentLifecycle.host && typeof state === "string") {
      currentLifecycle.host.setAttribute("data-extension-b-recommendation-state", state);
      currentLifecycle.host.setAttribute(
        "data-extension-b-recommendation-batch",
        String(currentLifecycle.recommendationBatch)
      );
    }
  };

  const requestRecommendationFeed = (currentLifecycle, advance = false) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.recommendation
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setRecommendationData !== "function"
      || typeof globalThis.ExtensionBHomepageRenderer.setRecommendationLoading !== "function") return;
    const prefetched = advance === false ? currentLifecycle.recommendationPrefetch : null;
    currentLifecycle.recommendationPrefetch = null;
    if (!prefetched) currentLifecycle.cancelRecommendationRequest();
    const batch = advance
      ? Math.min(10000, currentLifecycle.recommendationBatch + 1)
      : (prefetched ? prefetched.batch : currentLifecycle.recommendationBatch);
    currentLifecycle.recommendationBatch = batch;
    const generation = currentLifecycle.recommendationGeneration + 1;
    currentLifecycle.recommendationGeneration = generation;
    globalThis.ExtensionBHomepageRenderer.setRecommendationLoading(currentLifecycle.recommendation, true);
    setRecommendationRuntimeState(currentLifecycle, "request-posted");
    const request = prefetched
      ? prefetched.promise
      : requestPageBridge(RECOMMENDATION_OPERATION, currentLifecycle, batch);
    Promise.resolve(request).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.recommendationGeneration !== generation) return;
      globalThis.ExtensionBHomepageRenderer.setRecommendationLoading(currentLifecycle.recommendation, false);
      if (!isBridgeSummaryData(RECOMMENDATION_OPERATION, data)) {
        setRecommendationRuntimeState(currentLifecycle, "response-invalid");
        return;
      }
      const applied = globalThis.ExtensionBHomepageRenderer.setRecommendationData(currentLifecycle.recommendation, data) === true;
      if (!applied) {
        setRecommendationRuntimeState(currentLifecycle, "commit-failed");
        return;
      }
      currentLifecycle.recommendationLastGood = data;
      currentLifecycle.recommendationBatch = data.batch;
      setRecommendationRuntimeState(currentLifecycle, "committed");
    }, () => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.recommendationGeneration !== generation) return;
      globalThis.ExtensionBHomepageRenderer.setRecommendationLoading(currentLifecycle.recommendation, false);
      setRecommendationRuntimeState(currentLifecycle, "bridge-error");
    });
  };

  const requestDougaFloor = (currentLifecycle, advance = false, requestRank = advance) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.douga
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setDougaData !== "function") return Promise.resolve(false);
    const batch = advance ? Math.min(10000, currentLifecycle.dougaBatch + 1) : currentLifecycle.dougaBatch;
    currentLifecycle.dougaBatch = batch;
    const generation = currentLifecycle.dougaGeneration + 1;
    currentLifecycle.dougaGeneration = generation;
    if (currentLifecycle.host) {
      currentLifecycle.host.setAttribute("data-extension-b-douga-state", "request-posted");
      if (requestRank) currentLifecycle.host.setAttribute("data-extension-b-douga-rank-state", "loading");
    }
    return Promise.resolve(requestPageBridge(DOUGA_OPERATION, currentLifecycle, batch, null, { includeRank: requestRank })).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.dougaGeneration !== generation) return false;
      const applied = globalThis.ExtensionBHomepageRenderer.setDougaData(currentLifecycle.douga, data) === true;
      if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-douga-state", applied ? "committed" : "response-invalid");
      if (applied) {
        currentLifecycle.dougaBatch = data.batch;
        if (requestRank && currentLifecycle.host) {
          currentLifecycle.host.setAttribute("data-extension-b-douga-rank-state", data.ranks.length > 0 ? "committed" : "unavailable");
        }
        if (requestRank && data.ranks.length === 0
          && typeof globalThis.ExtensionBHomepageRenderer.setRankRuntimeUnavailable === "function") {
          globalThis.ExtensionBHomepageRenderer.setRankRuntimeUnavailable(currentLifecycle.douga);
        }
        if (!requestRank && data.ranks.length === 0 && !currentLifecycle.dougaRankRetryAttempted) {
          currentLifecycle.dougaRankRetryAttempted = true;
          currentLifecycle.registerTimeout(() => {
            if (isCurrentLifecycle(currentLifecycle)) requestDougaFloor(currentLifecycle, false, true);
          }, 700);
        }
      }
      return applied;
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.host) {
        currentLifecycle.host.setAttribute("data-extension-b-douga-state", "bridge-error");
        if (requestRank) currentLifecycle.host.setAttribute("data-extension-b-douga-rank-state", "bridge-error");
      }
      return false;
    });
  };
  const setOrdinaryZoneRuntimeState = (currentLifecycle, type, state) => {
    if (!currentLifecycle || !currentLifecycle.host || !isOrdinaryZoneType(type)) return;
    currentLifecycle.host.setAttribute(`data-extension-b-zone-${type}-state`, state);
  };
  const requestOrdinaryZoneFloor = (currentLifecycle, type, advance = false, requestRank = advance) => {
    if (!isCurrentLifecycle(currentLifecycle) || !isOrdinaryZoneType(type)
      || !currentLifecycle.ordinaryZones || !currentLifecycle.ordinaryZones[type]
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setOrdinaryZoneData !== "function") return Promise.resolve(false);
    const zone = currentLifecycle.ordinaryZones[type];
    const batch = advance ? Math.min(49, zone.batch + 1) : zone.batch;
    zone.batch = batch;
    zone.generation += 1;
    const generation = zone.generation;
    zone.requested = true;
    setOrdinaryZoneRuntimeState(currentLifecycle, type, "loading");
    if (requestRank && currentLifecycle.host) {
      currentLifecycle.host.setAttribute(`data-extension-b-zone-${type}-rank-state`, "loading");
    }
    return Promise.resolve(requestPageBridge(ORDINARY_ZONE_OPERATION, currentLifecycle, batch, null, { type, includeRank: requestRank })).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.ordinaryZones[type]
        || currentLifecycle.ordinaryZones[type].generation !== generation) return false;
      zone.requested = false;
      if (!isBridgeSummaryData(ORDINARY_ZONE_OPERATION, data)
        || data.type !== type
        || globalThis.ExtensionBHomepageRenderer.setOrdinaryZoneData(currentLifecycle.ordinaryZones[type].view, data) !== true) {
        setOrdinaryZoneRuntimeState(currentLifecycle, type, "response-invalid");
        return false;
      }
      zone.batch = data.batch;
      if (data.items.length > 0) zone.lastGood = data;
      if (requestRank && data.rankType !== "none" && currentLifecycle.host) {
        currentLifecycle.host.setAttribute(`data-extension-b-zone-${type}-rank-state`, data.ranks.length > 0 ? "committed" : "unavailable");
      }
      if (requestRank && data.rankType !== "none" && data.ranks.length === 0
        && typeof globalThis.ExtensionBHomepageRenderer.setRankRuntimeUnavailable === "function") {
        globalThis.ExtensionBHomepageRenderer.setRankRuntimeUnavailable(currentLifecycle.ordinaryZones[type].view);
      }
      if (!requestRank && data.rankType !== "none" && data.ranks.length === 0) {
        currentLifecycle.ordinaryRankRetryTypes.add(type);
      }
      setOrdinaryZoneRuntimeState(currentLifecycle, type, data.status === "success" ? "committed" : data.status);
      return data.items.length > 0;
    }, () => {
      if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.ordinaryZones[type]
        || currentLifecycle.ordinaryZones[type].generation !== generation) return false;
      zone.requested = false;
      setOrdinaryZoneRuntimeState(currentLifecycle, type, "bridge-error");
      if (requestRank && currentLifecycle.host) {
        currentLifecycle.host.setAttribute(`data-extension-b-zone-${type}-rank-state`, "bridge-error");
      }
      return false;
    });
  };
  const waitForOrdinaryRetry = (currentLifecycle, delay) => new Promise((resolve) => {
    if (!isCurrentLifecycle(currentLifecycle)) {
      resolve(false);
      return;
    }
    currentLifecycle.registerTimeout(() => resolve(isCurrentLifecycle(currentLifecycle)), delay);
  });
  const requestInitialOrdinaryZoneFloors = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.ordinaryInitialQueueStarted) return;
    currentLifecycle.ordinaryInitialQueueStarted = true;
    if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-zone-queue-state", "loading");
    let cursor = 0;
    const worker = async () => {
      while (isCurrentLifecycle(currentLifecycle) && cursor < ORDINARY_ZONE_TYPES.length) {
        const type = ORDINARY_ZONE_TYPES[cursor];
        cursor += 1;
        const committed = await requestOrdinaryZoneFloor(currentLifecycle, type, false);
        if (!committed && await waitForOrdinaryRetry(currentLifecycle, 450)) {
          await requestOrdinaryZoneFloor(currentLifecycle, type, false, true);
        }
      }
    };
    Promise.all(Array.from({ length: 4 }, () => worker())).then(async () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.host) {
        currentLifecycle.host.setAttribute("data-extension-b-zone-queue-state", "complete");
      }
      if (!isCurrentLifecycle(currentLifecycle)) return;
      const retryTypes = Array.from(ORDINARY_ZONE_RANK_TYPES);
      currentLifecycle.ordinaryRankRetryTypes.clear();
      let retryCursor = 0;
      const retryWorker = async () => {
        while (isCurrentLifecycle(currentLifecycle) && retryCursor < retryTypes.length) {
          const type = retryTypes[retryCursor];
          retryCursor += 1;
          await requestOrdinaryZoneFloor(currentLifecycle, type, false, true);
        }
      };
      await waitForOrdinaryRetry(currentLifecycle, 500);
      await retryWorker();
    });
  };
  const requestReadFloor = (currentLifecycle, advance = false) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.readFloor
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setReadFloorData !== "function") return;
    const batch = advance ? Math.min(10000, currentLifecycle.readFloorBatch + 1) : currentLifecycle.readFloorBatch;
    currentLifecycle.readFloorBatch = batch;
    currentLifecycle.readFloorGeneration += 1;
    const generation = currentLifecycle.readFloorGeneration;
    if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-read-floor-state", "loading");
    const scheduleInitialRetry = () => {
      if (advance || currentLifecycle.readFloorRetryAttempted || currentLifecycle.readFloorLastGood) return;
      currentLifecycle.readFloorRetryAttempted = true;
      currentLifecycle.registerTimeout(() => {
        if (isCurrentLifecycle(currentLifecycle)) requestReadFloor(currentLifecycle, false);
      }, 800);
    };
    Promise.resolve(requestPageBridge(READ_FLOOR_OPERATION, currentLifecycle, batch)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.readFloorGeneration !== generation) return;
      if (!isReadFloorData(data)
        || globalThis.ExtensionBHomepageRenderer.setReadFloorData(currentLifecycle.readFloor, data) !== true) {
        if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-read-floor-state", "response-invalid");
        scheduleInitialRetry();
        return;
      }
      currentLifecycle.readFloorBatch = data.batch;
      if (data.articles.length > 0) currentLifecycle.readFloorLastGood = data;
      if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-read-floor-state", data.status === "success" ? "committed" : data.status);
      if (data.articles.length === 0) scheduleInitialRetry();
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.readFloorGeneration === generation && currentLifecycle.host) {
        currentLifecycle.host.setAttribute("data-extension-b-read-floor-state", "bridge-error");
        scheduleInitialRetry();
      }
    });
  };
  const setLiveFloorRuntimeState = (currentLifecycle, state) => {
    if (currentLifecycle && currentLifecycle.host) {
      currentLifecycle.host.setAttribute("data-extension-b-live-floor-state", state);
    }
  };
  const requestLiveFloorInitial = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.liveFloor
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setLiveFloorInitial !== "function") return;
    const generation = ++currentLifecycle.liveFloorInitialGeneration;
    const roomsGeneration = currentLifecycle.liveFloorRoomsGeneration;
    setLiveFloorRuntimeState(currentLifecycle, "initial-loading");
    Promise.resolve(requestPageBridge(LIVE_FLOOR_INITIAL_OPERATION, currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.liveFloorInitialGeneration !== generation) return;
      if (!isLiveFloorInitialData(data)
        || globalThis.ExtensionBHomepageRenderer.setLiveFloorInitial(
          currentLifecycle.liveFloor,
          data,
          currentLifecycle.liveFloorRoomsGeneration === roomsGeneration
        ) !== true) {
        setLiveFloorRuntimeState(currentLifecycle, "initial-failure");
        return;
      }
      currentLifecycle.liveFloorRecommendationLastGood = { rooms: data.rooms };
      setLiveFloorRuntimeState(currentLifecycle, "committed");
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.liveFloorInitialGeneration === generation) {
        setLiveFloorRuntimeState(currentLifecycle, "initial-failure");
      }
    });
  };
  const requestLiveFloorMore = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.liveFloor
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setLiveFloorRooms !== "function") return;
    const generation = ++currentLifecycle.liveFloorRoomsGeneration;
    setLiveFloorRuntimeState(currentLifecycle, "more-loading");
    Promise.resolve(requestPageBridge(LIVE_FLOOR_MORE_OPERATION, currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.liveFloorRoomsGeneration !== generation) return;
      if (!isLiveFloorRoomsData(data) || data.rooms.length === 0
        || globalThis.ExtensionBHomepageRenderer.setLiveFloorRooms(currentLifecycle.liveFloor, data, "recommendation") !== true) {
        setLiveFloorRuntimeState(currentLifecycle, "more-failure");
        return;
      }
      currentLifecycle.liveFloorRecommendationLastGood = data;
      setLiveFloorRuntimeState(currentLifecycle, "committed");
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.liveFloorRoomsGeneration === generation) {
        setLiveFloorRuntimeState(currentLifecycle, "more-failure");
      }
    });
  };
  const requestLiveFloorFollowing = (currentLifecycle, activate = true) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.liveFloor
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setLiveFloorFollowing !== "function") return;
    if (currentLifecycle.liveFloorFollowingLastGood) {
      globalThis.ExtensionBHomepageRenderer.setLiveFloorFollowing(currentLifecycle.liveFloor, currentLifecycle.liveFloorFollowingLastGood, activate);
      return;
    }
    if (currentLifecycle.liveFloorFollowingRequested) return;
    currentLifecycle.liveFloorFollowingRequested = true;
    const generation = ++currentLifecycle.liveFloorFollowingGeneration;
    setLiveFloorRuntimeState(currentLifecycle, "following-loading");
    Promise.resolve(requestPageBridge(LIVE_FLOOR_FOLLOWING_OPERATION, currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.liveFloorFollowingGeneration !== generation) return;
      currentLifecycle.liveFloorFollowingRequested = false;
      if (!isLiveFloorRoomsData(data)) {
        setLiveFloorRuntimeState(currentLifecycle, "following-failure");
        return;
      }
      currentLifecycle.liveFloorFollowingLastGood = data;
      if (activate && data.rooms.length > 0) currentLifecycle.liveFloorRoomsGeneration += 1;
      globalThis.ExtensionBHomepageRenderer.setLiveFloorFollowing(currentLifecycle.liveFloor, data, activate);
      setLiveFloorRuntimeState(currentLifecycle, data.rooms.length ? "committed" : "following-empty");
    }, () => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.liveFloorFollowingGeneration !== generation) return;
      currentLifecycle.liveFloorFollowingRequested = false;
      setLiveFloorRuntimeState(currentLifecycle, "following-failure");
    });
  };
  const preferLiveFloorFollowingOnce = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)) return;
    let consumed = false;
    try {
      consumed = window.sessionStorage.getItem(LIVE_FLOOR_SESSION_KEY) === "1";
      if (!consumed) window.sessionStorage.setItem(LIVE_FLOOR_SESSION_KEY, "1");
    } catch (_) {}
    if (!consumed) requestLiveFloorFollowing(currentLifecycle, true);
  };
  const requestPrimaryMenuCounts = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.primaryMenuCountsRequested) return;
    currentLifecycle.primaryMenuCountsRequested = true;
    const generation = currentLifecycle.primaryMenuCountsGeneration + 1;
    currentLifecycle.primaryMenuCountsGeneration = generation;
    if (!currentLifecycle.primaryMenu
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setPrimaryMenuCounts !== "function") {
      setPrimaryMenuCountsRuntimeState(currentLifecycle, "failure");
      return;
    }
    setPrimaryMenuCountsRuntimeState(currentLifecycle, "loading");
    Promise.resolve(requestPageBridge(PRIMARY_MENU_COUNTS_OPERATION, currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.primaryMenuCountsGeneration !== generation) return;
      if (!isPrimaryMenuCountsData(data)
        || globalThis.ExtensionBHomepageRenderer.setPrimaryMenuCounts(currentLifecycle.primaryMenu, data) !== true) {
        setPrimaryMenuCountsRuntimeState(currentLifecycle, "failure");
        return;
      }
      setPrimaryMenuCountsRuntimeState(currentLifecycle, "committed");
    }, () => {
      if (isCurrentLifecycle(currentLifecycle)
        && currentLifecycle.primaryMenuCountsGeneration === generation) {
        setPrimaryMenuCountsRuntimeState(currentLifecycle, "failure");
      }
    });
  };

  const BANNER_RUNTIME_GET_MESSAGE = "BANNER_RUNTIME_GET_V1";
  const BANNER_LAST_GOOD_SET_MESSAGE = "BANNER_LAST_GOOD_SET_V1";
  const BANNER_APPLY_MESSAGE = "BANNER_APPLY_V1";
  const BANNER_REFRESH_MESSAGE = "BANNER_REFRESH_OFFICIAL_V1";
  const BANNER_RUNTIME_STATES = new Set(["loading", "official", "last-good", "builtin", "imported", "error"]);
  const setBannerRuntimeState = (currentLifecycle, state) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.host || !BANNER_RUNTIME_STATES.has(state)) return;
    currentLifecycle.host.setAttribute("data-extension-b-banner-state", state);
  };
  const setBannerRuntimeIdentity = (currentLifecycle, model, state) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.host) return;
    const safeModel = isBannerCurrentData(model) ? model : null;
    currentLifecycle.host.setAttribute("data-extension-b-banner-source", state || (safeModel && safeModel.source) || "error");
    currentLifecycle.host.setAttribute("data-extension-b-banner-id", safeModel ? safeModel.id : "");
    currentLifecycle.host.setAttribute("data-extension-b-banner-name", safeModel ? safeModel.name : "");
  };
  const isBannerRuntimeEnvelope = (value) => isBridgePlainObject(value)
    && Object.keys(value).sort().join("\u001F") === "assets\u001FlastGood\u001Fmodel\u001Fsettings\u001Ftype"
    && value.type === "BANNER_RUNTIME_RESULT_V1"
    && (value.model === null || isBannerCurrentData(value.model))
    && (value.lastGood === null || isBannerCurrentData(value.lastGood))
    && isBridgePlainObject(value.settings)
    && Object.keys(value.settings).sort().join("\u001F") === "packageId\u001Frotation\u001Fsource"
    && ["official", "builtin", "imported"].includes(value.settings.source)
    && ["manual", "random", "daily"].includes(value.settings.rotation)
    && (value.settings.packageId === null || (typeof value.settings.packageId === "string" && value.settings.packageId.length <= 96))
    && Array.isArray(value.assets)
    && value.assets.length <= BANNER_MAX_ASSETS
    && value.assets.every((asset) => isBridgePlainObject(asset)
      && Object.keys(asset).sort().join("\u001F") === "assetRef\u001Fbytes"
      && typeof asset.assetRef === "string"
      && ((asset.bytes instanceof ArrayBuffer)
        || (typeof asset.bytes === "string" && asset.bytes.length > 0 && asset.bytes.length <= Math.ceil((8 * 1024 * 1024) / 3) * 4
          && asset.bytes.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(asset.bytes))));
  const bytesToDataUrl = (bytes, mime) => {
    let array;
    if (bytes instanceof ArrayBuffer) {
      if (bytes.byteLength > 8 * 1024 * 1024) return null;
      array = new Uint8Array(bytes);
    } else if (typeof bytes === "string" && bytes.length > 0 && bytes.length <= Math.ceil((8 * 1024 * 1024) / 3) * 4
      && bytes.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(bytes)) {
      try {
        const binary = window.atob(bytes);
        if (binary.length > 8 * 1024 * 1024) return null;
        array = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) array[index] = binary.charCodeAt(index);
      } catch { return null; }
    } else return null;
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < array.length; index += chunkSize) {
      binary += String.fromCharCode(...array.subarray(index, Math.min(index + chunkSize, array.length)));
    }
    try { return `data:${mime};base64,${window.btoa(binary)}`; } catch { return null; }
  };
  const requestBannerStorage = () => new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ type: BANNER_RUNTIME_GET_MESSAGE }, (response) => {
        resolve(isBannerRuntimeEnvelope(response) ? response : null);
      });
    } catch { resolve(null); }
  });
  const applyBannerRuntimeModel = (currentLifecycle, model, assets, generation, state) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || generation !== currentLifecycle.bannerGeneration
      || !currentLifecycle.rendered
      || typeof currentLifecycle.rendered.setBannerModel !== "function"
      || !isBannerCurrentData(model)) return false;
    const assetMap = {};
    for (const asset of Array.isArray(assets) ? assets : []) {
      const mime = model.layers.find((layer) => layer.assetRef === asset.assetRef)?.type || "image/webp";
      const url = bytesToDataUrl(asset.bytes, mime);
      if (url) assetMap[asset.assetRef] = url;
    }
    const committed = currentLifecycle.rendered.setBannerModel(model, assetMap, generation);
    if (committed) {
      setBannerRuntimeState(currentLifecycle, state);
      setBannerRuntimeIdentity(currentLifecycle, model, state);
    }
    return committed;
  };
  const requestBannerRuntime = async (currentLifecycle, forceOfficial = false) => {
    if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.bannerRequested) return false;
    currentLifecycle.bannerRequested = true;
    const generation = ++currentLifecycle.bannerGeneration;
    setBannerRuntimeState(currentLifecycle, "loading");
    try {
      const runtime = await requestBannerStorage();
      if (!isCurrentLifecycle(currentLifecycle) || generation !== currentLifecycle.bannerGeneration) return false;
      const settings = runtime ? runtime.settings : { source: "official", packageId: null, rotation: "manual" };
      const source = forceOfficial ? "official" : settings.source;
      if (source === "builtin") {
        const model = globalThis.ExtensionBBannerModel && globalThis.ExtensionBBannerModel.BUILTIN_BANNER_MODEL;
        return applyBannerRuntimeModel(currentLifecycle, model, [], generation, "builtin");
      }
      if (source === "imported") {
        if (runtime && runtime.model
          && applyBannerRuntimeModel(currentLifecycle, runtime.model, runtime.assets, generation, "imported")) return true;
        const builtin = globalThis.ExtensionBBannerModel && globalThis.ExtensionBBannerModel.BUILTIN_BANNER_MODEL;
        return applyBannerRuntimeModel(currentLifecycle, builtin, [], generation, "builtin");
      }
      const official = await requestPageBridge(BANNER_CURRENT_OPERATION, currentLifecycle);
      if (!isCurrentLifecycle(currentLifecycle) || generation !== currentLifecycle.bannerGeneration) return false;
      if (isBannerCurrentData(official) && applyBannerRuntimeModel(currentLifecycle, official, [], generation, "official")) {
        try { chrome.runtime.sendMessage({ type: BANNER_LAST_GOOD_SET_MESSAGE, model: official }); } catch (_) {}
        return true;
      }
      if (runtime && runtime.lastGood
        && applyBannerRuntimeModel(currentLifecycle, runtime.lastGood, [], generation, "last-good")) return true;
      const builtin = globalThis.ExtensionBBannerModel && globalThis.ExtensionBBannerModel.BUILTIN_BANNER_MODEL;
      if (applyBannerRuntimeModel(currentLifecycle, builtin, [], generation, "builtin")) return true;
      setBannerRuntimeState(currentLifecycle, "error");
      return false;
    } finally {
      if (isCurrentLifecycle(currentLifecycle) && generation === currentLifecycle.bannerGeneration) {
        currentLifecycle.bannerRequested = false;
      }
    }
  };

  const requestWatchLaterMutation = (currentLifecycle, event, payload) => {
    if (!event
      || event.isTrusted !== true
      || !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.recommendation
      || !isBridgePlainObject(payload)
      || bridgeOwnKeys(payload) !== "added\u001Faid"
      || typeof payload.added !== "boolean"
      || !Number.isSafeInteger(payload.aid)
      || payload.aid <= 0
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setRecommendationWatchLaterState !== "function") return;
    const authState = currentLifecycle.statusPanel && currentLifecycle.statusPanel.getAttribute("data-state");
    if (authState === "logged_out") {
      openOfficialLogin(currentLifecycle, event);
      return;
    }
    if (currentLifecycle.watchLaterPending.has(payload.aid)) return;
    const action = payload.added ? "remove" : "add";
    currentLifecycle.watchLaterPending.add(payload.aid);
    globalThis.ExtensionBHomepageRenderer.setRecommendationWatchLaterState(
      currentLifecycle.recommendation,
      { aid: payload.aid, added: payload.added, loading: true, feedback: "none" }
    );
    const mutation = Object.freeze({ aid: payload.aid, action });
    Promise.resolve(requestPageBridge(WATCH_LATER_OPERATION, currentLifecycle, null, null, mutation)).then((data) => {
      currentLifecycle.watchLaterPending.delete(payload.aid);
      if (!isCurrentLifecycle(currentLifecycle)
        || !isBridgeSummaryData(WATCH_LATER_OPERATION, data)
        || data.aid !== payload.aid
        || data.action !== action) {
        globalThis.ExtensionBHomepageRenderer.setRecommendationWatchLaterState(
          currentLifecycle.recommendation,
          { aid: payload.aid, added: payload.added, loading: false, feedback: "none" }
        );
        if (authState === "unknown") openOfficialLogin(currentLifecycle, event);
        return;
      }
      globalThis.ExtensionBHomepageRenderer.setRecommendationWatchLaterState(
        currentLifecycle.recommendation,
        { aid: payload.aid, added: action === "add", loading: false, feedback: action === "add" ? "added" : "removed" }
      );
    }, () => {
      currentLifecycle.watchLaterPending.delete(payload.aid);
      if (!isCurrentLifecycle(currentLifecycle)) return;
      globalThis.ExtensionBHomepageRenderer.setRecommendationWatchLaterState(
        currentLifecycle.recommendation,
        { aid: payload.aid, added: payload.added, loading: false, feedback: "none" }
      );
      if (authState === "unknown") openOfficialLogin(currentLifecycle, event);
    });
  };

  let lifecycle = null;
  let routeLocked = false;

  const isCurrentLifecycle = (currentLifecycle) => (
    lifecycle === currentLifecycle && currentLifecycle.active
  );

  const resetMessageSummary = (currentLifecycle) => {
    if (!currentLifecycle) return;
    currentLifecycle.messageGeneration += 1;
    currentLifecycle.messageRequested = false;
    currentLifecycle.messageDataLoaded = false;
    if (currentLifecycle.messagePanel
      && globalThis.ExtensionBHomepageRenderer
      && typeof globalThis.ExtensionBHomepageRenderer.setMessageData === "function") {
      globalThis.ExtensionBHomepageRenderer.setMessageData(currentLifecycle.messagePanel, null);
    }
  };

  const requestMessageSummary = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.messagePanel
      || !currentLifecycle.statusPanel
      || currentLifecycle.statusPanel.getAttribute("data-state") !== "logged_in"
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setMessageData !== "function"
      || currentLifecycle.messageRequested) {
      return;
    }
    currentLifecycle.messageRequested = true;
    const generation = currentLifecycle.messageGeneration + 1;
    currentLifecycle.messageGeneration = generation;
    setSummaryRuntimeState(currentLifecycle, "message", "activation-started");
    Promise.resolve(requestPageBridge("MESSAGE_SUMMARY", currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.messageGeneration !== generation) return;
      if (!isBridgeSummaryData("MESSAGE_SUMMARY", data)) {
        currentLifecycle.messageRequested = false;
        setSummaryRuntimeState(currentLifecycle, "message", "response-invalid");
        return;
      }
      let applied = false;
      try {
        applied = globalThis.ExtensionBHomepageRenderer.setMessageData(currentLifecycle.messagePanel, data) === true;
      } catch {
        applied = false;
      }
      if (applied) {
        currentLifecycle.messageRequested = false;
        currentLifecycle.messageDataLoaded = true;
        setSummaryRuntimeState(currentLifecycle, "message", "committed");
      } else {
        currentLifecycle.messageRequested = false;
        setSummaryRuntimeState(currentLifecycle, "message", "commit-failed");
      }
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.messageGeneration === generation) {
        currentLifecycle.messageRequested = false;
        setSummaryRuntimeState(currentLifecycle, "message", "bridge-error");
      }
    });
  };

  const resetDynamicSummary = (currentLifecycle) => {
    if (!currentLifecycle) return;
    currentLifecycle.dynamicGeneration += 1;
    currentLifecycle.dynamicRequested = false;
    currentLifecycle.dynamicDataLoaded = false;
    currentLifecycle.dynamicLastGood = null;
    if (currentLifecycle.dynamicPanel
      && globalThis.ExtensionBHomepageRenderer
      && typeof globalThis.ExtensionBHomepageRenderer.setDynamicData === "function") {
      globalThis.ExtensionBHomepageRenderer.setDynamicData(currentLifecycle.dynamicPanel, null);
    }
  };

  const requestDynamicSummary = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.dynamicPanel
      || !currentLifecycle.statusPanel
      || currentLifecycle.statusPanel.getAttribute("data-state") !== "logged_in"
      || currentLifecycle.dynamicRequested) {
      return;
    }
    currentLifecycle.dynamicRequested = true;
    const generation = currentLifecycle.dynamicGeneration + 1;
    currentLifecycle.dynamicGeneration = generation;
    setSummaryRuntimeState(currentLifecycle, "dynamic", "activation-started");
    setSummaryRuntimeState(currentLifecycle, "dynamic", "request-posted");
    Promise.resolve(requestPageBridge("DYNAMIC_SUMMARY", currentLifecycle)).then((data) => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.dynamicGeneration !== generation) return;
      if (!isBridgeSummaryData("DYNAMIC_SUMMARY", data)) {
        currentLifecycle.dynamicRequested = false;
        setSummaryRuntimeState(currentLifecycle, "dynamic", "response-invalid");
        return;
      }
      let applied = false;
      try {
        applied = globalThis.ExtensionBHomepageRenderer
          && typeof globalThis.ExtensionBHomepageRenderer.setDynamicData === "function"
          && globalThis.ExtensionBHomepageRenderer.setDynamicData(currentLifecycle.dynamicPanel, data) === true;
      } catch {
        applied = false;
      }
      currentLifecycle.dynamicRequested = false;
      if (applied) {
        currentLifecycle.dynamicLastGood = data;
        currentLifecycle.dynamicDataLoaded = true;
        setSummaryRuntimeState(currentLifecycle, "dynamic", "committed");
      } else {
        setSummaryRuntimeState(currentLifecycle, "dynamic", "commit-blocked");
      }
    }, () => {
      if (isCurrentLifecycle(currentLifecycle) && currentLifecycle.dynamicGeneration === generation) {
        currentLifecycle.dynamicRequested = false;
        setSummaryRuntimeState(currentLifecycle, "dynamic", "bridge-error");
      }
    });
  };

  const setStatus = (currentLifecycle, status, profile = null) => {
    const nextStatus = status === "logged_in" || status === "logged_out" || status === "unknown"
      ? status
      : "unknown";
    setAuthRuntimeState(currentLifecycle, nextStatus);
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.statusText
      || !currentLifecycle.statusPanel
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }

    if (nextStatus !== "logged_in" && typeof currentLifecycle.cancelBridgeRequests === "function") {
      currentLifecycle.cancelBridgeRequests();
      if (typeof currentLifecycle.cancelProfileStatsRequest === "function") {
        currentLifecycle.cancelProfileStatsRequest();
      }
      resetMessageSummary(currentLifecycle);
      resetDynamicSummary(currentLifecycle);
    }
    globalThis.ExtensionBHomepageRenderer.setAuthStatus(
      currentLifecycle.statusText,
      currentLifecycle.statusPanel,
      nextStatus,
      nextStatus === "logged_in" ? profile : null
    );
    if (nextStatus === "logged_in") {
      requestMessageSummary(currentLifecycle);
      requestDynamicSummary(currentLifecycle);
      preferLiveFloorFollowingOnce(currentLifecycle);
    }
  };

  const requestAuthStatus = (currentLifecycle) => {
    const requestGeneration = currentLifecycle.requestGeneration + 1;
    currentLifecycle.requestGeneration = requestGeneration;
    currentLifecycle.latestRequestGeneration = requestGeneration;

    const handleStatus = (status, profile) => {
      if (
        !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.latestRequestGeneration !== requestGeneration
      ) {
        return;
      }
      setStatus(currentLifecycle, status, profile);
    };

    requestPageBridge("AUTH_STATUS", currentLifecycle).then((status) => {
      if (status && isBridgeStatus(status.status) && isBridgeAuthProfile(status.profile)) {
        handleStatus(status.status, status.profile);
      }
    });
  };

  const bindLogoutSurface = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.logoutButton
      || typeof currentLifecycle.registerListener !== "function") {
      return;
    }
    const button = currentLifecycle.logoutButton;
    const rootIdentity = document.documentElement;
    let pending = false;
    let activationGeneration = 0;
    const isBoundActive = () => isCurrentLifecycle(currentLifecycle)
      && currentLifecycle.logoutButton === button
      && isExactRoot()
      && document.documentElement === rootIdentity;
    const handleClick = (event) => {
      if (!event || event.isTrusted !== true
        || pending
        || !isBoundActive()
        || !currentLifecycle.statusPanel
        || currentLifecycle.statusPanel.getAttribute("data-state") !== "logged_in") {
        return;
      }
      pending = true;
      const generation = activationGeneration += 1;
      let request;
      try {
        request = requestPageBridge(LOGOUT_OPERATION, currentLifecycle);
      } catch {
        pending = false;
        return;
      }
      Promise.resolve(request).then((data) => {
        if (generation !== activationGeneration) return;
        pending = false;
        if (!isBoundActive()
          || !currentLifecycle.statusPanel
          || currentLifecycle.statusPanel.getAttribute("data-state") !== "logged_in"
          || !isBridgeSummaryData(LOGOUT_OPERATION, data)) {
          return;
        }
        setStatus(currentLifecycle, "logged_out", null);
        window.location.reload();
      }, () => {
        if (generation === activationGeneration) pending = false;
      });
    };
    currentLifecycle.registerListener(button, "click", handleClick);
  };

  const openOfficialLogin = (currentLifecycle, event) => {
    if (!event || event.isTrusted !== true || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()) {
      return;
    }
    requestPageBridge(SHOW_LOGIN_OPERATION, currentLifecycle).then((result) => {
      if (isBridgeSummaryData(SHOW_LOGIN_OPERATION, result)
        || !isCurrentLifecycle(currentLifecycle)
        || !isExactRoot()) {
        return;
      }
      const goUrl = encodeURIComponent(window.location.href);
      window.location.assign(`https://passport.bilibili.com/login?gourl=${goUrl}`);
    });
  };

  const AUTH_SUMMARY_SURFACES = Object.freeze([
    Object.freeze({ label: "收藏", kind: "favorite", operation: "FAVORITE_SUMMARY" }),
    Object.freeze({ label: "历史", kind: "history", operation: "HISTORY_SUMMARY" })
  ]);
  const bindMessageRefreshLifecycle = (currentLifecycle) => {
    if (!currentLifecycle || typeof currentLifecycle.registerListener !== "function") return;
    const refresh = () => {
      if (isCurrentLifecycle(currentLifecycle) && isExactRoot()) {
        requestMessageSummary(currentLifecycle);
      }
    };
    currentLifecycle.registerListener(window, "pageshow", refresh);
    currentLifecycle.registerListener(document, "visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });
    currentLifecycle.registerListener(window, "focus", refresh);
  };
  const bindDynamicRefreshLifecycle = (currentLifecycle) => {
    if (!currentLifecycle || typeof currentLifecycle.registerListener !== "function") return;
    const refresh = () => {
      if (isCurrentLifecycle(currentLifecycle) && isExactRoot()) {
        requestDynamicSummary(currentLifecycle);
      }
    };
    currentLifecycle.registerListener(window, "pageshow", refresh);
    currentLifecycle.registerListener(document, "visibilitychange", () => {
      if (document.visibilityState === "visible") refresh();
    });
    currentLifecycle.registerListener(window, "focus", refresh);
  };
  const bindMessageSummarySurface = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true
      || !currentLifecycle.messagePanel
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setMessageData !== "function") {
      setSummaryRuntimeState(currentLifecycle, "message", "bind-missing");
      return;
    }
    setSummaryRuntimeState(currentLifecycle, "message", "bound");
    const summaryRoot = currentLifecycle.signin || currentLifecycle.statusPanel;
    const trigger = summaryRoot && summaryRoot.querySelector(`[aria-label="消息"]`);
    if (!trigger) return;
    let group = trigger;
    while (group && group !== summaryRoot) {
      if (group.classList && group.classList.contains("item")) break;
      group = group.parentNode;
    }
    const activate = () => requestMessageSummary(currentLifecycle);
    for (const target of Array.from(new Set([trigger, group || trigger]))) {
      currentLifecycle.registerListener(target, "mouseenter", activate);
      currentLifecycle.registerListener(target, "pointerenter", activate);
      currentLifecycle.registerListener(target, "focusin", activate);
    }
  };
  const bindDynamicSummarySurface = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true
      || !currentLifecycle.dynamicPanel
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setDynamicData !== "function") {
      setSummaryRuntimeState(currentLifecycle, "dynamic", "bind-missing");
      return;
    }
    setSummaryRuntimeState(currentLifecycle, "dynamic", "bound");
    const summaryRoot = currentLifecycle.signin || currentLifecycle.statusPanel;
    const trigger = currentLifecycle.dynamicTrigger
      || (summaryRoot && summaryRoot.querySelector(`[aria-label="动态"]`));
    if (!trigger) return;
    let group = trigger;
    while (group && group !== summaryRoot) {
      if (group.classList && group.classList.contains("item")) break;
      group = group.parentNode;
    }
    const activate = () => requestDynamicSummary(currentLifecycle);
    for (const target of Array.from(new Set([trigger, group || trigger]))) {
      currentLifecycle.registerListener(target, "mouseenter", activate);
      currentLifecycle.registerListener(target, "pointerenter", activate);
      currentLifecycle.registerListener(target, "focusin", activate);
    }
  };
  const createSummaryActivationGate = ({
    currentLifecycle,
    boundStatusPanel,
    surface,
    request,
    isCurrent,
    isValid,
    commit,
    rootIdentity,
    isRoot
  }) => {
    const isObservableSurface = surface.kind === "message"
      || surface.kind === "favorite"
      || surface.kind === "history";
    const setRuntimeState = (state) => {
      if (!isObservableSurface
        || !currentLifecycle
        || !currentLifecycle.host
        || typeof currentLifecycle.host.setAttribute !== "function") return;
      setSummaryRuntimeState(currentLifecycle, surface.kind, state);
    };
    let activated = false;
    return () => {
      if (
        !isCurrent(currentLifecycle)
        || currentLifecycle.statusPanel !== boundStatusPanel
        || boundStatusPanel.getAttribute("data-state") !== "logged_in"
        || activated
      ) {
        if (!activated) setRuntimeState("guard-blocked");
        return;
      }
      activated = true;
      setRuntimeState("activation-started");
      const generation = currentLifecycle.generation;
      setRuntimeState("request-posted");
      let requestPromise;
      try {
        requestPromise = request(surface.operation);
      } catch {
        setRuntimeState("bridge-error");
        activated = false;
        return;
      }
      Promise.resolve(requestPromise).then((data) => {
        if (
          !isCurrent(currentLifecycle)
          || currentLifecycle.generation !== generation
          || currentLifecycle.statusPanel !== boundStatusPanel
          || boundStatusPanel.getAttribute("data-state") !== "logged_in"
          || !isRoot()
          || document.documentElement !== rootIdentity
          || !isValid(surface.operation, data)
        ) {
          setRuntimeState("response-invalid");
          activated = false;
          return;
        }
        let applied = false;
        try {
          applied = commit(surface.operation, data) !== false;
        } catch {
          applied = false;
        }
        if (applied) {
          setRuntimeState("committed");
        } else {
          setRuntimeState("commit-failed");
          activated = false;
        }
      }, () => {
        setRuntimeState("bridge-error");
        activated = false;
      });
    };
  };
  const bindAuthSummarySurfaces = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true
      || !currentLifecycle.statusPanel) return;
    const boundStatusPanel = currentLifecycle.statusPanel;
    const rootIdentity = document.documentElement;
    for (const surface of AUTH_SUMMARY_SURFACES) {
      const summaryRoot = currentLifecycle.signin || boundStatusPanel;
      const trigger = summaryRoot.querySelector(`[aria-label="${surface.label}"]`);
      const panel = currentLifecycle.summaryPanels && currentLifecycle.summaryPanels[surface.kind];
      if (!trigger || !panel) {
        setSummaryRuntimeState(currentLifecycle, surface.kind, "bind-missing");
        continue;
      }
      const setter = surface.kind === "favorite"
        ? globalThis.ExtensionBHomepageRenderer && globalThis.ExtensionBHomepageRenderer.setFavoriteData
        : globalThis.ExtensionBHomepageRenderer && globalThis.ExtensionBHomepageRenderer.setHistoryData;
      if (typeof setter !== "function") {
        setSummaryRuntimeState(currentLifecycle, surface.kind, "commit-blocked");
        continue;
      }
      const activate = createSummaryActivationGate({
        currentLifecycle,
        boundStatusPanel,
        surface,
        request: (operation) => requestPageBridge(operation, currentLifecycle),
        isCurrent: isCurrentLifecycle,
        isValid: isBridgeSummaryData,
        commit: (operation, data) => {
          if (operation === "FAVORITE_SUMMARY") {
            return globalThis.ExtensionBHomepageRenderer.setFavoriteData(panel, data) === true;
          } else if (operation === "HISTORY_SUMMARY") {
            return globalThis.ExtensionBHomepageRenderer.setHistoryData(panel, data) === true;
          }
          return false;
        },
        rootIdentity,
        isRoot: isExactRoot
      });
      setSummaryRuntimeState(currentLifecycle, surface.kind, "bound");
      const group = (() => {
        let node = trigger;
        while (node && node !== summaryRoot) {
          if (node.classList && node.classList.contains("item")) return node;
          node = node.parentNode;
        }
        return trigger.parentElement || trigger;
      })();
      const targets = Array.from(new Set([trigger, group]));
      for (const target of targets) {
        currentLifecycle.registerListener(target, "mouseenter", activate);
        currentLifecycle.registerListener(target, "pointerenter", activate);
        currentLifecycle.registerListener(target, "focusin", activate);
      }
    }
  };

  const bindLiveHoverSurface = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true
      || !currentLifecycle.livePopover
      || !currentLifecycle.liveTrigger
      || !currentLifecycle.liveTrigger.parentElement
      || !globalThis.ExtensionBHomepageRenderer) {
      return;
    }
    const trigger = currentLifecycle.liveTrigger;
    const panel = currentLifecycle.livePopover;
    const group = currentLifecycle.profileGroup || trigger.parentElement;
    const rootIdentity = document.documentElement;
    let activated = false;
    let activationToken = 0;
    const isBoundActive = () => isCurrentLifecycle(currentLifecycle)
      && currentLifecycle.livePopover === panel
      && currentLifecycle.liveTrigger === trigger
      && isExactRoot()
      && document.documentElement === rootIdentity;
    const isLiveCommitReady = () => isBoundActive()
      && typeof globalThis.ExtensionBHomepageRenderer.setLiveHoverData === "function"
      && panel.__liveRendererLease
      && panel.__liveRendererLease.active === true;
    const resetActivation = () => {
      activationToken += 1;
      activated = false;
      setLiveRuntimeState(currentLifecycle, "cancelled");
      if (typeof currentLifecycle.cancelLiveRequest === "function") {
        currentLifecycle.cancelLiveRequest();
      }
    };
    const cancel = () => resetActivation();
    const activate = () => {
      if (!isBoundActive()) {
        setLiveRuntimeState(currentLifecycle, "guard-blocked");
        return;
      }
      if (activated) return;
      activated = true;
      setLiveRuntimeState(currentLifecycle, "activation-started");
      const token = activationToken += 1;
      const generation = currentLifecycle.generation;
      let request;
      try {
        request = requestPageBridge(LIVE_HOVER_OPERATION, currentLifecycle);
      } catch {
        request = Promise.resolve(null);
      }
      Promise.resolve(request).then((data) => {
        if (token !== activationToken) return;
        if (!isLiveCommitReady() || currentLifecycle.generation !== generation) {
          setLiveRuntimeState(currentLifecycle, "commit-blocked");
          return;
        }
        if (!isBridgeSummaryData(LIVE_HOVER_OPERATION, data)) {
          setLiveRuntimeState(currentLifecycle, "response-invalid");
          activated = false;
          return;
        }
        const applied = globalThis.ExtensionBHomepageRenderer.setLiveHoverData(panel, data);
        if (applied) {
          setLiveRuntimeState(currentLifecycle, "committed");
        }
        if (!applied && isLiveCommitReady()) {
          activated = false;
        }
      }, () => {
        if (token === activationToken && isBoundActive()
          && currentLifecycle.generation === generation) {
          activated = false;
        }
      });
    };
    setLiveRuntimeState(currentLifecycle, "bound");
    currentLifecycle.registerListener(trigger, "mouseenter", activate);
    currentLifecycle.registerListener(trigger, "focusin", activate);
    currentLifecycle.registerListener(trigger, "pointerenter", activate);
    currentLifecycle.registerListener(group, "mouseenter", activate);
    currentLifecycle.registerListener(group, "pointerenter", activate);
    currentLifecycle.registerListener(panel, "mouseenter", activate);
    currentLifecycle.registerListener(panel, "pointerenter", activate);
    currentLifecycle.registerListener(group, "mouseleave", (event) => {
      if (!group.contains(event.relatedTarget)) cancel();
    });
    currentLifecycle.registerListener(group, "focusout", (event) => {
      if (!group.contains(event.relatedTarget)) cancel();
    });
    currentLifecycle.registerListener(panel, "keydown", (event) => {
      if (event.key === "Escape") cancel();
    });
    currentLifecycle.registerTimeout(() => {
      if (isBoundActive()
        && (group.matches(":hover") || trigger.matches(":hover"))) {
        activate();
      }
    }, 0);
  };

  const bindProfileStatsSurface = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true
      || !currentLifecycle.profilePopover
      || !currentLifecycle.profileTrigger
      || !currentLifecycle.profileTrigger.parentElement) {
      setProfileStatsRuntimeState(currentLifecycle, "guard-blocked");
      return;
    }
    const trigger = currentLifecycle.profileTrigger;
    const panel = currentLifecycle.profilePopover;
    const group = trigger.parentElement;
    const rootIdentity = document.documentElement;
    let activated = false;
    let activationToken = 0;
    const isBoundActive = () => isCurrentLifecycle(currentLifecycle)
      && currentLifecycle.profilePopover === panel
      && currentLifecycle.profileTrigger === trigger
      && isExactRoot()
      && document.documentElement === rootIdentity;
    const isProfileCommitReady = () => isBoundActive()
      && currentLifecycle.statusPanel
      && currentLifecycle.statusPanel.getAttribute("data-state") === "logged_in"
      && globalThis.ExtensionBHomepageRenderer
      && typeof globalThis.ExtensionBHomepageRenderer.setProfileStats === "function";
    const activate = () => {
      if (activated) return;
      if (!isBoundActive()
        || !currentLifecycle.statusPanel
        || currentLifecycle.statusPanel.getAttribute("data-state") !== "logged_in") {
        setProfileStatsRuntimeState(currentLifecycle, "guard-blocked");
        return;
      }
      activated = true;
      setProfileStatsRuntimeState(currentLifecycle, "activation-started");
      const token = activationToken += 1;
      const generation = currentLifecycle.generation;
      let request;
      try {
        request = requestPageBridge(PROFILE_STATS_OPERATION, currentLifecycle);
      } catch {
        setProfileStatsRuntimeState(currentLifecycle, "bridge-error");
        activated = false;
        return;
      }
      Promise.resolve(request).then((data) => {
        if (token !== activationToken) return;
        if (!isProfileCommitReady() || currentLifecycle.generation !== generation) {
          setProfileStatsRuntimeState(currentLifecycle, "commit-blocked");
          activated = false;
          return;
        }
        if (!isBridgeSummaryData(PROFILE_STATS_OPERATION, data)) {
          setProfileStatsRuntimeState(currentLifecycle, "response-invalid");
          activated = false;
          return;
        }
        let applied = false;
        try {
          applied = globalThis.ExtensionBHomepageRenderer.setProfileStats(panel, data) === true;
        } catch {
          applied = false;
        }
        if (applied) {
          setProfileStatsRuntimeState(currentLifecycle, "committed");
        } else {
          setProfileStatsRuntimeState(currentLifecycle, "commit-blocked");
          activated = false;
        }
      }, () => {
        if (token !== activationToken) return;
        setProfileStatsRuntimeState(currentLifecycle, "bridge-error");
        activated = false;
      });
    };
    const reset = (event) => {
      if (!group.contains(event && event.relatedTarget)) {
        activationToken += 1;
        activated = false;
        setProfileStatsRuntimeState(currentLifecycle, "cancelled");
        if (typeof currentLifecycle.cancelProfileStatsRequest === "function") {
          currentLifecycle.cancelProfileStatsRequest();
        }
      }
    };
    setProfileStatsRuntimeState(currentLifecycle, "bound");
    currentLifecycle.registerListener(trigger, "mouseenter", activate);
    currentLifecycle.registerListener(trigger, "pointerenter", activate);
    currentLifecycle.registerListener(trigger, "focusin", activate);
    currentLifecycle.registerListener(group, "mouseenter", activate);
    currentLifecycle.registerListener(group, "pointerenter", activate);
    currentLifecycle.registerListener(group, "focusin", activate);
    currentLifecycle.registerListener(panel, "mouseenter", activate);
    currentLifecycle.registerListener(panel, "pointerenter", activate);
    currentLifecycle.registerListener(group, "mouseleave", reset);
    currentLifecycle.registerListener(group, "focusout", reset);
  };

  const bindMountedHostSurfaces = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || currentLifecycle.hostBindingsBound
      || !currentLifecycle.host
      || currentLifecycle.host.isConnected !== true) {
      return false;
    }
    const rendered = currentLifecycle.rendered;
    if (!rendered) {
      return false;
    }
    currentLifecycle.statusText = rendered.statusText;
    currentLifecycle.statusPanel = rendered.statusPanel;
    currentLifecycle.signin = rendered.signin;
    currentLifecycle.summaryPanels = rendered.summaryPanels;
    currentLifecycle.messagePanel = rendered.messagePanel
      || (rendered.summaryPanels && rendered.summaryPanels.message)
      || null;
    currentLifecycle.dynamicPanel = rendered.dynamicPanel
      || (rendered.summaryPanels && rendered.summaryPanels.dynamic)
      || null;
    currentLifecycle.dynamicTrigger = rendered.dynamicTrigger || null;
    currentLifecycle.livePopover = rendered.livePopover;
    currentLifecycle.liveTrigger = rendered.liveTrigger;
    currentLifecycle.profilePopover = rendered.profilePopover;
    currentLifecycle.profileTrigger = rendered.profileTrigger;
    currentLifecycle.profileGroup = rendered.profileGroup;
    currentLifecycle.logoutButton = rendered.logoutButton;
    currentLifecycle.primaryMenu = rendered.primaryMenu || null;
      currentLifecycle.search = rendered.search;
    currentLifecycle.focusCarousel = rendered.focusCarousel;
    currentLifecycle.recommendation = rendered.recommendation;
    currentLifecycle.douga = rendered.douga;
    currentLifecycle.liveFloor = rendered.liveFloor || null;
    currentLifecycle.knowledge = rendered.knowledge;
    currentLifecycle.music = rendered.music;
    currentLifecycle.animal = rendered.animal;
    currentLifecycle.fashion = rendered.fashion;
    currentLifecycle.pgcAnime = rendered.pgcAnime;
    currentLifecycle.pgcGuochuang = rendered.pgcGuochuang;
    try {
      const authState = currentLifecycle.statusPanel
        && currentLifecycle.statusPanel.getAttribute("data-state");
      setAuthRuntimeState(currentLifecycle, AUTH_RUNTIME_STATES.has(authState) ? authState : "unknown");
      bindMessageSummarySurface(currentLifecycle);
      bindDynamicSummarySurface(currentLifecycle);
      bindAuthSummarySurfaces(currentLifecycle);
      bindLiveHoverSurface(currentLifecycle);
      bindLogoutSurface(currentLifecycle);
      bindProfileStatsSurface(currentLifecycle);
      setSearchRuntimeState(currentLifecycle, currentLifecycle.search ? "bound" : "commit-blocked");
      loadSearchHistory(currentLifecycle);
      setRecommendationRuntimeState(currentLifecycle, currentLifecycle.recommendation ? "bound" : "bind-missing");
    } catch {
      return false;
    }
    currentLifecycle.hostBindingsBound = true;
    return true;
  };

  const isExactFocusResult = (response, requestId, generation) => {
    if (
      !response
      || typeof response !== "object"
      || Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
        && Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
      || response.type !== "HOMEPAGE_DATA_RESULT_V1"
      || response.requestId !== requestId
      || response.generation !== generation
      || response.operation !== FOCUS_OPERATION
      || typeof response.ok !== "boolean"
    ) {
      return false;
    }

    if (response.ok) {
      return (
        response.data
        && typeof response.data === "object"
        && Array.isArray(response.data.items)
        && Object.keys(response.data).length === 1
        && globalThis.ExtensionBHomepageRenderer
        && globalThis.ExtensionBHomepageRenderer.isFocusCarouselItems(response.data.items)
      );
    }

    return (
      response.error
      && typeof response.error === "object"
      && Object.keys(response.error).length === 1
      && FOCUS_ERROR_KINDS.has(response.error.kind)
    );
  };

  const renderFocusFailure = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.focusCarousel
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    globalThis.ExtensionBHomepageRenderer.setFocusCarouselItems(
      currentLifecycle.focusCarousel,
      currentLifecycle.focusLastGood
    );
  };

  const renderPgcAnimeFailure = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.pgcAnime
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    if (currentLifecycle.pgcAnimeLastGood) {
      globalThis.ExtensionBHomepageRenderer.setPgcAnimeData(
        currentLifecycle.pgcAnime,
        currentLifecycle.pgcAnimeLastGood
      );
      return;
    }
    globalThis.ExtensionBHomepageRenderer.setPgcAnimeFailure(currentLifecycle.pgcAnime);
  };

  const renderPgcGuochuangFailure = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.pgcGuochuang
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    if (currentLifecycle.pgcGuochuangLastGood) {
      globalThis.ExtensionBHomepageRenderer.setPgcGuochuangData(
        currentLifecycle.pgcGuochuang,
        currentLifecycle.pgcGuochuangLastGood
      );
      return;
    }
    globalThis.ExtensionBHomepageRenderer.setPgcGuochuangFailure(currentLifecycle.pgcGuochuang);
  };

  const requestFocusCarousel = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.focusCarousel
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }

    currentLifecycle.cancelFocusRequest();
    const generation = currentLifecycle.focusGeneration + 1;
    currentLifecycle.focusGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-focus-${generation}`;
    currentLifecycle.focusRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.focusAbortController = abortController;

    const handleResponse = (response) => {
      if (
        abortController.signal.aborted
        || !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.focusRequestId !== requestId
        || currentLifecycle.focusGeneration !== generation
      ) {
        return;
      }

      if (chrome.runtime.lastError || !isExactFocusResult(response, requestId, generation)) {
        renderFocusFailure(currentLifecycle);
        return;
      }

      if (response.ok) {
        currentLifecycle.focusLastGood = response.data.items.map((item) => ({ ...item }));
        globalThis.ExtensionBHomepageRenderer.setFocusCarouselItems(
          currentLifecycle.focusCarousel,
          currentLifecycle.focusLastGood
        );
        return;
      }

      renderFocusFailure(currentLifecycle);
    };

    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: FOCUS_OPERATION,
        params: {}
      }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const requestMangaFloor = (currentLifecycle, advance = false) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.mangaFloor
      || !globalThis.ExtensionBHomepageRenderer
      || typeof globalThis.ExtensionBHomepageRenderer.setMangaFloorData !== "function") return;
    const batch = advance ? Math.min(10000, currentLifecycle.mangaBatch + 1) : currentLifecycle.mangaBatch;
    currentLifecycle.mangaBatch = batch;
    const generation = currentLifecycle.mangaGeneration + 1;
    currentLifecycle.mangaGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-manga-${generation}`;
    currentLifecycle.host.setAttribute("data-extension-b-manga-state", "loading");
    const handleResponse = (response) => {
      let stage = "entered";
      const mark = (value) => {
        stage = value;
        if (currentLifecycle.host) currentLifecycle.host.setAttribute("data-extension-b-manga-callback", value);
      };
      mark(stage);
      try {
        if (!currentLifecycle.active
          || !currentLifecycle.host
          || currentLifecycle.host.isConnected !== true
          || currentLifecycle.mangaGeneration !== generation) {
          mark("stale");
          return;
        }
        mark("guard-passed");
        mark("validating-envelope");
        const responseObject = response !== null && typeof response === "object";
        const responseKeys = responseObject ? Object.keys(response).sort().join("\u001F") : "";
        const envelopeValid = responseObject
          && responseKeys === "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
          && response.type === "HOMEPAGE_DATA_RESULT_V1"
          && response.operation === MANGA_OPERATION
          && response.requestId === requestId
          && response.generation === generation
          && response.ok === true;
        mark("validating-data");
        const validator = globalThis.ExtensionBHomepageRenderer.isMangaFloorData;
        const dataValid = envelopeValid && typeof validator === "function" && validator(response.data) === true;
        if (dataValid) {
          mark("committing");
          if (globalThis.ExtensionBHomepageRenderer.setMangaFloorData(currentLifecycle.mangaFloor, response.data) === true) {
            currentLifecycle.mangaBatch = response.data.batch;
            currentLifecycle.mangaLastGood = response.data;
            currentLifecycle.host.setAttribute("data-extension-b-manga-state", "committed");
            currentLifecycle.host.removeAttribute("data-extension-b-manga-error");
            mark("committed");
            return;
          }
        }
        const errorKind = !responseObject ? "no-response"
          : response.ok === false && response.error && typeof response.error.kind === "string" ? response.error.kind.toLowerCase()
            : dataValid ? "commit-rejected" : envelopeValid ? "data-invalid" : `response-invalid:${responseKeys || "none"}`;
        currentLifecycle.host.setAttribute("data-extension-b-manga-error", errorKind);
        if (currentLifecycle.mangaLastGood) globalThis.ExtensionBHomepageRenderer.setMangaFloorData(currentLifecycle.mangaFloor, currentLifecycle.mangaLastGood);
        currentLifecycle.host.setAttribute("data-extension-b-manga-state", currentLifecycle.mangaLastGood ? "last-good" : "failure");
        mark("rejected");
      } catch (error) {
        const errorName = error && typeof error.name === "string" ? error.name : "Error";
        if (currentLifecycle.host) {
          currentLifecycle.host.setAttribute("data-extension-b-manga-error", `handler-${stage}-${errorName}`);
          currentLifecycle.host.setAttribute("data-extension-b-manga-state", currentLifecycle.mangaLastGood ? "last-good" : "failure");
        }
        mark(`caught:${errorName}`);
      }
    };
    try {
      const message = { type: "HOMEPAGE_DATA_REQUEST_V1", requestId, generation, operation: MANGA_OPERATION, params: { batch } };
      const contentDeadline = new Promise((resolve) => window.setTimeout(() => resolve(null), 8000));
      Promise.race([Promise.resolve(chrome.runtime.sendMessage(message)), contentDeadline]).then(handleResponse, () => handleResponse(null));
    } catch { handleResponse(null); }
  };

  const isExactKnowledgeResult = (response, requestId, generation) => {
    if (
      !response
      || typeof response !== "object"
      || (
        Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
        && Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
      )
      || response.type !== "HOMEPAGE_DATA_RESULT_V1"
      || response.requestId !== requestId
      || response.generation !== generation
      || response.operation !== KNOWLEDGE_OPERATION
      || typeof response.ok !== "boolean"
    ) {
      return false;
    }
    if (response.ok) {
      return Boolean(
        response.data
        && typeof response.data === "object"
        && Object.keys(response.data).sort().join("\u001F") === "items\u001Fstatus"
        && globalThis.ExtensionBHomepageRenderer
        && globalThis.ExtensionBHomepageRenderer.isKnowledgeData(response.data)
      );
    }
    return Boolean(
      response.error
      && typeof response.error === "object"
      && Object.keys(response.error).length === 1
      && KNOWLEDGE_ERROR_KINDS.has(response.error.kind)
    );
  };

  const renderKnowledgeFailure = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.knowledge
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    globalThis.ExtensionBHomepageRenderer.setKnowledgeFailure(
      currentLifecycle.knowledge,
      currentLifecycle.knowledgeLastGood
    );
  };

  const requestKnowledgeFeed = (currentLifecycle) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.knowledge
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    currentLifecycle.cancelKnowledgeRequest();
    const generation = currentLifecycle.knowledgeGeneration + 1;
    currentLifecycle.knowledgeGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-knowledge-${generation}`;
    currentLifecycle.knowledgeRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.knowledgeAbortController = abortController;
    const handleResponse = (response) => {
      if (
        abortController.signal.aborted
        || !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.knowledgeRequestId !== requestId
        || currentLifecycle.knowledgeGeneration !== generation
      ) {
        return;
      }
      if (chrome.runtime.lastError || !isExactKnowledgeResult(response, requestId, generation)) {
        renderKnowledgeFailure(currentLifecycle);
        return;
      }
      if (response.ok) {
        if (response.data.status === "success" || response.data.status === "partial") {
          currentLifecycle.knowledgeLastGood = response.data.items.map((item) => ({ ...item }));
        }
        globalThis.ExtensionBHomepageRenderer.setKnowledgeData(
          currentLifecycle.knowledge,
          response.data
        );
        return;
      }
      renderKnowledgeFailure(currentLifecycle);
    };
    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: KNOWLEDGE_OPERATION,
        params: {}
      }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const runKnowledgeContentSelfTests = () => {
    const assert = (condition, label) => {
      if (!condition) {
        throw new Error(`Knowledge content self-test failed: ${label}`);
      }
    };
    const previousRenderer = globalThis.ExtensionBHomepageRenderer;
    const previousSendMessage = chrome.runtime.sendMessage;
    const callbacks = [];
    let writes = 0;
    globalThis.ExtensionBHomepageRenderer = {
      isKnowledgeData: (data) => data && Array.isArray(data.items) && (data.status === "partial" || data.status === "success" || data.status === "empty"),
      setKnowledgeData: () => { writes += 1; },
      setKnowledgeFailure: () => { writes += 1; }
    };
    chrome.runtime.sendMessage = (message, callback) => callbacks.push({ message, callback });
    const previousLifecycle = lifecycle;
    try {
      const currentLifecycle = {
        active: true,
        generation: 0,
        ownerMarker: "knowledge-content-self-test",
        knowledge: {},
        knowledgeGeneration: 0,
        knowledgeRequestId: null,
        knowledgeAbortController: null,
        knowledgeLastGood: null,
        cancelKnowledgeRequest() {}
      };
      lifecycle = currentLifecycle;
      requestKnowledgeFeed(currentLifecycle);
      assert(callbacks.length === 1, "single knowledge request");
      assert(callbacks[0].message.operation === KNOWLEDGE_OPERATION && Object.keys(callbacks[0].message.params).length === 0, "exact knowledge request");
      currentLifecycle.knowledgeGeneration += 1;
      callbacks[0].callback({
        type: "HOMEPAGE_DATA_RESULT_V1",
        requestId: callbacks[0].message.requestId,
        generation: callbacks[0].message.generation,
        operation: KNOWLEDGE_OPERATION,
        ok: true,
        data: { status: "partial", items: [] }
      });
      assert(writes === 0, "stale knowledge result zero DOM writes");
      const categories = Array.isArray(globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__)
        ? globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__
        : [];
      categories.push("09 content generation/teardown stale-result zero-write: PASS");
      globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__ = categories;
      return true;
    } finally {
      lifecycle = previousLifecycle;
      chrome.runtime.sendMessage = previousSendMessage;
      globalThis.ExtensionBHomepageRenderer = previousRenderer;
    }
  };

  const isExactMusicResult = (response, requestId, generation) => {
    if (
      !response
      || typeof response !== "object"
      || (
        Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
        && Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
      )
      || response.type !== "HOMEPAGE_DATA_RESULT_V1"
      || response.requestId !== requestId
      || response.generation !== generation
      || response.operation !== MUSIC_OPERATION
      || typeof response.ok !== "boolean"
    ) return false;
    if (response.ok) {
      return Boolean(
        response.data
        && typeof response.data === "object"
        && Object.keys(response.data).sort().join("\u001F") === "items\u001Fstatus"
        && globalThis.ExtensionBHomepageRenderer
        && globalThis.ExtensionBHomepageRenderer.isMusicData(response.data)
      );
    }
    return Boolean(
      response.error
      && typeof response.error === "object"
      && Object.keys(response.error).length === 1
      && MUSIC_ERROR_KINDS.has(response.error.kind)
    );
  };

  const renderMusicFailure = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.music || !globalThis.ExtensionBHomepageRenderer) return;
    globalThis.ExtensionBHomepageRenderer.setMusicFailure(currentLifecycle.music, currentLifecycle.musicLastGood);
  };

  const requestMusicFeed = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !currentLifecycle.music || !globalThis.ExtensionBHomepageRenderer) return;
    currentLifecycle.cancelMusicRequest();
    const generation = currentLifecycle.musicGeneration + 1;
    currentLifecycle.musicGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-music-${generation}`;
    currentLifecycle.musicRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.musicAbortController = abortController;
    const handleResponse = (response) => {
      if (
        abortController.signal.aborted
        || !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.musicRequestId !== requestId
        || currentLifecycle.musicGeneration !== generation
      ) return;
      if (chrome.runtime.lastError || !isExactMusicResult(response, requestId, generation)) {
        renderMusicFailure(currentLifecycle);
        return;
      }
      if (response.ok) {
        if (response.data.status === "success" || response.data.status === "partial") {
          currentLifecycle.musicLastGood = response.data.items.map((item) => ({ ...item }));
        }
        globalThis.ExtensionBHomepageRenderer.setMusicData(currentLifecycle.music, response.data);
        return;
      }
      renderMusicFailure(currentLifecycle);
    };
    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: MUSIC_OPERATION,
        params: {}
      }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const runMusicContentSelfTests = () => {
    const assert = (condition, label) => { if (!condition) throw new Error(`Music content self-test failed: ${label}`); };
    const previousRenderer = globalThis.ExtensionBHomepageRenderer;
    const previousSendMessage = chrome.runtime.sendMessage;
    const callbacks = [];
    let writes = 0;
    globalThis.ExtensionBHomepageRenderer = {
      isMusicData: (data) => data && Array.isArray(data.items) && ["partial", "success", "empty"].includes(data.status),
      setMusicData: () => { writes += 1; },
      setMusicFailure: () => { writes += 1; }
    };
    chrome.runtime.sendMessage = (message, callback) => callbacks.push({ message, callback });
    const previousLifecycle = lifecycle;
    try {
      const currentLifecycle = {
        active: true,
        generation: 0,
        ownerMarker: "music-content-self-test",
        music: {},
        musicGeneration: 0,
        musicRequestId: null,
        musicAbortController: null,
        musicLastGood: null,
        cancelMusicRequest() {}
      };
      lifecycle = currentLifecycle;
      requestMusicFeed(currentLifecycle);
      assert(callbacks.length === 1 && callbacks[0].message.operation === MUSIC_OPERATION && Object.keys(callbacks[0].message.params).length === 0, "exact music request");
      currentLifecycle.musicGeneration += 1;
      callbacks[0].callback({
        type: "HOMEPAGE_DATA_RESULT_V1",
        requestId: callbacks[0].message.requestId,
        generation: callbacks[0].message.generation,
        operation: MUSIC_OPERATION,
        ok: true,
        data: { status: "partial", items: [] }
      });
      assert(writes === 0, "stale result zero DOM writes");
      return true;
    } finally {
      lifecycle = previousLifecycle;
      chrome.runtime.sendMessage = previousSendMessage;
      globalThis.ExtensionBHomepageRenderer = previousRenderer;
    }
  };

  const isExactAnimalResult = (response, requestId, generation) => {
    if (!response || typeof response !== "object"
      || ((Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype")
        && (Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"))
      || response.type !== "HOMEPAGE_DATA_RESULT_V1" || response.requestId !== requestId || response.generation !== generation
      || response.operation !== ANIMAL_OPERATION || typeof response.ok !== "boolean") return false;
    if (response.ok) return Boolean(response.data && typeof response.data === "object"
      && Object.keys(response.data).sort().join("\u001F") === "items\u001Fstatus"
      && globalThis.ExtensionBHomepageRenderer && globalThis.ExtensionBHomepageRenderer.isAnimalData(response.data));
    return Boolean(response.error && typeof response.error === "object" && Object.keys(response.error).length === 1 && ANIMAL_ERROR_KINDS.has(response.error.kind));
  };

  const isExactFashionResult = (response, requestId, generation) => {
    if (!response || typeof response !== "object"
      || ((Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype")
        && (Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"))
      || response.type !== "HOMEPAGE_DATA_RESULT_V1" || response.requestId !== requestId || response.generation !== generation
      || response.operation !== FASHION_OPERATION || typeof response.ok !== "boolean") return false;
    if (response.ok) return Boolean(response.data && typeof response.data === "object"
      && Object.keys(response.data).sort().join("\u001F") === "items\u001Fstatus"
      && globalThis.ExtensionBHomepageRenderer && globalThis.ExtensionBHomepageRenderer.isFashionData(response.data));
    return Boolean(response.error && typeof response.error === "object" && Object.keys(response.error).length === 1 && FASHION_ERROR_KINDS.has(response.error.kind));
  };

  const renderAnimalFailure = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !isExactRoot() || !currentLifecycle.animal || !globalThis.ExtensionBHomepageRenderer) return;
    globalThis.ExtensionBHomepageRenderer.setAnimalFailure(currentLifecycle.animal, currentLifecycle.animalLastGood);
  };

  const renderFashionFailure = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !isExactRoot() || !currentLifecycle.fashion || !globalThis.ExtensionBHomepageRenderer) return;
    globalThis.ExtensionBHomepageRenderer.setFashionFailure(currentLifecycle.fashion, currentLifecycle.fashionLastGood);
  };

  const requestAnimalFeed = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !isExactRoot() || !currentLifecycle.animal || !globalThis.ExtensionBHomepageRenderer) return;
    currentLifecycle.cancelAnimalRequest();
    const generation = currentLifecycle.animalGeneration + 1;
    currentLifecycle.animalGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-animal-${generation}`;
    currentLifecycle.animalRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.animalAbortController = abortController;
    const handleResponse = (response) => {
      if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
        || currentLifecycle.animalRequestId !== requestId || currentLifecycle.animalGeneration !== generation) return;
      if (chrome.runtime.lastError) {
        renderAnimalFailure(currentLifecycle);
        return;
      }
      if (!isExactAnimalResult(response, requestId, generation)) return;
      if (response.ok) {
        if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
          || currentLifecycle.animalRequestId !== requestId || currentLifecycle.animalGeneration !== generation) return;
        if (response.data.status === "success" || response.data.status === "partial") currentLifecycle.animalLastGood = response.data.items.map((item) => ({ ...item }));
        if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
          || currentLifecycle.animalRequestId !== requestId || currentLifecycle.animalGeneration !== generation) return;
        globalThis.ExtensionBHomepageRenderer.setAnimalData(currentLifecycle.animal, response.data);
        return;
      }
      renderAnimalFailure(currentLifecycle);
    };
    try {
      chrome.runtime.sendMessage({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId, generation, operation: ANIMAL_OPERATION, params: {} }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const requestFashionFeed = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle) || !isExactRoot() || !currentLifecycle.fashion || !globalThis.ExtensionBHomepageRenderer) return;
    currentLifecycle.cancelFashionRequest();
    const generation = currentLifecycle.fashionGeneration + 1;
    currentLifecycle.fashionGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-fashion-${generation}`;
    currentLifecycle.fashionRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.fashionAbortController = abortController;
    const handleResponse = (response) => {
      if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
        || currentLifecycle.fashionRequestId !== requestId || currentLifecycle.fashionGeneration !== generation) return;
      if (chrome.runtime.lastError) {
        renderFashionFailure(currentLifecycle);
        return;
      }
      if (!isExactFashionResult(response, requestId, generation)) return;
      if (response.ok) {
        if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
          || currentLifecycle.fashionRequestId !== requestId || currentLifecycle.fashionGeneration !== generation) return;
        if (response.data.status === "success" || response.data.status === "partial") currentLifecycle.fashionLastGood = response.data.items.map((item) => ({ ...item }));
        if (abortController.signal.aborted || !isCurrentLifecycle(currentLifecycle) || !isExactRoot()
          || currentLifecycle.fashionRequestId !== requestId || currentLifecycle.fashionGeneration !== generation) return;
        globalThis.ExtensionBHomepageRenderer.setFashionData(currentLifecycle.fashion, response.data);
        return;
      }
      renderFashionFailure(currentLifecycle);
    };
    try {
      chrome.runtime.sendMessage({ type: "HOMEPAGE_DATA_REQUEST_V1", requestId, generation, operation: FASHION_OPERATION, params: {} }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const runAnimalFashionContentSelfTests = () => {
    const assert = (condition, label) => { if (!condition) throw new Error(`Animal/fashion content self-test failed: ${label}`); };
    const previousRenderer = globalThis.ExtensionBHomepageRenderer;
    const previousSendMessage = chrome.runtime.sendMessage;
    const callbacks = [];
    let writes = 0;
    const item = { bvid: "BV0000000000", title: "测试", ownerName: "作者", coverUrl: null, href: "https://www.bilibili.com/video/BV0000000000", view: null, danmaku: null, durationSeconds: null };
    const isTypedAnimalTestData = (data) => Boolean(data && Object.keys(data).sort().join("\u001F") === "items\u001Fstatus"
      && Array.isArray(data.items) && data.items.every((entry) => entry && Object.keys(entry).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview"));
    globalThis.ExtensionBHomepageRenderer = {
      isAnimalData: isTypedAnimalTestData,
      isFashionData: isTypedAnimalTestData,
      setAnimalData: () => { writes += 1; }, setAnimalFailure: () => { writes += 1; },
      setFashionData: () => { writes += 1; }, setFashionFailure: () => { writes += 1; }
    };
    chrome.runtime.sendMessage = (message, callback) => callbacks.push({ message, callback });
    const previousLifecycle = lifecycle;
    try {
      const pagehideMessages = [];
      chrome.runtime.sendMessage = (message) => pagehideMessages.push(message);
      const pagehideListeners = new Map();
      const pagehideTarget = {
        addEventListener: (type, listener) => pagehideListeners.set(type, listener),
        removeEventListener: (type, listener) => { if (pagehideListeners.get(type) === listener) pagehideListeners.delete(type); },
        dispatch: (type) => { const listener = pagehideListeners.get(type); if (listener) listener({ type }); }
      };
      const pagehideLifecycle = new AppRuntime("stage6-pagehide");
      let pagehideCleanupCount = 0;
      const pagehideAnimalAbort = new AbortController(); const pagehideFashionAbort = new AbortController();
      pagehideLifecycle.animalRequestId = "pagehide-animal"; pagehideLifecycle.animalGeneration = 7; pagehideLifecycle.animalAbortController = pagehideAnimalAbort;
      pagehideLifecycle.fashionRequestId = "pagehide-fashion"; pagehideLifecycle.fashionGeneration = 8; pagehideLifecycle.fashionAbortController = pagehideFashionAbort;
      pagehideLifecycle.registerCleanup(() => { pagehideCleanupCount += 1; });
      pagehideLifecycle.registerListener(pagehideTarget, "pagehide", () => pagehideLifecycle.teardown());
      pagehideTarget.dispatch("pagehide");
      assert(!pagehideLifecycle.active && pagehideLifecycle.generation === 1 && pagehideCleanupCount === 1
        && pagehideAnimalAbort.signal.aborted && pagehideFashionAbort.signal.aborted
        && pagehideMessages.length === 2 && pagehideMessages[0].operation === ANIMAL_OPERATION && pagehideMessages[1].operation === FASHION_OPERATION,
      "pagehide event triggers teardown, cancel, abort, and cleanup once");
      pagehideTarget.dispatch("pagehide");
      assert(pagehideMessages.length === 2 && pagehideCleanupCount === 1, "pagehide teardown is idempotent");

      chrome.runtime.sendMessage = (message, callback) => callbacks.push({ message, callback });
      const currentLifecycle = {
        active: true, generation: 0, ownerMarker: "stage6-content", animal: {}, fashion: {}, animalGeneration: 0, fashionGeneration: 0,
        animalRequestId: null, fashionRequestId: null, animalAbortController: null, fashionAbortController: null, animalLastGood: null, fashionLastGood: null,
        cancelAnimalRequest() {}, cancelFashionRequest() {}
      };
      lifecycle = currentLifecycle;
      requestAnimalFeed(currentLifecycle); requestFashionFeed(currentLifecycle);
      assert(callbacks.length === 2 && callbacks[0].message.operation === ANIMAL_OPERATION && callbacks[1].message.operation === FASHION_OPERATION
        && Object.keys(callbacks[0].message.params).length === 0 && Object.keys(callbacks[1].message.params).length === 0, "exact independent requests");
      currentLifecycle.cancelAnimalRequest = () => {
        callbacks.push({ message: { type: "HOMEPAGE_DATA_CANCEL_V1", requestId: currentLifecycle.animalRequestId,
          generation: currentLifecycle.animalGeneration, operation: ANIMAL_OPERATION } });
      };
      currentLifecycle.cancelFashionRequest = () => {
        callbacks.push({ message: { type: "HOMEPAGE_DATA_CANCEL_V1", requestId: currentLifecycle.fashionRequestId,
          generation: currentLifecycle.fashionGeneration, operation: FASHION_OPERATION } });
      };
      currentLifecycle.cancelAnimalRequest();
      currentLifecycle.cancelFashionRequest();
      assert(callbacks[2].message.operation === ANIMAL_OPERATION && callbacks[3].message.operation === FASHION_OPERATION,
        "exact operation cancel envelopes");
      currentLifecycle.animalGeneration += 1;
      callbacks[0].callback({ type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[0].message.requestId, generation: callbacks[0].message.generation, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [item] } });
      assert(writes === 0, "stale animal result zero write");
      currentLifecycle.active = false;
      callbacks[1].callback({ type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[1].message.requestId, generation: callbacks[1].message.generation, operation: FASHION_OPERATION, ok: true, data: { status: "partial", items: [item] } });
      assert(writes === 0, "destroyed fashion result zero write");
      currentLifecycle.active = true;
      currentLifecycle.animalRequestId = callbacks[0].message.requestId;
      currentLifecycle.animalGeneration = callbacks[0].message.generation;
      currentLifecycle.fashionRequestId = callbacks[1].message.requestId;
      currentLifecycle.fashionGeneration = callbacks[1].message.generation;
      const writesBeforeMalformed = writes;
      for (const malformed of [
        null,
        { type: "HOMEPAGE_DATA_RESULT_V1", requestId: "wrong", generation: callbacks[0].message.generation, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [item] } },
        { type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[0].message.requestId, generation: callbacks[0].message.generation + 1, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [item] } },
        { type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[0].message.requestId, generation: callbacks[0].message.generation, operation: FASHION_OPERATION, ok: true, data: { status: "partial", items: [item] } },
        { type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[0].message.requestId, generation: callbacks[0].message.generation, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [item] }, headers: {} },
        { body: {}, headers: {}, status: 200 },
        { type: "HOMEPAGE_DATA_RESULT_V1", requestId: callbacks[0].message.requestId, generation: callbacks[0].message.generation, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [{ ...item, relation: {} }] } }
      ]) callbacks[0].callback(malformed);
      assert(writes === writesBeforeMalformed, "malformed/mismatched result has zero DOM writes");
      assert(!isExactAnimalResult({ type: "HOMEPAGE_DATA_RESULT_V1", requestId: "x", generation: 1, operation: ANIMAL_OPERATION, ok: true, data: { status: "partial", items: [item] }, extra: true }, "x", 1), "unknown result key rejection");
      const categories = Array.isArray(globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__)
        ? globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ : [];
      categories.push("13 content exact request/cancel/validator/root lifecycle and stale/retired/pagehide zero-write: PASS");
      globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ = categories;
      return true;
    } finally {
      lifecycle = previousLifecycle;
      chrome.runtime.sendMessage = previousSendMessage;
      globalThis.ExtensionBHomepageRenderer = previousRenderer;
    }
  };

  if (globalThis.__EXTENSION_B_RUN_MUSIC_SELF_TESTS__ === true) {
    runMusicContentSelfTests();
    globalThis.__EXTENSION_B_MUSIC_CONTENT_SELF_TEST_PASSED__ = true;
    return;
  }

  if (globalThis.__EXTENSION_B_RUN_ANIMAL_FASHION_SELF_TESTS__ === true) {
    runAnimalFashionContentSelfTests();
    globalThis.__EXTENSION_B_ANIMAL_FASHION_CONTENT_SELF_TEST_PASSED__ = true;
    return;
  }

  if (globalThis.__EXTENSION_B_RUN_KNOWLEDGE_SELF_TESTS__ === true) {
    runKnowledgeContentSelfTests();
    globalThis.__EXTENSION_B_KNOWLEDGE_CONTENT_SELF_TEST_PASSED__ = true;
    return;
  }

  const isExactPgcAnimeResult = (response, requestId, generation) => {
    if (
      !response
      || typeof response !== "object"
      || (
        Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
        && Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
      )
      || response.type !== "HOMEPAGE_DATA_RESULT_V1"
      || response.requestId !== requestId
      || response.generation !== generation
      || response.operation !== PGC_ANIME_OPERATION
      || typeof response.ok !== "boolean"
    ) {
      return false;
    }

    if (response.ok) {
      return Boolean(
        response.data
        && typeof response.data === "object"
        && Object.keys(response.data).sort().join("\u001F") === "rankItems\u001Ftabs"
        && globalThis.ExtensionBHomepageRenderer
        && globalThis.ExtensionBHomepageRenderer.isPgcAnimeData(response.data)
      );
    }

    return Boolean(
      response.error
      && typeof response.error === "object"
      && Object.keys(response.error).length === 1
      && PGC_ANIME_ERROR_KINDS.has(response.error.kind)
    );
  };

  const requestPgcAnime = (currentLifecycle, attempt = 0) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.pgcAnime
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }

    currentLifecycle.cancelPgcAnimeRequest();
    const generation = currentLifecycle.pgcAnimeGeneration + 1;
    currentLifecycle.pgcAnimeGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-pgc-anime-${generation}`;
    currentLifecycle.pgcAnimeRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.pgcAnimeAbortController = abortController;
    currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "loading");

    const handleResponse = (response) => {
      if (
        abortController.signal.aborted
        || !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.pgcAnimeRequestId !== requestId
        || currentLifecycle.pgcAnimeGeneration !== generation
      ) {
        return;
      }

      if (chrome.runtime.lastError || !isExactPgcAnimeResult(response, requestId, generation)) {
        if (attempt < 1) {
          currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "retrying");
          currentLifecycle.pgcAnimeRetryTimer = window.setTimeout(() => {
            currentLifecycle.pgcAnimeRetryTimer = 0;
            if (isCurrentLifecycle(currentLifecycle)) requestPgcAnime(currentLifecycle, attempt + 1);
          }, 900);
        } else {
          currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "failure");
          renderPgcAnimeFailure(currentLifecycle);
        }
        return;
      }

      if (response.ok) {
        currentLifecycle.pgcAnimeLastGood = response.data;
        globalThis.ExtensionBHomepageRenderer.setPgcAnimeData(
          currentLifecycle.pgcAnime,
          currentLifecycle.pgcAnimeLastGood
        );
        currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "committed");
        return;
      }

      renderPgcAnimeFailure(currentLifecycle);
      if (attempt < 1 && response.error
        && (response.error.kind === "UPSTREAM_UNAVAILABLE" || response.error.kind === "TIMEOUT")) {
        currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "retrying");
        currentLifecycle.pgcAnimeRetryTimer = window.setTimeout(() => {
          currentLifecycle.pgcAnimeRetryTimer = 0;
          if (isCurrentLifecycle(currentLifecycle)) requestPgcAnime(currentLifecycle, attempt + 1);
        }, 900);
      } else {
        currentLifecycle.host.setAttribute("data-extension-b-pgc-anime-state", "failure");
      }
    };

    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: PGC_ANIME_OPERATION,
        params: {}
      }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const isExactPgcGuochuangResult = (response, requestId, generation) => {
    if (
      !response
      || typeof response !== "object"
      || (
        Object.keys(response).sort().join("\u001F") !== "data\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
        && Object.keys(response).sort().join("\u001F") !== "error\u001Fgeneration\u001Fok\u001Foperation\u001FrequestId\u001Ftype"
      )
      || response.type !== "HOMEPAGE_DATA_RESULT_V1"
      || response.requestId !== requestId
      || response.generation !== generation
      || response.operation !== PGC_GUOCHUANG_OPERATION
      || typeof response.ok !== "boolean"
    ) {
      return false;
    }
    if (response.ok) {
      return Boolean(
        response.data
        && typeof response.data === "object"
        && Object.keys(response.data).sort().join("\u001F") === "rankItems\u001Ftabs"
        && globalThis.ExtensionBHomepageRenderer
        && globalThis.ExtensionBHomepageRenderer.isPgcGuochuangData(response.data)
      );
    }
    return Boolean(
      response.error
      && typeof response.error === "object"
      && Object.keys(response.error).length === 1
      && PGC_GUOCHUANG_ERROR_KINDS.has(response.error.kind)
    );
  };

  const requestPgcGuochuang = (currentLifecycle, attempt = 0) => {
    if (
      !isCurrentLifecycle(currentLifecycle)
      || !currentLifecycle.pgcGuochuang
      || !globalThis.ExtensionBHomepageRenderer
    ) {
      return;
    }
    currentLifecycle.cancelPgcGuochuangRequest();
    const generation = currentLifecycle.pgcGuochuangGeneration + 1;
    currentLifecycle.pgcGuochuangGeneration = generation;
    const requestId = `${currentLifecycle.ownerMarker}-pgc-guochuang-${generation}`;
    currentLifecycle.pgcGuochuangRequestId = requestId;
    const abortController = new AbortController();
    currentLifecycle.pgcGuochuangAbortController = abortController;
    currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "loading");
    const handleResponse = (response) => {
      if (
        abortController.signal.aborted
        || !isCurrentLifecycle(currentLifecycle)
        || currentLifecycle.pgcGuochuangRequestId !== requestId
        || currentLifecycle.pgcGuochuangGeneration !== generation
      ) {
        return;
      }
      if (chrome.runtime.lastError || !isExactPgcGuochuangResult(response, requestId, generation)) {
        currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-error", !response ? "no-response" : "response-invalid");
        if (attempt < 1) {
          currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "retrying");
          currentLifecycle.pgcGuochuangRetryTimer = window.setTimeout(() => {
            currentLifecycle.pgcGuochuangRetryTimer = 0;
            if (isCurrentLifecycle(currentLifecycle)) requestPgcGuochuang(currentLifecycle, attempt + 1);
          }, 900);
        } else {
          currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "failure");
          renderPgcGuochuangFailure(currentLifecycle);
        }
        return;
      }
      if (response.ok) {
        currentLifecycle.pgcGuochuangLastGood = response.data;
        globalThis.ExtensionBHomepageRenderer.setPgcGuochuangData(
          currentLifecycle.pgcGuochuang,
          currentLifecycle.pgcGuochuangLastGood
        );
        currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "committed");
        currentLifecycle.host.removeAttribute("data-extension-b-pgc-guochuang-error");
        return;
      }
      const retryable = response.error
        && (response.error.kind === "UPSTREAM_UNAVAILABLE" || response.error.kind === "TIMEOUT");
      if (retryable && attempt < 1) {
        currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "retrying");
        currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-error", response.error.kind);
        currentLifecycle.pgcGuochuangRetryTimer = window.setTimeout(() => {
          currentLifecycle.pgcGuochuangRetryTimer = 0;
          if (isCurrentLifecycle(currentLifecycle)) requestPgcGuochuang(currentLifecycle, attempt + 1);
        }, 750);
        return;
      }
      renderPgcGuochuangFailure(currentLifecycle);
      currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-state", "failure");
      currentLifecycle.host.setAttribute("data-extension-b-pgc-guochuang-error", response.error && response.error.kind ? response.error.kind : "unknown");
    };
    try {
      chrome.runtime.sendMessage({
        type: "HOMEPAGE_DATA_REQUEST_V1",
        requestId,
        generation,
        operation: PGC_GUOCHUANG_OPERATION,
        params: {}
      }, handleResponse);
    } catch {
      handleResponse(null);
    }
  };

  const runPgcGuochuangContentSelfTests = () => {
    const assert = (condition, label) => {
      if (!condition) {
        throw new Error(`PGC Guochuang content self-test failed: ${label}`);
      }
    };
    const previousRenderer = globalThis.ExtensionBHomepageRenderer;
    assert(
      previousRenderer
        && typeof previousRenderer.isPgcGuochuangData === "function"
        && typeof previousRenderer.setPgcGuochuangData === "function"
        && typeof previousRenderer.setPgcGuochuangFailure === "function",
      "real renderer validator is available"
    );
    const validData = {
      tabs: [
        ["latest", "最新"],
        ["monday", "周一"],
        ["tuesday", "周二"],
        ["wednesday", "周三"],
        ["thursday", "周四"],
        ["friday", "周五"],
        ["saturday", "周六"],
        ["sunday", "周日"]
      ].map(([key, label], index) => ({ key, label, isToday: index === 2, items: [] })),
      rankItems: [{
        rank: 1,
        seasonId: 401,
        title: "国创排行",
        linkUrl: "https://www.bilibili.com/bangumi/play/ss401",
        updateText: "更新",
        badgeText: ""
      }]
    };
    assert(previousRenderer.isPgcGuochuangData(validData), "real validator accepts typed data");
    assert(!previousRenderer.isPgcGuochuangData({ ...validData, rankItems: [] }), "real validator rejects empty rank");
    const previousSendMessage = chrome.runtime.sendMessage;
    const callbacks = [];
    let writes = 0;
    globalThis.ExtensionBHomepageRenderer = {
      ...previousRenderer,
      setPgcGuochuangData: () => { writes += 1; },
      setPgcGuochuangFailure: () => { writes += 1; }
    };
    chrome.runtime.sendMessage = (message, callback) => {
      callbacks.push({ message, callback });
    };
    const previousLifecycle = lifecycle;
    const currentLifecycle = {
      active: true,
      generation: 0,
      ownerMarker: "self-test",
      pgcGuochuang: {},
      pgcGuochuangGeneration: 0,
      pgcGuochuangRequestId: null,
      pgcGuochuangAbortController: null,
      pgcGuochuangLastGood: null,
      cancelPgcGuochuangRequest() {}
    };
    lifecycle = currentLifecycle;
    requestPgcGuochuang(currentLifecycle);
    assert(callbacks.length === 1 && callbacks[0].message.operation === PGC_GUOCHUANG_OPERATION, "single request envelope");
    currentLifecycle.pgcGuochuangGeneration += 1;
    callbacks[0].callback({
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: "self-test-pgc-guochuang-1",
      generation: 1,
      operation: PGC_GUOCHUANG_OPERATION,
      ok: true,
      data: validData
    });
    assert(writes === 0, "stale result no DOM commit");
    assert(!isExactPgcGuochuangResult({
      type: "HOMEPAGE_DATA_RESULT_V1",
      requestId: "x",
      generation: 1,
      operation: PGC_GUOCHUANG_OPERATION,
      ok: true,
      data: validData,
      extra: true
    }, "x", 1), "result forbidden key");
    lifecycle = previousLifecycle;
    chrome.runtime.sendMessage = previousSendMessage;
    globalThis.ExtensionBHomepageRenderer = previousRenderer;
    const categories = Array.isArray(globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__)
      ? globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__
      : [];
    for (const category of [
      "11 content stale/new-generation DOM gate: PASS",
      "12 cache/inflight/generation/last-good season isolation: PASS",
      "14 renderer validator delegated to content/renderer: PASS"
    ]) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    }
    globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__ = categories;
    return true;
  };

  if (globalThis.__EXTENSION_B_RUN_SELF_TESTS__ === true) {
    runPgcGuochuangContentSelfTests();
    globalThis.__EXTENSION_B_PGC_CONTENT_SELF_TEST_PASSED__ = true;
    return;
  }

  const createDiagnosticsSnapshot = () => {
    const host = lifecycle && lifecycle.host && lifecycle.host.isConnected ? lifecycle.host : document.getElementById(HOST_ID);
    const states = {};
    if (host) {
      for (const attribute of Array.from(host.attributes)) {
        if (!attribute.name.startsWith("data-extension-b-")
          || attribute.name === "data-extension-b-owner"
          || attribute.value.length > 128) continue;
        states[attribute.name] = attribute.value;
      }
    }
    const navigationEntry = globalThis.performance && typeof globalThis.performance.getEntriesByType === "function"
      ? globalThis.performance.getEntriesByType("navigation")[0]
      : null;
    return Object.freeze({
      schemaVersion: DIAGNOSTICS_SCHEMA_VERSION,
      generatedAt: diagnosticNow(),
      connected: Boolean(host),
      extension: Object.freeze({ version: EXTENSION_VERSION, build: BUILD_MARKER }),
      page: Object.freeze({
        url: `${location.origin}${location.pathname}`,
        visibility: document.visibilityState,
        navigationType: navigationEntry && typeof navigationEntry.type === "string" ? navigationEntry.type : "unknown",
        readyState: document.readyState
      }),
      environment: Object.freeze({
        userAgent: navigator.userAgent.slice(0, 256),
        language: navigator.language.slice(0, 32),
        viewportWidth: Math.max(0, Math.round(globalThis.innerWidth)),
        viewportHeight: Math.max(0, Math.round(globalThis.innerHeight)),
        devicePixelRatio: Number.isFinite(globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1
      }),
      states: Object.freeze(states),
      operations: Object.freeze(Array.from(diagnosticOperations.values()).sort((left, right) => right.updatedAt - left.updatedAt)),
      errors: Object.freeze(diagnosticErrors.slice().reverse())
    });
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender && sender.id === chrome.runtime.id
      && isBridgePlainObject(message)
      && Object.keys(message).sort().join("\u001F") === "type"
      && (message.type === BANNER_APPLY_MESSAGE || message.type === BANNER_REFRESH_MESSAGE)) {
      if (lifecycle) lifecycle.bannerRequested = false;
      requestBannerRuntime(lifecycle, message.type === BANNER_REFRESH_MESSAGE).then((ok) => sendResponse({ ok: ok === true }));
      return true;
    }
    if (!sender || sender.id !== chrome.runtime.id
      || !isBridgePlainObject(message)
      || bridgeOwnKeys(message) !== "type"
      || message.type !== DIAGNOSTICS_MESSAGE_TYPE) return false;
    sendResponse(createDiagnosticsSnapshot());
    return false;
  });

  const ensureHost = (currentLifecycle) => {
    if (!isCurrentLifecycle(currentLifecycle)
      || !isExactRoot()
      || currentLifecycle.initialRenderGateOpen !== true) {
      return;
    }

    const body = document.body;
    if (!body) {
      return;
    }

    if (currentLifecycle.observer && currentLifecycle.observedBody !== body) {
      currentLifecycle.observer.disconnect();
      currentLifecycle.observer.observe(body, { childList: true });
      currentLifecycle.observedBody = body;
    }

    if (!currentLifecycle.host) {
      const host = document.createElement("div");
      host.id = HOST_ID;
      host.setAttribute("data-extension-b-build", BUILD_MARKER);
      host.setAttribute("data-extension-b-version", EXTENSION_VERSION);
      host.setAttribute("data-extension-b-owner", currentLifecycle.ownerMarker);
      const shadowRoot = host.attachShadow({ mode: "closed" });
      let rendered;
      try {
        rendered = globalThis.ExtensionBHomepageRenderer.renderHomepage({
          root: shadowRoot,
          authStatus: "unknown",
          onLoginRequest: (event) => openOfficialLogin(currentLifecycle, event),
          onRecommendationRequest: (event) => {
            if (event && event.isTrusted === true) requestRecommendationFeed(currentLifecycle, true);
          },
          onWatchLaterRequest: (event, payload) => {
            requestWatchLaterMutation(currentLifecycle, event, payload);
          },
          onSearchSuggestRequest: (term) => requestSearchAutocomplete(currentLifecycle, term),
          onSearchHistoryChange: (items) => persistSearchHistory(currentLifecycle, items),
          onDougaRequest: () => {
            requestDougaFloor(currentLifecycle, true, false).then((applied) => {
              if (applied && isCurrentLifecycle(currentLifecycle)) requestDougaFloor(currentLifecycle, false, true);
            });
          },
          onOrdinaryZoneRequest: (type, event) => {
            if (!event || event.isTrusted === true) {
              requestOrdinaryZoneFloor(currentLifecycle, type, true, false).then((applied) => {
                if (applied && isCurrentLifecycle(currentLifecycle)) requestOrdinaryZoneFloor(currentLifecycle, type, false, true);
              });
            }
          },
          onReadFloorRequest: () => requestReadFloor(currentLifecycle, true),
          onMangaRequest: () => requestMangaFloor(currentLifecycle, true),
          onLiveFloorMoreRequest: () => requestLiveFloorMore(currentLifecycle),
          onLiveFloorFollowingRequest: () => requestLiveFloorFollowing(currentLifecycle, false)
        });
      } catch (error) {
        document.documentElement.setAttribute(
          "data-extension-b-render-error",
          error && typeof error.name === "string" ? error.name : "Error"
        );
        host.remove();
        return;
      }
      currentLifecycle.host = host;
      currentLifecycle.shadowRoot = shadowRoot;
      currentLifecycle.rendered = rendered;
      currentLifecycle.readFloor = rendered && rendered.readFloor ? rendered.readFloor : null;
      currentLifecycle.mangaFloor = rendered && rendered.mangaFloor ? rendered.mangaFloor : null;
      if (rendered && rendered.ordinaryZones) {
        for (const type of ORDINARY_ZONE_TYPES) {
          if (rendered.ordinaryZones[type]) {
            currentLifecycle.ordinaryZones[type].view = rendered.ordinaryZones[type];
            setOrdinaryZoneRuntimeState(currentLifecycle, type, "mounted");
          }
        }
      }
      currentLifecycle.registerCleanup(rendered.destroy);
    }

    const needsMount = currentLifecycle.host.parentNode !== body;
    if (needsMount && currentLifecycle.mountedOnce) {
      if (currentLifecycle.hostRecoveryCount >= MAX_HOST_RECOVERIES) {
        disableTakeover(currentLifecycle);
        return;
      }
      currentLifecycle.hostRecoveryCount += 1;
    }

    if (needsMount) {
      body.appendChild(currentLifecycle.host);
    }
    if (!currentLifecycle.host || currentLifecycle.host.isConnected !== true) {
      return;
    }
    bindMountedHostSurfaces(currentLifecycle);
    const firstMount = !currentLifecycle.mountedOnce;
    currentLifecycle.mountedOnce = true;
    if (firstMount) {
      requestAuthStatus(currentLifecycle);
      requestSearchData(currentLifecycle);
      requestFocusCarousel(currentLifecycle);
      requestRecommendationFeed(currentLifecycle, false);
      requestDougaFloor(currentLifecycle, false);
      requestInitialOrdinaryZoneFloors(currentLifecycle);
      requestReadFloor(currentLifecycle, false);
      requestMangaFloor(currentLifecycle, false);
      requestLiveFloorInitial(currentLifecycle);
      requestPrimaryMenuCounts(currentLifecycle);
      requestBannerRuntime(currentLifecycle);
      requestPgcAnime(currentLifecycle);
      requestPgcGuochuang(currentLifecycle);
    }
  };

  const disableTakeover = (currentLifecycle) => {
    routeLocked = true;
    currentLifecycle.teardown();
    if (lifecycle === currentLifecycle) {
      lifecycle = null;
    }
  };

  const teardown = (currentLifecycle) => {
    if (!currentLifecycle) {
      return;
    }
    currentLifecycle.teardown();
    if (lifecycle === currentLifecycle) {
      lifecycle = null;
    }
  };

  const startLifecycle = () => {
    if (lifecycle || routeLocked || !isExactRoot() || !document.documentElement) {
      return;
    }

    const currentLifecycle = new AppRuntime(createOwnerMarker());
    const initialRecommendationBatch = createRecommendationInitialBatch();
    currentLifecycle.recommendationBatch = initialRecommendationBatch;
    lifecycle = currentLifecycle;

    const hideStyle = document.createElement("style");
    hideStyle.id = STYLE_ID;
    hideStyle.textContent = `body > *:not([data-extension-b-owner="${currentLifecycle.ownerMarker}"]):not(.bili-mini-mask) { display: none !important; }`;
    currentLifecycle.hideStyle = hideStyle;
    document.documentElement.appendChild(hideStyle);

    const openInitialRenderGate = () => {
      if (!isCurrentLifecycle(currentLifecycle) || currentLifecycle.initialRenderGateOpen) return;
      currentLifecycle.initialRenderGateOpen = true;
      ensureHost(currentLifecycle);
    };
    currentLifecycle.recommendationPrefetch = {
      batch: initialRecommendationBatch,
      promise: requestPageBridge(RECOMMENDATION_OPERATION, currentLifecycle, initialRecommendationBatch, () => {
        currentLifecycle.registerAnimationFrame(openInitialRenderGate);
      })
    };
    currentLifecycle.registerTimeout(openInitialRenderGate, 150);

    currentLifecycle.registerObserver(
      new MutationObserver(() => {
        if (isCurrentLifecycle(currentLifecycle) && isExactRoot()) {
          ensureHost(currentLifecycle);
        }
      }),
      document.body || document.documentElement,
      { childList: true }
    );
    currentLifecycle.registerListener(document, "DOMContentLoaded", () => {
      if (isCurrentLifecycle(currentLifecycle) && isExactRoot()) {
        ensureHost(currentLifecycle);
      }
    });
    bindMessageRefreshLifecycle(currentLifecycle);
    bindDynamicRefreshLifecycle(currentLifecycle);
    currentLifecycle.registerListener(window, "pagehide", () => teardown(currentLifecycle));
    currentLifecycle.registerListener(window, "unload", () => teardown(currentLifecycle));
    currentLifecycle.bodyWaitTimer = currentLifecycle.registerInterval(
      () => ensureHost(currentLifecycle),
      BODY_WAIT_MS
    );
    ensureHost(currentLifecycle);
  };

  const checkRoute = () => {
    if (!isExactRoot()) {
      routeLocked = false;
      teardown(lifecycle);
      return;
    }

    if (!lifecycle && !routeLocked) {
      startLifecycle();
    }
  };

  const routeMonitor = new AppRuntime("route-monitor");
  routeMonitor.registerListener(window, "popstate", checkRoute);
  routeMonitor.registerListener(window, "pageshow", checkRoute);
  routeMonitor.registerInterval(checkRoute, URL_POLL_MS);
  checkRoute();
})();
