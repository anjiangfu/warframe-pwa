# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prime-equipment.spec.ts >> all 35 exact parents and 115 original reward links are searchable in Chinese and English without a profile
- Location: e2e\prime-equipment.spec.ts:10:1

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: '按装备找部件', exact: true })

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
    - generic [ref=e52]: 构建 m0-9aaa40520411 · 离线应用壳已就绪
    - generic [ref=e53]:
      - generic [ref=e54]:
        - paragraph [ref=e55]: TENNO / 个人进度终端
        - heading "把下一步，变成自己的路线。" [level=1] [ref=e56]
        - paragraph [ref=e57]: 记录养成，保留选择。无需游戏账号或云端登录。
      - generic [ref=e58]:
        - text: ● 浏览器在线
        - generic [ref=e59]: 档案在本机
    - generic [ref=e60]:
      - status [ref=e61]: 本地档案就绪
      - generic [ref=e62]: 用户模板 · 事实待核实
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: 内置资料快照 / 双向只读查询
          - heading "虚空遗物" [level=2] [ref=e68]
        - generic [ref=e69]: 本轮已收录31个遗物
      - generic [ref=e70]:
        - paragraph [ref=e71]: 奖励反查仅本目录范围。无结果不代表游戏不存在；掉落表快照不等于当前可刷，也不代表账号已解锁。
        - paragraph [ref=e72]: 只查询奖励与摘录来源，不记录遗物库存、精炼、目标或查询历史。
        - generic [ref=e73]: 独立目录：relics.2026.10.25.1 · 中文组合名与原英文都可查；上游保留拉丁专名时仍注明待核。
      - paragraph [ref=e75]: 资料非实时；只覆盖本目录及已摘录来源。来源核验依据已保存记录，不是在线探测；此后更新未核。
      - region "遗物查询方式" [ref=e76]:
        - generic [ref=e77]:
          - button "按遗物查奖励" [pressed] [ref=e78] [cursor=pointer]
          - button "按奖励查遗物" [ref=e79] [cursor=pointer]
        - generic [ref=e80]:
          - text: 遗物名称或编号
          - textbox "遗物名称或编号" [ref=e81]:
            - /placeholder: 例如 古纪 G14、Lith G14 或 G14
        - generic [ref=e82]:
          - text: 纪元筛选
          - combobox "纪元筛选" [ref=e83]:
            - option "全部收录纪元" [selected]
            - option "古纪（Lith）"
            - option "前纪（Meso）"
            - option "中纪（Neo）"
            - option "后纪（Axi）"
        - generic [ref=e84]:
          - text: 来源核验筛选
          - combobox "来源核验筛选" [ref=e85]:
            - option "全部" [selected]
            - option "所查官方表列出"
            - option "本次表未列出"
            - option "待核或有冲突"
        - generic [ref=e86]: 筛选依据保存的核验记录；遗物至少一条摘录来源符合时入选。
        - button "清空查询" [ref=e87] [cursor=pointer]
      - generic [ref=e88]:
        - region "遗物查询结果" [ref=e89]:
          - heading "遗物查询结果" [level=3] [ref=e90]
          - paragraph [ref=e91]: 31项命中 · 仅本目录范围
          - generic [ref=e92]:
            - button "查看遗物 Lith C7" [ref=e93] [cursor=pointer]:
              - text: 古纪 C7 遗物（Lith C7 Relic）
              - generic [ref=e94]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith G14" [ref=e95] [cursor=pointer]:
              - text: 古纪 G14 遗物（Lith G14 Relic）
              - generic [ref=e96]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith S19" [ref=e97] [cursor=pointer]:
              - text: 古纪 S19 遗物（Lith S19 Relic）
              - generic [ref=e98]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso A12" [ref=e99] [cursor=pointer]:
              - text: 前纪 A12 遗物（Meso A12 Relic）
              - generic [ref=e100]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso V13" [ref=e101] [cursor=pointer]:
              - text: 前纪 V13 遗物（Meso V13 Relic）
              - generic [ref=e102]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso V17" [ref=e103] [cursor=pointer]:
              - text: 前纪 V17 遗物（Meso V17 Relic）
              - generic [ref=e104]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo C10" [ref=e105] [cursor=pointer]:
              - text: 中纪 C10 遗物（Neo C10 Relic）
              - generic [ref=e106]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo C7" [ref=e107] [cursor=pointer]:
              - text: 中纪 C7 遗物（Neo C7 Relic）
              - generic [ref=e108]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo K10" [ref=e109] [cursor=pointer]:
              - text: 中纪 K10 遗物（Neo K10 Relic）
              - generic [ref=e110]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi A21" [ref=e111] [cursor=pointer]:
              - text: 后纪 A21 遗物（Axi A21 Relic）
              - generic [ref=e112]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi P10" [ref=e113] [cursor=pointer]:
              - text: 后纪 P10 遗物（Axi P10 Relic）
              - generic [ref=e114]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi S8" [ref=e115] [cursor=pointer]:
              - text: 后纪 S8 遗物（Axi S8 Relic）
              - generic [ref=e116]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith A13" [ref=e117] [cursor=pointer]:
              - text: 古纪 A13 遗物（Lith A13 Relic）
              - generic [ref=e118]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith C15" [ref=e119] [cursor=pointer]:
              - text: 古纪 C15 遗物（Lith C15 Relic）
              - generic [ref=e120]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith L8" [ref=e121] [cursor=pointer]:
              - text: 古纪 L8 遗物（Lith L8 Relic）
              - generic [ref=e122]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith S18" [ref=e123] [cursor=pointer]:
              - text: 古纪 S18 遗物（Lith S18 Relic）
              - generic [ref=e124]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Lith V11" [ref=e125] [cursor=pointer]:
              - text: 古纪 V11 遗物（Lith V11 Relic）
              - generic [ref=e126]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso C11" [ref=e127] [cursor=pointer]:
              - text: 前纪 C11 遗物（Meso C11 Relic）
              - generic [ref=e128]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso D8" [ref=e129] [cursor=pointer]:
              - text: 前纪 D8 遗物（Meso D8 Relic）
              - generic [ref=e130]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso D9" [ref=e131] [cursor=pointer]:
              - text: 前纪 D9 遗物（Meso D9 Relic）
              - generic [ref=e132]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso K9" [ref=e133] [cursor=pointer]:
              - text: 前纪 K9 遗物（Meso K9 Relic）
              - generic [ref=e134]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Meso Y2" [ref=e135] [cursor=pointer]:
              - text: 前纪 Y2 遗物（Meso Y2 Relic）
              - generic [ref=e136]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo A16" [ref=e137] [cursor=pointer]:
              - text: 中纪 A16 遗物（Neo A16 Relic）
              - generic [ref=e138]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo C11" [ref=e139] [cursor=pointer]:
              - text: 中纪 C11 遗物（Neo C11 Relic）
              - generic [ref=e140]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo V13" [ref=e141] [cursor=pointer]:
              - text: 中纪 V13 遗物（Neo V13 Relic）
              - generic [ref=e142]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Neo Y2" [ref=e143] [cursor=pointer]:
              - text: 中纪 Y2 遗物（Neo Y2 Relic）
              - generic [ref=e144]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi A22" [ref=e145] [cursor=pointer]:
              - text: 后纪 A22 遗物（Axi A22 Relic）
              - generic [ref=e146]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi C12" [ref=e147] [cursor=pointer]:
              - text: 后纪 C12 遗物（Axi C12 Relic）
              - generic [ref=e148]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi D6" [ref=e149] [cursor=pointer]:
              - text: 后纪 D6 遗物（Axi D6 Relic）
              - generic [ref=e150]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi S21" [ref=e151] [cursor=pointer]:
              - text: 后纪 S21 遗物（Axi S21 Relic）
              - generic [ref=e152]: 当前可获取未知 · 中文组合显示已对照
            - button "查看遗物 Axi V14" [ref=e153] [cursor=pointer]:
              - text: 后纪 V14 遗物（Axi V14 Relic）
              - generic [ref=e154]: 当前可获取未知 · 中文组合显示已对照
        - generic [ref=e156]:
          - heading "先选一个遗物或奖励" [level=3] [ref=e157]
          - paragraph [ref=e158]: 左侧按名称／编号找遗物，或切换奖励反查。完整基础奖励与每条摘录来源都有日期；未知条件始终单列。
          - paragraph [ref=e159]: 尚未核到当前获取方法时请在游戏中确认，不按上游有记录就判断正在掉落。
    - generic [ref=e160]:
      - text: 天诺星图 · 材料与制作 v0
      - generic [ref=e161]: 中文优先 / 你的数据由你保管
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {readFileSync} from 'node:fs';
  3  | import {writeFile} from 'node:fs/promises';
  4  | import {TEST_ORIGIN,evidencePath} from './environment';
  5  | const audit=JSON.parse(readFileSync('../docs/evidence/Prime_Equipment_Nav_v0/Author_Audit.json','utf8')) as {groups:{parentUniqueName:string;parentEnglish:string;parentZh:string;namePending:boolean;rewardIds:string[]}[]};
  6  | const catalog=JSON.parse(readFileSync('src/catalog/relics.v1.json','utf8'));
