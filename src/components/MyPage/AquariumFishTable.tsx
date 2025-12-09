import { useState } from "react";
import FishIcon from "./FishIcon";
import { Maturity } from "@/types/aquarium";
import { useViewport } from "@/contexts/useViewport";

export default function AquariumFishTable() {
  const { isMobile, width } = useViewport();
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

  // 중간 크기 화면에서도 가로 스크롤 사용 (약 1000px 이하)
  const useScrollableLayout = isMobile || width < 1000;

  // 모바일 또는 중간 크기에서는 가로 스크롤 가능한 레이아웃
  if (useScrollableLayout) {
    return (
      <section className="w-full max-w-full">
        {/* 서리(유리) 카드 - 가로 스크롤 가능 */}
        <div className="overflow-x-auto">
          <div
            className={`rounded-2xl shadow-lg ring-1 ring-white/40 ${isMobile ? "p-4" : "p-5"}`}
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
              backdropFilter: "blur(6px)",
              minWidth: isMobile ? "600px" : "800px",
            }}
          >
            {/* 헤더 행 */}
            <div
              className={`grid items-center gap-2 pb-3 ${
                isMobile
                  ? "grid-cols-[60px_80px_120px_140px_120px]"
                  : "grid-cols-[80px_100px_150px_160px_140px]"
              }`}
            >
              <h4
                className={`font-vt text-center tracking-wider text-[#5A2B55] ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                SELECT
              </h4>
              <h4
                className={`font-vt text-center tracking-wider text-[#5A2B55] ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                FISH
              </h4>
              <h4
                className={`font-vt text-center tracking-wider text-[#5A2B55] ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                MATURITY
              </h4>
              <h4
                className={`font-vt text-center tracking-wider text-[#5A2B55] ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                REPO
              </h4>
              <h4
                className={`font-vt text-center tracking-wider text-[#5A2B55] ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                {isMobile ? "CONTRIB" : "CONTRIBUTION"}
              </h4>
            </div>

            {/* 목록 */}
            <div className={isMobile ? "space-y-3" : "space-y-4"}>
              {rows.map((r) => (
                <div
                  key={r.id}
                  className={`grid items-center gap-2 py-2 ${
                    isMobile
                      ? "grid-cols-[60px_80px_120px_140px_120px]"
                      : "grid-cols-[80px_100px_150px_160px_140px]"
                  }`}
                >
                  {/* SELECT 토글 버튼 */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleFishSelection(r.id)}
                      className={`relative rounded-full transition-colors duration-200 ${
                        isMobile ? "h-5 w-10" : "h-6 w-12"
                      } ${selectedFish.has(r.id) ? "bg-[#5A2B55]" : "bg-gray-400"}`}
                    >
                      <div
                        className={`absolute top-0.5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                          isMobile
                            ? `h-4 w-4 ${selectedFish.has(r.id) ? "translate-x-5" : "translate-x-0.5"}`
                            : `h-5 w-5 ${selectedFish.has(r.id) ? "translate-x-6" : "translate-x-0.5"}`
                        }`}
                      />
                    </button>
                  </div>

                  {/* FISH 썸네일 */}
                  <div className="justify-self-center">
                    <div
                      className={`flex items-center justify-center rounded-lg bg-white/25 shadow-inner transition-transform duration-300 ${
                        isMobile ? "h-14 w-20" : "h-16 w-24"
                      }`}
                    >
                      <FishIcon maturity={r.maturity} />
                    </div>
                  </div>

                  {/* MATURITY */}
                  <div
                    className={`font-vt text-center break-words text-white ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    {r.maturity}
                  </div>

                  {/* REPO 링크 느낌 */}
                  <div
                    className={`font-vt text-center text-white/90 ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    <button
                      className="break-words underline decoration-white/60 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                      onClick={() => console.log("go repo:", r.repo)}
                    >
                      {r.repo}
                    </button>
                  </div>

                  {/* CONTRIBUTION */}
                  <div
                    className={`font-vt text-center break-words text-white ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    {r.contribution} commits
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 데스크톱 버전
  return (
    <section className="w-full max-w-[1000px]">
      {/* 서리(유리) 카드 */}
      <div
        className="rounded-2xl p-6 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 헤더 행 */}
        <div className="grid grid-cols-[100px_120px_1fr_180px_160px] items-center gap-4 pb-4">
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">SELECT</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">FISH</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">MATURITY</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">REPO</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">
            CONTRIBUTION
          </h4>
        </div>

        {/* 목록 */}
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[100px_120px_1fr_180px_160px] items-center gap-4 py-2"
            >
              {/* SELECT 토글 버튼 */}
              <div className="flex justify-center">
                <button
                  onClick={() => toggleFishSelection(r.id)}
                  className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
                    selectedFish.has(r.id) ? "bg-[#5A2B55]" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      selectedFish.has(r.id) ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* FISH 썸네일 */}
              <div className="justify-self-center">
                <div className="flex h-20 w-28 items-center justify-center rounded-xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  <FishIcon maturity={r.maturity} />
                </div>
              </div>

              {/* MATURITY */}
              <div className="font-vt text-center text-xl text-white">{r.maturity}</div>

              {/* REPO 링크 느낌 */}
              <div className="font-vt text-center text-xl text-white/90">
                <button
                  className="underline decoration-white/60 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                  onClick={() => console.log("go repo:", r.repo)}
                >
                  {r.repo}
                </button>
              </div>

              {/* CONTRIBUTION */}
              <div className="font-vt text-center text-xl text-white">{r.contribution} commits</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
