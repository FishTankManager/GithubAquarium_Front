import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, MyPage, ShopPage, TestPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
