import { Header } from "@/components";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-sky-300">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-sixtyfour">Main Page</p>
        <p className="text-h1 font-vt323">Main Page</p>
        <p className="text-h1">메인 페이지</p>
      </main>
    </div>
  );
}
