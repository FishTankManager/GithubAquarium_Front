import { useRef, useState } from "react";
import RepoSelect from "./RepoSelect";
import CanvasControls from "./CanvasControls";
import FishTankCanvas from "./FishTankCanvas";
import GrowthTimeline from "./GrowthTimeline";
import { CanvasSize, RepoInfo, TimelineItem } from "@/types/aquarium";

export default function FishTankSection() {
  const [repo, setRepo] = useState<RepoInfo | null>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 600, height: 300 });
  const [contrib, setContrib] = useState<number>(914);
  const [timeline] = useState<TimelineItem[]>([
    { id: "t1", at: "25/09/14 00:00", fish: { id: "f1", maturity: "Juvenile" } },
    { id: "t0", at: "25/09/12 00:00", fish: { id: "f0", maturity: "Hatchling" } },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="font-abeezee mb-10 text-[#B2B2B2]">
        <RepoSelect
          value={repo}
          onChange={(r) => {
            setRepo(r);
            setContrib(r?.contributions ?? 0);
          }}
        />
      </div>

      <div className="space-y-3">
        <CanvasControls size={size} onSizeChange={setSize} />
        <FishTankCanvas ref={canvasRef} size={size} />
        <p className="font-turret text-sm">Repo contributions: {contrib}</p>
      </div>

      <div className="mt-6">
        <GrowthTimeline items={timeline} />
      </div>
    </>
  );
}
