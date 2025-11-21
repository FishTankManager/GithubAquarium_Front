import React from "react";

interface FishStage {
  stage: string;
  img: string;
}

interface GrowthTimelineProps {
  fishList: FishStage[];
}

const GrowthTimeline: React.FC<GrowthTimelineProps> = ({ fishList }) => (
  <div className="grid grid-cols-3 gap-6">
    {fishList.map((fish, idx) => (
      <div key={idx} className="flex flex-col items-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-xl border border-[#89482D] bg-[#E6D3B3]"
          style={{ boxShadow: "-4px 4px 6px 0 rgba(0, 0, 0, 0.3) inset" }}
        >
          <img src={fish.img} alt={fish.stage} className="h-15 w-15 object-contain" />
        </div>
        <span className="font-vt323 mt-2 text-[1.4rem] text-[#89482D]">{fish.stage}</span>
      </div>
    ))}
  </div>
);

export default GrowthTimeline;
