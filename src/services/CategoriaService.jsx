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
    // Retorna los productos, número total de páginas y total de elementos
    return categorias;
  } catch (error) {
    console.error("Error al listar las categorias:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

export const categoriaService = {
  listarCategoria
};