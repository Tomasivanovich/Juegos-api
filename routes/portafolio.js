const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta-visitante";

// Middleware de autenticación visitante
function authVisitor(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    req.visitor = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// 🔹 Buscar portafolio por email del creador
router.get("/:email", authVisitor, async (req, res) => {
  const visitorId = req.visitor.id;
  try {
    const [creators] = await db.query("SELECT * FROM creator WHERE email = ?", [req.params.email]);
    if (creators.length === 0) return res.status(404).json({ error: "Creador no encontrado" });
    const creator = creators[0];

    // Obtener experiencia, proyectos y skills
    const [experience] = await db.query("SELECT * FROM experience WHERE creator_id = ?", [creator.id]);
    const [projects] = await db.query("SELECT * FROM projects WHERE creator_id = ?", [creator.id]);
    const [skills] = await db.query("SELECT * FROM skills WHERE creator_id = ?", [creator.id]);

    // Registrar la visita
    await db.query("INSERT INTO visits (visitor_id, creator_id) VALUES (?, ?)", [visitorId, creator.id]);

    res.json({ creator, experience, projects, skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener portafolio" });
  }
});

module.exports = router;
