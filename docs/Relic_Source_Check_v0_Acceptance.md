# 遗物来源时效核验 v0——作者交付验收

2026-10-26完成同范围续工。原人类批准任务始于2026-10-25，基线7f88678ac90a6028ef850a84cf52fe338f6d2c15，初始工作区干净，工作分支codex/relic-source-check-v0。原轮次额度中断不算交付；续工从90df66c08e84aa88b0434537add6b4c4c47aacf2核对并完整保留G0／G1、未提交G2和全部证据，没有从旧基线重做。以下为作者实际运行，交付后独立复核另计。

## 交付事实与语义

原31遗物／117奖励／186关系／62来源／11地点／6规则、名称、稳定ID、奖励事实及v2原JSON逐字节不变；没有扩容或改个人模型／IndexedDB／备份格式。新增独立附件relic-source-checks.v1.json，checkVersion=relic-checks.2026.10.25.1，通过LocalProvider冻结只读提供，使用现有acquisition.id关联。

作者2026-10-25实际新取得官方原文，4,484,205字节，SHA256：c31c421954adbd46ec962d40f71d7e7360df3248bd43ce8885d89b7375ddd3d9；与预查固定原文字节一致。页面发布日2026-10-22；取得时间2026-10-25T12:52:34.735535+00:00，首次独立核对2026-10-25T12:56:10.820837+00:00。续工／测试日期2026-10-26没有改写保存记录，三类时间不混用。

只核任务获取奖励missionRewards段，精确到星球／节点／表类别／Rotation／英文遗物。作者独立HTMLParser审计和另行实现的匹配工具均核62条：listed=62、not-listed=0、conflicting=0、unverified=0。完整逐条定位见[Audit.md](evidence/Relic_Source_Check_v0/Audit.md)及Author_Audit.json；未用审阅端匹配程序。解析标题块443包含Recall非地点标题和重复Event，436为不同地点标题，不是新增目录范围。

listed仅代表所保存官方表列出；not-listed仅在对应表及非空轮次读取成功而确无精确行时成立，不代表不能获取。缺段／标题／轮次、网络或解析失败、缺日期均待核，重复标题／行记冲突；不借relicRewards同名证明获取。全部原availability仍unknown、sourceScope partial，账号解锁及游戏掉落未实测。四Caches的额外B表具体触发、入口／基础模式待核不升级，B不解释为第二箱／轮；Tyana Pass的Defense只作原表定位，镜像防御特例保留。

中文卡片展示发布日期、核对日、取得时刻、原文定位／hash、官方原文和免责声明，明确非实时／后续更新未核。四种只读筛选为全部、所查官方表列出、本次表未列出、待核或有冲突；遗物至少一条摘录符合才入选，反查及详情一致。无附件／根字段缺失仍能查询旧目录，缺日期／不完整证据不默认listed；空筛选不代表游戏不存在。未加入自动刷新、后台、通知、库存、收藏、目标、历史、概率／收益计算或游戏账号读取。

## 来源与许可归属

[Sources](Relic_Source_Check_v0_Sources.md)和Access_Attempts／Input_Comparison保存URL、实际访问、响应日期／Last-Modified、原文新旧hash；原文在忽略目录.v/rs-source，未进入应用、Git或SW缓存。只摘62条必要事实及定位／归属，未复制官方实现／正文／样式／图像，未用WFCD MIT概括官方页面许可。应用卡片保留Digital Extremes官方PC表与免责声明链接；原第三方依赖及许可全文保持，无新增包。

论坛Jina读取虽HTTP200但内容是安全验证页，不能算免责声明正文成功；该510字节响应及hash保留，随后官方网页读取工具核对免责声明，并与官方表前言交叉确认。未绕过验证、登录或改网络。全表不保证完备、也不是每次热修发布的限制采用独立中文表述，不引述大段正文。

tools/relic-source-check-v0的Node工具只读固定本地文件，先验hash，限定任务段，不执行HTML／脚本；生成与G0独立审计逐条比较，同输入两次序列化字节相同。原v2七转换测试与其输出也逐字节重现。所有合成故障仅在测试内存，不进入真实附件。用法见[工具说明](../tools/relic-source-check-v0/README.md)。

## 本地Git检查点

| 阶段 | 完整commit | 完成及验证 |
|---|---|---|
| G0 | 42eadbdb11bbff527feb02cd0917488a46da1c89 | 固定新原文／归属／hash、独立62审计、保护及设计 |
| G1 | 90df66c08e84aa88b0434537add6b4c4c47aacf2 | 独立附件、严格匹配、Provider、日期及身份守卫；133单元、10匹配、7转换及lint/typecheck/build通过 |
| G2 | 391f25f409c6b3c76a542148db0abf8bbed009a7 | 日期卡片、筛选、缺附件兼容；136单元，旧13＋新4浏览器通过；续工新4及质量命令再次退出0 |
| G3 | 本验收记录所在最终本地提交，以最终报告及git log完整hash为准 | 全量验收、旧输入／业务比对、最终正常构建、使用说明及限制 |

