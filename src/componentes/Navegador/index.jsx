import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@nextui-org/react";
import { rutas, rutas_navegador, rutas_usuario } from "./datos";
import { Link, NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
export default function Navegador() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const [currentRouteName, setCurrentRouteName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const pathParts = location.pathname.split("/"); // Divide la ruta en segmentos
    const lastSegment = `/${pathParts.pop()}`; // Obtén el último segmento, con una barra inicial

    // Busca la ruta que coincida con el último segmento
    const currentRoute = rutas.find((route) => route.ruta === lastSegment);

    setCurrentRouteName(currentRoute ? currentRoute.nombre : ""); // Actualiza el nombre si encuentra la ruta
  }, [location.pathname]); // Escucha cambios en location.pathname

  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    const miToken = localStorage.getItem("token");
    if (miToken) {
      const decoded = jwtDecode(miToken);
      setDecodedToken(decoded);
    }
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    return (window.location.href = "/");
  };

  const baseRoute =
    decodedToken?.roles === "ROLE_ADMIN" ? "/admin" : "/empleado";

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-slate-800 "
        maxWidth="2xl"
      >
        <NavbarContent className="sm:hidden pr-3" justify="start">
          <NavbarBrand>
            <p className="font-bold text-white  text-inherit">LOGO</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4 " justify="center">
          <NavbarBrand>
            <p className="font-bold text-white p-3 text-inherit">LOGO</p>
          </NavbarBrand>
          {rutas_navegador.map((datos) => {
            return (
              <NavbarItem key={datos.id}>
                <NavLink
                  to={`${baseRoute}` + datos.ruta}
                  className="text-white cursor-pointer"
                >
                  {datos.nombre}
                </NavLink>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        <NavbarContent className="hidden sm:flex" justify="end">
          <Dropdown>
            <DropdownTrigger>
              <div className="flex gap-4 items-center cursor-pointer">
                <Avatar name="User" />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {rutas_usuario.map((datos) => {
                return (
                  <DropdownItem
                    key={datos.id}
                    title={datos.nombre}
                    onClick={() =>
                      datos.nombre === "Salir"
                        ? Logout()
                        : navigate(`${baseRoute}${datos.ruta}`)
                    }
                  />
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarMenu>
          {rutas.map((datos) => (
            <NavbarMenuItem key={`${datos.id}`}>
              <span key={datos.id}
                className={`${datos.nombre === "Salir" ? "text-danger-500" : "none"}`}
                onClick={() =>
                  datos.nombre === "Salir"
                    ? Logout()
                    : navigate(`${baseRoute}${datos.ruta}`)
                }
              >
                {datos.nombre}
              </span>

            </NavbarMenuItem>
          ))}
        </NavbarMenu>
        <NavbarContent className="sm:hidden " justify="end">
          <NavbarMenuToggle
            className="text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>
      </Navbar>
      {currentRouteName && ( // Renderiza el header solo si currentRouteName tiene un valor
        <header className="bg-white shadow">
          <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {currentRouteName}
            </h1>
          </div>
        </header>
      )}
    </>
  );
}
