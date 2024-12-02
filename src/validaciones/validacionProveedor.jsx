import * as yup from "yup";

export const validacionProveedor = (proveedores) =>
  yup.object({
    nombre: yup
      .string("Ingrese el nombre del proveedor")
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ][a-záéíóú]+$/, "El nombre debe comenzar con mayúscula y no contener números ni caracteres especiales"),

    apellido: yup
      .string("Ingrese el apellido del proveedor")
      .required("El apellido es obligatorio")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .matches(/^[A-ZÁÉÍÓÚ][a-záéíóú]+$/, "El apellido debe comenzar con mayúscula y no contener números ni caracteres especiales"),

    correo: yup
      .string("Ingrese un correo válido")
      .email("El correo debe ser un correo válido")
      .required("El correo es obligatorio")
      .test("correo-unico", "El correo ya está en uso", (value) => {
        // Convierte el correo a minúsculas antes de compararlo
        const correoNormalizado = value?.toLowerCase();
        return !proveedores.some(
          (proveedor) => proveedor.correo.toLowerCase() === correoNormalizado
        );
      }),

    dni: yup
      .string("Ingrese el DNI del proveedor")
      .matches(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos")
      .required("El DNI es obligatorio")
      .test("dni-unico", "El DNI ya está en uso", (value) => {
        return !proveedores.some((proveedor) => proveedor.dni === value);
      }),

    telefono: yup
      .string("Ingrese el número de celular")
      .matches(/^9\d{8}$/, "El celular debe comenzar con '9' y tener 9 dígitos")
      .required("El número de celular es obligatorio")
      .test("celular-unico", "El celular ya está en uso", (value) => {
        return !proveedores.some((proveedor) => proveedor.telefono === value);
      }),

    id_empresa: yup
      .number("Seleccione una empresa")
      .required("Seleccione una empresa")
      .positive("La empresa seleccionada no es válida")
      .integer("El ID de la empresa debe ser un número entero"),
  });
