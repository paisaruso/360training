const pool = require('../db'); // Importar la conexión a la base de datos

// Crear un nuevo ejercicio físico
const createEjercicioFisico = async (req, res) => {
    const { id_rutina_fisica, id_tipo_ejercicio, repeticiones, peso, series, tiempo } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO ejercicio_fisico (id_rutina_fisica, id_tipo_ejercicio, repeticiones, peso, tiempo, series)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [id_rutina_fisica, id_tipo_ejercicio, repeticiones, peso, tiempo, series ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los ejercicios de una rutina x
const getEjerciciosByRutina = async (req, res) => {
    const { id_rutina } = req.params;

    try {
        const result = await pool.query(
            `SELECT ef.*, te.nombre AS tipo_ejercicio, te.usa_repeticiones AS te_repeticiones, 
                    te.usa_peso AS te_peso, te.usa_tiempo AS te_tiempo, te.usa_series AS te_series
             FROM ejercicio_fisico ef
             JOIN tipo_ejercicio te ON ef.id_tipo_ejercicio = te.id_tipo_ejercicio
             WHERE ef.id_rutina_fisica = $1`,
            [id_rutina]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron ejercicios para esta rutina' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener los detalles de un ejercicio físico específico
const getEjercicioById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM ejercicio_fisico WHERE id_ejercicio_fisico = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un ejercicio físico
const updateEjercicioFisico = async (req, res) => {
    const { id } = req.params;
    const { repeticiones, peso, series, tiempo } = req.body;

    try {
        const result = await pool.query(
            `UPDATE ejercicio_fisico 
             SET repeticiones = $1, peso = $2, series = $3, tiempo = $4
             WHERE id_ejercicio_fisico = $5 RETURNING *`,
            [repeticiones, peso, series, tiempo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un ejercicio físico
const deleteEjercicioFisico = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM ejercicio_fisico WHERE id_ejercicio_fisico = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado o ya eliminado' });
        }

        res.status(200).json({ message: 'Ejercicio eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEjercicioFisico,
    getEjerciciosByRutina,
    getEjercicioById,
    updateEjercicioFisico,
    deleteEjercicioFisico,
};
