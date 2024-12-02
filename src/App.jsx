import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import Progress from "./componentes/Progress";
import Navegador from "./componentes/Navegador";
import { jwtDecode } from "jwt-decode";
import { FormularioProvider } from "./context/FormularioContext";
import PrivateRoute from "./adicionales/PrivateRoute";
import { validateToken } from "./services/ValidarTokenService";
import { useDecodedToken } from "./hook/useDecodedToken";
import { AlertProvider } from "./context/AlertContext";
import AlertaProducto from "./componentes/AlertaProducto";
import Categoria from "./paginas/Categoria";

const NotFound = lazy(() => import("./paginas/NotFound"));
const Login = lazy(() => import("./paginas/Login"));
const Panel = lazy(() => import("./paginas/Panel"));
const Producto = lazy(() => import("./paginas/Producto"));
const Proveedor = lazy(() => import("./paginas/Proveedor"));
const Empleados = lazy(() => import("./paginas/Empleados"));
const Empresa = lazy(() => import("./paginas/Empresa"));
const Confirmacion = lazy(() => import("./componentes/Confirmacion"));

function App() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rol } = useDecodedToken();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkToken = async () => {
        const isValid = await validateToken(token);
        if (!isValid) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setRole(null);
          navigate("/");
        } else {
          setIsAuthenticated(true);
        }
        setLoading(false);
      };
      checkToken();
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const handledRoutes = [
      "/",
      "/admin/panel",
      "/admin/producto",
      "/admin/empleado",
      "/admin/empresa",
      "/admin/proveedor",
      "/empleado/panel",
      "/empleado/producto",
      "/empleado/empresa",
      "/empleado/proveedor",
      "/empleado/producto/confirmacion",
      "/empleado/empleado/confirmacion",
      "/empleado/empresa/confirmacion",
      "/empleado/proveedor/confirmacion",
      "/admin/producto/confirmacion",
      "/admin/empleado/confirmacion",
      "/admin/empresa/confirmacion",
      "/admin/proveedor/confirmacion",
      "/admin/categoria/confirmacion",
      "/admin/categoria",
    ];
    setHideNavbar(!handledRoutes.includes(location.pathname));
  }, [location.pathname]);

  const shouldShowNavbar = () => isAuthenticated && !hideNavbar;

  if (loading) {
    return <Progress />;
  }

  return (
    <FormularioProvider>
      <AlertProvider>
        <div className="App">
          {shouldShowNavbar() && <Navegador />}
          <Suspense fallback={<Progress />}>
            {isAuthenticated && rol && <RoutesAdministrador />}
            {isAuthenticated && !rol && <RoutesEmpleados />}
            {!isAuthenticated && <PublicRoutes />}
          </Suspense>
        </div>

        {isAuthenticated && <AlertaProducto />}
      </AlertProvider>
    </FormularioProvider>
  );
}

function RoutesAdministrador() {
  return (
    <Routes>
      <Route path="/admin/panel" element={<Panel />} />
      <Route path="/admin/empleado" element={<Empleados />} />
      <Route
        path="/admin/empleado/confirmacion"
        element={<PrivateRoute formType="empleado" />}
      >
        <Route index element={<Confirmacion ruta={"/admin/empleado"} />} />
      </Route>
      <Route path="/admin/empresa" element={<Empresa />} />
      <Route
        path="/admin/empresa/confirmacion"
        element={<PrivateRoute formType="empresa" />}
      >
        <Route index element={<Confirmacion ruta={"/admin/empresa"} />} />
      </Route>
      <Route path="/admin/proveedor" element={<Proveedor />} />
      <Route
        path="/admin/proveedor/confirmacion"
        element={<PrivateRoute formType="proveedor" />}
      >
        <Route index element={<Confirmacion ruta={"/admin/proveedor"} />} />
      </Route>
      <Route path="/admin/categoria" element={<Categoria />} />

      <Route
        path="/admin/categoria/confirmacion"
        element={<PrivateRoute formType="categoria" />}
      >
        <Route index element={<Confirmacion ruta={"/admin/categoria"} />} />
      </Route>

      <Route path="/admin/producto" element={<Producto />} />
      <Route
        path="/admin/producto/confirmacion"
        element={<PrivateRoute formType="producto" />}
      >
        <Route index element={<Confirmacion ruta={"/admin/producto"} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function RoutesEmpleados() {
  return (
    <Routes>
      <Route path="/empleado/categoria" element={<Categoria />} />
      <Route path="/empleado/panel" element={<Panel />} />
      <Route path="/empleado/empresa" element={<Empresa />} />
      <Route
        path="/empleado/empresa/confirmacion"
        element={<PrivateRoute formType="empresa" />}
      >
        <Route index element={<Confirmacion ruta={"/empleado/empresa"} />} />
      </Route>
      <Route path="/empleado/proveedor" element={<Proveedor />} />
      <Route
        path="/empleado/proveedor/confirmacion"
        element={<PrivateRoute formType="proveedor" />}
      >
        <Route index element={<Confirmacion ruta={"/empleado/proveedor"} />} />
      </Route>
      <Route path="/empleado/producto" element={<Producto />} />
      <Route
        path="/empleado/producto/confirmacion"
        element={<PrivateRoute formType="producto" />}
      >
        <Route index element={<Confirmacion ruta={"/empleado/producto"} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
