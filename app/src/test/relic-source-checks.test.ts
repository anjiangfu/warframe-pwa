import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {LocalProvider} from '../catalog/provider';
import {effectiveSourceCheck,matchesSourceCheckFilter,validateSourceChecks,type RelicSourceChecks} from '../domain/relic-source-checks';
const provider=new LocalProvider(),c=provider.getRelicCatalog(),checks=()=>structuredClone(provider.getRelicSourceChecks()!) as RelicSourceChecks;
const audit=JSON.parse(readFileSync('../docs/evidence/Relic_Source_Check_v0/Author_Audit.json','utf8'));
it('LocalProvider provides 62 frozen independent acquisition checks without changing the old catalog',()=>{
 const a=provider.getRelicSourceChecks()!;expect(a.records).toHaveLength(62);expect(Object.isFrozen(a)).toBe(true);expect(Object.isFrozen(a.document)).toBe(true);expect(Object.isFrozen(a.records[0])).toBe(true);expect(c).toEqual(JSON.parse(readFileSync('../docs/evidence/Relic_Source_Check_v0/Baseline_Catalog.json','utf8')));
});
it('every real dated proof matches the independent 62-row audit and leaves current availability unknown',()=>{
 const a=checks();for(const row of audit.acquisitions){const r=effectiveSourceCheck(c,a,row.acquisitionId);expect(r.status).toBe('listed');expect(r.record?.locator).toMatchObject({section:row.section,heading:row.heading,rotation:row.rotation,item:row.item});}expect(a.document?.publishedAt).toBe('2026-10-22');expect(a.document?.sha256).toBe(audit.sha256);for(const r of c.relics)expect(r.availability).toBe('unknown');for(const r of c.acquisitions)expect(r.availability).toBe('unknown');
});
it('old queries without attachment or without a row remain usable and explicitly unverified',()=>{
 const noAttachment=new LocalProvider(undefined,undefined,undefined,undefined,undefined,undefined,null);expect(noAttachment.getRelicSourceChecks()).toBeUndefined();expect(noAttachment.getRelicCatalog()).toEqual(c);
 const partial=checks();Reflect.deleteProperty(partial,'records');const missingList=new LocalProvider(undefined,undefined,undefined,undefined,undefined,undefined,partial);expect(missingList.getRelicSourceChecks()).toBeUndefined();expect(missingList.getRelicCatalog()).toEqual(c);
 expect(effectiveSourceCheck(c,undefined,c.acquisitions[0].id)).toMatchObject({status:'unverified',reason:'no-record'});const a=checks();a.records.shift();expect(effectiveSourceCheck(c,a,c.acquisitions[0].id).status).toBe('unverified');
});
it('synthetic missing dates or source hash cannot masquerade as listed',()=>{
 for(const key of ['publishedAt','retrievedAt','checkedAt','sha256']){const a=checks();Reflect.deleteProperty(a.document!,key);expect(()=>validateSourceChecks(a,c)).not.toThrow();expect(effectiveSourceCheck(c,a,c.acquisitions[0].id)).toMatchObject({status:'unverified',reason:'missing-evidence'});}
});
it('synthetic malformed hashes, impossible dates or date-only timestamps cannot claim dated evidence',()=>{
 for(const [key,value] of [['sha256','g'.repeat(64)],['publishedAt','2026-02-31'],['retrievedAt','2026-10-25'],['checkedAt','2026-10-25']]){const a=checks();Reflect.set(a.document!,key,value);expect(effectiveSourceCheck(c,a,a.records[0].acquisitionId).status).toBe('unverified');}
});
it('synthetic missing table, rotation or exact identity cannot count as not-listed',()=>{
 for(const key of ['tableRead','rotationRead']){const a=checks(),r=a.records[0];r.status='not-listed';r.matchCount=0;Reflect.set(r,key,false);expect(effectiveSourceCheck(c,a,r.acquisitionId).status).toBe('unverified');}const a=checks();a.records[0].locator!.section='relicRewards';expect(effectiveSourceCheck(c,a,a.records[0].acquisitionId).status).toBe('unverified');
});
it('synthetic well-evidenced missing row stays not-listed without implying permanent absence',()=>{
 const a=checks(),r=a.records[0];r.status='not-listed';r.matchCount=0;r.reason='missing-row';expect(effectiveSourceCheck(c,a,r.acquisitionId).status).toBe('not-listed');expect(c.acquisitions[0].availability).toBe('unknown');
});
it('synthetic conflict and unknown evidence stay pending even with a trusted translated reward table',()=>{
 const a=checks(),r=a.records[0];r.status='conflicting';r.matchCount=2;r.reason='duplicate-row';expect(effectiveSourceCheck(c,a,r.acquisitionId).status).toBe('conflicting');r.status='unverified';r.reason='parse-failed';expect(effectiveSourceCheck(c,a,r.acquisitionId).status).toBe('unverified');
});
it('filters use saved row checks and exact reverse membership, never default unknown to listed',()=>{
 const a=checks();expect(c.relics.filter(r=>matchesSourceCheckFilter(c,a,r.id,'listed'))).toHaveLength(31);expect(c.relics.filter(r=>matchesSourceCheckFilter(c,a,r.id,'pending'))).toHaveLength(0);expect(c.relics.filter(r=>matchesSourceCheckFilter(c,undefined,r.id,'pending'))).toHaveLength(31);expect(c.relics.filter(r=>matchesSourceCheckFilter(c,undefined,r.id,'listed'))).toHaveLength(0);a.records[0].status='conflicting';a.records[0].matchCount=2;expect(matchesSourceCheckFilter(c,a,c.acquisitions[0].relicId,'pending')).toBe(true);
});
it('synthetic duplicate IDs, dangling references, unsafe URLs and invalid dates are rejected',()=>{
 for(const edit of [(a:RelicSourceChecks)=>a.records.push(structuredClone(a.records[0])),(a:RelicSourceChecks)=>{a.records[0].acquisitionId='synthetic:missing';},(a:RelicSourceChecks)=>{a.document!.sourceUrl='javascript:synthetic';},(a:RelicSourceChecks)=>{a.document!.publishedAt='not-a-date';}]){const a=checks();edit(a);expect(()=>validateSourceChecks(a,c)).toThrow(/来源核验/);}
});
it('synthetic catalog version or PC scope mismatches do not claim official listed evidence',()=>{
 const a=checks();a.catalogVersion='synthetic:other';expect(effectiveSourceCheck(c,a,a.records[0].acquisitionId).status).toBe('unverified');a.catalogVersion=c.catalogVersion;a.document!.scope='synthetic-console';expect(effectiveSourceCheck(c,a,a.records[0].acquisitionId).status).toBe('unverified');
});
it('old saved dates are retained and no startup-time freshness or game access is inferred',()=>{
 const a=checks();a.document!.publishedAt='2020-01-01';a.document!.retrievedAt='2020-01-02T00:00:00Z';a.document!.checkedAt='2020-01-03T00:00:00Z';const r=effectiveSourceCheck(c,a,a.records[0].acquisitionId);expect(r.document?.checkedAt).toBe('2020-01-03T00:00:00Z');expect(r.status).toBe('listed');expect(c.relics[0].availability).toBe('unknown');
});
it('all public proof lookups and filters are pure and cannot change the old personal contracts',()=>{
 const a=checks(),before=structuredClone(a),catalogBefore=structuredClone(c);for(const r of c.relics)for(const f of ['all','listed','not-listed','pending'] as const)matchesSourceCheckFilter(c,a,r.id,f);for(const row of c.acquisitions)effectiveSourceCheck(c,a,row.id);expect(a).toEqual(before);expect(c).toEqual(catalogBefore);
});
