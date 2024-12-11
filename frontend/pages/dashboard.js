import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sid, setSid] = useState("");

  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sidFromQuery = queryParams.get("sid");
    if (sidFromQuery) {
      setSid(sidFromQuery);
      localStorage.setItem("sid", sidFromQuery); // Guardar el SID en almacenamiento local
    }
  }, []);

  const fetchUserEmail = async (sid) => {
    try {
      const response = await fetch(
        `https://three60training-jp4i.onrender.com/api/usuarios/user-session?sid=${sid}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) {
        return data.email; // Retorna el correo electrónico del usuario
      } else {
        console.error("Error obteniendo email:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return null;
    }
  };

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `https://three60training-jp4i.onrender.com/api/usuarios/user-info?email=${email}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(data); // Guardar los datos del usuario
      } else {
        console.error("Error obteniendo datos del usuario:", data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedSid = localStorage.getItem("sid");
    const currentSid = sid || storedSid;
    if (currentSid) {
      fetchUserEmail(currentSid).then((email) => {
        if (email) fetchUserData(email);
      });
    } else {
      setLoading(false);
    }
  }, [sid]);

  if (loading) return <p>Cargando datos del usuario...</p>;

  if (!userData) return <p>No se pudieron cargar los datos del usuario.</p>;

  const { user, additionalInfo } = userData;

  const navigateToProfile = () => {
    router.push("/user_profile");
  };

  return (
    <div className="dashboard p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold text-green-500 mb-4">
        Bienvenido al Dashboard
      </h1>
      <Link href="https://three60training-jp4i.onrender.com/auth/salir">
        <button className="w-full p-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 mb-6">
          Fin de Sesión
        </button>
      </Link>
      </div>
      

      <div className="user-info p-4 bg-black rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>
        <p>
          <strong>Nombre:</strong> {user.nombre}
        </p>
        <p>
          <strong>Correo Electrónico:</strong> {user.correo_electronico}
        </p>
        <p>
          <strong>Tipo de Usuario:</strong> {user.tipo_usuario}
        </p>
        <p>
          <strong>Fecha de Registro:</strong>{" "}
          {new Date(user.fecha_registro).toLocaleString()}
        </p>

        {user.tipo_usuario === "Deportista" && additionalInfo && (
          <>
            <h3 className="text-lg font-semibold mt-4">
              Información de Deportista
            </h3>
            <p>
              <strong>Fecha de Nacimiento:</strong>{" "}
              {additionalInfo.fecha_nacimiento}
            </p>
            <p>
              <strong>Sexo:</strong> {additionalInfo.sexo}
            </p>
            <p>
              <strong>Peso:</strong> {additionalInfo.peso} kg
            </p>
            <p>
              <strong>Altura:</strong> {additionalInfo.altura} m
            </p>
            <p>
              <strong>Nivel de Experiencia:</strong>{" "}
              {additionalInfo.nivel_experiencia}
            </p>
            <p>
              <strong>Deporte:</strong> {additionalInfo.id_deporte}
            </p>
          </>
        )}

        {user.tipo_usuario === "Entrenador" && additionalInfo && (
          <>
            <h3 className="text-lg font-semibold mt-4">
              Información de Entrenador
            </h3>
            <p>
              <strong>Especialidad:</strong> {additionalInfo.especialidad}
            </p>
          </>
        )}
      </div>
      <button
        onClick={navigateToProfile}
        className="p-4 bg-blue-600 text-white font-bold rounded-md mt-9 hover:bg-blue-700"
      >
        Ir a Perfil de Usuario
      </button>
    </div>
  );
};

export default Dashboard;
