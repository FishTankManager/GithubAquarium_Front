import { TimelineItem } from "@/types/aquarium";
import FishIcon from "./FishIcon";

export default function GrowthTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <section className="w-[360px] rounded-xl bg-white/60 p-4 shadow">
      <h3 className="font-turret mb-2">GROWTH TIMELINE</h3>
      <div className="grid grid-cols-[120px_1fr_140px] pb-2 text-xs text-gray-700">
        <span>TIME</span>
        <span className="justify-self-center">FISH</span>
        <span>MATURITY</span>
      </div>
      <div className="divide-y">
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-[120px_1fr_140px] items-center py-3">
            <div className="text-sm">
              {it.at.split(" ")[0]}
              <br />
              {it.at.split(" ")[1]}
            </div>
            <div className="justify-self-center">
              <FishIcon maturity={it.fish.maturity} />
            </div>
            <div className="text-sm">{it.fish.maturity}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
