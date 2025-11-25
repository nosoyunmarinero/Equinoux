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

    // Función para obtener issues con problemas (score < 1)
    const getIssues = (audits) => {
      const result = {};
      for (const [key, audit] of Object.entries(audits)) {
        // Solo incluir audits con score < 1 (que tienen problemas)
        if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === 'binary') {
          result[key] = {
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue
          };
        }
      }
      return result;
    };

    const issues = {
      accessibility: getIssues({
        "image-alt": report.audits["image-alt"],
        "html-has-lang": report.audits["html-has-lang"],
        "button-name": report.audits["button-name"],
        "color-contrast": report.audits["color-contrast"],
      }),
      seo: getIssues({
        "meta-description": report.audits["meta-description"],
        "viewport": report.audits["viewport"],
        "canonical": report.audits["canonical"],
      }),
      bestPractices: getIssues({
        "uses-https": report.audits["uses-https"],
        "no-vulnerable-libraries": report.audits["no-vulnerable-libraries"],
      }),
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
