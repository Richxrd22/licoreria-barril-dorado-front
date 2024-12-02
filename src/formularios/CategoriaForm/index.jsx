import React, { useEffect, useState } from 'react'
import { useFormulario } from '../../context/FormularioContext';
import { useNavigate } from 'react-router-dom';
import { useDecodedToken } from '../../hook/useDecodedToken';
import { useFormik } from 'formik';
import validacionCategoria from '../../validaciones/validacionCategoria';
import { categoriaService } from '../../services/CategoriaService';
import { Button, Input } from '@nextui-org/react';

export default function CategoriaForm({onClose}) {
  const [categorias, setCategorias] = useState([])
  const { markFormAsSubmitted } = useFormulario();  // Función para actualizar el estado
  const navigate = useNavigate();
  const { decodedToken, baseRoute } = useDecodedToken();
  const fetchCategoria = async () => {
    try {
      const data = await categoriaService.listarCategoria();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };
  useEffect(() => {
    fetchCategoria();
  }, []);
  const formik = useFormik({
    initialValues: {
      nombre_categoria: "",
      activo: 1,
    },
    validationSchema: validacionCategoria(categorias),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await categoriaService.registrarCategoria(values);
        resetForm();
        onClose();
        markFormAsSubmitted('categoria');

        navigate(`${baseRoute}/categoria/confirmacion`, {
          state: {
            mensaje: `Categoria ${values.nombre_categoria} Registrada con Exito`,
          },
        });

      } catch (error) {
        console.error("Error al registrar categoria:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}  className="space-y-6">
      <div >
        <Input
          type="text"
          label="Nombre"
          placeholder="Introduce el Nombre de la Categoria"
          id="nombre_categoria"
          name="nombre_categoria"
          value={formik.values.nombre_categoria}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.nombre_categoria && Boolean(formik.errors.nombre_categoria)}
          isInvalid={formik.touched.nombre_categoria && Boolean(formik.errors.nombre_categoria)}
          errorMessage={formik.touched.nombre_categoria && formik.errors.nombre_categoria}
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
