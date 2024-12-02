async function listarCategoria() {
  const token = localStorage.getItem("token")
  try {
    const response = await fetch(`http://localhost:7575/categoria/listar`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`, // Solo el token, sin 'Bearer'
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const categorias = await response.json();
    return categorias;
  } catch (error) {
    console.error("Error al listar las categorias:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

async function registrarCategoria(categoria) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:7575/categoria/registrar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("La Categoria ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "La Categoria ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}
async function obtenerCategoriaId(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:7575/categoria/buscar/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = response.json();
      return data;
    }
  } catch (error) {
    throw new Error("Error al conectar al servidor");
  }
}

async function editarCategoria(categoria) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/categoria/actualizar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("La Categoria ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "La Categoria ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}
export const categoriaService = {
  listarCategoria,
  registrarCategoria,
  editarCategoria,
  obtenerCategoriaId
};