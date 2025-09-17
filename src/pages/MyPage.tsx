import { useState } from "react";
import { Footer, Header } from "@/components";
import Titles from "@/components/MyPage/Titles";
import FishTankSection from "@/components/MyPage/FishTankSection";
import AquariumSection from "@/components/MyPage/AquariumSection";
import BottomLines from "@/components/MyPage/BottomLines";

export default function MyPage() {
  const [active, setActive] = useState<"fishtank" | "aquarium">("fishtank");

  return (
    <div className="mb-12 flex min-h-screen flex-col justify-between bg-[#4A68AF]">
      <Header />

      <main className="mx-auto w-full max-w-[980px] flex-1 px-4 py-8 text-black">
        <div className="mb-6 flex items-center justify-center">
          <Titles active={active} onChange={setActive} />
        </div>

        {active === "fishtank" && <FishTankSection />}
        {active === "aquarium" && <AquariumSection />}
      </main>

      {/* Footer 바로 위 영역 */}
      <div
        className="h-[300px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mypage-background.png')" }}
      >
        <div className="mx-auto flex h-full max-w-[980px] items-center justify-center">
          <BottomLines />
        </div>
      </div>

      <Footer />
    </div>
  );
}
