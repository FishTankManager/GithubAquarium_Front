import bg1 from "@/assets/png/Backgrounds/bg-deep-1.png";
import bg2 from "@/assets/png/Backgrounds/bg-deep-2.png";
import bg3 from "@/assets/png/Backgrounds/bg-ocean.png";

const BACKGROUND_IMAGES: Record<string, string> = {
  "Bg Ocean": bg1,
  "Bg Deep 1": bg2,
  "Bg Deep 2": bg3,
};

export function getBackgroundImage(name?: string): string | undefined {
  if (!name) return BACKGROUND_IMAGES["bg-1"];
  const img = BACKGROUND_IMAGES[name];
  if (!img) {
    console.warn(`[FishTank] Unknown background name: ${name}`);
    return BACKGROUND_IMAGES["bg-1"];
  }
  return img;
}
