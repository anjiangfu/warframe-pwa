import type {Catalog, ProfileDocument} from './model';
import {deriveActions, type ActionCatalogs, type ActionItem} from './actions';
import {
  CREDIBILITY_LABELS,
  RECOMMENDATION_LABELS,
  summarizePendingRewards,
  type ActivityRecommendation,
  type ActivityReviewRecord,
} from './activity-review';
import {
  filterActiveSnapshot,
  formatRemaining,
  isExpired,
  type WorldStateSnapshot,
} from './worldstate';
import type {PinnedWikiTarget} from '../storage/pinned-targets-store';

export type SessionPreference = 'priority' | 'done_today' | 'deferred' | 'skip';

export interface SessionBucketItem {
  candidateId: string;
  manualMinutes: number | null;
  done: boolean;
  addedAt: string;
}

export interface DailySessionPlan {
  schemaVersion: 1;
  dateKey: string;
  budgetMinutes: number | null;
  items: SessionBucketItem[];
  preferences: Record<string, SessionPreference>;
  updatedAt: string;
}

export type EligibilityStatus = 'ready' | 'missing-prereq' | 'unverified';
export type CredibilityKind = 'personal-record' | 'official-api-summary' | 'unverified-detail';
export type CandidateSourceKind =
  | 'profile-action'
  | 'tree-progress'
  | 'worldstate-cycle'
  | 'worldstate-event'
  | 'worldstate-timed';

export interface ConsoleNavTarget {
  page: 'assistant' | 'tree' | 'crafting' | 'syndicates' | 'relics' | 'materials' | 'backup';
  id?: string;
}

export interface ConsoleCandidate {
  id: string;
  sourceKind: CandidateSourceKind;
  title: string;
  where: string;
  why: string;
  whatNext: string;
  focused: boolean;
  eligibility: EligibilityStatus;
  eligibilityNote: string;
  credibility: CredibilityKind;
  credibilityLabel: string;
  expiry: string | null;
  externalUrl?: string;
  unknowns: string[];
  navTarget?: ConsoleNavTarget;
  actionItem?: ActionItem;
  eventId?: string;
  pinnedId?: string;
  recommendation?: ActivityRecommendation;
  reviewRecord?: ActivityReviewRecord;
}

export interface SessionBudgetSummary {
  budgetMinutes: number | null;
  allocatedMinutes: number;
  unestimatedCount: number;
  totalCount: number;
  completedCount: number;
  remainingMinutes: number | null;
  overBudget: boolean;
}

export function localDateKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createEmptySessionPlan(budgetMinutes: number | null, now = new Date()): DailySessionPlan {
  return {
    schemaVersion: 1,
    dateKey: localDateKey(now),
    budgetMinutes,
    items: [],
    preferences: {},
    updatedAt: now.toISOString(),
  };
}

