import React, { useEffect } from "react";

export default function NotificacionesBadge({ cantidad }: { cantidad: number }) {
  useEffect(() => {
    console.log("🔍 NotificacionesBadge montado. Cantidad recibida:", cantidad);
  }, [cantidad]);

  if (cantidad === 0) {
    console.log("🚫 Cantidad es 0, no se muestra el badge.");
    return null;
  }

  console.log("✅ Mostrando badge con cantidad:", cantidad);

  return (
    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {cantidad > 9 ? "9+" : cantidad}
    </span>
  );
}
