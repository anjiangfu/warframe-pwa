# Prime 装备部件导航 v0：作者交付验收

2026-10-26，Asia/Hong_Kong。当前任务是已批准的35组Prime装备部件只读导航。纠偏起点 `f3c07241f4092398f108e36b8848e7acc0b410da`，应用基线 `7cc1e17279217f81fb781e75444cb90ac2f55022`。上一轮误做M0验收的提交和证据原样保留，本轮实际交付了应用代码、数据附件、工具及新测试。分支 `codex/prime-equipment-nav-v0`；仅本地提交，未推送、合并main、公开部署或进入下一里程碑。此报告是作者实跑，交付后等待审阅端独立复核。

## 实现和使用

“虚空遗物”→“按装备找部件”：35个父装备、115种关联奖励。可用固定中文／英文搜索；9个父装备中文专名仍待核，保留原文提示。单份与两份福马保留原奖励入口，不归Prime装备。点击关联蓝图／部件／成品物品进入原奖励反查，再进入原遗物、地点、保存的来源核验；“返回装备关联奖励”保留查询、筛选和出处展开状态。状态只在当前页面内存，刷新后不保留查询历史。

每组显示未筛总数N／筛选后M，均为本目录奖励种类，不是完整制作配方／全套清单或制作数量。某组至少一项关联奖励存在符合核验筛选的遗物时入选。无结果不推断游戏不存在或不能获取。availability仍unknown，sourceScope仍partial，listed只指保存的表行；Caches B触发／入口模式待核和Tyana特例不变。没有新增个人库存、目标、收藏、配方、概率、收益、联网刷新或账号功能。

LocalProvider实际提供20,522字节的版本化小附件；精确关联由原奖励父／组件ID与本轮元数据派生。父uniqueName身份稳定，原reward ID不变。没有附件、旧目录、缺字段或冲突时装备入口明确不可用，原交互查询仍可用。正常生产包不含原始上游大文件或合成测试入口。

