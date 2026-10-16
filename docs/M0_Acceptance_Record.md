# M0 验收记录

结论：**M0 实现完成、实机验收未完成。** 2026-10-16，Windows本机生产构建的数据和Chrome自动化验收通过；Android真机、可信HTTPS安装、Windows系统级安装尚未验收。模拟视口不算Android真机证据。

## 1. 范围和Git检查点

目录 `D:\wf\Warframe_PWA_Handoff_20261016`。基线 main / `08fda3880f0cdd796f3b1c9e3d84032083aa0091`，核对初始状态后建立 `m0/local-planner`。保留既有历史，没有推送、合并main、公开部署或调用第三方AI agent。

| 检查点 | 提交 | 完成内容及当时验证 |
|---|---|---|
| 1 架构与契约 | `cb85be6` | 先修订计划、Provider/版本/ID/保护契约、87步骤映射、输入hash和完整验收矩阵，核对diff。 |
| 2 数据与恢复 | `2dcfca4` | 工程、LocalProvider、IndexedDB事务/revision/快照、预览/原件/新档与整档恢复。13项测试通过，lint/typecheck/build退出0。首次11通过2失败，修正目录测试输入和旧应用拒绝新版数据库逻辑后重跑通过。 |
| 3 中文界面 | `4c16086` | 档案/库存/预算、原树、搜索/路线/小地图、触控、自定义节点。3项Chrome生产测试通过，包括浏览器关闭重开、实际下载再导入和HTML文本安全；360/412截图仅为模拟。 |
| 4 PWA | `8903526` | 自有manifest/图标/SW、离线壳、多页更新协议。16项数据测试和8项Chrome测试通过，lint/typecheck/build退出0；另通过子路径离线测试。 |
| 5 最终交付 | 本文件所属提交，hash见最终回复或 `git log -1` | 加强全量迁移逐值断言，最终16项数据测试和8项Chrome测试通过，lint/typecheck/build退出0；提交说明、许可、命令日志、资源/hash对照和本记录。 |

每次提交前检查diff和空白错误。最终全量 `git diff --cached --check` 仅报告第三方原许可归档自带的上游尾空白，保留正文不改写；排除 `app/licenses/THIRD_PARTY_LICENSES.txt` 后退出0。最终提交hash不能写进自身受跟踪内容，故由最终回复记录。16个受保护输入原字节不变；唯一获准改动的原文件是M0实施计划。

## 2. 已实现和范围边界

- 中文账号MR/目标MR/每日时间/主要战甲、隔离的多档案、手工库存/目标预算、行动日志；unknown与0分开，节点完成不改账号MR。
- 原7路线/29节点/特殊origin保留ID，87步骤冻结映射，30条关系全为推荐。状态、步骤、笔记、搜索、定位/折叠、小地图、拖拽/滚轮/双指缩放和普通自定义节点可用。
- 实际使用DataProvider/LocalProvider及版本化静态catalog；个人数据在profiles/snapshots/imports/meta四表，一个profile文档聚合业务状态，不为视图重复保存目标状态。未来联网仅类型边界及“尚未同步”，无远程请求/第三方响应耦合。
- DB version=1（Dexie对应原生版本10）、backup schemaVersion=1、catalogVersion=`2026.10.16.1`、内容hash build ID独立。来源类别与核验状态独立，原树资料unverified；硬条件仅合成数据测试。
- 导入：读取校验→预览→选择目标/方式→确认→事务备份提交。默认新建，取消不写；整档恢复、无字段合并。未知字段/引用在legacyArchive保留；原件字节以base64无损保留并附SHA-256，可重新下载。缺状态todo，六个默认done仅明确首次模板初始化使用。
- revision冲突要求重新预览，同目标确认幂等，同一备份可恢复不同档案。快照失败中止事务；旧应用遇新版DB停写，不删库/降级。versionchange/blocked有提示，未来升级先取得可读取的一致快照。
- 生产PWA缓存应用壳/小型目录；更新先等待写入、检查草稿、建立持久写屏障，所有页面协调后激活。无响应旧页阻止更新，可取消/关闭后继续；仅清本应用旧Cache Storage，不清IndexedDB。

没有M1集团/配方/天数计算或联动，没有M2—M4推荐、百科、活动、通知、登录、自动账号读取、云同步、在线AI或遥测；未迁入旧generateDaily。未复制Tenno Hub实现、加工数据、测试或素材，未运行其更新脚本。

## 3. U01—U10完整结果

Vitest + fake-indexeddb共16项，源文件 `app/src/test/data.test.ts`。模拟数据库结果不当作物理设备证据。

