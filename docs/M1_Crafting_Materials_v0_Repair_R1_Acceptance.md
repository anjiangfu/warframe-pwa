# M1材料参考用量同步：一次限定返修验收

2026-10-18。此次修复实现完成，作者实跑Windows生产Chrome范围通过；尚无返修后的独立审阅结论。Android真机、可信HTTPS安装、系统安装UI及游戏内实测继续未验，不扩大功能范围。

## 授权与基线

审阅聊天01a14461-c37e-73b1-b67f-75bde74879a8的人类用户明确“授权这一次M1返修”，本开发聊天收到限定指令。只修复6eceecd063373fbf9585d3c274a574202a4112a2的P2材料参考需求过期问题。基线工作区干净，沿用codex/m1-crafting-materials-v0，保留既有历史和全部资料；最终仅一个独立本地返修提交，完整hash见交付回复（文件不嵌入其自身提交hash）。main仍为08fda3880f0cdd796f3b1c9e3d84032083aa0091。

本次不占M0返修次数，不恢复监控或M1循环返修，不创建新聊天/第三方AI调用、不回发审阅聊天，不推送/合并/公开部署，不改系统或真实用户库。审阅端可自行读取新提交与证据。

## 复现与根因

App的材料导航只存required数字、材料ID和profileId。同档案广播更新了profile/stock，却不能知道required来自哪份计划、共享集合还是预览。因此A计划1、库存0打开神经元，B改计划3/库存1后，A同步库存1仍以旧需求1显示缺0，B显示需求3/缺2。此前切档保护和50/21回归通过并没有覆盖这个同档案来源失效场景。

先独立编写正式浏览器回归，按上述A/B操作实际失败，期望缺2、收到0；[Red.log](evidence/M1_Crafting_Materials_v0_Repair_R1/Red.log)退出1，[失败截图/上下文](evidence/M1_Crafting_Materials_v0_Repair_R1/Red)保留。新增领域测试首次因尚无新模块而无法收集，见Unit_Red.log，不冒充7个行为断言失败。首次拷贝失败截图时目标Red子目录未创建，拷贝未发生；建立目录后成功保存，没有丢弃或修改红灯日志。

## 修复方式与边界

只新增小型纯查询模块domain/material-reference.ts，接通原导航调用，不重构Provider、库存、目标引擎或数据库。导航保存材料ID、发起档案、返回入口及下列来源，取消保存required数字快照：

| 来源 | 保存的查询信息 | 当前显示语义 |
|---|---|---|
| 单项目 | 配方稳定ID | 从当前craftingTargets数量、goalStates和当前目录重算 |
| 共享合计 | 明确shared来源 | 每次从当前currentPlans集合重算，按同一资源合计，库存仍只抵扣一次 |
| 助手链接 | 目标稳定ID | 匹配当前制作目标，再从当前档案/目录重算，不依赖点链接时的数字 |
| 未保存预览 | 配方ID与本次查询数量 | 保留独立数量，醒目标明“未保存数量预览”，并说明不代表最新已保存目标；库存仍为当前档案 |

来源不匹配、已保存目标被删除/完成/暂缓、配方/材料引用缺失或资料待核时，用量/缺口显示未知及“目标已变化，请返回重新查询”。恢复关注后从当前数据重算。普通浏览无指定目标；跨档案不沿用用量。没有按revision统一清空上下文，库存单独保存仍可正常核对有效用量。

所有持有量继续来自唯一profile.stock，既有保存队列/revision/广播/更新屏障未改。没有新增个人持久字段、迁移、配方/武器/集团/遗物、远程请求或依赖。DB version=1、备份schemaVersion=1、catalogVersion=2026.10.18.2保持，容量/深度/遍历值约束和原件完整保留。

## 针对性验收

新增7项领域用例（material-reference.test.ts），以及3项真实页面用例（material-reference.spec.ts）。目标3项浏览器全部通过，见[Targeted.log](evidence/M1_Crafting_Materials_v0_Repair_R1/Targeted.log)；最终再次随完整回归执行。最终截图/JSON位于[Final/](evidence/M1_Crafting_Materials_v0_Repair_R1/Final)。

