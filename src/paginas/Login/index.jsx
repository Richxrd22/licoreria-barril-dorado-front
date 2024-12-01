import { Input } from "@nextui-org/react";
import React, { useState } from "react";
import { EyeSlashFilledIcon } from "../../../public/Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../../../public/Icons/EyeFilledIcon";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchema } from "../../paginas/Login/Validacion";
import { login } from "../../services/LoginService";
import { jwtDecode } from "jwt-decode";
import Progress from "../../componentes/Progress";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const formik = useFormik({
    initialValues: {
      correo: "",
      clave: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true); 
      try {
        const token = await login(values);
        localStorage.setItem("token", token);

        const decodedToken = jwtDecode(token);
        const rol = decodedToken.roles;

        if (rol === "ROLE_ADMIN") {
          window.location.href = "/admin/panel";
        } else {
          window.location.href = "/empleado/panel";
        }
        resetForm();
      } catch (error) {
        console.log("Error al iniciar sesión. Verifica tus credenciales.");
      } finally {
        setSubmitting(false);
        setLoading(false); 
      }
    },
  });

  return (
    <div
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      style={{ minHeight: "calc(100vh - 90px)" }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={formik.handleSubmit}
          method="POST"
          className="space-y-6"
        >
          <div>
            <Input
              type="email"
              label="Dirección de correo electrónico"
              placeholder="Introduce tu correo electrónico"
              id="correo"
              name="correo"
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onError={() =>
                formik.touched.correo && Boolean(formik.errors.correo)
              }
              isInvalid={formik.touched.correo && Boolean(formik.errors.correo)}
              errorMessage={formik.touched.correo && formik.errors.correo}
            />
          </div>

          <div>
            <Input
              label="Contraseña"
              placeholder="Ingresa tu Contraseña"
              id="clave"
              name="clave"
              value={formik.values.clave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onError={() =>
                formik.touched.clave && Boolean(formik.errors.clave)
              }
              isInvalid={formik.touched.clave && Boolean(formik.errors.clave)}
              errorMessage={formik.touched.clave && formik.errors.clave}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-slate-800  px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
              disabled={formik.isSubmitting}
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>

      {loading && <Progress />} 
    </div>
  );
}
