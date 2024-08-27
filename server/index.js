require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db'); // Importa la configuración de la base de datos
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');


// Importa las rutas
const deporteRoutes = require('./routes/deporte');
const usuarioRoutes = require('./routes/usuario');
const deportistaRoutes = require('./routes/deportista');
const entrenadorRoutes = require('./routes/entrenador');



//middleware
app.use(cors());
app.use(express.json()); //req.body


  // Usa las rutas
app.use('/api/deportes', deporteRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/deportistas', deportistaRoutes);
app.use('/api/entrenadores', entrenadorRoutes);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(5000, () => {
    console.log("el servidor inicio en el puerto 5000");
  });