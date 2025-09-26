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
    <section className="w-[770px]">
      {/* 유리(서리) 카드 컨테이너 */}
      <div
        className="rounded-2xl p-6 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)", // Safari 대응
        }}
      >
        <div className="grid grid-cols-2 gap-5 p-2 sm:p-4">
          {items.map((it) => {
            const isSelected = selectedId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelect(it.id)}
                title={it.name}
                className={[
                  "group relative aspect-[17/10] w-full overflow-hidden rounded-xl border-2 transition",
                  "bg-white/50 duration-200 ease-out",
                  isSelected ? "border-[#D7B9B9]" : "border-transparent",
                  "hover:scale-[1.03] hover:border-[#D7B9B9]",
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
