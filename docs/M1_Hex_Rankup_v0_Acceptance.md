# 六人组晋升助手 v0：交付验收记录

2026-10-19，Windows/Asia-Hong_Kong。本轮按已授权完整方案实施，交付后由用户安排独立复核；这里记录实现端实际验证，不宣称已完成独立复核。范围仅六人组下一次晋升。未推进第二集团、负声望/日上限/天数计算、活动、礼物/恋爱、自动扣料或后续里程碑。

## 基线、版本与本地提交

开工时工作区干净，基线 `2cda996f58ca8259fa0d758b5694a1c38acd9b8b`；新分支 `codex/m1-hex-rankup-v0`。main保持 `08fda3880f0cdd796f3b1c9e3d84032083aa0091`。未重写历史、推送、合并或公开部署；未停止4173/4180/4184/4192既有服务，未读取或改写真实用户浏览器资料。无新增依赖或锁文件变动。

| 检查点 | commit | 完成内容与实际验证 |
|---|---|---|
| G0 | `450bfff486a07f2562970ee36a9507939bd31a1f` | 方案、来源、ID/货币边界，17保护文件hash一致 |
| G1 | `c04b8b78cbdd5d3d5a389ce96160636b9a1a2711` | 五次相邻晋升目录、Provider校验、领域评估；65项单元通过 |
| G2 | `b8833ebfb620aac808d82527776b700b16a6633f` | 可选目标保存、统一事实及余额复核、恢复/失败保护；70项单元通过 |
| G3 | `fb9ab82d3fab6de4fbb2b6145c10f4cee08b098f` | 中文页面、共享需求、材料来源、跨页与离线闭环；5项新增生产浏览器测试通过，lint/typecheck/build通过 |
| G4 | 交付提交，最终回复及Git日志给出hash | 本记录、使用/许可说明、完整73/29回归、17hash、最终正常构建及本机预览；提交前检查diff |

DB version=1，备份schemaVersion=1，catalogVersion=`2026.10.19.1`，最终build=`m0-c8851286d5df`。build前缀沿用既有机制，内容hash为本轮构建，不代表仅含M0功能；四类版本互不替代。原7路线、29节点、87步骤、30推荐边保持，origin仍单独识别。

## 已实现及边界

- 新“集团晋升”入口 `/#syndicates`，目录包含0→1→2→3→4→5；只对显式目标安排当前→下一等级。达到目标、完成/暂缓时排除，旧异常值或缺目录保留并显示未知。未保存目标选择只预览。
- 四类条件分开显示满足/未满足/未知。声望为本次消耗，不当晋升后容量；祭品不把未来各级提前汇总。终章与六人至少Liked独立记录，终章已完成不重新催关系，恋爱不作为条件。
- 新页与原1999摘要共用两项既有事实。当前等级变化需明确复核余额或置未知，无自动归零、扣料、晋升。历史草案改变已有等级时也明确预览并要求选择余额改未知差异。
- `stock.credits`是唯一星币/霍币余额；新增13资源，共23项。当前晋升与制作/安装按资源ID先合并，再抵扣一次库存。未知和待核不等于0，缺失祭品清单不算满足；未增加晋升批次/产出伪模型。
- 保留原材料动态来源修复，新增集团ID+步骤ID引用。跨页等级、目标、完成/暂缓变化会重算或明确失效，不以旧100000用量搭配新库存。未保存预览明确标记；普通查询不写库。
- 新可选`syndicateTargets`；目标状态仍在`goalStates`，事实仍在`personalFacts`。旧档缺字段不自动补写，未知旧集团/超范围旧等级可恢复并提示；手工输入按集团范围校验。无DB迁移。
- 目标下拉草稿参与既有脏表单及更新协调；跨页新版保存保留当前草稿并拒绝旧revision覆盖。无新插件框架、远程接口实现或第三方响应耦合。

## 实跑命令

在app运行 `node scripts/run-quality.mjs`，设置APP_TEST_PORT=4186、APP_BROWSER_PROFILE_ROOT=.b、APP_EVIDENCE_DIR=../docs/evidence/M1_Hex_Rankup_v0/Final、M0_EVIDENCE_DIR=../docs/evidence/M1_Hex_Rankup_v0、M0_EVIDENCE_PREFIX=Hex_Final。测试服务独占4186，结束后端口已可重新绑定。Chrome独立短测试目录，不使用真实用户资料。

