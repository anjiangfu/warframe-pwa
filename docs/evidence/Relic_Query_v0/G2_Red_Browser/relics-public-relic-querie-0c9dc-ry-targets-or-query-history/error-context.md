# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relics.spec.ts >> public relic queries survive profile switches without storing inventory, targets or query history
- Location: e2e\relics.spec.ts:22:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByTestId('relic-count')
Expected: "本轮已收录12个遗物"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" getByTestId('relic-count') with timeout 5000ms
  - waiting for getByTestId('relic-count')

```

```yaml
- complementary:
  - text: ✦ 天诺星图 本地行动档案 当前档案
  - combobox "切换档案":
    - option "尚未创建" [disabled] [selected]
  - text: MR
  - strong: "?"
  - text: 目标 未知 未知 分钟 / 日
  - paragraph: 0 项目标已完成
  - navigation:
    - button "养成助手": ✧ 养成助手 ↗
    - button "互动科技树": ◇ 互动科技树 ↗
    - button "材料查询": ⌕ 材料查询 ↗
    - button "制作缺口": ▱ 制作缺口 ↗
    - button "集团晋升": ⊙ 集团晋升 ↗
    - button "档案与物资": ▤ 档案与物资 ↗
    - button "备份与恢复": ⇅ 备份与恢复 ↗
    - button "行动日志": ≡ 行动日志 ↗
  - text: 个人资料仅存此设备
  - paragraph: 动态资料：尚未同步
  - button "＋ 新建空白档案"
