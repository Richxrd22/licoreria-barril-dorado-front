const columns = [
    { name: "ID", uid: "id_categoria", sortable: true },
    { name: "Nombre", uid: "nombre_categoria"},
    { name: "Activo", uid: "activo", sortable: true  },
    { name: "Acciones", uid: "acciones" }
];
const statusOptionsActivo = [
    { uid: "1", name: "Activo" },
    { uid: "0", name: "Inactivo" },
];
export { columns, statusOptionsActivo };