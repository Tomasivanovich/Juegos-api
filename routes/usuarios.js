const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// Crear usuario
router.post("/", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    // Verificar si ya existe
    const [existing] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
    if (existing.length > 0) return res.status(409).json({ error: "Usuario ya existe", user: existing[0] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, password) VALUES (?, ?)",
      [nombre, hashedPassword]
    );
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener usuarios (solo id y nombre)
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, nombre FROM usuarios");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const [users] = await db.query("SELECT * FROM usuarios WHERE nombre = ?", [nombre]);
    if (users.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({ id: user.id, nombre: user.nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
