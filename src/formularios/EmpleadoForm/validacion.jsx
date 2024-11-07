import * as yup from "yup";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  
  apellido: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),
  
  dni: yup
    .string()
    .required("El DNI es obligatorio")
    .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos"),
  
  correo: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("El correo electrónico no es válido"),
  
  celular: yup
    .string()
    .required("El celular es obligatorio")
    .matches(/^\d{9}$/, "El celular debe tener 9 dígitos"),
  
  direccion: yup
    .string()
    .required("La dirección es obligatoria")
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(100, "La dirección no puede tener más de 100 caracteres"),
});

export default validationSchema;