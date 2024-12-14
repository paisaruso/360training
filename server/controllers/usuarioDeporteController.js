const pool = require('../db');

// Controlador para asociar un usuario con un deporte
const asociarUsuarioDeporte = async (req, res) => {
    const { id_usuario, id_deporte } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO usuario_deporte (id_usuario, id_deporte) VALUES ($1, $2) RETURNING *',
            [id_usuario, id_deporte]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asociar usuario con deporte' });
    }
};

// Controlador para obtener los deportes asociados a un usuario
const obtenerDeportesPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const result = await pool.query(
            'SELECT d.id_deporte, d.nombre FROM usuario_deporte ud JOIN deporte d ON ud.id_deporte = d.id_deporte WHERE ud.id_usuario = $1',
            [id_usuario]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener deportes del usuario' });
    }
};

// Controlador para eliminar la asociación entre un usuario y un deporte
const eliminarAsociacionUsuarioDeporte = async (req, res) => {
    const { id_usuario, id_deporte } = req.body;
    try {
        await pool.query(
            'DELETE FROM usuario_deporte WHERE id_usuario = $1 AND id_deporte = $2',
            [id_usuario, id_deporte]
        );
        res.status(200).json({ message: 'Asociación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la asociación' });
    }
};

module.exports = {
    asociarUsuarioDeporte,
    obtenerDeportesPorUsuario,
    eliminarAsociacionUsuarioDeporte,
};
