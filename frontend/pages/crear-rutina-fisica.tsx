import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface EjercicioFisico {
  id_tipo_ejercicio: number;
  nombre: string;
  usa_tiempo: boolean;
  usa_repeticiones: boolean;
  usa_series: boolean;
}

export default function CrearRutinaFisica() {
  const router = useRouter();

  const [idRutina, setIdRutina] = useState<number | null>(null);
  const [ejerciciosAgregados, setEjerciciosAgregados] = useState<any[]>([]);
  const [comentarioDeportista, setComentarioDeportista] = useState("");
  const [tiposEjercicio, setTiposEjercicio] = useState<EjercicioFisico[]>([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<EjercicioFisico | null>(null);
  const [datosEjercicio, setDatosEjercicio] = useState({
    repeticiones: 0,
    series: 0,
    tiempo: 0,
  });

  const idDeportista = typeof window !== "undefined" ? Number(localStorage.getItem("id_deportista")) : 0;

  const agregarEjercicio = async () => {
    if (!idRutina || !ejercicioSeleccionado) return;

    try {
      const response = await fetch("https://three60training-jp4i.onrender.com/api/ejercicio_fisico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_rutina_fisica: idRutina,
          id_tipo_ejercicio: ejercicioSeleccionado.id_tipo_ejercicio,
          repeticiones: datosEjercicio.repeticiones || null,
          series: datosEjercicio.series || null,
          tiempo: datosEjercicio.tiempo || null,
        }),
      });

      if (!response.ok) throw new Error("❌ Error al agregar ejercicio.");

      const data = await response.json();
      obtenerEjerciciosDeRutina();
      setEjercicioSeleccionado(null);
      setDatosEjercicio({ repeticiones: 0, series: 0, tiempo: 0 });
      alert("✅ Ejercicio agregado con éxito.");
    } catch (error) {
      console.error("❌ Error al agregar ejercicio:", error);
      alert("Error al agregar ejercicio.");
    }
  };

  const obtenerEjerciciosDeRutina = async () => {
    if (!idRutina) return;

    try {
      const response = await fetch(`https://three60training-jp4i.onrender.com/api/ejercicio_fisico/rutina/${idRutina}`);
      if (!response.ok) throw new Error("❌ Error al obtener los ejercicios.");
      const data = await response.json();
      setEjerciciosAgregados(data);
    } catch (error) {
      console.error("❌ Error al obtener ejercicios:", error);
      alert("Error al obtener los ejercicios.");
    }
  };

  const obtenerTiposEjercicio = async () => {
    try {
      const response = await fetch("https://three60training-jp4i.onrender.com/api/tipo_ejercicio");
      if (!response.ok) throw new Error("Error al obtener tipos de ejercicio");
      const data: EjercicioFisico[] = await response.json();
      setTiposEjercicio(data);
    } catch (error) {
      console.error("❌ Error al obtener tipos de ejercicio:", error);
      alert("Error al cargar ejercicios.");
    }
  };

  useEffect(() => {
    obtenerTiposEjercicio();
  }, []);

  useEffect(() => {
    if (idRutina) obtenerEjerciciosDeRutina();
  }, [idRutina]);

  const crearRutina = async () => {
    try {
      const response = await fetch("https://three60training-jp4i.onrender.com/api/rutina_fisica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_deportista: idDeportista,
          comentario_deportista: comentarioDeportista || null,
        }),
      });

      if (!response.ok) throw new Error("Error al crear la rutina");

      const data = await response.json();
      setIdRutina(data.id_rutina);
      alert("✅ Rutina creada con éxito. Ahora puedes agregar ejercicios.");
    } catch (error) {
      console.error("❌ Error al crear la rutina:", error);
      alert("Ocurrió un error al crear la rutina.");
    }
  };

  const seleccionarEjercicio = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const idEjercicio = parseInt(event.target.value, 10);
    const ejercicio = tiposEjercicio.find((ej) => ej.id_tipo_ejercicio === idEjercicio);
    setEjercicioSeleccionado(ejercicio || null);
    setDatosEjercicio({ repeticiones: 0, series: 0, tiempo: 0 });
  };

  const finalizarRutina = async () => {
    if (!idRutina) return;

    try {
      const response = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_fisica/${idRutina}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentario_deportista: comentarioDeportista || null,
        }),
      });

      if (!response.ok) throw new Error("Error al finalizar rutina");

      alert("✅ Rutina finalizada con éxito.");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Error al finalizar la rutina:", error);
      alert("Ocurrió un error al finalizar la rutina.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Crear Rutina Física</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Comentario del Deportista</label>
        <textarea
          value={comentarioDeportista}
          onChange={(e) => setComentarioDeportista(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
          placeholder="Escribe un comentario opcional sobre esta rutina..."
        />
      </div>

      <button onClick={crearRutina} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Crear Rutina
      </button>

      <h2 className="text-xl font-bold mt-4 text-gray-800">Seleccionar Ejercicio</h2>
      <select onChange={seleccionarEjercicio} className="p-3 border rounded-lg w-full bg-white text-black">
        <option value="">Seleccione un ejercicio</option>
        {tiposEjercicio.map((ej) => (
          <option key={ej.id_tipo_ejercicio} value={ej.id_tipo_ejercicio}>
            {ej.nombre}
          </option>
        ))}
      </select>

      <div className="mt-4 bg-gray-200 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          {ejercicioSeleccionado ? ejercicioSeleccionado.nombre : "Ejercicio no seleccionado"}
        </h3>

        <div className="mt-2">
          <label className="block text-gray-700 font-semibold">Número de Repeticiones</label>
          <input
            type="number"
            value={datosEjercicio.repeticiones}
            onChange={(e) => setDatosEjercicio({ ...datosEjercicio, repeticiones: Number(e.target.value) })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
            disabled={!ejercicioSeleccionado?.usa_repeticiones}
          />
        </div>

        <div className="mt-2">
          <label className="block text-gray-700 font-semibold">Número de Series</label>
          <input
            type="number"
            value={datosEjercicio.series}
            onChange={(e) => setDatosEjercicio({ ...datosEjercicio, series: Number(e.target.value) })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
            disabled={!ejercicioSeleccionado?.usa_series}
          />
        </div>

        <div className="mt-2">
          <label className="block text-gray-700 font-semibold">Tiempo (minutos)</label>
          <input
            type="number"
            value={datosEjercicio.tiempo}
            onChange={(e) => setDatosEjercicio({ ...datosEjercicio, tiempo: Number(e.target.value) })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
            disabled={!ejercicioSeleccionado?.usa_tiempo}
          />
        </div>

        <button
          onClick={agregarEjercicio}
          disabled={!idRutina || !ejercicioSeleccionado}
          className={`p-3 mt-4 rounded-lg text-white ${
            idRutina && ejercicioSeleccionado ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Agregar Ejercicio
        </button>

        <button
          onClick={finalizarRutina}
          className="p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Finalizar Rutina
        </button>

        <h2 className="text-xl font-bold mt-6 text-gray-800">Ejercicios en la Rutina</h2>
        {ejerciciosAgregados.length === 0 ? (
          <p className="text-gray-500">No hay ejercicios en la rutina.</p>
        ) : (
          <ul>
            {ejerciciosAgregados.map((ej, index) => (
              <li key={index} className="border p-2 mt-2 bg-gray-100 text-gray-900 rounded">
                {ej.tipo_ejercicio} - {ej.repeticiones ?? 0} reps - {ej.series ?? 0} series
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
