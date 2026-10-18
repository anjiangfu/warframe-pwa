import {it,expect} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {craftGoalId,type CraftingCatalog} from '../domain/crafting';
import {resolveMaterialReference,type MaterialContext} from '../domain/material-reference';
const provider=new LocalProvider(),crafting=provider.getCraftingCatalog(),weapons=provider.getWeaponCatalog(),goals=provider.getGoalCatalog(),id='material:neurodes';
const profile=()=>{const p=newProfile(provider.getCatalog(),'one','档案',false);p.craftingTargets={'recipe:forma':1};p.goalStates={[craftGoalId('recipe:forma')]:'focused'};p.stock[id]=0;return p;};
const context=(source:MaterialContext['source']):MaterialContext=>({id,profileId:'one',from:'crafting',source});
it('saved reference recomputes current quantity without changing the profile',()=>{
 const p=profile(),ref=context({kind:'project',recipeId:'recipe:forma'});expect(resolveMaterialReference(ref,p,crafting,weapons,goals).required).toBe(1);p.craftingTargets!['recipe:forma']=3;p.stock[id]=1;const before=structuredClone(p);expect(resolveMaterialReference(ref,p,crafting,weapons,goals).required).toBe(3);expect(p).toEqual(before);
});
it('inventory-only revision changes retain a valid requirement',()=>{
 const p=profile(),ref=context({kind:'project',recipeId:'recipe:forma'});p.craftingTargets!['recipe:forma']=3;for(const n of [0,1,2]){p.stock[id]=n;p.revision++;expect(resolveMaterialReference(ref,p,crafting,weapons,goals).required).toBe(3);}
});
it('saved completion or deferral invalidates the reference until resumed',()=>{
 const p=profile(),ref=context({kind:'project',recipeId:'recipe:forma'});for(const status of ['done','deferred'] as const){p.goalStates![craftGoalId('recipe:forma')]=status;const result=resolveMaterialReference(ref,p,crafting,weapons,goals);expect(result.required).toBeNull();expect(result.note).toContain('目标已变化');}p.goalStates![craftGoalId('recipe:forma')]='focused';expect(resolveMaterialReference(ref,p,crafting,weapons,goals).required).toBe(1);
});
it('shared reference recomputes all current contributions and rejects absent or incomplete demand',()=>{
 const p=profile(),ref=context({kind:'shared'}),c=structuredClone(crafting) as CraftingCatalog;const second=structuredClone(c.recipes[0]);second.id='synthetic:second';second.inputs.find(x=>x.resourceId===id)!.quantity=2;c.recipes.push(second);expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBe(1);p.craftingTargets!['synthetic:second']=2;expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBe(5);p.goalStates![craftGoalId('recipe:forma')]='done';expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBe(4);p.goalStates![craftGoalId('synthetic:second')]='deferred';expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBeNull();p.craftingTargets!['missing:recipe']=1;expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBeNull();
});
it('assistant references resolve stable current goal IDs and fail explicitly when unmatched',()=>{
 const p=profile(),ref=context({kind:'assistant',goalId:craftGoalId('recipe:forma')});p.craftingTargets!['recipe:forma']=4;const result=resolveMaterialReference(ref,p,crafting,weapons,goals);expect(result.required).toBe(4);expect(result.label).toContain('养成助手');delete p.craftingTargets!['recipe:forma'];expect(resolveMaterialReference(ref,p,crafting,weapons,goals).required).toBeNull();
});
it('unsaved previews keep their own quantity and explicit meaning after saved plans change',()=>{
 const p=profile(),ref=context({kind:'preview',recipeId:'recipe:forma',quantity:3});p.craftingTargets!['recipe:forma']=5;p.stock[id]=1;const before=structuredClone(p),result=resolveMaterialReference(ref,p,crafting,weapons,goals);expect(result.required).toBe(3);expect(result.label).toBe('未保存数量预览：计划新产出3');expect(result.note).toContain('不代表最新已保存目标');expect(p).toEqual(before);expect(resolveMaterialReference({...ref,profileId:undefined},undefined,crafting,weapons,goals).required).toBe(3);
});
it('plain browse, other profiles, missing resources, missing recipes and unverified amounts do not reuse a number',()=>{
 const p=profile(),ref=context({kind:'project',recipeId:'recipe:forma'});expect(resolveMaterialReference(undefined,p,crafting,weapons,goals).required).toBeUndefined();expect(resolveMaterialReference(ref,{...p,id:'two'},crafting,weapons,goals).required).toBeUndefined();expect(resolveMaterialReference({...ref,id:'old:material'},p,crafting,weapons,goals).required).toBeNull();expect(resolveMaterialReference(ref,p,{...crafting,recipes:[]},weapons,goals).required).toBeNull();const c=structuredClone(crafting);c.recipes[0].inputs[0].verification='unverified';expect(resolveMaterialReference(ref,p,c,weapons,goals).required).toBeNull();
});
