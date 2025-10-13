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
  return (
    <section className="w-full">
      <div className="rounded-2xl p-2 sm:p-4">
        <div className="grid grid-cols-2 gap-5">
          {items.map((bg) => {
            const isSelected = selectedId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.id)}
                className={[
                  "group relative aspect-[17/10] w-full overflow-hidden rounded-xl border-2 transition-all duration-200 ease-out",
                  isSelected
                    ? "scale-[1.02] border-[#D7B9B9] shadow-[0_0_10px_rgba(215,185,185,0.5)]"
                    : "border-transparent hover:scale-[1.03] hover:border-[#D7B9B9]/80",
                  "bg-white/30 backdrop-blur-sm hover:shadow-lg",
                ].join(" ")}
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
