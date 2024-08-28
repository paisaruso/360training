const request = require('supertest');
const express = require('express');
const app = express();
const pool = require('../db');
const usuarioRoutes = require('../api/usuario'); // Asegúrate de que esta ruta sea correcta

app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

describe('Usuarios API', () => {
  // Ejecuta antes de cada prueba para asegurarte de que la base de datos esté limpia
  beforeEach(async () => {
    await pool.query('DELETE FROM Usuarios');
  });

  test('Debería crear un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/usuarios')
      .send({
        nombre: 'Juan',
        correo_electronico: 'juan@example.com',
        contrasena: 'password123',
        tipo_usuario: 'deportista'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('nombre', 'Juan');
    expect(response.body).toHaveProperty('correo_electronico', 'juan@example.com');
  });

  test('Debería obtener todos los usuarios', async () => {
    await pool.query('INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario) VALUES ($1, $2, $3)', ['Juan', 'juan@example.com', 'deportista']);

    const response = await request(app).get('/api/usuarios');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('nombre', 'Juan');
  });

  test('Debería obtener un usuario por ID', async () => {
    const result = await pool.query('INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario) VALUES ($1, $2, $3) RETURNING id_usuario', ['Juan', 'juan@example.com', 'deportista']);
    const userId = result.rows[0].id_usuario;

    const response = await request(app).get(`/api/usuarios/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nombre', 'Juan');
  });

  test('Debería actualizar un usuario', async () => {
    const result = await pool.query('INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario) VALUES ($1, $2, $3) RETURNING id_usuario', ['Juan', 'juan@example.com', 'deportista']);
    const userId = result.rows[0].id_usuario;

    const response = await request(app)
      .put(`/api/usuarios/${userId}`)
      .send({
        nombre: 'Juan Updated',
        correo_electronico: 'juanupdated@example.com',
        tipo_usuario: 'entrenador'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nombre', 'Juan Updated');
  });

  test('Debería eliminar un usuario', async () => {
    const result = await pool.query('INSERT INTO Usuarios (nombre, correo_electronico, tipo_usuario) VALUES ($1, $2, $3) RETURNING id_usuario', ['Juan', 'juan@example.com', 'deportista']);
    const userId = result.rows[0].id_usuario;

    const response = await request(app).delete(`/api/usuarios/${userId}`);

    expect(response.statusCode).toBe(204);

    const deletedUserResponse = await request(app).get(`/api/usuarios/${userId}`);
    expect(deletedUserResponse.statusCode).toBe(404);
  });
});
