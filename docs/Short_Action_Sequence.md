# 5步启动顺序（发给用户的简版）

1. 在 Windows 中建 `D:\projects\warframe-planner`，解压本包，确保含 `AGENTS.md` 和 `data/tech-tree-seed.json`。
2. 在该目录用**非管理员** PowerShell 打开 Codex，先发 `prompts/TennoHub-Audit-Codex.md` 的全部内容。输出审查报告。
3. 在 Git 仓库中备份这一阶段（确保 `git status` 干净）。
4. 发 `prompts/M0-Codex.md` 让它实现可编辑、可离线、可恢复的 PWA。不要一次安排 M0–M4。
5. 在Windows浏览器进行离线、备份恢复测试；安卓通过部署到 HTTPS 的临时测试地址或同局域网 HTTPS 服务测试安装性。**裸IP HTTP 只能测试页面，不一定允许 Service Worker 安装。**

费用：继续使用Plus时，开发阶段的强制新增费用为0；托管先用免费额度。未来添加联网活动也不必必须引入AI API，世界状态可走免费接口；自动整理活动任务可设置“人工校验”步骤。
