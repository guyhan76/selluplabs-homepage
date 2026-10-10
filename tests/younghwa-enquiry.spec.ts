import { test, expect } from '@playwright/test';

const endpoint = 'https://formsubmit.co/ajax/lis000@hanmail.net';
async function fill(page: import('@playwright/test').Page) {
  await page.goto('/younghwa/#contact');
  await page.locator('#quote-form input[name=name]').fill('테스트 회사');
  await page.locator('#quote-form input[name=phone]').fill('010-0000-0000');
  await page.locator('#quote-form textarea').fill('상자 100개 견적 테스트');
}

test('enquiry posts once to the fixed recipient and waits for acceptance', async ({ page }) => {
  let count = 0;
  let release: () => void = () => {};
  const wait = new Promise<void>(resolve => { release = resolve; });
  await page.route(endpoint, async route => {
    count++;
    expect(route.request().method()).toBe('POST');
    const body = route.request().postDataJSON();
    expect(body.name).toBe('테스트 회사');
    expect(body.phone).toBe('010-0000-0000');
    expect(body.message).toBe('상자 100개 견적 테스트');
    expect(body.to).toBeUndefined();
    await wait;
    await route.fulfill({ json: { success: 'true', message: 'Form submitted successfully.' } });
  });
  await fill(page);
  await page.getByRole('button', { name: '견적문의 보내기' }).click();
  await expect(page.locator('#quote-form')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#quote-form button[type=submit]')).toBeDisabled();
  await expect(page.locator('.language')).toBeDisabled();
  // Programmatic duplicate submit must also be ignored while a request is outstanding.
  await page.locator('#quote-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  release();
  await expect(page.locator('#form-status')).toHaveAttribute('data-state', 'success');
  await expect(page.locator('#quote-form input[name=name]')).toHaveValue('');
  expect(count).toBe(1);
});

test('failed, uncertain and activation-pending submissions retain the enquiry', async ({ page }) => {
  await fill(page);
  for (const result of ['rejected', 'activation', 'network', 'malformed']) {
    await page.route(endpoint, async route => {
      if (result === 'network') return route.abort();
      if (result === 'malformed') return route.fulfill({ contentType: 'text/html', body: '<html>Error</html>' });
      return route.fulfill({ json: result === 'rejected'
        ? { success: false, message: 'Rejected' }
        : { success: true, message: 'Please activate your form.' } });
    });
    await page.getByRole('button', { name: '견적문의 보내기' }).click();
    await expect(page.locator('#form-status')).toHaveAttribute('data-state', 'error');
    await expect(page.locator('#quote-form textarea')).toHaveValue('상자 100개 견적 테스트');
    await expect(page.getByRole('button', { name: '견적문의 보내기' })).toBeEnabled();
    await page.unroute(endpoint);
  }
});

test('blank input cannot send; language changes preserve the draft and direct form fallback exists', async ({ page }) => {
  let count = 0;
  await page.route(endpoint, async route => { count++; await route.abort(); });
  await fill(page);
  await page.locator('#quote-form input[name=name]').fill('   ');
  await page.getByRole('button', { name: '견적문의 보내기' }).click();
  expect(count).toBe(0);
  await page.locator('#quote-form input[name=name]').fill('테스트 회사');
  await page.locator('.language').click();
  await expect(page.locator('#quote-form textarea')).toHaveValue('상자 100개 견적 테스트');
  await expect(page.getByRole('button', { name: 'Send enquiry' })).toBeVisible();
  await expect(page.locator('#quote-form')).toHaveAttribute('action', 'https://formsubmit.co/lis000@hanmail.net');
  await expect(page.locator('#quote-form')).toHaveAttribute('method', 'POST');
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
