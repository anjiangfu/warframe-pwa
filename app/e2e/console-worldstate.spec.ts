import {expect,test} from '@playwright/test';

const mockWorldState = {
  timestamp: new Date().toISOString(),
  cetusCycle: {state: 'night', expiry: new Date(Date.now() + 35 * 60 * 1000).toISOString()},
  vallisCycle: {state: 'warm', expiry: new Date(Date.now() + 18 * 60 * 1000).toISOString()},
  cambionCycle: {state: 'fass', expiry: new Date(Date.now() + 50 * 60 * 1000).toISOString()},
  zarimanCycle: {state: 'corpus', expiry: new Date(Date.now() + 80 * 60 * 1000).toISOString()},
  duviriCycle: {state: 'joy', expiry: new Date(Date.now() + 90 * 60 * 1000).toISOString()},
  voidTrader: {
    active: true,
    character: "Baro Ki'Teer",
    location: '土星 · 克罗尼亚中继站',
    expiry: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    inventory: [
      {item: '川流不息 Prime', ducats: 350, credits: 110000},
      {item: '持久力 Prime', ducats: 350, credits: 140000},
    ],
  },
  events: [
    {
      id: 'ev-active-e2e',
      description: '尸鬼净化',
      faction: 'Grineer',
      node: '地球 · 希图斯',
      health: 75,
      expiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      rewards: [{asString: '猎人 弹药'}],
    },
    {
      id: 'ev-expired-e2e',
      description: '上月旧活动（不应显示）',
      expiry: '2026-10-01T00:00:00.000Z',
    },
  ],
  sortie: {
    boss: 'Sargas Ruk',
    faction: 'Grineer',
    expiry: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    variants: [{missionType: 'Capture', modifier: 'Augmented Enemy Armor', node: 'Saturn'}],
  },
  fissures: [
    {
      id: 'fis-steel',
      tier: 'Omnia',
      missionType: 'Void Cascade',
      node: 'Zariman',
      enemy: 'Corrupted',
      isHard: true,
      expiry: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
    },
    {
      id: 'fis-normal',
      tier: 'Lith',
      missionType: 'Capture',
      node: 'Void - Hepit',
      enemy: 'Orokin',
      isHard: false,
      expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  ],
  news: [
    {
      id: 'news-1',
      message: 'English News',
      translations: {zh: '官方更新公告测试'},
      link: 'https://www.warframe.com/news/test',
      date: new Date().toISOString(),
    },
  ],
};

test('WFCD worldstate sync, activity manual review priority, and 90-minute bucket persist offline', async ({
  page,
  context,
}) => {
  await page.route('https://api.warframestat.us/pc/**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockWorldState),
    });
  });

  await page.goto('/#console');
  await expect(page.getByRole('heading', {name: '今日行动台'})).toBeVisible();
  await expect(page.getByTestId('worldstate-freshness')).toContainText('尚未同步');

  await page.getByTestId('sync-worldstate-btn').click();
  await expect(page.getByTestId('worldstate-freshness')).toContainText('缓存有效');
  await expect(page.locator('.ws-cycle-grid')).toContainText('夜晚（Night）');
  await expect(page.locator('.ws-cycle-grid')).toContainText('喜悦螺旋（Joy）');
  await expect(page.locator('.sidebar-foot')).toContainText('动态资料：已同步');

  // Verify expired event is hidden and active event can be reviewed.
  await page.getByRole('tab', {name: /活动与商人/}).click();
  await expect(page.getByTestId('expired-events-notice')).toContainText('已自动隐藏 1 条');
  await expect(page.locator('.ws-list')).not.toContainText('上月旧活动');
  await expect(page.getByTestId('ws-event:ev-active-e2e')).toBeVisible();

  // Verify missions & fissure bilingual translation and filtering.
  await page.getByRole('tab', {name: /突击\/猎杀\/裂缝/}).click();
  await expect(page.locator('.ws-list')).toContainText('捕获（Capture）');
  await expect(page.locator('.ws-list')).toContainText('虚空覆涌（Void Cascade）');
  await page.getByRole('button', {name: '仅钢铁之路'}).click();
  await expect(page.locator('.ws-list .chips')).toContainText('全能（Omnia）');
  await expect(page.locator('.ws-list .chips')).not.toContainText('古纪（Lith）');

  // Record manual official review & reward priorities (limited-exclusive should auto-rank above repeatable).
  await page.getByTestId('review-wfcd:ev-active-e2e').click();
  await page.getByTestId('review-source-input').fill('https://www.warframe.com/news/ghoul-purge');
  await page.getByTestId('review-credibility-select').selectOption('official-page-verified');
  await page.getByTestId('review-eligibility-select').selectOption('ready');
  await page.getByTestId('review-eligibility-detail').fill('地球希图斯已解锁');
  await page.getByTestId('review-recommendation-select').selectOption('must-get');
  await page.getByTestId('review-reason-input').fill('限定饰品与稀缺 MOD 一次补齐');
  await page.getByTestId('review-howto-input').fill('赏金四阶速刷，带清图甲');

  await page.getByTestId('reward-name-input').fill('猎人 弹药（可复刷）');
  await page.getByTestId('reward-tier-select').selectOption('repeatable-tradable');
  await page.getByTestId('add-reward-btn').click();

  await page.getByTestId('reward-name-input').fill('活动限定纹章');
  await page.getByTestId('reward-tier-select').selectOption('limited-exclusive');
  await page.getByTestId('add-reward-btn').click();

  await expect(page.getByTestId('reward-row:0')).toContainText('活动限定纹章');
  await expect(page.getByTestId('reward-row:1')).toContainText('猎人 弹药（可复刷）');
  await page.getByTestId('save-review-btn').click();

  // Confirm review immediately upgrades the candidate card in the 90-minute console.
  const eventCandidate = page.getByTestId('candidate:ws:event:ev-active-e2e');
  await expect(eventCandidate).toContainText('必拿限时');
  await expect(eventCandidate).toContainText('官方活动页人工确认');
  await expect(eventCandidate).toContainText('活动限定纹章');

  // Add to today's checklist and toggle done (no time-box budget UI)
  await eventCandidate.getByRole('button', {name: '＋ 加入今日清单'}).click();
  const bucketRow = page.getByTestId('bucket:ws:event:ev-active-e2e');
  await expect(page.getByTestId('console-today-list')).toContainText('已完成 0 / 1');
  await bucketRow.locator('input[type="checkbox"]').check();
  await expect(page.getByTestId('console-today-list')).toContainText('已完成 1 / 1');

  // Reload and verify IndexedDB persistence even when offline.
  await page.reload();
  await expect(page.getByTestId('console-today-list')).toContainText('已完成 1 / 1');
  await expect(page.getByTestId('worldstate-freshness')).toContainText('缓存有效');
  await expect(page.getByTestId('saved-review:ev-active-e2e')).toContainText('活动限定纹章');

  await context.setOffline(true);
  await expect(page.getByTestId('sync-worldstate-btn')).toBeDisabled();
  await expect(page.getByTestId('candidate:ws:event:ev-active-e2e')).toContainText('必拿限时');
  await context.setOffline(false);
});
