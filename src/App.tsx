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
  );
}

export default App;
