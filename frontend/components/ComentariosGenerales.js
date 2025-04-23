import { useEffect, useState } from "react";

const ComentariosGenerales = ({ idDeportista }) => {
  const [comentarios, setComentarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idDeportista) {
      console.warn("⚠️ No se proporcionó idDeportista al componente ComentariosGenerales.");
      return;
    }

    const fetchComentarios = async () => {
      console.log(`📡 Consultando comentarios para id_deportista=${idDeportista}...`);
      try {
        const res = await fetch(
          `https://three60training-jp4i.onrender.com/api/comentarios/deportista/${idDeportista}`
        );

        if (!res.ok) {
          const texto = await res.text();
          console.error("❌ Error al obtener comentarios:", res.status, texto);
          setError("No se pudieron cargar los comentarios.");
          return;
        }

        const data = await res.json();
        console.log("📥 Comentarios recibidos:", data);
        setComentarios(data);
      } catch (err) {
        console.error("❌ Error de red al cargar comentarios:", err);
        setError("Ocurrió un error de red al cargar los comentarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchComentarios();
  }, [idDeportista]);

  if (loading) return <p className="text-gray-500 text-center">Cargando comentarios...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (comentarios.length === 0) return <p className="text-center text-gray-400">No hay comentarios aún.</p>;

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h3 className="text-lg font-semibold text-green-600 mb-2">Comentarios de Entrenadores</h3>
      <ul className="space-y-4">
        {comentarios.map((c) => (
          <li key={c.id_comentario} className="border-b pb-2 text-sm text-gray-700">
            <p><strong>Entrenador:</strong> {c.entrenador}</p>
            <p><strong>Fecha:</strong> {new Date(c.fecha).toLocaleDateString()}</p>
            <p><strong>Comentario:</strong> {c.contenido}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComentariosGenerales;
