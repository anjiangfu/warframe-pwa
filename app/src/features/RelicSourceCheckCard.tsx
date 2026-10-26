import type {RelicCatalog} from '../domain/relics';
import {effectiveSourceCheck,type RelicSourceChecks} from '../domain/relic-source-checks';
const labels={listed:'所查官方表列出','not-listed':'本次表未列出',conflicting:'有冲突',unverified:'待核'};
const reasons:Record<string,string>={'no-record':'未附本轮核验记录','missing-evidence':'日期或原文证据不完整','exact-row':'任务获取表中唯一精确行','missing-row':'对应表及轮次已读取，未列此精确行；不代表不能获取','mission-section-missing':'没有可读取的任务获取段','table-missing':'对应表标题未找到，不能记为未列出','rotation-missing':'对应轮次未能完整读取','parse-failed':'结构未能可靠解析','network-failed':'原文读取失败，不等于未列出','duplicate-table':'存在重复的表标题','duplicate-row':'精确行重复，需人工核对','catalog-mismatch':'附件对应其他目录版本','identity-mismatch':'表定位与此目录引用不一致','table-not-read':'对应表或轮次未完成读取','inconsistent-proof':'结果与证据数量不一致'};
export function RelicSourceCheckCard({catalog,checks,acquisitionId}:{catalog:Readonly<RelicCatalog>;checks?:Readonly<RelicSourceChecks>;acquisitionId:string}){
 const result=effectiveSourceCheck(catalog,checks,acquisitionId),d=result.document,r=result.record;
 const a=catalog.acquisitions.find(a=>a.id===acquisitionId),l=catalog.locations.find(l=>l.id===a?.locationId);
 return <aside className="source-check-card" data-testid={'source-check:'+acquisitionId} data-check-status={result.status}>
  <h4>来源核验：{labels[result.status]}</h4><p>{reasons[result.reason]??'已保存的证据仍需核对'}</p>
  {!r?<p>未附本轮核验记录；旧目录仍可查，不把未知默认为列出。</p>:<>
   <p>公开表发布日期：<time>{d?.publishedAt??'未提供'}</time><br/>本次核对日（UTC）：<time>{d?.checkedAt?.slice(0,10)??'未提供'}</time></p>
   <p>非实时监测；只覆盖本目录及已摘录来源。此后更新未核，账号准入与游戏内掉落未实测。</p>
   {result.status==='not-listed'&&<p>只表示本次表未列出，不代表不能获取或永久绝版。</p>}
   <details><summary>原文定位与字节依据</summary><p>官方原表定位（不用于判断实际任务模式）：</p><code>{r.locator?.section??'未提供'} / {r.locator?.heading??'未提供'} / Rotation {r.locator?.rotation??'未提供'} / {r.locator?.item??'未提供'}</code><p>取得副本：{d?.retrievedAt??'未提供'}<br/>核对时间：{d?.checkedAt??'未提供'}<br/>访问方式：{d?.accessMode==='downloaded'?'公开HTTPS下载':d?.accessMode==='fixed-local'?'固定本地副本':'未确认'}</p><p>原文字节数：{d?.bytes??'未提供'} · 范围：{d?.scope==='pc-international'?'PC国际服':'未确认'}</p><code>SHA256：{d?.sha256??'未提供'}</code><small>附件版本：{checks?.checkVersion??'未提供'}</small></details>
   {d?.sourceUrl&&<p><a data-testid="official-check-link" href={d.sourceUrl+'#missionRewards'} target="_blank" rel="noreferrer">Digital Extremes 官方PC公开表原文（联网打开） ↗</a></p>}{d?.disclaimerUrl&&<p><a href={d.disclaimerUrl} target="_blank" rel="noreferrer">官方免责声明（联网打开） ↗</a></p>}
  </>}
  {l?.mode==='Caches'&&<p className="source-check-warning">额外奖励B表的具体触发待核；B不是第二箱或第二轮。原入口与基础模式仍待核，表列出不会升级这些状态。</p>}
  {l?.node==='Tyana Pass'&&<p className="source-check-warning">Defense分组只作原表定位，实际按既有镜像防御特例说明。</p>}
 </aside>;
}