export function buildConsoleCandidates(
  profile: ProfileDocument | undefined,
  catalog: Readonly<Catalog>,
  actionCatalogs: ActionCatalogs,
  worldState: WorldStateSnapshot | null,
  nowMs = Date.now(),
  activityReviews: Record<string, ActivityReviewRecord> = {},
  pinnedTargets: PinnedWikiTarget[] = [],
): ConsoleCandidate[] {
  const candidates: ConsoleCandidate[] = [];

  for (const pin of pinnedTargets) {
    candidates.push({
      id: pin.id,
      sourceKind: 'profile-action',
      title: `自选速查目标 · ${pin.title}`,
      where: pin.where,
      why: pin.why,
      whatNext: pin.whatNext,
      focused: true,
      eligibility: 'unverified',
      eligibilityNote: '你从全能速查加入的个人目标，请以游戏内实际段位与前置为准',
      credibility: 'personal-record',
      credibilityLabel: '全能速查 · 自选目标',
      expiry: null,
      externalUrl: pin.externalUrl,
      unknowns: [],
      pinnedId: pin.id,
    });
  }

  if (profile) {
    const derived = deriveActions(profile, actionCatalogs);
    for (const item of derived.items) {
      const navTarget: ConsoleNavTarget = !item.goal
        ? {page: 'backup'}
        : item.goal.kind === 'crafting'
          ? {page: 'crafting', id: item.goal.recipeId}
          : item.goal.kind === 'syndicate'
            ? {page: 'syndicates', id: item.goal.syndicateId}
            : {page: 'assistant', id: item.id};
      const hasUnknowns = item.unknowns.length > 0;
      candidates.push({
        id: 'action:' + item.id,
        sourceKind: 'profile-action',
        title: item.title,
        where: item.candidate?.place ?? item.entry,
        why: item.reason,
        whatNext: item.next,
        focused: item.focused,
        eligibility: hasUnknowns ? 'unverified' : 'ready',
        eligibilityNote: hasUnknowns ? '需核对前置或库存缺口' : '已有本地记录，可按步骤推进',
        credibility: 'personal-record',
        credibilityLabel: '个人档案 + 本地目录',
        expiry: null,
        unknowns: item.unknowns,
        navTarget,
        actionItem: item,
      });
    }

    const allNodes = [...catalog.nodes, ...profile.customNodes];
    for (const node of allNodes) {
      if (profile.statuses[node.goalId] !== 'progress') continue;
      const unfinishedSteps = node.steps.filter(s => !profile.steps[node.goalId]?.[s.id]);
      candidates.push({
        id: 'tree:' + node.goalId,
        sourceKind: 'tree-progress',
        title: `科技树进行中 · ${node.title}`,
        where: `科技树路线 · ${catalog.lanes.find(l => l.id === node.lane)?.name ?? node.lane}`,
        why: node.sub || node.description || '已在互动科技树标记为进行中',
        whatNext: unfinishedSteps[0]?.text ?? '打开科技树查看并核对节点步骤',
        focused: false,
        eligibility: 'unverified',
        eligibilityNote: '个人路线模板（推荐顺序非硬前置）',
        credibility: 'personal-record',
        credibilityLabel: '用户科技树模板',
        expiry: null,
        unknowns: ['节点推荐顺序不代表游戏硬性解锁条件，请以游戏内星图为准'],
        navTarget: {page: 'tree', id: node.goalId},
      });
    }
  }

  const matchedEventIds = new Set<string>();

  if (worldState) {
    const active = filterActiveSnapshot(worldState, nowMs);
    const staleNote =
      active.freshness === 'stale' ? '（当前为过期缓存，请联网刷新后再确认剩余时间）' : '';

    for (const ev of active.activeEvents) {
      matchedEventIds.add(ev.id);
      const review = activityReviews[ev.id];
      if (review) {
        const pending = summarizePendingRewards(review);
        const rewardHint =
          pending.remaining > 0
            ? `优先兑换（余 ${pending.remaining}/${pending.total}）：${pending.topPendingNames.join(' → ')}`
            : pending.total > 0
              ? '已录入的兑换奖励均已标记完成'
              : '尚未录入具体奖励兑换项';
        candidates.push({
          id: 'ws:event:' + ev.id,
          sourceKind: 'worldstate-event',
          title: `限时活动（${RECOMMENDATION_LABELS[review.recommendation]}）· ${review.titleZh}`,
          where: ev.node ?? ev.faction ?? '星图活动面板',
          why: `${review.recommendationReason}；${rewardHint}${staleNote}`,
          whatNext: review.howToPlay
            ? `${review.howToPlay}（${formatRemaining(ev.expiry, nowMs)}）`
            : `按已核实优先级推进兑换（${formatRemaining(ev.expiry, nowMs)}）`,
          focused: review.recommendation === 'must-get',
          eligibility: review.eligibility,
          eligibilityNote:
            review.eligibilityDetail ||
            (review.eligibility === 'ready'
              ? '你已核实满足活动入场条件'
              : review.eligibility === 'missing-prereq'
                ? '你已标记缺入场前置'
                : '尚未核实入场条件'),
          credibility:
            review.credibility === 'official-page-verified'
              ? 'official-api-summary'
              : 'unverified-detail',
          credibilityLabel: CREDIBILITY_LABELS[review.credibility],
          expiry: ev.expiry,
          externalUrl: review.sourceUrl || undefined,
          unknowns: [
            ...(review.credibility === 'unverified' ? ['该活动细则仍标为未核实草案，请对照官方公告复核'] : []),
            ...(staleNote ? ['WFCD 倒计时缓存可能已过期'] : []),
          ],
          eventId: ev.id,
          recommendation: review.recommendation,
          reviewRecord: review,
        });
      } else {
        const rewardNote =
          ev.rewardSummary.length > 0
            ? `API 摘要奖励：${ev.rewardSummary.join('、')}`
            : 'API 未提供完整奖励与兑换明细，请对照官方公告核实';
        candidates.push({
          id: 'ws:event:' + ev.id,
          sourceKind: 'worldstate-event',
          title: `限时活动 · ${ev.title}`,
          where: ev.node ?? ev.faction ?? '星图活动面板',
          why: `${rewardNote}${staleNote}`,
          whatNext: `核对活动入场条件与官方公告后再决定是否投入时间（${formatRemaining(ev.expiry, nowMs)}）`,
          focused: false,
          eligibility: 'unverified',
          eligibilityNote: '未核实入场前提（以游戏内活动页为准）',
          credibility: 'unverified-detail',
          credibilityLabel: '官方 API 摘要 · 细则待核实',
          expiry: ev.expiry,
          unknowns: [
            'WFCD 仅返回活动概要，不臆造奖励清单或兑换优先级；可点击「核实并录入细则」补充',
            ...(staleNote ? ['缓存可能已过期'] : []),
          ],
          eventId: ev.id,
        });
      }
    }

    if (worldState.voidTrader && !isExpired(worldState.voidTrader.expiry, nowMs)) {
      const vt = worldState.voidTrader;
      if (vt.active) {
        candidates.push({
          id: 'ws:voidTrader',
          sourceKind: 'worldstate-timed',
          title: `${vt.character} 已到访`,
          where: vt.location,
          why:
            vt.inventoryCount > 0
              ? `当前 API 返回 ${vt.inventoryCount} 项在售物品，离场倒计时：${formatRemaining(vt.expiry, nowMs)}${staleNote}`
              : `正在中继站停留（${formatRemaining(vt.expiry, nowMs)}），在售明细未返回${staleNote}`,
          whatNext: '核对杜卡德金币（Ducats）与星币（Credits）库存，决定是否兑换限定 MOD/武器',
          focused: false,
          eligibility: 'unverified',
          eligibilityNote: '需对应中继站段位解锁',
          credibility: 'official-api-summary',
          credibilityLabel: 'WFCD 实时世界状态',
          expiry: vt.expiry,
          unknowns: ['请核对自身杜卡德金币与中继站段位限制'],
          navTarget: {page: 'relics'},
        });
      }
    }

    for (const cycle of worldState.cycles) {
      if (isExpired(cycle.expiry, nowMs)) continue;
      if (cycle.id === 'cetus' && cycle.rawState.toLowerCase() === 'night') {
        candidates.push({
          id: 'ws:cycle:cetus-night',
          sourceKind: 'worldstate-cycle',
          title: '夜灵平野当前为夜晚（Night）',
          where: '地球 · 夜灵平野（Plains of Eidolon）',
          why: `夜晚窗口适合夜灵狩猎、夜灵碎片与特定鱼类采集（${formatRemaining(cycle.expiry, nowMs)}）${staleNote}`,
          whatNext: '如近期需要夜灵赋能/夜羽声望，可趁当前夜晚窗口插入 1 轮',
          focused: false,
          eligibility: 'unverified',
          eligibilityNote: '夜灵狩猎建议具备指挥官增幅器，请按当前配装决定',
          credibility: 'official-api-summary',
          credibilityLabel: 'WFCD 实时周期',
          expiry: cycle.expiry,
          unknowns: staleNote ? ['缓存可能已过期，请刷新确认夜晚剩余时间'] : [],
        });
      }
      if (cycle.id === 'duviri') {
        candidates.push({
          id: 'ws:cycle:duviri',
          sourceKind: 'worldstate-cycle',
          title: `双衍王境当前：${cycle.stateLabel}`,
          where: '双衍王境（Duviri） / 无尽回廊（Circuit）',
          why: `情绪螺旋轮换倒计时：${formatRemaining(cycle.expiry, nowMs)}${staleNote}`,
          whatNext: '若本周有灵化之源（Incarnon）或战甲蓝图进度，可顺手推进一轮回廊',
          focused: false,
          eligibility: 'unverified',
          eligibilityNote: '钢铁之路回廊需先解锁钢铁之路',
          credibility: 'official-api-summary',
          credibilityLabel: 'WFCD 实时周期',
          expiry: cycle.expiry,
          unknowns: ['本周回廊奖励池请以游戏内界面为准'],
          navTarget: {page: 'assistant'},
        });
      }
    }

    if (active.archonActive) {
      const steelDone = profile?.statuses?.steel === 'done';
      candidates.push({
        id: 'ws:archonHunt',
        sourceKind: 'worldstate-timed',
        title: `每周执刑官猎杀 · ${active.archonActive.boss}`,
        where: active.archonActive.missions.map(m => `${m.type}（${m.node}）`).join(' → ') || '星图执刑官猎杀面板',
        why: `周常执刑官源力石来源，${formatRemaining(active.archonActive.expiry, nowMs)}${staleNote}`,
        whatNext: '确认《破障者》已完成且战甲配装就绪后再出击',
        focused: false,
        eligibility: steelDone ? 'unverified' : 'missing-prereq',
        eligibilityNote: steelDone
          ? '需完成《新纪之战》与《破障者》（以游戏内实际解锁为准）'
          : '请先确认是否完成《新纪之战》与《破障者》主线',
        credibility: 'official-api-summary',
        credibilityLabel: 'WFCD 实时周常',
        expiry: active.archonActive.expiry,
        unknowns: ['档案未读取游戏任务记录，是否已打完本周执刑官请自行核对'],
      });
    }

    if (active.sortieActive) {
      candidates.push({
        id: 'ws:sortie',
        sourceKind: 'worldstate-timed',
        title: `每日突击 · ${active.sortieActive.boss}`,
        where: active.sortieActive.variants.map(v => `${v.missionType}（${v.modifier}）`).join(' → ') || '星图突击面板',
        why: `每日一次 3 阶段任务（${formatRemaining(active.sortieActive.expiry, nowMs)}）${staleNote}`,
        whatNext: '按 3 阶段限制词条切换战甲与武器配装',
        focused: false,
        eligibility: 'unverified',
        eligibilityNote: '需完成《内战》且使用满级（30级）战甲',
        credibility: 'official-api-summary',
        credibilityLabel: 'WFCD 实时日常',
        expiry: active.sortieActive.expiry,
        unknowns: ['今日是否已完成突击请以游戏内为准'],
      });
    }

    if (active.activeChallenges.length > 0) {
      const top = active.activeChallenges[0];
      candidates.push({
        id: 'ws:nightwave:' + top.id,
        sourceKind: 'worldstate-timed',
        title: `午夜电波 · ${top.title}`,
        where: '午夜电波（Nightwave）挑战面板',
        why: `${top.desc || '电波声望任务'}${top.reputation ? ` · ${top.reputation} 声望` : ''}${staleNote}`,
        whatNext: '可与刷材料/裂缝任务顺带叠加完成，减少重复刷图',
        focused: false,
        eligibility: 'unverified',
        eligibilityNote: '部分精英周常依赖特定系统解锁',
        credibility: 'official-api-summary',
        credibilityLabel: 'WFCD 实时电波',
        expiry: top.expiry,
        unknowns: ['是否已完成该电波任务以游戏内电波面板为准'],
      });
    }
  }

  // Include standalone manually entered official announcement activities (not tied to expired WFCD cache).
  for (const review of Object.values(activityReviews)) {
    if (!review.eventId.startsWith('manual:') || matchedEventIds.has(review.eventId)) continue;
    const pending = summarizePendingRewards(review);
    const rewardHint =
      pending.remaining > 0
        ? `优先兑换（余 ${pending.remaining}/${pending.total}）：${pending.topPendingNames.join(' → ')}`
        : pending.total > 0
          ? '已录入的兑换奖励均已标记完成'
          : '尚未录入具体奖励兑换项';
    candidates.push({
      id: 'ws:event:' + review.eventId,
      sourceKind: 'worldstate-event',
      title: `人工录入活动（${RECOMMENDATION_LABELS[review.recommendation]}）· ${review.titleZh}`,
      where: '官方公告人工录入活动',
      why: `${review.recommendationReason}；${rewardHint}`,
      whatNext: review.howToPlay || '对照官方活动页与上方兑换清单推进',
      focused: review.recommendation === 'must-get',
      eligibility: review.eligibility,
      eligibilityNote: review.eligibilityDetail || '按你手动核实的入场条件为准',
      credibility:
        review.credibility === 'official-page-verified'
          ? 'official-api-summary'
          : 'unverified-detail',
      credibilityLabel: CREDIBILITY_LABELS[review.credibility],
      expiry: null,
      externalUrl: review.sourceUrl || undefined,
      unknowns: ['该活动为人工录入记录，请定期核对官方结束时间'],
      eventId: review.eventId,
      recommendation: review.recommendation,
      reviewRecord: review,
    });
  }

  return candidates;
}

