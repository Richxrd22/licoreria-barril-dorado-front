import React, { useEffect, useState } from 'react'
import { useFormulario } from '../../../context/FormularioContext';
import { useNavigate } from 'react-router-dom';
import { empresaService } from '../../../services/EmpresaService';
import { Button, Input, ModalBody, ModalHeader } from '@nextui-org/react';
import { useFormik } from 'formik';
import { validacionEmpresaActualizar } from '../../../validaciones/validacionEmpresaActualizar';
import { useDecodedToken } from '../../../hook/useDecodedToken';

export default function EditarEmpresa({ onClose, empresaId }) {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null)
  const [empresasExistentes, setEmpresasExistentes] = useState([])
  const { markFormAsSubmitted } = useFormulario(); 
  const navigate = useNavigate();
  const { decodedToken, baseRoute } = useDecodedToken();
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const empresaBuscado = await empresaService.obtenerEmpresaId(empresaId);
        setEmpresaSeleccionada(empresaBuscado);

        const data = await empresaService.listarEmpresas();
        setEmpresasExistentes(data);

        formik.resetForm({
          values: {
            ...empresaBuscado
          },
        }); 
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (empresaId) {
      cargarDatos();
    }
  }, [empresaId]); 

  const formik = useFormik({
    initialValues: {
      id_empleado: "",
      nombre:"",
      ruc: "",
      website: "",
    },
    validationSchema: validacionEmpresaActualizar(empresasExistentes, empresaSeleccionada),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {

        await empresaService.editarEmpresa(values);

        resetForm();
        onClose();
        markFormAsSubmitted("empresa");
        navigate(`${baseRoute}/empresa/confirmacion`, {
          state: {
            mensaje: `Los Datos de la Empresa ${values.nombre} se actualizo con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar la Empresa:", error);
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <>
    <ModalHeader>Editar Empresa</ModalHeader>
    <ModalBody>
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
        <Button type="submit" color="primary" disabled={!formik.dirty || formik.isSubmitting}>
          Registrar
        </Button>
      </div>
    </form>
    </ModalBody>
    </>
  )
}
