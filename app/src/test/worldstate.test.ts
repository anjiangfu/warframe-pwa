import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {
  DEFAULT_WORLDSTATE_TTL_MS,
  WFCD_PC_ENDPOINT,
  filterActiveSnapshot,
  formatRemaining,
  getCacheFreshness,
  parseWorldStatePayload,
} from '../domain/worldstate';
import {openDatabase} from '../storage/db';
import {fetchAndCacheWorldState,loadWorldStateCache} from '../storage/worldstate-cache';

const samplePayload = {
  timestamp: '2026-11-23T07:00:00.000Z',
  cetusCycle: {state: 'night', expiry: '2026-11-23T08:00:00.000Z', shortString: '45m to Day'},
  vallisCycle: {state: 'warm', expiry: '2026-11-23T07:20:00.000Z'},
  cambionCycle: {state: 'fass', expiry: '2026-11-23T08:10:00.000Z'},
  zarimanCycle: {state: 'corpus', expiry: '2026-11-23T09:00:00.000Z'},
  duviriCycle: {state: 'joy', expiry: '2026-11-23T09:30:00.000Z'},
  voidTrader: {
    active: true,
    character: "Baro Ki'Teer",
    location: '土星 · 克罗尼亚中继站',
    activation: '2026-11-21T13:00:00.000Z',
    expiry: '2026-11-24T13:00:00.000Z',
    inventory: [{item: '川流不息 Prime', ducats: 350, credits: 110000}],
  },
  events: [
    {
      id: 'ev-active',
      description: '尸鬼净化',
      faction: 'Grineer',
      node: '地球 · 希图斯',
      expiry: '2026-11-25T00:00:00.000Z',
      health: 62.4,
      rewards: [{asString: '猎人 弹药'}],
    },
    {
      id: 'ev-old',
      description: '上月旧活动',
      expiry: '2026-10-15T00:00:00.000Z',
    },
  ],
  nightwave: {
    season: 8,
    expiry: '2026-12-31T00:00:00.000Z',
    activeChallenges: [
      {
        id: 'nw-1',
        title: '完成 3 次捕获任务',
        desc: '完成任意 3 次捕获任务',
        reputation: 4500,
        isDaily: false,
        isElite: false,
        expiry: '2026-11-29T00:00:00.000Z',
      },
      {
        id: 'nw-2',
        title: '精英挑战：钢铁之路',
        desc: '在钢铁之路击杀 1000 名敌人',
        reputation: 7000,
        isDaily: false,
        isElite: true,
        expiry: '2026-11-29T00:00:00.000Z',
      },
    ],
  },
  sortie: {
    boss: 'Vay Hek 议员',
    faction: 'Grineer',
    expiry: '2026-11-23T16:00:00.000Z',
    variants: [{missionType: '防御', modifier: '敌人护甲强化', node: 'Hydron'}],
  },
  archonHunt: {
    boss: '执刑官 玻瑞尔',
    faction: 'Narmer',
    expiry: '2026-11-29T00:00:00.000Z',
    missions: [{type: '移动防御', node: '地球'}],
  },
  fissures: [
    {
      id: 'fis-1',
      tier: 'Omnia',
      missionType: '结合生存',
      node: '月球 · Circulus',
      enemy: 'Corrupted',
      isHard: true,
      isStorm: false,
      expired: false,
      expiry: '2026-11-23T08:00:00.000Z',
    },
    {
      id: 'fis-2',
      tier: 'Lith',
      missionType: '捕获',
      node: '虚空 · Hepit',
      enemy: 'Orokin',
      isHard: false,
      isStorm: false,
      expired: false,
      expiry: '2026-11-23T07:50:00.000Z',
    },
  ],
  news: [
    {
      id: 'n1',
      message: 'English Title',
      translations: {zh: '中文官方公告'},
      link: 'https://www.warframe.com/news/test',
      date: '2026-11-22T12:00:00.000Z',
      update: true,
    },
    {
      id: 'n-bad',
      message: 'Bad Scheme',
      link: 'javascript:alert(1)',
      date: '2026-11-22T12:00:00.000Z',
    },
  ],
};

