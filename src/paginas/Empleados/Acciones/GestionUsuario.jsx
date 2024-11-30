import { Button, Input, ModalBody, ModalHeader, Tab, Tabs } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/EmpleadoService';
import { useFormik } from 'formik';
import validacionEmpleadoContrasena from '../../../validaciones/validacionEmpleadoContraseña';
import Progress from '../../../componentes/Progress';
import { useFormulario } from '../../../context/FormularioContext';
import { useNavigate } from 'react-router-dom';
import { EyeSlashFilledIcon } from '../../../../public/Icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../../../../public/Icons/EyeFilledIcon';

export default function GestionUsuario({ onClose, employeeId }) {
  const [empleado, setEmpleado] = useState(null)
  const { markFormAsSubmitted } = useFormulario(); 
  const [visibility, setVisibility] = React.useState({
    antiguo: false,
    nuevo: false,
  });
  const toggleVisibility = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const fetchEmpleado = async (employeeId) => {
    try {
      const empleado = await empleadoService.obtenerEmpleadoId(employeeId);

      formik.setValues({
        id_usuario: empleado.id_usuario,
        nueva_contraseña: "",
        confirmar_contraseña:""
      });

    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      id_usuario: "",
      nueva_contraseña: "",
      confirmar_contraseña:""
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
            mensaje: `Contraseña Actualizada con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar el Empleado:", error);
      } finally {
        setSubmitting(false); 
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
            <div className="flex flex-col gap-3">
                  <Input
                    size="lg"
                    type={visibility.nuevo ? "text" : "password"}
                    placeholder="Introduce la nueva Contraseña"
                    id="nueva_contraseña"
                    name="nueva_contraseña"
                    value={formik.values.nueva_contraseña}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.nueva_contraseña &&
                      Boolean(formik.errors.nueva_contraseña)
                    }
                    errorMessage={
                      formik.touched.nueva_contraseña &&
                      formik.errors.nueva_contraseña
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
                    value={formik.values.confirmar_contraseña}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.confirmar_contraseña &&
                      Boolean(formik.errors.confirmar_contraseña)
                    }
                    errorMessage={
                      formik.touched.confirmar_contraseña &&
                      formik.errors.confirmar_contraseña
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
