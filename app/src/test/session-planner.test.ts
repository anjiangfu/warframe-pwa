import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {LocalProvider} from '../catalog/provider';
import {newProfile} from '../storage/imports';
import {parseWorldStatePayload} from '../domain/worldstate';
import {
  buildConsoleCandidates,
  createEmptySessionPlan,
  sortConsoleCandidates,
  summarizeSessionBudget,
} from '../domain/session-planner';
import {openDatabase} from '../storage/db';
import {loadDailySessionPlan,saveDailySessionPlan} from '../storage/session-plan-store';

const provider = new LocalProvider();
const catalog = provider.getCatalog();
const actionCatalogs = {
  goals: provider.getGoalCatalog(),
  weapons: provider.getWeaponCatalog(),
  crafting: provider.getCraftingCatalog(),
  syndicates: provider.getSyndicateCatalog(),
  resources: provider.getResourceCatalog(),
};

describe('90-minute session console planner', () => {
  it('combines profile actions, in-progress tech tree nodes, and active worldstate without expired events', () => {
    const profile = newProfile(catalog, 'p1', 'MR12 档案', true);
    profile.goalStates = {'goal:dual-toxocyst': 'focused'};
    profile.statuses['helminth'] = 'progress';

    const worldState = parseWorldStatePayload(
      {
        cetusCycle: {state: 'night', expiry: '2026-11-23T08:00:00.000Z'},
        voidTrader: {
          active: true,
          character: "Baro Ki'Teer",
          location: '土星中继站',
          expiry: '2026-11-24T00:00:00.000Z',
          inventory: [],
        },
        events: [
          {id: 'active-ev', description: '当前活动', expiry: '2026-11-25T00:00:00.000Z'},
          {id: 'expired-ev', description: '过期活动', expiry: '2026-10-01T00:00:00.000Z'},
        ],
      },
      '2026-11-23T07:10:00.000Z',
    );

    const candidates = buildConsoleCandidates(
      profile,
      catalog,
      actionCatalogs,
      worldState,
      Date.parse('2026-11-23T07:12:00.000Z'),
    );
    const ids = candidates.map(c => c.id);
    expect(ids).toContain('action:goal:dual-toxocyst');
    expect(ids).toContain('tree:helminth');
    expect(ids).toContain('ws:cycle:cetus-night');
    expect(ids).toContain('ws:voidTrader');
    expect(ids).toContain('ws:event:active-ev');
    expect(ids).not.toContain('ws:event:expired-ev');

    const sorted = sortConsoleCandidates(candidates, {
      'ws:cycle:cetus-night': 'priority',
      'action:goal:dual-toxocyst': 'skip',
    });
    expect(sorted[0].id).toBe('ws:cycle:cetus-night');
    expect(sorted[sorted.length - 1].id).toBe('action:goal:dual-toxocyst');
  });

  it('summarizes only manual minutes and tracks unestimated items and over-budget state', () => {
    const plan = createEmptySessionPlan(90, new Date('2026-11-23T07:00:00.000Z'));
    plan.items = [
      {candidateId: 'a', manualMinutes: 45, done: true, addedAt: '2026-11-23T07:00:00.000Z'},
      {candidateId: 'b', manualMinutes: null, done: false, addedAt: '2026-11-23T07:01:00.000Z'},
      {candidateId: 'c', manualMinutes: 60, done: false, addedAt: '2026-11-23T07:02:00.000Z'},
    ];
    const summary = summarizeSessionBudget(plan);
    expect(summary.allocatedMinutes).toBe(105);
    expect(summary.unestimatedCount).toBe(1);
    expect(summary.completedCount).toBe(1);
    expect(summary.remainingMinutes).toBe(-15);
    expect(summary.overBudget).toBe(true);
  });

  it('persists daily plan per profile and resets items on a new day while keeping long-lived preferences', async () => {
    const dbName = 'session-plan-test-' + crypto.randomUUID();
    const db = await openDatabase(dbName);
    try {
      const day1 = new Date('2026-11-23T08:00:00.000Z');
      const plan = createEmptySessionPlan(90, day1);
      plan.items.push({candidateId: 'x', manualMinutes: 30, done: true, addedAt: day1.toISOString()});
      plan.preferences = {x: 'done_today', y: 'priority', z: 'skip'};
      await saveDailySessionPlan(db, 'prof-1', plan);

      const sameDay = await loadDailySessionPlan(db, 'prof-1', 90, new Date('2026-11-23T12:00:00.000Z'));
      expect(sameDay.items).toHaveLength(1);
      expect(sameDay.preferences.x).toBe('done_today');

      const nextDay = await loadDailySessionPlan(db, 'prof-1', 90, new Date('2026-11-24T08:00:00.000Z'));
      expect(nextDay.items).toHaveLength(0);
      expect(nextDay.preferences.x).toBeUndefined();
      expect(nextDay.preferences.y).toBe('priority');
      expect(nextDay.preferences.z).toBe('skip');
    } finally {
      db.close();
      await db.delete();
    }
  });
});
