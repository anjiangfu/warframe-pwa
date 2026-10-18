import type {Acquisition,GuideMaterial,GuideSource,WeaponCatalog} from './weapon';
export interface Resource extends GuideMaterial {kind?:'material'|'currency'|'blueprint'|'product'}
export interface ResourceCatalog {catalogVersion:string;resources:Resource[];acquisitions:Acquisition[];sources:GuideSource[]}
export function findResource(c:Readonly<ResourceCatalog>,id:string){return c.resources.find(r=>r.id===id);}
export function searchResources(c:Readonly<ResourceCatalog>,query:string){const q=query.trim().toLocaleLowerCase();return c.resources.filter(r=>!q||[r.name,r.english,...r.aliases].some(x=>x.toLocaleLowerCase().includes(q)));}
export function combineResources(w:Readonly<WeaponCatalog>,extra:ResourceCatalog):ResourceCatalog {
 const c={catalogVersion:extra.catalogVersion,resources:[...w.materials,...extra.resources],sources:[...w.sources,...extra.sources],acquisitions:[...w.acquisitions,...extra.acquisitions]};
 for(const list of [c.resources,c.sources,c.acquisitions])if(new Set(list.map(x=>x.id)).size!==list.length)throw Error('资源目录ID重复');
 const sources=new Set(c.sources.map(x=>x.id)),acquisitions=new Set(c.acquisitions.map(x=>x.id));
 for(const r of c.resources)if(r.sourceIds.some(id=>!sources.has(id))||r.acquisitionIds.some(id=>!acquisitions.has(id)))throw Error('资源资料引用无效');
 for(const a of c.acquisitions)if(a.sourceIds.some(id=>!sources.has(id)))throw Error('获取来源引用无效');return c;
}
