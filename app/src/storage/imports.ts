import stepMap from '../catalog/legacy-step-map.v1.json';
import type {DataProvider} from '../catalog/provider';
import {SCHEMA_VERSION,RESOURCE_NAMES,type ProfileDocument,type Catalog,type Original,type Status} from '../domain/model';
export interface ImportPreview {hash:string; format:'legacy'|'backup'; profile:ProfileDocument; original:Original; counts:Record<string,number>; warnings:string[]}
export const BACKUP_LIMITS=Object.freeze({fileBytes:8*1024*1024,payloadBytes:8*1024*1024-2048,metadataText:100,depth:20,values:50000});
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function fail(text:string):never {throw Error(text);}
function record(v:unknown,label:string):Record<string,unknown>{return object(v)?v:fail(label+'必须是对象');}
function numeric(v:unknown,label:string):number|null {if(v===null)return null;if(typeof v!=='number'||!Number.isFinite(v)||v<0)fail(label+'必须是非负数字或未知');return v;}
function inspect(v:unknown,depth=0,counter={n:0},key=''){
 if(depth>BACKUP_LIMITS.depth||++counter.n>BACKUP_LIMITS.values)fail('数据结构超出限制');
 if(v!==null&&!['object','string','number','boolean'].includes(typeof v))fail('档案只允许可无损备份的JSON数据');
 if(typeof v==='string'&&v.length>(key==='base64'?3000000:100000))fail('文本超过长度限制');
 if(typeof v==='number'&&!Number.isFinite(v))fail('数字不是有限值');
 if(v&&typeof v==='object'){
  if(!Array.isArray(v)&&Object.getPrototypeOf(v)!==Object.prototype&&Object.getPrototypeOf(v)!==null)fail('档案只允许普通JSON对象');
  if(Object.getOwnPropertySymbols(v).length)fail('档案含无法备份的字段');
  if(Array.isArray(v)){for(const x of v)inspect(x,depth+1,counter);}
  else for(const [k,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))fail('数据含危险对象键');inspect(x,depth+1,counter,k);}
 }
}
export function newProfile(catalog:Readonly<Catalog>,id:string,name:string,template:boolean):ProfileDocument {
 const statuses=Object.fromEntries(catalog.nodes.map(n=>[n.goalId,'todo'])) as Record<string,Status>;
 if(template)for(const id of ['origin','torid','valkyr','mr12','blueprint','steel'])statuses[id]='done';
 return {id,revision:0,name,masteryRank:template?12:null,targetRank:template?18:null,dailyMinutes:template?90:null,mainFrame:template?'瓦尔基里（Valkyr）':'',statuses,steps:{},notes:{},stock:Object.fromEntries(Object.keys(RESOURCE_NAMES).map(k=>[k,null])),budget:{},events:[],customNodes:[],legacyArchive:{},originals:[]};
}
export function validateProfile(value:unknown):asserts value is ProfileDocument {
 const p=record(value,'档案');for(const k of ['id','name','mainFrame'])if(typeof p[k]!=='string')fail('档案文字字段无效');
 if((p.id as string).length>BACKUP_LIMITS.metadataText)fail('档案ID超过长度上限');
 if(typeof p.revision!=='number'||!Number.isSafeInteger(p.revision)||p.revision<0)fail('档案revision无效');
 for(const k of ['masteryRank','targetRank','dailyMinutes'])numeric(p[k],k);
 for(const v of Object.values(record(p.statuses,'状态')))if(!['todo','progress','done'].includes(String(v)))fail('节点状态无效');
 for(const v of Object.values(record(p.steps,'步骤')))for(const b of Object.values(record(v,'步骤项')))if(typeof b!=='boolean')fail('步骤必须是布尔值');
 for(const v of Object.values(record(p.notes,'笔记')))if(typeof v!=='string')fail('笔记必须是文本');
 for(const v of Object.values(record(p.stock,'库存')))numeric(v,'库存');
 for(const v of Object.values(record(p.budget,'预算')))for(const n of Object.values(record(v,'预算行')))numeric(n,'预算');
 if(!Array.isArray(p.events)||p.events.some(e=>!object(e)||typeof e.time!=='string'||typeof e.text!=='string'))fail('日志无效');
 record(p.legacyArchive,'旧字段归档');
 if(!Array.isArray(p.originals)||p.originals.some(x=>!object(x)||typeof x.name!=='string'||typeof x.base64!=='string'||typeof x.hash!=='string'||!/^[a-f0-9]{64}$/.test(x.hash)))fail('原件归档无效');
 if(!Array.isArray(p.customNodes))fail('自定义节点无效');const ids=new Set<string>();const allStepIds=new Set<string>();
 for(const n of p.customNodes){if(!object(n)||typeof n.id!=='string'||!/^custom:[a-zA-Z0-9-]+$/.test(n.id)||ids.has(n.id))fail('自定义节点ID无效或重复');ids.add(n.id);for(const k of ['goalId','lane','title','sub','description','priority'])if(typeof n[k]!=='string')fail('自定义节点字段无效');if(n.goalId!==n.id)fail('自定义目标ID无效');for(const k of ['x','y'])if(typeof n[k]!=='number'||!Number.isFinite(n[k]))fail('自定义坐标无效');if(!Array.isArray(n.recommended)||n.recommended.some(x=>typeof x!=='string'))fail('推荐关系无效');if(!Array.isArray(n.steps))fail('自定义步骤无效');for(const s of n.steps){if(!object(s)||typeof s.id!=='string'||!s.id.startsWith('custom:')||typeof s.text!=='string'||allStepIds.has(s.id))fail('自定义步骤ID无效');allStepIds.add(s.id);}}
 inspect(p);
 const payload={...p};delete payload.id;delete payload.revision;
 if(new TextEncoder().encode(JSON.stringify(payload)).length>BACKUP_LIMITS.payloadBytes)fail('档案容量超过上限（8 MiB备份预留2 KiB元数据）；未保存或导出，请保留现有数据');
}
export function bytesToBase64(bytes:Uint8Array):string {let result='';for(let i=0;i<bytes.length;i+=16384)result+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(result);}
export function originalBytes(original:Original):Uint8Array {return Uint8Array.from(atob(original.base64),c=>c.charCodeAt(0));}
export async function parseImport(bytes:Uint8Array,name:string,provider:DataProvider):Promise<ImportPreview>{
 if(bytes.length>BACKUP_LIMITS.fileBytes)fail('备份文件过大（上限8 MiB）');
 let raw:unknown;try{raw=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{fail('JSON损坏或文字编码无效');}
 const obj=record(raw,'存档');const c=provider.getCatalog();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(bytes)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const original={name,hash,base64:bytesToBase64(bytes)};let profile:ProfileDocument;let format:'legacy'|'backup';const warnings:string[]=[];
 if(obj.schemaVersion===SCHEMA_VERSION){format='backup';if(typeof obj.catalogVersion!=='string'||obj.catalogVersion.length>BACKUP_LIMITS.metadataText)fail('目录版本文字无效或超限');inspect(Object.fromEntries(Object.entries(obj).filter(([key])=>key!=='profile')));validateProfile(obj.profile);profile=structuredClone(obj.profile);if(obj.catalogVersion!==c.catalogVersion)warnings.push('备份目录版本不同；未匹配的状态将保留，不会删除。');}
 else if(obj.version===1){
  format='legacy';if(bytes.length>2*1024*1024)fail('旧存档文件过大（上限2 MiB）');inspect(raw);if(typeof obj.rank!=='number'||!Number.isFinite(obj.rank)||obj.rank<0)fail('旧存档段位无效');const statuses=record(obj.statuses,'旧状态'),stock=record(obj.stock,'旧库存');
  profile=newProfile(c,'import','导入的行动档案',false);profile.masteryRank=obj.rank;
  const known=new Set(c.nodes.map(n=>n.id));for(const [id,v]of Object.entries(statuses)){if(!['todo','progress','done'].includes(String(v)))fail('旧存档状态无效');profile.statuses[id]=v as Status;if(!known.has(id))profile.legacyArchive['status:'+id]=v;}
  for(const [id,v]of Object.entries(record(obj.notes??{},'旧笔记'))){if(typeof v!=='string')fail('旧笔记无效');profile.notes[id]=v;if(!known.has(id))profile.legacyArchive['note:'+id]=v;}
  for(const [id,v]of Object.entries(record(obj.steps??{},'旧步骤'))){if(!Array.isArray(v)||v.some(x=>typeof x!=='boolean'))fail('旧步骤无效');const map=(stepMap as Record<string,string[]>)[id];if(!map){profile.legacyArchive['steps:'+id]=v;continue;}profile.steps[id]=Object.fromEntries(map.map((sid,i)=>[sid,v[i]??false]));if(v.length>map.length)profile.legacyArchive['extraSteps:'+id]=v.slice(map.length);}
  for(const [id,v]of Object.entries(stock))profile.stock[id]=numeric(v,'旧库存');
  for(const [id,v]of Object.entries(record(obj.budget??{},'旧预算')))profile.budget[id]=Object.fromEntries(Object.entries(record(v,'预算行')).map(([r,q])=>[r,numeric(q,'预算')]));
  if(!Array.isArray(obj.events??[]))fail('旧日志无效');profile.events=(obj.events??[]) as ProfileDocument['events'];
  const fields=new Set(['version','rank','statuses','steps','notes','stock','budget','events']);for(const [k,v]of Object.entries(obj))if(!fields.has(k))profile.legacyArchive[k]=v;
  profile.originals=[original];validateProfile(profile);
 }else fail('不是兼容存档；seed目录不能代替个人备份，或版本过新');
 for(const saved of profile.originals){let original:Uint8Array;try{original=originalBytes(saved);}catch{fail('归档原件编码损坏');}const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new Uint8Array(original)))).map(x=>x.toString(16).padStart(2,'0')).join('');if(actual!==saved.hash)fail('归档原件hash不匹配');}
 const unknown=Object.keys(profile.legacyArchive).length;if(unknown)warnings.push(`${unknown}项未知字段或旧引用已归档保留`);
 return {hash,format,profile,original,warnings,counts:{nodes:Object.keys(profile.statuses).length,steps:Object.values(profile.steps).reduce((s,m)=>s+Object.keys(m).length,0),notes:Object.keys(profile.notes).length,stock:Object.keys(profile.stock).length,budget:Object.keys(profile.budget).length,events:profile.events.length,unknown}};
}
export function exportBackup(profile:ProfileDocument,catalogVersion:string):string {
 validateProfile(profile);if(typeof catalogVersion!=='string'||catalogVersion.length>BACKUP_LIMITS.metadataText)fail('目录版本文字无效或超限');
 // Compact JSON keeps capacity independent of indentation and archive nesting.
 const text=JSON.stringify({schemaVersion:SCHEMA_VERSION,catalogVersion,profile});
 if(new TextEncoder().encode(text).length>BACKUP_LIMITS.fileBytes)fail('完整备份超过8 MiB上限，未生成备份');return text;
}
