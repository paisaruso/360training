const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar correctamente tu módulo de conexión a la base de datos

// CREATE - Crear una nueva asignación de ejercicio a rutina
router.post('/', async (req, res) => {
    const { id_rutina, id_ejercicio, orden, dia_semana } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO asignacion_ejercicios_rutinas (id_rutina, id_ejercicio, orden, dia_semana) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_rutina, id_ejercicio, orden, dia_semana]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// READ - Obtener todas las asignaciones
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM asignacion_ejercicios_rutinas');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// READ - Obtener una asignación por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM asignacion_ejercicios_rutinas WHERE id_rutina = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Asignación no encontrada' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// UPDATE - Actualizar una asignación
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_rutina, id_ejercicio, orden, dia_semana } = req.body;
    try {
        const result = await db.query(
            'UPDATE asignacion_ejercicios_rutinas SET id_rutina = $1, id_ejercicio = $2, orden = $3, dia_semana = $4 WHERE id_rutina = $5 RETURNING *',
            [id_rutina, id_ejercicio, orden, dia_semana, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Asignación no encontrada' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// DELETE - Eliminar una asignación
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM asignacion_ejercicios_rutinas WHERE id_rutina = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Asignación no encontrada' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
