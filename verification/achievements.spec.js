import { test, expect } from '@playwright/test';

test.describe('Cookie Clicker & Achievement System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    // Clear cookies before each test
    await page.evaluate(() => {
      document.cookie = 'cookieClicks=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
    await page.reload();
  });

  test('initial state displays 0 clicks and locked trophies', async ({ page }) => {
    const clickCount = page.locator('#click-count');
    await expect(clickCount).toHaveText('0');

    const trophy10 = page.locator('#trophy-10');
    const trophy100 = page.locator('#trophy-100');
    const trophy1000 = page.locator('#trophy-1000');

    await expect(trophy10).toHaveClass(/locked/);
    await expect(trophy100).toHaveClass(/locked/);
    await expect(trophy1000).toHaveClass(/locked/);
  });

  test('increments counter when clicking cookie', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    const clickCount = page.locator('#click-count');

    await cookieBtn.click();
    await expect(clickCount).toHaveText('1');

    await cookieBtn.click();
    await expect(clickCount).toHaveText('2');
  });

  test('unlocks 10 click trophy and displays notification toast', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    const clickCount = page.locator('#click-count');
    const trophy10 = page.locator('#trophy-10');
    const toast = page.locator('#toast-notification');

    for (let i = 0; i < 9; i++) {
      await cookieBtn.click();
    }
    await expect(clickCount).toHaveText('9');
    await expect(trophy10).toHaveClass(/locked/);

    // 10th click triggers trophy
    await cookieBtn.click();
    await expect(clickCount).toHaveText('10');
    await expect(trophy10).toHaveClass(/unlocked/);
    await expect(toast).not.toHaveClass(/hidden/);
    await expect(toast).toContainText('Beginner (10 Clicks)');
  });

  test('unlocks 100 click trophy', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    const trophy100 = page.locator('#trophy-100');

    // Set cookie directly to 99 clicks and reload
    await page.evaluate(() => {
      document.cookie = 'cookieClicks=99; path=/;';
    });
    await page.reload();

    await expect(trophy100).toHaveClass(/locked/);

    // 100th click
    await cookieBtn.click();
    await expect(page.locator('#click-count')).toHaveText('100');
    await expect(trophy100).toHaveClass(/unlocked/);
  });

  test('unlocks 1000 click trophy', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    const trophy1000 = page.locator('#trophy-1000');

    // Set cookie directly to 999 clicks and reload
    await page.evaluate(() => {
      document.cookie = 'cookieClicks=999; path=/;';
    });
    await page.reload();

    await expect(trophy1000).toHaveClass(/locked/);

    // 1000th click
    await cookieBtn.click();
    await expect(page.locator('#click-count')).toHaveText('1000');
    await expect(trophy1000).toHaveClass(/unlocked/);
  });

  test('persists clicks and unlocked trophies across page reloads', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    for (let i = 0; i < 10; i++) {
      await cookieBtn.click();
    }

    await page.reload();
    await expect(page.locator('#click-count')).toHaveText('10');
    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);
  });

  test('reset button clears clicks and locks trophies', async ({ page }) => {
    const cookieBtn = page.locator('#cookie-btn');
    for (let i = 0; i < 10; i++) {
      await cookieBtn.click();
    }

    await expect(page.locator('#trophy-10')).toHaveClass(/unlocked/);

    const resetBtn = page.locator('#reset-btn');
    await resetBtn.click();

    await expect(page.locator('#click-count')).toHaveText('0');
    await expect(page.locator('#trophy-10')).toHaveClass(/locked/);
  });
});
