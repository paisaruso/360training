const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const pool = require("../db"); // Asegúrate de ajustar la ruta a tu configuración
const session = require("express-session");

const router = express.Router();

// Ruta de callback
exports.callback = (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } else {
    res.redirect("/");
  }
};

// Ruta para logout
exports.logout = (req, res) => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL || "http://localhost:5000",
  });
};

// Ruta para limpiar sesión y cookies
exports.salir = (req, res) => {
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
};

// Ruta para obtener perfil del usuario
exports.getProfile = requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
};

exports.checkUser = async (req, res) => {
  const { email } = req.body;
  req.session.userEmail = email;

  try {
    // Realiza la consulta de API de usuario
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
};

// Redirigir al dashboard
exports.dashboardRedirect = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Correo no proporcionado.");
  }

  // Configurar la sesión
  req.session.userEmail = email;

  console.log("Correo guardado en sesión:", req.session.userEmail);

  // Redirigir al dashboard del frontend
  res.redirect(`http://localhost:3000/dashboard?sid=${req.session.id}`);
};


