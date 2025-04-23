const pool = require('../db');

// Crear una nueva notificación
const createNotificacion = async (req, res) => {
    const { id_usuario, tipo, mensaje } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO notificaciones (id_usuario, tipo, mensaje)
             VALUES ($1, $2, $3) RETURNING *`,
            [id_usuario, tipo, mensaje]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las notificaciones de un usuario
const getNotificacionesByUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM notificaciones WHERE id_usuario = $1 ORDER BY fecha DESC`,
            [id_usuario]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Marcar una notificación como leída
const markNotificacionAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE notificaciones SET leido = TRUE WHERE id_notificacion = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una notificación
const deleteNotificacion = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM notificaciones WHERE id_notificacion = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notificación no encontrada' });
        }
        res.status(200).json({ message: 'Notificación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Marcar todas las notificaciones como leídas
const markAllAsRead = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        await pool.query(
            `UPDATE notificaciones SET leido = TRUE WHERE id_usuario = $1`,
            [id_usuario]
        );
        res.status(200).json({ message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUnreadNotificationsCount = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const result = await pool.query(
            `SELECT COUNT(*) AS unread_count
             FROM notificaciones
             WHERE id_usuario = $1 AND leido = FALSE`,
            [id_usuario]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUnreadNotificacionesByUsuario = async (req, res) => {
    const { id_usuario } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT * 
         FROM notificaciones 
         WHERE id_usuario = $1 
           AND leido = false
         ORDER BY fecha DESC`,
        [id_usuario]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    createNotificacion,
    getNotificacionesByUsuario,
    markNotificacionAsRead,
    deleteNotificacion,
    markAllAsRead,
    getUnreadNotificationsCount,
    getUnreadNotificacionesByUsuario,
};
