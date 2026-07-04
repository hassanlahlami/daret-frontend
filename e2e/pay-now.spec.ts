import { test, expect, type APIRequestContext } from '@playwright/test';
import { API, apiLogin, apiRegister, auth, jwtSub } from './helpers';

async function verified(request: APIRequestContext, compToken: string, email: string) {
  const token = await apiRegister(request, email);
  const userId = jwtSub(token);
  await request.post(`${API}/api/v1/admin/compliance/kyc/${userId}/decision`, {
    data: { decision: 'VERIFIED' }, ...auth(compToken)
  });
  return { token, userId };
}

test('a member can pay an upcoming contribution early', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const s = Date.now();
  const owner = await verified(request, comp, `po_${s}@e2e.ma`);
  const m = await verified(request, comp, `pm_${s}@e2e.ma`);

  const created = await request.post(`${API}/api/v1/circles`, {
    data: { name: `Pay ${s}`, contributionAmount: 500, seatCount: 2, cycleLengthDays: 7, shariaMode: true },
    ...auth(owner.token)
  });
  const circleId = (await created.json()).id as string;
  await request.post(`${API}/api/v1/circles/${circleId}/join`, { data: { slotPreference: 'LATE' }, ...auth(m.token) });
  await request.post(`${API}/api/v1/circles/${circleId}/activate`, auth(owner.token));

  const before = await (await request.get(`${API}/api/v1/me/obligations`, auth(m.token))).json();
  expect(before.length).toBeGreaterThan(0);

  const pay = await request.post(`${API}/api/v1/me/obligations/${before[0].id}/pay`, auth(m.token));
  expect(pay.ok()).toBeTruthy();

  const after = await (await request.get(`${API}/api/v1/me/obligations`, auth(m.token))).json();
  expect(after.length).toBe(before.length - 1); // the paid one is no longer scheduled
});
