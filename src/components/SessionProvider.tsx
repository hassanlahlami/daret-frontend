'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api-client';
import { tokens } from '@/lib/tokens';
import { decodeJwt } from '@/lib/jwt';

type Session = { userId: string; roles: string[] } | null;

type SessionContextValue = {
  session: Session;
  ready: boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<Session>;
  register: (email: string, password: string) => Promise<Session>;
  logout: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function sessionFromToken(): Session {
  const claims = decodeJwt(tokens.access);
  if (!claims || claims.exp * 1000 < Date.now()) return null;
  return { userId: claims.sub, roles: claims.roles };
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(sessionFromToken());
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const t = await api.login(email, password);
    tokens.set(t.accessToken, t.refreshToken);
    const s = sessionFromToken();
    setSession(s);
    return s;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const t = await api.register(email, password);
    tokens.set(t.accessToken, t.refreshToken);
    const s = sessionFromToken();
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(() => {
    tokens.clear();
    setSession(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      ready,
      hasRole: (role) => session?.roles.includes(role) ?? false,
      login,
      register,
      logout
    }),
    [session, ready, login, register, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
