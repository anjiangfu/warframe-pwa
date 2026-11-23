import {useEffect,useMemo,useState} from 'react';
import type {Catalog,ProfileDocument} from '../domain/model';
import type {ActionCatalogs} from '../domain/actions';
import {
  CREDIBILITY_LABELS,
  RECOMMENDATION_LABELS,
  type ActivityReviewRecord,
} from '../domain/activity-review';
import {
  filterActiveSnapshot,
  formatRemaining,
  getCacheFreshness,
  isExpired,
  type WorldStateSnapshot,
} from '../domain/worldstate';
import {
  buildConsoleCandidates,
  createEmptySessionPlan,
  sortConsoleCandidates,
  summarizeSessionBudget,
  type ConsoleCandidate,
  type ConsoleNavTarget,
  type DailySessionPlan,
  type SessionPreference,
} from '../domain/session-planner';
import type {PlannerDB} from '../storage/db';
import {loadDailySessionPlan,saveDailySessionPlan} from '../storage/session-plan-store';
import {
  deleteActivityReview,
  loadActivityReviews,
  saveActivityReview,
  type ActivityReviewMap,
} from '../storage/activity-review-store';
import type {PinnedWikiTarget} from '../storage/pinned-targets-store';
import {ActivityReviewPanel} from './ActivityReviewPanel';

interface Props {
  db?: PlannerDB;
  profile?: ProfileDocument;
  catalog: Readonly<Catalog>;
  actionCatalogs: ActionCatalogs;
  worldState: WorldStateSnapshot | null;
  worldStateLoading: boolean;
  worldStateError: string;
  online: boolean;
  busy?: boolean;
  pinnedTargets?: PinnedWikiTarget[];
  onRemovePinnedTarget?: (id: string) => void;
  onOpenWiki?: () => void;
  onBumpMasteryRank?: () => void;
  onSyncWorldState: () => void;
  onNavigate: (target: ConsoleNavTarget) => void;
  onCreateProfile: (template: boolean) => void;
}

const PREF_LABELS: Record<SessionPreference | 'normal', string> = {
  normal: '普通',
  priority: '优先做',
  done_today: '今日已完成',
  deferred: '暂时不做',
  skip: '不想刷',
};

const ELIGIBILITY_LABELS = {
  ready: '可推进',
  'missing-prereq': '可能缺前置',
  unverified: '需核实前置',
} as const;

