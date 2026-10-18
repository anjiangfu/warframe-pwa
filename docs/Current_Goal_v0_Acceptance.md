# 通用目标助手 v0：交付与验收

2026-10-18。已复核起点`8e0f1547a2b7d1226aeba2a38d7f590c9fed05ff`，原工作区干净；本轮分支`m1b/current-goal-assistant`。用户本人在审阅聊天认可通用目标方向、补充近况并明确“继续”。本次为独立功能任务，不占M0返修次数，不授予自动循环返修。

结论：限定实现完成，Windows真实Chrome生产测试通过。Android真机/可信HTTPS安装及游戏内处决计数未验收，不能称全部实机通过。交付后停止，不扩展集团算法或其他武器。

## 实现与事实边界

- 养成助手扩展为通用目标入口，4项目标：毒囊整体养成、大嘴安装、用户原称模块安装、海波整体养成。可关注、整体完成、暂缓和恢复；完成/暂缓排除待办，重开优先显示关注中的待办。纯查询区分已完成、操作挑战、缺已知物品/材料、未知和参考用量满足，显示下一步、理由和未确认事项，不做收益排序。
- “本次进度草案”需选档案、核对模块关联并生成逐项差异；冲突默认不选。取消/仅预览不写入，确认后Repository在同一事务里检查revision、备份并读回一致旧快照，再应用所选项目和去重标记。失败原子回滚；重复确认不重复日志，同草案可用于另一档。App走现有队列、广播和更新屏障。
- 草案只提议大嘴/原称模块已安装、毒囊整体完成、海波关注IV、1999等级3、其他集团进展中。毒囊持有/进化细节、海波I—III/安装、MR、任务开放、具体声望点数不自动补写。它不是新档案默认值，没有扫描真实浏览器数据库写入。
- “原力石模块”默认保留原称、实体关联为空；用户明确确认时才关联`system:helminth-archon-shard-segment`候选（Helminth执刑官源力石升级模块），不把它当作联结模块。未关联时明确待核，不因此推断其他功能开放。
- 海波单剑（Nami Solo）I—IV全部可查看，IV直接展开：完整持握近战、40次处决、互动提示与快速挥砍区别、先试1—2次核对计数、已有圣剑/圣剑Umbra技能方案及潜行备选、普通地球E Prime歼灭建议和排查。无新增海波材料清单，不把其他武器材料套入操作挑战。
- 原毒囊材料搜索/获取/库存功能复用；个人库存唯一权威仍为stock。已安装或整体完成时折叠安装资料，不再把安装用量列为当前操作挑战需求。未知持有不算0，材料型卡点与操作型卡点用同一查询入口。
- 科技树和助手可互相查看/定位；安装事实两页读取同一personalFacts。原helminth路线含首次进入等宽泛步骤，未擅自将单项安装声明变成全部路线完成；旧29节点状态不是装备持有证明。侧栏计数仍是原路线记录。
- 1999仅手工等级/点数（未知可空、显式0保留）及其他集团“进展中，具体数据未知”。无晋升、日上限、关系、轮换和天数计算。

## 架构、兼容及版本

LocalProvider实际提供`getGoalCatalog()`，UI不直读第三方格式；目标定义、阶段、获取/来源为版本化静态目录；domain/goals.ts为纯查询与草案变换；Profile可选goalStates/personalFacts是个人声明，weaponProgress仍保存具体武器事实。旧字段缺失只读为未知，不在打开页面时写库。不引入通用插件或递归规则语言。

DB_VERSION=1、备份schemaVersion=1保持（向后兼容可选字段）；catalogVersion=`2026.10.18.1`；最终build ID=`m0-20352eefc589`，沿用构建器既有m0前缀。旧引用保留；目录更名、顺序变动不重写个人状态。新字段校验拒绝错误类型；未知ID的合法旧状态仍可完整恢复。

8 MiB完整文件、8 MiB减2 KiB业务负载、20层深度、50,000值限制不变。原29节点/87步骤、笔记、四旧库存、三材料、预算、日志顺序、未知归档、原件及毒囊已有进度保留。补强合成档案把87步骤、29中文笔记、七库存、预算、原日志、未知归档、带hash原件、既有毒囊事实和新增目标/声明放在同一份完整备份中，导出解析恢复后逐字段相等，整体完成不覆盖具体事实。

## 实跑命令与构建

执行目录app；生产浏览器专用端口4182、Chrome155.0.8059.80、Windows win32、headless、独立上下文/.test-browser测试档案。最终静态/单测日志为[Standard_Commands.json](evidence/Current_Goal_v0/Standard_Commands.json)，完整浏览器及重建见[Checked_Commands.json](evidence/Current_Goal_v0/Checked_Commands.json)，均含UTC起止、标准输出和退出码。补强组合档案只改测试夹具；构建器将src/test也计入内容hash，因此重新核对最终构建。前两次完整通过日志另存，未覆盖。

