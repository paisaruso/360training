import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Intermedio() {
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    if (!email) {
      router.push('/'); // Si no hay correo, redirige al inicio
      return;
    }

    // Mostrar el mensaje y redirigir después de unos segundos
    setTimeout(() => {
      router.push(`/registro?email=${email}`);
    }, 3000); // Redirigir después de 3 segundos
  }, [email, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Correo no registrado</h2>
        <p className="text-gray-600">Por favor, regístrate para continuar.</p>
        <p className="text-gray-800 mt-2">{email}</p>
        <button
          onClick={() => router.push(`/registro?email=${email}`)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ir al registro ahora
        </button>
      </div>
    </div>
  );
}
