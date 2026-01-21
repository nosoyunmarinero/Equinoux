import express from "express";
import puppeteer from "puppeteer";
import axeCore from "axe-core";

const router = express.Router();

// 🔹 Función reutilizable
export async function runAxe(url) {
  if (!url) throw new Error("You must provide a URL");

  let browser; // 👈 Declarar fuera del try
  try {
    browser = await puppeteer.launch({
      headless: 'new', // 👈 Usa el nuevo headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",        // 👈 NUEVO - crítico para RAM baja
        "--disable-gpu",                   // 👈 NUEVO
        "--disable-software-rasterizer",   // 👈 NUEVO
        "--disable-extensions",            // 👈 NUEVO
        "--disable-background-networking", // 👈 NUEVO
        "--disable-background-timer-throttling", // 👈 NUEVO
        "--disable-renderer-backgrounding",// 👈 NUEVO
        "--no-first-run",                  // 👈 NUEVO
        "--no-zygote",                     // 👈 NUEVO
        "--single-process",                // 👈 NUEVO - muy importante
      ],
    });
    
    const page = await browser.newPage();
    
    // 👇 Reduce uso de memoria
    await page.setViewport({ width: 1280, height: 720 }); // 👈 Viewport más pequeño
    await page.setUserAgent('Mozilla/5.0 (compatible; AxeBot/1.0)'); // 👈 Opcional

    await page.goto(url, { 
      waitUntil: "networkidle2", 
      timeout: 30000 
    });
    
    await page.addScriptTag({ content: axeCore.source });

    const results = await page.evaluate(async () => {
      return await axe.run({
        // 👇 Limita las reglas para reducir carga
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'best-practice'] // 👈 Solo las importantes
        }
      });
    });

    await browser.close(); // 👈 Cierra ANTES de return

    return {
      url,
      violations: results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.slice(0, 5).map((n) => n.html), // 👈 Limita a 5 nodos por violación
      })),
      violationsCount: results.violations.length, // 👈 Útil para el frontend
    };
  } catch (error) {
    // 👇 Asegura que cierre incluso en error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
    throw error; // 👈 Re-lanza el error para que lo maneje el router
  }
}

// 🔹 Router HTTP
router.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const result = await runAxe(url);
    res.json(result);
  } catch (error) {
    console.error("Axe error:", error); // 👈 Log para debugging
    
    let userMessage = "Could not run the accessibility audit :(";
    if (error.message.includes("net::ERR_CONNECTION_RESET")) {
      userMessage = "The connection to the page was interrupted during the analysis :c";
    } else if (error.message.includes("timeout")) {
      userMessage = "The page took too long to respond and the analysis was canceled Dx";
    } else if (error.message.includes("Protocol error") || error.message.includes("Target closed")) { // 👈 NUEVO
      userMessage = "The browser ran out of memory during analysis :(";
    } else if (error.message.includes("Navigation failed")) { // 👈 NUEVO
      userMessage = "Could not access the page. Check if the URL is correct :(";
    }

    res.json({
      url,
      error: true,
      message: `Axe failed: ${error.message}`,
      userMessage,
      violations: [],
      violationsCount: 0, // 👈 Consistente con success response
    });
  }
});

export default router;