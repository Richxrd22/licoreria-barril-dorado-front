import * as yup from "yup";

export const validacionEmpresaActualizar = (empresas, empresaActualizar) =>
  yup.object({
    nombre: yup
      .string("Ingrese el nombre de la empresa")
      .required("El nombre es obligatorio")
      .test("nombre-unico", "El nombre ya está en uso", (value) => {
        const valorNormalizado = value?.toLowerCase();
        return !empresas.some(
          (emp) =>
            emp.nombre.toLowerCase() === valorNormalizado &&
            emp.id_empresa !== empresaActualizar.id_empresa
        );
      }),

    ruc: yup
      .string("Ingrese el RUC de la empresa")
      .required("El RUC es obligatorio")
      .matches(/^\d{11}$/, "El RUC debe tener exactamente 11 dígitos")
      .test("ruc-unico", "El RUC ya está en uso", (value) => {
        const valorNormalizado = value?.toLowerCase();
        return !empresas.some(
          (emp) =>
            emp.ruc.toLowerCase() === valorNormalizado &&
            emp.id_empresa !== empresaActualizar.id_empresa
        );
      }),

    website: yup
      .string("Ingrese el sitio web de la empresa")
      .required("El sitio web es obligatorio")
      .matches(
        /^www\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
        "El sitio web debe estar en el formato www.example.com"
      )
      .test("website-unico", "El sitio web ya está en uso", (value) => {
        const valorNormalizado = value?.toLowerCase();
        return !empresas.some(
          (emp) =>
            emp.website.toLowerCase() === valorNormalizado &&
            emp.id_empresa !== empresaActualizar.id_empresa
        );
      }),
  });
