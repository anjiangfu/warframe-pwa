import {test,expect,type Page} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import type {ResourceCatalog} from '../src/domain/resources';
import {evidencePath,TEST_ORIGIN} from './environment';
const weapon=JSON.parse(readFileSync('src/catalog/weapon-guides.v1.json','utf8')),extra=JSON.parse(readFileSync('src/catalog/resources.v1.json','utf8'));
const catalog:ResourceCatalog={catalogVersion:extra.catalogVersion,resources:[...weapon.materials,...extra.resources],acquisitions:[...weapon.acquisitions,...extra.acquisitions],sources:[...weapon.sources,...extra.sources]};
async function records(page:Page){return page.evaluate(()=>new Promise<unknown>((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,names=['profiles','snapshots','imports'],tx=db.transaction(names),reads=names.map(n=>tx.objectStore(n).getAll());tx.oncomplete=()=>{db.close();resolve(reads.map(r=>r.result));};tx.onabort=()=>reject(tx.error);};}));}
async function select(page:Page,id:string){const r=catalog.resources.find(r=>r.id===id)!;await page.getByLabel('搜索材料',{exact:true}).fill(r.name);await page.getByRole('button',{name:`材料 ${r.name}（${r.english}）`,exact:true}).click();}
const locations=(page:Page)=>page.locator('.material-detail .guide-locations');
test('all 23 resources show scoped routes, verification, dates and evidence without profile writes',async({page})=>{
 await page.goto('/#materials');await expect(page.getByRole('status')).toContainText('就绪');const before=await records(page);
 for(const resource of catalog.resources){
  await select(page,resource.id);const articles=locations(page).locator('article');await expect(articles).toHaveCount(resource.acquisitionIds.length);
  for(const [i,id] of resource.acquisitionIds.entries()){
   const route=catalog.acquisitions.find(a=>a.id===id)!,article=articles.nth(i);
   await expect(article).toContainText(i===0?'主要方式':'备选方式');await expect(article).toContainText(route.verification==='verified'?'路线已对照资料':'路线待核');
   await expect(article).toContainText(route.place);await expect(article).toContainText(route.mode);await expect(article).toContainText('核对日期：'+route.checkedAt);
   for(const source of route.sourceIds){await expect(article.locator(`a[href="${catalog.sources.find(s=>s.id===source)!.url}"]`)).toHaveCount(1);}
  }
 }
 expect(await records(page)).toEqual(before);await writeFile(evidencePath('Guides_23_Audit.json'),JSON.stringify({resourceIds:catalog.resources.map(r=>r.id),allRoutesDisplayed:true,queryNoWrites:true,identities:23},null,2));
});
test('search, crafting, syndicate and assistant use identical material routes and do not change saved business data',async({page})=>{
 await page.goto('/#syndicates');await page.getByRole('button',{name:'创建空白档案以记录集团进度'}).click();await page.getByLabel('集团当前等级',{exact:true}).fill('3');await page.getByLabel('集团当前声望',{exact:true}).fill('70000');await page.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');await page.getByLabel('目标集团等级',{exact:true}).selectOption('5');await page.getByRole('button',{name:'设置晋升目标',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');
 await page.getByRole('button',{name:'制作缺口',exact:true}).click();await page.getByRole('button',{name:'加入制作目标',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');const before=await records(page);
 await page.getByRole('button',{name:'材料查询',exact:true}).click();await select(page,'credits');const creditText=await locations(page).innerText();
 await page.getByRole('button',{name:'制作缺口',exact:true}).click();await page.getByRole('region',{name:'单项目参考'}).getByRole('button',{name:'查询材料 星币（Credits）',exact:true}).click();expect(await locations(page).innerText()).toBe(creditText);
 await page.getByRole('button',{name:'集团晋升',exact:true}).click();await page.getByRole('region',{name:'当前晋升祭品'}).getByRole('button',{name:'查询祭品 星币（Credits）',exact:true}).click();expect(await locations(page).innerText()).toBe(creditText);
 await page.getByRole('button',{name:'材料查询',exact:true}).click();await select(page,'material:yao-shrub');const yaoText=await locations(page).innerText();
 await page.getByRole('button',{name:'养成助手',exact:true}).click();await page.getByLabel('当前目标',{exact:true}).selectOption('goal:dual-toxocyst');await page.getByLabel('搜索武器或材料').fill('Yao Shrub');await page.getByRole('button',{name:'瑶丛（Yao Shrub）',exact:true}).click();expect(await locations(page).innerText()).toBe(yaoText);
 expect(await records(page)).toEqual(before);await writeFile(evidencePath('Guides_Entry_Consistency.json'),JSON.stringify({fourEntryRoutesMatch:true,allBusinessUnchanged:true},null,2));
});
test('material routes and explicit unverified alternatives reopen after offline page close',async({page,context})=>{
 await page.goto('/#materials');await select(page,'material:eevani');await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);const before=await records(page);await context.setOffline(true);await page.close();
 const offline=await context.newPage();await offline.goto(TEST_ORIGIN+'/#materials');await select(offline,'material:eevani');await expect(locations(offline)).toContainText('Archarbor');await expect(locations(offline)).toContainText('Amphitheater');await expect(locations(offline)).toContainText('备选方式');await expect(locations(offline).getByText('路线待核',{exact:true})).toHaveCount(2);expect(await records(offline)).toEqual(before);
 await offline.screenshot({path:evidencePath('Guides_Offline.png'),fullPage:true});await writeFile(evidencePath('Guides_Offline.json'),JSON.stringify({controlledBeforeOffline:true,pageClosedAndReopened:true,twoUnverifiedRoutes:true,noQueryWrites:true},null,2));
});
test('detailed routes remain readable on desktop and 360/412 viewports without horizontal overflow',async({page})=>{
 await page.goto('/#materials');await select(page,'material:eevani');await page.screenshot({path:evidencePath('Guides_Desktop.png'),fullPage:true});
 for(const width of [360,412]){await page.setViewportSize({width,height:860});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(locations(page)).toContainText('路线待核');await page.screenshot({path:evidencePath(`Guides_Mobile_${width}.png`),fullPage:true});await page.screenshot({path:evidencePath(`Guides_Mobile_${width}_Top.png`)});}
 await page.setViewportSize({width:860,height:412});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