const PREFERENCE_WEIGHT: Record<SessionPreference | 'normal', number> = {
  priority: 0,
  normal: 1,
  deferred: 2,
  done_today: 3,
  skip: 4,
};

const SOURCE_WEIGHT: Record<CandidateSourceKind, number> = {
  'profile-action': 0,
  'worldstate-event': 1,
  'worldstate-timed': 2,
  'worldstate-cycle': 3,
  'tree-progress': 4,
};

export function sortConsoleCandidates(
  candidates: ConsoleCandidate[],
  preferences: Record<string, SessionPreference>,
): ConsoleCandidate[] {
  return [...candidates].sort((a, b) => {
    const prefA = PREFERENCE_WEIGHT[preferences[a.id] ?? 'normal'];
    const prefB = PREFERENCE_WEIGHT[preferences[b.id] ?? 'normal'];
    if (prefA !== prefB) return prefA - prefB;
    if (a.focused !== b.focused) return Number(b.focused) - Number(a.focused);
    const srcA = SOURCE_WEIGHT[a.sourceKind];
    const srcB = SOURCE_WEIGHT[b.sourceKind];
    if (srcA !== srcB) return srcA - srcB;
    return a.id.localeCompare(b.id);
  });
}

export function summarizeSessionBudget(plan: DailySessionPlan): SessionBudgetSummary {
  let allocatedMinutes = 0;
  let unestimatedCount = 0;
  let completedCount = 0;

  for (const item of plan.items) {
    if (item.done) completedCount += 1;
    if (typeof item.manualMinutes === 'number' && Number.isFinite(item.manualMinutes) && item.manualMinutes >= 0) {
      allocatedMinutes += item.manualMinutes;
    } else {
      unestimatedCount += 1;
    }
  }

  const budgetMinutes =
    typeof plan.budgetMinutes === 'number' && Number.isFinite(plan.budgetMinutes) && plan.budgetMinutes >= 0
      ? plan.budgetMinutes
      : null;
  const remainingMinutes = budgetMinutes === null ? null : budgetMinutes - allocatedMinutes;

  return {
    budgetMinutes,
    allocatedMinutes,
    unestimatedCount,
    totalCount: plan.items.length,
    completedCount,
    remainingMinutes,
    overBudget: remainingMinutes !== null && remainingMinutes < 0,
  };
}
