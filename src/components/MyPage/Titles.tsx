import { useViewport } from "@/contexts/useViewport";

export default function Titles({
  active,
  onChange,
}: {
  active: "fishtank" | "aquarium";
  onChange: (v: "fishtank" | "aquarium") => void;
}) {
  const { isMobile } = useViewport();

  // 반응형 사이즈 - 모바일 크기 증가
  const BTN_H = isMobile ? "h-12" : "h-13"; // 버튼 높이
  const BTN_FISHTANK_W = isMobile ? "w-[180px]" : "w-[260px]"; // FISHTANK 폭
  const BTN_AQUARIUM_W = isMobile ? "w-[180px]" : "w-[260px]"; // AQUARIUM 폭
  const MY_TEXT_SIZE = isMobile ? "text-5xl" : "text-5xl";
  const BTN_TEXT_SIZE = isMobile ? "text-2xl" : "text-3xl";
  const GAP = isMobile ? "gap-3" : "gap-4";
  const PADDING = isMobile ? "px-4" : "px-6";

  const base = `rounded-full border-3 ${BTN_H} flex items-center justify-center ${PADDING} transition-colors duration-150`;
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
    <div className={`flex items-center ${GAP} flex-wrap justify-center`}>
      {/* MY */}
      <StrokeText className={MY_TEXT_SIZE}>MY</StrokeText>

      {/* FISHTANK */}
      <button
        className={`${base} ${BTN_FISHTANK_W} ${active === "fishtank" ? onBtn : offBtn}`}
        onClick={() => onChange("fishtank")}
      >
        {active === "fishtank" ? (
          <StrokeText className={BTN_TEXT_SIZE}>FISHTANK</StrokeText>
        ) : (
          <span className={`font-abeezee ${BTN_TEXT_SIZE} text-[#CA9B9B]`}>FISHTANK</span>
        )}
      </button>

      {/* AQUARIUM */}
      <button
        className={`${base} ${BTN_AQUARIUM_W} ${active === "aquarium" ? onBtn : offBtn}`}
        onClick={() => onChange("aquarium")}
      >
        {active === "aquarium" ? (
          <StrokeText className={BTN_TEXT_SIZE}>AQUARIUM</StrokeText>
        ) : (
          <span className={`font-abeezee ${BTN_TEXT_SIZE} text-[#CA9B9B]`}>AQUARIUM</span>
        )}
      </button>
    </div>
  );
}
