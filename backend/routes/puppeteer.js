import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// 🔹 Función reutilizable
export async function runPuppeteer(url) {
  if (!url) throw new Error("You must provide a URL");

  let browser;
  try {
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',  // Importante para RAM baja
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--no-first-run',
    '--no-zygote',
    '--single-process'
      ],
    };

    // 👇 Solo se usa en Cloud Run donde está configurado
    if (process.env.CHROME_PATH) {
      launchOptions.executablePath = process.env.CHROME_PATH;
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // 🔹 Opcional: bloquear recursos pesados para páginas grandes
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const start = Date.now();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    const end = Date.now();

    const loadTime = end - start;
    const title = await page.title();

    return {
      url,
      title,
      loadTime: `${loadTime} ms`,
    };
  } finally {
    // 🔹 CRÍTICO: Siempre cerrar el browser
    if (browser) {
      await browser.close();
    }
  }
}

// 🔹 Router HTTP
router.post("/", async (req, res) => {
  const { url } = req.body;

  try {
    const result = await runPuppeteer(url);
    res.json(result);
  } catch (error) {
    let userMessage = "Could not analyze the page with Puppeteer :(";
    if (error.message.includes("timeout")) {
      userMessage =
        "The page took too long to load and the analysis was canceled ):";
    } else if (error.message.includes("500")) {
      userMessage =
        "The page server returned an internal error (500) :(";
    } else if (error.message.includes("net::ERR_CONNECTION_RESET")) {
      userMessage = "The connection to the page was interrupted :c";
    }
    res.json({
      url,
      error: true,
      message: `Puppeteer failed: ${error.message}`,
      userMessage,
      title: null,
      loadTime: null,
    });
  }
});

export default router;