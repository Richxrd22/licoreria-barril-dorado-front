import { Button, DateInput, DatePicker, Input, ModalBody, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormulario } from "../../../context/FormularioContext";
import { proveedorService } from "../../../services/ProveedorService";
import { categoriaService } from "../../../services/CategoriaService";
import { productoService } from "../../../services/ProductoService";
import Progress from "../../../componentes/Progress";
import { validacionProducto } from "../../../validaciones/validacionProducto";
import { validacionProductoActualizar } from "../../../validaciones/validacionProductoActualizar";
import { useDecodedToken } from "../../../hook/useDecodedToken";

export default function EditarProducto({ onClose, productId }) {
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null)
  const [productos,setProductos]=useState([])
  const { markFormAsSubmitted } = useFormulario();
  const navigate = useNavigate();
  const { baseRoute } = useDecodedToken();
  const fetchProducto = async (productId) => {
    try {
      const producto = await productoService.obtenerproductoId(productId);
      const productos = await productoService.listarProducto();
      setProductoSeleccionado(producto)
      setProductos(productos)
      formik.resetForm({
        values: {
          id_producto:productId,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          cantidad: producto.cantidad,
          precio: producto.precio,
          estado_cantidad: producto.estado_cantidad,
          fecha_produccion: producto.fecha_produccion,
          fecha_vencimiento: producto.fecha_vencimiento,
          id_categoria: producto.id_categoria,
          id_proveedor: producto.id_proveedor,
          activo: producto.activo ,
        }

      });
    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      id_producto: productId,
      nombre: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      estado_cantidad: "",
      fecha_produccion: "",
      fecha_vencimiento: "",
      id_categoria: "",
      id_proveedor: "",
      activo:""
    },
    validationSchema: validacionProductoActualizar(productos,productoSeleccionado),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {

        await productoService.editarProducto(values);

        resetForm();
        onClose();
        markFormAsSubmitted("producto");
        navigate(`${baseRoute}/producto/confirmacion`, {
          state: {
            mensaje: `Producto ${values.nombre} actualizado con éxito`,
          },
        });
      } catch (error) {
        console.error("Error al Actualizar el producto:", error);
      } finally {
        setSubmitting(false); 
      }
    },
  });

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.listarCategoria();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const fetchProveedores = async () => {
    try {
      const data = await proveedorService.listarProveedor();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };



  useEffect(() => {
    fetchCategorias();
    fetchProveedores();
    if (productId) {
      fetchProducto(productId);
    }
  }, [productId]);
  if (!productoSeleccionado) return <Progress />;
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Editar Producto</ModalHeader>
      <ModalBody >
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
              selectedKeys={new Set([formik.values.id_categoria.toString()])}
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
              selectedKeys={new Set([formik.values.id_proveedor.toString()])}
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
          <div className="flex gap-5">
            <Input
              id="fecha_produccion"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fecha_produccion}
              onError={() =>
                formik.touched.fecha_produccion && Boolean(formik.errors.fecha_produccion)
              }
              isInvalid={
                formik.touched.fecha_produccion && Boolean(formik.errors.fecha_produccion)
              }
              errorMessage={formik.touched.fecha_produccion
                && formik.errors.fecha_produccion}
              label="Fecha Producción"
              name="fecha_produccion"



            />
            <Input
              id="fecha_vencimiento"
              label="Fecha Vencimiento"
              type="date"
              name="fecha_vencimiento"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onError={() =>
                formik.touched.fecha_vencimiento && Boolean(formik.errors.fecha_vencimiento)
              }
              isInvalid={
                formik.touched.fecha_vencimiento && Boolean(formik.errors.fecha_vencimiento)
              }
              value={formik.values.fecha_vencimiento}


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
              type="submit" 
              color="primary"
              disabled={!formik.dirty || formik.isSubmitting}
            >
              Actualizar
            </Button>
          </div>

        </form>
      </ModalBody>

    </>
  );
}
