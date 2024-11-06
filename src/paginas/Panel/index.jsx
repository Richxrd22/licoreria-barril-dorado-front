import React from "react";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as CharJS,
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
import Texto from "../../componentes/Texto";
CharJS.register(
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
var beneficios = [72, 56, 20, 36, 80, 40, 30, 20, 25, 30, 12, 60];
var meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

var misoptions = {
  responsive: true,
  animation: false,
  aspectRatio: 2,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Movimientos de Stock por Periodo", // El texto del título
      font: {
        size: 18, // Tamaño de la fuente
        weight: "bold", // Peso de la fuente
      },
      padding: {
        top: 10,
        bottom: 30,
      },
      align: "center", // Alineación del título
    },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
    },
    x: {
      ticks: { color: "rgba(0, 220, 195)" },
    },
  },
};

var midata = {
  labels: meses,
  datasets: [
    {
      label: "Beneficios",
      data: beneficios,
      backgroundColor: "rgba(0, 220, 195, 0.5)",
    },
  ],
};
var options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Distribución del Inventario por Categoría", // El texto del título
      font: {
        size: 18, // Tamaño de la fuente
        weight: "bold", // Peso de la fuente
      },
      padding: {
        top: 10,
        bottom: 30,
      },
      align: "center", // Alineación del título
    },
  },
};

var data = {
  labels: ["Vinos", "Destilados", "Cervezas", "Aperitivos", "Digestivos"],
  datasets: [
    {
      label: "Cantidad",
      data: [35, 20, 20, 15, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function Panel() {
  return (
    <div className="flex flex-col py-5 lg:py-10  w-11/12 m-auto">
      <Texto
        titulo
        texto={"Visión General del Inventario y Movimientos de Stock"}
      />
      <div className="flex justify-around py-5 gap-5  lg:gap-10  flex-wrap w-full">
        <Card
          isFooterBlurred
          radius="lg"
          className="border-none w-full lg:w-2/6 lg:flex-1"
        >
          <div className="relative w-full h-64 p-5">
            <Pie data={data} options={options} />
          </div>
        </Card>
        <Card
          isFooterBlurred
          radius="lg"
          className="border-none w-full lg:w-2/6 lg:flex-1"
        >
          <div className="relative w-full h-64 p-5">
            {/* Ajusta la altura según sea necesario */}
            <Bar data={midata} options={misoptions} />
          </div>
        </Card>
      </div>
      <Texto titulo texto={"Productos con Stock Crítico"} />
      <Table
        aria-label="Example static collection table"
        className=" pt-5"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Tony Reichert</TableCell>
            <TableCell>CEO</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Zoey Lang</TableCell>
            <TableCell>Technical Lead</TableCell>
            <TableCell>Paused</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Jane Fisher</TableCell>
            <TableCell>Senior Developer</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>William Howard</TableCell>
            <TableCell>Community Manager</TableCell>
            <TableCell>Vacation</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
