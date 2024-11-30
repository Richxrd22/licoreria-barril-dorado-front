async function listarEmpleado() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7575/empleado/listar`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const empleado = await response.json(); // Solo recibimos los productos directamente
      return empleado;
    } catch (error) {
      console.error("Error al listar productos:", error);
      throw new Error("Error al conectar con el servidor");
    }
  }
  
  async function registrarEmpleado(empleado) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:7575/auth/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
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
  
  async function obtenerEmpleadoId(id) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:7575/empleado/buscar/${id}`,
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

  async function obtenerEmpleadoPorCorreo(correo) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:7575/empleado/buscarPorCorreo/${correo}`,
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
  async function editarEmpleado(empleado) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7575/empleado/actualizar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });
      if (!response.ok && response.status === 406) {
        throw new Error("El Empleado ingresado ya existe.");
       }
    } catch (error) {
      if (error.message === "El Empleado ingresado ya existe.") {
        throw error;
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  }
  
  async function editarEmpleadoUsuario(empleado) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7575/auth/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });
      if (!response.ok && response.status === 406) {
        throw new Error("El Empleado ingresado ya existe.");
      }
    } catch (error) {
      if (error.message === "El Empleado ingresado ya existe.") {
        throw error;
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  }
  
  async function actualizarContrasena(empleado) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:7575/usuario/cambiar-contraseña`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empleado),
      });
      if (!response.ok && response.status === 406) {
        throw new Error("La contraseña no se actualizo ");
      }
    } catch (error) {
      if (error.message === "El Empleado ingresado ya existe.") {
        throw error;
      } else {
        throw new Error("Error al conectar con el servidor");
      }
    }
  }



  export const empleadoService = {
    listarEmpleado,
    registrarEmpleado,
    obtenerEmpleadoId,
    editarEmpleado,
    actualizarContrasenaAdmin,
    editarEmpleadoUsuario,
    obtenerEmpleadoPorCorreo,
  };
  