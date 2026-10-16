# 同类项目 / 数据源检索（截至 2026-10-16）

> 本清单基于项目的公开 README、仓库页面与平台检索结果；**不代表实际安装审计或实机测试**。按需求价值排序；许可证须通过当前源仓库 `LICENSE` 最终确认。

| 项目 | 链接 | 适合借鉴 | 许可/注意 |
|---|---|---|---|
| **Tenno Hub** | https://github.com/appl3tree/Tenno-Hub | 目标/依赖树、集团晋升材料、22+集团站位、敌对模拟、多目标“顺路刷”、MOD builder、官方账号导入 | 最贴合；仓库根目录未见明确 LICENSE；**不直接复制其代码**；先单独审查 |
| **WFHelper** | https://github.com/WFHelper/WFHelper | 制作配方与库存、虚空遗物/市场/世界状态布局、日常现金/Endo统计 | GitHub 标示 MIT；是桌面工具、非PWA；账号库存读取路径需要独立安全审查 |
| **WF Mastery Tracker** | https://github.com/actuallyatiger/wf-mastery-tracker | 已掌握装备、蓝图/部件持有、配方素材、JSON存档，静态网页形式 | 适合 MR12→MR18；确认 LICENSE 再移植实现 |
| **WarframeTracker** | https://github.com/genrichh93/WarframeTracker | 材料聚合、遗物检索、更新式本地 SQLite 缓存 | MIT；Tkinter桌面应用，建议仅参考算法 |
| **WFCD Warframe Items** | https://github.com/WFCD/warframe-items | 大量游戏物品基础数据、稳定ID、蓝图与材料、图片、翻译字段 | MIT；正式数据源优先 |
| **WFCD Drop Data** | https://github.com/WFCD/warframe-drop-data | 官方掉落表的解析结果、任务奖励、裂缝/遗物等 | 标注来源/更新时间，不能把掉率误解为“每分钟收益” |
| **WFCD Warframe Status API** | https://github.com/WFCD/warframe-status | events/news/voidTrader/nightwave等实时世界状态；M4活动源 | 免费公开API，接口变化、超时、缓存需自行处理 |
| **WFCD Warframe Hub** | https://github.com/WFCD/warframe-hub | 周常、活动计时、多人可参考的世界状态界面 | Apache-2.0（须以仓库为准），功能与个人档案侧重点不同 |
| **TENNO.DAT** | https://github.com/kieranajp/TENNO.DAT | 1999美术风格、精通与心愿单、官方资料同步的交互 | 云端账号方案更复杂；不建议MVP照搬登录 |
| **AlecaFrame** | https://docs.alecaframe.com/ | 持有库存、精通追踪、遗物规划及紫卡/交易功能的交互参考 | Overwolf相关、不是可直接移植的PWA模块 |
| **仓鼠互助洞** | https://www.bilibili.com/video/BV1mufmBZE3F/ | 中文操作引导、玩家所需优先级、视频教学与游戏内助手 | B站演示已核实；未找到可确认的开源仓库；不直接下载陌生安装器 |
| **莲妈小助手** | https://www.douyin.com/shipin/7319253860957931547 | 中文玩家WM蹲单、遗物玩法信息呈现 | 抖音可检索描述；未确认公开源码/安装安全性 |
| **手残的小光 视频合集** | https://www.bilibili.com/video/BV15VfVYUEsG/ | 国服/国际服中文教学、各开放世界集团、材料、玩法难点 | 视频为人工复核素材；注意发布时间与版本变化 |

## 决策建议

1. Tenno Hub 优先审计。若作者正式许可可改可发布、构建能通过、中文适配良好，则可比较 fork/adapt 与独立实现的工时；不能假定 GitHub public = open source license。
2. 不论自建或改造，都应优先用 WFCD 数据包与官方掉落表，自己维护中文别名映射与逐级声望/活动详情的审核数据。
3. 设计参考优先：用户自己的科技树（可拖拽科技树） + Tenno Hub 的精确进度算法 + WFHelper 的实用库存视角 + Warframe Hub 的世界状态展示。
4. 抖音/B站/YouTube：作为体验调查与玩法核对来源，不在缺乏仓库及授权情况下搬代码/内容。未能从公开搜索结果确证一个可用且许可清晰的 YouTube 源码项目，因此不将其列为技术依赖。
5. **官方活动特别注意：** 实时 API 返回的 events/news 可能没有兑换商店所有物品、任务玩法与掉率；这些字段必须附官方公告等独立证据或标“待核对”。
