import { useState, useMemo, useEffect } from "react";
import RepoSelect from "./RepoSelect";
import { FishTankPreview } from "@/components";
import GrowthTimeline from "./GrowthTimeline";
import AquariumBackgroundGrid from "./AquariumBackgroundGrid";
import AquariumItemGrid from "./AquariumItemGrid";
import { RepoInfo } from "@/types/aquarium";
import {
  getMyBackgrounds,
  getFishtankDetail,
  applyFishtankBackground,
  type MyBackground,
} from "@/apis/fishtank";
import { useViewport } from "@/contexts/useViewport";
import type { Fish } from "@/types/fish";
// 배경 이미지 import
import bg1 from "@/assets/png/Backgrounds/bg-deep-1.png";
import bg2 from "@/assets/png/Backgrounds/bg-deep-2.png";
import bg3 from "@/assets/png/Backgrounds/bg-ocean.png";

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

type Item = { id: string; name: string; src: string };
type BgItem = { id: string; name: string; src: string };
type SubTab = "timeline" | "background" | "items";

export default function FishTankSection() {
  const { isMobile, width } = useViewport();
  const [repo, setRepo] = useState<RepoInfo | null>(null);
  const [contrib, setContrib] = useState<number>(0);
  const [contributionFishes, setContributionFishes] = useState<
    Array<{
      id: number;
      username: string;
      commit_count: number;
      species: {
        id: number;
        name: string;
        maturity: number;
        required_commits: number;
        svg_template: string;
        group_code: string;
      };
    }>
  >([]);
  const [fishtankDetail, setFishtankDetail] = useState<{
    repository_full_name: string;
    background_name: string;
    fish_list: Fish[];
  } | null>(null);

  // 중간 크기 화면에서도 세로 레이아웃 사용 (캔버스 700px + 우측 500px + 패딩 = 약 1400px 필요)
  const useVerticalLayout = isMobile || width < 1400;
  // const [timeline] = useState<TimelineItem[]>([
  //   { id: "t1", at: "25/09/14 00:00", fish: { id: "f1", maturity: "Juvenile" } },
  //   { id: "t0", at: "25/09/12 00:00", fish: { id: "f0", maturity: "Hatchling" } },
  // ]);

  // 배경/아이템 관련 상태
  const [tab, setTab] = useState<SubTab>("background");
  const [selectedBgId, setSelectedBgId] = useState<string | null>(null);
  // const [appliedItemId, setAppliedItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
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
            imageSrc = "/images/fishtank_example.png";
          }

          console.log(`Background ${bg.background_id} (name: ${bg.name}): using ${imageSrc}`);

          return {
            id: bg.background_id.toString(), // Background의 id 사용
            name: bg.name,
            src: imageSrc,
          };
        });

        setBgCandidates(convertedBackgrounds);
        setBackgroundsData(backgrounds); // 원본 데이터 저장 (applyFishtankBackground에서 사용)
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

  // 레포지토리 선택 시 피쉬탱크 상세 정보 가져오기 및 contributions 합산, 배경 로드
  useEffect(() => {
    const fetchFishtankData = async () => {
      if (!repo) {
        setContrib(0);
        setFishtankDetail(null);
        return;
      }

      try {
        console.log("Fetching fishtank detail for repo:", repo.id, repo.fullName);
        // repo.id는 string이므로 숫자로 변환
        const repoIdNum = parseInt(repo.id, 10);
        if (isNaN(repoIdNum)) {
          console.error("Invalid repo ID:", repo.id);
          throw new Error(`Invalid repository ID: ${repo.id}`);
        }
        const fishtankDetail = await getFishtankDetail(repo.id);
        console.log("Fishtank detail received:", fishtankDetail);

        // fishtankDetail state에 저장
        setFishtankDetail({
          repository_full_name: fishtankDetail.repository_full_name,
          background_name: fishtankDetail.background_name,
          fish_list: fishtankDetail.fish_list,
        });

        // fish_list의 각 commit_count를 합산
        const totalContributions = fishtankDetail.fish_list.reduce(
          (sum, fish) => sum + fish.commit_count,
          0,
        );

        console.log("Total contributions:", totalContributions);
        setContrib(totalContributions);

        // ContributionFish 데이터 추출 (fish_list를 기반으로)
        // fish_list는 이미 is_visible_in_fishtank=true인 것만 반환되므로 필터링 불필요
        const fishes = fishtankDetail.fish_list.map((fish) => ({
          id: fish.id,
          username: fish.repository_name, // repository_name을 username으로 사용
          commit_count: fish.commit_count,
          species: {
            id: fish.id,
            name: fish.name,
            maturity: fish.maturity,
            required_commits: 0, // API 응답에 없으므로 기본값
            svg_template: "", // API 응답에 없으므로 빈 문자열 (나중에 로컬에서 로드)
            group_code: fish.group_code,
          },
        }));
        setContributionFishes(fishes);
        console.log("ContributionFishes:", fishes);
      } catch (e) {
        // 피쉬탱크가 없는 경우 레포지토리 정보의 contributions 사용
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.warn(
          "Fishtank not found for repo:",
          repo.id,
          repo.fullName,
          "Error:",
          errorMessage,
        );
        console.warn("Using repository contributions as fallback:", repo.contributions);
        // 레포지토리 정보의 contributions를 사용 (피쉬탱크가 없어도 해당 레포의 commit 수는 알 수 있음)
        setContrib(repo.contributions || 0);
        setContributionFishes([]);
        setFishtankDetail(null);
      }
    };

    fetchFishtankData();
  }, [repo, bgCandidates]);

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

  // background_name을 FishTankPreview가 기대하는 형식으로 변환
  // 예: "bg-deep-1" → "Bg Deep 1", "bg-ocean" → "Bg Ocean"
  const convertBackgroundName = (name: string | null | undefined): string | undefined => {
    if (!name || name === "기본 배경") return undefined;

    // 백엔드에서 오는 형식: "bg-deep-1", "bg-deep-2", "bg-ocean" 등
    // FishTankPreview가 기대하는 형식: "Bg Deep 1", "Bg Deep 2", "Bg Ocean"
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

  const handleApply = async () => {
    if (tab === "background" && selectedBgId) {
      if (selectedBgId === "locked") {
        setMessage("This background is locked.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      if (!repo) {
        setMessage("레포지토리를 먼저 선택해주세요.");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      try {
        const backgroundId = parseInt(selectedBgId);
        if (isNaN(backgroundId)) {
          setMessage("Invalid background selected.");
          setTimeout(() => setMessage(null), 3000);
          return;
        }

        // Background의 id를 찾기 위해 backgroundsData에서 매칭
        const background = backgroundsData.find(
          (bg) => bg.background_id.toString() === selectedBgId,
        );
        if (!background) {
          setMessage("Background not found.");
          setTimeout(() => setMessage(null), 3000);
          return;
        }

        // API는 Background의 id를 요구함
        await applyFishtankBackground(repo.id, background.background_id);
        setMessage("배경이 성공적으로 적용되었습니다!");
        setTimeout(() => setMessage(null), 3000);

        // 배경 적용 후 fishtank detail 다시 가져오기
        try {
          const updatedDetail = await getFishtankDetail(repo.id);
          // fishtankDetail state 업데이트
          setFishtankDetail({
            repository_full_name: updatedDetail.repository_full_name,
            background_name: updatedDetail.background_name,
            fish_list: updatedDetail.fish_list,
          });
        } catch (e) {
          console.warn("Failed to refresh background after apply:", e);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "배경 적용에 실패했습니다.";
        setMessage(errorMessage);
        setTimeout(() => setMessage(null), 3000);
      }
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
            {fishtankDetail ? (
              <FishTankPreview
                width="100%"
                height="100%"
                className="relative overflow-hidden rounded-2xl shadow-lg"
                repositoryName={fishtankDetail.repository_full_name}
                backgroundName={convertBackgroundName(fishtankDetail.background_name)}
                fishList={fishtankDetail.fish_list}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-sky-200">
                <p className="font-vt text-xl text-gray-600">레포지토리를 선택해주세요</p>
              </div>
            )}
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
            <div className="relative">
              {/* 메시지 표시 영역 - APPLY 버튼 위에 absolute로 고정 */}
              {message && (
                <div className="font-vt absolute right-0 bottom-full z-10 mb-2 rounded-md bg-[#00355B] px-3 py-1 text-xs whitespace-nowrap text-white shadow-lg sm:text-sm">
                  {message}
                </div>
              )}
              <button
                onClick={handleApply}
                className="font-vt flex-shrink-0 rounded-full bg-[#3F3F3F]/80 px-4 py-1.5 text-xs whitespace-nowrap text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none sm:px-6 sm:text-base"
              >
                APPLY
              </button>
            </div>
          )}
        </div>

        {/* 탭 컨텐츠 */}
        <section className="mt-3 rounded-xl">
          {tab === "timeline" && (
            <div className="w-full">
              <GrowthTimeline repoId={repo?.id || null} contributionFishes={contributionFishes} />
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

          <div className="relative">
            {/* 메시지 표시 영역 - APPLY 버튼 위에 absolute로 고정 */}
            {message && (
              <div className="font-vt absolute right-0 bottom-full z-10 mb-2 rounded-md bg-[#00355B] px-3 py-1 text-sm whitespace-nowrap text-white shadow-lg">
                {message}
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
      </div>

      {/* 본문: 캔버스 / 그리드 */}
      <div className="relative">
        {/* 좌측: FishTankPreview */}
        <div style={{ width: "700px" }}>
          {fishtankDetail ? (
            <FishTankPreview
              width={700}
              height={400}
              className="relative overflow-hidden rounded-2xl shadow-lg"
              repositoryName={fishtankDetail.repository_full_name}
              backgroundName={convertBackgroundName(fishtankDetail.background_name)}
              fishList={fishtankDetail.fish_list}
            />
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl bg-sky-200">
              <p className="font-vt text-2xl text-gray-600">레포지토리를 선택해주세요</p>
            </div>
          )}
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
        <GrowthTimeline repoId={repo?.id || null} contributionFishes={contributionFishes} />
      </div>
    </div>
  );
}
