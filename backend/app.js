import express from "express";
import cors from "cors";

const app = express();

// 1) Puerto dinámico para Cloud Run, fallback local
const PORT = process.env.PORT || 3000;

// 2) CORS: permite dev y producción (GH Pages)
const allowedOrigins = [
  "http://localhost:3000",
  "https://nosoyunmarinero.github.io"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// Ruta raíz para verificar
app.get("/", (req, res) => {
  res.json({ mensaje: "Servidor backend corriendo :D", status: "ok" });
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

// Healthcheck opcional (útil para monitoreo)
app.get("/health", (req, res) => res.status(200).send("ok"));

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
