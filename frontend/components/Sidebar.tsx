import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import NotificacionesBadge from "../components/NotificacionesBadge";

export default function Sidebar() {
  const router = useRouter();
  const [rol, setRol] = useState<string | null>(null);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);

  useEffect(() => {
    const obtenerRol = () => {
      const userRole = localStorage.getItem("tipo_usuario");
      console.log("🧾 Rol obtenido desde localStorage:", userRole);
      setRol(userRole);
    };

    obtenerRol();

    const interval = setInterval(() => {
      if (!rol) {
        obtenerRol();
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [rol]);

  useEffect(() => {
    const obtenerNotificacionesNoLeidas = async () => {
      try {
        const idUsuario = localStorage.getItem("id_usuario");
        console.log("🔍 id_usuario detectado en Sidebar:", idUsuario);
        if (!idUsuario) {
          console.warn("⚠️ No se encontró 'id_usuario' en localStorage");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/notificaciones/${idUsuario}`);
        console.log("📡 Petición enviada a:", `http://localhost:5000/api/notificaciones/${idUsuario}`);
        if (!response.ok) throw new Error("Error al obtener notificaciones");

        const data = await response.json();
        console.log("📬 Notificaciones obtenidas:", data);

        const cantidadNoLeidas = Array.isArray(data)
          ? data.filter((n) => !n.leido).length
          : 0;

        console.log("🔔 Cantidad de notificaciones no leídas:", cantidadNoLeidas);

        setNotificacionesNoLeidas(cantidadNoLeidas);
      } catch (error) {
        console.error("❌ Error al obtener notificaciones no leídas:", error);
      }
    };

    if (rol === "Deportista") {
      console.log("👟 Usuario es Deportista. Iniciando fetch de notificaciones...");
      obtenerNotificacionesNoLeidas();
      const intervalo = setInterval(() => {
        console.log("🔄 Refrescando notificaciones...");
        obtenerNotificacionesNoLeidas();
      }, 10000);
      return () => clearInterval(intervalo);
    }
  }, [rol]);

  const handleLogout = () => {
    console.log("🔚 Cerrando sesión. Limpiando localStorage...");
    localStorage.removeItem("tipo_usuario");
    localStorage.removeItem("id_usuario");
    router.push("/");
  };

  if (!rol) {
    console.log("🕓 Esperando a que se cargue el rol...");
    return null;
  }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Menú</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard">
            <span className="block p-3 hover:bg-gray-700 rounded">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link href="/user_profile">
            <span className="block p-3 hover:bg-gray-700 rounded">Perfil</span>
          </Link>
        </li>

        {rol === "Deportista" && (
          <>
            <li>
              <Link href="/notificaciones">
                <span className="block p-3 hover:bg-gray-700 rounded flex justify-between items-center gap-2">
                  <span>Notificaciones</span>
                  <NotificacionesBadge cantidad={notificacionesNoLeidas} />
                </span>
              </Link>
            </li>
            <li>
              <Link href="/historial_deportista">
                <span className="block p-3 hover:bg-gray-700 rounded">
                  Historial de Entrenamientos
                </span>
              </Link>
            </li>
            <li>
              <Link href="/crear-rutina-fisica">
                <span className="block p-3 hover:bg-gray-700 rounded">Crear Rutina Física</span>
              </Link>
            </li>
            <li>
              <Link href="/crear-rutina-especifica">
                <span className="block p-3 hover:bg-gray-700 rounded">Crear Rutina Específica</span>
              </Link>
            </li>
          </>
        )}

        {rol === "Entrenador" && (
          <>
            <li>
              <Link href="/deportista">
                <span className="block p-3 hover:bg-gray-700 rounded">Buscar Deportista</span>
              </Link>
            </li>
            <li>
              <Link href="/metricas/metricas_dashboard">
                <span className="block p-3 hover:bg-gray-700 rounded">Métricas</span>
              </Link>
            </li>
          </>
        )}

        <li>
          <button
            onClick={handleLogout}
            className="block p-3 w-full bg-red-600 hover:bg-red-700 rounded text-white mt-6"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
