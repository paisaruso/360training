// components/metricas/CantidadRutinasPorPeriodo.tsx
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

export default function CantidadRutinasPorPeriodo() {
  const [modo, setModo] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [fisicas, setFisicas] = useState<number[]>([]);
  const [especificas, setEspecificas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerDatos = async () => {
    if (!fechaInicio || !fechaFin) return;

    setLoading(true);

    try {
      const url = new URL(
        "https://three60training-jp4i.onrender.com/api/analytics/cantidad-rutinas-por-periodo"
      );
      url.searchParams.append("modo", modo);
      url.searchParams.append("fechaInicio", fechaInicio);
      url.searchParams.append("fechaFin", fechaFin);

      const res = await fetch(url.toString());
      const data = await res.json();
      console.log("📊 Datos de rutinas:", data);

      const nuevasLabels = Object.keys(data.resumen);
      const nuevasFisicas = nuevasLabels.map(
        (f) => data.resumen[f].fisica || 0
      );
      const nuevasEspecificas = nuevasLabels.map(
        (f) => data.resumen[f].especifica || 0
      );

      setLabels(nuevasLabels);
      setFisicas(nuevasFisicas);
      setEspecificas(nuevasEspecificas);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setLabels([]);
      setFisicas([]);
      setEspecificas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Cantidad de Rutinas por Periodo ({modo})
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <select
          value={modo}
          onChange={(e) => setModo(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
                  label: "Rutinas Físicas",
                  data: fisicas,
                  backgroundColor: "rgba(59, 130, 246, 0.7)",
                },
                {
                  label: "Rutinas Específicas",
                  data: especificas,
                  backgroundColor: "rgba(34, 197, 94, 0.7)",
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
