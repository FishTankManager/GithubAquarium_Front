import React from "react";
import PriceBar from "./PriceBar";

const BackgroundItem: React.FC = () => {
  return (
    <div className="relative aspect-[757/673] w-full overflow-hidden rounded-xl">
      {/* 배경 */}
      <img
        src="/images/shop/group73.svg"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* 내용 */}
      <div className="relative z-10 mt-5 mr-2 flex h-full flex-col items-center justify-center">
        {/* 선반 - 윗줄 */}
        <img
          src="/images/shop/group105.svg"
          alt="shelf-top"
          className="absolute top-[29%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />
        {/* 선반 - 아랫줄 */}
        <img
          src="/images/shop/group105.svg"
          alt="shelf-bottom"
          className="absolute top-[73%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />

        {/* 어항: 윗줄 */}
        <div className="absolute top-[6%] left-[9%] flex h-50 w-[34%] flex-col items-center justify-between">
          <img
            src="/images/shop/group76.svg"
            alt="tank-top-left"
            className="h-auto w-full object-contain"
          />
          <PriceBar price={200} />
        </div>
        <div className="absolute top-[6%] right-[9%] flex h-50 w-[34%] flex-col items-center justify-between">
          <img
            src="/images/shop/group77.svg"
            alt="tank-top-right"
            className="h-auto w-full object-contain"
          />
          <PriceBar price={300} />
        </div>
        {/* 어항: 아랫줄 */}
        <div className="absolute top-[50%] left-[9%] flex h-50 w-[34%] flex-col items-center justify-between">
          <img
            src="/images/shop/group78.svg"
            alt="tank-bottom-left"
            className="h-auto w-full object-contain"
          />
          <PriceBar price={400} />
        </div>
        <div className="absolute top-[50%] right-[9%] flex h-50 w-[34%] flex-col items-center justify-between">
          <img
            src="/images/shop/emptytank.png"
            alt="tank-bottom-right"
            className="h-auto w-full object-contain"
          />
          <PriceBar price={500} />
        </div>
      </div>
    </div>
  );
};

export default BackgroundItem;
