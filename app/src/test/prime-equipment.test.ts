import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {LocalProvider} from '../catalog/provider';
import {createEquipmentIndex,filterEquipment,type EquipmentMetadata} from '../domain/prime-equipment';
const provider=new LocalProvider(),catalog=provider.getRelicCatalog();
const audit=JSON.parse(readFileSync('../docs/evidence/Prime_Equipment_Nav_v0/Author_Audit.json','utf8')) as {groups:{parentUniqueName:string;parentEnglish:string;parentZh:string;namePending:boolean;rewardIds:string[];links:{componentId:string}[]}[]};
// Independently audited real-data oracle; production attachment must be supplied by Provider.
const attachment=()=>Reflect.get(provider,'getPrimeEquipmentCatalog')?.call(provider) as EquipmentMetadata|undefined;
describe('Prime equipment real catalog',()=>{
 it('LocalProvider supplies a frozen, versioned small attachment and exact 35/115 groups',()=>{
  const metadata=attachment();expect(Object.isFrozen(metadata)).toBe(true);const index=createEquipmentIndex(catalog,metadata);expect(index.status).toBe('ready');expect(index.groups).toHaveLength(35);expect(index.groups.flatMap(g=>g.rewards)).toHaveLength(115);
  for(const expected of audit.groups){const g=index.groups.find(g=>g.parent.id===expected.parentUniqueName)!;expect(g.parent.english).toBe(expected.parentEnglish);expect(g.parent.nameZh).toBe(expected.parentZh);expect(g.parent.namePending).toBe(expected.namePending);expect(g.rewards.map(r=>r.id)).toEqual(expected.rewardIds);for(const reward of g.rewards)expect(reward.display!.upstreamIds[0]).toBe(g.parent.id);}
  expect(index.groups.filter(g=>g.parent.namePending)).toHaveLength(9);expect(new Set(index.groups.flatMap(g=>g.rewards.map(r=>r.id))).size).toBe(115);expect(index.groups.flatMap(g=>g.rewards).some(r=>r.bundleOf||r.id==='blueprint:forma')).toBe(false);
 });
 it('all 35 exact Chinese and English names find their stable parent identity',()=>{
  const index=createEquipmentIndex(catalog,attachment());for(const g of audit.groups)for(const name of [g.parentEnglish,g.parentZh])expect(filterEquipment(index,name).map(x=>x.group.parent.id)).toContain(g.parentUniqueName);
  expect(filterEquipment(index,'没有这件装备')).toEqual([]);expect(filterEquipment(index,'福马')).toEqual([]);
 });
 it('saved-source filters use any matching linked relic, preserving unfiltered reward-kind totals',()=>{
  const index=createEquipmentIndex(catalog,attachment()),checks=provider.getRelicSourceChecks();expect(filterEquipment(index,'',checks,'listed')).toHaveLength(35);expect(filterEquipment(index,'',checks,'not-listed')).toEqual([]);expect(filterEquipment(index,'',undefined,'pending')).toHaveLength(35);
  const synthetic=structuredClone(checks!);for(const row of synthetic.records){row.status='not-listed';row.reason='missing-row';row.matchCount=0;row.rowOrdinals=[];}synthetic.records[0]=structuredClone(checks!.records[0]);
  const filtered=filterEquipment(index,'',synthetic,'listed');expect(filtered.length).toBeGreaterThan(0);expect(filtered.some(x=>x.visible.length<x.total)).toBe(true);for(const x of filtered){expect(x.total).toBe(x.group.rewards.length);expect(x.visible.length).toBeGreaterThan(0);}
 });
});
describe('Prime equipment synthetic faults (not game facts)',()=>{
 it('missing attachment, missing root fields and legacy catalog safely disable only the new index',()=>{
  expect(createEquipmentIndex(catalog,undefined).status).toBe('unavailable');expect(createEquipmentIndex(catalog,{}).status).not.toBe('ready');expect(createEquipmentIndex({...catalog,catalogVersion:'legacy'},attachment()).status).toBe('unavailable');
 });
 for(const fault of ['duplicate-parent','duplicate-component','wrong-parent','missing-component','unknown-type','missing-identity','unverified-identity','conflicting-identity','duplicate-reward','missing-source','missing-name'] as const)it('rejects '+fault+' without inventing links or damaging original catalog',()=>{
  const metadata=structuredClone(attachment()!),data=structuredClone(catalog),before=JSON.stringify(catalog);
  if(fault==='duplicate-parent')metadata.parents.push(structuredClone(metadata.parents[0]));
  if(fault==='duplicate-component')metadata.parents[0].componentIds.push(metadata.parents[0].componentIds[0]);
  if(fault==='wrong-parent')data.rewards.find(r=>r.display?.upstreamIds[0]===metadata.parents[0].id)!.display!.upstreamIds[0]=metadata.parents[1].id;
  if(fault==='missing-component')metadata.parents[0].componentIds.pop();
  if(fault==='unknown-type')data.rewards.find(r=>r.display?.upstreamIds.length===2)!.type='unknown';
  if(fault==='missing-identity')delete data.rewards.find(r=>r.display?.upstreamIds.length===2)!.display;
  if(fault==='unverified-identity')data.rewards.find(r=>r.display?.upstreamIds.length===2)!.display!.verification='unverified';
  if(fault==='conflicting-identity')data.rewards.find(r=>r.display?.upstreamIds.length===2)!.display!.verification='conflicting';
  if(fault==='duplicate-reward')data.rewards.push(structuredClone(data.rewards[0]));
  if(fault==='missing-source')metadata.parents[0].sourceIds=['missing'];
  if(fault==='missing-name')metadata.parents[0].nameZh='';
  expect(createEquipmentIndex(data,metadata).status).toBe('invalid');expect(JSON.stringify(catalog)).toBe(before);
 });
});
