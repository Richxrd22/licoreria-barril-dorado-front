import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import validacionEmpleado from "../../validaciones/validacionEmpleado";
import { empleadoService } from "../../services/EmpleadoService";
import { useFormulario } from "../../context/FormularioContext";
import { useNavigate } from "react-router-dom";

export default function EmpleadoForm({onClose}) {
  const [empleados, setEmpleados] = useState([]);
  const { markFormAsSubmitted } = useFormulario();  // Función para actualizar el estado
  const navigate = useNavigate();
  const fetchProductos = async () => {
    try {
      const data = await empleadoService.listarEmpleado();
      setEmpleados(data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      dni: "",
      correo_personal: "",
      telefono: "",
      direccion: "",
      activo:1,
      id_rol: 2,
    },
    validationSchema: validacionEmpleado(empleados),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await empleadoService.registrarEmpleado(values);
        console.log(values)
        // Reseteamos el formulario solo si deseas limpiar los campos después del envío
        resetForm();
        onClose();
        // Actualizamos el estado del formulario como "enviado"
        markFormAsSubmitted('empleado');

        // Redirigimos a la ruta de confirmación del producto
        navigate("/admin/empleado/confirmacion", {
          state: {
            mensaje: `Empleado ${values.nombre} Registrado con Exito`,
          },
        });

      } catch (error) {
        console.error("Error al registrar empleado:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="flex gap-5">
        <Input
          type="text"
          label="Nombre"
          placeholder="Introduce el Nombre del Empleado"
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
          placeholder="Introduce el Apellido del Empleado"
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
          placeholder="Introduce el Dni del Empleado"
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
          placeholder="Introduce el Correo del Empleado"
          id="correo_personal"
          name="correo_personal"
          value={formik.values.correo_personal}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.correo_personal && Boolean(formik.errors.correo_personal)}
          isInvalid={formik.touched.correo_personal && Boolean(formik.errors.correo_personal)}
          errorMessage={formik.touched.correo_personal && formik.errors.correo_personal}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="Celular"
          placeholder="Introduce el Celular del Empleado"
          id="telefono"
          name="telefono"
          value={formik.values.telefono}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.telefono && Boolean(formik.errors.telefono)
          }
          isInvalid={formik.touched.telefono && Boolean(formik.errors.telefono)}
          errorMessage={formik.touched.telefono && formik.errors.telefono}
        />
        <Input
          type="text"
          label="Direccion"
          placeholder="Introduce la Dirrecion del Empleado"
          id="direccion"
          name="direccion"
          value={formik.values.direccion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.direccion && Boolean(formik.errors.direccion)
          }
          isInvalid={
            formik.touched.direccion && Boolean(formik.errors.direccion)
          }
          errorMessage={formik.touched.direccion && formik.errors.direccion}
        />
      </div>
      <div className="pb-5">
      <Button color="primary" type="submit">Registrar</Button>

      </div>

    </form>
  );
}
