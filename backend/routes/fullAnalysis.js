import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Debes enviar una URL en el Body" });
  }

  try {
    // Llamadas INDIVIDUALES para identificar cuál falla
    console.log("🔍 Iniciando análisis de:", url);

    console.log("⚡ Llamando a Lighthouse...");
    const lighthouseRes = await axios.post("http://localhost:3001/analyze", { url });
    console.log("✅ Lighthouse completado");

    console.log("⚡ Llamando a Puppeteer...");
    const puppeteerRes = await axios.post("http://localhost:3001/puppeteer", { url });
    console.log("✅ Puppeteer completado");

    console.log("⚡ Llamando a Axe...");
    const axeRes = await axios.post("http://localhost:3001/axe", { url });
    console.log("✅ Axe completado");

    // Combinar resultados
    res.json({
      url,
      lighthouse: lighthouseRes.data,
      puppeteer: puppeteerRes.data,
      axe: axeRes.data,
    });
  } catch (error) {
    // Mejor detalle del error
    console.error("❌ Error en full-analysis:", error.message);
    console.error("📍 URL que falló:", error.config?.url);
    console.error("📦 Respuesta del servidor:", error.response?.data);
    
    res.status(500).json({
      error: "Error en el análisis combinado",
      detalle: error.message,
      endpointFallido: error.config?.url,
      errorDelServidor: error.response?.data
    });
  }
});

export default router;