import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Daret — épargne tournante digitale et de confiance';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Default social-share (Open Graph / Twitter) image for the whole app.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 9999,
              border: '10px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 9999, background: '#f9a825' }} />
          </div>
          <div style={{ fontSize: 68, fontWeight: 800 }}>Daret</div>
        </div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 36, maxWidth: 920 }}>
          L&apos;épargne tournante marocaine, digitale et de confiance.
        </div>
        <div style={{ fontSize: 28, marginTop: 20, color: '#d3f5e5', maxWidth: 860 }}>
          Cercles · mise en relation · scoring — les fonds transitent par un partenaire de paiement agréé.
        </div>
      </div>
    ),
    { ...size }
  );
}
