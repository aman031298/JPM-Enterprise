import { create } from "zustand";
import type { AuthSession } from "@shared/domain";

const storageKey = "jpm-auth-session";
const tokenKey = "jpm-auth-token";

function getStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(storageKey);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
}

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: getStoredSession(),
  setSession: (session) => {
    if (typeof window !== "undefined") {
      if (session) {
        localStorage.setItem(storageKey, JSON.stringify(session));
        localStorage.setItem(tokenKey, session.token);
      } else {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(tokenKey);
      }
    }

    set({ session });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(tokenKey);
    }

    set({ session: null });
  }
}));
