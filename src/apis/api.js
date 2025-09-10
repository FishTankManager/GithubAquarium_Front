import { instance, instanceWithToken } from "./axios";

/** 인터셉터가 refresh 재시도까지 했는데도 401인 "최종 401"인지 판별 */
const isFinal401 = (error) =>
  error?.response?.status === 401 && error?.config?._retry === true;

/** 상태코드 → 메시지 매핑 후 던지기 (401은 최종일 때만) */
function throwMapped(error, map = {}) {
  const status = error?.response?.status;

  if (status === 401) {
    if (isFinal401(error)) {
      throw new Error(map[401] ?? "로그인이 필요합니다. (401)");
    }
    throw error;
  }

  if (status && map[status]) throw new Error(map[status]);
  throw error;
}

//회원가입
export const signup = async (data) => {
  try {
    const response = await instance.post("/account/signup/", {
      username: data.username,
      phone: data.phone,
      email: data.email,
      verf_num: data.verf_num,
      password: data.password,
      password_confirm: data.password_confirm,
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throwMapped(error, { 400: "입력값이 올바르지 않습니다. (400)" });
  }
};

// 로그인
export const login = async (data) => {
  try {
    const response = await instance.post("/account/login/", {
      username: data.username,
      password: data.password,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throwMapped(error, {
      400: "아이디 또는 비밀번호가 올바르지 않습니다. (400)",
      404: "사용자를 찾을 수 없습니다. (404)",
    });
  }
};

// 로그아웃
export const logout = async () => {
  const response = await instance.post("/account/logout/");
  if (response.status === 200) {
    window.location.href = "/";
  } else {
    console.log("로그아웃 에러:", response);
  }
};

// 현재 로그인 사용자 정보 조회
export const getMe = async () => {
  const response = await instanceWithToken.get("/account/profile/");
  if (response.status === 200) {
    return response.data;
  } else {
    throwMapped(error, { 401: "로그인이 필요합니다. (401)" });
  }
};

//사용자 정보 수정
export const putProfile = async (data) => {
  try {
    const res = await instanceWithToken.put(`/account/profile/`, data);

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
