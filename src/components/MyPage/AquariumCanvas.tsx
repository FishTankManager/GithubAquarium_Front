export default function AquariumCanvas({
  width = 990,
  height = 600,
  bgSrc = "/images/aquarium_example.png",
  itemSrc, // 선택된 아이템(장식) 오버레이
}: {
  width?: number;
  height?: number;
  bgSrc?: string;
  itemSrc?: string;
}) {
  return (
    <div className="relative rounded border bg-white/70" style={{ width, height }}>
      {/* 배경 */}
      <img
        src={bgSrc}
        alt="aquarium background"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />
      {/* 아이템(있으면 위에 얹기) */}
      {itemSrc && (
        <img
          src={itemSrc}
          alt="aquarium item"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full object-contain select-none"
        />
      )}
    </div>
  );
}
