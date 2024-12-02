import React, { useEffect, useState } from 'react'
import { useFormulario } from '../../../context/FormularioContext';
import { useNavigate } from 'react-router-dom';
import { useDecodedToken } from '../../../hook/useDecodedToken';
import { categoriaService } from '../../../services/CategoriaService';
import { useFormik } from 'formik';
import { validacionCategoriaActualizar } from '../../../validaciones/validacionCategoriaActualizar';
import { Button, Input, ModalBody, ModalHeader } from '@nextui-org/react';

export default function EditarCategoria({ onClose, categoriaId }) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
    const [categoriasExistentes, setCategoriasExistentes] = useState([])
    const { markFormAsSubmitted } = useFormulario();
    const navigate = useNavigate();
    const { decodedToken, baseRoute } = useDecodedToken();
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const categoriaBuscado = await categoriaService.obtenerCategoriaId(categoriaId);
                setCategoriaSeleccionada(categoriaBuscado);

                const data = await categoriaService.listarCategoria();
                setCategoriasExistentes(data);

                formik.resetForm({
                    values: {
                        ...categoriaBuscado
                    },
                });
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        if (categoriaId) {
            cargarDatos();
        }
    }, [categoriaId]);


    const formik = useFormik({
        initialValues: {
            id_categoria: "",
            nombre_categoria: "",
            activo: "",
        },
        validationSchema: validacionCategoriaActualizar(categoriasExistentes, categoriaSeleccionada),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {

                await categoriaService.editarCategoria(values);

                resetForm();
                onClose();
                markFormAsSubmitted("categoria");
                navigate(`${baseRoute}/categoria/confirmacion`, {
                    state: {
                        mensaje: `Los Datos de la Categoria ${values.nombre_categoria} se actualizo con éxito`,
                    },
                });
            } catch (error) {
                console.error("Error al Actualizar la Categoria:", error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <ModalHeader>Editar Categoria</ModalHeader>
            <ModalBody>
                <form onSubmit={formik.handleSubmit} className="space-y-6">

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
