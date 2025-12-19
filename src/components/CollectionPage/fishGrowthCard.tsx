import React, { useMemo } from "react";
import GrowthTimeline from "./GrowthTimeline";
import RepoSelect from "../CollectionPage/RepoSelect";
import { UserFish } from "../../apis/collection";
import { RepoInfo } from "@/types/aquarium";

interface FishStage {
  stage: string;
  img: string;
}

interface FishGrowthCardProps {
  selectedFishGroup: UserFish | null;
  allFishData: UserFish[];
  onFishDataUpdate: (fish: UserFish) => void;
  mainImg?: string;
  starImg?: string;
  fishList?: FishStage[];
}

const FishGrowthCard: React.FC<FishGrowthCardProps> = ({
  selectedFishGroup,
  allFishData,
  onFishDataUpdate,
  mainImg,
  starImg = "/images/shop/starfish.png",
  fishList,
}) => {
  const isEmpty = !selectedFishGroup || !fishList || fishList.length === 0;
  // ✅ 1. 현재 선택된 물고기(group_code)가 존재하는 레포지토리 목록만 추출
  const availableRepos = useMemo<RepoInfo[]>(() => {
    if (!selectedFishGroup) return [];

    // 전체 물고기 데이터 중 현재 물고기와 같은 종류인 데이터들만 필터링
    return allFishData
      .filter((fish) => fish.group_code === selectedFishGroup.group_code)
      .map((fish) => ({
        id: fish.id.toString(), // Select 내부 매칭용 ID
        fullName: fish.repository_full_name,
        contributions: fish.maturity,
      }));
  }, [selectedFishGroup, allFishData]);

  // ✅ 2. 현재 선택된 레포지토리 값 매칭
  const currentRepoValue = useMemo(() => {
    if (!selectedFishGroup || availableRepos.length === 0) return null;
    return (
      availableRepos.find((r) => r.fullName === selectedFishGroup.repository_full_name) || null
    );
  }, [selectedFishGroup, availableRepos]);

  const handleRepoChange = (r: RepoInfo | null) => {
    if (!r || !selectedFishGroup) return;

    const targetFish = allFishData.find(
      (fish) =>
        fish.group_code === selectedFishGroup.group_code &&
        fish.repository_full_name === r.fullName,
    );

    if (targetFish) {
      onFishDataUpdate(targetFish);
    }
  };

  return (
    <div
      className="flex flex-1 flex-col items-center"
      style={{
        backgroundImage: "url('/images/collection/GrowthCard.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-6 py-6">
        {isEmpty ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <span className="font-bungee text-center text-[2rem] tracking-widest text-[#89482D]">
              Choose a fish!
            </span>
          </div>
        ) : (
          <>
            <div className="mb-8 flex w-full items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-8">
                <div className="font-bungee text-[2.2rem] tracking-widest text-[#89482D]">
                  {selectedFishGroup.group_code}
                </div>

                <div className="flex w-full items-center justify-center gap-4 px-8">
                  <img src={mainImg} alt="fish" className="h-20 w-20 object-contain" />

                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                    <div>
                      <RepoSelect
                        value={currentRepoValue}
                        onChange={handleRepoChange}
                        customRepos={availableRepos} // 추가된 props
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[1.5rem] text-[#89482D]">
                      Rarity: <img src={starImg} alt="star" className="h-6 w-6" /> 1
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <GrowthTimeline fishList={fishList ?? []} />
          </>
        )}
      </div>
    </div>
  );
};

export default FishGrowthCard;
