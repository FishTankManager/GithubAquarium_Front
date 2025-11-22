const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID as string;
const redirectUri = import.meta.env.VITE_GITHUB_CALLBACK_URL as string;

const scope = ["user", "repo", "read:org"].join(" ");

export function redirectToGitHubLogin() {
  if (!clientId || !redirectUri) {
    console.error("GitHub OAuth env variables are missing", {
      clientId,
      redirectUri,
    });
    return;
  }

  const state = crypto.randomUUID();
  localStorage.setItem("github_oauth_state", state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  window.location.href = `${GITHUB_AUTHORIZE_URL}?${params.toString()}`;
}
