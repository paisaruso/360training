"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import DeportistaSelector from "../../components/metricas/DeportistaSelector";

interface MetricaProps {
  nombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

const METRICAS = {
  evolucion: dynamic(() => import("../../components/metricas/GraficoEvolucion"), { ssr: false }),
  comparacionDeportistas: dynamic(() => import("../../components/metricas/ComparacionDeportistas"), { ssr: false }),
  comparacionDiana: dynamic(() => import("../../components/metricas/ComparacionDianaDistancia"), { ssr: false }),
  comparacionDistancias: dynamic(() => import("../../components/metricas/ComparacionDistanciasFrecuentes"), { ssr: false }),
  rendimientoFisico: dynamic(() => import("../../components/metricas/ComparacionRendimientoFisico"), { ssr: false }),
  promedioPorCategoria: dynamic(() => import("../../components/metricas/PromedioPorCategoria"), { ssr: false }),
  rutinasPorPeriodo: dynamic(() => import("../../components/metricas/CantidadRutinasPorPeriodo"), { ssr: false }),
  historialAsistencia: dynamic(() => import("../../components/metricas/HistorialAsistencia"), { ssr: false }),
  totalFlechas: dynamic(() => import("../../components/metricas/TotalFlechasLanzadas"), { ssr: false }),
};

type MetricaKey = keyof typeof METRICAS;

const TITULOS: Record<MetricaKey, string> = {
  evolucion: "Evolución del Puntaje por Flecha",
  comparacionDiana: "Comparación por Diana o Distancia",
  totalFlechas: "Total de Flechas Lanzadas",
  comparacionDeportistas: "Comparación entre Deportistas",
  historialAsistencia: "Historial de Asistencia por Entrenador",
  rendimientoFisico: "Rendimiento en Ejercicios Físicos",
  promedioPorCategoria: "Promedio por Categoría",
  rutinasPorPeriodo: "Rutinas por Periodo",
  comparacionDistancias: "Comparación de Distancias y Puntajes",
};

export default function MetricasDashboard() {
  const [metricaSeleccionada, setMetricaSeleccionada] = useState<MetricaKey>("evolucion");
  const [nombre, setNombre] = useState<string>("");
  const [nombre2, setNombre2] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  const esComparacion = metricaSeleccionada === "comparacionDeportistas";
  const MetricaActual = METRICAS[metricaSeleccionada] as React.ComponentType<MetricaProps>;
  const titulo = TITULOS[metricaSeleccionada];

  const manejarSeleccion = (nuevoNombre: string) => {
    if (!nombre) {
      setNombre(nuevoNombre);
    } else if (!nombre2 && nuevoNombre !== nombre) {
      setNombre2(nuevoNombre);
      setMostrarGrafico(true);
    }
  };

  const cancelarSeleccion = () => {
    setNombre("");
    setNombre2("");
    setMostrarGrafico(false);
  };

  const cargarGrafico = () => {
    if (!esComparacion) {
      setMostrarGrafico(true);
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold text-center mb-6">Métricas de Desempeño Deportivo</h1>

      <div className="flex flex-wrap gap-4 justify-center text-sm mb-6">
        {Object.keys(METRICAS).map((key) => (
          <label key={key} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 cursor-pointer">
            <input
              type="radio"
              name="metrica"
              value={key}
              checked={metricaSeleccionada === key}
              onChange={() => {
                setMetricaSeleccionada(key as MetricaKey);
                setMostrarGrafico(false);
                setNombre("");
                setNombre2("");
              }}
            />
            {TITULOS[key as MetricaKey]}
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <DeportistaSelector
          onSeleccion={(nuevoNombre) =>
            esComparacion ? manejarSeleccion(nuevoNombre) : setNombre(nuevoNombre)
          }
          onFechas={(inicio, fin) => {
            setFechaInicio(inicio);
            setFechaFin(fin);
          }}
        />

        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-center mb-4 text-green-700">{titulo}</h2>

          {esComparacion ? (
            <div className="text-center mb-4">
              {!nombre ? (
                <p className="text-sm mb-2">Seleccione el primer deportista</p>
              ) : !nombre2 ? (
                <p className="text-sm mb-2">Seleccione el segundo deportista</p>
              ) : (
                <p className="text-sm mb-2">Listo para comparar</p>
              )}
              {nombre && (
                <button
                  onClick={cancelarSeleccion}
                  className="text-sm text-red-600 underline mb-2 block mx-auto"
                >
                  Cancelar selección
                </button>
              )}
            </div>
          ) : null}

          <div className="flex justify-center mb-4">
            <button
              onClick={cargarGrafico}
              disabled={esComparacion ? !nombre || !nombre2 : !nombre}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {esComparacion ? "Comparar Deportistas" : "Cargar Gráfico"}
            </button>
          </div>

          {mostrarGrafico && (
            <MetricaActual
              nombre={esComparacion ? `${nombre},${nombre2}` : nombre}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
