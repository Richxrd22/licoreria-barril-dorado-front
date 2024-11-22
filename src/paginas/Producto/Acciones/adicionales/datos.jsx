const columns = [
  { name: "ID", uid: "id_producto", sortable: true },
  { name: "Nombre", uid: "nombre", sortable: true },
  { name: "Descripción", uid: "descripcion", sortable: true },
  { name: "Cantidad", uid: "cantidad", sortable: true },
  { name: "Estado", uid: "estado_cantidad", sortable: true },
  { name: "Fecha de Producción", uid: "fecha_produccion" },
  { name: "Fecha de Vencimiento", uid: "fecha_vencimiento" },
  { name: "Categoría", uid: "categoria" },
  { name: "Acciones", uid: "acciones" }
];
const statusOptions = [
  { name: "Disponible", uid: 1 },
  { name: "Agotado", uid: 0 },
];
export { columns, statusOptions };
