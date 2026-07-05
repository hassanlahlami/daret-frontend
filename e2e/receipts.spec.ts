import { test, expect } from '@playwright/test';
import { API, apiLogin, auth, uiLogin } from './helpers';

test('a member sees their billing receipts (API + UI)', async ({ page, request }) => {
  const token = await apiLogin(request, 'demo1@daret.demo');

  const receipts = await (await request.get(`${API}/api/v1/me/receipts`, auth(token))).json();
  expect(Array.isArray(receipts)).toBeTruthy();
  expect(receipts.length).toBeGreaterThan(0);
  expect(receipts[0]).toHaveProperty('reference');
  expect(receipts[0]).toHaveProperty('amount');

  await uiLogin(page, 'demo1@daret.demo');
  await page.goto('/fr/recus');
  await expect(page.getByRole('heading', { name: 'Mes reçus' })).toBeVisible();
  // Seeded member has received payouts, so at least one payout receipt shows.
  await expect(page.getByText('Versement reçu').first()).toBeVisible();
});
