import * as yup from "yup";

const validacionEmpleado = (empleados) =>
  yup.object({
    nombre: yup
      .string()
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ][a-záéíóú]+$/, "El nombre debe comenzar con mayúscula y no contener números ni caracteres especiales"),

    apellido: yup
      .string()
      .required("El apellido es obligatorio")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ][a-záéíóú]+$/, "El apellido debe comenzar con mayúscula y no contener números ni caracteres especiales"),

    dni: yup
      .string()
      .required("El DNI es obligatorio")
      .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos"),

    correo_personal: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("El correo electrónico no es válido")
      .test("correo-unico", "El correo ya está en uso", (value) => {
        return !empleados.some((emp) => emp.correo_personal === value);
      }),

      telefono: yup
      .string()
      .required("El celular es obligatorio")
      .matches(/^9\d{8}$/, "El celular debe comenzar con '9' y tener 9 dígitos")
      .test("celular-unico", "El celular ya está en uso", (value) => {
        return !empleados.some((emp) => emp.telefono === value);
      }),

    direccion: yup
      .string()
      .required("La dirección es obligatoria")
      .min(5, "La dirección debe tener al menos 5 caracteres")
      .max(100, "La dirección no puede tener más de 100 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ].*$/, "La dirección debe comenzar con mayúscula y no contener números ni caracteres especiales"),
  });

export default validacionEmpleado;
