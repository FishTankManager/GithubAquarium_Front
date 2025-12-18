import { api } from "./axios";
import type { AxiosError } from "axios";

export interface FishtankBackground {
  id: number;
  name: string;
  code: string;
  svg_template?: string;
  // background_image는 프론트엔드에서 로컬 assets를 사용하므로 제외
}

export interface Repository {
  id: number;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  commit_count: number;
  created_at: string;
  updated_at: string;
  last_synced_at: string;
  owner: number | null;
}

export interface ContributionFishSpecies {
  id: number;
  name: string;
  maturity: number;
  required_commits: number;
  svg_template: string;
  group_code: string;
}

export interface ContributionFish {
  id: number;
  is_visible_in_fishtank: boolean;
  species: ContributionFishSpecies;
}

export interface SelectableFish {
  id: number | null; // 할당되지 않은 물고기는 null
  username: string | null; // 할당되지 않은 물고기는 null
  species: string;
  commit_count: number;
  selected: boolean;
  maturity?: number; // 0: Hatchling, 1: Juvenile, 2: Youngling, 3: Adult, 4: Advanced, 5: Master
  required_commits?: number;
  group_code?: string; // 물고기 그룹 코드 (예: "C-KRAKEN")
  is_assigned?: boolean; // 실제로 할당된 물고기인지 여부
  svg_template?: string; // SVG 템플릿 코드
}

export interface Contributor {
  id: number;
  user: string;
  commit_count: number;
  fish: ContributionFish | null;
}

export interface FishtankDetail {
  id: number;
  repository: string;
  svg_path: string | null;
  contributors: Contributor[];
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
 * 내가 커밋한 모든 레포지토리 리스트를 반환합니다.
 * Contributor 테이블에서 commit_count > 0인 레포지토리를 조회합니다.
 * @returns 사용자가 커밋한 레포지토리 목록
 */
export async function getRepositories(): Promise<Repository[]> {
  try {
    const res = await api.get<Repository[]>("/repositories/");
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 레포지토리 목록을 불러오지 못했습니다.",
    });
  }
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

/**
 * repo ID를 기반으로 FishTank 내부 정보(기여자, 물고기)를 조회합니다.
 * @param repoId repo ID
 * @returns FishTank 상세 정보
 */
export async function getFishtankDetail(repoId: string): Promise<FishtankDetail> {
  try {
    const res = await api.get<FishtankDetail>(`/aquatics/fishtank/${repoId}/`);
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      404: "피쉬탱크를 찾을 수 없습니다.",
      500: "서버 오류로 피쉬탱크 정보를 불러오지 못했습니다.",
    });
  }
}

/**
 * 사용자가 소유한 OwnBackground 중 하나를 fishtank 배경으로 적용합니다.
 * @param repoId 레포지토리 ID
 * @param backgroundId 유저가 소유한 OwnBackground.background.id
 */
export async function applyFishtankBackground(repoId: string, backgroundId: number): Promise<void> {
  try {
    await api.post(`/aquatics/fishtank/${repoId}/apply-background/`, {
      background_id: backgroundId,
    });
  } catch (e) {
    throwMapped(e, {
      400: "잘못된 요청입니다. 배경 ID를 확인해주세요.",
      401: "로그인이 필요합니다.",
      404: "피쉬탱크 또는 배경을 찾을 수 없습니다.",
      500: "서버 오류로 배경을 적용하지 못했습니다.",
    });
  }
}

/**
 * 특정 Repository의 Fishtank에서 선택 가능한 물고기 목록을 조회합니다.
 * @param repoId 레포지토리 ID
 * @returns 선택 가능한 물고기 목록
 */
export async function getSelectableFish(repoId: string): Promise<SelectableFish[]> {
  try {
    const res = await api.get<{ fishes: SelectableFish[] }>(
      `/aquatics/fishtank/${repoId}/selectable-fish/`,
    );
    return res.data.fishes;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      404: "피쉬탱크를 찾을 수 없습니다.",
      500: "서버 오류로 물고기 목록을 불러오지 못했습니다.",
    });
  }
}

export interface FishtankSpriteData {
  background_url: string;
  background_id: number | null;
  fishes: Array<{
    id: number;
    label: string;
    svg_source: string;
  }>;
}

/**
 * 특정 Repository의 Fishtank 스프라이트 데이터를 조회합니다.
 * @param repoId 레포지토리 ID
 * @returns 배경 URL과 물고기 스프라이트 데이터
 */
export async function getFishtankSprites(repoId: string): Promise<FishtankSpriteData> {
  try {
    const res = await api.get<FishtankSpriteData>(`/aquatics/fishtank/${repoId}/sprites/`);
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      404: "피쉬탱크를 찾을 수 없습니다.",
      500: "서버 오류로 스프라이트 데이터를 불러오지 못했습니다.",
    });
  }
}
