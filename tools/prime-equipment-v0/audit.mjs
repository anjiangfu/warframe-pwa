// Project-authored audit of pinned data. No upstream executable is loaded.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const pinned=read('docs/evidence/Relic_Query_v2/Inputs.json');
const names=['Warframes','Melee','Primary','Secondary','Arch-Melee'];
const files=[...names,'components','zh','items-license'];
const inputs={};
for(const name of files){const path=`.v/rv1-source/${name}.${name==='items-license'?'txt':'json'}`;const expected=pinned.files[path.replaceAll('/','\\')];assert(expected,path);assert.equal(hash(path),expected.sha256,path);inputs[path]={sha256:hash(path),bytes:readFileSync(path).length};}
const parents=new Map();for(const name of names)for(const p of read(`.v/rv1-source/${name}.json`)){assert(!parents.has(p.uniqueName));parents.set(p.uniqueName,{...p,file:name});}
const components=new Map(read('.v/rv1-source/components.json').map(c=>[c.uniqueName,c]));
const zh=read('.v/rv1-source/zh.json'),catalog=read('app/src/catalog/relics.v1.json'),groups=new Map(),excluded=[];
for(const reward of catalog.rewards){
 const ids=reward.display?.upstreamIds;
 if(!ids||ids.length!==2){excluded.push({id:reward.id,english:reward.english});continue;}
 const [parentId,componentId]=ids,p=parents.get(parentId),component=components.get(componentId);
 assert(p?.isPrime,`Parent is not identified Prime: ${reward.id}`);assert(component,`Unknown component: ${componentId}`);
 assert.equal(p.components.filter(c=>c.uniqueName===componentId).length,1,reward.id);
 assert(component.parentUniqueNames.includes(parentId),reward.id);
 assert(['blueprint','component','item'].includes(reward.type),reward.id);
 const localized=zh[parentId]?.name;assert.equal(typeof localized,'string');
 if(!groups.has(parentId))groups.set(parentId,{parentUniqueName:parentId,parentEnglish:p.name,parentZh:localized,parentFile:p.file,namePending:localized===p.name,rewardIds:[],links:[]});
 const g=groups.get(parentId);g.rewardIds.push(reward.id);g.links.push({rewardId:reward.id,componentId,type:reward.type});
}
const rows=[...groups.values()];assert.equal(rows.length,35);assert.equal(rows.reduce((n,g)=>n+g.links.length,0),115);assert.equal(rows.filter(g=>g.namePending).length,9);
assert.deepEqual(excluded.map(r=>r.id).sort(),['blueprint:forma','reward:wfcd:d9f5d19082a2b4229a4bcc696099a096'].sort());
const referencePath=process.argv[2];assert(referencePath,'Pass the approved census path for independent comparison');
const reference=read(referencePath);const comparable=xs=>xs.map(({links,...g})=>g).sort((a,b)=>a.parentUniqueName.localeCompare(b.parentUniqueName));
assert.deepEqual(comparable(rows),comparable(reference.groups));
const output={checkedAt:'2026-10-26',itemsVersion:pinned.itemsVersion,method:'Exact reward parent/component IDs checked against both pinned parent.components and component.parentUniqueNames; census compared only after recomputation',inputs,referenceSha256:hash(referencePath),groups:rows,excluded,groupCount:35,rewardLinkCount:115,pendingNames:9};
const dir='docs/evidence/Prime_Equipment_Nav_v0';mkdirSync(dir,{recursive:true});writeFileSync(`${dir}/Author_Audit.json`,JSON.stringify(output,null,2)+'\n');console.log('Independent audit: 35 parents, 115 unique links, 9 pending names; exact census match');
