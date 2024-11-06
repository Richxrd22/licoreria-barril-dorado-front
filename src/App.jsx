import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import Progress from "./componentes/Progress";
import Navegador from "./componentes/Navegador";
import { NextUIProvider } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
const NotFound = lazy(() => import("./paginas/NotFound"));
const Login = lazy(() => import("./paginas/Login"));
const Panel = lazy(() => import("./paginas/Panel"));
const Producto = lazy(() => import("./paginas/Producto"));
const Proveedor = lazy(() => import("./paginas/Proveedor"));
const Empleados = lazy(() => import("./paginas/Empleados"));
const Empresa = lazy(() => import("./paginas/Empresa"));
function App() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();


  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAuthenticated(true);
      setRole(decodedToken.id_rol);
    }
  }, []);

  useEffect(() => {
    const handledRoutes = [
      "/",
      "/producto",
      "/panel",
      "/empleados",
      "/empresa",
      "/proveedor",
      "/perfil",
      "/configuracion",
    ];
    setHideNavbar(!handledRoutes.includes(location.pathname));
  }, [location.pathname]);
  return (
    <>
      {!hideNavbar && <Navegador />}
      <Suspense fallback={<Progress />}>
        <Routes>

          <Route path="/" element={<Panel />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/proveedor" element={<Proveedor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
