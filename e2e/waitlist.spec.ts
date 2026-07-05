import { test, expect } from '@playwright/test';
import { API } from './helpers';

test('the public waitlist accepts a signup and is idempotent', async ({ request }) => {
  const email = `wl_${Date.now()}@e2e.ma`;

  const first = await request.post(`${API}/api/v1/waitlist`, { data: { email, locale: 'fr' } });
  expect(first.ok()).toBeTruthy();
  expect((await first.json()).added).toBe(true);

  // Re-submitting the same email is a no-op success (no duplicate).
  const second = await request.post(`${API}/api/v1/waitlist`, { data: { email, locale: 'fr' } });
  expect(second.ok()).toBeTruthy();
  expect((await second.json()).added).toBe(false);

  // Bad email is rejected.
  const bad = await request.post(`${API}/api/v1/waitlist`, { data: { email: 'nope', locale: 'fr' } });
  expect(bad.status()).toBe(400);
});

test('a visitor joins the waitlist from the pricing page', async ({ page }) => {
  await page.goto('/fr/tarifs');
  await expect(page.getByRole('heading', { name: 'Simple et transparent' })).toBeVisible();
  await page.getByPlaceholder('Votre e-mail').fill(`ui_${Date.now()}@e2e.ma`);
  await page.getByRole('button', { name: "M'inscrire" }).click();
  await expect(page.getByText('Vous êtes sur la liste', { exact: false })).toBeVisible();
});
