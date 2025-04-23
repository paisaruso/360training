// components/metricas/HistorialAsistencia.tsx
"use client";
import React, { useEffect, useState } from "react";

interface DeportistaHistorial {
  id_deportista: number;
  nombre_deportista: string;
  totalRutinasEspecificas: number;
  totalRutinasFisicas: number;
  totalRutinas: number;
}

export default function HistorialAsistencia() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState<DeportistaHistorial[]>([]);
  const [loading, setLoading] = useState(false);

  const obtenerNombreEntrenador = () => {
    const nombre = localStorage.getItem("nombre_usuario");
    return nombre || "";
  };

  const buscarHistorial = async () => {
    const nombreEntrenador = obtenerNombreEntrenador();
    if (!nombreEntrenador) {
      alert("Nombre del entrenador no encontrado en localStorage");
      return;
    }

    setLoading(true);
    try {
      const url = new URL("https://three60training-jp4i.onrender.com/api/analytics/historial-asistencia");
      url.searchParams.append("nombreEntrenador", nombreEntrenador);
      if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
      if (fechaFin) url.searchParams.append("fechaFin", fechaFin);

      const res = await fetch(url.toString());
      const json = await res.json();

      if (json.deportistas) {
        setDatos(json.deportistas);
      } else {
        setDatos([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener historial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black">
      <h2 className="text-center font-bold text-lg mb-4">Historial de Asistencia</h2>

      <div className="flex gap-4 justify-center mb-4">
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={buscarHistorial}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Consultar
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando historial...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Rutinas Específicas</th>
                <th className="px-4 py-2 border">Rutinas Físicas</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d) => (
                <tr key={d.id_deportista}>
                  <td className="px-4 py-2 border">{d.nombre_deportista}</td>
                  <td className="px-4 py-2 border text-center">{d.totalRutinasEspecificas}</td>
                  <td className="px-4 py-2 border text-center">{d.totalRutinasFisicas}</td>
                  <td className="px-4 py-2 border text-center">{d.totalRutinas}</td>
                </tr>
              ))}
              {datos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No hay datos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
