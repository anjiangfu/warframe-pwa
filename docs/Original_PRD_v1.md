# 星际战甲 MR12→MR18 中文交互养成百科 —— 开发交接文档（PRD v1.0）

编制日期：2026-10-16。服务对象：PC 国际服个人玩家；每天约 1–2 小时；接受单人和公共队伍；追求低维护、中文优先、重点装备一步到位。

## 0. 项目一句话定义

做一个**离线优先 PWA 网页应用**，集「中文 Wiki」「个人账号进度记录」「升级/制作材料缺口计算」「根据可玩时间推荐下一步任务」「配卡手册」于一体。数据必须能本地保存、导出 JSON、导入恢复；不能依赖 ChatGPT 的对话记忆，不需要玩家提供账号密码。

### 账号预填（可编辑，不当作不可改变的事实）

- MR12；目标 MR18，单日游戏时间 90 分钟（可改），每日常规集团声望上限初始参考 22,000（逐集团校验）。
- 武器：托里德灵化 6 Forma，核心 MOD 接近满级，100+ 普通敌人表现良好；伯斯顿 Prime 灵化已完成；毒囊双枪已纳入路线；海波单剑灵化最后进化挑战未完成；驱魔之刃、执法者灵化已拥有。
- 常用战甲：Valkyr Prime（瓦喵）；Caliban Prime（卡利班 Prime）后续再养；Wisp Prime、Xaku Prime、Titania Prime 等已有。
- 集团：新世间 5，佩兰数列 4，血色面纱与均衡仲裁者中立，中枢苏达和钢铁防线负声望；英择谛家族/殁世幽都 2，科维兽 1，扎里曼坚守者 1，六人组 2；夜羽 1，Ostron 0，索拉里斯联盟相关接近未启动；其他按 0 或“待确认”记录，不得猜测。
- 大嘴：基础 Helminth 模块蓝图已拥有，缺制作材料；主线已完成、钢铁之路已开启；赤毒玄骸/姐妹及感染者玄骸等系统处于学习/启动阶段。
- 资金：较充裕的白金与内融核心，但现金有阶段性短缺。具体数值由用户编辑。

## 1. 功能优先级与版本范围

### MVP（第一个可用版本）

1. **仪表板**：MR、游戏时间、今日建议前 5 项、即将晋升集团、制作中装备、最近编辑时间。
2. **集团页面**：至少英择谛、科维兽、六人组、扎里曼坚守者、索拉里斯联盟、夜羽、Ostron、索拉里斯之声、六大普通集团。每个集团可填 rank（负等级也可）、当前 standing、代币/声望存货、每日上限是否已用。列出逐级门槛、晋升材料、NPC、任务推荐、顺路收益、数据来源与更新时间。
3. **材料库存**：中文名称、英文名称、别名、当前数量、所需数量、可重复用于多个目标的共享库存；显示短缺和刷取方法。
4. **目标与依赖**：勾选“英择谛→3级→大嘴”“瓦喵提升生存”“科维兽→5级”“MR18”等，自动展开前置条件；“待确认”项目不参与精确天数估算。
5. **任务推荐器**：给定每天 30/60/90/120 分钟，按可进入任务、待完成目标、预估耗时与顺路收益排序。显示“为什么推荐”“需要组队吗”“不确定性”。用户可手动标记任务已做。
6. **搜索**：战甲/武器/MOD/赋能/材料中文优先，英文名与俗称均可搜索。
7. **本地持久化**：IndexedDB；JSON 导入/导出与恢复；版本号和迁移；可离线打开。

### 第二阶段

- 战甲和武器完整页面、每套 8 槽中文 MOD/赋能/灵化进化/极化数量/用途；当前可用与 MR18 后可用区分。
- 装备持有、是否已满级、Forma、灵化进化完成进度与配卡完成度。
- 各集团晋升路线上的逐项素材卡片，可反向检索“掉落/保育/采矿/钓鱼/商人兑换/前置任务”。
- 资源攻略：“单项最快”和“多个目标顺路最优”分开展示。
- 常见问题知识库；来源版本标注和过期警告。

### 第三阶段（可选）

- 以非账号数据为限接入 Warframe 世界状态接口：活动、虚空商人、轮换、警报等。
- 可选云端多设备同步（单独评估账号体系、成本与隐私）；不要在 MVP 里强行实现。
- 截图半自动录入：必须先给用户预览并确认识别值；任何不确定字段显示“待核对”。

## 2. 技术选择

