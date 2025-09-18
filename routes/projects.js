const express = require('express');
const router = express.Router();
const db = require('../db');

console.log("⚡ Routes /api/projects cargadas");

// ------------------------
// Crear proyecto (Create)
// ------------------------
router.post('/', async (req, res) => {
    const { creator_id, title, description, image, link } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO projects (creator_id, title, description, image, link)
             VALUES (?, ?, ?, ?, ?)`,
            [creator_id, title, description, image, link]
        );
        res.json({ id: result.insertId, message: "Proyecto creado correctamente" });
    } catch (err) {
        console.error("Error al crear proyecto:", err);
        res.status(500).json({ error: 'Error al crear proyecto' });
    }
});

// ------------------------
// Leer proyectos por creador (Read)
// ------------------------
router.get('/:creator_id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM projects WHERE creator_id = ?',
            [req.params.creator_id]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener proyectos:", err);
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
});

// ------------------------
// Actualizar proyecto (Update)
// ------------------------
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, image, link } = req.body;
    try {
        const [result] = await db.query(
            `UPDATE projects
             SET title = ?, description = ?, image = ?, link = ?
             WHERE id = ?`,
            [title, description, image, link, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.json({ message: "Proyecto actualizado correctamente" });
    } catch (err) {
        console.error("Error al actualizar proyecto:", err);
        res.status(500).json({ error: "Error al actualizar proyecto" });
    }
});

// ------------------------
// Eliminar proyecto (Delete)
// ------------------------
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }
        res.json({ message: "Proyecto eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar proyecto:", err);
        res.status(500).json({ error: "Error al eliminar proyecto" });
    }
});

module.exports = router;