# M0 验收记录

结论：**M0 实现完成、实机验收未完成。** 2026-10-17备份约束和更新中断修复见第8节（24项数据测试、13项Chrome测试）；最新的第1轮测试夹具修正及5次零重试重复结果见第9节。第1—7节保留2026-10-16初次交付记录；初次证据原字节保留在Git提交cda0b32中，第9节本轮证据另存归档。Android真机、可信HTTPS安装、Windows系统级安装仍尚未验收，模拟视口不算真机证据。

## 1. 范围和Git检查点

目录 `D:\wf\Warframe_PWA_Handoff_20261016`。基线 main / `08fda3880f0cdd796f3b1c9e3d84032083aa0091`，核对初始状态后建立 `m0/local-planner`。保留既有历史，没有推送、合并main、公开部署或调用第三方AI agent。

| 检查点 | 提交 | 完成内容及当时验证 |
|---|---|---|
| 1 架构与契约 | `cb85be6` | 先修订计划、Provider/版本/ID/保护契约、87步骤映射、输入hash和完整验收矩阵，核对diff。 |
| 2 数据与恢复 | `2dcfca4` | 工程、LocalProvider、IndexedDB事务/revision/快照、预览/原件/新档与整档恢复。13项测试通过，lint/typecheck/build退出0。首次11通过2失败，修正目录测试输入和旧应用拒绝新版数据库逻辑后重跑通过。 |
| 3 中文界面 | `4c16086` | 档案/库存/预算、原树、搜索/路线/小地图、触控、自定义节点。3项Chrome生产测试通过，包括浏览器关闭重开、实际下载再导入和HTML文本安全；360/412截图仅为模拟。 |
| 4 PWA | `8903526` | 自有manifest/图标/SW、离线壳、多页更新协议。16项数据测试和8项Chrome测试通过，lint/typecheck/build退出0；另通过子路径离线测试。 |
| 5 最终交付 | `cda0b32f0d4af0913b3cb4fab7f4c7164e86ae6d` | 加强全量迁移逐值断言，初次交付16项数据测试和8项Chrome测试通过，lint/typecheck/build退出0；提交说明、许可、命令日志、资源/hash对照和本记录。 |

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

## 8. M0修复与补充验收（2026-10-17）

本次从 `m0/local-planner` / `cda0b32f0d4af0913b3cb4fab7f4c7164e86ae6d` 的干净工作区开始。仅修复M0，不修改原HTML、seed、交接资料、M-1报告或M0计划；不新增依赖，不推送、合并或公开部署。单独本地修复提交的hash见交付回复（提交无法在自身文件中嵌入自身hash）。

### 原因和修复契约

旧版validateProfile只限制单字段/结构，不检查整档字节数；exportBackup直接序列化，因此29×100000中文字笔记可导出约8.7MB但被8MiB导入门槛拒绝。旧parseImport又从备份外层计算深度及遍历计数，同一profile被多计一层/多个包装值；legacyArchive.field的18层child在存储时有效，回导时超限。这两类问题均先添加失败测试复现，原6项边界测试全部失败后才修改实现。

现在保存、导出和导入共用BACKUP_LIMITS：

- 新格式文件8 MiB，旧格式文件2 MiB；完整备份使用紧凑JSON，旧的缩进备份只要仍在限制内也能导入，schemaVersion保持1。
- 业务负载为移除id/revision后的整个profile紧凑JSON，包含全部笔记、日志、未知字段、自定义节点、库存/预算及原件；UTF-8上限8,386,560字节。预留2 KiB给最多100字符的id/catalogVersion、安全整数revision和备份头，跨目标恢复不会仅因UUID变化越界。控制字符全部需要转义的100字符元数据也通过边界测试。
- 深度20（profile根深度0）、遍历值总数50,000，都按profile本身计算；备份包装元数据另检，不再重复占用档案限制。普通文本100,000、base64 3,000,000个UTF-16代码单元；非JSON值明确拒绝，避免序列化静默丢字段。
- create/save/restore在提交前校验同一约束，save/restore在生成最终id/revision后再次校验；失败不写入。exportBackup检查业务和最终文件容量，界面捕获失败、明确显示“备份未生成”，不触发下载、不裁剪数据。旧版已有超限档案保留原状态，也不能假报已生成备份。

更新中断问题也已复现：旧版刷新后取消按钮丢失；持久写屏障建立后停止worker并重载也无取消入口。现在候选版本Cache Storage记录不含个人资料的会话token，worker消息串行处理；新页面可重新加入、重新排空写入并确认，不继承旧页面ACK。其他页面/重新打开的页面可以取消；取消按token解除meta屏障，迟到ACK/屏障写入不会重新建立已取消的保护。没有waiting worker的孤立屏障也提供明确取消入口，经active worker回应后解除，不以超时自动放开写入。SW激活后清理会话日志，仍不删除IndexedDB。

