"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.join(root, "extension-b");
const source = fs.readFileSync(path.join(__dirname, "..", "banner-model.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(extensionRoot, "manifest.json"), "utf8"));
const context = vm.createContext({
  crypto: webcrypto,
  Blob,
  Response,
  DecompressionStream,
  TextDecoder,
  TextEncoder,
  ArrayBuffer,
  Uint8Array,
  DataView,
  btoa,
  console
});
vm.runInContext(source, context, { filename: "banner-model.js" });
const api = context.ExtensionBBannerModel;
if (!api || !api.isBannerModel(api.BUILTIN_BANNER_MODEL) || api.BUILTIN_BANNER_MODEL.layers.length !== 18) {
  throw new Error("BANNER_MODEL_BUILTIN_FAILED");
}
if (api.isBannerModel({ ...api.BUILTIN_BANNER_MODEL, layers: [] })) throw new Error("BANNER_MODEL_EMPTY_LAYER_ACCEPTED");

const packageRoot = path.join(root, "release-assets", "banner");
const packageForDate = (date) => {
  const directories = fs.readdirSync(packageRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${date}-`));
  if (directories.length !== 1) throw new Error(`BANNER_PACKAGE_DIRECTORY_${date}`);
  const directory = path.join(packageRoot, directories[0].name);
  const packages = fs.readdirSync(directory).filter((name) => name.endsWith(".brbanner"));
  if (packages.length !== 1) throw new Error(`BANNER_PACKAGE_FILE_${date}`);
  return path.join(directory, packages[0]);
};

const exposedResources = new Set(manifest.web_accessible_resources.flatMap((entry) => entry.resources || []));
for (const assetRef of [api.BUILTIN_BANNER_MODEL.backgroundRef, api.BUILTIN_BANNER_MODEL.logoRef,
  ...api.BUILTIN_BANNER_MODEL.layers.map((layer) => layer.assetRef)]) {
  if (!assetRef || !fs.existsSync(path.join(extensionRoot, assetRef))) throw new Error(`BANNER_BUILTIN_ASSET_MISSING_${assetRef}`);
  if (!exposedResources.has(assetRef)) throw new Error(`BANNER_BUILTIN_ASSET_NOT_EXPOSED_${assetRef}`);
}

(async () => {
  for (const date of [
    "2023-08-21-water", "2023-08-21-sea",
    "2023-10-01", "2023-10-26", "2023-11-17", "2023-12-12", "2024-02-01",
    "2024-06-06", "2024-06-26", "2024-09-26", "2024-12-26", "2025-04-05",
    "2025-06-15", "2025-09-10", "2026-01-09", "2026-04-27"
  ]) {
    const filePath = packageForDate(date);
    if (!fs.existsSync(filePath)) throw new Error(`BANNER_PACKAGE_MISSING_${date}`);
    const file = fs.readFileSync(filePath);
    const buffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
    context.input = buffer;
    const parsed = await vm.runInContext(`ExtensionBBannerModel.parseBannerPackage(input)`, context);
    if (parsed.model.source !== "imported" || parsed.assets.length !== parsed.manifest.layers.length
      || parsed.manifest.layers.length < 1
      || (date === "2026-01-09" && parsed.manifest.layers.length !== 33)
      || (date === "2026-01-09" && !parsed.model.layers.every((layer) => layer.motion
        && Object.keys(layer.motion).sort().join("\u001F") === "a\u001Fdeg\u001Ff\u001Fg\u001Fopacity"))) {
      throw new Error(`BANNER_PACKAGE_INVALID_${date}`);
    }
  }
  console.log("banner-model-runtime: PASS");
})().catch((error) => { console.error(error); process.exitCode = 1; });
