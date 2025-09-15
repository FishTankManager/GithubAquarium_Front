import { useEffect, useRef, useState } from "react";
import { GithubLogo, GoogleLogo } from "@/assets/svg";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (cred: { username: string; password: string }) => void | Promise<void>;
  onGoogle?: () => void;
};

export default function GithubLoginModal({ isOpen, onClose, onSubmit, onGoogle }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) await onSubmit({ username, password });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-112 rounded-xl bg-white text-gray-900 shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8">
          <GithubLogo className="h-10 w-10 text-black" />
          <h2 className="text-xl font-semibold">Sign in with GitHub</h2>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-6 pt-6 pb-4">
          <p className="mb-2 text-sm">Username or email address</p>
          <input
            ref={firstInputRef}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="write your username or email"
          />

          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm">Password</p>
            <button
              onClick={() => {
                console.log("forgot password");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="write your password"
          />

          <button
            type="submit"
            className="mb-4 w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Sign in
          </button>

          {/* 구분선 */}
          <div className="relative my-4">
            <div className="h-px w-full bg-gray-200 dark:bg-zinc-800" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-2 text-xs text-gray-500 dark:bg-zinc-900 dark:text-zinc-400">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={onGoogle}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          >
            <GoogleLogo className="h-4 w-4" />
            Continue with Google
          </button>

          <div className="flex flex-col items-center gap-2 pb-4 text-sm">
            <div className="text-gray-600">
              New to GitHub?{" "}
              <button
                type="button"
                onClick={() => {
                  console.log("create account");
                }}
                className="text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("passkey");
              }}
              className="text-blue-600 hover:underline"
            >
              Sign in with a passkey
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
