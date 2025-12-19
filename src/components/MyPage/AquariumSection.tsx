import { useMemo, useState, useEffect } from "react";
import { AquariumPreview } from "@/components";
import { SubTab } from "./AquariumTabs";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";
import AquariumFishTable from "./AquariumFishTable";
import { useViewport } from "@/contexts/useViewport";
import {
  getMyBackgrounds,
  applyAquariumBackground,
  getAquariumDetail,
  type MyBackground,
  type AquariumDetail,
} from "@/apis/aquarium";
import type { Fish } from "@/types/fish";
// 배경 이미지 import
import bg1 from "@/assets/png/Backgrounds/bg-deep-1.png";
import bg2 from "@/assets/png/Backgrounds/bg-deep-2.png";
import bg3 from "@/assets/png/Backgrounds/bg-ocean.png";

type Item = { id: string; name: string; src: string };
type BgItem = { id: string; name: string; src: string };

// 로컬 assets 배경 파일 매핑 (id, code, name 기반)
const localBackgroundMap: Record<string, string> = {
  // id 기반
  "1": bg1,
  "2": bg2,
  "3": bg3,
  // code 기반
  "bg-1": bg1,
  "bg-2": bg2,
  "bg-3": bg3,
  // name 기반 (혹시 모를 경우 대비)
  "bg-1.png": bg1,
  "bg-2.png": bg2,
  "bg-3.png": bg3,
};

