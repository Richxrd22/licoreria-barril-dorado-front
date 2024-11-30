import React, { useEffect, useState } from 'react'
import { empleadoService } from '../../../services/EmpleadoService';
import { Button, ModalBody } from '@nextui-org/react';
import { CheckCircleIcon } from '../../../../public/Icons/CheckCircleIcon';
import { CloseCircleIcon } from '../../../../public/Icons/CloseCircleIcon';
import Progress from '../../../componentes/Progress';

export default function GestionActivo({ onClose, employeeId, actualizarTabla }) {
  const [empleado, setEmpleado] = useState(null);
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const fetchEmpleado = async () => {
    try {
      const data = await empleadoService.obtenerEmpleadoId(employeeId);
      setEmpleado(data);
    } catch (error) {
      console.error("Error al obtener los detalles del empleados:", error);
    }
  };
  const cambiarEstadoEmpleado = async () => {
    try {
      const nuevoActivo = empleado.activo ? 0 : 1;
      const empleadoActualizado = {
        ...empleado,
        id_empleado: employeeId,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        dni: empleado.dni,
        correo: empleado.correo_personal,
        telefono: empleado.telefono,
        direccion: empleado.direccion,
        activo: nuevoActivo,
      };

      setCargando(true);
      actualizarTabla(empleadoActualizado);

      await empleadoService.editarEmpleado(empleadoActualizado);

      setEmpleado(empleadoActualizado);
      setEstado("success");
    } catch (error) {
      console.error("Error al actualizar el estado del Empleado:", error);
      setEstado("error");
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    if (employeeId) {
      fetchEmpleado();
    }
  }, [employeeId]);
  if (!empleado) return <Progress />;
  return (
    <>
      {estado === "success" ? (
        <ModalBody>
          <h2 className="text-center text-xl">Licoreria Barril Dorado</h2>
          <div className="flex flex-col items-center gap-3">
            <CheckCircleIcon width="60px" height="60px" />
            <p>¡El estado del Empleado se cambió exitosamente!</p>
          </div>
          <Button className="bg-slate-800 text-white" onPress={onClose}>
            Aceptar
          </Button>
        </ModalBody>
      ) : estado === "error" ? (
        <ModalBody>
          <h2 className="text-center text-xl text-red-600">Error</h2>
          <div className="flex flex-col items-center gap-3">
            <CloseCircleIcon width="60px" height="60px" />
            <p>
              Hubo un problema al cambiar el estado del Empleado. Por favor,
              inténtelo nuevamente.
            </p>
          </div>
          <Button className="bg-red-600 text-white" onPress={onClose}>
            Cerrar
          </Button>
        </ModalBody>
      ) : (
        <ModalBody>
          <h2 className="text-center text-xl">Cambiar Estado del Empleado</h2>
          <p className="text-center">
            ¿Desea cambiar el estado de este Empleado?
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              className="bg-green-600 text-white"
              onPress={cambiarEstadoEmpleado}
              disabled={cargando}
            >
              {cargando ? "Procesando..." : "Confirmar"}
            </Button>
            <Button className="bg-gray-500 text-white" onPress={onClose}>
              Cancelar
            </Button>
          </div>
        </ModalBody>
      )}
    </>

  )
}
