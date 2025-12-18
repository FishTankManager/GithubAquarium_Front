import { useMemo, useState, useEffect } from "react";
import AquariumCanvas from "./AquariumCanvas";
import { SubTab } from "./AquariumTabs";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";
import AquariumFishTable from "./AquariumFishTable";
import { useViewport } from "@/contexts/useViewport";
import {
  getAquariumBackgrounds,
  applyAquariumBackground,
  type AquariumBackground,
} from "@/apis/aquarium";

type Item = { id: string; name: string; src: string };
type BgItem = { id: string; name: string; src: string };

export default function AquariumSection() {
  const { isMobile, width } = useViewport();
  const useVerticalLayout = isMobile || width < 1400;
  const [tab, setTab] = useState<SubTab>(useVerticalLayout ? "fish" : "background"); // 모바일: fish, 와이드: background
  const totalContrib = 12987; // dummy

  const [bgCandidates, setBgCandidates] = useState<BgItem[]>([]);
  const [loadingBg, setLoadingBg] = useState(true);

  // API에서 배경 목록 가져오기
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        setLoadingBg(true);
        const backgrounds = await getAquariumBackgrounds();

        // AquariumBackground를 BgItem으로 변환
        const convertedBackgrounds: BgItem[] = backgrounds.map((bg: AquariumBackground) => {
          // background_image URL 사용 (없으면 기본 이미지)
          let imageUrl = "/images/background/bg-blank.png";
          if (bg.background.background_image) {
            if (bg.background.background_image.startsWith("http")) {
              imageUrl = bg.background.background_image;
            } else if (bg.background.background_image.startsWith("/")) {
              // 상대 URL인 경우 base URL 추가
              const baseURL = import.meta.env.VITE_API_BASE_URL || "";
              imageUrl = `${baseURL}${bg.background.background_image}`;
            } else {
              imageUrl = bg.background.background_image;
            }
          }

          return {
            id: bg.id.toString(),
            name: bg.background.name,
            src: imageUrl,
          };
        });

        setBgCandidates(convertedBackgrounds);
      } catch (e) {
        console.error("Failed to fetch aquarium backgrounds:", e);
        setBgCandidates([]); // 에러 시 빈 배열
      } finally {
        setLoadingBg(false);
      }
    };

    fetchBackgrounds();
  }, []);

  const itemCandidates: Item[] = useMemo(
    () => [
      { id: "it1", name: "Corals 1", src: "/images/items/coral-1.png" },
      { id: "it2", name: "Corals 2", src: "/images/items/coral-2.png" },
      { id: "it3", name: "Corals 3", src: "/images/items/coral-3.png" },
      { id: "it4", name: "Corals 4", src: "/images/items/coral-4.png" },
      { id: "locked", name: "Locked", src: "/images/items/item-locked.png" },
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

  const handleApply = async () => {
    if (tab === "background" && selectedBgId) {
      try {
        const ownBackgroundId = parseInt(selectedBgId);
        if (isNaN(ownBackgroundId)) {
          setMessage("Invalid background selected.");
          setTimeout(() => setMessage(null), 3000);
          return;
        }

        await applyAquariumBackground(ownBackgroundId);
        setAppliedBgId(selectedBgId);
        setMessage("Background applied successfully!");
        setTimeout(() => setMessage(null), 3000);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to apply background.";
        setMessage(errorMessage);
        setTimeout(() => setMessage(null), 3000);
      }
    } else if (tab === "items" && selectedItemId) {
      if (selectedItemId === "locked") {
        setMessage("This item is locked.");
        setTimeout(() => setMessage(null), 3000); // 3초 후 메시지 자동 제거
        return;
      }
      setAppliedItemId(selectedItemId);
      setMessage(null); // 성공적으로 적용되면 메시지 제거
    }
  };

  // 모바일 뷰일 때 feat/MyPage 브랜치의 레이아웃 사용
  if (useVerticalLayout) {
    return (
      <div className="flex w-full flex-col px-2 sm:px-4">
        {/* 상단 Export 버튼 */}
        <div className="flex items-center justify-between">
          <div />
          <button
            onClick={() => console.log("EXPORT clicked")}
            className="font-vt mb-4 ml-auto rounded-full bg-[#3F3F3F]/80 px-8 py-1.5 text-xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none sm:text-2xl"
          >
            EXPORT
          </button>
        </div>

        {/* 상단 수족관 미리보기 (배경 + 아이템 오버레이) */}
        <div className="flex justify-center">
          <div className="w-full" style={{ aspectRatio: "750/440", maxWidth: "750px" }}>
            <AquariumCanvas
              width="100%"
              height="100%"
              bgSrc={appliedBgSrc}
              itemSrc={appliedItemSrc}
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="space-y-3">
          <p className="font-vt mt-3 text-lg text-white sm:text-2xl">
            Repo contributions: {totalContrib}
          </p>
        </div>

        {/* 서브 탭 + APPLY */}
        <div className="mt-4 mb-4 flex items-center justify-between gap-3">
          <div className="flex gap-4">
            <button
              className={`font-vt rounded-md px-6 py-1 text-lg ${
                tab === "fish" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("fish")}
            >
              FISH
            </button>
            <button
              className={`font-vt rounded-md px-6 py-1 text-lg ${
                tab === "background" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("background")}
            >
              BACKGROUND
            </button>
            <button
              className={`font-vt rounded-md px-6 py-1 text-lg ${
                tab === "items" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("items")}
            >
              ITEMS
            </button>
          </div>

          {tab !== "fish" && (
            <button
              onClick={handleApply}
              className="font-vt rounded-full bg-[#3F3F3F]/80 px-6 py-1.5 text-base whitespace-nowrap text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none sm:text-xl"
            >
              APPLY
            </button>
          )}
        </div>

        {/* 잠겨있는 아이템/배경 선택 시 메시지 표시 영역 */}
        {message && (
          <div className="mb-3 flex justify-center">
            <div className="font-vt rounded-md bg-[#00355B] px-6 py-1 text-base text-white shadow-lg sm:text-lg">
              {message}
            </div>
          </div>
        )}

        {/* 탭 컨텐츠 */}
        <section className="mt-3 rounded-xl">
          {tab === "fish" && (
            <div className="w-full overflow-x-auto">
              <AquariumFishTable />
            </div>
          )}
          {tab === "background" &&
            (loadingBg ? (
              <div className="flex items-center justify-center py-10 text-white">
                배경 목록을 불러오는 중...
              </div>
            ) : (
              <AquariumBackgroundGrid
                items={bgCandidates}
                selectedId={selectedBgId}
                onSelect={setSelectedBgId}
              />
            ))}
          {tab === "items" && (
            <AquariumItemGrid
              items={itemCandidates}
              selectedId={selectedItemId}
              onSelect={setSelectedItemId}
            />
          )}
        </section>
      </div>
    );
  }

  // 와이드 뷰
  return (
    <div className="flex w-full flex-col px-20">
      {/* 상단 공용 툴바: 버튼들 y좌표 통일하기 위해 만들었음 === */}
      <div className="relative mt-5 mb-3">
        {/* 좌: EXPORT 버튼 - 왼쪽 캔버스 영역 오른쪽 끝 */}
        <div className="flex justify-end" style={{ width: "700px" }}>
          <button
            onClick={() => console.log("EXPORT clicked")}
            className="font-vt rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          >
            EXPORT
          </button>
        </div>

        {/* 우: 탭(Background & Items) + APPLY */}
        <div
          className="absolute top-0 right-0 flex items-center justify-between gap-4"
          style={{ width: "500px" }}
        >
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

          {/* 잠겨있는 아이템/배경 선택 시 메시지 표시 영역 */}
          {message && (
            <div className="flex justify-end">
              <div className="font-vt rounded-md bg-[#00355B] px-6 py-1 text-xl text-white shadow-lg">
                {message}
              </div>
            </div>
          )}

          <button
            onClick={handleApply}
            className="font-vt rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          >
            APPLY
          </button>
        </div>
      </div>

      {/* 본문: 캔버스 / 그리드 === */}
      <div className="relative">
        {/* 좌측: AquariumCanvas */}
        <div style={{ width: "700px" }}>
          <AquariumCanvas width={700} height={440} bgSrc={appliedBgSrc} itemSrc={appliedItemSrc} />
          <p className="font-vt mt-3 text-2xl text-white">Repo contributions: {totalContrib}</p>
        </div>

        {/* 우측: 스크롤 영역 */}
        <aside className="absolute top-0 right-0 w-[500px]">
          <div
            className="rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.25)_100%)] p-4 shadow-lg ring-1 ring-white/40 backdrop-blur-md"
            style={{ WebkitBackdropFilter: "blur(6px)" }}
          >
            <div className="max-h-[440px] overflow-y-auto pr-2">
              {tab === "background" &&
                (loadingBg ? (
                  <div className="flex items-center justify-center py-10 text-white">
                    배경 목록을 불러오는 중...
                  </div>
                ) : (
                  <AquariumBackgroundGrid
                    items={bgCandidates}
                    selectedId={selectedBgId}
                    onSelect={setSelectedBgId}
                  />
                ))}
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
      {/* 하단: Fish Table */}
      <div className="mt-10 flex justify-center">
        <div className="relative pb-16" style={{ maxWidth: "1000px", width: "100%" }}>
          <AquariumFishTable />
          <button
            onClick={() => console.log("SAVE & APPLY clicked")}
            className="font-vt absolute top-full right-0 -mt-10 rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          >
            SAVE & APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
