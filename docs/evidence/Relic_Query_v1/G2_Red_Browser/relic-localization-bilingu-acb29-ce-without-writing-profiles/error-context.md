# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relic-localization.spec.ts >> bilingual displays and all 56 added name searches expose exact source evidence without writing profiles
- Location: e2e\relic-localization.spec.ts:10:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: '奖励反查结果', exact: true })
Expected substring: "西诺斯 Prime 下弓臂"
Received string:    "部件 · Cernos Prime Lower LimbCernos Prime Lower Limb · 部件本目录命中1个遗物（仅本目录范围）。这是有限样本，不能当作该奖励的全部来源。虚空遗物 · Lith C7Lith C7 Relic · 当前可获取未知"
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByRole('region', { name: '奖励反查结果', exact: true }) with timeout 5000ms
  - waiting for getByRole('region', { name: '奖励反查结果', exact: true })
    14 × locator resolved to <section class="panel" role="region" aria-label="奖励反查结果">…</section>
       - unexpected value "部件 · Cernos Prime Lower LimbCernos Prime Lower Limb · 部件本目录命中1个遗物（仅本目录范围）。这是有限样本，不能当作该奖励的全部来源。虚空遗物 · Lith C7Lith C7 Relic · 当前可获取未知"

```

```yaml
- region "奖励反查结果":
  - heading "部件 · Cernos Prime Lower Limb" [level=3]
  - paragraph: Cernos Prime Lower Limb · 部件
  - paragraph: 本目录命中1个遗物（仅本目录范围）。这是有限样本，不能当作该奖励的全部来源。
  - button "查看遗物 Lith C7": 虚空遗物 · Lith C7 Lith C7 Relic · 当前可获取未知
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFile,writeFile} from 'node:fs/promises';
  3  | import type {RelicCatalog} from '../src/domain/relics';
  4  | import {TEST_ORIGIN,evidencePath} from './environment';
  5  | const c=JSON.parse(await readFile('src/catalog/relics.v1.json','utf8')) as RelicCatalog;
  6  | const results=(p:Page)=>p.getByRole('region',{name:'遗物查询结果',exact:true}),detail=(p:Page)=>p.getByRole('region',{name:'遗物详情',exact:true}),reverse=(p:Page)=>p.getByRole('region',{name:'奖励反查结果',exact:true});
  7  | async function records(p:Page){return p.evaluate(()=>new Promise<unknown>((resolve,reject)=>{const q=indexedDB.open('tenno-planner');q.onerror=()=>reject(q.error);q.onsuccess=()=>{const db=q.result,tx=db.transaction(['profiles','snapshots','imports']),a=tx.objectStore('profiles').getAll(),b=tx.objectStore('snapshots').getAll(),c=tx.objectStore('imports').getAll();tx.oncomplete=()=>{resolve([a.result,b.result,c.result]);db.close();};};}));}
  8  | async function open(p:Page){await p.goto('/#relics');await expect(p.getByRole('status')).toContainText('本地档案就绪');await expect(p.getByTestId('relic-count')).toHaveText('本轮已收录12个遗物');}
  9  | async function choose(p:Page,id:string){const relic=c.relics.find(x=>x.id===id)!;await p.getByRole('button',{name:'按遗物查奖励',exact:true}).click();await p.getByLabel('遗物名称或编号',{exact:true}).fill(relic.tier+' '+relic.code);await results(p).locator(`button[data-relic-id="${id}"]`).click();}
  10 | test('bilingual displays and all 56 added name searches expose exact source evidence without writing profiles',async({page})=>{
  11 |  test.setTimeout(90000);await open(page);const before=await records(page);await page.getByRole('button',{name:'按奖励查遗物',exact:true}).click();for(const r of c.rewards.filter(r=>r.display)){
> 12 |   for(const q of [r.display!.nameZh.replace(/\s+/g,''),r.english]){await page.getByLabel('奖励名称',{exact:true}).fill(q);await results(page).locator(`button[data-reward-id="${r.id}"]`).click();await expect(reverse(page)).toContainText(r.display!.nameZh);await expect(reverse(page)).toContainText(r.english);}
     |                                                                                                                                                                                                                           ^ Error: expect(locator).toContainText(expected) failed
  13 |   await expect(reverse(page).getByTestId('name-evidence')).toContainText('2026-10-24');await expect(reverse(page).getByTestId('name-evidence')).toContainText(r.display!.upstreamIds[1]);if(r.display!.properNameUntranslated)await expect(reverse(page)).toContainText('专名仍保留原文');
  14 |  }
  15 |  await choose(page,'relic:lith:g14');await expect(detail(page)).toContainText('古纪 G14');await expect(detail(page)).toContainText('Lith G14 Relic');expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relic_V1_Names.json'),JSON.stringify({addedNames:56,latinProperNamesRetained:17,chineseAndEnglishQueriesChecked:112,exactUpstreamIdsVisible:true,eraChinese:true,profilesSnapshotsImportsEqual:true},null,2));
  16 | });
  17 | test('all eleven entries separate base mode, extra table, scoped steps, exception and unverified trigger',async({page})=>{
  18 |  await open(page);const before=await records(page);for(const l of c.locations){const a=c.acquisitions.find(a=>a.locationId===l.id)!,g=l.guide!,rule=c.routeRules!.find(x=>x.id===g.ruleId)!;await choose(page,a.relicId);const view=detail(page).getByTestId('route-guide:'+l.id);await expect(view).toContainText(g.entry);await expect(view).toContainText('基础任务模式：'+g.baseMode);await expect(view).toContainText(g.extraCategory);await expect(view.locator('ol>li')).toHaveCount(rule.steps.length);await expect(view).toContainText(rule.scope);await expect(view).toContainText(rule.rotationNotes[a.rotation!]??'未核');
  19 |   if(l.node==='Tyana Pass'){await expect(view).toContainText('节点特例');await expect(view).toContainText('双水晶');await expect(view).toContainText('第4次完整双侧');}if(l.mode==='Caches'){await expect(view).toContainText('具体触发：待核');await expect(view).toContainText('不是第2轮或第2个箱子');}await expect(detail(page)).toContainText('当前可获取：未知');
  20 |  }expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relic_V1_Routes.json'),JSON.stringify({locations:11,scopedRules:6,rawEnglishKeysRetained:true,mirrorException:true,threeWaveDefense:true,gameTimerNotWallTime:true,disruptionPerformance:true,railjackBTriggerStillUnknown:true,readonly:true},null,2));
  21 | });
  22 | test('Chinese filtering, evidence folds, return and profile switching do not create personal history',async({page})=>{
  23 |  await open(page);await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const a=await page.getByLabel('切换档案').inputValue();await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const b=await page.getByLabel('切换档案').inputValue(),before=await records(page);await page.getByLabel('遗物名称或编号',{exact:true}).fill('古纪');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(3);await results(page).getByRole('button',{name:'查看遗物 Lith C7',exact:true}).click();await detail(page).getByTestId('name-evidence').first().getByRole('button').count();const evidence=detail(page).getByTestId('name-evidence').first();await evidence.locator('summary').click();await expect(evidence).toHaveAttribute('open','');for(const id of [a,b]){await page.getByLabel('切换档案').selectOption(id);await expect(detail(page)).toContainText('古纪 C7');}await detail(page).getByRole('button',{name:'返回查询结果',exact:true}).click();await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relic_V1_Readonly.json'),JSON.stringify({filtersEvidenceReturnsAndProfileSwitches:true,profilesSnapshotsImportsEqual:true,noNewInventoryTargetsOrHistory:true},null,2));
  24 | });
  25 | test('all six route rule descriptions and localized queries reopen offline after closing the controlled page',async({page,context})=>{
  26 |  await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#relics');for(const rule of c.routeRules!){const l=c.locations.find(l=>l.guide?.ruleId===rule.id)!,a=c.acquisitions.find(a=>a.locationId===l.id)!;await choose(offline,a.relicId);const view=detail(offline).getByTestId('route-guide:'+l.id);await expect(view).toContainText(rule.title);await expect(view.locator('ol>li')).toHaveCount(4);await expect(view).toContainText('2026-10-24');}await offline.getByRole('button',{name:'按奖励查遗物',exact:true}).click();await offline.getByLabel('奖励名称',{exact:true}).fill('西诺斯');await expect(results(offline).locator('button[data-reward-id]')).toHaveCount(3);expect(await records(offline)).toEqual(before);await offline.screenshot({path:evidencePath('Relic_V1_Offline.png'),fullPage:true});await writeFile(evidencePath('Relic_V1_Offline.json'),JSON.stringify({swControlled:true,closedAndReopened:true,rulesReadable:6,chineseSearch:true,externalSourcesNotOpened:true,readonly:true},null,2));
  27 | });
  28 | test('long Chinese and English names, evidence and mirror route steps wrap on desktop and mobile viewports',async({page})=>{
  29 |  await open(page);const a=c.acquisitions.find(a=>c.locations.find(l=>l.id===a.locationId)?.node==='Tyana Pass')!;await choose(page,a.relicId);await expect(detail(page)).toContainText('镜像防御');await page.screenshot({path:evidencePath('Relic_V1_Desktop.png'),fullPage:true});await detail(page).screenshot({path:evidencePath('Relic_V1_Detail_Desktop.png')});for(const [width,height]of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await detail(page).screenshot({path:evidencePath(`Relic_V1_Detail_${width}.png`)});}await writeFile(evidencePath('Relic_V1_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,androidPhysical:false,gameplayVerified:false},null,2));
  30 | });
  31 | 
```