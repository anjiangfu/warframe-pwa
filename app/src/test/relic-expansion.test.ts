import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {LocalProvider} from '../catalog/provider';
import {createRelicIndex,relicDetails,rewardRelics,searchRewards,validateRelicCatalog,type RelicCatalog} from '../domain/relics';
const read=(name:string)=>JSON.parse(readFileSync('../docs/evidence/Relic_Query_v2/'+name,'utf8'));
const catalog=()=>new LocalProvider().getRelicCatalog();
it('expanded public catalog has all 31 audited real tables and 117 exact shared identities',()=>{
 const c=catalog(),i=createRelicIndex(c);expect(c.relics).toHaveLength(31);expect(c.rewards).toHaveLength(117);expect(c.relations).toHaveLength(186);expect(c.acquisitions).toHaveLength(62);expect(c.locations).toHaveLength(11);expect(c.routeRules).toHaveLength(6);
 for(const s of read('Samples.json')){const d=relicDetails(i,s.id)!;expect(d.rewards.map(x=>x.reward.english)).toEqual(s.upstream.rewards.map((x:{itemName:string})=>x.itemName));expect(d.rewards).toHaveLength(6);expect(d.relic.availability).toBe('unknown');expect(d.relic.sourceScope).toBe('partial');}
});
it('every field of the original 12/57/72/24/11/6 and sources is preserved without replacing IDs',()=>{
 const c=catalog(),old=read('Baseline_Catalog.json');for(const key of ['relics','rewards','relations','acquisitions','locations','routeRules','sources'] as const)expect(c[key]!.slice(0,old[key].length)).toEqual(old[key]);
});
it('all new rewards retain original English and checked combinations in search and exact reverse sets',()=>{
 const c=catalog(),i=createRelicIndex(c);for(const n of read('New_Name_Audit.json')){const r=c.rewards.find(x=>x.id===n.id)!;expect(searchRewards(i,r.english).map(x=>x.id)).toContain(r.id);expect(searchRewards(i,n.nameZh.replace(/\s+/g,'')).map(x=>x.id)).toContain(r.id);expect(rewardRelics(i,r.id).map(x=>x.id)).toEqual(c.relics.filter(x=>c.relations.some(e=>e.relicId===x.id&&e.rewardId===r.id)).map(x=>x.id));}
});
it('quantity reward refers to the sole existing Forma blueprint and is not a crafted Forma entity',()=>{
 const c=catalog(),r=c.rewards.find(r=>r.english==='2X Forma Blueprint')!;expect(r).toBeDefined();expect(Reflect.get(r,'bundleOf')).toEqual({rewardId:'blueprint:forma',quantity:2});expect(r.type).toBe('blueprint');expect(c.rewards.filter(r=>r.english==='Forma Blueprint').map(r=>r.id)).toEqual(['blueprint:forma']);
});
it('synthetic malformed bundle identities and quantities are rejected while old catalogs remain accepted',()=>{
 expect(()=>validateRelicCatalog(read('Baseline_Catalog.json'))).not.toThrow();for(const bundleOf of [{rewardId:'missing',quantity:2},{rewardId:'blueprint:forma',quantity:0},{rewardId:'blueprint:forma',quantity:1.5},{rewardId:'synthetic:bundle',quantity:2}]){const c=structuredClone(catalog()) as RelicCatalog,r={...c.rewards.find(x=>x.id==='blueprint:forma')!,id:'synthetic:bundle',upstreamId:'synthetic:bundle'};Reflect.set(r,'bundleOf',bundleOf);c.rewards.push(r);expect(()=>validateRelicCatalog(c)).toThrow(/遗物目录/);}
});
it('new routes only reuse the seven approved ordinary nodes and all unknown states remain unknown',()=>{
 const c=catalog(),old=read('Baseline_Catalog.json'),nodes=['Apollodorus','Lares','Odin','Romula','Coba','Tyana Pass','Ganymede'];for(const a of c.acquisitions.slice(old.acquisitions.length)){expect(nodes).toContain(c.locations.find(x=>x.id===a.locationId)!.node);expect(a.availability).toBe('unknown');expect(a.dropChancePercent).toBeNull();}for(const r of c.relations)expect(r.openingChancePercent).toBeNull();
});
