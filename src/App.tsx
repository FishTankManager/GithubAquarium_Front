import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, MyPage, ShopPage } from "./pages";
import CollectionPage from "./pages/CollectionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </BrowserRouter>
import { MainPage, MyPage, ShopPage, TestPage, GitHubCallbackPage } from "./pages";
import { AuthProvider } from "@/auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
