const pool = require('../db');

// Obtener todos los deportistas
const getAllDeportistas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Deportistas');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo deportistas:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Crear un nuevo deportista
const createDeportista = async (req, res) => {
  const { id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id_entrenador } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Deportistas (id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id_entrenador) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id_usuario, fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id_entrenador]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando deportista:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar un deportista
const updateDeportista = async (req, res) => {
  const { id } = req.params;
  const { fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id_entrenador } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Deportistas SET fecha_nacimiento = $1, sexo = $2, peso = $3, altura = $4, nivel_experiencia = $5, id_deporte = $6, id_entrenador = $7 WHERE id_deportista = $8 RETURNING *',
      [fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte, id_entrenador, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Deportista no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando deportista:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Leer un deportista por ID
const getDeportistaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Deportistas WHERE id_deportista = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deportista no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo deportista por ID:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar un deportista
const deleteDeportista = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Deportistas WHERE id_deportista = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deportista no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error eliminando deportista:', err.message);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = {
  getAllDeportistas,
  createDeportista,
  updateDeportista,
  getDeportistaById,
  deleteDeportista,
};
