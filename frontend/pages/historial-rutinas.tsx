import { useEffect, useState } from "react";

const HistorialRutinas = () => {
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/rutinas-asignadas");
        if (!response.ok) throw new Error("Error al obtener el historial de rutinas");

        const data = await response.json();
        setRutinas(data);
      } catch (error) {
        console.error("❌ Error al cargar el historial de rutinas:", error);
      }
    };

    fetchRutinas();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Rutinas Asignadas</h1>
      {rutinas.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Deportista</th>
              <th className="p-3 border">Fecha</th>
              <th className="p-3 border">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {rutinas.map((rutina, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{rutina.deportista}</td>
                <td className="border border-gray-300 p-2">{new Date(rutina.fecha).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{rutina.comentario || "Sin comentarios"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay rutinas asignadas aún.</p>
      )}
    </div>
  );
};

export default HistorialRutinas;
