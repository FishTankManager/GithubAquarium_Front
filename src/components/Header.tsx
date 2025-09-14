import { GithubLogo } from "@/assets/svg";
import { LogoText } from "@/components";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between bg-gray-600/50 px-8 py-6">
      <div className="flex w-50">
        <LogoText text={"GITHUB\nAQUARIUM"} className="text-center leading-none" />
      </div>

      <nav className="font-turret flex items-center justify-center gap-12">
        <button>HOME</button>
        <button>MY AQUARIUM</button>
        <button>SHOP</button>
      </nav>

      <div className="font-turret flex w-50 items-center justify-center gap-2 rounded-full border bg-white px-4 py-2 text-black">
        <GithubLogo />
        <p>Login with Github</p>
      </div>
    </header>
  );
}
