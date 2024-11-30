import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { validacionProveedor } from '../../validaciones/validacionProveedor';
import { useNavigate } from 'react-router-dom';
import { useFormulario } from "../../context/FormularioContext";
import { proveedorService } from "../../services/ProveedorService";
import { empresaService } from '../../services/EmpresaService';
import { useDecodedToken } from '../../hook/useDecodedToken';
export default function ProveedorForm({ onClose }) {

  const [proveedores, setProveedores] = useState([])
  const [empresas, setEmpresas] = useState([])
  const { markFormAsSubmitted } = useFormulario();  // Función para actualizar el estado
  const navigate = useNavigate();
  const { decodedToken, baseRoute } = useDecodedToken();
  const fetchProveedores = async () => {
    try {
      const data = await proveedorService.listarProveedor();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener Proveedores:", error);
    }
  };
  const fetchEmpresas = async () => {
    try {
      const data = await empresaService.listarEmpresasNoUsadas();
      setEmpresas(data);
    } catch (error) {
      console.error("Error al obtener Empresas:", error);
    }
  };
  useEffect(() => {
    fetchProveedores();
    fetchEmpresas();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      correo: "",
      dni: "",
      telefono: "",
      id_empresa: "",
      activo: 1
    },
    validationSchema: validacionProveedor(proveedores),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await proveedorService.registrarProveedor(values);
        resetForm();
        onClose();
        markFormAsSubmitted('proveedor');
        navigate(`${baseRoute}/proveedor/confirmacion`, {
          state: {
            mensaje: `Proveedor ${values.nombre} Registrado con Exito`,
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
          placeholder="Introduce el Nombre del Proveedor"
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
          label="Apellido"
          placeholder="Introduce el Apellido del Proveedor"
          id="apellido"
          name="apellido"
          value={formik.values.apellido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.apellido && Boolean(formik.errors.apellido)
          }
          isInvalid={formik.touched.apellido && Boolean(formik.errors.apellido)}
          errorMessage={formik.touched.apellido && formik.errors.apellido}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="Dni"
          placeholder="Introduce el Dni del Proveedor"
          id="dni"
          name="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.dni && Boolean(formik.errors.dni)}
          isInvalid={formik.touched.dni && Boolean(formik.errors.dni)}
          errorMessage={formik.touched.dni && formik.errors.dni}
        />
        <Input
          type="email"
          label="Correo"
          placeholder="Introduce el Correo del Proveedor"
          id="correo"
          name="correo"
          value={formik.values.correo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.correo && Boolean(formik.errors.correo)}
          isInvalid={formik.touched.correo && Boolean(formik.errors.correo)}
          errorMessage={formik.touched.correo && formik.errors.correo}
        />
      </div>
      <div className="flex gap-5">
        <Input
          type="text"
          label="Celular"
          placeholder="Introduce el Celular del Proveedor"
          id="telefono"
          name="telefono"
          value={formik.values.telefono}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.telefono && Boolean(formik.errors.telefono)
          }
          isInvalid={formik.touched.telefono && Boolean(formik.errors.telefono)}
          errorMessage={formik.touched.telefono && formik.errors.telefono}
        />
        <Select
          label="Empresa"
          placeholder="Selecciona una Empresa"
          id="id_empresa"
          name="id_empresa"
          onChange={formik.handleChange}
          onBlur={() => formik.handleBlur("id_empresa")}
          onError={() =>
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            Boolean(formik.errors.id_empresa)
          }
          isInvalid={
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            Boolean(formik.errors.id_empresa)
          }
          errorMessage={
            !formik.values.id_empresa.length &&
            formik.touched.id_empresa &&
            formik.errors.id_empresa
          }
          className="max-w-ws"
          onClose={() => {
            formik.setFieldTouched("id_empresa", true);
          }}
        >
          {empresas.map((empresa) => {
            return <SelectItem key={empresa.id_empresa} value={empresa.id_empresa} >{empresa.nombre}</SelectItem>
          })}

        </Select>
      </div>
      <div className='pb-5'>
        <Button type='submit' color='primary' >Registar</Button>
      </div>
    </form>
  );
}
