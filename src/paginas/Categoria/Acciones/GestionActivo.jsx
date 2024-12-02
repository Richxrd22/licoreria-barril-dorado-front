import React, { useEffect, useState } from 'react'
import { categoriaService } from '../../../services/CategoriaService';
import Progress from '../../../componentes/Progress';
import { Button, ModalBody } from '@nextui-org/react';
import { CheckCircleIcon } from '../../../../public/Icons/CheckCircleIcon';
import { WarningAmberRounded } from '@mui/icons-material';
import { CloseCircleIcon } from '../../../../public/Icons/CloseCircleIcon';
import { productoService } from '../../../services/ProductoService';

export default function GestionActivo({ onClose, categoriaId, actualizarTabla }) {
    const [categoria, setCategoria] = useState(null);
    const [estado, setEstado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const fetchCategoria = async () => {
        try {
            const data = await categoriaService.obtenerCategoriaId(categoriaId);
            setCategoria(data);
        } catch (error) {
            console.error("Error al obtener los detalles de la Categoria:", error);
        }
    };
    const verificarProductosAsociados = async () => {
        try {
          const productos = await productoService.listarProducto(); 
          const productosAsociados = productos.filter(
            (producto) => producto.id_categoria === categoriaId
          );
            return productosAsociados.length > 0;
        } catch (error) {
            console.error('Error al verificar productos asociados:', error);
            return false;
        }
    };
    const actualizarEstadoCategoria = async () => {
        try {
          setCargando(true);
    
          const tieneProductos = await verificarProductosAsociados();
    
          if (tieneProductos) {
            setEstado('validacion'); 
            return;
          }
    
          const nuevoActivo = categoria.activo ? 0 : 1;
    
          const categoriaActualizado = {
            ...categoria,
            id_categoria: categoriaId,
            activo: nuevoActivo,
          };
    
          await categoriaService.editarCategoria(categoriaActualizado);
    
          setCategoria(categoriaActualizado);
          actualizarTabla(categoriaActualizado);
          setEstado('success');
        } catch (error) {
          console.error('Error al actualizar el estado de la Categoria:', error);
          setEstado('error');
        } finally {
          setCargando(false);
        }
      };
    
    useEffect(() => {
        if (categoriaId) {
            fetchCategoria();
        }
    }, [categoriaId]);
    if (!categoria) return <Progress />;
    return (
        <>
        {estado === 'success' ? (
          <ModalBody>
            <h2 className="text-center text-xl">Licorería Barril Dorado</h2>
            <div className="flex flex-col items-center gap-3">
              <CheckCircleIcon width="60px" height="60px" />
              <p>¡El estado de la Categoria se cambió exitosamente!</p>
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
                Hubo un problema al cambiar el estado de la Categoria. Por favor,
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
                No se puede cambiar el estado de la Categoria porque tiene productos asociados.
              </p>
            </div>
            <Button className="bg-yellow-600 text-white" onPress={onClose}>
              Entendido
            </Button>
          </ModalBody>
        ) : (
          <ModalBody>
            <h2 className="text-center text-xl">Cambiar Estado de la Categoria</h2>
            <p className="text-center">
              ¿Desea cambiar el estado de esta Categoria?
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <Button
                className="bg-green-600 text-white"
                onPress={actualizarEstadoCategoria}
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
    )
}
