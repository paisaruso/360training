// routes/rutina_fisica_routes.js
const express = require('express');
const router = express.Router();
const {
    createRutinaFisica,
    getAllRutinasFisicas,
    getRutinaFisicaById,
    getRutinasFisicasByDeportista,
    updateRutinaFisica,
    deleteRutinaFisica,
    getRutinaFisicaCompleta,
} = require('../controllers/rutinaFisicaController');

// Crear una nueva rutina física
router.post('/', createRutinaFisica);

// Obtener todas las rutinas físicas (opcionalmente filtradas por deportista/fecha)
router.get('/', getAllRutinasFisicas);

// Obtener los detalles de una rutina específica
router.get('/:id', getRutinaFisicaById);

// Obtener todas las rutinas de un deportista
router.get('/deportista/:id_deportista', getRutinasFisicasByDeportista);

// Actualizar comentarios en una rutina física
router.put('/:id', updateRutinaFisica);

// Eliminar una rutina física
router.delete('/:id', deleteRutinaFisica);

//Obtener rutina fisica completa con ejercicios
router.get('/:id/completa', getRutinaFisicaCompleta);

module.exports = router;
