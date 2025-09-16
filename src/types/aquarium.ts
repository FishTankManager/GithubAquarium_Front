export type Maturity = "Hatchling" | "Juvenile" | "Youngling" | "Adult" | "Advanced" | "Master";

export interface CanvasSize {
  width: number;
  height: number;
}

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