| 命令 | 退出码 | 结果 |
|---|---:|---|
| `npm.cmd run lint` | 0 | 无错误 |
| `npm.cmd test` | 0 | 非watch，9文件，73/73；原57项保留，新增16项 |
| `npm.cmd run typecheck` | 0 | TypeScript通过 |
| `npm.cmd run build` | 0 | 47模块，生产构建成功 |
| `npm.cmd run test:browser -- --reporter=line` | 0 | 29/29，1 worker，约1.3分钟；原24项保留，新增5项 |
| `npm.cmd run build` | 0 | SW升级测试后恢复正常内容hash构建 |
| `node scripts/verify-delivery.mjs` | 0 | 7/29/87/30及既有16保护输入通过；另独立复核含M0计划共17项 |

逐命令输出、时间、退出码：[Hex_Final_Commands.json](evidence/M1_Hex_Rankup_v0/Hex_Final_Commands.json)。唯一工具提示是NO_COLOR与FORCE_COLOR同时设置；保留原输出，没有跳过或重试失败测试来宣称通过。

提交检查中，原始失败日志含测试工具输出的行末空格/结尾空行，完整保留以免改写证据；Git whitespace检查仅对这些原始.log作例外，代码、JSON和文档检查通过。Git另提示本机LF/CRLF转换，不影响以上命令结果或保护文件hash。

## 关键验收与证据

| 项目 | 实际结果及证据（均在本轮证据目录） |
|---|---|
| 五相邻步骤/三态/异常 | 单元逐项核对五成本、四条件、未知和异常、目标达到/完成/暂缓、目录改名排序、合成第二集团隔离；`src/test/syndicates.test.ts`共11项 |
| 保存与恢复 | `src/test/syndicate-storage.test.ts`共5项：余额复核、可选字段/异常旧值、完整往返、事务/配额/revision/屏障、历史草案余额保护 |
| 原档全部业务闭环 | 实际选择旧文件→预览确认→应用历史草案→新增晋升/制作事实→下载完整备份→预览新建恢复→刷新；逐项比较整个profile，仅重映射id/revision；29笔记/87步骤、库存/预算/日志/未知字段、旧原件base64、武器/制作/新集团字段一致。`Final/Hex_Restore.json`及新浏览器测试第一项；不是只比较字段计数 |
| 共享同一星币 | 当前3→4祭品100000 + 福马35000=135000，库存100000只抵扣一次，差值35000；无未来主板，原余额没有被扣。无档查询/下拉预览写入数不变 |
| 当前材料来源 | A停留3→4材料，B更新为4→5且改库存后A显示未知，不混旧用量；改回、达到目标、完成、暂缓、重新关注均跟随。`Final/Hex_Material_Live.json/.png`；原3项material-reference测试全通过 |
| 不假报保存 | 注入QuotaExceededError、旧revision和更新写屏障，整个profiles/snapshots/imports不变，明确失败；声望输入草稿保留。`Final/Hex_Save_Protection.json` |
| 未保存目标 | 仅改下拉不写库，B保存后A保留待保存选择及脏表单标记、拒绝陈旧覆盖。`Final/Hex_Target_Draft.json` |
| 离线 | 确认SW控制→断网→关闭页面→新页打开集团深链接，声望显式0、关系和共享库存离线保存/重载成功。`Final/Hex_Offline.json/.png`；旧树/档案/备份/助手/制作/材料离线回归同时通过 |
| 真浏览器持久化 | Windows Chrome155.0.8059.80、headless，独立真实profile关闭浏览器后同路径重开恢复IndexedDB；`Final/M0_Browser.json`路径app/.b/fab1ead0，`M0_Windows_Reopen.png`。不是fake-indexeddb代替持久化 |
| PWA安装条件 | 生产manifest、192/512图标、start_url=/#tree、scope=/、base=/；Chrome installabilityErrors为空；`Final/M0_Startup.json`。未执行OS安装UI |
| 更新及取消保护 | m0-v1→m0-v2：暂缓、待保存表单阻止、取消解锁、两标签更新、无响应页关闭前阻止；数据保留。刷新发起页、关闭发起页、停止等待worker、重开页取消持久屏障并保存/再重开、无等待worker的孤立屏障显式取消均通过。`Final/M0_Update.json`及`M0_Fix_Update_Refresh/Barrier/Orphan.json` |
| 旧超限/深度回归 | 原backup-boundaries测试全部保留：已存在超限档不下载、不报成功；深度边界旧档实际下载恢复。原容量/结构单元边界也全部通过，无裁剪笔记/日志/未知字段/原件 |
| 中文与布局 | 查看`Final/Hex_Desktop.png`、360/412顶部截图；无横向溢出。HTML笔记作为文本的旧浏览器回归通过。Windows触控模拟仍通过，不代表Android实机 |

