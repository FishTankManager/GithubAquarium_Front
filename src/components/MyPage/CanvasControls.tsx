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
          max={700}
          step={10}
          placeholder="700"
          value={size.width}
          onChange={(e) => {
            const newWidth = Number(e.target.value);
            onSizeChange({
              ...size,
              width: newWidth > 700 ? 700 : newWidth,
            });
          }}
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
          placeholder="400"
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
    </div>
  );
}
