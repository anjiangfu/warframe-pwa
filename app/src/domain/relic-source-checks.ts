import type {RelicCatalog} from './relics';
export type SourceCheckStatus='listed'|'not-listed'|'conflicting'|'unverified';
export type SourceCheckFilter='all'|'listed'|'not-listed'|'pending';
export interface SourceCheckDocument {sourceUrl?:string;disclaimerUrl?:string;sha256?:string|null;bytes?:number;publishedAt?:string|null;retrievedAt?:string|null;checkedAt?:string|null;scope?:string;accessMode?:string;attribution?:string;limitations?:string}
export interface AcquisitionCheck {acquisitionId:string;status?:SourceCheckStatus;reason?:string;locator?:{section?:string;heading?:string;rotation?:string|null;item?:string};tableRead?:boolean;rotationRead?:boolean;matchCount?:number;rowOrdinals?:number[]}
export interface RelicSourceChecks {schemaVersion:1;checkVersion:string;catalogVersion:string;document?:SourceCheckDocument;records:AcquisitionCheck[]}
export const OFFICIAL_DROP_URL='https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html';
const statuses=['listed','not-listed','conflicting','unverified'];
const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
const day=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d\d-\d\d$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const timestamp=(v:unknown)=>typeof v==='string'&&day(v.slice(0,10))&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
const optional=(v:unknown,check:(v:unknown)=>boolean)=>v===undefined||v===null||check(v);
export function validateSourceChecks(value:unknown,catalog:Readonly<RelicCatalog>):asserts value is RelicSourceChecks{
 const bad=()=>{throw Error('来源核验附件字段或引用无效');};
 const obj=(v:unknown):Record<string,unknown>=>{if(!v||typeof v!=='object'||Array.isArray(v))return bad();return v as Record<string,unknown>;};
 const a=obj(value);if(a.schemaVersion!==1||!text(a.checkVersion)||!text(a.catalogVersion)||!Array.isArray(a.records))bad();
 if(a.document!==undefined){const d=obj(a.document);for(const k of ['sourceUrl','disclaimerUrl'])if(!optional(d[k],v=>typeof v==='string'&&v.startsWith('https://')))bad();if(!optional(d.publishedAt,day))bad();for(const k of ['retrievedAt','checkedAt'])if(!optional(d[k],timestamp))bad();if(!optional(d.sha256,v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v)))bad();if(!optional(d.bytes,v=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0))bad();for(const k of ['scope','accessMode','attribution','limitations'])if(!optional(d[k],text))bad();}
 const ids=new Set<string>();for(const value of a.records as unknown[]){const r=obj(value);if(typeof r.acquisitionId!=='string'||ids.has(r.acquisitionId)||!catalog.acquisitions.some(a=>a.id===r.acquisitionId))bad();ids.add(r.acquisitionId as string);if(!optional(r.status,v=>typeof v==='string'&&statuses.includes(v))||!optional(r.reason,text))bad();for(const k of ['tableRead','rotationRead'])if(!optional(r[k],v=>typeof v==='boolean'))bad();if(!optional(r.matchCount,v=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0))bad();if(r.rowOrdinals!==undefined&&(!Array.isArray(r.rowOrdinals)||r.rowOrdinals.some(n=>!Number.isSafeInteger(n)||n<0)))bad();if(r.locator!==undefined){const l=obj(r.locator);for(const k of ['section','heading','rotation','item'])if(!optional(l[k],text))bad();}}
}
export function effectiveSourceCheck(catalog:Readonly<RelicCatalog>,attachment:Readonly<RelicSourceChecks>|undefined,acquisitionId:string){
 const record=attachment?.records?.find(r=>r.acquisitionId===acquisitionId),document=attachment?.document;
 const result=(status:SourceCheckStatus,reason:string)=>({status,reason,record,document});
 if(!record)return result('unverified','no-record');
 if(attachment?.catalogVersion!==catalog.catalogVersion)return result('unverified','catalog-mismatch');
 if(!document||document.sourceUrl!==OFFICIAL_DROP_URL||!document.sha256||!/^[a-f0-9]{64}$/.test(document.sha256)||!day(document.publishedAt)||!timestamp(document.retrievedAt)||!timestamp(document.checkedAt)||document.scope!=='pc-international'||!['downloaded','fixed-local'].includes(document.accessMode??''))return result('unverified','missing-evidence');
 const a=catalog.acquisitions.find(a=>a.id===acquisitionId),l=catalog.locations.find(l=>l.id===a?.locationId),r=catalog.relics.find(r=>r.id===a?.relicId);if(!a||!l||!r)return result('unverified','identity-mismatch');
 const heading=`${l.planet}/${l.node}${l.mode==='Caches'&&l.node.endsWith(' (Caches)')?'':` (${l.mode})`}`,locator=record.locator;
 if(!locator||locator.section!=='missionRewards'||locator.heading!==heading||locator.rotation!==a.rotation||locator.item!==r.english)return result('unverified','identity-mismatch');
 if(record.status==='unverified'||!record.status)return result('unverified',record.reason??'missing-evidence');
 if(!record.tableRead||!record.rotationRead)return result('unverified','table-not-read');
 if(record.status==='listed'&&record.matchCount===1)return result('listed',record.reason??'exact-row');
 if(record.status==='not-listed'&&record.matchCount===0)return result('not-listed',record.reason??'missing-row');
 if(record.status==='conflicting')return result('conflicting',record.reason??'conflicting');
 return result('unverified','inconsistent-proof');
}
export const sourceCheckMatches=(status:SourceCheckStatus,filter:SourceCheckFilter)=>filter==='all'||filter==='pending'&&(status==='unverified'||status==='conflicting')||status===filter;
export function matchesSourceCheckFilter(catalog:Readonly<RelicCatalog>,checks:Readonly<RelicSourceChecks>|undefined,relicId:string,filter:SourceCheckFilter){
 if(filter==='all')return true;const routes=catalog.acquisitions.filter(a=>a.relicId===relicId);if(!routes.length)return filter==='pending';return routes.some(a=>sourceCheckMatches(effectiveSourceCheck(catalog,checks,a.id).status,filter));
}
