# 遗物查询 v1：中文与获取说明——作者交付验收

2026-10-24。人类明确批准的遗物查询v1，基线506a6cd2556c36a66828a6cd0313834cf700e6e5，初始工作区干净，工作分支codex/relic-query-v1。以下为作者实跑，交付后的独立复核另记；本轮不返回重做旧M0或扩展其他里程碑。

## 结果和资料缺口

12遗物、57奖励、72关系、24来源摘录、11地点全部保留。旧ID、英文键及全部旧关系字段逐项相同，仅为独立遗物目录添加兼容可选display/guide和共享routeRules。旧目录缺字段仍可读，未核／冲突名称不冒充已核。遗物目录版本relics.2026.10.24.1；个人模型、DB、备份格式、其他目录及依赖不变。

| 对象 | 已完成 | 保留待核 |
|---|---|---|
| 57奖励 | 56新增可追溯组合显示，福马蓝图沿用；39项新增父专名含汉字 | 17项父专名仍为上游拉丁原文，只补中文部件／类型；14个总蓝图用项目类型词，不冒称完整官方字符串 |
| 四纪元／12遗物 | 精确Intact uniqueName核对古纪／前纪／中纪／后纪，英文与编号可搜 | 名称核验不代表当前可获取 |
| 11地点名称 | 7普通节点精确关联Node，其中3个有汉字节点名、4个仍原文 | 另4航道节点中文与逐节点准入待核，不造音译 |
| 7普通地点 | 分列入口、基础模式、范围、4步骤和轮次；Tyana Pass用镜像双水晶特例 | 公开资料不是游戏亲测，账号准入未知 |
| 4航道地点 | Caches与基础模式候选分开，通用兴趣点／主任务结算说明 | 基础子模式线索、具体B表触发和部分准入待核，不称第二轮／第二箱 |
| 6共享规则 | 生存、普通防御、拦截、镜像、中断、航道额外表，stable id引用和有据特例 | 不做通用游戏算法、时间／收益／概率计算 |
| 当前获取 | 12遗物和24摘录仍全部unknown | 未实时查询轮换、账号或游戏掉落 |

逐项清单：[Audit.md](evidence/Relic_Query_v1/Audit.md)、Name_Audit.json、Era_Audit.json、Location_Audit.json、Route_Rule_Audit.json，均在evidence/Relic_Query_v1下。合成冲突／缺字段／特例夹具仅在测试，不进入真实目录。

[来源及许可](Relic_Query_v1_Sources.md)：名称取固定MIT包@wfcd/items@1.1276.31少量字段，实际输入SHA在Source_Manifest.json，版权和MIT全文已保留在根声明及应用许可汇编。npm申报gitHead可追溯但GitHub未二次核验，不宣称验证整tar包。官方补丁、支持页及社区事实分开列源，步骤独立编写；没有复制Wiki模块／正文、Tenno Hub加工实现／数据或图像，没有执行上游脚本或安装新包。

## 本地Git检查点

| 阶段 | 完整commit | 完成及验证 |
|---|---|---|
| G0 | f41ddd4f909db682bc2b8a8ddf1c7d771a393c27 | 保护快照、固定来源／许可／hash、逐项审计和规则范围 |
| G1 | f8b052ec028f5fd657c9160bbdbbc19db9e815aa | 兼容字段、验证、中文查询、12新增单元；114单元及lint/build通过 |
| G2 | 0ce219322b11b34f975f5f8e84946358271d24e5 | 中文界面、证据折叠、说明；新增5浏览器及lint/typecheck/build通过 |
| G3 | 本记录所在最终本地提交，以最终报告和git log完整hash为准 | 全量验收、保留比对、最终正常构建、README和本记录 |

main保持08fda3880f0cdd796f3b1c9e3d84032083aa0091，无推送、合并或历史改写。

## 实跑命令

证据统一docs/evidence/Relic_Query_v1。测试只在.v/rv1/app、4186、短Chrome路径.b及专用数据库执行，node_modules联接现有依赖。原app/dist在临时SW测试全过程保持G0九文件hash，全部通过后原app只做正常生产构建。没有访问真实浏览器档案或运行写回原项目的交付整理脚本。

