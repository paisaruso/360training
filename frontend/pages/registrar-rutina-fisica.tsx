import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RegistrarRutinaFisica() {
  const router = useRouter();
  const [rutinas, setRutinas] = useState([]); // Lista de rutinas disponibles
  const [idRutina, setIdRutina] = useState(""); // Rutina seleccionada

  useEffect(() => {
    const fetchRutinas = async () => {
      const response = await fetch(`/api/rutina_fisica?id_deportista=${localStorage.getItem("id_deportista")}`);
      if (response.ok) {
        const data = await response.json();
        setRutinas(data);
      } else {
        console.error("Error al obtener rutinas");
      }
    };

    fetchRutinas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idRutina) {
      alert("Debe seleccionar una rutina");
      return;
    }
    router.push(`/agregar-ejercicios-fisicos?id_rutina=${idRutina}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Seleccionar Rutina Física</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={idRutina}
            onChange={(e) => setIdRutina(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full text-black"
            required
          >
            <option value="">Seleccione una rutina</option>
            {rutinas.map((rutina) => (
              <option key={rutina.id_rutina} value={rutina.id_rutina}>
                {`Rutina #${rutina.id_rutina} - ${rutina.fecha}`}
              </option>
            ))}
          </select>
          <button type="submit" className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Agregar Ejercicios
          </button>
        </form>
      </div>
    </div>
  );
}
