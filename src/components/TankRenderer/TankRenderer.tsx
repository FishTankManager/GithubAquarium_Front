// FishTankTest.tsx
import React, { useRef } from "react";
import { TankContext } from "@/contexts/TankContext";

type TankProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
};

export default function FishTankTest({
  width = "100%",
  height = "100%",
  className = "",
  children,
}: TankProps) {
  const tankRef = useRef<HTMLDivElement | null>(null);

  return (
    <TankContext.Provider value={tankRef}>
      <div
        ref={tankRef}
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {children}
      </div>
    </TankContext.Provider>
  );
}
