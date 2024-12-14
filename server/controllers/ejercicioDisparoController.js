const pool = require('../db'); // Conexión a la base de datos


// Create a new "ejercicio_disparo"
const createEjercicioDisparo = async (req, res) => {
    const { id_rutina_especifica, cantidad_flechas, flechas_por_serie, promedio_por_flecha, tamano_diana, distancia, evaluacion } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO ejercicio_disparo (id_rutina_especifica, cantidad_flechas, flechas_por_serie, promedio_por_flecha, tamano_diana, distancia, evaluacion)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_rutina_especifica, cantidad_flechas, flechas_por_serie, promedio_por_flecha, tamano_diana, distancia, evaluacion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all "ejercicio_disparo"
const getAllEjerciciosDisparo = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ejercicio_disparo`);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single "ejercicio_disparo" by ID
const getEjercicioDisparoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM ejercicio_disparo WHERE id_ejercicio = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a "ejercicio_disparo"
const updateEjercicioDisparo = async (req, res) => {
    const { id } = req.params;
    const { cantidad_flechas, flechas_por_serie, promedio_por_flecha, tamano_diana, distancia, evaluacion } = req.body;
    try {
        const result = await pool.query(
            `UPDATE ejercicio_disparo SET 
             cantidad_flechas = COALESCE($1, cantidad_flechas),
             flechas_por_serie = COALESCE($2, flechas_por_serie),
             promedio_por_flecha = COALESCE($3, promedio_por_flecha),
             tamano_diana = COALESCE($4, tamano_diana),
             distancia = COALESCE($5, distancia),
             evaluacion = COALESCE($6, evaluacion)
             WHERE id_ejercicio = $7 RETURNING *`,
            [cantidad_flechas, flechas_por_serie, promedio_por_flecha, tamano_diana, distancia, evaluacion, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a "ejercicio_disparo"
const deleteEjercicioDisparo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM ejercicio_disparo WHERE id_ejercicio = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
        res.status(200).json({ message: 'Ejercicio eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all "ejercicio_disparo" for a specific routine
const getEjerciciosByRutinaEspecifica = async (req, res) => {
    const { id_rutina_especifica } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM ejercicio_disparo WHERE id_rutina_especifica = $1`,
            [id_rutina_especifica]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron ejercicios para esta rutina específica' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEjercicioDisparo,
    getAllEjerciciosDisparo,
    getEjercicioDisparoById,
    updateEjercicioDisparo,
    deleteEjercicioDisparo,
    getEjerciciosByRutinaEspecifica,
};