| 命令／位置 | 退出码和实际结果 |
|---|---|
| npm.cmd run lint／隔离app | 0 |
| npm.cmd test／隔离app，非watch | 0，13文件114项通过，原102＋新增12 |
| npm.cmd run typecheck／隔离app | 0 |
| npm.cmd run build／隔离app | 0，正常生产构建 |
| npm.cmd run test:browser -- --reporter=line／隔离app | 0，53项通过，2.3分钟；原48＋新增5，原断言未改 |
| npm.cmd run build／隔离app | 0，临时SW更新测试后恢复正常内容hash构建 |
| node scripts/verify-delivery.mjs／隔离app | 0，7路线29节点87步骤30推荐关系、manifest／图标和16保护输入；17项另核 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --reporter=line／隔离app | 0，额外1项通过，4.7秒，不计正式53 |
| npm.cmd run build／原app，最终 | 0，m0-5e6434d5e1c9，base=/，正常构建 |
| verify-preservation.py Before_Final_Build／After_Final_Build | 均0，17保护输入、10旧契约、82被测文件、9产物，旧遗物图相同 |

详细命令、UTC起止及输出在Relic_Query_v1_Commands.json、Final_Quality.log、Final_App_Build_Command.json和Final_App_Build.log。Retained_Regression_Comparison.json记录原102单元／48浏览器、storage、profile模型及package／lock与原基线diff退出0；原Hex源文件及执行副本hash见Hex_Original_Input.json和Hex_Comparison.json，未改其断言，单跑后移出正式e2e。

## 验收证据

以下路径相对docs/evidence/Relic_Query_v1，Final为最终全量运行，G2_Green为先行5项。

| 验收项 | 方法与证据 |
|---|---|
| 全56项双语名称 | Final/Relic_V1_Names.json：各查中文紧凑组合与原英文共112次，反查显示名称与精确部件标识；原Relics_All_Samples仍逐条点查全部72关系 |
| 11地点、6规则 | Final/Relic_V1_Routes.json：逐条核对入口、基础模式、额外表、适用范围、4步骤及对应轮次；镜像双侧特例、中断表现、生存任务刻度、普通防御3波、航道B待核分开 |
| 缺字段／冲突／来源 | 12新增单元对照G0全部旧字段；缺可选字段正常读、悬空引用拒绝、未核／冲突名不进入已核中文搜索、缺轮次保持未知、同中文不同ID不合并 |
| 公共查询只读 | Final/Relic_V1_Readonly及原Relics_Profile_Readonly.json：显式建两档后取基线，搜索／过滤／证据展开／返回／切档前后profiles、snapshots、imports完整相同 |
| 离线关闭重开 | Final/Relic_V1_Offline及原Relics_Offline.json：确认SW控制后断网关闭页，重开/#relics，6规则、中文查询及全部12奖励表／24来源可读；不离线打开外链 |
| 桌面／360／412／横屏 | Final/Relic_V1_Layout.json和详情截图：1440×960、360×860、412×860、860×412无横向溢出；G2详情截图人工查看正文及来源换行。模拟视口不代表真机 |
| 完整业务和29／87备份 | 原ui及M1_Restore、Hex_Restore、Goals_Restore、Pilot_Restore等用例：真实下载→预览→明确新建恢复→刷新，全部业务、旧字段／未知字段及原件保留 |
| 容量／深度／失败保护 | 原backup-boundaries单元和浏览器保留：合法边界和旧档迁移完整往返；M0_Repair_R1_Backup_Failure.json证明29×100000字超限旧状态保留、不下载不假报成功；M0_Fix_Depth_Restore.json证明18层child实际下载恢复、原字节和日志时间保留；配额／revision／事务失败用例通过 |
| 原Hex独立复现 | Hex_Independent/Review_Unsaved_Facts.json：未保存4／12345草稿保留，库仍3／65000／目标5；输入与执行副本SHA一致，单独1通过 |
| 更新及中断恢复 | 原zz-update四项及其他更新回归通过；Final/M0_Update、M0_Fix_Update_Refresh/Barrier/Orphan.json：暂缓、待保存、多标签页、刷新／关闭发起页、worker会话丢失及孤立屏障，重开后明确取消并恢复可写，数据保持 |
| Windows持久化 | Final/M0_Browser.json：win32 headless Chrome156.0.8078.47，专用.b/d9ee0910真实进程关闭后按同一路径重启，IndexedDB名称恢复；不访问用户真实档案 |
| 安装性与首屏 | Final/M0_Startup.json：base及scope=/、start_url=/#tree、192／512图标、Chrome installabilityErrors为空；未操作系统安装 |
| 保护／稳定图 | Preservation_Before_Final_Build和After_Final_Build：17输入／10旧契约／82被测源码配置public e2e scripts逐字节相同，旧遗物全部字段投影相同；9产物先与G0相同，最终与隔离正常构建相同 |

