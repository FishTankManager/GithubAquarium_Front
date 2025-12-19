import { api } from "./axios";
import type { AxiosError } from "axios";

// 1. 데이터 타입 정의 (Serializer 필드와 매칭)
export interface UserFish {
  id: number;
  species_name: string;
  group_code: string;
  maturity: number;
  repository_full_name: string;
  is_visible_in_fishtank: boolean;
  is_visible_in_aquarium: boolean;
  aquarium: number | null;
}

const isAxiosError = (e: unknown): e is AxiosError =>
  typeof e === "object" && e !== null && "isAxiosError" in e;

function throwMapped(error: unknown, map: Record<number, string> = {}): never {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && map[status]) throw new Error(map[status]);
  }
  throw error;
}

/*유저가 보유한 모든 물고기 목록을 가져옵니다. */
export async function getUserFishList(): Promise<UserFish[]> {
  try {
    const res = await api.get<UserFish[]>("/aquatics/my-fishes/");
    console.log("🐟 내 물고기 응답 데이터:", res.data); // 데이터 구조 확인
    return res.data;
  } catch (e) {
    console.error("🐟 내 물고기 불러오기 실패 상세:", e); // 에러 객체 전체 확인
    // e.response가 있다면 서버 응답(404, 401 등)을 확인할 수 있음
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 물고기 목록을 불러오지 못했습니다.",
    });
  }
}
