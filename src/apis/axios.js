// src/apis/axios.js
import axios from "axios";
import { getCookie, deleteCookie } from "../utils/cookie";

const baseURL = "http://localhost:8000/api/";

const commonOpts = {
  baseURL,
  withCredentials: true,
};

export const instance = axios.create(commonOpts);
export const instanceWithToken = axios.create(commonOpts);
const refreshClient = axios.create(commonOpts);
// 요청 인터셉터: Authorization 쿠키 붙이기
instanceWithToken.interceptors.request.use(
  (config) => {
    const access = getCookie("access_token");
    if (access) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 동시성 제어용
let isRefreshing = false;
let queue = [];
const flushQueue = (token) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

// refresh 호출 (서버가 Set-Cookie로 새 토큰 내려줌)
async function refreshAccessToken() {
  try {
    await refreshClient.post("/account/refresh/", {
      refresh: getCookie("refresh_token"),
    });
    // 서버가 알아서 쿠키에 access_token 넣어줌
    return getCookie("access_token");
  } catch (e) {
    return null;
  }
}

// 응답 인터셉터: 401 처리
instanceWithToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    const originalRequest = config;
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
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(error);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(instanceWithToken(originalRequest));
          });
        });
      }

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
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
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
