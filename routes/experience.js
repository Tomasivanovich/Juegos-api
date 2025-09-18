const express = require("express");
const router = express.Router();
const db = require("../db");

// ------------------------
// Crear experiencia (Create)
// ------------------------
router.post("/", async (req, res) => {
  const { creator_id, company, role, year_start, year_end, description } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO experience (creator_id, company, role, year_start, year_end, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [creator_id, company, role, year_start, year_end, description]
    );
    res.json({ id: result.insertId, message: "Experiencia creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear experiencia" });
  }
});

// ------------------------
// Leer experiencias por creador (Read)
// ------------------------
router.get("/:creator_id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM experience WHERE creator_id = ?",
      [req.params.creator_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener experiencias" });
  }
});

// ------------------------
// Actualizar experiencia (Update)
// ------------------------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { company, role, year_start, year_end, description } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE experience
       SET company = ?, role = ?, year_start = ?, year_end = ?, description = ?
       WHERE id = ?`,
      [company, role, year_start, year_end, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }

    res.json({ message: "Experiencia actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar experiencia" });
  }
});

// ------------------------
// Eliminar experiencia (Delete)
// ------------------------
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM experience WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }
    res.json({ message: "Experiencia eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar experiencia" });
  }
});

module.exports = router;
