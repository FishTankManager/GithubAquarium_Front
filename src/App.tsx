import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, MyPage, ShopPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
