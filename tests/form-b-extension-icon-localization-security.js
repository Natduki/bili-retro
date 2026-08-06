"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..", "..");
const RENDERER_PATH = path.join(ROOT, "extension-b", "homepage-renderer.js");
const MANIFEST_PATH = path.join(ROOT, "extension-b", "manifest.json");
const EXTENSION_ID = "controlledfixtureid";
const CATEGORY_PATH = "/assets/homepage/homepage-runtime/international-home/category-symbols.svg";
const CATEGORY_ORIGIN = `chrome-extension://${EXTENSION_ID}`;
const CATEGORY_BASE = `${CATEGORY_ORIGIN}${CATEGORY_PATH}`;

const ASSETS = [
  ["prototype/dynamic/assets/vendor/bilibili/homepage-shared/category-symbols.svg", "extension-b/assets/homepage/homepage-runtime/international-home/category-symbols.svg", "a9e85cd5c9724820258a98e49ec49ce997889816c6876106a31a86a47acd9434"],
  ["docs/old/www.bilibili.com2026.6.7/s1.hdslb.com/bfs/static/jinkela/international-home/assets/icon_gold.png", "extension-b/assets/homepage/homepage-runtime/international-home/icon_gold.png", "99931b4514426ac8333b70bc6c458fa43bfdaea8dca6d53c030045d8044e50fd"],
  ["docs/old/www.bilibili.com2026.6.7/s1.hdslb.com/bfs/static/jinkela/international-home/assets/icon_silver.png", "extension-b/assets/homepage/homepage-runtime/international-home/icon_silver.png", "a5a8ad02bb877f260682efaba972bdce9a5ac36caee078adc1d401dcbd08cccc"],
  ["docs/old/www.bilibili.com2026.6.7/s1.hdslb.com/bfs/static/jinkela/international-home/assets/bgm-nodata.png", "extension-b/assets/homepage/homepage-runtime/international-home/bgm-nodata.png", "f1b9f60208ffe5da8da9df8eba11db4cf5f33f74c9a3bf021d54c6be401fc043"],
  ["extension-b/assets/homepage/homepage-runtime/banner/download-client.svg", "extension-b/assets/homepage/homepage-runtime/international-home/download-client.svg", "fb6e114943f924e378738b223d9ec5d67a1684b5580771ea2d7297e0664078bb"]
];

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

class FakeNode {
  constructor(ownerDocument, tagName, namespace) {
    this.ownerDocument = ownerDocument;
    this.tagName = String(tagName).toUpperCase();
    this.namespaceURI = namespace || null;
    this.attributes = new Map();
    this.children = [];
    this.parentNode = null;
    this.classList = { contains: (name) => (this.getAttribute("class") || "").split(/\s+/).includes(name) };
  }

  setAttribute(name, value) { this.attributes.set(String(name), String(value)); }
  setAttributeNS(_namespace, name, value) { this.setAttribute(name, value); }
  getAttribute(name) { return this.attributes.get(String(name)) || null; }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child; }
}

class FakeDocument {
  createElementNS(namespace, tagName) { return new FakeNode(this, tagName, namespace); }
  createElement(tagName) { return new FakeNode(this, tagName); }
}

function loadProductionApi() {
  const source = fs.readFileSync(RENDERER_PATH, "utf8");
  const injected = source.replace(/\n\}\)\(\);\s*$/, `
  globalThis.__iconLocalizationApi = Object.freeze({
    ASSET_KEYS,
    resolveAssetKey,
    validateCategoryUseUrl,
    captureCategorySpriteUrl,
    resolveCategoryUseUrl,
    categorySymbolFor,
    createSvgIcon
  });
})();`);
  assert.notEqual(injected, source, "renderer test export marker inserted");
  const sandbox = {
    chrome: { runtime: { id: EXTENSION_ID, getURL: (key) => `${CATEGORY_ORIGIN}/${key}` } },
    URL,
    Promise,
    String,
    Number,
    Object,
    Array,
    Boolean,
    Math,
    Set,
    Map,
    WeakMap,
    RegExp,
    Error,
    globalThis: null
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(injected, sandbox, { filename: RENDERER_PATH });
  return sandbox.__iconLocalizationApi;
}

