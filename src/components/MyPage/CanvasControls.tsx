import { CanvasSize } from "@/types/aquarium";

export default function CanvasControls({
  size,
  onSizeChange,
}: {
  size: CanvasSize;
  onSizeChange: (s: CanvasSize) => void;
}) {
  return (
    <div className="font-vt flex items-center gap-6 text-2xl text-[#D7B9B9]">
      {/* WIDTH */}
      <label className="flex items-center gap-2">
        <span className="font-bold">WIDTH:</span>
        <input
          className="w-24 rounded border-2 border-[#CA9B9B] bg-transparent px-2 py-1 text-center text-[#D7B9B9] focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          type="number"
          min={200}
          step={10}
          value={size.width}
          onChange={(e) =>
            onSizeChange({
              ...size,
              width: Number(e.target.value),
            })
          }
        />
        <span className="font-bold">px</span>
      </label>

      {/* HEIGHT */}
      <label className="flex items-center gap-2">
        <span className="font-bold">HEIGHT:</span>
        <input
          className="w-24 rounded border-2 border-[#CA9B9B] bg-transparent px-2 py-1 text-center text-[#D7B9B9] focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
          type="number"
          min={150}
          step={10}
          value={size.height}
          onChange={(e) =>
            onSizeChange({
              ...size,
              height: Number(e.target.value),
            })
          }
        />
        <span className="font-bold">px</span>
      </label>

      {/* EXPORT 버튼 - 현재는 기능 없이 콘솔 로그만 출력되게 해놨음 */}
      <button
        onClick={() => console.log("EXPORT clicked")}
        className="font-vt ml-auto rounded-full bg-[#3F3F3F]/80 px-10 py-2 text-2xl text-[#D7B9B9] shadow transition-colors hover:bg-[#CA9B9B]/20 focus:ring-2 focus:ring-[#CA9B9B] focus:outline-none"
      >
        EXPORT
      </button>
    </div>
  );
}
