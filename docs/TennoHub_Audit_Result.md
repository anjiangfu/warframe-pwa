# Tenno Hub M-1 技术审核与选型决策

审核日期：2026-10-16（Asia/Hong_Kong）。状态：**技术审查与决策报告已交付；建议选择 A 独立开发，等待用户批准 M0。B 复用许可门槛未通过，运行验收未完成。** 本报告不等于 Tenno Hub 的安全认证或完整游戏资料核验。

## 1. 审查对象、方法与范围

- 本地基线为交接资料包，检查时没有 `.git`、`package.json`、应用目录或测试/build 命令。任务范围由 [AGENTS.md](../AGENTS.md)、[本次指令](../prompts/TennoHub-Audit-Codex-Next.md)、[架构 PRD](PRD_v2_Architecture.md) 和 [原树审查](Code_Review_Tech_Tree.md) 确定；原有先行审核是待复核输入，不作为源码事实的替代证据。
- 对指定公开仓库做匿名浅克隆，仅存于隔离临时目录 `C:\Users\21904\AppData\Local\Temp\TennoHub-M1-Audit-ec7fd77f1e5f4852aca23b192d4e0cb1\Tenno-Hub`。固定提交为 [`96381713a6854a58bbf0259fa89f2725111808ef`](https://github.com/Appl3Tree/Tenno-Hub/tree/96381713a6854a58bbf0259fa89f2725111808ef)，`git status --short` 无修改。下文 T 系列链接均固定此提交，避免把后续 main 分支变化混入结论。
- `gh repo clone` 返回 HTTP 401；改用匿名 `git clone --depth 1` 成功。沙箱阻止 Git 配置写入后，经工具审批在普通临时目录完成克隆。未安装依赖，未运行远端 npm 脚本、测试、构建或数据更新程序；未访问真实玩家 Profile、未连接 Google Drive、未发送账号资料、未联系作者、未复制第三方实现或素材到本项目。
- 已做：受版本固定的源码静态检查、锁文件元数据检查、原树/种子一致性检查、公开网页与许可核验、线上站点 HTML 的只读 HTTP 检查。未做：Windows/Android 浏览器安装及断网重启、首屏性能实测、真实账号导入、依赖漏洞扫描和完整供应链审计。这些事项的状态是 **unverified**，不是“通过”。

## 2. 决策与阻断项

**建议 A：以用户原创科技树为界面起点，独立实现 React + TypeScript + IndexedDB 离线 PWA。** Tenno Hub 可作为领域问题与交互需求的参照；当前不能作为获准复制的底座。工程上也有存储、中文、离线和数据核验方面的实质差距，见下表与第 8 节。

| 编号/严重度 | 证据与判断 | 对本项目的处置 |
|---|---|---|
| F01 / 阻断 B | 全部 701 个受跟踪文件中无 LICENSE、NOTICE、COPYING 文件；[package.json][T01] 无 `license` 字段，[README][T02] 只有游戏资产归属说明，没有复用授权。公共可见与可修改分发是不同权限，参见 [GitHub 许可说明][W01]。这是“未取得授权”，不推断作者永远不授权。 | B 必须先取得明确覆盖修改、分发、素材及混合数据的授权；用户同意采用 B 本身不能代替权利人授权。 |
| F02 / 高 | 无受跟踪 manifest/SW 文件；入口 [index.html][T03] 无 manifest 链接，[main.tsx][T04] 无 SW 注册，[Vite 配置][T05]、包清单无 PWA 插件。线上 HTML 亦无 manifest（第 10 节）。 | 当前证据不能认定为满足需求的离线可安装 PWA；浏览器“添加快捷方式”不算离线验收。 |
| F03 / 高 | Progress Pack UI 直接调用导入；[store.ts:636–650][T06] 校验后立即合并，[progressPack.ts][T07] 对同键库存覆盖、对传入 goals/syndicates 等整段替换。未提供逐字段冲突预览和恢复点；部分嵌套结构为 `z.any()`。 | 独立开发有容量/结构限制、预览、确认、事务写入与撤销恢复的导入链路。不能沿用这一导入契约。 |
| F04 / 高，模块级 | [syndicateEngine.ts][T08] 首步取 `max(祭品声望成本, 阈值-当前声望)`；阈值和成本相等时，已有正声望可能未扣除；负声望用 `max(currentStanding,0)` 丢失。缺失等级定义被跳过；只累计 standing/credits/item，未纳入 currency/other。 | 独立设计并验证声望算法。注意：全 src 引用检索中该计算函数仅在自身与单测出现，**不能据此断言线上集团页正在输出同样错误**。线上另有估算函数，见第 3 节。 |
| F05 / 高 | 账号一键导入实际 GET 到 `api.warframestat.us/profile/{id}`，见 [Topbar.tsx:825–845][T09]；不是 README 所描述的仅官方页手动复制流程。官方页入口仍存在。 | 默认手工录入；未来自动导入另审第三方接收方、字段覆盖率及同意流程。ID 虽不是密码，仍是账号关联数据。 |
| F06 / 高 | [googleDrive.ts][T10] 实现 OAuth `drive.file` 与上传/恢复备份；客户端 ID 配置后可使用；token 为模块内存变量，文件 ID、连接标记等存 localStorage。[ExportImport.tsx][T11] 含云备份 UI。 | 不接入本项目；不能把整个现成项目概括为“绝不上传个人资料”。未验证线上是否配置客户端 ID，不能断言已上传。 |
| F07 / 高 | 游戏祭品按英文 `name` 表达，类型未附逐条 sourceUrl/checkedAt/gamePatch/verification，见 [vendor catalog 类型][T12]；架构文档宣称的两份 wiki/patch overlay 文件实际均为 0 字节（第 10 节）。 | 当前祭品和版本标记 `unverified`；不因仓库存在数值就升级为已验证游戏事实。 |

## 3. 架构、集团、目标与库存的实际能力

### 3.1 架构与保存

源码采用 React 19、TypeScript、Vite、Tailwind 4、Zustand + Immer、Zod，具有 catalog/domain/store/UI 分层；页面使用 lazy import。证据：[包清单][T01]、[App.tsx][T13]、[UserStateV2][T14]。有基础工程价值，但不能从分层存在推出功能成熟度。

源码实际持久化 key 为 **`wf_tracker_state_v3`**，Zustand persist version 为 **6**；导出数据 `meta.schemaVersion` 仍为 **2**。这是三个不同的概念。[persistence.ts][T15]、[progressPack.ts][T07]。架构文档写的是 `wft_persist_v1`、schema 2，已经与当前保存实现不完全一致。[ARCHITECTURE.md][T16]。本次没有找到 IndexedDB 实现或使用，个人主状态使用 localStorage persist。[store.ts][T06]。

迁移前尝试写 `${PERSIST_KEY}_premigration_backup`，失败被忽略；迁移返回空时回到默认状态。迁移含当前时间和重置周期初始化，未见事务回滚/多标签页迁移协议。旧 key 跨命名迁移能力没有获得证明。证据：[store.ts:1015–1039][T06]、[migrations.ts][T17]。存在备份尝试，不等于保证可回滚；不建议直接照搬。

### 3.2 集团

[vendor catalog][T12] 组装 22 个集团/特殊系统条目，包括普通声望、活动等不同模型；不是 22 套同一规则。集团 UI 含等级、声望范围、效忠关系净收益模拟及估算；见 [syndicateGridHelpers.tsx][T18]、[SyndicatesGrid.tsx][T19]。物品成本存在字符串名称匹配，因此中文显示必须与计算 ID 分离，不能翻译英文主键后破坏关联。[requirementEngine.ts][T20]。

在线页所引用的 `estimateStandingToMaxRank` 是逐等级区间累加的单独函数；不能拿引擎单测证明 UI 所有估算正确。[T18] [T19]。引擎测试还把“成本与阈值差取大值”和缺定义返回零当作期望行为，存在测试固化假设的风险。[syndicateEngine.test.ts][T21]。本次未执行该测试，也未证实每日上限公式适用于全部特殊集团；MR 未知时用 0 代入的估算不能在本项目显示为确定天数。[T08] [T18]。

F04 的可复核合成反例：若下一等级 threshold=1,000、standing cost=1,000、已积累 standing=400，源码表达式给出 `max(1000,1000-400)=1000`；如果表示“还需赚取的声望”，应为 600。此为按表达式人工推导的模块反例，不是游戏实测，也未执行第三方代码。[T08] [T21]。

### 3.3 目标、共享材料与前置

- 目标模型关联 catalogId、数量、激活标记、笔记和步骤；库存通过 counts 记录，并有 MOD/赋能等级等扩展。[T14] [T07]。
- 单目标递归展开基于父项剩余数量，已有成品时不继续要求其材料；节点 ID 按目标+结构路径生成，含配方下标，配方重排可能影响展开节点 ID；有深度上限。[goalExpansion.ts][T22]。本项目保留用户旧 ID，不能用此结构路径替换。
- requirements 引擎汇总目标/集团用料并扣库存，overlap 按来源分组；这是“共享材料”和“同一地点可刷多个目标”的技术依据。证据：[requirementEngine.ts][T20]、[overlapEngine.ts][T23]、[Requirements.tsx][T24]。它不能证明已解决随机掉落下的最优 90 分钟计划。
- reserve 引擎明确是未来消耗压力汇总，本身不检查库存缺口或可参加性；不能单独当缺口计算器。[reserveEngine.ts][T25]。
- 前置引擎/registry 区分任务、MR 等门槛，[plannerEngine.ts][T26] 有可访问性计算。但用户档案缺 key 被当成 false，未保持“未知”三态。[T14]。自建系统必须区分已满足/未满足/未知，并把原树 deps 全部视作推荐关系。

## 4. 数据来源、许可与四项祭品抽查

### 4.1 数据链与接入判定

| 来源 | 本次核验与用途 | 接入边界 |
|---|---|---|
| WFCD warframe-items | 上游 [LICENSE][W02] 为 MIT；[README][W03] 描述 uniqueName、配方和可选 `zh` i18n。当前上游还使用组件引用/Components catalog。 | 可作为后续有条件接入源：**从上游直接取固定版本**，保留版权和许可，校验 ID/配方结构及中文覆盖率。不要复制 Tenno Hub 加工后的文件。此处未核验中文每个词条，也未把上游当前版本当作玩家游戏版本。 |
| WFCD warframe-drop-data | [LICENSE][W04] 为 MIT；Tenno Hub 更新器指向该项目与 items 的 raw URL。[updateExternalRawData.ts][T27]。 | 可在后续里程碑保留许可/来源后按版本接入；掉率不换算成未经实测的每分钟收益。 |
| WFCD warframe-status / worldstate-parser | 两者 [status LICENSE][W05]、[parser LICENSE][W06] 为 MIT；Tenno Hub 使用社区 `api.warframestat.us/pc`。[worldStateCache.ts][T28]。 | M4 候选。代码许可不代表托管 API 的 SLA、使用政策或所有上游资产权利；上线前另核接口、缓存与服务政策。世界状态摘要不能替代完整活动任务/商店审核。 |
| 官方 PC 更新公告 | 本次核对 [35.0.9][W07] 的阿耶精华（Aya）祭品变更、[38.0.0][W08] 的六人组等级及关系门槛。 | 用于人工核验具体事实并链接原公告；未获得公告/游戏图像整体再发布授权。不能把历史公告当成截至今日全部未改动的证明。 |
| Wiki dump、Overframe 导出、图像/图标 | Tenno Hub 还读取 Wiki 蓝图和 Overframe 导出，分别见 [wikiBlueprintRequirements.ts][T29]、[generateLeanItems.ts][T30]。README 中的 WFCD 数据源列表不完整。 | 这些混合内容的具体许可/归属链未逐项核实，**unverified，不搬运**。MIT npm 包不为这些外部数据和 DE 资产提供概括授权。 |

上述网页均检查于 2026-10-16；W 系列为当日页面证据，未来接入前必须固定上游 commit/hash 与许可快照，记录数据版本及真实 gamePatch（缺证据时为 unverified）。名称使用 stable id + 中文名 + 英文名 + 已确认别名；缺中文的条目进入人工核名队列，不能让英文占位直接进入主要操作界面。该策略来自 [AGENTS.md](../AGENTS.md) 和 [PRD](PRD_v2_Architecture.md)。

### 4.2 四组晋升抽查结论

这里只记录源码审查事实，不导入祭品表。**四组完整等级/祭品/当前版本均为 `unverified`**；没有游戏内截图和足够覆盖后续变更的官方证据，不输出可靠缺口或天数。

| 样本 | 固定源码观察 | 独立证据及结果 |
|---|---|---|
| 英择谛（Entrati）2→3 | [entrati.ts:34–45][T31] 写入 44,000 声望及两种保育标签各 3、母亲/儿子石印各 1。条目无来源和核验日期。 | 未找到足以确认截至审核日完整祭品组合的官方证据；数值与所有祭品项 unverified，不转成游戏硬门槛。 |
| 科维兽（Cavia）1→2 | [cavia.ts:47–59][T32] 写入 22,000 声望、25,000 星币和四种材料，缺少逐项出处。 | 官方 [35.0.0 公告][W09] 可证集团及回响兑换体系，不足以核实完整 1→2 成本；全项 unverified。 |
| 六人组（The Hex）2→3 | [theHex.ts:36–48][T33] 写入 44,000 声望、六种收集品各 1、50,000 霍币（Höllars）。currency 类型在 F04 所述引擎里不会累计。 | [38.0.0][W08] 可证等级与关系体系；未完整证实该级祭品。该样本全项 unverified。关系/任务门槛还需单独建模，不能只算材料。 |
| 佩兰数列（The Perrin Sequence）4→5 | [thePerrinSequence.ts:10–17][T34] 写入 3 阿耶精华（Aya）、500,000 星币、99,000 声望。 | [PC Hotfix 35.0.9][W07] 确认当时 Rank 5 改为 3 Aya；这是**部分历史证实**，不证明另两项或截至今日的完整成本；当前整条仍 unverified。 |

额外静态异常：佩兰同一文件含两个 rank 0；按 `find(rank)` 的模块会选先出现者。[T34] [T08]。这说明负等级恢复不能只相信“支持负等级”介绍；必须核验已付祭品、首次晋升/再次晋升、正负区间和缺失数据等边界。

后续核验工序（M1 前）：逐级记录游戏服/补丁、原文或截图、材料稳定 ID、中英名、数量、审核时间；另一轮对照官方更新，差异留档。无法核实者保持 unverified，并阻止确定性消耗/天数推算。用户无需凭英文站点判断技术正确性。

## 5. 导入安全、隐私与供应链

账号导入存在三条路径：官方 Profile 页手动复制、用户导入 HTML/JSON、一键 GET 社区 Profile API；最后一条在写入前出现确认提示，但网络请求**早于**确认写入，且不是字段级预览。证据：[Topbar.tsx:825–845,1142–1165][T09]、[profileImport.ts][T35]。与之不同，Progress Pack 的文件/文本恢复没有相同确认层，导入同键会变更现有资料。[T11] [T06] [T07]。不要将两类导入混为一个安全结论。

解析器支持显示名、MR、库存、任务、集团等；导入应用阶段会保留部分手工集团声望值，并非“实时档案完全覆盖本地”。[profileImport.ts][T35]、[store.ts:145–244][T06]。本次没用真实账号核验字段、跨平台覆盖率、接口响应与政策，均为 unverified。采样调用搜索中未发现游戏密码/Steam token 为这些流程的输入；这不等于对所有依赖、部署产物和网络请求的全面无泄露证明。

锁文件为 lockfileVersion 3，394 项 packages（包含根项），393 个非根项都有 license 元数据；其中 `@parcel/watcher`、`esbuild`、`fsevents` 标记 hasInstallScript（静态读取 [package-lock.json][T36]）。这不证明存在恶意，也不证明依赖全部经过许可/漏洞审核。根包无 preinstall/postinstall 不能排除传递依赖脚本。遵循本次任务边界，未安装或执行；B 的 test/build 能否通过仍未验证。

构建工作流执行 npm ci/build 并部署 GitHub Pages，没有把 test/lint 设为该工作流的门禁。[deploy.yml][T37]。仓库有 20 个 test/spec 文件，但存在文件不代表通过，更不代表涵盖完整集团资料与实际触屏。

## 6. PWA、离线缓存、迁移及移动端

### 6.1 现成项目结论

源码和线上入口未找到 manifest；源码没有发现 SW 注册或离线应用壳缓存。线上首页 HTTP 200 且有 apple-touch-icon，只能证明静态网页可取，不是 PWA 安装/离线证明。[T03] [T04] [T05]，以及第 10 节的 HTTP 记录。

WorldState 的被引用实现是 `src/lib/worldStateCache.ts`：模块内 `_cache` 和 5 分钟 TTL，刷新进程后不构成可恢复离线缓存。[T28]；另有同名旧文件，引用链以 [Topbar][T09] / [useWorldStateData.ts][T38] 为准。入口的 no-cache meta、build ID 查询参数重定向也不等于 SW 升级提示，更不能保证持久档案安全。[T03]。

移动适配存在实际代码：移动侧栏与遮罩、响应式布局、星图 pointer 平移/双指缩放、`touchAction: none`、小屏详情覆盖层。[Shell.tsx][T39]、[Sidebar.tsx][T40]、[StarChartMap.tsx:475–638,1330,1665][T41]。因此不能称“完全不支持手机”；但中文长文本、软键盘、触点冲突、返回导航和安卓首屏性能没有实机验证。

实测文件字节量（不是 dist/传输量）：src/data 43,703,999；external 156,813,153；public 2,955,316；src/assets 20,263,498。单个生成 All 数据 21,877,831 字节。原架构的“约 79 MB”不能当当前构建产物大小。[T16] [T42]。lazy 页面已存在，但未测 bundle、网络传输或内存，不能断言首屏必下载所有资料。

### 6.2 自建方案必须遵循的约束（设计建议，尚未实现）

- 以 HTTPS 或本机 localhost 提供。手机打开电脑 `http://局域网IP:端口` 不等于手机的 localhost；只能用来做普通布局联调，PWA/SW 验收应改用手机信任证书的 HTTPS。[Service Worker 文档][W10]。
- 三类数据分开：IndexedDB 保存 profile/用户目标/笔记/库存；版本化静态 JSON 保存 catalog 和来源；以后 online-event cache 单独保存 fetchedAt/expiresAt/sourceUrl/patch/reviewedAt。未知不写成 0，未验证事实不变成 hard requirement。来源：[PRD](PRD_v2_Architecture.md)。
- IndexedDB DB 版本、备份 schemaVersion、catalogVersion、应用 build ID 分别管理。迁移应确定、幂等；冻结旧步骤索引映射；导入按原档 hash/导入记录去重；事务失败保留旧状态；版本过新拒绝写入。多标签页遇 blocked/versionchange 给出关闭旧页提示。[IndexedDB 文档][W11]，具体验收见 M0 计划。
- “可回滚”不能简单理解为原地降级 IndexedDB version。建议导出旧格式快照、保留上一个可读备份，失败原子回滚；若必须应用降级，应在兼容程序/独立库中恢复，不自动删库。[W11]。
- SW 仅缓存应用壳和小型、固定版本的基础资料，不缓存整个 raw 数据目录。新 worker 等待，提示“新版本已准备好，保存后更新”；用户确认且待写入完成后切换；仅清理本应用旧 Cache Storage，不清 IndexedDB。
- 手机存储可能被浏览器回收，持久化申请也非绝对保证。显示保存失败/配额异常，提供手工导出恢复；断网重开已缓存的路由仍可用。两设备按 origin 隔离、不会天然同步。[存储配额与回收][W12]、[PRD](PRD_v2_Architecture.md)。M0 不引入云账户。

## 7. 用户 7 路线/29 节点迁移评估

本次对 [HTML:59–95](../reference/Original_Tech_Tree.html#L59) 的模型做只读提取，与 [seed JSON](../data/tech-tree-seed.json) 深度比较：所有字段一致，7 lanes、29 nodes、30 deps、87 steps；29 ID 唯一、依赖引用全部存在。`origin` 是中心根，lane 为特殊 `origin`，并非漏掉的第 8 条路线。检测输出与 hash 见第 10 节。

迁移工程量判断：中等。原树有现成配色、节点布局、缩放/小地图、详情、笔记和 JSON 路径，可保留设计；难点是把 DOM/全局状态改成 React 数据组件、持久化事务、触屏命中与导入冲突处理。无需 M0 引入大型自动图布局库。原实现位置：[renderNodes:112](../reference/Original_Tech_Tree.html#L112)、[手势:124–139](../reference/Original_Tech_Tree.html#L124)、[导入导出:148–149](../reference/Original_Tech_Tree.html#L148)。

| 原字段/行为 | M0 兼容设计 |
|---|---|
| 29 个 node.id、7 个 lane.id | 原值永不重编号；自定义 ID 使用独立命名空间；导出携带 catalogVersion；特殊根节点单独建模。 |
| deps | 全部转建议关系，不锁节点；硬条件仅可由来源已审核的数据补充。ready() 混合逻辑不照搬。[HTML:100,105](../reference/Original_Tech_Tree.html#L100) |
| statuses | 映射 todo/progress/done；旧文件缺 key 依照旧 status() 视为 todo，**不能重新注入六个默认 done**。默认 done 只属于首次模板初始化。[HTML:95–105](../reference/Original_Tech_Tree.html#L95) |
| steps[nodeId][index] | 通过冻结 v1 节点/步骤索引表映射为 stable stepId；以后改文案/顺序不改变 ID；不以实时数组下标恢复。 |
| notes、rank | 作为个人事实/笔记迁移；不从完成某 MR 节点反向覆盖用户填写的 MR；不拿旧导入 UI 的 12–18 范围限制所有未来玩家。 |
| stock | credits/endo/forma/platinum 对应星币、内融核心、福马、白金；明确 0 与缺失/未知不同；ID 映射固定可追踪。 |
| budget、events、未知字段 | 旧审查映射容易遗漏 budget：必须保存为个人预算并纳入导出。events 保留原时间/顺序，用稳定指纹防重复；未知节点/字段放 legacyArchive，预览列明，不能丢弃。 |
| 原始 JSON | 保留原字节档（含 hash），可再下载；导入预览显示新增/冲突/未知/拒绝项；确认前数据库不变；不要求用户重新勾选。M0 默认只支持明确选择后整档恢复，不自动做复杂跨设备合并。 |

旧存档是 `tenno_progress_lab_v1` 对应 version 1 的裸状态对象，不包含节点目录；seed 也不包含用户状态。两者不能互相当作个人备份。[HTML:94–98,148–149](../reference/Original_Tech_Tree.html#L94)。旧 origin 文案“浏览五条养成路线”与实际七条不一致；标题中大嘴模块仅写英文的地方需要中文呈现。均作为批准 M0 后的显示文案修订，原始 HTML 和 seed 不改。

## 8. 两条实施路径与工作量

以下为**技术负责人估算**，不是外包报价/交付保证。单位为专注工程人日（约 6 小时），含测试和修复，不代表玩家每日 90 分钟；不含等待授权、用户设备排期或完整游戏资料人工核验。范围相同才比较：中文离线骨架、原树迁移、编辑档案、备份恢复和手机验收。

| 维度 | A：独立 React + 原树迁移（推荐） | B：获得授权后改造 Tenno Hub |
|---|---|---|
| 前提/风险 | 用户已有设计与可控数据边界；需独立实现储存与导入安全 | 先解许可阻断；还须处理 Wiki/Overframe/资产的独立权利及供应链；授权结果不确定。F01；[T29] [T30] |
| 中文成本 | M0 29 节点为主，界面中文；以 stable id 构建中英映射 | 英文散落 UI、catalog、匹配逻辑；翻译不能破坏名称关联。[T11] [T12] [T14] [T20] |
| 数据更新 | 自有版本化小目录，直接接许可明确的上游，附来源，人工审核后更新 | 上游更新器/生成器可参考需求，但混合数据要厘清；现有文档漂移和空 overlay 需修复。[T16] [T27] [T29] [T30] |
| 个人档案迁移 | v1 原树 → 新 schema，有预览/备份/幂等恢复 | 仍须新增原树适配；现有 Progress Pack 不认识原树 29 ID/stock/budget；localStorage→IndexedDB 另做。[T07] [T15] |
| M0 工作量拆分 | 数据契约/ID 0.5–1；IndexedDB+迁移+备份 1.5–2.5；科技树组件/手机 2–3；PWA+质量验收 1–1.5；**合计约 5–8 人日** | 许可明确后：梳理/隔离范围 1–2；中文与名称 ID 2–4；IndexedDB/原档迁移 2–3；科技树/PWA/设备修复 3–5；**合计约 8–14 人日** |
| M1 增量估算 | 约 3–5 人日实现集团/共享缺口，另加数据核验时间 | 约 3–6 人日重新核验并适配规则，另加数据核验时间；不能假设既有算法直接正确。F04、F07 |
| M2–M4 | 逐 milestone 另估；本次不承诺 | 现有领域页可能减少部分搭建，但其正确性、许可和离线化未过门槛，不能量化为确定节省 |

无论选择哪条路径，**必须独立完成/重新验证**：中文名与 alias 表、原树兼容、个人档案/目录/在线缓存分离、幂等迁移与导入预览、硬前置三态、可解释的 90 分钟推荐、带版本出处的晋升资料、活动奖励人工审核、持久离线缓存和安全更新。此项是基于 PRD 与上文差距的工程判断；不是声称现成项目绝无任何相似功能。

**不采用项**：未授权实现/资产、模糊许可的数据导出、静态 minutes 当刷取速率、英文 name 当新系统主键、全量 raw 预缓存、默认账号读取、Google Drive 或其他订阅/云同步、把 unknown 归零。

## 9. M-1 结项与最少决策

本次八项任务已覆盖：隔离源码审查（2–6）、原树迁移（7）、独立模块/数据许可（4、8）、PWA/数据库/手机（6）、A/B 选型（8）、审核报告及 [M0 计划](M0_Implementation_Plan.md)。本次只生成文档，不创建 app 或实施 M0。

仍未验证：Tenno Hub 权利人授权与所有外部资产许可、远端 test/build/lint、真实账号字段/接口政策、四组完整最新祭品、中文覆盖率、Windows/安卓安装离线与性能。因为本次没有安装许可且没有实机运行证据，不把先行审核中的“实机通过门槛”勾成通过；这不妨碍以明确不采用 B 的方式形成当前选型决策。

**只需用户决定一项：是否批准按 A 和本次 M0 计划开始 M0。** 若想改选 B，则先暂停实施，取得权利人授权，再另行批准隔离安装和运行验证。无需用户自己判断英文应用的技术好坏；不增加订阅/云服务。本次交付后停止。

## 10. 可复核检查记录

本节为本次本地只读检查的原始结果摘要；不是 Tenno Hub 程序运行结果。

| 检查 | 结果/证据 |
|---|---|
| 固定版本与状态 | `git rev-parse HEAD` = `96381713a6854a58bbf0259fa89f2725111808ef`；`git status --short` 空。 |
| 文件清单扫描 | 用 `git ls-files` 枚举 701 项；按路径筛 LICENSE/NOTICE/COPYING 及 manifest/service-worker/sw/workbox：均 0；再检入口和 Vite 配置。范围为当前提交，不包含所有历史提交。 |
| 数据/依赖扫描 | 用 Node 内置 fs/JSON.parse 读取受跟踪文件大小、package-lock packages 元数据；结果见 5、6。未加载远端 JS 模块。 |
| 空数据层 | `src/catalog/syndicates/syndicateLadders_wiki.ts` = 0 字节；`syndicateLadders_patchOverlays.ts` = 0 字节。[目录证据][T43] |
| 线上 HTML | 只读 `Invoke-WebRequest https://appl3tree.github.io/Tenno-Hub/`，HTTP 200，HTML length 1612，无 manifest；主 JS `index-BwUwe9oJ.js`，CSS `index-wHQlZhBC.css`；Last-Modified `Tue, 28 Apr 2026 23:41:59 GMT`，Cache-Control `max-age=600`。未执行页面脚本，不能以此确认线上与源码逐字一致。 |
| 原树一致性 | Node 内置 assert/vm：仅求值用户原 HTML 中 LANES/row/base 的声明段，与 seed 全字段深比较；5 组断言通过：7 路线、29 节点、ID 唯一、模型相等、依赖可解析；30 边、87 步骤。未运行完整页面。 |
| 原始文件 SHA-256 | `reference/Original_Tech_Tree.html`：`21e08edc277e7bf6ed9fdfca74ea96d2ed8e56c049cb422e976663c6c28c44ef`；`data/tech-tree-seed.json`：`f357c6e8f29a875d40425cdd18584bd1afe2200c8476bb8102a1d41185e75fe2`；`AGENTS.md`：`6053362dafb5af9d1529a812eac8d4d5c58c7f9d7c0d9b0ee859dbaf5388059a`。 |
| 本项目测试/build | 无 package.json、无测试/build 脚本，**不适用且未执行**；不能写成通过。M0 后必须提供并实跑，见计划。文档交付以链接/覆盖/原件 hash 与 Git diff 检查验收。 |
| 文档检查 | 2 份报告的 UTF-8、代码围栏、T/W 引用定义、本地链接、43 个固定仓库文件/目录目标及行号范围检查通过；原件 3 项 hash 保持一致，未生成 app/package.json。 |
| Git 留档 | 本目录原无 Git，先以 `30a5f6f` 登记 15 份未修改输入资料为基线；M-1 提交仅新增本审核及 M0 计划。仅本地留档，不配置远端、不推送。 |

## 证据索引

T 系列固定于已审查提交；W 系列在 2026-10-16 查阅。引用中的行范围用于定位，网页链接中只有起始行。所有设计建议和工时估算均已在正文注明，并非外部来源中的保证。

[T01]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/package.json
[T02]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/README.md
[T03]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/index.html
[T04]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/main.tsx
[T05]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/vite.config.ts
[T06]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/store/store.ts#L636
[T07]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/store/progressPack.ts
[T08]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/syndicateEngine.ts#L59
[T09]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/app/layout/Topbar.tsx#L825
[T10]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/lib/googleDrive.ts
[T11]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/components/ExportImport.tsx
[T12]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/catalog/syndicates/syndicateVendorCatalog.ts
[T13]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/app/App.tsx
[T14]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/models/userState.ts
[T15]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/store/persistence.ts
[T16]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/ARCHITECTURE.md
[T17]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/store/migrations.ts
[T18]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/components/syndicates/syndicateGridHelpers.tsx
[T19]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/components/syndicates/SyndicatesGrid.tsx
[T20]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/requirementEngine.ts
[T21]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/__tests__/syndicateEngine.test.ts
[T22]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/goalExpansion.ts
[T23]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/overlapEngine.ts
[T24]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/pages/Requirements.tsx
[T25]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/reserveEngine.ts
[T26]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/logic/plannerEngine.ts
[T27]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/scripts/updateExternalRawData.ts
[T28]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/lib/worldStateCache.ts#L551
[T29]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/catalog/items/wikiBlueprintRequirements.ts
[T30]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/scripts/generate/generateLeanItems.ts
[T31]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/catalog/syndicates/vendorEntries/entrati.ts#L34
[T32]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/catalog/syndicates/vendorEntries/cavia.ts#L47
[T33]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/catalog/syndicates/vendorEntries/theHex.ts#L36
[T34]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/domain/catalog/syndicates/vendorEntries/thePerrinSequence.ts#L10
[T35]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/utils/profileImport.ts
[T36]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/package-lock.json
[T37]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/.github/workflows/deploy.yml
[T38]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/lib/useWorldStateData.ts
[T39]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/app/layout/Shell.tsx
[T40]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/app/layout/Sidebar.tsx
[T41]: https://github.com/Appl3Tree/Tenno-Hub/blob/96381713a6854a58bbf0259fa89f2725111808ef/src/pages/starChart/StarChartMap.tsx#L475
[T42]: https://github.com/Appl3Tree/Tenno-Hub/tree/96381713a6854a58bbf0259fa89f2725111808ef/src/data
[T43]: https://github.com/Appl3Tree/Tenno-Hub/tree/96381713a6854a58bbf0259fa89f2725111808ef/src/catalog/syndicates
[W01]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
[W02]: https://github.com/WFCD/warframe-items/blob/master/LICENSE
[W03]: https://github.com/WFCD/warframe-items/blob/master/README.md
[W04]: https://github.com/WFCD/warframe-drop-data/blob/main/LICENSE
[W05]: https://github.com/WFCD/warframe-status/blob/master/LICENSE
[W06]: https://github.com/WFCD/warframe-worldstate-parser/blob/master/LICENSE
[W07]: https://www.warframe.com/en/patch-notes/pc/35-0-9
[W08]: https://www.warframe.com/en/patch-notes/pc/38-0-0
[W09]: https://www.warframe.com/en/patch-notes/pc/35-0-0
[W10]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
[W11]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
[W12]: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
