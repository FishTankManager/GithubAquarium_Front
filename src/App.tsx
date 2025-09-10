import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage, MyPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
