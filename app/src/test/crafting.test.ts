import {expect,it} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {findResource,searchResources} from '../domain/resources';
import {planRecipe,summarizePlans,currentPlans,craftGoalId,type Recipe,type CraftingProfile} from '../domain/crafting';
const provider=new LocalProvider(),resources=provider.getResourceCatalog(),crafting=provider.getCraftingCatalog(),weapons=provider.getWeaponCatalog(),goals=provider.getGoalCatalog();
const stock={'material:test':100};const amount=(quantity:number|null,verification:'verified'|'unverified'='verified')=>({quantity,verification,sourceIds:['test-source'],checkedAt:'2026-10-18'});
const recipe=(id:string,quantity=80,output=1):Recipe=>({id,title:'测试清单',output:{resourceId:'forma',...amount(output)},inputs:[{resourceId:'material:test',...amount(quantity)}],prerequisites:['地图开放未知'],sourceIds:['test-source']});
it('shared resource index keeps old IDs and searches Chinese, English and aliases without writing profiles',()=>{
 expect(resources.resources).toHaveLength(23);for(const q of ['福马','Forma','蓝图','Morphics','神经元','Pathos Clamps','Yao Shrub','EEVANI'])expect(searchResources(resources,q).length).toBeGreaterThan(0);expect(findResource(resources,'missing')).toBeUndefined();
 for(const m of weapons.materials)expect(findResource(resources,m.id)?.name).toBe(m.name);expect(findResource(resources,'credits')?.english).toBe('Credits');expect(findResource(resources,'forma')?.name).toBe('福马');
});
it('provider rejects duplicate resources and bad quantities while retaining custom weapon catalog injection',()=>{
 const custom=structuredClone(resources);custom.resources.push(custom.resources[0]);expect(()=>new LocalProvider(undefined,undefined,undefined,custom)).toThrow('重复');
 const data=structuredClone(crafting);data.recipes[0].output.quantity=0;expect(()=>new LocalProvider(undefined,undefined,undefined,undefined,data)).toThrow('数量');
 const w=structuredClone(weapons);w.weapons[0].name='注入测试名';const replacement=new LocalProvider(undefined,w);expect(replacement.getWeaponCatalog().weapons[0].name).toBe('注入测试名');expect(replacement.getResourceCatalog().resources.find(r=>r.id===w.materials[0].id)?.name).toBe(w.materials[0].name);
});
it('one checked Forma recipe uses same credits/forma IDs, four rare inputs and one blueprint per batch',()=>{
 expect(crafting.recipes).toHaveLength(1);const r=crafting.recipes[0];expect(r.id).toBe('recipe:forma');expect(r.output.resourceId).toBe('forma');expect(r.output.quantity).toBe(1);expect(Object.fromEntries(r.inputs.map(x=>[x.resourceId,x.quantity]))).toEqual({credits:35000,'blueprint:forma':1,'material:morphics':1,'material:neural-sensors':1,'material:neurodes':1,'material:orokin-cell':1});expect(r.inputs.every(x=>x.verification==='verified'&&x.sourceIds.length&&x.checkedAt)).toBe(true);
});
it('batches round up planned new output and retain extra output; finished product stock never reduces the plan',()=>{
 const p=planRecipe(recipe('test',3,2),3,{...stock,forma:999});expect([p.batches,p.produced,p.extra]).toEqual([2,4,1]);expect(p.lines[0].required).toBe(6);expect(p.lines[0].deficit).toBe(0);
 for(const q of [0,-1,1.1,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])expect(planRecipe(recipe('test'),q,stock).requirementsComplete).toBe(false);
});
it('two goals needing 80 each share stock 100 only once: independent gaps zero, total gap sixty',()=>{
 const a=planRecipe(recipe('a'),1,stock),b=planRecipe(recipe('b'),1,stock);expect(a.lines[0].deficit).toBe(0);expect(b.lines[0].deficit).toBe(0);const sum=summarizePlans([a,b],stock);expect(sum.rows[0].required).toBe(160);expect(sum.rows[0].deficit).toBe(60);expect(sum.rows[0].contributors).toHaveLength(2);expect(sum.materialState).toBe('missing');
});
it('unknown stock is not zero; unverified quantities and missing provenance do not count as known zero',()=>{
 const a=planRecipe(recipe('a'),1,{});expect(a.lines[0].owned).toBeNull();expect(a.lines[0].deficit).toBeNull();expect(a.materialState).toBe('unknown');expect(planRecipe(recipe('a'),1,{'material:test':0}).lines[0].deficit).toBe(80);
 const incomplete=recipe('b');incomplete.inputs[0]={resourceId:'material:test',...amount(80,'unverified')};const partial=summarizePlans([planRecipe(recipe('a'),1,stock),planRecipe(incomplete,1,stock)],stock);expect(partial.requirementsComplete).toBe(false);expect(partial.rows[0].required).toBeNull();expect(partial.rows[0].knownSubtotal).toBe(80);expect(partial.rows[0].deficit).toBeNull();expect(partial.materialState).toBe('incomplete');
 const noSource=recipe('c');noSource.inputs[0].sourceIds=[];expect(planRecipe(noSource,1,stock).requirementsComplete).toBe(false);
});
it('safe multiplication and sum reject overflow and leave unusual legacy stock untouched',()=>{
 const p=planRecipe(recipe('big',Number.MAX_SAFE_INTEGER),2,stock);expect(p.requirementsComplete).toBe(false);const a=planRecipe(recipe('a',Number.MAX_SAFE_INTEGER),1,stock),b=planRecipe(recipe('b',1),1,stock);expect(summarizePlans([a,b],stock).rows[0].required).toBeNull();
 const legacy={'material:test':.5},before=structuredClone(legacy);expect(planRecipe(recipe('legacy'),1,legacy).materialState).toBe('unknown');expect(legacy).toEqual(before);
});
it('only explicitly created active plans and active uninstalled goals are aggregated, never completed or operation goals',()=>{
 const p:CraftingProfile=newProfile(provider.getCatalog(),'p','个人',false);expect(currentPlans(crafting,p,weapons,goals)).toEqual([]);p.craftingTargets={'recipe:forma':3};p.goalStates={[craftGoalId('recipe:forma')]:'focused','goal:dual-toxocyst':'done','goal:nami-solo':'focused'};p.weaponProgress={'weapon:nami-solo':{owned:null,adapterOwned:null,installed:null,currentStageId:'nami-solo:iv',stages:{}}};const before=structuredClone(p);expect(currentPlans(crafting,p,weapons,goals)).toHaveLength(1);expect(p).toEqual(before);p.goalStates[craftGoalId('recipe:forma')]='deferred';expect(currentPlans(crafting,p,weapons,goals)).toEqual([]);p.goalStates[craftGoalId('recipe:forma')]='focused';expect(currentPlans(crafting,p,weapons,goals)[0].quantity).toBe(3);
 p.goalStates['goal:dual-toxocyst']='focused';p.weaponProgress['weapon:dual-toxocyst']={owned:true,adapterOwned:true,installed:false,currentStageId:null,stages:{}};expect(currentPlans(crafting,p,weapons,goals)).toHaveLength(2);expect(currentPlans(crafting,p,weapons,goals)[1].kind).toBe('installation');
});
it('catalog renames, reorder and missing recipes preserve personal references, quantities and status',()=>{
 const p:CraftingProfile=newProfile(provider.getCatalog(),'p','个人',false);p.craftingTargets={'old:removed':2,'recipe:forma':4};p.goalStates={[craftGoalId('old:removed')]:'focused'};const before=structuredClone(p);const replacement=structuredClone(crafting);replacement.recipes.reverse();replacement.recipes[0].title='新显示名';const plans=currentPlans(replacement,p,weapons,goals);expect(plans.find(x=>x.id==='old:removed')?.requirementsComplete).toBe(false);expect(summarizePlans(plans,p.stock).materialState).toBe('incomplete');expect(p).toEqual(before);
});
