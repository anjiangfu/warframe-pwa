# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: material-reference.spec.ts >> saved single project recomputes with cross-page quantity, inventory-only saves and current target status
- Location: e2e\material-reference.spec.ts:11:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('material-deficit')
Expected: "2"
Received: "0"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByTestId('material-deficit') with timeout 5000ms
  - waiting for getByTestId('material-deficit')
    14 × locator resolved to <b data-testid="material-deficit">0</b>
       - unexpected value "0"

```

```yaml
- text: "0"
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {writeFile} from 'node:fs/promises';
  3  | import {TEST_ORIGIN,evidencePath} from './environment';
  4  | const material='神经元（Neurodes）';
  5  | const required=(page:Page)=>page.locator('.material-numbers>span:first-child b');
  6  | async function create(page:Page,join=true){await page.goto('/#crafting');await page.getByRole('button',{name:'创建空白档案以记录库存'}).click();if(join){await page.getByRole('button',{name:'加入制作目标',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');}}
  7  | async function openSingle(page:Page){await page.getByRole('region',{name:'单项目参考'}).getByRole('button',{name:'查询材料 '+material,exact:true}).click();}
  8  | async function stock(page:Page,n:number){await page.getByLabel('材料持有量').fill(String(n));await page.getByRole('button',{name:'保存材料持有量',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');}
  9  | async function records(page:Page){return page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['profiles','snapshots','imports']),requests=['profiles','snapshots','imports'].map(s=>tx.objectStore(s).getAll());tx.oncomplete=()=>{resolve(requests.map(r=>r.result));db.close();};tx.onerror=()=>reject(tx.error);};}));}
  10 | 
  11 | test('saved single project recomputes with cross-page quantity, inventory-only saves and current target status',async({page,context})=>{
  12 |  await create(page);await openSingle(page);await stock(page,0);await expect(page.getByTestId('material-deficit')).toHaveText('1');
  13 |  const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#crafting');await second.getByLabel('本次计划新制作数量').fill('3');await second.getByRole('button',{name:'保存制作数量',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await openSingle(second);await stock(second,1);
> 14 |  await expect(second.getByTestId('material-deficit')).toHaveText('2');await expect(page.getByLabel('材料持有量')).toHaveValue('1');await expect(page.getByTestId('material-deficit')).toHaveText('2');await expect(required(page)).toHaveText('3');
     |                                                                                                                                                                                  ^ Error: expect(locator).toHaveText(expected) failed
  15 |  await page.screenshot({path:evidencePath('Saved_Project_A.png'),fullPage:true});await second.screenshot({path:evidencePath('Saved_Project_B.png'),fullPage:true});
  16 |  await stock(second,2);await expect(page.getByLabel('材料持有量')).toHaveValue('2');await expect(required(page)).toHaveText('3');await expect(page.getByTestId('material-deficit')).toHaveText('1');
  17 |  await second.getByRole('button',{name:'制作缺口',exact:true}).click();for(const state of ['done','deferred','focused']){await second.getByLabel('制作目标状态').selectOption(state);await expect(second.getByRole('status')).toContainText('已保存');if(state==='focused'){await expect(required(page)).toHaveText('3');await expect(page.getByTestId('material-deficit')).toHaveText('1');}else{await expect(page.getByTestId('material-deficit')).toContainText('未知');await expect(page.getByText('目标已变化，请返回重新查询',{exact:false})).toBeVisible();}}
  18 |  await writeFile(evidencePath('Saved_Project.json'),JSON.stringify({sameProfileTwoPages:true,quantity3Stock1BothGaps2:true,inventoryOnlySaveKeepsRequirement:true,completeDeferUnknownAndResumeRecomputes:true},null,2));
  19 | });
  20 | 
  21 | test('shared reference follows current target membership, status and quantity instead of a numerical snapshot',async({page,context})=>{
  22 |  await create(page);await openSingle(page);await stock(page,0);await page.getByRole('button',{name:'返回制作缺口',exact:true}).click();await page.getByTestId('summary-material:neurodes').getByRole('button').click();await expect(page.getByTestId('material-deficit')).toHaveText('1');
  23 |  const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#crafting');await second.getByLabel('本次计划新制作数量').fill('3');await second.getByRole('button',{name:'保存制作数量',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await expect(page.getByTestId('material-deficit')).toHaveText('3');
  24 |  for(const state of ['done','focused','deferred','focused']){await second.getByLabel('制作目标状态').selectOption(state);await expect(second.getByRole('status')).toContainText('已保存');if(state==='focused'){await expect(page.getByTestId('material-deficit')).toHaveText('3');}else{await expect(page.getByTestId('material-deficit')).toContainText('未知');await expect(page.getByText('目标已变化，请返回重新查询',{exact:false})).toBeVisible();}}
  25 |  await expect(page.getByText('当前已保存目标的共享合计',{exact:true})).toBeVisible();await page.screenshot({path:evidencePath('Shared_Project.png'),fullPage:true});await writeFile(evidencePath('Shared_Project.json'),JSON.stringify({quantityRecomputed:true,targetRemovedUnknown:true,targetRestoredRecomputed:true,currentSharedSourceLabel:true},null,2));
  26 | });
  27 | 
  28 | test('unsaved preview stays explicit and read-only while assistant links follow the current saved plan',async({page,context})=>{
  29 |  await create(page,false);const before=await records(page);await page.getByLabel('本次计划新制作数量').fill('3');await openSingle(page);expect(await records(page)).toEqual(before);await expect(page.getByText('未保存数量预览：计划新产出3',{exact:true})).toBeVisible();await stock(page,0);await expect(page.getByTestId('material-deficit')).toHaveText('3');
  30 |  const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#crafting');await second.getByLabel('本次计划新制作数量').fill('5');await second.getByRole('button',{name:'加入制作目标',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await openSingle(second);await stock(second,1);await expect(page.getByLabel('材料持有量')).toHaveValue('1');await expect(required(page)).toHaveText('3');await expect(page.getByTestId('material-deficit')).toHaveText('2');await expect(page.getByText('未保存数量预览：计划新产出3',{exact:true})).toBeVisible();
  31 |  await page.getByRole('button',{name:'养成助手',exact:true}).click();await page.getByLabel('当前目标',{exact:true}).selectOption('crafting:recipe:forma');await page.getByRole('button',{name:/查看缺项 神经元/}).click();await expect(required(page)).toHaveText('5');await expect(page.getByText('养成助手：当前已保存的制作目标',{exact:true})).toBeVisible();
  32 |  await second.getByRole('button',{name:'制作缺口',exact:true}).click();await second.getByLabel('本次计划新制作数量').fill('2');await second.getByRole('button',{name:'保存制作数量',exact:true}).click();await expect(second.getByRole('status')).toContainText('已保存');await expect(required(page)).toHaveText('2');await expect(page.getByTestId('material-deficit')).toHaveText('1');
  33 |  const prior=await records(page);await page.getByRole('button',{name:'材料查询',exact:true}).click();await page.getByLabel('搜索材料').fill('Neurodes');await page.getByRole('button',{name:'材料 '+material,exact:true}).click();await expect(required(page)).toHaveText('未指定目标');expect(await records(page)).toEqual(prior);await writeFile(evidencePath('Preview_Assistant.json'),JSON.stringify({previewQueryNoWrite:true,previewQuantityRemainsIndependent:true,previewUsesCurrentStock:true,assistantReferenceRecomputed:true,plainBrowseHasNoReference:true},null,2));
  34 | });
  35 | 
```