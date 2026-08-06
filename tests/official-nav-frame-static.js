"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");

assert.match(source, /const OFFICIAL_NAV_FRAME_SOURCES = Object\.freeze\(\{[\s\S]*game: "https:\/\/www\.bilibili\.com\/page-proxy\/game-nav\.html",[\s\S]*manga: "https:\/\/manga\.bilibili\.com\/eden\/bilibili-nav-panel\.html"/);
assert.match(source, /const OFFICIAL_NAV_FRAME_TIMEOUT_MS = 3500;/);
assert.match(source, /frameWrap\.setAttribute\("hidden", "true"\);/);
assert.match(source, /frame\.addEventListener\("load", commit, \{ once: true \}\);/);
assert.match(source, /frame\.addEventListener\("error", fail, \{ once: true \}\);/);
assert.match(source, /panel\.setAttribute\("data-official-nav-state", "fallback"\);/);
assert.match(source, /panel\.setAttribute\("data-official-nav-state", "official"\);/);
assert.match(source, /fallbackSurface\.setAttribute\("hidden", "true"\);/);
assert.match(source, /fallbackSurface\.removeAttribute\("hidden"\);/);
assert.match(source, /attachOfficialNavFrame\(root, panel, "game", lifecycle\);/);
assert.match(source, /attachOfficialNavFrame\(root, panel, "manga", lifecycle\);/);
assert.match(source, /if \(panel\.__officialNavFrame\) \{\s*panel\.__officialNavFrame\.ensure\(\);/);
assert.match(source, /\.official-nav-frame \{[^}]*background: transparent;/);
assert.match(source, /\.official-nav-frame iframe \{[^}]*background: transparent;/);

console.log("OFFICIAL_NAV_FRAME_STATIC=PASS");
