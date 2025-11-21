import { Maturity } from "@/types/aquarium";

const mapByMaturity: Record<Maturity, string> = {
  Hatchling: "/images/fish/hatchling.png",
  Juvenile: "/images/fish/juvenile.png",
  Youngling: "/images/fish/youngling.png",
  Adult: "/images/fish/adult.png",
  Advanced: "/images/fish/advanced.png",
  Master: "/images/fish/master.png",
};

export default function FishIcon({ maturity, size = 80 }: { maturity: Maturity; size?: number }) {
  return <img src={mapByMaturity[maturity]} width={size} height={size} alt={maturity} />;
}
