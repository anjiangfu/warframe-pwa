import {readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const initial=JSON.parse(readFileSync('../docs/evidence/M0_Input_Hashes.json','utf8'));const comparison=[];
for(const [p,expected]of Object.entries(initial.files)){const actual=createHash('sha256').update(readFileSync('../'+p)).digest('hex');const authorized=p==='docs/M0_Implementation_Plan.md';if(!authorized)assert.equal(actual,expected,'Original changed: '+p);comparison.push({path:p,before:expected,after:actual,unchanged:actual===expected,authorizedPlanRevision:authorized});}
writeFileSync('../docs/evidence/M0_Hash_Comparison.json',JSON.stringify(comparison,null,2)+'\n');
const seed=JSON.parse(readFileSync('../data/tech-tree-seed.json','utf8')),catalog=JSON.parse(readFileSync('src/catalog/tech-tree.v1.json','utf8')),map=JSON.parse(readFileSync('../data/legacy-step-map.v1.json','utf8'));
assert.equal(catalog.lanes.length,7);assert.equal(catalog.nodes.length,29);assert.deepEqual(catalog.nodes.map(n=>n.id),seed.nodes.map(n=>n.id));assert.deepEqual(catalog.nodes.flatMap(n=>n.steps.map(s=>s.id)),seed.nodes.flatMap(n=>map[n.id]));assert.equal(catalog.nodes.reduce((sum,n)=>sum+n.recommended.length,0),30);
const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8')),info=JSON.parse(readFileSync('dist/build-info.json','utf8'));assert.equal(manifest.scope,info.base);assert.equal(manifest.start_url,info.base+'#tree');for(const icon of manifest.icons){const png=readFileSync('dist/'+icon.src);assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`,icon.sizes);}
function walk(dir){return readdirSync(dir).flatMap(p=>statSync(dir+'/'+p).isDirectory()?walk(dir+'/'+p):dir+'/'+p);}
const resources=walk('dist').map(p=>{const bytes=readFileSync(p);return {path:p,bytes:bytes.length,gzipBytes:gzipSync(bytes).length};});const report={build:info,catalog:{lanes:7,nodes:29,steps:87,recommendedEdges:30},protectedInputs:comparison.filter(x=>!x.authorizedPlanRevision).length,resources,totalRawBytes:resources.reduce((s,r)=>s+r.bytes,0)};writeFileSync('../docs/evidence/M0_Build.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
