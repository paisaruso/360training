const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los deportistas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Deportistas');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Crear un nuevo deportista
router.post('/', async (req, res) => {
  const { id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Deportistas (id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar un deportista
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Deportistas SET fecha_nacimiento = $1, sexo = $2, peso = $3, altura = $4, nivel_experiencia = $5, id_deporte = $6 WHERE id_deportista = $7 RETURNING *',
      [fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Deportista no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Leer un deportista por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM Deportistas WHERE id_deportista = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).send('Deportista no encontrado');
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  });

// Eliminar un deportista
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Deportistas WHERE id_deportista = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deportista no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
