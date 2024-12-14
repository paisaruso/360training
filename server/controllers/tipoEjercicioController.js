const db = require('../db'); // Asegúrate de que apunta a tu conexión a la base de datos

// Crear un tipo de ejercicio
const createTipoEjercicio = async (req, res) => {
    const { nombre, tiempo, repeticiones, series, peso, id_creado_por } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO tipo_ejercicio (nombre, usa_tiempo, usa_repeticiones, usa_series, usa_peso, id_creado_por)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, tiempo, repeticiones, series, peso, id_creado_por]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el tipo de ejercicio.' });
    }
};

// Obtener todos los tipos de ejercicio
const getAllTiposEjercicio = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tipo_ejercicio');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los tipos de ejercicio.' });
    }
};

// Obtener un tipo de ejercicio por ID
const getTipoEjercicioById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM tipo_ejercicio WHERE id_tipo_ejercicio = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tipo de ejercicio no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el tipo de ejercicio.' });
    }
};

// Actualizar un tipo de ejercicio
const updateTipoEjercicio = async (req, res) => {
    const { id } = req.params;
    const { nombre, tiempo, repeticiones, series, peso } = req.body;
    try {
        const result = await db.query(
            `UPDATE tipo_ejercicio
             SET nombre = $1, usa_tiempo = $2, usa_repeticiones = $3, usa_series = $4, usa_peso = $5
             WHERE id_tipo_ejercicio = $6 RETURNING *`,
            [nombre, tiempo, repeticiones, series, peso, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tipo de ejercicio no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el tipo de ejercicio.' });
    }
};

// Eliminar un tipo de ejercicio
const deleteTipoEjercicio = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM tipo_ejercicio WHERE id_tipo_ejercicio = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tipo de ejercicio no encontrado o ya eliminado.' });
        }
        res.status(200).json({ message: 'Tipo de ejercicio eliminado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el tipo de ejercicio.' });
    }
};

module.exports = {
    createTipoEjercicio,
    getAllTiposEjercicio,
    getTipoEjercicioById,
    updateTipoEjercicio,
    deleteTipoEjercicio,
};
