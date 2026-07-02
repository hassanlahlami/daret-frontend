import { test, expect, type APIRequestContext } from '@playwright/test';
import { API, apiLogin, apiRegister, auth, jwtSub, uiLogin, DEMO_PASSWORD } from './helpers';

/**
 * The money flow (spec §16), arranged via the API and asserted in both the API
 * and the UI. Uses seeded compliance@ (KYC decisions) and admin@ (ops triggers).
 */

type DemoUser = { email: string; token: string; userId: string };

async function verifiedUser(request: APIRequestContext, complianceToken: string, email: string): Promise<DemoUser> {
  const token = await apiRegister(request, email);
  const userId = jwtSub(token);
  const res = await request.post(`${API}/api/v1/admin/compliance/kyc/${userId}/decision`, {
    data: { decision: 'VERIFIED' },
    ...auth(complianceToken)
  });
  expect(res.ok(), `verify ${email}`).toBeTruthy();
  return { email, token, userId };
}

async function fullActiveCircle(request: APIRequestContext, complianceToken: string, tag: string) {
  const stamp = Date.now();
  const users: DemoUser[] = [];
  for (let i = 0; i < 4; i++) {
    users.push(await verifiedUser(request, complianceToken, `${tag}${i}_${stamp}@e2e.ma`));
  }
  const created = await request.post(`${API}/api/v1/circles`, {
    data: { name: `${tag} ${stamp}`, contributionAmount: 1000, seatCount: 4, cycleLengthDays: 7, shariaMode: false },
    ...auth(users[0].token)
  });
  expect(created.ok(), 'create circle').toBeTruthy();
  const circleId = (await created.json()).id as string;

  for (let i = 1; i < 4; i++) {
    const j = await request.post(`${API}/api/v1/circles/${circleId}/join`, {
      data: { slotPreference: 'FLEXIBLE' }, ...auth(users[i].token)
    });
    expect(j.ok(), `join ${i}`).toBeTruthy();
  }
  const act = await request.post(`${API}/api/v1/circles/${circleId}/activate`, auth(users[0].token));
  expect(act.ok(), 'activate').toBeTruthy();
  return { circleId, users };
}

test('contribute → payout: a full circle runs to COMPLETED and pays out', async ({ request, page }) => {
  const compliance = await apiLogin(request, 'compliance@daret.demo');
  const admin = await apiLogin(request, 'admin@daret.demo');

  const { circleId, users } = await fullActiveCircle(request, compliance, 'mfpay');

  const run = await request.post(`${API}/api/v1/admin/ops/run-cycle?asOf=2030-01-01`, auth(admin));
  expect(run.ok()).toBeTruthy();

  const detail = await (await request.get(`${API}/api/v1/circles/${circleId}`, auth(users[0].token))).json();
  expect(detail.circle.status).toBe('COMPLETED');
  const payouts = await (await request.get(`${API}/api/v1/me/payouts`, auth(users[0].token))).json();
  expect(payouts.some((p: { status: string }) => p.status === 'PAID')).toBeTruthy();

  // The member sees a PAID payout on their dashboard.
  await uiLogin(page, users[0].email, DEMO_PASSWORD);
  await page.goto('/fr/dashboard');
  await expect(page.getByText('Mes versements')).toBeVisible();
  await expect(page.getByText('PAID').first()).toBeVisible();
});

test('missed → default: an unpaid active circle defaults its members', async ({ request }) => {
  const compliance = await apiLogin(request, 'compliance@daret.demo');
  const admin = await apiLogin(request, 'admin@daret.demo');

  const { circleId, users } = await fullActiveCircle(request, compliance, 'mfdef');

  const sweep = await request.post(`${API}/api/v1/admin/ops/run-default-sweep?asOf=2030-01-01`, auth(admin));
  expect(sweep.ok()).toBeTruthy();
  expect((await sweep.json()).membersDefaulted).toBeGreaterThan(0);

  const detail = await (await request.get(`${API}/api/v1/circles/${circleId}`, auth(users[0].token))).json();
  expect(detail.members.every((m: { standing: string }) => m.standing === 'DEFAULTED')).toBeTruthy();
});
