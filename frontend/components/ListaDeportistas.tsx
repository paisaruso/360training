import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Deportista {
  id_deportista: number;
  nombre_usuario: string;
  nivel_experiencia: string;
  id_entrenador: number | null; // nuevo campo correcto
}

interface ListaDeportistasProps {
  idEntrenador: number;
  filtro?: string;
}

export default function ListaDeportistas({ idEntrenador, filtro = "" }: ListaDeportistasProps) {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modoFiltro, setModoFiltro] = useState<"Todos" | "PorEntrenador">("Todos");

  const router = useRouter();

  useEffect(() => {
    const obtenerDeportistas = async () => {
      try {
        setLoading(true);
        console.log("📡 Solicitando todos los deportistas desde API...");
        const response = await fetch("https://three60training-jp4i.onrender.com/api/deportistas/info/detalles");
        if (!response.ok) throw new Error("Error al obtener deportistas");
        const data = await response.json();
        console.log("✅ Deportistas recibidos desde API:", data);

        if (Array.isArray(data)) {
          data.forEach((d) => {
            console.log(`👤 ${d.nombre_usuario} → id_entrenador: ${d.id_entrenador}`);
          });
          setDeportistas(data);
        } else {
          setDeportistas([]);
        }
      } catch (error) {
        console.error("❌ Error al obtener deportistas:", error);
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
      const idEntrenadorLocal = parseInt(localStorage.getItem("id_entrenador") || "0");
      const coincide = modoFiltro === "Todos" ? true : d.id_entrenador === idEntrenadorLocal;
      console.log(
        `🔍 Verificando deportista "${d.nombre_usuario}" → id_entrenador: ${d.id_entrenador} vs ${idEntrenadorLocal} → coincide: ${coincide}`
      );
      return coincide;
    });

  return (
    <div className="mt-4 text-black">
      {/* 🔘 Filtro por tipo */}
      <div className="mb-2 flex gap-6 text-sm font-medium">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="Todos"
            checked={modoFiltro === "Todos"}
            onChange={() => setModoFiltro("Todos")}
          />
          Mostrar Todos
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="PorEntrenador"
            checked={modoFiltro === "PorEntrenador"}
            onChange={() => setModoFiltro("PorEntrenador")}
          />
          Solo mis Deportistas
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando deportistas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : deportistasFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay deportistas asignados o no hay coincidencias.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse border border-gray-300 text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Nivel</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {deportistasFiltrados.map((deportista) => (
                <tr key={deportista.id_deportista} className="hover:bg-gray-100">
                  <td className="p-2 border">{deportista.nombre_usuario}</td>
                  <td className="p-2 border">{deportista.nivel_experiencia}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() =>
                        router.push(`/rutinas_deportista?id=${deportista.id_deportista}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Ver Rutinas
                    </button>
                    <button
                      onClick={() => router.push(`/user_profile?id=${deportista.id_deportista}`)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Comentar
                    </button>
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
