// components/ShopPage/BackgroundItem.tsx
import React from "react";
import PriceBar from "./PriceBar";
import type { ShopItem } from "@/apis/shop";
import type { MyBackground } from "@/apis/collection";
import { getBackgroundImage } from "@/assets/png/Backgrounds";

type Props = {
  items: ShopItem[]; // BG_UNLOCK 아이템 리스트
  myBackgrounds: MyBackground[]; // 보유 배경 목록
  myBalance: number; // 현재 포인트 balance
  onPurchase: (itemId: number) => void;
  onApplyBackground: (bgName: string) => void;
};

const BackgroundItem: React.FC<Props> = ({
  items,
  myBackgrounds,
  myBalance,
  onPurchase,
  onApplyBackground,
}) => {
  const slots = Array(4)
    .fill(null)
    .map((_, idx) => items[idx] || null);

  return (
    <div className="relative aspect-[757/673] w-full overflow-hidden rounded-xl">
      <img
        src="/images/shop/group73.svg"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 mt-5 mr-2 flex h-full flex-col items-center justify-center">
        <img
          src="/images/shop/group105.svg"
          alt="shelf-top"
          className="absolute top-[29%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />
        <img
          src="/images/shop/group105.svg"
          alt="shelf-bottom"
          className="absolute top-[73%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />

        <Slot
          style={{ top: "6%", left: "9%" }}
          item={slots[0]}
          tankImage="/images/shop/emptytank.png"
          myBackgrounds={myBackgrounds}
          myBalance={myBalance}
          onPurchase={onPurchase}
          onApplyBackground={onApplyBackground}
        />
        <Slot
          style={{ top: "6%", right: "9%" }}
          item={slots[1]}
          tankImage="/images/shop/emptytank.png"
          myBackgrounds={myBackgrounds}
          myBalance={myBalance}
          onPurchase={onPurchase}
          onApplyBackground={onApplyBackground}
        />
        <Slot
          style={{ top: "50%", left: "9%" }}
          item={slots[2]}
          tankImage="/images/shop/emptytank.png"
          myBackgrounds={myBackgrounds}
          myBalance={myBalance}
          onPurchase={onPurchase}
          onApplyBackground={onApplyBackground}
        />
        <Slot
          style={{ top: "50%", right: "9%" }}
          item={slots[3]}
          tankImage="/images/shop/emptytank.png"
          myBackgrounds={myBackgrounds}
          myBalance={myBalance}
          onPurchase={onPurchase}
          onApplyBackground={onApplyBackground}
        />
      </div>
    </div>
  );
};

export default BackgroundItem;

// components/ShopPage/BackgroundItem.tsx (변경된 Slot만)

const Slot: React.FC<{
  item: ShopItem | null;
  tankImage: string;
  style: React.CSSProperties;
  myBackgrounds: MyBackground[];
  myBalance: number;
  onPurchase: (itemId: number) => void;
  onApplyBackground: (bgName: string) => void;
}> = ({ item, tankImage, style, myBackgrounds, myBalance, onPurchase, onApplyBackground }) => {
  if (!item) {
    return (
      <div
        className="absolute flex h-50 w-[34%] flex-col items-center justify-between"
        style={style}
      >
        <img src={tankImage} alt="tank" className="h-auto w-full object-contain" />
        <div className="h-[24px]" />
      </div>
    );
  }

  const bgId = item.target_background ?? null;
  const bgNameFromItem = item.target_background_name ?? item.name.replace(/ 배경 해금권$/, "");

  const owned = myBackgrounds.some(
    (bg) => (bgId !== null && bg.background_id === bgId) || bg.name === bgNameFromItem,
  );

  const canPurchase = !owned && myBalance >= item.price;
  const bgName = bgNameFromItem;

  const bgImageSrc = getBackgroundImage(bgName) ?? undefined;

  const applyClass = owned
    ? "rounded-xl bg-gray-300 px-4 py-1 text-sm font-vt323 text-gray-500 shadow"
    : "rounded-xl bg-white px-4 py-1 text-sm font-vt323 text-black shadow hover:bg-gray-100";

  return (
    <div className="absolute flex h-50 w-[34%] flex-col items-center justify-between" style={style}>
      <div className="relative w-full">
        <div className="relative w-full pt-[70%]">
          {/* 탱크 내부 배경 (조정된 inset) */}
          {bgImageSrc && (
            <div className="absolute inset-[8%] overflow-hidden rounded-xl">
              <img src={bgImageSrc} alt={bgName} className="h-full w-full object-cover" />
            </div>
          )}

          {/* 탱크 프레임 */}
          <img
            src={tankImage}
            alt="tank"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />

          {owned && (
            <div className="font-vt323 absolute top-2 left-2 rounded-full bg-[#FFE58F] px-3 py-1 text-xs text-black shadow">
              Owned
            </div>
          )}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-1 flex w-full items-center justify-between px-2">
        {/* Apply 버튼 */}
        <button type="button" onClick={() => onApplyBackground(bgName)} className={applyClass}>
          Apply
        </button>

        {/* 구매 영역 */}
        <div className="relative">
          <PriceBar
            price={item.price}
            showArrow={false}
            onPriceClick={() => {
              if (!canPurchase) return; // 클릭 차단
              onPurchase(item.id);
            }}
          />

          {/* owned 또는 잔액 부족 → PriceBar 위에 회색 오버레이 */}
          {!canPurchase && (
            <div className="absolute inset-0 cursor-not-allowed rounded-xl bg-gray-300/70" />
          )}
        </div>
      </div>
    </div>
  );
};
