import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {LocalProvider} from '../catalog/provider';
import {createRelicIndex,relicDetails,rewardRelics,searchRelics,searchRewards,validateRelicCatalog,type RelicCatalog} from '../domain/relics';
const catalog=()=>new LocalProvider().getRelicCatalog();
// All mutations below are synthetic test data and never shipped in the real catalog.
function synthetic(){const c=structuredClone(catalog());c.catalogVersion='synthetic-test-only';return c;}
it('twelve real relics have complete six-item tables, four eras and one shared Forma blueprint entity',()=>{
 const c=catalog(),index=createRelicIndex(c);expect(c.relics).toHaveLength(12);for(const tier of ['Lith','Meso','Neo','Axi'])expect(c.relics.filter(r=>r.tier===tier)).toHaveLength(3);
 expect(c.relations).toHaveLength(72);expect(c.acquisitions).toHaveLength(24);expect(c.rewards.filter(r=>r.english==='Forma Blueprint').map(r=>r.id)).toEqual(['blueprint:forma']);expect(c.rewards.find(r=>r.id==='blueprint:forma')?.type).toBe('blueprint');
 for(const r of c.relics){const d=relicDetails(index,r.id)!;expect(d.rewards).toHaveLength(6);expect(new Set(d.rewards.map(x=>x.reward.id)).size).toBe(6);expect(d.rewards.some(x=>x.reward.id==='blueprint:forma')).toBe(true);expect(r.availability).toBe('unknown');expect(r.sourceScope).toBe('partial');}
});
it('every real reward and excerpted acquisition matches the pinned G0 audit row by row',()=>{
 const audit=JSON.parse(readFileSync('../docs/evidence/Relic_Query_v0/Samples.json','utf8')) as {samples:{id:string;upstream:{rewards:{itemName:string}[]};routes:{planet:string;node:string;gameMode:string;rotation:string|null}[]}[]};const c=catalog(),index=createRelicIndex(c);
 expect(c.relics.map(r=>r.id)).toEqual(audit.samples.map(r=>r.id));for(const r of audit.samples){const d=relicDetails(index,r.id)!;expect(d.rewards.map(x=>x.reward.english)).toEqual(r.upstream.rewards.map(x=>x.itemName));expect(d.routes.map(x=>({planet:x.location.planet,node:x.location.node,gameMode:x.location.mode,rotation:x.link.rotation}))).toEqual(r.routes.map(x=>({planet:x.planet,node:x.node,gameMode:x.gameMode,rotation:x.rotation})));for(const x of [...d.rewards.map(x=>x.relation),...d.routes.map(x=>x.link)]){expect(x.sourceIds.length).toBeGreaterThan(0);expect(x.verification).toBe('snapshot-checked');}}
});
it('forward names and codes, era filtering and bounded reverse queries are consistent for all relations',()=>{
 const c=catalog(),index=createRelicIndex(c);expect(searchRelics(index,'g14').map(x=>x.id)).toEqual(['relic:lith:g14']);expect(searchRelics(index,'','Axi')).toHaveLength(3);expect(searchRewards(index,'福马').map(x=>x.id)).toEqual(['blueprint:forma']);expect(rewardRelics(index,'blueprint:forma')).toHaveLength(12);expect(searchRelics(index,'本目录未收录测试')).toEqual([]);expect(rewardRelics(index,'not-recorded')).toEqual([]);expect(relicDetails(index,'not-recorded')).toBeUndefined();
 for(const relation of c.relations)expect(rewardRelics(index,relation.rewardId).some(r=>r.id===relation.relicId)).toBe(true);
});
it('synthetic same-name different IDs stay distinct in search and reverse edges',()=>{
 const c=synthetic(),[a,b]=c.rewards.filter(r=>r.id!=='blueprint:forma');a.name=b.name='同名蓝图（合成测试数据）';a.english=b.english='Synthetic same name';const index=createRelicIndex(c);expect(searchRewards(index,'同名蓝图').map(r=>r.id)).toEqual([a.id,b.id]);for(const r of [a,b])expect(rewardRelics(index,r.id).map(x=>x.id)).toEqual(c.relics.filter(x=>c.relations.some(e=>e.rewardId===r.id&&e.relicId===x.id)).map(x=>x.id));
});
it('synthetic absent routes and unknown snapshot dates never become zero, current or complete sources',()=>{
 const c=synthetic(),r=c.relics[0];c.acquisitions=c.acquisitions.filter(x=>x.relicId!==r.id);r.sourceScope='unknown';c.sources[0].snapshotAt=null;const d=relicDetails(createRelicIndex(c),r.id)!;expect(d.routes).toEqual([]);expect(d.relic.availability).toBe('unknown');expect(c.sources[0].snapshotAt).toBeNull();
});
it('synthetic missing fields and dangling references are rejected before reaching a provider',()=>{
 for(const edit of [(c:RelicCatalog)=>{delete (c.rewards[0] as Partial<typeof c.rewards[number]>).type;},(c:RelicCatalog)=>{c.relations[0].rewardId='gone';},(c:RelicCatalog)=>{c.acquisitions[0].locationId='gone';},(c:RelicCatalog)=>{c.relations[0].sourceIds=['gone'];}]){const c=synthetic();edit(c);expect(()=>validateRelicCatalog(c)).toThrow(/遗物目录/);}
});
it('synthetic duplicate identities and duplicate reward relations cannot inflate complete tables',()=>{
 for(const edit of [(c:RelicCatalog)=>c.rewards.push({...c.rewards[0],english:'conflicting name'}),(c:RelicCatalog)=>c.rewards.push({...c.rewards[0],id:'synthetic:reward-alias'}),(c:RelicCatalog)=>c.relations.push({...c.relations[0],id:'synthetic:duplicate'}),(c:RelicCatalog)=>{c.relations.pop();}]){const c=synthetic();edit(c);expect(()=>validateRelicCatalog(c)).toThrow(/遗物目录/);}
});
it('synthetic conflicting routes remain conflicting even when a reward table was checked',()=>{
 const c=synthetic();c.acquisitions[0].verification='conflicting';c.acquisitions[0].rotation=null;const d=relicDetails(createRelicIndex(c),c.relics[0].id)!;expect(d.relic.rewardCompleteness).toBe('complete');expect(d.routes[0].link.verification).toBe('conflicting');expect(d.routes[0].link.rotation).toBeNull();expect(d.relic.availability).toBe('unknown');
});
it('synthetic invalid chances and unverifiable checked provenance are rejected, not coerced',()=>{
 for(const edit of [(c:RelicCatalog)=>{c.relations[0].openingChancePercent=-1;},(c:RelicCatalog)=>{c.acquisitions[0].dropChancePercent=101;},(c:RelicCatalog)=>{c.sources[0].checkedAt=null;}]){const c=synthetic();edit(c);expect(()=>validateRelicCatalog(c)).toThrow(/遗物目录/);}
});
it('changing synthetic display names and catalog order leaves stable relationships intact and queries do not mutate input',()=>{
 const c=synthetic();c.relics.reverse();c.rewards[0].name='显示名变更（合成测试数据）';const before=structuredClone(c),index=createRelicIndex(c);searchRelics(index,'');searchRewards(index,'');for(const r of c.relics)expect(relicDetails(index,r.id)!.rewards.map(x=>x.reward.id)).toEqual(c.relations.filter(x=>x.relicId===r.id).map(x=>x.rewardId));expect(c).toEqual(before);
});
it('LocalProvider deeply freezes its relic catalog independently of personal storage',()=>{
 const c=catalog();expect(Object.isFrozen(c)).toBe(true);expect(Object.isFrozen(c.relations[0])).toBe(true);expect(Object.isFrozen(c.relics)).toBe(true);
});
