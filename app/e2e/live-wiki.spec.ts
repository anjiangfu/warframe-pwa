import {expect,test} from '@playwright/test';

const mockRhino = [
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
      {name: 'Roar', description: '短时间内让附近所有战甲提升伤害输出。'},
    ],
  },
];

const mockCircuits = [
  {
    uniqueName: '/Lotus/Types/Items/MiscItems/Circuits',
    name: '电路',
    category: 'Resources',
    type: 'Resource',
    description: '各种电子元件。\n\nLocation: Venus, Ceres, Kuva Fortress',
    wikiaUrl: 'https://wiki.warframe.com/w/Circuits',
  },
];

const mockDrops = [
  {place: 'Venus/Fossa (Assassination)', item: 'Rhino Chassis Blueprint', chance: 38.72, rarity: 'Common'},
];

test('default route opens console with quick MR bump, live wiki searches items/materials/helminth, pins to console, and fits 360/412px mobile', async ({
  page,
}) => {
  await page.route('https://api.warframestat.us/items/search/*', async route => {
    const url = decodeURIComponent(route.request().url());
    const body = url.toLowerCase().includes('circuits') ? mockCircuits : mockRhino;
    await route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(body)});
  });
  await page.route('https://api.warframestat.us/drops/search/*', async route => {
    await route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify(mockDrops)});
  });

  // Default route opens Today Console directly
  await page.goto('/');
  await expect(page.getByRole('heading', {name: '今日行动台'})).toBeVisible();

  // Create template profile and verify quick MR +1 button
  await page.getByRole('button', {name: '使用 MR12 模板创建档案'}).click();
  await expect(page.getByTestId('mr-value')).toHaveText('12');
  await page.getByTestId('quick-mr-bump').click();
  await expect(page.getByTestId('mr-value')).toHaveText('13');

  // Open Live Wiki, search Rhino, check Helminth highlight & full drops, drill into material, and pin to console
  await page.getByTestId('console-open-wiki').click();
  await expect(page.getByRole('heading', {name: '全能速查'})).toBeVisible();
  await page.getByTestId('live-wiki-input').fill('Rhino');
  await page.getByTestId('live-wiki-submit').click();

  await expect(page.getByTestId('wiki-helminth-highlight')).toContainText('战吼（Roar）');
  await expect(page.getByTestId('live-wiki-detail')).toContainText('电路（Circuits） × 600');
  await page.getByTestId('wiki-load-drops-btn').click();
  await expect(page.getByTestId('wiki-extra-drops')).toContainText('Venus/Fossa');

  // Pin Rhino to Today Console
  await page.getByTestId('wiki-pin-btn').click();
  await expect(page.getByTestId('wiki-pin-btn')).toContainText('已加入行动台');

  // Drill down into Circuits material directly from Rhino's component list
  await page.getByTestId('wiki-drill:Circuits').click();
  await expect(page.getByTestId('live-wiki-detail')).toContainText('电路');

  // Check Helminth catalog tab
  await page.getByTestId('wiki-tab-helminth').click();
  await page.getByTestId('helminth-search-input').fill('滋养');
  await expect(page.getByTestId('helminth:helminth:grendel')).toBeVisible();

  // Return to console and verify pinned Rhino target appears in candidates
  await page.getByRole('button', {name: '行动台·世界'}).click();
  await expect(page.getByTestId('candidate:wiki:/Lotus/Powersuits/Rhino/Rhino')).toBeVisible();

  // Verify zero horizontal overflow on 360px and 412px mobile viewports
  for (const width of [360, 412]) {
    await page.setViewportSize({width, height: 860});
    for (const hash of ['#console', '#wiki']) {
      await page.goto('/' + hash);
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `mobile ${width}px on ${hash}`).toBe(false);
    }
  }
});
