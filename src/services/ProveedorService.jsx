async function listarProveedor() {
  const token = localStorage.getItem("token")
  try {
    const response = await fetch(`http://localhost:7575/proveedor/listar`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`, // Solo el token, sin 'Bearer'
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const proveedor = await response.json();
    // Retorna los productos, número total de páginas y total de elementos
    return proveedor;
  } catch (error) {
    console.error("Error al listar las Proveedores:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

async function registrarProveedor(proveedor) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:7575/proveedor/registrar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proveedor),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("El Proveedor ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "El Proveedor ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}

async function obtenerProveedorId(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:7575/proveedor/buscar/${id}`,
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

async function editarProveedor(proveedor) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/proveedor/actualizar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proveedor),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("El Proveedor ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "El Proveedor ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}

export const proveedorService = {
  listarProveedor,
  obtenerProveedorId,
  editarProveedor,
  registrarProveedor
};