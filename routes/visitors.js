const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta-visitante";

// 🔹 Registro visitante
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO visitors (email, password) VALUES (?, ?)",
      [email, hashed]
    );
    res.json({ id: result.insertId, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar visitante" });
  }
});

// 🔹 Login visitante
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM visitors WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Email no registrado" });

    const visitor = rows[0];
    const match = await bcrypt.compare(password, visitor.password);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: visitor.id, email: visitor.email }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ token, visitor: { id: visitor.id, email: visitor.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
