import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="mb-8">
          <img src="/favicon.ico" alt="Logo" className="w-20 h-20 mx-auto" />
        </div>

        {/* Encabezado con fondo de imagen */}
        <h1
          className="text-3xl font-extrabold text-white mb-6 bg-[url('/images/arco1.jpeg')] bg-cover bg-center rounded-lg p-4 shadow-md"
        >
          ¡Bienvenidos a TRAINING 360!
        </h1>

        {/* Descripción breve */}
        <p className="text-gray-600 mb-6">
          Únete a nuestra comunidad de deportistas y mejora tus habilidades con nosotros.
        </p>

        {/* Botones de navegación */}
        <div className="space-y-6">
          {/* Botón de registro */}
          <Link href="/registro" passHref>
            <button className="w-full p-4 bg-red-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition">
              Registrarse
            </button>
          </Link>

          {/* Botón de inicio de sesión con Auth0 */}
          <Link
            href="https://dev-f14ind7q3r0dcmx5.us.auth0.com/authorize?client_id=Vg645voh6o4ZDufaIsKiwKKyBLZVdwFi&redirect_uri=http://localhost:3000/dashboard&response_type=code&scope=openid%20profile%20email&prompt=login"
            passHref
          >
            <button className="w-full p-4 bg-blue-500 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition">
              Iniciar sesión
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
