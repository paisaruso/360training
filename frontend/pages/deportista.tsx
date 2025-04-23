import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ListaDeportistas from "../components/ListaDeportistas"; // 🔹 Importamos el componente

export default function Deportista() {
  const router = useRouter();
  const [idEntrenador, setIdEntrenador] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // 🔹 Obtener el ID del entrenador desde localStorage
    const storedId = localStorage.getItem("id_usuario");
    if (storedId) {
      setIdEntrenador(parseInt(storedId, 10));
    }
  }, []);

  // ✅ Manejo de búsqueda sin recargar la página
  const handleBusqueda = () => {
    router.push({
      pathname: "/deportista",
      query: { search: busqueda },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Buscar Deportista</h1>

      {/* 🔹 Campo de búsqueda manual */}
      <div className="flex gap-2">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Ingrese el nombre del deportista..."
          className="p-2 border rounded w-full text-black"
        />
        <button
          onClick={handleBusqueda}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* 🔹 Mostrar listado de deportistas (asignados y filtrados manualmente) */}
      {idEntrenador !== null ? (
        <ListaDeportistas idEntrenador={idEntrenador} filtro={busqueda} />
      ) : (
        <p className="text-red-600">⚠️ No se pudo obtener la información del entrenador.</p>
      )}
    </div>
  );
}
