export async function login(usuario) {
  try {
    const response = await fetch("http://localhost:7575/usuario/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(usuario)
    });
    if (response.ok) {
      const token = await response.json();
      return token.token;
    } else if (!response.ok && response.status === 401) {
      throw new Error("El email o la contraseña es incorrecta. Por favor, ingrese con una cuenta existente.");
    } else if (!response.ok && response.status === 406) {
      throw new Error("El usuario esta deshabilitado para ingresar al sistema.");
    }
  } catch (error) { 
    if (error.message === "El email o la contraseña es incorrecta. Por favor, ingrese con una cuenta existente.") {
      throw error;
    } else if (error.message === "El usuario esta deshabilitado para ingresar al sistema.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}
