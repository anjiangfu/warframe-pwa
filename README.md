# 星际战甲 PWA 项目交接包（2026-10-16）

这是一份**可交给 Codex / CodeBuddy / DeepSeek+OpenCode 的开发资料包**，不是已经完成的 PWA。请从 `prompts/M0-Codex.md` 开始，第一轮只完成 M0，测试通过后再交付 M1。项目目标：中文优先、Windows + Android、离线优先、进度可迁移、MR12→MR18、可扩展到联网活动推荐。

## 文件目录

- `reference/Original_Tech_Tree.html`：用户此前制作的完整科技树参考，**只作参考/迁移输入**，不作为最终生产代码。
- `data/tech-tree-seed.json`：从原 HTML 中提取的 **7 条路线、29 个节点** 和原始前置关系。包含推荐性依赖；迁移时必须区分“硬前置”与“建议顺序”。
- `docs/Original_PRD_v1.md`：原需求文档，保留供追溯。
- `docs/PRD_v2_Architecture.md`：加入科技树、数据源、联网活动、版本化数据、验收的需求更新。
- `docs/Research_and_Reuse.md`：GitHub、B站、抖音和现成数据源调查；版权与安全注意事项。
- `docs/Code_Review_Tech_Tree.md`：原 HTML 的代码审查、迁移建议、风险。
- `docs/Budget_and_Workflow.md`：费用区间、Plus 额度的边界、多编程 Agent 协作办法。
- `prompts/M0-Codex.md`：可直接复制进 Codex 的第一轮任务。
- `prompts/TennoHub-Audit-Codex.md`：先行对标现成项目的审查任务，不得直接未经许可复制。
- `prompts/LowCost-Agent.md`：交给低成本编程 Agent 的独立任务。
- `AGENTS.md`：仓库内 Agent 工作规约，未来可放到实际项目根目录。

## 推荐使用方式

1. 将本包解压进 Windows 上一个**不含中文/空格**的开发目录，如 `D:\\projects\\warframe-planner`。
2. 原科技树和模型独立保存，不要在未经备份时改动参考文件。
3. 先运行 `prompts/TennoHub-Audit-Codex.md`：核查是否可以借鉴数据算法、许可证、离线/中文适配。把审查结论记录到项目 issue/文档。
4. 然后运行 `prompts/M0-Codex.md`，只做可运行 PWA 骨架 + IndexedDB + 导入/导出 + 兼容原科技树存档的**预览迁移**。
5. 测试 Windows 和安卓：在真实 `localhost` / HTTPS 下测试 PWA；不要用 `file://` 测试 Service Worker。
6. 每完成一个里程碑提交 Git；Codex 做合并与审查，低成本 Agent 做独立且可验证的小任务。

## 必须遵守

- 绝不要求玩家提供 Warframe 密码、Steam 登录令牌、游戏 Cookie 或进程内存读取权限。
- 绝不将 `未知` 解释成 `零`，绝不臆造声望晋升材料与掉落率。
- 游戏装备、MOD、掉落与社区名称以**稳定 ID + 中英双名 + 来源日期**记录。
- 官方活动 API 通常只有活动概要：任务、奖励、兑换优先级需通过**来源标记 + 人工确认/审核**补充。
- 现成项目的公开源代码需查看仓库许可证，未确认授权前只借鉴抽象设计，不直接复制代码。


## 2026-10-16 对标调查补充（建议从这里开始）

- `docs/TennoHub_Initial_Audit_2026-10-16.md`：已核实的公开架构、许可与中文化/离线风险、现阶段 buy-vs-build 决策。
- `prompts/TennoHub-Audit-Codex-Next.md`：下一步直接交给 Codex 的受限 M-1 审查指令，审核结束后才批准 M0。

当前默认路径：用户原创互动科技树 + 自建中文离线 PWA，Tenno Hub 仅作功能领域与架构参考，不复制无许可代码。
