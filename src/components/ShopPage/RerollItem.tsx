// components/ShopPage/RerollItem.tsx
import React from "react";
import RerollCard from "./RerollCard";

interface RerollItemProps {
  price: number;
  onReroll: () => void;
  disabled?: boolean;
}

const RerollItem: React.FC<RerollItemProps> = ({ price, onReroll, disabled }) => {
  return (
    <div className="relative aspect-[757/673] w-full overflow-hidden rounded-xl">
      <img
        src="/images/shop/group73.svg"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <img
          src="/images/shop/group105.svg"
          alt="shelf-middle"
          className="absolute top-[50%] left-1/2 mt-25 h-auto w-[50%] -translate-x-[54%] -translate-y-1/2"
        />

        <div className="absolute top-1/2 left-1/2 flex w-[50%] max-w-sm -translate-x-1/2 -translate-y-1/2 justify-center">
          <RerollCard quantity="1" price={price} onClick={onReroll} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default RerollItem;
