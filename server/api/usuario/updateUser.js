import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { nombre, correo_electronico, contrasena, tipo_usuario } = req.body;

    try {
      const result = await pool.query(
        'UPDATE Usuarios SET nombre = $1, correo_electronico = $2, contrasena = $3, tipo_usuario = $4 WHERE id_usuario = $5 RETURNING *',
        [nombre, correo_electronico, contrasena, tipo_usuario, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
