// components/metricas/TotalFlechasLanzadas.tsx
"use client";
import React, { useEffect, useState } from "react";

interface Deportista {
  id_deportista: number;
  nombre_usuario: string;
}

export default function TotalFlechasLanzadas() {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [nombreSeleccionado, setNombreSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [totalFlechas, setTotalFlechas] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");

  useEffect(() => {
    const fetchDeportistas = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/deportistas/info/detalles");
        const data = await response.json();
        setDeportistas(data);
      } catch (error) {
        console.error("Error al cargar deportistas:", error);
      }
    };

    fetchDeportistas();
  }, []);

  const deportistasFiltrados = deportistas.filter((d) =>
    d.nombre_usuario.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  const obtenerTotalFlechas = async () => {
    if (!nombreSeleccionado) return;
    setLoading(true);

    try {
      const url = new URL("https://three60training-jp4i.onrender.com/api/analytics/total-flechas");
      url.searchParams.append("nombre", nombreSeleccionado);
      if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
      if (fechaFin) url.searchParams.append("fechaFin", fechaFin);

      const response = await fetch(url.toString());
      const result = await response.json();
      setTotalFlechas(result.totalFlechas ?? 0);
    } catch (error) {
      console.error("Error al obtener total de flechas:", error);
      setTotalFlechas(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 text-black">
      <div className="w-1/3 max-h-screen overflow-y-auto border rounded-lg p-4 bg-white shadow-md">
        <h2 className="text-lg font-semibold mb-2">Deportistas</h2>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <ul className="divide-y text-sm">
          {deportistasFiltrados.map((d) => (
            <li
              key={d.id_deportista}
              className={`py-2 px-2 cursor-pointer hover:bg-gray-200 rounded ${
                d.nombre_usuario === nombreSeleccionado ? "bg-green-100 font-semibold" : ""
              }`}
              onClick={() => setNombreSeleccionado(d.nombre_usuario)}
            >
              {d.nombre_usuario}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 bg-white shadow rounded-lg">
        <h2 className="text-center text-green-700 font-semibold mb-4">
          Total de Flechas Lanzadas
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-center">
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
            onClick={obtenerTotalFlechas}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

        <div className="text-center text-lg font-bold mt-10">
          {loading ? "Cargando..." : totalFlechas !== null ? (
            <>
              <span className="text-green-600">Total:</span> {totalFlechas} flechas lanzadas
            </>
          ) : (
            <span className="text-gray-500">Seleccione un deportista y un rango de fechas</span>
          )}
        </div>
      </div>
    </div>
  );
}
