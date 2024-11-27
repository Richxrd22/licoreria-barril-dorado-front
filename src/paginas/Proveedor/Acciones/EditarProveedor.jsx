import React, { useEffect, useState } from "react";
import { useFormulario } from "../../../context/FormularioContext";
import { useNavigate } from "react-router-dom";
import { proveedorService } from "../../../services/ProveedorService";
import { useFormik } from "formik";
import { validacionProveedor } from "../../../validaciones/validacionProveedor";
import { Button, Input, ModalBody, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { validacionProveedorActualizar } from "../../../validaciones/validacionProveedorActualizar";
import Progress from "../../../componentes/Progress";
import { empresaService } from "../../../services/EmpresaService";

export default function EditarProveedor({ onClose, proveedorId }) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [proveedoresExistentes, setProveedoresExistentes] = useState([]);
  const [empresas, setEmpresas] = useState([])
  const { markFormAsSubmitted } = useFormulario(); // Función para actualizar el estado
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar datos del proveedor
        const proveedorBuscado = await proveedorService.obtenerProveedorId(
          proveedorId
        );
        setProveedorSeleccionado(proveedorBuscado);

        // Cargar proveedors existentes (si es necesario)
        const data = await proveedorService.listarProveedor();
        setProveedoresExistentes(data);

        const listadoEmpresas = await empresaService.listarEmpresas();
        setEmpresas(listadoEmpresas);
        // Usar `resetForm` después de obtener los datos
        formik.resetForm({
          values: {
            id_proveedor: proveedorId,
            nombre: proveedorBuscado.nombre,
            apellido: proveedorBuscado.apellido,
            dni: proveedorBuscado.dni,
            correo: proveedorBuscado.correo,
            telefono: proveedorBuscado.telefono,
            id_empresa: proveedorBuscado.id_empresa,
            activo: proveedorBuscado.activo,
          },
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (proveedorId) {
      cargarDatos();
    }
  }, [proveedorId]); // Solo se ejecuta cuando `employeeId` cambia

  const formik = useFormik({
    initialValues: {
      id_proveedor: "",
      nombre: "",
      apellido: "",
      correo: "",
      dni: "",
      telefono: "",
      id_empresa: "",
      activo: "",
    },
    validationSchema: validacionProveedorActualizar(
      proveedoresExistentes,
      proveedorSeleccionado
    ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        await proveedorService.editarProveedor(values);

        resetForm();
        onClose();
        markFormAsSubmitted("proveedor");
        navigate("/admin/proveedor/confirmacion", {
          state: {
            mensaje: `Los Datos del Proveedor ${values.nombre} se actualizo con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar el Proveedor:", error);
      } finally {
        setSubmitting(false); // Esto indicará que el formulario terminó de enviarse
      }
    },
  });

  if (!proveedorSeleccionado) return <Progress />;
  return (
    <>
      <ModalHeader>Actualizar Proveedor</ModalHeader>
      <ModalBody>
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
              onError={() =>
                formik.touched.nombre && Boolean(formik.errors.nombre)
              }
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
              isInvalid={
                formik.touched.apellido && Boolean(formik.errors.apellido)
              }
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
              onError={() =>
                formik.touched.correo && Boolean(formik.errors.correo)
              }
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
              isInvalid={
                formik.touched.telefono && Boolean(formik.errors.telefono)
              }
              errorMessage={formik.touched.telefono && formik.errors.telefono}
            />
            <Select
              label="Empresa"
              placeholder="Selecciona una Empresa"
              id="id_empresa"
              name="id_empresa"
              selectedKeys={new Set([formik.values.id_empresa.toString()])}
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
                return (
                  <SelectItem
                    key={empresa.id_empresa}
                    value={empresa.id_empresa}
                  >
                    {empresa.nombre}
                  </SelectItem>
                );
              })}
            </Select>
          </div>
          <div className="pb-5">
            <Button
              type="submit"
              color="primary"
              disabled={!formik.dirty || formik.isSubmitting}
            >
              Registar
            </Button>
          </div>
        </form>
      </ModalBody>
    </>
  );
}
