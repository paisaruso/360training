import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO Deporte (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creando deporte:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
