import { useState, useMemo, useEffect } from "react";
import { productoService } from "../services/ProductoService";

export function useProductosManager(initialProductos = []) {
    const [productos, setProductos] = useState(initialProductos);

    const actualizarTabla = (productoActualizado) => {
        setProductos((prevProductos) =>
            prevProductos.map((producto) =>
                producto.id_producto === productoActualizado.id_producto
                    ? { ...producto, ...productoActualizado }
                    : producto
            )
        );
    };

    useEffect(() => {
        const fetchProductos = async () => {
            // Reemplaza esto con tu llamada real a la API
            const data = await productoService.listarProducto()
            setProductos(data); // Asegúrate de que `data` sea un arreglo válido
        };

        fetchProductos();
    }, []); // Solo se ejecuta al montar

    return { productos, setProductos, actualizarTabla };
}
