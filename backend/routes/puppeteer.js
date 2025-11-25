import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// Endpoint POST Puppeteer
router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Debes enviar una URL en el Body" });
  }

  try {
    // 1. Lanzamos el navegador
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 2. Medimos tiempo de carga
    const start = Date.now(); // tiempo inicial
    await page.goto(url, { waitUntil: "networkidle2" });
    const end = Date.now(); // tiempo final

    const loadTime = end - start; // diferencia en milisegundos

    // 3. Extraemos información
    const title = await page.title();

    // 4. Cerramos navegador
    await browser.close();

    // 5. Respondemos con JSON
    res.json({
      url,
      title,
      loadTime: `${loadTime} ms`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al ejecutar Puppeteer",
      detalle: error.message,
    });
  }
});

export default router;