- Vite + React + TypeScript；Tailwind CSS 或简洁 CSS 设计系统；面向电脑和手机响应式。
- IndexedDB（推荐 Dexie）存个人状态；静态 JSON 存游戏资料；PWA + service worker 支持离线阅读。
- 数据来源建议：WFCD/warframe-items（按其最新说明使用 `@wfcd/items`）提供装备基础数据；WFCD/warframe-drop-data 供掉落数据；api.warframestat.us 供世界状态。中文显示另建 ID→中文名/玩家别名映射。**不应把 API 提供的活动/物品数据误当成个人账号库存。**
- 可部署 GitHub Pages 或静态托管；个人进度默认只保存在本机，不上传服务器。离线修改与恢复全部支持。
- 不要要求玩家上传 Warframe 密码、Cookie、Steam 登录凭证。

## 3. 数据模型约定

所有实体使用稳定 `id`（不拿中文名称作为主键），最少字段：

```ts
type LocalizedLabel = { id:string; zh:string; en:string; aliases:string[] };
type SourceMeta = { url:string; checkedAt:string; patch?:string; confidence:'confirmed'|'community'|'estimated' };
type RankStep = { factionId:string; fromRank:number; toRank:number; standingRequired:number; sacrifices:{itemId:string; amount:number}[]; prerequisites:string[]; source:SourceMeta };
type AccountFaction = { factionId:string; rank:number; standing:number; todayStandingUsed?:number; verifiedAt:string };
type InventoryEntry = { itemId:string; amount:number; updatedAt:string };
type Goal = { id:string; kind:'rank'|'craft'|'equipment'|'unlock'|'mission'; targetId:string; state:'todo'|'doing'|'done'; priority:1|2|3; dependencies:string[] };
type FarmMethod = { id:string; label:string; unlocks:string[]; rewards:{itemId:string; estimatedAmount?:number}[]; minutesEstimate?:[number,number]; squad:'solo'|'either'|'team'; source:SourceMeta };
```

数据文件至少拆为：`factions.json`, `rank_steps.json`, `materials.json`, `farm_methods.json`, `equipment.json`, `mods.json`, `name_aliases.json`, `user_profile.json`（用户数据实际存 IndexedDB，只用 JSON 导入导出）。

## 4. 计算规则与错误保护

1. 当前级别声望缺口 = `max(0, 本级晋升声望阈值 - 当前声望)`。
2. 晋升材料缺口 = `max(0, 晋升配方数量 - 当前库存)`；共享材料在**多个目标合计**时不能重复抵扣。
3. 多级晋升按每级独立执行，逐级显示待完成晋升材料与所需声望；不可简单把所有等级声望阈值视为统一公式。
4. 预计天数只算可计算的常规每日声望部分，另展示“需晋升/材料/时间限制”，不可承诺最晚完成日。已达当日上限则显示今日不可再交该集团声望。
5. 负声望、敌对普通集团、联盟/敌对效忠导致的间接声望变化应独立处理；初版可以显示提示与策略，不能错误地把所有普通集团当作互相独立。
6. “最快方法”必须显示前置条件、耗时区间、可变收益、社区/官方来源。缺数据时以“推荐候选”展示，不编造确定的掉落率或分钟收益。
7. 数据缺失或版本过期，优先显示“待核对”，**绝不自动补 0 伪装已确认**。

## 5. UI 导航设计

底部/侧边栏：**首页 / 我的进度 / 集团 / 材料 / 武器战甲 / 今日任务 / 百科 / 设置**。

- 首页优先显示“今天先做的三件事”，卡片点开能看到目的、任务、收益、时间、所需装备。
- 集团列表支持“最值得升”“最快能升”“已达目标”“待确认”。点集团进入逐级时间线与升级素材表。
- 每个材料名可以点开“来源→任务/商人→步骤→顺手收益→耗时估计”。
- 资料使用**中文名优先，英文或俗称括注**；节点、任务地名保留游戏中可直接查找的英文/中文。
- 全局搜索与可复制的名称；提供“已拥有/已完成”复选框，修改后即时重新计算。
- 明暗主题、字号调整、移动端触控友好。

## 6. 开发里程碑（一次只交付一个）

**M0（框架与存档）**：启动项目；中文导航；IndexedDB 记录；JSON 导入导出；3个自动测试。验收：刷新后数据不丢、断网可访问已缓存页面、导出再导入完全还原。

