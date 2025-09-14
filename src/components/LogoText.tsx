type GradientOpts = {
  from?: string;
  to?: string;
  radialSize?: string;
};

type Props = {
  text: string;
  strokeWidth?: string | number;
  strokeColor?: string;
  gradient?: GradientOpts;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"h1">, "children">;

export default function LogoText({
  text,
  strokeWidth = "4px",
  strokeColor = "#CA9B9B",
  gradient,
  className = "",
  ...rest
}: Props) {
  const lines = String(text).split("\n");

  const { from = "#ffffff", to = "#21AAFF", radialSize = "ellipse 280% 260%" } = gradient ?? {};

  const stops = `${from}, ${to}`;
  const backgroundImage = `radial-gradient(${radialSize} at 50% 50%, ${stops})`;

  return (
    <h1 className={`relative ${className}`} {...rest}>
      {/* 위 레이어: 그라데이션 채움 */}
      <span
        className={`font-logo relative z-10 inline-block bg-clip-text text-transparent [-webkit-text-fill-color:transparent]`}
        style={{ backgroundImage }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>

      {/* 아래 레이어: 외곽선만 (채움 투명) */}
      <span
        aria-hidden
        className={`font-logo pointer-events-none absolute inset-0 text-transparent`}
        style={{
          WebkitTextStroke:
            typeof strokeWidth === "number"
              ? `${strokeWidth}px ${strokeColor}`
              : `${strokeWidth} ${strokeColor}`,
        }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </span>
    </h1>
  );
}
