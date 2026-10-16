# 给 Codex 的下一条指令（仅执行 M-1）

你是该项目的技术负责人。请依次阅读：
- `AGENTS.md`
- `docs/PRD_v2_Architecture.md`
- `docs/Code_Review_Tech_Tree.md`
- `docs/TennoHub_Initial_Audit_2026-10-16.md`
- `data/tech-tree-seed.json`
- `reference/Original_Tech_Tree.html`

项目要点：Windows/安卓双端、离线优先 PWA、中文优先、可编辑账号、集团晋升与材料缺口、科技树、未来联网活动。用户确认无法凭英文版 Tenno Hub 做实用性评估，全部代码技术判断由你完成。

本次工作**只做 M-1 技术核查与决策，不写 M0 代码**：
1. 在临时隔离目录审查 `<https://github.com/Appl3Tree/Tenno-Hub>` 的许可证、架构、集团/目标/库存模型、数据来源、实际 PWA 支持情况、导入安全与移动端适配。
2. 不将来源许可不明的第三方代码复制进项目。未经审批，不安装未知依赖、执行下载脚本或通过项目向网络发送账号数据。
3. 以用户的 7路线29节点科技树为 UI 起点，并评价迁移为 React 数据组件的工程量；保留既有节点 ID 与 JSON 备份的兼容计划。
4. 结合 Tenno Hub 已确认的领域功能，明确哪些模块必须独立开发，哪些公开数据源可按其许可证接入。所有未核对版本/祭品项显示 `unverified`。
5. 检查 PWA 在 HTTPS/localhost 的离线要求、IndexedDB 迁移策略、手机缓存与版本更新。不要声称 `file://` 本地 HTML 就是 PWA。
6. 给出 2 条实施路径的对比：A 独立 React+科技树迁移，B 经授权复用 Tenno Hub；包括风险、中文成本、数据更新、个人账号迁移与大致工程量。
7. 生成 `docs/TennoHub_Audit_Result.md` 与 `docs/M0_Implementation_Plan.md`，前者每个事实要有指向文件或网页的证据；后者只包含 M0 的文件目录、模块、测试、验收和工序。
8. 完成后停止，等待我批准 M0。报告未验证的内容和需要用户选择的最少事项，不得自行增加订阅或云服务。
