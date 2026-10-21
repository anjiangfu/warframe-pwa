# 虚空遗物查询 v0：交付与作者验收

2026-10-21。已获人类批准的小目录双向查询；基线81cd6128c0b43f378ad1e3d3ed8ec7ca47d3eac2，初始工作区干净，新分支codex/relic-query-v0。本记录是作者在独立副本实跑的结果，交付后审阅端独立复核尚待执行，不把作者报告当独立验收。

## 实际范围和资料

新增“虚空遗物”只读栏目，可无档案查看，按遗物名/编号和纪元查完整基础奖励，按奖励反查本轮收录的遗物及其摘录来源。搜索/详情/返回/切档不写profiles、snapshots或imports。目录/索引由LocalProvider提供，UI不接触WFCD原响应，不保存派生查询、遗物库存或历史。

实际12遗物、57个独立奖励实体、72条基础奖励关系、24条摘录任务来源。均以既有福马蓝图需求选样，四纪元各3项；不是效率排名或完整遗物库。福马蓝图唯一blueprint:forma，不与成品福马混淆；其他奖励按精确上游ID引用，不按中文相同自动合并。中文专名未核时显示中文类别、原名与待核提示；蓝图/部件原类型保留。

| 纪元 | 本轮样本（实际编号） |
|---|---|
| Lith | C7、G14、S19 |
| Meso | A12、V13、V17 |
| Neo | C10、C7、K10 |
| Axi | A21、P10、S8 |

逐遗物完整6奖励和2条来源明细在[evidence/Relic_Query_v0/Samples.md](evidence/Relic_Query_v0/Samples.md)，原始摘录与核对结果在Samples.json。本轮从WFCD warframe-drop-data固定提交3263b2dff8bc1b434a191f0364395b156bd26561采用少量结构化事实，MIT原文和版权已保留；原始输入hash、字段、日期及许可限制详见[Relic_Query_v0_Sources.md](Relic_Query_v0_Sources.md)。2026-10-21直接读取的DE公开表与该构建info的MD5一致，72条奖励和24条来源逐行对应，仍不说明当前可刷或账号已解锁。

每项基础奖励完整性、每条来源快照核验和当前可获取状态分开。来源仅摘录2条，不是全部来源，不标来源完整已核；当前可获取均unknown，未核额外触发/入场条件单列。模式/轮次仅原表标签，不推算分钟/波次；Caches不猜箱数。概率字段分别留在奖励关系与获取关系边界，本版均不展示或计算，不实现精炼/队伍、掉率收益或刷取次数。

无个人模型、DB、备份格式或旧目录变更；DB/schema仍1，旧catalogVersion仍2026.10.21.1，遗物目录独立relics.2026.10.21.1。新增栏目必要的Provider/入口/CSS，没有全站重构。没有全库、实时轮换、库存、目标加入、开核模拟、交易估价、云同步或下一阶段功能。

## G0—G3本地检查点

| 检查点 | 完整提交 | 内容和实际验证 |
|---|---|---|
| G0 | ab1537e8eb71e10fcc2d581f36c1a1d28014273c | 许可/commit/hash/字段、12真实样本/72奖励/24路线及17输入、10契约、原9产物快照；资料质量足够支持有限快照查询 |
| G1 | 24dc3e33bfd2b1ecb098658407c0a1b12040799a | 独立目录、稳定引用、严格校验、双向查询及Provider；102单元、lint/build通过，保留红灯与别名校验修正 |
| G2 | 83c7022c7e34ac8ca0879f188747832eefad977c | 中文只读栏目、来源/未知/有限范围、搜索与返回；新增5项生产浏览器、lint/build通过，2项界面前红灯证据保留 |
| G3 | 本报告及最终证据所在本地提交；完整hash见交付回复/Git日志 | 全量102单元/48正式浏览器，额外原Hex复现另计1；正常原app构建、许可/README/本记录和hash对照 |

main保持08fda3880f0cdd796f3b1c9e3d84032083aa0091，不改写既有历史，不推送或合并。G3自身hash不嵌入自身文档，提交后以Git实际读取报告。

## 隔离与复跑

所有开发/临时SW构建及生产浏览器在忽略目录.v/rl/app，独立dist/4186/短Chrome目录.b；node_modules仅联接项目已有安装，没有新依赖。准备脚本evidence/Relic_Query_v0/prepare-isolated.py只复制项目源码和测试验证输入，不复制用户浏览器DB。新副本需先建立指向原app/node_modules的junction，确认4186空闲，复跑请使用新证据目录/前缀。