function formatClock(iso: string | null | undefined): string {
  if (!iso) return '未知';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '未知';
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function SessionConsolePage({
  db,
  profile,
  catalog,
  actionCatalogs,
  worldState,
  worldStateLoading,
  worldStateError,
  online,
  busy = false,
  pinnedTargets = [],
  onRemovePinnedTarget,
  onOpenWiki,
  onBumpMasteryRank,
  onSyncWorldState,
  onNavigate,
  onCreateProfile,
}: Props) {
  const defaultBudget = profile?.dailyMinutes ?? 90;
  const [plan, setPlan] = useState<DailySessionPlan>(() => createEmptySessionPlan(defaultBudget));
  const [reviews, setReviews] = useState<ActivityReviewMap>({});
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [filterKind, setFilterKind] = useState<'all' | 'profile' | 'worldstate'>('all');
  const [fissureFilter, setFissureFilter] = useState<'all' | 'steel' | 'normal' | 'omnia'>('all');
  const [showSkipped, setShowSkipped] = useState(false);
  const [worldTab, setWorldTab] = useState<'cycles' | 'events' | 'missions' | 'news'>('cycles');
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    if (!db) {
      setPlan(createEmptySessionPlan(defaultBudget));
      return;
    }
    void loadDailySessionPlan(db, profile?.id, defaultBudget).then(loaded => {
      if (active) setPlan(loaded);
    });
    return () => {
      active = false;
    };
  }, [db, profile?.id, defaultBudget]);

  useEffect(() => {
    let active = true;
    if (!db) return;
    void loadActivityReviews(db).then(loaded => {
      if (active) setReviews(loaded);
    });
    return () => {
      active = false;
    };
  }, [db]);

  function updatePlan(updater: (prev: DailySessionPlan) => DailySessionPlan) {
    setPlan(prev => {
      const next = {...updater(prev), updatedAt: new Date().toISOString()};
      if (db && !db.unavailable) {
        void saveDailySessionPlan(db, profile?.id, next);
      }
      return next;
    });
  }

  async function handleSaveReview(record: ActivityReviewRecord) {
    if (db && !db.unavailable) {
      const updated = await saveActivityReview(db, record);
      setReviews(updated);
    } else {
      setReviews(prev => ({...prev, [record.eventId]: record}));
    }
  }

  async function handleDeleteReview(eventId: string) {
    if (db && !db.unavailable) {
      const updated = await deleteActivityReview(db, eventId);
      setReviews(updated);
    } else {
      setReviews(prev => {
        const next = {...prev};
        delete next[eventId];
        return next;
      });
    }
  }

  function jumpToReviewEditor(eventId: string) {
    setEditingEventId(eventId);
    requestAnimationFrame(() => {
      document.querySelector('.activity-review-panel')?.scrollIntoView({block: 'start', behavior: 'smooth'});
    });
  }

  const freshness = getCacheFreshness(worldState?.meta, nowMs);
  const activeWorld = useMemo(
    () => (worldState ? filterActiveSnapshot(worldState, nowMs) : null),
    [worldState, nowMs],
  );

  const filteredFissures = useMemo(() => {
    const base = activeWorld?.activeFissures ?? [];
    if (fissureFilter === 'steel') return base.filter(f => f.isHard);
    if (fissureFilter === 'normal') return base.filter(f => !f.isHard);
    if (fissureFilter === 'omnia') return base.filter(f => f.tier === 'Omnia');
    return base;
  }, [activeWorld, fissureFilter]);

  const rawCandidates = useMemo(
    () => buildConsoleCandidates(profile, catalog, actionCatalogs, worldState, nowMs, reviews, pinnedTargets),
    [profile, catalog, actionCatalogs, worldState, nowMs, reviews, pinnedTargets],
  );

  const sortedCandidates = useMemo(
    () => sortConsoleCandidates(rawCandidates, plan.preferences),
    [rawCandidates, plan.preferences],
  );

  const candidateById = useMemo(
    () => new Map(rawCandidates.map(c => [c.id, c])),
    [rawCandidates],
  );

  const visibleCandidates = useMemo(() => {
    return sortedCandidates.filter(c => {
      const pref = plan.preferences[c.id] as SessionPreference | undefined;
      if (!showSkipped && pref === 'skip') return false;
      if (filterKind === 'profile') {
        return c.sourceKind === 'profile-action' || c.sourceKind === 'tree-progress';
      }
      if (filterKind === 'worldstate') {
        return (
          c.sourceKind === 'worldstate-cycle' ||
          c.sourceKind === 'worldstate-event' ||
          c.sourceKind === 'worldstate-timed'
        );
      }
      return true;
    });
  }, [sortedCandidates, plan.preferences, showSkipped, filterKind]);

  const budgetSummary = useMemo(() => summarizeSessionBudget(plan), [plan]);
  const bucketIds = useMemo(() => new Set(plan.items.map(i => i.candidateId)), [plan.items]);

  function addToBucket(candidate: ConsoleCandidate) {
    updatePlan(prev => {
      if (prev.items.some(i => i.candidateId === candidate.id)) return prev;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            candidateId: candidate.id,
            manualMinutes: null,
            done: false,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    });
  }

  function removeFromBucket(candidateId: string) {
    updatePlan(prev => ({
      ...prev,
      items: prev.items.filter(i => i.candidateId !== candidateId),
    }));
  }

  function toggleBucketDone(candidateId: string) {
    updatePlan(prev => {
      const target = prev.items.find(i => i.candidateId === candidateId);
      const nextDone = target ? !target.done : false;
      const nextPrefs = {...prev.preferences};
      if (nextDone) nextPrefs[candidateId] = 'done_today';
      else if (nextPrefs[candidateId] === 'done_today') delete nextPrefs[candidateId];
      return {
        ...prev,
        items: prev.items.map(i => (i.candidateId === candidateId ? {...i, done: nextDone} : i)),
        preferences: nextPrefs,
      };
    });
  }

  function setBucketMinutes(candidateId: string, rawValue: string) {
    const trimmed = rawValue.trim();
    let parsed: number | null = null;
    if (trimmed !== '') {
      const n = Number(trimmed);
      if (Number.isFinite(n) && n >= 0 && n <= 600) parsed = Math.round(n);
      else return;
    }
    updatePlan(prev => ({
      ...prev,
      items: prev.items.map(i =>
        i.candidateId === candidateId ? {...i, manualMinutes: parsed} : i,
      ),
    }));
  }

  function setPreference(candidateId: string, value: string) {
    updatePlan(prev => {
      const nextPrefs = {...prev.preferences};
      if (value === 'normal') delete nextPrefs[candidateId];
      else nextPrefs[candidateId] = value as SessionPreference;
      return {...prev, preferences: nextPrefs};
    });
  }

  const budgetPercent =
    budgetSummary.budgetMinutes && budgetSummary.budgetMinutes > 0
      ? Math.min(100, Math.round((budgetSummary.allocatedMinutes / budgetSummary.budgetMinutes) * 100))
      : 0;

  const traderItems = worldState?.voidTrader?.inventoryItems ?? worldState?.voidTrader?.inventorySample ?? [];

  return (
    <section className="console-page" aria-label="90 分钟行动台与世界状态">
      <header className="section-heading">
        <div>
          <p className="eyebrow">TODAY CONSOLE · 90 分钟行动台 &amp; WFCD 实时世界状态</p>
          <h2>今日行动台</h2>
          <p>
            把你的本地养成进度与 WFCD 实时世界状态放到同一张工作台。系统不臆造每局耗时与未核实活动奖励；今日排程与活动人工核实仅存本机，不修改游戏账号。
          </p>
        </div>
        <div className="console-sync-actions">
          {profile && onBumpMasteryRank && (
            <button
              type="button"
              disabled={busy}
              onClick={onBumpMasteryRank}
              data-testid="quick-mr-bump"
            >
              MR{profile.masteryRank ?? '?'} · ＋1 涨段位
            </button>
          )}
          {onOpenWiki && (
            <button type="button" onClick={onOpenWiki} data-testid="console-open-wiki">
              ⌕ 全能速查
            </button>
          )}
          <button
            className="primary"
            disabled={worldStateLoading || !online}
            onClick={onSyncWorldState}
            data-testid="sync-worldstate-btn"
          >
            {worldStateLoading ? '正在同步世界状态…' : online ? '↻ 同步 WFCD 世界状态' : '当前离线（使用本地缓存）'}
          </button>
        </div>
      </header>

      <div className="console-top-grid">
        {/* 左侧：90 分钟时间盒预算卡 */}
        <section className="panel console-budget-card" aria-label="今日时间盒预算">
          <div className="console-card-head">
            <div>
              <p className="eyebrow">时间盒预算 · {plan.dateKey}</p>
              <h3>
                {budgetSummary.budgetMinutes === null
                  ? '预算未设定'
                  : `今日预算 ${budgetSummary.budgetMinutes} 分钟`}
              </h3>
            </div>
            <div className="console-preset-chips">
              {[30, 60, 90, 120].map(mins => (
                <button
                  key={mins}
                  type="button"
                  aria-pressed={plan.budgetMinutes === mins}
                  onClick={() => updatePlan(prev => ({...prev, budgetMinutes: mins}))}
                >
                  {mins}分
                </button>
              ))}
            </div>
          </div>

          <div className="console-budget-bar" aria-hidden="true">
            <i
              className={budgetSummary.overBudget ? 'over' : ''}
              style={{width: `${budgetPercent}%`}}
            />
          </div>

          <div className="console-budget-metrics">
            <span>
              <small>已手动估时</small>
              <strong data-testid="console-allocated-minutes">{budgetSummary.allocatedMinutes} 分</strong>
            </span>
            <span>
              <small>未估时项</small>
              <strong>{budgetSummary.unestimatedCount} 项</strong>
            </span>
            <span>
              <small>今日已完成</small>
              <strong>
                {budgetSummary.completedCount} / {budgetSummary.totalCount}
              </strong>
            </span>
            <span>
              <small>预算余量</small>
              <strong className={budgetSummary.overBudget ? 'warning' : ''}>
                {budgetSummary.remainingMinutes === null
                  ? '未定'
                  : budgetSummary.overBudget
                    ? `超出 ${Math.abs(budgetSummary.remainingMinutes)} 分`
                    : `剩 ${budgetSummary.remainingMinutes} 分`}
              </strong>
            </span>
          </div>

          {plan.items.length === 0 ? (
            <p className="microcopy">
              从下方候选池点击「＋ 加入今日清单」即可排入今日 90 分钟时间盒；耗时完全由你自己填写或保留“耗时未估”。
            </p>
          ) : (
            <div className="console-bucket-list">
              {plan.items.map(item => {
                const candidate = candidateById.get(item.candidateId);
                return (
                  <article
                    key={item.candidateId}
                    className={`console-bucket-row ${item.done ? 'done' : ''}`}
                    data-testid={'bucket:' + item.candidateId}
                  >
                    <label className="console-bucket-check">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleBucketDone(item.candidateId)}
                      />
                      <span>
                        <strong>{candidate?.title ?? `已移除或过期的条目（${item.candidateId}）`}</strong>
                        <small>{candidate?.where ?? '该条目可能已不在当前周期或档案中'}</small>
                      </span>
                    </label>
                    <div className="console-bucket-controls">
                      <label className="console-min-input">
                        <span>预计(分)</span>
                        <input
                          type="number"
                          min={0}
                          max={600}
                          placeholder="未估"
                          value={item.manualMinutes ?? ''}
                          onChange={e => setBucketMinutes(item.candidateId, e.target.value)}
                        />
                      </label>
                      {candidate?.navTarget && (
                        <button
                          type="button"
                          onClick={() => onNavigate(candidate.navTarget!)}
                        >
                          前往
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromBucket(item.candidateId)}
                      >
                        移出
                      </button>
                    </div>
                  </article>
                );
              })}
              <div className="console-bucket-foot">
                <button
                  type="button"
                  onClick={() => updatePlan(prev => ({...prev, items: []}))}
                >
                  清空今日清单
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 右侧：WFCD 世界状态摘要卡 */}
        <section className="panel console-world-card" aria-label="WFCD 实时世界状态">
          <div className="console-card-head">
            <div>
              <p className="eyebrow">WFCD WORLD STATE · PC 国际服只读缓存</p>
              <h3>世界状态快览</h3>
            </div>
            <span
              className={`ws-badge ${freshness}`}
              data-testid="worldstate-freshness"
            >
              {freshness === 'fresh'
                ? '● 缓存有效'
                : freshness === 'stale'
                  ? '▲ 缓存可能已过期'
                  : '○ 尚未同步'}
            </span>
          </div>

          <p className="microcopy" data-testid="worldstate-meta">
            {worldState
              ? `上次同步：${formatClock(worldState.meta.fetchedAt)} · 有效期至 ${formatClock(worldState.meta.expiresAt)} · 来源：WFCD PC API`
              : '尚未从 WFCD 拉取世界状态。点击右上角「同步 WFCD 世界状态」获取开放世界周期、虚空商人、活动与突击摘要。'}
          </p>

          {worldStateError && (
            <p className="warning" role="alert">
              {worldStateError}
            </p>
          )}

          {worldState && activeWorld && (
            <>
              <div className="ws-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={worldTab === 'cycles'}
                  onClick={() => setWorldTab('cycles')}
                >
                  开放周期 ({worldState.cycles.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={worldTab === 'events'}
                  onClick={() => setWorldTab('events')}
                >
                  活动与商人 ({activeWorld.activeEvents.length + (worldState.voidTrader?.active ? 1 : 0)})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={worldTab === 'missions'}
                  onClick={() => setWorldTab('missions')}
                >
                  突击/猎杀/裂缝
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={worldTab === 'news'}
                  onClick={() => setWorldTab('news')}
                >
                  官方公告 ({worldState.news.length})
                </button>
              </div>

              {worldTab === 'cycles' && (
                <div className="ws-cycle-grid">
                  {worldState.cycles.map(cycle => {
                    const expired = isExpired(cycle.expiry, nowMs);
                    return (
                      <article key={cycle.id} className={`ws-mini-card ${expired ? 'expired' : ''}`}>
                        <small>{cycle.titleZh}</small>
                        <strong>{cycle.stateLabel}</strong>
                        <span>{formatRemaining(cycle.expiry, nowMs)}</span>
                      </article>
                    );
                  })}
                  {worldState.voidTrader && (
                    <article className="ws-mini-card trader">
                      <small>{worldState.voidTrader.character}</small>
                      <strong>{worldState.voidTrader.active ? '已在中继站' : '尚未到达'}</strong>
                      <span>
                        {worldState.voidTrader.active
                          ? `${worldState.voidTrader.location} · ${formatRemaining(worldState.voidTrader.expiry, nowMs)}`
                          : `预计到达：${formatRemaining(worldState.voidTrader.activation, nowMs)}`}
                      </span>
                    </article>
                  )}
                </div>
              )}

              {worldTab === 'events' && (
                <div className="ws-list">
                  {activeWorld.expiredEventsCount > 0 && (
                    <p className="microcopy warning" data-testid="expired-events-notice">
                      已自动隐藏 {activeWorld.expiredEventsCount} 条已过截止时间的旧缓存活动，不作为进行中活动展示。
                    </p>
                  )}
                  {worldState.voidTrader && (
                    <article className="ws-item">
                      <h4>
                        {worldState.voidTrader.character} · {worldState.voidTrader.active ? '正在售卖' : '倒计时中'}
                      </h4>
                      <p>
                        位置：{worldState.voidTrader.location} ·{' '}
                        {worldState.voidTrader.active
                          ? formatRemaining(worldState.voidTrader.expiry, nowMs)
                          : `到达：${formatRemaining(worldState.voidTrader.activation, nowMs)}`}
                      </p>
                      {traderItems.length > 0 && (
                        <details className="ws-trader-details">
                          <summary>
                            查看在售清单（共 {worldState.voidTrader.inventoryCount} 项，已载入 {traderItems.length} 项）
                          </summary>
                          <ul>
                            {traderItems.map((i, idx) => (
                              <li key={idx}>
                                {i.item}
                                {i.ducats !== null ? ` · ${i.ducats} 杜卡德` : ''}
                                {i.credits !== null ? ` + ${i.credits.toLocaleString()} 星币` : ''}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </article>
                  )}
                  {activeWorld.activeEvents.length === 0 ? (
                    <p className="microcopy">当前缓存内没有未过期的限时活动摘要。</p>
                  ) : (
                    activeWorld.activeEvents.map(ev => {
                      const review = reviews[ev.id];
                      return (
                        <article key={ev.id} className="ws-item" data-testid={'ws-event:' + ev.id}>
                          <h4>{ev.title}</h4>
                          <p>
                            {ev.node ? `地点：${ev.node} · ` : ''}
                            {ev.progressPercent !== null ? `进度：${ev.progressPercent}% · ` : ''}
                            {formatRemaining(ev.expiry, nowMs)}
                          </p>
                          {ev.rewardSummary.length > 0 && (
                            <small>API 摘要奖励：{ev.rewardSummary.join('、')}</small>
                          )}
                          {review ? (
                            <small className="ws-verified-line">
                              已人工核实：{RECOMMENDATION_LABELS[review.recommendation]} · {CREDIBILITY_LABELS[review.credibility]}
                            </small>
                          ) : (
                            <small>可信度：官方实时 API 摘要（任务步骤与兑换优先级请对照官方公告核实）</small>
                          )}
                          <div className="ws-item-actions">
                            <button type="button" onClick={() => jumpToReviewEditor(ev.id)}>
                              {review ? '✎ 编辑活动评估' : '＋ 核实并录入细则'}
                            </button>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              )}

              {worldTab === 'missions' && (
                <div className="ws-list">
                  {activeWorld.archonActive ? (
                    <article className="ws-item">
                      <h4>执刑官猎杀 · {activeWorld.archonActive.boss}</h4>
                      <p>
                        {activeWorld.archonActive.faction} · {formatRemaining(activeWorld.archonActive.expiry, nowMs)}
                      </p>
                      <small>
                        {activeWorld.archonActive.missions.map(m => `${m.type}（${m.node}）`).join(' → ')}
                      </small>
                    </article>
                  ) : (
                    <p className="microcopy">当前无未过期的执刑官猎杀缓存。</p>
                  )}
                  {activeWorld.sortieActive ? (
                    <article className="ws-item">
                      <h4>每日突击 · {activeWorld.sortieActive.boss}</h4>
                      <p>
                        {activeWorld.sortieActive.faction} · {formatRemaining(activeWorld.sortieActive.expiry, nowMs)}
                      </p>
                      <small>
                        {activeWorld.sortieActive.variants
                          .map(v => `${v.missionType} · ${v.modifier}（${v.node}）`)
                          .join(' → ')}
                      </small>
                    </article>
                  ) : (
                    <p className="microcopy">当前无未过期的突击缓存。</p>
                  )}
                  <article className="ws-item">
                    <h4>
                      虚空裂缝 · 共 {worldState.fissures.totalActive} 个（普通 {worldState.fissures.normalCount} / 钢铁之路{' '}
                      {worldState.fissures.steelPathCount}）
                    </h4>
                    <div className="ws-fissure-filters">
                      {(
                        [
                          ['all', '全部'],
                          ['steel', '仅钢铁之路'],
                          ['normal', '仅普通'],
                          ['omnia', '仅全能'],
                        ] as const
                      ).map(([k, label]) => (
                        <button
                          key={k}
                          type="button"
                          aria-pressed={fissureFilter === k}
                          onClick={() => setFissureFilter(k)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="chips">
                      {filteredFissures.length === 0 ? (
                        <small>当前筛选下暂无未过期的虚空裂缝。</small>
                      ) : (
                        filteredFissures.slice(0, 12).map(f => (
                          <span key={f.id}>
                            {f.tierZh} {f.missionType}
                            {f.isHard ? ' [钢铁]' : ''} · {f.enemy}
                            <b>{formatRemaining(f.expiry, nowMs)}</b>
                          </span>
                        ))
                      )}
                    </div>
                  </article>
                </div>
              )}

              {worldTab === 'news' && (
                <div className="ws-list">
                  {worldState.news.length === 0 ? (
                    <p className="microcopy">当前缓存内暂无官方公告链接。</p>
                  ) : (
                    worldState.news.map(item => (
                      <article key={item.id} className="ws-item">
                        <a href={item.link} target="_blank" rel="noreferrer">
                          {item.title} ↗
                        </a>
                        <small>{formatClock(item.date)}</small>
                      </article>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* 官方活动人工核实与奖励兑换评估 */}
      <ActivityReviewPanel
        key={editingEventId ?? 'idle'}
        activeEvents={activeWorld?.activeEvents ?? []}
        reviews={reviews}
        editingEventId={editingEventId}
        onStartEdit={setEditingEventId}
        onSave={handleSaveReview}
        onDelete={handleDeleteReview}
      />

      {/* 下方：候选行动池 */}
      <section className="panel console-pool" aria-label="行动候选池">
        <div className="console-card-head">
          <div>
            <p className="eyebrow">CANDIDATE POOL · 档案进度 × 实时窗口</p>
            <h3>候选行动池（{visibleCandidates.length} 条）</h3>
          </div>
          <div className="console-filters">
            <button
              type="button"
              aria-pressed={filterKind === 'all'}
              onClick={() => setFilterKind('all')}
            >
              全部
            </button>
            <button
              type="button"
              aria-pressed={filterKind === 'profile'}
              onClick={() => setFilterKind('profile')}
            >
              仅个人目标
            </button>
            <button
              type="button"
              aria-pressed={filterKind === 'worldstate'}
              onClick={() => setFilterKind('worldstate')}
            >
              仅世界状态
            </button>
            <label className="console-toggle">
              <input
                type="checkbox"
                checked={showSkipped}
                onChange={e => setShowSkipped(e.target.checked)}
              />
              <span>显示“不想刷”</span>
            </label>
          </div>
        </div>

        {!profile && (
          <div className="guide-notice">
            <p>
              当前尚未创建个人档案，因此候选池仅展示 WFCD 世界状态与人工核实活动。创建 MR12 模板档案或导入旧存档后，这里会自动联动你的关注目标、制作缺口与集团晋升。
            </p>
            <div className="actions">
              <button type="button" className="primary" onClick={() => onCreateProfile(true)}>
                使用 MR12 模板创建档案
              </button>
              <button type="button" onClick={() => onNavigate({page: 'backup'})}>
                导入旧存档
              </button>
            </div>
          </div>
        )}

        {visibleCandidates.length === 0 ? (
          <p className="empty">
            当前筛选条件下暂无候选行动。你可以点击上方「同步 WFCD 世界状态」，或在养成助手/科技树中标记关注与进行中目标。
          </p>
        ) : (
          <div className="console-candidate-grid">
            {visibleCandidates.map(candidate => {
              const savedPref = plan.preferences[candidate.id] as SessionPreference | undefined;
              const pref: SessionPreference | 'normal' = savedPref ?? 'normal';
              const inBucket = bucketIds.has(candidate.id);
              return (
                <article
                  key={candidate.id}
                  className={`console-candidate-card pref-${pref}`}
                  data-testid={'candidate:' + candidate.id}
                >
                  <div className="candidate-tags">
                    <span className={`tag-elig ${candidate.eligibility}`}>
                      {ELIGIBILITY_LABELS[candidate.eligibility]}
                    </span>
                    <span className="tag-cred">{candidate.credibilityLabel}</span>
                    {candidate.focused && <span className="tag-focus">已关注 / 必拿</span>}
                    {pref !== 'normal' && <span className="tag-pref">{PREF_LABELS[pref]}</span>}
                  </div>

                  <h4>{candidate.title}</h4>
                  <p className="candidate-where">
                    <b>在哪里：</b>
                    {candidate.where}
                  </p>
                  <p>
                    <b>现在做什么：</b>
                    {candidate.whatNext}
                  </p>
                  <p>
                    <b>为什么：</b>
                    {candidate.why}
                  </p>
                  <p className="microcopy">参加前提：{candidate.eligibilityNote}</p>

                  {candidate.unknowns.length > 0 && (
                    <details className="candidate-unknowns">
                      <summary>核对提示（{candidate.unknowns.length}）</summary>
                      <ul>
                        {candidate.unknowns.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <div className="candidate-actions">
                    <button
                      type="button"
                      className={inBucket ? '' : 'primary'}
                      onClick={() =>
                        inBucket ? removeFromBucket(candidate.id) : addToBucket(candidate)
                      }
                    >
                      {inBucket ? '✓ 已在今日清单' : '＋ 加入今日清单'}
                    </button>

                    <select
                      aria-label={`标记 ${candidate.title} 偏好`}
                      value={pref}
                      onChange={e => setPreference(candidate.id, e.target.value)}
                    >
                      <option value="normal">普通排序</option>
                      <option value="priority">优先做</option>
                      <option value="deferred">暂时不做</option>
                      <option value="done_today">今日已完成</option>
                      <option value="skip">不想刷（隐藏）</option>
                    </select>

                    {candidate.eventId && (
                      <button
                        type="button"
                        onClick={() => jumpToReviewEditor(candidate.eventId!)}
                      >
                        {candidate.reviewRecord ? '编辑活动评估' : '核实并录入细则'}
                      </button>
                    )}

                    {candidate.pinnedId && onRemovePinnedTarget && (
                      <button
                        type="button"
                        onClick={() => onRemovePinnedTarget(candidate.pinnedId!)}
                      >
                        移除自选
                      </button>
                    )}

                    {candidate.externalUrl && (
                      <a
                        className="candidate-ext-link"
                        href={candidate.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        官方原文 ↗
                      </a>
                    )}

                    {candidate.navTarget && (
                      <button
                        type="button"
                        onClick={() => onNavigate(candidate.navTarget!)}
                      >
                        打开详情 ↗
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
