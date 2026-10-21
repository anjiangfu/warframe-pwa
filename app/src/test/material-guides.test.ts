import {expect,it} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import extra from '../catalog/resources.v1.json';
import baseline from '../../../docs/evidence/Material_Guides_v1/Baseline_Contracts.json';
import type {ResourceCatalog} from '../domain/resources';
import {planRecipe} from '../domain/crafting';
const provider=new LocalProvider(),catalog=provider.getResourceCatalog();
const routes=(id:string)=>catalog.resources.find(r=>r.id===id)!.acquisitionIds.map(id=>catalog.acquisitions.find(a=>a.id===id)!);
const input=()=>structuredClone(extra) as ResourceCatalog;

it('keeps all 23 resource identities without duplicate inventories or renamed IDs',()=>{
 expect(catalog.resources.map(({id,name,english,aliases})=>({id,name,english,aliases}))).toEqual(baseline.identities);
 expect(new Set(catalog.resources.map(r=>r.id)).size).toBe(23);
 expect(catalog.resources.find(r=>r.id==='credits')!.aliases).toContain('霍币');
});
it('each active material route has explicit independent verification, date, executable action and resolving evidence',()=>{
 for(const resource of catalog.resources){expect(resource.acquisitionIds.length).toBeGreaterThan(0);for(const route of routes(resource.id)){
  expect(['verified','unverified','conflicting']).toContain(Reflect.get(route,'verification'));
  expect(Reflect.get(route,'checkedAt')).toMatch(/^2026-10-2[01]$/);
  expect(route.place.length).toBeGreaterThan(8);expect(route.mode.length).toBeGreaterThan(4);
  expect(route.action.split('。').filter(Boolean).length).toBeGreaterThanOrEqual(2);expect(route.restrictions.length).toBeGreaterThan(0);
  expect(route.sourceIds.length).toBeGreaterThan(0);for(const id of route.sourceIds)expect(catalog.sources.some(s=>s.id===id)).toBe(true);
  expect(route.action).not.toMatch(/全服最快|每分钟|保证必掉/);
 }}
});
it('locates ordinary, city and laboratory routes separately with documented modes and original node names',()=>{
 for(const [id,place,mode] of [['material:morphics','Tolstoj','刺杀'],['material:neural-sensors','Themisto','刺杀'],['material:neurodes','Mariana','歼灭'],['material:orokin-cell','Telesto','歼灭'],['material:efervon-sample','Mausoleum East','歼灭'],['material:techrot-motherboard','Rhu Manor','歼灭'],['material:entrati-obols','Nex','歼灭'],['material:necracoil','Nex','歼灭']]){
  expect(routes(id)[0].place).toContain(place);expect(routes(id)[0].mode).toContain(mode);
 }
 expect(routes('material:necracoil')[0].place).toContain('实验室');expect(routes('material:efervon-sample')[0].action).toContain('NavNow');
});
it('plant routes stay unverified with a useful alternative and shared treasure instructions keep six distinct resources',()=>{
 for(const id of ['material:yao-shrub','material:eevani'])for(const a of routes(id)){expect(Reflect.get(a,'verification')).toBe('unverified');expect(a.restrictions.join('')).toContain('待更新');expect(a.restrictions.join('')).toContain('令');}
 expect(routes('material:yao-shrub')[0].place).toContain('Soprano Springs');expect(routes('material:eevani')).toHaveLength(2);
 expect(routes('material:eevani')[1].place).toContain('Amphitheater');
 const treasures=catalog.resources.filter(r=>r.id.startsWith('treasure:'));expect(treasures).toHaveLength(6);expect(new Set(treasures.map(r=>r.name)).size).toBe(6);
 expect(routes(treasures[0].id)[0].restrictions.join('')).toContain('不保证');
});
it('preserves all recipes, weapon tasks, syndicate costs and goal contracts while updating acquisition documents only',()=>{
 expect(provider.getCraftingCatalog().recipes).toEqual(baseline.recipes);expect(provider.getWeaponCatalog().weapons).toEqual(baseline.weapons);
 expect(provider.getSyndicateCatalog().syndicates).toEqual(baseline.syndicates);expect(provider.getGoalCatalog().goals).toEqual(baseline.goals);
});
it('rejects invalid route metadata and unsupported proof but accepts legacy records without inferring verification',()=>{
 for(const fields of [{verification:'official',checkedAt:'2026-10-20'},{verification:'verified',checkedAt:undefined},{verification:'verified',checkedAt:'2026-02-31'},{verification:'verified',checkedAt:'2026-10-20',sourceIds:[]}]){
  const c=input();Object.assign(c.acquisitions[0],fields);expect(()=>new LocalProvider(undefined,undefined,undefined,c)).toThrow('核验');
 }
 const old=input();for(const a of old.acquisitions){Reflect.deleteProperty(a,'verification');Reflect.deleteProperty(a,'checkedAt');}
 const legacy=new LocalProvider(undefined,undefined,undefined,old).getResourceCatalog();
 expect(Reflect.get(legacy.acquisitions.find(a=>a.id===old.acquisitions[0].id)!,'verification')).toBeUndefined();
});
it('acquisition confidence never changes crafting quantity confidence or calculated deficits',()=>{
 const c=input();for(const a of c.acquisitions)Object.assign(a,{verification:'unverified',checkedAt:'2026-10-20'});
 const unknownRoutes=new LocalProvider(undefined,undefined,undefined,c),recipe=unknownRoutes.getCraftingCatalog().recipes[0];
 expect(planRecipe(recipe,1,{})).toEqual(planRecipe(provider.getCraftingCatalog().recipes[0],1,{}));
 expect(recipe.inputs.every(x=>x.verification==='verified')).toBe(true);
});
