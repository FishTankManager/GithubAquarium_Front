import bg1 from "@/assets/png/Backgrounds/bg-1.png";
import bg2 from "@/assets/png/Backgrounds/bg-2.png";
import bg3 from "@/assets/png/Backgrounds/bg-3.png";

const BACKGROUND_IMAGES: Record<string, string> = {
  "bg-1": bg1,
  "bg-2": bg2,
  "bg-3": bg3,
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
