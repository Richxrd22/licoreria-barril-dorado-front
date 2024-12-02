import * as yup from "yup";

export const validacionCategoriaActualizar = (categorias, categoriaActualizar) =>
  yup.object({
    nombre_categoria: yup
      .string("Ingrese el nombre de la categoría")
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ][a-záéíóú]+$/, "El nombre debe comenzar con mayúscula y no contener números ni caracteres especiales")
      .test("nombre-categoria-unico", "El nombre de la categoría ya está en uso", (value) => {
        const valorNormalizado = value?.toLowerCase();
        return !categorias.some(
          (categoria) =>
            categoria.nombre_categoria.toLowerCase() === valorNormalizado &&
            categoria.id_categoria !== categoriaActualizar.id_categoria // Excepción para la categoría actual
        );
      }),
  });
