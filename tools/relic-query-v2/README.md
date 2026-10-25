# 遗物查询 v2 离线转换工具

这是本项目独立编写的有限资料适配器，只读取固定公开JSON／许可／元数据，不读浏览器、个人档案或网络，不执行第三方包代码。原始大文件留忽略目录.v，不导入PWA。

从项目根运行：

```powershell
node --test tools/relic-query-v2/convert.test.mjs
node tools/relic-query-v2/convert.mjs .v/rv2/catalog.check.json
```

输出路径必须显式指定；上面只生成检查副本。经过核对需要更新发布目录时，显式指定app/src/catalog/relics.v1.json。不会默认覆盖文件，也不会从当前目录猜测个人存档。输出是UTF-8、2空格缩进及LF；相同固定输入序列化字节完全一致。

loadPinned严格验证docs/evidence/Relic_Query_v2/Inputs.json中所有原始文件SHA，失败不解析／转换，不换源。原始输入缺失时应停止并按下列固定公共来源人工取得相应文件，再核对hash；不能改manifest接受别的快照。本地.v文件未纳入Git，完整选中源记录与映射审计在该证据目录，不把忽略输入不存在称作游戏不存在。

- .v/rl-source/{data/relics.json,data/missionRewards.json,data/info.json,README.md,package.json,data-index.json}来自https://raw.githubusercontent.com/WFCD/warframe-drop-data/3263b2dff8bc1b434a191f0364395b156bd26561/同路径。license.txt对应该提交LICENSE，hash与原MIT声明一致。
- .v/rv1-source/{zh.json,components.json,nodes.json,relics.json,Warframes.json,Melee.json,Primary.json,Secondary.json,Arch-Melee.json}来自https://cdn.jsdelivr.net/npm/@wfcd/items@1.1276.31/data/json/，前三类重命名分别对应i18n/zh.json、Components.json、Node.json，relics对应Relics.json，其余同名。
- 同目录items-license.txt、items-readme.md、jsdelivr-package.json分别对应该固定包根LICENSE、README.md、package.json。保留元数据version差异说明，不对hash不符的新请求文件放宽检查或自动换版。

纯函数convertCatalog输入为已解析的公开数据和G0 Baseline_Catalog，克隆基线后追加新实体；不改输入。七节点／四纪元批准集合为明确常量。每个新遗物取唯一Intact六奖励；每节点按A/B/C先命中，再按批准节点顺序选不同节点前两条。相同源奖励只建一个实体，源ID／英文冲突、重复Intact／ID、缺奖励、来源不足和不明部件类型明确报错。中文只按精确父／组件与drops.type关联；缺中文不补造，冲突候选不用于可信搜索。

2X Forma Blueprint为明确源奖励数量组合，通过可选bundleOf引用blueprint:forma×2；不建成品福马或同义库存。转换测试另计7项，合成故障仅在内存中，不能写入真实目录。应用单元另有原集合深相等、完整原行、正反查及bundle引用／数量约束测试。
