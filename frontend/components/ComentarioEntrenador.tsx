import { useState } from "react";

interface Props {
  idRutina: number;
  tipoRutina: "fisica" | "especifica";
  actualizarComentarios: () => void;
}

export default function ComentarioEntrenador({ idRutina, tipoRutina, actualizarComentarios }: Props) {
  const [comentario, setComentario] = useState("");

  const enviarComentario = async () => {
    if (!comentario.trim()) return alert("El comentario no puede estar vacío.");

    try {
      const response = await fetch(`/api/rutina_${tipoRutina}/${idRutina}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario_entrenador: comentario }),
      });

      if (!response.ok) throw new Error("Error al enviar comentario.");

      alert("✅ Comentario guardado con éxito.");
      setComentario(""); // Limpiar el campo
      actualizarComentarios(); // Refrescar comentarios en pantalla
    } catch (error) {
      console.error("❌ Error al guardar el comentario:", error);
      alert("Error al guardar el comentario.");
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-bold">Comentario del Entrenador</h3>
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Escribe un comentario para el deportista..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />
      <button
        className="mt-2 p-2 bg-blue-600 text-white rounded-md"
        onClick={enviarComentario}
      >
        Guardar Comentario
      </button>
    </div>
  );
}
