import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface EjercicioFisico {
  id_ejercicio_fisico: number;
  repeticiones: number | null;
  series: number | null;
  tiempo: number | null;
  peso: number | null;
  tipo_ejercicio: string;
}

interface RutinaCompleta {
  id_rutina: number;
  id_deportista: number;
  comentario_deportista: string | null;
  comentario_entrenador: string | null;
  fecha: string;
  ejercicios: EjercicioFisico[];
}

export default function DetalleRutinaFisica() {
  const router = useRouter();
  const { id } = router.query;

  const [rutina, setRutina] = useState<RutinaCompleta | null>(null);
  const [comentarioEntrenador, setComentarioEntrenador] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRutina = async () => {
      try {
        console.log("📥 Solicitando rutina completa con ID:", id);
        const response = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_fisica/${id}/completa`);

        console.log("📥 Código de respuesta HTTP:", response.status);
        if (!response.ok) throw new Error("Error al obtener la rutina física");

        const data: RutinaCompleta = await response.json();
        console.log("📦 Rutina recibida:", data);

        setRutina(data);
        setComentarioEntrenador(data.comentario_entrenador || "");
      } catch (error) {
        console.error("❌ Error al cargar la rutina física:", error);
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
          mensaje: "🏋️‍♂️ Tienes un nuevo comentario sobre tu rutina física.",
          tipo: "comentario",
        }),
      });

      if (!res.ok) {
        console.warn("⚠️ No se pudo crear la notificación.");
      } else {
        console.log("✅ Notificación creada para rutina física.");
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
      console.log("📤 ID de entrenador:", idEntrenador);
      console.log("📤 ID de rutina:", rutina.id_rutina);

      const response = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_fisica/${rutina.id_rutina}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_entrenador: comentarioEntrenador,
          id_entrenador: idEntrenador,
        }),
      });

      const respuestaTexto = await response.text();
      console.log("📨 Respuesta del servidor:", respuestaTexto);
      console.log("📤 Código de estado HTTP:", response.status);

      if (!response.ok) {
        if (response.status === 404 && respuestaTexto.includes("Entrenador no encontrado")) {
          console.warn("⚠️ El comentario se guardó pero hubo un 404 por verificación.");
          alert("⚠️ El comentario se guardó pero hubo una advertencia.");
          await crearNotificacion(rutina.id_deportista);
          return;
        } else {
          console.error("❌ Error real al guardar comentario:", respuestaTexto);
          alert("❌ No se pudo guardar el comentario.");
          return;
        }
      }

      alert("✅ Comentario guardado correctamente");
      await crearNotificacion(rutina.id_deportista);
    } catch (error) {
      console.error("❌ Error inesperado al guardar comentario:", error);
      alert("Hubo un error inesperado al guardar el comentario.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Cargando rutina...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Detalle de Rutina Física</h1>

      {rutina && (
        <>
          <p className="mb-2"><strong>Fecha:</strong> {new Date(rutina.fecha).toLocaleDateString()}</p>
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
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Comentario
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-2">Ejercicios en la Rutina</h2>
          {rutina.ejercicios.length === 0 ? (
            <p>No hay ejercicios registrados.</p>
          ) : (
            <ul className="space-y-2">
              {rutina.ejercicios.map((ej) => (
                <li key={ej.id_ejercicio_fisico} className="border p-3 rounded bg-gray-100 text-black">
                  <p><strong>Ejercicio:</strong> {ej.tipo_ejercicio}</p>
                  <p><strong>Repeticiones:</strong> {ej.repeticiones ?? "N/A"}</p>
                  <p><strong>Series:</strong> {ej.series ?? "N/A"}</p>
                  <p><strong>Tiempo:</strong> {ej.tiempo ?? "N/A"} min</p>
                  <p><strong>Peso:</strong> {ej.peso ?? "N/A"} kg</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
