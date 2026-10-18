# M1资料与逐字段核验

核对日期2026-10-18。agent-reach/Jina路径的本机curl仍报SEC_E_NO_CREDENTIALS，未绕过TLS，改用web检索缓存及官方页面。Wiki无法直开处只称检索缓存；未游戏内实测。只独立整理少量事实、自己写操作建议，没有复制代码、整表或图片。

## 福马普通蓝图配方（非安装清单）

| 字段 | 采用值 | 核验依据/边界 |
|---|---:|---|
| 普通蓝图单批成品 | 福马1 | [Forma专页](https://warframe.fandom.com/wiki/Forma)、[中文Forma](https://warframe.huijiwiki.com/wiki/Forma)及普通[铸造厂规则](https://warframe.fandom.com/wiki/Foundry)，不是多件包；蓝图奖励数量不等于单批成品 |
| 星币成本 | 35000 | 中英文Forma专页一致；[旧蓝图汇总](https://warframe.fandom.com/wiki/Blueprints/Item)写35500，采用专页作为字段依据，不搬用汇总成本/时间 |
| 非晶态合金 | 1 | 蓝图汇总的投入与[Morphics反向需求](https://warframe.fandom.com/wiki/Morphics)一致 |
| 神经传感器 | 1 | 蓝图投入与[Neural Sensors反向需求](https://warframe.fandom.com/wiki/Neural_Sensors?page=4)一致 |
| 神经元 | 1 | 蓝图投入；[中文名称/地点](https://warframe.huijiwiki.com/wiki/神经元) |
| 奥罗金电池 | 1 | 蓝图投入；[资源条目](https://warframe.fandom.com/wiki/Orokin_Cell) |
| 福马蓝图 | 每批消耗1 | Forma/普通单次蓝图与铸造厂规则；数量单独入库存，不假定已拥有。不把可复用稀有资源蓝图规则移用到福马 |

“verified”仅表示上述字段已人工对照来源，非当前游戏实测或官方认证。数量异常、没有来源或字段标unverified/conflicting时引擎不做确定计算。不存在制作计时/完成进度模拟。

## 来源与建议获取分开

- [官方Prime Access说明](https://www.warframe.com/en/prime-access)：裂缝任务打开遗物可获得福马蓝图；不能保证任意遗物包含蓝图、不列当前轮换、概率或完整遗物表。查看所持遗物的奖励预览，任务中按提示收集虚空反应物，完成后核对奖励；不把蓝图当已制成福马。
- [中文资源页](https://warframe.huijiwiki.com/wiki/资源)与[星图](https://warframe.huijiwiki.com/wiki/星图)：非晶态合金/神经传感器等中文名与区域。建议分别选水星Tolstoj刺杀、木星Themisto刺杀；先检查节点可进，沿途开容器/观察资源，不承诺首领必掉。
- [神经元](https://warframe.huijiwiki.com/wiki/神经元)：地球Mariana歼灭为社区建议，找资源沉积物/容器并拾取，非结算必发。
- [Orokin Cell](https://warframe.fandom.com/wiki/Orokin_Cell)与[Telesto](https://warframe.fandom.com/wiki/Telesto)：土星Telesto普通歼灭及电池阵列探索为建议，非唯一最快。节点当前中文名未可靠取得，统一标“中文节点名待核（英文名）”，不自行音译冒充官方中文。
- 星币只列普通任务完成及拾取来源，不给未经核实的收益率；福马成品仅提示本条蓝图制作，本轮不扩展购买/限时活动推荐。
- 原苦栓、瑶丛、延凡草及获取内容沿用已核验的weapon目录及其来源，定义不复制到新JSON；详见原毒囊来源表。

未知字段：四个新增普通节点的可靠当前中文名、当前账号是否解锁各地/裂缝；实际掉落与制作界面未人测。目录明确标出，资料可离线查，外部链接须联网。