- main:
  - text: 构建 m0-fbb82243497d · 离线应用壳已就绪
  - paragraph: TENNO / 个人进度终端
  - heading "把下一步，变成自己的路线。" [level=1]
  - paragraph: 记录养成，保留选择。无需游戏账号或云端登录。
  - text: ● 浏览器在线 档案在本机
  - status: 本地档案就绪
  - text: 用户模板 · 事实待核实 ✦
  - paragraph: 一个属于你的养成起点
  - heading "七条路线，随你选择。" [level=2]
  - paragraph: 首次创建时，可使用你原有的 MR12 模板。段位、目标和每日时间都能修改。
  - button "使用 MR12 模板创建档案"
  - button "从空白档案开始"
  - button "我有旧存档，先预览导入"
  - text: 天诺星图 · 材料与制作 v0 中文优先 / 你的数据由你保管
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
> 10 | async function open(page:Page){await page.goto('/#relics');await expect(page.getByRole('status')).toContainText('本地档案就绪');await expect(page.getByTestId('relic-count')).toHaveText('本轮已收录12个遗物');}
     |                                                                                                                                                                         ^ Error: expect(locator).toHaveText(expected) failed
  11 | test('without a profile all real samples have six complete rewards, traceable excerpted routes and bounded reverse edges',async({page})=>{
  12 |  test.setTimeout(120000);await open(page);const before=await records(page);
  13 |  for(const relic of catalog.relics){await results(page).getByRole('button',{name:`查看遗物 ${relic.tier} ${relic.code}`,exact:true}).click();await expect(detail(page).getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(detail(page)).toContainText('当前可获取：未知');await expect(detail(page)).toContainText('来源仅摘录');await expect(detail(page).getByTestId('relic-route')).toHaveCount(2);
  14 |   for(const relation of catalog.relations.filter(x=>x.relicId===relic.id)){const reward=catalog.rewards.find(x=>x.id===relation.rewardId)!;await expect(detail(page).getByTestId('reward:'+reward.id)).toContainText(reward.english);await detail(page).getByTestId('reward:'+reward.id).getByRole('button',{name:'反查此奖励',exact:true}).click();await expect(reverse(page)).toContainText('仅本目录范围');const expected=catalog.relics.filter(x=>catalog.relations.some(e=>e.rewardId===reward.id&&e.relicId===x.id)).map(x=>x.id);expect(await reverse(page).locator('button[data-relic-id]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-relic-id')))).toEqual(expected);await reverse(page).getByRole('button',{name:`查看遗物 ${relic.tier} ${relic.code}`,exact:true}).click();}
  15 |   for(const link of catalog.acquisitions.filter(x=>x.relicId===relic.id)){const location=catalog.locations.find(x=>x.id===link.locationId)!;const route=detail(page).getByTestId(link.id);await expect(route).toContainText(location.planet);await expect(route).toContainText(location.node);await expect(route).toContainText(location.mode);await expect(route).toContainText('奖励轮次：'+link.rotation);for(const id of link.sourceIds)await expect(route.locator(`a[data-source-id="${id}"]`)).toHaveAttribute('href',catalog.sources.find(x=>x.id===id)!.url);}
  16 |  }
  17 |  expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_All_Samples.json'),JSON.stringify({relics:12,rewardRows:72,excerptedRoutes:24,everyReverseEdgeChecked:true,noProfileRequired:true,profilesSnapshotsImportsUnchanged:true,currentAvailabilityUnknown:true},null,2));
  18 | });
  19 | test('era and code filters, Forma reverse search and unrecorded queries disclose finite scope',async({page})=>{
  20 |  await open(page);const before=await records(page);await page.getByLabel('纪元筛选',{exact:true}).selectOption('Axi');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(3);await page.getByLabel('纪元筛选',{exact:true}).selectOption('');await page.getByLabel('遗物名称或编号',{exact:true}).fill('g14');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(1);await page.getByRole('button',{name:'按奖励查遗物',exact:true}).click();await page.getByLabel('奖励名称',{exact:true}).fill('福马');await expect(results(page).locator('button[data-reward-id]')).toHaveCount(1);await results(page).getByRole('button',{name:'反查奖励 福马蓝图',exact:true}).click();await expect(reverse(page).locator('button[data-relic-id]')).toHaveCount(12);await expect(reverse(page)).toContainText('仅本目录范围');await page.getByLabel('奖励名称',{exact:true}).fill('合成测试-本目录未收录');await expect(results(page)).toContainText('本目录未收录／未找到');await expect(reverse(page)).toHaveCount(0);await expect(page.getByTestId('relic-count')).toHaveText('本轮已收录12个遗物');await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_Search_Scope.json'),JSON.stringify({eraFilter:true,codeCaseInsensitive:true,formaUsesExistingId:true,reverseCount12OnlyInCatalog:true,noResultNotGameAbsence:true,readonly:true},null,2));
  21 | });
  22 | test('public relic queries survive profile switches without storing inventory, targets or query history',async({page})=>{
  23 |  await open(page);await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const a=await page.getByLabel('切换档案').inputValue();await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const b=await page.getByLabel('切换档案').inputValue(),before=await records(page);await page.getByLabel('遗物名称或编号',{exact:true}).fill('S8');await results(page).getByRole('button',{name:'查看遗物 Axi S8',exact:true}).click();for(const id of [a,b]){await page.getByLabel('切换档案').selectOption(id);await expect(page.getByLabel('遗物名称或编号',{exact:true})).toHaveValue('S8');await expect(detail(page)).toContainText('Axi S8');}await detail(page).getByRole('button',{name:'返回查询结果',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relics_Profile_Readonly.json'),JSON.stringify({publicQueryIndependentOfProfile:true,querySelectionRetained:true,profilesSnapshotsImportsEqual:true,noRelicInventoryOrHistoryWrites:true},null,2));
  24 | });
  25 | test('all embedded relic tables and source snapshots reopen offline after a controlled page closes',async({page,context})=>{
  26 |  await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#relics');await expect(offline.getByTestId('relic-count')).toHaveText('本轮已收录12个遗物');for(const r of catalog.relics){await results(offline).getByRole('button',{name:`查看遗物 ${r.tier} ${r.code}`,exact:true}).click();await expect(detail(offline).getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(detail(offline)).toContainText('2026-10-21');await expect(detail(offline).getByTestId('relic-route')).toHaveCount(2);}expect(await records(offline)).toEqual(before);await offline.screenshot({path:evidencePath('Relics_Offline.png'),fullPage:true});await writeFile(evidencePath('Relics_Offline.json'),JSON.stringify({swControlledBeforeOffline:true,closedAndReopenedDeepLink:true,all12TablesAnd24SourcesReadable:true,externalLinksNotOpenedOffline:true,readonly:true},null,2));
  27 | });
  28 | test('desktop and 360/412 portrait and landscape layouts keep source limits and unknown conditions readable',async({page})=>{
  29 |  await open(page);await results(page).getByRole('button',{name:'查看遗物 Lith C7',exact:true}).click();await expect(detail(page)).toContainText('触发／入场条件：未核');await expect(detail(page)).toContainText('本版不展示概率');await expect(detail(page)).toContainText('中文名待核');await page.screenshot({path:evidencePath('Relics_Desktop.png'),fullPage:true});await detail(page).screenshot({path:evidencePath('Relics_Detail_Desktop.png')});for(const [width,height] of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:evidencePath(`Relics_Viewport_${width}.png`),fullPage:true});await detail(page).screenshot({path:evidencePath(`Relics_Detail_${width}.png`)});}await writeFile(evidencePath('Relics_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,sourceAndAvailabilitySeparate:true,androidPhysical:false,gameplayVerified:false},null,2));
  30 | });
  31 | 
```