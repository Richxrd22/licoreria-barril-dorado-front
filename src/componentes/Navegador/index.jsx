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
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  useDisclosure,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Input,
} from "@nextui-org/react";
import {
  rutasAdministrador,
  rutasEmpleado,
  rutas_navegador_administrador,
  rutas_navegador_empleado,
  rutas_usuario,
} from "./datos";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDecodedToken } from "../../hook/useDecodedToken";
import { empleadoService } from "../../services/EmpleadoService";
import { useFormik } from "formik";
import validacionEmpleadoContrasena from "../../validaciones/validacionEmpleadoContraseña";
import validacionEmpleadoActualizarx from "../../validaciones/validacionEmpleadoActualizarx";
import { CheckCircleIcon } from "../../../public/Icons/CheckCircleIcon";
import { EyeSlashFilledIcon } from "../../../public/Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../../../public/Icons/EyeFilledIcon";

export default function Navegador() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentModal, setCurrentModal] = useState(null); 
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosExistentes, setEmpleadosExistentes] = useState(null);
  const [currentRouteName, setCurrentRouteName] = useState("");
  const navigate = useNavigate();
  const { baseRoute, rol, correo } = useDecodedToken();
  const location = useLocation();
  const [visibility, setVisibility] = React.useState({
    antiguo: false,
    nuevo: false,
  });

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const lastSegment = `/${pathParts.pop()}`;
    const currentRoutes = rol ? rutasAdministrador : rutasEmpleado;
    const currentRoute = currentRoutes.find(
      (route) => route.ruta === lastSegment
    );
    setCurrentRouteName(currentRoute ? currentRoute.nombre : "");
  }, [location.pathname, rol]);

  const rutasNavegacion = isMenuOpen
    ? rol
      ? rutasAdministrador
      : rutasEmpleado
    : rol
      ? rutas_navegador_administrador
      : rutas_navegador_empleado;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const empleadoBuscado = await empleadoService.obtenerEmpleadoPorCorreo(
          correo
        );
        setEmpleadoSeleccionado(empleadoBuscado);
        const data = await empleadoService.listarEmpleado();
        setEmpleadosExistentes(data);

        formik.resetForm({
          values: {
            id_empleado: empleadoBuscado.id_empleado,
            nombre: empleadoBuscado.nombre,
            apellido: empleadoBuscado.apellido,
            dni: empleadoBuscado.dni,
            correo: empleadoBuscado?.correo_personal,
            telefono: empleadoBuscado.telefono,
            direccion: empleadoBuscado.direccion,
            activo: empleadoBuscado.activo,
          },
        });
        formikPassword.resetForm({
          values: {
            id_usuario: empleadoBuscado?.id_usuario,
            nueva_contraseña: "",
          },
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (correo) {
      cargarDatos();
    }
  }, [correo]); 

  const formikPassword = useFormik({
    initialValues: {
      id_usuario: "",
      nueva_contraseña: "",
    },
    validationSchema: validacionEmpleadoContrasena,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await empleadoService.actualizarContrasena(values);
        closeModal();
        handleConfigClick("completadoPassword")
        resetForm();
      } catch (error) {
        if (error.message === "La contraseña antigua no es correcta") {
          setErrors({ antigua_contraseña: error.message }); 
        } else {
          alert("Error inesperado: " + error.message);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      id_empleado: "",
      nombre: "",
      apellido: "",
      dni: "",
      correo: "",
      telefono: "",
      direccion: "",
      activo: 1,
    },
    validationSchema: validacionEmpleadoActualizarx(
      empleadosExistentes,
      empleadoSeleccionado
    ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        await empleadoService.editarEmpleado(values);

        const empleadoActualizado =
          await empleadoService.obtenerEmpleadoPorCorreo(correo);
        setEmpleadoSeleccionado(empleadoActualizado);

        resetForm({
          values: {
            id_empleado: empleadoActualizado.id_empleado,
            nombre: empleadoActualizado.nombre,
            apellido: empleadoActualizado.apellido,
            dni: empleadoActualizado.dni,
            correo: empleadoActualizado?.correo_personal,
            telefono: empleadoActualizado.telefono,
            direccion: empleadoActualizado.direccion,
            activo: empleadoActualizado.activo,
          },
        });

        resetForm();
        closeModal();
        handleConfigClick("completado");
      } catch (error) {
        console.error("Error al Actualizar el Empleado:", error);
      } finally {
        setSubmitting(false); 
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleConfigClick = (option) => {
    setCurrentModal(option); 
    onOpen(); 
  };

  const closeModal = () => {
    setCurrentModal(null);
    onOpenChange(false); 
  };

  const handleOptionSelect = (option) => {
    setCurrentModal(option); 
    onOpen(); 
  };

  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-slate-800"
        maxWidth="2xl"
      >
        <NavbarContent className="sm:hidden pr-3" justify="start">
          <NavbarBrand>
            <p className="font-bold text-white text-inherit">LOGO</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <p className="font-bold text-white p-3 text-inherit">LOGO</p>
          </NavbarBrand>
          {rutasNavegacion.map((datos) => (
            <NavbarItem key={datos.id}>
              <NavLink
                to={`${baseRoute}${datos.ruta}`}
                className="text-white cursor-pointer"
              >
                {datos.nombre}
              </NavLink>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent className="hidden sm:flex" justify="end">
          <Dropdown>
            <DropdownTrigger>
              <div className="flex gap-4 items-center cursor-pointer">
                <Avatar name={empleadoSeleccionado?.nombre} />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              {rutas_usuario.map((datos) => (
                <DropdownItem
                  key={datos.id}
                  title={datos.nombre}
                  onClick={() =>
                    datos.nombre === "Salir"
                      ? handleLogout()
                      : datos.nombre === "Configuracion"
                        ? handleConfigClick("configuracion")
                        : datos.nombre === "Perfil"
                          ? handleConfigClick("perfil")
                          : navigate(`${baseRoute}${datos.ruta}`)
                  }
                />
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>

        <NavbarMenu>
          {rutasNavegacion.map((datos) => (
            <NavbarMenuItem key={datos.id}>
              <Link
                className={`w-full ${datos.nombre === "Salir" ? "text-danger-500" : ""
                  }`}
                onClick={() => {
                  if (datos.nombre === "Salir") {
                    handleLogout();
                  } else if (datos.nombre === "Configuracion") {
                    setIsMenuOpen(false);
                    handleConfigClick("configuracion");
                  } else if (datos.nombre === "Perfil") {
                    // Abre el modal de perfil
                    setIsMenuOpen(false);
                    handleConfigClick("perfil");
                  } else {
                    setIsMenuOpen(false);
                    navigate(`${baseRoute}${datos.ruta}`);
                  }
                }}
                to={
                  datos.nombre === "Perfil" || datos.nombre === "Configuracion"
                    ? location.pathname
                    : `${baseRoute}${datos.ruta}`
                }
              >
                {datos.nombre}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

        <NavbarContent className="sm:hidden" justify="end">
          <NavbarMenuToggle
            className="text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>
      </Navbar>
      {currentRouteName && (
        <header className="bg-white shadow">
          <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {currentRouteName}
            </h1>
          </div>
        </header>
      )}


      <Modal
        isOpen={isOpen && currentModal === "perfil"}
        size="2xl"
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader>Perfil</ModalHeader>
          <ModalBody>
            <div className="flex gap-3">
              <Input
                id="nombre"
                value={empleadoSeleccionado?.nombre}
                label="Nombre"
                disabled
              />
              <Input
                id="apellido"
                value={empleadoSeleccionado?.apellido}
                label="Apellido"
                disabled
              />
            </div>
            <div className="gap-3 flex">
              <Input
                id="dni"
                value={empleadoSeleccionado?.dni}
                label="Dni"
                disabled
              />
              <Input
                id="correo_personal"
                value={empleadoSeleccionado?.correo_personal}
                label="Correo Personal"
                disabled
              />
            </div>
            <div className="gap-3 flex">
              <Input
                id="correo_empresarial"
                value={empleadoSeleccionado?.correo_empresarial}
                label="Correo Empresarial"
                disabled
              />
              <Input
                id="celular"
                value={empleadoSeleccionado?.telefono}
                label="Celular"
                disabled
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="solid" onPress={closeModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen && currentModal === "configuracion"}
        hideCloseButton
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Configuración</ModalHeader>
          <ModalBody>
            <div className="flex gap-3 items-center justify-center">
              <Button
                fullWidth
                className="bg-slate-700 text-white"
                onPress={() => handleOptionSelect("actualizar")}
              >
                Actualizar Datos
              </Button>
              <Button
                fullWidth
                className="bg-slate-700 text-white"
                onPress={() => handleOptionSelect("cambiar_contraseña")}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              fullWidth
              color="danger"
              variant="solid"
              onPress={closeModal}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {currentModal === "actualizar" && (
        <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange} isDismissable={false} hideCloseButton>
          <ModalContent>
            <ModalHeader>Actualizar Datos</ModalHeader>
            <ModalBody>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="flex gap-5">
                  <Input
                    type="text"
                    label="Nombre"
                    placeholder="Introduce el Nombre "
                    id="nombre"
                    name="nombre"
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onError={() =>
                      formik.touched.nombre && Boolean(formik.errors.nombre)
                    }
                    isInvalid={
                      formik.touched.nombre && Boolean(formik.errors.nombre)
                    }
                    errorMessage={formik.touched.nombre && formik.errors.nombre}
                  />
                  <Input
                    type="text"
                    label="Apellido"
                    placeholder="Introduce el Apellido"
                    id="apellido"
                    name="apellido"
                    value={formik.values.apellido}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onError={() =>
                      formik.touched.apellido && Boolean(formik.errors.apellido)
                    }
                    isInvalid={
                      formik.touched.apellido && Boolean(formik.errors.apellido)
                    }
                    errorMessage={
                      formik.touched.apellido && formik.errors.apellido
                    }
                  />
                </div>
                <div className="flex gap-5">
                  <Input
                    type="email"
                    label="Correo"
                    placeholder="Introduce el Correo "
                    id="correo"
                    name="correo"
                    value={formik.values.correo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onError={() =>
                      formik.touched.correo && Boolean(formik.errors.correo)
                    }
                    isInvalid={
                      formik.touched.correo && Boolean(formik.errors.correo)
                    }
                    errorMessage={formik.touched.correo && formik.errors.correo}
                  />
                </div>
                <div className="flex gap-5">
                  <Input
                    type="text"
                    label="Celular"
                    placeholder="Introduce el Celular "
                    id="telefono"
                    name="telefono"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onError={() =>
                      formik.touched.telefono && Boolean(formik.errors.telefono)
                    }
                    isInvalid={
                      formik.touched.telefono && Boolean(formik.errors.telefono)
                    }
                    errorMessage={
                      formik.touched.telefono && formik.errors.telefono
                    }
                  />
                  <Input
                    type="text"
                    label="Direccion"
                    placeholder="Introduce la Dirrecion"
                    id="direccion"
                    name="direccion"
                    value={formik.values.direccion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    onError={() =>
                      formik.touched.direccion &&
                      Boolean(formik.errors.direccion)
                    }
                    isInvalid={
                      formik.touched.direccion &&
                      Boolean(formik.errors.direccion)
                    }
                    errorMessage={
                      formik.touched.direccion && formik.errors.direccion
                    }
                  />
                </div>
                <div className="pb-5 flex gap-3">
                  <Button
                    color="primary"
                    type="submit"
                    disabled={!formik.dirty || formik.isSubmitting}
                  >
                    Actualizar
                  </Button>
                  <Button color="danger" onPress={closeModal}>
                    Cerrar
                  </Button>
                </div>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {currentModal === "completado" && (
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton>
            <ModalContent>
              <div className="p-5 flex flex-col gap-5">
                <h2 className="text-center text-xl">Licoreria Barril Dorado</h2>
                <div className="flex  flex-col items-center gap-3">
                  <CheckCircleIcon width="60px" height="60px" />
                  <p className="text-center  text-lg">Actualización Exitosa</p>
                </div>
                <Button color="primary" onPress={closeModal}>
                  Inicio
                </Button>
              </div>
            </ModalContent>
          </Modal>
        </>
      )}
      {currentModal === "completadoPassword" && (
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton>
            <ModalContent>
              <div className="p-5 flex flex-col gap-5">
                <h2 className="text-center text-xl">Licoreria Barril Dorado</h2>
                <div className="flex  flex-col items-center gap-3">
                  <CheckCircleIcon width="60px" height="60px" />
                  <p className="text-center  text-lg">Contraseña Actualizada con Exitosa</p>
                </div>
                <Button color="primary" onPress={handleLogout}>
                  Iniciar Sesion
                </Button>
              </div>
            </ModalContent>
          </Modal>
        </>
      )}

      {currentModal === "cambiar_contraseña" && (
        <Modal isOpen={isOpen} size="lg" onOpenChange={onOpenChange} isDismissable={false} hideCloseButton>
          <ModalContent>
            <ModalHeader>Cambiar Contraseña</ModalHeader>
            <ModalBody >
              <form
                onSubmit={formikPassword.handleSubmit}
                className="flex gap-5 flex-col"
              >
                {/* Nueva Contraseña */}
                <div className="flex flex-col gap-3">
                  <Input
                    size="lg"
                    type={visibility.nuevo ? "text" : "password"}
                    placeholder="Introduce la nueva Contraseña"
                    id="nueva_contraseña"
                    name="nueva_contraseña"
                    value={formikPassword.values.nueva_contraseña}
                    onChange={formikPassword.handleChange}
                    onBlur={formikPassword.handleBlur}
                    isInvalid={
                      formikPassword.touched.nueva_contraseña &&
                      Boolean(formikPassword.errors.nueva_contraseña)
                    }
                    errorMessage={
                      formikPassword.touched.nueva_contraseña &&
                      formikPassword.errors.nueva_contraseña
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => toggleVisibility("nuevo")}
                        aria-label="toggle password visibility"
                      >
                        {visibility.nuevo ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />

                  <Input
                    type={visibility.confirmar ? "text" : "password"}
                    placeholder="Confirma tu nueva Contraseña"
                    id="confirmar_contraseña"
                    name="confirmar_contraseña"
                    size="lg"
                    value={formikPassword.values.confirmar_contraseña}
                    onChange={formikPassword.handleChange}
                    onBlur={formikPassword.handleBlur}
                    isInvalid={
                      formikPassword.touched.confirmar_contraseña &&
                      Boolean(formikPassword.errors.confirmar_contraseña)
                    }
                    errorMessage={
                      formikPassword.touched.confirmar_contraseña &&
                      formikPassword.errors.confirmar_contraseña
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => toggleVisibility("confirmar")}
                        aria-label="toggle password visibility"
                      >
                        {visibility.confirmar ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </div>


                <div className="flex gap-3 pb-3">
                  <Button fullWidth className="bg-slate-800 text-white" type="submit">Actualizar</Button>
                  <Button
                    fullWidth
                    color="danger"
                    onPress={() => {
                      closeModal(); 
                      formikPassword.resetForm({
                        values: {
                          id_usuario: empleadoSeleccionado?.id_usuario,
                          nueva_contraseña: "",
                        },
                      })
                    }}
                  >
                    Cerrar
                  </Button>
                </div>

              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
