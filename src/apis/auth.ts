import { api } from "./axios";
import type { AxiosError } from "axios";

export interface UserProfile {
  id: number;
  username: string;
  email: string | null;
  github_id: number | null;
  github_username: string | null;
  avatar_url: string | null;
}

/** AxiosError 타입 가드 */
const isAxiosError = (e: unknown): e is AxiosError =>
  typeof e === "object" && e !== null && "isAxiosError" in e;

/** refresh 재시도 후 최종 401 판별 */
const isFinal401 = (error: unknown): boolean => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  const retried = error.config?._retry === true;
  return status === 401 && retried;
};

/** 에러 메시지 매핑 */
function throwMapped(error: unknown, map: Record<number, string> = {}): never {
  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 401) {
      if (isFinal401(error)) {
        throw new Error(map[401] ?? "로그인이 필요합니다. (401)");
      }
      throw error;
    }

    if (status && map[status]) {
      throw new Error(map[status]);
    }
  }
  throw error;
}

// 1) GitHub OAuth 콜백에서 사용하는 로그인
export async function githubLogin(code: string): Promise<void> {
  try {
    await api.post("/dj-rest-auth/github/", { code });
    // 성공하면 서버가 쿠키에 토큰 심어줌
  } catch (e) {
    throwMapped(e, {
      400: "GitHub 로그인 요청이 올바르지 않습니다.",
      500: "서버 오류로 GitHub 로그인을 처리하지 못했습니다.",
    });
  }
}

// 2) 현재 로그인된 유저 정보 가져오기
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await api.get<UserProfile>("/dj-rest-auth/user/", {
      skipAuthRefresh: true,
    });
    return res.data;
  } catch (e) {
    if (isFinal401(e)) {
      return null;
    }
    throwMapped(e);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/dj-rest-auth/logout/");
  } catch (e) {
    throwMapped(e, {
      400: "이미 로그아웃되었거나 잘못된 요청입니다.",
    });
  }
}
