import { test, expect } from '@playwright/test';
import { API, apiRegister, DEMO_PASSWORD } from './helpers';

test('login locks the account after repeated failures', async ({ request }) => {
  const email = `lock_${Date.now()}@e2e.ma`;
  await apiRegister(request, email); // password = DEMO_PASSWORD

  for (let i = 0; i < 5; i++) {
    const r = await request.post(`${API}/api/v1/auth/login`, { data: { email, password: 'wrong-password' } });
    expect(r.status()).toBe(401);
  }
  // Now locked — even the correct password is refused with 423.
  const locked = await request.post(`${API}/api/v1/auth/login`, { data: { email, password: DEMO_PASSWORD } });
  expect(locked.status()).toBe(423);
});

test('security response headers are set', async ({ request }) => {
  const h = (await request.get(`${API}/api/v1/health`)).headers();
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['content-security-policy']).toContain("default-src 'none'");
});
