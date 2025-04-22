import React, { useEffect, useState } from "react";
import NotificacionesTabs from "../components/NotificacionesTabs";
import NotificacionesActions from "../components/NotificacionesActions";
import ListaNotificaciones from "../components/ListaNotificaciones";

interface Notificacion {
  id_notificacion: number;
  mensaje: string;
  fecha: string;
  leido: boolean;
  // puedes agregar otros campos como "tipo" si los usas
}

export default function Notificaciones() {
  const [tabSeleccionado, setTabSeleccionado] = useState<"noLeidas" | "todas">("noLeidas");
  const [todasNotificaciones, setTodasNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<Notificacion[]>([]);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id_usuario");
    if (id) {
      console.log("✅ id_usuario desde localStorage:", id);
      setIdUsuario(id);
    } else {
      console.warn("⚠️ No se encontró 'id_usuario' en localStorage");
    }
  }, []);

  useEffect(() => {
    if (idUsuario) {
      cargarTodasLasNotificaciones();
    }
  }, [idUsuario]);

  useEffect(() => {
    filtrarNotificaciones();
  }, [todasNotificaciones, tabSeleccionado]);

  const cargarTodasLasNotificaciones = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notificaciones/${idUsuario}`);

      if (!res.ok) {
        console.error(`❌ Error ${res.status}: ${res.statusText}`);
        setTodasNotificaciones([]);
        return;
      }

      const data = await res.json();
      console.log("📦 Todas las notificaciones recibidas:", data);

      if (Array.isArray(data)) {
        setTodasNotificaciones(data);
      } else {
        console.warn("⚠️ La respuesta no es un arreglo:", data);
        setTodasNotificaciones([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar notificaciones:", error);
      setTodasNotificaciones([]);
    }
  };

  const filtrarNotificaciones = () => {
    if (tabSeleccionado === "noLeidas") {
      const noLeidas = todasNotificaciones.filter((n) => !n.leido);
      setNotificacionesFiltradas(noLeidas);
    } else {
      setNotificacionesFiltradas(todasNotificaciones);
    }
  };

  const refrescar = () => {
    cargarTodasLasNotificaciones();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>

      <NotificacionesTabs
        tabSeleccionado={tabSeleccionado}
        setTabSeleccionado={setTabSeleccionado}
      />

      <NotificacionesActions
        idUsuario={idUsuario}
        onAccionCompletada={refrescar}
      />

      <ListaNotificaciones
        notificaciones={notificacionesFiltradas}
        onActualizar={refrescar}
      />
    </div>
  );
}
