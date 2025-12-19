import { api } from "./axios";
import type { AxiosError } from "axios";
import type { Fish } from "@/types/fish";

export interface RepositoryOwner {
  id: number;
  username: string;
  email?: string;
  github_id?: number | null;
  github_username?: string | null;
  avatar_url?: string;
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
  commit_count: number; // 레포지토리 전체 커밋 수
  default_branch: string;
  created_at: string;
  updated_at: string;
  owner: RepositoryOwner; // 소유자 정보 (객체)
  my_commit_count: number; // 현재 로그인한 사용자의 해당 레포지토리 커밋 수
}

export interface SelectableFish {
  id: number | null; // 할당되지 않은 물고기는 null
  username: string | null; // 할당되지 않은 물고기는 null
  species: string;
  commit_count: number;
  selected: boolean;
  maturity?: number; // 1: Hatchling, 2: Juvenile, 3: Youngling, 4: Adult, 5: Advanced, 6: Master
  required_commits?: number;
  group_code?: string; // 물고기 그룹 코드 (예: "C-KRAKEN")
  is_assigned?: boolean; // 실제로 할당된 물고기인지 여부
  svg_template?: string; // SVG 템플릿 코드
}

export interface FishtankDetail {
  id: number;
  repository_full_name: string;
  svg_url: string | null;
  background_name: string;
  fish_list: Fish[]; // types/fish.ts의 Fish 인터페이스 사용
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
 * 사용자가 소유한 배경을 fishtank 배경으로 적용합니다.
 * @param repoId 레포지토리 ID
 * @param backgroundId Background.id (사용자가 소유한 배경의 background_id)
 */
export async function applyFishtankBackground(repoId: string, backgroundId: number): Promise<void> {
  try {
    await api.post(`/aquatics/fishtank/${repoId}/background/`, {
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
