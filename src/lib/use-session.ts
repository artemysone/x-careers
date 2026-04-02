"use client";

import { useState, useEffect, useCallback } from "react";

interface SessionUser {
  id: string;
  name: string;
  username: string;
  profileImageUrl?: string;
}

interface SessionState {
  authenticated: boolean;
  user: SessionUser | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSession(): SessionState {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setAuthenticated(data.authenticated);
      setUser(data.user ?? null);
    } catch {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const signIn = useCallback(() => {
    window.location.href = "/api/auth/x";
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setAuthenticated(false);
    setUser(null);
  }, []);

  return { authenticated, user, loading, signIn, signOut, refresh };
}
