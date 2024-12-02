async function registrarMovimiento(movimiento) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:7575/movimiento-stock/registrar", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(movimiento),
        });
        if (!response.ok && response.status === 406) {
            throw new Error("El Movimiento ingresado ya existe.");
        }
    } catch (error) {
        if (error.message === "El movimiento ingresado ya existe.") {
            throw error;
        } else {
            throw new Error("Error al conectar con el servidor");
        }
    }
}

async function listarMovimientos() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:7575/movimiento-stock/listar`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const empresas = await response.json();
        return empresas;
    } catch (error) {
        console.error("Error al listar movimientos:", error);
        throw new Error("Error al conectar con el servidor");
    }
}

async function listarMovimientosSumas(anio) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`http://localhost:7575/movimiento-stock/por-mes?year=${anio}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const empresas = await response.json();
        return empresas;
    } catch (error) {
        console.error("Error al listar movimientos:", error);
        throw new Error("Error al conectar con el servidor");
    }
}

export const movimientoService = {
    registrarMovimiento,
    listarMovimientos,
    listarMovimientosSumas
};
