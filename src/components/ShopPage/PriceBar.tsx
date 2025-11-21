import React from "react";

interface PriceBarProps {
  price: number;
}

const PriceBar: React.FC<PriceBarProps> = ({ price }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 min-w-[40px] items-center justify-center rounded-xl bg-white px-2 py-2 shadow hover:bg-gray-100">
        <img src="/images/shop/arrow-right.png" alt="apply" className="mx-1 h-5 w-4" />
      </div>
      <div className="flex h-11 w-[95px] items-center justify-center rounded-xl bg-white px-4 py-2 shadow hover:bg-gray-100">
        <img src="/images/shop/starfish.png" alt="star" className="mr-2 h-10 w-10" />
        <span className="font-vt323 text-3xl text-gray-800">{price}</span>
      </div>
    </div>
  );
};

export default PriceBar;
