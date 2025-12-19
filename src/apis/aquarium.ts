import { api } from "./axios";
import type { AxiosError } from "axios";

export interface AquariumBackground {
  id: number;
  background: {
    id: number;
    name: string;
    code: string;
    background_image: string | null;
  };
  unlocked_at: string;
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

export interface MyBackground {
  background_id: number;
  name: string;
  image_url: string | null;
  unlocked_at: string;
}

/**
 * 유저가 보유한 배경 목록을 반환합니다.
 * @returns 사용자가 보유한 배경 목록
 */
export async function getMyBackgrounds(): Promise<MyBackground[]> {
  try {
    const res = await api.get<MyBackground[]>("/aquatics/my-backgrounds/");
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 배경 목록을 불러오지 못했습니다.",
    });
  }
}

/**
 * 유저가 보유한 배경(OwnBackground)의 원본 Background 데이터를 반환합니다.
 * @deprecated getMyBackgrounds()를 사용하세요
 * @returns 사용자가 보유한 아쿠아리움 배경 목록
 */
export async function getAquariumBackgrounds(): Promise<AquariumBackground[]> {
  try {
    const res = await api.get<AquariumBackground[]>("/aquatics/aquarium/backgrounds/");
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 배경 목록을 불러오지 못했습니다.",
    });
  }
}

/**
 * 사용자가 소유한 배경을 aquarium 배경으로 적용합니다.
 * @param backgroundId Background.id (사용자가 소유한 배경의 background_id)
 */
export async function applyAquariumBackground(backgroundId: number): Promise<void> {
  try {
    await api.post("/aquatics/aquarium/background/", {
      background_id: backgroundId,
    });
  } catch (e) {
    throwMapped(e, {
      400: "잘못된 요청입니다. 배경 ID를 확인해주세요.",
      401: "로그인이 필요합니다.",
      404: "아쿠아리움 또는 배경을 찾을 수 없습니다.",
      500: "서버 오류로 배경을 적용하지 못했습니다.",
    });
  }
}
