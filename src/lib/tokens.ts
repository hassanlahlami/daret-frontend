// JWT token storage (localStorage). SSR-safe: all access guards `window`.

const ACCESS_KEY = 'daret_access';
const REFRESH_KEY = 'daret_refresh';

export const tokens = {
  get access(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(ACCESS_KEY);
  },
  get refresh(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(REFRESH_KEY);
  },
  set(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCESS_KEY, accessToken);
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  }
};
