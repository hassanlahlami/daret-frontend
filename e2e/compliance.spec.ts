import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test('compliance officer verifies the audit chain', async ({ page }) => {
  await uiLogin(page, 'compliance@daret.demo');
  await page.goto('/fr/compliance');

  await expect(page.getByRole('heading', { name: 'Console de conformité' })).toBeVisible();
  await page.getByRole('button', { name: 'Vérifier' }).click();
  // Integrity report: chain is intact.
  await expect(page.getByText(/Chaîne intègre/)).toBeVisible();
  // Audit chain table shows recorded actions.
  await expect(page.getByText('kyc.decision').first()).toBeVisible();
});

test('a plain member is denied the compliance console', async ({ page }) => {
  await uiLogin(page, 'demo1@daret.demo');
  await page.goto('/fr/compliance');

  // RequireAuth role gate renders the error message, not the console.
  await expect(page.getByRole('heading', { name: 'Console de conformité' })).toHaveCount(0);
});
