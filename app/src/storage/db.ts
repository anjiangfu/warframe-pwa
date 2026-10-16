import Dexie,{type Table,type Transaction} from 'dexie';
import {DB_VERSION,type ProfileDocument} from '../domain/model';
import {validateProfile,type ImportPreview} from './imports';
type Snapshot={id:string;profileId:string;document:ProfileDocument};
export class PlannerDB extends Dexie {
 profiles!:Table<ProfileDocument,string>;snapshots!:Table<Snapshot,string>;imports!:Table<{profileId:string;hash:string;revision:number},[string,string]>;meta!:Table<{key:string;value:unknown},string>;
 unavailable=false;
 constructor(name:string){super(name);this.version(DB_VERSION).stores({profiles:'id',snapshots:'id',imports:'[profileId+hash]',meta:'key'});}
}
export async function snapshotUpgrade(tx:Transaction,check?:(p:ProfileDocument)=>void){
 const old=await tx.table('profiles').toArray() as ProfileDocument[];
 for(const p of old){validateProfile(p);check?.(p);const id='upgrade:'+p.id+':'+p.revision;await tx.table('snapshots').put({id,profileId:p.id,document:structuredClone(p)});const saved=await tx.table('snapshots').get(id) as Snapshot|undefined;if(!saved||JSON.stringify(saved.document)!==JSON.stringify(p))throw Error('升级前备份失败');}
}
export async function openDatabase(name='tenno-planner',onState?:(message:string)=>void):Promise<PlannerDB>{
 const db=new PlannerDB(name);
 db.on('versionchange',()=>{db.unavailable=true;db.close();onState?.('其他页面升级了数据库。此页面已停止写入，请重新打开。');});
 db.on('blocked',()=>onState?.('数据库升级被其他标签页阻挡，请关闭旧页面后重试。'));
 try{await db.open();if(db.backendDB().version>DB_VERSION*10){db.unavailable=true;throw Error('此数据库由新版本创建，请更新应用；已停止写入，不会重置数据。');}return db;}catch(e){db.close();if(e instanceof Error&&(e.name==='VersionError'||e.message.includes('higher')))throw new Error('此数据库由新版本创建，请更新应用；已停止写入，不会重置数据。',{cause:e});throw e;}
}
export class Repository {
 constructor(readonly db:PlannerDB){}
 list(){return this.db.profiles.toArray();}get(id:string){return this.db.profiles.get(id);}
 private async guard(){if(this.db.unavailable)throw Error('数据库版本变化，请重新打开');if(await this.db.meta.get('writeBarrier'))throw Error('正在准备更新，写入已暂停，请更新或取消更新后继续。');}
 async create(p:ProfileDocument){validateProfile(p);return this.db.transaction('rw',[this.db.profiles,this.db.meta],async()=>{await this.guard();await this.db.profiles.add(structuredClone(p));return p;});}
 async save(p:ProfileDocument,expectedRevision:number){validateProfile(p);return this.db.transaction('rw',[this.db.profiles,this.db.meta],async()=>{await this.guard();const previous=await this.get(p.id);if(!previous||previous.revision!==expectedRevision)throw Error('档案已在其他页面改变，请重新载入后再修改。');const next={...structuredClone(p),revision:expectedRevision+1};await this.db.profiles.put(next);return next;});}
 async restore(preview:ImportPreview,targetId:string,expectedRevision:number|null){
  validateProfile(preview.profile);
  return this.db.transaction('rw',[this.db.profiles,this.db.snapshots,this.db.imports,this.db.meta],async()=>{
   await this.guard();const previous=await this.get(targetId);const prior=await this.db.imports.get([targetId,preview.hash]);
   if(previous&&prior&&prior.revision===previous.revision&&(expectedRevision===null||expectedRevision===previous.revision||expectedRevision===previous.revision-1))return previous;
   if((previous?.revision??null)!==expectedRevision)throw Error('预览后档案已改变，请重新预览。');
   if(previous){const id=crypto.randomUUID();await this.db.snapshots.add({id,profileId:targetId,document:structuredClone(previous)});const saved=await this.db.snapshots.get(id);if(!saved||JSON.stringify(saved.document)!==JSON.stringify(previous))throw Error('备份失败，恢复已取消');}
   const next={...structuredClone(preview.profile),id:targetId,revision:(previous?.revision??-1)+1};await this.db.profiles.put(next);await this.db.imports.put({profileId:targetId,hash:preview.hash,revision:next.revision});return next;
  });
 }
}
