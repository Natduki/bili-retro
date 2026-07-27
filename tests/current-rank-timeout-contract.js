const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bridgeSource = fs.readFileSync(path.join(root, "page-bridge.js"), "utf8");
const contentSource = fs.readFileSync(path.join(root, "content.js"), "utf8");

assert.match(bridgeSource, /const RANKING_REQUEST_TIMEOUT_MS = 12000;/);
assert.match(bridgeSource, /const RANKING_SESSION_TIMEOUT_MS = 4500;/);
assert.match(bridgeSource, /const RANKING_SESSION_RETRY_DELAY_MS = 600;/);
assert.match(bridgeSource, /const RANKING_REQUEST_GAP_MS = 180;/);
assert.match(bridgeSource, /const RANKING_REFERRER = "https:\/\/www\.bilibili\.com\/v\/popular\/rank\/douga";/);
assert.match(bridgeSource, /const ensureRankingSession = async \(\) =>/);
assert.match(bridgeSource, /fetchRankingTicketFixed\(ticketRoute,sessionController\.signal\)/);
assert.match(bridgeSource, /fetchFixed\(RANKING_NAV_ROUTE,sessionController\.signal\)/);
assert.match(bridgeSource, /navWbi\.img_url/);
assert.match(bridgeSource, /navWbi\.sub_url/);
assert.doesNotMatch(bridgeSource, /ensureRankingSession\(signal\)/);
assert.match(bridgeSource, /request\.includeRank === true\s*\? RANKING_REQUEST_TIMEOUT_MS\s*:\s*REQUEST_TIMEOUT_MS/);
assert.match(bridgeSource, /let rankingRequestTail = Promise\.resolve\(\);/);
assert.match(bridgeSource, /const setRankingTicketCookie =/);
assert.doesNotMatch(bridgeSource, /setRankingCookie\("buvid/);
assert.match(bridgeSource, /const useAuthenticatedNavKeys = navRaw && navRaw\.code === 0 && navRaw\.data\.isLogin === true/);
assert.match(bridgeSource, /const sessionImgKey = useAuthenticatedNavKeys \? navImgKey : imgKey/);
assert.match(bridgeSource, /const sessionSubKey = useAuthenticatedNavKeys \? navSubKey : subKey/);
assert.match(bridgeSource, /raw\.code !== 0[^\n]+!Array\.isArray\(raw\.data\.list\)/);
assert.match(bridgeSource, /referrer: RANKING_REFERRER/);
assert.match(bridgeSource, /referrerPolicy: "unsafe-url"/);
assert.match(bridgeSource, /const fetchRankingFixed[\s\S]*credentials: "include"/);
assert.match(bridgeSource, /const fetchRankingTicketFixed[\s\S]*credentials: "omit"/);
assert.match(contentSource, /await retryWorker\(\);/);
assert.match(contentSource, /requestOrdinaryZoneFloor\(currentLifecycle, type, true, false\)\.then/);
assert.match(contentSource, /requestOrdinaryZoneFloor\(currentLifecycle, type, false, true\)/);

assert.match(contentSource, /const BRIDGE_RANKING_TIMEOUT_MS = 12500;/);
assert.match(contentSource, /includeRank === true\s*\? BRIDGE_RANKING_TIMEOUT_MS\s*:\s*BRIDGE_TIMEOUT_MS/);
assert.match(contentSource, /data-extension-b-douga-rank-state/);
assert.match(contentSource, /data-extension-b-zone-\$\{type\}-rank-state/);

console.log("CURRENT_RANK_TIMEOUT_CONTRACT=PASS");
