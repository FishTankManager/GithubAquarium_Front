import { useState, useEffect } from "react";
import { Footer, Header } from "@/components";
import Titles from "@/components/MyPage/Titles";
import FishTankSection from "@/components/MyPage/FishTankSection";
import AquariumSection from "@/components/MyPage/AquariumSection";
import BottomLines from "@/components/MyPage/BottomLines";

export default function MyPage() {
  const [active, setActive] = useState<"fishtank" | "aquarium">("fishtank");

  // MyPage 마운트 시 body 배경색 변경
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#4A68AF";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between overflow-x-hidden bg-[#4A68AF]">
      <Header />

      <main className="mx-auto w-full flex-1 px-2 py-4 text-black sm:px-4 sm:py-8">
        <div className="mb-4 flex items-center justify-center sm:mb-6">
          <Titles active={active} onChange={setActive} />
        </div>

        {active === "fishtank" && <FishTankSection />}
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
