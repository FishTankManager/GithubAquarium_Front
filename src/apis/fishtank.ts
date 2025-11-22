import { api } from "./axios";
import type { AxiosError } from "axios";

export interface FishtankBackground {
  id: number;
  name: string;
  code: string;
  svg_template: string;
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

export interface ContributionFish {
  id: number;
  is_visible: boolean;
  species: string;
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
