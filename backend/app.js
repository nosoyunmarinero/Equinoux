import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Ruta raíz para probar que el backend funciona
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor backend corriendo 🚀", status: "ok" });
});

// Importar rutas
import fullAnalysisRoute from "./routes/fullAnalysis.js";
import analyzeRoute from "./routes/analyze.js";
import puppeteerRoute from "./routes/puppeteer.js";
import axeRoute from "./routes/axe.js";

// Usar rutas
app.use("/full-analysis", fullAnalysisRoute);
app.use("/analyze", analyzeRoute);
app.use("/puppeteer", puppeteerRoute);
app.use("/axe", axeRoute);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
