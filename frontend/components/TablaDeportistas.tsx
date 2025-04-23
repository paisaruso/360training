// components/TablaDeportistas.tsx
import { useEffect, useState } from "react";

interface Deportista {
  id_deportista: number;
  nombre_usuario: string;
  nivel_experiencia: string;
  id_entrenador: number | null;
}

interface TablaDeportistasProps {
  onSelect: (nombre: string) => void;
  modoFiltro?: "Todos" | "PorEntrenador";
}

export default function TablaDeportistas({
  onSelect,
  modoFiltro = "Todos",
}: TablaDeportistasProps) {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDeportistas = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://three60training-jp4i.onrender.com/api/deportistas/info/detalles");
        if (!response.ok) throw new Error("Error al obtener deportistas");
        const data = await response.json();
        setDeportistas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudieron cargar los deportistas.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDeportistas();
  }, []);

  const deportistasFiltrados = deportistas
    .filter((d) => d.nombre_usuario?.toLowerCase().includes(filtro.toLowerCase()))
    .filter((d) => {
      if (modoFiltro === "Todos") return true;
      const idLocal = parseInt(localStorage.getItem("id_entrenador") || "0");
      return d.id_entrenador === idLocal;
    });

  return (
    <div className="text-black text-sm w-full">
      <input
        type="text"
        placeholder="Buscar nombre"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-2 p-1 border rounded w-full"
      />

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="h-60 overflow-y-auto border rounded">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Nombre</th>
              </tr>
            </thead>
            <tbody>
              {deportistasFiltrados.length === 0 ? (
                <tr>
                  <td className="p-2 text-gray-500">No se encontraron coincidencias</td>
                </tr>
              ) : (
                deportistasFiltrados.map((d) => (
                  <tr
                    key={d.id_deportista}
                    onClick={() => onSelect(d.nombre_usuario)}
                    className="hover:bg-blue-100 cursor-pointer"
                  >
                    <td className="p-2">{d.nombre_usuario}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
