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
  return (
    <section className="w-full">
      <div className="rounded-2xl p-2 sm:p-4" style={{ WebkitBackdropFilter: "blur(6px)" }}>
        <div className="grid grid-cols-2 gap-5">
          {items.map((it) => {
            const isSelected = selectedId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                title={it.name}
                aria-pressed={isSelected}
                className={[
                  "group relative aspect-[17/10] w-full overflow-hidden rounded-xl border-2 transition duration-200 ease-out",
                  isSelected ? "border-[#D7B9B9]" : "border-transparent",
                  "hover:scale-[1.03] hover:border-[#D7B9B9]",
                  "bg-white/50",
                ].join(" ")}
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
