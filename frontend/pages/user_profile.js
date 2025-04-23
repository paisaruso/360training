import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ComentariosGenerales from "../components/ComentariosGenerales";
import ComentariosFisicos from "../components/ComentariosFisicos";
import ComentariosEspecificos from "../components/ComentariosEspecificos";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [comentario, setComentario] = useState("");
  const [idEntrenador, setIdEntrenador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seccion, setSeccion] = useState("generales");

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const cargarPerfil = async () => {
      const sid = localStorage.getItem("sid");
      const id_usuario = localStorage.getItem("id_usuario");
      const idLocal = localStorage.getItem("id_deportista");
      const idDeportista = router.query.id || idLocal;

      if (!sid || !id_usuario) {
        setError("Sesión inválida.");
        router.push("/");
        return;
      }

      try {
        const sessionRes = await fetch(
          `https://three60training-jp4i.onrender.com/api/user-session?sid=${sid}`,
          { credentials: "include" }
        );
        if (!sessionRes.ok) throw new Error("Sesión expirada.");
        const session = await sessionRes.json();

        const infoRes = await fetch(
          `https://three60training-jp4i.onrender.com/api/user-info?email=${session.email}`
        );
        if (!infoRes.ok) throw new Error("Usuario no encontrado.");
        const userInfo = await infoRes.json();

        setTipoUsuario(userInfo.user.tipo_usuario);

        if (userInfo.user.tipo_usuario === "Entrenador") {
          const id_entrenador = userInfo?.additionalInfo?.id_entrenador;
          if (!id_entrenador) throw new Error("No se pudo obtener el ID del entrenador.");
          setIdEntrenador(id_entrenador);
        }

        if (idDeportista) {
          console.log("🔁 Cargando datos del deportista con ID:", idDeportista);
          const res = await fetch(
            `https://three60training-jp4i.onrender.com/api/deportistas/${idDeportista}`
          );
          if (!res.ok) throw new Error("No se pudo cargar el perfil del deportista.");
          const deportistaData = await res.json();
          setUserData(deportistaData);
        } else {
          console.warn("⚠️ No se encontró ID para cargar perfil.");
          setUserData(userInfo);
        }
      } catch (err) {
        console.error("❌", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [router.isReady, router.query.id]);

  const crearNotificacion = async (id) => {
    try {
      const notiRes = await fetch("http://localhost:5000/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: parseInt(id),
          mensaje: "🔔 Tienes un nuevo comentario de tu entrenador.",
          tipo: "comentario",
        }),
      });

      if (!notiRes.ok) {
        console.warn("⚠️ No se pudo crear la notificación.");
      } else {
        console.log("✅ Notificación creada con éxito.");
      }
    } catch (err) {
      console.error("❌ Error al crear notificación:", err);
    }
  };

  const guardarComentario = async () => {
    const idDeportista = router.query.id || localStorage.getItem("id_deportista");
    if (!idDeportista || !comentario || !idEntrenador) return;

    const payload = {
      id_entrenador: idEntrenador,
      id_deportista: parseInt(idDeportista),
      contenido: comentario,
    };

    try {
      const res = await fetch("https://three60training-jp4i.onrender.com/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar comentario.");

      alert("✅ Comentario guardado.");
      setComentario("");

      await crearNotificacion(idDeportista);
    } catch (error) {
      alert("❌ No se pudo guardar el comentario.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando perfil...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!userData) return <p className="text-center">No se encontraron datos.</p>;

  const idFinal = router.query.id || localStorage.getItem("id_deportista");

  return (
    <div className="user-profile p-6 bg-gray-100 min-h-screen flex flex-col">
      <div className="user-content relative z-10">
        <h1 className="text-2xl font-bold text-green-500 mb-4">Perfil de Usuario</h1>
        <div className="user-info p-4 bg-black rounded-lg shadow-md text-white">
          <p><strong>Nombre:</strong> {userData.user?.nombre || userData.nombre_usuario}</p>
          <p><strong>Correo:</strong> {userData.user?.correo_electronico || "No disponible"}</p>
        </div>

        {tipoUsuario === "Entrenador" && idFinal && (
          <div className="mt-6 bg-white p-4 rounded shadow-md">
            <h2 className="font-semibold text-black mb-2">Comentario General al Deportista</h2>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-black"
              rows={4}
              placeholder="Escribe tu comentario general..."
            />
            <button
              onClick={guardarComentario}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Comentario
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          {["generales", "fisicos", "especificos"].map((sec) => (
            <button
              key={sec}
              onClick={() => setSeccion(sec)}
              className={`px-4 py-2 rounded ${
                seccion === sec ? "bg-green-600 text-white" : "bg-gray-200 text-black"
              }`}
            >
              Comentarios {sec.charAt(0).toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {seccion === "generales" && <ComentariosGenerales idDeportista={idFinal} />}
          {seccion === "fisicos" && <ComentariosFisicos idDeportista={idFinal} />}
          {seccion === "especificos" && <ComentariosEspecificos idDeportista={idFinal} />}
        </div>

        <div className="flex justify-center mt-10">
          <Link href={tipoUsuario === "Entrenador" ? "/deportista" : "/dashboard"}>
            <button className="w-28 p-2 bg-green-600 text-white rounded hover:bg-green-700">
              Volver
            </button>
          </Link>
        </div>
      </div>

      <div
        className="w-full flex-grow bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/arco5.jpg')` }}
      />
    </div>
  );
};

export default UserProfile;
