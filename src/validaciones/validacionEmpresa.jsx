import * as yup from "yup";

const validacionEmpresa = (empresas) => yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .test("nombre-unico", "El nombre ya está en uso", (value) => {
      // Verifica que el nombre no esté duplicado entre las empresas
      return !empresas.some((emp) => emp.nombre === value);
    }),

  ruc: yup
    .string()
    .required("El RUC es obligatorio")
    .matches(/^\d{11}$/, "El RUC debe tener 11 dígitos")
    .test("ruc-unico", "El RUC ya está en uso", (value) => {
      // Verifica que el RUC no esté duplicado
      return !empresas.some((emp) => emp.ruc === value);
    }),

  website: yup
    .string()
    .required("El sitio web es obligatorio")
    .matches(
      /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "El sitio web debe estar en el formato www.example.com"
    )
    .test("website-unico", "El website ya está en uso", (value) => {
      // Verifica que el website no esté duplicado entre las empresas
      return !empresas.some((emp) => emp.website === value);
    }),
});

export default validacionEmpresa;
