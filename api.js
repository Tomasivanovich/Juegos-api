const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const puntajesRoutes = require("./routes/puntajes");

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/puntajes", puntajesRoutes);

module.exports = app;
