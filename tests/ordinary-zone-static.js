const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const bridge = fs.readFileSync(path.join(root, "page-bridge.js"), "utf8");
const content = fs.readFileSync(path.join(root, "content.js"), "utf8");
const renderer = fs.readFileSync(path.join(root, "homepage-renderer.js"), "utf8");
const css = fs.readFileSync(path.join(root, "homepage.css"), "utf8");

const types = [
  "music", "dance", "game", "knowledge", "tech", "sports", "car", "life", "food",
  "animal", "kichiku", "fashion", "information", "ent", "movie", "teleplay", "cinephile", "documentary"
];
const channelFeeds = {
  music: 1003, dance: 1004, game: 1008, knowledge: 1010, tech: 1012,
  sports: 1018, car: 1013, life: 1009, food: 1020, animal: 1024,
  kichiku: 1007, fashion: 1014, information: 1011, ent: 1002, cinephile: 1001
};

assert.match(bridge, /ORDINARY_ZONE_FLOOR/);
assert.match(bridge, /\/pgc\/page\/web\/v2\?name=\$\{config\.feedName\}/);
assert.match(bridge, /module\.style === "web_feed_v2" && module\.title === "更多推荐"/);
assert.match(bridge, /const itemType = config\.list === "pgcFeed" \? "pgc" : "video"/);
assert.match(bridge, /const rankType = config\.rank \? config\.rank\.kind : "none"/);
assert.match(bridge, /music: Object\.freeze\(\{ rid: 3, list: "regionFeed", feedRegion: 1003/);
assert.match(bridge, /region\/feed\/rcmd\?display_id=\$\{batch \+ 1\}&request_cnt=15&from_region=\$\{config\.feedRegion\}/);
assert.match(bridge, /ownKeys\(value\) === "batch\\u001Fchannel\\u001FincludeRank\\u001Foperation\\u001FrequestId\\u001Ftype\\u001Fversion\\u001FzoneType"/);
assert.match(bridge, /ordinaryClassificationMatches/);
assert.match(bridge, /entry\.pid_v2, entry\.pid, entry\.parent_tid, entry\.parent_id/);
assert.match(bridge, /parseOrdinaryLegacyTimestamp/);
assert.match(bridge, /parseOrdinaryLegacyDuration/);
assert.match(bridge, /entry\.author/);
assert.match(bridge, /entry\.video_review/);
assert.match(bridge, /entry\.favorites/);
assert.match(bridge, /entry\.coins/);
for (const type of types) assert.match(bridge, new RegExp(`${type}: Object\.freeze`), `fixed config for ${type}`);
for (const [type, feedRegion] of Object.entries(channelFeeds)) {
  assert.match(bridge, new RegExp(`${type}: Object\\.freeze\\(\\{[^}]*list: "regionFeed"[^}]*feedRegion: ${feedRegion}`), `channel feed for ${type}`);
  assert.match(renderer, new RegExp(`${type}: Object\\.freeze\\(\\{ title: "[^"]+", nav: "https://www\\.bilibili\\.com/c/${type}/"`), `channel navigation for ${type}`);
}

assert.match(content, /data-extension-b-zone-\$\{type\}-state/);
assert.match(content, /stage-11-banner-import-r21/);
assert.match(content, /bridgeOwnKeys\(value\) === "batch\\u001FitemType\\u001Fitems\\u001FrankType\\u001Franks\\u001Fstatus\\u001Ftype"/);
assert.match(content, /stage-11-banner-import-r21/);
assert.match(content, /requestOrdinaryZoneFloor\(currentLifecycle, type, false, true\)/);
assert.match(bridge, /const usableRankRaw = config\.rank && isOrdinaryRankEnvelope\(rankRaw, config\) \? rankRaw : null;/);
assert.match(bridge, /request\.includeRank && rankRoute/);
assert.match(content, /includeRank: requestRank/);
assert.match(content, /const requestInitialOrdinaryZoneFloors = \(currentLifecycle\) =>/);
assert.match(content, /Promise\.all\(Array\.from\(\{ length: 4 \}, \(\) => worker\(\)\)\)/);
assert.match(content, /ordinaryRankRetryTypes/);
assert.match(content, /const ORDINARY_ZONE_RANK_TYPES =/);
assert.match(content, /const retryTypes = Array\.from\(ORDINARY_ZONE_RANK_TYPES\)/);
assert.match(content, /await retryWorker\(\);/);
assert.match(content, /waitForOrdinaryRetry\(currentLifecycle, 450\)/);
assert.match(content, /requestInitialOrdinaryZoneFloors\(currentLifecycle\);/);
assert.doesNotMatch(content, /for \(const type of ORDINARY_ZONE_TYPES\) requestOrdinaryZoneFloor\(currentLifecycle, type, false\)/);
assert.match(renderer, /const renderOrdinarySkeleton = \(view\) =>/);
assert.match(renderer, /const isUnavailableOrdinaryRank = \(type\) => type === "life" \|\| type === "information"/);
assert.match(renderer, /const createOrdinaryRankUnavailable =/);
assert.match(renderer, /"该分区排行榜已失效"/);
assert.match(renderer, /ordinary-rank-unavailable__image/);
assert.match(renderer, /ASSET_KEYS\.PGC_EMPTY/);
assert.match(renderer, /if \(isUnavailableOrdinaryRank\(type\)\) rankMore\.setAttribute\("hidden", "true"\)/);
assert.match(renderer, /renderOrdinarySkeleton\(view\);/);
assert.match(renderer, /card\.setAttribute\("data-skeleton", "true"\)/);
assert.match(renderer, /row\.setAttribute\("data-skeleton", "true"\)/);
assert.match(renderer, /view\.list\.setAttribute\("data-state", "fixture"\)/);
assert.match(renderer, /view\.rank\.setAttribute\("data-state", "fixture"\)/);
assert.match(renderer, /\.storey-documentary \{ margin-bottom: 54px; \}/);
assert.match(renderer, /\.ordinary-pgc-floor \.rank-header \{ margin-bottom: 8px; \}/);
assert.match(renderer, /\.ordinary-pgc-floor \.custom-pgc-rank-wrap,[\s\S]*margin-bottom: 38px;/);
assert.match(renderer, /#bili_live \{ margin-top: 79px; \}/);
assert.match(content, /setOrdinaryZoneRuntimeState\(currentLifecycle, type, "mounted"\)/);
assert.match(content, /currentLifecycle\.ordinaryZones\[type\]\.generation !== generation/);
assert.match(content, /requestMessage\.zoneType = ordinaryType/);
assert.match(content, /setOrdinaryZoneData\(currentLifecycle\.ordinaryZones\[type\]\.view, data\)/);
assert.match(content, /event\.isTrusted === true/);

assert.match(renderer, /const createOrdinaryFloor = \(root, type/);
assert.match(renderer, /Object\.keys\(value\)\.sort\(\)\.join\("\\u001F"\) === "batch\\u001FitemType\\u001Fitems\\u001FrankType\\u001Franks\\u001Fstatus\\u001Ftype"/);
assert.match(renderer, /isOrdinaryZoneRendererData,\s*setOrdinaryZoneData,/);
assert.match(renderer, /data\.ranks\.slice\(0, 10\)/);
assert.match(renderer, /const createOrdinaryPgcCard =/);
assert.match(renderer, /const resolveOrdinaryPgcCoverUrl = \(value\) => resolvePgcUrlWithoutQueryHash\([\s\S]*?\["\/bfs\/"\]/);
assert.match(renderer, /isOrdinaryZonePgcItem[\s\S]*resolveOrdinaryPgcCoverUrl\(item\.cover\) === item\.cover/);
assert.match(renderer, /isOrdinaryZonePgcRank[\s\S]*resolveOrdinaryPgcCoverUrl\(item\.cover\) === item\.cover/);
assert.match(renderer, /data\.itemType === "pgc" \? createOrdinaryPgcCard/);
const pgcRankStart = renderer.indexOf("const createOrdinaryPgcRankRow =");
const pgcRankEnd = renderer.indexOf("const createCheeseCard =", pgcRankStart);
const pgcRankBlock = renderer.slice(pgcRankStart, pgcRankEnd);
assert.match(pgcRankBlock, /createNode\(view\.root, "div", "txt"\)/);
assert.match(pgcRankBlock, /type === "movie" \? "update movie-update" : "update"/);
assert.doesNotMatch(pgcRankBlock, /preview|createCoverImage|scoreText|badgeText/);
assert.match(renderer, /isPgcFloor \|\| type === "course" \? "排行榜" : `\$\{definition\.title\}排行`/);
assert.match(renderer, /teleplay: Object\.freeze\(\{ title: "电视剧", nav: "https:\/\/www\.bilibili\.com\/tv\/\?spm_id_from=333\.1007\.0\.0", rankNav: "https:\/\/www\.bilibili\.com\/v\/popular\/rank\/tv"/);
assert.match(renderer, /course: Object\.freeze\(\{ title: "课堂", nav: "https:\/\/www\.bilibili\.com\/cheese\/", rankNav: "https:\/\/www\.bilibili\.com\/cheese\/pages\/ranklist"/);
assert.match(renderer, /type === "course" \? "cheese" : type/);
assert.match(renderer, /const createCheeseCard =/);
assert.match(renderer, /const createCheeseRankRow =/);
assert.match(renderer, /data\.itemType === "cheese" \? createCheeseCard/);
assert.match(renderer, /data\.rankType === "cheese" \? createCheeseRankRow/);
assert.match(renderer, /ordinary-floor\$\{isPgcFloor \? " ordinary-pgc-floor" : ""\}/);
assert.match(renderer, /\.ordinary-pgc-floor \.zone-list-box \{ height: auto; grid-template-columns: repeat\(6, minmax\(0, 170px\)\)/);
assert.match(renderer, /ordinary-pgc-card \.card-pic__image \{ display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; \}/);
assert.match(renderer, /ordinary-pgc-floor \.zone-list-box > \.ordinary-pgc-card:nth-child\(n \+ 11\)/);
assert.match(renderer, /\.storey-box\.ordinary-pgc-floor \{ min-height: 615px; \}/);
assert.match(renderer, /data-role", `\$\{type\}-floor-more`/);
assert.match(renderer, /data-role", `\$\{type\}-rank-more`/);
assert.match(renderer, /const floorName = titleNode\.querySelector\("\.l-con \.name"\)/);
assert.match(renderer, /floorName\.setAttribute\("href", definition\.nav\)/);
assert.match(renderer, /createDougaMetricIcon\(root, "play"\)/);
assert.match(renderer, /createDougaMetricIcon\(root, "danmaku"\)/);
assert.match(renderer, /createDougaMetricIcon\(root, "up"\)/);
assert.match(renderer, /\.ordinary-floor \.douga-metric-icon \{ display: inline-block; width: 16px; height: 16px/);
assert.match(renderer, /\.ordinary-floor \.video-card-common \.card-pic \.count \.right \{ float: none; width: auto; min-height: 0; margin: 0; padding: 0; background: none; \}/);
assert.match(renderer, /categorySymbolFor\(type\)/);
assert.match(renderer, /const symbol = CATEGORY_SYMBOL_BY_ID\.get\(symbolId\)/);
for (const symbolId of ["bili-life", "bili-food", "bili-information", "bili-read", "bili-movie", "bili-teleplay"]) {
  assert.match(renderer, new RegExp(`id: "${symbolId}"`), `inline icon paths for ${symbolId}`);
}
assert.match(renderer, /for \(const definition of symbol\.paths\)/);
assert.match(renderer, /if \(CATEGORY_SYMBOL_BY_ID\.has\(symbolId\)\) \{\s*return createLocalCategoryFallback\(root, symbolId, size, className\)/);
assert.match(renderer, /\.ordinary-floor \.exchange-btn \.more, \.ordinary-floor \.rank-header \.more \{[^}]*width: 58px; height: 22px/);
assert.match(renderer, /music: Object\.freeze\(\{ title: "音乐", nav: "https:\/\/www\.bilibili\.com\/c\/music\/"/);
assert.match(renderer, /\.ordinary-floor \.custom-rank-wrap \{[^}]*align-items: flex-start/);
assert.match(renderer, /\.ordinary-floor \.custom-rank-wrap \.title \{[^}]*margin: 0/);
assert.match(renderer, /\.ordinary-floor \.custom-pgc-rank-wrap \.title \{[^}]*margin: 0/);
assert.match(renderer, /@media \(max-width: 1654px\)[\s\S]*ordinary-floor \.zone-list-box \{ width: 854px; grid-template-columns: repeat\(5/);
assert.match(renderer, /const createOrdinarySkeletonItems = \(type, count = 12\)/);
assert.match(css, /\.ordinary-floor \.zone-list-box[\s\S]*repeat\(5/);
assert.match(css, /\.ordinary-floor \.zone-list-box > \.video-card-common:nth-child\(n \+ 9\)/);
assert.match(css, /\.ordinary-pgc-floor \.ordinary-pgc-card \.card-pic \{[\s\S]*aspect-ratio: 3 \/ 4/);
assert.match(css, /\.ordinary-pgc-floor \.zone-list-box \{[\s\S]*repeat\(6, minmax\(0, 170px\)\)/);
assert.match(css, /\.ordinary-pgc-floor \.ordinary-pgc-card \.card-pic__image \{[\s\S]*object-fit: contain;[\s\S]*object-position: center/);
assert.match(css, /ordinary-pgc-card:nth-child\(n \+ 11\)/);
assert.match(css, /\.ordinary-floor \.exchange-btn \.more[\s\S]*opacity: 1/);

console.log("ORDINARY_ZONE_STATIC=PASS");
