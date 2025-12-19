import { Footer, Header, FishTankPreview } from "@/components"; // FishTankPreview 추가
import LogoText from "@/components/LogoText";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Fish } from "@/types/fish"; // Fish 타입 추가

// 1. Mock 데이터 추가 (FishTank에 표시될 데이터)
const mockFishList: Fish[] = [
  {
    id: 101,
    name: "SpaceOcto_4",
    github_username: "Jongpippan",
    group_code: "SpaceOcto",
    maturity: 4,
    repository_name: "octo-space/frontend",
    commit_count: 132,
    unlocked_at: "2024-11-20T12:00:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 101,
    name: "RBFishbun_3",
    github_username: "Imggaggu",
    group_code: "RBFishbun",
    maturity: 3,
    repository_name: "octo-space/frontend",
    commit_count: 142,
    unlocked_at: "2024-11-20T12:00:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 101,
    name: "ShrimpWich_5",
    github_username: "SuhyunBan",
    group_code: "ShrimpWich",
    maturity: 5,
    repository_name: "octo-space/frontend",
    commit_count: 124,
    unlocked_at: "2024-11-20T12:00:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 102,
    name: "RBFishbun_2",
    github_username: "eileen914",
    group_code: "RBFishbun",
    maturity: 2,
    repository_name: "shrimpwich/engine",
    commit_count: 117,
    unlocked_at: "2024-10-03T09:30:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
  {
    id: 104,
    name: "LaptopSunfish",
    github_username: "jay20012024",
    group_code: "LaptopSunfish",
    maturity: 4,
    repository_name: "suntech/laptop-ui",
    commit_count: 155,
    unlocked_at: "2024-07-12T11:20:00Z",
    is_visible_in_aquarium: true,
    is_visible_in_fishtank: true,
  },
];

export default function MainPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseWidth = 768;
  const baseThreshold1 = 900;
  const baseThreshold2 = 1600;

  const scrollThreshold1 =
    windowWidth <= baseWidth
      ? Math.max(300, Math.floor((baseThreshold1 * windowWidth * 0.7) / baseWidth))
      : baseThreshold1;
  const scrollThreshold2 =
    windowWidth <= baseWidth
      ? Math.max(600, Math.floor((baseThreshold2 * windowWidth * 0.7) / baseWidth))
      : baseThreshold2;

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden">
      {/* 배경 설정 */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/images/main/background.png')",
          backgroundSize: "cover",
          animation: "waterMove 2s ease-in-out infinite",
        }}
      />

      <div className="fixed top-0 left-0 z-50 w-full">
        <Header />
      </div>

      {/* Hero 섹션 */}
      <section
        id="home"
        className="mx-auto mb-16 flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-4 pt-64 md:mb-32 md:pt-64"
      >
        <LogoText
          text={`GITHUB\nAQUARIUM`}
          className="font-sixtyfour xs:text-xl text-center leading-tight tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-3xl md:text-5xl lg:text-7xl"
        />
        <div className="mt-35 flex flex-col items-center justify-center">
          <div className="xs:text-md inline-flex items-center justify-center rounded-md px-4 py-2 text-white backdrop-blur sm:text-lg md:text-xl lg:text-2xl">
            Own your Aquarium in Github.
          </div>
          <img
            src="/images/main/bottomIcon.png"
            alt="down arrow"
            className="mt-4 h-6 w-6 animate-bounce"
          />
        </div>
      </section>

      {/* 2. FishTank Preview 섹션: example.png를 컴포넌트로 교체 */}
      <section className="mt-6 flex w-full justify-center px-12 md:mt-10">
        <div className="relative w-full max-w-4xl rounded-[1.5rem] border border-white/60 bg-white/70 p-3 shadow-2xl backdrop-blur md:rounded-[3.5rem] md:p-6">
          {/* 1. aspect-[16/9]로 비율 고정 
            2. overflow-hidden으로 내부 물고기 이탈 방지
          */}
          <div className="relative aspect-video w-full overflow-hidden rounded-[1rem] bg-sky-100/30 md:rounded-[2.5rem]">
            <FishTankPreview
              // 부모 div의 실제 렌더링 크기를 100% 채우도록 설정
              width={windowWidth > 896 ? 896 : windowWidth - 96} // max-w-4xl(896px) 기준
              height={(windowWidth > 896 ? 896 : windowWidth - 96) * 0.5625} // 16:9 비율 유지
              className="h-full w-full"
              repositoryName="GitHub Aquarium"
              fishList={mockFishList}
            />
          </div>

          {/* 하단 그림자 효과 */}
          <div className="absolute -right-4 -bottom-4 -left-4 h-8 rounded-3xl bg-black/10 blur" />
        </div>
      </section>

      {/* Explore 섹션 */}
      <div className="relative mt-40 flex min-h-[37vh] w-full flex-col items-center justify-between md:mt-50 xl:mt-70">
        <LogoText
          text={`Explore`}
          className="font-sixtyfour xs:text-2xl text-center text-xl leading-tight tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:text-[2.1rem] md:text-5xl lg:text-6xl"
        />
        <img
          src="/images/main/explore.png"
          alt="explore"
          className="xs:mt-5 z-10 mx-auto rounded-[1.5rem] object-cover sm:mt-8 md:mt-12 md:rounded-[3rem] xl:mt-18"
          style={{ width: `${windowWidth * 0.8}px` }}
        />

        {/* 장식용 미역들 */}
        <img
          src="/images/main/seaweed-green.png"
          alt="seaweed"
          className={`pointer-events-none absolute right-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
          style={{
            width: `${windowWidth * 0.42}px`,
            top: "8%",
            transform:
              scrollY > scrollThreshold1
                ? "translateY(-50%) translateX(0)"
                : "translateY(-50%) translateX(400px)",
            opacity: scrollY > scrollThreshold1 ? 1 : 0,
            zIndex: 20,
          }}
        />
        <img
          src="/images/main/seaweed-red.png"
          alt="seaweed2"
          className={`pointer-events-none absolute left-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
          style={{
            width: `${windowWidth * 0.4}px`,
            top: "110%",
            transform:
              scrollY > scrollThreshold2
                ? "translateY(-50%) translateX(0)"
                : "translateY(-50%) translateX(-400px)",
            opacity: scrollY > scrollThreshold2 ? 1 : 0,
            zIndex: 20,
          }}
        />

        {/* 메뉴 이동 버튼 (말풍선) */}
        <img
          src="/images/main/myaquariumtextbox.png"
          alt="my aquarium"
          className="absolute z-30 cursor-pointer transition-all duration-300 hover:scale-110"
          style={{
            width: `${windowWidth * 0.2}px`,
            bottom: "24%",
            left: "3%",
          }}
          onClick={() => navigate("/my")}
        />
        <img
          src="/images/main/shoptextbox.png"
          alt="shop"
          className="absolute z-30 cursor-pointer object-cover transition-all duration-300 hover:scale-110"
          style={{
            width: `${windowWidth * 0.2}px`,
            bottom: "-20%",
            right: "3%",
          }}
          onClick={() => navigate("/shop")}
        />
      </div>

      {/* 하단 설명 섹션 */}
      <section className="mx-auto mt-40 w-full max-w-3xl px-6 text-center text-[#561B51] md:mt-68">
        <div className="font-vt323 space-y-2 text-sm leading-3 sm:text-lg sm:leading-5 md:text-2xl md:leading-7 lg:text-3xl">
          <p>🐟 Ready to raise your own fish?</p>
          <p>Start your project, adopt a fish,</p>
          <p>and grow it with every commit.</p>
          <p>🌊 50+ unique species are waiting for you.</p>
          <p>Show off your contributions at a glance</p>
        </div>
        <button
          className="font-vt323 mt-8 inline-flex items-center justify-center rounded-full bg-[#3F3F3F] px-4 py-2 text-sm text-[#D7B9B9] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#7A7A7A] sm:mt-12 sm:text-xl md:mt-18 md:px-6 md:py-3 md:text-2xl"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          raise your own fish now!
        </button>
      </section>

      {/* 하단 장식 요소 */}
      <div className="relative h-[28rem] w-full md:h-[56rem]">
        <div className="absolute bottom-0 flex w-full items-end justify-between">
          <img
            src="/images/main/sand-left.png"
            alt="sand left"
            className="z-30"
            style={{ width: `${windowWidth * 0.4}px` }}
          />
          <img
            src="/images/main/sand-right.png"
            alt="sand right"
            className="z-30"
            style={{ width: `${windowWidth * 0.4}px` }}
          />
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex w-full items-end justify-between">
          <img
            src="/images/main/seaweed-green2.png"
            alt="seaweed left"
            className="z-30"
            style={{ width: `${windowWidth * 0.4}px` }}
          />
          <img
            src="/images/main/clam.png"
            alt="clam"
            className="z-30 -mb-2 lg:-mb-5"
            style={{ width: `${windowWidth * 0.4}px` }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
