import {useEffect,useMemo,useState} from 'react';
import {
  HELMINTH_CATALOG,
  buildExternalGuideLinks,
  filterHelminthEntries,
  type LiveDropRow,
  type LiveSearchResult,
  type LiveWikiItem,
} from '../domain/live-wiki';
import type {PlannerDB} from '../storage/db';
import {
  loadRecentWikiEntries,
  searchLiveDrops,
  searchLiveItems,
} from '../storage/live-wiki-cache';
import type {PinnedWikiTarget} from '../storage/pinned-targets-store';

interface Props {
  db?: PlannerDB;
  online: boolean;
  pinnedIds: Set<string>;
  onPinTarget: (target: PinnedWikiTarget) => void;
  onUnpinTarget: (id: string) => void;
  onOpenConsole: () => void;
}

const QUICK_QUERIES = ['托里德', 'Rhino', 'Grendel', 'Orokin Cell', 'Burston Prime', 'Forma'];
const HELMINTH_TAGS = ['all', '增伤', '回蓝', '剥甲', '聚怪', '生存', '控场', '清图', '工具'];

export function LiveWikiPage({
  db,
  online,
  pinnedIds,
  onPinTarget,
  onUnpinTarget,
  onOpenConsole,
}: Props) {
  const [tab, setTab] = useState<'items' | 'helminth'>('items');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LiveSearchResult | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [recent, setRecent] = useState<LiveSearchResult[]>([]);

  // Extra drop-table lookup for the selected item
  const [extraDrops, setExtraDrops] = useState<LiveDropRow[] | null>(null);
  const [dropsLoading, setDropsLoading] = useState(false);
  const [dropsError, setDropsError] = useState('');

  // Helminth tab state
  const [helminthQuery, setHelminthQuery] = useState('');
  const [helminthTag, setHelminthTag] = useState('all');

  useEffect(() => {
    let active = true;
    void loadRecentWikiEntries(db).then(list => {
      if (active) setRecent(list);
    });
    return () => {
      active = false;
    };
  }, [db]);

  const selectedItem: LiveWikiItem | undefined = useMemo(() => {
    if (!result?.items.length) return undefined;
    return result.items.find(i => i.id === selectedId) ?? result.items[0];
  }, [result, selectedId]);

  const helminthRows = useMemo(
    () => filterHelminthEntries(helminthQuery, helminthTag),
    [helminthQuery, helminthTag],
  );

  async function runSearch(input: string, forceRefresh = false) {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('请输入战甲、武器、材料、MOD 或遗物名称');
      return;
    }
    setTab('items');
    setQuery(trimmed);
    setLoading(true);
    setError('');
    setExtraDrops(null);
    setDropsError('');
    try {
      const {result: res, fromCache, staleFallback} = await searchLiveItems(trimmed, db, {
        forceRefresh,
      });
      setResult(res);
      setSelectedId(res.items[0]?.id ?? '');
      if (staleFallback) {
        setStatusNote('当前离线或网络波动，已展示本地历史缓存（可能已过期）。');
      } else if (fromCache) {
        setStatusNote(`命中本地缓存（${res.items.length} 条），点「强制刷新」可拉最新。`);
      } else {
        setStatusNote(`已从 WFCD 实时接口获取 ${res.items.length} 条结果并缓存至本机。`);
      }
      const updatedRecent = await loadRecentWikiEntries(db);
      setRecent(updatedRecent);
    } catch (e) {
      setError(
        !online
          ? '当前离线且本机没有该词条的历史缓存；联网查过一次后即可离线回看。'
          : e instanceof Error
            ? e.message
            : String(e),
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadFullDropTable(item: LiveWikiItem) {
    const lookupTerm = item.englishName ?? item.name;
    setDropsLoading(true);
    setDropsError('');
    try {
      const rows = await searchLiveDrops(lookupTerm);
      setExtraDrops(rows);
    } catch (e) {
      setDropsError(e instanceof Error ? e.message : String(e));
    } finally {
      setDropsLoading(false);
    }
  }

  function togglePin(item: LiveWikiItem) {
    const pinId = 'wiki:' + item.id;
    if (pinnedIds.has(pinId)) {
      onUnpinTarget(pinId);
      return;
    }
    const compSummary = item.components
      .slice(0, 4)
      .map(c => `${c.nameZh}×${c.itemCount}`)
      .join('、');
    const firstDrop =
      item.drops[0]?.location ??
      item.components.find(c => c.drops.length > 0)?.drops[0]?.location ??
      item.components.find(c => c.locationHint)?.locationHint ??
      '全能速查 · 查看详情或官方 Wiki';
    const guides = buildExternalGuideLinks(item);
    onPinTarget({
      id: pinId,
      title: item.englishName && item.englishName !== item.name ? `${item.name}（${item.englishName}）` : item.name,
      where: firstDrop,
      why: compSummary ? `制造涉及：${compSummary}` : `${item.categoryZh}${item.masteryReq !== null ? ` · MR${item.masteryReq}` : ''}`,
      whatNext: item.components.length > 0 ? '对照部件与材料清单逐项刷取并铸造' : '前往对应掉落点刷取或交易获取',
      externalUrl: guides.officialWiki,
      addedAt: new Date().toISOString(),
    });
  }

  const guides = selectedItem ? buildExternalGuideLinks(selectedItem) : null;
  const isPinned = selectedItem ? pinnedIds.has('wiki:' + selectedItem.id) : false;

  return (
    <section className="live-wiki-page" aria-label="全能活百科与大嘴移植速查">
      <header className="section-heading">
        <div>
          <p className="eyebrow">LIVE COMPANION WIKI · 全游戏实时速查 &amp; 大嘴移植</p>
          <h2>全能速查</h2>
          <p>
            直连 WFCD 开源全游戏数据库（中英文通搜）：查任意战甲、武器、制作材料、部件掉落与大嘴移植技能；搜到后可一键加入「今日行动台」或直达 B站/维基查配卡。
          </p>
        </div>
        <div className="wiki-mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'items'}
            onClick={() => setTab('items')}
            data-testid="wiki-tab-items"
          >
            全游戏实时检索
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'helminth'}
            onClick={() => setTab('helminth')}
            data-testid="wiki-tab-helminth"
          >
            大嘴移植速查 ({HELMINTH_CATALOG.entries.length})
          </button>
        </div>
      </header>

      {tab === 'items' && (
        <>
          <section className="panel wiki-search-box">
            <form
              className="wiki-search-form"
              onSubmit={e => {
                e.preventDefault();
                void runSearch(query, false);
              }}
            >
              <input
                type="search"
                aria-label="搜索全游戏战甲、武器、材料或遗物"
                placeholder="输入中文或英文名，如：托里德、犀牛、Orokin Cell、Burston Prime…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                data-testid="live-wiki-input"
              />
              <button
                type="submit"
                className="primary"
                disabled={loading}
                data-testid="live-wiki-submit"
              >
                {loading ? '查询中…' : '⌕ 实时查询'}
              </button>
              {result && (
                <button
                  type="button"
                  disabled={loading || !online}
                  onClick={() => void runSearch(result.query, true)}
                >
                  ↻ 强制刷新
                </button>
              )}
            </form>

            <div className="chips wiki-quick-chips">
              {QUICK_QUERIES.map(term => (
                <button key={term} type="button" onClick={() => void runSearch(term)}>
                  {term}
                </button>
              ))}
            </div>

            {recent.length > 0 && (
              <div className="wiki-recent-row">
                <small>最近查过（离线可看）：</small>
                <div className="chips">
                  {recent.slice(0, 8).map(entry => (
                    <button
                      key={entry.query}
                      type="button"
                      onClick={() => {
                        setQuery(entry.query);
                        setResult(entry);
                        setSelectedId(entry.items[0]?.id ?? '');
                        setExtraDrops(null);
                        setStatusNote(`已载入本机缓存「${entry.query}」（${entry.items.length} 条）。`);
                        setError('');
                      }}
                    >
                      {entry.query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {statusNote && <p className="microcopy" data-testid="live-wiki-status">{statusNote}</p>}
            {error && <p className="warning" role="alert">{error}</p>}
          </section>

          {result && (
            <div className="wiki-columns">
              <aside className="panel wiki-results-col" aria-label="查询结果列表">
                <h3>匹配结果（{result.items.length}）</h3>
                {result.items.length === 0 ? (
                  <p className="empty">
                    未找到「{result.query}」。部分道具在 WFCD 接口中用英文名命中率更高，可尝试输入英文原名或缩短关键词。
                  </p>
                ) : (
                  <div className="wiki-result-list">
                    {result.items.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        className={selectedItem?.id === item.id ? 'active' : ''}
                        data-testid={'wiki-item:' + item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setExtraDrops(null);
                          setDropsError('');
                        }}
                      >
                        <strong>{item.name}</strong>
                        <small>
                          {item.englishName && item.englishName !== item.name ? `${item.englishName} · ` : ''}
                          {item.categoryZh}
                          {item.masteryReq !== null ? ` · MR${item.masteryReq}` : ''}
                        </small>
                      </button>
                    ))}
                  </div>
                )}
              </aside>

              {selectedItem && guides && (
                <article className="panel wiki-detail-col" data-testid="live-wiki-detail">
                  <div className="console-card-head">
                    <div>
                      <p className="eyebrow">
                        {selectedItem.categoryZh}
                        {selectedItem.masteryReq !== null ? ` · 段位要求 MR${selectedItem.masteryReq}` : ''}
                        {selectedItem.tradable ? ' · 可玩家交易' : ''}
                      </p>
                      <h3>
                        {selectedItem.name}
                        {selectedItem.englishName && selectedItem.englishName !== selectedItem.name
                          ? `（${selectedItem.englishName}）`
                          : ''}
                      </h3>
                    </div>
                    <div className="wiki-detail-actions">
                      <button
                        type="button"
                        className={isPinned ? '' : 'primary'}
                        onClick={() => togglePin(selectedItem)}
                        data-testid="wiki-pin-btn"
                      >
                        {isPinned ? '✓ 已加入行动台（点击移出）' : '＋ 加入今日行动台'}
                      </button>
                      {isPinned && (
                        <button type="button" onClick={onOpenConsole}>
                          去行动台看 ↗
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedItem.description && <p className="wiki-desc">{selectedItem.description}</p>}

                  {(selectedItem.buildPrice !== null || selectedItem.buildTimeHours !== null) && (
                    <div className="chips wiki-meta-chips">
                      {selectedItem.buildPrice !== null && (
                        <span>
                          铸造费用 <b>{selectedItem.buildPrice.toLocaleString()} 星币</b>
                        </span>
                      )}
                      {selectedItem.buildTimeHours !== null && (
                        <span>
                          铸造耗时 <b>{selectedItem.buildTimeHours} 小时</b>
                        </span>
                      )}
                    </div>
                  )}

                  {/* 一键外部查配卡与深度攻略 */}
                  <div className="wiki-ext-bar">
                    <span>查配卡 / 深度攻略：</span>
                    <a href={guides.huijiWiki} target="_blank" rel="noreferrer">
                      灰机维基中文 ↗
                    </a>
                    <a href={guides.officialWiki} target="_blank" rel="noreferrer">
                      官方 Wiki ↗
                    </a>
                    <a href={guides.bilibiliBuild} target="_blank" rel="noreferrer">
                      B站搜配卡 ↗
                    </a>
                    <a href={guides.overframe} target="_blank" rel="noreferrer">
                      Overframe 配卡 ↗
                    </a>
                  </div>

                  {/* 大嘴移植技能联动高亮 */}
                  {selectedItem.helminth && (
                    <div className="wiki-helminth-box" data-testid="wiki-helminth-highlight">
                      <p className="eyebrow">大嘴（Helminth）吸取移植技能</p>
                      <strong>
                        {selectedItem.helminth.abilityZh}（{selectedItem.helminth.abilityEn}）
                      </strong>
                      <p>{selectedItem.helminth.fitHint}</p>
                    </div>
                  )}

                  {/* 制作配方材料与部件来源 */}
                  {selectedItem.components.length > 0 && (
                    <section className="wiki-section">
                      <h4>制作材料与部件来源（点材料可继续查刷取地点）</h4>
                      <div className="wiki-comp-list">
                        {selectedItem.components.map((comp, idx) => (
                          <div key={comp.uniqueName + idx} className="wiki-comp-card">
                            <div className="wiki-comp-head">
                              <strong>
                                {comp.nameZh} × {comp.itemCount}
                              </strong>
                              {comp.name.toLowerCase() !== 'blueprint' && (
                                <button
                                  type="button"
                                  onClick={() => void runSearch(comp.name)}
                                  data-testid={'wiki-drill:' + comp.name}
                                >
                                  查此材料获取 ⌕
                                </button>
                              )}
                            </div>
                            {comp.locationHint && (
                              <p className="wiki-loc-hint">常见产区：{comp.locationHint}</p>
                            )}
                            {comp.drops.length > 0 && (
                              <ul className="wiki-drop-ul">
                                {comp.drops.slice(0, 6).map((d, i) => (
                                  <li key={i}>
                                    <span>{d.location}</span>
                                    <b>
                                      {d.chance !== null ? `${d.chance}%` : ''}
                                      {d.rarity ? ` · ${d.rarity}` : ''}
                                    </b>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 物品本身掉落 + 一键扩展官方全掉落表 */}
                  <section className="wiki-section">
                    <div className="console-card-head">
                      <h4>掉落出处</h4>
                      <button
                        type="button"
                        disabled={dropsLoading || !online}
                        onClick={() => void loadFullDropTable(selectedItem)}
                        data-testid="wiki-load-drops-btn"
                      >
                        {dropsLoading ? '查询全表中…' : '⌕ 查官方全掉落表'}
                      </button>
                    </div>
                    {dropsError && <p className="warning">{dropsError}</p>}
                    {selectedItem.drops.length > 0 && !extraDrops && (
                      <ul className="wiki-drop-ul">
                        {selectedItem.drops.slice(0, 12).map((d, i) => (
                          <li key={i}>
                            <span>
                              {d.location}
                              {d.item ? `（${d.item}）` : ''}
                            </span>
                            <b>
                              {d.chance !== null ? `${d.chance}%` : ''}
                              {d.rarity ? ` · ${d.rarity}` : ''}
                            </b>
                          </li>
                        ))}
                      </ul>
                    )}
                    {extraDrops && (
                      extraDrops.length === 0 ? (
                        <p className="microcopy">
                          官方掉落表未直接匹配该名称（部分武器蓝图在商店/氏族道场/集团兑换，请查看上方灰机维基或官方 Wiki）。
                        </p>
                      ) : (
                        <ul className="wiki-drop-ul" data-testid="wiki-extra-drops">
                          {extraDrops.slice(0, 20).map((d, i) => (
                            <li key={i}>
                              <span>
                                {d.location} · {d.item}
                              </span>
                              <b>
                                {d.chance !== null ? `${d.chance}%` : ''}
                                {d.rarity ? ` · ${d.rarity}` : ''}
                              </b>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                    {selectedItem.drops.length === 0 && !extraDrops && (
                      <p className="microcopy">
                        本条目未内嵌直接掉落表（常见于商店蓝图、氏族道场、集团兑换或需展开上方部件查看）。可点击「查官方全掉落表」或点灰机维基确认。
                      </p>
                    )}
                  </section>

                  {/* 战甲技能列表 */}
                  {selectedItem.abilities.length > 0 && (
                    <section className="wiki-section">
                      <h4>战甲技能一览</h4>
                      <div className="wiki-ability-grid">
                        {selectedItem.abilities.map((ab, idx) => (
                          <div key={ab.name + idx} className="wiki-ability-card">
                            <strong>
                              {idx + 1}. {ab.name}
                            </strong>
                            <p>{ab.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </article>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'helminth' && (
        <section className="panel helminth-panel" data-testid="helminth-panel">
          <div className="console-card-head">
            <div>
              <p className="eyebrow">HELMINTH SUBSUME · 全战甲大嘴移植技能速查</p>
              <h3>大嘴移植技能与定位</h3>
            </div>
          </div>
          <p className="microcopy">{HELMINTH_CATALOG.note}</p>

          <div className="helminth-controls">
            <input
              type="search"
              aria-label="筛选大嘴移植技能或战甲"
              placeholder="搜战甲名、技能名或效果（如：滋养、战吼、剥甲、Rhino）…"
              value={helminthQuery}
              onChange={e => setHelminthQuery(e.target.value)}
              data-testid="helminth-search-input"
            />
            <div className="chips">
              {HELMINTH_TAGS.map(t => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={helminthTag === t}
                  onClick={() => setHelminthTag(t)}
                >
                  {t === 'all' ? '全部定位' : t}
                </button>
              ))}
            </div>
          </div>

          <div className="helminth-grid">
            {helminthRows.map(entry => (
              <article key={entry.id} className="helminth-card" data-testid={'helminth:' + entry.id}>
                <div className="candidate-tags">
                  {entry.tags.map(tag => (
                    <span key={tag} className="tag-focus">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4>
                  {entry.abilityZh}（{entry.abilityEn}）
                </h4>
                <p className="helminth-source">
                  来源战甲：<b>{entry.warframeZh}（{entry.warframeEn}）</b>
                </p>
                <p>{entry.fitHint}</p>
                {entry.warframeEn !== 'Helminth' && (
                  <div className="candidate-actions">
                    <button
                      type="button"
                      onClick={() => void runSearch(entry.warframeEn)}
                      data-testid={'helminth-lookup:' + entry.id}
                    >
                      查 {entry.warframeZh} 获取与材料 ⌕
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