### 新增回归和实际结果

原U01—U10的16项全部保留；新增8项数据测试，共24项。源文件 `app/src/test/backup-boundaries.test.ts`；每个有效边界均实际运行导出→解析导入→Repository事务恢复到不同档案，并比较除目标id/revision外的完整业务字段。

| 新增数据场景 | 实际结果 |
|---|---|
| 29节点各100000个中文字 | validateProfile和导出均明确拒绝超限，不截断原笔记；浏览器另验证已有超限文档不下载且全部29笔记仍完整。 |
| 业务负载恰好8,386,560字节／再加1字节 | 边界保存、实际导出/导入/恢复成功；+1时保存/导出/导入均拒绝，DB旧状态逐项保持。 |
| 18层child归档（profile深度20）／再深1层 | 边界无损恢复，超限一致拒绝；不将包装层计入profile。 |
| 遍历值恰好50,000／再加1项 | 边界实际往返成功，超限拒绝。 |
| 旧档18层child迁移 | 中文笔记、原日志时间、未知字段、原件字节均保留，迁移后的新备份可恢复。 |
| 旧档文件恰好2 MiB／再加1字节 | 边界迁移、保留原字节、完整备份往返成功；+1拒绝。 |
| 非JSON归档值undefined | 保存/导出拒绝，不能静默丢字段。 |
| 有效新备份文件恰好8 MiB／再加1字节 | 有效JSON补空白至文件边界仍可导入和恢复；+1明确拒绝。 |

Chrome生产测试从8项扩为13项，全部通过；新增5项：

| 场景 | 实际操作、结果和证据 |
|---|---|
| 已有超限档案导出 | 专用Chrome测试库中构造29×100000中文字，实际点击导出，提示未生成，下载数0；直接读取原库确认每条笔记未变。[记录](evidence/M0_Fix_Backup_Failure.json)、[截图](evidence/M0_Fix_Backup_Failure.png)。 |
| 深度边界真实文件往返 | 界面导入18层旧档→确认→真实下载新备份→选择下载文件→预览/恢复新档→重载；未知字段、原件字节、原日志时间保持。[记录](evidence/M0_Fix_Depth_Restore.json)。 |
| 排空阶段刷新/关闭发起页 | 另一页保留未提交草稿阻止激活；发起页刷新仍有取消入口，再关闭发起页，由另一页取消并保存；重新打开页面可写MR、读取数据。[记录](evidence/M0_Fix_Update_Refresh.json)、[重开截图](evidence/M0_Fix_Update_Reopen.png)。 |
| 屏障阶段worker停止/刷新/关闭发起页 | 测试故意延迟BARRIER_READY，确认meta屏障实际存在；CDP停止worker，刷新发起页，再关闭、重新打开，由新页取消。其他受控页同步解锁，MR可保存且重载保持。[记录](evidence/M0_Fix_Update_Barrier.json)。 |
| 没有waiting worker的孤立屏障 | 注入专用中断状态，重载后先确认界面锁定，明确取消后写MR18，重载仍为18。[记录](evidence/M0_Fix_Update_Orphan.json)。 |

屏障阶段测试保留真正受旧SW控制的应用页，并跨刷新延迟ACK；如果所有旧受控页关闭，Chrome合法自动激活新SW，此时取消按钮消失不代表写保护遗留。测试没有把该正常行为当作故障。研发中还修正了worker的Response全局声明及大原件逐元素断言耗时（改为Buffer逐字节比对），最终不存在未通过的本次自动化项。

### 最终命令和交付状态

本轮从app执行，设置 `M0_EVIDENCE_PREFIX=M0_Fix`，调用 `node scripts/run-quality.mjs`；实跑命令及UTC起止时间/stdout/stderr完整保存在 [M0_Fix_Commands.json](evidence/M0_Fix_Commands.json)，首次M0_Commands.json不覆盖。

| 实跑命令 | 退出码 | 实际结果 |
|---|---|---|
| npm.cmd run lint | 0 | ESLint通过 |
| npm.cmd test | 0 | 非watch，2文件24/24通过 |
| npm.cmd run typecheck | 0 | TypeScript通过 |
| npm.cmd run build | 0 | 生产构建通过，28模块 |
| npm.cmd run test:browser -- --reporter=line | 0 | Windows本机headless Chrome，13/13通过（34.2秒），含原持久化/离线/更新/恢复 |
| npm.cmd run build（浏览器测试后） | 0 | 恢复普通内容hash构建，非测试专用覆盖ID |
| node scripts/verify-delivery.mjs | 0 | 原M0的16个保护输入hash及7/29/87/30映射、manifest/图标/资源检查通过 |

