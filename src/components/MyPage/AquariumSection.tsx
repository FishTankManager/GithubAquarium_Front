import { useMemo, useState } from "react";
import AquariumCanvas from "./AquariumCanvas";
import AquariumTabs, { SubTab } from "./AquariumTabs";
import AquariumFishTable from "./AquariumFishTable";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import BottomLines from "./BottomLines";

type BgItem = {
  id: string;
  name: string;
  src: string;
};

export default function AquariumSection() {
  const [tab, setTab] = useState<SubTab>("fish");
  const totalContrib = 12987;

  const bgCandidates: BgItem[] = useMemo(
    () => [
      { id: "blank", name: "Blank", src: "/images/background/bg-blank.png" },
      { id: "ocean", name: "Pixel Ocean", src: "/images/background/bg-ocean.png" },
      { id: "deep1", name: "Deep Sea 1", src: "/images/background/bg-deep-1.png" },
      { id: "deep2", name: "Deep Sea 2", src: "/images/background/bg-deep-2.png" },
    ],
    [],
  );

  const [appliedBgId, setAppliedBgId] = useState<string | null>(null); // null이면 기본 이미지 (지금은 aquarium_example.png)
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);

  // 현재 캔버스에 보여줄 src (기본은 aquarium_example.png)
  const appliedBgSrc =
    (appliedBgId && bgCandidates.find((b) => b.id === appliedBgId)?.src) ||
    "/images/aquarium_example.png";

  const handleApply = () => {
    if (!selectedBgId) return;
    setAppliedBgId(selectedBgId);
    console.log("APPLY background:", selectedBgId); // TODO: 추후 실제 저장/호출
  };

  return (
    <>
      {/* 상단 Export 버튼 (더미) */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => console.log("EXPORT clicked")}
          className="font-turret rounded-full bg-black px-4 py-2 text-white"
        >
          EXPORT
        </button>
      </div>

      {/* 상단 수족관 캔버스 (적용된 배경 반영) */}
      <AquariumCanvas width={600} height={300} src={appliedBgSrc} />
      <p className="font-turret mt-2 text-sm">
        Total contributions: {totalContrib.toLocaleString()}
      </p>

      {/* 서브 탭 + APPLY 버튼 */}
      <div className="mt-4 flex items-center justify-between">
        <AquariumTabs tab={tab} onChange={setTab} />
        <button
          onClick={handleApply}
          // BACKGROUND 탭일 때 활성 느낌, 선택 없으면 반투명
          className={`font-turret rounded-full border px-4 py-2 ${tab === "background" ? "bg-black text-white" : "bg-white/60 text-black"} ${tab === "background" && !selectedBgId ? "opacity-50" : ""}`}
          disabled={tab !== "background" || !selectedBgId}
        >
          APPLY
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <section className="mt-3 rounded-xl bg-white/60 p-4 shadow">
        {tab === "fish" && <AquariumFishTable />}

        {tab === "background" && (
          <AquariumBackgroundGrid
            items={bgCandidates}
            selectedId={selectedBgId}
            onSelect={setSelectedBgId}
          />
        )}

        {tab === "items" && <div className="text-sm">보유 아이템 목록(dummy)</div>}
      </section>

      <BottomLines />
    </>
  );
}
