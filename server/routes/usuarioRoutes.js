const express = require("express");
const {
  getUsuarios,
  createUsuario,
  updateUsuario,  
  updateEmailPassword,  
  readUsuarioById,
  readUsuarioByEmail,
  deleteUsuario,
  getUserInfo,
  getUserSession,
} = require("../controllers/usuarioController");

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", getUsuarios);

// Ruta para crear un nuevo usuario
router.post("/", createUsuario);

// Ruta para actualizar un usuario existente
router.put("/:id", updateUsuario);

// Actualizar correo o contraseña
router.put("/actualizar-auth0/:id", updateEmailPassword);

// Leer un usuario por ID
router.get("/:id", readUsuarioById);

// Leer un usuario por email
router.get("/:email", readUsuarioByEmail);

// Ruta para eliminar un usuario
router.delete("/:id", deleteUsuario);

// Para obtener información del usuario
router.get("/user-info", getUserInfo); 

// Para obtener la sesión del usuario
router.get("/user-session", getUserSession); 

module.exports = router;
