import React from "react";

interface NotificacionesTabsProps {
  tabSeleccionado: "noLeidas" | "todas";
  setTabSeleccionado: (tab: "noLeidas" | "todas") => void;
}

export default function NotificacionesTabs({
  tabSeleccionado,
  setTabSeleccionado,
}: NotificacionesTabsProps) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => setTabSeleccionado("noLeidas")}
        className={`px-4 py-2 rounded ${
          tabSeleccionado === "noLeidas"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        No Leídas
      </button>

      <button
        onClick={() => setTabSeleccionado("todas")}
        className={`px-4 py-2 rounded ${
          tabSeleccionado === "todas"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        Ver Todas
      </button>
    </div>
  );
}
