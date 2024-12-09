require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // Importa la configuración de la base de datos
const { auth } = require("express-openid-connect");
const { requiresAuth } = require("express-openid-connect");
const session = require("express-session"); // Middleware para manejo de sesiones
const pgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');

const port = process.env.PORT;



//middleware
// Configuración del middleware CORS
app.use(
  cors({
    origin: "http://localhost:3000", // URL del frontend
    credentials: true, // Habilita el envío de cookies o credenciales
  })
);
// Configura el middleware para parsear las cookies
app.use(cookieParser());
app.use(
  session({
    store: new pgSession({
      pool, // Usa la conexión existente
      tableName: 'session',
    }),
    secret: process.env.AUTH0_SECRET || "supersecret", // Clave Secreta
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 día
      httpOnly: true, // Aumenta la seguridad al no permitir acceso desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo con HTTPS en producción
      sameSite: "none", // Asegura que las cookies se envíen entre dominios
    },
  })
);

app.use(express.json()); //req.body



const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Ruta de callback (después de login)
app.get("/callback", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } else {
    console.log("Aqui si entro");
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged sup in" : "Logged out");
});

app.get("/logout", (req, res) => {
  console.log("Usuario sacado");
  const returnTo = process.env.BASE_URL || "http://localhost:5000";
  res.oidc.logout({ returnTo });
});

app.get("/salir", (req, res) => {
  // Limpia las cookies relacionadas con la sesión de Auth0
  res.clearCookie("appSession"); 
  res.clearCookie("auth_verification");
  res.clearCookie("_auth_verification");
  res.clearCookie("auth0.is.authenticated"); // Cookie específica de Auth0, si existe

  // borra cualquier otro dato de sesión como sesiones de Express
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
      }
    });
  }
  console.log("Borro las cookies");
  // Redirige al usuario a la página inicial
  res.redirect(`${process.env.FRONTEND_URL}`);
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.post("/api/check-user", async (req, res) => {
  const { email } = req.body;
  req.session.userEmail = email;

  try {
    // Realizas la consulta de API de usuario
    const result = await pool.query(
      "SELECT id_usuario FROM Usuarios WHERE correo_electronico = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("Usuario sin email", email);
      return res.json({ registered: false });
    }
    res.json({ registered: true });
  } catch (error) {
    console.error("Error verificando usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/dashboard-redirect", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Correo no proporcionado.");
  }

  // Configurar la sesión
  req.session.userEmail = email;

  console.log("Correo guardado en sesión:", req.session.userEmail);

  // Redirigir al dashboard del frontend
  res.redirect(`http://localhost:3000/dashboard?sid=${req.session.id}`);
});



//obtener data del usuario
// Endpoint para obtener datos del usuario
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
    }

    res.json({ user, additionalInfo });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Función para obtener datos de sesión desde la base de datos
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



// Importa las rutas
const deporteRoutes = require("./routes/deporte");
const usuarioRoutes = require("./routes/usuario");
const deportistaRoutes = require("./routes/deportista");
const entrenadorRoutes = require("./routes/entrenador");
const rutinaRoutes = require("./routes/rutina");
const ejercicioRoutes = require("./routes/ejercicio");
const asignacionEjercicioRoutes = require("./routes/asignacionEjercicio");

// Usa las rutas
app.use("/api/deportes", deporteRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/deportistas", deportistaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/rutina", rutinaRoutes);
app.use("/api/ejercicio", ejercicioRoutes);
app.use("/api/asignacion_ejercicio", asignacionEjercicioRoutes);

app.listen(port, () => {
  console.log(`el servidor inicio en el puerto:${port}`);
});
