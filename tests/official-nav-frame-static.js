"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
assert.doesNotMatch(source, /page-proxy\/game-nav\.html|eden\/bilibili-nav-panel\.html/);
assert.doesNotMatch(source, /attachOfficialNavFrame\(root, panel, "game", lifecycle\);/);
assert.doesNotMatch(source, /attachOfficialNavFrame\(root, panel, "manga", lifecycle\);/);
assert.doesNotMatch(source, /const attachOfficialNavFrame|__officialNavFrame/);
assert.match(source, /game: 300,[\s\S]*manga: 300,/);

console.log("OFFICIAL_NAV_FRAME_STATIC=PASS");
