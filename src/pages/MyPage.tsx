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

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-8 text-black">
        <div className="mb-6 flex items-center justify-center">
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
