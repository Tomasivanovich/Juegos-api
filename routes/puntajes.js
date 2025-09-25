// routes/puntajes.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los puntajes
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM puntajes");
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// Guardar puntaje de usuario
router.post("/", async (req, res) => {
  try {
    const { usuario_id, nombre, password, juego_id, puntaje_jugador, nivel_maximo } = req.body;

    // Validación: debe venir nombre o usuario_id y juego_id
    if ((!nombre && !usuario_id) || !juego_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios: nombre o usuario_id y juego_id" });
    }

    let finalUsuarioId = usuario_id;

    // Si no hay usuario_id, crear o verificar usuario por nombre
    if (!finalUsuarioId) {
      const [users] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
      if (users.length > 0) {
        finalUsuarioId = users[0].id;
      } else {
        const [result] = await db.query(
          "INSERT INTO usuarios (nombre, password) VALUES (?, ?)",
          [nombre, password || null]
        );
        finalUsuarioId = result.insertId;
      }
    }

    // Insertar puntaje
    await db.query(
      `INSERT INTO puntajes (usuario_id, juego_id, puntaje_maximo, puntaje_jugador, nivel_maximo)
       VALUES (?, ?, ?, ?, ?)`,
      [finalUsuarioId, juego_id, puntaje_jugador, puntaje_jugador, nivel_maximo || 1]
    );

    res.json({ message: "Usuario y puntaje guardado", usuarioId: finalUsuarioId });
  } catch (err) {
    console.error("Error guardando puntaje:", err, req.body);
    res.status(500).json({ error: "No se pudo guardar el puntaje" });
  }
});

module.exports = router;
