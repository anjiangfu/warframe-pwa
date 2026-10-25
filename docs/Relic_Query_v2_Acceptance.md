# 遗物查询 v2：31项目录扩容——作者验收记录

2026-10-25。人类批准“31项方案开工并独立复核”。基线d63c72e023b04ddfb8b5053b6378eaffcadd315c，初始工作区干净；分支codex/relic-query-v2。本轮只扩遗物有限目录，不重做旧里程碑；作者实跑与交付后审阅端独立复核分开记录。独立复核在交付时仍待执行。

## 实际交付和范围

独立从固定本地drop提交3263b2dff8bc1b434a191f0364395b156bd26561的七普通节点重算：31遗物、每个6项Intact奖励、186关系、117实体；新增19遗物、60奖励、38摘录，总62摘录。全部新遗物都能选到两个不同节点，没有补造第二条。完整原行、所有候选及选中轮次见Samples.json和G0_Counts.json；程序不是按数量塞入合成数据。

| 纪元 | 完整集合 | 数量 |
|---|---|---|
| 古纪Lith | A13、C15、C7、G14、L8、S18、S19、V11 | 8 |
| 前纪Meso | A12、C11、D8、D9、K9、V13、V17、Y2 | 8 |
| 中纪Neo | A16、C10、C11、C7、K10、V13、Y2 | 7 |
| 后纪Axi | A21、A22、C12、D6、P10、S21、S8、V14 | 8 |

旧12遗物／57奖励／72关系／24摘录／11地点／6规则及来源完整保留，旧数组前缀逐字段深相等。新资料只引用七普通地点，镜像特例、普通防御三波、中断按表现、任务计时与现实时间区别及航道待核保持。所有availability仍unknown，sourceScope partial，不判断实时可刷、复刻或账号准入；每个遗物仅摘录两条，不称全部来源。

60新奖励：59项精确英文／父实体／组件及drops.type双重关联，其中45项父专名含汉字、14项上游仍拉丁原文并标待核；另1项为固定源行2X Forma Blueprint，用既有中文组成“2份福马蓝图”。bundleOf明确引用blueprint:forma×2，是有数量的奖励记录，不建第二个福马物品、成品福马或库存。原单份蓝图仍反查12个，数量奖励反查其实际8个；“福马”搜两个准确记录，不按名称合并。原56名称组合及既有福马保持，当前总31项拉丁父专名待核。

独立遗物catalogVersion升级为relics.2026.10.25.1。LocalProvider、英文原键、其他目录、个人模型、IndexedDB和完整备份格式保持；没有查询历史、收藏／排序状态、遗物库存、目标、概率／组队／精炼／价格／收益或次数计算。新增bundleOf仅为这一真实数量奖励提供最小兼容描述，不是通用插件框架。

## 来源和可复跑转换

[Sources](Relic_Query_v2_Sources.md)、[逐项Audit](evidence/Relic_Query_v2/Audit.md)、New_Name_Audit.json、Relic_Name_Audit.json及Inputs.json保留固定来源、原字节hash、精确关联、类别和待核；本轮不换浮动master或最新版本、不联网下载新资料、不运行上游脚本／包。两份既有MIT版权及全文继续保留，未加依赖或复制Tenno Hub加工资料／Wiki模块／图片。

tools/relic-query-v2/convert.mjs只读明确的固定公开文件和G0基线，先核hash再解析；相同输入两次序列化字节一致且等于发布JSON。重复Intact／ID、悬空来源、缺六奖励、身份／英文冲突、类型不明、选样或来源不足明确拒绝；中文缺证据保持待核，冲突候选不进入可信搜索。纯转换克隆输入，不写个人数据；CLI必须显式输出路径。7项Node转换测试单独计数，合成故障仅在内存。用法和缺输入的处理见[转换工具说明](../tools/relic-query-v2/README.md)。

补记v1非阻断文档差异：旧目录实际15条总蓝图用项目类型词，原文14条不改写历史；本轮新增18条用同类型词。审阅端新请求package.json仅version与作者留存不同，实际名称／许可hash匹配；本轮核留存固定字节，不冒称历史全12文件逐字节复现。来源日期独立，新核对为10月25日，旧记录不改日期，不当作游戏亲测时间。

## Git检查点

| 阶段 | 完整提交 | 完成内容 |
|---|---|---|
| G0 | ea7e713cf753382193779132d0c81169bed2b728 | 固定源hash／许可、17保护输入、旧目录／契约／产物快照、31／60／38逐项审计和计划 |
| G1 | ddfd5c98c04c17475b59783baa6ca3223b78b389 | 可复跑转换、扩容目录、数量引用验证、新6单元及原回归调整；120应用单元＋7转换、lint/typecheck/build通过 |
| G2 | db817ea5ae9d352f74c963ef410486c11a355ae8 | 数量奖励说明、新3浏览器与原10遗物用例，13项通过；只读、全31离线、展开证据和视口检查 |
| G3 | 本记录所在最终本地提交，完整hash见最终报告及git log | 全量检查、保护比对、最终正常构建、使用说明、验收与限制 |

