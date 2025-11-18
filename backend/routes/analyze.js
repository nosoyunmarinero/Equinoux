const express = require("express");
const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse").default;

const router = express.Router();

//Endpoint POST 
router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Debes enviar una URL en el Body" });
  }

  try {
    // 1. Lanzamos Chrome en modo headless
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

    // 2. Configuramos opciones para Lighthouse
    const options = { port: chrome.port, output: "json", logLevel: "info" };

    // 3. Ejecutamos Lighthouse sobre la URL
    const runnerResult = await lighthouse(url, options);

    // 4. Cerramos Chrome
    await chrome.kill();

    // 5. Extraemos resultados principales
    const report = runnerResult.lhr;

    // 6. Respondemos con JSON
    res.json({
      url,
      performance: report.categories.performance.score,
      accessibility: report.categories.accessibility.score,
      seo: report.categories.seo.score,
      bestPractices: report.categories["best-practices"].score
    });
  } catch (error) {
    res.status(500).json({ error: "Error al ejecutar Lighthouse", detalle: error.message });
  }
});

module.exports = router;