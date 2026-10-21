import {useState} from 'react';
import type {ActionItem,deriveActions} from '../domain/actions';

const summaryLabels={empty:'暂无当前材料清单',incomplete:'需求不完整，不能判断总量',unknown:'库存未知，缺口待核',missing:'已知材料有缺口',sufficient:'已知用量满足，游戏前提仍需核对'};
const conditionLabels={satisfied:'满足',unmet:'未满足',unknown:'未知'};
type Props={model:ReturnType<typeof deriveActions>;busy:boolean;openGoal:(item:ActionItem)=>void;openMaterial:(item:ActionItem,id:string)=>void;openShared:()=>void;openBackup:()=>void;browse:()=>void};
export function ActionOverview({model,busy,openGoal,openMaterial,openShared,openBackup,browse}:Props){
 const [expanded,setExpanded]=useState(false),visible=expanded?model.items:model.items.slice(0,3),knownMissing=model.summary.rows.filter(line=>line.deficit!==null&&line.deficit>0);
 return <section className="panel action-overview" role="region" aria-label="行动清单">
  <div className="section-heading"><div><p className="eyebrow">已保存记录 / 只读行动概览</p><h2>行动清单</h2></div><span data-testid="action-budget">每日预算：{model.dailyMinutes===null?'未填写':model.dailyMinutes+'分钟'} · 耗时未估</span></div>
  <p>先列你关注的目标，其余按资料顺序。没有耗时或收益证据，不承诺几局、天数或预算内完成；以下不会自动扣料或更新进度。</p>
  {!model.items.length?<div className="action-empty"><h3>尚无已记录的行动目标</h3><p>可在下方详情核对并关注目标，或到制作、集团页保存计划。完成、暂缓与已安装项目不重复安排；没有把隐藏项当作完成。</p><button disabled={busy} onClick={browse}>查看目标核对入口</button></div>:<>
   <p data-testid="action-count">共{model.items.length}条行动，当前显示{visible.length}条</p>
   <div className="action-cards">{visible.map(item=><article key={item.id} data-testid={'action:'+item.id}>
    <p className="eyebrow">{item.focused?'已关注':'已有记录 · 待核对'}</p><h3>{item.title}</h3><h4>下一步</h4><p data-testid="action-next">{item.next}</p><h4>原因</h4><p>{item.reason}</p>
    <p className="action-entry">核对入口：{item.entry}</p>
    {item.conditions&&<div className="action-conditions">{item.conditions.map(c=><p key={c.label}>{c.label}：{c.text??conditionLabels[c.state]}</p>)}</div>}
    {item.candidate&&<div className="action-candidate"><b>候选地点 · {item.candidate.verification==='verified'?'路线已对照资料':item.candidate.verification==='conflicting'?'路线资料有冲突':item.candidate.verification==='unverified'?'路线待核':'核验未记录'}</b><p>{item.candidate.place}</p><p>{item.candidate.mode}</p><small>核对日期：{item.candidate.checkedAt??'未记录'}；这里只展示已有线索，不代表你已解锁或一定能参加。</small></div>}
    {item.unknowns.length>0&&<><h4>未知事项 / 开始前核对</h4><ul>{item.unknowns.map((text,i)=><li key={i}>{text}</li>)}</ul></>}
    <div className="action-links"><button disabled={busy} onClick={()=>item.goal?openGoal(item):openBackup()}>{!item.goal?'查看保留记录':item.goal.kind==='crafting'?'查看制作需求':item.goal.kind==='syndicate'?'查看晋升条件':item.stageId?'查看操作攻略':'查看目标详情'}</button>{item.materials.map(m=><button key={m.id} disabled={busy} onClick={()=>openMaterial(item,m.id)}>查看材料 {m.title}</button>)}</div><p className="microcopy">耗时未估；单项目材料入口不作共享库存分配，合计请看下方唯一汇总入口。</p>
   </article>)}</div>
   {model.items.length>3&&<button className="action-expand" onClick={()=>setExpanded(v=>!v)}>{expanded?'收起为前三条':`展开全部${model.items.length}条行动`}</button>}
  </>}
  <div className="action-shared"><h3>当前共享材料</h3><p data-testid="action-summary-state">{summaryLabels[model.summary.materialState]}</p><p data-testid="action-known-missing">{knownMissing.length?<>已知共享缺项：{knownMissing.map(line=>(model.resourceNames[line.resourceId]??line.resourceId)+' '+line.deficit).join('；')}{!model.summary.requirementsComplete&&'（仅已知部分，完整需求未定）'}</>:<>当前没有确定的共享缺口；未知不表示不需要材料。</>}</p><p>同资源先合计，再抵扣一次库存；不把各项目差值相加，也不按地点文字合并刷图任务。</p><ul data-testid="action-contributors">{model.contributors.map(c=><li key={c.id}>{c.title}</li>)}</ul>{model.summary.issues.length>0&&<details><summary>查看未确认需求</summary><ul>{model.summary.issues.map((text,i)=><li key={i}>{text}</li>)}</ul></details>}<button disabled={busy} onClick={openShared}>查看当前共享汇总</button></div>
  {model.notices.length>0&&<aside className="guide-notice">{model.notices.map((text,i)=><p key={i}>{text}</p>)}</aside>}
 </section>;
}
