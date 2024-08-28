import { ManagementClient } from 'auth0';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  scope: 'create:users',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, correo_electronico, contrasena, tipo_usuario } = req.body;

    try {
      // Crear usuario en Auth0
      const auth0User = await auth0.users.create({
        connection: 'Username-Password-Authentication',
        email: correo_electronico,
        password: contrasena,
      });

      // Guardar usuario en la base de datos (Supabase)
      const result = await pool.query(
        'INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario) VALUES ($1, $2, $3) RETURNING *',
        [nombre, correo_electronico, tipo_usuario]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error registrando usuario:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
