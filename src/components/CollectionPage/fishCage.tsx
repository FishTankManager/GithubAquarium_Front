// src/components/collection/EmptyCage.tsx
import React from "react";

interface FishCageProps {
  fish?: string;
  isSelected?: boolean;
}

const FishCage: React.FC<FishCageProps> = ({ fish, isSelected }) => {
  // 1. fish 유무에 따라 기본 크기 클래스를 설정합니다.
  // 2. fish가 있을 때만 선택(isSelected)에 따른 크기 변화를 줍니다.
  const imageClass = fish
    ? isSelected
      ? "h-35 w-35"
      : "h-30 w-30" // 물고기가 있을 때 크기 (선택 시 더 커짐)
    : "h-15 w-15 opacity-80"; // 물음표(빈 칸)일 때 크기 (고정)

  return (
    <div className="relative flex h-35 w-35 items-center justify-center">
      {/* 어항 배경 */}
      <img src="/images/collection/fishcagecut.png" alt="fish cage" className="h-35 w-35" />

      {/* 물고기 또는 물음표 이미지 */}
      <img
        src={fish ? fish : "/images/collection/questionSquare.png"}
        alt="fish"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-200 ${imageClass}`}
      />
    </div>
  );
};

export default FishCage;
