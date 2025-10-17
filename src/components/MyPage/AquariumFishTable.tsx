import { useState } from "react";
import FishIcon from "./FishIcon";
import { Maturity } from "@/types/aquarium";

export default function AquariumFishTable() {
  const rows: { id: string; maturity: Maturity; repo: string; contribution: number }[] = [
    // dummy
    { id: "f1", maturity: "Juvenile", repo: "MemoryLane", contribution: 100 },
    { id: "f2", maturity: "Adult", repo: "FlowerGame", contribution: 200 },
    { id: "f3", maturity: "Advanced", repo: "LikeLion", contribution: 300 },
  ];

  const [selectedFish, setSelectedFish] = useState<Set<string>>(new Set());

  const toggleFishSelection = (fishId: string) => {
    setSelectedFish((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fishId)) {
        newSet.delete(fishId);
      } else {
        newSet.add(fishId);
      }
      return newSet;
    });
  };

  return (
    <section className="w-[1500px]">
      {/* 서리(유리) 카드 */}
      <div
        className="rounded-2xl p-8 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 헤더 행 */}
        <div className="grid grid-cols-[220px_220px_1fr_270px_250px] items-center pb-8">
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">SELECT</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">FISH</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">MATURITY</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">REPO</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">
            CONTRIBUTION
          </h4>
        </div>

        {/* 목록 */}
        <div className="space-y-8">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[220px_220px_1fr_270px_250px] items-center py-1"
            >
              {/* SELECT 토글 버튼 */}
              <div className="flex justify-center">
                <button
                  onClick={() => toggleFishSelection(r.id)}
                  className={`relative h-8 w-16 rounded-full transition-colors duration-200 ${
                    selectedFish.has(r.id) ? "bg-[#5A2B55]" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      selectedFish.has(r.id) ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* FISH 썸네일 */}
              <div className="justify-self-center">
                <div className="flex h-30 w-30 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  <FishIcon maturity={r.maturity} />
                </div>
              </div>

              {/* MATURITY */}
              <div className="font-vt text-center text-2xl text-white">{r.maturity}</div>

              {/* REPO 링크 느낌 */}
              <div className="font-vt text-center text-2xl text-white/90">
                <button
                  className="underline decoration-white/60 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                  onClick={() => console.log("go repo:", r.repo)}
                >
                  {r.repo}
                </button>
              </div>

              {/* CONTRIBUTION */}
              <div className="font-vt text-center text-2xl text-white">
                {r.contribution} commits
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
