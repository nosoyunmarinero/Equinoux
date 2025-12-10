import express from "express";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const router = express.Router();

// 🔹 Función reutilizable
export async function runAnalysis(url) {
  if (!url) throw new Error("You must provide a URL");

  let chrome;
  try {
    // 🔹 CRÍTICO: Agregar flags para Cloud Run y especificar chromePath
    chrome = await chromeLauncher.launch({ 
      chromeFlags: [
        "--headless",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      chromePath: process.env.CHROME_PATH || '/usr/bin/chromium'
    });
    
    const options = { 
      port: chrome.port, 
      output: "json", 
      logLevel: "info",
      onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices']
    };
    
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;

    const getIssues = (audits) => {
      const result = {};
      for (const [key, audit] of Object.entries(audits)) {
        if (!audit) continue;
        if (
          audit.score !== null &&
          audit.score < 1 &&
          audit.scoreDisplayMode === "binary"
        ) {
          result[key] = {
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue,
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
        viewport: report.audits["viewport"],
        canonical: report.audits["canonical"],
      }),
      bestPractices: getIssues({
        "uses-https": report.audits["uses-https"],
        "no-vulnerable-libraries": report.audits["no-vulnerable-libraries"],
      }),
    };

    return {
      url,
      performance: report.categories?.performance?.score ?? null,
      accessibility: report.categories?.accessibility?.score ?? null,
      seo: report.categories?.seo?.score ?? null,
      bestPractices: report.categories?.["best-practices"]?.score ?? null,
      issues,
    };
  } finally {
    // 🔹 CRÍTICO: Siempre cerrar Chrome, incluso si hay error
    if (chrome) {
      try {
        await chrome.kill();
      } catch (killError) {
        console.error("Error killing Chrome:", killError);
      }
    }
  }
}

// 🔹 Router HTTP (sigue funcionando igual)
router.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const result = await runAnalysis(url);
    res.json(result);
  } catch (error) {
    console.error("Lighthouse error:", error);
    
    let userMessage = "Could not run Lighthouse :(.";
    if (error.message.includes("timeout")) {
      userMessage = "The page took too long to load and Lighthouse was canceled :(";
    } else if (error.message.includes("score")) {
      userMessage = "The Lighthouse report did not return complete data :(";
    } else if (error.message.includes("ECONNREFUSED")) {
      userMessage = "Could not connect to Chrome browser :(";
    }

    res.json({
      url,
      error: true,
      message: `Lighthouse failed: ${error.message}`,
      userMessage,
      performance: null,
      accessibility: null,
      seo: null,
      bestPractices: null,
      issues: {},
    });
  }
});

export default router;