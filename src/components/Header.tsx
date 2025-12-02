import { GithubLogo } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components";
import { redirectToGitHubLogin } from "@/auth/githubAuth";
import { useAuth } from "@/auth/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-24 w-full items-center justify-between bg-white/30 px-8 backdrop-blur">
      <div className="flex w-50 pt-1">
        <LogoText
          onClick={() => {
            navigate("/");
          }}
          text={"GITHUB\nAQUARIUM"}
          className="cursor-pointer text-center text-lg leading-none"
        />
      </div>

      <nav className="font-turret flex h-full items-center justify-center gap-24 pb-6 text-lg text-black">
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
        <button
          onClick={() => {
            navigate("/collection");
          }}
          className="cursor-pointer"
        >
          COLLECTION
        </button>
      </nav>

      {loading ? (
        <div className="font-turret flex items-center justify-center text-sm text-gray-600">
          loading...
        </div>
      ) : user ? (
        <div className="flex items-center gap-3">
          {user.avatar_url && (
            <img src={user.avatar_url} alt="avatar" className="h-8 w-8 rounded-full" />
          )}
          <span className="text-sm text-gray-800">{user.github_username ?? "Unknown"}</span>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="font-turret rounded-full border bg-white px-4 py-2 text-sm text-black"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={redirectToGitHubLogin}
          className="font-turret flex w-54 items-center justify-center gap-2.5 rounded-full border bg-white px-4 py-2 text-lg text-black"
        >
          <GithubLogo className="h-6 w-6" />
          <p>Login with GitHub</p>
        </button>
      )}
    </header>
  );
}
