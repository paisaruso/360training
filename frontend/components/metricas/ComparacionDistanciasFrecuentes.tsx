// components/metricas/ComparacionDistanciasFrecuentes.tsx
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

export default function ComparacionDistanciasFrecuentes() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [frecuencia, setFrecuencia] = useState<number[]>([]);
  const [promedios, setPromedios] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerDatos = async () => {
    if (!fechaInicio || !fechaFin) return;
    setLoading(true);

    try {
      const url = new URL(
        "https://three60training-jp4i.onrender.com/api/analytics/comparacion-distancias-frecuentes"
      );
      url.searchParams.append("fechaInicio", fechaInicio);
      url.searchParams.append("fechaFin", fechaFin);

      const response = await fetch(url.toString());
      const data = await response.json();
      console.log("📊 Datos recibidos:", data);

      const nuevasLabels = data.distancias.map(
        (item: any) => `${item.distancia}m`
      );
      const nuevasFrecuencias = data.distancias.map(
        (item: any) => item.frecuencia
      );
      const nuevosPromedios = data.distancias.map(
        (item: any) => item.puntaje_promedio
      );

      setLabels(nuevasLabels);
      setFrecuencia(nuevasFrecuencias);
      setPromedios(nuevosPromedios);
    } catch (error) {
      console.error("❌ Error al obtener datos:", error);
      setLabels([]);
      setFrecuencia([]);
      setPromedios([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Comparación de Distancias Frecuentes y Promedios
      </h2>

      <div className="flex gap-4 mb-4 justify-center flex-wrap">
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={obtenerDatos}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cargar Gráfico
        </button>
      </div>

      <div className="h-96 w-full">
        {loading ? (
          <p className="text-center">Cargando datos...</p>
        ) : labels.length > 0 ? (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label: "Frecuencia",
                  data: frecuencia,
                  backgroundColor: "rgba(59, 130, 246, 0.6)",
                },
                {
                  label: "Puntaje Promedio",
                  data: promedios,
                  backgroundColor: "rgba(34, 197, 94, 0.6)",
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
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 border rounded">
            No hay datos para mostrar.
          </div>
        )}
      </div>
    </div>
  );
}
