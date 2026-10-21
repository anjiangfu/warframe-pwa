# 材料获取指引 v1：交付验收

2026-10-21（Asia/Hong_Kong）。按2026-10-20人类批准的23项方案实施，研究于20—21日，期间环境中断一次，仅已建分支、查资料，续做先重新核对干净基线。此报告为实现端验证，新的独立复核尚待执行。没有自动循环返修权限。

## 结果和范围

现有23项资源全部有逐项审计，保留稳定ID/名称/别名与独立库存；实际使用19条获取记录（六珍品共用1条、延凡草多1备选）。普通四材料给出中文星球+节点原名+模式和动作；城市/实验室分开，六珍品随机探索、双衍具体区域及龙后开箱、星币竞技场、蓝图裂缝和成品铸造分别说明。没有新增资源/配方/装备/集团、每日推荐、遗物库或联网功能。

新增Acquisition可选verification/checkedAt，材料详情显示主要/备选、路线核验、日期、限制与链接。来源kind和路线核验独立，旧记录未填写不自动当已核。目录和个人状态分离，未加profile字段或改变Repository。配方、武器任务/安装用量、集团晋升用量、目标契约逐项与基线相同；Hex事实草稿保护不变，用户已完成的毒囊不被重新默认关注。

21项资源的路线所采用字段已对照资料；瑶丛及延凡草仍为unverified（延凡草2条路线）。这里的“已对照”不是当前游戏亲测，部分为3—4个月前社区缓存。植物Wiki有待更新提示，Soprano Springs区域中文名、当前植株分布、备选岛全部情绪表未核齐；不为了23项覆盖全部填verified。其他节点中文译名未确认时留原名，不音译。详见[23项来源表](Material_Guides_v1_Sources.md)及`Final_Catalog_Audit.json`。

DB version=1、备份schemaVersion=1，catalogVersion=2026.10.21.1，最终build=`m0-9e1b8248e612`。build前缀沿用既有机制，版本含义互不替代。原7路线/29节点/87步骤/30推荐边及origin不变，17保护文件hash全部相同。

## Git检查点

开工基线`ec2d9194b46efac01fafd75a37e1169726a3e7f9`，分支`codex/m1-material-guides-v1`；main保持`08fda3880f0cdd796f3b1c9e3d84032083aa0091`。没有推送、合并、历史改写或公开部署。

| 检查点 | 完整hash | 内容和实际验证 |
|---|---|---|
| G0 | c592a3c46f19710712d5e5c33f8c39ca532ddf7d | 来源/计划、23身份与业务契约快照、17hash及原dist快照，尚未改应用 |
| G1 | a01f86c4688a599fcbb3d6b816b57c0732eeae14 | 获取资料/类型/校验；80/80单元、lint/typecheck/隔离build通过 |
| G2 | a98b32e08749b976ff0ab531621ff72f2685aee5 | 共享详情核验/备选展示、4项新浏览器测试；连同2项旧武器用例6/6通过，lint及隔离build通过，截图已查看 |
| G3 | 最终回复与Git日志给出hash | 全部正式回归、独立旧复现、保护与副本一致性、正式构建、使用/许可与本记录；提交前核对diff |

## 测试隔离及复跑

所有开发构建和升级测试在`.v/mg/app`进行，独立dist、4186和Chrome短测试目录。node_modules仅联接原已安装依赖，未重新安装或增加依赖。准备脚本只复制本项目自己的源码、原校验输入及业务契约，不复制真实浏览器资料；`.v`忽略不提交。

在项目根目录用本机Python运行`docs/evidence/Material_Guides_v1/prepare-isolated.py`，仅首次创建依赖目录联接：

