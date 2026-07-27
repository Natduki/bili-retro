"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const rendererSource = fs.readFileSync(path.join(__dirname, "..", "homepage-renderer.js"), "utf8");
const contentSource = fs.readFileSync(path.join(__dirname, "..", "content.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8"));
const exposedSource = rendererSource.replace(/\n\}\)\(\);\s*$/, `
  globalThis.__searchRendererApi = Object.freeze({ isSearchData, isSearchSuggestionsData });
})();`);
const sandbox = {
  console,
  URL,
  Set,
  Map,
  Object,
  Array,
  Boolean,
  Number,
  String,
  Math,
  RegExp,
  Error,
  Promise,
  encodeURIComponent,
  decodeURIComponent,
  chrome: { runtime: { id: "search-test", getURL: (key) => `chrome-extension://search-test/${key}` } },
  setTimeout: () => 1,
  clearTimeout() {}
};
sandbox.globalThis = sandbox;
vm.runInNewContext(exposedSource, sandbox, { filename: "homepage-renderer.js" });
const api = sandbox.__searchRendererApi;

assert.match(rendererSource, /nav-search-box[\s\S]*nav-search[\s\S]*nav_searchform/);
assert.match(rendererSource, /createNode\(root, "div", "nav-search-btn"\)/);
assert.match(rendererSource, /createNode\(root, "div", "suggest-wrap"\)/);
assert.match(rendererSource, /createNode\(root, "section", "history"\)/);
assert.match(rendererSource, /createNode\(root, "div", "histories-wrap"\)/);
assert.match(rendererSource, /createNode\(root, "section", "trending"\)/);
assert.match(rendererSource, /createNode\(root, "div", "trendings-double"\)/);
assert.match(rendererSource, /createNode\(root, "div", "trendings-col"\)/);
assert.match(rendererSource, /createSearchAnchor\(view\.root, `trending-item/);
assert.match(rendererSource, /暂无搜索历史/);
assert.match(rendererSource, /data-search-dirty/);
assert.match(rendererSource, /view\.input\.setAttribute\("placeholder", data\.defaultKeyword\)/);
assert.match(rendererSource, /searchInput\.setAttribute\("autocomplete", "off"\)/);
assert.match(rendererSource, /clearHistory/);
assert.match(rendererSource, /searchButton, "keydown"/);
assert.match(rendererSource, /search: headerView\.search/);
assert.match(rendererSource, /setSearchSuggestions/);
assert.match(rendererSource, /setSearchHistory/);
assert.match(rendererSource, /items\.length > 20/);
assert.match(rendererSource, /slice\(0, 20\)/);
assert.match(rendererSource, /history-fold-wrap/);
assert.match(rendererSource, /if \(view\.input && typeof view\.input\.focus === "function"\) view\.input\.focus\(\);/);
assert.match(rendererSource, /suggest_high_light/);
assert.match(rendererSource, /event\.key === "ArrowDown" \|\| event\.key === "ArrowUp"/);
assert.match(rendererSource, /onSearchSuggestRequest/);
assert.match(rendererSource, /"compositionstart"/);
assert.match(rendererSource, /"compositionend"/);
const highlightSource = rendererSource.slice(rendererSource.indexOf("const appendSearchHighlightedText"), rendererSource.indexOf("const setSearchSuggestions"));
assert.doesNotMatch(highlightSource, /innerHTML/);
assert.match(rendererSource, /SEARCH_MARK_LIVE: "assets\/homepage\/search\/mark-live\.gif"/);
assert.match(rendererSource, /SEARCH_MARK_ANNIVERSARY: "assets\/homepage\/search\/mark-anniversary\.png"/);
assert.match(rendererSource, /icon\.addEventListener\("error", \(\) => icon\.remove\(\), \{ once: true \}\)/);
assert.match(contentSource, /keyword\\u001FmarkKey\\u001FremoteIcon\\u001Ftext/);
assert.match(contentSource, /parsed\.pathname\.startsWith\("\/bfs\/"\)/);
assert.match(contentSource, /chrome\.runtime\.sendMessage\(\{[\s\S]*operation: SEARCH_OPERATION,[\s\S]*params: \{\}/);
assert.match(contentSource, /isExactSearchRuntimeResult/);
assert.match(contentSource, /operation: SEARCH_AUTOCOMPLETE_OPERATION/);
assert.match(rendererSource, /const scheduleSearchSuggestions = \(\) =>/);
assert.match(rendererSource, /}, 180\);/);
assert.match(rendererSource, /const rootNode = typeof group\.getRootNode === "function" \? group\.getRootNode\(\) : null;/);
assert.match(rendererSource, /if \(search && isInsideSurface\(activeElement\)\) return;/);
assert.match(rendererSource, /if \(search\) \{[\s\S]*addListenerWithCleanup\(trigger \|\| group, "click"/);
assert.match(rendererSource, /\} else \{[\s\S]*addListenerWithCleanup\(group, "pointerenter", openFromPointer/);
assert.match(contentSource, /data-extension-b-search-autocomplete-state/);
assert.match(contentSource, /"request-posted"/);
assert.match(contentSource, /"committed"/);
assert.match(contentSource, /chrome\.storage\.local\.get\(SEARCH_HISTORY_STORAGE_KEY/);
assert.match(contentSource, /chrome\.storage\.local\.set\(\{ \[SEARCH_HISTORY_STORAGE_KEY\]/);
assert.match(rendererSource, /view\.open\(href, "_blank", "noopener,noreferrer"\)/);
assert.deepEqual(manifest.permissions, ["storage"]);
const webResources = manifest.web_accessible_resources[0].resources;
assert.deepEqual(manifest.host_permissions, ["https://api.bilibili.com/*", "https://s.search.bilibili.com/*", "https://manga.bilibili.com/*"]);
assert.equal(webResources.includes("assets/homepage/search/mark-live.gif"), true);
assert.equal(webResources.includes("assets/homepage/search/mark-anniversary.png"), true);

const valid = {
  defaultKeyword: "默认词",
  defaultUrl: "https://search.bilibili.com/all?keyword=%E9%BB%98%E8%AE%A4%E8%AF%8D",
  trendingTitle: "热门搜索",
  trendingItems: [{ keyword: "热搜", text: "热搜展示", markKey: "none", remoteIcon: "https://i3.hdslb.com/bfs/search/icon.png" }]
};
assert.equal(api.isSearchData(valid), true);
assert.equal(api.isSearchData({ ...valid, trendingItems: [{ ...valid.trendingItems[0], remoteIcon: "http://i3.hdslb.com/bfs/search/icon.png" }] }), false);
assert.equal(api.isSearchData({ ...valid, trendingItems: [{ ...valid.trendingItems[0], remoteIcon: "https://evil.example/bfs/search/icon.png" }] }), false);
assert.equal(api.isSearchData({ ...valid, extra: true }), false);
assert.equal(api.isSearchData({ ...valid, trendingItems: [{ ...valid.trendingItems[0], remoteIcon: null }] }), true);
assert.equal(api.isSearchData({ ...valid, trendingItems: [{ ...valid.trendingItems[0], markKey: "live", remoteIcon: null }] }), true);
assert.equal(api.isSearchData({ ...valid, trendingItems: [{ ...valid.trendingItems[0], markKey: "live" }] }), false);
assert.equal(api.isSearchSuggestionsData({ term: "mew", items: ["mewtype", "泰星mew"] }), true);
assert.equal(api.isSearchSuggestionsData({ term: "mew", items: ["mewtype"], extra: true }), false);
assert.equal(api.isSearchSuggestionsData({ term: "mew", items: Array.from({ length: 11 }, () => "mew") }), false);
console.log("SEARCH_RENDERER_STATIC=PASS");
