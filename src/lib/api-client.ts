import { API_BASE_URL, type FeePreview, type CreditTier } from '@/lib/api';
import { tokens } from '@/lib/tokens';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors: { field: string; message: string }[] = []
  ) {
    super(message);
  }
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  auth?: boolean; // default true
};

async function raw(path: string, opts: FetchOpts, token: string | null): Promise<Response> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_BASE_URL}${path}`, {
    method: opts.method ?? (opts.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store'
  });
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokens.refresh;
  if (!refreshToken) return false;
  const res = await raw('/api/v1/auth/refresh', { body: { refreshToken } }, null);
  if (!res.ok) {
    tokens.clear();
    return false;
  }
  const data = await res.json();
  tokens.set(data.accessToken, data.refreshToken);
  return true;
}

/** Authenticated fetch with a one-shot refresh on 401. Returns parsed JSON. */
export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const useAuth = opts.auth !== false;
  let res = await raw(path, opts, useAuth ? tokens.access : null);

  if (res.status === 401 && useAuth && (await tryRefresh())) {
    res = await raw(path, opts, tokens.access);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const code = data?.code ?? 'ERROR';
    throw new ApiError(res.status, code, data?.message ?? res.statusText, data?.fieldErrors ?? []);
  }
  return data as T;
}

// ---- Types ----

export type TokenResponse = { accessToken: string; refreshToken: string; tokenType: string };
export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type KycStatusResponse = { id: string; userId: string; status: KycStatus; updatedAt: string };
export type CircleStatus = 'DRAFT' | 'FORMING' | 'ACTIVE' | 'COMPLETED' | 'DISSOLVED';
export type SlotPreference = 'EARLY' | 'FLEXIBLE' | 'LATE';

export type CircleView = {
  id: string;
  name: string;
  contributionAmount: number;
  seatCount: number;
  filledSeats: number;
  cycleLengthDays: number;
  status: CircleStatus;
  shariaMode: boolean;
  inviteOnly: boolean;
  ownerId: string;
  createdAt: string;
};
export type MemberView = {
  userId: string;
  slotPreference: SlotPreference;
  slotPosition: number | null;
  standing: 'GOOD' | 'LATE' | 'DEFAULTED';
};
export type CircleDetail = { circle: CircleView; members: MemberView[] };
export type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

export type ContributionView = {
  id: string; circleId: string; cycleIndex: number; amount: number; dueDate: string;
  status: 'SCHEDULED' | 'PAID' | 'MISSED';
};
export type PayoutView = {
  id: string; circleId: string; cycleIndex: number; amount: number; status: 'SCHEDULED' | 'PAID' | 'FAILED';
};
export type ScoreResponse = {
  userId: string; score: number; tier: CreditTier; factors: Record<string, number>; computedAt: string;
};
export type AuditEventView = {
  seq: number; actor: string; action: string; target: string | null;
  payload: string; prevHash: string; hash: string; at: string;
};
export type IntegrityReport = { valid: boolean; eventsChecked: number; brokenAtSeq: number | null };

export type AdminOverview = {
  circlesByStatus: Record<string, number>;
  totalUsers: number;
  platformRevenue: number;
  platformExposure: number;
  gapFilledSlots: number;
};
export type AdminCircle = {
  id: string; name: string; status: CircleStatus; seatCount: number; filledSeats: number;
  contributionAmount: number; shariaMode: boolean; ownerId: string; createdAt: string;
};
export type AdminUser = {
  id: string; email: string | null; phone: string | null; roles: string[];
  enabled: boolean; kycStatus: KycStatus | null;
};
export type FeeSchedule = {
  id: string; name: string; serviceFee: number; baseFee: number;
  redistributionShare: number; tierMultipliers: Record<string, number>;
};
export type PipelineResult = { collectionsIssued: number; payoutsIssued: number; eventsRelayed: number };
export type SweepResult = { missedMarked: number; membersLate: number; membersDefaulted: number };

// ---- Endpoints ----

export const api = {
  login: (email: string, password: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/login', { body: { email, password }, auth: false }),
  register: (email: string, password: string) =>
    apiFetch<TokenResponse>('/api/v1/auth/register', { body: { email, password }, auth: false }),

  getKyc: () => apiFetch<KycStatusResponse>('/api/v1/kyc'),
  submitKyc: (partnerRef: string, consent: boolean) =>
    apiFetch<KycStatusResponse>('/api/v1/kyc', { body: { partnerRef, consent } }),

  discoverCircles: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch<Page<CircleView>>(`/api/v1/circles${qs ? `?${qs}` : ''}`);
  },
  getCircle: (id: string) => apiFetch<CircleDetail>(`/api/v1/circles/${id}`),
  createCircle: (body: {
    name: string; contributionAmount: number; seatCount: number;
    cycleLengthDays: number; shariaMode: boolean; ownerSlotPreference?: SlotPreference;
    inviteOnly?: boolean;
  }) => apiFetch<CircleView>('/api/v1/circles', { body }),
  joinCircle: (id: string, slotPreference: SlotPreference, inviteCode?: string) =>
    apiFetch<CircleView>(`/api/v1/circles/${id}/join`, { body: { slotPreference, inviteCode } }),
  createInvite: (id: string) => apiFetch<{ code: string }>(`/api/v1/circles/${id}/invites`, { method: 'POST' }),
  vouchFor: (userId: string) => apiFetch<{ ok: boolean }>(`/api/v1/me/vouch/${userId}`, { method: 'POST' }),
  myVouches: () => apiFetch<{ received: number }>('/api/v1/me/vouches'),
  activateCircle: (id: string) => apiFetch<unknown>(`/api/v1/circles/${id}/activate`, { method: 'POST' }),
  feePreview: (id: string, position: number, tier?: CreditTier) => {
    const qs = new URLSearchParams({ position: String(position) });
    if (tier) qs.set('tier', tier);
    return apiFetch<FeePreview>(`/api/v1/circles/${id}/fee-preview?${qs}`);
  },
  circleSchedule: (id: string) =>
    apiFetch<{ circleId: string; contributions: ContributionView[]; payouts: PayoutView[] }>(
      `/api/v1/circles/${id}/schedule`
    ),

  myObligations: () => apiFetch<ContributionView[]>('/api/v1/me/obligations'),
  payObligation: (id: string) => apiFetch<{ ok: boolean }>(`/api/v1/me/obligations/${id}/pay`, { method: 'POST' }),
  myPayouts: () => apiFetch<PayoutView[]>('/api/v1/me/payouts'),
  myScore: () => apiFetch<ScoreResponse>('/api/v1/me/score'),

  notifications: () =>
    apiFetch<{ id: string; type: string; message: string; read: boolean; at: string }[]>('/api/v1/me/notifications'),
  unreadCount: () => apiFetch<{ unread: number }>('/api/v1/me/notifications/unread-count'),
  markNotificationsRead: () => apiFetch<{ marked: number }>('/api/v1/me/notifications/read', { method: 'POST' }),

  auditChain: (limit = 100) => apiFetch<AuditEventView[]>(`/api/v1/admin/audit?limit=${limit}`),
  auditVerify: () => apiFetch<IntegrityReport>('/api/v1/admin/audit/verify'),
  kycQueue: () => apiFetch<{ userId: string; status: KycStatus }[]>('/api/v1/admin/compliance/kyc'),
  decideKyc: (userId: string, decision: KycStatus) =>
    apiFetch<{ userId: string; status: KycStatus }>(`/api/v1/admin/compliance/kyc/${userId}/decision`, {
      body: { decision }
    }),
  amlFlags: () =>
    apiFetch<{ id: string; userId: string; circleId: string | null; type: string; severity: string; reason: string }[]>(
      '/api/v1/admin/compliance/aml-flags'
    ),

  // ---- Admin console ----
  adminOverview: () => apiFetch<AdminOverview>('/api/v1/admin/overview'),
  adminCircles: (status?: CircleStatus) => {
    const qs = status ? `?status=${status}` : '';
    return apiFetch<Page<AdminCircle>>(`/api/v1/admin/circles${qs}`);
  },
  adminUsers: () => apiFetch<Page<AdminUser>>('/api/v1/admin/users'),
  setUserEnabled: (id: string, enabled: boolean) =>
    apiFetch<AdminUser>(`/api/v1/admin/users/${id}/enabled`, { body: { enabled } }),
  cancelCircle: (id: string) => apiFetch<CircleView>(`/api/v1/circles/${id}/cancel`, { method: 'POST' }),

  listFeeSchedules: () => apiFetch<FeeSchedule[]>('/api/v1/admin/fee-schedules'),
  createFeeSchedule: (body: {
    name: string; serviceFee: number; baseFee: number; redistributionShare: number;
    tierMultipliers: Record<string, number>;
  }) => apiFetch<FeeSchedule>('/api/v1/admin/fee-schedules', { body }),

  runCycle: (asOf?: string) =>
    apiFetch<PipelineResult>(`/api/v1/admin/ops/run-cycle${asOf ? `?asOf=${asOf}` : ''}`, { method: 'POST' }),
  runDefaultSweep: (asOf?: string) =>
    apiFetch<SweepResult>(`/api/v1/admin/ops/run-default-sweep${asOf ? `?asOf=${asOf}` : ''}`, { method: 'POST' })
};
