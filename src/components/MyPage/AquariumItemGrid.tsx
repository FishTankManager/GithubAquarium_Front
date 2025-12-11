import { useViewport } from "@/contexts/useViewport";

type Item = {
  id: string;
  name: string;
  src: string; // 썸네일/실이미지 동일 사용
};

export default function AquariumItemGrid({
  items,
  selectedId,
  onSelect,
}: {
  items: Item[];
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
          {items.map((it) => {
            const isSelected = selectedId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                title={it.name}
                aria-pressed={isSelected}
                className={[
                  "group relative overflow-hidden rounded-xl border-2 transition duration-200 ease-out",
                  isSelected ? "border-[#D7B9B9]" : "border-transparent",
                  "hover:scale-[1.03] hover:border-[#D7B9B9]",
                  "bg-white/50",
                ].join(" ")}
                style={{ width: `${itemWidth}px`, height: `${itemHeight}px` }}
              >
                <img src={it.src} alt={it.name} className="h-full w-full object-cover" />
                <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                  {it.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
