// Project catalog contract. Raw third-party shapes are confined to the manual audit adapter.
export type RelicVerification='snapshot-checked'|'unverified'|'conflicting';
type Named={id:string;name:string;english:string;nameStatus:'verified'|'unverified';display?:RelicDisplay};
type Evidence={verification:RelicVerification;sourceIds:string[]};
export interface RelicDisplay extends Evidence {nameZh:string;aliases:string[];upstreamIds:string[];properNameUntranslated:boolean;typeGlossary?:boolean}
export interface RelicRouteRule extends Evidence {id:string;title:string;scope:string;steps:string[];rotationNotes:Record<string,string>;rotationVerification:RelicVerification;limitations:string[]}
export interface RelicLocationGuide {entry:string;entryVerification:RelicVerification;baseMode:string;modeVerification:RelicVerification;extraCategory:string;ruleId:string;triggerVerification:RelicVerification;sourceIds:string[];pending:string[];exception?:Evidence&{text:string}}
export interface RelicSource {id:string;url:string;checkedAt:string|null;snapshotAt:string|null;label?:string}
export interface Relic extends Named {tier:string;code:string;expectedRewards:number|null;rewardCompleteness:'complete'|'partial'|'unknown';availability:'unknown';sourceScope:'partial'|'unknown';sourceIds:string[]}
export interface RelicReward extends Named {upstreamId:string|null;type:'blueprint'|'component'|'item'|'unknown';bundleOf?:{rewardId:string;quantity:number}}
export interface RelicRelation extends Evidence {id:string;relicId:string;rewardId:string;refinement:string;openingChancePercent:number|null}
export interface RelicLocation {id:string;planet:string;node:string;mode:string;modeZh:string;condition:string|null;sourceIds:string[];display?:RelicDisplay;guide?:RelicLocationGuide}
export interface RelicAcquisition extends Evidence {id:string;relicId:string;locationId:string;rotation:string|null;dropChancePercent:number|null;availability:'unknown'}
export interface RelicCatalog {catalogVersion:string;upstreamCommit:string;sources:RelicSource[];relics:Relic[];rewards:RelicReward[];relations:RelicRelation[];locations:RelicLocation[];acquisitions:RelicAcquisition[];routeRules?:RelicRouteRule[]}

export function validateRelicCatalog(value:unknown):asserts value is RelicCatalog {
 const bad=()=>{throw Error('遗物目录字段、身份、引用或核验条件无效');};
 const object=(v:unknown):Record<string,unknown>=>{if(!v||typeof v!=='object'||Array.isArray(v))return bad();return v as Record<string,unknown>;};
 const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
 const date=(v:unknown)=>v===null||typeof v==='string'&&/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(v)&&Number.isFinite(Date.parse(v));
 const nullableText=(v:unknown)=>v===null||text(v);
 const chance=(v:unknown)=>v===null||typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100;
 const named=(r:Record<string,unknown>)=>{if(!text(r.name)||!text(r.english)||!['verified','unverified'].includes(String(r.nameStatus)))bad();};
 const c=object(value);if(!text(c.catalogVersion)||!text(c.upstreamCommit))bad();
 const arrays:Record<string,Record<string,unknown>[]>={};const ids:Record<string,Set<unknown>>={};
 const keys=['sources','relics','rewards','relations','locations','acquisitions'];if(c.routeRules!==undefined)keys.push('routeRules');
 for(const key of keys){
  if(!Array.isArray(c[key]))bad();const rows=(c[key] as unknown[]).map(object),seen=new Set<unknown>();for(const row of rows){if(!text(row.id)||seen.has(row.id))bad();seen.add(row.id);}arrays[key]=rows;ids[key]=seen;
 }
 for(const s of arrays.sources)if(typeof s.url!=='string'||!s.url.startsWith('https://')||!date(s.checkedAt)||!date(s.snapshotAt)||s.label!==undefined&&!text(s.label))bad();
 const references=(row:Record<string,unknown>)=>{if(!Array.isArray(row.sourceIds)||!row.sourceIds.length||new Set(row.sourceIds).size!==row.sourceIds.length||row.sourceIds.some(id=>!ids.sources.has(id)))bad();};
 const evidence=(row:Record<string,unknown>)=>{references(row);if(!['snapshot-checked','unverified','conflicting'].includes(String(row.verification)))bad();if(row.verification==='snapshot-checked'&&(row.sourceIds as string[]).some(id=>!arrays.sources.find(s=>s.id===id)?.checkedAt))bad();};
 const strings=(v:unknown,nonempty=false)=>Array.isArray(v)&&(!nonempty||v.length>0)&&v.every(text);
 const verification=(v:unknown)=>['snapshot-checked','unverified','conflicting'].includes(String(v));
 const display=(r:Record<string,unknown>)=>{if(r.display===undefined)return;const d=object(r.display);evidence(d);if(!text(d.nameZh)||!strings(d.aliases)||!strings(d.upstreamIds,true)||typeof d.properNameUntranslated!=='boolean'||d.typeGlossary!==undefined&&typeof d.typeGlossary!=='boolean')bad();};
 for(const r of arrays.relics){named(r);display(r);references(r);if(!text(r.tier)||!text(r.code)||!['complete','partial','unknown'].includes(String(r.rewardCompleteness))||r.availability!=='unknown'||!['partial','unknown'].includes(String(r.sourceScope))||!(r.expectedRewards===null||typeof r.expectedRewards==='number'&&Number.isSafeInteger(r.expectedRewards)&&r.expectedRewards>0))bad();}
 const upstreamIds=new Set<unknown>();for(const r of arrays.rewards){named(r);display(r);if(!nullableText(r.upstreamId)||!['blueprint','component','item','unknown'].includes(String(r.type))||r.upstreamId!==null&&upstreamIds.has(r.upstreamId))bad();if(r.upstreamId!==null)upstreamIds.add(r.upstreamId);}
 for(const r of arrays.rewards)if(r.bundleOf!==undefined){const b=object(r.bundleOf),target=arrays.rewards.find(x=>x.id===b.rewardId);if(!target||target===r||target.bundleOf!==undefined||target.type!==r.type||typeof b.quantity!=='number'||!Number.isSafeInteger(b.quantity)||b.quantity<2)bad();}
 for(const rule of arrays.routeRules??[]){evidence(rule);if(!text(rule.title)||!text(rule.scope)||!strings(rule.steps,true)||!strings(rule.limitations)||!verification(rule.rotationVerification)||!Object.values(object(rule.rotationNotes)).every(text))bad();}
 for(const l of arrays.locations){references(l);display(l);if(![l.planet,l.node,l.mode,l.modeZh].every(text)||!nullableText(l.condition))bad();if(l.guide!==undefined){const g=object(l.guide);references(g);if(![g.entry,g.baseMode,g.extraCategory,g.ruleId].every(text)||!ids.routeRules?.has(g.ruleId)||![g.entryVerification,g.modeVerification,g.triggerVerification].every(verification)||!strings(g.pending))bad();for(const v of [g.entryVerification,g.modeVerification,g.triggerVerification])evidence({...g,verification:v});if(g.exception!==undefined){const x=object(g.exception);evidence(x);if(!text(x.text))bad();}}}
 const pairs=new Set<string>();for(const r of arrays.relations){evidence(r);if(!ids.relics.has(r.relicId)||!ids.rewards.has(r.rewardId)||!text(r.refinement)||!chance(r.openingChancePercent))bad();const key=JSON.stringify([r.relicId,r.rewardId,r.refinement]);if(pairs.has(key))bad();pairs.add(key);}
 for(const a of arrays.acquisitions){evidence(a);if(!ids.relics.has(a.relicId)||!ids.locations.has(a.locationId)||!nullableText(a.rotation)||!chance(a.dropChancePercent)||a.availability!=='unknown')bad();}
 for(const r of arrays.relics)if(r.rewardCompleteness==='complete'){const relations=arrays.relations.filter(x=>x.relicId===r.id&&x.refinement==='Intact');if(relations.length!==r.expectedRewards||!relations.length||relations.some(x=>x.verification!=='snapshot-checked'))bad();}
}

