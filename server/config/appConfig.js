const express = require("express");
const cors = require("cors");

// Configuración base de la aplicación
function configureApp(app) {
 

  // Middleware para manejo de CORS
  app.use(
    cors({
      origin: "http://localhost:3000", // URL del frontend
      credentials: true, // Habilita el envío de cookies o credenciales
    })
  );
  // Middleware para parsing de JSON y formularios
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

}

module.exports = configureApp;