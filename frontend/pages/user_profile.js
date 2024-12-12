import { useEffect, useState } from "react";
import Link from "next/link";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const sid = localStorage.getItem("sid"); // Leer el SID del almacenamiento local
      if (!sid) {
        console.error("No se encontró el SID en el navegador.");
        setLoading(false);
        return;
      }

      try {
        // Llamar a la API con el SID
        const response = await fetch(
          `https://three60training-jp4i.onrender.com/api/user-session?sid=${sid}`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los datos de la sesión.");
        }

        const sessionData = await response.json();

        if (!sessionData.email) {
          throw new Error("Sesión inválida o expirada.");
        }

        // Ahora que tenemos el email, obtener los datos del usuario
        const userInfoResponse = await fetch(
          `https://three60training-jp4i.onrender.com/api/user-info?email=${sessionData.email}`,
          { credentials: "include" }
        );

        if (!userInfoResponse.ok) {
          throw new Error("No se encontraron los datos del usuario.");
        }

        const userInfo = await userInfoResponse.json();
        setUserData(userInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Cargando perfil de usuario...</p>;

  if (!userData) return <p>No se encontraron datos del usuario.</p>;

  return (
    <div className="user-profile p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-500 mb-4">
        Perfil de Usuario
      </h1>
      <div className="user-info p-4 bg-black rounded-lg shadow-md">
        <p>
          <strong>Nombre:</strong> {userData.user.nombre}
        </p>
        <p>
          <strong>Correo Electrónico:</strong> {userData.user.correo_electronico}
        </p>
      </div>
      <div className="flex flex-row justify-center">
        <Link href="http://localhost:3000/dashboard">
        <button className="w-20 justify-center p-4 bg-green-600 text-white font-bold mt-8 rounded-md hover:bg-green-700 mb-6">
          Volver
        </button>
      </Link>
      </div>
      
    </div>
  );
};

export default UserProfile;
