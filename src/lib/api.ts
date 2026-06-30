// Browser-facing API base URL. Configured via NEXT_PUBLIC_API_BASE_URL.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export type HealthResponse = {
  status: string;
  service: string;
  time: string;
};

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json();
}

// ---- Fee preview (spec FR-9) ----

export type CreditTier = 'A' | 'B' | 'C' | 'D' | 'E';

export type ObligationLine = {
  cycleIndex: number;
  dueDate: string;
  amount: number;
  payoutCycle: boolean;
};

export type FeePreview = {
  position: number;
  payoutCycleIndex: number;
  projectedPayoutDate: string;
  potAmount: number;
  contributionPerCycle: number;
  totalContributions: number;
  serviceFee: number;
  positionFee: number;
  payoutBonus: number;
  netAdjustmentVsRotation: number;
  shariaMode: boolean;
  schedule: ObligationLine[];
};

/**
 * Fetch the fee/payout preview for a slot position in a circle. Requires a MEMBER
 * access token. `tier` is optional (neutral pricing until scoring lands in Phase 5).
 */
export async function fetchFeePreview(
  circleId: string,
  position: number,
  token: string,
  tier?: CreditTier
): Promise<FeePreview> {
  const params = new URLSearchParams({ position: String(position) });
  if (tier) params.set('tier', tier);
  const res = await fetch(
    `${API_BASE_URL}/api/v1/circles/${circleId}/fee-preview?${params}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error(`Fee preview failed: ${res.status}`);
  }
  return res.json();
}
