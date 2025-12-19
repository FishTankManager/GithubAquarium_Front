import * as sprites from ".";

const SPRITES = sprites as Record<string, string>;

/**
 * 물고기 종 이름으로 SVG를 찾습니다.
 * @param species 물고기 종 이름 (예: "SpaceOcto_6", "ShrimpWich_2")
 */
export function getFishSpriteSvg(species: string): string {
  const svg = SPRITES[species];
  if (!svg) {
    console.warn(`[FishTank] Unknown fish species: ${species}`);
    return SPRITES["LaptopSunfish"] ?? "";
  }
  return svg;
}

/**
 * group_code와 maturity를 조합해서 SVG를 찾습니다.
 * @param groupCode 그룹 코드 (예: "SpaceOcto", "ShrimpWich")
 * @param maturity 성장 단계 (1~6)
 */
export function getFishSpriteSvgByGroupAndMaturity(groupCode: string, maturity: number): string {
  const fileName = `${groupCode}_${maturity}`;
  const svg = SPRITES[fileName];
  if (!svg) {
    console.warn(
      `[FishTank] Unknown fish: ${fileName} (group_code: ${groupCode}, maturity: ${maturity})`,
    );
    return SPRITES["LaptopSunfish"] ?? "";
  }
  return svg;
}
