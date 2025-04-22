"use client";
import React, { useEffect, useState } from "react";

interface ResultadoComparacion {
  distancia: number;
  tamano_diana: number;
  puntajes: Record<string, number>;
}

interface Props {
  nombre: string; // debe venir como "Juan,Ana"
  fechaInicio?: string;
  fechaFin?: string;
}

interface FilaTabla {
  distancia: number;
  tamano_diana: number;
  puntaje1: number | null;
  puntaje2: number | null;
}

// Lista fija de combinaciones válidas para la tabla
const combinacionesFijas: { distancia: number; tamano_diana: number }[] = [
  { distancia: 10, tamano_diana: 40 },
  { distancia: 10, tamano_diana: 60 },
  { distancia: 10, tamano_diana: 80 },
  { distancia: 18, tamano_diana: 60 },
  { distancia: 30, tamano_diana: 60 },
  { distancia: 50, tamano_diana: 80 },
  { distancia: 70, tamano_diana: 122 },
  // Agrega más combinaciones si las usas en tu sistema
];

export default function ComparacionDeportistas({ nombre, fechaInicio, fechaFin }: Props) {
  const [filasTabla, setFilasTabla] = useState<FilaTabla[]>([]);
  const [loading, setLoading] = useState(false);

  const [nombre1, nombre2] = nombre.split(",");

  useEffect(() => {
    if (!nombre1 || !nombre2) return;

    const comparar = async () => {
      setLoading(true);
      try {
        const url = new URL("https://three60training-jp4i.onrender.com/api/analytics/compare-puntaje-deportistas");
        url.searchParams.append("nombres", `${nombre1},${nombre2}`);
        if (fechaInicio) url.searchParams.append("fechaInicio", fechaInicio);
        if (fechaFin) url.searchParams.append("fechaFin", fechaFin);

        const res = await fetch(url.toString());
        const data = await res.json();
        const resultados: ResultadoComparacion[] = data.resultados || [];

        // Crear una tabla completa usando combinaciones fijas
        const filasCompletas: FilaTabla[] = combinacionesFijas.map(({ distancia, tamano_diana }) => {
          const fila = resultados.find(
            (f) => f.distancia === distancia && f.tamano_diana === tamano_diana
          );
          return {
            distancia,
            tamano_diana,
            puntaje1: fila?.puntajes[nombre1] ?? null,
            puntaje2: fila?.puntajes[nombre2] ?? null,
          };
        });

        // Ordenar por distancia y luego por tamaño de diana
        filasCompletas.sort((a, b) => {
          if (a.distancia !== b.distancia) return a.distancia - b.distancia;
          return a.tamano_diana - b.tamano_diana;
        });

        setFilasTabla(filasCompletas);
      } catch (error) {
        console.error("Error en comparación:", error);
        setFilasTabla([]);
      } finally {
        setLoading(false);
      }
    };

    comparar();
  }, [nombre1, nombre2, fechaInicio, fechaFin]);

  return (
    <div className="text-black">
      <h2 className="text-lg font-bold mb-4 text-center">Comparación de Puntaje entre Deportistas</h2>

      {loading ? (
        <p className="text-center">Cargando comparación...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full text-sm border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Distancia</th>
                <th className="border px-2 py-1">Tamaño Diana</th>
                <th className="border px-2 py-1">{nombre1}</th>
                <th className="border px-2 py-1">{nombre2}</th>
              </tr>
            </thead>
            <tbody>
              {filasTabla.map((fila, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{fila.distancia} m</td>
                  <td className="border px-2 py-1">{fila.tamano_diana} cm</td>
                  <td className="border px-2 py-1">
                    {fila.puntaje1 !== null ? fila.puntaje1.toFixed(2) : "Sin datos"}
                  </td>
                  <td className="border px-2 py-1">
                    {fila.puntaje2 !== null ? fila.puntaje2.toFixed(2) : "Sin datos"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
