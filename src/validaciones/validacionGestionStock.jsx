import * as Yup from "yup";

export const validacionGestionStock = (cantidadTotal, isReducing) =>
  Yup.object().shape({
    cantidad: Yup.number()
      .required("La cantidad es obligatoria")
      .min(1, "La cantidad debe ser al menos 1")
      .test(
        "is-valid-reduction",
        `La cantidad no puede ser mayor a la disponible (${cantidadTotal})`,
        function (value) {
          if (isReducing) {
            return value <= cantidadTotal;
          }
          return true;
        }
      ),
    // Agrega otras validaciones necesarias para otros campos
  });
