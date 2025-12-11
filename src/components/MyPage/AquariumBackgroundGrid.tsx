import { useViewport } from "@/contexts/useViewport";

type BgItem = {
  id: string;
  name: string;
  src: string; // 썸네일/실이미지 겸용 (필요시 thumb로 분리 가능)
};

export default function AquariumBackgroundGrid({
  items,
  selectedId,
  onSelect,
}: {
  items: BgItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { isMobile, width } = useViewport();
  const useVerticalLayout = isMobile || width < 1400;

  // 고정 크기 아이템 (200px x 117px, aspect-ratio 17/10)
  const itemWidth = 200;
  const itemHeight = (itemWidth * 10) / 17; // 약 117px

  // 모바일 뷰에서는 간격을 더 크게, 와이드 뷰에서는 작게
  const gapXClass = useVerticalLayout ? "gap-x-6" : "gap-x-4";
  const gapYClass = "gap-y-4";

  // 모바일 뷰에서는 창 크기에 따라 1~4개까지 조절, 와이드 뷰에서는 2개 고정
  const gridColsClass = useVerticalLayout
    ? "grid-cols-1 min-[480px]:grid-cols-2 min-[680px]:grid-cols-3 min-[900px]:grid-cols-4"
    : "grid-cols-1 min-[480px]:grid-cols-2";

  return (
    <section className="w-full">
      <div
        className="rounded-2xl bg-[linear-gradient(180deg,rgba(199,214,255,0.6)_0%,rgba(199,214,255,0.4)_100%)] p-4 shadow-lg ring-1 ring-white/40 backdrop-blur-md"
        style={{ WebkitBackdropFilter: "blur(6px)" }}
      >
        <div
          className={`grid ${gridColsClass} ${gapXClass} ${gapYClass} ${useVerticalLayout ? "" : "justify-items-center"}`}
        >
          {items.map((bg) => {
            const isSelected = selectedId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.id)}
                className={[
                  "group relative overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out",
                  isSelected
                    ? "scale-[1.02] border-[#D7B9B9] shadow-[0_0_10px_rgba(215,185,185,0.5)]"
                    : "border-transparent hover:scale-[1.03] hover:border-[#D7B9B9]/80",
                  "bg-white/30 backdrop-blur-sm hover:shadow-lg",
                ].join(" ")}
                style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
              >
                <img
                  src={bg.src}
                  alt={bg.name}
                  className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                />
                <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                  {bg.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
