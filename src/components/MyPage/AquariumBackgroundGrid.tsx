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

  // 창 크기에 따라 간격과 패딩 조정, 각 아이템의 최대 크기 제한
  const getGridConfig = () => {
    if (isMobile || width < 640) {
      // 매우 작은 화면: 작은 간격, 작은 패딩
      return { gap: "gap-2", padding: "p-2", itemMaxWidth: 200 };
    } else if (width < 768) {
      // 작은 화면: 작은 간격, 작은 패딩
      return { gap: "gap-2", padding: "p-2", itemMaxWidth: 250 };
    } else if (width < 1024) {
      // 중간 크기: 중간 간격, 중간 패딩
      return { gap: "gap-3", padding: "p-3", itemMaxWidth: 300 };
    } else {
      // 큰 화면: 큰 간격, 큰 패딩
      return { gap: "gap-5", padding: "p-4", itemMaxWidth: 400 };
    }
  };

  const { gap, padding, itemMaxWidth } = getGridConfig();

  return (
    <section className="w-full">
      <div className={`rounded-2xl ${padding}`}>
        <div className={`grid grid-cols-2 ${gap} justify-items-center`}>
          {items.map((bg) => {
            const isSelected = selectedId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.id)}
                className={[
                  "group relative aspect-[17/10] overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out",
                  isSelected
                    ? "scale-[1.02] border-[#D7B9B9] shadow-[0_0_10px_rgba(215,185,185,0.5)]"
                    : "border-transparent hover:scale-[1.03] hover:border-[#D7B9B9]/80",
                  "bg-white/30 backdrop-blur-sm hover:shadow-lg",
                ].join(" ")}
                style={{ width: "100%", maxWidth: `${itemMaxWidth}px` }}
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