| 命令 | 退出码 | 结果 |
|---|---:|---|
| `npm.cmd run lint` | 0 | ESLint通过 |
| `npm.cmd test` | 0 | 非watch，4文件、37/37（原30+新7） |
| `npm.cmd run typecheck` | 0 | TypeScript通过 |
| `npm.cmd run build` | 0 | 35模块生产构建 |
| `npm.cmd run test:browser -- --reporter=line` | 0 | 原15+新3，18/18，45.5秒 |
| `npm.cmd run test:browser -- zz-update.spec.ts --grep v1→v2 --repeat-each=3 --reporter=line` | 0 | 更新夹具独立重复3次通过，46.2秒 |
| `npm.cmd run build` | 0 | 更新测试后恢复正常内容hash构建 |
| `node scripts/verify-delivery.mjs` | 0 | 原树ID/步骤映射、manifest/图标、原件对照通过 |

生产dist总原始大小476,127字节，主JS425,399、CSS22,054字节；[构建资源明细](evidence/Current_Goal_v0_Checked_Build.json)。缓存应用壳和小目录，不缓存外部攻略整页，无运行时第三方请求。首屏证据[M0_Startup.json](evidence/Current_Goal_v0/Release_Checked/M0_Startup.json)为本机localhost、不限速、独立新上下文，落地页交互采样见该JSON；不是手机性能保证，也不是完整攻略页面所有交互的基准。

## 验收证据

| 需求 | 实际证据与结果 |
|---|---|
| 预览/取消无写、冲突默认不覆盖、选中后显式替换 | 新浏览器读取profiles/snapshots/imports在取消前后逐项相等；[冲突预览截图](evidence/Current_Goal_v0/Release_Checked/Goals_Draft_Conflict.png) |
| revision改变拒绝草案、不误报成功 | 浏览器预览后修改1999再确认，拒绝并保持新旧状态；重新预览后选冲突再应用；[结果](evidence/Current_Goal_v0/Release_Checked/Goals_Restore.json) |
| 仅选定档案受影响、新空档不继承 | 两档浏览器比较旧档全部业务不变；新空档1999未知；单元测试同草案用于另一档且模块关联不同；同上Restore证据 |
| 事务快照、重复确认、配额/备份失败和更新屏障 | 单元测试快照/写入失败回滚及重复去重；浏览器故障注入无部分数据或成功提示；[保护记录](evidence/Current_Goal_v0/Release_Checked/Goals_Write_Protection.json) |
| 目标完成/暂缓过滤及恢复、无分项补全 | 新单元及浏览器均通过；草案后只留海波待办，IV前序状态未知，毒囊分项未注入；[桌面](evidence/Current_Goal_v0/Release_Checked/Goals_Desktop_IV.png) |
| 40处决、完整持握、有效互动、试做和未核实项 | 数据断言、真实页面显示；[IV细节截图](evidence/Current_Goal_v0/Release_Checked/Goals_IV_Detail.png) |
| 已知材料不足/未知不同，操作型无虚构材料 | 纯函数测试未知→缺物品→明确0缺20/70/80→操作阶段无材料；原三材料真实浏览器工作流继续通过 |
| 规则不依赖中文、目录升级保留状态 | 虚构目标/改名/重排目录、目标done/deferred/focused、缺失引用保留等纯函数/备份测试通过 |
| 新旧实际导出下载→预览→恢复→刷新 | 浏览器下载两份文件，恢复后原生IndexedDB读取并比较全部业务字段（新档id/revision除外）；[Restore结果](evidence/Current_Goal_v0/Release_Checked/Goals_Restore.json) |
| 关闭浏览器重开持久化 | 原Chrome真实关闭/重启独立profile测试通过；[浏览器版本和记录](evidence/Current_Goal_v0/Release_Checked/M0_Browser.json) |
| 离线新页面、默认回关注目标、手工保存/重载 | 新浏览器用例SW控制后断网关页，新开海波IV仍在，修改1999等级/显式0点数后重载保留；[离线记录](evidence/Current_Goal_v0/Release_Checked/Goals_Offline.json) |
| 更新暂缓/待保存/多标签页/中断恢复 | 原更新4项回归通过；[一般更新](evidence/Current_Goal_v0/Release_Checked/M0_Update.json)、[刷新关闭/重开取消](evidence/Current_Goal_v0/Release_Checked/M0_Fix_Update_Refresh.json)、[持久屏障](evidence/Current_Goal_v0/Release_Checked/M0_Fix_Update_Barrier.json)、[孤立屏障](evidence/Current_Goal_v0/Release_Checked/M0_Fix_Update_Orphan.json) |
| 容量/深度及旧档原件往返 | 原单测/生产浏览器边界回归全部通过；[深度](evidence/Current_Goal_v0/Release_Checked/M0_Fix_Depth_Restore.json)、[超限不下载](evidence/Current_Goal_v0/Release_Checked/M0_Repair_R1_Backup_Failure.json) |
| 360/412 CSS px布局、旧树触屏仿真 | 浏览器无横向溢出断言及截图；[360](evidence/Current_Goal_v0/Release_Checked/Goals_Mobile_360_Top.png)、[412](evidence/Current_Goal_v0/Release_Checked/Goals_Mobile_412_Top.png)、[旧触屏](evidence/Current_Goal_v0/Release_Checked/M0_Touch.json)，不是Android物理触屏 |
| 原始资料保护 | 17/17 SHA-256一致，含HTML、seed、原交接文件和M0计划；[逐项hash](evidence/Current_Goal_v0/Protected_Inputs.json) |

