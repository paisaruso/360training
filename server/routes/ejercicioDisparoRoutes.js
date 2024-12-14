const express = require('express');
const {
    createEjercicioDisparo,
    getAllEjerciciosDisparo,
    getEjercicioDisparoById,
    updateEjercicioDisparo,
    deleteEjercicioDisparo,
    getEjerciciosByRutinaEspecifica,
} = require('../controllers/ejercicioDisparoController');

const router = express.Router();

// Crear un nuevo ejercicio físico
router.post('/', createEjercicioDisparo);

//Obtener todos los ejercicios Disparo
router.get('/', getAllEjerciciosDisparo);

// Obtener todos los ejercicios de una rutina específica
router.get('/rutina/:id_rutina_especifica', getEjerciciosByRutinaEspecifica);

// Obtener los detalles de un ejercicio físico específico
router.get('/:id', getEjercicioDisparoById);

// Actualizar un ejercicio físico
router.put('/:id', updateEjercicioDisparo);

// Eliminar un ejercicio físico
router.delete('/:id', deleteEjercicioDisparo);

module.exports = router;