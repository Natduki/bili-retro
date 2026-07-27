const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rendererPath = path.join(__dirname, "..", "homepage-renderer.js");
const source = fs.readFileSync(rendererPath, "utf8");

const firstScreenStart = source.indexOf('const firstScreen = createNode(root, "section", "first-screen b-wrap")');
const firstScreenEnd = source.indexOf("const live = createLiveFloor", firstScreenStart);
assert.ok(firstScreenStart >= 0 && firstScreenEnd > firstScreenStart, "first-screen build block exists");
const firstScreenBlock = source.slice(firstScreenStart, firstScreenEnd);
assert.match(firstScreenBlock, /firstScreen\.appendChild\(firstScreenSpace\);[\s\S]*firstScreen\.appendChild\(promote\);/);
const promoteStart = source.indexOf("const createPromoteFloor =");
const promoteEnd = source.indexOf("const createFooter =", promoteStart);
assert.doesNotMatch(source.slice(promoteStart, promoteEnd), /b-wrap/);
assert.match(source, /const floor = createNode\(root, "div", "space-between report-wrap-module report-scroll-module"\)/);
assert.doesNotMatch(source, /createNode\(root, "div", "space-between report-wrap-module report-scroll-module b-wrap"\)/);

const getLayout = (innerWidth) => {
  if (innerWidth <= 1438) {
    return { wrapper: 999, carousel: 459, recommend: 530, columns: 3, visible: 6, cardWidth: 170, cardHeight: 96, rowHeight: 202, extension: 710, bypb: 265 };
  }
  if (innerWidth <= 1654) {
    return { wrapper: 1198, carousel: 550, recommend: 638, columns: 3, visible: 6, cardWidth: 206, cardHeight: 116, rowHeight: 242, extension: 854, bypb: 320 };
  }
  if (innerWidth <= 1870) {
    return { wrapper: 1414, carousel: 550, recommend: 854, columns: 4, visible: 8, cardWidth: 206, cardHeight: 116, rowHeight: 242, extension: 1070, bypb: 320 };
  }
  return { wrapper: 1630, carousel: 550, recommend: 1070, columns: 5, visible: 10, cardWidth: 206, cardHeight: 116, rowHeight: 242, extension: 1286, bypb: 320 };
};

for (const [innerWidth, expected] of [
  [1920, getLayout(1920)],
  [1870, getLayout(1870)],
  [1654, getLayout(1654)],
  [1438, getLayout(1438)]
]) {
  const layout = getLayout(innerWidth);
  assert.deepEqual(layout, expected, `layout bucket ${innerWidth}`);
  const containerWidth = innerWidth;
  assert.ok(containerWidth >= layout.wrapper, `full-width container carries wrapper at ${innerWidth}`);
  assert.equal(layout.wrapper, expected.wrapper, `wrapper is not reduced by container at ${innerWidth}`);
  assert.equal(layout.carousel + 10 + layout.recommend, layout.wrapper, `first row fits at ${innerWidth}`);
  assert.equal(layout.extension + 24 + layout.bypb, layout.wrapper, `promote row fits at ${innerWidth}`);
  assert.equal(layout.recommend - (layout.columns - 1) * 10, layout.columns * layout.cardWidth, `card width at ${innerWidth}`);
  assert.equal(2 * layout.cardHeight + 10, layout.rowHeight, `card height at ${innerWidth}`);
  assert.equal(Math.max(layout.carousel + 10 + layout.recommend, layout.extension + 24 + layout.bypb) - layout.wrapper, 0, `scrollWidth-clientWidth at ${innerWidth}`);
}

assert.match(source, /main\.container \{ width: 100%; max-width: none; min-width: 0; margin: 0;/);

const narrowInfo = {
  cardHeight: 96,
  restingTop: 52,
  paddingTop: 8,
  paddingBottom: 10,
  restingTitleHeight: 18,
  hoverTitleHeight: 36,
  titleMargin: 2,
  upLineHeight: 14,
  upMargin: 1,
  playLineHeight: 14,
  playReservedRight: 36,
  durationTop: 7,
  durationLeft: 8,
  watchLaterWidth: 28,
  watchLaterRight: 8,
  durationFadeMs: 120,
  watchLaterRevealDelayMs: 200
};
assert.ok(narrowInfo.restingTop + narrowInfo.paddingTop + narrowInfo.restingTitleHeight <= narrowInfo.cardHeight, "narrow resting title stays visible");
const restingTitleBottom = narrowInfo.restingTop + narrowInfo.paddingTop + narrowInfo.restingTitleHeight;
assert.ok(narrowInfo.cardHeight - restingTitleBottom >= 12, "narrow resting title keeps bottom breathing room");
const hoverContentBottom = narrowInfo.paddingTop + narrowInfo.hoverTitleHeight + narrowInfo.titleMargin
  + narrowInfo.upLineHeight + narrowInfo.upMargin + narrowInfo.playLineHeight + narrowInfo.paddingBottom;
assert.ok(hoverContentBottom <= narrowInfo.cardHeight, "narrow hover title, UP and play fit inside card");
assert.equal(narrowInfo.playReservedRight, narrowInfo.watchLaterWidth + narrowInfo.watchLaterRight, "play reserves watch-later hit area");
assert.ok(narrowInfo.durationFadeMs < narrowInfo.watchLaterRevealDelayMs, "duration hides before watch-later appears");
assert.match(source, /@media \(max-width: 1438px\)[\s\S]*\.info-box \.info \{ top: 52px; padding: 8px 10px 10px; \}/);
assert.match(source, /infoBox\.appendChild\(link\);\s+infoBox\.appendChild\(durationNode\);/);
assert.doesNotMatch(source, /info\.appendChild\(durationNode\)/);
assert.match(source, /\.video-card-reco \.info-box > \.duration \{ position: absolute; top: 7px; right: auto; bottom: auto; left: 8px;/);
assert.match(source, /\.video-card-reco:hover \.info-box > \.duration, \.video-card-reco:focus-within \.info-box > \.duration \{ opacity: 0; visibility: hidden;/);
const responsiveCssStart = source.indexOf("@media (max-width: 1870px)", source.indexOf(".first-screen { display: block; width: 1630px"));
const responsiveCssEnd = source.indexOf("/* Footer fidelity", responsiveCssStart);
assert.doesNotMatch(source.slice(responsiveCssStart, responsiveCssEnd), /info-box > \.duration/, "duration position is shared by all layout buckets");

assert.match(source, /recommendChange, "keydown"[\s\S]*event\.key !== "Enter" && event\.key !== " " && event\.key !== "Spacebar"/);
assert.match(source, /event\.preventDefault\(\);\s+if \(typeof onRecommendationRequest === "function"\) onRecommendationRequest\(event\);/);
assert.match(source, /const releaseRecommendationFocus = \(\) => \{/);
assert.match(source, /if \(typeof link\.blur === "function"\) link\.blur\(\);/);
assert.match(source, /recommendationWindow, "pageshow", releaseRecommendationFocus/);
assert.match(source, /setRecommendationData[\s\S]*view\.cards\.length !== 10/);
assert.match(source, /slot\.card\.hidden = true/);

console.log("FIRST_SCREEN_LAYOUT_RUNTIME=PASS");
