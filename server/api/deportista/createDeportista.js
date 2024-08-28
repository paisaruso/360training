import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, fecha_nacimiento, deporte, categoria } = req.body;

    try {
      const result = await pool.query(
        'INSERT INTO Deportistas (nombre, fecha_nacimiento, deporte, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, fecha_nacimiento, deporte, categoria]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creando deportista:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
