# bili-retro

`bili-retro` 是一个 Chrome Manifest V3 扩展，用于在哔哩哔哩首页恢复旧版首页布局与交互。

当前版本：`0.2.67`

扩展只接管以下精确地址：

- `https://www.bilibili.com/`
- `https://www.bilibili.com/index.html`

其他页面不会被替换。



## 诊断控制面板

点击 Chrome 工具栏中的 `bili-retro` 图标可打开控制面板；也可以在 `chrome://extensions/` 的 bili-retro 详情中点击“扩展程序选项”以标签页打开。面板每 1.5 秒读取当前首页的脱敏快照，展示接口请求和页面模块的绿色、黄色、红色、灰色状态，以及最近一次响应时间。

面板提供：

- 最近 100 条有界错误记录。
- 可选的问题描述输入。
- JSON 诊断包和纯文本报告导出。
- 可选当前可见页面截图；截图可能包含账号画面，用户可在导出前关闭。

诊断数据不包含 Cookie、Token、WBI keys、ticket、签名 URL、请求正文或原始接口响应。截图仅在用户点击扩展图标并主动导出时捕获。

### Banner 设置

诊断面板的 `Banner` 页支持三种来源：官方自动、内置默认和本地 `.brbanner` 包。官方源使用首页当前的固定 `GET /x/web-show/page/header/v2?category=0`，读取官方 `pic`、`litpic` 和 `split_layer`，按响应实际层数渲染，不固定截断到 32 层；失败时按“最近一次成功数据 -> 内置默认”回退。官方单层资源加载失败不会混入旧内置 Banner，避免不同 Banner 拼接；本地包失效时只回退内置默认，不自动切换到官方源。palxiao 包保留每层原始尺寸和 `a/g/f/deg/opacity` 参数，按作者的视口补偿与像素位移算法渲染。

`.brbanner` 是 ZIP 容器，根目录只允许 `manifest.json`、`preview.webp` 和 `assets/` 下的 PNG/JPEG/WebP/WebM。扩展会校验路径、MIME、尺寸、SHA-256、压缩包大小、目录条目预算和 BannerModel 字段；校验失败不会改变当前 Banner。包索引和二进制资源分别保存在 `chrome.storage.local` 与 IndexedDB，不会进入扩展安装目录。

本地包支持手动选择、每次首页生命周期随机选择和按本地日期稳定选择。默认轮换为手动，导入后必须点击“应用”才会替换首页 Banner。转换器位于仓库根目录 `tools/banner-pack/convert.js`，生成的验证包放在 `release-assets/banner/`，不会作为扩展本体资源加载。

## 安装

1. 打开 `chrome://extensions/`
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择 挂载目录的`\extension-b`。
5. 修改代码后，在扩展管理页点击 `bili-retro` 的“重新加载”，再刷新 B 站首页。

本目录目前是未打包的开发版本，不需要 ZIP 或 CRX 才能本地加载。

## 已实现范围

- 旧版动态 banner、焦点轮播、推荐区和推广区。
- 旧版 mini-header、搜索、登录组件、用户中心及各类 hover 浮层。
- 主频道 `.b-wrap`、频道实时数量、频道与直播子菜单。
- 动画、直播、番剧、国创、漫画、专栏、课堂及普通视频楼层。
- 音乐、舞蹈、游戏、知识、科技、运动、汽车、生活、美食、动物圈、鬼畜、时尚、资讯、娱乐、电影、TV剧、影视和纪录片。
- 楼层换一换、更多、排行榜、稍后再看和新标签页导航。
- 右侧电梯、联系客服入口和旧版国际底栏。
- 登录态与未登录态共用同一套页面骨架，通过受控数据分支更新内容。
- `1870px`、`1654px`、`1438px` 旧版响应式断点及 125% 缩放适配。



## 数据与降级

页面先渲染本地骨架和占位资源，再提交接口数据。接口或 CDN 暂时不可用时，楼层保留骨架、last-good 或明确空态，不使用跨分区内容填充。

主要数据链包括：