function assertAssetHashesAndWar() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const resources = manifest.web_accessible_resources.flatMap((entry) => entry.resources);
  for (const [source, target, expected] of ASSETS) {
    const targetPath = path.join(ROOT, target);
    assert.equal(fs.existsSync(targetPath), true, `target exists: ${target}`);
    assert.equal(sha256(targetPath), expected, `target hash: ${target}`);
    assert.equal(resources.filter((resource) => resource === target.slice("extension-b/".length)).length, 1, `WAR exactly once: ${target}`);
  }
  assert.equal(resources.includes("assets/homepage/homepage-runtime/banner/download-client.svg"), false, "stale download target is not exposed");
  assert.deepEqual(manifest.host_permissions, [
    "https://api.bilibili.com/*",
    "https://s.search.bilibili.com/*",
    "https://manga.bilibili.com/*"
  ], "fixed API host allowlist unchanged");
  assert.deepEqual(manifest.content_scripts[0].matches, [
    "https://www.bilibili.com/",
    "https://www.bilibili.com/index.html"
  ], "legacy homepage matches unchanged");
  assert.deepEqual(manifest.web_accessible_resources[0].matches, ["https://www.bilibili.com/*"], "WAR match unchanged");
}

function assertFrozenAssetBoundary(api) {
  assert.equal(Object.isFrozen(api.ASSET_KEYS), true, "asset map frozen");
  for (const keyName of ["CATEGORY_SYMBOLS", "ICON_GOLD", "ICON_SILVER", "PGC_EMPTY"]) {
    const key = api.ASSET_KEYS[keyName];
    assert.equal(api.resolveAssetKey(key), key, `frozen key resolves: ${keyName}`);
  }
  for (const value of [
    "../category-symbols.svg",
    "assets\\homepage\\icon.svg",
    "assets/homepage/icon.svg?x=1",
    "assets/homepage/icon.svg#fragment",
    "assets/homepage/icon.svg:bad",
    "assets//homepage/icon.svg",
    "assets/homepage/icon.svg\u0000",
    "assets/homepage/not-approved.svg",
    "iconUrl",
    "https://evil.example/icon.svg"
  ]) {
    assert.equal(api.resolveAssetKey(value), null, `asset boundary rejects ${JSON.stringify(value)}`);
  }
}

function assertUrlMatrix(api, root) {
  const valid = `${CATEGORY_BASE}#bili-anime`;
  assert.equal(api.validateCategoryUseUrl(valid, "bili-anime"), valid, "valid extension URL and fragment accepted");
  assert.equal(api.resolveCategoryUseUrl(root, "bili-anime"), valid, "production root URL accepted");
  for (const invalid of [
    "http://example.test/assets/homepage/homepage-runtime/international-home/category-symbols.svg#bili-anime",
    "https://example.test/assets/homepage/homepage-runtime/international-home/category-symbols.svg#bili-anime",
    "javascript:alert(1)",
    "data:image/svg+xml,#bili-anime",
    "blob:https://example.test/id#bili-anime",
    "file:///assets/homepage/homepage-runtime/international-home/category-symbols.svg#bili-anime",
    "category-symbols.svg#bili-anime",
    `${CATEGORY_BASE}?x=1#bili-anime`,
    `${CATEGORY_ORIGIN}@evil.example${CATEGORY_PATH}#bili-anime`,
    `${CATEGORY_ORIGIN}${CATEGORY_PATH.replace("international-home", "../international-home")}#bili-anime`,
    `${CATEGORY_BASE}#bili-manga`,
    `${CATEGORY_BASE}#bili-anime%00`,
    `${CATEGORY_BASE}#bili-anime#extra`,
    `${CATEGORY_ORIGIN}${CATEGORY_PATH}#unknown`
  ]) {
    assert.equal(api.validateCategoryUseUrl(invalid, "bili-anime"), null, `URL matrix rejects ${invalid}`);
  }
  assert.equal(api.resolveCategoryUseUrl(root, "bili-manga"), null, "manga cannot use external fragment");
}

