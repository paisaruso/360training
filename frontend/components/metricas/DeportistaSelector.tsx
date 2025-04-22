"use client";
import { useEffect, useState } from "react";

interface Deportista {
  id_deportista: number;
  nombre_usuario: string;
  nivel_experiencia: string;
}

interface Props {
  onSeleccion: (nombre: string) => void;
  onFechas: (inicio: string, fin: string) => void;
}

export default function DeportistaSelector({ onSeleccion, onFechas }: Props) {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [filtro, setFiltro] = useState("");
  const [seleccionado, setSeleccionado] = useState("");

  useEffect(() => {
    const fetchDeportistas = async () => {
      const res = await fetch("https://three60training-jp4i.onrender.com/api/deportistas/info/detalles");
      const data = await res.json();
      setDeportistas(data);
    };
    fetchDeportistas();
  }, []);

  const manejarSeleccion = async (nombre: string) => {
    setSeleccionado(nombre);
    onSeleccion(nombre);

    const res = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica?nombre=${encodeURIComponent(nombre)}`);
    const rutinas = await res.json();
    if (Array.isArray(rutinas) && rutinas.length > 0) {
      const fechas = rutinas.map((r: any) => new Date(r.fecha));
      const inicio = new Date(Math.min(...fechas.map(f => f.getTime()))).toISOString().split("T")[0];
      const fin = new Date(Math.max(...fechas.map(f => f.getTime()))).toISOString().split("T")[0];
      onFechas(inicio, fin);
    }
  };

  return (
    <div className="w-full md:w-1/3 max-h-[450px] overflow-y-auto border p-4 rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Seleccionar Deportista</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />
      <ul className="divide-y text-sm">
        {deportistas
          .filter((d) =>
            d.nombre_usuario.toLowerCase().includes(filtro.toLowerCase())
          )
          .map((d) => (
            <li
              key={d.id_deportista}
              className={`py-2 px-2 cursor-pointer hover:bg-gray-200 rounded ${
                d.nombre_usuario === seleccionado ? "bg-green-100 font-semibold" : ""
              }`}
              onClick={() => manejarSeleccion(d.nombre_usuario)}
            >
              {d.nombre_usuario}
            </li>
          ))}
      </ul>
    </div>
  );
}
