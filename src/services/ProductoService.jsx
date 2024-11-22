async function listarProducto() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/producto/listar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const productos = await response.json(); // Solo recibimos los productos directamente
    return productos;
  } catch (error) {
    console.error("Error al listar productos:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

async function registrarProducto(producto) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:7575/producto/registrar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("El Producto ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "El Producto ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}

async function obtenerproductoId(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:7575/producto/buscar/${id}`,
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

async function editarProducto(producto) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/producto/actualizar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("El Producto ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "El Producto ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}



export const productoService = {
  listarProducto,
  registrarProducto,
  obtenerproductoId,
  editarProducto,
};