```powershell
# 从项目根用Python3执行prepare-isolated.py，进入.v/rl/app后：
$env:APP_TEST_PORT='4186'
$env:APP_BROWSER_PROFILE_ROOT='.b'
$env:APP_EVIDENCE_DIR='D:/wf/Warframe_PWA_Handoff_20261016/docs/evidence/Relic_Query_v0/Manual/Browser'
$env:M0_EVIDENCE_DIR='D:/wf/Warframe_PWA_Handoff_20261016/docs/evidence/Relic_Query_v0/Manual'
$env:M0_EVIDENCE_PREFIX='Relics_Manual'
node scripts/run-quality.mjs
```

原独立Hex复现从只读路径C:/Users/21904/Documents/Codex/work/wfhexr1-review-ec2d919/app/e2e/review-hex-draft.spec.ts复制到隔离副本，单独执行后移出e2e，不计入48项正式数量。Independent_Source_Comparison.json证明原件前/后/执行副本SHA相同；不修改审阅端work/outputs，不回发其他聊天。

Preservation_Before_Final_Build.json证明临时测试完成后、原app正常build前，原9个dist文件仍与G0相同；17保护输入、10旧数据契约及79个原/隔离测试输入文件一致。最后原app仅正常build，9产物与隔离副本最后正常产物逐字节一致，见Preservation_After_Final_Build.json。原件及旧交付证据不覆盖，临时v1/v2从未进入原dist或4194。

Source_Adaptation_Final.json另记录61,546字节小目录SHA256 a386054471f90d9674a58c9fe63595c8acf51443834dd4cdf68f59a33fee5b79、全部固定输入、许可原文包含关系及12/57/72/24。自编build-catalog.py重跑后目录原字节不变，见Adapter_Reproduction.json；没有执行第三方脚本。全量上游和官方整页只在忽略的开发资料目录，不随应用或SW缓存分发。Protected_Inputs_Initial保留前基线记录时间，并将本轮checkedAt校正为快照文件实际创建时间；17输入hash不变。

## 最终命令与退出码

完整命令、UTC起止、stdout/stderr及退出码在[evidence/Relic_Query_v0/Relic_Query_v0_Commands.json](evidence/Relic_Query_v0/Relic_Query_v0_Commands.json)，本轮不覆盖任何旧前缀证据。

| 实跑命令 | 地点 | 实际结果 |
|---|---|---|
| npm.cmd run lint | 隔离app | 0 |
| npm.cmd test | 隔离app | 0，非watch，12文件102/102，原91+新11 |
| npm.cmd run typecheck | 隔离app | 0 |
| npm.cmd run build | 隔离app | 0，52模块 |
| npm.cmd run test:browser -- --reporter=line | 隔离app | 0，1 worker，48/48，1.9分钟，原43+新5 |
| npm.cmd run build | 隔离app | 0，临时SW测试后恢复正常内容hash版本 |
| node scripts/verify-delivery.mjs | 隔离app | 0，原7/29/87/30、manifest/图标及16保护输入；另单独核17项 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --retries=0 --reporter=line | 隔离app，单独执行 | 0，额外1/1，3.4秒，不计正式48 |
| npm.cmd run build | 原app，临时测试全部结束后 | 0，m0-d25c234ca092；Final_App_Build.log及Final_App_Build_Command.json |
| verify-preservation.py Before_Final_Build / After_Final_Build | 项目根 | 均0，17输入/10契约/79测试输入/9产物 |

原91单元/43正式浏览器源码与基线全部未改，新增测试只在relics.test.ts/relics.spec.ts，package及锁文件也未改，见Retained_Regression_Comparison.json。没有放宽旧断言以适配新栏目。

## 实际验收证据

下列路径均相对docs/evidence/Relic_Query_v0；Final是本轮完整最终运行，G2_Initial是先行5项结果和已人工查看截图。

