import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { nombre, fecha_nacimiento, deporte, categoria } = req.body;

    try {
      const result = await pool.query(
        'UPDATE Deportistas SET nombre = $1, fecha_nacimiento = $2, deporte = $3, categoria = $4 WHERE id_deportista = $5 RETURNING *',
        [nombre, fecha_nacimiento, deporte, categoria, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Deportista no encontrado' });
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
