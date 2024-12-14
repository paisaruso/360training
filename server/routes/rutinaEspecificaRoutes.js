const express = require('express');
const router = express.Router();
const {
    getAllRutinasEspecificas,
    getRutinaEspecificaCompleta,
    createRutinaEspecifica,
    updateRutinaEspecifica,
    deleteRutinaEspecifica,
} = require('../controllers/rutinaEspecificaController');

// Rutas
router.get('/', getAllRutinasEspecificas);
router.get('/:id', getRutinaEspecificaCompleta);
router.post('/', createRutinaEspecifica);
router.put('/:id', updateRutinaEspecifica);
router.delete('/:id', deleteRutinaEspecifica);

module.exports = router;