**M1（集团 + 缺口计算）**：至少9个指定中立集团、六大集团；晋升材料表、材料库存与短缺量；测试负声望、跨级目标、材料共享。验收：输入 MR12、英择谛等级2与实际声望/库存后，能列下一次晋升与大嘴前置，而不是给“泛泛攻略”。

**M2（任务推荐）**：90分钟预算、任务卡片、顺路收益、材料/声望联合优先级；列表支持完成勾选。验收：缺大嘴材料时优先显示火卫二相关方法，六人组已满当天额度后降低声望任务优先级。

**M3（装备百科与配卡）**：中文搜索、30把优先武器和10台优先甲起步；逐把 8 槽具体 MOD 与需要的 Forma；所有条目标来源/版本。验收：伯斯顿 Prime、托里德、毒囊双枪、瓦喵和显赫爪页面全部可检索，中文名准确。

**M4（可选接入与发布）**：世界状态 API、部署、PWA 安装流程、安全检查、迁移与恢复演练。

## 7. 验收测试清单

- 测试 A：修改英择谛当前声望后，“尚需声望”即时变化；尚缺晋升材料正确聚合。
- 测试 B：目标“制作 Helminth 模块”应显示“已有蓝图，只缺素材”，不能继续推荐重复获取蓝图。
- 测试 C：MR12 输入 30/90 分钟预算，任务表按时长过滤或提示溢出，支持玩家手动覆盖。
- 测试 D：国际服中文/英文/别名三种搜索方式能找到相同装备。
- 测试 E：没有联网依然能浏览个人资料、已缓存的攻略、填写数据。
- 测试 F：手机、Windows 各自导出 JSON 并互相导入，数据不会被无提示覆盖。
- 测试 G：来源不明的材料不会出现虚构的掉落率、任务或晋升需求。
- 测试 H：瓦喵重做后的生存说明不能套用“旧版4技能全程无敌”。

## 8. 交给 Codex / CodeBuddy / DeepSeek+OpenCode 的第一条任务指令

> 你是一名严谨的全栈工程师。请阅读本 PRD，在当前文件夹创建 `warframe-planner` 项目。**本次只实施 M0**，不允许自行开始 M1–M4；不要调用付费云服务，不要创建需要账号的数据库。请采用 Vite + React + TypeScript + Dexie，完成中文响应式框架、可编辑的 MR/每日时长与示例集团、IndexedDB 保存、JSON 导入导出、离线 PWA 骨架。运行构建和测试，修复失败项，产出 README（Windows 运行命令、后续如何继续开发）和 CHANGELOG。提交 Git 版本。所有版本变动与数据字段必须可追踪；不许编造 Warframe 游戏掉落或晋升配方。完成后汇报修改的文件、测试结果、遗留问题，停止等待验收。

验收 M0 通过后，再单独发送：

> 请按 PRD 完成 M1，严格只修改集团/材料/缺口逻辑和其 UI。把不确定的晋升材料标记“待核对”，不要填猜测值；新增单元测试；运行测试与构建并提交 Git。结束后等待我验收，不要继续 M2。

## 9. 预算与工具分工

- **优先用已有 ChatGPT Plus 的 Codex** 做 M0、M1 的框架和代码审查；五小时是额度窗口，不是总开发时间，使用量还受每周限制。
- **节省用量**：把固定工作拆成 M0–M4，小模型实现 UI/录入，大模型处理架构与复杂计算；每次任务要求构建、测试、提交后停止。
- **DeepSeek**：若“dsh”指 DeepSeek，可用 OpenCode/兼容 Agent + 自己的 DeepSeek API Key 作为第二代码实现者，按 token 计费。提供配额与消费上限，避免自动循环重试。
- **CodeBuddy/WorkBuddy**：国内个人版有免费体验档与订阅积分；持续开发代码优先 CodeBuddy；WorkBuddy 更适合作文件整理和任务执行，不必为同一账号重复订阅。
- 不建议第一版加云数据库或 AI 在线问答：既花钱也让资料准确性更难保证。先把静态规则引擎做对。

## 10. 参考项目与官方资料（开发时再核对）

- OpenAI Work/Codex 使用额度：https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex
- Tencent WorkBuddy 国内定价：https://www.workbuddy.cn/docs/workbuddy/Pricing
- DeepSeek API 文档：https://api-docs.deepseek.com/zh-cn/
- WFCD 物品/资料：https://github.com/WFCD/warframe-items
- WFCD 世界状态：https://docs.warframestat.us/
- Warframe 官方瓦喵重做说明：https://www.warframe.com/en/patch-notes/pc/39-0-0
