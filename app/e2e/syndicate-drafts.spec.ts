import {test,expect,type Page} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {evidencePath,TEST_ORIGIN} from './environment';
import type {ProfileDocument} from '../src/domain/model';

async function records(page:Page){return page.evaluate(()=>new Promise<ProfileDocument[]>((resolve,reject)=>{
 const request=indexedDB.open('tenno-planner');request.onerror=()=>reject(request.error);request.onsuccess=()=>{
  const db=request.result,tx=db.transaction('profiles'),read=tx.objectStore('profiles').getAll();
  tx.oncomplete=()=>{db.close();resolve(read.result);};tx.onabort=()=>reject(tx.error);
 };
}));}
async function setTarget(page:Page,value:string){
 await page.getByLabel('目标集团等级',{exact:true}).selectOption(value);
 await page.getByRole('button',{name:'设置晋升目标',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('已保存');
}
async function create(page:Page,target?:string){
 await page.goto('/#syndicates');await page.getByRole('button',{name:'创建空白档案以记录集团进度'}).click();
 await page.getByLabel('集团当前等级',{exact:true}).fill('3');
 await page.getByLabel('集团当前声望',{exact:true}).fill('65000');
 await page.getByRole('button',{name:'保存集团事实',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('已保存');if(target)await setTarget(page,target);
}
async function draft(page:Page){
 await page.getByLabel('集团当前等级',{exact:true}).fill('4');
 await page.getByLabel('集团当前声望',{exact:true}).fill('12345');
 await page.getByLabel('等级变更后的声望处理').selectOption('confirmed');
}
async function expectDraft(page:Page){
 await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('4');
 await expect(page.getByLabel('集团当前声望',{exact:true})).toHaveValue('12345');
 await expect(page.getByLabel('等级变更后的声望处理')).toHaveValue('confirmed');
}
for(const initial of ['5',undefined])test(`target submission protects pending facts (${initial?'changed and same target':'first target'})`,async({page})=>{
 await create(page,initial);const before=await records(page);await draft(page);
 await page.getByLabel('目标集团等级',{exact:true}).selectOption('4');
 await page.getByRole('button',{name:'设置晋升目标',exact:true}).click();
 const observed={rank:await page.getByLabel('集团当前等级',{exact:true}).inputValue(),standing:await page.getByLabel('集团当前声望',{exact:true}).inputValue(),review:await page.getByLabel('等级变更后的声望处理').count()?await page.getByLabel('等级变更后的声望处理').inputValue():null,persisted:await records(page)};
 await writeFile(evidencePath(`Draft_${initial??'first'}_Observed.json`),JSON.stringify(observed,null,2));
 await page.screenshot({path:evidencePath(`Draft_${initial??'first'}_Blocked.png`),fullPage:true});
 await expectDraft(page);await expect(page.getByRole('alert')).toContainText('集团事实');expect(await records(page)).toEqual(before);
 await expect(page.locator('form.syndicate-target')).toHaveAttribute('data-dirty','true');
 // Even submitting the already-saved target must not rebuild pending facts.
 await page.getByLabel('目标集团等级',{exact:true}).selectOption(initial??'4');
 await page.getByRole('button',{name:'设置晋升目标',exact:true}).click();
 await expectDraft(page);expect(await records(page)).toEqual(before);
 await page.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');
 const saved=(await records(page))[0];expect(saved.personalFacts?.['syndicate:hex:rank'].value).toBe(4);expect(saved.personalFacts?.['syndicate:hex:standing'].value).toBe(12345);expect(saved.syndicateTargets?.['syndicate:hex']).toBe(initial?5:undefined);
 await setTarget(page,'4');await expect(page.getByTestId('rankup-step')).toHaveText('目标已达到');
 await expect(page.locator('form.syndicate-target')).not.toHaveAttribute('data-dirty','true');await expect(page.getByText('未保存目标预览，不加入当前共享需求。',{exact:true})).toHaveCount(0);
 await setTarget(page,'5');await expect(page.getByTestId('rankup-step')).toHaveText('4 → 5');await expect(page.getByTestId('rankup-standing-gap')).toHaveText('86655');
 await writeFile(evidencePath(`Draft_${initial??'first'}_Result.json`),JSON.stringify({blockedBeforeWrite:true,rankStandingReviewPreserved:true,sameTargetProtected:true,factsSavedOnlyExplicitly:true,targetPreviewClearedAfterSave:true,nextStepUsesSavedRank:true},null,2));
});

test('fact drafts survive remote target changes, reject stale revision and reset only on explicit reload or profile/group switch',async({page,context})=>{
 await create(page,'5');const id=await page.getByLabel('切换档案').inputValue();
 // Synthetic old unmatched group reference, only in this isolated test DB.
 await page.evaluate(id=>new Promise<void>((resolve,reject)=>{const r=indexedDB.open('tenno-planner');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('profiles','readwrite'),store=tx.objectStore('profiles'),get=store.get(id);get.onsuccess=()=>{const p=get.result;p.syndicateTargets['legacy:missing']=2;store.put(p);};tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};}),id);await page.reload();await draft(page);
 const second=await context.newPage();await second.goto(TEST_ORIGIN+'/#syndicates');await setTarget(second,'4');const changed=await records(second);
 await expect(page.getByRole('alert')).toContainText('其他页面');await expectDraft(page);
 await page.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(page.getByRole('status')).toContainText('保存失败');expect(await records(page)).toEqual(changed);await expectDraft(page);
 await page.getByRole('button',{name:'重新载入档案',exact:true}).click();await expect(page.getByRole('status')).toContainText('已重新载入');
 await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('3');await expect(page.getByLabel('集团当前声望',{exact:true})).toHaveValue('65000');await expect(page.getByLabel('目标集团等级',{exact:true})).toHaveValue('4');await expect(page.getByLabel('等级变更后的声望处理')).toHaveCount(0);
 await setTarget(second,'5');await expect(page.getByLabel('目标集团等级',{exact:true})).toHaveValue('5');await expect(page.locator('form.syndicate-target')).not.toHaveAttribute('data-dirty','true');
 await draft(page);await page.getByLabel('选择集团',{exact:true}).selectOption('legacy:missing');await expect(page.getByText('目录引用未匹配，目标、个人事实和库存仍保留；当前汇总不完整。',{exact:true})).toBeVisible();await page.getByLabel('选择集团',{exact:true}).selectOption('syndicate:hex');await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('3');
 await draft(page);await page.getByRole('button',{name:'＋ 新建空白档案'}).click();await expect(page.getByRole('status')).toContainText('已创建');const blankId=await page.getByLabel('切换档案').inputValue();expect(blankId).not.toBe(id);await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('');await expect(page.getByLabel('集团当前声望',{exact:true})).toHaveValue('');await expect(page.getByLabel('目标集团等级',{exact:true})).toHaveValue('');
 await page.getByLabel('切换档案').selectOption(id);await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('3');await expect(page.getByLabel('集团当前声望',{exact:true})).toHaveValue('65000');await draft(page);await page.getByLabel('切换档案').selectOption(blankId);await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('');await expect(page.getByLabel('等级变更后的声望处理')).toHaveCount(0);
 await writeFile(evidencePath('Draft_Conflict_Isolation.json'),JSON.stringify({remoteDraftPreserved:true,staleFactsRejected:true,explicitReloadShowsPersistedFacts:true,cleanRemoteTargetRefresh:true,unmatchedGroupAndProfileSwitchIsolated:true,newProfileHasNoDraft:true},null,2));
});

test('blocked target keeps fact form dirty for production update, cancellation permits explicit facts save',async({page})=>{
 test.setTimeout(60000);
 const rebuild=(id?:string)=>execFileSync(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'build'],{env:{...process.env,...(id?{APP_BUILD_ID:id}:{})},stdio:'pipe'});
 try{
  rebuild('hex-draft-v1');await create(page,'5');await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await draft(page);
  await page.getByLabel('目标集团等级',{exact:true}).selectOption('4');await page.getByRole('button',{name:'设置晋升目标',exact:true}).click();await expectDraft(page);
  rebuild('hex-draft-v2');await page.evaluate(async()=>{await(await navigator.serviceWorker.getRegistration())!.update();});await expect(page.getByRole('region',{name:'应用更新'})).toBeVisible();
  await page.getByRole('button',{name:'保存后更新',exact:true}).click();await expect(page.getByRole('region',{name:'应用更新'})).toContainText('未提交表单');await expect(page.locator('.build-label')).toContainText('hex-draft-v1');
  await page.getByRole('button',{name:'取消更新',exact:true}).click();await expect(page.locator('.workspace')).not.toHaveAttribute('inert');await expectDraft(page);
  await page.getByRole('button',{name:'保存集团事实',exact:true}).click();await expect(page.getByRole('status')).toContainText('已保存');await setTarget(page,'5');
  await page.getByRole('button',{name:'保存后更新',exact:true}).click();await expect(page.locator('.build-label')).toContainText('hex-draft-v2',{timeout:20000});await expect(page.getByLabel('集团当前等级',{exact:true})).toHaveValue('4');await expect(page.getByLabel('集团当前声望',{exact:true})).toHaveValue('12345');
  await writeFile(evidencePath('Draft_Update.json'),JSON.stringify({dirtyFactsBlockUpdate:true,cancelPreservesDraft:true,explicitFactsSave:true,updateRetainsRankStanding:true},null,2));
 }finally{rebuild();}
});
