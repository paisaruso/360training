const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los deportes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Deporte');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Crear un nuevo deporte
router.post('/', async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query('INSERT INTO Deporte (nombre) VALUES ($1) RETURNING *', [nombre]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Leer un deporte por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM Deporte WHERE id_deporte = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Deporte no encontrado');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  });

// Actualizar un deporte
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await pool.query('UPDATE Deporte SET nombre = $1 WHERE id_deporte = $2 RETURNING *', [nombre, id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deporte no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un deporte
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Deporte WHERE id_deporte = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deporte no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
