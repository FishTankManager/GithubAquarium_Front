import { useState } from "react";
import { Footer, Header } from "@/components";
import Titles from "@/components/MyPage/Titles";
import FishTankSection from "@/components/MyPage/FishTankSection";
import AquariumSection from "@/components/MyPage/AquariumSection";

export default function MyPage() {
  // 상단 버튼 상태: fishtank | aquarium
  const [active, setActive] = useState<"fishtank" | "aquarium">("fishtank");

  return (
    // 전체 레이아웃: 헤더/푸터 고정 + 본문 스크롤
    <div className="flex min-h-screen flex-col justify-between bg-sky-300">
      <Header />

      {/* 본문 컨테이너 */}
      <main className="mx-auto w-full max-w-[980px] flex-1 px-4 py-8 text-black">
        {/* 상단 타이틀 + 탭 버튼 */}
        <div className="mb-6 flex items-center justify-start">
          <Titles active={active} onChange={setActive} />
        </div>

        {/* 탭에 따라 하위 섹션만 교체 렌더링 */}
        {active === "fishtank" && <FishTankSection />}
        {active === "aquarium" && <AquariumSection />}
      </main>

      <Footer />
    </div>
  );
}
