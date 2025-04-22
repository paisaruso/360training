"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface Props {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export default function GraficoEvolucion({ nombre, fechaInicio, fechaFin }: Props) {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nombre || !fechaInicio || !fechaFin) {
      setLabels([]);
      setData([]);
      return;
    }

    const buscarDatos = async () => {
      setLoading(true);
      try {
        const url = new URL("https://three60training-jp4i.onrender.com/api/analytics/evolucion-puntaje");
        url.searchParams.append("nombre", nombre);
        url.searchParams.append("fechaInicio", fechaInicio);
        url.searchParams.append("fechaFin", fechaFin);

        const response = await fetch(url.toString());
        const resultado = await response.json();

        if (
          !resultado ||
          !Array.isArray(resultado.labels) ||
          !Array.isArray(resultado.data) ||
          resultado.labels.length === 0 ||
          resultado.data.length === 0
        ) {
          setLabels([]);
          setData([]);
        } else {
          setLabels(resultado.labels.map(String));
          setData(resultado.data.map(Number));
        }
      } catch (error) {
        console.error("❌ Error buscando datos:", error);
        setLabels([]);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    buscarDatos();
  }, [nombre, fechaInicio, fechaFin]);

  return (
    <div className="h-96 w-full">
      {loading ? (
        <p className="text-center">Cargando datos...</p>
      ) : labels.length > 0 && data.every((d) => typeof d === "number") ? (
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Promedio por Flecha",
                data,
                borderColor: "#22c55e",
                backgroundColor: "#22c55e88",
                fill: false,
                tension: 0.2,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
              },
            },
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-600 border rounded">
          No hay datos para mostrar.
        </div>
      )}
    </div>
  );
}
