'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { fetchFeePreview, type CreditTier } from '@/lib/api';

type Props = {
  circleId: string;
  seatCount: number;
  /** MEMBER access token (wire from the auth session once the login UI exists). */
  token: string;
  tier?: CreditTier;
};

/**
 * Slot fee/payout preview slider (spec §14, FR-9). Lets a member scrub through
 * slot positions and see exactly what each slot costs or earns — service fee,
 * position fee, payout bonus, projected payout date — before committing.
 *
 * Ready to mount on the circle-detail / join page once the authenticated frontend
 * flow (login + session token) is built.
 */
export function FeePreviewSlider({ circleId, seatCount, token, tier }: Props) {
  const t = useTranslations('FeePreview');
  const locale = useLocale();
  const [position, setPosition] = useState(1);

  const money = (n: number) =>
    new Intl.NumberFormat(locale === 'darija' ? 'fr' : locale, {
      style: 'currency',
      currency: 'MAD'
    }).format(n);

  const { data, isError } = useQuery({
    queryKey: ['feePreview', circleId, position, tier ?? 'neutral'],
    queryFn: () => fetchFeePreview(circleId, position, token, tier),
    placeholderData: keepPreviousData,
    enabled: Boolean(token)
  });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">
          {t('position', { position, seatCount })}
        </span>
        <input
          type="range"
          min={1}
          max={seatCount}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {isError && <p className="text-sm text-red-500">{t('error')}</p>}

      {data && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-slate-500">{t('payoutDate')}</dt>
          <dd className="text-end font-medium">{data.projectedPayoutDate}</dd>

          <dt className="text-slate-500">{t('pot')}</dt>
          <dd className="text-end font-medium">{money(data.potAmount)}</dd>

          <dt className="text-slate-500">{t('serviceFee')}</dt>
          <dd className="text-end">{money(data.serviceFee)}</dd>

          {!data.shariaMode && (
            <>
              <dt className="text-slate-500">{t('positionFee')}</dt>
              <dd className="text-end">{money(data.positionFee)}</dd>

              <dt className="text-slate-500">{t('payoutBonus')}</dt>
              <dd className="text-end">{money(data.payoutBonus)}</dd>
            </>
          )}

          <dt className="font-semibold">{t('net')}</dt>
          <dd
            className={`text-end font-semibold ${
              data.netAdjustmentVsRotation >= 0 ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {money(data.netAdjustmentVsRotation)}
          </dd>
        </dl>
      )}
    </div>
  );
}
