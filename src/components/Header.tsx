import { GithubLogo } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import { LogoText } from "@/components";
import { redirectToGitHubLogin } from "@/auth/githubAuth";
import { useAuth } from "@/auth/AuthContext";
import { useViewport } from "@/contexts/useViewport";

export default function Header() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { isMobile } = useViewport();

  return (
    <header
      className={`sticky top-0 z-50 flex w-full items-center justify-between bg-white/30 backdrop-blur ${
        isMobile ? "h-16 px-2 sm:px-4" : "h-24 px-8"
      }`}
    >
      <div className={`flex ${isMobile ? "w-32" : "w-50"} pt-1`}>
        <LogoText
          onClick={() => {
            navigate("/");
          }}
          text={"GITHUB\nAQUARIUM"}
          className={`cursor-pointer text-center leading-none ${isMobile ? "text-base sm:text-lg" : "text-lg"}`}
        />
      </div>

      <nav
        className={`font-turret flex h-full items-center justify-center text-black ${
          isMobile ? "gap-2 text-base sm:gap-4 sm:text-lg" : "gap-24 text-lg"
        }`}
      >
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
          {isMobile ? "MY" : "MY AQUARIUM"}
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
          {isMobile ? "COLLECT" : "COLLECTION"}
        </button>
      </nav>

      {loading ? (
        <div
          className={`font-turret flex items-center justify-center text-gray-600 ${isMobile ? "text-base" : "text-sm"}`}
        >
          loading...
        </div>
      ) : user ? (
        <div className={`flex items-center ${isMobile ? "gap-1 sm:gap-2" : "gap-3"}`}>
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt="avatar"
              className={`rounded-full ${isMobile ? "h-6 w-6" : "h-8 w-8"}`}
            />
          )}
          {!isMobile && (
            <span className="text-sm text-gray-800">{user.github_username ?? "Unknown"}</span>
          )}
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className={`font-turret rounded-full border bg-white text-black ${
              isMobile ? "px-2 py-1 text-base" : "px-4 py-2 text-sm"
            }`}
          >
            {isMobile ? "Out" : "Logout"}
          </button>
        </div>
      ) : (
        <button
          onClick={redirectToGitHubLogin}
          className={`font-turret flex items-center justify-center gap-2 rounded-full border bg-white text-black ${
            isMobile
              ? "w-auto px-2 py-1 text-base sm:px-3 sm:py-1.5 sm:text-lg"
              : "w-54 gap-2.5 px-4 py-2 text-lg"
          }`}
        >
          <GithubLogo className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          {isMobile ? <p className="hidden sm:inline">Login</p> : <p>Login with GitHub</p>}
        </button>
      )}
    </header>
  );
}
