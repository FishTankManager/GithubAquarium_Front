import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LogoText from "../components/LogoText";
import FishCage from "../components/CollectionPage/fishCage";
import FishGrowthCard from "../components/CollectionPage/fishGrowthCard";

const fishListData = [
  [
    { stage: "Hatchling", img: "/images/fish/hatchling.png" },
    { stage: "Juvenile", img: "/images/fish/juvenile.png" },
    { stage: "Youngling", img: "/images/fish/youngling.png" },
    { stage: "Adult", img: "/images/fish/adult.png" },
    { stage: "Advanced", img: "/images/fish/advanced.png" },
    { stage: "Master", img: "/images/fish/master.png" },
  ],
  [
    { stage: "Hatchling", img: "/images/fish/hatchling2.png" },
    { stage: "Juvenile", img: "/images/fish/juvenile2.png" },
    { stage: "Youngling", img: "/images/fish/youngling2.png" },
    { stage: "Adult", img: "/images/fish/adult2.png" },
    { stage: "Advanced", img: "/images/fish/advanced2.png" },
    { stage: "Master", img: "/images/fish/master2.png" },
  ],
  // 나머지 10개는 빈 배열
  ...Array(10).fill([]),
];

const fishInfoData = [
  {
    name: "Sunfish",
    mainImg: "/images/fish/juvenile.png",
    memoryName: "MemoryLane",
    rarity: "3.3%",
    starImg: "/images/shop/starfish.png",
    fishList: fishListData[0],
  },
  {
    name: "Moonfish",
    mainImg: "/images/fish/juvenile2.png",
    memoryName: "DreamPath",
    rarity: "2.1%",
    starImg: "/images/shop/starfish.png",
    fishList: fishListData[1],
  },
  // 나머지 10개는 빈 정보
  ...Array(10).fill({}),
];

const fishImages = [
  "/images/fish/juvenile.png",
  "/images/fish/juvenile2.png",
  ...Array(10).fill(undefined),
];

const CollectionPage: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <div
      className="relative min-h-screen bg-[#F8E6B6]"
      style={{
        backgroundImage: "url('/images/collection/sandBackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pt-28 pb-20">
        {/* 타이틀 */}
        <LogoText
          text="COLLECTION"
          className="font-Bungee mb-12 text-center text-6xl"
          gradient={{ from: "#fffbe0", to: "#ffb6b6" }}
          strokeColor="#CA9B9B"
          strokeWidth={4}
        />
        <div className="flex flex-col gap-12 md:flex-row">
          {/* 왼쪽: 물고기 정보 카드 */}
          <FishGrowthCard
            {...(selectedIdx !== null && fishInfoData[selectedIdx]?.fishList?.length
              ? fishInfoData[selectedIdx]
              : {})}
          />
          {/* 오른쪽: 어항 3x4 */}
          <div className="grid flex-1 grid-cols-3 grid-rows-4 items-center justify-items-center gap-6">
            {fishImages.map((img, idx) => (
              <button
                key={idx}
                className="focus:outline-none"
                onClick={() => {
                  if (fishInfoData[idx]?.fishList?.length) setSelectedIdx(idx);
                }}
              >
                <FishCage fish={img} isSelected={selectedIdx === idx} />
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
