# 星际战甲个人动态百科：PRD v2 / 决策文档

**基线：** 2026-10-16；PC 国际服，MR12 → 目标 MR18；90 分钟/天；Windows + Android；中文优先；PWA 离线优先。参考用户制作的 7 路线 / 29 节点科技树。

## 0. 核心体验与边界

一句话：打开应用，选择目标（可自定义），更新已有物资/声望/装备后，首页告诉用户**现在做什么、在哪里、为什么、预计多久、同时能获得什么**；另有互动科技树与系统百科；联网获取活动时可根据当前账号判断活动的可参加性、奖励价值和兑换顺序。

不可固定所有玩家走法；硬前置与推荐顺序分离；给用户手动标记“不想刷、优先做、暂时不做、已完成”的权利。

## 1. 模块与数据流

| 模块 | 持有数据 | 说明 |
|---|---|---|
| 用户档案 | MR、装备持有、Forma、集团等级与当前声望、库存、已解锁任务、玩法偏好 | IndexedDB；离线可改 |
| 游戏基础资料 | 装备、材料、配方、节点、集团晋升祭品、奖励来源、MOD/赋能中文名 | 版本化静态 JSON；附来源 |
| 科技树 | 各目标节点、硬前置、建议前置、分类、用户节点完成情况 | UI 与计算分离；节点可增删 |
| 推荐规则引擎 | 目标、时间、物资缺口、入场限制、额外收益、参与风险 | 离线纯函数；可解释评分 |
| 联网动态 | 活动、世界状态、新闻、轮换、兑换商店 | 只在线刷新；离线展示上次缓存与时间戳 |
| 内容审核 | 活动的任务步骤、奖励兑换、晋升细节、来源可信度 | API 缺失时不得自动臆造 |

## 2. 数据结构扩充

建议在原 PRD 的基础上定义：

```ts
type Verification = 'official'|'community'|'manual'|'unverified';
type Provenance = { sourceUrl?:string; checkedAt?:string; gamePatch?:string; verification:Verification };
type NodeDependency = { nodeId:string; kind:'hard'|'recommended'; reason?:string; provenance?:Provenance };
type TechNode = { id:string; titleZh:string; titleEn?:string; category:string; dependencies:NodeDependency[]; uiPosition?:{x:number;y:number}; goalIds:string[]; source?:Provenance };
type EquipmentStatus = { itemId:string; owned:boolean|'unknown'; mastered:boolean|'unknown'; formaCount?:number; incarnonStages?:Record<string,boolean>; completedBuildIds:string[] };
type Activity = { id:string; titleZh:string; startsAt?:string; endsAt?:string; source:Provenance; requirements:string[]; tasks:ActivityTask[]; rewardOffers:RewardOffer[]; isComplete:boolean|'unknown' };
type RewardOffer = { rewardId:string; quantity:number; cost?:{itemId:string;amount:number}[]; limited?:boolean; priorityOverride?:number; source?:Provenance };
type ActivityTask = { id:string; activityId:string; descriptionZh:string; requirements:string[]; rewards:string[]; source?:Provenance };
```

个人档案、任务、装备、兑换奖励间通过稳定 ID 关联，严禁用中文名称作为数据库主键。

## 3. 目标与任务评分（M2）

不可先确定收益再编造获取速率。对于有实证数据的候选任务，评分考虑：硬解锁是否满足、是否获得用户缺的材料、是否推进主目标、活动剩余时长、90分钟内可执行、组队难度、额外资源收益。数据不全时显示“推荐候选：需要核实”，不给精确分钟或收益估计。

活动评估结果应至少显示：

