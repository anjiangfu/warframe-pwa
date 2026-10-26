import {createRelicIndex,rewardRelics,type RelicCatalog,type RelicReward} from './relics';
import {matchesSourceCheckFilter,type RelicSourceChecks,type SourceCheckFilter} from './relic-source-checks';
export interface EquipmentParent {id:string;english:string;nameZh:string;namePending:boolean;componentIds:string[];sourceIds:string[]}
export interface EquipmentMetadata {schemaVersion:1;catalogVersion:string;relicCatalogVersion:string;checkedAt:string;sources:{id:string;url:string;sha256:string}[];parents:EquipmentParent[];excludedRewardIds:string[]}
export interface EquipmentGroup {parent:EquipmentParent;rewards:RelicReward[]}
export interface EquipmentIndex {status:'ready'|'unavailable'|'invalid';groups:EquipmentGroup[];catalog:Readonly<RelicCatalog>;reason?:string}
export function createEquipmentIndex(catalog:Readonly<RelicCatalog>,metadata:unknown):EquipmentIndex {
 const unavailable=(reason:string):EquipmentIndex=>({status:'unavailable',groups:[],catalog,reason});
 if(!metadata)return unavailable('未附装备关联目录；原遗物和奖励查询仍可用。');
 try{
  if(typeof metadata!=='object')throw Error();const m=metadata as EquipmentMetadata;
  if(m.schemaVersion!==1||!Array.isArray(m.parents)||!Array.isArray(m.sources)||!Array.isArray(m.excludedRewardIds))throw Error();
  if(typeof m.catalogVersion!=='string'||!m.catalogVersion||typeof m.relicCatalogVersion!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(m.checkedAt))throw Error();
  if(m.relicCatalogVersion!==catalog.catalogVersion)return unavailable('装备关联目录与此旧目录版本不同；原查询仍可用。');
  const sources=new Set<string>();for(const s of m.sources){if(!s||typeof s.id!=='string'||sources.has(s.id)||!/^https:\/\//.test(s.url)||!/^[a-f0-9]{64}$/.test(s.sha256))throw Error();sources.add(s.id);}
  const groups:EquipmentGroup[]=[],byParent=new Map<string,EquipmentGroup>(),pairs=new Set<string>();
  const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
  for(const p of m.parents){
   if(!p||![p.id,p.english,p.nameZh].every(text)||byParent.has(p.id)||typeof p.namePending!=='boolean'||!Array.isArray(p.componentIds)||!p.componentIds.length||new Set(p.componentIds).size!==p.componentIds.length||!p.componentIds.every(text)||!Array.isArray(p.sourceIds)||!p.sourceIds.length||p.sourceIds.some(s=>!sources.has(s)))throw Error();
   const group={parent:p,rewards:[] as RelicReward[]};groups.push(group);byParent.set(p.id,group);
  }
  const excluded=new Set(m.excludedRewardIds),rewardIds=new Set<string>();if(excluded.size!==m.excludedRewardIds.length)throw Error();
  for(const reward of catalog.rewards){
   if(rewardIds.has(reward.id))throw Error();rewardIds.add(reward.id);if(excluded.has(reward.id))continue;
   const d=reward.display;if(!d||d.verification!=='snapshot-checked'||d.upstreamIds.length!==2||reward.type==='unknown'||reward.bundleOf)throw Error();
   const [parentId,componentId]=d.upstreamIds,group=byParent.get(parentId),key=JSON.stringify([parentId,componentId]);
   if(!group||!group.parent.componentIds.includes(componentId)||pairs.has(key))throw Error();pairs.add(key);group.rewards.push(reward);
  }
  if(!groups.length||[...excluded].some(id=>!rewardIds.has(id))||groups.some(g=>g.rewards.length!==g.parent.componentIds.length))throw Error();
  return {status:'ready',groups,catalog};
 }catch{return {status:'invalid',groups:[],catalog,reason:'装备关联资料缺失或有冲突，暂不展示分组；原遗物和奖励查询仍可用。'};}
}
export function filterEquipment(index:EquipmentIndex,query:string,checks?:Readonly<RelicSourceChecks>,filter:SourceCheckFilter='all'){
 const normalize=(s:string)=>s.toLocaleLowerCase().replace(/\s+/g,'');const q=normalize(query),relics=createRelicIndex(index.catalog);
 return index.groups.filter(g=>normalize(g.parent.nameZh+' '+g.parent.english).includes(q)).map(group=>({group,total:group.rewards.length,visible:group.rewards.filter(reward=>filter==='all'||rewardRelics(relics,reward.id).some(r=>matchesSourceCheckFilter(index.catalog,checks,r.id,filter)))})).filter(x=>filter==='all'||x.visible.length>0);
}
