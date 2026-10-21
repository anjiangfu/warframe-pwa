import type {ProfileDocument,ConditionState} from './model';
import {evaluateGoal,type GoalCatalog,type GoalDefinition} from './goals';
import {craftGoalId,craftingGoals,currentRequirements,summarizePlans,type CraftingCatalog} from './crafting';
import {evaluateSyndicate,syndicateGoalId,syndicateGoals,type SyndicateCatalog} from './syndicates';
import type {Acquisition,WeaponCatalog} from './weapon';
import type {ResourceCatalog} from './resources';
import type {MaterialSource} from './material-reference';

export interface ActionCatalogs {goals:Readonly<GoalCatalog>;weapons:Readonly<WeaponCatalog>;crafting:Readonly<CraftingCatalog>;syndicates:Readonly<SyndicateCatalog>;resources:Readonly<ResourceCatalog>}
export interface ActionItem {
 id:string;title:string;goal?:GoalDefinition;focused:boolean;next:string;reason:string;entry:string;unknowns:string[];stageId?:string;
 materials:{id:string;title:string;source?:MaterialSource}[];candidate?:Acquisition;conditions?:{label:string;state:ConditionState;text?:string}[];
}
export function deriveActions(p:ProfileDocument,c:ActionCatalogs){
 const definitions=[...new Map([...c.goals.goals,...craftingGoals(c.crafting,p),...syndicateGoals(c.syndicates,p)].map(g=>[g.id,g])).values()];
 const items:ActionItem[]=[],notices:string[]=[];
 const materialName=(id:string)=>c.resources.resources.find(r=>r.id===id)?.name??id+'（资料待匹配）';
 const addUnknown=(id:string,title:string)=>{if(!items.some(x=>x.id===id))items.push({id,title,focused:p.goalStates?.[id]==='focused',next:'核对保留的旧引用，不生成确定刷取任务',reason:'当前目录未匹配，原记录仍保留。',entry:'备份与恢复 · 完整备份核对入口',unknowns:['目录关联与需求未知，不按0处理'],materials:[]});};
 for(const g of definitions){
  const recorded=p.goalStates?.[g.id]==='focused'||g.kind==='crafting'&&p.craftingTargets?.[g.recipeId??'']!==undefined||g.kind==='syndicate'&&p.syndicateTargets?.[g.syndicateId??'']!==undefined||!!(g.factId&&p.personalFacts?.[g.factId])||!!(g.weaponId&&p.weaponProgress?.[g.weaponId]);
  if(!recorded)continue;
  const result=evaluateGoal(g,p,c.weapons,c.crafting,c.syndicates);
  if(['completed','deferred'].includes(result.kind)){if(result.kind==='completed')notices.push(...result.unknowns.map(t=>g.title+'：'+t));continue;}
  const item:ActionItem={id:g.id,title:g.title,goal:g,focused:p.goalStates?.[g.id]==='focused',next:result.action,reason:result.reason,entry:'现有目标详情 · 游戏核对入口',unknowns:[...result.unknowns,'地图与任务开放尚未确认，材料够用不等于可以进入或完成'],materials:[],stageId:result.stageId};
  const rankup=g.syndicateId?evaluateSyndicate(c.syndicates,p,g.syndicateId):undefined;
  if(rankup){
   item.entry='集团晋升 · '+(rankup.step?`${rankup.step.from} → ${rankup.step.to}`:'当前步骤待核')+' · 四类条件核对';
   item.conditions=[{label:'声望',state:rankup.standing.state},{label:'祭品与货币',state:rankup.materialsState},{label:'任务',state:rankup.task.state,...!rankup.task.applies?{text:'本步未列新增条件'}:{}},{label:'关系',state:rankup.relations.state,...!rankup.relations.applies?{text:'本步未列新增条件'}:{}}];
   for(const condition of item.conditions)if(condition.state==='unknown')item.unknowns.push(condition.label+'记录或资料未知');
   for(const line of rankup.materials)if(line.owned===null)item.unknowns.push(materialName(line.resourceId)+'持有量未知');
  }else if(g.kind==='crafting')item.entry='制作缺口 · 游戏铸造厂前提核对';
  const weapon=c.weapons.weapons.find(w=>w.id===g.weaponId),stage=weapon?.stages.find(s=>s.id===result.stageId);
  if(stage){item.entry='现有进化攻略 · '+stage.label;item.candidate=c.weapons.acquisitions.find(a=>stage.locationIds.includes(a.id));}
  item.materials=result.materials.filter(m=>m.deficit===null||m.deficit>0).map(m=>({id:m.id,title:materialName(m.id),...g.kind==='crafting'?{source:{kind:'assistant' as const,goalId:g.id}}:g.kind==='syndicate'&&rankup?.step?{source:{kind:'syndicate' as const,syndicateId:g.syndicateId!,stepId:rankup.step.id}}:{}}));
  if(!item.candidate&&item.materials.length){const resource=c.resources.resources.find(r=>r.id===item.materials[0].id);item.candidate=c.resources.acquisitions.find(a=>resource?.acquisitionIds[0]===a.id);}
  item.unknowns=[...new Set(item.unknowns.map(text=>{for(const resource of [...c.resources.resources].sort((a,b)=>b.id.length-a.id.length))text=text.split(resource.id).join(resource.name+'（'+resource.english+'）');return text;}))];items.push(item);
 }
 for(const [id,state] of Object.entries(p.goalStates??{}))if(state==='focused'&&!definitions.some(g=>g.id===id))addUnknown(id,'旧目标引用待匹配 · '+id);
 for(const id of Object.keys(p.weaponProgress??{}))if(!definitions.some(g=>g.weaponId===id)&&!['done','deferred'].includes(p.goalStates?.['record:'+id]??''))addUnknown('record:'+id,'旧武器引用待匹配 · '+id);
 const order=[...c.goals.goals.filter(g=>!['crafting','syndicate'].includes(g.kind)).map(g=>g.id),...c.crafting.recipes.map(r=>craftGoalId(r.id)),...c.syndicates.syndicates.map(s=>syndicateGoalId(s.id))];
 items.sort((a,b)=>Number(b.focused)-Number(a.focused)||(order.includes(a.id)?order.indexOf(a.id):Infinity)-(order.includes(b.id)?order.indexOf(b.id):Infinity)||(a.id<b.id?-1:a.id>b.id?1:0));
 const contributions=currentRequirements(c.crafting,p,c.weapons,c.goals,c.syndicates),summary=summarizePlans(contributions,p.stock);
 return {items,notices:[...new Set(notices)],dailyMinutes:p.dailyMinutes,resourceNames:Object.fromEntries(c.resources.resources.map(r=>[r.id,r.name+'（'+r.english+'）'])),summary,contributors:contributions.map(x=>({id:x.id,title:x.title}))};
}
