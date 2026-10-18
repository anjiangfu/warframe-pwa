import {useState} from 'react';
import type {ProfileDocument} from '../domain/model';
import {previewProgress,type ProgressPreview} from '../domain/goals';
type Props={profiles:ProfileDocument[];activeId:string;busy:boolean;load:(id:string)=>Promise<ProfileDocument|undefined>;apply:(p:ProgressPreview,selected:string[])=>Promise<boolean>;onError:(text:string)=>void;onApplied:()=>void};
function display(value:string):string {
 let parsed:unknown;try{parsed=JSON.parse(value);}catch{return value;}
 if(parsed&&typeof parsed==='object'){
  const fact=parsed as {value:boolean|number|null;originalLabel?:string;entityId?:string};const text=fact.value===true?'是（用户声明）':fact.value===false?'否（用户声明）':fact.value===null?'未知':String(fact.value);
  return text+(fact.originalLabel?'；原称：'+fact.originalLabel:'')+(fact.originalLabel?(fact.entityId==='system:helminth-archon-shard-segment'?'；确认关联Helminth执刑官源力石升级模块':fact.entityId?'；保留旧实体关联':'；名称尚未关联'):'');
 }
 if(typeof parsed==='string')return ({done:'整体目标完成',focused:'关注',deferred:'暂缓','nami-solo:iv':'进化 IV（其他阶段不变）'} as Record<string,string>)[parsed]??parsed;
 return String(parsed);
}
export function ProgressDraft({profiles,activeId,busy,load,apply,onError,onApplied}:Props){
 const [open,setOpen]=useState(false),[target,setTarget]=useState(activeId),[entity,setEntity]=useState(''),[preview,setPreview]=useState<ProgressPreview>(),[selected,setSelected]=useState<string[]>([]),[confirmed,setConfirmed]=useState(false),[working,setWorking]=useState(false);
 async function prepare(){setWorking(true);try{const p=await load(target);if(!p)throw Error('档案不存在，请重新选择');const next=previewProgress(p,entity||null);setPreview(next);setSelected(next.rows.filter(r=>!r.conflict).map(r=>r.id));setConfirmed(false);}catch(e){onError(String(e));}finally{setWorking(false);}}
 async function commit(){if(!preview||!confirmed)return;setWorking(true);try{if(await apply(preview,selected)){setPreview(undefined);setOpen(false);setConfirmed(false);onApplied();}}finally{setWorking(false);}}
 function reset(){setPreview(undefined);setConfirmed(false);}
 return <section className="panel progress-draft"><div className="section-heading"><div><p className="eyebrow">你的近况 / 仅显式应用</p><h3>本次进度草案</h3><p>2026-10-18你提供的近况不会成为新档案默认值。</p></div><button onClick={()=>{setOpen(true);setTarget(activeId);reset();}}>预览本次进度草案</button></div>{open&&<div>
 <p>大嘴/原称模块已安装，毒囊整体养成完成；海波只关注IV，不补前序；1999等级3，其他集团仅记进展中。</p>
 <label>应用到哪个档案<select aria-label="草案目标档案" disabled={working||busy} value={target} onChange={e=>{setTarget(e.target.value);reset();}}>{profiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 <label>核对“原力石模块”的实体<select aria-label="草案模块关联" value={entity} disabled={working||busy} onChange={e=>{setEntity(e.target.value);reset();}}><option value="">保留原称，暂不关联（默认）</option><option value="system:helminth-archon-shard-segment">我确认是Helminth执刑官源力石升级模块</option></select></label><p className="microcopy">候选英文：Helminth Archon Shard Segment。不是Helminth联结模块；仅关联名称，不推断任何任务已开放。</p>
 <button disabled={working||busy} onClick={()=>void prepare()}>生成差异预览</button>
 {preview&&<div className="draft-diff" aria-label="草案差异预览"><p>目标档案：{profiles.find(p=>p.id===preview.profileId)?.name} · 档案版本 {preview.revision} · 尚未写入</p>{preview.rows.map(row=><label className={'draft-row '+(row.conflict?'conflict':'')} key={row.id}><input type="checkbox" aria-label={'应用 '+row.label} checked={selected.includes(row.id)} disabled={working||busy} onChange={e=>{setSelected(s=>e.target.checked?[...s,row.id]:s.filter(id=>id!==row.id));setConfirmed(false);}}/><span><strong>{row.label}</strong><small>{row.conflict?'冲突：默认不覆盖，勾选表示明确替换':'可选变更'}</small><code>原：{display(row.before)}</code><code>拟：{display(row.after)}</code></span></label>)}
 <label className="check"><input type="checkbox" aria-label="确认草案档案与所选差异" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>我已核对目标档案和所选差异，确认备份后应用</label><button className="primary" disabled={!confirmed||!selected.length||working||busy} onClick={()=>void commit()}>{working?'备份并应用中…':'确认应用所选草案'}</button></div>}
 <button disabled={working||busy} onClick={()=>{setOpen(false);reset();}}>取消草案，不写入</button></div>}</section>;
}
