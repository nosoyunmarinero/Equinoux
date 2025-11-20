const express = require("express");
const puppeteer = require("puppeteer");
const axeCore = require("axe-core");

const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Debes enviar una URL en el Body" });
  }

  try {
    // 1. Lanzamos navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 2. Navegamos a la URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // 3. Inyectamos axe-core en la página
    await page.addScriptTag({ content: axeCore.source });

    // 4. Ejecutamos auditoría de accesibilidad
    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    await browser.close();

    // 5. Respondemos con JSON
    res.json({
      url,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n) => n.html),
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al ejecutar axe-core", detalle: error.message });
  }
});

module.exports = router;
