// Minimal client-side JWT decode (no verification — the server verifies).

export type JwtClaims = {
  sub: string;
  roles: string[];
  exp: number;
};

export function decodeJwt(token: string | null): JwtClaims | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(payload);
    const claims = JSON.parse(json);
    return {
      sub: claims.sub,
      roles: Array.isArray(claims.roles) ? claims.roles : [],
      exp: claims.exp
    };
  } catch {
    return null;
  }
}
