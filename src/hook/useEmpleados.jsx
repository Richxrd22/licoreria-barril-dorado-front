import { useState, useEffect } from "react";
import { empleadoService } from "../services/EmpleadoService";

export const useEmpleados = (empleadoId = null) => {
    const [empleados, setEmpleados] = useState([]);
    const [empleado, setEmpleado] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmpleados = async () => {
        setIsLoading(true);
        try {
            const data = await empleadoService.listarEmpleado();
            setEmpleados(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmpleadosId = async (id) => {
        setIsLoading(true);
        try {
            const data = await empleadoService.obtenerEmpleadoId(id);
            setEmpleado(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (empleadoId) {
            fetchEmpleadosId(empleadoId);
        } else {
            fetchEmpleados();
        }
    }, [empleadoId]);

    return { empleados, empleado, isLoading, error,setEmpleados, setEmpleado, fetchEmpleados, fetchEmpleadosId };
};