当前本地正常预览：[http://127.0.0.1:4194/#relics](http://127.0.0.1:4194/#relics)，HTTP200，build `m0-745511b205b8`。原4194探测时连接拒绝，保留初次记录后启动了仅绑定127.0.0.1的隐藏预览PID19288，未停止其他服务。重新启动：

```powershell
Set-Location D:\wf\Warframe_PWA_Handoff_20261016\app
npm.cmd run build
npm.cmd run preview -- --port 4194
```

若已有服务请使用该地址，不重复启动或停止未知程序。更换地址会形成不同浏览器存储。更新按原提示保存后确认，不清理用户数据。

## G0—G3 检查点

| 检查点 | 本地提交 | 完成与实际验证 |
|---|---|---|
| G0 | 2935ea23336052ce7f220378f94b3ae4b7e3154e | 独立先重算35/115/9，再与批准预查完全比对；固定8项输入hash，双向父components／组件parentUniqueNames；设计和范围记录。 |
| G1 | 6fd22c89e3b70d82f9a7210063c135699dbac65a | 小元数据、Provider、纯分组／搜索／来源筛选和故障处理；15项单测、lint、typecheck退出0。 |
| G2 | 9d7466b4e3d38824f824d123d58c1070117bfdf6 | 中文实际页面、原反查返回链、合成浏览器夹具；16单测、lint/typecheck/build及5项新生产浏览器通过。 |
| G3 | 本报告所在最终提交，以交付回复/git log完整hash为准 | 加强115项实际点击和全部反查集合逐项比较；最终152单测、65正式浏览器、额外Hex1、匹配10、转换7；普通生产构建、完整性、许可/用法/本报告。 |

## 本轮新功能证据

| 场景 | 结果与证据 |
|---|---|
| 全35组与115奖励 | 每父中文及英文实际搜索，精确父ID、奖励ID、名称逐项核对；显示类型沿用原奖励，蓝图／部件／成品分列。115个按钮全部实际点击，原反查遗物集合逐项相等，再返回原装备。[记录](evidence/Prime_Equipment_Nav_v0/Final/Prime_All_Groups.json)。 |
| 原链与上下文 | 伯斯顿Prime四项关联→原反查→原六奖励遗物表→地点与2026-10-25保存核验→返回，原查询“伯斯顿”和展开状态保持。[桌面截图](evidence/Prime_Equipment_Nav_v0/Final/Prime_Desktop.png)。 |
| 过滤N/M与降级 | 正式目录listed全部匹配，not-listed无结果有范围提示；独立合成夹具N=2/M=1只显示1种奖励。缺附件／旧目录／冲突夹具中原31遗物按钮可点击并打开原详情，装备入口明确无分组。[记录](evidence/Prime_Equipment_Nav_v0/Final/Prime_Synthetic_Faults.json)。合成事实不写发布目录。 |
| 无档案、两档只读 | 无个人档案全量查询；另先建立两个专用测试档案，对查询/筛选/展开/反查/返回/切档前后profiles、snapshots、imports完整数组比较相等。[记录](evidence/Prime_Equipment_Nav_v0/Final/Prime_Readonly.json)。 |
| 离线与布局 | 确认SW控制→断网关页→#relics重开，35组可查、保存日期不变。360、412竖屏及860×412横屏无横向溢出，长名和范围提示可见；仅桌面模拟。[记录及截图](evidence/Prime_Equipment_Nav_v0/Final/Prime_Offline.json)。 |
| 新纯逻辑16项 | 原始35/115审计oracle逐项比较、9待核名、双语搜索、福马排除、来源筛选；独立合成缺附件/旧目录/缺字段/重复父与组件/错父/缺组件/未知类型/缺身份/未核与冲突身份/重复奖励/缺来源/缺名，以及普通Prime奖励不得冒充排除福马。 |

完整35组有限清单、来源边界和许可见 [Sources](Prime_Equipment_Nav_v0_Sources.md)；每父稳定ID、115条原reward与component ID在 [Author_Audit.json](evidence/Prime_Equipment_Nav_v0/Author_Audit.json)。没有复制外部实现或调用第三方AI，没有新增或更新依赖。

## 最终实跑命令

隔离副本 `.v/pg/app`；锁文件与根目录一致，复用已有node_modules；专用端口4189、短Chrome profile `.v/pg/app/.b/`，使用Windows真实Chrome156.0.8078.47 headless。完整命令、UTC起止时间及stdout/stderr见 [Final_Recheck_Commands.json](evidence/Prime_Equipment_Nav_v0/Final_Recheck_Commands.json)。

| 命令 | 退出码 | 实际结果 |
|---|---|---|
| npm.cmd run lint | 0 | ESLint通过 |
| npm.cmd test | 0 | 非watch；17文件，152/152＝原136＋新16 |
| npm.cmd run typecheck | 0 | TypeScript通过 |
| npm.cmd run build | 0 | 生产构建，59模块 |
| npm.cmd run test:browser -- --reporter=line | 0 | 正式65/65＝原60＋新5，2.9分钟；旧断言/超时不变 |
| npm.cmd run build（测试后） | 0 | 移除测试更新build与测试夹具，恢复正常生产产物 |
| node scripts/verify-delivery.mjs | 0 | 原始输入、7/29/87/30、manifest/base/图标/资源检查通过 |
| npm.cmd run build（最后在根app） | 0 | 普通交付构建，和隔离副本9个生产文件逐字节相同 |
| node --test tools/relic-source-check-v0/match.test.mjs | 0 | 原10/10 |
| node --test tools/relic-query-v2/convert.test.mjs | 0 | 原7/7 |
| 原v2转换／来源核验生成／本轮元数据生成 | 均0 | 三产物hash分别与发布文件完全一致，不改原件 |
| npm.cmd run test:browser -- _independent-hex-draft.spec.ts --reporter=line | 0 | 独立原Hex草稿用例1/1，4.2秒；源/副本hash一致，随后移出正式用例目录，未混入65 |

[工具日志](evidence/Prime_Equipment_Nav_v0/Tools_Commands.json)、[三个字节复现](evidence/Prime_Equipment_Nav_v0/Reproducibility.json)、[Hex记录](evidence/Prime_Equipment_Nav_v0/Hex_Commands.json)、[根正常构建](evidence/Prime_Equipment_Nav_v0/Root_Build.json)。本轮重点截图与M0回归元数据在Final目录，其他未改功能的完整截图留忽略目录 `.v/pg/final-recheck-browser/`，完整65项结果在命令日志，未覆盖旧证据。

## 旧契约与数据保护回归

原136单元和60正式浏览器保留；没有编辑任何旧测试文件。原U01—U10的16项与容量/深度8项覆盖29节点/87步骤、日志/未知字段/原件、显式0、取消、配额/事务失败、revision冲突及完整恢复。生产浏览器实际下载→预览→明确新建恢复→刷新；关闭Chrome后用相同专用profile重启恢复IndexedDB；离线关页/深链接；更新v1→v2、暂缓、待保存、刷新/关闭发起页、丢失worker及孤立屏障后的明确取消和继续写入全部通过。Hex草稿、跨档隔离、材料随输入重算等既有场景同时通过。这些是回归，不冒充35组新功能覆盖。

[Integrity_Final.json](evidence/Prime_Equipment_Nav_v0/Integrity_Final.json)：17保护输入、11旧契约和额外来源核验附件共12项全部hash保持；94个旧app文件中89个原字节不变，另5个是授权的Provider、App接线、遗物页面、CSS和使用说明。profile模型、DB、备份、迁移、原目录以及全部旧测试均原字节保留。原31遗物/117奖励/186关系/62来源/11地点/6规则及旧29/87未改。

## 首次失败与执行偏差

1. G1初始缺功能红灯14失败/1通过，后实现15项全通过；原始日志 [G1_Red.json](evidence/Prime_Equipment_Nav_v0/G1_Red.json)。G2缺入口红灯实际等待“按装备找部件”失败，[日志与截图](evidence/Prime_Equipment_Nav_v0/G2_Red/Browser.json)保留。
2. G2首轮4/5：新两档夹具错误地把禁用“尚未创建”option当档案ID，选择空值超时。修为只等待/读取非禁用的两个真实option，原产品不改；[首轮日志](evidence/Prime_Equipment_Nav_v0/G2_Commands.json)、G2_First_Failure及5/5复跑记录保留。
3. 首轮完整152单测通过、浏览器64/65；旧actions.spec.ts:55等待SW首次接管5000ms超时，发生在更新前。本轮新5项、M0更新恢复均通过。[首轮完整日志](evidence/Prime_Equipment_Nav_v0/Final_Commands.json)及Final_First_Failure保留。相同代码/断言/端口/短路径、无测试重试，随后完整65/65；原因仍未知，不宣称修复该历史波动。
4. **隔离执行失误：** G1第一次红灯误在根app运行。现有Vite插件closeBundle在Vitest服务关闭时也写dist，导致根dist/build-info.json及sw.js刷新。该单测无真实浏览器/数据库操作。发现后从已验证逐字节相同的旧正常构建仅恢复这两文件，9文件复核全部恢复；其后测试均隔离，最后才执行授权的正常根build。[修改前后hash及恢复来源](evidence/Prime_Equipment_Nav_v0/Root_Dist_Incident.json)、[交付前9文件复核](evidence/Prime_Equipment_Nav_v0/Integrity_Before_Delivery.json)。这是作者执行偏差，不能报告成根dist全过程未触碰；也不是旧SW超时的原因证明。未改Vite插件或扩大为M0重构。
5. G0基线记录一次内联命令变量遮蔽ReferenceError，第一次Git检查点未产生提交；更正后才完成G0。35组文档表格一次Windows嵌套引号导致Python SyntaxError，改为本地脚本后生成。属于工具调用纠正，不计入产品测试。自动生成失败上下文的尾空白保留原字节，只将原始error-context.md排除于提交格式检查。

## 交付产物和待验

正常build `m0-745511b205b8`，base `/`，9文件合计811,044字节，较基线788,929增加22,115字节。JS748,824字节（gzip194,574），CSS31,227（gzip7,437）；小元数据原JSON20,522字节。仍有既有单JS超过500kB警告，本轮不扩为拆包重构。缓存7项应用壳，目录在本地JS内，没有整套上游资料或test-fixtures。根产物与最后隔离正常产物hash一致。

启动实测为Windows本机、真实headless Chrome、localhost生产预览、无节流、全新专用上下文的入口页，按钮可用238ms；该值仅记录本次条件，不是手机、弱网或安装后性能保证。[条件与manifest/图标/安装能力检查](evidence/Prime_Equipment_Nav_v0/Final/M0_Startup.json)。本轮未操作真实用户浏览器；查看了生成的桌面和360px截图。

Android真机、软键盘、真实双指操作、手机信任的HTTPS、Windows/Android系统级安装、游戏内当前可获取/准入/效率均无新证据，继续未验。桌面360/412/横屏模拟不代替真机。9父专名待核、有限目录与历史SW就绪波动均为已知限制。已完成本轮本地开发和作者验收，提交后停止，等待独立复核；不自动再次续工或循环返修。
