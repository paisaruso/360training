import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const handleLogout = async () => {
    // Redirige a la ruta de logout en el backend
    window.location.href = 'http://localhost:5000/logout';
  };

  return (
    <div className="dashboard">
      <h1>Bienvenido al Dashboard</h1>
      <button onClick={handleLogout} className="btn-logout">
        Cerrar Sesión
      </button>
      <Link href="http://localhost:5000/logout">
            <button className="w-full p-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
              Fin de Sesión
            </button>
        </Link>
    </div>
  );
};

export default Dashboard;
