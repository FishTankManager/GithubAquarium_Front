import { forwardRef } from "react";
import { CanvasSize } from "@/types/aquarium";

export default forwardRef<HTMLDivElement, { size: CanvasSize; bowlSrc?: string }>(
  function FishTankCanvas({ size, bowlSrc = "/images/fishtank_example.png" }, ref) {
    return (
      <div
        ref={ref}
        className="relative rounded border bg-white/70"
        style={{ width: size.width, height: size.height }}
      >
        <img
          src={bowlSrc}
          alt="fish bowl"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
        />
      </div>
    );
  },
);
