export default function Titles({
  active,
  onChange,
}: {
  active: "fishtank" | "aquarium";
  onChange: (v: "fishtank" | "aquarium") => void;
}) {
  // 고정 사이즈
  const BTN_H = "h-20"; // 버튼 높이
  const BTN_FISHTANK_W = "w-[380px]"; // FISHTANK 폭
  const BTN_AQUARIUM_W = "w-[380px]"; // AQUARIUM 폭

  const base = `rounded-full border ${BTN_H} flex items-center justify-center px-8 transition-colors duration-150`;
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
        WebkitTextStroke: "4px #CA9B9B",
        color: "#FFFFFF",
      }}
    >
      {children}
    </span>
  );

  return (
    <div className="flex items-center gap-8">
      {/* MY */}
      <StrokeText className="text-8xl">MY</StrokeText>

      {/* FISHTANK */}
      <button
        className={`${base} ${BTN_FISHTANK_W} ${active === "fishtank" ? onBtn : offBtn}`}
        onClick={() => onChange("fishtank")}
      >
        {active === "fishtank" ? (
          <StrokeText className="text-5xl">FISHTANK</StrokeText>
        ) : (
          <span className="font-abeezee text-5xl text-[#CA9B9B]">FISHTANK</span>
        )}
      </button>

      {/* AQUARIUM */}
      <button
        className={`${base} ${BTN_AQUARIUM_W} ${active === "aquarium" ? onBtn : offBtn}`}
        onClick={() => onChange("aquarium")}
      >
        {active === "aquarium" ? (
          <StrokeText className="text-5xl">AQUARIUM</StrokeText>
        ) : (
          <span className="font-abeezee text-5xl text-[#CA9B9B]">AQUARIUM</span>
        )}
      </button>
    </div>
  );
}
