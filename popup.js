(() => {
  "use strict";

  const MESSAGE_TYPE = "BILI_RETRO_DIAGNOSTICS_GET_V1";
  const SCREENSHOT_MESSAGE_TYPE = "BILI_RETRO_FULL_PAGE_SCREENSHOT_V1";
  const POLL_INTERVAL_MS = 1500;
  const CAPTURE_INTERVAL_MS = 550;
  const MAX_CANVAS_DIMENSION = 32767;
  const MAX_CANVAS_AREA = 64 * 1024 * 1024;
  const STATUS_CLASSES = Object.freeze({ healthy: "green", pending: "yellow", failed: "red", unknown: "gray" });
  const OPERATION_LABELS = Object.freeze({
    AUTH_STATUS: "登录状态", PROFILE_STATS: "用户资料", MESSAGE_SUMMARY: "消息摘要", DYNAMIC_SUMMARY: "动态摘要",
    FAVORITE_SUMMARY: "收藏摘要", HISTORY_SUMMARY: "历史摘要", LIVE_HOVER: "直播浮层",
    PRIMARY_MENU_COUNTS: "频道数量", RECOMMENDATION_FEED: "推荐视频", DOUGA_FLOOR: "动画区",
    BANNER_CURRENT: "官方 Banner",
    ORDINARY_ZONE_FLOOR: "视频分区", READ_FLOOR: "专栏", LIVE_FLOOR_INITIAL: "直播区",
    LIVE_FLOOR_MORE: "直播换批", LIVE_FLOOR_FOLLOWING: "关注主播", WATCH_LATER_MUTATE: "稍后再看",
    SEARCH_SUGGEST: "热搜", SHOW_LOGIN: "登录组件", LOGOUT: "退出登录"
  });
  const ZONE_LABELS = Object.freeze({
    music:"音乐",dance:"舞蹈",game:"游戏",knowledge:"知识",course:"课堂",tech:"科技",sports:"运动",car:"汽车",
    life:"生活",food:"美食",animal:"动物圈",kichiku:"鬼畜",fashion:"时尚",information:"资讯",ent:"娱乐",
    movie:"电影",teleplay:"TV剧",cinephile:"影视",documentary:"纪录片"
  });

  const byId = (id) => document.getElementById(id);
  const statusList = byId("statusList");
  const errorList = byId("errorList");
  const feedbackText = byId("feedbackText");
  const includeScreenshot = byId("includeScreenshot");
  const exportStatus = byId("exportStatus");
  const bannerSource = byId("bannerSource");
  const bannerRotation = byId("bannerRotation");
  const bannerImport = byId("bannerImport");
  const bannerRefreshButton = byId("bannerRefreshButton");
  const bannerStatus = byId("bannerStatus");
  const bannerCurrent = byId("bannerCurrent");
  const bannerPackages = byId("bannerPackages");
  let latestSnapshot = null;
  let activeTab = null;
  let pollTimer = 0;
  let exportInProgress = false;
  let bannerSnapshot = { settings:{ source:"official", packageId:null, rotation:"manual" }, packages:[] };

  const classifyStatus = (value) => {
    const status = String(value || "").toLowerCase();
    if (["success","committed","bound","complete","mounted","last-good","shown"].includes(status)) return "healthy";
    if (["loading","request-posted","retrying","bridge-wait","unknown","partial","session-loading","session-retrying","rank-loading","rank-retrying"].includes(status)) return "pending";
    if (["error","timeout","unavailable","bridge-error","response-invalid","failure","commit-failed","no-response","rank-failed"].includes(status)) return "failed";
    return "unknown";
  };

  const createElement = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const formatDuration = (value) => Number.isFinite(value) ? `${Math.round(value)} ms` : "--";
  const formatClock = (timestamp) => Number.isFinite(timestamp)
    ? new Date(timestamp).toLocaleTimeString("zh-CN", { hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" })
    : "--";

  const operationLabel = (operation) => {
    const parts = String(operation).split(":");
    const base = OPERATION_LABELS[parts[0]] || parts[0];
    if (parts[0] === "ORDINARY_ZONE_FLOOR") return `${ZONE_LABELS[parts[1]] || parts[1]}${parts[2] === "rank" ? "排行榜" : "视频"}`;
    if (parts[0] === "DOUGA_FLOOR") return `动画${parts[1] === "rank" ? "排行榜" : "视频"}`;
    if (parts[0] === "WATCH_LATER_MUTATE") return `${base}·${parts[1] || ""}`;
    return base;
  };

  const stateLabel = (name) => name
    .replace(/^data-extension-b-/, "")
    .replace(/-state$/, "")
    .replace(/^zone-([a-z]+)-rank$/, (_, zone) => `${ZONE_LABELS[zone] || zone}排行榜`)
    .replace(/^zone-([a-z]+)$/, (_, zone) => `${ZONE_LABELS[zone] || zone}楼层`)
    .replace("douga-rank", "动画排行榜")
    .replace("douga", "动画楼层")
    .replace("read-floor", "专栏")
    .replace("live-floor", "直播楼层")
    .replace("recommendation", "推荐区")
    .replace("auth", "登录态")
    .replace("pgc-anime", "番剧")
    .replace("pgc-guochuang", "国创")
    .replace("banner-state", "Banner 来源")
    .replace("primary-menu-counts", "频道数量")
    .replace("search-autocomplete", "搜索联想")
    .replace("search", "搜索")
    .replace("ranking-phase", "排行榜阶段");

  const appendStatusRow = (container, name, status, durationMs = null) => {
    const classification = classifyStatus(status);
    const row = createElement("div", "status-row");
    row.appendChild(createElement("span", `status-dot ${STATUS_CLASSES[classification]}`));
    row.appendChild(createElement("span", "status-name", name));
    row.appendChild(createElement("span", "status-value", String(status || "unknown")));
    row.appendChild(createElement("span", "status-time", formatDuration(durationMs)));
    container.appendChild(row);
    return classification;
  };

  const renderSnapshot = (snapshot) => {
    latestSnapshot = snapshot;
    statusList.replaceChildren();
    errorList.replaceChildren();
    const counts = { healthy:0, pending:0, failed:0, unknown:0 };
    if (!snapshot || snapshot.connected !== true) {
      statusList.appendChild(createElement("p", "empty-state", "当前标签未连接 bili-retro 首页"));
      byId("connectionText").textContent = "未连接受支持的首页";
      byId("versionText").textContent = "--";
    } else {
      byId("connectionText").textContent = snapshot.page && snapshot.page.url ? snapshot.page.url : "已连接";
      byId("versionText").textContent = `v${snapshot.extension.version} · ${snapshot.extension.build}`;
      const operationTitle = createElement("div", "group-title", "接口请求");
      statusList.appendChild(operationTitle);
      for (const operation of snapshot.operations || []) {
        counts[appendStatusRow(statusList, operationLabel(operation.operation), operation.status, operation.durationMs)] += 1;
      }
      const stateTitle = createElement("div", "group-title", "页面模块");
      statusList.appendChild(stateTitle);
      for (const [name, value] of Object.entries(snapshot.states || {}).sort()) {
        if (name === "data-extension-b-version" || name === "data-extension-b-build") continue;
        counts[appendStatusRow(statusList, stateLabel(name), value)] += 1;
      }
      if ((snapshot.operations || []).length === 0 && Object.keys(snapshot.states || {}).length <= 2) {
        statusList.appendChild(createElement("p", "empty-state", "等待页面接口产生诊断数据"));
      }
    }
    for (const key of Object.keys(counts)) byId(`${key === "healthy" ? "healthy" : key === "pending" ? "pending" : key === "failed" ? "failed" : "unknown"}Count`).textContent = String(counts[key]);
    const errors = snapshot && Array.isArray(snapshot.errors) ? snapshot.errors : [];
    byId("errorBadge").textContent = String(errors.length);
    if (errors.length === 0) {
      errorList.appendChild(createElement("p", "empty-state", "当前没有错误记录"));
    } else {
      for (const error of errors.slice(0, 100)) {
        const card = createElement("article", "error-card");
        card.appendChild(createElement("strong", "", operationLabel(error.operation)));
        const meta = createElement("div", "error-meta");
        meta.appendChild(createElement("span", "", `${error.status} · ${error.errorKind || "UNKNOWN"}`));
        meta.appendChild(createElement("span", "", `${formatDuration(error.durationMs)} · ${formatClock(error.timestamp)}`));
        card.appendChild(meta);
        errorList.appendChild(card);
      }
    }
    byId("updatedText").textContent = `更新 ${formatClock(Date.now())}`;
  };

  const queryActiveTab = async () => {
    const tabs = await chrome.tabs.query({ active:true, currentWindow:true });
    return tabs && tabs[0] ? tabs[0] : null;
  };

  const isHomepageTab = (tab) => Boolean(tab && Number.isInteger(tab.id)
    && (tab.url === "https://www.bilibili.com/" || tab.url === "https://www.bilibili.com/index.html"));
  const queryHomepageTab = async () => {
    const active = await queryActiveTab();
    if (isHomepageTab(active)) return active;
    const response = await sendExtensionMessage({ type:"BANNER_HOME_TAB_GET_V1" });
    if (!response || response.type !== "BANNER_HOME_TAB_RESULT_V1" || !Number.isInteger(response.tabId)) return null;
    return { id:response.tabId, windowId:Number.isInteger(response.windowId) ? response.windowId : null, url:"https://www.bilibili.com/" };
  };

  const sendExtensionMessage = (message) => new Promise((resolve) => {
    try { chrome.runtime.sendMessage(message, (response) => resolve(response || null)); } catch { resolve(null); }
  });
  const sendActiveBannerMessage = async (type) => {
    const tab = (activeTab && isHomepageTab(activeTab)) ? activeTab : await queryHomepageTab();
    if (!tab || !Number.isInteger(tab.id)) return false;
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { type });
      return Boolean(response && response.ok === true);
    } catch { return false; }
  };
  const renderBannerPanel = (snapshot) => {
    bannerSnapshot = snapshot || bannerSnapshot;
    const settings = bannerSnapshot.settings || { source:"official", packageId:null, rotation:"manual" };
    bannerSource.value = settings.source;
    bannerRotation.value = settings.rotation;
    bannerCurrent.replaceChildren();
    const current = createElement("div", "banner-current");
    const title = createElement("h3", "", settings.source === "official" ? "当前：官方自动" : settings.source === "builtin" ? "当前：内置默认" : "当前：本地包");
    current.appendChild(title);
    const selected = (bannerSnapshot.packages || []).find((item) => item.id === settings.packageId);
    if (selected && selected.previewDataUrl) {
      const preview = createElement("img", "banner-preview"); preview.src = selected.previewDataUrl; preview.alt = "Banner 预览"; current.appendChild(preview);
    }
    const meta = createElement("div", "banner-meta");
    meta.appendChild(createElement("span", "", selected ? `${selected.name} v${selected.version}` : (settings.source === "official" ? "失败时使用最近一次成功数据" : "默认资源随扩展提供")));
    meta.appendChild(createElement("span", "", selected ? `${selected.layers} 层 · ${selected.size} bytes` : "当前实际来源由首页诊断状态确认"));
    current.appendChild(meta); bannerCurrent.appendChild(current);
    bannerPackages.replaceChildren();
    if (!(bannerSnapshot.packages || []).length) {
      bannerPackages.appendChild(createElement("p", "banner-empty", "尚未安装 .brbanner 包")); return;
    }
    for (const item of bannerSnapshot.packages) {
      const card = createElement("article", "banner-package");
      card.appendChild(createElement("h3", "", `${item.name} · ${item.version}`));
      if (item.previewDataUrl) { const image = createElement("img", "banner-preview"); image.src = item.previewDataUrl; image.alt = `${item.name} 预览`; card.appendChild(image); }
      const details = createElement("div", "banner-meta");
      for (const value of [`来源：${item.source}`, `作者：${item.author}`, `许可：${item.license}`, `层数：${item.layers}`, `大小：${item.size} bytes`, `SHA-256：${item.sha256.slice(0, 16)}…`]) details.appendChild(createElement("span", "", value));
      card.appendChild(details);
      const actions = createElement("div", "banner-package-actions");
      const apply = createElement("button", "", "应用"); apply.type = "button"; apply.disabled = settings.source === "imported" && settings.packageId === item.id;
      apply.addEventListener("click", async () => { bannerStatus.textContent = "正在应用 Banner"; await setBannerSettings({ source:"imported", packageId:item.id, rotation:bannerRotation.value }); });
      const remove = createElement("button", "", "删除"); remove.type = "button";
      remove.addEventListener("click", async () => { bannerStatus.textContent = "正在删除 Banner 包"; const result = await sendExtensionMessage({ type:"BANNER_PACKAGE_DELETE_V1", id:item.id }); if (!result || result.ok !== true) { bannerStatus.textContent = "删除失败，当前 Banner 未改变"; return; } bannerStatus.textContent = "Banner 包已删除"; await refreshBannerPanel(); });
      actions.appendChild(apply); actions.appendChild(remove); card.appendChild(actions); bannerPackages.appendChild(card);
    }
  };
  const refreshBannerPanel = async () => {
    const response = await sendExtensionMessage({ type:"BANNER_STORAGE_LIST_V1" });
    if (!response || response.type !== "BANNER_STORAGE_LIST_RESULT_V1") { bannerStatus.textContent = "无法读取 Banner 设置"; return; }
    renderBannerPanel(response); bannerStatus.textContent = "Banner 设置已读取";
  };
  const setBannerSettings = async (settings) => {
    const response = await sendExtensionMessage({ type:"BANNER_SETTINGS_SET_V1", settings });
    if (!response || response.ok !== true) { bannerStatus.textContent = "设置保存失败，当前 Banner 未改变"; return false; }
    const applied = await sendActiveBannerMessage("BANNER_APPLY_V1");
    bannerStatus.textContent = applied ? "Banner 已应用" : "设置已保存，当前首页稍后会应用";
    await refreshBannerPanel(); return applied;
  };
  const bannerBytesToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + 0x8000, bytes.length)));
    }
    return btoa(binary);
  };
  const importBannerPackage = async () => {
    const file = bannerImport.files && bannerImport.files[0]; if (!file) return;
    bannerImport.value = ""; bannerStatus.textContent = "正在校验 Banner 包";
    try {
      const parsed = await globalThis.ExtensionBBannerModel.parseBannerPackage(await file.arrayBuffer());
      const transportPackage = {
        ...parsed,
        assets: parsed.assets.map((asset) => ({
          assetRef: asset.assetRef,
          mime: asset.mime,
          bytes: bannerBytesToBase64(asset.bytes)
        }))
      };
      const response = await sendExtensionMessage({ type:"BANNER_PACKAGE_IMPORT_V1", package: transportPackage });
      if (!response || response.ok !== true) throw new Error(response && response.error ? `IMPORT_REJECTED_${response.error}` : "IMPORT_REJECTED");
      bannerStatus.textContent = "导入成功，点击应用后才会替换首页"; await refreshBannerPanel();
    } catch (error) { bannerStatus.textContent = `导入失败：${error && error.message ? error.message : "文件无效"}`; }
  };

  const refresh = async () => {
    try {
      activeTab = await queryHomepageTab();
      if (!activeTab || !Number.isInteger(activeTab.id)) throw new Error("NO_ACTIVE_TAB");
      const response = await chrome.tabs.sendMessage(activeTab.id, { type:MESSAGE_TYPE });
      renderSnapshot(response);
    } catch {
      renderSnapshot(null);
    }
  };

  const downloadBlob = (filename, type, content) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const sleep = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const screenshotMessage = (payload) => chrome.tabs.sendMessage(activeTab.id, {
    type:SCREENSHOT_MESSAGE_TYPE,
    ...payload
  });
  const loadCaptureImage = (dataUrl) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE"));
    image.src = dataUrl;
  });
  const canvasBlob = (canvas) => new Promise((resolve, reject) => canvas.toBlob(
    (blob) => blob ? resolve(blob) : reject(new Error("ENCODE")),
    "image/png"
  ));
  const sha256Blob = async (blob) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await blob.arrayBuffer())))
    .map((value) => value.toString(16).padStart(2, "0")).join("");
  const captureFullPageScreenshot = async (stamp) => {
    if (!includeScreenshot.checked || !activeTab || !Number.isInteger(activeTab.id)
      || !Number.isInteger(activeTab.windowId)) return null;
    const sessionId = `${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "")}`;
    let prepared = false;
    try {
      const dimensions = await screenshotMessage({ action:"prepare", sessionId });
      if (!dimensions || dimensions.ok !== true || dimensions.pageHeight <= 0 || dimensions.viewportHeight <= 0) throw new Error("PREPARE");
      prepared = true;
      const positions = [];
      const maximumY = Math.max(0, dimensions.pageHeight - dimensions.viewportHeight);
      for (let y = 0; y < maximumY; y += dimensions.viewportHeight) positions.push(y);
      if (positions.length === 0 || positions.at(-1) !== maximumY) positions.push(maximumY);
      let canvas = null;
      let context = null;
      let pixelRatio = 1;
      let outputScale = 1;
      for (let index = 0; index < positions.length; index += 1) {
        exportStatus.textContent = `正在截取第 ${index + 1}/${positions.length} 屏`;
        const position = await screenshotMessage({ action:"scroll", sessionId, targetY:positions[index], first:index === 0 });
        if (!position || position.ok !== true) throw new Error("SCROLL");
        if (index > 0) await sleep(CAPTURE_INTERVAL_MS);
        const dataUrl = await chrome.tabs.captureVisibleTab(activeTab.windowId, { format:"png" });
        const image = await loadCaptureImage(dataUrl);
        if (!canvas) {
          pixelRatio = image.width / dimensions.viewportWidth;
          const rawWidth = image.width;
          const rawHeight = Math.ceil(dimensions.pageHeight * pixelRatio);
          outputScale = Math.min(1, MAX_CANVAS_DIMENSION / rawWidth, MAX_CANVAS_DIMENSION / rawHeight,
            Math.sqrt(MAX_CANVAS_AREA / (rawWidth * rawHeight)));
          canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.floor(rawWidth * outputScale));
          canvas.height = Math.max(1, Math.floor(rawHeight * outputScale));
          context = canvas.getContext("2d", { alpha:false });
          if (!context) throw new Error("CANVAS");
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        const destinationY = Math.round(position.scrollY * pixelRatio * outputScale);
        const destinationHeight = Math.min(Math.round(image.height * outputScale), canvas.height - destinationY);
        if (destinationHeight > 0) context.drawImage(image, 0, 0, image.width,
          Math.min(image.height, Math.ceil(destinationHeight / outputScale)), 0, destinationY, canvas.width, destinationHeight);
      }
      const blob = await canvasBlob(canvas);
      const filename = `bili-retro-screenshot-${stamp}.png`;
      return {
        blob,
        metadata: {
          status:"complete", filename, cssWidth:dimensions.pageWidth, cssHeight:dimensions.pageHeight,
          pixelWidth:canvas.width, pixelHeight:canvas.height, devicePixelRatio:dimensions.devicePixelRatio,
          capturePixelRatio:pixelRatio, scale:outputScale, segmentCount:positions.length,
          sha256:await sha256Blob(blob), error:""
        }
      };
    } finally {
      if (prepared) await screenshotMessage({ action:"restore", sessionId }).catch(() => {});
    }
  };

  const diagnosticBase = () => ({
    reportVersion:2,
    exportedAt:new Date().toISOString(),
    userDescription:feedbackText.value.trim(),
    snapshot:latestSnapshot
  });

  const reportText = (report) => {
    const snapshot = report.snapshot || {};
    const lines = [
      "bili-retro 诊断报告",
      `导出时间: ${report.exportedAt}`,
      `用户描述: ${report.userDescription || "未填写"}`,
      `扩展版本: ${snapshot.extension ? `${snapshot.extension.version} / ${snapshot.extension.build}` : "未连接"}`,
      `页面: ${snapshot.page ? snapshot.page.url : "未连接"}`,
      `登录态: ${snapshot.states ? snapshot.states["data-extension-b-auth-state"] || "unknown" : "unknown"}`,
      `环境: ${snapshot.environment ? `${snapshot.environment.viewportWidth}x${snapshot.environment.viewportHeight} DPR ${snapshot.environment.devicePixelRatio}` : "--"}`,
      "",
      "接口请求:"
    ];
    for (const operation of snapshot.operations || []) lines.push(`- ${operationLabel(operation.operation)}: ${operation.status}, ${formatDuration(operation.durationMs)}, ${operation.errorKind || "-"}`);
    lines.push("", "页面状态:");
    for (const [name, value] of Object.entries(snapshot.states || {}).sort()) lines.push(`- ${name}: ${value}`);
    lines.push("", "错误日志:");
    if (!(snapshot.errors || []).length) lines.push("- 无");
    for (const error of snapshot.errors || []) lines.push(`- ${new Date(error.timestamp).toISOString()} ${operationLabel(error.operation)} ${error.status}/${error.errorKind} ${formatDuration(error.durationMs)}`);
    return `${lines.join("\n")}\n`;
  };

  const exportBundle = async () => {
    if (exportInProgress) return;
    if (!latestSnapshot) await refresh();
    if (!latestSnapshot) { exportStatus.textContent = "当前标签没有可导出的诊断数据"; return; }
    exportInProgress = true;
    byId("exportBundleButton").disabled = true;
    exportStatus.textContent = "正在生成诊断包";
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    try {
      const screenshot = await captureFullPageScreenshot(stamp);
      const report = { ...diagnosticBase(), screenshotIncluded:Boolean(screenshot), screenshot:screenshot ? screenshot.metadata : null };
      downloadBlob(`bili-retro-diagnostics-${stamp}.json`, "application/json", JSON.stringify(report, null, 2));
      if (screenshot) downloadBlob(screenshot.metadata.filename, "image/png", screenshot.blob);
      exportStatus.textContent = "诊断包已导出";
    } catch (error) {
      const report = { ...diagnosticBase(), screenshotIncluded:includeScreenshot.checked, screenshot:{ status:"failed", filename:"", error:error && error.message ? error.message : "CAPTURE" } };
      downloadBlob(`bili-retro-diagnostics-${stamp}.json`, "application/json", JSON.stringify(report, null, 2));
      exportStatus.textContent = "诊断包导出失败";
    } finally {
      exportInProgress = false;
      byId("exportBundleButton").disabled = false;
    }
  };

  const exportReport = async () => {
    if (!latestSnapshot) await refresh();
    if (!latestSnapshot) { exportStatus.textContent = "当前标签没有可导出的诊断数据"; return; }
    const report = diagnosticBase();
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadBlob(`bili-retro-report-${stamp}.txt`, "text/plain;charset=utf-8", reportText(report));
    exportStatus.textContent = "文本报告已导出";
  };

  for (const button of document.querySelectorAll("[data-view]")) {
    button.addEventListener("click", () => {
      for (const candidate of document.querySelectorAll("[data-view]")) candidate.classList.toggle("active", candidate === button);
      for (const view of document.querySelectorAll(".view")) view.classList.toggle("active", view.id === `${button.dataset.view}View`);
    });
  }
  byId("refreshButton").addEventListener("click", refresh);
  byId("exportBundleButton").addEventListener("click", exportBundle);
  byId("exportReportButton").addEventListener("click", exportReport);
  bannerSource.addEventListener("change", () => {
    const current = bannerSnapshot.settings || {};
    setBannerSettings({ source:bannerSource.value, packageId:bannerSource.value === "imported" ? current.packageId : null, rotation:bannerRotation.value });
  });
  bannerRotation.addEventListener("change", () => {
    const current = bannerSnapshot.settings || {};
    setBannerSettings({ source:current.source || bannerSource.value, packageId:current.source === "imported" ? current.packageId : null, rotation:bannerRotation.value });
  });
  bannerImport.addEventListener("change", importBannerPackage);
  bannerRefreshButton.addEventListener("click", async () => {
    bannerStatus.textContent = "正在刷新官方 Banner";
    const saved = await sendExtensionMessage({ type:"BANNER_SETTINGS_SET_V1", settings:{ source:"official", packageId:null, rotation:bannerRotation.value } });
    if (!saved || saved.ok !== true) { bannerStatus.textContent = "设置保存失败，当前 Banner 未改变"; return; }
    const applied = await sendActiveBannerMessage("BANNER_REFRESH_OFFICIAL_V1");
    bannerStatus.textContent = applied ? "官方 Banner 已刷新" : "官方 Banner 刷新失败，首页保留当前内容";
    await refreshBannerPanel();
  });
  document.addEventListener("visibilitychange", () => {
    window.clearInterval(pollTimer);
    if (!document.hidden) {
      refresh();
      pollTimer = window.setInterval(refresh, POLL_INTERVAL_MS);
    }
  });
  refresh();
  refreshBannerPanel();
  pollTimer = window.setInterval(refresh, POLL_INTERVAL_MS);
})();
