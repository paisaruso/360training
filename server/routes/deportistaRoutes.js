const express = require('express');
const router = express.Router();
const {
  getAllDeportistas,
  createDeportista,
  updateDeportista,
  getDeportistaById,
  deleteDeportista,
} = require('../controllers/deportistaController');

// Rutas para deportistas
router.get('/', getAllDeportistas);
router.post('/', createDeportista);
router.get('/:id', getDeportistaById);
router.put('/:id', updateDeportista);
router.delete('/:id', deleteDeportista);

module.exports = router;