## 失败记录与修正

所有失败日志保留在本轮前缀，未改写历史报告。

- G1_Red：新增模块尚不存在，测试无法收集；实现后新增目录使原资源数量10断言失败（64通过/1失败），明确改为23，G1_Green为65通过。没有删测试。原current-goals离线用例在等级改变前增加明确确认余额的操作，原断言保留，适配新的防误写流程。
- G2_Red：缺失事实/目标API，4失败；G2_Draft_Red显示历史等级差异缺声望复核，增加明确差异及成组选择检查后70通过。
- G3_Domain_Red：组合需求缺接口/材料新来源不支持，2失败；G3_Browser_Red：新页面入口尚不存在，1失败。
- G3_Browser_Initial：3通过/1失败，事实编辑器把输入中的值不断写回defaultValue，导致脏表单识别失效；固定基线值并增加未保存目标测试后5通过。旧跨页保护断言未放宽。
- G3_Edge_Red：空祭品清单被当满足，1失败；改为未知并覆盖暂缓旧引用后，最终73/29全通过。

## 资源大小与测量条件

最终build清单见`Hex_Final_Build.json`：总原始546609字节，JS491164、CSS26771；脚本gzip分别152816/6650字节（压缩参数不同于Vite显示，不能混用）。含图标、许可及SW，无全量第三方资料。小型本地目录打入应用，没有外网数据请求或遥测。

`Final/M0_Startup.json`记录Windows headless Chrome、localhost生产预览、无节流、全新隔离会话、landing页单次测量：交互241ms，DOMContentLoaded约97.8ms，load约98.4ms。这不是手机/公网/晋升页性能指标，也不是多次分位数或性能承诺。

## 输入、许可与未验收项

17输入逐项SHA-256前后对照见[Final_Protected_Inputs.json](evidence/M1_Hex_Rankup_v0/Final_Protected_Inputs.json)，全部一致；原HTML、seed、交接文档及M0计划未修改。app内目录仅统一版本并添加本轮所需事实，原稳定ID映射保持。原材料v0/R1证据目录及依赖锁文件无diff。

没有Tenno Hub实现/加工数据/测试/素材复用、更新脚本或新依赖。少量事实独立整理，短指引自行编写，归属与来源详见根THIRD_PARTY_NOTICES.md及[Sources](M1_Hex_Rankup_v0_Sources.md)。官方货币/关系说明不背书社区全部数值，核验标签不等于游戏亲测。

社区晋升表使用约3个月前抓取的Fandom缓存，部分中文来源仅检索缓存可读；新域/部分直开受限。数值及当前版本条件未在游戏内验证，存在资料时效限制。区域入口以实际已解锁地图及晋升面板复核，没有伪造最快点位、概率或实时赏金。

Android真机设备/系统/浏览器、软键盘、横竖屏、双指操作、手机可信HTTPS安装/SW/离线重启未执行；Windows系统安装UI和游戏内晋升也未执行。需用专用档案与可信HTTPS在真机按README流程复现，记录设备版本与截图；不能以360/412桌面截图替代。独立复核尚待执行。

## 本机体验与停止点

4194仅绑定127.0.0.1，预览进程9532，`http://127.0.0.1:4194/#syndicates`；首页、构建信息及manifest均HTTP200，见`Preview.json`。未开放公网。该地址与旧端口存储隔离，先从旧地址导出，再在此选择文件、核对预览、新建恢复。不要因新地址空档而清理原数据。

启动/复跑命令见app/README.md“六人组晋升助手v0”。本轮G4本地提交后停止；不向审阅聊天发送消息、不安排自动化、不推进后续功能，等待独立复核或新授权。
