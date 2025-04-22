import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [role, setRole] = useState<"Deportista" | "Entrenador">("Deportista");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || "Deportista"; 
    setRole(userRole as "Deportista" | "Entrenador");
  }, []);

  // Páginas donde NO queremos mostrar el Sidebar
  const noSidebarPages = ["/", "/registro"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mostrar el Sidebar solo si no estamos en login o registro */}
      {!noSidebarPages.includes(router.pathname) && (
        <div className="hidden md:block w-64">
          <Sidebar/>
        </div>
      )}

      {/* Contenedor principal con ajuste responsivo */}
      <div className={`flex-1 flex justify-center items-center p-6 ${!noSidebarPages.includes(router.pathname) ? "ml-64" : ""}`}>
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}

export default MyApp;


