// pages/ShopPage.tsx
import React, { useState, useEffect } from "react";
import { Header, Footer } from "../components";
import { BackgroundItem } from "../components/ShopPage";
import RerollItem from "../components/ShopPage/RerollItem";
import LogoText from "@/components/LogoText";
import { getShopItems, getShopMyInfo, purchaseItem, rerollFish } from "../apis/shop";
import type { ShopItem, ShopMyInfo } from "../apis/shop";

// 아쿠아리움 관련
import AquariumPreview from "@/components/TankRenderer/AquariumPreview";
import { getAquariumDetail } from "@/apis/aquarium";
import type { AquariumDetail } from "@/types/aquarium";
import RerollFishTable from "../components/ShopPage/RerollFishTable";

// 보유 배경 관련
import { getMyBackgrounds } from "@/apis/collection";
import type { MyBackground } from "@/apis/collection";

const ShopPage: React.FC = () => {
  const [showReroll, setShowReroll] = useState(false);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [shopMyInfo, setShopMyInfo] = useState<ShopMyInfo>({
    currency: {
      balance: 0,
      total_earned: 0,
    },
    inventory: [],
  });

  const [myBackgrounds, setMyBackgrounds] = useState<MyBackground[]>([]);

  const [aquarium, setAquarium] = useState<AquariumDetail | null>(null);
  const [aquariumLoading, setAquariumLoading] = useState(true);
  const [aquariumError, setAquariumError] = useState<string | null>(null);

  // Apply로 선택된 배경 (없으면 실제 아쿠아리움 배경 사용)
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>(undefined);
  const [selectedFishId, setSelectedFishId] = useState<number | null>(null);

  const [rerollVersion, setRerollVersion] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [items, info, aquariumData, backgrounds] = await Promise.all([
          getShopItems(),
          getShopMyInfo(),
          getAquariumDetail(),
          getMyBackgrounds(),
        ]);

        if (!mounted) return;

        setShopItems(items);
        setShopMyInfo(info);
        setAquarium(aquariumData);
        setMyBackgrounds(backgrounds);
        setSelectedBackground(aquariumData.background_name); // 초기값: 현재 배경
      } catch (err) {
        console.error("초기 API 호출 실패:", err);
        if (mounted) {
          setAquariumError(
            err instanceof Error ? err.message : "아쿠아리움 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (mounted) setAquariumLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePurchase = async (itemId: number) => {
    try {
      await purchaseItem(itemId);

      // 구매 후: 잔액 + 보유 배경 둘 다 갱신
      const [info, backgrounds] = await Promise.all([getShopMyInfo(), getMyBackgrounds()]);
      setShopMyInfo(info);
      setMyBackgrounds(backgrounds);
    } catch (err) {
      console.error("구매 실패:", err);
    }
  };

  const handleReroll = async () => {
    try {
      if (!selectedFishId) {
        console.warn("선택된 물고기가 없습니다.");
        return;
      }

      if (!rerollShopItem) {
        console.warn("리롤 상품 정보를 찾을 수 없습니다.");
        return;
      }

      // 1. 리롤권 구매
      await purchaseItem(rerollShopItem.id);

      // 2. 리롤 수행 → fish_id 로 요청
      await rerollFish(selectedFishId);

      // 3. 포인트 + 아쿠아리움 상태 갱신
      const [info, aquariumData] = await Promise.all([getShopMyInfo(), getAquariumDetail()]);
      setShopMyInfo(info);
      setAquarium(aquariumData);

      // 4. 테이블 리프레시
      setRerollVersion((v) => v + 1);
    } catch (err) {
      console.error("리롤 실패:", err);
    }
  };

  const bgUnlockItems = shopItems.filter((item) => item.item_type === "BG_UNLOCK");
  const rerollShopItem = shopItems.find((item) => item.item_type === "REROLL");

  const canReroll = !!(
    rerollShopItem &&
    selectedFishId &&
    shopMyInfo.currency.balance >= rerollShopItem.price
  );

  const previewBackgroundName = selectedBackground ?? aquarium?.background_name ?? undefined;

  const selectedFish =
    aquarium && selectedFishId !== null
      ? (aquarium.fish_list.find((f) => f.id === selectedFishId) ?? null)
      : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 z-50 w-full">
        <Header />
      </div>

      <img
        src="/images/shop/background3.png"
        alt="background"
        className="fixed top-0 left-0 -z-10 h-full w-full object-cover"
      />

      <main className="relative z-10 mx-auto mt-20 max-w-7xl px-8 pt-18 pb-20">
        <div className="flex w-full flex-col items-start justify-center gap-40 md:flex-row">
          {/* 왼쪽: 타이틀 + 유저 정보 + 아쿠아리움 프리뷰 + (Re-roll일 때) 물고기 리스트 */}
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <LogoText
              text="Shop"
              className="font-sixtyfour text-shadow mb-10 text-center text-6xl text-[#C18A8A] drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] md:mb-0"
            />
            <div className="mt-6 flex h-13 items-center justify-center rounded-xl bg-white px-4 py-2 shadow transition-colors hover:bg-gray-100">
              <img src="/images/shop/starfish.png" alt="star" className="mr-2 h-10 w-10" />
              <span className="font-vt323 text-3xl text-gray-800">
                {shopMyInfo.currency.balance}
              </span>
            </div>

            <div className="mt-6 flex w-120 flex-col items-center">
              {aquariumLoading && (
                <div className="mt-4 text-center text-sm text-slate-600">아쿠아리움 로딩 중...</div>
              )}
              {aquariumError && !aquariumLoading && (
                <div className="mt-4 text-center text-sm text-red-500">{aquariumError}</div>
              )}
              {aquarium && !aquariumLoading && !aquariumError && (
                <>
                  {showReroll ? (
                    <>
                      {/* 선택된 물고기 단일 프리뷰 */}
                      <div className="flex w-full justify-center">
                        {selectedFish ? (
                          <AquariumPreview
                            width={400}
                            height={220}
                            className="relative overflow-hidden rounded-2xl bg-transparent text-black shadow-lg"
                            fishList={[selectedFish]}
                            backgroundName={previewBackgroundName}
                          />
                        ) : (
                          <div className="flex h-[220px] w-[320px] items-center justify-center rounded-2xl bg-sky-200/40 text-sm text-slate-700 shadow-inner">
                            리롤할 물고기를 선택하세요.
                          </div>
                        )}
                      </div>

                      {/* 물고기 리스트 테이블 */}
                      <div className="mt-4 flex w-full justify-center">
                        <RerollFishTable
                          key={rerollVersion}
                          selectedFishId={selectedFishId}
                          onSelect={setSelectedFishId}
                        />
                      </div>
                    </>
                  ) : (
                    <AquariumPreview
                      width={480}
                      height={300}
                      className="relative overflow-hidden rounded-2xl bg-transparent text-black shadow-lg"
                      fishList={aquarium.fish_list}
                      backgroundName={previewBackgroundName}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* 오른쪽: 상점 아이템 */}
          <div className="flex flex-col items-center justify-center md:w-[50%]">
            <div className="mb-3 flex w-full justify-start gap-4">
              {(() => {
                const base =
                  "font-vt323 rounded-full px-6 py-3 text-xl text-black shadow transition-all duration-300";
                const active = `${base} bg-white`;
                const inactive = `${base} bg-[#CDE6EF] hover:bg-[#E3CFCF]`;

                return (
                  <>
                    {/* Background 탭 버튼 */}
                    <button
                      onClick={() => setShowReroll(false)}
                      className={showReroll ? inactive : active}
                    >
                      Background
                    </button>

                    {/* Re-roll 탭 버튼 */}
                    <button
                      onClick={() => setShowReroll(true)}
                      className={showReroll ? active : inactive}
                    >
                      Re-roll
                    </button>
                  </>
                );
              })()}
            </div>

            <div className="flex w-full justify-center gap-8">
              {showReroll ? (
                rerollShopItem ? (
                  <RerollItem
                    price={rerollShopItem.price}
                    onReroll={handleReroll}
                    disabled={!canReroll}
                  />
                ) : null
              ) : (
                <BackgroundItem
                  items={bgUnlockItems}
                  myBackgrounds={myBackgrounds}
                  myBalance={shopMyInfo.currency.balance}
                  onPurchase={handlePurchase}
                  onApplyBackground={(bgName) => setSelectedBackground(bgName)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
