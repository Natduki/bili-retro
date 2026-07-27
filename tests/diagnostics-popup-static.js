const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const content = fs.readFileSync(path.join(root, "content.js"), "utf8");
const popupHtml = fs.readFileSync(path.join(root, "popup.html"), "utf8");
const popupCss = fs.readFileSync(path.join(root, "popup.css"), "utf8");
const popupJs = fs.readFileSync(path.join(root, "popup.js"), "utf8");

assert.equal(manifest.action.default_popup, "popup.html");
assert.deepEqual(manifest.permissions, ["storage", "activeTab"]);
assert.equal(manifest.permissions.includes("cookies"), false);
assert.equal(manifest.permissions.includes("tabs"), false);
assert.equal(manifest.permissions.includes("downloads"), false);

assert.match(content, /const DIAGNOSTICS_MESSAGE_TYPE = "BILI_RETRO_DIAGNOSTICS_GET_V1"/);
assert.match(content, /const DIAGNOSTICS_ERROR_LIMIT = 100/);
assert.match(content, /attribute\.name === "data-extension-b-owner"/);
assert.match(content, /operations: Object\.freeze\(Array\.from\(diagnosticOperations\.values\(\)\)/);
assert.match(content, /errors: Object\.freeze\(diagnosticErrors\.slice\(\)\.reverse\(\)\)/);
assert.doesNotMatch(content, /diagnostic.*(?:cookie|token|ticket|w_rid)/i);

assert.match(popupHtml, /id="statusList"/);
assert.match(popupHtml, /id="feedbackText"/);
assert.match(popupHtml, /id="includeScreenshot"[^>]*checked/);
assert.match(popupHtml, /id="exportBundleButton"/);
assert.match(popupHtml, /id="exportReportButton"/);
assert.match(popupCss, /\.status-dot/);
assert.match(popupCss, /\.green\{background:#2ac864\}/);
assert.match(popupCss, /\.red\{background:#f24e4e\}/);

assert.match(popupJs, /chrome\.tabs\.sendMessage\(activeTab\.id, \{ type:MESSAGE_TYPE \}\)/);
assert.match(popupJs, /chrome\.tabs\.captureVisibleTab/);
assert.match(popupJs, /userDescription:feedbackText\.value\.trim\(\)/);
assert.match(popupJs, /screenshotDataUrl:screenshot/);
assert.match(popupJs, /window\.setInterval\(refresh, POLL_INTERVAL_MS\)/);
assert.doesNotMatch(popupJs, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function|postMessage\([^,]+,[^)]*"\*"/);
assert.doesNotMatch(popupJs, /document\.cookie|localStorage|sessionStorage|SESSDATA|bili_jct|Authorization/);

console.log("DIAGNOSTICS_POPUP_STATIC=PASS");
