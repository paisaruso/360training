import React from "react";

export default function NotificacionesActions({
  idUsuario,
  onAccionCompletada,
}: {
  idUsuario: string | null;
  onAccionCompletada: () => void;
}) {
  const marcarTodasComoLeidas = async () => {
    if (!idUsuario) return;

    try {
      await fetch(`http://localhost:5000/api/notificaciones/usuario/${idUsuario}`, {
        method: "PUT",
      });
      onAccionCompletada();
    } catch (err) {
      console.error("❌ Error al marcar todas como leídas:", err);
    }
  };

  return (
    <div className="mb-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={marcarTodasComoLeidas}
      >
        Marcar todas como leídas
      </button>
    </div>
  );
}
