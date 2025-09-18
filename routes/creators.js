const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "clave-super-secreta";

// ------------------------
// Registro de creador
// ------------------------
router.post("/register", async (req, res) => {
  const { name, title, email, password } = req.body;
  try {
    // Validar campos básicos
    if (!name || !title || !email || !password) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Verificar si el email ya existe
    const [existing] = await db.query("SELECT id FROM creator WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO creator (name, title, email, password)
       VALUES (?, ?, ?, ?)`,
      [name, title, email, hashedPassword]
    );

    // Generar token JWT
    const token = jwt.sign({ id: result.insertId, email }, SECRET_KEY, { expiresIn: "2h" });

    // Respuesta consistente con frontend
    res.status(201).json({
      message: "Creador registrado con éxito",
      token,
      creator: { id: result.insertId, name, email }
    });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error al registrar creador" });
  }
});

// ------------------------
// Login de creador
// ------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM creator WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const creator = rows[0];
    const isValid = await bcrypt.compare(password, creator.password);

    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: creator.id, email: creator.email }, SECRET_KEY, { expiresIn: "2h" });

    res.json({
      message: "Login exitoso",
      token,
      creator: { id: creator.id, name: creator.name, email: creator.email }
    });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ------------------------
// Obtener todos los creadores
// ------------------------
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, title, email FROM creator");
    res.json(rows);
  } catch (err) {
    console.error("Error en GET /creators:", err);
    res.status(500).json({ error: "Error al obtener creadores" });
  }
});

// ------------------------
// Obtener un creador por ID
// ------------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM creator WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Creador no encontrado" });
    }

    const { password, ...creatorData } = rows[0];
    res.json(creatorData);
  } catch (err) {
    console.error("Error en GET /:id:", err);
    res.status(500).json({ error: "Error al obtener creador" });
  }
});

// ------------------------
// Actualizar datos de un creador
// ------------------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, bio, profile_image, email, password, phone, linkedin, github } = req.body;

  try {
    let query = `UPDATE creator SET name=?, title=?, bio=?, profile_image=?, email=?, phone=?, linkedin=?, github=?`;
    const values = [name, title, bio, profile_image, email, phone, linkedin, github];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password=?`;
      values.push(hashedPassword);
    }

    query += ` WHERE id=?`;
    values.push(id);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Creador no encontrado" });
    }

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    console.error("Error en PUT /:id:", err);
    res.status(500).json({ error: "Error al actualizar creador" });
  }
});

// ------------------------
// Endpoint /me para obtener datos del creador autenticado
// ------------------------
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const creatorId = decoded.id;

    const [rows] = await db.query("SELECT * FROM creator WHERE id = ?", [creatorId]);

    if (rows.length === 0) return res.status(404).json({ error: "Creador no encontrado" });

    const { password, ...creatorData } = rows[0];
    res.json(creatorData);
  } catch (err) {
    console.error("Error en GET /me:", err);
    res.status(401).json({ error: "Token inválido" });
  }
});

module.exports = router;
