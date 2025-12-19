// components/TankRenderer/FishTank.tsx
import React from "react";
import TankRenderer from "./TankRenderer";
import FishSprite from "./FishSprite";
import type { Fish } from "@/types/fish";
import { getFishSpriteSvg, getFishSpriteSvgByGroupAndMaturity } from "@/assets/svg/FishSprites/map";
import * as SPRITES from "@/assets/svg/FishSprites";
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
      <div className="pointer-events-none absolute top-2 left-2 z-20 rounded px-3 text-4xl font-medium text-black">
        {repositoryName}
      </div>

      {/* 물고기 렌더링 */}
      {visibleFish.map((fish) => {
        // group_code와 maturity를 조합해서 SVG 찾기 (우선순위 1)
        let svgSource: string;
        const hasGroupCode = fish.group_code && fish.group_code.trim() !== "";
        const hasMaturity = fish.maturity && fish.maturity > 0;

        if (hasGroupCode && hasMaturity) {
          const expectedKey = `${fish.group_code}_${fish.maturity}`;
          svgSource = getFishSpriteSvgByGroupAndMaturity(fish.group_code, fish.maturity);

          // 디버깅: 매핑 확인
          const defaultSvg = SPRITES["LaptopSunfish"] ?? "";
          if (!svgSource || svgSource === defaultSvg) {
            console.warn(`[FishTankPreview] Failed to find SVG for fish:`, {
              id: fish.id,
              name: fish.name,
              group_code: fish.group_code,
              maturity: fish.maturity,
              expected: expectedKey,
              availableKeys: Object.keys(SPRITES).filter((k) => k.startsWith(fish.group_code)),
            });
          } else {
            console.log(`[FishTankPreview] Successfully found SVG for fish:`, {
              id: fish.id,
              name: fish.name,
              group_code: fish.group_code,
              maturity: fish.maturity,
              key: expectedKey,
            });
          }
        } else {
          // fallback: name으로 찾기
          console.warn(
            `[FishTankPreview] Missing group_code or maturity for fish, using name fallback:`,
            {
              id: fish.id,
              name: fish.name,
              group_code: fish.group_code,
              maturity: fish.maturity,
              hasGroupCode,
              hasMaturity,
            },
          );
          svgSource = getFishSpriteSvg(fish.name);
        }

        return (
          <FishSprite
            key={fish.id}
            id={String(fish.id)}
            svgSource={svgSource}
            topLabel={fish.github_username || "Unknown"}
            bottomLabel={`${fish.commit_count} commits`}
            personaWidthPercent={10}
          />
        );
      })}
    </TankRenderer>
  );
}
