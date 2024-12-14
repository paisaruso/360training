const express = require('express');
const {
    createEjercicioFisico,
    getEjerciciosByRutina,
    getEjercicioById,
    updateEjercicioFisico,
    deleteEjercicioFisico,
} = require('../controllers/ejercicioFisicoController');

const router = express.Router();

// Crear un nuevo ejercicio físico
router.post('/', createEjercicioFisico);

// Obtener todos los ejercicios de una rutina específica
router.get('/rutina/:id_rutina', getEjerciciosByRutina);

// Obtener los detalles de un ejercicio físico específico
router.get('/:id', getEjercicioById);

// Actualizar un ejercicio físico
router.put('/:id', updateEjercicioFisico);

// Eliminar un ejercicio físico
router.delete('/:id', deleteEjercicioFisico);

module.exports = router;
