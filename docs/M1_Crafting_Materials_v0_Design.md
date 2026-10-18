# M1制作缺口与材料查询v0：设计与执行

2026-10-18；用户已审阅方案并明确“可以，继续”，本轮直接实施。基线f69afb917eac798795e55a67533366b690873f74，工作区干净，新分支codex/m1-crafting-materials-v0。AGENTS、PRD、原树审查和上一轮验收已读；只覆盖一次性M1小步，不恢复监控或扩大返修授权。

采用小型统一资源目录＋一条配方，避免武器页继续重复材料功能，也不导入整库。首批10项（含原三材料、星币/福马、蓝图和四种配方资源），数量是内容范围，不是代码容量上限。新入口沿用深色终端，制作页面明确分开“单独参考”和“共享合计”，材料详情可复用。

## 责任与模型

- ResourceCatalog经LocalProvider合并原weapon目录三材料和新增resources.v1.json；重复资源/来源/获取ID直接拒绝，不后加载覆盖。原weapon目录和注入参数保留，资源详情在有Provider资源索引时实际使用同一组件；旧三材料定义仍只有原JSON一处。
- CraftingCatalog只有recipe:forma，产出forma、每批1，投入credits35000、四资源各1、单次蓝图1；各数量带来源/日期/verification，官方仅证明裂缝获取边界。旧汇总表冲突与取舍见来源表。查询是参考资料核对，不称游戏内实测。
- Profile可选craftingTargets:Record<recipeId,计划新产出数量>，只在显式加入/修改时写。完成状态唯一存goalStates[craftGoalId(recipeId)]，加入默认关注，修改数量保留完成/暂缓；成品库存不抵扣本次计划，完成不增减任何库存。DB/schema保持1，catalogVersion升级2026.10.18.2。
- 纯函数按批次向上取整，使用安全整数校验和溢出保护。未核实字段不参与确定计算，保留已知部分，给出不完整结果。缺失/null库存未知、0明确，旧非法或小数库存不裁剪，提示核对。
- 汇总先合计同ID需求，再抵扣stock一次；逐资源可查看贡献项目。完成/暂缓目标不计入。兼容安装计划仅在明确关注且确实尚未安装/未进入后续操作时加入；安装状态未知则提示需求待核，海波IV不生成材料需求，已完成目标不重新加入。
- 旧目录失去引用的制作数量/状态保留，以旧引用待匹配展示，汇总不完整；不递归展开配方。所有写入沿现有mutate/Repository/revision/广播/更新屏障，容量/深度/值数不变。

## ID与唯一数据

credits、endo、forma、platinum及material:pathos-clamp/material:yao-shrub/material:eevani不变。新增material:morphics、material:neural-sensors、material:neurodes、material:orokin-cell、blueprint:forma。旧RESOURCE_NAMES仅保留原表单展示兼容，不另建库存。

recipe:forma → goalStates[crafting:recipe:forma]，数量只在craftingTargets[recipe:forma]。蓝图是消耗品库存，以blueprint:forma记录，不从科技树推断；地图/任务是否开放始终单列未知。安装清单是installation，不能称铸造厂配方。

## 分步检查点

- [x] G0：来源、设计、ID及保护输入17项hash，先本地提交。
- [x] G1：先补失败的资源/配方纯函数用例，实现检索、数量/批次/溢出、共享80+80−100=60、待核/缺引用/改目录；通过后提交。
- [x] G2：可选字段验证、显式加入/修改、档案隔离和保存失败、含全部旧字段/原件的新格式完整往返；通过后提交。
- [x] G3：独立材料、共享详情、制作页面和助手投影/链接；真实生产Chrome查询无写、库存同步、数量/完成/恢复、下载恢复与移动截图；通过后提交。
- [x] G4：保留37单测/18浏览器回归，跑lint/test/typecheck/build/生产browser；更新中断/离线、17hash、许可/README/验收/完整提交hash。证据仅docs/evidence/M1_Crafting_Materials_v0/。测试短资料目录app/.b/及4186端口（4190绑定失败，未改系统），体验4192；不停止4173/4180/4184。交付后停止。

合成测试另建多产出配方及共享材料目标，不进真实目录。Android物理触屏、可信HTTPS安装及游戏内刷取/当前铸造界面仍需设备/人测；桌面Chrome移动视口不替代。

不实现集团、遗物、递归、制作计时、库存自动扣除、联网、全百科或最优收益算法。不添加依赖，不复制第三方代码/整库/攻略/素材，不推送/合并/公开部署/改系统。

最终验收、检查点与失败修正见[M1_Crafting_Materials_v0_Acceptance.md](M1_Crafting_Materials_v0_Acceptance.md)。50单测、21生产Chrome及全部质量命令通过；实际设备/安装与游戏实测仍未完成。本轮完成后停止。
