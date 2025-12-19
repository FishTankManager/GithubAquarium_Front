import React from "react";
import RerollCard from "./RerollCard";

const RerollItem: React.FC = () => {
  return (
    <div className="relative aspect-[757/673] w-full overflow-hidden rounded-xl">
      {/* 배경 */}
      <img
        src="/images/shop/group73.svg"
        alt="background"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* 내용 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        {/* 선반 - 윗줄 */}
        <img
          src="/images/shop/group105.svg"
          alt="shelf-top"
          className="absolute top-[32%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />
        {/* 선반 - 아랫줄 */}
        <img
          src="/images/shop/group105.svg"
          alt="shelf-bottom"
          className="absolute top-[76%] left-1/2 h-auto w-[85%] -translate-x-1/2"
        />

        {/* 어항들 컨테이너: 고정 높이 제거하고 %로 배치 */}
        <div className="absolute top-[8%] left-1/2 flex w-[80%] -translate-x-1/2 justify-around gap-[2%]">
          <RerollCard quantity="1" price={100} />
          <RerollCard quantity="2" price={200} />
          <RerollCard quantity="5" price={500} />
        </div>

        <div className="absolute top-[52%] left-1/2 flex w-[80%] -translate-x-1/2 justify-around gap-[2%]">
          <RerollCard quantity="10" price={1000} />
          <RerollCard quantity="20" price={2000} />
          <RerollCard quantity="30" price={3000} />
        </div>
      </div>
    </div>
  );
};

export default RerollItem;
