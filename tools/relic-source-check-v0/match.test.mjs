import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {auditOfficial,loadPinnedHtml} from './match.mjs';
const root=resolve(import.meta.dirname,'../..'),read=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const c=read('docs/evidence/Relic_Source_Check_v0/Baseline_Catalog.json'),audit=read('docs/evidence/Relic_Source_Check_v0/Author_Audit.json');
const url='https://warframe-web-assets.nyc3.cdn.digitaloceanspaces.com/uploads/cms/hnfvc0o3jnfvc873njb03enrf56.html';
const meta={sourceUrl:url,retrievedAt:'2026-10-25T12:52:34.735535+00:00',checkedAt:audit.checkedAt,accessMode:'downloaded'};
const heading=a=>{const l=c.locations.find(l=>l.id===a.locationId);return `${l.planet}/${l.node}${l.mode==='Caches'?'':` (${l.mode})`}`;};
const a=c.acquisitions[2],item=c.relics.find(r=>r.id===a.relicId).english,h=heading(a);
const row=name=>`<tr><td>${name}</td><td>opaque source cell</td></tr>`;
const block=(name=h,rotation=a.rotation,rows=row(item))=>`<tr><th colspan="2">${name}</th></tr><tr><th colspan="2">Rotation ${rotation}</th></tr>${rows}`;
const page=body=>`<title>Warframe PC Drops</title><p><b>Last Update:</b>22 October, 2026</p><h3 id="missionRewards">Missions:</h3><table>${body}</table><h3 id="relicRewards">Relics:</h3>`;
const run=html=>auditOfficial(c,{...meta,html});
const record=html=>run(html).records.find(x=>x.acquisitionId===a.id);
test('all 62 real rows independently match the author audit within mission acquisition tables',()=>{
 const html=loadPinnedHtml(resolve(root,'.v/rs-source/official.online.html'),'c31c421954adbd46ec962d40f71d7e7360df3248bd43ce8885d89b7375ddd3d9');const result=run(html);assert.equal(result.records.length,62);assert.equal(result.document.publishedAt,'2026-10-22');for(const actual of result.records){const expected=audit.acquisitions.find(x=>x.acquisitionId===actual.acquisitionId);assert.equal(actual.status,expected.status);assert.equal(actual.matchCount,1);for(const k of ['section','heading','rotation','item'])assert.equal(actual.locator[k],expected[k]);}assert.equal(result.records.filter(x=>x.status==='listed').length,62);
});
test('not-listed requires a successfully read exact heading and nonempty exact rotation',()=>{
 const r=record(page(block(h,a.rotation,row('Synthetic other reward'))));assert.equal(r.status,'not-listed');assert.equal(r.tableRead,true);assert.equal(r.rotationRead,true);assert.equal(r.matchCount,0);
});
test('a name in relicRewards without the mission section cannot prove acquisition',()=>{
 const result=record(`<title>Warframe PC Drops</title><b>Last Update:</b>22 October, 2026<h3 id="relicRewards">Relics:</h3><table>${block()}</table>`);assert.equal(result.status,'unverified');assert.equal(result.reason,'mission-section-missing');
});
test('missing heading and missing rotation are unknown rather than absent rows',()=>{
 assert.equal(record(page(block('Synthetic Wrong/Place (Survival)'))).status,'unverified');const r=record(page(block(h,a.rotation==='A'?'B':'A')));assert.equal(r.status,'unverified');assert.equal(r.reason,'rotation-missing');
});
test('malformed rows, unbalanced markup, script content and failed transport cannot become not-listed',()=>{
 for(const html of [page(block(h,a.rotation,'<tr><td>broken</td></tr>')),page(block()).replace('</tr>',''),page(block()+'<script>irrelevant</script>')])assert.equal(record(html).status,'unverified');const r=auditOfficial(c,{...meta,error:'Synthetic network failure',html:page(block())});assert.ok(r.records.every(x=>x.status==='unverified'&&x.reason==='network-failed'));
});
test('duplicate headings or duplicate matching rows are conflicts, not listed',()=>{
 for(const html of [page(block()+block()),page(block(h,a.rotation,row(item)+row(item)))])assert.equal(record(html).status,'conflicting');
});
test('missing publication, acquisition or verification date never becomes dated listed evidence',()=>{
 assert.equal(record(page(block()).replace('22 October, 2026','')).status,'unverified');for(const key of ['retrievedAt','checkedAt'])assert.equal(auditOfficial(c,{...meta,[key]:null,html:page(block())}).records.find(x=>x.acquisitionId===a.id).status,'unverified');
});
test('Caches suffix is used once and Tyana keeps original Defense table identity and mirror rule',()=>{
 const html=loadPinnedHtml(resolve(root,'.v/rs-source/official.online.html'),audit.sha256),result=run(html);for(const l of c.locations.filter(l=>l.mode==='Caches')){for(const a of c.acquisitions.filter(a=>a.locationId===l.id)){const r=result.records.find(r=>r.acquisitionId===a.id);assert.equal(r.locator.heading,`${l.planet}/${l.node}`);assert.equal(r.status,'listed');assert.equal(l.guide.triggerVerification,'unverified');}}const t=c.locations.find(l=>l.node==='Tyana Pass');assert.equal(t.mode,'Defense');assert.equal(t.guide.ruleId,'relic-rule:mirror');assert.ok(result.records.filter(r=>r.locator.heading==='Mars/Tyana Pass (Defense)').every(r=>r.status==='listed'));
});
test('same name in another location or rotation does not pass and no source probabilities enter output',()=>{
 const html=page(block(h,a.rotation,row('Synthetic Other'))+block('Synthetic Other/Node (Survival)',a.rotation,row(item)));assert.equal(record(html).status,'not-listed');assert.equal(JSON.stringify(run(html)).includes('opaque source cell'),false);
});
test('fixed input processing is deterministic, readonly and hash mismatches fail before parsing',()=>{
 const input={...meta,html:page(block())},before=structuredClone(c);assert.deepEqual(auditOfficial(c,input),auditOfficial(c,input));assert.deepEqual(c,before);assert.throws(()=>loadPinnedHtml(resolve(root,'.v/rs-source/official.online.html'),'0'.repeat(64)),/hash/);
});
