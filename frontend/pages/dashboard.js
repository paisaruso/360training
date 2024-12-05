import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      //const email = localStorage.getItem('email'); // Obtén el email del usuario almacenado
      const response = await fetch(`http://localhost:5000/api/user-info`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setUserData(data); // Guardar los datos del usuario
      } else {
        console.error('Error obteniendo datos del usuario:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <p>Cargando datos del usuario...</p>;

  if (!userData) return <p>No se pudieron cargar los datos del usuario.</p>;

  const { user, additionalInfo } = userData;

  return (
    <div className="dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-500 mb-4">Bienvenido al Dashboard</h1>
      <Link href="http://localhost:5000/salir">
        <button className="w-full p-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 mb-6">
          Fin de Sesión
        </button>
      </Link>

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
          <strong>Fecha de Registro:</strong> {new Date(user.fecha_registro).toLocaleString()}
        </p>

        {user.tipo_usuario === 'Deportista' && additionalInfo && (
          <>
            <h3 className="text-lg font-semibold mt-4">Información de Deportista</h3>
            <p>
              <strong>Fecha de Nacimiento:</strong> {additionalInfo.fecha_nacimiento}
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
              <strong>Nivel de Experiencia:</strong> {additionalInfo.nivel_experiencia}
            </p>
            <p>
              <strong>Deporte:</strong> {additionalInfo.id_deporte}
            </p>
          </>
        )}

        {user.tipo_usuario === 'Entrenador' && additionalInfo && (
          <>
            <h3 className="text-lg font-semibold mt-4">Información de Entrenador</h3>
            <p>
              <strong>Especialidad:</strong> {additionalInfo.especialidad}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
