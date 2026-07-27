(() => {
  "use strict";

  const MESSAGE_TYPE = "BILI_RETRO_DIAGNOSTICS_GET_V1";
  const POLL_INTERVAL_MS = 1500;
  const STATUS_CLASSES = Object.freeze({ healthy: "green", pending: "yellow", failed: "red", unknown: "gray" });
  const OPERATION_LABELS = Object.freeze({
    AUTH_STATUS: "登录状态", PROFILE_STATS: "用户资料", MESSAGE_SUMMARY: "消息摘要", DYNAMIC_SUMMARY: "动态摘要",
    FAVORITE_SUMMARY: "收藏摘要", HISTORY_SUMMARY: "历史摘要", LIVE_HOVER: "直播浮层",
    PRIMARY_MENU_COUNTS: "频道数量", RECOMMENDATION_FEED: "推荐视频", DOUGA_FLOOR: "动画区",
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
  let latestSnapshot = null;
  let activeTab = null;
  let pollTimer = 0;

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

  const refresh = async () => {
    try {
      activeTab = await queryActiveTab();
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

  const captureScreenshot = async () => {
    if (!includeScreenshot.checked || !activeTab || !Number.isInteger(activeTab.windowId)) return null;
    return chrome.tabs.captureVisibleTab(activeTab.windowId, { format:"png" });
  };

  const diagnosticBase = () => ({
    reportVersion:1,
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
    if (!latestSnapshot) await refresh();
    if (!latestSnapshot) { exportStatus.textContent = "当前标签没有可导出的诊断数据"; return; }
    exportStatus.textContent = "正在生成诊断包";
    try {
      const screenshot = await captureScreenshot();
      const report = { ...diagnosticBase(), screenshotIncluded:Boolean(screenshot), screenshotDataUrl:screenshot };
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlob(`bili-retro-diagnostics-${stamp}.json`, "application/json", JSON.stringify(report, null, 2));
      if (screenshot) {
        const response = await fetch(screenshot);
        downloadBlob(`bili-retro-screenshot-${stamp}.png`, "image/png", await response.blob());
      }
      exportStatus.textContent = "诊断包已导出";
    } catch {
      exportStatus.textContent = "诊断包导出失败";
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
  document.addEventListener("visibilitychange", () => {
    window.clearInterval(pollTimer);
    if (!document.hidden) {
      refresh();
      pollTimer = window.setInterval(refresh, POLL_INTERVAL_MS);
    }
  });
  refresh();
  pollTimer = window.setInterval(refresh, POLL_INTERVAL_MS);
})();
