import React from "react";

interface Notificacion {
  id_notificacion: number;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

interface Props {
  notif: Notificacion;
  onActualizar: () => void;
}

export default function NotificationCard({ notif, onActualizar }: Props) {
  const marcarComoLeida = async () => {
    await fetch(`/api/notificaciones/${notif.id_notificacion}`, {
      method: "PUT",
    });
    onActualizar();
  };

  const eliminar = async () => {
    await fetch(`/api/notificaciones/${notif.id_notificacion}`, {
      method: "DELETE",
    });
    onActualizar();
  };

  return (
    <div
      className={`p-4 rounded shadow ${
        notif.leido ? "bg-white text-gray-800" : "bg-yellow-100 text-gray-800"
      }`}
    >
      <p>{notif.mensaje}</p>
      <p className="text-sm text-gray-600">{new Date(notif.fecha).toLocaleString()}</p>

      <div className="mt-2 space-x-2">
        {!notif.leido && (
          <button
            onClick={marcarComoLeida}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Marcar como leída
          </button>
        )}
        <button
          onClick={eliminar}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
