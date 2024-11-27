import { Button, ModalBody, ModalHeader } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CheckCircleIcon } from "../../../../public/Icons/CheckCircleIcon";
import { CloseCircleIcon } from "../../../../public/Icons/CloseCircleIcon";
import { productoService } from "../../../services/ProductoService";
import Progress from "../../../componentes/Progress";
import { WarningAmberRounded } from "@mui/icons-material";
export default function GestionActivo({ onClose, productId, actualizarTabla }) {
  const [producto, setProducto] = useState(null);
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const fetchProducto = async () => {
    try {
      const data = await productoService.obtenerproductoId(productId);
      setProducto(data);
    } catch (error) {
      console.error("Error al obtener los detalles del producto:", error);
    }
  };
  const actualizarEstadoProducto = async () => {
    try {

      if (producto.estado_cantidad ) {
        setEstado("validacion");
        return;
      }


      const nuevoActivo = producto.activo ? 0 : 1;

      const productoActualizado = {
        id_producto: productId,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        precio: producto.precio,
        estado_cantidad: producto.estado_cantidad ,
        fecha_produccion: producto.fecha_produccion,
        fecha_vencimiento: producto.fecha_vencimiento,
        id_categoria: parseInt(producto.id_categoria),
        id_proveedor: parseInt(producto.id_proveedor),
        activo: nuevoActivo,
      };

      setCargando(true);
      actualizarTabla(productoActualizado);

      await productoService.editarProducto(productoActualizado);


      setProducto(productoActualizado);
      setEstado("success");
    } catch (error) {
      console.error("Error al actualizar el estado del producto:", error);
      setEstado("error");
    } finally {
      setCargando(false);
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
      {estado === "success" ? (
        <ModalBody>
          <h2 className="text-center text-xl">Licoreria Barril Dorado</h2>
          <div className="flex flex-col items-center gap-3">
            <CheckCircleIcon width="60px" height="60px" />
            <p>¡El estado del producto se cambió exitosamente!</p>
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
              Hubo un problema al cambiar el estado del producto. Por favor,
              inténtelo nuevamente.
            </p>
          </div>
          <Button className="bg-red-600 text-white" onPress={onClose}>
            Cerrar
          </Button>
        </ModalBody>
      ) : estado === "validacion" ? (
        <ModalBody>
          <h2 className="text-center text-xl text-yellow-600">Advertencia</h2>
          <div className="flex flex-col items-center gap-3">
            <WarningAmberRounded className="text-yellow-600" style={{ fontSize: '60px' }} />
            <p className="text-center">
              No se puede desactivar este producto porque aún tiene stock
              disponible.
            </p>
          </div>
          <Button
            className="bg-yellow-600 text-white"
            onPress={onClose}
          >
            Entendido
          </Button>
        </ModalBody>
      ) : (
        <ModalBody>
          <h2 className="text-center text-xl">Cambiar Estado del Producto</h2>
          <p className="text-center">
            ¿Desea cambiar el estado de este producto?
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              className="bg-green-600 text-white"
              onPress={actualizarEstadoProducto}
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

  );
}
