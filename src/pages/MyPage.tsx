import { useState } from "react";
import { Footer, Header } from "@/components";
import Titles from "@/components/MyPage/Titles";
import FishTankSection from "@/components/MyPage/FishTankSection";
import FishTankSectionMobile from "@/components/MyPage/FishTankSectionMobile";
import AquariumSection from "@/components/MyPage/AquariumSection";
import BottomLines from "@/components/MyPage/BottomLines";
import { useViewport } from "@/contexts/useViewport";

export default function MyPage() {
  const [active, setActive] = useState<"fishtank" | "aquarium">("fishtank");
  const { isMobile, width } = useViewport();

  // 1400px 미만일 때도 모바일 뷰 사용 (FishTankSection의 useVerticalLayout과 동일한 기준)
  const useMobileView = isMobile || width < 1400;

  return (
    <div className="mb-12 flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#4A68AF]">
      <Header />

      <main
        className={`mx-auto w-full flex-1 px-2 py-4 text-black sm:px-4 sm:py-8 ${useMobileView ? "max-w-full" : "max-w-[1500px]"}`}
      >
        <div className="mb-4 flex items-center justify-center sm:mb-6">
          <Titles active={active} onChange={setActive} />
        </div>

        {active === "fishtank" && (useMobileView ? <FishTankSectionMobile /> : <FishTankSection />)}
        {active === "aquarium" && <AquariumSection />}
      </main>

      <section className="relative h-[400px] w-full bg-[url('/images/mypage-background.png')] bg-cover bg-bottom bg-no-repeat">
        <div className="relative z-10 mx-auto flex h-full max-w-[980px] items-center justify-center">
          <BottomLines />
        </div>
      </section>

      <Footer />
    </div>
  );
}
