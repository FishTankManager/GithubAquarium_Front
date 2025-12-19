import { Footer, Header, FishTankPreview } from "@/components";
import type { Contributor } from "@/types/fish";
import { getAquariumDetail } from "@/apis/aquarium";
// import {
//   LaptopSunfish,
//   SpaceOcto_1,
//   SpaceOcto_2,
//   SpaceOcto_3,
//   SpaceOcto_4,
//   SpaceOcto_5,
//   SpaceOcto_6,
// } from "@/assets/svg/FishSprites";

const mockContributors: Contributor[] = [
  {
    id: 1,
    user: "user123",
    commitCount: 42,
    fish: {
      id: 101,
      species: "SpaceOcto_6",
    },
  },
  {
    id: 2,
    user: "alice",
    commitCount: 17,
    fish: {
      id: 102,
      species: "ShrimpWich_6",
    },
  },
  {
    id: 3,
    user: "bob",
    commitCount: 5,
    fish: {
      id: 103,
      species: "SPFishbun_3",
    },
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

        {/* <TankRenderer width={400} height={400} className="bg-sky-200">
          <FishSprite
            id="demo-00"
            svgSource={LaptopSunfish}
            personaWidthPercent={10}
            label="user123"
          />
        </TankRenderer> */}
        <FishTankPreview
          width={480}
          height={300}
          className="relative overflow-hidden rounded-2xl shadow-lg"
          repositoryName="Jongpippan Repo"
          contributors={mockContributors}
          backgroundName="bg-1"
        />
      </main>
      <Footer />
    </div>
  );
}
