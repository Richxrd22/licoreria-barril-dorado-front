import * as yup from "yup";

export const validacionProveedorActualizar = (proveedores, proveedorActual) =>
  yup.object({
    nombre: yup
      .string("Ingrese el nombre del proveedor")
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),

    apellido: yup
      .string("Ingrese el apellido del proveedor")
      .required("El apellido es obligatorio")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede tener más de 50 caracteres"),

    correo: yup
      .string("Ingrese un correo válido")
      .email("El correo debe ser un correo válido")
      .required("El correo es obligatorio")
      .test("correo-unico", "El correo ya está en uso", (value) => {
        const correoNormalizado = value?.toLowerCase();
        return !proveedores.some(
          (proveedor) =>
            proveedor.correo.toLowerCase() === correoNormalizado &&
            proveedor.id_proveedor !== proveedorActual.id_proveedor
        );
      }),

    dni: yup
      .string("Ingrese el DNI del proveedor")
      .matches(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos")
      .required("El DNI es obligatorio")
      .test("dni-unico", "El DNI ya está en uso", (value) => {
        return !proveedores.some(
          (proveedor) =>
            proveedor.dni === value &&
            proveedor.id_proveedor !== proveedorActual.id_proveedor
        );
      }),

    telefono: yup
      .string("Ingrese el número de celular")
      .matches(/^\d{9}$/, "El celular debe tener exactamente 9 dígitos")
      .required("El número de celular es obligatorio")
      .test("celular-unico", "El celular ya está en uso", (value) => {
        return !proveedores.some(
          (proveedor) =>
            proveedor.telefono === value &&
            proveedor.id_proveedor !== proveedorActual.id_proveedor
        );
      }),

    id_empresa: yup
      .number("Seleccione una empresa")
      .required("Seleccione una empresa")
      .positive("La empresa seleccionada no es válida")
      .integer("El ID de la empresa debe ser un número entero"),
  });
