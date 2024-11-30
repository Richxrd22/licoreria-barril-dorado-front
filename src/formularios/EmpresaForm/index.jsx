import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import validacionEmpresa from "../../validaciones/validacionEmpresa";
import { useFormulario } from "../../context/FormularioContext";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../../services/EmpresaService";
import { useDecodedToken } from "../../hook/useDecodedToken";

export default function EmpresaForm({onClose}) {
  const [empresas, setEmpresa] = useState([])
  const { markFormAsSubmitted } = useFormulario();  // Función para actualizar el estado
  const navigate = useNavigate();
  const { decodedToken, baseRoute } = useDecodedToken();
  const fetchEmpresa = async () => {
    try {
      const data = await empresaService.listarEmpresas();
      setEmpresa(data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, []);
  const formik = useFormik({
    initialValues: {
      nombre: "",
      ruc: "",
      website: "",
    },
    validationSchema: validacionEmpresa(empresas),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await empresaService.registrarEmpresa(values);
        // Reseteamos el formulario solo si deseas limpiar los campos después del envío
        resetForm();
        onClose();
        // Actualizamos el estado del formulario como "enviado"
        markFormAsSubmitted('empresa');

        // Redirigimos a la ruta de confirmación del producto
        navigate(`${baseRoute}/empresa/confirmacion`, {
          state: {
            mensaje: `Empresa ${values.nombre} Registrada con Exito`,
          },
        });

      } catch (error) {
        console.error("Error al registrar empresa:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="flex gap-5">
        <Input
          type="text"
          label="Nombre"
          placeholder="Introduce el Nombre de la Empresa"
          id="nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.nombre && Boolean(formik.errors.nombre)}
          isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
          errorMessage={formik.touched.nombre && formik.errors.nombre}
        />
        <Input
          type="text"
          label="Ruc"
          placeholder="Introduce el Ruc de la Empresa"
          id="ruc"
          name="ruc"
          value={formik.values.ruc}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.ruc && Boolean(formik.errors.ruc)}
          isInvalid={formik.touched.ruc && Boolean(formik.errors.ruc)}
          errorMessage={formik.touched.ruc && formik.errors.ruc}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="website"
          placeholder="Introduce el WebSite de la Empresa"
          id="website"
          name="website"
          value={formik.values.website}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.website && Boolean(formik.errors.website)
          }
          isInvalid={formik.touched.website && Boolean(formik.errors.website)}
          errorMessage={formik.touched.website && formik.errors.website}
        />
      </div>
      <div className="pb-5">
        <Button type="submit" color="primary" disabled={formik.isSubmitting}>
          Registrar
        </Button>
      </div>
    </form>
  );
}
