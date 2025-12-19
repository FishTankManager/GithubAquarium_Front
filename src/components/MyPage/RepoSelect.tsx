import { useEffect, useState } from "react";
import { RepoInfo } from "@/types/aquarium";
import { getRepositories, type Repository } from "@/apis/fishtank";
import { useViewport } from "@/contexts/useViewport";

export default function RepoSelect({
  value,
  onChange,
}: {
  value: RepoInfo | null;
  onChange: (r: RepoInfo | null) => void;
}) {
  const { isMobile, width } = useViewport();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const repositories = await getRepositories();

        // Repository 타입을 RepoInfo 타입으로 변환
        // my_commit_count를 사용하여 현재 사용자의 기여도를 표시
        const repoInfos: RepoInfo[] = repositories.map((repo: Repository) => ({
          id: repo.id.toString(),
          fullName: repo.full_name,
          contributions: repo.my_commit_count, // 사용자의 기여도 사용
        }));

        setRepos(repoInfos);
      } catch (e) {
        setError(e instanceof Error ? e.message : "레포지토리 목록을 불러오는데 실패했습니다.");
        console.error("Failed to fetch repositories:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  // 반응형 너비 계산: 모바일이거나 창 너비가 작으면 전체 너비 사용, 와이드뷰는 고정 700px
  const selectWidth = isMobile || width < 768 ? "w-full" : "w-[700px]";

  return (
    <div className="mt-5 mb-5 flex justify-center">
      {loading ? (
        <div
          className={`font-abeezee ${selectWidth} rounded-md border border-white/50 bg-[#3E548E] px-3 py-2 text-center text-white`}
        >
          레포지토리 목록을 불러오는 중...
        </div>
      ) : error ? (
        <div
          className={`font-abeezee ${selectWidth} rounded-md border border-red-500/50 bg-[#3E548E] px-3 py-2 text-center text-red-300`}
        >
          {error}
        </div>
      ) : (
        <select
          className={`font-abeezee ${selectWidth} appearance-none rounded-md border border-white/50 bg-[#3E548E] px-3 py-2 pr-10 pl-7 text-white shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none`}
          value={value?.id ?? ""}
          onChange={(e) => onChange(repos.find((d) => d.id === e.target.value) ?? null)}
        >
          <option value="" disabled hidden className="text-[#B2B2B2]">
            Select a repository to visit!
          </option>
          {repos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fullName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
