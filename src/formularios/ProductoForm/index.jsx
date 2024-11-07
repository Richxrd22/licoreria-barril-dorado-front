import {
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { validationSchema } from "./validacion";
export default function ProductoForm() {
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      estado_cantidad: 1,
      fecha_produccion: null,
      fecha_vencimiento: null,
      id_categoria: "",
      id_proveedor: "",
    },
    validationSchema: validationSchema,
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
      <Input
        type="text"
        label="Nombre"
        placeholder="Introduce el Nombre del Producto"
        id="nombre"
        name="nombre"
        value={formik.values.nombre}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        onError={() => formik.touched.nombre && Boolean(formik.errors.nombre)}
        isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
        errorMessage={formik.touched.nombre && formik.errors.nombre}
      />
      <div className="flex gap-5">
        <Select
          id="id_categoria"
          name="id_categoria"
          label="Categoria"
          onChange={formik.handleChange}
          onBlur={() => formik.handleBlur("id_categoria")}
          onError={() =>
            !formik.values.id_categoria.length &&
            formik.touched.id_categoria &&
            Boolean(formik.errors.id_categoria)
          }
          isInvalid={
            !formik.values.id_categoria.length &&
            formik.touched.id_categoria &&
            Boolean(formik.errors.id_categoria)
          }
          errorMessage={
            !formik.values.id_categoria.length &&
            formik.touched.id_categoria &&
            formik.errors.id_categoria
          }
          placeholder="Selecciona una Categoria"
          className="max-w-ws"
          onClose={() => {
            formik.setFieldTouched("id_categoria", true);
          }}
        >
          <SelectItem>Cervezas</SelectItem>
          <SelectItem>Vinos</SelectItem>
          <SelectItem>Licores</SelectItem>
        </Select>
        <Select
          label="Proveedor"
          placeholder="Selecciona un Proveedor"
          id="id_proveedor"
          name="id_proveedor"
          onChange={formik.handleChange}
          onBlur={() => formik.handleBlur("id_proveedor")}
          onError={() =>
            !formik.values.id_proveedor.length &&
            formik.touched.id_proveedor &&
            Boolean(formik.errors.id_proveedor)
          }
          isInvalid={
            !formik.values.id_proveedor.length &&
            formik.touched.id_proveedor &&
            Boolean(formik.errors.id_proveedor)
          }
          errorMessage={
            !formik.values.id_proveedor.length &&
            formik.touched.id_proveedor &&
            formik.errors.id_proveedor
          }
          className="max-w-ws"
          onClose={() => {
            formik.setFieldTouched("id_proveedor", true);
          }}
        >
          <SelectItem>Johnnie Walker</SelectItem>
          <SelectItem>Bacardi</SelectItem>
          <SelectItem>Heineken</SelectItem>
        </Select>
      </div>

      <div className="flex gap-5">
        <Input
          type="number"
          label="Cantidad"
          placeholder="Introduce la Cantidad"
          id="cantidad"
          name="cantidad"
          value={formik.values.cantidad}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.cantidad && Boolean(formik.errors.cantidad)
          }
          isInvalid={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
          errorMessage={formik.touched.cantidad && formik.errors.cantidad}
        />
        <Input
          type="number"
          label="Precio"
          placeholder="0.00"
          id="precio"
          name="precio"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">S/</span>
            </div>
          }
          value={formik.values.precio}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.precio && Boolean(formik.errors.precio)}
          isInvalid={formik.touched.precio && Boolean(formik.errors.precio)}
          errorMessage={formik.touched.precio && formik.errors.precio}
        />
      </div>
      <div className="flex gap-5">
        <DatePicker
          id="fecha_produccion"
          label="Fecha Producción"
          name="fecha_produccion"
          value={formik.values.fecha_produccion}
          onChange={(date) => {
            formik.setFieldValue("fecha_produccion", date);
            formik.validateField("fecha_produccion");
          }}
          onBlur={() => formik.setFieldTouched("fecha_produccion", true)}
          isInvalid={
            formik.touched.fecha_produccion && formik.errors.fecha_produccion
          }
          errorMessage={
            formik.touched.fecha_produccion && formik.errors.fecha_produccion
          }
        />
        <DatePicker
          id="fecha_vencimiento"
          label="Fecha Vencimiento"
          name="fecha_vencimiento"
          value={formik.values.fecha_vencimiento}
          onChange={(date) => {
            formik.setFieldValue("fecha_vencimiento", date);
            formik.validateField("fecha_vencimiento");
          }}
          onBlur={() => formik.setFieldTouched("fecha_vencimiento", true)}
          isInvalid={
            formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento
          }
          errorMessage={
            formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento
          }
        />
      </div>
      <Textarea
        label="Descripcion"
        placeholder="Ingresa una Descripcion"
        name="descripcion"
        id="descripcion"
        value={formik.values.descripcion}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        onError={() =>
          formik.touched.descripcion && Boolean(formik.errors.descripcion)
        }
        isInvalid={
          formik.touched.descripcion && Boolean(formik.errors.descripcion)
        }
        errorMessage={formik.touched.descripcion && formik.errors.descripcion}
      />
    </form>
  );
}
