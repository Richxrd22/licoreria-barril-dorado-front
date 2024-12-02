import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ListadoProductos from "../Producto/Acciones/ListadoProductos";
import Texto from "../../componentes/Texto";
import { useProductos } from "../../hook/useProductos";
import Progress from "../../componentes/Progress";
import { useMovimientos } from "../../hook/useMovimientos";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Panel = () => {
  const { productos, productosFiltrados } = useProductos();
  const [productosNoVencidos, setProductosNoVencidos] = useState([]);
  const { movimientos,movimientoSumado, loading, error } = useMovimientos(null,2024);
  const [chartData, setChartData] = useState(null);
  const [chartDataMovimientos, setChartDataMovimientos] = useState(null);

  useEffect(() => {
    if (movimientoSumado?.length > 0) {
        // Construir el formato esperado para el gráfico
        const meses = Array.from({ length: 12 }, (_, index) => ({
            entrada: 0,
            salida: 0
        }));

        movimientoSumado.forEach(({ mes, entrada, salida }) => {
            // Ajustar índice de mes (0-based en meses)
            meses[mes - 1] = { entrada, salida };
        });

        // Actualizar los datos del gráfico
        setChartDataMovimientos({
            labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            datasets: [
                {
                    label: "Entradas de Stock",
                    data: meses.map(m => m.entrada),
                    backgroundColor: "rgba(0, 220, 195, 0.5)",
                    borderColor: "rgba(0, 220, 195, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Salidas de Stock",
                    data: meses.map(m => m.salida),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                }
            ]
        });
    }
}, [movimientoSumado]);
  

  // Procesar productos y generar gráfico de distribución
  useEffect(() => {
    if (productos?.length > 0) {
      const currentDate = new Date();

      // Filtrar productos no vencidos
      const noVencidos = productos.filter((producto) => {
        const fechaVencimiento = new Date(producto.fecha_vencimiento);
        return fechaVencimiento > currentDate; // Solo productos cuya fecha de vencimiento es futura
      });

      setProductosNoVencidos(noVencidos);

      // Agrupar productos no vencidos por categoría y sumar cantidades
      const categoriaTotales = noVencidos.reduce((acc, producto) => {
        const { categoria, cantidad } = producto;
        acc[categoria] = (acc[categoria] || 0) + cantidad;
        return acc;
      }, {});

      // Generar colores dinámicos para las categorías
      const dynamicColors = Object.keys(categoriaTotales).map(
        () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
      );

      // Preparar los datos para Chart.js
      const labels = Object.keys(categoriaTotales);
      const data = Object.values(categoriaTotales);

      setChartData({
        labels,
        datasets: [
          {
            label: "Cantidad de Productos",
            data,
            backgroundColor: dynamicColors,
            borderColor: dynamicColors.map(color => color.replace("0.5", "1")),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [productos]);

  // Opciones de gráficos
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Distribución de Productos por Categoría",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
        align: "center",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Entradas y Salidas de Stock por Mes",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
        align: "center",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,  // Activar el apilamiento
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        stacked: true,  // Activar el apilamiento
        ticks: { color: "rgba(0, 220, 195)" },
      },
    },
  };

  return (
    <div className="flex flex-col py-5 lg:py-10 w-11/12 m-auto gap-4">
      <Texto
        titulo
        texto={"Visión General del Inventario y Movimientos de Stock"}
      />
      <div className="flex justify-around py-5 gap-5 lg:gap-10 flex-wrap w-full">
        <Card
          isFooterBlurred
          radius="lg"
          className="border-none w-full lg:w-2/6 lg:flex-1"
        >
          <div className="relative w-full h-64 p-5">
            {chartData ? (
              <Pie data={chartData} options={pieChartOptions} />
            ) : (
              <Progress />
            )}
          </div>
        </Card>
        <Card
          isFooterBlurred
          radius="lg"
          className="border-none w-full lg:w-2/6 lg:flex-1"
        >
          <div className="relative w-full h-64 p-5">
            {chartDataMovimientos ? (
              <Bar data={chartDataMovimientos} options={barChartOptions} />
            ) : (
              <Progress />
            )}
          </div>
        </Card>
      </div>
      <Texto titulo texto={"Productos en Stock Crítico y Próximos a Vencer"} />
      <ListadoProductos productos={productosFiltrados} showFilters={false} />
    </div>
  );
};

export default Panel;
