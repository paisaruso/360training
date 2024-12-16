const express = require('express');
const {
    createComentario,
    getComentariosByDeportista,
    updateComentario,
    deleteComentario,
} = require('../controllers/comentariosController');

const router = express.Router();

// Crear un comentario
router.post('/', createComentario);

// Obtener comentarios de un deportista
router.get('/deportista/:id_deportista', getComentariosByDeportista);

//Actualizar comentario
router.put('/:id', updateComentario);

// Eliminar un comentario (opcional)
router.delete('/:id_comentario', deleteComentario);

module.exports = router;
