import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {
  createDraftReview,
  moveRewardOffer,
  sortRewardOffers,
  validateActivityReview,
  type ActivityRewardOffer,
} from '../domain/activity-review';
import {openDatabase} from '../storage/db';
import {
  deleteActivityReview,
  loadActivityReviews,
  saveActivityReview,
} from '../storage/activity-review-store';
import {LocalProvider} from '../catalog/provider';
import {parseWorldStatePayload} from '../domain/worldstate';
import {buildConsoleCandidates} from '../domain/session-planner';

const provider = new LocalProvider();

describe('activity manual review & reward priority', () => {
  it('sorts reward offers by default tier priority and supports manual reorder & acquired sink', () => {
    const offers: ActivityRewardOffer[] = [
      {id: 'r1', nameZh: '赋能·充沛（可交易）', tier: 'repeatable-tradable', costText: '21 尘埃', acquired: false, customRank: null},
      {id: 'r2', nameZh: '暗影福马（Umbra Forma）', tier: 'scarce-upgrade', costText: '50 尘埃', acquired: false, customRank: null},
      {id: 'r3', nameZh: '活动限定纹章', tier: 'limited-exclusive', costText: '15 尘埃', acquired: false, customRank: null},
      {id: 'r4', nameZh: '已兑换限定外观', tier: 'limited-exclusive', costText: '10 尘埃', acquired: true, customRank: null},
    ];
    const sorted = sortRewardOffers(offers);
    expect(sorted.map(o => o.id)).toEqual(['r3', 'r2', 'r1', 'r4']);

    const moved = moveRewardOffer(sorted, 'r1', 'up');
    expect(moved.map(o => o.id)).toEqual(['r3', 'r1', 'r2', 'r4']);
  });

  it('rejects unsafe URLs and missing recommendation reason', () => {
    const draft = createDraftReview('ev-1', '测试活动');
    expect(validateActivityReview(draft)).toContain('理由');
    draft.recommendationReason = '限定奖励值得获取';
    draft.sourceUrl = 'javascript:alert(1)';
    expect(validateActivityReview(draft)).toContain('http://');
    draft.sourceUrl = 'https://www.warframe.com/news/test-event';
    expect(validateActivityReview(draft)).toBeNull();
  });

  it('persists activity reviews in IndexedDB meta without touching profiles and projects into console candidates', async () => {
    const dbName = 'activity-review-test-' + crypto.randomUUID();
    const db = await openDatabase(dbName);
    try {
      const review = createDraftReview('ev-live', '行动代号：兽之腹');
      review.credibility = 'official-page-verified';
      review.eligibility = 'ready';
      review.eligibilityDetail = '已完成《翡翠之影》主线';
      review.recommendation = 'must-get';
      review.recommendationReason = '可稳定兑换限定外观与赋能';
      review.howToPlay = '飞升模式，注意保护电梯核心';
      review.sourceUrl = 'https://www.warframe.com/news/belly-of-the-beast';
      review.rewards = [
        {id: 'o1', nameZh: '活动限定饰品', tier: 'limited-exclusive', costText: '15 尘埃', acquired: false, customRank: null},
      ];

      await saveActivityReview(db, review);
      const loaded = await loadActivityReviews(db);
      expect(loaded['ev-live']?.titleZh).toBe('行动代号：兽之腹');
      expect(await db.profiles.count()).toBe(0);

      const worldState = parseWorldStatePayload(
        {
          events: [{id: 'ev-live', description: 'Belly of the Beast', expiry: '2026-11-28T00:00:00.000Z'}],
        },
        '2026-11-23T07:00:00.000Z',
      );
      const candidates = buildConsoleCandidates(
        undefined,
        provider.getCatalog(),
        {
          goals: provider.getGoalCatalog(),
          weapons: provider.getWeaponCatalog(),
          crafting: provider.getCraftingCatalog(),
          syndicates: provider.getSyndicateCatalog(),
          resources: provider.getResourceCatalog(),
        },
        worldState,
        Date.parse('2026-11-23T07:10:00.000Z'),
        loaded,
      );
      const evCard = candidates.find(c => c.id === 'ws:event:ev-live');
      expect(evCard?.title).toContain('必拿限时');
      expect(evCard?.credibilityLabel).toBe('官方活动页人工确认');
      expect(evCard?.focused).toBe(true);
      expect(evCard?.why).toContain('活动限定饰品');

      const afterDelete = await deleteActivityReview(db, 'ev-live');
      expect(afterDelete['ev-live']).toBeUndefined();
    } finally {
      db.close();
      await db.delete();
    }
  });
});
