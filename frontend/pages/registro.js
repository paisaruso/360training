import { useState, useEffect } from "react";

export default function Registro() {
    const [deportes, setDeportes] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        correo_electronico: "",
        contrasena: "",
        tipo_usuario: "Deportista",
        fecha_nacimiento: "",
        sexo: "",
        peso: "",
        altura: "",
        nivel_experiencia: "",
        especialidad: "",
        id_deporte: ""
    });

    useEffect(() => {
        // Obtener lista de deportes desde el backend
        const fetchDeportes = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/deportes");
                const data = await response.json();
                setDeportes(data);
            } catch (error) {
                console.error("Error al obtener los deportes:", error);
            }
        };
        fetchDeportes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
            const response = await fetch("http://localhost:5000/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    correo_electronico: formData.correo_electronico,
                    contrasena: formData.contrasena,
                    tipo_usuario: formData.tipo_usuario,
                }),
            });
      
            const usuario = await response.json();
            if (!response.ok) throw new Error("Error en el registro de usuario");

            if (formData.tipo_usuario === "Deportista") {
                await fetch("http://localhost:5000/api/deportistas", {
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
                    }),
                });
            } else if (formData.tipo_usuario === "Entrenador") {
                await fetch("http://localhost:5000/api/entrenadores", {
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg p-8 bg-white shadow-md rounded-md">
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
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input 
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sexo</label>
                                <select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                                >
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
                                <input
                                    type="number"
                                    name="peso"
                                    value={formData.peso}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
                                <input
                                    type="number"
                                    name="altura"
                                    value={formData.altura}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nivel de Experiencia</label>
                                <input
                                    type="text"
                                    name="nivel_experiencia"
                                    value={formData.nivel_experiencia}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md text-gray-800"
                                />
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

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}
