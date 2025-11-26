// src/components/collection/EmptyCage.tsx
import React from "react";

interface FishCageProps {
  fish?: string;
  isSelected?: boolean;
}

const FishCage: React.FC<FishCageProps> = ({ fish, isSelected }) => (
  <div className="relative flex h-35 w-35 items-center justify-center">
    <img src="/images/collection/fishcagecut.png" alt="fish cage" className="h-35 w-35" />
    <img
      src={fish ? fish : "/images/collection/questionSquare.png"}
      alt="fish"
      className={`absolute inset-0 m-auto object-contain ${isSelected ? "h-18 w-18" : "h-15 w-15"}`}
    />
  </div>
);

export default FishCage;
