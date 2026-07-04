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

test('a missed contribution lands in the member notification inbox', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const admin = await apiLogin(request, 'admin@daret.demo');
  const s = Date.now();

  const owner = await verified(request, comp, `no_${s}@e2e.ma`);
  const m = await verified(request, comp, `nm_${s}@e2e.ma`);

  const created = await request.post(`${API}/api/v1/circles`, {
    data: { name: `Notif ${s}`, contributionAmount: 500, seatCount: 2, cycleLengthDays: 7, shariaMode: true },
    ...auth(owner.token)
  });
  const circleId = (await created.json()).id as string;
  await request.post(`${API}/api/v1/circles/${circleId}/join`, { data: { slotPreference: 'LATE' }, ...auth(m.token) });
  await request.post(`${API}/api/v1/circles/${circleId}/activate`, auth(owner.token));

  // Sweep past the grace window → contributions MISSED, member notified.
  await request.post(`${API}/api/v1/admin/ops/run-default-sweep?asOf=2030-01-01`, auth(admin));

  const inbox = await (await request.get(`${API}/api/v1/me/notifications`, auth(m.token))).json();
  expect(inbox.length).toBeGreaterThan(0);
  expect(inbox.some((n: { type: string }) => n.type === 'CONTRIBUTION_MISSED')).toBeTruthy();

  const unread = await (await request.get(`${API}/api/v1/me/notifications/unread-count`, auth(m.token))).json();
  expect(unread.unread).toBeGreaterThan(0);
});
