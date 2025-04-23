"use client";
import React, { useEffect, useState } from "react";

interface CategoriaData {
  categoria: string;
  promedio_puntaje: number;
}

export default function PromedioPorCategoria() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Principiante");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultado, setResultado] = useState<CategoriaData | null>(null);
  const [loading, setLoading] = useState(false);

  const categorias = ["Principiante", "Intermedio", "Avanzado"];

  const buscarPromedio = async () => {
    setLoading(true);
    try {
      const url = new URL("https://three60training-jp4i.onrender.com/api/analytics/promedio-puntajes-categoria");
      url.searchParams.append("nombreCategoria", categoriaSeleccionada);
      if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
      if (fechaFin) url.searchParams.append("fechaFin", fechaFin);

      console.log("📤 URL construida:", url.toString());

      const res = await fetch(url.toString());
      const data = await res.json();

      console.log("📥 Resultado:", data);
      setResultado(data);
    } catch (error) {
      console.error("❌ Error al obtener promedio por categoría:", error);
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-black">
      <h2 className="text-center font-bold text-lg mb-4 text-green-700">Promedio de Puntajes por Categoría</h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

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
          onClick={buscarPromedio}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando promedio...</p>
      ) : resultado ? (
        <div className="text-center text-lg mt-4">
          <p>
            📊 En la categoría <strong>{resultado.categoria}</strong>, el puntaje promedio es:
          </p>
          <p className="text-3xl font-bold text-green-600 mt-2">{resultado.promedio_puntaje.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay datos para mostrar.</p>
      )}
    </div>
  );
}
