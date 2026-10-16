import raw from './tech-tree.v1.json';
import type {Catalog} from '../domain/model';
export interface DataProvider {getCatalog():Readonly<Catalog>}
function freeze<T>(v:T):T {if(v&&typeof v==='object'){Object.freeze(v);Object.values(v).forEach(freeze);}return v;}
export class LocalProvider implements DataProvider {
 private catalog:Catalog;
 constructor(input:Catalog=raw as Catalog){
  const c=structuredClone(input),ids=new Set(c.nodes.map(n=>n.id));
  if(ids.size!==c.nodes.length||new Set(c.lanes.map(l=>l.id)).size!==c.lanes.length)throw Error('目录ID重复');
  const steps=new Set<string>();
  for(const n of c.nodes){if(n.recommended.some(id=>!ids.has(id)))throw Error('目录依赖失去引用');for(const s of n.steps){if(steps.has(s.id))throw Error('步骤ID重复');steps.add(s.id);}}
  this.catalog=freeze(c);
 }
 getCatalog(){return this.catalog;}
}
