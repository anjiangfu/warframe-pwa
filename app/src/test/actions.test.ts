import {expect,it} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {deriveActions,type ActionCatalogs} from '../domain/actions';
import {currentRequirements,summarizePlans} from '../domain/crafting';
const provider=new LocalProvider(),catalogs:ActionCatalogs={goals:provider.getGoalCatalog(),weapons:provider.getWeaponCatalog(),crafting:provider.getCraftingCatalog(),resources:provider.getResourceCatalog(),syndicates:provider.getSyndicateCatalog()};
const profile=()=>newProfile(provider.getCatalog(),'p','合成档案',false);
it('blank profile produces an understandable empty list with no historical facts or time default',()=>{
 const p=profile(),before=structuredClone(p),a=deriveActions(p,catalogs);expect(a.items).toEqual([]);expect(a.dailyMinutes).toBeNull();expect(a.summary.materialState).toBe('empty');expect(p).toEqual(before);expect(p.personalFacts).toBeUndefined();
});
it('completed weapon and installed systems disappear while recorded Nami IV maps to its existing guide',()=>{
 const p=profile();p.goalStates={'goal:dual-toxocyst':'done','goal:nami-solo':'focused'};p.personalFacts={'system:helminth:installed':{value:true,recordedAt:'t'}};p.weaponProgress={'weapon:nami-solo':{owned:null,adapterOwned:null,installed:null,currentStageId:'nami-solo:iv',stages:{}}};
 const before=structuredClone(p),a=deriveActions(p,catalogs);expect(a.items.map(x=>x.id)).toEqual(['goal:nami-solo']);expect(a.items[0].stageId).toBe('nami-solo:iv');expect(a.items[0].entry).toContain('攻略');expect(a.items[0].candidate?.place).toContain('E Prime');expect(p).toEqual(before);
});
it('explicit focus sorts before stable catalog order and returned items are not truncated to three',()=>{
 const p=profile();p.goalStates={'goal:nami-solo':'focused','goal:dual-toxocyst':'focused','goal:helminth-install':'focused','goal:shard-module':'focused'};p.craftingTargets={'recipe:forma':1};
 const a=deriveActions(p,catalogs);expect(a.items.slice(0,4).map(x=>x.id)).toEqual(['goal:dual-toxocyst','goal:helminth-install','goal:shard-module','goal:nami-solo']);expect(a.items.length).toBe(5);
});
it('crafting plus the next Hex rank share exactly the existing calculation, not summed independent deficits',()=>{
 const p=profile();p.craftingTargets={'recipe:forma':1};p.syndicateTargets={'syndicate:hex':5};p.personalFacts={'syndicate:hex:rank':{value:3,recordedAt:'t'},'syndicate:hex:standing':{value:0,recordedAt:'t'}};p.stock.credits=100000;
 const a=deriveActions(p,catalogs),expected=summarizePlans(currentRequirements(catalogs.crafting,p,catalogs.weapons,catalogs.goals,catalogs.syndicates),p.stock);
 expect(a.summary).toEqual(expected);expect(a.items.flatMap(x=>x.unknowns).join('')).not.toContain('blueprint:');const credit=a.summary.rows.find(x=>x.resourceId==='credits')!;expect(credit.required).toBe(135000);expect(credit.deficit).toBe(35000);expect(a.summary.rows.some(x=>x.resourceId==='material:techrot-motherboard')).toBe(false);expect(a.contributors).toHaveLength(2);
 p.stock.credits=null;expect(deriveActions(p,catalogs).summary.rows.find(x=>x.resourceId==='credits')!.deficit).toBeNull();
});
it('Hex missing materials and unknown task, relationship and entry conditions remain visible together',()=>{
 const p=profile();p.syndicateTargets={'syndicate:hex':5};p.personalFacts={'syndicate:hex:rank':{value:3,recordedAt:'t'}};p.stock.credits=0;
 const item=deriveActions(p,catalogs).items[0];expect(item.materials.some(m=>m.id==='credits')).toBe(true);expect(item.conditions?.find(x=>x.label==='祭品与货币')?.state).toBe('unmet');expect(item.conditions?.find(x=>x.label==='任务')?.state).toBe('unknown');expect(item.unknowns.join('')).toContain('声望');expect(item.unknowns.join('')).toContain('地图');expect(item.next).not.toContain('可以直接晋升');
});
it('unmatched targets and unpriced installation needs make the shared summary incomplete without zero quantities',()=>{
 const p=profile();p.goalStates={'goal:removed':'focused','goal:helminth-install':'focused'};p.craftingTargets={'recipe:forma':1,'recipe:removed':2};
 const a=deriveActions(p,catalogs);expect(a.items.some(x=>x.id==='goal:removed')).toBe(true);expect(a.items.find(x=>x.id==='goal:removed')!.goal).toBeUndefined();expect(a.summary.materialState).toBe('incomplete');expect(a.summary.requirementsComplete).toBe(false);expect(a.summary.issues.join('')).toContain('需求');expect(a.summary.rows.find(x=>x.resourceId==='credits')!.required).toBe(35000);expect(a.summary).toEqual(summarizePlans(currentRequirements(catalogs.crafting,p,catalogs.weapons,catalogs.goals,catalogs.syndicates),p.stock));
});
it('plant candidates remain unverified independently of known installation amounts',()=>{
 const p=profile();p.goalStates={'goal:dual-toxocyst':'focused'};p.weaponProgress={'weapon:dual-toxocyst':{owned:true,adapterOwned:true,installed:false,currentStageId:null,stages:{}}};
 p.stock['material:pathos-clamp']=20;p.stock['material:yao-shrub']=0;p.stock['material:eevani']=80;
 const a=deriveActions(p,catalogs);expect(a.items[0].candidate?.verification).toBe('unverified');expect(a.items[0].candidate?.place).toContain('Soprano Springs');expect(a.summary.rows.find(x=>x.resourceId==='material:yao-shrub')!.required).toBe(70);
});
it('status changes, rank, quantity and inventory are recomputed from current inputs',()=>{
 const p=profile();p.craftingTargets={'recipe:forma':1};p.goalStates={'crafting:recipe:forma':'focused'};p.stock.credits=0;expect(deriveActions(p,catalogs).summary.rows.find(x=>x.resourceId==='credits')!.required).toBe(35000);
 p.craftingTargets['recipe:forma']=2;expect(deriveActions(p,catalogs).summary.rows.find(x=>x.resourceId==='credits')!.required).toBe(70000);
 for(const state of ['done','deferred'] as const){p.goalStates['crafting:recipe:forma']=state;expect(deriveActions(p,catalogs).items).toHaveLength(0);}
 p.goalStates['crafting:recipe:forma']='focused';expect(deriveActions(p,catalogs).items).toHaveLength(1);
});
it('explicit zero budget is preserved and orphaned weapon records remain a readonly check action',()=>{
 const p=profile();p.dailyMinutes=0;p.weaponProgress={'weapon:removed':{owned:true,adapterOwned:null,installed:null,currentStageId:'old:iv',stages:{}}};const before=structuredClone(p),a=deriveActions(p,catalogs);expect(a.dailyMinutes).toBe(0);expect(a.items).toHaveLength(1);expect(a.items[0].entry).toContain('备份');expect(a.summary.materialState).toBe('incomplete');expect(p).toEqual(before);
});
it('an installed but unlinked original module stays a notice instead of a repeated installation action',()=>{
 const p=profile();p.personalFacts={'declaration:shard-module:installed':{value:true,recordedAt:'t',originalLabel:'原力石模块',entityId:null}};const a=deriveActions(p,catalogs);expect(a.items).toHaveLength(0);expect(a.notices.join('')).toContain('关联');
});
it('one orphan record referenced by a saved focus has one action and one unknown contribution',()=>{
 const p=profile();p.weaponProgress={'weapon:removed':{owned:true,adapterOwned:null,installed:null,currentStageId:null,stages:{}}};p.goalStates={'record:weapon:removed':'focused'};const a=deriveActions(p,catalogs);expect(a.items.filter(x=>x.id==='record:weapon:removed')).toHaveLength(1);expect(a.contributors.filter(x=>x.id==='record:weapon:removed')).toHaveLength(1);
});
