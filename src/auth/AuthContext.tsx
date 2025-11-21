import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logoutUser, type UserProfile } from "@/apis/auth";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch (e) {
      console.error("유저 정보 조회 실패:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  function clearClientState() {
    localStorage.removeItem("githubaquarium:lastVisitedTank");
    localStorage.removeItem("githubaquarium:uiState");
    sessionStorage.removeItem("githubaquarium:temp");
  }

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("로그아웃 요청 실패:", e);
    } finally {
      clearClientState();
      setUser(null);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
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
    throw new Error("useAuth는 AuthProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
}
