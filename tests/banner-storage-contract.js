"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { webcrypto } = require("node:crypto");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.join(root, "extension-b");
const modelSource = fs.readFileSync(path.join(extensionRoot, "banner-model.js"), "utf8");
const swSource = fs.readFileSync(path.join(extensionRoot, "sw.js"), "utf8");
const modelContext = vm.createContext({
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
vm.runInContext(modelSource, modelContext, { filename: "banner-model.js" });

const storageStart = swSource.indexOf("const isPlainObject");
const storageEnd = swSource.indexOf("const BANNER_DEFAULT_SETTINGS");
if (storageStart < 0 || storageEnd < 0 || storageStart >= storageEnd) throw new Error("BANNER_STORAGE_VALIDATOR_NOT_FOUND");
const storageContext = vm.createContext({
  console,
  atob,
  BANNER_ASSET_MAX_BYTES: 8 * 1024 * 1024,
  BANNER_ASSET_MAX_BASE64_LENGTH: Math.ceil((8 * 1024 * 1024) / 3) * 4
});
const storageApi = vm.runInContext(`(() => {
  ${swSource.slice(storageStart, storageEnd)}
  return { validate: isBannerModelForStorage, decode: decodeBannerImportBytes };
})()`, storageContext, { filename: "sw-banner-storage.js" });

const hydrateForStorage = (value) => {
  storageContext.serializedModel = JSON.stringify(value);
  return vm.runInContext("JSON.parse(serializedModel)", storageContext);
};
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

(async () => {
  for (const date of [
    "2023-08-21-water", "2023-08-21-sea",
    "2023-10-01", "2023-10-26", "2023-11-17", "2023-12-12", "2024-02-01",
    "2024-06-06", "2024-06-26", "2024-09-26", "2024-12-26", "2025-04-05",
    "2025-06-15", "2025-09-10", "2026-01-09", "2026-04-27"
  ]) {
    const filePath = packageForDate(date);
    const file = fs.readFileSync(filePath);
    modelContext.input = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
    const parsed = await vm.runInContext("ExtensionBBannerModel.parseBannerPackage(input)", modelContext);
    if (!storageApi.validate(hydrateForStorage(parsed.model))) throw new Error(`BANNER_STORAGE_LEGACY_REJECTED_${date}`);
  }

  const packagePath = packageForDate("2024-12-26");
  const packageBytes = fs.readFileSync(packagePath);
  modelContext.input = packageBytes.buffer.slice(packageBytes.byteOffset, packageBytes.byteOffset + packageBytes.byteLength);
  const parsed = await vm.runInContext("ExtensionBBannerModel.parseBannerPackage(input)", modelContext);
  const motion = {
    scaleOffset: 0.2,
    scaleCurve: [0, 0, 1, 1],
    rotateOffset: 12,
    rotateCurve: [0.42, 0, 0.58, 1],
    translateCurve: [0, 0, 1, 1],
    blurOffset: 1,
    blurCurve: [0, 0, 1, 1],
    blurWrap: "clamp",
    opacityOffset: -0.1,
    opacityCurve: [0, 0, 1, 1],
    opacityWrap: "clamp"
  };
  const motionModel = {
    ...parsed.model,
    source: "official",
    layers: [{ ...parsed.model.layers[0], motion }]
  };
  if (!storageApi.validate(hydrateForStorage(motionModel))) throw new Error("BANNER_STORAGE_MOTION_REJECTED");
  const sampleBytes = new Uint8Array([0, 1, 2, 253, 254, 255]).buffer;
  const sampleBase64 = Buffer.from(sampleBytes).toString("base64");
  const decoded = storageApi.decode(sampleBase64);
  if (!decoded || decoded.byteLength !== sampleBytes.byteLength
    || Array.from(new Uint8Array(decoded)).join(",") !== Array.from(new Uint8Array(sampleBytes)).join(",")) {
    throw new Error("BANNER_STORAGE_BASE64_TRANSPORT_FAILED");
  }
  console.log("banner-storage-contract: PASS");
})().catch((error) => { console.error(error); process.exitCode = 1; });
