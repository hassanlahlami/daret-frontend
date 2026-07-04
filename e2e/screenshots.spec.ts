import { test } from '@playwright/test';
import { uiLogin } from './helpers';

// Capture vitrine screenshots into ../docs/img. Skipped unless SHOTS=1 so it
// never runs in CI. Run: SHOTS=1 npx playwright test screenshots (backend seeded).
const enabled = !!process.env.SHOTS;
const dir = 'docs/img';

test.describe('screenshots', () => {
  test.skip(!enabled, 'set SHOTS=1 to capture');
  test.use({ viewport: { width: 1280, height: 900 } });

  test('capture', async ({ page }) => {
    await page.goto('/fr');
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${dir}/landing.png`, fullPage: true });

    await page.goto('/fr/securite');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${dir}/securite.png`, fullPage: true });

    await uiLogin(page, 'demo1@daret.demo');

    await page.goto('/fr/circles');
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${dir}/discover.png` });

    await page.goto('/fr/dashboard');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/dashboard.png` });

    // Admin console.
    await page.evaluate(() => localStorage.clear());
    await uiLogin(page, 'admin@daret.demo');
    await page.goto('/fr/admin');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/admin.png`, fullPage: true });

    await page.goto('/fr/admin/analytics');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/analytics.png`, fullPage: true });

    // Switch to the compliance officer for the console.
    await page.evaluate(() => localStorage.clear());
    await uiLogin(page, 'compliance@daret.demo');
    await page.goto('/fr/compliance');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/compliance.png`, fullPage: true });
  });
});
