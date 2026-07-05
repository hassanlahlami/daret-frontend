import { test, expect } from '@playwright/test';
import { API, apiRegister, auth, uiLogin, DEMO_PASSWORD } from './helpers';

test('a fresh member has no circles and sees the onboarding checklist', async ({ page, request }) => {
  const email = `onb_${Date.now()}@e2e.ma`;
  const token = await apiRegister(request, email);

  // Brand-new members belong to no circle yet.
  const mine = await (await request.get(`${API}/api/v1/me/circles`, auth(token))).json();
  expect(Array.isArray(mine)).toBeTruthy();
  expect(mine.length).toBe(0);

  // The dashboard greets them with the getting-started checklist.
  await uiLogin(page, email, DEMO_PASSWORD);
  await page.goto('/fr/dashboard');
  await expect(page.getByText('Bienvenue sur Daret')).toBeVisible();
  await expect(page.getByText('Vérifiez votre identité')).toBeVisible();
  // Empty state for circles instead of a bare "nothing" line.
  await expect(page.getByText("Aucun cercle pour l'instant")).toBeVisible();
});
