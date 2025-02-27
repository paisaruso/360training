const express = require('express');
const {
    createNotificacion,
    getNotificacionesByUsuario,
    markNotificacionAsRead,
    deleteNotificacion,
    markAllAsRead,
    getUnreadNotificationsCount,
    getUnreadNotificacionesByUsuario,
} = require('../controllers/notificacionesController');

const router = express.Router();

// Crear una nueva notificación
router.post('/', createNotificacion);

// Obtener todas las notificaciones de un usuario
router.get('/:id_usuario', getNotificacionesByUsuario);

// Marcar una notificación como leída
router.put('/:id', markNotificacionAsRead);

// Eliminar una notificación
router.delete('/:id', deleteNotificacion);

// Marcar todas las notificaciones como leídas
router.put('/usuario/:id_usuario', markAllAsRead);

// Obtener numero de notificaciones sin leer
router.get('/unread/:id_usuario', getUnreadNotificationsCount);

// Ruta para obtener solo las notificaciones no leídas
router.get('/:id_usuario/unread', getUnreadNotificacionesByUsuario);

module.exports = router;
