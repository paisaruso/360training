import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { especialidad } = req.body;

    try {
      const result = await pool.query(
        'UPDATE Entrenadores SET especialidad = $1 WHERE id_entrenador = $2 RETURNING *',
        [especialidad, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Entrenador no encontrado' });
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
