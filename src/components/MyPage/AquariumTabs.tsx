export type SubTab = "fish" | "background" | "items";

export default function AquariumTabs({
  tab,
  onChange,
}: {
  tab: SubTab;
  onChange: (t: SubTab) => void;
}) {
  const btn = (is: boolean) =>
    `font-turret rounded px-3 py-1 border ${is ? "bg-pink-200/60 border-pink-300" : "bg-white/70"}`;
  return (
    <div className="mt-4 flex gap-3">
      <button className={btn(tab === "fish")} onClick={() => onChange("fish")}>
        FISH
      </button>
      <button className={btn(tab === "background")} onClick={() => onChange("background")}>
        BACKGROUND
      </button>
      <button className={btn(tab === "items")} onClick={() => onChange("items")}>
        ITEMS
      </button>
    </div>
  );
}