main保持08fda3880f0cdd796f3b1c9e3d84032083aa0091，无推送、合并或历史改写。

## 作者最终实跑

测试全部在.v/rs/app、专用4186／短Chrome路径.b／测试数据库进行，node_modules只联接现有依赖，不安装。临时SW构建未进入原dist或4194；原9产物在全过程等于G0快照，全量通过后原app才做正常生产构建。证据统一docs/evidence/Relic_Source_Check_v0，不覆盖前轮或审阅端记录。

| 命令／位置 | 退出码与实际结果 |
|---|---|
| npm.cmd run lint／隔离app | 0 |
| npm.cmd test／隔离app，非watch | 0，16文件136项；原120＋新增16 |
| npm.cmd run typecheck／隔离app | 0 |
| npm.cmd run build／隔离app，浏览器前 | 0 |
| npm.cmd run test:browser -- --reporter=line／隔离app | 0，60项通过，2.7分钟；原56＋新4，零重试 |
| npm.cmd run build／隔离app，浏览器后 | 0，恢复正常内容hash构建 |
| node scripts/verify-delivery.mjs／隔离app | 0，原7／29／87／30、manifest图标及16保护输入；17项另核 |
| node --test tools/relic-source-check-v0/match.test.mjs／项目根 | 0，匹配10项，另计 |
| node --test tools/relic-query-v2/convert.test.mjs／项目根 | 0，原转换7项，另计 |
| npm.cmd run test:browser -- e2e/_independent-hex-draft.spec.ts --reporter=line／隔离app单独 | 0，额外1项，4.4秒，不计正式60 |
| 两组工具生成检查副本／项目根 | 均0，原v2目录与新附件均字节一致 |
| npm.cmd run build／原app，最终正常构建 | 0，m0-1e6dc59278e0，base=/ |
| verify-preservation.py Before_Final_Build／After_Final_Build | 均0，17输入／11旧契约／90被测文件／9产物与旧遗物全部记录保持 |

完整命令、UTC起止、退出码与输出见Relic_Source_Check_v0_Commands.json、Final_Quality.log、Final_Tool_Commands.json、Final_App_Build_Command.json及对应原日志。Hex输入和执行副本hash前后相同，单跑后移出正式e2e；Final_Input_Integrity记录原文、原v2目录及新附件的最终sha和生成比对。Retained_Regression_Comparison.json确认原120单元／56浏览器、storage、profile模型、原遗物JSON、package／lock／scripts及原v2工具diff退出0；本轮没有修改旧断言、用例或超时。

## 验收证据

以下路径相对本轮证据目录；Final为2026-10-26完整最终运行。原测试沿用其证据文件名，写入本轮独立目录，没有覆盖旧记录。

| 验收项 | 方法与证据 |
|---|---|
| 62实际行与定位 | G0 Author_Audit独立HTMLParser；匹配10测试逐条比较标题／轮次／英文；Final/Source_Check_All_62.json浏览器逐31详情检查全部62卡片、日期、hash及原文链接，当前可获取仍未知 |
| 四态与故障 | 工具10测试和新领域13单元覆盖真正缺行、缺段／表／轮次、奖励段假命中、网络／解析／未知实体失败、重复标题／行、缺日期、错hash／日历／时间格式、版本／PC范围不符、无附件、失去引用和重复ID；合成记录只在测试内存 |
| 缺附件兼容 | 新UI3单元实际静态渲染无附件／缺根列表／缺核对日期及旧2020日期；Provider传null或缺根字段返回无附件且原目录相同，页面明确未附记录／待核，不改成listed或今天日期 |
| 筛选／正反查／返回／切档 | Final/Source_Check_Readonly.json：全部／listed为31，pending／not-listed为0并说明是当前筛选无匹配；原单份福马反查再回原遗物，日期与证据一致；显式创建两测试档后取基线，全部操作后profiles／snapshots／imports完整相同 |
| 全31离线 | Final/Source_Check_Offline.json：确认SW控制后模拟断网，关闭页并重开/#relics，62条保存记录日期不变、筛选可用；原Relic_V2_Offline仍查31六奖励／62摘录，外链未离线打开，不自动联网核验 |
| 视口和模式边界 | Final/Source_Check_Layout.json及Source_Check_Card_360/412/860.png：桌面1440×960、360×860、412×860、860×412无横向溢出；已查看最终360原分辨率图，长hash／标题／日期换行、Caches警告可读；Tyana实际镜像说明和Defense原表定位分开。均为桌面模拟，不是真机 |
| 原完整业务恢复 | 原ui、M1_Restore、Hex_Restore、Goals_Restore、Pilot_Restore等：实际下载→预览→明确新建恢复→刷新，原29节点87步骤及全部业务、未知字段与旧原件保持，无核验记录写入个人备份 |
| 容量／深度／事务／配额／revision | 原backup-boundaries及safety回归保留；Final/M0_Repair_R1_Backup_Failure：29×100000中文字旧超限状态保留，下载0，明确失败；M0_Fix_Depth_Restore：18层child实际导出恢复、原字节和日志时间保留；事务、快照、revision、配额失败不假报成功，跨档隔离保持 |
| Hex／材料／草稿 | 全部旧正式回归保留；Hex_Independent/Review_Unsaved_Facts额外复现保留4／12345草稿，库仍3／65000／目标5，原输入SHA一致；材料共享库存重算和事实／目标分开保护不退步 |
| 更新及写屏障恢复 | 原zz-update四项与其他更新回归全部通过；Final/M0_Update、M0_Fix_Update_Refresh/Barrier/Orphan：暂缓、待保存、多标签页、刷新／关闭发起页、worker会话丢失与孤立屏障，重开后明确取消并恢复写入、数据保持 |
| Windows浏览器与PWA | Final/M0_Browser：win32 headless Chrome156.0.8078.47，专用.b/69d80dc9真实关闭进程后同路径重启恢复IndexedDB；M0_Startup检查base及scope=/、start_url=/#tree、192／512图标、installabilityErrors为空，没有操作系统安装 |
| 保护与原产物 | Preservation_Before_Final_Build／After_Final_Build：17输入、含原遗物JSON的11旧契约、90被测源／配置／public／测试／scripts一致；原9产物在临时测试期间等于G0，最后等于隔离正常构建9产物 |

