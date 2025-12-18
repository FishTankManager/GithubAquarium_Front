// components/TankRenderer/FishTank.tsx
import React from "react";
import TankRenderer from "./TankRenderer";
import FishSprite from "./FishSprite";
import type { Contributor } from "@/types/fish";
import { getFishSpriteSvg } from "@/assets/svg/FishSprites/map";
import { getBackgroundImage } from "@/assets/png/Backgrounds";

type FishTankProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  repositoryName: string;
  contributors: Contributor[];
  backgroundName?: string; // "bg-1" 이런 값이 들어온다고 가정
};

export default function FishTank({
  width = 400,
  height = 400,
  className = "",
  repositoryName,
  contributors,
  backgroundName,
}: FishTankProps) {
  const bgImage = getBackgroundImage(backgroundName);

  return (
    <TankRenderer width={width} height={height} className={className}>
      {/* 배경 이미지 (탱크 전체 뒤에 깔기) */}
      {bgImage && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img src={bgImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* 좌상단 Repository 이름 */}
      <div className="pointer-events-none absolute top-2 left-2 z-20 rounded bg-black/60 px-3 py-1 text-xs font-medium text-white">
        {repositoryName}
      </div>

      {/* 기여자당 물고기 1개 */}
      {contributors.map((contributor) => {
        const { id, user, commitCount, fish } = contributor;
        const svgSource = getFishSpriteSvg(fish.species);

        return (
          <FishSprite
            key={id}
            id={String(fish.id)}
            svgSource={svgSource}
            topLabel={user}
            bottomLabel={`${commitCount} commits`}
            personaWidthPercent={10}
          />
        );
      })}
    </TankRenderer>
  );
}
