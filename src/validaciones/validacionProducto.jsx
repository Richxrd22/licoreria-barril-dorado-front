import * as yup from "yup";

// Función que recibe la lista de productos existentes y valida los campos.
export const validacionProducto = (productos) =>
  yup.object({
    nombre: yup
      .string("Ingrese el nombre del producto")
      .required("Campo Obligatorio")
     
      .test(
        "primera-letra-mayuscula",
        "El nombre debe comenzar con una letra mayúscula",
        (value) => /^[A-Z]/.test(value) // Verifica que la primera letra sea mayúscula
      )
      .test(
        "nombre-unico",
        "El nombre del producto ya está en uso",
        (value) => {
          return !productos.some((prod) => prod.nombre === value);
        }
      ),

    descripcion: yup
      .string("Ingrese la descripción del producto")
      .required("Campo Obligatorio")
      .test(
        "primera-letra-mayuscula",
        "La descripción debe comenzar con una letra mayúscula",
        (value) => /^[A-Z]/.test(value) // Verifica que la primera letra sea mayúscula
      ),

    cantidad: yup
      .number("Ingrese una cantidad válida")
      .integer("La cantidad debe ser un número entero")
      .positive("La cantidad debe ser mayor a 0")
      .min(1, "La cantidad debe ser al menos 1")
      .max(50,"La cantidad no debe ser mayor a 50")
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
      .transform((value, originalValue) =>
        originalValue ? new Date(originalValue) : null
      )
      .required("Fecha de producción es obligatoria")
      .typeError("Fecha no válida"),

    fecha_vencimiento: yup
      .date()
      .transform((value, originalValue) =>
        originalValue ? new Date(originalValue) : null
      )
      .required("Fecha de vencimiento es obligatoria")
      .min(
        yup.ref("fecha_produccion"),
        "La fecha de vencimiento debe ser posterior a la fecha de producción"
      )
      .typeError("Fecha no válida"),

    id_categoria: yup
      .number("Seleccione una categoría")
      .required("Seleccione una categoría"),

    id_proveedor: yup
      .number("Seleccione un proveedor")
      .required("Seleccione un proveedor"),
  });
