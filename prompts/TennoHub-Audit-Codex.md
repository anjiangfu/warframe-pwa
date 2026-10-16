# Codex任务 M-1：先行对标审查（**不修改代码、不复制第三方源码**）

请阅读本项目 README、docs/Original_PRD_v1.md、docs/PRD_v2_Architecture.md、docs/Research_and_Reuse.md 及 data/tech-tree-seed.json。再审查公开项目 https://github.com/appl3tree/Tenno-Hub 。

约束：
1. 仅做技术调查，不导入或复制其源码到正式项目，不执行其中脚本，不安装未知依赖。
2. 检查：明确许可证/NOTICE、项目活跃度/测试完整性、22+集团晋升数据来源、敌对模拟、库存/目标依赖图、PWA离线机制、中文翻译、数据导入安全、手机适配。
3. 如许可证不明确，归类为“只参考设计/算法思想，禁止复制代码”；必要时为联系作者列出待授权问题。
4. 分别列出 A. 适合直接接入（有确定许可的第三方数据/组件），B. 适合借鉴、独立实现，C. 不适合当前手机+Windows离线PWA 的功能。
5. 输出 docs/TennoHub_Audit_Result.md，包含证据链接、风险、改造/独立实现对比。结论允许是“审查不足，暂不采用”。
6. 停止，等待确认是否开始M0。
