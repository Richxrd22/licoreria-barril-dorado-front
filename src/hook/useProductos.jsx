import { useState, useEffect } from "react";
import { productoService } from "../services/ProductoService";

export const useProductos = (productId = null) => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    setIsLoading(true);
    try {
      const data = await productoService.listarProducto();
      setProductos(data);
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
  }, [productId]);

  return { productos, producto, isLoading, error, fetchProductos, fetchProductoPorId };
};
