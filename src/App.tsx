import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, MyPage, ShopPage, GitHubCallbackPage } from "./pages";
import CollectionPage from "./pages/CollectionPage";
import { AuthProvider } from "@/auth/AuthContext";
import { ViewportProvider } from "@/contexts/ViewportContext";

function App() {
  return (
    <AuthProvider>
      <ViewportProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </BrowserRouter>
      </ViewportProvider>
    </AuthProvider>
  );
}

export default App;
