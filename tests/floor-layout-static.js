const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rendererPath = path.join(__dirname, "..", "homepage-renderer.js");
const contentPath = path.join(__dirname, "..", "content.js");
const cssPath = path.join(__dirname, "..", "homepage.css");
const renderer = fs.readFileSync(rendererPath, "utf8");
const content = fs.readFileSync(contentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

assert.match(renderer, /const appendProxyFloorContent = \(root, floor, type, content\) => \{/);
assert.match(renderer, /module\.id = `bili_\$\{type\}`;/);
assert.match(renderer, /content\.id = `bili_report_\$\{type\}`;/);
assert.match(renderer, /content\.classList\.add\("report-scroll-module"\)/);
assert.match(renderer, /proxy\.appendChild\(module\);/);
assert.match(renderer, /appendProxyFloorContent\(root, floor, config\.type, space\);/);
assert.match(renderer, /floor\.id = "bili_live"/);
assert.match(renderer, /space\.id = "bili_report_live"/);
assert.match(renderer, /space\.appendChild\(liveList\); space\.appendChild\(tabs\); floor\.appendChild\(space\);/);
assert.match(renderer, /appendProxyFloorContent\(root, floor, "music", space\);/);
assert.match(renderer, /const anime = createPgcFloor\(root, \{ kind: "anime"/);
assert.match(renderer, /const guochuang = createPgcFloor\(root, \{ kind: "guochuang"/);
const pgcFloorStart = renderer.indexOf("const createPgcFloor =");
const promoteFloorStart = renderer.indexOf("const createPromoteFloor =", pgcFloorStart);
assert.ok(pgcFloorStart >= 0 && promoteFloorStart > pgcFloorStart, "PGC timeline renderer block exists");
assert.doesNotMatch(renderer.slice(pgcFloorStart, promoteFloorStart), /番剧动态|国产原创相关/);
assert.match(renderer, /const createStoreyTitle = \(root, title, navKey, countLabel, iconId, lifecycle = null, onChange = null\) => \{/);
assert.match(renderer, /\.storey-title \.name \{ font-size: 20px; \}/);
assert.match(renderer, /\.storey-title \.storey-icon \{ width: 36px; height: 36px; \}/);
const storeyTitleStart = renderer.indexOf("const createStoreyTitle =");
const storeyTitleEnd = renderer.indexOf("const appendProxyFloorContent =", storeyTitleStart);
assert.ok(storeyTitleStart >= 0 && storeyTitleEnd > storeyTitleStart, "storey title renderer block exists");
const storeyTitleBlock = renderer.slice(storeyTitleStart, storeyTitleEnd);
assert.match(storeyTitleBlock, /const change = createNode\(root, "div", "btn btn-change"\)/);
assert.match(storeyTitleBlock, /change\.setAttribute\("role", "button"\)/);
assert.match(storeyTitleBlock, /change\.setAttribute\("tabindex", "0"\)/);
assert.match(storeyTitleBlock, /change\.setAttribute\("data-role", "floor-change"\)/);
assert.match(storeyTitleBlock, /createIconFont\(root, "bili-icon_caozuo_huanyihuan", null, lifecycle, "i"\)/);
assert.match(storeyTitleBlock, /event\.preventDefault\(\)/);
assert.match(storeyTitleBlock, /createFixedAnchor\(root, "btn more", navKey, "更多"\)/);
assert.doesNotMatch(storeyTitleBlock, /createNode\(root, "button", "btn btn-change"\)/);
const zoneFloorStart = renderer.indexOf("const createZoneFloor =");
const liveFloorStart = renderer.indexOf("const createLiveFloor =", zoneFloorStart);
assert.ok(zoneFloorStart >= 0 && liveFloorStart > zoneFloorStart, "ordinary floor renderer block exists");
const zoneFloorBlock = renderer.slice(zoneFloorStart, liveFloorStart);
assert.match(zoneFloorBlock, /createNode\(root, "div", "space-between report-wrap-module"\)/);
assert.match(zoneFloorBlock, /createNode\(root, "div", "card-pic card-pic-hover"\)/);
assert.match(zoneFloorBlock, /createNode\(root, "div", "b-img"\)/);
assert.match(zoneFloorBlock, /createNode\(root, "picture", "b-img__inner"\)/);
assert.match(zoneFloorBlock, /watch-later-video van-watchlater black/);
assert.match(zoneFloorBlock, /bili-icon_shipin_dianzanshu/);
assert.match(zoneFloorBlock, /bili-icon_xinxi_UPzhu/);
assert.match(zoneFloorBlock, /createStoreyTitle\([\s\S]*lifecycle,[\s\S]*\(\) => \{/);
assert.match(zoneFloorBlock, /list\.appendChild\(first\)/);

const promoteStart = renderer.indexOf("const createPromoteFloor =");
const footerStart = renderer.indexOf("const createFooter =", promoteStart);
assert.ok(promoteStart >= 0 && footerStart > promoteStart, "promote renderer block exists");
const promoteBlock = renderer.slice(promoteStart, footerStart);
assert.match(promoteBlock, /createNode\(root, "div", "space-between report-wrap-module report-scroll-module"\)/);
assert.doesNotMatch(promoteBlock, /space-between report-wrap-module report-scroll-module b-wrap/);
assert.match(promoteBlock, /createNode\(root, "div", "bypb-window"\)/);
assert.match(promoteBlock, /createNode\(root, "div", "online"\)/);
assert.match(promoteBlock, /观看列表/);
assert.match(promoteBlock, /createNode\(root, "div", "ext-box"\)/);
assert.doesNotMatch(promoteBlock, /exchange-btn|promote-card|ex-card-common/);
assert.match(promoteBlock, /createLocalImage\(root, "svg-icon", ASSET_KEYS\.PROMOTE_ICON, ""\)/);
assert.match(renderer, /PROMOTE_ICON: "assets\/homepage\/promote\/bili-tuiguang\.svg"/);
assert.match(renderer, /"bili-tuiguang": "#bili-tuiguang"/);
assert.match(promoteBlock, /name no-link/);
assert.match(promoteBlock, /setAttribute\("scrollshow", "true"\)/);
assert.match(renderer, /firstScreen\.appendChild\(firstScreenSpace\);[\s\S]*const promote = createPromoteFloor[\s\S]*firstScreen\.appendChild\(promote\);/);
assert.doesNotMatch(renderer, /container\.appendChild\(promote\)/);

const floorOrderStart = renderer.indexOf("const orderedFloors = [");
const floorOrderEnd = renderer.indexOf("];", floorOrderStart);
const floorOrder = renderer.slice(floorOrderStart, floorOrderEnd);
const expectedOrder = [
  "douga", "live", "anime", "guochuang", "manga", "music", "dance", "game", "knowledge", "course",
  "tech", "sports", "car", "life", "food", "animal", "kichiku", "fashion",
  "information", "ent", "read", "movie", "teleplay", "cinephile", "documentary"
];
let lastIndex = -1;
const ordinaryTypes = new Set([
  "music", "dance", "game", "knowledge", "course", "tech", "sports", "car", "life", "food",
  "animal", "kichiku", "fashion", "information", "ent", "movie", "teleplay", "cinephile", "documentary"
]);
for (const key of expectedOrder) {
  const componentKey = key === "live"
    ? `, ${key}]`
    : key === "read"
      ? ", readFloor]"
    : key === "manga"
      ? ", mangaFloor]"
    : ordinaryTypes.has(key)
      ? `, "${key}"]`
      : `, ${key}.floor]`;
  const nextIndex = floorOrder.indexOf(
    key === "live" || key === "anime" || key === "guochuang" || key === "read" || key === "manga" || ordinaryTypes.has(key)
      ? componentKey
      : `"${key}"`,
    lastIndex + 1
  );
  assert.ok(nextIndex > lastIndex, `floor order includes ${key}`);
  lastIndex = nextIndex;
}

assert.match(renderer, /\["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"\]/);
assert.match(renderer, /\.ordinary-floor \.zone-list-box > \.video-card-common:nth-child\(n \+ 9\) \{ display: none; \}/);
assert.match(renderer, /\.ordinary-floor \.zone-list-box \{ grid-template-columns: repeat\(4, minmax\(0, 1fr\)\); \}/);
assert.match(renderer, /\.ordinary-floor \.zone-list-box \{ width: min\(100%, 1070px\); grid-template-columns: repeat\(5, minmax\(0, 1fr\)\); gap: 10px; \}/);
assert.match(renderer, /#bili_report_douga \.zone-list-box \{ display: flex; width: 100%; min-width: 0; flex-wrap: wrap; align-content: space-between; justify-content: space-between; row-gap: 24px; \}/);
assert.match(renderer, /#bili_report_douga \.video-card-common \{ width: calc\(\(100% - 40px\) \/ 5\); min-width: 0; min-height: 0; flex: 0 0 calc\(\(100% - 40px\) \/ 5\); \}/);
assert.match(renderer, /@media \(max-width: 1870px\) \{\s*\.b-wrap, \.container, \.storey-box, \.mini-header__content \{ width: 1414px;/);
assert.match(renderer, /@media \(max-width: 1654px\) \{[\s\S]*#bili_report_douga \.zone-list-box > \.video-card-common:nth-child\(n \+ 9\) \{ display: none; \}/);
assert.match(renderer, /@media \(max-width: 1654px\) \{[\s\S]*#bili_report_douga \.video-card-common \{ width: calc\(\(100% - 30px\) \/ 4\); flex-basis: calc\(\(100% - 30px\) \/ 4\); \}/);
assert.match(renderer, /@media \(max-width: 1438px\) \{[\s\S]*#bili_report_douga \.card-list \{ width: calc\(100% - 289px\); \}/);
assert.doesNotMatch(renderer, /#bili_report_douga \.zone-list-box \{[^}]*width: 854px/);
assert.doesNotMatch(renderer, /#bili_report_douga \.zone-list-box \{[^}]*height: 404px/);
assert.match(renderer, /\["component", anime\.floor\]/);
assert.match(renderer, /\["component", guochuang\.floor\]/);

const firstMountStart = content.indexOf("if (firstMount) {");
const firstMountEnd = content.indexOf("  };", firstMountStart);
const firstMountBlock = content.slice(firstMountStart, firstMountEnd);
assert.match(firstMountBlock, /requestPgcAnime\(currentLifecycle\);/);
assert.match(firstMountBlock, /requestPgcGuochuang\(currentLifecycle\);/);

console.log("FLOOR_LAYOUT_STATIC=PASS");
