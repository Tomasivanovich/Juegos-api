// server.js
const app = require("./api");

// Render asigna el puerto dinámicamente mediante process.env.PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});