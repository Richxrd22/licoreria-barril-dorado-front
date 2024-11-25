import { Button, Chip, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { empleadoService } from "../../../services/EmpleadoService";
import Progress from "../../../componentes/Progress";
import { useFormik } from "formik";

export default function InfoEmpleado({ onClose, employeeId }) {
  const [empleado, setEmpleado] = useState(null);

  const fetchEmpleado = async () => {
    try {
      const data = await empleadoService.obtenerEmpleadoId(employeeId);
      setEmpleado(data);
    } catch (error) {
      console.error("Error al obtener los detalles del empleado:", error);
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
      <ModalHeader className="flex flex-col gap-1">
        Información del Empleado
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Nombre:</strong>
            <span>{empleado.nombre + " " + empleado.apellido || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Dni:</strong>
            <span>{empleado.dni || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <strong>Correo Personal:</strong>
            <span>{empleado.correo_personal || "N/A"}</span>

          </div>
          <div className="flex justify-between">
            <strong>Correo Empresarial:</strong>
            <span>{empleado.correo_empresarial || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Celular:</strong>
            <span>+51 {empleado.telefono || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Direccion:</strong>
            <span>{empleado.direccion || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Activo:</strong>
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={empleado.activo ? "success" : "danger"}
            >
              {empleado.activo ? "Activo" : "Inactivo"}
            </Chip>
          </div>
        </div>

      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="solid" onPress={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </>
  );
}
