import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const audit=read('docs/evidence/Prime_Equipment_Nav_v0/Author_Audit.json'),catalog=read('app/src/catalog/relics.v1.json');
for(const [p,expected] of Object.entries(audit.inputs))assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'),expected.sha256,p);
const sources=Object.entries(audit.inputs).filter(([p])=>p.endsWith('.json')).map(([p,v])=>{const file=p.split('/').at(-1);return {id:file,url:`https://cdn.jsdelivr.net/npm/@wfcd/items@${audit.itemsVersion}/data/json/${file==='zh.json'?'i18n/zh.json':file==='components.json'?'Components.json':file}`,sha256:v.sha256};});
const metadata={schemaVersion:1,catalogVersion:'prime-equipment.2026.10.26.1',relicCatalogVersion:catalog.catalogVersion,checkedAt:audit.checkedAt,sources,parents:audit.groups.map(g=>({id:g.parentUniqueName,english:g.parentEnglish,nameZh:g.parentZh,namePending:g.namePending,componentIds:g.links.map(l=>l.componentId),sourceIds:[g.parentFile+'.json','components.json','zh.json']})),excludedRewardIds:audit.excluded.map(r=>r.id)};
assert(process.argv[2],'Explicit output path required');writeFileSync(process.argv[2],JSON.stringify(metadata,null,2)+'\n');console.log('Generated bounded parent metadata, not recipes:',metadata.parents.length);
