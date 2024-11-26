import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { validacionProducto } from "../../validaciones/validacionProducto";
import { categoriaService } from "../../services/CategoriaService";
import { proveedorService } from "../../services/ProveedorService";
import { productoService } from "../../services/ProductoService";
import { useFormulario } from "../../context/FormularioContext";
import { useNavigate } from "react-router-dom";
export default function ProductoForm({ onClose }) {

  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos,setProductos]=useState([]);
  const { markFormAsSubmitted } = useFormulario();  // Función para actualizar el estado
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      estado_cantidad: 1,
      fecha_produccion: null,
      fecha_vencimiento: null,
      id_categoria: "",
      id_proveedor: "",
      activo:1
    },
    validationSchema: validacionProducto(productos),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Convertimos las fechas a formato YYYY-MM-DD si es necesario
        const producto = {
          ...values,
          fecha_produccion: values.fecha_produccion
            ? new Date(values.fecha_produccion).toISOString().split("T")[0]
            : null,
          fecha_vencimiento: values.fecha_vencimiento
            ? new Date(values.fecha_vencimiento).toISOString().split("T")[0]
            : null,
        };
        // Llamada al endpoint para registrar el producto
        await productoService.registrarProducto(producto);

        // Reseteamos el formulario solo si deseas limpiar los campos después del envío
        resetForm();
        onClose();
        // Actualizamos el estado del formulario como "enviado"
        markFormAsSubmitted('producto');

        // Redirigimos a la ruta de confirmación del producto
        navigate("/admin/producto/confirmacion", {
          state: {
            mensaje: `Producto ${values.nombre} Registrado con Exito`,
          },
        });

      } catch (error) {
        console.error("Error al registrar el producto:", error);
      } finally {
        setSubmitting(false); // Esto indicará que el formulario terminó de enviarse
      }
    }
    ,
  });

  const fetchProductos = async () => {
    try {
      const data = await productoService.listarProducto();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };


  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.listarCategoria();
      setCategorias(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      alert("No se pudo cargar la lista de proveedores");
    }
  };

  const fetchProveedores = async () => {
    try {
      const data = await proveedorService.listarProveedor();
      setProveedores(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      alert("No se pudo cargar la lista de proveedores");
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchProveedores();
    fetchProductos();
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Nombre"
          placeholder="Introduce el Nombre del Producto"
          id="nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() => formik.touched.nombre && Boolean(formik.errors.nombre)}
          isInvalid={formik.touched.nombre && Boolean(formik.errors.nombre)}
          errorMessage={formik.touched.nombre && formik.errors.nombre}
        />
        <div className="flex gap-5">
          <Select
            id="id_categoria"
            name="id_categoria"
            label="Categoria"
            onChange={formik.handleChange}
            onBlur={() => formik.handleBlur("id_categoria")}
            onError={() =>
              !formik.values.id_categoria.length &&
              formik.touched.id_categoria &&
              Boolean(formik.errors.id_categoria)
            }
            isInvalid={
              !formik.values.id_categoria.length &&
              formik.touched.id_categoria &&
              Boolean(formik.errors.id_categoria)
            }
            errorMessage={
              !formik.values.id_categoria.length &&
              formik.touched.id_categoria &&
              formik.errors.id_categoria
            }
            placeholder="Selecciona una Categoria"
            className="max-w-ws"
            onClose={() => {
              formik.setFieldTouched("id_categoria", true);
            }}
          >
            {categorias.map((categoria) => {
              return (
                <SelectItem
                  value={categoria.id_categoria}
                  key={categoria.id_categoria}
                >
                  {categoria.nombre_categoria}
                </SelectItem>
              );
            })}
          </Select>
          <Select
            label="Proveedor"
            placeholder="Selecciona un Proveedor"
            id="id_proveedor"
            name="id_proveedor"
            onChange={formik.handleChange}
            onBlur={() => formik.handleBlur("id_proveedor")}
            onError={() =>
              !formik.values.id_proveedor.length &&
              formik.touched.id_proveedor &&
              Boolean(formik.errors.id_proveedor)
            }
            isInvalid={
              !formik.values.id_proveedor.length &&
              formik.touched.id_proveedor &&
              Boolean(formik.errors.id_proveedor)
            }
            errorMessage={
              !formik.values.id_proveedor.length &&
              formik.touched.id_proveedor &&
              formik.errors.id_proveedor
            }
            className="max-w-ws"
            onClose={() => {
              formik.setFieldTouched("id_proveedor", true);
            }}
          >
            {proveedores.map((proveedores) => {
              return (
                <SelectItem
                  key={proveedores.id_proveedor}
                  value={proveedores.id_proveedor}
                >
                  {proveedores.empresa}
                </SelectItem>
              );
            })}

          </Select>
        </div>

        <div className="flex gap-5">
          <Input
            type="number"
            label="Cantidad"
            placeholder="Introduce la Cantidad"
            id="cantidad"
            name="cantidad"
            value={formik.values.cantidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onError={() =>
              formik.touched.cantidad && Boolean(formik.errors.cantidad)
            }
            isInvalid={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
            errorMessage={formik.touched.cantidad && formik.errors.cantidad}
          />
          <Input
            type="number"
            label="Precio"
            placeholder="0.00"
            id="precio"
            name="precio"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">S/</span>
              </div>
            }
            value={formik.values.precio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onError={() => formik.touched.precio && Boolean(formik.errors.precio)}
            isInvalid={formik.touched.precio && Boolean(formik.errors.precio)}
            errorMessage={formik.touched.precio && formik.errors.precio}
          />
        </div>
        <div className="flex gap-5">
          <DatePicker
            id="fecha_produccion"
            label="Fecha Producción"
            name="fecha_produccion"
            value={formik.values.fecha_produccion}
            onChange={(date) => {
              formik.setFieldValue("fecha_produccion", date);
              formik.validateField("fecha_produccion");
            }}
            onBlur={() => formik.setFieldTouched("fecha_produccion", true)}
            isInvalid={
              formik.touched.fecha_produccion && formik.errors.fecha_produccion
            }
            errorMessage={
              formik.touched.fecha_produccion && formik.errors.fecha_produccion
            }
          />
          <DatePicker
            id="fecha_vencimiento"
            label="Fecha Vencimiento"
            name="fecha_vencimiento"
            value={formik.values.fecha_vencimiento}
            onChange={(date) => {
              formik.setFieldValue("fecha_vencimiento", date);
              formik.validateField("fecha_vencimiento");
            }}
            onBlur={() => formik.setFieldTouched("fecha_vencimiento", true)}
            isInvalid={
              formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento
            }
            errorMessage={
              formik.touched.fecha_vencimiento && formik.errors.fecha_vencimiento
            }
          />
        </div>
        <Textarea
          label="Descripcion"
          placeholder="Ingresa una Descripcion"
          name="descripcion"
          id="descripcion"
          value={formik.values.descripcion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onError={() =>
            formik.touched.descripcion && Boolean(formik.errors.descripcion)
          }
          isInvalid={
            formik.touched.descripcion && Boolean(formik.errors.descripcion)
          }
          errorMessage={formik.touched.descripcion && formik.errors.descripcion}
        />
        <div className="pb-5">
          <Button
            type="submit" // Aquí el tipo "submit" funcionará porque está dentro del form
            color="primary"
            disabled={formik.isSubmitting}
          >
            Registrar
          </Button>
        </div>

      </form>

    </>
  );
}
