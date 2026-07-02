/**
 * Frontend error reporting. MVP logs to the console; this is the single
 * integration point to forward to Sentry (set NEXT_PUBLIC_SENTRY_DSN and call
 * `@sentry/nextjs`'s `captureException` here) without touching call sites.
 */
export function reportError(error: unknown, context?: string) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  // eslint-disable-next-line no-console
  console.error('[daret]', context ?? 'error', error);
  if (dsn) {
    // TODO(prod): Sentry.captureException(error, { tags: { context } });
  }
}
