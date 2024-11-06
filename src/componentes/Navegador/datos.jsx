export const rutas_navegador = [
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
        ruta: "/empleados",
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
    }
]

export const rutas_usuario =[
    {
        id: 6,
        ruta: "/perfil",
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

export const rutas=[...rutas_navegador,...rutas_usuario]