# 遗物查询 v2 G0 逐项审计

2026-10-25；固定drop提交3263b2dff8bc1b434a191f0364395b156bd26561、items@1.1276.31，均只读本地固定文件且hash匹配历史实际输入。不是当前游戏数据。

独立重算31遗物／117奖励／186关系／新增38来源，总62；11地点／6规则不扩。完整原始行及候选和所选来源在Samples.json。

## 60新奖励名称与类型

| 英文原名 | 显示 | 状态 | 类型 | 精确关联 |
|---|---|---|---|---|
| Alternox Prime Blueprint | 电幻步枪 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeAlternox/PrimeAlternoxWeapon / /Lotus/Types/Recipes/Weapons/AlternoxPrimeBlueprint |
| Gyre Prime Chassis Blueprint | Gyre Prime 机体蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Gyre/GyrePrime / /Lotus/Types/Recipes/WarframeRecipes/GyrePrimeChassisComponent |
| Dual Zoren Prime Blueprint | 佐伦双斧 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Melee/Axe/PrimeZoren/PrimeZorenAxeWeapon / /Lotus/Types/Recipes/Weapons/DualZorenPrimeBlueprint |
| Steflos Prime Receiver | 石晶之花 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun / /Lotus/Types/Recipes/Weapons/WeaponParts/SteflosPrimeReceiver |
| Cedo Prime Blueprint | 塞多 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeCedo/PrimeCedoWeapon / /Lotus/Types/Recipes/Weapons/CedoPrimeBlueprint |
| Yareli Prime Blueprint | Yareli Prime 蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Yareli/YareliPrime / /Lotus/Types/Recipes/WarframeRecipes/YareliPrimeBlueprint |
| 2X Forma Blueprint | 2份福马蓝图 | quantity-combination | blueprint | 固定2X记录 → blueprint:forma × 2 |
| Corufell Prime Stock | 闪劫 Prime 枪托 | added | component | /Lotus/Weapons/Tenno/Archwing/Melee/PrimeCorufell/PrimeCorufellScytheWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/CorufellPrimeBarrel |
| Burston Prime Receiver | 伯斯顿 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeBurston/PrimeBurston / /Lotus/Types/Recipes/Weapons/WeaponParts/BurstonPrimeReceiver |
| Daikyu Prime String | 大久和弓 Prime 弓弦 | added | component | /Lotus/Weapons/Tenno/Bows/PrimeDaikyu/PrimeDaikyuBow / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimeDaikyuString |
| Lavos Prime Systems Blueprint | Lavos Prime 系统蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Alchemist/LavosPrime / /Lotus/Types/Recipes/WarframeRecipes/LavosPrimeSystemsComponent |
| Akbronco Prime Link | 野马双枪 Prime 连接器 | added | component | /Lotus/Weapons/Tenno/Akimbo/PrimeAkimboShotGun / /Lotus/Types/Recipes/Weapons/WeaponParts/AkbroncoPrimeLink |
| Alternox Prime Barrel | 电幻步枪 Prime 枪管 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeAlternox/PrimeAlternoxWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/AlternoxPrimeBarrel |
| Kestrel Prime Blade | 红隼 Prime 刀刃 | added | component | /Lotus/Weapons/Tenno/Melee/Glaives/PrimeKestrel/PrimeKestrel / /Lotus/Types/Recipes/Weapons/WeaponParts/KestrelPrimeBlade |
| Orthos Prime Handle | 欧特鲁斯 Prime 握柄 | added | component | /Lotus/Weapons/Tenno/Melee/Polearms/PrimePolearmWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimePolearmHandle |
| Styanax Prime Neuroptics Blueprint | Styanax Prime 头部神经光元蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Hoplite/StyanaxPrime / /Lotus/Types/Recipes/WarframeRecipes/StyanaxPrimeHelmetComponent |
| Vadarya Prime Barrel | 瓦德雅 Prime 枪管 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeLightningGun/PrimeLightningGun / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimeLightningGunBarrel |
| Burston Prime Stock | 伯斯顿 Prime 枪托 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeBurston/PrimeBurston / /Lotus/Types/Recipes/Weapons/WeaponParts/BurstonPrimeStock |
| Citrine Prime Blueprint | Citrine Prime 蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Geode/CitrinePrime / /Lotus/Types/Recipes/WarframeRecipes/CitrinePrimeBlueprint |
| Paris Prime Blueprint | 帕里斯 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Bows/PrimeHuntingBow / /Lotus/Types/Recipes/Weapons/BowPrimeBlueprint |
| Daikyu Prime Grip | 大久和弓 Prime 弓身 | added | component | /Lotus/Weapons/Tenno/Bows/PrimeDaikyu/PrimeDaikyuBow / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimeDaikyuGrip |
| Dual Zoren Prime Handle | 佐伦双斧 Prime 握柄 | added | component | /Lotus/Weapons/Tenno/Melee/Axe/PrimeZoren/PrimeZorenAxeWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/DualZorenPrimeHandle |
| Dual Zoren Prime Blade | 佐伦双斧 Prime 刀刃 | added | component | /Lotus/Weapons/Tenno/Melee/Axe/PrimeZoren/PrimeZorenAxeWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/DualZorenPrimeBlade |
| Steflos Prime Stock | 石晶之花 Prime 枪托 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun / /Lotus/Types/Recipes/Weapons/WeaponParts/SteflosPrimeStock |
| Cedo Prime Receiver | 塞多 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeCedo/PrimeCedoWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/CedoPrimeReceiver |
| Afentis Prime Handle | 圣英 Prime 握柄 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeAfentis/PrimeAfentisWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/AfentisPrimeHandle |
| Burston Prime Blueprint | 伯斯顿 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeBurston/PrimeBurston / /Lotus/Types/Recipes/Weapons/BurstonPrimeBlueprint |
| Paris Prime Upper Limb | 帕里斯 Prime 上弓臂 | added | component | /Lotus/Weapons/Tenno/Bows/PrimeHuntingBow / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimeBowUpperLimb |
| Kestrel Prime Grip | 红隼 Prime 握把 | added | component | /Lotus/Weapons/Tenno/Melee/Glaives/PrimeKestrel/PrimeKestrel / /Lotus/Types/Recipes/Weapons/WeaponParts/KestrelPrimeGrip |
| Perigale Prime Receiver | 月面狂风 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimePerigale/PrimePerigaleSniper / /Lotus/Types/Recipes/Weapons/WeaponParts/PerigalePrimeReceiver |
| Athodai Prime Blueprint | 阿索代 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Pistols/PrimeAthodai/PrimeAthodaiPistolWeapon / /Lotus/Types/Recipes/Weapons/AthodaiPrimeBlueprint |
| Fang Prime Blueprint | 狼牙 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Melee/DualDagger/FangPrimeDagger / /Lotus/Types/Recipes/Weapons/FangPrimeBlueprint |
| Yareli Prime Chassis Blueprint | Yareli Prime 机体蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Yareli/YareliPrime / /Lotus/Types/Recipes/WarframeRecipes/YareliPrimeChassisComponent |
| Yareli Prime Neuroptics Blueprint | Yareli Prime 头部神经光元蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Yareli/YareliPrime / /Lotus/Types/Recipes/WarframeRecipes/YareliPrimeHelmetComponent |
| Styanax Prime Chassis Blueprint | Styanax Prime 机体蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Hoplite/StyanaxPrime / /Lotus/Types/Recipes/WarframeRecipes/StyanaxPrimeChassisComponent |
| Lex Prime Blueprint | 雷克斯 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Pistols/PrimeLex/PrimeLex / /Lotus/Types/Recipes/Weapons/LexPrimeBlueprint |
| Athodai Prime Barrel | 阿索代 Prime 枪管 | added | component | /Lotus/Weapons/Tenno/Pistols/PrimeAthodai/PrimeAthodaiPistolWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/AthodaiPrimeBarrel |
| Sarofang Prime Blueprint | 沙罗之牙 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Melee/Axe/PrimeVorunaAxeWeapon / /Lotus/Types/Recipes/Weapons/SarofangPrimeBlueprint |
| Perigale Prime Stock | 月面狂风 Prime 枪托 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimePerigale/PrimePerigaleSniper / /Lotus/Types/Recipes/Weapons/WeaponParts/PerigalePrimeStock |
| Caliban Prime Systems Blueprint | Caliban Prime 系统蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Sentient/CalibanPrime / /Lotus/Types/Recipes/WarframeRecipes/CalibanPrimeSystemsComponent |
| Citrine Prime Chassis Blueprint | Citrine Prime 机体蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Geode/CitrinePrime / /Lotus/Types/Recipes/WarframeRecipes/CitrinePrimeChassisComponent |
| Lex Prime Receiver | 雷克斯 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/Pistols/PrimeLex/PrimeLex / /Lotus/Types/Recipes/Weapons/WeaponParts/LexPrimeReceiver |
| Daikyu Prime Blueprint | 大久和弓 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Bows/PrimeDaikyu/PrimeDaikyuBow / /Lotus/Types/Recipes/Weapons/PrimeDaikyuBlueprint |
| Vadarya Prime Blueprint | 瓦德雅 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeLightningGun/PrimeLightningGun / /Lotus/Types/Recipes/Weapons/PrimeLightningGunBlueprint |
| Paris Prime String | 帕里斯 Prime 弓弦 | added | component | /Lotus/Weapons/Tenno/Bows/PrimeHuntingBow / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimeBowString |
| Yareli Prime Systems Blueprint | Yareli Prime 系统蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Yareli/YareliPrime / /Lotus/Types/Recipes/WarframeRecipes/YareliPrimeSystemsComponent |
| Steflos Prime Blueprint | 石晶之花 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun / /Lotus/Types/Recipes/Weapons/SteflosPrimeBlueprint |
| Venato Prime Handle | 脉纹 Prime 握柄 | added | component | /Lotus/Weapons/Tenno/Melee/Scythe/PrimeVento/PrimeVentoScythe / /Lotus/Types/Recipes/Weapons/WeaponParts/VentoPrimeHandle |
| Afentis Prime Blueprint | 圣英 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/LongGuns/PrimeAfentis/PrimeAfentisWeapon / /Lotus/Types/Recipes/Weapons/AfentisPrimeBlueprint |
| Kompressa Prime Receiver | 卡帕压力枪 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/Pistols/PrimeKompressa/PrimeKompressa / /Lotus/Types/Recipes/Weapons/WeaponParts/KompressaPrimeReceiver |
| Citrine Prime Neuroptics Blueprint | Citrine Prime 头部神经光元蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Geode/CitrinePrime / /Lotus/Types/Recipes/WarframeRecipes/CitrinePrimeHelmetComponent |
| Kestrel Prime Blueprint | 红隼 Prime 蓝图 | added | blueprint | /Lotus/Weapons/Tenno/Melee/Glaives/PrimeKestrel/PrimeKestrel / /Lotus/Types/Recipes/Weapons/KestrelPrimeBlueprint |
| Corufell Prime Handle | 闪劫 Prime 握柄 | added | component | /Lotus/Weapons/Tenno/Archwing/Melee/PrimeCorufell/PrimeCorufellScytheWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/CorufellPrimeHandle |
| Alternox Prime Receiver | 电幻步枪 Prime 枪机 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeAlternox/PrimeAlternoxWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/AlternoxPrimeReceiver |
| Orthos Prime Blade | 欧特鲁斯 Prime 刀刃 | added | component | /Lotus/Weapons/Tenno/Melee/Polearms/PrimePolearmWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/PrimePolearmBlade |
| Steflos Prime Barrel | 石晶之花 Prime 枪管 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun / /Lotus/Types/Recipes/Weapons/WeaponParts/SteflosPrimeBarrel |
| Gyre Prime Blueprint | Gyre Prime 蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Gyre/GyrePrime / /Lotus/Types/Recipes/WarframeRecipes/GyrePrimeBlueprint |
| Cedo Prime Stock | 塞多 Prime 枪托 | added | component | /Lotus/Weapons/Tenno/LongGuns/PrimeCedo/PrimeCedoWeapon / /Lotus/Types/Recipes/Weapons/WeaponParts/CedoPrimeStock |
| Voruna Prime Blueprint | Voruna Prime 蓝图 | added；专名待核 | blueprint | /Lotus/Powersuits/Werewolf/VorunaPrime / /Lotus/Types/Recipes/WarframeRecipes/VorunaPrimeBlueprint |
| Lex Prime Barrel | 雷克斯 Prime 枪管 | added | component | /Lotus/Weapons/Tenno/Pistols/PrimeLex/PrimeLex / /Lotus/Types/Recipes/Weapons/WeaponParts/LexPrimeBarrel |

