import {useState} from 'react';
import type {ProfileDocument} from '../domain/model';
import {searchResources,type ResourceCatalog} from '../domain/resources';
import {MaterialDetail} from './MaterialDetail';
export function MaterialsPage({catalog,profile,initialId,required,returnToCrafting,mutate,onError}:{catalog:Readonly<ResourceCatalog>;profile?:ProfileDocument;initialId?:string;required?:number|null;returnToCrafting?:()=>void;mutate:(edit:(p:ProfileDocument)=>void,description:string)=>Promise<boolean>;onError:(s:string)=>void}){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState(initialId);const found=searchResources(catalog,query);
 return <section className="assistant-page materials-page"><header className="section-heading"><div><p className="eyebrow">小型本地目录 / 离线查询</p><h2>材料查询</h2><p>查获取方式，记录持有量。库存与档案、制作页面共用。</p></div><span className="guide-version">资料 {catalog.catalogVersion}</span></header>{returnToCrafting&&<button onClick={returnToCrafting}>返回制作缺口</button>}<label className="guide-search">中文名、英文名或已核别名<input aria-label="搜索材料" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如：神经元 / Neurodes"/></label><div className="resource-list">{found.map(r=><button key={r.id} onClick={()=>setSelected(r.id)} aria-pressed={selected===r.id}>材料 {r.name}（{r.english}）</button>)}</div>{!found.length&&<p>当前小型目录未收录匹配项；不代表游戏中不存在。</p>}{selected&&<MaterialDetail catalog={catalog} resourceId={selected} profile={profile} required={selected===initialId?required:undefined} mutate={mutate} onError={onError} onBack={()=>setSelected(undefined)}/>}</section>;
}
