"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "page-bridge.js"), "utf8");
const context = vm.createContext({ console, URL, Map, Set, Object, Array, Number, String, Math, JSON, Promise, AbortController, TextEncoder, TextDecoder });
context.window = context;
context.addEventListener = () => {};
context.postMessage = () => {};
context.__EXTENSION_B_RUN_SELF_TESTS__ = true;
vm.runInContext(source, context, { filename: "page-bridge.js" });
const api = context.__EXTENSION_B_AUTH_BRIDGE_TEST__;
assert.ok(api && typeof api.projectBannerCurrent === "function");
const splitLayer = JSON.stringify({ version:"1", layers:[{
  resources:[{ src:"http://i0.hdslb.com/bfs/vc/layer.png", id:0 }],
  scale:{ initial:0.9, offset:0.2, offsetCurve:[0.25,0.1,0.25,1] },
  translate:{ initial:[2,3], offset:[20,10], offsetCurve:[0,0,1,1] },
  rotate:{ offset:0.1, offsetCurve:[0.42,0,0.58,1] },
  opacity:{ initial:0.8, offset:-0.2, offsetCurve:[0,0,1,1] },
  blur:{ initial:1, offset:2, offsetCurve:[0,0,1,1] }
}] });
const model = api.projectBannerCurrent({ code:0, data:{
  name:"", pic:"http://i1.hdslb.com/bfs/archive/background.webp", litpic:"http://i2.hdslb.com/bfs/archive/logo.png",
  url:"", is_split_layer:1, split_layer:splitLayer
} });
assert.equal(model.source, "official");
assert.equal(model.id, "official-header-current");
assert.equal(model.layers.length, 1);
assert.equal(model.layers[0].type, "image/png");
assert.equal(model.layers[0].transform[4], 2);
assert.equal(model.layers[0].offset.x, 20);
assert.equal(model.layers[0].rotation, 0.1);
assert.equal(model.layers[0].motion.scaleOffset, 0.2);
assert.deepEqual(model.layers[0].motion.scaleCurve, [0.25, 0.1, 0.25, 1]);
assert.deepEqual(model.layers[0].motion.translateCurve, [0, 0, 1, 1]);
assert.equal(model.layers[0].motion.rotateOffset, 0.1);
assert.equal(model.layers[0].motion.blurOffset, 2);
assert.equal(model.layers[0].motion.opacityOffset, -0.2);
assert.throws(() => api.projectBannerCurrent({ code:0, data:{ pic:"https://evil.example/a.webp" } }));
assert.equal(api.OPERATION_ROUTES.BANNER_CURRENT[0].path, "/x/web-show/page/header/v2?category=0");

const modernLayers = Array.from({ length: 33 }, (_, index) => ({
  resources: [{ src: `https://i1.hdslb.com/bfs/vc/layer-${index}.png`, id: 0 }],
  scale: { initial: 0.45 },
  translate: { offset: [index, 0] },
  rotate: {},
  opacity: {},
  blur: {},
  id: index
}));
const modernModel = api.projectBannerCurrent({ code: 0, data: {
  id: 371,
  name: "",
  pic: "https://i1.hdslb.com/bfs/archive/current.png",
  litpic: "https://i1.hdslb.com/bfs/archive/logo.png",
  is_split_layer: 1,
  split_layer: JSON.stringify({ version: "1", layers: modernLayers })
} });
assert.equal(modernModel.id, "official-header-371");
assert.equal(modernModel.layers.length, 33);
assert.equal(modernModel.layers[0].type, "image/png");
console.log("BANNER_BRIDGE_CONTRACT=PASS");
