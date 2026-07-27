const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");
const { TextEncoder } = require("node:util");

const source = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const smokeReferer = process.env.RANK_SMOKE_REFERER || "https://www.bilibili.com/v/popular/rank/douga";
const cookies = new Map();
const document = {
  querySelector() { return null; },
  createElement() { return {}; },
  head: { appendChild() {} },
  documentElement: { appendChild() {} }
};
Object.defineProperty(document, "cookie", {
  get() { return Array.from(cookies, ([name, value]) => `${name}=${value}`).join("; "); },
  set(value) {
    const first = String(value).split(";", 1)[0];
    const separator = first.indexOf("=");
    if (separator > 0) cookies.set(first.slice(0, separator), first.slice(separator + 1));
  }
});
if (process.env.RANK_SMOKE_EXISTING_DEVICE === "1") {
  cookies.set("buvid3", "existing-device-3");
  cookies.set("buvid4", "existing-device-4");
}
const windowObject = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  document,
  crypto: webcrypto,
  addEventListener() {},
  postMessage() {},
  setTimeout,
  clearTimeout,
  fetch: (url, options = {}) => fetch(url, {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: options.referrer || smokeReferer,
      ...(process.env.RANK_SMOKE_SEND_COOKIES === "0" && String(url).includes("/ranking/v2?") ? {} : { Cookie: document.cookie })
    }
  })
};
windowObject.window = windowObject;
const context = vm.createContext({ window: windowObject, URL, AbortController, TextEncoder, console, setTimeout, clearTimeout });
vm.runInContext(source, context, { filename: "page-bridge.js" });

(async () => {
  const values = await Promise.all([1005, 1003, 1007].map((rid) => (
    windowObject.__EXTENSION_B_AUTH_BRIDGE_TEST__.fetchCurrentVideoRanking(rid, new AbortController().signal)
  )));
  for (const data of values) {
    assert.equal(data.code, 0, JSON.stringify({ code: data.code, message: data.message }));
    assert.ok(Array.isArray(data.data && data.data.list));
    assert.ok(data.data.list.length >= 10);
  }
  assert.equal(cookies.has("bili_ticket"), true);
  if (process.env.RANK_SMOKE_EXISTING_DEVICE === "1") {
    assert.equal(cookies.get("buvid3"), "existing-device-3");
    assert.equal(cookies.get("buvid4"), "existing-device-4");
  }
  console.log(`CURRENT_RANK_LIVE_SMOKE=PASS referer=${smokeReferer} counts=${values.map((data) => data.data.list.length).join(",")}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
