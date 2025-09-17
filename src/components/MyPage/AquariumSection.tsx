import { useState } from "react";
import AquariumCanvas from "./AquariumCanvas";
import AquariumTabs, { SubTab } from "./AquariumTabs";
import AquariumFishTable from "./AquariumFishTable";
import BottomLines from "./BottomLines";

export default function AquariumSection() {
  const [tab, setTab] = useState<SubTab>("fish");
  const totalContrib = 12987;

  return (
    <>
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={() => console.log("EXPORT clicked")}
          className="font-turret rounded-full bg-black px-4 py-2 text-white"
        >
          EXPORT
        </button>
      </div>

      <AquariumCanvas width={600} height={300} />
      <p className="font-turret mt-2 text-sm">
        Total contributions: {totalContrib.toLocaleString()}
      </p>

      <AquariumTabs tab={tab} onChange={setTab} />

      <section className="mt-3 rounded-xl bg-white/60 p-4 shadow">
        {tab === "fish" && <AquariumFishTable />}
        {tab === "background" && <div className="text-sm">보유 배경 목록(dummy)</div>}
        {tab === "items" && <div className="text-sm">보유 아이템 목록(dummy)</div>}
      </section>

      <BottomLines />
    </>
  );
}
