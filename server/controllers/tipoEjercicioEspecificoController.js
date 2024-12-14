const pool = require('../db'); // Conexión a la base de datos

// Obtener todos los tipos de ejercicios especificos
const getTiposEjercicio = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_ejercicio_especifico');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tipos de ejercicio' });
  }
};

// Obtener un tipo de ejercicio especifico por ID
const getTipoEjercicioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tipo_ejercicio_especifico WHERE id_tipo_ejercicio = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tipo de ejercicio' });
  }
};

// Obtener todos tipos de ejercicio especifico por ID del deporte
const getTipoEjercicioByIdDeporte = async (req, res) => {
    const { id_deporte } = req.params;
    try {
      const result = await pool.query('SELECT * FROM tipo_ejercicio_especifico WHERE id_deporte = $1', 
        [id_deporte]
    );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
      }
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el tipo de ejercicio' });
    }
  };

// Crear un nuevo tipo de ejercicio especifico
const createTipoEjercicio = async (req, res) => {
  const { nombre_ejercicio, id_deporte, descripcion, tabla_asociada } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tipo_ejercicio_especifico (nombre_ejercicio, id_deporte, descripcion, tabla_asociada) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_ejercicio, id_deporte, descripcion, tabla_asociada]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tipo de ejercicio' });
  }
};

// Actualizar un tipo de ejercicio especifico
const updateTipoEjercicio = async (req, res) => {
  const { id } = req.params;
  const { nombre_ejercicio, id_deporte, descripcion, tabla_asociada } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tipo_ejercicio_especifico SET nombre_ejercicio = $1, id_deporte = $2, descripcion = $3, tabla_asociada = $4 WHERE id_tipo_ejercicio = $5 RETURNING *',
      [nombre_ejercicio, id_deporte, descripcion, tabla_asociada, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tipo de ejercicio' });
  }
};

// Eliminar un tipo de ejercicio especifico
const deleteTipoEjercicio = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tipo_ejercicio_especifico WHERE id_tipo_ejercicio = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de ejercicio no encontrado' });
    }
    res.json({ message: 'Tipo de ejercicio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tipo de ejercicio' });
  }
};

module.exports = {
  getTiposEjercicio,
  getTipoEjercicioById,
  getTipoEjercicioByIdDeporte,
  createTipoEjercicio,
  updateTipoEjercicio,
  deleteTipoEjercicio,
};
