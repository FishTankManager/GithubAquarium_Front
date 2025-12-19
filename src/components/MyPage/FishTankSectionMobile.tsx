import { useRef, useState, useEffect } from "react";
import RepoSelect from "./RepoSelect";
import CanvasControls from "./CanvasControls";
import FishTankCanvas from "./FishTankCanvas";
import GrowthTimeline from "./GrowthTimeline";
import { CanvasSize, RepoInfo } from "@/types/aquarium";
import { getFishtankDetail } from "@/apis/fishtank";

export default function FishTankSectionMobile() {
  const [repo, setRepo] = useState<RepoInfo | null>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 770, height: 400 });
  const [contrib, setContrib] = useState<number>(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 레포지토리 선택 시 피쉬탱크 상세 정보 가져오기 및 contributions 합산
  useEffect(() => {
    const fetchFishtankDetail = async () => {
      if (!repo) {
        setContrib(0);
        return;
      }

      try {
        const fishtankDetail = await getFishtankDetail(repo.id);
        // fishtankDetail.fish_list에서 commit_count 합산
        const totalContributions = fishtankDetail.fish_list.reduce(
          (sum: number, fish) => sum + (fish.commit_count || 0),
          0,
        );
        setContrib(totalContributions);
      } catch {
        // 피쉬탱크가 없는 경우 레포지토리 정보의 contributions 사용
        setContrib(repo.contributions || 0);
      }
    };

    fetchFishtankDetail();
  }, [repo]);

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
        <p className="font-vt text-2xl text-white">Repo contributions: {contrib}</p>
      </div>

      <div className="mt-6">
        <GrowthTimeline repoId={repo?.id || null} />
      </div>
    </>
  );
}
