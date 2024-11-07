import * as yup from "yup";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),

  ruc: yup
    .string()
    .required("El RUC es obligatorio")
    .matches(/^\d{11}$/, "El RUC debe tener 11 dígitos"),

    website: yup
    .string()
    .required("El sitio web es obligatorio")
    .matches(
      /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "El sitio web debe estar en el formato www.example.com"
    ),
});

export default validationSchema;
