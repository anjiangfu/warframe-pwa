import type {ProfileDocument,Status} from './model';
export interface GuideSource {id:string;title:string;url:string;kind:'official'|'official-history'|'community';access:'page'|'search-cache';checkedAt:string;note:string}
export interface Acquisition {id:string;label:string;mode:string;place:string;action:string;restrictions:string[];sourceIds:string[];kind:'acquisition'|'suggestion';verification?:'verified'|'unverified'|'conflicting';checkedAt?:string}
export function validateAcquisition(a:Acquisition){
 if(a.verification!==undefined&&!['verified','unverified','conflicting'].includes(a.verification))throw Error('获取路线核验状态无效');
 if(a.checkedAt!==undefined&&(!/^\d{4}-\d{2}-\d{2}$/.test(a.checkedAt)||!Number.isFinite(Date.parse(a.checkedAt))||new Date(a.checkedAt).toISOString().slice(0,10)!==a.checkedAt))throw Error('获取路线核验日期无效');
 if(a.verification==='verified'&&(!a.checkedAt||!a.sourceIds.length))throw Error('获取路线核验缺少日期或来源');
}
export interface GuideMaterial {id:string;name:string;english:string;aliases:string[];acquisitionIds:string[];sourceIds:string[]}
export interface WeaponStage {id:string;label:string;challenge:{kind:string;target:number|null;description:string;resets?:string[]};checks:string[];tips:string[];troubleshooting:string[];locationIds:string[];sourceIds:string[]}
export interface WeaponGuide {id:string;name:string;english:string;summary:string;requirements:string[];acquisitionIds:string[];installCost:{materialId:string;quantity:number;sourceIds:string[]}[];stages:WeaponStage[];sourceIds:string[]}
export interface WeaponCatalog {catalogVersion:string;sources:GuideSource[];materials:GuideMaterial[];acquisitions:Acquisition[];weapons:WeaponGuide[]}
export interface WeaponProgress {owned:boolean|null;adapterOwned:boolean|null;installed:boolean|null;currentStageId:string|null;stages:Record<string,Status|'unknown'>}
export function progressOf(profile:ProfileDocument,id:string):WeaponProgress {return structuredClone(profile.weaponProgress?.[id]??{owned:null,adapterOwned:null,installed:null,currentStageId:null,stages:{}});}
export function editWeaponProgress(profile:ProfileDocument,id:string,edit:(s:WeaponProgress)=>void){const state=progressOf(profile,id);edit(state);profile.weaponProgress??={};profile.weaponProgress[id]=state;}
export function materialDeficit(required:number,owned:number|null|undefined):number|null{return owned==null?null:Math.max(0,required-owned);}
export function searchGuides(catalog:Readonly<WeaponCatalog>,query:string):{kind:'weapon'|'material';id:string;label:string}[]{const q=query.trim().toLocaleLowerCase();return [...catalog.weapons.map(w=>({kind:'weapon' as const,id:w.id,label:`${w.name}（${w.english}）`,search:[w.name,w.english]})),...catalog.materials.map(m=>({kind:'material' as const,id:m.id,label:`${m.name}（${m.english}）`,search:[m.name,m.english,...m.aliases]}))].filter(x=>!q||x.search.some(s=>s.toLocaleLowerCase().includes(q))).map(({kind,id,label})=>({kind,id,label}));}
