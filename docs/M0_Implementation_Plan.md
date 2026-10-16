# M0 实施计划：中文离线骨架与原科技树迁移

状态：**2026-10-16 路径 A 的 M0 实现完成、实机验收未完成。** 按五个 Git 检查点交付，实际结果和待验项见 [验收记录](M0_Acceptance_Record.md)。只做 M0，不合并 main、不推送、不公开部署。技术选型依据见 [M-1 审核](TennoHub_Audit_Result.md)。

## 批准后的约束补充

- 实际使用 DataProvider 接口和 LocalProvider；组件不导入第三方/seed 响应。未来远端必须经验证、转换、缓存，本次无远程请求/插件系统。
- 所有个人记录按 profileId 隔离；个人快照一处存储目标状态，组件通过 repository 访问，revision 乐观并发控制。
- nodeId 保留旧值，goalId 显式映射；itemId 不与节点混用；87 个 stepId 冻结。目录更新/失去引用不删除个人状态。官方/社区/用户来源与 verified/unverified/conflicting 分开。
- DB version、backup schemaVersion、catalogVersion、build ID 各自管理。未来 ActivityDefinition 与 ProfileActivityState 分离；用户优先级只属个人状态。
- 升级在 versionchange 事务中先读取完整旧记录，写入同事务 snapshots 并确认可读，失败中止整个升级；未来迁移必须通过此前置步骤。旧应用发现新库只提示，不写、不删、不降级。多标签页及 SW 更新统一写入暂停屏障，等待未完成写入后确认切换；无法协调的旧标签页必须关闭。
- 旧档保留 ArrayBuffer 原字节与 SHA-256；预览/取消不写库。确认时事务备份并检查 revision；幂等键为 targetProfileId+sourceHash，允许同档恢复到另一档案。整档恢复，不做字段自动合并。
- U01—U10 全部执行；追加多档隔离、Provider、目录孤立引用、来源三态、失败提示和多标签页更新验证。fake-indexeddb 不代替浏览器关闭重开。
- 计划、契约和验收矩阵先提交；数据恢复、中文界面、PWA、最终交付依次提交。每次 diff 审查，记录实际验证；测试/类型/lint/build 未通过不把失效状态作为检查点。
- Windows 生产构建实测；Android 真机/信任 HTTPS 不可用时列待验步骤，只能报告实现完成、实机验收未完成。
- 原始输入 hash 见 evidence/M0_Input_Hashes.json；除本计划按授权更新外，原 HTML、seed、交接资料和审核报告不改。契约见 M0_Contracts.md，验收状态见 M0_Acceptance_Record.md。

## 1. 实际交付目录

```text
app/
  package.json / package-lock.json      # 固定依赖与 dev/test/lint/build/preview 脚本
  index.html / vite.config.ts           # React/TS 入口、部署 base 与 PWA 配置
  tsconfig.json / eslint.config.js / playwright.config.ts
  public/icons/                        # 本项目原创安装图标
  public/THIRD_PARTY_LICENSES.txt       # 随应用缓存的运行时许可
  scripts/sw-template.js               # 自行编写的 SW，由构建替换资源清单
  scripts/create-icons.mjs / subpath-smoke.mjs
  scripts/collect-licenses.mjs / run-quality.mjs / verify-delivery.mjs
  src/
    main.tsx / App.tsx / styles.css
    features/ProfilePanel.tsx           # 账号、库存、预算
    features/TechTree.tsx               # 原树、视口、详情、自定义节点
    features/BackupPanel.tsx            # 预览、确认、导出和原件下载
    domain/model.ts                    # 数据契约、四类版本和硬条件三态
    catalog/provider.ts                # DataProvider / 实际使用 LocalProvider
    catalog/tech-tree.v1.json           # 从用户 seed 规范化，保留原 ID
    catalog/legacy-step-map.v1.json     # 冻结 87 个步骤的旧索引→stable ID
    storage/db.ts                      # Repository、事务、并发与升级快照
    storage/imports.ts                 # 校验、纯映射、原件和备份
    pwa/UpdateNotice.tsx                # 注册、等待和多页更新握手
    test/data.test.ts                  # 16项数据测试，合成输入
  e2e/                                 # 8项生产 Chrome 操作测试
  README.md                            # Windows 启动、手机 HTTPS、备份和更新步骤
  licenses/THIRD_PARTY_LICENSES.txt      # 已安装开发依赖完整许可/NOTICE
THIRD_PARTY_NOTICES.md                  # 许可清单与图标来源
docs/M0_Acceptance_Record.md             # 实际命令输出、截图、设备与未验证项
```

Vite 配置内的小型自有构建插件生成 manifest 和资源清单，使用自有 SW 模板；没有引入通用 PWA 插件框架。原 `reference/Original_Tech_Tree.html`、`data/tech-tree-seed.json` 和其他受保护输入均未修改。

## 2. 模块与边界

