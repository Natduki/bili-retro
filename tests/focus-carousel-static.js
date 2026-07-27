const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const renderer = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
const serviceWorker = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");

assert.match(renderer, /createNode\(root, "div", "space-between report-wrap-module"\)/);
assert.match(renderer, /createNode\(root, "div", "focus-carousel home-slide report-wrap-module report-scroll-module"\)/);
assert.match(renderer, /createFixedAnchor\(root, "more", "TOPIC_LIST", "更多"\)/);
assert.match(renderer, /createIconFont\(root, "bili-icon_caozuo_qianwang", null, rendererLifecycle, "i"\)/);
assert.match(renderer, /FOCUS_INDICATOR: "assets\/homepage\/homepage-runtime\/international-home\/icon_slide_selected\.png"/);
assert.match(renderer, /const setFocusActiveState = \(view, nextIndex, animate, origin = "programmatic"\)/);
assert.match(renderer, /track\.style\.transform = `translate3d\(\$\{-index \* 100\}%, 0, 0\)`/);
assert.match(renderer, /indicator\.style\.transform = `translate3d\(\$\{index \* 20 - 4\}px, -50%, 0\)`/);
assert.match(renderer, /state\.motion = \{/);
assert.match(renderer, /addListenerWithCleanup\(view\.track, "transitionend"/);
assert.match(renderer, /view\.root\.matches\(":hover"\)/);
assert.match(renderer, /addListenerWithCleanup\(view\.root, "pointerenter", onFocusPointerEnter/);
assert.match(renderer, /addListenerWithCleanup\(view\.root, "pointerleave", onFocusPointerLeave/);
assert.match(renderer, /selectFocusIndex\(view, Number\(node\.getAttribute\("data-index"\)\), "hover"\)/);
assert.match(renderer, /setFocusActiveState\(view, nextIndex, true, "autoplay"\)/);
assert.match(renderer, /\.home-slide \.carousel-track \{ display: flex;/);
assert.match(renderer, /\.home-slide \.item \{ position: relative; flex: 0 0 100%;[\s\S]*opacity: 1;/);
assert.match(renderer, /\.home-slide \.trigger \.trigger-indicator \{[\s\S]*transform: translate3d\(-4px, -50%, 0\)/);
assert.match(renderer, /view\.indicator\.style\.backgroundImage = `url\("\$\{indicatorAssetUrl\}"\)`/);
assert.match(renderer, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.home-slide \.carousel-track/);
assert.match(serviceWorker, /const FOCUS_CAROUSEL_URL = "https:\/\/api\.bilibili\.com\/x\/web-show\/res\/locs\?ids=3197&pf=0"/);
assert.match(serviceWorker, /const ROOT_INDEX_URL = "https:\/\/www\.bilibili\.com\/index\.html"/);
assert.match(serviceWorker, /url\.pathname !== "\/" && url\.pathname !== "\/index\.html"/);
assert.match(serviceWorker, /assert\(isExactRootSender\(\{ \.\.\.validSender, url: ROOT_INDEX_URL \}\), "index sender"\)/);
assert.match(serviceWorker, /const isJsonContentType = \(value\) => \{/);
assert.match(serviceWorker, /mediaType === "application\/json"/);
assert.match(serviceWorker, /const linkUrl = normalizeFocusUrl\(source\.url, FOCUS_LINK_HOSTS, null, true\)/);
assert.match(serviceWorker, /credentials: "omit"/);
assert.match(serviceWorker, /data: \{ items: result\.items \}/);

console.log("FOCUS_CAROUSEL_STATIC=PASS");
