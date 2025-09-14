import { Header } from "@/components";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col items-center justify-center text-black">
        <p className="text-h1 font-logo">My Page</p>
        <p className="text-h1 font-vt">My Page</p>
        <p className="text-h1 font-turret">My Page</p>
        <p className="text-h1">마이페이지</p>
      </main>
    </div>
  );
}
