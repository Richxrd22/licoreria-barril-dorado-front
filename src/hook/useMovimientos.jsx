import { useState, useEffect } from "react";
import { movimientoService } from "../services/MovimientoService";  

export const useMovimientos = (movimientoId = null, anio = null) => {
    const [movimientos, setMovimientos] = useState([]);
    const [movimiento, setMovimiento] = useState(null);
    const [movimientoSumado,setMovimientoSumado]=useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMovimientos = async () => {
        setIsLoading(true);
        try {
            const data = await movimientoService.listarMovimientos();
            setMovimientos(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMovimientosSumados = async (anio) => {
        setIsLoading(true);
        try {
            const data = await movimientoService.listarMovimientosSumas(anio);
            setMovimientoSumado(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (anio) {
            fetchMovimientosSumados(anio);
        } else {
            fetchMovimientos();
        }
    }, [anio]);

    return { movimientos, movimiento, isLoading, error, setMovimientos, setMovimiento, fetchMovimientos,movimientoSumado  };
};
