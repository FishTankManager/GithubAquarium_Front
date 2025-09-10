// src/apis/auth.ts
//추후 수정 가능
import { instance, instanceWithToken } from "./axios";
import type { AxiosError, AxiosResponse } from "axios";

/* payload 타입 */
export interface SignupPayload {
  username: string;
  phone: string;
  email: string;
  verf_num: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

/** 프로필 타입 미정 */
export type Profile = unknown;

/** AxiosError 타입 가드 */
const isAxiosError = (e: unknown): e is AxiosError =>
  typeof e === "object" && e !== null && "isAxiosError" in e;

/** refresh 재시도 후 최종 401 판별 */
const isFinal401 = (error: unknown): boolean => {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  const retried = (error.config as any)?._retry === true;
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
  throw error as any;
}

// 회원가입
export const signup = async (data: SignupPayload): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await instance.post(
      "/account/signup/",
      {
        username: data.username,
        phone: data.phone,
        email: data.email,
        verf_num: data.verf_num,
        password: data.password,
        password_confirm: data.password_confirm,
      }
    );

    if (response.status === 201) {
      return response.data;
    }
    throw new Error(`예상치 못한 응답 상태: ${response.status}`);
  } catch (error) {
    throwMapped(error, { 400: "입력값이 올바르지 않습니다. (400)" });
  }
};

// 로그인
export const login = async (data: LoginPayload): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await instance.post(
      "/account/login/",
      {
        username: data.username,
        password: data.password,
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`예상치 못한 응답 상태: ${response.status}`);
  } catch (error) {
    throwMapped(error, {
      400: "아이디 또는 비밀번호가 올바르지 않습니다. (400)",
      404: "사용자를 찾을 수 없습니다. (404)",
    });
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  const response: AxiosResponse = await instance.post("/account/logout/");
  if (response.status === 200) {
    window.location.href = "/";
    return;
  }
  console.log("로그아웃 에러:", response);
};

// 현재 로그인 사용자 정보 조회
export const getMe = async (): Promise<Profile> => {
  try {
    const response: AxiosResponse<Profile> = await instanceWithToken.get(
      "/account/profile/"
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`예상치 못한 응답 상태: ${response.status}`);
  } catch (error) {
    throwMapped(error, { 401: "로그인이 필요합니다. (401)" });
  }
};

// 사용자 정보 수정
export const putProfile = async (data: Partial<Profile>): Promise<Profile> => {
  try {
    const res: AxiosResponse<Profile> = await instanceWithToken.put(
      `/account/profile/`,
      data
    );

    if (res.status === 200) return res.data;
    throw new Error(`예상치 못한 응답 상태: ${res.status}`);
  } catch (error) {
    throwMapped(error, {
      400: "입력값이 잘못되었습니다. (400)",
      401: "로그인이 필요합니다. (401)",
      404: "유저 정보를 찾을 수 없습니다. (404)",
    });
  }
};
