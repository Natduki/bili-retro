const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const serviceWorker = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
let listener = null;
const context = {
  console,
  URL,
  URLSearchParams,
  TextDecoder,
  TextEncoder,
  Uint8Array,
  ArrayBuffer,
  AbortController,
  setTimeout,
  clearTimeout,
  chrome: {
    runtime: {
      id: "focus-runtime-test-extension",
      onMessage: { addListener(handler) { listener = handler; } }
    }
  }
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(serviceWorker, context, { filename: "sw.js" });
assert.equal(typeof listener, "function", "service worker message listener");
context.__listener = listener;

const payload = {
  code: 0,
  data: {
    "3197": [
      {
        pos_num: 1,
        name: "runtime focus item",
        title: "",
        pic: "http://i0.hdslb.com/bfs/banner/runtime-focus.png",
        url: "http://www.bilibili.com/video/BV1d5TE6cE7c?track_id="
      }
    ]
  }
};
const payloadText = JSON.stringify(payload);
(async () => {
vm.runInContext(`
  globalThis.fetch = async () => {
    const bytes = new TextEncoder().encode(${JSON.stringify(payloadText)});
    let consumed = false;
    return {
      ok: true,
      status: 200,
      redirected: false,
      type: "basic",
      headers: { get: (name) => name.toLowerCase() === "content-type" ? "application/json; charset=utf-8" : null },
      body: {
        getReader: () => ({
          read: async () => {
            if (consumed) return { done: true, value: undefined };
            consumed = true;
            return { done: false, value: bytes };
          },
          cancel: async () => {}
        })
      }
    };
  };
  globalThis.__focusRequest = new Promise((resolve) => {
    const message = {
      type: "HOMEPAGE_DATA_REQUEST_V1",
      requestId: "focus-runtime-request",
      generation: 0,
      operation: "FOCUS_CAROUSEL",
      params: {}
    };
    const sender = {
      id: "focus-runtime-test-extension",
      tab: { id: 1 },
      frameId: 0,
      url: "https://www.bilibili.com/",
      origin: "https://www.bilibili.com"
    };
    globalThis.__listener(message, sender, resolve);
  });
`, context);

  const result = await context.__focusRequest;
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.items.length, 1);
  assert.equal(result.data.items[0].imageUrl, "https://i0.hdslb.com/bfs/banner/runtime-focus.png");
  assert.equal(result.data.items[0].linkUrl, "https://www.bilibili.com/video/BV1d5TE6cE7c?track_id=");
  console.log("FOCUS_CAROUSEL_RUNTIME=PASS");
})();
