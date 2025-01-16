// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvolucionPuntaje,
  getComparacionPuntajeDisparo,
  getTotalFlechasLanzadas,
  comparePuntajeEntreDeportistas,
  getHistorialAsistenciaPorEntrenador,
  getRendimientoFisico
} = require('../controllers/analyticsController');

// Definimos la ruta para la evolución del puntaje
// GET /api/analytics/evolucion-puntaje
router.get('/evolucion-puntaje', getEvolucionPuntaje);

// GET /api/analytics/comparacion-puntaje-disparo
router.get('/comparacion-puntaje-disparo', getComparacionPuntajeDisparo);

// 3) Cantidad total de flechas
router.get('/total-flechas', getTotalFlechasLanzadas);

// 4) Comparación de puntaje promedio entre 2+ deportistas
router.get('/compare-puntaje-deportistas', comparePuntajeEntreDeportistas);

// 5) Historial de asistencia
router.get('/historial-asistencia', getHistorialAsistenciaPorEntrenador);

// 6) Comparación de rendimiento en ejercicios físicos
router.get('/rendimiento-fisico', getRendimientoFisico);


module.exports = router;
