// frontend/pages/grafico_popup.tsx
import dynamic from "next/dynamic";
import React from "react";

// 👇 IMPORTACIÓN DINÁMICA CON SSR DESACTIVADO
const GraficoClientOnly = dynamic(() => import("../components/GraficoClientOnly"), {
  ssr: false,
});

export default function GraficoPopup() {
  return (
    <div className="p-10 text-black">
      <h2 className="text-center font-bold text-lg mb-6">Gráfico en Ventana Emergente</h2>
      <GraficoClientOnly />
    </div>
  );
}
