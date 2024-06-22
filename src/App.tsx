import { Routes, Route } from "react-router-dom";
import { Categories } from "./pages/Categories";
import { Products } from "./pages/Products";

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default App;
