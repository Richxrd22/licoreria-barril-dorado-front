async function listarEmpresas() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/empresa/listar`, {
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
    console.error("Error al listar productos:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

async function listarEmpresasNoUsadas(idProveedorActual = null) {
  const token = localStorage.getItem("token");
  
  // Construir la URL de la API
  let url = "http://localhost:7575/empresa/listar/no-ocupados";
  
  // Si se pasa el idProveedorActual, agregarlo como parámetro de consulta
  if (idProveedorActual) {
    url += `?idProveedorActual=${idProveedorActual}`;
  }
  
  try {
    const response = await fetch(url, {
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
    console.error("Error al listar empresas:", error);
    throw new Error("Error al conectar con el servidor");
  }
}

async function registrarEmpresa(empresa) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:7575/empresa/registrar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("La Empresa ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "La Empresa ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}

async function obtenerEmpresaId(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:7575/empresa/buscar/${id}`,
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

async function editarEmpresa(empresa) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:7575/empresa/actualizar`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });
    if (!response.ok && response.status === 406) {
      throw new Error("La empresa ingresado ya existe.");
    }
  } catch (error) {
    if (error.message === "La empresa ingresado ya existe.") {
      throw error;
    } else {
      throw new Error("Error al conectar con el servidor");
    }
  }
}



export const empresaService = {
  listarEmpresas,
  registrarEmpresa,
  obtenerEmpresaId,
  editarEmpresa,
  listarEmpresasNoUsadas
};
