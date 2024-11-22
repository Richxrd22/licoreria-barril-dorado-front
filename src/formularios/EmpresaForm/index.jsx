import { Input } from "@nextui-org/react";
import { useFormik } from "formik";
import React from "react";
import validacionEmpresa from "../../validaciones/validacionEmpresa";

export default function EmpresaForm() {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      ruc: "",
      website: "",
    },
    validationSchema: validacionEmpresa,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      /* try {
              const token = await login(values);
              localStorage.setItem("token", token);
      
              const decodedToken = jwtDecode(token);
              const idRol = decodedToken.id_rol;
      
              // Redirige según el rol del usuario
              if (idRol === 1) {
                navigate("/admin");
              } else {
                navigate("/user");
              }
      
              resetForm(); // Limpia el formulario tras inicio de sesión exitoso
            } catch (error) {
              console.log("Error al iniciar sesión. Verifica tus credenciales.");
              
            } finally {
              setSubmitting(false); // Detiene el estado de "submitting"
            }*/
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="flex gap-5">
        <Input
          type="text"
          label="Nombre"
          placeholder="Introduce el Nombre de la Empresa"
          id="nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.nombre && Boolean(formik.errors.nombre)}
          isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
          errorMessage={formik.touched.nombre && formik.errors.nombre}
        />
        <Input
          type="text"
          label="Ruc"
          placeholder="Introduce el Ruc de la Empresa"
          id="ruc"
          name="ruc"
          value={formik.values.ruc}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.ruc && Boolean(formik.errors.ruc)}
          isInvalid={formik.touched.ruc && Boolean(formik.errors.ruc)}
          errorMessage={formik.touched.ruc && formik.errors.ruc}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="website"
          placeholder="Introduce el WebSite de la Empresa"
          id="website"
          name="website"
          value={formik.values.website}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.website && Boolean(formik.errors.website)
          }
          isInvalid={formik.touched.website && Boolean(formik.errors.website)}
          errorMessage={formik.touched.website && formik.errors.website}
        />
      </div>
    </form>
  );
}
