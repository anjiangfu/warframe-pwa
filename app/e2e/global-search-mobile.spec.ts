import {expect,test} from '@playwright/test';

test('Ctrl+K global search jumps across modules, protects dirty forms, and mobile viewports have zero horizontal overflow', async ({
  page,
}) => {
  await page.goto('/#tree');
  await page.getByRole('button', {name: '使用 MR12 模板创建档案'}).click();
  await expect(page.getByRole('heading', {name: '你的七条养成路线'})).toBeVisible();

  // Open via Ctrl+K and jump to Goal Assistant
  await page.keyboard.press('Control+k');
  await expect(page.getByTestId('global-search-modal')).toBeVisible();
  await page.getByTestId('global-search-input').fill('毒囊双枪');
  await page.getByTestId('search-hit:goal:goal:dual-toxocyst').click();
  await expect(page.getByRole('heading', {name: '通用目标助手'})).toBeVisible();
  await expect(page.getByLabel('当前目标', {exact: true})).toHaveValue('goal:dual-toxocyst');

  // Dirty form protection blocks search navigation and preserves unsaved input
  await page.getByLabel('1999声望点数', {exact: true}).fill('8888');
  await page.getByTestId('global-search-trigger').click();
  await page.getByTestId('global-search-input').fill('六人组');
  await page.getByTestId('search-hit:syndicate:syndicate:hex').click();
  await expect(page.getByRole('alert')).toContainText('未保存');
  await expect(page.getByLabel('1999声望点数', {exact: true})).toHaveValue('8888');

  // Clear dirty input and jump to Prime Equipment inside Relics page
  await page.getByLabel('1999声望点数', {exact: true}).fill('');
  await page.getByTestId('global-search-trigger').click();
  await page.getByTestId('global-search-input').fill('Burston Prime');
  const firstRelicHit = page.locator('[data-testid^="search-hit:equipment:"]').first();
  await expect(firstRelicHit).toBeVisible();
  await firstRelicHit.click();
  await expect(page.getByRole('heading', {name: '虚空遗物'})).toBeVisible();
  await expect(page.getByRole('region', {name: '装备关联奖励'})).toBeVisible();

  // Verify zero horizontal overflow on 360px and 412px mobile viewports across key pages & global search modal
  for (const width of [360, 412]) {
    await page.setViewportSize({width, height: 860});
    for (const hash of ['#console', '#tree', '#relics']) {
      await page.goto('/' + hash);
      await page.waitForTimeout(150);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `viewport ${width}px on ${hash} should not overflow horizontally`).toBe(false);
    }

    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('global-search-modal')).toBeVisible();
    await page.getByTestId('global-search-input').fill('福马');
    const modalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(modalOverflow, `viewport ${width}px with global search open`).toBe(false);
    await page.keyboard.press('Escape');
  }
});
