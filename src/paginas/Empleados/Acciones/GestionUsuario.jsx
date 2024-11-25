import { Button, Input, ModalBody, ModalHeader, Tab, Tabs } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/EmpleadoService';
import { useFormik } from 'formik';
import validacionEmpleadoContrasena from '../../../validaciones/validacionEmpleadoContraseña';
import Progress from '../../../componentes/Progress';
import { useFormulario } from '../../../context/FormularioContext';
import { useNavigate } from 'react-router-dom';

export default function GestionUsuario({ onClose, employeeId }) {
  const [empleado, setEmpleado] = useState(null)
  const { markFormAsSubmitted } = useFormulario(); // Función para actualizar el estado
  const navigate = useNavigate();
  const fetchEmpleado = async (employeeId) => {
    try {
      const empleado = await empleadoService.obtenerEmpleadoId(employeeId);

      formik.setValues({
        id_usuario: empleado.id_usuario,
        nueva_contraseña: ""
      });

    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      id_usuario: "",
      nueva_contraseña: ""
    },
    validationSchema: validacionEmpleadoContrasena,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {

        await empleadoService.actualizarContrasenaAdmin(values);

        resetForm();
        onClose();
        markFormAsSubmitted("empleado");
        navigate("/admin/empleado/confirmacion", {
          state: {
            mensaje: `Contraseña actualizada con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar el Empleado:", error);
      } finally {
        setSubmitting(false); // Esto indicará que el formulario terminó de enviarse
      }
    },
  });

  useEffect(() => {
    if (employeeId) fetchEmpleado(employeeId);
  }, [employeeId]);

  if (empleado) return <Progress />;
  return (
    <>
      <ModalHeader>Gestion de Usuario</ModalHeader>
      <ModalBody>
        <Tabs aria-label="Options" placement="top">
          <Tab key="cambiar_contraseña" title="Cambiar Contraseña">
            <form onSubmit={formik.handleSubmit} className="flex gap-4 flex-col">
              <Input
                type="password"
                placeholder="Introduce la nueva Contraseña"
                id="nueva_contraseña"
                name="nueva_contraseña"
                value={formik.values.nueva_contraseña}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.nueva_contraseña && Boolean(formik.errors.nueva_contraseña)}
                errorMessage={formik.touched.nueva_contraseña && formik.errors.nueva_contraseña}
              />
              <Button type="submit" color="primary">
                Actualizar
              </Button>
            </form>
          </Tab>
        </Tabs>
      </ModalBody>
    </>
  )
}
