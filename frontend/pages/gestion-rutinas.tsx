import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface RutinaFisica {
  id_rutina: number;
  nombre: string;
  intensidad: string;
}

interface RutinaEspecifica {
  id_rutina: number;
  nombre: string;
  tipo_disparo: string;
  distancia: number;
}

export default function GestionRutinas() {
  const router = useRouter();
  const [rol, setRol] = useState<string | null>(null);
  const [rutinasFisicas, setRutinasFisicas] = useState<RutinaFisica[]>([]);
  const [rutinasEspecificas, setRutinasEspecificas] = useState<RutinaEspecifica[]>([]);

  useEffect(() => {
    // Obtener el rol del usuario desde el localStorage o API
    const userRole = localStorage.getItem("userRole");
    setRol(userRole);

    if (userRole !== "Entrenador") {
      router.push("/dashboard"); // Redirigir si no es entrenador
    } else {
      cargarRutinas();
    }
  }, []);

  const cargarRutinas = async () => {
    try {
      const responseFisicas = await fetch("/api/rutina_fisica");
      const fisicas = await responseFisicas.json();

      const responseEspecificas = await fetch("/api/rutina_especifica");
      const especificas = await responseEspecificas.json();

      // Verificar si la respuesta es un array, si no, convertirla en uno
      setRutinasFisicas(Array.isArray(fisicas) ? fisicas : [fisicas]);
      setRutinasEspecificas(Array.isArray(especificas) ? especificas : [especificas]);
    } catch (error) {
      console.error("Error cargando rutinas:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Gestión de Rutinas</h1>

      {/* Botones para registrar nuevas rutinas */}
      <div className="flex space-x-4 mb-6">
        <button
          className="p-4 bg-blue-600 text-white rounded-lg"
          onClick={() => router.push("/entrenador/crear-rutina-fisica")}
        >
          Crear Rutina Física
        </button>
        <button
          className="p-4 bg-green-600 text-white rounded-lg"
          onClick={() => router.push("/entrenador/crear-rutina-especifica")}
        >
          Crear Rutina Específica
        </button>
      </div>

      {/* Mostrar Rutinas Existentes */}
      <h2 className="text-2xl font-semibold mt-4">Rutinas Físicas</h2>
      {rutinasFisicas.length === 0 ? (
        <p className="text-gray-500">No hay rutinas físicas registradas.</p>
      ) : (
        <ul className="list-disc ml-6">
          {rutinasFisicas.map((rutina) => (
            <li key={rutina.id_rutina} className="mb-2">
              {rutina.nombre} - {rutina.intensidad}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mt-4">Rutinas Específicas</h2>
      {rutinasEspecificas.length === 0 ? (
        <p className="text-gray-500">No hay rutinas específicas registradas.</p>
      ) : (
        <ul className="list-disc ml-6">
          {rutinasEspecificas.map((rutina) => (
            <li key={rutina.id_rutina} className="mb-2">
              {rutina.nombre} - {rutina.tipo_disparo} - {rutina.distancia}m
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
