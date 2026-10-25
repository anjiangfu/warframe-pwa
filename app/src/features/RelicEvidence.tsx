import {resolveRelicGuide,relicDisplayName,type RelicCatalog,type RelicDisplay,type RelicLocation,type RelicReward} from '../domain/relics';
const labels={'snapshot-checked':'已对照资料',unverified:'待核',conflicting:'来源冲突'};
const sourceLabels:Record<string,string>={'wfcd-relics':'固定遗物奖励表','wfcd-missions':'固定任务掉落表','de-table':'官方公开掉落表'};
export function RelicBundleExplanation({catalog,reward}:{catalog:Readonly<RelicCatalog>;reward:RelicReward}){
 const b=reward.bundleOf;if(!b)return null;const target=catalog.rewards.find(r=>r.id===b.rewardId);if(!target)return null;
 return <p className="guide-notice" data-testid="quantity-reward" data-reward-ref={target.id}>数量奖励：{b.quantity}份 {relicDisplayName(target)}。沿用既有蓝图记录；数量只说明本条奖励内容，不是成品福马，不会自动入库。</p>;
}
export function RelicSourceLinks({catalog,ids}:{catalog:Readonly<RelicCatalog>;ids:string[]}){
 return <div className="relic-sources">{ids.map(id=>{const s=catalog.sources.find(s=>s.id===id)!;return <div key={id}><a data-source-id={id} href={s.url} target="_blank" rel="noreferrer">{s.label??sourceLabels[id]??'资料来源'}（联网打开） ↗</a><small>检查：{s.checkedAt??'未核'} · 资料快照：{s.snapshotAt??'未知'}</small></div>;})}</div>;
}
export function relicNameStatus(display?:RelicDisplay,legacyStatus?:string){
 if(display?.verification==='snapshot-checked')return display.properNameUntranslated?'组合已对照，专名仍保留原文（中文名待核）':display.typeGlossary?'上游专名＋项目蓝图类型词':'中文组合显示已对照';
 return display?.verification==='conflicting'?'名称证据有冲突，保留原名':legacyStatus==='verified'?'沿用已有中文名':'中文名待核';
}
export function RelicNameEvidence({catalog,display}:{catalog:Readonly<RelicCatalog>;display?:RelicDisplay}){
 if(!display)return null;
 return <details className="relic-name-evidence" data-testid="name-evidence"><summary>名称核对依据</summary><p>{labels[display.verification]}；名称关联不为奖励、入口或当前可获取状态背书。</p>{display.properNameUntranslated&&<p>上游zh专名仍保留原文；只补部件／蓝图中文，汉字专名继续待核。</p>}{display.typeGlossary&&<p>蓝图为项目已有类型词，与上游父专名组合，不冒称完整官方中文字符串。</p>}{display.verification!=='snapshot-checked'&&<p>未采用的候选显示：{display.nameZh}</p>}<p>精确上游关联：</p>{display.upstreamIds.map(id=><code key={id}>{id}</code>)}<RelicSourceLinks catalog={catalog} ids={display.sourceIds}/></details>;
}
export function RelicRouteExplanation({catalog,location,rotation}:{catalog:Readonly<RelicCatalog>;location:RelicLocation;rotation:string|null}){
 const resolved=resolveRelicGuide(catalog,location.id,rotation);if(!resolved)return null;
 const {guide:g,rule:r,rotationText,rotationVerification}=resolved;
 return <section className="relic-route-explanation" data-testid={'route-guide:'+location.id}>
  <h4>入口与获取说明</h4><p>入口：{g.entry}</p><small>入口核对：{labels[g.entryVerification]}；用户账号解锁未知。</small>
  <p>基础任务模式：{g.baseMode}</p><small>模式核对：{labels[g.modeVerification]}</small><p>奖励表类别：{g.extraCategory}</p><p>具体触发：{labels[g.triggerVerification]}</p>
  {g.exception&&<aside className="guide-notice"><b>节点特例 · {labels[g.exception.verification]}</b><p>{g.exception.text}</p><RelicSourceLinks catalog={catalog} ids={g.exception.sourceIds}/></aside>}
  <h4>{r.title}</h4><p>{r.scope}</p><small>规则说明：{labels[r.verification]}；公开资料核对，不是游戏亲测。</small>{g.entryVerification!=='snapshot-checked'&&<p className="relic-unknown">节点入口仍待核；以下是通用机制参考，不能当作该节点触发表已确认。</p>}
  <ol>{r.steps.map((text,i)=><li key={i}>{text}</li>)}</ol><p className="relic-rotation-note">本条{rotation??'未知'}表说明：{rotationText}</p><small>轮次解释核对：{labels[rotationVerification]}；表中有记录不等于当前可刷。</small>
  <ul>{[...r.limitations,...g.pending].map((text,i)=><li key={i}>{text}</li>)}</ul><RelicSourceLinks catalog={catalog} ids={[...new Set([...g.sourceIds,...r.sourceIds])]}/>
 </section>;
}