> 7  | async function enter(page:Page){await page.goto('/#relics');await page.getByRole('button',{name:'按装备找部件',exact:true}).click();}
     |                                                                                                                       ^ Error: locator.click: Test timeout of 90000ms exceeded.
  8  | async function records(page:Page){return page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['profiles','snapshots','imports']);const result:Record<string,unknown>={};for(const key of ['profiles','snapshots','imports']){const q=tx.objectStore(key).getAll();q.onsuccess=()=>{result[key]=q.result;};}tx.oncomplete=()=>{db.close();resolve(result);};};}));}
  9  | const groupButton=(page:Page,id:string)=>page.locator('[data-equipment-id]').filter({has:page.locator('never-match')}).or(page.locator(`[data-equipment-id="${id}"]`));
  10 | test('all 35 exact parents and 115 original reward links are searchable in Chinese and English without a profile',async({page})=>{
  11 |  test.setTimeout(90000);await enter(page);const before=await records(page);let links=0;
  12 |  for(const g of audit.groups){
  13 |   await page.getByLabel('装备名称',{exact:true}).fill(g.parentEnglish);await expect(groupButton(page,g.parentUniqueName)).toBeVisible();await page.getByLabel('装备名称',{exact:true}).fill(g.parentZh);await groupButton(page,g.parentUniqueName).click();
  14 |   const detail=page.getByRole('region',{name:'装备关联奖励',exact:true});await expect(detail).toContainText('未筛总数 '+g.rewardIds.length+' 项 · 筛选后 '+g.rewardIds.length+' 项');await expect(detail).toContainText('不是完整制作配方／全套清单');expect(await detail.locator('[data-equipment-reward-id]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-equipment-reward-id')))).toEqual(g.rewardIds);
  15 |   for(const id of g.rewardIds){const r=catalog.rewards.find((r:{id:string})=>r.id===id);await expect(detail.locator(`[data-equipment-reward-id="${id}"]`)).toContainText(r.display.nameZh);}
  16 |   if(g.namePending)await expect(detail).toContainText('中文专名待核');links+=g.rewardIds.length;
  17 |  }
  18 |  expect(links).toBe(115);await page.getByLabel('装备名称',{exact:true}).fill('福马');await expect(page.locator('[data-equipment-id]')).toHaveCount(0);await page.getByLabel('装备名称',{exact:true}).fill('未收录装备');await expect(page.getByRole('region',{name:'遗物查询结果'})).toContainText('不能据此判断游戏中不存在');expect(await records(page)).toEqual(before);
  19 |  await writeFile(evidencePath('Prime_All_Groups.json'),JSON.stringify({groups:35,links,allChineseAndEnglishSearches:true,formaExcluded:true,noProfile:true,recordsUnchanged:true},null,2));
  20 | });
  21 | test('equipment → original reward reverse → relic → dated source → return preserves memory context and expansion',async({page})=>{
  22 |  await enter(page);await page.getByLabel('装备名称',{exact:true}).fill('伯斯顿');const g=audit.groups.find(g=>g.parentEnglish==='Burston Prime')!;await groupButton(page,g.parentUniqueName).click();const detail=page.getByRole('region',{name:'装备关联奖励',exact:true});await detail.getByText('父装备名称与关联出处',{exact:true}).click();await expect(detail.locator('details')).toHaveAttribute('open','');
  23 |  await detail.locator('[data-equipment-reward-id]').first().click();await expect(page.getByRole('region',{name:'奖励反查结果'})).toBeVisible();const relic=page.getByRole('region',{name:'奖励反查结果'}).locator('[data-relic-id]').first(),id=await relic.getAttribute('data-relic-id');await relic.click();const selected=catalog.relics.find((r:{id:string})=>r.id===id);await expect(page.getByTestId('relic-rewards').locator('li')).toHaveCount(6);await expect(page.getByRole('region',{name:'遗物详情'})).toContainText(selected.english);await expect(page.getByRole('region',{name:'遗物详情'})).toContainText('2026-10-25');await expect(page.getByRole('region',{name:'遗物详情'})).toContainText('所查官方表列出');
  24 |  await page.getByRole('button',{name:'返回装备关联奖励',exact:true}).click();await expect(page.getByLabel('装备名称',{exact:true})).toHaveValue('伯斯顿');await expect(detail.locator('details')).toHaveAttribute('open','');await expect(detail.locator('[data-equipment-reward-id]')).toHaveCount(4);await page.screenshot({path:evidencePath('Prime_Desktop.png'),fullPage:true});
  25 |  await page.getByLabel('来源核验筛选').selectOption('not-listed');await expect(page.locator('[data-equipment-id]')).toHaveCount(0);await expect(page.getByRole('region',{name:'遗物查询结果'})).toContainText('不代表没有获取方式');await page.getByLabel('来源核验筛选').selectOption('listed');await groupButton(page,g.parentUniqueName).click();await expect(detail).toContainText('未筛总数 4 项 · 筛选后 4 项');
  26 | });
  27 | test('query navigation and two-profile switching never write profiles snapshots imports',async({page})=>{
  28 |  await page.goto('/');await page.getByRole('button',{name:'从空白档案开始',exact:true}).click();await expect(page.getByRole('status')).toContainText('已创建');await page.getByRole('button',{name:/新建空白档案/}).click();await expect(page.getByLabel('切换档案').locator('option')).toHaveCount(2);const ids=await page.getByLabel('切换档案').locator('option').evaluateAll(xs=>xs.map(x=>(x as HTMLOptionElement).value));const before=await records(page);
  29 |  await enter(page);await groupButton(page,audit.groups[0].parentUniqueName).click();await page.getByRole('region',{name:'装备关联奖励',exact:true}).locator('[data-equipment-reward-id]').first().click();await page.getByRole('region',{name:'奖励反查结果'}).locator('[data-relic-id]').first().click();await page.getByRole('button',{name:'返回装备关联奖励',exact:true}).click();await page.getByLabel('切换档案').selectOption(ids[0]);await expect(page.getByRole('region',{name:'装备关联奖励',exact:true})).toBeVisible();await page.getByLabel('切换档案').selectOption(ids[1]);await page.getByLabel('来源核验筛选').selectOption('pending');await page.getByRole('button',{name:'清空查询',exact:true}).click();expect(await records(page)).toEqual(before);await writeFile(evidencePath('Prime_Readonly.json'),JSON.stringify({twoProfiles:true,queryFilterExpansionNavigationReturn:true,profilesSnapshotsImportsEqual:true},null,2));
  30 | });
  31 | test('offline controlled page close/reopen and 360/412/landscape keep bounded names and saved dates readable',async({page,context})=>{
  32 |  test.setTimeout(60000);await enter(page);await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.close();const reopened=await context.newPage();await reopened.goto(TEST_ORIGIN+'/#relics');await reopened.getByRole('button',{name:'按装备找部件',exact:true}).click();await expect(reopened.locator('[data-equipment-id]')).toHaveCount(35);const pending=audit.groups.find(g=>g.namePending)!;await groupButton(reopened,pending.parentUniqueName).click();await expect(reopened.getByRole('region',{name:'装备关联奖励',exact:true})).toContainText('中文专名待核');
  33 |  for(const [width,height] of [[360,800],[412,860],[860,412]]){await reopened.setViewportSize({width,height});expect(await reopened.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await reopened.screenshot({path:evidencePath(`Prime_Offline_${width}.png`),fullPage:true});}
  34 |  await reopened.getByRole('region',{name:'装备关联奖励',exact:true}).locator('[data-equipment-reward-id]').first().click();await reopened.getByRole('region',{name:'奖励反查结果'}).locator('[data-relic-id]').first().click();await expect(reopened.getByRole('region',{name:'遗物详情'})).toContainText('2026-10-25');await writeFile(evidencePath('Prime_Offline.json'),JSON.stringify({controlled:true,closedPage:true,reopenedOffline:true,groups:35,savedDateUnchanged:true,viewports:[360,412,860],physicalAndroid:false},null,2));
  35 | });
  36 | 
```