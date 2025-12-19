import { api } from "./axios";
import type { AxiosError } from "axios";

/** ShopItem 타입 (이미 정의돼 있다면 이 부분은 생략) */
export type ShopItem = {
  id: number;
  code: string;
  name: string;
  description: string;
  item_type: "REROLL" | "BG_UNLOCK";
  price: number;
  image: string | null;
  target_background: number | null;
  target_background_name: string | null;
  is_owned: string; // "Y" | "N" 등
};

// 👉 실제 응답 구조에 맞게 수정
export type ShopMyInfo = {
  currency: {
    balance: number;
    total_earned: number;
  };
  // 아직 구조를 안 쓰고 있으니 unknown[] 로 둬도 무방
  inventory: unknown[];
};

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

/** GET /shop/items/ */
export async function getShopItems(): Promise<ShopItem[]> {
  try {
    const res = await api.get<ShopItem[]>("/shop/items/");
    console.log(res.data);
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 상점 아이템 목록을 불러오지 못했습니다.",
    });
  }
}

// --- GET /shop/my-info/ ---
export async function getShopMyInfo(): Promise<ShopMyInfo> {
  try {
    const res = await api.get<ShopMyInfo>("/shop/my-info/");
    return res.data;
  } catch (e) {
    throwMapped(e, {
      401: "로그인이 필요합니다.",
      500: "서버 오류로 상점 정보를 불러오지 못했습니다.",
    });
  }
}

// --- POST /shop/purchase/ (아이템 구매) ---
export async function purchaseItem(itemId: number): Promise<void> {
  try {
    await api.post("/shop/purchase/", {
      item_id: itemId,
    });
  } catch (e) {
    throwMapped(e, {
      400: "잔액이 부족하거나 이미 보유한 아이템입니다.",
      401: "로그인이 필요합니다.",
      500: "아이템 구매 중 서버 오류가 발생했습니다.",
    });
  }
}

// --- POST /shop/use-reroll/ (리롤권 사용) ---
export async function rerollFish(fishId: number): Promise<void> {
  try {
    await api.post("/shop/use-reroll/", {
      fish_id: fishId, // ← API 명세에 맞게 수정
    });
  } catch (e) {
    throwMapped(e, {
      400: "리롤 요청이 잘못되었습니다.",
      401: "로그인이 필요합니다.",
      500: "리롤 처리 중 서버 오류가 발생했습니다.",
    });
  }
}
