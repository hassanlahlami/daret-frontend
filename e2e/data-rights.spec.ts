import { test, expect } from '@playwright/test';
import { API, apiLogin, apiRegister, auth } from './helpers';

test('a member exports their own data (right of access)', async ({ request }) => {
  const email = `access_${Date.now()}@e2e.ma`;
  const member = await apiRegister(request, email);

  const res = await request.get(`${API}/api/v1/me/data-export`, auth(member));
  expect(res.ok()).toBeTruthy();
  const bundle = await res.json();

  // The subject gets their own, un-masked personal data back.
  expect(bundle.profile.email).toBe(email);
  expect(bundle.score).toHaveProperty('tier');
  expect(Array.isArray(bundle.memberships)).toBeTruthy();
  expect(bundle).toHaveProperty('generatedAt');
});

test('a member files an erasure request; compliance sees and resolves it', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const member = await apiRegister(request, `erase_${Date.now()}@e2e.ma`);

  const filed = await request.post(`${API}/api/v1/me/erasure-request`, {
    data: { reason: 'Please remove my account.' }, ...auth(member)
  });
  expect(filed.ok()).toBeTruthy();
  const id = (await filed.json()).id as string;

  // Member sees it in their own list as PENDING.
  const mine = await (await request.get(`${API}/api/v1/me/erasure-requests`, auth(member))).json();
  expect(mine.some((r: { id: string; status: string }) => r.id === id && r.status === 'PENDING')).toBeTruthy();

  // Compliance sees the pending request.
  let pending = await (await request.get(`${API}/api/v1/admin/compliance/erasure-requests`, auth(comp))).json();
  expect(pending.some((r: { id: string }) => r.id === id)).toBeTruthy();

  // Resolve (reject: active obligations retained).
  const resolved = await request.post(`${API}/api/v1/admin/compliance/erasure-requests/${id}/resolve`, {
    data: { approved: false, resolution: 'Retained: active obligations' }, ...auth(comp)
  });
  expect((await resolved.json()).status).toBe('REJECTED');

  // No longer pending.
  pending = await (await request.get(`${API}/api/v1/admin/compliance/erasure-requests`, auth(comp))).json();
  expect(pending.some((r: { id: string }) => r.id === id)).toBeFalsy();
});
