import React from "react";
import GrowthTimeline from "./GrowthTimeline";

interface FishStage {
  stage: string;
  img: string;
}

interface FishGrowthCardProps {
  name?: string;
  mainImg?: string;
  memoryName?: string;
  rarity?: string;
  starImg?: string;
  fishList?: FishStage[];
}

const FishGrowthCard: React.FC<FishGrowthCardProps> = ({
  name,
  mainImg,
  memoryName,
  rarity,
  starImg,
  fishList,
}) => {
  // 아무 값도 없으면 초기 안내 텍스트 표시
  const isEmpty =
    !name && !mainImg && !memoryName && !rarity && !starImg && (!fishList || fishList.length === 0);

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
      <div className="flex h-full w-full flex-col px-18 py-6">
        {isEmpty ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <span className="font-bungee text-center text-[2rem] tracking-widest text-[#89482D]">
              Choose a fish!
            </span>
          </div>
        ) : (
          <>
            {/* 상단 물고기 및 정보 */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="mt-5">
                <div className="font-bungee mb-3 text-[3.2rem] tracking-widest text-[#89482D]">
                  {name}
                </div>
                <div className="mb-3 flex items-center justify-center gap-8">
                  <img src={mainImg} alt="fish" className="h-20 w-20" />
                  <div>
                    <div className="font-vt323 text-[2rem] text-[#89482D]">{memoryName}</div>
                    <div className="flex items-center gap-2 text-[2rem] text-[#89482D]">
                      Rarity: <img src={starImg} alt="star" className="h-5 w-5" /> {rarity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 성장 카드 리스트 */}
            <GrowthTimeline fishList={fishList ?? []} />
          </>
        )}
      </div>
    </div>
  );
};

export default FishGrowthCard;
