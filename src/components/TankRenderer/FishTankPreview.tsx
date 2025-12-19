// components/TankRenderer/FishTank.tsx
import React from "react";
import TankRenderer from "./TankRenderer";
import FishSprite from "./FishSprite";
import type { Fish } from "@/types/fish";
import { getFishSpriteSvg } from "@/assets/svg/FishSprites/map";
import { getBackgroundImage } from "@/assets/png/Backgrounds";

type FishTankProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  repositoryName: string;
  backgroundName?: string; // "bg-1" 같은 값
  fishList: Fish[];
};

export default function FishTank({
  width = 400,
  height = 400,
  className = "",
  repositoryName,
  fishList,
  backgroundName,
}: FishTankProps) {
  const bgImage = backgroundName ? getBackgroundImage(backgroundName) : undefined;

  // 피시탱크에 노출되는 물고기만 사용
  const visibleFish = fishList.filter((fish) => fish.is_visible_in_fishtank);

  return (
    <TankRenderer width={width} height={height} className={className}>
      {/* 배경 이미지가 있을 때 */}
      {bgImage && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <img src={bgImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* 배경 이미지가 없을 때 → 기본 하늘색 배경 */}
      {!bgImage && <div className="pointer-events-none absolute inset-0 z-0 bg-sky-200" />}

      {/* 좌상단 Repository 이름 */}
      <div className="pointer-events-none absolute top-2 left-2 z-20 rounded px-1 py-1 text-xl font-medium">
        {repositoryName}
      </div>

      {/* 물고기 렌더링 */}
      {visibleFish.map((fish) => {
        const svgSource = getFishSpriteSvg(fish.name);

        return (
          <FishSprite
            key={fish.id}
            id={String(fish.id)}
            svgSource={svgSource}
            topLabel={fish.github_name}
            bottomLabel={`${fish.commit_count} commits`}
            personaWidthPercent={10}
          />
        );
      })}
    </TankRenderer>
  );
}