```powershell
Set-Location 'D:\wf\Warframe_PWA_Handoff_20261016'
& 'C:/Users/21904/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' docs/evidence/Material_Guides_v1/prepare-isolated.py
if (-not (Test-Path -LiteralPath '.v/mg/app/node_modules')) {
  New-Item -ItemType Junction -Path '.v/mg/app/node_modules' -Target 'D:/wf/Warframe_PWA_Handoff_20261016/app/node_modules'
}
Set-Location '.v/mg/app'
$env:APP_TEST_PORT='4186'
$env:APP_BROWSER_PROFILE_ROOT='.b'
$env:APP_EVIDENCE_DIR='D:/wf/Warframe_PWA_Handoff_20261016/docs/evidence/Material_Guides_v1/Manual'
$env:M0_EVIDENCE_DIR=$env:APP_EVIDENCE_DIR
$env:M0_EVIDENCE_PREFIX='Material_Guides_v1_Manual'
node scripts/run-quality.mjs
```

先确认4186空闲；不要停止4194或其他既有服务来腾位置。测试最后在副本恢复正常build。若复制过临时审阅复现文件，必须移出副本e2e后再跑正式全套，避免多算。只有全部通过并核对源码副本后，才在原app运行正常`npm.cmd run build`，不在原app执行会重建临时SW版本的全套浏览器测试。

`Isolation_Proof.json`证明71个应用构建/测试输入源文件与副本hash相同，原app/dist的9个文件在**全部测试前后**与G0快照完全一致，临时m0-v1/v2与hex-draft-v1/v2仅位于副本。随后原app正常正式build成功；`Final_Delivery_Build.json`证明最终原dist与测试后正常副本逐文件相同。没有将临时SW版本暴露给4194。

## 最终实跑

完整命令原输出、时间、退出码见`Material_Guides_v1_Commands.json`，APP_EVIDENCE_DIR为本轮`Final`、M0_EVIDENCE_DIR为本轮根前缀。

| 命令 | 位置 | 退出码/结果 |
|---|---|---|
| npm.cmd run lint | 隔离app | 0 |
| npm.cmd test | 隔离app | 0，非watch，10文件80/80；原73+新增7 |
| npm.cmd run typecheck | 隔离app | 0 |
| npm.cmd run build | 隔离app | 0，47模块 |
| npm.cmd run test:browser -- --reporter=line | 隔离app | 0，1 worker，37/37，约1.5分钟；原33+新增4 |
| npm.cmd run build | 隔离app | 0，恢复正常内容hash构建 |
| node scripts/verify-delivery.mjs | 隔离app | 0，原7/29/87/30及既有16保护输入；另独立17hash核对 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --reporter=line | 隔离app、单独执行 | 0，额外1/1，3.4秒；不算正式原第34项，也不计入37 |
| npm.cmd run build | 原app、最后 | 0，最终m0-9e1b8248e612，日志及命令记录为Final_App_Build* |

原33项保留，只有原weapon-assistant两个用例中的3处已修订地点文案断言改为新的完整地点；延凡草一处拆成主要及备选两个精确可见断言，没有删除/放宽原进度、库存、离线、失败、备份断言。额外审阅复现从只读路径复制到隔离副本单独执行，原源文件SHA前后一致，未修改审阅端work/outputs。

## 证据矩阵

