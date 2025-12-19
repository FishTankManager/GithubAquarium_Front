import React from "react";
import PriceBar from "./PriceBar";

interface RerollCardProps {
  quantity: string;
  price: number;
}

const RerollCard: React.FC<RerollCardProps> = ({ quantity, price }) => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-[3%]">
      {/* 이미지와 수량 텍스트 영역을 감싸는 컨테이너 */}
      <div className="relative inline-flex items-start justify-center">
        {/* 이미지 */}
        <img
          src="/images/shop/reroll.png"
          alt="reroll-item"
          className="h-auto w-[70%] object-contain"
        />

        {/* 텍스트: absolute 대신 relative나 적절한 마진 사용, 혹은 이미지 바로 옆으로 배치 */}
        <div className="font-vt323 relative top-[12%] right-[17%] flex flex-row items-center gap-[1px] text-[1.2rem] whitespace-nowrap text-black sm:text-[1.5rem] md:text-[26px]">
          <p>X</p>
          <p>{quantity}</p>
        </div>
      </div>

      {/* 하단 가격 바: 화면이 너무 작아지면 scale로 전체 크기를 줄임 */}
      <div className="xs:scale-[0.8] mr-[3%] flex w-full origin-top scale-[0.7] justify-center sm:scale-100">
        <PriceBar price={price} showArrow={false} />
      </div>
    </div>
  );
};

export default RerollCard;
