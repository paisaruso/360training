const pool = require("../db");

// Crear un comentario
const createComentario = async (req, res) => {
  const { id_entrenador, id_deportista, contenido } = req.body;
  try {
    const comentarioResult = await pool.query(
      `INSERT INTO comentarios (id_entrenador, id_deportista, contenido)
             VALUES ($1, $2, $3) RETURNING *`,
      [id_entrenador, id_deportista, contenido]
    );

    const comentario = comentarioResult.rows[0];

    const entrenadorResult = await pool.query(
      `
      SELECT 
        e.id_usuario,
        u.nombre
      FROM entrenadores e
      JOIN usuarios u ON e.id_usuario = u.id_usuario
      WHERE e.id_entrenador = $1
    `,
      [id_entrenador]
    );

    if (entrenadorResult.rows.length === 0) {
      return res.status(404).json({ error: "Entrenador no encontrado" });
    }

    const { nombre } = entrenadorResult.rows[0];

    const deportistaResult = await pool.query(
      `SELECT id_usuario FROM deportistas WHERE id_deportista = $1`,
      [id_deportista]
    );

    if (deportistaResult.rows.length === 0) {
      return res.status(404).json({ error: "Deportista no encontrado" });
    }

    const { id_usuario } = deportistaResult.rows[0];

    // Crear la notificación asociada al comentario
    await pool.query(
      `INSERT INTO notificaciones (id_usuario, mensaje, tipo)
             VALUES ($1, $2, $3)`,
      [
        id_usuario,
        `El entrenador ${nombre} ha comentado en tu perfil: "${contenido}"`, 'comentario perfil',
      ]
    );

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener comentarios de un deportista
const getComentariosByDeportista = async (req, res) => {
  const { id_deportista } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id_comentario, c.contenido, c.fecha, 
                    u.nombre AS entrenador
             FROM comentarios c
             JOIN entrenadores e ON c.id_entrenador = e.id_entrenador
             JOIN usuarios u ON e.id_usuario = u.id_usuario
             WHERE c.id_deportista = $1
             ORDER BY c.fecha DESC`,
      [id_deportista]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron comentarios para este deportista" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un comentario
const updateComentario = async (req, res) => {
  const { id } = req.params;
  const { contenido } = req.body;

  try {
    const result = await pool.query(
      `UPDATE comentarios SET contenido = $1 WHERE id_comentario = $2 RETURNING *`,
      [contenido, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un comentario
const deleteComentario = async (req, res) => {
  const { id_comentario } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM comentarios WHERE id_comentario = $1 RETURNING *`,
      [id_comentario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Comentario eliminado", comentario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComentario,
  getComentariosByDeportista,
  updateComentario,
  deleteComentario,
};
