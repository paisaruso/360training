import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface RutinaFisica {
  id_rutina: number;
  id_deportista: number;
  fecha: string;
  comentario_deportista: string | null;
  comentario_entrenador: string | null;
}

interface RutinaEspecifica {
  id_rutina: number;
  id_deportista: number;
  fecha: string;
  comentario_deportista: string | null;
  comentario_entrenador: string | null;
  id_deporte: number;
}

export default function RutinasDeportista() {
  const router = useRouter();
  const { id } = router.query;

  const [rutinasFisicas, setRutinasFisicas] = useState<RutinaFisica[]>([]);
  const [rutinasEspecificas, setRutinasEspecificas] = useState<RutinaEspecifica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRutinas = async () => {
      try {
        const resFisicas = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_fisica?id_deportista=${id}`);
        const resEspecificas = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica?id_deportista=${id}`);

        const dataFisicas = await resFisicas.json();
        const dataEspecificas = await resEspecificas.json();

        setRutinasFisicas(Array.isArray(dataFisicas) ? dataFisicas : []);
        setRutinasEspecificas(Array.isArray(dataEspecificas) ? dataEspecificas : []);
      } catch (error) {
        console.error("❌ Error al cargar rutinas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-700">Cargando rutinas...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-black">
        Rutinas del Deportista #{id}
      </h1>

      {/* Tabla de Rutinas Físicas */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-600 mb-3">Rutinas Físicas</h2>
        {rutinasFisicas.length === 0 ? (
          <p className="text-gray-600">No hay rutinas físicas registradas.</p>
        ) : (
          <table className="w-full border border-gray-300 text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Comentario Deportista</th>
                <th className="border p-2">Comentario Entrenador</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutinasFisicas.map((rutina) => (
                <tr key={rutina.id_rutina} className="hover:bg-gray-100">
                  <td className="border p-2">{new Date(rutina.fecha).toLocaleDateString()}</td>
                  <td className="border p-2">{rutina.comentario_deportista || "Sin comentario"}</td>
                  <td className="border p-2">{rutina.comentario_entrenador || "Sin comentario"}</td>
                  <td className="border p-2">
                    <button
                      onClick={() =>
                        router.push(`/detalle_rutina_fisica?id=${rutina.id_rutina}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver Detalles / Comentar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Tabla de Rutinas Específicas */}
      <section>
        <h2 className="text-xl font-semibold text-green-600 mb-3">Rutinas Específicas</h2>
        {rutinasEspecificas.length === 0 ? (
          <p className="text-gray-600">No hay rutinas específicas registradas.</p>
        ) : (
          <table className="w-full border border-gray-300 text-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Comentario Deportista</th>
                <th className="border p-2">Comentario Entrenador</th>
                <th className="border p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutinasEspecificas.map((rutina) => (
                <tr key={rutina.id_rutina} className="hover:bg-gray-100">
                  <td className="border p-2">{new Date(rutina.fecha).toLocaleDateString()}</td>
                  <td className="border p-2">{rutina.comentario_deportista || "Sin comentario"}</td>
                  <td className="border p-2">{rutina.comentario_entrenador || "Sin comentario"}</td>
                  <td className="border p-2">
                    <button
                      onClick={() =>
                        router.push(`/detalle_rutina_especifica?id=${rutina.id_rutina}`)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Ver Detalles / Comentar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