| 编号 | 结果 | 实际断言和补充证据 |
|---|---|---|
| U01 | 通过 | 29节点状态、87个stable stepId对应值、29节点中文笔记/预算、库存显式0、原日志时间及顺序、未知字段、原件字节逐项比较；缺状态todo，未知库存null，未知节点笔记/旧步骤保留。 |
| U02 | 通过 | 预览/取消无DB变化；重复确认不新增记录；同备份可以恢复另一档案。 |
| U03 | 通过 | 目录文案/顺序变化、新增/移除节点后，DB旧文档完整不变，失去引用状态仍在；Provider目录不可变。 |
| U04 | 通过 | DB连接关闭重开，中文/0/unknown保留、多档隔离；另有真实Chrome进程关闭后按同一专用profile重启恢复。 |
| U05 | 通过 | 损坏、超限、未来版本、seed目录、非法数值、危险对象键和原件hash损坏拒绝；内嵌原件导致大于2MiB的新备份也可完整恢复。 |
| U06 | 通过 | 满足/未满足/未知三态，30推荐关系不锁完成；Chrome完成MR14目标后账号MR仍12。 |
| U07 | 通过 | revision冲突要求重新预览；快照QuotaExceededError后原状态不变；更新写屏障拒写。真实Chrome注入配额失败后无假成功、旧MR不变。 |
| U08 | 通过 | 导出→解析→事务恢复至新目标，除目标id/revision外业务文档全等，含自定义节点/步骤/状态/笔记/预算、库存/日志/归档/原件；Chrome实际下载再导入验证。 |
| U09 | 通过（合成升级） | DB2快照失败回滚，旧库可读；成功快照可读，旧应用拒绝新版DB；原生连接阻塞、versionchange停写。生产库仍DB1，不把合成测试说成用户库升级。 |
| U10 | 通过 | 自定义ID冲突拒绝；中文HTML/script笔记按普通文字显示，Chrome脚本未执行。 |

追加：来源类别/verification独立、LocalProvider实际使用、同页保存库存不丢账号草稿、多页冲突保留未提交内容、模拟双指不误触节点、观测页面请求无第三方域名。只操作随机测试DB及专用Chrome数据，不清用户真实资料。

## 4. Windows生产操作和设备矩阵

环境：`Microsoft Windows NT 10.0.26300.0`，Node `v24.21.0`、npm `11.19.0`，Chrome `155.0.8059.80`。Playwright驱动本机headless Chrome；持久化和安装条件使用正常隔离profile，非隐身模式。截图为真实渲染，不是设计稿。

| 场景 | 结果和操作 | 证据 |
|---|---|---|
| Windows编辑/持久化 | 通过。模板→MR独立完成→中文笔记→MR/库存→自定义节点→下载再导入；独立测试关闭Chrome进程，按同一专用profile重启恢复档案名称。 | [元数据](evidence/M0_Browser.json)、[科技树](evidence/M0_Windows_Tree.png)、[重开](evidence/M0_Windows_Reopen.png)、`app/e2e/ui.spec.ts` |
| 导出/恢复 | 通过。实际下载并选择下载文件预览、默认新建、确认、重载；全量业务相等由U08补充，取消/冲突/失败由U02/U07验证。 | `ui.spec.ts`、`data.test.ts`、[命令日志](evidence/M0_Commands.json) |
| 生产离线/深链接 | 通过。在线等SW控制、保存名称，浏览器置offline、关页面、新开 `/#profile`恢复，再访问树/备份。独立 `/tenno/` base也验证断网新页及档案保持。 | [离线备份页](evidence/M0_Offline_Backup.png)、[子路径](evidence/M0_Subpath.json)、`pwa.spec.ts`、`scripts/subpath-smoke.mjs` |
| v1→v2/多页 | 通过。暂缓仍v1；另一页未提交表单阻止激活，取消解锁；保存后重试，无响应旧图片页仍阻止切换，关闭后两页v2，MR及待保存笔记保持，仅旧壳缓存清除。 | [更新记录](evidence/M0_Update.json)、[更新截图](evidence/M0_Updated_v2.png)、`zz-update.spec.ts` |
| 保存失败/冲突 | 通过。跨页草稿保留及提示，同页库存保存不丢另一表单草稿；注入配额失败显示未保存，旧MR仍在。 | [失败截图](evidence/M0_Save_Failure.png)、`safety.spec.ts` |
| manifest/安装条件 | 静态及Chrome检查通过：192/512图标尺寸、base/start_url/scope一致，安装错误列表为空。Windows OS级安装及独立窗口启动未执行。 | [manifest/启动](evidence/M0_Startup.json)、[构建](evidence/M0_Build.json) |
| Android布局补充 | 桌面模拟通过：360/412竖屏及860×412横屏无横向溢出，CDP双指改变视口、不打开节点，观测页面无外域请求。不是Android真机、软键盘或实体触控证据。 | [360](evidence/M0_Emulated_360.png)、[412](evidence/M0_Emulated_412.png)、[触控截图](evidence/M0_Emulated_Touch.png)、[触控元数据](evidence/M0_Touch.json) |

