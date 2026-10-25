# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relics.spec.ts >> all embedded relic tables and source snapshots reopen offline after a controlled page closes
- Location: e2e\relics.spec.ts:25:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: '遗物详情', exact: true })
Expected substring: "2026-10-21"
Received string:    "返回查询结果遗物奖励与来源分别核对古纪 A13 遗物（Lith A13 Relic）中文组合显示已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Types/Game/Projections/T1VoidProjectionCitrinePrimeABronze固定上游遗物身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知当前可获取：未知6项基础奖励表已对照快照。来源仅摘录2条，不是全部来源，也不标为完整已核。本版不展示概率。精炼开出概率和获取遗物的掉率含义不同，均不计算；以下为Intact基础表奖励关系。电幻步枪 Prime 蓝图（Alternox Prime Blueprint）蓝图 · 上游专名＋项目蓝图类型词基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。蓝图为项目已有类型词，与上游父专名组合，不冒称完整官方中文字符串。精确上游关联：/Lotus/Weapons/Tenno/LongGuns/PrimeAlternox/PrimeAlternoxWeapon/Lotus/Types/Recipes/Weapons/AlternoxPrimeBlueprint固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Primary · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励Gyre Prime 机体蓝图（Gyre Prime Chassis Blueprint）蓝图 · 组合已对照，专名仍保留原文（中文名待核）基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。上游zh专名仍保留原文；只补部件／蓝图中文，汉字专名继续待核。精确上游关联：/Lotus/Powersuits/Gyre/GyrePrime/Lotus/Types/Recipes/WarframeRecipes/GyrePrimeChassisComponent固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Warframes · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励佐伦双斧 Prime 蓝图（Dual Zoren Prime Blueprint）蓝图 · 上游专名＋项目蓝图类型词基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。蓝图为项目已有类型词，与上游父专名组合，不冒称完整官方中文字符串。精确上游关联：/Lotus/Weapons/Tenno/Melee/Axe/PrimeZoren/PrimeZorenAxeWeapon/Lotus/Types/Recipes/Weapons/DualZorenPrimeBlueprint固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Melee · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励石晶之花 Prime 枪机（Steflos Prime Receiver）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun/Lotus/Types/Recipes/Weapons/WeaponParts/SteflosPrimeReceiver固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Primary · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励帕里斯 Prime 下弓臂（Paris Prime Lower Limb）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/Bows/PrimeHuntingBow/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeBowLowerLimb固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游部件身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游父实体 Primary（联网打开） ↗检查：2026-10-24 · 资料快照：未知反查此奖励狼牙 Prime 刀刃（Fang Prime Blade）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/Melee/DualDagger/FangPrimeDagger/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeFangBlade固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游部件身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游父实体 Melee（联网打开） ↗检查：2026-10-24 · 资料快照：未知反查此奖励固定遗物奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z获取来源摘录先按下述模式规则理解奖励机会；原表标签不直接等于分钟或波次，也不保证获取次数。不包含全量兑换、复刻或实时裂缝资料。阿波罗多罗斯撞击坑（Apollodorus）中文组合显示已对照；英文原始键保留名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：SolNode94固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知入口与获取说明入口：水星星图 → 阿波罗多罗斯撞击坑（Apollodorus）入口核对：已对照资料；用户账号解锁未知。基础任务模式：生存模式核对：已对照资料奖励表类别：常规任务奖励表具体触发：已对照资料普通生存：按任务计时器检查奖励仅此目录的普通生存来源；不是仲裁、任务变体或现实耗时预测。规则说明：已对照资料；公开资料核对，不是游戏亲测。在星图打开对应节点，启动任务后按指示触发警报。击败敌人并维持生命维持系统，观察任务内生存计时器与奖励提示。任务内每5分钟刻度检查一次奖励，普通序列为A、A、B、C后重复；使用安全旁路可能推进任务计时，不等于现实等待同样时间。已达到撤离条件时走正常撤离点，确认任务结算；不要中止任务强退。本条B表说明：每周期第3次奖励检查取B表，不是第二次。轮次解释核对：已对照资料；表中有记录不等于当前可刷。安全旁路实际刷新与账号解锁未实测；不按墙上时间承诺刷取时长。当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知社区节点事实线索（非导入模块）（联网打开） ↗检查：2026-10-24 · 资料快照：未知PC官方：生存安全旁路（联网打开） ↗检查：2026-10-24 · 资料快照：2026-03-26社区资料：奖励表规则（联网打开） ↗检查：2026-10-24 · 资料快照：未知原始表键与旧条件（追溯）星球／节点：Mercury / Apollodorus原始表模式：生存（Survival）奖励轮次：B旧资料触发／入场条件：未核，请在游戏任务与奖励界面确认表快照已对照 · 当前可获取：未知固定任务奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z神守基地（Lares）中文组合显示已对照；英文原始键保留名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：SolNode130固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知入口与获取说明入口：水星星图 → 神守基地（Lares）入口核对：已对照资料；用户账号解锁未知。基础任务模式：防御模式核对：已对照资料奖励表类别：常规任务奖励表具体触发：已对照资料普通防御：每3波一次奖励检查仅Lares、Romula、Coba普通节点；不套用于Tyana Pass镜像防御或仲裁等变体。规则说明：已对照资料；公开资料核对，不是游戏亲测。从星图选择对应节点，核对普通防御或黑暗地带防御的任务面板。保住防御目标并清理每波敌人；普通防御已由旧5波改为每3波出现奖励与继续／撤离选择。普通奖励检查按A、A、B、C循环；不要把C写成第三轮。达到想核对的奖励机会后，按结算界面的撤离选择正常完成；继续后失败仍有丢失奖励风险。本条A表说明：周期内第1、2次检查为A；普通防御对应完成3、6波。轮次解释核对：已对照资料；表中有记录不等于当前可刷。此说明不是全游戏防御算法，特殊节点应采用各自规则。当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知社区节点事实线索（非导入模块）（联网打开） ↗检查：2026-10-24 · 资料快照：未知PC官方：普通防御改为3波（联网打开） ↗检查：2026-10-24 · 资料快照：2025-03-19社区资料：奖励表规则（联网打开） ↗检查：2026-10-24 · 资料快照：未知原始表键与旧条件（追溯）星球／节点：Mercury / Lares原始表模式：防御（Defense）奖励轮次：A旧资料触发／入场条件：未核，请在游戏任务与奖励界面确认表快照已对照 · 当前可获取：未知固定任务奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z"
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('region', { name: '遗物详情', exact: true }) with timeout 5000ms
  - waiting for getByRole('region', { name: '遗物详情', exact: true })
    14 × locator resolved to <section role="region" aria-label="遗物详情" class="panel relic-detail">…</section>
       - unexpected value "返回查询结果遗物奖励与来源分别核对古纪 A13 遗物（Lith A13 Relic）中文组合显示已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Types/Game/Projections/T1VoidProjectionCitrinePrimeABronze固定上游遗物身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知当前可获取：未知6项基础奖励表已对照快照。来源仅摘录2条，不是全部来源，也不标为完整已核。本版不展示概率。精炼开出概率和获取遗物的掉率含义不同，均不计算；以下为Intact基础表奖励关系。电幻步枪 Prime 蓝图（Alternox Prime Blueprint）蓝图 · 上游专名＋项目蓝图类型词基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。蓝图为项目已有类型词，与上游父专名组合，不冒称完整官方中文字符串。精确上游关联：/Lotus/Weapons/Tenno/LongGuns/PrimeAlternox/PrimeAlternoxWeapon/Lotus/Types/Recipes/Weapons/AlternoxPrimeBlueprint固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Primary · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励Gyre Prime 机体蓝图（Gyre Prime Chassis Blueprint）蓝图 · 组合已对照，专名仍保留原文（中文名待核）基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。上游zh专名仍保留原文；只补部件／蓝图中文，汉字专名继续待核。精确上游关联：/Lotus/Powersuits/Gyre/GyrePrime/Lotus/Types/Recipes/WarframeRecipes/GyrePrimeChassisComponent固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Warframes · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励佐伦双斧 Prime 蓝图（Dual Zoren Prime Blueprint）蓝图 · 上游专名＋项目蓝图类型词基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。蓝图为项目已有类型词，与上游父专名组合，不冒称完整官方中文字符串。精确上游关联：/Lotus/Weapons/Tenno/Melee/Axe/PrimeZoren/PrimeZorenAxeWeapon/Lotus/Types/Recipes/Weapons/DualZorenPrimeBlueprint固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Melee · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励石晶之花 Prime 枪机（Steflos Prime Receiver）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/LongGuns/PrimeSteflos/PrimeSteflosShotgun/Lotus/Types/Recipes/Weapons/WeaponParts/SteflosPrimeReceiver固定上游中文映射 1.1276.31 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游部件身份 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知固定上游父实体 Primary · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：未知反查此奖励帕里斯 Prime 下弓臂（Paris Prime Lower Limb）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/Bows/PrimeHuntingBow/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeBowLowerLimb固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游部件身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游父实体 Primary（联网打开） ↗检查：2026-10-24 · 资料快照：未知反查此奖励狼牙 Prime 刀刃（Fang Prime Blade）部件 · 中文组合显示已对照基础奖励表核对：表快照已对照名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：/Lotus/Weapons/Tenno/Melee/DualDagger/FangPrimeDagger/Lotus/Types/Recipes/Weapons/WeaponParts/PrimeFangBlade固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游部件身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游父实体 Melee（联网打开） ↗检查：2026-10-24 · 资料快照：未知反查此奖励固定遗物奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z获取来源摘录先按下述模式规则理解奖励机会；原表标签不直接等于分钟或波次，也不保证获取次数。不包含全量兑换、复刻或实时裂缝资料。阿波罗多罗斯撞击坑（Apollodorus）中文组合显示已对照；英文原始键保留名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：SolNode94固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知入口与获取说明入口：水星星图 → 阿波罗多罗斯撞击坑（Apollodorus）入口核对：已对照资料；用户账号解锁未知。基础任务模式：生存模式核对：已对照资料奖励表类别：常规任务奖励表具体触发：已对照资料普通生存：按任务计时器检查奖励仅此目录的普通生存来源；不是仲裁、任务变体或现实耗时预测。规则说明：已对照资料；公开资料核对，不是游戏亲测。在星图打开对应节点，启动任务后按指示触发警报。击败敌人并维持生命维持系统，观察任务内生存计时器与奖励提示。任务内每5分钟刻度检查一次奖励，普通序列为A、A、B、C后重复；使用安全旁路可能推进任务计时，不等于现实等待同样时间。已达到撤离条件时走正常撤离点，确认任务结算；不要中止任务强退。本条B表说明：每周期第3次奖励检查取B表，不是第二次。轮次解释核对：已对照资料；表中有记录不等于当前可刷。安全旁路实际刷新与账号解锁未实测；不按墙上时间承诺刷取时长。当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知社区节点事实线索（非导入模块）（联网打开） ↗检查：2026-10-24 · 资料快照：未知PC官方：生存安全旁路（联网打开） ↗检查：2026-10-24 · 资料快照：2026-03-26社区资料：奖励表规则（联网打开） ↗检查：2026-10-24 · 资料快照：未知原始表键与旧条件（追溯）星球／节点：Mercury / Apollodorus原始表模式：生存（Survival）奖励轮次：B旧资料触发／入场条件：未核，请在游戏任务与奖励界面确认表快照已对照 · 当前可获取：未知固定任务奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z神守基地（Lares）中文组合显示已对照；英文原始键保留名称核对依据已对照资料；名称关联不为奖励、入口或当前可获取状态背书。精确上游关联：SolNode130固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知入口与获取说明入口：水星星图 → 神守基地（Lares）入口核对：已对照资料；用户账号解锁未知。基础任务模式：防御模式核对：已对照资料奖励表类别：常规任务奖励表具体触发：已对照资料普通防御：每3波一次奖励检查仅Lares、Romula、Coba普通节点；不套用于Tyana Pass镜像防御或仲裁等变体。规则说明：已对照资料；公开资料核对，不是游戏亲测。从星图选择对应节点，核对普通防御或黑暗地带防御的任务面板。保住防御目标并清理每波敌人；普通防御已由旧5波改为每3波出现奖励与继续／撤离选择。普通奖励检查按A、A、B、C循环；不要把C写成第三轮。达到想核对的奖励机会后，按结算界面的撤离选择正常完成；继续后失败仍有丢失奖励风险。本条A表说明：周期内第1、2次检查为A；普通防御对应完成3、6波。轮次解释核对：已对照资料；表中有记录不等于当前可刷。此说明不是全游戏防御算法，特殊节点应采用各自规则。当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。固定上游节点身份（联网打开） ↗检查：2026-10-24 · 资料快照：未知固定上游中文映射 1.1276.31（联网打开） ↗检查：2026-10-24 · 资料快照：未知社区节点事实线索（非导入模块）（联网打开） ↗检查：2026-10-24 · 资料快照：未知PC官方：普通防御改为3波（联网打开） ↗检查：2026-10-24 · 资料快照：2025-03-19社区资料：奖励表规则（联网打开） ↗检查：2026-10-24 · 资料快照：未知原始表键与旧条件（追溯）星球／节点：Mercury / Lares原始表模式：防御（Defense）奖励轮次：A旧资料触发／入场条件：未核，请在游戏任务与奖励界面确认表快照已对照 · 当前可获取：未知固定任务奖励表 · v2核对（联网打开） ↗检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z"