59条精确父／组件与drops.type双重英文关联，14条父专名仍拉丁；1条两份福马蓝图组合沿用既有中文与实体，不伪造items组件命中。没有冲突或未知部件类型。

## 31遗物与摘录

| 遗物 | 处理 | 新增摘录 |
|---|---|---|
| Lith C7 Relic | 原记录完整保留 | 原2条 |
| Lith G14 Relic | 原记录完整保留 | 原2条 |
| Lith S19 Relic | 原记录完整保留 | 原2条 |
| Meso A12 Relic | 原记录完整保留 | 原2条 |
| Meso V13 Relic | 原记录完整保留 | 原2条 |
| Meso V17 Relic | 原记录完整保留 | 原2条 |
| Neo C10 Relic | 原记录完整保留 | 原2条 |
| Neo C7 Relic | 原记录完整保留 | 原2条 |
| Neo K10 Relic | 原记录完整保留 | 原2条 |
| Axi A21 Relic | 原记录完整保留 | 原2条 |
| Axi P10 Relic | 原记录完整保留 | 原2条 |
| Axi S8 Relic | 原记录完整保留 | 原2条 |
| Lith A13 Relic | 新增完整6奖励 | Mercury/Apollodorus B；Mercury/Lares A |
| Lith C15 Relic | 新增完整6奖励 | Mercury/Apollodorus B；Mercury/Lares A |
| Lith L8 Relic | 新增完整6奖励 | Mercury/Apollodorus B；Mercury/Lares A |
| Lith S18 Relic | 新增完整6奖励 | Mercury/Apollodorus B；Mercury/Lares A |
| Lith V11 Relic | 新增完整6奖励 | Mercury/Apollodorus B；Mercury/Lares A |
| Meso C11 Relic | 新增完整6奖励 | Mercury/Lares B；Mercury/Odin B |
| Meso D8 Relic | 新增完整6奖励 | Mercury/Lares B；Mercury/Odin B |
| Meso D9 Relic | 新增完整6奖励 | Mercury/Lares B；Mercury/Odin B |
| Meso K9 Relic | 新增完整6奖励 | Mercury/Lares B；Mercury/Odin B |
| Meso Y2 Relic | 新增完整6奖励 | Mercury/Lares B；Mercury/Odin B |
| Neo A16 Relic | 新增完整6奖励 | Venus/Romula C；Earth/Coba C |
| Neo C11 Relic | 新增完整6奖励 | Venus/Romula C；Earth/Coba C |
| Neo V13 Relic | 新增完整6奖励 | Venus/Romula C；Earth/Coba C |
| Neo Y2 Relic | 新增完整6奖励 | Venus/Romula C；Earth/Coba C |
| Axi A22 Relic | 新增完整6奖励 | Mars/Tyana Pass C；Jupiter/Ganymede C |
| Axi C12 Relic | 新增完整6奖励 | Mars/Tyana Pass C；Jupiter/Ganymede C |
| Axi D6 Relic | 新增完整6奖励 | Mars/Tyana Pass C；Jupiter/Ganymede C |
| Axi S21 Relic | 新增完整6奖励 | Mars/Tyana Pass C；Jupiter/Ganymede C |
| Axi V14 Relic | 新增完整6奖励 | Mars/Tyana Pass C；Jupiter/Ganymede C |

新来源优先不同节点，按批准七节点顺序，每节点取最先A/B/C命中；每个新遗物均能选两节点，无伪造第二条。原24摘录及航道待核维持。所有当前可获取unknown、sourceScope partial。

## 历史说明与本轮访问

v1文档类型词称14，实际15条；只在本轮补记，不修改原始证据。v1独立复核发现固定package.json新请求仅version不同（0.0.0-dev与1.1276.31），其他字段相同，实际名称资料与许可hash相同；本轮核的是作者留存固定字节，不冒称重新下载复现。

首次结构只读探测误把missionRewards外层封装省略而KeyError，并尝试不存在的LICENSE路径；随后按实际missionRewards字段及license.txt读取，没有数据修改。全部实际hash与逐项记录保留，本轮无需联网换源。
