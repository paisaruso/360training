const express = require("express");
const router = express.Router();
const pool = require("../db"); // Asegúrate de tener la conexión a la base de datos configurada

// Obtener todas las rutinas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Rutina");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Crear nueva rutina
router.post("/", async (req, res) => {
  const { nombre, descripcion, duracion, frecuencia_semanal, objetivo } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Rutina (nombre, descripcion, duracion, frecuencia_semanal, objetivo) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, duracion, frecuencia_semanal, objetivo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Obtener rutina por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM Rutina WHERE id_rutina = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Rutina no encontrada" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Actualizar rutina por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, duracion, frecuencia_semanal, objetivo } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE Rutina SET nombre = $2, descripcion = $3, duracion = $4, frecuencia_semanal = $5, objetivo = $6
       WHERE id_rutina = $1 RETURNING *`,
      [id, nombre, descripcion, duracion, frecuencia_semanal, objetivo]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Rutina no encontrada" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Eliminar rutina por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM Rutina WHERE id_rutina = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Rutina no encontrada" });
    res.status(200).json({ message: "Rutina eliminada", data: result.rows[0] });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

module.exports = router;
