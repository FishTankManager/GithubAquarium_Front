// components/TankRenderer/AquariumPreview.tsx
import React from "react";
import TankRenderer from "./TankRenderer";
import FishSprite from "./FishSprite";
import { getFishSpriteSvg, getFishSpriteSvgByGroupAndMaturity } from "@/assets/svg/FishSprites/map";
import { getBackgroundImage } from "@/assets/png/Backgrounds";
import { useAuth } from "@/auth/AuthContext";
import type { Fish } from "@/types/fish";

type AquariumPreviewProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  backgroundName?: string; // "bg-1" 같은 값
  fishList: Fish[]; // GET /aquatics/aquarium/ 의 fish_list 모양
};

function getRepoOnlyName(fullName?: string | null): string {
  if (!fullName) return "";
  // "owner/repo" -> "repo", "/" 없는 경우는 원본 유지
  return fullName.split("/").pop() ?? fullName;
}

export default function AquariumPreview({
  width = 400,
  height = 400,
  className = "",
  backgroundName,
  fishList,
}: AquariumPreviewProps) {
  const { user } = useAuth();

  // 탱크 상단에 표시할 유저 이름
  const ownerLabel = user?.username ?? "My Aquarium";

  // 아쿠아리움에 보이도록 설정된 물고기만 사용
  const visibleFish = fishList.filter((fish) => fish.is_visible_in_aquarium);

  const bgImage = getBackgroundImage(backgroundName);

  return (
    <TankRenderer
      width={width}
      height={height}
      className={`relative overflow-hidden rounded-2xl bg-transparent shadow-lg ${className}`}
    >
      {/* 배경 이미지가 있을 때 */}
      {bgImage && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <img src={bgImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* 배경 이미지가 없을 때 → 기본 하늘색 배경 */}
      {!bgImage && <div className="pointer-events-none absolute inset-0 z-0 bg-sky-200" />}

      {/* 좌상단: 유저 github username */}
      <div className="pointer-events-none absolute left-2 z-20 rounded px-1 py-1 text-xl font-medium">
        {ownerLabel}
      </div>

      {/* 물고기 렌더링 */}
      {visibleFish.map((fish) => {
        // group_code와 maturity를 조합해서 SVG 찾기 (우선순위 1)
        // 만약 name이 정확히 "GroupCode_Maturity" 형식이면 그것도 시도
        let svgSource: string;
        if (fish.group_code && fish.maturity) {
          svgSource = getFishSpriteSvgByGroupAndMaturity(fish.group_code, fish.maturity);
        } else {
          // fallback: name으로 찾기
          svgSource = getFishSpriteSvg(fish.name);
        }

        const repoLabel = getRepoOnlyName(fish.repository_name);

        return (
          <FishSprite
            key={fish.id}
            id={String(fish.id)}
            svgSource={svgSource}
            topLabel={repoLabel}
            bottomLabel={`${fish.commit_count} commits`}
            personaWidthPercent={10}
          />
        );
      })}
    </TankRenderer>
  );
}
