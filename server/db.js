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

/*const pool = new Pool({
    user: 'postgres.bsexqceevxgljnvydoxj',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    database: 'postgres',
    password: 'BRXghMbdJXCdqLAO',
    port: 6543,
  });*/

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