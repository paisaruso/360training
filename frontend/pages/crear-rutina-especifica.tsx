import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function CrearRutinaEspecifica() {
  const router = useRouter();

  // Estado de la rutina específica
  const [idRutinaEspecifica, setIdRutinaEspecifica] = useState<number | null>(null);
  const [comentarioDeportista, setComentarioDeportista] = useState("");
  const [ejerciciosAgregados, setEjerciciosAgregados] = useState<any[]>([]);
  const [deporteSeleccionado, setDeporteSeleccionado] = useState("");
  const [tiposEjercicio, setTiposEjercicio] = useState<any[]>([]);  // 🔹 Se añade el estado correcto
  const [datosEjercicio, setDatosEjercicio] = useState({
    cantidad_flechas: 0,
    flechas_por_serie: 0,
    promedio_por_flecha: 0,
    tamano_diana: 0,
    distancia: 0,
    evaluacion: false,
  });

  const [idDeportista, setIdDeportista] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {  // ✅ Asegurar que se ejecute solo en el cliente
      const storedId = localStorage.getItem("id_deportista");
      if (storedId) {
        setIdDeportista(storedId);
        console.log("✅ ID del deportista obtenido:", storedId); // 🔹 Depuración
      } else {
        console.warn("⚠️ No se encontró el ID del deportista en localStorage.");
      }
    }
  }, []);


  const formularioActivo = deporteSeleccionado === "Tiro con Arco";

  useEffect(() => {
    if (!formularioActivo) {
      setDatosEjercicio({
        cantidad_flechas: 0,
        flechas_por_serie: 0,
        promedio_por_flecha: 0,
        tamano_diana: 0,
        distancia: 0,
        evaluacion: false,
      });
    }
  }, [formularioActivo]);

  // Obtener los tipos de ejercicio al cargar la página
  useEffect(() => {
    const obtenerTiposEjercicio = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/tipo_ejercicio");
        if (!response.ok) throw new Error("Error al obtener los tipos de ejercicio");
        const data = await response.json();
        setTiposEjercicio(data);
      } catch (error) {
        console.error("❌ Error al obtener tipos de ejercicio:", error);
      }
    };
    obtenerTiposEjercicio();
  }, []);

  // Función para agregar ejercicio de disparo
  const agregarEjercicioDisparo = async () => {
    if (!idRutinaEspecifica) {
      console.warn("⚠️ No se puede agregar ejercicio: No hay ID de rutina específica.");
      alert("No se puede agregar el ejercicio: No hay rutina creada.");
      return;
    }
  
    console.log("📌 Enviando datos al servidor:", {
      id_rutina_especifica: idRutinaEspecifica, // ✅ Se corrige la clave correcta
      cantidad_flechas: datosEjercicio.cantidad_flechas,
      flechas_por_serie: datosEjercicio.flechas_por_serie,
      promedio_por_flecha: datosEjercicio.promedio_por_flecha,
      tamano_diana: datosEjercicio.tamano_diana,
      distancia: datosEjercicio.distancia,
      evaluacion: datosEjercicio.evaluacion,
    });
  
    try {
      console.log("📌 Enviando solicitud para crear rutina específica con los siguientes datos:", {
        id_deportista: idDeportista
      });
      const response = await fetch("https://three60training-jp4i.onrender.com/api/ejercicio_disparo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_rutina_especifica: idRutinaEspecifica, // ✅ Clave corregida
          cantidad_flechas: datosEjercicio.cantidad_flechas,
          flechas_por_serie: datosEjercicio.flechas_por_serie,
          promedio_por_flecha: datosEjercicio.promedio_por_flecha,
          tamano_diana: datosEjercicio.tamano_diana,
          distancia: datosEjercicio.distancia,
          evaluacion: datosEjercicio.evaluacion,
        }),
      });
      // 🔹 Verificar la respuesta de la API
      console.log("📌 Respuesta de la API (status):", response.status);

      if (!response.ok) throw new Error("Error al agregar ejercicio de disparo");
  
      alert("✅ Ejercicio de disparo agregado con éxito.");
      setEjerciciosAgregados([...ejerciciosAgregados, datosEjercicio]);
      
      setDatosEjercicio({
        cantidad_flechas: 0,
        flechas_por_serie: 0,
        promedio_por_flecha: 0,
        tamano_diana: 0,
        distancia: 0,
        evaluacion: false,
      });
  
      console.log("✅ Ejercicio agregado correctamente.");
    } catch (error) {
      console.error("❌ Error al agregar ejercicio de disparo:", error);
      alert("Ocurrió un error al agregar el ejercicio.");
    }
  };
  

  // Función para finalizar la rutina específica
  const finalizarRutinaEspecifica = async () => {
    if (!idRutinaEspecifica) return;

    try {
      if (comentarioDeportista.trim() !== "") {
        await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica/${idRutinaEspecifica}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario_deportista: comentarioDeportista }),
        });
      }

      alert("✅ Rutina específica finalizada con éxito.");
      router.push("/");
    } catch (error) {
      console.error("❌ Error al finalizar la rutina específica:", error);
    }
  };

  // Función para crear la rutina específica
  const crearRutinaEspecifica = async () => {
    if (!idDeportista) {
      console.error("❌ No se encontró un ID de deportista en localStorage.");
      alert("Error: No se encontró el ID del deportista.");
      return;
    }
  
    console.log("📌 Enviando solicitud para crear rutina específica con:", {
      id_deportista: idDeportista,
      id_deporte: 1, // ✅ Ahora se envía id_deporte correctamente
    });
  
    try {
      console.log("📌 Creando nueva rutina específica...");
      const response = await fetch("https://three60training-jp4i.onrender.com/api/rutina_especifica", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
        id_deportista: idDeportista, 
        id_deporte: 1, }), // 🔹 Agregando id_deporte
      });
  
      console.log("📌 Respuesta de la API (status):", response.status);
  
      const responseData = await response.json(); // 🔹 Obtener respuesta
      console.log("📌 Respuesta completa de la API:", responseData);
  
      if (!response.ok) {
        console.error("❌ Error en la API:", responseData);
        throw new Error("Error al crear la rutina específica");
      }
  
      setIdRutinaEspecifica(responseData.id_rutina);
      console.log("✅ Rutina específica creada con éxito. ID:", responseData.id_rutina);
      alert("✅ Rutina específica creada con éxito. Ahora puedes agregar ejercicios.");
    } catch (error) {
      console.error("❌ Error al crear la rutina específica:", error);
      alert("Ocurrió un error al crear la rutina específica.");
    }
  };
  
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Registrar Rutina Específica</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Comentario del Deportista</label>
        <textarea
          value={comentarioDeportista}
          onChange={(e) => setComentarioDeportista(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
          placeholder="Escribe un comentario opcional sobre esta rutina..."
        />
      </div>
      <button onClick={crearRutinaEspecifica} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Registrar Rutina Específica
      </button>

      <div className="mb-4 mt-4">
        <label className="block text-gray-700 font-semibold">Seleccione un Deporte</label>
        <select
          value={deporteSeleccionado}
          onChange={(e) => setDeporteSeleccionado(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
        >
          <option value="">Seleccione un deporte</option>
          <option value="Tiro con Arco">Tiro con Arco</option>
        </select>
      </div>
      
      <h2 className="text-xl font-bold mt-4 text-gray-800">Agregar Ejercicio de Disparo</h2>
      <fieldset disabled={!formularioActivo} className={!formularioActivo ? "opacity-50" : ""}>
        <label className="block text-gray-700 font-semibold">Cantidad de Flechas</label>
        <input
          type="number"
          placeholder="Ingrese la cantidad de flechas"
          value={datosEjercicio.cantidad_flechas}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, cantidad_flechas: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />

        <label className="block text-gray-700 font-semibold mt-2">Flechas por Serie</label>
        <input
          type="number"
          placeholder="Ingrese la cantidad de flechas por serie"
          value={datosEjercicio.flechas_por_serie}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, flechas_por_serie: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />

        <label className="block text-gray-700 font-semibold mt-2">Promedio por Flecha</label>
        <input
          type="number"
          placeholder="Ingrese el promedio de puntos por flecha"
          value={datosEjercicio.promedio_por_flecha}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, promedio_por_flecha: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />

        <label className="block text-gray-700 font-semibold mt-2">Tamaño de la Diana en CM</label>
        <input
          type="number"
          placeholder="Ingrese el tamaño de la diana en cm"
          value={datosEjercicio.tamano_diana}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, tamano_diana: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />

        <label className="block text-gray-700 font-semibold mt-2">Distancia en mts.</label>
        <input
          type="number"
          placeholder="Ingrese la distancia al blanco en metros"
          value={datosEjercicio.distancia}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, distancia: Number(e.target.value) })}
          className="p-2 border border-gray-300 rounded-md w-full text-black"
        />

        <label className="block text-gray-700 font-semibold mt-2">Evaluación</label>
        <select
          value={datosEjercicio.evaluacion.toString()}
          onChange={(e) => setDatosEjercicio({ ...datosEjercicio, evaluacion: e.target.value === "true" })}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
        >
          <option value="false">No</option>
          <option value="true">Sí</option>
        </select>

        <button 
          onClick={agregarEjercicioDisparo}  // 🔹 Se añade el llamado a la función
          className="p-3 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Agregar Ejercicio de Disparo
        </button>
        <button
          onClick={finalizarRutinaEspecifica}
          className="p-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Finalizar Rutina
        </button>
      </fieldset>
    </div>
  );
}