| 项目 | 实际证据 |
|---|---|
| 23项逐项展示与无档只读 | Final/Guides_23_Audit.json；逐个打开23项，主要/备选、状态、日期、地点/模式、来源href均对应目录，查询前后profiles/snapshots/imports不变 |
| 多入口一致 | Final/Guides_Entry_Consistency.json；搜索/制作/集团同一星币获取内容，材料搜索与武器助手同一瑶丛内容；导航查询全部业务数据不变 |
| 待核/普通/城市/蓝图/成品 | 新7单元和逐23浏览器回归共同覆盖，身份/业务契约与基线一致，取得资料可信度不改变配方用量可信度和缺口结果 |
| 植物备选离线 | Final/Guides_Offline.json/.png；确认SW控制后断网、关闭页面、新页重开材料深链接，Archarbor/Amphitheater两待核路线仍可读且不写档案 |
| 桌面/360/412/横屏 | Final/Guides_Desktop、Guides_Mobile_360/412.png；G2同构建截图已查看，正文和来源换行，无横向溢出；不称Android真机 |
| 浏览器持久化 | Final/M0_Browser.json；Windows headless Chrome155.0.8059.80，真实关闭后重开隔离目录`.v/mg/app/.b/2dcacaba`恢复IndexedDB |
| 旧完整备份/原件 | Final/M1_Restore.json、Hex_Restore.json、Pilot_Restore.json及原ui恢复用例；实际下载、预览、新建恢复、刷新后全业务相同，原29/87、未知字段、原件及新状态保留 |
| 容量/深度与保存失败 | 原backup-boundaries及全部单元通过；超限不假报导出成功、不裁剪，配额/revision/写屏障失败保留存盘状态 |
| 材料来源重算 | 原material-reference三测试及Hex_Material_Live通过；目标数量/等级/状态、库存跨页改变跟随或明确失效，不混旧用量与新库存 |
| Hex草稿 | 原4个syndicate-drafts全部通过；额外Independent_Extra/Review_Unsaved_Facts.json保留4/12345草稿与复核、阻止目标写入，存盘仍3/65000/目标5 |
| 离线和安全更新 | 原树/档案/备份/各功能离线与zz-update四测试全部通过，Final/M0_Update及M0_Fix_Update_Refresh/Barrier/Orphan：刷新/关闭发起页、停worker/重开后可取消恢复写入，数据保留 |
| manifest/缓存 | Final/M0_Startup.json：start_url=/#tree、scope=/、base=/、192/512图标，Chrome安装性错误空；不等于OS安装实操。无第三方整库/原始图片或运行时远程请求 |

## 失败、警告及限制

失败均保留，没有以重试掩盖：G1_Red为4失败/3通过，缺路线核验/具体地点/验证能力；G1_Initial为79通过/1失败，测试夹具只赋verified却未清除已有日期，修正为显式undefined后80通过。G2_Setup_Failure是测试加载LocalProvider触发Node JSON导入属性错误、未收集用例，改为测试端读取本地JSON后G2_Red正确复现缺“主要方式”。G2_Initial为4通过/2失败：测试没有显式选择武器目标，及遗漏同步苦栓旧地点断言；修正测试准备/精确文案后6通过。没有以改变产品默认目标来迎合测试。

Jina读取SEC_E_NO_CREDENTIALS，未更改网络/证书；官方与社区直开/缓存限制写在来源表。续做4194只读探测拒绝连接，未停止/重启未知旧进程。工具NO_COLOR/FORCE_COLOR提示及Vite超过500kB块警告原样保留；没有调大阈值隐藏，也未超范围重构分包。原始.log保留测试工具行末空白，Git空白检查对日志作例外，其余文件检查通过。

最终总原始568146字节，JS512510字节（脚本gzip156730）、CSS26962字节（gzip6689）；比前版增加约21kB的小型本地资料与展示，没有整库。Final/M0_Startup记录localhost、无节流、全新隔离会话单次landing交互257ms；不是手机/公网/材料页性能或分位数保证。

Android真机/系统键盘/双指、手机可信HTTPS安装与离线重启、Windows系统安装UI、实际游戏节点/资源/效率仍未验证；新的独立复核尚待执行。资料日期不能代替游戏实测，外部来源链接需联网，当前账号解锁始终手工核对。没有新依赖、系统设置、网络电源证书、付费、第三方AI或自动化。

## 交付与停止

17原输入最终hash在Protected_Inputs_Final.json，全部一致；旧报告和证据目录不覆盖，原HTML、seed、交接文档/M0计划不改。使用说明在app/README.md，少量事实归属与许可边界见根THIRD_PARTY_NOTICES.md。

最终发现4194空闲后启动新的正常预览，未停止任何旧服务：仅绑定127.0.0.1、PID24884，首页/构建信息HTTP200，build m0-9e1b8248e612，见Preview.json。体验`http://127.0.0.1:4194/#materials`，已有该地址档案按SW提示保存后更新；不碰真实浏览器数据库，不换origin迁移或清库。本机localhost不是公开部署。

G3本地独立提交后停止，完整commit hash在最终回复和Git日志读取，避免报告自引用。不回发审阅聊天，不启用监控或继续后续阶段；待审阅端独立复核或新授权。
