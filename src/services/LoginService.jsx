export async function login(usuario) {
  try {
    const response = await fetch("http://localhost:7575/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      const token = await response.json();
      return token.token;
    } else {
      if (response.status === 401) {
        throw new Error(
          "El email o la contraseña es incorrecta. Por favor, ingrese con una cuenta existente."
        );
      } else if (response.status === 406) {
        throw new Error(
          "El usuario está deshabilitado para ingresar al sistema."
        );
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  } catch (error) {
    throw error;
  }
}