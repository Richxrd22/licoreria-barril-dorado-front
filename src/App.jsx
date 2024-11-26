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
      "/producto",
      "/panel",
      "/empleados",
      "/empresa",
      "/proveedor",
      "/perfil",
      "/configuracion",
      "/admin",
      "/admin/producto",
      "/admin/empleado",
      "/admin/empresa",
      "/admin/proveedor",
      "/empleado/producto",
      "/empleado/empleado",
      "/empleado/empresa",
      "/empleado/proveedor",
      "/admin/producto/confirmacion",
      "/admin/empleado/confirmacion",
      "/admin/empresa/confirmacion",
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
        <Route exac path='/admin' element={<Panel />} />

        <Route exac path="/admin/empleado" element={<Empleados />} />
      
        <Route path="/admin/producto/confirmacion" element={<PrivateRoute formType="producto" />}>
          <Route index element={<Confirmacion ruta={"/admin/producto"} />} />
        </Route>

        <Route path="/admin/empleado/confirmacion" element={<PrivateRoute formType="empleado" />}>
          <Route index element={<Confirmacion ruta={"/admin/empleado"} />} />
        </Route>

        <Route path="/admin/empresa/confirmacion" element={<PrivateRoute formType="empresa" />}>
          <Route index element={<Confirmacion ruta={"/admin/empresa"} />} />
        </Route> 

        <Route exac path='/admin/empresa' element={<Empresa/>} />

        <Route exac path='/admin/proveedor' element={"<AgregarProveedor />"} />

        <Route exac path='/admin/categoria' element={"<AgregarCategoria />"} />

        <Route exac path='/admin/producto' element={<Producto />} />

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

        <Route exac path='/empleado' element={<Panel />} />
        <Route exac path='/empleado/empresa' element={"hola"} />
        <Route exac path='/empleado/empresa/listar' element={"hola"} />
        <Route exac path='/empleado/empresa/editar/:id' element={"hola"} />

        <Route exac path='/empleado/proveedor' element={"hola"} />
        <Route exac path='/empleado/proveedor/listar' element={"<TablaProveedor />"} />
        <Route exac path='/empleado/proveedor/editar/:id' element={"<EditarProveedor />"} />

        <Route exac path='/empleado/categoria' element={"<AgregarCategoria />"} />
        <Route exac path='/empleado/categoria/listar' element={"<TablaCategoria />"} />
        <Route exac path='/empleado/categoria/editar/:id' element={"<EditarCategoria />"} />

        <Route exac path='/empleado/producto' element={"<AgregarProducto />"} />
        <Route exac path='/empleado/producto/listar' element={"<TablaProducto />"} />
        <Route exac path='/empleado/producto/editar/:id' element={"<EditarProducto />"} />

        <Route exac path='/empleado/cliente' element={"<EditarProducto />"} />
        <Route exac path='/empleado/cliente/listar' element={"<EditarProducto />"} />
        <Route exac path='/empleado/cliente/editar/:id' element={"<EditarProducto />"} />

        {/*<Route exac path='/empleado/venta' element={<AgregarVenta />} />
        <Route exac path='/empleado/venta/listar' element={<TablaVentas />} />
 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </>
  );
}


export default App;
/*
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
      </Suspense>*/