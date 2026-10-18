import type {ProfileDocument} from './model';
import type {GoalCatalog} from './goals';
import type {WeaponCatalog} from './weapon';
import {craftGoalId,craftingGoals,currentPlans,planRecipe,positiveInteger,summarizePlans,type CraftingCatalog} from './crafting';

// Navigation remembers what to query, not a requirement detached from its target.
export type MaterialSource={kind:'project';recipeId:string}|{kind:'shared'}|{kind:'assistant';goalId:string}|{kind:'preview';recipeId:string;quantity:number};
export interface MaterialContext {id:string;profileId?:string;from:'crafting'|'assistant';source:MaterialSource}
export interface MaterialReference {required?:number|null;label:string;note?:string}
export function resolveMaterialReference(context:MaterialContext|undefined,profile:ProfileDocument|undefined,catalog:Readonly<CraftingCatalog>,weapons:Readonly<WeaponCatalog>,goals:Readonly<GoalCatalog>):MaterialReference {
 const none:MaterialReference={label:'本项目参考用量'};
 if(!context)return none;
 if(context.profileId!==profile?.id)return {...none,note:'当前档案未指定此查询目标；其他档案的参考用量不会沿用。'};
 const source=context.source,label=source.kind==='shared'?'当前已保存目标的共享合计':source.kind==='assistant'?'养成助手：当前已保存的制作目标':source.kind==='preview'?positiveInteger(source.quantity)?`未保存数量预览：计划新产出${source.quantity}`:'未保存数量预览：数量待核':'当前已保存的单项目';
 const invalid=(reason:string):MaterialReference=>({required:null,label,note:reason+'。目标已变化，请返回重新查询'});
 if(source.kind==='shared'){
  if(!profile)return invalid('未匹配到个人档案');
  const summary=summarizePlans(currentPlans(catalog,profile,weapons,goals),profile.stock),line=summary.rows.find(l=>l.resourceId===context.id);
  if(!line)return invalid('此材料已不在当前共享需求中');
  if(!summary.requirementsComplete||line.required===null)return invalid('当前共享需求含缺失或待核资料，不能确定总用量');
  return {required:line.required,label,note:'按当前已保存且未完成、未暂缓的目标重算；同一份库存只抵扣一次。'};
 }
 const recipeId=source.kind==='assistant'?profile?craftingGoals(catalog,profile).find(g=>g.id===source.goalId)?.recipeId:undefined:source.recipeId;
 if(!recipeId)return invalid('助手目标引用未匹配');
 let quantity:number;
 if(source.kind==='preview')quantity=source.quantity;
 else{
  const saved=profile?.craftingTargets?.[recipeId];if(saved===undefined)return invalid('原制作目标已不在当前档案中');
  const state=profile?.goalStates?.[craftGoalId(recipeId)];if(state==='done'||state==='deferred')return invalid(state==='done'?'此制作目标已完成，不作为当前需求':'此制作目标已暂缓，不作为当前需求');
  quantity=saved;
 }
 const plan=planRecipe(catalog.recipes.find(r=>r.id===recipeId),quantity,profile?.stock??{},recipeId),line=plan.lines.find(l=>l.resourceId===context.id);
 if(!plan.requirementsComplete||!line||line.required===null)return invalid('配方、数量或材料引用待核，不能确定本项用量');
 return {required:line.required,label,note:source.kind==='preview'?'这是独立预览，不代表最新已保存目标；未写入制作计划。持有量使用当前档案。':'按当前档案的已保存数量和当前目录重算；库存单独修改不会清除该参考。'};
}
