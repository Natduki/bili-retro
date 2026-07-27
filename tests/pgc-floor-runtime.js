const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
let listener = null;
const context = {
  __EXTENSION_B_RUN_SELF_TESTS__: true,
  console,
  URL,
  URLSearchParams,
  TextDecoder,
  TextEncoder,
  Uint8Array,
  ArrayBuffer,
  AbortController,
  AbortSignal,
  ReadableStream,
  setTimeout,
  clearTimeout,
  chrome: {
    runtime: {
      id: "pgc-runtime-test-extension",
      onMessage: { addListener(handler) { listener = handler; } }
    }
  }
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: "sw.js" });
assert.equal(typeof listener, "function", "service worker listener registered");

Promise.resolve(context.__EXTENSION_B_PGC_SELF_TEST_PROMISE__).then(() => {
  assert.equal(context.__EXTENSION_B_PGC_SELF_TEST_PASSED__, true);
  console.log("PGC_FLOOR_RUNTIME=PASS");
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
