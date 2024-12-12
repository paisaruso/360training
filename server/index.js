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

/*//Metodo para observar la solicitud de API's
app.use((req, res, next) => {
  console.log(`Solicitud entrante: ${req.method} ${req.url}`);
  console.log("Parámetros:", req.query);
  next();
});*/

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

app.get("/api/user-info", async (req, res) => {
  const { email } = req.query; // identificamos al usuario por su correo electrónico


  if (!email) {
    //console.log("No email");
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
    //console.log("Datos user:", user);
    let additionalInfo = null;

    // Según el tipo de usuario, obtenemos información adicional
    if (user.tipo_usuario === "Deportista") {
      const athleteResult = await pool.query(
        "SELECT fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte FROM Deportistas WHERE id_usuario = $1",
        [user.id_usuario]
      );
      additionalInfo = athleteResult.rows[0] || null;
    } else if (user.tipo_usuario === "Entrenador") {
      const coachResult = await pool.query(
        "SELECT especialidad FROM Entrenadores WHERE id_usuario = $1",
        [user.id_usuario]
      );
      
      additionalInfo = coachResult.rows[0] || null;
      //console.log("Datos adi: ", additionalInfo);
    }

    res.json({ user, additionalInfo });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Rutas de usuarios (routes/usuarioRoutes.js)
app.use("/api/usuarios", usuarioRoutes);

app.use("/api/deportes", deporteRoutes);
app.use("/api/deportistas", deportistaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