describe('WFCD worldstate parser & cache', () => {
  it('parses cycles, bilingual labels, sorted nightwave, fissures and safe news links', () => {
    const nowIso = '2026-11-23T07:10:00.000Z';
    const snapshot = parseWorldStatePayload(samplePayload, nowIso);
    expect(snapshot.cycles).toHaveLength(5);
    expect(snapshot.cycles.find(c => c.id === 'cetus')?.stateLabel).toBe('夜晚（Night）');
    expect(snapshot.cycles.find(c => c.id === 'duviri')?.stateLabel).toBe('喜悦螺旋（Joy）');
    expect(snapshot.nightwave?.activeChallenges[0].id).toBe('nw-2');
    expect(snapshot.fissures.totalActive).toBe(2);
    expect(snapshot.fissures.steelPathCount).toBe(1);
    expect(snapshot.fissures.highlights[0].tierZh).toBe('全能（Omnia）');
    expect(snapshot.news).toHaveLength(1);
    expect(snapshot.news[0].title).toBe('中文官方公告');
  });

  it('filters expired events out of active snapshot and reports cache staleness', () => {
    const fetchedAt = '2026-11-23T07:10:00.000Z';
    const snapshot = parseWorldStatePayload(samplePayload, fetchedAt);
    const activeNow = filterActiveSnapshot(snapshot, Date.parse('2026-11-23T07:12:00.000Z'));
    expect(activeNow.freshness).toBe('fresh');
    expect(activeNow.activeEvents.map(e => e.id)).toEqual(['ev-active']);
    expect(activeNow.expiredEventsCount).toBe(1);

    const laterMs = Date.parse(fetchedAt) + DEFAULT_WORLDSTATE_TTL_MS + 1000;
    expect(getCacheFreshness(snapshot.meta, laterMs)).toBe('stale');
    expect(formatRemaining('2026-11-23T07:00:00.000Z', laterMs)).toContain('已过截止时间');
  });

  it('translates English mission types, factions and sortie modifiers into bilingual Chinese while keeping existing Chinese intact', () => {
    const englishPayload = {
      voidTrader: {
        active: true,
        character: "Baro Ki'Teer",
        location: 'Kronia Relay',
        expiry: '2026-11-24T13:00:00.000Z',
        inventory: Array.from({length: 10}, (_, i) => ({
          item: `Primed Mod ${i + 1}`,
          ducats: 300 + i * 10,
          credits: 100000,
        })),
      },
      sortie: {
        boss: 'Sargas Ruk',
        faction: 'Grineer',
        expiry: '2026-11-23T16:00:00.000Z',
        variants: [
          {missionType: 'Capture', modifier: 'Augmented Enemy Armor', node: 'Saturn'},
          {missionType: 'Void Cascade', modifier: 'Enemy Elemental Enhancement: Heat', node: 'Zariman'},
        ],
      },
      fissures: [
        {
          id: 'fis-en',
          tier: 'Axi',
          missionType: 'Disruption',
          node: 'Lua - Apollo',
          enemy: 'Corrupted',
          isHard: true,
          expiry: '2026-11-23T08:00:00.000Z',
        },
      ],
    };
    const snapshot = parseWorldStatePayload(englishPayload, '2026-11-23T07:10:00.000Z');
    expect(snapshot.voidTrader?.character).toBe("虚空商人（Baro Ki'Teer）");
    expect(snapshot.voidTrader?.inventoryItems).toHaveLength(10);
    expect(snapshot.sortie?.faction).toBe('Grineer（克隆尼）');
    expect(snapshot.sortie?.variants[0].missionType).toBe('捕获（Capture）');
    expect(snapshot.sortie?.variants[0].modifier).toContain('敌人护甲强化');
    expect(snapshot.sortie?.variants[1].missionType).toBe('虚空覆涌（Void Cascade）');
    expect(snapshot.sortie?.variants[1].modifier).toContain('敌人元素强化：Heat');
    expect(snapshot.fissures.allActive?.[0].missionType).toBe('中断（Disruption）');
    expect(snapshot.fissures.allActive?.[0].enemy).toBe('Corrupted（堕落者）');
  });

  it('fetches without credentials and caches snapshot in IndexedDB meta without touching profiles', async () => {
    const dbName = 'ws-test-' + crypto.randomUUID();
    const db = await openDatabase(dbName);
    let capturedCredentials: RequestCredentials | undefined;
    let capturedUrl = '';
    const mockFetch: typeof fetch = async (input, init) => {
      capturedUrl = String(input);
      capturedCredentials = init?.credentials;
      return new Response(JSON.stringify(samplePayload), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });
    };

    try {
      const saved = await fetchAndCacheWorldState(db, {
        fetcher: mockFetch,
        now: () => new Date('2026-11-23T07:10:00.000Z'),
      });
      expect(capturedUrl).toBe(WFCD_PC_ENDPOINT);
      expect(capturedUrl).toContain('/pc/?language=zh');
      expect(capturedCredentials).toBe('omit');
      const reloaded = await loadWorldStateCache(db);
      expect(reloaded?.meta.fetchedAt).toBe(saved.meta.fetchedAt);
      expect(await db.profiles.count()).toBe(0);
    } finally {
      db.close();
      await db.delete();
    }
  });
});
