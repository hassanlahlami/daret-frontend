import { test, expect, type APIRequestContext } from '@playwright/test';
import { API, apiLogin, apiRegister, auth, jwtSub } from './helpers';

async function verified(request: APIRequestContext, compToken: string, email: string) {
  const token = await apiRegister(request, email);
  const userId = jwtSub(token);
  const res = await request.post(`${API}/api/v1/admin/compliance/kyc/${userId}/decision`, {
    data: { decision: 'VERIFIED' }, ...auth(compToken)
  });
  expect(res.ok(), `verify ${email}`).toBeTruthy();
  return { token, userId };
}

test('vouches raise the vouchee credit score', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const s = Date.now();
  const vouchee = await verified(request, comp, `v0_${s}@e2e.ma`);
  const before = (await (await request.get(`${API}/api/v1/me/score`, auth(vouchee.token))).json()).score;

  const a = await verified(request, comp, `va_${s}@e2e.ma`);
  const b = await verified(request, comp, `vb_${s}@e2e.ma`);
  expect((await request.post(`${API}/api/v1/me/vouch/${vouchee.userId}`, auth(a.token))).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/v1/me/vouch/${vouchee.userId}`, auth(b.token))).ok()).toBeTruthy();

  const after = (await (await request.get(`${API}/api/v1/me/score`, auth(vouchee.token))).json()).score;
  expect(after).toBeGreaterThan(before);

  // The score change is recorded in history.
  const history = await (await request.get(`${API}/api/v1/me/score/history`, auth(vouchee.token))).json();
  expect(history.length).toBeGreaterThanOrEqual(2);
  expect(history[history.length - 1].score).toBe(after);
});

test('invite-only circle requires a valid code', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const s = Date.now();
  const owner = await verified(request, comp, `io_${s}@e2e.ma`);
  const joiner = await verified(request, comp, `ij_${s}@e2e.ma`);

  const created = await request.post(`${API}/api/v1/circles`, {
    data: { name: `Priv ${s}`, contributionAmount: 500, seatCount: 3, cycleLengthDays: 30, shariaMode: true, inviteOnly: true },
    ...auth(owner.token)
  });
  const circleId = (await created.json()).id as string;

  // Without a code → rejected.
  const noCode = await request.post(`${API}/api/v1/circles/${circleId}/join`, {
    data: { slotPreference: 'FLEXIBLE' }, ...auth(joiner.token)
  });
  expect(noCode.status()).toBe(400);

  // Owner mints an invite; joining with it works.
  const inv = await request.post(`${API}/api/v1/circles/${circleId}/invites`, auth(owner.token));
  const code = (await inv.json()).code as string;
  const withCode = await request.post(`${API}/api/v1/circles/${circleId}/join`, {
    data: { slotPreference: 'FLEXIBLE', inviteCode: code }, ...auth(joiner.token)
  });
  expect(withCode.ok()).toBeTruthy();
});
