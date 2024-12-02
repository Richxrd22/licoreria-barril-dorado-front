import { useState, useEffect } from "react";
import { productoService } from "../services/ProductoService";

const filtrarProductos = (productos, tipoFiltro) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Aseguramos que sea medianoche

  return productos.filter((producto) => {
    if (tipoFiltro === "vencimiento" && producto.fecha_vencimiento) {
      const fechaVencimiento = new Date(producto.fecha_vencimiento);
      fechaVencimiento.setHours(0, 0, 0, 0);

      const diffMilliseconds = fechaVencimiento - currentDate;
      const diffDays = Math.floor(diffMilliseconds / (1000 * 3600 * 24));

      // Incluir productos ya vencidos (diffDays < 0) y próximos a vencer (0 < diffDays <= 15)
      return diffDays <= 15;
    }

    if (tipoFiltro === "bajoStock" && producto.cantidad !== undefined) {
      // Verificar si el producto tiene 15 unidades o menos en stock
      return producto.cantidad <= 15 && producto.estado_cantidad;
    }

    return false;
  });
};


export const useProductos = (productId = null) => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState([]); // Array combinado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const data = await productoService.listarProducto();
      setProductos(data);
      
      // Filtrar productos por vencimiento y bajo stock y combinarlos en un solo array
      const productosVencimientoFiltrados = filtrarProductos(data, "vencimiento").map(producto => ({ ...producto, tipo: "vencimiento" }));
      const productosBajoStockFiltrados = filtrarProductos(data, "bajoStock").map(producto => ({ ...producto, tipo: "bajoStock" }));
      
      // Combinamos ambos arrays en uno solo
      setProductosFiltrados([
        ...productosVencimientoFiltrados,
        ...productosBajoStockFiltrados
      ]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductoPorId = async (id) => {
    setIsLoading(true);
    try {
      const data = await productoService.obtenerproductoId(id);
      setProducto(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductoPorId(productId);
    } else {
      fetchProductos();
    }
  }, [productId]); // Ejecutar solo cuando cambia productId

  return {
    productos,
    producto,
    productosFiltrados,  // Un solo array con ambos filtros
    isLoading,
    error,
    fetchProductos,
    fetchProductoPorId,
    setProductos
  };
};