- 推荐视频、焦点轮播和频道实时数量。
- 动画及普通分区视频列表。
- 当前 `ranking/v2` 视频排行榜。
- 直播推荐、在线总数、直播排行和关注主播。
- 番剧、国创、漫画、专栏、课堂及影视类数据。
- 搜索默认词、热搜、输入建议和本地搜索历史。
- 登录状态下的用户摘要、消息、动态、收藏、历史和稍后再看。

视频楼层的“换一换”先请求并提交左侧新批次，随后在后台补排行榜，避免榜单失败阻塞用户操作。专栏首屏失败或返回空数据时会自动使用同一批次补偿一次。

## 当前排行榜链

新版视频榜使用固定 `ranking/v2` 路由和 WBI 签名：

1. 并行请求当前会话 `/x/web-interface/nav` 和无账号凭据的 `GenWebTicket`。
2. 登录态使用当前会话 nav WBI keys。
3. 未登录态使用 ticket 响应 WBI keys。
4. 只写短期 `bili_ticket`，不读取、覆盖或回传 `buvid3`、`buvid4`、`b_nut`。
5. `ranking/v2` 使用固定排行榜 Referer，并通过单队列依次请求各分区。
6. 会话初始化和榜单请求各允许一次有界重试。

排行榜失败时显示“排行榜暂不可用”，不会回退到停更的旧榜，也不会把左侧推荐视频伪装成排行榜。

## 架构

- `manifest.json`：MV3 配置、权限和本地资源白名单。
- `content.js`：页面生命周期、状态分支、请求调度、generation fence 和 DOM 提交协调。
- `page-bridge.js`：MAIN world 固定操作、固定路由、上游校验和跨 world 白名单投影。
- `sw.js`：公开接口、搜索、PGC 等 extension service worker 数据通道。
- `homepage-renderer.js`：closed ShadowRoot 内的 DOM、样式和交互实现。
- `banner-model.js`：BannerModel、内置 Banner 和 `.brbanner v1` 严格校验器。
- `tools/banner-pack/convert.js`：将指定 palxiao 数据目录转换为独立 `.brbanner` 包。
- `homepage.css`：样式证据和定向测试使用的 CSS 文件；运行时主要样式由 renderer 内作用域 CSS 提供。
- `assets/homepage/`：本地 banner、图标、字体、占位图、二维码和固定浮层素材。
- `tests/`：bridge、renderer、布局、交互、安全边界和真实接口冒烟测试。

页面主体位于扩展拥有的 closed ShadowRoot 中。固定导航经过 allowlist；上游响应采用 required-subset 校验，跨 world 输出采用固定字段白名单。

## 权限与隐私

Manifest 权限：

- `storage`：保存搜索历史等扩展自身状态。
- `activeTab`：用户点击扩展图标后，可选捕获当前可见页面截图并加入本地诊断包。

Host permissions：

- `https://api.bilibili.com/*`
- `https://s.search.bilibili.com/*`
- `https://manga.bilibili.com/*`

扩展不申请 `chrome.cookies` 权限，不回传或记录 Cookie、SESSDATA、CSRF、Authorization、WBI keys、ticket 或原始账号响应。登录态请求只通过固定 operation 和固定字段投影工作。

固定图标、字体、banner、背景和占位图均从本地资产加载。视频封面、头像、直播画面及持续变化的运营内容保留接口 URL，并限制为确认过的 B 站资源域名和路径。



## 当前状态

`0.2.67` 新增 BannerModel、官方 Banner 自动接入、本地 `.brbanner` 导入、预览、应用、删除及本地包轮换。Banner 包以独立 Release asset 发布，不包含在扩展本体中。



## 参考致谢

[Bilibili-Old](https://github.com/MotooriKashin/Bilibili-Old)

[bilibili-banner](https://github.com/palxiao/bilibili-banner)

https://greasyfork.org/zh-CN/scripts/581229-b%E7%AB%99%E6%97%A7%E7%89%88%E9%A6%96%E9%A1%B5

## 联系开发者
旧版界面交流群：277574384
