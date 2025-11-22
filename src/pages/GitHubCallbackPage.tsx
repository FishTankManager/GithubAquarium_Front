import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function GitHubCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      setError("GitHub에서 authorization code를 받지 못했습니다.");
      return;
    }

    const handledKey = `github_oauth_handled_${code}`;
    if (sessionStorage.getItem(handledKey)) {
      navigate("/my", { replace: true });
      return;
    }
    sessionStorage.setItem(handledKey, "true");

    const savedState = localStorage.getItem("github_oauth_state");
    if (savedState && state !== savedState) {
      setError("OAuth state 값이 일치하지 않습니다.");
      return;
    }

    const run = async () => {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/dj-rest-auth/github/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!loginRes.ok) {
          const data = await loginRes.json().catch(() => ({}));
          console.error("GitHub 로그인 실패:", data);
          setError("GitHub 로그인에 실패했습니다.");
          return;
        }

        await refreshUser();
        navigate("/my", { replace: true });
      } catch (e) {
        console.error(e);
        setError("네트워크 오류가 발생했습니다.");
      }
    };

    void run();
  }, [location.search, navigate, refreshUser]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border bg-white px-6 py-4 text-sm text-red-600 shadow">
          <p className="mb-2 font-semibold">로그인 중 문제가 발생했습니다.</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-600">GitHub 로그인 처리 중입니다...</p>
    </div>
  );
}
