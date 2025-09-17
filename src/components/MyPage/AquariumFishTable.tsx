import FishIcon from "./FishIcon";
import { Maturity } from "@/types/aquarium";

export default function AquariumFishTable() {
  const rows: { id: string; maturity: Maturity; repo: string }[] = [
    { id: "f1", maturity: "Juvenile", repo: "MemoryLane" },
    { id: "f2", maturity: "Adult", repo: "FlowerGame" },
  ];

  return (
    <>
      <div className="grid grid-cols-[120px_1fr_160px] pb-2 text-xs text-gray-700">
        <span>FISH</span>
        <span>maturity</span>
        <span>repo</span>
      </div>
      <div className="divide-y">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[120px_1fr_160px] items-center py-3">
            <div>
              <FishIcon maturity={r.maturity} />
            </div>
            <div className="text-sm">{r.maturity}</div>
            <div className="cursor-pointer text-sm underline">{r.repo}</div>
          </div>
        ))}
      </div>
    </>
  );
}
