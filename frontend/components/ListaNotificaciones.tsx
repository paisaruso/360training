import React from "react";
import NotificationCard from "./NotificationCard";

interface Notificacion {
  id_notificacion: number;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

interface ListaNotificacionesProps {
  notificaciones: Notificacion[];
  onActualizar: () => void;
}

export default function ListaNotificaciones({
  notificaciones,
  onActualizar,
}: ListaNotificacionesProps) {
  if (!notificaciones || notificaciones.length === 0) {
    return <p className="text-gray-500">No hay notificaciones para mostrar.</p>;
  }

  return (
    <div className="space-y-4">
      {notificaciones.map((notif) => (
        <NotificationCard
          key={notif.id_notificacion}
          notif={notif}
          onAccion={onActualizar}
        />
      ))}
    </div>
  );
}
