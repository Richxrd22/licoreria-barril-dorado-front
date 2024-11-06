import React, { useEffect, useState } from "react";
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
export default function Navegador() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const [currentRouteName, setCurrentRouteName] = useState("");

  useEffect(() => {
    const currentRoute = rutas.find(
      (route) => route.ruta === location.pathname
    );
    setCurrentRouteName(currentRoute ? currentRoute.nombre : ""); // Solo asigna si currentRoute existe
  }, [location]);
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
                <NavLink to={datos.ruta} className="text-white cursor-pointer">
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
                  <DropdownItem key={datos.id}>
                    <Link to={datos.ruta} className="block">
                      {datos.nombre}
                    </Link>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarMenu>
          {rutas.map((datos) => (
            <NavbarMenuItem key={`${datos.id}`}>
              {datos.nombre != "Salir" ? (
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full"
                  to={datos.ruta}
                >
                  {datos.nombre}
                </Link>
              ) : (
                <Link className="text-danger">{datos.nombre}</Link>
              )}
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