| 条件 | 实际验证 |
|---|---|
| 原A/B复现 | A/B均显示需求3、库存1、缺口2；Saved_Project_A/B.png及Saved_Project.json |
| 仅改库存 | 库存1再改2，A需求仍3、缺1；领域用例另改变revision三次，需求不被清空 |
| 单目标完成/暂缓/恢复 | A先显示未知与目标变化提示，恢复关注后重新显示当前需求3/库存2/缺1 |
| 共享集合/数量变化 | B改数量3，A共享详情同步需3；完成/暂缓使该材料退出当前集合，A明确未知；恢复后需3。领域合成第二项目证明共享贡献由1变5，再按当前成员变4，全部排除及缺目录时未知。合成配方只在测试中存在 |
| 助手链接 | 通过助手打开材料，从已存5重算；另一页改2后A需2/库存1/缺1，来源标明助手 |
| 未保存预览 | A预览3打开详情前后profiles/snapshots/imports严格相等；B另存5后，A仍明确为未保存预览3，库存变1后缺2；没有把它标成最新保存目标 |
| 查询、切档与未知 | 普通查询显示未指定目标且不写库；原切档保护/未知库存/新档隔离用例完整保留，另有领域断言覆盖跨档/缺资源/配方被移除或用量待核 |
| 保存和数据安全 | 原配额/revision/事务/更新屏障失败不报成功、完整备份及原29/87/中文笔记/库存/预算/日志/未知字段/原件严格往返全部保留并本轮重跑 |

新增来源标签及正确数字的桌面截图已实际查看；原360/412视口及模拟触屏回归仍通过。这些不是Android真机证据。

## 最终实跑

Windows真实Chrome155.0.8059.80，headless，127.0.0.1:4186生产构建，worker1。专用短Chrome持久目录实际为D:\wf\Warframe_PWA_Handoff_20261016\app\.b\318a9745，关闭浏览器重开验证通过，见Final/M0_Browser.json。未使用用户Chrome资料。

在app设置APP_TEST_PORT=4186、APP_BROWSER_PROFILE_ROOT=.b、APP_EVIDENCE_DIR=../docs/evidence/M1_Crafting_Materials_v0_Repair_R1/Final、M0_EVIDENCE_DIR=../docs/evidence/M1_Crafting_Materials_v0_Repair_R1、M0_EVIDENCE_PREFIX=M1_Repair_R1，运行node scripts/run-quality.mjs。[完整命令/UTC起止/stdout/stderr](evidence/M1_Crafting_Materials_v0_Repair_R1/M1_Repair_R1_Commands.json)：

| 命令 | 退出码 | 结果 |
|---|---:|---|
| npm.cmd run lint | 0 | 通过 |
| npm.cmd test | 0 | 非watch，7文件57/57；原50＋新增7 |
| npm.cmd run typecheck | 0 | 通过 |
| npm.cmd run build | 0 | 生产43模块构建通过 |
| npm.cmd run test:browser -- --reporter=line | 0 | 24/24（约1.1分钟）；原21不改不删＋新增3 |
| npm.cmd run build（浏览器后） | 0 | 恢复正常内容hash版本，不遗留测试build ID |
| node scripts/verify-delivery.mjs | 0 | 原16项保护/7路线29节点87步骤30推荐关系/manifest图标检查通过 |

本轮完整浏览器再次覆盖SW控制后断网关闭页重开、真实下载恢复、跨页未保存草稿保护、v1→v2多页更新、发起页刷新/关闭、屏障阶段停止worker、孤立屏障取消后的写入与重开；不是沿用上一轮结果，也没有以fake-indexeddb代替真实浏览器。

最终build=m0-b7f3fdc0c850（原构建前缀沿用），原始资源合计509486字节，详见[M1_Repair_R1_Build.json](evidence/M1_Crafting_Materials_v0_Repair_R1/M1_Repair_R1_Build.json)。工具仍有NO_COLOR/FORCE_COLOR环境警告，原样保留，不影响退出0结果。

## 资料保护、体验与停止点

[17项hash对照](evidence/M1_Crafting_Materials_v0_Repair_R1/Protected_Inputs.json)全部与6eceecd交付记录一致，含原始HTML、seed、交接资料及原M0计划。旧M0/M1验收、来源与证据目录未改；审阅端日志/复现文件只读，未运行其脚本。所有新证据使用M1_Crafting_Materials_v0_Repair_R1新前缀，不覆盖旧记录。没有新增依赖或修改锁文件、目录事实及许可正文。

现有本机[制作缺口](http://127.0.0.1:4192/#crafting)、[材料查询](http://127.0.0.1:4192/#materials)继续可用。页面/build-info/manifest实际HTTP200，build-info确认新构建；[Preview.json](evidence/M1_Crafting_Materials_v0_Repair_R1/Preview.json)。仅复用本机4192服务，未停旧4173/4180/4184。4186测试服务已随框架结束，临时绑定探测确认空闲后立即关闭。

旧页面按更新提示保存后更新，DB/schema不变，无需删库或重新导入。备份恢复方式仍见[使用说明](../app/README.md)；不同origin的存储不自动互通。

本报告为作者实跑结果，独立审阅需审阅端另行读取。Android真机/手机信任HTTPS安装、Windows OS安装UI、游戏内制作及未确认的中文节点名仍未验，未宣称通过。完成一个独立本地修复提交后停止，等待新的明确授权；不发送回审阅聊天、不启用监控或循环返修。
