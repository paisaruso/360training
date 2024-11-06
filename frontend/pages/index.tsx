import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-center">
      <div className="w-full max-w-lg p-8 ">
        <div className="mb-8">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-62 h-62 mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">¡Bienvenidos!</h1>
        <div className="flex flex-col space-y-4">
          <Link href="/registro">
            <button className="w-full p-4 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">
              Registrarse
            </button>
          </Link>
          <Link href="http://localhost:5000/login">
            <button className="w-full p-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
