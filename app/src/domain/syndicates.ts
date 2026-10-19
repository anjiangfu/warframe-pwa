import type {ProfileDocument,ConditionState} from './model';
import type {CheckedAmount,RequirementLine} from './crafting';
export interface RankStep {id:string;from:number;to:number;standing:CheckedAmount;sacrifices:(CheckedAmount&{resourceId:string})[];conditions:{finale:boolean;likedForFinale:boolean;verification:CheckedAmount['verification'];sourceIds:string[];checkedAt:string}}
export interface SyndicateDefinition {id:string;name:string;english:string;maxRank:number;rankFactId:string;standingFactId:string;finaleFactId:string;members:{id:string;name:string;english:string;factId:string}[];steps:RankStep[];sourceIds:string[];guidance:{standing:string;relations:string;task:string}}
export interface SyndicateCatalog {catalogVersion:string;syndicates:SyndicateDefinition[]}
export type SyndicateProfile=ProfileDocument&{syndicateTargets?:Record<string,number>};
export const syndicateGoalId=(id:string)=>'goal:'+id;
const integer=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
const proven=(v:{verification:string;sourceIds:string[];checkedAt:string})=>v.verification==='verified'&&v.sourceIds.length>0&&!!v.checkedAt;
const amount=(v:CheckedAmount)=>proven(v)&&integer(v.quantity)?v.quantity:null;
const state=(values:ConditionState[]):ConditionState=>values.includes('unmet')?'unmet':values.includes('unknown')?'unknown':'satisfied';
export interface RankCondition {state:ConditionState;applies:boolean;reason:string}
export interface RankEvaluation {mode:'no-target'|'unknown'|'inactive'|'reached'|'next';definition?:SyndicateDefinition;step?:RankStep;rank:number|null;target:number|null;standing:{state:ConditionState;required:number|null;owned:number|null;deficit:number|null};materials:RequirementLine[];materialsState:ConditionState;task:RankCondition;relations:RankCondition;issues:string[];requirementsComplete:boolean;ready:boolean;action:string}
export function evaluateSyndicate(c:Readonly<SyndicateCatalog>,p:SyndicateProfile,id:string,previewTarget?:number|null):RankEvaluation {
 const d=c.syndicates.find(s=>s.id===id),rawRank=d?p.personalFacts?.[d.rankFactId]?.value:undefined,rawTarget=previewTarget===undefined?p.syndicateTargets?.[id]:previewTarget,rawStanding=d?p.personalFacts?.[d.standingFactId]?.value:undefined;
 const rank=d&&integer(rawRank)&&rawRank<=d.maxRank?rawRank:null,target=d&&integer(rawTarget)&&rawTarget>=1&&rawTarget<=d.maxRank?rawTarget:null;
 const r:RankEvaluation={mode:'unknown',definition:d,rank,target,standing:{state:'unknown',required:null,owned:integer(rawStanding)?rawStanding:null,deficit:null},materials:[],materialsState:'unknown',task:{state:'unknown',applies:false,reason:'尚未确定当前晋升'},relations:{state:'unknown',applies:false,reason:'尚未确定当前晋升'},issues:[],requirementsComplete:false,ready:false,action:'核对当前等级及目标；未知不按0处理。'};
 if(!d){r.issues.push('集团目录引用未匹配，旧记录保留');return r;}
 if(previewTarget===undefined&&['done','deferred'].includes(p.goalStates?.[syndicateGoalId(id)]??'')){r.mode='inactive';r.action='目标已完成或暂缓，不加入当前需求；恢复关注后按最新记录计算。';return r;}
 if(rawTarget==null){r.mode='no-target';r.action='先核对当前等级，并显式设置目标等级；查询不会创建目标。';return r;}
 if(target===null){r.issues.push('目标等级异常，旧值保留，请核对');return r;}
 if(rank===null){r.issues.push(rawRank==null?'当前等级未知':'旧等级异常，原值保留，请手工核对');return r;}
 if(rank>=target){r.mode='reached';r.requirementsComplete=true;r.action='目标等级已达到，不再安排晋升；不会自动更改完成声明。';return r;}
 const step=d.steps.find(s=>s.from===rank&&s.to===rank+1);if(!step){r.issues.push('当前相邻晋升资料缺失');return r;}r.mode='next';r.step=step;
 const needed=amount(step.standing),owned=r.standing.owned,deficit=needed===null||owned===null?null:Math.max(0,needed-owned);r.standing={required:needed,owned,deficit,state:deficit===null?'unknown':deficit>0?'unmet':'satisfied'};if(needed===null)r.issues.push('本次晋升声望消耗待核');
 r.materials=step.sacrifices.map(x=>{const required=amount(x),owned=integer(p.stock[x.resourceId])?p.stock[x.resourceId]:null;if(required===null)r.issues.push(x.resourceId+'祭品用量待核');return {resourceId:x.resourceId,required,owned,deficit:required===null||owned===null?null:Math.max(0,required-owned)};});
 if(!r.materials.length)r.issues.push('本次晋升祭品清单缺失');r.materialsState=state(r.materials.map(l=>l.deficit===null?'unknown':l.deficit>0?'unmet':'satisfied'));
 const task=p.personalFacts?.[d.finaleFactId]?.value;
 if(!proven(step.conditions)){r.issues.push('任务/关系条件资料待核');r.task={state:'unknown',applies:true,reason:'条件资料待核'};r.relations={...r.task};}
 else{
  r.task={state:!step.conditions.finale?'satisfied':task===true?'satisfied':task===false?'unmet':'unknown',applies:step.conditions.finale,reason:step.conditions.finale?'只核对终章完成声明，不从关系或等级反推':'本次晋升未列额外终章条件；地图入口仍需游戏核对'};
  const statuses=d.members.map(m=>{const value=p.personalFacts?.[m.factId]?.value;return value===true?'satisfied':value===false?'unmet':'unknown';});
  r.relations={state:!step.conditions.likedForFinale||task===true?'satisfied':d.members.length?state(statuses):'unknown',applies:step.conditions.likedForFinale,reason:!step.conditions.likedForFinale?'本次未列新增关系门槛':task===true?'已声明终章完成，不再建议重新刷关系；六人记录保持独立':'六人至少喜欢（Liked）用于准备终章；恋爱不是必需条件'};
 }
 r.requirementsComplete=r.issues.length===0;r.ready=r.requirementsComplete&&[r.standing.state,r.materialsState,r.task.state,r.relations.state].every(x=>x==='satisfied');
 r.action=!r.requirementsComplete?'先核对待核资料，当前不能给完整晋升结论。':r.relations.state!=='satisfied'?'前往KIM核对六人档案，完成介绍对话后核对对应赏金；为终章准备关系。':r.task.state!=='satisfied'?'在后房核对六人组终章入口与完成情况；不重复已完成任务。':r.standing.state==='unknown'?'核对当前可用声望点数；未兑换的珍品不是现有声望。':r.standing.state==='unmet'?'前往商场核对可参加的赏金；声望增加后手工更新点数。':r.materialsState!=='satisfied'?'核对祭品持有量，点击材料查看获取方式；共享需求以合计为准。':'已知条件记录满足，请在游戏晋升面板确认；实际晋升后手工更新等级与余额。';return r;
}
export interface RankupContribution {id:string;title:string;kind:'syndicate';lines:RequirementLine[];issues:string[];prerequisites:string[];requirementsComplete:boolean}
export function syndicateContributions(c:Readonly<SyndicateCatalog>,p:SyndicateProfile):RankupContribution[]{return Object.keys(p.syndicateTargets??{}).flatMap(id=>{const r=evaluateSyndicate(c,p,id);if(['inactive','reached','no-target'].includes(r.mode))return [];return [{id:syndicateGoalId(id),title:(r.definition?.name??'旧集团引用待匹配')+' · 下一次晋升',kind:'syndicate' as const,lines:r.materials,issues:r.issues,prerequisites:['声望、任务与关系条件另外核对；材料足够不代表可以晋升'],requirementsComplete:r.requirementsComplete}];});}
export function setSyndicateTarget(p:ProfileDocument,d:SyndicateDefinition,target:number){
 if(!integer(target)||target<1||target>d.maxRank)throw Error('目标等级超出本集团范围');p.syndicateTargets??={};p.syndicateTargets[d.id]=target;p.goalStates??={};p.goalStates[syndicateGoalId(d.id)]??='focused';
}
export type BalanceReview='unreviewed'|'unknown'|'confirmed';
export function saveSyndicateFacts(p:ProfileDocument,d:SyndicateDefinition,rank:number|null,standing:number|null,review:BalanceReview,at:string){
 if(rank!==null&&(!integer(rank)||rank>d.maxRank))throw Error('当前等级请输入本集团范围内整数或留空');if(standing!==null&&!integer(standing))throw Error('当前声望请输入非负安全整数或留空');
 const previousRank=p.personalFacts?.[d.rankFactId]?.value??null,previousStanding=p.personalFacts?.[d.standingFactId]?.value??null;
 if(rank!==previousRank&&(previousRank!==null||previousStanding!==null)&&review==='unreviewed')throw Error('等级已改变，请明确核对声望余额或选择未知，再保存');
 p.personalFacts??={};p.personalFacts[d.rankFactId]={...p.personalFacts[d.rankFactId],value:rank,recordedAt:at};p.personalFacts[d.standingFactId]={...p.personalFacts[d.standingFactId],value:review==='unknown'?null:standing,recordedAt:at};
}
export function setSyndicateCondition(p:ProfileDocument,d:SyndicateDefinition,factId:string,value:boolean|null,at:string){
 if(![d.finaleFactId,...d.members.map(m=>m.factId)].includes(factId)||(value!==null&&typeof value!=='boolean'))throw Error('任务/关系声明无效');p.personalFacts??={};p.personalFacts[factId]={...p.personalFacts[factId],value,recordedAt:at};
}
