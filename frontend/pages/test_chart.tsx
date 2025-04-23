import dynamic from "next/dynamic";

const GraficoClientOnly = dynamic(() => import("../components/GraficoClientOnly"), {
  ssr: false,
});

export default function PruebaGrafico() {
  return (
    <div className="p-10 text-black">
      <h2 className="text-center font-bold text-lg mb-6">Test chart</h2>
      <GraficoClientOnly />
    </div>
  );
}