main保持08fda3880f0cdd796f3b1c9e3d84032083aa0091，不推送、不合并、不改写历史。

## 作者实跑

全部测试位于.v/rv2/app、专用4186、短Chrome目录.b和测试数据库；node_modules仅联接已有依赖。临时SW构建不进入原app/dist或4194。原Hex复制hash验证、单跑后移出正式e2e，不混入正式数量。证据统一docs/evidence/Relic_Query_v2，未覆盖历史日志。

| 命令／位置 | 退出码与实际结果 |
|---|---|
| npm.cmd run lint／隔离app | 0 |
| npm.cmd test／隔离app，非watch | 0，14文件120通过，原114＋新增6 |
| npm.cmd run typecheck／隔离app | 0 |
| npm.cmd run build／隔离app，浏览器前 | 0 |
| npm.cmd run test:browser -- --reporter=line／隔离app | 0，56通过，2.5分钟；原53＋新增3 |
| npm.cmd run build／隔离app，浏览器后 | 0，恢复正常内容hash构建 |
| node scripts/verify-delivery.mjs／隔离app | 0，原7／29／87／30、manifest图标及16保护输入；17另核 |
| node --test tools/relic-query-v2/convert.test.mjs／项目根 | 0，7转换测试，另计 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --reporter=line／隔离app，单独 | 0，额外1通过，4.1秒，不计正式56 |
| npm.cmd run build／原app，最后只正常构建 | 0，m0-ab7372f47253，base=/ |
| verify-preservation.py Before_Final_Build／After_Final_Build | 均0，17输入、10旧契约、84被测文件、9产物；旧目录前缀相同 |

原始命令、UTC起止、退出和输出见Relic_Query_v2_Commands.json／Final_Quality.log，转换另见Final_Converter_Command.json／Final_Converter.log，原app见Final_App_Build_Command.json／Final_App_Build.log。正式套件零重试通过，无测试删除。必要旧期望变动见Test_Expectation_Changes.md和Allowed_Test_Changes.diff；除两个旧遗物单元文件、两个旧遗物浏览器文件外，其余旧测试／storage／profile模型／Provider／package／lock／scripts与基线diff为0，见Retained_Regression_Comparison.json。

## 逐项验收证据

以下路径相对docs/evidence/Relic_Query_v2，Final为完整最终运行。原v0/v1证据文件名沿用测试工具，写入的是本轮新目录，不覆盖历史。

| 项目 | 检查与证据 |
|---|---|
| 独立源记录与旧集合 | Samples、New_Name_Audit、Relic_Name_Audit；转换7测试及新增6应用单元逐完整原行／原前缀深相等。31×6、117身份、62来源均核，位置和轮次来自实际候选，不只断言数量 |
| 新19／新60正反查 | Final/Relic_V2_All_Added.json：无档案逐19六奖励、2来源，60项原英文和已核组合共120次，反查ID集合与186关系精确一致，业务三表前后相同 |
| 原12与全部关系 | 原Relics_All_Samples用例现在逐31／186／62点击反查并核全部地点／模式／轮次／来源链接，旧12也逐原G0样本单元比较；原56名称112次查询、11地点和6规则回归保留 |
| 数量奖励和列表 | Final/Relic_V2_Layout.json：2份蓝图明确引用blueprint:forma，不自动入库；31遗物／117奖励列表、展开证据、1440×960／360×860／412×860／860×412无横向溢出；已查看最终360详情原分辨率，长标识、名称、数量说明和路线可换行 |
| 只读与切档 | Final/Relic_V1_Readonly及Relics_Profile_Readonly.json：显式创建两档后取基线，搜索／过滤／详情／展开／返回／切档不改变profiles、snapshots、imports；新增扩容查询也检查三表相同 |
| 31样本离线 | Final/Relic_V2_Offline.json及Relics_Offline：确认生产SW控制，模拟断网关闭页、重开/#relics，31六奖励／62摘录可读，六规则／中文检索仍可用；空结果仍说明有限目录，外链未离线打开 |
| 原业务完整恢复 | 原ui及M1_Restore、Hex_Restore、Goals_Restore、Pilot_Restore等保留：实际下载→预览→明确新建恢复→刷新，原29节点87步骤、全部业务及未知字段／旧原件保持，无遗物字段进入个人备份 |
| 容量／深度／失败 | 原backup-boundaries应用单元和浏览器通过；Final/M0_Repair_R1_Backup_Failure证明29×100000中文笔记超限旧状态不裁剪、不下载、不假报成功；M0_Fix_Depth_Restore证明18层child实际导出和恢复，原字节／日志时间保留；事务／配额／revision及档案隔离不退步 |
| Hex、材料和草稿 | 原相关正式回归保留；Hex_Independent/Review_Unsaved_Facts.json额外复现，草稿4／12345保留，库仍3／65000／目标5，原输入和执行副本SHA一致；单独1项不混正式56 |
| 更新与写保护恢复 | 原zz-update四项及其他更新回归通过，Final/M0_Update及M0_Fix_Update_Refresh/Barrier/Orphan.json：暂缓、待保存、多标签页、刷新／关闭发起页、worker会话丢失和孤立屏障，重开后明确取消并恢复写入，数据保留 |
| Windows真实浏览器持久化 | Final/M0_Browser.json：win32 headless Chrome156.0.8078.47，专用.b/3e923afd真实进程关闭后同路径重启，IndexedDB名称恢复；未访问用户真实浏览器目录 |
| PWA和保护 | M0_Startup检查scope=/、start_url=/#tree、192／512图标和installabilityErrors为空；Preservation_Before_Final_Build和After_Final_Build核17输入、10旧契约、84被测源码／配置／public／测试／scripts相同，旧遗物全部字段前缀相同；原9产物临时阶段等于G0，最终等于隔离正常构建 |

