import { type Page, type APIRequestContext, expect } from '@playwright/test';

export const API = process.env.E2E_API ?? 'http://localhost:8080';

/** Demo credentials seeded by the backend (DARET_SEED_ENABLED=true). */
export const DEMO_PASSWORD = 'password123';

/** Decode the `sub` (user id) from a JWT without verifying. */
export function jwtSub(token: string): string {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString()).sub;
}

/** Log in through the UI (French locale) and wait for the discover page. */
export async function uiLogin(page: Page, email: string, password = DEMO_PASSWORD) {
  await page.goto('/fr/login');
  await page.getByPlaceholder('E-mail').fill(email);
  await page.getByPlaceholder('Mot de passe').fill(password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL('**/fr/circles');
}

// ---- Backend API helpers (for arranging money-flow state) ----

export async function apiLogin(request: APIRequestContext, email: string, password = DEMO_PASSWORD) {
  const res = await request.post(`${API}/api/v1/auth/login`, { data: { email, password } });
  expect(res.ok(), `login ${email}`).toBeTruthy();
  return (await res.json()).accessToken as string;
}

export async function apiRegister(request: APIRequestContext, email: string) {
  const res = await request.post(`${API}/api/v1/auth/register`, { data: { email, password: DEMO_PASSWORD } });
  expect(res.ok(), `register ${email}`).toBeTruthy();
  return (await res.json()).accessToken as string;
}

export function auth(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}
