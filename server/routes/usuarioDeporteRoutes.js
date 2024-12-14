const express = require("express");
const router = express.Router();
const {
    asociarUsuarioDeporte,
    obtenerDeportesPorUsuario,
    eliminarAsociacionUsuarioDeporte,
} = require('../controllers/usuarioDeporteController');


// Ruta para asociar un usuario con un deporte
router.post("/", asociarUsuarioDeporte);

// Ruta para obtener los deportes asociados a un usuario
router.get("/:id_usuario", obtenerDeportesPorUsuario);

// Ruta para eliminar una asociación usuario-deporte
router.delete("/", eliminarAsociacionUsuarioDeporte);

module.exports = router;
