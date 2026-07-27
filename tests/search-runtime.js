"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
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
      id: "search-runtime-test-extension",
      onMessage: { addListener(handler) { listener = handler; } }
    }
  }
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: "sw.js" });
assert.equal(typeof listener, "function");

const defaultPayload = {
  code: 0,
  data: {
    show_name: "接口默认词",
    url: "https://search.bilibili.com/all?keyword=%E6%8E%A5%E5%8F%A3%E9%BB%98%E8%AE%A4%E8%AF%8D",
    added: true
  }
};
const trendingPayload = {
  code: 0,
  data: {
    trending: {
      title: "bilibili热搜",
      list: Array.from({ length: 12 }, (_, index) => ({
        keyword: `热搜${index + 1}`,
        show_name: `热搜展示${index + 1}`,
        icon: index === 0 ? "https://i0.hdslb.com/bfs/search/runtime.png" : null,
        extra: true
      })),
      added: true
    }
  },
  added: true
};
const autocompletePayload = {
  code: 0,
  result: {
    tag: Array.from({ length: 12 }, (_, index) => ({
      value: index === 0 ? "mewtype" : `mew${index}`,
      name: `<em>mew</em>${index}`,
      extra: true
    }))
  },
  extra: true
};

const makeResponse = (payload, contentType = "application/json; charset=utf-8") => {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let consumed = false;
  return {
    ok: true,
    status: 200,
    redirected: false,
    type: "basic",
    headers: { get: (name) => name.toLowerCase() === "content-type" ? contentType : null },
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

const requests = [];
context.fetch = async (url, options) => {
  requests.push({ url, options });
  return url.includes("s.search.bilibili.com")
    ? makeResponse(autocompletePayload, null)
    : makeResponse(url.includes("search/default") ? defaultPayload : trendingPayload);
};

(async () => {
  const message = vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify({
    type: "HOMEPAGE_DATA_REQUEST_V1",
    requestId: "search-runtime-request",
    generation: 1,
    operation: "SEARCH_SUGGEST",
    params: {}
  }))})`, context);
  const sender = {
    id: "search-runtime-test-extension",
    tab: { id: 1 },
    frameId: 0,
    url: "https://www.bilibili.com/",
    origin: "https://www.bilibili.com"
  };
  let listenerReturn;
  const result = await Promise.race([
    new Promise((resolve) => { listenerReturn = listener(message, sender, resolve); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`search response timeout; listenerReturn=${listenerReturn}`)), 1000))
  ]);
  assert.equal(listenerReturn, true);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.data.defaultKeyword, "接口默认词");
  assert.equal(result.data.trendingItems.length, 10);
  assert.equal(result.data.trendingItems[0].remoteIcon, "https://i0.hdslb.com/bfs/search/runtime.png");
  assert.equal(requests.length, 2);
  for (const request of requests) {
    assert.equal(request.options.method, "GET");
    assert.equal(request.options.credentials, "omit");
    assert.equal(request.options.redirect, "manual");
  }
  const autocompleteMessage = vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify({
    type: "HOMEPAGE_DATA_REQUEST_V1",
    requestId: "search-autocomplete-runtime-request",
    generation: 2,
    operation: "SEARCH_AUTOCOMPLETE",
    params: { term: "mew" }
  }))})`, context);
  let autocompleteReturn;
  const autocompleteResult = await Promise.race([
    new Promise((resolve) => { autocompleteReturn = listener(autocompleteMessage, sender, resolve); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`autocomplete timeout; listenerReturn=${autocompleteReturn}`)), 1000))
  ]);
  assert.equal(autocompleteReturn, true);
  assert.equal(autocompleteResult.ok, true, JSON.stringify(autocompleteResult));
  assert.deepEqual(JSON.parse(JSON.stringify(autocompleteResult.data)), {
    term: "mew",
    items: ["mewtype", "mew1", "mew2", "mew3", "mew4", "mew5", "mew6", "mew7", "mew8", "mew9"]
  });
  const autocompleteUrl = new URL(requests[2].url);
  assert.equal(autocompleteUrl.origin, "https://s.search.bilibili.com");
  assert.equal(autocompleteUrl.pathname, "/main/suggest");
  assert.equal(autocompleteUrl.searchParams.get("term"), "mew");
  assert.equal(autocompleteUrl.searchParams.has("buvid"), false);
  assert.equal(autocompleteUrl.searchParams.has("rnd"), false);
  assert.equal(requests[2].options.credentials, "omit");
  console.log("SEARCH_RUNTIME=PASS");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
