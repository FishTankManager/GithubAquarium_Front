import { Footer, Header, TankRenderer, FishSprite } from "@/components";
import {
  LaptopSunfish,
  SpaceOcto_1,
  SpaceOcto_2,
  SpaceOcto_3,
  SpaceOcto_4,
  SpaceOcto_5,
  SpaceOcto_6,
} from "@/assets/svg/FishSprites";

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-sky-300">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-logo">Test Page</p>
        <p className="text-h1 font-vt">Test Page</p>
        <p className="text-h1 font-turret">Test Page</p>
        <p className="text-h1 font-kor">테스트 페이지</p>

        <TankRenderer width={400} height={400} className="bg-sky-200">
          <FishSprite
            id="demo-00"
            svgSource={LaptopSunfish}
            personaWidthPercent={10}
            label="user123"
          />
          <FishSprite
            id="demo-01"
            svgSource={SpaceOcto_1}
            personaWidthPercent={14}
            label="SpaceOcto_1"
          />
          <FishSprite
            id="demo-02"
            svgSource={SpaceOcto_2}
            personaWidthPercent={14}
            label="SpaceOcto_2"
          />
          <FishSprite
            id="demo-03"
            svgSource={SpaceOcto_3}
            personaWidthPercent={14}
            label="SpaceOcto_3"
          />
          <FishSprite
            id="demo-04"
            svgSource={SpaceOcto_4}
            personaWidthPercent={14}
            label="SpaceOcto_4"
          />
          <FishSprite
            id="demo-05"
            svgSource={SpaceOcto_5}
            personaWidthPercent={14}
            label="SpaceOcto_5"
          />
          <FishSprite
            id="demo-06"
            svgSource={SpaceOcto_6}
            personaWidthPercent={14}
            label="SpaceOcto_6"
          />
        </TankRenderer>
      </main>
      <Footer />
    </div>
  );
}
