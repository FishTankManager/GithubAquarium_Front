import React from "react";
import PriceBar from "./PriceBar";

interface RerollCardProps {
  quantity: string;
  price: number;
}

const RerollCard: React.FC<RerollCardProps> = ({ quantity, price }) => {
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex flex-row items-start">
        <img
          src="/images/shop/reroll.png"
          alt="tank-top-left"
          className="h-auto w-[80%] object-contain"
        />
        <div className="font-vt323 mt-7 -ml-8 flex flex-row items-center gap-[1px] text-[26px] text-black">
          <p>X</p>
          <p>{quantity}</p>
        </div>
      </div>
      <PriceBar price={price} />
    </div>
  );
};

export default RerollCard;
