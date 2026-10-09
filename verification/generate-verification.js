const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: { dir: '/home/jules/verification/videos' }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:8080');
  await page.waitForTimeout(500);

  // Clear cookie initially
  await page.evaluate(() => {
    document.cookie = 'cookieClicks=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });
  await page.reload();
  await page.waitForTimeout(500);

  // Click 10 times to unlock Beginner
  for (let i = 0; i < 10; i++) {
    await page.locator('#cookie-btn').click();
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(1000);

  // Jump to 99 clicks to show Enthusiast unlock
  await page.evaluate(() => { document.cookie = 'cookieClicks=99; path=/;'; });
  await page.reload();
  await page.waitForTimeout(500);

  await page.locator('#cookie-btn').click();
  await page.waitForTimeout(1000);

  // Jump to 999 clicks to show Master unlock
  await page.evaluate(() => { document.cookie = 'cookieClicks=999; path=/;'; });
  await page.reload();
  await page.waitForTimeout(500);

  await page.locator('#cookie-btn').click();
  await page.waitForTimeout(1000);

  // Take screenshot showing all trophies unlocked and 1000 clicks
  await page.screenshot({ path: '/home/jules/verification/screenshots/verification.png', fullPage: true });
  await page.waitForTimeout(1000);

  await context.close();
  await browser.close();
  console.log('CUJ verification script finished!');
})();
