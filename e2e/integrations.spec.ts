import { test, expect } from '@playwright/test';
import { API, apiRegister, auth } from './helpers';

test('a member initiates a KYC session with the (mock) partner', async ({ request }) => {
  const token = await apiRegister(request, `kyc_${Date.now()}@e2e.ma`);

  const res = await request.post(`${API}/api/v1/kyc/initiate`, auth(token));
  expect(res.ok()).toBeTruthy();

  const session = await res.json();
  expect(session.partnerRef).toContain('mock-kyc-');
  expect(session.redirectUrl).toBeTruthy();
  expect(session.status).toBe('PENDING');
});
