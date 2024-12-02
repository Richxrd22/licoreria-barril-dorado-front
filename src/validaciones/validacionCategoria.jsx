import * as yup from "yup";

const validacionCategoria = (categorias) => yup.object({
  nombre_categoria: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .test("nombre-unico", "El nombre ya está en uso", (value) => {
      if (!value) return true; // Si no hay valor, no se ejecuta la validación.
      
      // Convertir tanto el valor ingresado como el de las categorías a minúsculas
      return !categorias.some((categoria) => categoria.nombre_categoria.toLowerCase() === value.toLowerCase());
    }),
});

export default validacionCategoria;