type Props = {
  width?: number | string;
  height?: number | string;
  bgSrc: string;
  itemSrc?: string;
  /** 아이템 높이 비율 (0~1), 기본 0.45 = 45% */
  itemHeight?: number;
  className?: string;
};

export default function AquariumCanvas({
  width = 750,
  height = 440,
  bgSrc,
  itemSrc,
  itemHeight = 1,
  className = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {/* 배경: 바닥을 기준으로 꽉 채우기, baseline gap 방지를 위해 block */}
      <img
        src={bgSrc}
        alt="aquarium background"
        className="pointer-events-none absolute inset-0 block h-full w-full object-cover object-bottom select-none"
      />

      {/* 아이템: 하단 중앙, 살짝 -1px로 눌러 경계선 방지, block로 baseline 제거 */}
      {itemSrc && (
        <img
          src={itemSrc}
          alt="aquarium item"
          className="pointer-events-none absolute left-1/2 block -translate-x-1/2 object-contain select-none"
          style={{
            height: `${Math.round(itemHeight * 100)}%`,
            bottom: -8, // 하단 경계에 생기는 1px 틈 보정
          }}
        />
      )}
    </div>
  );
}