- **能否参加：** 已满足 / 缺前置 / 未确认，以及缺少哪个任务、MR、集团、装备。
- **是否建议参加：** 必拿限时 / 建议获取 / 以后再说 / 不推荐刷；必须标注理由。
- **如何打：** 任务类别、建议装备（如当前托里德、瓦喵、伯斯顿 Prime、组队备选）、易失败点。
- **优先兑换：** 限定非复刻奖励先、稀缺升级资源其次、可交易或可反复获得奖励靠后；允许用户自行调整。
- **可信度：** 官方实时 API / 官方活动页人工确认 / 社区讨论 / 未核实。

## 4. 联网活动抓取（M4，M0不实现）

1. WFCD World State API 获取 events/news/voidTrader/nightwave/current cycles 等摘要；只相信实际存在的字段。
2. 对官方网页建立**受控人工录入**流程：检索官方公告、提取奖励与任务、玩家确认后纳入动态资料库。无活动细节时仅显示摘要与原文链接；不自动生成确定的兑换路线。
3. 缓存有 `fetchedAt`、`expiresAt`、`sourceUrl`、`patch` 与 `reviewedAt`；断网显示最后同步结果及“可能已过期”。
4. MVP 不需要在线 AI，也无需账号后台；后期可有按需触发的 AI 分析模式，必须由用户同意与自付 API 费用。

## 5. 开发顺序（“对标审查”增加为 M-1）

- **M-1（现成项目审核）**：Tenno Hub：许可证、有无成熟硬前置/集团算法、源数据、中文映射、PWA 离线、个人信息方案。做书面 buy-vs-build 决策。不擅自拷贝代码。
- **M0（应用骨架+迁移）**：Vite React TypeScript；移动/桌面布局；IndexedDB/Dexie；PWA；原科技树 JSON 导入预览；通用节点结构；账号可编辑；JSON 导出恢复；至少5项单元测试，实机离线测试步骤。
- **M1（集团声望和制作缺口）**：从可靠来源导入并核实逐级晋升材料；库存共享计数；负声望处理；可设置目标等级，缺口与天数估算；可视化科技树联动。
- **M2（90分钟推荐）**：任务推荐引擎，可靠刷取方法/额外奖励/已解锁判断；加入科技树界面与全局搜索；目标排序可手动覆盖。
- **M3（装备 Wiki）**：中文装备、MOD、赋能、灵化与可靠配卡；按用户库存显示需补物品；源数据与个人状态独立。
- **M4（活动联网）**：世界状态与官方公告；活动入场条件、奖励优先级、对用户适配评分；缓存失效标记；可选安装提醒。

## 6. PWA与同步定义

- PWA 离线安装需要 HTTPS 或 localhost；通过手机/电脑分别安装，两个设备的 IndexedDB **不会天然互通**。
- M0 使用手动 JSON 导出/导入；未来如要跨设备自动同步，另做云账户 / 冲突合并方案，明确隐私和费用。
- PWA 更新不能重置 IndexedDB；迁移可回滚。若用户不安装，只在线使用亦可（本地保存视浏览器设置而定）。

## 7. 安全要求

- 不收集/上传 Warframe 密码、Steam/Codex/API Token、Cookie；不默认使用读取游戏内存或非官方登录流程。
- 可选外部资料导入：先在本地预览，明确用户导入的数据种类和权限；未核实第三方方案不能标成零风险。
- 用户复制链接/PWA 与静态网页不能自动获取游戏个人档案。
- 不经许可复制第三方仓库；查看 LICENSE/NOTICE 后再确定能否重用。

## 8. 验收示例

- MR12、英择谛2级、大嘴蓝图已拥有：目标“大嘴”必须提示“先核实铸造材料”，不让用户重刷蓝图。
- 科维兽1级：查询 1→2 当前声望和晋升材料缺口，材料名称采用中文+英文；不确定数据突出标注。
- 原科技树 29 节点 JSON 状态/笔记导入不会丢失；推荐依赖与硬依赖分离。
- 对尚无证据的活动奖励不提供虚构清单；离线时不把上个月活动显示为正在进行。
- 完成瓦喵生存改造目标能触发科技树和推荐器同时更新，不需要两个地方勾选。
