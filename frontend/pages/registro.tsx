import { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // ✅ Importar los íconos
import { useRouter } from "next/router";
import SelectEntrenador from "../components/SelectEntrenador";


export default function Registro() {
  const [deportes, setDeportes] = useState<{ id_deporte: number; nombre: string }[]>([]);
  const [entrenadores, setEntrenadores] = useState<{ id_entrenador: number; nombre: string }[]>([]);
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
    id_deporte: "",
    id_entrenador: "" as number | "", // ✅ Asegurar que esta propiedad existe
    numero_documento: "",
    especialidad: "",
  });
  
  const [showPassword, setShowPassword] = useState(false); // ✅ Estado para alternar visibilidad de la clave
  const [contrasenaError, setContrasenaError] = useState("");
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) {
      setFormData((prevData) => ({ ...prevData, correo_electronico: email }));
    }
    const fetchDeportes = async () => {
      try {
        const response = await fetch("https://three60training-jp4i.onrender.com/api/deportes");
        if (!response.ok) throw new Error("Error al obtener deportes");
        
        const data: { id_deporte: number; nombre: string }[] = await response.json();
        setDeportes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener los deportes:", error);
      }
    };
    if (formData.tipo_usuario === "Deportista") {
      const fetchEntrenadores = async () => {
        try {
          console.log("🔎 Iniciando fetch de entrenadores...");
      
          const response = await fetch("https://three60training-jp4i.onrender.com/api/entrenadores");
      
          console.log("📥 Respuesta recibida:", response);
      
          if (!response.ok) {
            throw new Error(`⚠️ Error al obtener entrenadores. Código de estado: ${response.status}`);
          }
      
          const data = await response.json();
      
          console.log("📌 Lista de entrenadores recibida:", data);
      
          if (!Array.isArray(data)) {
            console.error("❌ Error: Los datos recibidos no son un array.");
            return;
          }
      
          // Verificamos si los datos tienen la estructura correcta
          const entrenadoresValidos = data.filter((entrenador) =>
            typeof entrenador.id_entrenador === "number" && typeof entrenador.nombre_usuario === "string"
          );
      
          if (entrenadoresValidos.length === 0) {
            console.warn("⚠️ Atención: No se encontraron entrenadores válidos en la API.");
          } else {
            console.log("✅ Entrenadores filtrados correctamente:", entrenadoresValidos);
          }
      
          setEntrenadores(entrenadoresValidos);
      
          console.log("✅ Estado actualizado con entrenadores:", entrenadoresValidos);
        } catch (error) {
          console.error("❌ Error al obtener los entrenadores:", error);
        }
      };
         
    fetchDeportes();
    fetchEntrenadores();
    }else{
      setEntrenadores([]); // ✅ Limpia la lista si el usuario no es "Deportista"
    }
  }, [formData.tipo_usuario]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_+=]{8,}$/;
    console.log("Validando contraseña:", password); // Debugging
    return passwordRegex.test(password);
  };
  
  const router = useRouter();
  const handleGoToLogin = () => {
    router.push("/"); // Redirigir al inicio de sesión
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📌 Botón de registro presionado...");
    
    // Validar si el correo tiene un formato correcto
    if (!validateEmail(formData.correo_electronico)) {
      console.log("❌ Error: Correo no válido");
      alert("Ingrese un correo válido.");
      return;
    }

    // Validar si la contraseña es segura
    if (!validatePassword(formData.contrasena)) {
      console.log("❌ Error: Contraseña no válida");
      console.log("Contraseña ingresada:", formData.contrasena);
      console.log("¿Contraseña válida?", validatePassword(formData.contrasena));
      alert("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

    // Validación del número de documento
    const validateNumeroDocumento = (numero: string): boolean => {
      const documentoRegex = /^[0-9]{7,10}$/; // Asegura entre 7 y 10 dígitos numéricos
      return documentoRegex.test(numero);
    };

    if (!validateNumeroDocumento(formData.numero_documento)) {
      console.log("❌ Error: Número de documento inválido");
      alert("Ingrese un número de documento válido (entre 7 y 10 dígitos).");
      return;
    }
    // Verificar si el correo ya está registrado
  try {
    console.log(`🔎 Verificando si el correo ya existe: ${formData.correo_electronico}`);
      const emailCheckResponse = await fetch(
       `https://three60training-jp4i.onrender.com/api/usuarios?email=${formData.correo_electronico}`
       );
      const emailCheckData = await emailCheckResponse.json();
      console.log("🔍 Respuesta de verificación de correo:", emailCheckData);
        
      if (emailCheckData.exists) {
        console.log("❌ Error: Correo ya registrado");
      alert("Este correo ya está registrado.");
      return;
      }
      } catch (error) {
      console.error("Error verificando el correo:", error);
      return;
  }
  // Verificar si el número de documento ya está registrado
    try {
      console.log("📤 Enviando datos a la API para registrar usuario...");
      const documentoCheckResponse = await fetch(
        `https://three60training-jp4i.onrender.com/api/usuarios?documento=${formData.numero_documento}`
      );
      const documentoCheckData = await documentoCheckResponse.json();
      if (documentoCheckData.exists) {
        alert("Este número de documento ya está registrado.");
        return;
      }
    } catch (error) {
      console.error("Error verificando el número de documento:", error);
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
          numero_documento: formData.numero_documento,
        }),
      });
      console.log("📥 Respuesta de registro de usuario recibida...");
      if (!response.ok) throw new Error("Error en el registro de usuario");
      const usuario = await response.json();
      console.log("✅ Usuario registrado con éxito:", usuario);

      if (formData.tipo_usuario === "Deportista") {
        console.log("📤 Registrando datos adicionales para Deportista...");
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
            numero_documento: formData.numero_documento,
          }),
        });
        console.log("✅ Deportista registrado con éxito.");
        await fetch("https://three60training-jp4i.onrender.com/api/usuario-deporte", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            id_deporte: formData.id_deporte,
          }),
        });
        console.log("✅ Relación usuario-deporte creada con éxito.");
      } else if (formData.tipo_usuario === "Entrenador") {
        console.log("📤 Registrando datos adicionales para Entrenador...");
        await fetch("https://three60training-jp4i.onrender.com/api/entrenadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            especialidad: formData.especialidad,
          }),
        });
        console.log("✅ Entrenador registrado con éxito.");
      }
      console.log("✅ Todo el proceso de registro finalizado.");
      alert("Registro exitoso. Redirigiendo a la página de inicio de sesión...");
      setTimeout(() => {
        router.push("/"); // ✅ Se usa un pequeño retraso para asegurar que la alerta se muestra correctamente
      }, 1000);
            
    } catch (error) {
      console.error("❌ Error en el proceso de registro:", error);
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
            <label className="block text-sm font-medium text-gray-700">Número de Documento</label>
            <input
              type="text"
              name="numero_documento"
              value={formData.numero_documento}
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
            <div className="relative">
    <label className="block text-sm font-medium text-gray-700">
       Contraseña: Mínimo 8 caracteres, una mayúscula y un número
    </label>
    <input                              
        type={showPassword ? "text" : "password"} 
        name="contrasena"
        value={formData.contrasena} // ✅ Asegura que se actualice en el estado
        onChange={handleChange} // ✅ Maneja cambios en el input
        className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800 pr-12"
    />
    {/* ✅ Ícono dentro del input, alineado a la derecha */}
    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-8 right-3 flex items-center justify-center w-5 h-full"
    >
    {showPassword ? (
        <AiFillEyeInvisible size={22} className="text-gray-500 hover:text-gray-700" />
    ) : (
        <AiFillEye size={22} className="text-gray-500 hover:text-gray-700" />
    )}
    </button>
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
                    className="p-3 border rounded-lg w-full bg-black text-white placeholder-gray-400"
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
                  {Array.isArray(deportes) && deportes.length > 0 ? (
                    deportes.map((deporte) => (
                      <option key={deporte.id_deporte} value={deporte.id_deporte}>
                        {deporte.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="">No hay deportes disponibles</option>
                  )}
                </select>
                </div>
                import SelectEntrenador from "../components/SelectEntrenador"; // ✅ Importar el nuevo componente

{/* Dentro del return, donde estaba el select anterior */}
<SelectEntrenador
  idEntrenador={formData.id_entrenador ? Number(formData.id_entrenador) : ""} // ✅ Convertimos a número si no está vacío
  onChange={handleChange}
/>

              </>
            )}
            {formData.tipo_usuario === "Entrenador" && (!formData.especialidad || formData.especialidad.trim() === "") && (
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
              <div className="flex justify-center mt-3">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Iniciar Sesión
              </button>
            </div>

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
