import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const result = await pool.query('DELETE FROM Usuarios WHERE id_usuario = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(204).end();
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