| 模块 | M0 要求 |
|---|---|
| 工程骨架 | Vite + React + TypeScript、Dexie/IndexedDB、Vitest；优先原生 CSS；Node/依赖版本实施时检查兼容和许可后锁定。 |
| 个人档案 | 可编辑 MR（默认 12 可改）、目标 MR（默认 18 可改）、每日时间（默认 90 可改）、主要战甲/备注。未知字段存 null/unknown，与明确 0 区分；资料只在本机。 |
| 目录/事实 | 游戏模板作为版本化静态 JSON；7 路线 29 节点、30 条旧 deps 全为推荐关系，根节点 origin 单独识别；保留来源、checkedAt、verification。未经证实的游戏条件/数值显示 unverified。 |
| 科技树 | 原配色/节点布局作为起点；拖拽、双指/滚轮缩放、缩放按钮、小地图、路线定位/折叠、节点搜索、详情、状态/步骤/笔记；中文可读。自定义普通节点可新增，ID 独立且稳定；进度和 notes 刷新不丢。 |
| 状态一致性 | 同一 goalId 的状态只保存一份，树/详情/档案页读同源；完成 MR 节点不自动提高账号 MR；建议关系不阻止手工完成；硬条件以三态函数表达，M0 用合成测试，不录入未经核实门槛。 |
| 本地存储 | DB version、export schemaVersion、catalogVersion、build ID 分离。实际四表 profiles、snapshots、imports、meta；profile 文档聚合 statuses、steps、notes、stock、budget、customNodes、events、legacyArchive 和 originals，单份目标状态便于一致快照和整档事务恢复；不为各视图复制状态。 |
| 外部动态接口 | 仅留类型边界/“尚未同步”状态，不请求在线活动、不建立假活动数据。不实现集团计算、装备百科、自动账号读取、推荐算法、订阅或云同步。 |
| PWA | manifest、自有图标、应用壳与小型目录离线缓存、SW 更新等待/保存后确认切换；清缓存仅限本应用版本缓存，不删除 IndexedDB。 |

## 3. 原档导入、迁移与恢复工序

1. **读取与校验**：只读本地 JSON，限制字节/集合数量/文本长度及有限数值，拒绝损坏、过新版本、异常结构和危险对象键；不执行 HTML/脚本。类型错误不静默变成 0。不认识的数据在容量限制内隔离保留，不能直接作为页面 HTML。
2. **识别格式**：旧 `version:1` 裸状态与新备份分别解析；seed 是目录，不当用户备份。新版备份含 schemaVersion/catalogVersion/profile/自定义节点/存档数据与必要来源字段；未知新版本报错、不写库，用户所选原文件保持不变。旧档上限2 MiB，新完整备份上限8 MiB，容纳内嵌原件。
3. **确定性映射**：rank→masteryRank；statuses→原 goalId 状态；steps→冻结的 v1 stepId；notes 原文保留；stock→库存稳定 ID；budget→个人预算；events→原时序日志；未知节点/字段→legacyArchive。缺少 status 按旧 status() 的 todo 语义，不注入初始六个 done；显式零保留，缺失库存为 unknown。
4. **导入预览**：显示格式/版本、29 节点匹配情况、状态/步骤/笔记/库存/预算/日志数量、冲突、新增、自定义节点及未知字段、验证警告和恢复策略。选择目标档案；M0 提供“新建本地档案”或明确确认的“整档恢复”，不承诺字段级跨设备自动合并。默认不覆盖已有档案，取消不写任何数据。
5. **确认并提交**：确认前保存当前可恢复快照与导入原字节 hash；事务中写 profiles、snapshots、imports，并检查 meta 写屏障。相同档案重复确认不重复造日志/步骤/节点；UI 时间戳由外层提供，迁移纯函数不读系统时钟。处理并发修改：预览生成后档案 revision 变更则要求重新预览。
6. **回滚与版本升级**：事务失败保留旧状态并报错；升级前创建可读取的备份。versionchange 关闭旧连接并提示，多标签页 blocked 时给可理解提示；禁止自动删库。应用降级不尝试降低同库版本，使用兼容恢复流程。
7. **导出恢复**：支持新格式完整 JSON、原 v1 输入原字节再下载。用测试专用档案/浏览器 profile 验证恢复；不为验证而清用户真实应用数据。跨 Windows/Android 使用文件手动交换，每次先预览、确认；不宣称自动同步。

## 4. 测试清单与质量命令

完整执行以下 U01—U10，其中单元层使用 Vitest，IndexedDB 集成使用许可核验后的 fake-indexeddb 或隔离浏览器。不能用内存 mock 代替真正关闭/重开数据库验证。另实跑 `npm run typecheck`。

