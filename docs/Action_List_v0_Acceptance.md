# 行动清单 v0：交付与作者验收

2026-10-21。本轮已获人类批准，仅完成现有养成助手的只读行动概览，不是完整M2优化器。原基线d405b7e3712885f1796b9fc81d7d1ae3442be11b，分支codex/m2-action-list-v0。当前结果为作者在专用副本实跑；新的独立复核尚待执行。

## 交付行为

从当前档案已保存的关注、武器/安装事实、制作数量及六人组目标派生行动。每条给出目标、下一步、原因、现有地点/模式或核对入口、未知事项和现有功能链接；不注入历史账号事实。关注优先，其余目录稳定排序，默认前三条可展开全部。完成/暂缓、已确认安装的系统及已达晋升目标不重复安排，失联引用保留核对入口。海波单剑按已记录阶段打开原攻略，不补写前序任务。

复用evaluateGoal、evaluateSyndicate和currentRequirements/summarizePlans。制作与晋升共同星币用量先合计后一次抵库存，不加各项目差值。未知安装/旧目标需求在同一个currentRequirements中贡献requirementsComplete=false，不造数量；制作页、材料详情和概览共同看到不完整状态。概览只投影现有汇总行的已知缺口，其他库存未知仍单列。材料候选的核验与配方用量核验继续分开，地点可读不代表账号已解锁。

查看、排序、展开及跳转不写个人档案/快照/导入记录；没有持久化行动列表或材料快照。导航先检查未保存表单，阻止跳转并保留草稿；关注、完成、暂缓、恢复及事实仍由既有明确操作保存。跨页数据变更重算或提示冲突，旧revision拒绝覆盖。每日分钟仅展示已保存预算，未知为未填写、明确0保留，全部耗时未估。

无profile、DB、导出schema、catalog、来源/配方数值、目录范围、外部接口或依赖变更。DB/schema仍1，catalogVersion仍2026.10.21.1，仅应用内容build更新。没有收益/局数/晋升天数、遗物库、联网活动、自动扣料、自动晋升、云同步或其他里程碑。

## Git检查点

| 检查点 | 完整本地提交 | 实际内容与验证 |
|---|---|---|
| G0 | d0b1531c48127daa9736942c4f6055b71c1b28bb | 范围、17保护输入、10项目录/持久结构和原dist快照；原HEAD和干净工作区记录 |
| G1 | 2de154f5b815deb2168b0174937e7fd48aaa967b | 只读派生及同引擎未知贡献，11项新单元；原80保留，共91通过，lint/build通过 |
| G2 | f7ee1f65f73af43a5cf780493496f3a81848ac2e | 概览、原入口联动、草稿保护/跨页/切档；新增6项生产浏览器通过，91单元和lint/build通过；失败证据保留 |
| G3 | 本文件及最终证据的本地提交，完整hash见交付回复/Git日志 | 全量91单元/43正式浏览器及另计1个原独立Hex复现；正常原app构建、README/许可和本记录 |

未改写既有历史，main仍08fda3880f0cdd796f3b1c9e3d84032083aa0091；不推送、不合并。提交后工作区状态另以Git实际核对，报告不嵌入自身提交hash。

## 隔离与可复跑条件

全部开发/升级构建在忽略目录`.v/ac/app`，独立dist、4186、短Chrome目录`.b`执行；node_modules仅联接本项目已有依赖，没有安装新包。准备脚本[evidence/Action_List_v0/prepare-isolated.py](evidence/Action_List_v0/prepare-isolated.py)只复制项目文件和校验输入，不复制用户浏览器数据。新建隔离路径时需先建立指向原app/node_modules的junction；确认4186空闲。

从项目根用Python3执行准备脚本，再进入隔离app，设置以下环境后执行`node scripts/run-quality.mjs`。复跑者请改用新的证据子目录和前缀，勿覆盖本轮结果。

```powershell
$env:APP_TEST_PORT='4186'
$env:APP_BROWSER_PROFILE_ROOT='.b'
$env:APP_EVIDENCE_DIR='D:/wf/Warframe_PWA_Handoff_20261016/docs/evidence/Action_List_v0/Manual/Browser'
$env:M0_EVIDENCE_DIR='D:/wf/Warframe_PWA_Handoff_20261016/docs/evidence/Action_List_v0/Manual'
$env:M0_EVIDENCE_PREFIX='Actions_Manual'
node scripts/run-quality.mjs
```

