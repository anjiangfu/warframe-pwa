import raw from './tech-tree.v1.json';
import guides from './weapon-guides.v1.json';
import goals from './goals.v1.json';
import resources from './resources.v1.json';
import crafting from './crafting.v1.json';
import syndicates from './syndicates.v1.json';
import relics from './relics.v1.json';
import sourceChecks from './relic-source-checks.v1.json';
import primeEquipment from './prime-equipment.v1.json';
import {createEquipmentIndex,type EquipmentMetadata} from '../domain/prime-equipment';
import {validateSourceChecks,type RelicSourceChecks} from '../domain/relic-source-checks';
import {validateRelicCatalog,type RelicCatalog} from '../domain/relics';
import type {SyndicateCatalog} from '../domain/syndicates';
import {combineResources,type ResourceCatalog} from '../domain/resources';
import {positiveInteger,type CraftingCatalog} from '../domain/crafting';
import type {GoalCatalog} from '../domain/goals';
import type {WeaponCatalog} from '../domain/weapon';
import type {Catalog} from '../domain/model';
export interface DataProvider {getCatalog():Readonly<Catalog>;getWeaponCatalog():Readonly<WeaponCatalog>;getGoalCatalog():Readonly<GoalCatalog>;getResourceCatalog():Readonly<ResourceCatalog>;getCraftingCatalog():Readonly<CraftingCatalog>;getSyndicateCatalog():Readonly<SyndicateCatalog>;getRelicCatalog():Readonly<RelicCatalog>;getRelicSourceChecks?():Readonly<RelicSourceChecks>|undefined;getPrimeEquipmentCatalog?():Readonly<EquipmentMetadata>|undefined}
function freeze<T>(v:T):T {if(v&&typeof v==='object'){Object.freeze(v);Object.values(v).forEach(freeze);}return v;}
export class LocalProvider implements DataProvider {
 private catalog:Catalog;
 private weapons:WeaponCatalog;
 private goals:GoalCatalog;
 private resources:ResourceCatalog;
 private crafting:CraftingCatalog;
 private syndicates:SyndicateCatalog;
 private relics:RelicCatalog;
 private sourceChecks:RelicSourceChecks|undefined;
 private equipment:EquipmentMetadata|undefined;
 constructor(input:Catalog=raw as Catalog,weaponInput:WeaponCatalog=guides as WeaponCatalog,goalInput:GoalCatalog=goals as GoalCatalog,resourceInput:ResourceCatalog=resources as ResourceCatalog,craftInput:CraftingCatalog=crafting as CraftingCatalog,syndicateInput:SyndicateCatalog=syndicates as SyndicateCatalog,checkInput:RelicSourceChecks|null=sourceChecks as RelicSourceChecks,equipmentInput:EquipmentMetadata|null=primeEquipment as EquipmentMetadata){
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
  const g=structuredClone(goalInput);if(new Set(g.goals.map(x=>x.id)).size!==g.goals.length)throw Error('目标ID重复');
  // An injected test catalog may deliberately omit production weapon references.
  for(const goal of g.goals){if(!['weapon','installation','crafting','syndicate'].includes(goal.kind)||goal.treeNodeIds.some(id=>!ids.has(id)))throw Error('目标目录关系无效');}
  this.goals=freeze(g);
  const resourceCatalog=combineResources(w,structuredClone(resourceInput));this.resources=freeze(resourceCatalog);
  const cc=structuredClone(craftInput),resourceIds=new Set(resourceCatalog.resources.map(r=>r.id)),allSources=new Set(resourceCatalog.sources.map(r=>r.id));
  if(new Set(cc.recipes.map(r=>r.id)).size!==cc.recipes.length)throw Error('配方ID重复');
  for(const r of cc.recipes){if(new Set(r.inputs.map(x=>x.resourceId)).size!==r.inputs.length)throw Error('配方投入ID重复');if(r.sourceIds.some(id=>!allSources.has(id)))throw Error('配方来源无效');for(const a of [r.output,...r.inputs]){if(!resourceIds.has(a.resourceId)||a.sourceIds.some(id=>!allSources.has(id)))throw Error('配方资源或来源引用无效');if(a.quantity!==null&&!positiveInteger(a.quantity)||a.verification==='verified'&&!positiveInteger(a.quantity))throw Error('配方数量无效');if(!['verified','unverified','conflicting'].includes(a.verification))throw Error('配方核验状态无效');}}
  this.crafting=freeze(cc);
  const sc=structuredClone(syndicateInput),stepIds=new Set<string>();if(new Set(sc.syndicates.map(x=>x.id)).size!==sc.syndicates.length)throw Error('集团ID重复');
  const provenance=(a:{verification:string;sourceIds:string[];checkedAt:string})=>{if(!['verified','unverified','conflicting'].includes(a.verification)||typeof a.checkedAt!=='string'||a.sourceIds.some(id=>!allSources.has(id)))throw Error('集团来源或核验无效');};
  for(const d of sc.syndicates){if(!Number.isSafeInteger(d.maxRank)||d.maxRank<1||!d.rankFactId||!d.standingFactId||d.rankFactId===d.standingFactId||new Set(d.members.map(m=>m.id)).size!==d.members.length||d.sourceIds.some(id=>!allSources.has(id)))throw Error('集团定义无效');const adjacent=new Set<number>();for(const step of d.steps){if(stepIds.has(step.id)||adjacent.has(step.from)||!Number.isSafeInteger(step.from)||step.from<0||step.to!==step.from+1||step.to>d.maxRank)throw Error('集团相邻步骤无效');stepIds.add(step.id);adjacent.add(step.from);provenance(step.conditions);if(typeof step.conditions.finale!=='boolean'||typeof step.conditions.likedForFinale!=='boolean')throw Error('集团条件无效');if(new Set(step.sacrifices.map(x=>x.resourceId)).size!==step.sacrifices.length)throw Error('集团祭品重复');for(const a of [step.standing,...step.sacrifices]){provenance(a);if(a.quantity!==null&&(!Number.isSafeInteger(a.quantity)||a.quantity<0))throw Error('集团用量无效');}for(const a of step.sacrifices)if(!resourceIds.has(a.resourceId))throw Error('集团资源引用无效');}}
  this.syndicates=freeze(sc);
  const rc=structuredClone(relics);validateRelicCatalog(rc);this.relics=freeze(rc);
  const checks=checkInput?structuredClone(checkInput):undefined;
  if(checks?.schemaVersion===1&&checks.checkVersion&&checks.catalogVersion&&Array.isArray(checks.records)){validateSourceChecks(checks,rc);this.sourceChecks=freeze(checks);}
  if(equipmentInput&&createEquipmentIndex(rc,equipmentInput).status==='ready')this.equipment=freeze(structuredClone(equipmentInput));
 }
 getCatalog(){return this.catalog;}
 getWeaponCatalog(){return this.weapons;}
 getGoalCatalog(){return this.goals;}
 getResourceCatalog(){return this.resources;}
 getCraftingCatalog(){return this.crafting;}
 getSyndicateCatalog(){return this.syndicates;}
 getRelicCatalog(){return this.relics;}
 getRelicSourceChecks(){return this.sourceChecks;}
 getPrimeEquipmentCatalog(){return this.equipment;}
}
