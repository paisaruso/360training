// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvolucionPuntaje,
  getComparacionPuntajeDisparo,
  getTotalFlechasLanzadas,
  comparePuntajeEntreDeportistas,
  getHistorialAsistenciaPorEntrenador,
  getRendimientoFisico,
  getPromedioPuntajesPorCategoria,
  getCantidadRutinasPorPeriodo,
  getComparacionDistanciasFrecuentes
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

// 7) Promedio de puntajes en ejercicios específicos por categoría/nivel
router.get('/promedio-puntajes-categoria', getPromedioPuntajesPorCategoria);

// 8) Cantidad de rutinas registradas (por tipo) durante un período (diario, semanal, mensual)
router.get('/cantidad-rutinas-por-periodo', getCantidadRutinasPorPeriodo);

// 9) Comparación entre distancias más frecuentes y puntajes asociados
router.get('/comparacion-distancias-frecuentes', getComparacionDistanciasFrecuentes);


module.exports = router;