## 失败、修正及历史边界

G1_Matcher_Red和G1_App_Red为实现前缺模块退出1；G1_Date_Guard_Red为1失败／12通过，证明坏hash、错误日历或日期代替时刻不能接受为listed，修正守卫后通过。G2_Red在卡片接入前1浏览器失败；G2_Missing_List_Red为1失败／2通过，缺根列表曾触发find异常，后返回未附记录；G2_Provider_Absent_Red为1失败／12通过，原Provider尚未支持显式无附件，后增加可选输入与缺根字段兼容。原日志和上下文保留，G2_Initial的旧13＋新4共17通过，最终G2与续工四项均通过；G3最终136／60＋10／7／1均退出0。

原轮次额度中断保留停点，2026-10-26核对HEAD和未提交内容后续工，不把先前进度当最终验收。续工README补记首次因上下文行不符未应用，按真实末行修正，没有覆盖原文档。论坛Jina安全页和实际正文读取方法分开记录；新原文与预查字节一致，不将HTTP200安全页误当正文证据。

v2审阅曾出现一次actions.spec.ts的SW就绪超时，随后原用例与全套通过，原因未知。本轮旧用例与超时均未改，完整60项未复现该失败；不将此称为修复或扩大为PWA返修。所有工具原始日志／error-context行末空白保留，不修饰失败证据。

## 包体与未验项

最终正常build m0-1e6dc59278e0，共9资源788929字节，相比v2的761960增加26969。JS727083字节（本地gzip189922），CSS30853（gzip7358），许可17751；完整清单Relic_Source_Check_v0_Build.json。保持>500kB块警告，未提高阈值掩盖，也未借机全站重构。只缓存壳和必要静态事实；4,484,205字节官方整页未打包、未缓存。构建工具压缩报告和本地gzip结果分开，不当网络实测；NO_COLOR/FORCE_COLOR和npm更新提示原样保留，未更新依赖。

M0_Startup单次landingInteractiveMs=225，条件为Windows headless Chrome、localhost生产预览、无节流、新隔离会话、仅landing页；不是遗物详情／手机／公网或性能分位数保证。Android真机／软键盘／实际双指与横竖屏、手机可信HTTPS安装和已安装应用离线重启、Windows系统级安装、真实账号准入、当前游戏掉落／规则／效率均未验。

虽然62条所查表列出，游戏内当前可获取仍全部未知。四航道具体触发／部分准入、旧名称资料中的31项拉丁父专名和8地点中文等旧缺口未因本轮核验升级。2026-10-25之后官方页是否改变、本次保存表是否完备均未声称确认。

## 正常预览与停止

4194只读初探拒绝连接，保留Preview_Before_Normal_Build；最终正常构建且九产物比对一致后，仅启动隐藏localhost预览，未停止任何旧服务。Preview_Start及Preview.json记录PID3780、首页和build-info HTTP200、m0-1e6dc59278e0；只读HTTP检查未浏览或修改真实档案。体验http://127.0.0.1:4194/#relics，旧页面先处理草稿，按SW提示更新，勿清库。跨origin迁入仍须导出、预览并明确新建恢复。

使用与隔离复跑步骤见app/README.md及工具README；重复验证使用新证据目录和前缀，不覆盖旧日志或在原app跑临时SW构建。许可／归属补记在THIRD_PARTY_NOTICES，原许可正文保持。本轮仅本地提交，无推送／main合并／公开部署／付费／第三方AI／系统网络电源证书修改／真实档案操作或原件删除。

最终本地提交后停止，等待审阅端独立复核；没有循环返修、自动续工或下一任务授权，不创建新开发聊天，不向其他聊天发送消息。
