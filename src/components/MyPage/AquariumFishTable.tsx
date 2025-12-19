import { useState, useEffect } from "react";
import FishIcon from "./FishIcon";
import { Maturity } from "@/types/aquarium";
import { useViewport } from "@/contexts/useViewport";
import type { Fish } from "@/types/fish";
import { getFishSpriteSvgByGroupAndMaturity } from "@/assets/svg/FishSprites/map";

interface AquariumFishTableProps {
  fishList?: Fish[]; // aquarium preview에 표시되는 물고기 목록
  onSave?: (fishSettings: Array<{ id: number; visible: boolean }>) => Promise<void>; // SAVE & APPLY 버튼 클릭 시 호출
  onSelectionChange?: (fishId: number, visible: boolean) => void; // 토글 변경 시 호출 (preview 즉시 반영용)
}

// maturity 숫자를 Maturity 문자열로 변환
const getMaturityFromNumber = (maturity: number): Maturity => {
  const maturityMap: Record<number, Maturity> = {
    1: "Hatchling",
    2: "Juvenile",
    3: "Youngling",
    4: "Adult",
    5: "Advanced",
    6: "Master",
  };
  return maturityMap[maturity] || "Hatchling";
};

export default function AquariumFishTable({
  fishList = [],
  onSave,
  onSelectionChange,
}: AquariumFishTableProps) {
  const { isMobile, width } = useViewport();

  // 모든 물고기를 표시 (is_visible_in_aquarium과 관계없이)
  const rows = fishList.map((fish) => ({
    id: fish.id.toString(),
    fishId: fish.id, // API 호출용 실제 ID
    maturity: getMaturityFromNumber(fish.maturity),
    repo: fish.repository_name,
    contribution: fish.commit_count,
    group_code: fish.group_code,
    maturityNumber: fish.maturity,
    isVisible: fish.is_visible_in_aquarium, // 초기 선택 상태를 위해 저장
  }));

  // 초기 상태: is_visible_in_aquarium이 true인 물고기만 선택된 상태
  const [selectedFish, setSelectedFish] = useState<Set<string>>(new Set());

  // rows가 변경될 때마다 초기 선택 상태 업데이트 (is_visible_in_aquarium이 true인 것만 선택)
  useEffect(() => {
    const visibleIds = rows.filter((r) => r.isVisible).map((r) => r.id);
    setSelectedFish(new Set(visibleIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  const toggleFishSelection = (fishId: string) => {
    setSelectedFish((prev) => {
      const newSet = new Set(prev);
      const wasSelected = newSet.has(fishId);
      if (wasSelected) {
        newSet.delete(fishId);
      } else {
        newSet.add(fishId);
      }
      // 부모 컴포넌트에 토글 변경 알림 (preview 즉시 반영용)
      if (onSelectionChange) {
        const fish = rows.find((r) => r.id === fishId);
        if (fish) {
          onSelectionChange(fish.fishId, !wasSelected);
        }
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      // 모든 물고기에 대한 visibility 설정 생성
      const fishSettings = rows.map((r) => ({
        id: r.fishId,
        visible: selectedFish.has(r.id),
      }));

      console.log("Saving fish visibility settings:", fishSettings);
      await onSave(fishSettings);
      console.log("Fish visibility settings saved successfully");
    } catch (error) {
      console.error("Failed to save fish visibility:", error);
      // 에러는 부모 컴포넌트에서 처리하도록 throw
      throw error;
    }
  };

  // 중간 크기 화면에서도 가로 스크롤 사용 (약 1000px 이하)
  const useScrollableLayout = isMobile || width < 1000;

  // 모바일 또는 중간 크기에서는 가로 스크롤 가능한 레이아웃
  if (useScrollableLayout) {
    return (
      <section className="w-full max-w-full">
        {/* 서리(유리) 카드 - 가로 스크롤 가능 */}
        <div className="overflow-x-auto">
          <div
            className="rounded-2xl p-5 shadow-lg ring-1 ring-white/40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
              backdropFilter: "blur(6px)",
              minWidth: "800px",
            }}
          >
            {/* 헤더 행 */}
            <div className="grid grid-cols-[80px_100px_110px_200px_140px] items-center gap-2 pb-3">
              <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">SELECT</h4>
              <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">FISH</h4>
              <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">
                MATURITY
              </h4>
              <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">REPO</h4>
              <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">
                CONTRIBUTION
              </h4>
            </div>

            {/* 목록 */}
            <div className="space-y-4">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[80px_100px_110px_200px_140px] items-center gap-2 py-2"
                >
                  {/* SELECT 토글 버튼 */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleFishSelection(r.id)}
                      className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
                        selectedFish.has(r.id) ? "bg-[#5A2B55]" : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                          selectedFish.has(r.id) ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* FISH 썸네일 */}
                  <div className="justify-self-center">
                    <div className="relative flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg bg-white/25 shadow-inner transition-transform duration-300">
                      {r.group_code && r.maturityNumber ? (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{
                            transform: "scale(0.8)",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: getFishSpriteSvgByGroupAndMaturity(
                              r.group_code,
                              r.maturityNumber,
                            ),
                          }}
                        >
                          {/* SVG가 여기에 삽입됨 */}
                        </div>
                      ) : (
                        <FishIcon maturity={r.maturity} />
                      )}
                    </div>
                  </div>

                  {/* MATURITY */}
                  <div className="font-vt text-center text-base break-words text-white">
                    {r.maturity}
                  </div>

                  {/* REPO 링크 느낌 */}
                  <div className="font-vt min-w-0 text-center text-base text-white/90">
                    <button
                      className="block w-full truncate underline decoration-white/60 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                      onClick={() => console.log("go repo:", r.repo)}
                      title={r.repo}
                    >
                      {r.repo}
                    </button>
                  </div>

                  {/* CONTRIBUTION */}
                  <div className="font-vt text-center text-base break-words text-white">
                    {r.contribution} commits
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* SAVE & APPLY 버튼 */}
          {onSave && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="font-vt rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
              >
                SAVE & APPLY
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // 데스크톱 버전
  return (
    <section className="w-full max-w-[1000px]">
      {/* 서리(유리) 카드 */}
      <div
        className="rounded-2xl p-6 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 헤더 행 */}
        <div className="grid grid-cols-[100px_120px_120px_1fr_180px] items-center gap-4 pb-4">
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">SELECT</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">FISH</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">MATURITY</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">REPO</h4>
          <h4 className="font-vt text-center text-2xl tracking-wider text-[#5A2B55]">
            CONTRIBUTION
          </h4>
        </div>

        {/* 목록 */}
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[100px_120px_120px_1fr_180px] items-center gap-4 py-2"
            >
              {/* SELECT 토글 버튼 */}
              <div className="flex justify-center">
                <button
                  onClick={() => toggleFishSelection(r.id)}
                  className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${
                    selectedFish.has(r.id) ? "bg-[#5A2B55]" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      selectedFish.has(r.id) ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* FISH 썸네일 */}
              <div className="justify-self-center">
                <div className="relative flex h-20 w-28 items-center justify-center overflow-hidden rounded-xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  {r.group_code && r.maturityNumber ? (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{
                        transform: "scale(0.85)",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: getFishSpriteSvgByGroupAndMaturity(r.group_code, r.maturityNumber),
                      }}
                    >
                      {/* SVG가 여기에 삽입됨 */}
                    </div>
                  ) : (
                    <FishIcon maturity={r.maturity} />
                  )}
                </div>
              </div>

              {/* MATURITY */}
              <div className="font-vt text-center text-xl text-white">{r.maturity}</div>

              {/* REPO 링크 느낌 */}
              <div className="font-vt min-w-0 text-center text-xl text-white/90">
                <button
                  className="block w-full truncate underline decoration-white/60 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
                  onClick={() => console.log("go repo:", r.repo)}
                  title={r.repo}
                >
                  {r.repo}
                </button>
              </div>

              {/* CONTRIBUTION */}
              <div className="font-vt text-center text-xl text-white">{r.contribution} commits</div>
            </div>
          ))}
        </div>
        {/* SAVE & APPLY 버튼 */}
        {onSave && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="font-vt rounded-full bg-[#3F3F3F]/80 px-8 py-1 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
            >
              SAVE & APPLY
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