export function createRelicIndex(catalog:Readonly<RelicCatalog>){
 validateRelicCatalog(catalog);
 return {catalog,rewards:new Map(catalog.rewards.map(x=>[x.id,x])),locations:new Map(catalog.locations.map(x=>[x.id,x]))};
}
type Index=ReturnType<typeof createRelicIndex>;
const match=(q:string,...texts:string[])=>texts.join(' ').toLocaleLowerCase().replace(/\s+/g,'').includes(q.toLocaleLowerCase().replace(/\s+/g,''));
const localizedStrings=(r:Named)=>r.display?.verification==='snapshot-checked'?[r.display.nameZh,...r.display.aliases]:[];
export const relicDisplayName=(r:Named)=>r.display?.verification==='snapshot-checked'?`${r.display.nameZh}（${r.english}）`:r.name.includes(r.english)?r.name:`${r.name}（${r.english}）`;
export const searchRelics=(index:Index,query:string,tier='')=>index.catalog.relics.filter(r=>(!tier||r.tier===tier)&&match(query,r.name,r.english,r.code,...localizedStrings(r)));
export const searchRewards=(index:Index,query:string)=>index.catalog.rewards.filter(r=>match(query,r.name,r.english,...localizedStrings(r)));
export const rewardRelics=(index:Index,rewardId:string)=>index.catalog.relics.filter(r=>index.catalog.relations.some(e=>e.relicId===r.id&&e.rewardId===rewardId));
export function relicDetails(index:Index,relicId:string){
 const relic=index.catalog.relics.find(x=>x.id===relicId);if(!relic)return;
 return {relic,rewards:index.catalog.relations.filter(x=>x.relicId===relicId).map(relation=>({relation,reward:index.rewards.get(relation.rewardId)!})),routes:index.catalog.acquisitions.filter(x=>x.relicId===relicId).map(link=>({link,location:index.locations.get(link.locationId)!}))};
}
export function resolveRelicGuide(catalog:Readonly<RelicCatalog>,locationId:string,rotation:string|null){
 const guide=catalog.locations.find(l=>l.id===locationId)?.guide,rule=catalog.routeRules?.find(r=>r.id===guide?.ruleId);if(!guide||!rule)return;
 const note=rotation?rule.rotationNotes[rotation]:undefined;
 return {guide,rule,rotationText:note??'该表索引的触发未核，请按任务奖励界面确认；不按轮数推算。',rotationVerification:note?rule.rotationVerification:'unverified' as RelicVerification};
}
