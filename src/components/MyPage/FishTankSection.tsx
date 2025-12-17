import { useRef, useState, useMemo, useEffect } from "react";
import RepoSelect from "./RepoSelect";
import FishTankCanvas from "./FishTankCanvas";
import GrowthTimeline from "./GrowthTimeline";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";
import { CanvasSize, RepoInfo } from "@/types/aquarium";
import {
  getFishtankBackgrounds,
  getFishtankDetail,
  type FishtankBackground,
} from "@/apis/fishtank";
import { useViewport } from "@/contexts/useViewport";

type Item = { id: string; name: string; src: string };
type BgItem = { id: string; name: string; src: string };
type SubTab = "timeline" | "background" | "items";

export default function FishTankSection() {
  const { isMobile, width } = useViewport();
  const [repo, setRepo] = useState<RepoInfo | null>(null);
  const size: CanvasSize = { width: 700, height: 400 };
  const [contrib, setContrib] = useState<number>(0);

  // 중간 크기 화면에서도 세로 레이아웃 사용 (캔버스 700px + 우측 500px + 패딩 = 약 1400px 필요)
  const useVerticalLayout = isMobile || width < 1400;
  // const [timeline] = useState<TimelineItem[]>([
  //   { id: "t1", at: "25/09/14 00:00", fish: { id: "f1", maturity: "Juvenile" } },
  //   { id: "t0", at: "25/09/12 00:00", fish: { id: "f0", maturity: "Hatchling" } },
  // ]);

  // 배경/아이템 관련 상태
  const [tab, setTab] = useState<SubTab>("background");
  // const [appliedBgId, setAppliedBgId] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  // const [appliedItemId, setAppliedItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bgCandidates, setBgCandidates] = useState<BgItem[]>([]);
  const [loadingBg, setLoadingBg] = useState(true);

  // API에서 배경 목록 가져오기
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        setLoadingBg(true);
        const backgrounds = await getFishtankBackgrounds();

        // FishtankBackground를 BgItem으로 변환
        // svg_template을 data URL로 변환하여 src에 사용
        const convertedBackgrounds: BgItem[] = backgrounds.map((bg: FishtankBackground) => {
          // SVG 템플릿을 data URL로 변환 (encodeURIComponent 사용)
          const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(bg.svg_template)}`;
          return {
            id: bg.id.toString(),
            name: bg.name,
            src: svgDataUrl,
          };
        });

        setBgCandidates(convertedBackgrounds);
      } catch (e) {
        console.error("Failed to fetch fishtank backgrounds:", e);
        setBgCandidates([]); // 에러 시 빈 배열
      } finally {
        setLoadingBg(false);
      }
    };

    fetchBackgrounds();
  }, []);

  // 레포지토리 선택 시 피쉬탱크 상세 정보 가져오기 및 contributions 합산
  useEffect(() => {
    const fetchFishtankDetail = async () => {
      if (!repo) {
        setContrib(0);
        return;
      }

      try {
        console.log("Fetching fishtank detail for repo:", repo.id, repo.fullName);
        const fishtankDetail = await getFishtankDetail(repo.id);
        console.log("Fishtank detail received:", fishtankDetail);

        // contributors의 각 commit_count를 합산
        const totalContributions = fishtankDetail.contributors.reduce(
          (sum, contributor) => sum + contributor.commit_count,
          0,
        );

        console.log("Total contributions:", totalContributions);
        setContrib(totalContributions);
      } catch {
        // 피쉬탱크가 없는 경우 레포지토리 정보의 contributions 사용
        console.warn("Fishtank not found for repo:", repo.id, repo.fullName);
        console.warn("Using repository contributions as fallback:", repo.contributions);
        // 레포지토리 정보의 contributions를 사용 (피쉬탱크가 없어도 해당 레포의 commit 수는 알 수 있음)
        setContrib(repo.contributions || 0);
      }
    };

    fetchFishtankDetail();
  }, [repo]);

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

  // 배경과 아이템은 현재 FishTankCanvas에서 사용하지 않으므로 주석 처리
  // const appliedBgSrc =
  //   (appliedBgId && bgCandidates.find((b) => b.id === appliedBgId)?.src) ||
  //   "/images/aquarium_example.png";

  // const appliedItemSrc = appliedItemId
  //   ? itemCandidates.find((i) => i.id === appliedItemId)?.src
  //   : undefined;

  const handleApply = () => {
    if (tab === "background" && selectedBgId) {
      if (selectedBgId === "locked") {
        setMessage("This background is locked.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }
      // setAppliedBgId(selectedBgId); // 현재 사용하지 않음
      setMessage(null);
    } else if (tab === "items" && selectedItemId) {
      if (selectedItemId === "locked") {
        setMessage("This item is locked.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }
      // setAppliedItemId(selectedItemId); // 현재 사용하지 않음
      setMessage(null);
    }
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  // 모바일 뷰일 때 Aquarium 페이지와 동일한 레이아웃 사용
  if (useVerticalLayout) {
    return (
      <div className="flex w-full flex-col px-2 sm:px-4">
        {/* RepoSelect - 모바일 레이아웃에도 항상 표시 */}
        <div className="font-abeezee mb-5 flex justify-center text-[#B2B2B2]">
          <RepoSelect
            value={repo}
            onChange={(r) => {
              console.log("Repo selected:", r);
              setRepo(r);
            }}
          />
        </div>

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

        {/* 상단 캔버스 미리보기 */}
        <div className="flex justify-center">
          <div className="w-full" style={{ aspectRatio: "700/400", maxWidth: "700px" }}>
            <FishTankCanvas ref={canvasRef} size={size} />
          </div>
        </div>
        <div className="space-y-3">
          <p className="font-vt mt-3 text-lg text-white sm:text-2xl">
            Repo contributions: {contrib}
          </p>
        </div>

        {/* 서브 탭 + APPLY */}
        <div className="relative z-10 mt-4 mb-4 flex w-full items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              className={`font-vt rounded-md px-4 py-1 text-sm sm:px-6 sm:py-1 sm:text-lg ${
                tab === "timeline" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("timeline")}
            >
              GROWTH TIMELINE
            </button>
            <button
              className={`font-vt rounded-md px-4 py-1 text-sm sm:px-6 sm:py-1 sm:text-lg ${
                tab === "background" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("background")}
            >
              BACKGROUND
            </button>
            <button
              className={`font-vt rounded-md px-4 py-1 text-sm sm:px-6 sm:py-1 sm:text-lg ${
                tab === "items" ? "bg-[#D7B9B9] text-black" : "bg-[#C7D6FF]/80 text-black/80"
              }`}
              onClick={() => setTab("items")}
            >
              ITEMS
            </button>
          </div>

          {tab !== "timeline" && (
            <button
              onClick={handleApply}
              className="font-vt flex-shrink-0 rounded-full bg-[#3F3F3F]/80 px-4 py-1.5 text-xs whitespace-nowrap text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none sm:px-6 sm:text-base"
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
          {tab === "timeline" && (
            <div className="w-full">
              <GrowthTimeline />
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
      {/* RepoSelect */}
      <div className="font-abeezee mb-10 flex justify-center text-[#B2B2B2]">
        <RepoSelect
          value={repo}
          onChange={(r) => {
            console.log("Repo selected:", r);
            setRepo(r);
          }}
        />
      </div>

      {/* 상단 공용 툴바: CanvasControls + EXPORT + 탭 + APPLY */}
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

      {/* 본문: 캔버스 / 그리드 */}
      <div className="relative">
        {/* 좌측: FishTankCanvas */}
        <div style={{ width: "700px" }}>
          <FishTankCanvas ref={canvasRef} size={size} />
          <p className="font-vt mt-3 text-2xl text-white">Repo contributions: {contrib}</p>
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

      {/* GrowthTimeline */}
      <div className="mt-10 flex justify-center">
        <GrowthTimeline repoId={repo?.id || null} />
      </div>
    </div>
  );
}
