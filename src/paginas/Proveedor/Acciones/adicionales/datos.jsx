const columns = [
    { name: "ID", uid: "id_proveedor", sortable: true },
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Apellido", uid: "apellido", sortable: true },
    { name: "Correo Personal", uid: "correo" },
    { name: "Dni", uid: "dni" },
    { name: "Telefono", uid: "telefono" },
    { name: "Estado", uid: "activo" },
    { name: "Empresa", uid: "empresa" },
    { name: "Acciones", uid: "acciones" }
];
const statusOptions = [
    { name: "Activo", uid: "1" },
    { name: "Inactivo", uid: "0" },
];
export { columns, statusOptions };
