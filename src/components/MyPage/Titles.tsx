export default function Titles({
  active,
  onChange,
}: {
  active: "fishtank" | "aquarium";
  onChange: (v: "fishtank" | "aquarium") => void;
}) {
  const base = "font-turret rounded-full border px-4 py-2 text-base";
  const on = "bg-pink-200/60 border-pink-300";
  const off = "bg-transparent border-pink-300";

  return (
    <div className="flex items-center gap-4">
      <h2 className="font-turret text-5xl tracking-wide">MY</h2>
      <button
        className={`${base} ${active === "fishtank" ? on : off}`}
        onClick={() => onChange("fishtank")}
      >
        FISHTANK
      </button>
      <button
        className={`${base} ${active === "aquarium" ? on : off}`}
        onClick={() => onChange("aquarium")}
      >
        AQUARIUM
      </button>
    </div>
  );
}
