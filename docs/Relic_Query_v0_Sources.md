# 虚空遗物查询 v0：来源、许可与样本边界

检查日期2026-10-21。本轮只采用WFCD warframe-drop-data的少量结构化掉落事实，独立适配为本项目目录，没有运行上游脚本、安装其依赖或复制Tenno Hub加工资料。候选warframe-items的LICENSE也重新读取为MIT，但本轮未采用其数据/实现。MIT不概括授权游戏图像、地图、攻略或其他混合内容，本轮无这些内容。

## 固定版本和许可

- 仓库：https://github.com/WFCD/warframe-drop-data
- 固定commit：3263b2dff8bc1b434a191f0364395b156bd26561，commit时间2026-10-07T17:17:19Z；原公共API响应存evidence/Relic_Query_v0/upstream-main-commit.json。
- [固定LICENSE](https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/LICENSE)：MIT，Copyright (c) 2017 Christopher Kaster。原字节保存在evidence/Relic_Query_v0/WFCD_DROP_DATA_LICENSE.txt，交付的许可汇编保留完整正文。README标明relics/missionRewards解析自DE公开表；与syndicates的Wiki混合内容分开，本轮不取集团文件。
- 固定README及package.json只读取以核对字段/版本/许可；不执行generateData.js或任何第三方采集代码。[固定README](https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/README.md)。

| 输入（均固定commit） | 原字节 | SHA256 |
|---|---:|---|
| data/relics.json | 2469187 | b77c93d465d205c4b9eead29390c4cf8f9f7b5e58309fa0c92565b7726e5c3cb |
| data/missionRewards.json | 1087021 | 992c80479af48ef4fcd922c2f81125f9232abed6083418b290dc7b706f5133f8 |
| data/info.json | 94 | f23416884a22b30ce0fa32f850c3bc902ea35987d22aa6477c1b6e9fee491b59 |

URL、README/package/API索引hash及下载结果另见Download_Initial.json。原全量JSON只在忽略目录.v/rl-source供开发核对，不进入应用、SW缓存或Git交付；交付只留选样摘录和可复现hash。

info记录上游build timestamp=2026-10-07T17:17:05.057Z、DE modified=2026-10-07T15:18:33Z、MD5=142932ad92328573f6a7527c0b4c8998。2026-10-21直接读取[DE公开掉落表](https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html)，4517072字节，SHA256=599169fc08deda359ddc661de5397566dbd6b9603dd1681fdd602ed71d08d37b，MD5与上游完全相同。官方字节只供核对，不随应用分发整页；同一MD5不证明实时开放、当前复刻或账号已解锁。

## 采用字段和转换

relics.relics中读取tier、relicName、state、_id、rewards[].{_id,itemName}；只采用Intact基础奖励列表，逐项对照官方同名表头，另检查该遗物各精炼版本的奖励名称集合一致。上游rarity/chance仅留原始摘录证据，不纳入首版概率计算或界面。稳定遗物ID使用relic:纪元小写:编号小写，不依精炼改变身份；奖励按精确上游_id和原名核对，Forma Blueprint显式映射到既有blueprint:forma，不由中文模糊匹配。

missionRewards.missionRewards按星球→节点→gameMode/isEvent/rewards→轮次→itemName定位对应遗物。每个样本摘录2个不同非活动节点的第一条匹配记录，保留原星球/节点/模式、轮次、JSON记录和官方表头，逐行检查官方原表也存在该遗物。不是全部来源；没有读取兑换/赏金/复刻/实时裂缝文件，不推断它们不存在。Caches节点原名本身已带(Caches)，核对器保留原名而不重复拼接；具体缓存条件和节点入口仍待核。模式是原表标记，不保证完整游戏任务类型，界面说明这一局限。

实体名称后缀Blueprint分为蓝图；选中其他名称均为明确部件后缀，保留部件原名，不把蓝图、部件、成品合并。不增成品福马实体。除既有福马蓝图外未核中文专名；每项显示中文类型、原名及中文名待核，不臆造译名。遗物纪元名称同样保留Lith/Meso/Neo/Axi并提供中文类别，不承诺中文别名已核。

奖励完整性仅指该固定基础表6项均已逐行对照。获取来源仅24条摘录快照，不可标来源完整已核；每条有检查日期和源表路径，具体账号入口、额外条件、当前可获取状态分别unknown/unverified。缺字段/来源冲突时禁止自动升级核验。

## 实际样本

12项，四纪元各3项，均在上述固定奖励表含Forma Blueprint，且能在任务表匹配非活动记录：Lith C7/G14/S19；Meso A12/V13/V17；Neo C10/C7/K10；Axi A21/P10/S8。选择只为验证福马蓝图线索、跨纪元、重复奖励去重和任务/秘藏来源差异，不是效率排名或全部福马来源。

全部稳定ID、英文原名、72条完整基础奖励、24条摘录来源及核对结果见[evidence/Relic_Query_v0/Samples.md](evidence/Relic_Query_v0/Samples.md)和Samples.json。自编extract-samples.py读取固定文件、验证全部输入hash、官方MD5、每条奖励及每条路线，不执行上游代码；原文件按固定URL下载到.v/rl-source后可复跑。原版解析器第一次把已带(Caches)节点又拼接一次，出现KeyError，修正为保留原完整节点名后12/72/24检查通过；这是资料核对器准备错误，未把未核行塞进应用。

## 访问限制

agent-reach开发路由的gh读取本机配置时Access denied；PowerShell公共请求出现Authentication failed；web工具的GitHub API/仓库页不可访问，但raw LICENSE/README可读。之后使用Python标准库的无凭证公共HTTPS请求读取固定文件成功，没有改配置、代理、证书或登录状态。只读取实际字段，不假设README示例等于当前数据。查证到的是列明版本/字节的快照一致性，不是Android、真实账号或游戏内亲测。没有调用第三方AI。
