const pool = require('../db');

// Obtener todos los entrenadores con sus nombres
const obtenerEntrenadores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id_entrenador,
        u.nombre AS nombre_usuario,
        e.especialidad
      FROM Entrenadores e
      JOIN Usuarios u ON e.id_usuario = u.id_usuario
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Crear un nuevo entrenador
const crearEntrenador = async (req, res) => {
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
};

// Actualizar un entrenador
const actualizarEntrenador = async (req, res) => {
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
};

// Leer un entrenador por ID con nombre
const obtenerEntrenadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        e.id_entrenador,
        u.nombre AS nombre_usuario,
        e.especialidad
      FROM Entrenadores e
      JOIN Usuarios u ON e.id_usuario = u.id_usuario
      WHERE e.id_entrenador = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar un entrenador
const eliminarEntrenador = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Entrenadores WHERE id_entrenador = $1 RETURNING *', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Entrenador no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener entrenadores para selección
const obtenerEntrenadoresParaSeleccion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id_entrenador,
        u.nombre AS nombre_usuario
      FROM Entrenadores e
      JOIN Usuarios u ON e.id_usuario = u.id_usuario
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = {
  obtenerEntrenadores,
  crearEntrenador,
  actualizarEntrenador,
  obtenerEntrenadorPorId,
  eliminarEntrenador,
  obtenerEntrenadoresParaSeleccion
};
