const express = require('express');
const router = express.Router();
const {
    createTipoEjercicio,
    getAllTiposEjercicio,
    getTipoEjercicioById,
    updateTipoEjercicio,
    deleteTipoEjercicio,
} = require('../controllers/tipoEjercicioController');

// Crear un tipo de ejercicio
router.post('/', createTipoEjercicio);

// Obtener todos los tipos de ejercicio
router.get('/', getAllTiposEjercicio);

// Obtener un tipo de ejercicio por ID
router.get('/:id', getTipoEjercicioById);

// Actualizar un tipo de ejercicio
router.put('/:id', updateTipoEjercicio);

// Eliminar un tipo de ejercicio
router.delete('/:id', deleteTipoEjercicio);

module.exports = router;
