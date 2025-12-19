import React from "react";

interface PriceBarProps {
  price: number;
  showArrow?: boolean; // 선택적 Prop 추가 (기본값 설정을 위해)
}

const PriceBar: React.FC<PriceBarProps> = ({ price, showArrow = true }) => {
  return (
    <div className="flex items-center gap-[1vw] sm:gap-2">
      {/* showArrow가 true일 때만 화살표 버튼을 렌더링 */}
      {showArrow && (
        <div className="flex min-h-[2rem] items-center justify-center rounded-xl bg-white px-3 py-3 shadow hover:bg-gray-100">
          <img src="/images/shop/arrow-right.png" alt="apply" className="h-3 w-2 sm:h-4 sm:w-3" />
        </div>
      )}

      {/* 가격 표시 영역 */}
      <div className="flex min-h-[2rem] items-center justify-center rounded-xl bg-white px-2 py-1 shadow hover:bg-gray-100">
        <img src="/images/shop/starfish.png" alt="star" className="mr-1 h-5 w-5 sm:h-7 sm:w-7" />
        <span className="font-vt323 text-lg text-gray-800 sm:text-2xl">{price}</span>
      </div>
    </div>
  );
};

export default PriceBar;
