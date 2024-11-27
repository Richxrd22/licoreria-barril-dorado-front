import React, { useEffect, useState } from "react";
import { proveedorService } from "../../../services/ProveedorService";
import Progress from "../../../componentes/Progress";
import {
  Button,
  Chip,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export default function InfoProveedor({ onClose, proveedorId }) {
  const [proveedor, setProveedor] = useState(null);

  const fetchproveedor = async () => {
    try {
      const data = await proveedorService.obtenerProveedorId(proveedorId);
      setProveedor(data);
    } catch (error) {
      console.error("Error al obtener los detalles del proveedor:", error);
    }
  };

  useEffect(() => {
    if (proveedorId) {
      fetchproveedor();
    }
  }, [proveedorId]);

  if (!proveedor) return <Progress />;
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Información del Proveedor
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Nombre:</strong>
            <span>{proveedor.nombre + " " + proveedor.apellido || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Dni:</strong>
            <span>{proveedor.dni || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <strong>Correo Personal:</strong>
            <span>{proveedor.correo || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <strong>Empresa:</strong>
            <span>{proveedor.empresa || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Celular:</strong>
            <span>+51 {proveedor.telefono || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <strong>Activo:</strong>
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={proveedor.activo ? "success" : "danger"}
            >
              {proveedor.activo ? "Activo" : "Inactivo"}
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
