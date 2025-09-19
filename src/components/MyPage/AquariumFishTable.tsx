import FishIcon from "./FishIcon";
import { Maturity } from "@/types/aquarium";

export default function AquariumFishTable() {
  const rows: { id: string; maturity: Maturity; repo: string }[] = [
    { id: "f1", maturity: "Juvenile", repo: "MemoryLane" },
    { id: "f2", maturity: "Adult", repo: "FlowerGame" },
  ];

  return (
    <section className="w-[770px]">
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
        <div className="grid grid-cols-[180px_1fr_220px] items-center pb-6">
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">FISH</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">MATURITY</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">REPO</h4>
        </div>

        {/* 목록 */}
        <div className="space-y-8">
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[180px_1fr_220px] items-center py-6">
              {/* FISH 썸네일 */}
              <div className="justify-self-center">
                <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
