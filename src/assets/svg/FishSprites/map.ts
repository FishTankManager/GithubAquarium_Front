import * as sprites from ".";

const SPRITES = sprites as Record<string, string>;

export function getFishSpriteSvg(species: string): string {
  // === 1) LaptopSunfish 특수 처리 ===========================
  // species가 "LaptopSunfish_4", "LaptopSunfish_999"처럼 들어오면
  // 무조건 "LaptopSunfish" 키로만 찾는다
  if (species.startsWith("LaptopSunfish")) {
    if (SPRITES["LaptopSunfish"]) {
      return SPRITES["LaptopSunfish"];
    }
    console.warn(`[FishTank] Missing sprite: LaptopSunfish`);
    return "";
  }

  // === 2) 그 외 species는 기존 로직 그대로 ====================
  const svg = SPRITES[species];
  if (!svg) {
    console.warn(`[FishTank] Unknown fish species: ${species}`);
    return SPRITES["LaptopSunfish"] ?? "";
  }

  return svg;
}