## 失败记录、资源大小和未验项

G1_Red实现前11失败／1通过；G1_Spacing_Red紧凑中文查询1失败／11通过，修正后114通过。G2_Red界面实现前1项失败。G2_Initial新增离线断言误期待3个西诺斯，核对原目录实际只有下弓臂和握柄两项，校正为明确两个原稳定ID；未增加目录或修改旧断言。该轮全部用例运行到达，4项生成证据、1断言失败，收尾进程未退出，无正常套件汇总；保存日志、截图和观察记录后仅结束已核命令行的本轮隔离CLI子树。PowerShell停止接口失败也已如实记录，后使用原生进程命令；Green及最终全套允许正常子进程控制，退出0。G2_Green五项通过，最终114／53＋1通过。原始日志和工具error-context行末空白保留，不修饰原始证据。

来源下载失败、访问方式和初始映射缺项保留G0证据；Arch-Melee精确父组件补齐最后两条关联，不靠模糊名。中文终端一度乱码，实际JSON码点无替换字符，未改坏输入。没有修改系统代理、证书或网络。

最终正常build m0-5e6434d5e1c9，共9资源680164字节，较v0的636743增加43421。JS618837字节（本地gzip176469），CSS30334（gzip7283），许可17751。完整清单Relic_Query_v1_Build.json；构建工具报告的压缩大小与本地gzip算法结果分开，不混为网络实测。保持原>500kB块警告，未提高阈值掩盖，也未借此全站重构；NO_COLOR/FORCE_COLOR及npm更新提示保留，未更新依赖。只缓存应用壳与有限小目录，不缓存全量上游原始资料。

M0_Startup.json单次landingInteractiveMs=197，条件为Windows headless Chrome、localhost、无节流、新隔离会话、仅landing页，不代表遗物详情、手机、公网或性能分位数。Android真机、软键盘、真实双指／横竖屏、手机可信HTTPS安装与离线重启、Windows系统级安装、真实账号准入和游戏内掉落／规则亲测均未验。17父专名、8地点中文和航道具体触发仍有资料缺口；公开资料核对不是当前游戏亲测。

## 正常预览、复跑和停止

4194初次只读探测拒绝连接，保留Preview_Before_Normal_Build.json；只在最终正常原dist构建后启动隐藏localhost预览，未停止既有服务。Preview_Start.json及Preview.json记录PID41920、首页与build-info HTTP200、m0-5e6434d5e1c9。第一次HTTP采集误用了PowerShell保留只读变量，导致首页状态错误为0；失败输出保留Preview_First_Probe_Failed.json，改变量后重测200，没有操作应用数据库。体验地址http://127.0.0.1:4194/#relics；旧页面先处理草稿，按SW提示更新，勿清库。不同端口／浏览器档案存储隔离，迁入时先导出，再预览并明确新建恢复。

复跑从项目根运行docs/evidence/Relic_Query_v1/prepare-isolated.py（Python3），隔离node_modules仅联接现有app/node_modules。进入隔离app设置APP_TEST_PORT=4186、APP_BROWSER_PROFILE_ROOT=.b、APP_EVIDENCE_DIR和M0_EVIDENCE_DIR为新的绝对证据目录、M0_EVIDENCE_PREFIX为新前缀，再执行node scripts/run-quality.mjs。先确认端口无其他任务，不覆盖旧日志；原Hex复制／hash／单跑／移出另计。不要在提供4194的原app跑临时SW构建。

使用说明已更新app/README.md，来源与许可同步根THIRD_PARTY_NOTICES及应用全文声明。本轮无真实档案操作、公开部署、推送／main合并、第三方AI、付费或系统／网络／电源／证书修改，无原件或档案删除。最终本地提交后停止，等待审阅端独立复核，不自行开启循环返修或下一任务，不向其他聊天发送消息。
