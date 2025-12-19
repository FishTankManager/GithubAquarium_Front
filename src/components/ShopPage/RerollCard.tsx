// components/ShopPage/RerollCard.tsx
import React from "react";
import PriceBar from "./PriceBar";

interface RerollCardProps {
  quantity: string;
  price: number;
  onClick?: () => void;
  disabled?: boolean;
}

const RerollCard: React.FC<RerollCardProps> = ({ quantity, price, onClick, disabled }) => {
  const handleClick = disabled ? undefined : onClick;

  return (
    <div className="flex w-full flex-col items-center justify-between gap-[3%]">
      <div className="relative inline-flex items-start justify-center">
        <img
          src="/images/shop/reroll.png"
          alt="reroll-item"
          className="h-auto w-[70%] object-contain"
        />
        <div className="font-vt323 relative top-[12%] right-[17%] flex flex-row items-center gap-[1px] text-[1.2rem] whitespace-nowrap text-black sm:text-[1.5rem] md:text-[26px]">
          <p>X</p>
          <p>{quantity}</p>
        </div>
      </div>

      <div className="xs:scale-[0.8] mr-[3%] flex w-full origin-top scale-[0.7] justify-center sm:scale-100">
        <div className="relative">
          <PriceBar price={price} showArrow onPriceClick={handleClick} onArrowClick={handleClick} />
          {disabled && (
            <div className="absolute inset-0 cursor-not-allowed rounded-xl bg-gray-300/60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RerollCard;
