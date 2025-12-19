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

/**
 * 유저가 보유한 배경(OwnBackground)의 원본 Background 데이터를 반환합니다.
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
 * 사용자가 소유한 OwnBackground 중 하나를 aquarium 배경으로 적용합니다.
 * @param ownBackgroundId 유저가 소유한 OwnBackground.id
 */
export async function applyAquariumBackground(ownBackgroundId: number): Promise<void> {
  try {
    await api.post("/aquatics/aquarium/apply-background/", {
      own_background_id: ownBackgroundId,
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

/* =========================
 *  /aquatics/aquarium/ 타입
 * ========================= */

export interface AquariumFish {
  id: number;
  name: string; // 물고기 종 이름
  group_code: string; // 종 그룹 코드
  maturity: number; // 성장 단계 (1~6)
  repository_name: string; // 출처 레포지토리 이름
  commit_count: number; // 해당 레포에 기여한 커밋 수
  unlocked_at: string; // 해금 시각 (ISO 문자열)
  is_visible_in_aquarium: boolean;
  is_visible_in_fishtank: boolean;
}

export interface AquariumDetail {
  id: number;
  svg_url: string; // 생성된 아쿠아리움 SVG 파일 절대 경로
  background_name: string; // Background name (예: "bg-1" / 기본 배경)
  fish_list: AquariumFish[]; // 아쿠아리움에 배치된 물고기 목록
}

/* =========================
 *  /aquatics/aquarium/ API
 * ========================= */

/**
 * 로그인한 사용자의 아쿠아리움 상세 정보를 가져온다.
 *
 * GET /aquatics/aquarium/
 * 입력값 없음.
 */
export async function getAquariumDetail(): Promise<AquariumDetail> {
  try {
    const { data } = await api.get<AquariumDetail>("/aquatics/aquarium/");
    return data;
  } catch (error) {
    throwMapped(error, {
      404: "아쿠아리움 정보를 찾을 수 없습니다. (404)",
      403: "아쿠아리움 정보를 조회할 권한이 없습니다. (403)",
      500: "아쿠아리움 정보를 불러오는 중 오류가 발생했습니다. (500)",
    });
  }
}
