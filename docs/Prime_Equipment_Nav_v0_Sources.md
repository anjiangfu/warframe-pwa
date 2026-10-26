# Prime 装备部件导航 v0：来源与身份边界

本轮只选取固定 `@wfcd/items@1.1276.31` 中的35个父装备同ID名称和115个本目录组件身份。公开JSON不作为可执行代码加载，不运行上游更新脚本。原始JSON留在忽略目录 `.v/rv1-source/`，没有整套打包进应用。包MIT，Copyright (c) 2017 Kaptard；完整许可沿用本项目本地及public许可汇编。游戏内容与商标仍归相关权利人。

固定文件：Warframes.json、Melee.json、Primary.json、Secondary.json、Arch-Melee.json、Components.json（本地components.json）和i18n/zh.json（本地zh.json）。基础URL为 `https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/`；逐文件SHA256与大小先比对既有 `docs/evidence/Relic_Query_v2/Inputs.json`，再存入本轮 [Author_Audit.json](evidence/Prime_Equipment_Nav_v0/Author_Audit.json)。新附件每个来源也携带固定URL和SHA256，核对日期2026-10-26仅表示本轮对固定快照的核对，不表示当前游戏资料更新。

独立审计从原117奖励逐项读取精确 `display.upstreamIds=[parentUniqueName,componentUniqueName]`，同时验证父 `components` 和组件 `parentUniqueNames` 反向身份。先重算，再与批准预查清单比对：35父、115唯一关联、9父中文专名待核完全一致。另2条单份与两份福马蓝图不具有此父/组件二元关系，排除分组但原奖励查询保持。没有按英文前缀、中文相似度或机器音译推断。蓝图/部件/成品类别沿用原奖励，元数据只有已收录组件子集，不复制配方数量/原始描述。

新版本 `prime-equipment.2026.10.26.1` 依赖原遗物目录版本；原 `relics.v1.json` 与 `relic-source-checks.v1.json` 均不修改。来源listed仅表示保存的PC官方表行，原发布日期/取得/核对日期均保留；availability仍unknown、sourceScope仍partial。Caches的B触发/入口模式待核，Tyana镜像特例均不升级。

## 抽象参考与取舍

- NadavNV/Warframe-Relic-Manager 固定 d728ff6c1fbb24e5b8a0d706aaf41c040fb2cbb5，MIT、Copyright 2026 Nadav Nevo。参考装备到奖励的层次导航；README提示重复部件/成品前置，故不将奖励种类数解释为配方、全套或制作数量。
- WalkmanOfWar/warframe-farming-planner 固定 fd8e2f78950862d6533f8900ee6ad91aee49c16e，MIT、Copyright 2026 WalkmanOfWar。参考部件到来源的链条；不取其路线优化、库存/账号集成或实现。
- 上述固定README、LICENSE及元数据来自已批准方案附带的本地planning-references-20261026，不重新联网或执行代码。未复制两仓库实现、测试或素材。抖音资料仅为规划需求线索，没有观看视频或游戏实测结论，不采用其中译名、攻略正文或图片。

运行本项目自写审计/生成工具，不使用第三方AI，无新依赖。生成元数据可精确重现；原v2转换与来源匹配工具也须与原产物逐字节一致。

## 35组有限目录清单

以下每个数字均为本目录奖励种类数，不是配方数量、个人缺件数或完整性判断。完整稳定父ID与115条奖励/组件ID见Author_Audit.json。

|父装备中文／原文|英文|奖励种类N|名称状态|
|---|---|---:|---|
|西诺斯 Prime|Cernos Prime|2|固定同ID中文|
|Nyx Prime|Nyx Prime|2|中文专名待核|
|分裂斩斧 Prime|Scindo Prime|2|固定同ID中文|
|Valkyr Prime|Valkyr Prime|1|中文专名待核|
|飞扬 Prime|Hikou Prime|2|固定同ID中文|
|Gyre Prime|Gyre Prime|4|中文专名待核|
|狼牙 Prime|Fang Prime|3|固定同ID中文|
|瓦德雅 Prime|Vadarya Prime|4|固定同ID中文|
|Lavos Prime|Lavos Prime|4|中文专名待核|
|帕里斯 Prime|Paris Prime|5|固定同ID中文|
|沙罗之牙 Prime|Sarofang Prime|3|固定同ID中文|
|欧特鲁斯 Prime|Orthos Prime|3|固定同ID中文|
|Citrine Prime|Citrine Prime|4|中文专名待核|
|布莱顿 Prime|Braton Prime|3|固定同ID中文|
|野马 Prime|Bronco Prime|3|固定同ID中文|
|圣英 Prime|Afentis Prime|4|固定同ID中文|
|Voruna Prime|Voruna Prime|4|中文专名待核|
|月面狂风 Prime|Perigale Prime|4|固定同ID中文|
|脉纹 Prime|Venato Prime|3|固定同ID中文|
|伯斯顿 Prime|Burston Prime|4|固定同ID中文|
|Caliban Prime|Caliban Prime|4|中文专名待核|
|闪劫 Prime|Corufell Prime|4|固定同ID中文|
|野马双枪 Prime|Akbronco Prime|2|固定同ID中文|
|Styanax Prime|Styanax Prime|4|中文专名待核|
|大久和弓 Prime|Daikyu Prime|5|固定同ID中文|
|卡帕压力枪 Prime|Kompressa Prime|3|固定同ID中文|
|电幻步枪 Prime|Alternox Prime|4|固定同ID中文|
|塞多 Prime|Cedo Prime|4|固定同ID中文|
|阿索代 Prime|Athodai Prime|3|固定同ID中文|
|凯旋之爪 Prime|Venka Prime|1|固定同ID中文|
|佐伦双斧 Prime|Dual Zoren Prime|3|固定同ID中文|
|石晶之花 Prime|Steflos Prime|4|固定同ID中文|
|Yareli Prime|Yareli Prime|4|中文专名待核|
|红隼 Prime|Kestrel Prime|3|固定同ID中文|
|雷克斯 Prime|Lex Prime|3|固定同ID中文|
