import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {LocalProvider} from '../catalog/provider';
import {createRelicIndex,relicDisplayName,resolveRelicGuide,searchRelics,searchRewards,rewardRelics,validateRelicCatalog,type RelicCatalog} from '../domain/relics';
const catalog=()=>new LocalProvider().getRelicCatalog();
const legacy=()=>JSON.parse(readFileSync('../docs/evidence/Relic_Query_v1/Relic_Graph_Baseline.json','utf8')) as RelicCatalog;
const names=JSON.parse(readFileSync('../docs/evidence/Relic_Query_v1/Name_Audit.json','utf8')) as {id:string;nameZh:string;status:string;hits?:{parentId:string;componentId:string;parentProperNameRemainsLatin:boolean}[]}[];
// Mutated catalogs are synthetic test data only, never displayed in the shipped catalog.
const synthetic=()=>structuredClone(catalog()) as RelicCatalog;
it('v1 retains every old identity, English key, reward/source edge and unknown availability',()=>{
 const old=legacy(),c=catalog();for(const key of ['relics','rewards','relations','locations','acquisitions'] as const){expect(c[key]!.length).toBeGreaterThanOrEqual(old[key].length);for(const [i,row]of old[key].entries())for(const [field,value]of Object.entries(row))expect((c[key][i] as unknown as Record<string,unknown>)[field]).toEqual(value);}
 expect(c.relics.slice(0,12)).toHaveLength(12);expect(c.rewards.slice(0,57)).toHaveLength(57);expect(c.relations.slice(0,72)).toHaveLength(72);expect(c.acquisitions.slice(0,24)).toHaveLength(24);
});
it('all 56 audited names are searchable in Chinese combinations and exact old English without changing reverse membership',()=>{
 const c=catalog(),index=createRelicIndex(c),old=createRelicIndex(legacy());for(const n of names){const r=c.rewards.find(x=>x.id===n.id)!;if(n.status==='added'){expect(r.display?.nameZh).toBe(n.nameZh);expect(r.display?.upstreamIds).toEqual([n.hits![0].parentId,n.hits![0].componentId]);expect(r.display?.properNameUntranslated).toBe(n.hits![0].parentProperNameRemainsLatin);expect(searchRewards(index,n.nameZh).some(x=>x.id===n.id)).toBe(true);}expect(searchRewards(index,r.english).some(x=>x.id===r.id)).toBe(true);expect(rewardRelics(index,r.id).filter(x=>old.catalog.relics.some(o=>o.id===x.id)).map(x=>x.id)).toEqual(rewardRelics(old,r.id).map(x=>x.id));expect(relicDisplayName(r)).toContain(r.english);}
});
it('four verified era names and original era/code queries coexist with independently marked Latin proper names',()=>{
 const c=catalog(),index=createRelicIndex(c);for(const [zh,en] of [['古纪','Lith'],['前纪','Meso'],['中纪','Neo'],['后纪','Axi']])expect(searchRelics(index,zh).map(x=>x.id)).toEqual(searchRelics(index,en).map(x=>x.id));expect(searchRelics(index,'g14')[0].id).toBe('relic:lith:g14');expect(c.rewards.slice(0,57).filter(r=>r.display?.properNameUntranslated)).toHaveLength(17);for(const r of c.rewards.filter(r=>r.display))expect(searchRewards(index,r.display!.nameZh.replace(/\s+/g,'')).some(x=>x.id===r.id)).toBe(true);
});
it('all eleven locations have entry/category/rule evidence while the original Caches and Defense keys remain unchanged',()=>{
 const c=catalog();for(const l of c.locations){expect(l.guide?.entry).toBeTruthy();expect(resolveRelicGuide(c,l.id,'B')).toBeDefined();}
 const mirror=c.locations.find(l=>l.node==='Tyana Pass')!;expect(mirror.mode).toBe('Defense');expect(mirror.guide?.ruleId).toBe('relic-rule:mirror');expect(mirror.guide?.exception?.sourceIds).toContain('pc-mirror32');expect(resolveRelicGuide(c,mirror.id,'C')!.rotationText).toContain('第4次完整双侧');
 for(const l of c.locations.filter(l=>l.mode==='Caches')){expect(l.guide?.extraCategory).toContain('非基础任务模式');expect(l.guide?.triggerVerification).toBe('unverified');expect(resolveRelicGuide(c,l.id,'B')!.rotationVerification).toBe('unverified');}
});
it('collected mode descriptions use three-wave defense, timed-game survival, decoded-message interception and performance-based disruption',()=>{
 const c=catalog(),r=(id:string)=>c.routeRules!.find(x=>x.id==='relic-rule:'+id)!;expect(r('defense').steps.join('')).toContain('每3波');expect(r('defense').rotationNotes.C).toContain('12波');expect(r('survival').steps.join('')).toContain('安全旁路');expect(r('survival').steps.join('')).toContain('不等于现实');expect(r('interception').rotationNotes.B).toContain('不是占领B塔');expect(r('disruption').steps.join('')).toContain('不采用AABC');expect(r('disruption').rotationNotes.C).toContain('成功守住4根');
});
it('legacy catalogs without any optional fields still validate and use the old readable fallback',()=>{
 const c=legacy();expect(()=>validateRelicCatalog(c)).not.toThrow();expect(resolveRelicGuide(c,c.locations[0].id,'B')).toBeUndefined();expect(relicDisplayName(c.rewards[0])).toContain(c.rewards[0].english);expect(searchRewards(createRelicIndex(c),'福马')[0].id).toBe('blueprint:forma');
});
it('synthetic conflicting or unverified names do not silently become trusted aliases',()=>{
 for(const verification of ['unverified','conflicting'] as const){const c=synthetic(),r=c.rewards.find(r=>r.display)!;r.display!.nameZh='合成测试待核专名';r.display!.aliases=['合成测试别名'];r.display!.verification=verification;const index=createRelicIndex(c);expect(searchRewards(index,'合成测试别名')).toEqual([]);expect(relicDisplayName(r)).not.toContain('合成测试待核专名');expect(searchRewards(index,r.english).some(x=>x.id===r.id)).toBe(true);}
});
it('synthetic optional-field mistakes and unaudited exceptions fail validation instead of upgrading evidence',()=>{
 for(const edit of [(c:RelicCatalog)=>{c.rewards[0].display!.sourceIds=['missing'];},(c:RelicCatalog)=>{c.locations[0].guide!.ruleId='missing';},(c:RelicCatalog)=>{c.routeRules![0].steps=[];},(c:RelicCatalog)=>{c.rewards[0].display!.aliases=[''];},(c:RelicCatalog)=>{c.locations.find(l=>l.guide?.exception)!.guide!.exception!.sourceIds=[];}]){const c=synthetic();edit(c);expect(()=>validateRelicCatalog(c)).toThrow(/遗物目录/);}
});
it('synthetic missing rotation notes stay unknown and an explicitly evidenced exception remains separate',()=>{
 const c=synthetic(),l=c.locations.find(l=>l.node==='Ganymede')!;const a=resolveRelicGuide(c,l.id,'A')!;expect(a.rotationVerification).toBe('unverified');expect(a.rotationText).toContain('未核');expect(a.rotationText).not.toBe('0');const mirror=c.locations.find(l=>l.node==='Tyana Pass')!;expect(resolveRelicGuide(c,mirror.id,'C')!.guide.exception?.verification).toBe('snapshot-checked');expect(mirror.mode).toBe('Defense');
});
it('synthetic mixed evidence never upgrades current availability or a conflicting route from translated names',()=>{
 const c=synthetic(),l=c.locations[0];l.guide!.modeVerification='conflicting';c.acquisitions[0].verification='conflicting';const before=structuredClone(c);expect(resolveRelicGuide(c,l.id,'B')!.guide.modeVerification).toBe('conflicting');expect(c.acquisitions[0].verification).toBe('conflicting');expect(c.acquisitions[0].availability).toBe('unknown');expect(c).toEqual(before);
});
it('synthetic identical Chinese display names remain different stable entities',()=>{
 const c=synthetic(),[a,b]=c.rewards.filter(r=>r.display);a.display!.nameZh=b.display!.nameZh='同名中文（合成测试数据）';const index=createRelicIndex(c);expect(searchRewards(index,'同名中文').map(r=>r.id)).toEqual([a.id,b.id]);for(const r of [a,b])expect(rewardRelics(index,r.id).map(x=>x.id)).toEqual(c.relics.filter(x=>c.relations.some(e=>e.rewardId===r.id&&e.relicId===x.id)).map(x=>x.id));
});
it('all public bilingual and rule queries leave the catalog and personal data contract untouched',()=>{
 const c=synthetic(),before=structuredClone(c),index=createRelicIndex(c);for(const n of names)searchRewards(index,n.nameZh);for(const l of c.locations)resolveRelicGuide(c,l.id,'C');searchRelics(index,'古纪');expect(c).toEqual(before);
});
