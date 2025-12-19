import React, { useEffect, useState } from "react";

interface FishStage {
  stage: string;
  img: string;
}

interface GrowthTimelineProps {
  fishList: FishStage[];
}

// 개별 단계를 렌더링하는 컴포넌트 (SVG 애니메이션 활성화용)
const GrowthStageItem: React.FC<{ fish: FishStage }> = ({ fish }) => {
  const [svgContent, setSvgContent] = useState<string>("");
  const isQuestion = fish.img.includes("questionSquare");

  useEffect(() => {
    if (isQuestion) return;

    fetch(fish.img)
      .then((res) => res.text())
      .then((data) => {
        // SVG 내 애니메이션 ID 충돌 방지를 위해 고유 ID 생성
        const uniqueId = Math.random().toString(36).substr(2, 9);
        setSvgContent(data.replaceAll(/\*\{id\}/g, uniqueId));
      })
      .catch((err) => console.error("SVG fetch error:", err));
  }, [fish.img, isQuestion]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-xl border border-[#89482D] bg-[#E6D3B3] sm:h-24 sm:w-24"
        style={{ boxShadow: "-4px 4px 6px 0 rgba(0, 0, 0, 0.3) inset" }}
      >
        <div className="relative flex h-full w-full items-center justify-center p-2">
          {isQuestion ? (
            <img src={fish.img} alt={fish.stage} className="h-10 w-10 object-contain opacity-80" />
          ) : (
            <div
              className="pointer-events-none h-full w-full object-contain"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>
      </div>
      <span className="font-vt323 mt-2 text-[1.1rem] text-[#89482D] sm:text-[1.4rem]">
        {fish.stage}
      </span>
    </div>
  );
};

const GrowthTimeline: React.FC<GrowthTimelineProps> = ({ fishList }) => {
  return (
    <div className="flex w-full items-center justify-center" style={{ height: "300px" }}>
      <div className="grid grid-cols-3 gap-6">
        {fishList.map((fish, idx) => (
          <GrowthStageItem key={`${fish.stage}-${idx}`} fish={fish} />
        ))}
      </div>
    </div>
  );
};

export default GrowthTimeline;
