import React, { useMemo, useState, useEffect } from "react";
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
  const [mainSvg, setMainSvg] = useState<string>("");
  const isEmpty = !selectedFishGroup || !fishList || fishList.length === 0;

  // ✅ 메인 이미지(선택된 물고기) SVG 애니메이션 활성화
  useEffect(() => {
    if (mainImg && !mainImg.includes("questionSquare")) {
      fetch(mainImg)
        .then((res) => res.text())
        .then((data) => {
          const uniqueId = "main-" + Math.random().toString(36).substr(2, 5);
          setMainSvg(data.replaceAll(/\*\{id\}/g, uniqueId));
        })
        .catch((err) => console.error(err));
    } else {
      setMainSvg("");
    }
  }, [mainImg]);

  const availableRepos = useMemo<RepoInfo[]>(() => {
    if (!selectedFishGroup) return [];
    return allFishData
      .filter((fish) => fish.group_code === selectedFishGroup.group_code)
      .map((fish) => ({
        id: fish.id,
        fullName: fish.repository_full_name,
        contributions: fish.maturity,
      }));
  }, [selectedFishGroup, allFishData]);

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
      <div className="flex h-full w-full flex-col items-center justify-center px-6 pt-8 pb-8">
        {isEmpty ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <span className="font-bungee text-center text-[2rem] tracking-widest text-[#89482D]">
              Choose a fish!
            </span>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <div className="mb-4 flex flex-col items-center gap-4 sm:gap-6">
              <div className="font-bungee text-[1.8rem] tracking-widest text-[#89482D] sm:text-[2.2rem]">
                {selectedFishGroup.group_code}
              </div>

              <div className="flex items-center justify-center gap-4 px-4 sm:px-8">
                {/* 메인 이미지 영역: 애니메이션 적용 */}
                <div className="flex h-20 w-20 items-center justify-center sm:h-25 sm:w-25">
                  {mainSvg ? (
                    <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: mainSvg }} />
                  ) : (
                    <img src={mainImg} alt="fish" className="h-full w-full object-contain" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <RepoSelect
                    value={currentRepoValue}
                    onChange={handleRepoChange}
                    customRepos={availableRepos}
                  />
                  <div className="flex items-center gap-2 pl-1 text-[1.2rem] text-[#89482D] sm:text-[1.5rem]">
                    Rarity: <img src={starImg} alt="star" className="h-5 w-5 sm:h-6 sm:w-6" /> 1
                  </div>
                </div>
              </div>
            </div>

            <GrowthTimeline fishList={fishList ?? []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FishGrowthCard;
