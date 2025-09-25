const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const puntajesRoutes = require("./routes/puntajes");

const app = express();

// Middleware
app.use(express.json());

// CORS
// Permite todos los orígenes (para desarrollo)
// Para producción, reemplazar "*" por la URL de tu frontend
app.use(cors({
  origin: "*"
}));

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/puntajes", puntajesRoutes);

module.exports = app;