// src/types/fish.ts

/** 서버에서 내려주는 물고기 한 마리의 전체 정보 */
export interface Fish {
  id: number;
  name: string; // 물고기 종 이름
  github_username: string; //소유자
  group_code: string; // 물고기 종 그룹 코드
  maturity: number; // 성장 단계 (1~6)
  repository_name: string; // 출처 레포지토리 풀네임
  commit_count: number; // 해당 레포에 기여한 커밋 수
  unlocked_at: string; // 해금 시각 (ISO string)
  is_visible_in_aquarium: boolean;
  is_visible_in_fishtank: boolean;
}

/**
 * 물고기별 노출 설정 변경 요청에 사용하는 DTO
 * PATCH /.../visibility 같은 API에 사용
 */
export interface FishVisibilityItem {
  id: number; // ContributionFish.id
  visible: boolean; // true: 표시, false: 숨김
}
