import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../../../context/FormularioContext";
import { Button, Input, ModalBody, ModalHeader } from "@nextui-org/react";
import { useFormik } from "formik";
import validacionEmpleadoActualizar from "../../../validaciones/validacionEmpleadoActualizar";
import { empleadoService } from "../../../services/EmpleadoService";
import Progress from "../../../componentes/Progress";

export default function EditarEmpleado({ onClose, employeeId }) {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosExistentes, setEmpleadosExistentes] = useState([]);
  const { markFormAsSubmitted } = useFormulario(); // Función para actualizar el estado
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar datos del empleado
        const empleadoBuscado = await empleadoService.obtenerEmpleadoId(employeeId);
        setEmpleadoSeleccionado(empleadoBuscado);

        // Cargar empleados existentes (si es necesario)
        const data = await empleadoService.listarEmpleado();
        setEmpleadosExistentes(data);

        // Usar `resetForm` después de obtener los datos
        formik.resetForm({
          values: {
            id_empleado: employeeId,
            id_usuario:empleadoBuscado.id_usuario,
            nombre: empleadoBuscado.nombre,
            apellido: empleadoBuscado.apellido,
            dni: empleadoBuscado.dni,
            correo_personal: empleadoBuscado.correo_personal,
            telefono: empleadoBuscado.telefono,
            direccion: empleadoBuscado.direccion,
            activo: empleadoBuscado.activo === true ? 1 : 0,
            id_rol:empleadoBuscado.id_rol
          },
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (employeeId) {
      cargarDatos();
    }
  }, [employeeId]); // Solo se ejecuta cuando `employeeId` cambia

  const formik = useFormik({
    initialValues: {
      id_empleado: "",
      id_usuario:"",
      nombre: "",
      apellido: "",
      dni: "",
      correo_personal: "",
      telefono: "",
      direccion: "",
      activo: 1,
      id_rol:""
    },
    validationSchema: validacionEmpleadoActualizar(empleadosExistentes, empleadoSeleccionado),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {

        await empleadoService.editarEmpleadoUsuario(values);

        resetForm();
        onClose();
        markFormAsSubmitted("empleado");
        navigate("/admin/empleado/confirmacion", {
          state: {
            mensaje: `Los Datos del Empleado ${values.nombre} actualizo con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar el Empleado:", error);
      } finally {
        setSubmitting(false); // Esto indicará que el formulario terminó de enviarse
      }
    },
  });

  if (!empleadoSeleccionado) return <Progress />;
  return (
    <>
      <ModalHeader>Editar Empleado</ModalHeader>
      <ModalBody >
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
              onError={() =>
                formik.touched.nombre && Boolean(formik.errors.nombre)
              }
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
              isInvalid={
                formik.touched.apellido && Boolean(formik.errors.apellido)
              }
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
              onError={() =>
                formik.touched.correo_personal &&
                Boolean(formik.errors.correo_personal)
              }
              isInvalid={
                formik.touched.correo_personal &&
                Boolean(formik.errors.correo_personal)
              }
              errorMessage={
                formik.touched.correo_personal && formik.errors.correo_personal
              }
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
              isInvalid={
                formik.touched.telefono && Boolean(formik.errors.telefono)
              }
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
            <Button color="primary" type="submit"  disabled={!formik.dirty || formik.isSubmitting}>
              Actualizar
            </Button>
          </div>
        </form>
      </ModalBody>

    </>
  );
}
