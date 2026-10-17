import raw from './tech-tree.v1.json';
import guides from './weapon-guides.v1.json';
import type {WeaponCatalog} from '../domain/weapon';
import type {Catalog} from '../domain/model';
export interface DataProvider {getCatalog():Readonly<Catalog>;getWeaponCatalog():Readonly<WeaponCatalog>}
function freeze<T>(v:T):T {if(v&&typeof v==='object'){Object.freeze(v);Object.values(v).forEach(freeze);}return v;}
export class LocalProvider implements DataProvider {
 private catalog:Catalog;
 private weapons:WeaponCatalog;
 constructor(input:Catalog=raw as Catalog,weaponInput:WeaponCatalog=guides as WeaponCatalog){
  const c=structuredClone(input),ids=new Set(c.nodes.map(n=>n.id));
  if(ids.size!==c.nodes.length||new Set(c.lanes.map(l=>l.id)).size!==c.lanes.length)throw Error('目录ID重复');
  const steps=new Set<string>();
  for(const n of c.nodes){if(n.recommended.some(id=>!ids.has(id)))throw Error('目录依赖失去引用');for(const s of n.steps){if(steps.has(s.id))throw Error('步骤ID重复');steps.add(s.id);}}
  this.catalog=freeze(c);
  const w=structuredClone(weaponInput);const sourceIds=new Set(w.sources.map(s=>s.id)),materials=new Set(w.materials.map(m=>m.id)),locations=new Set(w.acquisitions.map(a=>a.id));
  if(sourceIds.size!==w.sources.length||materials.size!==w.materials.length||locations.size!==w.acquisitions.length||new Set(w.weapons.map(x=>x.id)).size!==w.weapons.length)throw Error('养成目录ID重复');
  const check=(ids:string[],known:Set<string>)=>{if(ids.some(id=>!known.has(id)))throw Error('养成目录引用不存在');};const stageIds=new Set<string>();
  for(const m of w.materials){check(m.sourceIds,sourceIds);check(m.acquisitionIds,locations);}for(const a of w.acquisitions)check(a.sourceIds,sourceIds);
  for(const weapon of w.weapons){check(weapon.sourceIds,sourceIds);check(weapon.acquisitionIds,locations);for(const cost of weapon.installCost){check([cost.materialId],materials);check(cost.sourceIds,sourceIds);if(!Number.isFinite(cost.quantity)||cost.quantity<0)throw Error('材料用量无效');}for(const stage of weapon.stages){if(stageIds.has(stage.id))throw Error('进化ID重复');stageIds.add(stage.id);check(stage.sourceIds,sourceIds);check(stage.locationIds,locations);}}
  this.weapons=freeze(w);
 }
 getCatalog(){return this.catalog;}
 getWeaponCatalog(){return this.weapons;}
}
