import { useEffect, useState } from "react";
import FishIcon from "./FishIcon";
import { getSelectableFish, type SelectableFish } from "@/apis/fishtank";
import type { Maturity } from "@/types/aquarium";
import { useViewport } from "@/contexts/useViewport";

interface GrowthTimelineProps {
  repoId: string | null;
}

// maturity 숫자를 Maturity 타입으로 변환
function getMaturityFromNumber(maturity: number): Maturity {
  const maturityMap: Record<number, Maturity> = {
    0: "Hatchling",
    1: "Juvenile",
    2: "Youngling",
    3: "Adult",
    4: "Advanced",
    5: "Master",
  };
  return maturityMap[maturity] || "Hatchling";
}

// commit_count에 따라 maturity 결정 (fallback)
function getMaturityFromCommitCount(commitCount: number): Maturity {
  if (commitCount >= 100) return "Master";
  if (commitCount >= 70) return "Advanced";
  if (commitCount >= 50) return "Adult";
  if (commitCount >= 30) return "Youngling";
  if (commitCount >= 20) return "Juvenile";
  if (commitCount >= 10) return "Hatchling";
  return "Hatchling"; // 기본값
}

export default function GrowthTimeline({ repoId }: GrowthTimelineProps) {
  const stages: Maturity[] = ["Hatchling", "Juvenile", "Youngling", "Adult", "Advanced", "Master"];
  const [fishes, setFishes] = useState<SelectableFish[]>([]);
  const { isMobile, width } = useViewport();
  const useVerticalLayout = isMobile || width < 1400;

  // 각 단계별 커밋 목표
  const commitGoals: Record<Maturity, number | null> = {
    Hatchling: 10,
    Juvenile: 20,
    Youngling: 30,
    Adult: 50,
    Advanced: 70,
    Master: 100,
  };

  // API에서 물고기 데이터 가져오기
  useEffect(() => {
    const fetchFishes = async () => {
      if (!repoId) {
        setFishes([]);
        return;
      }

      try {
        const data = await getSelectableFish(repoId);
        console.log("GrowthTimeline: Fetched fishes:", data);
        setFishes(data);
      } catch (error) {
        console.error("Failed to fetch selectable fish:", error);
        setFishes([]);
      }
    };

    fetchFishes();
  }, [repoId]);

  // 같은 group_code를 가진 물고기들 중에서 가장 높은 maturity 찾기
  const getHighestMaturityGroupCode = (): string | null => {
    if (fishes.length === 0) return null;
    // 가장 높은 maturity를 가진 물고기의 group_code 반환
    const highestFish = fishes.reduce((prev, current) => {
      const prevMaturity = prev.maturity ?? getMaturityFromCommitCount(prev.commit_count);
      const currentMaturity = current.maturity ?? getMaturityFromCommitCount(current.commit_count);
      return currentMaturity > prevMaturity ? current : prev;
    });
    return highestFish.group_code || null;
  };

  // 각 단계별로 해당하는 물고기 찾기
  // 같은 group_code를 가진 물고기들 중에서 해당 maturity 단계의 물고기를 찾음
  // 실제로 할당된 물고기만 반환 (is_assigned === true)
  const getFishForStage = (stage: Maturity): SelectableFish | null => {
    const targetGroupCode = getHighestMaturityGroupCode();
    if (!targetGroupCode) return null;

    // 같은 group_code를 가진 물고기들 중에서 해당 maturity 단계 찾기
    // 실제로 할당된 물고기만 필터링
    const stageFishes = fishes.filter((fish) => {
      // group_code가 일치하는지 확인
      if (fish.group_code !== targetGroupCode) return false;

      // 실제로 할당된 물고기만 (is_assigned가 true이거나 id가 null이 아닌 경우)
      if (fish.is_assigned === false || (fish.id === null && fish.is_assigned !== true)) {
        return false;
      }

      // FishSpecies의 maturity 필드를 우선 사용, 없으면 commit_count로 계산
      if (fish.maturity !== undefined) {
        return getMaturityFromNumber(fish.maturity) === stage;
      }
      return getMaturityFromCommitCount(fish.commit_count) === stage;
    });

    console.log(
      `GrowthTimeline: Stage ${stage} (group_code: ${targetGroupCode}) - Found ${stageFishes.length} assigned fishes:`,
      stageFishes,
    );

    if (stageFishes.length === 0) {
      return null; // 할당된 물고기가 없으면 null 반환
    }

    // 가장 높은 commit_count를 가진 물고기 반환
    return stageFishes.reduce((prev, current) =>
      current.commit_count > prev.commit_count ? current : prev,
    );
  };

  // 같은 group_code를 가진 물고기가 있는지 확인
  const targetGroupCode = getHighestMaturityGroupCode();

  // 각 단계별 표시 상태 결정
  // - 할당된 물고기가 있으면: 실제 물고기 표시
  // - 할당된 물고기가 없지만 같은 그룹이 있으면: "?" 표시 (미달성)
  // - 같은 그룹이 없으면: 잠금 상태
  const getStageDisplayState = (stage: Maturity): "assigned" | "unlocked" | "locked" => {
    if (!targetGroupCode) return "locked";
    const fish = getFishForStage(stage);
    if (fish !== null) return "assigned";
    return "unlocked"; // 같은 그룹이 있지만 아직 달성하지 않은 단계
  };

  // 모바일에서는 세로 스크롤 가능한 가로 레이아웃 (가로 스크롤 허용)
  if (useVerticalLayout) {
    return (
      <section className="w-full max-w-full">
        {/* 유리(서리) 카드 - 가로 스크롤 가능 */}
        <div className="overflow-x-auto">
          <div
            className="rounded-2xl p-5 shadow-lg ring-1 ring-white/40 sm:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
              backdropFilter: "blur(6px)",
              minWidth: "700px",
            }}
          >
            {/* 단계별 헤더 */}
            <div className="mb-4 grid grid-cols-[80px_repeat(6,minmax(100px,1fr))] gap-3">
              <div></div> {/* 빈 공간 */}
              {stages.map((stage) => (
                <div key={stage} className="text-center">
                  <h4 className="font-vt text-base tracking-wider break-words text-white sm:text-lg">
                    {stage}
                  </h4>
                </div>
              ))}
            </div>

            {/* EVOLUTION 행 */}
            <div className="mb-4 grid grid-cols-[80px_repeat(6,minmax(100px,1fr))] gap-3">
              <div className="font-vt flex items-center text-sm text-[#5A2B55] sm:text-base">
                EVOLUTION
              </div>
              {stages.map((stage) => {
                const displayState = getStageDisplayState(stage);
                return (
                  <div key={stage} className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/25 shadow-inner transition-transform duration-300 sm:h-24 sm:w-24">
                      {displayState === "assigned" ? (
                        <FishIcon maturity={stage} />
                      ) : displayState === "unlocked" ? (
                        <div className="font-vt text-3xl text-white/70 sm:text-4xl">?</div>
                      ) : (
                        <img
                          src="/images/fish/fish-locked.png"
                          alt="locked fish"
                          className="h-20 w-20 opacity-70 sm:h-24 sm:w-24"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TIME 행 */}
            <div className="mb-4 grid grid-cols-[80px_repeat(6,minmax(100px,1fr))] gap-3">
              <div className="font-vt flex items-center text-sm text-[#5A2B55] sm:text-base">
                TIME
              </div>
              {stages.map((stage) => {
                const fish = getFishForStage(stage);
                return (
                  <div key={stage} className="text-center">
                    <div className="font-vt text-xs break-words text-white sm:text-sm">
                      {fish ? `${fish.username}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COMMIT GOAL 행 */}
            <div className="mb-2 grid grid-cols-[80px_repeat(6,minmax(100px,1fr))] gap-3">
              <div className="font-vt flex items-center text-sm text-[#5A2B55] sm:text-base">
                COMMIT GOAL
              </div>
              {stages.map((stage) => (
                <div key={stage} className="text-center">
                  <div className="font-vt text-sm text-[#5A2B55] sm:text-base">
                    {commitGoals[stage] || ""}
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
          {stages.map((stage) => {
            const displayState = getStageDisplayState(stage);
            return (
              <div key={stage} className="flex justify-center">
                <div className="flex h-30 w-30 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  {displayState === "assigned" ? (
                    <FishIcon maturity={stage} />
                  ) : displayState === "unlocked" ? (
                    <div className="font-vt text-5xl text-white/70">?</div>
                  ) : (
                    <img
                      src="/images/fish/fish-locked.png"
                      alt="locked fish"
                      className="h-30 w-30 opacity-70"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIME 행 */}
        <div className="mb-10 grid grid-cols-[120px_repeat(6,1fr)] gap-4">
          <div className="font-vt flex items-center text-2xl text-[#5A2B55]">TIME</div>
          {stages.map((stage) => {
            const fish = getFishForStage(stage);
            // TODO: 실제 시간 정보가 API에 추가되면 여기에 표시
            return (
              <div key={stage} className="text-center">
                <div className="font-vt text-xl text-white">{fish ? `${fish.username}` : ""}</div>
              </div>
            );
          })}
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
