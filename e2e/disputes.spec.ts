import { test, expect } from '@playwright/test';
import { API, apiLogin, apiRegister, auth } from './helpers';

test('a member raises a dispute; compliance sees and resolves it', async ({ request }) => {
  const comp = await apiLogin(request, 'compliance@daret.demo');
  const member = await apiRegister(request, `disp_${Date.now()}@e2e.ma`);
  const subject = `Late payout ${Date.now()}`;

  const raised = await request.post(`${API}/api/v1/me/disputes`, {
    data: { circleId: null, subject, description: 'My payout is late.' }, ...auth(member)
  });
  expect(raised.ok()).toBeTruthy();
  const disputeId = (await raised.json()).id as string;

  // Compliance sees the open dispute.
  let open = await (await request.get(`${API}/api/v1/admin/compliance/disputes`, auth(comp))).json();
  expect(open.some((d: { subject: string }) => d.subject === subject)).toBeTruthy();

  // Resolve it.
  const resolved = await request.post(`${API}/api/v1/admin/compliance/disputes/${disputeId}/resolve`, {
    data: { resolution: 'Handled' }, ...auth(comp)
  });
  expect((await resolved.json()).status).toBe('RESOLVED');

  // No longer in the open list.
  open = await (await request.get(`${API}/api/v1/admin/compliance/disputes`, auth(comp))).json();
  expect(open.some((d: { id: string }) => d.id === disputeId)).toBeFalsy();
});
