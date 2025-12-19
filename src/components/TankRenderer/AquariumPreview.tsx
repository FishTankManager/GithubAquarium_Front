// components/TankRenderer/AquariumPreview.tsx
import React from "react";
import TankRenderer from "./TankRenderer";
import FishSprite from "./FishSprite";
import { getFishSpriteSvg } from "@/assets/svg/FishSprites/map";
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
        const speciesKey = `${fish.group_code}_${fish.maturity}`;
        const svgSource = getFishSpriteSvg(speciesKey);

        return (
          <FishSprite
            key={fish.id}
            id={String(fish.id)}
            svgSource={svgSource}
            topLabel={fish.repository_name}
            bottomLabel={`${fish.commit_count} commits`}
            personaWidthPercent={10}
          />
        );
      })}
    </TankRenderer>
  );
}
