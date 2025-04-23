const express = require('express');
const router = express.Router();
const {
  getAllDeportistas,
  createDeportista,
  updateDeportista,
  getDeportistaById,
  deleteDeportista,
  getAllDeportistasExtended,
} = require('../controllers/deportistaController');

// Rutas para deportistas
router.get('/', getAllDeportistas);
router.post('/', createDeportista);
router.get('/:id', getDeportistaById);
router.put('/:id', updateDeportista);
router.delete('/:id', deleteDeportista);

// Ruta extendida con JOIN, filtrable por nombre
router.get('/info/detalles', getAllDeportistasExtended);

module.exports = router;
