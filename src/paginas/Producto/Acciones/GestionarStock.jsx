import React, { useEffect, useReducer } from "react";
import {
  Button,
  Input,
  ModalBody,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useFormulario } from "../../../context/FormularioContext";
import Progress from "../../../componentes/Progress";
import { productoService } from "../../../services/ProductoService";
import { validacionGestionStock } from "../../../validaciones/validacionGestionStock";

// Función para calcular nueva cantidad
const calcularNuevaCantidad = (actual, ingresada, modificador) =>
  actual + ingresada * modificador;

// Reducer para manejar estado del producto
const initialState = { producto: null };

function reducer(state, action) {
  switch (action.type) {
    case "SET_PRODUCTO":
      return { ...state, producto: action.payload };
    default:
      return state;
  }
}

// Componente reutilizable para formularios
function StockForm({ formik, label }) {
  return (
    <form onSubmit={formik.handleSubmit} className="flex gap-4 flex-col">
      <Input
        type="number"
        label={label}
        placeholder="Introduce la Cantidad"
        id="cantidad"
        name="cantidad"
        value={formik.values.cantidad}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isInvalid={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
        errorMessage={formik.touched.cantidad && formik.errors.cantidad}
      />
      <Button type="submit" color="primary">
        Actualizar
      </Button>
    </form>
  );
}

// Componente principal
export default function GestionarStock({ onClose, productId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { markFormAsSubmitted } = useFormulario();
  const navigate = useNavigate();

  const fetchProducto = async (productId) => {
    try {
      const producto = await productoService.obtenerproductoId(productId);
      dispatch({ type: "SET_PRODUCTO", payload: producto });
      formikAumentarStock.setValues({
        ...producto,
        cantidad: "",
        estado_cantidad: producto.estado_cantidad,
      });
      formikReducirStock.setValues({
        ...producto,
        cantidad: "",
        estado_cantidad: producto.estado_cantidad,
      });
    } catch (error) {
      console.error("Error al obtener datos del producto:", error);
    }
  };

  const createFormikConfig = (initialQuantityModifier, isReducing) => ({
    initialValues: {
      id_producto: productId,
      nombre: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      estado_cantidad: 1,
      fecha_produccion: "",
      fecha_vencimiento: "",
      id_categoria: "",
      id_proveedor: "",
    },
    validationSchema: validacionGestionStock(
      state.producto?.cantidad,
      isReducing
    ),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const cantidadActual = state.producto.cantidad; // Cantidad actual desde el estado
        const cantidadIngresada = Number(values.cantidad); // Cantidad ingresada por el usuario
        const nuevaCantidad = calcularNuevaCantidad(
          cantidadActual,
          cantidadIngresada,
          initialQuantityModifier
        );

        const nuevoEstadoCantidad = nuevaCantidad === 0 ? 0 : 1;

        const productoActualizado = {
          ...values,
          cantidad: nuevaCantidad,
          estado_cantidad: nuevoEstadoCantidad,
        };

        await productoService.editarProducto(productoActualizado);

        resetForm();
        onClose();
        markFormAsSubmitted("producto");
        navigate("/admin/producto/confirmacion", {
          state: {
            mensaje: `Stock del Producto ${values.nombre} ${initialQuantityModifier > 0 ? "aumentado" : "reducido"
              } con éxito a ${nuevaCantidad}`,
          },
        });
      } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const formikAumentarStock = useFormik(createFormikConfig(1, false));
  const formikReducirStock = useFormik(createFormikConfig(-1, true));

  useEffect(() => {
    if (productId) fetchProducto(productId);
  }, [productId]);

  if (!state.producto) return <Progress />;

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Gestión de Stock
      </ModalHeader>
      <ModalBody>
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" placement="top">
            <Tab key="aumentar_stock" title="Aumentar Stock">
              <StockForm formik={formikAumentarStock} label="Aumentar Stock" />
            </Tab>
            <Tab
              key="reducir_stock"
              title="Reducir Stock"
              isDisabled={state.producto.cantidad === 0} // Bloquea si cantidad es 0
            >
              <StockForm formik={formikReducirStock} label="Reducir Stock" />
            </Tab>
          </Tabs>
        </div>
      </ModalBody>
    </>
  );
}
