# AGENTS.md – Warframe Planner Agent 约束

1. 本项目中文优先；战甲、MOD、赋能、材料呈现中文名（英文名）或已确认俗称，不许只用英文占位。
2. 增量开发：一次只做请求的 milestone；任务之外不大规模重构。修改需通过测试、build、Git commit。
3. 先读 docs/PRD_v2_Architecture.md、docs/Code_Review_Tech_Tree.md；不得以原 HTML 的 hardcoded `deps` 直接表示硬性游戏门槛。
4. 个人档案与游戏事实彻底分离：profile state (IndexedDB), game catalog (versioned static data), online events (cache with TTL)。绝不保存游戏登录凭证。
5. 不确定的配方/等级/掉率/活动任务标 `unverified`，不生成伪精确计算。来源/检查日期必须可追溯。
6. 数据实体 stable id；格式迁移函数可重跑、幂等；先生成导入预览，不无提示覆盖已有个人存档。
7. PWA 从 HTTPS 或 localhost 提供；更新 Service Worker 时给用户可理解的提示，不能清除用户数据。
8. 先验许可证再复用第三方代码。MIT/Apache 等也需要适当保留声明；未知许可不得复制代码。
9. 所有与第三方 AI agent 交互通过明确的命令行/接口与人工审批，限定工作目录。禁止自行联网发送凭证或执行危险脚本。
10. 多 agent 通过独立 Git 分支/独立 worktree 协作，Codex 负责 code review 与合并，禁止并发直接写 main。
