import { GithubLogo } from "@/assets/svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoText, GithubLoginModal } from "@/components";

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSubmit = async ({ username, password }: { username: string; password: string }) => {
    console.log(username, password);
    setOpen(false);
  };

  const handleGoogle = () => {
    // TODO: 구글 Auth 시작
    console.log("google");
  };

  return (
    <header className="sticky top-0 z-50 flex h-24 w-full items-start justify-between bg-white/30 px-8 pt-6 backdrop-blur">
      <div className="flex w-50 pt-1">
        <LogoText
          onClick={() => {
            navigate("/");
          }}
          text={"GITHUB\nAQUARIUM"}
          className="cursor-pointer text-center text-lg leading-none"
        />
      </div>

      <nav className="font-turret flex items-center justify-center gap-24 text-lg text-black">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="cursor-pointer"
        >
          HOME
        </button>
        <button
          onClick={() => {
            navigate("/my");
          }}
          className="cursor-pointer"
        >
          MY AQUARIUM
        </button>
        <button
          onClick={() => {
            navigate("/shop");
          }}
          className="cursor-pointer"
        >
          SHOP
        </button>
      </nav>

      <button
        onClick={() => setOpen(true)}
        className="font-turret flex w-54 items-center justify-center gap-2.5 rounded-full border bg-white px-4 py-2 text-lg text-black"
      >
        <GithubLogo className="h-6 w-6" />
        <p>Login with GitHub</p>
      </button>

      <GithubLoginModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        onGoogle={handleGoogle}
      />
    </header>
  );
}
