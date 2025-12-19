import React, { useState, useEffect } from "react";
import { getUserFishList, UserFish } from "../apis/collection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LogoText from "../components/LogoText";
import FishCage from "../components/CollectionPage/fishCage";
import FishGrowthCard from "../components/CollectionPage/fishGrowthCard";

const CollectionPage: React.FC = () => {
  const [allFish, setAllFish] = useState<UserFish[]>([]); // 전체 데이터
  const [displayFish, setDisplayFish] = useState<UserFish[]>([]); // 어항용 (중복제거)
  const [selectedFish, setSelectedFish] = useState<UserFish | null>(null); // 현재 선택된 종류
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const data = await getUserFishList();
        if (data) {
          setAllFish(data);

          // 오른쪽 어항용: group_code 기준 중복 제거 (가장 maturity 높은 것)
          const uniqueFishMap = new Map<string, UserFish>();
          data.forEach((fish) => {
            const existingFish = uniqueFishMap.get(fish.group_code);
            if (!existingFish || fish.maturity > existingFish.maturity) {
              uniqueFishMap.set(fish.group_code, fish);
            }
          });
          setDisplayFish(Array.from(uniqueFishMap.values()));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFish();
  }, []);

  const getFishImage = (fish: UserFish | null) => {
    if (!fish) return undefined;
    try {
      return new URL(
        `../assets/svg/FishSprites/${fish.group_code}/${fish.group_code}_1.svg`,
        import.meta.url,
      ).href;
    } catch {
      return "/images/collection/questionSquare.png";
    }
  };

  const getGrowthTimelineData = (fish: UserFish | null) => {
    if (!fish) return [];
    const stages = [
      { name: "Hatchling", threshold: 1, suffix: "_1" },
      { name: "Juvenile", threshold: 2, suffix: "_2" },
      { name: "Youngling", threshold: 3, suffix: "_3" },
      { name: "Adult", threshold: 4, suffix: "_4" },
      { name: "Advanced", threshold: 5, suffix: "_5" },
      { name: "Master", threshold: 6, suffix: "_6" },
    ];

    return stages.map((stage) => ({
      stage: stage.name,
      img:
        fish.maturity >= stage.threshold
          ? new URL(
              `../assets/svg/FishSprites/${fish.group_code}/${fish.group_code}${stage.suffix}.svg`,
              import.meta.url,
            ).href
          : "/images/collection/questionSquare.png",
    }));
  };

  const displaySlots = Array(12)
    .fill(null)
    .map((_, i) => displayFish[i] || null);

  return (
    <div
      className="relative min-h-screen bg-[#F8E6B6]"
      style={{
        backgroundImage: "url('/images/collection/sandBackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-28 pb-20">
        <LogoText
          text="COLLECTION"
          className="font-Bungee text-shadow mb-12 text-center text-6xl drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]"
          gradient={{ from: "#fffbe0", to: "#ffb6b6" }}
          strokeColor="#CA9B9B"
          strokeWidth={4}
        />

        <div className="flex flex-col gap-12 md:flex-row">
          <FishGrowthCard
            selectedFishGroup={selectedFish} // 현재 선택된 물고기 종류 정보
            allFishData={allFish} // 레포 선택을 위한 전체 리스트
            onFishDataUpdate={(updatedFish) => setSelectedFish(updatedFish)}
            mainImg={getFishImage(selectedFish)}
            fishList={getGrowthTimelineData(selectedFish)}
          />

          <div className="grid flex-1 grid-cols-3 grid-rows-4 items-center justify-items-center gap-6">
            {displaySlots.map((fish, idx) => (
              <button
                key={idx}
                className="focus:outline-none"
                onClick={() => {
                  if (fish) setSelectedFish(fish);
                }}
              >
                <FishCage
                  fish={getFishImage(fish)}
                  isSelected={selectedFish?.group_code === fish?.group_code}
                />
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
