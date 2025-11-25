import express from "express";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const router = express.Router();

// Endpoint POST
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

    const issues = {
      accessibility: {
        imageAlt: report.audits["image-alt"],
        htmlLang: report.audits["html-has-lang"],
        buttonName: report.audits["button-name"],
        colorContrast: report.audits["color-contrast"],
      },
      seo: {
        metaDescription: report.audits["meta-description"],
        viewport: report.audits["viewport"],
        canonical: report.audits["canonical"],
      },
      bestPractices: {
        https: report.audits["uses-https"],
        vulnerableLibs: report.audits["no-vulnerable-libraries"],
      },
    };

    // 6. Respondemos con JSON
    res.json({
      url,
      performance: report.categories.performance.score,
      accessibility: report.categories.accessibility.score,
      seo: report.categories.seo.score,
      bestPractices: report.categories["best-practices"].score,
      issues,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al ejecutar Lighthouse",
      detalle: error.message,
    });
  }
});

export default router;