| 编号 | 输入/操作 | 必须断言 |
|---|---|---|
| U01 | 全 29 节点的合成 v1 档：三种状态、87 步骤、中文笔记、库存/预算/日志 | ID 和所有记录映射正确；原档字节可再导出；未知字段保留；缺 key 不重新变 done。 |
| U02 | 同一档重复迁移/重复确认 | 数据/ID 不重复，迁移幂等；取消/预览阶段无数据库变化。 |
| U03 | 新目录追加节点/原步骤改显示顺序 | 旧 29 节点状态笔记和 stepId 不变，自定义节点不被目录覆盖。 |
| U04 | 写档案/状态/中文笔记，关闭数据库连接再打开 | 真正从持久化层恢复，0 与 unknown 均保留。 |
| U05 | JSON 损坏/超限/NaN 类异常/过新版本/危险键 | 拒绝或隔离，无部分写入；用户可理解错误。 |
| U06 | 推荐未完成、硬条件分别满足/未满足/未知 | 建议不锁定；硬条件正确返回三态，未知不当已满足或零。 |
| U07 | 导入冲突、预览后并发修改、事务中注入错误 | revision 冲突要求重新预览；失败恢复旧状态；明确确认后才恢复。 |
| U08 | 新格式导出→测试新档案导入 | profile/原节点/自定义节点/笔记/预算/库存/日志逐项相等。 |
| U09 | 模拟 DB versionchange/blocked、重复升级 | 提示可关闭旧标签页；升级无重复和默认值覆盖，备份可读取。 |
| U10 | 节点笔记为含 HTML/脚本的普通字符串 | React 按文本显示，脚本不执行；自定义节点 ID 与原节点不冲突。 |

批准实施后创建并实跑 `npm run lint`、`npm test`、`npm run build`；生产 PWA 测试用 build + preview/HTTPS，不能仅测 Vite dev。记录命令、退出码、测试计数、构建资源清单和失败修复；生成 manifest/SW 需要检查 start_url/scope/base 在最终 URL 下匹配。不同部署 base 的恢复入口也要验证。

## 5. Windows/Android 验收

| 场景 | 操作与通过条件 |
|---|---|
| Windows 本机 | 在 localhost 打开生产构建；编辑账号、节点、步骤、中文笔记、自定义节点，刷新/关闭重开后保持；无英文占位主操作。 |
| 原树兼容 | 导入合成的覆盖全部 29 节点 v1 档，先看预览再确认；核对全部记录并重新导出；未知字段不丢，不能要求重新勾选。用户真实备份待用户自愿提供后另测，不作为已经获得的输入。 |
| 安卓安全来源 | 使用手机信任的 HTTPS；普通 `http://电脑局域网IP` 只测布局，不记为 SW/安装通过；不要求关闭浏览器安全功能或信任未知证书。没有合适 HTTPS 时如实记未验收，另定部署方式。 |
| 安卓交互 | 记录浏览器/系统版本；约 360px/412px 竖屏及横屏操作，详情软键盘不挡保存；双指缩放、拖拽不误点完成，路线/搜索/小地图可到节点；主要点击目标尽量至少 44 CSS px。 |
| 安装与断网 | 安装入口/图标正常；首次在线加载完成并确认 SW 控制，覆盖树/档案/备份等路由；断网关闭重开、刷新深链接仍可用且数据保持。首次从未缓存就断网不可用须给明确说明，不伪报已缓存。 |
| 更新 | 在测试 origin 放 v1，制造未保存修改后提供 v2；出现中文更新提示，稍后更新继续可用；确认后等待写完再切换。升级后旧数据、29 ID、自定义节点、备份均在；多标签页有提示。 |
| 失败与恢复 | 模拟 IndexedDB 拒写/配额错误，禁止假报保存成功；在专用测试档案做导出→清测试数据→预览恢复；完整一致。清缓存与删除档案是分开的用户操作。 |
| 网络与隐私 | M0 没有第三方账号/API请求、遥测、云上传、游戏登录；安装资源同源、自有/许可明确。无网时不显示“正在进行”的伪活动，只显示尚未同步。 |

以上 Windows/安卓实机都要留下截图与操作记录；没有真机证据的项目保持未验证。最终验收记录区分单元测试、数据库集成、桌面浏览器和安卓真机结果。

## 6. 实施工序和停点

1. 收到用户明确批准 M0 后开始；保留输入 hash 和本地 Git 基线，建立 M0 工作分支。若以后批准多 agent，按 AGENTS.md 各自 worktree/分支，本计划本身不授权并发或第三方 agent。
2. 核查所选依赖官方包、版本兼容、锁文件与许可；只为 M0 安装已确认依赖，不运行 Tenno Hub 更新/生成脚本；建立工程和质量命令。
3. 先定义数据契约、冻结原 ID/step 映射和合成 fixture，完成导入/迁移/数据库测试；再接 profile/备份界面，保证预览先于写入。
4. 实现树组件、响应式与触控、自定义节点；所有用户文字走 React 文本节点；测试与原目录对照。
5. 完成 manifest/SW、离线资源与更新提示；在生产构建及测试 origin 验证离线/更新/恢复，记录资源大小。M0 不打包大型外部资料。
6. 运行 lint/test/build，审查 diff 和许可清单；补 Windows/安卓验收。若真机测试不可执行，明确列未验收，不把 milestone 宣称为全部通过。
7. 写 `docs/M0_Acceptance_Record.md` 和 app README，提交 Git commit，提供文件清单、实跑命令/结果、局限与设备步骤；完成 M0 后停止，等待下一 milestone 授权。
