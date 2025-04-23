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

// Obtener lista "extendida" de deportistas con JOIN en Usuarios
// Opcionalmente filtrar por nombre (via ?search=...)
const getAllDeportistasExtended = async (req, res) => {
  const { search } = req.query;

  try {
    // Construimos la consulta base
    let query = `
      SELECT
        d.id_deportista,
        d.id_usuario,
        u.nombre AS nombre_usuario,
        u.numero_documento,
        d.fecha_nacimiento,
        d.sexo,
        d.peso,
        d.altura,
        d.nivel_experiencia,
        d.id_deporte,
        d.id_entrenador
      FROM Deportistas d
      JOIN Usuarios u ON d.id_usuario = u.id_usuario
    `;

    const params = [];

    // Si viene ?search=..., añadimos condición
    // Usamos ILIKE (Postgres) para un filtrado case-insensitive
    if (search) {
      query += ` WHERE (u.nombre ILIKE $1 OR u.numero_documento ILIKE $1)`;
      // El patrón '%' concatena para buscar parcial
      params.push(`%${search}%`);
    }

    // Opcionalmente, ordenamos por nombre
    query += ` ORDER BY u.nombre ASC`;

    // Ejecutamos la consulta
    const result = await pool.query(query, params);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error obteniendo deportistas extendidos:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getAllDeportistas,
  createDeportista,
  updateDeportista,
  getDeportistaById,
  deleteDeportista,
  getAllDeportistasExtended,
};
