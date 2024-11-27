const columns = [
  { name: "ID", uid: "id_producto", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: true },
  { name: "Descripción", uid: "descripcion", sortable: true },
  { name: "Empresa", uid: "empresa" },

  { name: "Cantidad", uid: "cantidad", sortable: true },
  { name: "Categoría", uid: "categoria" },

  { name: "Fecha de Producción", uid: "fecha_produccion" },

  { name: "Fecha de Vencimiento", uid: "fecha_vencimiento" },
  { name: "Estado Cantidad", uid: "estado_cantidad", sortable: true },
  { name: "Activo", uid: "activo", sortable: true },
  { name: "Acciones", uid: "acciones" }
];
const statusOptionsEstadoCantidad = [
  { uid: "1", name: "Disponible" },
  { uid: "0", name: "Agotado" },
];

const statusOptionsActivo = [
  { uid: "1", name: "Activo" },
  { uid: "0", name: "Inactivo" },
];

export { columns, statusOptionsEstadoCantidad, statusOptionsActivo };
