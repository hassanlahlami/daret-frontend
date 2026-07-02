import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test('member creates a circle through the wizard', async ({ page }) => {
  await uiLogin(page, 'demo1@daret.demo');

  await page.goto('/fr/circles/new');
  const name = `E2E circle ${Date.now()}`;
  await page.getByLabel('Nom', { exact: true }).fill(name);
  await page.getByLabel('Contribution (MAD)').fill('750');
  await page.getByLabel('Nombre de places').fill('4');
  await page.getByLabel('Durée du cycle (jours)').fill('30');
  await page.getByRole('button', { name: 'Créer' }).click();

  // Lands on the new circle's detail page.
  await expect(page.getByRole('heading', { name })).toBeVisible();
  await expect(page.getByText('FORMING')).toBeVisible();
});

test('dashboard shows the credit score and payouts for a seeded member', async ({ page }) => {
  await uiLogin(page, 'demo1@daret.demo');
  await page.goto('/fr/dashboard');

  await expect(page.getByText('Score de crédit')).toBeVisible();
  await expect(page.getByText('Palier')).toBeVisible();
  // The seeded ACTIVE circle gives demo1 a payout row (MAD currency rendered).
  await expect(page.getByText('Mes versements')).toBeVisible();
});
