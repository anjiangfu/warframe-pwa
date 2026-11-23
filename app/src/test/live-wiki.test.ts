import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {
  buildExternalGuideLinks,
  filterHelminthEntries,
  parseLiveDropsPayload,
  parseLiveItemsPayload,
} from '../domain/live-wiki';
import {openDatabase} from '../storage/db';
import {searchLiveItems} from '../storage/live-wiki-cache';
import {addPinnedTarget,loadPinnedTargets,removePinnedTarget} from '../storage/pinned-targets-store';
import {LocalProvider} from '../catalog/provider';
import {buildConsoleCandidates} from '../domain/session-planner';

const provider = new LocalProvider();

const sampleRhino = [
  {
    uniqueName: '/Lotus/Powersuits/Rhino/Rhino',
    name: 'Rhino',
    category: 'Warframes',
    type: 'Warframe',
    masteryReq: 0,
    buildPrice: 25000,
    buildTime: 259200,
    wikiaUrl: 'https://wiki.warframe.com/w/Rhino',
    components: [
      {
        uniqueName: '/Lotus/Types/Items/MiscItems/Circuits',
        name: 'Circuits',
        itemCount: 600,
        description: 'Electronic parts.\n\nLocation: Venus, Ceres',
      },
      {
        uniqueName: '/Lotus/Types/Recipes/WarframeRecipes/RhinoHelmetComponent',
        name: 'Neuroptics',
        itemCount: 1,
        drops: [
          {location: 'Venus/Fossa (Assassination)', type: 'Rhino Neuroptics Blueprint', chance: 0.3872, rarity: 'Common'},
        ],
      },
    ],
    abilities: [
      {name: 'Roar', description: '提升附近队友伤害输出。'},
    ],
  },
];

describe('Live Companion Wiki & Helminth lookup', () => {
  it('parses WFCD items with bilingual components, location hints, drop percentages, and Helminth link', () => {
    const items = parseLiveItemsPayload(sampleRhino);
    expect(items).toHaveLength(1);
    const rhino = items[0];
    expect(rhino.englishName).toBe('Rhino');
    expect(rhino.buildTimeHours).toBe(72);
    expect(rhino.helminth?.abilityZh).toBe('战吼');
    expect(rhino.components[0].nameZh).toBe('电路（Circuits）');
    expect(rhino.components[0].locationHint).toBe('Venus, Ceres');
    expect(rhino.components[1].nameZh).toBe('头部神经光元（Neuroptics）');
    expect(rhino.components[1].drops[0].chance).toBe(38.72);
    expect(rhino.components[1].drops[0].rarity).toBe('常见');

    const links = buildExternalGuideLinks(rhino);
    expect(links.officialWiki).toBe('https://wiki.warframe.com/w/Rhino');
    expect(links.huijiWiki).toContain('warframe.huijiwiki.com');
    expect(links.bilibiliBuild).toContain('search.bilibili.com');

    const drops = parseLiveDropsPayload([
      {place: 'Saturn/Helene', item: 'Orokin Cell', chance: 2.5, rarity: 'Rare'},
      {place: 'Ceres/Gabii', item: 'Orokin Cell', chance: 11.2, rarity: 'Uncommon'},
    ]);
    expect(drops[0].location).toBe('Ceres/Gabii');
  });

  it('caches WFCD search in IndexedDB with language fallback and offline fallback without touching profiles', async () => {
    const dbName = 'live-wiki-test-' + crypto.randomUUID();
    const db = await openDatabase(dbName);
    const calledUrls: string[] = [];
    const mockFetch: typeof fetch = async input => {
      const url = String(input);
      calledUrls.push(url);
      if (url.includes('language=zh')) {
        return new Response(JSON.stringify([]), {status: 200});
      }
      return new Response(JSON.stringify(sampleRhino), {status: 200});
    };

    try {
      const first = await searchLiveItems('犀牛', db, {fetcher: mockFetch});
      expect(calledUrls.length).toBe(2);
      expect(first.fromCache).toBe(false);
      expect(first.result.items).toHaveLength(1);

      const second = await searchLiveItems('犀牛', db, {fetcher: mockFetch});
      expect(second.fromCache).toBe(true);
      expect(calledUrls.length).toBe(2);
      expect(await db.profiles.count()).toBe(0);
    } finally {
      db.close();
      await db.delete();
    }
  });

  it('filters Helminth catalog and pins wiki targets into the 90-minute console candidates', async () => {
    const energySubs = filterHelminthEntries('', '回蓝');
    expect(energySubs.some(e => e.abilityZh === '滋养')).toBe(true);
    expect(filterHelminthEntries('roar', 'all')[0]?.warframeEn).toBe('Rhino');

    const dbName = 'pin-target-test-' + crypto.randomUUID();
    const db = await openDatabase(dbName);
    try {
      await addPinnedTarget(db, {
        id: 'wiki:/Lotus/Powersuits/Rhino/Rhino',
        title: 'Rhino',
        where: 'Venus/Fossa (Assassination)',
        why: '制造涉及：电路×600',
        whatNext: '逐项刷取部件并铸造',
        addedAt: '2026-11-23T08:00:00.000Z',
      });
      const pins = await loadPinnedTargets(db);
      expect(pins).toHaveLength(1);

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
        null,
        Date.now(),
        {},
        pins,
      );
      expect(candidates[0]?.id).toBe('wiki:/Lotus/Powersuits/Rhino/Rhino');
      expect(candidates[0]?.focused).toBe(true);

      const after = await removePinnedTarget(db, 'wiki:/Lotus/Powersuits/Rhino/Rhino');
      expect(after).toHaveLength(0);
    } finally {
      db.close();
      await db.delete();
    }
  });
});
