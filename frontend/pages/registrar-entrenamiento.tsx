import { useRouter } from "next/router";

export default function RegistrarEntrenamiento() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Registrar Entrenamiento</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <button 
          className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
          onClick={() => router.push("/registrar-rutina-fisica")}
        >
          Registrar Rutina Física
        </button>
        <button 
          className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700" 
          onClick={() => router.push("/registrar-rutina-especifica")}
        >
          Registrar Rutina Específica
        </button>
      </div>
    </div>
  );
}
