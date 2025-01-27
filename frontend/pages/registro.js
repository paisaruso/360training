import { useState, useEffect } from "react";

export default function Registro() {
  const [deportes, setDeportes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    correo_electronico: "",
    contrasena: "",
    tipo_usuario: "Deportista",
    club: "",
    fecha_nacimiento: "",
    sexo: "",
    peso: "",
    altura: "",
    nivel_experiencia: "",
    especialidad: "",
    id_deporte: "",
    id_entrenador: "",
  });
  const [contrasenaError, setContrasenaError] = useState("");

  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) {
      setFormData((prevData) => ({ ...prevData, correo_electronico: email }));
    }

    const fetchDeportes = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/deportes");
        const data = await response.json();
        setDeportes(data);
      } catch (error) {
        console.error("Error al obtener los deportes:", error);
      }
    };

    const fetchEntrenadores = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/entrenadores");
        const data = await response.json();
        setEntrenadores(data);
      } catch (error) {
        console.error("Error al obtener los entrenadores:", error);
      }
    };

    fetchDeportes();
    fetchEntrenadores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.contrasena)) {
      setContrasenaError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

    try {
      const response = await fetch("https://three60training-jp4i.onrender.com/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo_electronico: formData.correo_electronico,
          contrasena: formData.contrasena,
          tipo_usuario: formData.tipo_usuario,
          club: formData.club,
        }),
      });

      const usuario = await response.json();
      if (!response.ok) throw new Error("Error en el registro de usuario");

      if (formData.tipo_usuario === "Deportista") {
        await fetch("https://three60training-jp4i.onrender.com/api/deportistas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            fecha_nacimiento: formData.fecha_nacimiento,
            sexo: formData.sexo,
            peso: formData.peso,
            altura: formData.altura,
            nivel_experiencia: formData.nivel_experiencia,
            id_deporte: formData.id_deporte,
            id_entrenador: formData.id_entrenador,
          }),
        });
        await fetch("https://three60training-jp4i.onrender.com/api/usuario-deporte", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            id_deporte: formData.id_deporte,
          }),
        });
      } else if (formData.tipo_usuario === "Entrenador") {
        await fetch("https://three60training-jp4i.onrender.com/api/entrenadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            especialidad: formData.especialidad,
          }),
        });
      }

      alert("Registro exitoso");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error en el registro");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Contenedor para la imagen izquierda */}
      <div
        className="w-1/3 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/arco3.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Contenedor para el formulario (en el centro) */}
      <div className="w-1/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="correo_electronico"
                value={formData.correo_electronico}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña: Mínimo 8 caracteres, una mayúscula y un número
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
              />
              {contrasenaError && <p className="text-red-500 text-sm">{contrasenaError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Club</label>
              <input
                type="text"
                name="club"
                value={formData.club}
                onChange={handleChange}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
              <select
                name="tipo_usuario"
                value={formData.tipo_usuario}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
              >
                <option value="Deportista">Deportista</option>
                <option value="Entrenador">Entrenador</option>
              </select>
            </div>

            {formData.tipo_usuario === "Deportista" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  />
                </div>

                {/* Otros campos para Deportista */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexo</label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Peso</label>
                  <input
                    type="text"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Altura</label>
                  <input
                    type="text"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nivel de Experiencia</label>
                  <select
                    name="nivel_experiencia"
                    value={formData.nivel_experiencia}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  >
                    <option value="">Seleccione un nivel</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Medio">Medio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Deporte</label>
                  <select
                    name="id_deporte"
                    value={formData.id_deporte}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  >
                    <option value="">Seleccione un deporte</option>
                    {deportes.map((deporte) => (
                      <option key={deporte.id_deporte} value={deporte.id_deporte}>
                        {deporte.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Entrenador</label>
                  <select
                    name="id_entrenador"
                    value={formData.id_entrenador}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                  >
                    <option value="">Seleccione un entrenador</option>
                    {entrenadores.map((entrenador) => (
                      <option key={entrenador.id_entrenador} value={entrenador.id_entrenador}>
                        {entrenador.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {formData.tipo_usuario === "Entrenador" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                />
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenedor para la imagen derecha */}
      <div
        className="w-1/3 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/arco2.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}
