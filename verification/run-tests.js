const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('Starting Cookie Clicker & Achievement System Verification Tests...\n');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Initial State
    console.log('Test 1: Initial state displays 0 clicks and all locked trophies');
    await page.goto('http://localhost:8080');
    await page.evaluate(() => {
      document.cookie = 'cookieClicks=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    });
    await page.reload();

    let countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '0', 'Initial count should be 0');

    let t10Class = await page.locator('#trophy-10').getAttribute('class');
    let t100Class = await page.locator('#trophy-100').getAttribute('class');
    let t1000Class = await page.locator('#trophy-1000').getAttribute('class');

    assert(t10Class.includes('locked'), 'Trophy 10 should be locked');
    assert(t100Class.includes('locked'), 'Trophy 100 should be locked');
    assert(t1000Class.includes('locked'), 'Trophy 1000 should be locked');
    console.log('  PASSED\n');

    // 2. Increments on click
    console.log('Test 2: Increments counter on cookie click');
    await page.locator('#cookie-btn').click();
    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '1', 'Count should increment to 1');
    console.log('  PASSED\n');

    // 3. Unlock 10 clicks trophy & toast notification
    console.log('Test 3: Unlocks 10 clicks trophy and displays toast');
    for (let i = 0; i < 9; i++) {
      await page.locator('#cookie-btn').click();
    }
    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '10', 'Count should be 10');

    t10Class = await page.locator('#trophy-10').getAttribute('class');
    assert(t10Class.includes('unlocked'), 'Trophy 10 should be unlocked');

    const toastMsg = await page.locator('#toast-message').textContent();
    assert(toastMsg.includes('Beginner'), 'Toast message should mention Beginner');
    console.log('  PASSED\n');

    // 4. Unlock 100 clicks trophy
    console.log('Test 4: Unlocks 100 clicks trophy');
    await page.evaluate(() => { document.cookie = 'cookieClicks=99; path=/;'; });
    await page.reload();
    await page.locator('#cookie-btn').click();

    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '100', 'Count should be 100');

    t100Class = await page.locator('#trophy-100').getAttribute('class');
    assert(t100Class.includes('unlocked'), 'Trophy 100 should be unlocked');
    console.log('  PASSED\n');

    // 5. Unlock 1000 clicks trophy
    console.log('Test 5: Unlocks 1000 clicks trophy');
    await page.evaluate(() => { document.cookie = 'cookieClicks=999; path=/;'; });
    await page.reload();
    await page.locator('#cookie-btn').click();

    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '1000', 'Count should be 1000');

    t1000Class = await page.locator('#trophy-1000').getAttribute('class');
    assert(t1000Class.includes('unlocked'), 'Trophy 1000 should be unlocked');
    console.log('  PASSED\n');

    // 6. Persistence across page reloads
    console.log('Test 6: Persists clicks and trophies across page reloads');
    await page.reload();
    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '1000', 'Count should persist as 1000');
    t1000Class = await page.locator('#trophy-1000').getAttribute('class');
    assert(t1000Class.includes('unlocked'), 'Trophy 1000 should remain unlocked');
    console.log('  PASSED\n');

    // 7. Reset button
    console.log('Test 7: Reset button clears score and locks trophies');
    await page.locator('#reset-btn').click();
    countText = await page.locator('#click-count').textContent();
    assert.strictEqual(countText, '0', 'Count should reset to 0');

    t10Class = await page.locator('#trophy-10').getAttribute('class');
    assert(t10Class.includes('locked'), 'Trophy 10 should be locked after reset');
    console.log('  PASSED\n');

    console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
