import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

test('motion preview keeps its own route, working images and usable mobile layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/motion-preview/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('기억되는 브랜드로.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  const heroImages = page.locator('.poster img');
  await expect(heroImages).toHaveCount(3);
  for (const img of await heroImages.all()) {
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await expect(page.getByRole('link', { name: '현재 홈페이지로 이동 ↗' })).toHaveAttribute('href', '/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('manual reel navigation works while animation is paused', async ({ page }) => {
  await page.goto('/motion-preview/');
  await page.getByRole('button', { name: '움직임 정지' }).click();
  await expect(page.locator('body')).toHaveClass(/paused/);
  await expect(page.getByRole('button', { name: '움직임 재생' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '다음 광고' }).click();
  await expect(page.locator('#reel-image')).toHaveAttribute('alt', '스네일 크림 광고 예시');
  await expect(page.locator('[data-slide="1"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-slide="2"]').click();
  await expect(page.locator('#reel-count')).toHaveText('03 / 03');
  await page.getByRole('button', { name: '다음 광고' }).click();
  await expect(page.locator('#reel-count')).toHaveText('01 / 03');
  await page.getByRole('button', { name: '이전 광고' }).click();
  await expect(page.locator('#reel-count')).toHaveText('03 / 03');
  await expect.poll(() => page.locator('#reel-image').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
});

test('reel advances only in view and stops when paused', async ({ page }) => {
  await page.goto('/motion-preview/');
  await page.clock.install();
  await page.clock.fastForward(6000);
  await expect(page.locator('#reel-count')).toHaveText('01 / 03');
  await page.locator('.reel').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(300);
  await page.clock.fastForward(5100);
  await expect(page.locator('#reel-count')).toHaveText('02 / 03');
  await page.locator('#motion-toggle').evaluate((button: HTMLButtonElement) => button.click());
  await page.clock.fastForward(11000);
  await expect(page.locator('#reel-count')).toHaveText('02 / 03');
  await page.locator('#motion-toggle').evaluate((button: HTMLButtonElement) => button.click());
  await page.locator('[data-slide="2"]').focus();
  await page.locator('[data-slide="2"]').press('Enter');
  await expect(page.locator('#reel-count')).toHaveText('03 / 03');
  await page.clock.fastForward(11000);
  await expect(page.locator('#reel-count')).toHaveText('03 / 03');
});

test('reduced motion disables autoplay and decorative animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/motion-preview/');
  await expect(page.locator('body')).toHaveClass(/paused/);
  expect(await page.locator('.poster-center').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await page.clock.install();
  await page.locator('.reel').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.runFor(300);
  await page.clock.fastForward(11000);
  await expect(page.locator('#reel-count')).toHaveText('01 / 03');
  await page.getByRole('button', { name: '다음 광고' }).click();
  await expect(page.locator('#reel-count')).toHaveText('02 / 03');
});
