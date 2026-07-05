import { test, expect } from '@playwright/test';
import { uiLogin } from './helpers';

test('admin sees the overview KPIs and can browse circles/users/ops', async ({ page }) => {
  await uiLogin(page, 'admin@daret.demo');

  await page.goto('/fr/admin');
  await expect(page.getByRole('heading', { name: "Vue d'ensemble" })).toBeVisible();
  await expect(page.getByText('Utilisateurs').first()).toBeVisible();
  await expect(page.getByText('Revenu plateforme')).toBeVisible();
  // Seeded data → at least one ACTIVE and one COMPLETED circle in the status breakdown.
  await expect(page.getByText('ACTIVE').first()).toBeVisible();

  await page.goto('/fr/admin/circles');
  await expect(page.getByRole('heading', { name: 'Cercles' })).toBeVisible();

  await page.goto('/fr/admin/users');
  await expect(page.getByText('Rôles')).toBeVisible();

  await page.goto('/fr/admin/ops');
  await expect(page.getByText('Lancer le cycle')).toBeVisible();

  await page.goto('/fr/admin/analytics');
  await expect(page.getByText('Nouveaux cercles / semaine')).toBeVisible();
  await expect(page.getByText('Recommandations')).toBeVisible();
});

test('a non-admin member is denied the admin console', async ({ page }) => {
  await uiLogin(page, 'demo1@daret.demo');
  await page.goto('/fr/admin');
  await expect(page.getByRole('heading', { name: "Vue d'ensemble" })).toHaveCount(0);
});

test('an admin is redirected out of member features to the admin console', async ({ page }) => {
  await uiLogin(page, 'admin@daret.demo');
  // Member pages are off-limits to admins — each bounces to /admin.
  for (const memberPath of ['/fr/dashboard', '/fr/circles', '/fr/kyc', '/fr/mes-donnees']) {
    await page.goto(memberPath);
    await page.waitForURL('**/fr/admin');
    await expect(page.getByRole('heading', { name: "Vue d'ensemble" })).toBeVisible();
  }
  // And the member links are absent from the admin nav.
  await expect(page.getByRole('link', { name: 'Tableau de bord' })).toHaveCount(0);
});
