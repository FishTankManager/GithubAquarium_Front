import { useEffect, useState } from "react";
import { RepoInfo } from "@/types/aquarium";
import { getRepositories, type Repository } from "@/apis/fishtank";
import { useViewport } from "@/contexts/useViewport";

interface RepoSelectProps {
  value: RepoInfo | null;
  onChange: (r: RepoInfo | null) => void;
  customRepos?: RepoInfo[]; // 외부에서 필터링된 목록을 받을 수 있도록 추가
}

export default function RepoSelect({ value, onChange, customRepos }: RepoSelectProps) {
  const { isMobile, width } = useViewport();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ customRepos가 있으면 API 호출을 하지 않고 전달받은 목록을 사용합니다.
    if (customRepos) {
      setRepos(customRepos);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const repositories = await getRepositories();

        const repoInfos: RepoInfo[] = repositories.map((repo: Repository) => ({
          id: repo.id.toString(),
          fullName: repo.full_name,
          contributions: repo.commit_count,
        }));

        setRepos(repoInfos);
      } catch (e) {
        setError(e instanceof Error ? e.message : "목록을 불러오는데 실패했습니다.");
        console.error("Failed to fetch repositories:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [customRepos]); // customRepos가 변경될 때마다 갱신

  // 반응형 너비 계산: 카드 내부에 맞게 콤팩트하게 설정
  const selectWidth = isMobile || width < 768 ? "w-[200px]" : "w-[260px]";

  return (
    <div className={`flex justify-start ${selectWidth}`}>
      {loading ? (
        <div
          className={`font-abeezee w-full rounded-md border border-[#89482D]/30 bg-[#DFC39D] px-3 py-1 text-center text-[0.85rem] text-[#89482D] shadow-inner`}
        >
          불러오는 중...
        </div>
      ) : error ? (
        <div
          className={`font-abeezee w-full rounded-md border border-red-500/50 bg-[#DFC39D] px-3 py-1 text-center text-[0.85rem] text-red-600`}
        >
          {error}
        </div>
      ) : (
        <div className="relative w-full">
          <select
            className={`font-abeezee /* 안쪽 그림자 적용 */ w-full cursor-pointer appearance-none rounded-md border border-[#89482D]/50 bg-[#DFC39D] px-3 py-2 pr-8 text-[0.85rem] text-[#89482D] shadow-inner transition-all duration-200 hover:shadow-[inset_-4px_4px_4px_0_rgba(137,72,45,0.2)] focus:shadow-[inset_-4px_4px_6px_0_rgba(137,72,45,0.3)] focus:ring-0 focus:outline-none`}
            value={value?.id ?? ""}
            onChange={(e) => {
              const selected = repos.find((d) => d.id === e.target.value);
              onChange(selected ?? null);
              e.currentTarget.blur();
            }}
          >
            <option value="" disabled hidden className="text-[#89482D]/60">
              Select a repository
            </option>
            {repos.map((d) => (
              <option
                key={d.id}
                value={d.id}
                className="bg-[#DFC39D]/60 text-[0.75rem] text-[#89482D]"
              >
                {d.fullName}
              </option>
            ))}
          </select>

          {/* 화살표 아이콘 커스텀 (appearance-none 사용 시 필요) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#89482D]">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
