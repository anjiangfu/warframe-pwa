import {useState} from 'react';
import {
  CREDIBILITY_LABELS,
  RECOMMENDATION_LABELS,
  REWARD_TIER_LABELS,
  createDraftReview,
  moveRewardOffer,
  sortRewardOffers,
  validateActivityReview,
  type ActivityEligibility,
  type ActivityRecommendation,
  type ActivityReviewRecord,
  type ActivityRewardOffer,
  type ReviewCredibility,
  type RewardTier,
} from '../domain/activity-review';
import type {WorldEventSummary} from '../domain/worldstate';

interface Props {
  activeEvents: WorldEventSummary[];
  reviews: Record<string, ActivityReviewRecord>;
  editingEventId: string | null;
  onStartEdit: (eventId: string | null) => void;
  onSave: (record: ActivityReviewRecord) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
}

const ELIGIBILITY_TEXT: Record<ActivityEligibility, string> = {
  ready: '已满足',
  'missing-prereq': '缺前置',
  unverified: '未确认',
};

export function ActivityReviewPanel({
  activeEvents,
  reviews,
  editingEventId,
  onStartEdit,
  onSave,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<ActivityReviewRecord | null>(() => {
    if (!editingEventId) return null;
    if (reviews[editingEventId]) return structuredClone(reviews[editingEventId]);
    const matched = activeEvents.find(e => e.id === editingEventId);
    return createDraftReview(editingEventId, matched?.title ?? '');
  });
  const [rewardName, setRewardName] = useState('');
  const [rewardTier, setRewardTier] = useState<RewardTier>('limited-exclusive');
  const [rewardCost, setRewardCost] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const savedList = Object.values(reviews).sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));

  function openEditorFor(eventId: string, defaultTitle = '') {
    setFormError('');
    setRewardName('');
    setRewardCost('');
    const existing = reviews[eventId];
    setDraft(existing ? structuredClone(existing) : createDraftReview(eventId, defaultTitle));
    onStartEdit(eventId);
  }

  function closeEditor() {
    setDraft(null);
    setFormError('');
    onStartEdit(null);
  }

  function addReward() {
    if (!draft) return;
    const trimmed = rewardName.trim();
    if (!trimmed) {
      setFormError('请输入奖励名称后再添加');
      return;
    }
    const nextOffer: ActivityRewardOffer = {
      id: 'rw:' + crypto.randomUUID().slice(0, 8),
      nameZh: trimmed,
      tier: rewardTier,
      costText: rewardCost.trim(),
      acquired: false,
      customRank: null,
    };
    setDraft({
      ...draft,
      rewards: sortRewardOffers([...draft.rewards, nextOffer]),
    });
    setRewardName('');
    setRewardCost('');
    setFormError('');
  }

  async function submitDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const normalized: ActivityReviewRecord = {
      ...draft,
      titleZh: draft.titleZh.trim(),
      sourceUrl: draft.sourceUrl.trim(),
      eligibilityDetail: draft.eligibilityDetail.trim(),
      recommendationReason: draft.recommendationReason.trim(),
      howToPlay: draft.howToPlay.trim(),
      reviewedAt: new Date().toISOString(),
      rewards: sortRewardOffers(draft.rewards),
    };
    const err = validateActivityReview(normalized);
    if (err) {
      setFormError(err);
      return;
    }
    setSaving(true);
    try {
      await onSave(normalized);
      closeEditor();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className="panel activity-review-panel"
      aria-label="活动人工核实与奖励兑换评估"
      data-testid="activity-review-panel"
    >
      <div className="console-card-head">
        <div>
          <p className="eyebrow">ACTIVITY REVIEW · 受控人工核实与兑换优先级</p>
          <h3>官方活动评估与兑换清单</h3>
          <p className="microcopy">
            WFCD API 仅含活动概要，不包含完整奖励与兑换顺序。你可以在对照官方公告后手动录入核实结论，系统按「限定非复刻 → 稀缺升级资源 → 可交易/可复刷」自动排序并联动到行动台。
          </p>
        </div>
        <button
          type="button"
          className="primary"
          data-testid="new-manual-activity-btn"
          onClick={() => openEditorFor('manual:' + crypto.randomUUID().slice(0, 8), '')}
        >
          ＋ 录入官方公告活动
        </button>
      </div>

      {activeEvents.length > 0 && (
        <div className="review-quick-bar">
          <span>快速核实当前 WFCD 活动：</span>
          {activeEvents.map(ev => (
            <button
              key={ev.id}
              type="button"
              data-testid={'review-wfcd:' + ev.id}
              onClick={() => openEditorFor(ev.id, ev.title)}
            >
              {reviews[ev.id] ? '✎ 编辑已核实：' : '＋ 核实细则：'}
              {ev.title}
            </button>
          ))}
        </div>
      )}

      {draft && (
        <form className="review-form" onSubmit={e => void submitDraft(e)} data-testid="activity-review-form">
          <div className="console-card-head">
            <h4>{reviews[draft.eventId] ? '编辑已核实活动' : '录入活动核实信息'}</h4>
            <button type="button" onClick={closeEditor}>
              取消编辑
            </button>
          </div>

          {formError && (
            <p className="warning" role="alert">
              {formError}
            </p>
          )}

          <div className="review-form-grid">
            <label>
              活动名称（中文优先）
              <input
                type="text"
                value={draft.titleZh}
                placeholder="例如：行动代号：兽之腹（Operation: Belly of the Beast）"
                onChange={e => setDraft({...draft, titleZh: e.target.value})}
                data-testid="review-title-input"
              />
            </label>

            <label>
              官方公告 / 活动页链接（选填，仅 http/https）
              <input
                type="url"
                value={draft.sourceUrl}
                placeholder="https://www.warframe.com/news/..."
                onChange={e => setDraft({...draft, sourceUrl: e.target.value})}
                data-testid="review-source-input"
              />
            </label>

            <label>
              可信度来源
              <select
                value={draft.credibility}
                onChange={e => setDraft({...draft, credibility: e.target.value as ReviewCredibility})}
                data-testid="review-credibility-select"
              >
                <option value="official-page-verified">{CREDIBILITY_LABELS['official-page-verified']}</option>
                <option value="community">{CREDIBILITY_LABELS.community}</option>
                <option value="unverified">{CREDIBILITY_LABELS.unverified}</option>
              </select>
            </label>

            <label>
              能否参加
              <select
                value={draft.eligibility}
                onChange={e => setDraft({...draft, eligibility: e.target.value as ActivityEligibility})}
                data-testid="review-eligibility-select"
              >
                <option value="ready">已满足</option>
                <option value="missing-prereq">缺前置</option>
                <option value="unverified">未确认</option>
              </select>
            </label>

            <label>
              前置说明（缺哪个任务 / MR / 集团 / 装备）
              <input
                type="text"
                value={draft.eligibilityDetail}
                placeholder="例如：需完成《翡翠之影》主线；当前账号已满足"
                onChange={e => setDraft({...draft, eligibilityDetail: e.target.value})}
                data-testid="review-eligibility-detail"
              />
            </label>

            <label>
              是否建议参加
              <select
                value={draft.recommendation}
                onChange={e => setDraft({...draft, recommendation: e.target.value as ActivityRecommendation})}
                data-testid="review-recommendation-select"
              >
                <option value="must-get">{RECOMMENDATION_LABELS['must-get']}</option>
                <option value="recommended">{RECOMMENDATION_LABELS.recommended}</option>
                <option value="later">{RECOMMENDATION_LABELS.later}</option>
                <option value="skip">{RECOMMENDATION_LABELS.skip}</option>
              </select>
            </label>

            <label className="span-2">
              建议理由（必填，避免无依据结论）
              <input
                type="text"
                value={draft.recommendationReason}
                placeholder="例如：可直接兑换满级赋能·充沛（Arcane Energize）与限定外观，性价比极高"
                onChange={e => setDraft({...draft, recommendationReason: e.target.value})}
                data-testid="review-reason-input"
              />
            </label>

            <label className="span-2">
              如何打（任务类别、建议装备、易失败点）
              <textarea
                value={draft.howToPlay}
                placeholder="例如：飞升模式；推荐瓦尔基里/托里德；注意保护电梯核心与收集加速电池"
                onChange={e => setDraft({...draft, howToPlay: e.target.value})}
                data-testid="review-howto-input"
              />
            </label>
          </div>

          <div className="review-rewards-editor">
            <h5>优先兑换清单（默认：限定非复刻 → 稀缺升级资源 → 可交易/可复刷）</h5>
            <div className="review-reward-add">
              <input
                type="text"
                value={rewardName}
                placeholder="奖励名称（如：赋能·充沛 Arcane Energize）"
                onChange={e => setRewardName(e.target.value)}
                data-testid="reward-name-input"
              />
              <select
                value={rewardTier}
                onChange={e => setRewardTier(e.target.value as RewardTier)}
                data-testid="reward-tier-select"
              >
                <option value="limited-exclusive">{REWARD_TIER_LABELS['limited-exclusive']}</option>
                <option value="scarce-upgrade">{REWARD_TIER_LABELS['scarce-upgrade']}</option>
                <option value="repeatable-tradable">{REWARD_TIER_LABELS['repeatable-tradable']}</option>
              </select>
              <input
                type="text"
                value={rewardCost}
                placeholder="成本（如：21 尘埃）"
                onChange={e => setRewardCost(e.target.value)}
                data-testid="reward-cost-input"
              />
              <button type="button" onClick={addReward} data-testid="add-reward-btn">
                ＋ 添加奖励
              </button>
            </div>

            {draft.rewards.length === 0 ? (
              <p className="microcopy">尚未添加兑换奖励；若官方未公布明细，保持为空即可，不臆造奖励清单。</p>
            ) : (
              <ul className="review-reward-list">
                {sortRewardOffers(draft.rewards).map((offer, idx, arr) => (
                  <li key={offer.id} className={offer.acquired ? 'acquired' : ''} data-testid={'reward-row:' + idx}>
                    <label className="console-bucket-check">
                      <input
                        type="checkbox"
                        checked={offer.acquired}
                        onChange={() =>
                          setDraft({
                            ...draft,
                            rewards: sortRewardOffers(
                              draft.rewards.map(r =>
                                r.id === offer.id ? {...r, acquired: !r.acquired} : r,
                              ),
                            ),
                          })
                        }
                      />
                      <span>
                        <strong>
                          #{idx + 1} {offer.nameZh}
                        </strong>
                        <small>
                          {REWARD_TIER_LABELS[offer.tier]}
                          {offer.costText ? ` · 成本：${offer.costText}` : ''}
                        </small>
                      </span>
                    </label>
                    <div className="review-reward-ops">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() =>
                          setDraft({...draft, rewards: moveRewardOffer(draft.rewards, offer.id, 'up')})
                        }
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === arr.length - 1}
                        onClick={() =>
                          setDraft({...draft, rewards: moveRewardOffer(draft.rewards, offer.id, 'down')})
                        }
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            rewards: draft.rewards.filter(r => r.id !== offer.id),
                          })
                        }
                      >
                        删除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="actions">
            <button type="submit" className="primary" disabled={saving} data-testid="save-review-btn">
              {saving ? '正在保存…' : '保存核实记录并联动行动台'}
            </button>
            {reviews[draft.eventId] && (
              <button
                type="button"
                onClick={() => {
                  void onDelete(draft.eventId).then(closeEditor);
                }}
              >
                删除此核实记录
              </button>
            )}
          </div>
        </form>
      )}

      {savedList.length > 0 && !draft && (
        <div className="review-saved-grid">
          {savedList.map(rec => {
            const ordered = sortRewardOffers(rec.rewards);
            return (
              <article key={rec.eventId} className="review-saved-card" data-testid={'saved-review:' + rec.eventId}>
                <div className="candidate-tags">
                  <span className={`tag-elig ${rec.eligibility}`}>能否参加：{ELIGIBILITY_TEXT[rec.eligibility]}</span>
                  <span className="tag-focus">{RECOMMENDATION_LABELS[rec.recommendation]}</span>
                  <span className="tag-cred">{CREDIBILITY_LABELS[rec.credibility]}</span>
                </div>
                <h4>{rec.titleZh}</h4>
                <p>
                  <b>理由：</b>
                  {rec.recommendationReason}
                </p>
                {rec.eligibilityDetail && (
                  <p>
                    <b>前置说明：</b>
                    {rec.eligibilityDetail}
                  </p>
                )}
                {rec.howToPlay && (
                  <p>
                    <b>打法建议：</b>
                    {rec.howToPlay}
                  </p>
                )}
                {ordered.length > 0 && (
                  <ol className="review-priority-ol">
                    {ordered.map(r => (
                      <li key={r.id} className={r.acquired ? 'acquired' : ''}>
                        {r.acquired ? '✓ ' : ''}
                        {r.nameZh}
                        <small>
                          （{REWARD_TIER_LABELS[r.tier]}
                          {r.costText ? ` · ${r.costText}` : ''}）
                        </small>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="candidate-actions">
                  <button type="button" onClick={() => openEditorFor(rec.eventId, rec.titleZh)}>
                    编辑核实记录
                  </button>
                  {rec.sourceUrl && (
                    <a href={rec.sourceUrl} target="_blank" rel="noreferrer">
                      官方原文 ↗
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
