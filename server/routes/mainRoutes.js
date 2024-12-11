const express = require("express");
const usuarioRoutes = require("./usuarioRoutes");

const router = express.Router();

// Rutas principales
router.use("/usuarios", usuarioRoutes);

module.exports = router;