```

```yaml
- region "遗物详情":
  - button "返回查询结果"
  - paragraph: 遗物奖励与来源分别核对
  - heading "古纪 A13 遗物（Lith A13 Relic）" [level=3]
  - paragraph: 中文组合显示已对照
  - group: 名称核对依据
  - paragraph: 当前可获取：未知
  - paragraph: 6项基础奖励表已对照快照。来源仅摘录2条，不是全部来源，也不标为完整已核。
  - paragraph: 本版不展示概率。精炼开出概率和获取遗物的掉率含义不同，均不计算；以下为Intact基础表奖励关系。
  - list:
    - listitem:
      - text: 电幻步枪 Prime 蓝图（Alternox Prime Blueprint） 蓝图 · 上游专名＋项目蓝图类型词 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
    - listitem:
      - text: Gyre Prime 机体蓝图（Gyre Prime Chassis Blueprint） 蓝图 · 组合已对照，专名仍保留原文（中文名待核） 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
    - listitem:
      - text: 佐伦双斧 Prime 蓝图（Dual Zoren Prime Blueprint） 蓝图 · 上游专名＋项目蓝图类型词 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
    - listitem:
      - text: 石晶之花 Prime 枪机（Steflos Prime Receiver） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
    - listitem:
      - text: 帕里斯 Prime 下弓臂（Paris Prime Lower Limb） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
    - listitem:
      - text: 狼牙 Prime 刀刃（Fang Prime Blade） 部件 · 中文组合显示已对照 基础奖励表核对：表快照已对照
      - group: 名称核对依据
      - button "反查此奖励"
  - link "固定遗物奖励表 · v2核对（联网打开） ↗":
    - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/relics.json
  - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
  - heading "获取来源摘录" [level=4]
  - paragraph: 先按下述模式规则理解奖励机会；原表标签不直接等于分钟或波次，也不保证获取次数。不包含全量兑换、复刻或实时裂缝资料。
  - article:
    - heading "阿波罗多罗斯撞击坑（Apollodorus）" [level=4]
    - text: 中文组合显示已对照；英文原始键保留
    - group: 名称核对依据
    - heading "入口与获取说明" [level=4]
    - paragraph: 入口：水星星图 → 阿波罗多罗斯撞击坑（Apollodorus）
    - text: 入口核对：已对照资料；用户账号解锁未知。
    - paragraph: 基础任务模式：生存
    - text: 模式核对：已对照资料
    - paragraph: 奖励表类别：常规任务奖励表
    - paragraph: 具体触发：已对照资料
    - heading "普通生存：按任务计时器检查奖励" [level=4]
    - paragraph: 仅此目录的普通生存来源；不是仲裁、任务变体或现实耗时预测。
    - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
    - list:
      - listitem: 在星图打开对应节点，启动任务后按指示触发警报。
      - listitem: 击败敌人并维持生命维持系统，观察任务内生存计时器与奖励提示。
      - listitem: 任务内每5分钟刻度检查一次奖励，普通序列为A、A、B、C后重复；使用安全旁路可能推进任务计时，不等于现实等待同样时间。
      - listitem: 已达到撤离条件时走正常撤离点，确认任务结算；不要中止任务强退。
    - paragraph: 本条B表说明：每周期第3次奖励检查取B表，不是第二次。
    - text: 轮次解释核对：已对照资料；表中有记录不等于当前可刷。
    - list:
      - listitem: 安全旁路实际刷新与账号解锁未实测；不按墙上时间承诺刷取时长。
      - listitem: 当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。
    - link "固定上游节点身份（联网打开） ↗":
      - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/Node.json
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "固定上游中文映射 1.1276.31（联网打开） ↗":
      - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/i18n/zh.json
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "社区节点事实线索（非导入模块）（联网打开） ↗":
      - /url: https://wiki.warframe.com/w/Module:Missions/data
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "PC官方：生存安全旁路（联网打开） ↗":
      - /url: https://www.warframe.com/en/patch-notes/pc/42-0-0
    - text: 检查：2026-10-24 · 资料快照：2026-03-26
    - link "社区资料：奖励表规则（联网打开） ↗":
      - /url: https://wiki.warframe.com/w/Mission_Rewards
    - text: 检查：2026-10-24 · 资料快照：未知
    - group: 原始表键与旧条件（追溯）
    - paragraph: 表快照已对照 · 当前可获取：未知
    - link "固定任务奖励表 · v2核对（联网打开） ↗":
      - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
    - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
  - article:
    - heading "神守基地（Lares）" [level=4]
    - text: 中文组合显示已对照；英文原始键保留
    - group: 名称核对依据
    - heading "入口与获取说明" [level=4]
    - paragraph: 入口：水星星图 → 神守基地（Lares）
    - text: 入口核对：已对照资料；用户账号解锁未知。
    - paragraph: 基础任务模式：防御
    - text: 模式核对：已对照资料
    - paragraph: 奖励表类别：常规任务奖励表
    - paragraph: 具体触发：已对照资料
    - heading "普通防御：每3波一次奖励检查" [level=4]
    - paragraph: 仅Lares、Romula、Coba普通节点；不套用于Tyana Pass镜像防御或仲裁等变体。
    - text: 规则说明：已对照资料；公开资料核对，不是游戏亲测。
    - list:
      - listitem: 从星图选择对应节点，核对普通防御或黑暗地带防御的任务面板。
      - listitem: 保住防御目标并清理每波敌人；普通防御已由旧5波改为每3波出现奖励与继续／撤离选择。
      - listitem: 普通奖励检查按A、A、B、C循环；不要把C写成第三轮。
      - listitem: 达到想核对的奖励机会后，按结算界面的撤离选择正常完成；继续后失败仍有丢失奖励风险。
    - paragraph: 本条A表说明：周期内第1、2次检查为A；普通防御对应完成3、6波。
    - text: 轮次解释核对：已对照资料；表中有记录不等于当前可刷。
    - list:
      - listitem: 此说明不是全游戏防御算法，特殊节点应采用各自规则。
      - listitem: 当前账号解锁、当前遗物掉落仍未知；上游zh字段为原文时不制造中文专名。
    - link "固定上游节点身份（联网打开） ↗":
      - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/Node.json
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "固定上游中文映射 1.1276.31（联网打开） ↗":
      - /url: https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/i18n/zh.json
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "社区节点事实线索（非导入模块）（联网打开） ↗":
      - /url: https://wiki.warframe.com/w/Module:Missions/data
    - text: 检查：2026-10-24 · 资料快照：未知
    - link "PC官方：普通防御改为3波（联网打开） ↗":
      - /url: https://www.warframe.com/en/patch-notes/pc/38-5-0
    - text: 检查：2026-10-24 · 资料快照：2025-03-19
    - link "社区资料：奖励表规则（联网打开） ↗":
      - /url: https://wiki.warframe.com/w/Mission_Rewards
    - text: 检查：2026-10-24 · 资料快照：未知
    - group: 原始表键与旧条件（追溯）
    - paragraph: 表快照已对照 · 当前可获取：未知
    - link "固定任务奖励表 · v2核对（联网打开） ↗":
      - /url: https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/data/missionRewards.json
    - text: 检查：2026-10-25 · 资料快照：2026-10-07T15:18:33Z
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFile,writeFile} from 'node:fs/promises';
  3  | import type {RelicCatalog} from '../src/domain/relics';
  4  | import {TEST_ORIGIN,evidencePath} from './environment';
  5  | const catalog=JSON.parse(await readFile('src/catalog/relics.v1.json','utf8')) as RelicCatalog;
  6  | const results=(page:Page)=>page.getByRole('region',{name:'遗物查询结果',exact:true});
  7  | const detail=(page:Page)=>page.getByRole('region',{name:'遗物详情',exact:true});
  8  | const reverse=(page:Page)=>page.getByRole('region',{name:'奖励反查结果',exact:true});
  9  | async function records(page:Page){return page.evaluate(()=>new Promise<unknown>((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['profiles','snapshots','imports']),a=tx.objectStore('profiles').getAll(),b=tx.objectStore('snapshots').getAll(),c=tx.objectStore('imports').getAll();tx.oncomplete=()=>{resolve([a.result,b.result,c.result]);db.close();};};}));}
  10 | async function open(page:Page){await page.goto('/#relics');await expect(page.getByRole('status')).toContainText('本地档案就绪');await expect(page.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');}
  11 | test('without a profile all real samples have six complete rewards, traceable excerpted routes and bounded reverse edges',async({page})=>{
  12 |  test.setTimeout(120000);await open(page);const before=await records(page);
  13 |  for(const relic of catalog.relics){await results(page).getByRole('button',{name:`查看遗物 ${relic.tier} ${relic.code}`,exact:true}).click();await expect(detail(page).getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(detail(page)).toContainText('当前可获取：未知');await expect(detail(page)).toContainText('来源仅摘录');await expect(detail(page).getByTestId('relic-route')).toHaveCount(2);
  14 |   for(const relation of catalog.relations.filter(x=>x.relicId===relic.id)){const reward=catalog.rewards.find(x=>x.id===relation.rewardId)!;await expect(detail(page).getByTestId('reward:'+reward.id)).toContainText(reward.english);await detail(page).getByTestId('reward:'+reward.id).getByRole('button',{name:'反查此奖励',exact:true}).click();await expect(reverse(page)).toContainText('仅本目录范围');const expected=catalog.relics.filter(x=>catalog.relations.some(e=>e.rewardId===reward.id&&e.relicId===x.id)).map(x=>x.id);expect(await reverse(page).locator('button[data-relic-id]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-relic-id')))).toEqual(expected);await reverse(page).getByRole('button',{name:`查看遗物 ${relic.tier} ${relic.code}`,exact:true}).click();}
  15 |   for(const link of catalog.acquisitions.filter(x=>x.relicId===relic.id)){const location=catalog.locations.find(x=>x.id===link.locationId)!;const route=detail(page).getByTestId(link.id);await expect(route).toContainText(location.planet);await expect(route).toContainText(location.node);await expect(route).toContainText(location.mode);await expect(route).toContainText('奖励轮次：'+link.rotation);for(const id of link.sourceIds)await expect(route.locator(`a[data-source-id="${id}"]`)).toHaveAttribute('href',catalog.sources.find(x=>x.id===id)!.url);}
  16 |  }
  17 |  expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_All_Samples.json'),JSON.stringify({relics:12,rewardRows:72,excerptedRoutes:24,everyReverseEdgeChecked:true,noProfileRequired:true,profilesSnapshotsImportsUnchanged:true,currentAvailabilityUnknown:true},null,2));
  18 | });
  19 | test('era and code filters, Forma reverse search and unrecorded queries disclose finite scope',async({page})=>{
  20 |  await open(page);const before=await records(page);await page.getByLabel('纪元筛选',{exact:true}).selectOption('Axi');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(8);await page.getByLabel('纪元筛选',{exact:true}).selectOption('');await page.getByLabel('遗物名称或编号',{exact:true}).fill('g14');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(1);await page.getByRole('button',{name:'按奖励查遗物',exact:true}).click();await page.getByLabel('奖励名称',{exact:true}).fill('福马');await expect(results(page).locator('button[data-reward-id]')).toHaveCount(2);await results(page).getByRole('button',{name:'反查奖励 福马蓝图',exact:true}).click();await expect(reverse(page).locator('button[data-relic-id]')).toHaveCount(12);await expect(reverse(page)).toContainText('仅本目录范围');await page.getByLabel('奖励名称',{exact:true}).fill('合成测试-本目录未收录');await expect(results(page)).toContainText('本目录未收录／未找到');await expect(reverse(page)).toHaveCount(0);await expect(page.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_Search_Scope.json'),JSON.stringify({eraFilter:true,codeCaseInsensitive:true,formaUsesExistingId:true,reverseCount12OnlyInCatalog:true,noResultNotGameAbsence:true,readonly:true},null,2));
  21 | });
  22 | test('public relic queries survive profile switches without storing inventory, targets or query history',async({page})=>{
  23 |  await open(page);await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const a=await page.getByLabel('切换档案').inputValue();await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const b=await page.getByLabel('切换档案').inputValue(),before=await records(page);await page.getByLabel('遗物名称或编号',{exact:true}).fill('S8');await results(page).getByRole('button',{name:'查看遗物 Axi S8',exact:true}).click();for(const id of [a,b]){await page.getByLabel('切换档案').selectOption(id);await expect(page.getByLabel('遗物名称或编号',{exact:true})).toHaveValue('S8');await expect(detail(page)).toContainText('Axi S8');}await detail(page).getByRole('button',{name:'返回查询结果',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_Profile_Readonly.json'),JSON.stringify({publicQueryIndependentOfProfile:true,querySelectionRetained:true,profilesSnapshotsImportsEqual:true,noRelicInventoryOrHistoryWrites:true},null,2));
  24 | });
  25 | test('all embedded relic tables and source snapshots reopen offline after a controlled page closes',async({page,context})=>{
> 26 |  await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#relics');await expect(offline.getByTestId('relic-count')).toHaveText('本轮已收录31个遗物');for(const r of catalog.relics){await results(offline).getByRole('button',{name:`查看遗物 ${r.tier} ${r.code}`,exact:true}).click();await expect(detail(offline).getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(detail(offline)).toContainText('2026-10-21');await expect(detail(offline).getByTestId('relic-route')).toHaveCount(2);}expect(await records(offline)).toEqual(before);await offline.screenshot({path:evidencePath('Relics_Offline.png'),fullPage:true});await writeFile(evidencePath('Relics_Offline.json'),JSON.stringify({swControlledBeforeOffline:true,closedAndReopenedDeepLink:true,all12TablesAnd24SourcesReadable:true,externalLinksNotOpenedOffline:true,readonly:true},null,2));
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ^ Error: expect(locator).toContainText(expected) failed
  27 | });
  28 | test('desktop and 360/412 portrait and landscape layouts keep source limits and unknown conditions readable',async({page})=>{
  29 |  await open(page);await results(page).getByRole('button',{name:'查看遗物 Lith C7',exact:true}).click();await expect(detail(page)).toContainText('触发／入场条件：未核');await expect(detail(page)).toContainText('本版不展示概率');await expect(detail(page)).toContainText('中文名待核');await page.screenshot({path:evidencePath('Relics_Desktop.png'),fullPage:true});await detail(page).screenshot({path:evidencePath('Relics_Detail_Desktop.png')});for(const [width,height] of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:evidencePath(`Relics_Viewport_${width}.png`),fullPage:true});await detail(page).screenshot({path:evidencePath(`Relics_Detail_${width}.png`)});}await writeFile(evidencePath('Relics_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,sourceAndAvailabilitySeparate:true,androidPhysical:false,gameplayVerified:false},null,2));
  30 | });
  31 | 
```