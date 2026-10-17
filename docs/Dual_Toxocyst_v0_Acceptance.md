# 毒囊双枪养成助手 v0：交付与验收记录

日期：2026-10-17；分支 `m1a/dual-toxocyst-pilot`；起点 `0827042ce31bffb4638abe2a8b4cad9d18b8c3e7`，开始时工作区干净。本轮来自用户随后明确授权“现在先跑一个毒囊双枪”，为独立单武器样例，不计入M0监控自动返修，不启动集团、配方递归或其他后续模块。

结论：样例实现和Windows本地Chrome生产构建回归通过；Android真机、可信HTTPS安装和游戏内挑战实测未完成。原M0报告和证据保持，下面列出本轮独立记录。

## 已交付功能

- `/#assistant`养成助手：毒囊双枪（Dual Toxocyst）I—IV全部进化任务，条件、前检、3—5条简短建议、建议地点/模式、计数排查、来源等级及核对日期。后续任务可提前查看。
- 手工记录本体、适配器、是否安装、当前阶段和每阶段状态；默认未知，可从进化III等中途开始。不从旧树推断，不自动完成前序、不改MR、不扣材料。当前阶段完成后提示后续未完成项，不改其他记录。
- 苦栓（Pathos Clamp）20、瑶丛（Yao Shrub）70、延凡草（Eevani）80的安装参考量；点击进入获取说明，支持中英文搜索。库存留空为未知、0为明确0，只给单项用量差，不做共享分配。已安装时提醒用量参考不表示需要重新采集。
- 新进度参与现有保存、更新写保护、完整备份、预览恢复和档案隔离。资料随本地应用壳离线提供；外部来源链接需联网。

## 数据与兼容契约

UI经DataProvider/LocalProvider读取本项目版本化武器目录；正式数据仅一把武器。测试中的第二把虚构武器用于验证通用搜索和渲染，不进入正式目录。稳定weaponId、stageId、materialId、acquisitionId与中文名称分离。

个人档案增加可选 `weaponProgress`。旧档缺字段只读适配为未知，不因打开页面写库；首次手工修改才落盘。DB_VERSION和备份schemaVersion均仍为1，因为是可选向后兼容扩展；catalogVersion为`2026.10.17.1`。新增三项材料仍保存在唯一的profile.stock中，旧credits/endo/forma/platinum不变。新旧字段共用校验、事务、revision冲突和更新写屏障。

M0修复的8 MiB文件、8 MiB减2 KiB业务负载、20层结构深度和50,000值限制继续生效，超限不截断、不假报成功。原29节点、87步骤、30推荐关系、原四库存、预算、日志、legacyArchive和原件继续回归。旧schema1及v1迁移后完整往返测试保留，新字段备份恢复逐业务字段一致（恢复到新档案时允许id/revision变化）。

## 实跑命令

完整标准输出、UTC起止时间和退出码见[最终命令记录](evidence/Dual_Toxocyst_v0_Final_Commands.json)。执行目录为app，浏览器环境 `APP_TEST_PORT=4180`、`APP_EVIDENCE_DIR=../docs/evidence/Dual_Toxocyst_v0/Final`，避免占用4173或覆盖M0旧证据。

| 命令 | 退出码 | 实际结果 |
|---|---:|---|
| `npm.cmd run lint` | 0 | ESLint通过 |
| `npm.cmd test` | 0 | 非watch；3文件、30/30测试通过（原24+新6） |
| `npm.cmd run typecheck` | 0 | TypeScript通过 |
| `npm.cmd run build` | 0 | 生产构建通过，31模块 |
| `npm.cmd run test:browser -- --reporter=line` | 0 | 15/15，40.8秒（原13+新2） |
| `npm.cmd run build` | 0 | 升级测试后重新生成正常内容hash版本 |
| `node scripts/verify-delivery.mjs` | 0 | 7路线/29节点/87步骤/30推荐关系及原受保护输入通过 |

最终build ID `m0-11915802aeaa`，base `/`；dist原始总大小444,417字节，主JS396,041字节、CSS19,702字节。详见[资源记录](evidence/Dual_Toxocyst_v0_Final_Build.json)。build ID的m0前缀沿用原构建器，不代表回退到旧实现。没有新增依赖，锁文件不变。这里只记录构建体积；首屏条件/采样见Startup证据，不将本机样本当作Android性能保证。

另保留首次完整通过记录 `Dual_Toxocyst_v0_Commands.json` 及其Build/Hash记录；最终记录含后续提示修正。两次结果不互相覆盖。

## 证据矩阵

浏览器为Windows本机Chrome155.0.8059.80、Playwright headless，使用专用隔离上下文/测试档案。不是Android设备。

