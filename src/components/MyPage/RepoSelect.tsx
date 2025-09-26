import { RepoInfo } from "@/types/aquarium";

const DUMMIES: RepoInfo[] = [
  { id: "r1", fullName: "Repo1", contributions: 120 },
  { id: "r2", fullName: "Repo2", contributions: 914 },
  { id: "r3", fullName: "Repo3", contributions: 42 },
];

export default function RepoSelect({
  value,
  onChange,
}: {
  value: RepoInfo | null;
  onChange: (r: RepoInfo | null) => void;
}) {
  return (
    <div className="relative w-full">
      <select
        className="font-abeezee w-full appearance-none rounded-md border border-white/50 bg-[#3E548E] px-3 py-3 pr-10 pl-7 text-white shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
        value={value?.id ?? ""}
        onChange={(e) => onChange(DUMMIES.find((d) => d.id === e.target.value) ?? null)}
      >
        <option value="" disabled hidden className="text-[#B2B2B2]">
          Select a repository to visit!
        </option>
        {DUMMIES.map((d) => (
          <option key={d.id} value={d.id}>
            {d.fullName}
          </option>
        ))}
      </select>

      {/* 오른쪽 간격 조절을 위한.. 커스텀 화살표 */}
      <span className="pointer-events-none absolute inset-y-0 right-10 flex items-center text-white">
        ▼
      </span>
    </div>
  );
}
