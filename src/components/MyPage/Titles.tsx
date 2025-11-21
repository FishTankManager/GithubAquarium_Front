export default function Titles({
  active,
  onChange,
}: {
  active: "fishtank" | "aquarium";
  onChange: (v: "fishtank" | "aquarium") => void;
}) {
  // 고정 사이즈
  const BTN_H = "h-13"; // 버튼 높이
  const BTN_FISHTANK_W = "w-[260px]"; // FISHTANK 폭
  const BTN_AQUARIUM_W = "w-[260px]"; // AQUARIUM 폭

  const base = `rounded-full border-3 ${BTN_H} flex items-center justify-center px-6 transition-colors duration-150`;
  const onBtn = "bg-[#EDF1F8]/80 border-[#CA9B9B]";
  const offBtn = "bg-transparent border-[#CA9B9B]";

  // Stroke 텍스트 (Bungee 전용)
  const StrokeText = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span
      className={`font-bungee leading-none ${className}`}
      style={{
        WebkitTextStroke: "2px #CA9B9B",
        color: "#FFFFFF",
      }}
    >
      {children}
    </span>
  );

  return (
    <div className="flex items-center gap-4">
      {/* MY */}
      <StrokeText className="text-5xl">MY</StrokeText>

      {/* FISHTANK */}
      <button
        className={`${base} ${BTN_FISHTANK_W} ${active === "fishtank" ? onBtn : offBtn}`}
        onClick={() => onChange("fishtank")}
      >
        {active === "fishtank" ? (
          <StrokeText className="text-3xl">FISHTANK</StrokeText>
        ) : (
          <span className="font-abeezee text-3xl text-[#CA9B9B]">FISHTANK</span>
        )}
      </button>

      {/* AQUARIUM */}
      <button
        className={`${base} ${BTN_AQUARIUM_W} ${active === "aquarium" ? onBtn : offBtn}`}
        onClick={() => onChange("aquarium")}
      >
        {active === "aquarium" ? (
          <StrokeText className="text-3xl">AQUARIUM</StrokeText>
        ) : (
          <span className="font-abeezee text-3xl text-[#CA9B9B]">AQUARIUM</span>
        )}
      </button>
    </div>
  );
}
