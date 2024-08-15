require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require('./db'); // Importa la configuración de la base de datos


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


app.listen(5000, () => {
    console.log("el servidor inicio en el puerto 5000");
  });