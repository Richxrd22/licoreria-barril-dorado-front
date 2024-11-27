import React, { useEffect, useState } from 'react';
import { proveedorService } from '../../../services/ProveedorService';
import { productoService } from '../../../services/ProductoService'; // Asume que tienes un servicio para productos
import Progress from '../../../componentes/Progress';
import { Button, ModalBody } from '@nextui-org/react';
import { CloseCircleIcon } from '../../../../public/Icons/CloseCircleIcon';
import { WarningAmberRounded } from '@mui/icons-material';
import { CheckCircleIcon } from '../../../../public/Icons/CheckCircleIcon';

export default function GestionActivo({ onClose, proveedorId, actualizarTabla }) {
  const [proveedor, setProveedor] = useState(null);
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchProveedor = async () => {
    try {
      const data = await proveedorService.obtenerProveedorId(proveedorId);
      setProveedor(data);
    } catch (error) {
      console.error('Error al obtener los detalles del Proveedor:', error);
    }
  };

  const verificarProductosAsociados = async () => {
    try {
      const productos = await productoService.listarProducto(); // Traemos todos los productos
      // Filtramos los productos que tienen el id_proveedor asociado
      const productosAsociados = productos.filter(
        (producto) => producto.id_proveedor === proveedorId
      );
      return productosAsociados.length > 0; // Retorna true si hay productos asociados
    } catch (error) {
      console.error('Error al verificar productos asociados:', error);
      return false; // En caso de error, asumimos que no hay productos asociados
    }
  };

  const actualizarEstadoProveedor = async () => {
    try {
      setCargando(true);

      // Verifica si el proveedor tiene productos asociados
      const tieneProductos = await verificarProductosAsociados();

      if (tieneProductos) {
        setEstado('validacion'); // Cambia el estado para mostrar la advertencia
        return;
      }

      const nuevoActivo = proveedor.activo ? 0 : 1;

      const proveedorActualizado = {
        ...proveedor,
        id_proveedor: proveedorId,
        activo: nuevoActivo,
      };

      await proveedorService.editarProveedor(proveedorActualizado);

      setProveedor(proveedorActualizado);
      actualizarTabla(proveedorActualizado);
      setEstado('success');
    } catch (error) {
      console.error('Error al actualizar el estado del Proveedor:', error);
      setEstado('error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (proveedorId) {
      fetchProveedor();
    }
  }, [proveedorId]);

  if (!proveedor) return <Progress />;

  return (
    <>
      {estado === 'success' ? (
        <ModalBody>
          <h2 className="text-center text-xl">Licorería Barril Dorado</h2>
          <div className="flex flex-col items-center gap-3">
            <CheckCircleIcon width="60px" height="60px" />
            <p>¡El estado del proveedor se cambió exitosamente!</p>
          </div>
          <Button className="bg-slate-800 text-white" onPress={onClose}>
            Aceptar
          </Button>
        </ModalBody>
      ) : estado === 'error' ? (
        <ModalBody>
          <h2 className="text-center text-xl text-red-600">Error</h2>
          <div className="flex flex-col items-center gap-3">
            <CloseCircleIcon width="60px" height="60px" />
            <p>
              Hubo un problema al cambiar el estado del proveedor. Por favor,
              inténtelo nuevamente.
            </p>
          </div>
          <Button className="bg-red-600 text-white" onPress={onClose}>
            Cerrar
          </Button>
        </ModalBody>
      ) : estado === 'validacion' ? (
        <ModalBody>
          <h2 className="text-center text-xl text-yellow-600">Advertencia</h2>
          <div className="flex flex-col items-center gap-3">
            <WarningAmberRounded className="text-yellow-600" style={{ fontSize: '60px' }} />
            <p className="text-center">
              No se puede cambiar el estado del proveedor porque tiene productos asociados.
            </p>
          </div>
          <Button className="bg-yellow-600 text-white" onPress={onClose}>
            Entendido
          </Button>
        </ModalBody>
      ) : (
        <ModalBody>
          <h2 className="text-center text-xl">Cambiar Estado del Proveedor</h2>
          <p className="text-center">
            ¿Desea cambiar el estado de este proveedor?
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              className="bg-green-600 text-white"
              onPress={actualizarEstadoProveedor}
              disabled={cargando}
            >
              {cargando ? 'Procesando...' : 'Confirmar'}
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
