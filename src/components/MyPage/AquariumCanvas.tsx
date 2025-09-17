export default function AquariumCanvas({
  width = 990,
  height = 600,
  src = "/images/aquarium_example.png",
}: {
  width?: number;
  height?: number;
  src?: string;
}) {
  return (
    <div className="relative rounded border bg-white/70" style={{ width, height }}>
      <img
        src={src}
        alt="aquarium"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />
    </div>
  );
}
