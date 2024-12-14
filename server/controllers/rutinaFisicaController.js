const pool = require('../db'); // Conexión a la base de datos

// Crear una nueva rutina física
const createRutinaFisica = async (req, res) => {
    const { id_deportista, comentario_deportista } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO rutina_fisica (id_deportista, comentario_deportista) 
             VALUES ($1, $2) RETURNING *`,
            [id_deportista, comentario_deportista]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las rutinas físicas
const getAllRutinasFisicas = async (req, res) => {
    const { id_deportista, fecha_inicio, fecha_fin } = req.query;
    try {
        let query = `SELECT * FROM rutina_fisica`;
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

// Obtener detalles de una rutina específica
const getRutinaFisicaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM rutina_fisica WHERE id_rutina = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las rutinas físicas de un deportista
const getRutinasFisicasByDeportista = async (req, res) => {
    const { id_deportista } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM rutina_fisica WHERE id_deportista = $1`,
            [id_deportista]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron rutinas para el deportista' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar comentarios en una rutina física
const updateRutinaFisica = async (req, res) => {
    const { id } = req.params;
    const { comentario_deportista, comentario_entrenador } = req.body;
    try {
        const result = await pool.query(
            `UPDATE rutina_fisica 
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

// Eliminar una rutina física
const deleteRutinaFisica = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM rutina_fisica WHERE id_rutina = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }
        res.status(200).json({ message: 'Rutina eliminada', rutina: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getRutinaFisicaCompleta = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener datos básicos de la rutina
        const rutinaResult = await pool.query(
            `SELECT * FROM rutina_fisica WHERE id_rutina = $1`,
            [id]
        );

        if (rutinaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Rutina no encontrada' });
        }

        const rutina = rutinaResult.rows[0];

        // Obtener ejercicios asociados
        const ejerciciosResult = await pool.query(
            `SELECT ef.*, te.nombre AS tipo_ejercicio, te.usa_repeticiones AS te_repeticiones, 
                    te.usa_peso AS te_peso, te.usa_tiempo AS te_tiempo, te.usa_series AS te_series
             FROM ejercicio_fisico ef
             JOIN tipo_ejercicio te ON ef.id_tipo_ejercicio = te.id_tipo_ejercicio
             WHERE ef.id_rutina_fisica = $1`,
            [id]
        );

        rutina.ejercicios = ejerciciosResult.rows;

        res.status(200).json(rutina);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createRutinaFisica,
    getAllRutinasFisicas,
    getRutinaFisicaById,
    getRutinasFisicasByDeportista,
    updateRutinaFisica,
    deleteRutinaFisica,
    getRutinaFisicaCompleta,
};
