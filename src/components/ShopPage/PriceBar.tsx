// components/ShopPage/PriceBar.tsx
import React from "react";

interface PriceBarProps {
  price: number;
  showArrow?: boolean;
  onPriceClick?: () => void; // 금액 영역 클릭
  onArrowClick?: () => void; // 화살표 클릭 (없으면 onPriceClick 사용)
}

const PriceBar: React.FC<PriceBarProps> = ({
  price,
  showArrow = true,
  onPriceClick,
  onArrowClick,
}) => {
  const handleArrowClick = onArrowClick ?? onPriceClick;

  return (
    <div className="flex items-center gap-[1vw] sm:gap-2">
      {showArrow && (
        <div
          className={`flex min-h-[2rem] items-center justify-center rounded-xl bg-white px-3 py-3 shadow hover:bg-gray-100 ${
            handleArrowClick ? "cursor-pointer" : ""
          }`}
          onClick={handleArrowClick ?? undefined}
        >
          <img src="/images/shop/arrow-right.png" alt="apply" className="h-3 w-2 sm:h-4 sm:w-3" />
        </div>
      )}

      <div
        className={`flex min-h-[2rem] items-center justify-center rounded-xl bg-white px-2 py-1 shadow hover:bg-gray-100 ${
          onPriceClick ? "cursor-pointer" : ""
        }`}
        onClick={onPriceClick}
      >
        <img src="/images/shop/starfish.png" alt="star" className="mr-1 h-5 w-5 sm:h-7 sm:w-7" />
        <span className="font-vt323 text-lg text-gray-800 sm:text-2xl">{price}</span>
      </div>
    </div>
  );
};

export default PriceBar;
