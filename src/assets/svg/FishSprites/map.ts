import * as sprites from ".";

const SPRITES = sprites as Record<string, string>;

export function getFishSpriteSvg(species: string): string {
  const svg = SPRITES[species];
  if (!svg) {
    console.warn(`[FishTank] Unknown fish species: ${species}`);
    return SPRITES["LaptopSunfish"] ?? "";
  }
  return svg;
}
