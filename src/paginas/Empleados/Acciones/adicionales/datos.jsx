const columns = [
    { name: "ID", uid: "id_empleado", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Apellido", uid: "apellido", sortable: true },
    { name: "Dni", uid: "dni"},
    { name: "Correo Personal", uid: "correo_personal" },
    { name: "Correo Empresarial", uid: "correo_empresarial" },
    { name: "Telefono", uid: "telefono" },
    { name: "Estado", uid: "activo" },
    { name: "Rol", uid: "nombre_rol" },
    { name: "Acciones", uid: "acciones" }
];
const statusOptions = [
    { name: "Activo", uid: 1 },
    { name: "Inactivo", uid: 0 },
];
export { columns, statusOptions };
