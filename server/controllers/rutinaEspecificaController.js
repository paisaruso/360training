const pool = require('../db'); // Conexión a la base de datos

// Obtener todas las rutinas específicas con filtros
const getAllRutinasEspecificas = async (req, res) => {
    const { id_deportista, fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `SELECT * FROM rutina_especifica`;
        const params = [];
        if (id_deportista || fecha_inicio || fecha_fin) {
            query += ` WHERE `;
            if (id_deportista) {
                params.push(id_deportista);
                query += `id_deportista = $${params.length}`;
            }
            if (fecha_inicio) {
                params.push(fecha_inicio);
                query += params.length === 1 ? ` fecha >= $${params.length}` : ` AND fecha >= $${params.length}`;
            }
            if (fecha_fin) {
                params.push(fecha_fin);
                query += params.length === 1 ? ` fecha <= $${params.length}` : ` AND fecha <= $${params.length}`;
            }
        }
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una rutina específica completa con ejercicios
const getRutinaEspecificaCompleta = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener datos básicos de la rutina
        const rutinaResult = await pool.query(
            `SELECT * FROM rutina_especifica WHERE id_rutina = $1`,
            [id]
        );

        if (rutinaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }

        const rutina = rutinaResult.rows[0];

        // Obtener ejercicios asociados
        const ejerciciosResult = await pool.query(
            `SELECT *
             FROM ejercicio_disparo             
             WHERE id_rutina_especifica = $1`,
            [id]
        );

        rutina.ejercicios = ejerciciosResult.rows;

        res.status(200).json(rutina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva rutina específica
const createRutinaEspecifica = async (req, res) => {
    const { id_deportista, id_deporte, fecha, comentario_deportista, comentario_entrenador } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO rutina_especifica (id_deportista, id_deporte, comentario_deportista, comentario_entrenador) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id_deportista, id_deporte, comentario_deportista, comentario_entrenador]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar comentarios de una rutina específica
const updateRutinaEspecifica = async (req, res) => {
    const { id } = req.params;
    const { comentario_deportista, comentario_entrenador } = req.body;
    try {
        const result = await pool.query(
            `UPDATE rutina_especifica 
             SET comentario_deportista = COALESCE($1, comentario_deportista), 
                 comentario_entrenador = COALESCE($2, comentario_entrenador) 
             WHERE id_rutina = $3 RETURNING *`,
            [comentario_deportista, comentario_entrenador, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una rutina específica
const deleteRutinaEspecifica = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM rutina_especifica WHERE id_rutina = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }
        res.status(200).json({ message: 'Rutina eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllRutinasEspecificas,
    getRutinaEspecificaCompleta,
    createRutinaEspecifica,
    updateRutinaEspecifica,
    deleteRutinaEspecifica,
};
