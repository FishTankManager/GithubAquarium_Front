// src/apis/axios.ts
//추후 수정 가능
import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookie, deleteCookie } from "../utils/cookie";

const baseURL = "http://localhost:8000/api/";

const commonOpts: AxiosRequestConfig = {
  baseURL,
  withCredentials: true,
};

//config 타입 확장
interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const instance: AxiosInstance = axios.create(commonOpts);
export const instanceWithToken: AxiosInstance = axios.create(commonOpts);
const refreshClient: AxiosInstance = axios.create(commonOpts);

// 요청 인터셉터: Authorization 쿠키 붙이기
instanceWithToken.interceptors.request.use(
  (config) => {
    const access = getCookie("access_token");
    if (access) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 동시성 제어용 큐
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

// refresh 호출 (서버가 Set-Cookie로 새 토큰 내려줌)
async function refreshAccessToken(): Promise<string | null> {
  try {
    await refreshClient.post("/account/refresh/", {
      refresh: getCookie("refresh_token"),
    });
    // 서버가 쿠키에 access_token을 다시 심어준다고 가정
    return getCookie("access_token") ?? null;
  } catch {
    return null;
  }
}

// 응답 인터셉터: 401 처리 및 토큰 갱신 로직
instanceWithToken.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    const response = error.response;
    const originalRequest = (error.config || {}) as RetryAxiosRequestConfig;

    if (!response) {
      // 네트워크 에러 등
      return Promise.reject(error);
    }

    const status = response.status;

    // refresh 자체가 실패하면 로그아웃 처리
    if (
      originalRequest?.url?.includes("/account/refresh/") &&
      (status === 401 || status === 403)
    ) {
      deleteCookie("access_token");
      deleteCookie("refresh_token");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // refresh 진행 중이면 큐에 넣고 대기
        return new Promise<AxiosResponse>((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers = originalRequest.headers ?? {};
            (originalRequest.headers as Record<string, string>)[
              "Authorization"
            ] = `Bearer ${newToken}`;
            instanceWithToken(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      // refresh 시도 시작
      isRefreshing = true;
      try {
        const newAccess = await refreshAccessToken();
        isRefreshing = false;
        flushQueue(newAccess);

        if (!newAccess) {
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          return Promise.reject(error);
        }

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${newAccess}`;
        return instanceWithToken(originalRequest);
      } catch (e) {
        isRefreshing = false;
        flushQueue(null);
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
