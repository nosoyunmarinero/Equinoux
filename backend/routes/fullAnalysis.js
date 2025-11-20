const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Debes enviar una URL en el Body" });
  }

  try {
    // Llamadas internas a tus endpoints
    const [lighthouseRes, puppeteerRes, axeRes] = await Promise.all([
      axios.post("http://localhost:3001/analyze", { url }),
      axios.post("http://localhost:3001/puppeteer", { url }),
      axios.post("http://localhost:3001/axe", { url }),
    ]);

    // Combinar resultados
    res.json({
      url,
      lighthouse: lighthouseRes.data,
      puppeteer: puppeteerRes.data,
      axe: axeRes.data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el análisis combinado",
      detalle: error.message,
    });
  }
});

module.exports = router;