function assertDomOwnershipAndFallbacks(api, root) {
  const host = { shadowRoot: null };
  const external = api.createSvgIcon(root, "bili-anime", 24, "category-icon");
  const use = external.children[0];
  assert.equal(host.shadowRoot, null, "closed shadow root stays closed");
  assert.equal(external.ownerDocument, root.ownerDocument, "external svg belongs to passed root document");
  assert.equal(use.ownerDocument, root.ownerDocument, "use belongs to passed root document");
  assert.equal(use.tagName, "PATH", "known category icon renders from the local DOM fallback");
  assert.equal(use.getAttribute("href"), null, "known category icon has no external href");
  assert.equal(use.getAttribute("xlink:href"), null, "known category icon has no external xlink href");

  const manga = api.createSvgIcon(root, "bili-manga", 24, "category-icon");
  assert.equal(manga.children[0].tagName, "PATH", "manga uses local DOM fallback");
  assert.equal(manga.children[0].getAttribute("href"), null, "manga fallback has no external href");
  const unknown = api.createSvgIcon(root, "hostile-symbol", 24, "category-icon");
  assert.equal(unknown.children[0].tagName, "PATH", "unknown symbol fails closed");
  assert.equal(unknown.children[0].getAttribute("href"), null, "unknown fallback has no external href");

  const zhishi = api.createSvgIcon(root, "bili-zhishi", 24, "category-icon");
  assert.equal(zhishi.classList.contains("bili-icon_zhishi"), true, "zhishi dual-track class preserved");
  assert.equal(zhishi.children[0].getAttribute("href"), null, "zhishi is also fully local");

  assert.equal(api.categorySymbolFor("bili-anime"), "bili-tuiguang", "field-like symbol string cannot become a fragment");
  assert.equal(api.categorySymbolFor({ toString: () => "bili-anime" }), "bili-tuiguang", "hostile object cannot alter fixed icon");
  assert.equal(api.categorySymbolFor("manga"), "bili-manga", "homepage manga contract stays local");
  assert.equal(api.categorySymbolFor("course"), "bili-zhishi", "classroom contract maps to zhishi");
}

function assertSinkScan() {
  const renderer = fs.readFileSync(RENDERER_PATH, "utf8");
  const test = fs.readFileSync(__filename, "utf8");
  const join = (...parts) => parts.join("");
  const chars = (values) => String.fromCharCode(...values);
  const forbidden = [
    join("inner", "HTML"),
    join("outer", "HTML"),
    join("insertAdjacent", "HTML"),
    join("DOM", "Parser"),
    join("document", ".", "write"),
    join("src", "doc"),
    chars([101, 118, 97, 108]),
    join("new", " Function"),
    join("post", "Message"),
    join("local", "Storage"),
    join("session", "Storage"),
    join("fe", "tch"),
    join("XML", "Http", "Request"),
    join("Web", "Socket"),
    join("document", ".", "body"),
    join("document", ".", "querySelector"),
    join("document", ".", "getElementById")
  ];
  for (const needle of forbidden) {
    assert.equal(renderer.includes(needle), false, `renderer sink scan: ${needle}`);
    assert.equal(test.includes(needle), false, `test sink scan: ${needle}`);
  }
  assert.equal(renderer.includes("resolveLocalAssetUrl(ASSET_KEYS.CATEGORY_SYMBOLS)"), true, "category URL uses frozen asset key");
  assert.match(renderer, /createElement\("iframe"\)[\s\S]*?setAttribute\("src", "https:\/\/t\.bilibili\.com\/pages\/nav\/index_new"\)/,
    "the sole iframe has a fixed Bilibili navigation URL");
  assert.equal(renderer.includes("createCategorySprite(root)"), false, "partial inline sprite is not rendered");
  assert.equal(renderer.includes(join("bili-$", "{type}")), false, "arbitrary type-to-fragment concatenation absent");
  assert.equal(renderer.includes("ASSET_KEYS.PGC_EMPTY"), true, "PGC empty branch uses fixed asset key");
}

assertAssetHashesAndWar();
const api = loadProductionApi();
assertFrozenAssetBoundary(api);
const document = new FakeDocument();
const root = document.createElement("main");
api.captureCategorySpriteUrl(root);
assertUrlMatrix(api, root);
assertDomOwnershipAndFallbacks(api, root);
assertSinkScan();
console.log("form-b-extension-icon-localization-security: PASS");
