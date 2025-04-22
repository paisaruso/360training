import { NextApiRequest, NextApiResponse } from "next";

// Simulación de datos desde base de datos
const deportistas = [
  { id_deportista: 1, nombre: "Juan Pérez", nivel_experiencia: "Avanzado", id_entrenador: 1 },
  { id_deportista: 2, nombre: "María Gómez", nivel_experiencia: "Principiante", id_entrenador: 1 },
  { id_deportista: 3, nombre: "Carlos Ruiz", nivel_experiencia: "Medio", id_entrenador: 2 },
  // ...otros deportistas
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_entrenador } = req.query;

  if (!id_entrenador) {
    return res.status(400).json({ error: "Falta el parámetro id_entrenador" });
  }

  const idParsed = parseInt(id_entrenador as string, 10);
  const deportistasFiltrados = deportistas.filter(
    (d) => d.id_entrenador === idParsed
  );

  res.status(200).json(deportistasFiltrados);
}
