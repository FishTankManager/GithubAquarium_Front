import bgOcean from "@/assets/png/Backgrounds/bg-ocean.png";
import bgDeep1 from "@/assets/png/Backgrounds/bg-deep-1.png";
import bgDeep2 from "@/assets/png/Backgrounds/bg-deep-2.png";

const BACKGROUND_IMAGES: Record<string, string> = {
  "Bg Ocean": bgOcean,
  "Bg Deep 1": bgDeep1,
  "Bg Deep 2": bgDeep2,
};

export function getBackgroundImage(name?: string): string | undefined {
  if (!name) return BACKGROUND_IMAGES["Bg Ocean"];

  const img = BACKGROUND_IMAGES[name];
  if (!img) {
    console.warn(`[FishTank] Unknown background name: ${name}`);
    return BACKGROUND_IMAGES["Bg Ocean"];
  }
  return img;
}
