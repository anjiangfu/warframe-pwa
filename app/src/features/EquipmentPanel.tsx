import type {EquipmentGroup,EquipmentMetadata} from '../domain/prime-equipment';
import {relicDisplayName,type RelicReward} from '../domain/relics';
const types={blueprint:'蓝图',component:'部件',item:'成品／物品',unknown:'类型待核'};
export function EquipmentPanel({group,visible,metadata,expanded,setExpanded,reverse}:{group:EquipmentGroup;visible:RelicReward[];metadata:EquipmentMetadata;expanded:boolean;setExpanded:(value:boolean)=>void;reverse:(id:string)=>void}){
 const p=group.parent;
 return <section className="panel equipment-detail" role="region" aria-label="装备关联奖励"><p className="eyebrow">装备 → 关联奖励 → 遗物 → 来源摘录</p><h3>{p.nameZh}{p.nameZh!==p.english&&`（${p.english}）`}</h3>{p.namePending&&<p className="equipment-pending">中文专名待核；保留固定上游原文。</p>}<p className="guide-notice">仅本目录关联奖励种类。不是完整制作配方／全套清单，不核算制作数量；未列出不代表游戏不存在或不能获取。</p><p data-testid="equipment-counts">未筛总数 {group.rewards.length} 项 · 筛选后 {visible.length} 项</p><p>以下仅显示符合当前来源核验筛选的奖励种类，不代表完整部件表。蓝图、部件、成品／物品分别标注；不记录个人持有或进度。</p>
  <div className="relic-result-list equipment-rewards">{visible.map(r=><button key={r.id} data-equipment-reward-id={r.id} onClick={()=>reverse(r.id)}><b>{relicDisplayName(r)}</b><small>{types[r.type]} · 查看原奖励反查</small></button>)}</div>
  {!visible.length&&<p>当前核验筛选无匹配，不代表没有获取方式。</p>}
  <details open={expanded} onToggle={e=>setExpanded(e.currentTarget.open)}><summary>父装备名称与关联出处</summary><p>装备身份：{p.id}</p><p>版本：{metadata.catalogVersion} · 固定资料核对：{metadata.checkedAt}。这是固定包资料的人工核对日期，不代表游戏资料已更新或当前准入已核。</p><p>仅取同ID父名和本目录组件身份，不取配方数量。原部件组合名与来源沿用原奖励。</p><ul>{metadata.sources.filter(s=>p.sourceIds.includes(s.id)).map(s=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.id} · 固定来源</a><small>SHA256：{s.sha256}</small></li>)}</ul></details>
 </section>;
}