| 检查 | 结果与证据 |
|---|---|
| 从中途开始、未知不推断、III完成提示IV | 新单元和浏览器测试；[桌面截图](evidence/Dual_Toxocyst_v0/Final/Pilot_Desktop.png) |
| 全部任务、材料中英文查询和获取说明 | 新单元及浏览器测试；[材料截图](evidence/Dual_Toxocyst_v0/Final/Pilot_Material_Mobile.png) |
| 材料未知/0/已足量、档案共用库存 | 浏览器先留空、写0显示70、写75显示0，档案页仍为75；[恢复证据](evidence/Dual_Toxocyst_v0/Final/Pilot_Restore.json) |
| 实际完整备份下载→预览→新档恢复→重载 | 新浏览器测试下载真实文件，恢复后原生IndexedDB读取并逐业务字段比较；双档及第三个空档隔离通过；同上Restore证据 |
| 旧数据、新字段、原件兼容 | 原24项单元及原13项浏览器全部通过；新单元覆盖旧schema1/v1不注入武器状态、新字段全量往返、非法新状态不写入 |
| 容量/深度备份边界 | 原边界测试继续通过；[深度恢复](evidence/Dual_Toxocyst_v0/Final/M0_Fix_Depth_Restore.json)、[超限无下载](evidence/Dual_Toxocyst_v0/Final/M0_Repair_R1_Backup_Failure.json) |
| 配额失败不假报成功、旧值保留 | 新离线材料保存故障和旧配额测试通过；[离线记录](evidence/Dual_Toxocyst_v0/Final/Pilot_Offline.json)、[失败截图](evidence/Dual_Toxocyst_v0/Final/Pilot_Offline_Failure.png) |
| 新页面离线打开、材料详情、手工状态保留 | SW控制后断网、关闭页面后新开assistant，状态/材料仍可用；同上Offline证据 |
| 浏览器关闭重开持久化 | 原真实Chrome独立profile关闭/重启测试通过；[浏览器记录](evidence/Dual_Toxocyst_v0/Final/M0_Browser.json) |
| v1→v2、待保存、暂缓、取消、多标签页 | 原更新用例全部通过；[更新记录](evidence/Dual_Toxocyst_v0/Final/M0_Update.json) |
| 更新发起页刷新、关闭、重新打开、失去waiting worker | 原中断更新用例全部通过，其他/重开页可显式取消并继续写入；[刷新](evidence/Dual_Toxocyst_v0/Final/M0_Fix_Update_Refresh.json)、[持久屏障](evidence/Dual_Toxocyst_v0/Final/M0_Fix_Update_Barrier.json)、[孤立屏障](evidence/Dual_Toxocyst_v0/Final/M0_Fix_Update_Orphan.json) |
| 360/412 CSS px无横向溢出 | 浏览器断言及截图通过；[360](evidence/Dual_Toxocyst_v0/Final/Pilot_Mobile_360_Top.png)、[412](evidence/Dual_Toxocyst_v0/Final/Pilot_Mobile_412_Top.png) |
| 原树触屏缩放/拖拽不误完成 | 原仿真触屏用例通过；[记录](evidence/Dual_Toxocyst_v0/Final/M0_Touch.json)，仍不等于物理触屏 |
| 原始输入hash | 本轮17/17一致（含原HTML、seed、原交接文档和M0计划）；[逐文件SHA-256](evidence/Dual_Toxocyst_v0/Protected_Inputs.json) |

最终桌面、360顶屏和材料整页截图已逐张查看；布局未见横向溢出或操作遮挡。早期测试发现第五导航项导致窄屏溢出，改为五列图标/文字；另一项检查发现已完成当前阶段仍提示本项，补断言后修正。最终完整30/15回归均通过。测试期间仅处理专用测试数据，没有删除真实用户数据库或原件。

## 来源、限制及未验项

[来源核验表](Dual_Toxocyst_v0_Sources.md)区分官方历史补丁正文与社区检索缓存。进化IV整理为连续17次爆头命中，不写成17击杀；装填不重置及异常状态重置修正引用官方历史说明。任务建议独立编写，不保证当前游戏所有计数行为。Chrysalith区域的当前中文名待核，页面明确标示。没有复制Tenno Hub、地图图片、整篇攻略或第三方加工数据包；[第三方声明](../THIRD_PARTY_NOTICES.md)已补充。

未验证：Android真机360/412宽度、横竖屏、软键盘、真实双指手势；手机信任HTTPS的安装/SW与关闭已安装应用后离线重开；游戏内四阶段计数、区域中文名和建议地点实操。也未新增一次Windows操作系统安装UI验收；本轮Chrome manifest/图标/installability检查仍通过。上述缺少设备/环境或游戏实测，不标为通过。

后续复现：在可信HTTPS提供生产dist，Android记录设备、系统及Chrome版本；首次在线等SW控制后记录已知材料值和中途进度，安装并退出、断网重开assistant/树/备份，检查记录；切横竖屏并用软键盘输入库存，再测树缩放拖拽。游戏内对照武器进化界面逐项核验，若与历史资料不同，修订目录及来源，不自动改写个人状态。

## 本地检查点与使用

| 提交 | 内容及验证 |
|---|---|
| `a1735c4` | 范围设计、核验来源与验收计划 |
| `c4f2199` | Provider、结构化目录、可选状态、兼容校验；30项单元测试通过 |
| `372f91e` | 中文界面、搜索/材料工作流、移动布局和生产浏览器用例；首轮30/15及标准命令通过 |
| `1b80df8` | 当前完成阶段后的提示修正与已安装材料提示；最终30/15及全部标准命令通过 |
| 本文件所在交付提交 | 使用说明、许可声明、原件hash及两轮独立证据；hash见Git日志/最终回复 |

在app执行 `npm.cmd run build`，再执行 `npm.cmd run preview -- --port 4180`，打开 `http://127.0.0.1:4180/#assistant`。详细说明见[app README](../app/README.md)。4173和4180是不同origin，各自保存档案；如要带入旧地址数据，先导出，再在新地址预览后新建恢复，不能把新地址空档当作原档丢失。

本轮仅本地分支提交；main仍为`08fda3880f0cdd796f3b1c9e3d84032083aa0091`，没有推送、合并、公开部署、付费服务或系统设置变更。交付本样例后停止；海波单剑、其他武器、集团/配方算法、轮换与全百科均未实现。
