import {
  Button,
  Chip,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { productoService } from "../../../services/ProductoService";
import Progress from "../../../componentes/Progress";

export default function InfoProducto({ onClose, productId }) {
  const [producto, setProducto] = useState(null);

  const fetchProducto = async () => {
    try {
      const data = await productoService.obtenerproductoId(productId);
      setProducto(data);
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProducto();
    }
  }, [productId]);

  if (!producto) return <Progress />;

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Información del Producto
      </ModalHeader>
      <ModalBody>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Nombre:</strong>
            <span>{producto.nombre || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Categoría:</strong>
            <span>{producto.categoria || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <strong>Estado:</strong>
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={producto.estado_cantidad ? "success" : "danger"}
            >
              {producto.estado_cantidad ? "Disponible" : "Agotado"}
            </Chip>
          </div>
          <div className="flex justify-between">
            <strong>Cantidad:</strong>
            <span>{producto.cantidad || "0"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Precio:</strong>
            <span>S/.{producto.precio || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Proveedor:</strong>
            <span>{producto.proveedor || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Teléfono del Proveedor:</strong>
            <span>{producto.telefono_proveedor || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between">
            <strong>Fecha de Producción:</strong>
            <span>{producto.fecha_produccion || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <strong>Fecha de Vencimiento:</strong>
            <span>{producto.fecha_vencimiento || "N/A"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <strong>Descripción:</strong>
          <p className="text-default-600">
            {producto.descripcion || "Sin descripción"}
          </p>
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
