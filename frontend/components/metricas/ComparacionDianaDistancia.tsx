"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface ComparacionDianaDistanciaProps {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
}

export default function ComparacionDianaDistancia({
  nombre,
  fechaInicio,
  fechaFin,
}: ComparacionDianaDistanciaProps) {
  const [groupBy, setGroupBy] = useState<"distancia" | "tamano_diana">("distancia");
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarDatos = async () => {
    if (!nombre) return;
    setLoading(true);

    try {
      const url = new URL(
        "https://three60training-jp4i.onrender.com/api/analytics/comparacion-puntaje-disparo"
      );
      url.searchParams.append("nombre", nombre);
      url.searchParams.append("groupBy", groupBy);
      if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
      if (fechaFin) url.searchParams.append("fechaFin", fechaFin);

      const response = await fetch(url.toString());
      const resultado = await response.json();

      if (
        resultado &&
        Array.isArray(resultado.labels) &&
        Array.isArray(resultado.data)
      ) {
        setLabels(resultado.labels.map(String));
        setData(resultado.data.map(Number));
      } else {
        setLabels([]);
        setData([]);
      }
    } catch (error) {
      console.error("❌ Error cargando gráfico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex gap-4 justify-center items-center mb-4">
        <select
          className="border rounded px-3 py-1"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as "distancia" | "tamano_diana")}
        >
          <option value="distancia">Por Distancia</option>
          <option value="tamano_diana">Por Tamaño de Diana</option>
        </select>
        <button
          onClick={buscarDatos}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando gráfico...</p>
      ) : labels.length > 0 ? (
        <div className="h-96 w-full">
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: `Promedio por ${groupBy === "distancia" ? "Distancia" : "Tamaño de Diana"}`,
                  data,
                  backgroundColor: "#22c55e88",
                  borderColor: "#22c55e",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
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
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-6">No hay datos para mostrar.</div>
      )}
    </div>
  );
}
