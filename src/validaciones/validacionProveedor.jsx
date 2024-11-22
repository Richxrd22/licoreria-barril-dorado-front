import * as yup from "yup";

export const validacionProveedor = yup.object({
  nombre: yup
    .string("Ingrese el nombre del proveedor")
    .required("Campo Obligatorio"),

  apellido: yup
    .string("Ingrese el apellido del proveedor")
    .required("Campo Obligatorio"),

  correo: yup
    .string("Ingrese un correo válido")
    .email("El correo debe ser un correo válido")
    .required("Campo Obligatorio"),

  dni: yup
    .string("Ingrese el DNI del proveedor")
    .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos")
    .required("Campo Obligatorio"),

  celular: yup
    .string("Ingrese el número de celular")
    .matches(/^\d{9}$/, "El número de celular debe tener 9 dígitos")
    .required("Campo Obligatorio"),

  id_empresa: yup.required("Seleccione una Empresa"),
});