export default function AquariumSection() {
  const { isMobile, width } = useViewport();
  const useVerticalLayout = isMobile || width < 1400;
  const [tab, setTab] = useState<SubTab>(useVerticalLayout ? "fish" : "background"); // 모바일: fish, 와이드: background
  const [totalContrib, setTotalContrib] = useState<number>(0);
  const [aquariumDetail, setAquariumDetail] = useState<AquariumDetail | null>(null);
  const [loadingAquarium, setLoadingAquarium] = useState(true);

  const [bgCandidates, setBgCandidates] = useState<BgItem[]>([]);
  const [loadingBg, setLoadingBg] = useState(true);
  const [backgroundsData, setBackgroundsData] = useState<MyBackground[]>([]);

  // API에서 배경 목록 가져오기
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        setLoadingBg(true);
        const backgrounds = await getMyBackgrounds();

        // MyBackground를 BgItem으로 변환
        // 로컬 assets의 배경 파일을 우선 사용 (404 에러 방지)
        const convertedBackgrounds: BgItem[] = backgrounds.map((bg: MyBackground) => {
          let imageSrc: string;

          // 로컬 assets에서 배경 찾기 (background_id 기반)
          const localBg = localBackgroundMap[bg.background_id.toString()];

          if (localBg) {
            // 로컬 assets의 배경 파일 사용 (우선순위 1)
            imageSrc = localBg;
          } else if (bg.image_url) {
            // API에서 제공한 image_url 사용 (우선순위 2)
            imageSrc = bg.image_url;
          } else {
            // 기본 이미지
            imageSrc = "/images/aquarium_example.png";
          }

          console.log(`Background ${bg.background_id} (name: ${bg.name}): using ${imageSrc}`);

          return {
            id: bg.background_id.toString(), // Background의 id 사용
            name: bg.name,
            src: imageSrc,
          };
        });

        setBgCandidates(convertedBackgrounds);
        setBackgroundsData(backgrounds); // 원본 데이터 저장 (applyAquariumBackground에서 사용)
      } catch (e) {
        console.error("Failed to fetch backgrounds:", e);
        setBgCandidates([]); // 에러 시 빈 배열
        setBackgroundsData([]);
      } finally {
        setLoadingBg(false);
      }
    };

    fetchBackgrounds();
  }, []);

  // API에서 아쿠아리움 상세 정보 가져오기
  useEffect(() => {
    const fetchAquariumDetail = async () => {
      try {
        setLoadingAquarium(true);
        const detail = await getAquariumDetail();
        setAquariumDetail(detail);

        // fish_list의 각 commit_count를 합산
        const totalContributions = detail.fish_list.reduce(
          (sum, fish) => sum + fish.commit_count,
          0,
        );
        setTotalContrib(totalContributions);
      } catch (e) {
        console.error("Failed to fetch aquarium detail:", e);
        setAquariumDetail(null);
        setTotalContrib(0);
      } finally {
        setLoadingAquarium(false);
      }
    };

    fetchAquariumDetail();
  }, []);

  // background_name을 AquariumPreview가 기대하는 형식으로 변환
  // 예: "bg-deep-1" → "Bg Deep 1", "bg-ocean" → "Bg Ocean"
  const convertBackgroundName = (name: string | null | undefined): string | undefined => {
    if (!name || name === "기본 배경") return undefined;

    // 백엔드에서 오는 형식: "bg-deep-1", "bg-deep-2", "bg-ocean" 등
    // AquariumPreview가 기대하는 형식: "Bg Deep 1", "Bg Deep 2", "Bg Ocean"
    const nameMap: Record<string, string> = {
      "bg-deep-1": "Bg Deep 1",
      "bg-deep-2": "Bg Deep 2",
      "bg-ocean": "Bg Ocean",
      "Bg Deep 1": "Bg Deep 1",
      "Bg Deep 2": "Bg Deep 2",
      "Bg Ocean": "Bg Ocean",
    };

    return nameMap[name] || name;
  };

  // AquariumFish를 Fish로 변환
  const convertToFishList = (aquariumFish: AquariumDetail["fish_list"]): Fish[] => {
    return aquariumFish.map((fish) => ({
      id: fish.id,
      name: fish.name,
      group_code: fish.group_code,
      maturity: fish.maturity,
      repository_name: fish.repository_name,
      commit_count: fish.commit_count,
      unlocked_at: fish.unlocked_at,
      is_visible_in_aquarium: fish.is_visible_in_aquarium,
      is_visible_in_fishtank: fish.is_visible_in_fishtank,
      // github_username은 optional이므로 없어도 됨
    }));
  };

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

  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleApply = async () => {
    if (tab === "background" && selectedBgId) {
      if (selectedBgId === "locked") {
        setMessage("This background is locked.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      try {
        // selectedBgId는 Background.id이므로, backgroundsData에서 background_id로 매칭
        const background = backgroundsData.find(
          (bg) => bg.background_id.toString() === selectedBgId,
        );
        if (!background) {
          console.error("Background not found:", {
            selectedBgId,
            availableIds: backgroundsData.map((bg) => ({
              backgroundId: bg.background_id,
            })),
          });
          setMessage("Background not found.");
          setTimeout(() => setMessage(null), 3000);
          return;
        }

        // applyAquariumBackground는 OwnBackground.id를 요구하므로,
        // background_id로 OwnBackground를 찾아야 하지만,
        // 현재 API 응답에는 OwnBackground.id가 없으므로
        // background_id를 직접 사용 (API가 내부에서 처리하도록)
        // TODO: API가 background_id를 받도록 수정하거나, OwnBackground.id를 응답에 포함
        await applyAquariumBackground(background.background_id);
        setMessage("배경이 성공적으로 적용되었습니다!");
        setTimeout(() => setMessage(null), 3000);

        // 배경 적용 후 아쿠아리움 detail 다시 가져오기
        try {
          const updatedDetail = await getAquariumDetail();
          setAquariumDetail(updatedDetail);
        } catch (e) {
          console.warn("Failed to refresh aquarium detail after apply:", e);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "배경 적용에 실패했습니다.";
        setMessage(errorMessage);
        setTimeout(() => setMessage(null), 3000);
      }
    } else if (tab === "items" && selectedItemId) {
      if (selectedItemId === "locked") {
        setMessage("This item is locked.");
        setTimeout(() => setMessage(null), 3000); // 3초 후 메시지 자동 제거
        return;
      }
      // TODO: 아이템 적용 기능 구현
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

        {/* 상단 수족관 미리보기 */}
        <div className="flex justify-center">
          <div className="w-full" style={{ aspectRatio: "750/440", maxWidth: "750px" }}>
            {loadingAquarium ? (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sky-200">
                <p className="font-vt text-xl text-gray-600">로딩 중...</p>
              </div>
            ) : aquariumDetail ? (
              <AquariumPreview
                width="100%"
                height="100%"
                className="relative overflow-hidden rounded-2xl shadow-lg"
                backgroundName={convertBackgroundName(aquariumDetail.background_name)}
                fishList={convertToFishList(aquariumDetail.fish_list)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sky-200">
                <p className="font-vt text-xl text-gray-600">
                  아쿠아리움 정보를 불러올 수 없습니다
                </p>
              </div>
            )}
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
              <AquariumFishTable
                fishList={
                  aquariumDetail?.fish_list ? convertToFishList(aquariumDetail.fish_list) : []
                }
              />
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
        {/* 좌측: AquariumPreview */}
        <div style={{ width: "700px" }}>
          {loadingAquarium ? (
            <div className="flex h-[440px] w-full items-center justify-center rounded-2xl bg-sky-200">
              <p className="font-vt text-2xl text-gray-600">로딩 중...</p>
            </div>
          ) : aquariumDetail ? (
            <AquariumPreview
              width={700}
              height={440}
              className="relative overflow-hidden rounded-2xl shadow-lg"
              backgroundName={convertBackgroundName(aquariumDetail.background_name)}
              fishList={convertToFishList(aquariumDetail.fish_list)}
            />
          ) : (
            <div className="flex h-[440px] w-full items-center justify-center rounded-2xl bg-sky-200">
              <p className="font-vt text-2xl text-gray-600">아쿠아리움 정보를 불러올 수 없습니다</p>
            </div>
          )}
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
          <AquariumFishTable
            fishList={aquariumDetail?.fish_list ? convertToFishList(aquariumDetail.fish_list) : []}
          />
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