原独立Hex复现只读复制自`C:/Users/21904/Documents/Codex/work/wfhexr1-review-ec2d919/app/e2e/review-hex-draft.spec.ts`，隔离app中临时命名e2e/_independent-hex-draft.spec.ts，单独运行后移出e2e目录，故不混入43项正式计数。源文件前/后/执行副本SHA一致，见Independent_Source_Comparison.json。没有修改审阅端work/outputs。

所有临时SW测试完成后、原app正常构建前，原dist的9文件hash仍与G0一致；74个源码/配置/测试/构建脚本输入与隔离副本一致，17保护输入、10数据契约也一致。见Preservation_Before_Final_Build.json。最后原app只运行正常build，9个产物与隔离副本最后正常构建相同，见Preservation_After_Final_Build.json。测试没有把临时actions-v1/v2或m0-v1/v2暴露给4194，不访问真实浏览器档案。

## 最终实跑命令

以下完整命令、UTC起止、退出码及stdout/stderr见[evidence/Action_List_v0/Action_List_v0_Commands.json](evidence/Action_List_v0/Action_List_v0_Commands.json)。本轮证据只写Action_List_v0新目录，保留旧交付证据。

| 命令 | 地点 | 退出码及结果 |
|---|---|---|
| npm.cmd run lint | 隔离app | 0 |
| npm.cmd test | 隔离app | 0，非watch，11文件91/91（原80+新11） |
| npm.cmd run typecheck | 隔离app | 0 |
| npm.cmd run build | 隔离app | 0，49模块 |
| npm.cmd run test:browser -- --reporter=line | 隔离app | 0，1 worker，43/43，1.8分钟（原37+新6） |
| npm.cmd run build | 隔离app | 0，测试后恢复正常内容hash版本 |
| node scripts/verify-delivery.mjs | 隔离app | 0，7路线/29节点/87步骤/30推荐关系、manifest/图标和原16保护输入；另独立核对17项 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --retries=0 --reporter=line | 隔离app，单独执行 | 0，额外1/1，3.3秒，不计入43 |
| npm.cmd run build | 原app，全部临时测试之后 | 0，build m0-8ead65550296；Final_App_Build.log及Final_App_Build_Command.json |
| verify-preservation.py Before_Final_Build / After_Final_Build | 项目根 | 均0；17输入/10契约/74测试输入及9构建文件检查通过 |

## 验收证据矩阵

路径均相对`docs/evidence/Action_List_v0/`，Final为本轮最终全量结果。

