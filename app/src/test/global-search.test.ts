import {describe,expect,it} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {parseWorldStatePayload} from '../domain/worldstate';
import {createDraftReview} from '../domain/activity-review';
import {searchWorkspace,type SearchSources} from '../domain/global-search';

const provider = new LocalProvider();

function makeSources(): SearchSources {
  const catalog = provider.getCatalog();
  const profile = newProfile(catalog, 'p-search', '搜索测试档', true);
  profile.customNodes.push({
    id: 'custom:my-amp',
    goalId: 'custom:my-amp',
    lane: 'endgame',
    title: '自制 747 增幅器',
    sub: '夜灵狩猎专用',
    description: '福尔图娜小鸭子声望组件',
    priority: 'A',
    x: 900,
    y: 1170,
    recommended: [],
    steps: [],
  });

  const worldState = parseWorldStatePayload(
    {
      cetusCycle: {state: 'night', expiry: '2026-11-23T08:00:00.000Z'},
      events: [
        {id: 'ev-active', description: '尸鬼净化', node: '地球 · 希图斯', expiry: '2026-11-25T00:00:00.000Z'},
        {id: 'ev-old', description: '早已结束的旧活动', expiry: '2026-10-01T00:00:00.000Z'},
      ],
    },
    '2026-11-23T07:00:00.000Z',
  );

  const review = createDraftReview('ev-active', '尸鬼净化复核');
  review.recommendationReason = '补齐稀缺 MOD';
  review.rewards = [
    {
      id: 'rw-1',
      nameZh: '活动限定纹章',
      tier: 'limited-exclusive',
      costText: '10 声望',
      acquired: false,
      customRank: null,
    },
  ];

  return {
    catalog,
    goals: provider.getGoalCatalog(),
    weapons: provider.getWeaponCatalog(),
    resources: provider.getResourceCatalog(),
    crafting: provider.getCraftingCatalog(),
    syndicates: provider.getSyndicateCatalog(),
    relics: provider.getRelicCatalog(),
    equipment: provider.getPrimeEquipmentCatalog(),
    profile,
    worldState,
    activityReviews: {'ev-active': review},
    nowMs: Date.parse('2026-11-23T07:10:00.000Z'),
  };
}

describe('global cross-module search', () => {
  it('finds tech tree nodes (including custom), goals, materials, syndicates, relics and active worldstate', () => {
    const sources = makeSources();

    expect(searchWorkspace('747', sources).some(h => h.uid === 'tree:custom:my-amp')).toBe(true);
    expect(searchWorkspace('毒囊双枪', sources).some(h => h.category === 'goal')).toBe(true);
    expect(searchWorkspace('亚瑟', sources).some(h => h.uid === 'syndicate:syndicate:hex')).toBe(true);
    expect(searchWorkspace('福马', sources).some(h => h.category === 'crafting')).toBe(true);
    expect(searchWorkspace('Burston', sources).some(h => h.category === 'relic')).toBe(true);
    expect(searchWorkspace('夜灵平野', sources).some(h => h.uid === 'ws:cycle:cetus')).toBe(true);
    expect(searchWorkspace('活动限定纹章', sources).some(h => h.uid === 'review:ev-active')).toBe(true);
  });

  it('supports category filters, multi-token AND matching, and excludes expired worldstate events', () => {
    const sources = makeSources();

    expect(searchWorkspace('早已结束的旧活动', sources)).toHaveLength(0);

    const onlyRelic = searchWorkspace('福马', sources, 'relic');
    expect(onlyRelic.length).toBeGreaterThan(0);
    expect(onlyRelic.every(h => h.category === 'relic')).toBe(true);

    const multiToken = searchWorkspace('地球 尸鬼', sources);
    expect(multiToken.some(h => h.uid === 'ws:event:ev-active')).toBe(true);
  });
});
