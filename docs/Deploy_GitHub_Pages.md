# GitHub Pages 部署与手机端安装指南

本仓库已配置自动部署工作流 [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml)，推送到 `main` 分支后会自动完成 `lint`、单元测试、子路径 `APP_BASE` 适配构建与 HTTPS 发布。

## 一、首次发布（约 3 分钟）

1. **在 GitHub 新建仓库**
   - 登录 GitHub，点击右上角 `+` → `New repository`。
   - 仓库名例如 `warframe-pwa`（公开仓库免费启用 GitHub Pages；不需要勾选 README / .gitignore）。

2. **将当前完成分支合并到 `main` 并推送**
   在项目根目录（`d:\wf\Warframe_PWA_Handoff_20261016`）的 PowerShell 中执行（先将 `<你的GitHub用户名>` 和 `<仓库名>` 替换为实际值）：

   ```powershell
   git checkout main
   git merge --ff-only feat/worldstate-90m-console
   git remote add origin https://github.com/<你的GitHub用户名>/<仓库名>.git
   git push -u origin main
   ```

3. **在 GitHub 开启 Pages（GitHub Actions 模式）**
   - 打开仓库页面 → `Settings` → 左侧 `Pages`。
   - 在 **Build and deployment → Source** 下拉选择 **GitHub Actions**。
   - 切到顶部 `Actions` 标签页，等待 `Deploy Tenno PWA to GitHub Pages` 变绿（约 1~2 分钟）。
   - 完成后页面会显示正式 HTTPS 地址：`https://<你的GitHub用户名>.github.io/<仓库名>/`。

## 二、手机端安装成桌面 PWA（电脑玩游戏时的副屏）

- **Android（Chrome / Edge）**：用浏览器打开上面的 HTTPS 地址 → 点击右上角菜单 `⋮` → 选择 **「添加到主屏幕 / 安装应用」**。
- **iPhone（Safari）**：打开地址 → 点击底部分享按钮 → 选择 **「添加到主屏幕」**。
- **建议用法**：把**手机端**作为唯一主档案（进去把段位改成当前段位，例如 MR14），电脑专心打游戏；如需跨设备备份，使用应用内 **「备份与恢复 → 导出完整备份」** 即可。

## 三、数据与安全说明

- 个人档案、今日行动台排程、活动人工核实记录均仅保存在**你当前设备的浏览器 IndexedDB** 中，不会上传到 GitHub 仓库或任何第三方服务器。
- 点击「同步 WFCD 世界状态」时仅向公开只读接口 `https://api.warframestat.us/pc?language=zh` 发起无凭证（`credentials: 'omit'`）GET 请求。
