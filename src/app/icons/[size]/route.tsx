import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Dynamically generated brand icon (no binary assets). Serves /icons/192,
// /icons/512, /icons/180 (apple-touch), etc. Full-bleed teal = maskable-safe.
export function GET(_req: Request, { params }: { params: { size: string } }) {
  const size = Math.min(Math.max(parseInt(params.size, 10) || 512, 48), 512);
  const ring = Math.max(Math.round(size * 0.09), 6);
  const disc = Math.round(size * 0.5);
  const dot = Math.round(size * 0.16);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f766e 0%, #14a06f 100%)'
        }}
      >
        <div
          style={{
            width: disc,
            height: disc,
            borderRadius: '9999px',
            border: `${ring}px solid #ffffff`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ width: dot, height: dot, borderRadius: '9999px', background: '#f9a825' }} />
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
