import { useEffect, useState } from "react";
import FishIcon from "./FishIcon";
import { getSelectableFish, type SelectableFish } from "@/apis/fishtank";
import type { Maturity } from "@/types/aquarium";

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
  const getFishForStage = (stage: Maturity): SelectableFish | null => {
    const targetGroupCode = getHighestMaturityGroupCode();
    if (!targetGroupCode) return null;

    // 같은 group_code를 가진 물고기들 중에서 해당 maturity 단계 찾기
    const stageFishes = fishes.filter((fish) => {
      // group_code가 일치하는지 확인
      if (fish.group_code !== targetGroupCode) return false;

      // FishSpecies의 maturity 필드를 우선 사용, 없으면 commit_count로 계산
      if (fish.maturity !== undefined) {
        return getMaturityFromNumber(fish.maturity) === stage;
      }
      return getMaturityFromCommitCount(fish.commit_count) === stage;
    });

    console.log(
      `GrowthTimeline: Stage ${stage} (group_code: ${targetGroupCode}) - Found ${stageFishes.length} fishes:`,
      stageFishes,
    );

    if (stageFishes.length === 0) {
      // 같은 group_code를 가진 물고기가 있지만 해당 단계는 할당되지 않은 경우
      // 할당되지 않은 물고기 중에서 해당 maturity 단계 찾기
      const unassignedFish = fishes.find(
        (f) =>
          f.group_code === targetGroupCode &&
          f.maturity !== undefined &&
          getMaturityFromNumber(f.maturity) === stage &&
          f.is_assigned === false,
      );
      if (unassignedFish) {
        return unassignedFish; // 할당되지 않았지만 같은 그룹이므로 반환
      }
      return null;
    }

    // 가장 높은 commit_count를 가진 물고기 반환
    return stageFishes.reduce((prev, current) =>
      current.commit_count > prev.commit_count ? current : prev,
    );
  };

  // 같은 group_code를 가진 물고기가 있는지 확인
  const targetGroupCode = getHighestMaturityGroupCode();

  // 각 단계별 잠금 상태
  // 같은 group_code를 가진 물고기가 있으면, 해당 그룹의 모든 단계를 해금 상태로 표시
  // 실제로 할당된 물고기가 있는 단계는 물고기 표시, 없는 단계는 잠금 해제된 상태로 표시
  const isUnlocked: Record<Maturity, boolean> = {
    Hatchling: targetGroupCode !== null, // 같은 그룹이 있으면 해금
    Juvenile: targetGroupCode !== null,
    Youngling: targetGroupCode !== null,
    Adult: targetGroupCode !== null,
    Advanced: targetGroupCode !== null,
    Master: targetGroupCode !== null,
  };

  return (
    <section className="w-[1500px]">
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
