export type SubTab = "fish" | "background" | "items";

export default function AquariumTabs({
  tab,
  onChange,
}: {
  tab: SubTab;
  onChange: (t: SubTab) => void;
}) {
  const btn = (is: boolean) =>
    `font-vt rounded-md px-6 py-1 text-xl shadow transition-transform duration-200 
     ${is ? "bg-[#D7B9B9] text-black shadow-md" : "bg-[#C7D6FF]/80 text-black/80"} 
     hover:scale-105 hover:shadow-lg`;

  return (
    <div className="mt-4 flex gap-4">
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
