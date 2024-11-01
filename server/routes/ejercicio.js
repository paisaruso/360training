const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar correctamente tu módulo de conexión a la base de datos

// CREATE - Crear un nuevo ejercicio
router.post('/', async (req, res) => {
    const { nombre, descripcion, grupo_muscular, volumen, promedio_flecha, puntaje_eval, tiempo_descanso, incluye_flechas } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO ejercicios (nombre, descripcion, grupo_muscular, volumen, promedio_flecha, puntaje_eval, tiempo_descanso, incluye_flechas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nombre, descripcion, grupo_muscular, volumen, promedio_flecha, puntaje_eval, tiempo_descanso, incluye_flechas]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// READ - Obtener todos los ejercicios
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM ejercicios');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// READ - Obtener un ejercicio por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM ejercicios WHERE id_ejercicio = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// UPDATE - Actualizar un ejercicio
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, grupo_muscular, volumen, promedio_flecha, puntaje_eval, tiempo_descanso, incluye_flechas } = req.body;
    try {
        const result = await db.query(
            'UPDATE ejercicios SET nombre = $1, descripcion = $2, grupo_muscular = $3, volumen = $4, promedio_flecha = $5, puntaje_eval = $6, tiempo_descanso = $7, incluye_flechas = $8 WHERE id_ejercicio = $9 RETURNING *',
            [nombre, descripcion, grupo_muscular, volumen, promedio_flecha, puntaje_eval, tiempo_descanso, incluye_flechas, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// DELETE - Eliminar un ejercicio
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM ejercicios WHERE id_ejercicio = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ error: 'Ejercicio no encontrado' });
        }
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
