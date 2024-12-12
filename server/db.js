require('dotenv').config();

// Importa el cliente de PostgreSQL
const Pool = require('pg').Pool;



const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Verifica la conexión (opcional)
pool.connect((err, client, release) => {
    if (err) {
        console.log('PGPORT:', process.env.PGPORT);

      return console.error('Error adquiriendo cliente', err.stack);
    }
    console.log('Conexión exitosa a la base de datos');
    release();
  });
  
  module.exports = pool;