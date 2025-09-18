const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas existentes
const creatorsRoutes = require("./routes/creators");
const experienceRoutes = require("./routes/experience");
const projectsRoutes = require("./routes/projects");
const skillsRoutes = require("./routes/skills");

// Rutas de visitantes
const visitorsRoutes = require("./routes/visitors");
const portfolioRoutes = require("./routes/portafolio"); // para ver portafolios y registrar visitas

// Uso de rutas
app.use("/api/creators", creatorsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);

app.use("/api/visitors", visitorsRoutes);   // Registro / Login visitantes
app.use("/api/portfolio", portfolioRoutes); // Solo lectura y registro de visitas

// Levantar servidor
app.listen(4000, () => {
  console.log("✅ Servidor API corriendo en http://localhost:4000");
});
