// controllers/usuarioController.js
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
const getUsuarios = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM Usuarios");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Crear un nuevo usuario
const createUsuario = async (req, res, next) => {
  const { nombre, correo_electronico, contrasena, club, tipo_usuario } = req.body;

  try {
    //Crear un usuario en auth
    const auth0User = await auth0.users.create({
      connection: "Username-Password-Authentication",
      email: correo_electronico,
      password: contrasena,
    });

    // Extraer el ID de Auth0
    const auth0Id = auth0User.data?.user_id || null;

    // Guardar usuario en la base de datos (Supabase)
    const result = await pool.query(
      "INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario, club, id_auth0) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre, correo_electronico, tipo_usuario, club, auth0Id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, club, tipo_usuario } = req.body;

  try {
    const result = await pool.query(
      "UPDATE usuarios SET nombre = $1, club = $2, tipo_usuario = $3 WHERE id_usuario = $4 RETURNING *",
      [nombre, club, tipo_usuario, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateEmailPassword = async (req, res) => {
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
}

const readUsuarioById = async (req, res) => {
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
}

const readUsuarioByEmail = async (req, res) => {
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
  }

const deleteUsuario = async (req, res, next) => {
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
    next(err);
  }
};

//obtener data del usuario
// Endpoint para obtener datos del usuario
const getUserInfo = async (req, res) => {
  const { email } = req.query; // identificamos al usuario por su correo electrónico


  if (!email) {
    return res.status(401).json({ error: "No hay usuario autenticado" });
  }

  try {
    // Consulta básica de datos del usuario
    const userResult = await pool.query(
      "SELECT * FROM Usuarios WHERE correo_electronico = $1",
      [email]
    );
    

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];
    let additionalInfo = null;

    // Según el tipo de usuario, obtenemos información adicional
    if (user.tipo_usuario === "Deportista") {
      const athleteResult = await pool.query(
        "SELECT fecha_nacimiento, sexo, peso, altura, nivel_experiencia, id_deporte FROM Deportistas WHERE id_usuario = $1",
        [user.id_usuario]
      );
      additionalInfo = athleteResult.rows[0] || null;
    } else if (user.tipo_usuario === "Entrenador") {
      const coachResult = await pool.query(
        "SELECT especialidad FROM Entrenadores WHERE id_usuario = $1",
        [user.id_usuario]
      );
      additionalInfo = coachResult.rows[0] || null;
    }

    res.json({ user, additionalInfo });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para obtener datos de sesión desde la base de datos
const getSessionData = async (sid) => {
  console.log("Consultando sesión con SID:", sid); // Log del SID recibido
  const result = await pool.query("SELECT sess FROM session WHERE sid = $1", [sid]);
  console.log("Resultado de la consulta a la base de datos:", result.rows); // Log del resultado de la consulta  
  return result.rows[0]?.sess || null; // Retorna el JSON almacenado en el campo `sess`
};

// Endpoint para obtener datos de sesión
const getUserSession = async (req, res) => {
  const sid = req.query.sid; // Obtenemos el SID del query string
  console.log("SID recibido en el query string:", sid); // Log del SID recibido

  if (!sid) {
    console.error("Error: SID no proporcionado");
    return res.status(400).json({ error: "Session ID no proporcionado" });
  }

  try {
    const sessionData = await getSessionData(sid);
    console.log("Datos de sesión obtenidos:", sessionData); // Log de los datos obtenidos
    if (!sessionData || !sessionData.userEmail) {
      console.error("Error: El correo del usuario no está disponible en los datos de sesión");
      return res.status(401).json({ error: "Sesión no válida o expirada" });
    }

    console.log("Correo electrónico encontrado:", sessionData.userEmail);
    res.json({ email: sessionData.userEmail }); // Retorna el correo almacenado en la sesión
  } catch (error) {
    console.error("Error obteniendo datos de sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,  
  updateEmailPassword,  
  readUsuarioById,
  readUsuarioByEmail,
  deleteUsuario,
  getUserInfo,
  getUserSession,
};
