import * as yup from "yup";

const validacionEmpleadoActualizar = (empleadosExistentes, empleadoActual) => {
  return yup.object({
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
      .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos")
      .test("dni-unico", "El DNI ya está en uso", (value) => {
        // Permitir el DNI del propio empleado o evitar duplicados
        return (
          empleadoActual.dni === value ||
          !empleadosExistentes.some((empleado) => empleado.dni === value)
        );
      }),
    correo_personal: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("El correo electrónico no es válido")
      .test("correo-unico", "El correo ya está en uso", (value) => {
        // Permitir el correo del propio empleado o evitar duplicados
        return (
          empleadoActual.correo_personal === value ||
          !empleadosExistentes.some((empleado) => empleado.correo_personal === value)
        );
      }),
    telefono: yup
      .string()
      .required("El celular es obligatorio")
      .matches(/^\d{9}$/, "El celular debe tener 9 dígitos")
      .test("telefono-unico", "El celular ya está en uso", (value) => {
        // Permitir el celular del propio empleado o evitar duplicados
        return (
          empleadoActual.telefono === value ||
          !empleadosExistentes.some((empleado) => empleado.telefono === value)
        );
      }),
    direccion: yup
      .string()
      .required("La dirección es obligatoria")
      .min(5, "La dirección debe tener al menos 5 caracteres")
      .max(100, "La dirección no puede tener más de 100 caracteres"),
  });
};

export default validacionEmpleadoActualizar;