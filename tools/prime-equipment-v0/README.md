# Prime 装备关联审计和元数据生成

仅执行本项目自写的只读文件适配代码，不联网，不读个人档案，不加载或运行上游JavaScript。

从项目根目录运行：

```powershell
node tools/prime-equipment-v0/audit.mjs 'C:/Users/21904/Documents/Codex/2026-10-16/referenced-chatgpt-conversation-this-is-an-2/work/planning-references-20261026/equipment-group-census.json'
node tools/prime-equipment-v0/generate.mjs .v/pg/equipment.check.json
```

审计先核固定文件SHA，独立遍历原117奖励；精确父/组件二元ID须同时存在于父components和组件parentUniqueNames。先算35父/115关联/9待核名，再比较批准预查。Author_Audit是自写适配器的核对事实；如固定输入缺失或hash不符，应停止，不改manifest、自动换版或按名称猜关联。

生成仅取35父同ID名称、115个已收录组件ID子集及出处/hash；没有完整配方或数量。输出路径必需明确，检查副本不会自动覆盖原目录。相同固定输入字节可重复生成20,522字节附件。首次发布使用显式路径app/src/catalog/prime-equipment.v1.json；原relics/source-check附件完全不变。

领域和Provider测试位于app/src/test/prime-equipment.test.ts。app/e2e/fixtures仅是独立合成故障/部分筛选的浏览器构建入口；正常生产build不引用它，不注册SW或接触DB。正式浏览器文件在原60项之外新增5项，35父和115奖励链接均实际点击验证；独立Hex用例另外运行，不混入正式计数。

严格使用隔离副本运行所有质量命令，包括Vitest：现有主Vite插件closeBundle会在测试服务关闭时写dist/SW，不应在根app运行单测。首次G1红灯错误在根目录执行的影响与两文件原字节恢复，详见本轮Root_Dist_Incident.json；这不等于旧SW首次接管超时的原因或修复。
