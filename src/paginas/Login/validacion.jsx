import * as yup from "yup";
export const validationSchema = yup.object({
    correo: yup
      .string("Ingrese su correo electrónico")
      .email("Ingrese un correo electrónico válido")
      .required("Campo Obligatorio"),
    clave: yup
      .string("Ingrese su contraseña")
     
      .required("Campo Obligatorio"),
  });

