import React from "react";

interface PriceBarProps {
  price: number;
}

const PriceBar: React.FC<PriceBarProps> = ({ price }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 min-w-[40px] items-center justify-center rounded-xl bg-white px-1 py-2 shadow hover:bg-gray-100">
        <img src="/images/shop/arrow-right.png" alt="apply" className="mx-1 h-4 w-3" />
      </div>
      <div className="flex h-9 w-[90px] items-center justify-center rounded-xl bg-white px-4 py-2 shadow hover:bg-gray-100">
        <img src="/images/shop/starfish.png" alt="star" className="mr-1 h-8 w-8" />
        <span className="font-vt323 text-2xl text-gray-800">{price}</span>
      </div>
    </div>
  );
};

export default PriceBar;
