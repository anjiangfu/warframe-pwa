import type {ProfileDocument} from './model';
import {editWeaponProgress,materialDeficit,progressOf,type WeaponCatalog} from './weapon';
export type GoalState='focused'|'done'|'deferred';
export interface PersonalFact {value:boolean|number|null;recordedAt:string;originalLabel?:string;entityId?:string|null}
export interface GoalDefinition {id:string;title:string;summary:string;kind:'weapon'|'installation';weaponId?:string;factId?:string;treeNodeIds:string[]}
export interface GoalCatalog {catalogVersion:string;goals:GoalDefinition[]}
export interface GoalEvaluation {kind:'completed'|'deferred'|'operation'|'missing-item'|'missing-material'|'unknown'|'ready';action:string;reason:string;unknowns:string[];stageId?:string;materials:{id:string;required:number;owned:number|null;deficit:number|null}[]}
export function evaluateGoal(goal:GoalDefinition,p:ProfileDocument,c:Readonly<WeaponCatalog>):GoalEvaluation {
 const result=(kind:GoalEvaluation['kind'],action:string,reason:string,unknowns:string[]=[],materials:GoalEvaluation['materials']=[],stageId?:string):GoalEvaluation=>({kind,action,reason,unknowns,materials,...stageId?{stageId}:{}});
 const state=p.goalStates?.[goal.id];
 if(state==='done')return result('completed','整体目标已由你声明完成；可随时恢复关注','整体声明不代表所有游戏事实或分项已填写。');
 if(state==='deferred')return result('deferred','暂缓，恢复关注后再列入待办','保留全部已有细节与库存。');
 if(goal.kind==='installation'){
  const fact=goal.factId?p.personalFacts?.[goal.factId]:undefined;
  if(fact?.value===true)return result('completed','已记录安装，不再建议重复制作或采集','这是手工声明，不推断其他任务或功能开放。',fact.originalLabel&&!fact.entityId?['用户原称的准确模块实体尚未关联']:[]);
  return result(fact?.value===false?'missing-item':'unknown',fact?.value===false?'打开游戏核对未安装模块的蓝图和实际制作要求':'先核对是否已经安装，再填写手工声明','没有经过核验的制作清单，不生成虚构材料差值。',['实际制作要求、地图开放和其他解锁状态未确认']);
 }
 const weapon=c.weapons.find(w=>w.id===goal.weaponId);if(!weapon)return result('unknown','保留旧目标记录，等待匹配资料','目录引用未匹配，个人数据不会被删除。');
 const progress=progressOf(p,weapon.id),current=weapon.stages.find(s=>s.id===progress.currentStageId);
 if(weapon.stages.every(s=>progress.stages[s.id]==='done'))return result('completed','已记录全部阶段完成','保留独立的本体、适配器和安装声明。');
 if(current&&current.challenge.kind!=='installation'){
  const candidates=weapon.stages.slice(weapon.stages.indexOf(current)+(progress.stages[current.id]==='done'?1:0));const next=candidates.find(s=>progress.stages[s.id]!=='done');
  return next?result('operation','先按下方操作指引试做，再核对游戏计数',next.challenge.description,['前序具体完成、安装状态以你的记录为准；不阻止查看','应用不读取游戏计数'],[],next.id):result('unknown','当前所选阶段已完成，可核对其余未知记录','不自动补写前序阶段。');
 }
 if(progress.installed===true)return result('unknown','选择当前在做的进化，直接查看操作攻略','已安装，无需重新采集安装材料。',['当前挑战进度尚未填写']);
 if(progress.owned===false||progress.adapterOwned===false)return result('missing-item',progress.owned===false?'查看本体获取摘要并核对持有':'查看适配器获取摘要并核对持有','已明确记录缺少物品；不臆测当前轮换。');
 if(progress.installed===null||progress.owned===null||progress.adapterOwned===null)return result('unknown','先核对本体、适配器及安装情况，或选择正在做的进化','未知不代表未拥有，不重复安排从零养成。',['拥有及安装情况未完整填写']);
 const materials=weapon.installCost.map(x=>({id:x.materialId,required:x.quantity,owned:p.stock[x.materialId]??null,deficit:materialDeficit(x.quantity,p.stock[x.materialId])}));
 if(!materials.length)return result('unknown','在游戏安装界面核对材料；当前目录未整理此清单','不把其他武器的安装材料套用到本目标。');
 const unknowns=materials.filter(x=>x.owned===null).map(x=>`${c.materials.find(m=>m.id===x.id)?.name??x.id}持有量未知`);
 if(materials.some(x=>x.deficit!==null&&x.deficit>0))return result('missing-material','查看已知缺项的获取方式；其余未知库存先核对','只计算列明用量与同一份stock的差，不分配或扣除。',unknowns,materials);
 if(unknowns.length)return result('unknown','填写材料持有量后再核对差值','持有量未知不能按0处理。',unknowns,materials);
 return result('ready','在游戏安装界面核对并安装；安装后手工更新记录','已知库存满足参考用量，不代表其他游戏前提已满足。',['实际地图与任务前提未核对'],materials);
}
export function pendingGoals(goals:readonly GoalDefinition[],p:ProfileDocument,c:Readonly<WeaponCatalog>){return goals.filter(g=>!['completed','deferred'].includes(evaluateGoal(g,p,c).kind)).sort((a,b)=>Number(p.goalStates?.[b.id]==='focused')-Number(p.goalStates?.[a.id]==='focused'));}
type DraftPatch={kind:'goal';id:string;value:GoalState}|{kind:'fact';id:string;value:PersonalFact['value'];originalLabel?:string;entityId?:string|null}|{kind:'stage';id:string;value:string};
export interface DraftRow {id:string;label:string;before:string;after:string;conflict:boolean;patch:DraftPatch}
export interface ProgressPreview {profileId:string;revision:number;rows:DraftRow[]}
function patchValue(p:ProfileDocument,patch:DraftPatch):unknown {
 if(patch.kind==='goal')return p.goalStates?.[patch.id];if(patch.kind==='stage')return p.weaponProgress?.[patch.id]?.currentStageId??undefined;
 const fact=p.personalFacts?.[patch.id];return fact?{value:fact.value,originalLabel:fact.originalLabel??null,entityId:fact.entityId??null}:undefined;
}
function targetValue(patch:DraftPatch){return patch.kind==='fact'?{value:patch.value,originalLabel:patch.originalLabel??null,entityId:patch.entityId??null}:patch.value;}
export function previewProgress(p:ProfileDocument,moduleEntity:string|null):ProgressPreview {
 if(moduleEntity!==null&&moduleEntity!=='system:helminth-archon-shard-segment')throw Error('模块候选无效');
 const changes:{label:string;patch:DraftPatch}[]=[
  {label:'大嘴安装声明',patch:{kind:'fact',id:'system:helminth:installed',value:true}},
  {label:'原力石模块安装声明（保留原称）',patch:{kind:'fact',id:'declaration:shard-module:installed',value:true,originalLabel:'原力石模块',entityId:moduleEntity}},
  {label:'毒囊双枪整体养成完成',patch:{kind:'goal',id:'goal:dual-toxocyst',value:'done'}},
  {label:'海波单剑设为关注目标',patch:{kind:'goal',id:'goal:nami-solo',value:'focused'}},
  {label:'海波单剑当前阶段IV（不补I—III）',patch:{kind:'stage',id:'weapon:nami-solo',value:'nami-solo:iv'}},
  {label:'1999手工等级',patch:{kind:'fact',id:'syndicate:hex:rank',value:3}},
  {label:'其他集团进展中，具体数据未知',patch:{kind:'fact',id:'syndicates:others:progressing',value:true}}
 ];
 return {profileId:p.id,revision:p.revision,rows:changes.map(({label,patch})=>{const before=patchValue(p,patch),after=targetValue(patch);return {id:patch.kind+':'+patch.id,label,before:before===undefined?'未填写 / 未知':JSON.stringify(before),after:JSON.stringify(after),conflict:before!==undefined&&JSON.stringify(before)!==JSON.stringify(after),patch};})};
}
export function applyProgress(p:ProfileDocument,preview:ProgressPreview,selected:string[],at:string):ProfileDocument {
 if(p.id!==preview.profileId||p.revision!==preview.revision)throw Error('预览后档案已改变，请重新预览。');
 if(!selected.length||new Set(selected).size!==selected.length||selected.some(id=>!preview.rows.some(r=>r.id===id)))throw Error('请选择有效草案项目');
 const next=structuredClone(p);
 for(const row of preview.rows.filter(r=>selected.includes(r.id))){const x=row.patch;if(x.kind==='goal'){next.goalStates??={};next.goalStates[x.id]=x.value;}else if(x.kind==='stage')editWeaponProgress(next,x.id,s=>{s.currentStageId=x.value;});else{next.personalFacts??={};next.personalFacts[x.id]={value:x.value,recordedAt:at,...x.originalLabel?{originalLabel:x.originalLabel}:{},...x.entityId!==undefined?{entityId:x.entityId}:{}};}}
 return next;
}
