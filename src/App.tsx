import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Buy from "./pages/Buy";
import Blog from "./pages/Blog";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import AddGpuForm from "./pages/GPUBuy";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("authentication") === "true";
  });
  useEffect(() => {
    localStorage.setItem("authentication", String(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Layout isAuthenticated={isAuthenticated} logout={logout} />}
        >
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login login={login} />} />
          <Route path="buy-gpu" element={<Buy />} />
          <Route path="add-gpus" element={<AddGpuForm />} />
          <Route path="blog" element={<Blog />} />
          <Route path="docs" element={<Docs />} />
          <Route path="contact" element={<Contact />} />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
