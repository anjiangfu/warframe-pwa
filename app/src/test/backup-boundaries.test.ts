import 'fake-indexeddb/auto';
import {afterEach,describe,expect,it} from 'vitest';
import Dexie from 'dexie';
import {LocalProvider} from '../catalog/provider';
import {exportBackup,newProfile,parseImport,validateProfile,originalBytes} from '../storage/imports';
import {openDatabase,Repository} from '../storage/db';
import type {ProfileDocument} from '../domain/model';

const provider=new LocalProvider(),catalog=provider.getCatalog(),encoder=new TextEncoder();
// Contract: 8 MiB file, 2 KiB reserved for id/revision and backup metadata.
const payloadLimit=8*1024*1024-2048;
const databases:string[]=[];
afterEach(async()=>{for(const name of databases.splice(0))await Dexie.delete(name);});
function profile(){return newProfile(catalog,'boundary-source','边界档案',false);}
function business(p:ProfileDocument){const copy=structuredClone(p) as Partial<ProfileDocument>;delete copy.id;delete copy.revision;return copy;}
function nested(levels:number):unknown{let value:unknown='中文末端';for(let i=0;i<levels;i++)value={child:value};return value;}
function nodeCount(value:unknown):number{return 1+(value&&typeof value==='object'?Object.values(value).reduce<number>((sum,x)=>sum+nodeCount(x),0):0);}
async function roundtrip(p:ProfileDocument){
 const dbName='m0-boundary-'+crypto.randomUUID();databases.push(dbName);const db=await openDatabase(dbName);const repo=new Repository(db);
 try{await repo.create(p);const saved=(await repo.get(p.id))!;const text=exportBackup(saved,catalog.catalogVersion);const preview=await parseImport(encoder.encode(text),'实际导出.json',provider);const restored=await repo.restore(preview,crypto.randomUUID(),null);expect(business(restored)).toEqual(business(saved));return encoder.encode(text).length;}finally{db.close();}
}
describe('M0 backup roundtrip boundaries',()=>{
 it('rejects 29 × 100000 Chinese notes before save and export without truncation',async()=>{
  const p=profile();p.notes=Object.fromEntries(catalog.nodes.map(n=>[n.id,'字'.repeat(100000)]));
  expect(()=>validateProfile(p)).toThrow(/容量|大小|上限/);expect(()=>exportBackup(p,catalog.catalogVersion)).toThrow(/容量|大小|上限/);expect(p.notes.origin).toHaveLength(100000);
 });
 it('roundtrips exact payload capacity; one byte above rejects save/export/import and preserves old state',async()=>{
  const p=profile();p.notes=Object.fromEntries(Array.from({length:84},(_,i)=>['capacity-'+i,'x'.repeat(99000)]));p.legacyArchive.edge='';
  const remaining=payloadLimit-encoder.encode(JSON.stringify(business(p))).length;expect(remaining).toBeGreaterThan(0);expect(remaining).toBeLessThan(100000);p.legacyArchive.edge='x'.repeat(remaining);
  expect(encoder.encode(JSON.stringify(business(p)))).toHaveLength(payloadLimit);expect(await roundtrip(p)).toBeLessThanOrEqual(8*1024*1024);
  const metadataText='\u0000'.repeat(100);const worstMetadata={...p,id:metadataText,revision:Number.MAX_SAFE_INTEGER};const worst=exportBackup(worstMetadata,metadataText);expect(encoder.encode(worst).length).toBeLessThanOrEqual(8*1024*1024);expect((await parseImport(encoder.encode(worst),'元数据.json',provider)).profile).toEqual(worstMetadata);
  const dbName='m0-boundary-'+crypto.randomUUID();databases.push(dbName);const db=await openDatabase(dbName);const repo=new Repository(db);
  try{const old=profile();await repo.create(old);const next={...p,id:old.id};next.legacyArchive.edge+='x';await expect(repo.save(next,0)).rejects.toThrow(/容量|大小|上限/);expect(await repo.get(old.id)).toEqual(old);expect(()=>exportBackup(next,catalog.catalogVersion)).toThrow();await expect(parseImport(encoder.encode(JSON.stringify({schemaVersion:1,catalogVersion:catalog.catalogVersion,profile:next})),'超限.json',provider)).rejects.toThrow();}finally{db.close();}
 });
 it('roundtrips depth 20 including the reported 18-child archive; depth 21 is consistently rejected',async()=>{
  const p=profile();p.legacyArchive.field=nested(18);validateProfile(p);await roundtrip(p);
  p.legacyArchive.field=nested(19);expect(()=>validateProfile(p)).toThrow();expect(()=>exportBackup(p,catalog.catalogVersion)).toThrow();await expect(parseImport(encoder.encode(JSON.stringify({schemaVersion:1,catalogVersion:catalog.catalogVersion,profile:p})),'过深.json',provider)).rejects.toThrow();
 });
 it('roundtrips the 50000-value structure boundary without counting the backup wrapper twice',async()=>{
  const p=profile();p.legacyArchive.values=[];p.legacyArchive.values=Array(50000-nodeCount(p)).fill(true);expect(nodeCount(p)).toBe(50000);await roundtrip(p);
  (p.legacyArchive.values as boolean[]).push(true);expect(()=>validateProfile(p)).toThrow();expect(()=>exportBackup(p,catalog.catalogVersion)).toThrow();
 });
 it('legacy depth-boundary migration preserves logs, unknown fields and exact original bytes through restore',async()=>{
  const source={version:1,rank:0,statuses:{},stock:{credits:0},notes:{torid:'保留中文'},events:[{time:'原始时间',text:'保留日志'}],field:nested(18)};
  const bytes=encoder.encode(JSON.stringify(source));const imported=await parseImport(bytes,'旧边界.json',provider);expect(originalBytes(imported.profile.originals[0])).toEqual(bytes);expect(imported.profile.legacyArchive.field).toEqual(source.field);await roundtrip(imported.profile);
 });
 it('legacy file at exactly 2 MiB migrates and roundtrips without losing its original; +1 byte is rejected',async()=>{
  const source={version:1,rank:0,statuses:{},stock:{credits:0},notes:{torid:'中文'},events:[{time:'旧时间',text:'保留'}],padding:Array(21).fill('x'.repeat(99000)),edge:''};
  source.edge='x'.repeat(2*1024*1024-encoder.encode(JSON.stringify(source)).length);const bytes=encoder.encode(JSON.stringify(source));expect(bytes).toHaveLength(2*1024*1024);const imported=await parseImport(bytes,'2MiB旧档.json',provider);expect(Buffer.compare(Buffer.from(originalBytes(imported.profile.originals[0])),Buffer.from(bytes))).toBe(0);await roundtrip(imported.profile);
  await expect(parseImport(encoder.encode(JSON.stringify({...source,edge:source.edge+'x'})),'超限旧档.json',provider)).rejects.toThrow(/2 MiB/);
 });
 it('non-JSON archive values cannot silently disappear during export',()=>{const p=profile();p.legacyArchive.field=undefined;expect(()=>validateProfile(p)).toThrow();expect(()=>exportBackup(p,catalog.catalogVersion)).toThrow();});
 it('accepts a valid backup file at exactly 8 MiB and rejects the next byte',async()=>{
  const p=profile(),text=exportBackup(p,catalog.catalogVersion);const exact=encoder.encode(text+' '.repeat(8*1024*1024-encoder.encode(text).length));expect(exact).toHaveLength(8*1024*1024);const parsed=await parseImport(exact,'8MiB.json',provider);expect(parsed.profile).toEqual(p);await roundtrip(parsed.profile);const extra=new Uint8Array(exact.length+1);extra.set(exact);extra[exact.length]=32;await expect(parseImport(extra,'8MiB加1.json',provider)).rejects.toThrow(/8 MiB/);
 });
});
