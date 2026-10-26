# 第三方许可声明（M0）

本项目的科技树设计和文字输入来自用户提供的 HTML/seed；应用实现独立编写。没有复制 Tenno Hub 的实现、加工数据、测试或素材，没有引入 WFCD/Wiki/Overframe 数据文件。

所有包版本及完整性固定在 app/package-lock.json。安装使用 `--ignore-scripts`，未执行依赖生命周期脚本。包许可元数据来自 npm 官方注册表及实际包内 LICENSE/NOTICE；2026-10-16 检查。166个非根锁定条目（含未安装的平台可选包）均有已知许可证，完整元数据见 docs/evidence/M0_Dependencies.json。这是许可清单，不是供应链/漏洞安全认证。

| 直接依赖 | 锁定版本 | 许可证 | 用途 |
|---|---|---|---|
| react / react-dom | 19.3.1 | MIT | 应用界面 |
| dexie | 4.4.6 | Apache-2.0 | IndexedDB事务 |
| vite | 8.3.4 | MIT | 构建 |
| @vitejs/plugin-react | 6.1.2 | MIT | React构建转换 |
| typescript | 5.9.3 | Apache-2.0 | 类型检查 |
| vitest | 5.0.5 | MIT | 测试 |
| fake-indexeddb | 6.2.5 | Apache-2.0 | 测试专用数据库 |
| eslint / @eslint/js | 10.12.0 / 10.0.1 | MIT | 静态检查 |
| typescript-eslint | 8.71.2 | MIT | TypeScript检查 |
| @types/react / react-dom / node | 19.3.0 / 19.3.0 / 24.10.1 | MIT | 类型声明 |
| @playwright/test | 1.64.1 | Apache-2.0 | 浏览器验收 |

React运行时还含scheduler（MIT）；运行时完整许可和适用NOTICE保留在 app/public/THIRD_PARTY_LICENSES.txt，随生产dist一起提供。实际已安装开发及传递依赖的完整许可/NOTICE保留于 app/licenses/THIRD_PARTY_LICENSES.txt，前缀标明包名、版本及文件名；原许可正文没有改写。

锁文件还包含BSD-2-Clause、BSD-3-Clause、ISC、MPL-2.0及BlueOak-1.0.0依赖。开发工具及平台可选二进制未修改其受许可文件，相关包版本/源仓库地址见依赖元数据，包的源发布地址由锁文件resolved字段给出。构建工具不作为本项目源代码转授许可；若未来修改MPL覆盖的文件或另行再分发开发工具，需继续满足对应源代码提供义务。MIT/Apache和其他许可的版权、免责声明、NOTICE以归档正文为准。

图标由 app/scripts/create-icons.mjs 原创几何绘制，没有下载游戏美术或字体；界面引用设备已有字体，不随包分发字体文件。Warframe及相关游戏名称属于其权利人，本项目为个人记录工具，不代表Digital Extremes。

毒囊双枪养成样例v0（2026-10-17）：未增加第三方依赖。少量游戏事实/中文名称独立核对自官方历史补丁及社区Wiki检索缓存，操作建议独立编写；链接、访问方式和限制见docs/Dual_Toxocyst_v0_Sources.md，并在应用中逐项署明。没有复制整篇攻略、地图、图片、第三方加工数据包或Tenno Hub内容，不把社区资料视为官方当前版本实测。

通用目标助手v0（2026-10-18）：无新依赖、素材或第三方实现。海波单剑少量任务事实、模块候选名称及处决历史说明独立核对并附来源；试做步骤和排查建议自行撰写。访问方式与不确定项见docs/Current_Goal_v0_Sources.md。个人近况来自用户明确声明，仅在预览后显式应用；不从来源网页获取个人账号状态，不将社区或官方历史资料标作当前游戏亲测。

材料查询与制作缺口v0（2026-10-18）：无新增依赖或许可证正文变化。福马蓝图与少量资源事实独立对照中英文社区页面及官方获取说明，字段级来源、汇总表冲突和查证限制见docs/M1_Crafting_Materials_v0_Sources.md。简短获取建议自行撰写，没有复制第三方实现、攻略全文、表格文件、素材或整库，不运行Tenno Hub更新脚本。官方获取链接不为社区配方数值背书，所有来源仍需按具体字段与访问方式理解；未游戏内亲测。

六人组晋升助手v0（2026-10-19）：未新增依赖、许可证正文、游戏素材或第三方实现。仅将少量相邻晋升事实、名称及入口信息独立整理进本项目版本化目录，来源链接、字段作用范围、网页正文/检索缓存访问方式与时效限制见docs/M1_Hex_Rankup_v0_Sources.md；操作短文自行撰写。未复制第三方表格文件、整库、攻略全文、实现、测试或更新脚本，未调用第三方AI agent。官方关于货币和关系的说明不为社区表中的全部数值背书；字段核验不等于当前游戏亲测或权利人认证。

