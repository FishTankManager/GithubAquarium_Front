import { Footer, Header, FishTankTest, FishSpriteTest } from "@/components";
import fishSvgText from "@/assets/svg/fish_test.svg?raw";

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-sky-300">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-logo">Test Page</p>
        <p className="text-h1 font-vt">Test Page</p>
        <p className="text-h1 font-turret">Test Page</p>
        <p className="text-h1 font-kor">테스트 페이지</p>

        <FishTankTest width={400} height={400} className="bg-sky-200">
          <FishSpriteTest
            id="demo-01"
            svgSource={fishSvgText}
            personaWidthPercent={16}
            label="user123"
          />
          <FishSpriteTest
            id="demo-02"
            svgSource={fishSvgText}
            personaWidthPercent={12}
            label="user456"
          />
          <FishSpriteTest
            id="demo-03"
            svgSource={fishSvgText}
            personaWidthPercent={10}
            label="user789"
          />
        </FishTankTest>
      </main>
      <Footer />
    </div>
  );
}