## 失败、修正与包体

首次只读结构探测省略missionRewards外层导致KeyError，LICENSE文件名假设也不符，随后按真实结构／license.txt核对，没有修改数据。隔离依赖junction首次受沙箱拒绝，应用测试因找不到vitest退出1；保留G1_App_Environment_Failure，审批后只联接原依赖，没有安装。G1_Converter_Red因实现缺失退出1；初版读取Windows反斜杠路径未归一化导致7失败／0通过（hash故障夹具也用了未归一化键），G1_Converter_Initial保留；修正后7通过。G1_App_Red实现前4失败／2通过；扩容后旧“福马只命中1项”失败，G1_App_Initial为119通过／1失败；按准确两个ID更新后120通过。

G2_Red在数量说明实现前1失败；G2_Initial为12通过／1失败，旧离线日期断言错误套到新资料。改成逐遗物来源日期，旧12保留原日期，新19为本轮日期；G2_Green为13通过／退出0。最终全套120／56＋转换7＋Hex1均退出0。所有失败原日志／截图／上下文保留，未用重试或改数据掩盖；工具原始error-context和日志空白不修改。

最终正常build m0-ab7372f47253，9资源761960字节，相对v1的680164增加81796。JS700633字节（本地gzip185486），CSS30334（gzip7283），许可17751；完整清单Relic_Query_v2_Build.json。只缓存应用壳与有限静态目录，不缓存原始全量JSON。保留>500kB构建警告，未提高阈值或借机全站重构；构建工具压缩报告与本地gzip测量分开，不当网络实测。NO_COLOR/FORCE_COLOR及npm更新提示原样保留，未更新依赖。

M0_Startup单次landingInteractiveMs=212；条件为Windows headless Chrome、localhost生产预览、无节流、新隔离会话、仅landing页，不代表遗物页、手机、公网或分位数保证。Android真机／软键盘／真实双指／横竖屏、手机可信HTTPS安装及已安装应用离线重启、Windows系统级安装、真实账号开放和游戏规则／掉落亲测均未验。全部当前获取未知，31项父专名汉字、8地点中文和四航道具体触发等旧缺口继续待核。

## 预览与停止

4194只读初探拒绝连接，保留Preview_Before_Normal_Build.json；最终原app正常构建后启动隐藏localhost预览，未停止旧服务。Preview_Start.json和Preview.json记录PID18620、首页及build-info HTTP200、m0-ab7372f47253。体验http://127.0.0.1:4194/#relics，旧页面先处理草稿再按SW提示更新，勿清库。不同origin／端口／浏览器存储隔离，带入档案须导出、预览并明确新建恢复。

使用说明、来源声明、转换说明已更新。复跑先从项目根执行prepare-isolated.py，隔离node_modules仅联接原依赖；在.v/rv2/app按README设置4186／.b及新的绝对证据目录和新前缀，再运行node scripts/run-quality.mjs。转换7测试与原Hex另计，不覆盖本轮／旧证据，不在正常4194目录跑临时SW测试。

本轮仅本地提交，不推送／合并main／公开部署／付费／第三方AI，不修改系统／网络／电源／证书，不删除原件／档案，不访问真实个人数据。交付后停止，等待独立复核；没有自动循环返修、自动续工或后续里程碑授权，也不向其他聊天发送消息。
