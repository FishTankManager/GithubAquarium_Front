import React, { useState } from "react";
import { Header, Footer } from "../components";
import { BackgroundItem } from "../components/ShopPage";
import RerollItem from "../components/ShopPage/RerollItem";
import LogoText from "@/components/LogoText";

const ShopPage: React.FC = () => {
  const [showReroll, setShowReroll] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <img
        src="/images/shop/background3.png"
        alt="background"
        className="fixed top-0 left-0 -z-10 h-full w-full object-cover"
      />

      {/* 헤더 */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <Header />
      </div>
      <main className="relative z-10 mx-auto mt-32 w-full max-w-7xl flex-1 px-8 pb-20">
        <div className="flex w-full flex-col items-center justify-center gap-12 md:flex-row md:gap-40">
          {/* 왼쪽 영역 */}
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <LogoText
              text="Shop"
              className="font-sixtyfour text-shadow mb-10 text-center text-6xl text-[#C18A8A] drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] md:mb-0"
            />
            <div className="mt-6 flex h-13 items-center justify-center rounded-xl bg-white px-4 py-2 shadow transition-colors hover:bg-gray-100">
              <img src="/images/shop/starfish.png" alt="star" className="mr-2 h-10 w-10" />
              <span className="font-vt323 text-3xl text-gray-800">1000</span>
            </div>
            <img
              src="/images/shop/tankwithfish.png"
              alt="character"
              className="mt-16 w-80 object-contain"
            />
          </div>

          {/* 오른쪽 영역 */}
          <div className="flex flex-col items-center justify-center md:w-[50%]">
            <div className="mb-6 flex w-full justify-start gap-4">
              <button
                onClick={() => setShowReroll(false)}
                className={`font-vt323 rounded-full px-6 py-3 text-xl text-black shadow transition-all duration-300 ${
                  !showReroll ? "bg-white" : "bg-[#CDE6EF] hover:bg-[#E3CFCF]"
                }`}
              >
                Background
              </button>
              <button
                onClick={() => setShowReroll(true)}
                className={`font-vt323 rounded-full px-6 py-3 text-xl text-black shadow transition-all duration-300 ${
                  showReroll ? "bg-white" : "bg-[#CDE6EF] hover:bg-[#E3CFCF]"
                }`}
              >
                Re-roll
              </button>
            </div>

            <div className="flex w-full justify-center">
              {showReroll ? <RerollItem /> : <BackgroundItem />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
