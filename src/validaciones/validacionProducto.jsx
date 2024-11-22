import * as yup from "yup";

export const validacionProducto = yup.object({
  nombre: yup
    .string("Ingrese el nombre del producto")
    .required("Campo Obligatorio"),
    
  descripcion: yup
    .string("Ingrese la descripción del producto")
    .required("Campo Obligatorio"),
    
  cantidad: yup
    .number("Ingrese una cantidad válida")
    .integer("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0")
    .required("Campo Obligatorio"),
    
  precio: yup
    .number("Ingrese un precio válido")
    .positive("El precio debe ser mayor a 0")
    .required("Campo Obligatorio"),
    
  estado_cantidad: yup
    .number("Seleccione el estado")
    .oneOf([0, 1], "El estado debe ser '0' para inactivo o '1' para activo")
    .required("Campo Obligatorio"),
    
  fecha_produccion: yup
    .date()
    .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
    .required("Fecha de producción es obligatoria")
    .typeError("Fecha no válida"),

  fecha_vencimiento: yup
    .date()
    .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
    .required("Fecha de vencimiento es obligatoria")
    .min(yup.ref('fecha_produccion'), 'La fecha de vencimiento debe ser posterior a la fecha de producción')
    .typeError("Fecha no válida"),
  
  id_categoria: yup
    .number("Seleccione una categoría")  // Añadido tipo número
    .required("Seleccione una categoría"),
    
  id_proveedor: yup
    .number("Seleccione un proveedor")  // Añadido tipo número
    .required("Seleccione un proveedor")
});
