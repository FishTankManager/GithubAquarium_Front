import React, { useState } from "react";
import { Header, Footer } from "../components";
import { ShopItem } from "../components/ShopPage";
import RerollItem from "../components/ShopPage/RerollItem";
import LogoText from "@/components/LogoText";

const ShopPage: React.FC = () => {
  const [showReroll, setShowReroll] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#E3F6FF]">
      {/* 헤더 고정 */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <Header />
      </div>
      {/* 배경 이미지 */}
      <img
        src="/images/shop/background3.png"
        alt="background"
        className="absolute top-0 left-0 z-0 h-full w-full object-cover"
      />
      {/* 메인 컨텐츠 */}
      <main className="relative z-10 mx-auto mt-20 max-w-7xl px-8 pt-18 pb-20">
        <div className="flex w-full flex-col items-center justify-center gap-40 md:flex-row">
          {/* 왼쪽: 타이틀 + 유저 정보 */}
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <LogoText
              text="Shop"
              className="font-sixtyfour text-shadow mb-10 text-center text-6xl text-[#C18A8A] md:mb-0"
            />
            <div className="mt-6 flex h-13 items-center justify-center rounded-xl bg-white px-2 py-2 shadow hover:bg-gray-100">
              <img src="/images/shop/starfish.png" alt="star" className="mr-2 h-10 w-10" />
              <span className="font-vt323 text-3xl text-gray-800">1000</span>
            </div>
            <img src="/images/shop/tankwithfish.png" alt="character" className="mt-16 w-80" />
          </div>
          {/* 오른쪽: 상점 아이템 */}
          <div className="flex flex-col items-center justify-center md:w-[50%]">
            {/* 상단 버튼 */}
            <div className="mb-3 flex w-full justify-start gap-4">
              <button
                onClick={() => setShowReroll(false)}
                className={
                  showReroll
                    ? "font-vt323 rounded-full bg-[#CDE6EF] px-6 py-3 text-xl text-black shadow hover:bg-[#E3CFCF]"
                    : "font-vt323 rounded-full bg-white px-6 py-3 text-xl text-black shadow"
                }
              >
                Background
              </button>
              {/* <button className="font-vt323 rounded-full bg-[#CDE6EF] px-6 py-3 text-xl text-black shadow hover:bg-[#E3CFCF]">
                Items
              </button> */}
              <button
                onClick={() => setShowReroll(true)}
                className={
                  showReroll
                    ? "font-vt323 rounded-full bg-white px-6 py-3 text-xl text-black shadow"
                    : "font-vt323 rounded-full bg-[#CDE6EF] px-6 py-3 text-xl text-black shadow hover:bg-[#E3CFCF]"
                }
              >
                Re-roll
              </button>
            </div>
            {/* 아이템 리스트 */}
            <div className="flex w-full justify-center gap-8">
              {showReroll ? <RerollItem /> : <ShopItem />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
