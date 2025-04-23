import { useEffect, useState } from "react";
import ComentariosGenerales from "../components/ComentariosGenerales";
import ComentariosFisicos from "../components/ComentariosFisicos";
import ComentariosEspecificos from "../components/ComentariosEspecificos";
import { useRouter } from "next/router";

export default function HistorialDeportista() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const id_deportista = localStorage.getItem("id_deportista");

  const [rutinasFisicas, setRutinasFisicas] = useState([]);
  const [rutinasEspecificas, setRutinasEspecificas] = useState([]);

  const obtenerUserData = async () => {
    try {
      const sid = localStorage.getItem("sid");
      const sessionRes = await fetch(
        `https://three60training-jp4i.onrender.com/api/user-session?sid=${sid}`
      );
      const session = await sessionRes.json();
      const infoRes = await fetch(
        `https://three60training-jp4i.onrender.com/api/user-info?email=${session.email}`
      );
      const userInfo = await infoRes.json();
      setUserData(userInfo);
    } catch (err) {
      setError("Error al cargar los datos del usuario.");
    }
  };

  const obtenerRutinas = async () => {
    try {
      const resFisicas = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_fisica?id_deportista=${id_deportista}`);
      const fisicas = await resFisicas.json();
      setRutinasFisicas(fisicas.reverse());

      const resEspecificas = await fetch(`https://three60training-jp4i.onrender.com/api/rutina_especifica?id_deportista=${id_deportista}`);
      const especificas = await resEspecificas.json();
      setRutinasEspecificas(especificas.reverse());
    } catch (e) {
      setError("Error al cargar rutinas.");
    }
  };

  useEffect(() => {
    obtenerUserData();
    obtenerRutinas();
    setLoading(false);
  }, []);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userData) return <p className="text-center">No se encontraron datos del usuario.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Historial del Deportista</h1>

      <div className="bg-black text-white p-4 rounded mb-6">
        <p><strong>Nombre:</strong> {userData.user.nombre}</p>
        <p><strong>Correo:</strong> {userData.user.correo_electronico}</p>
      </div>

      <div className="grid gap-6">
        <ComentariosGenerales idDeportista={id_deportista} />
        <ComentariosFisicos idDeportista={id_deportista} />
        <ComentariosEspecificos idDeportista={id_deportista} />

        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-black">Rutinas Físicas</h2>
          {rutinasFisicas.length === 0 ? (
            <p className="text-gray-600">No hay rutinas físicas registradas.</p>
          ) : (
            rutinasFisicas.map((r) => (
              <div key={r.id_rutina} className="p-4 bg-white text-black shadow rounded mb-2">
                <p><strong>Fecha:</strong> {r.fecha}</p>
                <p><strong>Comentario Deportista:</strong> {r.comentario_deportista}</p>
                <p><strong>Comentario Entrenador:</strong> {r.comentario_entrenador}</p>
              </div>
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2 text-black">Rutinas Específicas</h2>
          {rutinasEspecificas.length === 0 ? (
            <p className="text-gray-600">No hay rutinas específicas registradas.</p>
          ) : (
            rutinasEspecificas.map((r) => (
              <div key={r.id_rutina} className="p-4 bg-white text-black shadow rounded mb-2">
                <p><strong>Fecha:</strong> {r.fecha}</p>
                <p><strong>Comentario Deportista:</strong> {r.comentario_deportista}</p>
                <p><strong>Comentario Entrenador:</strong> {r.comentario_entrenador}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
