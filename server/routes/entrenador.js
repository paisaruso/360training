const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los entrenadores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Entrenadores');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Crear un nuevo entrenador
router.post('/', async (req, res) => {
  const { id_usuario, especialidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Entrenadores (id_usuario, especialidad) VALUES ($1, $2) RETURNING *',
      [id_usuario, especialidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar un entrenador
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { especialidad } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Entrenadores SET especialidad = $1 WHERE id_entrenador = $2 RETURNING *',
      [especialidad, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Leer un usuario por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM Entrenadores WHERE id_entrenador = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Entrenador no encontrado');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  });

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Entrenadores WHERE id_entrenador = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
