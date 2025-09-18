const express = require('express');
const router = express.Router();
const db = require('../db');

console.log("⚡ Routes /api/skills cargadas");

// ------------------------
// Crear skill (Create)
// ------------------------
router.post('/', async (req, res) => {
    const { creator_id, name, level } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO skills (creator_id, name, level)
             VALUES (?, ?, ?)`,
            [creator_id, name, level]
        );
        res.json({ id: result.insertId, message: "Skill creada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear skill' });
    }
});

// ------------------------
// Leer skills por creador (Read)
// ------------------------
router.get('/:creator_id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM skills WHERE creator_id = ?',
            [req.params.creator_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener skills' });
    }
});

// ------------------------
// Actualizar skill (Update)
// ------------------------
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, level } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE skills SET name = ?, level = ? WHERE id = ?',
            [name, level, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Skill no encontrada" });
        }
        res.json({ message: "Skill actualizada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al actualizar skill" });
    }
});

// ------------------------
// Eliminar skill (Delete)
// ------------------------
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM skills WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Skill no encontrada" });
        }
        res.json({ message: "Skill eliminada correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar skill" });
    }
});

module.exports = router;
