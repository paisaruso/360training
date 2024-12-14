const express = require('express');
const router = express.Router();
const {
  getTiposEjercicio,
  getTipoEjercicioById,
  getTipoEjercicioByIdDeporte,
  createTipoEjercicio,
  updateTipoEjercicio,
  deleteTipoEjercicio,
} = require('../controllers/tipoEjercicioEspecificoController');

// Rutas
router.get('/', getTiposEjercicio);
router.get('/:id', getTipoEjercicioById);
router.get('/deporte/:id_deporte', getTipoEjercicioByIdDeporte);
router.post('/', createTipoEjercicio);
router.put('/:id', updateTipoEjercicio);
router.delete('/:id', deleteTipoEjercicio);

module.exports = router;
