const express = require("express");
const router = express.Router();
const pool = require("../db");
const { ManagementClient } = require("auth0");

// Configura el cliente de Management de Auth0
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  scope: "create:users update:users update:users_app_metadata",
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Usuarios");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, correo_electronico, contrasena, club, tipo_usuario } = req.body;

  try {
    // Crear usuario en Auth0
    const auth0User = await auth0.users.create({
      connection: "Username-Password-Authentication", // Asegúrate de que este nombre de conexión sea correcto
      email: correo_electronico,
      password: contrasena
    });
    console.log("Usuario creado en Auth0:", auth0User);
    console.log("id del usuario en Auth0:", auth0User.data.user_id);

    // Extraer el ID de Auth0
    const auth0Id = auth0User?.user_id || null;

    // Guardar usuario en la base de datos (Supabase)
    const result = await pool.query(
      'INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario, club, id_auth0) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, correo_electronico, tipo_usuario, club, auth0User.data.user_id]
    );

    res.status(201).json(result.rows[0]); 
  } catch (err) {
    console.error("Error registrando usuario:", err);
    res.status(500).send('Error en el servidor');
  }
});


// Actualizar un usuario
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, correo_electronico, contrasena, club, tipo_usuario } = req.body;

  try {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, correo_electronico = $2, contrasena = $3, club = $4, tipo_usuario = $5 WHERE id_usuario = $6 RETURNING *",
      [nombre, correo_electronico, contrasena, club, tipo_usuario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Actualizar correo o contraseña
router.put("/actualizar-auth0/:id", async (req, res) => {
  const { id } = req.params; // ID de Auth0, no de Supabase
  const { correo_electronico, contrasena } = req.body;

  try {
    // Validar si al menos un campo está presente
    if (!correo_electronico && !contrasena) {
      return res.status(400).json({ message: "Debe proporcionar correo electrónico o contraseña para actualizar" });
    }

    // Actualización por separado para correo y contraseña
    if (correo_electronico) {
      await auth0.users.update({ id }, { email: correo_electronico });

      // Actualizar correo en la base de datos Supabase
      await pool.query(
        "UPDATE usuarios SET correo_electronico = $1 WHERE id_auth0 = $2",
        [correo_electronico, id]
      );
    }

    if (contrasena) {
      await auth0.users.update({ id }, { password: contrasena });
    }

    res.json({ message: "Usuario actualizado correctamente en Auth0 y Supabase" });
  } catch (err) {
    console.error("Error actualizando usuario en Auth0:", err);
    res.status(500).send("Error al actualizar usuario en Auth0");
  }
});


// Leer un usuario por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Usuarios WHERE id_usuario = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Leer un usuario por email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Usuarios WHERE correo_electronico = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Correo de usuario no encontrado");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Usuarios WHERE id_usuario = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

module.exports = router;
