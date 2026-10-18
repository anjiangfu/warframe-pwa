import type {ProfileDocument} from './model';
import type {GoalCatalog,GoalDefinition} from './goals';
import {progressOf,type WeaponCatalog} from './weapon';
export interface CheckedAmount {quantity:number|null;verification:'verified'|'unverified'|'conflicting';sourceIds:string[];checkedAt:string}
export interface Recipe {id:string;title:string;output:CheckedAmount&{resourceId:string};inputs:(CheckedAmount&{resourceId:string})[];prerequisites:string[];sourceIds:string[]}
export interface CraftingCatalog {catalogVersion:string;recipes:Recipe[]}
export type CraftingProfile=ProfileDocument;
export interface RequirementLine {resourceId:string;required:number|null;owned:number|null;deficit:number|null}
export type MaterialState='empty'|'incomplete'|'unknown'|'missing'|'sufficient';
export interface CraftPlan {id:string;title:string;kind:'crafting'|'installation';quantity:number;batches:number|null;produced:number|null;extra:number|null;lines:RequirementLine[];issues:string[];prerequisites:string[];requirementsComplete:boolean;materialState:MaterialState}
export const craftGoalId=(id:string)=>'crafting:'+id;
export function setCraftingTarget(p:ProfileDocument,id:string,quantity:number){
 if(!id||['__proto__','constructor','prototype'].includes(id)||!positiveInteger(quantity))throw Error('计划新制作数量必须为正安全整数');
 p.craftingTargets??={};p.craftingTargets[id]=quantity;p.goalStates??={};p.goalStates[craftGoalId(id)]??='focused';
}
export function positiveInteger(n:unknown):n is number{return typeof n==='number'&&Number.isSafeInteger(n)&&n>0;}
const knownStock=(n:unknown):number|null=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0?n:null;
function checked(a:CheckedAmount){return positiveInteger(a.quantity)&&a.verification==='verified'&&a.sourceIds.length>0&&!!a.checkedAt;}
function safe(n:bigint):number|null{return n<=BigInt(Number.MAX_SAFE_INTEGER)?Number(n):null;}
function materialState(lines:RequirementLine[],complete:boolean):MaterialState {if(!complete)return 'incomplete';if(lines.some(l=>l.owned===null))return 'unknown';if(lines.some(l=>l.deficit!==null&&l.deficit>0))return 'missing';return lines.length?'sufficient':'incomplete';}
function line(resourceId:string,required:number|null,stock:ProfileDocument['stock']):RequirementLine {const owned=knownStock(stock[resourceId]);return {resourceId,required,owned,deficit:owned===null||required===null?null:Math.max(0,required-owned)};}
export function planRecipe(recipe:Recipe|undefined,quantity:number,stock:ProfileDocument['stock'],id=recipe?.id??'missing'):CraftPlan {
 const p:CraftPlan={id,title:recipe?.title??'旧制作引用待匹配（'+id+'）',kind:'crafting',quantity,batches:null,produced:null,extra:null,lines:[],issues:[],prerequisites:recipe?.prerequisites??[],requirementsComplete:false,materialState:'incomplete'};
 if(!recipe){p.issues.push('配方目录未匹配，保留原目标数量与状态');return p;}
 if(!positiveInteger(quantity)){p.issues.push('计划新制作数量必须为正安全整数');return p;}
 if(!checked(recipe.output)){p.issues.push('单批产出资料待核，不能确定批次数');return p;}
 const batches=safe((BigInt(quantity)+BigInt(recipe.output.quantity!)-1n)/BigInt(recipe.output.quantity!));
 const produced=batches===null?null:safe(BigInt(batches)*BigInt(recipe.output.quantity!));
 if(batches===null||produced===null){p.issues.push('产出数量溢出，不能计算');return p;}
 p.batches=batches;p.produced=produced;p.extra=produced-quantity;
 for(const input of recipe.inputs){let required:number|null=null;if(!checked(input))p.issues.push(input.resourceId+'用量或来源待核');else{required=safe(BigInt(input.quantity!)*BigInt(batches));if(required===null)p.issues.push(input.resourceId+'需求溢出');}p.lines.push(line(input.resourceId,required,stock));}
 if(!p.lines.length)p.issues.push('投入清单缺失');p.requirementsComplete=p.issues.length===0;p.materialState=materialState(p.lines,p.requirementsComplete);return p;
}
export interface SummaryLine extends RequirementLine {knownSubtotal:number|null;contributors:{id:string;title:string;required:number|null}[]}
export function summarizePlans(plans:CraftPlan[],stock:ProfileDocument['stock']){
 const map=new Map<string,{sum:bigint;incomplete:boolean;contributors:SummaryLine['contributors']}>();const issues=plans.flatMap(p=>p.issues.map(text=>p.title+'：'+text));
 for(const p of plans)for(const l of p.lines){const item=map.get(l.resourceId)??{sum:0n,incomplete:false,contributors:[]};if(l.required===null)item.incomplete=true;else item.sum+=BigInt(l.required);item.contributors.push({id:p.id,title:p.title,required:l.required});map.set(l.resourceId,item);}
 const rows:SummaryLine[]=[...map].map(([resourceId,item])=>{const subtotal=safe(item.sum);if(subtotal===null){issues.push(resourceId+'合计溢出');item.incomplete=true;}const required=item.incomplete?null:subtotal;return {...line(resourceId,required,stock),knownSubtotal:subtotal,contributors:item.contributors};});
 const requirementsComplete=issues.length===0&&plans.every(p=>p.requirementsComplete);return {rows,issues,requirementsComplete,materialState:plans.length?materialState(rows,requirementsComplete):'empty' as MaterialState};
}
export function currentPlans(c:Readonly<CraftingCatalog>,p:CraftingProfile,w:Readonly<WeaponCatalog>,g:Readonly<GoalCatalog>):CraftPlan[]{
 const plans=Object.entries(p.craftingTargets??{}).filter(([id])=>!['done','deferred'].includes(p.goalStates?.[craftGoalId(id)]??'focused')).map(([id,q])=>planRecipe(c.recipes.find(r=>r.id===id),q,p.stock,id));
 for(const goal of g.goals){if(!goal.weaponId||p.goalStates?.[goal.id]!=='focused')continue;const weapon=w.weapons.find(x=>x.id===goal.weaponId);if(!weapon)continue;const progress=progressOf(p,weapon.id),stage=weapon.stages.find(s=>s.id===progress.currentStageId);
  if(progress.installed===true||weapon.stages.every(s=>progress.stages[s.id]==='done')||(stage&&stage.challenge.kind!=='installation'))continue;
  const pending=planRecipe(undefined,1,p.stock,goal.id);pending.kind='installation';pending.title=weapon.name+'安装清单';pending.prerequisites=['本体、适配器及地图开放需在游戏核对'];pending.issues=[];
  if(progress.installed===null)pending.issues.push('是否已安装未知，不能确定本次安装需求');else if(!weapon.installCost.length)pending.issues.push('本武器安装材料未整理');else{pending.lines=weapon.installCost.map(x=>line(x.materialId,positiveInteger(x.quantity)&&x.sourceIds.length?x.quantity:null,p.stock));if(pending.lines.some(l=>l.required===null))pending.issues.push('安装用量待核');}
  pending.requirementsComplete=!pending.issues.length;pending.materialState=materialState(pending.lines,pending.requirementsComplete);plans.push(pending);
 }return plans;
}
export function craftingGoals(c:Readonly<CraftingCatalog>,p:CraftingProfile):GoalDefinition[]{return Object.keys(p.craftingTargets??{}).map(id=>({id:craftGoalId(id),title:(c.recipes.find(r=>r.id===id)?.title??'旧制作引用待匹配')+' · 本次制作',summary:'计划是新制作产出，不扣除现有成品；完成不自动增减库存。',kind:'crafting',recipeId:id,treeNodeIds:[]}));}
