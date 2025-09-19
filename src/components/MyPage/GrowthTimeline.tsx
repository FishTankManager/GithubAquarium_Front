import { TimelineItem } from "@/types/aquarium";
import FishIcon from "./FishIcon";

export default function GrowthTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="w-[750px]">
      {/* 상단 라벨 */}
      <div className="mt-5 mb-5 inline-block rounded-lg bg-[#C7D6FF]/60 px-5 py-1 shadow">
        <span className="font-vt text-2xl tracking-wide text-black/80">GROWTH TIMELINE</span>
      </div>

      {/* 유리(서리) 카드 */}
      <div
        className="rounded-2xl p-8 shadow-lg ring-1 ring-white/40"
        style={{
          // frosted-glass 느낌
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 헤더 행 */}
        <div className="grid grid-cols-[180px_1fr_220px] items-end pb-6">
          <h4 className="font-vt text-2xl tracking-wider text-[#5A2B55]">TIME</h4>
          <h4 className="font-vt justify-self-center text-2xl tracking-wider text-[#5A2B55]">
            FISH
          </h4>
          <h4 className="font-vt text-2xl tracking-wider text-[#5A2B55]">MATURITY</h4>
        </div>

        {/* 아이템 목록 */}
        <div className="space-y-8">
          {items.map((it) => (
            <div key={it.id} className="grid grid-cols-[180px_1fr_220px] items-center">
              {/* TIME */}
              <div className="font-vt text-2xl leading-relaxed text-white">
                {it.at.split(" ")[0]}
                <br />
                {it.at.split(" ")[1]}
              </div>

              {/* FISH 썸네일 박스 */}
              <div className="justify-self-center">
                <div className="flex h-33 w-33 items-center justify-center rounded-2xl bg-white/25 shadow-inner transition-transform duration-300 hover:scale-110">
                  <FishIcon maturity={it.fish.maturity} />
                </div>
              </div>

              {/* MATURITY */}
              <div className="font-vt text-2xl text-white">{it.fish.maturity}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
