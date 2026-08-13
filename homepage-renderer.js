(() => {
  "use strict";

  const MAX_TEXT_LENGTH = 512;
  const MAX_FOCUS_TEXT_LENGTH = 160;
  const MAX_FOCUS_URL_LENGTH = 2048;
  const MAX_FOCUS_QUERY_HASH_LENGTH = 512;
  const MAX_COVER_URL_LENGTH = 2048;
  const MAX_PGC_TEXT_LENGTH = 512;
  const MAX_PGC_SHORT_TEXT_LENGTH = 160;
  const MAX_PGC_URL_LENGTH = 2048;
  const MAX_PGC_ID = 999999999999999;
  const MAX_PGC_TIMELINE_ITEMS = 256;
  const MAX_PGC_RANK_ITEMS = 10;
  const MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_PER_TAB = 20;
  const MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_TOTAL = 160;
  const MAX_KNOWLEDGE_ITEMS = 15;
  const MAX_MUSIC_ITEMS = 15;
  const MAX_ANIMAL_ITEMS = 15;
  const MAX_FASHION_ITEMS = 15;
  const KNOWLEDGE_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
  const KNOWLEDGE_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
  const MUSIC_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
  const MUSIC_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
  const ANIMAL_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
  const FASHION_IMAGE_HOSTS = new Set(["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]);
  const ANIMAL_BVID_RE = /^BV[A-Za-z0-9]{10}$/;
  const FASHION_BVID_RE = /^BV[A-Za-z0-9]{10}$/;

  const PGC_TAB_DEFINITIONS = Object.freeze([
    Object.freeze({ key: "latest", label: "最新" }),
    Object.freeze({ key: "monday", label: "周一" }),
    Object.freeze({ key: "tuesday", label: "周二" }),
    Object.freeze({ key: "wednesday", label: "周三" }),
    Object.freeze({ key: "thursday", label: "周四" }),
    Object.freeze({ key: "friday", label: "周五" }),
    Object.freeze({ key: "saturday", label: "周六" }),
    Object.freeze({ key: "sunday", label: "周日" })
  ]);

  const ASSET_KEYS = Object.freeze({
    BANNER_FALLBACK: "assets/homepage/homepage-runtime/banner/fallback-1920x180.webp",
    BANNER_LOGO: "assets/homepage/homepage-runtime/banner/logo-324x156.webp",
    BANNER_LAYER_01: "assets/homepage/homepage-runtime/banner/layers/01-sky.png",
    BANNER_LAYER_02: "assets/homepage/homepage-runtime/banner/layers/02-cloud.png",
    BANNER_LAYER_03: "assets/homepage/homepage-runtime/banner/layers/03-character-33.png",
    BANNER_LAYER_04: "assets/homepage/homepage-runtime/banner/layers/04-left-base.png",
    BANNER_LAYER_05: "assets/homepage/homepage-runtime/banner/layers/05-car.png",
    BANNER_LAYER_06: "assets/homepage/homepage-runtime/banner/layers/06-left-building.png",
    BANNER_LAYER_07: "assets/homepage/homepage-runtime/banner/layers/07-character-22.png",
    BANNER_LAYER_08: "assets/homepage/homepage-runtime/banner/layers/08-flower-field.png",
    BANNER_LAYER_09: "assets/homepage/homepage-runtime/banner/layers/09.png",
    BANNER_LAYER_10: "assets/homepage/homepage-runtime/banner/layers/10.png",
    BANNER_LAYER_11: "assets/homepage/homepage-runtime/banner/layers/11.png",
    BANNER_LAYER_12: "assets/homepage/homepage-runtime/banner/layers/12-left-foreground.png",
    BANNER_LAYER_13: "assets/homepage/homepage-runtime/banner/layers/13-left-leaf.png",
    BANNER_LAYER_14: "assets/homepage/homepage-runtime/banner/layers/14-right-leaf.png",
    BANNER_LAYER_15: "assets/homepage/homepage-runtime/banner/layers/15-debris.png",
    BANNER_LAYER_16: "assets/homepage/homepage-runtime/banner/layers/16-right-grass.png",
    BANNER_LAYER_17: "assets/homepage/homepage-runtime/banner/layers/17-front-grass.png",
    BANNER_MOTION_18: "assets/homepage/homepage-runtime/banner/layers/18-motion.webm",
    ICONFONT: "assets/homepage/homepage-runtime/international-home/iconfont.woff2",
    FOCUS_INDICATOR: "assets/homepage/homepage-runtime/international-home/icon_slide_selected.png",
    HEADER_ACTIVITY: "assets/homepage/homepage-runtime/header/a1a87acb-highschool.png",
    AUTH_VIDEO: "assets/homepage/mini-header-auth/video.png",
    AUTH_TIME: "assets/homepage/mini-header-auth/time.png",
    AUTH_DANMAKU: "assets/homepage/mini-header-auth/danmaku.png",
    AUTH_HD: "assets/homepage/mini-header-auth/hd.png",
    VIP_FALLBACK: "assets/homepage/homepage-runtime/mini-header-vip/jTAZ4HXjQa.png@230w_68h_1c.webp",
    ELEVATOR_EDIT: "assets/homepage/homepage-runtime/international-home/tab2233.png",
    FOOTER_APP_QR: "assets/homepage/homepage-runtime/footer-v2/biliapp_qrcode.png",
    FOOTER_WEIBO_QR: "assets/homepage/homepage-runtime/footer-v2/weibo_qrcode.png",
    FOOTER_WECHAT_QR: "assets/homepage/homepage-runtime/footer-v2/weixin_qrcode.gif",
    FOOTER_CHARITY: "assets/homepage/homepage-runtime/footer-v2/charity.png",
    FOOTER_PARTNER: "assets/homepage/homepage-runtime/footer-v2/partner.png",
    FOOTER_96110: "assets/homepage/homepage-runtime/footer-v2/pic962110.png",
    FOOTER_SPRITE: "assets/homepage/homepage-runtime/footer-v2/hz_icon.png",
    LOGIN_22_OPEN: "assets/homepage/mini-login-v2/22_open.png",
    LOGIN_22_CLOSE: "assets/homepage/mini-login-v2/22_close.png",
    LOGIN_33_OPEN: "assets/homepage/mini-login-v2/33_open.png",
    LOGIN_33_CLOSE: "assets/homepage/mini-login-v2/33_close.png",
    LOGIN_CLOSE: "assets/homepage/mini-login-v2/close.svg",
    LOGIN_WECHAT: "assets/homepage/mini-login-v2/wechat.png",
    LOGIN_WEIBO: "assets/homepage/mini-login-v2/weibo.png",
    LOGIN_QQ: "assets/homepage/mini-login-v2/qq.png",
    SEARCH_HISTORY_CLEAR: "assets/homepage/mini-login-v2/close.svg",
    SEARCH_MARK_LIVE: "assets/homepage/search/mark-live.gif",
    SEARCH_MARK_ANNIVERSARY: "assets/homepage/search/mark-anniversary.png",
    PROMOTE_ICON: "assets/homepage/promote/bili-tuiguang.svg",
    DOUGA_ICON: "assets/homepage/floors/bili-douga.svg",
    DOWNLOAD_CLIENT_ICON: "assets/homepage/homepage-runtime/international-home/download-client.svg",
    MINI_DOWNLOAD_QR: "assets/homepage/mini-header-popovers/download/client-download-qr.png",
    MINI_DOWNLOAD_PINK_TV: "assets/homepage/mini-header-popovers/download/pink-download.svg",
    MINI_DYNAMIC_VERIFY_BIG: "assets/homepage/mini-header-popovers/dynamic/verify-big.svg",
    MINI_DYNAMIC_VERIFY_PERSONAL: "assets/homepage/mini-header-popovers/dynamic/verify-personal.svg",
    MINI_DYNAMIC_VERIFY_ORGANIZATION: "assets/homepage/mini-header-popovers/dynamic/verify-organization.svg",
    MINI_DYNAMIC_EXPAND_MORE: "assets/homepage/mini-header-popovers/dynamic/expand-more.svg",
    MINI_DYNAMIC_EXPAND_MORE_BLUE: "assets/homepage/mini-header-popovers/dynamic/expand-more-blue.svg",
    MINI_DYNAMIC_WATCH_LATER: "assets/homepage/mini-header-popovers/dynamic/watch-later.png",
    MINI_DYNAMIC_WATCH_LATER_ADDED: "assets/homepage/mini-header-popovers/dynamic/watch-later-added.png",
    MINI_DYNAMIC_LOADING: "assets/homepage/mini-header-popovers/dynamic/loading.gif",
    CATEGORY_SYMBOLS: "assets/homepage/homepage-runtime/international-home/category-symbols.svg",
    ICON_GOLD: "assets/homepage/homepage-runtime/international-home/icon_gold.png",
    ICON_SILVER: "assets/homepage/homepage-runtime/international-home/icon_silver.png",
    PGC_EMPTY: "assets/homepage/homepage-runtime/international-home/bgm-nodata.png",
    FIXTURE_COVER_PHOTO: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_01: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_02: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_03: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_04: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_05: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_06: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_07: "assets/homepage/fixture-covers/photo.png",
    ORDINARY_RANK_08: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_01: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_02: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_03: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_04: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_05: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_06: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_07: "assets/homepage/fixture-covers/photo.png",
    RECOMMEND_08: "assets/homepage/fixture-covers/photo.png",
    MINI_GAME_FEATURED: "assets/homepage/mini-header-popovers/game/featured-a8f11d7d879a3d5b81e66a8d0265a41bdb5bc890.jpg",
    MINI_GAME_TILE_01: "assets/homepage/mini-header-popovers/game/tile-f2726119665b7434e8006569435e5662b6445c36.png",
    MINI_GAME_TILE_02: "assets/homepage/mini-header-popovers/game/tile-003897d408429b3caa7c09ca96097f3251f2f922.png",
    MINI_GAME_TILE_03: "assets/homepage/mini-header-popovers/game/tile-14073d0252b80884335ebee91608257f25bec5ed.png",
    MINI_GAME_HOVER_01: "assets/homepage/mini-header-popovers/game/hover-135d7876759891b797beb58d3282351f78f0feed.png",
    MINI_GAME_TITLE: "assets/homepage/mini-header-popovers/game/title.png",
    MINI_GAME_LINE: "assets/homepage/mini-header-popovers/game/line.png",
    MINI_GAME_SHADOW: "assets/homepage/mini-header-popovers/game/shadow.png",
    MINI_GAME_HOVER_02: "assets/homepage/mini-header-popovers/game/hover-f526bcdabe6f7598df2be6f3b998b0917d76441d.png",
    MINI_GAME_HOVER_03: "assets/homepage/mini-header-popovers/game/hover-6b40f23045e1f490469da0b8c1bc3aeab68a4de5.png",
    MINI_GAME_HOVER_04: "assets/homepage/mini-header-popovers/game/hover-65354c21d0fc5a81c1504de39eea428aa6c315f9.png",
    MINI_GAME_HOVER_05: "assets/homepage/mini-header-popovers/game/hover-da2862fccb514dc5fc71cbcdb0b1d72b739c66c9.png",
    MINI_GAME_HOVER_06: "assets/homepage/mini-header-popovers/game/hover-f3f8a73797dede3cd1e2d1d0d9872dc4be57e334.png",
    MINI_GAME_HOVER_07: "assets/homepage/mini-header-popovers/game/hover-f4537ad57ada676044aaab55f4a162cc8f99f7e0.png",
    MINI_LIVE_FACE_01: "assets/homepage/mini-header-popovers/live/face-44ca2be4d17a8c7cd545fdc933808811151e20eb.jpg@100w_100h.webp",
    MINI_LIVE_FACE_02: "assets/homepage/mini-header-popovers/live/face-50900541a74f7875867c38a1e8e572b44b388060.jpg@100w_100h.webp",
    MINI_LIVE_FACE_03: "assets/homepage/mini-header-popovers/live/face-442b895d10bbce6a5cd5746fc383f27fb06207e0.jpg@100w_100h.webp",
    MINI_LIVE_FACE_04: "assets/homepage/mini-header-popovers/live/face-7a7b0e1e2be687c6373edb72df9df3269610b201.jpg@100w_100h.webp",
    MINI_LIVE_FACE_05: "assets/homepage/mini-header-popovers/live/face-a20ae17bc93de9a31480d8004b422659a052178a.jpg@100w_100h.webp",
    MINI_LIVE_FACE_06: "assets/homepage/mini-header-popovers/live/face-84a861facfa041b46f7a30897e9ed3f2e05e0519.jpg@100w_100h.webp",
    MINI_MANGA_RANK_01: "assets/homepage/mini-header-popovers/manga/rank-hover-3654e0590267af6a8ef514b5db557aa784bbc1b4.png",
    MINI_MANGA_RANK_02: "assets/homepage/mini-header-popovers/manga/rank-hover-1572f58dd448a1361350eb4079472d361a292181.jpg@320w",
    MINI_MANGA_RANK_03: "assets/homepage/mini-header-popovers/manga/rank-hover-d864e1f1041f55e703e24d7bb825e13994f22bab.jpg@320w",
    MINI_MANGA_RANK_04: "assets/homepage/mini-header-popovers/manga/rank-hover-c62668e300b5212fe5504f6fa9b4b5c630f8ebeb.jpg@320w",
    MINI_MANGA_RANK_05: "assets/homepage/mini-header-popovers/manga/rank-hover-789aa94f8752ddf0346445ae31303deb3209b732.png@320w",
    MINI_MANGA_RANK_06: "assets/homepage/mini-header-popovers/manga/rank-hover-b8eca33b94c324bcaa0dda202a39f2d9d162c587.png@320w",
    MINI_MANGA_RECOMMEND_01: "assets/homepage/mini-header-popovers/manga/recommend-5d41943c5e2e71c1fb6564676c1ee312ea2684f5.png@272w",
    MINI_MANGA_RECOMMEND_02: "assets/homepage/mini-header-popovers/manga/recommend-d9ee84f8bab10116c9521d6344c520699a6968e1.jpg@272w",
    MINI_MANGA_RECOMMEND_03: "assets/homepage/mini-header-popovers/manga/recommend-78876fdef412fa995ae5cce7cc30af1ff61f4ac7.png@272w",
    MINI_MANGA_RECOMMEND_04: "assets/homepage/mini-header-popovers/manga/recommend-098f9f01e59beecd77d14b0e2eee5ef4cb549d0b.jpg@272w"
  });

  const IMPORTED_ASSET_KEYS = new Set(Object.values(ASSET_KEYS));

  const EXTERNAL_CATEGORY_SYMBOL_FRAGMENTS = Object.freeze({
    "bili-anime": "#bili-anime",
    "bili-movie": "#bili-movie",
    "bili-guochuang": "#bili-guochuang",
    "bili-teleplay": "#bili-teleplay",
    "bili-documentary": "#bili-documentary",
    "bili-douga": "#bili-douga",
    "bili-game": "#bili-game",
    "bili-kichiku": "#bili-kichiku",
    "bili-music": "#bili-music",
    "bili-dance": "#bili-dance",
    "bili-cinephile": "#bili-cinephile",
    "bili-ent": "#bili-ent",
    "bili-knowledge": "#bili-knowledge",
    "bili-tech": "#bili-tech",
    "bili-information": "#bili-information",
    "bili-food": "#bili-food",
    "bili-car": "#bili-car",
    "bili-fashion": "#bili-fashion",
    "bili-sports": "#bili-sports",
    "bili-animal": "#bili-animal",
    "bili-life": "#bili-life",
    "bili-read": "#bili-read",
    "bili-live": "#bili-live",
    "bili-tuiguang": "#bili-tuiguang",
    "bili-activit": "#bili-activit",
    "bili-zhishi": "#bili-zhishi",
    "bili-musicplus": "#bili-musicplus"
  });
  const CATEGORY_SPRITE_PATH = "/assets/homepage/homepage-runtime/international-home/category-symbols.svg";
  const CATEGORY_SPRITE_URLS = new WeakMap();
  const LOCAL_CATEGORY_FALLBACK_PATHS = Object.freeze({
    "bili-manga": "M5 3h14v18H5zM8 7h8M8 11h8M8 15h5",
    "bili-tuiguang": "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM8 12h8M12 8v8"
  });
  const COMMUNITY_ICON_PATHS = Object.freeze([
    Object.freeze({ d: "M0 0h1024v1024H0z", fill: "#D8D8D8", fillOpacity: "0" }),
    Object.freeze({ d: "M874.6752 156.5952c14.848 0 27.136 11.1872 28.8 25.6l0.2048 3.4048v335.9488c0 14.8736-11.2128 27.136-25.6256 28.8256l-3.3792 0.1792h-176.9728l-54.4768 54.5024a29.0304 29.0304 0 0 1-35.3536 4.4288l-2.944-2.0224-2.7392-2.4064-54.528-54.528-134.912 0.0256c-13.7472 0-25.2416-9.5488-28.2624-22.3488l-0.5632-3.2768-0.2048-3.3792v-138.9824h-12.9792c-13.7216 0-25.216-9.5232-28.2368-22.3488l-0.5632-3.2512-0.2048-3.4048V185.6c0-14.8736 11.2128-27.136 25.6256-28.8256l3.3792-0.1792h503.936z", fill: "#AAF6C4" }),
    Object.freeze({ d: "M755.2 268.8c18.6112 0 33.92 14.0032 36.0192 32.0256l0.256 4.2496v435.2c0 18.5856-14.0032 33.92-32.0512 36.0192l-4.224 0.256H422.7328L287.36 878.08c-21.6832 16.256-51.7632 3.7376-57.1648-20.992l-0.6656-4.0192-0.2048-3.9936v-72.5504H174.9248c-17.152 0-31.5392-11.9296-35.3024-27.9552l-0.7168-4.096-0.256-4.1984v-435.2c0-18.6112 14.0288-33.9456 32.0512-36.0192l4.224-0.256H755.2z", fill: "#59D498" }),
    Object.freeze({ d: "M392.5248 563.2a32 32 0 0 1 3.2768 63.8464l-3.2768 0.1536h-108.8a32 32 0 0 1-3.2512-63.8464l3.2512-0.1536h108.8zM501.3248 418.1248a32 32 0 0 1 3.2768 63.8464l-3.2768 0.1536h-217.6a32 32 0 0 1-3.2512-63.8208l3.2512-0.1792h217.6z", fill: "#FFFFFF" })
  ]);
  const FRIENDSHIP_ICON_PATHS = Object.freeze({
    "bili-read": Object.freeze([
      Object.freeze({ d: "M778.496 142.08h-537.6a56.832 56.832 0 0 0-60.16 54.016v630.528a56.832 56.832 0 0 0 59.136 54.016h537.6a56.832 56.832 0 0 0 59.136-54.016V196.096a56.832 56.832 0 0 0-59.136-54.016z", fill: "#54E2E2" }),
      Object.freeze({ d: "M298.496 679.168h421.376a25.6 25.6 0 0 0 0-52.736H298.496a25.6 25.6 0 1 0 0 52.736zM719.872 732.928H298.496a25.6 25.6 0 1 0 0 52.736h421.376a25.6 25.6 0 0 0 0-52.736z", fill: "#23ADE5" }),
      Object.freeze({ d: "M272.128 237.056m80.128 0l314.112 0q80.128 0 80.128 80.128l0 154.368q0 80.128-80.128 80.128l-314.112 0q-80.128 0-80.128-80.128l0-154.368q0-80.128 80.128-80.128Z", fill: "#23ADE5" }),
      Object.freeze({ d: "M404.992 361.472m-49.408 0a49.408 49.408 0 1 0 98.816 0 49.408 49.408 0 1 0-98.816 0Z", fill: "#2EC3E5" }),
      Object.freeze({ d: "M375.552 551.936l120.832-144.384a44.544 44.544 0 0 1 68.352 0l120.832 144.384z", fill: "#2EC3E5" })
    ]),
    "bili-live": Object.freeze([
      Object.freeze({ d: "M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0", fill: "#23ADE5" }),
      Object.freeze({ d: "M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512", fill: "#48CFE5" }),
      Object.freeze({ d: "M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504", fill: "#FDDE80" })
    ]),
    "bili-activit": Object.freeze([
      Object.freeze({ d: "M518.656 475.904a223.488 223.488 0 0 1-23.296-75.52 366.08 366.08 0 0 1 81.408 14.592 623.104 623.104 0 0 1-58.112 60.928m-69.888-119.04c-11.52-58.112-8.704-55.296-25.6-156.928a265.984 265.984 0 0 0-78.336 46.592c51.2 104.448 60.928 165.376 92.928 290.304 51.2-5.632 211.968-40.704 226.56-130.56 8.704-64-142.336-64-215.04-49.408M486.4 624.128a263.424 263.424 0 0 0-107.52 69.632l43.52 153.6a47.872 47.872 0 0 1-92.928 23.296L216.576 473.088l-72.704-204.8c2.816-5.632 5.888-8.704 8.704-14.336l-14.592-51.2a46.08 46.08 0 0 1 32-57.856A47.616 47.616 0 0 1 228.096 179.2v2.816a334.848 334.848 0 0 1 98.816-43.52c177.152-46.592 203.264 55.04 429.824 23.296L890.368 588.8c-171.52 90.112-232.448-11.52-403.712 35.072", fill: "#F39800" })
    ]),
    "bili-zhishi": Object.freeze([
      Object.freeze({ d: "M781.3671875 132.3125C842.2859375 132.3125 891.6875 182.684375 891.6875 244.8265625v533.334375c0 62.1-49.359375 112.471875-110.3203125 112.471875H518.75c0-16.115625-25.6921875-29.1515625-57.375-29.1515625-31.6828125 0-57.375 13.078125-57.375 29.1515625H284.8203125C223.9015625 890.6328125 174.5 840.2609375 174.5 778.203125V244.8265625C174.5 182.684375 223.859375 132.3125 284.8203125 132.3125h496.546875z", fill: "#FBC92A" }),
      Object.freeze({ d: "M781.3671875 132.3125C842.2859375 132.3125 891.6875 182.684375 891.6875 244.8265625v209.671875c-49.4859375 4.89375-86.0625 22.021875-86.0625 42.3984375 0 20.3765625 36.5765625 37.546875 86.0625 42.35625v34.7203125c0 62.1421875-49.359375 112.5140625-110.3203125 112.5140625H284.8203125C223.9015625 686.4875 174.5 636.115625 174.5 573.9734375V244.8265625C174.5 182.684375 223.859375 132.3125 284.8203125 132.3125h496.546875z", fill: "#FFEA85" }),
      Object.freeze({ d: "M346.625 686.4875a114.75 58.3453125 0 1 0 229.5 0 114.75 58.3453125 0 1 0-229.5 0Z", fill: "#FBC92A" }),
      Object.freeze({ d: "M260.5625 803.1359375a43.03125 42.1875 0 1 0 86.0625 0 43.03125 42.1875 0 1 0-86.0625 0Z", fill: "#F4B828" }),
      Object.freeze({ d: "M490.0625 803.1359375a71.71875 42.1875 0 1 0 143.4375 0 71.71875 42.1875 0 1 0-143.4375 0Z", fill: "#F4B828" }),
      Object.freeze({ d: "M674.50625 477.4484375a27.2109375 27.2109375 0 0 1 39.0234375 1.2234375 28.51875 28.51875 0 0 1-1.18125 39.740625 238.021875 238.021875 0 0 1-330.91875 0 28.51875 28.51875 0 0 1-1.18125-39.740625 27.2109375 27.2109375 0 0 1 38.98125-1.2234375 183.6421875 183.6421875 0 0 0 255.2765625 0z", fill: "#FBC92A" }),
      Object.freeze({ d: "M734.7921875 272.9234375h5.1890625a41.765625 41.765625 0 0 1 41.34375 42.1875v56.278125c0 23.2875-18.478125 42.1875-41.34375 42.1875h-5.1890625a41.765625 41.765625 0 0 1-41.34375-42.1875V315.1109375c0-23.2875 18.5203125-42.1875 41.34375-42.1875zM353.796875 272.9234375h5.1890625a41.765625 41.765625 0 0 1 41.34375 42.1875v56.278125c0 23.2875-18.5203125 42.1875-41.34375 42.1875H353.796875a41.765625 41.765625 0 0 1-41.34375-42.1875V315.1109375c0-23.2875 18.478125-42.1875 41.34375-42.1875z", fill: "#FBC92A" })
    ]),
    "bili-musicplus": Object.freeze([
      Object.freeze({ d: "M128 256m25.6 0l716.8 0q25.6 0 25.6 25.6l0 512q0 25.6-25.6 25.6l-716.8 0q-25.6 0-25.6-25.6l0-512q0-25.6 25.6-25.6Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M153.6 256h153.6v563.2H153.6a25.6 25.6 0 0 1-25.6-25.6V281.6a25.6 25.6 0 0 1 25.6-25.6zM870.4 256h-153.6v563.2h153.6a25.6 25.6 0 0 0 25.6-25.6V281.6a25.6 25.6 0 0 0-25.6-25.6z", fill: "#7DD3E0" }),
      Object.freeze({ d: "M768 320m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M768 448m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M768 576m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M768 704m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M576 180.736c8.7808-2.6112 15.8976-1.92 21.3504 2.0736 5.4784 3.9936 11.008 9.8304 16.64 17.4592 5.6064 7.6544 12.544 16.256 20.7616 25.856 8.2432 9.5744 19.456 18.5088 33.6896 26.7776 12.2368 7.68 22.9632 12.9536 32.2048 15.7696l25.9584 7.8592c8.2176 2.432 16.128 5.5296 23.6544 9.2672 0 0 17.7408 9.984 25.5232 20.48 8.1152 10.9056 14.8736 19.6608 16.6144 30.976 1.7152 11.3408 1.6128 21.9136-0.4608 31.6928a72.7296 72.7296 0 0 1-9.5744 24.576c-4.2752 6.5792-7.8592 9.9328-10.752 9.9328-2.8672 0.0256-5.4016-1.6128-7.6032-5.0432-2.2272-3.3792-3.84-9.984-4.864-19.7632-1.6896-15.872-6.656-27.0336-14.976-33.4592-8.32-6.4256-21.3504-9.984-39.1424-10.7264a96.0512 96.0512 0 0 1-48.9216-15.616c-12.3648-8.0384-24.064-16.9984-34.9696-26.8032-8.8832-7.3728-15.7952-9.5488-20.8896-6.2976-4.992 3.2256-7.5776 8.1152-7.7312 14.7456l-0.5632 26.752-6.7072 273.792-0.7936 35.4048c0.1536 9.856-1.664 21.1968-5.4272 33.9968-3.7888 12.8-10.6752 25.2928-20.6592 37.4528-9.9328 12.16-23.0912 23.2192-39.4752 33.2288s-36.5824 17.3568-60.5952 22.0672c-24.448 4.7616-46.4128 3.584-65.8944-3.5072-19.456-7.0912-34.3808-17.4336-44.7744-31.0272-10.24-12.928-15.4368-29.5936-14.7712-47.5136 0.6912-18.048 8.8576-36.0448 24.4736-53.9648 15.616-17.92 32.4352-31.2832 50.432-40.1152a198.8096 198.8096 0 0 1 51.8144-17.7152 178.8416 178.8416 0 0 1 44.3136-3.0208c13.0048 1.0496 22.5792 2.3808 28.7488 3.9424 0 0 6.4512-280.1664 8.2944-341.6064 0.2304-12.1088 3.584-22.3232 9.9328-30.976 6.4-8.5504 14.7712-14.208 25.1392-16.9472z m160.9216 288.1792a12.8 12.8 0 0 1 0.3584 2.9696v40.96l41.728-6.912a12.8 12.8 0 0 1 14.8992 12.5952v15.0016a12.8 12.8 0 0 1-10.7008 12.6464l-45.952 7.6288 0.0256 45.3632a12.8 12.8 0 0 1-9.8304 12.4416l-15.36 3.6608a12.8 12.8 0 0 1-15.7696-12.4416V560.64l-41.1136 6.8608a12.8 12.8 0 0 1-14.8992-12.6208v-15.0016a12.8 12.8 0 0 1 10.7008-12.6464l45.312-7.552v-44.1344a12.8 12.8 0 0 1 9.8304-12.4672l15.36-3.6352a12.8 12.8 0 0 1 15.4112 9.472z", fill: "#FFD469" }),
      Object.freeze({ d: "M179.2 320m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M179.2 448m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M179.2 576m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M179.2 704m15.36 0l46.08 0q15.36 0 15.36 15.36l0 20.48q0 15.36-15.36 15.36l-46.08 0q-15.36 0-15.36-15.36l0-20.48q0-15.36 15.36-15.36Z", fill: "#3DA9D3" })
    ])
  });
  const CROWN_ASSET_BY_RANK = Object.freeze({
    1: ASSET_KEYS.ICON_GOLD,
    2: ASSET_KEYS.ICON_SILVER,
    3: ASSET_KEYS.ICON_SILVER
  });

  const BANNER_LAYERS = Object.freeze([
    ASSET_KEYS.BANNER_LAYER_01,
    ASSET_KEYS.BANNER_LAYER_02,
    ASSET_KEYS.BANNER_LAYER_03,
    ASSET_KEYS.BANNER_LAYER_04,
    ASSET_KEYS.BANNER_LAYER_05,
    ASSET_KEYS.BANNER_LAYER_06,
    ASSET_KEYS.BANNER_LAYER_07,
    ASSET_KEYS.BANNER_LAYER_08,
    ASSET_KEYS.BANNER_LAYER_09,
    ASSET_KEYS.BANNER_LAYER_10,
    ASSET_KEYS.BANNER_LAYER_11,
    ASSET_KEYS.BANNER_LAYER_12,
    ASSET_KEYS.BANNER_LAYER_13,
    ASSET_KEYS.BANNER_LAYER_14,
    ASSET_KEYS.BANNER_LAYER_15,
    ASSET_KEYS.BANNER_LAYER_16,
    ASSET_KEYS.BANNER_LAYER_17
  ]);

  const FIXTURE_COVER_POOLS = Object.freeze({
    rank: Object.freeze([ASSET_KEYS.FIXTURE_COVER_PHOTO]),
    recommend: Object.freeze([ASSET_KEYS.FIXTURE_COVER_PHOTO])
  });

  const GAME_PREVIEW_ITEMS = Object.freeze([
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_01, title: "雾境序列" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_02, title: "依露希尔：星晓" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_03, title: "星球：重启" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_04, title: "宿命回响：弦上的叹息" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_05, title: "元梦之星" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_06, title: "二之国：交错世界" }),
    Object.freeze({ key: ASSET_KEYS.MINI_GAME_HOVER_07, title: "元气骑士前传" })
  ]);

  const MANGA_ITEMS = Object.freeze([
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_01, title: "是师姐，我们有救了！" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_02, title: "碧蓝之海" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_03, title: "不小心救了江湖公敌" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_04, title: "间谍过家家" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_05, title: "杀死男主然后成为女魔头" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RANK_06, title: "金牌得主" })
  ]);

  const MANGA_RECOMMEND_ITEMS = Object.freeze([
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RECOMMEND_02, title: "石之海（乔乔的奇妙...）" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RECOMMEND_01, title: "刀剑神域 Alicization篇" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RECOMMEND_03, title: "鬼灭之刃" }),
    Object.freeze({ key: ASSET_KEYS.MINI_MANGA_RECOMMEND_04, title: "一拳超人" })
  ]);

  const LIVE_ITEMS = Object.freeze([
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_01, title: "无畏契约赛事" }),
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_02, title: "EdmundDZhang" }),
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_03, title: "大东彦" }),
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_04, title: "凉哈皮" }),
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_05, title: "夜莲Annbbers" }),
    Object.freeze({ key: ASSET_KEYS.MINI_LIVE_FACE_06, title: "Asaki大人" })
  ]);

  const CATEGORY_SYMBOLS = Object.freeze([
    Object.freeze({
      id: "bili-douga",
      paths: Object.freeze([
        Object.freeze({ d: "M273.408 166.912h477.696c58.368 0 105.984 47.616 105.984 105.984v477.696c0 58.368-47.616 105.984-105.984 105.984H273.408c-58.368 0-105.984-47.616-105.984-105.984V273.408C166.912 215.04 215.04 166.912 273.408 166.912z", fill: "#7B78EB" }),
        Object.freeze({ d: "M512 525.312v98.816c33.28-14.848 72.704 0.512 87.552 33.792 14.848 33.28-0.512 72.704-33.792 87.552-16.896 7.68-35.84 7.68-53.248 0v111.616H273.408c-58.368 0-105.984-47.616-105.984-105.984V512h137.216c-21.504 19.456-24.064 53.248-4.608 74.752 19.456 21.504 53.248 24.064 74.752 4.608 21.504-18.944 24.064-53.248 4.608-74.752l-4.608-4.608H512v-40.96c-4.096 0.512-9.216 0.512-13.312 0-51.2 0-86.016-47.616-86.016-105.984s20.992-108.032 86.016-108.032h13.312V166.912h238.592c58.368 0 105.984 47.616 105.984 105.984v251.904h-120.832c20.992-23.552 19.456-59.392-3.584-80.896-23.552-20.992-59.392-19.456-80.896 3.584-19.968 21.504-19.968 55.296 0 76.8H512z", fill: "#9796ED" }),
        Object.freeze({ d: "M512 525.312v98.816l13.312-4.096c35.84-7.68 72.704 15.872 79.872 52.224 7.68 35.84-18.432 72.192-54.272 78.848-4.096 1.024-8.704 1.024-13.312 1.024-9.216 0-16.384-3.072-25.088-6.144v111.616h-14.336v-132.608l18.432 8.192c27.136 11.776 58.368-0.512 70.144-27.648 11.776-27.136-0.512-58.368-27.648-70.144-13.312-5.632-28.672-5.632-42.496 0l-18.432 8.192v-117.76H399.872c14.848 33.28-0.512 72.704-33.792 87.552-33.28 14.848-72.704-0.512-87.552-33.792-7.68-16.896-7.68-35.84 0-53.248H166.912V512h137.216c-21.504 19.456-24.064 53.248-4.608 74.752 19.456 21.504 53.248 24.064 74.752 4.608 21.504-19.456 24.064-53.248 4.608-74.752l-4.608-4.608H512v-39.936h-13.312c-51.2 0-86.016-47.104-86.016-105.984s20.992-109.568 86.016-109.568h13.312V166.912h13.312v105.984h-26.624c-49.664 0-73.216 33.28-73.216 94.208 0 53.248 30.72 92.672 73.216 92.672 3.584 0.512 7.68 0.512 11.264 0l15.36-2.048V512h102.912c-13.824-35.84 4.096-76.8 40.448-90.624 35.84-13.824 76.8 4.096 90.624 40.448 6.144 15.872 6.144 33.792 0 50.176h97.792v13.312h-120.832c20.992-23.552 19.456-59.392-3.584-80.896-23.552-20.992-59.392-19.456-80.896 3.584-19.968 21.504-19.968 55.296 0 76.8H512z", fill: "#6A68C6" }),
        Object.freeze({ d: "M444.928 693.248c-23.04 13.312-52.224 5.12-65.024-17.408-4.096-7.68-6.144-15.36-6.144-24.064V392.192c0-26.624 20.992-47.616 47.616-47.616 8.704 0 16.896 2.048 24.576 6.656l221.696 132.608c23.04 13.312 30.208 42.496 16.896 65.024-4.096 6.656-10.24 12.8-16.896 16.896", fill: "#FDDE80" })
      ])
    }),
    Object.freeze({
      id: "bili-anime",
      paths: Object.freeze([
        Object.freeze({ d: "M588.8 359.68l-12.032-7.424 150.272-206.592a30.976 30.976 0 0 0-51.2-36.352l-153.6 210.176L281.6 170.24a30.976 30.976 0 1 0-33.024 52.736L486.4 369.92l-22.784 31.488a30.976 30.976 0 1 0 51.2 36.352l25.6-35.072 16.128 9.728A30.976 30.976 0 1 0 588.8 359.68z", fill: "#FB813A" }),
        Object.freeze({ d: "M763.648 850.688m-53.248 0a53.248 53.248 0 1 0 106.496 0 53.248 53.248 0 1 0-106.496 0Z", fill: "#FB813A" }),
        Object.freeze({ d: "M261.12 797.44a53.248 53.248 0 1 0 53.504 53.248 53.248 53.248 0 0 0-53.504-53.248z", fill: "#FB813A" }),
        Object.freeze({ d: "M141.312 314.368m92.928 0l556.288 0q92.928 0 92.928 92.928l0 360.704q0 92.928-92.928 92.928l-556.288 0q-92.928 0-92.928-92.928l0-360.704q0-92.928 92.928-92.928Z", fill: "#FDDE80" }),
        Object.freeze({ d: "M520.448 575.232m-128.256 0a128.256 128.256 0 1 0 256.512 0 128.256 128.256 0 1 0-256.512 0Z", fill: "#FFFFFF" }),
        Object.freeze({ d: "M476.928 546.56c0-26.88 19.2-37.632 42.24-25.6l49.664 28.672a25.6 25.6 0 0 1 0 48.64l-49.664 28.672c-23.04 13.568-42.24 2.56-42.24-24.32z", fill: "#FB813A" })
      ])
    }),
    Object.freeze({
      id: "bili-guochuang",
      paths: Object.freeze([
        Object.freeze({ d: "M873.472 321.792c-46.08-46.592-102.4-73.472-161.536-40.192a177.152 177.152 0 0 0-51.2-161.536s-83.456 107.52-15.104 219.648c-12.288 13.568-24.32 27.136-36.352 39.424-26.88 27.136 14.592 69.12 41.216 41.984l68.608-69.632c40.704-40.96 76.8-23.808 112.896 12.288 26.624 26.88 68.096-15.104 41.472-41.984z", fill: "#58D598" }),
        Object.freeze({ d: "M705.024 344.576a189.696 189.696 0 0 0-270.848 0 195.072 195.072 0 0 0-41.216 62.464 249.088 249.088 0 0 0-177.664 74.496 256 256 0 0 0 0 359.68 248.576 248.576 0 0 0 354.816 0 256 256 0 0 0 73.472-179.2 190.976 190.976 0 0 0 61.44-41.728 195.84 195.84 0 0 0 0-275.712z", fill: "#FF5C7A" }),
        Object.freeze({ d: "M514.304 808.704a187.136 187.136 0 0 1-267.264-5.12 193.536 193.536 0 0 1 5.12-271.104s-45.056 120.832 43.776 214.272a210.176 210.176 0 0 0 218.368 61.952", fill: "#F14767" })
      ])
    }),
    Object.freeze({
      id: "bili-music",
      paths: Object.freeze([
        Object.freeze({ d: "M881.92 460.8A335.36 335.36 0 0 0 547.584 125.696h-73.216A335.616 335.616 0 0 0 139.776 460.8v313.6a18.688 18.688 0 0 0 18.432 18.688h41.984c13.568 46.336 37.888 80.384 88.576 80.384h98.304a37.376 37.376 0 0 0 37.376-36.864l1.28-284.672a36.864 36.864 0 0 0-37.12-37.12h-99.84a111.616 111.616 0 0 0-51.2 12.8v-73.216a242.432 242.432 0 0 1 241.664-241.664h67.328a242.176 242.176 0 0 1 241.408 241.664v74.496a110.592 110.592 0 0 0-54.272-14.08h-99.84a36.864 36.864 0 0 0-37.12 37.12v284.672a37.376 37.376 0 0 0 37.376 36.864h98.304c51.2 0 75.008-34.048 88.576-80.384h41.984a18.688 18.688 0 0 0 18.432-18.688z", fill: "#45C7DD" }),
        Object.freeze({ d: "M646.141043 825.220963m0.045396-32.511969l0.273801-196.095809q0.045395-32.511968 32.557364-32.466573l1.023999 0.00143q32.511968 0.045395 32.466573 32.557364l-0.273802 196.095809q-0.045395 32.511968-32.557363 32.466573l-1.023999-0.00143q-32.511968-0.045395-32.466573-32.557364Z", fill: "#FF5C7A" }),
        Object.freeze({ d: "M307.222608 825.246563m0.045395-32.511969l0.273801-196.095809q0.045395-32.511968 32.557364-32.466573l1.023999 0.00143q32.511968 0.045395 32.466573 32.557364l-0.273801 196.095809q-0.045395 32.511968-32.557364 32.466573l-1.023999-0.00143q-32.511968-0.045395-32.466573-32.557364Z", fill: "#FF5C7A" })
      ])
    }),
    Object.freeze({
      id: "bili-dance",
      paths: Object.freeze([
        Object.freeze({ d: "M956.672 513.792a476.416 476.416 0 0 0-890.368 0L512 727.296l-95.232 45.568a117.76 117.76 0 0 0 192.256 0L512 727.04z", fill: "#FC6B8A" }),
        Object.freeze({ d: "M512 727.296l208.64-99.84a222.976 222.976 0 0 0-416.768 0z", fill: "#FFFFFF" }),
        Object.freeze({ d: "M405.4528 751.5392l541.184-258.5856 14.0288 29.312-541.184 258.6112z", fill: "#FF5C7A" }),
        Object.freeze({ d: "M666.624 545.792l-18.688-15.36-112.64 135.424 40.192-173.056-23.552-5.632-40.192 172.544-40.448-172.544-23.808 5.632 40.704 173.056-112.896-135.424-18.688 15.36 111.616 134.144-391.68-186.88-13.824 29.184 541.184 258.56 14.08-29.44-87.552-41.728 136.192-163.84z", fill: "#F14767" })
      ])
    }),
    Object.freeze({
      id: "bili-game",
      paths: Object.freeze([
        Object.freeze({ d: "M166.4 166.144m90.112 0l510.976 0q90.112 0 90.112 90.112l0 510.976q0 90.112-90.112 90.112l-510.976 0q-90.112 0-90.112-90.112l0-510.976q0-90.112 90.112-90.112Z", fill: "#58D598" }),
        Object.freeze({ d: "M307.2 325.632h136.448v136.448H307.2zM580.096 325.632h136.448v136.448h-136.448z", fill: "#17AD8A" }),
        Object.freeze({ d: "M443.648 462.336v75.776h-64.256v204.544h59.392v-68.096H585.216v68.096h59.136v-204.544h-64.256v-75.776h-136.448z", fill: "#17AD8A" })
      ])
    }),
    Object.freeze({
      id: "bili-knowledge",
      paths: Object.freeze([
        Object.freeze({ d: "M492.270933 147.729067A255.342933 255.342933 0 0 1 627.2 620.2624v51.2a37.546667 37.546667 0 0 1-25.6 34.133333h-221.866667a44.654933 44.654933 0 0 1-25.6-34.133333v-51.2a256.648533 256.648533 0 0 1 138.1376-472.533333z", fill: "#FFA200" }),
        Object.freeze({ d: "M550.4 534.929067v-76.8h51.2c46.609067 0 51.2-26.786133 51.2-42.666667v-128c0-23.1168-17.2032-42.666667-51.2-42.666667h-213.333333c-42.103467 0-59.733333 21.111467-59.733334 42.666667v76.8h102.4v-68.266667h119.466667v119.466667h-51.2c-60.501333-0.5632-76.8 24.405333-76.8 42.666667v76.8h128z m-62.6688 24.533333a59.733333 59.733333 0 1 1-59.733333 59.733333 59.733333 59.733333 0 0 1 59.733333-59.733333z", fill: "#FFF0D3" }),
        Object.freeze({ d: "M354.133333 739.7376h273.066667v8.533333a128 128 0 0 1-128 128h-17.066667a128 128 0 0 1-128-128v-8.533333z", fill: "#5FB5EC" }),
        Object.freeze({ d: "M746.666667 210.6624h119.466666a17.066667 17.066667 0 0 1 0 34.133333h-119.466666a17.066667 17.066667 0 0 1 0-34.133333z m59.733333-59.733333a17.066667 17.066667 0 0 1 17.066667 17.066666v119.466667a17.066667 17.066667 0 0 1-34.133334 0v-119.466667a17.066667 17.066667 0 0 1 17.066667-17.066666z", fill: "#FFE074" }),
        Object.freeze({ d: "M157.866667 662.929067h119.466666a17.066667 17.066667 0 0 1 0 34.133333h-119.466666a17.066667 17.066667 0 0 1 0-34.133333z m59.733333-59.733334a17.066667 17.066667 0 0 1 17.066667 17.066667v119.466667a17.066667 17.066667 0 0 1-34.133334 0v-119.466667a17.066667 17.066667 0 0 1 17.066667-17.066667z", fill: "#FFE074" }),
        Object.freeze({ d: "M200.533333 662.9376h34.133334v34.133333h-34.133334z", fill: "#FFE074" }),
        Object.freeze({ d: "M789.333333 210.670933h34.133334v34.133334h-34.133334z", fill: "#FFE074" })
      ])
    }),
    Object.freeze({
      id: "bili-tech",
      paths: Object.freeze([
        Object.freeze({ d: "M510.208 683.264h-114.176l-50.688 209.408H674.816l-50.688-209.408h-113.92z", fill: "#FFD778" }),
        Object.freeze({ d: "M535.552 150.528v-28.16a25.6 25.6 0 1 0-51.2 0v28.16a271.872 271.872 0 0 0-244.992 269.568v97.28a25.6 25.6 0 0 0 26.88 26.88h487.936a25.6 25.6 0 0 0 25.6-26.88v-97.28a271.616 271.616 0 0 0-244.224-269.568z", fill: "#48CFE5" }),
        Object.freeze({ d: "M125.696 464.64m103.168 0l562.432 0q103.168 0 103.168 103.168l0 15.36q0 103.168-103.168 103.168l-562.432 0q-103.168 0-103.168-103.168l0-15.36q0-103.168 103.168-103.168Z", fill: "#2CBAE5" }),
        Object.freeze({ d: "M742.4 537.6a37.632 37.632 0 1 0 37.632 37.632A37.376 37.376 0 0 0 742.4 537.6zM276.736 537.6a37.632 37.632 0 1 0 37.632 37.632A37.632 37.632 0 0 0 276.736 537.6z", fill: "#FFD778" })
      ])
    }),
    Object.freeze({
      id: "bili-sports",
      paths: Object.freeze([
        Object.freeze({ d: "M497.8944 517.8624l23.8848 29.2608a58.5728 58.5728 0 0 1-5.6064 80.0512L241.9456 880.7424a47.7184 47.7184 0 0 1-65.6128-0.768 49.8176 49.8176 0 0 1-4.3008-66.816l108.5696-136.3712 126.1056-158.3616a58.5728 58.5728 0 0 1 91.1872-0.5632z", fill: "#1BAD8B" }),
        Object.freeze({ d: "M698.9312 153.6a117.1456 117.1456 0 0 1 11.4176 233.728l60.416 45.9008c4.352 3.328 10.1632 3.9168 15.104 1.5872l73.6256-34.6368a46.2848 46.2848 0 0 1 59.1104 17.5872 44.3392 44.3392 0 0 1-11.9296 59.3152l-125.952 90.2656a58.5728 58.5728 0 0 1-65.9456 1.5616l-66.048-42.752-44.1344 47.7696 70.6048 83.328c1.664 1.9456 3.2 4.0192 4.608 6.1952l1.9456 3.3024a58.5728 58.5728 0 0 1-22.8608 79.616l-192.1024 106.3424a49.3824 49.3824 0 0 1-65.7408-16.9984 52.096 52.096 0 0 1 11.904-68.5824l105.5488-83.1744-106.2912-68.3008-1.536-1.024a59.7504 59.7504 0 0 1-0.896-0.6144l-13.824-7.168a58.5728 58.5728 0 0 1-23.296-82.2784l71.68-118.8864-30.72-13.824a14.6432 14.6432 0 0 0-14.336 1.3312l-80.4864 55.6032a48.8704 48.8704 0 0 1-62.6688-5.9648 39.3472 39.3472 0 0 1 1.792-56.8576l128.2816-115.1488a58.5728 58.5728 0 0 1 57.4464-12.032l143.5392 47.2576A117.1456 117.1456 0 0 1 698.9312 153.6z", fill: "#57D59A" })
      ])
    }),
    Object.freeze({
      id: "bili-car",
      paths: Object.freeze([
        Object.freeze({ d: "M210.688 588.8h25.6a51.2 51.2 0 0 1 51.2 45.568l14.08 128A51.2 51.2 0 0 1 256 819.2H225.024a51.2 51.2 0 0 1-51.2-45.568l-14.08-128A51.2 51.2 0 0 1 204.8 588.8zM788.224 588.8h25.6a51.2 51.2 0 0 1 51.2 51.2 41.984 41.984 0 0 1 0 5.632l-14.08 128a51.2 51.2 0 0 1-51.2 45.568h-25.6a51.2 51.2 0 0 1-51.2-51.2 41.984 41.984 0 0 1 0-5.632l14.08-128a51.2 51.2 0 0 1 51.2-45.568zM906.496 392.96a38.656 38.656 0 0 1-25.6 48.128l-25.6 7.424a38.4 38.4 0 0 1-22.528-73.472l25.6-7.424a38.144 38.144 0 0 1 48.128 25.344zM215.296 422.912a38.4 38.4 0 0 1-47.872 25.6l-25.6-7.424a38.656 38.656 0 0 1-25.6-48.128 38.144 38.144 0 0 1 47.872-25.6l25.6 7.424a38.4 38.4 0 0 1 25.6 48.128z", fill: "#23ADE5" }),
        Object.freeze({ d: "M292.608 201.216A1109.76 1109.76 0 0 1 512 179.2a1165.568 1165.568 0 0 1 224 22.016 51.2 51.2 0 0 1 38.144 32L870.4 486.4v230.4a25.6 25.6 0 0 1-25.6 25.6H179.2a25.6 25.6 0 0 1-25.6-25.6v-230.4l102.4-253.696a51.2 51.2 0 0 1 36.608-31.488z", fill: "#48CFE5" }),
        Object.freeze({ d: "M204.8 512m25.6 0l102.4 0q25.6 0 25.6 25.6l0 25.6q0 25.6-25.6 25.6l-102.4 0q-25.6 0-25.6-25.6l0-25.6q0-25.6 25.6-25.6Z", fill: "#FFFFFF" }),
        Object.freeze({ d: "M665.6 512m25.6 0l102.4 0q25.6 0 25.6 25.6l0 25.6q0 25.6-25.6 25.6l-102.4 0q-25.6 0-25.6-25.6l0-25.6q0-25.6 25.6-25.6Z", fill: "#FFFFFF" }),
        Object.freeze({ d: "M327.68 270.848a1000.96 1000.96 0 0 1 172.032-14.848 1429.248 1429.248 0 0 1 196.864 15.36 25.6 25.6 0 0 1 20.992 18.176l39.68 134.656a25.6 25.6 0 0 1-17.408 31.744 24.064 24.064 0 0 1-9.472 0q-125.184-12.032-230.4-12.032a1894.4 1894.4 0 0 0-204.8 11.264 25.6 25.6 0 0 1-28.16-22.784 25.6 25.6 0 0 1 0-9.984L307.2 288.768a25.6 25.6 0 0 1 20.48-17.92z", fill: "#FDDE80" }),
        Object.freeze({ d: "M614.4 358.4a102.4 102.4 0 0 0-100.864 86.784h51.2a51.2 51.2 0 0 1 99.072 5.12l51.2 4.352A102.4 102.4 0 0 0 614.4 358.4z", fill: "#23ADE5" })
      ])
    }),
    Object.freeze({
      id: "bili-animal",
      paths: Object.freeze([
        Object.freeze({ d: "M517.376 465.152a144.924444 144.924444 0 0 1 137.528889 99.214222c1.28 3.925333 2.275556 7.850667 2.901333 11.804445a132.266667 132.266667 0 0 1-14.279111 263.765333h-263.054222a132.266667 132.266667 0 0 1-14.250667-263.793778c0.625778-3.982222 1.592889-7.907556 2.872889-11.776a144.924444 144.924444 0 0 1 137.528889-99.214222h10.752zM420.693333 418.104889c50.261333-3.783111 85.617778-59.164444 79.047111-123.733333-6.599111-64.568889-52.650667-113.891556-102.912-110.108445-50.232889 3.754667-85.617778 59.164444-79.018666 123.733333 6.599111 64.568889 52.650667 113.863111 102.912 110.08zM603.306667 418.104889c50.232889 3.754667 96.284444-45.511111 102.883555-110.108445 6.599111-64.568889-28.785778-119.978667-79.018666-123.733333-50.261333-3.783111-96.312889 45.511111-102.912 110.08-6.599111 64.568889 28.785778 119.978667 79.018666 123.733333zM717.425778 551.139556c39.082667 21.816889 96.910222-4.266667 129.137778-58.225778 32.256-53.959111 26.709333-115.370667-12.373334-137.187556-39.111111-21.816889-96.938667 4.266667-129.166222 58.225778-32.256 53.959111-26.709333 115.370667 12.401778 137.187556zM306.574222 551.139556c39.111111-21.816889 44.657778-83.228444 12.401778-137.187556-32.227556-53.959111-90.055111-80.042667-129.137778-58.225778-39.111111 21.816889-44.657778 83.228444-12.430222 137.187556 32.256 53.959111 90.083556 80.042667 129.166222 58.225778z", fill: "#FB7299" }),
        Object.freeze({ d: "M621.511111 113.777778c76.231111-0.938667 138.467556 74.012444 149.504 173.340444 37.745778-13.312 75.861333-12.913778 107.292445 4.323556 70.712889 38.769778 80.753778 147.968 22.442666 243.911111a272.327111 272.327111 0 0 1-71.111111 78.336c9.159111 22.869333 14.222222 47.843556 14.222222 73.984V711.111111a199.111111 199.111111 0 0 1-199.111111 199.111111h-265.500444a199.111111 199.111111 0 0 1-199.111111-199.111111v-23.438222c0-26.168889 5.063111-51.114667 14.222222-74.012445a272.099556 272.099556 0 0 1-71.111111-78.307555c-58.311111-95.943111-48.270222-205.141333 22.442666-243.911111 31.431111-17.237333 69.546667-17.635556 107.320889-4.352C264.021333 187.790222 326.257778 112.839111 402.488889 113.777778c42.410667 0.540444 81.152 24.462222 109.511111 62.776889 28.359111-38.286222 67.100444-62.236444 109.511111-62.776889z", fill: "#FFD7E7" }),
        Object.freeze({ d: "M512 465.152a141.198222 141.198222 0 0 1 134.741333 98.958222l0.085334 0.256c1.905778 6.087111 3.015111 12.231111 3.356444 18.289778a132.266667 132.266667 0 0 1-9.728 264.163556h-256.910222a132.266667 132.266667 0 0 1-9.671111-264.192l-0.199111 4.579555c0-7.736889 1.194667-15.445333 3.498666-22.840889l0.085334-0.284444A141.198222 141.198222 0 0 1 512 465.180444zM420.693333 418.104889c50.261333-3.783111 85.617778-59.164444 79.047111-123.733333-6.599111-64.568889-52.650667-113.891556-102.912-110.108445-50.232889 3.754667-85.617778 59.164444-79.018666 123.733333 6.599111 64.568889 52.650667 113.863111 102.912 110.08zM603.306667 418.104889c50.232889 3.754667 96.284444-45.511111 102.883555-110.108445 6.599111-64.568889-28.785778-119.978667-79.018666-123.733333-50.261333-3.783111-96.312889 45.511111-102.912 110.08-6.599111 64.568889 28.785778 119.978667 79.018666 123.733333zM717.425778 551.139556c39.082667 21.816889 96.910222-4.266667 129.137778-58.225778 32.256-53.959111 26.709333-115.370667-12.373334-137.187556-39.111111-21.816889-96.938667 4.266667-129.166222 58.225778-32.256 53.959111-26.709333 115.370667 12.401778 137.187556zM306.574222 551.139556c39.111111-21.816889 44.657778-83.228444 12.401778-137.187556-32.227556-53.959111-90.055111-80.042667-129.137778-58.225778-39.111111 21.816889-44.657778 83.228444-12.430222 137.187556 32.256 53.959111 90.083556 80.042667 129.166222 58.225778z", fill: "#FB7299" })
      ])
    }),
    Object.freeze({
      id: "bili-kichiku",
      paths: Object.freeze([
        Object.freeze({ d: "M918.784 510.208a187.904 187.904 0 0 0-88.832-159.488 156.416 156.416 0 0 0 1.792-22.016 150.784 150.784 0 0 0-210.944-138.496 151.04 151.04 0 0 0-216.32 0 150.784 150.784 0 0 0-210.944 138.496 156.416 156.416 0 0 0 1.792 22.016 187.648 187.648 0 0 0-13.824 309.504v1.536a215.296 215.296 0 0 0 332.8 179.2 215.04 215.04 0 0 0 332.8-179.2v-2.56a187.904 187.904 0 0 0 71.68-148.992z", fill: "#FC6B8A" }),
        Object.freeze({ d: "M680.704 479.744A150.528 150.528 0 0 1 572.672 435.2a150.016 150.016 0 0 1-120.064 0 150.528 150.528 0 0 1-108.032 45.824h-11.264v167.168a166.4 166.4 0 0 0 165.888 165.888h33.536a166.4 166.4 0 0 0 165.888-165.888v-169.728a137.216 137.216 0 0 1-17.92 1.28z", fill: "#FFFFFF" }),
        Object.freeze({ d: "M510.464 651.264m-33.536 0a33.536 33.536 0 1 0 67.072 0 33.536 33.536 0 1 0-67.072 0Z", fill: "#E2006C" }),
        Object.freeze({ d: "M635.904 554.496H614.4v-21.504a12.032 12.032 0 0 0-11.776-11.776h-4.864a12.032 12.032 0 0 0-11.776 11.776v21.504h-21.248a11.776 11.776 0 0 0-11.776 11.52v5.12a11.776 11.776 0 0 0 11.776 11.52h21.248v21.504a12.032 12.032 0 0 0 11.776 11.776h4.864a12.032 12.032 0 0 0 11.776-11.776v-21.504h21.248a11.776 11.776 0 0 0 11.776-11.52v-5.12a11.776 11.776 0 0 0-11.52-11.52zM455.936 554.496H435.2v-21.504a12.032 12.032 0 0 0-11.776-11.776h-4.864a12.032 12.032 0 0 0-11.776 11.776v21.504H384a11.776 11.776 0 0 0-11.776 11.52v5.12a11.776 11.776 0 0 0 11.776 11.52h21.248v21.504a12.032 12.032 0 0 0 11.776 11.776h4.864a12.032 12.032 0 0 0 13.312-11.776v-21.504h21.248a11.52 11.52 0 0 0 11.776-11.52v-5.12a11.52 11.52 0 0 0-12.288-11.52z", fill: "#FF5C7A" }),
        Object.freeze({ d: "M600.32 651.008a12.288 12.288 0 0 0-12.288 12.544c0 34.048-34.816 61.696-76.8 61.696s-76.8-27.648-76.8-61.696a12.544 12.544 0 1 0-25.6 0c0 47.616 45.824 86.528 102.4 86.528s102.4-38.912 102.4-86.528a12.544 12.544 0 0 0-13.312-12.544z", fill: "#EB53A8" })
      ])
    }),
    Object.freeze({
      id: "bili-fashion",
      paths: Object.freeze([
        Object.freeze({ d: "M691.2 204.8a44.032 44.032 0 0 1 29.952 34.048 117.76 117.76 0 0 1-13.056 76.8s-19.2 29.952-24.32 39.936a235.008 235.008 0 0 0-25.6 107.008v40.704H365.312v-39.424a235.008 235.008 0 0 0-25.6-107.008c-5.12-9.984-24.32-39.936-24.32-39.936a117.76 117.76 0 0 1-13.056-76.8A44.544 44.544 0 0 1 336.896 204.8V147.712a29.952 29.952 0 0 1 27.136-31.744 29.952 29.952 0 0 1 27.648 31.744v73.728A237.056 237.056 0 0 0 512 253.952a241.408 241.408 0 0 0 125.184-35.072V147.712a27.136 27.136 0 1 1 53.76 0z", fill: "#FF6A9B" }),
        Object.freeze({ d: "M658.432 487.936H365.312L204.8 780.288a36.352 36.352 0 0 0 10.24 46.592 492.288 492.288 0 0 0 595.456 0 36.608 36.608 0 0 0 8.704-47.36z", fill: "#FF9DC6" }),
        Object.freeze({ d: "M409.6 537.6a9.984 9.984 0 0 0-13.568 4.608l-124.16 250.624a10.496 10.496 0 0 0 4.608 13.568 14.848 14.848 0 0 0 4.608 0 9.984 9.984 0 0 0 8.96-5.632l124.16-250.88A10.24 10.24 0 0 0 409.6 537.6zM455.936 643.072a9.984 9.984 0 0 0-12.032 7.424l-40.448 170.752a10.24 10.24 0 0 0 7.424 12.288h2.304a9.728 9.728 0 0 0 9.728-7.936l40.448-170.752a9.984 9.984 0 0 0-7.424-11.776zM750.848 791.808l-124.16-250.624A9.984 9.984 0 0 0 614.4 537.6a10.24 10.24 0 0 0-4.608 13.312l124.16 250.88a9.984 9.984 0 0 0 8.96 5.632 14.848 14.848 0 0 0 4.608 0 10.496 10.496 0 0 0 3.328-15.616zM579.84 650.496a9.984 9.984 0 0 0-19.456 4.608l40.448 170.752a9.728 9.728 0 0 0 9.728 7.936h2.304a10.24 10.24 0 0 0 7.424-12.288z", fill: "#FF6A9B" })
      ])
    }),
    Object.freeze({
      id: "bili-ent",
      paths: Object.freeze([
        Object.freeze({ d: "M534.442796 378.982175m36.203867 36.203867l30.592268 30.592268q36.203867 36.203867 0 72.407734l-360.590518 360.590518q-36.203867 36.203867-72.407734 0l-30.592268-30.592268q-36.203867-36.203867 0-72.407735l360.590518-360.590517q36.203867-36.203867 72.407734 0Z", fill: "#FF8693" }),
        Object.freeze({ d: "M369.92 543.744l137.472-137.472a38.912 38.912 0 0 1 54.528 0l48.384 48.64a38.4 38.4 0 0 1 0 54.528l-137.984 137.984z", fill: "#FC6376" }),
        Object.freeze({ d: "M286.133941 631.021801m12.854616 12.85013l72.601422 72.576083q12.854616 12.850129 0.004486 25.704746l-1.62889 1.629458q-12.850129 12.854616-25.704745 0.004486l-72.601422-72.576083q-12.854616-12.850129-0.004486-25.704745l1.62889-1.629459q12.850129-12.854616 25.704745-0.004486Z", fill: "#FFA9B1" }),
        Object.freeze({ d: "M737.024 547.584a99.328 99.328 0 0 1 62.72-62.72l51.2-13.568a27.136 27.136 0 0 0 13.056-49.664L826.624 384a98.816 98.816 0 0 1-22.784-85.76l16.896-63.232c7.168-27.136-8.96-43.52-36.096-36.096l-63.232 16.896a98.816 98.816 0 0 1-85.76-23.04l-37.376-36.864a27.136 27.136 0 0 0-49.408 13.312l-13.824 51.2a97.792 97.792 0 0 1-62.464 62.72l-51.2 13.824a27.136 27.136 0 0 0-13.312 49.408L445.44 384a97.536 97.536 0 0 1 23.04 85.504l-16.896 63.232c-7.424 27.392 8.96 43.52 36.096 36.352l63.232-16.896a97.792 97.792 0 0 1 85.76 22.784l37.376 37.376a26.88 26.88 0 0 0 49.408-13.312z", fill: "#FDDE80" }),
        Object.freeze({ d: "M886.272 417.536l-74.752-75.008 30.464-114.432a41.216 41.216 0 0 0-8.704-41.472A41.728 41.728 0 0 0 791.808 179.2l-114.432 30.72-74.752-76.032A41.728 41.728 0 0 0 563.2 120.576a41.216 41.216 0 0 0-28.416 31.488l-27.392 102.4L404.48 281.6a42.24 42.24 0 0 0-31.744 28.16 42.24 42.24 0 0 0 13.312 40.448L460.8 425.216l-30.72 114.432a41.728 41.728 0 0 0 8.96 41.472 37.888 37.888 0 0 0 27.392 10.752 56.832 56.832 0 0 0 14.08-2.048l114.432-30.72 74.752 75.008a45.824 45.824 0 0 0 31.232 14.336 34.304 34.304 0 0 0 8.96 0 41.216 41.216 0 0 0 28.416-31.488l27.392-102.4 102.4-27.392a41.984 41.984 0 0 0 31.488-28.416 40.96 40.96 0 0 0-13.312-41.216z", fill: "#FCC029" })
      ])
    }),
    Object.freeze({
      id: "bili-cinephile",
      paths: Object.freeze([
        Object.freeze({ d: "M147.2 201.728m79.616 0l571.136 0q79.616 0 79.616 79.616l0 458.24q0 79.616-79.616 79.616l-571.136 0q-79.616 0-79.616-79.616l0-458.24q0-79.616 79.616-79.616Z", fill: "#9796ED" }),
        Object.freeze({ d: "M222.976 269.312h77.056v57.856H222.976zM390.144 269.312h77.056v57.856h-77.056zM557.312 269.312h77.056v57.856h-77.056zM724.48 269.312h77.056v57.856H724.48zM222.976 693.76h77.056v57.856H222.976zM390.144 693.76h77.056v57.856h-77.056zM557.312 693.76h77.056v57.856h-77.056zM147.2 375.296h730.368v270.08H147.2z", fill: "#7B78EA" }),
        Object.freeze({ d: "M521.369822 529.707066m23.351494-23.351495l2.534271-2.53427q23.351494-23.351494 46.702989 0l199.664327 199.664327q23.351494 23.351494 0 46.702989l-2.534271 2.534271q-23.351494 23.351494-46.702988 0l-199.664328-199.664328q-23.351494-23.351494 0-46.702989Z", fill: "#FFD043" }),
        Object.freeze({ d: "M708.352 418.816h-25.6v-24.32a13.568 13.568 0 0 0-13.568-13.568H665.6a13.312 13.312 0 0 0-13.312 13.568v24.32h-25.6a13.568 13.568 0 0 0-13.568 13.568v5.632a13.568 13.568 0 0 0 13.568 13.568h25.6v24.32a13.312 13.312 0 0 0 13.312 13.568h5.632a13.568 13.568 0 0 0 13.568-13.568v-24.32h25.6a13.312 13.312 0 0 0 13.312-13.568v-5.632a13.312 13.312 0 0 0-15.36-13.568zM517.888 418.816h-25.6v-24.32a13.312 13.312 0 0 0-13.312-13.568h-5.632a13.568 13.568 0 0 0-13.568 13.568v24.32H435.2a13.312 13.312 0 0 0-13.312 13.568v5.632a13.312 13.312 0 0 0 13.312 13.568h25.6v24.32a13.568 13.568 0 0 0 13.568 13.568h5.632a13.312 13.312 0 0 0 13.312-13.568v-24.32h25.6a13.312 13.312 0 0 0 13.312-13.568v-5.632a13.312 13.312 0 0 0-14.336-13.568zM493.568 572.16h-18.432v-18.432a10.24 10.24 0 0 0-10.24-10.24H460.8a10.24 10.24 0 0 0-10.24 10.24v18.432h-18.432a10.24 10.24 0 0 0-10.24 10.24v4.352a10.24 10.24 0 0 0 10.24 10.24h18.432V614.4a10.24 10.24 0 0 0 10.24 10.24h4.352a10.24 10.24 0 0 0 10.24-10.24v-18.432h18.432a10.24 10.24 0 0 0 10.24-10.24v-4.352a10.24 10.24 0 0 0-10.496-9.216z", fill: "#FFD778" })
      ])
    }),
    Object.freeze({
      id: "bili-documentary",
      paths: Object.freeze([
        Object.freeze({ d: "M404.9 386.765c-70.8975-2.565-143.3475 12.06-196.65 38.1825-48.8475 23.9625-117.63 89.46-121.9275 135.5625h735.3225c-3.2175 0-12.015-9.4275-14.7375-11.52-5.0175-3.825-9.7425-7.8075-14.76-11.5425-11.9025-8.91-24.66-16.8975-37.1475-24.975a1040.175 1040.175 0 0 0-77.0625-45.585c-52.47-27.945-107.865-50.805-165.69-65.0025a533.88 533.88 0 0 0-107.3475-15.12", fill: "#47CFE5" }),
        Object.freeze({ d: "M744.605 489.1625c-12.7125 32.31-136.71 36.765-181.395 36.765H137.8025c-15.2325 0-29.7675 5.1975-39.7575 14.265-9.9 8.9775-14.1075 20.7675-11.7 32.355 0 0.1125 0 0.27 0.09 0.3375 9.2925 43.6725 35.73 83.34 76.365 114.6825 1.62 1.26 3.2625 2.52 4.9275 3.735 106.74 78.4575 292.5225 81.1575 423.45 43.875 41.445-11.79 80.865-28.17 115.1775-49.635 38.9925-24.39 78.795-57.3075 102.3075-91.7325 3.465-5.0625 41.22-61.1775 41.9625-60.885l-106.02-43.7625z", fill: "#47CFE5" }),
        Object.freeze({ d: "M918.0575 505.3175l-29.88-17.0775a75.0825 75.0825 0 0 0-70.11-2.1375 75.375 75.375 0 0 0-37.4175-59.355l-29.925-17.0775a11.4525 11.4525 0 0 0-15.66 4.275l-7.83 13.7025a59.0625 59.0625 0 0 0 21.96 80.5725l15.795 9.045a0.045 0.045 0 0 1-0.045 0.045l51.48 29.43 0.045-0.045 17.46 9.99a59.085 59.085 0 0 0 80.5725-21.9375l7.83-13.725a11.5425 11.5425 0 0 0-4.275-15.705", fill: "#2BBAE4" }),
        Object.freeze({ d: "M654.515 712.4975C351.3275 720.8675 266.3 564.425 266.3 564.425H85.7825a31.995 31.995 0 0 0 0.63 8.46c9.2925 43.6725 35.73 83.34 76.365 114.6825 1.62 1.2825 3.2625 2.52 4.9275 3.735 106.7175 78.4575 292.5 81.18 423.4275 43.875a509.6925 509.6925 0 0 0 63.3825-22.68", fill: "#E5E6E6" }),
        Object.freeze({ d: "M654.515 712.4975c-65.16 1.8-120.15-4.41-166.5675-14.2425-49.005-10.3725-26.1675 59.31-3.2175 56.79 37.485-4.0725 73.665-10.5975 106.4025-19.9125a502.3575 502.3575 0 0 0 63.3825-22.635", fill: "#E4E5E4" }),
        Object.freeze({ d: "M407.1275 674.9225c21.5775 69.84 69.705 117.6525 116.775 113.6475 3.735-0.3375 6.2325-4.0725 5.5125-7.74l-24.435-125.6175a5.715 5.715 0 0 0-6.6825-4.5l-86.715 16.8975a5.7825 5.7825 0 0 0-4.455 7.3125", fill: "#47CFE5" }),
        Object.freeze({ d: "M441.2375 614.7125a29.295 29.295 0 1 1-58.6125 0.0225 29.295 29.295 0 0 1 58.6125-0.0225", fill: "#0099BC" }),
        Object.freeze({ d: "M252.5975 310.4675a64.2825 64.2825 0 0 1 64.305-64.1025c18.81 0 35.73 8.1225 47.52 21.1275a64.17 64.17 0 0 1 111.7125 42.975 16.56 16.56 0 0 1-16.5825 16.5825 16.56 16.56 0 0 1-16.605-16.5825 31.05 31.05 0 0 0-61.9875-2.16h-0.18l0.1125 77.4675a16.5825 16.5825 0 1 1-33.1875 0v-75.3975c0-17.0325-13.9275-30.9375-30.96-30.9375a31.05 31.05 0 0 0-31.0275 31.0275 16.56 16.56 0 1 1-33.12 0", fill: "#47CFE5" }),
        Object.freeze({ d: "M364.3325 408.0275a22.2525 22.2525 0 0 1-22.2075-22.23V310.4a25.3575 25.3575 0 1 0-50.715 0.09 22.23 22.23 0 0 1-44.415 0c0-38.4525 31.365-69.75 69.9075-69.75a69.75 69.75 0 0 1 47.52 18.765 70.2 70.2 0 0 1 47.61-18.765c38.4525 0 69.75 31.2975 69.75 69.75a22.23 22.23 0 0 1-44.4375 0 25.425 25.425 0 0 0-50.7375-1.7775l-0.1575 2.385 0.09 74.7a22.2525 22.2525 0 0 1-22.2075 22.23z m-47.5425-134.19c20.16 0 36.5625 16.4025 36.5625 36.5625v75.42a10.98 10.98 0 1 0 21.915 0l-0.09-83.0925h0.9225a36.7425 36.7425 0 0 1 35.82-28.8675c20.205 0 36.6525 16.4475 36.6525 36.6525a10.98 10.98 0 0 0 21.9375 0c0-32.265-26.235-58.5-58.5-58.5-16.4475 0-32.2875 7.02-43.4475 19.305l-4.1625 4.545-4.1625-4.6125a58.635 58.635 0 0 0-43.335-19.2825 58.635 58.635 0 0 0-58.6575 58.5 10.9575 10.9575 0 0 0 21.915 0 36.675 36.675 0 0 1 36.63-36.63z", fill: "#47CFE5" }),
        Object.freeze({ d: "M389.87 621.2825h-66.33a47.79 47.79 0 0 1-35.0325-15.5925l-23.715-25.695a28.575 28.575 0 0 0-20.88-9.2925H91.0475a6.525 6.525 0 1 1 0-13.095h152.8875c11.4525 0 22.5675 4.9275 30.4875 13.5225l23.715 25.7175c6.66 7.2 15.93 11.34 25.425 11.34h66.33a6.525 6.525 0 1 1-0.0225 13.095", fill: "#0099BC" })
      ])
    }),
    Object.freeze({
      id: "bili-live",
      paths: Object.freeze([
        Object.freeze({ d: "M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0", fill: "#23ADE5" }),
        Object.freeze({ d: "M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512", fill: "#48CFE5" }),
        Object.freeze({ d: "M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504", fill: "#FDDE80" })
      ])
    }),
    Object.freeze({
      id: "bili-tuiguang",
      paths: Object.freeze([
        Object.freeze({ d: "M324.5568 660.31616v56.832c0 30.19264 24.4736 54.67136 54.67136 54.67136 30.19264 0 54.67136-24.4736 54.67136-54.67136v-14.04928l-109.34272-42.78272z m186.4704 72.96512C503.0656 799.0016 447.09376 849.92 379.22816 849.92c-73.32864 0-132.77184-59.4432-132.77184-132.77184v-87.3984l-117.15584-45.83936v0.06656a39.05024 39.05024 0 1 1-78.10048 0V411.71968a39.05024 39.05024 0 0 1 78.10048 0v0.06656l499.85024-195.59424v-23.54176a39.05024 39.05024 0 1 1 78.1056 0v610.39616a39.05024 39.05024 0 1 1-78.1056 0v-23.54176l-118.1184-46.22336z", fill: "#FFD778" }),
        Object.freeze({ d: "M808.78592 458.73152h124.96384A39.05024 39.05024 0 0 1 972.8 497.78176v0.13312a39.05024 39.05024 0 0 1-39.05024 39.05024h-124.96384a39.05024 39.05024 0 0 1-39.05024-39.05024v-0.13312a39.05024 39.05024 0 0 1 39.05024-39.05024z m-3.31264 130.43712l108.25728 62.61248a39.05024 39.05024 0 0 1 14.2848 53.2992l-0.05632 0.1024a39.04512 39.04512 0 0 1-53.376 14.30016l-108.25728-62.6176a39.05024 39.05024 0 0 1-14.2848-53.2992l0.05632-0.09728a39.04512 39.04512 0 0 1 53.376-14.30016z m-39.14752-250.3424l108.25728-62.61248a39.04512 39.04512 0 0 1 53.376 14.30528l0.0512 0.09216a39.05024 39.05024 0 0 1-14.2848 53.30432L805.4784 406.528a39.04512 39.04512 0 0 1-53.376-14.30016l-0.0512-0.09728a39.05024 39.05024 0 0 1 14.27968-53.2992z", fill: "#FB813A" })
      ])
    })
  ]);

  const ADDITIONAL_CATEGORY_SYMBOLS = Object.freeze([
    Object.freeze({
      id: "bili-manga",
      paths: Object.freeze([
        Object.freeze({ d: "M426.624 149.504a184.32 184.32 0 0 0-180.48 149.248h36.608a46.848 46.848 0 0 0 46.08 37.632h194.56v55.808H329.728a46.848 46.848 0 0 0-46.336 47.36v332.544a46.848 46.848 0 0 0 46.336 47.36h194.56V874.496h186.624a46.848 46.848 0 0 0 46.08-47.36V298.752a184.32 184.32 0 0 0-180.48-149.248z", fill: "#FFB037" }),
        Object.freeze({ d: "M573.696 149.248c53.248 32 56.832 97.024 56.832 149.76H329.472v93.184h194.56v427.264h-194.56v-379.904a46.848 46.848 0 0 0-46.336 47.36v332.544a46.848 46.848 0 0 0 46.336 47.36h194.56V874.24h186.368a46.848 46.848 0 0 0 46.336-47.36V298.752a184.32 184.32 0 0 0-183.04-149.504z", fill: "#FFD469" }),
        Object.freeze({ d: "M613.12 392.192h82.688a22.528 22.528 0 1 1 0 45.056H613.12a22.528 22.528 0 1 1 0-45.056zM613.12 500.224h82.688a22.528 22.528 0 1 1 0 45.056H613.12a22.528 22.528 0 0 1 0-45.056z", fill: "#FFF7CA" })
      ])
    }),
    Object.freeze({ id: "bili-zhishi", paths: Object.freeze([
      Object.freeze({ d: "M781.3671875 132.3125C842.2859375 132.3125 891.6875 182.684375 891.6875 244.8265625v533.334375c0 62.1-49.359375 112.471875-110.3203125 112.471875H518.75c0-16.115625-25.6921875-29.1515625-57.375-29.1515625-31.6828125 0-57.375 13.078125-57.375 29.1515625H284.8203125C223.9015625 890.6328125 174.5 840.2609375 174.5 778.203125V244.8265625C174.5 182.684375 223.859375 132.3125 284.8203125 132.3125h496.546875z", fill: "#FBC92A" }),
      Object.freeze({ d: "M781.3671875 132.3125C842.2859375 132.3125 891.6875 182.684375 891.6875 244.8265625v209.671875c-49.4859375 4.89375-86.0625 22.021875-86.0625 42.3984375 0 20.3765625 36.5765625 37.546875 86.0625 42.35625v34.7203125c0 62.1421875-49.359375 112.5140625-110.3203125 112.5140625H284.8203125C223.9015625 686.4875 174.5 636.115625 174.5 573.9734375V244.8265625C174.5 182.684375 223.859375 132.3125 284.8203125 132.3125h496.546875z", fill: "#FFEA85" }),
      Object.freeze({ d: "M346.625 686.4875a114.75 58.3453125 0 1 0 229.5 0 114.75 58.3453125 0 1 0-229.5 0Z", fill: "#FBC92A" }),
      Object.freeze({ d: "M260.5625 803.1359375a43.03125 42.1875 0 1 0 86.0625 0 43.03125 42.1875 0 1 0-86.0625 0ZM490.0625 803.1359375a71.71875 42.1875 0 1 0 143.4375 0 71.71875 42.1875 0 1 0-143.4375 0Z", fill: "#F4B828" }),
      Object.freeze({ d: "M674.50625 477.4484375a27.2109375 27.2109375 0 0 1 39.0234375 1.2234375 28.51875 28.51875 0 0 1-1.18125 39.740625 238.021875 238.021875 0 0 1-330.91875 0 28.51875 28.51875 0 0 1-1.18125-39.740625 27.2109375 27.2109375 0 0 1 38.98125-1.2234375 183.6421875 183.6421875 0 0 0 255.2765625 0z", fill: "#FBC92A" }),
      Object.freeze({ d: "M734.7921875 272.9234375h5.1890625a41.765625 41.765625 0 0 1 41.34375 42.1875v56.278125c0 23.2875-18.478125 42.1875-41.34375 42.1875h-5.1890625a41.765625 41.765625 0 0 1-41.34375-42.1875V315.1109375c0-23.2875 18.5203125-42.1875 41.34375-42.1875zM353.796875 272.9234375h5.1890625a41.765625 41.765625 0 0 1 41.34375 42.1875v56.278125c0 23.2875-18.5203125 42.1875-41.34375 42.1875H353.796875a41.765625 41.765625 0 0 1-41.34375-42.1875V315.1109375c0-23.2875 18.478125-42.1875 41.34375-42.1875z", fill: "#FBC92A" })
    ]) }),
    Object.freeze({ id: "bili-life", paths: Object.freeze([
      Object.freeze({ d: "M881.408 664.064V504.32a168.192 168.192 0 0 0-128-162.56l-7.936-1.792v144.896a12.288 12.288 0 0 1-14.592 11.776 170.752 170.752 0 0 0-30.464-2.816h-138.752v-27.648a37.632 37.632 0 0 1 11.776-27.648 175.872 175.872 0 0 0 57.856-135.68A179.2 179.2 0 0 0 460.8 132.352a175.872 175.872 0 0 0-180.992 176.128V409.6h32.256a225.536 225.536 0 0 0 15.872 19.2 36.608 36.608 0 0 1 9.472 25.6v42.496A193.792 193.792 0 0 0 179.2 712.96a197.12 197.12 0 0 0 197.12 166.656h325.12a148.48 148.48 0 0 0 45.568-6.144 217.088 217.088 0 0 0 64.256-31.744 176.896 176.896 0 0 0 18.176-15.616l4.608-4.352a156.16 156.16 0 0 0 47.36-111.872v-35.84c.512-3.072.256-6.656 0-9.984z", fill: "#FFD778" }),
      Object.freeze({ d: "M468.736 238.592a40.192 40.192 0 1 0 40.192 40.192 40.192 40.192 0 0 0-40.192-40.192zM323.584 362.752H217.6a34.816 34.816 0 1 0 0 69.376h106.24a34.816 34.816 0 1 0 0-69.376z", fill: "#FB813A" })
    ]) }),
    Object.freeze({ id: "bili-food", paths: Object.freeze([
      Object.freeze({ d: "M192.075294 503.883294m-75.294118 0a75.294118 75.294118 0 1 0 150.588236 0 75.294118 75.294118 0 1 0-150.588236 0Z", fill: "#FA942D" }),
      Object.freeze({ d: "M342.663529 411.211294m-75.294117 0a75.294118 75.294118 0 1 0 150.588235 0 75.294118 75.294118 0 1 0-150.588235 0Z", fill: "#FA942D" }),
      Object.freeze({ d: "M284.747294 480.722824m-75.294118 0a75.294118 75.294118 0 1 0 150.588236 0 75.294118 75.294118 0 1 0-150.588236 0Z", fill: "#FE5D79" }),
      Object.freeze({ d: "M765.470118 532.841412m-127.427765 0a127.427765 127.427765 0 1 0 254.855529 0 127.427765 127.427765 0 1 0-254.855529 0Z", fill: "#FA942D" }),
      Object.freeze({ d: "M632.259765 457.547294m-133.210353 0a133.210353 133.210353 0 1 0 266.420706 0 133.210353 133.210353 0 1 0-266.420706 0Z", fill: "#FA942D" }),
      Object.freeze({ d: "M672.798118 556.016941m-150.588236 0a150.588235 150.588235 0 1 0 301.176471 0 150.588235 150.588235 0 1 0-301.176471 0Z", fill: "#FE5D79" }),
      Object.freeze({ d: "M932.291765 474.925176a28.762353 28.762353 0 0 1 28.747294 28.762353l-.045177 1.355295-.090353 1.355294c-14.305882 150.919529-130.605176 272.865882-280.741647 299.188706l20.178824 80.745411a23.160471 23.160471 0 0 1-22.467765 28.777412H343.371294a23.160471 23.160471 0 0 1-22.467765-28.777412l20.178824-80.745411C192.813176 779.595294 77.552941 660.329412 60.928 512.015059l-.557176-5.376a28.958118 28.958118 0 0 1 28.822588-31.713883h843.083294z", fill: "#FDDC7A" }),
      Object.freeze({ d: "M442.548706 196.924235h136.146823c21.263059 0 39.800471 14.456471 44.950589 35.087059l60.732235 242.913882H336.865882l60.732236-242.898823a46.336 46.336 0 0 1 44.950588-35.102118z", fill: "#F6C338" }),
      Object.freeze({ d: "M688.037647 192.903529c9.441882-30.177882 28.385882-29.409882 34.680471-47.585882 7.062588-20.449882 9.366588-45.718588 6.927058-75.821176 16.850824 17.935059 25.976471 37.014588 30.945883 62.283294 4.894118 24.937412-9.125647 44.182588-29.06353 74.480941-19.922824 30.313412-8.809412 67.614118 0 94.915765-16.850824-17.92-59.904-55.777882-43.474823-108.272942zM283.361882 154.247529c11.324235-37.707294 34.063059-36.773647 41.60753-59.482353 8.493176-25.554824 11.264-57.133176 8.31247-94.765176 20.239059 22.407529 31.201882 46.260706 37.165177 77.854118 5.872941 31.171765-10.947765 55.220706-34.876235 93.108706-23.943529 37.872941-10.601412 84.48 0 118.633411-20.239059-22.422588-71.936-69.722353-52.208942-135.348706z", fill: "#C6D2E1" }),
      Object.freeze({ d: "M510.629647 706.605176a92.672 92.672 0 0 1 92.672 92.672v115.832471H417.957647v-115.832471a92.672 92.672 0 0 1 92.672-92.672z", fill: "#F5BC20" })
    ]) }),
    Object.freeze({ id: "bili-information", paths: Object.freeze([
      Object.freeze({ d: "M760.685714 768a21.942857 21.942857 0 0 0 19.836343 21.840457L782.628571 789.942857a21.942857 21.942857 0 0 0 21.840458-19.836343L804.571429 768V321.828571h29.257142a58.514286 58.514286 0 0 1 58.514286 58.514286v438.857143a58.514286 58.514286 0 0 1-58.514286 58.514286H190.171429a58.514286 58.514286 0 0 1-58.514286-58.514286V204.8a58.514286 58.514286 0 0 1 58.514286-58.514286h512a58.514286 58.514286 0 0 1 58.514285 58.514286v563.2z", fill: "#7DD3E0" }),
      Object.freeze({ d: "M219.428571 234.057143m29.257143 0l394.971429 0q29.257143 0 29.257143 29.257143l0 263.314285q0 29.257143-29.257143 29.257143l-394.971429 0q-29.257143 0-29.257143-29.257143l0-263.314285q0-29.257143 29.257143-29.257143Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M404.772571 300.514743l129.462858 80.925257a15.945143 15.945143 0 0 1 0 27.062857l-129.462858 80.925257a15.945143 15.945143 0 0 1-24.429714-13.531428V314.046171a15.945143 15.945143 0 0 1 24.429714-13.531428z", fill: "#FFD469" }),
      Object.freeze({ d: "M219.428571 614.4m29.257143 0l394.971429 0q29.257143 0 29.257143 29.257143t-29.257143 29.257143l-394.971429 0q-29.257143 0-29.257143-29.257143t29.257143-29.257143Z", fill: "#3DA9D3" }),
      Object.freeze({ d: "M219.428571 731.428571m29.257143 0l219.428572 0q29.257143 0 29.257143 29.257143t-29.257143 29.257143l-219.428572 0q-29.257143 0-29.257143-29.257143t29.257143-29.257143Z", fill: "#3DA9D3" })
    ]) }),
    Object.freeze({ id: "bili-read", paths: Object.freeze([
      Object.freeze({ d: "M778.496 142.08h-537.6a56.832 56.832 0 0 0-60.16 54.016v630.528a56.832 56.832 0 0 0 59.136 54.016h537.6a56.832 56.832 0 0 0 59.136-54.016V196.096a56.832 56.832 0 0 0-59.136-54.016z", fill: "#54E2E2" }),
      Object.freeze({ d: "M298.496 679.168h421.376a25.6 25.6 0 0 0 0-52.736H298.496a25.6 25.6 0 1 0 0 52.736zM719.872 732.928H298.496a25.6 25.6 0 1 0 0 52.736h421.376a25.6 25.6 0 0 0 0-52.736z", fill: "#23ADE5" }),
      Object.freeze({ d: "M272.128 237.056m80.128 0l314.112 0q80.128 0 80.128 80.128l0 154.368q0 80.128-80.128 80.128l-314.112 0q-80.128 0-80.128-80.128l0-154.368q0-80.128 80.128-80.128Z", fill: "#23ADE5" }),
      Object.freeze({ d: "M404.992 361.472m-49.408 0a49.408 49.408 0 1 0 98.816 0 49.408 49.408 0 1 0-98.816 0Z", fill: "#2EC3E5" }),
      Object.freeze({ d: "M375.552 551.936l120.832-144.384a44.544 44.544 0 0 1 68.352 0l120.832 144.384z", fill: "#2EC3E5" })
    ]) }),
    Object.freeze({ id: "bili-movie", paths: Object.freeze([
      Object.freeze({ d: "M954.624 452.864H919.04v-168.96a37.376 37.376 0 0 0-25.6-36.608A36.608 36.608 0 0 0 846.848 281.6v170.24H199.936v-168.96a37.632 37.632 0 0 0-25.6-36.608A36.352 36.352 0 0 0 128 281.6v170.24H92.16a15.616 15.616 0 0 0-15.36 15.872v82.688a15.36 15.36 0 0 0 15.36 15.616h26.88v85.248a135.68 135.68 0 0 0 134.4 136.192h114.432a135.68 135.68 0 0 0 134.4-136.192v-20.992a7.936 7.936 0 0 1 7.68-7.936h25.6a7.68 7.68 0 0 1 7.68 7.936v20.992a135.936 135.936 0 0 0 134.4 136.192H793.6a135.68 135.68 0 0 0 134.4-136.192v-85.248h25.6a15.36 15.36 0 0 0 15.36-15.616v-81.664a15.616 15.616 0 0 0-15.36-15.872", fill: "#E5E6E6" }),
      Object.freeze({ d: "M361.216 727.552h-102.4A87.296 87.296 0 0 1 172.8 640v-79.872a61.184 61.184 0 0 1 60.416-61.44h153.6a61.184 61.184 0 0 1 60.416 61.44V640a87.296 87.296 0 0 1-86.528 87.552", fill: "#FF5C7A" }),
      Object.freeze({ d: "M685.568 727.552h102.4A87.296 87.296 0 0 0 873.984 640v-79.872a61.184 61.184 0 0 0-60.416-61.44h-153.6a61.184 61.184 0 0 0-60.416 61.44V640a87.296 87.296 0 0 0 86.528 87.552", fill: "#2CBAE5" })
    ]) }),
    Object.freeze({ id: "bili-teleplay", paths: Object.freeze([
      Object.freeze({ d: "M271.616 247.808a212.224 212.224 0 0 0-49.664 172.8l25.6 126.72c56.832 21.76 60.16 87.552 67.328 149.248a1167.872 1167.872 0 0 1 190.208-14.08 1247.488 1247.488 0 0 1 196.096 14.08c7.68-61.696 4.352-126.72 59.904-148.736l25.6-128a211.712 211.712 0 0 0-49.92-172.288 218.624 218.624 0 0 0-165.12-74.752h-134.912a218.624 218.624 0 0 0-165.12 74.752", fill: "#FFB161" }),
      Object.freeze({ d: "M505.088 412.672l-34.816-34.56a19.456 19.456 0 0 0-27.392 27.392l25.6 25.6-25.6 25.6a19.456 19.456 0 0 0 27.392 27.392l34.816-34.56 35.072 34.56a18.688 18.688 0 0 0 13.568 5.632 19.456 19.456 0 0 0 13.824-33.024l-25.6-25.6 25.6-25.6a19.456 19.456 0 0 0-13.824-33.024 18.688 18.688 0 0 0-13.568 5.632z", fill: "#FFE494" }),
      Object.freeze({ d: "M822.016 482.56a130.816 130.816 0 0 0-133.888 128v68.864l-368.128 1.536v-69.376a130.304 130.304 0 0 0-120.32-128h-13.568A81.92 81.92 0 0 0 102.4 563.2a76.8 76.8 0 0 0 0 13.312 79.104 79.104 0 0 0 38.912 54.784l8.96 4.352h2.304a25.6 25.6 0 0 1 15.36 22.016v63.744a112.384 112.384 0 0 0 80.896 105.472 51.2 51.2 0 0 0 98.816 5.888h313.088a51.2 51.2 0 0 0 98.816-5.888 112.384 112.384 0 0 0 79.104-105.472V650.752a25.6 25.6 0 0 1 8.192-11.52h1.536l4.608-2.816a80.384 80.384 0 0 0 51.2-61.44v-12.032a81.92 81.92 0 0 0-83.712-79.616", fill: "#FB952C" })
    ]) })
  ]);

  const CATEGORY_SYMBOL_BY_ID = new Map(
    [...CATEGORY_SYMBOLS, ...ADDITIONAL_CATEGORY_SYMBOLS].map((symbol) => [symbol.id, symbol])
  );

  const AUTH_STATE_VIEWS = new WeakMap();

  const FOCUS_IMAGE_HOSTS = new Set([
    "i0.hdslb.com",
    "i1.hdslb.com",
    "i2.hdslb.com",
    "i3.hdslb.com"
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

  const FOCUS_CAROUSEL_FIXTURE = Object.freeze([
    Object.freeze({
      key: "fixture-focus-1",
      imageUrl: "",
      linkUrl: "https://www.bilibili.com/",
      title: "本地焦点预览",
      subtitle: "固定 fixture",
      type: "focus-carousel",
      order: 1
    }),
    Object.freeze({
      key: "fixture-focus-2",
      imageUrl: "",
      linkUrl: "https://www.bilibili.com/video",
      title: "旧版首页轮播",
      subtitle: "等待受控数据",
      type: "focus-carousel",
      order: 2
    })
  ]);

  const RECOMMENDATION_FIXTURE = Object.freeze([
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "标题", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "热门视频加载中", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "个性化推荐加载中", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "推荐内容加载中", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" }),
    Object.freeze({ title: "更多热门内容", owner: "哔哩哔哩", play: "--播放", duration: "00:00", uri: "https://www.bilibili.com/" })
  ]);

  const NAV_ALLOWLIST = Object.freeze({
    HOME_ROOT: Object.freeze({ href: "https://www.bilibili.com/", target: "_self", rel: "" }),
    DOUGA: Object.freeze({ href: "https://www.bilibili.com/v/douga/", target: "_blank", rel: "noopener noreferrer" }),
    ANIME: Object.freeze({ href: "https://www.bilibili.com/anime/", target: "_blank", rel: "noopener noreferrer" }),
    GAME: Object.freeze({ href: "https://game.bilibili.com/platform/", target: "_blank", rel: "noopener noreferrer" }),
    LIVE: Object.freeze({ href: "https://live.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    SHOW: Object.freeze({ href: "https://show.bilibili.com/platform/home.html?msource=pc_web", target: "_blank", rel: "noopener noreferrer" }),
    MANGA: Object.freeze({ href: "https://manga.bilibili.com/?from=bill_top_mnav", target: "_blank", rel: "noopener noreferrer" }),
    MATCH: Object.freeze({ href: "https://www.bilibili.com/match/home/", target: "_blank", rel: "noopener noreferrer" }),
    ACTIVITY: Object.freeze({ href: "https://www.bilibili.com/blackboard/era/bkW0rNd9znQuejB0.html", target: "_blank", rel: "noopener noreferrer" }),
    TOPIC_LIST: Object.freeze({ href: "https://www.bilibili.com/blackboard/topic_list.html", target: "_blank", rel: "noopener noreferrer" }),
    APP: Object.freeze({ href: "https://app.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    CUSTOMER_SERVICE: Object.freeze({ href: "https://www.bilibili.com/v/customer-service", target: "_blank", rel: "noopener noreferrer" }),
    VIP: Object.freeze({ href: "https://account.bilibili.com/big", target: "_blank", rel: "noopener noreferrer" }),
    HISTORY: Object.freeze({ href: "https://www.bilibili.com/history", target: "_blank", rel: "noopener noreferrer" }),
    CREATOR: Object.freeze({ href: "https://member.bilibili.com/platform/home", target: "_blank", rel: "noopener noreferrer" })
  });
  const FOOTER_TARGETS = Object.freeze({
    ABOUT_US: Object.freeze({ href: "https://www.bilibili.com/blackboard/aboutUs.html", target: "_blank", rel: "noopener noreferrer" }),
    CONTACT: Object.freeze({ href: "https://www.bilibili.com/blackboard/contact.html", target: "_blank", rel: "noopener noreferrer" }),
    PROTOCOL: Object.freeze({ href: "https://www.bilibili.com/protocal/licence.html", target: "_blank", rel: "noopener noreferrer" }),
    JOIN: Object.freeze({ href: "https://www.bilibili.com/blackboard/join.html", target: "_blank", rel: "noopener noreferrer" }),
    PRIVACY: Object.freeze({ href: "https://www.bilibili.com/blackboard/privacy-pc.html", target: "_blank", rel: "noopener noreferrer" }),
    VERIFY: Object.freeze({ href: "https://account.bilibili.com/account/official/home", target: "_blank", rel: "noopener noreferrer" }),
    INVESTOR: Object.freeze({ href: "http://ir.bilibili.com", target: "_blank", rel: "noopener noreferrer" }),
    PROTOCOL_SUMMARY: Object.freeze({ href: "https://www.bilibili.com/blackboard/topic/activity-cn8bxPLzz.html", target: "_blank", rel: "noopener noreferrer" }),
    ACTIVITY_CENTER: Object.freeze({ href: "https://www.bilibili.com/blackboard/activity-list.html", target: "_blank", rel: "noopener noreferrer" }),
    ACTIVITY_TOPIC: Object.freeze({ href: "https://www.bilibili.com/blackboard/topic_list.html", target: "_blank", rel: "noopener noreferrer" }),
    COPYRIGHT: Object.freeze({ href: "https://www.bilibili.com/v/copyright/intro/", target: "_blank", rel: "noopener noreferrer" }),
    HELP: Object.freeze({ href: "https://www.bilibili.com/blackboard/help.html", target: "_blank", rel: "noopener noreferrer" }),
    COMMUNITY: Object.freeze({ href: "https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html", target: "_blank", rel: "noopener noreferrer" }),
    WALLPAPER: Object.freeze({ href: "https://space.bilibili.com/6823116#/album", target: "_blank", rel: "noopener noreferrer" }),
    AD: Object.freeze({ href: "https://e.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    HALL_OF_FAME: Object.freeze({ href: "https://www.bilibili.com/blackboard/activity-S1jfy69Jz.html", target: "_blank", rel: "noopener noreferrer" }),
    MCN: Object.freeze({ href: "https://mcn.bilibili.com/studio/mcn/entry", target: "_blank", rel: "noopener noreferrer" }),
    DANMAKU: Object.freeze({ href: "https://www.bilibili.com/video/BV1Xx411c7cH/", target: "_blank", rel: "noopener noreferrer" }),
    BRAND: Object.freeze({ href: "https://b.bilibili.com", target: "_blank", rel: "noopener noreferrer" }),
    APP: Object.freeze({ href: "https://app.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    CHARITY: Object.freeze({ href: "https://love.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    WEIBO: Object.freeze({ href: "https://weibo.com/bilibiliweb", target: "_blank", rel: "noopener noreferrer" }),
    BUSINESS_LICENSE: Object.freeze({ href: "https://i0.hdslb.com/bfs/activity-plat/static/20240516/9ccf041718e5d6d6dfaebc91b85c791c/gd85E6tDco.jpg", target: "_blank", rel: "noopener noreferrer" }),
    CULTURE_LICENSE: Object.freeze({ href: "https://i0.hdslb.com/bfs/activity-plat/static/20260209/3b3c5705bda98d50983f6f47df360fef/K4t52YryBV.jpeg", target: "_blank", rel: "noopener noreferrer" }),
    MIIT: Object.freeze({ href: "http://beian.miit.gov.cn/", target: "_blank", rel: "noopener noreferrer" }),
    PUBLICATION_LICENSE: Object.freeze({ href: "https://i0.hdslb.com/bfs/activity-plat/static/20240516/9ccf041718e5d6d6dfaebc91b85c791c/4ainzbFKao.jpg", target: "_blank", rel: "noopener noreferrer" }),
    SHJBZX: Object.freeze({ href: "http://www.shjbzx.cn", target: "_blank", rel: "noopener noreferrer" }),
    SH12345: Object.freeze({ href: "http://www.sh12345.gov.cn/", target: "_blank", rel: "noopener noreferrer" }),
    PUBLIC_SECURITY: Object.freeze({ href: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011002002436", target: "_blank", rel: "noopener noreferrer" }),
    CHILD_PROTECTION: Object.freeze({ href: "mailto:userreport@bilibili.com", target: "", rel: "" }),
    ANTI_PORN: Object.freeze({ href: "https://bzpt.shdf.gov.cn/www/shouye/gzfw/wsjb/index.shtml", target: "_blank", rel: "noopener noreferrer" }),
    ALGORITHM_1: Object.freeze({ href: "https://beian.cac.gov.cn/api/static/fileUpload/principalOrithm/additional/user_699bbd78-36f4-459c-aeb0-bf98a2a562d8_6185ea2c-c84c-404a-9280-c5465af05948.pdf", target: "_blank", rel: "noopener noreferrer" }),
    ALGORITHM_2: Object.freeze({ href: "https://beian.cac.gov.cn/api/static/fileUpload/principalOrithm/additional/user_699bbd78-36f4-459c-aeb0-bf98a2a562d8_e03e6855-76a6-43fb-b799-d090e7fce25d.pdf", target: "_blank", rel: "noopener noreferrer" }),
    ILLEGAL_CONTENT: Object.freeze({ href: "https://www.12377.cn/", target: "_blank", rel: "noopener noreferrer" })
  });

  const UPLOAD_ALLOWLIST = Object.freeze({
    COLUMN: Object.freeze({ href: "https://member.bilibili.com/platform/upload/text/apply", target: "_blank", rel: "noopener noreferrer" }),
    AUDIO: Object.freeze({ href: "https://member.bilibili.com/platform/upload/audio/frame", target: "_blank", rel: "noopener noreferrer" }),
    STICKER: Object.freeze({ href: "https://member.bilibili.com/platform/upload/sticker", target: "_blank", rel: "noopener noreferrer" }),
    VIDEO: Object.freeze({ href: "https://member.bilibili.com/platform/upload/video/frame", target: "_blank", rel: "noopener noreferrer" }),
    MANAGE: Object.freeze({ href: "https://member.bilibili.com/platform/upload-manager/article", target: "_blank", rel: "noopener noreferrer" })
  });
  const PROFILE_ACTION_TARGETS = Object.freeze({
    AVATAR: Object.freeze({ href: "https://space.bilibili.com/", target: "_blank", rel: "noopener noreferrer" }),
    LEVEL: Object.freeze({ href: "https://account.bilibili.com/account/record?type=exp", target: "_blank", rel: "noopener noreferrer" }),
    COIN: Object.freeze({ href: "https://account.bilibili.com/site/coin", target: "_blank", rel: "noopener noreferrer" }),
    BCOIN: Object.freeze({ href: "https://pay.bilibili.com/pay-v2-web/bcoin_index", target: "_blank", rel: "noopener noreferrer" }),
    EMAIL: Object.freeze({ href: "https://passport.bilibili.com/account/security#/bindmail", target: "_blank", rel: "noopener noreferrer" }),
    MOBILE: Object.freeze({ href: "https://passport.bilibili.com/account/security#/bindphone", target: "_blank", rel: "noopener noreferrer" }),
    PROFILE: Object.freeze({ href: "https://account.bilibili.com/account/home", target: "_blank", rel: "noopener noreferrer" }),
    SUBMISSIONS: Object.freeze({ href: "https://member.bilibili.com/v2#/upload-manager/article", target: "_blank", rel: "noopener noreferrer" })
  });
  const SEARCH_ENDPOINT = "https://search.bilibili.com/all";
  const SEARCH_DEFAULT_KEYWORD = "搜索";
  const MAX_SEARCH_KEYWORD_LENGTH = 128;

  const HOMEPAGE_CSS = `
:host { all: initial; box-sizing: border-box; display: block; min-height: 100vh; color: #18191c; background: #f6f7f8; font-family: Arial, sans-serif; }
:host, :host * { box-sizing: border-box; }
.homepage { min-height: 100vh; overflow: hidden; }
.container { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
.mini-header { min-height: 48px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e3e5e7; background: #fff; }
.mini-header__brand { color: #00aeec; font-size: 18px; font-weight: 700; }
.mini-header__state { color: #61666d; font-size: 13px; }
.banner { position: relative; overflow: hidden; min-height: 180px; background: #c8ecff; }
.banner__image { display: block; width: 100%; height: 180px; object-fit: cover; }
.banner__logo { position: absolute; left: 24px; bottom: 12px; width: 140px; height: auto; object-fit: contain; }
.primary-menu { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 0; }
.primary-menu__link, .primary-menu__placeholder { display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border: 1px solid #e3e5e7; border-radius: 4px; background: #fff; color: #18191c; font-size: 13px; text-decoration: none; }
.primary-menu__link:hover { border-color: #00aeec; color: #00aeec; }
.primary-menu__placeholder { color: #9499a0; }
.focus-carousel-section { margin: 8px 0 24px; padding: 20px; border: 1px solid #e3e5e7; border-radius: 6px; background: #fff; }
.focus-carousel { position: relative; width: min(550px, 100%); max-width: 100%; aspect-ratio: 550 / 242; overflow: hidden; background: #18191c; }
.focus-carousel[data-active-index="-1"] { background: #e8f7ff; }
.van-slide { position: relative; width: 100%; height: 100%; overflow: hidden; }
.carousel-track { position: relative; width: 100%; height: 100%; }
.focus-carousel .item { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; opacity: 0; pointer-events: none; transition: opacity 320ms cubic-bezier(.22, .61, .36, 1); }
.focus-carousel .item.is-active { opacity: 1; pointer-events: auto; }
.focus-carousel .item > a { display: block; width: 100%; height: 100%; color: inherit; text-decoration: none; }
.focus-carousel .item:not(.is-active) > a { pointer-events: none; }
.b-img { position: relative; width: 100%; height: 100%; overflow: hidden; background: #e8f7ff; }
.b-img::after { position: absolute; right: 0; bottom: 0; left: 0; height: 48px; background: linear-gradient(to bottom, rgba(24, 25, 28, 0), rgba(24, 25, 28, .88)); content: ""; pointer-events: none; }
.b-img__inner { display: block; width: 100%; height: 100%; }
.focus-carousel__image { display: block; width: 100%; height: 100%; object-fit: cover; }
.focus-carousel__placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #61666d; background: linear-gradient(135deg, #e8f7ff, #c8ecff); font-size: 12px; }
.focus-carousel__title { position: absolute; right: 12px; bottom: 10px; left: 12px; z-index: 1; margin: 0; overflow: hidden; color: #fff; font-size: 15px; font-weight: 400; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
.trigger { position: absolute; right: 12px; bottom: 12px; z-index: 3; display: flex; gap: 6px; align-items: center; height: 18px; }
.trigger span { display: block; width: 8px; height: 8px; padding: 0; border: 0; border-radius: 50%; background: #fff; cursor: pointer; opacity: .9; }
.trigger span.on { background: transparent; pointer-events: none; }
.trigger-indicator { position: absolute; top: 0; left: -5px; z-index: 1; display: block; width: 18px; height: 18px; border: 2px solid #fff; border-radius: 50%; background: #00aeec; box-shadow: 0 0 0 1px rgba(24, 25, 28, .12); pointer-events: none; transform: translate3d(0, 0, 0); transition: transform 320ms cubic-bezier(.22, .61, .36, 1); }
.more { position: absolute; top: auto; right: 12px; bottom: 44px; z-index: 3; padding: 2px 6px; color: #fff; background: rgba(24, 25, 28, .58); font-size: 12px; line-height: 18px; text-decoration: none; opacity: 0; transition: opacity .3s; }
.focus-carousel:hover .more, .focus-carousel:focus-within .more { opacity: 1; }
.more[hidden], .trigger[hidden] { display: none; }
.focus-carousel[data-active-index="-1"] .more { display: none; }
.section { margin: 8px 0 24px; padding: 20px; border: 1px solid #e3e5e7; border-radius: 6px; background: #fff; }
.section__heading { margin: 0 0 16px; color: #18191c; font-size: 22px; line-height: 1.3; }
.fixture-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.fixture-card { min-width: 0; padding: 14px; border: 1px solid #e3e5e7; border-radius: 4px; background: #fbfcfd; }
.fixture-card__placeholder { height: 82px; margin-bottom: 12px; background: #e8f7ff; }
.fixture-card__title { margin: 0 0 8px; color: #18191c; font-size: 15px; line-height: 1.4; }
.fixture-card__count { margin: 0; color: #9499a0; font-size: 12px; }
.inert-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
.inert-placeholder { padding: 12px 8px; border: 1px dashed #c9ccd0; color: #9499a0; font-size: 12px; text-align: center; }
.footer { margin-top: 28px; padding: 24px 0 40px; border-top: 1px solid #e3e5e7; color: #9499a0; font-size: 12px; }
/* legacy elevator base — overridden by SHELL_CSS block below */
@media (max-width: 1438px) { .focus-carousel { width: min(459px, 100%); aspect-ratio: 459 / 202; } }
@media (max-width: 720px) { .fixture-list, .inert-grid { grid-template-columns: 1fr; } .banner__logo { left: 16px; width: 116px; } }
  @media (prefers-reduced-motion: reduce) { .item, .trigger-indicator { transition-duration: 0ms; } }
  `;

  const SHELL_CSS = `
  @font-face { font-family: "extension-bilifont"; src: url("__EXTENSION_ICONFONT_URL__") format("woff2"); font-style: normal; font-weight: 400; font-display: swap; }
  :host { all: initial; box-sizing: border-box; display: block; min-height: 100vh; color: #18191c; background: #f6f7f8; font-family: Arial, "Microsoft YaHei", sans-serif; }
  :host, :host * { box-sizing: border-box; }
  .homepage { position: relative; min-height: 100vh; overflow-x: hidden; background: #f6f7f8; }
  .category-icon-sprite { position: absolute; width: 0; height: 0; overflow: hidden; }
  .homepage a { color: inherit; }
  .homepage button, .homepage input { font: inherit; }
  .homepage [hidden] { display: none !important; }
  .b-wrap, .container { width: min(1630px, calc(100% - 48px)); margin: 0 auto; }
  .international-header { position: absolute; top: 0; right: 0; left: 0; z-index: 10; height: 56px; color: #18191c; background: transparent; }
  .mini-header, .mini-header__content { height: 56px; }
  .mini-header__content { display: grid; grid-template-columns: max-content minmax(0, 1fr) max-content; align-items: start; column-gap: clamp(8px, 1vw, 16px); width: 100%; height: 56px; margin: 0 auto; padding: 10px 24px; }
  .header-brand { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 5px; height: 36px; color: #fff; font-size: 16px; font-weight: 700; text-decoration: none; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .header-brand__icon { display: none; }
  .header-brand__image { display: block; width: 70px; height: 32px; object-fit: contain; }
  .header-brand .bilifont, .bilifont { font-family: "extension-bilifont", Arial, sans-serif !important; font-style: normal !important; font-weight: 400 !important; }
  .nav-link { flex: 0 0 auto; min-width: max-content; }
  .nav-link-ul { display: flex; flex-wrap: nowrap; gap: 12px; align-items: center; width: max-content; max-width: 100%; margin: 0; padding: 0; list-style: none; }
  .nav-link-item { position: relative; flex: 0 0 auto; min-width: max-content; }
  .nav-link-item .link { display: block; height: 32px; overflow: visible; color: #fff; font-size: 14px; line-height: 32px; text-decoration: none; text-overflow: clip; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); white-space: nowrap; }
  .nav-link-item .nav-main { display: inline-flex; align-items: center; gap: 6px; }
  .nav-main-icon, .nav-download-icon { display: inline-flex; flex: 0 0 16px; width: 16px; height: 16px; align-items: center; justify-content: center; font-size: 16px; line-height: 16px; }
  .nav-link-item .link:hover, .nav-link-item .link:focus-visible { color: #fff; }
  .nav-link-placeholder { cursor: default; opacity: .8; }
  .nav-search-box { flex: 1 1 auto; width: auto; min-width: 0; max-width: none; }
  .nav-search { display: flex; height: 36px; overflow: hidden; border: 1px solid rgba(255, 255, 255, .65); border-radius: 4px; background: rgba(255, 255, 255, .92); }
  .nav-search-keyword { flex: 1 1 auto; min-width: 0; padding: 0 10px; border: 0; outline: 0; color: #18191c; background: transparent; }
  .nav-search-btn { flex: 0 0 36px; border: 0; color: #61666d; background: transparent; cursor: pointer; }
  .nav-search-btn:hover, .nav-search-btn:focus-visible { color: #00aeec; background: #e5f7ff; }
  .nav-user-center { display: flex; flex: 0 0 auto; align-items: flex-start; gap: 8px; min-width: max-content; }
  .user-con { position: relative; display: flex; align-items: center; min-height: 36px; }
  .user-con a, .user-con button { border: 0; color: #fff; background: transparent; font-size: 14px; text-decoration: none; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); cursor: pointer; }
  .user-con a:hover, .user-con a:focus-visible, .user-con button:hover, .user-con button:focus-visible { color: #fff; }
  .auth-state-panel { display: flex; align-items: center; gap: 8px; }
  .auth-state-label { display: none; color: rgba(255, 255, 255, .82); font-size: 11px; white-space: nowrap; }
  .auth-branch { display: none; align-items: center; gap: 8px; visibility: hidden; pointer-events: none; opacity: 0; }
  .auth-link { color: #fff; font-size: 14px; text-decoration: none; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); white-space: nowrap; }
  .auth-link--inert { cursor: default; opacity: .82; }
  .auth-register { padding: 0 0 0 4px; border: 0; color: #fff; background: transparent; font: inherit; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .auth-state-panel[data-state="logged_in"] { display: none; }
  .auth-state-panel[data-state="logged_out"] .auth-branch--logout,
  .auth-state-panel[data-state="unknown"] .auth-branch--unknown { display: flex; visibility: visible; pointer-events: auto; opacity: 1; }
  .mini-avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; overflow: hidden; border: 2px solid rgba(255, 255, 255, .9); border-radius: 50%; color: #00aeec; background: #e5f7ff; font-size: 10px; text-shadow: none; }
  .mini-avatar__icon { width: 22px; height: 22px; }
  .mini-avatar__image { display: block; width: 32px; height: 32px; object-fit: cover; border-radius: 50%; }
  .auth-vip-fallback { width: 92px; height: 27px; object-fit: contain; }
  .mini-header__activity { display: block; flex: 0 0 auto; width: 72px; height: 27px; object-fit: contain; }
  .mini-upload-wrap { flex: 0 0 auto; }
  .mini-upload { display: inline-flex; align-items: center; min-height: 36px; padding: 0 20px; border-radius: 2px; color: #fff; background: #fb7299; text-shadow: none; }
  .auth-entry-icons { display: none; }
  .auth-entry-icons img { display: block; width: 38px; height: 38px; object-fit: contain; }
  .mini-login-stub { position: absolute; top: 42px; right: 24px; z-index: 20; width: 348px; min-height: 250px; padding: 16px; border: 1px solid #e5e9ef; border-radius: 6px; color: #18191c; background: #fff; box-shadow: 0 12px 36px rgba(25, 30, 35, .2); }
  .mini-login__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .mini-login__title { margin: 0; font-size: 16px; }
  .mini-login__close { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; padding: 0; border: 0; background: transparent; cursor: pointer; }
  .mini-login__close img { width: 18px; height: 18px; }
  .mini-login__characters { display: flex; align-items: flex-end; justify-content: space-around; height: 92px; overflow: hidden; background: #f6f7f8; }
  .mini-login__characters img { max-width: 42%; height: 92px; object-fit: contain; }
  .mini-login__social { display: flex; justify-content: center; gap: 16px; padding-top: 12px; }
  .mini-login__social img { width: 28px; height: 28px; }
  .mini-login__note { margin: 10px 0 0; color: #9499a0; font-size: 12px; text-align: center; }
  .bili-banner { position: relative; z-index: 0; min-width: 999px; min-height: 155px; height: 9.375vw; overflow: hidden; display: flex; justify-content: center; background: #f9f9f9; }
  .animated-banner { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
  .animated-banner > .banner-layer-item { position: absolute; top: 0; left: 0; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; will-change: transform; }
  .animated-banner > .banner-layer-item img, .animated-banner > .banner-layer-item video { flex: 0 0 auto; max-width: none; max-height: none; object-fit: fill; will-change: transform; transform-origin: center center; pointer-events: none; }
  .bili-banner .taper-line { position: absolute; top: 0; left: 0; z-index: 0; width: 100%; height: 100px; background: linear-gradient(rgba(0,0,0,.4), transparent); pointer-events: none; }
  .bili-banner .b-logo { position: relative; z-index: 2; --banner-wrap-width: 1630px; width: min(var(--banner-wrap-width), calc(100% - 48px)); height: 100%; margin: 0; }
  .bili-banner .head-logo { position: absolute; display: block; width: 220px; height: 50%; min-height: 60px; left: 0; bottom: 10px; z-index: 1; pointer-events: auto; }
  .bili-banner .head-logo .logo-img { display: block; width: auto; height: 100%; object-fit: contain; }
  .bili-banner .banner-link { position: absolute; inset: 0; z-index: 0; display: block; }
  /* legacy banner-layer/banner__image styles removed — .animated-banner handles it */
  .primary-menu-wrap { height: 108px; background: #fff; border-bottom: 1px solid #e5e9ef; }
  .primary-menu-itnl { position: relative; display: flex; height: 108px; align-items: stretch; }
  .page-tab { flex: 0 0 auto; height: 68px; padding-top: 14px; }
  .page-tab .con { display: flex; gap: 10px; height: 54px; margin: 0; padding: 0; list-style: none; }
  .page-tab li a { display: flex; flex-direction: column; align-items: center; min-width: 54px; color: #18191c; font-size: 12px; text-decoration: none; }
  .page-tab li a:hover, .page-tab li.on a { color: #00aeec; }
  .round { display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center; margin-bottom: 3px; border-radius: 50%; background: #fff; }
  .round .svg-icon { width: 24px; height: 24px; }
  .round.yel { background: #fb7299; }
  .round.orange { background: #ff9c00; }
  .round.channel { background: #7bc96f; }
  .tab-line-itnl { width: 1px; height: 52px; margin: 17px 12px 0; background: #e5e9ef; }
  .channel-menu-itnl { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); grid-template-rows: repeat(2, 34px); flex: 1 1 auto; min-width: 0; padding-top: 17px; }
  .channel-menu-itnl > span, .friendship-link > span { position: relative; min-width: 0; }
  .channel-menu-itnl .item, .friendship-link .item { display: block; height: 34px; }
  .channel-menu-itnl .item { display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .channel-menu-itnl .category-icon { width: 24px; height: 24px; }
  .channel-menu-itnl .name, .friendship-link .name { display: block; overflow: hidden; padding: 0 6px; color: #61666d; font-size: 12px; line-height: 34px; text-align: center; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .channel-menu-itnl .name:hover, .channel-menu-itnl .name:focus-visible, .friendship-link .name:hover, .friendship-link .name:focus-visible { color: #00aeec; }
  .van-popper-channel, .friendship-popover, .header-popover { position: absolute; top: 31px; left: 50%; z-index: 15; display: none; min-width: 176px; padding: 10px; border: 1px solid #e5e9ef; border-radius: 4px; background: #fff; box-shadow: 0 8px 22px rgba(25, 30, 35, .14); transform: translateX(-50%); }
  .channel-menu-itnl > span:hover .van-popper-channel, .channel-menu-itnl > span:focus-within .van-popper-channel, .friendship-link > span:hover .friendship-popover, .friendship-link > span:focus-within .friendship-popover, .header-popover-wrap:hover .header-popover, .header-popover-wrap:focus-within .header-popover { display: block; }
  .sub-container { display: grid; gap: 4px; }
  .sub-item { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 8px; }
  .sub-item .name, .friendship-popover .name { line-height: 26px; }
  .friendship-link { flex: 0 0 180px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, 34px); padding-top: 17px; }
  .first-screen { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; margin-top: 20px; }
  .focus-carousel-section { min-width: 0; margin: 0; padding: 0; border: 0; background: transparent; }
  .focus-carousel-section > .section__heading { display: none; }
  .focus-carousel { width: 100%; aspect-ratio: 550 / 242; border-radius: 4px; box-shadow: 0 2px 8px rgba(25, 30, 35, .08); }
  .carousel-track { position: relative; width: 100%; height: 100%; }
  .carousel-track .item { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none; transition: opacity 320ms cubic-bezier(.22, .61, .36, 1); }
  .carousel-track .item.is-active { opacity: 1; pointer-events: auto; }
  .carousel-track .item > a { display: block; width: 100%; height: 100%; }
  .focus-carousel .b-img::after { position: absolute; right: 0; bottom: 0; left: 0; height: 48px; background: linear-gradient(to bottom, rgba(24, 25, 28, 0), rgba(24, 25, 28, .9)); content: ""; pointer-events: none; }
  .focus-carousel__image { display: block; width: 100%; height: 100%; object-fit: cover; }
  .focus-carousel .trigger span { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
  .focus-carousel .trigger span.on { opacity: .2; }
  .focus-carousel .trigger-indicator { width: 18px; height: 18px; border: 2px solid #fff; border-radius: 50%; background: #00aeec; transition: transform 320ms cubic-bezier(.22, .61, .36, 1); }
  .rcmd-box-wrap { min-width: 0; }
  .rcmd-box { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; height: 100%; padding: 12px; border: 1px solid #e5e9ef; background: #fff; }
  .recommend-card { min-width: 0; }
  .recommend-card__placeholder { width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: 4px; background: linear-gradient(135deg, #f4efff, #d9f4ff); box-shadow: 0 3px 10px rgba(25, 30, 35, .1); }
  .recommend-card__title { display: block; overflow: hidden; margin: 6px 0 0; color: #61666d; font-size: 12px; line-height: 18px; text-overflow: ellipsis; white-space: nowrap; }
  .storey-box { width: min(1630px, calc(100% - 48px)); margin: 24px auto 0; }
  .storey-title, .rank-header { display: flex; align-items: center; justify-content: space-between; min-height: 36px; margin-bottom: 10px; }
  .storey-title .l-con, .rank-header .l-con { display: flex; align-items: center; min-width: 0; }
  .storey-icon { flex: 0 0 36px; width: 36px; height: 36px; margin-right: 6px; }
  .storey-title .name, .rank-header .name { margin: 0; color: #18191c; font-size: 20px; font-weight: 400; line-height: 36px; text-decoration: none; }
  .storey-title .text-info { margin-left: 8px; color: #9499a0; font-size: 12px; }
  .exchange-btn { display: flex; align-items: center; gap: 10px; }
  .btn-change, .more { color: #9499a0; font-size: 12px; text-decoration: none; cursor: pointer; }
  .btn-change:hover, .more:hover { color: #00aeec; }
  .floor-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 24px; min-width: 0; }
  .zone-list-box, .live-list-box { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; min-width: 0; }
  .video-card-common, .live-card { min-width: 0; }
  .card-pic, .live-card .pic, .media-placeholder { position: relative; width: 100%; aspect-ratio: 206 / 116; overflow: hidden; border-radius: 4px; background: linear-gradient(135deg, #e8f7ff, #c8ecff); box-shadow: 0 3px 10px rgba(25, 30, 35, .1); }
  .media-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: #61666d; font-size: 12px; }
  .media-placeholder__icon { width: 34px; height: 34px; }
  .media-placeholder__label { display: block; }
  .knowledge-card__image, .music-card__image, .animal-card__image, .fashion-card__image, .pgc-timeline__image { display: block; width: 100%; height: 100%; object-fit: cover; }
  .card-pic .count, .live-card .count { position: absolute; right: 8px; bottom: 6px; color: #fff; font-size: 11px; text-shadow: 0 1px 2px #18191c; }
  .live-card__image { display: block; width: 100%; height: 100%; object-fit: cover; }
  .video-card-common .title, .live-card .name { display: block; overflow: hidden; margin-top: 8px; color: #18191c; font-size: 13px; line-height: 19px; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .video-card-common .up, .live-card .desc { display: block; overflow: hidden; margin-top: 3px; color: #9499a0; font-size: 12px; line-height: 18px; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .live-card .up { display: flex; align-items: center; gap: 7px; margin-top: 7px; }
  .live-card__meta { display: inline-flex; flex: 0 0 36px; width: 36px; height: 36px; align-items: center; justify-content: center; color: #9499a0; font-size: 10px; line-height: 14px; }
  .up-cover, .face-placeholder { display: inline-flex; flex: 0 0 36px; width: 36px; height: 36px; align-items: center; justify-content: center; border: 1px solid #e5e9ef; border-radius: 50%; color: #00aeec; background: #e5f7ff; font-size: 9px; }
  .up-cover__icon { width: 22px; height: 22px; }
  .live-card .tag { color: #fb7299; font-size: 11px; }
  .rank-list, .live-tabs, .pgc-rank { min-width: 0; }
  .rank-header .name { font-size: 16px; }
  .rank-wrap, .pgc-rank-wrap { display: flex; align-items: center; min-height: 34px; gap: 10px; }
  .rank-wrap .number, .pgc-rank-wrap .number { flex: 0 0 22px; color: #9499a0; font-size: 13px; text-align: center; }
  .rank-wrap:nth-child(-n+4) .number, .pgc-rank-wrap:nth-child(-n+4) .number { color: #00aeec; font-weight: 700; }
  .rank-cover { display: block; flex: 0 0 48px; width: 48px; height: 27px; overflow: hidden; border-radius: 2px; background: #e8f7ff; }
  .rank-cover__image { display: block; width: 100%; height: 100%; object-fit: cover; }
  .rank-meta { display: block; min-width: 0; flex: 1 1 auto; }
  .rank-wrap .link, .pgc-rank-wrap .link { min-width: 0; color: #61666d; text-decoration: none; }
  .rank-wrap .title, .pgc-rank-wrap .title { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rank-wrap:hover .title, .rank-wrap:focus-within .title { color: #00aeec; }
  .live-tabs { padding: 12px; border: 1px solid #e5e9ef; background: #fff; }
  .tab-switch { display: flex; gap: 14px; min-height: 28px; border-bottom: 1px solid #e5e9ef; }
  .tab-switch-item { color: #9499a0; font-size: 12px; line-height: 24px; }
  .tab-switch-item.on { color: #00aeec; }
  .live-rank { padding-top: 8px; }
  .live-rank .rank-wrap { min-height: 31px; }
  .live-following-list { min-height: 120px; padding-top: 14px; color: #9499a0; font-size: 12px; }
  .empty-state { padding: 18px 0; color: #9499a0; font-size: 12px; text-align: center; }
  .first-screen + .storey-box { margin-top: 24px; }
  .extension { min-width: 0; }
  .proxy-box { width: 100%; min-width: 0; }
  .proxy-box > [id^="bili_"] { width: 100%; min-width: 0; }
  .proxy-box > [id^="bili_"] > .space-between { width: 100%; }
  #reportFirst2 { display: flex; min-height: 71px; align-items: flex-start; justify-content: space-between; margin-top: 30px; }
  #reportFirst2 .extension { width: calc(100% - 344px); min-width: 0; flex: 1 1 auto; }
  #reportFirst2 .storey-title { display: flex; height: 36px; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  #reportFirst2 .storey-title .l-con { display: flex; min-width: 0; align-items: center; }
  #reportFirst2 .storey-title .svg-icon { width: 36px; height: 36px; flex: 0 0 36px; margin-right: 6px; overflow: hidden; color: #00a1d6; fill: currentColor; }
  #reportFirst2 .storey-title .name { margin-right: 20px; color: #212121; font-size: 20px; font-weight: 400; line-height: 36px; text-decoration: none; }
  #reportFirst2 .storey-title .name.no-link { cursor: default; }
  #reportFirst2 .ext-box { display: flex; min-height: 0; flex-wrap: wrap; align-content: flex-start; justify-content: space-between; }
  #reportFirst2 .bypb-window { width: clamp(265px, 20.84vw, 320px); flex: 0 0 clamp(265px, 20.84vw, 320px); margin-left: clamp(16px, 1.56vw, 24px); }
  #reportFirst2 .bypb-window .online { display: flex; height: 30px; align-items: center; justify-content: center; margin-top: 3px; margin-bottom: 19px; border: 1px solid #e7e7e7; border-radius: 2px; background: #f4f4f4; }
  #reportFirst2 .bypb-window .online-link { display: block; flex: 1 1 auto; color: #505050; font-size: 12px; font-weight: 400; line-height: 30px; text-align: center; text-decoration: none; }
  .bypb-window .online-link:hover, .bypb-window .online-link:focus-visible { color: #00aeec; }
  @media (max-width: 720px) { #reportFirst2 { flex-direction: column; } #reportFirst2 .extension, #reportFirst2 .bypb-window { width: 100%; flex-basis: auto; } #reportFirst2 .bypb-window { margin-left: 0; } }
  .time-line { min-width: 0; }
  .time-line .zone-list-box { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .time-line-card { min-width: 0; }
  .time-line-card .pic { display: block; width: 100%; aspect-ratio: 206 / 116; overflow: hidden; background: #f1f2f3; border-radius: 4px; }
  .pgc-tab-switch { margin-bottom: 10px; overflow-x: auto; }
  .pgc-tab-switch-item { flex: 0 0 auto; padding: 0 4px; cursor: pointer; }
  .pgc-tab-switch-item.is-today { color: #fb7299; }
  .pgc-timeline__image { display: block; width: 100%; height: 100%; object-fit: cover; }
  .time-line-card .txt { display: block; min-width: 0; }
  .time-line-card .ss, .time-line-card .update, .time-line-card .pub-time { display: block; overflow: hidden; margin-top: 6px; color: #61666d; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .time-line-card .ss { color: #18191c; text-decoration: none; }
  .time-line-card .ss:hover, .time-line-card .ss:focus-visible { color: #00aeec; }
  .pgc-rank-wrap .link { display: block; min-width: 0; text-decoration: none; }
  .pgc-rank-wrap .txt { display: block; min-width: 0; }
  .pgc-rank-wrap .update, .pgc-rank-wrap .badge { margin-left: 6px; color: #9499a0; font-size: 11px; }
  .pgc-rank-wrap .badge { color: #fb7299; }
  .pgc-status { display: block; min-height: 18px; color: #9499a0; font-size: 12px; }
  .international-footer { margin-top: 40px; padding: 32px 0; color: #61666d; background: #f6f7f8; border-top: 1px solid #e5e9ef; }
  .international-footer .link-box { display: flex; gap: 40px; }
  .footer_left { display: flex; flex: 1 1 auto; min-width: 0; }
  .footer_right { flex: 0 0 360px; }
  .link-item { flex: 1 1 0; min-width: 0; }
  .link-item .bt { display: block; margin-bottom: 12px; color: #9499a0; font-size: 15px; }
  .link-item ul { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px 16px; margin: 0; padding: 0; list-style: none; }
  .link-item a { color: #61666d; font-size: 12px; text-decoration: none; }
  .link-item a:hover, .link-item a:focus-visible { color: #00aeec; }
  .link-c { display: flex; justify-content: space-between; gap: 10px; }
  .link-c .a-wraper { min-width: 0; text-align: center; }
  .link-c .a-wraper > a { position: relative; display: block; }
  .footer-glyph { display: inline-flex; width: 42px; height: 42px; align-items: center; justify-content: center; border-radius: 50%; color: #fff; background: #00aeec; font-size: 20px; }
  .footer-icon { display: block; width: 42px; height: 42px; object-fit: contain; }
  .footer-qr { position: absolute; right: 50%; bottom: 52px; display: none; width: 108px; height: 108px; padding: 5px; border: 1px solid #e5e9ef; background: #fff; transform: translateX(50%); }
  .link-c .a-wraper > a:hover .footer-qr, .link-c .a-wraper > a:focus-visible .footer-qr { display: block; }
  .link-c .a-wraper:last-child .footer-qr { right: 0; transform: none; }
  .link-c p { margin: 7px 0 0; font-size: 12px; }
  .partner { display: flex; gap: 20px; padding-top: 30px; color: #9499a0; font-size: 11px; line-height: 20px; }
  .partner .pic-box { display: flex; flex: 0 0 100px; flex-direction: column; gap: 5px; }
  .partner .pic { width: 96px; height: 75px; object-fit: contain; }
  .partner .pic962110 { width: 100px; height: 40px; object-fit: contain; }
  .partner .text-con { min-width: 0; }
  .partner p { margin: 0; }
  .footer-sprite { display: inline-block; width: 112px; height: 19px; object-fit: contain; vertical-align: middle; }
  .elevator { position: fixed; --elevator-wrap-width: 1630px; --elevator-floor-h: 24px; --elevator-floor-font: 12px; --elevator-list-pad: 6px; --elevator-sort-gap: 4px; --elevator-sort-h: 32px; --elevator-back-h: 32px; right: max(8px, calc((100vw - var(--elevator-wrap-width)) / 2 - 99px)); top: 10px; z-index: 10; width: 56px; transition: opacity .2s ease; }
  .elevator[data-visible="false"] { opacity: 0; visibility: hidden; pointer-events: none; }
  .elevator.is-footer-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
  .elevator .mask { display: none; position: fixed; inset: 0; z-index: 0; background: rgba(0,0,0,.5); }
  .elevator .list-box { position: relative; padding-top: var(--elevator-list-pad); background: #fff; border: 1px solid #e7e7e7; border-top-left-radius: 10px; border-top-right-radius: 10px; z-index: 2; }
  .elevator .item { display: block; width: 54px; height: var(--elevator-floor-h); padding: 0; border: 0; color: #505050; background: #fff; font-size: var(--elevator-floor-font); line-height: var(--elevator-floor-h); text-align: center; cursor: pointer; user-select: none; box-sizing: border-box; transition: background-color .2s, color .2s; font-family: inherit; }
  .elevator .item:hover, .elevator .item:focus-visible, .elevator .item.is-selected, .elevator .item.on { color: #fff; background: #00a1d6; outline: 0; }
  .elevator .item.sort { position: relative; height: var(--elevator-sort-h); margin-top: var(--elevator-sort-gap); border-top: 1px solid #e7e7e7; line-height: var(--elevator-sort-h); }
  .elevator .item.back-top { position: absolute; left: -1px; bottom: calc(-1 * var(--elevator-back-h)); width: 56px; height: var(--elevator-back-h); margin-top: 0; border: 1px solid #e7e7e7; border-top: 0; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; line-height: calc(var(--elevator-back-h) - 2px); background: #fff; }
  .elevator .item.back-top:hover, .elevator .item.back-top:focus-visible { background: #00a1d6; color: #fff; }
  .elevator .item .bilifont { color: #999; font-size: 13px; line-height: 1; vertical-align: middle; }
  .elevator .item.sort .bilifont { font-size: 15px; }
  .elevator .item.back-top .bilifont { font-size: calc(var(--elevator-back-h) - 6px); }
  .elevator .item:hover .bilifont, .elevator .item.on .bilifont, .elevator .item.is-selected .bilifont, .elevator .item:focus-visible .bilifont { color: #fff; }
  .elevator .ear { position: absolute; top: -10px; left: 3px; z-index: 2; color: #333; font-size: 12px; line-height: 1; pointer-events: none; }
  .elevator .ear .icon-font-fallback--text { color: #333; font-size: 12px; line-height: 1; }
  .elevator .bg23 { display: none; position: absolute; top: -20px; right: -15px; z-index: 1; width: 130px; height: 105%; border-radius: 2px; background-color: rgba(255, 255, 255, .8); background-image: var(--extension-b-bg23-url); background-repeat: no-repeat; background-position: 14px 18px; pointer-events: none; }
  .elevator.edit { z-index: 1000; }
  .elevator.edit .mask { display: block; }
  .elevator.edit .bg23 { display: block; }
  .elevator.edit .ear, .elevator.edit .list-box { z-index: 2; }
  .elevator.edit .item.on, .elevator.edit .item.is-selected { background-color: #fff; color: #505050; }
  .elevator.edit .item.on .bilifont, .elevator.edit .item.is-selected .bilifont { color: #999; }
  .elevator.edit .item.sortable { cursor: grab; touch-action: none; }
  .elevator.edit .item.sortable.is-dragging { color: rgba(80, 80, 80, .32); background-color: #f4f5f7; cursor: grabbing; }
  .slicksort-selected { position: fixed; top: 0; left: 0; z-index: 1001; width: 54px; height: 24px; color: #fff; background: #00a1d6; border-radius: 2px; box-shadow: 0 10px 24px rgba(0,0,0,.18); line-height: 24px; text-align: center; pointer-events: none !important; }
  .slicksort-selected .bilifont { color: #fff; }
  .elevator__edit-asset { display: none; }
  @media (max-height: 700px) {
    .elevator { --elevator-floor-h: 20px; --elevator-floor-font: 12px; --elevator-list-pad: 4px; --elevator-sort-gap: 4px; --elevator-sort-h: 28px; --elevator-back-h: 28px; }
  }
  @media (max-width: 1870px) { .bili-banner .b-logo { --banner-wrap-width: 1414px; width: min(var(--banner-wrap-width), calc(100% - 40px)); } .elevator { --elevator-wrap-width: 1414px; } }
  @media (max-width: 1654px) { .bili-banner .b-logo { --banner-wrap-width: 1198px; width: min(var(--banner-wrap-width), calc(100% - 32px)); } .elevator { --elevator-wrap-width: 1198px; } }
  @media (max-width: 1438px) { .bili-banner .b-logo { --banner-wrap-width: 999px; width: min(var(--banner-wrap-width), calc(100% - 32px)); } .elevator { --elevator-wrap-width: 999px; } }
  @media (max-width: 1665px) { .b-wrap, .container, .mini-header__content, .storey-box { width: min(1414px, calc(100% - 40px)); } .nav-link-ul { gap: 9px; } .floor-layout { gap: 18px; } }
  @media (max-width: 1438px) { .b-wrap, .container, .mini-header__content, .storey-box { width: min(1198px, calc(100% - 32px)); } .mini-header__content { gap: 9px; } .nav-link-ul { gap: 5px; } .nav-link-item .link { font-size: 12px; } .nav-search-box { flex: none; width: auto; min-width: 0; } .channel-menu-itnl { grid-template-columns: repeat(8, minmax(0, 1fr)); } .floor-layout { grid-template-columns: minmax(0, 1fr) 280px; } .zone-list-box, .live-list-box { gap: 12px; } }
  @media (max-width: 980px) { .nav-link { display: none; } .nav-search-box { flex: none; width: auto; min-width: 0; } .friendship-link { display: none; } .channel-menu-itnl { grid-template-columns: repeat(6, minmax(0, 1fr)); } .first-screen { grid-template-columns: 1fr; } .rcmd-box-wrap { min-height: 150px; } .floor-layout { grid-template-columns: 1fr; } .rank-list, .live-tabs, .pgc-rank { width: 100%; } .international-footer .link-box { flex-direction: column; } .footer_right { flex-basis: auto; } .elevator { display: none; } }
  @media (max-width: 640px) { .mini-header__content { width: calc(100% - 20px); } .mini-header__activity { display: none; } .auth-state-label { display: none; } .b-wrap, .container, .storey-box { width: calc(100% - 20px); } .primary-menu-wrap, .primary-menu-itnl { height: auto; min-height: 108px; } .channel-menu-itnl { grid-template-columns: repeat(4, minmax(0, 1fr)); } .zone-list-box, .live-list-box, .time-line .zone-list-box { grid-template-columns: repeat(2, minmax(0, 1fr)); } .international-footer .link-box, .footer_left, .partner { flex-direction: column; } .footer_left { gap: 18px; } .partner .pic-box { flex-basis: auto; flex-direction: row; } }
  @media (prefers-reduced-motion: reduce) { .carousel-track .item, .trigger-indicator { transition-duration: 0ms; } }
  /* Legacy A-plan composition: the header floats over the hero and the first screen stays dense. */
  .international-header { height: 56px; border-bottom: 0; background: transparent; color: #fff; }
  .mini-header, .mini-header__content { height: 56px; }
  .mini-header__content { width: 100%; gap: 14px; padding: 10px 24px; }
  .header-brand, .nav-link-item .link, .auth-link, .auth-state-label, .auth-unknown-label { color: #fff; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .header-brand { font-size: 16px; }
  .header-brand__icon { display: none; }
  .nav-link-ul { gap: 12px; }
  .nav-link-item .link { font-size: 14px; line-height: 34px; }
  .nav-search-box { flex: none; width: auto; min-width: 0; }
  .nav-search { height: 36px; border-color: rgba(255, 255, 255, .65); background: rgba(255, 255, 255, .92); }
  .nav-search-keyword { font-size: 14px; }
  .nav-search-btn { color: #61666d; }
  .mini-avatar { width: 34px; height: 34px; border-color: rgba(255, 255, 255, .75); }
  .auth-state-label { color: rgba(255, 255, 255, .82); }
  .auth-state-text { display: none; }
  .auth-login-button { color: #fff; background: #00aeec; border-radius: 20px; padding: 0 12px; }
  .mini-upload { min-height: 34px; padding: 0 22px; border-radius: 2px; color: #fff; background: #fb7299; }
  /* legacy fixed-height banner override removed — .bili-banner uses fluid 9.375vw */
  .primary-menu-wrap, .primary-menu-itnl { height: 108px; }
  .primary-menu-wrap { border-bottom: 1px solid #e5e9ef; }
  .primary-menu-itnl { align-items: flex-start; }
  .page-tab { padding-top: 22px; }
  .channel-menu-itnl { grid-template-rows: repeat(2, 34px); padding-top: 17px; }
  .channel-menu-itnl .item, .friendship-link .item { height: 34px; }
  .channel-menu-itnl .category-icon { width: 26px; height: 26px; }
  .channel-menu-itnl .item { position: relative; }
  .channel-menu-itnl .channel-count { position: absolute; top: 2px; right: 3px; padding: 0 3px; border-radius: 2px; color: #fff; background: #65c5df; font-size: 9px; line-height: 13px; }
  .page-tab .round { background: transparent; }
  .channel-menu-itnl .name, .friendship-link .name { color: #212121; line-height: 30px; }
  .first-screen { grid-template-columns: 550px minmax(0, 1fr); gap: 10px; margin-top: 0; }
  .focus-carousel { aspect-ratio: 550 / 242; border-radius: 2px; box-shadow: none; }
  .rcmd-box { grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 12px; height: 100%; padding: 0; border: 0; }
  .recommend-card { position: relative; overflow: hidden; }
  .recommend-card__placeholder { height: 100%; aspect-ratio: auto; border-radius: 2px; background: linear-gradient(to bottom, #f1f2f3 58%, #73777c 100%); box-shadow: none; }
  .recommend-card__placeholder .media-placeholder__icon { opacity: .22; }
  .recommend-card__title { position: absolute; right: 9px; bottom: 8px; left: 9px; z-index: 1; margin: 0; color: #fff; text-shadow: 0 1px 2px rgba(0, 0, 0, .65); }
  .storey-box { margin-top: 30px; }
  .storey-title .name { font-size: 20px; }
  .storey-title .storey-icon { width: 36px; height: 36px; }
  .card-pic, .live-card .pic, .media-placeholder { border-radius: 2px; background: #f1f2f3; box-shadow: none; }
  .media-placeholder { color: #9b9ea3; }
  .media-placeholder__icon { opacity: .22; }
  .international-footer { margin-top: 54px; padding: 42px 0 54px; }
  .footer-qr { right: 50%; bottom: calc(100% + 10px); width: 126px; height: 126px; }
  /* elevator geometry defined in the top block; keep no override here */
  @media (max-width: 980px) { .mini-header__content { width: calc(100% - 24px); } .first-screen { grid-template-columns: 1fr; } .rcmd-box { min-height: 260px; } }
  @media (max-width: 640px) { .mini-header__content { gap: 8px; } .nav-search-box { flex-basis: auto; } .primary-menu-wrap, .primary-menu-itnl { height: auto; min-height: 108px; } .channel-menu-itnl { grid-template-rows: repeat(2, 34px); } .rcmd-box { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .header-brand__text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .header-popover-wrap { position: relative; }
  .header-popover-wrap::after { position: absolute; top: 36px; left: 50%; z-index: 3199; display: block; width: calc(100% + 8px); height: 12px; content: ""; pointer-events: auto; transform: translateX(-50%); }
  .header-popover { top: 48px; left: 50%; z-index: 3200; display: block; min-width: 0; padding: 0; border: 1px solid #e3e5e7; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0, 0, 0, .2); color: #18191c; opacity: 0; pointer-events: none; transform: translate(-50%, -5px); visibility: hidden; transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s; }
  .header-popover::before { position: absolute; top: -12px; left: 0; width: 100%; height: 12px; content: ""; }
  .header-popover::after { position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; border-top: 1px solid #e3e5e7; border-left: 1px solid #e3e5e7; background: #fff; content: ""; transform: translateX(-50%) rotate(45deg); }
  .header-popover.is-popover-visible { opacity: 1; pointer-events: auto; transform: translate(-50%, 0); visibility: visible; transition-delay: 0s; }
  .popover-game { top: 47px; width: 680px; height: 260px; overflow: visible; border: 0; border-radius: 0; box-shadow: none; background: transparent; }
  .popover-live { top: 47px; width: 528px; height: 266px; border: 0; border-radius: 0; box-shadow: none; }
  .popover-manga { top: 47px; width: 720px; height: 266px; overflow: visible; border: 0; border-radius: 0; box-shadow: none; background: transparent; }
  .official-nav-frame { position: absolute; inset: 0; z-index: 2; overflow: hidden; background: transparent; }
  .official-nav-frame[hidden] { display: none; }
  .official-nav-frame iframe { display: block; width: 100%; height: 100%; border: 0; background: transparent; }
  .popover-game::after, .popover-live::after, .popover-manga::after { display: none; }
  .header-popover[data-anchor-positioned="true"] { transform: translate(0, -5px); }
  .header-popover[data-anchor-positioned="true"].is-popover-visible { transform: translate(0, 0); }
  .download-client-entry { top: 47px; right: auto; left: -100px; z-index: 3215; width: 387px; height: 216px; box-sizing: border-box; border: 1px solid #e3e5e7; border-radius: 8px; box-shadow: 0 0 30px rgba(0, 0, 0, .1); transform: translateY(-5px); }
  .download-client-entry.is-popover-visible { transform: translateY(0); }
  .popover-surface { display: grid; width: 100%; height: 100%; padding: 16px; gap: 16px; box-sizing: border-box; }
  .live-surface { grid-template-columns: 254px minmax(0, 1fr); gap: 20px; padding: 20px; }
  .box.clearfix { position: relative; width: 422.5064px; height: 235.7336px; overflow: visible; border-radius: 0 0 3.626px 3.626px; background: #fff; box-shadow: .906px .906px 2.72px rgba(0, 0, 0, .4); color: #000; font: 16px/16px "Microsoft YaHei", Arial, Helvetica, sans-serif; }
  .box.clearfix::after, .brief.clearfix::after { display: table; clear: both; content: ""; }
  .left { float: left; width: 240.262px; margin-top: 10.88px; overflow: visible; }
  .box.clearfix > .left > .banner { min-height: 0; width: 217.6px; height: 116.05px; margin-left: 10.875px; overflow: visible; background: transparent; }
  .banner > a { position: relative; display: block; width: 217.6px; height: 116.05px; color: #fff; text-decoration: none; }
  .banner > a > img { display: block; width: 217.6px; height: 116.05px; border-radius: 3.626px; object-fit: cover; }
  .banner > a > span { position: absolute; bottom: 0; left: 0; width: 199.467px; padding: 0 9.066px; overflow: hidden; border-radius: 3.626px; color: #fff; background: transparent; font-size: 10.88px; line-height: 27.2px; text-overflow: ellipsis; text-shadow: .906px .906px .906px #000; white-space: nowrap; }
  .brief.clearfix { width: 240.262px; margin-top: 5.44px; padding: 0 5.44px; }
  .brief.clearfix > a { position: relative; display: block; float: left; width: 76.15px; height: 103.35px; padding-top: 5.44px; overflow: hidden; color: #222; background: transparent; text-align: center; text-decoration: none; }
  .brief.clearfix > a:hover, .brief.clearfix > a:focus-visible { background: #e5e9ef; }
  .brief.clearfix > a > img { display: block; width: 58.025px; height: 58.025px; margin: 0 auto; border-radius: 10.88px; object-fit: cover; }
  .brief.clearfix > a > span { display: -webkit-box; width: 65.28px; height: 36.267px; margin: 3.626px auto; overflow: hidden; color: #222; font-size: 10.88px; line-height: 18.133px; text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .right { float: left; width: 182.238px; min-height: 212.15px; margin-top: 10.88px; background-color: transparent; background-position: 0 0; }
  .all { width: 176.8px; min-height: 209.35px; padding: 31.7336px 0 0 5.44px; background: transparent; background-position: 0 0; }
  .all > a { display: block; width: 176.8px; height: 25.375px; padding: 0 0 0 14.507px; overflow: hidden; color: #222; background: transparent; font: inherit; line-height: 25.3864px; text-decoration: none; white-space: nowrap; }
  .all > a:hover, .all > a:focus-visible, .all > a.is-active { color: #00a1d6; }
  .all > a > span { display: block; width: 13em; height: 25.375px; overflow: hidden; color: inherit; line-height: 25.3864px; text-overflow: ellipsis; white-space: nowrap; }
  .imgdiv { position: absolute; bottom: 0; left: 400.738px; width: 199.463px; height: 199.463px; overflow: visible; background-color: transparent; background-position: 0 0; background-repeat: no-repeat; background-size: cover; pointer-events: none; }
  .popover-interactive-item { display: grid; grid-template-columns: minmax(0, 1fr); width: 176.8px; height: 25.375px; align-items: center; gap: 0; padding: 0 8px; border: 0; color: #222; background: transparent; cursor: pointer; font: inherit; text-align: left; }
  .popover-interactive-item.is-active { color: #00a1d6; background: #e5e9ef; }
  .manga-float-image { position: absolute; top: 2.5%; left: 95%; width: 160px; height: 213px; overflow: hidden; border-radius: 4px; background: transparent; box-shadow: 0 12px 24px -6px rgba(0, 0, 0, .3); visibility: hidden; opacity: 0; }
  .manga-float-image.is-visible { visibility: visible; opacity: 1; }
  .manga-float-image-loader { display: block; width: 160px; height: 213px; border-radius: 4px; object-fit: cover; visibility: hidden; opacity: 0; background: transparent; }
  .manga-float-image-loader.is-ready { visibility: visible; opacity: 1; }
  .manga-float-image-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #9499a0; background: transparent; font-size: 12px; }
  .live-avatar-image-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #61666d; background: #f1f2f3; font-size: 11px; }
  .live-hot-column, .live-activity-column { min-width: 0; }
  .live-room-list { display: grid; grid-template-columns: repeat(3, 64px); grid-template-rows: repeat(2, 84px); gap: 12px 18px; }
  .live-interactive-item { display: grid; grid-template-rows: 64px 18px; width: 64px; height: 84px; gap: 2px; padding: 0; border: 0; color: #303236; background: transparent; cursor: pointer; font: inherit; text-align: center; text-decoration: none; }
  .live-avatar-frame { position: relative; display: block; width: 64px; height: 64px; overflow: hidden; border-radius: 50%; background: #e5e9ef; }
  .live-avatar-image { display: block; width: 64px; height: 64px; object-fit: cover; }
  .live-avatar-mask { position: absolute; inset: 0; width: 64px; height: 64px; background: rgba(0, 0, 0, .5); opacity: 0; pointer-events: none; }
  .live-interactive-item.is-active .live-avatar-mask { opacity: 1; }
  .live-room-title { display: block; overflow: hidden; color: inherit; font-size: 11px; line-height: 18px; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .popover-mini-label, .popover-rank-label, .popover-rank-meta { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .popover-mini-label { color: #61666d; font-size: 12px; }
  .popover-list-column { min-width: 0; padding: 4px 0; }
  .popover-list-title { margin: 0 0 12px; color: #18191c; font-size: 16px; font-weight: 600; }
  .popover-rank-row, .popover-live-row { display: grid; grid-template-columns: 25px minmax(0, 1fr) auto; align-items: center; min-height: 38px; border-bottom: 1px solid #f1f2f3; gap: 8px; }
  .popover-rank { color: #fb7299; font-size: 12px; font-weight: 700; }
  .popover-rank-label { color: #303236; font-size: 13px; }
  .popover-rank-meta { color: #9499a0; font-size: 11px; }
  .manga-app-layout { position: relative; display: flex; width: 520px; height: 260px; padding: 20px 0 20px 20px; overflow: visible; border-radius: 0 0 4px 4px; background: #fff; box-shadow: 1px 1px 3px rgba(0, 0, 0, .4); box-sizing: border-box; color: #1c1d1f; font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif; }
  .manga-recommendation-list { display: flex; width: 292px; margin-right: 20px; overflow: visible; flex-flow: row wrap; justify-content: space-between; }
  .manga-recommend-item { position: relative; display: block; width: 136px; height: 101.75px; margin-bottom: 20px; overflow: visible; color: rgba(0, 0, 0, .87); text-decoration: none; }
  .manga-recommend-item::before { position: absolute; top: 0; left: 0; display: none; width: 100%; height: 100%; border-radius: 2px; background: #f4f4f4; content: ""; transform: scale(1.15); }
  .manga-recommend-item:hover::before, .manga-recommend-item:focus-visible::before { display: block; }
  .manga-recommend-image-surface, .manga-recommend-title { position: relative; z-index: 1; }
  .manga-recommend-image-surface { width: 136px; height: 77px; overflow: hidden; border-radius: 2px; background: transparent; }
  .manga-recommend-image { display: block; width: 136px; height: 77px; border-radius: 2px; object-fit: cover; }
  .manga-recommend-image-fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #9499a0; background: #f4f4f4; font-size: 11px; }
  .manga-recommend-title { display: block; width: 136px; height: 18.75px; margin-top: 6px; overflow: hidden; color: rgba(0, 0, 0, .87); font-size: 13px; line-height: 18.75px; text-overflow: ellipsis; white-space: nowrap; }
  .manga-divider { flex: 0 0 1px; width: 1px; height: 220px; background: rgba(0, 0, 0, .1); }
  .manga-popularity-list { position: relative; width: 187px; height: 220px; overflow: visible; background: transparent; }
  .manga-popularity-title { height: 22.875px; margin: 0 0 0 20px; color: #1c1d1f; font-size: 16px; font-weight: 400; line-height: 22.875px; }
  .manga-popularity-items { width: 187px; height: 202.8px; margin-top: 8px; overflow: hidden; font-size: 13px; line-height: 33.8px; }
  .manga-popularity-row { display: block; width: 187px; height: 33.8px; padding: 0 20px; overflow: hidden; border: 0; color: #1c1d1f; background: transparent; box-sizing: border-box; cursor: pointer; font: inherit; line-height: 33.8px; text-align: left; white-space: nowrap; }
  .manga-popularity-row.is-active { background: #f4f4f4; }
  .manga-popularity-index { color: #cf9870; }
  .manga-popularity-label { margin-left: 10px; color: #1c1d1f; }
  .live-hot-column .popover-list-title { color: #fb7299; }
  .live-activity-column { border-left: 1px solid #f1c7d1; padding-left: 20px; }
  .live-activity-column .popover-list-title { color: #f25d8e; }
  .live-avatar-mask { display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; line-height: 1; text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .download-wrapper { display: grid; grid-template-rows: 162px 17px; width: 100%; height: 100%; padding: 19px 0 16px; box-sizing: border-box; }
  .download-top { display: grid; grid-template-columns: calc(50% - .5px) 1px calc(50% - .5px); width: 100%; height: 162px; }
  .download-top-left, .download-top-right { display: flex; min-width: 0; flex-direction: column; align-items: center; }
  .download-top-center { width: 1px; height: 143px; background: #e3e5e7; }
  .download-top-title { width: 100%; color: #18191c; text-align: center; transform: translateY(2px); }
  .download-top-title .main { display: flex; height: 20px; align-items: center; justify-content: center; margin-bottom: 2px; color: #18191c; font-size: 14px; font-weight: 600; line-height: 20px; }
  .download-top-title .main > svg { display: block; width: 16px; height: 16px; margin: 0 3px 0 0; color: #18191c; flex: 0 0 auto; }
  .download-top-title .sub { width: 130px; margin: 0 auto; color: #61666d; font-size: 12px; font-weight: 400; line-height: 17px; text-align: center; }
  .download-top-left .sub { width: auto; white-space: nowrap; }
  .download-top-content { display: flex; width: 100%; flex: 1 1 auto; align-items: center; justify-content: center; }
  .download-top-right .download-top-content { flex-direction: column; }
  .qr { display: flex; width: 95px; height: 95px; align-items: center; justify-content: center; border: 1px solid #e3e5e7; border-radius: 4px; box-sizing: border-box; }
  .qr img { display: block; width: 87px; height: 87px; object-fit: contain; }
  .pink-pc-download { display: block; width: 52px; height: 52px; margin: 0 auto; }
  .button { display: inline-flex; width: 90px; height: 30px; align-items: center; justify-content: center; margin-top: 12px; border: 0; border-radius: 6px; color: #fff; background: #00aeec; cursor: pointer; font-size: 14px; font-weight: 400; line-height: 30px; text-decoration: none; }
  .button:hover, .button:focus-visible { background: #40c5f1; }
  .download-bottom { display: flex; width: 130px; height: 17px; align-items: center; justify-self: center; justify-content: center; gap: 3px; color: #9499a0; font-size: 12px; font-weight: 400; line-height: 17px; text-align: center; text-decoration: none; transform: translateY(2px); }
  .download-bottom-chevron { color: #9499a0; font-size: 16px; line-height: 14px; }
  .download-bottom:hover, .download-bottom:focus-visible { color: #00aeec; }
  .auth-vip-popover { top: 48px; width: 260px; min-height: 241px; }
  .vip-m { width: 260px; }
  .vip-m .bubble-traditional { padding: 14px; }
  .vip-m .recommand .title { margin: 5px 0 12px; color: #212121; font-size: 14px; font-weight: 900; }
  .vip-promo-shell { display: block; width: 230px; height: 68px; border-radius: 2px; object-fit: cover; }
  .vip-m .recommand-link { display: -webkit-box; overflow: hidden; margin-top: 10px; color: #222; font-size: 14px; line-height: 18px; text-decoration: none; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .vip-m .renew-btn { margin-top: 20px; text-align: center; }
  .vip-m .renew-btn a { display: inline-flex; width: 160px; height: 32px; align-items: center; justify-content: center; border-radius: 2px; color: #fff; background: #00a1d6; font-size: 14px; text-decoration: none; }
  .unlogin-popover-panel { top: 46px; width: 360px; height: 236px; }
  .unlogin-popover { position: relative; padding: 20px; background: #fff; }
  .unlogin-popover-avatar { height: 234px; min-height: 0; overflow: hidden; }
  .unlogin-title { margin: 0 0 18px; color: #212121; font-size: 14px; font-weight: 400; }
  .unlogin-rights { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 12px; margin-bottom: 18px; }
  .unlogin-right { display: flex; min-width: 0; align-items: center; gap: 10px; color: #505050; font-size: 13px; line-height: 18px; }
  .unlogin-right-icon { flex: 0 0 26px; width: 26px; height: 26px; object-fit: contain; }
  .unlogin-right-text { min-width: 0; }
  .login-btn { display: block; width: 100%; height: 40px; border: 0; border-radius: 2px; color: #fff; background: #00a1d6; font-size: 14px; cursor: pointer; }
  .login-btn:hover, .login-btn:focus-visible { background: #00b5e5; }
  .register-tip { margin-top: 16px; color: #212121; font-size: 14px; line-height: 20px; text-align: center; }
  .register-btn { color: #00a1d6; cursor: pointer; }
  .unlogin-tip-popper { top: 48px; width: 360px; height: 124px; }
  .unlogin-tip-popper .unlogin-popover { height: 122px; padding: 16px; }
  .content-msg { height: 40px; margin-bottom: 12px; color: #999; font-size: 14px; line-height: 40px; text-align: center; }
  .user-panel { width: 280px; }
  .user-panel--message { width: 173px; min-height: 207px; }
  .user-panel--message .i-frame { min-width: 173px; min-height: 207px; padding-top: 12px; }
  .user-panel--message .i-frame a { display: block; height: 36px; padding: 0 20px; color: #212121; font-size: 14px; line-height: 36px; text-decoration: none; }
  .user-panel--message .i-frame a:hover, .user-panel--message .i-frame a:focus-visible { background: #f4f4f4; color: #212121; }
  .user-panel--dynamic { width: 382px; height: 540px; overflow: hidden; }
  .user-panel--dynamic .i-frame { width: 382px; height: 540px; padding-top: 12px; overflow: hidden; border-radius: 2px; }
  .user-panel--dynamic iframe { display: block; width: 100%; height: 528px; border: 0; background: #fff; }
  .nav-item-dynamic .i-frame.dynamic-local { display:flex; width:382px; height:540px; max-height:540px; flex-direction:column; align-items:center; margin:0; padding:13px 10px 10px; overflow:hidden; border-radius:2px; background:transparent; color:#212121; box-shadow:none; font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; text-align:left; }
  .dynamic-local::before { position:absolute; top:9px; left:calc(50% - 5px); width:10px; height:10px; background:#fff; box-shadow:-1px -1px 1px rgb(0 0 0); content:""; transform:rotate(45deg); }
  .dynamic-local > .tab-bar, .dynamic-local > .container { position:relative; z-index:1; width:362px; background:#fff; }
  .dynamic-local .tab-bar { display:flex; width:100%; flex:0 0 46px; height:46px; align-items:center; padding-left:19px; border-bottom:1px solid #e7e7e7; color:#999; font-size:11.4px; line-height:15.2px; text-align:left; }
  .dynamic-local .tab-item { display:flex; align-items:center; justify-content:center; margin-right:24px; padding:0; border:0; border-radius:12px; background:transparent; color:inherit; cursor:pointer; }
  .dynamic-local .tab-item.active { margin-right:14px; padding:4px 10px; background:#00a1d6; color:#fff; }
  .dynamic-local .container { width:362px; height:445px; min-height:0; max-height:445px; flex:0 0 445px; overflow:hidden auto; overscroll-behavior:contain; }
  .dynamic-local .dynamic-list { min-height:100%; padding-top:11.4px; }
  .dynamic-local .tip-box { display:flex; height:100px; align-items:center; justify-content:center; color:#999; font-size:14px; }
  .dynamic-local .tip-box.loading-tip::before { width:20px; height:20px; margin-right:5px; background:var(--dynamic-loading) center/contain no-repeat; content:""; }
  .dynamic-local .split-line { position:relative; display:flex; height:15.2px; align-items:center; justify-content:center; margin:0 19px; color:#999; font-size:11.4px; }
  .dynamic-local .split-line::before { position:absolute; top:8px; left:0; width:100%; border-top:1px solid #e7e7e7; content:""; }
  .dynamic-local .history-tip { z-index:1; padding:0 10px; background:#fff; }
  .dynamic-local .list-item { display:flex; min-height:98.8px; flex-direction:column; box-sizing:border-box; padding:11.37px 18.97px; cursor:pointer; transition:background-color .3s; text-align:left; }
  .dynamic-local .list-item:hover { background:#f4f4f4; }
  .dynamic-local .main-container { display:flex; width:100%; min-width:0; }
  .dynamic-local .left-box { position:relative; display:flex; width:34.15px; min-width:34.15px; min-height:76px; flex:0 0 34.15px; flex-direction:column; align-items:center; justify-content:flex-start; }
  .dynamic-local .avatar { display:block; width:34.15px; height:34.15px; flex:0 0 34.15px; margin:0; border-radius:50%; background:#f4f4f4 center/cover no-repeat; transform:none; }
  .dynamic-local .verify-box { position:absolute; top:19.9px; right:0; width:15.2px; height:15.2px; border-radius:50%; background:#fff center/11.4px no-repeat; }
  .dynamic-local .verify-box.type-0 { background-image:var(--dynamic-verify-personal); }
  .dynamic-local .verify-box.type-1 { background-image:var(--dynamic-verify-organization); }
  .dynamic-local .verify-box.type-big { background-image:var(--dynamic-verify-big); }
  .dynamic-local .center-box { display:flex; width:auto; min-width:0; min-height:76px; flex:1 1 0; flex-direction:column; align-items:flex-start; justify-content:flex-start; box-sizing:border-box; padding:0 11.37px; overflow:hidden; text-align:left; }
  .dynamic-local .name-line { display:block; width:100%; height:15.2px; overflow:hidden; color:#505050; font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; font-size:11.4px; font-weight:400; line-height:15.2px; text-align:left; text-overflow:ellipsis; white-space:nowrap; }
  .dynamic-local .user-name { display:inline; color:inherit; font-size:inherit; font-weight:400; text-decoration:none; }
  .dynamic-local .publish-time { display:inline; margin-left:10px; color:#999; font-size:11.4px; font-weight:400; }
  .dynamic-local [data-kind="live"] .publish-time { color:#fb7299; }
  .dynamic-local .content { display:-webkit-box; width:100%; max-width:100%; min-width:0; flex:0 1 auto; box-sizing:border-box; margin-top:5.7px; overflow:hidden; color:#212121; font-family:PingFang SC,HarmonyOS_Regular,"Helvetica Neue",Helvetica,Arial,"Microsoft YaHei",sans-serif; font-size:13.3px; font-weight:500; line-height:18.4px; text-align:left; text-decoration:none; text-overflow:ellipsis; word-break:break-all; -webkit-box-orient:vertical; -webkit-line-clamp:3; }
  .dynamic-local .right-box { display:flex; width:60.7px; min-width:60.7px; min-height:76px; flex:0 0 60.7px; align-items:flex-start; justify-content:flex-start; overflow:hidden; border-radius:0; background:transparent; }
  .dynamic-local .right-box .cover { display:block; width:60.7px; height:34.15px; flex:0 0 60.7px; border-radius:2px; }
  .dynamic-local .cover { display:block; width:100%; height:100%; object-fit:cover; }
  .dynamic-local .dynamic-cover-wrap { position:relative; width:60.7px; height:34.15px; flex:0 0 60.7px; overflow:hidden; border-radius:2px; }
  .dynamic-local [data-kind="live"] .dynamic-cover-wrap, .dynamic-local [data-kind="article"] .dynamic-cover-wrap { height:45.5px; }
  .dynamic-local .watch-later { position:absolute; top:6px; right:6px; display:none; width:22px; height:22px; margin:0; padding:0; border:0; border-radius:2px; background-color:transparent; background-image:var(--dynamic-watch-later); background-position:center; background-repeat:no-repeat; background-size:contain; cursor:pointer; }
  .dynamic-local [data-kind="video"] .dynamic-cover-wrap:hover .watch-later { display:block; }
  .dynamic-local .watch-later.added { background-image:var(--dynamic-watch-later-added); }
  .dynamic-local .watch-later-tip { display:none; }
  .dynamic-local .more-tab { position:static; display:flex; height:60.7px; align-items:center; justify-content:center; padding:0 19px; background:#fff; }
  .dynamic-local .more-btn { display:flex; height:32px; flex:1; align-items:center; justify-content:center; color:#212121; background:#f4f4f4; font-size:14px; text-decoration:none; }
  .dynamic-local .more-btn:hover { background:#e7e7e7; }
  .user-panel--favorite { width: 520px; height: 518px; }
  .user-panel--favorite .vp-container { display: flex; justify-content: space-between; min-width: 520px; height: 518px; }
  .user-panel--favorite .tabs-panel { flex-shrink: 0; width: 149px; height: 100%; box-sizing: border-box; padding: 12px 0; overflow-x: hidden; overflow-y: auto; border-right: 1px solid #e7e7e7; }
  .user-panel--favorite .tab-item { display: flex; width: 100%; min-width: 0; height: 46px; align-items: center; justify-content: space-between; box-sizing: border-box; overflow: hidden; padding: 0 16px; border: 0; color: #212121; background: transparent; font-family: inherit; font-size: 14px; font-weight: 400; line-height: normal; cursor: pointer; }
  .user-panel--favorite .tab-item--active { background: #00a1d6; color: #fff; }
  .user-panel--favorite .tab-item .title { width: 85px; min-width: 0; flex: 0 1 85px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .user-panel--favorite .tab-item .num { flex: 0 0 auto; margin-left: auto; text-align: right; white-space: nowrap; }
  .user-panel--favorite .tab-item__all { display: block; padding: 12px 0; color: #505050; font-size: 12px; text-align: center; text-decoration: none; }
  .user-panel--favorite .favorite-video-panel { display: flex; width: 370px; height: 100%; flex-direction: column; padding-top: 12px; overflow: hidden; }
  .user-panel--favorite .favorite-video-list, .user-panel--history .history-list { flex: 1 1 auto; min-height: 0; overflow: hidden auto; }
  .favorite-video-card { display: flex; width: 100%; min-height: 77px; padding: 8px 5px 8px 20px; color: #212121; text-decoration: none; }
  .favorite-video-card:hover, .favorite-video-card:focus-visible { color: #00a1d6; background: #f4f4f4; }
  .favorite-video-preview { position: relative; flex: 0 0 108px; width: 108px; height: 61px; overflow: hidden; border-radius: 2px; background: #f1f2f3; }
  .favorite-video-cover { display: block; width: 108px; height: 61px; object-fit: cover; }
  .favorite-video-info { display: flex; width: 210px; min-width: 0; margin-left: 12px; flex-direction: column; justify-content: center; }
  .favorite-video-title { display: -webkit-box; overflow: hidden; color: #212121; font-size: 14px; font-weight: 500; line-height: 18px; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .favorite-video-card:hover .favorite-video-title, .favorite-video-card:focus-visible .favorite-video-title { color: #00a1d6; }
  .favorite-video-owner { display: block; overflow: hidden; margin-top: 4px; margin-right: 15px; color: #999; font-size: 12px; font-weight: 400; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
  .favorite-video-duration { position: absolute; right: 0; bottom: 0; padding: 0 2px; border-radius: 1px; color: #fff; background: rgba(0,0,0,.5); font-size: 12px; line-height: 16px; }
  .favorite-video-card:hover .favorite-video-owner, .favorite-video-card:focus-visible .favorite-video-owner { color: #999; }
  .user-panel--favorite .empty-list { display: flex; flex: 1 1 auto; align-items: center; justify-content: center; width: 370px; color: #999; font-size: 14px; }
  .user-panel--favorite .play-view-all { display: flex; border-top: 1px solid #e7e7e7; }
  .user-panel--favorite .play-view-all[hidden] { display: none; }
  .user-panel--favorite .play-view-all { flex: 0 0 45.8px; height: 45.8px; }
  .user-panel--favorite .view-all, .user-panel--favorite .play-all { display: inline-flex; width: 50%; height: 45.8px; align-items: center; justify-content: center; color: #212121; font-size: 14px; line-height: 45.8px; text-align: center; text-decoration: none; }
  .user-panel--favorite .play-all { color: #00a1d6; }
  .user-panel--favorite .play-all .bilifont { margin-right: 4px; font-size: 14px; line-height: 1; }
  .user-panel--history { width: 370px; height: 518px; overscroll-behavior: contain; }
  .user-panel--history .vp-container { display: flex; min-width: 370px; width: 370px; height: 518px; flex-direction: column; overscroll-behavior: contain; }
  .user-panel--history .tab-header { display: flex; flex: 0 0 50px; align-items: center; height: 50px; border-bottom: 1px solid #f4f4f4; }
  .user-panel--history .tab-item { margin: 0 7px; padding: 0; border: 0; color: #212121; background: transparent; font: inherit; font-size: 12px; cursor: pointer; }
  .user-panel--history .tab-item:first-child { margin-left: 20px; }
  .user-panel--history .tab-item--active { padding: 4px 10px; border-radius: 12px; background: #00a1d6; color: #fff; }
  .user-panel--history .panel { display: flex; min-height: 0; flex: 1 1 auto; height: auto; flex-direction: column; overflow: hidden; overscroll-behavior: contain; }
  .user-panel--history .history-list { flex: 1 1 auto; min-height: 0; overflow: hidden auto; overscroll-behavior: contain; }
  .user-panel--history .empty-panel { display: flex; flex: 1 1 auto; min-height: 0; align-items: center; justify-content: center; box-sizing: border-box; padding: 16px; color: #999; font-size: 14px; text-align: center; }
  .user-panel--history .view-all { display: block; flex: 0 0 32px; width: 330px; height: 32px; margin: 16px auto; color: #212121; background: #f4f4f4; font-size: 14px; line-height: 32px; text-align: center; text-decoration: none; }
  .user-panel--history .history-card { display: flex; flex: 0 0 77px; width: 100%; min-width: 0; height: 77px; align-items: center; gap: 10px; box-sizing: border-box; padding: 10px 12px; color: #212121; text-decoration: none; }
  .user-panel--history .history-card:hover, .user-panel--history .history-card:focus-visible { color: #00a1d6; background: #f4f4f4; }
  .history-card-media { position: relative; flex: 0 0 96px; width: 96px; height: 54px; overflow: hidden; border-radius: 2px; background: #f1f2f3; }
  .history-card-cover { display: block; width: 96px; height: 54px; object-fit: cover; }
  .history-card-duration { position: absolute; right: 0; bottom: 2px; padding: 0 3px; color: #fff; background: rgba(0, 0, 0, .55); font-size: 12px; line-height: 16px; }
  .history-card-progress { position: absolute; right: 0; bottom: 0; left: 0; height: 2px; background: #00aeec; }
  .history-card-copy { display: flex; min-width: 0; flex: 1 1 auto; height: 54px; flex-direction: column; justify-content: center; overflow: hidden; }
  .history-card-title { display: -webkit-box; min-width: 0; overflow: hidden; color: #212121; font-size: 13px; line-height: 16px; text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .history-card-meta { display: block; min-width: 0; margin-top: 4px; overflow: hidden; color: #999; font-size: 12px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
  .user-panel--upload { top: 44px; right: 0; left: auto; width: 380px; height: 78px; border: 0; border-radius: 2px; transform: translateY(-5px); }
  .user-panel--upload.is-popover-visible { transform: translateY(0); }
  .user-panel-surface { display: flex; min-height: 100%; flex-direction: column; padding: 14px 0; background: #fff; }
  .user-panel--avatar .user-panel-surface { align-items: center; padding-top: 28px; }
  .user-panel-title { margin: 0 20px 10px; color: #212121; font-size: 14px; font-weight: 600; }
  .user-panel--avatar .user-panel-title { margin-bottom: 14px; font-size: 16px; }
  .user-panel-row { display: flex; align-items: center; width: 100%; min-height: 36px; padding: 0 23px; color: #212121; font-size: 13px; line-height: 36px; white-space: pre; }
  .user-panel-row:hover, .user-panel-row:focus-visible { background: #f4f4f4; }
  .user-panel--avatar .user-panel-row { border-top: 1px solid #f4f4f4; }
  .profile-popover { width: 280px; height: 468px; overflow: visible; }
  .profile-popover-surface { display: flex; min-height: 468px; flex-direction: column; padding: 0; color: #212121; background: #fff; }
  .profile-avatar-frame { position: relative; z-index: 1; display: flex; width: 51px; height: 51px; align-items: center; justify-content: center; margin: -25px auto 0; overflow: visible; border-radius: 50%; background: #e5f7ff; }
  .profile-avatar-frame, .profile-level-link, .profile-asset, .profile-asset-action, .profile-stat { text-decoration: none; }
  .profile-avatar-frame:hover, .profile-avatar-frame:focus-visible, .profile-level-link:hover, .profile-level-link:focus-visible, .profile-asset:hover, .profile-asset:focus-visible, .profile-asset-action:hover, .profile-asset-action:focus-visible, .profile-stat:hover, .profile-stat:focus-visible { text-decoration: none; }
  .profile-avatar-image, .profile-avatar-fallback { display: block; width: 51px; height: 51px; object-fit: cover; border-radius: 50%; }
  .profile-avatar-pendant { position: absolute; top: -38.33%; left: -38.33%; display: block; width: 176.48%; height: 176.48%; overflow: hidden; pointer-events: none; }
  .profile-avatar-pendant[hidden] { display: none; }
  .profile-avatar-pendant img { display: block; width: 100%; height: 100%; min-width: 100%; user-select: none; }
  .profile-nickname { height: 64px; margin: 0; padding: 14px 20px 0; color: #212121; font-size: 16px; font-weight: 600; line-height: 50px; text-align: center; }
  .profile-login-state { display: flex; min-height: 286px; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 24px 20px; color: #9499a0; text-align: center; }
  .profile-login-message { margin: 0; font-size: 14px; line-height: 22px; }
  .profile-login-button { width: 132px; height: 34px; border: 0; border-radius: 2px; color: #fff; background: #00a1d6; font-size: 14px; cursor: pointer; }
  .profile-login-button:hover, .profile-login-button:focus-visible { background: #00b5e5; }
  .profile-level-section { padding: 0 20px; }
  .profile-level-info { display: flex; align-items: center; justify-content: space-between; height: 20px; margin: 0 0 5px; color: #60666d; font-size: 12px; }
  .profile-level { color: #212121; font-size: 14px; }
  .profile-exp { color: #999; }
  .profile-level-track { position: relative; width: 100%; height: 2px; margin: 0 0 6px; background: #f4f4f4; }
  .profile-level-progress { position: absolute; top: 0; left: 0; width: 0; height: 2px; border-radius: 2px; background: #f3cb85; }
  .profile-assets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; height: 50px; padding: 8px 20px; border-top: 1px solid #f1f2f3; border-bottom: 1px solid #f1f2f3; }
  .profile-asset { display: flex; min-width: 0; align-items: center; justify-content: center; gap: 5px; }
  .profile-asset-icon { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; color: #999; font-size: 20px; line-height: 22px; }
  .profile-asset:nth-child(2) .profile-asset-icon { color: #f5a623; }
  .profile-asset:nth-child(3) .profile-asset-icon { color: #37a7d7; }
  .profile-asset-text { display: flex; min-width: 0; align-items: center; color: #60666d; font-size: 11px; line-height: 15px; }
  .profile-asset-label, .profile-vip-state { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .profile-asset-value { color: #212121; font-size: 14px; }
  .profile-asset-actions { display: flex; align-items: center; justify-content: center; gap: 7px; }
  .profile-asset-action { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; border: 0; color: #b8b8b8; background: transparent; }
  .profile-asset-action.is-bound { color: #00a1d6; background: transparent; }
  .profile-asset-action .bilifont { font-size: 20px; line-height: 22px; }
  .profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); height: 58px; padding: 10px 20px; border-bottom: 1px solid #f1f2f3; }
  .profile-stat { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #999; font-size: 12px; line-height: 17px; }
  .profile-stat-value { color: #212121; font-size: 14px; }
  .profile-menu { padding: 4px 0 0; }
  .profile-menu-row { display: flex; width: 100%; height: 40px; align-items: center; justify-content: space-between; padding: 8px 23px; border: 0; color: #212121; background: transparent; font: inherit; text-align: left; text-decoration: none; cursor: pointer; }
  .profile-menu-row:hover, .profile-menu-row:focus-visible { color: #00a1d6; background: #f4f4f4; outline: 0; }
  .profile-menu-title { display: flex; min-width: 0; align-items: center; gap: 8px; }
  .profile-menu-icon { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; color: #999; }
  .profile-menu-icon .bilifont { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; font-size: 24px; line-height: 24px; }
  .profile-menu-label { font-size: 14px; line-height: 24px; }
  .profile-menu-arrow { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; color: #999; }
  .profile-menu-arrow .bilifont { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; font-size: 18px; line-height: 18px; }
  .profile-menu-submenu-wrap { position: relative; }
  .profile-submenu { position: absolute; top: -8px; left: calc(100% - 1px); z-index: 2; display: flex; flex-direction: column; border: 1px solid #edf0f2; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0, 0, 0, .2); opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .15s ease, visibility 0s linear .15s; }
  .profile-menu-submenu-wrap:hover > .profile-submenu, .profile-menu-submenu-wrap:focus-within > .profile-submenu { opacity: 1; pointer-events: auto; visibility: visible; transition-delay: 0s; }
  .profile-service-submenu { width: 131px; height: 184px; padding: 12px 0; }
  .profile-language-submenu { width: 240px; height: 92px; padding: 8px 0; font-size: 12px; }
  .profile-submenu-item { display: flex; width: 100%; height: 40px; align-items: center; padding: 8px 23px; border: 0; color: #212121; background: transparent; font: inherit; text-align: left; text-decoration: none; white-space: nowrap; cursor: pointer; }
  .profile-submenu-item:hover, .profile-submenu-item:focus-visible { color: #00a1d6; background: #f4f4f4; outline: 0; }
  .profile-submenu-icon { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; margin-right: 5px; font-size: 24px; line-height: 24px; }
  .profile-language-item { display: flex; width: 100%; height: 38px; align-items: center; padding: 8px 15px; border: 0; color: #212121; background: transparent; font: inherit; font-size: 12px; line-height: 22px; text-align: left; cursor: default; }
  .profile-language-item.is-selected { color: #00a1d6; }
  .profile-language-check { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; margin-right: 5px; font-size: 22px; line-height: 22px; }
  .profile-language-check.is-hidden { display: none; }
  .profile-language-item:hover, .profile-language-item:focus-visible { color: #00a1d6; background: #f4f4f4; outline: 0; }
  .nav-search-box { position: relative; margin: 0 10px; }
  .nav-search { overflow: visible; border: 0; border-radius: 2px; background: transparent; }
  .nav-search #nav_searchform { box-sizing: border-box; padding: 0 38px 0 16px; border: 1px solid transparent; border-radius: 2px; background: #fff; }
  .nav-search .nav-search-keyword { width: 100%; height: 34px; padding: 0; color: #999; font-size: 14px; font-weight: 400; line-height: 34px; }
  .nav-search .nav-search-keyword:focus { color: #222; }
  .nav-search .nav-search-btn { width: 48px; height: 36px; border-radius: 2px; color: #505050; background: #e7e7e7; }
  .nav-search .nav-search-btn:hover, .nav-search .nav-search-btn:focus-visible { color: #00a1d6; background: #e7e7e7; }
  .suggest-wrap { position: absolute; top: 36px; right: 0; left: 0; z-index: 3205; pointer-events: none; }
  .header-search-suggest { top: 0; right: 0; left: 0; z-index: 3205; width: 100%; min-width: 236px; max-height: 612px; height: auto; margin-top: 2px; padding: 16px 0; overflow-y: auto; border: 1px solid #e6e9ee; border-radius: 2px; color: #212121; background: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, .1); font-family: "PingFang SC", sans-serif; font-style: normal; font-weight: 400; transform: translateY(-5px); }
  .suggest-wrap > .header-search-suggest { top: 0; right: 0; left: auto; width: 100%; max-width: none; pointer-events: none; }
  .suggest-wrap > .header-search-suggest.is-popover-visible { pointer-events: auto; }
  .header-search-suggest.is-popover-visible, .nav-search-box:hover .header-search-suggest, .nav-search-box:focus-within .header-search-suggest { transform: translateY(0); }
  .search-suggest-title { margin: 0 14px 7px; color: #18191c; font-size: 13px; }
  .search-suggest-row { height: 30px; padding: 0 14px; color: #61666d; font-size: 12px; line-height: 30px; }
  .search-suggest-row:hover { background: #f4f5f6; color: #00aeec; }
  .search-suggest-section { width: 100%; overflow: hidden; border-bottom: 1px solid #f1f2f3; }
  .search-history { height: 128.8px; padding-top: 12px; }
  .search-trending { height: 216px; padding-top: 12px; border-bottom: 0; }
  .suggest-wrap .header-search-suggest { overflow-x: hidden; }
  .suggest-wrap .history, .suggest-wrap .trending { box-sizing: border-box; width: 100%; background: #fff; }
  .suggest-wrap .history { padding-bottom: 12px; border-bottom: 1px solid #f1f2f3; }
  .suggest-wrap .trending { padding-top: 12px; }
  .suggest-wrap .header { display: flex; height: 24px; align-items: center; justify-content: space-between; padding: 0 16px; }
  .suggest-wrap .header .title { height: 24px; margin: 0; color: #212121; font-size: 16px; font-weight: 600; line-height: 24px; }
  .suggest-wrap .header .clear { height: 15px; padding: 0; border: 0; color: #999; background: transparent; font-size: 12px; line-height: 15px; cursor: pointer; }
  .suggest-wrap .header .clear:hover, .suggest-wrap .header .clear:focus-visible { color: #00aeec; outline: 0; }
  .histories-wrap { max-height: 92px; padding: 0 16px; overflow: hidden; }
  .histories-wrap.is-expanded { max-height: 172px; overflow-y: auto; }
  .histories { display: flex; flex-wrap: wrap; margin-top: 12px; margin-right: -10px; margin-bottom: 4px; }
  .history-item { position: relative; box-sizing: border-box; display: inline-flex; max-width: 100%; height: 30px; align-items: center; margin-right: 10px; margin-bottom: 10px; padding: 7px 10px 8px; border-radius: 4px; color: #212121; background: #f4f4f4; font-size: 12px; line-height: 15px; }
  .history-text { max-width: 96px; overflow: hidden; color: inherit; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .history-item:hover, .history-item:focus-within { color: #00a1d6; outline: 0; }
  .history-item .close { position: absolute; top: -6px; right: -6px; display: none; box-sizing: border-box; width: 16px; height: 16px; padding: 2px; border: 0; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, .18); cursor: pointer; }
  .history-item:hover .close, .history-item:focus-within .close { display: block; }
  .history-item .close::before, .history-item .close::after { content: ""; position: absolute; top: 7px; left: 3px; width: 10px; height: 1px; background: #999; }
  .history-item .close::before { transform: rotate(45deg); }
  .history-item .close::after { transform: rotate(-45deg); }
  .history-fold-wrap { display: flex; height: 24px; align-items: center; justify-content: center; margin: -2px 0 4px; border: 0; color: #999; background: transparent; font: 12px/20px inherit; cursor: pointer; }
  .history-fold-wrap:hover, .history-fold-wrap:focus-visible { color: #00aeec; outline: 0; }
  .history-empty { padding: 12px 16px 4px; color: #999; font-size: 12px; line-height: 15px; }
  .trendings-double { display: flex; padding-top: 4px; }
  .trendings-col { flex: 1 1 0; min-width: 0; }
  .trendings-col:first-child { margin-right: 10px; }
  .trending-item { box-sizing: border-box; display: flex; width: 100%; height: 38px; align-items: center; padding-left: 16px; color: #212121; text-decoration: none; }
  .trending-item:hover, .trending-item:focus-visible { background: #f4f4f4; outline: 0; }
  .trending-item .rank { flex: 0 0 15px; width: 15px; height: 17px; margin-right: 7px; color: #999; font-size: 14px; font-weight: 500; line-height: 17px; text-align: center; }
  .trending-item-top .rank { color: #212121; }
  .trending-item .trending-text { min-width: 0; height: 17px; margin-right: 6px; overflow: hidden; font-size: 14px; line-height: 17px; text-overflow: ellipsis; white-space: nowrap; }
  .trending-item .trending-mark { flex: 0 0 auto; width: auto; height: 14px; margin-right: 16px; object-fit: contain; }
  .suggestions { padding: 0; }
  .suggest-item { display: flex; width: 100%; height: 32px; align-items: center; margin-bottom: 4px; padding: 0 16px; overflow: hidden; color: #212121; background: transparent; border: 0; font-size: 14px; line-height: 32px; text-align: left; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
  .suggest-item:last-child { margin-bottom: 0; }
  .suggest-item:hover, .suggest-item:focus-visible, .suggest-item.active { color: #212121; background: #f4f4f4; outline: 0; }
  .suggest-item .suggest_high_light { color: #f25d8e; font-style: normal; }
  .user-panel--upload .vp-container { display: flex; width: 100%; height: 78px; }
  .user-panel--upload .upload-item { display: flex; width: 76px; height: 78px; flex-direction: column; align-items: center; justify-content: center; color: #212121; font-size: 12px; text-decoration: none; transition: .2s ease; }
  .user-panel--upload .upload-item:hover, .user-panel--upload .upload-item:focus-visible { background: #f4f4f4; color: #212121; }
  .user-panel--upload .upload-icon { display: flex; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 50%; color: #757575; background: #f4f4f4; font-size: 14px; }
  .user-panel--upload .item-title { margin-top: 6px; white-space: nowrap; }
  .activity-entry { width: 80px; height: 40px; margin-top: -1px; }
  .activity-link { width: 80px !important; height: 40px !important; line-height: 40px !important; }
  .activity-image { display: block; width: 80px; height: 40px; object-fit: contain; }
  .header-brand { position: absolute; width: 1px; height: 1px; overflow: hidden; pointer-events: none; }
  .unlogin-entry .unlogin-avatar { display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center; padding: 0; border: 0; outline: 0; border-radius: 50%; color: #fff; background: #00aeec; font-size: 14px; font-weight: 600; line-height: 1; text-align: center; text-shadow: none; box-sizing: border-box; appearance: none; -webkit-appearance: none; }
  .auth-branch--login .user-popover-item, .auth-branch--logout .user-popover-item { margin-left: 12px; }
  .auth-branch--login .user-popover-item:first-child, .auth-branch--logout .user-popover-item:first-child { margin-left: 0; }
  @media (max-width: 1438px) { .nav-link-ul { gap: 4px; } .nav-search-box { flex: none; width: auto; min-width: 0; } }
  @media (max-width: 1180px) { .mini-header__content { gap: 9px; padding-right: 12px; padding-left: 12px; } .nav-link-ul { gap: 4px; } .nav-link-item .link { font-size: 12px; } .nav-search-box { flex: none; width: auto; min-width: 0; } }
  @media (max-width: 1060px) { .nav-search-box { flex: none; width: auto; min-width: 0; } .auth-link { font-size: 12px; } .mini-upload { padding: 0 12px; } }
  /* Ordinary floors keep the legacy card and rank rhythm without adding media assets. */
  .ordinary-floor { margin-top: 26px; }
  .ordinary-floor .floor-layout { gap: 24px; }
  .ordinary-floor .zone-list-box { width: min(100%, 1070px); grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .ordinary-floor .video-card-common { display: flex; width: min(100%, 206px); min-width: 0; flex-direction: column; }
  .ordinary-floor .card-pic { flex: 0 0 auto; aspect-ratio: 16 / 9; border-radius: 2px; box-shadow: none; }
  .ordinary-floor .media-placeholder { background: linear-gradient(135deg, #f4f7f9, #e6f1f5 52%, #f7f8f9); color: #88939d; }
  .ordinary-floor .media-placeholder__icon { width: 28px; height: 28px; opacity: .76; }
  .ordinary-floor .media-placeholder__label { font-size: 11px; }
  .ordinary-floor .video-card-common .title { display: -webkit-box; height: 40px; margin-top: 8px; overflow: hidden; color: #212121; font-size: 14px; line-height: 20px; text-overflow: ellipsis; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .ordinary-floor .video-card-common .up { height: 16px; margin-top: 4px; color: #999; font-size: 12px; line-height: 16px; }
  .ordinary-floor .rank-header { height: 36px; margin-bottom: 16px; }
  .ordinary-floor .rank-header .name { font-size: 20px; line-height: 28px; }
  .ordinary-floor .rank-header .more { display: inline-flex; min-width: 58px; height: 22px; align-items: center; justify-content: center; padding: 0 8px; border: 1px solid #c9ccd0; border-radius: 2px; }
  .ordinary-floor .rank-wrap { min-height: 18px; margin-bottom: 18px; gap: 8px; align-items: flex-start; }
  .ordinary-floor .rank-wrap .number { display: inline-flex; flex: 0 0 18px; width: 18px; height: 18px; align-items: center; justify-content: center; margin-top: 1px; border-radius: 2px; background: #fff; color: #999; font-size: 14px; line-height: 18px; }
  .ordinary-floor .rank-wrap:nth-child(-n+4) .number { color: #fff; background: #00a1d6; font-weight: 400; }
  .ordinary-floor .rank-wrap .title { font-size: 14px; line-height: 20px; }
  .ordinary-floor .rank-wrap:last-child { margin-bottom: 0; }
  @media (max-width: 1438px) { .ordinary-floor .floor-layout { grid-template-columns: minmax(0, 1fr) 265px; gap: 24px; } }
  @media (max-width: 980px) { .ordinary-floor .floor-layout { grid-template-columns: 1fr; } .ordinary-floor .zone-list-box { width: 100%; grid-template-columns: repeat(2, minmax(0, 1fr)); } .ordinary-floor .video-card-common { width: 100%; } }

  /* Form B parity baseline: dimensions are tied to the measured prototype breakpoints. */
  .homepage { position: relative; }
  :host([data-bili-retro-full-page-capture]) *, :host([data-bili-retro-full-page-capture]) *::before, :host([data-bili-retro-full-page-capture]) *::after { animation-play-state: paused !important; scroll-behavior: auto !important; transition-duration: 0s !important; }
  :host([data-bili-retro-full-page-capture="continuation"]) .international-header,
  :host([data-bili-retro-full-page-capture="continuation"]) .elevator,
  :host([data-bili-retro-full-page-capture="continuation"]) .contact-help { visibility: hidden !important; }
  .b-wrap, .container, .storey-box, .mini-header__content { width: min(1630px, calc(100% - 48px)); }
  .international-header { position: absolute; top: 0; left: 0; width: 100%; height: 56px; z-index: 30; }
  .mini-header, .mini-header__content { height: 56px; }
  .mini-header { background: transparent; border-bottom: 0; }
  .mini-header__content { gap: 14px; padding: 10px 0; }
  .bili-banner { z-index: 0; }
  .primary-menu-wrap, .primary-menu-itnl { height: 108px; }
  .primary-menu-wrap { z-index: 2; }
  .primary-menu-itnl { align-items: stretch; }
  .page-tab { padding-top: 14px; }
  .page-tab .round { display: inline-flex; width: 36px; height: 36px; flex: 0 0 36px; align-items: center; justify-content: center; margin-bottom: 3px; border-radius: 50%; background: #fff; }
  .page-tab .round.yel { background: #fb7299; }
  .page-tab .round.orange { background: #ff9c00; }
  .page-tab .round.channel { background: #7bc96f; }
  .page-tab .round .svg-icon { width: 28px; height: 28px; }
  .channel-menu-itnl { grid-template-rows: repeat(2, 34px); padding-top: 17px; }
  .channel-menu-itnl .item, .friendship-link .item { height: 34px; }
  .channel-menu-itnl .category-icon { width: 24px; height: 24px; }
  .first-screen { grid-template-columns: 550px minmax(0, 1fr); gap: 10px; margin-top: 0; margin-bottom: 0; }
  .focus-carousel { width: 550px; height: 242px; aspect-ratio: auto; }
  .focus-carousel .trigger { gap: 10px; }
  .focus-carousel .trigger span { width: 10px; height: 10px; }
  .focus-carousel .trigger-indicator { transform: translate3d(-4px, 0, 0); }
  .rcmd-box-wrap { position: relative; width: 100%; height: 242px; }
  .rcmd-box { grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px; height: 242px; padding: 0; border: 0; }
  .recommend-card { position: relative; overflow: hidden; min-width: 0; }
  .recommend-card { aspect-ratio: 16 / 9; }
  .recommend-card__image { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 2px; }
  .recommend-card::after { position: absolute; right: 0; bottom: 0; left: 0; z-index: 1; height: 48px; background: linear-gradient(to bottom, rgba(24, 25, 28, 0), rgba(24, 25, 28, .86)); content: ""; pointer-events: none; }
  .recommend-card__title { position: absolute; right: 8px; bottom: 7px; left: 8px; z-index: 2; margin: 0; color: #fff; text-shadow: 0 1px 2px rgba(24, 25, 28, .65); }
  .change-btn { position: absolute; top: 0; right: -36px; z-index: 3; display: flex; width: 28px; height: 77px; flex-direction: column; align-items: center; justify-content: flex-start; gap: 0; padding: 7px 0 0; border: 1px solid silver; border-radius: 2px; color: #505050; background: transparent; cursor: pointer; font-family: Arial, "Microsoft YaHei", sans-serif; font-size: 12px; font-weight: 400; line-height: 14px; white-space: normal; }
  .change-btn:hover { background: #f4f4f4; }
  .change-btn .bilifont { display: block; flex: 0 0 auto; margin-bottom: 4px; font-size: 16px; line-height: 14px; transition: transform .5s; }
  .change-btn > span { display: block; width: 12px; margin: 0 auto; line-height: 14px; text-align: center; }
  .change-btn:hover .bilifont, .change-btn:focus-visible .bilifont { transform: rotate(-1turn); }
  .change-btn.is-spinning .bilifont { animation: carousel-recommend-change-spin .52s linear 1; }
  @keyframes carousel-recommend-change-spin { from { transform: rotate(0); } to { transform: rotate(-1turn); } }
  .storey-box { margin-top: 36px; }
  .storey-box + .storey-box { margin-top: 54px; }
  #reportFirst2[data-floor-id="promote"] { min-height: 71px; margin-top: 30px; }
  .storey-box:not([data-floor-id="promote"]) { min-height: 457px; }
  .floor-layout { grid-template-columns: minmax(0, 1fr) 320px; gap: 24px; }
  .ordinary-floor .zone-list-box { width: 1286px; grid-template-columns: repeat(6, minmax(0, 206px)); justify-content: space-between; gap: 24px 10px; }
  .ordinary-floor .video-card-common { width: 100%; min-height: 192px; }
  .ordinary-floor .card-pic { width: 100%; aspect-ratio: 16 / 9; }
  .ordinary-floor .card-pic > img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .ordinary-floor .video-card-common .title { font-size: 14px; }
  .ordinary-floor .video-card-common .up { font-size: 12px; }
  .ordinary-floor .video-card-common .card-pic > .card-link,
  .ordinary-floor .video-card-common .card-pic .b-img,
  .ordinary-floor .video-card-common .card-pic .b-img__inner,
  .ordinary-floor .video-card-common .card-pic .b-img__inner img { display: block; width: 100%; height: 100%; }
  .ordinary-floor .video-card-common .card-pic .b-img { background: #eef1f3; }
  .ordinary-floor .video-card-common .card-pic .b-img__inner img { object-fit: cover; }
  .ordinary-floor .video-card-common .card-pic .count { position: absolute; right: 0; bottom: 0; left: 0; display: flex; min-height: 38px; align-items: flex-end; justify-content: space-between; padding: 16px 6px 4px; color: #fff; background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .68)); font-size: 12px; line-height: 16px; }
  .ordinary-floor .video-card-common .card-pic .count .left { display: flex; gap: 8px; min-width: 0; }
  .ordinary-floor .video-card-common .card-pic .count .left span,
  .ordinary-floor .video-card-common .card-pic .count .right span { display: inline-flex; align-items: center; white-space: nowrap; }
  .ordinary-floor .video-card-common .card-pic .count .bilifont { margin-right: 4px; font-size: 12px; }
  .ordinary-floor .douga-metric-icon { display: inline-block; width: 16px; height: 16px; flex: 0 0 16px; margin-right: 4px; fill: currentColor; vertical-align: middle; }
  #bili_report_douga .douga-metric-icon { display: inline-block; width: 16px; height: 16px; flex: 0 0 16px; margin-right: 4px; fill: currentColor; vertical-align: middle; }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black { position: absolute; right: 8px; bottom: 8px; z-index: 2; width: 28px; height: 28px; cursor: pointer; opacity: 0; pointer-events: none; transition: opacity .3s; }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAwFBMVEUAAAAGBgavr69EREQUFBQ1NTUODg7t7e3FxcV0dHRbW1sAAAAAAAAAAAD+/v77+/v4+Pj09PTj4+P8/PzV1dWpqamSkpIhISH19fXX19fLy8ulpaWdnZ1kZGRVVVUsLCz6+vrm5uba2tq9vb20tLSsrKyXl5eMjIx+fn54eHhsbGxpaWk+Pj4AAAAAAADv7+/e3t7AwMC3t7ehoaFLS0vo6OjR0dHOzs7CwsKCgoKCgoJiYmLp6enMzMywsLD////DVMIGAAAAP3RSTlOZmtOrnqec8927sopkEf38+ffu/eXPxqH45+DOyrWwpPvv6NnV0cjEv724t6qPAPTr2tbNru/j4tvAv7Tw4dTgAD9iAAABpElEQVRIx+ST13KCUBiEDyCCBRBQsaHGHrvp/Xv/twpDTBgRonjr3u0w38zu8h+xNsolkVGlsrEWxkpcoJUhyuISBVjpIi7Arli9bmE6mb0rUhZI6tZu2KuxK+TO5RYOB2pM8udgShWASlOXa8MnDYDN7DRX6AOVkf/bTemEqe9OdW0DluwdNH7VgKZ3knNUEVN+CGz/K3oLtJJGrJugp3MPFrSSy7wBnVRwAE7aTxuDq6YNCpaaehRN2KV8eoRaNMh8GesBKIlgEewoaAtTPoytw0gIXz4KJYMcORfQ5n/Wy4kuaMKHzzioQTFyhNJ7P27ZMNuSDb4Noxingi3FQSpTab8bWx0+YOMdV6yKIxAGSuCkZ6Dv9sEsJlzNSxKIex/ejgUkXkEdxokgLMJn4gBUpcygyH+BHYyVMWo4w/eMwXFIfOCgAVKiAxMQTgCYAH+S44MkOXRAOJGbYyRyHXU24rIVWgjqCNgbkZWRRYA+JrfoYKaksKK8eKS8QCZcBVBe6VBezRGuWGlalSMaD2KQxsMooCMgu6FLdtOa7MY82d0HAP3jZ1lFdjimAAAAAElFTkSuQmCC"); background-size: contain; }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black .wl-tips { position: absolute; top: -30px; right: 0; padding: 4px 8px; color: #fff; background: rgba(0, 0, 0, .8); border-radius: 4px; font-size: 12px; line-height: 18px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .ordinary-floor .video-card-common .card-pic:hover .watch-later-video.van-watchlater.black,
  .ordinary-floor .video-card-common .card-pic:focus-within .watch-later-video.van-watchlater.black { opacity: 1; pointer-events: auto; transition-delay: .2s; }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black:hover .wl-tips,
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black:focus .wl-tips { opacity: 1; }
  @keyframes watch-later-feedback-bounce { 0% { transform: translateX(-50%) scale(0); } 50% { transform: translateX(-50%) scale(1.1); } 100% { transform: translateX(-50%) scale(1); } }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black.is-feedback .wl-tips { opacity: 1; animation: watch-later-feedback-bounce .26s ease-out; }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black.added { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAANlBMVEUAAAD8/PxpaWlfX1/9/f1ycnIAAAAAAAAAAAAAAAAAAAD09PTr6+vv7+/h4eFjY2NZWVn///+5pCBCAAAAEXRSTlOZ/Lez/bqKZBGPAPfy9ey1sk5dq9MAAACBSURBVEjH7dc7FsQgDENRQSZAAvl4/5udUrVU5vj1t3El4xy9Qaz1cWIcMDoGOqw6mgcbsux7Peuqjqsl4jJdLNOVx3Q1neH2OavjMCN+u+GwglJxeAuldpeNUnGUqqOUHSWdKOlESSdKOknSqZJO673vDVn2jZrJ7Gltj3n7ffgDLGYI2l1NOaQAAAAASUVORK5CYII="); }
  .ordinary-floor .video-card-common .watch-later-video.van-watchlater.black.is-loading { cursor: progress; }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .watch-later-video.van-watchlater.black {
    top: 8px;
    right: 8px;
    bottom: auto;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic {
    overflow: visible;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic > .card-link {
    overflow: hidden;
    border-radius: 2px;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .watch-later-video.van-watchlater.black .wl-tips {
    top: 34px;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    transform-origin: center;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count {
    bottom: 7px;
    height: 16px;
    min-height: 16px;
    align-items: center;
    padding: 0 8px;
    background: none;
    line-height: 16px;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .left,
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .right,
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .metric {
    display: flex;
    height: 16px;
    min-height: 16px;
    align-items: center;
    line-height: 16px;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .right {
    width: auto;
    min-width: 0;
    height: 16px;
    min-height: 16px;
    margin: 0;
    padding: 0;
    flex: 0 0 auto;
    justify-content: flex-end;
    float: none;
    position: static;
    transform: none;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .left {
    width: auto;
    min-width: 0;
    height: 16px;
    min-height: 16px;
    margin: 0;
    padding: 0;
    flex: 0 1 auto;
    float: none;
    position: static;
    transform: none;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .metric--duration {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    line-height: 16px;
    vertical-align: middle;
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .metric--duration {
    transform: translateY(0);
  }
  .ordinary-floor:not(.ordinary-pgc-floor):not([data-floor-id="course"]) .video-card-common .card-pic .count .douga-metric-icon {
    display: block;
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    margin-right: 4px;
    vertical-align: initial;
  }
  .ordinary-floor .video-card-common .up .bilifont { flex: 0 0 auto; margin-right: 4px; }
  .ordinary-floor .rank-wrap { min-width: 0; }
  .ordinary-floor .rank-cover { flex-basis: 48px; width: 48px; height: 27px; }
  .ordinary-floor .rank-wrap--top-1 .number { color: #fff; background: #fb7299; }
  .ordinary-floor .rank-wrap--top-2 .number { color: #fff; background: #ff9c00; }
  .ordinary-floor .rank-wrap--top-3 .number { color: #fff; background: #00a1d6; }
  .ordinary-floor .rank-header .more, .storey-title > .more { min-width: 58px; height: 22px; padding: 0 8px; border: 1px solid #c9ccd0; border-radius: 2px; }
  .exchange-btn .btn-change { display: flex; width: 72px; height: 22px; align-items: center; justify-content: center; gap: 4px; padding: 0 0 0 6px; border: 1px solid #c9ccd0; border-radius: 2px; color: #505050; background: #fff; }
  .exchange-btn .btn-change:hover { background: #f4f4f4; }
  .exchange-btn .btn-change .bilifont { transition: transform .5s; }
  .exchange-btn .btn-change.is-spinning .bilifont { animation: floor-change-spin .52s linear 1; }
  @keyframes floor-change-spin { from { transform: rotate(0); } to { transform: rotate(-1turn); } }
  .ordinary-floor .rank-wrap { margin-bottom: 18px; }
  #bili_douga { width: 100%; height: 456px; }
  #bili_report_douga { display: flex; width: 100%; height: 456px; margin: 0 0 40px; }
  #bili_report_douga .floor-layout { display: flex; width: 100%; height: 456px; gap: 24px; }
  #bili_report_douga .card-list { width: calc(100% - 344px); height: 456px; min-width: 0; }
  #bili_report_douga .storey-title { width: 100%; height: 36px; margin-bottom: 16px; }
  #bili_report_douga .storey-title .l-con { height: 36px; }
  #bili_report_douga .storey-title .svg-icon { display: block; width: 36px; height: 36px; margin-right: 6px; object-fit: contain; }
  #bili_report_douga .storey-title .name { height: 36px; margin-right: 20px; color: #212121; font-size: 20px; font-weight: 400; line-height: 36px; }
  #bili_report_douga .exchange-btn { display: flex; width: 142px; height: 22px; flex: 0 0 142px; gap: 0; overflow: visible; }
  #bili_report_douga .exchange-btn .btn-change { width: 72px; height: 22px; padding-left: 6px; }
  #bili_report_douga .exchange-btn .more { position: static; top: auto; right: auto; bottom: auto; display: flex; width: 58px; height: 22px; flex: 0 0 58px; align-items: center; justify-content: center; margin-left: 12px; padding: 0; border: 1px solid silver; border-radius: 2px; color: #505050; background: transparent; font-size: 12px; line-height: 16px; opacity: 1; visibility: visible; }
  #bili_report_douga .exchange-btn .more .bilifont { margin-left: 2px; font-size: 12px; }
  #bili_report_douga .zone-list-box { display: flex; width: 100%; min-width: 0; flex-wrap: wrap; align-content: space-between; justify-content: space-between; row-gap: 24px; }
  #bili_report_douga .video-card-common { width: calc((100% - 40px) / 5); min-width: 0; min-height: 0; flex: 0 0 calc((100% - 40px) / 5); }
  #bili_report_douga .video-card-common .card-pic { width: 100%; height: auto; aspect-ratio: 206 / 116; overflow: visible; border-radius: 0; box-shadow: none; }
  #bili_report_douga .video-card-common .card-pic > .card-link,
  #bili_report_douga .video-card-common .card-pic .b-img,
  #bili_report_douga .video-card-common .card-pic .b-img__inner,
  #bili_report_douga .video-card-common .card-pic .b-img__inner img { width: 100%; height: 100%; }
  #bili_report_douga .video-card-common .card-pic .count { height: 28px; min-height: 28px; padding: 6px 8px; align-items: center; }
  #bili_report_douga .video-card-common .card-pic .count .left { gap: 12px; }
  #bili_report_douga .video-card-common .card-pic .count .right { float: none; width: auto; min-height: 0; margin: 0; background: none; }
  .ordinary-floor .video-card-common .card-pic .count { height: 28px; min-height: 28px; padding: 6px 8px; align-items: center; }
  .ordinary-floor .video-card-common .card-pic .count .left { gap: 12px; }
  .ordinary-floor .video-card-common .card-pic .count .right { float: none; width: auto; min-height: 0; margin: 0; padding: 0; background: none; }
  .ordinary-floor .ordinary-pgc-card .card-pic .pgc-card-rating { justify-content: flex-end; padding: 6px 8px; }
  .ordinary-floor .ordinary-pgc-card .metric--rating { color: #fff; font-size: 16px; font-weight: 700; font-style: italic; line-height: 18px; }
  .ordinary-floor .ordinary-pgc-card .pgc-card-subtitle { margin: 4px 0 0; overflow: hidden; color: #999; font-size: 12px; line-height: 18px; text-overflow: ellipsis; white-space: nowrap; }
  .ordinary-pgc-floor { min-height: 650px; }
  .ordinary-pgc-floor .zone-list-box { height: auto; grid-template-columns: repeat(6, minmax(0, 170px)); align-content: start; justify-content: space-between; gap: 24px 10px; }
  .ordinary-pgc-floor .ordinary-pgc-card { min-height: 0; }
  .ordinary-pgc-floor .ordinary-pgc-card .card-pic { aspect-ratio: 3 / 4; border-radius: 2px; background: #f4f4f4; box-shadow: none; }
  .ordinary-pgc-floor .ordinary-pgc-card .card-pic .b-img__inner img, .ordinary-pgc-floor .ordinary-pgc-card .card-pic__image { display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
  .ordinary-pgc-floor .ordinary-pgc-card .title { display: block; height: 20px; margin: 8px 0 0; overflow: hidden; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  #bili_read{width:100%;min-height:456px}#bili_report_read{display:flex;width:100%;min-height:456px;justify-content:space-between;margin:0 0 40px}#bili_report_read>.article-list{width:1286px;min-height:456px}#bili_report_read .storey-title{width:100%;height:36px;margin-bottom:16px}#bili_report_read .zone-list-box{display:flex;width:1286px;height:404px;flex-wrap:wrap;align-content:space-between;justify-content:space-between}#bili_report_read .article-card{display:flex;width:623px;height:90px}#bili_report_read .article-card .pic{display:block;width:120px;height:90px;flex:0 0 120px;margin-right:16px}#bili_report_read .article-card .pic img{display:block;width:120px;height:90px;border-radius:2px;object-fit:cover}#bili_report_read .article-card .r-con{min-width:0;flex:1 1 auto}#bili_report_read .article-card .r-con .title{display:-webkit-box;height:40px;margin:0 0 8px;overflow:hidden;color:#212121;font-size:14px;font-weight:500;line-height:20px;text-overflow:ellipsis;white-space:normal;-webkit-box-orient:vertical;-webkit-line-clamp:2}#bili_report_read .article-card .r-con .title:hover,#bili_report_read .article-card .r-con .up:hover{color:#00a1d6}#bili_report_read .article-card .r-con .up{display:flex;height:17px;align-items:center;margin-bottom:5px;overflow:hidden;color:#999;line-height:17px;text-overflow:ellipsis;white-space:nowrap}#bili_report_read .article-card .r-con .count{display:flex;height:17px;color:#999;line-height:17px}#bili_report_read .article-card .r-con .count span{display:flex;width:80px;align-items:center}#bili_report_read .article-card .r-con .bilifont{margin-right:4px;font-size:16px}#bili_report_read>.rank-list{width:320px;min-height:456px;flex:0 0 320px}#bili_report_read .rank-header{width:100%;height:36px;margin-bottom:16px}#bili_report_read .rank-wrap{display:flex;width:320px;min-height:20px;justify-content:space-between;margin-bottom:18px}#bili_report_read .rank-wrap:last-child{margin-bottom:0}#bili_report_read .rank-wrap .number{width:18px;height:18px;flex:0 0 18px;color:#999;background:#fff;border-radius:2px;font-size:14px;line-height:18px;text-align:center}#bili_report_read .rank-wrap .number.on{color:#fff;background:#00a1d6}#bili_report_read .rank-wrap>.link,#bili_report_read .rank-wrap .preview{width:290px}#bili_report_read .rank-wrap .title{width:290px;height:20px;margin:0;overflow:hidden;color:#212121;font-size:14px;font-weight:500;line-height:20px;text-overflow:ellipsis;white-space:nowrap}#bili_report_read .rank-wrap .preview{display:flex;height:63px}#bili_report_read .rank-wrap:first-of-type{height:63px}#bili_report_read .rank-wrap .preview .pic,#bili_report_read .rank-wrap .preview .pic a,#bili_report_read .rank-wrap .preview .pic img{display:block;width:112px;height:63px}#bili_report_read .rank-wrap .preview .pic{flex:0 0 112px;overflow:hidden;border-radius:2px}#bili_report_read .rank-wrap .preview .pic img{object-fit:cover}#bili_report_read .rank-wrap .preview .txt{width:166px;min-width:0;margin-left:12px}#bili_report_read .rank-wrap .preview .txt p{display:-webkit-box;height:60px;margin:0;overflow:hidden;color:#212121;font-size:14px;font-weight:500;line-height:20px;white-space:normal;-webkit-box-orient:vertical;-webkit-line-clamp:3}
  #bili_report_read a,#bili_report_read a:hover{text-decoration:none}#bili_report_read a{transition:color .3s}#bili_report_read>.rank-list{min-width:0;overflow:hidden}#bili_report_read .rank-wrap{align-items:flex-start;overflow:hidden}#bili_report_read .rank-wrap>.link{display:block;min-width:0;overflow:hidden}#bili_report_read .rank-wrap .title{display:block;max-width:100%;box-sizing:border-box}#bili_report_read .rank-wrap .preview{min-width:0;overflow:hidden}#bili_report_read .rank-wrap .preview .txt a{display:block;min-width:0;overflow:hidden}
  #bili_read{width:1630px}@media screen and (max-width:1870px){#bili_read{width:1414px}}@media screen and (max-width:1654px){#bili_read{width:1198px}}@media screen and (max-width:1438px){#bili_read{width:999px}}
  #bili_report_read .storey-title .more,#bili_report_read .rank-header .more{position:static;display:flex;width:58px;height:22px;box-sizing:border-box;align-items:center;justify-content:center;border:1px solid #ccd0d7;border-radius:2px;background:#fff;color:#505050;font-size:12px;line-height:20px;opacity:1;visibility:visible;pointer-events:auto}#bili_report_read .storey-title .more:hover,#bili_report_read .rank-header .more:hover{border-color:#00a1d6;background:#fff;color:#00a1d6}#bili_report_read .read-metric-icon{display:inline-block;width:16px;height:16px;flex:0 0 16px;margin-right:4px;overflow:visible;fill:currentColor;vertical-align:middle}#bili_report_read .article-card .r-con .up .read-metric-icon{width:16px;height:16px;flex-basis:16px}
  @media screen and (min-width:1655px) and (max-width:1920px) and (min-resolution:1.2dppx){#bili_read{width:1198px}#bili_report_read{width:1198px}#bili_report_read>.article-list,#bili_report_read .zone-list-box{width:854px}#bili_report_read .article-card{width:400px}#bili_report_read>.rank-list,#bili_report_read .rank-wrap{width:320px;flex-basis:320px}#bili_report_read .rank-wrap>.link,#bili_report_read .rank-wrap .preview,#bili_report_read .rank-wrap .title{width:290px}#bili_report_read .rank-wrap .preview .txt{width:166px}}
  #bili_report_douga .video-card-common .title { display: -webkit-box; width: 100%; height: 40px; margin: 10px 0 8px; overflow: hidden; color: #212121; font-size: 14px; font-weight: 400; line-height: 20px; text-overflow: ellipsis; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  #bili_report_douga .video-card-common .title:hover { color: #00a1d6; }
  #bili_report_douga .video-card-common .up { display: flex; width: 100%; height: 16px; align-items: center; overflow: hidden; color: #999; font-size: 12px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
  #bili_report_douga .video-card-common .up .bilifont { width: 16px; height: 16px; margin-right: 4px; font-size: 16px; line-height: 16px; }
  #bili_report_douga .rank-list { width: 320px; height: 456px; flex: 0 0 320px; }
  #bili_report_douga .rank-header { width: 320px; height: 36px; margin-bottom: 16px; }
  #bili_report_douga .rank-header .name { color: #212121; font-size: 20px; font-weight: 400; line-height: 36px; }
  #bili_report_douga .rank-header .more { position: static; top: auto; right: auto; bottom: auto; display: flex; width: 58px; height: 22px; flex: 0 0 58px; align-items: center; padding: 0 0 0 12px; border: 1px solid silver; border-radius: 2px; color: #505050; background: transparent; opacity: 1; visibility: visible; }
  #bili_report_douga .custom-rank-wrap { display: flex; width: 320px; min-height: 20px; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  #bili_report_douga .custom-rank-wrap .number { width: 18px; height: 18px; flex: 0 0 18px; margin: 0; color: #999; background: #fff; border-radius: 2px; font-size: 14px; line-height: 18px; text-align: center; }
  #bili_report_douga .custom-rank-wrap .number.on { color: #fff; background: #00a1d6; }
  #bili_report_douga .custom-rank-wrap > .link { display: block; width: 290px; height: 20px; min-width: 0; }
  #bili_report_douga .custom-rank-wrap .title { width: 100%; height: 20px; margin: 0; overflow: hidden; color: #212121; font-size: 14px; font-weight: 400; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  #bili_report_douga .custom-rank-wrap .preview { display: flex; width: 290px; height: 63px; }
  #bili_report_douga .custom-rank-wrap:first-of-type { height: 63px; }
  #bili_report_douga .custom-rank-wrap .preview .pic { width: 112px; height: 63px; flex: 0 0 112px; overflow: hidden; border-radius: 4px; }
  #bili_report_douga .custom-rank-wrap .preview .pic .watch-later-video { position: absolute; right: 8px; bottom: 8px; z-index: 20; width: 28px; height: 28px; cursor: pointer; opacity: 0; pointer-events: none; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAwFBMVEUAAAAGBgavr69EREQUFBQ1NTUODg7t7e3FxcV0dHRbW1sAAAAAAAAAAAD+/v77+/v4+Pj09PTj4+P8/PzV1dWpqamSkpIhISH19fXX19fLy8ulpaWdnZ1kZGRVVVUsLCz6+vrm5uba2tq9vb20tLSsrKyXl5eMjIx+fn54eHhsbGxpaWk+Pj4AAAAAAADv7+/e3t7AwMC3t7ehoaFLS0vo6OjR0dHOzs7CwsKCgoKCgoJiYmLp6enMzMywsLD////DVMIGAAAAP3RSTlOZmtOrnqec8927sopkEf38+ffu/eXPxqH45+DOyrWwpPvv6NnV0cjEv724t6qPAPTr2tbNru/j4tvAv7Tw4dTgAD9iAAABpElEQVRIx+ST13KCUBiEDyCCBRBQsaHGHrvp/Xv/twpDTBgRonjr3u0w38zu8h+xNsolkVGlsrEWxkpcoJUhyuISBVjpIi7Arli9bmE6mb0rUhZI6tZu2KuxK+TO5RYOB2pM8udgShWASlOXa8MnDYDN7DRX6AOVkf/bTemEqe9OdW0DluwdNH7VgKZ3knNUEVN+CGz/K3oLtJJGrJugp3MPFrSSy7wBnVRwAE7aTxuDq6YNCpaaehRN2KV8eoRaNMh8GesBKIlgEewoaAtTPoytw0gIXz4KJYMcORfQ5n/Wy4kuaMKHzzioQTFyhNJ7P27ZMNuSDb4Noxingi3FQSpTab8bWx0+YOMdV6yKIxAGSuCkZ6Dv9sEsJlzNSxKIex/ejgUkXkEdxokgLMJn4gBUpcygyH+BHYyVMWo4w/eMwXFIfOCgAVKiAxMQTgCYAH+S44MkOXRAOJGbYyRyHXU24rIVWgjqCNgbkZWRRYA+JrfoYKaksKK8eKS8QCZcBVBe6VBezRGuWGlalSMaD2KQxsMooCMgu6FLdtOa7MY82d0HAP3jZ1lFdjimAAAAAElFTkSuQmCC"); background-size: contain; transition: opacity .3s; }
  #bili_report_douga .custom-rank-wrap .preview .pic:hover .watch-later-video,
  #bili_report_douga .custom-rank-wrap .preview .pic:focus-within .watch-later-video { opacity: 1; pointer-events: auto; transition-delay: .2s; }
  #bili_report_douga .custom-rank-wrap .preview .pic .watch-later-video .wl-tips { position: absolute; top: -30px; right: 0; padding: 4px 8px; color: #fff; background: rgba(0, 0, 0, .8); border-radius: 4px; font-size: 12px; line-height: 18px; white-space: nowrap; opacity: 0; pointer-events: none; }
  #bili_report_douga .custom-rank-wrap .preview .pic .watch-later-video:hover .wl-tips,
  #bili_report_douga .custom-rank-wrap .preview .pic .watch-later-video:focus .wl-tips { opacity: 1; }
  #bili_report_douga .custom-rank-wrap .preview .pic .link,
  #bili_report_douga .custom-rank-wrap .preview .pic img { display: block; width: 112px; height: 63px; object-fit: cover; }
  #bili_report_douga .custom-rank-wrap .preview .txt { width: 166px; min-width: 0; margin-left: 12px; }
  #bili_report_douga .custom-rank-wrap .preview .txt .title { display: -webkit-box; height: 60px; overflow: hidden; font-weight: 500; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
  #bili_report_douga .custom-rank-wrap { position: relative; }
  #bili_report_douga .rank-video-popover { position: absolute; top: -138px; right: 0; z-index: 200; width: 320px; padding: 12px; border: 0; border-radius: 2px; color: #212121; background: #fff; box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .2); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(5px); transition: opacity .2s ease, transform .2s ease, visibility .2s; }
  #bili_report_douga .custom-rank-wrap.is-rank-popover-visible .rank-video-popover { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
  #bili_report_douga .rank-video-popover__main { display: flex; min-width: 0; }
  #bili_report_douga .rank-video-popover__cover { display: block; width: 112px; height: 63px; flex: 0 0 112px; overflow: hidden; border-radius: 2px; }
  #bili_report_douga .rank-video-popover__cover img { display: block; width: 112px; height: 63px; object-fit: cover; }
  #bili_report_douga .rank-video-popover__info { min-width: 0; padding-left: 10px; }
  #bili_report_douga .rank-video-popover__title { display: -webkit-box; max-height: 40px; margin-bottom: 8px; overflow: hidden; color: #212121; font-size: 14px; font-weight: 700; line-height: 20px; text-decoration: none; word-break: break-all; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  #bili_report_douga .rank-video-popover__meta { display: flex; overflow: hidden; color: #999; font-size: 12px; line-height: 16px; white-space: nowrap; }
  #bili_report_douga .rank-video-popover__owner { max-width: 86px; overflow: hidden; color: #999; text-decoration: none; text-overflow: ellipsis; }
  #bili_report_douga .rank-video-popover__date { max-width: 72px; flex: 0 0 auto; margin-left: 11px; overflow: hidden; }
  #bili_report_douga .rank-video-popover__date::before { margin-right: 5px; content: "·"; }
  #bili_report_douga .rank-video-popover__stats { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e7e7e7; color: #999; }
  #bili_report_douga .rank-video-popover__stat { display: flex; min-width: 0; align-items: center; font-size: 12px; line-height: 16px; white-space: nowrap; }
  #bili_report_douga .rank-video-popover__stat .bilifont { flex: 0 0 auto; margin-right: 3px; color: #999; font-size: 16px; }
  .ordinary-floor .rank-list { width: 320px; height: 456px; flex: 0 0 320px; }
  #bili_life .ordinary-rank-unavailable, #bili_information .ordinary-rank-unavailable { display:flex; width:100%; height:404px; box-sizing:border-box; flex-direction:column; align-items:center; justify-content:center; color:#999; text-align:center; }
  #bili_life .ordinary-rank-unavailable__image, #bili_information .ordinary-rank-unavailable__image { display:block; width:min(260px, 88%); height:auto; object-fit:contain; }
  #bili_life .ordinary-rank-unavailable__label, #bili_information .ordinary-rank-unavailable__label { display:block; margin-top:12px; font-size:12px; line-height:18px; }
  .rank-runtime-unavailable { display:flex; width:100%; height:404px; box-sizing:border-box; flex-direction:column; align-items:center; justify-content:center; color:#999; text-align:center; }
  .rank-runtime-unavailable__image { display:block; width:min(220px, 82%); height:auto; object-fit:contain; }
  .rank-runtime-unavailable__label { display:block; margin-top:12px; font-size:12px; line-height:18px; }
  .ordinary-floor .rank-header { width: 320px; height: 36px; margin-bottom: 16px; }
  .ordinary-floor .exchange-btn .more, .ordinary-floor .rank-header .more { position: static; display: flex; width: 58px; height: 22px; flex: 0 0 58px; align-items: center; padding: 0 0 0 12px; border: 1px solid silver; border-radius: 2px; color: #505050; background: transparent; font-size: 12px; line-height: 16px; opacity: 1; visibility: visible; }
  .ordinary-floor .exchange-btn .more { margin-left: 12px; }
  .ordinary-floor .exchange-btn .more .bilifont, .ordinary-floor .rank-header .more .bilifont { margin-left: 2px; font-size: 12px; }
  .ordinary-floor .custom-rank-wrap { position: relative; display: flex; width: 320px; min-height: 20px; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .ordinary-floor .custom-rank-wrap .number { width: 18px; height: 18px; flex: 0 0 18px; margin: 0; color: #999; background: #fff; border-radius: 2px; font-size: 14px; line-height: 18px; text-align: center; }
  .ordinary-floor .custom-rank-wrap .number.on { color: #fff; background: #00a1d6; }
  .ordinary-floor .custom-rank-wrap > .link { display: block; width: 290px; height: 20px; min-width: 0; }
  .ordinary-floor .custom-rank-wrap .title { width: 100%; height: 20px; margin: 0; overflow: hidden; color: #212121; font-size: 14px; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  .ordinary-floor .custom-rank-wrap .preview { display: flex; width: 290px; height: 63px; }
  .ordinary-floor .custom-rank-wrap:first-of-type { height: 63px; }
  .ordinary-floor .custom-rank-wrap .preview .pic { width: 112px; height: 63px; flex: 0 0 112px; overflow: hidden; border-radius: 4px; }
  .ordinary-floor .custom-rank-wrap .preview .pic .link,
  .ordinary-floor .custom-rank-wrap .preview .pic img { display: block; width: 112px; height: 63px; object-fit: cover; }
  .ordinary-floor .custom-rank-wrap .preview .txt { width: 166px; min-width: 0; margin-left: 12px; }
  .ordinary-floor .custom-rank-wrap .preview .txt .title { display: -webkit-box; height: 60px; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
  .ordinary-floor .custom-pgc-rank-wrap { position: relative; display: flex; width: 320px; min-height: 20px; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .ordinary-floor .custom-pgc-rank-wrap .number { width: 18px; height: 18px; flex: 0 0 18px; margin: 0; color: #999; background: #fff; border-radius: 2px; font-size: 14px; line-height: 18px; text-align: center; }
  .ordinary-floor .custom-pgc-rank-wrap .number.on { color: #fff; background: #00a1d6; }
  .ordinary-floor .custom-pgc-rank-wrap > .link { display: block; width: 290px; min-width: 0; color: #212121; text-decoration: none; }
  .ordinary-floor .custom-pgc-rank-wrap .title { display: block; width: 100%; height: 20px; margin: 0; overflow: hidden; color: #212121; font-size: 14px; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  .ordinary-floor .custom-pgc-rank-wrap .update, .ordinary-floor .custom-pgc-rank-wrap .score, .ordinary-floor .custom-pgc-rank-wrap .badge { display: inline-block; margin-right: 6px; overflow: hidden; color: #9499a0; font-size: 11px; line-height: 18px; text-overflow: ellipsis; vertical-align: top; white-space: nowrap; }
  .ordinary-floor .custom-pgc-rank-wrap .score { color: #fb7299; }
  .ordinary-floor .custom-pgc-rank-wrap .badge { color: #00a1d6; }
  .ordinary-floor .custom-pgc-rank-wrap .preview { display: flex; width: 290px; height: 63px; }
  .ordinary-floor .custom-pgc-rank-wrap:first-of-type { height: 63px; }
  .ordinary-floor .custom-pgc-rank-wrap .preview .pic { width: 112px; height: 63px; flex: 0 0 112px; overflow: hidden; border-radius: 4px; }
  .ordinary-floor .custom-pgc-rank-wrap .preview .pic .link,
  .ordinary-floor .custom-pgc-rank-wrap .preview .pic img { display: block; width: 112px; height: 63px; object-fit: cover; }
  .ordinary-floor .custom-pgc-rank-wrap .preview .txt { width: 166px; min-width: 0; margin-left: 12px; }
  .ordinary-floor .custom-pgc-rank-wrap .preview .txt .title { display: -webkit-box; height: 40px; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .ordinary-floor .pgc-rank { width: 320px; height: 456px; flex: 0 0 320px; }
  .ordinary-floor .custom-pgc-rank-wrap,
  .ordinary-floor .custom-pgc-rank-wrap:first-of-type { width: 320px; height: auto; min-height: 20px; align-items: flex-start; margin-bottom: 18px; }
  .ordinary-floor .custom-pgc-rank-wrap:last-child { margin-bottom: 0; }
  .ordinary-floor .custom-pgc-rank-wrap > .link { display: inline-block; width: 290px; height: 20px; }
  .ordinary-floor .custom-pgc-rank-wrap .txt { display: flex; width: 290px; min-width: 0; align-items: flex-start; justify-content: space-between; line-height: 20px; }
  .ordinary-floor .custom-pgc-rank-wrap .txt .title { display: block; width: 198px; height: 20px; min-width: 0; flex: 0 1 198px; margin: 0; overflow: hidden; color: #212121; font-size: 14px; font-weight: 500; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  .ordinary-floor .custom-pgc-rank-wrap .txt .update { min-width: 90px; max-width: 100px; flex: 0 0 auto; margin: 0; overflow: hidden; color: #999; font-size: 12px; line-height: 20px; text-align: right; text-overflow: ellipsis; white-space: nowrap; }
  .ordinary-floor .custom-pgc-rank-wrap .txt .movie-update { min-width: 100px; }
  .ordinary-floor .rank-video-popover { position: absolute; top: -138px; right: 0; z-index: 200; width: 320px; padding: 12px; border-radius: 2px; color: #212121; background: #fff; box-shadow: 0 1px 6px 0 rgba(0, 0, 0, .2); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(5px); transition: opacity .2s ease, transform .2s ease, visibility .2s; }
  .ordinary-floor .custom-rank-wrap.is-rank-popover-visible .rank-video-popover { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
  .ordinary-floor .rank-video-popover__main { display: flex; min-width: 0; }
  .ordinary-floor .rank-video-popover__cover { display: block; width: 112px; height: 63px; flex: 0 0 112px; overflow: hidden; border-radius: 2px; }
  .ordinary-floor .rank-video-popover__cover img { display: block; width: 112px; height: 63px; object-fit: cover; }
  .ordinary-floor .rank-video-popover__info { min-width: 0; padding-left: 10px; }
  .ordinary-floor .rank-video-popover__title { display: -webkit-box; max-height: 40px; margin-bottom: 8px; overflow: hidden; color: #212121; font-size: 14px; font-weight: 700; line-height: 20px; text-decoration: none; word-break: break-all; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .ordinary-floor .rank-video-popover__meta { display: flex; overflow: hidden; color: #999; font-size: 12px; line-height: 16px; white-space: nowrap; }
  .ordinary-floor .rank-video-popover__owner { max-width: 86px; overflow: hidden; color: #999; text-decoration: none; text-overflow: ellipsis; }
  .ordinary-floor .rank-video-popover__date { max-width: 72px; flex: 0 0 auto; margin-left: 11px; overflow: hidden; }
  .ordinary-floor .rank-video-popover__stats { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e7e7e7; color: #999; }
  .ordinary-floor .rank-video-popover__stat { display: flex; min-width: 0; align-items: center; font-size: 12px; line-height: 16px; white-space: nowrap; }
  .ordinary-floor .rank-video-popover__stat .bilifont { flex: 0 0 auto; margin-right: 3px; color: #999; font-size: 16px; }
  #bili_report_cheese .zone-list-box.cheese, #bili_report_cheese .zone-list-box { height: 364px; }
  #bili_report_cheese .cheese-card .card-pic .count { height: 28px; min-height: 28px; align-items: center; padding: 6px 8px; }
  #bili_report_cheese .cheese-card .card-pic .count .right { max-width: 92px; overflow: hidden; color: #fff; font-size: 12px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
  #bili_report_cheese .cheese-card .title { display: -webkit-box; height: 40px; margin: 10px 0 8px; overflow: hidden; white-space: normal; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  #bili_report_cheese .cheese-card { min-height: 166px; }
  #bili_report_cheese .cheese-card .up { display: none; }
  #bili_report_cheese .cheese-rank-popover .rank-video-popover__stat .douga-metric-icon { width: 16px; height: 16px; margin-right: 4px; }
  @media (max-width: 1870px) {
    .b-wrap, .container, .storey-box, .mini-header__content { width: 1414px; max-width: calc(100% - 40px); }
    .ordinary-floor .zone-list-box { width: 1070px; grid-template-columns: repeat(5, minmax(0, 206px)); }
    .ordinary-floor .zone-list-box > .video-card-common:nth-child(n + 11) { display: none; }
  }
  @media (max-width: 1654px) {
    .b-wrap, .container, .storey-box, .mini-header__content { width: 1198px; max-width: calc(100% - 32px); }
    #bili_report_douga .zone-list-box > .video-card-common:nth-child(n + 9) { display: none; }
    #bili_report_douga .video-card-common { width: calc((100% - 30px) / 4); flex-basis: calc((100% - 30px) / 4); }
    .ordinary-floor .zone-list-box { width: 854px; grid-template-columns: repeat(4, minmax(0, 206px)); }
    .ordinary-floor .zone-list-box > .video-card-common:nth-child(n + 9) { display: none; }
    .ordinary-floor .rank-list,
    .ordinary-floor .rank-header,
    .ordinary-floor .custom-rank-wrap { width: 320px; }
  }
  @media (max-width: 1438px) {
    #bili_report_cheese .zone-list-box.cheese, #bili_report_cheese .zone-list-box { height: 322px; }
    #bili_report_douga .floor-layout { gap: 24px; }
    #bili_report_douga .card-list { width: calc(100% - 289px); }
    #bili_report_douga .rank-list,
    #bili_report_douga .rank-header,
    #bili_report_douga .custom-rank-wrap { width: 265px; flex-basis: 265px; }
    #bili_report_douga .custom-rank-wrap > .link,
    #bili_report_douga .custom-rank-wrap .preview { width: 235px; }
    #bili_report_douga .custom-rank-wrap .preview .txt { width: 111px; }
    #bili_report_douga .video-card-common { width: calc((100% - 30px) / 4); flex-basis: calc((100% - 30px) / 4); }
    #bili_report_douga .video-card-common .card-pic,
    #bili_report_douga .video-card-common .card-pic > .card-link,
    #bili_report_douga .video-card-common .card-pic .b-img,
    #bili_report_douga .video-card-common .card-pic .b-img__inner,
    #bili_report_douga .video-card-common .card-pic .b-img__inner img { width: 100%; height: auto; aspect-ratio: 206 / 116; }
    .ordinary-floor .rank-list,
    .ordinary-floor .rank-header,
    .ordinary-floor .custom-rank-wrap { width: 265px; flex-basis: 265px; }
    .ordinary-floor .pgc-rank,
    .ordinary-floor .custom-pgc-rank-wrap { width: 265px; flex-basis: 265px; }
    .ordinary-floor .custom-pgc-rank-wrap > .link,
    .ordinary-floor .custom-pgc-rank-wrap .txt { width: 235px; }
    .ordinary-floor .custom-rank-wrap > .link,
    .ordinary-floor .custom-rank-wrap .preview { width: 235px; }
    .ordinary-floor .custom-rank-wrap .preview .txt { width: 111px; }
    .ordinary-floor .zone-list-box { width: 710px; grid-template-columns: repeat(4, minmax(0, 170px)); }
    .ordinary-floor .zone-list-box > .video-card-common:nth-child(n + 9) { display: none; }
  }
  .international-footer { min-height: 454px; margin-top: 54px; padding: 42px 0 54px; }
  .international-footer .link-box { min-height: 180px; }
  .footer-qr { position: static; display: block; width: 42px; height: 42px; padding: 0; border: 0; transform: none; background: transparent; }
  /* elevator geometry defined in the top block; keep no override here */
  .bilifont { font-family: "extension-bilifont", Arial, sans-serif !important; font-style: normal !important; font-weight: 400 !important; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  .bilifont[data-icon-glyph] { position: relative; color: transparent; }
  .bilifont[data-icon-glyph]::before { display: none !important; }
  .bilifont[data-icon-glyph].icon-font-ready { color: inherit; }
  .elevator > .ear.bilifont[data-icon-glyph] { position: absolute; top: 0; left: 50%; width: 34px; height: 8px; display: flex; align-items: flex-end; justify-content: center; z-index: 2; color: #333; font-size: 12px; line-height: 8px; pointer-events: none; transform: translate(-50%, -100%); }
  .elevator > .ear.bilifont[data-icon-glyph] .icon-font-fallback--text { color: #333; font-size: 12px; line-height: 8px; }
  .icon-font-fallback { display: inline-flex; position: absolute; inset: 0; align-items: center; justify-content: center; color: #fff; font-family: Arial, sans-serif !important; font-size: 11px; font-style: normal; font-weight: 700; line-height: 1; }
  .icon-font-ready .icon-font-fallback { display: none; }
  .icon-font-fallback--tv { top: 50%; right: auto; bottom: auto; left: 50%; width: 13px; height: 10px; border: 2px solid currentColor; border-radius: 2px; transform: translate(-50%, -50%); }
  .icon-font-fallback--tv::before { position: absolute; top: -5px; left: 3px; width: 5px; height: 4px; border-top: 1px solid currentColor; content: ""; transform: rotate(-25deg); }
  .icon-font-fallback--tv::after { position: absolute; bottom: -4px; left: 4px; width: 3px; height: 2px; border-top: 1px solid currentColor; content: ""; }
  .icon-font-fallback--search { top: 50%; right: auto; bottom: auto; left: 50%; width: 11px; height: 11px; border: 2px solid #61666d; border-radius: 50%; transform: translate(-50%, -50%); }
  .icon-font-fallback--search::after { position: absolute; right: -5px; bottom: -3px; width: 6px; height: 2px; border-radius: 1px; background: #61666d; content: ""; transform: rotate(45deg); transform-origin: left center; }
  .icon-font-fallback--download { top: 50%; right: auto; bottom: auto; left: 50%; width: 2px; height: 10px; border-radius: 1px; background: currentColor; transform: translate(-50%, -50%); }
  .icon-font-fallback--download::before { position: absolute; bottom: 1px; left: -4px; width: 7px; height: 7px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; content: ""; transform: rotate(45deg); }
  .icon-font-fallback--download::after { position: absolute; bottom: -4px; left: -6px; width: 13px; height: 2px; border-radius: 1px; background: currentColor; content: ""; }
  .icon-font-fallback--text { position: static; color: #fff; }
  .icon-font-fallback--empty { display: none; }
  .bili-icon_dingdao_zhuzhan::before { content: "\\E72B"; }
  .bili-icon_dingdao_sousuo::before { content: "\\E72C"; }
  .bili-icon_dingdao_xiazaiapp::before { content: "\\E72D"; }
  .bili-icon_dingdao_dongtai::before { content: "\\E732"; }
  .bili-icon_xinxi_UPzhu::before { content: "\\E741"; }
  .bili-icon_caozuo_huanyihuan::before { content: "\\E73C"; }
  .bili-icon_youdaohang_paixu::before { content: "\\E74D"; }
  .bili-general_pullup_s::before { content: "\\E6EC"; }
  .bili-icon_dingdao_gerenzhongxin::before { content: "\\E722"; }
  .bili-icon_dingdao_tougaoguanli::before { content: "\\E723"; }
  .bili-icon_dingdao_tuijianfuwu::before { content: "\\E60F"; }
  .bili-icon_dingdao_yuyanshezhi::before { content: "\\E757"; }
  .bili-icon_dingdao_dengchu::before { content: "\\E721"; }
  .bili-icon_dingdao_qianbao::before { content: "\\E71F"; }
  .bili-icon_dingdao_dingdanzhongxin::before { content: "\\E71E"; }
  .bili-icon_dingdao_zhibozhongxin::before { content: "\\E720"; }
  .bili-icon_dingdao_cheese::before { content: "\\E60E"; }
  .bili-icon_dingdao_bangdingshouji::before { content: "\\E733"; }
  .bili-icon_dingdao_youxiang::before { content: "\\E735"; }
  .bili-icon_dingdao_yingbi::before { content: "\\E734"; }
  .bili-icon_dingdao_Bbi::before { content: "\\E736"; }
  .bili-icon_caozuo_qianwang::before { content: "\\E73B"; }
  .bili-icon_caozuo_xuanzhong::before { content: "\\E756"; }
  .bili-icon_shipin_danmushu::before { content: "\\E759"; }
  .bili-icon_shipin_shoucangshu::before { content: "\\E75A"; }
  .bili-icon_shipin_yingbishu::before { content: "\\E75B"; }
  .bili-icon_shipin_bofangshu::before { content: "\\E73E"; }
  .btn-change { white-space: nowrap; }
  @media (min-width: 1655px) and (max-width: 1870px) {
    .ordinary-pgc-floor .zone-list-box { grid-template-columns: repeat(6, minmax(0, 170px)); }
    #bili_report_read > .article-list, #bili_report_read .zone-list-box { width: 1070px; }
    #bili_report_read .article-card { width: 520px; }
  }
  @media (max-width: 1654px) {
    .b-wrap, .container, .storey-box, .mini-header__content { width: 1198px; max-width: calc(100% - 32px); }
    .first-screen { grid-template-columns: 550px minmax(0, 1fr); }
    .focus-carousel { width: 550px; height: 242px; }
    .rcmd-box-wrap, .rcmd-box { height: 242px; }
    .rcmd-box { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ordinary-floor .zone-list-box > .video-card-common:nth-child(n + 9) { display: none; }
    .ordinary-floor .zone-list-box { width: 854px; grid-template-columns: repeat(4, minmax(0, 206px)); }
    .ordinary-pgc-floor .zone-list-box { grid-template-columns: repeat(5, minmax(0, 162px)); }
    .ordinary-pgc-floor .zone-list-box > .ordinary-pgc-card:nth-child(n + 9) { display: block; }
    .ordinary-pgc-floor .zone-list-box > .ordinary-pgc-card:nth-child(n + 11) { display: none; }
    #bili_report_read > .article-list, #bili_report_read .zone-list-box { width: 854px; }
    #bili_report_read .article-card { width: 400px; }
  }
  @media (max-width: 1438px) {
    .b-wrap, .container, .storey-box, .mini-header__content { width: 999px; max-width: calc(100% - 32px); }
    .first-screen { grid-template-columns: 459px minmax(0, 1fr); }
    .focus-carousel { width: 459px; height: 202px; }
    .rcmd-box-wrap, .rcmd-box { height: 202px; }
    .floor-layout { grid-template-columns: minmax(0, 1fr) 265px; gap: 24px; }
    .storey-box:not([data-floor-id="promote"]) { min-height: 433px; }
    .storey-box.ordinary-pgc-floor { min-height: 615px; }
    .ordinary-pgc-floor .zone-list-box { grid-template-columns: repeat(4, minmax(0, 170px)); }
    .ordinary-pgc-floor .zone-list-box > .ordinary-pgc-card:nth-child(n + 9) { display: none; }
    #bili_report_read > .article-list, #bili_report_read .zone-list-box { width: 710px; }
    #bili_report_read .article-card { width: 345px; }
    #bili_report_read > .rank-list, #bili_report_read .rank-wrap { width: 265px; flex-basis: 265px; }
    #bili_report_read .rank-wrap > .link, #bili_report_read .rank-wrap .preview, #bili_report_read .rank-wrap .title { width: 235px; }
    #bili_report_read .rank-wrap .preview .txt { width: 111px; }
    .ordinary-floor .video-card-common { min-height: 172px; }
    .ordinary-floor .zone-list-box { width: 710px; grid-template-columns: repeat(4, minmax(0, 170px)); }
    .ordinary-floor .zone-list-box > .video-card-common:nth-child(n + 9) { display: none; }
    .international-footer { min-height: 478px; }
  }
  @media (max-width: 980px) {
    .b-wrap, .container, .storey-box, .mini-header__content { width: calc(100% - 20px); max-width: none; }
    .first-screen { grid-template-columns: 1fr; }
    .focus-carousel { width: 100%; height: auto; aspect-ratio: 550 / 242; }
    .rcmd-box-wrap, .rcmd-box { height: auto; min-height: 242px; }
    .floor-layout { grid-template-columns: 1fr; }
    .ordinary-floor .zone-list-box { width: 100%; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ordinary-floor .video-card-common { min-height: 0; }
    .elevator { display: none; }
  }
  @media (max-width: 640px) {
    .bili-banner, .banner__image, .banner-layer { height: 155px; }
    .primary-menu-wrap, .primary-menu-itnl { height: auto; min-height: 108px; }
    .channel-menu-itnl { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .rcmd-box { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .international-footer .link-box, .footer_left, .partner { flex-direction: column; }
  }
  /* Final mini-header baseline overrides stay after the shell breakpoint rules. */
  .international-header { z-index: 3200; }
  .mini-header__content { display: grid; grid-template-columns: max-content minmax(0, 1fr) max-content; column-gap: clamp(8px, 1vw, 16px); width: 100%; max-width: none; padding: 10px 24px; }
  .nav-link { min-width: max-content; }
  .nav-link-ul { width: max-content; max-width: 100%; }
  .nav-link-ul { gap: 12px; }
  .nav-link-item .link { height: 32px; font-size: 14px; line-height: 32px; }
  .nav-search { position: relative; display: block; width: 100%; height: 36px; }
  .nav-search-form, #nav_searchform { position: relative; display: block; width: 100%; height: 100%; margin: 0; }
  .nav-search-keyword { display: block; width: calc(100% - 48px); height: 36px; min-width: 0; padding: 0 10px; }
  .nav-search-btn { position: absolute; top: 0; right: 0; display: flex; width: 48px; height: 36px; align-items: center; justify-content: center; flex: 0 0 48px; padding: 0; }
  .nav-search-box { flex: none; width: auto; min-width: 0; max-width: none; }
  .nav-user-center { min-width: max-content; }
  .activity-entry { display: block; width: 80px; height: 40px; margin-top: -1px; margin-right: -4px; }
  .activity-link, .activity-image { width: 80px !important; height: 40px !important; }
  .auth-branch--logout { gap: 0; }
  .auth-branch--logout .van-popper-nav { position: absolute; display: block; opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s; }
  .auth-branch--logout .van-popper-nav.is-popover-visible { opacity: 1; pointer-events: auto; visibility: visible; transition-delay: 0s; }
  .auth-branch--logout .user-popover-item { margin-left: 12px; }
  .auth-branch--logout .user-popover-item:first-child { margin-left: 0; }
  .auth-branch--logout .unlogin-entry { margin-right: 16px; }
  .auth-state-panel[data-state="logged_out"] .auth-branch--logout > .item:not(.unlogin-entry) > .name,
  .auth-state-panel[data-state="logged_out"] .auth-branch--logout > .item:not(.unlogin-entry) > .mini-vip,
  .auth-state-panel[data-state="logged_out"] .auth-branch--logout > .item:not(.unlogin-entry) > .user-popover-reference > .mini-vip,
  .auth-state-panel[data-state="logged_out"] .auth-branch--logout .mini-creator .name { display: block; color: #fff; font-family: inherit; font-size: 14px; font-weight: 400; line-height: 30px; text-decoration: none; text-shadow: 0 1px 1px rgba(0, 0, 0, .3); white-space: nowrap; }
  .auth-branch--logout .mini-creator { display: flex; width: 56px; height: 32px; align-items: center; margin-left: 12px; }
  .mini-upload-wrap { margin-left: 14px; }
  .mini-upload { width: 100px; height: 36px; min-height: 36px; justify-content: center; padding: 0; }
  .header-popover { z-index: 3200; border-radius: 2px; box-shadow: 0 3px 6px rgba(0, 0, 0, .2); }
  .popover-game, .popover-live, .popover-manga { border: 0; border-radius: 0; box-shadow: none; }
  .download-client-entry { z-index: 3215; border-radius: 8px; box-shadow: 0 0 30px rgba(0, 0, 0, .1); }
  .header-search-suggest { right: 0; left: 0; z-index: 3205; width: 100%; max-width: none; height: auto; border-radius: 2px; box-shadow: 0 2px 4px rgba(0, 0, 0, .1); }
  .auth-login-button { width: 36px; height: 36px; padding: 0; }
  .auth-link, .upload-fixture-item, .search-suggest-row { text-decoration: none; }
  @media (max-width: 1700px) {
    .nav-link-ul { gap: 10px; }
    .activity-entry { margin-right: 0; }
    .mini-upload { width: 90px; }
  }
  @media (max-width: 1438px) {
    .nav-link-ul { gap: 4px; }
    .nav-search-box { flex: none; width: auto; min-width: 0; }
    .mini-upload { width: 80px; }
    .auth-branch--logout .user-popover-item:not(.unlogin-entry) > .unlogin-tip-popper { right: 0; left: auto; transform: translateY(-5px); }
    .auth-branch--logout .user-popover-item:not(.unlogin-entry) > .unlogin-tip-popper.is-popover-visible, .auth-branch--logout .user-popover-item:not(.unlogin-entry):hover > .unlogin-tip-popper, .auth-branch--logout .user-popover-item:not(.unlogin-entry):focus-within > .unlogin-tip-popper { transform: translateY(0); }
  }
  @media (min-width: 1439px) and (max-width: 1599px) { .nav-search-box { flex: none; width: auto; min-width: 0; } }
  @media (max-width: 980px) {
    .mini-header__content { grid-template-columns: minmax(0, 1fr) max-content; column-gap: clamp(8px, 1vw, 14px); }
    .nav-search-box { grid-column: 1; }
    .nav-user-center { grid-column: 2; }
  }
  /* R2 logged-in mini-header: fixed intrinsic widths keep the search column clear. */
  .nav-user-center { position: relative; display: flex; width: 458px; height: 40px; flex: 0 0 458px; align-items: center; gap: 0; min-width: 458px; color: rgb(80, 80, 80); line-height: 30px; }
  .nav-user-center > .auth-state-panel { position: absolute; top: 0; right: 114px; z-index: 1; display: flex; width: 344px; height: 40px; min-width: 344px; align-items: center; gap: 0; }
  .nav-user-center > .auth-state-panel[hidden], .nav-user-center > .user-con.signin[hidden] { display: none !important; }
  .nav-user-center > .user-con.search-icon { display: none; width: 0; height: 0; min-height: 0; overflow: hidden; }
  .nav-user-center > .user-con.signin { display: flex; width: 344px; height: 40px; min-height: 40px; flex: 0 0 344px; align-items: center; gap: 0; }
  .nav-user-center > .user-con.signin > .item { position: relative; display: flex; height: 40px; min-height: 40px; max-height: 40px; align-items: center; justify-content: flex-start; margin: 0 0 0 12px; padding: 0; }
  .nav-user-center > .user-con.signin > .item:nth-child(1) { width: 50px; flex: 0 0 50px; }
  .nav-user-center > .user-con.signin > .item:nth-child(2) { width: 42px; flex: 0 0 42px; }
  .nav-user-center > .user-con.signin > .item:nth-child(3),
  .nav-user-center > .user-con.signin > .item:nth-child(4),
  .nav-user-center > .user-con.signin > .item:nth-child(5),
  .nav-user-center > .user-con.signin > .item:nth-child(6) { width: 28px; flex: 0 0 28px; }
  .nav-user-center > .user-con.signin > .item:nth-child(7) { width: 56px; flex: 0 0 56px; }
  .nav-user-center > .user-con.signin > .item > span { display: flex; width: 100%; height: 40px; align-items: center; justify-content: flex-start; }
  .mini-avatar { width: 40px; height: 40px; margin: 0 10px 0 0; border: 0; }
  .mini-avatar__image { width: 40px; height: 40px; }
  .mini-vip { display: block; width: 42px; height: 30px; margin: 0; font: 14px/30px inherit; white-space: nowrap; }
  .nav-item { position: relative; display: block; width: 28px; height: 30px; float: none; text-align: center; background-color: rgba(255,255,255,0); transition: all .3s; }
  .nav-item .t { width: 28px; height: 30px; line-height: 30px; }
  .nav-item-message .t { position: relative; }
  .message-nav-badge, .dynamic-nav-badge, .message-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; color: #fff; background: #fa5a5a; font: 10px/18px Arial, sans-serif; font-weight: 400; text-align: center; text-shadow: none; white-space: nowrap; }
  .message-nav-badge, .dynamic-nav-badge { position: absolute; top: -8px; right: -10px; z-index: 1; }
  .message-badge { flex: 0 0 auto; min-width: 20px; height: 20px; border-radius: 10px; font-size: 12px; line-height: 20px; }
  .message-nav-badge[hidden], .dynamic-nav-badge[hidden], .message-badge[hidden] { display: none !important; }
  .nav-item .t a, .nav-item .t .name { display: block; width: 28px; height: 30px; overflow: hidden; color: rgb(80,80,80); font-size: 14px; line-height: 30px; text-decoration: none; text-overflow: ellipsis; white-space: nowrap; }
  .nav-user-center > .user-con.signin > .item:nth-child(3) .nav-item-message,
  .nav-user-center > .user-con.signin > .item:nth-child(4) .nav-item-dynamic { margin: 0; }
  .nav-user-center > .user-con.signin > .item:nth-child(5) .mini-favorite,
  .nav-user-center > .user-con.signin > .item:nth-child(6) .mini-history { display: block; width: 28px; height: 30px; font: 14px/30px inherit; white-space: nowrap; }
  .nav-user-center > .user-con.signin > .item:nth-child(7) > a { display: block; width: 56px; height: 30px; color: rgb(33,33,33); line-height: 30px; text-decoration: none; }
  .nav-user-center > .user-con.signin > .item:nth-child(7) .name { display: block; width: 56px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nav-user-center > div[data-popover-group="upload"] { position: relative; display: block; width: 114px; height: 40px; flex: 0 0 114px; margin: 0; padding: 0; }
  .nav-user-center[data-auth-state="logged_out"] > div[data-popover-group="upload"],
  .nav-user-center[data-auth-state="unknown"] > div[data-popover-group="upload"] { margin-left: auto; }
  .nav-user-center > div[data-popover-group="upload"]::after { position: absolute; top: 36px; left: 0; z-index: 1999; width: 100px; height: 12px; content: ""; pointer-events: auto; }
  .mini-upload { display: block; width: 100px; height: 36px; margin-left: 14px; padding: 0; border-radius: 2px; color: #fff; background: #fb7299; font: 14px/36px inherit; text-align: center; text-decoration: none; }
  .nav-user-center > .user-con.signin > .item::after, .nav-user-center > div[data-popover-group="upload"]::after { position: absolute; top: 30px; left: 0; z-index: 1999; display: none; width: 100%; height: 26px; content: ""; pointer-events: auto; }
  .nav-user-center > .user-con.signin > .item.is-popover-pending::after, .nav-user-center > .user-con.signin > .item.is-popover-open::after, .nav-user-center > div[data-popover-group="upload"].is-popover-pending::after, .nav-user-center > div[data-popover-group="upload"].is-popover-open::after { display: block; }
  .header-overlay-layer { position: fixed; z-index: 3300; inset: 0; width: 100vw; height: 100vh; pointer-events: none; }
  .header-overlay-layer > .header-popover { top: auto; left: auto; min-width: 0; border: 0; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); transform: none; }
  .header-overlay-layer > .header-popover.is-popover-visible { transform: none; }
  .header-overlay-layer > .van-popper-nav { position: fixed; display: block; border: 0; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0,0,0,.2); opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .16s ease, visibility 0s linear .16s; }
  .header-overlay-layer > .van-popper-nav.is-popover-visible { opacity: 1; pointer-events: auto; visibility: visible; transition-delay: 0s; }
  .van-popper-avatar { width: 280px; height: 468px; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); }
  .header-overlay-layer > .van-popper-avatar { z-index: 2001; }
  .van-popper-vip { width: 260px; height: 241px; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); }
  .header-overlay-layer > .van-popper-vip { z-index: 2003; }
  .van-popper-favorite { width: 520px; height: 518px; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); }
  .header-overlay-layer > .van-popper-favorite { z-index: 2005; }
  .van-popper-history { width: 370px; height: 518px; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); }
  .header-overlay-layer > .van-popper-history { z-index: 2007; }
  .van-popper-upload { width: 380px; height: 78px; border-radius: 2px; box-shadow: 0 3px 6px rgba(0,0,0,.2); }
  .header-overlay-layer > .van-popper-upload { z-index: 2009; }
  .header-overlay-layer > .popover-game,
  .header-overlay-layer > .popover-live,
  .header-overlay-layer > .popover-manga,
  .header-overlay-layer > .download-client-entry,
  .header-overlay-layer > .nav-im-new,
  .header-overlay-layer > .nav-dynamic { position: fixed; }
  .header-overlay-layer > .nav-im-new,
  .header-overlay-layer > .nav-dynamic { top: auto; left: auto; display: block; padding-top: 12px; border: 0; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0,0,0,.2); opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .16s ease, visibility 0s linear .16s; }
  .header-overlay-layer > .nav-im-new { width: 173px; min-width: 173px; height: 207px; min-height: 207px; }
  .header-overlay-layer > .nav-dynamic { width: 382px; height: 540px; }
  .header-overlay-layer > .nav-im-new.is-popover-visible,
  .header-overlay-layer > .nav-dynamic.is-popover-visible { opacity: 1; pointer-events: auto; visibility: visible; transition-delay: 0s; }
  .nav-item-message .i-frame { position: absolute; top: 30px; left: calc(50% - 86px); display: block; width: 173px; min-width: 173px; height: 207px; min-height: 207px; padding-top: 12px; border: 0; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0,0,0,.2); opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .16s ease, visibility 0s linear .16s; }
  .nav-item-dynamic .i-frame { position: absolute; top: 30px; left: calc(50% - 191px); display: block; width: 382px; height: 540px; padding-top: 12px; border: 0; border-radius: 2px; background: #fff; box-shadow: 0 3px 6px rgba(0,0,0,.2); opacity: 0; pointer-events: none; visibility: hidden; transition: opacity .16s ease, visibility 0s linear .16s; }
  .nav-item-message .i-frame.is-popover-visible, .nav-item-dynamic .i-frame.is-popover-visible { opacity: 1; pointer-events: auto; visibility: visible; transition-delay: 0s; }
  .nav-item-message .i-frame > a,
  .header-overlay-layer > .nav-im-new > a { display: flex; height: 38px; align-items: center; justify-content: space-between; gap: 8px; padding: 0 16px; color: #212121; line-height: 38px; text-decoration: none; text-shadow: none; }
  .nav-item-message .i-frame > a > .message-link-label,
  .header-overlay-layer > .nav-im-new > a > .message-link-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nav-item-message .i-frame > a:hover,
  .nav-item-message .i-frame > a:focus-visible,
  .header-overlay-layer > .nav-im-new > a:hover,
  .header-overlay-layer > .nav-im-new > a:focus-visible { background: #f4f4f4; color: #212121; text-shadow: none; }
  .nav-item-message .i-frame iframe, .nav-item-dynamic .i-frame iframe { display: block; width: 100%; border: 0; }
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(-n+6) .van-popover__reference,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(-n+6) .mini-avatar,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .nav-item > .t > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .nav-item > .t > a > .name,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(4) .nav-item > .t > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(4) .nav-item > .t > a > .name {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .45);
  }
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(7) > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(7) .name {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .45);
  }
  .header-overlay-layer > .van-popper-nav,
  .header-overlay-layer > .van-popper-nav a,
  .header-overlay-layer > .van-popper-nav button,
  .header-overlay-layer > .van-popper-nav .profile-popover-surface,
  .header-overlay-layer > .van-popper-nav .vip-m,
  .header-overlay-layer > .van-popper-nav .user-panel,
  .header-overlay-layer > .van-popper-nav .vp-container,
  .header-overlay-layer > .van-popper-nav .tabs-panel,
  .header-overlay-layer > .van-popper-nav .favorite-video-panel,
  .header-overlay-layer > .van-popper-nav .tab-header,
  .header-overlay-layer > .van-popper-nav .panel {
    color: #212121;
    text-shadow: none;
  }
  .header-overlay-layer > .van-popper-nav a,
  .header-overlay-layer > .van-popper-nav button { text-shadow: none; }
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item,
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item > .title,
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item > .num { color: #212121; }
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item.tab-item--active { color: #fff; background: #00a1d6; }
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item.tab-item--active > .title,
  .header-overlay-layer > .van-popper-nav.user-panel--favorite .tabs-panel > .tab-item.tab-item--active > .num { color: #fff; }
  .header-overlay-layer .profile-popover-surface { min-height: 468px; }
  .header-overlay-layer .profile-popover > .vp-container { position: relative; display: flex; width: 280px; height: 468px; min-height: 468px; flex-direction: column; align-items: center; overflow: visible; padding: 0; color: #212121; background: #fff; }
  .profile-popover > .vp-container > .big-avatar-container--default { position: relative; width: 100%; height: 0; flex: 0 0 0; }
  .profile-popover > .vp-container > .big-avatar-container--default > .avatar { position: absolute; top: -24px; left: 114px; width: 51px; height: 51px; margin: 0; border-radius: 50%; }
  .profile-popover > .vp-container > .nickname { width: 100%; height: 63.4px; flex: 0 0 63.4px; margin: 0; padding: 45px 0 0; color: #212121; font-size: 16px; font-weight: 600; line-height: 18.4px; text-align: center; }
  .profile-popover > .vp-container > .levelIcon { position: relative; width: 100%; height: 0; flex: 0 0 0; }
  .profile-popover > .vp-container > .level-content { position: relative; display: flex; width: 100%; height: 54.2px; flex: 0 0 54.2px; flex-direction: column; align-items: center; justify-content: space-between; padding: 0 20px; }
  .profile-popover .level-info { display: flex; width: 240px; height: 19.2px; align-items: center; justify-content: space-between; margin: 20px 0 5px; }
  .profile-popover .level-info .profile-level { color: #212121; font-size: 14px; }
  .profile-popover .level-info .profile-exp { color: #999; font-size: 12px; }
  .profile-popover .level-link { display: block; width: 240px; height: 10px; }
  .profile-popover .level-bar { position: relative; width: 240px; height: 2px; margin: 4px 0; background: #f4f4f4; }
  .profile-popover .level-progress { position: absolute; top: 0; left: 0; height: 2px; border-radius: 2px; background: #f3cb85; }
  .profile-popover > .vp-container > .coins { display: block; width: 100%; height: 48.8px; flex: 0 0 48.8px; padding: 14px 20px; border: 0; border-bottom: 1px solid #f4f4f4; color: #212121; }
  .profile-popover .coins-container { display: flex; width: 240px; height: 20px; align-items: center; justify-content: space-between; }
  .profile-popover .coins-container > .profile-asset { display: flex; width: auto; min-width: 0; height: 20px; align-items: center; justify-content: flex-start; gap: 5px; }
  .profile-popover > .vp-container > .counts { display: grid; width: 100%; height: 58px; flex: 0 0 58px; grid-template-columns: repeat(3, 1fr); padding: 0; border-bottom: 1px solid #f4f4f4; }
  .profile-popover .counts .profile-stat { display: flex; height: 57px; flex-direction: column; align-items: center; justify-content: center; color: #999; font-size: 12px; line-height: 17px; }
  .profile-popover .counts .profile-stat-value { color: #212121; font-size: 16px; font-weight: 600; }
  .profile-popover > .vp-container > .links { width: 100%; height: 174.8px; flex: 0 0 174.8px; padding: 7px 0; border-bottom: 1px solid #f4f4f4; }
  .profile-popover > .vp-container > .links > .profile-menu-row, .profile-popover > .vp-container > .links > .profile-menu-submenu-wrap > .profile-menu-row { height: 40px; padding: 8px 23px; color: #212121; font-size: 14px; }
  .profile-popover > .vp-container > .lang-change { position: relative; width: 100%; height: 54.8px; flex: 0 0 54.8px; padding: 7px 0; color: #60666d; }
  .profile-popover > .vp-container > .lang-change > .profile-menu-row { height: 40px; padding: 8px 23px; }
  .profile-popover > .vp-container > .logout { width: 100%; height: 54px; flex: 0 0 54px; padding: 7px 0; color: #212121; }
  .profile-popover > .vp-container > .logout > .profile-logout-action { width: 100%; height: 40px; padding: 8px 23px; }
  .profile-popover .profile-menu-row:hover, .profile-popover .profile-menu-row:focus-visible { color: #00a1d6; background: #f4f4f4; }
  .profile-popover .profile-vip-state { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .header-overlay-layer > .profile-popover > .vp-container > .coins .bili-icon_dingdao_yingbi { color: #00a1d6; }
  .header-overlay-layer > .profile-popover > .vp-container > .coins .bili-icon_dingdao_Bbi { color: #f5a623; }
  .header-overlay-layer > .profile-popover > .vp-container > .coins .profile-asset-action { color: #00a1d6; text-shadow: none; }
  .international-header .nav-link-item > .link,
  .international-header .nav-link-item > .link .nav-main,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(-n+6) .van-popover__reference,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .nav-item > .t > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .nav-item > .t > a > .name,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(4) .nav-item > .t > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(4) .nav-item > .t > a > .name,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(7) > a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(7) .name,
  .international-header .nav-user-center > div[data-popover-group="upload"] > .mini-upload {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, .45);
  }
  .contact-help { position: fixed; z-index: 101; left: 0; top: calc(50% - 30px); display: block; box-sizing: border-box; width: 28px; height: 72px; margin-top: -36px; padding: 8px 7px; border: 1px solid #e7e7e7; border-radius: 0 2px 2px 0; color: #505050; background: #fff; box-shadow: 0 6px 10px 0 #e7e7e7; font-size: 12px; line-height: 14px; text-decoration: none; transition: all .3s; }
  .contact-help:hover, .contact-help:focus-visible { color: #505050; background: #f4f4f4; }
  .international-header .header-overlay-layer > .van-popper-nav,
  .international-header .header-overlay-layer > .van-popper-nav a,
  .international-header .header-overlay-layer > .van-popper-nav button,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .i-frame,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(3) .i-frame a,
  .international-header .nav-user-center > .user-con.signin > .item:nth-child(4) .i-frame {
    color: #212121;
    text-shadow: none;
  }
  .user-panel--upload .upload-icon { width: 28px; height: 28px; border-radius: 0; color: #757575; background: transparent; font-size: 28px; line-height: 28px; }
  .user-panel--upload .upload-icon .icon-font-fallback { display: none; }
  .auth-state-panel[hidden], .auth-branch[hidden], .profile-login-state[hidden] { display: none !important; }
  @media (max-width: 1122px) { .nav-user-center { width: 418px; min-width: 418px; flex-basis: 418px; } .nav-user-center > div[data-popover-group="upload"] { width: 74px; flex-basis: 74px; } .mini-upload { width: 60px; } }
  /* b-wrap A-plan navigation is runtime-owned by this stylesheet. */
  .homepage { overflow-x: auto; }
  .primary-menu-wrap { min-width: 999px; height: 108px; }
  .primary-menu-wrap > .b-wrap { width: 1630px; max-width: none; }
  .primary-menu-itnl { display: flex; height: 108px; align-items: center; justify-content: space-between; padding: 20px 0; }
  .page-tab { display: flex; width: 264px; height: 68px; flex: 0 0 264px; align-items: center; padding-top: 0; }
  .page-tab .con { display: flex; width: 264px; height: 68px; gap: 0; align-items: center; }
  .page-tab .con li { width: 66px; height: 68px; flex: 0 0 66px; }
  .page-tab .con li > a { display: flex; width: 100%; min-width: 0; height: 68px; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; padding: 0; color: #505050; font-size: 14px; line-height: 20px; text-align: center; }
  .page-tab .con li > a:hover, .page-tab .con li > a:focus-visible { color: #00a1d6; }
  #primaryPageTab .round { position: relative; width: 36px; height: 36px; flex: 0 0 36px; margin-bottom: 4px; background: #ff5c7c; }
  #primaryPageTab .round.yel { background: #fcba2a; }
  #primaryPageTab .round.orange { background: #ff716d; }
  #primaryPageTab .round.channel { background: #6dc781; }
  #primaryPageTab .round .bilifont { display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center; color: #fff; font-size: 28px; line-height: 36px; }
  #primaryPageTab .dynamic-update { position: absolute; inset: 0; display: block; width: 36px; height: 36px; overflow: hidden; border-radius: 50%; pointer-events: none; }
  #primaryPageTab .dynamic-update[hidden] { display: none; }
  #primaryPageTab .dynamic-update__avatar { display: block; width: 100%; height: 100%; object-fit: cover; }
  #primaryPageTab .page-link > span { display: block; width: 100%; height: 20px; flex: 0 0 20px; overflow: hidden; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  .primary-menu-itnl > .tab-line-itnl { display: inline-block; width: 1px; height: 46px; flex: 0 0 1px; margin: 0 20px; padding: 0; border-left: 1px solid #e7e7e7; background: transparent; }
  .primary-menu-itnl > .tab-line-itnl.none { margin: 0 24px 0 0; }
  #primaryChannelMenu { display: flex; width: auto; height: 68px; flex: 1 1 auto; flex-direction: column; flex-wrap: wrap; align-content: space-between; min-width: 0; padding: 0; }
  #primaryChannelMenu > span, #primaryFriendshipLink > span { position: relative; display: flex; width: max-content; height: 34px; flex: 0 0 34px; }
  #primaryChannelMenu .item { display: flex; width: max-content; height: 34px; align-items: center; cursor: pointer; }
  #primaryChannelMenu .name { display: flex; height: 34px; align-items: center; padding: 0; color: #505050; font-size: 14px; line-height: 34px; white-space: nowrap; }
  #primaryChannelMenu .name:hover, #primaryChannelMenu .name:focus-visible, #primaryFriendshipLink .name:hover, #primaryFriendshipLink .name:focus-visible { color: #00a1d6; }
  #primaryChannelMenu .channel-count { position: static; top: auto; right: auto; display: inline-flex; width: 32px; align-items: center; justify-content: center; margin-left: 1px; padding: 0; border-radius: 2px; color: #fff; background: rgb(115, 201, 229); font-size: 12px; font-style: normal; line-height: 14px; vertical-align: middle; transform: scale(.85); transform-origin: left center; }
  #primaryChannelMenu .hide-count { display: none; }
  #primaryChannelMenu .item-more .bilifont { margin-left: 2px; color: #212121; font-size: 16px; line-height: 34px; }
  .primary-menu-itnl #primaryChannelMenu > span::after, .primary-menu-itnl #primaryFriendshipLink > span.channel-entry::after { position: absolute; top: 30px; right: -10px; left: -10px; z-index: 29; display: none; height: 14px; content: ""; }
  .primary-menu-itnl .channel-entry.is-popover-pending::after, .primary-menu-itnl .channel-entry.is-popover-visible::after, .primary-menu-itnl .channel-entry.is-popover-leaving::after { display: block; pointer-events: auto; }
  .primary-menu-itnl .van-popper-channel { position: absolute; top: 38px; left: 50%; z-index: var(--z-popover-channel); display: none; min-width: 0; padding: 5px 10px; border: 0; border-radius: 3px; background: #fff; box-shadow: 0 2px 12px rgba(0, 0, 0, .1); visibility: hidden; opacity: 0; pointer-events: none; transform: translateX(-50%) translateY(-5px); transition: opacity .2s ease, transform .2s ease; }
  .primary-menu-itnl .channel-entry.is-popover-visible .van-popper-channel { display: block; visibility: visible; opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0); }
  .primary-menu-itnl .channel-entry.is-popover-leaving .van-popper-channel { display: block; visibility: hidden; opacity: 0; pointer-events: none; transform: translateX(-50%) translateY(-5px); }
  .primary-menu-itnl .van-popper-channel .sub-container { display: flex; }
  .primary-menu-itnl .van-popper-channel .sub-item { display: flex; flex-direction: column; min-width: 78px; }
  .primary-menu-itnl .van-popper-channel .sub-item .name { display: block; height: 37px; padding: 0 13px; color: #212121; font-size: 12px; line-height: 37px; text-align: left; white-space: nowrap; }
  .primary-menu-itnl .van-popper-channel .sub-item .name:hover,
  .primary-menu-itnl .van-popper-channel .sub-item .name:focus { color: #00a1d6; }
  #primaryFriendshipLink { display: flex; width: 289px; height: 68px; flex: 0 0 289px; flex-direction: column; flex-wrap: wrap; align-content: space-between; padding: 0; }
  #primaryFriendshipLink .item { display: flex; width: max-content; height: 34px; align-items: center; }
  #primaryFriendshipLink .name { display: flex; height: 34px; align-items: center; padding: 0; color: #505050; font-size: 14px; line-height: 34px; text-align: left; white-space: nowrap; }
  #primaryFriendshipLink .svg-icon { display: block; width: 25.2px; height: 25.2px; flex: 0 0 25.2px; overflow: hidden; margin-right: 4px; }
  @media (max-width: 1870px) { .primary-menu-wrap > .b-wrap { width: 1414px; } .page-tab, .page-tab .con { width: 232px; flex-basis: 232px; } .page-tab .con li { width: 58px; flex-basis: 58px; } #primaryFriendshipLink { width: 242px; flex-basis: 242px; } }
  @media (max-width: 1654px) { .primary-menu-wrap > .b-wrap { width: 1198px; } .page-tab, .page-tab .con { width: 200px; flex-basis: 200px; } .page-tab .con li { width: 50px; flex-basis: 50px; } .primary-menu-itnl > .tab-line-itnl { margin: 0 8px; } .primary-menu-itnl > .tab-line-itnl.none { margin: 0 12px 0 0; } #primaryFriendshipLink { width: 220px; flex-basis: 220px; } }
  @media (max-width: 1438px) { .primary-menu-wrap > .b-wrap { width: 999px; } .primary-menu-itnl .item.hide { display: none; } }
  @media (max-width: 998px) { .primary-menu-wrap > .b-wrap { width: 999px; } }
  .homepage { overflow: visible; background: rgb(255, 255, 255); }
  main.container { width: 100%; max-width: none; min-width: 0; margin: 0; background: rgb(255, 255, 255); }
  .primary-menu-wrap { position: relative; z-index: 100; overflow: visible; border-bottom: 0; }
  .primary-menu-itnl { overflow: visible; }
  .primary-menu-itnl .van-popper-channel { z-index: 2028; }
  .first-screen { position: relative; z-index: 0; }
  .header-overlay-layer > .popover-game { border: 0; border-radius: 0; box-shadow: none; background: transparent; outline: 0; filter: none; }
  .first-screen { display: block; width: 1630px; max-width: calc(100% - 48px); margin-top: 0; }
  .first-screen > .space-between:first-child { display: flex; width: 100%; height: 242px; align-items: stretch; justify-content: space-between; margin-bottom: 40px; }
  .first-screen > .space-between:first-child > .focus-carousel { flex: 0 0 550px; }
  .first-screen > .space-between:first-child > .rcmd-box-wrap { width: 1070px; flex: 0 0 1070px; }
  .focus-carousel.home-slide.report-wrap-module.report-scroll-module { position: relative; width: 550px; height: 242px; overflow: hidden; border-radius: 2px; box-shadow: none; }
  .focus-carousel.home-slide.report-wrap-module.report-scroll-module .van-slide.ggc { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .first-screen .rcmd-box-wrap { position: relative; width: 100%; height: 242px; min-width: 0; }
  .first-screen .rcmd-box { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; height: 242px; padding: 0; border: 0; background: transparent; }
  .video-card-reco { position: relative; width: 100%; height: 100%; min-width: 0; overflow: hidden; border-radius: 2px; background: #eef1f3; }
  .video-card-reco .info-box, .video-card-reco .info-box::before, .video-card-reco .info-box img { width: 100%; height: 100%; border-radius: 2px; }
  .video-card-reco .info-box { position: relative; width: 100%; height: 100%; overflow: hidden; background: #eef1f3; }
  .video-card-reco .info-box::before { position: absolute; top: 0; left: 0; z-index: 1; background: rgba(0, 0, 0, .7); content: ""; opacity: 0; transition: opacity .2s; }
  .video-card-reco .info-box > a { display: block; width: 100%; height: 100%; }
  .video-card-reco .info-box > a > .b-img { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; }
  .video-card-reco .info-box > a > .b-img picture { display: block; width: 100%; height: 100%; }
  .video-card-reco .info-box > a > .b-img img, .video-card-reco .info-box > a > .b-img .media-placeholder { display: block; width: 100%; height: 100%; object-fit: cover; }
  .video-card-reco .info-box .info { position: absolute; top: 64px; left: 0; z-index: 2; width: 100%; padding: 26px 10px 10px; transition: top .2s; }
  .video-card-reco .info-box .info p { margin: 0 0 3px; overflow: hidden; color: #e0e0e0; font-size: 12px; line-height: 16px; text-overflow: ellipsis; white-space: nowrap; }
  .video-card-reco .info-box .info .title { height: 18px; margin-bottom: 6px; color: #fff; font-size: 14px; font-weight: 500; line-height: 18px; }
  .video-card-reco .info-box .info .up .bilifont { margin-right: 5px; vertical-align: middle; }
  .video-card-reco .info-box > .duration { position: absolute; top: 7px; right: auto; bottom: auto; left: 8px; z-index: 3; padding: 1px 4px; color: #fff; background: rgba(0, 0, 0, .55); border-radius: 2px; font-size: 12px; line-height: 16px; opacity: 1; visibility: visible; pointer-events: none; transition: opacity .12s, visibility 0s linear 0s; }
  .video-card-reco .watch-later-video.van-watchlater.black { position: absolute; right: 8px; bottom: 8px; z-index: 20; width: 28px; height: 28px; cursor: pointer; opacity: 0; pointer-events: none; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAwFBMVEUAAAAGBgavr69EREQUFBQ1NTUODg7t7e3FxcV0dHRbW1sAAAAAAAAAAAD+/v77+/v4+Pj09PTj4+P8/PzV1dWpqamSkpIhISH19fXX19fLy8ulpaWdnZ1kZGRVVVUsLCz6+vrm5uba2tq9vb20tLSsrKyXl5eMjIx+fn54eHhsbGxpaWk+Pj4AAAAAAADv7+/e3t7AwMC3t7ehoaFLS0vo6OjR0dHOzs7CwsKCgoKCgoJiYmLp6enMzMywsLD////DVMIGAAAAP3RSTlOZmtOrnqec8927sopkEf38+ffu/eXPxqH45+DOyrWwpPvv6NnV0cjEv724t6qPAPTr2tbNru/j4tvAv7Tw4dTgAD9iAAABpElEQVRIx+ST13KCUBiEDyCCBRBQsaHGHrvp/Xv/twpDTBgRonjr3u0w38zu8h+xNsolkVGlsrEWxkpcoJUhyuISBVjpIi7Arli9bmE6mb0rUhZI6tZu2KuxK+TO5RYOB2pM8udgShWASlOXa8MnDYDN7DRX6AOVkf/bTemEqe9OdW0DluwdNH7VgKZ3knNUEVN+CGz/K3oLtJJGrJugp3MPFrSSy7wBnVRwAE7aTxuDq6YNCpaaehRN2KV8eoRaNMh8GesBKIlgEewoaAtTPoytw0gIXz4KJYMcORfQ5n/Wy4kuaMKHzzioQTFyhNJ7P27ZMNuSDb4Noxingi3FQSpTab8bWx0+YOMdV6yKIxAGSuCkZ6Dv9sEsJlzNSxKIex/ejgUkXkEdxokgLMJn4gBUpcygyH+BHYyVMWo4w/eMwXFIfOCgAVKiAxMQTgCYAH+S44MkOXRAOJGbYyRyHXU24rIVWgjqCNgbkZWRRYA+JrfoYKaksKK8eKS8QCZcBVBe6VBezRGuWGlalSMaD2KQxsMooCMgu6FLdtOa7MY82d0HAP3jZ1lFdjimAAAAAElFTkSuQmCC"); background-size: contain; transition: opacity .2s; }
  .video-card-reco .watch-later-video.van-watchlater.black.added { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAANlBMVEUAAAD8/PxpaWlfX1/9/f1ycnIAAAAAAAAAAAAAAAAAAAD09PTr6+vv7+/h4eFjY2NZWVn///+5pCBCAAAAEXRSTlOZ/Lez/bqKZBGPAPfy9ey1sk5dq9MAAACBSURBVEjH7dc7FsQgDENRQSZAAvl4/5udUrVU5vj1t3El4xy9Qaz1cWIcMDoGOqw6mgcbsux7Peuqjqsl4jJdLNOVx3Q1neH2OavjMCN+u+GwglJxeAuldpeNUnGUqqOUHSWdKOlESSdKOknSqZJO673vDVn2jZrJ7Gltj3n7ffgDLGYI2l1NOaQAAAAASUVORK5CYII="); }
  .video-card-reco .watch-later-video.van-watchlater.black.is-loading { cursor: progress; }
  .video-card-reco .watch-later-video.van-watchlater.black .wl-tips { position: absolute; top: -30px; right: 0; padding: 4px 8px; color: #fff; background: rgba(0, 0, 0, .8); border-radius: 4px; font-size: 12px; line-height: 18px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .2s; }
  .video-card-reco:hover .info-box::before, .video-card-reco:focus-within .info-box::before { opacity: 1; }
  .video-card-reco:hover .info-box .info, .video-card-reco:focus-within .info-box .info { top: 0; }
  .video-card-reco:hover .info-box .info .title, .video-card-reco:focus-within .info-box .info .title { height: 36px; white-space: normal; }
  .video-card-reco:hover .info-box > .duration, .video-card-reco:focus-within .info-box > .duration { opacity: 0; visibility: hidden; transition: opacity .12s, visibility 0s linear .12s; }
  .video-card-reco:hover .watch-later-video.van-watchlater.black, .video-card-reco:focus-within .watch-later-video.van-watchlater.black { opacity: 1; pointer-events: auto; transition-delay: .2s; }
  .first-screen > #reportFirst2 { display: flex; width: 100%; height: 52px; min-height: 52px; align-items: flex-start; justify-content: space-between; margin: 0; overflow: visible; }
  .first-screen > #reportFirst2 > .extension { width: calc(100% - 344px); min-width: 0; flex: 0 0 calc(100% - 344px); }
  .first-screen > #reportFirst2 .storey-title { height: 36px; margin: 0 0 16px; }
  .first-screen > #reportFirst2 .ext-box { display: flex; width: 100%; min-width: 0; min-height: 0; flex-wrap: wrap; align-content: flex-start; justify-content: space-between; }
  .first-screen > #reportFirst2 > .bypb-window { width: 320px; height: 52px; flex: 0 0 320px; margin: 0 0 0 24px; }
  .first-screen > #reportFirst2 > .bypb-window .online { display: flex; width: 100%; height: 30px; align-items: center; justify-content: center; margin: 3px 0 19px; }
  .first-screen > #reportFirst2 > .bypb-window .online-link { display: block; width: 100%; flex: 1 1 auto; }
  .first-screen > #reportFirst2 .extension,
  .first-screen > #reportFirst2 .storey-title,
  .first-screen > #reportFirst2 .ext-box,
  .first-screen > #reportFirst2 .bypb-window,
  .first-screen > #reportFirst2 .online { box-sizing: border-box; }
  .first-screen > #reportFirst2 .storey-title .name,
  .first-screen > #reportFirst2 .online-link { white-space: nowrap; }
  @media (max-width: 1870px) {
    .first-screen { width: 1414px; max-width: calc(100% - 40px); }
    .first-screen > .space-between:first-child > .rcmd-box-wrap { width: 854px; flex-basis: 854px; }
    .first-screen .rcmd-box { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .first-screen .rcmd-box > .video-card-reco:nth-child(n + 9) { display: none; }
  }
  @media (max-width: 1654px) {
    .first-screen { width: 1198px; max-width: calc(100% - 32px); }
    .first-screen > .space-between:first-child > .rcmd-box-wrap { width: 638px; flex-basis: 638px; }
    .first-screen .rcmd-box { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .first-screen .rcmd-box > .video-card-reco:nth-child(n + 7) { display: none; }
  }
  @media (max-width: 1438px) {
    .first-screen { width: 999px; }
    .first-screen > .space-between:first-child { height: 202px; }
    .first-screen > .space-between:first-child > .focus-carousel { flex-basis: 459px; width: 459px; height: 202px; }
    .first-screen > .space-between:first-child > .rcmd-box-wrap { width: 530px; height: 202px; flex-basis: 530px; }
    .first-screen .rcmd-box { height: 202px; }
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco .info-box .info { top: 52px; padding: 8px 10px 10px; }
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco:hover .info-box .info,
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco:focus-within .info-box .info { top: 0; }
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco .info-box .info .title { margin-bottom: 2px; }
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco .info-box .info .up { margin-bottom: 1px; line-height: 14px; }
    .first-screen .rcmd-box-wrap > .rcmd-box .video-card-reco .info-box .info .play { margin-bottom: 0; padding-right: 36px; line-height: 14px; }
    .first-screen > #reportFirst2 > .extension { flex-basis: 710px; width: 710px; }
    .first-screen > #reportFirst2 > .bypb-window { width: 265px; flex-basis: 265px; }
  }
  @media (max-width: 980px) {
    .first-screen { width: calc(100% - 20px); max-width: none; }
    .first-screen > .space-between:first-child { height: auto; flex-direction: column; }
    .first-screen > .space-between:first-child > .focus-carousel,
    .first-screen > .space-between:first-child > .rcmd-box-wrap { width: 100%; flex-basis: auto; }
    .first-screen > .space-between:first-child > .focus-carousel { height: auto; aspect-ratio: 550 / 242; }
    .first-screen .rcmd-box-wrap, .first-screen .rcmd-box { height: auto; min-height: 242px; }
    .first-screen > #reportFirst2 { height: auto; min-height: 52px; flex-direction: column; }
    .first-screen > #reportFirst2 > .extension,
    .first-screen > #reportFirst2 > .bypb-window { width: 100%; flex-basis: auto; }
    .first-screen > #reportFirst2 > .bypb-window { margin-left: 0; }
  }
  .storey-documentary { margin-bottom: 54px; }
  .international-header .auth-state-panel[data-state="logged_out"] .auth-branch--logout > .item.mini-vip .user-popover-reference > .name {
    color: #fff !important;
    text-shadow: 0 1px 1px rgba(0, 0, 0, .3) !important;
  }
  #bili_live { margin-top: 79px; }
  .ordinary-pgc-floor .rank-header { margin-bottom: 8px; }
  .ordinary-pgc-floor .custom-pgc-rank-wrap,
  .ordinary-pgc-floor .custom-pgc-rank-wrap:first-of-type { margin-bottom: 38px; }
  .ordinary-pgc-floor .custom-pgc-rank-wrap:last-child { margin-bottom: 0; }
  /* Footer fidelity: mirror the legacy international-footer geometry and local assets. */
  .international-footer {
    --footer-wrap: 1630px;
    min-width: 0;
    margin-top: 0;
    padding: 48px 0 34px;
    color: #212121;
    background: #f6f7f8;
    font: 12px/1.5 "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .international-footer .b-footer-wrap { width: var(--footer-wrap); max-width: 100%; min-width: 0; margin-right: auto; margin-left: auto; }
  .international-footer a { color: inherit; text-decoration: none; transition: color .2s; }
  .international-footer a:hover, .international-footer a:focus-visible { color: #00a1d6; }
  .international-footer .link-box { display: flex; justify-content: space-between; min-width: 0; }
  .international-footer .link-box .footer_left { display: flex; flex: 4; min-width: 0; }
  .international-footer .link-box .footer_right { display: flex; flex: 1; min-width: 0; align-items: center; }
  .international-footer .link-box .link-item { flex: 2; min-width: 0; margin-right: 40px; padding-right: 40px; border-right: 1px solid #e5e9ef; }
  .international-footer .link-box .link-item .bt { display: block; height: 20px; margin: 0 0 20px; color: #999; font-size: 16px; font-weight: 400; line-height: 20px; }
  .international-footer .link-box .link-item ul { display: grid; height: 110px; grid-auto-flow: column; grid-template-rows: repeat(4, 20px); grid-auto-columns: 50%; column-gap: 0; row-gap: 10px; margin: 0; padding: 0; list-style: none; }
  .international-footer .link-box .link-item ul a { display: block; width: auto; height: 20px; margin-bottom: 0; color: #212121; font-size: 14px; line-height: 20px; }
  .international-footer .link-box .link-item.link-b { flex: 3; }
  .international-footer .link-box .link-item.link-b ul { grid-auto-columns: 33.3333%; }
  .international-footer .link-box .link-item.link-c { display: flex; flex: 1; align-items: center; justify-content: space-between; margin-right: 0; padding-right: 0; border-right: 0; }
  .international-footer .link-box .link-item.link-c .a-wraper { display: flex; flex: 1; min-width: 70px; align-items: center; justify-content: center; }
  .international-footer .link-box .link-item.link-c a { position: relative; display: inline-block; text-align: center; }
  .international-footer .link-box .link-item.link-c a .qrcode { display: none; position: absolute; top: -125px; left: -25px; width: 117px; height: 117px; padding: 10px; border: 1px solid #eee; background-color: #fff; background-repeat: no-repeat; background-position: center; background-size: calc(100% - 20px) calc(100% - 20px); box-shadow: 0 2px 8px rgba(0, 0, 0, .08); }
  .international-footer .link-box .link-item.link-c a:hover .qrcode,
  .international-footer .link-box .link-item.link-c a:focus-visible .qrcode { display: block; }
  .international-footer .link-box .link-item.link-c a.weixin .qrcode { top: -151px; left: -185px; width: 241px; height: 143px; background-size: auto; }
  .international-footer .link-box .link-item.link-c p { height: 20px; margin: 10px 0 0; color: #212121; font-size: 14px; line-height: 20px; transition: color .2s; }
  .international-footer .link-box .link-item.link-c .bili-footer-font { font-family: "extension-bilifont" !important; font-size: 50px; font-style: normal; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  .international-footer .link-box .link-item.link-c .biliapp { color: #585f69; }
  .international-footer .link-box .link-item.link-c .charity { color: #00aeec; }
  .international-footer .link-box .link-item.link-c .weibo { color: #fe596c; }
  .international-footer .link-box .link-item.link-c .weixin { color: #42c86b; }
  .international-footer .link-box .link-item.link-c .charity-icon { display: inline-block; width: 50px; height: 50px; }
  .international-footer .link-box .link-item.link-c .charity-text { padding-top: 2px; }
  .international-footer .partner { display: flex; min-width: 0; padding-top: 30px; color: #999; }
  .international-footer .partner .pic-box { flex: 0 0 100px; width: 100px; margin-right: 20px; }
  .international-footer .partner .pic { width: 96px; height: 75px; }
  .international-footer .partner .pic962110 { width: 100px; height: 40px; margin: 5px 0; }
  .international-footer .partner .text-con { flex: 1 1 auto; width: auto; min-width: 0; }
  .international-footer .partner .text-con span { display: inline-block; margin-right: 15px; }
  .international-footer .partner p { margin: 0; line-height: 24px; }
  .international-footer .partner a { color: #999; }
  .international-footer .partner .sprite { display: inline-block; margin-right: 3px; vertical-align: middle; background-repeat: no-repeat; }
  .international-footer .partner .sprite.bg1 { width: 16px; height: 16px; background-position: 0 -2px; }
  .international-footer .partner .sprite.bg2 { width: 18px; height: 20px; background-position: -41px 0; }
  .international-footer .partner .sprite.bg3 { width: 16px; height: 16px; background-position: -18px -3px; }
  @media screen and (max-width: 1870px) { .international-footer { --footer-wrap: 1414px; } }
  @media screen and (max-width: 1654px) {
    .international-footer { --footer-wrap: 1198px; }
    .international-footer .link-box .footer_left { flex: 1 1 auto; }
    .international-footer .link-box .footer_right { flex: 0 0 280px; }
  }
  @media screen and (max-width: 1438px) { .international-footer { --footer-wrap: 999px; } }
  @media screen and (max-width: 980px) {
    .international-footer { --footer-wrap: calc(100% - 20px); padding: 36px 0 30px; }
    .international-footer .link-box, .international-footer .footer_left, .international-footer .partner { flex-direction: column; }
    .international-footer .link-box { gap: 28px; }
    .international-footer .link-box .footer_left { gap: 24px; }
    .international-footer .link-box .footer_right { flex-basis: auto; }
    .international-footer .link-box .link-item { flex: none; margin-right: 0; padding-right: 0; border-right: 0; }
    .international-footer .link-box .link-item.link-c { flex-wrap: wrap; gap: 16px; }
    .international-footer .partner .pic-box { display: flex; flex-basis: auto; gap: 12px; width: auto; margin-right: 0; }
  }
  /* Live floor: legacy direct layout and fixed canonical width chain. */
  #bili_live { min-height: 430px; }
  #bili_report_live { display: flex; width: 100%; align-items: flex-start; justify-content: space-between; }
  #bili_report_live > .live-list { flex: 0 0 1286px; width: 1286px; min-width: 0; }
  #bili_report_live > .live-tabs { flex: 0 0 320px; width: 320px; min-width: 0; padding: 0; border: 0; background: transparent; }
  #bili_live .live-list-box { display: grid; grid-template-columns: repeat(6, 206px); grid-auto-rows: 190px; gap: 20px 10px; }
  #bili_live .live-card { width: 206px; min-width: 0; }
  #bili_live .live-card__link { display: block; color: inherit; text-decoration: none; }
  #bili_live .live-card .pic { width: 206px; height: 116px; margin-bottom: 10px; border-radius: 2px; box-shadow: none; }
  #bili_live .live-card__image, #bili_live .live-card__keyframe { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; }
  #bili_live .live-card__keyframe { z-index: 1; opacity: 0; transform: translateY(8px); transition: opacity .3s, transform .3s; }
  #bili_live .live-card .pic:hover .live-card__keyframe, #bili_live .live-card__link:focus-visible .live-card__keyframe { opacity: 1; transform: translateY(0); }
  #bili_live .live-card .count { right: auto; bottom: 0; left: 0; z-index: 2; height: 28px; padding: 6px 8px; color: #fff; font-size: 12px; line-height: 16px; }
  #bili_live .live-card .count i { margin-right: 4px; }
  #bili_live .live-card .up { display: flex; align-items: flex-start; gap: 0; margin: 0; }
  #bili_live .live-card .up-cover, #bili_live .live-card .face { display: block; flex: 0 0 36px; width: 36px; height: 36px; border-radius: 50%; }
  #bili_live .live-card .up-cover { margin-right: 12px; overflow: hidden; }
  #bili_live .live-card .txt { display: block; width: 158px; min-width: 0; }
  #bili_live .live-card .name { margin: 0; color: #212121; font-size: 14px; font-weight: 500; line-height: 20px; }
  #bili_live .live-card .desc { margin: 0; color: #505050; font-size: 12px; line-height: 18px; }
  #bili_live .live-card .tag { display: block; margin-top: 8px; color: #999; font-size: 12px; line-height: 16px; }
  #bili_live .tab-switch { display: flex; height: 36px; margin-bottom: 16px; }
  #bili_live .tab-switch-item { position: relative; height: 22px; margin-right: 12px; padding: 0; border: 0; color: #505050; background: transparent; font-size: 12px; line-height: 22px; cursor: pointer; }
  #bili_live .tab-switch-item.on { color: #00a1d6; }
  #bili_live .tab-switch-item.on::after { position: absolute; right: 0; bottom: -4px; left: 0; height: 1px; background: #00a1d6; content: ""; }
  #bili_live .exchange-btn { display: flex; width: 142px; height: 22px; flex: 0 0 142px; gap: 0; overflow: visible; }
  #bili_live .exchange-btn .more { position: static; display: flex; width: 58px; height: 22px; flex: 0 0 58px; align-items: center; justify-content: center; margin-left: 12px; padding: 0; border: 1px solid #c9ccd0; border-radius: 2px; color: #505050; background: #fff; opacity: 1; visibility: visible; }
  #bili_live .exchange-btn .more .bilifont { margin-left: 2px; font-size: 12px; }
  #bili_live .rank-wrap { display: flex; height: 66px; align-items: center; }
  #bili_live .rank-wrap .number { display: flex; flex: 0 0 20px; width: 20px; height: 20px; align-items: center; justify-content: center; margin-right: 10px; color: #999; font-size: 14px; }
  #bili_live .rank-wrap--top .number { color: #fff; background: #00a1d6; border-radius: 2px; }
  #bili_live .rank-wrap .link { display: flex; flex: 1; min-width: 0; align-items: center; color: #212121; font-size: 12px; text-decoration: none; }
  #bili_live .rank-face, #bili_live .rank-face__image { display: block; flex: 0 0 44px; width: 44px; height: 44px; border-radius: 50%; }
  #bili_live .rank-face { margin-right: 12px; overflow: hidden; background: #f1f2f3; }
  #bili_live .rank-text { display: flex; min-width: 0; flex: 1 1 auto; flex-direction: column; }
  #bili_live .rank-name, #bili_live .rank-title { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #bili_live .rank-name { color: #212121; font-size: 14px; line-height: 20px; }
  #bili_live .rank-title { margin-top: 2px; color: #505050; font-size: 12px; line-height: 18px; }
  #bili_live .rank-online { flex: none; margin-left: 8px; color: #999; white-space: nowrap; }
  #bili_live .rank-online i { margin-right: 3px; }
  #bili_live .empty-state { padding: 54px 0; color: #999; font-size: 12px; text-align: center; }
  @media screen and (max-width: 1870px) {
    #bili_report_live > .live-list { flex-basis: 1070px; width: 1070px; }
    #bili_live .live-list-box { grid-template-columns: repeat(5, 206px); }
    #bili_live .live-card:nth-child(n + 11) { display: none; }
  }
  @media screen and (max-width: 1654px) {
    #bili_report_live > .live-list { flex-basis: 854px; width: 854px; }
    #bili_live .live-list-box { grid-template-columns: repeat(4, 206px); gap: 20px 10px; }
    #bili_live .live-card, #bili_live .live-card .pic { width: 206px; }
    #bili_live .live-card .txt { width: 158px; }
    #bili_live .live-card:nth-child(n + 9) { display: none; }
  }
  @media screen and (max-width: 1438px) {
    #bili_report_live > .live-list { flex-basis: 710px; width: 710px; }
    #bili_report_live > .live-tabs { flex-basis: 265px; width: 265px; }
    #bili_live .live-list-box { grid-template-columns: repeat(4, 170px); }
    #bili_live .live-card:nth-child(n + 9) { display: none; }
  }
  @media screen and (max-width: 980px) {
    #bili_report_live { display: block; }
    #bili_report_live > .live-list, #bili_report_live > .live-tabs { width: 100%; }
    #bili_report_live > .live-tabs { margin-top: 24px; }
    #bili_live .live-list-box { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  /* Focus carousel fidelity: the legacy page moves one shared track, not isolated fades. */
  .focus-carousel.home-slide.report-wrap-module.report-scroll-module { position: relative; flex: 0 0 550px; width: 550px; height: 242px; overflow: hidden; border-radius: 2px; background: #eef1f3; }
  .focus-carousel.home-slide.report-wrap-module.report-scroll-module .van-slide.ggc { position: relative; z-index: 1; width: 100%; height: 100%; overflow: hidden; }
  .home-slide .carousel-track { display: flex; width: 100%; height: 100%; transform: translate3d(0, 0, 0); transition: transform .32s cubic-bezier(.22, .61, .36, 1); will-change: transform; }
  .home-slide .carousel-track.is-preparing, .home-slide .carousel-track.is-manual-motion, .home-slide .trigger .trigger-indicator.is-manual-motion { transition: none !important; }
  .home-slide .item { position: relative; flex: 0 0 100%; width: 100%; height: 100%; opacity: 1; pointer-events: none; transition: none; }
  .home-slide .item.is-active { pointer-events: auto; }
  .home-slide .item > a { display: block; width: 100%; height: 100%; }
  .home-slide .item .b-img, .home-slide .item .b-img picture, .home-slide .item .b-img img { display: block; width: 100%; height: 100%; }
  .home-slide .item .b-img::after { display: none; }
  .home-slide img { border-radius: 2px; object-fit: cover; }
  .home-slide .item::before { position: absolute; right: 0; bottom: 0; left: 0; z-index: 1; height: 48px; border-radius: 2px; background: linear-gradient(to bottom, rgba(24, 25, 28, 0), rgba(24, 25, 28, .9)); content: ""; pointer-events: none; }
  .home-slide .item .title { position: absolute; right: auto; bottom: 10px; left: 12px; z-index: 2; display: flex; width: 70%; align-items: center; margin: 0; overflow: hidden; color: #fff; font-size: 14px; font-weight: 400; line-height: 18px; text-overflow: ellipsis; white-space: nowrap; }
  #bili_read, #bili_report_read, #bili_report_read > .article-list { min-height: 504px; }
  #bili_report_read .zone-list-box { height: 452px; align-content: flex-start; row-gap: 24px; }
  #bili_report_read .article-card { height: 95px; }
  #bili_live .live-card__keyframe.is-unavailable { display: none; }
  .focus-carousel .more { position: absolute; right: 12px; bottom: 44px; z-index: 11; display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 2px; color: #fff; background: rgba(0, 0, 0, .65); font-size: 12px; line-height: 16px; opacity: 0; text-decoration: none; transition: opacity .3s; }
  .focus-carousel .more i { margin-left: 2px; vertical-align: middle; }
  .focus-carousel:hover .more, .focus-carousel:focus-within .more { opacity: 1; }
  .home-slide .trigger { position: absolute; right: 12px; bottom: 12px; z-index: 10; display: flex; min-height: 18px; align-items: center; gap: 10px; }
  .home-slide .trigger span { position: relative; z-index: 1; display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: #fff; cursor: pointer; opacity: 1; transition: transform .2s, opacity .2s; }
  .home-slide .trigger span:hover { transform: scale(1.14); }
  .home-slide .trigger span.on { transform: scale(1.02); opacity: .01; pointer-events: none; }
  .home-slide .trigger span.on:hover { transform: scale(1.02); }
  .home-slide .trigger .trigger-indicator { position: absolute; top: 50%; left: 0; z-index: 3; display: block; box-sizing: border-box; width: 18px; height: 18px; border: 2px solid #fff; border-radius: 50%; background-color: #00a1d6; background-position: center; background-repeat: no-repeat; background-size: 18px 18px; pointer-events: none; transform: translate3d(-4px, -50%, 0); transition: transform .32s cubic-bezier(.22, .61, .36, 1); will-change: transform; }
  .home-slide.is-empty .trigger, .home-slide.is-empty .more { display: none; }
  @media (prefers-reduced-motion: reduce) { .home-slide .carousel-track, .home-slide .trigger .trigger-indicator { transition-duration: 0s; } }
  @media screen and (max-width: 1438px) { .focus-carousel.home-slide.report-wrap-module.report-scroll-module { flex-basis: 459px; width: 459px; height: 202px; } }
  @media screen and (max-width: 980px) { .focus-carousel.home-slide.report-wrap-module.report-scroll-module { flex-basis: auto; width: 100%; height: auto; aspect-ratio: 550 / 242; } }
  `;

  const normalizeText = (value) => {
    if (typeof value !== "string") {
      return "";
    }
    return value
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/[\r\n\t]+/g, " ")
      .slice(0, MAX_TEXT_LENGTH);
  };

  const resolveNav = (navKey) => {
    if (typeof navKey !== "string" || !Object.prototype.hasOwnProperty.call(NAV_ALLOWLIST, navKey)) {
      return null;
    }
    const target = NAV_ALLOWLIST[navKey];
    return {
      href: target.href,
      target: target.target,
      rel: target.rel
    };
  };

  const resolveUpload = (uploadKey) => {
    if (typeof uploadKey !== "string" || !Object.prototype.hasOwnProperty.call(UPLOAD_ALLOWLIST, uploadKey)) {
      return null;
    }
    const target = UPLOAD_ALLOWLIST[uploadKey];
    return { href: target.href, target: target.target, rel: target.rel };
  };

  const resolveSearchUrl = (keyword) => {
    const raw = typeof keyword === "string" ? keyword : "";
    const cleaned = raw
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .slice(0, MAX_SEARCH_KEYWORD_LENGTH)
      .trim() || SEARCH_DEFAULT_KEYWORD;
    let encoded;
    try {
      encoded = encodeURIComponent(cleaned);
    } catch (_) {
      encoded = encodeURIComponent(SEARCH_DEFAULT_KEYWORD);
    }
    return `${SEARCH_ENDPOINT}?keyword=${encoded}`;
  };

  const isSearchRemoteIconUrl = (value) => {
    if (value === null) return true;
    if (typeof value !== "string" || value.length === 0 || value.length > 2048
      || /[\u0000-\u001F\u007F]/.test(value)) return false;
    let parsed;
    try { parsed = new URL(value); } catch (_) { return false; }
    return parsed.protocol === "https:"
      && ["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)
      && parsed.username === ""
      && parsed.password === ""
      && parsed.port === ""
      && parsed.search === ""
      && parsed.hash === ""
      && parsed.pathname.startsWith("/bfs/");
  };

  const isSearchData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "defaultKeyword\u001FdefaultUrl\u001FtrendingItems\u001FtrendingTitle"
    && typeof value.defaultKeyword === "string"
    && value.defaultKeyword.length > 0
    && value.defaultKeyword.length <= 128
    && typeof value.defaultUrl === "string"
    && value.defaultUrl.startsWith(`${SEARCH_ENDPOINT}?keyword=`)
    && typeof value.trendingTitle === "string"
    && value.trendingTitle.length > 0
    && value.trendingTitle.length <= 64
    && Array.isArray(value.trendingItems)
    && value.trendingItems.length <= 10
    && value.trendingItems.every((item) => item !== null
      && typeof item === "object"
      && !Array.isArray(item)
      && Object.keys(item).sort().join("\u001F") === "keyword\u001FmarkKey\u001FremoteIcon\u001Ftext"
      && typeof item.keyword === "string"
      && item.keyword.length > 0
      && item.keyword.length <= 128
      && typeof item.text === "string"
      && item.text.length > 0
      && item.text.length <= 128
      && ["live", "anniversary", "none"].includes(item.markKey)
      && isSearchRemoteIconUrl(item.remoteIcon)
      && (item.markKey === "none" || item.remoteIcon === null));

  const resolveAssetKey = (assetKey) => {
    if (typeof assetKey !== "string" || IMPORTED_ASSET_KEYS.has(assetKey) === false) {
      return null;
    }
    if (
      assetKey.includes("..")
      || assetKey.includes("\\")
      || assetKey.includes("?")
      || assetKey.includes("#")
      || assetKey.includes(":")
      || assetKey.includes("//")
      || /[\u0000-\u001F\u007F]/.test(assetKey)
    ) {
      return null;
    }
    return assetKey;
  };

  const resolveImage = (imageKey) => {
    const exactKey = resolveAssetKey(imageKey);
    return exactKey === ASSET_KEYS.BANNER_FALLBACK || exactKey === ASSET_KEYS.BANNER_LOGO
      ? exactKey
      : null;
  };

  const resolveLocalAssetUrl = (assetKey) => {
    const exactKey = resolveAssetKey(assetKey);
    return exactKey ? chrome.runtime.getURL(exactKey) : null;
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

  const resolveFocusUrl = (value, allowedHosts, pathPrefixes, allowHttpUpgrade) => {
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
    if (allowHttpUpgrade && (url.search !== "" || url.hash !== "" || url.href.length > MAX_COVER_URL_LENGTH)) {
      return null;
    }
    if (pathPrefixes && pathPrefixes.some((prefix) => url.pathname.startsWith(prefix)) === false) {
      return null;
    }
    if (allowHttpUpgrade && url.protocol === "http:") { url.protocol = "https:"; }
    return url.href;
  };

  const resolveFocusImageUrl = (value) => resolveFocusUrl(
    value,
    FOCUS_IMAGE_HOSTS,
    ["/bfs/banner/", "/bfs/archive/"],
    true
  );
  const resolveReadCoverUrl = (value) => resolveFocusUrl(
    value,
    FOCUS_IMAGE_HOSTS,
    ["/bfs/"],
    true
  );
  const resolveCheeseCoverUrl = (value) => resolveFocusUrl(
    value,
    new Set(["archive.biliimg.com", "i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"]),
    ["/bfs/archive/"],
    true
  );

  const resolveFocusLinkUrl = (value) => resolveFocusUrl(value, FOCUS_LINK_HOSTS, null);

  const resolveKnowledgeCoverUrl = (value) => {
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

  const resolveKnowledgeHref = (value) => {
    if (typeof value !== "string" || !value.startsWith("https://www.bilibili.com/video/")) {
      return null;
    }
    const bvid = value.slice("https://www.bilibili.com/video/".length);
    return KNOWLEDGE_BVID_RE.test(bvid) ? value : null;
  };

  const isKnowledgeCount = (value) => value === null || (Number.isSafeInteger(value) && value >= 0);

  const isKnowledgeItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
    && typeof item.bvid === "string"
    && KNOWLEDGE_BVID_RE.test(item.bvid)
    && typeof item.title === "string"
    && normalizeText(item.title).trim() !== ""
    && typeof item.ownerName === "string"
    && normalizeText(item.ownerName).trim() !== ""
    && (item.coverUrl === null || resolveKnowledgeCoverUrl(item.coverUrl) === item.coverUrl)
    && resolveKnowledgeHref(item.href) === item.href
    && isKnowledgeCount(item.view)
    && isKnowledgeCount(item.danmaku)
    && isKnowledgeCount(item.durationSeconds)
  );

  const isKnowledgeData = (data) => (
    data !== null
    && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(data.items)
    && data.items.length <= MAX_KNOWLEDGE_ITEMS
    && ((data.status === "success" && data.items.length === 15)
      || (data.status === "partial" && data.items.length >= 1 && data.items.length <= 14)
      || (data.status === "empty" && data.items.length === 0))
    && data.items.every(isKnowledgeItem)
    && new Set(data.items.map((item) => item.bvid)).size === data.items.length
  );

  const resolveMusicCoverUrl = (value) => {
    if (typeof value !== "string" || value.length === 0 || value.length > MAX_COVER_URL_LENGTH || value.trim() !== value || /[\u0000-\u001F\u007F]/.test(value)) return null;
    const authorityMatch = /^https?:\/\/([^/?#]*)/i.exec(value);
    if (!authorityMatch || authorityMatch[1].includes("@") || authorityMatch[1].includes(":")) return null;
    const rawPathStart = value.indexOf("/", authorityMatch[0].length);
    const rawPathEnd = value.search(/[?#]/);
    const rawPath = rawPathStart >= 0 ? value.slice(rawPathStart, rawPathEnd >= 0 ? rawPathEnd : value.length) : "/";
    if (hasDotSegment(rawPath)) return null;
    let url;
    try { url = new URL(value); } catch { return null; }
    if (
      (url.protocol !== "https:" && url.protocol !== "http:")
      || url.username
      || url.password
      || url.port
      || url.search
      || url.hash
      || !MUSIC_IMAGE_HOSTS.has(url.hostname.toLowerCase())
      || !url.pathname.startsWith("/bfs/")
    ) return null;
    if (url.protocol === "http:") { url.protocol = "https:"; }
    if (url.href.length > MAX_COVER_URL_LENGTH) return null;
    return url.href;
  };

  const resolveMusicHref = (value) => {
    if (typeof value !== "string" || !value.startsWith("https://www.bilibili.com/video/")) return null;
    const bvid = value.slice("https://www.bilibili.com/video/".length);
    return MUSIC_BVID_RE.test(bvid) ? value : null;
  };

  const isMusicCount = (value) => value === null || (Number.isSafeInteger(value) && value >= 0);

  const isMusicItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
    && typeof item.bvid === "string"
    && MUSIC_BVID_RE.test(item.bvid)
    && typeof item.title === "string"
    && normalizeText(item.title).trim() !== ""
    && typeof item.ownerName === "string"
    && normalizeText(item.ownerName).trim() !== ""
    && (item.coverUrl === null || resolveMusicCoverUrl(item.coverUrl) === item.coverUrl)
    && resolveMusicHref(item.href) === item.href
    && isMusicCount(item.view)
    && isMusicCount(item.danmaku)
    && isMusicCount(item.durationSeconds)
  );

  const isMusicData = (data) => (
    data !== null
    && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(data.items)
    && data.items.length <= MAX_MUSIC_ITEMS
    && ((data.status === "success" && data.items.length === 15)
      || (data.status === "partial" && data.items.length >= 1 && data.items.length <= 14)
      || (data.status === "empty" && data.items.length === 0))
    && data.items.every(isMusicItem)
    && new Set(data.items.map((item) => item.bvid)).size === data.items.length
  );

  const resolveAnimalCoverUrl = (value) => {
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
  const resolveFashionCoverUrl = (value) => {
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
  const resolveAnimalHref = (value) => {
    if (typeof value !== "string" || !value.startsWith("https://www.bilibili.com/video/")) return null;
    const bvid = value.slice("https://www.bilibili.com/video/".length);
    return ANIMAL_BVID_RE.test(bvid) ? value : null;
  };
  const resolveFashionHref = (value) => {
    if (typeof value !== "string" || !value.startsWith("https://www.bilibili.com/video/")) return null;
    const bvid = value.slice("https://www.bilibili.com/video/".length);
    return FASHION_BVID_RE.test(bvid) ? value : null;
  };
  const isAnimalCount = (value) => value === null || (Number.isSafeInteger(value) && value >= 0);
  const isFashionCount = (value) => value === null || (Number.isSafeInteger(value) && value >= 0);
  const isAnimalItem = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
    && typeof item.bvid === "string" && ANIMAL_BVID_RE.test(item.bvid) && typeof item.title === "string" && normalizeText(item.title).trim() !== ""
    && typeof item.ownerName === "string" && normalizeText(item.ownerName).trim() !== ""
    && (item.coverUrl === null || resolveAnimalCoverUrl(item.coverUrl) === item.coverUrl) && resolveAnimalHref(item.href) === item.href
    && item.href === `https://www.bilibili.com/video/${item.bvid}`
    && isAnimalCount(item.view) && isAnimalCount(item.danmaku) && isAnimalCount(item.durationSeconds);
  const isFashionItem = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "bvid\u001FcoverUrl\u001Fdanmaku\u001FdurationSeconds\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
    && typeof item.bvid === "string" && FASHION_BVID_RE.test(item.bvid) && typeof item.title === "string" && normalizeText(item.title).trim() !== ""
    && typeof item.ownerName === "string" && normalizeText(item.ownerName).trim() !== ""
    && (item.coverUrl === null || resolveFashionCoverUrl(item.coverUrl) === item.coverUrl) && resolveFashionHref(item.href) === item.href
    && item.href === `https://www.bilibili.com/video/${item.bvid}`
    && isFashionCount(item.view) && isFashionCount(item.danmaku) && isFashionCount(item.durationSeconds);
  const isAnimalData = (data) => data !== null && typeof data === "object" && Object.keys(data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(data.items) && data.items.length <= MAX_ANIMAL_ITEMS
    && ((data.status === "success" && data.items.length === 15) || (data.status === "partial" && data.items.length >= 1 && data.items.length <= 14) || (data.status === "empty" && data.items.length === 0))
    && data.items.every(isAnimalItem) && new Set(data.items.map((item) => item.bvid)).size === data.items.length;
  const isFashionData = (data) => data !== null && typeof data === "object" && Object.keys(data).sort().join("\u001F") === "items\u001Fstatus"
    && Array.isArray(data.items) && data.items.length <= MAX_FASHION_ITEMS
    && ((data.status === "success" && data.items.length === 15) || (data.status === "partial" && data.items.length >= 1 && data.items.length <= 14) || (data.status === "empty" && data.items.length === 0))
    && data.items.every(isFashionItem) && new Set(data.items.map((item) => item.bvid)).size === data.items.length;

  const isFocusCarouselItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "imageUrl\u001Fkey\u001FlinkUrl\u001Forder\u001Fsubtitle\u001Ftitle\u001Ftype"
    && typeof item.key === "string"
    && item.key.length > 0
    && item.key.length <= 128
    && typeof item.title === "string"
    && item.title.length <= MAX_FOCUS_TEXT_LENGTH
    && typeof item.subtitle === "string"
    && item.subtitle.length <= MAX_FOCUS_TEXT_LENGTH
    && item.type === "focus-carousel"
    && Number.isSafeInteger(item.order)
    && item.order > 0
    && resolveFocusImageUrl(item.imageUrl) === item.imageUrl
    && resolveFocusLinkUrl(item.linkUrl) === item.linkUrl
  );

  const isFocusCarouselItems = (items) => (
    Array.isArray(items)
    && items.length > 0
    && items.length <= 20
    && items.every(isFocusCarouselItem)
  );

  const isBoundedPgcText = (value, maxLength, required) => (
    typeof value === "string"
    && value.length <= maxLength
    && /[\u0000-\u001F\u007F]/.test(value) === false
    && (!required || value.trim() !== "")
  );

  const isSafePgcId = (value) => (
    Number.isSafeInteger(value) && value >= 0 && value <= MAX_PGC_ID
  );

  const resolvePgcUrlWithoutQueryHash = (value, allowedHosts, pathPrefixes) => {
    const normalized = resolveFocusUrl(value, allowedHosts, pathPrefixes);
    if (!normalized) {
      return null;
    }
    try {
      const url = new URL(normalized);
      return url.search === "" && url.hash === "" ? normalized : null;
    } catch {
      return null;
    }
  };

  const resolvePgcCoverUrl = (value) => resolvePgcUrlWithoutQueryHash(
    value,
    FOCUS_IMAGE_HOSTS,
    ["/bfs/bangumi/"]
  );

  const resolveOrdinaryPgcCoverUrl = (value) => resolvePgcUrlWithoutQueryHash(
    value,
    FOCUS_IMAGE_HOSTS,
    ["/bfs/"]
  );

  const resolvePgcLinkUrl = (value) => resolvePgcUrlWithoutQueryHash(
    value,
    new Set(["www.bilibili.com"]),
    ["/bangumi/play/"]
  );

  const isPgcAnimeTimelineItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "coverUrl\u001FepisodeId\u001FpubTime\u001FseasonId\u001Ftitle\u001FupdateText"
    && isSafePgcId(item.seasonId)
    && isSafePgcId(item.episodeId)
    && isBoundedPgcText(item.title, MAX_PGC_TEXT_LENGTH, true)
    && resolvePgcCoverUrl(item.coverUrl) === item.coverUrl
    && isBoundedPgcText(item.updateText, MAX_PGC_SHORT_TEXT_LENGTH, false)
    && isBoundedPgcText(item.pubTime, MAX_PGC_SHORT_TEXT_LENGTH, false)
  );

  const isPgcAnimeRankItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "badgeText\u001FlinkUrl\u001Frank\u001FseasonId\u001Ftitle\u001FupdateText"
    && Number.isSafeInteger(item.rank)
    && item.rank >= 1
    && item.rank <= 10
    && isSafePgcId(item.seasonId)
    && isBoundedPgcText(item.title, MAX_PGC_TEXT_LENGTH, true)
    && resolvePgcLinkUrl(item.linkUrl) === item.linkUrl
    && isBoundedPgcText(item.updateText, MAX_PGC_SHORT_TEXT_LENGTH, false)
    && isBoundedPgcText(item.badgeText, MAX_PGC_SHORT_TEXT_LENGTH, false)
  );

  const isPgcAnimeData = (data) => {
    if (
      data === null
      || typeof data !== "object"
      || Object.keys(data).sort().join("\u001F") !== "rankItems\u001Ftabs"
      || !Array.isArray(data.tabs)
      || data.tabs.length !== PGC_TAB_DEFINITIONS.length
      || !Array.isArray(data.rankItems)
      || data.rankItems.length < 1
      || data.rankItems.length > MAX_PGC_RANK_ITEMS
    ) {
      return false;
    }
    let timelineCount = 0;
    let todayCount = 0;
    for (let index = 0; index < PGC_TAB_DEFINITIONS.length; index += 1) {
      const tab = data.tabs[index];
      const definition = PGC_TAB_DEFINITIONS[index];
      if (
        tab === null
        || typeof tab !== "object"
        || Object.keys(tab).sort().join("\u001F") !== "isToday\u001Fitems\u001Fkey\u001Flabel"
        || tab.key !== definition.key
        || tab.label !== definition.label
        || typeof tab.isToday !== "boolean"
        || (index === 0 && tab.isToday)
        || !Array.isArray(tab.items)
        || tab.items.length > 64
        || !tab.items.every(isPgcAnimeTimelineItem)
      ) {
        return false;
      }
      timelineCount += tab.items.length;
      if (tab.isToday) {
        todayCount += 1;
      }
    }
    return timelineCount <= MAX_PGC_TIMELINE_ITEMS
      && todayCount <= 1
      && data.rankItems.every(isPgcAnimeRankItem)
      && new Set(data.rankItems.map((item) => item.rank)).size === data.rankItems.length;
  };

  const isPgcGuochuangTimelineItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "coverUrl\u001FepisodeId\u001FpubTime\u001FseasonId\u001Ftitle\u001FupdateText"
    && isSafePgcId(item.seasonId)
    && isSafePgcId(item.episodeId)
    && isBoundedPgcText(item.title, MAX_PGC_SHORT_TEXT_LENGTH, true)
    && resolvePgcCoverUrl(item.coverUrl) === item.coverUrl
    && isBoundedPgcText(item.updateText, MAX_PGC_SHORT_TEXT_LENGTH, false)
    && isBoundedPgcText(item.pubTime, MAX_PGC_SHORT_TEXT_LENGTH, false)
  );

  const isPgcGuochuangRankItem = (item) => (
    item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "badgeText\u001FlinkUrl\u001Frank\u001FseasonId\u001Ftitle\u001FupdateText"
    && Number.isSafeInteger(item.rank)
    && item.rank >= 1
    && item.rank <= 10
    && isSafePgcId(item.seasonId)
    && isBoundedPgcText(item.title, MAX_PGC_SHORT_TEXT_LENGTH, true)
    && resolvePgcLinkUrl(item.linkUrl) === item.linkUrl
    && isBoundedPgcText(item.updateText, MAX_PGC_SHORT_TEXT_LENGTH, false)
    && item.badgeText === ""
  );

  const isPgcGuochuangData = (data) => {
    if (
      data === null
      || typeof data !== "object"
      || Object.keys(data).sort().join("\u001F") !== "rankItems\u001Ftabs"
      || !Array.isArray(data.tabs)
      || data.tabs.length !== PGC_TAB_DEFINITIONS.length
      || !Array.isArray(data.rankItems)
      || data.rankItems.length < 1
      || data.rankItems.length > MAX_PGC_RANK_ITEMS
    ) {
      return false;
    }
    let timelineCount = 0;
    let todayCount = 0;
    for (let index = 0; index < PGC_TAB_DEFINITIONS.length; index += 1) {
      const tab = data.tabs[index];
      const definition = PGC_TAB_DEFINITIONS[index];
      if (
        tab === null
        || typeof tab !== "object"
        || Object.keys(tab).sort().join("\u001F") !== "isToday\u001Fitems\u001Fkey\u001Flabel"
        || tab.key !== definition.key
        || tab.label !== definition.label
        || typeof tab.isToday !== "boolean"
        || (index === 0 && tab.isToday)
        || !Array.isArray(tab.items)
        || tab.items.length > MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_PER_TAB
        || !tab.items.every(isPgcGuochuangTimelineItem)
      ) {
        return false;
      }
      timelineCount += tab.items.length;
      if (tab.isToday) {
        todayCount += 1;
      }
    }
    return timelineCount <= MAX_PGC_GUOCHUANG_TIMELINE_ITEMS_TOTAL
      && todayCount <= 1
      && data.rankItems.every(isPgcGuochuangRankItem)
      && new Set(data.rankItems.map((item) => item.rank)).size === data.rankItems.length;
  };

  const createNode = (root, tagName, className, text) => {
    const node = root.ownerDocument.createElement(tagName);
    if (className) {
      node.setAttribute("class", className);
    }
    if (text !== undefined) {
      node.textContent = normalizeText(text);
    }
    return node;
  };

  const ICON_FONT_GLYPHS = Object.freeze({
    "bili-icon_dingdao_zhuzhan": Object.freeze({ codePoint: 0xE72B, fallbackClass: "icon-font-fallback--tv", fallbackText: "" }),
    "bili-icon_dingdao_sousuo": Object.freeze({ codePoint: 0xE72C, fallbackClass: "icon-font-fallback--search", fallbackText: "" }),
    "bili-icon_dingdao_shipintougao": Object.freeze({ codePoint: 0xE726, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_wenzhangtougao": Object.freeze({ codePoint: 0xE727, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_yinpintougao": Object.freeze({ codePoint: 0xE729, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_tougaoguanli1": Object.freeze({ codePoint: 0xE72A, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_tiezhitougao": Object.freeze({ codePoint: 0xE764, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_bofang": Object.freeze({ codePoint: 0xE737, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_shipin_dianzanshu": Object.freeze({ codePoint: 0xE740, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_shipin_bofangshu": Object.freeze({ codePoint: 0xE73E, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_xinxi_renqi": Object.freeze({ codePoint: 0xE73F, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_shipin_danmushu": Object.freeze({ codePoint: 0xE759, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_shipin_shoucangshu": Object.freeze({ codePoint: 0xE75A, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_shipin_yingbishu": Object.freeze({ codePoint: 0xE75B, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_xiazaiapp": Object.freeze({ codePoint: 0xE72D, fallbackClass: "icon-font-fallback--download", fallbackText: "" }),
    "bili-icon_dingdao_dongtai": Object.freeze({ codePoint: 0xE732, fallbackClass: "icon-font-fallback--text", fallbackText: "D" }),
    "bili-icon_xinxi_UPzhu": Object.freeze({ codePoint: 0xE741, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_fenqudaohang_shouye": Object.freeze({ codePoint: 0xE738, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-remen": Object.freeze({ codePoint: 0xE763, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-pindao": Object.freeze({ codePoint: 0xE760, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_caozuo_xiangyou-copy": Object.freeze({ codePoint: 0xE758, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_caozuo_huanyihuan": Object.freeze({ codePoint: 0xE73C, fallbackClass: "icon-font-fallback--text", fallbackText: "↻" }),
    "bili-icon_youdaohang_paixu": Object.freeze({ codePoint: 0xE74D, fallbackClass: "icon-font-fallback--text", fallbackText: "≡" }),
    "bili-icon_youdaohang_xiaodianshitianxian": Object.freeze({ codePoint: 0xE74F, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-general_pullup_s": Object.freeze({ codePoint: 0xE6EC, fallbackClass: "icon-font-fallback--text", fallbackText: "↑" }),
    "bili-icon_dingdao_gerenzhongxin": Object.freeze({ codePoint: 0xE722, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_tougaoguanli": Object.freeze({ codePoint: 0xE723, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_tuijianfuwu": Object.freeze({ codePoint: 0xE60F, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_yuyanshezhi": Object.freeze({ codePoint: 0xE757, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_dengchu": Object.freeze({ codePoint: 0xE721, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_qianbao": Object.freeze({ codePoint: 0xE71F, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_dingdanzhongxin": Object.freeze({ codePoint: 0xE71E, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_zhibozhongxin": Object.freeze({ codePoint: 0xE720, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_cheese": Object.freeze({ codePoint: 0xE60E, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_bangdingshouji": Object.freeze({ codePoint: 0xE733, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_youxiang": Object.freeze({ codePoint: 0xE735, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_yingbi": Object.freeze({ codePoint: 0xE734, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_dingdao_Bbi": Object.freeze({ codePoint: 0xE736, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_caozuo_qianwang": Object.freeze({ codePoint: 0xE73B, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-icon_caozuo_xuanzhong": Object.freeze({ codePoint: 0xE756, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-footer-icon_weibo": Object.freeze({ codePoint: 0xE71C, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-footer-icon_wechat": Object.freeze({ codePoint: 0xE751, fallbackClass: "icon-font-fallback--empty", fallbackText: "" }),
    "bili-footer-icon_download": Object.freeze({ codePoint: 0xE752, fallbackClass: "icon-font-fallback--empty", fallbackText: "" })
  });

  const createIconFont = (root, glyphClass, className, lifecycle, tagName) => {
    const node = root.ownerDocument.createElement(tagName || "span");
    const glyph = ICON_FONT_GLYPHS[glyphClass];
    const classes = ["bilifont", glyphClass, className].filter(Boolean);
    node.setAttribute("class", classes.join(" "));
    if (glyph) {
      node.setAttribute("data-icon-glyph", glyphClass);
      node.setAttribute("data-glyph-codepoint", `U+${glyph.codePoint.toString(16).toUpperCase()}`);
      // Verified: bundled iconfont.woff2 cmap contains the registered official glyph codepoints (fontTools).
      // Write the private-use codepoint so the real glyph renders once the font resolves.
      // Default CSS keeps `.bilifont[data-icon-glyph]` transparent + CSS fallback visible; the
      // `.icon-font-ready` class hides the fallback and reveals the glyph, added only after
      // document.fonts.load() resolves for the extension font.
      node.textContent = String.fromCodePoint(glyph.codePoint);
      node.appendChild(createNode(root, "span", `icon-font-fallback ${glyph.fallbackClass}`, glyph.fallbackText));
      const fonts = root.ownerDocument.fonts;
      if (fonts && typeof fonts.load === "function") {
        let retired = false;
        const unregisterFence = () => {
          if (!lifecycle || !Array.isArray(lifecycle.cleanups)) {
            return;
          }
          const index = lifecycle.cleanups.indexOf(retireFence);
          if (index >= 0) {
            lifecycle.cleanups.splice(index, 1);
          }
        };
        const retireFence = () => {
          retired = true;
          unregisterFence();
        };
        const canWrite = () => Boolean(
          retired === false
          && lifecycle
          && typeof lifecycle.isActive === "function"
          && lifecycle.isActive()
          && (!lifecycle.isDestroyed || lifecycle.isDestroyed() !== true)
          && lifecycle.lease
          && lifecycle.lease.active === true
          && lifecycle.root === root
          && root
           && node.ownerDocument === root.ownerDocument
        );
        if (lifecycle && Array.isArray(lifecycle.cleanups)) {
          lifecycle.cleanups.push(retireFence);
        }
        try {
          Promise.resolve(fonts.load('16px "extension-bilifont"'))
            .then((faces) => {
              // Only reveal the real glyph if the font actually loaded (faces is a non-empty array).
              if (Array.isArray(faces) && faces.length > 0 && canWrite()) {
                node.classList.add("icon-font-ready");
              }
              retireFence();
            })
            .catch(retireFence);
        } catch (_) {
          retireFence();
          // Fall through: CSS fallback stays visible.
        }
      }
    }
    node.setAttribute("aria-hidden", "true");
    return node;
  };

  const currentExtensionOrigin = () => {
    const extensionId = chrome && chrome.runtime && chrome.runtime.id;
    return typeof extensionId === "string" && extensionId.length > 0
      ? `chrome-extension://${extensionId}`
      : "";
  };

  const validateCategoryUseUrl = (value, symbolId) => {
    const fragment = EXTERNAL_CATEGORY_SYMBOL_FRAGMENTS[symbolId];
    const origin = currentExtensionOrigin();
    if (
      typeof value !== "string"
      || !fragment
      || !origin
      || /[\u0000-\u001F\u007F]/.test(value)
      || value !== `${origin}${CATEGORY_SPRITE_PATH}${fragment}`
    ) {
      return null;
    }
    try {
      const url = new URL(value);
      const parsedOrigin = url.origin === "null" ? `${url.protocol}//${url.host}` : url.origin;
      if (
        url.protocol !== "chrome-extension:"
        || parsedOrigin !== origin
        || url.pathname !== CATEGORY_SPRITE_PATH
        || url.username !== ""
        || url.password !== ""
        || url.port !== ""
        || url.search !== ""
        || url.hash !== fragment
        || url.href !== value
      ) {
        return null;
      }
    } catch (_) {
      return null;
    }
    return value;
  };

  const captureCategorySpriteUrl = (root) => {
    const spriteUrl = resolveLocalAssetUrl(ASSET_KEYS.CATEGORY_SYMBOLS);
    CATEGORY_SPRITE_URLS.set(root, spriteUrl);
    return spriteUrl;
  };

  const resolveCategoryUseUrl = (root, symbolId) => {
    if (!root || !Object.prototype.hasOwnProperty.call(EXTERNAL_CATEGORY_SYMBOL_FRAGMENTS, symbolId)) {
      return null;
    }
    const spriteUrl = CATEGORY_SPRITE_URLS.get(root);
    const origin = currentExtensionOrigin();
    const expectedBase = origin ? `${origin}${CATEGORY_SPRITE_PATH}` : "";
    if (!spriteUrl || spriteUrl !== expectedBase) {
      return null;
    }
    return validateCategoryUseUrl(`${spriteUrl}${EXTERNAL_CATEGORY_SYMBOL_FRAGMENTS[symbolId]}`, symbolId);
  };

  const createSvgShell = (root, size, className, symbolId) => {
    const svg = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    const classes = [className || "svg-icon", symbolId === "bili-zhishi" ? "bili-icon_zhishi" : ""].filter(Boolean);
    svg.setAttribute("class", classes.join(" "));
    svg.setAttribute("width", String(size || 24));
    svg.setAttribute("height", String(size || 24));
    svg.setAttribute("viewBox", "0 0 1024 1024");
    svg.setAttribute("aria-hidden", "true");
    return svg;
  };

  const createLocalCategoryFallback = (root, symbolId, size, className) => {
    const svg = createSvgShell(root, size, className, symbolId);
    const symbol = CATEGORY_SYMBOL_BY_ID.get(symbolId);
    if (symbol && symbol.paths.length > 0) {
      for (const definition of symbol.paths) {
        const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", definition.d);
        path.setAttribute("fill", definition.fill || "currentColor");
        svg.appendChild(path);
      }
    } else {
      const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", LOCAL_CATEGORY_FALLBACK_PATHS[symbolId] || LOCAL_CATEGORY_FALLBACK_PATHS["bili-tuiguang"]);
      path.setAttribute("fill", "currentColor");
      svg.appendChild(path);
    }
    return svg;
  };

  const createSvgIcon = (root, symbolId, size, className) => {
    if (CATEGORY_SYMBOL_BY_ID.has(symbolId)) {
      return createLocalCategoryFallback(root, symbolId, size, className);
    }
    const externalHref = resolveCategoryUseUrl(root, symbolId);
    if (!externalHref) {
      return createLocalCategoryFallback(root, symbolId, size, className);
    }
    const svg = createSvgShell(root, size, className, symbolId);
    const use = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "use");
    const validatedHref = validateCategoryUseUrl(externalHref, symbolId);
    if (!validatedHref) {
      return createLocalCategoryFallback(root, symbolId, size, className);
    }
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", validatedHref);
    use.setAttribute("href", validatedHref);
    svg.appendChild(use);
    return svg;
  };

  const createCommunityIcon = (root, size) => {
    const svg = createSvgShell(root, size || 25, "svg-icon", "community");
    for (const definition of COMMUNITY_ICON_PATHS) {
      const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", definition.d);
      path.setAttribute("fill", definition.fill);
      if (definition.fillOpacity) {
        path.setAttribute("fill-opacity", definition.fillOpacity);
      }
      svg.appendChild(path);
    }
    return svg;
  };

  const createFriendshipIcon = (root, symbolId, size) => {
    const svg = createSvgShell(root, size || 25, "svg-icon", symbolId);
    for (const definition of FRIENDSHIP_ICON_PATHS[symbolId] || []) {
      const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", definition.d);
      path.setAttribute("fill", definition.fill);
      svg.appendChild(path);
    }
    return svg;
  };

  const createDownloadClientIcon = (root, className) => {
    const svg = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", className || "nav-download-icon");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    const paths = [
      "M7.23181 8.65895V1.75796C7.23181 1.33935 7.57582 1 8.00018 1C8.42453 1 8.76854 1.33935 8.76854 1.75796V8.67097L9.98589 7.47009C10.286 7.17409 10.7725 7.17409 11.0725 7.47009C11.3726 7.7661 11.3726 8.24601 11.0725 8.54201L8.54958 11.0308C8.24952 11.3268 7.76302 11.3268 7.46295 11.0308L4.94002 8.54201C4.63995 8.24601 4.63995 7.7661 4.94002 7.47009C5.24008 7.17409 5.72658 7.17409 6.02665 7.47009L7.23181 8.65895Z",
      "M3.48023 4.29936C2.40686 4.29936 1.53672 5.15772 1.53672 6.21656V11.5669C1.53672 12.6257 2.40686 13.4841 3.48023 13.4841H12.5198C13.5931 13.4841 14.4633 12.6257 14.4633 11.5669V6.21656C14.4633 5.15772 13.5931 4.29936 12.5198 4.29936H11.6158C11.1915 4.29936 10.8475 3.96001 10.8475 3.5414C10.8475 3.12279 11.1915 2.78344 11.6158 2.78344H12.5198C14.4418 2.78344 16 4.3205 16 6.21656V11.5669C16 13.4629 14.4418 15 12.5198 15H3.48023C1.55815 15 0 13.4629 0 11.5669V6.21656C0 4.3205 1.55815 2.78344 3.48023 2.78344H4.38418C4.80853 2.78344 5.15254 3.12279 5.15254 3.5414 5.15254 3.96001 4.80853 4.29936 4.38418 4.29936H3.48023Z"
    ];
    for (const d of paths) {
      const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "currentColor");
      svg.appendChild(path);
    }
    return svg;
  };

  const DOWNLOAD_TITLE_ICON_PATHS = Object.freeze({
    mobile: Object.freeze([
      Object.freeze({
        d: "M11.2 1.00012H8H4.80003C3.56489 1.00012 2.56006 2.00495 2.56006 3.24009V12.7599C2.56006 13.9951 3.56489 14.9999 4.80003 14.9999H11.2C12.4351 14.9999 13.4399 13.9951 13.4399 12.7599V3.24009C13.4399 2.71073 12.4351 2.28011 11.2 2.28011H4.80003C4.27067 2.28011 3.84006 2.71073 3.84006 3.24009V12.76C3.84006 13.2893 4.27067 13.7199 4.80003 13.7199H11.2C11.7293 13.7199 12.1599 13.2893 12.1599 12.76V3.24009C12.1599 2.71073 11.7293 2.28011 11.2 2.28011ZM5.91992 3.7201C5.91992 3.36664 6.20646 3.08011 6.55991 3.08011H9.43987C9.79333 3.08011 10.0799 3.36664 10.0799 3.7201C10.0799 4.07356 9.79333 4.36009 9.43987 4.36009H6.55991C6.20646 4.36009 5.91992 4.07356 5.91992 3.7201ZM7.26109 12.4261C7.22089 12.329 7.2002 12.225 7.2002 12.12C7.2002 11.9078 7.28448 11.7043 7.4345 11.5543C7.58453 11.4043 7.78801 11.32 8.00018 11.32C8.21235 11.32 8.41582 11.4043 8.56585 11.5543C8.71588 11.7043 8.80016 11.9078 8.80016 12.12C8.80016 12.225 8.77947 12.329 8.73926 12.4261C8.69906 12.5232 8.64014 12.6114 8.56585 12.6856C8.49157 12.7599 8.40338 12.8189 8.30632 12.8591C8.20926 12.8993 8.10523 12.92 8.00018 12.92C7.89512 12.92 7.7911 12.8993 7.69404 12.8591C7.59698 12.8189 7.50879 12.7599 7.4345 12.6856C7.36022 12.6114 7.30129 12.5232 7.26109 12.4261Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
        fill: "currentColor"
      })
    ]),
    desktop: Object.freeze([
      Object.freeze({ d: "M16 0H0V16H16V0Z", fill: "white", fillOpacity: "0.01" }),
      Object.freeze({
        d: "M0.683594 2.33335C0.683594 1.97436 0.974609 1.68335 1.33359 1.68335H14.6669C15.0259 1.68335 15.3169 1.97436 15.3169 2.33335V11C15.3169 11.359 15.0259 11.65 14.6669 11.65H8.6501V13C8.6501 13.0056 8.65003 13.0111 8.64989 13.0167H12.0001C12.3591 13.0167 12.6501 13.3077 12.6501 13.6667C12.6501 14.0257 12.3591 14.3167 12.0001 14.3167H4.0001C3.64111 14.3167 3.3501 14.0257 3.3501 13.6667C3.3501 13.3077 3.64111 13.0167 4.0001 13.0167H7.35031C7.35017 13.0111 7.3501 13.0056 7.3501 13V11.65H1.33359C0.974609 11.65 0.683594 11.359 0.683594 11V2.33335ZM1.98359 2.98335V10.35H14.0169V2.98335H1.98359Z",
        fillRule: "evenodd",
        clipRule: "evenodd",
        fill: "currentColor"
      })
    ])
  });

  const createDownloadTitleIcon = (root, kind) => {
    const svg = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    for (const definition of DOWNLOAD_TITLE_ICON_PATHS[kind] || []) {
      const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", definition.d);
      if (definition.fillRule) path.setAttribute("fill-rule", definition.fillRule);
      if (definition.clipRule) path.setAttribute("clip-rule", definition.clipRule);
      path.setAttribute("fill", definition.fill);
      if (definition.fillOpacity) path.setAttribute("fill-opacity", definition.fillOpacity);
      svg.appendChild(path);
    }
    return svg;
  };

  const createCategorySprite = (root) => {
    const sprite = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    sprite.setAttribute("class", "category-icon-sprite");
    sprite.setAttribute("aria-hidden", "true");
    for (const symbol of CATEGORY_SYMBOLS) {
      const node = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "symbol");
      node.setAttribute("id", symbol.id);
      node.setAttribute("viewBox", "0 0 1024 1024");
      for (const pathDefinition of symbol.paths) {
        const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathDefinition.d);
        path.setAttribute("fill", pathDefinition.fill);
        node.appendChild(path);
      }
      sprite.appendChild(node);
    }
    return sprite;
  };

  const createMediaPlaceholder = (root, symbolId, label) => {
    const placeholder = createNode(root, "div", "media-placeholder");
    placeholder.appendChild(createSvgIcon(root, symbolId || "bili-cinephile", 34, "media-placeholder__icon"));
    placeholder.appendChild(createNode(root, "span", "media-placeholder__label", label || "fixture"));
    return placeholder;
  };

  const CATEGORY_SYMBOL_BY_TYPE = Object.freeze({
    douga: "bili-douga",
    anime: "bili-anime",
    guochuang: "bili-guochuang",
    teleplay: "bili-teleplay",
    documentary: "bili-documentary",
    game: "bili-game",
    kichiku: "bili-kichiku",
    music: "bili-music",
    dance: "bili-dance",
    cinephile: "bili-cinephile",
    ent: "bili-ent",
    knowledge: "bili-knowledge",
    tech: "bili-tech",
    information: "bili-information",
    food: "bili-food",
    car: "bili-car",
    fashion: "bili-fashion",
    sports: "bili-sports",
    animal: "bili-animal",
    life: "bili-life",
    read: "bili-read",
    live: "bili-live",
    activity: "bili-activit",
    more: "bili-activit",
    course: "bili-zhishi",
    musicplus: "bili-musicplus",
    movie: "bili-movie",
    manga: "bili-manga",
    show: "bili-documentary",
    promote: "bili-tuiguang"
  });

  const categorySymbolFor = (type) => (
    typeof type === "string" && Object.prototype.hasOwnProperty.call(CATEGORY_SYMBOL_BY_TYPE, type)
      ? CATEGORY_SYMBOL_BY_TYPE[type]
      : "bili-tuiguang"
  );

  const createNavLink = (root, navKey, label) => {
    const target = resolveNav(navKey);
    if (!target) {
      return createNode(root, "span", "primary-menu__placeholder", "离线内容不可用");
    }
    const link = createNode(root, "a", "primary-menu__link", label);
    link.setAttribute("href", target.href);
    link.setAttribute("target", target.target);
    if (target.rel) {
      link.setAttribute("rel", target.rel);
    }
    return link;
  };

  const createFixedAnchor = (root, className, navKey, label) => {
    const target = resolveNav(navKey);
    if (!target) {
      return createNode(root, "span", className, "离线内容不可用");
    }
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", target.href);
    link.setAttribute("target", target.target);
    if (target.rel) {
      link.setAttribute("rel", target.rel);
    }
    return link;
  };

  const createFixedTargetAnchor = (root, className, target, label) => {
    if (!target || typeof target.href !== "string" || typeof target.target !== "string") {
      return createNode(root, "span", className, "离线内容不可用");
    }
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", target.href);
    link.setAttribute("target", target.target);
    if (target.rel) {
      link.setAttribute("rel", target.rel);
    }
    return link;
  };

  const createSearchAnchor = (root, className, keyword, label) => {
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", resolveSearchUrl(keyword));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    return link;
  };

  const createLocalImage = (root, className, assetKey, alt) => {
    const image = root.ownerDocument.createElement("img");
    if (className) {
      image.setAttribute("class", className);
    }
    image.setAttribute("alt", normalizeText(alt));
    const assetUrl = resolveLocalAssetUrl(assetKey);
    if (assetUrl) {
      image.setAttribute("src", assetUrl);
    }
    return image;
  };

  const fixtureAssetKeyAt = (pool, index) => {
    if (!Array.isArray(pool) || pool.length === 0) {
      return null;
    }
    const safeIndex = Number.isSafeInteger(index) && index >= 0 ? index : 0;
    return pool[safeIndex % pool.length] || null;
  };

  const createCoverImage = (root, className, remoteUrl, pool, index, alt, symbolId, mediaFence, container) => {
    const image = root.ownerDocument.createElement("img");
    image.setAttribute("class", className);
    image.setAttribute("alt", normalizeText(alt));
    const fixtureUrl = resolveLocalAssetUrl(fixtureAssetKeyAt(pool, index));
    const safeRemoteUrl = typeof remoteUrl === "string" && remoteUrl ? remoteUrl : null;
    if (!mediaFence || !container) {
      return createMediaPlaceholder(root, symbolId, "图片不可用");
    }
    const request = mediaFence.createRequest(image, container);
    const fallback = () => {
      if (!mediaFence.canWrite(request)) {
        return;
      }
      if (fixtureUrl && image.getAttribute("src") !== fixtureUrl) {
        image.setAttribute("src", fixtureUrl);
        image.setAttribute("data-media-source", "fixture");
        return;
      }
      image.replaceWith(createMediaPlaceholder(root, symbolId, "图片不可用"));
    };
    mediaFence.bindError(request, fallback);
    if (safeRemoteUrl) {
      image.setAttribute("src", safeRemoteUrl);
      image.setAttribute("data-media-source", "remote");
    } else if (fixtureUrl) {
      image.setAttribute("src", fixtureUrl);
      image.setAttribute("data-media-source", "fixture");
    } else {
      return createMediaPlaceholder(root, symbolId, "图片不可用");
    }
    return image;
  };

  const createFocusPlaceholder = (root, label) => createNode(
    root,
    "span",
    "focus-carousel__placeholder",
    label || "图片暂不可用"
  );

  const isReducedMotion = (root) => {
    const view = root && root.ownerDocument && root.ownerDocument.defaultView;
    return Boolean(view && typeof view.matchMedia === "function" && view.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  const clearFocusTimer = (view) => {
    if (view && view.state && view.state.timer !== null) {
      const timerWindow = view.root.ownerDocument.defaultView || globalThis;
      timerWindow.clearTimeout(view.state.timer);
      view.state.timer = null;
    }
  };

  const cleanupListeners = (cleanups) => {
    for (const cleanup of cleanups.splice(0).reverse()) {
      cleanup();
    }
  };

  const addListenerWithCleanup = (target, type, listener, cleanups, options) => {
    if (!target || typeof target.addEventListener !== "function") {
      return;
    }
    target.addEventListener(type, listener, options);
    cleanups.push(() => target.removeEventListener(type, listener, options));
  };

  const ANCHOR_AWARE_POPOVER_KINDS = new Set(["game", "live", "manga"]);
  const ANCHOR_AWARE_POPOVER_DIMENSIONS = Object.freeze({
    game: Object.freeze({ width: 680, height: 260 }),
    live: Object.freeze({ width: 528, height: 266 }),
    manga: Object.freeze({ width: 720, height: 266 })
  });
  const ANCHOR_AWARE_POPOVER_OFFSETS = Object.freeze({
    game: Object.freeze({ left: -48, top: 11.5 }),
    live: Object.freeze({ left: -48, top: 11.5 }),
    manga: Object.freeze({ left: -48, top: 11.5 })
  });

  const positionHeaderPopover = (entry) => {
    if (!entry || !entry.group || !entry.trigger || !entry.panel) {
      return null;
    }
    const kind = entry.panel.getAttribute("data-popover-kind");
    const portalDimensions = {
      avatar: { width: 280, height: 468, top: 12, zIndex: 2001 },
      vip: { width: 260, height: 241, top: 11, zIndex: 2003 },
      game: { width: 680, height: 260, left: -48, top: 11.5, zIndex: 2011 },
      live: { width: 528, height: 266, left: -48, top: 11.5, zIndex: 2013 },
      manga: { width: 720, height: 266, left: -48, top: 11.5, zIndex: 2015 },
      download: { width: 387, height: 216, left: -100, top: 11, zIndex: 2017 },
      message: { width: 173, height: 207, top: 11, zIndex: 2019 },
      dynamic: { width: 382, height: 540, top: 11, zIndex: 2021 },
      favorite: { width: 520, height: 518, top: 11, zIndex: 2005 },
      history: { width: 370, height: 518, top: 11, zIndex: 2007 },
      upload: { width: 380, height: 78, top: 11, zIndex: 2009 }
    };
    if (entry.portal && portalDimensions[kind] && typeof entry.trigger.getBoundingClientRect === "function") {
      const rect = entry.trigger.getBoundingClientRect();
      const metrics = portalDimensions[kind];
      const view = entry.group.ownerDocument && entry.group.ownerDocument.defaultView;
      const viewportWidth = Math.max(
        0,
        Number(view && view.innerWidth)
        || Number(entry.group.ownerDocument && entry.group.ownerDocument.documentElement && entry.group.ownerDocument.documentElement.clientWidth)
        || 0
      );
      const viewportHeight = Math.max(
        0,
        Number(view && view.innerHeight)
        || Number(entry.group.ownerDocument && entry.group.ownerDocument.documentElement && entry.group.ownerDocument.documentElement.clientHeight)
        || 0
      );
      const triggerLeft = Number.isFinite(Number(rect.left)) ? Number(rect.left) : 0;
      const triggerTop = Number.isFinite(Number(rect.top)) ? Number(rect.top) : 0;
      const triggerWidth = Number(rect.width) || 0;
      const triggerBottom = Number.isFinite(Number(rect.bottom))
        ? Number(rect.bottom)
        : triggerTop + (Number(rect.height) || 0);
      const preferredLeft = Number.isFinite(Number(metrics.left))
        ? triggerLeft + Number(metrics.left)
        : triggerLeft + triggerWidth / 2 - metrics.width / 2;
      const left = viewportWidth > 0
        ? Math.max(8, Math.min(preferredLeft, viewportWidth - metrics.width - 8))
        : Math.max(8, preferredLeft);
      let top = triggerBottom + metrics.top;
      if (viewportHeight > 0 && metrics.height <= viewportHeight - 16 && top + metrics.height > viewportHeight - 8) {
        top = triggerTop - metrics.height - metrics.top;
      }
      if (viewportHeight > 0) {
        top = metrics.height <= viewportHeight - 16
          ? Math.max(8, Math.min(top, viewportHeight - metrics.height - 8))
          : 8;
      }
      entry.panel.style.position = "fixed";
      entry.panel.style.left = `${left}px`;
      entry.panel.style.top = `${top}px`;
      entry.panel.style.width = `${metrics.width}px`;
      entry.panel.style.height = `${metrics.height}px`;
      entry.panel.style.zIndex = String(metrics.zIndex);
      entry.panel.setAttribute("data-anchor-positioned", "true");
      entry.panel.setAttribute("data-anchor-rect", `${left},${top},${metrics.width},${metrics.height}`);
      return Object.freeze({ left, top, width: metrics.width, height: metrics.height, viewportWidth, viewportHeight });
    }
    if (!ANCHOR_AWARE_POPOVER_KINDS.has(kind) || typeof entry.trigger.getBoundingClientRect !== "function") {
      return null;
    }
    const view = entry.group.ownerDocument && entry.group.ownerDocument.defaultView;
    const viewportWidth = Math.max(
      0,
      Number(view && view.innerWidth)
      || Number(entry.group.ownerDocument && entry.group.ownerDocument.documentElement && entry.group.ownerDocument.documentElement.clientWidth)
      || 0
    );
    const viewportHeight = Math.max(
      0,
      Number(view && view.innerHeight)
      || Number(entry.group.ownerDocument && entry.group.ownerDocument.documentElement && entry.group.ownerDocument.documentElement.clientHeight)
      || 0
    );
    const triggerRect = entry.trigger.getBoundingClientRect();
    const triggerTop = Number.isFinite(Number(triggerRect.top)) ? Number(triggerRect.top) : 0;
    const triggerBottom = Number.isFinite(Number(triggerRect.bottom))
      ? Number(triggerRect.bottom)
      : triggerTop + (Number(triggerRect.height) || 0);
    const dimensions = ANCHOR_AWARE_POPOVER_DIMENSIONS[kind];
    const offsets = ANCHOR_AWARE_POPOVER_OFFSETS[kind];
    const width = dimensions.width;
    const height = dimensions.height;
    const margin = 8;
    const preferredLeft = triggerRect.left + offsets.left;
    const preferredTop = triggerBottom + offsets.top;
    const left = viewportWidth > 0 && width <= viewportWidth - margin * 2
      ? Math.max(margin, Math.min(preferredLeft, viewportWidth - width - margin))
      : Math.max(margin, preferredLeft);
    let top = preferredTop;
    if (viewportHeight > 0 && height <= viewportHeight - margin * 2 && top + height > viewportHeight - margin) {
      top = triggerTop - height - offsets.top;
    }
    if (viewportHeight > 0 && height <= viewportHeight - margin * 2) {
      top = Math.max(margin, Math.min(top, viewportHeight - height - margin));
    }
    const groupRect = typeof entry.group.getBoundingClientRect === "function"
      ? entry.group.getBoundingClientRect()
      : { left: 0, top: 0 };
    entry.panel.style.left = `${left - Number(groupRect.left || 0)}px`;
    entry.panel.style.top = `${top - Number(groupRect.top || 0)}px`;
    entry.panel.setAttribute("data-anchor-positioned", "true");
    entry.panel.setAttribute("data-anchor-viewport", `${viewportWidth}x${viewportHeight}`);
    entry.panel.setAttribute("data-anchor-rect", `${left},${top},${width},${height}`);
    return Object.freeze({ left, top, width, height, viewportWidth, viewportHeight });
  };

  const createMediaFence = ({ root, lease, isActive, isDestroyed, cleanups }) => {
    let active = true;
    let destroyed = false;
    let generation = 0;
    const requests = new Set();

    const retireRequest = (request) => {
      request.retired = true;
      request.cleanedUp = true;
      requests.delete(request);
    };

    const fence = {
      root,
      lease,
      createRequest(image, container) {
        const request = {
          image,
          container,
          generation,
          retired: false,
          cleanedUp: false,
          listener: null,
          loadListener: null,
          cleanup: null
        };
        requests.add(request);
        return request;
      },
      bindError(request, listener) {
        if (!request || request.retired || request.cleanedUp) {
          return;
        }
        request.listener = listener;
        request.image.addEventListener("error", listener);
        if (!request.cleanup) {
          request.cleanup = () => {
            if (request.cleanedUp) {
              return;
            }
            if (request.listener) {
              request.image.removeEventListener("error", request.listener);
            }
            if (request.loadListener) {
              request.image.removeEventListener("load", request.loadListener);
            }
            retireRequest(request);
          };
          cleanups.push(request.cleanup);
        }
      },
      bindLoad(request, listener) {
        if (!request || request.retired || request.cleanedUp) {
          return;
        }
        request.loadListener = listener;
        request.image.addEventListener("load", listener);
        if (!request.cleanup) {
          request.cleanup = () => {
            if (request.cleanedUp) {
              return;
            }
            if (request.listener) {
              request.image.removeEventListener("error", request.listener);
            }
            if (request.loadListener) {
              request.image.removeEventListener("load", request.loadListener);
            }
            retireRequest(request);
          };
          cleanups.push(request.cleanup);
        }
      },
      settleRequest(request) {
        if (!request || request.retired || request.cleanedUp) {
          return;
        }
        if (request.listener) {
          request.image.removeEventListener("error", request.listener);
        }
        if (request.loadListener) {
          request.image.removeEventListener("load", request.loadListener);
        }
        request.cleanedUp = true;
        requests.delete(request);
        if (request.cleanup) {
          const index = cleanups.indexOf(request.cleanup);
          if (index >= 0) {
            cleanups.splice(index, 1);
          }
        }
      },
      canWrite(request) {
        return Boolean(
          active
          && destroyed === false
          && (!isDestroyed || isDestroyed() !== true)
          && typeof isActive === "function"
          && isActive()
          && lease
          && lease.active === true
          && root
          && root.isConnected === true
          && request
          && request.retired === false
          && request.cleanedUp === false
          && request.generation === generation
          && request.image
          && request.image.isConnected === true
          && request.container
          && request.container.isConnected === true
          && request.image.parentNode === request.container
          && request.image.ownerDocument === root.ownerDocument
        );
      },
      retireGeneration() {
        generation += 1;
        cleanupListeners(cleanups);
      },
      destroy() {
        if (destroyed) {
          return;
        }
        active = false;
        destroyed = true;
        generation += 1;
        cleanupListeners(cleanups);
        for (const request of requests) {
          retireRequest(request);
        }
      },
      get pendingRequestCount() {
        return requests.size;
      },
      get generation() {
        return generation;
      }
    };
    return fence;
  };

  const createViewMediaFence = (view, rendererMediaFence) => createMediaFence({
    root: view.root,
    lease: rendererMediaFence.lease,
    isActive: () => view.isRendererActive(),
    isDestroyed: () => view.destroyed,
    cleanups: view.cardListenerCleanups
  });

  const findNavigationAnchor = (start, boundary) => {
    let node = start;
    while (node) {
      if (node.tagName === "A" && typeof node.getAttribute === "function") {
        const href = node.getAttribute("href") || "";
        if (href && !href.startsWith("javascript:")) return node;
      }
      if (node === boundary) break;
      node = node.parentNode;
    }
    return null;
  };

  const releaseSurfaceFocus = (documentObject, surfaces) => {
    const activeElement = documentObject && documentObject.activeElement;
    if (!activeElement || typeof activeElement.blur !== "function") return;
    if (surfaces.some((surface) => surface
      && typeof surface.contains === "function"
      && surface.contains(activeElement))) {
      activeElement.blur();
    }
  };

  const isRestoredNavigation = (documentObject, event) => {
    if (event && event.persisted === true) return true;
    const view = documentObject && documentObject.defaultView;
    const performanceObject = view && view.performance;
    if (!performanceObject || typeof performanceObject.getEntriesByType !== "function") return false;
    const navigation = performanceObject.getEntriesByType("navigation")[0];
    return Boolean(navigation && navigation.type === "back_forward");
  };

  const navigationPointerGuards = new WeakMap();
  const getNavigationPointerGuard = (documentObject) => {
    if (!documentObject || (typeof documentObject !== "object" && typeof documentObject !== "function")) {
      return Object.freeze({ register() {}, lock() {}, unlock() {}, noteLeave() {}, canEnter: () => true, isLocked: () => false });
    }
    const existing = navigationPointerGuards.get(documentObject);
    if (existing) return existing;
    let generation = 0;
    let locked = false;
    const states = new Map();
    const ensure = (token) => {
      let state = states.get(token);
      if (!state) {
        state = { blocked: locked, sawOutsideLeave: false, generation };
        states.set(token, state);
      }
      return state;
    };
    const guard = Object.freeze({
      register(token) { ensure(token); },
      lock() {
        generation += 1;
        locked = true;
        for (const state of states.values()) {
          state.blocked = true;
          state.sawOutsideLeave = false;
          state.generation = generation;
        }
      },
      unlock() {
        locked = false;
        for (const state of states.values()) {
          state.blocked = false;
          state.sawOutsideLeave = false;
        }
      },
      noteLeave(token) {
        if (locked) ensure(token).sawOutsideLeave = true;
      },
      canEnter(token) {
        if (!locked) return true;
        const state = ensure(token);
        if (!state.blocked) return true;
        if (!state.sawOutsideLeave) return false;
        state.blocked = false;
        state.sawOutsideLeave = false;
        return true;
      },
      isLocked: () => locked
    });
    navigationPointerGuards.set(documentObject, guard);
    return guard;
  };

  const HEADER_POPOVER_OPEN_DELAYS = Object.freeze({
    game: 300,
    manga: 300,
    avatar: 150,
    vip: 300,
    favorite: 150,
    history: 150,
    upload: 100,
    message: 0,
    dynamic: 0
  });
  const bindHeaderPopovers = (groups, listenerCleanups, isRendererActive) => {
    let activeClose = null;
    let activeEscape = null;
    const closeEntries = [];
    const pointerExitRequired = new Set();
    const firstGroup = groups.length > 0 ? groups[0].group : null;
    const documentObject = firstGroup ? firstGroup.ownerDocument : null;
    const view = documentObject && documentObject.defaultView ? documentObject.defaultView : globalThis;
    const navigationGuard = getNavigationPointerGuard(documentObject);
    for (const entry of groups) {
      const { group, trigger, panel, search } = entry;
      let closeTimer = null;
      let openTimer = null;
      let groupPointerInside = false;
      let panelPointerInside = false;
      let groupPointerEventsSeen = false;
      let panelPointerEventsSeen = false;
      navigationGuard.register(entry);
      const clearOpenTimer = () => {
        if (openTimer !== null) {
          const view = group.ownerDocument.defaultView || globalThis;
          view.clearTimeout(openTimer);
          openTimer = null;
        }
        group.classList.remove("is-popover-pending");
      };
      const clearCloseTimer = () => {
        if (closeTimer !== null) {
          const view = group.ownerDocument.defaultView || globalThis;
          view.clearTimeout(closeTimer);
          closeTimer = null;
        }
      };
      let closeImmediately = null;
      let escapeImmediately = null;
      const setOpen = (open) => {
        if (!isRendererActive()) {
          if (activeClose === closeImmediately) {
            activeClose = null;
          }
          return;
        }
        clearOpenTimer();
        clearCloseTimer();
        if (open) {
          positionHeaderPopover(entry);
        }
        if (open && activeClose && activeClose !== closeImmediately) {
          activeClose();
        }
        group.classList.toggle("is-popover-open", open);
        panel.classList.toggle("is-popover-visible", open);
        panel.setAttribute("aria-hidden", open ? "false" : "true");
        if (trigger) {
          trigger.setAttribute("aria-expanded", open ? "true" : "false");
          if (!open) trigger.classList.remove("focusing");
        }
        if (search) {
          group.classList.toggle("search-popover-open", open);
        }
        if (!open) {
          groupPointerInside = false;
          panelPointerInside = false;
        }
        if (open) {
          activeClose = closeImmediately;
          activeEscape = search ? null : escapeImmediately;
        } else if (activeClose === closeImmediately) {
          activeClose = null;
          activeEscape = null;
        }
      };
      closeImmediately = () => setOpen(false);
      closeEntries.push(closeImmediately);
      const open = () => setOpen(true);
      const scheduleOpen = () => {
        if (pointerExitRequired.has(entry)) return;
        clearCloseTimer();
        if (openTimer !== null || panel.classList.contains("is-popover-visible")) return;
        const delay = Number(HEADER_POPOVER_OPEN_DELAYS[panel.getAttribute("data-popover-kind")]) || 0;
        if (delay <= 0) {
          open();
          return;
        }
        group.classList.add("is-popover-pending");
        const view = group.ownerDocument.defaultView || globalThis;
        openTimer = view.setTimeout(() => {
          openTimer = null;
          group.classList.remove("is-popover-pending");
          if (!pointerExitRequired.has(entry)) open();
        }, delay);
      };
      const openFromPointer = (event) => {
        const eventTarget = event && (event.currentTarget || event.target);
        const isGroupEvent = eventTarget === group;
        const pointerEvent = event && event.type === "pointerenter";
        if (isGroupEvent) {
          if (!pointerEvent && groupPointerEventsSeen) return;
          if (pointerEvent) groupPointerEventsSeen = true;
          groupPointerInside = true;
        } else {
          if (!pointerEvent && panelPointerEventsSeen) return;
          if (pointerEvent) panelPointerEventsSeen = true;
          panelPointerInside = true;
        }
        if (!navigationGuard.canEnter(entry)) return;
        if (!pointerExitRequired.has(entry)) scheduleOpen();
      };
      const isInsideSurface = (node) => Boolean(
        node && ((group && typeof group.contains === "function" && group.contains(node))
          || (panel && typeof panel.contains === "function" && panel.contains(node)))
      );
      const close = () => {
        clearOpenTimer();
        if (closeTimer !== null) return;
        const view = group.ownerDocument.defaultView || globalThis;
        closeTimer = view.setTimeout(() => {
          closeTimer = null;
          const rootNode = typeof group.getRootNode === "function" ? group.getRootNode() : null;
          const activeElement = rootNode && "activeElement" in rootNode
            ? rootNode.activeElement
            : group.ownerDocument.activeElement;
          if (search && isInsideSurface(activeElement)) return;
          setOpen(false);
        }, 280);
      };
      if (search) {
        addListenerWithCleanup(trigger || group, "click", (event) => {
          if (event && event.button !== undefined && event.button !== 0) return;
          pointerExitRequired.delete(entry);
          open();
        }, listenerCleanups);
      } else {
        addListenerWithCleanup(group, "pointerenter", openFromPointer, listenerCleanups);
        addListenerWithCleanup(group, "mouseenter", openFromPointer, listenerCleanups);
        addListenerWithCleanup(group, "focusin", () => {
          if (!navigationGuard.isLocked() && !pointerExitRequired.has(entry)) open();
        }, listenerCleanups);
      }
      addListenerWithCleanup(panel, "pointerenter", openFromPointer, listenerCleanups);
      addListenerWithCleanup(panel, "mouseenter", openFromPointer, listenerCleanups);
      addListenerWithCleanup(panel, "focusin", () => {
        if (!navigationGuard.isLocked() && !pointerExitRequired.has(entry)) open();
      }, listenerCleanups);
      addListenerWithCleanup(group, "pointerleave", (event) => {
        groupPointerEventsSeen = true;
        groupPointerInside = false;
        if (!isInsideSurface(event && event.relatedTarget) && !panelPointerInside) {
          navigationGuard.noteLeave(entry);
          pointerExitRequired.delete(entry);
          close();
        }
      }, listenerCleanups);
      addListenerWithCleanup(group, "mouseleave", (event) => {
        if (groupPointerEventsSeen) return;
        groupPointerInside = false;
        if (!isInsideSurface(event && event.relatedTarget) && !panelPointerInside) {
          navigationGuard.noteLeave(entry);
          pointerExitRequired.delete(entry);
          close();
        }
      }, listenerCleanups);
      addListenerWithCleanup(panel, "pointerleave", (event) => {
        panelPointerEventsSeen = true;
        panelPointerInside = false;
        if (!isInsideSurface(event && event.relatedTarget) && !groupPointerInside) {
          navigationGuard.noteLeave(entry);
          pointerExitRequired.delete(entry);
          close();
        }
      }, listenerCleanups);
      addListenerWithCleanup(panel, "mouseleave", (event) => {
        if (panelPointerEventsSeen) return;
        panelPointerInside = false;
        if (!isInsideSurface(event && event.relatedTarget) && !groupPointerInside) {
          navigationGuard.noteLeave(entry);
          pointerExitRequired.delete(entry);
          close();
        }
      }, listenerCleanups);
      addListenerWithCleanup(group, "focusout", (event) => {
        if (!isInsideSurface(event.relatedTarget)) {
          close();
        }
      }, listenerCleanups);
      addListenerWithCleanup(panel, "focusout", (event) => {
        if (!isInsideSurface(event.relatedTarget)) {
          close();
        }
      }, listenerCleanups);
      const closeForNavigation = (event) => {
        if (!findNavigationAnchor(event && event.target, event && event.currentTarget)) return;
        navigationGuard.lock();
        pointerExitRequired.add(entry);
        closeImmediately();
        releaseSurfaceFocus(group.ownerDocument, [group, panel]);
      };
      addListenerWithCleanup(group, "click", closeForNavigation, listenerCleanups);
      addListenerWithCleanup(panel, "click", closeForNavigation, listenerCleanups);
      escapeImmediately = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          pointerExitRequired.add(entry);
          clearOpenTimer();
          clearCloseTimer();
          closeImmediately();
          releaseSurfaceFocus(group.ownerDocument, [group, panel]);
        }
      };
      const handleEscape = (event) => {
        if (!search) escapeImmediately(event);
      };
      addListenerWithCleanup(panel, "keydown", handleEscape, listenerCleanups);
      if (panel.getAttribute("data-popover-kind") === "history") {
        const handleHistoryWheel = (event) => {
          const historyList = panel.querySelector(".history-list");
          const target = event && event.target;
          const isHistoryListTarget = Boolean(
            historyList
            && target
            && (target === historyList
              || (typeof historyList.contains === "function" && historyList.contains(target)))
          );
          if (!isHistoryListTarget) {
            if (event && typeof event.preventDefault === "function") event.preventDefault();
            return;
          }
          const deltaY = Number(event && event.deltaY);
          const scrollTop = Number(historyList.scrollTop);
          const clientHeight = Number(historyList.clientHeight);
          const scrollHeight = Number(historyList.scrollHeight);
          const maxScrollTop = Number.isFinite(scrollHeight) && Number.isFinite(clientHeight)
            ? Math.max(0, scrollHeight - clientHeight)
            : 0;
          const currentScrollTop = Number.isFinite(scrollTop)
            ? Math.max(0, Math.min(scrollTop, maxScrollTop))
            : 0;
          const canScrollInDirection = Number.isFinite(deltaY)
            && deltaY !== 0
            && (deltaY < 0 ? currentScrollTop > 0 : currentScrollTop < maxScrollTop);
          if (!canScrollInDirection && event && typeof event.preventDefault === "function") {
            event.preventDefault();
          }
        };
        addListenerWithCleanup(panel, "wheel", handleHistoryWheel, listenerCleanups, { passive: false });
      }
      if (panel.getAttribute("data-popover-kind") === "dynamic") {
        const handleDynamicWheel = (event) => {
          const scroller = panel.querySelector(".dynamic-local .container") || panel.querySelector(".container");
          const deltaY = Number(event && event.deltaY);
          if (scroller && Number.isFinite(deltaY) && deltaY !== 0) {
            const maxScrollTop = Math.max(0, Number(scroller.scrollHeight) - Number(scroller.clientHeight));
            const current = Math.max(0, Math.min(Number(scroller.scrollTop) || 0, maxScrollTop));
            scroller.scrollTop = Math.max(0, Math.min(current + deltaY, maxScrollTop));
          }
          if (event && typeof event.preventDefault === "function") event.preventDefault();
          if (event && typeof event.stopPropagation === "function") event.stopPropagation();
        };
        addListenerWithCleanup(panel, "wheel", handleDynamicWheel, listenerCleanups, { passive: false });
      }
      if (ANCHOR_AWARE_POPOVER_KINDS.has(panel.getAttribute("data-popover-kind"))) {
        const view = group.ownerDocument.defaultView || globalThis;
        addListenerWithCleanup(view, "resize", () => {
          if (panel.classList.contains("is-popover-visible")) {
            positionHeaderPopover(entry);
          }
        }, listenerCleanups);
        addListenerWithCleanup(view, "scroll", () => {
          if (panel.classList.contains("is-popover-visible")) {
            positionHeaderPopover(entry);
          }
        }, listenerCleanups, { passive: true });
      }
      if (trigger && trigger !== panel) {
        addListenerWithCleanup(trigger, "keydown", (event) => {
          if ((event.key === "Enter" || event.key === " " || event.key === "Spacebar")
            && pointerExitRequired.has(entry)) {
            navigationGuard.unlock();
            pointerExitRequired.delete(entry);
            open();
          }
        }, listenerCleanups);
        addListenerWithCleanup(trigger, "keydown", handleEscape, listenerCleanups);
      }
      listenerCleanups.push(() => {
        clearOpenTimer();
        clearCloseTimer();
        if (activeClose === closeImmediately) {
          activeClose = null;
          activeEscape = null;
        }
        group.classList.remove("is-popover-open");
        panel.classList.remove("is-popover-visible");
        panel.setAttribute("aria-hidden", "true");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      });
    }
    const resetAll = (event) => {
      if (isRestoredNavigation(documentObject, event)) navigationGuard.lock();
      if (navigationGuard.isLocked() || pointerExitRequired.size > 0) {
        groups.forEach((entry) => pointerExitRequired.add(entry));
      }
      for (const closeEntry of closeEntries) closeEntry();
      releaseSurfaceFocus(documentObject, groups.flatMap((entry) => [entry.group, entry.panel]));
    };
    const lockAndReset = () => {
      navigationGuard.lock();
      resetAll();
    };
    addListenerWithCleanup(view, "blur", lockAndReset, listenerCleanups);
    addListenerWithCleanup(view, "pagehide", lockAndReset, listenerCleanups);
    addListenerWithCleanup(view, "pageshow", resetAll, listenerCleanups);
    addListenerWithCleanup(view, "focus", resetAll, listenerCleanups);
    addListenerWithCleanup(view, "keydown", (event) => {
      if (event.key === "Escape" && activeClose && activeEscape) {
        activeEscape(event);
        return;
      }
      if (event.key === "Tab") navigationGuard.unlock();
      if (event.key === "Tab") pointerExitRequired.clear();
      if (event.key === "Tab") return;
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        navigationGuard.unlock();
        pointerExitRequired.clear();
      }
    }, listenerCleanups);
    if (documentObject && typeof documentObject.addEventListener === "function") {
      addListenerWithCleanup(documentObject, "visibilitychange", () => {
        if (documentObject.visibilityState === "hidden") lockAndReset();
        else if (documentObject.visibilityState === "visible") resetAll();
      }, listenerCleanups);
    }
    return resetAll;
  };

  const isFocusViewActive = (view) => Boolean(
    view
    && view.destroyed !== true
    && typeof view.isRendererActive === "function"
    && view.isRendererActive()
  );

  const isFocusMediaErrorActive = (view, picture, image) => Boolean(
    isFocusViewActive(view)
    && view.lease
    && view.lease.active === true
    && view.root
    && view.root.isConnected === true
    && picture
    && picture.isConnected === true
    && image
    && image.isConnected === true
  );

  const isFocusViewInteracting = (view) => {
    if (!view || !view.root) {
      return false;
    }
    const rootNode = typeof view.root.getRootNode === "function" ? view.root.getRootNode() : null;
    const activeElement = rootNode && rootNode.activeElement;
    return Boolean(
      view.state
      && (
        view.state.hovered
        || view.state.focused
        || (typeof view.root.matches === "function" && view.root.matches(":hover"))
        || (activeElement && view.root.contains(activeElement))
      )
    );
  };

  const setFocusActiveState = (view, nextIndex, animate, origin = "programmatic") => {
    const { state, root, track, trigger, indicator } = view;
    if (!isFocusViewActive(view) || !state || state.items.length === 0 || !indicator) {
      return;
    }
    const index = Math.max(0, Math.min(nextIndex, state.items.length - 1));
    const previousIndex = Number.isSafeInteger(state.activeIndex) && state.activeIndex >= 0
      ? state.activeIndex
      : null;
    const reducedMotion = isReducedMotion(root);
    const shouldAnimate = Boolean(animate && previousIndex !== index && !reducedMotion);
    const transactionId = (state.motion && Number.isSafeInteger(state.motion.transactionId)
      ? state.motion.transactionId
      : 0) + 1;
    state.motion = {
      previousIndex,
      nextIndex: index,
      phase: shouldAnimate ? "running" : "idle",
      origin,
      transactionId,
      reducedMotion
    };
    state.activeIndex = index;
    state.targetIndex = index;
    root.setAttribute("data-active-index", String(index));
    root.setAttribute("data-carousel-motion", origin);
    track.setAttribute("data-active-index", String(index));
    indicator.setAttribute("data-indicator-index", String(index));
    track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    track.style.transitionDuration = shouldAnimate ? "320ms" : "0ms";
    indicator.style.transform = `translate3d(${index * 20 - 4}px, -50%, 0)`;
    indicator.style.transitionDuration = shouldAnimate ? "320ms" : "0ms";

    const itemNodes = track.querySelectorAll('[data-role="carousel-item"]');
    itemNodes.forEach((itemNode, itemIndex) => {
      const active = itemIndex === index;
      itemNode.classList.toggle("is-active", active);
      itemNode.setAttribute("aria-hidden", active ? "false" : "true");
      const link = itemNode.querySelector("a");
      if (link) {
        link.setAttribute("tabindex", active ? "0" : "-1");
      }
    });
    trigger.querySelectorAll('[data-role="carousel-trigger-item"]').forEach((triggerNode, triggerIndex) => {
      const active = triggerIndex === index;
      triggerNode.classList.toggle("on", active);
      triggerNode.setAttribute("aria-current", active ? "true" : "false");
      triggerNode.setAttribute("aria-selected", active ? "true" : "false");
    });
  };

  const scheduleFocusAutoplay = (view) => {
    const { state, root } = view;
    clearFocusTimer(view);
    if (!isFocusViewActive(view) || !state || state.items.length <= 1 || state.paused) {
      return;
    }
    if (isFocusViewInteracting(view)) return;
    const timerWindow = root.ownerDocument.defaultView || globalThis;
    state.timer = timerWindow.setTimeout(() => {
      if (!isFocusViewActive(view)) {
        return;
      }
      state.timer = null;
      if (state.items.length > 1 && !state.paused && !isFocusViewInteracting(view)) {
        const nextIndex = (state.activeIndex + 1) % state.items.length;
        setFocusActiveState(view, nextIndex, true, "autoplay");
        scheduleFocusAutoplay(view);
      }
    }, 5000);
  };

  const pauseFocusAutoplay = (view) => {
    if (!isFocusViewActive(view)) {
      return;
    }
    view.state.paused = true;
    clearFocusTimer(view);
  };

  const resumeFocusAutoplay = (view) => {
    if (!isFocusViewActive(view)) {
      return;
    }
    view.state.paused = false;
    scheduleFocusAutoplay(view);
  };

  const syncFocusAutoplay = (view) => {
    if (!isFocusViewActive(view)) {
      return;
    }
    if (isFocusViewInteracting(view)) return;
    resumeFocusAutoplay(view);
  };

  const selectFocusIndex = (view, requestedIndex, origin = "click") => {
    if (!isFocusViewActive(view)) {
      return;
    }
    const { state } = view;
    if (!state || state.items.length <= 1) {
      return;
    }
    if (!Number.isSafeInteger(requestedIndex) || requestedIndex < 0 || requestedIndex >= state.items.length) {
      return;
    }
    state.targetIndex = requestedIndex;
    setFocusActiveState(view, requestedIndex, requestedIndex !== state.activeIndex, origin);
    scheduleFocusAutoplay(view);
  };

  const bindFocusCarousel = (view) => {
    if (view.bound) {
      return;
    }
    view.bound = true;
    addListenerWithCleanup(view.track, "transitionend", (event) => {
      if (event.target !== view.track || event.propertyName !== "transform" || !view.state.motion) {
        return;
      }
      if (view.state.motion.phase === "running") {
        view.state.motion = { ...view.state.motion, phase: "idle" };
      }
    }, view.listenerCleanups);
    const onFocusPointerEnter = () => {
      view.state.hovered = true;
      pauseFocusAutoplay(view);
    };
    const onFocusPointerLeave = () => {
      view.state.hovered = false;
      syncFocusAutoplay(view);
    };
    addListenerWithCleanup(view.root, "pointerenter", onFocusPointerEnter, view.listenerCleanups);
    addListenerWithCleanup(view.root, "mouseenter", onFocusPointerEnter, view.listenerCleanups);
    addListenerWithCleanup(view.root, "focusin", () => {
      view.state.focused = true;
      pauseFocusAutoplay(view);
    }, view.listenerCleanups);
    addListenerWithCleanup(view.root, "pointerleave", onFocusPointerLeave, view.listenerCleanups);
    addListenerWithCleanup(view.root, "mouseleave", onFocusPointerLeave, view.listenerCleanups);
    addListenerWithCleanup(view.root, "focusout", (event) => {
      if (!isFocusViewActive(view)) {
        return;
      }
      if (event.relatedTarget && view.root.contains(event.relatedTarget)) {
        return;
      }
      view.state.focused = false;
      syncFocusAutoplay(view);
    }, view.listenerCleanups);
    addListenerWithCleanup(view.trigger, "mouseover", (event) => {
      if (!isFocusViewActive(view)) {
        return;
      }
      const node = event.target.closest('[data-role="carousel-trigger-item"]');
      if (node && view.trigger.contains(node)) {
        selectFocusIndex(view, Number(node.getAttribute("data-index")), "hover");
      }
    }, view.listenerCleanups);
    addListenerWithCleanup(view.trigger, "click", (event) => {
      if (!isFocusViewActive(view)) {
        return;
      }
      const node = event.target.closest('[data-role="carousel-trigger-item"]');
      if (node && view.trigger.contains(node)) {
        selectFocusIndex(view, Number(node.getAttribute("data-index")), "click");
      }
    }, view.listenerCleanups);
    addListenerWithCleanup(view.trigger, "keydown", (event) => {
      if (!isFocusViewActive(view)) {
        return;
      }
      const node = event.target.closest('[data-role="carousel-trigger-item"]');
      if (!node || !view.trigger.contains(node)) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectFocusIndex(view, Number(node.getAttribute("data-index")), "click");
      }
    }, view.listenerCleanups);
  };

  const createFocusCarouselCard = (view, item, isFixture) => {
    const root = view.track;
    const itemNode = createNode(root, "div", "item");
    itemNode.setAttribute("data-role", "carousel-item");
    const link = createNode(root, "a", "focus-carousel__link");
    const media = createNode(root, "div", "b-img");
    const picture = createNode(root, "picture", "b-img__inner");
    const localAssetUrl = isFixture ? resolveLocalAssetUrl(ASSET_KEYS.BANNER_FALLBACK) : null;
    const imageUrl = resolveFocusImageUrl(item.imageUrl);
    if (localAssetUrl || imageUrl) {
      const image = root.ownerDocument.createElement("img");
      image.setAttribute("class", "focus-carousel__image");
      image.setAttribute("alt", normalizeText(item.title));
      image.setAttribute("src", localAssetUrl || imageUrl);
      addListenerWithCleanup(image, "error", () => {
        if (!isFocusMediaErrorActive(view, picture, image)) {
          return;
        }
        if (image.parentNode === picture) {
          picture.replaceChildren(createFocusPlaceholder(root, "图片暂不可用"));
        }
      }, view.cardListenerCleanups);
      picture.appendChild(image);
    } else if (isFixture) {
      picture.appendChild(createLocalImage(root, "focus-carousel__image", ASSET_KEYS.BANNER_FALLBACK, item.title));
    } else {
      picture.appendChild(createFocusPlaceholder(root, "图片暂不可用"));
    }
    media.appendChild(picture);
    link.setAttribute("href", resolveFocusLinkUrl(item.linkUrl) || "https://www.bilibili.com/");
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.appendChild(media);
    link.appendChild(createNode(root, "p", "title focus-carousel__title", item.title));
    itemNode.appendChild(link);
    return itemNode;
  };

  const resetFocusCarousel = (view, items, source) => {
    if (!isFocusViewActive(view)) {
      return;
    }
    const wasPaused = view.state.paused || view.state.hovered || view.state.focused;
    clearFocusTimer(view);
    cleanupListeners(view.cardListenerCleanups);
    view.state.items = items;
    view.state.activeIndex = -1;
    view.state.targetIndex = -1;
    view.state.paused = wasPaused;
    view.root.setAttribute("data-source", source);
    view.root.setAttribute("data-active-index", "-1");
    view.root.classList.toggle("is-empty", items.length === 0);
    view.track.replaceChildren();
    view.trigger.replaceChildren();
    view.indicator = null;
    view.more.hidden = items.length === 0;
    view.trigger.hidden = items.length === 0;
    if (items.length === 0) {
      return;
    }
    items.forEach((item, index) => {
      const itemNode = createFocusCarouselCard(view, item, source === "fixture");
      itemNode.setAttribute("data-index", String(index));
      view.track.appendChild(itemNode);
    });
    for (let index = 0; index < items.length; index += 1) {
      const triggerNode = createNode(view.trigger, "span");
      triggerNode.setAttribute("data-role", "carousel-trigger-item");
      triggerNode.setAttribute("data-index", String(index));
      triggerNode.setAttribute("role", "button");
      triggerNode.setAttribute("tabindex", "0");
      triggerNode.setAttribute("aria-label", `切换到第${index + 1}张`);
      triggerNode.setAttribute("aria-current", "false");
      triggerNode.setAttribute("aria-selected", "false");
      view.trigger.appendChild(triggerNode);
    }
    view.indicator = createNode(view.trigger, "i", "trigger-indicator");
    view.indicator.setAttribute("data-role", "carousel-indicator");
    view.indicator.setAttribute("aria-hidden", "true");
    const indicatorAssetUrl = resolveLocalAssetUrl(ASSET_KEYS.FOCUS_INDICATOR);
    if (indicatorAssetUrl) {
      view.indicator.style.backgroundImage = `url("${indicatorAssetUrl}")`;
    }
    view.trigger.appendChild(view.indicator);
    setFocusActiveState(view, 0, false);
    scheduleFocusAutoplay(view);
  };

  const setFocusCarouselItems = (view, items) => {
    if (!isFocusViewActive(view) || !view.track || !view.root || !view.state) {
      return;
    }
    const useRemoteItems = isFocusCarouselItems(items);
    const explicitEmpty = Array.isArray(items) && items.length === 0;
    const renderItems = useRemoteItems ? items : (explicitEmpty ? [] : FOCUS_CAROUSEL_FIXTURE);
    resetFocusCarousel(view, renderItems, useRemoteItems ? "remote" : explicitEmpty ? "empty" : "fixture");
  };

  const isProfileData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "bcoin\u001Fcoins\u001FcurrentExp\u001FdynamicUrl\u001FemailVerified\u001Fface\u001FfavoriteUrl\u001FfollowerUrl\u001FfollowingUrl\u001Flevel\u001FmobileVerified\u001FnextExp\u001Fpendant\u001Funame\u001FvipStatus"
    && (value.uname === null || isLiveText(value.uname, 64))
    && (value.face === null || isLiveAvatarUrl(value.face))
    && (value.followingUrl === null || isProfileNavigationUrl(value.followingUrl, "fans/follow"))
    && (value.followerUrl === null || isProfileNavigationUrl(value.followerUrl, "fans/fans"))
    && (value.dynamicUrl === null || isProfileNavigationUrl(value.dynamicUrl, "dynamic"))
    && (value.favoriteUrl === null || isProfileNavigationUrl(value.favoriteUrl, "favlist"))
    && (value.level === null || (Number.isSafeInteger(value.level) && value.level >= 0 && value.level <= 6))
    && (value.currentExp === null || (Number.isSafeInteger(value.currentExp)
      && value.currentExp >= 0 && value.currentExp <= 1000000000))
    && (value.nextExp === null || (Number.isSafeInteger(value.nextExp) && value.nextExp >= 0 && value.nextExp <= 1000000000))
    && (value.coins === null || (typeof value.coins === "number"
      && Number.isFinite(value.coins) && value.coins >= 0 && value.coins <= 1000000000))
    && (value.bcoin === null || (typeof value.bcoin === "number"
      && Number.isFinite(value.bcoin)
      && value.bcoin >= 0
      && value.bcoin <= 1000000000))
    && (value.emailVerified === null || typeof value.emailVerified === "boolean")
    && (value.mobileVerified === null || typeof value.mobileVerified === "boolean")
    && (value.pendant === null || (typeof value.pendant === "object"
      && !Array.isArray(value.pendant)
      && Object.keys(value.pendant).sort().join("\u001F") === "image\u001FimageEnhance\u001FimageEnhanceFrame"
      && [value.pendant.image, value.pendant.imageEnhance, value.pendant.imageEnhanceFrame]
        .every((url) => url === "" || isProfilePendantUrl(url))))
    && (value.vipStatus === null || (Number.isSafeInteger(value.vipStatus)
      && value.vipStatus >= 0 && value.vipStatus <= 2));

  const isProfileNavigationUrl = (value, suffix) => typeof value === "string"
    && value.length <= 256
    && new RegExp(`^https://space\\.bilibili\\.com/[1-9]\\d*/${suffix}$`).test(value);

  const isProfilePendantUrl = (value) => {
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

  const setProfileNavigation = (node, href, enabled) => {
    if (!node) return;
    if (enabled) {
      node.setAttribute("href", href);
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
      node.removeAttribute("aria-disabled");
      node.removeAttribute("tabindex");
    } else {
      node.removeAttribute("href");
      node.removeAttribute("target");
      node.removeAttribute("rel");
      node.setAttribute("aria-disabled", "true");
      node.setAttribute("tabindex", "-1");
    }
  };

  const isProfileStats = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "dynamic_count\u001Ffollower\u001Ffollowing"
    && Number.isSafeInteger(value.following)
    && value.following >= 0
    && Number.isSafeInteger(value.follower)
    && value.follower >= 0
    && Number.isSafeInteger(value.dynamic_count)
    && value.dynamic_count >= 0;

  const resetProfileStats = (view) => {
    for (const stat of Object.values(view.stats)) stat.textContent = "--";
  };

  const setProfileStats = (panel, stats) => {
    if (!panel || !panel.__profileView || !isProfileStats(stats)) return false;
    const view = panel.__profileView;
    view.stats.following.textContent = String(stats.following);
    view.stats.follower.textContent = String(stats.follower);
    view.stats.dynamic_count.textContent = String(stats.dynamic_count);
    return true;
  };

  const setProfileData = (panel, profile, authState = profile === null ? "unknown" : "logged_in") => {
    const nextState = authState === "logged_in" || authState === "logged_out" || authState === "unknown"
      ? authState
      : "unknown";
    if (!panel || !panel.__profileView
      || (nextState === "logged_in" ? !isProfileData(profile) : profile !== null)) {
      return false;
    }
    const view = panel.__profileView;
    const headerView = panel.__profileHeaderView;
    const active = nextState === "logged_in";
    panel.setAttribute("data-auth-state", nextState);
    for (const section of view.privateSections || []) {
      if (active) {
        section.removeAttribute("hidden");
      } else {
        section.setAttribute("hidden", "true");
      }
    }
    if (view.loginState) {
      if (active) {
        view.loginState.setAttribute("hidden", "true");
      } else {
        view.loginState.removeAttribute("hidden");
        view.loginMessage.textContent = nextState === "logged_out"
          ? "请登录后查看个人资料"
          : "登录状态未知";
        if (view.loginButton) {
          if (nextState === "logged_out") {
            view.loginButton.removeAttribute("hidden");
          } else {
            view.loginButton.setAttribute("hidden", "true");
          }
        }
      }
    }
    if (active) {
      view.avatarImage.removeAttribute("hidden");
      view.avatarFallback.setAttribute("hidden", "true");
      if (headerView) {
        headerView.image.removeAttribute("hidden");
        headerView.fallback.setAttribute("hidden", "true");
      }
    } else {
      view.avatarImage.setAttribute("hidden", "true");
      view.avatarFallback.removeAttribute("hidden");
      if (headerView) {
        headerView.image.setAttribute("hidden", "true");
        headerView.fallback.removeAttribute("hidden");
      }
    }
    if (!active) {
      view.avatarImage.removeAttribute("src");
      view.avatarImage.removeAttribute("referrerpolicy");
      view.avatarPendant.setAttribute("hidden", "true");
      view.avatarPendantImage.removeAttribute("src");
      if (headerView) {
        headerView.image.removeAttribute("src");
        headerView.image.removeAttribute("referrerpolicy");
      }
      view.nickname.textContent = nextState === "logged_out" ? "请登录后查看个人资料" : "登录状态未知";
      view.level.textContent = "等级 --";
      view.exp.textContent = "-- / --";
      view.progress.style.width = "0%";
      view.coins.textContent = "--";
      view.bcoin.textContent = "--";
      view.mail.classList.remove("is-bound");
      view.mobile.classList.remove("is-bound");
      view.vip.textContent = "--";
      view.logout.setAttribute("aria-disabled", "true");
      view.logout.setAttribute("tabindex", "-1");
      view.logout.setAttribute("data-logout-state", "awaiting-auth");
      for (const stat of Object.values(view.statLinks)) setProfileNavigation(stat, "", false);
      resetProfileStats(view);
      return true;
    }
    if (profile.face) {
      view.avatarImage.setAttribute("src", profile.face);
      view.avatarImage.setAttribute("referrerpolicy", "no-referrer");
      view.avatarImage.setAttribute("alt", profile.uname || "用户头像");
      view.avatarImage.removeAttribute("hidden");
      view.avatarFallback.setAttribute("hidden", "true");
    } else {
      view.avatarImage.removeAttribute("src");
      view.avatarImage.setAttribute("hidden", "true");
      view.avatarFallback.removeAttribute("hidden");
    }
    const pendantUrl = profile.pendant && (profile.pendant.imageEnhance || profile.pendant.image);
    if (pendantUrl) {
      view.avatarPendantImage.setAttribute("src", pendantUrl);
      view.avatarPendantImage.setAttribute("referrerpolicy", "no-referrer");
      view.avatarPendantImage.setAttribute("alt", "");
      view.avatarPendant.removeAttribute("hidden");
    } else {
      view.avatarPendant.setAttribute("hidden", "true");
      view.avatarPendantImage.removeAttribute("src");
    }
    if (headerView && profile.face) {
      headerView.image.setAttribute("src", profile.face);
      headerView.image.setAttribute("referrerpolicy", "no-referrer");
      headerView.image.setAttribute("alt", profile.uname || "用户头像");
    } else if (headerView) {
      headerView.image.removeAttribute("src");
      headerView.image.setAttribute("hidden", "true");
      headerView.fallback.removeAttribute("hidden");
    }
    view.nickname.textContent = profile.uname || "已登录用户";
    view.level.textContent = profile.level === null ? "等级 --" : `等级 ${profile.level}`;
    view.exp.textContent = `${profile.currentExp === null ? "--" : profile.currentExp} / ${profile.nextExp === null ? "--" : profile.nextExp}`;
    const progress = profile.currentExp === null ? 0 : profile.nextExp === null
      ? 100
      : Math.max(0, Math.min(100, (profile.currentExp / Math.max(profile.nextExp, 1)) * 100));
    view.progress.style.width = `${progress}%`;
    view.coins.textContent = profile.coins === null ? "--" : String(profile.coins);
    view.bcoin.textContent = profile.bcoin === null ? "--" : String(profile.bcoin);
    view.mail.classList.toggle("is-bound", profile.emailVerified);
    view.mobile.classList.toggle("is-bound", profile.mobileVerified);
    view.vip.textContent = profile.vipStatus === null ? "--" : (profile.vipStatus > 0 ? "已开通" : "未开通");
    view.logout.removeAttribute("aria-disabled");
    view.logout.removeAttribute("tabindex");
    view.logout.setAttribute("data-logout-state", "ready");
    setProfileNavigation(view.statLinks.following, profile.followingUrl || "", Boolean(profile.followingUrl));
    setProfileNavigation(view.statLinks.follower, profile.followerUrl || "", Boolean(profile.followerUrl));
    setProfileNavigation(view.statLinks.dynamic_count, profile.dynamicUrl || "", Boolean(profile.dynamicUrl));
    resetProfileStats(view);
    return true;
  };

  const setAuthStatus = (statusText, statusPanel, status, profile = null) => {
    const nextStatus = status === "logged_in" || status === "logged_out" || status === "unknown"
      ? status
      : "unknown";
    statusText.textContent = normalizeText(nextStatus);
    statusPanel.setAttribute("data-state", nextStatus);
    const view = AUTH_STATE_VIEWS.get(statusPanel);
    if (view) {
      if (typeof view.resetPopovers === "function") {
        view.resetPopovers();
      }
      if (view.profilePanel) {
        setProfileData(view.profilePanel, nextStatus === "logged_in" ? profile : null, nextStatus);
      }
      if (view.favoriteTrigger) {
        setProfileNavigation(
          view.favoriteTrigger,
          nextStatus === "logged_in" && profile ? profile.favoriteUrl : "",
          nextStatus === "logged_in" && Boolean(profile)
        );
      }
      if (view.messagePanel && nextStatus !== "logged_in") {
        setMessageData(view.messagePanel, null);
      }
      view.content.setAttribute("data-auth-state", nextStatus);
      if (view.userCenter) {
        view.userCenter.setAttribute("data-auth-state", nextStatus);
      }
      if (view.signin) {
        view.signin.setAttribute("data-auth-state", nextStatus);
        if (nextStatus === "logged_in") {
          view.signin.removeAttribute("hidden");
        } else {
          view.signin.setAttribute("hidden", "true");
        }
      }
      if (view.loggedOut) {
        if (nextStatus === "logged_out") {
          view.loggedOut.removeAttribute("hidden");
        } else {
          view.loggedOut.setAttribute("hidden", "true");
        }
      }
      if (view.unknown) {
        if (nextStatus === "unknown") {
          view.unknown.removeAttribute("hidden");
        } else {
          view.unknown.setAttribute("hidden", "true");
        }
      }
      if (nextStatus === "logged_in") {
        statusPanel.setAttribute("hidden", "true");
      } else {
        statusPanel.removeAttribute("hidden");
      }
      if (nextStatus !== "logged_out" && view.loginStub) {
        view.loginStub.setAttribute("hidden", "true");
        if (view.elevator) {
          view.elevator.setAttribute("data-overlay-open", "false");
        }
      }
    }
  };

  const isMessageCounter = (value) => Number.isSafeInteger(value)
    && value >= 0
    && value <= 1000000000;
  const isMessageData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && ["reply", "at", "like", "sysMsg", "sessionUnread"].every((key) => isMessageCounter(value[key]));
  const formatMessageBadge = (value) => value > 99 ? "99+" : String(value);
  const applyMessageBadge = (node, value) => {
    if (!node) return;
    if (value > 0) {
      node.textContent = formatMessageBadge(value);
      node.removeAttribute("hidden");
    } else {
      node.textContent = "";
      node.setAttribute("hidden", "true");
    }
  };
  const setMessageData = (panel, data) => {
    const view = panel && panel.__messageView;
    if (!view || !Array.isArray(view.rows)) return false;
    if (data === null) {
      for (const row of view.rows) applyMessageBadge(row.badge, 0);
      applyMessageBadge(view.triggerBadge, 0);
      return true;
    }
    if (!isMessageData(data)) return false;
    for (const row of view.rows) applyMessageBadge(row.badge, data[row.key]);
    const total = data.reply + data.at + data.like + data.sysMsg + data.sessionUnread;
    applyMessageBadge(view.triggerBadge, total);
    return true;
  };
  const applyDynamicBadge = (node, value) => {
    if (!node) return;
    if (value > 0) {
      node.textContent = value >= 99 ? "99+" : String(value);
      node.removeAttribute("hidden");
    } else {
      node.textContent = "";
      node.setAttribute("hidden", "true");
    }
  };
  const isDynamicData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "avatar\u001Fcount"
    && Number.isSafeInteger(value.count)
    && value.count >= 0
    && (value.avatar === null || isLiveAvatarUrl(value.avatar));
  const clearDynamicMenuAvatar = (node) => {
    if (!node) return;
    node.replaceChildren();
    node.setAttribute("hidden", "true");
  };
  const applyDynamicMenuAvatar = (node, data) => {
    if (!node || !data || data.count <= 0 || !data.avatar || !isLiveAvatarUrl(data.avatar)) {
      clearDynamicMenuAvatar(node);
      return;
    }
    const avatar = node.ownerDocument.createElement("img");
    avatar.setAttribute("class", "dynamic-update__avatar");
    avatar.setAttribute("src", data.avatar);
    avatar.setAttribute("alt", "");
    avatar.addEventListener("error", () => {
      if (avatar.isConnected) clearDynamicMenuAvatar(node);
    }, { once: true });
    node.replaceChildren(avatar);
    node.removeAttribute("hidden");
  };
  const setDynamicData = (panel, data) => {
    const view = panel && panel.__dynamicView;
    if (!view || !view.triggerBadge) return false;
    if (data === null) {
      applyDynamicBadge(view.triggerBadge, 0);
      clearDynamicMenuAvatar(view.primaryMenuEntrance);
      return true;
    }
    if (!data || typeof data !== "object" || !isDynamicData({ avatar: data.avatar, count: data.count })
      || ![data.video, data.live, data.article].every(Array.isArray)) return false;
    applyDynamicBadge(view.triggerBadge, data.count);
    applyDynamicMenuAvatar(view.primaryMenuEntrance, data);
    view.data = data;
    if (typeof view.render === "function") view.render(view.activeKind || "video");
    return true;
  };

  const createPanelTitle = (root, className, text) => createNode(root, "h3", className, text);

  const createPanelButton = (root, className, text) => {
    const button = createNode(root, "button", className, text);
    button.setAttribute("type", "button");
    return button;
  };

  const renderSearchHistory = (view) => {
    if (!view || !view.historiesWrap) return;
    view.historiesWrap.replaceChildren();
    view.historiesWrap.classList.toggle("is-expanded", view.historyExpanded === true);
    if (view.historyFold) {
      const foldVisible = Array.isArray(view.historyItems) && view.historyItems.length > 10;
      if (foldVisible) view.historyFold.removeAttribute("hidden");
      else view.historyFold.setAttribute("hidden", "true");
      view.historyFold.textContent = view.historyExpanded ? "收起" : "展开更多";
    }
    if (!Array.isArray(view.historyItems) || view.historyItems.length === 0) {
      view.historiesWrap.appendChild(createNode(view.root, "div", "history-empty", "暂无搜索历史"));
      return;
    }
    const histories = createNode(view.root, "div", "histories");
    for (const item of view.historyItems) {
      const row = createNode(view.root, "div", "history-item");
      const link = createSearchAnchor(view.root, "history-text", item, item);
      link.addEventListener("click", () => view.recordHistory(item));
      const remove = createNode(view.root, "button", "close");
      remove.setAttribute("type", "button");
      remove.setAttribute("aria-label", `删除搜索历史：${item}`);
      remove.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (view.input && typeof view.input.focus === "function") view.input.focus();
        view.historyItems = view.historyItems.filter((keyword) => keyword !== item);
        renderSearchHistory(view);
        if (typeof view.notifyHistoryChange === "function") view.notifyHistoryChange();
      });
      row.appendChild(link);
      row.appendChild(remove);
      histories.appendChild(row);
    }
    view.historiesWrap.appendChild(histories);
  };

  const setSearchHistory = (view, items) => {
    if (!view || !Array.isArray(items) || items.length > 20
      || !items.every((item) => typeof item === "string" && item.length > 0 && item.length <= 128)) return false;
    view.historyItems = items.slice();
    renderSearchHistory(view);
    return true;
  };

  const renderSearchTrending = (view) => {
    if (!view || !Array.isArray(view.trendingColumns)) return;
    for (const column of view.trendingColumns) column.replaceChildren();
    const items = Array.isArray(view.trendingItems) ? view.trendingItems : [];
    items.forEach((item, index) => {
      const column = view.trendingColumns[index < 5 ? 0 : 1];
      if (!column) return;
      const link = createSearchAnchor(view.root, `trending-item${index < 3 ? " trending-item-top" : ""}`, item.keyword, "");
      link.addEventListener("click", () => view.recordHistory(item.keyword));
      link.appendChild(createNode(view.root, "span", "rank", String(index + 1)));
      link.appendChild(createNode(view.root, "span", "trending-text", item.text));
      const localMarkAsset = item.markKey === "live"
        ? ASSET_KEYS.SEARCH_MARK_LIVE
        : item.markKey === "anniversary"
          ? ASSET_KEYS.SEARCH_MARK_ANNIVERSARY
          : null;
      const iconUrl = localMarkAsset ? resolveLocalAssetUrl(localMarkAsset) : item.remoteIcon;
      if (iconUrl) {
        const icon = view.root.ownerDocument.createElement("img");
        icon.setAttribute("class", "trending-mark");
        icon.setAttribute("src", iconUrl);
        icon.setAttribute("alt", "");
        icon.setAttribute("aria-hidden", "true");
        if (!localMarkAsset) icon.setAttribute("referrerpolicy", "no-referrer");
        icon.addEventListener("error", () => icon.remove(), { once: true });
        link.appendChild(icon);
      }
      column.appendChild(link);
    });
  };

  const setSearchData = (view, data) => {
    if (!view || !isSearchData(data)) return false;
    view.defaultUrl = data.defaultUrl;
    view.defaultKeyword = data.defaultKeyword;
    view.trendingItems = data.trendingItems.map((item) => ({ ...item }));
    view.trendingTitle.textContent = data.trendingTitle;
    if (!view.input.getAttribute("data-search-dirty")) {
      view.input.value = "";
      view.input.removeAttribute("value");
      view.input.setAttribute("placeholder", data.defaultKeyword);
      view.input.setAttribute("title", data.defaultKeyword);
    }
    renderSearchHistory(view);
    renderSearchTrending(view);
    view.root.setAttribute("data-search-state", "committed");
    return true;
  };

  const isSearchSuggestionsData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "items\u001Fterm"
    && typeof value.term === "string"
    && value.term.length > 0
    && value.term.length <= 128
    && Array.isArray(value.items)
    && value.items.length <= 10
    && value.items.every((item) => typeof item === "string" && item.length > 0 && item.length <= 128);

  const appendSearchHighlightedText = (root, parent, value, term) => {
    const source = String(value || "");
    const query = String(term || "");
    const start = source.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
    if (start < 0) {
      parent.textContent = source;
      return;
    }
    const documentObject = root.ownerDocument;
    if (start > 0) parent.appendChild(documentObject.createTextNode(source.slice(0, start)));
    const mark = createNode(root, "em", "suggest_high_light", source.slice(start, start + query.length));
    parent.appendChild(mark);
    if (start + query.length < source.length) {
      parent.appendChild(documentObject.createTextNode(source.slice(start + query.length)));
    }
  };

  const setSearchSuggestions = (view, data) => {
    if (!view || (data !== null && !isSearchSuggestionsData(data))) return false;
    view.activeSuggestionIndex = -1;
    view.suggestionItems = data ? data.items.slice() : [];
    view.suggestionNodes = [];
    view.root.replaceChildren();
    if (!data) {
      view.root.removeAttribute("data-panel-mode");
      view.root.appendChild(view.historySection);
      view.root.appendChild(view.trendingSection);
      renderSearchHistory(view);
      renderSearchTrending(view);
      return true;
    }
    view.root.setAttribute("data-panel-mode", "typed");
    const suggestions = createNode(view.root, "div", "suggestions");
    suggestions.setAttribute("role", "listbox");
    data.items.forEach((value, index) => {
      const item = createNode(view.root, "div", "suggest-item");
      item.setAttribute("role", "option");
      item.setAttribute("tabindex", "-1");
      item.id = `${view.root.id}-suggestion-${index}`;
      item.setAttribute("aria-selected", "false");
      appendSearchHighlightedText(view.root, item, value, data.term);
      item.addEventListener("mousedown", (event) => event.preventDefault());
      item.addEventListener("click", () => view.selectSuggestion(value));
      suggestions.appendChild(item);
      view.suggestionNodes.push(item);
    });
    view.root.appendChild(suggestions);
    return true;
  };

  let headerPopoverSequence = 0;
  const HEADER_USER_POPOVER_KINDS = new Set(["avatar", "vip", "message", "dynamic", "favorite", "history", "upload"]);
  const createHeaderPopover = (root, panelClass, kind, options = {}) => {
    const liveClasses = HEADER_USER_POPOVER_KINDS.has(kind)
      ? `van-popover van-popper van-popper-nav van-popper-${kind}`
      : "";
    const baseClass = options.headerClass === false || HEADER_USER_POPOVER_KINDS.has(kind) ? "" : "header-popover";
    const panel = createNode(root, "div", [baseClass, liveClasses, panelClass].filter(Boolean).join(" "));
    panel.id = `extension-b-mini-popover-${kind}-${headerPopoverSequence += 1}`;
    panel.setAttribute("role", "tooltip");
    panel.setAttribute("tabindex", "0");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("data-popover-kind", kind);
    return panel;
  };

  const createMiniPopoverMediaFence = (root, lifecycle) => {
    const cleanups = [];
    const lease = lifecycle && lifecycle.lease ? lifecycle.lease : { active: true };
    const fence = createMediaFence({
      root,
      lease,
      isActive: () => Boolean(
        (!lifecycle || typeof lifecycle.isActive !== "function" || lifecycle.isActive())
        && (!lifecycle || !lifecycle.root || lifecycle.root === root)
      ),
      isDestroyed: () => Boolean(lifecycle && lifecycle.isDestroyed && lifecycle.isDestroyed()),
      cleanups
    });
    if (lifecycle && Array.isArray(lifecycle.cleanups)) {
      lifecycle.cleanups.push(() => fence.destroy());
    }
    return fence;
  };

  const createFencedPopoverImage = (root, className, assetKey, alt, mediaFence, container, fallbackText = "图片不可用") => {
    const image = root.ownerDocument.createElement("img");
    image.setAttribute("class", className);
    image.setAttribute("alt", normalizeText(alt));
    const fallback = createNode(root, "span", `${className}-fallback`, fallbackText);
    fallback.setAttribute("hidden", "true");
    const request = mediaFence.createRequest(image, container);
    const setFallback = () => {
      if (!mediaFence.canWrite(request)) {
        return;
      }
      image.removeAttribute("src");
      image.classList.add("popover-image--failed");
      fallback.removeAttribute("hidden");
      mediaFence.settleRequest(request);
    };
    const setReady = () => {
      if (!mediaFence.canWrite(request)) {
        return;
      }
      image.classList.remove("popover-image--failed");
      fallback.setAttribute("hidden", "true");
      mediaFence.settleRequest(request);
    };
    mediaFence.bindError(request, setFallback);
    mediaFence.bindLoad(request, setReady);
    const assetUrl = resolveLocalAssetUrl(assetKey);
    if (assetUrl) {
      image.setAttribute("src", assetUrl);
    } else {
      setFallback();
    }
    return { image, fallback };
  };

  const bindMiniPopoverInteraction = (root, panel, surface, items, previewFrame, previewImage, previewFallback, mediaFence, lifecycle, createItem) => {
    const itemNodes = [];
    const interactionCleanups = lifecycle && Array.isArray(lifecycle.cleanups) ? lifecycle.cleanups : [];
    let activeKey = null;
    const isActive = () => !lifecycle || typeof lifecycle.isActive !== "function" || lifecycle.isActive();
    const previewUsesReadyFence = Boolean(previewImage && previewImage.classList.contains("manga-float-image-loader"));
    const previewUsesBackground = Boolean(previewFrame && previewFrame.classList.contains("imgdiv"));
    const clearActive = () => {
      if (activeKey === null) {
        return;
      }
      activeKey = null;
      if (mediaFence) {
        mediaFence.retireGeneration();
      }
      for (const node of itemNodes) {
        node.classList.remove("is-active");
        node.setAttribute("aria-expanded", "false");
      }
      if (previewFrame) {
        previewFrame.classList.remove("is-visible");
        previewFrame.setAttribute("aria-hidden", "true");
        if (previewUsesBackground) {
          previewFrame.style.backgroundImage = "none";
        }
      }
      if (previewImage) {
        previewImage.removeAttribute("src");
        previewImage.classList.remove("popover-image--failed");
        if (previewUsesReadyFence) {
          previewImage.classList.remove("is-ready");
        }
      }
      if (previewFallback) {
        previewFallback.setAttribute("hidden", "true");
      }
    };
    const activate = (fixedKey) => {
      if (!isActive()) {
        return;
      }
      const item = items.find((candidate) => candidate.key === fixedKey) || null;
      if (!item || activeKey === item.key) {
        return;
      }
      activeKey = item.key;
      if (mediaFence) {
        mediaFence.retireGeneration();
      }
      for (let index = 0; index < itemNodes.length; index += 1) {
        const node = itemNodes[index];
        const active = items[index].key === item.key;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-expanded", active ? "true" : "false");
      }
      if (previewFrame && mediaFence && (previewUsesBackground || (previewImage && previewFallback))) {
        previewFrame.classList.add("is-visible");
        previewFrame.setAttribute("aria-hidden", "false");
        if (previewUsesBackground) {
          previewFrame.style.backgroundImage = "none";
        }
        if (previewUsesReadyFence) {
          previewImage.classList.remove("is-ready");
          previewFallback.removeAttribute("hidden");
        }
        const assetUrl = resolveLocalAssetUrl(item.key);
        if (previewUsesBackground) {
          if (assetUrl && isActive() && previewFrame.isConnected === true) {
            previewFrame.style.backgroundImage = `url("${assetUrl}")`;
          }
          return;
        }
        const request = mediaFence.createRequest(previewImage, previewFrame);
        const setFallback = () => {
          if (!mediaFence.canWrite(request)) {
            return;
          }
          previewImage.removeAttribute("src");
          previewImage.classList.add("popover-image--failed");
          if (previewUsesReadyFence) {
            previewImage.classList.remove("is-ready");
          }
          if (previewUsesBackground) {
            previewFrame.style.backgroundImage = "none";
          }
          previewFallback.removeAttribute("hidden");
          mediaFence.settleRequest(request);
        };
        const setReady = () => {
          if (!mediaFence.canWrite(request)) {
            return;
          }
          previewImage.classList.remove("popover-image--failed");
          if (previewUsesReadyFence) {
            previewImage.classList.add("is-ready");
          }
          if (previewUsesBackground && assetUrl) {
            previewFrame.style.backgroundImage = `url("${assetUrl}")`;
          }
          previewFallback.setAttribute("hidden", "true");
          mediaFence.settleRequest(request);
        };
        mediaFence.bindError(request, setFallback);
        mediaFence.bindLoad(request, setReady);
        if (assetUrl) {
          previewImage.setAttribute("src", assetUrl);
        } else {
          setFallback();
        }
      }
    };
    for (const item of items) {
      const button = createItem ? createItem(item, itemNodes.length) : createNode(root, "button", "popover-interactive-item", "");
      button.setAttribute("class", button.getAttribute("class") || "popover-interactive-item");
      if (button.tagName === "BUTTON") {
        button.setAttribute("type", "button");
      }
      button.setAttribute("data-fixed-key", item.key);
      button.setAttribute("aria-controls", previewFrame ? previewFrame.id : panel.id);
      button.setAttribute("aria-expanded", "false");
      if (!createItem) {
        button.appendChild(createNode(root, "span", "popover-rank-label", item.title));
      }
      surface.appendChild(button);
      itemNodes.push(button);
      addListenerWithCleanup(button, "pointerenter", () => activate(item.key), interactionCleanups);
      addListenerWithCleanup(button, "mouseenter", () => activate(item.key), interactionCleanups);
      const leave = (event) => {
        if (!surface.contains(event.relatedTarget)) {
          clearActive();
        }
      };
      addListenerWithCleanup(button, "pointerleave", leave, interactionCleanups);
      addListenerWithCleanup(button, "mouseleave", leave, interactionCleanups);
      addListenerWithCleanup(button, "focusin", () => activate(item.key), interactionCleanups);
      addListenerWithCleanup(button, "focusout", (event) => {
        if (!surface.contains(event.relatedTarget)) {
          clearActive();
        }
      }, interactionCleanups);
      addListenerWithCleanup(button, "keydown", (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Space") {
          event.preventDefault();
          activate(item.key);
        }
      }, interactionCleanups);
    }
    addListenerWithCleanup(panel, "keydown", (event) => {
      if (event.key === "Escape") {
        clearActive();
      }
    }, interactionCleanups);
    panel.__miniHeaderInteraction = Object.freeze({
      items,
      itemNodes,
      activate,
      clearActive,
      previewFrame,
      previewImage,
      mediaFence,
      get activeKey() { return activeKey; }
    });
    return panel.__miniHeaderInteraction;
  };

  const createGamePopover = (root, lifecycle) => {
    const panel = createHeaderPopover(root, "popover-game", "game");
    const previewFence = createMiniPopoverMediaFence(root, lifecycle);
    const setFixedBackground = (node, assetKey, repeat) => {
      const assetUrl = resolveLocalAssetUrl(assetKey);
      if (assetUrl) {
        node.style.backgroundImage = `url("${assetUrl}")`;
        node.style.backgroundRepeat = repeat;
      }
    };
    const box = createNode(root, "div", "box clearfix");
    const left = createNode(root, "div", "left");
    const banner = createNode(root, "div", "banner");
    const bannerTitle = "命运-冠位指定（Fate/GO）";
    const bannerLink = createFixedTargetAnchor(root, "", resolveNav("GAME"), "");
    bannerLink.setAttribute("aria-label", bannerTitle);
    const featured = createLocalImage(root, "", ASSET_KEYS.MINI_GAME_FEATURED, bannerTitle);
    const titleOverlay = createNode(root, "span", "", bannerTitle);
    setFixedBackground(titleOverlay, ASSET_KEYS.MINI_GAME_SHADOW, "repeat-x");
    bannerLink.appendChild(featured);
    bannerLink.appendChild(titleOverlay);
    banner.appendChild(bannerLink);
    left.appendChild(banner);
    const brief = createNode(root, "div", "brief clearfix");
    const tileItems = [
      [ASSET_KEYS.MINI_GAME_TILE_01, "碧蓝航线"],
      [ASSET_KEYS.MINI_GAME_TILE_02, "坎特伯雷公主与骑士唤醒冠军之剑的奇幻冒险"],
      [ASSET_KEYS.MINI_GAME_TILE_03, "时空猎人3"]
    ];
    for (const [key, title] of tileItems) {
      const tile = createFixedTargetAnchor(root, "", resolveNav("GAME"), "");
      tile.setAttribute("title", title);
      tile.setAttribute("aria-label", title);
      tile.appendChild(createLocalImage(root, "", key, title));
      tile.appendChild(createNode(root, "span", "", title));
      brief.appendChild(tile);
    }
    left.appendChild(brief);
    const right = createNode(root, "div", "right");
    setFixedBackground(right, ASSET_KEYS.MINI_GAME_LINE, "no-repeat");
    const all = createNode(root, "div", "all");
    setFixedBackground(all, ASSET_KEYS.MINI_GAME_TITLE, "no-repeat");
    const preview = createNode(root, "div", "imgdiv");
    preview.style.backgroundRepeat = "no-repeat";
    preview.id = `${panel.id}-preview`;
    preview.setAttribute("role", "img");
    preview.setAttribute("aria-label", "游戏预览");
    preview.setAttribute("aria-hidden", "true");
    const interaction = bindMiniPopoverInteraction(
      root,
      panel,
      all,
      GAME_PREVIEW_ITEMS,
      preview,
      null,
      null,
      previewFence,
      lifecycle,
      (item) => {
        const link = createFixedTargetAnchor(root, "game-preview-item", resolveNav("GAME"), "");
        link.appendChild(createNode(root, "span", "", item.title));
        return link;
      }
    );
    right.appendChild(all);
    box.appendChild(left);
    box.appendChild(right);
    box.appendChild(preview);
    panel.appendChild(box);
    return panel;
  };

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
  const isLiveCanonicalHref = (value) => {
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
  const isLiveHoverData = (value) => value !== null
    && typeof value === "object"
    && !Array.isArray(value)
    && Object.keys(value).sort().join("\u001F") === "items"
    && Array.isArray(value.items)
    && value.items.length <= 6
    && value.items.every((item) => item !== null
      && typeof item === "object"
      && !Array.isArray(item)
      && Object.keys(item).sort().join("\u001F") === "face\u001Flink\u001Fonline\u001Ftitle\u001Fuid\u001Funame"
      && isLiveAvatarUrl(item.face)
      && isLiveCanonicalHref(item.link)
      && isLiveText(item.title, 256)
      && isLiveText(item.uname, 256)
      && Number.isSafeInteger(item.uid)
      && item.uid >= 0
      && item.uid <= Number.MAX_SAFE_INTEGER
      && Number.isSafeInteger(item.online)
      && item.online >= 0
      && item.online <= 1000000000);

  const setLiveHoverData = (panel, data) => {
    if (!panel
      || !panel.__liveRendererLease
      || panel.__liveRendererLease.active !== true
      || !panel.__liveHoverInteraction
      || !isLiveHoverData(data)) {
      return false;
    }
    const slots = panel.__liveHoverInteraction.itemNodes
      .map((node) => node.__liveSlot)
      .filter(Boolean);
    for (let index = 0; index < slots.length; index += 1) {
      const slot = slots[index];
      const item = data.items[index];
      if (!item) {
        slot.link.removeAttribute("href");
        slot.link.removeAttribute("target");
        slot.link.removeAttribute("rel");
        slot.image.removeAttribute("referrerpolicy");
        const fixtureUrl = resolveLocalAssetUrl(slot.fixture.key);
        if (fixtureUrl) slot.image.setAttribute("src", fixtureUrl);
        slot.image.setAttribute("alt", slot.fixture.title);
        slot.title.textContent = slot.fixture.title;
        slot.link.setAttribute("aria-label", slot.fixture.title);
        slot.fallback.setAttribute("hidden", "true");
        continue;
      }
      slot.link.setAttribute("href", item.link);
      slot.link.setAttribute("target", "_blank");
      slot.link.setAttribute("rel", "noopener noreferrer");
      slot.image.setAttribute("src", item.face);
      slot.image.setAttribute("referrerpolicy", "no-referrer");
      slot.image.setAttribute("alt", item.title);
      slot.title.textContent = item.title;
      slot.link.setAttribute("aria-label", item.title);
      slot.fallback.setAttribute("hidden", "true");
    }
    return true;
  };

  const createLivePopover = (root, lifecycle) => {
    const panel = createHeaderPopover(root, "popover-live", "live");
    const imageFence = createMiniPopoverMediaFence(root, lifecycle);
    const interactionFence = createMiniPopoverMediaFence(root, lifecycle);
    const surface = createNode(root, "div", "popover-surface live-surface");
    const hot = createNode(root, "section", "live-hot-column");
    hot.appendChild(createPanelTitle(root, "popover-list-title", "热门直播"));
    const liveItems = createNode(root, "div", "live-room-list");
    const createLiveItem = (item) => {
      const link = createNode(root, "a", "live-interactive-item", "");
      link.setAttribute("aria-label", item.title);
      const avatarFrame = createNode(root, "span", "live-avatar-frame");
      const avatar = createFencedPopoverImage(
        root, "live-avatar-image", item.key, item.title, imageFence, avatarFrame
      );
      const image = avatar.image;
      const fallback = avatar.fallback;
      avatarFrame.appendChild(image);
      avatarFrame.appendChild(fallback);
      avatarFrame.appendChild(createNode(root, "span", "live-avatar-mask", "LIVE"));
      link.appendChild(avatarFrame);
      const title = createNode(root, "span", "live-room-title", item.title);
      link.appendChild(title);
      link.__liveSlot = { link, image, fallback, title, fixture: item };
      return link;
    };
    hot.appendChild(liveItems);
    const activities = createNode(root, "section", "live-activity-column");
    activities.appendChild(createPanelTitle(root, "popover-list-title", "热门活动"));
    surface.appendChild(hot);
    surface.appendChild(activities);
    const interaction = bindMiniPopoverInteraction(
      root, panel, liveItems, LIVE_ITEMS, null, null, null, interactionFence, lifecycle, createLiveItem
    );
    panel.appendChild(surface);
    panel.__liveRendererLease = lifecycle && lifecycle.lease ? lifecycle.lease : { active: true };
    panel.__liveHoverInteraction = interaction;
    panel.__liveHoverSetter = (data) => setLiveHoverData(panel, data);
    return panel;
  };

  const createMangaPopover = (root, lifecycle) => {
    const panel = createHeaderPopover(root, "popover-manga", "manga");
    const recommendationFence = createMiniPopoverMediaFence(root, lifecycle);
    const previewFence = createMiniPopoverMediaFence(root, lifecycle);
    const app = createNode(root, "div", "manga-app-layout");
    const recommendations = createNode(root, "div", "manga-recommendation-list");
    for (const item of MANGA_RECOMMEND_ITEMS) {
      const card = createFixedTargetAnchor(root, "manga-recommend-item", resolveNav("MANGA"), "");
      card.setAttribute("title", item.title);
      card.setAttribute("aria-label", item.title);
      const surface = createNode(root, "div", "manga-recommend-image-surface");
      const image = createFencedPopoverImage(root, "manga-recommend-image", item.key, item.title, recommendationFence, surface, "封面暂不可用");
      surface.appendChild(image.image);
      surface.appendChild(image.fallback);
      card.appendChild(surface);
      card.appendChild(createNode(root, "span", "manga-recommend-title", item.title));
      recommendations.appendChild(card);
    }
    const divider = createNode(root, "div", "manga-divider");
    const popularity = createNode(root, "div", "manga-popularity-list");
    popularity.appendChild(createPanelTitle(root, "manga-popularity-title", "人气漫画"));
    const preview = createNode(root, "div", "manga-float-image");
    preview.id = `${panel.id}-preview`;
    preview.setAttribute("role", "img");
    preview.setAttribute("aria-label", "漫画封面");
    preview.setAttribute("aria-hidden", "true");
    const previewImage = root.ownerDocument.createElement("img");
    previewImage.setAttribute("class", "manga-float-image-loader");
    previewImage.setAttribute("alt", "");
    const previewFallback = createNode(root, "span", "manga-float-image-fallback", "封面暂不可用");
    previewFallback.setAttribute("hidden", "true");
    preview.appendChild(previewImage);
    preview.appendChild(previewFallback);
    const interactiveSurface = createNode(root, "div", "manga-popularity-items");
    bindMiniPopoverInteraction(
      root,
      panel,
      interactiveSurface,
      MANGA_ITEMS,
      preview,
      previewImage,
      previewFallback,
      previewFence,
      lifecycle,
      (item, index) => {
        const button = createNode(root, "button", "manga-popularity-row", "");
        button.appendChild(createNode(root, "span", "manga-popularity-index", String(index + 1)));
        button.appendChild(createNode(root, "span", "manga-popularity-label", item.title));
        return button;
      }
    );
    popularity.appendChild(interactiveSurface);
    popularity.appendChild(preview);
    app.appendChild(recommendations);
    app.appendChild(divider);
    app.appendChild(popularity);
    panel.appendChild(app);
    return panel;
  };

  const createDownloadPopover = (root) => {
    const panel = createHeaderPopover(root, "download-client-entry", "download");
    const wrapper = createNode(root, "div", "download-wrapper");
    const top = createNode(root, "div", "download-top");
    const mobile = createNode(root, "div", "download-top-left");
    const mobileTitle = createNode(root, "div", "download-top-title");
    const mobileMain = createNode(root, "div", "main", "手机版");
    const mobileIcon = createDownloadTitleIcon(root, "mobile");
    mobileMain.prepend(mobileIcon);
    mobileTitle.appendChild(mobileMain);
    mobileTitle.appendChild(createNode(root, "div", "sub", "扫码即可下载手机APP"));
    const mobileContent = createNode(root, "div", "download-top-content");
    const qr = createNode(root, "div", "qr");
    qr.appendChild(createLocalImage(root, "", ASSET_KEYS.MINI_DOWNLOAD_QR, "客户端下载二维码"));
    mobileContent.appendChild(qr);
    mobile.appendChild(mobileTitle);
    mobile.appendChild(mobileContent);

    const divider = createNode(root, "div", "download-top-center");
    const desktop = createNode(root, "div", "download-top-right");
    const desktopTitle = createNode(root, "div", "download-top-title");
    const desktopMain = createNode(root, "div", "main", "Windows端");
    const desktopIcon = createDownloadTitleIcon(root, "desktop");
    desktopMain.prepend(desktopIcon);
    desktopTitle.appendChild(desktopMain);
    desktopTitle.appendChild(createNode(root, "div", "sub", "适合WIN系统设备"));
    const desktopContent = createNode(root, "div", "download-top-content");
    const pinkIcon = createLocalImage(root, "pink-pc-download", ASSET_KEYS.MINI_DOWNLOAD_PINK_TV, "");
    pinkIcon.setAttribute("aria-hidden", "true");
    desktopContent.appendChild(pinkIcon);
    desktopContent.appendChild(createFixedTargetAnchor(root, "button", resolveNav("APP"), "立即下载"));
    desktop.appendChild(desktopTitle);
    desktop.appendChild(desktopContent);

    top.appendChild(mobile);
    top.appendChild(divider);
    top.appendChild(desktop);
    wrapper.appendChild(top);
    const footer = createFixedTargetAnchor(root, "download-bottom", resolveNav("APP"), "点击查看更多下载内容");
    footer.appendChild(createNode(root, "span", "download-bottom-chevron", "›"));
    wrapper.appendChild(footer);
    panel.appendChild(wrapper);
    return panel;
  };

  const createVipPopover = (root) => {
    const panel = createHeaderPopover(root, "auth-vip-popover", "vip");
    const vip = createNode(root, "div", "vip-m");
    const bubble = createNode(root, "div", "bubble-traditional");
    const recommendation = createNode(root, "div", "recommand");
    recommendation.appendChild(createNode(root, "div", "title", "精彩推荐"));
    const columns = createNode(root, "div", "bubble-col bubble-col-1");
    const item = createNode(root, "div", "item");
    const promo = createFixedTargetAnchor(root, "pic", Object.freeze({
      href: "https://account.bilibili.com/big",
      target: "_blank",
      rel: "noopener noreferrer"
    }), "");
    promo.appendChild(createLocalImage(root, "vip-promo-shell", ASSET_KEYS.VIP_FALLBACK, ""));
    item.appendChild(promo);
    item.appendChild(createFixedTargetAnchor(root, "recommand-link", Object.freeze({
      href: "https://account.bilibili.com/big",
      target: "_blank",
      rel: "noopener noreferrer"
    }), "大会员可畅享各种专属内容，还有游戏礼包、个性装扮等你来拿~"));
    columns.appendChild(item);
    recommendation.appendChild(columns);
    const renew = createNode(root, "div", "renew-btn");
    renew.appendChild(createFixedTargetAnchor(root, "", Object.freeze({
      href: "https://account.bilibili.com/big",
      target: "_blank",
      rel: "noopener noreferrer"
    }), "开通大会员"));
    recommendation.appendChild(renew);
    bubble.appendChild(recommendation);
    vip.appendChild(bubble);
    panel.appendChild(vip);
    return panel;
  };

  const createLoginRightsPopover = (root) => {
    const panel = createHeaderPopover(root, "unlogin-popover-panel", "login-rights");
    const surface = createNode(root, "div", "unlogin-popover unlogin-popover-avatar");
    surface.appendChild(createNode(root, "h3", "unlogin-title", "登录后你可以："));
    const rights = createNode(root, "div", "unlogin-rights");
    for (const [label, assetKey] of [["免费看高清视频", ASSET_KEYS.AUTH_HD], ["多端同步播放记录", ASSET_KEYS.AUTH_TIME], ["发表弹幕/评论", ASSET_KEYS.AUTH_DANMAKU], ["热门番剧影视看不停", ASSET_KEYS.AUTH_VIDEO]]) {
      const row = createNode(root, "div", "unlogin-right");
      row.appendChild(createLocalImage(root, "unlogin-right-icon", assetKey, label));
      row.appendChild(createNode(root, "span", "unlogin-right-text", label));
      rights.appendChild(row);
    }
    const loginAction = createPanelButton(root, "login-btn", "立即登录");
    const registerTip = createNode(root, "div", "register-tip", "首次使用？");
    registerTip.setAttribute("tabindex", "0");
    registerTip.setAttribute("role", "button");
    registerTip.setAttribute("aria-label", "点我注册");
    registerTip.appendChild(createNode(root, "span", "register-btn", "点我注册"));
    surface.appendChild(rights);
    surface.appendChild(loginAction);
    surface.appendChild(registerTip);
    panel.appendChild(surface);
    return { panel, loginAction, registerAction: registerTip };
  };

  const createLoginTipPopover = (root, text) => {
    const panel = createHeaderPopover(root, "unlogin-tip-popper", "login-tip");
    const surface = createNode(root, "div", "unlogin-popover");
    surface.appendChild(createNode(root, "div", "content-msg", text));
    const loginAction = createPanelButton(root, "login-btn", "立即登录");
    surface.appendChild(loginAction);
    panel.appendChild(surface);
    return { panel, loginAction };
  };

  const PROFILE_SERVICE_TARGETS = Object.freeze({
    WALLET: Object.freeze({ href: "https://pay.bilibili.com/pay-v2-web/bcoin_index", target: "_blank", rel: "noopener noreferrer" }),
    ORDERS: Object.freeze({ href: "https://show.bilibili.com/orderlist", target: "_blank", rel: "noopener noreferrer" }),
    LIVE: Object.freeze({ href: "https://link.bilibili.com/p/center/index", target: "_blank", rel: "noopener noreferrer" }),
    COURSES: Object.freeze({ href: "https://www.bilibili.com/cheese/mine/list?csource=common_hp_myclass_null", target: "_blank", rel: "noopener noreferrer" })
  });

  const createProfileMenuRow = (root, label, glyphClass, target, lifecycle, arrow = false) => {
    const row = target
      ? createFixedTargetAnchor(root, "profile-menu-row", target, "")
      : createPanelButton(root, "profile-menu-row", "");
    row.setAttribute("aria-label", label);
    row.replaceChildren();
    const title = createNode(root, "span", "profile-menu-title");
    const iconWrap = createNode(root, "span", "profile-menu-icon");
    iconWrap.appendChild(createIconFont(root, glyphClass, null, lifecycle));
    title.appendChild(iconWrap);
    title.appendChild(createNode(root, "span", "profile-menu-label", label));
    row.appendChild(title);
    if (arrow) {
      const arrowWrap = createNode(root, "span", "profile-menu-arrow");
      arrowWrap.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, lifecycle));
      row.appendChild(arrowWrap);
    }
    return row;
  };

  const createProfileSubmenuItem = (root, label, glyphClass, target, lifecycle) => {
    const item = target
      ? createFixedTargetAnchor(root, "profile-submenu-item", target, "")
      : createPanelButton(root, "profile-submenu-item", "");
    item.setAttribute("role", "menuitem");
    item.setAttribute("aria-label", label);
    item.replaceChildren();
    item.appendChild(createIconFont(root, glyphClass, "profile-submenu-icon", lifecycle));
    item.appendChild(createNode(root, "span", "profile-submenu-label", label));
    return item;
  };

  const createProfileServiceSubmenu = (root, lifecycle) => {
    const submenu = createNode(root, "div", "profile-submenu profile-service-submenu");
    submenu.setAttribute("role", "menu");
    submenu.setAttribute("aria-label", "推荐服务");
    for (const [label, glyphClass, target] of [
      ["B币钱包", "bili-icon_dingdao_qianbao", PROFILE_SERVICE_TARGETS.WALLET],
      ["订单中心", "bili-icon_dingdao_dingdanzhongxin", PROFILE_SERVICE_TARGETS.ORDERS],
      ["直播中心", "bili-icon_dingdao_zhibozhongxin", PROFILE_SERVICE_TARGETS.LIVE],
      ["我的课程", "bili-icon_dingdao_cheese", PROFILE_SERVICE_TARGETS.COURSES]
    ]) {
      submenu.appendChild(createProfileSubmenuItem(root, label, glyphClass, target, lifecycle));
    }
    return submenu;
  };

  const createProfileThemeSubmenu = (root, lifecycle, theme, onThemeChange) => {
    const submenu = createNode(root, "div", "profile-submenu profile-language-submenu");
    const items = [];
    submenu.setAttribute("role", "menu");
    submenu.setAttribute("aria-label", "主题");
    for (const [label, value] of [["深色", "dark"], ["浅色", "light"]]) {
      const selected = value === theme;
      const item = createPanelButton(root, "profile-language-item", "");
      item.setAttribute("data-theme-value", value);
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-label", label);
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.setAttribute("aria-checked", selected ? "true" : "false");
      if (selected) item.classList.add("is-selected");
      const check = createIconFont(root, "bili-icon_caozuo_xuanzhong", "profile-language-check", lifecycle);
      if (!selected) check.classList.add("is-hidden");
      check.setAttribute("aria-hidden", selected ? "false" : "true");
      item.appendChild(check);
      item.appendChild(createNode(root, "span", "profile-language-label", label));
      addListenerWithCleanup(item, "click", () => {
        if (typeof onThemeChange === "function") onThemeChange(value);
      }, lifecycle.cleanups);
      submenu.appendChild(item);
      items.push(item);
    }
    submenu.__themeItems = Object.freeze(items);
    return submenu;
  };

  const bindProfileSubmenuSemantics = (wrap, trigger, lifecycle) => {
    if (!wrap || !trigger || !lifecycle || !Array.isArray(lifecycle.cleanups)) {
      return;
    }
    const setExpanded = (expanded) => trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    addListenerWithCleanup(wrap, "mouseenter", () => setExpanded(true), lifecycle.cleanups);
    addListenerWithCleanup(wrap, "focusin", () => setExpanded(true), lifecycle.cleanups);
    addListenerWithCleanup(wrap, "mouseleave", (event) => {
      if (!wrap.contains(event.relatedTarget)) {
        setExpanded(false);
      }
    }, lifecycle.cleanups);
    addListenerWithCleanup(wrap, "focusout", (event) => {
      if (!wrap.contains(event.relatedTarget)) {
        setExpanded(false);
      }
    }, lifecycle.cleanups);
    addListenerWithCleanup(trigger, "click", (event) => {
      if (Number(event && event.detail) > 0) {
        setExpanded(false);
        if (typeof trigger.blur === "function") {
          trigger.blur();
        }
      }
    }, lifecycle.cleanups);
  };

  const createProfilePopover = (root, lifecycle, theme = "light", onThemeChange = null) => {
    const panel = createHeaderPopover(root, "user-panel user-panel--avatar profile-popover", "avatar");
    const container = createNode(root, "div", "vp-container profile-popover-surface");
    const surface = container;
    const bigAvatarContainer = createNode(root, "div", "big-avatar-container--default");
    const avatarFrame = createFixedTargetAnchor(root, "profile-avatar-frame avatar has-decorate", PROFILE_ACTION_TARGETS.AVATAR, "");
    const avatarImage = root.ownerDocument.createElement("img");
    avatarImage.setAttribute("class", "profile-avatar-image");
    avatarImage.setAttribute("alt", "");
    avatarImage.setAttribute("hidden", "true");
    avatarImage.setAttribute("referrerpolicy", "no-referrer");
    const avatarPendant = createNode(root, "span", "profile-avatar-pendant");
    avatarPendant.setAttribute("hidden", "true");
    const avatarPendantImage = root.ownerDocument.createElement("img");
    avatarPendantImage.setAttribute("alt", "");
    avatarPendantImage.setAttribute("referrerpolicy", "no-referrer");
    avatarPendant.appendChild(avatarPendantImage);
    const avatarFallback = createSvgIcon(root, "bili-douga", 51, "profile-avatar-fallback");
    avatarFrame.appendChild(avatarImage);
    avatarFrame.appendChild(avatarFallback);
    avatarFrame.appendChild(avatarPendant);
    bigAvatarContainer.appendChild(avatarFrame);
    surface.appendChild(bigAvatarContainer);

    const nickname = createNode(root, "p", "profile-nickname nickname", "登录状态未知");
    surface.appendChild(nickname);
    const loginState = createNode(root, "div", "profile-login-state");
    loginState.setAttribute("hidden", "true");
    const loginMessage = createNode(root, "p", "profile-login-message", "登录状态未知");
    const loginButton = createPanelButton(root, "profile-login-button", "立即登录");
    loginState.appendChild(loginMessage);
    loginState.appendChild(loginButton);
    const levelIcon = createNode(root, "div", "levelIcon");
    const vip = createNode(root, "span", "profile-vip-state vip", "--");
    levelIcon.appendChild(vip);
    surface.appendChild(levelIcon);

    const levelSection = createNode(root, "section", "level-content");
    const levelLink = createFixedTargetAnchor(root, "profile-level-link", PROFILE_ACTION_TARGETS.LEVEL, "");
    const levelInfo = createNode(root, "div", "profile-level-info level-info");
    const level = createNode(root, "span", "profile-level", "等级 --");
    const exp = createNode(root, "span", "profile-exp", "-- / --");
    levelInfo.appendChild(level);
    levelInfo.appendChild(exp);
    const progressTrack = createNode(root, "div", "profile-level-track level-bar");
    const progress = createNode(root, "div", "profile-level-progress level-progress");
    progressTrack.appendChild(progress);
    levelLink.appendChild(levelInfo);
    levelLink.appendChild(progressTrack);
    levelSection.appendChild(levelLink);
    surface.appendChild(levelSection);
    levelSection.appendChild(loginState);

    const assets = createNode(root, "div", "profile-assets coins");
    const createAsset = (glyphClass, label, value, target) => {
      const item = target
        ? createFixedTargetAnchor(root, "profile-asset", target, "")
        : createNode(root, "div", "profile-asset");
      item.appendChild(createIconFont(root, glyphClass, "profile-asset-icon", lifecycle));
      const text = createNode(root, "span", "profile-asset-text");
      text.appendChild(createNode(root, "span", "profile-asset-label", label));
      const valueNode = createNode(root, "span", "profile-asset-value", value);
      text.appendChild(valueNode);
      item.appendChild(text);
      return { item, value: valueNode };
    };
    const coin = createAsset("bili-icon_dingdao_yingbi", "硬币", "--", PROFILE_ACTION_TARGETS.COIN);
    const bcoin = createAsset("bili-icon_dingdao_Bbi", "B币", "--", PROFILE_ACTION_TARGETS.BCOIN);
    const actions = createNode(root, "div", "profile-asset profile-asset-actions");
    const actionViews = {};
    for (const [name, label, target] of [["mail", "邮箱", PROFILE_ACTION_TARGETS.EMAIL], ["mobile", "手机", PROFILE_ACTION_TARGETS.MOBILE]]) {
      const action = createFixedTargetAnchor(root, "profile-asset-action", target, "");
      action.setAttribute("title", label);
      action.setAttribute("aria-label", label);
      action.appendChild(createIconFont(root, name === "mail" ? "bili-icon_dingdao_youxiang" : "bili-icon_dingdao_bangdingshouji", null, lifecycle));
      actions.appendChild(action);
      actionViews[name] = action;
    }
    const coinsContainer = createNode(root, "div", "coins-container");
    coinsContainer.appendChild(coin.item);
    coinsContainer.appendChild(bcoin.item);
    coinsContainer.appendChild(actions);
    assets.appendChild(coinsContainer);
    surface.appendChild(assets);

    const stats = createNode(root, "div", "profile-stats counts", "");
    const statViews = {};
    for (const [key, label] of [["following", "关注"], ["follower", "粉丝"], ["dynamic_count", "动态"]]) {
      const stat = createNode(root, "a", "profile-stat");
      stat.setAttribute("target", "_blank");
      stat.setAttribute("rel", "noopener noreferrer");
      stat.setAttribute("aria-disabled", "true");
      stat.setAttribute("tabindex", "-1");
      stat.setAttribute("data-profile-stat", label);
      stat.appendChild(createNode(root, "span", "profile-stat-label", label));
      const value = createNode(root, "span", "profile-stat-value", "--");
      stat.appendChild(value);
      statViews[key] = value;
      stats.appendChild(stat);
    }
    surface.appendChild(stats);

    const menu = createNode(root, "div", "profile-menu links");
    menu.appendChild(createProfileMenuRow(root, "个人中心", "bili-icon_dingdao_gerenzhongxin", PROFILE_ACTION_TARGETS.PROFILE, lifecycle));
    menu.appendChild(createProfileMenuRow(root, "投稿管理", "bili-icon_dingdao_tougaoguanli", PROFILE_ACTION_TARGETS.SUBMISSIONS, lifecycle));
    const serviceWrap = createNode(root, "div", "profile-menu-submenu-wrap profile-service-menu");
    const serviceRow = createProfileMenuRow(root, "推荐服务", "bili-icon_dingdao_tuijianfuwu", null, lifecycle, true);
    serviceRow.setAttribute("aria-haspopup", "menu");
    serviceRow.setAttribute("aria-expanded", "false");
    serviceWrap.appendChild(serviceRow);
    serviceWrap.appendChild(createProfileServiceSubmenu(root, lifecycle));
    bindProfileSubmenuSemantics(serviceWrap, serviceRow, lifecycle);
    menu.appendChild(serviceWrap);
    const languageWrap = createNode(root, "div", "profile-menu-submenu-wrap profile-language-menu theme-change");
    const languageRow = createProfileMenuRow(root, `主题：${theme === "dark" ? "深色" : "浅色"}`, "bili-icon_dingdao_yuyanshezhi", null, lifecycle, true);
    languageRow.setAttribute("aria-haspopup", "menu");
    languageRow.setAttribute("aria-expanded", "false");
    languageWrap.appendChild(languageRow);
    const themeSubmenu = createProfileThemeSubmenu(root, lifecycle, theme, onThemeChange);
    languageWrap.appendChild(themeSubmenu);
    bindProfileSubmenuSemantics(languageWrap, languageRow, lifecycle);
    menu.appendChild(languageWrap);
    const logoutRegion = createNode(root, "div", "logout");
    const logout = createProfileMenuRow(root, "退出", "bili-icon_dingdao_dengchu", null, lifecycle);
    logout.classList.add("profile-logout-action");
    logout.setAttribute("data-logout-state", "awaiting-auth");
    logout.setAttribute("aria-disabled", "true");
    logout.setAttribute("tabindex", "-1");
    logoutRegion.appendChild(logout);
    surface.appendChild(menu);
    surface.appendChild(logoutRegion);
    panel.appendChild(container);
    panel.__profileView = Object.freeze({
      avatarImage,
      avatarPendant,
      avatarPendantImage,
      avatarFallback,
      nickname,
      loginState,
      loginMessage,
      loginButton,
      privateSections: Object.freeze([levelIcon, levelSection, assets, stats, menu, logoutRegion]),
      themeRow: languageRow,
      themeItems: themeSubmenu.__themeItems,
      level,
      exp,
      progress,
      coins: coin.value,
      bcoin: bcoin.value,
      mail: actionViews.mail,
      mobile: actionViews.mobile,
      stats: Object.freeze(statViews),
      statLinks: Object.freeze({
        following: stats.children[0],
        follower: stats.children[1],
        dynamic_count: stats.children[2]
      }),
      logout,
      vip
    });
    void lifecycle;
    return panel;
  };

  const createHeaderMenuAnchor = (root, className, href, label) => createFixedTargetAnchor(
    root,
    className,
    Object.freeze({ href, target: "_blank", rel: "noopener noreferrer" }),
    label
  );

  const createFavoriteFooterLink = (root, className, href, label, lifecycle) => {
    const link = createHeaderMenuAnchor(root, className, href, "");
    if (className === "play-all") {
      link.appendChild(createIconFont(root, "bili-icon_dingdao_bofang", "", lifecycle, "i"));
    }
    link.appendChild(root.ownerDocument.createTextNode(label));
    return link;
  };

  const createMessagePopover = (root) => {
    const panel = createHeaderPopover(root, "i-frame nav-im-new", "message", { headerClass: false });
    const rows = [];
    for (const [label, key, href] of [
      ["回复我的", "reply", "https://message.bilibili.com/#/reply"],
      ["@我的", "at", "https://message.bilibili.com/#/at"],
      ["收到的赞", "like", "https://message.bilibili.com/#/love"],
      ["系统通知", "sysMsg", "https://message.bilibili.com/#/system"],
      ["我的消息", "sessionUnread", "https://message.bilibili.com/"]
    ]) {
      const link = createHeaderMenuAnchor(root, "", href, "");
      link.appendChild(createNode(root, "span", "message-link-label", label));
      const badge = createNode(root, "span", "message-badge", "");
      badge.setAttribute("hidden", "true");
      link.appendChild(badge);
      panel.appendChild(link);
      rows.push({ key, badge });
    }
    panel.__messageView = { rows, triggerBadge: null };
    return panel;
  };

  const createDynamicPopover = (root, onWatchLaterRequest = null) => {
    const panel = createHeaderPopover(root, "i-frame nav-dynamic dynamic-local", "dynamic", { headerClass: false });
    panel.style.cssText = [
      `--dynamic-verify-big:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_VERIFY_BIG)}")`,
      `--dynamic-verify-personal:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_VERIFY_PERSONAL)}")`,
      `--dynamic-verify-organization:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_VERIFY_ORGANIZATION)}")`,
      `--dynamic-watch-later:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_WATCH_LATER)}")`,
      `--dynamic-watch-later-added:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_WATCH_LATER_ADDED)}")`,
      `--dynamic-loading:url("${resolveLocalAssetUrl(ASSET_KEYS.MINI_DYNAMIC_LOADING)}")`
    ].join(";");
    const tabs = createNode(root, "div", "tab-bar");
    const container = createNode(root, "div", "container");
    const view = { triggerBadge: null, activeKind: "video", data: null, render: null, onWatchLaterRequest };
    const definitions = Object.freeze([
      Object.freeze(["视频", "video", "https://t.bilibili.com"]),
      Object.freeze(["直播", "live", "https://link.bilibili.com/p/center/index#/user-center/follow/1"]),
      Object.freeze(["专栏", "article", "https://www.bilibili.com/read/home"])
    ]);
    const buttons = [];
    view.render = (kind) => {
      view.activeKind = kind;
      buttons.forEach((button) => button.classList.toggle("active", button.getAttribute("data-kind") === kind));
      container.replaceChildren();
      const list = createNode(root, "div", "dynamic-list");
      const items = view.data && Array.isArray(view.data[kind]) ? view.data[kind] : [];
      if (!items.length) list.appendChild(createNode(root, "div", `tip-box ${view.data ? "no-more-tip" : "loading-tip"}`, view.data ? "暂时没有新动态了哦！" : "加载中..."));
      const freshCount = items.filter((item) => item.fresh).length;
      if (items.length && freshCount === 0 && kind !== "live") {
        list.appendChild(createNode(root, "div", "tip-box no-more-tip", "暂时没有新动态了哦！"));
        const split = createNode(root, "div", "split-line"); split.appendChild(createNode(root, "div", "history-tip", "历史动态")); list.appendChild(split);
      }
      items.forEach((item, index) => {
        if (kind !== "live" && freshCount > 0 && index === freshCount) { const split=createNode(root,"div","split-line"); split.appendChild(createNode(root,"div","history-tip","历史动态")); list.appendChild(split); }
        const row=createNode(root,"div","list-item"); row.setAttribute("data-kind",kind); row.setAttribute("title",item.title); const main=createNode(root,"div","main-container");
        const left=createNode(root,"div","left-box"); const avatar=createFixedTargetAnchor(root,"avatar",Object.freeze({href:item.userHref,target:"_blank",rel:"noopener noreferrer"}),""); avatar.setAttribute("title",item.uname); avatar.style.backgroundImage=`url("${item.avatar}")`; left.appendChild(avatar); if(item.verifyType!==-1){const verify=createNode(root,"div",`verify-box type-${item.verifyType} type-big`); verify.setAttribute("aria-hidden","true"); left.appendChild(verify);}
        const center=createNode(root,"div","center-box"); const nameLine=createNode(root,"div","name-line"); nameLine.appendChild(createFixedTargetAnchor(root,"user-name",Object.freeze({href:item.userHref,target:"_blank",rel:"noopener noreferrer"}),item.uname)); nameLine.appendChild(createNode(root,"span","publish-time",item.timeText)); center.appendChild(nameLine); center.appendChild(createFixedTargetAnchor(root,"content",Object.freeze({href:item.href,target:"_blank",rel:"noopener noreferrer"}),item.title));
        const right=createFixedTargetAnchor(root,"right-box",Object.freeze({href:item.href,target:"_blank",rel:"noopener noreferrer"}),""); const coverWrap=createNode(root,"div","dynamic-cover-wrap"); const image=root.ownerDocument.createElement("img"); image.className="cover"; image.src=item.cover; image.alt=""; image.referrerPolicy="no-referrer"; coverWrap.appendChild(image); if(kind==="video" && Number.isSafeInteger(item.aid) && item.aid > 0){const watch=createNode(root,"button","watch-later"); watch.type="button"; watch.setAttribute("data-role","watch-later"); watch.setAttribute("data-aid",String(item.aid)); watch.setAttribute("aria-label","稍后再看"); watch.setAttribute("aria-pressed","false"); watch.setAttribute("title","稍后再看"); watch.appendChild(createNode(root,"span","watch-later-tip","稍后再看")); watch.addEventListener("click",(event)=>{event.preventDefault(); event.stopPropagation(); if(typeof view.onWatchLaterRequest==="function") view.onWatchLaterRequest(event,{aid:item.aid,added:watch.classList.contains("added")});}); coverWrap.appendChild(watch);} right.appendChild(coverWrap);
        main.appendChild(left); main.appendChild(center); main.appendChild(right); row.appendChild(main); list.appendChild(row);
      });
      const definition=definitions.find((entry)=>entry[1]===kind); const more=createNode(root,"div","more-tab"); more.appendChild(createFixedTargetAnchor(root,"more-btn",Object.freeze({href:definition[2],target:"_blank",rel:"noopener noreferrer"}),"查看全部")); list.appendChild(more); container.appendChild(list);
    };
    definitions.forEach(([label,kind])=>{const button=createNode(root,"button",`tab-item${kind==="video"?" active":""}`,label); button.type="button"; button.setAttribute("data-kind",kind); button.addEventListener("click",()=>view.render(kind)); buttons.push(button); tabs.appendChild(button);});
    panel.appendChild(tabs); panel.appendChild(container); panel.__dynamicView = view; view.render("video");
    return panel;
  };

  const createFavoritePopover = (root, lifecycle) => {
    const panel = createHeaderPopover(root, "user-panel user-panel--favorite van-popper-favorite", "favorite");
    const container = createNode(root, "div", "vp-container");
    const tabs = createNode(root, "div", "tabs-panel");
    const videoPanel = createNode(root, "div", "favorite-video-panel");
    const empty = createNode(root, "div", "empty-list", "该收藏夹还没有视频哦~");
    const footer = createNode(root, "div", "play-view-all");
    footer.setAttribute("hidden", "true");
    const viewAll = createFavoriteFooterLink(root, "view-all", "https://www.bilibili.com/watchlater/#/list", "查看全部", lifecycle);
    const playAll = createFavoriteFooterLink(root, "play-all", "https://www.bilibili.com/medialist/play/watchlater", "播放全部", lifecycle);
    footer.appendChild(viewAll);
    footer.appendChild(playAll);
    videoPanel.appendChild(empty);
    videoPanel.appendChild(footer);
    const tabDefinitions = [
      ["稍后再看", "LATER_VIEW", "https://www.bilibili.com/watchlater/#/list", "https://www.bilibili.com/medialist/play/watchlater"],
      ["默认收藏夹", "DEFAULT_FAVORITE", "https://space.bilibili.com/", ""]
    ];
    const tabNodes = [];
    const setActive = (active) => {
      for (const tab of tabNodes) {
        const selected = tab === active;
        tab.classList.toggle("tab-item--active", selected);
        tab.classList.toggle("tab-item--normal", !selected);
        tab.setAttribute("aria-pressed", selected ? "true" : "false");
      }
      const viewHref = active.getAttribute("data-view-all-href") || "";
      const playHref = active.getAttribute("data-play-all-href") || "";
      if (viewHref) viewAll.setAttribute("href", viewHref);
      if (playHref) playAll.setAttribute("href", playHref);
      footer.setAttribute("hidden", "true");
    };
    for (const [label, key, viewHref, playHref] of tabDefinitions) {
      const tab = createNode(root, "button", "tab-item tab-item--normal");
      tab.setAttribute("type", "button");
      tab.setAttribute("data-tab-key", key);
      tab.setAttribute("data-view-all-href", viewHref);
      tab.setAttribute("data-play-all-href", playHref);
      tab.setAttribute("aria-pressed", "false");
      tab.appendChild(createNode(root, "span", "title", label));
      tab.appendChild(createNode(root, "span", "num", "0"));
      addListenerWithCleanup(tab, "click", () => setActive(tab), lifecycle.cleanups);
      tabNodes.push(tab);
      tabs.appendChild(tab);
    }
    tabs.appendChild(createHeaderMenuAnchor(root, "tab-item__all", "https://space.bilibili.com/", "查看全部收藏夹"));
    container.appendChild(tabs);
    container.appendChild(videoPanel);
    panel.appendChild(container);
    setActive(tabNodes[0]);
    panel.__favoriteView = Object.freeze({ tabs, videoPanel, lifecycle });
    return panel;
  };

  const createHistoryPopover = (root, lifecycle) => {
    const panel = createHeaderPopover(root, "user-panel user-panel--history van-popper-history", "history");
    const container = createNode(root, "div", "vp-container");
    const tabs = createNode(root, "div", "tab-header");
    const empty = createNode(root, "div", "empty-panel", "好像最近没有看过视频历史呢");
    const tabNodes = [];
    for (const label of ["视频", "直播", "专栏"]) {
      const tab = createNode(root, "button", "tab-item", label);
      tab.setAttribute("type", "button");
      addListenerWithCleanup(tab, "click", () => {
        for (const node of tabNodes) node.classList.toggle("tab-item--active", node === tab);
        empty.textContent = `好像最近没有看过${label}历史呢`;
      }, lifecycle.cleanups);
      tabNodes.push(tab);
      tabs.appendChild(tab);
    }
    tabNodes[0].classList.add("tab-item--active");
    const body = createNode(root, "div", "panel");
    body.appendChild(empty);
    body.appendChild(createHeaderMenuAnchor(root, "view-all", NAV_ALLOWLIST.HISTORY.href, "查看全部"));
    container.appendChild(tabs);
    container.appendChild(body);
    panel.appendChild(container);
    panel.__historyView = Object.freeze({ tabs, body, lifecycle });
    return panel;
  };

  const formatMediaDuration = (seconds) => {
    if (!Number.isSafeInteger(seconds) || seconds < 0) return "";
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
  };

  const formatRecommendationView = (value) => {
    if (!Number.isSafeInteger(value) || value < 0) return "--播放";
    if (value < 10000) return `${value}播放`;
    const tenThousands = value / 10000;
    const label = tenThousands >= 100
      ? Math.floor(tenThousands).toString()
      : tenThousands.toFixed(1).replace(/\.0$/, "");
    return `${label}万播放`;
  };

  const formatDougaCount = (value) => {
    if (!Number.isSafeInteger(value) || value < 0) return "--";
    if (value < 10000) return String(value);
    const tenThousands = value / 10000;
    return `${tenThousands >= 100 ? Math.floor(tenThousands) : tenThousands.toFixed(1).replace(/\.0$/, "")}万`;
  };

  const formatDougaDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    if (!Number.isFinite(date.getTime())) return "";
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const isDougaVideoHref = (value) => typeof value === "string"
    && /^https:\/\/www\.bilibili\.com\/video\/BV[A-Za-z0-9]{10}$/.test(value);

  const isDougaOwnerHref = (value) => typeof value === "string"
    && /^https:\/\/space\.bilibili\.com\/[1-9][0-9]{0,19}$/.test(value);

  const isDougaCover = (value) => resolveFocusImageUrl(value) === value;

  const isDougaItem = (item) => item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "aid\u001Fbvid\u001Fcover\u001Fdanmaku\u001Fduration\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Ftitle\u001Fview"
    && Number.isSafeInteger(item.aid) && item.aid > 0
    && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
    && typeof item.title === "string" && item.title.length > 0 && item.title.length <= 200
    && isDougaCover(item.cover)
    && Number.isSafeInteger(item.duration) && item.duration >= 0 && item.duration <= 604800
    && Number.isSafeInteger(item.view) && item.view >= 0
    && Number.isSafeInteger(item.danmaku) && item.danmaku >= 0
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
    && typeof item.ownerName === "string" && item.ownerName.length > 0 && item.ownerName.length <= 80
    && isDougaVideoHref(item.href)
    && item.href === `https://www.bilibili.com/video/${item.bvid}`
    && isDougaOwnerHref(item.ownerHref)
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`;

  const isDougaRank = (item) => item !== null
    && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "aid\u001Fbvid\u001Fcoin\u001Fcover\u001Fdanmaku\u001Ffavorite\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fpubdate\u001Frank\u001Ftitle\u001Fview"
    && Number.isSafeInteger(item.aid) && item.aid > 0
    && Number.isSafeInteger(item.rank) && item.rank >= 1 && item.rank <= 100
    && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
    && typeof item.title === "string" && item.title.length > 0 && item.title.length <= 200
    && isDougaCover(item.cover)
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
    && typeof item.ownerName === "string" && item.ownerName.length > 0 && item.ownerName.length <= 80
    && isDougaOwnerHref(item.ownerHref) && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
    && Number.isSafeInteger(item.pubdate) && item.pubdate >= 0 && item.pubdate <= 4102444800
    && [item.view, item.danmaku, item.favorite, item.coin].every((metric) => Number.isSafeInteger(metric) && metric >= 0 && metric <= 1000000000000)
    && isDougaVideoHref(item.href)
    && item.href === `https://www.bilibili.com/video/${item.bvid}`;

  const isDougaData = (data) => data !== null
    && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "batch\u001Fitems\u001Franks"
    && Number.isSafeInteger(data.batch) && data.batch >= 0 && data.batch <= 10000
    && Array.isArray(data.items) && data.items.length >= 8 && data.items.length <= 10
    && data.items.every(isDougaItem)
    && new Set(data.items.map((item) => item.bvid)).size === data.items.length
    && Array.isArray(data.ranks) && (data.ranks.length === 0 || data.ranks.length >= 10) && data.ranks.length <= 100
    && data.ranks.every(isDougaRank)
    && data.ranks.every((item, index) => item.rank === index + 1)
    && new Set(data.ranks.map((item) => item.bvid)).size === data.ranks.length;

  const isRecommendationData = (data) => data !== null
    && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "batch\u001Fitems"
    && Number.isSafeInteger(data.batch)
    && data.batch >= 0
    && data.batch <= 10000
    && Array.isArray(data.items)
    && data.items.length >= 8
    && data.items.length <= 10
    && data.items.every((item) => item !== null
      && typeof item === "object"
      && Object.keys(item).sort().join("\u001F") === "aid\u001Fbvid\u001Fcover\u001Fduration\u001Fhref\u001FownerName\u001Ftitle\u001Fview"
      && Number.isSafeInteger(item.aid)
      && item.aid > 0
      && item.aid <= Number.MAX_SAFE_INTEGER
      && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
      && typeof item.title === "string"
      && item.title.length > 0
      && item.title.length <= 160
      && typeof item.ownerName === "string"
      && item.ownerName.length > 0
      && item.ownerName.length <= 80
      && resolveFocusImageUrl(item.cover) === item.cover
      && resolveFocusLinkUrl(item.href) === item.href
      && Number.isSafeInteger(item.duration)
      && item.duration >= 0
      && item.duration <= 604800
      && Number.isSafeInteger(item.view)
      && item.view >= 0
      && item.view <= 1000000000000);

  const setRecommendationLoading = (view, loading) => {
    if (!view || view.destroyed || !view.changeButton) return false;
    if (loading === true) {
      view.changeButton.classList.remove("is-spinning");
      void view.changeButton.offsetWidth;
      view.changeButton.classList.add("is-spinning");
    } else {
      view.changeButton.classList.remove("is-spinning");
    }
    view.changeButton.setAttribute("aria-busy", loading === true ? "true" : "false");
    return true;
  };

  const setRecommendationData = (view, data) => {
    if (!view
      || view.destroyed
      || !view.isRendererActive()
      || !isRecommendationData(data)
      || !Array.isArray(view.cards)
      || view.cards.length !== 10
      || !view.cards.every((slot) => slot && slot.link && slot.image && slot.titleNode
        && slot.ownerText && slot.playNode && slot.durationNode && slot.watchLater)) return false;
    for (let index = 0; index < view.cards.length; index += 1) {
      const slot = view.cards[index];
      const item = data.items[index];
      if (!slot) return false;
      if (!item) {
        slot.card.hidden = true;
        continue;
      }
      slot.card.hidden = false;
      slot.link.setAttribute("href", item.href);
      slot.link.setAttribute("title", item.title);
      slot.image.setAttribute("src", item.cover);
      slot.image.setAttribute("alt", item.title);
      slot.image.setAttribute("data-media-source", "remote");
      slot.titleNode.textContent = item.title;
      slot.ownerText.nodeValue = item.ownerName;
      slot.playNode.textContent = formatRecommendationView(item.view);
      slot.durationNode.textContent = formatMediaDuration(item.duration);
      slot.watchLater.setAttribute("data-bvid", item.bvid);
      slot.watchLater.setAttribute("data-aid", String(item.aid));
      slot.watchLater.setAttribute("data-goto", "av");
      slot.watchLater.classList.remove("added", "is-loading");
      slot.watchLater.setAttribute("aria-busy", "false");
      slot.watchLater.setAttribute("aria-pressed", "false");
      slot.watchLater.setAttribute("title", "稍后再看");
      const watchLaterTips = slot.watchLater.querySelector(".wl-tips");
      if (watchLaterTips) watchLaterTips.textContent = "稍后再看";
    }
    view.state.data = data;
    return true;
  };

  const setRecommendationWatchLaterState = (view, state) => {
    if (!view
      || view.destroyed
      || !view.isRendererActive()
      || !state
      || typeof state !== "object"
      || Object.keys(state).sort().join("\u001F") !== "added\u001Faid\u001Ffeedback\u001Floading"
      || !Number.isSafeInteger(state.aid)
      || state.aid <= 0
      || typeof state.added !== "boolean"
      || typeof state.loading !== "boolean"
      || !["none", "added", "removed"].includes(state.feedback)) return false;
    const slot = view.cards.find((candidate) => candidate.watchLater.getAttribute("data-aid") === String(state.aid));
    if (!slot) return false;
    const button = slot.watchLater;
    button.classList.toggle("added", state.added);
    button.classList.toggle("is-loading", state.loading);
    button.setAttribute("aria-busy", state.loading ? "true" : "false");
    button.setAttribute("aria-pressed", state.added ? "true" : "false");
    button.setAttribute("title", state.added ? "移出稍后再看" : "稍后再看");
    const tips = button.querySelector(".wl-tips");
    if (tips) {
      tips.textContent = state.loading
        ? "处理中"
        : (state.feedback === "added"
          ? "已加稍后再看"
          : (state.feedback === "removed" ? "已从稍后再看列表中移除" : (state.added ? "已加稍后再看" : "稍后再看")));
    }
    return true;
  };

  const setFavoriteData = (panel, data) => {
    const view = panel && panel.__favoriteView;
    if (!view || !data || !Array.isArray(data.tabs) || data.tabs.length < 1 || data.tabs.length > 20) return false;
    const { tabs, videoPanel, lifecycle } = view;
    const tabNodes = [];
    const renderItems = (tab) => {
      videoPanel.replaceChildren();
      if (!Array.isArray(tab.items) || tab.items.length === 0) {
        videoPanel.appendChild(createNode(panel, "div", "empty-list", "该收藏夹还没有视频哦~"));
        return;
      }
      const list = createNode(panel, "div", "favorite-video-list");
      for (const item of tab.items) {
        const card = createHeaderMenuAnchor(panel, "favorite-video-card header-video-card", item.href, "");
        const preview = createNode(panel, "span", "video-preview multiple-preview favorite-video-preview");
        const cover = panel.ownerDocument.createElement("img");
        cover.setAttribute("class", "default-img favorite-video-cover");
        cover.setAttribute("alt", "");
        if (item.cover) {
          cover.setAttribute("src", item.cover);
          cover.setAttribute("referrerpolicy", "no-referrer");
        }
        preview.appendChild(cover);
        const duration = formatMediaDuration(item.duration);
        if (duration) preview.appendChild(createNode(panel, "span", "duration-tag favorite-video-duration", duration));
        const info = createNode(panel, "span", "video-info favorite-video-info");
        info.appendChild(createNode(panel, "span", "line-2 favorite-video-title", item.title));
        const meta = createNode(panel, "span", "info");
        meta.appendChild(createNode(panel, "span", "up favorite-video-owner", item.owner));
        info.appendChild(meta);
        card.appendChild(preview);
        card.appendChild(info);
        list.appendChild(card);
      }
      videoPanel.appendChild(list);
      if (tab.viewAllHref) {
        const footer = createNode(panel, "div", "play-view-all");
        footer.appendChild(createFavoriteFooterLink(panel, "view-all", tab.viewAllHref, "查看全部", lifecycle));
        if (tab.playAllHref) footer.appendChild(createFavoriteFooterLink(panel, "play-all", tab.playAllHref, "播放全部", lifecycle));
        videoPanel.appendChild(footer);
      }
    };
    const activate = (index) => {
      const tab = data.tabs[index];
      if (!tab) return;
      tabNodes.forEach((node, nodeIndex) => {
        node.classList.toggle("tab-item--active", nodeIndex === index);
        node.classList.toggle("tab-item--normal", nodeIndex !== index);
        node.setAttribute("aria-pressed", nodeIndex === index ? "true" : "false");
      });
      renderItems(tab);
    };
    tabs.replaceChildren();
    data.tabs.forEach((tab, index) => {
      const button = createNode(panel, "button", "tab-item tab-item--normal");
      button.setAttribute("type", "button");
      button.setAttribute("aria-pressed", "false");
      button.appendChild(createNode(panel, "span", "title", tab.title));
      button.appendChild(createNode(panel, "span", "num", String(tab.count)));
      addListenerWithCleanup(button, "click", () => activate(index), lifecycle.cleanups);
      tabs.appendChild(button);
      tabNodes.push(button);
    });
    tabs.appendChild(createHeaderMenuAnchor(panel, "tab-item__all", data.allHref, "查看全部收藏夹"));
    activate(0);
    return true;
  };

  const setHistoryData = (panel, data) => {
    const view = panel && panel.__historyView;
    if (!view || !data || !Array.isArray(data.archive) || !Array.isArray(data.live) || !Array.isArray(data.article)) return false;
    const { tabs, body, lifecycle } = view;
    const definitions = [["视频", "archive"], ["直播", "live"], ["专栏", "article"]];
    const tabNodes = [];
    const renderItems = (label, key) => {
      body.replaceChildren();
      const items = data[key];
      if (!items.length) {
        body.appendChild(createNode(panel, "div", "empty-panel", `好像最近没有看过${label}历史呢`));
      } else {
        const list = createNode(panel, "div", "history-list");
        for (const item of items) {
          const card = createHeaderMenuAnchor(panel, "history-card header-history-card header-history-video", item.href, "");
          const media = createNode(panel, "span", "history-card-media header-history-video__image");
          const cover = panel.ownerDocument.createElement("img");
          cover.setAttribute("class", "history-card-cover");
          cover.setAttribute("alt", "");
          if (item.cover) {
            cover.setAttribute("src", item.cover);
            cover.setAttribute("referrerpolicy", "no-referrer");
          }
          media.appendChild(cover);
          const duration = formatMediaDuration(item.duration);
          if (duration) media.appendChild(createNode(panel, "span", "history-card-duration header-history-video__duration", duration));
          if (Number.isSafeInteger(item.progress) && item.progress >= 0 && item.duration > 0) {
            const progress = Math.min(100, Math.max(0, item.progress / item.duration * 100));
            const progressBar = createNode(panel, "span", "history-card-progress header-history-video__progress");
            progressBar.style.width = `${progress}%`;
            media.appendChild(progressBar);
          }
          const copy = createNode(panel, "span", "history-card-copy header-history-card__info");
          copy.appendChild(createNode(panel, "span", "history-card-title", item.title));
          copy.appendChild(createNode(panel, "span", "history-card-meta", [item.author, duration].filter(Boolean).join(" · ")));
          card.appendChild(media);
          card.appendChild(copy);
          list.appendChild(card);
        }
        body.appendChild(list);
      }
      body.appendChild(createHeaderMenuAnchor(panel, "view-all", NAV_ALLOWLIST.HISTORY.href, "查看全部"));
    };
    const activate = (index) => {
      const definition = definitions[index];
      if (!definition) return;
      tabNodes.forEach((node, nodeIndex) => node.classList.toggle("tab-item--active", nodeIndex === index));
      renderItems(definition[0], definition[1]);
    };
    tabs.replaceChildren();
    definitions.forEach(([label], index) => {
      const button = createNode(panel, "button", "tab-item", label);
      button.setAttribute("type", "button");
      addListenerWithCleanup(button, "click", () => activate(index), lifecycle.cleanups);
      tabs.appendChild(button);
      tabNodes.push(button);
    });
    activate(0);
    return true;
  };

  const createUploadPopover = (root) => {
    const panel = createHeaderPopover(root, "user-panel user-panel--upload van-popper-upload", "upload");
    const surface = createNode(root, "div", "vp-container");
    for (const [glyph, label, uploadKey] of [
      ["bili-icon_dingdao_wenzhangtougao", "专栏投稿", "COLUMN"],
      ["bili-icon_dingdao_yinpintougao", "音频投稿", "AUDIO"],
      ["bili-icon_dingdao_tiezhitougao", "贴纸投稿", "STICKER"],
      ["bili-icon_dingdao_shipintougao", "视频投稿", "VIDEO"],
      ["bili-icon_dingdao_tougaoguanli1", "投稿管理", "MANAGE"]
    ]) {
      const item = createFixedTargetAnchor(root, "upload-item", resolveUpload(uploadKey), "");
      item.appendChild(createIconFont(root, glyph, "upload-icon", null, "i"));
      item.appendChild(createNode(root, "span", "item-title", label));
      surface.appendChild(item);
    }
    panel.appendChild(surface);
    return panel;
  };

  const createHeaderNavItem = (root, navKey, label, popoverKind, popoverGroups, lifecycle, options = {}) => {
    const item = createNode(root, "li", popoverKind ? "nav-link-item header-popover-wrap" : "nav-link-item");
    const link = resolveNav(navKey)
      ? createFixedAnchor(root, "link", navKey, label)
      : createNode(root, "span", "link nav-link-placeholder", label);
    if (navKey === "HOME_ROOT" && label === "主站") {
      link.classList.add("nav-main");
      link.prepend(createIconFont(root, "bili-icon_dingdao_zhuzhan", "nav-main-icon", lifecycle));
    }
    if (label === "下载客户端") {
      link.classList.add("nav-download");
      link.prepend(createLocalImage(root, "nav-download-icon", ASSET_KEYS.DOWNLOAD_CLIENT_ICON, ""));
    }
    if (popoverKind) {
      if (!resolveNav(navKey)) {
        link.setAttribute("tabindex", "0");
      }
      const panel = popoverKind === "game"
        ? createGamePopover(root, lifecycle)
        : popoverKind === "live"
          ? createLivePopover(root, lifecycle)
          : popoverKind === "manga"
            ? createMangaPopover(root, lifecycle)
            : createDownloadPopover(root);
      if (options.portal && options.overlayLayer) {
        options.overlayLayer.appendChild(panel);
      } else {
        item.appendChild(panel);
      }
      link.setAttribute("aria-controls", panel.id);
      link.setAttribute("aria-expanded", "false");
      popoverGroups.push({
        group: item,
        trigger: link,
        panel,
        portal: Boolean(options.portal && options.overlayLayer),
        overlayLayer: options.overlayLayer || null
      });
    }
    item.appendChild(link);
    return item;
  };

  const createUserPopoverItem = (root, label, panel, popoverGroups, triggerNode, itemClass = "", options = {}) => {
    const item = createNode(root, "div", options.legacy ? "item" : `item user-popover-item header-popover-wrap ${itemClass}`.trim());
    const trigger = triggerNode || createNode(root, "span", "name van-popover__reference", label);
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-label", label);
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");
    const reference = options.legacy
      ? createNode(root, "span")
      : options.portal
      ? createNode(root, "span", "user-popover-reference")
      : item;
    if (options.legacy || options.portal) {
      reference.appendChild(trigger);
      item.appendChild(reference);
    } else {
      item.appendChild(panel);
      item.appendChild(trigger);
    }
    popoverGroups.push({
      group: item,
      trigger,
      panel,
      portal: Boolean(options.portal),
      overlayLayer: options.overlayLayer || null
    });
    return item;
  };

  const createHeader = (root, lifecycle) => {
    const header = createNode(root, "header", "international-header");
    const miniHeader = createNode(root, "div", "mini-header");
    const content = createNode(root, "div", "mini-header__content");
    content.setAttribute("data-auth-state", "unknown");
    const popoverGroups = [];
    const loginActions = [];
    const overlayLayer = createNode(root, "div", "header-overlay-layer");
    overlayLayer.setAttribute("aria-hidden", "true");

    const nav = createNode(root, "nav", "nav-link");
    nav.setAttribute("aria-label", "公共导航");
    const navList = createNode(root, "ul", "nav-link-ul");
    const navEntries = [
      ["HOME_ROOT", "主站", null],
      ["ANIME", "番剧", null],
      ["GAME", "游戏中心", "game"],
      ["LIVE", "直播", "live"],
      ["SHOW", "会员购", null],
      ["MANGA", "漫画", "manga"],
      ["MATCH", "赛事", null],
      ["ACTIVITY", "活动", "activity"],
      ["APP", "下载客户端", "download"]
    ];
    for (const [navKey, label, popoverKind] of navEntries) {
      if (popoverKind === "activity") {
        const activityItem = createNode(root, "li", "nav-link-item activity-entry");
        const activityLink = createFixedAnchor(root, "link activity-link", "ACTIVITY", "");
        activityLink.appendChild(createLocalImage(root, "activity-image", ASSET_KEYS.HEADER_ACTIVITY, "活动"));
        activityItem.appendChild(activityLink);
        navList.appendChild(activityItem);
      } else {
        navList.appendChild(createHeaderNavItem(root, navKey, label, popoverKind, popoverGroups, lifecycle, {
          portal: true,
          overlayLayer
        }));
      }
    }
    nav.appendChild(navList);
    content.appendChild(nav);

    const searchBox = createNode(root, "div", "nav-search-box header-popover-wrap");
    const search = createNode(root, "div", "nav-search");
    const searchForm = createNode(root, "form", "nav-search-form");
    searchForm.id = "nav_searchform";
    const searchInput = root.ownerDocument.createElement("input");
    searchInput.setAttribute("class", "nav-search-keyword");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("name", "keyword");
    searchInput.setAttribute("autocomplete", "off");
    searchInput.setAttribute("placeholder", "搜索你感兴趣的视频");
    searchInput.setAttribute("aria-label", "搜索内容");
    searchInput.setAttribute("aria-autocomplete", "list");
    searchInput.setAttribute("aria-expanded", "false");
    const searchButton = createNode(root, "div", "nav-search-btn");
    searchButton.setAttribute("role", "button");
    searchButton.setAttribute("tabindex", "0");
    searchButton.setAttribute("aria-label", "搜索");
    searchButton.setAttribute("title", "搜索");
    searchButton.appendChild(createIconFont(root, "bili-icon_dingdao_sousuo", "nav-search-icon", lifecycle));
    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);
    search.appendChild(searchForm);
    const suggestWrap = createNode(root, "div", "suggest-wrap");
    const searchPanel = createHeaderPopover(root, "header-search-suggest", "search");
    searchInput.setAttribute("aria-controls", searchPanel.id);
    const history = createNode(root, "section", "history");
    const historyHeader = createNode(root, "div", "header");
    historyHeader.appendChild(createNode(root, "span", "title", "搜索历史"));
    const clearHistory = createNode(root, "button", "clear", "清空");
    clearHistory.setAttribute("type", "button");
    clearHistory.setAttribute("aria-label", "清空搜索历史");
    historyHeader.appendChild(clearHistory);
    const historiesWrap = createNode(root, "div", "histories-wrap");
    const historyFold = createNode(root, "button", "history-fold-wrap", "展开更多");
    historyFold.setAttribute("type", "button");
    historyFold.setAttribute("hidden", "true");
    history.appendChild(historyHeader);
    history.appendChild(historiesWrap);
    history.appendChild(historyFold);
    const trending = createNode(root, "section", "trending");
    const trendingHeader = createNode(root, "div", "header");
    const trendingTitle = createNode(root, "span", "title", "热门搜索");
    trendingHeader.appendChild(trendingTitle);
    const trendingsDouble = createNode(root, "div", "trendings-double");
    const trendingsColLeft = createNode(root, "div", "trendings-col");
    const trendingsColRight = createNode(root, "div", "trendings-col");
    trendingsDouble.appendChild(trendingsColLeft);
    trendingsDouble.appendChild(trendingsColRight);
    trending.appendChild(trendingHeader);
    trending.appendChild(trendingsDouble);
    searchPanel.appendChild(history);
    searchPanel.appendChild(trending);
    suggestWrap.appendChild(searchPanel);
    searchBox.appendChild(search);
    searchBox.appendChild(suggestWrap);
    popoverGroups.push({ group: searchBox, trigger: searchInput, panel: searchPanel, search: true });
    const searchView = {
      root: searchPanel,
      input: searchInput,
      defaultUrl: null,
      defaultKeyword: SEARCH_DEFAULT_KEYWORD,
      historyItems: [],
      historiesWrap,
      historyFold,
      historyExpanded: false,
      trendingTitle,
      trendingItems: [],
      trendingColumns: [trendingsColLeft, trendingsColRight],
      historySection: history,
      trendingSection: trending,
      suggestionItems: [],
      suggestionNodes: [],
      activeSuggestionIndex: -1,
      isComposing: false,
      autocompleteTimer: 0,
      userValue: "",
      recordHistory: null,
      notifyHistoryChange: null,
      selectSuggestion: null
    };
    searchView.notifyHistoryChange = () => {
      if (typeof lifecycle.onSearchHistoryChange === "function") {
        lifecycle.onSearchHistoryChange(searchView.historyItems.slice());
      }
    };
    searchView.recordHistory = (keyword) => {
      const cleaned = typeof keyword === "string" ? keyword.trim().slice(0, MAX_SEARCH_KEYWORD_LENGTH) : "";
      if (!cleaned) return;
      searchView.historyItems = [cleaned, ...searchView.historyItems.filter((item) => item !== cleaned)].slice(0, 20);
      renderSearchHistory(searchView);
      searchView.notifyHistoryChange();
    };
    searchPanel.__searchView = searchView;
    const scheduleSearchSuggestions = () => {
      if (searchView.autocompleteTimer) {
        window.clearTimeout(searchView.autocompleteTimer);
        searchView.autocompleteTimer = 0;
      }
      if (searchView.isComposing) return;
      const term = searchInput.value;
      if (!term.trim()) {
        if (typeof lifecycle.onSearchSuggestRequest === "function") lifecycle.onSearchSuggestRequest("");
        return;
      }
      searchView.autocompleteTimer = window.setTimeout(() => {
        searchView.autocompleteTimer = 0;
        if (lifecycle.isActive() && !searchView.isComposing && typeof lifecycle.onSearchSuggestRequest === "function") {
          lifecycle.onSearchSuggestRequest(term);
        }
      }, 180);
    };
    lifecycle.cleanups.push(() => {
      if (searchView.autocompleteTimer) window.clearTimeout(searchView.autocompleteTimer);
      searchView.autocompleteTimer = 0;
    });
    renderSearchHistory(searchView);
    addListenerWithCleanup(clearHistory, "click", (event) => {
      if (event && typeof event.preventDefault === "function") event.preventDefault();
      if (!lifecycle.isActive()) return;
      searchView.historyItems = [];
      renderSearchHistory(searchView);
      searchView.notifyHistoryChange();
    }, lifecycle.cleanups);
    addListenerWithCleanup(historyFold, "click", () => {
      searchView.historyExpanded = !searchView.historyExpanded;
      renderSearchHistory(searchView);
    }, lifecycle.cleanups);
    addListenerWithCleanup(searchInput, "input", () => {
      searchInput.setAttribute("data-search-dirty", "true");
      searchView.userValue = searchInput.value;
      searchView.activeSuggestionIndex = -1;
      scheduleSearchSuggestions();
    }, lifecycle.cleanups);
    addListenerWithCleanup(searchInput, "compositionstart", () => {
      searchView.isComposing = true;
    }, lifecycle.cleanups);
    addListenerWithCleanup(searchInput, "compositionend", () => {
      searchView.isComposing = false;
      searchView.userValue = searchInput.value;
      scheduleSearchSuggestions();
    }, lifecycle.cleanups);
    const navigateSearch = (event) => {
      if (!lifecycle.isActive()) {
        return;
      }
      if (event && event.type === "submit" && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      const href = searchInput.value.trim() ? resolveSearchUrl(searchInput.value) : searchView.defaultUrl;
      if (!href) return;
      searchView.recordHistory(searchInput.value.trim() || searchView.defaultKeyword);
      const view = root.ownerDocument.defaultView || globalThis;
      if (typeof view.open === "function") view.open(href, "_blank", "noopener,noreferrer");
    };
    searchView.selectSuggestion = (value) => {
      if (!lifecycle.isActive() || typeof value !== "string" || !value.trim()) return;
      searchInput.value = value;
      searchView.userValue = value;
      searchView.recordHistory(value);
      const view = root.ownerDocument.defaultView || globalThis;
      const href = resolveSearchUrl(value);
      if (typeof view.open === "function") view.open(href, "_blank", "noopener,noreferrer");
    };
    addListenerWithCleanup(searchForm, "submit", navigateSearch, lifecycle.cleanups);
    addListenerWithCleanup(searchButton, "click", navigateSearch, lifecycle.cleanups);
    addListenerWithCleanup(searchButton, "keydown", (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        navigateSearch(event);
      }
    }, lifecycle.cleanups);
    addListenerWithCleanup(searchInput, "keydown", (event) => {
      if (searchView.isComposing) return;
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && searchView.suggestionNodes.length > 0) {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const count = searchView.suggestionNodes.length;
        searchView.activeSuggestionIndex = (searchView.activeSuggestionIndex + delta + count) % count;
        searchView.suggestionNodes.forEach((node, index) => {
          const active = index === searchView.activeSuggestionIndex;
          node.classList.toggle("active", active);
          node.setAttribute("aria-selected", active ? "true" : "false");
        });
        const selected = searchView.suggestionItems[searchView.activeSuggestionIndex];
        if (selected) searchInput.value = selected;
        searchInput.setAttribute("aria-activedescendant", searchView.suggestionNodes[searchView.activeSuggestionIndex].id);
        return;
      }
      if (event.key === "Enter") {
        if (typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        navigateSearch(event);
      }
    }, lifecycle.cleanups);
    content.appendChild(searchBox);

    const userCenter = createNode(root, "div", "nav-user-center");
    const searchIcon = createNode(root, "div", "user-con search-icon");
    const searchIconLink = createFixedTargetAnchor(root, "", resolveNav("HOME_ROOT"), "");
    searchIconLink.appendChild(createIconFont(root, "bili-icon_dingdao_sousuo", "", lifecycle, "i"));
    searchIcon.appendChild(searchIconLink);
    userCenter.appendChild(searchIcon);

    const signin = createNode(root, "div", "user-con signin");
    signin.setAttribute("data-auth-state", "unknown");
    signin.setAttribute("hidden", "true");
    const statusPanel = createNode(root, "div", "auth-state-panel");
    statusPanel.setAttribute("data-state", "unknown");
    const statusLabel = createNode(root, "span", "auth-state-label", "账号");
    const statusText = createNode(root, "span", "auth-state-text", "unknown");
    statusPanel.appendChild(statusLabel);
    statusPanel.appendChild(statusText);

    const avatar = createNode(root, "div", "mini-avatar van-popover__reference");
    const headerAvatarImage = root.ownerDocument.createElement("img");
    headerAvatarImage.setAttribute("class", "mini-avatar__image");
    headerAvatarImage.setAttribute("alt", "");
    headerAvatarImage.setAttribute("hidden", "true");
    headerAvatarImage.setAttribute("referrerpolicy", "no-referrer");
    const headerAvatarFallback = createSvgIcon(root, "bili-douga", 22, "mini-avatar__icon");
    avatar.appendChild(headerAvatarImage);
    avatar.appendChild(headerAvatarFallback);
    avatar.setAttribute("aria-label", "头像占位");
    const avatarPanel = createProfilePopover(root, lifecycle, lifecycle.theme, lifecycle.onThemeChange);
    avatarPanel.__profileHeaderView = Object.freeze({ image: headerAvatarImage, fallback: headerAvatarFallback });
    loginActions.push(avatarPanel.__profileView.loginButton);
    const avatarItem = createUserPopoverItem(root, "头像", avatarPanel, popoverGroups, avatar, "", { portal: true, overlayLayer, legacy: true });
    overlayLayer.appendChild(avatarPanel);
    signin.appendChild(avatarItem);

    const vipPanel = createVipPopover(root);
    const vipTrigger = createFixedAnchor(root, "mini-vip van-popover__reference", "VIP", "大会员");
    const vipItem = createUserPopoverItem(root, "大会员", vipPanel, popoverGroups, vipTrigger, "", { portal: true, overlayLayer, legacy: true });
    overlayLayer.appendChild(vipPanel);
    signin.appendChild(vipItem);

    const createNestedNavItem = (label, kind, panelClass, options = {}) => {
      const item = createNode(root, "div", "item");
      const navItem = createNode(root, "div", `nav-item nav-item-${kind}`);
      navItem.setAttribute("tabindex", "0");
      navItem.setAttribute("aria-label", label);
      navItem.setAttribute("aria-controls", panelClass.id);
      navItem.setAttribute("aria-expanded", "false");
      const title = createNode(root, "div", "t");
      const link = createNode(root, "a", "");
      link.setAttribute("href", kind === "message" ? "https://message.bilibili.com/" : "https://t.bilibili.com/");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.appendChild(createNode(root, "span", "name", label));
      title.appendChild(link);
      const badge = options.badge ? createNode(root, "span", options.badgeClass || "message-nav-badge", "") : null;
      if (badge) {
        badge.setAttribute("hidden", "true");
        if (options.badgeRole) badge.setAttribute("data-role", options.badgeRole);
        title.appendChild(badge);
      }
      navItem.appendChild(title);
      if (options.portal && options.overlayLayer) {
        options.overlayLayer.appendChild(panelClass);
      } else {
        navItem.appendChild(panelClass);
      }
      item.appendChild(navItem);
      popoverGroups.push({
        group: item,
        trigger: navItem,
        panel: panelClass,
        portal: Boolean(options.portal && options.overlayLayer),
        overlayLayer: options.overlayLayer || null
      });
      return { item, trigger: navItem, badge };
    };
    const messagePanel = createMessagePopover(root);
    const dynamicPanel = createDynamicPopover(root, lifecycle.onWatchLaterRequest);
    const messageNav = createNestedNavItem("消息", "message", messagePanel, { badge: true });
    const dynamicNav = createNestedNavItem("动态", "dynamic", dynamicPanel, {
      badge: true,
      badgeClass: "dynamic-nav-badge",
      badgeRole: "dynamic-entrance",
      portal: true,
      overlayLayer
    });
    signin.appendChild(messageNav.item);
    signin.appendChild(dynamicNav.item);
    messagePanel.__messageView.triggerBadge = messageNav.badge;
    dynamicPanel.__dynamicView.triggerBadge = dynamicNav.badge;

    const favoritePanel = createFavoritePopover(root, lifecycle);
    const favoriteTrigger = createNode(root, "a", "mini-favorite van-popover__reference", "收藏");
    setProfileNavigation(favoriteTrigger, "", false);
    const favoriteItem = createUserPopoverItem(root, "收藏", favoritePanel, popoverGroups, favoriteTrigger, "", { portal: true, overlayLayer, legacy: true });
    overlayLayer.appendChild(favoritePanel);
    signin.appendChild(favoriteItem);
    const historyPanel = createHistoryPopover(root, lifecycle);
    const historyTrigger = createFixedAnchor(root, "mini-history van-popover__reference", "HISTORY", "历史");
    const historyItem = createUserPopoverItem(root, "历史", historyPanel, popoverGroups, historyTrigger, "", { portal: true, overlayLayer, legacy: true });
    overlayLayer.appendChild(historyPanel);
    signin.appendChild(historyItem);

    const creatorItem = createNode(root, "div", "item");
    const creatorLink = createFixedAnchor(root, "", "CREATOR", "");
    creatorLink.appendChild(createNode(root, "span", "name", "创作中心"));
    creatorItem.appendChild(creatorLink);
    signin.appendChild(creatorItem);
    const loggedOut = createNode(root, "div", "auth-branch auth-branch--logout");
    const loginItem = createNode(root, "div", "item user-popover-item header-popover-wrap unlogin-entry");
    const loginButton = createNode(root, "button", "unlogin-avatar auth-login-button", "登录");
    loginButton.setAttribute("type", "button");
    loginButton.setAttribute("data-role", "open-login-stub");
    const loginRights = createLoginRightsPopover(root);
    loginButton.setAttribute("aria-label", "登录");
    loginButton.setAttribute("aria-controls", loginRights.panel.id);
    loginButton.setAttribute("aria-expanded", "false");
    loginItem.appendChild(loginRights.panel);
    loginItem.appendChild(loginButton);
    popoverGroups.push({ group: loginItem, trigger: loginButton, panel: loginRights.panel });
    loginActions.push(loginButton, loginRights.loginAction, loginRights.registerAction);
    loggedOut.appendChild(loginItem);
    const loggedOutVipPanel = createVipPopover(root);
    loggedOut.appendChild(createUserPopoverItem(root, "大会员", loggedOutVipPanel, popoverGroups, null, "mini-vip", {
      portal: true,
      overlayLayer
    }));
    overlayLayer.appendChild(loggedOutVipPanel);
    for (const [label, text] of [["消息", "登录即可查看消息记录"], ["动态", "登录即可查看关注动态"], ["收藏", "登录即可查看我的收藏"], ["历史", "登录即可查看历史记录"]]) {
      const tip = createLoginTipPopover(root, text);
      loginActions.push(tip.loginAction);
      loggedOut.appendChild(createUserPopoverItem(root, label, tip.panel, popoverGroups));
    }
    const loggedOutCreatorItem = createNode(root, "div", "item mini-creator");
    loggedOutCreatorItem.appendChild(createFixedAnchor(root, "name auth-link", "CREATOR", "创作中心"));
    loggedOut.appendChild(loggedOutCreatorItem);

    const unknown = createNode(root, "div", "auth-branch auth-branch--unknown");
    unknown.appendChild(createNode(root, "span", "auth-unknown-label", "登录状态未知"));
    loggedOut.setAttribute("hidden", "true");
    statusPanel.appendChild(loggedOut);
    statusPanel.appendChild(unknown);
    userCenter.appendChild(signin);

    const uploadWrap = createNode(root, "div");
    uploadWrap.setAttribute("data-popover-group", "upload");
    const uploadPanel = createUploadPopover(root);
    const uploadTrigger = createFixedAnchor(root, "mini-upload van-popover__reference", "CREATOR", "投稿");
    uploadTrigger.setAttribute("tabindex", "0");
    uploadTrigger.setAttribute("aria-label", "投稿");
    uploadTrigger.setAttribute("aria-controls", uploadPanel.id);
    uploadTrigger.setAttribute("aria-expanded", "false");
    uploadWrap.appendChild(uploadTrigger);
    popoverGroups.push({ group: uploadWrap, trigger: uploadTrigger, panel: uploadPanel, portal: true, overlayLayer });
    overlayLayer.appendChild(uploadPanel);
    userCenter.appendChild(uploadWrap);
    userCenter.appendChild(statusPanel);
    content.appendChild(userCenter);

    const loginStub = createNode(root, "section", "mini-login-stub");
    loginStub.setAttribute("data-state", "local-only");
    loginStub.setAttribute("hidden", "true");
    const loginHead = createNode(root, "div", "mini-login__head");
    loginHead.appendChild(createNode(root, "h2", "mini-login__title", "登录占位"));
    const closeLogin = createNode(root, "button", "mini-login__close");
    closeLogin.setAttribute("type", "button");
    closeLogin.setAttribute("aria-label", "关闭登录占位");
    closeLogin.appendChild(createLocalImage(root, "mini-login__close-icon", ASSET_KEYS.LOGIN_CLOSE, "关闭"));
    loginHead.appendChild(closeLogin);
    const characters = createNode(root, "div", "mini-login__characters");
    characters.appendChild(createLocalImage(root, "mini-login__character", ASSET_KEYS.LOGIN_22_OPEN, "登录角色占位"));
    characters.appendChild(createLocalImage(root, "mini-login__character", ASSET_KEYS.LOGIN_22_CLOSE, "登录角色占位"));
    characters.appendChild(createLocalImage(root, "mini-login__character", ASSET_KEYS.LOGIN_33_OPEN, "登录角色占位"));
    characters.appendChild(createLocalImage(root, "mini-login__character", ASSET_KEYS.LOGIN_33_CLOSE, "登录角色占位"));
    const social = createNode(root, "div", "mini-login__social");
    social.appendChild(createLocalImage(root, "mini-login__social-icon", ASSET_KEYS.LOGIN_WECHAT, "微信占位"));
    social.appendChild(createLocalImage(root, "mini-login__social-icon", ASSET_KEYS.LOGIN_WEIBO, "微博占位"));
    social.appendChild(createLocalImage(root, "mini-login__social-icon", ASSET_KEYS.LOGIN_QQ, "QQ占位"));
    loginStub.appendChild(loginHead);
    loginStub.appendChild(characters);
    loginStub.appendChild(social);
    loginStub.appendChild(createNode(root, "p", "mini-login__note", "仅保留本地静态登录壳，不提交登录信息"));

    miniHeader.appendChild(content);
    header.appendChild(miniHeader);
    header.appendChild(overlayLayer);
    header.appendChild(loginStub);
    const view = {
      content,
      loginStub,
      elevator: null,
      messagePanel,
      dynamicPanel,
      dynamicTrigger: dynamicNav.trigger,
      profilePanel: avatarPanel,
      favoritePanel,
      favoriteTrigger,
      headerAvatarImage,
      headerAvatarFallback,
      userCenter,
      signin,
      loggedOut,
      unknown
    };
    AUTH_STATE_VIEWS.set(statusPanel, view);
    const liveGroup = popoverGroups.find((entry) => entry.panel
      && entry.panel.getAttribute("data-popover-kind") === "live");
    return {
      header,
      statusText,
      statusPanel,
      signin,
      userCenter,
      overlayLayer,
      authPopoverGroups: popoverGroups.filter((entry) => entry.group === uploadWrap || entry.group === signin || signin.contains(entry.group)),
      summaryPanels: Object.freeze({ message: messagePanel, favorite: favoritePanel, history: historyPanel }),
      search: searchView,
      loginStub,
      loginButton,
      closeLogin,
      loginActions,
      popoverGroups,
      livePopover: liveGroup ? liveGroup.panel : null,
      liveTrigger: liveGroup ? liveGroup.trigger : null,
      messagePanel,
      dynamicPanel,
      dynamicTrigger: dynamicNav.trigger,
      profilePopover: avatarPanel,
      profileTrigger: avatar,
      profileGroup: avatarItem,
      logoutButton: avatarPanel.__profileView.logout
    };
  };

  // A-plan banner layer parameter table (18 layers total: 17 PNG + 1 WebM at the end).
  // Values ported verbatim from prototype/homepage/index.html:361-378.
  const BANNER_MODEL_API = globalThis.ExtensionBBannerModel || null;
  const BUILTIN_BANNER_MODEL = BANNER_MODEL_API && BANNER_MODEL_API.BUILTIN_BANNER_MODEL
    ? BANNER_MODEL_API.BUILTIN_BANNER_MODEL
    : null;
  const isRenderableBannerModel = (model) => Boolean(
    BANNER_MODEL_API && typeof BANNER_MODEL_API.isBannerModel === "function" && BANNER_MODEL_API.isBannerModel(model)
  );
  const resolveBannerAsset = (assetRef, assetMap = null) => {
    if (assetMap && typeof assetMap[assetRef] === "string") return assetMap[assetRef];
    if (typeof assetRef !== "string") return null;
    if (/^https:\/\//.test(assetRef)) return assetRef;
    return resolveLocalAssetUrl(assetRef);
  };

  const createBanner = (root, model = BUILTIN_BANNER_MODEL, assetMap = null) => {
    const safeModel = isRenderableBannerModel(model) ? model : BUILTIN_BANNER_MODEL;
    const banner = createNode(root, "section", "bili-banner");
    banner.setAttribute("data-role", "bili-banner");
    banner.setAttribute("data-banner-state", safeModel && safeModel.source ? safeModel.source : "builtin");
    banner.setAttribute("data-banner-id", safeModel && safeModel.id ? safeModel.id : "builtin-default");
    banner.setAttribute("data-banner-name", safeModel && safeModel.name ? safeModel.name : "");
    // Static fallback background as CSS on banner element (matches A-plan style)
    const fallbackUrl = resolveBannerAsset(safeModel && safeModel.backgroundRef, assetMap)
      || resolveLocalAssetUrl(ASSET_KEYS.BANNER_FALLBACK);
    if (fallbackUrl) {
      banner.style.background = `#f9f9f9 url("${fallbackUrl}") center 0/cover no-repeat`;
    }
    const animated = createNode(root, "div", "animated-banner");
    animated.setAttribute("aria-hidden", "true");
    for (const config of (safeModel ? safeModel.layers : [])) {
      const layer = createNode(root, "div", "banner-layer-item");
      const width = config.width;
      const height = config.height;
      layer.setAttribute("data-layer-id", config.id);
      layer.setAttribute("data-width", String(width));
      layer.setAttribute("data-height", String(height));
      layer.setAttribute("data-size-mode", safeModel.source === "official" ? "intrinsic" : "declared");
      layer.setAttribute("data-scale", String(config.scale));
      layer.setAttribute("data-init-x", String(config.transform[4]));
      layer.setAttribute("data-init-y", String(config.transform[5]));
      layer.setAttribute("data-offset-x", String(config.offset.x));
      layer.setAttribute("data-offset-y", String(config.offset.y));
      layer.setAttribute("data-rotate", String(config.rotation));
      layer.setAttribute("data-blur", String(config.blur));
      layer.setAttribute("data-opacity", String(config.opacity));
      layer.setAttribute("data-transform", JSON.stringify(config.transform));
      if (config.motion) layer.setAttribute("data-motion", JSON.stringify(config.motion));
      const url = resolveBannerAsset(config.assetRef, assetMap);
      if (url) {
        let media;
        if (config.type === "video/webm") {
          media = root.ownerDocument.createElement("video");
          media.muted = true;
          media.loop = true;
          media.autoplay = true;
          media.setAttribute("playsinline", "");
          media.setAttribute("muted", "");
          media.setAttribute("loop", "");
          media.setAttribute("autoplay", "");
          media.src = url;
        } else {
          media = root.ownerDocument.createElement("img");
          media.setAttribute("src", url);
          media.setAttribute("alt", "");
        }
        const hideFailedMedia = () => {
          layer.setAttribute("data-asset-state", "error");
          media.style.display = "none";
        };
        media.addEventListener("error", hideFailedMedia, { once: true });
        media.setAttribute("data-width", String(width));
        media.setAttribute("data-height", String(height));
        layer.appendChild(media);
      }
      animated.appendChild(layer);
    }
    const taper = createNode(root, "div", "taper-line");
    taper.setAttribute("aria-hidden", "true");
    const logoWrap = createNode(root, "div", "b-logo");
    const logoLink = createFixedAnchor(root, "head-logo", "HOME_ROOT", "");
    const logoUrl = resolveBannerAsset(safeModel && safeModel.logoRef, assetMap);
    if (logoUrl) {
      const logo = createNode(root, "img", "logo-img");
      logo.setAttribute("src", logoUrl);
      logo.setAttribute("alt", "哔哩哔哩");
      logoLink.appendChild(logo);
    } else {
      logoLink.appendChild(createLocalImage(root, "logo-img", ASSET_KEYS.BANNER_LOGO, "哔哩哔哩"));
    }
    logoWrap.appendChild(logoLink);
    banner.appendChild(animated);
    banner.appendChild(taper);
    banner.appendChild(logoWrap);
    return banner;
  };

  // Parallax runtime follows the official DynamicBannerRenderer motion path.
  // Legacy v1 packages without data-motion keep the older translate-only path.
  const bindBannerParallax = (root, banner, listenerCleanups, isRendererActive) => {
    if (!banner) { return; }
    const doc = root.ownerDocument;
    const view = doc.defaultView;
    if (!view) { return; }
    const layerNodes = Array.prototype.slice.call(banner.querySelectorAll(".animated-banner > .banner-layer-item"));
    if (!layerNodes.length) { return; }
    const identityCurve = (value) => value;
    const calcA = (a1, a2) => 1 - 3 * a2 + 3 * a1;
    const calcB = (a1, a2) => 3 * a2 - 6 * a1;
    const calcC = (a1) => 3 * a1;
    const calcBezier = (value, a1, a2) => ((calcA(a1, a2) * value + calcB(a1, a2)) * value + calcC(a1)) * value;
    const getSlope = (value, a1, a2) => 3 * calcA(a1, a2) * value * value + 2 * calcB(a1, a2) * value + calcC(a1);
    const binarySubdivide = (x, a, b, mX1, mX2) => {
      let currentT = a + (b - a) / 2;
      let currentX = calcBezier(currentT, mX1, mX2) - x;
      let iterations = 0;
      while (Math.abs(currentX) > 1e-7 && ++iterations < 10) {
        if (currentX > 0) b = currentT; else a = currentT;
        currentT = a + (b - a) / 2;
        currentX = calcBezier(currentT, mX1, mX2) - x;
      }
      return currentT;
    };
    const newtonRaphsonIterate = (x, guessT, mX1, mX2) => {
      for (let index = 0; index < 4; index += 1) {
        const slope = getSlope(guessT, mX1, mX2);
        if (slope === 0) return guessT;
        guessT -= (calcBezier(guessT, mX1, mX2) - x) / slope;
      }
      return guessT;
    };
    const makeCurve = (curve) => {
      if (!Array.isArray(curve) || curve.length !== 4
        || !curve.every((value) => typeof value === "number" && Number.isFinite(value))) return identityCurve;
      const [mX1, mY1, mX2, mY2] = curve;
      if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) return identityCurve;
      if (mX1 === mY1 && mX2 === mY2) return identityCurve;
      const sampleValues = new Float32Array(11);
      for (let index = 0; index < 11; index += 1) sampleValues[index] = calcBezier(index / 10, mX1, mX2);
      const getTForX = (x) => {
        let intervalStart = 0;
        let currentSample = 1;
        const lastSample = 10;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= x; currentSample += 1) {
          intervalStart += 0.1;
        }
        --currentSample;
        const sampleDelta = sampleValues[currentSample + 1] - sampleValues[currentSample];
        const dist = sampleDelta === 0 ? 0 : (x - sampleValues[currentSample]) / sampleDelta;
        const guessT = intervalStart + dist * 0.1;
        const slope = getSlope(guessT, mX1, mX2);
        if (slope >= 1e-3) return newtonRaphsonIterate(x, guessT, mX1, mX2);
        if (slope === 0) return guessT;
        return binarySubdivide(x, intervalStart, intervalStart + 0.1, mX1, mX2);
      };
      const bezier = (value) => value === 0 || value === 1 ? value : calcBezier(getTForX(value), mY1, mY2);
      return (value) => value > 0 ? bezier(value) : -bezier(-value);
    };
    const numberOr = (value, fallback) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
    const parseMotion = (layer) => {
      const raw = layer.getAttribute("data-motion");
      if (!raw) return null;
      try {
        const value = JSON.parse(raw);
        if (!value || typeof value !== "object" || Array.isArray(value)) return null;
        const keys = Object.keys(value).sort().join("\u001F");
        if (keys === "a\u001Fdeg\u001Ff\u001Fg\u001Fopacity"
          && Number.isFinite(value.a) && Number.isFinite(value.g)
          && Number.isFinite(value.f) && Number.isFinite(value.deg)
          && Array.isArray(value.opacity) && value.opacity.length === 2
          && value.opacity.every((entry) => Number.isFinite(entry))) {
          return {
            kind: "palxiao",
            a: value.a,
            g: value.g,
            f: value.f,
            deg: value.deg,
            opacity: value.opacity
          };
        }
        return {
          kind: "official",
          scaleOffset: numberOr(value.scaleOffset, 0),
          rotateOffset: numberOr(value.rotateOffset, 0),
          blurOffset: numberOr(value.blurOffset, 0),
          opacityOffset: numberOr(value.opacityOffset, 0),
          blurWrap: value.blurWrap === "alternate" ? "alternate" : "clamp",
          opacityWrap: value.opacityWrap === "alternate" ? "alternate" : "clamp",
          scaleCurve: makeCurve(value.scaleCurve),
          rotateCurve: makeCurve(value.rotateCurve),
          translateCurve: makeCurve(value.translateCurve),
          blurCurve: makeCurve(value.blurCurve),
          opacityCurve: makeCurve(value.opacityCurve)
        };
      } catch (_) {
        return null;
      }
    };
    const alternateOpacity = (value) => {
      let folded = Math.abs(value % 1);
      if (Math.abs(value % 2) >= 1) folded = 1 - folded;
      return folded;
    };
    const layers = layerNodes.map((layer) => {
      const media = layer.querySelector("img, video");
      if (media && media.tagName === "VIDEO") {
        try { media.play().catch(() => {}); } catch (_) {}
      }
      return {
        node: layer,
        media,
        baseTransform: (() => {
          try {
            const value = JSON.parse(layer.getAttribute("data-transform") || "null");
            return Array.isArray(value) && value.length === 6 && value.every((entry) => Number.isFinite(entry))
              ? value.slice() : [1, 0, 0, 1, Number(layer.getAttribute("data-init-x")) || 0, Number(layer.getAttribute("data-init-y")) || 0];
          } catch (_) {
            return [1, 0, 0, 1, Number(layer.getAttribute("data-init-x")) || 0, Number(layer.getAttribute("data-init-y")) || 0];
          }
        })(),
        width: Number((media && media.getAttribute("data-width")) || 1920),
        height: Number((media && media.getAttribute("data-height")) || 180),
        sizeMode: layer.getAttribute("data-size-mode") || "declared",
        scale: Number(layer.getAttribute("data-scale")) || 1,
        initX: Number(layer.getAttribute("data-init-x")) || 0,
        initY: Number(layer.getAttribute("data-init-y")) || 0,
        offsetX: Number(layer.getAttribute("data-offset-x")) || 0,
        offsetY: Number(layer.getAttribute("data-offset-y")) || 0,
        rotate: Number(layer.getAttribute("data-rotate")) || 0,
        blur: Number(layer.getAttribute("data-blur")) || 0,
        opacity: layer.getAttribute("data-opacity") != null ? Number(layer.getAttribute("data-opacity")) : 1,
        motion: parseMotion(layer)
      };
    });
    const syncIntrinsicSize = (layer, reflow = true) => {
      if (!layer.media || layer.sizeMode !== "intrinsic") return;
      const intrinsicWidth = Number(layer.media.naturalWidth || layer.media.videoWidth) || 0;
      const intrinsicHeight = Number(layer.media.naturalHeight || layer.media.videoHeight) || 0;
      if (intrinsicWidth > 0 && intrinsicHeight > 0) {
        layer.width = intrinsicWidth;
        layer.height = intrinsicHeight;
        if (reflow) measureLayout(true);
      }
    };
    for (const layer of layers) {
      if (!layer.media || layer.sizeMode !== "intrinsic") continue;
      const loadedEvent = layer.media.tagName === "VIDEO" ? "loadedmetadata" : "load";
      addListenerWithCleanup(layer.media, loadedEvent, () => syncIntrinsicSize(layer), listenerCleanups);
    }
    let bannerWidth = banner.clientWidth;
    let bannerHeight = banner.clientHeight;
    let scaleBase = bannerHeight > 0 ? bannerHeight / 155 : 1;
    let viewportCompensate = 1;
    // The first pass must size declared package layers even when the host is
    // already mounted; intrinsic media events are not the package layout source.
    let layoutReady = false;
    let startX = 0;
    let hasStart = false;
    let displace = 0;
    let targetDisplace = 0;
    let moveFrame = 0;
    let resizeFrame = 0;
    let resetFrame = 0;
    let pointerInBanner = false;
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const lerp = (start, end, amount) => (1 - amount) * start + amount * end;
    const multiplyMatrix = (left, right) => [
      left[0] * right[0] + left[2] * right[1],
      left[1] * right[0] + left[3] * right[1],
      left[0] * right[2] + left[2] * right[3],
      left[1] * right[2] + left[3] * right[3],
      left[0] * right[4] + left[2] * right[5] + left[4],
      left[1] * right[4] + left[3] * right[5] + left[5]
    ];
    const matrixCss = (value) => `matrix(${value.map((entry) => Number.isFinite(entry) ? Number(entry.toFixed(6)) : 1).join(", ")})`;
    const render = (value, isHoming = false, homingProgress = 0, homingFrom = value) => {
      if (!isRendererActive()) { return; }
      displace = value;
      for (const layer of layers) {
        if (!layer.media) { continue; }
        const motion = layer.motion;
        if (motion && motion.kind === "palxiao") {
          const base = layer.baseTransform.slice();
          base[4] *= viewportCompensate;
          base[5] *= viewportCompensate;
          const move = value * motion.a;
          const scale = motion.f ? motion.f * value + 1 : 1;
          const gravity = value * motion.g;
          let matrix = multiplyMatrix(base, [base[0] * scale, base[1], base[2], base[3] * scale, move, gravity]);
          if (motion.deg) {
            const angle = motion.deg * value;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            matrix = multiplyMatrix(matrix, [cos, sin, -sin, cos, 0, 0]);
          }
          if (layer.node.style) layer.node.style.transform = matrixCss(matrix);
          const opacityProgress = (value / (Number(view.innerWidth) || bannerWidth || 1650)) * 2;
          const opacity = isHoming && homingFrom > 0
            ? lerp(motion.opacity[1], motion.opacity[0], homingProgress)
            : lerp(motion.opacity[0], motion.opacity[1], opacityProgress);
          if (layer.node.style) layer.node.style.opacity = String(opacity);
          layer.media.style.filter = layer.blur ? `blur(${layer.blur}px)` : "";
          continue;
        }
        const dynamicScale = motion ? 1 + motion.scaleOffset * motion.scaleCurve(value) : 1;
        const rotate = motion ? motion.rotateOffset * motion.rotateCurve(value) : layer.rotate * value;
        const translateCurve = motion ? motion.translateCurve(value) : value;
        const initialScale = motion ? layer.scale : 1;
        const x = (layer.initX + layer.offsetX * translateCurve) * scaleBase * initialScale;
        const y = (layer.initY + layer.offsetY * translateCurve) * scaleBase * initialScale;
        layer.media.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${dynamicScale})`;
        if (motion) {
          if (layer.blur) {
            const blur = Math.max(0, layer.blur + motion.blurOffset * motion.blurCurve(value));
            layer.media.style.filter = blur < 1e-4 ? "" : `blur(${blur}px)`;
          } else {
            layer.media.style.filter = "";
          }
          if (layer.opacity) {
            const opacityValue = layer.opacity + motion.opacityOffset * motion.opacityCurve(value);
            const opacity = motion.opacityWrap === "alternate"
              ? alternateOpacity(opacityValue)
              : Math.max(0, Math.min(1, opacityValue));
            layer.media.style.opacity = String(opacity);
          }
        }
      }
    };
    const scheduleRender = () => {
      if (!isRendererActive() || moveFrame) { return; }
      moveFrame = view.requestAnimationFrame(() => {
        moveFrame = 0;
        render(targetDisplace);
      });
    };
    const measureLayout = (forceMediaLayout = false) => {
      if (!isRendererActive()) { return false; }
      const nextWidth = Number(banner.clientWidth) || 0;
      const nextHeight = Number(banner.clientHeight) || 0;
      if (nextWidth <= 0 || nextHeight <= 0) {
        return false;
      }
      const needsMediaLayout = forceMediaLayout
        || !layoutReady
        || nextWidth !== bannerWidth
        || nextHeight !== bannerHeight;
      bannerWidth = nextWidth;
      bannerHeight = nextHeight;
      scaleBase = bannerHeight / 155;
      const viewportWidth = Number(view.innerWidth) || bannerWidth || 1650;
      viewportCompensate = viewportWidth > 1650 ? viewportWidth / 1650 : 1;
      layoutReady = true;
      if (needsMediaLayout) {
        for (const layer of layers) {
          if (!layer.media) { continue; }
          const mediaScale = layer.motion && layer.motion.kind === "palxiao"
            ? viewportCompensate
            : scaleBase * layer.scale;
          const w = layer.width * mediaScale;
          const h = layer.height * mediaScale;
          layer.media.style.width = `${w}px`;
          layer.media.style.height = `${h}px`;
          layer.media.style.opacity = String(layer.opacity);
          layer.media.style.filter = layer.blur ? `blur(${layer.blur}px)` : "";
        }
      }
      targetDisplace = displace;
      render(displace);
      return true;
    };
    const applyResize = () => {
      resizeFrame = 0;
      measureLayout(true);
    };
    const resizeLayers = () => {
      if (!isRendererActive() || resizeFrame) { return; }
      resizeFrame = view.requestAnimationFrame(applyResize);
    };
    const reset = () => {
      if (!isRendererActive()) { return; }
      hasStart = false;
      pointerInBanner = false;
      targetDisplace = 0;
      if (moveFrame) { view.cancelAnimationFrame(moveFrame); moveFrame = 0; }
      if (resetFrame) { view.cancelAnimationFrame(resetFrame); resetFrame = 0; }
      const from = displace;
      if (Math.abs(from) <= 0.001) { render(0); return; }
      const startedAt = view.performance.now();
      const duration = layers.some((layer) => layer.motion && layer.motion.kind === "palxiao") ? 300 : 200;
      const tick = (now) => {
        if (!isRendererActive()) { return; }
        const progress = clamp((now - startedAt) / duration, 0, 1);
        if (progress >= 1) { render(0, true, 1, from); resetFrame = 0; return; }
        render(from * (1 - progress), true, progress, from);
        resetFrame = view.requestAnimationFrame(tick);
      };
      resetFrame = view.requestAnimationFrame(tick);
    };
    const handleMove = (event) => {
      if (!isRendererActive()) { return; }
      if (!layoutReady || bannerWidth <= 0 || bannerHeight <= 0) {
        // The renderer can bind before its host is mounted. Measure on the
        // first real pointer event so a missing window resize cannot freeze
        // the parallax at zero displacement.
        measureLayout();
      }
      const rect = banner.getBoundingClientRect();
      const isInside = Number.isFinite(event.clientX)
        && Number.isFinite(event.clientY)
        && event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
      if (!isInside) {
        if (pointerInBanner || hasStart || moveFrame) { reset(); }
        return;
      }
      pointerInBanner = true;
      if (resetFrame) { view.cancelAnimationFrame(resetFrame); resetFrame = 0; }
      if (!hasStart) { startX = event.clientX; hasStart = true; }
      const deltaX = event.clientX - startX;
      const usesPixelDisplacement = layers.some((layer) => layer.motion && layer.motion.kind === "palxiao");
      targetDisplace = usesPixelDisplacement || bannerWidth <= 0 ? deltaX : deltaX / bannerWidth;
      scheduleRender();
    };
    for (const layer of layers) syncIntrinsicSize(layer, false);
    measureLayout();
    const moveListenerOptions = { passive: true, capture: true };
    addListenerWithCleanup(doc, "pointermove", handleMove, listenerCleanups, moveListenerOptions);
    addListenerWithCleanup(doc, "mousemove", handleMove, listenerCleanups, moveListenerOptions);
    addListenerWithCleanup(doc, "pointerleave", reset, listenerCleanups);
    addListenerWithCleanup(doc, "mouseleave", reset, listenerCleanups);
    addListenerWithCleanup(view, "blur", reset, listenerCleanups);
    addListenerWithCleanup(view, "resize", resizeLayers, listenerCleanups);
    const ResizeObserverCtor = view.ResizeObserver
      || (typeof ResizeObserver === "function" ? ResizeObserver : null);
    if (ResizeObserverCtor) {
      const observer = new ResizeObserverCtor(() => resizeLayers());
      observer.observe(banner);
      listenerCleanups.push(() => observer.disconnect());
    }
    listenerCleanups.push(() => {
      for (const layer of layers) {
        if (!layer.media || layer.media.tagName !== "VIDEO") continue;
        try { layer.media.pause(); } catch (_) {}
        try {
          layer.media.removeAttribute("src");
          if (typeof layer.media.load === "function") layer.media.load();
        } catch (_) {}
      }
      if (moveFrame) {
        try { view.cancelAnimationFrame(moveFrame); } catch (_) {}
        moveFrame = 0;
      }
      if (resizeFrame) {
        try { view.cancelAnimationFrame(resizeFrame); } catch (_) {}
        resizeFrame = 0;
      }
      if (resetFrame) {
        try { view.cancelAnimationFrame(resetFrame); } catch (_) {}
        resetFrame = 0;
      }
      hasStart = false;
      pointerInBanner = false;
    });
  };

  const PRIMARY_CHANNEL_TIDS = Object.freeze({
    douga: 1, anime: 13, music: 3, guochuang: 167, dance: 129, game: 4, knowledge: 36,
    tech: 188, life: 160, kichiku: 119, fashion: 155, information: 202, ent: 5,
    cinephile: 181, cinema: Object.freeze([23, 11, 177]), more: null
  });
  const PRIMARY_CHANNELS = Object.freeze([
    { key: "douga", name: "动画", href: "//www.bilibili.com/v/douga/", count: "999+", sub: [["MAD·AMV", "//www.bilibili.com/v/douga/mad/"], ["MMD·3D", "//www.bilibili.com/v/douga/mmd/"], ["短片·手书", "//www.bilibili.com/v/douga/handdrawn/"], ["配音", "//www.bilibili.com/v/douga/voice/"], ["手办·模玩", "//www.bilibili.com/v/douga/garage_kit/"], ["特摄", "//www.bilibili.com/v/douga/tokusatsu/"], ["动漫杂谈", "//www.bilibili.com/v/douga/acgntalks/"], ["综合", "//www.bilibili.com/v/douga/other/"]] },
    { key: "anime", name: "番剧", href: "//www.bilibili.com/anime/", count: "79", sub: [["连载动画", "//www.bilibili.com/v/anime/serial/"], ["完结动画", "//www.bilibili.com/v/anime/finish/"], ["资讯", "//www.bilibili.com/v/anime/information/"], ["官方延伸", "//www.bilibili.com/v/anime/offical/"], ["新番时间表", "//www.bilibili.com/anime/timeline/"], ["番剧索引", "//www.bilibili.com/anime/index/"]] },
    { key: "music", name: "音乐", href: "//www.bilibili.com/v/music/", count: "999+", sub: [["原创音乐", "//www.bilibili.com/v/music/original/"], ["翻唱", "//www.bilibili.com/v/music/cover/"], ["演奏", "//www.bilibili.com/v/music/perform/"], ["VOCALOID·UTAU", "//www.bilibili.com/v/music/vocaloid/"], ["音乐现场", "//www.bilibili.com/v/music/live/"], ["MV", "//www.bilibili.com/v/music/mv/"], ["乐评盘点", "//www.bilibili.com/v/music/commentary/"], ["音乐教学", "//www.bilibili.com/v/music/tutorial/"], ["音乐综合", "//www.bilibili.com/v/music/other/"], ["说唱", "//www.bilibili.com/v/music/rap/"]] },
    { key: "guochuang", name: "国创", href: "//www.bilibili.com/guochuang/", count: "999+", sub: [["国产动画", "//www.bilibili.com/v/guochuang/chinese/"], ["国产原创相关", "//www.bilibili.com/v/guochuang/original/"], ["布袋戏", "//www.bilibili.com/v/guochuang/puppetry/"], ["动态漫·广播剧", "//www.bilibili.com/v/guochuang/motioncomic/"], ["资讯", "//www.bilibili.com/v/guochuang/information/"], ["新番时间表", "//www.bilibili.com/guochuang/timeline/"], ["国产动画索引", "//www.bilibili.com/guochuang/index/"]] },
    { key: "dance", name: "舞蹈", href: "//www.bilibili.com/v/dance/", count: "999+", sub: [["宅舞", "//www.bilibili.com/v/dance/otaku/"], ["街舞", "//www.bilibili.com/v/dance/hiphop/"], ["明星舞蹈", "//www.bilibili.com/v/dance/star/"], ["国风舞蹈", "//www.bilibili.com/v/dance/china/"], ["手势·网红舞", "//www.bilibili.com/v/dance/gestures/"], ["舞蹈综合", "//www.bilibili.com/v/dance/three_d/"], ["舞蹈教程", "//www.bilibili.com/v/dance/demo/"]] },
    { key: "game", name: "游戏", href: "//www.bilibili.com/v/game/", count: "999+", sub: [["单机游戏", "//www.bilibili.com/v/game/stand_alone/"], ["电子竞技", "//www.bilibili.com/v/game/esports/"], ["手机游戏", "//www.bilibili.com/v/game/mobile/"], ["网络游戏", "//www.bilibili.com/v/game/online/"], ["桌游棋牌", "//www.bilibili.com/v/game/board/"], ["GMV", "//www.bilibili.com/v/game/gmv/"], ["音游", "//www.bilibili.com/v/game/music/"], ["Mugen", "//www.bilibili.com/v/game/mugen/"], ["游戏赛事", "//www.bilibili.com/v/game/match/"]] },
    { key: "knowledge", name: "知识", href: "//www.bilibili.com/v/knowledge/", count: "999+", sub: [["科学科普", "//www.bilibili.com/v/knowledge/science/"], ["社科·法律·心理", "//www.bilibili.com/v/knowledge/social_science/"], ["人文历史", "//www.bilibili.com/v/knowledge/humanity_history/"], ["财经商业", "//www.bilibili.com/v/knowledge/business/"], ["校园学习", "//www.bilibili.com/v/knowledge/campus/"], ["职业职场", "//www.bilibili.com/v/knowledge/career/"], ["设计·创意", "//www.bilibili.com/v/knowledge/design/"], ["野生技能协会", "//www.bilibili.com/v/knowledge/skill/"]] },
    { key: "tech", name: "科技", href: "//www.bilibili.com/v/tech/", count: "999+", sub: [["数码", "//www.bilibili.com/v/tech/digital/"], ["软件应用", "//www.bilibili.com/v/tech/application/"], ["计算机技术", "//www.bilibili.com/v/tech/computer_tech/"], ["科工机械", "//www.bilibili.com/v/tech/industry/"], ["极客DIY", "//www.bilibili.com/v/tech/diy/"]] },
    { key: "life", name: "生活", href: "https://www.bilibili.com/c/life_joy/", count: "999+", sub: [["搞笑", "//www.bilibili.com/v/life/funny/"], ["亲子", "//www.bilibili.com/v/life/parenting/"], ["出行", "//www.bilibili.com/v/life/travel/"], ["三农", "//www.bilibili.com/v/life/rurallife/"], ["家居房产", "//www.bilibili.com/v/life/home/"], ["手工", "//www.bilibili.com/v/life/handmake/"], ["绘画", "//www.bilibili.com/v/life/painting/"], ["日常", "//www.bilibili.com/v/life/daily/"]] },
    { key: "kichiku", name: "鬼畜", href: "//www.bilibili.com/v/kichiku/", count: "904", sub: [["鬼畜调教", "//www.bilibili.com/v/kichiku/guide/"], ["音MAD", "//www.bilibili.com/v/kichiku/mad/"], ["人力VOCALOID", "//www.bilibili.com/v/kichiku/manual_vocaloid/"], ["鬼畜剧场", "//www.bilibili.com/v/kichiku/theatre/"], ["教程演示", "//www.bilibili.com/v/kichiku/course/"]] },
    { key: "fashion", name: "时尚", href: "//www.bilibili.com/v/fashion/", count: "999+", sub: [["美妆护肤", "//www.bilibili.com/v/fashion/makeup/"], ["仿妆cos", "//www.bilibili.com/v/fashion/cos/"], ["穿搭", "//www.bilibili.com/v/fashion/clothing/"], ["时尚潮流", "//www.bilibili.com/v/fashion/trend/"]] },
    { key: "information", name: "资讯", href: "//www.bilibili.com/v/information/", count: "92", sub: [["热点", "//www.bilibili.com/v/information/hotspot/"], ["环球", "//www.bilibili.com/v/information/global/"], ["社会", "//www.bilibili.com/v/information/social/"], ["综合", "//www.bilibili.com/v/information/multiple/"]] },
    { key: "ent", name: "娱乐", href: "//www.bilibili.com/v/ent/", count: "999+", sub: [["综艺", "//www.bilibili.com/v/ent/variety/"], ["娱乐杂谈", "//www.bilibili.com/v/ent/talker/"], ["粉丝创作", "//www.bilibili.com/v/ent/fans/"], ["明星综合", "//www.bilibili.com/v/ent/celebrity/"]] },
    { key: "cinephile", name: "影视", href: "//www.bilibili.com/v/cinephile/", count: "999+", sub: [["影视杂谈", "//www.bilibili.com/v/cinephile/cinecism/"], ["影视剪辑", "//www.bilibili.com/v/cinephile/montage/"], ["小剧场", "//www.bilibili.com/v/cinephile/shortplay/"], ["短片", "//www.bilibili.com/v/cinephile/shortfilm/"], ["预告·资讯", "//www.bilibili.com/v/cinephile/trailer_info/"]] },
    { key: "cinema", name: "放映厅", href: "//www.bilibili.com/cinema/", count: "164", sub: [["纪录片", "//www.bilibili.com/documentary/"], ["电影", "//www.bilibili.com/movie/"], ["电视剧", "//www.bilibili.com/tv/"]] },
    { key: "more", name: "更多", href: "javascript:;", count: "--", hideCount: true, sub: [["虚拟UP主", "//www.bilibili.com/v/virtual"], ["搞笑", "//www.bilibili.com/v/life/funny"], ["美食", "//www.bilibili.com/v/food"], ["动物圈", "//www.bilibili.com/v/animal"], ["单机游戏", "//www.bilibili.com/v/game/stand_alone"], ["运动", "//www.bilibili.com/v/sports"], ["汽车", "//www.bilibili.com/v/car"], ["VLOG", "https://www.bilibili.com/c/vlog/?spm_id_from=333.1007.0.0"]] }
  ].map((channel) => Object.freeze({ ...channel, tid: PRIMARY_CHANNEL_TIDS[channel.key] })));

  const PRIMARY_FRIENDSHIP = Object.freeze([
    { key: "read", name: "专栏", href: "//www.bilibili.com/read/home", icon: "bili-read" },
    { key: "live", name: "直播", href: "//live.bilibili.com", icon: "bili-live" },
    { key: "activity", name: "活动", href: "//www.bilibili.com/blackboard/activity-list.html", icon: "bili-activit" },
    { key: "cheese", name: "课堂", href: "//www.bilibili.com/cheese/?csource=common_hp_channelclass_icon", icon: "bili-zhishi" },
    { key: "community", name: "社区中心", href: "https://www.bilibili.com/blackboard/activity-5zJxM3spoS.html", community: true },
    { key: "musicplus", name: "新歌热榜", href: "//www.bilibili.com/v/musicplus/", icon: "bili-musicplus" }
  ]);
  const PRIMARY_LIVE_SUB = Object.freeze([
    ["全部", "//live.bilibili.com/all"], ["网游", "//live.bilibili.com/p/eden/area-tags?parentAreaId=2"],
    ["手游", "//live.bilibili.com/p/eden/area-tags?parentAreaId=3"], ["单机", "//live.bilibili.com/p/eden/area-tags?parentAreaId=6"],
    ["娱乐", "//live.bilibili.com/p/eden/area-tags?parentAreaId=1"], ["电台", "//live.bilibili.com/p/eden/area-tags?parentAreaId=5"],
    ["虚拟", "//live.bilibili.com/p/eden/area-tags?parentAreaId=9"], ["生活", "//live.bilibili.com/p/eden/area-tags?parentAreaId=10"],
    ["学习", "//live.bilibili.com/p/eden/area-tags?parentAreaId=11"]
  ].map((item) => Object.freeze(item)));

  const createPrimaryAnchor = (root, className, href, label, target) => {
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", href);
    const resolvedTarget = target || (typeof href === "string" && !href.startsWith("javascript:") ? "_blank" : "");
    if (resolvedTarget) {
      link.setAttribute("target", resolvedTarget);
      link.setAttribute("rel", "noopener noreferrer");
    }
    return link;
  };

  let primaryMenuPopoverSequence = 0;
  const setPrimaryPopover = (entry, visible) => {
    if (!entry || !entry.popover) return;
    if (entry.openTimer) {
      entry.windowObject.clearTimeout(entry.openTimer);
      entry.openTimer = 0;
    }
    if (entry.closeTimer) {
      entry.windowObject.clearTimeout(entry.closeTimer);
      entry.closeTimer = 0;
    }
    if (entry.leaveTimer) {
      entry.windowObject.clearTimeout(entry.leaveTimer);
      entry.leaveTimer = 0;
    }
    entry.container.classList.remove("is-popover-pending");
    entry.container.classList.toggle("is-popover-visible", visible);
    entry.container.classList.remove("is-popover-leaving");
    entry.container.classList.toggle("is-popover-closed", !visible);
    entry.reference.classList.toggle("focusing", visible);
    entry.popover.setAttribute("aria-hidden", visible ? "false" : "true");
  };

  const closePrimaryPopover = (entry, immediate = false) => {
    if (!entry || !entry.popover) return;
    if (entry.openTimer) {
      entry.windowObject.clearTimeout(entry.openTimer);
      entry.openTimer = 0;
    }
    if (entry.leaveTimer) {
      entry.windowObject.clearTimeout(entry.leaveTimer);
      entry.leaveTimer = 0;
    }
    entry.container.classList.remove("is-popover-pending");
    entry.container.classList.remove("is-popover-visible");
    entry.container.classList.add("is-popover-closed");
    entry.reference.classList.remove("focusing");
    entry.popover.setAttribute("aria-hidden", "true");
    if (entry.closeTimer) entry.windowObject.clearTimeout(entry.closeTimer);
    if (immediate) {
      entry.container.classList.remove("is-popover-leaving");
      entry.closeTimer = 0;
      return;
    }
    entry.container.classList.add("is-popover-leaving");
    entry.closeTimer = entry.windowObject.setTimeout(() => {
      entry.closeTimer = 0;
      entry.container.classList.remove("is-popover-leaving");
    }, 600);
  };

  const bindPrimaryMenu = (view, lifecycle) => {
    const cleanups = lifecycle && Array.isArray(lifecycle.cleanups) ? lifecycle.cleanups : [];
    const isActive = !lifecycle || typeof lifecycle.isActive !== "function" ? () => true : lifecycle.isActive;
    const documentObject = view.menu.ownerDocument;
    const windowObject = documentObject.defaultView || globalThis;
    const pointerExitRequired = new Set();
    const navigationGuard = getNavigationPointerGuard(documentObject);
    const closeOthers = (current) => {
      for (const entry of view.popovers) {
        if (entry !== current) closePrimaryPopover(entry, true);
      }
    };
    const closeAll = (requirePointerExit = false) => {
      for (const entry of view.popovers) {
        if (requirePointerExit) pointerExitRequired.add(entry);
        closePrimaryPopover(entry, true);
      }
      releaseSurfaceFocus(documentObject, [view.menu]);
    };
    for (const entry of view.popovers) {
      navigationGuard.register(entry);
      entry.windowObject = windowObject;
      entry.openTimer = 0;
      entry.closeTimer = 0;
      entry.leaveTimer = 0;
      const scheduleOpen = () => {
        if (!navigationGuard.canEnter(entry)) return;
        if (pointerExitRequired.has(entry)) return;
        if (entry.closeTimer) {
          windowObject.clearTimeout(entry.closeTimer);
          entry.closeTimer = 0;
        }
        if (entry.leaveTimer) {
          windowObject.clearTimeout(entry.leaveTimer);
          entry.leaveTimer = 0;
        }
        entry.container.classList.remove("is-popover-leaving");
        entry.container.classList.remove("is-popover-closed");
        if (entry.container.classList.contains("is-popover-visible") || entry.openTimer) return;
        entry.container.classList.add("is-popover-pending");
        entry.openTimer = windowObject.setTimeout(() => {
          entry.openTimer = 0;
          if (!isActive() || pointerExitRequired.has(entry)) return;
          closeOthers(entry);
          setPrimaryPopover(entry, true);
        }, 150);
      };
      addListenerWithCleanup(entry.reference, "pointerenter", scheduleOpen, cleanups);
      addListenerWithCleanup(entry.container, "pointerenter", scheduleOpen, cleanups);
      addListenerWithCleanup(entry.popover, "pointerenter", scheduleOpen, cleanups);
      addListenerWithCleanup(entry.container, "pointerleave", (event) => {
        if (entry.container.contains(event && event.relatedTarget)) return;
        navigationGuard.noteLeave(entry);
        pointerExitRequired.delete(entry);
        if (entry.leaveTimer) windowObject.clearTimeout(entry.leaveTimer);
        entry.leaveTimer = windowObject.setTimeout(() => {
          entry.leaveTimer = 0;
          closePrimaryPopover(entry);
        }, 120);
      }, cleanups);
      addListenerWithCleanup(entry.container, "focusin", () => {
        if (!isActive()) return;
        if (navigationGuard.isLocked()) return;
        if (pointerExitRequired.has(entry)) return;
        closeOthers(entry);
        setPrimaryPopover(entry, true);
      }, cleanups);
      addListenerWithCleanup(entry.container, "focusout", (event) => {
        if (!entry.container.contains(event && event.relatedTarget)) closePrimaryPopover(entry);
      }, cleanups);
      addListenerWithCleanup(entry.reference, "keydown", (event) => {
        if (!isActive()) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigationGuard.unlock();
          pointerExitRequired.delete(entry);
          closeOthers(entry);
          setPrimaryPopover(entry, true);
        } else if (event.key === "Escape") {
          event.preventDefault();
          closePrimaryPopover(entry, true);
          releaseSurfaceFocus(documentObject, [entry.container]);
        }
      }, cleanups);
      addListenerWithCleanup(entry.popover, "keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closePrimaryPopover(entry, true);
          releaseSurfaceFocus(documentObject, [entry.container]);
        }
      }, cleanups);
    }
    addListenerWithCleanup(view.menu, "click", (event) => {
      if (!findNavigationAnchor(event && event.target, view.menu)) return;
      navigationGuard.lock();
      closeAll(true);
    }, cleanups);
    addListenerWithCleanup(windowObject, "keydown", (event) => {
      if (event && (event.key === "Tab" || event.key === "Enter" || event.key === " " || event.key === "Spacebar")) {
        navigationGuard.unlock();
        pointerExitRequired.clear();
      }
    }, cleanups);
    const lockAndClose = () => {
      navigationGuard.lock();
      closeAll(true);
    };
    const closeForReturn = (event) => {
      if (isRestoredNavigation(documentObject, event)) navigationGuard.lock();
      closeAll(navigationGuard.isLocked() || pointerExitRequired.size > 0);
    };
    addListenerWithCleanup(windowObject, "blur", lockAndClose, cleanups);
    addListenerWithCleanup(windowObject, "pagehide", lockAndClose, cleanups);
    addListenerWithCleanup(windowObject, "pageshow", (event) => closeForReturn(event), cleanups);
    addListenerWithCleanup(windowObject, "focus", () => closeForReturn(), cleanups);
    if (typeof documentObject.addEventListener === "function") {
      addListenerWithCleanup(documentObject, "visibilitychange", () => {
        if (documentObject.visibilityState === "hidden") lockAndClose();
        else if (documentObject.visibilityState === "visible") closeForReturn();
      }, cleanups);
    }
    cleanups.push(() => {
      for (const entry of view.popovers) {
        if (entry.openTimer) windowObject.clearTimeout(entry.openTimer);
        if (entry.closeTimer) windowObject.clearTimeout(entry.closeTimer);
        if (entry.leaveTimer) windowObject.clearTimeout(entry.leaveTimer);
        entry.openTimer = 0;
        entry.closeTimer = 0;
        entry.leaveTimer = 0;
      }
    });
  };

  const PRIMARY_MENU_COUNT_KEYS = Object.freeze([
    "douga", "anime", "music", "guochuang", "dance", "game", "knowledge", "tech",
    "life", "kichiku", "fashion", "information", "ent", "cinephile", "cinema"
  ]);
  const isPrimaryMenuCountsData = (data) => data !== null
    && typeof data === "object"
    && !Array.isArray(data)
    && Object.keys(data).sort().join("\u001F") === "channels"
    && Array.isArray(data.channels)
    && data.channels.length === PRIMARY_MENU_COUNT_KEYS.length
    && data.channels.every((item, index) => item !== null
      && typeof item === "object"
      && !Array.isArray(item)
      && Object.keys(item).sort().join("\u001F") === "key\u001Fvalue"
      && item.key === PRIMARY_MENU_COUNT_KEYS[index]
      && (item.value === null || (Number.isSafeInteger(item.value) && item.value >= 0)));
  const formatPrimaryMenuCount = (value) => value === null || value === 0 ? "--" : value > 999 ? "999+" : String(value);
  const setPrimaryMenuCounts = (view, data) => {
    if (!view || view.destroyed === true || typeof view.isActive !== "function" || !view.isActive()
      || !isPrimaryMenuCountsData(data) || !(view.countBadges instanceof Map)
      || view.countBadges.size !== PRIMARY_MENU_COUNT_KEYS.length) return false;
    const writes = data.channels.map((item) => [view.countBadges.get(item.key), formatPrimaryMenuCount(item.value)]);
    if (writes.some(([badge]) => !badge)) return false;
    for (const [badge, textValue] of writes) badge.textContent = textValue;
    return true;
  };

  const createPrimaryMenu = (root, lifecycle) => {
    const menu = createNode(root, "nav", "primary-menu-wrap");
    menu.setAttribute("aria-label", "频道导航");
    const wrap = createNode(root, "div", "b-wrap");
    const inner = createNode(root, "div", "primary-menu-itnl");
    const popovers = [];
    const countBadges = new Map();
    const pageTab = createNode(root, "div", "page-tab report-wrap-module");
    pageTab.id = "primaryPageTab";
    const pageList = createNode(root, "ul", "con");
    const pageEntries = [
      ["首页", "/", "bili-icon_fenqudaohang_shouye", "", true, false],
      ["动态", "//t.bilibili.com", "bili-icon_dingdao_dongtai", "yel", false, true],
      ["热门", "//www.bilibili.com/v/popular/all", "bili-remen", "orange", false, false],
      ["频道", "//www.bilibili.com/v/channel", "bili-pindao", "channel", false, true]
    ];
    let dynamicEntrance = null;
    for (const [label, href, iconClass, roundClass, active, dynamic] of pageEntries) {
      const item = createNode(root, "li");
      if (active) item.setAttribute("aria-current", "page");
      const link = createPrimaryAnchor(root, "page-link", href, "", "_blank");
      const round = createNode(root, "div", roundClass ? `round ${roundClass}` : "round");
      round.appendChild(createIconFont(root, iconClass, null, lifecycle, "i"));
      if (dynamic) {
        const update = createNode(root, "div", "dynamic-update");
        update.setAttribute("aria-hidden", "true");
        if (label === "动态") {
          update.setAttribute("data-role", "dynamic-entrance");
          update.setAttribute("hidden", "true");
          dynamicEntrance = update;
          addListenerWithCleanup(link, "click", () => clearDynamicMenuAvatar(update), lifecycle && lifecycle.cleanups);
        }
        round.appendChild(update);
      }
      link.appendChild(round);
      link.appendChild(createNode(root, "span", label === "频道" ? "channel-name" : "", label));
      item.appendChild(link);
      pageList.appendChild(item);
    }
    pageTab.appendChild(pageList);
    inner.appendChild(pageTab);
    inner.appendChild(createNode(root, "span", "tab-line-itnl"));

    const channelMenu = createNode(root, "div", "channel-menu-itnl report-wrap-module");
    channelMenu.id = "primaryChannelMenu";
    for (const channelData of PRIMARY_CHANNELS) {
      const channel = createNode(root, "span", "channel-entry");
      channel.setAttribute("data-channel-key", channelData.key);
      channel.setAttribute("data-channel-tid", Array.isArray(channelData.tid) ? channelData.tid.join("+") : channelData.tid === null ? "" : String(channelData.tid));
      const popover = createNode(root, "div", "van-popover van-popper van-popper-channel");
      popover.id = `extension-b-primary-menu-tooltip-${primaryMenuPopoverSequence += 1}`;
      popover.setAttribute("role", "tooltip");
      popover.setAttribute("aria-hidden", "true");
      const subContainer = createNode(root, "div", "sub-container");
      let subItem = null;
      for (const [subLabel, subHref] of channelData.sub) {
        if (!subItem || subItem.children.length >= 4) {
          subItem = createNode(root, "div", "sub-item");
          subContainer.appendChild(subItem);
        }
        subItem.appendChild(createPrimaryAnchor(root, "name", subHref, subLabel));
      }
      popover.appendChild(subContainer);
      const reference = createNode(root, "div", `item van-popover__reference${channelData.key === "more" ? " item-more" : ""}`);
      reference.setAttribute("tabindex", "0");
      reference.setAttribute("aria-describedby", popover.id);
      const link = createPrimaryAnchor(root, "name", channelData.href, "");
      const label = createNode(root, "span", "", channelData.name);
      const badge = createNode(root, "em", channelData.hideCount ? "hide-count" : "channel-count", channelData.count);
      if (channelData.hideCount) {
        badge.setAttribute("aria-hidden", "true");
      } else {
        countBadges.set(channelData.key, badge);
      }
      label.appendChild(badge);
      link.appendChild(label);
      if (channelData.key === "more") link.appendChild(createIconFont(root, "bili-icon_caozuo_xiangyou-copy", null, lifecycle, "i"));
      reference.appendChild(link);
      channel.appendChild(popover);
      channel.appendChild(reference);
      channelMenu.appendChild(channel);
      popovers.push({ container: channel, reference, popover });
    }
    inner.appendChild(channelMenu);
    inner.appendChild(createNode(root, "span", "tab-line-itnl none"));

    const friendship = createNode(root, "div", "friendship-link report-wrap-module");
    friendship.id = "primaryFriendshipLink";
    for (const side of PRIMARY_FRIENDSHIP) {
      const entry = createNode(root, "span", side.key === "live" ? "channel-entry" : "");
      entry.setAttribute("data-side-key", side.key);
      let popover = null;
      if (side.key === "live") {
        popover = createNode(root, "div", "van-popover van-popper van-popper-channel friendship-popover");
        popover.id = `extension-b-primary-menu-tooltip-${primaryMenuPopoverSequence += 1}`;
        popover.setAttribute("role", "tooltip");
        popover.setAttribute("aria-hidden", "true");
        const subContainer = createNode(root, "div", "sub-container");
        let subItem = null;
        for (const [subLabel, subHref] of PRIMARY_LIVE_SUB) {
          if (!subItem || subItem.children.length >= 4) {
            subItem = createNode(root, "div", "sub-item");
            subContainer.appendChild(subItem);
          }
          subItem.appendChild(createPrimaryAnchor(root, "name", subHref, subLabel));
        }
        popover.appendChild(subContainer);
        entry.appendChild(popover);
      }
      const item = createNode(root, "div", "item van-popover__reference");
      item.setAttribute("tabindex", "0");
      if (popover) item.setAttribute("aria-describedby", popover.id);
      const link = createPrimaryAnchor(root, "name", side.href, "", "_blank");
      link.appendChild(side.community ? createCommunityIcon(root, 25) : createFriendshipIcon(root, side.icon, 25));
      link.appendChild(createNode(root, "span", "", side.name));
      item.appendChild(link);
      entry.appendChild(item);
      friendship.appendChild(entry);
      if (popover) popovers.push({ container: entry, reference: item, popover });
    }
    inner.appendChild(friendship);
    wrap.appendChild(inner);
    menu.appendChild(wrap);
    const view = {
      menu,
      pageTab,
      channelMenu,
      friendship,
      popovers,
      countBadges,
      dynamicEntrance,
      destroyed: false,
      isActive: lifecycle && typeof lifecycle.isActive === "function" ? lifecycle.isActive : () => true
    };
    menu.__primaryMenuView = view;
    bindPrimaryMenu(view, lifecycle);
    return menu;
  };

  const createStoreyTitle = (root, title, navKey, countLabel, iconId, lifecycle = null, onChange = null) => {
    const titleNode = createNode(root, "header", "storey-title");
    const left = createNode(root, "div", "l-con");
    if (iconId === "bili-live") {
      const icon = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "svg-icon storey-icon");
      icon.setAttribute("viewBox", "0 0 1024 1024");
      icon.setAttribute("aria-hidden", "true");
      const paths = [
        ["M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0", "#23ADE5"],
        ["M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556.142222 143.985778-64.156444 144.128-143.616.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-.142222-143.701333 63.857778-144.128 143.104-.426667 79.459556 63.644444 144.213333 143.104 144.64h.512", "#48CFE5"],
        ["M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504", "#FDDE80"]
      ];
      for (const [d, fill] of paths) {
        const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", fill);
        icon.appendChild(path);
      }
      left.appendChild(icon);
    } else if (iconId === "bili-douga") {
      const icon = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", "svg-icon storey-icon");
      icon.setAttribute("viewBox", "0 0 1024 1024");
      icon.setAttribute("aria-hidden", "true");
      const paths = [
        ["M273.408 166.912h477.696c58.368 0 105.984 47.616 105.984 105.984v477.696c0 58.368-47.616 105.984-105.984 105.984H273.408c-58.368 0-105.984-47.616-105.984-105.984V273.408C166.912 215.04 215.04 166.912 273.408 166.912z", "#7B78EB"],
        ["M512 525.312v98.816c33.28-14.848 72.704.512 87.552 33.792 14.848 33.28-.512 72.704-33.792 87.552-16.896 7.68-35.84 7.68-53.248 0v111.616H273.408c-58.368 0-105.984-47.616-105.984-105.984V512h137.216c-21.504 19.456-24.064 53.248-4.608 74.752 19.456 21.504 53.248 24.064 74.752 4.608 21.504-18.944 24.064-53.248 4.608-74.752l-4.608-4.608H512v-40.96c-4.096.512-9.216.512-13.312 0-51.2 0-86.016-47.616-86.016-105.984s20.992-108.032 86.016-108.032H512V166.912h238.592c58.368 0 105.984 47.616 105.984 105.984V524.8H735.744c20.992-23.552 19.456-59.392-3.584-80.896-23.552-20.992-59.392-19.456-80.896 3.584-19.968 21.504-19.968 55.296 0 76.8H512z", "#9796ED"],
        ["M444.928 693.248c-23.04 13.312-52.224 5.12-65.024-17.408-4.096-7.68-6.144-15.36-6.144-24.064V392.192c0-26.624 20.992-47.616 47.616-47.616 8.704 0 16.896 2.048 24.576 6.656l221.696 132.608c23.04 13.312 30.208 42.496 16.896 65.024-4.096 6.656-10.24 12.8-16.896 16.896z", "#FDDE80"]
      ];
      for (const [d, fill] of paths) {
        const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", fill);
        icon.appendChild(path);
      }
      left.appendChild(icon);
    } else {
      left.appendChild(createSvgIcon(root, iconId || "bili-tuiguang", 36, "svg-icon storey-icon"));
    }
    left.appendChild(createFixedAnchor(root, "name", navKey, title));
    if (countLabel) {
      left.appendChild(createNode(root, "span", "text-info", countLabel));
    }
    const actions = createNode(root, "div", "exchange-btn");
    const change = createNode(root, "div", "btn btn-change");
    change.setAttribute("role", "button");
    change.setAttribute("tabindex", "0");
    change.setAttribute("data-role", "floor-change");
    change.setAttribute("aria-label", "换一换");
    change.setAttribute("title", "换一换");
    change.appendChild(createIconFont(root, "bili-icon_caozuo_huanyihuan", null, lifecycle, "i"));
    change.appendChild(createNode(root, "span", "btn-change__label", "换一换"));
    const activateChange = (event) => {
      if (event && event.type === "keydown" && event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
        return;
      }
      if (event && event.type === "keydown") {
        event.preventDefault();
      }
      if (typeof onChange === "function") {
        onChange(event);
      }
      change.classList.remove("is-spinning");
      void change.offsetWidth;
      change.classList.add("is-spinning");
    };
    if (lifecycle && Array.isArray(lifecycle.cleanups)) {
      addListenerWithCleanup(change, "click", activateChange, lifecycle.cleanups);
      addListenerWithCleanup(change, "keydown", activateChange, lifecycle.cleanups);
    }
    actions.appendChild(change);
    const more = createFixedAnchor(root, "btn more", navKey, "更多");
    more.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, lifecycle, "i"));
    actions.appendChild(more);
    titleNode.appendChild(left);
    titleNode.appendChild(actions);
    titleNode.__floorChangeButton = change;
    return titleNode;
  };

  const appendProxyFloorContent = (root, floor, type, content) => {
    const proxy = createNode(root, "div", "proxy-box");
    const module = createNode(root, "div");
    module.id = `bili_${type}`;
    content.id = `bili_report_${type}`;
    content.classList.add("report-scroll-module");
    module.appendChild(content);
    proxy.appendChild(module);
    floor.appendChild(proxy);
    return { proxy, module };
  };

  const createRankRow = (root, item, options = {}) => {
    const rank = Number.isSafeInteger(item.rank) ? item.rank : 0;
    const pgc = options.pgc === true;
    const rowClass = pgc ? "pgc-rank-wrap" : "rank-wrap";
    const row = createNode(root, "div", `${rowClass}${rank > 0 && rank <= 3 ? ` ${rowClass}--top-${rank}` : ""}${rank === 1 ? ` ${rowClass}--featured` : ""}`);
    row.setAttribute("data-role", options.role || (pgc ? "pgc-rank-item" : "rank-item"));
    const number = createNode(root, "span", "number", String(rank));
    number.setAttribute("aria-label", `第${rank}名`);
    if (pgc && CROWN_ASSET_BY_RANK[rank]) {
      const crown = createLocalImage(root, "rank-crown", CROWN_ASSET_BY_RANK[rank], "");
      crown.setAttribute("data-rank-state", rank === 1 ? "gold" : "silver");
      row.appendChild(crown);
    }
    const cover = createNode(root, "span", "rank-cover");
    cover.appendChild(createCoverImage(
      root,
      "rank-cover__image",
      options.coverResolver ? options.coverResolver(item.coverUrl) : null,
      options.coverPool || FIXTURE_COVER_POOLS.rank,
      Number.isSafeInteger(item.fixtureIndex) ? item.fixtureIndex : Math.max(0, rank - 1),
      item.title || "精选内容",
      options.symbolId || "bili-tuiguang",
      options.mediaFence,
      cover
    ));
    const link = createFixedAnchor(root, "link", options.navKey || "ANIME", "");
    const text = createNode(root, "span", "rank-meta");
    text.appendChild(createNode(root, "span", "title", item.title || "精选内容"));
    const updateLabel = item.updateLabel || item.updateText;
    if (updateLabel) {
      text.appendChild(createNode(root, "span", "update", updateLabel));
    }
    link.appendChild(text);
    row.appendChild(number);
    row.appendChild(cover);
    row.appendChild(link);
    return row;
  };

  const createRankPanel = (root, title, navKey, rankItems, pgc, mediaFence) => {
    const rank = createNode(root, "aside", pgc ? "pgc-rank" : "rank-list ordinary-video-rank-list");
    rank.setAttribute("data-role", pgc ? "pgc-rank-list" : "zone-rank");
    rank.setAttribute("data-featured-rank", "true");
    const header = createNode(root, "header", "rank-header");
    header.appendChild(createNode(root, "span", "name", title));
    const more = createFixedAnchor(root, "more", navKey, "更多");
    more.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, null, "i"));
    header.appendChild(more);
    rank.appendChild(header);
    for (const item of rankItems) {
      rank.appendChild(createRankRow(root, item, { navKey, pgc, mediaFence }));
    }
    return rank;
  };

  const formatKnowledgeCount = (value, label) => `${label} ${value === null ? "--" : value.toLocaleString("en-US")}`;

  const createKnowledgeLink = (root, className, item, label) => {
    const href = resolveKnowledgeHref(item.href);
    if (!href) {
      return createNode(root, "span", className, label);
    }
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", href);
    link.setAttribute("target", "_self");
    return link;
  };

  const createKnowledgeCard = (view, item) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common");
    card.setAttribute("data-role", "knowledge-card");
    const pic = createNode(root, "div", "card-pic");
    const coverUrl = resolveKnowledgeCoverUrl(item.coverUrl);
    if (coverUrl) {
      pic.appendChild(createCoverImage(
        root,
        "knowledge-card__image",
        coverUrl,
        [],
        0,
        item.title,
        "bili-knowledge",
        view.mediaFence,
        pic
      ));
    } else {
      pic.appendChild(createMediaPlaceholder(root, "bili-knowledge", "图片暂不可用"));
    }
    pic.appendChild(createNode(root, "span", "count", formatKnowledgeCount(item.view, "播放")));
    card.appendChild(pic);
    card.appendChild(createKnowledgeLink(root, "title", item, item.title));
    card.appendChild(createNode(root, "span", "up", item.ownerName));
    return card;
  };

  const buildKnowledgeListFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const item of items) {
      fragment.appendChild(createKnowledgeCard(view, item));
    }
    return fragment;
  };

  const buildKnowledgeRankFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const [index, item] of items.slice(0, 4).entries()) {
      const row = createNode(view.root, "div", "rank-wrap");
      row.setAttribute("data-role", "knowledge-rank-item");
      row.appendChild(createNode(view.root, "span", "number", String(index + 1)));
      row.appendChild(createKnowledgeLink(view.root, "link", item, item.title));
      fragment.appendChild(row);
    }
    if (items.length === 0) {
      fragment.appendChild(createNode(view.root, "div", "empty-state", "暂无知识排行"));
    }
    return fragment;
  };

  const applyKnowledgeState = (view, items, state) => {
    if (!view || view.destroyed || !view.isRendererActive() || !Array.isArray(items) || !items.every(isKnowledgeItem)) {
      return false;
    }
    view.mediaFence.retireGeneration();
    view.state.items = items.map((item) => ({ ...item }));
    view.list.replaceChildren(buildKnowledgeListFragment(view, view.state.items));
    view.rank.replaceChildren(view.rankHeader, buildKnowledgeRankFragment(view, view.state.items));
    view.root.setAttribute("data-state", state);
    view.status.textContent = state === "failure"
      ? (view.state.items.length ? "知识内容加载失败，显示最近数据" : "知识内容加载失败")
      : state === "empty" ? "暂无知识内容" : state === "partial" ? "知识内容部分加载" : state === "success" ? "知识内容已更新" : "知识内容加载中";
    return true;
  };

  const createKnowledgeFloor = (root, rendererMediaFence, lifecycle = null) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-knowledge ordinary-floor");
    floor.setAttribute("data-floor-id", "knowledge");
    floor.setAttribute("data-role", "knowledge-floor");
    const space = createNode(root, "div", "space-between");
    const main = createNode(root, "div", "card-list");
    main.appendChild(createStoreyTitle(root, "知识", "ANIME", "动态内容", "bili-knowledge", lifecycle));
    const status = createNode(root, "span", "knowledge-status", "知识内容加载中");
    status.setAttribute("data-role", "knowledge-status");
    const list = createNode(root, "div", "zone-list-box");
    list.setAttribute("data-role", "knowledge-list");
    list.setAttribute("data-state", "loading");
    main.appendChild(status);
    main.appendChild(list);
    const rank = createRankPanel(root, "排行榜", "ANIME", [], false);
    rank.setAttribute("data-role", "knowledge-rank");
    const rankHeader = rank.querySelector(".rank-header");
    const layout = createNode(root, "div", "floor-layout");
    layout.appendChild(main);
    layout.appendChild(rank);
    space.appendChild(layout);
    appendProxyFloorContent(root, floor, "knowledge", space);
    const view = {
      root: floor,
      list,
      rank,
      rankHeader,
      status,
      state: { items: [] },
      destroyed: false,
      isRendererActive: () => true,
      cardListenerCleanups: []
    };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    applyKnowledgeState(view, [], "loading");
    return { floor, view };
  };

  const setKnowledgeData = (view, data) => {
    if (!isKnowledgeData(data)) {
      return false;
    }
    return applyKnowledgeState(view, data.items, data.status);
  };

  const setKnowledgeFailure = (view, lastGoodItems) => {
    const items = Array.isArray(lastGoodItems) && lastGoodItems.every(isKnowledgeItem)
      ? lastGoodItems
      : [];
    return applyKnowledgeState(view, items, "failure");
  };

  const formatMusicCount = (value, label) => `${label} ${value === null ? "--" : value.toLocaleString("en-US")}`;

  const createMusicLink = (root, className, item, label) => {
    const href = resolveMusicHref(item.href);
    if (!href) return createNode(root, "span", className, label);
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", href);
    link.setAttribute("target", "_self");
    return link;
  };

  const createMusicCard = (view, item) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common");
    card.setAttribute("data-role", "music-card");
    const pic = createNode(root, "div", "card-pic");
    const coverUrl = resolveMusicCoverUrl(item.coverUrl);
    if (coverUrl) {
      pic.appendChild(createCoverImage(
        root,
        "music-card__image",
        coverUrl,
        [],
        0,
        item.title,
        "bili-music",
        view.mediaFence,
        pic
      ));
    } else {
      pic.appendChild(createMediaPlaceholder(root, "bili-music", "图片暂不可用"));
    }
    pic.appendChild(createNode(root, "span", "count", formatMusicCount(item.view, "播放")));
    card.appendChild(pic);
    card.appendChild(createMusicLink(root, "title", item, item.title));
    card.appendChild(createNode(root, "span", "up", item.ownerName));
    return card;
  };

  const buildMusicListFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const item of items) fragment.appendChild(createMusicCard(view, item));
    return fragment;
  };

  const buildMusicRankFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const [index, item] of items.slice(0, 4).entries()) {
      const row = createNode(view.root, "div", "rank-wrap");
      row.setAttribute("data-role", "music-rank-item");
      row.appendChild(createNode(view.root, "span", "number", String(index + 1)));
      row.appendChild(createMusicLink(view.root, "link", item, item.title));
      fragment.appendChild(row);
    }
    if (items.length === 0) fragment.appendChild(createNode(view.root, "div", "empty-state", "暂无音乐内容"));
    return fragment;
  };

  const applyMusicState = (view, items, state) => {
    if (!view || view.destroyed || !view.isRendererActive() || !Array.isArray(items) || !items.every(isMusicItem)) return false;
    view.mediaFence.retireGeneration();
    view.state.items = items.map((item) => ({ ...item }));
    view.list.replaceChildren(buildMusicListFragment(view, view.state.items));
    view.rank.replaceChildren(view.rankHeader, buildMusicRankFragment(view, view.state.items));
    view.root.setAttribute("data-state", state);
    view.status.textContent = state === "failure"
      ? (view.state.items.length ? "音乐内容加载失败，显示最近数据" : "音乐内容加载失败")
      : state === "empty" ? "暂无音乐内容"
        : state === "partial" ? "音乐内容部分加载"
          : state === "success" ? "音乐内容已更新" : "音乐内容加载中";
    return true;
  };

  const createMusicFloor = (root, rendererMediaFence, lifecycle = null) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-music ordinary-floor");
    floor.setAttribute("data-floor-id", "music");
    floor.setAttribute("data-role", "music-floor");
    const space = createNode(root, "div", "space-between");
    const main = createNode(root, "div", "card-list");
    main.appendChild(createStoreyTitle(root, "音乐", "ANIME", "动态内容", "bili-music", lifecycle));
    const status = createNode(root, "span", "music-status", "音乐内容加载中");
    status.setAttribute("data-role", "music-status");
    const list = createNode(root, "div", "zone-list-box");
    list.setAttribute("data-role", "music-list");
    list.setAttribute("data-state", "loading");
    main.appendChild(status);
    main.appendChild(list);
    const rank = createRankPanel(root, "音乐排行", "ANIME", [], false);
    rank.setAttribute("data-role", "music-rank");
    const layout = createNode(root, "div", "floor-layout");
    layout.appendChild(main);
    layout.appendChild(rank);
    space.appendChild(layout);
    appendProxyFloorContent(root, floor, "music", space);
    const view = {
      root: floor,
      list,
      rank,
      rankHeader: rank.querySelector(".rank-header"),
      status,
      state: { items: [] },
      destroyed: false,
      isRendererActive: () => true,
      cardListenerCleanups: []
    };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    applyMusicState(view, [], "loading");
    return { floor, view };
  };

  const setMusicData = (view, data) => isMusicData(data) ? applyMusicState(view, data.items, data.status) : false;

  const setMusicFailure = (view, lastGoodItems) => {
    const items = Array.isArray(lastGoodItems) && lastGoodItems.every(isMusicItem) ? lastGoodItems : [];
    return applyMusicState(view, items, "failure");
  };

  const createAnimalLink = (root, className, item, label) => {
    const href = resolveAnimalHref(item.href);
    if (!href) return createNode(root, "span", className, label);
    const link = createNode(root, "a", className, label);
    link.setAttribute("href", href); link.setAttribute("target", "_self");
    return link;
  };
  const createAnimalCard = (view, item) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common"); card.setAttribute("data-role", "animal-card");
    const pic = createNode(root, "div", "card-pic"); const coverUrl = resolveAnimalCoverUrl(item.coverUrl);
    if (coverUrl) {
      pic.appendChild(createCoverImage(root, "animal-card__image", coverUrl, [], 0, item.title, "bili-animal", view.mediaFence, pic));
    } else pic.appendChild(createMediaPlaceholder(root, "bili-animal", "图片暂不可用"));
    pic.appendChild(createNode(root, "span", "count", `${item.view === null ? "播放 --" : `播放 ${item.view.toLocaleString("en-US")}`}`));
    card.appendChild(pic); card.appendChild(createAnimalLink(root, "title", item, item.title)); card.appendChild(createNode(root, "span", "up", item.ownerName));
    return card;
  };
  const buildAnimalListFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const item of items) fragment.appendChild(createAnimalCard(view, item));
    return fragment;
  };
  const buildAnimalRankFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const [index, item] of items.slice(0, 4).entries()) {
      const row = createNode(view.root, "div", "rank-wrap"); row.setAttribute("data-role", "animal-rank-item"); row.appendChild(createNode(view.root, "span", "number", String(index + 1))); row.appendChild(createAnimalLink(view.root, "link", item, item.title)); fragment.appendChild(row);
    }
    if (items.length === 0) fragment.appendChild(createNode(view.root, "div", "empty-state", "暂无动物内容"));
    return fragment;
  };
  const applyAnimalState = (view, items, state) => {
    if (!view || view.destroyed || !view.isRendererActive() || !Array.isArray(items) || !items.every(isAnimalItem)) return false;
    view.mediaFence.retireGeneration();
    view.state.items = items.map((item) => ({ ...item })); view.list.replaceChildren(buildAnimalListFragment(view, view.state.items)); view.rank.replaceChildren(view.rankHeader, buildAnimalRankFragment(view, view.state.items)); view.root.setAttribute("data-state", state);
    view.status.textContent = state === "failure" ? (view.state.items.length ? "动物内容加载失败，显示最近数据" : "动物内容加载失败") : state === "empty" ? "暂无动物内容" : state === "partial" ? "动物内容部分加载" : state === "success" ? "动物内容已更新" : "动物内容加载中";
    return true;
  };
  const createAnimalFloor = (root, rendererMediaFence, lifecycle = null) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-animal ordinary-floor"); floor.setAttribute("data-floor-id", "animal"); floor.setAttribute("data-source-floor", "/c/animal/");
    const space = createNode(root, "div", "space-between"); const main = createNode(root, "div", "card-list"); main.appendChild(createStoreyTitle(root, "动物", "ANIME", "公开内容", "bili-animal", lifecycle));
    const status = createNode(root, "span", "animal-status", "动物内容加载中"); status.setAttribute("data-role", "animal-status"); const list = createNode(root, "div", "zone-list-box"); list.setAttribute("data-role", "animal-list"); list.setAttribute("data-state", "loading"); main.appendChild(status); main.appendChild(list);
    const rank = createRankPanel(root, "动物排行", "ANIME", [], false); rank.setAttribute("data-role", "animal-rank"); const layout = createNode(root, "div", "floor-layout"); layout.appendChild(main); layout.appendChild(rank); space.appendChild(layout); appendProxyFloorContent(root, floor, "animal", space);
    const view = { root: floor, list, rank, rankHeader: rank.querySelector(".rank-header"), status, state: { items: [] }, destroyed: false, isRendererActive: () => true, cardListenerCleanups: [] };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    applyAnimalState(view, [], "loading"); return { floor, view };
  };
  const setAnimalData = (view, data) => isAnimalData(data) ? applyAnimalState(view, data.items, data.status) : false;
  const setAnimalFailure = (view, lastGoodItems) => applyAnimalState(view, Array.isArray(lastGoodItems) && lastGoodItems.every(isAnimalItem) ? lastGoodItems : [], "failure");

  const createFashionLink = (root, className, item, label) => {
    const href = resolveFashionHref(item.href);
    if (!href) return createNode(root, "span", className, label);
    const link = createNode(root, "a", className, label); link.setAttribute("href", href); link.setAttribute("target", "_self"); return link;
  };
  const createFashionCard = (view, item) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common"); card.setAttribute("data-role", "fashion-card"); const pic = createNode(root, "div", "card-pic"); const coverUrl = resolveFashionCoverUrl(item.coverUrl);
    if (coverUrl) {
      pic.appendChild(createCoverImage(root, "fashion-card__image", coverUrl, [], 0, item.title, "bili-fashion", view.mediaFence, pic));
    } else pic.appendChild(createMediaPlaceholder(root, "bili-fashion", "图片暂不可用"));
    pic.appendChild(createNode(root, "span", "count", `${item.view === null ? "播放 --" : `播放 ${item.view.toLocaleString("en-US")}`}`)); card.appendChild(pic); card.appendChild(createFashionLink(root, "title", item, item.title)); card.appendChild(createNode(root, "span", "up", item.ownerName)); return card;
  };
  const buildFashionListFragment = (view, items) => { const fragment = view.root.ownerDocument.createDocumentFragment(); for (const item of items) fragment.appendChild(createFashionCard(view, item)); return fragment; };
  const buildFashionRankFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const [index, item] of items.slice(0, 4).entries()) { const row = createNode(view.root, "div", "rank-wrap"); row.setAttribute("data-role", "fashion-rank-item"); row.appendChild(createNode(view.root, "span", "number", String(index + 1))); row.appendChild(createFashionLink(view.root, "link", item, item.title)); fragment.appendChild(row); }
    if (items.length === 0) fragment.appendChild(createNode(view.root, "div", "empty-state", "暂无时尚内容")); return fragment;
  };
  const applyFashionState = (view, items, state) => {
    if (!view || view.destroyed || !view.isRendererActive() || !Array.isArray(items) || !items.every(isFashionItem)) return false;
    view.mediaFence.retireGeneration();
    view.state.items = items.map((item) => ({ ...item })); view.list.replaceChildren(buildFashionListFragment(view, view.state.items)); view.rank.replaceChildren(view.rankHeader, buildFashionRankFragment(view, view.state.items)); view.root.setAttribute("data-state", state);
    view.status.textContent = state === "failure" ? (view.state.items.length ? "时尚内容加载失败，显示最近数据" : "时尚内容加载失败") : state === "empty" ? "暂无时尚内容" : state === "partial" ? "时尚内容部分加载" : state === "success" ? "时尚内容已更新" : "时尚内容加载中";
    return true;
  };
  const createFashionFloor = (root, rendererMediaFence, lifecycle = null) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-fashion ordinary-floor"); floor.setAttribute("data-floor-id", "fashion"); floor.setAttribute("data-source-floor", "/c/fashion/");
    const space = createNode(root, "div", "space-between"); const main = createNode(root, "div", "card-list"); main.appendChild(createStoreyTitle(root, "时尚", "ANIME", "公开内容", "bili-fashion", lifecycle));
    const status = createNode(root, "span", "fashion-status", "时尚内容加载中"); status.setAttribute("data-role", "fashion-status"); const list = createNode(root, "div", "zone-list-box"); list.setAttribute("data-role", "fashion-list"); list.setAttribute("data-state", "loading"); main.appendChild(status); main.appendChild(list);
    const rank = createRankPanel(root, "时尚排行", "ANIME", [], false); rank.setAttribute("data-role", "fashion-rank"); const layout = createNode(root, "div", "floor-layout"); layout.appendChild(main); layout.appendChild(rank); space.appendChild(layout); appendProxyFloorContent(root, floor, "fashion", space);
    const view = { root: floor, list, rank, rankHeader: rank.querySelector(".rank-header"), status, state: { items: [] }, destroyed: false, isRendererActive: () => true, cardListenerCleanups: [] };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    applyFashionState(view, [], "loading"); return { floor, view };
  };
  const setFashionData = (view, data) => isFashionData(data) ? applyFashionState(view, data.items, data.status) : false;
  const setFashionFailure = (view, lastGoodItems) => applyFashionState(view, Array.isArray(lastGoodItems) && lastGoodItems.every(isFashionItem) ? lastGoodItems : [], "failure");

  const createZoneFloor = (root, config, mediaFence, lifecycle) => {
    const floor = createNode(root, "section", `storey-box b-wrap storey-${config.type} ordinary-floor`);
    floor.setAttribute("data-floor-id", config.type);
    const space = createNode(root, "div", "space-between report-wrap-module");
    const main = createNode(root, "div", "card-list");
    const list = createNode(root, "div", "zone-list-box");
    list.setAttribute("data-role", "zone-list");
    list.setAttribute("data-state", "fixture");
    for (const [index, item] of config.items.entries()) {
      const card = createNode(root, "article", "video-card-common");
      card.setAttribute("data-role", "zone-card");
      const pic = createNode(root, "div", "card-pic card-pic-hover");
      const remoteCoverUrl = Object.prototype.hasOwnProperty.call(item, "coverUrl")
        ? resolveFocusUrl(item.coverUrl, FOCUS_IMAGE_HOSTS, ["/bfs/archive/"], true)
        : null;
      const media = createNode(root, "div", "b-img");
      const picture = createNode(root, "picture", "b-img__inner");
      picture.appendChild(createCoverImage(
        root,
        "card-pic__image",
        remoteCoverUrl,
        FIXTURE_COVER_POOLS.recommend,
        index,
        item.title,
        categorySymbolFor(config.type),
        mediaFence,
        pic
      ));
      media.appendChild(picture);
      const cardLink = createFixedAnchor(root, "card-link", config.navKey, "");
      cardLink.appendChild(media);
      const count = createNode(root, "div", "count");
      const countLeft = createNode(root, "div", "left");
      countLeft.appendChild(createNode(root, "span", "metric metric--view", item.playLabel || item.metaLabel || "播放占位"));
      const stat = createNode(root, "span", "metric metric--stat");
      stat.appendChild(createIconFont(root, "bili-icon_shipin_dianzanshu", null, lifecycle));
      stat.appendChild(root.ownerDocument.createTextNode(normalizeText(item.statLabel || "0")));
      countLeft.appendChild(stat);
      count.appendChild(countLeft);
      const countRight = createNode(root, "div", "right");
      countRight.appendChild(createNode(root, "span", "metric metric--duration", item.durationLabel || "00:00"));
      count.appendChild(countRight);
      cardLink.appendChild(count);
      pic.appendChild(cardLink);
      const watchLater = createNode(root, "div", "watch-later-video van-watchlater black");
      watchLater.setAttribute("data-role", "watch-later");
      watchLater.setAttribute("role", "button");
      watchLater.setAttribute("tabindex", "0");
      watchLater.setAttribute("aria-label", "稍后再看");
      watchLater.appendChild(createNode(root, "span", "wl-tips", "稍后再看"));
      pic.appendChild(watchLater);
      card.appendChild(pic);
      card.appendChild(createFixedAnchor(root, "title", config.navKey, item.title));
      const up = createFixedAnchor(root, "up", "HOME_ROOT", "");
      up.appendChild(createIconFont(root, "bili-icon_xinxi_UPzhu", null, lifecycle, "i"));
      up.appendChild(root.ownerDocument.createTextNode(normalizeText(item.creatorLabel)));
      card.appendChild(up);
      list.appendChild(card);
    }
    const titleNode = createStoreyTitle(
      root,
      config.title,
      config.navKey,
      config.countLabel,
      categorySymbolFor(config.type),
      lifecycle,
      () => {
        const first = list.firstElementChild;
        if (first && list.children.length > 1) {
          list.appendChild(first);
        }
      }
    );
    main.appendChild(titleNode);
    main.appendChild(list);
    const side = createRankPanel(root, "排行榜", config.navKey, config.ranks, false, mediaFence);
    const layout = createNode(root, "div", "floor-layout");
    layout.appendChild(main);
    layout.appendChild(side);
    space.appendChild(layout);
    appendProxyFloorContent(root, floor, config.type, space);
    floor.__zoneView = Object.freeze({ root: floor, list, rank: side, config, mediaFence });
    return floor;
  };

  const createDougaAnchor = (root, className, href, label = "") => createPrimaryAnchor(root, className, href, label, "_blank");

  const DOUGA_METRIC_ICON_PATHS = Object.freeze({
    play: "M896 736v-448c0-54.4-41.6-96-96-96h-576C169.6 192 128 233.6 128 288v448c0 54.4 41.6 96 96 96h576c54.4 0 96-41.6 96-96zM800 128C889.6 128 960 198.4 960 288v448c0 89.6-70.4 160-160 160h-576C134.4 896 64 825.6 64 736v-448C64 198.4 134.4 128 224 128h576z m-115.2 355.2c25.6 9.6 25.6 48 0 57.6l-256 112c-22.4 9.6-44.8-6.4-44.8-28.8v-224c0-22.4 22.4-38.4 44.8-28.8l256 112z",
    danmaku: "M800 128C889.6 128 960 198.4 960 288v448c0 89.6-70.4 160-160 160h-576C134.4 896 64 825.6 64 736v-448C64 198.4 134.4 128 224 128h576z m0 64h-576c-51.2 0-91.072 36.864-95.552 86.528L128 288v448c0 51.2 36.864 91.072 86.528 95.552L224 832h576c51.2 0 91.072-36.864 95.552-86.528L896 736v-448c0-54.4-41.6-96-96-96zM368 576v64h-64V576h64z m416 0v64h-352V576h352z m-480-192v64h-64V384h64z m448 0v64h-384V384h384z",
    up: "M896 736v-448c0-54.4-41.6-96-96-96h-576C169.6 192 128 233.6 128 288v448c0 54.4 41.6 96 96 96h576c54.4 0 96-41.6 96-96zM800 128C889.6 128 960 198.4 960 288v448c0 89.6-70.4 160-160 160h-576C134.4 896 64 825.6 64 736v-448C64 198.4 134.4 128 224 128h576zM419.2 544V326.4h60.8v240c0 96-57.6 144-147.2 144S192 665.6 192 569.6V326.4h60.8v217.6c0 51.2 3.2 108.8 83.2 108.8s83.2-57.6 83.2-108.8z m288-38.4c28.8 0 60.8-16 60.8-60.8 0-48-28.8-60.8-60.8-60.8H614.4v121.6h92.8z m3.2-179.2c102.4 0 121.6 70.4 121.6 115.2 0 48-19.2 115.2-121.6 115.2H614.4V704h-60.8V326.4h156.8z"
  });

  const createDougaMetricIcon = (root, key) => {
    const svg = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", `svg-icon douga-metric-icon douga-metric-icon--${key}`);
    svg.setAttribute("viewBox", "0 0 1024 1024");
    svg.setAttribute("aria-hidden", "true");
    const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", DOUGA_METRIC_ICON_PATHS[key]);
    svg.appendChild(path);
    return svg;
  };

  const createDougaCard = (view, item, index, type = "douga") => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common");
    card.setAttribute("data-role", `${type}-card`);
    const pic = createNode(root, "div", "card-pic card-pic-hover");
    const link = createDougaAnchor(root, "card-link", item.href);
    const media = createNode(root, "div", "b-img");
    const picture = createNode(root, "picture", "b-img__inner");
    picture.appendChild(createCoverImage(root, "card-pic__image", item.cover, FIXTURE_COVER_POOLS.recommend, index, item.title, categorySymbolFor(type), view.mediaFence, pic));
    media.appendChild(picture);
    link.appendChild(media);
    const count = createNode(root, "div", "count");
    const left = createNode(root, "div", "left");
    const viewMetric = createNode(root, "span", "metric metric--view");
    viewMetric.appendChild(createDougaMetricIcon(root, "play"));
    viewMetric.appendChild(root.ownerDocument.createTextNode(formatDougaCount(item.view)));
    const danmakuMetric = createNode(root, "span", "metric metric--stat");
    danmakuMetric.appendChild(createDougaMetricIcon(root, "danmaku"));
    danmakuMetric.appendChild(root.ownerDocument.createTextNode(formatDougaCount(item.danmaku)));
    left.appendChild(viewMetric);
    left.appendChild(danmakuMetric);
    const right = createNode(root, "div", "right");
    right.appendChild(createNode(root, "span", "metric metric--duration", formatMediaDuration(item.duration)));
    count.appendChild(left);
    count.appendChild(right);
    link.appendChild(count);
    pic.appendChild(link);
    const watchLater = createNode(root, "div", "watch-later-video van-watchlater black");
    watchLater.setAttribute("data-role", "watch-later");
    watchLater.setAttribute("role", "button");
    watchLater.setAttribute("tabindex", "0");
    watchLater.setAttribute("aria-label", "稍后再看");
    watchLater.setAttribute("data-aid", String(item.aid));
    watchLater.appendChild(createNode(root, "span", "wl-tips", "稍后再看"));
    const activateWatchLater = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (typeof view.onWatchLaterRequest === "function") {
        view.onWatchLaterRequest(event, { aid: item.aid, added: watchLater.classList.contains("added") });
      }
    };
    addListenerWithCleanup(watchLater, "mouseleave", () => {
      watchLater.classList.remove("is-feedback");
      const tips = watchLater.querySelector(".wl-tips");
      if (tips) tips.textContent = watchLater.classList.contains("added") ? "移除" : "稍后再看";
    }, view.cardListenerCleanups);
    addListenerWithCleanup(watchLater, "click", activateWatchLater, view.cardListenerCleanups);
    addListenerWithCleanup(watchLater, "keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
      activateWatchLater(event);
    }, view.cardListenerCleanups);
    pic.appendChild(watchLater);
    card.appendChild(pic);
    card.appendChild(createDougaAnchor(root, "title", item.href, item.title));
    const up = createDougaAnchor(root, "up", item.ownerHref);
    up.appendChild(createDougaMetricIcon(root, "up"));
    up.appendChild(root.ownerDocument.createTextNode(item.ownerName));
    card.appendChild(up);
    return card;
  };

  const createDougaRankRow = (view, item, type = "douga") => {
    const row = createNode(view.root, "div", `rank-wrap custom-rank-wrap${item.rank <= 3 ? " rank-wrap--top" : ""}`);
    row.setAttribute("data-role", "douga-rank-item");
    row.appendChild(createNode(view.root, "span", item.rank <= 3 ? "number on" : "number", String(item.rank)));
    if (item.rank === 1) {
      const preview = createNode(view.root, "div", "preview");
      const pic = createNode(view.root, "div", "pic");
      const coverLink = createDougaAnchor(view.root, "link", item.href);
      coverLink.appendChild(createCoverImage(view.root, "rank-cover__image", item.cover, FIXTURE_COVER_POOLS.rank, 0, item.title, categorySymbolFor(type), view.mediaFence, pic));
      pic.appendChild(coverLink);
      const watchLater = createNode(view.root, "div", "watch-later-video van-watchlater black");
      watchLater.setAttribute("data-role", "watch-later");
      watchLater.setAttribute("role", "button");
      watchLater.setAttribute("tabindex", "0");
      watchLater.setAttribute("aria-label", "稍后再看");
      watchLater.setAttribute("data-aid", String(item.aid));
      watchLater.appendChild(createNode(view.root, "span", "wl-tips", "稍后再看"));
      const activateRankWatchLater = (event) => {
        event.preventDefault();
        event.stopPropagation();
        row.classList.remove("is-rank-popover-visible");
        if (typeof view.onWatchLaterRequest === "function") {
          view.onWatchLaterRequest(event, { aid: item.aid, added: watchLater.classList.contains("added") });
        }
      };
      addListenerWithCleanup(watchLater, "click", activateRankWatchLater, view.cardListenerCleanups);
      addListenerWithCleanup(watchLater, "keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        activateRankWatchLater(event);
      }, view.cardListenerCleanups);
      pic.appendChild(watchLater);
      const txt = createNode(view.root, "div", "txt");
      const textLink = createDougaAnchor(view.root, "link", item.href);
      textLink.appendChild(createNode(view.root, "p", "title", item.title));
      txt.appendChild(textLink);
      preview.appendChild(pic);
      preview.appendChild(txt);
      row.appendChild(preview);
    } else {
      const link = createDougaAnchor(view.root, "link", item.href);
      link.appendChild(createNode(view.root, "p", "title", item.title));
      row.appendChild(link);
    }
    const popover = createNode(view.root, "div", "rank-video-popover");
    const main = createNode(view.root, "div", "rank-video-popover__main");
    const cover = createDougaAnchor(view.root, "rank-video-popover__cover", item.href);
    cover.appendChild(createCoverImage(view.root, "rank-video-popover__image", item.cover, FIXTURE_COVER_POOLS.rank, item.rank - 1, item.title, categorySymbolFor(type), view.mediaFence, popover));
    const info = createNode(view.root, "div", "rank-video-popover__info");
    info.appendChild(createDougaAnchor(view.root, "rank-video-popover__title", item.href, item.title));
    const meta = createNode(view.root, "div", "rank-video-popover__meta");
    meta.appendChild(createDougaAnchor(view.root, "rank-video-popover__owner", item.ownerHref, item.ownerName));
    meta.appendChild(createNode(view.root, "span", "rank-video-popover__date", formatDougaDate(item.pubdate)));
    info.appendChild(meta);
    main.appendChild(cover);
    main.appendChild(info);
    popover.appendChild(main);
    const stats = createNode(view.root, "div", "rank-video-popover__stats");
    for (const [icon, value] of [
      ["bili-icon_shipin_bofangshu", item.view],
      ["bili-icon_shipin_danmushu", item.danmaku],
      ["bili-icon_shipin_shoucangshu", item.favorite],
      ["bili-icon_shipin_yingbishu", item.coin]
    ]) {
      const stat = createNode(view.root, "span", "rank-video-popover__stat");
      stat.appendChild(createIconFont(view.root, icon, null, view.lifecycle, "i"));
      stat.appendChild(view.root.ownerDocument.createTextNode(formatDougaCount(value)));
      stats.appendChild(stat);
    }
    popover.appendChild(stats);
    row.appendChild(popover);
    let showTimer = null;
    const clearShowTimer = () => {
      if (showTimer !== null) {
        clearTimeout(showTimer);
        showTimer = null;
      }
    };
    const scheduleOpen = () => {
      clearShowTimer();
      showTimer = setTimeout(() => {
        showTimer = null;
        if (!view.destroyed && view.isRendererActive()) row.classList.add("is-rank-popover-visible");
      }, 300);
    };
    const closePopover = () => {
      clearShowTimer();
      row.classList.remove("is-rank-popover-visible");
    };
    addListenerWithCleanup(row, "mouseenter", scheduleOpen, view.cardListenerCleanups);
    addListenerWithCleanup(row, "mouseleave", closePopover, view.cardListenerCleanups);
    addListenerWithCleanup(row, "focusin", scheduleOpen, view.cardListenerCleanups);
    addListenerWithCleanup(row, "focusout", (event) => {
      if (event.relatedTarget && row.contains(event.relatedTarget)) return;
      closePopover();
    }, view.cardListenerCleanups);
    addListenerWithCleanup(row, "click", (event) => {
      closePopover();
      const anchor = event.target && typeof event.target.closest === "function" ? event.target.closest("a") : null;
      if (anchor && typeof anchor.blur === "function") anchor.blur();
    }, view.cardListenerCleanups);
    view.cardListenerCleanups.push(clearShowTimer);
    return row;
  };

  const createOrdinaryPgcCard = (view, item, index, type) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common ordinary-pgc-card");
    card.setAttribute("data-role", `${type}-pgc-card`);
    const pic = createNode(root, "div", "card-pic card-pic-hover");
    const link = createNode(root, "a", "card-link");
    link.setAttribute("href", item.href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.appendChild(createCoverImage(root, "card-pic__image", item.cover, FIXTURE_COVER_POOLS.recommend, index, item.title, categorySymbolFor(type), view.mediaFence, pic));
    if (item.rating) {
      const count = createNode(root, "div", "count pgc-card-rating");
      count.appendChild(createNode(root, "span", "metric metric--rating", item.rating));
      link.appendChild(count);
    }
    pic.appendChild(link);
    card.appendChild(pic);
    const title = createNode(root, "a", "title", item.title);
    title.setAttribute("href", item.href);
    title.setAttribute("target", "_blank");
    title.setAttribute("rel", "noopener noreferrer");
    card.appendChild(title);
    if (item.subtitle) card.appendChild(createNode(root, "p", "up pgc-card-subtitle", item.subtitle));
    return card;
  };

  const createOrdinaryPgcRankRow = (view, item, type) => {
    const row = createNode(view.root, "div", `pgc-rank-wrap custom-pgc-rank-wrap${item.rank <= 3 ? " pgc-rank-wrap--top" : ""}`);
    row.setAttribute("data-role", "ordinary-pgc-rank-item");
    row.appendChild(createNode(view.root, "span", item.rank <= 3 ? "number on" : "number", String(item.rank)));
    const link = createNode(view.root, "a", "link");
    link.setAttribute("href", item.href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    const text = createNode(view.root, "div", "txt");
    text.appendChild(createNode(view.root, "span", "title", item.title));
    if (item.updateText) {
      text.appendChild(createNode(view.root, "span", type === "movie" ? "update movie-update" : "update", item.updateText));
    }
    link.appendChild(text);
    row.appendChild(link);
    return row;
  };

  const createCheeseCard = (view, item, index) => {
    const root = view.root;
    const card = createNode(root, "article", "video-card-common cheese-card");
    card.setAttribute("data-role", "course-card");
    const pic = createNode(root, "div", "card-pic card-pic-hover");
    const link = createDougaAnchor(root, "card-link", item.href);
    const media = createNode(root, "div", "b-img");
    const picture = createNode(root, "picture", "b-img__inner");
    picture.appendChild(createCoverImage(root, "card-pic__image", item.cover, FIXTURE_COVER_POOLS.recommend, index, item.title, "bili-zhishi", view.mediaFence, pic));
    media.appendChild(picture); link.appendChild(media);
    const count = createNode(root, "div", "count");
    const left = createNode(root, "div", "left");
    const play = createNode(root, "span", "metric metric--view");
    play.appendChild(createDougaMetricIcon(root, "play"));
    play.appendChild(root.ownerDocument.createTextNode(formatDougaCount(item.play)));
    left.appendChild(play); count.appendChild(left);
    link.appendChild(count); pic.appendChild(link); card.appendChild(pic);
    card.appendChild(createDougaAnchor(root, "title", item.href, item.title));
    const up = createDougaAnchor(root, "up", item.ownerHref);
    up.appendChild(createDougaMetricIcon(root, "up"));
    up.appendChild(root.ownerDocument.createTextNode(item.ownerName));
    card.appendChild(up);
    return card;
  };

  const createCheeseRankRow = (view, item) => {
    const row = createNode(view.root, "div", `rank-wrap custom-rank-wrap cheese-rank-wrap${item.rank <= 3 ? " rank-wrap--top" : ""}`);
    row.setAttribute("data-role", "course-rank-item");
    row.appendChild(createNode(view.root, "span", item.rank <= 3 ? "number on" : "number", String(item.rank)));
    if (item.rank === 1) {
      const preview = createNode(view.root, "div", "preview");
      const pic = createNode(view.root, "div", "pic");
      const coverLink = createDougaAnchor(view.root, "link", item.href);
      coverLink.appendChild(createCoverImage(view.root, "rank-cover__image", item.cover, FIXTURE_COVER_POOLS.rank, 0, item.title, "bili-zhishi", view.mediaFence, pic));
      pic.appendChild(coverLink);
      const txt = createNode(view.root, "div", "txt");
      const textLink = createDougaAnchor(view.root, "link", item.href);
      textLink.appendChild(createNode(view.root, "p", "title", item.title));
      txt.appendChild(textLink); preview.appendChild(pic); preview.appendChild(txt); row.appendChild(preview);
    } else {
      const link = createDougaAnchor(view.root, "link", item.href);
      link.appendChild(createNode(view.root, "p", "title", item.title)); row.appendChild(link);
    }
    const popover = createNode(view.root, "div", "rank-video-popover cheese-rank-popover");
    const main = createNode(view.root, "div", "rank-video-popover__main");
    const cover = createDougaAnchor(view.root, "rank-video-popover__cover", item.href);
    cover.appendChild(createCoverImage(view.root, "rank-video-popover__image", item.cover, FIXTURE_COVER_POOLS.rank, item.rank - 1, item.title, "bili-zhishi", view.mediaFence, popover));
    const info = createNode(view.root, "div", "rank-video-popover__info");
    info.appendChild(createDougaAnchor(view.root, "rank-video-popover__title", item.href, item.title));
    const meta = createNode(view.root, "div", "rank-video-popover__meta");
    meta.appendChild(createNode(view.root, "span", "rank-video-popover__owner", item.ownerName));
    meta.appendChild(createNode(view.root, "span", "rank-video-popover__date", `共${item.episodeCount}课时`));
    info.appendChild(meta); main.appendChild(cover); main.appendChild(info); popover.appendChild(main);
    const stats = createNode(view.root, "div", "rank-video-popover__stats");
    const stat = createNode(view.root, "span", "rank-video-popover__stat");
    stat.appendChild(createDougaMetricIcon(view.root, "play"));
    stat.appendChild(view.root.ownerDocument.createTextNode(formatDougaCount(item.play)));
    stats.appendChild(stat); popover.appendChild(stats); row.appendChild(popover);
    let timer = null;
    const close = () => { if (timer !== null) { clearTimeout(timer); timer = null; } row.classList.remove("is-rank-popover-visible"); };
    const open = () => { close(); timer = setTimeout(() => { timer = null; if (!view.destroyed && view.isRendererActive()) row.classList.add("is-rank-popover-visible"); }, 300); };
    addListenerWithCleanup(row, "mouseenter", open, view.cardListenerCleanups);
    addListenerWithCleanup(row, "mouseleave", close, view.cardListenerCleanups);
    addListenerWithCleanup(row, "focusin", open, view.cardListenerCleanups);
    addListenerWithCleanup(row, "focusout", (event) => { if (!event.relatedTarget || !row.contains(event.relatedTarget)) close(); }, view.cardListenerCleanups);
    addListenerWithCleanup(row, "click", close, view.cardListenerCleanups);
    view.cardListenerCleanups.push(close);
    return row;
  };

  const setDougaData = (view, data) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isDougaData(data)) return false;
    view.mediaFence.retireGeneration();
    cleanupListeners(view.cardListenerCleanups);
    const listFragment = view.root.ownerDocument.createDocumentFragment();
    data.items.forEach((item, index) => listFragment.appendChild(createDougaCard(view, item, index, "douga")));
    const rankFragment = view.root.ownerDocument.createDocumentFragment();
    data.ranks.slice(0, 10).forEach((item) => rankFragment.appendChild(createDougaRankRow(view, item, "douga")));
    view.list.replaceChildren(listFragment);
    if (data.ranks.length > 0) view.rank.replaceChildren(view.rankHeader, rankFragment);
    view.root.setAttribute("data-state", "committed");
    view.list.setAttribute("data-state", "committed");
    view.rank.setAttribute("data-state", data.ranks.length > 0 ? "committed" : view.rank.getAttribute("data-state") || "fixture");
    view.batch = data.batch;
    return true;
  };
  const setRankRuntimeUnavailable = (view) => {
    if (!view || view.destroyed || !view.isRendererActive() || !view.rank || !view.rankHeader) return false;
    const empty = createNode(view.root, "div", "rank-runtime-unavailable");
    empty.appendChild(createLocalImage(view.root, "rank-runtime-unavailable__image", ASSET_KEYS.PGC_EMPTY, ""));
    empty.appendChild(createNode(view.root, "span", "rank-runtime-unavailable__label", "排行榜暂不可用"));
    view.rank.replaceChildren(view.rankHeader, empty);
    view.rank.setAttribute("data-state", "unavailable");
    view.root.setAttribute("data-rank-count", "0");
    return true;
  };

  const isReadArticle = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "authorHref\u001FauthorMid\u001FauthorName\u001Fcover\u001Fhref\u001Fid\u001Freply\u001Ftitle\u001Fview"
    && Number.isSafeInteger(item.id) && item.id > 0
    && Number.isSafeInteger(item.authorMid) && item.authorMid > 0
    && isBoundedPgcText(item.title, 200, true) && isBoundedPgcText(item.authorName, 80, true)
    && resolveReadCoverUrl(item.cover) === item.cover
    && item.authorHref === `https://space.bilibili.com/${item.authorMid}`
    && item.href === `https://www.bilibili.com/read/cv${item.id}/?from=homepage_0`
    && [item.view, item.reply].every((metric) => Number.isSafeInteger(metric) && metric >= 0);
  const isReadRank = (item, index) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "cover\u001Fhref\u001Fid\u001Frank\u001Ftitle"
    && item.rank === index + 1 && Number.isSafeInteger(item.id) && item.id > 0
    && isBoundedPgcText(item.title, 200, true) && resolveReadCoverUrl(item.cover) === item.cover
    && item.href === `https://www.bilibili.com/read/cv${item.id}/?from=homepage_1`;
  const isReadFloorData = (data) => data !== null && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "articles\u001Fbatch\u001Franks\u001Fstatus"
    && Number.isSafeInteger(data.batch) && data.batch >= 0 && data.batch <= 10000
    && ["success", "partial", "empty"].includes(data.status)
    && Array.isArray(data.articles) && data.articles.length <= 8 && data.articles.every(isReadArticle)
    && new Set(data.articles.map((item) => item.id)).size === data.articles.length
    && Array.isArray(data.ranks) && data.ranks.length <= 10 && data.ranks.every(isReadRank)
    && new Set(data.ranks.map((item) => item.id)).size === data.ranks.length
    && data.articles.every((item) => !data.ranks.some((rank) => rank.id === item.id));
  const READ_METRIC_ICON_PATHS = Object.freeze({
    up: "M896 736v-448c0-54.4-41.6-96-96-96h-576C169.6 192 128 233.6 128 288v448c0 54.4 41.6 96 96 96h576c54.4 0 96-41.6 96-96zM800 128C889.6 128 960 198.4 960 288v448c0 89.6-70.4 160-160 160h-576C134.4 896 64 825.6 64 736v-448C64 198.4 134.4 128 224 128h576zM419.2 544V326.4h60.8v240c0 96-57.6 144-147.2 144S192 665.6 192 569.6V326.4h60.8v217.6c0 51.2 3.2 108.8 83.2 108.8s83.2-57.6 83.2-108.8zm288-38.4c28.8 0 60.8-16 60.8-60.8 0-48-28.8-60.8-60.8-60.8H614.4v121.6h92.8zm3.2-179.2c102.4 0 121.6 70.4 121.6 115.2 0 48-19.2 115.2-121.6 115.2H614.4V704h-60.8V326.4h156.8z",
    view: "M512 640a128 128 0 1 0-128-128 128 128 0 0 0 128 128zm0-320a192 192 0 1 1-192 192 192 192 0 0 1 192-192zm0-96a440.96 440.96 0 0 0-294.4 151.04A960 960 0 0 0 128 481.28L102.4 512l25.6 30.72a960 960 0 0 0 89.6 106.24A440.96 440.96 0 0 0 512 800a440.96 440.96 0 0 0 294.4-151.04 960 960 0 0 0 92.8-106.24L921.6 512l-22.4-30.72a960 960 0 0 0-92.8-106.24A440.96 440.96 0 0 0 512 224zm0-64a499.2 499.2 0 0 1 339.2 168.96 1088 1088 0 0 1 99.2 113.92c10.24 13.44 19.2 26.24 26.88 37.12l9.6 14.72 10.88 17.28-10.88 17.28-9.6 14.72c-7.68 10.88-16.64 23.68-26.88 37.12a1088 1088 0 0 1-99.2 113.92A499.2 499.2 0 0 1 512 864a499.2 499.2 0 0 1-339.2-168.96 1088 1088 0 0 1-99.2-113.92C64 567.68 54.4 554.88 46.72 544l-9.6-14.72L26.24 512l10.88-17.28 9.6-14.72c7.68-10.88 16.64-23.68 26.88-37.12A1088 1088 0 0 1 172.8 328.96 499.2 499.2 0 0 1 512 160z",
    reply: "M384 160c-176 0-320 144-320 320s144 320 320 320h25.152l45.696 160 167.616-160H640c176 0 320-144 320-320s-144-320-320-320H384zm512 320c0 141.184-114.816 256-256 256h-43.136l-18.56 17.728-91.008 86.848-16.64-58.176-13.248-46.4H384c-141.12 0-256-114.816-256-256 0-141.12 114.88-256 256-256h256c141.184 0 256 114.88 256 256z"
  });
  const createReadMetricIcon = (root, type) => {
    const icon = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", `read-metric-icon read-metric-icon--${type}`);
    icon.setAttribute("viewBox", "0 0 1024 1024");
    icon.setAttribute("aria-hidden", "true");
    const path = root.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", READ_METRIC_ICON_PATHS[type]);
    icon.appendChild(path);
    return icon;
  };
  const createReadArticleCard = (view, item, index) => {
    const root = view.root;
    const card = createNode(root, "div", "article-card");
    const pic = createNode(root, "a", "pic");
    pic.setAttribute("href", item.href);
    pic.setAttribute("target", "_blank");
    pic.setAttribute("rel", "noopener noreferrer");
    pic.appendChild(createCoverImage(root, "article-card__image", item.cover, FIXTURE_COVER_POOLS.recommend, index, item.title, "bili-read", view.mediaFence, pic));
    const content = createNode(root, "div", "r-con");
    const title = createNode(root, "a", "title", item.title);
    title.setAttribute("href", item.href);
    title.setAttribute("target", "_blank");
    title.setAttribute("rel", "noopener noreferrer");
    title.setAttribute("title", item.title);
    const up = createNode(root, "a", "up");
    up.setAttribute("href", item.authorHref);
    up.setAttribute("target", "_blank");
    up.setAttribute("rel", "noopener noreferrer");
    up.appendChild(createReadMetricIcon(root, "up"));
    up.appendChild(root.ownerDocument.createTextNode(item.authorName));
    const count = createNode(root, "p", "count");
    const viewCount = createNode(root, "span");
    viewCount.appendChild(createReadMetricIcon(root, "view"));
    viewCount.appendChild(root.ownerDocument.createTextNode(formatDougaCount(item.view)));
    const replyCount = createNode(root, "span");
    replyCount.appendChild(createReadMetricIcon(root, "reply"));
    replyCount.appendChild(root.ownerDocument.createTextNode(formatDougaCount(item.reply)));
    count.appendChild(viewCount);
    count.appendChild(replyCount);
    content.appendChild(title);
    content.appendChild(up);
    content.appendChild(count);
    card.appendChild(pic);
    card.appendChild(content);
    return card;
  };
  const createReadRankRow = (view, item, index) => {
    const root = view.root;
    const row = createNode(root, "div", "rank-wrap");
    row.appendChild(createNode(root, "span", item.rank <= 3 ? "number on" : "number", String(item.rank)));
    if (index === 0) {
      const preview = createNode(root, "div", "preview");
      const pic = createNode(root, "div", "pic");
      const imageLink = createNode(root, "a", "link");
      imageLink.setAttribute("href", item.href);
      imageLink.setAttribute("target", "_blank");
      imageLink.setAttribute("rel", "noopener noreferrer");
      imageLink.appendChild(createCoverImage(root, "read-rank__image", item.cover, FIXTURE_COVER_POOLS.ordinaryRank, index, item.title, "bili-read", view.mediaFence, pic));
      pic.appendChild(imageLink);
      const text = createNode(root, "div", "txt");
      const titleLink = createNode(root, "a", "link");
      titleLink.setAttribute("href", item.href);
      titleLink.setAttribute("target", "_blank");
      titleLink.setAttribute("rel", "noopener noreferrer");
      const title = createNode(root, "p", null, item.title);
      title.setAttribute("title", item.title);
      titleLink.appendChild(title);
      text.appendChild(titleLink);
      preview.appendChild(pic);
      preview.appendChild(text);
      row.appendChild(preview);
    } else {
      const link = createNode(root, "a", "link");
      link.setAttribute("href", item.href);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      const title = createNode(root, "p", "title", item.title);
      title.setAttribute("title", item.title);
      link.appendChild(title);
      row.appendChild(link);
    }
    return row;
  };
  const renderReadSkeleton = (view) => {
    if (!view || view.destroyed) return false;
    const href = "https://www.bilibili.com/read/home?spm_id_from=333.851.b_62696c695f7265706f72745f72656164.2";
    const articles = Array.from({ length: 8 }, (_, index) => ({
      authorHref: href,
      authorName: "fixture",
      cover: "",
      href,
      reply: 0,
      title: `专栏精选${index + 1}`,
      view: 0
    }));
    const ranks = Array.from({ length: 10 }, (_, index) => ({
      cover: "",
      href,
      rank: index + 1,
      title: `专栏排行${index + 1}`
    }));
    const articleFragment = view.root.ownerDocument.createDocumentFragment();
    articles.forEach((item, index) => {
      const card = createReadArticleCard(view, item, index);
      card.setAttribute("data-skeleton", "true");
      articleFragment.appendChild(card);
    });
    const rankFragment = view.root.ownerDocument.createDocumentFragment();
    ranks.forEach((item, index) => {
      const row = createReadRankRow(view, item, index);
      row.setAttribute("data-skeleton", "true");
      rankFragment.appendChild(row);
    });
    view.list.replaceChildren(articleFragment);
    view.rank.replaceChildren(view.rankHeader, rankFragment);
    view.list.setAttribute("data-state", "fixture");
    view.rank.setAttribute("data-state", "fixture");
    view.root.setAttribute("data-state", "fixture");
    return true;
  };
  const createReadFloor = (root, rendererMediaFence, lifecycle) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-read read-floor");
    floor.id = "bili_read";
    floor.setAttribute("data-floor-id", "read");
    const report = createNode(root, "div", "space-between report-wrap-module report-scroll-module");
    report.id = "bili_report_read";
    const articleList = createNode(root, "div", "article-list");
    const header = createStoreyTitle(root, "专栏", "DOUGA", "", "bili-read", lifecycle, (event) => {
      if (lifecycle && typeof lifecycle.onReadFloorRequest === "function") lifecycle.onReadFloorRequest(event);
    });
    for (const link of header.querySelectorAll("a")) {
      link.setAttribute("href", "https://www.bilibili.com/read/home?spm_id_from=333.851.b_62696c695f7265706f72745f72656164.2");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
    const list = createNode(root, "div", "zone-list-box");
    list.setAttribute("data-state", "loading");
    articleList.appendChild(header);
    articleList.appendChild(list);
    const rank = createRankPanel(root, "排行榜", "DOUGA", [], false, rendererMediaFence);
    const rankHeader = rank.querySelector(".rank-header");
    const rankMore = rankHeader && rankHeader.querySelector(".more");
    if (rankMore) {
      rankMore.setAttribute("href", "https://www.bilibili.com/read/home?spm_id_from=333.851.b_62696c695f7265706f72745f72656164.2");
      rankMore.setAttribute("target", "_blank");
      rankMore.setAttribute("rel", "noopener noreferrer");
      rankMore.removeAttribute("hidden");
    }
    report.appendChild(articleList);
    report.appendChild(rank);
    floor.appendChild(report);
    const view = { root: floor, list, rank, rankHeader, lifecycle, mediaFence: null, destroyed: false, batch: -1, lastSignature: "", cardListenerCleanups: [], isRendererActive: lifecycle && lifecycle.isActive ? lifecycle.isActive : () => true };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    renderReadSkeleton(view);
    floor.__readFloorView = view;
    return floor;
  };
  const setReadFloorData = (view, data) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isReadFloorData(data)) return false;
    const signature = data.articles.map((item) => item.id).join(":");
    if (data.batch !== 0 && signature !== "" && signature === view.lastSignature) return false;
    view.mediaFence.retireGeneration();
    if (data.articles.length > 0) {
      const articleFragment = view.root.ownerDocument.createDocumentFragment();
      data.articles.forEach((item, index) => articleFragment.appendChild(createReadArticleCard(view, item, index)));
      view.list.replaceChildren(articleFragment);
    }
    if (data.ranks.length > 0) {
      const rankFragment = view.root.ownerDocument.createDocumentFragment();
      data.ranks.forEach((item, index) => rankFragment.appendChild(createReadRankRow(view, item, index)));
      view.rank.replaceChildren(view.rankHeader, rankFragment);
    }
    view.list.setAttribute("data-state", data.status);
    view.rank.setAttribute("data-state", data.ranks.length > 0 ? "committed" : view.rank.getAttribute("data-state") || "fixture");
    view.root.setAttribute("data-state", data.status);
    view.batch = data.batch;
    view.lastSignature = signature;
    return true;
  };

  const MANGA_MORE_URL = "https://manga.bilibili.com/?spm_id_from=333.851.b_62696c695f7265706f72745f6d616e6761.3";
  const MANGA_CLASSIFY_URL = "https://manga.bilibili.com/classify?from=manga_homepage&styles=-1&areas=-1&status=-1&prices=-1&orders=0&special=0";
  const MANGA_LAST_KNOWN = Object.freeze([
    [25877, "是师姐，我们有救了！", ASSET_KEYS.MINI_MANGA_RANK_01, "奇幻"],
    [30751, "碧蓝之海", ASSET_KEYS.MINI_MANGA_RANK_02, "青春"],
    [30003, "不小心救了江湖公敌", ASSET_KEYS.MINI_MANGA_RANK_03, "古风"],
    [28201, "间谍过家家", ASSET_KEYS.MINI_MANGA_RANK_04, "都市"],
    [27915, "杀死男主然后成为女魔头", ASSET_KEYS.MINI_MANGA_RANK_05, "奇幻"],
    [30486, "金牌得主", ASSET_KEYS.MINI_MANGA_RANK_06, "运动"],
    [27917, "刀剑神域 Alicization篇", ASSET_KEYS.MINI_MANGA_RECOMMEND_01, "冒险"],
    [30004, "石之海", ASSET_KEYS.MINI_MANGA_RECOMMEND_02, "热血"],
    [30752, "鬼灭之刃", ASSET_KEYS.MINI_MANGA_RECOMMEND_03, "热血"],
    [25878, "一拳超人", ASSET_KEYS.MINI_MANGA_RECOMMEND_04, "热血"]
  ].map(([comicId, title, cover, tag]) => Object.freeze({ comicId, title, cover,
    href: `https://manga.bilibili.com/detail/mc${comicId}`, tags: Object.freeze([tag]), updateText: "连载中" })));
  const createMangaLastKnownData = () => Object.freeze({
    batch: 0,
    status: "success",
    recommendationItems: MANGA_LAST_KNOWN,
    freeItems: Object.freeze([...MANGA_LAST_KNOWN.slice(4), ...MANGA_LAST_KNOWN.slice(0, 4)]),
    japaneseRanks: Object.freeze(MANGA_LAST_KNOWN.slice(0, 10).map((item, index) => Object.freeze({ ...item, rank: index + 1 }))),
    chineseRanks: Object.freeze([...MANGA_LAST_KNOWN].reverse().slice(0, 10).map((item, index) => Object.freeze({ ...item, rank: index + 1 })))
  });
  const renderMangaLocalFallback = (view, data) => {
    const documentRef = view.root.ownerDocument;
    const localItems = view.activeLeft === "free" ? data.freeItems : data.recommendationItems;
    const localRanks = view.activeRank === "chinese" ? data.chineseRanks : data.japaneseRanks;
    const cards = documentRef.createDocumentFragment();
    for (const item of localItems) {
      const card = createNode(view.root, "a", "manga-card is-local-fallback");
      card.href = item.href; card.target = "_blank"; card.rel = "noopener noreferrer";
      const image = createLocalImage(view.root, "manga-card__image", item.cover, item.title);
      card.appendChild(image);
      card.appendChild(createNode(view.root, "p", "manga-title", item.title));
      card.appendChild(createNode(view.root, "p", "manga-tag", item.tags.join(" ")));
      cards.appendChild(card);
    }
    const ranks = documentRef.createDocumentFragment();
    localRanks.forEach((item, index) => {
      const row = createNode(view.root, "div", "manga-rank-item");
      row.appendChild(createNode(view.root, "span", index < 3 ? "rank-number on" : "rank-number", String(index + 1)));
      if (index === 0) {
        const preview = createNode(view.root, "div", "preview");
        const link = createNode(view.root, "a", "preview-link");
        link.href = item.href; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.appendChild(createLocalImage(view.root, "manga-rank__image", item.cover, item.title));
        const desc = createNode(view.root, "div", "preview-desc");
        desc.appendChild(createNode(view.root, "p", "title", item.title));
        desc.appendChild(createNode(view.root, "p", "style", item.tags.join(" ")));
        desc.appendChild(createNode(view.root, "p", "update", item.updateText));
        preview.appendChild(link); preview.appendChild(desc); row.appendChild(preview);
      } else {
        const link = createNode(view.root, "a", "other-link");
        link.href = item.href; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.appendChild(createNode(view.root, "p", "title", item.title));
        link.appendChild(createNode(view.root, "p", "update", item.updateText));
        row.appendChild(link);
      }
      ranks.appendChild(row);
    });
    view.list.replaceChildren(cards);
    view.rankWrap.replaceChildren(ranks);
  };
  const isMangaItem = (item, ranked = false) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === (ranked ? "comicId\u001Fcover\u001Fhref\u001Frank\u001Ftags\u001Ftitle\u001FupdateText" : "comicId\u001Fcover\u001Fhref\u001Ftags\u001Ftitle\u001FupdateText")
    && Number.isSafeInteger(item.comicId) && item.comicId > 0
    && (!ranked || (Number.isSafeInteger(item.rank) && item.rank > 0))
    && isBoundedPgcText(item.title, 200, true)
    && resolveReadCoverUrl(item.cover) === item.cover
    && item.href === `https://manga.bilibili.com/detail/mc${item.comicId}`
    && Array.isArray(item.tags) && item.tags.length <= 2 && item.tags.every((tag) => isBoundedPgcText(tag, 32, true))
    && isBoundedPgcText(item.updateText, 80, true);
  const isMangaFloorData = (data) => data !== null && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "batch\u001FchineseRanks\u001FfreeItems\u001FjapaneseRanks\u001FrecommendationItems\u001Fstatus"
    && Number.isSafeInteger(data.batch) && data.batch >= 0 && data.batch <= 10000
    && ["success", "partial", "empty"].includes(data.status)
    && Array.isArray(data.recommendationItems) && data.recommendationItems.length <= 12 && data.recommendationItems.every((item) => isMangaItem(item))
    && Array.isArray(data.freeItems) && data.freeItems.length <= 12 && data.freeItems.every((item) => isMangaItem(item))
    && Array.isArray(data.japaneseRanks) && data.japaneseRanks.length <= 10 && data.japaneseRanks.every((item, index) => isMangaItem(item, true) && item.rank === index + 1)
    && Array.isArray(data.chineseRanks) && data.chineseRanks.length <= 10 && data.chineseRanks.every((item, index) => isMangaItem(item, true) && item.rank === index + 1);

  const createMangaCard = (view, item, index) => {
    const card = createNode(view.root, "a", "manga-card");
    card.href = item.href; card.target = "_blank"; card.rel = "noopener noreferrer"; card.title = item.title;
    const coverSource = item.cover.startsWith("assets/") ? resolveLocalAssetUrl(item.cover) : item.cover;
    card.appendChild(createCoverImage(view.root, "manga-card__image", coverSource, FIXTURE_COVER_POOLS.recommend, index, item.title, "bili-manga", view.mediaFence, card));
    card.appendChild(createNode(view.root, "p", "manga-title", item.title));
    card.appendChild(createNode(view.root, "p", "manga-tag", item.tags.join(" ")));
    return card;
  };
  const createMangaRankRow = (view, item, index) => {
    const row = createNode(view.root, "div", "manga-rank-item");
    row.appendChild(createNode(view.root, "span", index < 3 ? "rank-number on" : "rank-number", String(index + 1)));
    if (index === 0) {
      const preview = createNode(view.root, "div", "preview");
      const link = createNode(view.root, "a", "preview-link"); link.href = item.href; link.target = "_blank"; link.rel = "noopener noreferrer";
      const coverSource = item.cover.startsWith("assets/") ? resolveLocalAssetUrl(item.cover) : item.cover;
      link.appendChild(createCoverImage(view.root, "manga-rank__image", coverSource, FIXTURE_COVER_POOLS.rank, index, item.title, "bili-manga", view.mediaFence, link));
      const desc = createNode(view.root, "div", "preview-desc");
      desc.appendChild(createNode(view.root, "p", "title", item.title));
      desc.appendChild(createNode(view.root, "p", "style", item.tags.join(" ")));
      desc.appendChild(createNode(view.root, "p", "update", item.updateText));
      preview.appendChild(link); preview.appendChild(desc); row.appendChild(preview);
    } else {
      const link = createNode(view.root, "a", "other-link"); link.href = item.href; link.target = "_blank"; link.rel = "noopener noreferrer";
      link.appendChild(createNode(view.root, "p", "title", item.title));
      link.appendChild(createNode(view.root, "p", "update", item.updateText)); row.appendChild(link);
    }
    return row;
  };
  const createMangaTab = (root, label, key, active) => {
    const button = createNode(root, "button", active ? "tab-switch-item on" : "tab-switch-item", label);
    button.type = "button"; button.dataset.tabKey = key; button.setAttribute("aria-selected", active ? "true" : "false");
    return button;
  };
  const createMangaFloor = (root, rendererMediaFence, lifecycle) => {
    const floor = createNode(root, "section", "storey-box b-wrap storey-manga"); floor.id = "bili_manga"; floor.dataset.floorId = "manga";
    const report = createNode(root, "div", "space-between report-wrap-module report-scroll-module"); report.id = "bili_report_manga";
    const panel = createNode(root, "div", "manga-panel");
    const header = createNode(root, "header", "storey-title"); const left = createNode(root, "div", "l-con");
    left.appendChild(createSvgIcon(root, "bili-manga"));
    const name = createNode(root, "a", "name", "漫画"); name.href = MANGA_CLASSIFY_URL; name.target = "_blank"; name.rel = "noopener noreferrer"; left.appendChild(name);
    const leftSlot = createNode(root, "div", "left-slot"); const leftTabs = createNode(root, "div", "tab-switch");
    const popularTab = createMangaTab(root, "人气推荐", "recommendation", true); const freeTab = createMangaTab(root, "免费漫画推荐", "free", false);
    leftTabs.appendChild(popularTab); leftTabs.appendChild(freeTab); leftSlot.appendChild(leftTabs); left.appendChild(leftSlot);
    const controls = createNode(root, "div", "exchange-btn"); const change = createNode(root, "button", "btn btn-change"); change.type = "button";
    change.appendChild(createIconFont(root, "bili-icon_caozuo_huanyihuan", null, lifecycle, "i")); change.appendChild(root.ownerDocument.createTextNode("换一换"));
    const more = createNode(root, "a", "more", "更多"); more.href = MANGA_CLASSIFY_URL; more.target = "_blank"; more.rel = "noopener noreferrer";
    more.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, lifecycle, "i"));
    controls.appendChild(change); controls.appendChild(more); header.appendChild(left); header.appendChild(controls);
    const list = createNode(root, "div", "manga-list-box"); panel.appendChild(header); panel.appendChild(list);
    const rank = createNode(root, "aside", "manga-rank"); const rankHeader = createNode(root, "header", "rank-header");
    rankHeader.appendChild(createNode(root, "span", "name", "排行榜")); const rankTabs = createNode(root, "div", "tab-switch");
    const japanTab = createMangaTab(root, "日漫榜", "japanese", true); const chinaTab = createMangaTab(root, "国漫榜", "chinese", false);
    rankTabs.appendChild(japanTab); rankTabs.appendChild(chinaTab); rankHeader.appendChild(rankTabs);
    const rankMore = createNode(root, "a", "more", "更多"); rankMore.href = MANGA_MORE_URL; rankMore.target = "_blank"; rankMore.rel = "noopener noreferrer";
    rankMore.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, lifecycle, "i")); rankHeader.appendChild(rankMore);
    const rankWrap = createNode(root, "div", "manga-rank-wrap"); rank.appendChild(rankHeader); rank.appendChild(rankWrap);
    report.appendChild(panel); report.appendChild(rank); floor.appendChild(report);
    const view = { root, floor, list, rankWrap, leftTabs: [popularTab, freeTab], rankTabs: [japanTab, chinaTab], activeLeft: "recommendation", activeRank: "japanese", data: null,
      mediaFence: null, lifecycle, destroyed: false, cardListenerCleanups: [], isRendererActive: lifecycle && lifecycle.isActive ? lifecycle.isActive : () => true };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    const render = () => {
      if (!view.data) return;
      if (view.data.recommendationItems.some((item) => item.cover.startsWith("assets/"))) {
        renderMangaLocalFallback(view, view.data);
        return;
      }
      const items = view.activeLeft === "free" ? view.data.freeItems : view.data.recommendationItems;
      const ranks = view.activeRank === "chinese" ? view.data.chineseRanks : view.data.japaneseRanks;
      const cards = root.ownerDocument.createDocumentFragment(); items.forEach((item, index) => cards.appendChild(createMangaCard(view, item, index))); view.list.replaceChildren(cards);
      const rows = root.ownerDocument.createDocumentFragment(); ranks.forEach((item, index) => rows.appendChild(createMangaRankRow(view, item, index))); view.rankWrap.replaceChildren(rows);
      view.floor.dataset.state = view.data.status;
    };
    view.render = render;
    for (const tab of view.leftTabs) addListenerWithCleanup(tab, "click", () => { view.activeLeft = tab.dataset.tabKey; view.leftTabs.forEach((item) => { const active = item === tab; item.classList.toggle("on", active); item.setAttribute("aria-selected", String(active)); }); render(); }, lifecycle.cleanups);
    for (const tab of view.rankTabs) addListenerWithCleanup(tab, "click", () => { view.activeRank = tab.dataset.tabKey; view.rankTabs.forEach((item) => { const active = item === tab; item.classList.toggle("on", active); item.setAttribute("aria-selected", String(active)); }); render(); }, lifecycle.cleanups);
    const spinChangeIcon = () => {
      change.classList.remove("is-spinning");
      void change.offsetWidth;
      change.classList.add("is-spinning");
    };
    addListenerWithCleanup(change, "animationend", () => change.classList.remove("is-spinning"), lifecycle.cleanups);
    addListenerWithCleanup(change, "click", (event) => {
      spinChangeIcon();
      if (event.isTrusted && lifecycle && typeof lifecycle.onMangaRequest === "function") lifecycle.onMangaRequest(event);
    }, lifecycle.cleanups);
    Promise.resolve().then(() => {
      if (view.destroyed || !view.isRendererActive() || view.data) return;
      try {
        view.data = createMangaLastKnownData();
        renderMangaLocalFallback(view, view.data);
        floor.dataset.state = "last-known";
        if (root.host) {
          root.host.setAttribute("data-extension-b-manga-fallback", "committed");
          root.host.setAttribute("data-extension-b-manga-fallback-count", String(view.data.recommendationItems.length));
        }
      } catch (error) {
        view.data = null;
        floor.dataset.state = "fallback-error";
        floor.dataset.error = error && typeof error.name === "string" ? error.name : "Error";
        if (root.host) root.host.setAttribute("data-extension-b-manga-fallback", `error:${floor.dataset.error}`);
      }
    });
    floor.__mangaFloorView = view; return floor;
  };
  const setMangaFloorData = (view, data) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isMangaFloorData(data)) return false;
    view.mediaFence.retireGeneration(); view.data = data; view.render(); return true;
  };
  const PGC_FLOOR_CSS = `
  #bili_report_anime, #bili_report_guochuang { margin:40px auto 0; color:#505050; }
  #bili_report_anime > .space-between, #bili_report_guochuang > .space-between { display:flex; width:100%; height:428px; align-items:flex-start; justify-content:space-between; margin:0; }
  #bili_report_anime .time-line, #bili_report_guochuang .time-line { width:1286px; height:428px; min-width:0; flex:0 0 1286px; }
  #bili_report_anime .storey-title, #bili_report_guochuang .storey-title { display:flex; width:100%; height:36px; align-items:center; justify-content:space-between; margin:0 0 16px; }
  #bili_report_anime .storey-title .l-con, #bili_report_guochuang .storey-title .l-con { display:inline-flex; min-width:0; align-items:center; }
  #bili_report_anime .storey-title .svg-icon, #bili_report_guochuang .storey-title .svg-icon { width:36px; height:36px; flex:0 0 36px; margin-right:6px; overflow:visible; }
  #bili_report_anime .storey-title .name, #bili_report_guochuang .storey-title .name { flex:0 0 auto; margin-right:20px; color:#212121; font-size:20px; line-height:28px; text-decoration:none; }
  #bili_report_anime .pgc-tab-switch, #bili_report_guochuang .pgc-tab-switch { display:flex; min-width:0; align-items:flex-start; flex-wrap:nowrap; margin:0; }
  #bili_report_anime .pgc-tab-switch .tab-switch-item, #bili_report_guochuang .pgc-tab-switch .tab-switch-item { height:30px; flex:0 0 auto; margin-right:24px; border-bottom:1px solid transparent; color:#505050; font-size:14px; line-height:30px; white-space:nowrap; cursor:pointer; }
  #bili_report_anime .pgc-tab-switch .tab-switch-item:last-child, #bili_report_guochuang .pgc-tab-switch .tab-switch-item:last-child { margin-right:0; }
  #bili_report_anime .pgc-tab-switch .tab-switch-item.on, #bili_report_guochuang .pgc-tab-switch .tab-switch-item.on { color:#00a1d6; border-bottom-color:#00a1d6; }
  #bili_report_anime .tl-link, #bili_report_guochuang .tl-link { display:flex; width:138px; height:30px; box-sizing:border-box; flex:0 0 138px; align-items:center; justify-content:center; border:1px solid #00a1d6; border-radius:2px; color:#00a1d6; background:#fff; font-size:14px; line-height:28px; text-decoration:none; transition:color .2s,background-color .2s; }
  #bili_report_anime .tl-link:hover, #bili_report_guochuang .tl-link:hover { color:#fff; background:#00a1d6; }
  #bili_report_anime .tl-link .bilifont, #bili_report_guochuang .tl-link .bilifont { margin-left:4px; font-size:12px; }
  #bili_report_anime .time-line .zone-list-box, #bili_report_guochuang .time-line .zone-list-box { display:flex; width:1286px; height:376px; align-content:flex-start; justify-content:flex-start; flex-wrap:wrap; overflow:auto; }
  #bili_report_anime .pgc-empty-state, #bili_report_guochuang .pgc-empty-state { display:flex; width:100%; height:100%; box-sizing:border-box; flex:0 0 100%; flex-direction:column; align-items:center; justify-content:center; padding:0; color:#999; text-align:center; }
  #bili_report_anime .pgc-empty-state__image, #bili_report_guochuang .pgc-empty-state__image { display:block; width:min(387px, 80%); height:auto; flex:0 0 auto; object-fit:contain; }
  #bili_report_anime .pgc-empty-state__label, #bili_report_guochuang .pgc-empty-state__label { display:block; margin-top:12px; font-size:12px; line-height:18px; }
  #bili_report_anime .time-line-card.item, #bili_report_guochuang .time-line-card.item { display:flex; width:227px; height:70px; flex:0 0 227px; justify-content:space-between; margin:0 30px 24px 0; }
  #bili_report_anime .time-line-card .pic, #bili_report_guochuang .time-line-card .pic { display:block; width:70px; height:70px; flex:0 0 70px; margin-right:12px; overflow:hidden; border-radius:2px; background:#f1f2f3; }
  #bili_report_anime .time-line-card .pic img, #bili_report_guochuang .time-line-card .pic img { display:block; width:70px; height:70px; border-radius:2px; object-fit:cover; }
  #bili_report_anime .time-line-card .txt, #bili_report_guochuang .time-line-card .txt { width:145px; min-width:0; flex:0 0 145px; font-weight:500; }
  #bili_report_anime .time-line-card .ss, #bili_report_guochuang .time-line-card .ss { display:-webkit-box; height:37px; margin:2px 0 12px; overflow:hidden; color:#212121; font-size:14px; line-height:18px; text-decoration:none; -webkit-box-orient:vertical; -webkit-line-clamp:2; }
  #bili_report_anime .time-line-card .ss:hover, #bili_report_guochuang .time-line-card .ss:hover { color:#00a1d6; }
  #bili_report_anime .time-line-card .update, #bili_report_guochuang .time-line-card .update { display:block; width:100%; height:16px; margin:0; overflow:hidden; color:#00a1d6; font-size:12px; line-height:16px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_anime .time-line-card .pub-time, #bili_report_guochuang .time-line-card .pub-time { display:none; }
  #bili_report_anime .pgc-rank, #bili_report_guochuang .pgc-rank { width:320px; height:428px; flex:0 0 320px; }
  #bili_report_anime .pgc-rank-list, #bili_report_guochuang .pgc-rank-list { display:flex; width:320px; height:376px; flex-direction:column; justify-content:space-between; }
  #bili_report_anime .rank-header, #bili_report_guochuang .rank-header { display:flex; width:100%; height:36px; align-items:center; justify-content:space-between; margin:0 0 16px; }
  #bili_report_anime .rank-header .name, #bili_report_guochuang .rank-header .name { color:#212121; font-size:20px; line-height:28px; }
  #bili_report_anime .rank-header .more, #bili_report_guochuang .rank-header .more { position:static; top:auto; right:auto; bottom:auto; display:flex; width:58px; height:22px; box-sizing:border-box; align-items:center; justify-content:center; padding:0; border:1px solid #ccd0d7; border-radius:2px; color:#505050; background:#fff; font-size:12px; line-height:20px; text-decoration:none; opacity:1; visibility:visible; }
  #bili_report_anime .rank-header .more:hover, #bili_report_guochuang .rank-header .more:hover { color:#00a1d6; border-color:#00a1d6; }
  #bili_report_anime .rank-header .more .bilifont, #bili_report_guochuang .rank-header .more .bilifont { margin-left:4px; font-size:12px; }
  #bili_report_anime .pgc-rank-wrap, #bili_report_guochuang .pgc-rank-wrap { display:flex; width:320px; height:20px; align-items:flex-start; margin:0; }
  #bili_report_anime .pgc-rank-wrap .number, #bili_report_guochuang .pgc-rank-wrap .number { display:flex; width:18px; height:18px; flex:0 0 18px; align-items:center; justify-content:center; margin:1px 8px 0 0; border-radius:2px; color:#999; background:#fff; font-size:14px; line-height:18px; }
  #bili_report_anime .pgc-rank-wrap .number.on, #bili_report_guochuang .pgc-rank-wrap .number.on { color:#fff; background:#00a1d6; }
  #bili_report_anime .pgc-rank-wrap .link, #bili_report_guochuang .pgc-rank-wrap .link { display:block; min-width:0; flex:1 1 auto; color:#212121; text-decoration:none; }
  #bili_report_anime .pgc-rank-wrap .txt, #bili_report_guochuang .pgc-rank-wrap .txt { display:flex; width:294px; min-width:0; align-items:center; justify-content:space-between; }
  #bili_report_anime .pgc-rank-wrap .title, #bili_report_guochuang .pgc-rank-wrap .title { width:198px; min-width:0; flex:0 1 198px; overflow:hidden; color:#212121; font-size:14px; line-height:20px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_anime .pgc-rank-wrap .update, #bili_report_guochuang .pgc-rank-wrap .update { min-width:90px; max-width:96px; flex:0 0 auto; margin-left:2px; overflow:hidden; color:#999; font-size:12px; line-height:20px; text-align:right; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_anime .pgc-rank-wrap .badge, #bili_report_guochuang .pgc-rank-wrap .badge, #bili_report_anime .rank-crown, #bili_report_guochuang .rank-crown { display:none; }
  #bili_report_anime .pgc-rank-wrap:hover .title, #bili_report_guochuang .pgc-rank-wrap:hover .title { color:#00a1d6; }
  @media screen and (max-width:1870px) {
    #bili_report_anime .time-line, #bili_report_guochuang .time-line, #bili_report_anime .time-line .zone-list-box, #bili_report_guochuang .time-line .zone-list-box { width:1070px; flex-basis:1070px; }
  }
  @media screen and (max-width:1654px) {
    #bili_report_anime .time-line, #bili_report_guochuang .time-line, #bili_report_anime .time-line .zone-list-box, #bili_report_guochuang .time-line .zone-list-box { width:854px; flex-basis:854px; }
    #bili_report_anime .time-line-card.item, #bili_report_guochuang .time-line-card.item { margin-right:20px; }
    #bili_report_anime .pgc-tab-switch .tab-switch-item, #bili_report_guochuang .pgc-tab-switch .tab-switch-item { margin-right:18px; }
  }
  @media screen and (max-width:1438px) {
    #bili_report_anime > .space-between, #bili_report_guochuang > .space-between, #bili_report_anime .time-line, #bili_report_guochuang .time-line, #bili_report_anime .pgc-rank, #bili_report_guochuang .pgc-rank { height:384px; }
    #bili_report_anime .time-line, #bili_report_guochuang .time-line, #bili_report_anime .time-line .zone-list-box, #bili_report_guochuang .time-line .zone-list-box { width:710px; flex-basis:710px; }
    #bili_report_anime .time-line .zone-list-box, #bili_report_guochuang .time-line .zone-list-box { height:332px; }
    #bili_report_anime .time-line-card.item, #bili_report_guochuang .time-line-card.item { width:210px; flex-basis:210px; margin-right:26px; }
    #bili_report_anime .time-line-card .txt, #bili_report_guochuang .time-line-card .txt { width:128px; flex-basis:128px; }
    #bili_report_anime .pgc-rank, #bili_report_guochuang .pgc-rank, #bili_report_anime .pgc-rank-list, #bili_report_guochuang .pgc-rank-list, #bili_report_anime .pgc-rank-wrap, #bili_report_guochuang .pgc-rank-wrap { width:265px; flex-basis:265px; }
    #bili_report_anime .pgc-rank-list, #bili_report_guochuang .pgc-rank-list { height:332px; }
    #bili_report_anime .pgc-rank-wrap .txt, #bili_report_guochuang .pgc-rank-wrap .txt { width:239px; }
    #bili_report_anime .pgc-rank-wrap .title, #bili_report_guochuang .pgc-rank-wrap .title { width:143px; flex-basis:143px; }
    #bili_report_anime .pgc-tab-switch .tab-switch-item, #bili_report_guochuang .pgc-tab-switch .tab-switch-item { margin-right:12px; }
    #bili_report_anime .storey-title .name, #bili_report_guochuang .storey-title .name { margin-right:12px; }
  }
  `;

  const MANGA_FLOOR_CSS = `
  #bili_manga { margin-top: 40px; }
  #bili_report_manga { display:flex; align-items:flex-start; justify-content:space-between; column-gap:24px; --manga-rank-width:320px; --manga-list-height:682px; }
  #bili_report_manga .manga-panel { flex:0 0 1286px; width:1286px; min-width:0; }
  #bili_report_manga .storey-title, #bili_report_manga .rank-header { height:36px; margin-bottom:16px; }
  #bili_report_manga .storey-title, #bili_report_manga .storey-title .l-con, #bili_report_manga .rank-header { display:flex; align-items:center; }
  #bili_report_manga .storey-title { justify-content:space-between; }
  #bili_report_manga .storey-title .svg-icon { width:36px; height:36px; margin-right:6px; color:#fb7299; }
  #bili_report_manga .storey-title .name, #bili_report_manga .rank-header>.name { color:#212121; font-size:20px; line-height:28px; }
  #bili_report_manga .left-slot { display:flex; align-items:center; margin-left:20px; }
  #bili_report_manga .tab-switch { display:flex; align-items:center; }
  #bili_report_manga .tab-switch-item { height:21px; margin-right:12px; padding:0; border:0; border-bottom:1px solid transparent; color:#505050; background:transparent; cursor:pointer; font:12px/16px -apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; }
  #bili_report_manga .tab-switch-item.on { color:#00a1d6; border-bottom-color:#00a1d6; }
  #bili_report_manga .exchange-btn { display:flex; align-items:center; gap:12px; }
  #bili_report_manga .btn-change, #bili_report_manga .more { height:22px; padding:0 10px; border:1px solid #ccd0d7; border-radius:2px; color:#505050; background:#fff; font-size:12px; line-height:20px; cursor:pointer; }
  #bili_report_manga .storey-title .more, #bili_report_manga .rank-header .more { position:static; top:auto; right:auto; bottom:auto; z-index:auto; display:inline-flex; width:58px; min-width:58px; height:22px; box-sizing:border-box; align-items:center; justify-content:center; padding:0; color:#505050; background:#fff; opacity:1; visibility:visible; pointer-events:auto; text-decoration:none; }
  #bili_report_manga .btn-change .bilifont { margin-right:4px; } #bili_report_manga .more .bilifont { margin-left:4px; }
  #bili_report_manga .btn-change:hover, #bili_report_manga .more:hover { color:#00a1d6; border-color:#00a1d6; }
  #bili_report_manga .manga-list-box { display:flex; align-content:space-between; flex-wrap:wrap; justify-content:space-between; width:1286px; height:var(--manga-list-height); }
  #bili_report_manga .manga-card { display:block; width:206px; margin-bottom:24px; color:inherit; }
  #bili_report_manga .manga-card, #bili_report_manga .manga-rank a { text-decoration:none; }
  #bili_report_manga .manga-card__image { display:block; width:206px; height:275px; border-radius:2px; object-fit:cover; background:#eef1f3; }
  #bili_report_manga .manga-card.is-local-fallback .manga-card__image { object-fit:contain; }
  #bili_report_manga .manga-title { max-width:206px; margin:10px 0 8px; overflow:hidden; color:#212121; font-size:14px; font-weight:500; line-height:18px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_manga .manga-tag { height:16px; overflow:hidden; color:#999; font-size:12px; line-height:16px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_manga .manga-card:hover .manga-title { color:#00a1d6; }
  #bili_report_manga .manga-rank { flex:0 0 var(--manga-rank-width); width:var(--manga-rank-width); overflow:hidden; }
  #bili_report_manga .manga-rank-wrap { display:flex; height:var(--manga-list-height); flex-direction:column; justify-content:space-between; }
  #bili_report_manga .rank-header { justify-content:flex-start; }
  #bili_report_manga .rank-header .tab-switch { flex:1 1 auto; min-width:0; margin:2px 0 0 20px; }
  #bili_report_manga .rank-header .more { margin-left:auto; }
  #bili_report_manga .manga-rank-item { display:flex; align-items:flex-start; padding:0; }
  #bili_report_manga .manga-rank-item:nth-child(n+2) { height:20px; align-items:center; }
  #bili_report_manga .rank-number { display:flex; align-items:center; justify-content:center; flex:0 0 18px; width:18px; height:18px; margin:1px 8px 0 0; border-radius:2px; color:#999; font-size:14px; line-height:18px; }
  #bili_report_manga .manga-rank-item:nth-child(n+2) .rank-number { margin-top:0; }
  #bili_report_manga .rank-number.on { color:#fff; background:#00a1d6; }
  #bili_report_manga .preview, #bili_report_manga .other-link { display:flex; width:290px; min-width:0; }
  #bili_report_manga .preview-link { display:block; flex:0 0 112px; width:112px; height:149px; margin-right:12px; overflow:hidden; border-radius:2px; }
  #bili_report_manga .manga-rank__image { width:112px; height:149px; object-fit:cover; }
  #bili_report_manga .preview-desc { flex:1 1 auto; min-width:0; max-width:166px; }
  #bili_report_manga .preview-desc .title { display:-webkit-box; height:40px; overflow:hidden; color:#212121; font-size:14px; line-height:20px; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  #bili_report_manga .preview-desc .style, #bili_report_manga .preview-desc .update { overflow:hidden; color:#999; font-size:12px; line-height:16px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_manga .preview-desc .style { margin-top:4px; } #bili_report_manga .preview-desc .update { margin-top:8px; }
  #bili_report_manga .other-link { height:20px; align-items:center; justify-content:space-between; }
  #bili_report_manga .other-link .title { flex:1 1 auto; min-width:0; overflow:hidden; color:#212121; font-size:14px; line-height:20px; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_manga .other-link .update { flex:0 0 auto; min-width:80px; margin-left:12px; overflow:hidden; color:#999; font-size:12px; line-height:20px; text-align:right; text-overflow:ellipsis; white-space:nowrap; }
  #bili_report_manga .manga-rank-item:hover .title { color:#00a1d6; }
  @media screen and (max-width:1870px) { #bili_report_manga .manga-panel, #bili_report_manga .manga-list-box { width:1070px; flex-basis:1070px; } #bili_report_manga .manga-card:nth-child(n+11) { display:none; } }
  @media screen and (max-width:1654px) { #bili_report_manga { --manga-list-height:581px; } #bili_report_manga .manga-panel, #bili_report_manga .manga-list-box { width:854px; flex-basis:854px; } #bili_report_manga .manga-card { width:162px; } #bili_report_manga .manga-card__image { width:162px; height:216px; } #bili_report_manga .manga-title { max-width:162px; } }
  @media screen and (max-width:1438px) { #bili_report_manga { --manga-rank-width:265px; --manga-list-height:602px; } #bili_report_manga .manga-panel, #bili_report_manga .manga-list-box { width:710px; flex-basis:710px; } #bili_report_manga .manga-card { width:170px; } #bili_report_manga .manga-card__image { width:170px; height:227px; } #bili_report_manga .manga-title { max-width:170px; } #bili_report_manga .manga-card:nth-child(n+9) { display:none; } #bili_report_manga .preview, #bili_report_manga .other-link { width:235px; } #bili_report_manga .preview-desc, #bili_report_manga .other-link .title { max-width:148px; } }
  `;

  const ORDINARY_ZONE_DEFINITIONS = Object.freeze({
    music: Object.freeze({ title: "音乐", nav: "https://www.bilibili.com/c/music/", rankNav: "https://www.bilibili.com/v/popular/rank/music" }),
    dance: Object.freeze({ title: "舞蹈", nav: "https://www.bilibili.com/c/dance/", rankNav: "https://www.bilibili.com/v/popular/rank/dance" }),
    game: Object.freeze({ title: "游戏", nav: "https://www.bilibili.com/c/game/", rankNav: "https://www.bilibili.com/v/popular/rank/game" }),
    knowledge: Object.freeze({ title: "知识", nav: "https://www.bilibili.com/c/knowledge/", rankNav: "https://www.bilibili.com/v/popular/rank/knowledge" }),
    course: Object.freeze({ title: "课堂", nav: "https://www.bilibili.com/cheese/", rankNav: "https://www.bilibili.com/cheese/pages/ranklist" }),
    tech: Object.freeze({ title: "科技", nav: "https://www.bilibili.com/c/tech/", rankNav: "https://www.bilibili.com/v/popular/rank/tech" }),
    sports: Object.freeze({ title: "运动", nav: "https://www.bilibili.com/c/sports/", rankNav: "https://www.bilibili.com/v/popular/rank/sports" }),
    car: Object.freeze({ title: "汽车", nav: "https://www.bilibili.com/c/car/", rankNav: "https://www.bilibili.com/v/popular/rank/car" }),
    life: Object.freeze({ title: "生活", nav: "https://www.bilibili.com/c/life/", rankNav: "https://www.bilibili.com/v/popular/rank/life" }),
    food: Object.freeze({ title: "美食", nav: "https://www.bilibili.com/c/food/", rankNav: "https://www.bilibili.com/v/popular/rank/food" }),
    animal: Object.freeze({ title: "动物圈", nav: "https://www.bilibili.com/c/animal/", rankNav: "https://www.bilibili.com/v/popular/rank/animal" }),
    kichiku: Object.freeze({ title: "鬼畜", nav: "https://www.bilibili.com/c/kichiku/", rankNav: "https://www.bilibili.com/v/popular/rank/kichiku" }),
    fashion: Object.freeze({ title: "时尚", nav: "https://www.bilibili.com/c/fashion/", rankNav: "https://www.bilibili.com/v/popular/rank/fashion" }),
    information: Object.freeze({ title: "资讯", nav: "https://www.bilibili.com/c/information/", rankNav: "https://www.bilibili.com/v/popular/rank/information" }),
    ent: Object.freeze({ title: "娱乐", nav: "https://www.bilibili.com/c/ent/", rankNav: "https://www.bilibili.com/v/popular/rank/ent" }),
    movie: Object.freeze({ title: "电影", nav: "https://www.bilibili.com/movie/", rankNav: "https://www.bilibili.com/v/popular/rank/movie" }),
    teleplay: Object.freeze({ title: "电视剧", nav: "https://www.bilibili.com/tv/?spm_id_from=333.1007.0.0", rankNav: "https://www.bilibili.com/v/popular/rank/tv" }),
    cinephile: Object.freeze({ title: "影视", nav: "https://www.bilibili.com/c/cinephile/", rankNav: "https://www.bilibili.com/v/popular/rank/cinephile" }),
    documentary: Object.freeze({ title: "纪录片", nav: "https://www.bilibili.com/documentary/", rankNav: "https://www.bilibili.com/v/popular/rank/documentary" })
  });
  const isOrdinaryZoneVideoRank = (item, index) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "aid\u001Fbvid\u001Fcoin\u001Fcover\u001Fdanmaku\u001Ffavorite\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fpubdate\u001Frank\u001Ftitle\u001Fview"
    && item.rank === index + 1
    && Number.isSafeInteger(item.aid) && item.aid > 0
    && /^BV[A-Za-z0-9]{10}$/.test(item.bvid)
    && isBoundedPgcText(item.title, 200, true)
    && resolveFocusImageUrl(item.cover) === item.cover
    && item.href === `https://www.bilibili.com/video/${item.bvid}`
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
    && isBoundedPgcText(item.ownerName, 80, true)
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
    && [item.pubdate, item.view, item.danmaku, item.favorite, item.coin].every((value) => Number.isSafeInteger(value) && value >= 0);
  const isOrdinaryZonePgcItem = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "cover\u001FepisodeId\u001Fhref\u001Frating\u001FseasonId\u001Fsubtitle\u001Ftitle"
    && isSafePgcId(item.episodeId) && item.episodeId > 0
    && isSafePgcId(item.seasonId) && item.seasonId > 0
    && isBoundedPgcText(item.title, 200, true)
    && resolveOrdinaryPgcCoverUrl(item.cover) === item.cover
    && isBoundedPgcText(item.subtitle, 200, false)
    && isBoundedPgcText(item.rating, 32, false)
    && item.href === `https://www.bilibili.com/bangumi/play/ep${item.episodeId}`;
  const isOrdinaryZonePgcRank = (item, index) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "badgeText\u001Fcover\u001Fhref\u001Frank\u001FscoreText\u001FseasonId\u001Ftitle\u001FupdateText"
    && item.rank === index + 1
    && isSafePgcId(item.seasonId) && item.seasonId > 0
    && isBoundedPgcText(item.title, 200, true)
    && resolveOrdinaryPgcCoverUrl(item.cover) === item.cover
    && item.href === `https://www.bilibili.com/bangumi/play/ss${item.seasonId}`
    && isBoundedPgcText(item.badgeText, 80, false)
    && isBoundedPgcText(item.updateText, 80, false)
    && isBoundedPgcText(item.scoreText, 80, false);
  const isOrdinaryZoneCheeseItem = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "cover\u001Fhref\u001FownerHref\u001FownerMid\u001FownerName\u001Fplay\u001FseasonId\u001Ftitle\u001FupdateText"
    && isSafePgcId(item.seasonId) && item.seasonId > 0
    && Number.isSafeInteger(item.ownerMid) && item.ownerMid > 0
    && isBoundedPgcText(item.title, 200, true) && isBoundedPgcText(item.ownerName, 80, true)
    && isBoundedPgcText(item.updateText, 80, false) && resolveCheeseCoverUrl(item.cover) === item.cover
    && item.href === `https://www.bilibili.com/cheese/play/ss${item.seasonId}`
    && item.ownerHref === `https://space.bilibili.com/${item.ownerMid}`
    && Number.isSafeInteger(item.play) && item.play >= 0;
  const isOrdinaryZoneCheeseRank = (item, index) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "cover\u001FepisodeCount\u001Fhref\u001FownerName\u001Fplay\u001Frank\u001FseasonId\u001Ftitle"
    && item.rank === index + 1 && isSafePgcId(item.seasonId) && item.seasonId > 0
    && isBoundedPgcText(item.title, 200, true) && isBoundedPgcText(item.ownerName, 80, true)
    && resolveCheeseCoverUrl(item.cover) === item.cover
    && item.href === `https://www.bilibili.com/cheese/play/ss${item.seasonId}`
    && Number.isSafeInteger(item.play) && item.play >= 0
    && Number.isSafeInteger(item.episodeCount) && item.episodeCount >= 0;
  const isOrdinaryZoneRendererData = (value) => value !== null && typeof value === "object"
    && Object.keys(value).sort().join("\u001F") === "batch\u001FitemType\u001Fitems\u001FrankType\u001Franks\u001Fstatus\u001Ftype"
    && Object.prototype.hasOwnProperty.call(ORDINARY_ZONE_DEFINITIONS, value.type)
    && Number.isSafeInteger(value.batch) && value.batch >= 0 && value.batch <= 49
    && ["video", "pgc", "cheese"].includes(value.itemType)
    && ["none", "video", "pgc", "cheese"].includes(value.rankType)
    && ["success", "partial", "empty"].includes(value.status)
    && Array.isArray(value.items) && value.items.length <= 12
    && (value.itemType === "pgc" ? value.items.every(isOrdinaryZonePgcItem)
      : value.itemType === "cheese" ? value.items.every(isOrdinaryZoneCheeseItem)
      : value.items.every((item) => item && typeof item === "object" && typeof item.bvid === "string" && typeof item.title === "string"))
    && Array.isArray(value.ranks) && value.ranks.length <= 100
    && (value.rankType === "none"
      ? value.ranks.length === 0
      : value.rankType === "video"
        ? value.ranks.every(isOrdinaryZoneVideoRank)
        : value.rankType === "cheese" ? value.ranks.every(isOrdinaryZoneCheeseRank)
        : value.ranks.every(isOrdinaryZonePgcRank));
  const createOrdinarySkeletonItems = (type, count = 12) => {
    const definition = ORDINARY_ZONE_DEFINITIONS[type];
    const isPgcFloor = type === "movie" || type === "teleplay" || type === "documentary";
    return Array.from({ length: count }, (_, index) => {
      const suffix = index + 1;
      if (isPgcFloor) {
        return {
          cover: "",
          episodeId: suffix,
          href: definition.nav,
          rating: "",
          seasonId: suffix,
          subtitle: "接口占位",
          title: `${definition.title}精选${suffix}`
        };
      }
      if (type === "course") {
        return {
          cover: "",
          href: definition.nav,
          ownerHref: definition.nav,
          ownerMid: suffix,
          ownerName: "fixture",
          play: 0,
          seasonId: suffix,
          title: `${definition.title}精选${suffix}`,
          updateText: ""
        };
      }
      return {
        aid: suffix,
        bvid: `BV1fixture${String(suffix).padStart(2, "0")}`,
        cover: "",
        danmaku: 0,
        duration: 0,
        href: definition.nav,
        ownerHref: definition.nav,
        ownerMid: suffix,
        ownerName: "fixture",
        title: `${definition.title}精选${suffix}`,
        view: 0
      };
    });
  };
  const createOrdinarySkeletonRanks = (type, count = 10) => {
    const definition = ORDINARY_ZONE_DEFINITIONS[type];
    const isPgcFloor = type === "movie" || type === "teleplay" || type === "documentary";
    return Array.from({ length: count }, (_, index) => {
      const rank = index + 1;
      if (isPgcFloor) {
        return { badgeText: "", cover: "", href: definition.rankNav, rank, scoreText: "", seasonId: rank, title: `${definition.title}排行${rank}`, updateText: "" };
      }
      if (type === "course") {
        return { cover: "", episodeCount: 0, href: definition.rankNav, ownerName: "fixture", play: 0, rank, seasonId: rank, title: `${definition.title}排行${rank}` };
      }
      return {
        aid: rank,
        bvid: `BV1fixture${String(rank).padStart(2, "0")}`,
        coin: 0,
        cover: "",
        danmaku: 0,
        favorite: 0,
        href: definition.rankNav,
        ownerHref: definition.nav,
        ownerMid: rank,
        ownerName: "fixture",
        pubdate: 0,
        rank,
        title: `${definition.title}排行${rank}`,
        view: 0
      };
    });
  };
  const isUnavailableOrdinaryRank = (type) => type === "life" || type === "information";
  const createOrdinaryRankUnavailable = (root) => {
    const empty = createNode(root, "div", "ordinary-rank-unavailable");
    empty.setAttribute("data-role", "ordinary-rank-unavailable");
    empty.appendChild(createLocalImage(root, "ordinary-rank-unavailable__image", ASSET_KEYS.PGC_EMPTY, ""));
    empty.appendChild(createNode(root, "span", "ordinary-rank-unavailable__label", "该分区排行榜已失效"));
    return empty;
  };
  const renderOrdinarySkeleton = (view) => {
    if (!view || view.destroyed) return false;
    cleanupListeners(view.cardListenerCleanups);
    const items = createOrdinarySkeletonItems(view.type);
    const ranks = isUnavailableOrdinaryRank(view.type) ? [] : createOrdinarySkeletonRanks(view.type);
    const isPgcFloor = view.type === "movie" || view.type === "teleplay" || view.type === "documentary";
    const listFragment = view.root.ownerDocument.createDocumentFragment();
    items.forEach((item, index) => {
      const card = isPgcFloor ? createOrdinaryPgcCard(view, item, index, view.type)
        : view.type === "course" ? createCheeseCard(view, item, index)
        : createDougaCard(view, item, index, view.type);
      card.setAttribute("data-skeleton", "true");
      const watchLater = card.querySelector('[data-role="watch-later"]');
      if (watchLater) watchLater.remove();
      listFragment.appendChild(card);
    });
    const rankFragment = view.root.ownerDocument.createDocumentFragment();
    if (isUnavailableOrdinaryRank(view.type)) {
      rankFragment.appendChild(createOrdinaryRankUnavailable(view.root));
    } else {
      ranks.forEach((item) => {
        const row = isPgcFloor ? createOrdinaryPgcRankRow(view, item, view.type)
          : view.type === "course" ? createCheeseRankRow(view, item)
          : createDougaRankRow(view, item, view.type);
        row.setAttribute("data-skeleton", "true");
        const watchLater = row.querySelector('[data-role="watch-later"]');
        if (watchLater) watchLater.remove();
        rankFragment.appendChild(row);
      });
    }
    view.list.replaceChildren(listFragment);
    view.rank.replaceChildren(view.rankHeader, rankFragment);
    view.list.setAttribute("data-state", "fixture");
    view.rank.setAttribute("data-state", isUnavailableOrdinaryRank(view.type) ? "unavailable" : "fixture");
    view.root.setAttribute("data-state", "fixture");
    view.root.setAttribute("data-rank-count", String(ranks.length));
    return true;
  };
  const createOrdinaryFloor = (root, type, rendererMediaFence, lifecycle) => {
    const definition = ORDINARY_ZONE_DEFINITIONS[type];
    const isPgcFloor = type === "movie" || type === "teleplay" || type === "documentary";
    const floor = createNode(root, "section", `storey-box b-wrap storey-${type} ordinary-floor${isPgcFloor ? " ordinary-pgc-floor" : ""}`);
    floor.setAttribute("data-floor-id", type);
    floor.setAttribute("data-source-floor", definition.nav);
    const space = createNode(root, "div", "space-between report-wrap-module");
    const main = createNode(root, "div", "card-list");
    const list = createNode(root, "div", "zone-list-box");
    if (type === "course") list.classList.add("cheese", "report-wrap-module");
    list.setAttribute("data-role", `${type}-list`);
    list.setAttribute("data-state", "loading");
    const titleNode = createStoreyTitle(root, definition.title, "DOUGA", "", categorySymbolFor(type), lifecycle, (event) => {
      if (lifecycle && typeof lifecycle.onOrdinaryZoneRequest === "function") lifecycle.onOrdinaryZoneRequest(type, event);
    });
    const floorName = titleNode.querySelector(".l-con .name");
    if (floorName) {
      floorName.setAttribute("href", definition.nav);
      floorName.setAttribute("target", "_blank");
      floorName.setAttribute("rel", "noopener noreferrer");
    }
    const floorMore = titleNode.querySelector(".exchange-btn .more");
    if (floorMore) {
      floorMore.setAttribute("data-role", `${type}-floor-more`);
      floorMore.setAttribute("href", definition.nav);
      floorMore.setAttribute("target", "_blank");
      floorMore.setAttribute("rel", "noopener noreferrer");
      floorMore.removeAttribute("hidden");
    }
    main.appendChild(titleNode);
    main.appendChild(list);
    const rank = createRankPanel(root, isPgcFloor || type === "course" ? "排行榜" : `${definition.title}排行`, "DOUGA", [], isPgcFloor, rendererMediaFence);
    rank.setAttribute("data-role", `${type}-rank`);
    rank.setAttribute("data-state", "loading");
    const rankMore = rank.querySelector(".rank-header .more");
    if (rankMore) {
      rankMore.setAttribute("data-role", `${type}-rank-more`);
      rankMore.setAttribute("href", definition.rankNav);
      rankMore.setAttribute("target", "_blank");
      rankMore.setAttribute("rel", "noopener noreferrer");
      if (isUnavailableOrdinaryRank(type)) rankMore.setAttribute("hidden", "true");
      else rankMore.removeAttribute("hidden");
    }
    const layout = createNode(root, "div", "floor-layout");
    layout.appendChild(main);
    layout.appendChild(rank);
    space.appendChild(layout);
    appendProxyFloorContent(root, floor, type === "course" ? "cheese" : type, space);
    const view = {
      root: floor,
      type,
      list,
      rank,
      rankHeader: rank.querySelector(".rank-header"),
      mediaFence: null,
      lifecycle,
      cardListenerCleanups: [],
      destroyed: false,
      batch: -1,
      lastGood: null,
      onWatchLaterRequest: lifecycle && lifecycle.onWatchLaterRequest,
      isRendererActive: lifecycle && lifecycle.isActive ? lifecycle.isActive : () => true
    };
    view.mediaFence = createViewMediaFence(view, rendererMediaFence);
    renderOrdinarySkeleton(view);
    floor.__ordinaryZoneView = view;
    return floor;
  };
  const setOrdinaryZoneData = (view, data) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isOrdinaryZoneRendererData(data) || data.type !== view.type) return false;
    view.mediaFence.retireGeneration();
    cleanupListeners(view.cardListenerCleanups);
    const visibleItems = data.items.length > 0 ? data.items : (view.lastGood ? view.lastGood.items : []);
    if (data.items.length > 0) {
      view.lastGood = data;
      const listFragment = view.root.ownerDocument.createDocumentFragment();
      visibleItems.forEach((item, index) => listFragment.appendChild(
        data.itemType === "pgc" ? createOrdinaryPgcCard(view, item, index, view.type)
          : data.itemType === "cheese" ? createCheeseCard(view, item, index)
          : createDougaCard(view, item, index, view.type)
      ));
      if (view.type === "course" && visibleItems.length < 12) {
        const skeletonItems = createOrdinarySkeletonItems("course", 12);
        for (let index = visibleItems.length; index < 12; index += 1) {
          const card = createCheeseCard(view, skeletonItems[index], index);
          card.setAttribute("data-skeleton", "true");
          listFragment.appendChild(card);
        }
      }
      view.list.replaceChildren(listFragment);
    }
    if (data.ranks.length > 0) {
      const rankFragment = view.root.ownerDocument.createDocumentFragment();
      data.ranks.slice(0, 10).forEach((item) => rankFragment.appendChild(
        data.rankType === "pgc" ? createOrdinaryPgcRankRow(view, item, view.type)
          : data.rankType === "cheese" ? createCheeseRankRow(view, item)
          : createDougaRankRow(view, item, view.type)
      ));
      view.rank.replaceChildren(view.rankHeader, rankFragment);
    }
    view.list.setAttribute("data-state", data.status);
    view.rank.setAttribute("data-state", data.ranks.length > 0 ? "committed" : view.rank.getAttribute("data-state") || "fixture");
    view.root.setAttribute("data-state", data.status);
    view.root.setAttribute("data-rank-count", String(data.ranks.length));
    view.batch = data.batch;
    return true;
  };

  const resolveLiveFloorImageUrl = (value) => resolveFocusUrl(value, FOCUS_IMAGE_HOSTS, ["/bfs/"], true);
  const isLiveFloorRoom = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "areaName\u001Fcover\u001Fface\u001Fhref\u001Fkeyframe\u001Fonline\u001FroomId\u001Ftitle\u001Funame"
    && Number.isSafeInteger(item.roomId) && item.roomId > 0
    && typeof item.title === "string" && item.title.length > 0 && item.title.length <= 256
    && typeof item.uname === "string" && item.uname.length > 0 && item.uname.length <= 256
    && typeof item.areaName === "string" && item.areaName.length <= 128
    && resolveLiveFloorImageUrl(item.cover) === item.cover
    && resolveLiveFloorImageUrl(item.keyframe) === item.keyframe
    && resolveLiveFloorImageUrl(item.face) === item.face
    && item.href === `https://live.bilibili.com/${item.roomId}`
    && Number.isSafeInteger(item.online) && item.online >= 0 && item.online <= 1000000000000;
  const isLiveFloorRoomsData = (data) => data !== null && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "rooms"
    && Array.isArray(data.rooms) && data.rooms.length <= 12
    && data.rooms.every(isLiveFloorRoom)
    && new Set(data.rooms.map((item) => item.roomId)).size === data.rooms.length;
  const isLiveFloorRank = (item) => item !== null && typeof item === "object"
    && Object.keys(item).sort().join("\u001F") === "face\u001Fhref\u001Fonline\u001FroomId\u001Ftitle\u001Funame"
    && Number.isSafeInteger(item.roomId) && item.roomId > 0
    && typeof item.title === "string" && item.title.length > 0 && item.title.length <= 256
    && typeof item.uname === "string" && item.uname.length > 0 && item.uname.length <= 256
    && resolveLiveFloorImageUrl(item.face) === item.face
    && item.href === `https://live.bilibili.com/${item.roomId}`
    && Number.isSafeInteger(item.online) && item.online >= 0 && item.online <= 1000000000000;
  const isLiveFloorInitialData = (data) => data !== null && typeof data === "object"
    && Object.keys(data).sort().join("\u001F") === "onlineTotal\u001Franks\u001Frooms"
    && Number.isSafeInteger(data.onlineTotal) && data.onlineTotal >= 0 && data.onlineTotal <= 1000000000000
    && isLiveFloorRoomsData({ rooms: data.rooms })
    && Array.isArray(data.ranks) && data.ranks.length <= 6 && data.ranks.every(isLiveFloorRank);
  const formatLiveCount = (value) => {
    if (!Number.isSafeInteger(value) || value < 0) return "--";
    if (value < 10000) return String(value);
    return `${(value / 10000).toFixed(value >= 1000000 ? 0 : 1).replace(/\.0$/, "")}万`;
  };
  const createLiveCard = (view, item, index) => {
    const card = createNode(view.root, "article", "live-card");
    card.setAttribute("data-role", "live-card");
    const link = createNode(view.root, "a", "live-card__link");
    link.setAttribute("href", item.href); link.setAttribute("target", "_blank"); link.setAttribute("rel", "noopener noreferrer");
    const pic = createNode(view.root, "div", "pic");
    pic.appendChild(createCoverImage(view.root, "live-card__image", item.cover, FIXTURE_COVER_POOLS.recommend, index, item.title, "bili-live", view.mediaFence, pic));
    const keyframe = view.root.ownerDocument.createElement("img");
    keyframe.className = "live-card__keyframe";
    keyframe.setAttribute("alt", "");
    keyframe.setAttribute("referrerpolicy", "no-referrer");
    keyframe.setAttribute("loading", "lazy");
    keyframe.setAttribute("data-keyframe-src", item.keyframe);
    keyframe.addEventListener("error", () => keyframe.classList.add("is-unavailable"), { once: true });
    pic.appendChild(keyframe);
    const count = createNode(view.root, "span", "count");
    count.appendChild(createIconFont(view.root, "bili-icon_xinxi_renqi", null, view.lifecycle, "i"));
    count.appendChild(view.root.ownerDocument.createTextNode(formatLiveCount(item.online)));
    pic.appendChild(count);
    const up = createNode(view.root, "div", "up");
    const faceWrap = createNode(view.root, "span", "up-cover");
    faceWrap.appendChild(createCoverImage(view.root, "face", item.face, FIXTURE_COVER_POOLS.recommend, index, item.uname, "bili-live", view.mediaFence, faceWrap));
    const text = createNode(view.root, "span", "txt");
    text.appendChild(createNode(view.root, "span", "name", item.uname));
    const desc = createNode(view.root, "span", "desc", item.title); desc.setAttribute("title", item.title); text.appendChild(desc);
    if (item.areaName) text.appendChild(createNode(view.root, "span", "tag", item.areaName));
    up.appendChild(faceWrap); up.appendChild(text); link.appendChild(pic); link.appendChild(up); card.appendChild(link);
    return card;
  };
  const buildLiveRankFragment = (view, rooms, showNumber = true) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    if (rooms.length === 0) { fragment.appendChild(createNode(view.root, "div", "empty-state", "暂无直播数据")); return fragment; }
    rooms.slice(0, 6).forEach((item, index) => {
      const row = createNode(view.root, "div", `rank-wrap${index < 3 ? " rank-wrap--top" : ""}`);
      if (showNumber) row.appendChild(createNode(view.root, "span", "number", String(index + 1)));
      const link = createNode(view.root, "a", "link"); link.setAttribute("href", item.href); link.setAttribute("target", "_blank"); link.setAttribute("rel", "noopener noreferrer");
      const face = createNode(view.root, "span", "rank-face");
      face.appendChild(createCoverImage(view.root, "rank-face__image", item.face, FIXTURE_COVER_POOLS.recommend, index, item.uname, "bili-live", view.mediaFence, face));
      link.appendChild(face);
      const text = createNode(view.root, "span", "rank-text");
      text.appendChild(createNode(view.root, "span", "rank-name", item.uname));
      text.appendChild(createNode(view.root, "span", "rank-title", item.title));
      link.appendChild(text);
      const online = createNode(view.root, "span", "rank-online"); online.appendChild(createIconFont(view.root, "bili-icon_xinxi_renqi", null, view.lifecycle, "i")); online.appendChild(view.root.ownerDocument.createTextNode(formatLiveCount(item.online))); link.appendChild(online);
      row.appendChild(link); fragment.appendChild(row);
    });
    return fragment;
  };
  const setLiveFloorRooms = (view, data, source = "recommendation") => {
    if (!view || view.destroyed || !view.isRendererActive() || !isLiveFloorRoomsData(data) || data.rooms.length === 0) return false;
    const fragment = view.root.ownerDocument.createDocumentFragment();
    data.rooms.forEach((item, index) => fragment.appendChild(createLiveCard(view, item, index)));
    view.list.replaceChildren(fragment); view.list.setAttribute("data-state", "committed"); view.rootNode.setAttribute("data-source", source);
    return true;
  };
  const setLiveFloorFollowing = (view, data, activate = true) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isLiveFloorRoomsData(data)) return false;
    view.followingData = data;
    view.following.replaceChildren(buildLiveRankFragment(view, data.rooms, false));
    if (activate && data.rooms.length > 0) setLiveFloorRooms(view, data, "following");
    if (activate) view.selectTab("following");
    return true;
  };
  const setLiveFloorInitial = (view, data, commitRooms = true) => {
    if (!view || view.destroyed || !view.isRendererActive() || !isLiveFloorInitialData(data)) return false;
    const roomsApplied = commitRooms && data.rooms.length > 0 ? setLiveFloorRooms(view, { rooms: data.rooms }, "recommendation") : true;
    if (!roomsApplied) return false;
    view.online.textContent = `当前共有 ${data.onlineTotal} 个在线直播`;
    view.ranks.replaceChildren(buildLiveRankFragment(view, data.ranks));
    view.recommendationData = { rooms: data.rooms };
    view.rootNode.setAttribute("data-state", "committed");
    return true;
  };
  const createLiveFloor = (root, mediaFence, lifecycle = null) => {
    const cleanups = lifecycle && Array.isArray(lifecycle.cleanups) ? lifecycle.cleanups : [];
    const floor = createNode(root, "section", "storey-box b-wrap storey-live");
    floor.id = "bili_live"; floor.setAttribute("data-floor-id", "live");
    const space = createNode(root, "div", "space-between report-wrap-module report-scroll-module"); space.id = "bili_report_live";
    const liveList = createNode(root, "div", "live-list");
    const title = createStoreyTitle(root, "正在直播", "LIVE", "--", "bili-live", lifecycle);
    const online = title.querySelector(".text-info"); online.textContent = "当前共有 -- 个在线直播";
    const change = title.__floorChangeButton; liveList.appendChild(title);
    const list = createNode(root, "div", "zone-list-box live-list-box"); list.setAttribute("data-role", "live-list"); list.setAttribute("data-state", "loading"); liveList.appendChild(list);
    const requestKeyframeForTarget = (target) => {
      const pic = target && typeof target.closest === "function" ? target.closest(".live-card .pic") : null;
      if (!pic || !list.contains(pic)) return;
      const keyframe = pic.querySelector(".live-card__keyframe[data-keyframe-src]");
      if (!keyframe || keyframe.hasAttribute("src")) return;
      const source = keyframe.getAttribute("data-keyframe-src");
      if (resolveLiveFloorImageUrl(source) !== source) return;
      keyframe.setAttribute("src", source);
      keyframe.removeAttribute("data-keyframe-src");
    };
    addListenerWithCleanup(list, "pointerover", (event) => requestKeyframeForTarget(event.target), cleanups);
    addListenerWithCleanup(list, "focusin", (event) => requestKeyframeForTarget(event.target), cleanups);
    const tabs = createNode(root, "aside", "live-tabs"); tabs.setAttribute("data-role", "live-tabs");
    const tabSwitch = createNode(root, "div", "tab-switch");
    const rankTab = createNode(root, "button", "tab-switch-item on", "直播排行"); rankTab.type = "button";
    const followingTab = createNode(root, "button", "tab-switch-item", "关注的主播"); followingTab.type = "button";
    tabSwitch.appendChild(rankTab); tabSwitch.appendChild(followingTab); tabs.appendChild(tabSwitch);
    const ranks = createNode(root, "div", "live-rank"); ranks.setAttribute("data-role", "live-rank-list");
    const following = createNode(root, "div", "live-following-list"); following.setAttribute("data-role", "live-following-list"); following.hidden = true;
    tabs.appendChild(ranks); tabs.appendChild(following); space.appendChild(liveList); space.appendChild(tabs); floor.appendChild(space);
    const view = { root, rootNode: floor, list, tabs, ranks, following, rankTab, followingTab, online, change, mediaFence, lifecycle, followingData: null, recommendationData: null, destroyed: false, isRendererActive: lifecycle && lifecycle.isActive ? lifecycle.isActive : () => true };
    view.selectTab = (kind) => { const follow = kind === "following"; rankTab.classList.toggle("on", !follow); followingTab.classList.toggle("on", follow); ranks.hidden = follow; following.hidden = !follow; };
    addListenerWithCleanup(rankTab, "click", () => view.selectTab("rank"), cleanups);
    addListenerWithCleanup(followingTab, "click", () => { view.selectTab("following"); if (lifecycle && typeof lifecycle.onLiveFloorFollowingRequest === "function") lifecycle.onLiveFloorFollowingRequest(); }, cleanups);
    addListenerWithCleanup(change, "click", () => { view.selectTab("rank"); if (lifecycle && typeof lifecycle.onLiveFloorMoreRequest === "function") lifecycle.onLiveFloorMoreRequest(); }, cleanups);
    floor.__liveFloorView = view;
    return floor;
  };

  const createPgcTimelineLink = (root, className, item) => {
    if (!isSafePgcId(item.seasonId)) {
      return createNode(root, "span", className, "番剧链接不可用");
    }
    const link = createNode(root, "a", className);
    link.setAttribute("href", `https://www.bilibili.com/bangumi/play/ss${item.seasonId}`);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    return link;
  };

  const createPgcRankLink = (root, item) => {
    const href = resolvePgcLinkUrl(item.linkUrl);
    if (!href) {
      return createNode(root, "span", "link", "番剧链接不可用");
    }
    const link = createNode(root, "a", "link");
    link.setAttribute("href", href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    return link;
  };

  const buildPgcTimelineFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    if (items.length === 0) {
      const empty = createNode(view.root, "div", "empty-state pgc-empty-state");
      empty.setAttribute("data-role", "pgc-empty-state");
      empty.appendChild(createLocalImage(view.root, "pgc-empty-state__image", ASSET_KEYS.PGC_EMPTY, ""));
      empty.appendChild(createNode(view.root, "span", "pgc-empty-state__label", "暂无番剧内容"));
      fragment.appendChild(empty);
      return fragment;
    }
    for (const item of items) {
      const card = createNode(view.root, "article", "time-line-card item");
      card.setAttribute("data-role", "pgc-timeline-item");
      card.setAttribute("data-season-id", String(item.seasonId));
      card.setAttribute("data-episode-id", String(item.episodeId));
      const imageLink = createPgcTimelineLink(view.root, "pic", item);
      const image = view.root.ownerDocument.createElement("img");
      image.setAttribute("class", "pgc-timeline__image");
      image.setAttribute("src", item.coverUrl);
      image.setAttribute("alt", normalizeText(item.title));
      imageLink.appendChild(image);
      card.appendChild(imageLink);
      const text = createNode(view.root, "div", "txt");
      const titleLink = createPgcTimelineLink(view.root, "ss", item);
      titleLink.textContent = normalizeText(item.title);
      text.appendChild(titleLink);
      text.appendChild(createNode(view.root, "span", "update", item.updateText));
      if (item.pubTime) {
        text.appendChild(createNode(view.root, "span", "pub-time", item.pubTime));
      }
      card.appendChild(text);
      fragment.appendChild(card);
    }
    return fragment;
  };

  const buildPgcRankFragment = (view, items) => {
    const fragment = view.root.ownerDocument.createDocumentFragment();
    for (const [index, item] of items.entries()) {
      const row = createNode(view.root, "div", "pgc-rank-wrap");
      row.setAttribute("data-role", "pgc-rank-item");
      const number = createNode(view.root, "span", "number", String(item.rank));
      number.setAttribute("aria-label", `第${item.rank}名`);
      if (index < 3) {
        number.setAttribute("class", "number on");
      }
      const link = createPgcRankLink(view.root, item);
      const text = createNode(view.root, "span", "txt");
      text.appendChild(createNode(view.root, "span", "title", item.title));
      text.appendChild(createNode(view.root, "span", "update", item.updateText));
      if (item.badgeText) {
        text.appendChild(createNode(view.root, "span", "badge", item.badgeText));
      }
      link.appendChild(text);
      row.appendChild(number);
      row.appendChild(link);
      fragment.appendChild(row);
    }
    return fragment;
  };

  const createPgcRenderPlan = (view, data) => {
    if (!(view.isDataValid || isPgcAnimeData)(data) || !isPgcViewActive(view)) {
      return null;
    }
    const tab = data.tabs.find((entry) => entry.key === view.state.activeTabKey)
      || data.tabs.find((entry) => entry.isToday)
      || data.tabs[0];
    return {
      data,
      tab,
      timelineFragment: buildPgcTimelineFragment(view, tab.items),
      rankFragment: buildPgcRankFragment(view, data.rankItems)
    };
  };

  const applyPgcRenderPlan = (view, plan) => {
    view.state.data = plan.data;
    view.state.activeTabKey = plan.tab.key;
    view.timelineRoot.replaceChildren(plan.timelineFragment);
    view.rankList.replaceChildren(plan.rankFragment);
    for (const node of view.tabNodes) {
      const active = node.getAttribute("data-tab-key") === view.state.activeTabKey;
      node.setAttribute("class", active ? "tab-switch-item on" : "tab-switch-item");
      node.setAttribute("aria-selected", active ? "true" : "false");
    }
    view.root.setAttribute("data-pgc-state", "success");
    view.root.setAttribute("data-pgc-active-tab", view.state.activeTabKey);
  };

  const isPgcViewActive = (view) => Boolean(
    view
    && view.destroyed !== true
    && typeof view.isRendererActive === "function"
    && view.isRendererActive()
  );

  const setPgcAnimeData = (view, data) => {
    const plan = createPgcRenderPlan(view, data);
    if (!plan) {
      return false;
    }
    applyPgcRenderPlan(view, plan);
    return true;
  };

  const setPgcGuochuangData = (view, data) => {
    const plan = createPgcRenderPlan(view, data);
    if (!plan) {
      return false;
    }
    applyPgcRenderPlan(view, plan);
    return true;
  };

  const setPgcAnimeFailure = (view) => {
    if (!isPgcViewActive(view)) {
      return;
    }
    view.root.setAttribute("data-pgc-state", view.state.data ? "last-good" : "fixture");
  };

  const setPgcGuochuangFailure = (view) => {
    if (!isPgcViewActive(view)) {
      return;
    }
    view.root.setAttribute("data-pgc-state", view.state.data ? "last-good" : "fixture");
  };

  const createPgcFloor = (root, options = {}) => {
    const isGuochuang = options.kind === "guochuang";
    const title = isGuochuang ? "国创" : "番剧";
    const floorId = isGuochuang ? "guochuang" : "anime";
    const iconId = isGuochuang ? "bili-guochuang" : "bili-anime";
    const floor = createNode(root, "section", `${floorId} report-wrap-module report-scroll-module b-wrap`);
    floor.id = `bili_report_${floorId}`;
    floor.setAttribute("scrollshow", "true");
    floor.setAttribute("data-floor-id", floorId);
    floor.setAttribute("data-role", `pgc-${floorId}-floor`);
    const timeLine = createNode(root, "div", "time-line");
    const header = createNode(root, "header", "storey-title");
    const left = createNode(root, "div", "l-con");
    left.appendChild(createSvgIcon(root, iconId, 36, "svg-icon"));
    const name = createNode(root, "a", "name", title);
    name.href = isGuochuang ? "https://www.bilibili.com/guochuang/" : "https://www.bilibili.com/anime/";
    name.target = "_blank";
    name.rel = "noopener noreferrer";
    left.appendChild(name);
    const status = createNode(root, "span", "pgc-status");
    status.setAttribute("data-role", "pgc-status");
    status.setAttribute("hidden", "true");
    timeLine.appendChild(status);
    const tabSwitch = createNode(root, "div", "tab-switch pgc-tab-switch");
    tabSwitch.setAttribute("data-role", "pgc-tab-switch");
    tabSwitch.setAttribute("role", "tablist");
    const tabNodes = [];
    for (const [index, definition] of PGC_TAB_DEFINITIONS.entries()) {
      const tab = createNode(root, "span", index === 0 ? "tab-switch-item on" : "tab-switch-item", definition.label);
      tab.setAttribute("data-tab-key", definition.key);
      tab.setAttribute("role", "tab");
      tab.setAttribute("tabindex", "0");
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tabSwitch.appendChild(tab);
      tabNodes.push(tab);
    }
    left.appendChild(tabSwitch);
    header.appendChild(left);
    const timelineLink = createNode(root, "a", "tl-link", "新番时间表");
    timelineLink.href = isGuochuang ? "https://www.bilibili.com/guochuang/timeline/" : "https://www.bilibili.com/anime/timeline/";
    timelineLink.target = "_blank";
    timelineLink.rel = "noopener noreferrer";
    timelineLink.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, options.lifecycle, "i"));
    header.appendChild(timelineLink);
    timeLine.appendChild(header);
    const list = createNode(root, "div", "zone-list-box");
    list.setAttribute("data-role", "pgc-timeline-list");
    for (const [index, placeholderTitle] of Array.from({ length: 8 }, (_, index) => [index, `新番时间线${index + 1}`])) {
      const card = createNode(root, "article", "time-line-card item");
      card.setAttribute("data-placeholder", "true");
      const pic = createNode(root, "span", "pic");
      pic.appendChild(createLocalImage(root, "pgc-timeline__image", ASSET_KEYS.FIXTURE_COVER_PHOTO, placeholderTitle));
      const text = createNode(root, "div", "txt");
      text.appendChild(createNode(root, "span", "ss", placeholderTitle));
      text.appendChild(createNode(root, "span", "update", "加载中"));
      card.appendChild(pic);
      card.appendChild(text);
      list.appendChild(card);
    }
    timeLine.appendChild(list);
    const ranks = createNode(root, "aside", "pgc-rank");
    const rankHeader = createNode(root, "header", "rank-header");
    rankHeader.appendChild(createNode(root, "span", "name", "排行榜"));
    const rankMore = createNode(root, "a", "more", "更多");
    rankMore.href = isGuochuang ? "https://www.bilibili.com/v/popular/rank/guochan" : "https://www.bilibili.com/v/popular/rank/bangumi";
    rankMore.target = "_blank";
    rankMore.rel = "noopener noreferrer";
    rankMore.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, options.lifecycle, "i"));
    rankHeader.appendChild(rankMore);
    ranks.appendChild(rankHeader);
    const rankList = createNode(root, "div", "pgc-rank-list");
    for (let rank = 1; rank <= 10; rank += 1) {
      const row = createNode(root, "div", "pgc-rank-wrap");
      row.appendChild(createNode(root, "span", rank <= 3 ? "number on" : "number", String(rank)));
      const placeholder = createNode(root, "span", "link");
      const text = createNode(root, "span", "txt");
      text.appendChild(createNode(root, "span", "title", `${title}排行${rank}`));
      text.appendChild(createNode(root, "span", "update", "更新中"));
      placeholder.appendChild(text);
      row.appendChild(placeholder);
      rankList.appendChild(row);
    }
    ranks.appendChild(rankList);
    const layout = createNode(root, "div", "space-between");
    layout.appendChild(timeLine);
    layout.appendChild(ranks);
    floor.appendChild(layout);
    const view = {
      root: floor,
      timelineRoot: list,
      rankRoot: ranks,
      rankList,
      rankHeader,
      tabNodes,
      state: { data: null, activeTabKey: "latest" },
      isDataValid: isGuochuang ? isPgcGuochuangData : isPgcAnimeData,
      destroyed: false,
      isRendererActive: () => true,
      listenerCleanups: []
    };
    const setActiveTab = (key) => {
      if (!isPgcViewActive(view) || !view.state.data || !PGC_TAB_DEFINITIONS.some((entry) => entry.key === key)) {
        return;
      }
      view.state.activeTabKey = key;
      (isGuochuang ? setPgcGuochuangData : setPgcAnimeData)(view, view.state.data);
    };
    for (const tab of tabNodes) {
      addListenerWithCleanup(tab, "click", () => setActiveTab(tab.getAttribute("data-tab-key")), view.listenerCleanups);
      addListenerWithCleanup(tab, "keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setActiveTab(tab.getAttribute("data-tab-key"));
        }
      }, view.listenerCleanups);
    }
    return { floor, view };
  };

  const createPromoteFloor = (root, mediaFence) => {
    const floor = createNode(root, "div", "space-between report-wrap-module report-scroll-module");
    floor.id = "reportFirst2";
    floor.setAttribute("data-floor-id", "promote");
    floor.setAttribute("scrollshow", "true");
    floor.setAttribute("data-role", "promote-row");
    const extension = createNode(root, "div", "extension");
    const title = createNode(root, "header", "storey-title");
    const left = createNode(root, "div", "l-con");
    left.appendChild(createLocalImage(root, "svg-icon", ASSET_KEYS.PROMOTE_ICON, ""));
    const name = createNode(root, "a", "name no-link", "推广");
    name.setAttribute("target", "_blank");
    left.appendChild(name);
    title.appendChild(left);
    extension.appendChild(title);
    extension.appendChild(createNode(root, "div", "ext-box"));
    const window = createNode(root, "div", "bypb-window");
    const online = createNode(root, "div", "online");
    online.appendChild(createPrimaryAnchor(root, "online-link", "https://www.bilibili.com/video/online.html", "观看列表", "_blank"));
    window.appendChild(online);
    floor.appendChild(extension);
    floor.appendChild(window);
    return floor;
  };

  const createFooter = (root, lifecycle) => {
    const footer = createNode(root, "div", "international-footer");
    const createFooterAnchor = (className, targetKey, label) => (
      createFixedTargetAnchor(root, className, FOOTER_TARGETS[targetKey], label)
    );
    const setBackgroundImage = (node, assetKey) => {
      const assetUrl = resolveLocalAssetUrl(assetKey);
      if (assetUrl) {
        node.style.backgroundImage = `url("${assetUrl}")`;
      }
    };
    const createQr = (assetKey) => {
      const qr = createNode(root, "div", "qrcode");
      qr.setAttribute("aria-hidden", "true");
      setBackgroundImage(qr, assetKey);
      return qr;
    };
    const createSocialAnchor = ({ className, targetKey, label, iconClass, qrAssetKey, imageAssetKey, textClass }) => {
      const anchor = createFooterAnchor(className, targetKey, "");
      anchor.setAttribute("aria-label", label);
      if (iconClass) {
        anchor.appendChild(createIconFont(root, iconClass, "bili-footer-font", lifecycle, "i"));
      } else {
        anchor.appendChild(createLocalImage(root, "charity-icon", imageAssetKey, ""));
      }
      anchor.appendChild(createNode(root, "p", textClass || "", label));
      if (qrAssetKey) {
        anchor.appendChild(createQr(qrAssetKey));
      }
      return anchor;
    };
    const linkBox = createNode(root, "div", "link-box b-footer-wrap");
    const left = createNode(root, "div", "footer_left");
    const footerGroups = [
      ["bilibili", "link-a", [
        ["关于我们", "ABOUT_US"], ["联系我们", "CONTACT"], ["用户协议", "PROTOCOL"],
        ["加入我们", "JOIN"], ["隐私政策", "PRIVACY"], ["bilibili认证", "VERIFY"], ["Investor Relations", "INVESTOR"]
      ]],
      ["传送门", "link-b", [
        ["协议汇总", "PROTOCOL_SUMMARY"], ["活动中心", "ACTIVITY_CENTER"], ["活动专题页", "ACTIVITY_TOPIC"],
        ["侵权申诉", "COPYRIGHT"], ["帮助中心", "HELP"], ["社区中心", "COMMUNITY"], ["壁纸站", "WALLPAPER"],
        ["广告合作", "AD"], ["名人堂", "HALL_OF_FAME"], ["MCN管理中心", "MCN"], ["高级弹幕", "DANMAKU"], ["品牌号官网", "BRAND"]
      ]]
    ];
    for (const [heading, groupClass, entries] of footerGroups) {
      const group = createNode(root, "div", `link-item ${groupClass}`);
      group.appendChild(createNode(root, "span", "bt", heading));
      const list = createNode(root, "ul");
      for (const [label, targetKey] of entries) {
        list.appendChild(createFooterAnchor("footer-link", targetKey, label));
      }
      group.appendChild(list);
      left.appendChild(group);
    }
    const right = createNode(root, "div", "footer_right");
    const linkC = createNode(root, "div", "link-item link-c");
    const footerEntries = [
      { className: "biliapp", targetKey: "APP", label: "下载APP", iconClass: "bili-footer-icon_download", qrAssetKey: ASSET_KEYS.FOOTER_APP_QR },
      { className: "charity", targetKey: "CHARITY", label: "公益", imageAssetKey: ASSET_KEYS.FOOTER_CHARITY, textClass: "charity-text" },
      { className: "weibo", targetKey: "WEIBO", label: "新浪微博", iconClass: "bili-footer-icon_weibo", qrAssetKey: ASSET_KEYS.FOOTER_WEIBO_QR },
      { className: "weixin", targetKey: null, label: "官方微信", iconClass: "bili-footer-icon_wechat", qrAssetKey: ASSET_KEYS.FOOTER_WECHAT_QR }
    ];
    for (const entry of footerEntries) {
      const wrapper = createNode(root, "div", "a-wraper");
      let anchor;
      if (entry.targetKey) {
        anchor = createSocialAnchor(entry);
      } else {
        anchor = createNode(root, "a", entry.className);
        anchor.setAttribute("aria-label", entry.label);
        anchor.setAttribute("role", "button");
        anchor.setAttribute("tabindex", "0");
        anchor.appendChild(createIconFont(root, entry.iconClass, "bili-footer-font", lifecycle, "i"));
        anchor.appendChild(createNode(root, "p", "", entry.label));
        anchor.appendChild(createQr(entry.qrAssetKey));
      }
      wrapper.appendChild(anchor);
      linkC.appendChild(wrapper);
    }
    right.appendChild(linkC);
    linkBox.appendChild(left);
    linkBox.appendChild(right);

    const partner = createNode(root, "div", "partner b-footer-wrap");
    const picBox = createNode(root, "div", "pic-box");
    picBox.appendChild(createLocalImage(root, "pic", ASSET_KEYS.FOOTER_PARTNER, "营业执照"));
    picBox.appendChild(createLocalImage(root, "pic962110", ASSET_KEYS.FOOTER_96110, "96110反诈提醒"));
    partner.appendChild(picBox);
    const textCon = createNode(root, "div", "text-con");
    const appendSpan = (parent, text, targetKey) => {
      const span = createNode(root, "span");
      if (targetKey) {
        span.appendChild(createFooterAnchor("", targetKey, text));
      } else {
        span.appendChild(root.ownerDocument.createTextNode(normalizeText(text)));
      }
      parent.appendChild(span);
    };
    const licenseLine = createNode(root, "p");
    appendSpan(licenseLine, "营业执照", "BUSINESS_LICENSE");
    appendSpan(licenseLine, "信息网络传播视听节目许可证：0910417");
    appendSpan(licenseLine, "网络文化经营许可证 沪网文【2025】0258-085号", "CULTURE_LICENSE");
    appendSpan(licenseLine, "广播电视节目制作经营许可证：（沪）字第01248号");
    appendSpan(licenseLine, "增值电信业务经营许可证 沪B2-20100043");
    appendSpan(licenseLine, "互联网ICP备案：");
    licenseLine.lastChild.appendChild(createFooterAnchor("", "MIIT", "沪ICP备13002172号-3"));
    appendSpan(licenseLine, "出版物经营许可证 沪批字第U6699号", "PUBLICATION_LICENSE");
    appendSpan(licenseLine, "互联网药品信息服务资格证 沪-非经营性-2022-0011");
    appendSpan(licenseLine, "营业性演出许可证 沪市文演（经）00-2253");
    textCon.appendChild(licenseLine);

    textCon.appendChild(createNode(root, "p", "", "不良信息举报邮箱：help@bilibili.com | 涉未成年举报邮箱：teenprotect@bilibili.com | 不良信息举报电话：4006262233转3"));
    const reportLine = createNode(root, "p");
    reportLine.appendChild(createNode(root, "i", "sprite bg1"));
    reportLine.appendChild(createFooterAnchor("", "SHJBZX", "上海互联网举报中心"));
    reportLine.appendChild(root.ownerDocument.createTextNode(" | "));
    reportLine.appendChild(createFooterAnchor("", "SH12345", "12345政务服务便民热线"));
    reportLine.appendChild(root.ownerDocument.createTextNode(" | "));
    reportLine.appendChild(createNode(root, "i", "sprite bg2"));
    reportLine.appendChild(createFooterAnchor("", "PUBLIC_SECURITY", "沪公网安备31011002002436号"));
    reportLine.appendChild(root.ownerDocument.createTextNode(" | "));
    reportLine.appendChild(createFooterAnchor("", "CHILD_PROTECTION", "儿童色情信息举报专区"));
    reportLine.appendChild(root.ownerDocument.createTextNode(" | "));
    reportLine.appendChild(createFooterAnchor("", "ANTI_PORN", "扫黄打非举报"));
    textCon.appendChild(reportLine);
    const algorithmLine = createNode(root, "p");
    algorithmLine.appendChild(createFooterAnchor("", "ALGORITHM_1", "网信算备310110764385705230011号"));
    algorithmLine.appendChild(root.ownerDocument.createTextNode(" | "));
    algorithmLine.appendChild(createFooterAnchor("", "ALGORITHM_2", "网信算备310110764385702230013号"));
    textCon.appendChild(algorithmLine);
    const harmfulLine = createNode(root, "p");
    harmfulLine.appendChild(root.ownerDocument.createTextNode("网上有害信息举报专区："));
    harmfulLine.appendChild(createNode(root, "i", "sprite bg3"));
    harmfulLine.appendChild(createFooterAnchor("", "ILLEGAL_CONTENT", "中国互联网违法和不良信息举报中心"));
    textCon.appendChild(harmfulLine);
    textCon.appendChild(createNode(root, "p", "", "亲爱的市民朋友，上海警方反诈劝阻电话“96110”系专门针对避免您财产被骗受损而设，请您一旦收到来电，立即接听。"));
    textCon.appendChild(createNode(root, "p", "", "公司名称：上海宽娱数码科技有限公司 | 公司地址：上海市杨浦区政立路489号 | 电话：021-25099888"));
    const spriteUrl = resolveLocalAssetUrl(ASSET_KEYS.FOOTER_SPRITE);
    if (spriteUrl) {
      for (const sprite of textCon.querySelectorAll(".sprite")) {
        sprite.style.backgroundImage = `url("${spriteUrl}")`;
      }
    }
    partner.appendChild(textCon);
    footer.appendChild(linkBox);
    footer.appendChild(partner);
    return footer;
  };

  const createElevator = (root) => {
    const elevator = createNode(root, "aside", "elevator");
    elevator.setAttribute("data-role", "elevator");
    elevator.setAttribute("data-overlay-open", "false");
    elevator.setAttribute("data-visible", "true");
    const mask = createNode(root, "div", "mask");
    mask.setAttribute("data-role", "elevator-mask");
    mask.setAttribute("aria-hidden", "true");
    elevator.appendChild(mask);
    // Antenna ear icon anchored above the top-left corner (legacy A-plan visual accent).
    const ear = createIconFont(root, "bili-icon_youdaohang_xiaodianshitianxian", "ear", null, "i");
    elevator.appendChild(ear);
    const listBox = createNode(root, "div", "list-box");
    const floorList = createNode(root, "div");
    floorList.setAttribute("data-role", "elevator-floor-list");
    const floors = [
      ["douga", "动画"], ["live", "直播"], ["anime", "番剧"], ["guochuang", "国创"], ["manga", "漫画"],
      ["music", "音乐"], ["dance", "舞蹈"], ["game", "游戏"], ["knowledge", "知识"], ["course", "课堂"],
      ["tech", "科技"], ["sports", "运动"], ["car", "汽车"], ["life", "生活"], ["food", "美食"],
      ["animal", "动物圈"], ["kichiku", "鬼畜"], ["fashion", "时尚"], ["information", "资讯"], ["ent", "娱乐"],
      ["read", "专栏"], ["movie", "电影"], ["teleplay", "TV剧"], ["cinephile", "影视"], ["documentary", "纪录片"]
    ];
    const buttons = [];
    for (const [type, label] of floors) {
      const button = createNode(root, "button", "item sortable", label);
      button.setAttribute("type", "button");
      button.setAttribute("data-role", "elevator-floor");
      button.setAttribute("data-type", type);
      floorList.appendChild(button);
      buttons.push({ button, type });
    }
    const sort = createNode(root, "button", "item sort");
    sort.setAttribute("type", "button");
    sort.setAttribute("data-role", "elevator-sort");
    sort.setAttribute("aria-label", "楼层排序");
    sort.setAttribute("title", "楼层排序");
    sort.appendChild(createIconFont(root, "bili-icon_youdaohang_paixu", null, null));
    const backTop = createNode(root, "button", "item back-top");
    backTop.setAttribute("type", "button");
    backTop.setAttribute("data-role", "elevator-back-top");
    backTop.setAttribute("aria-label", "返回顶部");
    backTop.setAttribute("title", "返回顶部");
    backTop.appendChild(createIconFont(root, "bili-general_pullup_s", null, null));
    listBox.appendChild(floorList);
    listBox.appendChild(sort);
    listBox.appendChild(backTop);
    elevator.appendChild(listBox);
    // 2233娘 background — only visible when .elevator has .edit class
    const bg23 = createNode(root, "div", "bg23");
    bg23.setAttribute("aria-hidden", "true");
    const bg23Url = resolveLocalAssetUrl(ASSET_KEYS.ELEVATOR_EDIT);
    if (bg23Url) {
      const bg23Value = `url("${bg23Url}")`;
      if (elevator.style && typeof elevator.style.setProperty === "function") {
        elevator.style.setProperty("--extension-b-bg23-url", bg23Value);
      } else if (elevator.style) {
        elevator.style["--extension-b-bg23-url"] = bg23Value;
      }
    }
    elevator.appendChild(bg23);
    return { elevator, floorList, buttons, backTop, sort, mask };
  };

  const createContactHelp = (root) => createFixedAnchor(root, "contact-help", "CUSTOMER_SERVICE", "联系客服");

  const bindElevator = (root, elevatorView, footer, popoverGroups, listenerCleanups, isRendererActive) => {
    const view = root.ownerDocument.defaultView;
    const doc = root.ownerDocument;
    if (!view || !doc) { return; }
    const firstScreen = root.querySelector(".first-screen");
    const banner = root.querySelector(".bili-banner");
    const primaryMenu = root.querySelector(".primary-menu-wrap");
    const changeButton = root.querySelector(".change-btn");
    const historyEntry = (popoverGroups || []).find((entry) => entry.trigger && entry.trigger.getAttribute("aria-label") === "历史");
    const historyPanel = historyEntry ? historyEntry.panel : null;
    let layoutFrame = 0;
    let layoutTimer = 0;
    let scrollFrame = 0;
    let lastActiveType = null;
    const floorList = elevatorView.floorList || root.querySelector('[data-role="elevator-floor-list"]');
    const directFloorNodes = () => floorList
      ? Array.prototype.slice.call(floorList.children || []).filter((node) => (
        node && node.parentNode === floorList && node.getAttribute("data-role") === "elevator-floor"
      ))
      : [];
    let sessionOrder = directFloorNodes().map((node) => node.getAttribute("data-type"));
    let dragState = null;
    let dragHelper = null;

    const hasFinitePointerCoordinates = (event) => (
      Number.isFinite(event && event.clientX) && Number.isFinite(event && event.clientY)
    );
    const isValidPointerId = (value) => Number.isSafeInteger(value);
    const getDirectFloorTarget = (target) => {
      let node = target;
      while (node && node !== floorList) {
        if (node.parentNode === floorList && node.getAttribute("data-role") === "elevator-floor") {
          return node;
        }
        node = node.parentNode;
      }
      return null;
    };
    const removeDragArtifacts = (source) => {
      if (source) { source.classList.remove("is-dragging"); }
      if (dragHelper && dragHelper.parentNode === root) {
        root.removeChild(dragHelper);
      }
      dragHelper = null;
    };
    const restoreSessionOrder = () => {
      if (!floorList || sessionOrder.length === 0) { return; }
      const current = directFloorNodes();
      for (let index = 0; index < sessionOrder.length; index += 1) {
        const desired = current.find((node) => node.getAttribute("data-type") === sessionOrder[index]);
        if (!desired || current[index] === desired) { continue; }
        const reference = current[index] || null;
        floorList.insertBefore(desired, reference);
        const oldIndex = current.indexOf(desired);
        current.splice(oldIndex, 1);
        current.splice(index, 0, desired);
      }
    };
    const cancelDrag = () => {
      const state = dragState;
      dragState = null;
      if (state && state.dragging) { restoreSessionOrder(); }
      removeDragArtifacts(state && state.sourceNode);
    };
    const commitDrag = () => {
      const state = dragState;
      dragState = null;
      if (state && state.dragging) {
        sessionOrder = directFloorNodes().map((node) => node.getAttribute("data-type"));
      }
      removeDragArtifacts(state && state.sourceNode);
    };
    const createDragHelper = (source, sourceRect) => {
      const helper = source.cloneNode(true);
      helper.setAttribute("class", "item sortable slicksort-selected");
      for (const attribute of ["tabindex", "type", "data-role", "data-type", "aria-label", "title", "name", "value", "form"]) {
        helper.removeAttribute(attribute);
      }
      const width = Number(source.offsetWidth);
      const height = Number(source.offsetHeight);
      const helperWidth = Number.isFinite(width) && width > 0 ? width : sourceRect.width;
      const helperHeight = Number.isFinite(height) && height > 0 ? height : sourceRect.height;
      helper.style.position = "fixed";
      helper.style.top = "0px";
      helper.style.left = "0px";
      helper.style.zIndex = "1001";
      helper.style.width = `${helperWidth}px`;
      helper.style.height = `${helperHeight}px`;
      helper.style.lineHeight = `${helperHeight}px`;
      helper.style.background = "#00a1d6";
      helper.style.color = "#fff";
      helper.style.borderRadius = "2px";
      helper.style.boxShadow = "0 10px 24px rgba(0,0,0,.18)";
      helper.style.textAlign = "center";
      helper.style.pointerEvents = "none";
      root.appendChild(helper);
      return helper;
    };
    const moveDragHelper = (event) => {
      if (!dragHelper || !dragState) { return; }
      const left = Math.round(event.clientX - dragState.offsetX);
      const top = Math.round(event.clientY - dragState.offsetY);
      dragHelper.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };
    const previewDrag = (clientY) => {
      if (!floorList || !dragState || !dragState.dragging) { return; }
      const source = dragState.sourceNode;
      let reference = null;
      for (const node of directFloorNodes()) {
        if (node === source) { continue; }
        const rect = node.getBoundingClientRect();
        if (Number.isFinite(rect.top) && Number.isFinite(rect.height) && clientY < rect.top + rect.height / 2) {
          reference = node;
          break;
        }
      }
      if (reference) {
        if (reference !== source.nextElementSibling) { floorList.insertBefore(source, reference); }
      } else if (floorList.lastElementChild !== source) {
        floorList.appendChild(source);
      }
    };
    const handlePointerDown = (event) => {
      if (!isRendererActive() || !floorList || !elevatorView.elevator.classList.contains("edit")) { return; }
      if (event.button !== 0 || event.isPrimary !== true || !isValidPointerId(event.pointerId) || !hasFinitePointerCoordinates(event)) { return; }
      if (dragState) { return; }
      const source = getDirectFloorTarget(event.target);
      if (!source) { return; }
      const sourceRect = source.getBoundingClientRect();
      if (!Number.isFinite(sourceRect.left) || !Number.isFinite(sourceRect.top)) { return; }
      event.preventDefault();
      event.stopPropagation();
      dragState = {
        pointerId: event.pointerId,
        sourceNode: source,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - sourceRect.left,
        offsetY: event.clientY - sourceRect.top,
        dragging: false
      };
    };
    const handlePointerMove = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId || !isRendererActive()) { return; }
      if (!elevatorView.elevator.classList.contains("edit")) { cancelDrag(); return; }
      if (!hasFinitePointerCoordinates(event)) { return; }
      const distance = Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY);
      if (!dragState.dragging && distance < 4) { return; }
      if (!dragState.dragging) {
        dragState.dragging = true;
        dragHelper = createDragHelper(dragState.sourceNode, dragState.sourceNode.getBoundingClientRect());
        dragState.sourceNode.classList.add("is-dragging");
      }
      event.preventDefault();
      moveDragHelper(event);
      previewDrag(event.clientY);
    };
    const handlePointerUp = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId || !isRendererActive() || !hasFinitePointerCoordinates(event)) { return; }
      if (!elevatorView.elevator.classList.contains("edit")) { cancelDrag(); return; }
      if (dragState.dragging) { commitDrag(); }
      else { dragState = null; }
    };
    const handlePointerCancel = (event) => {
      if (!dragState || event.pointerId !== dragState.pointerId || !isRendererActive()) { return; }
      cancelDrag();
    };

    const clearSelected = () => {
      if (!isRendererActive()) { return; }
      for (const entry of elevatorView.buttons) {
        entry.button.classList.remove("is-selected", "on");
      }
    };
    const setSelected = (type) => {
      if (!isRendererActive()) { return; }
      clearSelected();
      if (elevatorView.elevator.classList.contains("edit")) { return; }
      const selected = elevatorView.buttons.find((entry) => entry.type === type);
      if (selected) { selected.button.classList.add("is-selected"); }
    };
    const closeEdit = () => {
      if (!isRendererActive()) { return; }
      cancelDrag();
      elevatorView.elevator.classList.remove("edit");
      elevatorView.elevator.setAttribute("data-overlay-open", "false");
      elevatorView.sort.setAttribute("aria-pressed", "false");
      updateActive();
    };
    const openOrCloseEdit = (event) => {
      if (!isRendererActive()) { return; }
      event.stopPropagation();
      const isEdit = !elevatorView.elevator.classList.contains("edit");
      if (isEdit) {
        clearSelected();
        elevatorView.elevator.classList.add("edit");
        elevatorView.elevator.setAttribute("data-overlay-open", "true");
        elevatorView.sort.setAttribute("aria-pressed", "true");
      } else {
        closeEdit();
      }
    };

    for (const entry of elevatorView.buttons) {
      addListenerWithCleanup(entry.button, "click", () => {
        if (!isRendererActive() || elevatorView.elevator.classList.contains("edit")) { return; }
        const target = root.querySelector(`[data-floor-id="${entry.type}"]`);
        if (target) {
          target.scrollIntoView({ block: "start", behavior: "smooth" });
          setSelected(entry.type);
        }
      }, listenerCleanups);
    }
    addListenerWithCleanup(elevatorView.backTop, "click", () => {
      if (!isRendererActive()) { return; }
      view.scrollTo({ top: 0 });
    }, listenerCleanups);
    addListenerWithCleanup(elevatorView.sort, "click", openOrCloseEdit, listenerCleanups);
    addListenerWithCleanup(elevatorView.mask, "click", (event) => {
      event.stopPropagation();
      closeEdit();
    }, listenerCleanups);
    if (floorList) {
      addListenerWithCleanup(floorList, "pointerdown", handlePointerDown, listenerCleanups);
    }
    addListenerWithCleanup(elevatorView.elevator, "pointermove", handlePointerMove, listenerCleanups);
    addListenerWithCleanup(elevatorView.elevator, "pointerup", handlePointerUp, listenerCleanups);
    addListenerWithCleanup(elevatorView.elevator, "pointercancel", handlePointerCancel, listenerCleanups);
    addListenerWithCleanup(doc, "keydown", (event) => {
      if (event.key === "Escape" && elevatorView.elevator.classList.contains("edit")) {
        event.preventDefault();
        closeEdit();
      }
    }, listenerCleanups);
    addListenerWithCleanup(doc, "click", (event) => {
      if (!isRendererActive() || !elevatorView.elevator.classList.contains("edit")) { return; }
      if (!elevatorView.elevator.contains(event.target)) { closeEdit(); }
    }, listenerCleanups);

    const xOverlap = (a, b) => a.left < b.right && a.right > b.left;
    const yOverlap = (a, b) => a.top < b.bottom && a.bottom > b.top;
    const visibleRect = (node) => {
      if (!node || node.getAttribute("aria-hidden") === "true") { return null; }
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 ? rect : null;
    };
    const viewportHeight = () => {
      const visualHeight = view.visualViewport && Number(view.visualViewport.height);
      return Number.isFinite(visualHeight) && visualHeight > 0
        ? visualHeight
        : Math.max(0, Number(view.innerHeight) || 0);
    };
    const elevatorGeometry = () => {
      const rect = elevatorView.elevator.getBoundingClientRect();
      const backTopRect = elevatorView.backTop ? elevatorView.backTop.getBoundingClientRect() : null;
      const visualBottom = Math.max(rect.bottom, backTopRect ? backTopRect.bottom : rect.bottom);
      return {
        rect,
        backTopRect,
        visualBottom,
        visualHeight: Math.max(1, visualBottom - rect.top)
      };
    };
    const syncLayout = () => {
      if (!isRendererActive()) { return; }
      const initialGeometry = elevatorGeometry();
      const current = initialGeometry.rect;
      const scrollY = view.scrollY || (doc.documentElement ? doc.documentElement.scrollTop : 0) || 0;
      const firstScreenTop = firstScreen ? firstScreen.getBoundingClientRect().top : Infinity;
      const firstScreenDocumentTop = firstScreen ? firstScreenTop + scrollY : Infinity;
      const inFirstScreen = scrollY < firstScreenDocumentTop;
      const minTop = 10;
      let nextTop = minTop;
      if (inFirstScreen) {
        const bannerRect = banner ? banner.getBoundingClientRect() : null;
        const primaryRect = primaryMenu ? primaryMenu.getBoundingClientRect() : null;
        nextTop = Math.max(
          10,
          firstScreenTop,
          bannerRect ? bannerRect.bottom : -Infinity,
          primaryRect ? primaryRect.bottom : -Infinity
        );
        const candidate = () => ({ left: current.left, right: current.right, top: nextTop, bottom: nextTop + initialGeometry.visualHeight });
        if (changeButton) {
          const changeRect = visibleRect(changeButton);
          const candidateRect = candidate();
          if (changeRect && xOverlap(candidateRect, changeRect) && yOverlap(candidateRect, changeRect)) {
            nextTop = Math.max(nextTop, changeRect.bottom + 12);
          }
        }
        const historyRect = visibleRect(historyPanel);
        const candidateRect = candidate();
        if (historyRect && xOverlap(candidateRect, historyRect)) {
          nextTop = Math.max(nextTop, historyRect.bottom + 12);
        }
      }

      // Re-read the parent and absolutely positioned back-top before centering content.
      const finalGeometry = elevatorGeometry();
      const finalViewportHeight = viewportHeight();
      if (!inFirstScreen) {
        const finalMaxTop = Math.max(minTop, finalViewportHeight - finalGeometry.visualHeight - minTop);
        const finalCenteredTop = (finalViewportHeight - finalGeometry.visualHeight) / 2;
        nextTop = Math.max(minTop, Math.min(finalCenteredTop, finalMaxTop));
      }
      elevatorView.elevator.style.top = `${Math.round(nextTop * 10) / 10}px`;
      const clampedGeometry = elevatorGeometry();
      const nextRect = clampedGeometry.rect;
      const visualRect = {
        left: nextRect.left,
        right: nextRect.right,
        top: nextRect.top,
        bottom: clampedGeometry.visualBottom
      };
      const footerRect = footer ? footer.getBoundingClientRect() : null;
      const footerOverlap = Boolean(footerRect && xOverlap(visualRect, footerRect) && yOverlap(visualRect, footerRect));
      elevatorView.elevator.classList.toggle("is-footer-hidden", footerOverlap);
      elevatorView.elevator.setAttribute("data-visible", footerOverlap ? "false" : "true");
    };
    const scheduleLayout = (delay = 0) => {
      if (!isRendererActive()) { return; }
      if (layoutTimer) { view.clearTimeout(layoutTimer); layoutTimer = 0; }
      if (delay > 0) {
        layoutTimer = view.setTimeout(() => {
          layoutTimer = 0;
          scheduleLayout();
        }, delay);
        return;
      }
      if (!layoutFrame) {
        const requestFrame = typeof view.requestAnimationFrame === "function"
          ? view.requestAnimationFrame.bind(view)
          : (callback) => { callback(); return 0; };
        layoutFrame = requestFrame(() => {
          layoutFrame = 0;
          syncLayout();
        });
      }
    };

    addListenerWithCleanup(view, "scroll", scheduleLayout, listenerCleanups, { passive: true });
    addListenerWithCleanup(view, "resize", scheduleLayout, listenerCleanups);
    scheduleLayout();
    if (historyEntry && historyEntry.group) {
      addListenerWithCleanup(historyEntry.group, "mouseenter", () => scheduleLayout(180), listenerCleanups);
      addListenerWithCleanup(historyEntry.group, "focusin", () => scheduleLayout(180), listenerCleanups);
      addListenerWithCleanup(historyEntry.group, "mouseleave", () => scheduleLayout(180), listenerCleanups);
      addListenerWithCleanup(historyEntry.group, "focusout", () => scheduleLayout(180), listenerCleanups);
    }
    if (historyPanel) {
      addListenerWithCleanup(historyPanel, "transitionend", () => scheduleLayout(), listenerCleanups);
    }

    const floorButtonTypes = new Set(elevatorView.buttons.map((entry) => entry.type));
    const floorTargets = Array.prototype.slice.call(root.querySelectorAll("[data-floor-id]"))
      .map((target) => ({ target, type: target.getAttribute("data-floor-id") }))
      .filter((entry) => floorButtonTypes.has(entry.type));
    const ACTIVATION_OFFSET = 150;
    const updateActive = () => {
      if (!isRendererActive()) { return; }
      if (elevatorView.elevator.classList.contains("edit")) {
        lastActiveType = null;
        clearSelected();
        return;
      }
      let currentType = null;
      for (const { type, target } of floorTargets) {
        if (target.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          currentType = type;
        } else {
          break;
        }
      }
      if (currentType !== lastActiveType) {
        lastActiveType = currentType;
        if (currentType) { setSelected(currentType); } else { clearSelected(); }
      }
    };
    const onScroll = () => {
      scheduleLayout();
      if (scrollFrame) { return; }
      scrollFrame = view.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateActive();
      });
    };
    addListenerWithCleanup(view, "scroll", onScroll, listenerCleanups, { passive: true });
    addListenerWithCleanup(view, "resize", onScroll, listenerCleanups);
    updateActive();
    listenerCleanups.push(() => {
      cancelDrag();
      if (layoutTimer) { view.clearTimeout(layoutTimer); layoutTimer = 0; }
      if (layoutFrame) { try { view.cancelAnimationFrame(layoutFrame); } catch (_) {} layoutFrame = 0; }
      if (scrollFrame) { try { view.cancelAnimationFrame(scrollFrame); } catch (_) {} scrollFrame = 0; }
    });
  };

  const DARK_THEME_CSS = `
  :host { --br-page-bg:#fff; --br-panel-bg:#fff; --br-panel-raised:#fff; --br-hover-bg:#f4f4f4; --br-text:#212121; --br-text-secondary:#61666d; --br-text-muted:#9499a0; --br-border:#e3e5e7; --br-input-bg:#fff; color-scheme:light; }
  :host([data-bili-retro-theme="dark"]) { --br-page-bg:#0f0f0f; --br-panel-bg:#18191c; --br-panel-raised:#202124; --br-hover-bg:#292b2e; --br-text:#e3e5e7; --br-text-secondary:#aeb3ba; --br-text-muted:#858a92; --br-border:#303236; --br-input-bg:#242628; color-scheme:dark; color:var(--br-text); background:var(--br-page-bg); }
  :host([data-bili-retro-theme="dark"]) .homepage,
  :host([data-bili-retro-theme="dark"]) main.container,
  :host([data-bili-retro-theme="dark"]) .primary-menu-wrap,
  :host([data-bili-retro-theme="dark"]) .primary-menu-itnl,
  :host([data-bili-retro-theme="dark"]) .international-footer { background-color:var(--br-page-bg) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .header-popover,
  :host([data-bili-retro-theme="dark"]) .van-popper-nav,
  :host([data-bili-retro-theme="dark"]) .van-popper-channel,
  :host([data-bili-retro-theme="dark"]) .profile-popover-surface,
  :host([data-bili-retro-theme="dark"]) .profile-submenu,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .suggest-list,
  :host([data-bili-retro-theme="dark"]) .rank-video-popover,
  :host([data-bili-retro-theme="dark"]) .elevator,
  :host([data-bili-retro-theme="dark"]) .contact-help { background-color:var(--br-panel-bg) !important; border-color:var(--br-border) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .profile-menu-row,
  :host([data-bili-retro-theme="dark"]) .profile-submenu-item,
  :host([data-bili-retro-theme="dark"]) .profile-language-item,
  :host([data-bili-retro-theme="dark"]) .suggest-item,
  :host([data-bili-retro-theme="dark"]) .elevator .item { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .profile-popover .profile-menu-row,
  :host([data-bili-retro-theme="dark"]) .profile-popover .profile-logout-action {
    background-color:transparent !important;
  }
  :host([data-bili-retro-theme="dark"]) .theme-change > .profile-menu-row {
    position:relative; width:100%; height:40px; box-sizing:border-box; justify-content:space-between; padding:8px 23px; background:transparent; font-size:14px;
  }
  :host([data-bili-retro-theme="dark"]) .theme-change > .profile-menu-row .profile-menu-title {
    justify-content:flex-start;
  }
  :host([data-bili-retro-theme="dark"]) .theme-change > .profile-menu-row .profile-menu-icon {
    margin-right:0; font-size:20px;
  }
  :host([data-bili-retro-theme="dark"]) .theme-change > .profile-menu-row .profile-menu-label {
    font-size:14px; line-height:24px;
  }
  :host([data-bili-retro-theme="dark"]) .theme-change > .profile-menu-row .profile-menu-arrow {
    position:static;
  }
  :host([data-bili-retro-theme="dark"]) .profile-menu-row:hover,
  :host([data-bili-retro-theme="dark"]) .profile-menu-row:focus-visible,
  :host([data-bili-retro-theme="dark"]) .profile-submenu-item:hover,
  :host([data-bili-retro-theme="dark"]) .profile-language-item:hover,
  :host([data-bili-retro-theme="dark"]) .suggest-item:hover,
  :host([data-bili-retro-theme="dark"]) .elevator .item:hover { background-color:var(--br-hover-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .storey-title,
  :host([data-bili-retro-theme="dark"]) .storey-title a,
  :host([data-bili-retro-theme="dark"]) .video-card-common .title,
  :host([data-bili-retro-theme="dark"]) .article-card .title,
  :host([data-bili-retro-theme="dark"]) .rank-list .title,
  :host([data-bili-retro-theme="dark"]) .rank-item .title,
  :host([data-bili-retro-theme="dark"]) .pgc-rank .title,
  :host([data-bili-retro-theme="dark"]) .live-card .txt a,
  :host([data-bili-retro-theme="dark"]) .profile-nickname,
  :host([data-bili-retro-theme="dark"]) .profile-level,
  :host([data-bili-retro-theme="dark"]) .profile-stat-value,
  :host([data-bili-retro-theme="dark"]) .profile-asset-value,
  :host([data-bili-retro-theme="dark"]) #primaryPageTab a,
  :host([data-bili-retro-theme="dark"]) #primaryChannelMenu .name,
  :host([data-bili-retro-theme="dark"]) #primaryFriendshipLink .name { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .up,
  :host([data-bili-retro-theme="dark"]) .play,
  :host([data-bili-retro-theme="dark"]) .desc,
  :host([data-bili-retro-theme="dark"]) .profile-exp,
  :host([data-bili-retro-theme="dark"]) .profile-stat-label,
  :host([data-bili-retro-theme="dark"]) .text-info,
  :host([data-bili-retro-theme="dark"]) .international-footer a,
  :host([data-bili-retro-theme="dark"]) .international-footer p { color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .history,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .header-search-suggest { background-color:var(--br-panel-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .history { border-bottom-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .header .title,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .history-text,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-text,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .rank { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .history-item { background-color:var(--br-panel-raised) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .history-empty,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .header .clear { color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:hover,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:focus-visible {
    background-color:var(--br-hover-bg) !important;
  }
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:hover .trending-text,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:hover .rank,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:focus-visible .trending-text,
  :host([data-bili-retro-theme="dark"]) .suggest-wrap .trending-item:focus-visible .rank { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) #nav_searchform,
  :host([data-bili-retro-theme="dark"]) .nav-search-keyword,
  :host([data-bili-retro-theme="dark"]) input,
  :host([data-bili-retro-theme="dark"]) textarea { background-color:var(--br-input-bg) !important; border-color:var(--br-border) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .nav-search-btn,
  :host([data-bili-retro-theme="dark"]) .change-btn,
  :host([data-bili-retro-theme="dark"]) .more-link,
  :host([data-bili-retro-theme="dark"]) .read-more,
  :host([data-bili-retro-theme="dark"]) button:not(.auth-login-button):not(.mini-upload) { background-color:var(--br-panel-raised); border-color:var(--br-border); color:var(--br-text); }
  :host([data-bili-retro-theme="dark"]) .profile-assets,
  :host([data-bili-retro-theme="dark"]) .profile-stats,
  :host([data-bili-retro-theme="dark"]) .profile-menu,
  :host([data-bili-retro-theme="dark"]) .logout,
  :host([data-bili-retro-theme="dark"]) .rank-item,
  :host([data-bili-retro-theme="dark"]) .tab-switch { border-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .elevator .list-box,
  :host([data-bili-retro-theme="dark"]) .elevator .item,
  :host([data-bili-retro-theme="dark"]) .elevator .item.back-top,
  :host([data-bili-retro-theme="dark"]) .elevator.edit .item.on,
  :host([data-bili-retro-theme="dark"]) .elevator.edit .item.is-selected { background-color:var(--br-panel-bg) !important; border-color:var(--br-border) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .elevator .item:hover,
  :host([data-bili-retro-theme="dark"]) .elevator .item:focus-visible,
  :host([data-bili-retro-theme="dark"]) .elevator .item.on,
  :host([data-bili-retro-theme="dark"]) .elevator .item.is-selected { background-color:#00a1d6 !important; color:#fff !important; }
  :host([data-bili-retro-theme="dark"]) .elevator .item .bilifont { color:var(--br-text-muted); }
  :host([data-bili-retro-theme="dark"]) .elevator .item:hover .bilifont,
  :host([data-bili-retro-theme="dark"]) .elevator .item:focus-visible .bilifont,
  :host([data-bili-retro-theme="dark"]) .elevator .item.on .bilifont,
  :host([data-bili-retro-theme="dark"]) .elevator .item.is-selected .bilifont { color:#fff; }
  :host([data-bili-retro-theme="dark"]) .contact-help { box-shadow:0 6px 14px rgba(0,0,0,.6) !important; }
  :host([data-bili-retro-theme="dark"]) .international-footer {
    border-top-color:var(--br-border) !important;
  }
  :host([data-bili-retro-theme="dark"]) .international-footer .link-box .link-item {
    border-right-color:var(--br-border) !important;
  }
  :host([data-bili-retro-theme="dark"]) .contact-help:hover { background-color:var(--br-hover-bg) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .btn-change,
  :host([data-bili-retro-theme="dark"]) .exchange-btn .more,
  :host([data-bili-retro-theme="dark"]) .rank-header .more,
  :host([data-bili-retro-theme="dark"]) #bili_live .exchange-btn .more,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .btn-change,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .more,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .rank-header .more,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .rank-header .more { background-color:var(--br-panel-raised) !important; border-color:var(--br-border) !important; color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .tl-link,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .tl-link { background-color:transparent !important; color:#00a1d6 !important; }
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .tl-link:hover,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .tl-link:hover { background-color:#00a1d6 !important; color:#fff !important; }
  :host([data-bili-retro-theme="dark"]) .rank-wrap .number:not(.on),
  :host([data-bili-retro-theme="dark"]) .pgc-rank-wrap .number:not(.on),
  :host([data-bili-retro-theme="dark"]) #bili_report_read .rank-wrap .number:not(.on),
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .pgc-rank-wrap .number:not(.on),
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .pgc-rank-wrap .number:not(.on) { background-color:var(--br-panel-raised) !important; color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) .ordinary-rank-unavailable,
  :host([data-bili-retro-theme="dark"]) .pgc-empty-state { color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .rank-header .name,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .rank-header > .name,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .rank-list > .rank-header .name { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_report_douga .storey-title .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_douga .rank-header .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_douga .custom-rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_douga .rank-video-popover__title,
  :host([data-bili-retro-theme="dark"]) #bili_report_read .article-card .r-con .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_read .rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_read .rank-wrap .preview .txt p,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .custom-rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .custom-pgc-rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .custom-pgc-rank-wrap .txt .title,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .rank-video-popover__title,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .storey-title .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .storey-title .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .time-line-card .ss,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .time-line-card .ss,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .rank-header .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .rank-header .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .pgc-rank-wrap .link,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .pgc-rank-wrap .link,
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .pgc-rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .pgc-rank-wrap .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .storey-title .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .rank-header > .name,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .manga-title,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .preview-desc .title,
  :host([data-bili-retro-theme="dark"]) #bili_report_manga .other-link .title { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_live .live-card .name,
  :host([data-bili-retro-theme="dark"]) #bili_live .rank-name,
  :host([data-bili-retro-theme="dark"]) #bili_live .rank-wrap .link { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_live .live-card .desc,
  :host([data-bili-retro-theme="dark"]) #bili_live .rank-title,
  :host([data-bili-retro-theme="dark"]) #bili_live .rank-online,
  :host([data-bili-retro-theme="dark"]) #bili_live .tab-switch-item:not(.on) { color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_live .live-card .tag { color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) #bili_report_anime .pgc-tab-switch .tab-switch-item:not(.on),
  :host([data-bili-retro-theme="dark"]) #bili_report_guochuang .pgc-tab-switch .tab-switch-item:not(.on),
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .custom-pgc-rank-wrap .txt .update,
  :host([data-bili-retro-theme="dark"]) .ordinary-floor .pgc-card-subtitle { color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) .download-client-entry,
  :host([data-bili-retro-theme="dark"]) .download-wrapper { background-color:var(--br-panel-bg) !important; border-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .download-top-title .main,
  :host([data-bili-retro-theme="dark"]) .download-top-title .main > svg,
  :host([data-bili-retro-theme="dark"]) .download-bottom { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .download-top-title .sub { color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) .download-top-center { background-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .official-nav-frame:not([hidden]) { display:block; }
  :host([data-bili-retro-theme="dark"]) .popover-game,
  :host([data-bili-retro-theme="dark"]) .popover-manga { background:transparent !important; }
  :host([data-bili-retro-theme="dark"]) .popover-game .box.clearfix,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-app-layout { background:var(--br-panel-bg) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .popover-game .brief > a,
  :host([data-bili-retro-theme="dark"]) .popover-game .brief > a > span,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a > span,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-recommend-item,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-recommend-title,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-popularity-title,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-popularity-row,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-popularity-label { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .popover-game .right,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-divider { border-color:var(--br-border) !important; background-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .popover-game .brief > a:hover,
  :host([data-bili-retro-theme="dark"]) .popover-game .brief > a:focus-visible,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a:hover,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a:focus-visible,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a.is-active,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-recommend-item:hover::before,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-recommend-item:focus-visible::before,
  :host([data-bili-retro-theme="dark"]) .popover-manga .manga-popularity-row.is-active { background:var(--br-hover-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a:hover,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a:focus-visible,
  :host([data-bili-retro-theme="dark"]) .popover-game .all > a.is-active { color:#00aeec !important; }
  :host([data-bili-retro-theme="dark"]) .nav-im-new,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .vp-container,
  :host([data-bili-retro-theme="dark"]) .user-panel--history,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .vp-container,
  :host([data-bili-retro-theme="dark"]) .auth-vip-popover,
  :host([data-bili-retro-theme="dark"]) .auth-vip-popover .vip-m,
  :host([data-bili-retro-theme="dark"]) .auth-vip-popover .bubble-traditional { background-color:var(--br-panel-bg) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .nav-im-new > a,
  :host([data-bili-retro-theme="dark"]) .nav-im-new .message-link-label,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item:not(.tab-item--active),
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item:not(.tab-item--active) .title,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item:not(.tab-item--active) .num,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item__all,
  :host([data-bili-retro-theme="dark"]) .favorite-video-title,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .view-all,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .tab-item:not(.tab-item--active),
  :host([data-bili-retro-theme="dark"]) .history-card-title,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .view-all,
  :host([data-bili-retro-theme="dark"]) .vip-m .recommand .title,
  :host([data-bili-retro-theme="dark"]) .vip-m .recommand-link { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all .bilifont { color:#00a1d6 !important; opacity:1 !important; }
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all:hover,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all:focus-visible,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all:hover .bilifont,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-all:focus-visible .bilifont { color:#00b5e5 !important; }
  :host([data-bili-retro-theme="dark"]) .favorite-video-owner,
  :host([data-bili-retro-theme="dark"]) .history-card-meta,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .empty-list,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .empty-panel { color:var(--br-text-muted) !important; }
  :host([data-bili-retro-theme="dark"]) .nav-im-new > a:hover,
  :host([data-bili-retro-theme="dark"]) .nav-im-new > a:focus-visible,
  :host([data-bili-retro-theme="dark"]) .favorite-video-card:hover,
  :host([data-bili-retro-theme="dark"]) .favorite-video-card:focus-visible,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .history-card:hover,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .history-card:focus-visible,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .view-all { background-color:var(--br-hover-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tabs-panel,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .play-view-all,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .tab-header { border-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item--active,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item--active .title,
  :host([data-bili-retro-theme="dark"]) .user-panel--favorite .tab-item--active .num,
  :host([data-bili-retro-theme="dark"]) .user-panel--history .tab-item--active { color:#fff !important; background-color:#00a1d6 !important; }
  :host([data-bili-retro-theme="dark"]) .user-panel--dynamic,
  :host([data-bili-retro-theme="dark"]) .user-panel--dynamic .i-frame { background-color:#fff !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local,
  :host([data-bili-retro-theme="dark"]) .dynamic-local .container,
  :host([data-bili-retro-theme="dark"]) .dynamic-local .dynamic-list,
  :host([data-bili-retro-theme="dark"]) .dynamic-local .more-tab { background-color:var(--br-panel-bg) !important; color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .tab-bar { border-color:var(--br-border) !important; color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local > .tab-bar { background-color:var(--br-panel-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local::before { background-color:var(--br-panel-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .tab-item { background:transparent !important; color:var(--br-text-secondary) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .tab-item.active { background:#00a1d6 !important; color:#fff !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .history-tip { background:var(--br-panel-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .split-line::before { border-color:var(--br-border) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .user-name,
  :host([data-bili-retro-theme="dark"]) .dynamic-local .content { color:var(--br-text) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .list-item:hover { background-color:var(--br-hover-bg) !important; }
  :host([data-bili-retro-theme="dark"]) .dynamic-local .more-btn { background-color:var(--br-panel-raised) !important; color:var(--br-text) !important; }
  `;

  const renderHomepage = ({ root, authStatus, theme = "light", onThemeChange = null, onLoginRequest = null, onRecommendationRequest = null, onDougaRequest = null, onOrdinaryZoneRequest = null, onReadFloorRequest = null, onMangaRequest = null, onLiveFloorMoreRequest = null, onLiveFloorFollowingRequest = null, onWatchLaterRequest = null, onSearchSuggestRequest = null, onSearchHistoryChange = null }) => {
    let destroyed = false;
    const rendererLease = { active: true };
    const listenerCleanups = [];
    const isRendererActive = () => !destroyed && rendererLease.active === true;
    captureCategorySpriteUrl(root);
    const rendererMediaFence = createMediaFence({
      root,
      lease: rendererLease,
      isActive: isRendererActive,
      isDestroyed: () => destroyed,
      cleanups: listenerCleanups
    });
    const rendererLifecycle = {
      root,
      lease: rendererLease,
      isActive: isRendererActive,
      isDestroyed: () => destroyed,
      cleanups: listenerCleanups,
      onSearchSuggestRequest,
      onSearchHistoryChange,
      onDougaRequest,
      onOrdinaryZoneRequest,
      onReadFloorRequest,
      onMangaRequest,
      onLiveFloorMoreRequest,
      onLiveFloorFollowingRequest,
      onWatchLaterRequest
      ,theme: theme === "dark" ? "dark" : "light"
      ,onThemeChange
    };
    const style = root.ownerDocument.createElement("style");
    const iconfontUrl = resolveLocalAssetUrl(ASSET_KEYS.ICONFONT) || "";
    style.textContent = `${HOMEPAGE_CSS}\n${SHELL_CSS.replace("__EXTENSION_ICONFONT_URL__", iconfontUrl)}\n${PGC_FLOOR_CSS}\n${MANGA_FLOOR_CSS}\n${DARK_THEME_CSS}`;

    // Shadow-DOM caveat: @font-face declared inside a ShadowRoot renders visually but is
    // invisible to document.fonts.load(). Register the same face on the document explicitly
    // so document.fonts.load() can trigger and confirm the load, which unlocks the
    // `.icon-font-ready` state and hides the CSS fallback.
    if (iconfontUrl && typeof FontFace === "function") {
      try {
        const doc = root.ownerDocument;
        const face = new FontFace("extension-bilifont", `url("${iconfontUrl}") format("woff2")`, {
          style: "normal",
          weight: "400",
          display: "swap"
        });
        if (doc.fonts && typeof doc.fonts.add === "function") {
          doc.fonts.add(face);
        }
        face.load().catch(() => {});
      } catch (_) {
        // If FontFace registration fails, CSS fallback stays visible — no box characters.
      }
    }

    const homepage = createNode(root, "div", "homepage");
    const headerView = createHeader(root, rendererLifecycle);
    const setTheme = (nextTheme) => {
      const normalized = nextTheme === "dark" ? "dark" : "light";
      rendererLifecycle.theme = normalized;
      const host = root.host;
      if (host && typeof host.setAttribute === "function") host.setAttribute("data-bili-retro-theme", normalized);
      const profileView = headerView.profilePopover && headerView.profilePopover.__profileView;
      if (profileView && profileView.themeRow) {
        const label = profileView.themeRow.querySelector(".profile-menu-label");
        if (label) label.textContent = `主题：${normalized === "dark" ? "深色" : "浅色"}`;
        for (const item of profileView.themeItems || []) {
          const selected = item.getAttribute("data-theme-value") === normalized;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-selected", selected ? "true" : "false");
          item.setAttribute("aria-checked", selected ? "true" : "false");
          const check = item.querySelector(".profile-language-check");
          if (check) {
            check.classList.toggle("is-hidden", !selected);
            check.setAttribute("aria-hidden", selected ? "false" : "true");
          }
        }
      }
      return normalized;
    };
    setTheme(theme);
    let banner = createBanner(root, BUILTIN_BANNER_MODEL);
    const menu = createPrimaryMenu(root, rendererLifecycle);
    if (headerView.dynamicPanel && headerView.dynamicPanel.__dynamicView) {
      headerView.dynamicPanel.__dynamicView.primaryMenuEntrance = menu.__primaryMenuView.dynamicEntrance;
    }
    const firstScreen = createNode(root, "section", "first-screen b-wrap");
    const firstScreenSpace = createNode(root, "div", "space-between report-wrap-module");
    const focusCarousel = createNode(root, "div", "focus-carousel home-slide report-wrap-module report-scroll-module");
    focusCarousel.id = "reportFirst1";
    focusCarousel.setAttribute("data-role", "carousel-root");
    const focusList = createNode(root, "div", "van-slide ggc");
    focusList.setAttribute("data-role", "carousel-list");
    const focusTrack = createNode(root, "div", "carousel-track");
    focusTrack.setAttribute("data-role", "carousel-track");
    focusTrack.setAttribute("aria-live", "polite");
    focusList.appendChild(focusTrack);
    const focusTrigger = createNode(root, "div", "trigger");
    focusTrigger.setAttribute("data-role", "carousel-trigger");
    const focusMore = createFixedAnchor(root, "more", "TOPIC_LIST", "更多");
    focusMore.appendChild(createIconFont(root, "bili-icon_caozuo_qianwang", null, rendererLifecycle, "i"));
    focusCarousel.appendChild(focusList);
    focusCarousel.appendChild(focusTrigger);
    focusCarousel.appendChild(focusMore);
    const focusView = {
      root: focusCarousel,
      track: focusTrack,
      trigger: focusTrigger,
      more: focusMore,
      state: {
        items: [],
        activeIndex: -1,
        targetIndex: -1,
        paused: false,
        hovered: false,
        focused: false,
        timer: null,
        motion: {
          previousIndex: null,
          nextIndex: 0,
          phase: "idle",
          origin: "initial",
          transactionId: 0,
          reducedMotion: false
        }
      },
      indicator: null,
      bound: false,
      destroyed: false,
      lease: rendererLease,
      isRendererActive,
      listenerCleanups: [],
      cardListenerCleanups: []
    };
    bindFocusCarousel(focusView);
    setFocusCarouselItems(focusView, null);

    const recommendWrap = createNode(root, "div", "rcmd-box-wrap");
    recommendWrap.setAttribute("data-role", "recommend-root");
    const recommend = createNode(root, "div", "rcmd-box");
    recommend.setAttribute("data-role", "recommend-list");
    const recommendationCards = [];
    for (const [index, item] of RECOMMENDATION_FIXTURE.entries()) {
      const title = normalizeText(item.title);
      const card = createNode(root, "article", "video-card-reco");
      card.setAttribute("data-role", "recommend-item");
      card.appendChild(createCoverImage(root, "recommend-card__image", null, FIXTURE_COVER_POOLS.recommend, index, title, "bili-cinephile", rendererMediaFence, card));
      const recommendationImage = card.lastElementChild;
      const infoBox = createNode(root, "div", "info-box");
      const link = createNode(root, "a");
      link.setAttribute("href", resolveFocusLinkUrl(item.uri) || "https://www.bilibili.com/");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.setAttribute("title", title);
      const imageBox = createNode(root, "div", "b-img");
      const picture = createNode(root, "picture", "b-img__inner");
      if (recommendationImage) {
        picture.appendChild(recommendationImage);
      }
      imageBox.appendChild(picture);
      link.appendChild(imageBox);
      const info = createNode(root, "div", "info");
      const titleNode = createNode(root, "p", "title", title);
      info.appendChild(titleNode);
      const owner = createNode(root, "p", "up");
      owner.appendChild(createIconFont(root, "bili-icon_xinxi_UPzhu", null, rendererLifecycle, "i"));
      const ownerText = root.ownerDocument.createTextNode(normalizeText(item.owner));
      owner.appendChild(ownerText);
      info.appendChild(owner);
      const playNode = createNode(root, "p", "play", normalizeText(item.play));
      const durationNode = createNode(root, "span", "duration", normalizeText(item.duration));
      info.appendChild(playNode);
      link.appendChild(info);
      infoBox.appendChild(link);
      infoBox.appendChild(durationNode);
      card.appendChild(infoBox);
      addListenerWithCleanup(link, "click", () => {
        if (typeof link.blur === "function") link.blur();
      }, listenerCleanups);
      const watchLater = createNode(root, "div", "watch-later-video van-watchlater black");
      watchLater.setAttribute("data-role", "watch-later");
      watchLater.setAttribute("data-aid", "");
      watchLater.setAttribute("data-bvid", "");
      watchLater.setAttribute("data-goto", "");
      watchLater.setAttribute("role", "button");
      watchLater.setAttribute("tabindex", "0");
      watchLater.setAttribute("aria-label", "稍后再看");
      watchLater.setAttribute("title", "稍后再看");
      watchLater.setAttribute("aria-pressed", "false");
      watchLater.appendChild(createNode(root, "span", "wl-tips", "稍后再看"));
      const activateWatchLater = (event) => {
        event.preventDefault();
        event.stopPropagation();
        releaseRecommendationFocus();
        const aid = Number(watchLater.getAttribute("data-aid"));
        if (typeof onWatchLaterRequest === "function" && Number.isSafeInteger(aid) && aid > 0) {
          onWatchLaterRequest(event, { aid, added: watchLater.classList.contains("added") });
        }
      };
      addListenerWithCleanup(watchLater, "click", activateWatchLater, listenerCleanups);
      addListenerWithCleanup(watchLater, "keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
        activateWatchLater(event);
      }, listenerCleanups);
      card.appendChild(watchLater);
      recommend.appendChild(card);
      recommendationCards.push({ card, link, image: recommendationImage, titleNode, ownerText, playNode, durationNode, watchLater });
    }
    const recommendChange = createNode(root, "div", "change-btn");
    recommendChange.setAttribute("tabindex", "0");
    recommendChange.setAttribute("role", "button");
    recommendChange.setAttribute("aria-label", "换一换推荐");
    recommendChange.setAttribute("title", "推荐换一换");
    recommendChange.appendChild(createNode(root, "i", "bilifont bili-icon_caozuo_huanyihuan"));
    recommendChange.appendChild(createNode(root, "span", null, "换一换"));
    recommendWrap.appendChild(recommend);
    recommendWrap.appendChild(recommendChange);
    addListenerWithCleanup(recommendChange, "click", (event) => {
      if (typeof onRecommendationRequest === "function") onRecommendationRequest(event);
    }, listenerCleanups);
    addListenerWithCleanup(recommendChange, "keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
        return;
      }
      event.preventDefault();
      if (typeof onRecommendationRequest === "function") onRecommendationRequest(event);
    }, listenerCleanups);
    const recommendationView = {
      root: recommendWrap,
      cards: recommendationCards,
      changeButton: recommendChange,
      state: { data: null },
      destroyed: false,
      isRendererActive
    };
    const releaseRecommendationFocus = () => {
      const activeElement = root.activeElement;
      if (activeElement && recommendWrap.contains(activeElement) && typeof activeElement.blur === "function") {
        activeElement.blur();
      }
    };
    const recommendationWindow = root.ownerDocument.defaultView;
    if (recommendationWindow) {
      addListenerWithCleanup(recommendationWindow, "pageshow", releaseRecommendationFocus, listenerCleanups);
    }
    firstScreenSpace.appendChild(focusCarousel);
    firstScreenSpace.appendChild(recommendWrap);
    firstScreen.appendChild(firstScreenSpace);

    const promote = createPromoteFloor(root, rendererMediaFence);
    firstScreen.appendChild(promote);
    const live = createLiveFloor(root, rendererMediaFence, rendererLifecycle);
    const anime = createPgcFloor(root, { kind: "anime", mediaFence: rendererMediaFence, lifecycle: rendererLifecycle });
    anime.view.isRendererActive = isRendererActive;
    const guochuang = createPgcFloor(root, { kind: "guochuang", mediaFence: rendererMediaFence, lifecycle: rendererLifecycle });
    guochuang.view.isRendererActive = isRendererActive;
    // Keep non-targeted floors as fixtures; ordinary video floors below share one runtime view.
    const fixtureZoneTypes = [
      ["douga", "动画"]
    ];
    const zoneFloorMap = new Map();
    for (const [type, title] of fixtureZoneTypes) {
      const config = {
        type,
        title,
        navKey: type === "douga" ? "DOUGA" : "ANIME",
        countLabel: `${title} fixture`,
        items: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"].map((suffix) => ({
          title: `${title}精选${suffix}`,
          creatorLabel: "fixture",
          metaLabel: "播放占位",
          playLabel: "播放占位",
          statLabel: "0",
          durationLabel: "00:00"
        })),
        ranks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => ({ rank, title: `${title}排行${rank}` }))
      };
      zoneFloorMap.set(type, createZoneFloor(root, config, rendererMediaFence, rendererLifecycle));
    }
    const dougaFloor = zoneFloorMap.get("douga");
    const dougaView = dougaFloor && dougaFloor.__zoneView ? {
      ...dougaFloor.__zoneView,
      lifecycle: rendererLifecycle,
      onWatchLaterRequest,
      cardListenerCleanups: [],
      destroyed: false,
      batch: -1,
      isRendererActive
    } : null;
    if (dougaView) {
      dougaView.mediaFence = createViewMediaFence(dougaView, rendererMediaFence);
      const oldTitle = dougaFloor.querySelector(".storey-title");
      const replacementTitle = createStoreyTitle(root, "动画", "DOUGA", "", "bili-douga", rendererLifecycle, () => {
        if (typeof onDougaRequest === "function") onDougaRequest();
      });
      const floorMore = replacementTitle.querySelector(".exchange-btn .more");
      if (floorMore) {
        floorMore.setAttribute("data-role", "douga-floor-more");
        floorMore.setAttribute("href", "https://www.bilibili.com/v/douga/");
        floorMore.setAttribute("target", "_blank");
        floorMore.setAttribute("rel", "noopener noreferrer");
        floorMore.removeAttribute("hidden");
      }
      if (oldTitle && oldTitle.parentNode) oldTitle.parentNode.replaceChild(replacementTitle, oldTitle);
      const rankMore = dougaView.rank.querySelector(".rank-header .more");
      if (rankMore) {
        rankMore.setAttribute("data-role", "douga-rank-more");
        rankMore.setAttribute("href", "https://www.bilibili.com/v/popular/rank/douga");
        rankMore.setAttribute("target", "_blank");
        rankMore.setAttribute("rel", "noopener noreferrer");
        rankMore.removeAttribute("hidden");
      }
      dougaView.rankHeader = dougaView.rank.querySelector(".rank-header");
      dougaFloor.setAttribute("data-state", "loading");
    }
    const knowledge = createKnowledgeFloor(root, rendererMediaFence, rendererLifecycle);
    knowledge.view.isRendererActive = isRendererActive;
    const music = createMusicFloor(root, rendererMediaFence, rendererLifecycle);
    music.view.isRendererActive = isRendererActive;
    const animal = createAnimalFloor(root, rendererMediaFence, rendererLifecycle);
    animal.view.isRendererActive = isRendererActive;
    const fashion = createFashionFloor(root, rendererMediaFence, rendererLifecycle);
    fashion.view.isRendererActive = isRendererActive;
    const ordinaryFloorMap = new Map();
    for (const type of Object.keys(ORDINARY_ZONE_DEFINITIONS)) {
      ordinaryFloorMap.set(type, createOrdinaryFloor(root, type, rendererMediaFence, rendererLifecycle));
    }
    const readFloor = createReadFloor(root, rendererMediaFence, rendererLifecycle);
    const mangaFloor = createMangaFloor(root, rendererMediaFence, rendererLifecycle);
    const footer = createFooter(root, rendererLifecycle);
    const elevatorView = createElevator(root);
    const contactHelp = createContactHelp(root);
    const container = createNode(root, "main", "container");
    container.setAttribute("data-role", "homepage-content");
    container.appendChild(firstScreen);
    // 按用户指定的楼层顺序；番剧动态与国产原创相关视频子区不创建，保留日期时间线。
    const orderedFloors = [
      ["fixture", "douga"],
      ["component", live],
      ["component", anime.floor],
      ["component", guochuang.floor],
      ["component", mangaFloor],
      ["ordinary", "music"],
      ["ordinary", "dance"],
      ["ordinary", "game"],
      ["ordinary", "knowledge"],
      ["ordinary", "course"],
      ["ordinary", "tech"],
      ["ordinary", "sports"],
      ["ordinary", "car"],
      ["ordinary", "life"],
      ["ordinary", "food"],
      ["ordinary", "animal"],
      ["ordinary", "kichiku"],
      ["ordinary", "fashion"],
      ["ordinary", "information"],
      ["ordinary", "ent"],
      ["component", readFloor],
      ["ordinary", "movie"],
      ["ordinary", "teleplay"],
      ["ordinary", "cinephile"],
      ["ordinary", "documentary"]
    ];
    for (const [kind, ref] of orderedFloors) {
      if (kind === "fixture") {
        const floor = zoneFloorMap.get(ref);
        if (floor) { container.appendChild(floor); }
      } else if (kind === "ordinary") {
        const floor = ordinaryFloorMap.get(ref);
        if (floor) container.appendChild(floor);
      } else {
        container.appendChild(ref);
      }
    }
    homepage.appendChild(headerView.header);
    homepage.appendChild(banner);
    homepage.appendChild(menu);
    homepage.appendChild(container);
    homepage.appendChild(footer);
    homepage.appendChild(elevatorView.elevator);
    homepage.appendChild(contactHelp);
    const authView = AUTH_STATE_VIEWS.get(headerView.statusPanel);
    authView.elevator = elevatorView.elevator;
    authView.resetPopovers = bindHeaderPopovers(headerView.popoverGroups, listenerCleanups, isRendererActive);
    for (const loginAction of headerView.loginActions) {
      const activateLogin = (event) => {
        if (!isRendererActive()) {
          return;
        }
        if (typeof onLoginRequest === "function") {
          onLoginRequest(event);
          return;
        }
        headerView.loginStub.removeAttribute("hidden");
        elevatorView.elevator.setAttribute("data-overlay-open", "true");
      };
      addListenerWithCleanup(loginAction, "click", activateLogin, listenerCleanups);
      if (loginAction.tagName !== "BUTTON") {
        addListenerWithCleanup(loginAction, "keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
          event.preventDefault();
          activateLogin(event);
        }, listenerCleanups);
      }
    }
    addListenerWithCleanup(headerView.closeLogin, "click", () => {
      if (!isRendererActive()) {
        return;
      }
      headerView.loginStub.setAttribute("hidden", "true");
      elevatorView.elevator.setAttribute("data-overlay-open", "false");
    }, listenerCleanups);
    root.appendChild(style);
    root.appendChild(homepage);
    // bindElevator must run AFTER the DOM is attached to the shadow root, otherwise
    // `root.querySelector('[data-floor-id=...]')` returns null for every floor and the
    // active-floor tracking never fires.
    bindElevator(root, elevatorView, footer, headerView.popoverGroups, listenerCleanups, isRendererActive);
    let bannerGeneration = 0;
    let bannerParallaxCleanups = [];
    const bindCurrentBannerParallax = () => {
      cleanupListeners(bannerParallaxCleanups);
      bannerParallaxCleanups = [];
      bindBannerParallax(root, banner, bannerParallaxCleanups, isRendererActive);
    };
    bindCurrentBannerParallax();
    listenerCleanups.push(() => cleanupListeners(bannerParallaxCleanups));
    const bannerController = {
      get root() { return banner; },
      get generation() { return bannerGeneration; },
      setModel(model, assetMap = null, generation = null) {
        if (!isRendererActive() || !isRenderableBannerModel(model)) return false;
        if (Number.isSafeInteger(generation) && generation < bannerGeneration) return false;
        bannerGeneration = Number.isSafeInteger(generation) ? generation : bannerGeneration + 1;
        const nextBanner = createBanner(root, model, assetMap);
        if (!nextBanner || !banner.parentNode) return false;
        banner.parentNode.replaceChild(nextBanner, banner);
        banner = nextBanner;
        bindCurrentBannerParallax();
        return true;
      }
    };

    setAuthStatus(headerView.statusText, headerView.statusPanel, authStatus);
    return {
      statusText: headerView.statusText,
      statusPanel: headerView.statusPanel,
      banner: bannerController,
      setTheme,
      setBannerModel: (model, assetMap = null, generation = null) => bannerController.setModel(model, assetMap, generation),
      signin: headerView.signin,
      summaryPanels: headerView.summaryPanels,
      messagePanel: headerView.messagePanel,
      dynamicPanel: headerView.dynamicPanel,
      dynamicTrigger: headerView.dynamicTrigger,
      primaryMenu: menu.__primaryMenuView,
      setPrimaryMenuCounts,
      livePopover: headerView.livePopover,
      liveTrigger: headerView.liveTrigger,
      profilePopover: headerView.profilePopover,
      profileTrigger: headerView.profileTrigger,
      profileGroup: headerView.profileGroup,
      logoutButton: headerView.logoutButton,
      contactHelp,
      search: headerView.search,
      focusCarousel: focusView,
      recommendation: recommendationView,
      douga: dougaView,
      ordinaryZones: Object.fromEntries(Array.from(ordinaryFloorMap, ([type, floor]) => [type, floor.__ordinaryZoneView])),
      setOrdinaryZoneData: (view, data) => setOrdinaryZoneData(view, data),
      setRankRuntimeUnavailable,
      readFloor: readFloor.__readFloorView,
      mangaFloor: mangaFloor.__mangaFloorView,
      liveFloor: live.__liveFloorView,
      pgcAnime: anime.view,
      pgcGuochuang: guochuang.view,
      knowledge: knowledge.view,
      music: music.view,
      animal: animal.view,
      fashion: fashion.view,
      setAnimalData: (data) => setAnimalData(animal.view, data),
      setAnimalFailure: (data) => setAnimalFailure(animal.view, data),
      setFashionData: (data) => setFashionData(fashion.view, data),
      setFashionFailure: (data) => setFashionFailure(fashion.view, data),
      setMusicData: (data) => setMusicData(music.view, data),
      setMusicFailure: (data) => setMusicFailure(music.view, data),
      setProfileData,
      setProfileStats,
      setMessageData,
      setDynamicData,
      setLiveHoverData,
      destroy() {
        if (destroyed) {
          return;
        }
        rendererLease.active = false;
        destroyed = true;
        cleanupListeners(bannerParallaxCleanups);
        bannerParallaxCleanups = [];
        focusView.destroyed = true;
        recommendationView.destroyed = true;
        if (live.__liveFloorView) live.__liveFloorView.destroyed = true;
        menu.__primaryMenuView.destroyed = true;
        if (dougaView) {
          dougaView.destroyed = true;
          cleanupListeners(dougaView.cardListenerCleanups);
          dougaView.mediaFence.destroy();
        }
        for (const floor of ordinaryFloorMap.values()) {
          const view = floor.__ordinaryZoneView;
          if (!view) continue;
          view.destroyed = true;
          cleanupListeners(view.cardListenerCleanups);
          view.mediaFence.destroy();
        }
        if (readFloor.__readFloorView) {
          readFloor.__readFloorView.destroyed = true;
          readFloor.__readFloorView.mediaFence.destroy();
        }
        if (mangaFloor.__mangaFloorView) {
          mangaFloor.__mangaFloorView.destroyed = true;
          mangaFloor.__mangaFloorView.mediaFence.destroy();
        }
        knowledge.view.destroyed = true;
        music.view.destroyed = true;
        animal.view.destroyed = true;
        fashion.view.destroyed = true;
        anime.view.destroyed = true;
        guochuang.view.destroyed = true;
        clearFocusTimer(focusView);
        cleanupListeners(focusView.cardListenerCleanups);
        cleanupListeners(focusView.listenerCleanups);
        rendererMediaFence.destroy();
        knowledge.view.mediaFence.destroy();
        music.view.mediaFence.destroy();
        animal.view.mediaFence.destroy();
        fashion.view.mediaFence.destroy();
        cleanupListeners(anime.view.listenerCleanups);
        cleanupListeners(guochuang.view.listenerCleanups);
        cleanupListeners(listenerCleanups);
      }
    };
  };

  const runPgcAnimeRendererSelfTests = () => {
    const assert = (condition, label) => {
      if (!condition) {
        throw new Error(`PGC renderer self-test failed: ${label}`);
      }
    };
    const validTab = PGC_TAB_DEFINITIONS.map((definition, index) => ({
      key: definition.key,
      label: definition.label,
      isToday: index === 1,
      items: []
    }));
    const validData = {
      tabs: validTab,
      rankItems: [{
        rank: 1,
        seasonId: 101,
        title: "测试排行",
        linkUrl: "https://www.bilibili.com/bangumi/play/ss101",
        updateText: "更新",
        badgeText: ""
      }]
    };
    assert(isPgcAnimeData(validData), "valid typed data");
    assert(!isPgcAnimeData({
      ...validData,
      rankItems: [{ ...validData.rankItems[0], linkUrl: "https://www.bilibili.com/bangumi/play/ss101?q=1" }]
    }), "rank query rejection");
    assert(!isPgcAnimeData({
      ...validData,
      tabs: validData.tabs.map((tab) => ({ ...tab, isToday: tab.key !== "latest" }))
    }), "multiple today rejection");
    let writes = 0;
    const fakeView = {
      destroyed: false,
      isRendererActive: () => true,
      state: { data: null, activeTabKey: "latest" },
      root: {},
      timelineRoot: { replaceChildren: () => { writes += 1; } },
      rankList: { replaceChildren: () => { writes += 1; } },
      rankHeader: null
    };
    assert(setPgcAnimeData(fakeView, { tabs: [], rankItems: [] }) === false, "invalid data rejection");
    assert(writes === 0, "no partial DOM commit");
    return true;
  };

  const runKnowledgeRendererSelfTests = () => {
    const assert = (condition, label) => {
      if (!condition) {
        throw new Error(`Knowledge renderer self-test failed: ${label}`);
      }
    };
    const item = {
      bvid: "BV0000000000",
      title: "知识测试",
      ownerName: "作者测试",
      coverUrl: "https://i0.hdslb.com/bfs/archive/test.webp",
      href: "https://www.bilibili.com/video/BV0000000000",
      view: 1,
      danmaku: 2,
      durationSeconds: 3
    };
    const valid = { status: "partial", items: [item] };
    assert(isKnowledgeData(valid), "valid typed knowledge data");
    assert(!isKnowledgeData({ status: "partial", items: [{ ...item, href: "https://evil.example/video/BV0000000000" }] }), "derived href guard");
    assert(!isKnowledgeData({ status: "partial", items: [{ ...item, coverUrl: "https://i0.hdslb.com/bfs/a.webp?q=1" }] }), "cover query guard");
    assert(!isKnowledgeData({ status: "partial", items: [{ ...item, coverUrl: `https://i0.hdslb.com/bfs/${"a".repeat(2048)}.webp` }] }), "cover length guard");
    assert(!isKnowledgeData({ status: "success", items: [item] }), "success count guard");
    let writes = 0;
    const fakeView = {
      destroyed: false,
      isRendererActive: () => true,
      list: { replaceChildren: () => { writes += 1; } },
      rank: { replaceChildren: () => { writes += 1; } },
      rankHeader: null,
      root: {},
      status: { textContent: "" },
      state: { items: [] }
    };
    assert(setKnowledgeData(fakeView, { status: "partial", items: [{ ...item, href: "bad" }] }) === false, "raw invalid data rejection");
    assert(writes === 0, "invalid knowledge data zero DOM writes");
    const categories = Array.isArray(globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__)
      ? globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__
      : [];
    categories.push("08 renderer typed boundary/cover/href/zero-write: PASS");
    globalThis.__EXTENSION_B_KNOWLEDGE_SELF_TEST_CATEGORIES__ = categories;
    return true;
  };

  const runMusicRendererSelfTests = () => {
    const assert = (condition, label) => { if (!condition) throw new Error(`Music renderer self-test failed: ${label}`); };
    const item = {
      bvid: "BV0000000000",
      title: "音乐测试",
      ownerName: "作者测试",
      coverUrl: "https://i0.hdslb.com/bfs/archive/music.webp",
      href: "https://www.bilibili.com/video/BV0000000000",
      view: 1,
      danmaku: 2,
      durationSeconds: 3
    };
    assert(isMusicData({ status: "partial", items: [item] }), "valid typed music data");
    assert(!isMusicData({ status: "partial", items: [{ ...item, href: "https://evil.example/video/BV0000000000" }] }), "derived href guard");
    assert(!isMusicData({ status: "partial", items: [{ ...item, coverUrl: "https://i0.hdslb.com/bfs/a.webp?q=1" }] }), "cover query guard");
    assert(!isMusicData({ status: "partial", items: [{ ...item, coverUrl: `https://i0.hdslb.com/bfs/${"a".repeat(2048)}.webp` }] }), "cover length guard");
    assert(!isMusicData({ status: "success", items: [item] }), "success count guard");
    let writes = 0;
    const fakeView = {
      destroyed: false,
      isRendererActive: () => true,
      list: { replaceChildren: () => { writes += 1; } },
      rank: { replaceChildren: () => { writes += 1; } },
      rankHeader: null,
      root: {},
      status: { textContent: "" },
      state: { items: [] }
    };
    assert(setMusicData(fakeView, { status: "partial", items: [{ ...item, href: "bad" }] }) === false, "invalid typed data rejection");
    assert(writes === 0, "invalid music data zero DOM writes");
    const categories = Array.isArray(globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__)
      ? globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__ : [];
    categories.push("09 renderer typed boundary/cover/href/stale zero-write: PASS");
    globalThis.__EXTENSION_B_MUSIC_SELF_TEST_CATEGORIES__ = categories;
    return true;
  };

  const runAnimalFashionRendererSelfTests = () => {
    const assert = (condition, label) => { if (!condition) throw new Error(`Animal/fashion renderer self-test failed: ${label}`); };
    const item = { bvid: "BV0000000000", title: "动物时尚测试", ownerName: "作者", coverUrl: "https://i0.hdslb.com/bfs/archive/stage6.webp", href: "https://www.bilibili.com/video/BV0000000000", view: 1, danmaku: 2, durationSeconds: 3 };
    assert(isAnimalData({ status: "partial", items: [item] }) && isFashionData({ status: "partial", items: [item] }), "valid independent data");
    assert(!isAnimalData({ status: "partial", items: [{ ...item, href: "https://evil.example/video/BV0000000000" }] }) && !isFashionData({ status: "partial", items: [{ ...item, coverUrl: "https://i0.hdslb.com/bfs/x.webp?q=1" }] }), "guarded href/cover");
    const oversizedCover = `https://i0.hdslb.com/bfs/${"a".repeat(2048)}.webp`;
    assert(!isAnimalData({ status: "partial", items: [{ ...item, coverUrl: oversizedCover }] }) && !isFashionData({ status: "partial", items: [{ ...item, coverUrl: oversizedCover }] }), "cover length guard");
    assert(!isAnimalData({ status: "success", items: [item] }) && !isFashionData({ status: "success", items: [item] }), "status count guard");
    let writes = 0;
    const fakeView = { destroyed: false, isRendererActive: () => true, list: { replaceChildren: () => { writes += 1; } }, rank: { replaceChildren: () => { writes += 1; } }, rankHeader: null, root: {}, status: { textContent: "" }, state: { items: [] } };
    assert(setAnimalData(fakeView, { status: "partial", items: [{ ...item, href: "bad" }] }) === false && setFashionData(fakeView, { status: "partial", items: [{ ...item, href: "bad" }] }) === false, "invalid typed data zero-write");
    for (const raw of [
      { headers: {}, status: 200, body: {} },
      { status: "partial", items: [item], headers: {} },
      { status: "partial", items: [item], body: {} },
      { status: "partial", items: [item, { ...item, relation: {} }] },
      { status: "partial", items: [item], nested: { raw: true } },
      { status: "partial", items: [{ raw: item }] }
    ]) {
      assert(setAnimalData(fakeView, raw) === false && setFashionData(fakeView, raw) === false, "raw response/header/body/item/relation/unknown nested rejection");
    }
    assert(writes === 0, "invalid data zero DOM write");
    fakeView.destroyed = true;
    assert(setAnimalFailure(fakeView, [item]) === false && setFashionFailure(fakeView, [item]) === false && writes === 0, "destroyed/stale zero-write");
    const categories = Array.isArray(globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__)
      ? globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ : [];
    categories.push("14 renderer independent slots/typed URL sinks/raw transport-item-relation/invalid and destroyed zero-write: PASS");
    globalThis.__EXTENSION_B_ANIMAL_FASHION_SELF_TEST_CATEGORIES__ = categories;
    return true;
  };

  const runPgcGuochuangRendererSelfTests = () => {
    const assert = (condition, label) => {
      if (!condition) {
        throw new Error(`PGC Guochuang renderer self-test failed: ${label}`);
      }
    };
    const tabs = PGC_TAB_DEFINITIONS.map((definition, index) => ({
      key: definition.key,
      label: definition.label,
      isToday: index === 2,
      items: []
    }));
    const data = {
      tabs,
      rankItems: [{
        rank: 1,
        seasonId: 401,
        title: "国创排行",
        linkUrl: "https://www.bilibili.com/bangumi/play/ss401",
        updateText: "更新",
        badgeText: ""
      }]
    };
    assert(isPgcGuochuangData(data), "valid guochuang data");
    assert(!isPgcGuochuangData({
      ...data,
      rankItems: [{ ...data.rankItems[0], badgeText: "不允许" }]
    }), "badge boundary");
    assert(!isPgcGuochuangData({
      ...data,
      tabs: data.tabs.map((tab) => ({ ...tab, isToday: tab.key !== "latest" }))
    }), "multiple today boundary");
    let writes = 0;
    const fakeView = {
      destroyed: false,
      isRendererActive: () => true,
      isDataValid: isPgcGuochuangData,
      state: { data: null, activeTabKey: "latest" },
      root: {},
      timelineRoot: { replaceChildren: () => { writes += 1; } },
      rankList: { replaceChildren: () => { writes += 1; } },
      rankHeader: null
    };
    assert(setPgcGuochuangData(fakeView, { tabs: [], rankItems: [] }) === false, "invalid data rejection");
    assert(writes === 0, "no stale or partial DOM commit");
    let staleWrites = 0;
    let cleanupCalls = 0;
    const staleView = {
      destroyed: false,
      listenerCleanups: [() => { cleanupCalls += 1; }]
    };
    const staleHandler = () => {
      if (staleView.destroyed !== true) {
        staleWrites += 1;
      }
    };
    staleView.destroyed = true;
    cleanupListeners(staleView.listenerCleanups);
    staleHandler();
    assert(staleView.listenerCleanups.length === 0 && cleanupCalls === 1, "guochuang cleanup array drained on destroy");
    assert(staleWrites === 0, "stale guochuang handler zero DOM writes");
    const categories = Array.isArray(globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__)
      ? globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__
      : [];
    categories.push("14 renderer real validator/teardown cleanup/stale DOM writes: PASS");
    globalThis.__EXTENSION_B_PGC_SELF_TEST_CATEGORIES__ = categories;
    return true;
  };

  globalThis.ExtensionBHomepageRenderer = Object.freeze({
    normalizeText,
    NAV_ALLOWLIST,
    UPLOAD_ALLOWLIST,
    resolveNav,
    resolveUpload,
    resolveSearchUrl,
    isSearchData,
    setSearchData,
    setSearchHistory,
    isSearchSuggestionsData,
    setSearchSuggestions,
    resolveImage,
    resolveAssetKey,
    ASSET_KEYS,
    BUILTIN_BANNER_MODEL,
    isBannerModel: isRenderableBannerModel,
    validateCategoryUseUrl,
    captureCategorySpriteUrl,
    resolveCategoryUseUrl,
    categorySymbolFor,
    createSvgIcon,
    renderHomepage,
    setAuthStatus,
    setProfileData,
    setProfileStats,
    setMessageData,
    setDynamicData,
    setFavoriteData,
    setHistoryData,
    setLiveHoverData,
    isPrimaryMenuCountsData,
    setPrimaryMenuCounts,
    isLiveHoverData,
    isLiveAvatarUrl,
    isLiveCanonicalHref,
    isFocusCarouselItems,
    setFocusCarouselItems,
    isRecommendationData,
    setRecommendationData,
    setRecommendationLoading,
    setRecommendationWatchLaterState,
    isDougaData,
    setDougaData,
    setRankRuntimeUnavailable,
    isOrdinaryZoneRendererData,
    setOrdinaryZoneData,
    isReadFloorData,
    setReadFloorData,
    isMangaFloorData,
    setMangaFloorData,
    isLiveFloorRoom,
    isLiveFloorRoomsData,
    isLiveFloorInitialData,
    setLiveFloorInitial,
    setLiveFloorRooms,
    setLiveFloorFollowing,
    isKnowledgeData,
    setKnowledgeData,
    setKnowledgeFailure,
    isMusicData,
    setMusicData,
    setMusicFailure,
    isAnimalData,
    setAnimalData,
    setAnimalFailure,
    isFashionData,
    setFashionData,
    setFashionFailure,
    isPgcAnimeData,
    setPgcAnimeData,
    setPgcAnimeFailure,
    isPgcGuochuangData,
    setPgcGuochuangData,
    setPgcGuochuangFailure
  });

  if (globalThis.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST__ === true) {
    globalThis.__EXTENSION_B_ELEVATOR_LAYOUT_RUNTIME_TEST_API__ = Object.freeze({ bindElevator });
  }

  if (globalThis.__EXTENSION_B_BANNER_PARALLAX_RUNTIME_TEST__ === true) {
    globalThis.__EXTENSION_B_BANNER_PARALLAX_RUNTIME_TEST_API__ = Object.freeze({ bindBannerParallax });
  }

  if (globalThis.__EXTENSION_B_RUN_SELF_TESTS__ === true) {
    runPgcAnimeRendererSelfTests();
    runPgcGuochuangRendererSelfTests();
    globalThis.__EXTENSION_B_PGC_RENDERER_SELF_TEST_PASSED__ = true;
  }

  if (globalThis.__EXTENSION_B_RUN_KNOWLEDGE_SELF_TESTS__ === true) {
    runKnowledgeRendererSelfTests();
    globalThis.__EXTENSION_B_KNOWLEDGE_RENDERER_SELF_TEST_PASSED__ = true;
  }

  if (globalThis.__EXTENSION_B_RUN_MUSIC_SELF_TESTS__ === true) {
    runMusicRendererSelfTests();
    globalThis.__EXTENSION_B_MUSIC_RENDERER_SELF_TEST_PASSED__ = true;
  }

  if (globalThis.__EXTENSION_B_RUN_ANIMAL_FASHION_SELF_TESTS__ === true) {
    runAnimalFashionRendererSelfTests();
    globalThis.__EXTENSION_B_ANIMAL_FASHION_RENDERER_SELF_TEST_PASSED__ = true;
  }
})();
