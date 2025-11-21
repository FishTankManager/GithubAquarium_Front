// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface User {
  id: number;
  email: string | null;
  github_id: number | null;
  github_username: string | null;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/dj-rest-auth/user/`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();

      const cleanUser: User = {
        id: data.id,
        email: data.email,
        github_id: data.github_id,
        github_username: data.github_username,
        avatar_url: data.avatar_url,
      };

      setUser(cleanUser);
    } catch (e) {
      console.error("유저 정보 조회 실패:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/dj-rest-auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("로그아웃 요청 실패:", e);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용해야 합니다.");
  }
  return ctx;
}
