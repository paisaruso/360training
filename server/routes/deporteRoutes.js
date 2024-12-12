const express = require('express');
const router = express.Router();
const {
  getAllDeportes,
  createDeporte,
  getDeporteById,
  updateDeporte,
  deleteDeporte,
} = require('../controllers/deporteController');

// Rutas para deportes
router.get('/', getAllDeportes);
router.post('/', createDeporte);
router.get('/:id', getDeporteById);
router.put('/:id', updateDeporte);
router.delete('/:id', deleteDeporte);

module.exports = router;