离线使用真实SW/IndexedDB，但网络断开由浏览器自动化控制。浏览器进程重启持久化、离线页面关闭重开是两项独立验证；实体设备断开Wi-Fi后关闭已安装应用再重启尚未执行。

## 5. 实跑命令、资源和许可

从app执行，以下最终命令均退出0。原始stdout/stderr及UTC起止时间见 [M0_Commands.json](evidence/M0_Commands.json)，未使用watch。

| 命令 | 退出码 | 结果 |
|---|---|---|
| `npm.cmd run lint` | 0 | ESLint通过 |
| `npm.cmd test` | 0 | 1测试文件，16/16通过 |
| `npm.cmd run typecheck` | 0 | tsc --noEmit通过 |
| `npm.cmd run build` | 0 | 类型检查及Vite生产构建，28模块 |
| `npm.cmd run test:browser -- --reporter=line` | 0 | 8/8真实Chrome测试通过 |
| `npm.cmd run build`（测试后恢复） | 0 | 恢复正常内容hash构建，不保留测试m0-v2覆盖ID |
| `node scripts/verify-delivery.mjs` | 0 | 16受保护hash、7/29/87/30映射、manifest/PNG/资源通过 |

`node scripts/subpath-smoke.mjs`曾独立退出0，生成子路径记录，结束恢复根路径。最终build ID和文件清单见 [M0_Build.json](evidence/M0_Build.json)。dist原始总量 **414,201 bytes**，JS371,692、CSS15,067、运行时许可15,432；没有全量第三方原始资料。这不是手机流量/内存/缓存占用。gzip为本机压缩估算，实际传输取决于服务器。

首屏一次观测条件：Windows headless Chrome、127.0.0.1生产预览、新隔离profile、无限速、首次欢迎页。可操作按钮耗时、DOMContentLoaded/load见启动JSON；不当作手机/弱网性能、LCP或统计分位数。

固定版本/integrity见锁文件；166个非根锁定条目许可已知。直接依赖和限制见 [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)，包内完整LICENSE/NOTICE在app/licenses，运行时正文随壳提供。图标原创，安装禁用生命周期脚本。没有未知许可第三方代码进入应用。

## 6. 未验项、限制和复现步骤

本次没有可操作Android真机或手机信任HTTPS；未公开部署/安装证书。暂无设备型号、Android版本、实体浏览器版本及真机截图，下列为**未通过验收（尚未测试）**：

1. 记录设备/系统/浏览器版本、CSS视口和DPR；以专用档案覆盖约360/412 CSS px竖屏和横屏，检查搜索、路线、小地图、详情和笔记。
2. 打开系统软键盘，检查字段及保存按钮可达；双指缩放/单指拖动不误完成，与桌面模拟分别记录。
3. 手机信任HTTPS提供生产dist，核对base/start_url/scope/图标；等待离线壳就绪、安装，断网关闭重开已安装入口及深链接，树/档案/备份与数据保持。电脑局域网普通HTTP只测布局。
4. 双页面v1→v2、暂缓/取消、未提交表单和笔记；更新后MR、原节点/步骤、自定义节点及备份保持。实际导出专用档案，预览恢复新档逐项核对。
5. Windows OS级安装及独立窗口重开待手工验证；真实浏览器跨DB schema升级待未来确有DB2迁移时执行，M0已测试快照/拒写契约。

已知限制：保存按钮/笔记失焦成功后才持久化；未提交输入离开前需保存。容量不足中止写入，不自动删除快照/档案。M0无快照管理UI，覆盖前恢复点留在DB且测试可读，用户便携恢复使用完整备份。无设备间自动同步/合并。导入限制：旧档2MiB、新备份8MiB，深度20、遍历计数50,000、普通文本100,000字符、原件base64 3,000,000字符；超限明确拒绝。

## 7. 原始输入hash对照

[开始清单](evidence/M0_Input_Hashes.json)含17个基线文件；[最终对照](evidence/M0_Hash_Comparison.json)逐文件列before/after。16受保护文件全相等，M0计划按授权修改。关键SHA-256：

| 文件 | 开始和交付hash（相同） |
|---|---|
| AGENTS.md | `6053362dafb5af9d1529a812eac8d4d5c58c7f9d7c0d9b0ee859dbaf5388059a` |
| reference/Original_Tech_Tree.html | `21e08edc277e7bf6ed9fdfca74ea96d2ed8e56c049cb422e976663c6c28c44ef` |
| data/tech-tree-seed.json | `f357c6e8f29a875d40425cdd18584bd1afe2200c8476bb8102a1d41185e75fe2` |

启动步骤见 [app/README.md](../app/README.md)。交付后停在M0工作分支，等待下一里程碑授权。
