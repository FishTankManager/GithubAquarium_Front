import { useEffect, useState, useMemo } from "react";
import FishIcon from "./FishIcon";
import { getSelectableFish, type SelectableFish } from "@/apis/fishtank";
import type { Maturity } from "@/types/aquarium";
import { useViewport } from "@/contexts/useViewport";
import * as FishSprites from "@/assets/svg/FishSprites";

interface ContributionFishData {
  id: number;
  username: string;
  commit_count: number;
  species: {
    id: number;
    name: string;
    maturity: number;
    required_commits: number;
    svg_template: string;
    group_code: string;
  };
}

interface GrowthTimelineProps {
  repoId: string | null;
  contributionFishes?: ContributionFishData[];
}

// maturity 숫자를 Maturity 타입으로 변환 (1부터 시작)
function getMaturityFromNumber(maturity: number): Maturity {
  const maturityMap: Record<number, Maturity> = {
    1: "Hatchling",
    2: "Juvenile",
    3: "Youngling",
    4: "Adult",
    5: "Advanced",
    6: "Master",
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

export default function GrowthTimeline({ repoId, contributionFishes = [] }: GrowthTimelineProps) {
  const stages: Maturity[] = ["Hatchling", "Juvenile", "Youngling", "Adult", "Advanced", "Master"];
  const [fishes, setFishes] = useState<SelectableFish[]>([]);
  const { isMobile, width } = useViewport();
  const useVerticalLayout = isMobile || width < 1400;

  // ContributionFish 데이터를 기반으로 같은 group_code를 가진 물고기들 중 maturity가 현재 이하인 것들 필터링
  const filteredFishes = useMemo(() => {
    console.log("GrowthTimeline: filteredFishes calculation", {
      contributionFishesCount: contributionFishes.length,
      fishesCount: fishes.length,
    });

    if (contributionFishes.length === 0) {
      console.log("GrowthTimeline: No contributionFishes, using all fishes");
      return fishes; // ContributionFish가 없으면 기존 로직 사용
    }

    // 가장 높은 maturity를 가진 ContributionFish의 group_code 찾기
    const highestFish = contributionFishes.reduce((prev, current) =>
      current.species.maturity > prev.species.maturity ? current : prev,
    );
    const targetGroupCode = highestFish.species.group_code;
    const maxMaturity = highestFish.species.maturity;

    console.log("GrowthTimeline: Filtering fishes", {
      targetGroupCode,
      maxMaturity,
      highestFishSpecies: highestFish.species.name,
    });

    // 같은 group_code를 가진 물고기들 중 maturity가 maxMaturity 이하인 것들만 필터링
    const filtered = fishes.filter((fish) => {
      if (fish.group_code !== targetGroupCode) return false;
      // fish.maturity가 있으면 숫자로 직접 비교, 없으면 commit_count로 maturity 계산 후 비교
      if (fish.maturity !== undefined) {
        return fish.maturity <= maxMaturity;
      }
      const fishMaturity = getMaturityFromCommitCount(fish.commit_count);
      // stages는 0부터 시작하지만 maturity는 1부터 시작하므로 +1
      const maturityNumber = stages.indexOf(fishMaturity) + 1;
      return maturityNumber <= maxMaturity;
    });

    console.log("GrowthTimeline: Filtered fishes", {
      filteredCount: filtered.length,
      filtered: filtered.map((f) => ({
        id: f.id,
        username: f.username,
        maturity: f.maturity,
        group_code: f.group_code,
        is_assigned: f.is_assigned,
      })),
    });

    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fishes, contributionFishes]);

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
        console.log("GrowthTimeline: Fetched fishes details:", {
          count: data.length,
          fishes: data.map((f) => ({
            id: f.id,
            username: f.username,
            maturity: f.maturity,
            group_code: f.group_code,
            is_assigned: f.is_assigned,
          })),
        });
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
    // ContributionFish가 있으면 그것을 우선 사용
    if (contributionFishes.length > 0) {
      const highestFish = contributionFishes.reduce((prev, current) =>
        current.species.maturity > prev.species.maturity ? current : prev,
      );
      return highestFish.species.group_code;
    }

    // ContributionFish가 없으면 기존 로직 사용
    if (filteredFishes.length === 0) return null;
    // 가장 높은 maturity를 가진 물고기의 group_code 반환
    const highestFish = filteredFishes.reduce((prev, current) => {
      const prevMaturity = prev.maturity ?? getMaturityFromCommitCount(prev.commit_count);
      const currentMaturity = current.maturity ?? getMaturityFromCommitCount(current.commit_count);
      return currentMaturity > prevMaturity ? current : prev;
    });
    return highestFish.group_code || null;
  };

  // group_code와 maturity를 기반으로 로컬 SVG 파일 경로 찾기
  const getLocalSvgPath = (groupCode: string, maturity: number): string | null => {
    // group_code를 폴더명으로 변환 (예: "SpaceOcto" -> "SpaceOcto")
    const folderName = groupCode;
    // 파일명 생성 (예: "SpaceOcto_1")
    const fileName = `${folderName}_${maturity}`;

    // FishSprites에서 해당 파일 찾기
    const spriteKey = fileName as keyof typeof FishSprites;
    if (spriteKey in FishSprites && FishSprites[spriteKey]) {
      return FishSprites[spriteKey] as string;
    }

    return null;
  };

  // 각 단계별로 해당하는 물고기 찾기
  // 같은 group_code를 가진 물고기들 중에서 해당 maturity 단계의 물고기를 찾음
  // contributionFishes가 있으면 할당된 물고기만, 없으면 모든 물고기
  const getFishForStage = (stage: Maturity): SelectableFish | null => {
    const targetGroupCode = getHighestMaturityGroupCode();
    if (!targetGroupCode) return null;

    // stages는 0부터 시작하지만 maturity는 1부터 시작하므로 +1
    const stageMaturityNumber = stages.indexOf(stage) + 1;

    // contributionFishes가 있으면 그것을 우선 사용
    if (contributionFishes.length > 0) {
      // contributionFishes에서 해당 maturity 단계의 물고기 찾기
      const matchingContributionFish = contributionFishes.find((cf) => {
        return (
          cf.species.group_code === targetGroupCode && cf.species.maturity === stageMaturityNumber
        );
      });

      if (matchingContributionFish) {
        // 로컬 SVG 파일 찾기 (우선 사용)
        const localSvg = getLocalSvgPath(targetGroupCode, stageMaturityNumber);

        // contributionFishes에서 찾은 물고기를 SelectableFish 형태로 변환
        const selectableFish: SelectableFish = {
          id: matchingContributionFish.id,
          username: matchingContributionFish.username,
          species: matchingContributionFish.species.name,
          commit_count: matchingContributionFish.commit_count,
          selected: false, // 기본값
          maturity: matchingContributionFish.species.maturity,
          required_commits: matchingContributionFish.species.required_commits,
          group_code: matchingContributionFish.species.group_code,
          is_assigned: true,
          svg_template: localSvg || matchingContributionFish.species.svg_template, // 로컬 SVG 우선 사용
        };
        console.log(
          `GrowthTimeline: Stage ${stage} - Found from contributionFishes:`,
          selectableFish,
        );
        return selectableFish;
      }

      // contributionFishes에 없으면 로컬 SVG 파일 사용 (현재 maturity보다 작거나 같은 경우)
      const highestFish = contributionFishes.reduce((prev, current) =>
        current.species.maturity > prev.species.maturity ? current : prev,
      );
      const maxMaturity = highestFish.species.maturity;

      // 현재 maturity보다 작거나 같으면 로컬 SVG 파일 사용
      if (stageMaturityNumber <= maxMaturity) {
        const localSvg = getLocalSvgPath(targetGroupCode, stageMaturityNumber);
        if (localSvg) {
          const selectableFish: SelectableFish = {
            id: null,
            username: null,
            species: `${targetGroupCode} ${stage}`,
            commit_count: 0,
            selected: false,
            maturity: stageMaturityNumber,
            required_commits: 0,
            group_code: targetGroupCode,
            is_assigned: false,
            svg_template: localSvg,
          };
          console.log(
            `GrowthTimeline: Stage ${stage} - Using local SVG for unassigned maturity:`,
            selectableFish,
          );
          return selectableFish;
        }
      }

      // contributionFishes에 없으면 filteredFishes에서 찾기
      // 같은 group_code를 가진 물고기들 중에서 해당 maturity 단계 찾기
      // is_assigned가 false여도 표시 (할당되지 않았어도 같은 group_code이고 maxMaturity 이하면 표시)
      const stageFishes = filteredFishes.filter((fish) => {
        if (fish.group_code !== targetGroupCode) return false;
        if (fish.maturity !== undefined) {
          return getMaturityFromNumber(fish.maturity) === stage;
        }
        return getMaturityFromCommitCount(fish.commit_count) === stage;
      });

      if (stageFishes.length > 0) {
        // 할당된 물고기가 있으면 그것을 우선 반환, 없으면 할당되지 않은 물고기 반환
        const assignedFish = stageFishes.find((f) => f.is_assigned === true && f.id !== null);
        if (assignedFish) {
          // 로컬 SVG 파일도 추가
          const localSvg = getLocalSvgPath(
            targetGroupCode,
            assignedFish.maturity || stageMaturityNumber,
          );
          if (localSvg) {
            assignedFish.svg_template = localSvg;
          }
          return assignedFish;
        }
        // 할당된 물고기가 없으면 첫 번째 물고기 반환 (할당되지 않은 maturity 단계)
        const fish = stageFishes[0];
        const localSvg = getLocalSvgPath(targetGroupCode, fish.maturity || stageMaturityNumber);
        if (localSvg) {
          fish.svg_template = localSvg;
        }
        return fish;
      }

      return null;
    }

    // contributionFishes가 없으면 기존 로직 사용
    const stageFishes = filteredFishes.filter((fish) => {
      if (fish.group_code !== targetGroupCode) return false;
      if (fish.maturity !== undefined) {
        return getMaturityFromNumber(fish.maturity) === stage;
      }
      return getMaturityFromCommitCount(fish.commit_count) === stage;
    });

    console.log(
      `GrowthTimeline: Stage ${stage} (group_code: ${targetGroupCode}, contributionFishes: ${contributionFishes.length}) - Found ${stageFishes.length} fishes:`,
      stageFishes.map((f) => ({
        id: f.id,
        username: f.username,
        maturity: f.maturity,
        is_assigned: f.is_assigned,
      })),
    );

    if (stageFishes.length === 0) {
      return null;
    }

    return stageFishes.reduce((prev, current) =>
      current.commit_count > prev.commit_count ? current : prev,
    );
  };

  // 같은 group_code를 가진 물고기가 있는지 확인
  const targetGroupCode = getHighestMaturityGroupCode();

  // 각 단계별 표시 상태 결정
  // - 할당된 물고기가 있으면: 실제 물고기 표시
  // - 할당된 물고기가 없지만 같은 그룹이 있고 maxMaturity 이하면: "?" 표시 (미달성)
  // - 같은 그룹이 없거나 maxMaturity 초과면: 잠금 상태
  const getStageDisplayState = (stage: Maturity): "assigned" | "unlocked" | "locked" => {
    if (!targetGroupCode) {
      console.log(`GrowthTimeline: Stage ${stage} - No targetGroupCode, returning locked`);
      return "locked";
    }

    // contributionFishes가 있으면 가장 높은 maturity 확인
    if (contributionFishes.length > 0) {
      const highestFish = contributionFishes.reduce((prev, current) =>
        current.species.maturity > prev.species.maturity ? current : prev,
      );
      const maxMaturity = highestFish.species.maturity;
      // stages는 0부터 시작하지만 maturity는 1부터 시작하므로 +1
      const stageMaturityNumber = stages.indexOf(stage) + 1;

      // 현재 maturity보다 높은 단계는 잠금 상태
      if (stageMaturityNumber > maxMaturity) {
        console.log(
          `GrowthTimeline: Stage ${stage} (maturity ${stageMaturityNumber}) - Exceeds maxMaturity ${maxMaturity}, returning locked`,
        );
        return "locked";
      }
    }

    const fish = getFishForStage(stage);
    if (fish !== null) {
      // 할당된 물고기가 있으면 표시
      if (fish.is_assigned === true && fish.id !== null) {
        console.log(`GrowthTimeline: Stage ${stage} - Found assigned fish, returning assigned`, {
          id: fish.id,
          username: fish.username,
          maturity: fish.maturity,
        });
        return "assigned";
      }
      // 할당되지 않은 물고기지만 svg_template이 있으면 표시 (같은 그룹이고 maxMaturity 이하)
      if (fish.svg_template) {
        console.log(
          `GrowthTimeline: Stage ${stage} - Found unassigned fish with svg_template, returning assigned`,
        );
        return "assigned";
      }
      // 할당되지 않은 물고기이고 svg_template도 없으면 "?" 표시
      console.log(
        `GrowthTimeline: Stage ${stage} - Found unassigned fish without svg_template, returning unlocked`,
      );
      return "unlocked";
    }
    console.log(`GrowthTimeline: Stage ${stage} - No fish found, returning unlocked`);
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
                const fish = getFishForStage(stage);
                return (
                  <div key={stage} className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white/25 shadow-inner transition-transform duration-300 sm:h-24 sm:w-24">
                      {displayState === "assigned" && fish?.svg_template ? (
                        <div
                          className="h-full w-full"
                          dangerouslySetInnerHTML={{ __html: fish.svg_template }}
                        />
                      ) : displayState === "assigned" ? (
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
            const fish = getFishForStage(stage);
            return (
              <div key={stage} className="flex justify-center">
                <div className="flex h-30 w-30 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  {displayState === "assigned" && fish?.svg_template ? (
                    <div
                      className="h-full w-full"
                      dangerouslySetInnerHTML={{ __html: fish.svg_template }}
                    />
                  ) : displayState === "assigned" ? (
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
