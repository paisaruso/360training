import { useEffect, useState } from "react";

interface SelectEntrenadorProps {
  idEntrenador: number | ""; // Permite un número o vacío
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectEntrenador({ idEntrenador, onChange }: SelectEntrenadorProps) {
  const [entrenadores, setEntrenadores] = useState<{ id_entrenador: number; nombre_usuario: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://three60training-jp4i.onrender.com/api/entrenadores");
        if (!response.ok) throw new Error("Error al obtener entrenadores");

        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Los datos recibidos no son válidos");

        // Validamos que los objetos contengan las propiedades correctas
        const entrenadoresValidos = data.filter(
          (entrenador) => typeof entrenador.id_entrenador === "number" && typeof entrenador.nombre_usuario === "string"
        );        

        setEntrenadores(entrenadoresValidos);
      } catch (error) {
        console.error("❌ Error al obtener entrenadores:", error);
        setError("No se pudieron cargar los entrenadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntrenadores();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Entrenador</label>
      {loading ? (
        <p className="text-gray-500">Cargando entrenadores...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <select
          name="id_entrenador"
          value={idEntrenador}
          onChange={onChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-black appearance-none"
        >
          <option value="">Seleccione un entrenador</option>
          {entrenadores.length > 0 ? (
            entrenadores.map((entrenador) => (
              <option key={entrenador.id_entrenador} value={entrenador.id_entrenador}>
                {entrenador.nombre_usuario}
              </option>
            ))
          ) : (
            <option value="" disabled>No hay entrenadores disponibles</option>
          )}
        </select>
      )}
    </div>
  );
}
