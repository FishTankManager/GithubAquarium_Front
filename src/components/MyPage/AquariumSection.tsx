import { useMemo, useState } from "react";
import AquariumCanvas from "./AquariumCanvas";
import { SubTab } from "./AquariumTabs";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";
import AquariumFishTable from "./AquariumFishTable";

type Item = { id: string; name: string; src: string };
type BgItem = { id: string; name: string; src: string };

export default function AquariumSection() {
  const [tab, setTab] = useState<SubTab>("background"); // 기본 background
  const totalContrib = 12987; // dummy

  const bgCandidates: BgItem[] = useMemo(
    () => [
      { id: "blank", name: "Blank", src: "/images/background/bg-blank.png" },
      { id: "ocean", name: "Pixel Ocean", src: "/images/background/bg-ocean.png" },
      { id: "deep1", name: "Deep Sea 1", src: "/images/background/bg-deep-1.png" },
      { id: "deep2", name: "Deep Sea 2", src: "/images/background/bg-deep-2.png" },
      { id: "locked", name: "Locked", src: "/images/background/bg-locked.png" },
    ],
    [],
  );

  const itemCandidates: Item[] = useMemo(
    () => [
      { id: "it1", name: "Corals 1", src: "/images/items/coral-1.png" },
      { id: "it2", name: "Corals 2", src: "/images/items/coral-2.png" },
      { id: "it3", name: "Corals 3", src: "/images/items/coral-3.png" },
      { id: "it4", name: "Corals 4", src: "/images/items/coral-4.png" },
    ],
    [],
  );

  const [appliedBgId, setAppliedBgId] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  const [appliedItemId, setAppliedItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const appliedBgSrc =
    (appliedBgId && bgCandidates.find((b) => b.id === appliedBgId)?.src) ||
    "/images/aquarium_example.png";

  const appliedItemSrc = appliedItemId
    ? itemCandidates.find((i) => i.id === appliedItemId)?.src
    : undefined;

  const handleApply = () => {
    if (tab === "background" && selectedBgId) {
      if (selectedBgId === "locked") {
        setMessage("This background is locked.");
        setTimeout(() => setMessage(null), 3000); // 3초 후 메시지 자동 제거
        return;
      }
      setAppliedBgId(selectedBgId);
      setMessage(null); // 성공적으로 적용되면 메시지 제거
    } else if (tab === "items" && selectedItemId) {
      setAppliedItemId(selectedItemId);
      setMessage(null); // 성공적으로 적용되면 메시지 제거
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* 상단 공용 툴바: 버튼들 y좌표 통일하기 위해 만들었음 === */}
      <div className="mb-4 grid grid-cols-[750px_minmax(420px,1fr)] items-center gap-6">
        {/* 좌: EXPORT */}
        <div className="justify-self-end">
          <button
            onClick={() => console.log("EXPORT clicked")}
            className="font-vt ml-4 rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          >
            EXPORT
          </button>
        </div>

        {/* 우: 탭(Background & Items) + APPLY */}
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <button
              className={`font-vt rounded-md px-6 py-1 text-xl ${
                tab === "background" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("background")}
            >
              BACKGROUND
            </button>
            <button
              className={`font-vt rounded-md px-6 py-1 text-xl ${
                tab === "items" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("items")}
            >
              ITEMS
            </button>
          </div>

          {/* 잠겨있는 배경 선택 시 메시지 표시 영역 */}
          {message && (
            <div className="flex justify-center">
              <div className="font-vt rounded-md bg-[#00355B] px-6 py-1 text-xl text-white shadow-lg">
                {message}
              </div>
            </div>
          )}

          <button
            onClick={handleApply}
            className="font-vt ml-auto rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          >
            APPLY
          </button>
        </div>
      </div>

      {/* 본문: 캔버스 / 그리드 === */}
      <div className="grid grid-cols-[750px_minmax(420px,1fr)] items-start gap-6">
        {/* 좌측: AquariumCanvas */}
        <div className="justify-self-start">
          <AquariumCanvas width={750} height={440} bgSrc={appliedBgSrc} itemSrc={appliedItemSrc} />
          <p className="font-vt mt-3 text-2xl text-white">Repo contributions: {totalContrib}</p>
        </div>

        {/* 우측: 스크롤 영역만 */}
        <aside className="w-full max-w-[700px]">
          <div
            className="rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.25)_100%)] p-4 shadow-lg ring-1 ring-white/40 backdrop-blur-md"
            style={{ WebkitBackdropFilter: "blur(6px)" }}
          >
            <div className="max-h-[440px] overflow-y-auto pr-2">
              {tab === "background" && (
                <AquariumBackgroundGrid
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
            </div>
          </div>
        </aside>
      </div>
      <div className="mt-10 flex justify-center">
        <AquariumFishTable />
      </div>
    </div>
  );
}
