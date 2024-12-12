const express = require('express');
const {
  obtenerEntrenadores,
  crearEntrenador,
  actualizarEntrenador,
  obtenerEntrenadorPorId,
  eliminarEntrenador,
  obtenerEntrenadoresParaSeleccion
} = require('../controllers/entrenadorController');

const router = express.Router();

// Rutas de entrenadores
router.get('/', obtenerEntrenadores);
router.post('/', crearEntrenador);
router.put('/:id', actualizarEntrenador);
router.get('/:id', obtenerEntrenadorPorId);
router.delete('/:id', eliminarEntrenador);
router.get('/seleccion', obtenerEntrenadoresParaSeleccion);

module.exports = router;