材料获取指引v1（2026-10-21）：没有新增第三方依赖、代码、图片、地图或字体。23项既有资源的少量地点/模式/获取类别事实独立对照官方历史正文、社区检索缓存及少量区域交叉说明，动作建议独立编写；来源及采用范围见docs/Material_Guides_v1_Sources.md。未复制第三方攻略正文、加工资料表、整库或Tenno Hub内容，没有运行第三方更新脚本或调用AI agent。保留链接署明和核验局限，不将缓存译名、历史入口或社区待更新记录表述成当前游戏实测，也不以获取资料替换原配方用量的证据。

行动清单v0（2026-10-21）：只从已有本项目目录和个人记录派生只读概览，没有新增游戏事实、外部接口、第三方依赖或素材；锁文件与许可正文不变。沿用已有资料的链接、字段核验与时效限制，概览中的候选地点不代表账号已解锁或游戏内亲测。没有复制Tenno Hub或其他第三方实现、加工数据或测试，没有调用第三方AI agent。额外Hex回归使用本项目既有独立审阅复现，在隔离副本单独运行并保留源文件hash，未修改审阅端原件。

虚空遗物查询v0（2026-10-21）：采用WFCD/warframe-drop-data固定提交3263b2dff8bc1b434a191f0364395b156bd26561中12个遗物的基础奖励和24条摘录任务来源，独立适配为本项目小目录。上游MIT，Copyright (c) 2017 Christopher Kaster；完整许可附于app/licenses/THIRD_PARTY_LICENSES.txt及随应用提供的同名public文件。原输入hash、字段、官方表同字节核对和采用范围见docs/Relic_Query_v0_Sources.md。没有复制上游实现、采集脚本、图像、地图或Tenno Hub加工资料；未采用warframe-items数据，不运行第三方更新脚本，无新依赖或第三方AI。MIT不概括授权混合内容；游戏名称/物品事实仍归相关权利人，快照核对不等于当前可获取或游戏内实测。

遗物查询v1（2026-10-24）：采用@wfcd/items固定版本1.1276.31的少量中文名称和精确父/部件、遗物、节点标识。MIT，Copyright (c) 2017 Kaptard；完整许可正文附于本地及public许可汇编。未安装或执行该包，未引入全量目录或图像；源文件hash、版本声明、逐项关联和组合名称局限见docs/Relic_Query_v1_Sources.md。部分专名在上游zh中仍为拉丁字母，不把组合类型名说成官方完整译名。官方补丁/支持与社区页面仅核对少量入口和规则事实，短步骤独立编写，不复制Wiki模块、加工映射或攻略正文；没有Tenno Hub内容、第三方AI、新依赖或素材。来源核验不代表当前可获取、个人账号已解锁或游戏亲测。
## 遗物查询 v2 补记（2026-10-25）

沿用warframe-drop-data固定提交3263b2dff8bc1b434a191f0364395b156bd26561及@wfcd/items@1.1276.31的MIT资料，未增加第三方依赖、图像或代码。本轮有限静态目录扩至31遗物／117奖励记录，精确来源、hash、中文映射和数量奖励说明见docs/Relic_Query_v2_Sources.md。既有版权与MIT全文继续保留在app/licenses/THIRD_PARTY_LICENSES.txt及app/public/THIRD_PARTY_LICENSES.txt。没有导入全量原始文件、攻略正文或Tenno Hub加工数据；当前获取状态仍未知。
## 遗物来源时效核验 v0（2026-10-26交付）

仅增加Digital Extremes官方PC公开掉落表的62条必要事实定位、原文hash及日期，保存核对至2026-10-25的静态记录。官方整页、正文、样式、图像和实现不进入应用或Git；没有将原WFCD MIT概括为官方页面许可。应用来源卡保留官方归属、原文与免责声明链接。原依赖和许可全文不变；来源访问、判断边界和完整62条审计见docs/Relic_Source_Check_v0_Sources.md及docs/evidence/Relic_Source_Check_v0/。

## Prime 装备部件导航 v0（2026-10-26）

从固定 @wfcd/items@1.1276.31 同ID父实体字段选取35组父名和115条本目录组件身份，独立编写派生索引及界面。沿用 MIT、Copyright (c) 2017 Kaptard，完整许可保留于 app/licenses/THIRD_PARTY_LICENSES.txt 和 app/public/THIRD_PARTY_LICENSES.txt。未复制第三方实现、整套源文件、图像、攻略或译名加工表；NadavNV 与 WalkmanOfWar 的固定MIT仓库仅提供抽象导航思路，未取代码。来源与hash见 docs/Prime_Equipment_Nav_v0_Sources.md，9个父装备中文专名仍待核。所有分组均为有限奖励种类关联，不是完整配方、制作数量或当前获取结论。
