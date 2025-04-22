import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RegistrarRutinaEspecifica() {
  const router = useRouter();
  const [rutina, setRutina] = useState({
    comentario_deportista: "",
    id_deporte: "", // Puedes ajustar este valor con un select más adelante
  });
  const [idDeportista, setIdDeportista] = useState<number | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("id_deportista");
    if (storedId) {
      setIdDeportista(parseInt(storedId, 10));
    } else {
      fetch("/api/get-id-deportista")
        .then((res) => res.json())
        .then((data) => {
          if (data.id_deportista) {
            setIdDeportista(data.id_deportista);
            localStorage.setItem("id_deportista", data.id_deportista);
          }
        })
        .catch((error) => console.error("Error obteniendo el ID del deportista:", error));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setRutina({ ...rutina, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idDeportista) {
      alert("No se encontró el ID del deportista.");
      return;
    }

    const response = await fetch("/api/rutina_especifica", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_deportista: idDeportista,
        comentario_deportista: rutina.comentario_deportista || null,
        id_deporte: parseInt(rutina.id_deporte),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/agregar-ejercicios-especificos?id_rutina=${data.id_rutina}`);
    } else {
      alert("Error al registrar la rutina específica.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Registrar Rutina Específica</h1>

        {/* Mostrar el ID del deportista */}
        <input
          type="text"
          value={idDeportista ? idDeportista.toString() : "Cargando..."}
          readOnly
          className="p-3 border border-gray-300 rounded-lg w-full text-gray-500 bg-gray-200"
        />

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
          <textarea
            name="comentario_deportista"
            placeholder="Comentario del deportista (opcional)"
            value={rutina.comentario_deportista}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full text-black"
          />

          <select
            name="id_deporte"
            value={rutina.id_deporte}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full text-black"
            required
          >
            <option value="">Seleccionar Deporte</option>
            <option value="1">Tiro con Arco</option>
            <option value="2">Otro Deporte</option>
            {/* Puedes cargar dinámicamente los deportes si es necesario */}
          </select>

          <button
            type="submit"
            className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Guardar y Agregar Ejercicios de Disparo
          </button>
        </form>
      </div>
    </div>
  );
}
