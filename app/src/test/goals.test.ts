import 'fake-indexeddb/auto';
import {afterEach,expect,it} from 'vitest';
import Dexie from 'dexie';
import {LocalProvider} from '../catalog/provider';
import {newProfile,exportBackup,parseImport,validateProfile} from '../storage/imports';
import {openDatabase,Repository} from '../storage/db';
import {editWeaponProgress} from '../domain/weapon';
import {evaluateGoal,pendingGoals,previewProgress,applyProgress,type GoalDefinition} from '../domain/goals';
const provider=new LocalProvider(),tree=provider.getCatalog(),weapons=provider.getWeaponCatalog();
const blank=()=>newProfile(tree,'one','甲',false),dbs:string[]=[];
const weaponGoal:GoalDefinition={id:'goal:fixture',title:'任意标题',summary:'',kind:'weapon',weaponId:'weapon:dual-toxocyst',treeNodeIds:[]};
afterEach(async()=>{for(const n of dbs.splice(0))await Dexie.delete(n);});
it('goals distinguish unknown, missing item, explicit zero, missing material and installed operation without guessing',()=>{
 const p=blank();expect(evaluateGoal(weaponGoal,p,weapons).kind).toBe('unknown');
 editWeaponProgress(p,weaponGoal.weaponId!,s=>{s.installed=false;s.owned=false;});expect(evaluateGoal(weaponGoal,p,weapons).kind).toBe('missing-item');
 editWeaponProgress(p,weaponGoal.weaponId!,s=>{s.owned=true;s.adapterOwned=true;});expect(evaluateGoal(weaponGoal,p,weapons).kind).toBe('unknown');
 for(const c of weapons.weapons[0].installCost)p.stock[c.materialId]=0;
 const result=evaluateGoal(weaponGoal,p,weapons);expect(result.kind).toBe('missing-material');expect(result.materials.map(m=>m.deficit)).toEqual([20,70,80]);
 editWeaponProgress(p,weaponGoal.weaponId!,s=>{s.currentStageId='dual-toxocyst:iv';});expect(evaluateGoal(weaponGoal,p,weapons).kind).toBe('operation');expect(evaluateGoal(weaponGoal,p,weapons).materials).toEqual([]);
 editWeaponProgress(p,weaponGoal.weaponId!,s=>{s.installed=true;s.currentStageId=null;});expect(evaluateGoal(weaponGoal,p,weapons).action).not.toContain('采集');
});
it('completion and defer filter generically; restoring and catalog renames preserve detail and do not mutate old profiles',()=>{
 const p=blank(),before=structuredClone(p);evaluateGoal(weaponGoal,p,weapons);expect(p).toEqual(before);
 const second={...weaponGoal,id:'goal:second',title:'改名不改ID'};p.goalStates={[weaponGoal.id]:'done',[second.id]:'deferred'};expect(pendingGoals([weaponGoal,second],p,weapons)).toEqual([]);
 p.goalStates[second.id]='focused';expect(pendingGoals([second,weaponGoal],p,weapons).map(g=>g.id)).toEqual([second.id]);expect(p.weaponProgress).toBeUndefined();
 const system:GoalDefinition={id:'goal:system',title:'已改名',summary:'',kind:'installation',factId:'system:fixture',treeNodeIds:[]};p.personalFacts={'system:fixture':{value:true,recordedAt:'原时间'}};expect(evaluateGoal(system,p,weapons).kind).toBe('completed');expect(p.statuses.helminth).toBe('todo');
 const snapshot=structuredClone(p),changed=structuredClone(weapons);changed.catalogVersion='future';changed.weapons.reverse();changed.weapons.forEach(w=>{w.name='目录改名';w.stages.reverse();});const replacement=new LocalProvider(undefined,changed,{catalogVersion:'future',goals:[second,weaponGoal]}).getWeaponCatalog();expect(evaluateGoal(weaponGoal,p,replacement).kind).toBe('completed');expect(p).toEqual(snapshot);
});
it('Nami guide has four sourced tasks, six activations and forty held-melee finishers, no fake material challenge',()=>{
 const w=weapons.weapons.find(w=>w.id==='weapon:nami-solo')!;expect(w).toBeDefined();expect(w.stages.map(s=>[s.challenge.kind,s.challenge.target])).toEqual([['installation',null],['solo-mission',1],['incarnon-activations',6],['held-melee-finishers',40]]);
 const iv=w.stages[3];expect(iv.checks.join('')).toContain('完整持握');expect(iv.tips.join('')).toContain('1—2次');expect(iv.troubleshooting.join('')).toContain('unverified');expect(iv.tips.length).toBeGreaterThanOrEqual(3);expect(iv.locationIds.length).toBeGreaterThan(0);
 const p=blank();editWeaponProgress(p,w.id,s=>{s.currentStageId=iv.id;});const goal=provider.getGoalCatalog().goals.find(g=>g.weaponId===w.id)!;expect(evaluateGoal(goal,p,weapons).materials).toEqual([]);expect(p.weaponProgress![w.id].stages).toEqual({});
});
it('draft preview is pure, conflicts explicit, application only selected facts; completed weapon is not all stages done',()=>{
 const p=blank();p.personalFacts={'system:helminth:installed':{value:false,recordedAt:'old'}};const before=structuredClone(p);const preview=previewProgress(p,null);expect(p).toEqual(before);expect(preview.rows.find(r=>r.id==='fact:system:helminth:installed')?.conflict).toBe(true);
 const next=applyProgress(p,preview,preview.rows.filter(r=>!r.conflict).map(r=>r.id),'2026-10-18');expect(next.personalFacts!['system:helminth:installed'].value).toBe(false);expect(next.personalFacts!['declaration:shard-module:installed'].originalLabel).toBe('原力石模块');expect(next.personalFacts!['declaration:shard-module:installed'].entityId).toBeNull();expect(next.goalStates!['goal:dual-toxocyst']).toBe('done');expect(next.weaponProgress?.['weapon:dual-toxocyst']).toBeUndefined();expect(next.weaponProgress!['weapon:nami-solo'].currentStageId).toBe('nami-solo:iv');expect(next.weaponProgress!['weapon:nami-solo'].stages).toEqual({});expect(next.personalFacts!['syndicate:hex:rank'].value).toBe(3);expect(next.personalFacts?.['syndicate:hex:standing']).toBeUndefined();expect(next.masteryRank).toBeNull();expect(p).toEqual(before);
 expect(()=>applyProgress({...p,revision:1},preview,[],'' )).toThrow('重新预览');
});
it('draft commit snapshots atomically, rejects stale preview, deduplicates confirmations and allows another profile',async()=>{
 const n='goal-'+crypto.randomUUID();dbs.push(n);const db=await openDatabase(n),repo=new Repository(db);try{
 const p=blank();p.steps=Object.fromEntries(tree.nodes.map(n=>[n.goalId,Object.fromEntries(n.steps.map((s,i)=>[s.id,i%2===0]))]));p.notes=Object.fromEntries(tree.nodes.map(n=>[n.goalId,'中文笔记 <script>普通文本</script>']));p.stock={credits:0,endo:18,forma:2,platinum:0,'material:pathos-clamp':12,'material:yao-shrub':0,'material:eevani':null};p.budget.origin={credits:0,forma:1};p.events=[{time:'原时间1',text:'日志一'},{time:'原时间2',text:'日志二'}];p.legacyArchive.extra={unknown:['保留',0]};const original=new TextEncoder().encode('original bytes');p.originals=[{name:'原件.json',base64:btoa('original bytes'),hash:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',original))).map(x=>x.toString(16).padStart(2,'0')).join('')}];editWeaponProgress(p,'weapon:dual-toxocyst',s=>{s.owned=true;s.stages['dual-toxocyst:ii']='done';});await repo.create(p);const preview=previewProgress(p,'system:helminth-archon-shard-segment'),selected=preview.rows.map(r=>r.id);expect(await db.snapshots.count()).toBe(0);
 const saved=await repo.applyProgressDraft(preview,selected);expect(saved.revision).toBe(1);expect(await db.snapshots.count()).toBe(1);expect(await repo.applyProgressDraft(preview,selected)).toEqual(saved);expect(saved.events).toHaveLength(p.events.length+1);expect(saved.events.slice(1)).toEqual(p.events);expect(saved.weaponProgress!['weapon:dual-toxocyst']).toEqual(p.weaponProgress!['weapon:dual-toxocyst']);expect(await repo.get('one')).toEqual(saved);
 const round=await parseImport(new TextEncoder().encode(exportBackup(saved,tree.catalogVersion)),'目标.json',provider);const restored=await repo.restore(round,'restore',null);expect({...restored,id:saved.id,revision:saved.revision}).toEqual(saved);
 await repo.save({...saved,name:'其他页'},1);await expect(repo.applyProgressDraft(preview,selected)).rejects.toThrow('重新预览');
 const other={...p,id:'two'};await repo.create(other);await repo.applyProgressDraft(previewProgress(other,null),selected);expect((await repo.get('two'))!.personalFacts!['declaration:shard-module:installed'].entityId).toBeNull();
 }finally{db.close();}
});
it('snapshot, quota and update failures roll back draft and old optional fields remain absent after backup',async()=>{
 const p=blank(),n='goal-'+crypto.randomUUID();dbs.push(n);const db=await openDatabase(n),repo=new Repository(db);try{await repo.create(p);const preview=previewProgress(p,null),selected=preview.rows.map(r=>r.id);const hook=()=>{throw new DOMException('quota','QuotaExceededError');};
 db.snapshots.hook('creating',hook);await expect(repo.applyProgressDraft(preview,selected)).rejects.toThrow();db.snapshots.hook('creating').unsubscribe(hook);expect(await repo.get('one')).toEqual(p);expect(await db.snapshots.count()).toBe(0);
 db.profiles.hook('updating',hook);await expect(repo.applyProgressDraft(preview,selected)).rejects.toThrow();db.profiles.hook('updating').unsubscribe(hook);expect(await db.snapshots.count()).toBe(0);expect(await db.imports.count()).toBe(0);expect(await repo.get('one')).toEqual(p);
 await db.meta.put({key:'writeBarrier',value:{target:'later'}});await expect(repo.applyProgressDraft(preview,selected)).rejects.toThrow('更新');expect(await repo.get('one')).toEqual(p);
 const old=await parseImport(new TextEncoder().encode(exportBackup(p,tree.catalogVersion)),'旧.json',provider);expect(old.profile).toEqual(p);expect(old.profile.goalStates).toBeUndefined();expect(old.profile.personalFacts).toBeUndefined();
 }finally{db.close();}
});
it('new field validation rejects invalid facts and goal status before saving; orphan IDs stay restorable',async()=>{
 const p=blank();p.goalStates={'unknown:old-goal':'deferred'};p.personalFacts={'unknown:old-fact':{value:0,recordedAt:'原时间'}};validateProfile(p);const result=await parseImport(new TextEncoder().encode(exportBackup(p,'old-catalog')),'旧引用.json',provider);expect(result.profile).toEqual(p);
 const bad=structuredClone(p);(bad.goalStates as Record<string,string>)['bad']='deleted';expect(()=>validateProfile(bad)).toThrow();const badFact=structuredClone(p);(badFact.personalFacts!['unknown:old-fact'] as unknown as {value:string}).value='3';expect(()=>validateProfile(badFact)).toThrow();
 const wrong=blank();wrong.personalFacts={'syndicate:hex:rank':{value:true,recordedAt:'now'}};expect(()=>validateProfile(wrong)).toThrow('1999');wrong.personalFacts={'system:helminth:installed':{value:1,recordedAt:'now'}};expect(()=>validateProfile(wrong)).toThrow('布尔');
});