| 项目 | 证据和实际结论 |
|---|---|
| 全样本完整奖励/来源/双向关系 | 新单元逐行对照G0原摘录；Final/Relics_All_Samples.json，浏览器12×6逐奖励点反查并比较全部命中ID，再回原遗物，逐条核对24路线地点/模式/轮次/源链接；无档案亦可用，全部业务表前后相同 |
| 查询范围/无结果/既有福马ID | Final/Relics_Search_Scope.json；Axi筛选3项，g14查1项，福马蓝图反查12项，明确仅本目录；未收录不称游戏不存在，始终显示收录12项，清空/返回不写库 |
| 稳定ID/缺字段/同名/失效/冲突 | 11项新单元，夹具明确标合成测试数据；缺字段、悬空引用、重复ID/关系和同上游奖励别名拒绝，同名不同ID独立反查，未知日期/无路线保留未知，来源冲突不随奖励表已核而升级。夹具不进入真实目录 |
| 公共查询/切档/无历史记录 | Final/Relics_Profile_Readonly.json；显式创建两档后记录基线，搜索/详情/返回/切档前后profiles/snapshots/imports完整相同，查询不依个人档案 |
| 全目录离线 | Final/Relics_Offline.json/.png；确认SW控制、断网、关闭页面后重开/#relics，全部12奖励表和24来源可读，日期和未知提示保留；不离线打开外链 |
| 桌面/360/412/横屏 | Final/Relics_Layout.json和Relics_Detail/Desktop/Viewport截图；1440×960、360×860、412×860、860×412无横向溢出，正文/源日期换行。G2详情截图已人工检查；是Windows模拟视口，不是手机实机 |
| 原行动清单 | 原6项actions浏览器和11项单元保留通过，Final/Actions_Live/Draft_Protection/Restore_Offline/Update.json：共享一次抵库存、当前下一阶、未知不当0、草稿/跨页/切档、完整备份和更新保留 |
| 完整备份/29节点87步骤 | Final/M1_Restore、Hex_Restore、Goals_Restore、Pilot_Restore及原ui用例：实际下载→预览→确认→新档恢复→重载，全业务及未知字段/原件保留；无新遗物字段写入备份 |
| 容量/嵌套/事务/失败 | 原backup-boundaries单元和浏览器保留，Final/M0_Repair_R1_Backup_Failure及M0_Fix_Depth_Restore.json；超限不下载不裁剪，合法边界往返；配额/revision/快照/屏障失败不改存盘或假报成功 |
| 原Hex与材料来源 | 原syndicate-drafts四项、material-reference三项及Hex_Material_Live保留。Independent_Extra/Review_Unsaved_Facts.json额外复现保留4/12345草稿并阻止目标保存，库仍3/65000/目标5 |
| 原更新中断恢复 | 原zz-update四项和其他草稿更新用例通过；Final/M0_Update、M0_Fix_Update_Refresh/Barrier/Orphan.json：刷新/关闭发起页、停worker/屏障、重开后明确取消并恢复可写，数据保留 |
| Windows浏览器持久化/安装性 | Final/M0_Browser.json：Chrome155.0.8059.80，专用.v/rl/app/.b/8dfa8be1真实进程关闭后按同一路径重启恢复IndexedDB；M0_Startup.json检查base/scope=/、start_url=/#tree、192/512图标、安装性错误为空；未操作OS安装 |

## 失败、包体和未验项

保留访问失败和修正事实：gh配置Access denied、PowerShell认证失败、web仓库/API页面不可用，改用不读取凭证的公共HTTPS固定原始文件，未改系统网络或证书。自编核对器首次把Caches后缀重复拼接导致KeyError，修正节点匹配后逐行通过，未采用未核行。G1_Red是缺模块、0收集；G1_Alias_Red为1失败/10通过，发现同上游奖励被另建别名ID，修正校验后102全通过。G2_Red的grep匹配2项，均在实现前找不到栏目而失败，截图/上下文保留；实现后5项全部通过，全量48零重试掩盖。原始日志与失败error-context的工具行末空白保留，Git空白检查对这些原始工具输出作例外，源码/文档/JSON检查通过。

最终9资源原始合计636743字节，较基线580746增加55997；JS577178字节（脚本gzip169202，较原JS增加53199），CSS29711字节（gzip7173），许可汇编16612字节。完整清单Relic_Query_v0_Build.json，未缓存全量第三方原始资料。保持现有同步Provider和小目录组织，仅增加栏目必要代码；未全站重构、未调高阈值隐藏超过500kB块警告。NO_COLOR/FORCE_COLOR提示亦原样保留。

Final/M0_Startup.json记录Windows headless Chrome、localhost、无节流、全新隔离会话、landing页单次交互312ms；不是遗物页/公网/手机性能或分位数保证。Android真机/软键盘/双指、手机可信HTTPS安装和离线重启、Windows系统级安装、真实账号解锁和游戏掉落/效率均未验。资料同字节核对不等于游戏亲测，当前可获取和额外条件仍未知，外部来源需联网。

## 预览与停止

4194只读探测无响应，相关失败保留于Preview_Before_Normal_Build/Preview_Initial_Probe.json。只为最终正常原dist启动隐藏的本机预览，未停止旧服务；Preview.json记录127.0.0.1:4194、PID36268、首页HTTP200、m0-d25c234ca092。体验[虚空遗物](http://127.0.0.1:4194/#relics)。旧页面先按提示保存后更新，勿清库；不同origin/端口/浏览器档案隔离，迁入须导出、预览并明确新建恢复。

README、根THIRD_PARTY_NOTICES及应用内许可已更新。全部修改仅本项目，本轮无第三方AI、付费、系统/网络/电源/证书修改、真实档案操作、公开部署、推送或main合并。G3本地提交后停止，等待审阅端独立复核，不回发其他聊天、不启用自动监控或下一任务，也不默认开始返修循环。
