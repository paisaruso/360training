const express = require("express");
const configureApp = require("./config/appConfig");
const configureSession = require("./middleware/session");
const configureAuth = require("./config/auth");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const deporteRoutes = require("./routes/deporte");
const deportistaRoutes = require("./routes/deportista");
const entrenadorRoutes = require("./routes/entrenador");

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

// Rutas de usuarios (routes/usuarioRoutes.js)
app.use("/api/usuarios", usuarioRoutes);

app.use("/api/deportes", deporteRoutes);
app.use("/api/deportistas", deportistaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
