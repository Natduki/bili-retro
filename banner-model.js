(() => {
  "use strict";

  const MAX_NAME_LENGTH = 160;
  const MAX_ID_LENGTH = 96;
  const MAX_ASSET_REF_LENGTH = 2048;
  // Do not impose a Banner-specific layer count. Archive entry and byte
  // budgets below still bound untrusted packages without truncating a valid
  // dataset when Bilibili adds more layers.
  const MAX_ARCHIVE_ENTRIES = 512;
  const MAX_CANVAS = 8192;
  const MAX_DIMENSION = 32768;
  const MAX_TRANSFORM_VALUE = 100000;
  const MAX_OFFSET = 10000;
  const MAX_SCALE = 10;
  const MAX_ROTATION = 360;
  const MAX_BLUR = 100;
  const MAX_CURVE_COMPONENT = 100;
  const MAX_URL_LENGTH = 2048;
  const MEDIA_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "video/webm"]);
  const SOURCES = new Set(["official", "builtin", "imported"]);
  const PACKAGE_ROOT_KEYS = Object.freeze(["assets", "author", "canvas", "description", "id", "layers", "license", "name", "preview", "schemaVersion", "source", "version"]);
  const PACKAGE_ASSET_KEYS = Object.freeze(["assetRef", "mime", "sha256", "size"]);

  const ownKeys = (value) => Object.keys(value).sort().join("\u001F");
  const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
    && Object.getPrototypeOf(value) === Object.prototype;
  const finite = (value, min, max) => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
  const text = (value, max) => typeof value === "string" && value.length > 0 && value.length <= max && !/[\u0000-\u001F\u007F]/.test(value);
  const optionalText = (value, max) => value === "" || (typeof value === "string" && value.length <= max && !/[\u0000-\u001F\u007F]/.test(value));
  const safeId = (value) => text(value, MAX_ID_LENGTH) && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value);
  const safeAssetRef = (value) => text(value, MAX_ASSET_REF_LENGTH)
    && !value.includes("\\") && !value.includes("..") && !value.startsWith("/")
    && !/^(?:data|blob|javascript|file|chrome|chrome-extension):/i.test(value);
  const safeOfficialAssetRef = (value, mediaType) => {
    if (!text(value, MAX_URL_LENGTH)) return false;
    let parsed;
    try { parsed = new URL(value); } catch { return false; }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port || parsed.hash) return false;
    if (!["i0.hdslb.com", "i1.hdslb.com", "i2.hdslb.com", "i3.hdslb.com"].includes(parsed.hostname)) return false;
    if (!/^\/bfs\/(?:archive|vc)\//.test(parsed.pathname)) return false;
    const suffix = parsed.pathname.toLowerCase();
    return mediaType === "video/webm" ? suffix.endsWith(".webm") : /\.(?:png|jpe?g|webp)$/.test(suffix);
  };
  const safeTransform = (value) => Array.isArray(value) && value.length === 6 && value.every((entry) => finite(entry, -MAX_TRANSFORM_VALUE, MAX_TRANSFORM_VALUE));
  const safeCurve = (value) => Array.isArray(value) && value.length === 4
    && finite(value[0], 0, 1) && finite(value[1], -MAX_CURVE_COMPONENT, MAX_CURVE_COMPONENT)
    && finite(value[2], 0, 1) && finite(value[3], -MAX_CURVE_COMPONENT, MAX_CURVE_COMPONENT);
  const safeCurveOrNull = (value) => value === null || safeCurve(value);
  const safeWrap = (value) => value === "" || value === "clamp" || value === "alternate";
  const normalizeMotion = (value) => {
    if (value == null) return null;
    const palxiaoKeys = "a\u001Fdeg\u001Ff\u001Fg\u001Fopacity";
    if (isPlainObject(value) && ownKeys(value) === palxiaoKeys
      && finite(value.a, -100, 100) && finite(value.g, -100, 100)
      && finite(value.f, -10, 10) && finite(value.deg, -10, 10)
      && Array.isArray(value.opacity) && value.opacity.length === 2
      && value.opacity.every((entry) => finite(entry, 0, 1))) {
      return Object.freeze({
        a: value.a,
        g: value.g,
        f: value.f,
        deg: value.deg,
        opacity: Object.freeze(value.opacity.slice())
      });
    }
    const expected = "blurCurve\u001FblurOffset\u001FblurWrap\u001FopacityCurve\u001FopacityOffset\u001FopacityWrap\u001FrotateCurve\u001FrotateOffset\u001FscaleCurve\u001FscaleOffset\u001FtranslateCurve";
    if (!isPlainObject(value) || ownKeys(value) !== expected
      || !safeCurveOrNull(value.scaleCurve) || !finite(value.scaleOffset, -MAX_SCALE, MAX_SCALE)
      || !safeCurveOrNull(value.rotateCurve) || !finite(value.rotateOffset, -MAX_ROTATION, MAX_ROTATION)
      || !safeCurveOrNull(value.translateCurve)
      || !safeCurveOrNull(value.blurCurve) || !finite(value.blurOffset, -MAX_BLUR, MAX_BLUR) || !safeWrap(value.blurWrap)
      || !safeCurveOrNull(value.opacityCurve) || !finite(value.opacityOffset, -1, 1) || !safeWrap(value.opacityWrap)) return null;
    return Object.freeze({
      scaleOffset: value.scaleOffset,
      scaleCurve: value.scaleCurve === null ? null : Object.freeze(value.scaleCurve.slice()),
      rotateOffset: value.rotateOffset,
      rotateCurve: value.rotateCurve === null ? null : Object.freeze(value.rotateCurve.slice()),
      translateCurve: value.translateCurve === null ? null : Object.freeze(value.translateCurve.slice()),
      blurOffset: value.blurOffset,
      blurCurve: value.blurCurve === null ? null : Object.freeze(value.blurCurve.slice()),
      blurWrap: value.blurWrap,
      opacityOffset: value.opacityOffset,
      opacityCurve: value.opacityCurve === null ? null : Object.freeze(value.opacityCurve.slice()),
      opacityWrap: value.opacityWrap
    });
  };
  const normalizeLayer = (value, index = 0) => {
    if (!isPlainObject(value)) return null;
    const expected = "assetRef\u001Fblur\u001Fheight\u001Fid\u001Foffset\u001Fopacity\u001Frotation\u001Fscale\u001Ftransform\u001Ftype\u001Fwidth";
    const expectedWithMotion = "assetRef\u001Fblur\u001Fheight\u001Fid\u001Fmotion\u001Foffset\u001Fopacity\u001Frotation\u001Fscale\u001Ftransform\u001Ftype\u001Fwidth";
    if (ownKeys(value) !== expected && ownKeys(value) !== expectedWithMotion) return null;
    const motion = normalizeMotion(value.motion);
    if (value.motion != null && !motion) return null;
    if (!safeId(value.id) || !MEDIA_TYPES.has(value.type) || !safeAssetRef(value.assetRef)
      || !Number.isSafeInteger(value.width) || value.width < 1 || value.width > MAX_DIMENSION
      || !Number.isSafeInteger(value.height) || value.height < 1 || value.height > MAX_DIMENSION
      || !safeTransform(value.transform)
      || !isPlainObject(value.offset) || ownKeys(value.offset) !== "x\u001Fy"
      || !finite(value.offset.x, -MAX_OFFSET, MAX_OFFSET) || !finite(value.offset.y, -MAX_OFFSET, MAX_OFFSET)
      || !finite(value.scale, 0.01, MAX_SCALE) || !finite(value.rotation, -MAX_ROTATION, MAX_ROTATION)
      || !finite(value.opacity, 0, 1) || !finite(value.blur, 0, MAX_BLUR)) return null;
    return Object.freeze({
      id: value.id,
      type: value.type,
      width: value.width,
      height: value.height,
      transform: Object.freeze(value.transform.slice()),
      offset: Object.freeze({ x: value.offset.x, y: value.offset.y }),
      scale: value.scale,
      rotation: value.rotation,
      opacity: value.opacity,
      blur: value.blur,
      motion,
      assetRef: value.assetRef
    });
  };
  const isBannerModel = (value) => {
    if (!isPlainObject(value)) return false;
    const keys = ownKeys(value);
    if (keys !== "backgroundRef\u001Fcanvas\u001Fid\u001Flayers\u001FlogoRef\u001Fname\u001FschemaVersion\u001Fsource") return false;
    if (value.schemaVersion !== 1 || !SOURCES.has(value.source) || !safeId(value.id) || !text(value.name, MAX_NAME_LENGTH)
      || !isPlainObject(value.canvas) || ownKeys(value.canvas) !== "height\u001Fwidth"
      || !Number.isSafeInteger(value.canvas.width) || value.canvas.width < 1 || value.canvas.width > MAX_CANVAS
      || !Number.isSafeInteger(value.canvas.height) || value.canvas.height < 1 || value.canvas.height > MAX_CANVAS
      || !Array.isArray(value.layers) || value.layers.length < 1
      || !value.layers.every((layer, index) => normalizeLayer(layer, index) !== null)
      || (value.backgroundRef !== null && !safeAssetRef(value.backgroundRef))
      || (value.logoRef !== null && !safeAssetRef(value.logoRef))) return false;
    const ids = new Set(value.layers.map((layer) => layer.id));
    return ids.size === value.layers.length;
  };
  const freezeModel = (value) => {
    if (!isBannerModel(value)) return null;
    return Object.freeze({
      schemaVersion: 1,
      source: value.source,
      id: value.id,
      name: value.name,
      canvas: Object.freeze({ width: value.canvas.width, height: value.canvas.height }),
      backgroundRef: value.backgroundRef || null,
      logoRef: value.logoRef || null,
      layers: Object.freeze(value.layers.map((layer, index) => normalizeLayer(layer, index)))
    });
  };
  const layer = (id, type, assetRef, config = {}) => ({
    id, type, width: config.width || 1920, height: config.height || 180,
    transform: config.transform || [1, 0, 0, 1, config.initX || 0, config.initY || 0],
    offset: { x: config.offsetX || 0, y: config.offsetY || 0 },
    scale: config.scale == null ? 1 : config.scale,
    rotation: config.rotation || 0,
    opacity: config.opacity == null ? 1 : config.opacity,
    blur: config.blur || 0,
    motion: config.motion || null,
    assetRef
  });
  const createBuiltinModel = () => {
    const base = "assets/homepage/homepage-runtime/banner/";
    const layerConfigs = [
      ["layer-01", "image/png", `${base}layers/01-sky.png`, { scale: 0.87 }],
      ["layer-02", "image/png", `${base}layers/02-cloud.png`, { scale: 0.87, offsetX: 3 }],
      ["layer-03", "image/png", `${base}layers/03-character-33.png`, { initX: 0, initY: 5, offsetX: 20, offsetY: 10 }],
      ["layer-04", "image/png", `${base}layers/04-left-base.png`, { scale: 0.87, offsetX: 5 }],
      ["layer-05", "image/png", `${base}layers/05-car.png`, { scale: 0.87, initX: -270, initY: -20, offsetX: 20 }],
      ["layer-06", "image/png", `${base}layers/06-left-building.png`, { scale: 0.95, initX: -50, offsetX: 15, offsetY: -5 }],
      ["layer-07", "image/png", `${base}layers/07-character-22.png`, { width: 75, height: 60, initX: -250, initY: -20, offsetX: 30, rotation: 10 }],
      ["layer-08", "image/png", `${base}layers/08-flower-field.png`, { offsetX: 30, offsetY: 5 }],
      ["layer-09", "image/png", `${base}layers/09.png`, { scale: 0.87, offsetX: 50, offsetY: 10 }],
      ["layer-10", "image/png", `${base}layers/10.png`, { scale: 0.95, offsetX: 20, offsetY: 5 }],
      ["layer-11", "image/png", `${base}layers/11.png`, { offsetX: 40, offsetY: 10 }],
      ["layer-12", "image/png", `${base}layers/12-left-foreground.png`, { scale: 1.1, offsetX: 70, offsetY: 15 }],
      ["layer-13", "image/png", `${base}layers/13-left-leaf.png`, { scale: 1.1, offsetX: 80, offsetY: 15 }],
      ["layer-14", "image/png", `${base}layers/14-right-leaf.png`, { scale: 1.1, offsetX: 90, offsetY: 15 }],
      ["layer-15", "image/png", `${base}layers/15-debris.png`, { scale: 0.87 }],
      ["layer-16", "image/png", `${base}layers/16-right-grass.png`, { offsetX: 70, offsetY: 8 }],
      ["layer-17", "image/png", `${base}layers/17-front-grass.png`, { offsetX: 60, offsetY: 10 }],
      ["layer-18", "video/webm", `${base}layers/18-motion.webm`, { offsetX: 60, opacity: 0.5, blur: 1 }]
    ];
    const layers = layerConfigs.map(([id, type, ref, config]) => layer(id, type, ref, config));
    return freezeModel({
      schemaVersion: 1, source: "builtin", id: "builtin-default", name: "内置默认 Banner",
      canvas: { width: 1920, height: 180 },
      backgroundRef: `${base}fallback-1920x180.webp`,
      logoRef: `${base}logo-324x156.webp`,
      layers
    });
  };

  const ZIP_MAX_BYTES = 24 * 1024 * 1024;
  const ZIP_MAX_ASSET_BYTES = 8 * 1024 * 1024;
  const ZIP_MAX_PREVIEW_BYTES = 1024 * 1024;
  const readU16 = (view, offset) => view.getUint16(offset, true);
  const readU32 = (view, offset) => view.getUint32(offset, true);
  const crc32 = (bytes) => {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const decodeUtf8 = (bytes) => {
    try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { return null; }
  };
  const sha256Hex = async (bytes) => {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
  };
  const dataUrlFromBytes = (bytes, mime) => {
    let binary = "";
    const array = new Uint8Array(bytes);
    for (let offset = 0; offset < array.length; offset += 0x8000) {
      binary += String.fromCharCode(...array.subarray(offset, Math.min(offset + 0x8000, array.length)));
    }
    return `data:${mime};base64,${btoa(binary)}`;
  };
  const allowedPackagePath = (value) => typeof value === "string"
    && value.length > 0 && value.length <= MAX_ASSET_REF_LENGTH
    && value.startsWith("assets/") && !value.includes("\\") && !value.includes("..")
    && !value.slice(7).includes("/") && !value.includes("//") && !value.startsWith("/") && !/[\u0000-\u001F\u007F]/.test(value);
  const packageMimeForPath = (value) => {
    const lower = value.toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".webm")) return "video/webm";
    return null;
  };
  const hasMimeSignature = (bytes, mime) => {
    const value = new Uint8Array(bytes);
    if (mime === "image/png") return value.length >= 8 && value[0] === 0x89 && value[1] === 0x50 && value[2] === 0x4e && value[3] === 0x47;
    if (mime === "image/jpeg") return value.length >= 3 && value[0] === 0xff && value[1] === 0xd8 && value[2] === 0xff;
    if (mime === "image/webp") return value.length >= 12 && value[0] === 0x52 && value[1] === 0x49 && value[2] === 0x46 && value[3] === 0x46
      && value[8] === 0x57 && value[9] === 0x45 && value[10] === 0x42 && value[11] === 0x50;
    if (mime === "video/webm") return value.length >= 4 && value[0] === 0x1a && value[1] === 0x45 && value[2] === 0xdf && value[3] === 0xa3;
    return false;
  };
  const parseZipEntries = async (input) => {
    const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : null;
    if (!bytes || bytes.byteLength < 22 || bytes.byteLength > ZIP_MAX_BYTES) throw new Error("ZIP_SIZE");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let eocd = -1;
    for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset -= 1) {
      if (readU32(view, offset) === 0x06054b50) { eocd = offset; break; }
    }
    if (eocd < 0 || readU16(view, eocd + 4) !== 0 || readU16(view, eocd + 6) !== 0) throw new Error("ZIP_DIRECTORY");
    const count = readU16(view, eocd + 10);
    const directorySize = readU32(view, eocd + 12);
    const directoryOffset = readU32(view, eocd + 16);
    if (count < 2 || count > MAX_ARCHIVE_ENTRIES || directoryOffset + directorySize > bytes.length) throw new Error("ZIP_DIRECTORY");
    const entries = new Map(); let cursor = directoryOffset; let totalUncompressed = 0;
    for (let index = 0; index < count; index += 1) {
      if (cursor + 46 > bytes.length || readU32(view, cursor) !== 0x02014b50) throw new Error("ZIP_ENTRY");
      const flags = readU16(view, cursor + 8); const method = readU16(view, cursor + 10);
      const compressedSize = readU32(view, cursor + 20); const uncompressedSize = readU32(view, cursor + 24);
      const nameLength = readU16(view, cursor + 28); const extraLength = readU16(view, cursor + 30);
      const commentLength = readU16(view, cursor + 32); const localOffset = readU32(view, cursor + 42);
      const name = decodeUtf8(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
      if (!name || entries.has(name) || (flags & 1) !== 0 || (method !== 0 && method !== 8)
        || uncompressedSize > ZIP_MAX_ASSET_BYTES || compressedSize > ZIP_MAX_ASSET_BYTES
        || localOffset + 30 > bytes.length) throw new Error("ZIP_ENTRY");
      totalUncompressed += uncompressedSize;
      if (totalUncompressed > ZIP_MAX_BYTES) throw new Error("ZIP_SIZE");
      const localView = new DataView(bytes.buffer, bytes.byteOffset + localOffset, bytes.length - localOffset);
      if (readU32(localView, 0) !== 0x04034b50) throw new Error("ZIP_LOCAL");
      const localNameLength = readU16(localView, 26); const localExtraLength = readU16(localView, 28);
      const start = localOffset + 30 + localNameLength + localExtraLength; const end = start + compressedSize;
      if (end > bytes.length) throw new Error("ZIP_LOCAL");
      let data = bytes.slice(start, end);
      if (method === 8) {
        if (typeof DecompressionStream !== "function") throw new Error("ZIP_DEFLATE_UNSUPPORTED");
        data = new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
      }
      if (data.byteLength !== uncompressedSize || crc32(data) !== readU32(view, cursor + 16)) throw new Error("ZIP_CHECKSUM");
      entries.set(name, data.buffer); cursor += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
  };
  const validateManifestText = (manifest) => {
    if (!isPlainObject(manifest) || ownKeys(manifest) !== PACKAGE_ROOT_KEYS.slice().sort().join("\u001F")
      || manifest.schemaVersion !== 1 || !safeId(manifest.id) || !text(manifest.name, MAX_NAME_LENGTH)
      || !optionalText(manifest.description, 1000) || !text(manifest.version, 32) || !text(manifest.source, 256)
      || !text(manifest.author, 160) || !text(manifest.license, 160) || !isPlainObject(manifest.canvas)
      || ownKeys(manifest.canvas) !== "height\u001Fwidth" || !Number.isSafeInteger(manifest.canvas.width)
      || manifest.canvas.width < 1 || manifest.canvas.width > MAX_CANVAS || !Number.isSafeInteger(manifest.canvas.height)
      || manifest.canvas.height < 1 || manifest.canvas.height > MAX_CANVAS || manifest.preview !== "preview.webp"
      || !Array.isArray(manifest.layers) || manifest.layers.length < 1
      || !Array.isArray(manifest.assets) || manifest.assets.length !== manifest.layers.length) return false;
    const refs = new Set();
    for (const asset of manifest.assets) {
      if (!isPlainObject(asset) || ownKeys(asset) !== PACKAGE_ASSET_KEYS.slice().sort().join("\u001F")
        || !allowedPackagePath(asset.assetRef) || refs.has(asset.assetRef) || packageMimeForPath(asset.assetRef) !== asset.mime
        || !MEDIA_TYPES.has(asset.mime) || !Number.isSafeInteger(asset.size) || asset.size < 1 || asset.size > ZIP_MAX_ASSET_BYTES
        || typeof asset.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(asset.sha256)) return false;
      refs.add(asset.assetRef);
    }
    const ids = new Set(); const layerRefs = new Set();
    return manifest.layers.every((item) => {
      const normalized = normalizeLayer(item);
      if (!normalized || !allowedPackagePath(normalized.assetRef) || !refs.has(normalized.assetRef)
        || ids.has(normalized.id) || layerRefs.has(normalized.assetRef)) return false;
      ids.add(normalized.id); layerRefs.add(normalized.assetRef); return true;
    }) && layerRefs.size === refs.size;
  };
  const parseBannerPackage = async (input) => {
    const raw = input instanceof ArrayBuffer ? input : await input.arrayBuffer();
    const entries = await parseZipEntries(raw);
    for (const name of entries.keys()) if (name !== "manifest.json" && name !== "preview.webp" && !allowedPackagePath(name)) throw new Error("PACKAGE_ENTRY");
    if (!entries.has("manifest.json") || !entries.has("preview.webp")) throw new Error("PACKAGE_REQUIRED");
    const manifestText = decodeUtf8(new Uint8Array(entries.get("manifest.json"))); if (!manifestText) throw new Error("MANIFEST_ENCODING");
    let manifest; try { manifest = JSON.parse(manifestText); } catch { throw new Error("MANIFEST_JSON"); }
    if (!validateManifestText(manifest)) throw new Error("MANIFEST_SCHEMA");
    const expectedEntries = new Set(["manifest.json", "preview.webp", ...manifest.assets.map((asset) => asset.assetRef)]);
    if (entries.size !== expectedEntries.size || Array.from(entries.keys()).some((name) => !expectedEntries.has(name))) throw new Error("PACKAGE_ENTRY");
    const preview = entries.get("preview.webp"); if (preview.byteLength < 1 || preview.byteLength > ZIP_MAX_PREVIEW_BYTES || !hasMimeSignature(preview, "image/webp")) throw new Error("PREVIEW_SIZE");
    const assets = []; let total = preview.byteLength + new TextEncoder().encode(manifestText).byteLength;
    for (const item of manifest.assets) {
      const bytes = entries.get(item.assetRef); if (!bytes || bytes.byteLength !== item.size || bytes.byteLength > ZIP_MAX_ASSET_BYTES) throw new Error("ASSET_MISSING");
      if (!hasMimeSignature(bytes, item.mime) || await sha256Hex(bytes) !== item.sha256) throw new Error("ASSET_HASH");
      total += bytes.byteLength; assets.push(Object.freeze({ assetRef: item.assetRef, mime: item.mime, bytes }));
    }
    if (total > ZIP_MAX_BYTES) throw new Error("PACKAGE_SIZE");
    const model = freezeModel({ schemaVersion: 1, source: "imported", id: manifest.id, name: manifest.name,
      canvas: manifest.canvas, backgroundRef: null, logoRef: null, layers: manifest.layers });
    if (!model) throw new Error("MODEL_SCHEMA");
    return Object.freeze({ manifest, model, previewDataUrl: dataUrlFromBytes(preview, "image/webp"), assets, size: total, sha256: await sha256Hex(raw) });
  };

  const api = Object.freeze({
    MEDIA_TYPES: Object.freeze(Array.from(MEDIA_TYPES)),
    PACKAGE_ROOT_KEYS,
    PACKAGE_ASSET_KEYS,
    isPlainObject,
    safeAssetRef,
    safeCurve,
    normalizeMotion,
    safeOfficialAssetRef,
    isBannerModel,
    freezeModel,
    createBuiltinModel,
    BUILTIN_BANNER_MODEL: createBuiltinModel(),
    parseBannerPackage
  });
  globalThis.ExtensionBBannerModel = api;
})();
