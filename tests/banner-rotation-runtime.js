"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const start = source.indexOf("const chooseBannerPackage =");
const end = source.indexOf("const bannerRuntimeResult =", start);
if (start < 0 || end < 0) throw new Error("BANNER_ROTATION_HOOK_MISSING");

const FixedDate = class extends Date {
  constructor(...args) {
    super(...(args.length ? args : ["2026-08-06T00:00:00.000Z"]));
  }
};
const context = vm.createContext({
  Date: FixedDate,
  Uint32Array,
  crypto: webcrypto,
  console
});
vm.runInContext(`${source.slice(start, end)}; globalThis.chooseBannerPackage = chooseBannerPackage;`, context, {
  filename: "sw-banner-rotation.js"
});

const choose = context.chooseBannerPackage;
const packages = [{ id: "banner-a" }, { id: "banner-b" }, { id: "banner-c" }];
const assert = (condition, label) => {
  if (!condition) throw new Error(`Banner rotation runtime test failed: ${label}`);
};

assert(choose([], { packageId: null, rotation: "manual" }) === null, "empty package list returns null");
assert(choose(packages, { packageId: "banner-b", rotation: "manual" }) === "banner-b", "manual selection is stable");

const dailyFirst = choose(packages, { packageId: null, rotation: "daily" });
const dailySecond = choose(packages, { packageId: "banner-a", rotation: "daily" });
assert(dailyFirst === dailySecond, "daily rotation is stable for the same date");
assert(packages.some((item) => item.id === dailyFirst), "daily rotation selects an installed package");

const randomFirst = choose(packages, { packageId: "banner-b", rotation: "random" });
const randomSecond = choose(packages, { packageId: randomFirst, rotation: "random" });
assert(randomFirst !== "banner-b", "random rotation avoids the current package");
assert(randomSecond !== randomFirst, "random rotation avoids an immediate repeat");

console.log("banner-rotation-runtime: PASS");
