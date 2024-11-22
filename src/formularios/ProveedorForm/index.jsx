import { Input, Select, SelectItem } from '@nextui-org/react';
import { useFormik } from 'formik';
import React from 'react'
import { validacionProveedor } from '../../validaciones/validacionProveedor';

export default function ProveedorForm() {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      correo: "",
      dni: "",
      celular: "",
      id_empresa: "",
    },
    validationSchema: validacionProveedor,
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
          placeholder="Introduce el Nombre del Proveedor"
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
          label="Apellido"
          placeholder="Introduce el Apellido del Proveedor"
          id="apellido"
          name="apellido"
          value={formik.values.apellido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.apellido && Boolean(formik.errors.apellido)
          }
          isInvalid={formik.touched.apellido && Boolean(formik.errors.apellido)}
          errorMessage={formik.touched.apellido && formik.errors.apellido}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="Dni"
          placeholder="Introduce el Dni del Proveedor"
          id="dni"
          name="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.dni && Boolean(formik.errors.dni)}
          isInvalid={formik.touched.dni && Boolean(formik.errors.dni)}
          errorMessage={formik.touched.dni && formik.errors.dni}
        />
        <Input
          type="email"
          label="Correo"
          placeholder="Introduce el Correo del Proveedor"
          id="correo"
          name="correo"
          value={formik.values.correo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.correo && Boolean(formik.errors.correo)}
          isInvalid={formik.touched.correo && Boolean(formik.errors.correo)}
          errorMessage={formik.touched.correo && formik.errors.correo}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="Celular"
          placeholder="Introduce el Celular del Proveedor"
          id="celular"
          name="celular"
          value={formik.values.celular}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.celular && Boolean(formik.errors.celular)
          }
          isInvalid={formik.touched.celular && Boolean(formik.errors.celular)}
          errorMessage={formik.touched.celular && formik.errors.celular}
        />
         <Select
          label="Empresa"
          placeholder="Selecciona una Empresa"
          id="id_empresa"
          name="id_empresa"
          onChange={formik.handleChange}
          onBlur={() => formik.handleBlur("id_empresa")}
          onError={() =>
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            Boolean(formik.errors.id_empresa)
          }
          isInvalid={
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            Boolean(formik.errors.id_empresa)
          }
          errorMessage={
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            formik.errors.id_empresa
          }
          className="max-w-ws"
          onClose={() => {
            formik.setFieldTouched("id_empresa", true);
          }}
        >
          <SelectItem>Johnnie Walker</SelectItem>
          <SelectItem>Bacardi</SelectItem>
          <SelectItem>Heineken</SelectItem>
        </Select>
      </div>
    </form>
  );
}
