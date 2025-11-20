const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Ruta raíz para probar que el backend funciona
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor backend corriendo 🚀", status: "ok" });
});

//Import de Analize
const analyzeRoute = require("./routes/analyze");
app.use("/analyze", analyzeRoute);

// Import Puppeteer
const puppeteerRoute = require("./routes/puppeteer");
app.use("/puppeteer", puppeteerRoute);

// Axe Core
const axeRoute = require("./routes/axe");
app.use("/axe", axeRoute);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
