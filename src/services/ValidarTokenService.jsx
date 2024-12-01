export const validateToken = async (token) => {
    try {
        const response = await fetch(`http://localhost:7575/auth/validate`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return true; // Token válido
        } else {
            return false; // Token inválido o expirado
        }
    } catch (error) {
        console.error('Error al validar el token:', error);
        return false; // Si hay error en la conexión o en la validación
    }
};