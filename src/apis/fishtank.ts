import { api } from "./axios";
import type { AxiosError } from "axios";

export interface FishtankBackground {
  id: number;
  name: string;
  code: string;
  svg_template: string;
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

/**
 * 유저가 보유한 배경(OwnBackground)의 원본 Background 데이터를 반환합니다.
 * @returns 사용자가 보유한 피쉬탱크 배경 목록
 */
export async function getFishtankBackgrounds(): Promise<FishtankBackground[]> {
  try {
    const res = await api.get<FishtankBackground[]>("/aquatics/fishtank/backgrounds/");
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 배경 목록을 불러오지 못했습니다.",
    });
  }
}
