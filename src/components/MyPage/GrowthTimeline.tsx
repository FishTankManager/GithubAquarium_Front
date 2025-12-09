import FishIcon from "./FishIcon";
import { useViewport } from "@/contexts/useViewport";

type Maturity = "Hatchling" | "Juvenile" | "Youngling" | "Adult" | "Advanced" | "Master";

export default function GrowthTimeline() {
  const stages: Maturity[] = ["Hatchling", "Juvenile", "Youngling", "Adult", "Advanced", "Master"];
  const { isMobile } = useViewport();

  // 각 단계별 커밋 목표
  const commitGoals: Record<Maturity, number | null> = {
    Hatchling: 10,
    Juvenile: 20,
    Youngling: 30,
    Adult: null,
    Advanced: null,
    Master: null,
  };

  // 각 단계별 잠금 상태 (현재는 Hatchling, Juvenile만 해금)
  const isUnlocked: Record<Maturity, boolean> = {
    Hatchling: true,
    Juvenile: true,
    Youngling: false,
    Adult: false,
    Advanced: false,
    Master: false,
  };

  // 모바일에서는 세로 스크롤 가능한 가로 레이아웃 (가로 스크롤 허용)
  if (isMobile) {
    return (
      <section className="w-full max-w-full">
        {/* 상단 라벨 */}
        <div className="mt-5 mb-5 inline-block rounded-lg bg-[#C7D6FF]/60 px-4 py-1 shadow">
          <span className="font-vt text-base tracking-wide text-black/80">GROWTH TIMELINE</span>
        </div>

        {/* 유리(서리) 카드 - 가로 스크롤 가능 */}
        <div className="overflow-x-auto">
          <div
            className="rounded-2xl p-4 shadow-lg ring-1 ring-white/40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
              backdropFilter: "blur(6px)",
              minWidth: "600px",
            }}
          >
            {/* 단계별 헤더 */}
            <div className="mb-4 grid grid-cols-[60px_repeat(6,minmax(80px,1fr))] gap-2">
              <div></div> {/* 빈 공간 */}
              {stages.map((stage) => (
                <div key={stage} className="text-center">
                  <h4 className="font-vt text-xs tracking-wider break-words text-white">{stage}</h4>
                </div>
              ))}
            </div>

            {/* EVOLUTION 행 */}
            <div className="mb-4 grid grid-cols-[60px_repeat(6,minmax(80px,1fr))] gap-2">
              <div className="font-vt flex items-center text-xs text-[#5A2B55]">EVOLUTION</div>
              {stages.map((stage) => (
                <div key={stage} className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/25 shadow-inner transition-transform duration-300">
                    {isUnlocked[stage] ? (
                      <FishIcon maturity={stage} />
                    ) : (
                      <img
                        src="/images/fish/fish-locked.png"
                        alt="locked fish"
                        className="h-16 w-16 opacity-70"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* TIME 행 */}
            <div className="mb-4 grid grid-cols-[60px_repeat(6,minmax(80px,1fr))] gap-2">
              <div className="font-vt flex items-center text-xs text-[#5A2B55]">TIME</div>
              {stages.map((stage) => (
                <div key={stage} className="text-center">
                  <div className="font-vt text-[10px] break-words text-white">
                    {isUnlocked[stage] ? "25/09/14 00:00" : ""}
                  </div>
                </div>
              ))}
            </div>

            {/* COMMIT GOAL 행 */}
            <div className="mb-2 grid grid-cols-[60px_repeat(6,minmax(80px,1fr))] gap-2">
              <div className="font-vt flex items-center text-xs text-[#5A2B55]">COMMIT GOAL</div>
              {stages.map((stage) => (
                <div key={stage} className="text-center">
                  <div className="font-vt text-xs text-[#5A2B55]">{commitGoals[stage] || ""}</div>
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
    <section className="w-full max-w-[1500px]">
      {/* 상단 라벨 */}
      <div className="mt-5 mb-5 inline-block rounded-lg bg-[#C7D6FF]/60 px-5 py-1 shadow">
        <span className="font-vt text-xl tracking-wide text-black/80">GROWTH TIMELINE</span>
      </div>

      {/* 유리(서리) 카드 */}
      <div
        className="rounded-2xl p-8 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 단계별 헤더 */}
        <div className="mb-10 grid grid-cols-[120px_repeat(6,1fr)] gap-4">
          <div></div> {/* 빈 공간 */}
          {stages.map((stage) => (
            <div key={stage} className="text-center">
              <h4 className="font-vt text-2xl tracking-wider text-white">{stage}</h4>
            </div>
          ))}
        </div>

        {/* EVOLUTION 행 */}
        <div className="mb-10 grid grid-cols-[120px_repeat(6,1fr)] gap-4">
          <div className="font-vt flex items-center text-2xl text-[#5A2B55]">EVOLUTION</div>
          {stages.map((stage) => (
            <div key={stage} className="flex justify-center">
              <div className="flex h-30 w-30 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                {isUnlocked[stage] ? (
                  <FishIcon maturity={stage} />
                ) : (
                  <img
                    src="/images/fish/fish-locked.png"
                    alt="locked fish"
                    className="h-30 w-30 opacity-70"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* TIME 행 */}
        <div className="mb-10 grid grid-cols-[120px_repeat(6,1fr)] gap-4">
          <div className="font-vt flex items-center text-2xl text-[#5A2B55]">TIME</div>
          {stages.map((stage) => (
            <div key={stage} className="text-center">
              <div className="font-vt text-xl text-white">
                {isUnlocked[stage] ? "25/09/14 00:00" : ""}
              </div>
            </div>
          ))}
        </div>

        {/* COMMIT GOAL 행 */}
        <div className="mb-7 grid grid-cols-[120px_repeat(6,1fr)] gap-4">
          <div className="font-vt flex items-center text-2xl text-[#5A2B55]">COMMIT GOAL</div>
          {stages.map((stage) => (
            <div key={stage} className="text-center">
              <div className="font-vt text-2xl text-[#5A2B55]">{commitGoals[stage] || ""}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
