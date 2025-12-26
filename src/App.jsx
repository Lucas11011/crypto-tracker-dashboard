import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { CoinDetail } from "./pages/CoinDetail";

function App() {
  return <BrowserRouter>
    <Routes>
      {/* Route to the homepage */}
      <Route path="/" element={<Home />} />
      {/* Param route, dynamic route that has a variable id */}
      <Route path="/coin/:id" element={<CoinDetail />} />
    </Routes>
  </BrowserRouter>
}

export default App
