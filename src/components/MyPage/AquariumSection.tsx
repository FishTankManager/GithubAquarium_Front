import { useMemo, useState } from "react";
import AquariumCanvas from "./AquariumCanvas";
import AquariumTabs, { SubTab } from "./AquariumTabs";
import AquariumFishTable from "./AquariumFishTable";
// import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";

type Item = { id: string; name: string; src: string };

type BgItem = {
  id: string;
  name: string;
  src: string;
};

export default function AquariumSection() {
  const [tab, setTab] = useState<SubTab>("fish");
  const totalContrib = 12987;

  // background 후보 (dummy)
  const bgCandidates: BgItem[] = useMemo(
    () => [
      { id: "blank", name: "Blank", src: "/images/background/bg-blank.png" },
      { id: "ocean", name: "Pixel Ocean", src: "/images/background/bg-ocean.png" },
      { id: "deep1", name: "Deep Sea 1", src: "/images/background/bg-deep-1.png" },
      { id: "deep2", name: "Deep Sea 2", src: "/images/background/bg-deep-2.png" },
    ],
    [],
  );

  // item 후보 (dummy)
  const itemCandidates: Item[] = useMemo(
    () => [
      { id: "it1", name: "Corals 1", src: "/images/items/coral-1.png" },
      { id: "it2", name: "Corals 2", src: "/images/items/coral-2.png" },
      { id: "it3", name: "Corals 3", src: "/images/items/coral-3.png" },
      { id: "it4", name: "Corals 4", src: "/images/items/coral-4.png" },
    ],
    [],
  );

  const [appliedBgId, setAppliedBgId] = useState<string | null>(null); // null이면 기본 이미지 (지금은 aquarium_example.png)
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);

  const [appliedItemId, setAppliedItemId] = useState<string | null>(null); // null이면 아이템 없음
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 현재 캔버스에 보여줄 src (기본은 aquarium_example.png)
  const appliedBgSrc =
    (appliedBgId && bgCandidates.find((b) => b.id === appliedBgId)?.src) ||
    "/images/aquarium_example.png";

  const appliedItemSrc = appliedItemId
    ? itemCandidates.find((i) => i.id === appliedItemId)?.src
    : undefined;

  // APPLY: 현재 탭에 따라 각각 적용
  const handleApply = () => {
    if (tab === "background") {
      if (!selectedBgId) return;
      setAppliedBgId(selectedBgId);
      console.log("APPLY background:", selectedBgId);
    } else if (tab === "items") {
      if (!selectedItemId) return;
      setAppliedItemId(selectedItemId);
      console.log("APPLY item:", selectedItemId);
    }
  };

  const isApplyDisabled =
    (tab === "background" && !selectedBgId) || (tab === "items" && !selectedItemId);

  return (
    <>
      {/* 상단 Export 버튼 (더미) */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => console.log("EXPORT clicked")}
          className="font-vt mb-4 ml-auto rounded-full bg-[#3F3F3F]/80 px-10 py-2 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
        >
          EXPORT
        </button>
      </div>

      {/* 상단 수족관 미리보기 (배경 + 아이템 오버레이) */}
      <div className="flex justify-center">
        <AquariumCanvas width={750} height={440} bgSrc={appliedBgSrc} itemSrc={appliedItemSrc} />
      </div>
      <div className="space-y-3">
        <p className="font-vt text-3xl text-white">Repo contributions: {totalContrib}</p>
      </div>

      {/* 서브 탭 + APPLY */}
      <div className="mt-4 flex items-center justify-between">
        <AquariumTabs tab={tab} onChange={setTab} />
        <button
          onClick={handleApply}
          className={`font-turret rounded-full border px-4 py-2 ${tab === "background" || tab === "items" ? "bg-black text-white" : "bg-white/60 text-black"} ${isApplyDisabled ? "opacity-50" : ""}`}
          disabled={isApplyDisabled}
        >
          APPLY
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <section className="mt-3 rounded-xl bg-white/60 p-4 shadow">
        {tab === "fish" && <AquariumFishTable />}

        {tab === "background" && (
          <AquariumItemGrid
            items={bgCandidates}
            selectedId={selectedBgId}
            onSelect={setSelectedBgId}
          />
        )}

        {tab === "items" && (
          <AquariumItemGrid
            items={itemCandidates}
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
          />
        )}
      </section>
    </>
  );
}
