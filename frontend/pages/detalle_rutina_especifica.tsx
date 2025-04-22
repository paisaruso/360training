import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface EjercicioDisparo {
  id_ejercicio: number;
  cantidad_flechas: number;
  flechas_por_serie: number;
  promedio_por_flecha: number;
  tamano_diana: number;
  distancia: number;
  evaluacion: boolean;
}

interface RutinaEspecifica {
  id_rutina: number;
  id_deportista: number;
  comentario_deportista: string | null;
  comentario_entrenador: string | null;
  fecha?: string;
  ejercicios: EjercicioDisparo[];
}

export default function DetalleRutinaEspecifica() {
  const router = useRouter();
  const { id } = router.query;

  const [rutina, setRutina] = useState<RutinaEspecifica | null>(null);
  const [comentarioEntrenador, setComentarioEntrenador] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRutina = async () => {
      try {
        console.log("📥 Solicitando rutina específica con ID:", id);
        const response = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica/${id}`);

        console.log("📥 Código de respuesta HTTP:", response.status);
        if (!response.ok) throw new Error("Error al obtener la rutina específica");

        const data: RutinaEspecifica = await response.json();
        console.log("📦 Rutina específica recibida:", data);

        setRutina(data);
        setComentarioEntrenador(data.comentario_entrenador || "");
      } catch (error) {
        console.error("❌ Error al cargar la rutina específica:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutina();
  }, [id]);

  const crearNotificacion = async (idDeportista: number) => {
    try {
      const res = await fetch("http://localhost:5000/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: idDeportista,
          mensaje: "📋 Tienes un nuevo comentario sobre tu rutina específica.",
          tipo: "comentario",
        }),
      });

      if (!res.ok) {
        console.warn("⚠️ No se pudo crear la notificación.");
      } else {
        console.log("✅ Notificación creada para rutina específica.");
      }
    } catch (error) {
      console.error("❌ Error al crear la notificación:", error);
    }
  };

  const guardarComentario = async () => {
    if (!rutina) {
      console.warn("⚠️ No se puede guardar comentario: rutina es null");
      return;
    }

    const storedId = localStorage.getItem("id_usuario");
    const idEntrenador = storedId ? parseInt(storedId, 10) : null;

    if (!idEntrenador) {
      console.error("❌ No se encontró ID del entrenador en localStorage");
      alert("No se pudo identificar al entrenador.");
      return;
    }

    try {
      console.log("📤 Enviando comentario:", comentarioEntrenador);
      const response = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica/${rutina.id_rutina}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_entrenador: comentarioEntrenador,
          id_entrenador: idEntrenador,
        }),
      });

      console.log("📤 Código de estado HTTP al guardar comentario:", response.status);
      const respuestaTexto = await response.text();
      console.log("📨 Texto de respuesta:", respuestaTexto);

      if (!response.ok) {
        console.warn("⚠️ El comentario pudo haberse guardado, pero no se verificó correctamente al entrenador.");
      }

      alert("✅ Comentario guardado correctamente");

      // 👇 Crear la notificación para el deportista
      await crearNotificacion(rutina.id_deportista);

    } catch (error) {
      console.error("❌ Error inesperado al guardar comentario:", error);
      alert("Hubo un error inesperado al guardar el comentario.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Cargando rutina específica...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Detalle de Rutina Específica</h1>

      {rutina ? (
        <>
          {rutina.fecha && (
            <p className="mb-2"><strong>Fecha:</strong> {new Date(rutina.fecha).toLocaleDateString()}</p>
          )}
          <p className="mb-2"><strong>Comentario del Deportista:</strong> {rutina.comentario_deportista || "Sin comentario"}</p>

          <div className="mb-4">
            <label className="font-semibold">Comentario del Entrenador:</label>
            <textarea
              value={comentarioEntrenador}
              onChange={(e) => setComentarioEntrenador(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1 text-black"
              placeholder="Escribe tu comentario aquí..."
              rows={4}
            />
            <button
              onClick={guardarComentario}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar Comentario
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2">Ejercicios de Disparo</h2>
          {rutina.ejercicios.length === 0 ? (
            <p>No hay ejercicios registrados.</p>
          ) : (
            <ul className="space-y-2">
              {rutina.ejercicios.map((ej) => (
                <li key={ej.id_ejercicio} className="border p-3 rounded bg-gray-100 text-black">
                  <p><strong>Cantidad de Flechas:</strong> {ej.cantidad_flechas}</p>
                  <p><strong>Flechas por Serie:</strong> {ej.flechas_por_serie}</p>
                  <p><strong>Promedio por Flecha:</strong> {ej.promedio_por_flecha}</p>
                  <p><strong>Tamaño Diana:</strong> {ej.tamano_diana} cm</p>
                  <p><strong>Distancia:</strong> {ej.distancia} m</p>
                  <p><strong>Evaluación:</strong> {ej.evaluacion ? "Sí" : "No"}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-red-600">⚠️ No se pudo cargar la rutina específica.</p>
      )}
    </div>
  );
}
