import 'fake-indexeddb/auto';
import {afterEach,expect,it} from 'vitest';
import Dexie from 'dexie';
import {LocalProvider} from '../catalog/provider';
import {newProfile,parseImport,exportBackup,validateProfile} from '../storage/imports';
import {Repository,openDatabase} from '../storage/db';
import {progressOf,editWeaponProgress,materialDeficit,searchGuides,type WeaponCatalog} from '../domain/weapon';
const provider=new LocalProvider(),tree=provider.getCatalog(),catalog=provider.getWeaponCatalog();
const id='weapon:dual-toxocyst',dbs:string[]=[];
afterEach(async()=>{for(const n of dbs.splice(0))await Dexie.delete(n);});
it('catalog has one real weapon, I installed, II solo, III incarnon 100, IV 17 headshots',()=>{
 expect(catalog.weapons).toHaveLength(1);expect(catalog.weapons[0].id).toBe(id);const stages=catalog.weapons[0].stages;
 expect(stages.map(s=>[s.challenge.kind,s.challenge.target])).toEqual([['installation',null],['solo-mission',1],['incarnon-kills',100],['consecutive-headshots',17]]);
 expect(stages[3].challenge.resets).toEqual(['body-shot']);expect(stages[3].checks.join('')).toContain('装填不重置');expect(stages.every(s=>s.tips.length>=3&&s.tips.length<=5&&s.locationIds.length>0)).toBe(true);
 expect(catalog.weapons[0].installCost.map(x=>x.quantity)).toEqual([20,70,80]);
});
it('verified Chinese and English names are searchable and a test-only second entry uses the same queries',()=>{
 for(const q of ['苦栓','Pathos Clamps','瑶丛','Yao Shrub','延凡草','EEVANI'])expect(searchGuides(catalog,q).some(x=>x.kind==='material')).toBe(true);
 const fake=structuredClone(catalog) as WeaponCatalog;fake.weapons.push({...fake.weapons[0],id:'weapon:fixture',name:'仅测试条目',english:'Fixture Pistol',stages:fake.weapons[0].stages.map((s,i)=>({...s,id:'fixture:'+i}))});
 const second=new LocalProvider(undefined,fake).getWeaponCatalog();expect(searchGuides(second,'Fixture Pistol')).toContainEqual({kind:'weapon',id:'weapon:fixture',label:'仅测试条目（Fixture Pistol）'});expect(catalog.weapons).toHaveLength(1);
});
it('old profiles read unknown without mutation or progress inferred from old done nodes',()=>{
 const p=newProfile(tree,'one','旧档',true),before=structuredClone(p);expect(progressOf(p,id)).toEqual({owned:null,adapterOwned:null,installed:null,currentStageId:null,stages:{}});expect(progressOf(p,id)).toEqual(progressOf(p,id));expect(p).toEqual(before);
 expect(materialDeficit(20,undefined)).toBeNull();expect(materialDeficit(20,null)).toBeNull();expect(materialDeficit(20,0)).toBe(20);expect(materialDeficit(20,25)).toBe(0);
});
it('new state saves, isolates profiles and roundtrips every field with shared stock and no automatic material deduction',async()=>{
 const name='pilot-'+crypto.randomUUID();dbs.push(name);const db=await openDatabase(name),repo=new Repository(db);
 try{const one=newProfile(tree,'one','甲',true),two=newProfile(tree,'two','乙',false);await repo.create(one);await repo.create(two);editWeaponProgress(one,id,s=>{s.installed=true;s.currentStageId='dual-toxocyst:iv';s.stages['dual-toxocyst:iii']='done';});one.stock['material:pathos-clamp']=0;one.notes.torid='保留';const saved=await repo.save(one,0);
 expect(saved.stock.credits).toBeNull();expect(saved.stock['material:pathos-clamp']).toBe(0);expect(progressOf((await repo.get('two'))!,id).installed).toBeNull();const preview=await parseImport(new TextEncoder().encode(exportBackup(saved,tree.catalogVersion)),'新档.json',provider);const restored=await repo.restore(preview,'three',null);expect({...restored,id:saved.id,revision:saved.revision}).toEqual(saved);
 await db.meta.put({key:'writeBarrier',value:{target:'future'}});await expect(repo.save(saved,saved.revision)).rejects.toThrow('更新');expect(await repo.get('one')).toEqual(saved);
 }finally{db.close();}
});
it('M0 schema1 and legacy migration retain all old fields while new state is absent',async()=>{
 const old=newProfile(tree,'old','旧M0',true);old.stock.credits=0;old.notes.origin='中文';old.legacyArchive.extra={preserve:true};const parsed=await parseImport(new TextEncoder().encode(exportBackup(old,'2026.10.16.1')),'M0.json',provider);expect(parsed.profile).toEqual(old);expect(parsed.profile.weaponProgress).toBeUndefined();
 const legacy={version:1,rank:12,statuses:{origin:'done'},notes:{origin:'原文'},stock:{credits:0},events:[{time:'原时间',text:'保留'}],unknown:{field:true}};const migrated=await parseImport(new TextEncoder().encode(JSON.stringify(legacy)),'旧.json',provider);expect(migrated.profile.weaponProgress).toBeUndefined();expect(migrated.profile.legacyArchive.unknown).toEqual(legacy.unknown);const again=await parseImport(new TextEncoder().encode(exportBackup(migrated.profile,tree.catalogVersion)),'新.json',provider);expect(again.profile).toEqual(migrated.profile);
});
it('invalid new states fail before save/restore and quota failure preserves old data',async()=>{
 const p=newProfile(tree,'one','原档',false);editWeaponProgress(p,id,s=>{s.owned=true;});const invalid=structuredClone(p);(invalid.weaponProgress![id] as unknown as {installed:string}).installed='yes';expect(()=>validateProfile(invalid)).toThrow();
 const name='pilot-'+crypto.randomUUID();dbs.push(name);const db=await openDatabase(name),repo=new Repository(db);try{await repo.create(p);await expect(repo.save(invalid,0)).rejects.toThrow();const parsed=await parseImport(new TextEncoder().encode(exportBackup(p,tree.catalogVersion)),'合法.json',provider);parsed.profile=invalid;await expect(repo.restore(parsed,'one',0)).rejects.toThrow();expect(await repo.get('one')).toEqual(p);const hook=()=>{throw new DOMException('quota','QuotaExceededError');};db.profiles.hook('updating',hook);await expect(repo.save({...p,name:'不应写入'},0)).rejects.toThrow();db.profiles.hook('updating').unsubscribe(hook);expect(await repo.get('one')).toEqual(p);}finally{db.close();}
});
