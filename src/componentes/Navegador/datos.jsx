export const rutas_navegador_administrador = [
    {
        id: 1,
        ruta: "/panel",
        nombre: "Panel"
    },
    {
        id: 2,
        ruta: "/producto",
        nombre: "Producto"
    },
    {
        id: 3,
        ruta: "/empleado",
        nombre: "Empleados"
    },
    {
        id: 4,
        ruta: "/empresa",
        nombre: "Empresa"
    },
    {
        id: 5,
        ruta: "/proveedor",
        nombre: "Proveedor"
    },
    {
        id: 6,
        ruta: "/categoria",
        nombre: "Categoria"
    }
]

export const rutas_navegador_empleado = [
    {
        id: 1,
        ruta: "/panel",
        nombre: "Panel"
    },
    {
        id: 2,
        ruta: "/producto",
        nombre: "Producto"
    },
    {
        id: 3,
        ruta: "/empresa",
        nombre: "Empresa"
    },
    {
        id: 4,
        ruta: "/proveedor",
        nombre: "Proveedor"
    }
]


export const rutas_usuario = [
    {
        id: 6,
        ruta: "",
        nombre: "Perfil"
    },
    {
        id: 7,
        ruta: "/configuracion",
        nombre: "Configuracion"
    },
    {
        id: 8,
        ruta: "",
        nombre: "Salir"
    }

]

export const rutasAdministrador = [...rutas_navegador_administrador, ...rutas_usuario]
export const rutasEmpleado = [...rutas_navegador_empleado, ...rutas_usuario]