import { Footer, Header } from "@/components";

export default function MainPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-sky-300">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-logo">Main Page</p>
        <p className="text-h1 font-vt">Main Page</p>
        <p className="text-h1 font-turret">Main Page</p>
        <p className="text-h1 font-kor">메인 페이지</p>
      </main>
      <Footer />
    </div>
  );
}
