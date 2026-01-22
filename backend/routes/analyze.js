import express from "express";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import os from "os";

const router = express.Router();

// 🔹 Función reutilizable
export async function runAnalysis(url) {
  if (!url) throw new Error("You must provide a URL");

  let chrome;
  try {
   // const isProduction = process.env.NODE_ENV === 'production';
    // const platform = os.platform();
    
    const launchOptions = {
      chromeFlags: [
        "--headless",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",  
        "--disable-extensions",            
        "--disable-background-networking", 
        "--no-first-run",                  
        "--no-zygote",                     
        "--single-process",                
        "--disable-web-security"           
      ]
    };

    // 👇 ELIMINADO - deja que chrome-launcher lo encuentre solo
    // if (isProduction || platform === 'linux') {
    //   launchOptions.chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';
    // }

    chrome = await chromeLauncher.launch(launchOptions);
    
    const options = { 
      port: chrome.port, 
      output: "json", 
      logLevel: "error",
      onlyCategories: ['performance', 'accessibility'],
      disableStorageReset: true,
      throttlingMethod: 'simulate',
      screenEmulation: { disabled: true },
      formFactor: 'desktop', 
      maxWaitForLoad: 30000,
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
    };

    // 👇 ERROR ARREGLADO - faltaba "issues" en el return
    return {
      url,
      performance: report.categories?.performance?.score ?? null,
      accessibility: report.categories?.accessibility?.score ?? null,
      issues, // 👈 ESTO ESTABA COMENTADO Y CAUSABA ERROR
    };
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (killError) {
        console.error("Error killing Chrome:", killError);
      }
    }
  }
}

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
    } else if (error.message.includes("Protocol error")) {
      userMessage = "Chrome ran out of memory :(";
    } else if (error.message.includes("ENOENT")) { // 👈 NUEVO
      userMessage = "Chromium is not installed on the server :(";
    }

    res.json({
      url,
      error: true,
      message: `Lighthouse failed: ${error.message}`,
      userMessage,
      performance: null,
      accessibility: null,
      issues: {},
    });
  }
});

export default router;