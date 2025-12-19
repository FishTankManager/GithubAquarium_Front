import { Footer, Header, FishTankPreview, AquariumPreview } from "@/components";
import type { Fish } from "@/types/fish";
import { getAquariumDetail } from "@/apis/aquarium";

const mockFishList: Fish[] = [
  {
    id: 101,
    name: "SpaceOcto_6", // species
    github_username: "alice", // 소유자
    group_code: "SpaceOcto",
    maturity: 3,
    repository_name: "octo-space/frontend",
    commit_count: 42,
    unlocked_at: "2024-11-20T12:00:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 102,
    name: "ShrimpWich_6",
    github_username: "bob",
    group_code: "ShrimpWich",
    maturity: 2,
    repository_name: "shrimpwich/engine",
    commit_count: 17,
    unlocked_at: "2024-10-03T09:30:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 103,
    name: "SPFishbun_3",
    github_username: "charlie",
    group_code: "Fishbun",
    maturity: 1,
    repository_name: "bakery/fishbun-core",
    commit_count: 8,
    unlocked_at: "2024-08-15T15:00:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: false, // 피시탱크에서는 안 보임
  },
  {
    id: 104,
    name: "LaptopSunfish",
    github_username: "diana",
    group_code: "LaptopSunfish",
    maturity: 4,
    repository_name: "suntech/laptop-ui",
    commit_count: 105,
    unlocked_at: "2024-07-12T11:20:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
];

export default function TestPage() {
  const aquarium = getAquariumDetail();
  console.log(aquarium);
  return (
    <div className="flex min-h-screen flex-col justify-between bg-sky-300">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-logo">Test Page</p>
        <p className="text-h1 font-vt">Test Page</p>
        <p className="text-h1 font-turret">Test Page</p>
        <p className="text-h1 font-kor">테스트 페이지</p>

        <FishTankPreview
          width={480}
          height={300}
          className="relative overflow-hidden rounded-2xl shadow-lg"
          repositoryName="Jongpippan Repo"
          fishList={mockFishList}
          backgroundName="Bg Ocean"
        />

        <AquariumPreview
          width={480}
          height={300}
          className="relative overflow-hidden rounded-2xl shadow-lg"
          fishList={mockFishList}
          backgroundName="Bg Deep 2"
        />
      </main>
      <Footer />
    </div>
  );
}
