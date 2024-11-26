import * as yup from "yup";

// Función que recibe la lista de productos existentes y valida el nombre, ignorando el producto a actualizar.
export const validacionProductoActualizar = (productos, productoActualizar) =>
  yup.object({
    nombre: yup
      .string("Ingrese el nombre del producto")
      .required("Campo Obligatorio")
      .test("nombre-unico", "El nombre del producto ya está en uso", (value) => {
        // Normaliza el nombre a minúsculas para comparación insensible a mayúsculas
        const nombreNormalizado = value?.toLowerCase();
        return (
          productoActualizar.nombre.toLowerCase() === nombreNormalizado || 
          !productos.some(
            (prod) =>
              prod.nombre.toLowerCase() === nombreNormalizado &&
              prod.id_producto !== productoActualizar.id_producto
          )
        );
      }),

    descripcion: yup
      .string("Ingrese la descripción del producto")
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
      .min(
        yup.ref("fecha_produccion"),
        "La fecha de vencimiento debe ser posterior a la fecha de producción"
      )
      .typeError("Fecha no válida"),

    id_categoria: yup
      .number("Seleccione una categoría") // Añadido tipo número
      .required("Seleccione una categoría"),

    id_proveedor: yup
      .number("Seleccione un proveedor") // Añadido tipo número
      .required("Seleccione un proveedor"),
  });
