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
  
  export const proveedorService = {
    listarProveedor
  };