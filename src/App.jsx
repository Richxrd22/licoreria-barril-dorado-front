import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import Progress from "./componentes/Progress";
import Navegador from "./componentes/Navegador";
import { jwtDecode } from "jwt-decode";
import { FormularioProvider } from "./context/FormularioContext";
import PrivateRoute from "./adicionales/PrivateRoute";
const NotFound = lazy(() => import("./paginas/NotFound"));
const Login = lazy(() => import("./paginas/Login"));
const Panel = lazy(() => import("./paginas/Panel"));
const Producto = lazy(() => import("./paginas/Producto"));
const Proveedor = lazy(() => import("./paginas/Proveedor"));
const Empleados = lazy(() => import("./paginas/Empleados"));
const Empresa = lazy(() => import("./paginas/Empresa"));
const Confirmacion = lazy(() => import("./componentes/Confirmacion"))
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
      setRole(decodedToken.roles);
    }
  }, [role, isAuthenticated]);


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
      
    ];
    setHideNavbar(!handledRoutes.includes(location.pathname));
  }, [location.pathname]);

  const shouldShowNavbar = () => isAuthenticated && !hideNavbar;

  return (

    <FormularioProvider>  {/* Envuelve tu aplicación con el proveedor */}
      <div className="App">
        {shouldShowNavbar() && <Navegador />}
        <Suspense fallback={<Progress />}>
          {isAuthenticated && role === "ROLE_ADMIN" && <RoutesAdministrador />}
          {isAuthenticated && role !== "ROLE_ADMIN" && <RoutesEmpleados />}
          {!isAuthenticated && <PublicRoutes />}
        </Suspense>
      </div>
    </FormularioProvider>
  );

}

function RoutesAdministrador() {
  return (
    <>

      <Routes>
        <Route exac path='/admin/panel' element={<Panel />} />

        <Route exac path="/admin/empleado" element={<Empleados />} />
      
        <Route path="/admin/empleado/confirmacion" element={<PrivateRoute formType="empleado" />}>
          <Route index element={<Confirmacion ruta={"/admin/empleado"} />} />
        </Route>

        <Route exac path='/admin/empresa' element={<Empresa/>} />
        
        <Route path="/admin/empresa/confirmacion" element={<PrivateRoute formType="empresa" />}>
          <Route index element={<Confirmacion ruta={"/admin/empresa"} />} />
        </Route> 

        <Route exac path='/admin/proveedor' element={<Proveedor/>} />

        <Route path="/admin/proveedor/confirmacion" element={<PrivateRoute formType="proveedor" />}>
          <Route index element={<Confirmacion ruta={"/admin/proveedor"} />} />
        </Route> 

        <Route exac path='/admin/categoria' element={"<AgregarCategoria />"} />

        <Route exac path='/admin/producto' element={<Producto />} />

        <Route path="/admin/producto/confirmacion" element={<PrivateRoute formType="producto" />}>
          <Route index element={<Confirmacion ruta={"/admin/producto"} />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
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
    <>

      <Routes>

        <Route exac path='/empleado/panel' element={<Panel />} />

        <Route exac path='/empleado/empresa' element={<Empresa/>} />
        
        <Route path="/empleado/empresa/confirmacion" element={<PrivateRoute formType="empresa" />}>
          <Route index element={<Confirmacion ruta={"/empleado/empresa"} />} />
        </Route> 

        <Route exac path='/empleado/proveedor' element={<Proveedor/>} />

        <Route path="/empleado/proveedor/confirmacion" element={<PrivateRoute formType="proveedor" />}>
          <Route index element={<Confirmacion ruta={"/empleado/proveedor"} />} />
        </Route> 

        <Route exac path='/empleado/producto' element={<Producto />} />

        <Route path="/empleado/producto/confirmacion" element={<PrivateRoute formType="producto" />}>
          <Route index element={<Confirmacion ruta={"/empleado/producto"} />} />
        </Route>
  
        <Route path="*" element={<NotFound />} />

      </Routes>

    </>
  );
}


export default App;
