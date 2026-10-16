# Tenno Hub 先行审核结论（2026-10-16）

> 本文是**公开文档层面的技术审核**，不是在本地克隆、安装依赖或运行测试后的代码审计。本环境无法直接克隆远端 GitHub 仓库，故任何运行时行为仍待 Codex 在用户电脑上验证。用户无需阅读英文站点或给出技术评价。

## 决策（先行）

**不以 Tenno Hub 作为目前应用的可复制代码底座**；以用户的 `Original_Tech_Tree.html` 视觉与交互逻辑为产品起点，独立开发 Vite + React + TypeScript + IndexedDB + PWA，参考 Tenno Hub 的领域模型、目标依赖、晋升/材料计算方法。此前发现仓库根目录没有可见的 LICENSE 文件、`package.json` 中未检出 license 字段；在取得明确许可前仅学习产品交互/算法思路，不拷贝其源代码、图标、数据文件或可分离的具体表达。

## 已核实的公开项目能力

1. **集团**：README 明确主张 22+ 集团，包含晋升祭品、天数、交易物、效忠关系/敌对模拟、负等级逃脱计算。
2. **目标与材料**：Goals 可以展开制作依赖；Overlap farming 将多目标用料按地图来源汇总，避免重复刷同一任务。
3. **地图与装备**：交互星图、武器配卡模拟器、MOD 与赋能检索、虚空遗物刷取与任务指南。
4. **玩家存档**：架构文档记载 `Zustand+Immer` 以及 `localStorage` 的版本迁移和 JSON 进度包。
5. **官方档案导入**：README 声称能从官方公开 Profile JSON 导入 MR、声望、库存等；尚未在真实 PC 国际服账号验证覆盖率、入口稳定性、跨域问题与隐私风险。任何自动化导入必须另设自愿开关；默认手工录入。
6. **离线与手机**：静态站点部署在 GitHub Pages，但并不代表具备已验证的 PWA manifest / Service Worker / 安装/离线行为。需要实际审查。
7. **数据体量**：ARCHITECTURE.md 标注原始和生成资料约 79MB；对于安卓离线 PWA，需构建紧凑索引、分块加载与缓存大小控制，不可直接嵌入整套原始资料。

## 按需求做的取舍

| 模块 | 核心策略 | 代码复用权限 |
|---|---|---|
| 用户互动科技树：拖拽、缩放、路线、节点详情、个人笔记 | 优先保留本人的设计；迁移到 React 数据驱动组件 | 用户自己已有的 HTML，可迁移 |
| 集团声望、晋升祭品、当前缺口、每日上限 | 单独开发可测试的纯函数；参考领域问题，不复制第三方实现 | 需自行开发 |
| 目标展开与跨目标共享材料 | ID 关联关系图 + 去重/预留算法；保留计算来源 | 需自行开发 |
| 获取来源与中文词条 | WFCD 等可合法获取的数据源 + 中英名称映射；所有来源附检查时间 | 检查每个数据源许可证 |
| 用户状态 | IndexedDB + JSON 导入导出 + schema 迁移 + 可预览恢复 | 自行开发 |
| 活动提示 | 后续使用公开 worldstate/官方公告摘要，人工核对详细奖励 | 只对已证实数据输出确定结论 |
| 账号资料自动导入 | 放在 M4 可选项，不能阻塞 M0-M3 | 需验证真实性、安全性、平台政策 |

## 需 Codex 实地核实（M-1 通过门槛）

1. **许可证**：查全仓库 LICENSE、NOTICE、package metadata、作者说明；如果未授权，不使用其源代码和视觉资产。
2. **代码/测试**：仅在隔离临时目录拉取仓库，静态核查包脚本、锁定依赖、相关测试；是否运行安装命令需要人工确认。
3. **数据质量**：抽查 Entrati 2→3、Cavia 1→2、Hex 2→3、Perrin 4→5 的晋升声望/祭品及出处；与官方更新核对；区分“未确认”和“缺少材料”。
4. **保存能力**：确认 localStorage/IndexedDB 用途、导入后的覆盖规则、数据模型版本迁移及数据丢失风险。
5. **PWA 能力**：查找 manifest、Service Worker、缓存策略；在 Windows Chrome + Android 浏览器上进行 install/offline 测试。
6. **安全**：确认公开 Profile 导入读取的字段、是否使用账户密码/Cookie/用户 ID、任何上传/遥测请求；默认不启用账号读取。
7. **手机体验**：检查触控交互、科技树页面小屏幕下导航、加载首屏耗时、静态资源大小。
8. **技术选型决策**：输出“借鉴点、必须独立开发点、不采用点、预计难度、未决许可风险”。

## 本人的科技树目前需调整的地方

源文件已确认 7 路线与 29 节点，带拖放缩放和 `localStorage` JSON 导出；但旧 `deps` 混合真实硬前置与推荐顺序，任务排程只按静态估时、优先级贪心排列。正式 PWA 必须把 `hardRequirements`、`suggestedBefore` 分开，并将“今日推荐”改为显式考虑入场条件、物料短缺、限时活动和顺路收益的可解释计算。

## 不允许的过度承诺

- 不把公开 GitHub 仓库误称为获得了开源许可。
- 不把 README 写着能导入账号等同于在 PC 国际服真实账号已经验证。
- 不把静态托管网页等同于可离线安装的 PWA。
- 不把 79MB 原始资料打包大小等同于最终打包文件必为 79MB。
- 不把任何资料里标注的“最快刷法”当成保底掉落率。

## 参考与核查入口

- 主仓库：<https://github.com/Appl3Tree/Tenno-Hub>
- README：<https://github.com/Appl3Tree/Tenno-Hub/blob/main/README.md>
- ARCHITECTURE：<https://github.com/Appl3Tree/Tenno-Hub/blob/main/ARCHITECTURE.md>
- package.json：<https://github.com/Appl3Tree/Tenno-Hub/blob/main/package.json>
- 用户科技树：`reference/Original_Tech_Tree.html`
- 已提取种子：`data/tech-tree-seed.json`
