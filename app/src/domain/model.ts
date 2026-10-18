import type {WeaponProgress} from './weapon';
import type {GoalState,PersonalFact} from './goals';
export const DB_VERSION = 1;
export const SCHEMA_VERSION = 1;
export type Status = 'todo' | 'progress' | 'done';
export type KnownNumber = number | null;
export interface Source {kind:'user'|'official'|'community'; verification:'verified'|'unverified'|'conflicting'; reference:string; checkedAt:string; gamePatch?:string}
export interface Lane {id:string; name:string; color:string; y:number; icon:string}
export interface TechNode {id:string; goalId:string; lane:string; title:string; sub:string; description:string; priority:string; x:number; y:number; recommended:string[]; steps:{id:string;text:string}[]}
export interface Catalog {catalogVersion:string; source:Source; lanes:Lane[]; nodes:TechNode[]}
export interface Original {name:string; hash:string; base64:string}
export interface ProfileDocument {
 id:string; revision:number; name:string; masteryRank:KnownNumber; targetRank:KnownNumber; dailyMinutes:KnownNumber; mainFrame:string;
 statuses:Record<string,Status>; steps:Record<string,Record<string,boolean>>; notes:Record<string,string>;
 stock:Record<string,KnownNumber>; budget:Record<string,Record<string,KnownNumber>>;
 events:{time:string;text:string}[]; customNodes:TechNode[]; legacyArchive:Record<string,unknown>; originals:Original[];
 weaponProgress?:Record<string,WeaponProgress>;
 goalStates?:Record<string,GoalState>;
 personalFacts?:Record<string,PersonalFact>;
}
export interface Backup {schemaVersion:1; catalogVersion:string; profile:ProfileDocument}
export type ConditionState = 'satisfied'|'unmet'|'unknown';
export function conditionState(value:boolean|null):ConditionState {return value===null?'unknown':value?'satisfied':'unmet';}
export function allowsManualCompletion():boolean {return true;}
export interface OnlineCacheMeta {fetchedAt:string;expiresAt:string;sourceUrl:string;reviewedAt:string|null;gamePatch:string|null}
export const RESOURCE_NAMES:Record<string,string>={credits:'星币（Credits）',endo:'内融核心（Endo）',forma:'福马（Forma）',platinum:'白金（Platinum）'};
