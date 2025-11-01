import { forwardRef } from "react";
import { CanvasSize } from "@/types/aquarium";

export default forwardRef<HTMLDivElement, { size: CanvasSize; bowlSrc?: string }>(
  function FishTankCanvas({ size, bowlSrc = "/images/fishtank_example.png" }, ref) {
    return (
      <div
        ref={ref}
        className="relative rounded"
        style={{
          width: typeof size.width === "number" ? `${size.width}px` : size.width,
          height: typeof size.height === "number" ? `${size.height}px` : size.height,
        }}
      >
        <img
          src={bowlSrc}
          alt="fish bowl"
          className="pointer-events-none absolute inset-0 h-full w-full border border-white/50 object-contain select-none"
        />
      </div>
    );
  },
);
