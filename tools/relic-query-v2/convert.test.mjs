import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPinned,convertCatalog,serializeCatalog} from './convert.mjs';
const root=resolve(import.meta.dirname,'../..');
const read=name=>JSON.parse(readFileSync(resolve(root,'docs/evidence/Relic_Query_v2',name),'utf8'));
const input=()=>loadPinned(root);
test('fixed original inputs produce the independently audited complete rows and exact two-node excerpts',()=>{
 const c=convertCatalog(input()),samples=read('Samples.json'),old=read('Baseline_Catalog.json');
 assert.equal(c.relics.length,31);assert.equal(c.rewards.length,117);assert.equal(c.relations.length,186);assert.equal(c.acquisitions.length,62);assert.deepEqual(c.locations,old.locations);assert.deepEqual(c.routeRules,old.routeRules);
 for(const s of samples){assert.deepEqual(c.relations.filter(x=>x.relicId===s.id).map(x=>c.rewards.find(r=>r.id===x.rewardId).english),s.upstream.rewards.map(x=>x.itemName));if(!s.retained)assert.deepEqual(c.acquisitions.filter(x=>x.relicId===s.id).map(x=>({locationId:x.locationId,rotation:x.rotation})),s.newExcerpt.map(x=>({locationId:x.locationId,rotation:x.rotation})));}
});
test('conversion is byte deterministic, nonmutating and preserves all old records including sources',()=>{
 const i=input(),before=structuredClone(i),a=convertCatalog(i),b=convertCatalog(i);assert.equal(serializeCatalog(a),serializeCatalog(b));assert.deepEqual(i,before);for(const key of ['relics','rewards','relations','acquisitions','sources'])assert.deepEqual(a[key].slice(0,i.baseline[key].length),i.baseline[key]);
});
test('new 59 exact names and the quantity combination match independent identity audit, without fuzzy bindings',()=>{
 const c=convertCatalog(input());for(const row of read('New_Name_Audit.json')){const r=c.rewards.find(x=>x.id===row.id);assert.equal(r.type,row.type);assert.equal(r.display.nameZh,row.nameZh);if(row.hits.length){assert.deepEqual(r.display.upstreamIds,[row.hits[0].parentId,row.hits[0].componentId]);assert.equal(r.display.properNameUntranslated,row.hits[0].properNameUntranslated);}else assert.deepEqual(r.bundleOf,{rewardId:'blueprint:forma',quantity:2});}assert.equal(c.rewards.filter(x=>x.english==='Forma Blueprint').length,1);
});
test('raw hash mismatch is rejected before parsing or generating a catalog',()=>{
 const manifest=read('Inputs.json'),key=Object.keys(manifest.files).find(k=>k.replaceAll('\\','/')==='.v/rl-source/data/relics.json');manifest.files[key].sha256='0'.repeat(64);assert.throws(()=>loadPinned(root,manifest),/hash/);
});
test('duplicate Intact, incomplete table, conflicting upstream identity and an unknown item type fail explicitly',()=>{
 for(const mutate of [i=>i.relics.push(structuredClone(i.relics.find(x=>x.state==='Intact'&&x.tier==='Lith'&&x.relicName==='A13'))),i=>i.relics.find(x=>x.state==='Intact'&&x.tier==='Lith'&&x.relicName==='A13').rewards.pop(),i=>{const x=i.relics.find(x=>x.state==='Intact'&&x.tier==='Lith'&&x.relicName==='A13').rewards[0];x._id=i.baseline.rewards[0].upstreamId;},i=>{i.relics.find(x=>x.state==='Intact'&&x.tier==='Lith'&&x.relicName==='A13').rewards[0].itemName='Unclear Synthetic Item';}]){const i=input();mutate(i);assert.throws(()=>convertCatalog(i),/重复|六项|冲突|类型/);}
});
test('missing or conflicting exact Chinese evidence stays pending and does not invent translations',()=>{
 const i=input(),row=read('New_Name_Audit.json').find(x=>x.status==='added'),hit=row.hits[0];delete i.zh[hit.parentId];const c=convertCatalog(i);assert.equal(c.rewards.find(x=>x.id===row.id).display,undefined);assert.equal(c.rewards.find(x=>x.id===row.id).nameStatus,'unverified');
 const j=input();const p=j.parents.find(x=>x.row.uniqueName===hit.parentId);j.parents.push({file:p.file,row:{...structuredClone(p.row),uniqueName:'synthetic:other-parent'}});const conflicted=convertCatalog(j).rewards.find(x=>x.id===row.id);assert.equal(conflicted.display.verification,'conflicting');assert.deepEqual(conflicted.display.aliases,[]);
});
test('missing route or unexpected selected relic is reported, never replaced with invented rows',()=>{
 const i=input();for(const planet of Object.values(i.missions))for(const node of Object.values(planet))if(node.rewards&&!Array.isArray(node.rewards))for(const rows of Object.values(node.rewards))if(Array.isArray(rows))for(let k=rows.length-1;k>=0;k--)if(rows[k].itemName==='Lith A13 Relic')rows.splice(k,1);assert.throws(()=>convertCatalog(i),/选样|来源/);
});
