import { Footer, Header } from "@/components";
import LogoText from "@/components/LogoText";

export default function MainPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-sky-300 bg-[url('/background.png')] bg-cover bg-center">
      <div className="fixed top-0 left-0 z-50 w-full">
        <Header />
      </div>
      <section
        id="home"
        className="mx-auto mb-16 flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-4 pt-32 md:mb-32 md:pt-64"
      >
        <LogoText
          text={`GITHUB\nAQUARIUM`}
          className="font-sixtyfour text-center text-5xl leading-tight tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] md:text-7xl"
        />
        <div className="mt-35 flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center rounded-md px-4 py-2 text-2xl text-white backdrop-blur">
            Own your Aquarium in Github.
          </div>
          <img src="/bottomIcon.png" alt="down arrow" className="mt-4 h-6 w-6 animate-bounce" />
        </div>
      </section>
      {/* Showcase Card */}
      <section className="mt-6 flex w-full justify-center px-4 md:mt-10">
        <div className="relative w-full max-w-4xl rounded-[4.5rem] border border-white/60 bg-white/70 p-8 shadow-2xl backdrop-blur md:p-12">
          <img src="/example.png" className="h-full w-full object-cover" />
          <div className="absolute -right-4 -bottom-4 -left-4 h-8 rounded-3xl bg-black/10 blur" />
        </div>
      </section>
      <div className="relative mt-40 flex w-full items-center justify-center md:mt-50">
        <LogoText
          text={`Explore`}
          className="font-sixtyfour text-center text-4xl leading-tight tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.25)] md:text-6xl"
        />
        <img
          src="/seaweed-green.png"
          alt="seaweed"
          className="absolute top-1/2 right-0 w-[21rem] -translate-y-1/2 md:w-[35rem]"
          style={{ pointerEvents: "none" }}
        />
      </div>
      <section className="mt-10 mb-20 flex w-full justify-center px-4 md:mt-20 md:mb-40">
        <div className="relative flex w-full max-w-4xl items-center">
          <img
            src="/myaquariumtextbox.png"
            alt="my aquarium"
            className="z-20 -mb-30 -ml-8 w-[9rem] md:-ml-16 md:w-[15rem]"
          />
          <img
            src="/explore.png"
            alt="explore"
            className="z-10 mx-auto -ml-25 w-full rounded-[3rem] object-cover md:-ml-50"
          />
          <img
            src="/shoptextbox.png"
            alt="shop"
            className="z-10 -mb-160 -ml-8 w-[9rem] object-cover md:-ml-16 md:w-[15rem]"
          />
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-3xl px-6 text-center text-[#561B51] md:mt-32">
        <div className="font-vt323 space-y-2 text-3xl leading-7">
          <p>🐟 Ready to raise your own Sunfish?</p>
          <p>Start your project, adopt a sunfish,</p>
          <p>and grow it with every commit.</p>
          <p>🌊 50+ unique species are waiting for you.</p>
          <p>Show off your contributions at a glance</p>
        </div>
        <button
          className="font-vt323 mt-6 inline-flex items-center justify-center rounded-full bg-[#3F3F3F] px-6 py-3 text-2xl text-[#D7B9B9] shadow-lg transition-colors hover:bg-[#7A7A7A]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          raise your Sunfish now!
        </button>
      </section>

      <div className="relative h-[28rem] w-full md:h-[56rem]">
        <div className="absolute right-0 bottom-0 left-0 flex w-full items-end justify-between">
          <img src="/sand-left.png" alt="sand left" className="z-30 w-[28rem] md:w-[45rem]" />
          <img src="/sand-right.png" alt="sand right" className="z-30 w-[28rem] md:w-[45rem]" />
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex w-full items-end justify-between">
          <img
            src="/seaweed-green2.png"
            alt="seaweed left"
            className="z-30 w-[28rem] md:w-[30rem]"
          />
          <img src="/clam.png" alt="clam" className="z-30 w-[28rem] md:w-[30rem]" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
