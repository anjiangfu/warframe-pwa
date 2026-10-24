# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: relic-localization.spec.ts >> all six route rule descriptions and localized queries reopen offline after closing the controlled page
- Location: e2e\relic-localization.spec.ts:25:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByRole('region', { name: '遗物查询结果', exact: true }).locator('button[data-reward-id]')
Expected: 3
Received: 2
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByRole('region', { name: '遗物查询结果', exact: true }).locator('button[data-reward-id]') with timeout 5000ms
  - waiting for getByRole('region', { name: '遗物查询结果', exact: true }).locator('button[data-reward-id]')
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ✦
      - generic [ref=e7]:
        - text: 天诺星图
        - generic [ref=e8]: 本地行动档案
    - generic [ref=e9]:
      - text: 当前档案
      - combobox "切换档案" [ref=e10]:
        - option "尚未创建" [disabled] [selected]
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: MR
          - strong [ref=e14]: "?"
        - generic [ref=e15]:
          - text: 目标 未知
          - generic [ref=e16]: 未知 分钟 / 日
      - paragraph [ref=e18]: 0 项目标已完成
    - navigation [ref=e19]:
      - button "养成助手" [ref=e20] [cursor=pointer]:
        - generic [ref=e21]: ✧
        - text: 养成助手
        - generic [ref=e22]: ↗
      - button "互动科技树" [ref=e23] [cursor=pointer]:
        - generic [ref=e24]: ◇
        - text: 互动科技树
        - generic [ref=e25]: ↗
      - button "材料查询" [ref=e26] [cursor=pointer]:
        - generic [ref=e27]: ⌕
        - text: 材料查询
        - generic [ref=e28]: ↗
      - button "制作缺口" [ref=e29] [cursor=pointer]:
        - generic [ref=e30]: ▱
        - text: 制作缺口
        - generic [ref=e31]: ↗
      - button "集团晋升" [ref=e32] [cursor=pointer]:
        - generic [ref=e33]: ⊙
        - text: 集团晋升
        - generic [ref=e34]: ↗
      - button "虚空遗物" [ref=e35] [cursor=pointer]:
        - generic [ref=e36]: ◈
        - text: 虚空遗物
        - generic [ref=e37]: ↗
      - button "档案与物资" [ref=e38] [cursor=pointer]:
        - generic [ref=e39]: ▤
        - text: 档案与物资
        - generic [ref=e40]: ↗
      - button "备份与恢复" [ref=e41] [cursor=pointer]:
        - generic [ref=e42]: ⇅
        - text: 备份与恢复
        - generic [ref=e43]: ↗
      - button "行动日志" [ref=e44] [cursor=pointer]:
        - generic [ref=e45]: ≡
        - text: 行动日志
        - generic [ref=e46]: ↗
    - generic [ref=e47]:
      - text: 个人资料仅存此设备
      - paragraph [ref=e49]: 动态资料：尚未同步
      - button "＋ 新建空白档案" [ref=e50] [cursor=pointer]
  - main [ref=e51]:
    - generic [ref=e52]: 构建 m0-f4aff29cb212 · 离线应用壳已就绪
    - generic [ref=e53]:
      - generic [ref=e54]:
        - paragraph [ref=e55]: TENNO / 个人进度终端
        - heading "把下一步，变成自己的路线。" [level=1] [ref=e56]
        - paragraph [ref=e57]: 记录养成，保留选择。无需游戏账号或云端登录。
      - generic [ref=e58]:
        - text: ○ 当前离线
        - generic [ref=e59]: 档案在本机
    - generic [ref=e60]:
      - status [ref=e61]: 本地档案就绪
      - generic [ref=e62]: 用户模板 · 事实待核实
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: 内置资料快照 / 双向只读查询
          - heading "虚空遗物" [level=2] [ref=e68]
        - generic [ref=e69]: 本轮已收录12个遗物
      - generic [ref=e70]:
        - paragraph [ref=e71]: 奖励反查仅本目录范围。无结果不代表游戏不存在；掉落表快照不等于当前可刷，也不代表账号已解锁。
        - paragraph [ref=e72]: 只查询奖励与摘录来源，不记录遗物库存、精炼、目标或查询历史。
        - generic [ref=e73]: 独立目录：relics.2026.10.24.1 · 中文组合名与原英文都可查；上游保留拉丁专名时仍注明待核。
      - region "遗物查询方式" [ref=e74]:
        - generic [ref=e75]:
          - button "按遗物查奖励" [ref=e76] [cursor=pointer]
          - button "按奖励查遗物" [pressed] [ref=e77] [cursor=pointer]
        - generic [ref=e78]:
          - text: 奖励名称
          - textbox "奖励名称" [active] [ref=e79]:
            - /placeholder: 例如 福马蓝图 或原名
            - text: 西诺斯
        - button "清空查询" [ref=e80] [cursor=pointer]
      - generic [ref=e81]:
        - region "遗物查询结果" [ref=e82]:
          - heading "奖励查询结果" [level=3] [ref=e83]
          - paragraph [ref=e84]: 2项命中 · 仅本目录范围
          - generic [ref=e85]:
            - button "反查奖励 西诺斯 Prime 下弓臂" [ref=e86] [cursor=pointer]:
              - text: 西诺斯 Prime 下弓臂（Cernos Prime Lower Limb）
              - generic [ref=e87]: 部件 · 中文组合显示已对照
            - button "反查奖励 西诺斯 Prime 弓身" [ref=e88] [cursor=pointer]:
              - text: 西诺斯 Prime 弓身（Cernos Prime Grip）
              - generic [ref=e89]: 部件 · 中文组合显示已对照
        - generic [ref=e91]:
          - heading "先选一个遗物或奖励" [level=3] [ref=e92]
          - paragraph [ref=e93]: 左侧按名称／编号找遗物，或切换奖励反查。完整基础奖励与每条摘录来源都有日期；未知条件始终单列。
          - paragraph [ref=e94]: 尚未核到当前获取方法时请在游戏中确认，不按上游有记录就判断正在掉落。
    - generic [ref=e95]:
      - text: 天诺星图 · 材料与制作 v0
      - generic [ref=e96]: 中文优先 / 你的数据由你保管
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
  12 |   for(const q of [r.display!.nameZh.replace(/\s+/g,''),r.english]){await page.getByLabel('奖励名称',{exact:true}).fill(q);await results(page).locator(`button[data-reward-id="${r.id}"]`).click();await expect(reverse(page)).toContainText(r.display!.nameZh);await expect(reverse(page)).toContainText(r.english);}
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
  23 |  await open(page);await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const a=await page.getByLabel('切换档案').inputValue();await page.getByRole('button',{name:'＋ 新建空白档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');const b=await page.getByLabel('切换档案').inputValue(),before=await records(page);await page.getByLabel('遗物名称或编号',{exact:true}).fill('古纪');await expect(results(page).locator('button[data-relic-id]')).toHaveCount(3);await results(page).getByRole('button',{name:'查看遗物 Lith C7',exact:true}).click();const evidence=detail(page).getByTestId('name-evidence').first();await evidence.locator('summary').click();await expect(evidence).toHaveAttribute('open','');for(const id of [a,b]){await page.getByLabel('切换档案').selectOption(id);await expect(detail(page)).toContainText('古纪 C7');}await detail(page).getByRole('button',{name:'返回查询结果',exact:true}).click();await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Relic_V1_Readonly.json'),JSON.stringify({filtersEvidenceReturnsAndProfileSwitches:true,profilesSnapshotsImportsEqual:true,noNewInventoryTargetsOrHistory:true},null,2));
  24 | });
  25 | test('all six route rule descriptions and localized queries reopen offline after closing the controlled page',async({page,context})=>{
> 26 |  await open(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#relics');for(const rule of c.routeRules!){const l=c.locations.find(l=>l.guide?.ruleId===rule.id)!,a=c.acquisitions.find(a=>a.locationId===l.id)!;await choose(offline,a.relicId);const view=detail(offline).getByTestId('route-guide:'+l.id);await expect(view).toContainText(rule.title);await expect(view.locator('ol>li')).toHaveCount(4);await expect(view).toContainText('2026-10-24');}await offline.getByRole('button',{name:'按奖励查遗物',exact:true}).click();await offline.getByLabel('奖励名称',{exact:true}).fill('西诺斯');await expect(results(offline).locator('button[data-reward-id]')).toHaveCount(3);expect(await records(offline)).toEqual(before);await offline.screenshot({path:evidencePath('Relic_V1_Offline.png'),fullPage:true});await writeFile(evidencePath('Relic_V1_Offline.json'),JSON.stringify({swControlled:true,closedAndReopened:true,rulesReadable:6,chineseSearch:true,externalSourcesNotOpened:true,readonly:true},null,2));
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ^ Error: expect(locator).toHaveCount(expected) failed
  27 | });
  28 | test('long Chinese and English names, evidence and mirror route steps wrap on desktop and mobile viewports',async({page})=>{
  29 |  await open(page);const a=c.acquisitions.find(a=>c.locations.find(l=>l.id===a.locationId)?.node==='Tyana Pass')!;await choose(page,a.relicId);await expect(detail(page)).toContainText('镜像防御');await page.screenshot({path:evidencePath('Relic_V1_Desktop.png'),fullPage:true});await detail(page).screenshot({path:evidencePath('Relic_V1_Detail_Desktop.png')});for(const [width,height]of [[360,860],[412,860],[860,412]]){await page.setViewportSize({width,height});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await detail(page).screenshot({path:evidencePath(`Relic_V1_Detail_${width}.png`)});}await writeFile(evidencePath('Relic_V1_Layout.json'),JSON.stringify({viewports:[[1440,960],[360,860],[412,860],[860,412]],horizontalOverflow:false,androidPhysical:false,gameplayVerified:false},null,2));
  30 | });
  31 | 
```