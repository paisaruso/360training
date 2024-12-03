require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db'); // Importa la configuración de la base de datos
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

const port = process.env.PORT;


// Importa las rutas
const deporteRoutes = require('./routes/deporte');
const usuarioRoutes = require('./routes/usuario');
const deportistaRoutes = require('./routes/deportista');
const entrenadorRoutes = require('./routes/entrenador');
const rutinaRoutes = require('./routes/rutina');
const ejercicioRoutes = require('./routes/ejercicio');
const asignacionEjercicioRoutes = require('./routes/asignacionEjercicio');



//middleware
app.use(cors());
app.use(express.json()); //req.body


  // Usa las rutas
app.use('/api/deportes', deporteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/deportistas', deportistaRoutes);
app.use('/api/entrenadores', entrenadorRoutes);
app.use('/api/rutina', rutinaRoutes);
app.use('/api/ejercicio', ejercicioRoutes);
app.use('/api/asignacion_ejercicio', asignacionEjercicioRoutes);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Ruta de callback (después de login)
app.get('/callback', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } else {
    res.redirect('/');
  }
});

// Ruta de logout
// app.get('/logout', (req, res) => {
//   console.log("se deslogueo");
//   const returnTo = `${process.env.FRONTEND_URL}`; 
//   res.oidc.logout({ returnTo }); // Esto redirige al frontend después de cerrar sesión
// });

app.get('/logout', (req, res) => {
  console.log("Usuario sacado");
  const returnTo = process.env.BASE_URL || 'http://localhost:5000';  
  res.oidc.logout({ returnTo });
});


// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged sup in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


app.post('/api/check-user', async (req, res) => {
  const { email } = req.body;

  try {
    // Realizas la consulta directamente aquí, como en tu API de usuario
    const result = await pool.query(
      "SELECT * FROM Usuarios WHERE correo_electronico = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("Usuario sin email",email);
      return res.json({ registered: false });
      
    }
    res.json({ registered: true });
  } catch (error) {
    console.error('Error verificando usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});



app.listen(port, () => {
    console.log(`el servidor inicio en el puerto:${port}`);
  });