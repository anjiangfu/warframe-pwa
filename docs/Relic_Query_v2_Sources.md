# 遗物查询 v2：固定资料与精确关联

2026-10-25。只从已采用的固定本地公开文件扩容，不请求浮动master或最新包，不下载／执行包代码。drop提交3263b2dff8bc1b434a191f0364395b156bd26561；名称包@wfcd/items@1.1276.31。实际文件路径、字节数、SHA256及历史核对出处见evidence/Relic_Query_v2/Inputs.json；其中relics.json为b77c93d465d205c4b9eead29390c4cf8f9f7b5e58309fa0c92565b7726e5c3cb，missionRewards.json为992c80479af48ef4fcd922c2f81125f9232abed6083418b290dc7b706f5133f8。两个MIT许可与原保留正文匹配，版权分别Christopher Kaster与Kaptard；现有声明足以覆盖本轮同源少量字段，未引入新素材或依赖。

从七普通节点的完整missionRewards快照读取全部四纪元遗物名称，与原12求并集，再在relics快照中按tier／relicName／Intact精确取唯一整行。独立重算31遗物×6奖励、186关系、117唯一实体，新增19遗物／60奖励。每个新遗物按批准节点顺序，节点内按A/B/C取第一命中，优先不同节点，全部都有2节点，新增38、总62摘录。11地点、6共享规则和原24来源不改。完整源行／候选及选中轮次见Samples.json，G0_Counts.json为重算结果。

按原规范reward:wfcd:<源_id>去重，共享奖励复用实体。英文全串、源标识冲突、缺6奖励、重复关系、不明确部件类型或hash不符均不得静默修正。60新奖励中59项按父components→组件uniqueName、英文全串及组件drops.type双重精确匹配，再按相同uniqueName取zh；没有模糊关联或机器音译。45项新父专名含汉字、14项仍为拉丁字母，后者继续提示中文专名待核。新遗物中文按精确Intact标识关联；原56组合和原福马全部保留。

剩余1项源英文确为2X Forma Blueprint，_id=d9f5d19082a2b4229a4bcc696099a096。它是两份福马蓝图的奖励条目，独立源奖励ID保持可追溯，bundleOf明确引用既有blueprint:forma、quantity=2；名称使用既有“福马蓝图”加数量词，不伪造items父／组件命中。不建成品福马／同义蓝图实体，不产生库存或自动入库。117统计含这一有明确数量的奖励记录；不是新增第二个福马物品。

类型词“蓝图”与父专名组合仅为项目显示，不冒称上游完整官方字符串。v1两条非阻断说明在本轮补记：实际15条使用项目类型词（历史文档写14）；固定URL新请求的package.json仅version与作者留存不同，0.0.0-dev与1.1276.31，独立审阅确认其余字段及实际名称／许可hash一致。本轮核对留存原字节，不覆盖旧证据、不伪造历史下载结果或声称整包验证。

逐项名称／类别／关联／待核见New_Name_Audit.json和[Audit.md](evidence/Relic_Query_v2/Audit.md)，31遗物名称见Relic_Name_Audit.json。本轮来源检查日期独立为2026-10-25，新来源记录不改旧来源日期；快照日期仍为固定文件记录或未知，绝不当游戏亲测时间。

当前availability全部unknown，sourceScope partial，每遗物仅摘录两条。数据存在不代表当前可刷，未选到不代表绝版；不判断出入库／复刻、不展示概率、不做时间／收益计算。普通防御、镜像特例、中断及计时边界沿用v1；四航道地点的入口／模式／B触发待核不升级。Android、可信HTTPS／系统安装及游戏内核验仍未验。
