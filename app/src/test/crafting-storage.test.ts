import 'fake-indexeddb/auto';
import {afterEach,expect,it} from 'vitest';
import Dexie from 'dexie';
import {LocalProvider} from '../catalog/provider';
import {newProfile,validateProfile,parseImport,exportBackup} from '../storage/imports';
import {openDatabase,Repository} from '../storage/db';
import {craftGoalId,setCraftingTarget,craftingGoals,currentPlans} from '../domain/crafting';
const provider=new LocalProvider(),tree=provider.getCatalog(),catalog=provider.getCraftingCatalog(),names:string[]=[];
afterEach(async()=>{for(const name of names.splice(0))await Dexie.delete(name);});
it('only explicit joining adds crafting state and later quantity edits preserve existing complete/deferred status and inventory',()=>{
 const p=newProfile(tree,'p','档案',false),before=structuredClone(p);craftingGoals(catalog,p);currentPlans(catalog,p,provider.getWeaponCatalog(),provider.getGoalCatalog());expect(p).toEqual(before);expect(p.craftingTargets).toBeUndefined();
 setCraftingTarget(p,'recipe:forma',3);expect(p.craftingTargets).toEqual({'recipe:forma':3});expect(p.goalStates?.[craftGoalId('recipe:forma')]).toBe('focused');p.goalStates![craftGoalId('recipe:forma')]='done';setCraftingTarget(p,'recipe:forma',5);expect(p.goalStates![craftGoalId('recipe:forma')]).toBe('done');expect(p.stock).toEqual(before.stock);
 for(const q of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])expect(()=>setCraftingTarget(p,'recipe:forma',q)).toThrow();
});
it('invalid optional targets reject before save/restore while absent and orphan targets roundtrip without rewriting old profiles',async()=>{
 const p=newProfile(tree,'p','旧档',true);const old=await parseImport(new TextEncoder().encode(exportBackup(p,tree.catalogVersion)),'M0.json',provider);expect(old.profile).toEqual(p);expect(old.profile.craftingTargets).toBeUndefined();
 const bad={...p,craftingTargets:{'recipe:forma':1.5}};expect(()=>validateProfile(bad)).toThrow();await expect(parseImport(new TextEncoder().encode(JSON.stringify({schemaVersion:1,catalogVersion:tree.catalogVersion,profile:bad})),'坏档.json',provider)).rejects.toThrow();
 p.craftingTargets={'old:unmatched':7};p.goalStates={[craftGoalId('old:unmatched')]:'deferred'};const restored=await parseImport(new TextEncoder().encode(exportBackup(p,tree.catalogVersion)),'旧引用.json',provider);expect(restored.profile).toEqual(p);
});
it('full legacy 29/87, notes, stocks, budgets, logs, archive/originals and existing manual/weapon facts roundtrip with new targets',async()=>{
 const legacy={version:1,rank:12,statuses:Object.fromEntries(tree.nodes.map((n,i)=>[n.id,i%2?'todo':'done'])),steps:Object.fromEntries(tree.nodes.map(n=>[n.id,n.steps.map((_,i)=>i%2===0)])),notes:Object.fromEntries(tree.nodes.map(n=>[n.id,'中文<script>普通文本</script>'])),stock:{credits:0,endo:55,forma:19,platinum:0,'material:yao-shrub':0,'material:pathos-clamp':12,'material:eevani':null},budget:{origin:{credits:0,forma:2}},events:[{time:'原始时间一',text:'第一条'},{time:'原始时间二',text:'第二条'}],unknown:{field:['保留',0]}};
 const migrated=await parseImport(new TextEncoder().encode(JSON.stringify(legacy)),'原件.json',provider),p={...migrated.profile,id:'one'};p.goalStates={'goal:dual-toxocyst':'done'};p.personalFacts={'system:helminth:installed':{value:true,recordedAt:'原声明时间'}};p.weaponProgress={'weapon:nami-solo':{owned:null,adapterOwned:null,installed:null,currentStageId:'nami-solo:iv',stages:{}}};setCraftingTarget(p,'recipe:forma',3);p.stock['material:neurodes']=0;
 const name='m1-'+crypto.randomUUID();names.push(name);const db=await openDatabase(name),repo=new Repository(db);try{await repo.create(p);const preview=await parseImport(new TextEncoder().encode(exportBackup(p,tree.catalogVersion)),'完整.json',provider),saved=await repo.restore(preview,'two',null);expect({...saved,id:p.id,revision:p.revision}).toEqual(p);expect(Object.values(saved.steps).reduce((sum,s)=>sum+Object.keys(s).length,0)).toBe(87);expect(saved.originals).toEqual(migrated.profile.originals);expect(saved.events).toEqual(legacy.events);expect(saved.stock.forma).toBe(19);expect(saved.goalStates?.['goal:dual-toxocyst']).toBe('done');}finally{db.close();}
});
it('repository quantity changes remain isolated and stale/quota/update-barrier failures preserve previous state',async()=>{
 const name='m1-'+crypto.randomUUID();names.push(name);const db=await openDatabase(name),repo=new Repository(db);try{const one=newProfile(tree,'one','甲',false),two=newProfile(tree,'two','乙',false);await repo.create(one);await repo.create(two);setCraftingTarget(one,'recipe:forma',2);const saved=await repo.save(one,0);expect((await repo.get('two'))?.craftingTargets).toBeUndefined();await expect(repo.save(one,0)).rejects.toThrow('其他页面');
 const next=structuredClone(saved);setCraftingTarget(next,'recipe:forma',3);const hook=()=>{throw new DOMException('quota','QuotaExceededError');};db.profiles.hook('updating',hook);await expect(repo.save(next,saved.revision)).rejects.toThrow();db.profiles.hook('updating').unsubscribe(hook);expect(await repo.get('one')).toEqual(saved);await db.meta.put({key:'writeBarrier',value:{target:'future'}});await expect(repo.save(next,saved.revision)).rejects.toThrow('更新');expect(await repo.get('one')).toEqual(saved);
 }finally{db.close();}
});
