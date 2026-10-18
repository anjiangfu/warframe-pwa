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
