declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const config: AxiosRequestConfig = {
  baseURL,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withXSRFToken: true,
};

export const api: AxiosInstance = axios.create(config);

let isRefreshing = false;
let queue: Array<(success: boolean) => void> = [];

const flushQueue = (success: boolean) => {
  queue.forEach((cb) => cb(success));
  queue = [];
};

async function refreshToken() {
  try {
    await axios.post(`${baseURL}/dj-rest-auth/token/refresh/`, {}, { withCredentials: true });
    return true;
  } catch {
    return false;
  }
}

api.interceptors.response.use(
  (res) => res,

  async (error: AxiosError) => {
    const original = error.config;

    if (!error.response) return Promise.reject(error);

    if (error.response.status === 401 && original && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((success) => {
            if (success) resolve(api(original));
            else reject(error);
          });
        });
      }

      isRefreshing = true;
      const success = await refreshToken();
      isRefreshing = false;
      flushQueue(success);

      if (!success) return Promise.reject(error);

      return api(original);
    }

    return Promise.reject(error);
  },
);
