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
