export type ActivityEligibility = 'ready' | 'missing-prereq' | 'unverified';
export type ActivityRecommendation = 'must-get' | 'recommended' | 'later' | 'skip';
export type RewardTier = 'limited-exclusive' | 'scarce-upgrade' | 'repeatable-tradable';
export type ReviewCredibility = 'official-page-verified' | 'community' | 'unverified';

export interface ActivityRewardOffer {
  id: string;
  nameZh: string;
  tier: RewardTier;
  costText: string;
  acquired: boolean;
  customRank: number | null;
}

export interface ActivityReviewRecord {
  schemaVersion: 1;
  eventId: string;
  titleZh: string;
  sourceUrl: string;
  reviewedAt: string;
  credibility: ReviewCredibility;
  eligibility: ActivityEligibility;
  eligibilityDetail: string;
  recommendation: ActivityRecommendation;
  recommendationReason: string;
  howToPlay: string;
  rewards: ActivityRewardOffer[];
}

export const RECOMMENDATION_LABELS: Record<ActivityRecommendation, string> = {
  'must-get': '必拿限时',
  recommended: '建议获取',
  later: '以后再说',
  skip: '不推荐刷',
};

export const REWARD_TIER_LABELS: Record<RewardTier, string> = {
  'limited-exclusive': '1 · 限定非复刻',
  'scarce-upgrade': '2 · 稀缺升级资源',
  'repeatable-tradable': '3 · 可交易或可复刷',
};

export const CREDIBILITY_LABELS: Record<ReviewCredibility, string> = {
  'official-page-verified': '官方活动页人工确认',
  community: '社区讨论整理',
  unverified: '未核实草案',
};

const TIER_WEIGHT: Record<RewardTier, number> = {
  'limited-exclusive': 0,
  'scarce-upgrade': 1,
  'repeatable-tradable': 2,
};

export function isSafeHttpUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  return /^https?:\/\/\S+$/i.test(trimmed);
}

export function sortRewardOffers(offers: ActivityRewardOffer[]): ActivityRewardOffer[] {
  return [...offers].sort((a, b) => {
    if (a.acquired !== b.acquired) return Number(a.acquired) - Number(b.acquired);
    const hasCustomA = typeof a.customRank === 'number' && Number.isFinite(a.customRank);
    const hasCustomB = typeof b.customRank === 'number' && Number.isFinite(b.customRank);
    if (hasCustomA && hasCustomB && a.customRank !== b.customRank) {
      return (a.customRank as number) - (b.customRank as number);
    }
    if (hasCustomA !== hasCustomB) return hasCustomA ? -1 : 1;
    const tierDiff = TIER_WEIGHT[a.tier] - TIER_WEIGHT[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.id.localeCompare(b.id);
  });
}

export function moveRewardOffer(
  offers: ActivityRewardOffer[],
  offerId: string,
  direction: 'up' | 'down',
): ActivityRewardOffer[] {
  const ordered = sortRewardOffers(offers);
  const index = ordered.findIndex(o => o.id === offerId);
  if (index < 0) return ordered;
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= ordered.length) return ordered;
  const swapped = [...ordered];
  const [item] = swapped.splice(index, 1);
  swapped.splice(target, 0, item);
  return swapped.map((entry, idx) => ({
    ...entry,
    customRank: idx + 1,
  }));
}

export function createDraftReview(
  eventId: string,
  titleZh: string,
  nowIso = new Date().toISOString(),
): ActivityReviewRecord {
  return {
    schemaVersion: 1,
    eventId,
    titleZh,
    sourceUrl: '',
    reviewedAt: nowIso,
    credibility: 'unverified',
    eligibility: 'unverified',
    eligibilityDetail: '',
    recommendation: 'recommended',
    recommendationReason: '',
    howToPlay: '',
    rewards: [],
  };
}

export function validateActivityReview(record: ActivityReviewRecord): string | null {
  if (!record.eventId.trim()) return '活动 ID 不能为空';
  if (!record.titleZh.trim()) return '活动标题不能为空';
  if (!isSafeHttpUrl(record.sourceUrl)) return '官方来源链接必须以 http:// 或 https:// 开头（或留空）';
  if (!record.recommendationReason.trim()) return '请填写「是否建议参加」的理由，避免无依据结论';
  return null;
}

export function summarizePendingRewards(record: ActivityReviewRecord): {
  total: number;
  remaining: number;
  topPendingNames: string[];
} {
  const sorted = sortRewardOffers(record.rewards);
  const pending = sorted.filter(r => !r.acquired);
  return {
    total: sorted.length,
    remaining: pending.length,
    topPendingNames: pending.slice(0, 3).map(r => r.nameZh),
  };
}