已逐张查看桌面全页、IV细节、草案差异、360/412顶屏。原M0/毒囊证据未覆盖，本轮所有新增证据使用Current_Goal_v0前缀。First/Second保留调试中间截图，Third为首个3项通过记录，Final为第一次完整18项通过，Delivery为关注恢复修正后的中间证据；Release保留最后定位到夹具问题的17/18记录；Release_Checked为明确无响应夹具后的最终证据。

## 失败记录与限制

最初新测试模块缺失按预期失败；目录录入两处本地来源/地点ID拼写错误被Provider拒绝，已修正。原“只一把武器”的断言因新增已授权海波改为两把，原毒囊条件/材料/兼容断言保留。浏览器初轮两处脚本问题（异步新建后过早读取旧ID、模糊详情标签）修正为等待创建和精确角色定位。初轮受限进程清理未正常结束，明确中断该轮后改为允许框架关闭自身服务的测试执行；未把中断轮算通过。

关注目标重开问题单独先复现失败：[Reopen_Regression.json](evidence/Current_Goal_v0/Reopen_Regression.json)，预期海波、实际毒囊，退出1；修正初始化选择后全部18项通过。最后Release轮更新用例曾17/18：原夹具以图片导航模拟无响应页，但SW的navigate回退会提供完整应用（源码可确定），该页可能参与协调，日志中出现提前切换。测试改为同origin隔离页在初始化时显式禁用SW消息监听，不放宽应用更新条件；更新用例重复3次通过，随后完整回归。失败日志[Release_Commands.json](evidence/Current_Goal_v0/Release_Commands.json)保留。Node测试记录器的固定命令shell调用出现DEP0190提示、Playwright出现NO_COLOR提示，均为测试环境警告，不涉及用户输入拼接；实际退出码如上。

来源详见[核验表](Current_Goal_v0_Sources.md)。不同处决类型/姿态、是否要求击杀、当前版本计数仍unverified；DE36通用机制不代表本武器挑战实测。模块原称需本人确认关联。未完成Android真机横竖屏、软键盘、真实双指、可信HTTPS安装及安装应用关闭后离线重开；未新增Windows系统安装UI操作。真机复现沿用前轮：记录设备/系统/浏览器，在可信HTTPS首次在线确认SW后保存草案及库存，安装、断网退出重开，检查海波IV、树/备份、软键盘和缩放拖拽。

## 本地提交与体验

| 提交 | 内容/验证 |
|---|---|
| `ca374353a6a18d014a4837127430515e033c71fd` | 设计、映射/冲突策略、来源核验 |
| `8caf0746aa41d7affd7185fe63619cec129c7a9b` | 目标纯查询、目录、草案事务、可选字段校验；37单测/类型检查通过 |
| `480917453e192f440a4aea4a6cfd7a70707aeced` | 通用目标/草案UI、关注恢复、树入口及浏览器测试；完整37/18及标准命令通过 |
| `81c5ab0cfbb3efb6a87e2a5ef26dea324ccc4e6d` | 补强全字段组合往返测试、显式无响应夹具；37单测及更新3次重复/完整18浏览器通过 |
| 本文件所在交付提交 | 文档/许可及独立证据；完整hash见最终回复/Git日志 |

本轮测试服务4182/4183已确认不再监听，见[端口关闭记录](evidence/Current_Goal_v0/Test_Service_Closure.json)。正常体验预览使用4184，不结束或接管4173/4180。在app执行 `npm.cmd run build`、`npm.cmd run preview -- --port 4184`，访问 `http://127.0.0.1:4184/#assistant`；[使用说明](../app/README.md)含草案操作和不同origin的档案转移方法。实际个人档案是否应用由用户在页面确认。

无新依赖，许可证声明已补充；仅本地提交，main仍为`08fda3880f0cdd796f3b1c9e3d84032083aa0091`，没有推送、合并或公开部署。未实施其他武器、集团完整算法、遗物、最优推荐、全百科、联网、账号读取或云同步。完成后停止等待体验及独立复核。
