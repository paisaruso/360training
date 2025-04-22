import { useEffect, useState } from "react";

const ComentariosFisicos = ({ idDeportista }) => {
  const [rutinas, setRutinas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idDeportista) {
      console.warn("⚠️ No se proporcionó idDeportista en ComentariosFisicos.");
      return;
    }

    const fetchRutinasFisicas = async () => {
      console.log(`📡 Consultando rutinas físicas para id_deportista=${idDeportista}...`);

      try {
        const res = await fetch(
          `https://three60training-jp4i.onrender.com/api/rutina_fisica?id_deportista=${idDeportista}`
        );

        if (!res.ok) {
          const texto = await res.text();
          console.error("❌ Error al obtener rutinas físicas:", res.status, texto);
          setError("No se pudieron cargar las rutinas físicas.");
          return;
        }

        const data = await res.json();
        const ordenadas = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        console.log("📥 Rutinas físicas recibidas:", ordenadas);
        setRutinas(ordenadas);
      } catch (err) {
        console.error("❌ Error de red al cargar rutinas físicas:", err);
        setError("Ocurrió un error al cargar las rutinas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRutinasFisicas();
  }, [idDeportista]);

  if (loading) return <p className="text-gray-500 text-center">Cargando rutinas físicas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (rutinas.length === 0) return <p className="text-center text-gray-400">No hay rutinas físicas aún.</p>;

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h3 className="text-lg font-semibold text-green-600 mb-2">Comentarios de Rutinas Físicas</h3>
      <ul className="space-y-4">
        {rutinas.map((r) => (
          <li key={r.id_rutina} className="border-b pb-2 text-sm text-gray-700">
            <p><strong>Fecha:</strong> {new Date(r.fecha).toLocaleDateString()}</p>
            <p><strong>Comentario del Entrenador:</strong> {r.comentario_entrenador || "Sin comentario"}</p>
            <p><strong>Comentario del Deportista:</strong> {r.comentario_deportista || "Sin comentario"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComentariosFisicos;