最终build为 `m0-aef31a53e917`，资源原始合计417,205字节；[资源清单](evidence/M0_Fix_Build.json)。相对本次修复前cda0b32，包含已修订M0计划在内的17个基线资料全部原字节不变，独立hash核对退出0：[17项保护输入对照](evidence/M0_Fix_Protected_Inputs.json)。没有新增依赖或更改许可正文。

此次仅Windows本机生产构建自动化，不改变第6节的设备待验结论：**M0实现完成、实机验收未完成**。Android真机、可信HTTPS安装/软键盘、Windows OS级安装仍未测试。完成独立本地修复提交后停止，不进入M1—M4。

## 9. 第1轮M0测试可靠性修正（2026-10-17）

基线：`f56bfdca6aabc51307edf2ec41fe7fd28b5b1fa5`，工作区初始干净，继续使用 `m0/local-planner`。本轮仅修改 `app/e2e/backup-boundaries.spec.ts` 的超限档案测试夹具和相关验收记录；应用运行代码、SW、数据约束和依赖均未修改，不进入M1—M4。独立本地提交hash见交付回复。

原夹具通过原生IndexedDB直接注入超限笔记后，只做 `page.goto('/#backup')`。该操作可能是同文档hash导航，React仍持有旧档案；原来在初次创建尚未完全结束时注入，又会偶然被创建流程的刷新加载，从而产生不可靠的通过结果。

先等待初始创建完成、给注入档案设置唯一名称，并在hash导航后断言所选档案名称，实际失败：期望“已注入超限笔记的专用档案”，收到“我的行动档案”。[红灯复现日志](evidence/M0_Repair_R1_Red.json)退出1，证明测试的页面状态与DB注入状态不同，并非产品容量保护失效。两次Windows嵌套引号导致未匹配测试的调用错误也另存为M0_Repair_R1_Invocation_Error*.json，不计为产品测试结果。

修正后流程：

1. 等待模板档案确实创建完成，再在专用测试数据库的事务中注入唯一名称和29条100000字中文笔记。
2. 显式 `page.reload()`，等待“本地档案就绪”，断言页面选中的档案就是注入名称。
3. 实际打开托里德节点，读取界面“个人笔记”的值，逐字比较为100000个“字”，证明React确已加载注入后的笔记，而不只是从DB复查数据。
4. 通过界面导航进入备份页，再点击导出；保留原断言：提示“备份未生成”、下载数0、原库29条笔记逐项完整。没有放宽断言、固定等待或自动重试，也没有修改产品读取逻辑来迎合测试。

### 本轮实际验证

[完整新日志](evidence/M0_Repair_R1_Commands.json)保留命令、退出码、UTC起止时间和stdout/stderr。用例重复执行与测试失败后的重试不同：这里是5次独立重复，均设 `--retries=0`。

| 命令 | 退出码 | 结果 |
|---|---|---|
| npm.cmd run lint | 0 | 通过 |
| npm.cmd run typecheck | 0 | 通过 |
| npm.cmd run test:browser -- --grep existing --repeat-each=5 --retries=0 --reporter=line | 0 | 连续5/5通过，11.3秒，零重试 |
| npm.cmd run test:browser -- --retries=0 --reporter=line | 0 | 完整13/13通过，34.3秒，零重试 |
| npm.cmd run build | 0 | 浏览器测试后恢复正常生产构建，28模块；运行构建仍为m0-aef31a53e917 |

本轮没有更改应用运行代码或数据单测，未将此前24项单测结果冒充本轮重跑；其记录仍见第8节。新的导出失败[截图](evidence/M0_Repair_R1_Backup_Failure.png)及[元数据](evidence/M0_Repair_R1_Backup_Failure.json)增加pageReloaded/injectedProfileMarkerVisible/injectedNoteVisible断言证据。

完整浏览器测试会生成原有命名的公共截图/元数据，因此执行前保存旧证据字节，结束后把本轮变化的8项另存于 [M0_Repair_R1_Browser](evidence/M0_Repair_R1_Browser)，再恢复旧证据原字节；[保存记录](evidence/M0_Repair_R1_Preserved_Evidence.json)。没有覆盖第8节的日志和证据。仅操作专用Chrome上下文和测试档案，未清理真实用户数据。

本轮直接在原执行目录运行，持久Chrome测试档案使用 `app/.test-browser/<随机ID>` 及 `manifest-<随机ID>`。隔离复跑应使用简短的专用profile路径并记录路径前缀；长路径隔离副本的SW就绪差异不据此当作产品缺陷，也不据此修改SW、放宽超时或更改浏览器安全配置。本轮原目录环境完整通过。

17项保护输入相对本轮开始保持原字节，见 [hash对照](evidence/M0_Repair_R1_Protected_Inputs.json)。不推送、不合并main、不公开部署、不请求或实施M1—M4。Android真机及既有安装待验项维持原状态；本轮只完成M0测试可靠性返修，提交后停止。
