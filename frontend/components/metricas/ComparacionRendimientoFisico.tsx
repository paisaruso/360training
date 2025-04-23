"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface Resultado {
  fecha: string;
  tiempo: number | null;
  repeticiones: number | null;
  series: number | null;
  peso: number | null;
}

interface TipoEjercicio {
  id_tipo_ejercicio: number;
  nombre: string;
}

export default function ComparacionRendimientoFisico({ nombre, fechaInicio, fechaFin }: Props) {
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState<TipoEjercicio[]>([]);
  const [nombreEjercicio, setNombreEjercicio] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [metrica, setMetrica] = useState<"tiempo" | "repeticiones" | "series" | "peso">("repeticiones");

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const res = await fetch("/api/tipo_ejercicio");
        const data = await res.json();
        setEjerciciosDisponibles(data);
      } catch (error) {
        console.error("Error al cargar ejercicios:", error);
      }
    };

    fetchEjercicios();
  }, []);

  const cargarDatos = async () => {
    if (!nombre || !nombreEjercicio) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        nombre,
        nombreEjercicio,
      });
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const res = await fetch(`/api/analytics/rendimiento-fisico?${params.toString()}`);
      const data = await res.json();
      setResultados(data.datos || []);
    } catch (error) {
      console.error("Error al cargar rendimiento físico:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const fechas = resultados.map((r) => r.fecha);
  const valores = resultados.map((r) =>
    r[metrica] !== null ? Number(r[metrica]) : null
  );

  const data = {
    labels: fechas,
    datasets: [
      {
        label: `Evolución de ${metrica}`,
        data: valores,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={nombreEjercicio}
          onChange={(e) => setNombreEjercicio(e.target.value)}
          className="border px-2 py-1 rounded w-64"
        >
          <option value="">Selecciona un ejercicio</option>
          {ejerciciosDisponibles.map((ej) => (
            <option key={ej.id_tipo_ejercicio} value={ej.nombre}>
              {ej.nombre}
            </option>
          ))}
        </select>

        <select
          value={metrica}
          onChange={(e) =>
            setMetrica(e.target.value as "tiempo" | "repeticiones" | "series" | "peso")
          }
          className="border px-2 py-1 rounded"
        >
          <option value="tiempo">Tiempo (min)</option>
          <option value="repeticiones">Repeticiones</option>
          <option value="series">Series</option>
          <option value="peso">Peso (kg)</option>
        </select>

        <button
          onClick={cargarDatos}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {resultados.length > 0 && (
        <div className="mb-6">
          <Line data={data} options={options} />
        </div>
      )}

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Tiempo (min)</th>
            <th className="border px-2 py-1">Repeticiones</th>
            <th className="border px-2 py-1">Series</th>
            <th className="border px-2 py-1">Peso (kg)</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">Cargando datos...</td>
            </tr>
          ) : resultados.length > 0 ? (
            resultados.map((r, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{r.fecha}</td>
                <td className="border px-2 py-1">{r.tiempo ?? "–"}</td>
                <td className="border px-2 py-1">{r.repeticiones ?? "–"}</td>
                <td className="border px-2 py-1">{r.series ?? "–"}</td>
                <td className="border px-2 py-1">{r.peso ?? "–"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">No hay datos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
