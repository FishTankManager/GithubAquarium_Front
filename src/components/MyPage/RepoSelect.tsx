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
    <div className="w-full">
      <label className="font-turret mb-1 block text-sm">Select a repository to visit!</label>
      <select
        className="w-full rounded border bg-white/90 px-3 py-2"
        value={value?.id ?? ""}
        onChange={(e) => onChange(DUMMIES.find((d) => d.id === e.target.value) ?? null)}
      >
        <option value="">-- Select --</option>
        {DUMMIES.map((d) => (
          <option key={d.id} value={d.id}>
            {d.fullName}
          </option>
        ))}
      </select>
    </div>
  );
}
