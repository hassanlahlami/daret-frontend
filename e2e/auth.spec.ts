import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test('unauthenticated dashboard access redirects to login', async ({ page }) => {
  await page.goto('/fr/dashboard');
  await page.waitForURL('**/fr/login');
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
});

test('seeded member can log in and reach discover', async ({ page }) => {
  await uiLogin(page, 'demo1@daret.demo');
  await expect(page).toHaveURL(/\/fr\/circles/);
  await expect(page.getByRole('link', { name: 'Tableau de bord' })).toBeVisible();
});
