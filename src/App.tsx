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
import ContainerManagement from "./components/ContainerManagement.tsx";
import ContainerAccess from "./components/ContainerOperations.tsx";
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
      
          


          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route index element={<Home />} />
            <Route path="buy-gpu" element={<Buy />} />
          <Route path="add-gpus/:key" element={<AddGpuForm />} />
          <Route path="blog" element={<Blog />} />
          <Route path="docs" element={<Docs />} />
          <Route path="contact" element={<Contact />} />
          {/* <Route path="terminal" element={<CustomTerminal />} /> */}
          <Route path="container" element={<ContainerManagement />} />
          <Route path="containerTerminal" element={<ContainerAccess />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
