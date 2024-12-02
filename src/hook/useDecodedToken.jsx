import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useMemo } from "react";

export const useDecodedToken = () => {
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        const miToken = localStorage.getItem("token");
        if (miToken) {
            const decoded = jwtDecode(miToken);
            setDecodedToken(decoded);
        }
    }, []);

    const getDecodedToken = () => {
        const miToken = localStorage.getItem("token");
        if (miToken) {
            try {
                return jwtDecode(miToken); 
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                return null;
            }
        }
        return null;
    };

    const rol = useMemo(() => {
        const decodedToken = getDecodedToken();
        return decodedToken?.roles?.includes("ROLE_ADMIN");
    }, []);

    const correo = useMemo(() => {
        const decodedToken = getDecodedToken();
        return decodedToken?.sub
    }, []);

    const baseRoute =
        rol
            ? "/admin"
            : "/empleado";

    return { baseRoute, rol ,correo,decodedToken};
};
