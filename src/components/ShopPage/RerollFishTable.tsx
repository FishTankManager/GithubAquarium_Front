// components/ShopPage/RerollFishTable.tsx
import React, { useEffect, useState } from "react";
import { getAquariumDetail } from "@/apis/aquarium";
import type { AquariumDetail } from "@/types/aquarium";
import type { Fish } from "@/types/fish";

type Props = {
  selectedFishId: number | null;
  onSelect: (id: number) => void;
};

type Row = {
  id: number;
  groupCode: string;
  maturity: string;
  repo: string;
  contribution: number;
};

/** 리롤 테이블에서 필요한 필드만 확장한 로컬 타입 */
type FishForReroll = Fish & {
  group_code?: string;
  maturity?: string;
  repository_name?: string;
  repo_name?: string;
  repository?: string;
  repo?: string;
  contribution?: number;
  commit_count?: number;
};

const RerollFishTable: React.FC<Props> = ({ selectedFishId, onSelect }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data: AquariumDetail = await getAquariumDetail();

        if (!mounted) return;

        const mapped: Row[] = data.fish_list.map((f) => {
          const fish = f as FishForReroll;

          const fullRepo =
            fish.repository_name ?? fish.repo_name ?? fish.repository ?? fish.repo ?? "-";

          const repoShort =
            typeof fullRepo === "string" ? (fullRepo.split("/").pop() ?? fullRepo) : "-";

          return {
            id: fish.id,
            groupCode: fish.group_code ?? "-",
            maturity: fish.maturity ?? "-",
            repo: repoShort,
            contribution: fish.contribution ?? fish.commit_count ?? 0,
          };
        });

        setRows(mapped);
      } catch {
        setError("물고기 목록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="mt-4 text-center text-sm text-slate-600">물고기 목록 로딩 중...</div>;
  }

  if (error) {
    return <div className="mt-4 text-center text-sm text-red-500">{error}</div>;
  }

  return (
    <section className="w-full max-w-[480px]">
      <div
        className="custom-scrollbar max-h-64 overflow-y-auto rounded-2xl p-4 shadow-lg ring-1 ring-white/40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.25) 100%)",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* 헤더: grid 템플릿을 행과 동일하게 */}
        <div className="mb-3 grid grid-cols-[100px_90px_1fr_90px] items-center gap-2">
          <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">GROUP</h4>
          <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">MATURITY</h4>
          <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">REPO</h4>
          <h4 className="font-vt text-center text-sm tracking-wider text-[#5A2B55]">COMMITS</h4>
        </div>

        {/* 리스트 */}
        <div className="space-y-2">
          {rows.map((f) => {
            const isSelected = f.id === selectedFishId;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(f.id)}
                className={`grid w-full grid-cols-[100px_90px_1fr_90px] items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors ${
                  isSelected ? "bg-white/80 ring-2 ring-[#5A2B55]" : "bg-white/20 hover:bg-white/40"
                }`}
              >
                {/* GROUP */}
                <div className="font-vt text-center text-xs text-[#5A2B55] sm:text-sm">
                  {f.groupCode}
                </div>

                {/* MATURITY */}
                <div className="font-vt text-center text-xs text-[#5A2B55] sm:text-sm">
                  {f.maturity}
                </div>

                {/* REPO (마지막 / 뒤 이름만) */}
                <div className="font-vt truncate text-center text-xs text-[#5A2B55] sm:text-sm">
                  {f.repo}
                </div>

                {/* COMMITS */}
                <div className="font-vt text-center text-xs text-[#5A2B55] sm:text-sm">
                  {f.contribution}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RerollFishTable;
