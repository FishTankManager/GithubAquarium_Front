import type { Fish } from "./fish";

export interface AquariumDetail {
  id: number;
  svg_url: string; // 생성된 아쿠아리움 SVG 파일 경로
  background_name: string; // 적용된 배경 이름 ("bg-1")
  fish_list: Fish[]; // 아쿠아리움에 배치된 물고기 목록
}

export type Maturity = "Hatchling" | "Juvenile" | "Youngling" | "Adult" | "Advanced" | "Master";

export type CanvasSize = {
  width: number | string; // px 숫자 or "100%" 같은 CSS 단위 문자열
  height: number | string; // px 숫자 or "auto"
};

export interface RepoInfo {
  id: string;
  fullName: string;
  contributions: number;
}

export interface FishState {
  id: string;
  maturity: Maturity;
}

export interface TimelineItem {
  id: string;
  at: string; // '25/09/14 00:00' 형식
  fish: FishState;
}

export interface BgItem {
  id: string;
  name: string;
  // thumbSrc: string; // 썸네일 - 분리해야되면 나중에 추가하기
  src: string; // 실제 적용 리소스
}
