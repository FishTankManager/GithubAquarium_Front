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
    <section className="w-[770px]">
      <div
        className="rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.25)_100%)] p-6 shadow-lg ring-1 ring-white/40 backdrop-blur-md"
        style={{ WebkitBackdropFilter: "blur(6px)" }}
      >
        <div className="grid grid-cols-2 gap-5 p-2 sm:p-4">
          {items.map((bg) => {
            const isSelected = selectedId === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => onSelect(bg.id)}
                title={bg.name}
                className={[
                  "group relative aspect-[17/10] w-full overflow-hidden rounded-xl border-3 transition duration-200 ease-out",
                  isSelected ? "border-[#D7B9B9]" : "border-transparent",
                  "hover:scale-[1.03] hover:border-[#D7B9B9]",
                  "bg-white/50",
                ].join(" ")}
              >
                <img src={bg.src} alt={bg.name} className="h-full w-full object-cover" />
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
