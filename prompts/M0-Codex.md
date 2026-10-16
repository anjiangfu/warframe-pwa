# 第一轮给 Codex 的实施指令（M0，必须止步于此）

请把当前目录的文档作为项目约束，优先阅读 `AGENTS.md`、`docs/PRD_v2_Architecture.md`、`docs/Code_Review_Tech_Tree.md`、`reference/Original_Tech_Tree.html`、`data/tech-tree-seed.json`。

**本次只实现 M0**：新建 `app/` 中的离线优先 PWA。不得顺便实现集团素材库、实时活动、自动登录等后续功能。设计应能兼容这些功能。

技术栈：Vite + React + TypeScript + Dexie(IndexedDB)，Vitest；可选原生 CSS 或 Tailwind。用已有科技树作为主要交互和UI风格参考；组件必须可响应式，Android 与 Windows 可用，中文显示。

必做：
1. 账号档案可编辑（MR、每天游戏时间、主要战甲、目标段位），以MR12预填但可改；`未知` 不自动写为0。
2. `tech-tree-seed.json` 导入为可扩展的科技树基础数据：id、category、UI布局、硬前置、建议前置区分；当前所有旧 `deps` 默认作为**建议关系**，不据此锁死游戏进度。
3. 科技树移动缩放、节点详情与状态、笔记、新增自定义节点（最少支持新增普通节点），编辑后刷新不丢。
4. IndexedDB 存储；版本化迁移框架。支持将用户旧版 `TENNO_*.json` 科技树导入**预览并确认**，映射 rank/statuses/steps/notes/stock/events；支持新格式 JSON 导出、导入，显示差异/冲突警告。禁止无提示覆盖。
5. manifest、service worker、离线应用壳缓存、升级提示；本地 localhost 与 HTTPS 的安装说明。外部数据缺网显示同步时间，不可以误报实时。
6. 至少 5 个单测：旧版迁移、节点后新增仍保留旧进度、普通存档刷新、JSON损坏拒绝导入、硬前置与建议顺序区分。增加 build/lint/test 脚本。README 有 Windows `npm install` / `npm run dev` / `npm test` / `npm run build` 和安卓同局域网访问的说明。
7. Git commit，提供文件清单、实际通过的命令、局限、需要人工在手机测试的步骤。

安全与来源：不调用任何付费在线模型；不索取Warframe/Steam密码，不读取游戏内存；不自动克隆未知许可证的Tenno Hub源码；第三方包许可证按规定保留。发现任何缺失工具或网络问题时先报告具体原因，不伪报测试成功。

验收标准：1) Windows 浏览器刷新后数据不丢，2) 断网后已经打开过的PWA仍可访问，3) 导出JSON→删除应用数据→导入JSON之后记录恢复，4) 旧29节点状态笔记能导入并保留，5) 安卓界面可点、缩放与查看节点。

完成上述内容并测试后停止，不自行开启 M1–M4。
