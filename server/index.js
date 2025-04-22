const express = require("express");
const pool = require("./db");
const configureApp = require("./config/appConfig");
const configureSession = require("./middleware/session");
const configureAuth = require("./config/auth");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const deporteRoutes = require("./routes/deporteRoutes");
const deportistaRoutes = require("./routes/deportistaRoutes");
const entrenadorRoutes = require("./routes/entrenadorRoutes");
const usuarioDeporteRoutes = require("./routes/usuarioDeporteRoutes");
const tipoEjercicioRoutes = require("./routes/tipoEjercicioRoutes");
const rutinaFisicaRoutes = require("./routes/rutinaFisicaRoutes");
const ejercicioFisicoRoutes = require("./routes/ejercicioFisicoRoutes");
const tipoEjercicioEspecificoRoutes = require("./routes/tipoEjercicioEspecificoRoutes");
const rutinaEspecificaRoutes = require("./routes/rutinaEspecificaRoutes");
const ejercicioDisparoRoutes = require("./routes/ejercicioDisparoRoutes");
const comentariosRoutes = require("./routes/comentariosRoutes");
const notificacionesRoutes = require("./routes/notificacionesRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración base (CORS, JSON y otros middlewares)
configureApp(app);

// Configuración de sesiones (middleware/session.js)
configureSession(app);

// Configuración de Auth0 (config/auth.js)
configureAuth(app);

// Rutas de autenticación (routes/authRoutes.js)
app.use("/auth", authRoutes);

/* // Método para observar la solicitud de API's
app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  console.log("Parámetros:", req.query);
  next();
}); */

const getSessionData = async (sid) => {
  const result = await pool.query("SELECT sess FROM session WHERE sid = $1", [sid]);
  return result.rows[0]?.sess || null; // Retorna el JSON almacenado en el campo `sess`
};

// Endpoint para obtener datos de sesión
app.get("/api/user-session", async (req, res) => {
  const sid = req.query.sid; // Obtenemos el SID del query string
  if (!sid) {
    return res.status(400).json({ error: "Session ID no proporcionado" });
  }
  try {
    const sessionData = await getSessionData(sid);
    if (!sessionData || !sessionData.userEmail) {
      return res.status(401).json({ error: "Sesión no válida o expirada" });
    }
    res.json({ email: sessionData.userEmail }); // Retorna el correo almacenado en la sesión
  } catch (error) {
    console.error("Error obteniendo datos de sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint para obtener información del usuario
app.get("/api/user-info", async (req, res) => {
  const { email } = req.query; // Identificamos al usuario por su correo electrónico

  if (!email) {
    return res.status(401).json({ error: "No hay usuario autenticado" });
  }

  try {
    // Consulta básica de datos del usuario
    const userResult = await pool.query(
      "SELECT * FROM Usuarios WHERE correo_electronico = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];
    let additionalInfo = null;

    // Según el tipo de usuario, obtenemos información adicional
    if (user.tipo_usuario === "Deportista") {
      const athleteResult = await pool.query(
        "SELECT d.fecha_nacimiento, d.sexo, d.peso, d.altura, d.nivel_experiencia, d.id_deporte, u.nombre AS nombre_entrenador FROM Deportistas d LEFT JOIN Entrenadores e ON d.id_entrenador = e.id_entrenador LEFT JOIN Usuarios u ON e.id_usuario = u.id_usuario WHERE d.id_usuario = $1",
        [user.id_usuario]
      );
      additionalInfo = athleteResult.rows[0] || null;
    } else if (user.tipo_usuario === "Entrenador") {
      const coachResult = await pool.query(
        "SELECT especialidad FROM Entrenadores WHERE id_usuario = $1",
        [user.id_usuario]
      );
      additionalInfo = coachResult.rows[0] || null;
    }

    res.json({ user, additionalInfo });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 🔹 NUEVO: Endpoint para obtener el id_deportista desde el email del usuario
app.get("/api/get-id-deportista", async (req, res) => {
  const { email } = req.query; // Se obtiene el email del usuario autenticado

  if (!email) {
    return res.status(400).json({ error: "Email del usuario no proporcionado" });
  }

  try {
    // Consulta en la base de datos para obtener el ID del deportista
    const result = await pool.query(
      "SELECT id_deportista FROM Deportistas d JOIN Usuarios u ON d.id_usuario = u.id_usuario WHERE u.correo_electronico = $1",
      [email]
    );

    if (result.rows.length > 0) {
      res.json({ id_deportista: result.rows[0].id_deportista });
    } else {
      res.status(404).json({ error: "No se encontró un deportista con ese email" });
    }
  } catch (error) {
    console.error("Error obteniendo el ID del deportista:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
// 🔹 NUEVO: Endpoint para obtener el id_entrenador desde el email del usuario
app.get("/api/get-id-entrenador", async (req, res) => {
  const { email } = req.query; // Se obtiene el email del usuario autenticado

  if (!email) {
    return res.status(400).json({ error: "Email del usuario no proporcionado" });
  }

  try {
    // Consulta en la base de datos para obtener el ID del entrenador
    const result = await pool.query(
      "SELECT id_entrenador FROM Entrenadores e JOIN Usuarios u ON e.id_usuario = u.id_usuario WHERE u.correo_electronico = $1",
      [email]
    );

    if (result.rows.length > 0) {
      res.json({ id_entrenador: result.rows[0].id_entrenador });
    } else {
      res.status(404).json({ error: "No se encontró un entrenador con ese email" });
    }
  } catch (error) {
    console.error("Error obteniendo el ID del entrenador:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Rutas de usuarios (routes/usuarioRoutes.js)
app.use("/api/usuarios", usuarioRoutes);

app.use("/api/deportes", deporteRoutes);
app.use("/api/deportistas", deportistaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/usuario_deporte", usuarioDeporteRoutes);
app.use("/api/tipo_ejercicio", tipoEjercicioRoutes);
app.use("/api/rutina_fisica", rutinaFisicaRoutes);
app.use("/api/ejercicio_fisico", ejercicioFisicoRoutes);
app.use("/api/tipo_ejercicio_especifico", tipoEjercicioEspecificoRoutes);
app.use("/api/rutina_especifica", rutinaEspecificaRoutes);
app.use("/api/ejercicio_disparo", ejercicioDisparoRoutes);
app.use("/api/comentarios", comentariosRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/analytics", analyticsRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