| 验收项 | 实际验证与证据 |
|---|---|
| 空档/排序/前三/展开只读 | 新单元及Final/Actions_Readonly.json；空档无历史事实，5目标按关注/目录排序，3→5→3，业务profiles/snapshots/imports逐项不变 |
| 完成/安装/阶段与待核路线 | Final/Actions_Guides.json；已完成毒囊双枪、已装大嘴不安排，海波IV定位旧攻略且无前序写入，瑶丛仍待核并可读 |
| 共享一次抵库存及未知 | 新单元及Final/Actions_Live.json；制作35000+六人组100000=135000，库存100000后共享缺35000；其他库存仍未知。数量/库存/实际等级/完成/暂缓/恢复跨页跟随，只当前下一阶 |
| 未整理/失联目标 | 新单元覆盖未知需求不完整、不造0、失联记录保留、同一孤立记录去重和明确0预算；全部汇总与同一个currentRequirements/summarizePlans深比较 |
| 草稿/旧revision/档案隔离 | Final/Actions_Draft_Protection.json；12345草稿阻止导航且保留，另一页保存后旧revision拒绝写入，显式重载才更新，空档无上档目标 |
| 完整实际下载恢复 | Final/Actions_Restore_Offline.json；实际下载→预览→确认新建→重载，除目标id/revision外全业务相同，未新增actions持久字段 |
| 原29/87及旧档 | Final/M1_Restore.json、Hex_Restore.json、Goals_Restore.json、Pilot_Restore.json；全节点/步骤、笔记、预算、库存、原日志、未知归档、原件及既有扩展字段实际下载恢复一致 |
| 容量/深度/事务与失败 | 原backup-boundaries单元和浏览器保留；Final/M0_Repair_R1_Backup_Failure.json确认29×100000字不下载、不裁剪且显式失败；M0_Fix_Depth_Restore.json深度边界及原件实际恢复。配额/revision/快照/屏障失败保留旧存盘，不假报成功 |
| 离线新概览与旧页面 | Final/Actions_Restore_Offline.json、Guides_Offline.json及各旧离线测试；确认SW控制后断网、关闭页、重新打开助手深链接，已恢复档案行动/既有指数之场材料路线可读；树/档案/备份等旧离线回归保留 |
| 更新与中断取消恢复 | 新Actions_Update.json验证未保存摘要阻止更新、取消保留、显式保存后更新保留；原zz-update四测试通过，M0_Update及M0_Fix_Update_Refresh/Barrier/Orphan.json包含刷新、关闭发起页、停worker、重开取消/恢复写入 |
| 原Hex保护 | 原4项syndicate-drafts全部通过；Independent_Extra/Review_Unsaved_Facts.json额外复现保留4/12345草稿，阻止目标写入，库存盘仍3/65000/目标5 |
| 原材料来源重算 | material-reference三项及Hex_Material_Live保留；数量/等级/目标状态跨页改变后重算或明确失效，不混旧需求与新库存；23项路线展示全部保留 |
| Windows持久化/移动视口 | Final/M0_Browser.json：Windows headless Chrome155.0.8059.80，关闭后同专用.b/bf95f4b6重启读取IndexedDB。Final/Actions_Overview_Desktop及Mobile_360/412截图，正文换行、无横向溢出；不等同Android真机 |
| manifest/小缓存 | Final/M0_Startup.json：base/scope=/、start_url=/#tree，192/512图标，Chrome安装性错误为空；缓存为本项目壳/小目录，无第三方全量原始库或运行时远程请求 |

## 失败、资源与未验证项

失败保留并区分原因。G1_Red为缺模块导致未收集，不能称11项行为红灯；随后G1_Dedup_Red一失败/10通过暴露孤立记录重复，修正后91通过。G2_Red在UI实现前找不到概览；G2_Initial为5通过/1失败，测试错误寻找单项目已满足的星币缺项入口，真正缺口来自共享合计，改为唯一共享入口核对。G2_Known_Missing_Red验证需同时显示已知共享缺项与其他未知项，补投影而非新增计算。截图发现资源ID子串先替换造成blueprint:残留，G2_Label_Red明确复现，最长ID优先转换后通过。最终G2_Final 6/6；全量43无重试掩盖失败。

最终9项资源原始合计580746字节，JS523979字节（脚本gzip159928）、CSS28093字节（gzip6909），清单见Action_List_v0_Build.json。Vite原有超过500kB块警告及NO_COLOR/FORCE_COLOR提示原样保留，没有改阈值或扩范围分包。Final/M0_Startup.json记录localhost、无节流、全新隔离会话、landing页单次交互246ms；不是手机/公网/行动页性能或分位数保证。原始.log保留工具空白格式，Git空白检查对原始日志作例外，源码/文档/JSON检查通过。

Android真机/软键盘/双指操作、手机可信HTTPS安装/离线重启、Windows系统级安装、实际游戏解锁/掉落/效率均未验证。未核路线仍待核，外部来源链接需联网。没有更改系统/网络/电源/证书、付费、第三方AI、真实用户档案或自动化；新独立复核待审阅端执行。

## 预览与停止

4194初始只读探测拒绝连接，见Preview_Initial_Probe.json；确认无响应后为最终正常dist启动隐藏的本机预览，没有停止任何旧服务。Preview.json记录127.0.0.1:4194、PID29180、首页HTTP200及build m0-8ead65550296。体验[行动清单](http://127.0.0.1:4194/#assistant)，已有该地址档案先按提示保存后更新，勿清库。不同端口/浏览器存储隔离，需要带入时先导出、预览并明确新建恢复。

使用说明见app/README.md，许可边界见THIRD_PARTY_NOTICES.md。原17项输入、原HTML/seed/交接/M0计划均保留，保护对照列出全部原/现hash。G3本地提交后停止，等待独立复核，不回发审阅聊天，不推送、合并、部署或启动后续工作。
